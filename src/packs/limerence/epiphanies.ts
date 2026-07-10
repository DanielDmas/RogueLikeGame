// LIMERENCE's own 12 Ledger epiphanies (design spec
// docs/design-limerence/06-endings-keepsakes-epiphanies.md §3). Quiet
// observations over `Profile.choiceHistory` (every `${roomId}:${choiceId}`
// ever taken, across every finished run — see `saveStore.ts`) plus the
// just-finished run's own transcript for the one predicate that cares about
// order-within-a-run. Never advice, never read by any gameplay predicate —
// same hard guarantee as ANAMNESIS's Ledger.
import type { EpiphanyDef } from '../types';
import type { Profile } from '../../engine/saveStore';
import type { RunState } from '../../engine/schema';
import type { RoomRegistry } from '../../engine/storyEngine';

const has = (profile: Profile, key: string) => profile.choiceHistory.includes(key);
const anyOf = (profile: Profile, keys: string[]) => keys.some((k) => has(profile, k));
const noneOf = (profile: Profile, keys: string[]) => keys.every((k) => !has(profile, k));
const countOf = (profile: Profile, keys: string[]) => keys.filter((k) => has(profile, k)).length;

// Lineage sets, named after the spec's own predicate language — each entry
// is `${roomId}:${choiceId}`, matched against the room/choice ids actually
// authored in `rooms/*.ts`.
const TESTING = ['the-read-receipt:bait', 'the-rumor:set-the-trap', 'the-discovery:gather-first'];
const ASKING = [
  'the-read-receipt:ask-tomorrow',
  'the-rumor:ask-the-accuser',
  'the-rumor:ask-her-plainly',
  'the-drift:raise-it',
  'the-discovery:steady-then-ask',
];
const SUPPRESSION = [
  'the-screenshot:stay-out',
  'the-distance:bury-it',
  'just-friends:nothing-to-tell',
  'the-hall-pass:agree-to-keep-peace',
  'the-drift:accept-quiet-as-love',
  'the-discovery:pretend',
  'the-second-account:defend-the-category',
  'the-confession:carry-it',
];
const CONFESSION = [
  'the-confession:confess',
  'the-ex:tell-jules',
  'the-second-account:show-dana',
  'just-friends:name-it-set-boundary',
  'the-screenshot:tell-nadia',
  'the-screenshot:confront-tom',
  'the-distance:confess-the-near-miss',
  'the-forward:tell-ema-first',
  'the-forward:confront-publicly',
];
const LEAVING = ['the-summer-ends:end-clean', 'the-other-side-of-the-door:end-it', 'the-discovery:walk-tonight', 'the-kitchen-table:separate-well'];
const WINDOW = ['the-distance:confess-the-near-miss', 'just-friends:open-window', 'just-friends:name-it-set-boundary'];
const WALL = ['the-distance:bury-it', 'the-distance:soften-it', 'the-distance:keep-visiting-almost', 'just-friends:nothing-to-tell'];
const PRACTICAL_REPAIR = ['the-kitchen-table:separate-well', 'the-kitchen-table:stay-for-them'];
const VERBAL_REPAIR = ['the-kitchen-table:attempt-repair', 'the-kitchen-table:say-the-unsayable'];

const PREDICATES: Record<string, (profile: Profile, run: RunState, registry: RoomRegistry) => boolean> = {
  'never-asked-first': (profile) => anyOf(profile, TESTING) && noneOf(profile, ASKING),
  'three-times-fine': (profile) => countOf(profile, SUPPRESSION) >= 3,
  'truth-one-room-late': (_profile, run) => {
    const firstBury = run.transcript.findIndex((e) => SUPPRESSION.includes(`${e.roomId}:${e.choiceId}`));
    if (firstBury < 0) return false;
    return run.transcript.slice(firstBury + 1).some((e) => CONFESSION.includes(`${e.roomId}:${e.choiceId}`));
  },
  'never-the-one-to-leave': (profile) => profile.runsCompleted >= 2 && noneOf(profile, LEAVING),
  'every-trap-caught-you': (profile) => countOf(profile, TESTING) >= 2,
  'mid-goodbye': (profile) => (profile.roomVisits['the-rebound'] ?? 0) >= 1 && anyOf(profile, ['the-ex:reread-everything', 'the-ex:answer-her']),
  'window-and-wall': (profile) => anyOf(profile, WINDOW) && anyOf(profile, WALL),
  'doors-you-avoid': (profile, _run, registry) => {
    if (profile.runsCompleted < 3) return false;
    const poolRooms = registry.all().filter((r) => !r.gate && (r.act === 1 || r.act === 2 || r.act === 3));
    return poolRooms.some((r) => (profile.roomVisits[r.id] ?? 0) === 0);
  },
  'apologizes-with-logistics': (profile) => anyOf(profile, PRACTICAL_REPAIR) && noneOf(profile, VERBAL_REPAIR),
  'sentence-never-said': (profile) => profile.runsCompleted >= 2 && !has(profile, 'the-kitchen-table:say-the-unsayable'),
  'walked-away-once': (profile) => has(profile, 'the-colleague:walk-away'),
  'legible-not-finished': (profile) => has(profile, 'the-usual-room:take-it-knowingly'),
};

const EN_FALLBACK: Record<string, string> = {
  'never-asked-first': 'You have never once asked before accusing.',
  'three-times-fine': "Three rooms heard you say 'fine.' It was never fine.",
  'truth-one-room-late': 'You always tell the truth exactly one room too late.',
  'never-the-one-to-leave': 'You have never been the one to leave.',
  'every-trap-caught-you': 'Every trap you set caught you.',
  'mid-goodbye': 'You keep choosing people mid-goodbye.',
  'window-and-wall': 'The window and the wall: you have built both. Count which more often.',
  'doors-you-avoid': 'You read every door hint twice. You already know which doors you avoid.',
  'apologizes-with-logistics': 'You apologize with logistics.',
  'sentence-never-said': 'Nobody in this hotel has ever heard you say the sentence you made the room say for you.',
  'walked-away-once': "You walked away once. It's in the file. Read it when the corridor is long.",
  'legible-not-finished': 'Your handwriting is legible. That is not the same as finished.',
};

export const limerenceEpiphanies: EpiphanyDef[] = Object.keys(PREDICATES).map((id) => ({
  id,
  fallback: EN_FALLBACK[id],
  predicate: PREDICATES[id],
}));
