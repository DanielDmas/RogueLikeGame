# Committed UAT suite (Milestone 5, Phase S §S7, §S2)

Eleven stable Playwright scripts, each verifying one thing this milestone's
ad hoc scratchpad scripts kept re-deriving from scratch every session. They
are plain Node scripts (not a test-runner suite) — each is self-contained,
prints one `PASS` line on success, and throws on the first failed
assertion.

## Why these eleven

| Script | Verifies |
|---|---|
| `01-title-onboarding.mjs` | Fresh-profile title screen (Begin, no "Continue"), the non-negotiable auto-About on a true first playthrough, and the phantom-run regression (`profile.run` stays `null` until a real run starts). |
| `02-save-reload-continue.mjs` | A mid-run save survives a page reload and "Continue the journey" resumes at the exact same room/act. |
| `03-examined-path.mjs` | The Examined Path's reflection card renders with all 4 traditions after a choice, when opted in. |
| `04-keepsakes-shelf.mjs` | A keepsake is earned immediately on its trigger flag and shows as earned on the Codex Shelf. |
| `05-anamnesis.mjs` | The seventh ending's hidden "I remember all of it" option appears at the final door once its eligibility conditions are met. |
| `06-layout-sweep.mjs` (M4 C3) | The Settings panel stays fully on-screen at the narrow 800x1280 portrait floor. |
| `07-scenery-proof.mjs` (M4 E3) | The "Dynamic scenery" setting round-trips through Settings -> localStorage -> reload. (A pixel-color visual comparison was attempted first; see the script's header comment for why it was replaced.) |
| `08-door-visibility.mjs` (M4 H2) | Every offered door's `doorRects()` projection is fully `onScreen` at the narrow viewport, reached via a real completed room. |
| `09-transition-garble.mjs` (M4 H3) | A burst of screenshots during an act-gate door walkthrough shows at least one non-black frame (no fully-disposed/garbled frame). |
| `10-troll.mjs` | Spamming clicks/keys/resizes/language switches at the title screen for ~20s raises zero uncaught page errors. |
| `11-i18n-matrix.mjs` | Czech and Farsi taglines differ from the English fallback, and Farsi correctly flips the document to RTL. |

Scripts 06-11 (Milestone 5 Phase S2, "M4's deferred verification debt")
are each scoped down from the spec's original sketch (see each script's
header comment) to fit this project's `?uat=1`/Playwright sandbox, whose
headless Chromium has multi-second click latency — see `_helpers.mjs`'s
`advance()` comment. A faster machine or CI runner can restore the fuller
multi-viewport/multi-panel coverage the spec originally sketched.

## Running them

1. Install Chromium once: `npx playwright install chromium` (most machines).
   This project's own remote execution sandbox pre-stages a browser outside
   Playwright's normal cache; `_helpers.mjs` falls back to that path
   automatically if present, so nothing extra is needed there. Override
   either environment with `UAT_CHROMIUM_PATH=/path/to/chrome`.
2. Start the dev server in one terminal: `npm run dev` (defaults to
   `http://localhost:5173`; override with `UAT_BASE_URL`).
3. Run any script directly in another terminal:
   ```
   node tests/uat/01-title-onboarding.mjs
   node tests/uat/02-save-reload-continue.mjs
   node tests/uat/03-examined-path.mjs
   node tests/uat/04-keepsakes-shelf.mjs
   node tests/uat/05-anamnesis.mjs
   node tests/uat/06-layout-sweep.mjs
   node tests/uat/07-scenery-proof.mjs
   node tests/uat/08-door-visibility.mjs
   node tests/uat/09-transition-garble.mjs
   node tests/uat/10-troll.mjs
   node tests/uat/11-i18n-matrix.mjs
   ```
   Each opens its own fresh, isolated browser context (no shared
   `localStorage` between scripts) and finishes in well under CLAUDE.md's
   3-minute-per-script budget. Scripts 06-11 write screenshots to the
   gitignored `tests/uat/.artifacts/` for local inspection.

## Conventions followed (see CLAUDE.md)

- Every script loads the game with `?uat=1`, which forces the typewriter
  off and speeds up tweens/fades — see `src/engine/uatMode.ts`.
- Beats are advanced by clicking `.text-panel` (or pressing a key), never by
  polling-and-clicking a moving target in a loop.
- `window.__anamnesisUat.jump(roomId)` is used to land directly on the room
  under test instead of playing there by hand — it persists a legitimate
  `RunState` and reloads, so it can never produce an illegal game state.
- Where a script needs profile-level state that isn't reachable via `jump()`
  alone (an opted-in Examined Path, a specific `anamnesisEligible` input),
  it patches the persisted profile in `localStorage` directly rather than
  grinding a real playthrough to that state, then reloads to pick it up.

## `jump()`'s Act IV / Understory backfill

`jump()` calls `backfillVisitedForJump` (`src/engine/storyEngine.ts`) before
persisting, so jumping straight to a room in `ACT4_SEQUENCE` or
`UNDERSTORY_SEQUENCE` marks the sequence's earlier rooms as `visited`. Before
this fix, jumping straight to `door-that-asks` and completing it would
re-offer `boulder` afterward, since `offeredDoors` walks `ACT4_SEQUENCE`
looking for the first *unvisited* entry. See `backfillVisitedForJump`'s own
tests in `src/test/graph.test.ts` for the pure-logic coverage; this suite
exercises the resulting in-browser behavior indirectly via `02` and `05`.
