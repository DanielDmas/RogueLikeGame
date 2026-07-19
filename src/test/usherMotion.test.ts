import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { easeInOutCubic } from '../scene/director';
import { usherFigure } from '../scene/themes';
import * as THREE from 'three';

describe('easeInOutCubic — the tween easing behind the Usher walk and camera dolly (Phase F1/F2)', () => {
  it('starts at 0 and ends at 1', () => {
    expect(easeInOutCubic(0)).toBeCloseTo(0, 5);
    expect(easeInOutCubic(1)).toBeCloseTo(1, 5);
  });

  it('is exactly halfway at the midpoint (symmetric ease-in-out)', () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 5);
  });

  it('is monotonically increasing (no backtracking during a walk)', () => {
    let prev = -Infinity;
    for (let t = 0; t <= 1; t += 0.05) {
      const v = easeInOutCubic(t);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });

  it('clamps out-of-range input so a slightly-late frame never overshoots', () => {
    expect(easeInOutCubic(-0.5)).toBe(0);
    expect(easeInOutCubic(1.5)).toBe(1);
  });

  it('eases slower than linear near the start and end (the "deliberate approach" feel)', () => {
    expect(easeInOutCubic(0.1)).toBeLessThan(0.1);
    expect(easeInOutCubic(0.9)).toBeGreaterThan(0.9);
  });
});

describe('usherFigure — visibility upgrade (Phase F3) and idle life (Phase F4)', () => {
  it('the figure is scaled up from its original size (more visible against the scene)', () => {
    const { group } = usherFigure();
    expect(group.scale.x).toBeGreaterThan(1);
    expect(group.scale.x).toBe(group.scale.y);
    expect(group.scale.x).toBe(group.scale.z);
  });

  it('includes a spotlight lighting the figure from above', () => {
    const { group } = usherFigure();
    let hasSpot = false;
    group.traverse((o) => {
      if (o instanceof THREE.SpotLight) hasSpot = true;
    });
    expect(hasSpot).toBe(true);
  });

  it('the spotlight intensity scales with presence, like the halo and rim', () => {
    const { group, tick, setPresence } = usherFigure();
    let spot: THREE.SpotLight | null = null;
    group.traverse((o) => {
      if (o instanceof THREE.SpotLight) spot = o;
    });
    tick(0);
    const base = spot!.intensity;
    setPresence(2);
    tick(0);
    expect(spot!.intensity).toBeCloseTo(base * 2, 5);
  });

  it('the head slowly turns over time (idle life) rather than staying frozen', () => {
    const { group, tick } = usherFigure();
    const head = group.children[2] as THREE.Mesh;
    tick(0);
    const y0 = head.rotation.y;
    tick(5);
    const y1 = head.rotation.y;
    expect(y1).not.toBe(y0);
  });
});

describe('Usher walk-in truncation (game-experience review A2, 2026-07-19)', () => {
  // director.ts's approach-walk tween used to run longer than the camera
  // dolly, so the dolly's `done` callback fired mid-stride and overwrote it
  // with a walk-home target — the Usher visibly reversed direction for most
  // of a second before the veil went opaque. director.ts needs a real
  // WebGL/canvas context to drive the render loop live, so — matching this
  // repo's convention for such pacing bugs (interludeTiming.test.ts,
  // recovery.test.ts) — this asserts the fix's shape directly against the
  // source: the approach walk must never outlast the dolly it's timed
  // against.
  const src = readFileSync(new URL('../scene/director.ts', import.meta.url), 'utf8');

  it('USHER_WALK_SECONDS is at or under CAMERA_DOLLY_SECONDS', () => {
    const walkMatch = src.match(/const USHER_WALK_SECONDS = ([\d.]+);/);
    const dollyMatch = src.match(/const CAMERA_DOLLY_SECONDS = ([\d.]+);/);
    expect(walkMatch, 'USHER_WALK_SECONDS constant not found').not.toBeNull();
    expect(dollyMatch, 'CAMERA_DOLLY_SECONDS constant not found').not.toBeNull();
    const walkSeconds = Number(walkMatch![1]);
    const dollySeconds = Number(dollyMatch![1]);
    expect(walkSeconds).toBeLessThanOrEqual(dollySeconds);
  });
});
