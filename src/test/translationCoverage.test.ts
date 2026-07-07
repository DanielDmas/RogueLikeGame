import { describe, expect, it, afterEach } from 'vitest';
import { allRooms } from '../content/rooms';
import { endings } from '../content/endings';
import '../content/text'; // registers v1-en + cs + fa + all room/ending translation packs
import { setLocale } from '../content/text/resolver';
import { t } from '../content/text/resolver';
import {
  endingBeatKey,
  endingNoteBodyKey,
  endingNoteThinkersKey,
  endingNoteTitleKey,
  roomBeatKey,
  roomChoiceHintKey,
  roomChoiceOutcomeKey,
  roomChoiceTextKey,
  roomExplanationKey,
  roomNoteBodyKey,
  roomNoteThinkersKey,
  roomNoteTitleKey,
} from '../content/text/keys';

const LANGS = ['cs', 'fa'] as const;

describe('deep translation coverage — every room beat/choice/field-note, both languages (v2)', () => {
  afterEach(() => setLocale('en', 'v2'));

  for (const lang of LANGS) {
    it(`every room's stage beats (string beats) are translated to ${lang}`, () => {
      setLocale(lang, 'v2');
      const missing: string[] = [];
      for (const room of allRooms) {
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
      for (const room of allRooms) {
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
      for (const room of allRooms) {
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
      const missing: string[] = [];
      for (const room of allRooms) {
        if (!room.fieldNote) continue;
        const title = t(roomNoteTitleKey(room.id), room.fieldNote.title);
        const thinkers = t(roomNoteThinkersKey(room.id), room.fieldNote.thinkers);
        const body = t(roomNoteBodyKey(room.id), room.fieldNote.body);
        if (title === room.fieldNote.title) missing.push(`${room.id}.note.title`);
        if (thinkers === room.fieldNote.thinkers) missing.push(`${room.id}.note.thinkers`);
        if (body === room.fieldNote.body) missing.push(`${room.id}.note.body`);
      }
      expect(missing, `missing ${lang} field-note translations:\n${missing.join('\n')}`).toEqual([]);
    });

    it(`every ending's beats (string beats) are translated to ${lang}`, () => {
      setLocale(lang, 'v2');
      const missing: string[] = [];
      for (const ending of endings) {
        ending.beats.forEach((beat, bi) => {
          if (typeof beat !== 'string') return;
          const resolved = t(endingBeatKey(ending.id, bi), beat);
          if (resolved === beat) missing.push(`ending.${ending.id}.beat${bi}`);
        });
      }
      expect(missing, `missing ${lang} ending beat translations:\n${missing.join('\n')}`).toEqual([]);
    });

    it(`every ending's field note (title/thinkers/body) is translated to ${lang}`, () => {
      setLocale(lang, 'v2');
      const missing: string[] = [];
      for (const ending of endings) {
        if (!ending.fieldNote) continue;
        const title = t(endingNoteTitleKey(ending.id), ending.fieldNote.title);
        const thinkers = t(endingNoteThinkersKey(ending.id), ending.fieldNote.thinkers);
        const body = t(endingNoteBodyKey(ending.id), ending.fieldNote.body);
        if (title === ending.fieldNote.title) missing.push(`ending.${ending.id}.note.title`);
        if (thinkers === ending.fieldNote.thinkers) missing.push(`ending.${ending.id}.note.thinkers`);
        if (body === ending.fieldNote.body) missing.push(`ending.${ending.id}.note.body`);
      }
      expect(missing, `missing ${lang} ending field-note translations:\n${missing.join('\n')}`).toEqual([]);
    });
  }
});
