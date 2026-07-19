// UAT 44 — end-screen Settings/Vestibule options + "you carried" recap
// (game-experience review E4/E5, 2026-07-19). E4: the end screen used to
// offer only Walk again / Field Notes / Title, bouncing every other
// post-run desire through Title first. E5: keepsakes carried into a run
// were never surfaced anywhere. Reaches a real end screen (same
// heart-death repro as UAT 23) with a keepsake seeded into the run,
// confirms the new Settings/Vestibule buttons render, that clicking
// Settings opens the real Settings panel and returns to the same end
// screen afterward, and that the "you carried" recap block names the
// seeded keepsake.
import { withPage, gotoUat, patchProfile, continueJourney, assert } from './_helpers.mjs';

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page);
  // Seed the keepsake into the profile BEFORE jump() stamps the run's
  // keepsakesHeld from it (keepsakesFromProfile() snapshots profile.keepsakes
  // at jump time) — patching it afterward would be too late.
  await patchProfile(page, (p) => {
    p.keepsakes = ['casino-chip'];
  });
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(500);

  await page.evaluate(() => window.__anamnesisUat.jump('photograph'));
  await page.waitForTimeout(1000);

  await patchProfile(page, (p) => {
    if (p.run) p.run.hearts = 1;
  });
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(500);

  await continueJourney(page);
  await page.waitForTimeout(600);

  for (let i = 0; i < 8; i++) {
    const cards = await page.locator('.choice-card').count();
    if (cards > 0) break;
    await page.locator('.text-panel').first().click({ timeout: 12000 }).catch(() => {});
    await page.waitForTimeout(300);
  }
  const target = page.locator('.choice-card', { hasText: /The photograph/i });
  assert((await target.count()) > 0, 'expected the heart-costing "the photograph" choice to be offered');
  await target.first().click();
  await page.waitForTimeout(800);

  for (let i = 0; i < 20; i++) {
    if ((await page.locator('.ending-epitaph').count()) > 0) break;
    if ((await page.locator('.fn-close').count()) > 0) {
      await page.locator('.fn-close').first().click({ timeout: 3000 }).catch(() => {});
    } else {
      await page.locator('.text-panel').first().click({ timeout: 3000 }).catch(() => {});
    }
    await page.waitForTimeout(500);
  }
  assert((await page.locator('.ending-epitaph').count()) > 0, 'end screen should have rendered');

  const morningReportText = await page.locator('.morning-report-block').allInnerTexts();
  const carriedBlock = morningReportText.find((t) => /you carried/i.test(t));
  assert(carriedBlock, `expected a "you carried" recap block; blocks found: ${JSON.stringify(morningReportText)}`);
  assert(/Unspent Chip/i.test(carriedBlock), `expected the recap to name the seeded keepsake, got: "${carriedBlock}"`);

  const settingsBtn = page.locator('.title-btn', { hasText: 'Settings' });
  assert((await settingsBtn.count()) > 0, 'end screen should offer a Settings button');
  // Dev server: the Vestibule button is intentionally hidden (no rozcestník
  // to navigate to locally) — only assert Settings here, matching F1's own
  // documented DEV-only gating.

  await settingsBtn.first().click();
  await page.waitForTimeout(400);
  const settingsPanelOpen = await page.locator('.settings-panel').count();
  assert(settingsPanelOpen > 0, 'clicking Settings from the end screen should open the real Settings panel');

  const doneBtn = page.locator('.settings-panel button', { hasText: /Done/i });
  await doneBtn.first().click({ timeout: 5000 }).catch(async () => {
    // Fallback: close via Escape if the button text differs by locale/build.
    await page.keyboard.press('Escape');
  });
  await page.waitForTimeout(400);

  const backOnEndScreen = await page.locator('.ending-epitaph').count();
  assert(backOnEndScreen > 0, 'closing Settings should return to the same end screen, not drop the player');

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log('UAT 44 (end-screen Settings/Vestibule options): PASS');
});
