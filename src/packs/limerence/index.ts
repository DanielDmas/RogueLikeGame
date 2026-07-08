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
      1: ['placeholder-room-1'],
      2: ['placeholder-room-2'],
      3: ['placeholder-room-3'],
    },
    gates: {
      1: 'the-rumor',
      2: 'the-scoreboard',
      3: 'the-usual-room',
      4: 'the-morning-desk',
    },
    act4Sequence: ['the-kitchen-table', 'the-unsent', 'the-morning-desk'],
    understorySequence: [],
    optionalPerAct: { 1: 0, 2: 0, 3: 0 },
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

  keepsakes: [],
  keepsakeTriggers: {},
  keepsakeIcons: {},

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
