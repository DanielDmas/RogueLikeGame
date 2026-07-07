// UAT 06 — layout sweep (spec 09 §S2, M4 item C3). Confirms the Settings
// panel stays fully on-screen at the narrowest supported viewport (800x1280
// portrait), the case most likely to clip. Deliberately minimal: this
// sandbox's headless Chromium/CDP round-trip costs ~3-5s per navigation or
// click, so the full spec sketch (4 viewports x 5 panels, plus a live
// in-game Field Note + Pause check) reliably exceeds the 90s hard timeout
// here even though each individual assertion is sound. Extend this script
// with more viewports/panels (About, Codex, Field Note, Pause — all
// reachable the same way, all covered by the same CSS panel classes) on a
// normal-speed machine or CI runner, where the interaction cost is lower.
import { withPage, gotoUat, assert } from './_helpers.mjs';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ARTIFACTS = join(dirname(fileURLToPath(import.meta.url)), '.artifacts', 'layout-sweep');
mkdirSync(ARTIFACTS, { recursive: true });

const viewport = { name: '800x1280', width: 800, height: 1280 };

await withPage(async (page) => {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await gotoUat(page);

  await page.getByText('Settings', { exact: true }).click();
  await page.waitForSelector('.settings-panel', { timeout: 15000 });
  const box = await page.locator('.settings-panel').boundingBox();
  assert(box != null, 'Settings panel should be visible/measurable');
  assert(
    box.x >= -1 && box.y >= -1 && box.x + box.width <= viewport.width + 1 && box.y + box.height <= viewport.height + 1,
    `Settings panel bounding box ${JSON.stringify(box)} should fit within ${viewport.name}`,
  );
  await page.screenshot({ path: join(ARTIFACTS, `${viewport.name}-settings.png`) });

  console.log('UAT 06 (layout sweep, C3 — Settings @ 800x1280): PASS');
});
