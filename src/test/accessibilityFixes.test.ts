import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

// Both fixes here need a real DOM (document.documentElement, aria-live
// announcement timing) that this vitest environment doesn't have — see
// audio.test.ts's and resumableRun.test.ts's own notes on the same
// constraint. Source-level checks pin the fix's shape; the browser UAT
// suite covers the actually-observable behavior.

describe('applyLocaleToDocument sets documentElement.lang (Fable review, M5)', () => {
  it('assigns document.documentElement.lang, not just dir/RTL classes', () => {
    const src = readFileSync(new URL('../ui/locale.ts', import.meta.url), 'utf8');
    const startIdx = src.indexOf('export function applyLocaleToDocument(');
    const endIdx = src.indexOf('\n}', startIdx);
    const body = src.slice(startIdx, endIdx);
    expect(body, 'applyLocaleToDocument not found').not.toBe('');
    expect(body).toContain('document.documentElement.lang = lang');
  });
});

describe("TextPanel's typewriter suppresses aria-live during typing (Fable review, M5)", () => {
  it('removes aria-live before the per-character loop and restores it only once, on the final full text', () => {
    const src = readFileSync(new URL('../ui/textPanel.ts', import.meta.url), 'utf8');
    const startIdx = src.indexOf('private async showBeat(');
    const endIdx = src.indexOf('\n  }', startIdx);
    const body = src.slice(startIdx, endIdx);
    expect(body, 'showBeat not found').not.toBe('');

    const removeIdx = body.indexOf("beatEl.removeAttribute('aria-live')");
    const loopIdx = body.indexOf('for (let i = 0; i < text.length; i += 2)');
    const finalTextIdx = body.lastIndexOf("beatEl.textContent = text;");
    const restoreIdx = body.indexOf("beatEl.setAttribute('aria-live', 'polite')");

    expect(removeIdx, 'aria-live must be removed before the typewriter loop').toBeGreaterThan(-1);
    expect(removeIdx).toBeLessThan(loopIdx);
    expect(restoreIdx, 'aria-live must be restored after typing finishes').toBeGreaterThan(loopIdx);
    // The final full-text assignment must happen no later than the restore —
    // restoring aria-live before the announced content is in place would
    // announce a stale partial string instead of the finished beat.
    expect(finalTextIdx).toBeLessThanOrEqual(restoreIdx);
  });
});
