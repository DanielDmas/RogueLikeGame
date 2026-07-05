// Text catalog resolver — the backbone of multi-version, multi-language text.
//
// Design: the room/usher/ending/UI source files carry the *v2 English* text
// inline (v2 is the default voice). Everything else — v1 English (the
// original voice, preserved verbatim as a selectable "backup"), and Czech and
// Farsi translations of both versions — is registered here as an overlay
// keyed by a stable string key. Lookups fall back gracefully: an untranslated
// string quietly resolves to the closest available variant instead of
// breaking, so the catalog can be filled in incrementally.

export type Lang = 'en' | 'cs' | 'fa';
export type TextVersion = 'v1' | 'v2';

export const LANGS: Lang[] = ['en', 'cs', 'fa'];
export const VERSIONS: TextVersion[] = ['v1', 'v2'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OverrideValue = string | ((s: any) => string);
type LangMap = Partial<Record<Lang, OverrideValue>>;
type VersionMap = Partial<Record<TextVersion, LangMap>>;

const overrides = new Map<string, VersionMap>();

let currentLang: Lang = 'en';
let currentVersion: TextVersion = 'v2';

export function setLocale(lang: Lang, version: TextVersion) {
  currentLang = lang;
  currentVersion = version;
}

export function getLocale(): { lang: Lang; version: TextVersion } {
  return { lang: currentLang, version: currentVersion };
}

/** Registers one (key, version, lang) variant. Called at module load from the per-language packs. */
export function register(key: string, version: TextVersion, lang: Lang, value: OverrideValue): void {
  let vm = overrides.get(key);
  if (!vm) {
    vm = {};
    overrides.set(key, vm);
  }
  let lm = vm[version];
  if (!lm) {
    lm = {};
    vm[version] = lm;
  }
  lm[lang] = value;
}

/** Bulk-register a flat `{ key: text }` map for one (version, lang). */
export function registerAll(version: TextVersion, lang: Lang, entries: Record<string, OverrideValue>): void {
  for (const key of Object.keys(entries)) register(key, version, lang, entries[key]);
}

function lookup(key: string, version: TextVersion, lang: Lang): OverrideValue | undefined {
  return overrides.get(key)?.[version]?.[lang];
}

/**
 * Resolves a key to display text for the current locale, degrading gracefully:
 * exact (version, lang) -> same version, English -> same language, other version
 * -> other version, English -> the inline v2-English fallback the caller supplied.
 * `v2`/`en` is intentionally never registered (that variant lives directly in
 * the source as `fallback`), so that lookup always falls through by design.
 */
export function t(key: string, fallback: string | ((s: unknown) => string), state?: unknown): string {
  const seq: [TextVersion, Lang][] =
    currentVersion === 'v1'
      ? [
          ['v1', currentLang],
          ['v1', 'en'],
          ['v2', currentLang],
        ]
      : [
          ['v2', currentLang],
          ['v1', currentLang],
          ['v1', 'en'],
        ];
  for (const [v, l] of seq) {
    if (v === 'v2' && l === 'en') continue;
    const val = lookup(key, v, l);
    if (val !== undefined) return typeof val === 'function' ? val(state) : val;
  }
  return typeof fallback === 'function' ? fallback(state) : fallback;
}

/** Replaces `{token}` placeholders (e.g. persona name) in already-resolved display text. */
export function applyTokens(text: string, tokens: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (m, key: string) => tokens[key] ?? m);
}

/** Test-only: clears all registered overrides between test files. */
export function __resetRegistry(): void {
  overrides.clear();
}
