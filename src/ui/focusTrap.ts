// 9.5.1 — focus containment for open overlays/dialogs. Without this, Tab can
// walk focus out of an open modal (Settings/Codex/Ledger/About/Field Note/
// the global recovery panel) into the game UI hidden behind it — the single
// biggest remaining accessibility gap flagged by the third-pass review.
//
// The decision logic is a pure function (`focusTrapTarget`) so it's testable
// under the project's node-only vitest environment; the DOM wiring
// (`trapFocus`/`installFocusTrap`) is a thin, untested shell around it, per
// the repo's own "pure exported helpers for anything that needs a test"
// convention (docs/development/README.md #3).

export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Given how many focusable elements a trap's container currently holds, the
 * index of the one the browser thinks is active (-1 if focus is not on any
 * of them — e.g. it escaped the trap, or nothing is focused yet), and
 * whether this was a Shift+Tab, decides whether the trap must intervene.
 *
 * Returns the index Tab should be redirected to, or `null` to leave the
 * browser's default in-between tabbing alone (the common case).
 */
export function focusTrapTarget(count: number, activeIndex: number, shiftKey: boolean): number | null {
  if (count === 0) return null;
  if (activeIndex === -1 || activeIndex >= count) return shiftKey ? count - 1 : 0;
  if (shiftKey && activeIndex === 0) return count - 1;
  if (!shiftKey && activeIndex === count - 1) return 0;
  return null;
}

const stack: HTMLElement[] = [];

function focusables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (node) => !node.hasAttribute('hidden') && node.getClientRects().length > 0,
  );
}

/**
 * Traps Tab/Shift+Tab focus cycling inside `container` for as long as it is
 * the innermost active trap (a stack, so a Field Note opened on top of the
 * Codex correctly hands control back to the Codex's own trap once closed).
 * Returns a cleanup function; safe to call more than once.
 */
export function trapFocus(container: HTMLElement): () => void {
  stack.push(container);
  const previouslyFocused = document.activeElement as HTMLElement | null;

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab' || stack[stack.length - 1] !== container) return;
    const items = focusables(container);
    const target = focusTrapTarget(items.length, items.indexOf(document.activeElement as HTMLElement), e.shiftKey);
    if (target !== null && items[target]) {
      e.preventDefault();
      items[target].focus();
    }
  };
  document.addEventListener('keydown', onKeydown, true);

  // Deferred to a microtask: `container` is often still empty at the moment
  // its caller creates it (the shared `overlay()` helper returns an empty
  // div that the caller then fills in, synchronously, before yielding) — by
  // the time this microtask runs, that synchronous build-out has finished.
  // If the caller already focused something itself in the meantime (e.g.
  // explanation.ts's own `close.focus()`), this is a no-op.
  queueMicrotask(() => {
    if (stack.indexOf(container) === -1) return; // trap already released
    if (container.contains(document.activeElement)) return;
    const items = focusables(container);
    if (items.length > 0) items[0].focus();
  });

  let cleaned = false;
  return () => {
    if (cleaned) return;
    cleaned = true;
    document.removeEventListener('keydown', onKeydown, true);
    const idx = stack.indexOf(container);
    if (idx !== -1) stack.splice(idx, 1);
    if (previouslyFocused && document.body.contains(previouslyFocused)) previouslyFocused.focus();
  };
}

/**
 * Convenience wrapper: installs `trapFocus` and auto-releases it the moment
 * `container` leaves the document, so every overlay's many different close
 * paths (Done button, Escape, background click, timers) don't each need
 * their own explicit cleanup call.
 */
export function installFocusTrap(container: HTMLElement): void {
  const cleanup = trapFocus(container);
  const observer = new MutationObserver(() => {
    if (!document.body.contains(container)) {
      cleanup();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
