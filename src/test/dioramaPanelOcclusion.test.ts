import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Owner report (2026-07-21, most visible in LIMERENCE): once dioramas were
 * made bigger/closer (DIORAMA_SCALE/DIORAMA_Z), the bottom-anchored text/
 * choices panel started covering a meaningful slice of most vignettes —
 * many diorama builders anchor floor-level furniture near their own local
 * y=0, right where the panel sits. Fixed with a uniform vertical lift
 * (DIORAMA_Y_LIFT) applied once in `setDiorama`, not per-builder — same
 * single-tunable-constant pattern as DIORAMA_SCALE.
 *
 * The same report also found the F4 "back" button (`.beat-back`) visually
 * clipped in LIMERENCE specifically: `.text-panel` there has a `clip-path`
 * that clips descendant rendering to its own box, and the button used to
 * be positioned partly *outside* that box (`left: -6px`) as a deliberate
 * floating "tab" — invisible in ANAMNESIS (no clip-path there) but cut off
 * in LIMERENCE. Fixed by keeping it fully inside the box in both packs.
 *
 * `SceneDirector`/`styles.css` need a real WebGL context / browser to
 * verify visually — this locks in the *structural* shape of both fixes at
 * the source level, matching this repo's established convention for such
 * fixes (dioramaFillLight.test.ts, accessibilityFixes.test.ts, ...). Live
 * UAT screenshots (scripts 55-57) verified the actual on-screen result.
 */

const directorSrc = readFileSync(new URL('../scene/director.ts', import.meta.url), 'utf8');
const stylesSrc = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

describe('diorama vertical lift (owner report 2026-07-21)', () => {
  it('DIORAMA_Y_LIFT is declared as a positive, non-trivial constant', () => {
    const match = directorSrc.match(/const DIORAMA_Y_LIFT = ([\d.]+);/);
    expect(match, 'DIORAMA_Y_LIFT constant not found').toBeTruthy();
    const value = Number(match![1]);
    expect(value).toBeGreaterThan(0.2);
    expect(value).toBeLessThan(2);
  });

  it('setDiorama applies the lift to the group\'s own position before adding it to the scene', () => {
    const startIdx = directorSrc.indexOf('setDiorama(roomId: string | null) {');
    expect(startIdx, 'setDiorama not found').toBeGreaterThan(-1);
    const endIdx = directorSrc.indexOf('\n  }', startIdx);
    const body = directorSrc.slice(startIdx, endIdx);
    const scaleIdx = body.indexOf('d.group.scale.setScalar(DIORAMA_SCALE)');
    const liftIdx = body.indexOf('d.group.position.y += DIORAMA_Y_LIFT;');
    const addIdx = body.indexOf('this.scene.add(d.group)');
    expect(scaleIdx, 'diorama scale not applied').toBeGreaterThan(-1);
    expect(liftIdx, 'diorama Y lift not applied').toBeGreaterThan(-1);
    expect(addIdx, 'diorama group not added to scene').toBeGreaterThan(-1);
    // The lift must happen before the group is added to the scene — applying
    // it after would still work (three.js position updates aren't queued),
    // but keeping "size it, then place it, then add it" in strict order
    // keeps the code readable and matches the inline comment.
    expect(liftIdx).toBeLessThan(addIdx);
  });

  it('the diorama fill light\'s Y position tracks the same lift, so the raised group stays lit', () => {
    const startIdx = directorSrc.indexOf('setDiorama(roomId: string | null) {');
    const endIdx = directorSrc.indexOf('\n  }', startIdx);
    const body = directorSrc.slice(startIdx, endIdx);
    expect(body).toContain('this.dioramaFillLight.position.set(0, 0.75 + DIORAMA_Y_LIFT, DIORAMA_Z + 1.1);');
  });
});

describe('beat-back button stays inside its (possibly clip-path\'d) panel box (owner report 2026-07-21)', () => {
  it('.beat-back is positioned at a non-negative left offset', () => {
    const match = stylesSrc.match(/\.beat-back\s*\{[^}]*left:\s*(-?\d+)px/);
    expect(match, '.beat-back left offset not found').toBeTruthy();
    const left = Number(match![1]);
    expect(left, 'a negative left would poke outside .text-panel\'s box, where LIMERENCE\'s clip-path cuts it off').toBeGreaterThanOrEqual(0);
  });

  it('LIMERENCE\'s .text-panel clip-path rule (the reason this matters) is still present, unperturbed', () => {
    expect(stylesSrc).toContain('body.pack-limerence .text-panel,');
    expect(stylesSrc).toContain('clip-path: polygon(0 0, 100% 0, 100% 100%, 22px 100%, 0 calc(100% - 22px));');
  });
});
