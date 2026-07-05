import { describe, expect, it, afterEach } from 'vitest';
import { allRooms } from '../content/rooms';
import { endings } from '../content/endings';
import '../content/text'; // registers v1-en + cs + fa packs (side effect)
import { getLocale, setLocale, t } from '../content/text/resolver';
import {
  actIntroKey,
  actNameKey,
  endingEpitaphKey,
  endingTitleKey,
  roomDoorHintKey,
  roomTeaserKey,
  roomTitleKey,
  usherBarkKey,
} from '../content/text/keys';

const LANGS = ['cs', 'fa'] as const;
const USHER_BARK_IDS = [
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
  }
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
});
