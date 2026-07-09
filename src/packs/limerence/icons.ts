// Minimal schematic line-icons for LIMERENCE's doors, one per room (plus
// prologue, understory, and endings) — same spare geometric-shorthand
// register as ANAMNESIS's `content/icons.ts` (single-color stroke art,
// inherits currentColor, viewBox 0 0 64 64), each motif drawn from the
// room's own doorHint/question rather than illustrating its content.

const svg = (inner: string) =>
  `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

export const roomIcons: Record<string, string> = {
  // Prologue
  'the-front-desk': svg(`
    <path d="M8 46 h48"/>
    <path d="M12 46 v-10 h40 v10"/>
    <circle cx="44" cy="30" r="4"/>
    <path d="M44 26 v-4"/>
  `),

  // Act I — The Ground Floor
  'the-read-receipt': svg(`
    <rect x="20" y="8" width="24" height="48" rx="3"/>
    <path d="M26 20 h12 M26 26 h12" opacity="0.6"/>
    <path d="M25 40 l4 4 l10 -10" opacity="0.85"/>
  `),
  'the-screenshot': svg(`
    <rect x="12" y="14" width="40" height="30" rx="2"/>
    <path d="M12 22 h8 v-8 M52 22 h-8 v-8 M12 36 h8 v8 M52 36 h-8 v8" opacity="0.7"/>
  `),
  'the-password': svg(`
    <rect x="10" y="30" width="18" height="20" rx="2"/>
    <path d="M14 30 v-8 a5 5 0 0 1 10 0 v8" />
    <circle cx="19" cy="40" r="2.5" fill="currentColor"/>
    <rect x="36" y="30" width="18" height="20" rx="2" opacity="0.55"/>
    <path d="M40 30 v-8 a5 5 0 0 1 10 0 v8" opacity="0.55"/>
  `),
  'the-party': svg(`
    <path d="M20 44 L30 22 L38 22 L48 44 Z" opacity="0.5"/>
    <path d="M30 22 q4 -8 8 0" />
    <path d="M14 50 q4 -6 8 0 M42 50 q4 -6 8 0" opacity="0.6"/>
  `),
  'the-forward': svg(`
    <rect x="8" y="18" width="26" height="28" rx="2"/>
    <path d="M40 24 L54 32 L40 40 M40 32 h14" opacity="0.85"/>
  `),
  'the-best-friends-girl': svg(`
    <circle cx="18" cy="24" r="6"/>
    <path d="M8 48 q10 -12 20 0" opacity="0.85"/>
    <circle cx="44" cy="24" r="6" opacity="0.5"/>
    <path d="M34 48 q10 -12 20 0" opacity="0.5"/>
    <path d="M28 34 L36 34" opacity="0.3"/>
  `),
  'the-summer-ends': svg(`
    <rect x="14" y="26" width="30" height="22" rx="2"/>
    <path d="M22 26 v-6 a5 5 0 0 1 10 0 v6" opacity="0.7"/>
    <circle cx="50" cy="16" r="6" opacity="0.6"/>
    <path d="M50 8 v-3 M50 24 v3 M42 16 h-3 M58 16 h3" opacity="0.4"/>
  `),
  'the-rumor': svg(`
    <path d="M8 20 h16 v10 h-6 l-4 5 v-5 h-6 Z" opacity="0.9"/>
    <path d="M26 32 h16 v10 h-6 l-4 5 v-5 h-6 Z" opacity="0.6"/>
    <path d="M40 12 h16 v10 h-6 l-4 5 v-5 h-6 Z" opacity="0.35"/>
  `),

  // Act II — The Second Floor
  'the-distance': svg(`
    <circle cx="14" cy="22" r="4"/>
    <path d="M14 26 v6" />
    <circle cx="50" cy="42" r="4" opacity="0.6"/>
    <path d="M50 46 v6" opacity="0.6"/>
    <path d="M18 26 Q34 10 46 40" stroke-dasharray="3 4" opacity="0.7"/>
  `),
  'the-hall-pass': svg(`
    <rect x="10" y="20" width="36" height="20" rx="2"/>
    <circle cx="10" cy="30" r="0" opacity="0"/>
    <path d="M46 24 l8 6 l-8 6" opacity="0.7"/>
    <path d="M18 30 h20" stroke-dasharray="2 4" opacity="0.5"/>
  `),
  'the-rebound': svg(`
    <circle cx="22" cy="26" r="9"/>
    <circle cx="38" cy="38" r="9" opacity="0.4"/>
    <path d="M14 50 q8 6 16 0 M8 44 q6 4 12 0" opacity="0.35"/>
  `),
  'the-unicorn': svg(`
    <circle cx="20" cy="40" r="9"/>
    <circle cx="44" cy="40" r="9" opacity="0.6"/>
    <path d="M32 12 L26 30 L38 30 Z" opacity="0.85"/>
  `),
  'just-friends': svg(`
    <rect x="10" y="10" width="44" height="44" rx="1" opacity="0.5"/>
    <rect x="20" y="20" width="24" height="18" rx="1"/>
    <path d="M32 20 v18 M20 29 h24" opacity="0.6"/>
  `),
  'the-ex': svg(`
    <rect x="16" y="12" width="28" height="34" rx="1"/>
    <path d="M16 34 l9 -9 7 6 8 -10" opacity="0.6"/>
    <path d="M14 12 L46 46" opacity="0.35" stroke-dasharray="2 3"/>
  `),
  'the-confession': svg(`
    <path d="M18 48 q-2 -14 8 -20 q10 -6 18 2 q6 8 -2 14 q-8 6 -16 2 Z" opacity="0.75"/>
    <path d="M40 16 h14 v10 h-5 l-4 5 v-5 h-5 Z" opacity="0.5"/>
  `),
  'the-other-side-of-the-door': svg(`
    <rect x="18" y="8" width="24" height="48" rx="2"/>
    <circle cx="36" cy="32" r="2" fill="currentColor"/>
    <path d="M42 10 L54 16 v36 l-12 6" opacity="0.4"/>
  `),

  // Gate II
  'the-scoreboard': svg(`
    <rect x="10" y="12" width="44" height="34" rx="2" opacity="0.5"/>
    <path d="M18 20 h10 M18 27 h18 M18 34 h14 M18 41 h22" opacity="0.8"/>
  `),

  // Act III — The Long-Stay Wing
  'the-colleague': svg(`
    <rect x="8" y="10" width="20" height="44" rx="2" opacity="0.6"/>
    <rect x="36" y="10" width="20" height="44" rx="2" opacity="0.6"/>
    <rect x="24" y="30" width="16" height="10" rx="2"/>
    <circle cx="30" cy="35" r="1.6" fill="currentColor"/>
  `),
  'the-metamour': svg(`
    <circle cx="22" cy="24" r="8"/>
    <circle cx="42" cy="24" r="8" opacity="0.6"/>
    <circle cx="32" cy="42" r="8" opacity="0.35"/>
  `),
  'the-veto': svg(`
    <path d="M32 14 q10 8 -2 20 q-12 -8 -6 -18 q3 -5 8 -2 Z" opacity="0.5"/>
    <path d="M16 46 L28 34 M16 34 L28 46" opacity="0.9"/>
  `),
  'the-drift': svg(`
    <path d="M8 20 v28 M8 20 h14 v10 h-14" opacity="0.6"/>
    <path d="M56 26 v22 M56 26 h-14 v10 h14" opacity="0.3"/>
    <path d="M8 48 q24 6 48 -2" stroke-dasharray="2 4" opacity="0.5"/>
  `),
  'the-second-account': svg(`
    <rect x="20" y="8" width="22" height="38" rx="3"/>
    <rect x="28" y="18" width="22" height="38" rx="3" opacity="0.4"/>
    <circle cx="31" cy="38" r="1.6" fill="currentColor"/>
  `),
  'the-discovery': svg(`
    <rect x="20" y="8" width="22" height="34" rx="2"/>
    <circle cx="34" cy="18" r="2.4" opacity="0.85"/>
    <path d="M40 42 L52 50 L40 58 Z" opacity="0.6"/>
  `),
  'the-wedding-eve': svg(`
    <circle cx="24" cy="34" r="9"/>
    <circle cx="38" cy="34" r="9" opacity="0.7"/>
    <path d="M46 12 q6 6 0 12 q-6 -2 -4 -8 q1 -3 4 -4 Z" opacity="0.45"/>
  `),
  'the-therapist': svg(`
    <rect x="6" y="14" width="12" height="30" rx="1" opacity="0.7"/>
    <rect x="22" y="14" width="12" height="30" rx="1" opacity="0.7"/>
    <rect x="38" y="14" width="12" height="30" rx="1" opacity="0.4"/>
    <rect x="52" y="14" width="6" height="30" rx="1" opacity="0.25"/>
  `),
  'the-usual-suite': svg(`
    <rect x="14" y="30" width="36" height="20" rx="2" opacity="0.6"/>
    <path d="M14 30 l18 -16 l18 16" opacity="0.6"/>
    <path d="M24 44 h16" opacity="0.85"/>
  `),

  // Gate III
  'the-usual-room': svg(`
    <rect x="20" y="8" width="24" height="48" rx="2"/>
    <path d="M14 20 q6 -6 0 -12" opacity="0.7"/>
    <path d="M50 44 q6 6 0 12" opacity="0.4"/>
    <circle cx="36" cy="32" r="2" fill="currentColor"/>
  `),

  // Act IV — The Top Floor
  'the-kitchen-table': svg(`
    <path d="M8 40 h48 M14 40 v10 M50 40 v10" opacity="0.7"/>
    <circle cx="24" cy="30" r="5"/>
    <circle cx="40" cy="30" r="5" opacity="0.6"/>
    <path d="M24 25 q0 -4 3 -6 M40 25 q0 -4 3 -6" opacity="0.35"/>
  `),
  'the-unsent': svg(`
    <rect x="12" y="18" width="40" height="28" rx="2"/>
    <path d="M12 20 L32 36 L52 20" opacity="0.85"/>
    <path d="M32 46 v6 M26 52 h12" opacity="0.4"/>
  `),
  'the-morning-desk': svg(`
    <path d="M8 46 h48"/>
    <path d="M12 46 v-10 h40 v10"/>
    <circle cx="32" cy="14" r="7" opacity="0.6"/>
    <path d="M32 6 v-3 M20 14 h-3 M44 14 h3" opacity="0.4"/>
  `),

  // Understory — The Records Office
  'the-registry': svg(`
    <rect x="14" y="10" width="30" height="40" rx="1"/>
    <path d="M20 20 h18 M20 27 h18 M20 34 h12" opacity="0.6"/>
    <path d="M44 42 h10 v8 h-10 Z" opacity="0.5"/>
  `),
  'the-doors-not-opened': svg(`
    <rect x="6" y="14" width="10" height="34" rx="1" opacity="0.5"/>
    <rect x="20" y="14" width="10" height="34" rx="1" opacity="0.5"/>
    <rect x="34" y="14" width="10" height="34" rx="1" opacity="0.5"/>
    <path d="M48 14 h10 v34 h-10 l8 -4 v-26 Z" opacity="0.9"/>
  `),
  'the-other-side': svg(`
    <rect x="6" y="26" width="12" height="20" rx="1"/>
    <rect x="46" y="26" width="12" height="20" rx="1" opacity="0.55"/>
    <path d="M20 36 h24" opacity="0.3" stroke-dasharray="2 4"/>
  `),
};

export const endingIcons: Record<string, string> = {
  'the-morning-after': svg(`
    <rect x="18" y="12" width="20" height="42" rx="2"/>
    <circle cx="48" cy="24" r="7" opacity="0.7"/>
    <path d="M48 10 v4 M48 34 v4 M36 24 h4 M58 24 h4" opacity="0.5"/>
  `),
  'the-giver': svg(`
    <path d="M20 54 v-20 q0 -6 5 -6 q5 0 5 6 v-4 q0 -6 5 -6 q5 0 5 6 v-2 q0 -6 5 -6 q5 0 5 6 v22 q0 6 -6 6 h-13 q-6 0 -6 -6 Z"/>
  `),
  'the-armored': svg(`
    <path d="M14 54 v-26 h6 v-6 h6 v6 h12 v-6 h6 v6 h6 v26 Z"/>
    <path d="M32 54 v-16" opacity="0.6"/>
  `),
  'the-ghost': svg(`
    <circle cx="32" cy="20" r="8" opacity="0.85"/>
    <path d="M20 34 q12 6 24 0" opacity="0.55"/>
    <path d="M18 42 q14 8 28 0" opacity="0.35"/>
    <path d="M16 50 q16 10 32 0" opacity="0.18"/>
  `),
  'the-porter': svg(`
    <path d="M32 54 v-24"/>
    <path d="M32 30 q-12 0 -14 -14 q14 2 14 14 Z"/>
    <path d="M32 34 q12 0 14 -12 q-14 -2 -14 12 Z" opacity="0.65"/>
  `),
  'the-mirror': svg(`
    <rect x="18" y="10" width="28" height="40" rx="14"/>
    <path d="M26 10 v40" opacity="0.4" stroke-dasharray="2 4"/>
  `),
  'the-pattern': svg(`
    <rect x="12" y="10" width="18" height="42" rx="2" opacity="0.4"/>
    <path d="M30 10 L48 16 L48 46 L30 52"/>
    <path d="M48 30 L60 30 M48 18 L58 10 M48 42 L58 50" opacity="0.65"/>
  `),
};

export function iconFor(roomId: string): string | undefined {
  return roomIcons[roomId];
}
