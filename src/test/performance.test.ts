import { describe, expect, it } from 'vitest';
import { effectiveFps, nextAmbientDelay, pixelRatioFor, shouldRenderFrame } from '../scene/director';
import { isElectron } from '../ui/fullscreen';

describe('shouldRenderFrame — the 60 FPS frame limiter (Phase A1)', () => {
  it('does not render again before 1/60s has elapsed', () => {
    expect(shouldRenderFrame(1000, 990)).toBe(false); // 10ms < 16.67ms
  });

  it('renders once at least 1/60s has elapsed', () => {
    expect(shouldRenderFrame(1000, 983)).toBe(true); // 17ms >= 16.67ms
  });

  it('respects a custom target FPS (e.g. capping to 30 for an idle title screen)', () => {
    expect(shouldRenderFrame(1000, 980, 30)).toBe(false); // 20ms < 33.3ms
    expect(shouldRenderFrame(1000, 960, 30)).toBe(true); // 40ms >= 33.3ms
  });

  it('a monitor running well above 60Hz gets throttled to roughly 60 renders/sec', () => {
    // simulate a 240Hz display (one frame every ~4.16ms) for one second
    let now = 0;
    let last = -1000;
    let rendered = 0;
    for (let i = 0; i < 240; i++) {
      now += 1000 / 240;
      if (shouldRenderFrame(now, last)) {
        last = now;
        rendered++;
      }
    }
    // 240Hz input throttled toward a 60Hz budget — not an exact 60 (frame
    // boundaries don't align perfectly with the 16.67ms threshold), but a
    // world away from rendering all 240 frames.
    expect(rendered).toBeLessThanOrEqual(62);
    expect(rendered).toBeGreaterThanOrEqual(48);
  });
});

describe('effectiveFps — 1.3 idle downshift (a static text/choice screen with no active tween)', () => {
  it('leaves the fps cap untouched when not idle-eligible', () => {
    expect(effectiveFps(60, false)).toBe(60);
    expect(effectiveFps(30, false)).toBe(30);
  });

  it('downshifts a 60fps (Cinematic) cap to the idle target while idle-eligible', () => {
    expect(effectiveFps(60, true)).toBe(30);
  });

  it('never raises fps above the caller\'s own cap — a 30fps profile stays 30, not "upgraded" to the idle target', () => {
    expect(effectiveFps(30, true)).toBe(30);
  });

  it('respects a custom idle target', () => {
    expect(effectiveFps(60, true, 20)).toBe(20);
    expect(effectiveFps(15, true, 20)).toBe(15); // still never raises above the cap
  });
});

describe('nextAmbientDelay — T7 ambient corridor life\'s jittered 60-120s timer', () => {
  it('is always within [60, 120) seconds', () => {
    for (let seed = 0; seed <= 1; seed += 0.05) {
      const v = nextAmbientDelay(() => seed);
      expect(v).toBeGreaterThanOrEqual(60);
      expect(v).toBeLessThan(120);
    }
  });

  it('rand=0 gives the floor, rand near 1 gives near the ceiling', () => {
    expect(nextAmbientDelay(() => 0)).toBe(60);
    expect(nextAmbientDelay(() => 0.999999)).toBeCloseTo(120, 1);
  });
});

describe('pixelRatioFor — render-resolution scale, independent of `quality` (Phase A3)', () => {
  it('performance caps well below native DPR and adds a further 0.75x cut', () => {
    expect(pixelRatioFor('performance', 2)).toBeCloseTo(0.75, 5);
  });

  it('standard caps at 1.5x even on a high-DPR display', () => {
    expect(pixelRatioFor('standard', 2)).toBeCloseTo(1.5, 5);
    expect(pixelRatioFor('standard', 1)).toBeCloseTo(1, 5);
  });

  it('sharp allows up to native DPR, capped at 2x', () => {
    expect(pixelRatioFor('sharp', 2)).toBeCloseTo(2, 5);
    expect(pixelRatioFor('sharp', 3)).toBeCloseTo(2, 5);
    expect(pixelRatioFor('sharp', 1)).toBeCloseTo(1, 5);
  });

  it('a falsy devicePixelRatio (e.g. 0 from an odd environment) is treated as 1', () => {
    expect(pixelRatioFor('standard', 0)).toBeCloseTo(1, 5);
  });

  it('performance always renders at a lower or equal resolution than standard, which is always <= sharp', () => {
    for (const dpr of [1, 1.5, 2, 3]) {
      expect(pixelRatioFor('performance', dpr)).toBeLessThanOrEqual(pixelRatioFor('standard', dpr));
      expect(pixelRatioFor('standard', dpr)).toBeLessThanOrEqual(pixelRatioFor('sharp', dpr));
    }
  });
});

describe('isElectron — detects the packaged desktop shell vs. a browser tab', () => {
  it('is false in a plain node/test environment (no Electron UA)', () => {
    expect(isElectron()).toBe(false);
  });
});
