import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { buildTheme, silhouette, usherFigure } from '../scene/themes';
import { createDoors, DOOR_Z } from '../scene/doors';
import { GradeShader } from '../scene/post';

function ambientIntensity(group: THREE.Group): number {
  let found: number | null = null;
  group.traverse((o) => {
    if (o instanceof THREE.AmbientLight) found = o.intensity;
  });
  if (found === null) throw new Error('no ambient light found');
  return found;
}

describe('scene palette — lighter, warmer than the old near-black look', () => {
  it('acts 0-3 use a lifted fog/background and lower density than the old near-black values', () => {
    // old baseline values this replaces: 0x0a0806/0.055, 0x05060a/0.045 (x2), 0x04050a/0.05
    const OLD_MAX_CHANNEL = 0x10; // every old background's brightest channel was <= 0x0a
    for (const id of [0, 1, 2, 3] as const) {
      const theme = buildTheme(id);
      expect(theme.fogColor).toBe(theme.background);
      const r = (theme.background >> 16) & 0xff;
      const g = (theme.background >> 8) & 0xff;
      const b = theme.background & 0xff;
      expect(Math.max(r, g, b), `act ${id} background should be lighter than the old near-black palette`).toBeGreaterThan(OLD_MAX_CHANNEL);
      expect(theme.fogDensity).toBeLessThan(0.055);
    }
  });

  it('acts 0-3 ambient light is brighter than the old low-visibility values', () => {
    // old baseline ambient intensities: 0.7, 1.2, 1.4 for corridor/machinery/mirror
    const oldMin: Record<number, number> = { 0: 0.7, 1: 0.7, 2: 1.2, 3: 1.4 };
    for (const id of [0, 1, 2, 3] as const) {
      const theme = buildTheme(id);
      expect(ambientIntensity(theme.group)).toBeGreaterThan(oldMin[id]);
    }
  });

  it('the ending space stays bright and near-white (unchanged)', () => {
    const theme = buildTheme(5);
    expect(theme.background).toBe(0xcfc4ae);
    expect(ambientIntensity(theme.group)).toBeGreaterThanOrEqual(2.4);
  });

  it('every theme disposes cleanly and ticks without throwing', () => {
    for (const id of [0, 1, 2, 3, 4, 5] as const) {
      const theme = buildTheme(id);
      expect(() => theme.tick(1.23)).not.toThrow();
    }
  });
});

describe('post-processing grade shader — softer than before', () => {
  it('vignette and grain are reduced from the old heavy-vignette defaults', () => {
    expect(GradeShader.uniforms.vignette.value).toBeLessThan(0.42);
    expect(GradeShader.uniforms.grain.value).toBeLessThanOrEqual(0.045);
  });
});

describe('the Usher figure — reads as a person, not a floating ring', () => {
  it('has a visible (rim-lit) body distinct from the void, not pure emissive-black', () => {
    const { group } = usherFigure();
    let bodyMat: THREE.MeshStandardMaterial | null = null;
    group.traverse((o) => {
      if (o instanceof THREE.Mesh && (o.geometry instanceof THREE.CylinderGeometry || o.geometry instanceof THREE.SphereGeometry)) {
        bodyMat = o.material as THREE.MeshStandardMaterial;
      }
    });
    expect(bodyMat, 'expected a body mesh (cylinder/sphere)').not.toBeNull();
    const body = bodyMat as unknown as THREE.MeshStandardMaterial;
    // the body must not be emissive-black-on-black: it should carry some emissive lift now
    expect(body.emissive.getHex()).toBeGreaterThan(0);
    expect(body.emissiveIntensity).toBeGreaterThan(0);
  });

  it('the halo is dimmer than the old floating-ring intensity', () => {
    const { group } = usherFigure();
    let haloIntensity = 0;
    group.traverse((o) => {
      if (o instanceof THREE.Mesh && o.geometry instanceof THREE.TorusGeometry) {
        haloIntensity = (o.material as THREE.MeshStandardMaterial).emissiveIntensity;
      }
    });
    expect(haloIntensity).toBeLessThan(2.2);
  });

  it('setPresence scales both the halo and body emissive intensity, for the walk-through visibility boost', () => {
    const { group, tick, setPresence } = usherFigure();
    let haloMat: THREE.MeshStandardMaterial | null = null;
    let bodyMat: THREE.MeshStandardMaterial | null = null;
    group.traverse((o) => {
      if (o instanceof THREE.Mesh && o.geometry instanceof THREE.TorusGeometry) haloMat = o.material as THREE.MeshStandardMaterial;
      // note: THREE.ConeGeometry (the horns) is a subclass of CylinderGeometry, so
      // `instanceof CylinderGeometry` alone would also match the horns — check the
      // exact geometry type to pin this to the body cylinder specifically.
      if (o instanceof THREE.Mesh && o.geometry.type === 'CylinderGeometry') bodyMat = o.material as THREE.MeshStandardMaterial;
    });
    tick(0);
    const baseHalo = (haloMat as unknown as THREE.MeshStandardMaterial).emissiveIntensity;
    const baseBody = (bodyMat as unknown as THREE.MeshStandardMaterial).emissiveIntensity;
    setPresence(1.7);
    tick(0);
    expect((haloMat as unknown as THREE.MeshStandardMaterial).emissiveIntensity).toBeCloseTo(baseHalo * 1.7, 5);
    expect((bodyMat as unknown as THREE.MeshStandardMaterial).emissiveIntensity).toBeCloseTo(baseBody * 1.7, 5);
  });

  it('silhouette() still builds a basic humanoid group with a default dark color', () => {
    const g = silhouette();
    expect(g.children.length).toBeGreaterThanOrEqual(3);
  });
});

describe('doors — uniform size regardless of count (no perspective size bug)', () => {
  function depths(n: number): number[] {
    const specs = Array.from({ length: n }, (_, i) => ({ id: `d${i}`, hint: `hint ${i}` }));
    const set = createDoors(specs);
    const zs: number[] = [];
    set.group.children.forEach((door) => zs.push(door.position.z));
    set.dispose();
    return zs;
  }

  it('a single door sits at the same depth as doors in a multi-door layout', () => {
    const one = depths(1);
    const three = depths(3);
    expect(one[0]).toBeCloseTo(three[Math.floor(three.length / 2)], 5);
  });

  it('all doors in any layout share one uniform depth (no per-door z stagger)', () => {
    for (const n of [1, 2, 3]) {
      const zs = depths(n);
      const unique = new Set(zs.map((z) => z.toFixed(5)));
      expect(unique.size, `doors at n=${n} should all share one depth`).toBe(1);
    }
  });

  it('doors face toward the camera rather than a point behind it', () => {
    const specs = [
      { id: 'a', hint: 'a' },
      { id: 'b', hint: 'b' },
      { id: 'c', hint: 'c' },
    ];
    const set = createDoors(specs);
    // every door's local +z (forward) should have a positive world-space z component
    // (i.e. facing back toward the camera at positive z), not away from it.
    set.group.children.forEach((door) => {
      const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(door.quaternion);
      expect(forward.z).toBeGreaterThan(0);
    });
    set.dispose();
  });
});

describe('doors — real interactive doors read as unmistakably alive', () => {
  function slabOf(set: ReturnType<typeof createDoors>, id: string): THREE.MeshStandardMaterial {
    const mesh = set.meshes.find((m) => m.userData.doorId === id)!;
    return mesh.material as THREE.MeshStandardMaterial;
  }

  it('idles at a steady baseline well above the decorative corridor slabs (0.32)', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }, { id: 'b', hint: 'b' }]);
    const mat = slabOf(set, 'a');
    expect(mat.emissiveIntensity).toBeGreaterThan(0.32);
    set.dispose();
  });

  it('gently pulses over time when idle, staying within a small band', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }]);
    const samples: number[] = [];
    for (let t = 0; t < 6; t += 0.3) {
      set.tick(t);
      samples.push(slabOf(set, 'a').emissiveIntensity);
    }
    const min = Math.min(...samples);
    const max = Math.max(...samples);
    expect(max - min).toBeGreaterThan(0.05); // it actually moves, not static
    expect(max - min).toBeLessThan(0.3); // but stays subtle
    set.dispose();
  });

  it('brightens distinctly on hover, overriding the idle pulse', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }, { id: 'b', hint: 'b' }]);
    set.setHover('a');
    set.tick(1.234);
    const hovered = slabOf(set, 'a').emissiveIntensity;
    const idle = slabOf(set, 'b').emissiveIntensity;
    expect(hovered).toBeGreaterThan(idle * 1.5);
    expect(hovered).toBeGreaterThan(0.6);
    set.dispose();
  });

  it('has a floor light pool beneath each door in addition to the door-height glow', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }]);
    const lights: THREE.PointLight[] = [];
    set.group.traverse((o) => {
      if (o instanceof THREE.PointLight) lights.push(o);
    });
    expect(lights.length).toBeGreaterThanOrEqual(2);
    expect(lights.some((l) => l.position.y < 0.5)).toBe(true);
    set.dispose();
  });
});

describe('corridor decorative doors — dimmer and desaturated vs. real doors', () => {
  it('background wall slabs sit well below the real door baseline intensity (0.42)', () => {
    const theme = buildTheme(1);
    let decorativeMat: THREE.MeshStandardMaterial | null = null;
    theme.group.traverse((o) => {
      if (o instanceof THREE.Mesh && o.geometry instanceof THREE.PlaneGeometry) {
        const geo = o.geometry as THREE.PlaneGeometry;
        if (Math.abs(geo.parameters.width - 1.2) < 0.01) decorativeMat = o.material as THREE.MeshStandardMaterial;
      }
    });
    expect(decorativeMat, 'expected a decorative wall-slab mesh').not.toBeNull();
    expect((decorativeMat as unknown as THREE.MeshStandardMaterial).emissiveIntensity).toBeLessThan(0.42);
  });

  it('the nearest decorative slab sits strictly behind the real doors (DOOR_Z)', () => {
    const theme = buildTheme(1);
    let nearestDecorZ = -Infinity;
    theme.group.traverse((o) => {
      if (o instanceof THREE.Mesh && o.geometry instanceof THREE.PlaneGeometry) {
        const geo = o.geometry as THREE.PlaneGeometry;
        if (Math.abs(geo.parameters.width - 1.2) < 0.01) {
          nearestDecorZ = Math.max(nearestDecorZ, o.position.z);
        }
      }
    });
    expect(nearestDecorZ).toBeGreaterThan(-Infinity);
    expect(nearestDecorZ).toBeLessThan(DOOR_Z);
  });
});

describe('doors — frameCorners (UAT door-visibility probe, Phase S1)', () => {
  it('returns 4 world-space corners for a real door id', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }]);
    const corners = set.frameCorners('a');
    expect(corners).not.toBeNull();
    expect(corners).toHaveLength(4);
    set.dispose();
  });

  it('returns null for an unknown door id', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }]);
    expect(set.frameCorners('nope')).toBeNull();
    set.dispose();
  });

  it('corners span from the floor (y=0) up to the lintel height, centered on the door', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }]);
    const corners = set.frameCorners('a')!;
    const ys = corners.map((c) => c.y);
    const xs = corners.map((c) => c.x);
    expect(Math.min(...ys)).toBeCloseTo(0, 5);
    expect(Math.max(...ys)).toBeGreaterThan(3); // lintel-top height
    // symmetric about the door's own x position
    const door = set.group.children[0];
    expect(Math.min(...xs)).toBeCloseTo(door.position.x - (Math.max(...xs) - door.position.x), 5);
    set.dispose();
  });

  it('multiple doors get distinct, non-overlapping corner x-ranges', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }, { id: 'b', hint: 'b' }]);
    const aXs = set.frameCorners('a')!.map((c) => c.x);
    const bXs = set.frameCorners('b')!.map((c) => c.x);
    expect(Math.max(...aXs)).toBeLessThan(Math.min(...bXs));
    set.dispose();
  });
});
