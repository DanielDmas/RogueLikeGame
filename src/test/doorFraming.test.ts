import { describe, expect, it } from 'vitest';
import { cameraZForDoors } from '../scene/director';

describe('cameraZForDoors — aspect-aware door framing (Phase H1)', () => {
  it('never sits closer than the base framing distance, even for a single door on a wide screen', () => {
    const z = cameraZForDoors(1, 16 / 9);
    expect(z).toBeGreaterThanOrEqual(7.6); // the new base CAM_HOME.z
  });

  it('pulls the camera back for more doors at the same aspect ratio', () => {
    const z1 = cameraZForDoors(1, 16 / 9);
    const z2 = cameraZForDoors(2, 16 / 9);
    const z3 = cameraZForDoors(3, 16 / 9);
    expect(z2).toBeGreaterThanOrEqual(z1);
    expect(z3).toBeGreaterThanOrEqual(z2);
  });

  it('pulls the camera back further on a narrow/portrait aspect ratio than on a wide one, for the same door count', () => {
    const wide = cameraZForDoors(3, 16 / 9);
    const portrait = cameraZForDoors(3, 9 / 16);
    expect(portrait).toBeGreaterThan(wide);
  });

  it('a very narrow portrait screen with the max door count still pulls back enough to fit them (regression check)', () => {
    const z = cameraZForDoors(3, 0.5);
    // With the base setup, this must exceed the untouched base distance —
    // i.e. the aspect compensation actually engaged, not a no-op.
    expect(z).toBeGreaterThan(7.6);
  });

  it('is a pure function of its inputs (same args, same output)', () => {
    expect(cameraZForDoors(2, 1.5)).toBe(cameraZForDoors(2, 1.5));
  });

  it('degrades gracefully for a degenerate near-zero aspect ratio (no divide-by-zero/Infinity)', () => {
    const z = cameraZForDoors(3, 0);
    expect(Number.isFinite(z)).toBe(true);
  });
});
