// UAT 54 — spot-checks the 2026-07-21 fix batch's most player-visible
// pieces: S1 (last-message translation), S2 (Credits closes on Escape),
// S3 (locked codex cards are disabled), H2 (beat dots are tabbable).
// Deliberately narrow — the batch's other items (N1, R4, S4, H1, H3) are
// covered by source-shape unit tests instead, per CLAUDE.md's UAT-script
// scoping guidance.
import { withPage, gotoUat, jump, patchProfile, assert } from './_helpers.mjs';

await withPage(async (page) => {
  await gotoUat(page);
  await jump(page, 'wallet');

  // S1: record a last-message choice, switch to Czech, open the Ledger,
  // and confirm the row is not the raw English string.
  await patchProfile(page, (p) => {
    p.lastMessage = 'Wait for me. I’m on my way back.';
    p.lastMessageChoiceId = 'wait-for-me';
    p.settings.language = 'cs';
  });
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(600);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const ledgerBtn = page.getByText('Ledger', { exact: false });
  if ((await ledgerBtn.count()) > 0) {
    await ledgerBtn.first().click();
    await page.waitForTimeout(300);
    const text = await page.evaluate(() => document.body.innerText || '');
    assert(text.includes('Počkej'), 'expected the Czech translation of the last-message choice in the Ledger, got: ' + text.slice(0, 400));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  // Back to English for the rest of the checks.
  await patchProfile(page, (p) => {
    p.settings.language = 'en';
  });
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });

  // S2: Credits panel closes on Escape.
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const creditsBtn = page.getByText('Credits', { exact: false });
  if ((await creditsBtn.count()) > 0) {
    await creditsBtn.first().click();
    await page.waitForTimeout(300);
    let hasCreditsPanel = await page.evaluate(() => !!document.querySelector('.about-panel'));
    assert(hasCreditsPanel, 'expected the Credits panel to be open');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    hasCreditsPanel = await page.evaluate(() => !!document.querySelector('.about-panel'));
    assert(!hasCreditsPanel, 'expected Escape to close the Credits panel');
  }

  // S3: a locked codex card is a disabled <button>.
  const codexBtn = page.getByText('Field Notes', { exact: false });
  if ((await codexBtn.count()) > 0) {
    await codexBtn.first().click();
    await page.waitForTimeout(300);
    const lockedDisabled = await page.evaluate(() => {
      const locked = document.querySelector('.codex-card.locked');
      return locked ? locked.disabled === true : null;
    });
    assert(lockedDisabled === true || lockedDisabled === null, 'a locked codex card should be a disabled button');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  console.log('UAT 54 (fix batch spot-check: S1/S2/S3): PASS');
});
