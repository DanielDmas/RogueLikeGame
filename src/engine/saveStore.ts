import type { RunState, TranscriptEntry } from '../content/schema';

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
  language: 'en' | 'cs' | 'fa';
  dynamicScenery: boolean;
  /** Render resolution scale — independent of `quality` (which only controls AA/bloom). */
  renderScale: 'performance' | 'standard' | 'sharp';
  /** 0.8–1.3, scales the 2D UI layer (not the 3D canvas). */
  uiZoom: number;
}

/** Cosmetic only — no mechanical effect. Empty name means "not chosen yet". */
export interface Persona {
  preset: string;
  name: string;
  blurb: string;
}

export interface Profile {
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
  /** Snapshot of the most recently finished run — feeds `RunState.prior` for
   * rooms that remember the previous run (e.g. `the-cave`). Written in
   * `Game.playEnding` just before the profile is persisted. Optional: absent
   * before the player's first completed run, or on legacy saves. */
  lastRunTranscript?: TranscriptEntry[];
  lastRunEndingId?: string | null;
}

export function defaultProfile(): Profile {
  return {
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
      quality: 'high',
      music: true,
      sfx: true,
      musicVolume: 0.7,
      sfxVolume: 0.8,
      textVersion: 'v2',
      language: 'en',
      dynamicScenery: false,
      renderScale: 'standard',
      uiZoom: 1,
    },
    persona: { preset: '', name: '', blurb: '' },
    hasSeenHeartLoss: false,
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
