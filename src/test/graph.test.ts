import { describe, expect, it } from 'vitest';
import type { RunState } from '../content/schema';
import { allRooms } from '../content/rooms';
import { ACT4_SEQUENCE, ACT_POOLS, GATES, PROLOGUE } from '../content/graph';
import { applyEffects, newRun } from '../engine/gameState';
import { completeRoom, makeRegistry, offeredDoors } from '../engine/storyEngine';
import { endingIcons, roomIcons } from '../content/icons';
import { endings } from '../content/endings';

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

  it('every run finishes: prologue, gates in order, all of act IV, length always 15 rooms', () => {
    for (let seed = 1; seed <= 300; seed++) {
      const s = simulateRun(seed);
      expect(s.visited[0]).toBe(PROLOGUE);
      // total = prologue(1) + (3 optional + gate)*2 acts (I, II) + (2 optional + gate) act III + 3 (act IV) = 15.
      // Deterministic: every act's open pool is always >= its required count, so no early/short gating.
      expect(s.visited.length).toBe(15);
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

  it('after three optional rooms only the gate is offered (act I)', () => {
    let s = newRun();
    s = completeRoom(s, PROLOGUE, registry);
    s = { ...s, actOptionalDone: 3, visited: [PROLOGUE, 'wallet', 'promotion', 'quiet-alarm'] };
    const doors = offeredDoors(s, registry);
    expect(doors.map((d) => d.id)).toEqual([GATES[1]]);
  });

  it('act III gates after only 2 of its 3 open rooms — a door choice always means skipping one', () => {
    let s = newRun();
    s = completeRoom(s, PROLOGUE, registry);
    s = { ...s, act: 3, actOptionalDone: 1, visited: [PROLOGUE, 'teleporter'] };
    const firstOffer = offeredDoors(s, registry);
    expect(firstOffer.map((d) => d.id)).not.toContain(GATES[3]);
    expect(firstOffer.length).toBeGreaterThanOrEqual(1);

    s = { ...s, actOptionalDone: 2, visited: [PROLOGUE, 'teleporter', 'editor'] };
    const secondOffer = offeredDoors(s, registry);
    expect(secondOffer.map((d) => d.id)).toEqual([GATES[3]]);
    // 'debt-of-dead' was never forced — it stayed skippable this run.
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

  it('every room has a spoiler-free teaser distinct from its door hint', () => {
    for (const room of allRooms) {
      expect(room.teaser, `room ${room.id} missing a teaser`).toBeTruthy();
      expect(room.teaser.length).toBeGreaterThan(10);
      expect(room.teaser).not.toBe(room.doorHint);
    }
    const teasers = allRooms.map((r) => r.teaser);
    expect(new Set(teasers).size, 'teasers should be unique per room').toBe(teasers.length);
  });

  it('gates are marked and placed correctly', () => {
    for (const [act, id] of Object.entries(GATES)) {
      const room = registry.get(id);
      expect(room.gate, `${id} must be a gate`).toBe(true);
      if (Number(act) < 4) expect(room.act).toBe(Number(act));
    }
  });

  it('every room and every ending has a schematic icon', () => {
    for (const room of allRooms) {
      expect(roomIcons[room.id], `room ${room.id} missing an icon`).toBeDefined();
      expect(roomIcons[room.id]).toContain('<svg');
    }
    for (const ending of endings) {
      expect(endingIcons[ending.id], `ending ${ending.id} missing an icon`).toBeDefined();
      expect(endingIcons[ending.id]).toContain('<svg');
    }
  });
});
