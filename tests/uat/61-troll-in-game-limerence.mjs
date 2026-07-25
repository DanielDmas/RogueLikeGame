// UAT 61 — extended in-game troll test, LIMERENCE. Mirrors script 60 under
// `?pack=limerence`: chaos-tests actual gameplay (door dolly races, HUD
// controls, typewriter mashing, viewport resize mid-transition, interrupting
// jump() calls) rather than just the title screen, which is all scripts 10/30
// cover. A genuinely different pack — its own Trust HUD, Porter barks, light
// theme toggle — not just a different query string.
import { withPage, gotoUat, jump, assert } from './_helpers.mjs';

const DURATION_MS = 45000;
const KEYS = ['1', '2', '3', '4', 'Digit1', 'Digit2', 'Escape', 'Enter', ' ', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'Backspace'];
const VIEWPORTS = [
  { width: 1280, height: 800 },
  { width: 640, height: 480 },
  { width: 1920, height: 1080 },
  { width: 1280, height: 800 },
];
const ROOMS = ['the-front-desk', 'the-password', 'the-rumor', 'the-kitchen-table', 'the-unsent'];

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page, 'pack=limerence&uat=1');
  await jump(page, ROOMS[0]);

  const start = Date.now();
  let i = 0;
  while (Date.now() - start < DURATION_MS) {
    const mode = i % 9;
    try {
      if (mode === 0) {
        await page.keyboard.press(KEYS[i % KEYS.length]);
      } else if (mode === 1) {
        const box = await page.viewportSize();
        await page.mouse.click(box.width * 0.3 + Math.random() * box.width * 0.4, box.height * 0.4);
      } else if (mode === 2) {
        await page.setViewportSize(VIEWPORTS[i % VIEWPORTS.length]);
      } else if (mode === 3) {
        const menu = page.locator('.menu-btn').first();
        if (await menu.count()) await menu.click({ timeout: 2000 }).catch(() => {});
      } else if (mode === 4) {
        await page.keyboard.press('Escape');
      } else if (mode === 5) {
        const langBtn = page.locator('.lang-btn, [data-uat="language-toggle"]').first();
        if (await langBtn.count()) await langBtn.click({ timeout: 2000 }).catch(() => {});
      } else if (mode === 6) {
        const panel = page.locator('.text-panel').first();
        if (await panel.count()) await panel.click({ timeout: 2000 }).catch(() => {});
      } else if (mode === 7) {
        await page.evaluate(
          (id) => window.__anamnesisUat?.jump(id),
          ROOMS[Math.floor(Math.random() * ROOMS.length)],
        );
        await page.waitForTimeout(400);
      } else {
        const box = await page.viewportSize();
        await page.mouse.click(Math.random() * box.width, Math.random() * box.height);
      }
    } catch {
      // Expected noise — only a real error event counts.
    }
    await page.waitForTimeout(90);
    i++;
  }

  console.log(`in-game troll loop (LIMERENCE): ${i} actions, ${errors.length} errors`);
  assert(errors.length === 0, `expected zero console/page errors during chaos, got: ${JSON.stringify(errors)}`);

  await page.reload();
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(500);
  const bodyText = await page.evaluate(() => document.body.innerText);
  assert(bodyText.trim().length > 0, 'expected real rendered content after a post-chaos reload, got a blank page');
  const recovery = await page.locator('.recovery-panel').count();
  assert(recovery === 0, 'post-chaos reload should not land on the crash-recovery overlay');

  console.log('UAT 61 (in-game troll test, LIMERENCE): PASS');
});
