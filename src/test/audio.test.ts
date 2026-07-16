import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  ACT_MOTE_SCALES,
  ACT_PROGRESSIONS,
  doorCreakFrequency,
  hoverPitch,
  jitterSeconds,
  makeImpulseSamples,
  pickMote,
  SoundEngine,
} from '../audio/soundEngine';

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

describe('audio — door hover pitch table (spec 07 §Q5.3, no AudioContext required)', () => {
  it('defaults to 880 Hz with no index (or a negative one)', () => {
    expect(hoverPitch()).toBe(880);
    expect(hoverPitch(-1)).toBe(880);
  });

  it('every door index resolves to a pentatonic offset above 880 Hz', () => {
    // [0, 2, 4, 7, 9] semitones above 880
    const expected = [0, 2, 4, 7, 9].map((semi) => 880 * Math.pow(2, semi / 12));
    for (let i = 0; i < 5; i++) {
      expect(hoverPitch(i)).toBeCloseTo(expected[i], 6);
    }
  });

  it('cycles for door indices beyond the table length', () => {
    expect(hoverPitch(5)).toBeCloseTo(hoverPitch(0), 6);
    expect(hoverPitch(6)).toBeCloseTo(hoverPitch(1), 6);
  });

  it('the same index always resolves to the same pitch — every hover source must agree', () => {
    expect(hoverPitch(3)).toBe(hoverPitch(3));
  });
});

describe('audio — door-creak filter frequency (item 7, no AudioContext required)', () => {
  it('defaults to 220 Hz with no index (or a negative one)', () => {
    expect(doorCreakFrequency()).toBe(220);
    expect(doorCreakFrequency(-1)).toBe(220);
  });

  it('every door index resolves to a pentatonic offset above 220 Hz, spread over 2 octaves', () => {
    const expected = [0, 2, 4, 7, 9].map((semi) => 220 * Math.pow(2, semi / 24));
    for (let i = 0; i < 5; i++) {
      expect(doorCreakFrequency(i)).toBeCloseTo(expected[i], 6);
    }
  });

  it('cycles for door indices beyond the table length, same as hoverPitch', () => {
    expect(doorCreakFrequency(5)).toBeCloseTo(doorCreakFrequency(0), 6);
    expect(doorCreakFrequency(6)).toBeCloseTo(doorCreakFrequency(1), 6);
  });

  it('stays in a distinctly lower register than hoverPitch at every index — the two layers never collide', () => {
    for (let i = 0; i < 5; i++) {
      expect(doorCreakFrequency(i)).toBeLessThan(hoverPitch(i));
    }
  });
});

describe('audio — reverb impulse samples (spec 07 §Q5.1, no AudioContext required)', () => {
  it('produces exactly sampleRate * duration samples', () => {
    const samples = makeImpulseSamples(1000, 1.8, 2.2, () => 0.5);
    expect(samples.length).toBe(1800);
  });

  it('every sample stays within [-1, 1]', () => {
    const samples = makeImpulseSamples(2000, 1.8, 2.2);
    for (const s of samples) {
      expect(s).toBeGreaterThanOrEqual(-1);
      expect(s).toBeLessThanOrEqual(1);
    }
  });

  it('decays — the envelope over the back half is quieter (in RMS) than over the front half', () => {
    const samples = makeImpulseSamples(4000, 1.8, 2.2, () => 1); // fixed rng isolates the decay envelope
    const half = Math.floor(samples.length / 2);
    const rms = (arr: Float32Array) => Math.sqrt(arr.reduce((sum, v) => sum + v * v, 0) / arr.length);
    const front = rms(samples.subarray(0, half));
    const back = rms(samples.subarray(half));
    expect(back).toBeLessThan(front);
  });

  it('is deterministic given a fixed rng, and varies with a different one', () => {
    const a = makeImpulseSamples(500, 1.8, 2.2, () => 0.5);
    const b = makeImpulseSamples(500, 1.8, 2.2, () => 0.5);
    expect(Array.from(a)).toEqual(Array.from(b));
    const c = makeImpulseSamples(500, 1.8, 2.2, () => 0.1);
    expect(Array.from(a)).not.toEqual(Array.from(c));
  });
});

describe('audio — hover with sfx disabled (SoundEngine method, no AudioContext exercised)', () => {
  // hover()/setRoomAccent() construct a real AudioContext on first use (as
  // every other sound-producing method already does — see
  // "no AudioContext required" above) — this vitest environment is Node,
  // with no AudioContext global, so only the sfx-disabled early-return path
  // (which never reaches ensureCtx()) is exercisable here; the browser UAT
  // suite covers the actually-audible path.
  it('does not throw while sfx is disabled, at any door index', () => {
    const engine = new SoundEngine();
    engine.setSfxEnabled(false);
    expect(() => engine.hover(2)).not.toThrow();
    expect(() => engine.hover()).not.toThrow();
  });
});

describe('audio — chord-voice LFO leak fix (Fable review M3, no AudioContext required)', () => {
  // crossfadeToChord() itself needs a real AudioContext (see the file-level
  // note above), so this is a source-level check — same convention as the
  // other Fable-review source-order regression tests this session
  // (resumableRun.test.ts) — that the fix's actual shape is present: each
  // voice's detune LFO is tracked in a parallel array and stopped at the
  // same instant its voice stops, not left running forever after its target
  // oscillator dies.
  it('crossfadeToChord tracks LFOs in a parallel array and stops the old ones alongside the old oscillators', () => {
    const src = readFileSync(new URL('../audio/soundEngine.ts', import.meta.url), 'utf8');
    const startIdx = src.indexOf('private crossfadeToChord(');
    const endIdx = src.indexOf('\n  }', startIdx);
    const body = src.slice(startIdx, endIdx);
    expect(body, 'crossfadeToChord not found').not.toBe('');
    expect(body).toMatch(/for \(const o of oldOscs\) o\.stop\(/);
    expect(body).toMatch(/for \(const lfo of oldLfos\) lfo\.stop\(/);
    expect(body).toContain('newLfos.push(lfo)');
    expect(body).toContain('this.chordLfos = newLfos');
  });
});
