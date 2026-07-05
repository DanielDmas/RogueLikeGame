import { describe, expect, it, afterEach } from 'vitest';
import '../content/text'; // registers cs/fa packs
import { setLocale } from '../content/text/resolver';
import { translateFieldNoteForCodex } from '../ui/overlays';
import { allRooms } from '../content/rooms';
import { endings } from '../content/endings';

describe('translateFieldNoteForCodex — regression test for the codex language bug', () => {
  afterEach(() => setLocale('en', 'v2'));

  it('translates a room field note into Czech (previously fell back to English)', () => {
    setLocale('cs', 'v2');
    const room = allRooms.find((r) => r.id === 'wallet')!;
    const translated = translateFieldNoteForCodex('wallet', room.fieldNote!, false);
    expect(translated.title).not.toBe(room.fieldNote!.title);
    expect(translated.thinkers).not.toBe(room.fieldNote!.thinkers);
    expect(translated.body).not.toBe(room.fieldNote!.body);
  });

  it('translates a room field note into Farsi', () => {
    setLocale('fa', 'v2');
    const room = allRooms.find((r) => r.id === 'wallet')!;
    const translated = translateFieldNoteForCodex('wallet', room.fieldNote!, false);
    expect(translated.body).not.toBe(room.fieldNote!.body);
  });

  it('translates an ending field note (id carries the "ending:" prefix)', () => {
    setLocale('cs', 'v2');
    const ending = endings.find((e) => e.id === 'return')!;
    const translated = translateFieldNoteForCodex('ending:return', ending.fieldNote!, true);
    expect(translated.title).not.toBe(ending.fieldNote!.title);
    expect(translated.body).not.toBe(ending.fieldNote!.body);
  });

  it('leaves the last-message synthetic note untouched (it is already translated/personal)', () => {
    setLocale('cs', 'v2');
    const note = { title: 'x', thinkers: 'sender: you', body: 'already resolved text' };
    expect(translateFieldNoteForCodex('last-message', note, false)).toEqual(note);
  });

  it('English locale returns the same text as the source (no accidental transformation)', () => {
    setLocale('en', 'v2');
    const room = allRooms.find((r) => r.id === 'wallet')!;
    const translated = translateFieldNoteForCodex('wallet', room.fieldNote!, false);
    expect(translated).toEqual(room.fieldNote);
  });
});
