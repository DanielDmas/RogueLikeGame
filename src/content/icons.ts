// Minimal schematic line-icons, one per room (plus prologue and endings).
// Deliberately spare — geometric shorthand for the dilemma, not illustration.
// Single-color stroke art, inherits currentColor; viewBox 0 0 64 64.

const svg = (inner: string) =>
  `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

export const roomIcons: Record<string, string> = {
  // Prologue
  'waiting-room': svg(`
    <rect x="18" y="10" width="28" height="44" rx="2"/>
    <circle cx="32" cy="30" r="10"/>
    <path d="M32 30 L32 30" />
  `),

  // Act I — The Shallows
  wallet: svg(`
    <rect x="10" y="20" width="40" height="28" rx="3"/>
    <path d="M10 30 h40"/>
    <circle cx="40" cy="24" r="5"/>
  `),
  'dinner-table': svg(`
    <path d="M8 46 h48"/>
    <path d="M14 46 V30 M50 46 V30"/>
    <path d="M22 24 q6 -8 12 0 q3 5 -2 8 q-4 3 -8 0 q-4 -3 -2 -8 Z"/>
  `),
  promotion: svg(`
    <path d="M10 50 h44"/>
    <rect x="14" y="34" width="8" height="16"/>
    <rect x="28" y="24" width="8" height="26"/>
    <rect x="42" y="14" width="8" height="36"/>
  `),
  'beggars-math': svg(`
    <circle cx="24" cy="20" r="8"/>
    <path d="M24 28 v10"/>
    <path d="M24 38 L12 52 M24 38 L36 52"/>
    <path d="M46 14 v10 M41 19 h10"/>
  `),
  'quiet-alarm': svg(`
    <path d="M8 10 v44"/>
    <path d="M20 20 q6 8 0 16 M28 16 q10 12 0 24 M36 12 q14 16 0 32"/>
  `),
  photograph: svg(`
    <rect x="16" y="14" width="26" height="34" rx="1"/>
    <circle cx="29" cy="27" r="5"/>
    <path d="M16 42 l7 -8 6 5 9 -11 8 9" opacity="0.6"/>
    <path d="M44 46 q6 -4 4 -12 q8 4 4 14 q-4 6 -8 -2 Z"/>
  `),
  'buridans-queue': svg(`
    <rect x="14" y="20" width="14" height="34" rx="1"/>
    <rect x="36" y="20" width="14" height="34" rx="1"/>
    <circle cx="32" cy="12" r="6"/>
    <path d="M32 12 v-3 M32 12 l3 2"/>
  `),
  'the-reference': svg(`
    <rect x="10" y="18" width="44" height="30" rx="2"/>
    <path d="M10 20 L32 38 L54 20"/>
    <path d="M20 50 L46 24" opacity="0.7"/>
  `),

  // Act II — The Machinery
  junction: svg(`
    <path d="M8 46 h20"/>
    <path d="M28 46 L44 26"/>
    <path d="M28 46 L44 54" opacity="0.5"/>
    <rect x="10" y="40" width="10" height="8" rx="1"/>
  `),
  'experience-machine': svg(`
    <path d="M22 8 h20 a10 10 0 0 1 0 20 h-20 a10 10 0 0 1 0 -20 Z"/>
    <path d="M20 28 v20 a12 8 0 0 0 24 0 v-20"/>
    <circle cx="32" cy="18" r="3"/>
  `),
  ship: svg(`
    <path d="M12 24 h40 v6 h-40 z"/>
    <path d="M12 34 h40 v6 h-40 z"/>
    <path d="M12 44 h40 v6 h-40 z"/>
    <path d="M32 10 v14" opacity="0.6"/>
  `),
  'casino-pascal': svg(`
    <circle cx="24" cy="32" r="14"/>
    <path d="M40 26 a6 6 0 1 0 0 12 a6 6 0 1 0 -12 0 a6 6 0 1 0 12 0" opacity="0.7"/>
  `),
  omelas: svg(`
    <path d="M8 40 v-10 l8 -8 v18 M20 40 v-18 l8 -6 v24 M32 40 v-24 l8 8 v16 M44 40 v-14 l8 6 v8"/>
    <path d="M8 40 h44"/>
    <rect x="26" y="44" width="6" height="6"/>
  `),
  'chinese-room': svg(`
    <rect x="14" y="12" width="36" height="40" rx="2"/>
    <rect x="26" y="26" width="12" height="3"/>
    <rect x="40" y="38" width="10" height="7" rx="1"/>
  `),
  'newcomb-annex': svg(`
    <rect x="8" y="26" width="20" height="20" rx="1"/>
    <path d="M8 26 L28 46 M28 26 L8 46" opacity="0.5"/>
    <rect x="36" y="20" width="20" height="26" rx="1"/>
  `),
  'veil-of-ignorance': svg(`
    <path d="M14 8 q5 10 0 20 q-5 10 0 20"/>
    <path d="M26 8 q5 10 0 20 q-5 10 0 20"/>
    <path d="M38 8 q5 10 0 20 q-5 10 0 20"/>
    <path d="M18 50 h28"/>
    <path d="M32 42 v8"/>
    <circle cx="24" cy="46" r="4"/>
    <circle cx="40" cy="46" r="4"/>
  `),
  'court-of-usher': svg(`
    <path d="M32 10 v40"/>
    <path d="M14 20 h36"/>
    <path d="M14 20 l-6 14 h12 z" opacity="0.7"/>
    <path d="M50 20 l-6 14 h12 z" opacity="0.7"/>
    <path d="M22 54 h20"/>
  `),

  // Act III — The Mirror
  teleporter: svg(`
    <circle cx="18" cy="32" r="10"/>
    <circle cx="46" cy="32" r="10"/>
    <path d="M28 32 h8" stroke-dasharray="3 3"/>
  `),
  editor: svg(`
    <path d="M12 14 h28 l8 8 v28 h-36 z"/>
    <path d="M40 14 v8 h8"/>
    <path d="M18 46 l24 -24" opacity="0.7"/>
  `),
  introduction: svg(`
    <rect x="20" y="10" width="24" height="44" rx="2"/>
    <path d="M32 26 q6 -6 0 -10 q-6 4 0 10 q0 6 0 8" opacity="0.75"/>
    <circle cx="32" cy="42" r="1.4" fill="currentColor"/>
  `),
  'debt-of-dead': svg(`
    <path d="M8 46 h48"/>
    <rect x="14" y="30" width="36" height="12" rx="3"/>
    <path d="M32 24 q4 -6 8 -2 q4 4 -8 12 q-12 -8 -8 -12 q4 -4 8 2 Z"/>
  `),
  'marys-room': svg(`
    <rect x="2" y="16" width="12" height="12"/>
    <rect x="18" y="16" width="12" height="12"/>
    <rect x="34" y="16" width="12" height="12" fill="currentColor"/>
    <rect x="50" y="16" width="12" height="12"/>
    <rect x="2" y="34" width="12" height="12"/>
    <rect x="18" y="34" width="12" height="12"/>
    <rect x="34" y="34" width="12" height="12"/>
    <rect x="50" y="34" width="12" height="12"/>
  `),
  'butterfly-dream': svg(`
    <path d="M8 32 h48"/>
    <path d="M32 32 L12 12 L52 12 Z" opacity="0.8"/>
    <path d="M32 32 L12 52 L52 52 Z" opacity="0.5"/>
  `),
  swampman: svg(`
    <circle cx="20" cy="16" r="6"/>
    <path d="M20 22 v20 M12 34 L20 26 L28 34 M14 50 L20 42 L26 50"/>
    <circle cx="44" cy="16" r="6" stroke-dasharray="3 3"/>
    <path d="M44 22 v20 M36 34 L44 26 L52 34 M38 50 L44 42 L50 50" stroke-dasharray="3 3"/>
  `),
  'the-cave': svg(`
    <path d="M12 50 q-3 -8 1 -14 q3 6 5 3 q-3 -9 5 -15 q7 10 0 18 q4 -1 3 -6 q4 8 -3 14 q-5 4 -8 0 q-4 -4 -3 0 Z"/>
    <path d="M38 12 v40"/>
    <path d="M46 20 l10 -5 M46 32 l12 -4 M46 44 l10 -5" opacity="0.6"/>
  `),
  'free-will': svg(`
    <circle cx="16" cy="32" r="6"/>
    <circle cx="32" cy="32" r="6"/>
    <circle cx="48" cy="32" r="6"/>
    <path d="M16 20 v6 M32 20 v6 M48 20 v6" opacity="0.5"/>
  `),

  // Act IV — The Threshold
  boulder: svg(`
    <path d="M6 50 L34 14 L58 50 Z" opacity="0.5"/>
    <circle cx="26" cy="38" r="7"/>
    <path d="M40 20 a6 6 0 1 1 -6 6" opacity="0.6"/>
  `),
  'last-message': svg(`
    <rect x="10" y="18" width="44" height="30" rx="2"/>
    <path d="M10 20 l22 18 l22 -18"/>
  `),
  'door-that-asks': svg(`
    <rect x="20" y="8" width="24" height="48" rx="2"/>
    <circle cx="32" cy="30" r="5"/>
    <path d="M32 35 v6"/>
  `),

  // Act V — The Understory (optional descent; spec 02)
  'the-archive': svg(`
    <path d="M8 50 h8 v-8 h8 v-8 h8 v-8 h8 v-8 h8 v-8"/>
    <rect x="44" y="10" width="12" height="20" rx="1"/>
  `),
  'the-unchosen': svg(`
    <rect x="6" y="18" width="12" height="30"/>
    <rect x="26" y="18" width="12" height="30"/>
    <path d="M46 18 h12 v30 h-12 M46 18 l10 4 v22 l-10 4" opacity="0.8"/>
  `),
  'the-echo': svg(`
    <path d="M14 46 v-14 h10 v14 M14 40 h10"/>
    <path d="M50 46 v-14 h-10 v14 M50 40 h-10" opacity="0.6"/>
  `),
};

export const endingIcons: Record<string, string> = {
  return: svg(`
    <rect x="18" y="10" width="20" height="44" rx="2"/>
    <circle cx="48" cy="24" r="8"/>
    <path d="M48 8 v4 M48 36 v4 M32 24 h4 M60 24 h4" opacity="0.6"/>
  `),
  'open-hand': svg(`
    <path d="M20 54 v-20 q0 -6 5 -6 q5 0 5 6 v-4 q0 -6 5 -6 q5 0 5 6 v-2 q0 -6 5 -6 q5 0 5 6 v22 q0 6 -6 6 h-13 q-6 0 -6 -6 Z"/>
  `),
  fortress: svg(`
    <path d="M14 54 v-26 h6 v-6 h6 v6 h12 v-6 h6 v6 h6 v26 Z"/>
    <path d="M32 54 v-16"/>
  `),
  dissolved: svg(`
    <circle cx="32" cy="20" r="8" opacity="0.9"/>
    <path d="M20 34 q12 6 24 0" opacity="0.6"/>
    <path d="M18 42 q14 8 28 0" opacity="0.4"/>
    <path d="M16 50 q16 10 32 0" opacity="0.2"/>
  `),
  gardener: svg(`
    <path d="M32 54 v-24"/>
    <path d="M32 30 q-12 0 -14 -14 q14 2 14 14 Z"/>
    <path d="M32 34 q12 0 14 -12 q-14 -2 -14 12 Z" opacity="0.7"/>
  `),
  punchline: svg(`
    <circle cx="32" cy="32" r="18"/>
    <path d="M24 28 q0 3 3 3 M37 28 q0 3 3 3" />
    <path d="M22 38 q10 8 20 0" opacity="0.8"/>
  `),
  // The prologue's waiting-room door (rect + knob), now open with rays —
  // the frame stays, the panel swings wide, and the light finally gets out.
  anamnesis: svg(`
    <rect x="12" y="10" width="20" height="44" rx="2" opacity="0.45"/>
    <path d="M32 10 L48 16 L48 48 L32 54"/>
    <path d="M48 32 L60 32 M48 20 L58 12 M48 44 L58 52" opacity="0.7"/>
  `),
};

export function iconFor(roomId: string): string | undefined {
  return roomIcons[roomId];
}
