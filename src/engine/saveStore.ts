import type { RunState, TranscriptEntry } from './schema';
import type { Lang } from './text/resolver';

export interface Settings {
  typewriter: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  quality: 'low' | 'high';
  music: boolean;
  sfx: boolean;
  /** 0–1. Only audible while its `music`/`sfx` toggle above is on. */
  musicVolume: number;
  sfxVolume: number;
  textVersion: 'v1' | 'v2';
  language: Lang;
  dynamicScenery: boolean;
  /** Render resolution scale — independent of `quality` (which only controls AA/bloom). */
  renderScale: 'performance' | 'standard' | 'sharp';
  /** 0.8–1.3, scales the 2D UI layer (not the 3D canvas). */
  uiZoom: number;
  /** Default offered by the opt-in panel at the start of each new run (spec
   * 05) — editing this in Settings never touches the current run's own
   * `RunState.examined` flag, only what gets pre-selected next time. */
  examinedPathDefault: boolean;
  /** UI chrome light/dark skin — only has a visible effect for packs whose
   * `visuals.supportsLightTheme` is true; ANAMNESIS ignores it and keeps
   * its single fitting tone. */
  theme: 'dark' | 'light';
  /** 1.3.2: caps the 3D render loop's frame rate, independent of `quality`
   * (AA/bloom only) — a fog-and-text game reads fine at 30fps, and it's the
   * single biggest remaining GPU-load lever after `quality`/`renderScale`. */
  fpsCap: 30 | 60;
  /** F2: narration playback — only ever has an audible effect once a pack's
   * manifest actually has voice files; the Settings row itself stays hidden
   * until then (`voiceover.packHasAnyVoice()`), so these fields sit dormant
   * on every save until that day. */
  narrationEnabled: boolean;
  /** 0–1. Only audible while narrationEnabled is on. */
  narrationVolume: number;
}

/** Cosmetic only — no mechanical effect. Empty name means "not chosen yet". */
export interface Persona {
  preset: string;
  name: string;
  blurb: string;
}

/** Bump this, write a migration in `localSave.ts`, and add a fixture test
 * with a captured pre-change payload (docs/development README convention 9)
 * whenever a persisted `Profile`/`RunState` field is renamed or re-typed —
 * never for a purely additive, optional field (those survive spread-merge
 * for free). */
export const PROFILE_SCHEMA_VERSION = 1;

export interface Profile {
  /** Bumped only on a breaking rename/re-type, never on additive fields. */
  schemaVersion: number;
  /** in-progress run, if any */
  run: RunState | null;
  /** persistent Field Notes codex (room ids + ending note ids) */
  codexUnlocked: string[];
  /** endings seen */
  endingsSeen: string[];
  /** the sentence sent in Room 19, kept as its codex entry */
  lastMessage: string | null;
  runsCompleted: number;
  settings: Settings;
  persona: Persona;
  /** Whether the player has already seen the one-time first-heart-loss explanation. */
  hasSeenHeartLoss: boolean;
  /** Whether the player has ever seen the "Before you begin" explainer
   * (why-play/hearts/doors) — shown automatically, once, the very first time
   * a new run starts, so no one begins not knowing what the game is or why
   * (non-negotiable). The manual "Before you begin" button in the title menu
   * remains available afterward for anyone who wants to reread it. */
  hasSeenAbout: boolean;
  /** Snapshot of the most recently finished run — feeds `RunState.prior` for
   * rooms that remember the previous run (e.g. `the-cave`). Written in
   * `Game.playEnding` just before the profile is persisted. Optional: absent
   * before the player's first completed run, or on legacy saves. */
  lastRunTranscript?: TranscriptEntry[];
  lastRunEndingId?: string | null;
  /** Keepsakes ever earned (ids from `KEEPSAKES` in `content/keepsakes.ts`).
   * Never removed. A keepsake earned mid-run only becomes "held"
   * (`RunState.keepsakesHeld`) from the next run — see gameState.ts's `newRun`. */
  keepsakes: string[];
  /** Ids of keepsake-gated choices actually taken, ever — feeds the seventh
   * ending's unlock predicate (spec 03). Deduped; never removed. */
  keepsakeChoicesTaken: string[];
  /** Lifetime hearts lost, across every run — a Ledger stat only (spec 06);
   * never read by any gameplay predicate. */
  heartsLost: number;
  /** Per-room completion counts, incremented once per actual room
   * completion (never on a quit-and-resume replay of the same room) —
   * feeds the Ledger's "most-walked door" stat and one epiphany. Ledger-only. */
  roomVisits: Record<string, number>;
  /** Completed descents into the Understory (spec 02), lifetime. Ledger-only. */
  understoryDescents: number;
  /** Completed runs taken on the Examined Path (spec 05), lifetime. Ledger-only. */
  examinedRuns: number;
  /** Epiphany ids earned, in earn order — never removed. Ledger-only;
   * displayed, never read by any gameplay predicate. */
  epiphanies: string[];
  /** Every `${roomId}:${choiceId}` ever taken, across every finished run,
   * deduped (first-earned order) — never removed. Ledger-only; feeds
   * epiphany predicates that need to look further back than the just-
   * finished run or the single `lastRunTranscript` snapshot (e.g. "have you
   * ever, in any run, chosen to walk away"). Never read by any gameplay
   * predicate — same hard guarantee as the other Ledger-only fields. */
  choiceHistory: string[];
}

export function defaultProfile(): Profile {
  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    run: null,
    codexUnlocked: [],
    endingsSeen: [],
    lastMessage: null,
    runsCompleted: 0,
    settings: {
      typewriter: true,
      reducedMotion:
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
      highContrast: false,
      // 1.3: new profiles default to the floor tier — plain renderer (no
      // bloom composer), 0.75x DPR, 30fps — so the game runs on a decade-old
      // GPU without configuration. "Cinematic" (quality: 'high', standard
      // render scale, 60fps) is an opt-in the player can pick in Settings.
      quality: 'low',
      music: true,
      sfx: true,
      musicVolume: 0.7,
      sfxVolume: 0.8,
      textVersion: 'v2',
      language: 'en',
      dynamicScenery: false,
      renderScale: 'performance',
      uiZoom: 1,
      examinedPathDefault: false,
      fpsCap: 30,
      narrationEnabled: true,
      narrationVolume: 0.9,
      // 9.5.4: honors the OS-level light-mode preference on first boot, same
      // pattern as reducedMotion above. Harmless for ANAMNESIS (which ignores
      // `theme` entirely, per `visuals.supportsLightTheme`) and correct for
      // LIMERENCE, whose hotel skin actually supports both tones.
      theme:
        typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark',
    },
    persona: { preset: '', name: '', blurb: '' },
    hasSeenHeartLoss: false,
    hasSeenAbout: false,
    keepsakes: [],
    keepsakeChoicesTaken: [],
    heartsLost: 0,
    roomVisits: {},
    understoryDescents: 0,
    examinedRuns: 0,
    epiphanies: [],
    choiceHistory: [],
  };
}

/**
 * A legacy save (from before `hasSeenAbout` existed) should not suddenly
 * show the "Before you begin" explainer to a player who has clearly already
 * begun — that would read as a bug, not an introduction. Pure so it's
 * testable without a DOM: any sign of prior play (a run in progress, a
 * completed run, an unlocked field note, or a chosen persona name) grandfathers
 * the profile in as already having seen it; a genuinely fresh profile keeps
 * the false default so the auto-show still fires for real first-time players.
 */
export function shouldGrandfatherHasSeenAbout(parsed: {
  hasSeenAbout?: boolean;
  run?: Profile['run'];
  runsCompleted?: number;
  codexUnlocked?: string[];
  persona?: Partial<Persona>;
}): boolean {
  if (parsed.hasSeenAbout !== undefined) return false;
  return Boolean(
    parsed.run || (parsed.runsCompleted ?? 0) > 0 || (parsed.codexUnlocked?.length ?? 0) > 0 || parsed.persona?.name,
  );
}

/** Pre-v2 saves stored a single `sound` toggle covering both music and effects. */
interface LegacySettings extends Partial<Settings> {
  sound?: boolean;
}

/** Migrates a legacy `settings.sound` toggle into the new split `music`/`sfx` fields. Pure — testable. */
export function migrateSettings(raw: LegacySettings | undefined, base: Settings): Settings {
  const { sound, ...rest } = raw ?? {};
  const migrated = sound !== undefined ? { music: sound, sfx: sound } : {};
  return { ...base, ...migrated, ...rest };
}

/** Spread-merges a parsed (possibly legacy, possibly hand-edited/imported)
 * payload over fresh defaults, so additive fields introduced since the
 * payload was written are backfilled. Always stamps the current schema
 * version — a payload's own recorded version is informational for future
 * migrations, never load-bearing on its own. Storage-agnostic (pure JSON
 * shape logic) so both `LocalSaveStore.load()` and profile import (R9)
 * share exactly one merge path instead of two that could drift apart. */
export function hydrateProfile(parsed: Partial<Omit<Profile, 'settings'>> & { settings?: LegacySettings }): Profile {
  const base = defaultProfile();
  return {
    ...base,
    ...parsed,
    settings: migrateSettings(parsed.settings, base.settings),
    hasSeenAbout: shouldGrandfatherHasSeenAbout(parsed) ? true : (parsed.hasSeenAbout ?? base.hasSeenAbout),
    schemaVersion: PROFILE_SCHEMA_VERSION,
  };
}

/**
 * Server-shaped async save API. LocalStorage today; a Node backend can
 * implement this same interface later without touching game code.
 */
export interface SaveStore {
  load(profileId: string): Promise<Profile>;
  save(profileId: string, profile: Profile): Promise<void>;
}
