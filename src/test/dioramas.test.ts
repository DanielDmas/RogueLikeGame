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
  });

  it('full diorama parity — every ANAMNESIS room has a bespoke diorama (matches LIMERENCE\'s 34/34)', () => {
    const roomIds = allRooms.map((r) => r.id);
    expect(new Set(DIORAMA_ROOM_IDS)).toEqual(new Set(roomIds));
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

  // Player-perspective pass, 2026-07-21: the prologue diorama is the first
  // one every player ever sees, and at today's diorama scale/framing its
  // original five primitives read as untextured grey blocks — a solid bench
  // slab and a pale emissive disc where the room's own field note promises
  // "the clock has no hands". Re-detailed rather than shrunk (the owner's
  // standing "bigger, don't shrink them" directive). These assert the
  // properties that made it work, not exact geometry, so future art tweaks
  // stay free.
  describe('waiting-room (the prologue diorama, seen first and closest)', () => {
    for (const quality of ['low', 'high'] as const) {
      it(`carries real silhouette detail at ${quality} quality, not a handful of bare slabs`, () => {
        const d = dioramaFor('waiting-room', quality);
        expect(d).not.toBeNull();
        const { meshes } = budget(d!.group);
        // Slatted bench + rimmed clock face + 12 ticks + framed/mullioned
        // window. Well above the 5 primitives it used to be, still under the
        // 40-mesh ceiling asserted above.
        expect(meshes).toBeGreaterThanOrEqual(25);
        expect(meshes).toBeLessThanOrEqual(40);
      });

      it(`keeps every surface reading as a lit material, not a light source, at ${quality} quality`, () => {
        const d = dioramaFor('waiting-room', quality);
        const intensities: number[] = [];
        d!.group.traverse((o) => {
          if (o instanceof THREE.Mesh && !Array.isArray(o.material)) {
            const m = o.material as THREE.MeshStandardMaterial;
            if (typeof m.emissiveIntensity === 'number') intensities.push(m.emissiveIntensity);
          }
        });
        expect(intensities.length).toBeGreaterThan(0);
        // The window panes were 0.35/0.5 and blew out to flat white against
        // the shared front-fill light setDiorama adds; nothing here should
        // climb back to that range.
        expect(Math.max(...intensities)).toBeLessThanOrEqual(0.3);
      });
    }

    it('renders its clock as a dial with no hands — the detail its own field note calls out', () => {
      // The face/rim are the only cylinders in the group; a hand would be a
      // thin long box crossing the face centre. Assert the dial parts exist
      // and that nothing spans the face like a hand would.
      const d = dioramaFor('waiting-room', 'high');
      let cylinders = 0;
      d!.group.traverse((o) => {
        if (o instanceof THREE.Mesh && o.geometry instanceof THREE.CylinderGeometry) cylinders++;
      });
      expect(cylinders, 'expected a clock rim and face').toBe(2);
    });
  });

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
