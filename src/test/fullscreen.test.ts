import { describe, expect, it } from 'vitest';
import { shouldOpenPauseOnEscape } from '../ui/fullscreen';

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
