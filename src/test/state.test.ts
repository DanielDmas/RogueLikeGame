import { describe, expect, it } from 'vitest';
import { applyEffects, LUCIDITY_FLOOR, MAX_HEARTS, newRun, pickShadowMoments } from '../engine/gameState';

describe('state reducers', () => {
  it('starts with 3 hearts, 0 lucidity, neutral axes', () => {
    const s = newRun();
    expect(s.hearts).toBe(MAX_HEARTS);
    expect(s.lucidity).toBe(0);
    expect(s.axes).toEqual({ reasonFeeling: 0, selfOthers: 0, controlAcceptance: 0 });
  });

  it('applies lucidity and axis deltas immutably', () => {
    const s = newRun();
    const next = applyEffects(s, { lucidity: 15, axes: { selfOthers: 12 } });
    expect(next.lucidity).toBe(15);
    expect(next.axes.selfOthers).toBe(12);
    expect(s.lucidity).toBe(0);
    expect(s.axes.selfOthers).toBe(0);
  });

  it('clamps axes to [-100, 100]', () => {
    let s = newRun();
    for (let i = 0; i < 20; i++) s = applyEffects(s, { axes: { reasonFeeling: -18 } });
    expect(s.axes.reasonFeeling).toBe(-100);
    for (let i = 0; i < 40; i++) s = applyEffects(s, { axes: { reasonFeeling: 18 } });
    expect(s.axes.reasonFeeling).toBe(100);
  });

  it('clamps hearts to [0, MAX]', () => {
    let s = newRun();
    s = applyEffects(s, { hearts: -5 });
    expect(s.hearts).toBe(0);
    s = applyEffects(s, { hearts: +9 });
    expect(s.hearts).toBe(MAX_HEARTS);
  });

  it('drains a heart and resets to the floor when lucidity goes below zero', () => {
    let s = newRun();
    s = applyEffects(s, { lucidity: 10 });
    s = applyEffects(s, { lucidity: -25 });
    expect(s.hearts).toBe(MAX_HEARTS - 1);
    expect(s.lucidity).toBe(LUCIDITY_FLOOR);
  });

  it('deduplicates flags and records memory loss', () => {
    let s = newRun();
    s = applyEffects(s, { flags: ['usher-respect'] });
    s = applyEffects(s, { flags: ['usher-respect'], loseMemory: true });
    expect(s.flags).toEqual(['usher-respect']);
    expect(s.memoryLost).toBe(true);
  });
});

describe('RunState.prior — the previous-run snapshot (Milestone 5, Phase K4)', () => {
  it('newRun() with no prior argument leaves prior undefined (first-ever run / legacy save)', () => {
    expect(newRun().prior).toBeUndefined();
  });

  it('newRun(doorSeed, prior) stamps prior verbatim and leaves it untouched by later effects', () => {
    const prior = { runs: 2, endingId: 'return', transcript: [{ roomId: 'wallet', stageIndex: 0, choiceId: 'take', choiceText: 'Take it.' }] };
    let s = newRun(7, prior);
    expect(s.prior).toEqual(prior);
    s = applyEffects(s, { lucidity: 10, flags: ['x'] });
    expect(s.prior).toEqual(prior); // applyEffects never touches prior
  });
});

describe('pickShadowMoments — the-cave\'s shadow-play selection (Milestone 5, Phase K4)', () => {
  const entry = (roomId: string, choiceId: string) => ({ roomId, stageIndex: 0, choiceId, choiceText: `${roomId}:${choiceId}` });

  it('returns an empty array when prior is undefined', () => {
    expect(pickShadowMoments(undefined)).toEqual([]);
  });

  it('returns an empty array when prior.transcript is empty', () => {
    expect(pickShadowMoments({ runs: 1, endingId: null, transcript: [] })).toEqual([]);
  });

  it('passes a transcript of 3 or fewer entries straight through, unchanged', () => {
    const transcript = [entry('a', '1'), entry('b', '2')];
    expect(pickShadowMoments({ runs: 1, endingId: null, transcript })).toEqual(transcript);
  });

  it('picks first, middle, and last for a longer transcript', () => {
    const transcript = Array.from({ length: 15 }, (_, i) => entry(`room${i}`, 'c'));
    const picked = pickShadowMoments({ runs: 1, endingId: null, transcript });
    expect(picked).toEqual([transcript[0], transcript[7], transcript[14]]);
  });
});
