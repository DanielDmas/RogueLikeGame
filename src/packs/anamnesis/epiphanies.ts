// ANAMNESIS's own 12 Ledger epiphanies (spec 06 Phase P). Moved here
// verbatim from `engine/ledger.ts` during the epiphany pack-parameterization
// (ledger.ts is now content-agnostic — every pack supplies its own
// `EpiphanyDef[]`, each carrying its own predicate). Behavior is unchanged:
// same ids, same fallback text, same trigger conditions.
import type { EpiphanyDef } from '../types';
import type { Profile } from '../../engine/saveStore';
import type { RunState } from '../../engine/schema';
import type { RoomRegistry } from '../../engine/storyEngine';
import { codexCompletePredicate, allDoorsOneActPredicate } from '../../engine/ledger';

const EPIPHANY_IDS = [
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

type EpiphanyId = (typeof EPIPHANY_IDS)[number];

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

/** One predicate per epiphany that needs only the profile and the
 * just-finished `RunState` — evaluated against the *updated* profile (all
 * of this run's counters already applied; `playEnding` calls this last).
 * `refused-machine-twice`'s predicate is deliberately derived from existing
 * data (visited the Experience Machine at least twice, never once holding
 * the keepsake that only the "refuse" choice's follow-through can grant)
 * rather than new dedicated tracking — spec 06 §6 calls this out explicitly. */
const PREDICATES: Record<EpiphanyId, (profile: Profile, run: RunState, registry: RoomRegistry, understorySequence: readonly string[]) => boolean> = {
  'first-return': (profile) => profile.runsCompleted >= 2,
  'kept-every-heart': (_profile, run) => run.finished && run.hearts === 3,
  'spent-every-heart': (profile) => profile.endingsSeen.includes('dissolved'),
  'refused-machine-twice': (profile) =>
    (profile.roomVisits['experience-machine'] ?? 0) >= 2 && !profile.keepsakes.includes('release-form'),
  'all-doors-one-act': (profile, _run, registry) => allDoorsOneActPredicate(profile, registry),
  'codex-complete': (profile, _run, registry, understorySequence) => codexCompletePredicate(profile, registry, understorySequence),
  'three-endings': (profile) => profile.endingsSeen.length >= 3,
  descended: (profile) => profile.understoryDescents >= 1,
  'examined-run': (profile) => profile.examinedRuns >= 1,
  'first-keepsake': (profile) => profile.keepsakes.length >= 1,
  'high-lucidity': (_profile, run) => run.finished && run.lucidity >= 180,
  'last-word-kept': (profile) => Boolean(profile.lastMessage) && profile.runsCompleted >= 2,
};

export const anamnesisEpiphanies: EpiphanyDef[] = EPIPHANY_IDS.map((id) => ({
  id,
  fallback: EPIPHANY_EN_FALLBACK[id],
  predicate: PREDICATES[id],
}));
