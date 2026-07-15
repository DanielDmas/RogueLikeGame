// UAT 38 — live verification of two Fable code-review fixes (2026-07-15):
// H2 (the "Read more" article overlay dismissing the field note underneath
// on Escape/Enter) and H4 (the end-screen axis triptych rendering English
// in every non-English locale). Both are UI-behavior bugs unit tests can't
// see (fieldNote.test.ts/endingI18n.test.ts already lock in the source-
// level fix; this confirms it actually renders correctly).
import { withPage, gotoUat, patchProfile, continueJourney, assert } from './_helpers.mjs';

async function advanceUntilFieldNote(page, roomId, maxClicks = 20) {
  await page.evaluate((id) => window.__anamnesisUat.jump(id), roomId);
  await page.waitForTimeout(1200);
  for (let i = 0; i < maxClicks; i++) {
    if ((await page.locator('.field-note').count()) > 0) return;
    const cards = await page.locator('.choice-card').count();
    if (cards > 0) {
      await page.locator('.choice-card').first().click({ timeout: 5000 }).catch(() => {});
    } else {
      await page.locator('.text-panel').first().click({ timeout: 5000 }).catch(() => {});
    }
    await page.waitForTimeout(400);
  }
}

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  // --- H2: Escape while the article overlay is open must close only the
  // article, never the field note underneath. ---
  await gotoUat(page);
  await advanceUntilFieldNote(page, 'wallet');
  assert((await page.locator('.field-note').count()) > 0, 'expected wallet field note to appear');
  await page.locator('.fn-read-more').first().click({ timeout: 3000 });
  await page.waitForTimeout(500);
  assert((await page.locator('.article-panel').count()) > 0, 'expected the article overlay to open');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  assert((await page.locator('.article-panel').count()) === 0, 'Escape should close the article overlay');
  assert((await page.locator('.field-note').count()) > 0, 'H2 regression: Escape on the article must NOT also dismiss the field note underneath it');
  console.log('  H2: Escape on the article overlay closed only the article, field note stayed open underneath.');

  await page.locator('.fn-close').first().click({ timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(500);

  // --- H4: the end-screen axis triptych renders translated (non-English)
  // text under a non-English locale. Reuses UAT 23's heart-death-via-
  // patchProfile pattern to reach the end screen quickly. ---
  await page.evaluate(() => window.__anamnesisUat.jump('photograph'));
  await page.waitForTimeout(1000);
  await patchProfile(page, (p) => {
    if (p.run) p.run.hearts = 1;
  });
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(500);
  await continueJourney(page);
  await page.waitForTimeout(600);

  // Switch to German before the run ends (live in-HUD toggle).
  const langBtn = page.locator('.lang-btn');
  for (let i = 0; i < 3; i++) {
    await langBtn.click();
    await page.waitForTimeout(300);
  }
  const label = await langBtn.textContent();
  assert(label === 'DE', `expected the language cycle to reach DE after 3 clicks from EN, got "${label}"`);

  for (let i = 0; i < 8; i++) {
    const cards = await page.locator('.choice-card').count();
    if (cards > 0) break;
    await page.locator('.text-panel').first().click({ timeout: 12000 }).catch(() => {});
    await page.waitForTimeout(300);
  }
  // "save-photo" is the heart-costing choice (hearts: -1); its German text
  // contains "rechte Tür" (the right door / the photograph).
  const target = page.locator('.choice-card', { hasText: /rechte Tür/i });
  assert((await target.count()) > 0, 'expected the heart-costing photograph choice (save-photo) to be offered');
  await target.first().click();
  await page.waitForTimeout(800);

  for (let i = 0; i < 25; i++) {
    if ((await page.locator('.ending-epitaph').count()) > 0) break;
    if ((await page.locator('.fn-close').count()) > 0) {
      await page.locator('.fn-close').first().click({ timeout: 3000 }).catch(() => {});
    } else {
      await page.locator('.text-panel').first().click({ timeout: 3000 }).catch(() => {});
    }
    await page.waitForTimeout(500);
  }
  assert((await page.locator('.ending-epitaph').count()) > 0, 'end screen should render');

  assert((await page.locator('.triptych').count()) > 0, 'expected the .triptych element to render on the end screen');
  const triptychText = await page.locator('.triptych').innerText();
  // English source lines all start with "You " — none should survive
  // untranslated in the German build's triptych.
  assert(!/\bYou (weighed|thought|let|kept|held|gave|fought|knew)\b/i.test(triptychText), `expected no English triptych lines, got: ${triptychText.slice(0, 400)}`);
  assert(/\bSie\b/.test(triptychText), `expected genuinely German triptych text (a "Sie"), got: ${triptychText.slice(0, 400)}`);
  console.log('  H4: end-screen triptych rendered translated German text, no English "You ..." lines present.');

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log('UAT 38 (code review fixes H2 + H4): PASS');
});
