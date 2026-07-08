// The LIMERENCE ContentPack — L1 skeleton (spec
// docs/design-limerence/09-milestones-testing.md, milestone L1). Boots a
// second, structurally-real pack through the same engine as ANAMNESIS,
// proving the ContentPack seam; the visuals/guide fields below borrow
// ANAMNESIS's rig as an explicit placeholder — LIMERENCE's own hotel skin
// (sodium-lamp amber, the Porter's desk-lamp lantern) is L5 work.
import type { ContentPack, EpiphanyDef } from '../types';
import type { ActId, RunState } from '../../engine/schema';
import { limerenceRooms } from './rooms';
import { limerenceEndings } from './endings';
import { usherFigure, buildTheme, MOOD_TINTS } from '../../scene/themes';
import { HEART_SVG } from '../../ui/dom';

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
    buildTheme, // placeholder — the hotel palette lands at L5
    moodTints: MOOD_TINTS,
    dioramaFor: () => null,
    dioramaAccentHooks: [],
  },

  audio: {
    roomAccents: {},
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
