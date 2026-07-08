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

describe('LIMERENCE Act I — room-by-room content integrity (spec 02-rooms-act1.md)', () => {
  it('the prologue offers exactly 3 orientation choices, none costing hearts', () => {
    const r = room('the-front-desk');
    expect(r.act).toBe(0);
    expect(r.stages).toHaveLength(1);
    const choices = r.stages[0].choices;
    expect(choices).toHaveLength(3);
    for (const c of choices) expect(c.effects.hearts ?? 0).toBe(0);
  });

  it('the-read-receipt’s 4 choices each move a different lever (no two choices with identical effects)', () => {
    const r = room('the-read-receipt');
    const choices = r.stages[0].choices;
    expect(choices).toHaveLength(4);
    const serialized = choices.map((c) => JSON.stringify(c.effects));
    expect(new Set(serialized).size).toBe(4);
  });

  it('the-read-receipt’s "bait" choice sets first-test, read later by the-summer-ends', () => {
    const bait = room('the-read-receipt').stages[0].choices.find((c) => c.id === 'bait')!;
    expect(bait.effects.flags).toContain('first-test');
  });

  it('the-screenshot offers 4 genuinely different responses to the same dilemma, all with reflections', () => {
    const r = room('the-screenshot');
    const choices = r.stages[0].choices;
    expect(choices).toHaveLength(4);
    for (const c of choices) {
      expect(c.reflections, `${c.id} has no reflections`).toBeDefined();
      expect(c.reflections).toHaveLength(4);
    }
  });

  it('the-password’s "give-it" choice is rewarded short-term (lucidity/Ours up) but flags the cost honestly', () => {
    const giveIt = room('the-password').stages[0].choices.find((c) => c.id === 'give-it')!;
    expect(giveIt.effects.lucidity).toBeGreaterThan(0);
    expect(giveIt.effects.flags).toContain('gave-the-key');
  });

  it('the-party’s "refuse" choice sets refused-the-dare, which is the keepsake trigger for the-cheap-ring', () => {
    const refuse = room('the-party').stages[0].choices.find((c) => c.id === 'refuse')!;
    expect(refuse.effects.flags).toContain('refused-the-dare');
    expect(limerencePack.keepsakeTriggers['refused-the-dare']).toBe('the-cheap-ring');
    expect(limerencePack.keepsakes.some((k) => k.id === 'the-cheap-ring')).toBe(true);
  });

  it('the-party’s refuse choice does NOT also carry a keepsakeId (that field gates a later bonus choice, not the earn room)', () => {
    const refuse = room('the-party').stages[0].choices.find((c) => c.id === 'refuse')!;
    expect(refuse.keepsakeId).toBeUndefined();
  });

  it('the-forward never depicts or describes the image itself (charter, spec 10 §1) — no choice or beat text names its contents', () => {
    const r = room('the-forward');
    const forbidden = /naked|nude|explicit|breast|genital/i;
    for (const stage of r.stages) {
      for (const beat of stage.beats) {
        const text = typeof beat === 'function' ? beat(newRun()) : beat;
        expect(forbidden.test(text), `the-forward beat contains forbidden depiction language: "${text}"`).toBe(false);
      }
      for (const choice of stage.choices) {
        expect(forbidden.test(choice.text)).toBe(false);
        for (const line of choice.outcome) {
          const text = typeof line === 'function' ? line(newRun()) : line;
          expect(forbidden.test(text)).toBe(false);
        }
      }
    }
  });

  it('the-best-friends-girl’s dynamic intrusion beats resolve without throwing across a range of axis states', () => {
    const r = room('the-best-friends-girl');
    const beats = r.stages[0].beats;
    const dynamicBeats = beats.filter((b): b is (s: RunState) => string => typeof b === 'function');
    expect(dynamicBeats.length).toBeGreaterThan(0);
    const fixtures: RunState[] = [
      newRun(),
      { ...newRun(), axes: { reasonFeeling: 0, selfOthers: 0, controlAcceptance: -30 } },
      { ...newRun(), axes: { reasonFeeling: 0, selfOthers: 0, controlAcceptance: 30 } },
    ];
    for (const beat of dynamicBeats) {
      for (const s of fixtures) {
        expect(() => beat(s)).not.toThrow();
        expect(typeof beat(s)).toBe('string');
        expect(beat(s).length).toBeGreaterThan(0);
      }
    }
  });

  it('the-summer-ends’ dynamic beat acknowledges prior flags without throwing, and differs by flag state', () => {
    const r = room('the-summer-ends');
    const dynamicBeat = r.stages[0].beats.find((b): b is (s: RunState) => string => typeof b === 'function')!;
    expect(dynamicBeat).toBeDefined();
    const fresh = dynamicBeat(newRun());
    const withKey = dynamicBeat({ ...newRun(), flags: ['gave-the-key'] });
    const withBury = dynamicBeat({ ...newRun(), flags: ['it-didnt-count'] });
    expect(fresh).not.toBe(withKey);
    expect(fresh).not.toBe(withBury);
    expect(withKey).not.toBe(withBury);
  });

  it('the-rumor gate is a real gate, DOOMED, and its "set-the-trap" choice burns the Benefit of the Doubt (loseMemory)', () => {
    const r = room('the-rumor');
    expect(r.gate).toBe(true);
    expect(r.type).toBe('DOOMED');
    const trap = r.stages[0].choices.find((c) => c.id === 'set-the-trap')!;
    expect(trap.effects.loseMemory).toBe(true);
    expect(trap.effects.flags).toContain('set-the-trap');
  });

  it('the-rumor’s "interrogate" choice is the only Act I gate choice that costs a heart', () => {
    const r = room('the-rumor');
    const interrogate = r.stages[0].choices.find((c) => c.id === 'interrogate')!;
    expect(interrogate.effects.hearts).toBe(-1);
    const others = r.stages[0].choices.filter((c) => c.id !== 'interrogate');
    for (const c of others) expect(c.effects.hearts ?? 0).toBe(0);
  });

  it('every Act I pool room + gate names at least one psychology field note with a non-empty body', () => {
    const act1Ids = [
      'the-read-receipt',
      'the-screenshot',
      'the-password',
      'the-party',
      'the-forward',
      'the-best-friends-girl',
      'the-summer-ends',
      'the-rumor',
    ];
    for (const id of act1Ids) {
      const r = room(id);
      expect(r.fieldNote, `${id} has no field note`).toBeDefined();
      expect(r.fieldNote!.body.length).toBeGreaterThan(80);
      expect(r.fieldNote!.thinkers.length).toBeGreaterThan(0);
    }
  });

  it('the Act I pool matches the graph exactly — no orphaned rooms, no missing ones', () => {
    const poolIds = new Set(limerencePack.graph.actPools[1]);
    const expectedIds = new Set([
      'the-read-receipt',
      'the-screenshot',
      'the-password',
      'the-party',
      'the-forward',
      'the-best-friends-girl',
      'the-summer-ends',
    ]);
    expect(poolIds).toEqual(expectedIds);
  });
});
