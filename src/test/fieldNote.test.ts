import { describe, expect, it } from 'vitest';
import { renderEmphasis } from '../ui/fieldNote';
import { allRooms } from '../content/rooms';
import { endings } from '../content/endings';

describe('renderEmphasis — field-note bold markup', () => {
  it('turns **bold** into <strong>', () => {
    expect(renderEmphasis('plain **crux** text')).toBe('plain <strong>crux</strong> text');
  });

  it('handles multiple bold spans in one body', () => {
    expect(renderEmphasis('**a** middle **b**')).toBe('<strong>a</strong> middle <strong>b</strong>');
  });

  it('escapes HTML-significant characters so field-note bodies can never inject markup', () => {
    expect(renderEmphasis('a < b & c > d')).toBe('a &lt; b &amp; c &gt; d');
  });

  it('leaves text with no bold markers untouched (besides escaping)', () => {
    expect(renderEmphasis('nothing special here')).toBe('nothing special here');
  });
});

describe('field notes — every English v2 body highlights a crux sentence', () => {
  it('every room field note body contains at least one **bold** span', () => {
    for (const room of allRooms) {
      if (!room.fieldNote) continue;
      expect(room.fieldNote.body, `room ${room.id} field note has no bold crux sentence`).toMatch(/\*\*.+\*\*/);
    }
  });

  it('every ending field note body contains at least one **bold** span', () => {
    for (const ending of endings) {
      if (!ending.fieldNote) continue;
      expect(ending.fieldNote.body, `ending ${ending.id} field note has no bold crux sentence`).toMatch(/\*\*.+\*\*/);
    }
  });
});
