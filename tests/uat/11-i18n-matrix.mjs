// UAT 11 — i18n matrix (spec 09 §S2). Confirms Czech and Farsi are actually
// playable: the title tagline differs from the English fallback after
// switching language in Settings, and Farsi correctly flips the document
// to RTL. Settings' language toggle (`.settings-panel`'s "Language" row,
// a `.toggle.cycle` button) is the only pre-game language switch — the HUD's
// own `.lang-btn` only exists in-game, not at the title screen.
import { withPage, gotoUat, assert } from './_helpers.mjs';

const EN_TAGLINE = 'a journey through the rooms';

// Selected via the button's `data-uat="settings-button"` hook (overlays.ts),
// not position or text: the title menu's button count/order has already
// grown twice this session (Register, One Door added), which silently broke
// the previous nth-child(3) selector (Settings had moved to index 5) — and
// text is translated after the first language switch, so neither position
// nor text alone stays reliable across this script's own repeated calls.
async function setLanguageViaSettings(page, clicks) {
  await page.locator('[data-uat="settings-button"]').click({ timeout: 12000 });
  await page.waitForSelector('.settings-panel', { timeout: 10000 });
  const toggle = page.locator('[data-uat="language-toggle"]');
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
