// UAT 41 — the other half of #153: a shared display record written before
// this pack ever boots (simulating "the player set it in the other pack, or
// on the landing page, first") must be picked up the moment THIS pack loads
// — not just written when Settings is saved (UAT 40 covers that half).
// Budget: one reload, one read.
import { withPage, gotoUat, jump, assert } from './_helpers.mjs';

await withPage(async (page) => {
  await gotoUat(page);

  // Simulate "LIMERENCE (or the landing page) was just set to Cinematic".
  await page.evaluate(() => {
    localStorage.setItem(
      'vestibule:sharedDisplaySettings',
      JSON.stringify({ quality: 'high', renderScale: 'sharp', uiZoom: 1.15, fpsCap: 60 }),
    );
  });
  await page.reload();
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });

  // Nothing persists a profile to localStorage until some action saves one
  // (a fresh visit never wrote anything yet) — jump() is the simplest such
  // action: it saves the in-memory profile (which boot() already overlaid
  // the shared settings onto) and reloads, so the assertion below is
  // reading the settings the *game* actually booted with, not a synthetic
  // write of our own.
  await jump(page, 'wallet');

  const profile = await page.evaluate(() => {
    const raw = localStorage.getItem('anamnesis:profile:traveler');
    return raw ? JSON.parse(raw) : null;
  });
  assert(profile != null, 'a profile should exist after boot');
  assert(profile.settings.quality === 'high', `boot should have overlaid the shared quality, got ${profile.settings.quality}`);
  assert(profile.settings.renderScale === 'sharp', `boot should have overlaid the shared renderScale, got ${profile.settings.renderScale}`);
  assert(profile.settings.uiZoom === 1.15, `boot should have overlaid the shared uiZoom, got ${profile.settings.uiZoom}`);
  assert(profile.settings.fpsCap === 60, `boot should have overlaid the shared fpsCap, got ${profile.settings.fpsCap}`);

  console.log('UAT 41 (shared display settings applied on boot): PASS');
});
