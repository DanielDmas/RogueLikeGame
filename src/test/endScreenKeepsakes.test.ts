import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Game-experience review E4/E5 (2026-07-19, `15-game-experience-review.md`):
 * E4 — the end screen offered only Walk again / Field Notes / Title, bouncing
 * every other post-run desire (Settings, Vestibule) through Title first.
 * E5 — keepsakes were earned and carried silently by design, but nothing
 * ever told the player they were holding one, and nothing confirmed what
 * spending one did.
 *
 * `overlays.ts`/`flow.ts` need a real DOM to render/drive live — same
 * convention as this repo's other such regression tests (interludeTiming,
 * recovery, resumedMidRoom) — so these assert the fix's shape directly
 * against the source.
 */

const overlaysSrc = readFileSync(new URL('../ui/overlays.ts', import.meta.url), 'utf8');
const flowSrc = readFileSync(new URL('../engine/flow.ts', import.meta.url), 'utf8');

describe('E4 — end screen offers Settings and Vestibule, not just Title', () => {
  it("showEndScreen's return type includes 'settings' | 'vestibule'", () => {
    const sigIdx = overlaysSrc.indexOf('export function showEndScreen(');
    expect(sigIdx).toBeGreaterThan(-1);
    const sigEnd = overlaysSrc.indexOf('{', sigIdx);
    const signature = overlaysSrc.slice(sigIdx, sigEnd);
    expect(signature).toContain("'settings'");
    expect(signature).toContain("'vestibule'");
  });

  it('the end-screen button row builds a settings button and a dev-gated vestibule button', () => {
    const startIdx = overlaysSrc.indexOf('export function showEndScreen(');
    const endIdx = overlaysSrc.indexOf('\nexport function clearOverlays', startIdx);
    const body = overlaysSrc.slice(startIdx, endIdx > startIdx ? endIdx : overlaysSrc.length);
    expect(body).toContain("mk(t(uiKey('settings'), 'Settings'), 'settings', true);");
    expect(body).toContain("if (!import.meta.env.DEV) mk(t(uiKey('vestibuleButton')");
  });

  it("flow.ts's end-screen loop handles 'settings' (reshow the screen) and 'vestibule' (navigate away)", () => {
    const loopIdx = flowSrc.indexOf('for (;;) {\n      const action = await showEndScreen(');
    expect(loopIdx, 'end-screen action loop not found').toBeGreaterThan(-1);
    const loopEnd = flowSrc.indexOf("if (action === 'again') {", loopIdx);
    const branch = flowSrc.slice(loopIdx, loopEnd);
    const settingsIdx = branch.indexOf("if (action === 'settings') {");
    const vestibuleIdx = branch.indexOf("if (action === 'vestibule') {");
    expect(settingsIdx, "'settings' branch not found before 'again'").toBeGreaterThan(-1);
    expect(vestibuleIdx, "'vestibule' branch not found before 'again'").toBeGreaterThan(-1);
    // The settings branch must loop back to the end screen (continue), not
    // fall through to the reload-to-title fallback.
    const settingsBranch = branch.slice(settingsIdx, branch.indexOf('}', branch.indexOf('continue;', settingsIdx)) + 1);
    expect(settingsBranch).toContain('continue;');
    const vestibuleBranch = branch.slice(vestibuleIdx, branch.indexOf('}', branch.indexOf('return;', vestibuleIdx)) + 1);
    expect(vestibuleBranch).toContain('this.navigateToVestibule();');
  });
});

describe('E5 — keepsake held-resource visibility', () => {
  it("enterRoom shows a spent-confirmation toast when a choice carries a keepsakeId", () => {
    const startIdx = flowSrc.indexOf('private async enterRoom(');
    const endIdx = flowSrc.indexOf('\n  private async playOneDoor(', startIdx);
    const body = flowSrc.slice(startIdx, endIdx > startIdx ? endIdx : flowSrc.length);
    expect(body).toContain('if (choice.keepsakeId) {');
    expect(body).toContain('showKeepsakeSpentToast(this.ui, t(keepsakeKey(def.id, ');
  });

  it('playEnding computes keepsakesCarried from RunState.keepsakesHeld and passes it to showEndScreen', () => {
    // N1 (2026-07-20, `16-full-review-2026-07-20.md` §3) moved this from a
    // once-computed `const` before the loop into `buildEndScreenData()`, a
    // closure re-invoked on every end-screen loop iteration — so a language
    // switch via the end screen's own Settings action no longer leaves
    // stale-language text on screen. The keepsakesCarried computation
    // itself is unchanged; only its home moved.
    const closureIdx = flowSrc.indexOf('const buildEndScreenData = () => (');
    expect(closureIdx, 'buildEndScreenData closure not found').toBeGreaterThan(-1);
    const closureEnd = flowSrc.indexOf('\n    for (;;) {', closureIdx);
    const closureBody = flowSrc.slice(closureIdx, closureEnd > closureIdx ? closureEnd : flowSrc.length);
    expect(closureBody).toContain('keepsakesCarried: (this.state.keepsakesHeld ?? [])');
    const showIdx = flowSrc.indexOf('await showEndScreen(this.ui, {', closureEnd);
    const showEnd = flowSrc.indexOf('});', showIdx);
    const call = flowSrc.slice(showIdx, showEnd);
    expect(call).toContain('...buildEndScreenData(),');
  });

  it('EndScreenData declares keepsakesCarried and showEndScreen renders a "you carried" block', () => {
    expect(overlaysSrc).toContain('keepsakesCarried?: string[];');
    expect(overlaysSrc).toContain("t(uiKey('keepsakesCarriedHeader'), 'you carried')");
  });

  it('showKeepsakeSpentToast exists in toast.ts, distinct from the save/restore toasts', () => {
    const toastSrc = readFileSync(new URL('../ui/toast.ts', import.meta.url), 'utf8');
    expect(toastSrc).toContain('export function showKeepsakeSpentToast(');
    expect(toastSrc).toContain("uiKey('keepsakeSpentToast')");
  });
});
