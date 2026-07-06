// UAT 04 — keepsakes + the Codex Shelf (spec 04). Jumps to the Casino of
// Pascal, takes the "interrogate" choice (earns the sharp-gambler flag →
// casino-chip keepsake immediately, per spec), reloads, and confirms the
// Shelf shows it as earned (not the "unearned" placeholder state).
import { withPage, gotoUat, readProfile, advance, clickChoiceMatching, assert } from './_helpers.mjs';

await withPage(async (page) => {
  await gotoUat(page);
  await page.evaluate(() => window.__anamnesisUat.jump('casino-pascal'));
  await page.waitForTimeout(1200);

  await advance(page, 10, 300);

  const clicked = await clickChoiceMatching(page, /who sets these odds/i);
  assert(clicked != null, 'should be able to click the "interrogate" choice at the Casino of Pascal');
  await page.waitForTimeout(600);

  const profile = await readProfile(page);
  assert(
    profile?.keepsakes?.includes('casino-chip'),
    `casino-chip keepsake should be earned immediately; profile.keepsakes = ${JSON.stringify(profile?.keepsakes)}`,
  );

  // Reload back to the title screen and check the Shelf.
  await page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    const parsed = JSON.parse(raw);
    parsed.run = null; // force the title screen instead of "Continue"
    localStorage.setItem(key, JSON.stringify(parsed));
  }, 'anamnesis:profile:traveler');
  await page.reload();
  await page.waitForTimeout(1000);

  await page.getByText('Field Notes', { exact: false }).click();
  await page.waitForTimeout(600);

  const chipItem = page.locator('.shelf-item', { hasText: /./ }).filter({ hasNot: page.locator('.shelf-placeholder') });
  const earnedCount = await chipItem.count();
  assert(earnedCount > 0, 'the Shelf should show at least one earned keepsake item');

  const unearnedOnly = await page.locator('.shelf-item.unearned').count();
  const totalItems = await page.locator('.shelf-item').count();
  assert(unearnedOnly < totalItems, 'the casino-chip keepsake should not be in the "unearned" state');

  console.log('UAT 04 (keepsakes + Shelf): PASS');
});
