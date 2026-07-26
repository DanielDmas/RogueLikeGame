// UAT 65 — hostile RunState.prior.transcript via the real Continue button.
// A genuinely different attack surface than UAT 62 (which covers Profile
// fields — codexUnlocked, endingsSeen, persona, etc.): `RunState.prior` is
// deliberately NOT checked by isStructurallyValidRun (schema.ts) — it's
// optional/legacy Ledger-adjacent data, and a run shouldn't be discarded
// over a corrupted prior field. That made it a real, live-reproduced gap:
// a save sitting at `the-archive` (Act V) with `prior.transcript` set to a
// non-array value crashed with "transcript.find is not a function" the
// instant the player clicked Continue — the room's stage eagerly resolves
// every beat (including the function-beat that reads prior.transcript)
// before displaying any of them (TextPanel.playBeats), so the exception
// fires before the player sees anything.
//
// Methodologically important, and worth the comment: `jump()` (the UAT
// shortcut used by most other troll scripts) does NOT exercise this path —
// it always re-derives `prior` fresh via `priorFromProfile()`
// (Profile.lastRunTranscript, already sanitized by hydrateProfile) rather
// than trusting a saved run's own `prior` verbatim. Only a genuinely
// resumed (Continue'd) run carries the original `prior` through unmodified.
// This script deliberately uses the real title-screen Continue button, not
// jump(), for exactly that reason.
import { withPage, gotoUat, PROFILE_KEY, assert } from './_helpers.mjs';

// Every room known to read RunState.prior (the-archive/the-echo/the-cave and
// their LIMERENCE equivalents) — the-archive is the one that actually threw
// live, but the others share the same prior.transcript dependency.
const ROOMS = ['the-archive', 'the-echo', 'the-cave'];
const HOSTILE_TRANSCRIPTS = ['not-an-array', 42, {}, true];

const failures = [];

for (const roomId of ROOMS) {
  for (const hostile of HOSTILE_TRANSCRIPTS) {
    await withPage(async (page) => {
      const errors = [];
      page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e.message}`));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(`CONSOLE: ${m.text()}`); });

      await gotoUat(page);
      await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });

      await page.evaluate(
        ({ key, roomId, hostile }) => {
          const raw = localStorage.getItem(key);
          const p = raw ? JSON.parse(raw) : {};
          p.hasSeenAbout = true;
          p.runsCompleted = 2;
          p.run = {
            act: 4, hearts: 3, lucidity: 100,
            axes: { reasonFeeling: 0, selfOthers: 0, controlAcceptance: 0 },
            flags: [], transcript: [], visited: [], currentRoom: roomId, currentStage: 0,
            actOptionalDone: 0, memoryLost: false, finished: false, endingId: null,
            descended: true,
            prior: { runs: 1, endingId: 'dissolved', transcript: hostile },
          };
          localStorage.setItem(key, JSON.stringify(p));
        },
        { key: PROFILE_KEY, roomId, hostile },
      );

      await page.reload();
      await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 });
      await page.waitForTimeout(500);

      const cont = page.getByText(/CONTINUE THE JOURNEY/i).first();
      if (await cont.count()) await cont.click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(1200);

      const bodyText = await page.evaluate(() => document.body.innerText).catch(() => '');
      const recovery = bodyText.includes('The facility flickers') || bodyText.includes('facility flickers');

      if (errors.length > 0 || recovery) {
        failures.push(
          `room=${roomId} transcript=${JSON.stringify(hostile)} → ` +
            `${errors.length ? `errors: ${JSON.stringify(errors.slice(0, 2))}` : ''}` +
            `${recovery ? ' fell through to crash-recovery overlay' : ''}`,
        );
      }
    });
  }
}

assert(
  failures.length === 0,
  `hostile prior.transcript values broke the game via Continue:\n  ${failures.join('\n  ')}`,
);
console.log(
  `UAT 65 (hostile prior.transcript): PASS — ${ROOMS.length * HOSTILE_TRANSCRIPTS.length} combinations ` +
    `across ${ROOMS.length} rooms loaded via the real Continue button without errors or crash-recovery.`,
);
