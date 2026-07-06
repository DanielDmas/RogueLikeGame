// UAT 05 — the seventh ending's hidden option (spec 03). `anamnesisEligible`
// is recomputed fresh from `profile.codexUnlocked`/`keepsakeChoicesTaken`
// every time `door-that-asks` is entered (flow.ts's `enterRoom`), so rather
// than grinding a whole profile to genuine eligibility this patches those
// two profile-level inputs directly (full codex + 2 keepsake choices), plus
// lucidity on the run (>=140) and clears any erased-memory flag, and
// confirms the hidden "I remember all of it" option renders at the final
// door.
import { withPage, gotoUat, continueJourney, advance, clickChoiceMatching, assert } from './_helpers.mjs';

await withPage(async (page) => {
  await gotoUat(page);

  const allRoomIds = await page.evaluate(async () => {
    const mod = await import('/src/content/rooms/index.ts');
    return mod.allRooms.map((r) => r.id);
  });

  await page.evaluate(() => window.__anamnesisUat.jump('door-that-asks'));
  await page.waitForTimeout(1200);

  await page.evaluate(
    ({ key, allRoomIds }) => {
      const raw = localStorage.getItem(key);
      const parsed = JSON.parse(raw);
      parsed.codexUnlocked = allRoomIds;
      parsed.keepsakeChoicesTaken = ['interrogate', 'bet-against'];
      if (parsed.run) {
        parsed.run.lucidity = 150;
        parsed.run.flags = (parsed.run.flags ?? []).filter((f) => f !== 'erased-memory');
      }
      localStorage.setItem(key, JSON.stringify(parsed));
    },
    { key: 'anamnesis:profile:traveler', allRoomIds },
  );
  await page.reload();
  await page.waitForTimeout(1000);
  await continueJourney(page);
  await page.waitForTimeout(600);

  await advance(page, 10, 300);

  const clicked = await clickChoiceMatching(page, /sign it again/i);
  assert(clicked != null, "should be able to answer the door's interview (stage 1)");
  await page.waitForTimeout(600);

  // Outcome beats, then the threshold beats (stage 2) with the door choices.
  await advance(page, 12, 350);

  const rememberChoice = await page.locator('.choice-card', { hasText: /i remember all of it/i }).count();
  assert(rememberChoice > 0, 'the hidden "I remember all of it" option should be offered when anamnesisAvailable is true');

  console.log('UAT 05 (anamnesis hidden option): PASS');
});
