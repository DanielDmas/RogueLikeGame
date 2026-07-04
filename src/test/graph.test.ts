import { describe, expect, it } from 'vitest';
import type { RunState } from '../content/schema';
import { allRooms } from '../content/rooms';
import { ACT4_SEQUENCE, ACT_POOLS, GATES, PROLOGUE } from '../content/graph';
import { applyEffects, newRun } from '../engine/gameState';
import { completeRoom, makeRegistry, offeredDoors } from '../engine/storyEngine';

const registry = makeRegistry(allRooms);

/** Play a full run with a seeded RNG, immortal hearts (graph-only test). */
function simulateRun(seed: number): RunState {
  let rng = seed;
  const rand = () => {
    rng = (rng * 1103515245 + 12345) % 2147483648;
    return rng / 2147483648;
  };
  let s = newRun();
  for (let guard = 0; guard < 60; guard++) {
    const doors = offeredDoors(s, registry);
    if (doors.length === 0) break;
    const room = doors[Math.floor(rand() * doors.length)];
    expect(s.visited).not.toContain(room.id);
    for (let i = 0; i < room.stages.length; i++) {
      const avail = room.stages[i].choices.filter((c) => !c.available || c.available(s));
      expect(avail.length).toBeGreaterThanOrEqual(2);
      const choice = avail[Math.floor(rand() * avail.length)];
      s = applyEffects(s, choice.effects);
      s.transcript.push({ roomId: room.id, stageIndex: i, choiceId: choice.id, choiceText: choice.text });
    }
    s.hearts = 3; // immortal for graph purposes
    s = completeRoom(s, room.id, registry);
  }
  return s;
}

describe('room graph', () => {
  it('the graph names exactly 20 numbered rooms plus the prologue', () => {
    const graphIds = new Set<string>([
      PROLOGUE,
      ...Object.values(ACT_POOLS).flat(),
      ...Object.values(GATES),
      ...ACT4_SEQUENCE,
    ]);
    expect(graphIds.size).toBe(21);
    const contentIds = new Set(allRooms.map((r) => r.id));
    expect(contentIds).toEqual(graphIds);
  });

  it('every run finishes: prologue, gates in order, all of act IV, length 15-16 rooms', () => {
    for (let seed = 1; seed <= 300; seed++) {
      const s = simulateRun(seed);
      expect(s.visited[0]).toBe(PROLOGUE);
      // total = prologue + (3 optional + gate) * 3 acts + 3 final = 16,
      // or 15 when an act's secret room stayed locked and its open pool ran short (act 3: 3 open rooms)
      expect(s.visited.length).toBeGreaterThanOrEqual(15);
      expect(s.visited.length).toBeLessThanOrEqual(16);
      const order = [GATES[1], GATES[2], GATES[3], ...ACT4_SEQUENCE].map((id) => s.visited.indexOf(id));
      for (const idx of order) expect(idx).toBeGreaterThan(0);
      expect([...order]).toEqual([...order].sort((a, b) => a - b));
      expect(new Set(s.visited).size).toBe(s.visited.length);
    }
  });

  it('all non-secret rooms are reachable across seeds; secret rooms appear when unlocked', () => {
    const seen = new Set<string>();
    for (let seed = 1; seed <= 300; seed++) {
      for (const id of simulateRun(seed).visited) seen.add(id);
    }
    for (const room of allRooms) {
      if (!room.secret) expect(seen, `room ${room.id} unreachable`).toContain(room.id);
    }
  });

  it('secret doors appear as a third option when their condition is met', () => {
    // Omelas unlocks on |selfOthers| >= 20 or lucidity >= 80
    let s = newRun();
    s = completeRoom(s, PROLOGUE, registry);
    s.lucidity = 100;
    const doors = offeredDoors({ ...s, act: 2, actOptionalDone: 0 }, registry);
    expect(doors.map((d) => d.id)).toContain('omelas');
    expect(doors.length).toBe(3);

    // The Introduction unlocks on lucidity >= 100 or any axis at 40
    const doors3 = offeredDoors({ ...s, act: 3, actOptionalDone: 0, lucidity: 120 }, registry);
    expect(doors3.map((d) => d.id)).toContain('introduction');
  });

  it('locked secret doors never appear', () => {
    let s = newRun();
    s = completeRoom(s, PROLOGUE, registry);
    const doors = offeredDoors({ ...s, act: 2, actOptionalDone: 0, lucidity: 0 }, registry);
    expect(doors.map((d) => d.id)).not.toContain('omelas');
  });

  it('after three optional rooms only the gate is offered', () => {
    let s = newRun();
    s = completeRoom(s, PROLOGUE, registry);
    s = { ...s, actOptionalDone: 3, visited: [PROLOGUE, 'wallet', 'promotion', 'quiet-alarm'] };
    const doors = offeredDoors(s, registry);
    expect(doors.map((d) => d.id)).toEqual([GATES[1]]);
  });
});

describe('content lint', () => {
  it('every room has a field note except The Last Message (which writes its own)', () => {
    for (const room of allRooms) {
      if (room.id === 'last-message') {
        expect(room.fieldNote).toBeUndefined();
      } else {
        expect(room.fieldNote, `room ${room.id} missing field note`).toBeDefined();
        expect(room.fieldNote!.body.split(/\s+/).length).toBeGreaterThan(80);
        expect(room.fieldNote!.thinkers.length).toBeGreaterThan(4);
      }
    }
  });

  it('every choice has effects and at least one outcome beat; every stage offers 2+ choices', () => {
    for (const room of allRooms) {
      expect(room.stages.length).toBeGreaterThanOrEqual(1);
      for (const stage of room.stages) {
        expect(stage.choices.length).toBeGreaterThanOrEqual(2);
        expect(stage.beats.length).toBeGreaterThanOrEqual(1);
        for (const c of stage.choices) {
          expect(c.effects, `${room.id}/${c.id} missing effects`).toBeDefined();
          expect(c.outcome.length, `${room.id}/${c.id} has no outcome`).toBeGreaterThanOrEqual(1);
        }
      }
    }
  });

  it('door hints and room ids are unique', () => {
    const hints = allRooms.map((r) => r.doorHint);
    expect(new Set(hints).size).toBe(hints.length);
    const ids = allRooms.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gates are marked and placed correctly', () => {
    for (const [act, id] of Object.entries(GATES)) {
      const room = registry.get(id);
      expect(room.gate, `${id} must be a gate`).toBe(true);
      if (Number(act) < 4) expect(room.act).toBe(Number(act));
    }
  });
});
