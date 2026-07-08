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

/** The Act V understory rooms are filtered from the codex (and, by the same
 * rule, the Ledger's room count) until first walked — they shouldn't hint at
 * their own existence ahead of time. Moved here (from `ui/overlays.ts`) so
 * both the codex and `visibleRoomCount` share exactly one rule. */
export function isHiddenFromCodex(roomId: string, profile: Profile): boolean {
  return UNDERSTORY_SEQUENCE.includes(roomId) && !profile.codexUnlocked.includes(roomId);
}

/** Rooms the codex (and therefore the Ledger) actually renders a card for
 * right now: every base room, plus only the understory rooms already
 * walked — never leaking which ones exist before they're found. */
export function visibleRoomCount(profile: Profile, registry: RoomRegistry): { seen: number; total: number } {
  const visible = registry.all().filter((r) => !isHiddenFromCodex(r.id, profile));
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
 * the understory"); the last-message row is omitted until one exists. */
export function ledgerStats(profile: Profile, registry: RoomRegistry): LedgerRow[] {
  const rows: LedgerRow[] = [];
  rows.push({ id: 'runs', label: t(uiKey('ledgerRuns'), 'Runs completed'), value: String(profile.runsCompleted) });

  const { seen, total } = visibleRoomCount(profile, registry);
  rows.push({ id: 'rooms', label: t(uiKey('ledgerRooms'), 'Rooms witnessed'), value: `${seen} of ${total}` });

  rows.push({
    id: 'endings',
    label: t(uiKey('ledgerEndings'), 'Endings witnessed'),
    value: `${profile.endingsSeen.length} of ${endingsTotal(profile.endingsSeen)}`,
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
    value: `${profile.keepsakes.length} of 4`,
  });

  if (profile.understoryDescents >= 1) {
    rows.push({ id: 'descents', label: t(uiKey('ledgerDescents'), 'Descents below'), value: String(profile.understoryDescents) });
  }

  if (profile.examinedRuns >= 1) {
    rows.push({ id: 'examined', label: t(uiKey('ledgerExamined'), 'Examined runs'), value: String(profile.examinedRuns) });
  }

  if (profile.lastMessage) {
    rows.push({ id: 'last-message', label: t(uiKey('ledgerLastMessage'), 'Your last message'), value: `“${profile.lastMessage}”` });
  }

  return rows;
}

export const EPIPHANY_IDS = [
  'first-return',
  'kept-every-heart',
  'spent-every-heart',
  'refused-machine-twice',
  'all-doors-one-act',
  'codex-complete',
  'three-endings',
  'descended',
  'examined-run',
  'first-keepsake',
  'high-lucidity',
  'last-word-kept',
] as const;

export type EpiphanyId = (typeof EPIPHANY_IDS)[number];

const EPIPHANY_EN_FALLBACK: Record<EpiphanyId, string> = {
  'first-return': 'You came back.',
  'kept-every-heart': 'You kept every heart, once.',
  'spent-every-heart': 'You learned what the bottom of the ledger looks like.',
  'refused-machine-twice': 'You refused the machine twice.',
  'all-doors-one-act': "One act holds no more doors you haven't opened.",
  'codex-complete': 'Every room, witnessed.',
  'three-endings': 'Three ways out, all of them yours.',
  descended: 'You took the stairs.',
  'examined-run': 'You let the Annex file its commentary, start to end.',
  'first-keepsake': 'Something small came with you.',
  'high-lucidity': 'You finished seeing almost everything.',
  'last-word-kept': 'You had one sentence, and you still have it.',
};

/** One epiphany's translated, display-ready line. Shared by the Ledger and
 * the end screen's "filed tonight" block, so both ever resolve exactly one
 * fallback text per id. */
export function epiphanyLine(id: string): string {
  return t(epiphanyKey(id), EPIPHANY_EN_FALLBACK[id as EpiphanyId] ?? id);
}

/** One line per earned epiphany, in earn order, already translated. */
export function epiphanyLines(profile: Profile): string[] {
  return profile.epiphanies.map(epiphanyLine);
}

/** One predicate per epiphany that needs only the profile and the
 * just-finished `RunState` — evaluated against the *updated* profile (all
 * of this run's counters already applied; `playEnding` calls this last).
 * `refused-machine-twice`'s predicate is deliberately derived from existing
 * data (visited the Experience Machine at least twice, never once holding
 * the keepsake that only the "refuse" choice's follow-through can grant)
 * rather than new dedicated tracking — spec 06 §6 calls this out explicitly.
 * `codex-complete` and `all-doors-one-act` need the room registry too, so
 * they're computed separately in `evaluateEpiphanies` instead of living here. */
const EPIPHANY_PREDICATES: Partial<Record<EpiphanyId, (profile: Profile, run: RunState) => boolean>> = {
  'first-return': (profile) => profile.runsCompleted >= 2,
  'kept-every-heart': (_profile, run) => run.finished && run.hearts === 3,
  'spent-every-heart': (profile) => profile.endingsSeen.includes('dissolved'),
  'refused-machine-twice': (profile) =>
    (profile.roomVisits['experience-machine'] ?? 0) >= 2 && !profile.keepsakes.includes('release-form'),
  'three-endings': (profile) => profile.endingsSeen.length >= 3,
  descended: (profile) => profile.understoryDescents >= 1,
  'examined-run': (profile) => profile.examinedRuns >= 1,
  'first-keepsake': (profile) => profile.keepsakes.length >= 1,
  'high-lucidity': (_profile, run) => run.finished && run.lucidity >= 180,
  'last-word-kept': (profile) => Boolean(profile.lastMessage) && profile.runsCompleted >= 2,
};

/** Returns *newly* earned epiphany ids (already-held ones excluded), in
 * `EPIPHANY_IDS` order. Idempotent: calling this again with an unchanged
 * profile/run returns an empty array, since every predicate is checked
 * against the profile that already has this run's counters applied. */
export function evaluateEpiphanies(profile: Profile, finishedRun: RunState, registry: RoomRegistry): string[] {
  const held = new Set(profile.epiphanies);
  const newly: string[] = [];
  const baseRoomIds = registry.all().map((r) => r.id).filter((id) => !UNDERSTORY_SEQUENCE.includes(id));

  const actRoomIds: Record<1 | 2 | 3, string[]> = { 1: [], 2: [], 3: [] };
  for (const room of registry.all()) {
    if (room.act === 1 || room.act === 2 || room.act === 3) actRoomIds[room.act].push(room.id);
  }

  for (const id of EPIPHANY_IDS) {
    if (held.has(id)) continue;
    const earned =
      id === 'codex-complete'
        ? baseRoomIds.every((rid) => profile.codexUnlocked.includes(rid))
        : id === 'all-doors-one-act'
          ? Object.values(actRoomIds).some((ids) => ids.every((rid) => profile.codexUnlocked.includes(rid)))
          : (EPIPHANY_PREDICATES[id]?.(profile, finishedRun) ?? false);
    if (earned) newly.push(id);
  }
  return newly;
}
