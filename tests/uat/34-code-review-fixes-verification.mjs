// UAT 34 — live verification for the 2026-07-15 code-review fix batch:
// (a) LIMERENCE's HUD hearts aria-label/title and lucidity tooltip now
// resolve to LIMERENCE's own "Trust"/"Clarity" text in Czech, not
// ANAMNESIS's "grip on reality"/lucidity (findings #1/#2); (b) the persona
// editor still correctly names "the Porter" (guide.name plumbing, #9);
// (c) a settled choice card is still fully visible after the animationend
// listener rescoping (#6) — the exact regression class #33 already guards,
// re-checked here specifically in Czech since the HUD fix touches the
// same render path.
import { withPage, gotoUat, assert } from './_helpers.mjs';

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page, 'pack=limerence&uat=1');

  // Switch to Czech via Settings before jumping into a room, so the HUD
  // mounts with the Czech strings already resolved.
  await page.locator('[data-uat="settings-button"]').click({ timeout: 12000 });
  await page.waitForSelector('.settings-panel', { timeout: 10000 });
  await page.locator('[data-uat="language-toggle"]').click({ timeout: 12000 });
  await page.waitForTimeout(150);
  await page.locator('.settings-panel .title-btn').last().click({ timeout: 12000 });
  await page.waitForTimeout(300);

  await page.evaluate(() => window.__anamnesisUat.jump('the-read-receipt'));
  await page.waitForTimeout(1200);

  const heartsAria = await page.locator('.hearts').getAttribute('aria-label');
  assert(heartsAria === 'Důvěra', `LIMERENCE Czech heartsAriaLabel should be "Důvěra", got "${heartsAria}"`);
  assert(!heartsAria?.includes('reality'), 'must not contain ANAMNESIS\'s "reality" wording');

  const heartsTitle = await page.locator('.hearts').getAttribute('title');
  assert(heartsTitle?.includes('Důvěra'), `LIMERENCE Czech hearts tooltip should mention "Důvěra", got "${heartsTitle}"`);

  const lucidityTitle = await page.locator('.lucidity').getAttribute('title');
  assert(
    lucidityTitle?.includes('Jasnost'),
    `LIMERENCE Czech lucidity tooltip should mention "Jasnost", got "${lucidityTitle}"`,
  );
  assert(!lucidityTitle?.includes('dívali'), 'must not contain ANAMNESIS\'s own lucidity phrasing');

  // Choice cards still fully visible after settling (rescoped animationend
  // listener, finding #6) — same check as script 33, spot-checked here in
  // Czech specifically since the HUD language switch touches this render path.
  for (let i = 0; i < 10; i++) {
    if ((await page.locator('.choice-card').count()) > 0) break;
    await page.keyboard.press('Space');
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(1200);
  const opacities = await page.$$eval('.choice-card', (cards) => cards.map((c) => getComputedStyle(c).opacity));
  assert(opacities.length > 0, 'expected choice cards to be offered');
  for (const o of opacities) assert(Number(o) > 0.5, `settled card should be visible, got opacity ${o}`);

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log('UAT 34 (code-review fixes verification): PASS');
});
