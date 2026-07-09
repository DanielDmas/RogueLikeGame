import { describe, expect, it, afterEach } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import '../content/text';
import { setLocale, t } from '../engine/text/resolver';
import { uiKey } from '../engine/text/keys';

/**
 * Statically scans every `uiKey('literal')` call under src/ui, src/engine,
 * and src/content (excluding the translation packs themselves) and asserts
 * each resolves to something other than the English fallback in both Czech
 * and Farsi. Any new hardcoded-but-wrapped-in-t() string added by a future
 * change is caught here automatically — no manual list to keep in sync,
 * unlike the room-by-room translationCoverage test.
 */
function findTsFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'text') continue; // the translation packs themselves
    const full = join(dir, entry.name);
    if (entry.isDirectory()) findTsFiles(full, out);
    else if (entry.name.endsWith('.ts')) out.push(full);
  }
  return out;
}

// Keys only ever rendered behind `pack.advisory` (spec 10-safety-education-
// charter.md §2) — currently LIMERENCE-only content, statically present in
// the shared src/ui/overlays.ts source (so the scan below finds them) but
// never reachable in an ANAMNESIS build (`pack.advisory` is undefined there,
// see packs/anamnesis/index.ts) and therefore correctly absent from
// ANAMNESIS's own cs/fa/de/fr catalogs. LIMERENCE itself has no translations
// yet (Czech is milestone L6, not started — see UPGRADE_PLAN.md); this test
// is scoped to ANAMNESIS's translation coverage, not a generic per-pack
// check, so these are excluded here rather than papered over with fake
// translations that would never actually be shown to anyone.
const PACK_CONDITIONAL_KEYS = new Set([
  'aboutPurpose',
  'aboutMechanics',
  'aboutThemes',
  'aboutMinorsNote',
  'aboutFictionNote',
  'aboutHelpLine',
  'aboutNoTelemetry',
]);

function scanUiKeys(): Set<string> {
  const roots = ['src/ui', 'src/engine', 'src/content'].map((d) => resolve(__dirname, '../..', d));
  const keys = new Set<string>();
  for (const root of roots) {
    for (const file of findTsFiles(root)) {
      const src = readFileSync(file, 'utf-8');
      for (const m of src.matchAll(/uiKey\('([^']+)'\)/g)) keys.add(m[1]);
    }
  }
  // the one dynamic uiKey(k) call site (overlays.ts, persona "about" blurbs)
  // iterates this fixed, statically-known array — add it explicitly.
  keys.add('persona.about1');
  keys.add('persona.about2');
  keys.add('persona.about3');
  return keys;
}

const LANGS = ['cs', 'fa', 'de', 'fr'] as const;
const scannedKeys = scanUiKeys();
const allKeys = [...scannedKeys].filter((k) => !PACK_CONDITIONAL_KEYS.has(k));

describe('uiKey coverage — every ui.* string actually used in the app is translated', () => {
  afterEach(() => setLocale('en', 'v2'));

  it('found a sane number of keys (sanity check the scan itself is working)', () => {
    expect(allKeys.length).toBeGreaterThan(60);
  });

  it('PACK_CONDITIONAL_KEYS has no stale entries — every excluded key is still actually used somewhere', () => {
    const stale = [...PACK_CONDITIONAL_KEYS].filter((k) => !scannedKeys.has(k));
    expect(stale, `excluded but no longer found in source: ${stale.join(', ')}`).toEqual([]);
  });

  for (const lang of LANGS) {
    it(`every used ui.* key resolves to non-English text in ${lang}`, () => {
      setLocale(lang, 'v2');
      const missing: string[] = [];
      for (const key of allKeys) {
        const fallback = `__missing_${key}__`;
        const resolved = t(uiKey(key), fallback);
        if (resolved === fallback) missing.push(key);
      }
      expect(missing, `missing ${lang} translations for: ${missing.join(', ')}`).toEqual([]);
    });
  }
});
