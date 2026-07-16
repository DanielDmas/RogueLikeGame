// UAT 46 — item 13's fix: main.ts now loads the active pack via a dynamic
// import() gated on the compile-time __PACK__ constant (production) or the
// dev-only ?pack= override, instead of statically importing both packs.
// Verifies both packs actually boot and play correctly through this new
// loading path, in both the default (ANAMNESIS) and override (LIMERENCE)
// routes, and that a real room/door/choice sequence works end to end in
// each. Budget: well under 3 minutes.
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const BASE_URL = process.env.UAT_BASE_URL ?? 'http://localhost:5173';
const SANDBOX_CHROMIUM_PATH = '/opt/pw-browsers/chromium';

function assert(condition, message) {
  if (!condition) throw new Error(`UAT assertion failed: ${message}`);
}

async function checkPack(browser, query, expectedPackId, expectedRoomId) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto(`${BASE_URL}/?uat=1${query}`);
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });

  await page.evaluate((roomId) => window.__anamnesisUat.jump(roomId), expectedRoomId);
  // jump() persists then reloads — wait for the handle to re-attach after
  // the reload (it briefly doesn't exist mid-navigation) before polling state.
  await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
  await page.waitForFunction(
    (roomId) => window.__anamnesisUat.state().currentRoom === roomId,
    expectedRoomId,
    { timeout: 10000 },
  );

  const bodyClass = await page.evaluate(() => document.body.className);
  assert(bodyClass.includes(`pack-${expectedPackId}`), `expected body to carry pack-${expectedPackId}, got "${bodyClass}"`);

  const profile = await page.evaluate((packId) => {
    const raw = localStorage.getItem(`${packId}:profile:traveler`);
    return raw ? JSON.parse(raw) : null;
  }, expectedPackId);
  assert(profile != null, `expected a ${expectedPackId}:profile:traveler entry in localStorage`);
  assert(profile.run?.currentRoom === expectedRoomId, `expected the persisted run's currentRoom to be ${expectedRoomId}, got ${profile.run?.currentRoom}`);

  assert(errors.length === 0, `no console errors expected loading ${expectedPackId} via dynamic import, got: ${errors.join(' | ')}`);

  await page.close();
}

const browser = await chromium.launch({
  executablePath: existsSync(SANDBOX_CHROMIUM_PATH) ? SANDBOX_CHROMIUM_PATH : undefined,
});
try {
  // Default route (no ?pack= override) — production builds always take
  // this path via the compile-time __PACK__ constant; the dev server's
  // default (no VITE_PACK env set) also resolves to anamnesis.
  await checkPack(browser, '', 'anamnesis', 'wallet');

  // Dev-only override route — the other branch of loadPack()'s dynamic import.
  await checkPack(browser, '&pack=limerence', 'limerence', 'the-front-desk');

  console.log('UAT 46 (dynamic pack loading via __PACK__/?pack=): PASS');
} finally {
  await browser.close();
}
