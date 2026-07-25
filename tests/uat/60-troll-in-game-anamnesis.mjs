// UAT 60 — extended in-game troll test, ANAMNESIS. A real gap in the existing
// troll coverage: scripts 10/30 both say so explicitly in their own header
// comments — they chaos-test only the title screen, never actual gameplay.
// This one jumps straight into a room and spends its budget hammering the
// surfaces the title screen doesn't have at all: the door-walkthrough camera
// dolly (canvas clicks vs. digit-key choice picks racing each other), the
// HUD's always-present Menu/Settings/language controls mid-room, typewriter
// keyboard-mashing, viewport resizes mid-3D-transition, and repeated jump()
// calls that each interrupt whatever the previous one left in flight.
//
// Two things distinguish this from a flakiness-tolerant smoke test: (1) every
// interaction is dispatched without waiting for its target to be "ready" —
// the whole point is to catch the class of bug where a click lands mid-
// animation or mid-promise; (2) a final sanity check confirms the game is
// still in a *recoverable* state after the chaos (a fresh load resumes
// cleanly), not just that no error was thrown during the chaos itself — a
// bug could corrupt state silently without ever throwing.
import { withPage, gotoUat, jump, assert } from './_helpers.mjs';

const DURATION_MS = 45000;
const KEYS = ['1', '2', '3', '4', 'Digit1', 'Digit2', 'Escape', 'Enter', ' ', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'Backspace'];
const VIEWPORTS = [
  { width: 1280, height: 800 },
  { width: 640, height: 480 },
  { width: 1920, height: 1080 },
  { width: 1280, height: 800 },
];
// A spread of rooms across acts, so repeated jump() calls genuinely interrupt
// different in-flight states (a door row, a mid-stage beat, a choice screen)
// rather than always restarting the same one.
const ROOMS = ['waiting-room', 'boulder', 'junction', 'buridans-queue', 'the-reference'];

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await gotoUat(page);
  await jump(page, ROOMS[0]);

  const start = Date.now();
  let i = 0;
  while (Date.now() - start < DURATION_MS) {
    const mode = i % 9;
    try {
      if (mode === 0) {
        // Digit-key choice pick, undelayed — races any in-flight dolly/typewriter.
        await page.keyboard.press(KEYS[i % KEYS.length]);
      } else if (mode === 1) {
        // A raw canvas click, simulating a 3D door click mid-animation
        // (flow.ts's onDoorClick -> doorClickThrough path).
        const box = await page.viewportSize();
        await page.mouse.click(box.width * 0.3 + Math.random() * box.width * 0.4, box.height * 0.4);
      } else if (mode === 2) {
        await page.setViewportSize(VIEWPORTS[i % VIEWPORTS.length]);
      } else if (mode === 3) {
        // HUD controls, present throughout gameplay unlike the title screen.
        const menu = page.locator('.menu-btn').first();
        if (await menu.count()) await menu.click({ timeout: 2000 }).catch(() => {});
      } else if (mode === 4) {
        await page.keyboard.press('Escape');
      } else if (mode === 5) {
        // Language switch mid-beat/mid-animation — a real prior bug class
        // (stale-language re-render races) lives exactly here.
        const langBtn = page.locator('.lang-btn, [data-uat="language-toggle"]').first();
        if (await langBtn.count()) await langBtn.click({ timeout: 2000 }).catch(() => {});
      } else if (mode === 6) {
        // Text panel spam-click — the typewriter skip-then-advance path.
        const panel = page.locator('.text-panel').first();
        if (await panel.count()) await panel.click({ timeout: 2000 }).catch(() => {});
      } else if (mode === 7) {
        // Interrupt whatever is currently happening with a fresh jump — the
        // one interaction the title-screen troll tests structurally cannot
        // exercise at all.
        await page.evaluate(
          (id) => window.__anamnesisUat?.jump(id),
          ROOMS[Math.floor(Math.random() * ROOMS.length)],
        );
        await page.waitForTimeout(400);
      } else {
        const box = await page.viewportSize();
        await page.mouse.click(Math.random() * box.width, Math.random() * box.height);
      }
    } catch {
      // Targets legitimately vanish mid-chaos (a panel closes, a reload
      // fires) — expected noise. Only a real `pageerror`/console error counts.
    }
    await page.waitForTimeout(90);
    i++;
  }

  console.log(`in-game troll loop (ANAMNESIS): ${i} actions, ${errors.length} errors`);
  assert(errors.length === 0, `expected zero console/page errors during chaos, got: ${JSON.stringify(errors)}`);

  // Recoverability check: a bug could silently corrupt persisted state
  // without ever throwing during the chaos above. Reload cold and confirm
  // the app boots to a real, sane screen rather than a blank page or a
  // recovery overlay.
  await page.reload();
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForTimeout(500);
  const bodyText = await page.evaluate(() => document.body.innerText);
  assert(bodyText.trim().length > 0, 'expected real rendered content after a post-chaos reload, got a blank page');
  const recovery = await page.locator('.recovery-panel').count();
  assert(recovery === 0, 'post-chaos reload should not land on the crash-recovery overlay');

  console.log('UAT 60 (in-game troll test, ANAMNESIS): PASS');
});
