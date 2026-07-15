// UAT 24 — LIMERENCE ending flow. Mirrors script 23 but for LIMERENCE:
// jumps to `the-rumor`, patches the run to 1 heart, clicks the heart-
// costing "interrogate" choice, and confirms the end screen renders (the
// live-browser companion to blocker 1.1's fix — LIMERENCE's own
// hearts<=0 evaluator resolves to `the-ghost`, not ANAMNESIS's
// `dissolved`).
import { withPage, gotoUat, continueJourney, assert } from './_helpers.mjs';

const LIMERENCE_PROFILE_KEY = 'limerence:profile:traveler';
async function readLimerenceProfile(page) {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, LIMERENCE_PROFILE_KEY);
}

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page, 'pack=limerence&uat=1');
  await page.evaluate(() => window.__anamnesisUat.jump('the-rumor'));
  await page.waitForTimeout(1000);

  await page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    const parsed = JSON.parse(raw);
    if (parsed.run) parsed.run.hearts = 1;
    localStorage.setItem(key, JSON.stringify(parsed));
  }, LIMERENCE_PROFILE_KEY);
  await page.reload();
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(500);

  const runsBefore = (await readLimerenceProfile(page))?.runsCompleted ?? 0;

  await continueJourney(page);
  await page.waitForTimeout(600);

  for (let i = 0; i < 8; i++) {
    const cards = await page.locator('.choice-card').count();
    if (cards > 0) break;
    await page.locator('.text-panel').first().click({ timeout: 12000 }).catch(() => {});
    await page.waitForTimeout(300);
  }
  const target = page.locator('.choice-card', { hasText: /Ask her everything/i });
  assert((await target.count()) > 0, 'expected the heart-costing "interrogate" choice to be offered in the-rumor');
  await target.first().click();
  await page.waitForTimeout(800);

  // Same multi-stage sequence as script 23: room field note -> ending
  // beats -> ending field note -> the static epitaph screen.
  for (let i = 0; i < 20; i++) {
    if ((await page.locator('.ending-epitaph').count()) > 0) break;
    if ((await page.locator('.fn-close').count()) > 0) {
      await page.locator('.fn-close').first().click({ timeout: 3000 }).catch(() => {});
    } else {
      await page.locator('.text-panel').first().click({ timeout: 3000 }).catch(() => {});
    }
    await page.waitForTimeout(500);
  }

  const endVisible = await page.locator('.ending-epitaph').count();
  assert(endVisible > 0, 'end screen (.ending-epitaph) should render once LIMERENCE hearts reach 0');

  const finalProfile = await page.evaluate(() => {
    const raw = localStorage.getItem('limerence:profile:traveler');
    return raw ? JSON.parse(raw) : null;
  });
  assert((finalProfile?.runsCompleted ?? 0) === runsBefore + 1, `runsCompleted should increment (was ${runsBefore}, now ${finalProfile?.runsCompleted})`);
  assert((finalProfile?.endingsSeen?.length ?? 0) > 0, 'endingsSeen should record at least one ending');

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log(`UAT 24 (LIMERENCE ending flow): PASS — hearts-death ending rendered cleanly (no ANAMNESIS "dissolved" crash), runsCompleted ${runsBefore} -> ${finalProfile.runsCompleted}, zero errors`);
});
