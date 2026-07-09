import { describe, expect, it } from 'vitest';
import { makeRegistry } from '../engine/storyEngine';
import { newRun } from '../engine/gameState';
import { defaultProfile, type Profile } from '../engine/saveStore';
import { evaluateEpiphanies, epiphanyLine } from '../engine/ledger';
import { limerencePack } from '../packs/limerence';
import type { RunState, TranscriptEntry } from '../engine/schema';

/**
 * LIMERENCE's own 12 Ledger epiphanies (design spec
 * docs/design-limerence/06-endings-keepsakes-epiphanies.md §3), evaluated
 * over `Profile.choiceHistory` — mirrors ledger.test.ts's ANAMNESIS coverage:
 * every epiphany gets a positive (fires) and, where meaningful, a negative
 * (does not fire) case.
 */

const registry = makeRegistry(limerencePack.rooms);
const epiphanies = limerencePack.epiphanies;

function profileWith(overrides: Partial<Profile>): Profile {
  return { ...defaultProfile(), ...overrides };
}

function entry(roomId: string, choiceId: string): TranscriptEntry {
  return { roomId, stageIndex: 0, choiceId, choiceText: choiceId };
}

function evalFor(profile: Profile, run: RunState = newRun()): string[] {
  return evaluateEpiphanies(profile, run, registry, epiphanies);
}

describe('LIMERENCE epiphanies — pack identity', () => {
  it('has exactly 12 epiphanies, unique ids, and none of ANAMNESIS’s own ids', () => {
    expect(epiphanies).toHaveLength(12);
    expect(new Set(epiphanies.map((e) => e.id)).size).toBe(12);
    expect(epiphanies.map((e) => e.id)).not.toContain('first-return');
  });

  it('every epiphany id has a fallback line distinct from its raw slug', () => {
    for (const e of epiphanies) {
      expect(epiphanyLine(e.id, epiphanies)).not.toBe(e.id);
    }
  });
});

describe('evaluateEpiphanies — LIMERENCE', () => {
  it('an empty profile earns nothing', () => {
    expect(evalFor(defaultProfile())).toEqual([]);
  });

  it('never-asked-first: fires on a trap/bait choice with no asking choice ever made', () => {
    const trapped = profileWith({ choiceHistory: ['the-read-receipt:bait'] });
    expect(evalFor(trapped)).toContain('never-asked-first');
    const asked = profileWith({ choiceHistory: ['the-read-receipt:bait', 'the-rumor:ask-the-accuser'] });
    expect(evalFor(asked)).not.toContain('never-asked-first');
  });

  it('three-times-fine: fires once 3 distinct suppression-lineage choices are on record', () => {
    const two = profileWith({ choiceHistory: ['the-screenshot:stay-out', 'the-distance:bury-it'] });
    expect(evalFor(two)).not.toContain('three-times-fine');
    const three = profileWith({ choiceHistory: [...two.choiceHistory, 'just-friends:nothing-to-tell'] });
    expect(evalFor(three)).toContain('three-times-fine');
  });

  it('truth-one-room-late: fires when this run’s transcript buries before it confesses', () => {
    const lateRun: RunState = { ...newRun(), transcript: [entry('the-distance', 'bury-it'), entry('the-confession', 'confess')] };
    expect(evalFor(defaultProfile(), lateRun)).toContain('truth-one-room-late');
    const reversedRun: RunState = { ...newRun(), transcript: [entry('the-confession', 'confess'), entry('the-distance', 'bury-it')] };
    expect(evalFor(defaultProfile(), reversedRun)).not.toContain('truth-one-room-late');
  });

  it('never-the-one-to-leave: fires after 2 runs with no leaving-lineage choice ever taken', () => {
    expect(evalFor(profileWith({ runsCompleted: 1 }))).not.toContain('never-the-one-to-leave');
    expect(evalFor(profileWith({ runsCompleted: 2 }))).toContain('never-the-one-to-leave');
    const left = profileWith({ runsCompleted: 2, choiceHistory: ['the-summer-ends:end-clean'] });
    expect(evalFor(left)).not.toContain('never-the-one-to-leave');
  });

  it('every-trap-caught-you: fires once 2 distinct testing-lineage choices are on record', () => {
    const one = profileWith({ choiceHistory: ['the-read-receipt:bait'] });
    expect(evalFor(one)).not.toContain('every-trap-caught-you');
    const two = profileWith({ choiceHistory: ['the-read-receipt:bait', 'the-rumor:set-the-trap'] });
    expect(evalFor(two)).toContain('every-trap-caught-you');
  });

  it('mid-goodbye: fires once the-rebound is visited and an idealization-relapse choice is on record', () => {
    const visitedOnly = profileWith({ roomVisits: { 'the-rebound': 1 } });
    expect(evalFor(visitedOnly)).not.toContain('mid-goodbye');
    const both = profileWith({ roomVisits: { 'the-rebound': 1 }, choiceHistory: ['the-ex:reread-everything'] });
    expect(evalFor(both)).toContain('mid-goodbye');
  });

  it('window-and-wall: fires once at least one window-lineage AND one wall-lineage choice are on record', () => {
    const windowOnly = profileWith({ choiceHistory: ['just-friends:open-window'] });
    expect(evalFor(windowOnly)).not.toContain('window-and-wall');
    const both = profileWith({ choiceHistory: ['just-friends:open-window', 'the-distance:bury-it'] });
    expect(evalFor(both)).toContain('window-and-wall');
  });

  it('doors-you-avoid: fires after 3 runs when some act-pool room has 0 lifetime visits', () => {
    const tooFewRuns = profileWith({ runsCompleted: 2 });
    expect(evalFor(tooFewRuns)).not.toContain('doors-you-avoid');
    expect(evalFor(profileWith({ runsCompleted: 3 }))).toContain('doors-you-avoid');
    const allVisited = profileWith({
      runsCompleted: 3,
      roomVisits: Object.fromEntries(registry.all().filter((r) => !r.gate && [1, 2, 3].includes(r.act)).map((r) => [r.id, 1])),
    });
    expect(evalFor(allVisited)).not.toContain('doors-you-avoid');
  });

  it('apologizes-with-logistics: fires on a practical kitchen-table choice with no verbal one ever taken', () => {
    const practical = profileWith({ choiceHistory: ['the-kitchen-table:separate-well'] });
    expect(evalFor(practical)).toContain('apologizes-with-logistics');
    const both = profileWith({ choiceHistory: ['the-kitchen-table:separate-well', 'the-kitchen-table:say-the-unsayable'] });
    expect(evalFor(both)).not.toContain('apologizes-with-logistics');
  });

  it('sentence-never-said: fires after 2 runs that never chose say-the-unsayable', () => {
    expect(evalFor(profileWith({ runsCompleted: 1 }))).not.toContain('sentence-never-said');
    expect(evalFor(profileWith({ runsCompleted: 2 }))).toContain('sentence-never-said');
    const said = profileWith({ runsCompleted: 2, choiceHistory: ['the-kitchen-table:say-the-unsayable'] });
    expect(evalFor(said)).not.toContain('sentence-never-said');
  });

  it('walked-away-once: fires once the-colleague’s walk-away choice is on record', () => {
    expect(evalFor(defaultProfile())).not.toContain('walked-away-once');
    expect(evalFor(profileWith({ choiceHistory: ['the-colleague:walk-away'] }))).toContain('walked-away-once');
  });

  it('legible-not-finished: fires once the-usual-room’s take-it-knowingly choice is on record', () => {
    expect(evalFor(defaultProfile())).not.toContain('legible-not-finished');
    expect(evalFor(profileWith({ choiceHistory: ['the-usual-room:take-it-knowingly'] }))).toContain('legible-not-finished');
  });

  it('excludes already-held epiphanies from "newly earned"', () => {
    const profile = profileWith({ choiceHistory: ['the-colleague:walk-away'], epiphanies: ['walked-away-once'] });
    expect(evalFor(profile)).not.toContain('walked-away-once');
  });

  it('is idempotent: re-evaluating an unchanged profile/run returns nothing new', () => {
    const profile = profileWith({ choiceHistory: ['the-colleague:walk-away'] });
    const run = newRun();
    const first = evalFor(profile, run);
    const applied = profileWith({ ...profile, epiphanies: first });
    expect(evalFor(applied, run)).toEqual([]);
  });
});
