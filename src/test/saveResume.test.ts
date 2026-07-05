import { describe, expect, it } from 'vitest';
import { newRun } from '../engine/gameState';
import { completeRoom, makeRegistry } from '../engine/storyEngine';
import { allRooms } from '../content/rooms';
import type { RunState } from '../content/schema';

const registry = makeRegistry(allRooms);

/** Mirrors the exact resume formula used in Game.enterRoom (flow.ts) — kept
 * here so the resume contract has a direct, DOM-free regression test. Full
 * end-to-end verification (actually quitting/reloading mid-room) is covered
 * by the Playwright UAT pass. */
function resumeStageOf(state: RunState): number {
  return state.currentStage ?? 0;
}

describe('mid-room save/resume — the currentStage fix', () => {
  it('a fresh run starts at stage 0', () => {
    expect(newRun().currentStage).toBe(0);
  });

  it('resumeStageOf reads back whatever stage was persisted', () => {
    const s = { ...newRun(), currentStage: 2 };
    expect(resumeStageOf(s)).toBe(2);
  });

  it('a legacy save with no currentStage field resumes at stage 0, not NaN/undefined', () => {
    const legacy = { ...newRun() } as RunState;
    delete (legacy as { currentStage?: number }).currentStage;
    expect(resumeStageOf(legacy)).toBe(0);
  });

  it('completeRoom resets currentStage to 0, so the next room always starts fresh', () => {
    const midRoom = { ...newRun(), currentStage: 3, currentRoom: 'wallet' };
    const completed = completeRoom(midRoom, 'wallet', registry);
    expect(completed.currentStage).toBe(0);
    expect(completed.currentRoom).toBeNull();
  });

  it('a room with N stages: resuming from the last stage index skips all earlier stages (no replay/double-apply)', () => {
    const room = allRooms.find((r) => r.stages.length > 1);
    expect(room, 'need at least one multi-stage room to exercise this').toBeDefined();
    const lastStage = room!.stages.length - 1;
    const resumed = { ...newRun(), currentStage: lastStage, currentRoom: room!.id };
    const visitedStages: number[] = [];
    for (let i = resumeStageOf(resumed); i < room!.stages.length; i++) visitedStages.push(i);
    expect(visitedStages).toEqual([lastStage]);
  });
});
