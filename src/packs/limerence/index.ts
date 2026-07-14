// The LIMERENCE ContentPack (spec docs/design-limerence/09-milestones-testing.md).
// Carries its own 3D scene palette (theme.ts), generative music identity
// (below), door/ending icons (icons.ts), the Porter's own figure rig
// (figure.ts), bespoke room dioramas for its signature rooms (dioramas.ts),
// and its own Trust/Clarity HUD wording (skin, below) — L5 polish, complete.
// Still borrowed as an explicit placeholder: the hearts glyph itself (an
// icon swap, not a wording one) and per-room ambient audio accents.
import type { ActKey } from '../../audio/soundEngine';
import type { ContentPack } from '../types';
import type { ActId, RunState } from '../../engine/schema';
import { limerenceRooms } from './rooms';
import { limerenceEndings } from './endings';
import { porterFigure } from './figure';
import { limerenceBuildTheme, LIMERENCE_FOG_COLOR_BY_THEME, LIMERENCE_MOOD_TINTS } from './theme';
import { iconFor as limerenceIconFor, endingIcons as limerenceEndingIcons } from './icons';
import { limerenceDioramaFor } from './dioramas';
// Side effect: registers LIMERENCE's translated text catalog the first time
// this pack module is imported (mirrors packs/anamnesis/index.ts's
// `import '../../content/text'`).
import './text';
import { HEART_SVG } from '../../ui/dom';
import { choseIn } from '../../engine/gameState';
import { mirrorUnlocked, patternAvailable, computePatternEligible, PATTERN_CLARITY } from './endingLogic';
import { limerenceEpiphanies } from './epiphanies';
import {
  limerenceDoorBark,
  limerenceActIntroText,
  LIMERENCE_FIRST_HEART_LOSS_BARK_FALLBACK,
  LIMERENCE_REMEMBERED_ROOM_BARK_FALLBACK,
} from './guide';

/** Minor-leaning progressions per floor (spec `docs/design-limerence/`
 * creative bible: "act progressions in minor-leaning keys"), warming toward
 * a held major chord at the very end — melancholic through most of a run,
 * resolving rather than staying bleak, matching the charter's "uplift, but
 * never false comfort" register. */
const LIMERENCE_ACT_PROGRESSIONS: Record<ActKey, number[][]> = {
  0: [
    [110, 130.81, 164.81], // A minor — the Front Desk, half-asleep
    [73.42, 87.31, 110], // D minor
  ],
  1: [
    [110, 130.81, 164.81], // A minor — Ground Floor
    [130.81, 164.81, 196], // C major (relative major — a little hope)
    [82.41, 98, 123.47], // E minor
  ],
  2: [
    [82.41, 98, 123.47], // E minor — Second Floor, colder
    [92.5, 110, 138.59], // F# minor
    [73.42, 87.31, 110], // D minor
  ],
  3: [
    [73.42, 87.31, 110], // D minor — Long-Stay Wing, settled and melancholic
    [87.31, 103.83, 130.81], // F minor
    [110, 130.81, 164.81], // A minor
  ],
  4: [
    [87.31, 110, 130.81], // F major — Top Floor, nearing dawn
    [110, 130.81, 164.81], // A minor
    [130.81, 164.81, 196], // C major
  ],
  5: [
    [130.81, 164.81, 196], // C major, held — the morning after
  ],
};

const LIMERENCE_ACT_MOTE_SCALES: Record<ActKey, number[]> = {
  0: [220, 246.94, 261.63, 293.66, 329.63],
  1: [220, 261.63, 293.66, 329.63, 392],
  2: [196, 220, 246.94, 293.66, 329.63],
  3: [174.61, 196, 220, 261.63, 293.66],
  4: [174.61, 220, 261.63, 293.66, 349.23],
  5: [261.63, 329.63, 392, 440, 523.25],
};

const ACT_NAMES_EN: Record<ActId, string> = {
  0: 'The Front Desk',
  1: 'Act I — The Ground Floor',
  2: 'Act II — The Second Floor',
  3: 'Act III — The Long-Stay Wing',
  4: 'Act IV — The Top Floor',
};

const EXAMINED_ACT_BARK_FALLBACK: Record<1 | 2 | 3 | 4, string> = {
  1: 'Porter: Would you have chosen the same in front of the people it costs?',
  2: 'Porter: When you counted, what were you actually hoping the number would be?',
  3: 'Porter: Which of these rooms would still be furnished the same way if no one else could see it?',
  4: 'Porter: If no one could ever know, walk the corridor again. Anything change?',
};

export const limerencePack: ContentPack = {
  meta: {
    id: 'limerence',
    title: 'LIMERENCE',
    exportPrefix: 'limerence',
  },

  rooms: limerenceRooms,
  endings: limerenceEndings,

  graph: {
    prologue: 'the-front-desk',
    actPools: {
      1: [
        'the-read-receipt',
        'the-screenshot',
        'the-password',
        'the-party',
        'the-forward',
        'the-best-friends-girl',
        'the-summer-ends',
      ],
      2: [
        'the-distance',
        'the-hall-pass',
        'the-rebound',
        'the-unicorn',
        'just-friends',
        'the-ex',
        'the-confession',
        'the-other-side-of-the-door',
      ],
      3: [
        'the-colleague',
        'the-metamour',
        'the-veto',
        'the-drift',
        'the-second-account',
        'the-discovery',
        'the-wedding-eve',
        'the-therapist',
        'the-usual-suite',
      ],
    },
    gates: {
      1: 'the-rumor',
      2: 'the-scoreboard',
      3: 'the-usual-room',
      4: 'the-morning-desk',
    },
    act4Sequence: ['the-kitchen-table', 'the-unsent', 'the-morning-desk'],
    understorySequence: ['the-registry', 'the-doors-not-opened', 'the-other-side'],
    optionalPerAct: { 1: 3, 2: 3, 3: 2 },
    actNamesEn: ACT_NAMES_EN,
    understoryNameEn: 'The Records Office',
  },

  endingRules: {
    evaluate: (s: RunState) => {
      if (s.hearts <= 0) return 'the-ghost';
      if (choseIn(s, 'the-morning-desk', 'stop-carrying-it')) return 'the-ghost';
      if (choseIn(s, 'the-morning-desk', 'i-know-every-room')) return 'the-pattern';
      if (choseIn(s, 'the-morning-desk', 'laughing-door')) return 'the-mirror';
      if (choseIn(s, 'the-morning-desk', 'take-the-desk')) return 'the-porter';
      const { selfOthers, controlAcceptance } = s.axes;
      const EXTREME = 35;
      if (selfOthers >= EXTREME && controlAcceptance >= EXTREME) return 'the-giver';
      if (selfOthers <= -EXTREME && controlAcceptance <= -EXTREME) return 'the-armored';
      return 'the-morning-after';
    },
    hiddenChoiceAvailable: patternAvailable,
    hiddenDoorUnlocked: mirrorUnlocked,
    computeHiddenEligible: computePatternEligible,
    clarityThreshold: PATTERN_CLARITY,
    endingsTotal: (endingsSeen: string[]) => (endingsSeen.includes('the-pattern') ? 7 : 6),
    epitaphLines: (endingsSeen: string[]) => {
      const known = endingsSeen.map((id) => limerenceEndings.find((e) => e.id === id)).filter((e): e is (typeof limerenceEndings)[number] => e != null);
      return known.length < 2 ? [] : known.map((e) => e.epitaph);
    },
    axisTriptych: (s: RunState) => {
      const line = (v: number, neg: string, mid: string, pos: string) => (v <= -25 ? neg : v >= 25 ? pos : mid);
      return [
        line(s.axes.reasonFeeling, 'You led with your head, every time.', 'Head and heart, arguing it out.', 'You led with your heart, every time.'),
        line(s.axes.selfOthers, 'You kept what was yours.', 'You held yours and theirs in the same hand.', 'You gave yourself away, gladly.'),
        line(s.axes.controlAcceptance, 'You gripped tight, floor after floor.', 'You knew when to hold and when to open.', 'You let the current decide.'),
      ];
    },
    hiddenUntilWitnessed: ['the-pattern'],
  },

  guide: {
    speakerPrefixes: ['Porter:', 'THE ROOM:'],
    doorBark: limerenceDoorBark,
    actIntroText: limerenceActIntroText,
    examinedActBarkFallback: EXAMINED_ACT_BARK_FALLBACK,
    figure: porterFigure,
    firstHeartLossBarkFallback: LIMERENCE_FIRST_HEART_LOSS_BARK_FALLBACK,
    rememberedRoomBarkFallback: LIMERENCE_REMEMBERED_ROOM_BARK_FALLBACK,
  },

  skin: {
    heartsSvg: HEART_SVG, // placeholder icon — the Porter's own diorama art is the dioramas L5 item; the label/tooltip below are the real Trust re-skin
    heartsAriaLabel: 'Trust',
    heartsTooltip:
      'Your Trust — your capacity to extend it. A handful of especially costly choices spend one outright, and so does your Clarity running out completely. Losing all three is an ending, not a failure screen.',
    lucidityTooltip: 'Clarity — how honestly you are willing to see yourself.',
  },

  // The onboarding advisory layer (design spec 10-safety-education-charter.md
  // §2) — shown automatically once via the engine's existing
  // Profile.hasSeenAbout mechanism, and re-viewable any time from the title
  // menu's "Before you begin" button.
  advisory: {
    purposeStatement:
      'LIMERENCE exists so you can walk into these rooms before life builds them around you. Nothing here grades you. The research in the field notes is real; the people are not.',
    mechanicsNote:
      'Nothing here is graded right or wrong. Each choice quietly shifts three hidden inclinations — head against heart, mine against ours, grip against open — and those, not a scoreboard, shape which doors open, how the hotel looks and sounds, and which ending you eventually reach. Three hearts are your Trust — a handful of especially costly choices spend one outright, and losing all three is not a failure screen; it is a real ending, written as one. Each door is a different room, and you cannot walk through all of them in a single stay — a replay will show you the rest.',
    themes:
      'infidelity, jealousy, coercive control, non-consensual image sharing (never depicted), relationship breakdown, and consensual non-monogamy.',
    minorsNote: 'Characters on the Ground Floor (Act I) are 15–18, and their storylines contain no sexual content.',
    ageAdvisory: '16+ · Mature Themes',
    fictionNote: 'This is fiction, not therapy or advice.',
    helpLine:
      'If one of these rooms is your life right now, a game is not the tool. Talk to someone real — a friend who tells you the truth, a counselor, a doctor.',
    noTelemetry: 'Nothing about how you play is tracked, sent anywhere, or tied to an account — your save lives only in this browser.',
  },

  keepsakes: [
    {
      id: 'the-cheap-ring',
      name: 'The Cheap Ring',
      origin: 'won at a party, for thirty seconds of being laughed at',
    },
    {
      id: 'the-unsent-letter',
      name: 'The Unsent Letter',
      origin: 'a confession carried alone, never sent, never delivered',
    },
    {
      id: 'the-keycard',
      name: 'The Keycard',
      origin: 'a hotel room you didn’t open, at the end of a conference',
    },
    {
      id: 'the-sim',
      name: 'The SIM',
      origin: 'a second account, deleted, that took a week to stop reaching for',
    },
  ],
  keepsakeTriggers: {
    'refused-the-dare': 'the-cheap-ring',
    'carried-alone': 'the-unsent-letter',
    'walked-away': 'the-keycard',
    'deleted-the-account': 'the-sim',
  },
  keepsakeIcons: {
    'the-cheap-ring': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="38" r="16"/>
      <path d="M24 22 L32 10 L40 22 Z"/>
      <circle cx="32" cy="16" r="2.4" fill="currentColor"/>
    </svg>`,
    'the-unsent-letter': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <rect x="12" y="18" width="40" height="28" rx="2"/>
      <path d="M12 20 L32 36 L52 20"/>
    </svg>`,
    'the-keycard': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <rect x="10" y="16" width="44" height="32" rx="3"/>
      <circle cx="22" cy="32" r="5"/>
      <path d="M32 26 H46 M32 32 H42 M32 38 H46"/>
    </svg>`,
    'the-sim': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 12 H42 L48 18 V52 H16 V12 Z"/>
      <path d="M22 24 H38 M22 32 H38 M22 40 H32"/>
    </svg>`,
  },

  epiphanies: limerenceEpiphanies,

  visuals: {
    iconFor: limerenceIconFor,
    endingIcons: limerenceEndingIcons,
    buildTheme: limerenceBuildTheme,
    moodTints: LIMERENCE_MOOD_TINTS,
    fogColorByTheme: LIMERENCE_FOG_COLOR_BY_THEME,
    dioramaFor: limerenceDioramaFor,
    // F5 Tier 2 (mirrors ANAMNESIS's marys-room/open-drawer pattern): each
    // pair is a factual action the room's own beats already describe —
    // handing over a password, deleting an account, looking at a lit
    // phone, speaking a confession, sending a letter — made visible in the
    // room's diorama the instant that specific choice is taken.
    dioramaAccentHooks: [
      { roomId: 'the-password', choiceId: 'give-it' },
      { roomId: 'the-second-account', choiceId: 'delete-it' },
      { roomId: 'the-discovery', choiceId: 'confront-now' },
      { roomId: 'the-confession', choiceId: 'confess' },
      { roomId: 'the-unsent', choiceId: 'to-the-one-you-hurt' },
      { roomId: 'the-unsent', choiceId: 'to-the-one-who-hurt-you' },
      { roomId: 'the-unsent', choiceId: 'to-the-one-that-got-away' },
      { roomId: 'the-unsent', choiceId: 'to-your-16-year-old-self' },
      { roomId: 'the-unsent', choiceId: 'to-your-own-kids-someday' },
      { roomId: 'the-unsent', choiceId: 'blank-page' },
    ],
    supportsLightTheme: true,
    // A sleeker, cooler modern-hotel door — thin steel-dark frame instead of
    // carved wood, amber/teal glow instead of gold/violet, and two small
    // "artistically unsettling" touches: every door sits a fraction of a
    // degree off plumb (skewJitter), and its idle glow carries a second,
    // slower wave under the normal breathing pulse (unsteadyPulse) — never
    // a strobe, always off under reducedMotion, just faintly not-quite-still.
    doorStyle: {
      frameColor: 0x15171a,
      frameWidth: 0.09,
      slabColor: 0x1c2226,
      slabColorSecret: 0x1a1520,
      glowColor: 0xd89055,
      glowColorSecret: 0x5aa8a8,
      skewJitter: 0.018,
      unsteadyPulse: 0.025,
    },
  },

  audio: {
    roomAccents: {},
    actProgressions: LIMERENCE_ACT_PROGRESSIONS,
    actMoteScales: LIMERENCE_ACT_MOTE_SCALES,
  },

  hooks: {
    finalGateId: 'the-morning-desk',
    lastMessageId: 'the-unsent',
    lastMessageLabel: 'The envelope you chose',
  },

  registerText: () => {
    // The static `import './text'` above already registered the full
    // catalog (cs/fa/de/fr, end-to-end — rooms, endings, keepsakes,
    // epiphanies, guide barks) by the time any caller reaches this — see
    // the comment on that import. Any t(key, fallback) call not yet covered
    // by a registered translation still falls back to its English literal,
    // so the pack remains fully playable regardless.
  },
};
