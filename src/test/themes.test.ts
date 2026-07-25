import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { buildTheme } from '../scene/themes';
import { DOOR_Z } from '../scene/doors';

// Player-perspective pass, 2026-07-25: a real door crossing (walkThrough())
// always leaves the resting reading camera at world z=DOOR_Z+1.2=-4.4, and a
// middle door in any 3-door room rests at x=0 too (doors.ts's spacing puts
// the middle door's lintel exactly on-axis). Act III's mirrorTheme() used to
// swing its ring of 8 floating "memory" boxes as close as z=-5 — one of them
// (whichever angle landed on the x=0 axis) sat almost pressed against that
// resting camera, its 1.7x1.15 semi-transparent navy face washing out every
// Act III room's own bespoke diorama for as long as the player read that
// room. Confirmed live via a close-camera screenshot of the `editor` room
// (its amber-lit drawer read as flat blue-grey instead) and reproduced
// mathematically: box index 2 sat at exactly (x=0, z=-5) before the fix.
describe('mirrorTheme (Act III) — floating memory boxes stay out of the reading-camera foreground', () => {
  it('keeps every floating memory box well behind the resting reading camera (DOOR_Z+1.2)', () => {
    const theme = buildTheme(3, 'high');
    const readingCameraZ = DOOR_Z + 1.2;
    let boxCount = 0;
    theme.group.traverse((o) => {
      if (
        o instanceof THREE.Mesh &&
        o.geometry instanceof THREE.BoxGeometry &&
        Math.abs(o.geometry.parameters.width - 1.7) < 1e-6 &&
        Math.abs(o.geometry.parameters.height - 1.15) < 1e-6
      ) {
        boxCount++;
        // A generous safety margin behind the reading camera — well clear of
        // the ~0.6-unit near-miss that caused the wash-out.
        expect(o.position.z, `memory box at index should stay behind the reading camera (z=${readingCameraZ})`).toBeLessThanOrEqual(
          readingCameraZ - 4,
        );
      }
    });
    expect(boxCount, 'expected all 8 floating memory boxes').toBe(8);
  });
});
