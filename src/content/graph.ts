import type { ActId } from './schema';

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

export const OPTIONAL_PER_ACT = 3;

export const ACT_NAMES: Record<ActId, string> = {
  0: 'Prologue — The Waiting Room',
  1: 'Act I — The Shallows',
  2: 'Act II — The Machinery',
  3: 'Act III — The Mirror',
  4: 'Act IV — The Threshold',
};
