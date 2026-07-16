// UAT 52 — Phase V (the real LIMERENCE visual rework), 2026-07-16: live
// verification of V1 (per-floor fixture kit: departures board, locker
// walls, sconces, Top Floor's shared dawn shader + skyline), V2 (the
// "morning read" light-mode 3D lift), V3 (per-floor accent CSS in both
// themes), and V4a (the end-of-act interlude title card). Budget: kept
// under 3 minutes via jump()s rather than a full playthrough.
import { withPage, gotoUat, assert } from './_helpers.mjs';
import { writeFileSync } from 'node:fs';

const SCRATCH = '/tmp/claude-0/-home-user-RogueLikeGame/88e16741-ee10-508d-9cf3-e57e0ad0c260/scratchpad';

const FLOOR_ROOMS = [
  { id: 'the-front-desk', act: 0 },
  { id: 'the-read-receipt', act: 1 },
  { id: 'the-distance', act: 2 },
  { id: 'the-colleague', act: 3 },
];

async function shootRoom(page, id, tag) {
  await page.evaluate((roomId) => window.__anamnesisUat.jump(roomId), id);
  await page.waitForFunction(() => window.__anamnesisUat && window.__anamnesisUat.version, { timeout: 10000 });
  await page.waitForTimeout(500);
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);
  const shot = await page.screenshot();
  writeFileSync(`${SCRATCH}/phaseV-${tag}-${id}.png`, shot);
}

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await gotoUat(page, 'pack=limerence&uat=1');

  // V1 + V3 dark mode: fixture kit visible per floor.
  for (const { id } of FLOOR_ROOMS) await shootRoom(page, id, 'dark');

  // V1: Top Floor (dawn shader + skyline reuse).
  await shootRoom(page, 'the-kitchen-table', 'topfloor');

  // V2 + V3 light mode: toggle, re-shoot the same floors — the 3D scene
  // should visibly lift toward dawn, and the UI accent should shift per floor.
  await page.locator('.settings-btn').waitFor({ state: 'visible', timeout: 8000 });
  await page.locator('.settings-btn').click();
  await page.waitForSelector('.settings-panel', { timeout: 15000 });
  const lightRow = page.locator('.settings-panel').getByText('Light mode', { exact: true }).locator('..');
  await lightRow.locator('.toggle').click();
  await page.getByText('Done', { exact: true }).click();
  await page.waitForTimeout(400);
  for (const { id } of FLOOR_ROOMS) await shootRoom(page, id, 'light');

  // V4a: the interlude card. jump() does a real page reload, which wipes
  // any observer set up via page.evaluate() — use addInitScript so the
  // MutationObserver re-arms on the fresh document *before* game code runs,
  // reliably catching a very brief (speedMultiplier-scaled) title card even
  // if a single screenshot would miss its timing.
  await page.addInitScript(() => {
    window.__interludeSightings = [];
    const arm = () => {
      const target = document.querySelector('.interlude');
      if (!target) {
        requestAnimationFrame(arm);
        return;
      }
      const obs = new MutationObserver(() => {
        const text = target.textContent;
        if (text) window.__interludeSightings.push(text);
      });
      obs.observe(target, { characterData: true, childList: true, subtree: true });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arm);
    else arm();
  });
  // The light-mode loop above just left the scene on the-colleague's act
  // (3) — jump somewhere in a genuinely different, non-zero act (the
  // interlude is deliberately suppressed for act 0 — "nowhere to arrive
  // from yet" on a fresh run) so syncTheme() actually has a real theme
  // change to fade through.
  await page.evaluate(() => window.__anamnesisUat.jump('the-read-receipt'));
  await page.waitForFunction(() => window.__anamnesisUat && window.__anamnesisUat.version, { timeout: 10000 });
  await page.waitForTimeout(800);
  const sightings = await page.evaluate(() => window.__interludeSightings ?? []);

  // ANAMNESIS sanity — corridor unchanged, no fixture-kit or interlude regressions.
  await gotoUat(page, 'uat=1');
  await page.evaluate(() => window.__anamnesisUat.jump('waiting-room'));
  await page.waitForFunction(() => window.__anamnesisUat && window.__anamnesisUat.version, { timeout: 10000 });
  await page.waitForTimeout(500);
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);
  const anamShot = await page.screenshot();
  writeFileSync(`${SCRATCH}/phaseV-anamnesis-sanity.png`, anamShot);

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log(`UAT 52 (Phase V visual rework): PASS — interlude sightings: ${JSON.stringify(sightings)}; screenshots saved to scratchpad`);
});
