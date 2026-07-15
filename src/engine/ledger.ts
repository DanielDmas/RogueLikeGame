// The Traveler's Ledger & Epiphanies (spec 06, Phase P). Pure, DOM-free
// computations over `Profile` (+ one finished `RunState` for the epiphany
// evaluator) — the Ledger overlay (`ui/overlays.ts`) only renders what these
// return. Read-only throughout: nothing here is ever consulted by a room's
// `available`/`secret` predicate, `offeredDoors`, or `evaluateEnding` — it
// exists to be looked at, never to be played around.
import type { RunState } from './schema';
import { UNDERSTORY_SEQUENCE } from '../content/graph';
import type { Profile } from './saveStore';
import { endingsTotal } from './endings';
import type { RoomRegistry } from './storyEngine';
import { t } from './text/resolver';
import { epiphanyKey, roomTitleKey, uiKey } from './text/keys';
import type { EpiphanyDef } from '../packs/types';

/** The understory rooms are filtered from the codex (and, by the same rule,
 * the Ledger's room count) until first walked — they shouldn't hint at their
 * own existence ahead of time. Moved here (from `ui/overlays.ts`) so both the
 * codex and `visibleRoomCount` share exactly one rule. `understorySequence`
 * defaults to ANAMNESIS's own (spec 08 §3 engine-default/pack-override
 * pattern) — pass a pack's `graph.understorySequence` so a second pack's
 * Records Office (e.g. LIMERENCE's) is hidden by its *own* room ids, not
 * ANAMNESIS's (otherwise a second pack's understory rooms leak into its
 * codex as locked cards from the start). */
export function isHiddenFromCodex(
  roomId: string,
  profile: Profile,
  understorySequence: readonly string[] = UNDERSTORY_SEQUENCE,
): boolean {
  return understorySequence.includes(roomId) && !profile.codexUnlocked.includes(roomId);
}

/** Rooms the codex (and therefore the Ledger) actually renders a card for
 * right now: every base room, plus only the understory rooms already
 * walked — never leaking which ones exist before they're found. */
export function visibleRoomCount(
  profile: Profile,
  registry: RoomRegistry,
  understorySequence: readonly string[] = UNDERSTORY_SEQUENCE,
): { seen: number; total: number } {
  const visible = registry.all().filter((r) => !isHiddenFromCodex(r.id, profile, understorySequence));
  const seen = visible.filter((r) => profile.codexUnlocked.includes(r.id)).length;
  return { seen, total: visible.length };
}

/** The most-visited room id, or `null` if nothing has been visited yet.
 * Ties resolve to whichever id appears first in `Object.entries` order
 * (insertion order — the room visited most recently among ties). */
export function mostWalkedRoomId(roomVisits: Record<string, number>): string | null {
  let best: string | null = null;
  let bestCount = 0;
  for (const [id, count] of Object.entries(roomVisits)) {
    if (count > bestCount) {
      best = id;
      bestCount = count;
    }
  }
  return best;
}

export interface LedgerRow {
  id: string;
  label: string;
  value: string;
}

/** The Ledger's stat rows, in display order. Rows for descents/examined runs
 * are omitted entirely below their threshold (spec 06 §5: "don't advertise
 * the understory"); the last-message row is omitted until one exists.
 * `endingsTotalFn`/`keepsakeTotal` default to ANAMNESIS's own (spec 08 §3
 * engine-default/pack-override pattern) — pass a pack's own
 * `endingRules.endingsTotal`/`keepsakes.length` so a second pack's endings
 * denominator (and keepsake shelf size) is computed from *its own* rules,
 * not ANAMNESIS's (otherwise a second pack's Ledger can show a wrong or
 * even impossible count, e.g. "7 of 6"). */
export function ledgerStats(
  profile: Profile,
  registry: RoomRegistry,
  understorySequence: readonly string[] = UNDERSTORY_SEQUENCE,
  endingsTotalFn: (endingsSeen: string[]) => number = endingsTotal,
  keepsakeTotal: number = 4,
  /** P5: the active pack's own, already-translated label for the last-message
   * row (`t(scoped(uiKey('ledgerLastMessage'), pack.meta.id), pack.hooks.lastMessageLabel)`).
   * Defaults to ANAMNESIS's own translated fallback so every pre-existing
   * call site (and test) is unaffected. */
  lastMessageLabel: string = t(uiKey('ledgerLastMessage'), 'Your last message'),
): LedgerRow[] {
  const rows: LedgerRow[] = [];
  rows.push({ id: 'runs', label: t(uiKey('ledgerRuns'), 'Runs completed'), value: String(profile.runsCompleted) });

  // Found in code review (2026-07-15): these three "N of M" values were
  // hardcoded English despite every other overlay building the identical
  // shape through t(uiKey('of'), 'of') (see overlays.ts's showTitle/
  // showHotelRegister) — a Czech player saw "3 of 24" instead of "3 z 24".
  const ofLabel = t(uiKey('of'), 'of');
  const { seen, total } = visibleRoomCount(profile, registry, understorySequence);
  rows.push({ id: 'rooms', label: t(uiKey('ledgerRooms'), 'Rooms witnessed'), value: `${seen} ${ofLabel} ${total}` });

  rows.push({
    id: 'endings',
    label: t(uiKey('ledgerEndings'), 'Endings witnessed'),
    value: `${profile.endingsSeen.length} ${ofLabel} ${endingsTotalFn(profile.endingsSeen)}`,
  });

  rows.push({ id: 'hearts', label: t(uiKey('ledgerHearts'), 'Hearts lost, lifetime'), value: String(profile.heartsLost) });

  const mostWalked = mostWalkedRoomId(profile.roomVisits);
  let mostWalkedTitle = '—';
  if (mostWalked) {
    try {
      mostWalkedTitle = t(roomTitleKey(mostWalked), registry.get(mostWalked).title);
    } catch {
      mostWalkedTitle = mostWalked;
    }
  }
  rows.push({ id: 'most-walked', label: t(uiKey('ledgerMostWalked'), 'The door most walked'), value: mostWalkedTitle });

  rows.push({
    id: 'keepsakes',
    label: t(uiKey('ledgerKeepsakes'), 'Keepsakes on the shelf'),
    value: `${profile.keepsakes.length} ${ofLabel} ${keepsakeTotal}`,
  });

  if (profile.understoryDescents >= 1) {
    rows.push({ id: 'descents', label: t(uiKey('ledgerDescents'), 'Descents below'), value: String(profile.understoryDescents) });
  }

  if (profile.examinedRuns >= 1) {
    rows.push({ id: 'examined', label: t(uiKey('ledgerExamined'), 'Examined runs'), value: String(profile.examinedRuns) });
  }

  if (profile.lastMessage) {
    rows.push({ id: 'last-message', label: lastMessageLabel, value: `“${profile.lastMessage}”` });
  }

  return rows;
}

/** One epiphany's translated, display-ready line. Shared by the Ledger and
 * the end screen's "filed tonight" block, so both ever resolve exactly one
 * fallback text per id. `epiphanies` is the active pack's own list
 * (`pack.epiphanies`) — the fallback text lives with the pack that defines
 * the epiphany, not here. */
export function epiphanyLine(id: string, epiphanies: EpiphanyDef[]): string {
  const fallback = epiphanies.find((e) => e.id === id)?.fallback ?? id;
  return t(epiphanyKey(id), fallback);
}

/** One line per earned epiphany, in earn order, already translated. */
export function epiphanyLines(profile: Profile, epiphanies: EpiphanyDef[]): string[] {
  return profile.epiphanies.map((id) => epiphanyLine(id, epiphanies));
}

/** Generic helper for a pack's own `codex-complete`-style epiphany: every
 * base (non-understory) room in the registry has been unlocked in the
 * codex. Exported so each pack's own epiphany predicate can reuse it rather
 * than re-deriving the base-room-id filter. */
export function codexCompletePredicate(profile: Profile, registry: RoomRegistry, understorySequence: readonly string[]): boolean {
  const baseRoomIds = registry.all().map((r) => r.id).filter((id) => !understorySequence.includes(id));
  return baseRoomIds.every((rid) => profile.codexUnlocked.includes(rid));
}

/** Generic helper for a pack's own `all-doors-one-act`-style epiphany: any
 * single act (I, II, or III — the pooled acts) has every one of its own
 * (non-gate) rooms unlocked in the codex. */
export function allDoorsOneActPredicate(profile: Profile, registry: RoomRegistry): boolean {
  const actRoomIds: Record<1 | 2 | 3, string[]> = { 1: [], 2: [], 3: [] };
  for (const room of registry.all()) {
    if (!room.gate && (room.act === 1 || room.act === 2 || room.act === 3)) actRoomIds[room.act].push(room.id);
  }
  return Object.values(actRoomIds).some((ids) => ids.length > 0 && ids.every((rid) => profile.codexUnlocked.includes(rid)));
}

/** Returns *newly* earned epiphany ids (already-held ones excluded), in
 * `epiphanies` order — `epiphanies` is the active pack's own list
 * (`pack.epiphanies`), each carrying its own predicate (spec 08 pattern:
 * content owns content, the engine only drives the evaluation loop).
 * Idempotent: calling this again with an unchanged profile/run returns an
 * empty array, since every predicate is checked against the profile that
 * already has this run's counters applied. */
export function evaluateEpiphanies(
  profile: Profile,
  finishedRun: RunState,
  registry: RoomRegistry,
  epiphanies: EpiphanyDef[],
  understorySequence: readonly string[] = UNDERSTORY_SEQUENCE,
): string[] {
  const held = new Set(profile.epiphanies);
  const newly: string[] = [];
  for (const def of epiphanies) {
    if (held.has(def.id)) continue;
    if (def.predicate(profile, finishedRun, registry, understorySequence)) newly.push(def.id);
  }
  return newly;
}

/** T8 — Guest stamps: diegetic, spoiler-free milestones rendered as rubber
 * stamps in the Ledger. Deliberately generic and pack-agnostic (pure reads
 * of counters every profile already tracks, no pack-specific content or
 * choice ids) — unlike epiphanies, one shared list serves both packs. Never
 * consulted by any gameplay predicate; display-only, same hard guarantee
 * as every other Ledger-only field. */
export interface GuestStamp {
  id: string;
  fallback: string;
  predicate: (profile: Profile, registry: RoomRegistry, understorySequence: readonly string[]) => boolean;
}

export const GUEST_STAMPS: GuestStamp[] = [
  { id: 'full-house', fallback: 'Full house — every room on file', predicate: codexCompletePredicate },
  {
    id: 'clean-bill',
    fallback: 'Checked out with every heart, every time',
    predicate: (profile) => profile.runsCompleted >= 1 && profile.heartsLost === 0,
  },
  { id: 'frequent-guest', fallback: 'A frequent guest', predicate: (profile) => profile.runsCompleted >= 5 },
  { id: 'below-the-surface', fallback: 'Found the way below', predicate: (profile) => profile.understoryDescents >= 1 },
  { id: 'on-the-record', fallback: 'Took the Examined Path', predicate: (profile) => profile.examinedRuns >= 1 },
  { id: 'student-of-the-place', fallback: 'A student of the place', predicate: (profile) => profile.epiphanies.length >= 3 },
];

/** Every stamp currently earned, in `GUEST_STAMPS` order. `understorySequence`
 * defaults to ANAMNESIS's own (spec 08 §3 pattern) — pass a pack's own for
 * `full-house` to read that pack's own room set correctly. */
export function earnedGuestStamps(
  profile: Profile,
  registry: RoomRegistry,
  understorySequence: readonly string[] = UNDERSTORY_SEQUENCE,
): GuestStamp[] {
  return GUEST_STAMPS.filter((s) => s.predicate(profile, registry, understorySequence));
}
