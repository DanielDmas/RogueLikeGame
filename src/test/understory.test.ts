import { describe, expect, it } from 'vitest';
import type { RunState } from '../engine/schema';
import { allRooms } from '../content/rooms';
import { UNDERSTORY_SEQUENCE } from '../content/graph';
import { newRun } from '../engine/gameState';
import { completeRoom, makeRegistry, offeredDoors } from '../engine/storyEngine';
import { roomIcons } from '../content/icons';

const registry = makeRegistry(allRooms);

/** Walks straight to the Act IV threshold, taking whatever door is offered
 * first each time (mirrors the same no-choice-application pattern used by
 * newRooms.test.ts's reachability helper — completeRoom's act-advancement
 * logic only needs `visited`/`act`, not applied choice effects). */
function walkToAct4(s: RunState): RunState {
  while (s.act < 4) {
    const doors = offeredDoors(s, registry);
    const room = doors[0];
    s = completeRoom(s, room.id, registry);
  }
  return s;
}

describe('Act V — the understory descent (Milestone 5, Phase L)', () => {
  it('a fresh profile (no prior at all) never sees the staircase fork, across many seeds', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const s = walkToAct4(newRun(seed));
      expect(offeredDoors(s, registry).map((d) => d.id)).not.toContain(UNDERSTORY_SEQUENCE[0]);
    }
  });

  it('an explicit prior.runs: 0 (e.g. a returning profile whose only prior run never finished) also never sees the fork', () => {
    const s = walkToAct4(newRun(1, { runs: 0, endingId: null, transcript: [] }));
    expect(offeredDoors(s, registry).map((d) => d.id)).not.toContain(UNDERSTORY_SEQUENCE[0]);
  });

  it('a returning traveler (prior.runs >= 1) sees the fork exactly once, at the threshold, alongside boulder', () => {
    const s = walkToAct4(newRun(1, { runs: 1, endingId: 'return', transcript: [] }));
    const doors = offeredDoors(s, registry).map((d) => d.id).sort();
    expect(doors).toEqual(['boulder', 'the-archive'].sort());
  });

  it('choosing boulder at the fork forfeits the descent for the rest of the run — understory ids never appear again', () => {
    let s = walkToAct4(newRun(1, { runs: 1, endingId: 'return', transcript: [] }));
    s = completeRoom(s, 'boulder', registry);
    expect(offeredDoors(s, registry).map((d) => d.id)).toEqual(['last-message']);
    s = completeRoom(s, 'last-message', registry);
    expect(offeredDoors(s, registry).map((d) => d.id)).not.toContain(UNDERSTORY_SEQUENCE[0]);
    s = completeRoom(s, 'door-that-asks', registry);
    expect(s.visited).not.toContain('the-archive');
    expect(s.visited.length).toBe(15);
  });

  it('descending walks the-archive -> the-unchosen -> the-echo -> boulder -> last-message -> door-that-asks; run length 18', () => {
    let s = walkToAct4(newRun(1, { runs: 1, endingId: 'return', transcript: [] }));
    expect(offeredDoors(s, registry).map((d) => d.id).sort()).toEqual(['boulder', 'the-archive'].sort());

    // choosing 'the-archive': flow.ts sets `descended: true` the instant this
    // door is picked, before completeRoom runs — mirrored here explicitly.
    s = { ...s, descended: true };
    s = completeRoom(s, 'the-archive', registry);
    expect(offeredDoors(s, registry).map((d) => d.id)).toEqual(['the-unchosen']);

    s = completeRoom(s, 'the-unchosen', registry);
    expect(offeredDoors(s, registry).map((d) => d.id)).toEqual(['the-echo']);

    s = completeRoom(s, 'the-echo', registry);
    expect(offeredDoors(s, registry).map((d) => d.id)).toEqual(['boulder']);

    s = completeRoom(s, 'boulder', registry);
    expect(offeredDoors(s, registry).map((d) => d.id)).toEqual(['last-message']);

    s = completeRoom(s, 'last-message', registry);
    expect(offeredDoors(s, registry).map((d) => d.id)).toEqual(['door-that-asks']);

    s = completeRoom(s, 'door-that-asks', registry);
    expect(offeredDoors(s, registry)).toEqual([]);

    expect(s.visited.length).toBe(18);
    for (const id of UNDERSTORY_SEQUENCE) expect(s.visited).toContain(id);
    expect(new Set(s.visited).size).toBe(s.visited.length); // no repeats
  });

  it('quitting and resuming mid-understory needs no special handling: descended + currentRoom persist like any other room', () => {
    let s = walkToAct4(newRun(1, { runs: 1, endingId: 'return', transcript: [] }));
    s = { ...s, descended: true };
    s = completeRoom(s, 'the-archive', registry);
    const saved: RunState = { ...s, currentRoom: 'the-unchosen', currentStage: 0 };
    // "resuming" is just re-entering the same persisted state — nothing else
    // needs to run to recover the correct next offer.
    expect(saved.descended).toBe(true);
    expect(offeredDoors({ ...saved, currentRoom: null }, registry).map((d) => d.id)).toEqual(['the-unchosen']);
  });
});

describe('Act V — content completeness (Milestone 5, Phase L)', () => {
  const ids = UNDERSTORY_SEQUENCE;

  it('all three resolve in the registry as plain, non-gate, non-secret act-4 rooms', () => {
    for (const id of ids) {
      const room = registry.get(id);
      expect(room.act, id).toBe(4);
      expect(room.gate, id).toBeFalsy();
      expect(room.secret, id).toBeUndefined();
    }
  });

  it('all three have a schematic icon', () => {
    for (const id of ids) expect(roomIcons[id], id).toContain('<svg');
  });

  it('all three have at least 3 choices, each with a hint, and a field note, and no heart costs anywhere (the understory confronts, it does not punish)', () => {
    for (const id of ids) {
      const room = registry.get(id);
      const choices = room.stages[0].choices;
      expect(choices.length, id).toBeGreaterThanOrEqual(3);
      for (const c of choices) {
        expect(c.hint, `${id}.${c.id}`).toBeTruthy();
        expect(c.effects.hearts ?? 0, `${id}.${c.id} must not cost a heart`).toBeGreaterThanOrEqual(0);
      }
      expect(room.fieldNote, id).toBeTruthy();
    }
  });
});
