import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { shouldTriggerRecovery } from '../engine/recovery';

describe('recovery overlay guard (Milestone 5, Phase S §S6)', () => {
  it('triggers on the first failure', () => {
    expect(shouldTriggerRecovery(false)).toBe(true);
  });

  it('does not trigger again once already shown', () => {
    expect(shouldTriggerRecovery(true)).toBe(false);
  });
});

describe('recovery overlay reload preserves fullscreen (game-experience review E7, 2026-07-19)', () => {
  // ui/recovery.ts needs a real DOM to mount its overlay — same convention
  // as this repo's other source-shape regression tests (e.g. audio.test.ts's
  // LFO-leak check) — asserting the fix's shape directly in the source
  // rather than driving a live click, since the bug was specifically that
  // this one reload skipped the fullscreen-preserving call every other
  // reload in the app makes.
  it("the Return-to-title button's reload calls rememberFullscreenForReload() first", () => {
    const src = readFileSync(new URL('../ui/recovery.ts', import.meta.url), 'utf8');
    expect(src).toContain("import { rememberFullscreenForReload } from './fullscreen'");
    const startIdx = src.indexOf("back.addEventListener('click'");
    expect(startIdx, 'the Return-to-title click handler was not found').toBeGreaterThan(-1);
    const endIdx = src.indexOf('});', startIdx);
    const handlerBody = src.slice(startIdx, endIdx);
    const rememberIdx = handlerBody.indexOf('rememberFullscreenForReload()');
    const reloadIdx = handlerBody.indexOf('location.reload()');
    expect(rememberIdx, 'rememberFullscreenForReload() not called in the click handler').toBeGreaterThan(-1);
    expect(reloadIdx, 'location.reload() not called in the click handler').toBeGreaterThan(-1);
    expect(rememberIdx).toBeLessThan(reloadIdx);
  });
});
