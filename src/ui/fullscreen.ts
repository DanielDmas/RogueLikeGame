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

const FULLSCREEN_RESUME_KEY = 'vestibule:wasFullscreen';

/**
 * Every `location.reload()`/`location.href` navigation in this app
 * (returning to title, saving Settings, the Vestibule button, resetting a
 * run, jump()'s own reload, ...) drops fullscreen unconditionally — the
 * Fullscreen API cannot survive a page navigation, by browser design, and
 * re-entering it needs a fresh user gesture. Found live (owner report,
 * 2026-07-16): every one of those normal menu actions silently kicked the
 * player out of fullscreen, which read as "the game keeps resetting my
 * fullscreen." Call this immediately before any such navigation; pairs
 * with `resumeFullscreenAfterReload()` below.
 */
export function rememberFullscreenForReload(): void {
  if (typeof sessionStorage === 'undefined') return;
  if (isFullscreen()) sessionStorage.setItem(FULLSCREEN_RESUME_KEY, '1');
}

/**
 * Call once at boot. If the page was fullscreen right before the reload
 * that just happened, silently re-enters fullscreen on the very next click
 * anywhere on the page — a click is a valid "user gesture" for
 * `requestFullscreen()` even though the click's own intent was something
 * else (a title-menu button, a door, anything), so the player never sees
 * an explicit "resume fullscreen?" prompt; the game just stays fullscreen
 * through ordinary menu navigation the way they'd expect.
 */
export function resumeFullscreenAfterReload(): void {
  if (typeof sessionStorage === 'undefined' || typeof document === 'undefined') return;
  if (sessionStorage.getItem(FULLSCREEN_RESUME_KEY) !== '1') return;
  sessionStorage.removeItem(FULLSCREEN_RESUME_KEY);
  const onFirstClick = () => {
    void document.documentElement.requestFullscreen().catch(() => {});
  };
  document.addEventListener('click', onFirstClick, { once: true, capture: true });
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
