// UAT 36 — companion to UAT 35: exercises the two remaining "Read more"
// call sites (the Codex overlay, which reopens a field note for an
// already-visited room) and a LIMERENCE room, confirming the
// above-field-note z-index fix (styles.css/overlays.ts) holds for every
// wiring site, not just the live in-room one UAT 35 covers.
import { withPage, gotoUat, assert } from './_helpers.mjs';

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  // --- Part 1: ANAMNESIS Codex overlay's "Read more" wiring ---
  // codexUnlocked is only stamped once the room's own field note has been
  // shown AND dismissed (flow.ts: the push happens right after
  // `showFieldNote` resolves) — so the room must actually be played
  // through, not just jumped into, before it will appear as an unlocked
  // Codex card.
  await gotoUat(page);
  await page.evaluate(() => window.__anamnesisUat.jump('wallet'));
  await page.waitForTimeout(1200);
  for (let i = 0; i < 20; i++) {
    if ((await page.locator('.field-note').count()) > 0) break;
    const cards = await page.locator('.choice-card').count();
    if (cards > 0) {
      await page.locator('.choice-card').first().click({ timeout: 5000 }).catch(() => {});
    } else {
      await page.locator('.text-panel').first().click({ timeout: 5000 }).catch(() => {});
    }
    await page.waitForTimeout(400);
  }
  assert((await page.locator('.field-note').count()) > 0, 'expected the wallet field note during the initial playthrough');
  await page.locator('.fn-close').first().click({ timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(500);

  // Dismissing the field note immediately rolls into the next-door-choice
  // screen; give that transition a moment to settle, then retry Escape a
  // few times in case one keypress lands mid-transition.
  for (let i = 0; i < 5 && (await page.locator('.overlay').count()) === 0; i++) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }
  const exitBtn = page.getByText('Save & exit to title', { exact: false });
  assert((await exitBtn.count()) > 0, 'expected the pause menu\'s "Save & exit to title" button');
  await exitBtn.first().click();
  // "Save & exit to title" does a full location.reload(); wait for the
  // debug handle to reattach (same signal gotoUat waits for) rather than a
  // fixed timeout, since the reload/rebuild can take longer than 600ms.
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 15000 });
  await page.waitForTimeout(500);

  const codexBtn = page.locator('.title-btn', { hasText: /Field Notes/i });
  assert((await codexBtn.count()) > 0, 'expected a "Field Notes" button on the title menu');
  await codexBtn.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);

  const walletCard = page.locator('.codex-card', { hasText: /Gyges|Wallet|Ring/i });
  assert((await walletCard.count()) > 0, 'expected an unlocked codex card for the wallet room');
  await walletCard.first().click();
  await page.waitForTimeout(500);
  assert((await page.locator('.field-note').count()) > 0, 'expected the codex card click to open a field note');

  const readMore = page.locator('.fn-read-more');
  assert((await readMore.count()) > 0, 'expected a Read more button on the codex-opened field note');
  await readMore.first().click();
  await page.waitForTimeout(500);
  assert((await page.locator('.article-panel').count()) > 0, 'expected the article overlay to open from the Codex path');

  const backBtn = page.locator('.article-panel button', { hasText: /Back/i });
  await backBtn.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
  assert((await page.locator('.article-panel').count()) === 0, 'article overlay should close after Back (Codex path)');
  assert((await page.locator('.field-note').count()) > 0, 'field note should still be open after closing the article (Codex path)');
  console.log('  Codex path: Read more opened the article on top of the field note and Back returned cleanly.');

  // --- Part 2: LIMERENCE room field note + article ---
  await gotoUat(page, 'pack=limerence&uat=1');
  await page.evaluate(() => window.__anamnesisUat.jump('the-read-receipt'));
  await page.waitForTimeout(1200);
  for (let i = 0; i < 20; i++) {
    if ((await page.locator('.field-note').count()) > 0) break;
    const cards = await page.locator('.choice-card').count();
    if (cards > 0) {
      await page.locator('.choice-card').first().click({ timeout: 5000 }).catch(() => {});
    } else {
      await page.locator('.text-panel').first().click({ timeout: 5000 }).catch(() => {});
    }
    await page.waitForTimeout(400);
  }
  assert((await page.locator('.field-note').count()) > 0, 'expected field note for the-read-receipt');
  const limReadMore = page.locator('.fn-read-more');
  assert((await limReadMore.count()) > 0, 'expected a Read more button on the-read-receipt field note');
  await limReadMore.first().click();
  await page.waitForTimeout(500);
  assert((await page.locator('.article-panel').count()) > 0, 'expected the LIMERENCE article overlay to open');
  const limBody = await page.locator('.article-panel .article-body').innerText();
  assert(limBody.length > 400, `LIMERENCE article body should be substantial, got ${limBody.length} chars`);
  const limBack = page.locator('.article-panel button', { hasText: /Back/i });
  await limBack.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
  assert((await page.locator('.article-panel').count()) === 0, 'LIMERENCE article overlay should close after Back');
  console.log('  LIMERENCE: the-read-receipt article opened with real content and closed cleanly via Back.');

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log('UAT 36 (Read more — Codex + LIMERENCE): PASS');
});
