import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { hashKey } from '../engine/storyEngine';

// Game-experience review fix batch (2026-07-21, following up
// `16-full-review-2026-07-20.md`): N1, R4, S2, S3, S4, H1, H2, H3. Same
// source-shape convention as this repo's other DOM-dependent regression
// tests (interludeTiming, resumedMidRoom, usherMotion) — flow.ts/
// overlays.ts/textPanel.ts need a real browser to drive live.

const flowSrc = readFileSync(new URL('../engine/flow.ts', import.meta.url), 'utf8');
const overlaysSrc = readFileSync(new URL('../ui/overlays.ts', import.meta.url), 'utf8');
const textPanelSrc = readFileSync(new URL('../ui/textPanel.ts', import.meta.url), 'utf8');

describe('N1 — end-screen data re-resolves language on every Settings-in-loop iteration', () => {
  it('buildEndScreenData is a closure invoked fresh inside the for(;;) loop, not computed once before it', () => {
    const closureIdx = flowSrc.indexOf('const buildEndScreenData = () => (');
    expect(closureIdx, 'buildEndScreenData not found').toBeGreaterThan(-1);
    const loopIdx = flowSrc.indexOf('for (;;) {', closureIdx);
    expect(loopIdx).toBeGreaterThan(closureIdx);
    const loopBody = flowSrc.slice(loopIdx, flowSrc.indexOf('\n    }', loopIdx));
    expect(loopBody).toContain('...buildEndScreenData(),');
  });
});

describe('R4 — "doors you never opened" is salted by the run\'s own doorSeed, not room-declaration order', () => {
  it('hashKey is exported and reused inside buildEndScreenData\'s doorsNeverOpened sort', () => {
    expect(typeof hashKey).toBe('function');
    const closureIdx = flowSrc.indexOf('const buildEndScreenData = () => (');
    const loopIdx = flowSrc.indexOf('\n    for (;;) {', closureIdx);
    const body = flowSrc.slice(closureIdx, loopIdx > closureIdx ? loopIdx : flowSrc.length);
    expect(body).toContain('doorsNeverOpened');
    expect(body).toContain('hashKey(a.id, this.state.doorSeed');
    expect(body).toContain('hashKey(b.id, this.state.doorSeed');
  });

  it('hashKey is deterministic and salt-sensitive (pure function contract the sort relies on)', () => {
    expect(hashKey('the-cave', 1)).toBe(hashKey('the-cave', 1));
    expect(hashKey('the-cave', 1)).not.toBe(hashKey('the-cave', 2));
  });
});

describe('S2 — showCredits closes on Escape, matching every sibling overlay', () => {
  it('showCredits registers and cleans up an Escape listener before resolving', () => {
    const startIdx = overlaysSrc.indexOf('export function showCredits(');
    const endIdx = overlaysSrc.indexOf('\nexport function showRoomArticle', startIdx);
    const body = overlaysSrc.slice(startIdx, endIdx > startIdx ? endIdx : overlaysSrc.length);
    expect(body).toContain("if (e.key === 'Escape') close();");
    expect(body).toContain("addEventListener('keydown', onEscape);");
    expect(body).toContain("removeEventListener('keydown', onEscape);");
  });
});

describe('S3 — locked codex cards are disabled, not just visually dimmed', () => {
  // U-2 (extended review, 2026-08-01) widened this same guard to also cover
  // an unlocked card with no note to show (the last-message hook room
  // before it's ever unlocked with a real message) — same invariant
  // (never leave a no-op card enabled), one more case included.
  it('addCard sets card.disabled = true when the room is unlocked === false, or unlocked with no note', () => {
    const idx = overlaysSrc.indexOf('const addCard = (');
    expect(idx, 'addCard not found').toBeGreaterThan(-1);
    const body = overlaysSrc.slice(idx, idx + 1400);
    expect(body).toContain('if (!unlocked || !note) card.disabled = true;');
  });
});

describe('S4 — confirmButton disarms on the Import button\'s failed-import path', () => {
  it('confirmButton passes disarm into onConfirm', () => {
    const idx = overlaysSrc.indexOf('function confirmButton(');
    expect(idx, 'confirmButton not found').toBeGreaterThan(-1);
    const body = overlaysSrc.slice(idx, overlaysSrc.indexOf('\n}', idx));
    expect(body).toContain('onConfirm: (disarm: () => void) => void');
    expect(body).toContain('onConfirm(disarm);');
  });

  it('the Import button calls disarm() only when the import failed', () => {
    const idx = overlaysSrc.indexOf("t(uiKey('importProfileButton')");
    expect(idx, 'Import button not found').toBeGreaterThan(-1);
    const body = overlaysSrc.slice(idx, idx + 1200);
    expect(body).toContain('if (!ok) disarm();');
  });
});

describe('H1 — audio priming fires on click/keydown/pointerdown, not pointerdown alone', () => {
  it('registers a one-shot priming listener for each of the three gesture types', () => {
    const idx = flowSrc.indexOf("addEventListener(type, () => sound.primeOnGesture()");
    expect(idx, 'primeOnGesture listener registration not found').toBeGreaterThan(-1);
    const region = flowSrc.slice(Math.max(0, idx - 200), idx + 200);
    expect(region).toContain("for (const type of ['click', 'keydown', 'pointerdown'] as const)");
    expect(region).toContain("addEventListener(type, () => sound.primeOnGesture(), { once: true, capture: true });");
  });
});

describe('H2 — beat-progress dots are keyboard-reachable and the advance key does not double-fire on a focused child', () => {
  it('beat-dots get tabindex="0" so Tab can reach them at all', () => {
    const idx = textPanelSrc.indexOf('const dotEls = texts.map(');
    expect(idx, 'dotEls not found').toBeGreaterThan(-1);
    const body = textPanelSrc.slice(idx, idx + 500);
    expect(body).toContain("d.setAttribute('tabindex', '0');");
  });

  it('each dot has its own Enter/Space keydown handler (a role="button" div does not auto-synthesize click)', () => {
    const idx = textPanelSrc.indexOf('const keyHandler = (e: KeyboardEvent) => {');
    expect(idx, 'keyHandler not found').toBeGreaterThan(-1);
    const body = textPanelSrc.slice(idx, idx + 400);
    expect(body).toContain("d.addEventListener('keydown', keyHandler);");
  });

  it('waitAdvance\'s window-level onKey defers to a focused interactive child of the panel', () => {
    const idx = textPanelSrc.indexOf('const onKey = (e: KeyboardEvent) => {');
    expect(idx, 'onKey not found').toBeGreaterThan(-1);
    const body = textPanelSrc.slice(idx, idx + 1200);
    expect(body).toContain('panel.contains(active)');
  });
});

describe('H3 — the end screen\'s Settings panel no longer offers "Reset current run" for an already-finished run', () => {
  it('hasRun requires !this.state.finished alongside this.inGame', () => {
    const idx = flowSrc.indexOf('hasRun: (this.inGame && !this.state.finished)');
    expect(idx, 'guarded hasRun computation not found').toBeGreaterThan(-1);
  });
});
