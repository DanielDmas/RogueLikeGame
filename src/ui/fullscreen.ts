/** True when running inside the Electron shell (vs. a plain browser tab). */
export function isElectron(): boolean {
  return typeof navigator !== 'undefined' && /electron/i.test(navigator.userAgent);
}

export function isFullscreen(): boolean {
  return typeof document !== 'undefined' && document.fullscreenElement != null;
}

/** Toggles fullscreen on the whole document — works the same in-browser and inside Electron. */
export async function toggleFullscreen(): Promise<void> {
  if (typeof document === 'undefined') return;
  try {
    if (isFullscreen()) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    // Fullscreen requires a user gesture in some browsers; a rejected
    // request is not an error worth surfacing to the player.
  }
}

/**
 * Escape is the browser's own unblockable "exit fullscreen" gesture — no
 * amount of `preventDefault()` stops it, by design, so a player can always
 * get out of fullscreen. That means a single Escape press while fullscreen
 * both exits fullscreen *and* would, unless guarded, snap the pause menu
 * open on top of that transition — reported as "fullscreen just resets
 * itself" when really it's the game reacting to the same keypress the
 * browser already acted on. Pure so the policy is testable without a real
 * Fullscreen API (unavailable in most headless/CI environments): the first
 * Escape while fullscreen is left to just exit fullscreen; a second, separate
 * press (now not fullscreen) opens the pause menu as usual.
 */
export function shouldOpenPauseOnEscape(inGame: boolean, hasBlockingOverlay: boolean, wasFullscreen: boolean): boolean {
  return inGame && !hasBlockingOverlay && !wasFullscreen;
}
