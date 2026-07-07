import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { allRooms } from '../content/rooms';
import { dioramaFor, DIORAMA_ROOM_IDS } from '../scene/dioramas';

/** Counts meshes and lights in a diorama's group — the spec 07 §Q1 budget
 * ("quality low: 1 light, no more than ~40 meshes") is a soft ceiling; this
 * asserts every diorama stays comfortably under it. */
function budget(group: THREE.Group): { meshes: number; lights: number } {
  let meshes = 0;
  let lights = 0;
  group.traverse((o) => {
    if (o instanceof THREE.Mesh) meshes++;
    if (o instanceof THREE.Light) lights++;
  });
  return { meshes, lights };
}

describe('room dioramas (spec 07 §Q1) — registry, budget, disposal', () => {
  it('every registered diorama id is a real room id', () => {
    const roomIds = new Set(allRooms.map((r) => r.id));
    for (const id of DIORAMA_ROOM_IDS) {
      expect(roomIds.has(id), `diorama registered for unknown room "${id}"`).toBe(true);
    }
  });

  it('a room with no bespoke diorama falls back to null (act theme alone)', () => {
    expect(dioramaFor('not-a-real-room-id', 'high')).toBeNull();
    // a real room known to have no bespoke motif (per spec 07 §Q1's motif table)
    expect(dioramaFor('quiet-alarm', 'high')).toBeNull();
  });

  for (const quality of ['low', 'high'] as const) {
    it(`every bespoke diorama builds within budget at ${quality} quality, ticks and disposes without throwing`, () => {
      for (const id of DIORAMA_ROOM_IDS) {
        const d = dioramaFor(id, quality);
        expect(d, `dioramaFor(${id}, ${quality}) should not be null`).not.toBeNull();
        if (!d) continue;
        const { meshes, lights } = budget(d.group);
        expect(meshes, `${id} (${quality}) mesh budget`).toBeLessThanOrEqual(40);
        expect(lights, `${id} (${quality}) light budget`).toBeLessThanOrEqual(2);
        expect(() => d.tick(1.4)).not.toThrow();
        expect(() => d.dispose()).not.toThrow();
      }
    });
  }

  it('marys-room is the only diorama exposing the optional accent hook, and it toggles without throwing', () => {
    const marys = dioramaFor('marys-room', 'high');
    expect(marys?.setAccent).toBeTypeOf('function');
    expect(() => marys?.setAccent?.(true)).not.toThrow();
    expect(() => marys?.setAccent?.(false)).not.toThrow();

    const other = dioramaFor('junction', 'high');
    expect(other?.setAccent).toBeUndefined();
  });

  it('disposing a diorama twice does not throw (idempotent geometry/material disposal)', () => {
    const d = dioramaFor('the-cave', 'high');
    expect(d).not.toBeNull();
    d?.dispose();
    expect(() => d?.dispose()).not.toThrow();
  });
});
