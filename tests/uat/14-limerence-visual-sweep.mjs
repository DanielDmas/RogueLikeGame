// UAT 14 — LIMERENCE visual sweep (L5 polish verification). Every prior
// script in this suite loads the default (ANAMNESIS) pack; this is the
// first to exercise `?pack=limerence` at all, closing the "UAT pack
// matrix" gap left open in UPGRADE_PLAN.md's L5 entry. Confirms this
// session's L5 work actually renders in a real browser rather than just
// type-checking: the 6 rooms with bespoke dioramas, the Porter's own
// figure rig, and the Trust-labeled HUD — zero console/page errors
// throughout, which is the class of failure unit tests can't catch on
// raw Three.js geometry construction.
import { withPage, gotoUat, assert } from './_helpers.mjs';

const DIORAMA_ROOMS = ['the-read-receipt', 'just-friends', 'the-therapist', 'the-kitchen-table', 'the-second-account', 'the-colleague'];

await withPage(async (page) => {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));

  await gotoUat(page, 'pack=limerence&uat=1');

  const heartsLabel = await page.locator('.hearts').first().getAttribute('aria-label');
  assert(heartsLabel === 'Trust', `LIMERENCE's HUD hearts aria-label should be "Trust", got "${heartsLabel}"`);

  for (const room of DIORAMA_ROOMS) {
    await page.evaluate((id) => window.__anamnesisUat.jump(id), room);
    await page.waitForFunction(() => window.__anamnesisUat && window.__anamnesisUat.version, { timeout: 10000 });
    await page.waitForTimeout(500);
  }

  await page.screenshot({ path: 'tests/uat/.artifacts/14-limerence-last-diorama.png' });

  assert(errors.length === 0, `expected zero console/page errors across the LIMERENCE diorama sweep, got: ${JSON.stringify(errors)}`);

  console.log(`UAT 14 (LIMERENCE visual sweep): PASS — ${DIORAMA_ROOMS.length} diorama rooms + HUD Trust label, zero errors`);
});
