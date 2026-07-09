import { describe, expect, it } from 'vitest';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';
import type { ContentPack } from '../packs/types';
import { newRun } from '../engine/gameState';

const packs: { name: string; pack: ContentPack }[] = [
  { name: 'anamnesis', pack: anamnesisPack },
  { name: 'limerence', pack: limerencePack },
];

describe.each(packs)('ContentPack conformance — $name', ({ pack }) => {
  const roomIds = new Set(pack.rooms.map((r) => r.id));
  const endingIds = new Set(pack.endings.map((e) => e.id));

  it('room ids are unique', () => {
    expect(pack.rooms.length).toBe(roomIds.size);
  });

  it('ending ids are unique', () => {
    expect(pack.endings.length).toBe(endingIds.size);
  });

  it('the prologue room exists', () => {
    expect(roomIds.has(pack.graph.prologue)).toBe(true);
  });

  it('every act pool is a subset of the room set', () => {
    for (const ids of Object.values(pack.graph.actPools)) {
      for (const id of ids) expect(roomIds.has(id)).toBe(true);
    }
  });

  it('every gate room exists', () => {
    for (const id of Object.values(pack.graph.gates)) {
      expect(roomIds.has(id)).toBe(true);
    }
  });

  it('act4Sequence and understorySequence rooms all exist', () => {
    for (const id of [...pack.graph.act4Sequence, ...pack.graph.understorySequence]) {
      expect(roomIds.has(id)).toBe(true);
    }
  });

  it('optionalPerAct never exceeds its pool size', () => {
    for (const act of [1, 2, 3] as const) {
      expect(pack.graph.optionalPerAct[act]).toBeLessThan(pack.graph.actPools[act].length);
    }
  });

  it('hooks.finalGateId and hooks.lastMessageId are real rooms', () => {
    expect(roomIds.has(pack.hooks.finalGateId)).toBe(true);
    expect(roomIds.has(pack.hooks.lastMessageId)).toBe(true);
  });

  it('every dioramaAccentHooks entry names a real room', () => {
    for (const hook of pack.visuals.dioramaAccentHooks) {
      expect(roomIds.has(hook.roomId)).toBe(true);
    }
  });

  it('every keepsake trigger points at a defined keepsake', () => {
    const keepsakeIds = new Set(pack.keepsakes.map((k) => k.id));
    for (const id of Object.values(pack.keepsakeTriggers)) {
      expect(keepsakeIds.has(id)).toBe(true);
    }
  });

  it('every keepsake has an icon', () => {
    for (const k of pack.keepsakes) {
      expect(pack.keepsakeIcons[k.id]).toBeTruthy();
    }
  });

  it('every room has a door icon', () => {
    for (const room of pack.rooms) {
      const icon = pack.visuals.iconFor(room.id);
      expect(icon, `room ${room.id} missing an icon`).toBeDefined();
      expect(icon).toContain('<svg');
    }
  });

  it('this pack has at least one bespoke room diorama', () => {
    const withDiorama = pack.rooms.filter((r) => pack.visuals.dioramaFor(r.id, 'high') !== null);
    expect(withDiorama.length, `${pack.meta.id} should give at least one signature room its own diorama`).toBeGreaterThan(0);
  });

  it('every ending has an icon', () => {
    for (const ending of pack.endings) {
      expect(pack.visuals.endingIcons[ending.id], `ending ${ending.id} missing an icon`).toBeDefined();
      expect(pack.visuals.endingIcons[ending.id]).toContain('<svg');
    }
  });

  it('epiphany ids are unique and non-empty', () => {
    const ids = pack.epiphanies.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThan(0);
  });

  it('meta.id is a lowercase slug (storage-namespace safe)', () => {
    expect(pack.meta.id).toMatch(/^[a-z][a-z0-9-]*$/);
  });

  it('every room accent key names a real room', () => {
    for (const id of Object.keys(pack.audio.roomAccents)) {
      expect(roomIds.has(id)).toBe(true);
    }
  });

  it('the HUD hearts aria-label/tooltip use this pack’s own vocabulary (Trust for LIMERENCE, not ANAMNESIS’s "grip on reality")', () => {
    if (pack.meta.id === 'limerence') {
      expect(pack.skin.heartsAriaLabel).toBe('Trust');
      expect(pack.skin.heartsTooltip).not.toMatch(/grip on reality/i);
      expect(pack.skin.lucidityTooltip).toMatch(/Clarity/);
    }
  });

  it('every act (1-4) has a non-empty intro announcement', () => {
    for (const act of [1, 2, 3, 4]) {
      const intro = pack.guide.actIntroText(act);
      expect(intro, `act ${act} has no intro text`).toBeTruthy();
    }
  });

  it('doorBark actually varies across a run (not a single static line)', () => {
    const run = newRun();
    const lines = new Set<string>();
    for (let i = 0; i < 8; i++) {
      lines.add(pack.guide.doorBark({ ...run, visited: Array(i).fill('x'), act: 1 }, 0, 2, false));
    }
    expect(lines.size, 'doorBark should cycle through more than one line').toBeGreaterThan(1);
  });

  it('endingRules.evaluate/endingsTotal/epitaphLines are callable without throwing', () => {
    expect(() => pack.endingRules.endingsTotal([])).not.toThrow();
    expect(() => pack.endingRules.epitaphLines([])).not.toThrow();
  });

  it('registerText is callable', () => {
    expect(() => pack.registerText()).not.toThrow();
  });
});
