import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Regression guard for a real bug found in code review (2026-07-15, Fable
 * pass): `currentStage` must be bumped to the *next* stage before the
 * first-heart-loss explainer's own `persist()` call, not after. The
 * explainer is a user-paced beat (Escape → pause → "Save & exit" is fully
 * reachable while it's showing); if the persisted state still points
 * `currentStage` at the stage whose choice was just applied, resuming
 * replays that stage and re-applies the choice's effects a second time —
 * a double heart loss at the exact moment a first-time player is being
 * told what a heart loss even is. This can't be exercised end-to-end here
 * (flow.ts's Game class needs a DOM — see vite.config.ts's
 * `environment: 'node'`); enforced as a source-level ordering invariant
 * instead, the same pattern oneDoorGuards.test.ts uses.
 */

const flowSrc = readFileSync(resolve(__dirname, '../engine/flow.ts'), 'utf-8');

describe('flow.ts — currentStage bumps before the first-heart-loss explainer persists', () => {
  it('bumps currentStage to i + 1 before the firstHeartLoss block, not after', () => {
    const bumpIdx = flowSrc.indexOf('currentStage: i + 1');
    const guardIdx = flowSrc.indexOf('if (firstHeartLoss) {');
    expect(bumpIdx, 'currentStage: i + 1 assignment not found').toBeGreaterThan(-1);
    expect(guardIdx, 'if (firstHeartLoss) block not found').toBeGreaterThan(-1);
    expect(bumpIdx, 'currentStage must be bumped before the firstHeartLoss block, so its persist() call never saves a stale stage index').toBeLessThan(guardIdx);
  });

  it('only one currentStage bump exists between applying a choice and its outcome beats (no stray earlier/later duplicate)', () => {
    const applyIdx = flowSrc.indexOf('applyEffects(this.state, choice.effects)');
    const outcomeIdx = flowSrc.indexOf('this.text.playBeats(choice.outcome');
    expect(applyIdx).toBeGreaterThan(-1);
    expect(outcomeIdx).toBeGreaterThan(applyIdx);
    const between = flowSrc.slice(applyIdx, outcomeIdx);
    const matches = between.match(/currentStage: i \+ 1/g) ?? [];
    expect(matches.length, `expected exactly one currentStage bump between applying the choice and its outcome beats, found ${matches.length}`).toBe(1);
  });
});
