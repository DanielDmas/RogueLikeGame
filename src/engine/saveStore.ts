import type { RunState } from '../content/schema';

export interface Settings {
  typewriter: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  quality: 'low' | 'high';
  sound: boolean;
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
      sound: true,
    },
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
