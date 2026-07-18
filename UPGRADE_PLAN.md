# ANAMNESIS — Upgrade Plan & Development Roadmap

> **This is the living tracking file for all further development of ANAMNESIS.**
> Each work item has a checkbox. As features land, boxes get checked and remarks
> are added inline. New milestones append new phases at the bottom. Shipped
> milestones are condensed to short summaries to keep the file readable — full
> detail lives in git history — but **open items are never deleted**.

**Current milestone: 5 — THE DEEPER FACILITY (in progress, see bottom of
file — S1, K, L, N, M, O, the hardening batch (S6/S7/R8/R9), and P all
shipped; next up: Q, R, S2–S5).** A full production review (2026-07-06)
lives at `docs/development/11-production-review.md` — read it before
starting any new phase; its action items are tracked as R8–R11 and S6–S7
below.
Milestone 4 is mostly shipped — Phases A–I implemented (see checkboxes below
for the handful of items amended or deferred); its remaining Playwright
verification debt is folded into Milestone 5's Phase S2. Previous milestones
(1–3, all shipped): core game + 20 rooms + 6 endings · generative audio,
icons, Electron/EXE releases · full CS/FA translations, v1/v2 text voices,
dynamic scenery, field-note markup.
Latest release: [`v0.1.5-v2-beta`](../../releases/tag/v0.1.5-v2-beta).

---

## Phase A — Display, Performance & Fullscreen — **shipped (v0.1.5-v2-beta)**

60 FPS frame limiter + render pause under overlays/`document.hidden`; render
resolution setting; UI zoom (80–130 %); fullscreen toggle + `F` hotkey; GPU
diet audit. Key files: `src/scene/director.ts`, `src/ui/fullscreen.ts`,
`src/ui/zoom.ts`, `src/engine/saveStore.ts`. (Electron window-state memory
moved to Milestone 5, spec 08.)

**Amendment (Milestone 5):** reported bug — "pressing Escape, or opening
Settings, resets/disables fullscreen." Root cause: Escape is the Fullscreen
API's own unblockable exit gesture — every browser exits fullscreen on
Escape regardless of what the page's JS does, by design (a site can never
trap a user in fullscreen). The game *also* binds Escape to open the pause
menu, so a single press did both at once — fullscreen collapsing while the
pause menu simultaneously snapped open — which reads as fullscreen being
"reset" for no reason (opening Settings afterward just correctly displays
the now-off state, which is why it looked settings-related). Fixed with a
pure, testable guard, `shouldOpenPauseOnEscape` (`src/ui/fullscreen.ts`):
the first Escape while fullscreen is left to just exit fullscreen; the pause
menu opens on a distinct, subsequent press. Covered by
`src/test/fullscreen.test.ts`. This does not, and cannot, prevent the
browser from exiting fullscreen on Escape — that part of the report is
expected platform behavior, not a bug, and is now documented as such.

---

## Phase B — Saving, Reset & Data Safety — **shipped (v0.1.5-v2-beta)**

Mid-room resume fixed via `RunState.currentStage` (persist after every stage
choice); Save & Exit button; "✓ saved" autosave toast; Reset run / Reset all
progress with two-step confirm in Settings → Data. Key files:
`src/engine/flow.ts`, `src/content/schema.ts`, `src/ui/toast.ts`.

**Amendment (Milestone 5):** a reported repro — switch language mid-run via
the in-HUD button, then "Save & exit to title", then Continue — was
investigated. Live Playwright repro of the exact steps did not reproduce a
lost run (the write is correct and reaches the store before `location.reload()`
in every attempt). Investigation did surface one real latent defect: `Game`'s
`persist()` calls were independent `await`-or-not writes to the same profile
key, so a slower-than-`localStorage` `SaveStore` backend (the interface is
explicitly written to allow one — see `saveStore.ts`'s doc comment) could let
an unawaited write (the HUD language switch's) land *after* a later, awaited
one (the pause menu's "Save & exit"), silently reverting the newer state.
Fixed by chaining every persist onto a single `Game.persistChain` promise
(`flow.ts`), so writes always reach the store in call order regardless of
backend latency or whether the caller awaits. Covered by
`src/test/saveRoundTrip.test.ts`: full round-trips through the real
`LocalSaveStore` (backed by an in-memory `Storage` polyfill, since tests run
in a DOM-less `node` environment) from a representative run in every act, the
understory, a secret room, and the final gate; the exact reported
language-switch-then-save sequence; the title screen's continue/no-continue
gating; and a deliberately constructed race proving the old (unchained)
pattern *does* reorder writes while the new pattern doesn't.

**Second amendment (same audit, Milestone 5):** a follow-up pass, driven by
a request to make the save system provably correct "from all parts of the
game," turned up one more real defect — this time a phantom run rather than
a lost one. `Game.persist()` unconditionally derived `profile.run` from
`this.state`, but `this.state` defaults to a placeholder `newRun()` at
construction time, long before a run actually begins. Any `persist()` call
made during the title-screen flow — a persona edit, a Settings change, the
new auto-shown "Before you begin" (below) — stamped that placeholder onto
`profile.run`, so a player who merely opened Settings or picked a persona
and then closed the tab would come back to a wrongly-offered "Continue the
journey" button (resuming a run identical to a fresh one — no data was
actually lost, but the button lied about there being progress). Fixed by
gating that assignment on `this.inGame`, which is only ever true once a real
run has started. Also added, per an explicit, non-negotiable requirement:
the "Before you begin" explainer (why-play/hearts/doors) now shows itself
automatically, once, on a player's very first playthrough ever
(`Profile.hasSeenAbout`, before persona, before the Examined Path offer) —
no one begins not knowing what the game is or why. A legacy save showing any
sign of prior play (a run, a completed run, an unlocked note, a chosen
persona) is grandfathered in as already having seen it
(`shouldGrandfatherHasSeenAbout`), so returning players are never ambushed
by it. Both fixes covered by new tests in `src/test/saveScenarios.test.ts`
(23 tests: continuing/discontinuing from every act/region including the
understory and a secret room, interleaved language/settings-change
sequences, Reset run/Reset all progress, "Walk again"'s profile-history
carry-over, and the phantom-run regression itself) and
`src/test/settings.test.ts` (the grandfathering predicate). Live-verified in
a real browser: a truly fresh profile now shows "Before you begin"
automatically on first Begin, `profile.run` correctly stays `null` until a
real choice is made, and a second "Begin again" does not re-show the
explainer.

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

## Phase D — i18n completion + the Czech codex bug — **shipped (v0.1.5-v2-beta)**

The reported Czech codex bug fixed (`translateFieldNoteForCodex` in
`src/ui/overlays.ts`); last hardcoded strings ("Continue", "click · space",
aria-labels) translated; the self-updating `uiKeyCoverage.test.ts` guard now
fails CI whenever a used `ui.*` key lacks a cs/fa entry — it caught four
pre-existing gaps on its first run.

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

## Phase F — The Usher: visibility & motion — **shipped (v0.1.5-v2-beta)**

The "flying" fixed: exponential lerps replaced with fixed-duration eased
walks (~2.5 s) + a slowed ~2 s camera dolly; silhouette scaled up with a
stagehand spotlight and idle head-turns. Key files: `src/scene/director.ts`,
`src/scene/themes.ts`.

---

## Phase G — Hearts: explanation & honest mechanics — **shipped (v0.1.5-v2-beta)**

Per-act heart cautions in every act intro; first-heart-loss one-time
explanation; About/tooltip copy corrected to the *actual* mechanics.
**Amendment kept for the record:** the drafted global "second refusal costs a
heart" rule was intentionally NOT built — the junction room already has a
bespoke refusal-escalation design a global rule would double-charge; text was
fixed instead, validated by `difficultyGuardRail.test.ts` (a sincere player
never reaches 0 hearts across 200 seeds).

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

**Superseded by Milestone 5** (each item now lives, expanded, in a Milestone 5
phase — tracked there, not here): I5 door-hover feedback → **Q4** · I6
traveler's ledger → **Phase P** · I7 light spill → **Q2** · I8 audio easing →
**Q5** · I11 epitaph wall → **Q3** · I12 secret room → **K4 (the-cave)**.
I10 "Daily door" was dropped entirely — the owner rejected separate replay
modes in the Milestone 5 review.

**Still open, unscheduled (not part of Milestone 5 — keep in mind for M6):**
- [ ] **I3. End-of-act interlude** — one quiet screen between acts: act name,
  a one-line Usher observation on the run's dominant axis, hearts/lucidity.
- [ ] **I9. Colorblind & readability audit** — gold-on-dark contrast ≥ WCAG AA
  at all UI zoom levels; heart state not conveyed by color alone.

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

---
---

# Milestone 5 — THE DEEPER FACILITY (target: v0.2.0-beta)

> Planned 2026-07-05, shaped by 12 preference questions answered by the user.
> Phases continue Milestone 4's lettering (A–J used there): **K–S**.
> **The authoritative, exhaustive developer specifications live in
> [`docs/development/`](docs/development/README.md)** — one document per
> phase, plus the binding Experience Charter (`10-experience-charter.md`).
> Implement from the specs; track progress with the checkboxes here.

**The user's decisions that shaped this milestone:**
content = new rooms AND a new act · the Usher stays enigmatic (no backstory,
no new characters) · a deeply hidden 7th ending, independent of the Usher ·
persona hints expanded only "a little" · keepsakes as a gentle bonus layer
that never alters core mechanics · no separate replay modes (everything
integrates organically) · an opt-in reflective mode that presents morality
*objectively* (plural views, never one "correct" answer) · Ledger + quiet
Epiphanies · GitHub Pages web release · no mobile investment · perfect
EN/CS/FA (Czech quality pass) with German+French at lowest priority · full
visual overhaul (dioramas + light-spill + title polish).

**Codebase facts this plan builds on (verified 2026-07-05):**
21 rooms; act pools 5/5/4 + fixed 3-room Act IV; a run = 15 rooms. The
`{name}` token plumbing exists but no content string uses it; the persona
blurb is collected and never used. Five flags are set but never read
(`pushed`, `kept-bridge`, `entered-machine`, `sharp-gambler`,
`erased-memory`) — ready-made hooks. Audio is generative WebAudio with no
reverb bus yet. Electron has no icon/fullscreenable/window-state memory.
Continuity nit: the Punchline ending says "twenty rooms"; a run is 15.

---

## Mid-milestone review — 2026-07-06 (review pass only; no code changed)

**Verified state at commit `3020fb0`.** Shipped in order, each with tests and
a live `?uat=1` browser check: S1 (uat mode) → K1–K4 (9 new rooms, doorSeed
fix, prior-run mirror) → L (Act V understory) → N (keepsakes) → M (seventh
ending), plus an out-of-band save-ordering fix (`persistChain`). Suite: 312
tests green, `tsc` clean, working tree clean. Note the actual phase order
deviated from the "Implementation order" section below (K → **L** → N → M,
not K → N → M → L); every real dependency (M after N per spec 03 §10) was
respected, so this is recorded for accuracy, not as a defect.

The "codebase facts" block above is a **pre-K snapshot** — do not build on
it. As of this review: 30 base rooms + 3 understory rooms; act pools 7/8/8;
and **all five formerly-dead flags now have readers** (L gave `pushed`/
`kept-bridge` to the-echo; N gave `sharp-gambler`/`entered-machine` — and
`saved-photo` — earn-triggers; M gave `erased-memory` its blocking role).

**Findings for the next coding session** (noted deliberately, not fixed —
items 1, 5, 6 are small and should open the next session; 2–4 and 7 fold
into their named phases; 8 is watch-and-wait):

1. **[M, i18n gap] — FIXED (2026-07-06).** Appended the three margin hints
   to `v1-en.ts`'s `waiting-room`/`editor`/`casino-pascal` note bodies
   (verbatim English, matching v2/cs/fa) and to the FA `casino-pascal` hint's
   formality (`نپرس` → `نپرسید`, item 5 below, same commit). `v1-en.ts`'s
   header previously said "regenerate with `scripts/extract-v1.ts`" — that
   script no longer exists anywhere in the repo (one-time migration, already
   run), so hand-editing was the only option; header comment updated to say
   so and to scope future hand-edits to mechanically load-bearing content
   only. `keepsakes.test.ts` gained a guard test for item 6 (a
   choice id uniqueness assertion across all keepsake-gated choices).
   313 tests green, `tsc` clean.
2. **[M, spec deviation] Spec 03 wants the margin hints *italic*; they
   shipped as plain sentences** — `renderEmphasis` (`ui/fieldNote.ts`)
   supports only `**bold**`; no note body anywhere uses italics. Either add
   `*em*` support (natural home: Phase Q polish) and italicize the three
   hints, or amend spec 03 §5 to drop the italic requirement. Until one of
   those happens, spec and game disagree.
3. **[M, display-rule edge] The About/onboarding copy says "six endings"
   forever** (`uiKey('aboutWhy')` in EN, CS, FA). Correct while the ending
   is a secret; after `anamnesis` is witnessed the title screen says 7 but
   About still says six. Decide in Phase R: make the sentence dynamic via
   `endingsTotal`, or accept as flavor. Same bucket as the "twenty rooms"
   Punchline nit already listed for R.
4. **[M, hardening] `endingsTotal` hardcodes 6/7.** Fine today; an eighth
   ending would silently miscount. When next touched, derive from
   `endings.length` minus unwitnessed hidden endings — a `hidden: true`
   field on `Ending` would let the codex filter (`overlays.ts` currently
   hardcodes `ending.id === 'anamnesis'`) and the count share one source of
   truth.
5. **[M/FA, tone nit] — FIXED, see item 1.** `از کسی نپرس` → `از کسی نپرسید`.
6. **[N, convention risk] — GUARDED, see item 1.** Added
   `keepsakes.test.ts`'s "every keepsake-gated choice id is globally unique"
   test — it does not change behavior, only ensures a future keepsake reusing
   another room's choice id fails CI immediately instead of silently
   undercounting `keepsakeChoicesTaken`. Recording `roomId/choiceId` instead
   would be a save-format change — still not worth it while the guard holds.
7. **[S1/UAT, quirk] `jump()` into an Act-IV room does not backfill earlier
   `ACT4_SEQUENCE` rooms into `visited`** — completing the jumped room then
   re-offers `boulder`. Unreachable by real players; it only bites UAT
   scripts (the Phase M verification script had to seed
   `visited: ['boulder','last-message']` by hand). Fix options: one line in
   spec 09 §4 documenting the seeding requirement, and/or make `jump()`
   backfill the preceding fixed-sequence rooms itself (small and safe — it
   mirrors state a real player must have). Do one of these before Phase S2
   writes more UAT scripts against Act IV.
8. **[B, unresolved report — UPDATED] The user-reported "Continue started a
   new run after mid-run language switch + save" never reproduced** under
   live Playwright (mid-room and between-rooms saves, EN→CS via the HUD
   button, exact reported step order). The write-ordering race that *was*
   found is fixed and regression-tested (`saveRoundTrip.test.ts`). A
   follow-up audit (asked to cover "all possible situations") did find a
   *related but distinct* real bug in the same area — a phantom run being
   manufactured during the title-screen flow, the mirror image of the
   reported symptom — now fixed (`persist()`'s `inGame` guard; see Phase B's
   second amendment). The originally reported direction (a real run
   disappearing) still hasn't reproduced. If it recurs: before clicking
   Continue, capture `localStorage['anamnesis:profile:traveler']` —
   `run: null` means a write was lost (store side); an intact `run` means a
   `start()` resolution bug (flow side). That one datum halves the search
   space. One benign look-alike to rule out with the user: Settings → Data
   → "Reset run" produces exactly the reported symptom by design.
9. **[M, bookkeeping] `evaluateEnding` checks `remember-everything` after
   `lie-down`,** not above all final-door checks as spec 03 words it. Both
   are same-stage choices of one room — mutually exclusive in any
   transcript — so the order is provably immaterial. Recorded so nobody
   later "fixes" it into a semantic change. Spec 03's internal acceptance
   checkboxes were intentionally left unticked; this file is the single
   tracking surface.

---

## Phase K — New rooms (spec `01-new-rooms.md`)

- [x] K1. Act I +2: `buridans-queue`, `the-reference` — full content, EN+CS+FA,
      icons, pool-wired. **Uncovered and fixed a real engine bug along the
      way**: `doorsForAct`'s door-offer hash was salted only by `visited`
      history, which is identical for every fresh run's first offer in an
      act — growing a pool could leave a member (here, `dinner-table`)
      structurally unreachable for every player, not just unlucky test
      seeds. Fixed by adding `RunState.doorSeed` (a per-run random salt,
      migration-safe) folded into the hash; added a generic reachability
      regression test (`newRooms.test.ts`) covering all three acts' pools so
      this class of bug is caught immediately as K2/K3 grow them further.
- [x] K2. Act II +3: `chinese-room` (Searle/Turing), `newcomb-annex`
      (Newcomb/Nozick — the predictor is explicitly "the facility," never the
      Usher), `veil-of-ignorance` (Rawls/Harsanyi) — full content, EN+CS+FA,
      icons, pool-wired. Same false-positive translation-coverage pattern as
      K1 recurred (three thinkers fields were pure Western proper nouns with
      no translatable component, so the correct CS/FA rendering was
      byte-identical to English); fixed the same way, by enriching the EN
      source with a translatable descriptor phrase to match the game-wide
      convention, then translating it.
- [x] K3. Act III +3: `marys-room` (Frank Jackson's knowledge argument —
      Thomas Nagel descriptor added for the same translation-coverage
      reason as K2), `butterfly-dream` (Zhuangzi; carries a `memoryLost`-
      branching dynamic beat, following the `ship`/`door-that-asks`
      pattern, with its own `dynamicBeats.test.ts` coverage), `swampman`
      (Davidson/Parfit) — full content, EN+CS+FA, icons, pool-wired.
- [x] K4. Secret room `the-cave` (Plato) — shipped along with the shared
      cross-cutting infrastructure it needs (spec 01 §4 / spec 02 §4):
      `RunState.prior?: { runs, endingId, transcript }`, stamped once by
      `newRun(doorSeed?, prior?)`; `Profile.lastRunTranscript`/
      `lastRunEndingId`, written in `Game.playEnding` right before
      `runsCompleted` increments and the profile persists; a `priorFromProfile()`
      helper wired into all three `newRun()` call sites in `flow.ts`
      (fresh-run start, jump, play-again). `the-cave.secret = (s) =>
      (s.prior?.runs ?? 0) >= 1` — returning travelers only, never a
      player's first run. Its shadow-play uses a new `pickShadowMoments`
      helper (`gameState.ts`) selecting first/middle/last from the previous
      run's transcript, degrading to 3 generic vignettes when empty
      (legacy save). **Scope note:** the shadow beats quote the exact
      (re-translated) choice text per room, but do not additionally name
      the room by title — attaching a real room title would have required
      either a hand-maintained id→title lookup table or an import from
      `content/rooms/index.ts` back into `content/rooms/act3.ts`, which is
      circular (index.ts already imports act3.ts). Quoting the choice text
      alone satisfies spec 01's acceptance criterion ("quote real
      previous-run data when available") without that risk.
- [x] K5. Rooms shipped so far are complete (beats/choices/notes/icons/moods)
      in EN+CS+FA, same commit — coverage tests auto-extended and pass.
- [x] K6. Pool wiring + graph-test invariants updated for rooms shipped so far
      (29 numbered rooms + prologue after Act I+II+III growth, including
      `the-cave`); the reachability regression test from K1 already covered
      each act's grown open pool with no changes needed (secret rooms are
      correctly excluded from that check).

## Phase L — Act V: The Understory (spec `02-act-five-the-understory.md`) — shipped

- [x] L1. `the-archive` (Paul Ricœur) — a records room; its reading table
      stages an exhibit card selected by `pickExhibitEntry` (first heart-cost
      choice; else largest lucidity swing; else the final entry), and one
      beat gives the persona blurb its first "just a little" use (new
      `{blurb}` token in `flow.ts`'s `tokens()`, always non-empty).
- [x] L2. `the-unchosen` (Kierkegaard/Frost) — a corridor of doors from the
      previous run's Act I-III pools that were never entered
      (`pickUnchosenRooms`: pool-minus-entered, hash-picks 3 candidates + the
      one that "swings open"; an honestly-documented approximation, since the
      engine never records which doors were *offered*, only entered).
      Entering the opened door plays a condensed vignette, not the real room.
- [x] L3. `the-echo` (Hume/Strawson) — a voice assembled from 2-3 of the
      previous run's own choices (reuses `pickShadowMoments` from K4), names
      the previous ending once flatly, and gives junction's `pushed`/
      `kept-bridge` flags their first real readers (`choseInPrior`).
- [x] L4. Staircase fork wired into `offeredDoors`'s act-4 branch
      (`storyEngine.ts`): offered exactly once, only at the `boulder`
      threshold, only for `RunState.prior.runs >= 1`; choosing `boulder`
      there forfeits the descent for the rest of the run; descending walks
      the-archive → the-unchosen → the-echo before rejoining `ACT4_SEQUENCE`
      with zero extra state-machine logic (non-gate act-4 rooms already flow
      through `completeRoom` with no side effects). New `RunState.descended`
      marker, set in `flow.ts` the instant the staircase door is chosen. The
      fork door reuses the secret-door violet styling channel without making
      the room `secret` in content (per spec, to keep it out of act-pool
      logic). New Usher bark `understory-hint`, shown only at the fork.
      Codex: the three rooms are filtered from the grid entirely until first
      walked (`isHiddenFromCodex`) — a different kind of surprise from the
      game's other secret rooms, which keep a teasing locked card.
      **Scope note:** the-unchosen's condensed vignette references the
      target room by its real (re-translated) title, not just its quoted
      choice text — a deliberate improvement over the spec's minimum, made
      possible by exporting `ROOM_TITLE_BY_ID`/`ENDING_TITLE_BY_ID` lookups
      from the new `content/rooms/understory.ts` for reuse by the CS/FA
      dynamic-beat overrides.
      Tests: `understory.test.ts` (offering/skipping/sequencing/quit-resume/
      content-completeness), plus dedicated `pickExhibitEntry`/
      `pickUnchosenRooms`/`choseInPrior` unit tests (`state.test.ts`) and
      dynamic-beat i18n coverage in both languages, including empty-prior
      fallbacks (`dynamicBeats.test.ts`). Full EN+CS+FA content, icons
      (staircase, ajar-door corridor, two chairs). Live-verified via
      `?uat=1` + `jump()` in a real browser: all three rooms render
      correctly, including a live `the-unchosen` run that dynamically named
      a real unvisited room. `tsc`/full suite green (264 tests).

## Phase M — The Seventh Ending: "Anamnesis" (spec `03-the-seventh-ending.md`)

- [x] M1. Unlock predicate: `computeAnamnesisEligible` (new, `engine/endings.ts`)
      — pure, exported, independently testable — requires codex-complete over
      every room except the optional understory trio (secrets included: all of
      it means all of it) **and** `profile.keepsakeChoicesTaken.length >= 2`.
      Recomputed by `flow.ts`'s `enterRoom` fresh each time `door-that-asks` is
      reached (not just at run start), stamped onto the new
      `RunState.anamnesisEligible` field. Per-run gate `anamnesisAvailable(s)`
      adds `lucidity >= ANAMNESIS_LUCIDITY` (140, named constant beside
      `PUNCHLINE_LUCIDITY`) and `!hasFlag(s, 'erased-memory')` — the editor
      room's erase choice finally gets a reader. The new fifth option,
      `remember-everything` (`"I remember all of it."`), is appended last to
      `door-that-asks`'s final stage with no special styling, gated by
      `available: (s) => anamnesisAvailable(s)`.
- [x] M2. Exactly three field-note margin hints appended as a final sentence
      to existing note bodies — `waiting-room` ("the ones who remember all of
      it do not use the door at all"), `editor` ("what is erased is not merely
      gone — it is owed"), `casino-pascal` ("the house pays out, once, for a
      completed collection"). `endingsTotal(endingsSeen)` (new,
      `engine/endings.ts`) returns 6 until `'anamnesis'` is in `endingsSeen`,
      then 7; wired into the title screen's "endings witnessed" count and the
      Codex, which now skips the anamnesis card entirely (not shown locked)
      until it has actually been witnessed.
- [x] M3. Full ending content: title "Anamnesis", 7 beats (doors opening at
      once, the Usher's single line — "Ah.", the last beat mirroring the
      prologue's first, `{name}` used once), field note "Total Recollection"
      (Plato · Henri Bergson). `evaluateEnding` (`endings.ts`) checks
      `choseIn(s, 'door-that-asks', 'remember-everything')` above the other
      final-door checks, below only `hearts <= 0` (dissolution still trumps
      everything). `EndingId`/`endings` array both extended; `getEnding`,
      `endingIcons`, and `playEnding` needed no changes at all — the ending
      pipeline was already fully data-driven.
- [x] M4. `erased-memory` (Act III's editor room) and `keepsakeChoicesTaken`
      (spec 04) are both now load-bearing, exactly as specced.
      Tests: `anamnesis.test.ts` (18 tests) — the eligibility gate's five
      positive/negative conditions, the per-run gate's four conditions, the
      fifth option's wiring and zero-hearts-effect, evaluation priority
      (including hearts-trumps-anamnesis and extreme-axes-do-not-override),
      the display rule, and en/cs/fa margin-hint coverage. `endings.test.ts`
      updated for a 7th ending. Full EN+CS+FA content in the same commit.
      Live-verified via `?uat=1` + a seeded profile (full codex, 2 keepsake
      choices, backfilled Act IV `visited` since `jump()` skips straight to
      the final gate): the hidden choice renders correctly, unstyled, last in
      the list; choosing it plays the full "Anamnesis" ending end-to-end.
      `tsc`/full suite green (297 tests before Phase M's own save/resume
      side-quest below added more).

## Phase N — Keepsakes (spec `04-keepsakes.md`)

- [x] N1. Four keepsakes (`casino-chip`, `photo-corner`, `ship-splinter`,
      `release-form`) auto-earned via `keepsakesEarnedByFlags` (new
      `content/keepsakes.ts`), diffed once per choice in `flow.ts`'s
      `enterRoom` against flags newly added that turn. Three reuse existing
      dead flags (`sharp-gambler`, `saved-photo`, `entered-machine`); the
      fourth adds `ship-splinter` to act2's ship-room `pattern` choice
      (chosen because its text already asserts "that's the original
      timber" — only its `flags` array changed, `lucidity`/`axes` untouched).
      New `Profile.keepsakes: string[]`, earned exactly once ever (dedup on
      push), never retroactive: mirrored into `RunState.keepsakesHeld` only
      at `newRun()` time (same K4 `prior`-mirror pattern), so a keepsake
      earned mid-run cannot be spent until the *next* run.
- [x] N2. Each keepsake unlocks exactly one `keepsakeId`-tagged, ✧-marked
      bonus choice, gated by the existing `available(s)` mechanism (no new
      engine capability): `bet-against` (newcomb-annex), `pin-the-corner`
      (the-archive), `show-the-splinter` (swampman), `compare-dreams`
      (butterfly-dream). None costs a heart; each records into the new
      `Profile.keepsakeChoicesTaken` when taken (feeds Phase M's ending
      predicate).
- [x] N3. Codex "Shelf" strip: a whisper-quiet horizontal strip appended
      below the room grid in `showCodex` — earned keepsakes show a
      schematic SVG icon + translated name (origin as tooltip); unearned
      ones render as a dim `·` placeholder, no popups or attention drawn to
      the doors, per the owner's brief. ✧ marker + tooltip added to
      `ui/choices.ts`'s `pick()`.
- [x] N4. Full EN+CS+FA content (choice text/hint/outcomes, keepsake
      name/origin), persistence via the existing profile-save path (no new
      persist call needed). Hard no-op guarantee proved by
      `keepsakes.test.ts` (15 tests): `keepsakesHeld: []` is bit-identical
      to `undefined` across every room/stage; holding all four adds
      *exactly* the four specified choices and removes/alters nothing else;
      no sibling choice in the four unlock rooms is itself keepsake-gated;
      no keepsake choice has a `hearts` effect; every keepsake has an icon,
      cs/fa translation, a real earn-trigger, and unlocks somewhere.
      Live-verified via `?uat=1` + `jump()`: the ✧-marked `bet-against`
      choice renders correctly in newcomb-annex with a seeded
      `casino-chip`, and the Shelf strip shows the correct mixed
      earned/unearned state. `tsc`/full suite green (279 tests).

## Phase O — The Examined Path (spec `05-the-examined-path.md`)

- [x] O1. Opt-in panel (`showExaminedPathOffer`, `ui/overlays.ts`) shown on
      every genuinely fresh run — `start()`'s `'new'` path and the end
      screen's "Walk again" (`'again'`) alike, since both construct a brand
      new `RunState`; never on `'continue'`. Two equal-weight buttons, order
      following the stored default only (never marked "recommended"). New
      `Settings.examinedPathDefault` (Text & Language section) edits only
      the next offer's pre-selection; the current run's own
      `RunState.examined` (stamped once, immutable) is a separate field.
- [x] O2. Reflection cards (`ui/reflection.ts`, `ReflectionPanel`) — a
      visually quieter sibling of `TextPanel` (dimmer border, no drop
      shadow), reusing its click/Space/Enter-dismiss + overlay-guard pattern.
      Renders after a choice's outcome beats finish, one row per tradition,
      shuffled fresh via Fisher-Yates on every display (`shuffledReflections`,
      `engine/reflections.ts`) — never a fixed/rankable order. New
      `Choice.reflections?: Reflection[]` (schema.ts), pure gate
      `shouldShowReflections(state, choice)` extracted for a DOM-free no-op
      proof.
- [x] O3. One Socratic aside per act (`shouldShowSocraticAside`, gate
      `act 1-4 && examined`), piggybacked onto `syncTheme`'s existing
      once-per-act-transition intro beat. Bark ids `examined-act1..4`,
      EN+CS+FA.
- [x] O4 (done). The no-op guarantee is proven — `shouldShowReflections`/
      `shouldShowSocraticAside` are both `false` whenever `examined` is
      falsy (the default for every player who never opts in), verified
      against every room/choice in `allRooms` by `examinedPath.test.ts`
      (schema validation, shuffle set-equality, translation coverage, the
      no-op guard). **Content authoring is complete for every mandatory
      DILEMMA/INSIGHT room across the whole game.** Act I — `wallet`,
      `promotion`, `beggars-math`, `quiet-alarm`, `the-reference`
      (`cs/fa-reflections-act1.ts`). Act II — `junction`,
      `experience-machine`, `ship`, `casino-pascal`, `chinese-room`,
      `newcomb-annex`, `veil-of-ignorance`, `court-of-usher`
      (`cs/fa-reflections-act2.ts`); `omelas` (DOOMED) skipped. Act III —
      `teleporter`, `editor`, `debt-of-dead`, `marys-room`, `swampman`
      (`cs/fa-reflections-act3.ts`); `introduction`, `butterfly-dream`,
      `the-cave`, `free-will` (all NO-SOLUTION) skipped. Act IV —
      `last-message` and both stages of the gate room `door-that-asks`
      (`cs/fa-reflections-act4.ts`); `boulder` (NO-SOLUTION) skipped. The
      Understory — `the-unchosen` and `the-echo` (also in
      `cs/fa-reflections-act4.ts`); `the-archive` (NO-SOLUTION) skipped.
      Every authored choice has the full 4-tradition set, EN+CS+FA, with
      CS/FA translated in-context per the CLAUDE.md rule rather than
      literally. Live-verified via `?uat=1` for Act I (opt-in panel, a
      reflection card on `wallet`'s `return-all` choice, shuffled row
      order all render correctly in a real browser); Acts II–IV and the
      Understory verified via `tsc`/full vitest suite (371 tests green)
      since the pattern is proven and unchanged. **This satisfies the
      v0.2.0 release gate the production review (`11-production-review.md`)
      declared for Phase O.**

## Phase P — Traveler's Ledger & Epiphanies (spec `06-ledger-and-epiphanies.md`)

- [x] P1. Ledger screen reachable from both title (after Field Notes) and
      pause (after Field Notes, small variant) — `showLedger` (`ui/overlays.ts`),
      backed by pure `ledgerStats(profile, registry)` (`engine/ledger.ts`):
      runs completed, rooms witnessed (`visibleRoomCount` — same
      codex-visible denominator as the Field Notes grid, sharing
      `isHiddenFromCodex` which moved from `overlays.ts` to `engine/ledger.ts`
      so both the codex and the Ledger use one rule), endings witnessed,
      hearts lost lifetime, the most-walked door (translated title, ties →
      first-inserted), keepsakes on the shelf, descents/examined-runs rows
      (hidden entirely below 1 — never advertise the understory), last
      message (quoted, once sent). New `Profile` fields (`heartsLost`,
      `roomVisits`, `understoryDescents`, `examinedRuns`, `epiphanies`, all
      spread-merge-safe additive defaults) written at their natural sites in
      `flow.ts`: `heartsLost` and `roomVisits` at the exact points that
      already fire `sound.heartLoss()` / complete a room (so a
      quit-and-resume never double-counts), `understoryDescents`/
      `examinedRuns` in `playEnding`. EN+CS+FA. Live-verified in a real
      browser with a seeded profile.
- [x] P2. Twelve quiet epiphanies — pure `evaluateEpiphanies(profile,
      finishedRun, registry)` (`engine/ledger.ts`), called once in
      `playEnding` after every other counter for the run has already been
      applied; newly-earned ids append to `profile.epiphanies` (never
      removed) and are passed to `EndScreenData.newEpiphanies`, rendered as
      one soft "filed tonight" block after the run recap — no sound, no
      extra animation. Unearned epiphanies are invisible everywhere (no
      locked slots, no counts). `refused-machine-twice`'s predicate is
      deliberately derived from existing data (≥2 Experience Machine visits,
      the `release-form` keepsake never held) rather than new tracking, per
      spec. EN+CS+FA (`cs/fa-epiphanies.ts`), `i18n.test.ts` extended with a
      coverage loop over `EPIPHANY_IDS`. Full test suite in `ledger.test.ts`
      (19 tests): every predicate positive+negative, idempotency, the
      codex-visible room-count denominator, and — the production review's
      explicit requirement — a keepsakes-style **hard-guarantee test**
      statically proving no room content file or gameplay-predicate module
      (`storyEngine`/`gameState`/`endings`) ever references a Ledger-only
      `Profile` field: the Ledger is read-only, never mechanical.

## Phase Q — Visual & audio overhaul (spec `07-visual-and-audio-overhaul.md`)

- [x] Q1. **Room dioramas.** New `scene/dioramas.ts`: `dioramaFor(roomId,
      quality): Diorama | null` — 20 bespoke motifs (all of spec 07 §Q1's
      table, including the Understory trio sharing a family look with a
      per-room accent light color), each a small generated-geometry vignette
      (silhouette-style flat-color/emissive `MeshStandardMaterial`, ≤2
      lights, quality-scaled segment counts) parented at `z ≈ -10`, behind
      `DOOR_Z` and the Usher's walk path. `marys-room`'s diorama exposes the
      spec's optional `setAccent(on)` hook — its one saturated cube lights
      only once the `open-drawer` choice has actually been taken, wired from
      `flow.ts` right after that choice's effects land. `SceneDirector`
      gained `setDiorama(roomId | null)` (called from `enterRoom`, after
      `setMood`) and `setDioramaAccent(on)`; cleared on `setTheme` (act
      change) and at the door-picker screen (`setDiorama(null)` beside
      `setMood(null)`), ticked in the render loop (skipped under
      `reducedMotion`). New `dioramas.test.ts`: every registered id is a real
      room id, unregistered/no-motif rooms return `null`, every diorama at
      both quality levels stays within the mesh/light budget, ticks and
      disposes (including double-dispose) without throwing, and only
      `marys-room` exposes `setAccent`. Live-verified in a real browser
      (`?uat=1`, screenshots read): the boulder room's slope+sphere and the
      junction room's converging rails are visibly present as backdrop
      vignettes behind the door row; zero console errors walking through six
      diorama rooms in sequence (exercises the swap/dispose path).
- [x] Q2. **Doorway light-spill during the walk-through.** `SceneDirector`
      gained a `spillLight` (`THREE.PointLight`) spawned in `walkThrough(id,
      spill)` and tweened in over half the camera-dolly duration
      (`spillTween`, eased); color comes from the pure, tested
      `spillColorFor(roomType, nextActTheme)` (`scene/themes.ts` — the next
      room's mood tint, or its act's fog color as fallback). Instant at full
      intensity under `reducedMotion`. Disposed (`clearSpillLight`) whenever
      doors hide or the theme changes.
- [x] Q3. **Title polish: version number, fog parallax, epitaph wall (2+
      endings).** Q3.1 reused the `__APP_VERSION__` Vite define already added
      in S1 — `.title-version`, bottom-right, dim mono. Q3.2: pure
      `parallaxOffset(pointer, max=0.15)` (`director.ts`) lerped into
      `theme.group.position` while `director.setParallax(true)` is active
      (title only); off under `reducedMotion`. Q3.3: `epitaphLines(endingsSeen)`
      (`engine/endings.ts`) builds a faint (`opacity 0.06`) `CanvasTexture`
      plane at z ≈ -14 once 2+ endings are witnessed, rebuilt on every title
      entry, disposed with the theme. **Bug found and fixed during
      live-verification:** the title screen has always called
      `director.setPaused(true)` to fully suspend the render loop (a
      pre-existing perf optimization, since the title previously had nothing
      animating behind it) — that suspend happens *before* the theme tick,
      parallax lerp, or render call, so Q3.2/Q3.3 were being built into the
      scene graph but never actually drawn. Fixed by exempting the loop's
      pause-skip when `parallaxEnabled` (title-only) is set (`director.ts`
      `loop()`), so the title keeps a live (if very subtle) frame while every
      other paused-overlay screen (settings/codex/pause menu) still fully
      freezes as before. Verified live: door/jamb silhouettes are now visibly
      present through the title overlay, and a pixel-diff between screenshots
      at opposite pointer extremes shows real (if small, by design) movement.
- [x] Q4. **Door hover emissive pulse + pre-walk brighten.** Pure
      `hoverPulseIntensity(t, base, reducedMotion)` (`scene/doors.ts`):
      hovered door breathes in `[base, base+0.15]`; idle doors keep their old
      per-door phase-offset pulse. `snapSelected(id)` snaps the chosen door to
      `base+0.35` (`SELECT_SNAP_BOOST`) the instant it's picked, ahead of the
      Q2 light-spill taking over. Static `base+0.15` under `reducedMotion`.
- [x] Q5. **Audio deepening.** `audio/soundEngine.ts` gained a shared
      convolution reverb bus, built once in `ensureCtx()`
      (`ConvolverNode` fed a stereo impulse from the pure, unit-tested
      `makeImpulseSamples(sampleRate, duration, decay, rng)` — 1.8s duration,
      2.2 decay power — routed `reverbSend(gain 1) → convolver → master`);
      `heartLoss()`/`ending()`/`noteOpen()` each tap a per-sound send amount
      (0.5/0.35/0.15) via a new `sendToReverb(source, amount)` helper, sfx
      stays dry otherwise. `crossfadeToChord` gained a `seconds` parameter;
      `setAct` now passes 4.0 for in-run act transitions (the internal
      progression-cycling timer keeps the original ~2.2s default). Hover
      pitch now arpeggiates per door: pure `hoverPitch(index?)` — pentatonic
      offsets `[0,2,4,7,9]` semitones above 880 Hz, cycling for indices past
      the table, falling back to the base 880 Hz with no index — and
      `hover(index?)` now takes it. All three hover sources agree on the
      index: the 3D raycast hover (`director.ts` → `flow.ts`'s
      `onDoorHover`) and the DOM door-card hover both resolve the door id
      against a new `Game.currentDoorSpecs`/`doorIndex(id)` pair kept in sync
      with whatever door row is currently shown. Three diorama-linked room
      accents via new `SoundEngine.setRoomAccent('junction'|'casino'|'ship'|
      null)`, wired beside `setDiorama` in `enterRoom` and cleared beside it
      at the door-picker screen: junction gets a persistent low 55 Hz sine
      drone (gain 0.006, faded in over 1.5s); casino biases the ambient mote
      scheduler's pitch up an octave for as long as it's active (no
      persistent node of its own); ship gets a filtered-noise creak burst
      every 9-13s (reuses `makeImpulseSamples` with a steep 3.5 decay for the
      burst's noise, bandpass-filtered). All accent audio routes through
      `musicGain`, so the music toggle governs it, per spec.
      `audio.test.ts` extended: `hoverPitch` table + cycling + determinism;
      `makeImpulseSamples` length, `[-1,1]` bounds, decay (front-half vs.
      back-half RMS), and rng determinism; sfx-disabled `hover(index)` safety
      (the AudioContext-constructing paths of `hover`/`setRoomAccent`
      themselves aren't unit-testable in this Node test environment, same
      constraint the pre-existing volume-slider tests already work around —
      exercised live instead, see below). Live-verified in a real browser
      (`?uat=1`): walked through junction/casino-pascal/ship/the-cave/
      marys-room/boulder in sequence with zero console errors, confirming
      the accent set/clear and diorama swap paths run cleanly back-to-back
      without throwing.
- [x] Q6. **The Usher's lantern** (leans toward the hovered/chosen door).
      `usherFigure()` (`scene/themes.ts`) gained a small lantern arm + glow
      sphere + `PointLight`, off by default; `setLanternTarget(x | null)`
      fades it in/out (lerped) and the arm leans via pure `lanternLeanAngle
      (targetX)`. Wired at every point a door becomes "the" door: raycast
      hover, `highlightDoor`, and `hideDoors` (clears it).
- [x] Q7. **"Explain this simply" panel — user-requested addition, 2026-07-07,
      not in the original spec 07 scope.** Every one of the game's 36 room
      stages (prologue + Act I–IV + the Understory) now carries a plain-
      language, ELI15 explanation of its situation and question — written
      for a reader with no philosophy background, with a concrete everyday
      example, in the game's own voice. A small "?" button
      (`.explain-btn`) renders beside the room title the instant a stage's
      own beats start playing (never during outcome beats, act-intro barks,
      or other incidental `playBeats` calls) and opens a slide-up panel
      (`ui/explanation.ts`'s `showExplanation`, visually a sibling of the
      field note — same card, header, and dismiss pattern, just without a
      "thinkers" line) with the room's title and its explanation. New
      `Stage.explanation?: string` field (`content/schema.ts`) and
      `roomExplanationKey(id, stage)` (`content/text/keys.ts`); English
      lives directly on each room's stage object, Czech and Farsi in new
      dedicated `cs-explanations.ts`/`fa-explanations.ts` packs (registered
      in `content/text/index.ts`). Content-completeness enforced by
      `roomExplanation.test.ts` (every stage has a substantial, non-stub
      explanation); translation coverage folded into
      `translationCoverage.test.ts`'s existing per-language loop — both
      auto-fail if a future room ships without one. `npx tsc --noEmit` and
      `npx vitest run` (419 tests) clean; live-verified in a real browser in
      English and Czech (button appears at the right moment, panel opens
      with correctly translated title/body, dismisses cleanly back to the
      room underneath).

  **Scope note (2026-07-07):** given Q1's size, this pass deliberately built
  the smaller, well-specified, fully-testable sub-phases (Q2–Q4, Q6–Q7) and
  left Q1 (dioramas) and Q5 (audio) open, tracked honestly above rather than
  claiming the phase complete. `npx tsc --noEmit` and `npx vitest run` are
  clean throughout; Q2/Q3/Q4/Q6/Q7 were each live-verified with `?uat=1`
  screenshots.

## Phase R — Platform, language & engine health (spec `08-platform-localization-engine-health.md`)

- [x] R1. **GitHub Pages deploy workflow + play-in-browser link + favicon/tab
      title.** New `.github/workflows/deploy-pages.yml` (`workflow_dispatch` +
      `release: published`, `actions/configure-pages` →
      `upload-pages-artifact` → `deploy-pages`, matching the spec's sketch
      exactly). `index.html` already had a proper `<title>` and
      `<meta name="description">`; added a `<link rel="icon">` — an inline
      SVG data-URI door glyph (gold stroke on a near-black rounded square,
      matching the game's palette) so no asset pipeline is needed. README
      gained a "Play in the browser" line with the Pages URL. `vite.config.ts`
      already has `base: './'`, so the build is Pages-compatible unchanged.
      Verified: `npm run build` succeeds and the favicon/title/meta all land
      correctly in `dist/index.html`; full `tsc`/`vitest` suite still green.
      **Owner action still required (cannot be done from this session):**
      repo Settings → Pages → Source: **GitHub Actions**, one-time, before the
      workflow's first run will actually publish anything. The Pages URL in
      the README (`https://danieldmas.github.io/RogueLikeGame/`) will 404
      until that setting is flipped and the workflow runs once.
- [x] R2. **Electron polish: icon, window-state memory, single-instance
      lock.** `build/icon.ico` generated (Pillow, multi-size 16–256px) from
      the same door-glyph motif as the R1 favicon on `#0a0a0d`; wired into
      `package.json`'s `build.win.icon` and the `BrowserWindow`'s own `icon`
      option. `electron/main.cjs` rewritten: window bounds + maximized state
      are saved to `userData/window-state.json` on `close` and restored on
      launch, but only if the saved position still intersects a currently
      connected display (`screen.getAllDisplays()`) — otherwise falls back
      to the built-in default, so a since-removed monitor can never strand
      the window off-screen. `app.requestSingleInstanceLock()` added: a
      second launch attempt quits itself and focuses/restores the existing
      window instead of opening a duplicate. Fullscreen: verified by code
      inspection rather than a live Electron run (no display in this
      session) — the in-game F key (`ui/fullscreen.ts`) uses the standard
      DOM Fullscreen API with no Electron-specific override, and
      `fullscreenable` is left unset (defaults true), so no explicit config
      was needed, per the spec's own "only add if broken" guidance. `node
      --check electron/main.cjs` confirms valid syntax; `tsc`/`vitest`
      (419 tests, unaffected since Electron's main process isn't part of
      the TS test suite) still clean.
- [x] R3. Czech **and Farsi** quality pass — idiomatic reframing, terminology
      settled. **Scope note added 2026-07-06:** `CLAUDE.md` now has a binding
      translation rule (context-first, reread against the English source and
      the specific room's situation before shipping a line — never a literal/
      mechanical rendering — and this applies to every string, not just
      narrative content: UI chrome, settings copy, everything). Everything
      translated before that rule existed (Milestones 1–5 through at least
      Phase N/O) was produced without this context pass and must be
      re-reviewed and corrected against it here — audit it as one dedicated
      pass over every registered cs/fa string, not opportunistically
      mid-feature, so nothing is missed.

      **2026-07-07 — "original rooms" slice done, audited against the rule:**
      close-read every string in `cs-rooms*.ts`/`fa-rooms*.ts` (prologue +
      Act I–IV + the Understory, ~1,035 EN-equivalent lines × 2 languages)
      against its English source and situation, room by room. Verdict: this
      content was already high-quality, idiomatic, context-aware prose in
      both languages (not the mechanical rendering the scope note above
      warned about) — one genuine issue surfaced in each language: the
      casino-pascal `refuse-bet` choice hint was raw academic jargon
      ("Doxastic honesty." / Czech "Doxastická poctivost." / Farsi "صداقت
      باورشناختی") shown live during play, not tucked in the optional field
      note. Fixed in all three languages to a plain, self-explanatory
      phrasing.

      **Accessibility additions (same pass, per user request):** added one
      new trailing Usher beat — "Plainly, if it helps: …" — to the six most
      conceptually abstract rooms (casino-pascal, chinese-room,
      newcomb-annex, veil-of-ignorance, court-of-usher, free-will), each a
      short, jargon-free restatement of the room's actual question for
      players without a philosophy background. Appended at the end of each
      room's existing `beats` array (new index, not inserted mid-array) so
      no existing translation key shifted; translated into CS+FA in the same
      commit. A door-hint/teaser audit across every room (grep for
      `doorHint`/`teaser`) found these already plain and evocative —
      no changes needed there.

      **Backup, per user instruction:** the pre-rework `cs-rooms*.ts`/
      `fa-rooms*.ts` were copied verbatim to
      `docs/development/translation-backups/pre-r3-rework-2026-07-07/`
      (`.bak` extension, outside the build) before any edits, so the
      original renderings remain diffable/revertible.

      Reflections and epiphanies were already written under the rule this
      milestone and don't need re-auditing. `npx tsc --noEmit` and `npx
      vitest run` (415 tests, incl. `i18n.test.ts` and
      `translationCoverage.test.ts`) clean; live-verified in a real browser
      (English and Czech) that the new beat and fixed hint render correctly
      in `casino-pascal`.

      **2026-07-07 — remaining slice done: UI strings, dynamic beats,
      endings.** Read `cs.ts`/`fa.ts` (UI chrome, act intros, Usher barks,
      room titles/hints/teasers, keepsakes), `cs-dynamic.ts`/`fa-dynamic.ts`
      (state-reactive beat overrides), and `cs-endings.ts`/`fa-endings.ts`
      (all 7 endings' beats and field notes) in full, line by line, against
      their English source and each line's actual on-screen situation.
      Verdict: also already high-quality, idiomatic, correctly-registered
      prose (formal address consistently used in both languages;
      Czech's vocative `travellerFallback` ("poutníku") and Farsi's
      comma-address convention both correctly reused for the new R7
      `{name}` insertions) — no mistranslations or tone breaks found in
      either language across any of the six files. Two fixes carried over
      from R10's citation-accuracy audit, propagated to their CS/FA
      mirrors in the same pass (R10 was EN-first by design; this is the
      "propagate inside R3" step the R10 entry promised):
      1. `cs-endings.ts`'s `return` field note had the same "Innana" typo
         as the English source — fixed to "Inanna" (Farsi's transliteration
         was already correct, no fix needed there).
      2. The fabricated Rilke "dragons guarding our deepest treasure"
         quote in the `fortress` ending's field note — replaced in both
         `cs-endings.ts` and `fa-endings.ts` with the same paraphrase of
         Rilke's actual, verifiable dragon/princess image used in the
         English fix.
      Two more R10 corrections live in room field notes translated
      separately from the endings/UI files (`cs-rooms-act2.ts`/
      `fa-rooms-act2.ts` for casino-pascal's Pascal attribution;
      `cs-rooms.ts`/`fa-rooms.ts` for quiet-alarm's Kitty Genovese framing)
      — found and fixed the same way: "Pascal, vynálezce/مخترع teorie
      pravděpodobnosti/نظریه‌ی احتمال" (inventor) softened to "jeden ze
      zakladatelů/یکی از بنیان‌گذاران" (a founder/founding figure) in both
      languages; the Genovese witness-count framing reworded in both
      languages to flag it as exaggerated rather than settled fact,
      mirroring the English R10 fix. `npx tsc --noEmit` clean; `npx vitest
      run` — 432 tests passing, unchanged (this was a content-only pass,
      no new tests).
- [x] R4. **German + French packs — full scope shipped, including
      long-form room/ending prose.** Full scope per spec is ~1,500 strings
      per language (UI chrome, acts, barks, all room prose, endings,
      notes, plus every M5 addition) — comparable to the original
      multi-session Czech/Farsi content effort. Shipped across two passes,
      at full translation quality throughout (from the English v2 source
      directly, never via Czech, per CLAUDE.md's context-first rule):
      infrastructure (`Lang = 'en'|'cs'|'fa'|'de'|'fr'`, `LANGS`,
      `nextLang` cycle `en→cs→fa→de→fr→en`, `Settings.language` widened
      via the shared `Lang` type — no schema-version bump needed); the
      UI/structural layer (`de.ts`/`fr.ts`, ~200 keys each — UI chrome,
      act names/intros, all 25 Usher barks, every room's
      title/doorHint/teaser, all 7 endings' title/epitaph, keepsake
      names/origins) plus `de-epiphanies.ts`/`fr-epiphanies.ts` (all 12
      Ledger epiphany lines); and — completing the scope this pass — the
      full long-form room prose for every act
      (`de/fr-rooms.ts` for the prologue + Act I,
      `de/fr-rooms-act2.ts` through `-act4.ts`, `de/fr-rooms-understory.ts`
      for Act V) and all 7 endings' beats + field notes
      (`de/fr-endings.ts`), each room's beats, choice
      text/hints/outcomes, plain-language explanation, and field-note
      title/thinkers/body translated in full. State-reactive (dynamic)
      beats — the `choseIn`/`hasFlag`/`memoryLost`/prior-run-mirror
      branches in `junction`, `ship`, `teleporter`, `door-that-asks`, and
      the three Understory rooms — are handled separately in
      `de-dynamic.ts`/`fr-dynamic.ts`, mirroring the exact branching logic
      and English source text of the established `cs-dynamic.ts`/
      `fa-dynamic.ts` pattern. Terminology fixed for consistency: "Usher"
      → German "Platzanweiser", French "Le Placeur", used as a
      proper-noun-style dialogue tag throughout; formal register (Sie/
      vous) maintained project-wide. Fonts: verified programmatically that
      Fontsource Inter/Spectral's bundled subset covers
      ß/ü/ä/é/è/ê/ç/œ — no new font needed.
      `i18n.test.ts` and `uiKeyCoverage.test.ts`'s `LANGS` loops include
      `de`/`fr`; `translationCoverage.test.ts` (the deep room-prose
      coverage suite covering every room's beats/choice
      text/hint/outcomes/explanations/field-notes and every ending's
      beats/field-notes) extended from `['cs','fa']` to
      `['cs','fa','de','fr']` and passes in full — two coverage gaps found
      and fixed along the way (the `quiet-alarm` and `teleporter` field
      notes' `thinkers` lines were untranslated proper-noun strings
      identical to the English source, tripping the coverage check;
      fixed by translating "Darley & Latané" → "Darley und Latané"/"Darley
      et Latané" and "Reasons and Persons" → "Gründe und Personen"/
      "Raisons et personnes").
      Live-verified in a real browser (`?uat=1`, screenshots read):
      confirmed newly-translated room prose (not English fallback)
      renders correctly in both languages mid-run — German "Die Weiche"
      (`junction`) and French "Le rocher" (`boulder`) both show fully
      translated beat text, correct HUD language indicator, zero
      console/page errors.
      `npx tsc --noEmit` clean; `npx vitest run` — 456 tests passing.
      Reflections (Examined Path per-tradition readings) remain
      intentionally out of scope for this pass, as before.
- [x] R5. **Content-pipeline validation tests + "twenty rooms" continuity
      fix.** New `src/test/contentPipeline.test.ts` walks `allRooms` and
      asserts, for every room: at least one stage; every stage has at least
      two choices; every choice has non-empty `text` and at least one
      `outcome` beat; every choice in a non-gate room has a non-empty
      `hint`; every `keepsakeId` referenced by a choice resolves against
      `KEEPSAKES` (`content/keepsakes.ts`); every `reflections` entry uses a
      legal `Reflection.tradition` value (`consequence`/`duty`/`virtue`/
      `care`) and non-empty text. 6 new tests, all passing.
      **Continuity fix — wider than the spec's literal scope:** the spec
      named only `src/content/endings.ts`'s Punchline ending, but the same
      stale "twenty rooms" claim (verified via `content/rooms/index.ts`'s
      `allRooms` composition: 33 rooms total — prologue + 8 + 9 + 9 + 3 +
      3 understory — not twenty) also appeared in the title-screen tagline
      (`uiKey('titleTagline')`), which is far higher-visibility than the
      ending text. Fixed all 7 occurrences found across EN/CS/FA:
      `src/content/endings.ts` (Punchline's beat 5 and field-note body),
      `src/ui/overlays.ts` (English tagline fallback), `src/content/text/
      cs.ts` + `fa.ts` (tagline translations), `src/content/text/
      cs-endings.ts` + `fa-endings.ts` (both Punchline occurrences in each
      language). Followed the project's existing "evergreen phrasing over
      numbers that need upkeep" convention (matching how endings are
      described as "six endings, and rumors" elsewhere) rather than
      substituting a new hardcoded numeral — e.g. English "It took you
      twenty rooms" (a deliberate category mistake, treating rooms as a
      duration) became "It took you every room", preserving the same
      rhetorical device without the number; the Czech and Farsi
      field-note bodies were given an equivalent non-literal substitute
      ("the whole building", matching the same category-mistake
      construction) rather than a blander word-for-word fix. Did not touch
      the deliberately-frozen legacy `v1-en.ts` text. `npx tsc --noEmit`
      clean; `npx vitest run` — 425 tests passing (419 prior + 6 new).
- [x] R6. **Dead-flag audit: every set flag gains a reader (CI-enforced).**
      Implemented as a generated registry test, not a one-off snapshot —
      `src/test/flagAudit.test.ts` recomputes both sides from source on
      every run. "Written" = every literal in some choice's `effects.flags`
      across `allRooms`. "Read" = every literal passed to `hasFlag(state,
      '...')` anywhere under `src/content`/`src/engine` (scanned as text via
      the same `readdirSync`/`readFileSync` walk `uiKeyCoverage.test.ts`
      already uses, so it also catches the per-language dynamic-beat
      override files, which read flags but don't import `allRooms`), plus
      every flag consumed as a keepsake earn-trigger
      (`KEEPSAKE_TRIGGERS`, read positionally in `flow.ts`, not via
      `hasFlag`). Found 11 flags ever written; 9 have a reader (6 via
      `hasFlag`, 4 via `KEEPSAKE_TRIGGERS`, one — `saved-photo` — via both).
      The remaining 2 (`pushed`, `kept-bridge`, both set by the Junction's
      trolley choices) are genuinely never read via `hasFlag` — the
      Junction's outcome is instead queried by room+choice id via
      `choseIn`/`choseInPrior` (understory.ts's `the-echo`, act4.ts's
      door-that-asks, and the per-language dynamic beats), so the flag
      itself is redundant for lookups but still correct to keep as the
      canonical record of "this happened." Recorded as an explicit,
      reasoned `ALLOWLIST` entry rather than deleted or silently ignored;
      a second test asserts the allowlist itself can't go stale (every
      entry must still be an actually-written flag), and a third confirms
      the reverse direction — no `hasFlag` call reads a flag that no room
      ever writes (would catch a typo). **Usher invariant recorded:**
      re-verified by inspection that `content/usher.ts` only ever *reads*
      `RunState` (`s.hearts`) and never calls `applyEffects` or mutates
      state — the persona layer stays read-only, per docs README
      convention 9. `npx tsc --noEmit` clean; `npx vitest run` — 429 tests
      passing (425 prior + 4 new).
- [x] R7. **Persona whisper pass: exactly four `{name}`/blurb touches, never
      on door screens.** Three new insertions, all using the already-live
      `{name}` token plumbing (`Game.tokens()` → `playBeats`/`showBark`'s
      `tokens` param → `applyTokens`): (1) Act III's intro
      (`content/usher.ts`'s `actIntroText`) gains a clause — "The facility
      calls this wing archival. It means: yours, {name}." (2) a new
      low-frequency Usher bark, `generic7`, added to the generic door-bark
      rotation and to `USHER_BARK_IDS` — "The doors already know your name,
      {name}. It is the rest of you they are curious about." (3) the
      `return` ending's final beat now closes on "...was never a road,
      {name}. It was a renovation." The fourth touch — the-archive's
      `{blurb}` echo of the player's own self-description — was already
      shipped in Phase L (per spec 02 §6); listed here for the audit trail
      only, not implemented twice. None of the three new sites is a door
      screen. All translated EN+CS+FA in the same commit, following
      CLAUDE.md's context-first rule (Czech/Farsi already have an
      established comma-address convention for direct address — e.g.
      `travellerFallback`'s vocative "poutníku" in Czech — reused here
      rather than inventing a new construction). New test
      (`i18n.test.ts`, "persona whisper pass") asserts `{name}` survives
      translation verbatim at all three sites in all three languages,
      including a `generic7`-selecting `RunState` (`visited.length % 8 ===
      7`, no axis/heart/lucidity bark competing) so the rotation-picked
      case is actually exercised, not just the raw string. `npx tsc
      --noEmit` clean; `npx vitest run` — 432 tests passing (429 prior +
      3 new).

### Production-review additions (2026-07-06 — see `docs/development/11-production-review.md`)

- [x] R8. **Save integrity:** `Profile.schemaVersion` int (`PROFILE_SCHEMA_VERSION`,
      `engine/saveStore.ts`); `LocalSaveStore.load()` (`engine/localSave.ts`)
      keeps the previous good payload under a `:backup` localStorage key on
      each successful load; on parse failure it restores from backup
      (`wasRestoredFromBackup()` drives a one-time, quiet title-screen toast,
      `ui/toast.ts`'s `showRestoredFromBackupToast`, EN+CS+FA), only then
      falls back to defaults. A captured `v0.1.5-v2-beta` profile blob
      (`test/fixtures/v0.1.5-v2-beta-profile.json`, pre-split `sound`
      toggle, no `schemaVersion`/`keepsakes`/`examinedPathDefault`) is a
      committed migration fixture, asserted to load cleanly and backfill
      every current field (`saveIntegrity.test.ts`, 9 tests). Binding rule
      (docs README convention 9, already in place): never rename/re-type a
      persisted field without a version bump + fixture test. Live-verified:
      a corrupted primary payload in a real browser correctly restores from
      backup and shows the toast with the right text.
- [x] R9. **Profile export/import** in Settings → Data: "Download" saves the
      profile as a JSON file (`Game.exportProfile`, `flow.ts`); "Import"
      pastes a profile into a textarea behind the same double-click confirm
      pattern as the reset buttons, reusing `hydrateProfile` (moved to
      `saveStore.ts` so both the normal load path and import share one
      merge path) so an older export still backfills cleanly, then persists
      and reloads. Invalid JSON changes nothing and shows an inline error
      instead. EN+CS+FA. Doubles as the player backup, cross-build (web ↔
      Electron) transfer, and bug-repro channel. Live-verified in a real
      browser: export downloads the current profile; importing a different
      profile JSON and confirming replaces `localStorage` with the
      hydrated, imported data.
- [x] R10. **Citation-accuracy audit** of every field note and ending note,
      EN first (per spec, cs/fa propagate inside R3, still open). Read all
      39 field notes/ending notes (8 in Act I, 9 in Act II, 9 in Act III, 2
      in Act IV, 3 in the Understory, 7 endings) against what I know of
      each named source, checking every attribution, date, and quoted
      line. The large majority held up (Foot 1967, Thomson's footbridge,
      Nozick 1974/1969, Rawls/Harsanyi, the verified Nozick "divide almost
      evenly" quote in the-predictors-ledger, the Camus/Frost/Nietzsche
      quotes, etc. — all checked, none changed). Four issues found and
      fixed:
      1. `content/endings.ts` (`return`'s field note): "Innana" → "Inanna"
         (Sumerian goddess, Descent of Inanna) — a misspelling.
      2. `content/rooms/act2.ts` (casino-pascal's field note): "Pascal,
         inventor of probability theory" overstated his role — Fermat
         co-developed it via their 1654 correspondence — softened to
         "Pascal, a founding father of probability theory."
      3. `content/endings.ts` (`fortress`'s field note): the line
         attributed to Rilke — "our deepest fears are like dragons
         guarding our deepest treasure" — does not match his verified text
         and is a commonly-circulated internet misattribution. Replaced
         with a paraphrase of his actual, verifiable dragon image from
         *Letters to a Young Poet* (dragons who are secretly princesses,
         waiting for courage), reframed to keep the ending's point about
         self-protection walling off the good along with the threat.
      4. `content/rooms/act1.ts` (the-photograph's field note): the Kitty
         Genovese framing ("attacked within earshot of dozens") repeated
         the now-disputed original *New York Times* witness count;
         reworded to flag it as "widely reported (and, later reporting
         found, partly exaggerated)" rather than asserting the old figure
         as settled fact, while keeping Darley & Latané's actual bystander-
         effect research (which is solid) intact.
      No test added — this is a content-accuracy pass, not new testable
      behavior — but confirmed no existing test asserts the old (now
      corrected) English strings. `npx tsc --noEmit` clean; `npx vitest
      run` — 432 tests passing, unchanged. **Still open:** propagate these
      4 corrections into `cs-endings.ts`/`fa-endings.ts`/`cs.ts`/`fa.ts`
      (where they're mirrored) when R3's Czech/Farsi quality pass reaches
      these rooms/endings.
- [x] R11. **Documentation refresh.** Root `README.md` fully rewritten:
      room count updated to the "30+3 rooms" phrasing (verified against
      `content/rooms/index.ts`'s `allRooms` composition: 8+9+9+3 main-act
      rooms + prologue + 3 optional Understory rooms), a full Structure
      table listing every Act I–IV room including the Phase K additions
      (Buridan's queue, the reference letter, the Chinese Room, Newcomb's
      annex, the veil of ignorance, Mary's room, the butterfly's dream,
      the swampman, the secret room) plus a new Act V row for the
      Understory; endings described as "six endings — and rumors of a
      seventh" (spoiler-safe, matches the in-game codex display rule of 6
      until the seventh is actually witnessed); keepsakes, the Ledger, and
      the Examined Path each get a line under Playing; a one-line content-
      sensitivity note (heavy themes handled abstractly, no graphic
      violence) and a target session length ("about 20–30 minutes",
      reasoned from the graph's fixed 15-room run length and the
      experience charter's 2–4-minutes-per-room pacing ceiling — an
      honest estimate, not a measured average); the 1280×720 @ ≤130% zoom
      accessibility floor and RTL Farsi support are now stated explicitly;
      confirmed `dist/`+`release/` are gitignored (`.gitignore` already
      had both) and said so; the release-procedure section now leads with
      the proven `workflow_dispatch` + `tag_name` path (the one actually
      exercised — R1/R2's own release notes hit the same tag-push
      restriction) and demotes the `git tag && git push` flow to a
      secondary note about environment variance instead of the primary
      instruction. New root `CHANGELOG.md`: one entry per released
      version (v0.1.0, v0.1.5-v2-beta, each dated from `git for-each-ref`
      on the actual tags) plus an "Unreleased" section summarizing
      Milestone 5's shipped-so-far scope. `docs/development/README.md`'s
      status-line wording was already fixed in the 2026-07-06 review, so
      untouched here. No source changes — `npx tsc --noEmit` and `npx
      vitest run` (432 tests) unaffected, confirmed still clean.

## Phase S — Testing, UAT & release (spec `09-testing-and-release.md`)

- [x] S1. `?uat=1` test mode (typewriter off, fast tweens, gated debug handle
      incl. `jump`/`doorRects`/`fps`) — **built first**. `src/engine/uatMode.ts`
      + wiring in `main.ts`/`flow.ts`/`director.ts`/`doors.ts`/`toast.ts`;
      `__APP_VERSION__` vite define added (also serves Q3.1 later). Verified
      live: handle absent on normal boot, present + correctly shaped under
      `?uat=1`, `jump('junction')` reloads straight into Act II at the right
      stage with zero console/page errors.
- [x] S2. **Milestone 4's deferred verification debt cleared:** layout
      sweep, scenery proof, door-visibility sweep, transition-garble
      check, troll test, i18n matrix — landed as `tests/uat/06`–`11.mjs`
      (the existing S7 committed-suite location and pattern, rather than a
      separate `scripts/uat/`, since S7 already established that
      convention). All 6 run and pass. Each is scoped down from the
      spec's original multi-viewport/multi-panel sketch — this sandbox's
      headless Chromium costs ~5s per click/navigation (confirmed against
      the already-committed `01-title-onboarding.mjs`, 35s for 5
      interactions), so a literal 4-viewport × 5-panel matrix reliably
      blew the 90s hard timeout even after three rounds of trimming; a
      genuine dev-server crash mid-run (unrelated to the scripts
      themselves) cost a further round of retries before that was found.
      Found and fixed a real bug in the shared `_helpers.mjs` along the
      way: `advance()` hardcoded a 3s per-click timeout, well under this
      sandbox's real click latency, so it was silently no-op'ing via its
      trailing `.catch()` — raised to 12s, verified `01` still passes.
      - `06-layout-sweep.mjs`: Settings panel fully on-screen at 800×1280.
      - `07-scenery-proof.mjs`: a pixel-color visual proof (INSIGHT vs
        DILEMMA room average canvas RGB, with the "Dynamic scenery"
        setting on vs off) was attempted first — `gl.readPixels` reads
        back zeros once the render loop idles (no
        `preserveDrawingBuffer`), so switched to a real Playwright
        screenshot + a small built-in PNG decoder (`averagePngRgb`, added
        to `_helpers.mjs`, zlib-only, no new dependency) — but the
        resulting signal stayed noise-level (comparable or smaller than
        starfield-animation noise) across several room/region/threshold
        combinations. Replaced with a still-real, non-flaky check instead:
        the setting itself round-trips through Settings → localStorage →
        reload. **Still open:** a genuine visual proof of the mood tint,
        on a faster machine where per-frame noise can be averaged out
        over more samples without hitting the timeout.
      - `08-door-visibility.mjs`: every offered door's `doorRects()`
        projection is `onScreen` at 800×1280, reached via a real completed
        room (the-wallet) rather than `jump()` alone, since a door offer
        only exists between rooms.
      - `09-transition-garble.mjs`: a burst of 4 screenshots during
        the-photograph's (Act I gate) walkthrough into Act II shows at
        least one non-black frame. Uses `page.screenshot({ clip })`
        rather than `locator.screenshot()`, which waits for the target to
        stop animating — exactly the moment this check needs to observe.
      - `10-troll.mjs`: ~20s of spammed clicks/keys/resizes/language
        switches at the title screen, zero `pageerror` events (trimmed
        from the spec's 45s to fit the hard timeout; same assertion).
      - `11-i18n-matrix.mjs`: Czech/Farsi taglines differ from the English
        fallback and Farsi flips the document to RTL, switching via
        Settings' language toggle selected by DOM position (not text —
        after the first switch, "Settings"/"Done" are themselves
        translated).
      `npx tsc --noEmit` clean; `npx vitest run` (432 tests) unaffected —
      these are plain Node/Playwright scripts, not part of the TS build.
- [x] S3. **Feature→test traceability matrix green.** The matrix itself
      already lives in `docs/development/09-testing-and-release.md` §6
      (written during planning); verified every named unit/simulation test
      file it lists actually exists and passes: `newRooms.test.ts`,
      `graph.test.ts`, `difficultyGuardRail.test.ts`, `understory.test.ts`,
      `anamnesis.test.ts`, `keepsakes.test.ts`, `examinedPath.test.ts`,
      `ledger.test.ts`, `usherMotion.test.ts`, `flagAudit.test.ts`,
      `i18n.test.ts`, `uatMode.test.ts`, `contentPipeline.test.ts`,
      `translationCoverage.test.ts`, `uiKeyCoverage.test.ts` — all present.
      Suite was 432 tests at the time this row was written; grew to 471 once
      dioramas (Q1), audio deepening (Q5), and DE/FR (R4) landed in later
      passes — `dioramas.test.ts` and `audio.test.ts`'s extended hover-pitch/
      impulse-samples/room-accent coverage now fill those rows too.
- [ ] S4. **Full regression + owner feel-pass (charter checklist).**
      Automatable half done, re-verified after Q1/Q5/R4 landed: `npx tsc
      --noEmit` clean, `npx vitest run` green (471 tests), all six S2
      scripts (`tests/uat/06`–`11.mjs`) re-run and passing against the
      finished milestone, including the new diorama/audio code paths (a
      six-room diorama walkthrough produced zero console errors). **Still
      open, by design:** the manual feel pass itself — Usher walk/dolly
      pacing, lantern behavior, reverb tail taste, title parallax restraint
      — the spec is explicit that "screenshots/video cannot judge these";
      this requires the owner (or a developer with a real display) actually
      playing the build, not a session with no display to self-certify
      from. Not marked done until that pass happens.
- [ ] S5. Release v0.2.0-beta EXE + first Pages deploy; checkboxes updated.
      **Release blockers extended per production review (doc 11, §B4):**
      S6/S7 done · R8 backup live · Phase O release gate satisfied (Acts
      II–IV reflections authored, EN+CS+FA) · README + CHANGELOG current
      (R11) · real-v0.1.5-profile migration fixture green · charter
      feel-pass signed · one Electron boot smoke test.
- [x] S6. **Recovery overlay (stability hardening, doc 11 §A13):** global
      `error` + `unhandledrejection` + `webglcontextlost` handlers → one
      calm, in-fiction recovery panel ("The facility flickers. Your file is
      safe.") with a return-to-title action. Safe by design: the profile is
      always persisted at the last checkpoint, so recovery loses nothing.
      Charter-compliant (quiet, one interaction, no technical jargon in the
      player-facing copy). Implemented as `shouldTriggerRecovery` (pure
      one-shot guard, `engine/recovery.ts`, tested) +
      `installRecoveryHandlers`/`showRecoveryOverlay` (`ui/recovery.ts`,
      reuses `.codex-panel.about-panel` styling), wired once in `main.ts`
      before the `Game` is constructed. EN+CS+FA (`ui.recovery*` keys).
      Live-verified: throwing a synthetic uncaught error in a real browser
      correctly shows the panel over the dimmed title screen.
- [x] S7. **Committed UAT suite (doc 11 §A10):** `tests/uat/` now holds five
      stable, self-contained Playwright scripts — `01-title-onboarding`
      (fresh-profile title screen + auto-About + phantom-run regression),
      `02-save-reload-continue`, `03-examined-path` (reflection card),
      `04-keepsakes-shelf`, `05-anamnesis` (hidden ending option) — plus a
      README (run instructions, environment notes, 3-minute budget each per
      CLAUDE.md). `playwright` added as a devDependency. Also fixes
      `jump()`'s Act IV/Understory backfill (mid-milestone review item 7):
      `backfillVisitedForJump` (`engine/storyEngine.ts`, pure, tested in
      `graph.test.ts`) marks the preceding `ACT4_SEQUENCE`/
      `UNDERSTORY_SEQUENCE` rooms `visited` (and sets `descended`) so jumping
      straight to e.g. `door-that-asks` no longer re-offers `boulder`
      afterward. All five scripts verified green in this session.

## Post-milestone bugfix — stage-bottom panel stacking (2026-07-07)

Reported by the owner: "the text / descriptions of the doors are not in
the right positions." Live verification in a real browser (`?uat=1`,
screenshots + DOM rect dumps read) found a real bug, not a perception
issue: `TextPanel`, `ChoicePanel`, and `ReflectionPanel` are three separate
class instances that all mount their element into the same
`.stage-bottom` flex column, and each only ever tracks/removes *its own*
previously-mounted element. `engine/flow.ts` calling `choices.pick(...)`
or `reflection.show(...)` immediately after a `text.playBeats(...)`
resolves — without an intervening `text.hide()` — left the stale beat text
(with its already-clicked "continue" hint) mounted while the new panel
was `prepend()`ed next to or above it. Two call sites had this bug:

1. **In-room choices** (the reported symptom): after a stage's beats
   finished, `choices.pick(...)` was called with no `text.hide()` first —
   screenshotted live, the leftover beat panel (with "CONTINUE") sat
   directly above the 4 choice cards, pushing everything down and reading
   as misplaced/duplicated text.
2. **Examined Path reflection card** (found via the same audit, not
   separately reported): `reflection.show(...)` was likewise called with
   no `text.hide()` first. Since both `TextPanel.replacePanel` and
   `ReflectionPanel.replacePanel` call `prepend()`, the reflection card
   landed *above* the outcome text it was commenting on — screenshotted
   live showing "The Annex Files" rendered above "THE JUNCTION"'s own
   outcome beat, backwards from the intended reading order.

The door picker's `text.showBark(...)` immediately before
`choices.pickDoor(...)` is the one *intentional* case of two stage-bottom
panels coexisting (a one-line Usher bark stays visible above the door
row) — confirmed not a bug and left alone. Audited every other
`.prepend()`/`.appendChild()` site in `src/ui/*.ts`; no other component
shares `.stage-bottom` with these three, so the bug was fully contained to
the two call sites above.

**Fix:** one `this.text.hide()` added immediately before each of the two
call sites (`engine/flow.ts`).

**Tests added, per the owner's request to catch "these and other things
and issues" broadly:**
- `src/test/panelLifecycle.test.ts` — a fast, browser-free source-level
  invariant (mirrors `flagAudit.test.ts`'s "generated registry" pattern):
  scans `flow.ts` and asserts every `choices.pick(...)`/`reflection.show(
  ...)` call is immediately preceded by `text.hide()` (never a dangling
  `playBeats()`), and `choices.pickDoor(...)` is preceded by `text.hide()`
  or the intentional `text.showBark()`. Verified this test genuinely
  catches the regression (reverted the fix locally, confirmed the test
  fails with the exact diagnostic, reapplied the fix, confirmed green).
- `tests/uat/12-choice-panel-replaces-text.mjs` and
  `tests/uat/13-reflection-panel-replaces-text.mjs` — the genuine
  browser-rendered checks, one script each (a combined single script was
  tried first, matching the shape of the fix's two call sites, but a
  second sequential `withPage()` browser launch in one Node process
  destabilized this sandbox's headless Chromium after several minutes of
  interaction; split into two single-`withPage()` scripts, both verified
  green, matching every other script in the suite and CLAUDE.md's
  "small, focused scripts" rule).

`npx tsc --noEmit` clean; `npx vitest run` — 476 tests passing (up from
471). `tests/uat/README.md` updated (13 scripts now).

## Implementation order

**S1 first**, then **K → N → M → L → O → P → Q → R (except R4) → S → R4
(DE/FR last)** — content first, the mechanics that thread through it, then
presentation, then platform. All of it under the Experience Charter
(`docs/development/10-experience-charter.md`).

**Revised remaining order (production review, 2026-07-06, doc 11 §B5):**
finish O's Acts II–IV authoring (release gate) → hardening batch
(S6 + S7 + R8 + R9; small, independent, everything after ships on top of
them) → P (with a keepsakes-style read-only hard-guarantee test required,
not optional) → Q (+ fold in the dangling I9 colorblind/readability audit
or explicitly re-defer it to M6) → R (R1–R3, R5–R7, R10, R11; R3 is large —
schedule honestly) → S2–S5 → R4 last. Six open questions for the owner are
listed in doc 11 §B6 (save-safety confirmation, citation-softening policy,
target session length, whether Q hard-gates v0.2.0, telemetry-never
confirmation, accessibility scope).

# LIMERENCE — second title (in active development, playable in part)

A second game on this engine: relationships at their breaking points —
infidelity, polyamory, jealousy, disclosure, coercion, drift — cast aged
15–35, G.R.R. Martin × Maxime Chattam × modern psychology, built so players
experience the traps before life springs them. Built on top of a
refactored, content-agnostic engine + two content packs (ANAMNESIS
unchanged, behavior-neutral).

**The collection name (decided 2026-07-08): "The Vestibule."** With two
titles now sharing one engine, the repo needed a name for the pair —
ANAMNESIS and LIMERENCE stay their own self-contained games (own guide,
palette, stakes, save namespace); "The Vestibule" is the umbrella the
README now uses to introduce both from one page. Chosen over "Threshold"
(too generic a word to brand) and "The Interval" (already LIMERENCE's own
in-fiction frame name — reusing it for the collection would blur which is
which): a vestibule is precisely the liminal antechamber both games are
staged in — the space behind a hard door, before whatever's on the other
side. Same branding grammar as the two game titles: one precise, faintly
architectural word that names the shared thesis rather than either game's
specific content. Surfaced in `README.md` (top-level framing + cross-links)
and `package.json`'s `description`; the npm package name itself
(`"anamnesis"`) is left alone — it's an internal build identifier, not
player-facing branding, and renaming it risks breaking tooling for no
player-visible benefit.

**Full design specifications live in `docs/design-limerence/`** (creative
bible, 31 room briefs with psychology anchors, 7 endings, keepsakes/
epiphanies/Examined Path re-skins, citation-honesty rules, the
`ContentPack` engine architecture with a 23-point coupling inventory, the
L0–L6 milestone roadmap, and a binding safety/education charter — Act I
non-explicit, adult acts frank-never-graphic, ~PEGI 16 posture).

- [x] L0. Design specifications committed (documentation only — this entry).
- [x] L1. Engine/pack split (`docs/design-limerence/08-…`); ANAMNESIS
      behavior-neutral, tests parameterized, both packs boot. **Done
      2026-07-08**, in 8 small, independently-tested commits (`src/engine/schema.ts`
      + text resolver/keys moved into `engine/`; the `ContentPack` interface
      + `packs/anamnesis/` assembled by re-export; `Game`'s constructor,
      `flow.ts`'s special-room hooks, `SceneDirector`, `overlays.ts`,
      storage/UAT namespacing, and `storyEngine.ts`'s graph functions all
      threaded through `pack`; a real (if minimal) `packs/limerence/`
      skeleton — 10 rooms, 2 endings, matching the room/gate ids already
      named in the design docs — proving the seam; `packConformance.test.ts`
      and `contentPipeline.test.ts` parameterized over both packs). tsc
      clean throughout; suite grew 476 → 514, nothing deleted; `npm run dev`
      and `npm run dev:limerence` both live-verified booting correctly with
      zero console errors. Two things deliberately deferred rather than
      rushed — see spec 08 §6/§7 for the honest accounting: (1)
      `engine/endings.ts`'s ANAMNESIS-specific evaluation logic is wired
      into `pack.endingRules` by re-export but not yet physically relocated
      under `packs/anamnesis/`; (2) `graph.test.ts`/`flagAudit.test.ts`/
      `translationCoverage.test.ts` remain ANAMNESIS-only pending
      LIMERENCE's pool sizes growing past 1-per-act. Neither blocks L2.
- [~] L2. LIMERENCE playable skeleton EN (frame, prologue, Act I, 2 endings,
      advisory layer). **Mostly done, 2026-07-08.** Real content now, not
      placeholders: the-front-desk (prologue) + the full 7-room Act I pool
      (the-read-receipt, the-screenshot, the-password, the-party,
      the-forward, the-best-friends-girl, the-summer-ends) + the-rumor gate,
      each with 4 choices, full effects/outcomes, an explanation, a cited
      field note, and Examined Path reflections across all four traditions —
      matching `docs/design-limerence/02-rooms-act1.md` room-for-room. The
      two L2 endings (the-morning-after, the-ghost) were already wired at
      L1.5 and now resolve correctly against real play; the first keepsake
      (the-cheap-ring, earned by refusing the party dare) works end to end.
      Live-verified: a full run from a jumped-in final gate through to the
      ending screen (axis triptych, recap, stats, epiphany) renders cleanly
      with zero console errors, alongside targeted checks of the-read-receipt
      (4 choices, correct lucidity math) and the-rumor (4 choices, DOOMED
      weight intact).
      **Onboarding advisory layer — done (2026-07-09).** `showAbout()`
      (the "Before you begin" panel, engine-shared) is now pack-aware:
      `ContentPack.advisory?: {...}` (new optional field, `packs/types.ts`)
      carries a purpose statement, a pack-specific mechanics note, the
      themes list, the minors'-content note, the fiction-not-therapy note,
      a static help line, and a no-telemetry restatement. ANAMNESIS defines
      no `advisory` and renders its original why/hearts/doors content
      byte-for-byte unchanged (verified by test). LIMERENCE's `advisory`
      is populated per spec 10 §2 exactly — themes (infidelity, jealousy,
      coercive control, non-consensual image sharing (never depicted),
      relationship breakdown, consensual non-monogamy), the Act I
      minors'-content note, "this is fiction, not therapy or advice," the
      static jurisdiction-generic help line, and an honest no-telemetry
      line. No new trigger mechanism was needed — the engine's existing
      `Profile.hasSeenAbout` (already generic, already shows "Before you
      begin" automatically once on a player's first-ever new run, already
      re-openable from the title menu afterward) was already exactly the
      onboarding-advisory mechanism the spec asked for; it just needed
      pack-aware content, not new plumbing. The panel content itself was
      refactored into a pure `aboutBodyHtml(pack)` helper (`ui/overlays.ts`)
      so it's unit-testable without a DOM — 5 new tests in
      `advisoryLayer.test.ts`, including a charter-mandated regression test
      that the non-consensual-imagery theme is named but never depicted or
      characterized in the advisory copy itself. Also required extending
      two existing ANAMNESIS-only audits to be pack-aware/exclusion-aware
      so they didn't false-positive on the new pack-conditional content:
      `flagAudit.test.ts` (done in the previous L4 round) and
      `uiKeyCoverage.test.ts` (this round — a documented
      `PACK_CONDITIONAL_KEYS` exclusion list, with its own staleness
      check, for the new `about*` keys that only ever render behind
      `pack.advisory`, which LIMERENCE alone defines and which has no
      translations yet). Live-verified via Playwright: the advisory
      auto-shows on a fresh LIMERENCE profile's first "Begin," contains
      every mandatory element, and ANAMNESIS's own About panel is
      confirmed unaffected. Full suite 669/669 green.

      **Still not done:** the hearts→Trust *label* re-skin (the icon
      reuses ANAMNESIS's placeholder per L1; the HUD tooltip copy —
      "grip on reality" — is still ANAMNESIS's own words, since
      `ContentPack.skin` doesn't yet carry per-pack HUD-copy overrides;
      the new advisory panel's own mechanics paragraph does correctly say
      "Trust," so the inconsistency is now scoped to exactly one
      remaining surface, not several). This is L5 polish, not a safety
      gap — deferred deliberately, not overlooked.
- [~] L3. Acts II–III + gates + secret room. **Act II done (2026-07-08):**
      8 real rooms (`the-distance`, `the-hall-pass`, `the-rebound`,
      `the-unicorn`, `just-friends`, `the-ex`, `the-confession`,
      `the-other-side-of-the-door`) + the `the-scoreboard` gate, matching
      spec `03-rooms-act2.md` in full — 4 choices apiece, 4-tradition
      reflections, field notes citing real research, cross-act flag
      callbacks (`the-distance`/`the-ex`/`the-scoreboard` read Act I and
      each other's flags), a new `the-unsent-letter` keepsake (earned by
      `the-confession`'s `carry-it`), and three doorSeed-branched outcomes
      (`the-rebound`, `the-unicorn`, `the-other-side-of-the-door`) — a
      deterministic-per-run 50/50 split used, for the first time in either
      pack, where the spec explicitly calls for a genuinely ambiguous
      third-party response rather than an authorial one.
      `optionalPerAct[2]` raised from 0 to 3 now that a real 8-room pool
      exists. Covered by 17 new tests in `limerenceAct2.test.ts`
      (pool-matches-graph, choice distinctness, reflection completeness,
      keepsake wiring, dynamic-beat/doorSeed-branch non-throwing across
      fixtures and seeds, field-note substance). Full suite 610/610 green;
      live-verified via Playwright that all 8 new rooms + the gate render
      real content through `jump()`.

      **Act III done (2026-07-08):** 8 real rooms (`the-colleague`,
      `the-metamour`, `the-veto`, `the-drift`, `the-second-account`,
      `the-discovery`, `the-wedding-eve`, `the-therapist`) + the secret
      room (`the-usual-suite`, `secret: (s) => (s.prior?.runs ?? 0) >= 1`,
      reusing the pack-generic `pickShadowMoments` engine function —
      ANAMNESIS's `the-cave` mechanism, needing zero new engine code) + the
      `the-usual-room` gate, matching spec `04-rooms-act3.md`. Two new
      keepsakes (`the-keycard` earned by `the-colleague`'s `walk-away`,
      `the-sim` earned by `the-second-account`'s `delete-it`).
      `the-therapist` is the pack's first 2-stage LIMERENCE room (stage 1:
      four "door" choices standing in for Gottman's Four Horsemen; stage 2:
      a repair-attempt accept/miss beat, reading which door stage 1 took).
      Six more doorSeed-branched outcomes across `the-metamour`,
      `the-discovery` (×2 branch points), and `the-wedding-eve` (×2),
      using a second, independently-offset `seedSplit2` helper so multiple
      branch points in one room don't always resolve in lockstep. The
      spec's "mechanically complex" beats — flooding's fragmenting
      sentences in `the-discovery`, the four-doors-as-diagnosis in
      `the-therapist` — are rendered through beat prose and the engine's
      existing stage/choice primitives rather than new engine machinery,
      matching this session's content-authoring scope (no new engine code
      needed anywhere in Act III beyond content). `optionalPerAct[3]`
      raised from 0 to 2 (matching ANAMNESIS's own Act III convention: the
      secret room only ever appears as a bonus third door alongside two
      regularly-offered ones). Covered by 22 new tests in
      `limerenceAct3.test.ts` (pool-matches-graph, secret-predicate
      correctness, choice distinctness, reflection completeness, keepsake
      wiring, 2-stage room shape, dynamic-beat/doorSeed-branch
      non-throwing across fixtures and seeds, shadow-moment rendering with
      and without a prior run, field-note substance). Full suite 632/632
      green; live-verified via Playwright that 7 of the 8 new rooms + the
      gate render real content through `jump()`.
- [~] L4. Act IV + Records Office + all 7 endings + full meta-systems.
      **Act IV + Records Office + endings done (2026-07-08):** real content
      for `the-kitchen-table` (4 choices + a ✧ `the-unsent-letter` bonus,
      a dynamic opening beat that reframes by yours/theirs/both betrayal
      lineage), `the-unsent` (6 choices, 4 of them availability-gated on
      flags/visited-room state exactly like ANAMNESIS's `last-message`,
      one quoting an actual Act I transcript entry back to the player),
      and `the-morning-desk` (LIMERENCE's final gate — a 2-stage room: a
      3-choice audit reading back the-screenshot/the-confession/the-trap
      lineage via dynamic Porter dialogue, then a 3-5-choice threshold with
      two hidden doors). All 7 endings now real
      (`the-morning-after`/`the-giver`/`the-armored`/`the-ghost`/
      `the-porter`/`the-mirror`/`the-pattern`), full beats + field notes,
      matching spec `06-endings-keepsakes-epiphanies.md` §1. The Records
      Office (understory) is real too: `the-registry` (+ ✧ `the-keycard`
      bonus), `the-doors-not-opened`, `the-other-side` (+ ✧ `the-sim`
      bonus) — offered as the violet-accented second door beside
      `the-kitchen-table` for `prior.runs >= 1`, exactly like ANAMNESIS's
      own Act V. All 4 keepsakes now have both an earn room and a spend
      room. New `packs/limerence/endingLogic.ts` mirrors
      `engine/endings.ts`'s `punchlineUnlocked`/`anamnesisAvailable`/
      `computeAnamnesisEligible` pattern exactly (`mirrorUnlocked`/
      `patternAvailable`/`computePatternEligible`), reusing the engine's
      already-generic `RunState.anamnesisEligible`/`memoryLost` fields —
      no renaming, per schema.ts's own "field names are never pack-
      specific" rule. One small, safe engine change: `gameState.ts`'s
      `pickUnchosenRooms` gained an optional `pools` parameter (defaulting
      to ANAMNESIS's own `ACT_POOLS`, zero behavior change for ANAMNESIS)
      so `the-doors-not-opened` could reuse it for LIMERENCE's own pools —
      same default-parameter pattern used everywhere else this session.
      Covered by 27 new tests in `limerenceAct4.test.ts` (Act IV + Records
      Office content integrity, all-7-endings shape, `evaluate()` branch
      coverage including hearts=0/each gate choice/axis extremes/default,
      `epitaphLines`/`endingsTotal` display rules, and direct unit tests of
      `endingLogic.ts`'s pure functions). Full suite 660/660 green;
      live-verified via Playwright that all 5 new rooms render and that
      jumping to the final gate and clicking through the threshold
      actually reaches a real, authored outcome beat with zero errors.

      **Still not done: epiphanies (12, spec 06 §3).** `engine/ledger.ts`'s
      `evaluateEpiphanies`/`EPIPHANY_PREDICATES` are hardcoded to
      ANAMNESIS's own room ids and flag names (`experience-machine`,
      `release-form`, etc.) — genuinely not pack-parameterized yet, unlike
      every other engine seam touched this session. LIMERENCE's Ledger
      still works today (the profile-level predicates — runs completed,
      hearts lost, keepsakes held, endings seen — are pack-agnostic and
      evaluate harmlessly; the two ANAMNESIS-room-specific predicates
      simply never fire for LIMERENCE, which is safe but not bespoke), it
      just shows generic-flavored epiphany lines instead of LIMERENCE's
      own 12 designed ones. This needs the same kind of predicate-
      parameterization pass the ending logic just got, done as its own
      dedicated unit rather than folded into an already-very-large L4
      commit. Flagging clearly rather than silently shipping half of L4's
      "full meta-systems" as if it were the whole thing.

      **Dual-pack production deploy + rozcestník, done (2026-07-08):**
      until this pass, the live GitHub Pages site could only ever serve
      ANAMNESIS — `npm run build`/`deploy-pages.yml` had no pack switch,
      so LIMERENCE existed only via `npm run dev:limerence` (localhost).
      Added `build:anamnesis`/`build:limerence` (→ `dist-web/anamnesis/`,
      `dist-web/limerence/`) and `build:web` (both, plus
      `scripts/assemble-web-dist.mjs` copying `landing/index.html` in as
      `dist-web/index.html`) — a small, self-contained static chooser page
      ("The Vestibule", linking to both titles) that is the new deployed
      site root. `index.html` gained `%VITE_TITLE%`/`%VITE_DESCRIPTION%`/
      `%VITE_FAVICON%` tokens (Vite's built-in HTML env replacement) fed
      by a new base `.env` (ANAMNESIS defaults) and the existing
      `.env.limerence` (extended with its own title/description/favicon,
      the last recolored to LIMERENCE's actual steel/amber/teal door
      palette) — each pack's build now has its own browser tab title and
      favicon, not ANAMNESIS's leaking into LIMERENCE's build.
      `deploy-pages.yml` now runs `build:web` and uploads `dist-web`
      instead of `dist`. The existing plain `npm run build` (→ `dist/`,
      still ANAMNESIS-only, no `--mode`) is untouched and still exactly
      what `release-windows.yml`'s Electron packaging uses — verified by
      rebuilding it after this change and confirming `dist/index.html`
      unchanged in content. Live-verified via Playwright: the rozcestník
      renders both doors with correct hrefs, and each subpath boots its
      own game with the correct `<title>` and in-game title-word.
      `dist-web/` added to `.gitignore` alongside the existing `dist/`.

      **Release status (2026-07-09):** L4 is content-complete, both titles
      play end-to-end, the dual-pack web deploy path is built and verified,
      the Windows `.exe` pipeline was verified end-to-end on a real
      `windows-latest` runner (build → package → artifact, all green;
      2026-07-09), and the onboarding advisory layer — the one gap
      previously flagged as safety-relevant rather than mere polish — is
      now done. What remains before a public LIMERENCE release is real but
      genuinely optional: the epiphanies gap (LIMERENCE's Ledger works,
      just shows generic rather than bespoke lines) and the L5 polish
      items below. Note: ANAMNESIS itself already has several public
      GitHub Releases with working `.exe` assets (0.2.0–0.2.3, predating
      this entry) — ANAMNESIS has effectively already been publicly
      released; LIMERENCE has not, and has no Windows/Electron packaging
      at all yet (web-only). `v0.2.0-beta` (package.json) is stale relative
      to the actual tag history and should be bumped before the next
      release cut.
- [x] L5. Hotel visual/audio identity (**pulled forward across
      2026-07-08/09** — see below; content/code complete, `tests/uat/
      14-limerence-visual-sweep.mjs` closes the UAT pack matrix gap for
      this round's L5 work — every prior UAT script exercised ANAMNESIS
      only).

**Pulled forward from L5, on explicit owner request (2026-07-08):**
LIMERENCE now has its own real visual and audio identity rather than
waiting for L5. `Settings.theme: 'dark' | 'light'` (default 'dark') plus
`ContentPack.visuals.supportsLightTheme` gates a Settings > Display
"Light mode" toggle LIMERENCE alone offers — ANAMNESIS keeps its single
authored dark tone, no choice given (asked, and decided against, per the
owner's "keep Anamnesis without choices" instruction). `styles.css` scopes
a full sodium-amber/corridor-teal dark palette under `body.pack-limerence`
and a warmer "morning after" daylight read under
`body.pack-limerence.theme-light`. `src/packs/limerence/theme.ts` gives
the 3D scene five real per-floor palettes (reusing `corridorTheme`'s
geometry, now parameterized via `CorridorPalette`, defaulting to
ANAMNESIS's exact values so its five scenes are pixel-unchanged) plus two
new small builders for the Top Floor and the ending space.
`SoundEngine.configurePack()` lets LIMERENCE override its chord
progressions/mote scales — minor-leaning per floor, resolving to a held
major chord at the ending.

**Further pulled forward from L5, on explicit owner request (2026-07-08,
round 2):** door and "window" (panel) chrome now diverges by pack too, not
just color. `scene/doors.ts` gained a `DoorStyle` param (frame
color/width, slab/glow colors, `skewJitter`, `unsteadyPulse` — all
optional, defaulting to ANAMNESIS's exact original carved-wood geometry
and gold/violet glow) threaded through `SceneDirector.showDoors()` via
`pack.visuals.doorStyle`. LIMERENCE's doors are a thin steel-dark frame
with amber/teal glow, each sitting a fraction of a degree off plumb and
carrying a second, slower wave under the idle breathing pulse — small,
continuous, never a strobe, fully off under reducedMotion, reading as
21st-century-modern and quietly unsettling rather than gothic. `styles.css`
gives LIMERENCE's text panels/field notes/reflection cards/choice cards
their own geometry under `body.pack-limerence`: `--serif` redefined to the
sans stack, asymmetric single-corner `clip-path` cuts (a different cut per
element type) instead of ANAMNESIS's uniform rounding, a hard offset
`box-shadow` instead of the soft gold glow, and a one-shot CSS scan-line
sweep on choice-card hover/focus (disabled under `.reduced-motion`, same
guarantee every other animation in the file already gives). Covered by 79
new tests this round: `packDoors.test.ts` (16, incl. an ANAMNESIS
regression pin and a LIMERENCE-distinctness suite), plus the prior
`packGraph`/`packScene`/`packAudio`/`limerenceAct1` batch (63) — full suite
at 593/593 green throughout.

**L5 finished, plus two cross-pack leaks and the dual-pack Windows exe
(2026-07-09, round 2):** review pass found and fixed two ANAMNESIS-
hardcoded engine seams that silently misbehaved for LIMERENCE — the codex/
Ledger's understory-hiding used ANAMNESIS's `UNDERSTORY_SEQUENCE`
regardless of the active pack (would have leaked LIMERENCE's Records
Office rooms into its codex as locked cards from the start), and the ✧
keepsake-choice tooltip looked its name up in ANAMNESIS's `KEEPSAKES` list
only (would have rendered nameless for LIMERENCE) — both fixed via the
same default-parameter pack-injection pattern used throughout L1, with a
new `crossPackLeaks.test.ts` pinning the old buggy behavior alongside the
fix. LIMERENCE's 143 choice hints were capitalized to match ANAMNESIS's
convention (owner decision). The remaining L5 items are now done:
- **Door icons:** new `packs/limerence/icons.ts`, 34 room + 7 ending
  icons, LIMERENCE's own visual vocabulary (phones, locks, hotel doors)
  rather than reusing ANAMNESIS's; `visuals.iconFor` was `() => undefined`.
- **Epiphanies:** `engine/ledger.ts`'s epiphany machinery was hardcoded to
  ANAMNESIS's 12 ids/predicates — `EpiphanyDef` now carries its own
  `predicate` (mirrors the `endingRules` pattern), ANAMNESIS's original 12
  moved verbatim into `packs/anamnesis/epiphanies.ts` (behavior-neutral),
  and LIMERENCE gets its own 12 per spec 06 §3, evaluated over a new
  `Profile.choiceHistory` field (every room:choice ever taken, across
  every finished run — additive).
- **Door-bark dread pass + act intros:** `packs/limerence/guide.ts`
  mirrors `content/usher.ts`'s full structure (understory fork/single-door
  gate/first-choice explainer/second-run wink/axis-reactive lines/8-line
  generic pool) in the Porter's own register; `actIntroText` returned
  `undefined` for every floor before this and now has one line per act.
- **Hearts→Trust HUD re-skin:** the HUD hearts row and About-panel heart
  glyph were hardcoded to ANAMNESIS's own "grip on reality" wording/icon
  regardless of pack (a third cross-pack leak, same family as the two
  above) — `pack.skin` gained `heartsAriaLabel`/`heartsTooltip`/
  `lucidityTooltip`, LIMERENCE's now say Trust/Clarity throughout.
- **Bespoke dioramas + the Porter's own figure rig:** `dioramaFor` was
  `() => null` for every room; 6 signature rooms now get one (a phone
  glowing "seen," the migrating Glass wall/window, the therapist's four
  doors, a kitchen table under a swaying bulb, two overlapping phones, two
  hotel doors with a pulsing keycard) — same scope as ANAMNESIS's own
  bespoke-signature-rooms-only coverage. `guide.figure` reused
  `usherFigure()` (halo + horns) verbatim; `packs/limerence/figure.ts`
  builds the Porter's own rig from the same primitives — no halo/horns, a
  peaked cap, an amber glow matching the door palette, and the creative
  bible's one visual tell (a ring on the right hand only). Verified with a
  headless Playwright smoke test (zero console/page errors across all 6
  diorama rooms + the figure). Suite at 704/704 green throughout this pass.

**The Windows `.exe` is now dual-pack ("The Vestibule," 2026-07-09):**
previously `electron/main.cjs` always loaded `dist/index.html` (the plain
`npm run build`'s ANAMNESIS-only output) — one game, hardcoded. It now
loads `dist-web/index.html` (the same rozcestník the web deploy uses,
built by `npm run build:web`, wired as a `predist:win` pre-hook so
`npm run dist:win` always rebuilds both packs fresh) and navigates the one
window into whichever door is clicked; Alt+Left returns to the chooser
(deliberately not Backspace — both games have a real text `<input>`, the
persona name editor, and a global Backspace-as-back would eat every
character deleted there). `landing/index.html`'s door hrefs changed from
`./anamnesis/` to `./anamnesis/index.html` (explicit files — a bare
directory href doesn't resolve under Electron's `file://` navigation the
way a web server's index-file fallback does; still valid on the web deploy
too). `package.json`'s electron-builder config renamed the product to "The
Vestibule" (`files` now points at `dist-web/**/*`), and
`release-windows.yml` no longer runs a separate `npm run build` step
before packaging (redundant with the new pre-hook).
- [x] L6. Czech translation (**complete, 2026-07-13** — full parity
      with ANAMNESIS across cs/fa/de/fr, not just Czech, per owner
      instruction; coverage-tested in `limerenceTranslationCoverage.test.ts`.
      Literal/mechanical-quality re-review of the cs/fa prose remains a
      separate, deliberately deferred pass — see CLAUDE.md.).

**Owner-requested polish batch (2026-07-10):** five choice-completeness
gaps closed (3 ANAMNESIS, 2 LIMERENCE — see UPGRADE_PLAN's commit log for
specifics); Steam/DVD packaging readiness (LICENSE, third-party notices,
in-game credits screen, age-advisory badge); the-therapist's one missing
explanation closed and both the explanation-coverage and choice-
capitalization audits made permanent pack-generic tests; the door tooltip
given real clearance from the door glow and the "?" explain button made
more discoverable (bigger, filled, idle pulse); publication years added
to every confidently-dateable field-note citation in both packs, all
languages. Also found and fixed a real (not just theoretical) cross-pack
text leak: LIMERENCE's guide barks/act-intros reused ANAMNESIS's exact
key vocabulary, so both packs' translations — bundled together in every
build — collided; ANAMNESIS's Czech/Usher lines could silently render
inside a LIMERENCE playthrough, and the first-heart-loss message was
hardcoded Usher/"the facility" text with no LIMERENCE override at all.
Fixed at the key-generation level (optional `packId` scoping,
ANAMNESIS's own keys unchanged) — this was a real prerequisite for
starting LIMERENCE's translation work safely.

**Two items explicitly deferred to their own planning pass, not
implemented this round (owner instruction: plan, don't build yet):**

- **LIMERENCE visual language rework.** Owner's ask: make the scenery/
  animations read more specifically as "a relationship at its breaking
  point" rather than a recolored ANAMNESIS corridor, and make light mode
  livelier/more colorful — considered an inverted door/environment
  palette in light mode, more visual elements generally. Scoping notes
  for whoever picks this up: `packs/limerence/theme.ts` already gives
  each floor its own palette and `theme-light` CSS variables exist
  (`styles.css` `body.pack-limerence.theme-light`) but the *geometry*
  (corridor shape, particle behavior, door proportions) is still
  ANAMNESIS's `corridorTheme()` reused wholesale — a genuine rework would
  give LIMERENCE its own scene-builder functions (mirroring
  `scene/themes.ts`'s pattern) per floor, not just recolor the existing
  one. Light mode specifically needs its own pass: right now
  `theme-light` mostly just swaps CSS chrome variables; the *3D scene*
  doesn't currently branch on light/dark at all (`buildTheme(id)` takes
  only the floor id), so a livelier light mode would need `buildTheme` to
  also receive the active theme mode.
- **Per-choice visual cues inside a room.** LIMERENCE already has (a) 34
  door icons (`packs/limerence/icons.ts`) and (b) 6 bespoke dioramas for
  signature rooms (`packs/limerence/dioramas.ts`) — matching ANAMNESIS's
  own scope (bespoke dioramas for signature rooms only, not all ~34).
  Whether the owner wants *more* than that — e.g. a diorama accent that
  changes per which choice was taken within a room, the way ANAMNESIS's
  `marys-room`/`open-drawer` diorama-accent hook works
  (`dioramaAccentHooks`) — needs a decision: either (a) extend
  `dioramaAccentHooks` to more LIMERENCE rooms (cheap, reuses existing
  infra), or (b) give more rooms their own bespoke diorama entirely
  (expensive, ~1 diorama per room × up to 28 more rooms). Recommend (a)
  as the pragmatic middle ground unless told otherwise.

---

# Dev-log location note (2026-07-16)

This file's role as the append-only development log effectively ended on
2026-07-13, with the `v1.0.0-rc.1` final-release review. Everything since
— the diorama-parity passes, the fullscreen-persistence work, the
graphics/visual-rework sessions (including Phase V's standardized fixture
kit), and each session's honest found-but-not-fixed notes — is logged in
**`docs/development/13-master-development-plan.md`**, which is the single
living plan-and-log document going forward. This note exists so nobody
reads the entries above as the end of the project's history; nothing above
this line has been altered.
