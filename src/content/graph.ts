import type { ActId } from './schema';
import { t } from './text/resolver';
import { actNameKey } from './text/keys';

/** Optional-room pools per act; the player completes OPTIONAL_PER_ACT of them, then the gate. */
export const ACT_POOLS: Record<Exclude<ActId, 0 | 4>, string[]> = {
  1: ['wallet', 'dinner-table', 'promotion', 'beggars-math', 'quiet-alarm'],
  2: ['junction', 'experience-machine', 'ship', 'casino-pascal', 'omelas'],
  3: ['teleporter', 'editor', 'introduction', 'debt-of-dead'],
};

export const GATES: Record<Exclude<ActId, 0>, string> = {
  1: 'photograph',
  2: 'court-of-usher',
  3: 'free-will',
  4: 'door-that-asks',
};

/** Act IV is a fixed corridor. */
export const ACT4_SEQUENCE = ['boulder', 'last-message', 'door-that-asks'];

export const PROLOGUE = 'waiting-room';

/**
 * Rooms the player must complete per act before the gate opens. Kept strictly
 * below each act's open-pool size so a door choice always means skipping a
 * room this run (Act III's open pool is 3, so it takes only 2 of them).
 */
export const OPTIONAL_PER_ACT: Record<1 | 2 | 3, number> = { 1: 3, 2: 3, 3: 2 };

const ACT_NAMES_EN: Record<ActId, string> = {
  0: 'Prologue — The Waiting Room',
  1: 'Act I — The Shallows',
  2: 'Act II — The Machinery',
  3: 'Act III — The Mirror',
  4: 'Act IV — The Threshold',
};

/** Localized act name (same wording across text versions; translated per language). */
export function actName(act: ActId): string {
  return t(actNameKey(act), ACT_NAMES_EN[act]);
}
