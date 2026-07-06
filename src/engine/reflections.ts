import type { Choice, Reflection, RunState } from '../content/schema';

/** Pure gate for the Reflection card (spec 05) — extracted so the "a player
 * who never opts in sees nothing new, ever" guarantee is testable without a
 * DOM. `state.examined` is falsy for every player who never opts in
 * (undefined on legacy saves, false once declined), so this returns false
 * for all of them regardless of the choice. */
export function shouldShowReflections(state: RunState, choice: Choice): boolean {
  return Boolean(state.examined) && Boolean(choice.reflections?.length);
}

/** Pure gate for the once-per-act Socratic aside (spec 05) — mirrors the
 * condition `flow.ts`'s `syncTheme` actually branches on, so the "never
 * fires when not examined" guarantee is testable without a DOM. */
export function shouldShowSocraticAside(state: RunState): boolean {
  return Boolean(state.examined) && state.act >= 1 && state.act <= 4;
}

/** Fisher-Yates, using the caller-supplied random source (defaults to
 * `Math.random`) so tests can inject a deterministic one. Rows are shuffled
 * fresh on every display — a fixed order would silently rank the four
 * traditions, which is exactly the neutrality the owner asked the mode to
 * have. Tests must assert set-equality of the rendered rows, never order. */
export function shuffledReflections(reflections: Reflection[], random: () => number = Math.random): Reflection[] {
  const copy = [...reflections];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
