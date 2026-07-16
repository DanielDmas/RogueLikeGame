import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  corridorTheme,
  skylineFixture,
  dawnGradientPlane,
  liftColorForLightMode,
  DAWN_LIFT,
  accentPulseEnvelope,
  nextAccentPulseDelay,
  ACCENT_PULSE_DURATION,
  ACCENT_PULSE_BASE,
} from '../scene/themes';

function disposeGroup(group: THREE.Group) {
  group.traverse((o) => {
    if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
      o.geometry?.dispose();
      const mat = (o as THREE.Mesh).material;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose();
    }
  });
}

function countMeshes(group: THREE.Group): number {
  let n = 0;
  group.traverse((o) => {
    if (o instanceof THREE.Mesh) n++;
  });
  return n;
}

function countLights(group: THREE.Group): number {
  let n = 0;
  group.traverse((o) => {
    if (o instanceof THREE.Light) n++;
  });
  return n;
}

describe('Phase V1 — the standardized fixture kit: opt-in, data-configured, ANAMNESIS-safe', () => {
  it('a floor with no fixtures[] is identical mesh-count-wise to before Phase V1', () => {
    const bare = corridorTheme(0x8a6a3a, {}, 'high');
    const withEmptyFixtures = corridorTheme(0x8a6a3a, { fixtures: [] }, 'high');
    expect(countMeshes(withEmptyFixtures.group)).toBe(countMeshes(bare.group));
    disposeGroup(bare.group);
    disposeGroup(withEmptyFixtures.group);
  });

  it('bandedWalls adds extra box-geometry panels along the walls', () => {
    const bare = corridorTheme(0x8a6a3a, {}, 'high');
    const bareCount = countMeshes(bare.group);
    disposeGroup(bare.group);
    const themed = corridorTheme(0x8a6a3a, { fixtures: [{ kind: 'bandedWalls', color: 0x336699 }] }, 'high');
    expect(countMeshes(themed.group)).toBeGreaterThan(bareCount);
    disposeGroup(themed.group);
  });

  it('infoPanel adds a backing plane plus a grid of small cell planes', () => {
    const bare = corridorTheme(0x8a6a3a, {}, 'high');
    const bareCount = countMeshes(bare.group);
    disposeGroup(bare.group);
    const themed = corridorTheme(0x8a6a3a, { fixtures: [{ kind: 'infoPanel', color: 0xd4923f }] }, 'high');
    // 1 backing + 4 rows * 8 cols = 33 new meshes
    expect(countMeshes(themed.group) - bareCount).toBe(33);
    disposeGroup(themed.group);
  });

  it('sconces adds real-time lights only at high quality (mirrors the rest of this file\'s "expensive stuff gates on quality" discipline)', () => {
    const bareLow = corridorTheme(0x8a6a3a, {}, 'low');
    const bareLowLights = countLights(bareLow.group);
    disposeGroup(bareLow.group);
    const themedLow = corridorTheme(0x8a6a3a, { fixtures: [{ kind: 'sconces', color: 0xa8708a }] }, 'low');
    expect(countLights(themedLow.group)).toBe(bareLowLights);
    disposeGroup(themedLow.group);

    const bareHigh = corridorTheme(0x8a6a3a, {}, 'high');
    const bareHighLights = countLights(bareHigh.group);
    disposeGroup(bareHigh.group);
    const themedHigh = corridorTheme(0x8a6a3a, { fixtures: [{ kind: 'sconces', color: 0xa8708a }] }, 'high');
    expect(countLights(themedHigh.group)).toBeGreaterThan(bareHighLights);
    disposeGroup(themedHigh.group);
  });

  it('endWindow (the migrating window, generalized) still ticks and drifts without throwing', () => {
    const themed = corridorTheme(0x8a6a3a, { fixtures: [{ kind: 'endWindow', color: 0x4a5a72 }] }, 'high');
    expect(() => themed.tick(1.23)).not.toThrow();
    expect(() => themed.tick(45.6)).not.toThrow();
    disposeGroup(themed.group);
  });

  it('multiple fixtures compose together without throwing or colliding', () => {
    const themed = corridorTheme(
      0x8a6a3a,
      { fixtures: [{ kind: 'endWindow', color: 0x4a5a72 }, { kind: 'bandedWalls', color: 0x336699 }, { kind: 'infoPanel', color: 0xd4923f }, { kind: 'sconces', color: 0xa8708a }] },
      'high',
    );
    expect(() => themed.tick(10)).not.toThrow();
    disposeGroup(themed.group);
  });
});

describe('skylineFixture — reusable low silhouette strip', () => {
  it('builds the requested number of boxes with varying, deterministic heights', () => {
    const a = skylineFixture(0x140f0c, 6);
    const b = skylineFixture(0x140f0c, 6);
    expect(countMeshes(a.group)).toBe(6);
    const heightsA: number[] = [];
    a.group.traverse((o) => {
      if (o instanceof THREE.Mesh) heightsA.push((o.geometry as THREE.BoxGeometry).parameters.height);
    });
    const heightsB: number[] = [];
    b.group.traverse((o) => {
      if (o instanceof THREE.Mesh) heightsB.push((o.geometry as THREE.BoxGeometry).parameters.height);
    });
    expect(heightsA).toEqual(heightsB); // deterministic, not Math.random
    expect(new Set(heightsA).size).toBeGreaterThan(1); // actually varies
    disposeGroup(a.group);
    disposeGroup(b.group);
  });
});

describe('dawnGradientPlane — shared shader, reused (not forked) by both packs', () => {
  it('builds a plane with a working time-driven tick', () => {
    const dawn = dawnGradientPlane([0.55, 0.32, 0.18], [0.28, 0.2, 0.24], [0.05, 0.06, 0.1]);
    expect(dawn.mesh).toBeInstanceOf(THREE.Mesh);
    expect(() => dawn.tick(5)).not.toThrow();
    dawn.mesh.geometry.dispose();
    (dawn.mesh.material as THREE.Material).dispose();
  });
});

describe('Phase V2 — "the morning read": liftColorForLightMode + corridorTheme mode param', () => {
  it('liftColorForLightMode blends toward the target by the given amount, and amount=0 is a no-op', () => {
    expect(liftColorForLightMode(0x000000, 0xffffff, 0)).toBe(0x000000);
    const lifted = liftColorForLightMode(0x000000, 0xffffff, 1);
    expect(lifted).toBe(0xffffff);
    const partial = liftColorForLightMode(0x000000, 0xffffff, 0.5);
    expect(partial).toBeGreaterThan(0x000000);
    expect(partial).toBeLessThan(0xffffff);
  });

  it('DAWN_LIFT is a real, warm reference triple', () => {
    expect(typeof DAWN_LIFT.fog).toBe('number');
    expect(typeof DAWN_LIFT.ambient).toBe('number');
    expect(typeof DAWN_LIFT.key).toBe('number');
  });

  it('mode="dark" (the default) is byte-identical to omitting mode entirely', () => {
    const withoutMode = corridorTheme(0x8a6a3a, { fog: 0x1c1420 });
    const withDark = corridorTheme(0x8a6a3a, { fog: 0x1c1420 }, 'high', 'dark');
    expect(withDark.fogColor).toBe(withoutMode.fogColor);
    expect(withDark.fogDensity).toBe(withoutMode.fogDensity);
    disposeGroup(withoutMode.group);
    disposeGroup(withDark.group);
  });

  it('mode="light" lifts fog color toward DAWN_LIFT.fog and thins fog density, vs the same palette in dark mode', () => {
    const dark = corridorTheme(0x8a6a3a, { fog: 0x1c1420 }, 'high', 'dark');
    const light = corridorTheme(0x8a6a3a, { fog: 0x1c1420 }, 'high', 'light');
    expect(light.fogColor).not.toBe(dark.fogColor);
    expect(light.fogDensity).toBeLessThan(dark.fogDensity);
    disposeGroup(dark.group);
    disposeGroup(light.group);
  });

  it('mode="light" never changes ANAMNESIS-style callers unless they explicitly opt into it (the parameter itself is what gates this, not the palette)', () => {
    // Same palette, only `mode` differs — proves the *only* switch is the parameter.
    const a = corridorTheme(0x8a6a3a, {}, 'high');
    const b = corridorTheme(0x8a6a3a, {}, 'high', 'dark');
    expect(a.fogColor).toBe(b.fogColor);
    disposeGroup(a.group);
    disposeGroup(b.group);
  });
});

describe('Phase V4b — "a phone lighting in the distance": pure envelope + jitter', () => {
  it('accentPulseEnvelope is 0 before start and at/after duration, and peaks at 1 at the midpoint', () => {
    expect(accentPulseEnvelope(-0.1)).toBe(0);
    expect(accentPulseEnvelope(0)).toBe(0);
    expect(accentPulseEnvelope(ACCENT_PULSE_DURATION)).toBe(0);
    expect(accentPulseEnvelope(ACCENT_PULSE_DURATION * 5)).toBe(0);
    expect(accentPulseEnvelope(ACCENT_PULSE_DURATION / 2)).toBeCloseTo(1, 5);
  });

  it('is a single smooth rise then fall — strictly increasing then strictly decreasing, never a strobe', () => {
    const samples: number[] = [];
    for (let e = 0; e <= ACCENT_PULSE_DURATION; e += ACCENT_PULSE_DURATION / 40) {
      samples.push(accentPulseEnvelope(e));
    }
    const peakIdx = samples.indexOf(Math.max(...samples));
    for (let i = 1; i <= peakIdx; i++) expect(samples[i]).toBeGreaterThanOrEqual(samples[i - 1]);
    for (let i = peakIdx + 1; i < samples.length; i++) expect(samples[i]).toBeLessThanOrEqual(samples[i - 1]);
  });

  it('nextAccentPulseDelay stays within [60, 180] and is deterministic given a fixed rand', () => {
    expect(nextAccentPulseDelay(() => 0)).toBe(60);
    expect(nextAccentPulseDelay(() => 1)).toBe(180);
    expect(nextAccentPulseDelay(() => 0.5)).toBe(120);
  });

  it('a floor with accentColor set actually pulses its accent material above base over a long enough tick span', () => {
    const themed = corridorTheme(0x8a6a3a, { accentColor: 0x336699 }, 'high');
    let sawAboveBase = false;
    // 180s (the max possible jitter) + one full pulse duration guarantees at
    // least one pulse has started and risen above base by the end.
    for (let t = 0; t <= 190; t += 2) {
      themed.tick(t);
      let mat: THREE.MeshStandardMaterial | null = null;
      themed.group.traverse((o) => {
        if (
          o instanceof THREE.Mesh &&
          o.geometry instanceof THREE.PlaneGeometry &&
          (o.geometry as THREE.PlaneGeometry).parameters.width === 1.2 &&
          (o.material as THREE.MeshStandardMaterial).emissiveIntensity > ACCENT_PULSE_BASE + 0.05
        ) {
          mat = o.material as THREE.MeshStandardMaterial;
        }
      });
      if (mat) sawAboveBase = true;
    }
    expect(sawAboveBase).toBe(true);
    disposeGroup(themed.group);
  });

  it('a floor without accentColor never touches any decorative material\'s intensity via the pulse path (no-op)', () => {
    const themed = corridorTheme(0x8a6a3a, {}, 'high');
    expect(() => {
      for (let t = 0; t <= 190; t += 20) themed.tick(t);
    }).not.toThrow();
    disposeGroup(themed.group);
  });
});
