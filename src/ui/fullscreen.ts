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
 * that just happened, silently re-enters fullscreen on the very next
 * interaction anywhere on the page — a click, a keypress, or a pointerdown
 * are all valid "user gestures" for `requestFullscreen()` even though the
 * interaction's own intent was something else (a title-menu button, a
 * door, pressing Space to advance), so the player never sees an explicit
 * "resume fullscreen?" prompt; the game just stays fullscreen through
 * ordinary menu navigation the way they'd expect.
 *
 * Listens on three event types, not just `click` (found live, 2026-07-16 —
 * owner report of fullscreen "resetting" navigating from the Vestibule into
 * a game): a `<button>` activated via Enter/Space synthesizes a `click`
 * automatically, but plenty of real first interactions never go through
 * that path — pressing Space to advance a beat is handled by a raw
 * `keydown` listener with no synthesized click, and a `pointerdown` that
 * doesn't complete as a full click (e.g. a press-drag) fires neither. All
 * three share one `armed` guard so only the first one to fire actually
 * calls `requestFullscreen()` — this cannot make the resume happen "more,"
 * only close the window in which it doesn't happen at all. The browser's
 * own mandatory fullscreen-exit-on-navigation is still visible for a beat
 * regardless (a hard platform constraint, not something any of this can
 * remove) — this only shortens how long the player is out of fullscreen
 * before the very first thing they do brings it back.
 */
export function resumeFullscreenAfterReload(): void {
  if (typeof sessionStorage === 'undefined' || typeof document === 'undefined') return;
  if (sessionStorage.getItem(FULLSCREEN_RESUME_KEY) !== '1') return;
  sessionStorage.removeItem(FULLSCREEN_RESUME_KEY);
  let armed = true;
  const resume = () => {
    if (!armed) return;
    armed = false;
    document.removeEventListener('click', resume, true);
    document.removeEventListener('keydown', resume, true);
    document.removeEventListener('pointerdown', resume, true);
    void document.documentElement.requestFullscreen().catch(() => {});
  };
  document.addEventListener('click', resume, { capture: true });
  document.addEventListener('keydown', resume, { capture: true });
  document.addEventListener('pointerdown', resume, { capture: true });
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
