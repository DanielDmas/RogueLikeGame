import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { newRun } from '../engine/gameState';
import { hydrateProfile } from '../engine/saveStore';
import type { RunState } from '../engine/schema';

/**
 * Game-experience review E6 (2026-07-20, `15-game-experience-review.md`
 * §8, owner decision 2026-07-20): on a genuinely first-ever run, the
 * Examined Path offer is deferred past About+Persona to the first
 * reflections-bearing choice, instead of stacking as a third onboarding
 * modal before the player's first beat. `flow.ts` needs a real DOM to
 * drive live — same convention as this repo's other such regression tests
 * (interludeTiming, recovery, resumedMidRoom) — so the flow.ts assertions
 * here are source-shape checks; the field/hydration behavior is tested
 * directly.
 */

describe('RunState.examinedOfferPending propagation', () => {
  it('newRun() propagates the flag when passed', () => {
    expect(newRun(0, undefined, undefined, false, true).examinedOfferPending).toBe(true);
  });

  it('newRun() defaults to undefined (falsy) when omitted — every non-first-ever-run path', () => {
    expect(newRun().examinedOfferPending).toBeUndefined();
  });
});

describe('hydration of a legacy save with no examinedOfferPending field', () => {
  it('a run-in-progress profile from before this field existed hydrates with the field absent, not throwing', () => {
    const legacyRun: RunState = {
      hearts: 3,
      lucidity: 10,
      axes: { reasonFeeling: 0, selfOthers: 0, controlAcceptance: 0 },
      flags: [],
      visited: ['wallet'],
      transcript: [],
      currentRoom: null,
      currentStage: 0,
      act: 1,
      actOptionalDone: 1,
      memoryLost: false,
      finished: false,
      endingId: null,
      // no examined, no examinedOfferPending — exactly a pre-E6 save
    };
    const hydrated = hydrateProfile({ run: legacyRun });
    expect(hydrated.run?.examinedOfferPending).toBeUndefined();
    // The falsy check flow.ts's enterRoom uses must treat this exactly
    // like "no offer pending" — never crash, never fire an offer.
    expect(Boolean(hydrated.run?.examinedOfferPending)).toBe(false);
  });
});

describe('flow.ts source shape (game-experience review E6)', () => {
  const flowSrc = readFileSync(new URL('../engine/flow.ts', import.meta.url), 'utf8');

  it('the first-run branch (runsCompleted === 0) does not call showExaminedPathOffer, and arms examinedOfferPending', () => {
    const branchIdx = flowSrc.indexOf('if (this.profile.runsCompleted === 0) {');
    expect(branchIdx, 'first-ever-run branch not found').toBeGreaterThan(-1);
    const elseIdx = flowSrc.indexOf('} else {', branchIdx);
    const firstRunBranch = flowSrc.slice(branchIdx, elseIdx);
    expect(firstRunBranch).not.toContain('showExaminedPathOffer');
    expect(firstRunBranch).toContain('newRun(undefined, this.priorFromProfile(), this.keepsakesFromProfile(), false, true)');
  });

  it('the returning-player branch (else) still calls showExaminedPathOffer at run start, unchanged', () => {
    const branchIdx = flowSrc.indexOf('if (this.profile.runsCompleted === 0) {');
    const elseIdx = flowSrc.indexOf('} else {', branchIdx);
    const endIdx = flowSrc.indexOf('\n          }', elseIdx);
    const returningBranch = flowSrc.slice(elseIdx, endIdx);
    expect(returningBranch).toContain('await showExaminedPathOffer(');
  });

  it("enterRoom's deferred-offer block sits before the shouldShowReflections check", () => {
    const deferredIdx = flowSrc.indexOf('this.state.examinedOfferPending && choice.reflections?.length && !this.oneDoorMode');
    const reflectionsCheckIdx = flowSrc.indexOf('if (shouldShowReflections(this.state, choice)) {');
    expect(deferredIdx, 'deferred-offer condition not found').toBeGreaterThan(-1);
    expect(reflectionsCheckIdx, 'shouldShowReflections check not found').toBeGreaterThan(-1);
    expect(deferredIdx).toBeLessThan(reflectionsCheckIdx);
  });

  it('the deferred-offer block clears the flag and sets examined from the answer before persisting', () => {
    const startIdx = flowSrc.indexOf('this.state.examinedOfferPending && choice.reflections?.length && !this.oneDoorMode');
    const endIdx = flowSrc.indexOf('if (shouldShowReflections(this.state, choice)) {', startIdx);
    const block = flowSrc.slice(startIdx, endIdx);
    const clearIdx = block.indexOf('examinedOfferPending: false');
    const offerIdx = block.indexOf('await showExaminedPathOffer(');
    const setExaminedIdx = block.indexOf('this.state = { ...this.state, examined }');
    const persistIdx = block.indexOf('await this.persist();');
    expect(clearIdx).toBeGreaterThan(-1);
    expect(offerIdx).toBeGreaterThan(clearIdx);
    expect(setExaminedIdx).toBeGreaterThan(offerIdx);
    expect(persistIdx).toBeGreaterThan(setExaminedIdx);
  });

  it('playOneDoor never arms examinedOfferPending (T9 stays fully unaffected)', () => {
    // E-3 (extended review, 2026-08-01) changed this call from a bare
    // `newRun()` to thread the player's held keepsakes through — same
    // invariant this test pins (no examinedOfferPending), updated call site.
    const startIdx = flowSrc.indexOf(
      'this.state = { ...newRun(undefined, undefined, this.keepsakesFromProfile()), act: room.act };',
    );
    expect(startIdx, 'playOneDoor newRun() call not found').toBeGreaterThan(-1);
    expect(flowSrc.slice(startIdx, startIdx + 100)).not.toContain('examinedOfferPending');
  });
});
