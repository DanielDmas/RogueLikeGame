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
     jump(roomId: string): void,   // set currentRoom + reload flow into it (skips ahead legally via state, not by faking)
   };
   ```
   Gated strictly on the flag — the object must not exist otherwise (test
   this). `jump` exists for screenshot sweeps (E3/H2) that need specific
   rooms without playing to them; it routes through the normal
   `state → persist → runLoop` path so it can't create illegal states.
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

## 6. S3 — Per-capability test inventory (rollup of specs 01–08)

New vitest files each spec must land (names binding): `newRooms.test.ts`,
`understory.test.ts`, `anamnesis.test.ts`, `keepsakes.test.ts`,
`examinedPath.test.ts`, `ledger.test.ts`, `dioramas.test.ts`,
`flagAudit.test.ts`, `contentPipeline.test.ts`, plus extensions to
`audio.test.ts`, `usherMotion.test.ts`, `graph.test.ts`, `i18n.test.ts`,
`settings.test.ts` (new fields' migration). Expected suite: **~240+ tests,
all green**, `npx tsc --noEmit` clean, throughout the milestone — not just at
the end. The difficulty guard-rail and full-graph seeded-run tests are the
regression net for every content change; they run unmodified except count
updates.

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
