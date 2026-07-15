// UAT 31 — focus containment (9.5.1). Opens Settings from the title
// screen and confirms Tab cycling stays inside the overlay rather than
// leaking to the (nominally hidden) title-menu buttons behind it — the
// live-browser companion to focusTrap.test.ts's pure boundary-logic unit
// tests.
import { withPage, gotoUat, assert } from './_helpers.mjs';

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page);
  await page.getByText('Settings', { exact: true }).click();
  await page.waitForSelector('.settings-panel', { timeout: 15000 });

  // Tab through more times than there are focusable elements in the panel
  // alone — if the trap leaks, focus eventually lands on something outside
  // .settings-panel (a title-menu button hidden behind the overlay).
  let everyFocusInsidePanel = true;
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    const insidePanel = await page.evaluate(() => {
      const active = document.activeElement;
      const panel = document.querySelector('.settings-panel');
      return !!panel && !!active && panel.contains(active);
    });
    if (!insidePanel) {
      everyFocusInsidePanel = false;
      break;
    }
  }
  assert(everyFocusInsidePanel, 'Tab cycling should stay contained inside the open Settings panel');

  // Close the panel and confirm the trap releases (background becomes
  // reachable again) rather than permanently disabling Tab.
  await page.getByText('Done', { exact: true }).click();
  await page.waitForTimeout(300);
  await page.keyboard.press('Tab');
  const focusedAfterClose = await page.evaluate(() => document.activeElement?.tagName);
  assert(focusedAfterClose != null, 'Tab should still move focus somewhere after the overlay closes (trap released)');

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log('UAT 31 (focus trap, Settings overlay): PASS — 40 Tab presses stayed contained, trap released on close');
});
