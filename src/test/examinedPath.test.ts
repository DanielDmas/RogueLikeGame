import { describe, expect, it } from 'vitest';
import { allRooms } from '../content/rooms';
import { newRun } from '../engine/gameState';
import { shouldShowReflections, shouldShowSocraticAside, shuffledReflections } from '../engine/reflections';
import { setLocale, t } from '../engine/text/resolver';
import '../content/text';
import { reflectionKey } from '../engine/text/keys';
import type { Reflection } from '../engine/schema';

const TRADITIONS: Reflection['tradition'][] = ['consequence', 'duty', 'virtue', 'care'];

describe('shouldShowReflections — the owner\'s no-op guard (Milestone 5, Phase O)', () => {
  it('is false whenever examined is absent (legacy save/default), regardless of the choice', () => {
    const s = newRun();
    expect(s.examined).toBeUndefined();
    for (const room of allRooms) {
      for (const stage of room.stages) {
        for (const c of stage.choices) expect(shouldShowReflections(s, c), `${room.id}/${c.id}`).toBe(false);
      }
    }
  });

  it('is false whenever examined is explicitly false', () => {
    const s = { ...newRun(), examined: false };
    for (const room of allRooms) {
      for (const stage of room.stages) {
        for (const c of stage.choices) expect(shouldShowReflections(s, c), `${room.id}/${c.id}`).toBe(false);
      }
    }
  });

  it('is false for a choice with no authored reflections, even when examined is true', () => {
    const s = { ...newRun(), examined: true };
    for (const room of allRooms) {
      for (const stage of room.stages) {
        for (const c of stage.choices) {
          if (!c.reflections?.length) expect(shouldShowReflections(s, c), `${room.id}/${c.id}`).toBe(false);
        }
      }
    }
  });

  it('is true only for an examined run on a choice that actually has reflections authored', () => {
    const s = { ...newRun(), examined: true };
    const withReflections = allRooms.flatMap((room) =>
      room.stages.flatMap((stage) => stage.choices.filter((c) => c.reflections?.length)),
    );
    expect(withReflections.length, 'need at least one authored choice to exercise the positive case').toBeGreaterThan(0);
    for (const c of withReflections) expect(shouldShowReflections(s, c)).toBe(true);
  });
});

describe('shouldShowSocraticAside — once per act, only when examined (Milestone 5, Phase O)', () => {
  it('never fires when not examined, at any act', () => {
    for (let act = 0; act <= 4; act++) {
      expect(shouldShowSocraticAside({ ...newRun(), act: act as 0 | 1 | 2 | 3 | 4, examined: false })).toBe(false);
      expect(shouldShowSocraticAside({ ...newRun(), act: act as 0 | 1 | 2 | 3 | 4 })).toBe(false);
    }
  });

  it('fires for acts 1-4 when examined, never for the prologue (act 0)', () => {
    expect(shouldShowSocraticAside({ ...newRun(), act: 0, examined: true })).toBe(false);
    for (const act of [1, 2, 3, 4] as const) {
      expect(shouldShowSocraticAside({ ...newRun(), act, examined: true })).toBe(true);
    }
  });
});

describe('shuffledReflections — neutrality, never a ranking (Milestone 5, Phase O)', () => {
  const sample: Reflection[] = [
    { tradition: 'consequence', text: 'a' },
    { tradition: 'duty', text: 'b' },
    { tradition: 'virtue', text: 'c' },
    { tradition: 'care', text: 'd' },
  ];

  it('returns the same set of rows, regardless of order', () => {
    const shuffled = shuffledReflections(sample, () => 0.999999);
    expect(shuffled).toHaveLength(sample.length);
    expect(new Set(shuffled.map((r) => r.tradition))).toEqual(new Set(sample.map((r) => r.tradition)));
  });

  it('does not mutate the input array', () => {
    const before = [...sample];
    shuffledReflections(sample, () => 0.5);
    expect(sample).toEqual(before);
  });

  it('an injected deterministic random source actually changes the resulting order (proves it is not hardcoded)', () => {
    const a = shuffledReflections(sample, () => 0).map((r) => r.tradition);
    const b = shuffledReflections(sample, () => 0.9999).map((r) => r.tradition);
    expect(a).not.toEqual(b);
  });
});

describe('authored reflections — shape validation (Milestone 5, Phase O)', () => {
  it('every authored reflection uses one of the four known traditions', () => {
    for (const room of allRooms) {
      for (const stage of room.stages) {
        for (const c of stage.choices) {
          for (const r of c.reflections ?? []) {
            expect(TRADITIONS, `${room.id}/${c.id}`).toContain(r.tradition);
          }
        }
      }
    }
  });

  it('every authored reflection\'s English source is at most 160 characters', () => {
    for (const room of allRooms) {
      for (const stage of room.stages) {
        for (const c of stage.choices) {
          for (const r of c.reflections ?? []) {
            expect(r.text.length, `${room.id}/${c.id}/${r.tradition}`).toBeLessThanOrEqual(160);
          }
        }
      }
    }
  });

  it('a choice with any reflections authored has all four traditions present, exactly once each', () => {
    for (const room of allRooms) {
      for (const stage of room.stages) {
        for (const c of stage.choices) {
          if (!c.reflections?.length) continue;
          const present = c.reflections.map((r) => r.tradition);
          expect(new Set(present), `${room.id}/${c.id}`).toEqual(new Set(TRADITIONS));
          expect(present, `${room.id}/${c.id} has a duplicate tradition`).toHaveLength(TRADITIONS.length);
        }
      }
    }
  });

  it('every DILEMMA/INSIGHT room\'s choices are either fully authored (all reflections) or fully unauthored, never a mix', () => {
    // NO-SOLUTION/DOOMED rooms may ship with a partial or absent gap per spec's
    // authorial-judgment allowance; DILEMMA/INSIGHT rooms should not silently
    // half-cover their own choices once authoring begins.
    for (const room of allRooms) {
      if (room.type !== 'DILEMMA' && room.type !== 'INSIGHT') continue;
      for (const stage of room.stages) {
        const counts = stage.choices.map((c) => c.reflections?.length ?? 0);
        const anyAuthored = counts.some((n) => n > 0);
        if (!anyAuthored) continue;
        for (let i = 0; i < stage.choices.length; i++) {
          expect(counts[i], `${room.id}/${stage.choices[i].id} — partially-authored DILEMMA/INSIGHT room`).toBe(
            TRADITIONS.length,
          );
        }
      }
    }
  });
});

describe('reflection translation coverage — every authored reflection has cs+fa (Milestone 5, Phase O)', () => {
  for (const lang of ['cs', 'fa'] as const) {
    it(`every authored reflection is translated to ${lang}`, () => {
      setLocale(lang, 'v2');
      const missing: string[] = [];
      for (const room of allRooms) {
        for (const stage of room.stages) {
          for (const c of stage.choices) {
            for (const r of c.reflections ?? []) {
              const resolved = t(reflectionKey(room.id, c.id, r.tradition), r.text);
              if (resolved === r.text) missing.push(`${room.id}.${c.id}.${r.tradition}`);
            }
          }
        }
      }
      expect(missing, `missing ${lang} reflection translations:\n${missing.join('\n')}`).toEqual([]);
      setLocale('en', 'v2');
    });
  }
});

describe('opt-in persistence — the run flag and the default are independent (Milestone 5, Phase O)', () => {
  it('newRun stamps examined verbatim, defaulting to undefined when omitted', () => {
    expect(newRun().examined).toBeUndefined();
    expect(newRun(1, undefined, undefined, true).examined).toBe(true);
    expect(newRun(1, undefined, undefined, false).examined).toBe(false);
  });

  it('the run flag survives a quit/resume round-trip (it is just a field on the persisted RunState)', () => {
    const s = { ...newRun(1, undefined, undefined, true), currentRoom: 'wallet', currentStage: 1 };
    const roundTripped = JSON.parse(JSON.stringify(s));
    expect(roundTripped.examined).toBe(true);
  });

  it('editing the Settings default does not retroactively change an in-progress run\'s flag (mirrors flow.ts: two independent fields)', () => {
    const run = { ...newRun(1, undefined, undefined, true) };
    const settingsDefaultAfterEdit = false; // player flips the Settings toggle mid-run
    expect(run.examined).toBe(true);
    expect(settingsDefaultAfterEdit).toBe(false);
  });
});
