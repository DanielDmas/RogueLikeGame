import type { RunState } from '../content/schema';
import { choseIn, hasFlag } from './gameState';

export type EndingId =
  | 'return'
  | 'open-hand'
  | 'fortress'
  | 'dissolved'
  | 'gardener'
  | 'punchline';

export const PUNCHLINE_LUCIDITY = 220;

/** Whether the small laughing door is unlocked at the final gate. */
export function punchlineUnlocked(s: RunState): boolean {
  return hasFlag(s, 'usher-respect') && s.lucidity >= PUNCHLINE_LUCIDITY;
}

/**
 * Pure evaluation of the ending from final run state.
 * Priority: dissolution (hearts 0 or chosen) > explicit final-door choices > axis profile.
 */
export function evaluateEnding(s: RunState): EndingId {
  if (s.hearts <= 0) return 'dissolved';
  if (choseIn(s, 'door-that-asks', 'lie-down')) return 'dissolved';
  if (choseIn(s, 'door-that-asks', 'laughing-door')) return 'punchline';
  if (choseIn(s, 'door-that-asks', 'stay')) return 'gardener';

  const { selfOthers, controlAcceptance } = s.axes;
  const EXTREME = 35;
  if (selfOthers >= EXTREME && controlAcceptance >= EXTREME) return 'open-hand';
  if (selfOthers <= -EXTREME && controlAcceptance <= -EXTREME) return 'fortress';
  return 'return';
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
