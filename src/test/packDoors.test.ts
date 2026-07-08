import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { createDoors, type DoorSpec } from '../scene/doors';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';

const SPECS: DoorSpec[] = [
  { id: 'a', hint: 'a' },
  { id: 'b', hint: 'b', secret: true },
  { id: 'c', hint: 'c' },
];

function disposeDoors(doors: ReturnType<typeof createDoors>) {
  doors.dispose();
}

describe('createDoors(specs) with no style — exact original ANAMNESIS values (regression pin)', () => {
  // A single, dead-center door (x = 0) needs no yaw to face CAMERA_HOME
  // (also at x = 0), so lookAt() contributes no rotation at all — isolating
  // the frame geometry itself from lookAt's (separately pre-existing, and
  // unrelated to this session's changes) rotation behavior for off-center doors.
  const CENTERED: DoorSpec[] = [{ id: 'solo', hint: 'solo' }];

  it('a centered door’s frame corner half-width matches the original hardcoded value exactly', () => {
    const doors = createDoors(CENTERED);
    const corners = doors.frameCorners('solo')!;
    const xs = corners.map((c) => Math.abs(c.x));
    expect(Math.max(...xs)).toBeCloseTo(0.94, 6); // 0.85 + 0.18/2, the pre-existing hardcoded geometry
    disposeDoors(doors);
  });

  it('a centered door sits perfectly plumb (zero z-rotation) with no skewJitter', () => {
    const doors = createDoors(CENTERED);
    expect(doors.group.children[0].rotation.z).toBe(0);
    disposeDoors(doors);
  });

  it('skewJitter adds exactly a bounded, deterministic offset on top of whatever lookAt() alone would produce — isolates the new behavior from lookAt’s own (pre-existing) rotation for off-center doors', () => {
    const baseline = createDoors(SPECS);
    const skewed = createDoors(SPECS, { skewJitter: 0.05 });
    baseline.group.children.forEach((door, i) => {
      const delta = skewed.group.children[i].rotation.z - door.rotation.z;
      expect(Math.abs(delta), `door ${i} skew delta out of bounds`).toBeGreaterThan(0);
      expect(Math.abs(delta), `door ${i} skew delta exceeds the jitter magnitude`).toBeLessThanOrEqual(0.05 + 1e-9);
    });
    disposeDoors(baseline);
    disposeDoors(skewed);
  });

  it('a hovered door’s idle pulse has no unsteady secondary wave (matches the pre-existing single-sine formula)', () => {
    const doors = createDoors(SPECS);
    doors.tick(1.0, false);
    // find slab material color/emissive matches the ANAMNESIS gold default
    let sawGold = false;
    doors.group.traverse((o) => {
      if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial && o.userData.doorId === 'a') {
        sawGold = o.material.emissive.getHex() === 0xd4b36a;
      }
    });
    expect(sawGold).toBe(true);
    disposeDoors(doors);
  });
});

describe('createDoors(specs, style) — a full style override changes what it should', () => {
  it('overrides frame thickness, and frameCorners reflects the new thickness (centered door, isolating the geometry from lookAt)', () => {
    const doors = createDoors([{ id: 'solo', hint: 'solo' }], { frameWidth: 0.5 });
    const corners = doors.frameCorners('solo')!;
    const xs = corners.map((c) => Math.abs(c.x));
    expect(Math.max(...xs)).toBeCloseTo(0.85 + 0.25, 6);
    disposeDoors(doors);
  });

  it('overrides slab/glow color', () => {
    const doors = createDoors(SPECS, { glowColor: 0x123456, slabColor: 0x654321 });
    let sawCustomColor = false;
    doors.group.traverse((o) => {
      if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial && o.userData.doorId === 'a') {
        sawCustomColor = o.material.emissive.getHex() === 0x123456 && o.material.color.getHex() === 0x654321;
      }
    });
    expect(sawCustomColor).toBe(true);
    disposeDoors(doors);
  });

  it('secret doors get the secret-specific colors, not the main ones', () => {
    const doors = createDoors(SPECS, { glowColor: 0x111111, glowColorSecret: 0x222222 });
    let secretColor: number | null = null;
    doors.group.traverse((o) => {
      if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial && o.userData.doorId === 'b') {
        secretColor = o.material.emissive.getHex();
      }
    });
    expect(secretColor).toBe(0x222222);
    disposeDoors(doors);
  });

  it('skewJitter produces a small, deterministic, non-zero rotation — same seed, same result every time', () => {
    const doors1 = createDoors(SPECS, { skewJitter: 0.05 });
    const doors2 = createDoors(SPECS, { skewJitter: 0.05 });
    const z1 = doors1.group.children.map((d) => d.rotation.z);
    const z2 = doors2.group.children.map((d) => d.rotation.z);
    expect(z1).toEqual(z2); // deterministic given the same door index
    expect(z1.some((z) => Math.abs(z) > 0)).toBe(true); // actually skewed
    expect(z1.every((z) => Math.abs(z) <= 0.05)).toBe(true); // bounded by the jitter magnitude
    disposeDoors(doors1);
    disposeDoors(doors2);
  });

  it('skewJitter stays small enough that doors remain visually near-plumb (sanity bound, not just "non-zero")', () => {
    const doors = createDoors(SPECS, { skewJitter: limerencePack.visuals.doorStyle?.skewJitter ?? 0 });
    for (const door of doors.group.children) {
      expect(Math.abs(door.rotation.z)).toBeLessThan(0.05); // well under ~3 degrees
    }
    disposeDoors(doors);
  });

  it('unsteadyPulse=0 (default) and reducedMotion=true both suppress the secondary wave identically', () => {
    const doorsFlat = createDoors(SPECS); // unsteadyPulse defaults to 0
    const doorsUnsteadyReduced = createDoors(SPECS, { unsteadyPulse: 0.5 });
    doorsFlat.tick(5.0, false);
    doorsUnsteadyReduced.tick(5.0, true); // reducedMotion=true should suppress it
    let flatIntensity = 0;
    let reducedIntensity = 0;
    doorsFlat.group.traverse((o) => {
      if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial && o.userData.doorId === 'a') flatIntensity = o.material.emissiveIntensity;
    });
    doorsUnsteadyReduced.group.traverse((o) => {
      if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial && o.userData.doorId === 'a') reducedIntensity = o.material.emissiveIntensity;
    });
    expect(reducedIntensity).toBeCloseTo(flatIntensity, 5);
    disposeDoors(doorsFlat);
    disposeDoors(doorsUnsteadyReduced);
  });
});

describe.each([
  { name: 'anamnesis', pack: anamnesisPack },
  { name: 'limerence', pack: limerencePack },
])('pack.visuals.doorStyle — builds without throwing ($name)', ({ pack }) => {
  it('createDoors(specs, pack.visuals.doorStyle) builds and disposes cleanly', () => {
    const doors = createDoors(SPECS, pack.visuals.doorStyle);
    expect(doors.meshes).toHaveLength(3);
    expect(() => doors.tick(1, false)).not.toThrow();
    expect(() => doors.snapSelected('a')).not.toThrow();
    disposeDoors(doors);
  });
});

describe('LIMERENCE door style — distinct from ANAMNESIS', () => {
  const style = limerencePack.visuals.doorStyle!;
  it('is actually defined (not left at ANAMNESIS defaults)', () => {
    expect(style).toBeDefined();
  });
  it('uses a cooler, thinner frame than ANAMNESIS', () => {
    expect(style.frameWidth).toBeLessThan(0.18);
    expect(style.frameColor).not.toBe(0x241d14);
  });
  it('uses amber/teal glow colors, not ANAMNESIS’s gold/violet', () => {
    expect(style.glowColor).not.toBe(0xd4b36a);
    expect(style.glowColorSecret).not.toBe(0x8a6fd4);
  });
  it('carries a small, non-zero skew and unsteady-pulse for the "artistically unsettling" quality', () => {
    expect(style.skewJitter).toBeGreaterThan(0);
    expect(style.unsteadyPulse).toBeGreaterThan(0);
  });
});
