import { describe, expect, it } from 'vitest';
import { ACT_MOTE_SCALES, ACT_PROGRESSIONS, jitterSeconds, pickMote } from '../audio/soundEngine';

describe('audio — dynamic ambient music data (no AudioContext required)', () => {
  it('every act has at least one chord, and every chord has three voices', () => {
    for (const act of [0, 1, 2, 3, 4, 5] as const) {
      const progression = ACT_PROGRESSIONS[act];
      expect(progression.length).toBeGreaterThanOrEqual(1);
      for (const chord of progression) expect(chord.length).toBe(3);
    }
  });

  it('most acts have more than one chord — this is what replaces the old single held tone', () => {
    const multiChordActs = ([0, 1, 2, 3, 4, 5] as const).filter((a) => ACT_PROGRESSIONS[a].length > 1);
    // every act except the held ending chord evolves over time
    expect(multiChordActs).toEqual([0, 1, 2, 3, 4]);
  });

  it('every act has a non-empty mote scale', () => {
    for (const act of [0, 1, 2, 3, 4, 5] as const) {
      expect(ACT_MOTE_SCALES[act].length).toBeGreaterThan(0);
    }
  });

  it('jitterSeconds stays within [min, max] and varies with the rng', () => {
    const lo = jitterSeconds(20, 40, () => 0);
    const hi = jitterSeconds(20, 40, () => 1);
    expect(lo).toBe(20);
    expect(hi).toBe(40);
    const mid = jitterSeconds(20, 40, () => 0.5);
    expect(mid).toBeGreaterThan(lo);
    expect(mid).toBeLessThan(hi);
  });

  it('pickMote always returns a frequency from the act\'s own scale', () => {
    for (const act of [0, 1, 2, 3, 4, 5] as const) {
      for (const r of [0, 0.25, 0.5, 0.75, 0.999]) {
        expect(ACT_MOTE_SCALES[act]).toContain(pickMote(act, () => r));
      }
    }
  });
});
