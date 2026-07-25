import { isStructurallyValidRun, type ActId, type Room, type RunState } from './schema';
import {
  ACT4_SEQUENCE as ANAMNESIS_ACT4_SEQUENCE,
  ACT_POOLS as ANAMNESIS_ACT_POOLS,
  GATES as ANAMNESIS_GATES,
  OPTIONAL_PER_ACT as ANAMNESIS_OPTIONAL_PER_ACT,
  PROLOGUE as ANAMNESIS_PROLOGUE,
  UNDERSTORY_SEQUENCE as ANAMNESIS_UNDERSTORY_SEQUENCE,
} from '../content/graph';
import type { ContentPack } from '../packs/types';

export interface RoomRegistry {
  get(id: string): Room;
  has(id: string): boolean;
  all(): Room[];
}

type Graph = ContentPack['graph'];

/** Defaults every call site to ANAMNESIS's own graph, so existing callers
 * (tests, and any code written before packs existed) are unaffected; a
 * caller that knows which pack it's driving (flow.ts) passes pack.graph
 * explicitly instead. */
const DEFAULT_GRAPH: Graph = {
  prologue: ANAMNESIS_PROLOGUE,
  actPools: ANAMNESIS_ACT_POOLS,
  gates: ANAMNESIS_GATES,
  act4Sequence: ANAMNESIS_ACT4_SEQUENCE,
  understorySequence: ANAMNESIS_UNDERSTORY_SEQUENCE,
  optionalPerAct: ANAMNESIS_OPTIONAL_PER_ACT,
  actNamesEn: {} as Graph['actNamesEn'], // unused by this module
  understoryNameEn: 'The Understory', // unused by this module
};

export function makeRegistry(rooms: Room[]): RoomRegistry {
  const map = new Map(rooms.map((r) => [r.id, r]));
  return {
    get(id) {
      const r = map.get(id);
      if (!r) throw new Error(`Unknown room: ${id}`);
      return r;
    },
    has: (id) => map.has(id),
    all: () => [...map.values()],
  };
}

/** Deterministic pseudo-shuffle key so offered doors survive a reload.
 * Exported (game-experience review R4, 2026-07-20) for `flow.ts`'s end-
 * screen "doors you never opened" list, which needed the exact same
 * salted-shuffle behavior — a run-scoped, reload-stable ordering — rather
 * than a second, drifting reimplementation of the same hash. */
export function hashKey(input: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * The doors offered to the player right now.
 * Prologue → prologue room; acts I–III → 2 unvisited optional rooms (+ any
 * unlocked secret room), then the gate; act IV → fixed corridor.
 */
export function offeredDoors(state: RunState, registry: RoomRegistry, graph: Graph = DEFAULT_GRAPH): Room[] {
  if (state.finished) return [];
  if (state.act === 0) {
    return state.visited.includes(graph.prologue) ? doorsForAct(state, 1, registry, graph) : [registry.get(graph.prologue)];
  }
  if (state.act === 4) {
    const next = graph.act4Sequence.find((id) => !state.visited.includes(id));
    if (!next) return [];
    // The understory fork: offered once, only at the threshold (before Act IV
    // begins), only to a returning traveler who hasn't already descended this
    // run. Taking the act's first Act-IV room here forfeits the descent for
    // the rest of the run — the fork never reappears, since `next` advances
    // past that room the moment it's visited.
    const eligible =
      next === graph.act4Sequence[0] &&
      (state.prior?.runs ?? 0) >= 1 &&
      !graph.understorySequence.some((id) => state.visited.includes(id));
    if (eligible) return [registry.get(graph.understorySequence[0]), registry.get(next)];
    // Once descended, walk the understory sequence before rejoining act4Sequence.
    const pendingUnder = state.descended ? graph.understorySequence.find((id) => !state.visited.includes(id)) : undefined;
    return [registry.get(pendingUnder ?? next)];
  }
  return doorsForAct(state, state.act as 1 | 2 | 3, registry, graph);
}

function doorsForAct(state: RunState, act: 1 | 2 | 3, registry: RoomRegistry, graph: Graph): Room[] {
  const pool = graph.actPools[act]
    .map((id) => registry.get(id))
    .filter((r) => !state.visited.includes(r.id));

  const open = pool.filter((r) => !r.secret);
  const secrets = pool.filter((r) => r.secret && r.secret(state));

  if (state.actOptionalDone >= graph.optionalPerAct[act] || (open.length === 0 && secrets.length === 0)) {
    return [registry.get(graph.gates[act])];
  }

  // Salted by the path taken so far AND the run's own doorSeed: deterministic
  // across a reload, but different runs see different doors from the very
  // first offer of an act (visited history alone is identical for every fresh
  // run at that point, which — without doorSeed — could leave some pool
  // members structurally unreachable for every player once a pool grows
  // beyond a small size; doorSeed keeps the whole pool reachable across runs).
  const salt = hashKey(`${state.visited.join('|')}#${state.doorSeed ?? 0}`, act);
  const picked = [...open]
    .sort((a, b) => hashKey(a.id, salt) - hashKey(b.id, salt))
    .slice(0, 2);
  // a secret door, when unlocked, appears as a third, stranger door
  for (const s of secrets) if (picked.length < 3) picked.push(s);
  return picked;
}

/**
 * UAT-only helper (spec 09 §S7): jumping straight to a room in `ACT4_SEQUENCE`
 * or `UNDERSTORY_SEQUENCE` must backfill the sequence's earlier rooms into
 * `visited`, or `offeredDoors` re-offers them the moment the jump target is
 * completed and the story engine recomputes what comes next (e.g. jumping to
 * `door-that-asks` would otherwise re-offer `boulder` afterward). Pure and
 * DOM-free so it's directly testable. Rooms outside both sequences are
 * returned unchanged.
 */
export function backfillVisitedForJump(visited: string[], roomId: string, graph: Graph = DEFAULT_GRAPH): string[] {
  const act4Index = graph.act4Sequence.indexOf(roomId);
  const understoryIndex = graph.understorySequence.indexOf(roomId);
  if (act4Index === -1 && understoryIndex === -1) return visited;
  const merged = new Set(visited);
  if (act4Index !== -1) {
    for (let i = 0; i < act4Index; i++) merged.add(graph.act4Sequence[i]);
  }
  if (understoryIndex !== -1) {
    // The understory is only reachable past the act4Sequence's first stop.
    merged.add(graph.act4Sequence[0]);
    for (let i = 0; i < understoryIndex; i++) merged.add(graph.understorySequence[i]);
  }
  return [...merged];
}

/**
 * A persisted `RunState` is only safe to resume ("Continue") if every room
 * id it references actually exists in the *active* pack's registry. Found
 * live (Fable review, M1): a cross-pack profile import — nothing pack-stamps
 * an export or rejects a mismatched one on paste — or any future room-id
 * rename can leave `run.currentRoom`/`visited` pointing at an id the current
 * registry doesn't recognize. Unguarded, `registry.get(pending)` inside
 * `runLoop()` throws straight into the recovery overlay, whose only action
 * is reload → title → the same crash on the very next Continue click — a
 * player stuck in a loop with no way out. Pure and DOM-free so it's directly
 * testable; the caller (flow.ts) discards the whole run rather than trying
 * to repair it (simpler, and never silently teleports a player to a room
 * they never chose).
 */
export function isResumableRun(run: RunState, registry: RoomRegistry): boolean {
  // Shape first, ids second. `hydrateProfile` already discards a structurally
  // broken run, so in the real load path this guard is redundant — but it is
  // kept because this function is also the thing that *used* to crash on
  // `{"visited": null}` (`.every` of null), and a validator whose own
  // contract is "tell me whether this run is usable" must never itself throw
  // on the answer being "no". Defence in depth at a genuine trust boundary,
  // not a redundant check.
  if (!isStructurallyValidRun(run)) return false;
  if (run.currentRoom != null && !registry.has(run.currentRoom)) return false;
  return run.visited.every((id) => registry.has(id));
}

/** Marks a room complete and advances act structure. Pure. */
export function completeRoom(state: RunState, roomId: string, registry: RoomRegistry, graph: Graph = DEFAULT_GRAPH): RunState {
  const room = registry.get(roomId);
  const next: RunState = {
    ...state,
    axes: { ...state.axes },
    flags: [...state.flags],
    visited: state.visited.includes(roomId) ? [...state.visited] : [...state.visited, roomId],
    transcript: [...state.transcript],
    currentRoom: null,
    currentStage: 0,
  };

  if (room.id === graph.prologue) {
    next.act = 1;
    next.actOptionalDone = 0;
  } else if (room.gate) {
    next.act = Math.min(4, next.act + 1) as ActId;
    next.actOptionalDone = 0;
  } else if (room.act === next.act && room.act >= 1 && room.act <= 3) {
    next.actOptionalDone += 1;
  }
  return next;
}
