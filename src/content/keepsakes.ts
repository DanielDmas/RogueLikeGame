// Keepsakes (spec 04-keepsakes.md, Phase N). Owner's constraint, verbatim:
// "only gently, very lightly, do not alter the main game mechanics for the
// sake of these keepsakes. Make it be like a bonus." No inventory, no
// carry-slot decision, no hearts/lucidity/axis effect from existing merely.
// A keepsake is earned automatically when its trigger flag is first set, and
// only becomes "held" (RunState.keepsakesHeld) from the *next* run — see
// gameState.ts's newRun and flow.ts's earn logic in enterRoom.

const svg = (inner: string) =>
  `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

export interface KeepsakeDef {
  id: string;
  /** English fallback name, resolved via t(keepsakeKey(id, 'name'), name). */
  name: string;
  /** English fallback one-line origin, shown as the Shelf tooltip. */
  origin: string;
}

export const KEEPSAKES: KeepsakeDef[] = [
  {
    id: 'casino-chip',
    name: 'The Unspent Chip',
    origin: 'kept from the casino, unspent',
  },
  {
    id: 'photo-corner',
    name: 'A Corner of the Photograph',
    origin: 'saved from the fire, one corner of it',
  },
  {
    id: 'ship-splinter',
    name: 'A Splinter of the Ship',
    origin: 'kept from the workshop, original wood',
  },
  {
    id: 'release-form',
    name: "The Machine's Release Form",
    origin: 'signed on the way out, never mailed',
  },
];

/** Maps an earn-trigger flag (already set by an existing room choice, no new
 * effect needed) to the keepsake it grants. Diffed against newly-added flags
 * in `flow.ts`'s `enterRoom`, once per profile, ever. */
export const KEEPSAKE_TRIGGERS: Record<string, string> = {
  'sharp-gambler': 'casino-chip',
  'saved-photo': 'photo-corner',
  'ship-splinter': 'ship-splinter',
  'entered-machine': 'release-form',
};

/** Pure lookup: which keepsakes (deduped) does this set of newly-added flags
 * earn, per `triggers`? `flow.ts` calls this with the active pack's own
 * `pack.keepsakeTriggers` and only the flags added by the current choice
 * (i.e. flags absent before `applyEffects` and present after). `triggers`
 * defaults to ANAMNESIS's own map so existing call sites are unaffected. */
export function keepsakesEarnedByFlags(newFlags: string[], triggers: Record<string, string> = KEEPSAKE_TRIGGERS): string[] {
  const earned = new Set<string>();
  for (const flag of newFlags) {
    const id = triggers[flag];
    if (id) earned.add(id);
  }
  return [...earned];
}

export const keepsakeIcons: Record<string, string> = {
  'casino-chip': svg(`
    <circle cx="32" cy="32" r="18"/>
    <circle cx="32" cy="32" r="10" opacity="0.6"/>
  `),
  'photo-corner': svg(`
    <path d="M14 50 L14 18 L34 18 L50 34 L50 50 Z" opacity="0.7"/>
    <path d="M34 18 L34 34 L50 34"/>
  `),
  'ship-splinter': svg(`
    <path d="M16 50 L44 14" opacity="0.8"/>
    <path d="M16 50 L22 46 M44 14 L38 18" opacity="0.5"/>
  `),
  'release-form': svg(`
    <rect x="14" y="10" width="36" height="44" rx="2"/>
    <path d="M20 22 h24 M20 30 h24 M20 38 h14" opacity="0.7"/>
    <path d="M20 46 q6 -6 12 0 q6 6 12 0" opacity="0.9"/>
  `),
};
