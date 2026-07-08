// The LIMERENCE ContentPack — L1 skeleton (spec
// docs/design-limerence/09-milestones-testing.md, milestone L1), now
// carrying LIMERENCE's own 3D scene palette (theme.ts) and generative music
// identity (below) — real, not placeholder. Still borrowed as an explicit
// placeholder: the Usher rig (the Porter's own desk-lamp-lantern figure is
// L5 work) and the hearts SVG (the Trust re-skin is also L5).
import type { ActKey } from '../../audio/soundEngine';
import type { ContentPack, EpiphanyDef } from '../types';
import type { ActId, RunState } from '../../engine/schema';
import { limerenceRooms } from './rooms';
import { limerenceEndings } from './endings';
import { usherFigure } from '../../scene/themes';
import { limerenceBuildTheme, LIMERENCE_FOG_COLOR_BY_THEME, LIMERENCE_MOOD_TINTS } from './theme';
import { HEART_SVG } from '../../ui/dom';

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

const epiphanies: EpiphanyDef[] = [{ id: 'first-return', fallback: 'You came back to the Interval.' }];

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
    understorySequence: [],
    optionalPerAct: { 1: 3, 2: 3, 3: 2 },
    actNamesEn: ACT_NAMES_EN,
  },

  endingRules: {
    evaluate: (s: RunState) => (s.hearts <= 0 ? 'the-ghost' : 'the-morning-after'),
    hiddenChoiceAvailable: () => false,
    hiddenDoorUnlocked: () => false,
    computeHiddenEligible: () => false,
    clarityThreshold: Number.POSITIVE_INFINITY,
    endingsTotal: () => limerenceEndings.length,
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
    hiddenUntilWitnessed: [],
  },

  guide: {
    speakerPrefixes: ['Porter:', 'THE ROOM:'],
    doorBark: () => 'Porter: Choose a door. The hotel keeps its hints honest.',
    actIntroText: () => undefined,
    examinedActBarkFallback: EXAMINED_ACT_BARK_FALLBACK,
    figure: usherFigure, // placeholder rig — the Porter's own figure lands at L5
  },

  skin: {
    heartsSvg: HEART_SVG, // placeholder — Trust re-skin lands at L5
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

  epiphanies,

  visuals: {
    iconFor: () => undefined,
    endingIcons: {},
    buildTheme: limerenceBuildTheme,
    moodTints: LIMERENCE_MOOD_TINTS,
    fogColorByTheme: LIMERENCE_FOG_COLOR_BY_THEME,
    dioramaFor: () => null, // bespoke room dioramas are L5 work
    dioramaAccentHooks: [],
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
  },

  registerText: () => {
    // No translations registered yet — every t(key, fallback) call in the
    // engine and in limerenceRooms/limerenceEndings above falls back to its
    // English literal, so the pack is fully playable without one.
  },
};
