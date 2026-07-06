// UAT 01 — title screen + the non-negotiable first-playthrough auto-About,
// plus a regression check for the phantom-run bug (profile.run must stay
// null until a real run actually starts). Budget: well under 3 minutes.
import { withPage, gotoUat, readProfile, assert } from './_helpers.mjs';

await withPage(async (page) => {
  await gotoUat(page);

  // Fresh profile: Begin is offered, "Continue the journey" is not.
  const hasBegin = await page.getByText('Begin', { exact: true }).count();
  assert(hasBegin > 0, 'title screen should show Begin for a fresh profile');
  const hasContinue = await page.getByText('Continue the journey', { exact: false }).count();
  assert(hasContinue === 0, 'title screen should not offer "Continue the journey" for a fresh profile');

  await page.getByText('Begin', { exact: true }).click();
  await page.waitForTimeout(600);

  // The "Before you begin" explainer must appear automatically, unprompted.
  const aboutVisible = await page.locator('.about-panel').count();
  assert(aboutVisible > 0, 'auto-About panel should appear on a true first playthrough');
  await page.getByText('Back', { exact: true }).click();
  await page.waitForTimeout(400);

  // Phantom-run regression: persisting hasSeenAbout must not stamp a run.
  const afterAbout = await readProfile(page);
  assert(afterAbout?.hasSeenAbout === true, 'hasSeenAbout should be true after the About panel is dismissed');
  assert(afterAbout?.run == null, 'profile.run must still be null before any real run has started (phantom-run guard)');

  // Persona: skip it.
  await page.getByText('Skip', { exact: false }).click();
  await page.waitForTimeout(400);

  // Examined Path offer: two equal-weight buttons, take "Walk plainly".
  const walkPlainly = page.getByText('Walk plainly', { exact: false });
  assert((await walkPlainly.count()) > 0, 'Examined Path offer should appear on a fresh run');
  await walkPlainly.click();

  // Now actually in-game, standing at the prologue's door offer. The scene
  // transition's duration can vary slightly, so poll rather than fix-wait.
  await page.locator('.choice-card').first().waitFor({ state: 'visible', timeout: 8000 });

  await page.keyboard.press('1');
  await page.waitForFunction(() => window.__anamnesisUat.state().currentRoom != null, { timeout: 8000 });
  const state = await page.evaluate(() => window.__anamnesisUat.state());
  assert(state.currentRoom != null, 'a room should be active after walking through the offered door');

  const finalProfile = await readProfile(page);
  assert(finalProfile?.run != null, 'profile.run should be set now that a real run has started');

  console.log('UAT 01 (title + onboarding + auto-About): PASS');
});
