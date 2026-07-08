// The ANAMNESIS ContentPack (spec `docs/design-limerence/08-engine-pack-architecture.md`).
// Assembles the existing content/engine modules behind the `ContentPack`
// seam, by re-export — L1 migration step 2. The modules themselves are not
// rewritten here; this file only wires their existing exports into the
// shape the engine now consumes.
import type { ContentPack, EpiphanyDef } from '../types';
// Side effect: registers ANAMNESIS's whole text catalog (every language and
// version) the first time this pack module is imported.
import '../../content/text';
import { allRooms } from '../../content/rooms';
import { endings } from '../../content/endings';
import {
  ACT_POOLS,
  GATES,
  ACT4_SEQUENCE,
  UNDERSTORY_SEQUENCE,
  PROLOGUE,
  OPTIONAL_PER_ACT,
  ACT_NAMES_EN,
} from '../../content/graph';
import {
  evaluateEnding,
  anamnesisAvailable,
  punchlineUnlocked,
  computeAnamnesisEligible,
  ANAMNESIS_LUCIDITY,
  endingsTotal,
  epitaphLines,
  axisTriptych,
} from '../../engine/endings';
import { usherDoorBark, actIntroText } from '../../content/usher';
import { usherFigure } from '../../scene/themes';
import { SPEAKER_PREFIXES } from '../../ui/textPanel';
import { HEART_SVG } from '../../ui/dom';
import { KEEPSAKES, KEEPSAKE_TRIGGERS, keepsakeIcons } from '../../content/keepsakes';
import { EPIPHANY_IDS, EPIPHANY_EN_FALLBACK } from '../../engine/ledger';
import { iconFor, endingIcons } from '../../content/icons';
import { buildTheme, MOOD_TINTS, FOG_COLOR_BY_THEME } from '../../scene/themes';
import { dioramaFor } from '../../scene/dioramas';

// Formerly private to `engine/flow.ts` — the pack now owns this content data;
// flow.ts reads it via `pack.guide.examinedActBarkFallback` / `pack.audio.roomAccents`.
const EXAMINED_ACT_BARK_FALLBACK: Record<1 | 2 | 3 | 4, string> = {
  1: 'Usher: Would you have chosen the same in front of witnesses? Would that have been better — or only nicer?',
  2: 'Usher: When the machine is right, does it matter why?',
  3: 'Usher: Which of your reasons tonight were yours, and which were rehearsals?',
  4: 'Usher: If no one could ever know, walk the corridor again. Anything change?',
};

const ROOM_ACCENTS: ContentPack['audio']['roomAccents'] = {
  junction: 'junction',
  'casino-pascal': 'casino',
  ship: 'ship',
};

const epiphanies: EpiphanyDef[] = EPIPHANY_IDS.map((id) => ({ id, fallback: EPIPHANY_EN_FALLBACK[id] }));

export const anamnesisPack: ContentPack = {
  meta: {
    id: 'anamnesis',
    title: 'ANAMNESIS',
    exportPrefix: 'anamnesis',
  },

  rooms: allRooms,
  endings,

  graph: {
    prologue: PROLOGUE,
    actPools: ACT_POOLS,
    gates: GATES,
    act4Sequence: ACT4_SEQUENCE,
    understorySequence: UNDERSTORY_SEQUENCE,
    optionalPerAct: OPTIONAL_PER_ACT,
    actNamesEn: ACT_NAMES_EN,
  },

  endingRules: {
    evaluate: evaluateEnding,
    hiddenChoiceAvailable: anamnesisAvailable,
    hiddenDoorUnlocked: punchlineUnlocked,
    computeHiddenEligible: computeAnamnesisEligible,
    clarityThreshold: ANAMNESIS_LUCIDITY,
    endingsTotal,
    epitaphLines,
    hiddenUntilWitnessed: ['anamnesis'],
    axisTriptych,
  },

  guide: {
    speakerPrefixes: SPEAKER_PREFIXES,
    doorBark: usherDoorBark,
    actIntroText,
    examinedActBarkFallback: EXAMINED_ACT_BARK_FALLBACK,
    figure: usherFigure,
  },

  skin: {
    heartsSvg: HEART_SVG,
  },

  keepsakes: KEEPSAKES,
  keepsakeTriggers: KEEPSAKE_TRIGGERS,
  keepsakeIcons,

  epiphanies,

  visuals: {
    iconFor,
    endingIcons,
    buildTheme,
    moodTints: MOOD_TINTS,
    fogColorByTheme: FOG_COLOR_BY_THEME,
    dioramaFor,
    dioramaAccentHooks: [{ roomId: 'marys-room', choiceId: 'open-drawer' }],
    supportsLightTheme: false,
  },

  audio: {
    roomAccents: ROOM_ACCENTS,
  },

  hooks: {
    finalGateId: 'door-that-asks',
    lastMessageId: 'last-message',
  },

  // The static side-effect import above already registered the catalog by
  // the time any caller reaches this — see the comment on that import.
  registerText: () => {},
};
