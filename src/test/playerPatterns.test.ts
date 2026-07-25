import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import '../content/text'; // registers ANAMNESIS's translation packs
import '../packs/limerence/text'; // registers LIMERENCE's
import { setLocale, t } from '../engine/text/resolver';
import { usherBarkKey } from '../engine/text/keys';
import { newRun } from '../engine/gameState';
import { usherDoorBark } from '../content/usher';
import { limerenceDoorBark } from '../packs/limerence/guide';
import {
  activePatterns,
  patternForRun,
  PLAYER_PATTERN_IDS,
  MIN_RUNS_FOR_PATTERN,
  MIN_RUNS_FOR_SAME_ENDING,
  MIN_VISITS_FOR_RETURN,
  type PatternInputs,
  type PlayerPatternId,
} from '../engine/patterns';

/**
 * Cross-run guide recognition — "pattern-barks" (master plan Tier 1 item 4).
 * The guide notices, out loud, something about how a player has played across
 * runs. These tests pin three separate things, because the feature can fail in
 * three unrelated ways:
 *
 *  1. **Detection** (`engine/patterns.ts`) — the right facts, at the right
 *     thresholds, in a stable order, and *silence* for a player with no
 *     history yet (the common case, and the easiest thing to break).
 *  2. **Voice** — each pack answers every pattern id in its own register, with
 *     no cross-pack guide-vocabulary leaks (standing rule R4).
 *  3. **Wiring** — `flow.ts` actually computes and passes a pattern, and each
 *     pack's `doorBark` actually consumes it instead of falling through to the
 *     generic returning-player line.
 */

const LANGS = ['cs', 'fa', 'de', 'fr'] as const;

/** A profile shaped so that *every* pattern fires — the maximal case, used to
 * exercise ordering and rotation. Individual predicates get their own narrow
 * fixtures below. */
function allPatterns(): PatternInputs {
  const roomVisits: Record<string, number> = { boulder: MIN_VISITS_FOR_RETURN };
  // enough distinct rooms to clear the walked-most-rooms fraction of 4
  for (let i = 0; i < 4; i++) roomVisits[`r${i}`] = 1;
  return {
    runsCompleted: MIN_RUNS_FOR_SAME_ENDING,
    endingsSeen: ['dissolved'],
    heartsLost: 0,
    understoryDescents: 0,
    roomVisits,
    keepsakes: ['a-keepsake'],
    keepsakeChoicesTaken: [],
    roomsTotal: 4,
    hasUnderstory: true,
  };
}

/** A profile with a real history that trips *no* pattern — proves each
 * predicate genuinely discriminates rather than always firing. */
function noPatterns(): PatternInputs {
  return {
    runsCompleted: 5,
    endingsSeen: ['dissolved', 'anamnesis'],
    heartsLost: 3,
    understoryDescents: 1,
    roomVisits: { boulder: 1, wallet: 2 },
    keepsakes: ['a-keepsake'],
    keepsakeChoicesTaken: ['room:choice'],
    roomsTotal: 30,
    hasUnderstory: true,
  };
}

describe('activePatterns — detection (engine/patterns.ts)', () => {
  it('stays silent for a player with no finished runs at all', () => {
    expect(activePatterns({ ...allPatterns(), runsCompleted: 0 })).toEqual([]);
  });

  it('stays silent one run short of the threshold — one visit is not yet a pattern', () => {
    const i = { ...allPatterns(), runsCompleted: MIN_RUNS_FOR_PATTERN - 1 };
    expect(activePatterns(i)).toEqual([]);
  });

  it('finds nothing in a real, varied history that fits none of the shapes', () => {
    expect(activePatterns(noPatterns())).toEqual([]);
  });

  it('returns matches in PLAYER_PATTERN_IDS order, never an arbitrary one', () => {
    const found = activePatterns(allPatterns());
    expect(found.length).toBeGreaterThan(1);
    const expectedOrder = PLAYER_PATTERN_IDS.filter((id) => found.includes(id));
    expect(found).toEqual(expectedOrder);
  });

  it('every declared pattern id is reachable by some profile', () => {
    // Guards against a pattern being declared, given a translated line in five
    // languages, and then never actually firing because its predicate is
    // unsatisfiable — a silent content-dead-code bug.
    const reachable = new Set(activePatterns(allPatterns()));
    reachable.add('walked-most-rooms');
    for (const id of PLAYER_PATTERN_IDS) {
      expect(reachable.has(id), `${id} should be reachable`).toBe(true);
    }
  });

  describe('individual predicates', () => {
    it('same-ending-again needs more runs than the base threshold', () => {
      const base = { ...noPatterns(), endingsSeen: ['dissolved'], heartsLost: 1, understoryDescents: 1 };
      expect(
        activePatterns({ ...base, runsCompleted: MIN_RUNS_FOR_SAME_ENDING - 1 }),
      ).not.toContain('same-ending-again');
      expect(activePatterns({ ...base, runsCompleted: MIN_RUNS_FOR_SAME_ENDING })).toContain(
        'same-ending-again',
      );
    });

    it('same-ending-again does not fire once a second ending has been seen', () => {
      const base = { ...noPatterns(), heartsLost: 1, understoryDescents: 1, runsCompleted: 9 };
      expect(activePatterns({ ...base, endingsSeen: ['a', 'b'] })).not.toContain('same-ending-again');
    });

    it('never-spent-a-heart fires only at exactly zero lifetime hearts lost', () => {
      const base = { ...noPatterns(), understoryDescents: 1 };
      expect(activePatterns({ ...base, heartsLost: 0 })).toContain('never-spent-a-heart');
      expect(activePatterns({ ...base, heartsLost: 1 })).not.toContain('never-spent-a-heart');
    });

    it('holds-unspent-keepsakes needs a keepsake held AND none ever spent', () => {
      const base = { ...noPatterns(), understoryDescents: 1 };
      expect(
        activePatterns({ ...base, keepsakes: ['k'], keepsakeChoicesTaken: [] }),
      ).toContain('holds-unspent-keepsakes');
      // nothing earned yet — there is nothing to remark on
      expect(activePatterns({ ...base, keepsakes: [], keepsakeChoicesTaken: [] })).not.toContain(
        'holds-unspent-keepsakes',
      );
      // already spent one — the observation is no longer true
      expect(
        activePatterns({ ...base, keepsakes: ['k'], keepsakeChoicesTaken: ['r:c'] }),
      ).not.toContain('holds-unspent-keepsakes');
    });

    it('never-descended is suppressed entirely for a pack with no Understory', () => {
      // A pack without one must never be told it failed to find it — this is
      // the reason `hasUnderstory` is a required input rather than assumed.
      const base = { ...noPatterns(), understoryDescents: 0 };
      expect(activePatterns({ ...base, hasUnderstory: true })).toContain('never-descended');
      expect(activePatterns({ ...base, hasUnderstory: false })).not.toContain('never-descended');
    });

    it('walked-most-rooms measures distinct rooms completed against the visible total', () => {
      const base = { ...noPatterns(), understoryDescents: 1, roomsTotal: 4 };
      // 3 of 4 = exactly the 75% ceiling
      expect(
        activePatterns({ ...base, roomVisits: { a: 1, b: 1, c: 1 } }),
      ).toContain('walked-most-rooms');
      expect(activePatterns({ ...base, roomVisits: { a: 1, b: 1 } })).not.toContain(
        'walked-most-rooms',
      );
    });

    it('walked-most-rooms is disabled by a zero total rather than dividing by it', () => {
      const i = { ...noPatterns(), understoryDescents: 1, roomsTotal: 0, roomVisits: { a: 1 } };
      expect(activePatterns(i)).not.toContain('walked-most-rooms');
    });

    it('returns-to-one-room needs one room at the repeat threshold, not just several visits', () => {
      const base = { ...noPatterns(), understoryDescents: 1 };
      expect(
        activePatterns({ ...base, roomVisits: { a: MIN_VISITS_FOR_RETURN } }),
      ).toContain('returns-to-one-room');
      // spread thinly across many rooms is a different shape, and not this one
      expect(
        activePatterns({ ...base, roomVisits: { a: 2, b: 2, c: 2, d: 2 } }),
      ).not.toContain('returns-to-one-room');
    });
  });
});

describe('patternForRun — which single observation gets voiced', () => {
  it('returns null when nothing is active, so the guide falls back to its generic line', () => {
    expect(patternForRun([], 4)).toBeNull();
  });

  it('is deterministic — a reload cannot reshuffle what the guide just said', () => {
    const active = activePatterns(allPatterns());
    expect(patternForRun(active, 3)).toBe(patternForRun(active, 3));
  });

  it('rotates across returning runs so a repeat player is not told the same thing forever', () => {
    const active = activePatterns(allPatterns());
    expect(active.length).toBeGreaterThan(1);
    const voiced = new Set<PlayerPatternId | null>();
    for (let run = 0; run < active.length; run++) voiced.add(patternForRun(active, run));
    expect(voiced.size).toBe(active.length);
  });

  it('never indexes out of range, even on a corrupt imported runsCompleted', () => {
    const active = activePatterns(allPatterns());
    for (const runs of [-5, 0, 1.7, Number.MAX_SAFE_INTEGER]) {
      expect(active).toContain(patternForRun(active, runs));
    }
  });
});

describe('the guide actually speaks each pattern, in its own voice', () => {
  afterEach(() => setLocale('en', 'v2'));

  /** A returning player standing at their first door — the exact state the
   * pattern branch fires in. */
  const returning = () => ({ ...newRun(), visited: [] as string[] });

  it('ANAMNESIS: every pattern yields a distinct, non-generic Usher line', () => {
    const generic = usherDoorBark(returning(), 3, 2, false, null);
    const lines = new Set<string>();
    for (const id of PLAYER_PATTERN_IDS) {
      const line = usherDoorBark(returning(), 3, 2, false, id);
      expect(line, `${id} should not fall through to the generic second-run line`).not.toBe(generic);
      expect(line.startsWith('Usher:'), `${id} should be spoken by the Usher`).toBe(true);
      lines.add(line);
    }
    expect(lines.size, 'each pattern needs its own line, not a shared one').toBe(
      PLAYER_PATTERN_IDS.length,
    );
  });

  it('LIMERENCE: every pattern yields a distinct, non-generic Porter line', () => {
    const generic = limerenceDoorBark(returning(), 3, 2, false, null);
    const lines = new Set<string>();
    for (const id of PLAYER_PATTERN_IDS) {
      const line = limerenceDoorBark(returning(), 3, 2, false, id);
      expect(line, `${id} should not fall through to the generic second-run line`).not.toBe(generic);
      expect(line.startsWith('Porter:'), `${id} should be spoken by the Porter`).toBe(true);
      lines.add(line);
    }
    expect(lines.size).toBe(PLAYER_PATTERN_IDS.length);
  });

  it('the two packs never share a pattern line — same fact, different voice', () => {
    for (const id of PLAYER_PATTERN_IDS) {
      const usher = usherDoorBark(returning(), 3, 2, false, id);
      const porter = limerenceDoorBark(returning(), 3, 2, false, id);
      expect(usher).not.toBe(porter);
    }
  });

  it('a pattern is only voiced to a returning player, never on a first-ever run', () => {
    // runsCompleted 0 short-circuits before the pattern branch even with a
    // pattern supplied, so a first-time player can never be "recognised".
    const first = { ...newRun(), act: 1 as const, visited: ['boulder'] };
    const withPattern = usherDoorBark(first, 0, 2, false, 'never-spent-a-heart');
    expect(withPattern).toContain('Usher:');
    expect(withPattern).toBe(usherDoorBark(first, 0, 2, false, null));
  });

  it('the mandatory door explainers still outrank recognition', () => {
    // A single-door gate must still explain itself rather than being replaced
    // by a cross-run aside — the explainers exist to prevent real confusion.
    const gate = { ...newRun(), visited: ['boulder'] };
    const withPattern = usherDoorBark(gate, 3, 1, false, 'never-spent-a-heart');
    expect(withPattern).toBe(usherDoorBark(gate, 3, 1, false, null));
    // ...and so does the once-per-run understory fork.
    const fork = usherDoorBark(returning(), 3, 2, true, 'never-spent-a-heart');
    expect(fork).toBe(usherDoorBark(returning(), 3, 2, true, null));
  });
});

describe('pattern-bark translations (CLAUDE.md R1: every string, every language)', () => {
  afterEach(() => setLocale('en', 'v2'));

  /** Each pack's guide-word per language — standing rule R4 forbids either
   * pack's vocabulary appearing in the other's content. */
  const ANAMNESIS_WORDS: Record<string, string> = {
    cs: 'Uvaděč', de: 'Platzanweiser', fr: 'Placeur', fa: 'نگهبان',
  };
  const LIMERENCE_WORDS: Record<string, string> = {
    cs: 'Vrátný', de: 'Portier', fr: 'Portier', fa: 'دربان',
  };

  for (const lang of LANGS) {
    for (const id of PLAYER_PATTERN_IDS) {
      it(`ANAMNESIS ${id} is translated into ${lang} and speaks as the Usher`, () => {
        setLocale(lang, 'v2');
        const line = t(usherBarkKey(`pattern-${id}`), 'FALLBACK');
        expect(line, 'should not fall back to English/placeholder').not.toBe('FALLBACK');
        expect(line).toContain(ANAMNESIS_WORDS[lang]);
        expect(line, 'must not leak LIMERENCE guide vocabulary').not.toContain(
          LIMERENCE_WORDS[lang],
        );
      });

      it(`LIMERENCE ${id} is translated into ${lang} and speaks as the Porter`, () => {
        setLocale(lang, 'v2');
        const line = t(usherBarkKey(`pattern-${id}`, 'limerence'), 'FALLBACK');
        expect(line).not.toBe('FALLBACK');
        expect(line).toContain(LIMERENCE_WORDS[lang]);
        expect(line, 'must not leak ANAMNESIS guide vocabulary').not.toContain(
          ANAMNESIS_WORDS[lang],
        );
      });
    }

    it(`the two packs' ${lang} pattern lines are genuinely different text`, () => {
      setLocale(lang, 'v2');
      for (const id of PLAYER_PATTERN_IDS) {
        const a = t(usherBarkKey(`pattern-${id}`), 'A');
        const l = t(usherBarkKey(`pattern-${id}`, 'limerence'), 'L');
        expect(a).not.toBe(l);
      }
    });
  }
});

describe('wiring — flow.ts computes and passes a pattern', () => {
  // Source-level, matching this repo's convention for engine wiring that has
  // no DOM-free seam to call (vitest runs with `environment: 'node'`).
  const flowSrc = readFileSync(resolve(__dirname, '../engine/flow.ts'), 'utf-8');

  it('derives the pattern from the profile and hands it to the pack guide', () => {
    expect(flowSrc).toMatch(/activePatterns\(/);
    expect(flowSrc).toMatch(/patternForRun\(/);
    expect(flowSrc).toMatch(/doorBark\([\s\S]{0,300}?this\.recognizedPattern\(\)/);
  });

  it('supplies the active pack\'s own room total and Understory presence, not a default', () => {
    expect(flowSrc).toMatch(/hasUnderstory:\s*this\.pack\.graph\.understorySequence\.length\s*>\s*0/);
    expect(flowSrc).toMatch(/visibleRoomCount\(/);
  });

  it('never writes to the profile while deriving a pattern (the guide reads, never writes)', () => {
    const fn = flowSrc.slice(
      flowSrc.indexOf('private recognizedPattern()'),
      flowSrc.indexOf('private doorIndex('),
    );
    expect(fn.length).toBeGreaterThan(100);
    expect(fn).not.toMatch(/this\.profile\.\w+\s*=/);
    expect(fn).not.toMatch(/this\.persist\(/);
  });
});
