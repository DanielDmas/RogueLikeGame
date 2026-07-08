import type { ActId } from '../engine/schema';
import { t } from '../engine/text/resolver';
import { actNameKey } from '../engine/text/keys';

/** Optional-room pools per act; the player completes OPTIONAL_PER_ACT of them, then the gate. */
export const ACT_POOLS: Record<Exclude<ActId, 0 | 4>, string[]> = {
  1: ['wallet', 'dinner-table', 'promotion', 'beggars-math', 'quiet-alarm', 'buridans-queue', 'the-reference'],
  2: ['junction', 'experience-machine', 'ship', 'casino-pascal', 'omelas', 'chinese-room', 'newcomb-annex', 'veil-of-ignorance'],
  3: [
    'teleporter',
    'editor',
    'introduction',
    'debt-of-dead',
    'marys-room',
    'butterfly-dream',
    'swampman',
    'the-cave',
  ],
};

export const GATES: Record<Exclude<ActId, 0>, string> = {
  1: 'photograph',
  2: 'court-of-usher',
  3: 'free-will',
  4: 'door-that-asks',
};

/** Act IV is a fixed corridor. */
export const ACT4_SEQUENCE = ['boulder', 'last-message', 'door-that-asks'];

/**
 * The optional Act V descent (spec `02-act-five-the-understory.md`): offered
 * as a second, "stranger" door alongside `boulder` only for returning
 * travelers (`RunState.prior.runs >= 1`) who haven't already descended this
 * run. These rooms are plain `act: 4` content — not a real `ActId` — and are
 * sequenced entirely by `offeredDoors`'s act-4 branch, never by `ACT_POOLS`.
 */
export const UNDERSTORY_SEQUENCE = ['the-archive', 'the-unchosen', 'the-echo'];

export const PROLOGUE = 'waiting-room';

/**
 * Rooms the player must complete per act before the gate opens. Kept strictly
 * below each act's open-pool size so a door choice always means skipping a
 * room this run.
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
