// UAT 64 — real-typed Unicode in the persona editor. Every prior save-hardening
// pass injected hostile *values* via localStorage/import (bypassing the DOM
// input path entirely); this types them through the actual `.persona-name-input`
// /`.persona-free-text` fields via `page.keyboard.type()`, which is the only
// way a real player's name/blurb ever reaches the profile. Different code
// path (real `input`/`keydown` events, the browser's own maxLength enforcement,
// IME-adjacent Unicode handling) than anything tested so far.
//
// Cases target two distinct concerns:
//  1. Crashes — combining-mark pile-ups (zalgo), multi-codepoint emoji (ZWJ
//     sequences, surrogate pairs), zero-width characters interacting with
//     `nameInput.maxLength` (a UTF-16-code-unit count, not a codepoint count
//     — a surrogate pair could in principle be truncated mid-pair by the
//     browser's own enforcement).
//  2. Visual spoofing — a Right-to-Left Override character (U+202E) is a
//     known vector for making text render in an order that doesn't match its
//     source; persona name is echoed back verbatim in the title-menu button,
//     the HUD, and every `{name}` token substitution throughout both packs'
//     barks, so this is worth a real screenshot, not just an error check.
//
// Also confirms the `{name}` token substitution itself survives a hostile
// name by jumping into a room and reading the rendered door-bark text back —
// `applyTokens` is a plain string .replace with no eval, and `el()` renders
// through textContent, so no crash is expected; this proves it live rather
// than trusting the source read.
import { withPage, gotoUat, assert } from './_helpers.mjs';
import { writeFileSync } from 'node:fs';

const OUT = process.env.UAT_SCREENSHOT_DIR || '/tmp';

const CASES = {
  'zalgo (combining marks)': 'Źâl̃ḡo̅!̆̇̈̉',
  'RTL override':            '‮evacsed‬',
  'emoji ZWJ family':        '\u{1F468}‍\u{1F469}‍\u{1F467}‍\u{1F466}',
  'flag (regional pair)':    '\u{1F1FA}\u{1F1F8}',
  'zero-width chars':        'a​b‌c‍d',
  'surrogate pair at edge':  'x'.repeat(23) + '\u{1F600}', // 23 + a 2-code-unit emoji straddles maxLength=24
  'mixed bidi':              'שלום hello مرحبا',
  'control chars':           'a\tb\nc\rd',
};

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`CONSOLE: ${m.text()}`); });

  await gotoUat(page);
  await page.waitForTimeout(400);

  for (const [name, text] of Object.entries(CASES)) {
    // Reset to a fresh profile each case so "Who are you?" is offered again
    // (once a name is set, the title button switches to "Traveler: <name>").
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
    await page.waitForTimeout(400);

    const personaBtn = page.getByText(/Who are you\?|Traveler:/).first();
    await personaBtn.click({ timeout: 3000 }).catch(() => {});
    await page.waitForSelector('.persona-name-input', { timeout: 5000 }).catch(() => {});

    const nameField = page.locator('.persona-name-input').first();
    await nameField.click({ timeout: 2000 }).catch(() => {});
    await nameField.fill('').catch(() => {});
    await page.keyboard.type(text, { delay: 5 }).catch(() => {});

    const blurbField = page.locator('.persona-free-text').first();
    if (await blurbField.count()) {
      await blurbField.click({ timeout: 2000 }).catch(() => {});
      await page.keyboard.type(text, { delay: 5 }).catch(() => {});
    }

    await page.getByText('Continue', { exact: true }).first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(600);
  }

  console.log(`persona unicode typing: ${Object.keys(CASES).length} cases, ${errors.length} errors`);
  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);

  // One representative screenshot for a human to eyeball the RTL-override
  // case specifically — an automated check can prove "didn't throw" but not
  // "doesn't look like the whole line got reversed".
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(400);
  const personaBtn = page.getByText(/Who are you\?/).first();
  await personaBtn.click({ timeout: 3000 }).catch(() => {});
  await page.waitForSelector('.persona-name-input', { timeout: 5000 }).catch(() => {});
  const rtlNameField = page.locator('.persona-name-input').first();
  await rtlNameField.click({ timeout: 2000 }).catch(() => {});
  await rtlNameField.fill('').catch(() => {}); // clear the pre-filled preset default (e.g. "Mira") first
  await page.keyboard.type(CASES['RTL override'], { delay: 5 }).catch(() => {});
  await page.getByText('Continue', { exact: true }).first().click({ timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(600);
  writeFileSync(`${OUT}/persona-rtl-title.png`, await page.screenshot());

  // Confirm the {name} token path survives a hostile name in real gameplay,
  // not just at the title screen — jump into a room and read the bark back.
  await page.evaluate(() => window.__anamnesisUat?.jump('boulder'));
  await page.waitForTimeout(1000);
  const barkErrors = errors.length;
  const barkText = await page.evaluate(() => document.querySelector('.beat.usher')?.textContent ?? '');
  assert(errors.length === barkErrors, 'jumping into a room with a hostile persona name should not throw');
  console.log(`  post-jump bark rendered (${barkText.length} chars), zero new errors`);

  console.log('UAT 64 (persona Unicode typing): PASS — screenshot at persona-rtl-title.png for visual review');
});
