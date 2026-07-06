// UAT 02 — save/reload/continue. Jumps into a mid-run room, forces a
// persist, reloads the page (simulating quitting and coming back), and
// confirms "Continue the journey" resumes at the exact same room/act
// rather than starting over (the original user-reported symptom this
// milestone's save investigation was built around).
import { withPage, gotoUat, readProfile, continueJourney, assert } from './_helpers.mjs';

await withPage(async (page) => {
  await gotoUat(page);
  await page.evaluate(() => window.__anamnesisUat.jump('editor'));
  await page.waitForTimeout(1200);

  const before = await page.evaluate(() => window.__anamnesisUat.state());
  assert(before.currentRoom === 'editor', 'jump() should land directly on the editor room');
  assert(before.act === 3, 'the editor is an Act III room');

  const profileBefore = await readProfile(page);
  assert(profileBefore?.run?.currentRoom === 'editor', 'the persisted run should already reflect the jump');

  // Simulate closing and reopening the game.
  await page.reload();
  await page.waitForTimeout(1000);

  const hasContinue = await page.getByText('Continue the journey', { exact: false }).count();
  assert(hasContinue > 0, '"Continue the journey" should be offered after reload with an in-progress run');

  await continueJourney(page);
  await page.waitForTimeout(1000);

  const after = await page.evaluate(() => window.__anamnesisUat.state());
  assert(after.currentRoom === 'editor', `continue should resume on editor, got ${after.currentRoom}`);
  assert(after.act === 3, 'continue should resume in Act III, not restart the run');

  console.log('UAT 02 (save/reload/continue): PASS');
});
