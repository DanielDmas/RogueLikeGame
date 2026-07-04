import { describe, expect, it } from 'vitest';
import { applyEffects, LUCIDITY_FLOOR, MAX_HEARTS, newRun } from '../engine/gameState';

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
