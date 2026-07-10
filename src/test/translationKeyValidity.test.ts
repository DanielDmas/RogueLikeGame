import { describe, expect, it } from 'vitest';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';
import type { ContentPack } from '../packs/types';
import { registeredKeys } from '../engine/text/resolver';
import {
  roomTitleKey,
  roomDoorHintKey,
  roomTeaserKey,
  roomBeatKey,
  roomChoiceHintKey,
  roomChoiceOutcomeKey,
  roomChoiceTextKey,
  roomExplanationKey,
  roomNoteBodyKey,
  roomNoteThinkersKey,
  roomNoteTitleKey,
  endingBeatKey,
  endingEpitaphKey,
  endingNoteBodyKey,
  endingNoteThinkersKey,
  endingNoteTitleKey,
  endingTitleKey,
  reflectionKey,
} from '../engine/text/keys';

/**
 * Dead/mistyped-key audit for the translation catalog — the inverse of
 * translationCoverage.test.ts (which checks "is every real string
 * translated?"). This checks "does every REGISTERED translation actually
 * point at real content?" A translator who copies a room/choice id wrong
 * (e.g. 'the-read-recipt') registers a key that `t()` will simply never
 * look up — no error, no warning, it just silently falls back to English
 * forever. With translation work landing across many files by many hands,
 * this is the only thing that would ever catch that class of typo.
 *
 * Scope: room/ending content keys only (beats, choice text/hint/outcome,
 * explanations, field notes, reflections, epitaphs) — the bulk of
 * translation volume and typo risk. UI/guide/keepsake/epiphany keys are a
 * much smaller, lower-risk vocabulary and are covered by their own
 * dedicated tests elsewhere (uiKeyCoverage.test.ts, crossPackLeaks.test.ts).
 */

const packs: ContentPack[] = [anamnesisPack, limerencePack];

function validContentKeysFor(pack: ContentPack): Set<string> {
  const keys = new Set<string>();
  for (const room of pack.rooms) {
    keys.add(roomTitleKey(room.id));
    keys.add(roomDoorHintKey(room.id));
    keys.add(roomTeaserKey(room.id));
    keys.add(roomNoteTitleKey(room.id));
    keys.add(roomNoteThinkersKey(room.id));
    keys.add(roomNoteBodyKey(room.id));
    room.stages.forEach((stage, si) => {
      stage.beats.forEach((_beat, bi) => keys.add(roomBeatKey(room.id, si, bi)));
      keys.add(roomExplanationKey(room.id, si));
      for (const choice of stage.choices) {
        keys.add(roomChoiceTextKey(room.id, choice.id));
        keys.add(roomChoiceHintKey(room.id, choice.id));
        choice.outcome.forEach((_beat, oi) => keys.add(roomChoiceOutcomeKey(room.id, choice.id, oi)));
        for (const reflection of choice.reflections ?? []) {
          keys.add(reflectionKey(room.id, choice.id, reflection.tradition));
        }
      }
    });
  }
  for (const ending of pack.endings) {
    keys.add(endingTitleKey(ending.id));
    keys.add(endingEpitaphKey(ending.id));
    ending.beats.forEach((_beat, bi) => keys.add(endingBeatKey(ending.id, bi)));
    if (ending.fieldNote) {
      keys.add(endingNoteTitleKey(ending.id));
      keys.add(endingNoteThinkersKey(ending.id));
      keys.add(endingNoteBodyKey(ending.id));
    }
  }
  return keys;
}

describe('translation key validity — every registered content key points at real room/choice/ending content', () => {
  const allValidKeys = new Set<string>();
  for (const pack of packs) for (const key of validContentKeysFor(pack)) allValidKeys.add(key);

  const LANGS = ['cs', 'fa', 'de', 'fr'] as const;
  const CONTENT_PREFIX = /^(room\.|ending\.|reflection\.)/;

  for (const lang of LANGS) {
    it(`every registered v2/${lang} content key exists in some pack's actual room/choice/ending structure`, () => {
      const registered = registeredKeys('v2', lang).filter((k) => CONTENT_PREFIX.test(k));
      const dangling = registered.filter((k) => !allValidKeys.has(k));
      expect(dangling, `dangling/mistyped ${lang} translation keys (never read by any pack):\n${dangling.join('\n')}`).toEqual([]);
    });
  }

  it('sanity: found a substantial number of valid keys (the scan itself is working)', () => {
    expect(allValidKeys.size).toBeGreaterThan(500);
  });
});
