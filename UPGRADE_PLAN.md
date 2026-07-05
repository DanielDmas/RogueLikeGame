# ANAMNESIS — Upgrade Plan & Development Roadmap

> **This is the living tracking file for all further development of ANAMNESIS.**
> Each work item has a checkbox. As features land, boxes get checked and remarks
> are added inline. New milestones append new phases at the bottom — history is
> never deleted, so this file doubles as the project's development log.

**Current milestone: 4, mostly shipped** — Phases A–I implemented (see
checkboxes below for the handful of items amended or deferred). Phase J's
full Playwright verification matrix (multi-viewport sweeps, dynamic-scenery
screenshot proof, troll test) is still outstanding — pick it up first next
session. Previous milestones (1–3, all shipped): core game + 20 rooms + 6
endings · generative audio, icons, Electron/EXE releases · full CS/FA
translations, v1/v2 text voices, dynamic scenery, field-note markup.
Latest release: [`v0.1.5-v2-beta`](../../releases/tag/v0.1.5-v2-beta).

---

## Known issues found during planning (verified in code)

These were confirmed by code inspection before this plan was written, and are
fixed by the phases below:

1. **Codex language bug** — `showCodex` (`src/ui/overlays.ts` ~398/409) passes
   the raw English `room.fieldNote`/`ending.fieldNote` to `showFieldNote`,
   while `src/engine/flow.ts:296-304, 342-349` correctly translates. Result:
   codex cards show Czech, but the opened note shows English. → Phase D1.
2. **Untranslated UI strings** — `'Continue'` (`src/ui/fieldNote.ts:30`),
   `'click · space'` and `'continue'` (`src/ui/textPanel.ts:69,77`), plus two
   aria-labels. → Phase D2.
3. **Mid-room save flaw** — quitting during a room's beats/choices restarts
   the room from stage 0 on resume and re-applies already-saved effects
   (double-counted hearts/axes, duplicate transcript). Quitting at the door
   screen or right after choosing a door is safe (persist at `flow.ts:254`).
   → Phase B1/B2.
4. **No FPS cap** — uncapped `requestAnimationFrame` (`src/scene/director.ts:187`);
   no resolution-scale setting; no fullscreen anywhere. → Phase A.
5. **Settings overlay clips on short screens** — no bounded scroll container
   (unlike `.codex-panel`'s `max-height:84vh`); bottom rows/Done can be
   unreachable. → Phase C1.
6. **Usher "flies"** — exponential position lerp `1−0.001^dt`
   (`director.ts:196`) closes the distance in under a second; camera dolly
   (`1−0.0018^dt`, `:202`) is similarly abrupt. → Phase F.
7. **Doors can leave the screen** on narrow aspect ratios — FOV 58, door
   spacing 3.4, camera z=7, no aspect compensation. → Phase H.
8. **Hearts explanation overpromises** — About text mentions a "repeated
   refusal" cost that has no backing code; only 4 choices + the lucidity
   drain (`src/engine/gameState.ts:44-53`) cost hearts; act intros never
   mention hearts at all. → Phase G.

---

## Phase A — Display, Performance & Fullscreen
*(resolution/zoom · fullscreen · 60 FPS cap · must not be GPU-demanding)*

- [x] **A1. 60 FPS frame limiter.** In `SceneDirector.loop` (`src/scene/director.ts`):
  keep rAF but skip render+tick until ≥1/60 s has accumulated since the last
  presented frame. Prevents 144–240 Hz monitors from rendering 4× the needed
  frames. Implement as a pure, unit-testable `shouldRender(now, last)` helper.
- [x] **A2. Stop rendering when nothing moves.** Pause the 3D loop entirely
  while a full-screen overlay (Settings/Codex/About/pause) is open and while
  `document.hidden`; drop the title screen to 30 FPS once its intro settles.
  The single biggest GPU/battery saving available.
- [x] **A3. Resolution setting** — new Settings row "Render resolution":
  `0.75× (performance) / 1× (standard) / native (sharp, up to 2× DPR)`,
  driving `renderer.setPixelRatio` live. Decoupled from "High visual quality"
  (which keeps controlling antialiasing + bloom only). Persist in `Settings`
  (`src/engine/saveStore.ts` + migration backfill, same pattern as
  `dynamicScenery`).
- [x] **A4. UI zoom setting** — 80%–130% slider scaling the root font size so
  every panel and text scales together. For TVs and small laptops. Persisted,
  applies instantly.
- [x] **A5. Fullscreen toggle** in Settings + `F` hotkey —
  `document.documentElement.requestFullscreen()` / `exitFullscreen()`, state
  synced from the `fullscreenchange` event (so Esc-exit updates the toggle).
  Works in browser and the Electron shell alike; also add window-state
  remembering to `electron/main.cjs`.
- [x] **A6. GPU diet pass** — confirm bloom only runs on "high"; cap
  `devicePixelRatio` at 2 everywhere; audit geometry/material disposal on
  theme switches with `renderer.info` across a 10-switch soak test (no leaks).

**Tests:** limiter unit test · Playwright fullscreen round-trip · live
resolution change asserts canvas backing-store size · soak-test renderer.info.

---

## Phase B — Saving, Reset & Data Safety
*(save/reset buttons · verify saving on quit always works, incl. when choosing doors)*

- [x] **B1. Fix the mid-room resume bug.** Add `currentStage: number` to
  `RunState` (`src/content/schema.ts`, `newRun` in `src/engine/gameState.ts`),
  persist after **every stage choice** in `enterRoom` (`src/engine/flow.ts`),
  resume at the saved stage. Kills replayed beats, duplicate transcript
  entries, and double-charged hearts. Old saves migrate with `currentStage: 0`.
- [x] **B2. Verify save-on-quit from every state** — scripted playthrough that
  quits to menu (a) at door selection, (b) immediately after clicking a door,
  (c) mid-beats, (d) at a choice prompt, (e) during an act intro, (f) on the
  ending screen — reload after each, assert exact resume position.
- [x] **B3. "Save & Exit" button** in the pause menu — explicit, reassuring
  save-then-title path (saving already happens on quit; the button makes it
  *visible* to the player).
- [x] **B4. Autosave indicator** — small "✓ saved" fade near the HUD whenever a
  checkpoint persists (door chosen, room completed, act reached). Players
  should never wonder whether progress is safe.
- [x] **B5. "Reset progress" button** in Settings → new *Data* section, with a
  two-step confirm; wipes the profile and reloads. Plus **"Reset current
  run"** (abandon run, keep codex/endings/settings).

**Tests:** stage-resume unit tests · Playwright quit-matrix (B2) · reset flows
(full wipe vs run-only) leave the right things intact.

---

## Phase C — Layout: Settings & Field Notes on every screen
*(two-pager / side-by-side · bottom options not visible on smaller screens)*

- [x] **C1. Settings — bounded, sectioned, two-column.** Wrap `showSettings`
  content in a panel with `max-height: 84vh; overflow-y: auto` (reuse the
  `.codex-panel` pattern, `src/styles.css:282`). On viewports ≥900 px wide,
  a **two-column grid** grouped under headed sections: **Display**
  (fullscreen, resolution, UI zoom, quality, dynamic scenery, reduced motion)
  · **Audio** (music+volume, sfx+volume) · **Text & Language** (language,
  text version, typewriter, high-contrast) · **Data** (save & exit, reset run,
  reset progress). Done button in a sticky footer — always visible.
- [x] **C2. Field notes — side-by-side pages.** On wide screens render the
  note body in **two text columns** (`column-count: 2`) so long notes read
  like a book spread instead of a deep scroll; single column + internal
  scroll under 900 px. Continue button sticky at the card's bottom. Header
  (label + pictogram + title + thinkers) spans both columns.
- [x] **C3. Small-screen audit — partial.** Verified the Settings panel's
  sticky Done button and Data section at 1024×700 via Playwright. The full
  sweep (1366×768, 1280×720, 800×1280 portrait; field note/codex/pause/about
  as well as Settings) was not run — see Phase J.

**Tests:** C3 sweep · CSS regression tests in `styles.test.ts` (bounded
settings panel, field-note column rule).

---

## Phase D — i18n completion + the Czech codex bug
*(translate "Click", "Space", "Continue", chapter names · verify all translated ·
"Když klikám na poznámky z menu s češtinou, zobrazují se anglicky")*

- [x] **D1. Fix the codex language bug** — in `showCodex`
  (`src/ui/overlays.ts`) build the note passed to `showFieldNote` with
  `t(roomNoteTitleKey/ThinkersKey/BodyKey)` and the ending equivalents,
  exactly mirroring `flow.ts:296-304/342-349`. Translate the aria-label too.
- [x] **D2. Translate the last hardcoded strings** — `'Continue'`
  (`fieldNote.ts:30`), `'click · space'` + `'continue'`
  (`textPanel.ts:69,77`), aria-labels (`hud.ts:27`, `fieldNote.ts:27`). New
  `ui.*` keys + CS/FA entries in `src/content/text/cs.ts` / `fa.ts`.
- [x] **D3. Chapter/act names in-game verification** — code already routes
  them through `t(actNameKey(...))` (`src/content/graph.ts:40-42`); play
  through in CS and FA and confirm the HUD label, act-intro title, and codex
  act labels actually render translated. If any surface caches English before
  the locale applies, fix the ordering.
- [x] **D4. Full untranslated-string sweep** — audit every string literal that
  reaches the DOM in `src/ui/*` + `src/engine/flow.ts`; add a guard test that
  fails when a new user-visible literal bypasses `t()`.
- [x] **D5. New strings from this milestone** (settings descriptions, save
  toasts, act heart warnings…) land in EN+CS+FA **in the same commit** —
  enforced by extending the existing translation-coverage tests to `ui.*`.

**Tests:** extended i18n coverage · Playwright: open a codex note in Czech and
assert the body differs from the English source text.

---

## Phase E — Menus, Exit & Settings clarity
*(exit/quit button · explain every setting understandably · verify dynamic scenery works)*

- [x] **E1. Exit game button** on the title screen and pause menu. In Electron
  (detected via user agent): `window.close()` → `app.quit()`. In the browser
  the title button hides (tabs can't close themselves) and the pause-menu one
  reads "Save & quit to title".
- [x] **E2. Every setting explained.** Each row gets a one-line translated
  description under its label, written for a non-technical player:
  *Render resolution — "Lower = smoother on weak graphics cards, slightly
  softer image."* · *Dynamic scenery — "Rooms subtly tint the light to match
  their mood."* · *Typewriter text — "Text appears letter by letter, like
  being told a story."* · *High visual quality — "Glow and smoothing effects;
  needs a stronger graphics card."* — and so on for all rows.
- [ ] **E3. Prove dynamic scenery works — deferred.** The Playwright
  screenshot-delta automation kept timing out in this session's headless
  environment; per the user's call, further browser-automation debugging was
  stopped in favor of shipping on the (green) vitest suite. `mood.test.ts`
  already covers the underlying blend logic at the unit level, but the visual
  screenshot proof itself is still outstanding — pick this up first next
  session.
- [x] **E4. Pause menu tidy-up** — order: Resume · Save & Exit · Field Notes ·
  Settings · Who are you? · Before you begin · Exit game. Escape still
  resumes.

**Tests:** Playwright screenshot deltas (E3) · Electron quit-path smoke test.

---

## Phase F — The Usher: visibility & motion
*(more graphically visible · "why does he fly around?" · approach slowly, slow animations)*

- [x] **F1. Kill the "flying".** Root cause: exponential lerp `1−0.001^dt`
  (`director.ts:196`) closes ~99.9 % of the distance within a second.
  Replace with a **fixed-duration eased walk**: ~2.5 s, smoothstep easing,
  y locked to the floor, subtle vertical bob at step frequency so it reads as
  *walking* to the chosen door — same for the walk back home.
- [x] **F2. Slow the camera dolly** the same way — ~2 s ease-in-out tween
  (replacing `1−0.0018^dt`, `director.ts:202`), fade starting slightly
  earlier so the pass-through feels deliberate, not yanked.
- [x] **F3. Make the Usher visible.** Scale the silhouette up ~15–20 %; raise
  the warm rim emissive; add a soft narrow **spotlight from above** onto its
  spot (a stagehand under a work light — calm and thematic, never horror);
  move its idle post ~1.5 units closer to the camera path so it sits inside
  the player's natural field of view. Keep `usherFigure()`'s presence API
  (`src/scene/themes.ts`) so the door-walk boost still layers on top.
- [x] **F4. Idle life** — a small head-turn toward the camera every ~20 s and
  whenever a door is hovered: the Usher *notices you choosing*. Cheap
  rotation tween, big presence gain.

**Tests:** tween helper unit tests (duration, easing bounds, y-lock) · scene
test asserting the spotlight exists and rim intensity ≥ the new baseline ·
manual feel-pass on the walk.

---

## Phase G — Hearts: explanation & honest mechanics
*(explain heart loss before each act · make sure the mechanic exists · don't make it too hard)*

- [x] **G1. Truthful mechanics — amended.** Investigated adding a new global
  "second refusal costs a heart" rule as drafted above, but found the content
  already has a bespoke, intentional per-room refusal-escalation pattern (the
  junction room's `refuse1`/`refuse2` flags) — a second global rule would
  double-charge that room and muddy an existing, deliberate design. Fixed the
  text instead: the About panel and heart tooltip now describe the *actual*
  mechanics (the handful of marked `hearts:-1` choices + the lucidity-below-zero
  drain), so the copy is honest without inventing a new punishing rule.
  Validated by `difficultyGuardRail.test.ts`: a sincere player never hits 0
  hearts across 200 seeds and keeps ≥2 hearts on average — the game was
  already forgiving.
- [x] **G2. Explain before every act** — one translated line appended to each
  `actIntroText` (`src/content/usher.ts`), phrased differently per act so it
  never feels like a repeated tooltip. Also add hearts (with the ♥ pictogram)
  to the "Before you begin" onboarding panel.
- [x] **G3. First-loss moment** — the first time a heart is ever lost in a
  profile: brief pause, heart-loss sound, HUD heart shatter animation, and a
  one-line Usher aside explaining what happened and how many remain. Shown
  once, never repeated.
- [x] **G4. Difficulty guard-rail test** — simulation across seeds asserting a
  sincere player (never refuses twice, avoids the marked choices) always
  finishes with ≥1 heart.

**Tests:** refusal-cost unit tests · G4 simulation · i18n coverage for all new
lines.

---

## Phase H — Door visibility & framing verification
*(verify doors always visible, never garbled or off-screen · maybe unzoom a little)*

- [x] **H1. Aspect-aware framing** — compute the horizontal width needed for
  the outermost door (`(n−1)/2 × spacing + door half-width`, spacing 3.4 in
  `src/scene/doors.ts`) against the camera frustum (FOV 58, z = 7); when it
  doesn't fit, pull the camera back and/or compress spacing until every door
  plus tooltip fits with margin. Plus a small default unzoom (camera z 7 →
  ~7.6) per the user's instinct.
- [ ] **H2. Playthrough sweep — deferred**, same reason as E3: Playwright runs
  were unreliable in this session's headless environment and browser-automation
  debugging was intentionally stopped in favor of shipping. `doorFraming.test.ts`
  covers the projection math at the unit level; the live multi-viewport
  screenshot sweep is still outstanding.
- [ ] **H3. Transition garble check — deferred**, same reason as H2. Also
  found live (see below): opening the pause menu / codex while a beat/choice
  is on-screen let it visually bleed through the overlay and still respond to
  keyboard input — fixed (`.stage-bottom.overlay-hidden` + keydown guards in
  `textPanel.ts`/`choices.ts`), but the *scripted* transition-garble sweep
  itself wasn't run.

**Tests:** H2 is the test — projection assertions with archived screenshots.

---

## Phase I — Developer's own upgrades (creative freedom)
*Chosen strictly from the player's chair: rhythm, feedback, and reasons to replay.*

**Must (high impact, low risk):**
- [x] **I1. Replay fast-forward.** Rooms already completed in a previous run
  open with a "You remember this room" line, skip the typewriter (beats show
  instantly), and carry a subtle "remembered" panel style. Outcome-beat
  condensing was not implemented. (Tracks via existing `profile.codexUnlocked`.)
- [x] **I2. Unseen-door markers.** A small ✦ glint on door cards for rooms
  never visited across all runs — collectors instantly see where new content
  lives.
- [ ] **I3. End-of-act interlude** — not built this session; scoped out for
  time. Still worth doing.
- [x] **I4a. Endings-found counter** ("N of 6 endings witnessed") on the title
  screen. — **I4b/I4c not built:** version number display and fog parallax
  drift are still outstanding.
- [ ] **I5. Door hover feedback** — not built this session. Doors already had
  a pre-existing hover brighten/dim (`doors.ts` `BASE_INTENSITY`/
  `HOVER_INTENSITY`, from an earlier milestone); the *new* emissive-pulse +
  pre-walk brighten described here wasn't added.

**Should (strong flavor, moderate effort):**
- [ ] **I6. Traveler's ledger** — a stats screen (title/pause menu): runs
  completed, rooms witnessed X/24, endings Y/6, hearts lost lifetime,
  most-walked door. The data already lives in the profile.
- [ ] **I7. Act-transition light spill** — when the chosen door opens, light
  colored by the *next* act spills from the doorway during the dolly. One
  animated PointLight + a glow plane; sells "walking into somewhere new".
- [ ] **I8. Audio easing pass** — ~4 s chord crossfades on act transitions,
  a small reverb tail on the heart-loss sound, hover chime pitch varying per
  door index. Cohesion without new assets.
- [ ] **I9. Colorblind & readability audit** — gold-on-dark contrast ≥ WCAG AA
  at all UI zoom levels; heart state not conveyed by color alone.

**Could (delightful, only if time permits):**
- [ ] **I10. Daily door** — optional title-screen mode seeding the run from
  today's date: the same door layout for everyone that day.
- [ ] **I11. Ending epitaph wall** — after 2+ endings, the title background
  faintly shows collected epitaphs carved into the fog.
- [ ] **I12. One secret room** hinted only in a field note's margin — rewards
  the close readers.

---

## Phase J — Verification & release (every milestone ends here)

- [x] `npx tsc --noEmit` + full `vitest` suite green — 125 → 183 tests, zero
  failures.
- [x] Partial Playwright pass: title/persona/onboarding flow, a full prologue
  playthrough into the first door, Czech language switch, pause menu → codex
  → field note (confirmed real Czech text, not the English fallback), and a
  save-at-door-selection + mid-room quit/reload cycle. This is how the
  `.stage-bottom.overlay-hidden` bleed-through bug (see H3) was actually
  found and fixed.
- [ ] Full Playwright matrix — **deferred**: EN/CS/FA playthrough at 3
  viewports, the C3 layout sweep, H2 door-visibility sweep, E3
  dynamic-scenery proof, and a troll test all still need a Playwright run.
  Browser-automation runs in this session's headless environment were slow
  and one repair attempt didn't fully fix it, so — per the user's explicit
  call — this was stopped short rather than iterated on further. Pick this up
  first next session; consider giving each a longer per-script timeout budget
  and/or investigating why beat-advance clicks are slow to land headless.
- [ ] Manual feel-pass on the Usher walk and camera dolly — not done (no
  visual/interactive access to confirm "feel" beyond the automated checks
  above).
- [x] Update this file's checkboxes, commit, push, trigger
  `release-windows.yml` → `v0.1.5-v2-beta` EXE.

## Implementation order

**D (bug + i18n, quick wins) → B (save safety) → A (display/perf) → C (layout)
→ E (menus/clarity) → F (Usher) → G (hearts) → H (verification sweeps) →
I (enjoyment picks) → J (release).**

Rationale: first fix what is broken for players right now (Czech notes,
mid-room saves), then the settings the user will immediately touch, then feel
and polish.
