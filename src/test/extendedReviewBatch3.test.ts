import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Extended code review, third pass (2026-08-01): U-1, U-2, U-3, U-6, U-7,
// U-8, B-1, B-2. Same source-shape convention as this repo's other
// DOM-dependent regression tests (fixBatch20260721, resumedMidRoom,
// usherMotion) — overlays.ts/choices.ts/flow.ts/main.ts need a real
// browser to drive live; vitest runs with no DOM (`environment: 'node'`).

const choicesSrc = readFileSync(new URL('../ui/choices.ts', import.meta.url), 'utf8');
const overlaysSrc = readFileSync(new URL('../ui/overlays.ts', import.meta.url), 'utf8');
const flowSrc = readFileSync(new URL('../engine/flow.ts', import.meta.url), 'utf8');
const mainSrc = readFileSync(new URL('../main.ts', import.meta.url), 'utf8');
const localSaveSrc = readFileSync(new URL('../engine/localSave.ts', import.meta.url), 'utf8');

describe('U-1 — the choice screen focuses the first real choice, not the reread button', () => {
  it("mount() prefers 'button.choice-card' over a bare 'button' query", () => {
    const startIdx = choicesSrc.indexOf('private mount(');
    expect(startIdx, 'mount() not found').toBeGreaterThan(-1);
    const endIdx = choicesSrc.indexOf('\n  }', startIdx);
    const body = choicesSrc.slice(startIdx, endIdx);
    expect(body).toContain("wrap.querySelector('button.choice-card')");
    // the reread button (F4) is always appended before the choice cards in
    // pick() — confirming that ordering is what made the old bare query wrong.
    const pickIdx = choicesSrc.indexOf('pick(');
    const pickBody = choicesSrc.slice(pickIdx, choicesSrc.indexOf('choices.forEach', pickIdx));
    expect(pickBody).toContain('rereadBtn');
  });
});

describe('U-2 — Register/Codex cards with no click handler are disabled, not silently inert', () => {
  it("showCodex's addCard disables a card that is unlocked but has no note (the last-message edge case), not just locked cards", () => {
    const startIdx = overlaysSrc.indexOf('const addCard = (');
    expect(startIdx, 'addCard not found').toBeGreaterThan(-1);
    const endIdx = overlaysSrc.indexOf('\n    };', startIdx);
    const body = overlaysSrc.slice(startIdx, endIdx);
    expect(body).toContain('if (!unlocked || !note) card.disabled = true;');
  });

  it('showHotelRegister disables unvisited-door cards and visited-but-noteless cards alike', () => {
    const startIdx = overlaysSrc.indexOf('export function showHotelRegister(');
    expect(startIdx, 'showHotelRegister not found').toBeGreaterThan(-1);
    const loopIdx = overlaysSrc.indexOf('for (const room of visibleRooms) {', startIdx);
    expect(loopIdx, 'the per-room loop not found').toBeGreaterThan(-1);
    const loopEnd = overlaysSrc.indexOf('\n      section.append(doors);', loopIdx);
    const loopBody = overlaysSrc.slice(loopIdx, loopEnd);
    // Two distinct disable sites: the visited-but-no-fieldNote case (the
    // last-message hook room, which composes no note of its own in this
    // overlay — nested inside `if (visited) { if (room.fieldNote) {...}
    // else { <here> } }`) and the unvisited-door case (`if (visited) {...}
    // else { <here> }`).
    const disabledCount = (loopBody.match(/card\.disabled = true;/g) ?? []).length;
    expect(disabledCount, 'expected both the visited-noteless and unvisited branches to disable the card').toBe(2);
  });
});

describe('U-3 — the persona panel closes on Escape, same as every sibling overlay', () => {
  it('showPersona wires an Escape handler that resolves with the persona UNCHANGED (not Skip\'s clear semantics)', () => {
    const startIdx = overlaysSrc.indexOf('export function showPersona(');
    expect(startIdx, 'showPersona not found').toBeGreaterThan(-1);
    const endIdx = overlaysSrc.indexOf('\nexport function', startIdx + 1);
    const body = overlaysSrc.slice(startIdx, endIdx);
    expect(body).toMatch(/const onEscape = \(e: KeyboardEvent\) => \{/);
    expect(body).toContain("if (e.key === 'Escape')");
    expect(body).toContain('resolve(persona);');
    expect(body).toContain("addEventListener('keydown', onEscape);");
    // Escape's resolve(persona) must be a different object than Skip's
    // resolve({ preset: '', name: '', blurb: '' }) — same file, two
    // deliberately different outcomes for two deliberately different actions.
    expect(body).toContain("resolve({ preset: '', name: '', blurb: '' });");
  });
});

describe('U-6/U-7 — title-screen Settings/Exit match the pause menu\'s own feedback and persist-before-close', () => {
  it("the title loop's 'settings' branch calls persist(true), matching the pause menu and HUD gear", () => {
    const startIdx = flowSrc.indexOf("} else if (action === 'settings') {");
    expect(startIdx, "title loop's settings branch not found").toBeGreaterThan(-1);
    const endIdx = flowSrc.indexOf('} else if', startIdx + 1);
    const body = flowSrc.slice(startIdx, endIdx);
    expect(body).toContain('await this.persist(true);');
  });

  it("the title loop's 'exit' branch persists before window.close(), matching the pause menu's exit branch", () => {
    const startIdx = flowSrc.indexOf("} else if (action === 'exit') {");
    expect(startIdx, "title loop's exit branch not found").toBeGreaterThan(-1);
    const endIdx = flowSrc.indexOf('} else if', startIdx + 1);
    const body = flowSrc.slice(startIdx, endIdx);
    const persistIdx = body.indexOf('await this.persist();');
    const closeIdx = body.indexOf('window.close();');
    expect(persistIdx, 'persist() not called').toBeGreaterThan(-1);
    expect(closeIdx, 'window.close() not called').toBeGreaterThan(-1);
    expect(persistIdx).toBeLessThan(closeIdx);
  });
});

describe('U-8 — a secret door shows its numeral alongside the star, matching its real keyboard shortcut', () => {
  it("pickDoor's num span shows '✦{n}' for a secret door, not a bare '✦'", () => {
    const startIdx = choicesSrc.indexOf('pickDoor(');
    expect(startIdx, 'pickDoor not found').toBeGreaterThan(-1);
    const endIdx = choicesSrc.indexOf('return { promise, chooseExternally', startIdx);
    const body = choicesSrc.slice(startIdx, endIdx);
    expect(body).toContain("d.secret ? `✦${i + 1}` : String(i + 1)");
  });
});

describe('B-1 — the crash-recovery net installs before the async pack import, not after', () => {
  it('installRecoveryHandlers is called before await loadPack() in boot()', () => {
    const bootIdx = mainSrc.indexOf('async function boot()');
    expect(bootIdx, 'boot() not found').toBeGreaterThan(-1);
    const installIdx = mainSrc.indexOf('installRecoveryHandlers(ui, canvas);', bootIdx);
    const loadPackIdx = mainSrc.indexOf('await loadPack();', bootIdx);
    expect(installIdx, 'installRecoveryHandlers call not found').toBeGreaterThan(-1);
    expect(loadPackIdx, 'await loadPack() not found').toBeGreaterThan(-1);
    expect(installIdx).toBeLessThan(loadPackIdx);
  });
});

describe('B-2 — a failed backup write never masquerades as primary-save corruption', () => {
  it('the backup localStorage.setItem is wrapped in its own try/catch, separate from the outer parse/hydrate catch', () => {
    const loadIdx = localSaveSrc.indexOf('async load(profileId: string): Promise<Profile> {');
    expect(loadIdx, 'load() not found').toBeGreaterThan(-1);
    const endIdx = localSaveSrc.indexOf('\n  }', localSaveSrc.indexOf('wasReset()', loadIdx));
    const body = localSaveSrc.slice(loadIdx, endIdx);
    const setItemIdx = body.indexOf('localStorage.setItem(backupKey, raw);');
    expect(setItemIdx, 'backup setItem not found').toBeGreaterThan(-1);
    // The nearest enclosing try/catch around the setItem must close before
    // the outer catch clause that loads the OLD backup and sets
    // restoredFromBackup — i.e. there are two `try {` occurrences before it.
    const tryCount = (body.slice(0, setItemIdx).match(/try \{/g) ?? []).length;
    expect(tryCount, 'expected the backup write to be inside a second, inner try').toBe(2);
  });
});
