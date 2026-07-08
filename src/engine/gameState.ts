import type { Axis, Effects, RunState, TranscriptEntry } from './schema';
import { ACT_POOLS } from '../content/graph';

export const MAX_HEARTS = 3;
export const LUCIDITY_FLOOR = 5;

/** `doorSeed` defaults to a fresh random value per run — pass one explicitly for
 * deterministic tests. It salts door-offer shuffling (see storyEngine.ts) so two
 * runs see different door orders even from an identical, empty visited history.
 * `prior` is the previous-run snapshot (see `RunState.prior`); pass it from
 * `Profile.lastRunTranscript`/`lastRunEndingId`/`runsCompleted`, or omit it for
 * a player's first-ever run. `keepsakesHeld` mirrors `Profile.keepsakes` at
 * run start (see `RunState.keepsakesHeld`) — omit it for a keepsake-less run.
 * `examined` stamps whether this run walks the Examined Path (spec 05) —
 * decided once, at the opt-in panel, and immutable for the run's lifetime. */
export function newRun(
  doorSeed: number = Math.floor(Math.random() * 2 ** 31),
  prior?: RunState['prior'],
  keepsakesHeld?: string[],
  examined?: boolean,
): RunState {
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
    keepsakesHeld,
    examined,
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

/** `choseIn`, but against a *previous* run's snapshot rather than the live
 * transcript — used by rooms that read `RunState.prior` (e.g. `the-echo`'s
 * junction callback). */
export function choseInPrior(prior: RunState['prior'], roomId: string, choiceId: string): boolean {
  return (prior?.transcript ?? []).some((e) => e.roomId === roomId && e.choiceId === choiceId);
}

/** Selects the previous run's single most significant choice for `the-archive`'s
 * exhibit card: the first entry whose choice cost a heart; else the entry with
 * the largest lucidity swing; else the final entry. Undefined only when the
 * previous run's transcript is empty (legacy save with no `effects` data, or
 * a degenerate empty transcript) — callers must degrade gracefully. */
export function pickExhibitEntry(transcript: TranscriptEntry[]): TranscriptEntry | undefined {
  if (transcript.length === 0) return undefined;
  const heartCost = transcript.find((e) => (e.effects?.hearts ?? 0) < 0);
  if (heartCost) return heartCost;
  let best: TranscriptEntry | undefined;
  let bestSwing = 0;
  for (const e of transcript) {
    const swing = Math.abs(e.effects?.lucidity ?? 0);
    if (swing > bestSwing) {
      bestSwing = swing;
      best = e;
    }
  }
  return best ?? transcript[transcript.length - 1];
}

/** Deterministic pseudo-shuffle key, local to this module (mirrors
 * storyEngine.ts's door-offer hash — kept separate rather than shared, since
 * the two callers hash different kinds of input for unrelated purposes). */
function fnvHash(input: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Rooms offered by the previous run's Act I-III pools that were never
 * *entered* — used by `the-unchosen`. Honest approximation, not a precise
 * record: the engine never tracks which doors were actually *offered* on any
 * given path, only which were entered, so "pool minus entered" is the proxy.
 * Every id this returns genuinely went unentered in that run, which is all
 * the room claims. Deterministically salted by the previous run's `runs`
 * count, so repeat visits to the same previous-run snapshot see the same 3
 * candidates and the same "swings open" pick. `pools` defaults to
 * ANAMNESIS's own `ACT_POOLS` — pass a pack's `graph.actPools` to reuse this
 * for a different pack's understory-analog room. */
export function pickUnchosenRooms(
  prior: RunState['prior'],
  pools: Record<1 | 2 | 3, string[]> = ACT_POOLS,
): { candidates: string[]; opens?: string } {
  const entered = new Set((prior?.transcript ?? []).map((e) => e.roomId));
  const pool = [...pools[1], ...pools[2], ...pools[3]];
  const unchosen = pool.filter((id) => !entered.has(id));
  if (unchosen.length === 0) return { candidates: [] };
  const salt = fnvHash(`unchosen#${prior?.runs ?? 0}`, 0);
  const candidates = [...unchosen].sort((a, b) => fnvHash(a, salt) - fnvHash(b, salt)).slice(0, 3);
  return { candidates, opens: candidates[0] };
}
