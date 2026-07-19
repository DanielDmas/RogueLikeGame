import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Game-experience review (2026-07-19, `15-game-experience-review.md` §1 and
 * §6): the end-of-act interlude card was held only 260ms against its own
 * 300ms CSS fade-in — cleared before it ever finished appearing — and no
 * browser-driven test ever caught it, because `?uat=1` scales every
 * deliberate pacing wait (this one included) by 0.25x, making a real bug a
 * 65ms flash indistinguishable from a generous multi-second hold in any
 * screenshot. `syncTheme()` needs a real `AudioContext`-free DOM to run
 * live, so — same convention as this file's other pacing/source-shape
 * regression tests (see `audio.test.ts`'s LFO-leak check) — this asserts
 * against the source text directly: the hold constant itself, and that the
 * interlude is cleared only *after* the veil has fully faded back out
 * (not before), so the card actually rides the fade as designed instead of
 * vanishing on a still-opaque screen.
 */
const flowSrc = readFileSync(new URL('../engine/flow.ts', import.meta.url), 'utf8');

describe('the end-of-act interlude holds long enough to read, and fades with the veil', () => {
  it('INTERLUDE_HOLD_MS is comfortably longer than the .interlude CSS fade-in (300ms)', () => {
    const match = flowSrc.match(/const INTERLUDE_HOLD_MS\s*=\s*(\d+);/);
    expect(match, 'INTERLUDE_HOLD_MS constant not found in flow.ts').not.toBeNull();
    const holdMs = Number(match![1]);
    // 300ms is the .interlude fade-in transition in styles.css; require at
    // least a 3x margin so localized floor names (which run longer than
    // English) still get a real, readable hold, not just a technically-
    // nonzero one.
    expect(holdMs).toBeGreaterThanOrEqual(900);
  });

  it('clearInterlude() is called after fade(false) resolves in syncTheme, not before', () => {
    const startIdx = flowSrc.indexOf('private async syncTheme(resuming = false)');
    expect(startIdx, 'syncTheme() not found').toBeGreaterThan(-1);
    const endIdx = flowSrc.indexOf('\n  private async runLoop', startIdx);
    const body = flowSrc.slice(startIdx, endIdx);

    const holdWaitIdx = body.indexOf('INTERLUDE_HOLD_MS');
    const fadeOutIdx = body.indexOf('await this.fade(false)');
    const clearIdx = body.indexOf('this.clearInterlude()');

    expect(holdWaitIdx, 'the INTERLUDE_HOLD_MS wait was not found in syncTheme').toBeGreaterThan(-1);
    expect(fadeOutIdx, 'the fade(false) call was not found in syncTheme').toBeGreaterThan(-1);
    expect(clearIdx, 'the clearInterlude() call was not found in syncTheme').toBeGreaterThan(-1);

    // Ordering must be: hold the card while opaque -> fade the veil back out
    // (the card, still `.show`n, fades with it) -> only then clear it.
    expect(holdWaitIdx).toBeLessThan(fadeOutIdx);
    expect(fadeOutIdx).toBeLessThan(clearIdx);
  });
});
