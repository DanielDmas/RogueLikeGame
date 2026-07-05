import { describe, expect, it } from 'vitest';
import { ACT_MOTE_SCALES, ACT_PROGRESSIONS, jitterSeconds, pickMote, SoundEngine } from '../audio/soundEngine';

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

describe('audio — volume sliders (no AudioContext required)', () => {
  it('defaults to on with a non-zero level for both buses', () => {
    const engine = new SoundEngine();
    expect(engine.getMusicLevel()).toBeGreaterThan(0);
    expect(engine.getSfxLevel()).toBeGreaterThan(0);
  });

  it('volume is only audible while its bus is enabled', () => {
    const engine = new SoundEngine();
    engine.setMusicVolume(0.6);
    expect(engine.getMusicLevel()).toBeCloseTo(0.6, 5);
    engine.setMusicEnabled(false);
    expect(engine.getMusicLevel()).toBe(0);
    engine.setMusicEnabled(true);
    expect(engine.getMusicLevel()).toBeCloseTo(0.6, 5);
  });

  it('sfx volume behaves independently of music volume', () => {
    const engine = new SoundEngine();
    engine.setMusicVolume(0.2);
    engine.setSfxVolume(0.9);
    expect(engine.getMusicLevel()).toBeCloseTo(0.2, 5);
    expect(engine.getSfxLevel()).toBeCloseTo(0.9, 5);
  });

  it('volume is clamped to [0, 1] regardless of input', () => {
    const engine = new SoundEngine();
    engine.setMusicVolume(5);
    expect(engine.getMusicLevel()).toBe(1);
    engine.setMusicVolume(-3);
    expect(engine.getMusicLevel()).toBe(0);
    engine.setSfxVolume(2);
    expect(engine.getSfxLevel()).toBe(1);
  });

  it('setting volume before any AudioContext exists does not throw', () => {
    const engine = new SoundEngine();
    expect(() => {
      engine.setMusicVolume(0.4);
      engine.setSfxVolume(0.4);
      engine.setMusicEnabled(false);
      engine.setSfxEnabled(false);
    }).not.toThrow();
  });
});
