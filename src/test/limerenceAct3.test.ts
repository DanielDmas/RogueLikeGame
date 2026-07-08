import { describe, expect, it } from 'vitest';
import { newRun } from '../engine/gameState';
import { limerencePack } from '../packs/limerence';
import type { Room, RunState } from '../engine/schema';

const registry = new Map(limerencePack.rooms.map((r) => [r.id, r]));
function room(id: string): Room {
  const r = registry.get(id);
  if (!r) throw new Error(`room not found: ${id}`);
  return r;
}

const ACT3_REGULAR_IDS = [
  'the-colleague',
  'the-metamour',
  'the-veto',
  'the-drift',
  'the-second-account',
  'the-discovery',
  'the-wedding-eve',
  'the-therapist',
];

describe('LIMERENCE Act III — room-by-room content integrity (spec 04-rooms-act3.md)', () => {
  it('the Act III pool matches the graph exactly — 8 regular rooms + the secret room, no orphans', () => {
    expect(new Set(limerencePack.graph.actPools[3])).toEqual(new Set([...ACT3_REGULAR_IDS, 'the-usual-suite']));
  });

  it('every pool room + gate resolves to a real, distinct room with act=3', () => {
    for (const id of [...ACT3_REGULAR_IDS, 'the-usual-suite', 'the-usual-room']) {
      expect(room(id).act, `${id} should be act 3`).toBe(3);
    }
  });

  it('the-usual-suite is the only Act III pool room with a secret predicate, gated on prior.runs >= 1', () => {
    for (const id of ACT3_REGULAR_IDS) {
      expect(room(id).secret, `${id} should not be secret`).toBeUndefined();
    }
    const suite = room('the-usual-suite');
    expect(suite.secret).toBeDefined();
    expect(suite.secret!(newRun())).toBe(false);
    expect(suite.secret!({ ...newRun(), prior: { runs: 1, endingId: null, transcript: [] } })).toBe(true);
  });

  it('every regular pool room offers exactly 4 base choices in its first stage (excluding any additive ✧ keepsake bonus choice), each with 4-tradition reflections (except the-usual-suite, which is a 3-choice witnessing room)', () => {
    for (const id of ACT3_REGULAR_IDS) {
      const baseChoices = room(id).stages[0].choices.filter((c) => !c.keepsakeId);
      expect(baseChoices, `${id} should have 4 base choices`).toHaveLength(4);
      for (const c of baseChoices) {
        expect(c.reflections, `${id}/${c.id} has no reflections`).toBeDefined();
        expect(c.reflections).toHaveLength(4);
      }
    }
  });

  it('the-wedding-eve carries an additive ✧ bonus choice for the-cheap-ring, gated on holding it and additive-only', () => {
    const choices = room('the-wedding-eve').stages[0].choices;
    const bonus = choices.find((c) => c.keepsakeId === 'the-cheap-ring');
    expect(bonus, 'the-wedding-eve should have a the-cheap-ring bonus choice').toBeDefined();
    expect(bonus!.available).toBeDefined();
    expect(bonus!.available!({ ...newRun(), keepsakesHeld: [] })).toBe(false);
    expect(bonus!.available!({ ...newRun(), keepsakesHeld: ['the-cheap-ring'] })).toBe(true);
    const others = choices.filter((c) => c.id !== bonus!.id);
    expect(others).toHaveLength(4);
  });

  it('the-usual-suite offers 3 witnessing choices without reflections (matching ANAMNESIS’s the-cave convention)', () => {
    const choices = room('the-usual-suite').stages[0].choices;
    expect(choices).toHaveLength(3);
  });

  it('the-usual-room gate offers exactly 4 choices, each with reflections', () => {
    const choices = room('the-usual-room').stages[0].choices;
    expect(choices).toHaveLength(4);
    for (const c of choices) expect(c.reflections).toHaveLength(4);
  });

  it('the-usual-room is a real gate, NO-SOLUTION', () => {
    const r = room('the-usual-room');
    expect(r.gate).toBe(true);
    expect(r.type).toBe('NO-SOLUTION');
  });

  it('every regular pool room + gate offers 4 genuinely different choices (no two with identical effects)', () => {
    for (const id of [...ACT3_REGULAR_IDS, 'the-usual-room']) {
      const choices = room(id).stages[0].choices;
      const serialized = choices.map((c) => JSON.stringify(c.effects));
      expect(new Set(serialized).size, `${id} has duplicate-effect choices`).toBe(choices.length);
    }
  });

  it('the-colleague’s "walk-away" choice sets walked-away, the keepsake trigger for the-keycard', () => {
    const c = room('the-colleague').stages[0].choices.find((c) => c.id === 'walk-away')!;
    expect(c.effects.flags).toContain('walked-away');
    expect(limerencePack.keepsakeTriggers['walked-away']).toBe('the-keycard');
    expect(limerencePack.keepsakes.some((k) => k.id === 'the-keycard')).toBe(true);
    expect(c.keepsakeId).toBeUndefined();
  });

  it('the-second-account’s "delete-it" choice sets deleted-the-account, the keepsake trigger for the-sim', () => {
    const c = room('the-second-account').stages[0].choices.find((c) => c.id === 'delete-it')!;
    expect(c.effects.flags).toContain('deleted-the-account');
    expect(limerencePack.keepsakeTriggers['deleted-the-account']).toBe('the-sim');
    expect(limerencePack.keepsakes.some((k) => k.id === 'the-sim')).toBe(true);
    expect(c.keepsakeId).toBeUndefined();
  });

  it('the-veto’s "counter-veto" dynamic outcome beat recognizes the Act I symmetry-trap flag without throwing, and differs by flag state', () => {
    const c = room('the-veto').stages[0].choices.find((c) => c.id === 'counter-veto')!;
    const dynamicLine = c.outcome.find((b): b is (s: RunState) => string => typeof b === 'function')!;
    expect(dynamicLine).toBeDefined();
    const fresh = dynamicLine(newRun());
    const withTrap = dynamicLine({ ...newRun(), flags: ['symmetry-trap'] });
    expect(fresh).not.toBe(withTrap);
  });

  it('the-discovery’s dynamic opening beat reflects the waiting-to-be-caught flag from the-confession without throwing, and differs by flag state', () => {
    const r = room('the-discovery');
    const dynamicBeat = r.stages[0].beats.find((b): b is (s: RunState) => string => typeof b === 'function')!;
    expect(dynamicBeat).toBeDefined();
    const fresh = dynamicBeat(newRun());
    const caught = dynamicBeat({ ...newRun(), flags: ['waiting-to-be-caught'] });
    expect(fresh).not.toBe(caught);
  });

  it('every doorSeed-branched outcome beat in Act III resolves to a non-empty string across a range of seeds, without throwing', () => {
    const branchedRooms = ['the-metamour', 'the-discovery', 'the-wedding-eve'];
    const seeds = [0, 1, 2, 7, 42, 100];
    for (const id of branchedRooms) {
      const r = room(id);
      let sawFunctionBeat = false;
      for (const choice of r.stages[0].choices) {
        const dynamicLines = choice.outcome.filter((b): b is (s: RunState) => string => typeof b === 'function');
        if (dynamicLines.length === 0) continue;
        sawFunctionBeat = true;
        for (const line of dynamicLines) {
          for (const seed of seeds) {
            const s: RunState = { ...newRun(), doorSeed: seed };
            expect(() => line(s)).not.toThrow();
            expect(line(s).length).toBeGreaterThan(0);
          }
        }
      }
      expect(sawFunctionBeat, `${id} should have at least one doorSeed-branched outcome beat`).toBe(true);
    }
  });

  it('doorSeed branching in Act III actually produces more than one distinct outcome across seeds', () => {
    const branchedRooms = ['the-metamour', 'the-discovery', 'the-wedding-eve'];
    for (const id of branchedRooms) {
      const r = room(id);
      const results = new Set<string>();
      for (const choice of r.stages[0].choices) {
        const dynamicLines = choice.outcome.filter((b): b is (s: RunState) => string => typeof b === 'function');
        for (const line of dynamicLines) {
          for (let seed = 0; seed < 8; seed++) results.add(line({ ...newRun(), doorSeed: seed }));
        }
      }
      expect(results.size, `${id}’s doorSeed branch should produce more than one distinct outcome`).toBeGreaterThan(1);
    }
  });

  it('the-therapist is a 2-stage room: 4 door choices, then a repair-attempt stage with 2 choices', () => {
    const r = room('the-therapist');
    expect(r.stages).toHaveLength(2);
    expect(r.stages[0].choices).toHaveLength(4);
    expect(r.stages[0].choices.map((c) => c.id).sort()).toEqual(['contempt', 'criticism', 'defensiveness', 'stonewalling']);
    expect(r.stages[1].choices).toHaveLength(2);
    expect(r.stages[1].choices.map((c) => c.id).sort()).toEqual(['accept-the-repair', 'miss-the-repair']);
  });

  it('the-therapist’s stage-2 opening beat resolves without throwing regardless of which stage-1 door was taken', () => {
    const r = room('the-therapist');
    const dynamicBeat = r.stages[1].beats.find((b): b is (s: RunState) => string => typeof b === 'function')!;
    expect(dynamicBeat).toBeDefined();
    for (const doorFlag of ['door-criticism', 'door-contempt', 'door-defensiveness', 'door-stonewalling']) {
      expect(() => dynamicBeat({ ...newRun(), flags: [doorFlag] })).not.toThrow();
    }
  });

  it('the-therapist’s stonewalling door recognizes the-discovery’s flooding-related flags without throwing', () => {
    const r = room('the-therapist');
    const stonewalling = r.stages[0].choices.find((c) => c.id === 'stonewalling')!;
    const dynamicLine = stonewalling.outcome.find((b): b is (s: RunState) => string => typeof b === 'function')!;
    expect(dynamicLine).toBeDefined();
    expect(() => dynamicLine(newRun())).not.toThrow();
    expect(() => dynamicLine({ ...newRun(), flags: ['played-detective'] })).not.toThrow();
  });

  it('the-usual-suite’s shadow-moment beats resolve without throwing whether or not a prior run exists', () => {
    const r = room('the-usual-suite');
    const dynamicBeats = r.stages[0].beats.filter((b): b is (s: RunState) => string => typeof b === 'function');
    expect(dynamicBeats.length).toBeGreaterThanOrEqual(3);
    const noPrior = newRun();
    const withPrior: RunState = {
      ...newRun(),
      prior: {
        runs: 2,
        endingId: 'the-morning-after',
        transcript: [
          { roomId: 'the-front-desk', stageIndex: 0, choiceId: 'a', choiceText: 'Choice one' },
          { roomId: 'the-read-receipt', stageIndex: 0, choiceId: 'b', choiceText: 'Choice two' },
          { roomId: 'the-rumor', stageIndex: 0, choiceId: 'c', choiceText: 'Choice three' },
        ],
      },
    };
    for (const beat of dynamicBeats) {
      expect(() => beat(noPrior)).not.toThrow();
      expect(() => beat(withPrior)).not.toThrow();
      expect(beat(withPrior).length).toBeGreaterThan(0);
    }
  });

  it('the-usual-room’s history beat differs based on prior.runs without throwing', () => {
    const r = room('the-usual-room');
    const dynamicBeat = r.stages[0].beats.find((b): b is (s: RunState) => string => typeof b === 'function')!;
    expect(dynamicBeat).toBeDefined();
    const fresh = dynamicBeat(newRun());
    const returning = dynamicBeat({ ...newRun(), prior: { runs: 1, endingId: null, transcript: [] } });
    expect(fresh).not.toBe(returning);
  });

  it('every Act III pool room + gate names at least one psychology field note with a substantial body', () => {
    for (const id of [...ACT3_REGULAR_IDS, 'the-usual-suite', 'the-usual-room']) {
      const r = room(id);
      expect(r.fieldNote, `${id} has no field note`).toBeDefined();
      expect(r.fieldNote!.body.length).toBeGreaterThan(80);
      expect(r.fieldNote!.thinkers.length).toBeGreaterThan(0);
    }
  });

  it('every choice in every Act III pool room + gate has a non-empty hint', () => {
    for (const id of [...ACT3_REGULAR_IDS, 'the-usual-room']) {
      for (const stage of room(id).stages) {
        for (const c of stage.choices) expect(c.hint, `${id}/${c.id} has no hint`).toBeTruthy();
      }
    }
  });

  it('optionalPerAct[3] is non-zero now that a real 8-room pool exists', () => {
    expect(limerencePack.graph.optionalPerAct[3]).toBeGreaterThan(0);
  });
});
