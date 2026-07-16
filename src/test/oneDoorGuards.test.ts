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

/**
 * Finds the nearest `if (!this.oneDoorMode) {` before `markerIdx` and
 * returns whether `markerIdx` sits inside that block's matching closing
 * brace — via real brace-depth counting rather than a fixed character
 * window, so it survives comments/formatting shifting the guard further
 * from the code it gates (a fixed-offset window broke on exactly this in
 * code review, 2026-07-15, when consolidating 3 scattered guards into 1).
 */
function isInsideOneDoorGuard(markerIdx: number): boolean {
  const guardIdx = flowSrc.lastIndexOf('if (!this.oneDoorMode) {', markerIdx);
  if (guardIdx === -1) return false;
  const openIdx = flowSrc.indexOf('{', guardIdx);
  let depth = 0;
  for (let i = openIdx; i < flowSrc.length; i++) {
    if (flowSrc[i] === '{') depth++;
    else if (flowSrc[i] === '}') {
      depth--;
      if (depth === 0) return markerIdx < i;
    }
  }
  return false;
}

describe('flow.ts — "One Door" (T9) must not leak permanent profile side effects', () => {
  it('declares the oneDoorMode field and sets/clears it around the vignette', () => {
    expect(flowSrc).toContain('private oneDoorMode = false;');
    expect(flowSrc).toContain('this.oneDoorMode = true;');
    expect(flowSrc).toContain('this.oneDoorMode = false;');
  });

  it('gates the lifetime heartsLost stat behind !this.oneDoorMode', () => {
    const idx = flowSrc.indexOf('this.profile.heartsLost +=');
    expect(idx, 'heartsLost mutation not found').toBeGreaterThan(-1);
    expect(isInsideOneDoorGuard(idx)).toBe(true);
  });

  it('gates keepsake earning (both the flags loop and keepsakeChoicesTaken) behind !this.oneDoorMode', () => {
    const idx = flowSrc.indexOf('keepsakesEarnedByFlags(newFlags');
    expect(idx, 'keepsake-earning block not found').toBeGreaterThan(-1);
    expect(isInsideOneDoorGuard(idx)).toBe(true);

    const takenIdx = flowSrc.indexOf('profile.keepsakeChoicesTaken.push');
    expect(takenIdx, 'keepsakeChoicesTaken mutation not found').toBeGreaterThan(-1);
    // Same guard block as the flags loop above, not a sibling unguarded one.
    expect(isInsideOneDoorGuard(takenIdx)).toBe(true);
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
    // reloadPage() wraps location.reload() so fullscreen survives the
    // reload (rememberFullscreenForReload) — see fullscreen.ts.
    expect(body).toContain('this.reloadPage()');
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
