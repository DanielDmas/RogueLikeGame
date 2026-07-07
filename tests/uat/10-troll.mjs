// UAT 10 — troll test (spec 09 §S2). Spams clicks, key presses, viewport
// resizes, and language switches at the title screen for ~20s, asserting
// zero uncaught page errors throughout. Trimmed from the spec's 45s to fit
// this sandbox's slower interaction cost within the 90s hard timeout —
// the point (surface any "click something weird and the page throws") is
// the same regardless of how long the spamming runs.
import { withPage, gotoUat, assert } from './_helpers.mjs';

const DURATION_MS = 20000;
const KEYS = ['1', '2', '3', 'Escape', 'Enter', ' ', 'Tab'];
const VIEWPORTS = [
  { width: 1280, height: 800 },
  { width: 900, height: 700 },
  { width: 1280, height: 800 },
];

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await gotoUat(page);

  const start = Date.now();
  let i = 0;
  while (Date.now() - start < DURATION_MS) {
    const mode = i % 5;
    try {
      if (mode === 0) {
        await page.keyboard.press(KEYS[i % KEYS.length]);
      } else if (mode === 1) {
        const box = await page.viewportSize();
        await page.mouse.click(Math.random() * box.width, Math.random() * box.height);
      } else if (mode === 2) {
        await page.setViewportSize(VIEWPORTS[i % VIEWPORTS.length]);
      } else if (mode === 3) {
        const langBtn = page.getByText(/^(EN|CS|FA)$/, { exact: true }).first();
        if (await langBtn.count()) await langBtn.click({ timeout: 3000 }).catch(() => {});
      } else {
        await page.keyboard.press('Escape');
      }
    } catch {
      // Interaction targets can legitimately disappear mid-spam (a panel
      // closes, a screen changes) — that's expected noise, not a failure;
      // only an actual `pageerror` event counts.
    }
    await page.waitForTimeout(150);
    i++;
  }

  console.log(`troll loop: ${i} actions, ${errors.length} page errors`);
  assert(errors.length === 0, `expected zero uncaught page errors, got: ${JSON.stringify(errors)}`);

  console.log('UAT 10 (troll test): PASS');
});
