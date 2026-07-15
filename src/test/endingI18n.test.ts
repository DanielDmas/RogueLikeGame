import { afterEach, describe, expect, it } from 'vitest';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';
import type { ContentPack } from '../packs/types';
import { setLocale } from '../engine/text/resolver';
import { newRun } from '../engine/gameState';

/**
 * Regression guard for a real bug found in code review (2026-07-15, Fable
 * pass): `axisTriptych` (both packs) and LIMERENCE's own `epitaphLines`
 * rendered English on every end screen in every language, because neither
 * threaded its lines through `t()`. `translationKeyValidity.test.ts` only
 * checks that *some* translation is registered under the right key — it
 * never actually calls the render-path function under a non-English locale
 * and checks the output changed, which is exactly the class of bug this
 * closes. `limerenceAct4.test.ts`'s existing epitaphLines test is titled
 * "...then translated epitaphs..." but never actually sets a locale or
 * checks for non-English output — this is the test that title implied.
 */

const packs: { pack: ContentPack; name: string }[] = [
  { pack: anamnesisPack, name: 'ANAMNESIS' },
  { pack: limerencePack, name: 'LIMERENCE' },
];
const LANGS = ['cs', 'de', 'fa', 'fr'] as const;

describe('end-screen axis triptych and epitaph wall are genuinely translated, not English in every locale', () => {
  afterEach(() => setLocale('en', 'v2'));

  for (const { pack, name } of packs) {
    it(`${name}: axisTriptych returns English under the default (en) locale`, () => {
      setLocale('en', 'v2');
      const lines = pack.endingRules.axisTriptych(newRun());
      expect(lines).toHaveLength(3);
      for (const line of lines) expect(line.length).toBeGreaterThan(5);
    });

    for (const lang of LANGS) {
      it(`${name}: axisTriptych's 3 lines are all non-English under ${lang}, for a negative/mid/positive axis profile`, () => {
        setLocale('en', 'v2');
        const englishNeg = pack.endingRules.axisTriptych({ ...newRun(), axes: { reasonFeeling: -30, selfOthers: -30, controlAcceptance: -30 } });
        const englishMid = pack.endingRules.axisTriptych(newRun());
        const englishPos = pack.endingRules.axisTriptych({ ...newRun(), axes: { reasonFeeling: 30, selfOthers: 30, controlAcceptance: 30 } });

        setLocale(lang, 'v2');
        const neg = pack.endingRules.axisTriptych({ ...newRun(), axes: { reasonFeeling: -30, selfOthers: -30, controlAcceptance: -30 } });
        const mid = pack.endingRules.axisTriptych(newRun());
        const pos = pack.endingRules.axisTriptych({ ...newRun(), axes: { reasonFeeling: 30, selfOthers: 30, controlAcceptance: 30 } });

        neg.forEach((line, i) => expect(line, `neg axis ${i}`).not.toBe(englishNeg[i]));
        mid.forEach((line, i) => expect(line, `mid axis ${i}`).not.toBe(englishMid[i]));
        pos.forEach((line, i) => expect(line, `pos axis ${i}`).not.toBe(englishPos[i]));
      });

      it(`${name}: epitaphLines' wall entries are all non-English under ${lang}`, () => {
        const ids = pack.endings.slice(0, 2).map((e) => e.id);
        setLocale('en', 'v2');
        const english = pack.endingRules.epitaphLines(ids);
        expect(english).toHaveLength(2);

        setLocale(lang, 'v2');
        const translated = pack.endingRules.epitaphLines(ids);
        expect(translated).toHaveLength(2);
        translated.forEach((line, i) => expect(line, `epitaph ${ids[i]}`).not.toBe(english[i]));
      });
    }
  }
});
