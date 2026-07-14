import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { limerencePack } from '../packs/limerence';
import { limerenceDioramaFor } from '../packs/limerence/dioramas';

/** Mirrors src/test/dioramas.test.ts's budget check (spec 07 §Q1) for
 * LIMERENCE's own bespoke dioramas — F5's Tier 1 completion brought this
 * pack from 6 to 18 rooms with a real motif. */
function budget(group: THREE.Group): { meshes: number; lights: number } {
  let meshes = 0;
  let lights = 0;
  group.traverse((o) => {
    if (o instanceof THREE.Mesh) meshes++;
    if (o instanceof THREE.Light) lights++;
  });
  return { meshes, lights };
}

const DIORAMA_ROOM_IDS = [
  'the-read-receipt',
  'just-friends',
  'the-therapist',
  'the-kitchen-table',
  'the-second-account',
  'the-colleague',
  // F5 Tier 1 (12 new)
  'the-front-desk',
  'the-password',
  'the-party',
  'the-forward',
  'the-rumor',
  'the-distance',
  'the-ex',
  'the-confession',
  'the-discovery',
  'the-wedding-eve',
  'the-unsent',
  'the-morning-desk',
  // Eighth session: 5 more, closing part of the gap toward ANAMNESIS's ~22.
  'the-screenshot',
  'the-scoreboard',
  'the-veto',
  'the-drift',
  'the-registry',
  // Ninth session: the last 11 — full 34/34 diorama parity.
  'the-best-friends-girl',
  'the-summer-ends',
  'the-hall-pass',
  'the-rebound',
  'the-unicorn',
  'the-other-side-of-the-door',
  'the-metamour',
  'the-usual-suite',
  'the-usual-room',
  'the-doors-not-opened',
  'the-other-side',
];

describe('LIMERENCE bespoke room dioramas (F5) — registry, budget, disposal', () => {
  it('every registered diorama id is a real LIMERENCE room id', () => {
    const roomIds = new Set(limerencePack.rooms.map((r) => r.id));
    for (const id of DIORAMA_ROOM_IDS) {
      expect(roomIds.has(id), `diorama registered for unknown room "${id}"`).toBe(true);
    }
  });

  it('ninth session: full 34/34 diorama parity — every LIMERENCE room has a bespoke diorama', () => {
    const roomIds = limerencePack.rooms.map((r) => r.id);
    expect(new Set(DIORAMA_ROOM_IDS)).toEqual(new Set(roomIds));
  });

  it('a room with no bespoke diorama falls back to null (act theme alone)', () => {
    expect(limerenceDioramaFor('not-a-real-room-id', 'high')).toBeNull();
  });

  for (const quality of ['low', 'high'] as const) {
    it(`every bespoke diorama builds within budget at ${quality} quality, ticks and disposes without throwing`, () => {
      for (const id of DIORAMA_ROOM_IDS) {
        const d = limerenceDioramaFor(id, quality);
        expect(d, `limerenceDioramaFor(${id}, ${quality}) should not be null`).not.toBeNull();
        if (!d) continue;
        const { meshes, lights } = budget(d.group);
        expect(meshes, `${id} (${quality}) mesh budget`).toBeLessThanOrEqual(40);
        expect(lights, `${id} (${quality}) light budget`).toBeLessThanOrEqual(2);
        expect(() => d.tick(1.4)).not.toThrow();
        expect(() => d.dispose()).not.toThrow();
      }
    });
  }

  it('disposing a diorama twice does not throw (idempotent geometry/material disposal)', () => {
    const d = limerenceDioramaFor('the-morning-desk', 'high');
    expect(d).not.toBeNull();
    d?.dispose();
    expect(() => d?.dispose()).not.toThrow();
  });
});

describe('F5 Tier 2 — LIMERENCE dioramaAccentHooks (marys-room/open-drawer pattern)', () => {
  it('every hook names a real room id and a real choice id on that room\'s first stage', () => {
    const rooms = new Map(limerencePack.rooms.map((r) => [r.id, r]));
    for (const hook of limerencePack.visuals.dioramaAccentHooks) {
      const room = rooms.get(hook.roomId);
      expect(room, `dioramaAccentHooks names unknown room "${hook.roomId}"`).toBeDefined();
      const choiceIds = room!.stages[0].choices.map((c) => c.id);
      expect(choiceIds, `${hook.roomId} has no choice "${hook.choiceId}"`).toContain(hook.choiceId);
    }
  });

  it('every hooked room actually has a bespoke diorama (an accent with nothing to accent is a no-op bug)', () => {
    for (const hook of limerencePack.visuals.dioramaAccentHooks) {
      expect(DIORAMA_ROOM_IDS, `${hook.roomId} is hooked for an accent but has no bespoke diorama`).toContain(hook.roomId);
    }
  });

  it('every hooked room\'s diorama actually implements setAccent (not just inheriting the interface\'s optional shape)', () => {
    const hookedRoomIds = new Set(limerencePack.visuals.dioramaAccentHooks.map((h) => h.roomId));
    for (const roomId of hookedRoomIds) {
      const d = limerenceDioramaFor(roomId, 'high');
      expect(d?.setAccent, `${roomId} is hooked but its diorama has no setAccent`).toBeTypeOf('function');
    }
  });

  it('setAccent(true) then setAccent(false) then dispose() never throws, for every hooked diorama', () => {
    const hookedRoomIds = new Set(limerencePack.visuals.dioramaAccentHooks.map((h) => h.roomId));
    for (const roomId of hookedRoomIds) {
      const d = limerenceDioramaFor(roomId, 'high');
      expect(() => d?.setAccent?.(true)).not.toThrow();
      expect(() => d?.tick(1.4)).not.toThrow();
      expect(() => d?.setAccent?.(false)).not.toThrow();
      expect(() => d?.dispose()).not.toThrow();
    }
  });

  it('covers at least 5 distinct rooms (the review asked for "~6")', () => {
    const distinctRooms = new Set(limerencePack.visuals.dioramaAccentHooks.map((h) => h.roomId));
    expect(distinctRooms.size).toBeGreaterThanOrEqual(5);
  });

  it('the-unsent is hooked on every one of its real letter choices (every choice in that room sends something)', () => {
    const unsent = limerencePack.rooms.find((r) => r.id === 'the-unsent')!;
    const realChoiceIds = unsent.stages[0].choices.map((c) => c.id);
    const hookedIds = limerencePack.visuals.dioramaAccentHooks.filter((h) => h.roomId === 'the-unsent').map((h) => h.choiceId);
    expect(hookedIds.sort()).toEqual(realChoiceIds.sort());
  });
});
