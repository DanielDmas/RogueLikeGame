import { describe, expect, it } from 'vitest';
import { newRun } from '../engine/gameState';
import { limerencePack } from '../packs/limerence';
import { mirrorUnlocked, patternAvailable, computePatternEligible, MIRROR_LUCIDITY, PATTERN_CLARITY } from '../packs/limerence/endingLogic';
import type { Room, RunState } from '../engine/schema';

const registry = new Map(limerencePack.rooms.map((r) => [r.id, r]));
function room(id: string): Room {
  const r = registry.get(id);
  if (!r) throw new Error(`room not found: ${id}`);
  return r;
}

describe('LIMERENCE Act IV — real content (spec 05-rooms-act4-understory.md §1-3)', () => {
  it('the-kitchen-table offers 4 base choices + an additive ✧ bonus for the-unsent-letter, each act=4', () => {
    const r = room('the-kitchen-table');
    expect(r.act).toBe(4);
    const base = r.stages[0].choices.filter((c) => !c.keepsakeId);
    expect(base).toHaveLength(4);
    const bonus = r.stages[0].choices.find((c) => c.keepsakeId === 'the-unsent-letter');
    expect(bonus).toBeDefined();
    expect(bonus!.available!({ ...newRun(), keepsakesHeld: [] })).toBe(false);
    expect(bonus!.available!({ ...newRun(), keepsakesHeld: ['the-unsent-letter'] })).toBe(true);
  });

  it('the-kitchen-table’s dynamic opening beat differs by yours/theirs/both betrayal-flag lineage', () => {
    const r = room('the-kitchen-table');
    const dynamicBeat = r.stages[0].beats.find((b): b is (s: RunState) => string => typeof b === 'function')!;
    const neither = dynamicBeat(newRun());
    const yours = dynamicBeat({ ...newRun(), flags: ['confessed-whole'] });
    const theirs = dynamicBeat({ ...newRun(), flags: ['played-detective'] });
    const both = dynamicBeat({ ...newRun(), flags: ['confessed-whole', 'played-detective'] });
    const results = new Set([neither, yours, theirs, both]);
    expect(results.size).toBe(4);
  });

  it('the-unsent offers 6 choices with correct availability gating', () => {
    const r = room('the-unsent');
    expect(r.act).toBe(4);
    const choices = r.stages[0].choices;
    expect(choices).toHaveLength(6);
    const byId = Object.fromEntries(choices.map((c) => [c.id, c]));

    expect(byId['to-your-16-year-old-self'].available).toBeUndefined();
    expect(byId['blank-page'].available).toBeUndefined();

    expect(byId['to-the-one-you-hurt'].available!(newRun())).toBe(false);
    expect(byId['to-the-one-you-hurt'].available!({ ...newRun(), flags: ['confessed-whole'] })).toBe(true);

    expect(byId['to-the-one-who-hurt-you'].available!(newRun())).toBe(false);
    expect(byId['to-the-one-who-hurt-you'].available!({ ...newRun(), flags: ['chose-not-to-know'] })).toBe(true);

    expect(byId['to-the-one-that-got-away'].available!(newRun())).toBe(false);
    expect(byId['to-the-one-that-got-away'].available!({ ...newRun(), flags: ['walked-away'] })).toBe(true);

    expect(byId['to-your-own-kids-someday'].available!(newRun())).toBe(false);
    expect(byId['to-your-own-kids-someday'].available!({ ...newRun(), visited: ['the-kitchen-table'] })).toBe(true);
  });

  it('the-unsent’s "to-your-16-year-old-self" outcome quotes an actual Act I transcript entry when one exists, and falls back gracefully otherwise', () => {
    const choice = room('the-unsent').stages[0].choices.find((c) => c.id === 'to-your-16-year-old-self')!;
    const dynamicLine = choice.outcome.find((b): b is (s: RunState) => string => typeof b === 'function')!;
    const withoutHistory = dynamicLine(newRun());
    expect(typeof withoutHistory).toBe('string');
    expect(withoutHistory.length).toBeGreaterThan(0);
    const withHistory = dynamicLine({
      ...newRun(),
      transcript: [{ roomId: 'the-read-receipt', stageIndex: 0, choiceId: 'drawer', choiceText: 'Put the phone in a drawer. Sit with the feeling.' }],
    });
    expect(withHistory).toContain('Put the phone in a drawer. Sit with the feeling.');
    expect(withHistory).not.toBe(withoutHistory);
  });

  it('the-morning-desk is a real gate, 2 stages: a 3-choice audit, then a 3-5-choice threshold', () => {
    const r = room('the-morning-desk');
    expect(r.gate).toBe(true);
    expect(r.act).toBe(4);
    expect(r.stages).toHaveLength(2);
    expect(r.stages[0].choices).toHaveLength(3);
    expect(r.stages[1].choices.length).toBeGreaterThanOrEqual(3);
    expect(r.stages[1].choices.map((c) => c.id)).toEqual(
      expect.arrayContaining(['walk-out', 'take-the-desk', 'stop-carrying-it', 'laughing-door', 'i-know-every-room']),
    );
  });

  it('the-morning-desk’s "name-what-changed-me" sets noticed-the-hands, feeding the-mirror’s unlock', () => {
    const choice = room('the-morning-desk').stages[0].choices.find((c) => c.id === 'name-what-changed-me')!;
    expect(choice.effects.flags).toContain('noticed-the-hands');
  });

  it('the-morning-desk’s hidden threshold doors are gated on mirrorUnlocked/patternAvailable respectively', () => {
    const r = room('the-morning-desk');
    const laughing = r.stages[1].choices.find((c) => c.id === 'laughing-door')!;
    const pattern = r.stages[1].choices.find((c) => c.id === 'i-know-every-room')!;
    expect(laughing.available).toBeDefined();
    expect(pattern.available).toBeDefined();
    expect(laughing.available!(newRun())).toBe(false);
    expect(pattern.available!(newRun())).toBe(false);
  });

  it('every Act IV room has a field note with a substantial body', () => {
    for (const id of ['the-kitchen-table', 'the-unsent', 'the-morning-desk']) {
      const r = room(id);
      expect(r.fieldNote, `${id} has no field note`).toBeDefined();
      expect(r.fieldNote!.body.length).toBeGreaterThan(80);
    }
  });
});

describe('LIMERENCE Records Office (understory) — real content', () => {
  it('understorySequence is wired to the 3 real Records Office rooms, all act=4', () => {
    expect(limerencePack.graph.understorySequence).toEqual(['the-registry', 'the-doors-not-opened', 'the-other-side']);
    for (const id of limerencePack.graph.understorySequence) expect(room(id).act).toBe(4);
  });

  it('the-registry offers 3 base choices + an additive ✧ bonus for the-keycard', () => {
    const r = room('the-registry');
    const base = r.stages[0].choices.filter((c) => !c.keepsakeId);
    expect(base).toHaveLength(3);
    const bonus = r.stages[0].choices.find((c) => c.keepsakeId === 'the-keycard');
    expect(bonus).toBeDefined();
    expect(bonus!.available!({ ...newRun(), keepsakesHeld: [] })).toBe(false);
    expect(bonus!.available!({ ...newRun(), keepsakesHeld: ['the-keycard'] })).toBe(true);
  });

  it('the-registry’s exhibit beat resolves without throwing with and without a prior transcript', () => {
    const r = room('the-registry');
    const dynamicBeat = r.stages[0].beats.find((b): b is (s: RunState) => string => typeof b === 'function')!;
    expect(() => dynamicBeat(newRun())).not.toThrow();
    expect(() =>
      dynamicBeat({
        ...newRun(),
        prior: { runs: 1, endingId: null, transcript: [{ roomId: 'the-party', stageIndex: 0, choiceId: 'refuse', choiceText: 'Refuse the dare. Absorb the mockery.' }] },
      }),
    ).not.toThrow();
  });

  it('the-doors-not-opened offers exactly 3 choices and its dynamic beats resolve without throwing', () => {
    const r = room('the-doors-not-opened');
    expect(r.stages[0].choices).toHaveLength(3);
    const dynamicBeats = r.stages[0].beats.filter((b): b is (s: RunState) => string => typeof b === 'function');
    expect(dynamicBeats.length).toBeGreaterThanOrEqual(2);
    for (const beat of dynamicBeats) {
      expect(() => beat(newRun())).not.toThrow();
      expect(() => beat({ ...newRun(), prior: { runs: 2, endingId: 'the-morning-after', transcript: [] } })).not.toThrow();
    }
  });

  it('the-other-side offers 3 base choices + an additive ✧ bonus for the-sim', () => {
    const r = room('the-other-side');
    const base = r.stages[0].choices.filter((c) => !c.keepsakeId);
    expect(base).toHaveLength(3);
    const bonus = r.stages[0].choices.find((c) => c.keepsakeId === 'the-sim');
    expect(bonus).toBeDefined();
    expect(bonus!.available!({ ...newRun(), keepsakesHeld: [] })).toBe(false);
    expect(bonus!.available!({ ...newRun(), keepsakesHeld: ['the-sim'] })).toBe(true);
  });

  it('the-other-side’s shadow/gate/ending beats resolve without throwing across a range of prior states', () => {
    const r = room('the-other-side');
    const dynamicBeats = r.stages[0].beats.filter((b): b is (s: RunState) => string => typeof b === 'function');
    expect(dynamicBeats.length).toBeGreaterThanOrEqual(3);
    const fixtures: RunState[] = [
      newRun(),
      { ...newRun(), prior: { runs: 1, endingId: 'the-morning-after', transcript: [{ roomId: 'the-rumor', stageIndex: 0, choiceId: 'set-the-trap', choiceText: 'Tell her a fake detail.' }] } },
      { ...newRun(), prior: { runs: 1, endingId: 'the-ghost', transcript: [{ roomId: 'the-rumor', stageIndex: 0, choiceId: 'trust-without-asking', choiceText: 'Extend the benefit of the doubt whole.' }] } },
    ];
    for (const beat of dynamicBeats) {
      for (const s of fixtures) expect(() => beat(s)).not.toThrow();
    }
  });

  it('every Records Office room has a field note with a substantial body', () => {
    for (const id of ['the-registry', 'the-doors-not-opened', 'the-other-side']) {
      const r = room(id);
      expect(r.fieldNote, `${id} has no field note`).toBeDefined();
      expect(r.fieldNote!.body.length).toBeGreaterThan(80);
    }
  });
});

describe('LIMERENCE — all 7 endings (spec 06-endings-keepsakes-epiphanies.md §1)', () => {
  const ENDING_IDS = ['the-morning-after', 'the-giver', 'the-armored', 'the-ghost', 'the-porter', 'the-mirror', 'the-pattern'];

  it('exactly 7 endings are defined, matching the spec’s id list', () => {
    expect(limerencePack.endings.map((e) => e.id).sort()).toEqual([...ENDING_IDS].sort());
  });

  it('every ending has a title, non-empty epitaph, at least 4 beats, and a field note', () => {
    for (const ending of limerencePack.endings) {
      expect(ending.title.length, `${ending.id} title`).toBeGreaterThan(0);
      expect(ending.epitaph.length, `${ending.id} epitaph`).toBeGreaterThan(0);
      expect(ending.beats.length, `${ending.id} beats`).toBeGreaterThanOrEqual(4);
      expect(ending.fieldNote, `${ending.id} field note`).toBeDefined();
      expect(ending.fieldNote!.body.length, `${ending.id} field note body`).toBeGreaterThan(80);
    }
  });

  it('the-pattern is hidden until witnessed, and no other ending is', () => {
    expect(limerencePack.endingRules.hiddenUntilWitnessed).toEqual(['the-pattern']);
  });

  it('endingsTotal is 6 until the-pattern has been witnessed, then 7', () => {
    expect(limerencePack.endingRules.endingsTotal([])).toBe(6);
    expect(limerencePack.endingRules.endingsTotal(['the-morning-after', 'the-ghost'])).toBe(6);
    expect(limerencePack.endingRules.endingsTotal(['the-pattern'])).toBe(7);
  });

  it('evaluate: hearts <= 0 always resolves to the-ghost, regardless of any final-gate choice', () => {
    const s: RunState = { ...newRun(), hearts: 0, transcript: [{ roomId: 'the-morning-desk', stageIndex: 1, choiceId: 'take-the-desk', choiceText: '...' }] };
    expect(limerencePack.endingRules.evaluate(s)).toBe('the-ghost');
  });

  it('evaluate: each final-gate choice maps to its designed ending', () => {
    const withChoice = (choiceId: string): RunState => ({
      ...newRun(),
      transcript: [{ roomId: 'the-morning-desk', stageIndex: 1, choiceId, choiceText: '...' }],
    });
    expect(limerencePack.endingRules.evaluate(withChoice('stop-carrying-it'))).toBe('the-ghost');
    expect(limerencePack.endingRules.evaluate(withChoice('take-the-desk'))).toBe('the-porter');
    expect(limerencePack.endingRules.evaluate(withChoice('laughing-door'))).toBe('the-mirror');
    expect(limerencePack.endingRules.evaluate(withChoice('i-know-every-room'))).toBe('the-pattern');
  });

  it('evaluate: axis extremes resolve to the-giver / the-armored when no explicit gate choice was made', () => {
    const giver: RunState = { ...newRun(), axes: { reasonFeeling: 0, selfOthers: 40, controlAcceptance: 40 } };
    const armored: RunState = { ...newRun(), axes: { reasonFeeling: 0, selfOthers: -40, controlAcceptance: -40 } };
    expect(limerencePack.endingRules.evaluate(giver)).toBe('the-giver');
    expect(limerencePack.endingRules.evaluate(armored)).toBe('the-armored');
  });

  it('evaluate: default, unremarkable run resolves to the-morning-after', () => {
    expect(limerencePack.endingRules.evaluate(newRun())).toBe('the-morning-after');
  });

  it('epitaphLines returns empty until 2 endings are seen, then translated epitaphs in witness order', () => {
    expect(limerencePack.endingRules.epitaphLines([])).toEqual([]);
    expect(limerencePack.endingRules.epitaphLines(['the-morning-after'])).toEqual([]);
    const lines = limerencePack.endingRules.epitaphLines(['the-morning-after', 'the-ghost']);
    expect(lines).toHaveLength(2);
  });
});

describe('LIMERENCE — hidden-ending unlock logic (endingLogic.ts)', () => {
  it('mirrorUnlocked requires both noticed-the-hands and MIRROR_LUCIDITY', () => {
    expect(mirrorUnlocked(newRun())).toBe(false);
    expect(mirrorUnlocked({ ...newRun(), flags: ['noticed-the-hands'], lucidity: MIRROR_LUCIDITY - 1 })).toBe(false);
    expect(mirrorUnlocked({ ...newRun(), lucidity: MIRROR_LUCIDITY })).toBe(false);
    expect(mirrorUnlocked({ ...newRun(), flags: ['noticed-the-hands'], lucidity: MIRROR_LUCIDITY })).toBe(true);
  });

  it('patternAvailable requires anamnesisEligible, PATTERN_CLARITY, no memoryLost, and no chose-not-to-know', () => {
    const base: RunState = { ...newRun(), anamnesisEligible: true, lucidity: PATTERN_CLARITY };
    expect(patternAvailable(base)).toBe(true);
    expect(patternAvailable({ ...base, anamnesisEligible: false })).toBe(false);
    expect(patternAvailable({ ...base, lucidity: PATTERN_CLARITY - 1 })).toBe(false);
    expect(patternAvailable({ ...base, memoryLost: true })).toBe(false);
    expect(patternAvailable({ ...base, flags: ['chose-not-to-know'] })).toBe(false);
  });

  it('computePatternEligible requires full base-room codex completion and >=2 keepsake choices', () => {
    const allIds = limerencePack.rooms.map((r) => r.id);
    const understoryIds = limerencePack.graph.understorySequence;
    const baseIds = allIds.filter((id) => !understoryIds.includes(id));
    expect(computePatternEligible(allIds, understoryIds, baseIds, ['a', 'b'])).toBe(true);
    expect(computePatternEligible(allIds, understoryIds, baseIds.slice(1), ['a', 'b'])).toBe(false);
    expect(computePatternEligible(allIds, understoryIds, baseIds, ['a'])).toBe(false);
  });
});
