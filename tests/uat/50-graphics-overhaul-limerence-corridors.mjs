// UAT 50 — graphics overhaul (2026-07-16): visual verification of LIMERENCE's
// new corridor structural distinctiveness (the migrating window fixture +
// accent-color door variety, scene/themes.ts + packs/limerence/theme.ts) and
// the new per-floor light-mode accent CSS (styles.css [data-act] blocks).
// Screenshots one representative room per corridor floor (acts 0-3) in dark
// mode, toggles Light mode, then re-shoots the same 4 rooms so the per-floor
// accent variation is visible. Budget: 8 quick jumps, well under 3 minutes.
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
  writeFileSync(`${SCRATCH}/graphics-overhaul-${tag}-${id}.png`, shot);
}

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await gotoUat(page, 'pack=limerence&uat=1');

  for (const { id } of FLOOR_ROOMS) {
    await shootRoom(page, id, 'dark');
  }

  // Toggle Light mode via Settings (in-game HUD gear, not the title's
  // "Settings" text button — a room's beats/choices are showing right now).
  await page.locator('.settings-btn').waitFor({ state: 'visible', timeout: 8000 });
  await page.locator('.settings-btn').click();
  await page.waitForSelector('.settings-panel', { timeout: 15000 });
  const lightRow = page.locator('.settings-panel').getByText('Light mode', { exact: true }).locator('..');
  await lightRow.locator('.toggle').click();
  await page.getByText('Done', { exact: true }).click();
  await page.waitForTimeout(300);

  for (const { id } of FLOOR_ROOMS) {
    await shootRoom(page, id, 'light');
  }

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log('UAT 50 (graphics overhaul — LIMERENCE corridors, dark+light): PASS — screenshots saved to scratchpad');
});
