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
