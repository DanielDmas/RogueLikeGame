import { describe, expect, it } from 'vitest';
import { allRooms } from '../content/rooms';
import { ACT_POOLS, GATES, OPTIONAL_PER_ACT } from '../content/graph';
import { newRun } from '../engine/gameState';
import { completeRoom, makeRegistry, offeredDoors } from '../engine/storyEngine';
import { roomIcons } from '../content/icons';

const registry = makeRegistry(allRooms);

describe('Milestone 5, Phase K — new rooms land correctly (buridans-queue, the-reference)', () => {
  it('both new rooms resolve in the registry with the right act', () => {
    expect(registry.get('buridans-queue').act).toBe(1);
    expect(registry.get('the-reference').act).toBe(1);
  });

  it('both are wired into Act I\'s open pool', () => {
    expect(ACT_POOLS[1]).toContain('buridans-queue');
    expect(ACT_POOLS[1]).toContain('the-reference');
  });

  it('neither is a gate or a secret', () => {
    expect(registry.get('buridans-queue').gate).toBeFalsy();
    expect(registry.get('the-reference').gate).toBeFalsy();
    expect(registry.get('buridans-queue').secret).toBeUndefined();
    expect(registry.get('the-reference').secret).toBeUndefined();
  });

  it('both have a schematic icon', () => {
    expect(roomIcons['buridans-queue']).toContain('<svg');
    expect(roomIcons['the-reference']).toContain('<svg');
  });
});

describe('Milestone 5, Phase K — Act III new rooms land correctly (marys-room, butterfly-dream, swampman)', () => {
  const ids = ['marys-room', 'butterfly-dream', 'swampman'];

  it('all three resolve in the registry in Act III', () => {
    for (const id of ids) expect(registry.get(id).act).toBe(3);
  });

  it("all three are wired into Act III's open pool", () => {
    for (const id of ids) expect(ACT_POOLS[3]).toContain(id);
  });

  it('none is a gate or a secret', () => {
    for (const id of ids) {
      expect(registry.get(id).gate).toBeFalsy();
      expect(registry.get(id).secret).toBeUndefined();
    }
  });

  it('all three have a schematic icon', () => {
    for (const id of ids) expect(roomIcons[id]).toContain('<svg');
  });

  it('all three have at least 3 choices, each with a hint, and a field note', () => {
    for (const id of ids) {
      const room = registry.get(id);
      const choices = room.stages[0].choices;
      expect(choices.length).toBeGreaterThanOrEqual(3);
      for (const c of choices) expect(c.hint, `${id}.${c.id}`).toBeTruthy();
      expect(room.fieldNote, id).toBeTruthy();
    }
  });
});

/**
 * Regression guard for a real bug this phase uncovered: `doorsForAct`
 * (storyEngine.ts) offers only 2 (or 3, with a secret) rooms at a time from
 * a pool via a deterministic hash sort. Before `RunState.doorSeed` existed,
 * that hash was salted only by `visited` history — which is identical for
 * every fresh run's very first offer in an act — so growing a pool could
 * leave some member structurally unreachable for *every* player, not just
 * unlucky test seeds (confirmed: adding this phase's 2 rooms to Act I's
 * pool of 5 made 'dinner-table' unreachable via any sequence of choices,
 * for any player, until doorSeed was added). This test asserts full pool
 * reachability directly against the production offeredDoors/completeRoom
 * functions, across many random runs — so the same class of bug is caught
 * immediately as Phase K keeps growing Act II's and Act III's pools too.
 */
describe('door-pool reachability — every act\'s full pool must be reachable by some path (regression guard)', () => {
  function roomsOfferedAcrossManyRuns(act: 1 | 2 | 3, samples: number): Set<string> {
    const offered = new Set<string>();
    for (let i = 0; i < samples; i++) {
      // walk straight to the start of this act with a fresh random doorSeed each time
      let s = newRun();
      s = completeRoom(s, 'waiting-room', registry);
      while (s.act < act) {
        const doors = offeredDoors(s, registry);
        const room = doors[0];
        s = completeRoom(s, room.id, registry);
      }
      // exhaust this act's optional picks, recording every door ever shown
      for (let pick = 0; pick < OPTIONAL_PER_ACT[act]; pick++) {
        const doors = offeredDoors(s, registry);
        doors.forEach((d) => offered.add(d.id));
        const nonGate = doors.find((d) => d.id !== GATES[act]) ?? doors[0];
        s = completeRoom(s, nonGate.id, registry);
      }
    }
    return offered;
  }

  for (const act of [1, 2, 3] as const) {
    it(`Act ${act}'s entire open pool is reachable by some path across many runs`, () => {
      const offered = roomsOfferedAcrossManyRuns(act, 60);
      const openPool = ACT_POOLS[act].filter((id) => !registry.get(id).secret);
      const missing = openPool.filter((id) => !offered.has(id));
      expect(missing, `never-offered rooms in act ${act}'s pool: ${missing.join(', ')}`).toEqual([]);
    });
  }
});
