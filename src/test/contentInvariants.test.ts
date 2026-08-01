import { describe, expect, it } from 'vitest';
import type { ContentPack } from '../packs/types';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';
import { newRun, applyEffects } from '../engine/gameState';
import { makeRegistry, offeredDoors, completeRoom } from '../engine/storyEngine';
import { evaluateEpiphanies, ledgerStats, earnedGuestStamps, visibleRoomCount } from '../engine/ledger';
import { activePatterns, patternForRun } from '../engine/patterns';
import { oneDoorPool, pickOneDoorRoom } from '../engine/oneDoor';
import { defaultProfile } from '../engine/saveStore';
import type { RunState, TranscriptEntry } from '../engine/schema';

/**
 * Extended code review (2026-08-01), Batch 4 — promoting the round-2
 * content-invariant sweep and the round-3 Monte Carlo/reachability checks
 * from one-off scratch scripts into the permanent suite, so these
 * invariants can never regress silently. Three families:
 *
 * 1. Soft-lock + beat-totality (round 2): a stage with every choice gated
 *    by `available` can mount zero cards and hang forever; a throwing
 *    beat/outcome/available/secret function crashes the room it's in.
 * 2. Monte Carlo playthrough (round 3): drives the REAL engine functions
 *    (offeredDoors/completeRoom/applyEffects/evaluate) through complete
 *    random runs, checking termination, no-reoffers, act monotonicity,
 *    evaluator totality, and that every downstream Ledger/epiphany/
 *    pattern/oneDoor helper survives a legitimately-played profile.
 *    Scaled down from round 3's 1500-per-variant exploratory sweep to a
 *    fast, deterministic CI size — still exercises the same code paths.
 * 3. Ending-reachability bound (round 3): a per-axis upper bound on what
 *    even ideal play can achieve, pinned so a future content edit can't
 *    silently strand an axis-extreme ending out of reach.
 */

const PACKS: { name: string; pack: ContentPack }[] = [
  { name: 'anamnesis', pack: anamnesisPack },
  { name: 'limerence', pack: limerencePack },
];

// ---------------------------------------------------------------------
// Family 1 — soft-lock + beat/outcome/available/secret totality
// ---------------------------------------------------------------------

describe.each(PACKS)('$name — no stage can soft-lock the choice screen', ({ pack }) => {
  it('every stage in every room has at least one unconditional (no `available` gate) choice', () => {
    const offenders: string[] = [];
    for (const room of pack.rooms) {
      room.stages.forEach((stage, si) => {
        const unconditional = stage.choices.filter((c) => !c.available);
        if (unconditional.length === 0) offenders.push(`${room.id} stage${si}`);
      });
    }
    expect(offenders, `stages with every choice gated: ${offenders.join(', ')}`).toEqual([]);
  });
});

describe.each(PACKS)('$name — every function beat/outcome/available/secret is total (never throws)', ({ pack }) => {
  const probeStates: RunState[] = [
    newRun(1),
    { ...newRun(1), prior: { runs: 1, endingId: null, transcript: [] } },
    {
      ...newRun(1),
      prior: {
        runs: 3,
        endingId: 'x',
        transcript: [{ roomId: 'a', stageIndex: 0, choiceId: 'b', choiceText: 'c' } as TranscriptEntry],
      },
    },
  ];

  it('no beat/outcome/available/secret function throws against a bare, empty-prior, or short-prior state', () => {
    const errors: string[] = [];
    for (const room of pack.rooms) {
      for (const s of probeStates) {
        try {
          room.secret?.(s);
        } catch (e) {
          errors.push(`${room.id} secret(): ${(e as Error).message}`);
        }
        room.stages.forEach((stage, si) => {
          stage.beats.forEach((b, bi) => {
            if (typeof b === 'function') {
              try {
                b(s);
              } catch (e) {
                errors.push(`${room.id} stage${si} beat${bi}: ${(e as Error).message}`);
              }
            }
          });
          for (const c of stage.choices) {
            try {
              c.available?.(s);
            } catch (e) {
              errors.push(`${room.id} stage${si} ${c.id} available(): ${(e as Error).message}`);
            }
            c.outcome.forEach((b, bi) => {
              if (typeof b === 'function') {
                try {
                  b(s);
                } catch (e) {
                  errors.push(`${room.id} stage${si} ${c.id} outcome${bi}: ${(e as Error).message}`);
                }
              }
            });
          }
        });
      }
    }
    expect(errors).toEqual([]);
  });
});

// ---------------------------------------------------------------------
// Family 2 — Monte Carlo full-playthrough simulation
// ---------------------------------------------------------------------

/** Deterministic PRNG — a failing seed is reproducible from the test output. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface SimResult {
  endingId: string;
  roomsEntered: string[];
  problems: string[];
  descended: boolean;
}

function simulateRun(
  pack: ContentPack,
  seed: number,
  opts: { prior?: RunState['prior']; keepsakesHeld?: string[]; maxedProfile?: boolean },
): SimResult {
  const rand = mulberry32(seed);
  const registry = makeRegistry(pack.rooms);
  const allRoomIds = pack.rooms.map((r) => r.id);
  const problems: string[] = [];
  let state = newRun(Math.floor(rand() * 2 ** 31), opts.prior, opts.keepsakesHeld);
  const roomsEntered: string[] = [];
  let lastAct = 0;
  const endingIds = new Set(pack.endings.map((e) => e.id));

  for (let step = 0; ; step++) {
    if (step > 80) {
      problems.push(`non-termination: >80 door steps (seed ${seed})`);
      return { endingId: 'TIMEOUT', roomsEntered, problems, descended: !!state.descended };
    }
    if (state.hearts <= 0) break;
    const doors = offeredDoors(state, registry, pack.graph);
    if (doors.length === 0) break;
    if (state.act < lastAct) problems.push(`act regression ${lastAct}->${state.act} (seed ${seed})`);
    lastAct = state.act;
    if (doors.some((d) => state.visited.includes(d.id))) {
      problems.push(`re-offered a visited room: ${doors.map((d) => d.id).join(',')} (seed ${seed})`);
    }

    const room = doors[Math.floor(rand() * doors.length)];
    roomsEntered.push(room.id);

    if (room.id === pack.hooks.finalGateId) {
      const eligible = pack.endingRules.computeHiddenEligible(
        allRoomIds,
        [...pack.graph.understorySequence],
        opts.maxedProfile ? allRoomIds : [],
        opts.maxedProfile ? ['k1', 'k2'] : [],
      );
      state = { ...state, anamnesisEligible: eligible };
      if (opts.maxedProfile) state = { ...state, lucidity: 300, flags: [...state.flags, 'usher-respect', 'noticed-the-hands'] };
    }
    if (room.id === pack.graph.understorySequence[0]) state = { ...state, descended: true };
    state = { ...state, currentRoom: room.id, currentStage: 0 };

    for (let i = 0; i < room.stages.length; i++) {
      const stage = room.stages[i];
      const available = stage.choices.filter((c) => !c.available || c.available(state));
      if (available.length === 0) {
        problems.push(`empty choices at ${room.id} stage${i} (seed ${seed})`);
        break;
      }
      const choice = available[Math.floor(rand() * available.length)];
      state = applyEffects(state, choice.effects);
      if (state.hearts < 0) problems.push(`hearts below zero at ${room.id}/${choice.id}`);
      const entry: TranscriptEntry = { roomId: room.id, stageIndex: i, choiceId: choice.id, choiceText: choice.text, effects: choice.effects };
      state.transcript.push(entry);
      state = { ...state, currentStage: i + 1 };
      if (state.hearts <= 0) break;
    }
    state = completeRoom(state, room.id, registry, pack.graph);
  }

  const endingId = pack.endingRules.evaluate(state);
  if (!endingIds.has(endingId)) problems.push(`unknown ending id: ${endingId} (seed ${seed})`);

  try {
    const profile = defaultProfile();
    profile.runsCompleted = (opts.prior?.runs ?? 0) + 1;
    profile.codexUnlocked = [...roomsEntered];
    profile.endingsSeen = [endingId];
    profile.lastRunTranscript = state.transcript;
    for (const r of roomsEntered) profile.roomVisits[r] = (profile.roomVisits[r] ?? 0) + 1;
    if (state.descended) profile.understoryDescents = 1;
    const registry2 = makeRegistry(pack.rooms);
    evaluateEpiphanies(profile, state, registry2, pack.epiphanies, pack.graph.understorySequence);
    ledgerStats(profile, registry2, pack.graph.understorySequence, pack.endingRules.endingsTotal, pack.keepsakes.length);
    earnedGuestStamps(profile, registry2, pack.graph.understorySequence);
    const { total } = visibleRoomCount(profile, registry2, pack.graph.understorySequence);
    const pats = activePatterns({
      runsCompleted: profile.runsCompleted,
      endingsSeen: profile.endingsSeen,
      heartsLost: 0,
      understoryDescents: profile.understoryDescents,
      roomVisits: profile.roomVisits,
      keepsakes: [],
      keepsakeChoicesTaken: [],
      roomsTotal: total,
      hasUnderstory: pack.graph.understorySequence.length > 0,
    });
    patternForRun(pats, profile.runsCompleted);
    pickOneDoorRoom(oneDoorPool(pack), profile.codexUnlocked, mulberry32(seed + 1));
  } catch (e) {
    problems.push(`downstream throw: ${(e as Error).message} (seed ${seed})`);
  }

  return { endingId, roomsEntered, problems, descended: !!state.descended };
}

// Scaled down from round 3's 1500-per-variant exploratory sweep — still
// enough to exercise every branch of offeredDoors/completeRoom deterministically
// across three profile shapes, at a size that stays fast in CI.
const SIM_RUNS_PER_VARIANT = 120;

describe.each(PACKS)('$name — Monte Carlo full playthrough (real engine functions, not a mock)', ({ pack }) => {
  const variants: [string, Parameters<typeof simulateRun>[2]][] = [
    ['first-run', {}],
    ['returning', { prior: { runs: 2, endingId: null, transcript: [] } }],
    [
      'maxed',
      {
        prior: { runs: 5, endingId: null, transcript: [] },
        keepsakesHeld: pack.keepsakes.map((k) => k.id),
        maxedProfile: true,
      },
    ],
  ];

  for (const [label, opts] of variants) {
    it(`[${label}] ${SIM_RUNS_PER_VARIANT} runs: terminate, never re-offer, act never regresses, evaluator is total, downstream helpers never throw`, () => {
      const problems: string[] = [];
      for (let s = 0; s < SIM_RUNS_PER_VARIANT; s++) {
        const r = simulateRun(pack, s * 7919 + 13, opts);
        problems.push(...r.problems);
      }
      expect(problems).toEqual([]);
    });
  }
});

// ---------------------------------------------------------------------
// Family 3 — ending-reachability bound (tripwire against content edits)
// ---------------------------------------------------------------------

type AxisName = 'selfOthers' | 'controlAcceptance';

/** Which scripted final-gate choice ids to exclude when computing the
 * axis-extreme ideal-play bound — a real player choosing the axis-driven
 * fall-through path never takes these, so including them would overstate
 * what's reachable via the axis route. */
const SCRIPTED_FINAL_CHOICES: Record<string, string[]> = {
  anamnesis: ['lie-down', 'remember-everything', 'laughing-door', 'stay'],
  limerence: ['stop-carrying-it', 'i-know-every-room', 'laughing-door', 'take-the-desk'],
};

function roomAxisExtreme(room: ContentPack['rooms'][number], axis: AxisName, sign: 1 | -1, excludeIds: Set<string>): number {
  let total = 0;
  for (const stage of room.stages) {
    let best = 0;
    const pool = stage.choices.filter((c) => !excludeIds.has(c.id));
    for (const c of pool.length ? pool : stage.choices) {
      const v = (c.effects.axes?.[axis] ?? 0) * sign;
      if (v > best) best = v;
    }
    total += best;
  }
  return total * sign;
}

/** The most extreme value `axis` can reach under literally ideal play —
 * best choice every stage, every reachable room (including a returning
 * player's Understory detour). No real playthrough can exceed this: door
 * offers only ever show a subset of the pool. */
function idealAxisBound(pack: ContentPack, axis: AxisName, sign: 1 | -1, withUnderstory: boolean): number {
  const scripted = new Set(SCRIPTED_FINAL_CHOICES[pack.meta.id] ?? []);
  const byId = new Map(pack.rooms.map((r) => [r.id, r]));
  const g = pack.graph;
  let sum = 0;
  const add = (id: string) => {
    const r = byId.get(id);
    if (r) sum += roomAxisExtreme(r, axis, sign, id === pack.hooks.finalGateId ? scripted : new Set());
  };
  add(g.prologue);
  for (const act of [1, 2, 3] as const) {
    const pool = g.actPools[act].map((id) => byId.get(id)).filter((r): r is ContentPack['rooms'][number] => Boolean(r));
    const scores = pool.filter((r) => !r.gate).map((r) => roomAxisExtreme(r, axis, sign, new Set())).sort((a, b) => (b - a) * sign);
    // +1 over optionalPerAct allows for a secret door as a third pick
    for (const v of scores.slice(0, g.optionalPerAct[act] + 1)) sum += v;
    add(g.gates[act]);
  }
  for (const id of g.act4Sequence) add(id);
  if (withUnderstory) for (const id of g.understorySequence) add(id);
  return sum;
}

describe.each(PACKS)('$name — axis-extreme endings stay reachable under ideal play', ({ pack }) => {
  // Round 3's directed-play prover found LIMERENCE's negative-axis budget
  // noticeably thinner than the other three quadrants (the-armored's ideal
  // bound of -66 vs the ±35 threshold, a real content-balance finding
  // tracked separately as R3-1 — an owner decision, not a bug). The
  // regression floor here is set below every pack's current worst-case
  // margin, so it only fires if a future content edit narrows the budget
  // further, not on today's already-known thin quadrant.
  const THRESHOLD = 35;
  const MARGIN_FLOOR = 20; // the bound must clear THRESHOLD by at least this much

  for (const [dirLabel, sign] of [['positive', 1], ['negative', -1]] as const) {
    it(`[${dirLabel}] both axes clear the ±${THRESHOLD} ending threshold with margin, under a first-run pool`, () => {
      const so = idealAxisBound(pack, 'selfOthers', sign as 1 | -1, false);
      const ca = idealAxisBound(pack, 'controlAcceptance', sign as 1 | -1, false);
      expect(Math.abs(so), `selfOthers ideal bound (${dirLabel})`).toBeGreaterThanOrEqual(THRESHOLD + MARGIN_FLOOR);
      expect(Math.abs(ca), `controlAcceptance ideal bound (${dirLabel})`).toBeGreaterThanOrEqual(THRESHOLD + MARGIN_FLOOR);
    });
  }
});
