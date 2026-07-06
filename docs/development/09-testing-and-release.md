# Specification 09 — Testing, UAT & Release (Phase S)

## 1. Purpose

Make browser verification fast and deterministic (the `?uat=1` mode), pay off
Milestone 4's deferred verification debt, hold the line that **every new
capability ships with tests**, and define the v0.2.0-beta release procedure.

**Build order note: S1 (`?uat=1`) is the FIRST thing implemented in Milestone
5** — every later phase's browser checks depend on it.

## 2. Binding rules (from `CLAUDE.md` — repeat here for the implementer)

- No UAT/Playwright run may exceed 3 minutes wall-clock; each script carries
  its own hard timeout and is designed to finish well under it.
- Split broad playthroughs into small, focused scripts.
- If a UAT script needs a re-run, stop and ask the user first (offer a
  cheaper model).
- One repair attempt per failing check, then report and move on.

## 3. Current state

- Tests: 183 vitest tests across 21 files (`environment: 'node'`, no DOM) —
  pure-helper extraction is the established pattern for testability.
- UAT learnings from M4 (root causes, so they are not re-fought): the
  typewriter's skip-then-advance semantics made click-loops slow/flaky
  (advance via two clicks or Space twice); a keydown-guard exists so
  Space/number keys don't leak through overlays; scripts must start their own
  `vite --port 5183 --strictPort` and check it's up; Playwright is
  preinstalled at `/opt/pw-browsers` with the global module at
  `/opt/node22/lib/node_modules/playwright` (symlink into the scratch dir's
  `node_modules`).
- M4's deferred debt (UPGRADE_PLAN Phase J → folded here): full C3 layout
  sweep, E3 dynamic-scenery visual proof, H2 door-visibility sweep, H3
  transition-garble check, troll test, EN/CS/FA playthrough matrix.
- Release path: `release-windows.yml` dispatched with a `tag_name` input
  (direct tag pushes 403 in the remote session). v0.1.5-v2-beta shipped this
  way.

## 4. S1 — The `?uat=1` test mode

### Behavior

Boot-time flag, read once in `src/main.ts`:

```ts
const uat = new URLSearchParams(location.search).has('uat');
```

Threaded into `Game` (constructor option). When ON:

1. Typewriter forced off (`text.setTypewriter(false)` wins over settings;
   the settings toggle still displays its stored value).
2. All scene tween durations multiplied by 0.25 — implement as
   `director.setSpeedMultiplier(m)` applied to `USHER_WALK_SECONDS`,
   `CAMERA_DOLLY_SECONDS`, fade transitions, and toast timings.
3. A **UAT-only** debug handle on `window`:
   ```ts
   window.__anamnesisUat = {
     version: __APP_VERSION__,
     doorRects(): { id: string; rect: DOMRect-like; onScreen: boolean }[],  // projected door bounds
     state(): { act, hearts, lucidity, currentRoom, currentStage },
     fps(): number,                // rolling average over the last ~2s of presented frames
     jump(roomId: string): void,   // set currentRoom + reload flow into it (skips ahead legally via state, not by faking)
   };
   ```
   Gated strictly on the flag — the object must not exist otherwise (test
   this). `jump` exists for screenshot sweeps (E3/H2) that need specific
   rooms without playing to them; it routes through the normal
   `state → persist → runLoop` path so it can't create illegal states.
   **`jump` semantics (binding):** it must also set `state.act = room.act`
   (theme/mood/HUD stay coherent), reset `currentStage` to 0, and refuse —
   with a console warning, not a throw — targets whose preconditions can't be
   legally synthesized (understory rooms without `prior`, the anamnesis-gated
   final stage). `fps()` exists so diorama-heavy rooms get a cheap
   performance assertion (E3/H2 scripts assert `fps() >= 30` headless).
4. Never persisted; never enabled by settings; no UI surface. Prod players
   who paste the URL merely get faster text — acceptable.

### Tests

Unit: speed multiplier math; flag parsing; handle absent without flag.
Document the mode in `CLAUDE.md` (one paragraph) in the same commit.

## 5. S2 — Milestone 4's deferred verification debt (run FIRST, before new features change the baseline)

Committed, versioned scripts under `scripts/uat/` (no longer scratch-dir
throwaways), each self-timed, each ≤ 60s target / 90s hard timeout, run
serially — total budget < 3 min per batch of three:

| Script | Checks | Method |
|---|---|---|
| `layout-sweep.mjs` (C3) | Settings / field note / codex / pause / about fully on-screen | viewports 1366×768, 1280×720, 1024×768, 800×1280; `?uat=1`; assert panel + primary button bounding boxes ⊂ viewport; screenshots archived |
| `scenery-proof.mjs` (E3) | dynamic scenery visibly works | `jump('marys-room' → INSIGHT)` vs `jump('omelas' → DOOMED)` with toggle ON: average canvas RGB must differ beyond threshold; toggle OFF: within threshold |
| `door-visibility.mjs` (H2) | every door fully on-screen | at 1280×800, 1024×768, 800×1280: walk door screens (2-door, 3-door secret case via seeded profile), assert `doorRects()` all `onScreen` |
| `transition-garble.mjs` (H3) | no half-disposed frames at act boundaries | screenshot burst (5 frames) during walkThrough at an act gate; assert no frame's door-region is pure black or noise-spiked (pixel-variance heuristic) |
| `troll.mjs` | zero uncaught errors under abuse | spam clicks/keys/resizes/settings toggles/lang switches for 45s; `pageerror` count === 0 |
| `i18n-matrix.mjs` | CS + FA playable surface | prologue + menus in each language; assert Czech diacritics / Farsi RTL body class; codex note body non-English |

Each failing check: one repair attempt, then report. Results table goes into
the PR description; `UPGRADE_PLAN.md`'s M4 deferred items get checked with a
pointer to the run.

## 6. S3 — Feature → test traceability matrix (every new thing has a test)

This matrix is the completeness contract: **no feature below ships without
its listed tests green.** (Unit/Sim = vitest, node env; UAT = `scripts/uat/`
Playwright under the CLAUDE.md budget; Manual = documented steps for the
owner where automation cannot judge.)

| Feature (spec) | Unit / simulation | UAT / manual |
|---|---|---|
| 9 new rooms (01) | `newRooms.test.ts` (structure, secret gate, dynamic beats) · `graph.test.ts` counts · `difficultyGuardRail` re-run · i18n auto-coverage | `i18n-matrix.mjs` spot-render; door sweeps pick up new pools |
| prior-run mirror (01/02) | stamp/reset/resume tests in `understory.test.ts` | quit/reload cycle in `quit-resume` script |
| Understory (02) | `understory.test.ts` (eligibility, once-only fork, sequencing, fallbacks, exhibit-pick rule, **quote-translation rule**) | scripted descent playthrough (`?uat=1&jump`) |
| Codex secrecy for understory (02/06) | `ledger.test.ts` `visibleRoomCount` | codex screenshot before/after descent |
| 7th ending (03) | `anamnesis.test.ts` (predicate positive + each-negative, priority, 6/7 display, margin hints in 3 langs) | reachability walk via seeded profile + `jump` |
| Keepsakes (04) | `keepsakes.test.ts` (hard no-op guarantee, earn idempotence, mirror timing, non-retroactivity, taken-tracking, no hearts effects) | ✧ marker + Shelf screenshot |
| Examined Path (05) | `examinedPath.test.ts` (disabled no-op, reflections schema, shuffle set-equality, resume behavior, act-question gating) | opt-in panel flow + one reflection render, EN+CS |
| Ledger & Epiphanies (06) | `ledger.test.ts` (all stats, all 12 predicates ±, newly-earned dedup, counter write-points, migration) | ledger screenshot at 1024×700 (layout) |
| Dioramas (07 Q1) | `dioramas.test.ts` (registry completeness, mesh budget, dispose leak via renderer.info soak) | `fps() >= 30` assertion per bespoke room; visual archive |
| Light-spill (07 Q2) | `spillColorFor` unit + disposal assert | transition screenshot burst (garble script) |
| Title polish (07 Q3) | `parallaxOffset`, `epitaphLines`, version-define wiring | title screenshot ±2 endings; version string via uat handle |
| Hover pulse (07 Q4) | `hoverPulseIntensity` bounds/reduced-motion | — (covered visually by door sweep) |
| Audio deepening (07 Q5) | `makeImpulse`, pitch table, crossfade param, accent idempotence, reverb-send wiring | manual listen pass (owner feel-pass list) |
| Usher lantern (07 Q6) | `usherMotion.test.ts` ext (exists, clamp, decay, lean sign) | manual feel pass |
| Pages deploy (08 R1) | workflow YAML lint (actionlint or schema check) | deployed-URL smoke script (prologue + settings) |
| Electron polish (08 R2) | window-state read/write pure helpers | manual Windows checklist in PR |
| Czech pass (08 R3) | coverage tests stay green (values-only change) | owner reads 3 sample screens |
| DE/FR (08 R4) | language-list loops in all 3 coverage tests | `i18n-matrix.mjs` extended |
| Flag audit (08 R6) | `flagAudit.test.ts` (every set flag has a reader) | — |
| Persona whisper (08 R7) | token-preservation test (`{name}` survives cs/fa) | one bark render with a named persona |
| `?uat=1` mode (09 S1) | flag parsing, speed multiplier math, handle absent in prod | every S2 script exercises it |
| Content pipeline (08 R5) | `contentPipeline.test.ts` structural invariants | — |

Suite expectation: **~240+ tests, all green, `npx tsc --noEmit` clean,
throughout the milestone — not just at the end.** The difficulty guard-rail
and full-graph seeded-run tests are the regression net for every content
change; they run unmodified except count updates.

## 7. S4 — Full regression & feel pass

- `npx tsc --noEmit` + `npx vitest run` + the six S2 scripts re-run against
  the finished milestone.
- Manual feel pass (owner, or dev with display): Usher walk + dolly pacing
  with dioramas present, lantern behavior, reverb tail taste, title parallax
  restraint. Screenshots/video cannot judge these — schedule a check-in with
  the owner rather than self-certifying.

## 8. S5 — Release v0.2.0-beta

1. `package.json` version → `0.2.0-beta` (electron-builder derives the EXE
   name `ANAMNESIS-0.2.0-beta-win-x64.exe`).
2. `UPGRADE_PLAN.md`: check every completed M5 box honestly; add amendment
   notes for anything descoped.
3. Commit + push branch; dispatch `release-windows.yml` with
   `tag_name: v0.2.0-beta`; verify the release asset publishes (get-release
   check, as for v0.1.5-v2-beta).
4. Dispatch `deploy-pages.yml` (spec 08 R1); verify the public URL serves the
   new version (the title screen's version number — Q3.1 — is the check).
5. Report to the owner: release URL, Pages URL, test counts, S2 results
   table, any descopes.

## 9. Acceptance criteria

- [ ] `?uat=1` exists, documented, and every S2 script uses it.
- [ ] All six S2 scripts pass (or carry a reported, owner-acknowledged
      exception) — M4's Phase J debt is closed.
- [ ] Suite ~240+ green; no capability shipped untested.
- [ ] v0.2.0-beta EXE + Pages deployment both live and verified.
