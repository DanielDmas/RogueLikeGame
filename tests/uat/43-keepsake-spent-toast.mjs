// UAT 43 — keepsake-spent toast (game-experience review E5, 2026-07-19).
// A keepsake-spending choice's only in-run signal used to be the ✧ mark's
// hover tooltip on the choice card — which the player has just clicked
// past by the time the choice resolves, so nothing ever confirmed what
// spending it actually did. Seeds a profile already holding the
// "casino-chip" keepsake, jumps into the Newcomb Annex (the one room whose
// bonus choice spends it), clicks that choice, and confirms the new
// showKeepsakeSpentToast() toast renders with the keepsake's real name.
import { withPage, gotoUat, jump, patchProfile, advance, clickChoiceMatching, assert } from './_helpers.mjs';

await withPage(async (page) => {
  await gotoUat(page);
  await patchProfile(page, (p) => {
    p.keepsakes = ['casino-chip'];
  });
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(500);

  await jump(page, 'newcomb-annex');

  const state = await page.evaluate(() => window.__anamnesisUat.state());
  assert(state.currentRoom === 'newcomb-annex', 'jump() should land directly on the Newcomb Annex');

  await advance(page, 6);
  const clicked = await clickChoiceMatching(page, /casino chip/i);
  assert(clicked, 'expected to find and click the casino-chip keepsake-spend choice');

  let sawToast = false;
  let toastText = '';
  for (let i = 0; i < 15; i++) {
    const toast = page.locator('.save-toast');
    if ((await toast.count()) > 0) {
      toastText = await toast.first().innerText();
      if (toastText.includes('✧')) {
        sawToast = true;
        break;
      }
    }
    await page.waitForTimeout(100);
  }

  assert(sawToast, 'expected a ✧-prefixed keepsake-spent toast after the choice resolved');
  // .save-toast renders uppercase via CSS text-transform — compare case-insensitively.
  assert(/unspent chip/i.test(toastText), `expected the toast to name the keepsake, got: "${toastText}"`);

  console.log(`UAT 43 (keepsake-spent toast): PASS — toast read "${toastText}"`);
});
