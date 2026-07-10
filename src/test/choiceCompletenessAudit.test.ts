import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { allRooms } from '../content/rooms';
import { limerencePack } from '../packs/limerence';
import { anamnesisPack } from '../packs/anamnesis';
import { t, setLocale } from '../engine/text/resolver';
import { roomChoiceTextKey, roomChoiceHintKey, roomChoiceOutcomeKey } from '../engine/text/keys';
import { newRun } from '../engine/gameState';
import '../content/text';

/**
 * Regression coverage for the five choices added by the 2026-07-10
 * choice-completeness audit (docs: the approved plan at that session's
 * plan-mode exit) — each fills a logical gap a room's own text pointed at
 * but never offered. Locks the mechanical facts the plan specified, plus
 * (for the two LIMERENCE additions) the downstream wiring into the
 * epiphany ASKING lineage and, for the-discovery, the Act IV flag web.
 */

function room(rooms: typeof allRooms, id: string) {
  const r = rooms.find((x) => x.id === id);
  if (!r) throw new Error(`room not found: ${id}`);
  return r;
}

describe('Choice-completeness audit — ANAMNESIS additions', () => {
  const cases: { roomId: string; choiceId: string; heart: boolean }[] = [
    { roomId: 'beggars-math', choiceId: 'walk-on', heart: false },
    { roomId: 'the-reference', choiceId: 'talk-first', heart: false },
    { roomId: 'chinese-room', choiceId: 'take-the-seat', heart: false },
  ];

  for (const { roomId, choiceId, heart } of cases) {
    it(`${roomId} offers "${choiceId}" with a hint, effects, outcome beats, and 4-tradition reflections`, () => {
      const r = room(allRooms, roomId);
      const choice = r.stages[0].choices.find((c) => c.id === choiceId);
      expect(choice, `${roomId} should have a "${choiceId}" choice`).toBeDefined();
      expect(choice!.hint).toBeTruthy();
      expect(choice!.effects).toBeDefined();
      expect(choice!.outcome.length).toBeGreaterThan(0);
      expect(choice!.reflections, `${roomId}/${choiceId} should have reflections (sibling choices are all authored)`).toHaveLength(4);
      expect(choice!.effects.hearts ?? 0, `${roomId}/${choiceId} heart cost`).toBe(heart ? -1 : 0);
    });
  }

  it('every new choice text/hint/outcome resolves to a real translation (not the English fallback) in cs, fa, de, and fr', () => {
    for (const lang of ['cs', 'fa', 'de', 'fr'] as const) {
      setLocale(lang, 'v2');
      for (const { roomId, choiceId } of cases) {
        const r = room(allRooms, roomId);
        const choice = r.stages[0].choices.find((c) => c.id === choiceId)!;
        const text = t(roomChoiceTextKey(roomId, choiceId), choice.text);
        expect(text, `${roomId}/${choiceId} text should be translated to ${lang}`).not.toBe(choice.text);
        const hint = t(roomChoiceHintKey(roomId, choiceId), choice.hint!);
        expect(hint, `${roomId}/${choiceId} hint should be translated to ${lang}`).not.toBe(choice.hint);
        choice.outcome.forEach((beat, oi) => {
          if (typeof beat !== 'string') return;
          const resolved = t(roomChoiceOutcomeKey(roomId, choiceId, oi), beat);
          expect(resolved, `${roomId}/${choiceId} outcome${oi} should be translated to ${lang}`).not.toBe(beat);
        });
      }
    }
    setLocale('en', 'v2');
  });
});

describe('Choice-completeness audit — LIMERENCE additions', () => {
  it('the-rumor offers "ask-her-plainly": the plain-question door the room’s own beats promise, costing no heart (unlike interrogate)', () => {
    const r = room(limerencePack.rooms, 'the-rumor');
    const choice = r.stages[0].choices.find((c) => c.id === 'ask-her-plainly');
    expect(choice).toBeDefined();
    expect(choice!.hint).toBeTruthy();
    expect(choice!.effects.hearts ?? 0).toBe(0);
    expect(choice!.reflections).toHaveLength(4);
  });

  it('the-discovery offers "steady-then-ask": the delay-then-direct-conversation door its own field note recommends', () => {
    const r = room(limerencePack.rooms, 'the-discovery');
    const baseChoices = r.stages[0].choices.filter((c) => !c.keepsakeId);
    expect(baseChoices).toHaveLength(5);
    const choice = baseChoices.find((c) => c.id === 'steady-then-ask');
    expect(choice).toBeDefined();
    expect(choice!.effects.hearts).toBe(-1);
    expect(choice!.effects.flags).toContain('steadied-first');
    expect(choice!.reflections).toHaveLength(4);
  });

  it('both new LIMERENCE choice ids join the ASKING epiphany lineage ("You have never once asked before accusing")', () => {
    const src = readFileSync(resolve(__dirname, '../packs/limerence/epiphanies.ts'), 'utf-8');
    expect(src).toContain("'the-rumor:ask-her-plainly'");
    expect(src).toContain("'the-discovery:steady-then-ask'");
  });

  it('steadied-first joins THEIRS_FLAGS so the-kitchen-table/the-unsent correctly treat a steadied discovery as "theirs"', () => {
    const src = readFileSync(resolve(__dirname, '../packs/limerence/rooms/act4.ts'), 'utf-8');
    const match = src.match(/const THEIRS_FLAGS = \[([^\]]+)\];/);
    expect(match, 'THEIRS_FLAGS array should be found in act4.ts').toBeTruthy();
    expect(match![1]).toContain('steadied-first');
  });

  it('the-unsent’s "to-the-one-who-hurt-you" letter becomes available once the-discovery was steadied', () => {
    const unsent = room(limerencePack.rooms, 'the-unsent');
    const choice = unsent.stages[0].choices.find((c) => c.id === 'to-the-one-who-hurt-you')!;
    expect(choice.available).toBeDefined();
    const run = { ...newRun(), flags: ['steadied-first'] };
    expect(choice.available!(run)).toBe(true);
  });
});

describe('Choice-completeness audit — pack totals grew by exactly five', () => {
  it('ANAMNESIS gained exactly 3 choices from the audit’s three additions', () => {
    const total = anamnesisPack.rooms.reduce((n, r) => n + r.stages.reduce((m, s) => m + s.choices.length, 0), 0);
    expect(total).toBe(132);
  });

  it('LIMERENCE gained exactly 2 choices (143 -> 145)', () => {
    const total = limerencePack.rooms.reduce((n, r) => n + r.stages.reduce((m, s) => m + s.choices.length, 0), 0);
    expect(total).toBe(145);
  });
});
