import { describe, expect, it } from 'vitest';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';
import type { ContentPack } from '../packs/types';

// M5 Phase R5 — content pipeline & continuity (spec 08 §7). Schema-validation
// sweep over every authored room: catches broken content (a missing hint, an
// empty outcome, a keepsakeId typo, an illegal reflections tradition) at
// `vitest run` time instead of at playtest time. Parameterized over every
// pack (spec 09 §2) — LIMERENCE's L1 skeleton is small but held to the same
// bar as ANAMNESIS's full room set, not exempted as a stub.

const LEGAL_TRADITIONS = new Set(['consequence', 'duty', 'virtue', 'care']);

const packs: { name: string; pack: ContentPack }[] = [
  { name: 'anamnesis', pack: anamnesisPack },
  { name: 'limerence', pack: limerencePack },
];

describe.each(packs)('Milestone 5, Phase R5 — content pipeline validation ($name)', ({ pack }) => {
  const KEEPSAKE_IDS = new Set(pack.keepsakes.map((k) => k.id));

  it('every room has at least one stage', () => {
    for (const room of pack.rooms) {
      expect(room.stages.length, `${room.id} has no stages`).toBeGreaterThanOrEqual(1);
    }
  });

  it('every stage has at least two choices', () => {
    for (const room of pack.rooms) {
      room.stages.forEach((stage, i) => {
        expect(
          stage.choices.length,
          `${room.id} stage ${i} has fewer than 2 choices`,
        ).toBeGreaterThanOrEqual(2);
      });
    }
  });

  it('every choice has non-empty text and at least one outcome beat', () => {
    for (const room of pack.rooms) {
      room.stages.forEach((stage, si) => {
        for (const choice of stage.choices) {
          expect(
            choice.text.trim().length,
            `${room.id} stage ${si} choice ${choice.id} has empty text`,
          ).toBeGreaterThan(0);
          expect(
            choice.outcome.length,
            `${room.id} stage ${si} choice ${choice.id} has no outcome beats`,
          ).toBeGreaterThanOrEqual(1);
        }
      });
    }
  });

  it('every choice in a non-gate room has a hint', () => {
    for (const room of pack.rooms) {
      if (room.gate) continue;
      room.stages.forEach((stage, si) => {
        for (const choice of stage.choices) {
          expect(
            choice.hint?.trim().length,
            `${room.id} stage ${si} choice ${choice.id} is missing a hint`,
          ).toBeGreaterThan(0);
        }
      });
    }
  });

  it('every keepsakeId referenced by a choice is a defined keepsake', () => {
    for (const room of pack.rooms) {
      for (const stage of room.stages) {
        for (const choice of stage.choices) {
          if (!choice.keepsakeId) continue;
          expect(
            KEEPSAKE_IDS.has(choice.keepsakeId),
            `${room.id} choice ${choice.id} references unknown keepsakeId ${choice.keepsakeId}`,
          ).toBe(true);
        }
      }
    }
  });

  it('every reflections entry uses a legal tradition value', () => {
    for (const room of pack.rooms) {
      for (const stage of room.stages) {
        for (const choice of stage.choices) {
          if (!choice.reflections) continue;
          for (const reflection of choice.reflections) {
            expect(
              LEGAL_TRADITIONS.has(reflection.tradition),
              `${room.id} choice ${choice.id} has an illegal reflection tradition ${reflection.tradition}`,
            ).toBe(true);
            expect(
              reflection.text.trim().length,
              `${room.id} choice ${choice.id} has an empty reflection text`,
            ).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});
