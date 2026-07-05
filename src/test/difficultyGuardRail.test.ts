import { describe, expect, it } from 'vitest';
import type { Choice, RunState } from '../content/schema';
import { allRooms } from '../content/rooms';
import { applyEffects, newRun } from '../engine/gameState';
import { completeRoom, makeRegistry, offeredDoors } from '../engine/storyEngine';

const registry = makeRegistry(allRooms);

/** A "sincere" player: never picks a choice that spends a heart outright if
 * an alternative exists, and among the rest prefers the least lucidity-costly
 * option — not an omniscient min-maxer, just someone reading the hints. */
function pickSafestChoice(choices: Choice[], state: RunState): Choice {
  const avail = choices.filter((c) => !c.available || c.available(state));
  const noHeartCost = avail.filter((c) => !(c.effects.hearts && c.effects.hearts < 0));
  const pool = noHeartCost.length > 0 ? noHeartCost : avail;
  return pool.reduce((best, c) => ((c.effects.lucidity ?? 0) > (best.effects.lucidity ?? 0) ? c : best));
}

function simulateSincereRun(seed: number): RunState {
  let rng = seed;
  const rand = () => {
    rng = (rng * 1103515245 + 12345) % 2147483648;
    return rng / 2147483648;
  };
  let s = newRun();
  for (let guard = 0; guard < 60; guard++) {
    if (s.hearts <= 0) break; // mirrors flow.ts's runLoop: 0 hearts routes to the "dissolved" ending
    const doors = offeredDoors(s, registry);
    if (doors.length === 0) break;
    const room = doors[Math.floor(rand() * doors.length)];
    for (let i = 0; i < room.stages.length; i++) {
      const choice = pickSafestChoice(room.stages[i].choices, s);
      s = applyEffects(s, choice.effects);
      s.transcript.push({ roomId: room.id, stageIndex: i, choiceId: choice.id, choiceText: choice.text });
      if (s.hearts <= 0) break; // mirrors flow.ts's enterRoom mid-room break
    }
    s = completeRoom(s, room.id, registry);
  }
  return s;
}

describe('difficulty guard-rail — a sincere player is never forced to zero hearts (Phase G4)', () => {
  it('avoiding heart-costing choices where possible keeps at least 1 heart across many seeds/paths', () => {
    const failures: number[] = [];
    for (let seed = 1; seed <= 200; seed++) {
      const s = simulateSincereRun(seed);
      if (s.hearts <= 0) failures.push(seed);
    }
    expect(failures, `seeds that ended at 0 hearts despite avoiding costly choices: ${failures.join(', ')}`).toEqual([]);
  });

  it('a sincere player typically keeps most or all hearts (the game stays forgiving, not punishing)', () => {
    let totalHearts = 0;
    const runs = 100;
    for (let seed = 1; seed <= runs; seed++) totalHearts += simulateSincereRun(seed).hearts;
    const avgHearts = totalHearts / runs;
    expect(avgHearts).toBeGreaterThanOrEqual(2);
  });
});
