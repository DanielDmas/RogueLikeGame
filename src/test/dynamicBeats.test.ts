import { describe, expect, it, afterEach } from 'vitest';
import '../content/text'; // registers all translation packs including the 10 dynamic v2 beats
import { setLocale, t } from '../content/text/resolver';
import { roomBeatKey, roomChoiceOutcomeKey } from '../content/text/keys';
import { newRun } from '../engine/gameState';
import type { RunState } from '../content/schema';

const LANGS = ['cs', 'fa'] as const;

function withTranscript(roomId: string, choiceId: string): RunState {
  const s = newRun();
  return { ...s, transcript: [{ roomId, stageIndex: 0, choiceId, choiceText: '' }] };
}

function withFlag(flag: string): RunState {
  const s = newRun();
  return { ...s, flags: [flag] };
}

describe('the 9 v2 dynamic (RunState-dependent) beats resolve translated text in every branch', () => {
  afterEach(() => setLocale('en', 'v2'));

  for (const lang of LANGS) {
    it(`junction.stage1.beat3 — pull/no-pull/neither branches all translate to ${lang}`, () => {
      setLocale(lang, 'v2');
      const key = roomBeatKey('junction', 1, 3);
      const pull = t(key, 'fallback', withTranscript('junction', 'pull'));
      const noPull = t(key, 'fallback', withTranscript('junction', 'no-pull'));
      const neither = t(key, 'fallback', newRun());
      expect(pull).not.toBe('fallback');
      expect(noPull).not.toBe('fallback');
      expect(neither).not.toBe('fallback');
      expect(new Set([pull, noPull, neither]).size).toBe(3);
    });

    it(`junction choice push/no-push outcome1 — both branches translate to ${lang}`, () => {
      setLocale(lang, 'v2');
      for (const choiceId of ['push', 'no-push'] as const) {
        const key = roomChoiceOutcomeKey('junction', choiceId, 1);
        const pull = t(key, 'fallback', withTranscript('junction', 'pull'));
        const other = t(key, 'fallback', newRun());
        expect(pull, `${choiceId} pulled-branch`).not.toBe('fallback');
        expect(other, `${choiceId} other-branch`).not.toBe('fallback');
        expect(pull).not.toBe(other);
      }
    });

    it(`ship.stage0.beat4 — memoryLost true/false both translate to ${lang}`, () => {
      setLocale(lang, 'v2');
      const key = roomBeatKey('ship', 0, 4);
      const lost = t(key, 'fallback', { ...newRun(), memoryLost: true });
      const intact = t(key, 'fallback', { ...newRun(), memoryLost: false });
      expect(lost).not.toBe('fallback');
      expect(intact).not.toBe('fallback');
      expect(lost).not.toBe(intact);
    });

    it(`teleporter.stage0.beat3 — pattern/neither/none-of-ship branches all translate to ${lang}`, () => {
      setLocale(lang, 'v2');
      const key = roomBeatKey('teleporter', 0, 3);
      const pattern = t(key, 'fallback', withTranscript('ship', 'pattern'));
      const neitherChoice = t(key, 'fallback', withTranscript('ship', 'neither'));
      const noShipVisit = t(key, 'fallback', newRun());
      expect(pattern).not.toBe('fallback');
      expect(neitherChoice).not.toBe('fallback');
      expect(noShipVisit).not.toBe('fallback');
      expect(new Set([pattern, neitherChoice, noShipVisit]).size).toBe(3);
    });

    it(`door-that-asks.stage0.beat2 — lever-flag branches (pulled/kept/refused/none) all translate to ${lang}`, () => {
      setLocale(lang, 'v2');
      const key = roomBeatKey('door-that-asks', 0, 2);
      const pulled = t(key, 'fallback', withFlag('pulled-lever'));
      const kept = t(key, 'fallback', withFlag('kept-lever'));
      const refused = t(key, 'fallback', withFlag('refused-once'));
      const none = t(key, 'fallback', newRun());
      for (const [label, v] of [['pulled', pulled], ['kept', kept], ['refused', refused], ['none', none]] as const) {
        expect(v, label).not.toBe('fallback');
      }
      expect(new Set([pulled, kept, refused, none]).size).toBe(4);
    });

    it(`door-that-asks.stage0.beat3 — memoryLost/saved-photo/neither branches all translate to ${lang}`, () => {
      setLocale(lang, 'v2');
      const key = roomBeatKey('door-that-asks', 0, 3);
      const lost = t(key, 'fallback', { ...newRun(), memoryLost: true });
      const saved = t(key, 'fallback', withFlag('saved-photo'));
      const neither = t(key, 'fallback', newRun());
      expect(lost).not.toBe('fallback');
      expect(saved).not.toBe('fallback');
      expect(neither).not.toBe('fallback');
      expect(new Set([lost, saved, neither]).size).toBe(3);
    });

    it(`door-that-asks 'dont-remember' outcome0 — memoryLost true/false both translate to ${lang}`, () => {
      setLocale(lang, 'v2');
      const key = roomChoiceOutcomeKey('door-that-asks', 'dont-remember', 0);
      const lost = t(key, 'fallback', { ...newRun(), memoryLost: true });
      const intact = t(key, 'fallback', newRun());
      expect(lost).not.toBe('fallback');
      expect(intact).not.toBe('fallback');
      expect(lost).not.toBe(intact);
    });

    it(`door-that-asks.stage1.beat4 — punchline-unlocked branch translates to ${lang}`, () => {
      setLocale(lang, 'v2');
      const key = roomBeatKey('door-that-asks', 1, 4);
      const locked = t(key, 'fallback', newRun());
      expect(locked).not.toBe('fallback');
    });

    it(`butterfly-dream.stage0.beat2 — memoryLost true/false both translate to ${lang}`, () => {
      setLocale(lang, 'v2');
      const key = roomBeatKey('butterfly-dream', 0, 2);
      const lost = t(key, 'fallback', { ...newRun(), memoryLost: true });
      const intact = t(key, 'fallback', { ...newRun(), memoryLost: false });
      expect(lost).not.toBe('fallback');
      expect(intact).not.toBe('fallback');
      expect(lost).not.toBe(intact);
    });
  }
});
