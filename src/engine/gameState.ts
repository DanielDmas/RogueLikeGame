import type { Axis, Effects, RunState, TranscriptEntry } from '../content/schema';

export const MAX_HEARTS = 3;
export const LUCIDITY_FLOOR = 5;

/** `doorSeed` defaults to a fresh random value per run — pass one explicitly for
 * deterministic tests. It salts door-offer shuffling (see storyEngine.ts) so two
 * runs see different door orders even from an identical, empty visited history.
 * `prior` is the previous-run snapshot (see `RunState.prior`); pass it from
 * `Profile.lastRunTranscript`/`lastRunEndingId`/`runsCompleted`, or omit it for
 * a player's first-ever run. */
export function newRun(doorSeed: number = Math.floor(Math.random() * 2 ** 31), prior?: RunState['prior']): RunState {
  return {
    hearts: MAX_HEARTS,
    lucidity: 0,
    axes: { reasonFeeling: 0, selfOthers: 0, controlAcceptance: 0 },
    flags: [],
    visited: [],
    transcript: [],
    currentRoom: null,
    currentStage: 0,
    doorSeed,
    prior,
    act: 0,
    actOptionalDone: 0,
    memoryLost: false,
    finished: false,
    endingId: null,
  };
}

/** Selects up to 3 representative moments from a previous run's transcript —
 * used by `the-cave`'s shadow-play (first, middle, last choice made): a rough
 * shape of the whole run without any per-room bookkeeping. Empty if there is
 * no prior transcript (first-ever run, or a legacy save from before `prior`
 * existed) — callers must degrade gracefully rather than assume 3 entries. */
export function pickShadowMoments(prior: RunState['prior']): TranscriptEntry[] {
  const transcript = prior?.transcript ?? [];
  if (transcript.length <= 3) return transcript;
  const mid = Math.floor(transcript.length / 2);
  return [transcript[0], transcript[mid], transcript[transcript.length - 1]];
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
