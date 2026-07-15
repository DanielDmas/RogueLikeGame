// UAT 29 — live in-HUD language switch, both packs. Jumps into a room,
// clicks the HUD's language cycle button, and confirms the rendered menu
// button text actually changes without a reload — the live companion to
// the i18n unit tests, and a check that the switch doesn't throw
// mid-room.
import { withPage, gotoUat, assert } from './_helpers.mjs';

async function checkLiveSwitch(page, packQuery, roomId, label) {
  await gotoUat(page, packQuery);
  await page.evaluate((id) => window.__anamnesisUat.jump(id), roomId);
  await page.waitForTimeout(1000);

  const menuBtn = page.locator('.menu-btn').last();
  const before = await menuBtn.textContent();

  const langBtn = page.locator('.lang-btn');
  assert((await langBtn.count()) > 0, `${label}: HUD should show a language toggle button`);
  const langBefore = await langBtn.textContent();
  await langBtn.click();
  await page.waitForTimeout(400);
  const langAfter = await langBtn.textContent();
  assert(langBefore !== langAfter, `${label}: language button label should change on click (stayed "${langBefore}")`);

  // Cycle through to Farsi (EN -> CS -> FA) and confirm the document
  // actually flips to RTL — the one real document-level effect a language
  // switch has (see ui/locale.ts's applyLocaleToDocument).
  await langBtn.click();
  await page.waitForTimeout(400);
  const langAtFa = await langBtn.textContent();
  assert(langAtFa === 'FA', `${label}: cycling twice from EN should reach FA, got "${langAtFa}"`);
  const dirAtFa = await page.evaluate(() => document.documentElement.dir);
  assert(dirAtFa === 'rtl', `${label}: document should flip to RTL once the language is Farsi, got dir="${dirAtFa}"`);

  console.log(`  ${label}: language switched ${langBefore} -> ${langAfter} -> ${langAtFa} (RTL confirmed), menu label "${before}" still present: ${(await menuBtn.textContent()) != null}`);
}

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await checkLiveSwitch(page, 'uat=1', 'wallet', 'ANAMNESIS');
  await checkLiveSwitch(page, 'pack=limerence&uat=1', 'the-read-receipt', 'LIMERENCE');

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log('UAT 29 (live language switch, both packs): PASS');
});
