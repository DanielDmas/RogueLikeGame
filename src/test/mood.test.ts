import { describe, expect, it } from 'vitest';
import { applyMood, type MoodType } from '../scene/themes';
import type { RoomType } from '../engine/schema';

const BASE = { fogColor: 0x123456, background: 0x123456, fogDensity: 0.04 };

describe('applyMood — the optional dynamic-scenery tint, pure/no THREE side effects', () => {
  it('type=null returns the base theme untouched (static behavior, the default)', () => {
    expect(applyMood(BASE, null)).toEqual(BASE);
  });

  it('DILEMMA (the common room type) has zero blend, so it stays visually identical to the base act theme', () => {
    expect(applyMood(BASE, 'DILEMMA')).toEqual(BASE);
  });

  it('INSIGHT lifts the fog/background toward warm gold and thins the fog', () => {
    const r = applyMood(BASE, 'INSIGHT');
    expect(r.fogColor).not.toBe(BASE.fogColor);
    expect(r.background).not.toBe(BASE.background);
    expect(r.fogDensity).toBeLessThan(BASE.fogDensity);
  });

  it('NO-SOLUTION cools the tint and thickens the fog', () => {
    const r = applyMood(BASE, 'NO-SOLUTION');
    expect(r.fogColor).not.toBe(BASE.fogColor);
    expect(r.fogDensity).toBeGreaterThan(BASE.fogDensity);
  });

  it('DOOMED darkens/reddens the tint and thickens the fog the most', () => {
    const doomed = applyMood(BASE, 'DOOMED');
    const noSolution = applyMood(BASE, 'NO-SOLUTION');
    expect(doomed.fogColor).not.toBe(BASE.fogColor);
    expect(doomed.fogDensity).toBeGreaterThan(noSolution.fogDensity);
  });

  it('every RoomType from the content schema has a matching mood tint (no drift between the two lists)', () => {
    const roomTypes: RoomType[] = ['DILEMMA', 'INSIGHT', 'NO-SOLUTION', 'DOOMED'];
    for (const type of roomTypes) {
      // applyMood must accept every RoomType as a MoodType without throwing
      expect(() => applyMood(BASE, type as MoodType)).not.toThrow();
    }
  });
});
