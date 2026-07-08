// LIMERENCE's hidden-ending unlock logic (spec 06 §1, endings 6-7) —
// mirrors ANAMNESIS's engine/endings.ts punchlineUnlocked/anamnesisAvailable/
// computeAnamnesisEligible exactly, substituting LIMERENCE's own flag names.
// Used both by the-morning-desk's `available` predicates (room content) and
// by packs/limerence/index.ts's `endingRules`, matching how ANAMNESIS's own
// act4.ts and packs/anamnesis/index.ts both reference the same functions.
import type { RunState } from '../../engine/schema';
import { hasFlag } from '../../engine/gameState';

/** Deliberately below PATTERN_CLARITY — demanding, but the door's cost is
 * noticing (a single specific choice), not raw lucidity grinding. */
export const MIRROR_LUCIDITY = 200;
/** Below MIRROR_LUCIDITY — the-pattern's cost is completionism (full codex +
 * keepsakes), not raw lucidity either. */
export const PATTERN_CLARITY = 140;

/** Whether the small laughing door (ending: the-mirror) is unlocked at the
 * final gate. `noticed-the-hands` is set by exactly one choice, in
 * the-morning-desk's own audit stage — mirroring ANAMNESIS's single
 * `usher-respect` flag, not a multi-room tally. */
export function mirrorUnlocked(s: RunState): boolean {
  return hasFlag(s, 'noticed-the-hands') && s.lucidity >= MIRROR_LUCIDITY;
}

/** Profile-level reachability gate for the-pattern (spec 06 §1.7): codex
 * complete over every "base" room (all rooms except the optional Records
 * Office trio) and at least two keepsake-gated choices taken across the
 * profile's lifetime. Pure and exported so it's independently testable. */
export function computePatternEligible(
  allRoomIds: string[],
  understoryIds: string[],
  codexUnlocked: string[],
  keepsakeChoicesTaken: string[],
): boolean {
  const baseRoomIds = allRoomIds.filter((id) => !understoryIds.includes(id));
  const codexComplete = baseRoomIds.every((id) => codexUnlocked.includes(id));
  const keepsakesProven = keepsakeChoicesTaken.length >= 2;
  return codexComplete && keepsakesProven;
}

/** Whether the hidden "I know every room" option is available this run:
 * profile-level eligibility (computed once by flow.ts at the final gate,
 * stored in the generic `RunState.anamnesisEligible` field — see
 * schema.ts's note that engine field names are never renamed per pack) plus
 * this run's own conditions: enough Clarity, the Benefit of the Doubt not
 * burned this run, and the-discovery's `chose-not-to-know` not set. */
export function patternAvailable(s: RunState): boolean {
  return Boolean(s.anamnesisEligible) && s.lucidity >= PATTERN_CLARITY && !s.memoryLost && !hasFlag(s, 'chose-not-to-know');
}
