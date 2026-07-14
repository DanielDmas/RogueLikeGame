import { describe, expect, it } from 'vitest';
import type { ContentPack } from '../packs/types';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';
import { newRun } from '../engine/gameState';

/**
 * F6 — content-assertion coverage for finding 1.1's class of bug (a heart
 * check that silently assumes a pack has heart-costing content at all).
 * Pins a floor on how many choices with a direct `hearts` penalty each
 * pack authors, across every room the pack ships — not a play-simulation
 * (heartsLoss.test.ts/difficultyGuardRail.test.ts already cover that for
 * ANAMNESIS), just a static census that regresses loudly if a future edit
 * strips a pack down to (near-)zero ways to actually lose hearts.
 */

function heartCostingChoices(pack: ContentPack): string[] {
  const ids: string[] = [];
  for (const room of pack.rooms) {
    for (const stage of room.stages) {
      for (const choice of stage.choices) {
        if ((choice.effects.hearts ?? 0) < 0) ids.push(`${room.id}:${choice.id}`);
      }
    }
  }
  return ids;
}

describe.each([
  { name: 'anamnesis', pack: anamnesisPack as ContentPack, minimum: 4 },
  { name: 'limerence', pack: limerencePack as ContentPack, minimum: 15 },
])('F6 — $name authors enough heart-costing choices to make hearts a real mechanic', ({ pack, minimum }) => {
  it(`ships at least ${minimum} choices with a direct hearts penalty`, () => {
    const ids = heartCostingChoices(pack);
    expect(ids.length).toBeGreaterThanOrEqual(minimum);
  });

  it('every heart-costing choice actually has a negative (not zero or positive) hearts effect', () => {
    for (const room of pack.rooms) {
      for (const stage of room.stages) {
        for (const choice of stage.choices) {
          if (choice.effects.hearts !== undefined) {
            expect(choice.effects.hearts, `${room.id}:${choice.id}`).not.toBe(0);
          }
        }
      }
    }
  });

  it("the pack's own hearts<=0 evaluator resolves to a real, defined ending id", () => {
    const s = { ...newRun(), hearts: 0 };
    const endingId = pack.endingRules.evaluate(s);
    const ending = pack.endings.find((e) => e.id === endingId);
    expect(ending, `pack.endingRules.evaluate at 0 hearts returned "${endingId}", which is not one of this pack's own endings`).toBeDefined();
  });
});
