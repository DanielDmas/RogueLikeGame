import { describe, expect, it } from 'vitest';
import type { Choice, RunState } from '../engine/schema';
import { allRooms } from '../content/rooms';
import { applyEffects, newRun } from '../engine/gameState';
import { completeRoom, makeRegistry, offeredDoors } from '../engine/storyEngine';
import { evaluateEnding } from '../engine/endings';

const registry = makeRegistry(allRooms);

/** The opposite of difficultyGuardRail's "sincere" player: actively seeks out
 * the choices the game itself marks as heart-costing, and otherwise picks
 * whatever drains lucidity fastest — to reliably demonstrate how a player
 * actually loses all 3 hearts, and what happens when they do. */
function pickRecklessChoice(choices: Choice[], state: RunState): Choice {
  const avail = choices.filter((c) => !c.available || c.available(state));
  const heartCost = avail.filter((c) => c.effects.hearts && c.effects.hearts < 0);
  if (heartCost.length > 0) return heartCost[0];
  return avail.reduce((worst, c) => ((c.effects.lucidity ?? 0) < (worst.effects.lucidity ?? 0) ? c : worst));
}

function simulateRecklessRun(seed: number): { state: RunState; heartsLostAt: number[] } {
  let rng = seed;
  const rand = () => {
    rng = (rng * 1103515245 + 12345) % 2147483648;
    return rng / 2147483648;
  };
  let s = newRun();
  const heartsLostAt: number[] = [];
  let roomIndex = 0;
  for (let guard = 0; guard < 60; guard++) {
    if (s.hearts <= 0) break; // mirrors flow.ts's runLoop: 0 hearts routes straight to the "dissolved" ending
    const doors = offeredDoors(s, registry);
    if (doors.length === 0) break;
    const room = doors[Math.floor(rand() * doors.length)];
    for (let i = 0; i < room.stages.length; i++) {
      const before = s.hearts;
      const choice = pickRecklessChoice(room.stages[i].choices, s);
      s = applyEffects(s, choice.effects);
      s.transcript.push({ roomId: room.id, stageIndex: i, choiceId: choice.id, choiceText: choice.text });
      if (s.hearts < before) heartsLostAt.push(roomIndex);
      if (s.hearts <= 0) break; // mirrors flow.ts's enterRoom mid-room break
    }
    s = completeRoom(s, room.id, registry);
    roomIndex += 1;
  }
  return { state: s, heartsLostAt };
}

describe('losing all 3 hearts (Phase J UAT) — how it actually happens', () => {
  it('a reckless player (always takes the heart-costing choice) reaches 0 hearts within a run', () => {
    const zeroed: number[] = [];
    for (let seed = 1; seed <= 50; seed++) {
      if (simulateRecklessRun(seed).state.hearts === 0) zeroed.push(seed);
    }
    expect(zeroed.length, 'no seed reached 0 hearts even when always taking the costly choice').toBeGreaterThan(0);
  });

  it('hearts never go negative across a full reckless run, for any seed', () => {
    for (let seed = 1; seed <= 50; seed++) {
      expect(simulateRecklessRun(seed).state.hearts).toBeGreaterThanOrEqual(0);
    }
  });

  it('reaching 0 hearts mid-run evaluates to the "dissolved" ending, regardless of axis profile', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const { state } = simulateRecklessRun(seed);
      if (state.hearts === 0) {
        expect(evaluateEnding(state)).toBe('dissolved');
      }
    }
  });

  it('applyEffects never lets hearts go negative, even if effects overshoot', () => {
    let s = newRun();
    s = applyEffects(s, { hearts: -1 });
    s = applyEffects(s, { hearts: -1 });
    s = applyEffects(s, { hearts: -1 });
    expect(s.hearts).toBe(0);
    s = applyEffects(s, { hearts: -1 }); // one more hit after already at 0
    expect(s.hearts).toBe(0);
  });

  it('a lucidity drain below zero also costs a heart (the "quiet" way to lose all 3)', () => {
    let s = newRun();
    s.lucidity = 2;
    s = applyEffects(s, { lucidity: -5 }); // drops below 0 -> costs a heart, resets to the floor
    expect(s.hearts).toBe(2);
    expect(s.lucidity).toBeGreaterThan(0);
  });
});
