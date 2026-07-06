import type { RunState } from '../content/schema';
import { choseIn, hasFlag } from './gameState';

export type EndingId =
  | 'return'
  | 'open-hand'
  | 'fortress'
  | 'dissolved'
  | 'gardener'
  | 'punchline'
  | 'anamnesis';

export const PUNCHLINE_LUCIDITY = 220;
/** Deliberately below PUNCHLINE_LUCIDITY — demanding, but the door's cost is
 * completionism (spec 03), not raw lucidity grinding. */
export const ANAMNESIS_LUCIDITY = 140;

/** Whether the small laughing door is unlocked at the final gate. */
export function punchlineUnlocked(s: RunState): boolean {
  return hasFlag(s, 'usher-respect') && s.lucidity >= PUNCHLINE_LUCIDITY;
}

/** Profile-level reachability gate for the hidden ending (spec 03): codex
 * complete over every "base" room (all rooms except the optional understory
 * trio, which is color, not required homework) and at least two
 * keepsake-gated choices taken across the profile's lifetime. Pure and
 * exported so it's independently testable — flow.ts calls this once, fresh,
 * each time the final door is reached. */
export function computeAnamnesisEligible(
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

/** Whether the hidden fifth option — "I remember all of it" — is available.
 * `anamnesisEligible` (codex-complete + ≥2 keepsake choices, spec 03/04) is
 * profile-level and computed once by flow.ts at the final door; this adds the
 * per-run conditions: enough lucidity, and no erasure this run. */
export function anamnesisAvailable(s: RunState): boolean {
  return Boolean(s.anamnesisEligible) && s.lucidity >= ANAMNESIS_LUCIDITY && !hasFlag(s, 'erased-memory');
}

/**
 * Pure evaluation of the ending from final run state.
 * Priority: dissolution (hearts 0 or chosen) > the hidden ending > explicit
 * final-door choices > axis profile.
 */
export function evaluateEnding(s: RunState): EndingId {
  if (s.hearts <= 0) return 'dissolved';
  if (choseIn(s, 'door-that-asks', 'lie-down')) return 'dissolved';
  if (choseIn(s, 'door-that-asks', 'remember-everything')) return 'anamnesis';
  if (choseIn(s, 'door-that-asks', 'laughing-door')) return 'punchline';
  if (choseIn(s, 'door-that-asks', 'stay')) return 'gardener';

  const { selfOthers, controlAcceptance } = s.axes;
  const EXTREME = 35;
  if (selfOthers >= EXTREME && controlAcceptance >= EXTREME) return 'open-hand';
  if (selfOthers <= -EXTREME && controlAcceptance <= -EXTREME) return 'fortress';
  return 'return';
}

/** The endings denominator shown at every count display (title screen, end
 * screen, codex) — 6 until "anamnesis" has actually been witnessed, then 7.
 * Keeps the hidden seventh ending from advertising its own existence. */
export function endingsTotal(endingsSeen: string[]): number {
  return endingsSeen.includes('anamnesis') ? 7 : 6;
}

/** Poetic triptych of the run's axis profile, shown on the end screen. */
export function axisTriptych(s: RunState): [string, string, string] {
  const line = (v: number, neg: string, mid: string, pos: string) =>
    v <= -25 ? neg : v >= 25 ? pos : mid;
  return [
    line(
      s.axes.reasonFeeling,
      'You weighed the world before you touched it.',
      'You thought, and you also felt — neither won.',
      'You let the heart speak first, and argued later.',
    ),
    line(
      s.axes.selfOthers,
      'You kept yourself whole, whatever it cost the room.',
      'You held yourself and others in the same open hand.',
      'You gave yourself away, coin by coin, gladly.',
    ),
    line(
      s.axes.controlAcceptance,
      'You fought the current in every room, even the sea.',
      'You knew when to row and when to drift.',
      'You let the river decide, and called it wisdom.',
    ),
  ];
}
