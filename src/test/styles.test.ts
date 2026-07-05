import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, '../styles.css'), 'utf-8');

function rule(selector: string): string {
  const escaped = selector.replace(/[.#]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`selector not found: ${selector}`);
  return match[1];
}

describe('text panel width — widened for a text-driven game', () => {
  it('.text-panel is wider than the old 760px cap', () => {
    expect(rule('.text-panel')).toContain('1040px');
  });

  it('.beat paragraph column is wider than the old 68ch cap, at the same font size', () => {
    const beat = rule('.beat');
    expect(beat).toContain('84ch');
    expect(beat).toContain('17.5px'); // font size unchanged, per the request
  });

  it('.choices matches the widened text panel so cards stay aligned', () => {
    expect(rule('.choices')).toContain('1040px');
  });
});

describe('field-note stacking — must render above the codex overlay that can open it', () => {
  it('.field-note z-index is higher than .overlay z-index', () => {
    const fieldNoteZ = Number(rule('.field-note').match(/z-index:\s*(\d+)/)?.[1]);
    const overlayZ = Number(rule('.overlay').match(/z-index:\s*(\d+)/)?.[1]);
    expect(fieldNoteZ).toBeGreaterThan(overlayZ);
  });
});
