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
];

describe('LIMERENCE bespoke room dioramas (F5) — registry, budget, disposal', () => {
  it('every registered diorama id is a real LIMERENCE room id', () => {
    const roomIds = new Set(limerencePack.rooms.map((r) => r.id));
    for (const id of DIORAMA_ROOM_IDS) {
      expect(roomIds.has(id), `diorama registered for unknown room "${id}"`).toBe(true);
    }
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
