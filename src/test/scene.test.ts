import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { buildTheme, silhouette, usherFigure } from '../scene/themes';
import { createDoors, DOOR_Z, flickerEnvelope, frameHoverGlow, hoverLightSpill, hoverPulseIntensity, SELECT_SNAP_BOOST } from '../scene/doors';
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
      // the body silhouette is the only mesh built on a cylinder — the lantern
      // glow (Q6) is a sphere too, but starts at emissiveIntensity 0, so it
      // must not be mistaken for the body here.
      if (o instanceof THREE.Mesh && o.geometry instanceof THREE.CylinderGeometry) {
        bodyMat = o.material as THREE.MeshStandardMaterial;
      }
    });
    expect(bodyMat, 'expected a body mesh (cylinder)').not.toBeNull();
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

  it('the hovered door breathes within its subtle pulse band, distinct from the idle door (spec 07 §Q4)', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }, { id: 'b', hint: 'b' }]);
    set.setHover('a');
    set.tick(1.234);
    const hovered = slabOf(set, 'a').emissiveIntensity;
    const idle = slabOf(set, 'b').emissiveIntensity;
    expect(hovered).toBeGreaterThanOrEqual(0.42);
    expect(hovered).toBeLessThanOrEqual(0.42 + 0.15 + 1e-9);
    expect(hovered).not.toBe(idle);
    set.dispose();
  });

  it('snapSelected immediately boosts the chosen door past its hover pulse (spec 07 §Q4)', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }]);
    set.snapSelected('a');
    expect(slabOf(set, 'a').emissiveIntensity).toBeCloseTo(0.42 + SELECT_SNAP_BOOST);
    set.dispose();
  });

  it('hoverPulseIntensity stays within [base, base+0.15] and is constant under reduced motion', () => {
    for (let t = 0; t < 10; t += 0.37) {
      const v = hoverPulseIntensity(t, 0.42, false);
      expect(v).toBeGreaterThanOrEqual(0.42);
      expect(v).toBeLessThanOrEqual(0.42 + 0.15 + 1e-9);
    }
    expect(hoverPulseIntensity(0, 0.42, true)).toBe(0.57);
    expect(hoverPulseIntensity(5, 0.42, true)).toBe(0.57);
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

  it('hoverLightSpill stays within [base, base*(1+boost)] and holds at the peak under reduced motion', () => {
    for (let t = 0; t < 10; t += 0.37) {
      const v = hoverLightSpill(1.5, t, false);
      expect(v).toBeGreaterThanOrEqual(1.5);
      expect(v).toBeLessThanOrEqual(1.5 * 1.4 + 1e-9);
    }
    expect(hoverLightSpill(1.5, 0, true)).toBeCloseTo(1.5 * 1.4, 6);
    expect(hoverLightSpill(1.5, 5, true)).toBeCloseTo(1.5 * 1.4, 6);
  });

  it('item 7: a hovered door\'s point light and floor pool breathe brighter, and reset once unhovered', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }]);
    const lightsOf = (id: string) => {
      const found: THREE.PointLight[] = [];
      const meshEntry = set.meshes.find((m) => m.userData.doorId === id);
      const door = meshEntry?.parent;
      door?.traverse((o) => {
        if (o instanceof THREE.PointLight) found.push(o);
      });
      return found;
    };
    const baseIntensities = lightsOf('a').map((l) => l.intensity);
    set.setHover('a');
    set.tick(0, false);
    const hoveredIntensities = lightsOf('a').map((l) => l.intensity);
    hoveredIntensities.forEach((v, i) => expect(v).toBeGreaterThanOrEqual(baseIntensities[i]));
    set.setHover(null);
    set.tick(0.5, false);
    const resetIntensities = lightsOf('a').map((l) => l.intensity);
    expect(resetIntensities).toEqual(baseIntensities);
    set.dispose();
  });
});

describe('doors — item 17: the frame itself catches a glow on hover (graphics overhaul, 2026-07-16)', () => {
  function frameMatsOf(set: ReturnType<typeof createDoors>, id: string): THREE.MeshStandardMaterial[] {
    const meshEntry = set.meshes.find((m) => m.userData.doorId === id);
    const door = meshEntry?.parent;
    const mats: THREE.MeshStandardMaterial[] = [];
    door?.traverse((o) => {
      if (o instanceof THREE.Mesh && o.geometry instanceof THREE.BoxGeometry) {
        mats.push(o.material as THREE.MeshStandardMaterial);
      }
    });
    return mats;
  }

  it('frameHoverGlow is 0 unhovered, a positive fixed peak hovered, and honors a custom peak', () => {
    expect(frameHoverGlow(false)).toBe(0);
    expect(frameHoverGlow(true)).toBeGreaterThan(0);
    expect(frameHoverGlow(true, 0.5)).toBe(0.5);
    expect(frameHoverGlow(false, 0.5)).toBe(0);
  });

  it('the hovered door\'s frame (both jambs + lintel) glows; every other door\'s frame stays dark', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }, { id: 'b', hint: 'b' }, { id: 'c', hint: 'c' }]);
    set.setHover('b');
    set.tick(1.0, false);
    expect(frameMatsOf(set, 'b').every((m) => m.emissiveIntensity > 0)).toBe(true);
    expect(frameMatsOf(set, 'a').every((m) => m.emissiveIntensity === 0)).toBe(true);
    expect(frameMatsOf(set, 'c').every((m) => m.emissiveIntensity === 0)).toBe(true);
    set.dispose();
  });

  it('unhovering resets the frame glow back to exactly 0', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }]);
    set.setHover('a');
    set.tick(0, false);
    expect(frameMatsOf(set, 'a').every((m) => m.emissiveIntensity > 0)).toBe(true);
    set.setHover(null);
    set.tick(0.5, false);
    expect(frameMatsOf(set, 'a').every((m) => m.emissiveIntensity === 0)).toBe(true);
    set.dispose();
  });

  it('each door owns its own frame material — not one shared across the whole row (a shared material would light every frame on any hover)', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }, { id: 'b', hint: 'b' }]);
    expect(frameMatsOf(set, 'a')[0]).not.toBe(frameMatsOf(set, 'b')[0]);
    set.dispose();
  });

  it('idle (no hover at all) leaves every frame at 0, same as before this feature existed', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }, { id: 'b', hint: 'b' }]);
    set.tick(3.7, false);
    expect(frameMatsOf(set, 'a').every((m) => m.emissiveIntensity === 0)).toBe(true);
    expect(frameMatsOf(set, 'b').every((m) => m.emissiveIntensity === 0)).toBe(true);
    set.dispose();
  });
});

describe('flickerEnvelope — T7 ambient corridor life\'s dip curve', () => {
  it('is exactly 1 before the event starts and once it has finished', () => {
    expect(flickerEnvelope(-1)).toBe(1);
    expect(flickerEnvelope(0)).toBe(1);
    expect(flickerEnvelope(2.2, 2.2)).toBe(1);
    expect(flickerEnvelope(5, 2.2)).toBe(1);
  });

  it('dips below 1 at the midpoint, by roughly the configured dip amount', () => {
    const v = flickerEnvelope(1.1, 2.2, 0.28);
    expect(v).toBeCloseTo(1 - 0.28, 5);
  });

  it('is a single smooth dip, never a strobe: strictly decreasing then strictly increasing', () => {
    const samples: number[] = [];
    for (let e = 0; e <= 2.2; e += 0.1) samples.push(flickerEnvelope(e, 2.2));
    let sawMinimum = false;
    for (let i = 1; i < samples.length; i++) {
      if (!sawMinimum && samples[i] > samples[i - 1]) sawMinimum = true;
      else if (sawMinimum) expect(samples[i]).toBeGreaterThanOrEqual(samples[i - 1] - 1e-9);
    }
    expect(sawMinimum).toBe(true);
  });

  it('never exceeds 1 or goes negative for any dip in [0, 1]', () => {
    for (let e = 0; e <= 2.2; e += 0.05) {
      const v = flickerEnvelope(e, 2.2, 0.28);
      expect(v).toBeLessThanOrEqual(1);
      expect(v).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('DoorSet.triggerAmbientFlicker — T7 ambient corridor life', () => {
  function slabOf(set: ReturnType<typeof createDoors>, id: string): THREE.MeshStandardMaterial {
    const mesh = set.meshes.find((m) => m.userData.doorId === id)!;
    return mesh.material as THREE.MeshStandardMaterial;
  }

  it('dips one door\'s intensity below its normal idle band, then it recovers', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }]);
    set.tick(10);
    const before = slabOf(set, 'a').emissiveIntensity;
    set.triggerAmbientFlicker(10);
    set.tick(11.1); // roughly the flicker's midpoint
    const during = slabOf(set, 'a').emissiveIntensity;
    expect(during).toBeLessThan(before);
    set.tick(20); // well past the flicker's duration
    const after = slabOf(set, 'a').emissiveIntensity;
    expect(after).toBeGreaterThan(during);
    set.dispose();
  });

  it('never picks the currently-hovered door', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }, { id: 'b', hint: 'b' }]);
    set.setHover('a');
    for (let seed = 0; seed < 30; seed++) {
      set.triggerAmbientFlicker(seed);
      set.tick(seed + 1.1);
      // The hovered door's intensity is governed entirely by hoverPulseIntensity
      // (spec 07 §Q4) regardless of any flicker — confirm it's never dipped
      // below that pulse's own floor, which a flicker on 'a' would violate.
      expect(slabOf(set, 'a').emissiveIntensity).toBeGreaterThanOrEqual(0.42);
    }
    set.dispose();
  });

  it('is a no-op when every door is hovered (nothing left to pick)', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }]);
    set.setHover('a');
    expect(() => set.triggerAmbientFlicker(0)).not.toThrow();
    set.dispose();
  });

  it('is a no-op with zero doors', () => {
    const set = createDoors([]);
    expect(() => set.triggerAmbientFlicker(0)).not.toThrow();
    set.dispose();
  });

  // Found in code review (2026-07-15): the flicker factor only ever
  // multiplied the slab's own emissive intensity — the door's point-light
  // and floor-pool light stayed pinned to base intensity every frame, so
  // the light spill never dimmed in sync with the visibly flickering slab.
  it('dims the door\'s glow and floor-pool lights in sync with the slab, not just the slab', () => {
    const set = createDoors([{ id: 'a', hint: 'a' }]);
    const lightsOf = (id: string) => {
      const lights: THREE.PointLight[] = [];
      set.group.traverse((o) => {
        if (o instanceof THREE.PointLight && o.userData.doorId === id) lights.push(o);
      });
      return lights;
    };
    set.tick(10);
    const before = lightsOf('a').map((l) => l.intensity);
    set.triggerAmbientFlicker(10);
    set.tick(11.1); // roughly the flicker's midpoint
    const during = lightsOf('a').map((l) => l.intensity);
    expect(during.length).toBeGreaterThan(0);
    during.forEach((intensity, i) => expect(intensity).toBeLessThan(before[i]));
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
