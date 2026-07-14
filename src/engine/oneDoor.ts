// T9 — the "One Door" title-menu mode: a single random room dealt as a
// standalone ~3-minute vignette, no run state carried forward and no
// ending. A daily-ritual-shaped on-ramp for a player intimidated by a full
// run, and a way to advertise rooms they haven't met yet.
//
// The pool deliberately excludes anything whose payoff depends on
// full-run context: gate rooms (climaxes meant to land after a real
// playthrough), secret rooms (their whole point is being *found*, not
// dealt), the Understory (needs a second-run flag to make sense), the
// prologue (already always seen first in a real run), and the two
// per-pack hook rooms (`finalGateId`/`lastMessageId`), which carry
// permanent profile side effects tied to finishing a whole game.
import type { ContentPack } from '../packs/types';
import type { Room } from './schema';

/** Pure — the set of rooms eligible for the One Door mode. */
export function oneDoorPool(pack: ContentPack): Room[] {
  const excluded = new Set([pack.graph.prologue, pack.hooks.finalGateId, pack.hooks.lastMessageId]);
  const understory = new Set(pack.graph.understorySequence);
  return pack.rooms.filter((r) => !r.gate && !r.secret && !excluded.has(r.id) && !understory.has(r.id));
}

/**
 * Pure — picks one room from `pool`, biased toward rooms the profile
 * hasn't unlocked yet (the "advertises unmet rooms" half of the design);
 * falls back to the full pool once every eligible room has been seen.
 * `rand` is injectable for deterministic tests; defaults to `Math.random`.
 */
export function pickOneDoorRoom(pool: Room[], codexUnlocked: string[], rand: () => number = Math.random): Room {
  if (pool.length === 0) throw new Error('oneDoorPool must not be empty');
  const unseen = pool.filter((r) => !codexUnlocked.includes(r.id));
  const candidates = unseen.length > 0 ? unseen : pool;
  return candidates[Math.floor(rand() * candidates.length)];
}
