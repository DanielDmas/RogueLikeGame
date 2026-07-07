import { describe, expect, it, afterEach } from 'vitest';
import { allRooms } from '../content/rooms';
import { endings } from '../content/endings';
import '../content/text'; // registers v1-en + cs + fa packs (side effect)
import { getLocale, nextLang, register, setLocale, t } from '../content/text/resolver';
import {
  actIntroKey,
  actNameKey,
  endingBeatKey,
  endingEpitaphKey,
  endingTitleKey,
  epiphanyKey,
  roomDoorHintKey,
  roomTeaserKey,
  roomTitleKey,
  usherBarkKey,
} from '../content/text/keys';
import { EPIPHANY_IDS } from '../engine/ledger';
import { actIntroText, usherDoorBark } from '../content/usher';
import { newRun } from '../engine/gameState';

const LANGS = ['cs', 'fa'] as const;
const USHER_BARK_IDS = [
  'understory-hint',
  'second-run',
  'reason-low',
  'reason-high',
  'self-low',
  'self-high',
  'control-low',
  'control-high',
  'one-heart',
  'high-lucidity',
  'generic0',
  'generic1',
  'generic2',
  'generic3',
  'generic4',
  'generic5',
  'generic6',
  'generic7',
  'gate-single-door',
  'first-choice-explainer',
  'first-heart-loss',
  'remembered-room',
  'examined-act1',
  'examined-act2',
  'examined-act3',
  'examined-act4',
];

describe('i18n — Czech and Farsi coverage of navigation/structural text', () => {
  afterEach(() => setLocale('en', 'v2'));

  for (const lang of LANGS) {
    it(`every room's title/doorHint/teaser has a ${lang} translation distinct from the English fallback`, () => {
      setLocale(lang, 'v2');
      for (const room of allRooms) {
        const title = t(roomTitleKey(room.id), room.title);
        const hint = t(roomDoorHintKey(room.id), room.doorHint);
        const teaser = t(roomTeaserKey(room.id), room.teaser);
        expect(title, `room ${room.id} missing ${lang} title`).not.toBe(room.title);
        expect(hint, `room ${room.id} missing ${lang} doorHint`).not.toBe(room.doorHint);
        expect(teaser, `room ${room.id} missing ${lang} teaser`).not.toBe(room.teaser);
      }
    });

    it(`every ending's title/epitaph has a ${lang} translation distinct from the English fallback`, () => {
      setLocale(lang, 'v2');
      for (const ending of endings) {
        const title = t(endingTitleKey(ending.id), ending.title);
        const epitaph = t(endingEpitaphKey(ending.id), ending.epitaph);
        expect(title, `ending ${ending.id} missing ${lang} title`).not.toBe(ending.title);
        expect(epitaph, `ending ${ending.id} missing ${lang} epitaph`).not.toBe(ending.epitaph);
      }
    });

    it(`every act name and intro has a ${lang} translation`, () => {
      setLocale(lang, 'v2');
      for (const act of [0, 1, 2, 3, 4]) {
        expect(t(actNameKey(act), `__missing_${act}`), `act ${act} name missing ${lang}`).not.toBe(`__missing_${act}`);
      }
      for (const act of [1, 2, 3, 4]) {
        expect(t(actIntroKey(act), `__missing_${act}`), `act ${act} intro missing ${lang}`).not.toBe(`__missing_${act}`);
      }
    });

    it(`every usher door-bark bucket has a ${lang} translation`, () => {
      setLocale(lang, 'v2');
      for (const id of USHER_BARK_IDS) {
        expect(t(usherBarkKey(id), `__missing_${id}`), `usher bark ${id} missing ${lang}`).not.toBe(`__missing_${id}`);
      }
    });

    it(`every epiphany line has a ${lang} translation (Milestone 5, Phase P)`, () => {
      setLocale(lang, 'v2');
      for (const id of EPIPHANY_IDS) {
        expect(t(epiphanyKey(id), `__missing_${id}`), `epiphany ${id} missing ${lang}`).not.toBe(`__missing_${id}`);
      }
    });
  }
});

describe('Milestone 5, Phase R7 — persona whisper pass ({name} token survives translation)', () => {
  afterEach(() => setLocale('en', 'v2'));

  const ALL_LANGS = ['en', 'cs', 'fa'] as const;

  it("Act III's intro addresses {name}, in every language", () => {
    for (const lang of ALL_LANGS) {
      setLocale(lang, 'v2');
      expect(actIntroText(3), `act 3 intro missing {name} in ${lang}`).toContain('{name}');
    }
  });

  it("the new generic7 Usher bark addresses {name}, in every language", () => {
    // A RunState with no axis-reactive/one-heart/high-lucidity bark
    // triggered, runsCompleted 0, and visited.length % 8 === 7 selects
    // exactly the 8th (index 7) generic bark — generic7.
    const s = { ...newRun(), act: 2 as const, visited: Array(15).fill('room') };
    for (const lang of ALL_LANGS) {
      setLocale(lang, 'v2');
      expect(usherDoorBark(s, 0), `generic7 bark missing {name} in ${lang}`).toContain('{name}');
    }
  });

  it("the return ending's final beat addresses {name}, in every language", () => {
    const raw = endings.find((e) => e.id === 'return')!.beats[5] as string;
    for (const lang of ALL_LANGS) {
      setLocale(lang, 'v2');
      expect(t(endingBeatKey('return', 5), raw), `return ending final beat missing {name} in ${lang}`).toContain(
        '{name}',
      );
    }
  });
});

describe('resolver — locale fallback chain', () => {
  afterEach(() => setLocale('en', 'v2'));

  it('setLocale/getLocale round-trips', () => {
    setLocale('cs', 'v1');
    expect(getLocale()).toEqual({ lang: 'cs', version: 'v1' });
  });

  it('an untranslated key gracefully falls back to the English fallback text', () => {
    setLocale('fa', 'v2');
    expect(t('room.does-not-exist.title', 'Fallback Title')).toBe('Fallback Title');
  });

  it('v1 English requests hit the extracted v1 pack, not the v2 fallback', () => {
    setLocale('en', 'v1');
    // the prologue's v1 "USHER: Ah. You're awake..." line differs from the v2 rewrite
    const v1Text = t('room.waiting-room.stage0.beat5', 'Usher: You are awake. That is either very good news, or the worst kind. I have stopped guessing which.');
    expect(v1Text).toContain('USHER:');
  });

  it('a dynamic (function) beat override receives the RunState it is called with', () => {
    setLocale('en', 'v1');
    // room.ship.stage0.beat4 is registered as a function in v1-en-dynamic.ts,
    // branching on s.memoryLost — different states must resolve to different text.
    const withLoss = t('room.ship.stage0.beat4', 'fallback', { memoryLost: true });
    const withoutLoss = t('room.ship.stage0.beat4', 'fallback', { memoryLost: false });
    expect(withLoss).not.toBe(withoutLoss);
    expect(withLoss).not.toBe('fallback');
  });

  it('regression: a v2/English request must NOT leak the v1 pack, even when a v1/en entry exists for the same key', () => {
    // usher.bark.generic0 has a registered v1/en override (the old sitcom-y
    // line). Requesting it under the default v2/English locale must resolve
    // to the caller's inline v2 fallback, not silently detour through v1 —
    // that detour previously made the "v2 rewrite" invisible by default.
    setLocale('en', 'v2');
    const v2Fallback = 'Usher: this is the v2 line, not the v1 one';
    expect(t('usher.bark.generic0', v2Fallback)).toBe(v2Fallback);
  });

  it('v2 + non-English still degrades to the v1 translation for that language before falling to the v2 fallback', () => {
    // Simulate a key with only a v1/cs translation registered (no v2/cs yet).
    register('test.v1-only-cs-key', 'v1', 'cs', 'Český text (v1)');
    setLocale('cs', 'v2');
    expect(t('test.v1-only-cs-key', 'English v2 fallback')).toBe('Český text (v1)');
  });

  it('v1 + non-English prefers the reader\'s language (v2/cs) over jumping to English (v1/en)', () => {
    // A key with a v2/cs translation but no v1/cs translation yet.
    register('test.v2-only-cs-key', 'v2', 'cs', 'Český text (v2)');
    register('test.v2-only-cs-key', 'v1', 'en', 'English text (v1)');
    setLocale('cs', 'v1');
    expect(t('test.v2-only-cs-key', 'English v2 fallback')).toBe('Český text (v2)');
  });
});

describe('nextLang — the HUD quick-switch and Settings screen share this cycle', () => {
  it('cycles en -> cs -> fa -> en', () => {
    expect(nextLang('en')).toBe('cs');
    expect(nextLang('cs')).toBe('fa');
    expect(nextLang('fa')).toBe('en');
  });
});
