// UAT 21 — ANAMNESIS title-menu overlays sweep. Opens every overlay
// reachable directly from the title screen (Field Notes/Codex, Traveler's
// Ledger, The Register, Before you begin/About, Credits) and confirms each
// renders content and closes cleanly, with zero console/page errors.
import { withPage, gotoUat, assert } from './_helpers.mjs';

const OVERLAYS = [
  { button: 'Field Notes', exact: false, panelSelector: '.codex-panel', closeText: 'Back' },
  { button: "Traveler's Ledger", exact: true, panelSelector: '.codex-panel', closeText: 'Back' },
  { button: 'The Register', exact: true, panelSelector: '.register-panel', closeText: 'Back' },
  { button: 'Before you begin', exact: true, panelSelector: '.about-panel', closeText: 'Back' },
  { button: 'Credits', exact: true, panelSelector: '.about-panel', closeText: 'Back' },
];

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page);

  const opened = [];
  for (const { button, exact, panelSelector, closeText } of OVERLAYS) {
    const btn = page.getByText(button, { exact });
    assert((await btn.count()) > 0, `title screen should offer a "${button}" button`);
    await btn.first().click();
    await page.waitForSelector(panelSelector, { timeout: 10000 });
    const textLength = (await page.locator(panelSelector).innerText()).length;
    assert(textLength > 20, `${button} panel should render real content (got ${textLength} chars)`);
    await page.getByText(closeText, { exact: true }).first().click();
    await page.waitForTimeout(300);
    const stillOpen = await page.locator(panelSelector).count();
    assert(stillOpen === 0, `${button} panel should close after clicking "${closeText}"`);
    opened.push(button);
  }

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log(`UAT 21 (ANAMNESIS overlays sweep): PASS — opened+closed ${opened.length} overlays cleanly: ${opened.join(', ')}`);
});
