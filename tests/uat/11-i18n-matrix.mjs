// UAT 11 — i18n matrix (spec 09 §S2). Confirms Czech and Farsi are actually
// playable: the title tagline differs from the English fallback after
// switching language in Settings, and Farsi correctly flips the document
// to RTL. Settings' language toggle (`.settings-panel`'s "Language" row,
// a `.toggle.cycle` button) is the only pre-game language switch — the HUD's
// own `.lang-btn` only exists in-game, not at the title screen.
import { withPage, gotoUat, assert } from './_helpers.mjs';

const EN_TAGLINE = 'a journey through the rooms';

// Selected by position, not text — after the first language switch, the
// title screen's own button labels ("Settings", "Done") are themselves
// translated, so a text-based selector would only work in English.
async function setLanguageViaSettings(page, clicks) {
  // Title menu order (overlays.ts's showTitle): Field Notes, Ledger,
  // Persona, Settings, About — Settings is the 4th small title button.
  await page.locator('.title-btn.small').nth(3).click({ timeout: 12000 });
  await page.waitForSelector('.settings-panel', { timeout: 10000 });
  // Two `.toggle.cycle` buttons exist: Display's render-resolution cycle
  // (first) and Text & Language's language cycle (second, appended later).
  const toggle = page.locator('.settings-section-body button.toggle.cycle').nth(1);
  for (let i = 0; i < clicks; i++) {
    await toggle.click({ timeout: 12000 });
    await page.waitForTimeout(150);
  }
  // The Settings panel's close button ("Done") is its own last title-btn.
  await page.locator('.settings-panel .title-btn').last().click({ timeout: 12000 });
  await page.waitForTimeout(300);
}

await withPage(async (page) => {
  await gotoUat(page);

  const tagline = () => page.locator('.title-sub').first().textContent();
  const dir = () => page.evaluate(() => document.documentElement.dir);
  const rtlClass = () => page.evaluate(() => document.body.classList.contains('rtl'));

  const enTagline = await tagline();
  assert(enTagline?.includes(EN_TAGLINE), `English tagline should read the known fallback, got: "${enTagline}"`);
  assert((await dir()) === 'ltr', 'document should be LTR in English');
  assert(!(await rtlClass()), 'body should not have the rtl class in English');

  // EN -> CS (one click of the cycle toggle)
  await setLanguageViaSettings(page, 1);
  const csTagline = await tagline();
  assert(csTagline && csTagline !== enTagline, `Czech tagline should differ from English, got: "${csTagline}"`);
  assert((await dir()) === 'ltr', 'document should still be LTR in Czech');

  // CS -> FA (one more click)
  await setLanguageViaSettings(page, 1);
  const faTagline = await tagline();
  assert(faTagline && faTagline !== enTagline, `Farsi tagline should differ from English, got: "${faTagline}"`);
  assert((await dir()) === 'rtl', 'document should switch to RTL in Farsi');
  assert(await rtlClass(), 'body should have the rtl class in Farsi');

  console.log(`EN="${enTagline}" CS="${csTagline}" FA="${faTagline}"`);
  console.log('UAT 11 (i18n matrix): PASS');
});
