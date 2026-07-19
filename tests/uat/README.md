# Committed UAT suite (Milestone 5, Phase S §S7, §S2; extended 2026-07-15)

Thirty-three stable Playwright scripts (14 from Milestone 5, 19 added
2026-07-15 for full settings/act/overlay/ending/onboarding/accessibility
coverage across both packs — numbered 15-34, skipping 26), each verifying
one thing worth re-checking every session rather than re-deriving from
scratch. They are plain Node scripts (not a test-runner suite) — each is
self-contained, prints one `PASS` line on success, and throws on the
first failed assertion.

Use `node tests/uat/run-all.mjs` to run the whole suite (or a named
subset) in one go — it records a machine-readable result per script under
`tests/uat/results/<timestamp>/`, plus a `summary.md`, so consecutive
sweeps are directly comparable over time. See "Running them" below.

## Why these fourteen

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
| `12-choice-panel-replaces-text.mjs` | The in-room choice cards fully replace the beat text panel — no stale `.text-panel` left stacked with `.choices` in `.stage-bottom` (regression for a real bug: a missing `text.hide()` before `choices.pick(...)`). |
| `13-reflection-panel-replaces-text.mjs` | The Examined Path's reflection card fully replaces the outcome text panel — sibling regression to 12 (a missing `text.hide()` before `reflection.show(...)` let the commentary render *above* the outcome it was about). |
| `14-limerence-visual-sweep.mjs` | The first script to load `?pack=limerence` at all — LIMERENCE's HUD hearts aria-label reads "Trust" (not ANAMNESIS's "grip on reality"), and its 6 bespoke-diorama rooms plus the Porter's own figure rig render with zero console/page errors. |
| `15-settings-sweep-anamnesis.mjs` | Settings toggles (reducedMotion, highContrast) actually round-trip through close -> reload -> reopen, not just flip their DOM label on click. |
| `16-settings-sweep-limerence.mjs` | Same round-trip under `?pack=limerence`, using LIMERENCE's own storage-namespaced profile key; also confirms the Light mode toggle (LIMERENCE-only) is present. |
| `17-anamnesis-act-sweep.mjs` | One representative room per act (0-4) plus the Understory all render cleanly via `jump()` — a broad "does every floor still stand" check. |
| `18-limerence-act-sweep.mjs` | Same sweep for LIMERENCE's acts 0-4 + Understory. |
| `19-anamnesis-door-choice-flow.mjs` | The full real-click onboarding path (Begin -> auto-About -> persona skip -> Examined Path offer -> prologue door -> first room's own choice) — no `jump()`, no state injection, the literal path a first-time player clicks through. |
| `20-limerence-door-choice-flow.mjs` | Same real-click path under `?pack=limerence`. |
| `21-anamnesis-overlays-sweep.mjs` | Every title-screen overlay (Field Notes, Traveler's Ledger, The Register, Before you begin, Credits) opens with real content and closes cleanly. |
| `22-limerence-overlays-sweep.mjs` | Same sweep under `?pack=limerence`, including LIMERENCE's own advisory-branch About panel content. |
| `23-anamnesis-ending-flow.mjs` | A heart-costing choice taking hearts to 0 renders the actual end screen (epitaph/stats) rather than crashing — the live-browser companion to blocker 1.1's fix (`flow.ts`'s `hearts<=0` -> `pack.endingRules.evaluate`), and confirms `runsCompleted`/`endingsSeen` update. |
| `24-limerence-ending-flow.mjs` | Same hearts-death path in LIMERENCE — confirms it resolves to LIMERENCE's own `the-ghost`, never ANAMNESIS's `dissolved`. |
| `25-keyboard-only-navigation.mjs` | A door/choice screen is fully resolvable via Tab + ArrowDown + Enter alone — no mouse click at all (9.5.3). |
| `27-one-door-mode-both-packs.mjs` | The title screen's "One Door" button deals a real room immediately (no onboarding) in both packs, and the run-scoped profile fields (`run`, `runsCompleted`) stay untouched afterward (T9's own guarantee). |
| `28-vestibule-landing-page.mjs` | The rozcestník's two door links point at the right pack builds, and (F3, this session) the landing-music toggle stays correctly invisible against the real shipped empty `av-manifest.json`. |
| `29-language-switch-live-both-packs.mjs` | The HUD's language cycle button actually changes rendered text without a reload, and cycling to Farsi flips the document to RTL — in both packs. |
| `30-troll-test-limerence.mjs` | LIMERENCE counterpart to `10-troll.mjs` — ~20s of spammed clicks/keys/resizes/language switches at the title screen, zero uncaught page errors. |
| `31-focus-trap-overlay.mjs` | Tab cycling stays contained inside an open Settings panel for 40 presses, and releases cleanly once the panel closes (9.5.1). |
| `32-clicking-user-exploration.mjs` | An undirected "impatient user" pass — random overlay open/close order, double-clicks, Escape vs. close-button, rapid multi-card door mashing, across both packs. Zero console/page errors is the only bar. |
| `33-choice-card-visible-after-settle.mjs` | Reads real computed `opacity` on settled choice/door cards, both packs — regression guard for a live-reported bug where `.choice-card.settled` cleared `animation: none` without restating the animation's final opacity, so every card silently went invisible (opacity 0) a few hundred ms after rendering while staying fully clickable. No prior click-driven script caught it, since Playwright's actionability checks don't look at opacity. |
| `34-code-review-fixes-verification.mjs` | Live verification for the 2026-07-15 code-review fix batch: LIMERENCE's HUD hearts aria-label/tooltip and lucidity tooltip resolve to LIMERENCE's own "Trust"/"Clarity" text in Czech (not ANAMNESIS's "grip on reality"/lucidity, a real cross-pack leak the review found), and settled choice cards stay visible after the animationend-listener rescoping fix for the LIMERENCE hover/focus scan-animation collision. |
| `42-mid-room-resume-recap.mjs` | Game-experience review E1 (2026-07-19): quitting mid-room (choice applied, outcome/field-note not yet reached) and reloading no longer replays the Act I intro paragraph on resume, and the new "resumed-mid-room" recap bark shows before the field note — the exact real-browser repro of the bug the review found. |
| `43-keepsake-spent-toast.mjs` | Game-experience review E5 (2026-07-19): spending a keepsake (the Newcomb Annex's casino-chip choice, with the keepsake seeded into the profile beforehand) now shows a ✧-prefixed toast naming the keepsake — the only prior signal was the choice card's own hover tooltip, gone the instant the card is clicked. |
| `44-end-screen-settings-vestibule.mjs` | Game-experience review E4/E5 (2026-07-19): the end screen now offers Settings (opens the real panel and returns to the same end screen afterward) alongside Walk again/Field Notes/Title, and its "you carried" recap block names a keepsake seeded into the run before it started. |

`src/test/panelLifecycle.test.ts` guards the same two invariants at the
source level (fast, no browser) — 12 and 13 are the genuine rendered
checks. Both were built as *one* script initially, matching the shape of
the other twelve, but a second sequential `withPage()` browser launch in
one Node process was observed to destabilize this sandbox's headless
Chromium (hangs/crashes after several minutes of interaction) — split into
two single-`withPage()` scripts instead, matching every other script in
this suite and the "small, focused scripts" rule below.

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
3. Run the whole suite at once, or any subset:
   ```
   node tests/uat/run-all.mjs                          # every script in this directory
   node tests/uat/run-all.mjs 23-anamnesis-ending-flow.mjs 24-limerence-ending-flow.mjs
   ```
   Or run any script directly:
   ```
   node tests/uat/01-title-onboarding.mjs
   ```
   Each script opens its own fresh, isolated browser context (no shared
   `localStorage` between scripts) and finishes within CLAUDE.md's
   3-minute-per-script budget — most in 10-60s, a handful of full real-click
   onboarding-through-ending flows (19, 20, 23, 24) legitimately closer to
   the 3-minute ceiling in this sandbox's headless Chromium (multi-second
   click latency — see `_helpers.mjs`'s `advance()` comment). Scripts 06-09
   write screenshots to the gitignored `tests/uat/.artifacts/` for local
   inspection; `run-all.mjs` writes its own results (see below) to the
   **committed** `tests/uat/results/`.

## Comparing runs over time

`run-all.mjs` writes `tests/uat/results/<ISO-timestamp>/` containing one
`<script>.mjs.json` per script (pass/fail, exit code, duration, captured
stdout/stderr) plus `summary.json` and a human-readable `summary.md`. These
directories are committed (not gitignored, unlike `.artifacts/`) precisely
so two runs — before and after a change, or a week apart — can be diffed
directly: same script names, same shape, every run's pass/fail and timing
sitting right next to the last one in git history.

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
