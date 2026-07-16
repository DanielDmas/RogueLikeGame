import { describe, expect, it } from 'vitest';
import { rememberFullscreenForReload, resumeFullscreenAfterReload, shouldOpenPauseOnEscape } from '../ui/fullscreen';

describe('shouldOpenPauseOnEscape — Escape vs. the browser\'s unblockable fullscreen-exit gesture', () => {
  it('opens the pause menu on a normal Escape press (in-game, no overlay, not fullscreen)', () => {
    expect(shouldOpenPauseOnEscape(true, false, false)).toBe(true);
  });

  it('does NOT open the pause menu when fullscreen was active — the browser is already exiting it on this same press', () => {
    expect(shouldOpenPauseOnEscape(true, false, true)).toBe(false);
  });

  it('a second Escape press, now not fullscreen, does open the pause menu', () => {
    // Simulates the two-press sequence: press 1 (fullscreen=true) suppressed by the guard,
    // press 2 (fullscreen now false, since the browser already exited it) opens pause.
    expect(shouldOpenPauseOnEscape(true, false, true)).toBe(false);
    expect(shouldOpenPauseOnEscape(true, false, false)).toBe(true);
  });

  it('never opens the pause menu outside a run, regardless of fullscreen state', () => {
    expect(shouldOpenPauseOnEscape(false, false, false)).toBe(false);
    expect(shouldOpenPauseOnEscape(false, false, true)).toBe(false);
  });

  it('never opens a second pause menu (or reopens) while a blocking overlay/field-note is already showing', () => {
    expect(shouldOpenPauseOnEscape(true, true, false)).toBe(false);
    expect(shouldOpenPauseOnEscape(true, true, true)).toBe(false);
  });

  it('the overlay guard and the fullscreen guard are independent — both must be clear to open pause', () => {
    const cases: [boolean, boolean, boolean, boolean][] = [
      [true, false, false, true],
      [true, false, true, false],
      [true, true, false, false],
      [true, true, true, false],
      [false, false, false, false],
    ];
    for (const [inGame, hasOverlay, wasFullscreen, expected] of cases) {
      expect(shouldOpenPauseOnEscape(inGame, hasOverlay, wasFullscreen), `${inGame}/${hasOverlay}/${wasFullscreen}`).toBe(
        expected,
      );
    }
  });
});

describe('rememberFullscreenForReload / resumeFullscreenAfterReload — fullscreen survives a reload/navigation', () => {
  // This suite runs in vitest's node environment (no jsdom, project convention —
  // see registerOverlay.test.ts's note on the same choice), so `sessionStorage`
  // and `document` are both undefined here. Both functions guard on that and
  // return immediately; the real DOM behavior (sessionStorage round-trip,
  // requestFullscreen-on-next-click) is exercised live via Playwright per
  // CLAUDE.md's UAT rule, not unit-testable without a browser. What's worth
  // locking in at this layer is that neither function throws when the globals
  // it depends on are absent — the exact situation a non-browser test runner
  // (or a browser lacking sessionStorage, e.g. some locked-down privacy modes)
  // puts them in.
  it('rememberFullscreenForReload is a no-op without sessionStorage', () => {
    expect(() => rememberFullscreenForReload()).not.toThrow();
  });

  it('resumeFullscreenAfterReload is a no-op without sessionStorage/document', () => {
    expect(() => resumeFullscreenAfterReload()).not.toThrow();
  });
});
