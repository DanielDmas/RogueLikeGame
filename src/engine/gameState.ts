import type { Axis, Effects, RunState } from '../content/schema';

export const MAX_HEARTS = 3;
export const LUCIDITY_FLOOR = 5;

export function newRun(): RunState {
  return {
    hearts: MAX_HEARTS,
    lucidity: 0,
    axes: { reasonFeeling: 0, selfOthers: 0, controlAcceptance: 0 },
    flags: [],
    visited: [],
    transcript: [],
    currentRoom: null,
    act: 0,
    actOptionalDone: 0,
    memoryLost: false,
    finished: false,
    endingId: null,
  };
}

const clampAxis = (v: number) => Math.max(-100, Math.min(100, v));

/** Applies a choice's effects. Pure: returns a new state. */
export function applyEffects(state: RunState, effects: Effects): RunState {
  const next: RunState = {
    ...state,
    axes: { ...state.axes },
    flags: [...state.flags],
    visited: [...state.visited],
    transcript: [...state.transcript],
  };

  if (effects.axes) {
    for (const [axis, delta] of Object.entries(effects.axes) as [Axis, number][]) {
      next.axes[axis] = clampAxis(next.axes[axis] + delta);
    }
  }
  if (effects.flags) {
    for (const f of effects.flags) if (!next.flags.includes(f)) next.flags.push(f);
  }
  if (effects.loseMemory) next.memoryLost = true;
  if (effects.hearts) next.hearts = Math.max(0, Math.min(MAX_HEARTS, next.hearts + effects.hearts));

  if (effects.lucidity) {
    next.lucidity += effects.lucidity;
    // Draining below zero costs a heart and resets lucidity to a floor.
    if (next.lucidity < 0) {
      next.hearts = Math.max(0, next.hearts - 1);
      next.lucidity = LUCIDITY_FLOOR;
    }
  }
  return next;
}

export function hasFlag(state: RunState, flag: string): boolean {
  return state.flags.includes(flag);
}

export function choseIn(state: RunState, roomId: string, choiceId: string): boolean {
  return state.transcript.some((t) => t.roomId === roomId && t.choiceId === choiceId);
}

export function lastChoiceIn(state: RunState, roomId: string): string | null {
  for (let i = state.transcript.length - 1; i >= 0; i--) {
    if (state.transcript[i].roomId === roomId) return state.transcript[i].choiceId;
  }
  return null;
}
