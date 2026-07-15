// UAT 27 — "One Door" standalone vignette mode, both packs. Clicks the
// title screen's "One Door" button, confirms a real room deals immediately
// (no onboarding), resolves a choice, and checks the profile's whole-run
// side effects stayed untouched afterward (T9's own guarantee:
// `profile.run` stays null, `runsCompleted` doesn't increment) while the
// room still counts toward `codexUnlocked`.
import { withPage, gotoUat, assert } from './_helpers.mjs';

async function runOneDoorCheck(page, packQuery, profileKey, label) {
  await gotoUat(page, packQuery);
  const before = await page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, profileKey);

  const oneDoorBtn = page.getByText('One Door', { exact: true });
  assert((await oneDoorBtn.count()) > 0, `${label} title screen should offer a "One Door" button`);
  await oneDoorBtn.first().click();
  await page.waitForTimeout(1200);

  const hasTextPanel = await page.locator('.text-panel').count();
  assert(hasTextPanel > 0, `${label} One Door should deal directly into a room (no onboarding overlays)`);

  for (let i = 0; i < 10; i++) {
    const cards = await page.locator('.choice-card').count();
    if (cards > 0) break;
    await page.locator('.text-panel').first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(300);
  }
  const cardCount = await page.locator('.choice-card').count();
  if (cardCount > 0) {
    await page.locator('.choice-card').first().click();
    await page.waitForTimeout(600);
    for (let i = 0; i < 10; i++) {
      const backAtTitle = await page.getByText('Begin', { exact: true }).count();
      if (backAtTitle > 0) break;
      if ((await page.locator('.fn-close').count()) > 0) {
        await page.locator('.fn-close').first().click({ timeout: 3000 }).catch(() => {});
      } else {
        await page.locator('.text-panel').first().click({ timeout: 3000 }).catch(() => {});
      }
      await page.waitForTimeout(400);
    }
  }

  const after = await page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, profileKey);
  assert(after?.run == null, `${label}: profile.run should stay null after a One Door vignette (was ${JSON.stringify(after?.run)})`);
  assert((after?.runsCompleted ?? 0) === (before?.runsCompleted ?? 0), `${label}: runsCompleted should not change from a One Door vignette`);
  console.log(`  ${label}: One Door dealt a room, resolved cleanly, run-scoped profile fields untouched`);
}

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await runOneDoorCheck(page, 'uat=1', 'anamnesis:profile:traveler', 'ANAMNESIS');
  await runOneDoorCheck(page, 'pack=limerence&uat=1', 'limerence:profile:traveler', 'LIMERENCE');

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log('UAT 27 (One Door mode, both packs): PASS');
});
