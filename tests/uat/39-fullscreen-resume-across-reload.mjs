// UAT 39 — fullscreen survives the reloads/navigations the game does on its
// own (title return, Vestibule button, resetRun, etc.), which the owner
// reported as "returning to the vestibule / exiting a menu resets fullscreen
// and disables it." Headless Chromium cannot actually enter real OS
// fullscreen, so this verifies the mechanism itself rather than the pixels:
// requestFullscreen is spied via an init script (installed before any page
// script runs, so it's in place before main.ts's boot() calls
// resumeFullscreenAfterReload()), sessionStorage's 'vestibule:wasFullscreen'
// flag is set directly to simulate "was fullscreen right before this
// reload" (exactly what rememberFullscreenForReload does, unit-tested
// separately in fullscreen.test.ts), and this script confirms: (a) a page
// load with the flag set arms a one-shot listener that calls
// requestFullscreen on the very next click, (b) the flag is consumed
// (removed) so a second click doesn't re-trigger it, and (c) a page load
// WITHOUT the flag never calls requestFullscreen on click — the fix must
// not fullscreen a player who was never fullscreen to begin with.
import { withPage, gotoUat, assert } from './_helpers.mjs';

await withPage(async (page) => {
  // Override on Element.prototype, not the document.documentElement instance
  // — an init script runs before the document is parsed, so documentElement
  // doesn't exist yet at this point (confirmed live: defineProperty on it
  // throws "called on non-object" here). The prototype always exists.
  await page.addInitScript(() => {
    window.__fsCalls = 0;
    Element.prototype.requestFullscreen = function requestFullscreen() {
      window.__fsCalls += 1;
      return Promise.resolve();
    };
  });

  // Case A: the flag is set (simulating "was fullscreen before this reload").
  await gotoUat(page);
  await page.evaluate(() => sessionStorage.setItem('vestibule:wasFullscreen', '1'));
  await page.reload();
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });

  // resumeFullscreenAfterReload() consumes (removes) the flag immediately at
  // boot — before any click — and instead arms a one-shot click listener;
  // the flag itself is not what gates the second click below, the listener's
  // own `once: true` is. Confirm the immediate removal here.
  const flagAfterBoot = await page.evaluate(() => sessionStorage.getItem('vestibule:wasFullscreen'));
  assert(flagAfterBoot === null, 'the resume flag should be consumed (removed) immediately at boot, not left armed');

  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.waitForTimeout(200);

  const callsAfterFirstClick = await page.evaluate(() => window.__fsCalls);
  assert(callsAfterFirstClick === 1, `first click after a flagged reload should call requestFullscreen once, got ${callsAfterFirstClick}`);

  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.waitForTimeout(200);
  const callsAfterSecondClick = await page.evaluate(() => window.__fsCalls);
  assert(callsAfterSecondClick === 1, 'a second click must not call requestFullscreen again (one-shot listener)');

  // Case B: no flag set — an ordinary reload must never call requestFullscreen.
  await page.evaluate(() => window.__fsCalls = 0);
  await page.reload();
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.waitForTimeout(200);
  const callsWithoutFlag = await page.evaluate(() => window.__fsCalls);
  assert(callsWithoutFlag === 0, `a reload with no resume flag must never call requestFullscreen, got ${callsWithoutFlag}`);

  console.log('UAT 39 (fullscreen resume across reload): PASS');
});
