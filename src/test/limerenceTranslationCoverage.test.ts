import { describe, expect, it, afterEach } from 'vitest';
import { limerencePack } from '../packs/limerence';
import '../packs/limerence/text'; // registers cs (+ future fa/de/fr) room/ending translation packs
import { registeredKeys, setLocale, t } from '../engine/text/resolver';
import {
  endingBeatKey,
  endingEpitaphKey,
  endingNoteBodyKey,
  endingNoteThinkersKey,
  endingNoteTitleKey,
  endingTitleKey,
  epiphanyKey,
  keepsakeKey,
  roomBeatKey,
  roomChoiceHintKey,
  roomChoiceOutcomeKey,
  roomChoiceTextKey,
  roomExplanationKey,
  roomNoteBodyKey,
  roomNoteThinkersKey,
  roomNoteTitleKey,
} from '../engine/text/keys';

// LIMERENCE's own deep-translation-coverage sweep, mirroring
// translationCoverage.test.ts's ANAMNESIS checks. Scoped to the languages
// whose LIMERENCE passes (prologue through Understory, endings, keepsakes,
// epiphanies, and guide/advisory copy) are complete as of this test's
// authoring; fr is not yet translated for this pack, so it is deliberately
// absent from LANGS below rather than listed as failing. Extend LANGS as
// each future LIMERENCE language pass lands.
const LANGS = ['cs', 'fa', 'de'] as const;

describe('LIMERENCE deep translation coverage — every room beat/choice/field-note/ending/epiphany/keepsake (v2)', () => {
  afterEach(() => setLocale('en', 'v2'));

  for (const lang of LANGS) {
    it(`every room's stage beats (string beats) are translated to ${lang}`, () => {
      setLocale(lang, 'v2');
      const missing: string[] = [];
      for (const room of limerencePack.rooms) {
        room.stages.forEach((stage, si) => {
          stage.beats.forEach((beat, bi) => {
            if (typeof beat !== 'string') return; // dynamic/function beats: out of scope for this pass
            const resolved = t(roomBeatKey(room.id, si, bi), beat);
            if (resolved === beat) missing.push(`${room.id}.stage${si}.beat${bi}`);
          });
        });
      }
      expect(missing, `missing ${lang} beat translations:\n${missing.join('\n')}`).toEqual([]);
    });

    it(`every room's choice text/hint/outcomes (string outcomes) are translated to ${lang}`, () => {
      setLocale(lang, 'v2');
      const missing: string[] = [];
      for (const room of limerencePack.rooms) {
        for (const stage of room.stages) {
          for (const choice of stage.choices) {
            const text = t(roomChoiceTextKey(room.id, choice.id), choice.text);
            if (text === choice.text) missing.push(`${room.id}.choice.${choice.id}.text`);
            if (choice.hint) {
              const hint = t(roomChoiceHintKey(room.id, choice.id), choice.hint);
              if (hint === choice.hint) missing.push(`${room.id}.choice.${choice.id}.hint`);
            }
            choice.outcome.forEach((beat, oi) => {
              if (typeof beat !== 'string') return;
              const resolved = t(roomChoiceOutcomeKey(room.id, choice.id, oi), beat);
              if (resolved === beat) missing.push(`${room.id}.choice.${choice.id}.outcome${oi}`);
            });
          }
        }
      }
      expect(missing, `missing ${lang} choice translations:\n${missing.join('\n')}`).toEqual([]);
    });

    it(`every room stage's plain-language explanation is translated to ${lang}`, () => {
      setLocale(lang, 'v2');
      const missing: string[] = [];
      for (const room of limerencePack.rooms) {
        room.stages.forEach((stage, si) => {
          if (!stage.explanation) return;
          const resolved = t(roomExplanationKey(room.id, si), stage.explanation);
          if (resolved === stage.explanation) missing.push(`${room.id}.stage${si}.explanation`);
        });
      }
      expect(missing, `missing ${lang} explanation translations:\n${missing.join('\n')}`).toEqual([]);
    });

    it(`every room's field note (title/thinkers/body) is translated to ${lang}`, () => {
      setLocale(lang, 'v2');
      const registered = new Set(registeredKeys('v2', lang));
      const missing: string[] = [];
      for (const room of limerencePack.rooms) {
        if (!room.fieldNote) continue;
        const body = t(roomNoteBodyKey(room.id), room.fieldNote.body);
        // title/thinkers legitimately resolve identical to English for citations
        // and proper-noun terms (researcher names, book titles, "Limerence" the
        // term itself) — check registration presence instead of value inequality.
        if (!registered.has(roomNoteTitleKey(room.id))) missing.push(`${room.id}.note.title`);
        if (!registered.has(roomNoteThinkersKey(room.id))) missing.push(`${room.id}.note.thinkers`);
        if (body === room.fieldNote.body) missing.push(`${room.id}.note.body`);
      }
      expect(missing, `missing ${lang} field-note translations:\n${missing.join('\n')}`).toEqual([]);
    });

    it(`every ending's title/epitaph/beats are translated to ${lang}`, () => {
      setLocale(lang, 'v2');
      const missing: string[] = [];
      for (const ending of limerencePack.endings) {
        const title = t(endingTitleKey(ending.id), ending.title);
        if (title === ending.title) missing.push(`ending.${ending.id}.title`);
        if (ending.epitaph) {
          const epitaph = t(endingEpitaphKey(ending.id), ending.epitaph);
          if (epitaph === ending.epitaph) missing.push(`ending.${ending.id}.epitaph`);
        }
        ending.beats.forEach((beat, bi) => {
          if (typeof beat !== 'string') return;
          const resolved = t(endingBeatKey(ending.id, bi), beat);
          if (resolved === beat) missing.push(`ending.${ending.id}.beat${bi}`);
        });
      }
      expect(missing, `missing ${lang} ending translations:\n${missing.join('\n')}`).toEqual([]);
    });

    it(`every ending's field note (title/thinkers/body) is translated to ${lang}`, () => {
      setLocale(lang, 'v2');
      const registered = new Set(registeredKeys('v2', lang));
      const missing: string[] = [];
      for (const ending of limerencePack.endings) {
        if (!ending.fieldNote) continue;
        const body = t(endingNoteBodyKey(ending.id), ending.fieldNote.body);
        // title/thinkers may legitimately resolve identical to English for
        // citations and proper-noun terms — check registration presence.
        if (!registered.has(endingNoteTitleKey(ending.id))) missing.push(`ending.${ending.id}.note.title`);
        if (!registered.has(endingNoteThinkersKey(ending.id))) missing.push(`ending.${ending.id}.note.thinkers`);
        if (body === ending.fieldNote.body) missing.push(`ending.${ending.id}.note.body`);
      }
      expect(missing, `missing ${lang} ending field-note translations:\n${missing.join('\n')}`).toEqual([]);
    });

    it(`every keepsake's name/origin is translated to ${lang}`, () => {
      setLocale(lang, 'v2');
      const missing: string[] = [];
      for (const keepsake of limerencePack.keepsakes) {
        const name = t(keepsakeKey(keepsake.id, 'name'), keepsake.name);
        const origin = t(keepsakeKey(keepsake.id, 'origin'), keepsake.origin);
        if (name === keepsake.name) missing.push(`keepsake.${keepsake.id}.name`);
        if (origin === keepsake.origin) missing.push(`keepsake.${keepsake.id}.origin`);
      }
      expect(missing, `missing ${lang} keepsake translations:\n${missing.join('\n')}`).toEqual([]);
    });

    it(`every epiphany is translated to ${lang}`, () => {
      setLocale(lang, 'v2');
      const missing: string[] = [];
      for (const epiphany of limerencePack.epiphanies) {
        const resolved = t(epiphanyKey(epiphany.id), epiphany.fallback);
        if (resolved === epiphany.fallback) missing.push(`epiphany.${epiphany.id}`);
      }
      expect(missing, `missing ${lang} epiphany translations:\n${missing.join('\n')}`).toEqual([]);
    });
  }
});
