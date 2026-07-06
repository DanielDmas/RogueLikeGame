/** Global-failure recovery (spec 09 §S6). Pure guard so a storm of errors —
 * e.g. one uncaught exception triggering several more during unwind — shows
 * the recovery overlay exactly once instead of stacking duplicates. */
export function shouldTriggerRecovery(alreadyShown: boolean): boolean {
  return !alreadyShown;
}
