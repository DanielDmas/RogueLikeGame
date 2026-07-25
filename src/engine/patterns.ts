// Cross-run guide recognition — "pattern-barks" (master plan Tier 1 item 4:
// "the guide visibly *knows you* across runs"). This module owns the
// *detection* only; every line the guide actually speaks lives in each pack's
// own guide content, keyed by the ids below. That split is deliberate: the
// engine must never hold authored prose, and a second pack must be able to
// notice the same fact in an entirely different voice.
//
// Three binding constraints on anything added here:
//
// 1. **Observation, never scoring.** The Experience Charter forbids grades
//    and verdicts ("endings are trades, not verdicts"). A pattern is a fact
//    about how someone has played — "you have never spent a heart" — never a
//    judgement about it ("you are playing too cautiously"). If a candidate
//    pattern cannot be phrased as a neutral observation, it does not belong
//    here.
// 2. **Cross-run only.** Anything derivable from the *current* `RunState`
//    (axes, hearts, lucidity) is already handled by the existing axis-
//    reactive barks. A pattern earns its place here only by seeing something
//    a single run cannot: the shape of a player's whole history.
// 3. **Read-only, and never gameplay-affecting.** These read `Profile`'s
//    Ledger-only fields and return ids for narration. No pattern may ever
//    gate a room, a choice, or an ending — that would silently convert
//    documented Ledger-only counters into gameplay predicates (see
//    `Profile.choiceHistory`'s own comment in saveStore.ts).
//
// Every input below is a **required** parameter. That is a deliberate
// departure from the older engine modules (`storyEngine`'s `DEFAULT_GRAPH`,
// `ledger`'s `UNDERSTORY_SEQUENCE`, `gameState`'s `ACT_POOLS`), which default
// to ANAMNESIS's own content and have produced several silent cross-pack
// leaks over this project's history — the master plan tracks that whole class
// as its own item. New engine code does not extend the pattern: a caller that
// forgets to supply its pack's numbers gets a compile error, not ANAMNESIS's.

/** The facts the guide may notice. Ordered by how *particular* each one is —
 * `activePatterns` returns matches in this order, so when several apply the
 * more distinctive observation is offered first. */
export type PlayerPatternId =
  /** Several finished runs, but every one of them ended the same way. */
  | 'same-ending-again'
  /** Multiple finished runs without ever losing a heart. */
  | 'never-spent-a-heart'
  /** Carries keepsakes from earlier runs but has never spent one. */
  | 'holds-unspent-keepsakes'
  /** Has never found (or never taken) the way down into the Understory. */
  | 'never-descended'
  /** Has witnessed most of the rooms that exist. */
  | 'walked-most-rooms'
  /** Keeps returning to one particular room across runs. */
  | 'returns-to-one-room';

/** Stable priority order — also the declaration order of the union above. */
export const PLAYER_PATTERN_IDS: readonly PlayerPatternId[] = [
  'same-ending-again',
  'never-spent-a-heart',
  'holds-unspent-keepsakes',
  'never-descended',
  'walked-most-rooms',
  'returns-to-one-room',
];

/** Finished runs before the guide comments on a history at all. One run is
 * not yet a pattern — it is just the first time. */
export const MIN_RUNS_FOR_PATTERN = 2;
/** "Every run ended the same way" needs more than two data points to be a
 * shape rather than a coincidence. */
export const MIN_RUNS_FOR_SAME_ENDING = 3;
/** Completions of one room before it counts as somewhere the player returns
 * to, rather than somewhere they happened to pass twice. */
export const MIN_VISITS_FOR_RETURN = 3;
/** Share of the visible rooms that counts as having walked most of the place. */
export const WALKED_MOST_FRACTION = 0.75;

export interface PatternInputs {
  /** `Profile.runsCompleted`. */
  runsCompleted: number;
  /** `Profile.endingsSeen` — distinct ending ids ever reached. */
  endingsSeen: readonly string[];
  /** `Profile.heartsLost` — lifetime, across every run. */
  heartsLost: number;
  /** `Profile.understoryDescents` — completed descents, lifetime. */
  understoryDescents: number;
  /** `Profile.roomVisits` — per-room completion counts. Its key count is the
   * number of *distinct* rooms ever completed. */
  roomVisits: Readonly<Record<string, number>>;
  /** `Profile.keepsakes` — ever earned. */
  keepsakes: readonly string[];
  /** `Profile.keepsakeChoicesTaken` — keepsake-gated choices ever taken. */
  keepsakeChoicesTaken: readonly string[];
  /** Rooms currently visible in the codex/Ledger, i.e. `visibleRoomCount`'s
   * `total` for the active pack. Pass 0 to disable `walked-most-rooms`. */
  roomsTotal: number;
  /** Whether the active pack has an Understory at all
   * (`graph.understorySequence.length > 0`). A pack without one must never
   * be told it has failed to find it. */
  hasUnderstory: boolean;
}

/** Every pattern currently true of this player, in `PLAYER_PATTERN_IDS`
 * order. Pure. Returns `[]` for a player with too little history to have a
 * shape yet — the common case, and the reason the guide stays quiet about it
 * on a first or second visit.
 *
 * One deliberate asymmetry, verified against `flow.ts` rather than assumed:
 * "One Door" vignettes increment `roomVisits`/`codexUnlocked` but *not*
 * `runsCompleted` or `heartsLost` (both of the latter sit behind
 * `!this.oneDoorMode`). So `walked-most-rooms` and `returns-to-one-room`
 * legitimately count rooms met in One Door mode — the guide saying "you have
 * been in nearly every room" stays true however the player got there — while
 * `never-spent-a-heart` compares two counters that both exclude it, so it
 * can't be made accidentally true by playing vignettes instead of runs. Both
 * behaviours are wanted; neither is an accident of which counter was handy. */
export function activePatterns(i: PatternInputs): PlayerPatternId[] {
  const out: PlayerPatternId[] = [];
  if (i.runsCompleted < MIN_RUNS_FOR_PATTERN) return out;

  if (i.runsCompleted >= MIN_RUNS_FOR_SAME_ENDING && i.endingsSeen.length === 1) {
    out.push('same-ending-again');
  }
  if (i.heartsLost === 0) {
    out.push('never-spent-a-heart');
  }
  if (i.keepsakes.length > 0 && i.keepsakeChoicesTaken.length === 0) {
    out.push('holds-unspent-keepsakes');
  }
  if (i.hasUnderstory && i.understoryDescents === 0) {
    out.push('never-descended');
  }
  if (i.roomsTotal > 0) {
    const distinctWalked = Object.keys(i.roomVisits).length;
    if (distinctWalked >= Math.ceil(i.roomsTotal * WALKED_MOST_FRACTION)) {
      out.push('walked-most-rooms');
    }
  }
  if (Object.values(i.roomVisits).some((n) => n >= MIN_VISITS_FOR_RETURN)) {
    out.push('returns-to-one-room');
  }
  return out;
}

/** The single pattern to voice on this visit, or `null` when there is none.
 *
 * Rotates by `runsCompleted` rather than always taking the highest-priority
 * match, so a player who fits several patterns hears a different one
 * recognised each time they return instead of the same line forever. Pure and
 * deterministic — the same profile always produces the same line on the same
 * run, so a reload cannot reshuffle what the guide just said. */
export function patternForRun(
  active: readonly PlayerPatternId[],
  runsCompleted: number,
): PlayerPatternId | null {
  if (active.length === 0) return null;
  // `runsCompleted` is never negative in practice; guard anyway so a corrupt
  // imported profile can't index out of range.
  const n = Math.max(0, Math.floor(runsCompleted));
  return active[n % active.length];
}
