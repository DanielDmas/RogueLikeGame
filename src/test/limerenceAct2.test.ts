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

const ACT2_POOL_IDS = [
  'the-distance',
  'the-hall-pass',
  'the-rebound',
  'the-unicorn',
  'just-friends',
  'the-ex',
  'the-confession',
  'the-other-side-of-the-door',
];

describe('LIMERENCE Act II — room-by-room content integrity (spec 03-rooms-act2.md)', () => {
  it('the Act II pool matches the graph exactly — no orphaned rooms, no missing ones', () => {
    expect(new Set(limerencePack.graph.actPools[2])).toEqual(new Set(ACT2_POOL_IDS));
  });

  it('every pool room + gate resolves to a real, distinct room with act=2', () => {
    for (const id of [...ACT2_POOL_IDS, 'the-scoreboard']) {
      const r = room(id);
      expect(r.act, `${id} should be act 2`).toBe(2);
    }
  });

  it('every pool room + gate offers exactly 4 choices, each with 4-tradition reflections', () => {
    for (const id of [...ACT2_POOL_IDS, 'the-scoreboard']) {
      const choices = room(id).stages[0].choices;
      expect(choices, `${id} should have 4 choices`).toHaveLength(4);
      for (const c of choices) {
        expect(c.reflections, `${id}/${c.id} has no reflections`).toBeDefined();
        expect(c.reflections).toHaveLength(4);
      }
    }
  });

  it('every pool room + gate offers 4 genuinely different choices (no two with identical effects)', () => {
    for (const id of [...ACT2_POOL_IDS, 'the-scoreboard']) {
      const choices = room(id).stages[0].choices;
      const serialized = choices.map((c) => JSON.stringify(c.effects));
      expect(new Set(serialized).size, `${id} has duplicate-effect choices`).toBe(choices.length);
    }
  });

  it('the-scoreboard is a real gate, DOOMED', () => {
    const r = room('the-scoreboard');
    expect(r.gate).toBe(true);
    expect(r.type).toBe('DOOMED');
  });

  it('the-distance’s dynamic opening beat reflects prior Act I flags without throwing, and differs by flag state', () => {
    const r = room('the-distance');
    const dynamicBeat = r.stages[0].beats.find((b): b is (s: RunState) => string => typeof b === 'function')!;
    expect(dynamicBeat).toBeDefined();
    const fresh = dynamicBeat(newRun());
    const promised = dynamicBeat({ ...newRun(), flags: ['promised-september'] });
    const open = dynamicBeat({ ...newRun(), flags: ['first-open'] });
    expect(fresh).not.toBe(promised);
    expect(fresh).not.toBe(open);
    expect(promised).not.toBe(open);
  });

  it('the-distance’s "confess-the-near-miss" sets windows-open, read later by just-friends', () => {
    const c = room('the-distance').stages[0].choices.find((c) => c.id === 'confess-the-near-miss')!;
    expect(c.effects.flags).toContain('windows-open');
  });

  it('the-confession’s "carry-it" choice sets carried-alone, the keepsake trigger for the-unsent-letter', () => {
    const carryIt = room('the-confession').stages[0].choices.find((c) => c.id === 'carry-it')!;
    expect(carryIt.effects.flags).toContain('carried-alone');
    expect(limerencePack.keepsakeTriggers['carried-alone']).toBe('the-unsent-letter');
    expect(limerencePack.keepsakes.some((k) => k.id === 'the-unsent-letter')).toBe(true);
  });

  it('the-confession’s carry-it choice does NOT also carry a keepsakeId (that field gates a later bonus choice, not the earn room)', () => {
    const carryIt = room('the-confession').stages[0].choices.find((c) => c.id === 'carry-it')!;
    expect(carryIt.keepsakeId).toBeUndefined();
  });

  it('the-ex’s dynamic opening beat acknowledges the Act I gate’s "set-the-trap" flag without throwing, and differs by flag state', () => {
    const r = room('the-ex');
    const dynamicBeat = r.stages[0].beats.find((b): b is (s: RunState) => string => typeof b === 'function')!;
    expect(dynamicBeat).toBeDefined();
    const fresh = dynamicBeat(newRun());
    const trapped = dynamicBeat({ ...newRun(), flags: ['set-the-trap'] });
    expect(fresh).not.toBe(trapped);
  });

  it('the-scoreboard’s dynamic beat recognizes the intrusion-beat callback from Act I / just-friends without throwing, and differs by flag state', () => {
    const r = room('the-scoreboard');
    const dynamicBeat = r.stages[0].beats.find((b): b is (s: RunState) => string => typeof b === 'function')!;
    expect(dynamicBeat).toBeDefined();
    const fresh = dynamicBeat(newRun());
    const tested = dynamicBeat({ ...newRun(), flags: ['tested-almost'] });
    const ran = dynamicBeat({ ...newRun(), flags: ['ran-the-test'] });
    expect(fresh).not.toBe(tested);
    expect(fresh).not.toBe(ran);
  });

  it('every outcome function-beat (doorSeed-branched choices) resolves to a non-empty string across a range of seeds, without throwing', () => {
    const branchedRooms = ['the-rebound', 'the-unicorn', 'the-other-side-of-the-door'];
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
            const text = line(s);
            expect(typeof text).toBe('string');
            expect(text.length).toBeGreaterThan(0);
          }
        }
      }
      expect(sawFunctionBeat, `${id} should have at least one doorSeed-branched outcome beat`).toBe(true);
    }
  });

  it('doorSeed branching actually produces both outcomes across different seeds (not a constant)', () => {
    const branchedRooms = ['the-rebound', 'the-unicorn', 'the-other-side-of-the-door'];
    for (const id of branchedRooms) {
      const r = room(id);
      const results = new Set<string>();
      for (const choice of r.stages[0].choices) {
        const dynamicLines = choice.outcome.filter((b): b is (s: RunState) => string => typeof b === 'function');
        for (const line of dynamicLines) {
          for (let seed = 0; seed < 8; seed++) {
            results.add(line({ ...newRun(), doorSeed: seed }));
          }
        }
      }
      expect(results.size, `${id}’s doorSeed branch should produce more than one distinct outcome across seeds`).toBeGreaterThan(1);
    }
  });

  it('every Act II pool room + gate names at least one psychology field note with a substantial body', () => {
    for (const id of [...ACT2_POOL_IDS, 'the-scoreboard']) {
      const r = room(id);
      expect(r.fieldNote, `${id} has no field note`).toBeDefined();
      expect(r.fieldNote!.body.length).toBeGreaterThan(80);
      expect(r.fieldNote!.thinkers.length).toBeGreaterThan(0);
    }
  });

  it('every choice in every Act II pool room + gate has a non-empty hint', () => {
    for (const id of [...ACT2_POOL_IDS, 'the-scoreboard']) {
      for (const c of room(id).stages[0].choices) {
        expect(c.hint, `${id}/${c.id} has no hint`).toBeTruthy();
      }
    }
  });

  it('the-unicorn, just-friends, and the-scoreboard are the room types the spec calls for (DILEMMA/INSIGHT/DOOMED)', () => {
    expect(room('the-unicorn').type).toBe('DILEMMA');
    expect(room('just-friends').type).toBe('INSIGHT');
    expect(room('the-other-side-of-the-door').type).toBe('NO-SOLUTION');
    expect(room('the-scoreboard').type).toBe('DOOMED');
  });

  it('optionalPerAct[2] is non-zero now that a real pool exists (was 0 while it only held a placeholder)', () => {
    expect(limerencePack.graph.optionalPerAct[2]).toBeGreaterThan(0);
  });
});
