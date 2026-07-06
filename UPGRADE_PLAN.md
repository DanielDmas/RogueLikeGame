# ANAMNESIS — Upgrade Plan & Development Roadmap

> **This is the living tracking file for all further development of ANAMNESIS.**
> Each work item has a checkbox. As features land, boxes get checked and remarks
> are added inline. New milestones append new phases at the bottom. Shipped
> milestones are condensed to short summaries to keep the file readable — full
> detail lives in git history — but **open items are never deleted**.

**Current milestone: 5 — THE DEEPER FACILITY (in progress, see bottom of
file — S1, K, L, N, M shipped; O partial (Act I content only — Acts II–IV
are a v0.2.0 release gate); next up: O completion, hardening batch
(S6/S7/R8/R9), P, Q, R, S2–S5).** A full production review (2026-07-06)
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

- [ ] P1. Ledger screen (title + pause): runs, rooms, endings, hearts lost,
      most-walked door, keepsakes, descents, examined runs
- [ ] P2. Twelve quiet epiphanies — Ledger + one soft end-screen line only

## Phase Q — Visual & audio overhaul (spec `07-visual-and-audio-overhaul.md`)

- [ ] Q1. Room dioramas (`dioramaFor` factory; silhouettes + light; disposal
      leak-tested; act-theme fallback)
- [ ] Q2. Doorway light-spill during the walk-through
- [ ] Q3. Title polish: version number, fog parallax, epitaph wall (2+ endings)
- [ ] Q4. Door hover emissive pulse + pre-walk brighten
- [ ] Q5. Audio deepening: convolver reverb bus, heart-loss tail, per-door
      hover pitch, ~4 s act crossfades, three room accents
- [ ] Q6. The Usher's lantern (leans toward the hovered/chosen door)

## Phase R — Platform, language & engine health (spec `08-platform-localization-engine-health.md`)

- [ ] R1. GitHub Pages deploy workflow + play-in-browser link + favicon/tab title
- [ ] R2. Electron polish: icon, window-state memory, single-instance lock
- [ ] R3. Czech **and Farsi** quality pass — idiomatic reframing, terminology
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
- [ ] R4. German + French packs — **lowest priority; may slip to M6**
- [ ] R5. Content-pipeline validation tests + "twenty rooms" continuity fix
- [ ] R6. Dead-flag audit: every set flag gains a reader (CI-enforced).
      **Wording extended per production review (doc 11, §A4):** implement as
      a *generated registry test*, not a one-off — collect every
      `effects.flags` writer and every `hasFlag`/`choseIn`/`choseInPrior`
      reader from content+engine, assert the sets match (explicit allowlist
      for intentional one-ways). The registry then *is* the test and cannot
      rot. Also record the Usher invariant here: he reads state, never
      changes it (docs README convention 9).
- [ ] R7. Persona whisper pass: exactly four `{name}`/blurb touches, never on
      door screens

### Production-review additions (2026-07-06 — see `docs/development/11-production-review.md`)

- [ ] R8. **Save integrity:** `Profile.schemaVersion` int; keep the previous
      good payload under a `:backup` localStorage key on each successful
      load; on parse failure restore from backup (quiet one-time title
      notice), only then fall back to defaults. Capture a real
      `v0.1.5-v2-beta` profile blob as a committed migration fixture.
      Binding rule (docs README convention 9): never rename/re-type a
      persisted field without a version bump + fixture test.
- [ ] R9. **Profile export/import** in Settings → Data: download the profile
      as JSON; paste-import with a confirm step. Doubles as the player
      backup, cross-build (web ↔ Electron) transfer, and bug-repro channel.
- [ ] R10. **Citation-accuracy audit** of every field note and ending note:
      verify each named attribution/quote; soften anything unverifiable
      into honest paraphrase. EN first; propagate to cs/fa inside R3.
- [ ] R11. **Documentation refresh:** root `README.md` (30+3 rooms; endings
      phrased without spoiling the display rule — "six endings, and rumors";
      Act V; fix the release procedure to the proven `workflow_dispatch`
      path — tag pushes 403 here; add target session length, a one-line
      content-sensitivity note, the 1280×720 @ ≤130 % zoom support floor;
      confirm `dist/` is gitignored). Create `CHANGELOG.md` and backfill one
      line per released version. (docs/development/README status line
      already fixed with the review.)

## Phase S — Testing, UAT & release (spec `09-testing-and-release.md`)

- [x] S1. `?uat=1` test mode (typewriter off, fast tweens, gated debug handle
      incl. `jump`/`doorRects`/`fps`) — **built first**. `src/engine/uatMode.ts`
      + wiring in `main.ts`/`flow.ts`/`director.ts`/`doors.ts`/`toast.ts`;
      `__APP_VERSION__` vite define added (also serves Q3.1 later). Verified
      live: handle absent on normal boot, present + correctly shaped under
      `?uat=1`, `jump('junction')` reloads straight into Act II at the right
      stage with zero console/page errors.
- [ ] S2. Milestone 4's deferred verification debt cleared: layout sweep,
      scenery proof, door-visibility sweep, transition-garble check, troll
      test, i18n matrix — all as committed `scripts/uat/` scripts under the
      3-minute rule
- [ ] S3. Feature→test traceability matrix green (~240+ tests expected)
- [ ] S4. Full regression + owner feel-pass (charter checklist)
- [ ] S5. Release v0.2.0-beta EXE + first Pages deploy; checkboxes updated.
      **Release blockers extended per production review (doc 11, §B4):**
      S6/S7 done · R8 backup live · Phase O release gate satisfied (Acts
      II–IV reflections authored, EN+CS+FA) · README + CHANGELOG current
      (R11) · real-v0.1.5-profile migration fixture green · charter
      feel-pass signed · one Electron boot smoke test.
- [ ] S6. **Recovery overlay (stability hardening, doc 11 §A13):** global
      `error` + `unhandledrejection` + `webglcontextlost` handlers → one
      calm, in-fiction recovery panel ("The facility flickers. Your file is
      safe.") with a return-to-title action. Safe by design: the profile is
      always persisted at the last checkpoint, so recovery loses nothing.
      Charter-compliant (quiet, one interaction, no technical jargon in the
      player-facing copy).
- [ ] S7. **Committed UAT suite (doc 11 §A10):** move the five stable
      Playwright scripts out of the ephemeral scratchpad into `tests/uat/`
      (title/onboarding + auto-About, save/reload/continue, examined path,
      keepsakes + shelf, anamnesis) with a README (run instructions,
      3-minute budget each per CLAUDE.md). Includes fixing `jump()` into
      Act IV to backfill the preceding `ACT4_SEQUENCE` rooms into `visited`
      (mid-milestone review item 7) so scripts stop hand-seeding it.

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
