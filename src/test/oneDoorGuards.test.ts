import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * T9 — regression guard for the exact profile-mutation gating "One Door"
 * depends on. enterRoom is a single ~185-line method shared by both the
 * real run-loop and the standalone vignette (playOneDoor) rather than two
 * near-duplicate implementations — cheaper to maintain, but it means the
 * `this.oneDoorMode` guards inside it are load-bearing: without them, a
 * standalone 3-minute vignette could permanently award a keepsake, tick the
 * lifetime hearts-lost stat, or burn a profile's one-time first-heart-loss
 * explainer. This can't be exercised end-to-end here (no DOM — see
 * vite.config.ts's `environment: 'node'`); it's enforced as a source-level
 * invariant instead, the same pattern panelLifecycle.test.ts uses for its
 * own real, live-caught bug.
 */

const flowSrc = readFileSync(resolve(__dirname, '../engine/flow.ts'), 'utf-8');

describe('flow.ts — "One Door" (T9) must not leak permanent profile side effects', () => {
  it('declares the oneDoorMode field and sets/clears it around the vignette', () => {
    expect(flowSrc).toContain('private oneDoorMode = false;');
    expect(flowSrc).toContain('this.oneDoorMode = true;');
    expect(flowSrc).toContain('this.oneDoorMode = false;');
  });

  it('gates the lifetime heartsLost stat behind !this.oneDoorMode', () => {
    const idx = flowSrc.indexOf('this.profile.heartsLost +=');
    expect(idx, 'heartsLost mutation not found').toBeGreaterThan(-1);
    const before = flowSrc.slice(Math.max(0, idx - 80), idx);
    expect(before).toContain('if (!this.oneDoorMode)');
  });

  it('gates keepsake earning (both the flags loop and keepsakeChoicesTaken) behind !this.oneDoorMode', () => {
    const idx = flowSrc.indexOf('keepsakesEarnedByFlags(newFlags');
    expect(idx, 'keepsake-earning block not found').toBeGreaterThan(-1);
    const before = flowSrc.slice(Math.max(0, idx - 200), idx);
    expect(before).toContain('if (!this.oneDoorMode)');

    const takenIdx = flowSrc.indexOf('profile.keepsakeChoicesTaken.push');
    expect(takenIdx, 'keepsakeChoicesTaken mutation not found').toBeGreaterThan(-1);
    // Same guard block as the flags loop above — confirm it's still inside
    // the same `if (!this.oneDoorMode) {` region, not a sibling unguarded one.
    const guardIdx = flowSrc.lastIndexOf('if (!this.oneDoorMode) {', takenIdx);
    const closeIdx = flowSrc.indexOf('\n      }', guardIdx);
    expect(guardIdx).toBeGreaterThan(-1);
    expect(takenIdx).toBeLessThan(closeIdx);
  });

  it('gates the first-heart-loss explainer (the one-time profile flag) behind !this.oneDoorMode', () => {
    const idx = flowSrc.indexOf('const firstHeartLoss =');
    expect(idx, 'firstHeartLoss computation not found').toBeGreaterThan(-1);
    const line = flowSrc.slice(idx, flowSrc.indexOf('\n', idx));
    expect(line).toContain('!this.oneDoorMode');
  });

  it('playOneDoor never sets this.inGame — persist() must not stamp a resumable run', () => {
    const startIdx = flowSrc.indexOf('private async playOneDoor()');
    expect(startIdx, 'playOneDoor not found').toBeGreaterThan(-1);
    const endIdx = flowSrc.indexOf('\n  }', startIdx);
    const body = flowSrc.slice(startIdx, endIdx);
    expect(body).not.toContain('this.inGame = true');
  });

  it('playOneDoor reloads afterward rather than manually restoring title-loop state', () => {
    const startIdx = flowSrc.indexOf('private async playOneDoor()');
    const endIdx = flowSrc.indexOf('\n  }', startIdx);
    const body = flowSrc.slice(startIdx, endIdx);
    expect(body).toContain('location.reload()');
  });

  it("codexUnlocked and roomVisits stay unguarded — the vignette's room genuinely counts", () => {
    // Regression the other direction: these two are *supposed* to run during
    // One Door (the whole point is a real, remembered visit), so make sure a
    // future edit didn't accidentally wrap them in the oneDoorMode guard too.
    const codexIdx = flowSrc.indexOf('this.profile.codexUnlocked.push(room.id)');
    const visitsIdx = flowSrc.indexOf('this.profile.roomVisits[room.id] =');
    expect(codexIdx).toBeGreaterThan(-1);
    expect(visitsIdx).toBeGreaterThan(-1);
    const codexBefore = flowSrc.slice(Math.max(0, codexIdx - 60), codexIdx);
    const visitsBefore = flowSrc.slice(Math.max(0, visitsIdx - 60), visitsIdx);
    expect(codexBefore).not.toContain('oneDoorMode');
    expect(visitsBefore).not.toContain('oneDoorMode');
  });
});
