import { describe, expect, it } from 'vitest';
import { ACT_PROGRESSIONS, ACT_MOTE_SCALES, SoundEngine, pickMote, type ActKey } from '../audio/soundEngine';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';
import type { ContentPack } from '../packs/types';

const ACTS: ActKey[] = [0, 1, 2, 3, 4, 5];

describe('SoundEngine.configurePack — defaults to ANAMNESIS, overridable per pack', () => {
  it('a fresh engine (before configurePack) uses ANAMNESIS’s own progressions/scales', () => {
    const engine = new SoundEngine();
    for (const act of ACTS) {
      expect(engine.getActProgressions(act)).toBe(ACT_PROGRESSIONS[act]);
      expect(engine.getActMoteScales(act)).toBe(ACT_MOTE_SCALES[act]);
    }
  });

  it('configurePack({}) (a pack with no audio override) leaves ANAMNESIS’s defaults in place', () => {
    const engine = new SoundEngine();
    engine.configurePack({});
    for (const act of ACTS) {
      expect(engine.getActProgressions(act)).toBe(ACT_PROGRESSIONS[act]);
    }
  });

  it('configurePack(anamnesisPack.audio) is a no-op (ANAMNESIS has no override, by design)', () => {
    const engine = new SoundEngine();
    engine.configurePack(anamnesisPack.audio);
    for (const act of ACTS) {
      expect(engine.getActProgressions(act)).toBe(ACT_PROGRESSIONS[act]);
      expect(engine.getActMoteScales(act)).toBe(ACT_MOTE_SCALES[act]);
    }
  });

  it('configurePack(limerencePack.audio) actually swaps in LIMERENCE’s own progressions/scales', () => {
    const engine = new SoundEngine();
    engine.configurePack(limerencePack.audio);
    for (const act of ACTS) {
      expect(engine.getActProgressions(act)).toBe(limerencePack.audio.actProgressions![act]);
      expect(engine.getActMoteScales(act)).toBe(limerencePack.audio.actMoteScales![act]);
      // and it should differ from ANAMNESIS's own for at least the chord voicing
      expect(engine.getActProgressions(act)).not.toBe(ACT_PROGRESSIONS[act]);
    }
  });

  it('calling configurePack twice with different packs, the second call wins', () => {
    const engine = new SoundEngine();
    engine.configurePack(limerencePack.audio);
    engine.configurePack(anamnesisPack.audio);
    for (const act of ACTS) {
      expect(engine.getActProgressions(act)).toBe(ACT_PROGRESSIONS[act]);
    }
  });
});

describe.each([
  { name: 'anamnesis', pack: anamnesisPack as ContentPack },
  { name: 'limerence', pack: limerencePack as ContentPack },
])('pack.audio — structural integrity ($name)', ({ pack }) => {
  it('if actProgressions is supplied, every act has >= 1 chord of exactly 3 voices', () => {
    if (!pack.audio.actProgressions) return;
    for (const act of ACTS) {
      const progression = pack.audio.actProgressions[act];
      expect(progression.length).toBeGreaterThanOrEqual(1);
      for (const chord of progression) expect(chord).toHaveLength(3);
    }
  });

  it('if actMoteScales is supplied, every act has a non-empty scale', () => {
    if (!pack.audio.actMoteScales) return;
    for (const act of ACTS) {
      expect(pack.audio.actMoteScales[act].length).toBeGreaterThan(0);
    }
  });

  it('every room accent key names a real room (structural — also checked by packConformance)', () => {
    const roomIds = new Set(pack.rooms.map((r) => r.id));
    for (const id of Object.keys(pack.audio.roomAccents)) {
      expect(roomIds.has(id)).toBe(true);
    }
  });
});

describe('LIMERENCE progressions — minor-leaning, resolving to a held major ending chord', () => {
  const LIMERENCE_PROGRESSIONS = limerencePack.audio.actProgressions!;

  // A chord [r, third, fifth] reads as minor when the third sits a minor
  // third (~1.189x) above the root rather than a major third (~1.26x).
  function isMinorTriad([root, third]: number[]): boolean {
    const ratio = third / root;
    return Math.abs(ratio - Math.pow(2, 3 / 12)) < 0.01;
  }
  function isMajorTriad([root, third]: number[]): boolean {
    const ratio = third / root;
    return Math.abs(ratio - Math.pow(2, 4 / 12)) < 0.01;
  }

  it('every triad in every act is a recognizable major or minor chord (no accidental dissonant voicing)', () => {
    for (const act of ACTS) {
      for (const chord of LIMERENCE_PROGRESSIONS[act]) {
        expect(isMinorTriad(chord) || isMajorTriad(chord), `act ${act} chord ${JSON.stringify(chord)} is neither a clean minor nor major triad`).toBe(true);
      }
    }
  });

  it('most floors (acts 0-3) lead with a minor chord — the melancholic register', () => {
    for (const act of [0, 1, 2, 3] as const) {
      expect(isMinorTriad(LIMERENCE_PROGRESSIONS[act][0]), `act ${act} does not open on a minor chord`).toBe(true);
    }
  });

  it('the ending (act 5) is a single held major chord — resolving, not bleak', () => {
    expect(LIMERENCE_PROGRESSIONS[5]).toHaveLength(1);
    expect(isMajorTriad(LIMERENCE_PROGRESSIONS[5][0])).toBe(true);
  });
});

describe('pickMote — accepts a per-pack scale override', () => {
  it('defaults to ACT_MOTE_SCALES when no scales param given', () => {
    expect(ACT_MOTE_SCALES[1]).toContain(pickMote(1, () => 0));
  });

  it('with an explicit scales param, only picks from that scale', () => {
    const customScale = { 0: [1000], 1: [1000], 2: [1000], 3: [1000], 4: [1000], 5: [1000] } as Record<ActKey, number[]>;
    for (let i = 0; i < 10; i++) {
      expect(pickMote(1, Math.random, customScale)).toBe(1000);
    }
  });
});
