// UAT 37 — ANAMNESIS choice-aftermath echoes (T6-style cross-room callback,
// new this session). Confirms two new choseIn()-conditional beats actually
// render live: wallet's keep-it choice echoed at photograph's gate line,
// and omelas's open-door choice echoed at court-of-usher's gate line.
// Injects a transcript entry directly (fastest reliable way to simulate
// "made this choice earlier in the run" without replaying the whole room)
// then jumps to the target gate and advances through its own act-intro
// bark (jump() into a gate lands on the act-intro screen first, same as
// UAT 09's photograph jump) until the echo line itself is on screen.
import { withPage, gotoUat, patchProfile, continueJourney, assert } from './_helpers.mjs';

async function injectChoiceAndJumpTo(page, { earlierRoomId, choiceId, choiceText, targetRoomId }) {
  await page.evaluate((id) => window.__anamnesisUat.jump(id), earlierRoomId);
  await page.waitForTimeout(1000);
  // patchProfile serializes the mutator via toString() and evals it inside
  // the page, so it can't close over outer variables — the transcript entry
  // must be baked in as a literal, not referenced from closure.
  const entry = { roomId: earlierRoomId, stageIndex: 0, choiceId, choiceText };
  const entryJson = JSON.stringify(entry);
  await patchProfile(page, new Function('p', `if (p.run) p.run.transcript = [${entryJson}];`));
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(500);
  await continueJourney(page);
  await page.waitForTimeout(500);
  // jump() while already in-game reuses this.state (preserving the injected
  // transcript) and lands directly in the target room's act flow — no title
  // screen, so no continueJourney() here (unlike the first jump, made from a
  // title-screen-fresh page where jump()'s own reload does land on title).
  await page.evaluate((id) => window.__anamnesisUat.jump(id), targetRoomId);
  await page.waitForTimeout(1200);
}

/** Clicks the text panel forward until `pattern` appears in it (the gate's
 * own opening beat, past any act-intro bark shown first) or `maxClicks` is
 * exhausted. Returns the panel text at whichever point it stopped. */
async function advanceUntilTextMatches(page, pattern, maxClicks) {
  for (let i = 0; i < maxClicks; i++) {
    const text = await page.locator('.text-panel').innerText().catch(() => '');
    if (pattern.test(text)) return text;
    await page.locator('.text-panel').first().click({ timeout: 12000 }).catch(() => {});
    await page.waitForTimeout(300);
  }
  return page.locator('.text-panel').innerText().catch(() => '');
}

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page);

  // wallet's keep-it -> photograph's gate line should reference the pocketed wallet.
  await injectChoiceAndJumpTo(page, {
    earlierRoomId: 'wallet',
    choiceId: 'keep-it',
    choiceText: 'Keep it. Nobody is watching.',
    targetRoomId: 'photograph',
  });
  const panelText1 = await advanceUntilTextMatches(page, /camera|pocketed/i, 8);
  assert(/camera/i.test(panelText1) && /pocketed/i.test(panelText1), `expected photograph's gate beat to echo wallet's keep-it choice, got: ${panelText1.slice(0, 300)}`);
  console.log('  wallet(keep-it) -> photograph: echo line rendered.');

  // omelas's open-door -> court-of-usher's gate line should reference the unlocked basement door.
  await injectChoiceAndJumpTo(page, {
    earlierRoomId: 'omelas',
    choiceId: 'open-door',
    choiceText: 'Go down. Open the basement door. Whatever it breaks.',
    targetRoomId: 'court-of-usher',
  });
  const panelText2 = await advanceUntilTextMatches(page, /Omelas/i, 8);
  assert(/Omelas/i.test(panelText2) && /unlocked/i.test(panelText2), `expected court-of-usher's gate beat to echo omelas's open-door choice, got: ${panelText2.slice(0, 300)}`);
  console.log('  omelas(open-door) -> court-of-usher: echo line rendered.');

  // Spot-check German translation for the wallet -> photograph echo.
  // continueJourney() matches the English button label, so the language
  // switch must happen *after* the last continueJourney() in the flow —
  // inject the transcript and resume in English first, then flip to German
  // (a live in-HUD toggle, no reload) before the final jump to photograph.
  await gotoUat(page);
  await page.evaluate((id) => window.__anamnesisUat.jump(id), 'wallet');
  await page.waitForTimeout(1000);
  const entry = { roomId: 'wallet', stageIndex: 0, choiceId: 'keep-it', choiceText: 'Keep it. Nobody is watching.' };
  await patchProfile(page, new Function('p', `if (p.run) p.run.transcript = [${JSON.stringify(entry)}];`));
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(500);
  await continueJourney(page);
  await page.waitForTimeout(500);

  // Cycle order is en -> cs -> fa -> de -> fr (see resolver.ts's LANGS).
  const langBtn = page.locator('.lang-btn');
  for (let i = 0; i < 3; i++) {
    await langBtn.click();
    await page.waitForTimeout(300);
  }
  const label = await langBtn.textContent();
  assert(label === 'DE', `expected the language cycle to reach DE after 3 clicks from EN, got "${label}"`);

  await page.evaluate((id) => window.__anamnesisUat.jump(id), 'photograph');
  await page.waitForTimeout(1200);
  const dePanelText = await advanceUntilTextMatches(page, /Brieftasche/i, 8);
  assert(/Brieftasche/i.test(dePanelText) && /Kamera/i.test(dePanelText), `expected DE photograph gate beat to echo the German keep-it callback, got: ${dePanelText.slice(0, 300)}`);
  console.log('  DE: wallet(keep-it) -> photograph echo rendered translated (Brieftasche/Kamera present).');

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log('UAT 37 (choice-aftermath echoes): PASS');
});
