// UAT 32 — a genuinely impatient clicking user, both packs. Not a targeted
// assertion script like the others: opens every title-screen overlay in a
// random order, closes some via Escape and some via their own close
// button, double-clicks buttons, clicks the same overlay open twice in a
// row, and switches between the two packs mid-session — the kind of
// undirected poking a real first-time visitor does. Zero console/page
// errors is the only bar.
import { withPage, gotoUat, assert } from './_helpers.mjs';

const OVERLAY_BUTTONS = ['Field Notes', "Traveler's Ledger", 'The Register', 'Before you begin', 'Credits', 'Settings'];

async function pokeAround(page, packQuery, label, rounds) {
  await gotoUat(page, packQuery);
  await page.waitForTimeout(400);

  for (let i = 0; i < rounds; i++) {
    const button = OVERLAY_BUTTONS[Math.floor(Math.random() * OVERLAY_BUTTONS.length)];
    const btn = page.getByText(button, { exact: false }).first();
    if ((await btn.count()) === 0) continue;
    await btn.click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(200);
    // Sometimes double-click (nothing should break re-opening or no-oping).
    if (Math.random() < 0.3) {
      await btn.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(150);
    }
    // Close via Escape half the time, the panel's own Back/Done otherwise.
    if (Math.random() < 0.5) {
      await page.keyboard.press('Escape');
    } else {
      const closeBtn = page.getByText(/^(Back|Done)$/, { exact: true }).first();
      if ((await closeBtn.count()) > 0) await closeBtn.click({ timeout: 2000 }).catch(() => {});
      else await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(200);
  }
  console.log(`  ${label}: ${rounds} rounds of open/close-random-overlay poking, no throw`);
}

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await pokeAround(page, 'uat=1', 'ANAMNESIS', 10);
  await pokeAround(page, 'pack=limerence&uat=1', 'LIMERENCE', 10);

  // One more thing an impatient user does: mash a door row with rapid
  // clicks on different cards before any of them can react.
  await page.evaluate(() => window.__anamnesisUat.jump('the-read-receipt'));
  await page.waitForTimeout(1000);
  for (let i = 0; i < 6; i++) {
    const cards = await page.locator('.choice-card').count();
    if (cards > 0) break;
    await page.locator('.text-panel').first().click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(200);
  }
  const cardCount = await page.locator('.choice-card').count();
  if (cardCount > 0) {
    for (let i = 0; i < 5; i++) {
      const idx = i % cardCount;
      await page.locator('.choice-card').nth(idx).click({ timeout: 1500 }).catch(() => {});
      await page.waitForTimeout(80);
    }
  }
  await page.waitForTimeout(500);

  assert(errors.length === 0, `expected zero console/page errors across the whole exploration, got: ${JSON.stringify(errors)}`);
  console.log('UAT 32 (clicking-user exploration, both packs): PASS');
});
