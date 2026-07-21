# Game-Experience Review — full-development audit (2026-07-19)

**Scope and method.** Owner-requested review of the whole development with a
player-experience focus: a code review of the timing/flow-owning paths
(`engine/flow.ts`, `ui/textPanel.ts`, `ui/choices.ts`, `ui/toast.ts`,
`ui/recovery.ts`, `scene/director.ts`, `scene/doors.ts`, `styles.css`), a
dedicated verification of the end-of-act headline's on-screen duration, a
full animation inventory (durations, reduced-motion coverage, settle-class
coverage), and a player's-eye sweep for blank spots across onboarding,
mid-run resume, gates, endings, keepsakes, discoverability, and error
states. **Nothing was coded in this pass** — findings only, with the fix
recommendations recorded here for a future coding session. Every claim
below was verified against the live source (file:line cited), not taken
from memory or prior docs.

---

## 1. The act headline (interlude) — VERIFIED: it does not stay long enough

The owner asked specifically whether the act headlines stay up long enough.
They do not. The full measured sequence for a mid-run floor change
(`flow.ts syncTheme()`, ~633-658):

1. `fade(true)` — veil to opaque, 720ms (250ms CSS under reduced motion).
2. `setInterlude(floorName)` — `.show` added; the card's own CSS fade-in
   is **300ms** (`styles.css` `.interlude`, transition to opacity 0.85).
3. `await 260ms * speedMultiplier` (`flow.ts:651`) — the only hold.
4. `clearInterlude()` (`flow.ts:652`) — `.show` removed.
5. `fade(false)` — veil fades out, 720ms.

Three compounding problems:

- **The hold (260ms) is shorter than the card's own fade-in (300ms).** The
  headline is cleared *before it finishes appearing* — it never reaches its
  target opacity at all, then immediately begins its 300ms fade-out. Total
  perceptible presence: roughly half a second, all of it mid-fade.
- **It is cleared before `fade(false)` begins**, so it does not ride the
  veil's fade-out. The design comments (`flow.ts:139-143`,
  `styles.css` above `.interlude`) both state the card "fades with the
  veil automatically" — that was the intent, but calling `clearInterlude()`
  *before* `fade(false)` defeats it. The card dies alone on a still-black
  screen; the veil then fades revealing nothing.
- **Localized floor names are longer than English** (Czech/German
  especially, and Farsi is read RTL) — even a hold adequate for "The
  Understory" would be tight for its translations.

**Why no test ever caught this:** under `?uat=1` the hold is
`260 × 0.25 = 65ms` (`uatMode.ts speedMultiplierFor`) — structurally
invisible to every screenshot in the UAT suite. Pacing generosity is
exactly the dimension UAT's 4x speedup erases; see §6.

**Recommended fix (not coded):** hold ~1,200-1,600ms (× speedMultiplier);
move `clearInterlude()` to *after* `fade(false)` resolves (or clear only
the text after the veil is transparent), so the card genuinely fades out
with the veil as designed. Keep the 260ms constant out of reduced-motion
scaling — a text hold is not motion, and shortening reading time under
reduced motion would be backwards. Mitigating context, so this is judged
polish rather than data loss: the act name reappears as the title of the
act-intro text panel (`flow.ts:656`) and in the HUD act label, so the
player is never information-deprived — the cinematic beat is just nearly
subliminal today.

## 2. Animation audit — inventory and two findings

Verified item by item against `styles.css`, `choices.ts`, `director.ts`,
`doors.ts`, `toast.ts`, `textPanel.ts`:

| Animation | Duration | Reduced-motion | Verdict |
|---|---|---|---|
| Veil fade | 700ms CSS / 720ms JS wait | 250/280ms | OK (JS outlasting CSS is intentional) |
| Interlude card | 300ms in/out, 260ms hold | n/a (opacity only) | **Finding §1 — hold too short** |
| Choice-card rise | 450ms + 70ms stagger | 150ms | OK — `.settled` fix + `animationend` wiring + mechanical lint (`animationSettleLint.test.ts`) all present |
| LIMERENCE card scan (`::after`) | 600ms | removed | OK |
| End-screen triptych lines | 1.2s rise × 3, 0.5s/1s delays | **none** | **Finding A1 below** |
| End-screen `.fade-in` | 1.4s | 250ms | OK |
| Explain "?" pulse | 3.2s loop | removed | OK |
| Advance-hint pulse | 2.4s loop | removed | OK |
| Field-note slide | 700ms | 200ms | OK |
| Toasts | 20ms in, ~1.7s hold, 420ms out | 0/½ hold/120ms | OK |
| Typewriter | 2 chars/11ms ≈ 180 chars/s | skippable; instant on reread; aria-live handled | OK |
| Camera dolly (door crossing) | 2.0s | instant | OK |
| Usher walk-in | 2.5s | skipped | **Finding A2 below** |
| Door hover pulse/spill | continuous | static values | OK |
| Title fog parallax | continuous | respected | OK |

**A1 — the end-screen triptych is the only animation in the stylesheet
with no reduced-motion override.** `.triptych .line` runs `rise 1.2s
forwards` with 0.5s/1s stagger (`styles.css:757-762`); every sibling
animation has a `.reduced-motion` rule, this one does not. A
reduced-motion player waits ~2.2s for the axis lines to finish appearing
on every ending. Small, but it is a stated charter guarantee ("fully
removed under .reduced-motion" is even quoted in this same file for the
LIMERENCE scan effect). Fix: add `.reduced-motion .triptych .line
{ animation-duration: 0.2s; animation-delay: 0s; }` (delays must be
zeroed too, or the stagger survives).

**A2 — the Usher's walk-in is cut off mid-stride, visibly. ✅ FIXED
(2026-07-19).** During a door crossing, `walkThrough` started a 2.5s Usher
walk toward the chosen door (`USHER_WALK_SECONDS`, `director.ts:102,577`)
but the camera dolly completed at 2.0s (`CAMERA_DOLLY_SECONDS`,
`director.ts:104`), and the dolly's `done` callback (`director.ts:590-598`)
immediately overwrote the walk with the walk-home tween from wherever the
Usher currently stood — at ~80% of its approach. The `fade(true)` that
follows takes 720ms, so the player watched the guide reverse direction
mid-stride for most of a second before black. Fixed by the first of the
review's own two options: `USHER_WALK_SECONDS` lowered to 1.8s, comfortably
under the 2.0s dolly, so the approach walk always finishes — with a beat to
spare — before the dolly's `done` callback ever fires and starts the
walk-home tween. Guarded by a new source-shape test in
`usherMotion.test.ts` asserting `USHER_WALK_SECONDS <= CAMERA_DOLLY_SECONDS`
so the two constants can't silently drift apart again.

## 3. Player-experience blank spots (a second, independently-run sweep)

Ordered by player impact. E-numbers are the tracking ids for a future
coding session.

**E1 — mid-room resume replays the whole floor intro, then drops the
player mid-scene cold. ✅ FIXED (2026-07-19).** On reload, `currentTheme`
started at `-1`, so the first `syncTheme()` re-ran the interlude, the full
act-intro paragraph, and (if opted in) the Socratic aside — even when the
player was resuming *mid-room*, having already heard all of it earlier the
same run. `enterRoom` then resumed at the saved stage with no recap of
what happened before the reload — worse, because every room in both packs
has exactly one stage, a resume that lands after the room's single choice
was applied (`currentStage` bumped to 1, `>= room.stages.length`) skipped
the *entire* remaining stage loop, silently eating the outcome beats and
dropping the player straight onto the field note.

Fixed: `Game` now tracks a `resumedFromSave` flag, set only when `state`
is loaded from a saved `profile.run` (the "continue" title action or the
UAT `jump()` autocontinue path), consumed exactly once by `runLoop`'s
mid-room (`pending`) branch. `syncTheme(resuming)` keeps the interlude
(still a good "here's where you are" re-establishment) but returns before
the act-intro paragraph and Socratic aside when resuming — they were
already heard before the reload. `enterRoom(room, resuming)` shows a new,
translated "resumed-mid-room" bark (mutually exclusive with the existing
cross-run "remembered-room" bark) whenever `resuming && startStage > 0` —
exactly the window where the stage loop is about to skip straight to the
field note with no other on-screen trace that this was a resume, not a
fresh arrival. Between-doors resumes (no pending room) are left alone —
hearing the act's own re-establishment again right before picking a new
door is a natural moment, not a redundant one.

New pack-guide field `resumedMidRoomBarkFallback`, translated in both
packs × cs/de/fa/fr (8 files), voice-checked against cross-pack leaks.
Covered by `src/test/resumedMidRoom.test.ts` (13 source-shape tests) and
live-verified with a new committed UAT script,
`tests/uat/42-mid-room-resume-recap.mjs` — a real jump-into-room →
click-a-choice → reload → continue repro confirming the Act I intro text
never reappears and the recap bark shows before the field note.

**E2 — the prologue's single door says "Choose a door. Every one of them
is yours."** The single-door gate bark is gated on `visited.length > 0`
(`usher.ts:22`), so the run's very first door — always alone — falls
through to the generic-pool bark (`usher.ts:68`) while the door-help line
correctly says "this is the only way forward" (`choices.ts:152`). The
game's first interactive moment contradicts itself. One-line predicate
fix.

**E3 — a doubly-corrupt save silently wipes progress. ✅ FIXED
(2026-07-19).** If both the primary save and its `:backup` fail to parse,
`localSave.ts:33-45` returns `defaultProfile()` with no signal; the
restored-from-backup toast only covers the single-corruption path
(`main.ts:61`). A returning player saw a blank "Begin" title and zero
notes with no explanation. Fixed: `LocalSaveStore` now tracks a
`wasReset()` flag, set only on the true double-failure fallback path (not
on first-ever boot, not on a successful backup restore); `main.ts` shows
a dedicated `showProfileResetToast()` ("Your save could not be read, even
from its backup, and had to be reset...") when it fires, translated in
all 4 languages (cs/de/fa/fr) as pack-neutral UI chrome alongside the
existing `restoredFromBackup`/`saveFailed` keys. Covered by 5 new tests
in `saveIntegrity.test.ts` (both-corrupt, primary-corrupt-no-backup,
fresh-boot-not-flagged, clean-load-not-flagged, flag-clears-on-next-clean-
load).

**E4 — the end screen offers only Walk again / Field Notes / Title. ✅
FIXED (2026-07-19).** No Settings, no Register/Ledger, no Vestibule
switch — all natural post-run desires, all previously a bounce through
Title. Fixed with the minimum worthwhile addition the finding itself
proposed: `showEndScreen`'s action set grew `'settings' | 'vestibule'`
(mirroring `openPause()`'s own handling exactly — Settings reshows the end
screen afterward via `continue`, Vestibule persists and navigates away,
both reusing the existing `uiKey('settings')`/`uiKey('vestibuleButton')`
strings already translated ×5 languages elsewhere). Vestibule stays
dev-gated (`!import.meta.env.DEV`), same as every other Vestibule button
in the app. Live-verified: `tests/uat/44-end-screen-settings-vestibule.mjs`
reaches a real end screen, opens Settings from it, and confirms closing
Settings returns to the same end screen rather than losing it.

**E5 — keepsakes are invisible as a held resource. ✅ FIXED
(2026-07-19).** Earned silently by design (`flow.ts:838-844`), carried
only into the next run (`flow.ts:261-263`), and the only in-run surface
was the `✧` mark on a choice card at the moment of spending
(`choices.ts:82-89`) — nothing ever told the player they were *carrying*
one, and nothing confirmed what spending it did. Fixed with both of the
finding's own Charter-compatible suggestions: (1) the end screen's
Morning Report block now lists "you carried" — the keepsakes
`RunState.keepsakesHeld` was stamped with at run start, resolved to their
translated display names; (2) a new quiet `showKeepsakeSpentToast()`
("✧ Spent: {name}") fires the instant a keepsake-spending choice resolves,
the same toast pattern already used for save/restore notices. New
`uiKey('keepsakesCarriedHeader')`/`uiKey('keepsakeSpentToast')` strings,
translated ×4 languages with register matched to the existing
`keepsakeChoiceTooltip` neighbor. Live-verified: `tests/uat/
43-keepsake-spent-toast.mjs` (seeds a keepsake, spends it, reads the real
toast text) and the "you carried" half of `44-end-screen-settings-
vestibule.mjs`.

**E6 — three modal panels stack before a first-time player's first beat**
(About → Persona → Examined Path, `flow.ts:574-601`), and the Examined
Path offer (`overlays.ts:830-836`) asks for a commitment the player cannot
yet picture — it references "each significant choice" and a "clerk" before
they've seen either. Candidate: defer the Examined offer to after the
first significant choice of a first-ever run (its own natural teaching
moment), or fold it into the end of the persona panel. Design tension
acknowledged: all three panels are individually justified; it is the stack
that's heavy. **OWNER DECIDED (2026-07-20): defer the Examined Path
offer.** Full implementation plan in §8 below — planned, not yet coded.

**E7 — the crash-recovery overlay's reload drops fullscreen.**
`recovery.ts:19` calls `location.reload()` directly instead of the
fullscreen-preserving path every other reload uses (`flow.ts
reloadPage()`, `rememberFullscreenForReload`). Two-line fix; the exact bug
class the fullscreen-stability work eliminated elsewhere.

**E8 — the hidden 7th ending has zero hint surface** (`endings.ts:32-42,
74-76`; codex hides it, `overlays.ts:969`). Deliberate — but even for a
codex-completionist veteran there is no whisper that a seventh exists.
Owner call, explicitly not a recommendation to change: if any surface is
ever wanted, the quietest candidate is the Ledger's endings denominator
switching to "6 of 6, and one page uncounted" once codex completion is
near. Recorded so the silence stays a decision, not an accident.

**E9 — accepted pack differences, recorded as decisions:** light mode is
LIMERENCE-only (`supportsLightTheme`), the age advisory/safety layer is
LIMERENCE-only, ANAMNESIS's dark tone is authored (`13-master…` "decided
against"). Not gaps; listed so future reviews stop re-flagging them.

**Checked and clean** (both sweeps, no issue found): mid-run single-door
gates explain themselves; Ledger/Register/Codex are discoverable from both
title and pause menus; WebGL context loss and storage-quota failures have
player-visible handling; no empty dead-air stalls beyond §1; door-help,
first-heart-loss, and remembered-room flows behave as designed;
remembered-state typewriter flags are correctly restored (`flow.ts:
907-910`); end-screen loop (again/codex/title) state-cycles correctly
including the Examined re-offer.

## 4. Pacing measurements (recorded, no change recommended)

A door crossing is strictly sequential (`flow.ts:727-732`): dolly 2.0s →
fade-in 720ms → fade-out 720ms ≈ **3.44s per crossing**, ~15-18 crossings
per run ≈ ~55s of pure transition. Deliberate, unhurried, and each phase
is visually filled; under reduced motion it collapses to ~560ms. Recorded
so the number is a choice: if a future playtest reports it as sluggish,
the cheapest 720ms comes from starting `fade(true)` during the dolly's
final approach rather than after it.

## 5. Code-review notes (engine health, non-experience)

The flow/UI/scene read did not surface new correctness bugs beyond
E3/E7 above. Standing observations re-confirmed: `flow.ts` at ~1,100
lines remains coherent but is at its agreed split-if-a-third-pack-lands
threshold (B6); the persist chain, listener cleanup on every panel exit
path, material disposal, and the settle-class lint all held up under
re-reading; `main.ts`'s boot ordering (advisory → persona → examined) is
the E6 item, not a defect.

## 6. Test blind spot worth recording

The UAT suite runs everything at 4x (`speedMultiplierFor`), which is
correct for its purpose but makes *pacing generosity* — holds, dwell
times, read-time adequacy — structurally untestable there: the interlude's
65ms-under-UAT flash looked identical to a 6-second hold in every
screenshot sweep this project has ever run. Pacing constants should be
guarded the way the settle-class is: a fast unit test asserting the
constant itself (e.g. interlude hold ≥ 1,200ms, toast hold ≥ 1,500ms)
rather than a browser observation. One small test file covers the whole
class.

## 7. Recommended order for the fixing session

**Progress (2026-07-19):** items 1-3 below are done and pushed. Item 1
landed in commit `12b2b7d` alongside item 2 (batched together, all small
diffs touching the same "one-run session" pass); item 3 (E3) landed
separately once its own translation + test work was complete.

1. ✅ §1 interlude hold + clear-after-fade (the asked-about item; smallest
   diff, biggest per-run visibility) + the §6 pacing-constant guard test.
2. ✅ E2 prologue bark predicate (one line), E7 recovery reload (two lines),
   A1 triptych reduced-motion rule (one rule).
3. ✅ E3 double-corruption notice.
4. ✅ E1 resume experience (intro suppression + recap) — the largest item,
   worth its own focused pass with UAT coverage of quit/resume.
5. ✅ E4 end-screen options, E5 keepsake visibility — small UI additions,
   translated ×5 languages, so batch them together with R1 care.
6. ✅ A2 Usher walk truncation — cosmetic, lowest priority.
7. E6 onboarding stack — ✅ design decision made (owner, 2026-07-20:
   defer the Examined Path offer); implementation planned in §8, not yet
   coded. This is the review's one remaining open coding item.

## 8. E6 implementation plan (owner decision 2026-07-20: defer the offer)

The owner chose the review's first candidate: keep About + Persona at the
start of a first-ever run (both quick, both genuinely needed before
play), and move the Examined Path offer to right after the first
significant choice — its own natural teaching moment, once the player
has actually seen what a "significant choice" looks like. This section
is the ready-to-implement design; every fact below was verified against
the code on 2026-07-20.

**Design.**

1. **Arm the deferral only on a genuinely first-ever run.** In `start()`'s
   `'new'` branch: when `profile.runsCompleted === 0`, skip
   `showExaminedPathOffer` entirely and build the run with
   `examined: false` plus a new `examinedOfferPending: true` flag.
   Returning players (`runsCompleted > 0`) and the end screen's "Walk
   again" path keep the offer at run start, completely unchanged — the
   stack was only ever heavy on a true first run, because About and
   Persona only auto-show then.
2. **Persist the pending flag on `RunState`** (`examinedOfferPending?:
   boolean`, optional/additive — same no-version-bump precedent as
   `keepsakesHeld`; old saves hydrate it as undefined and are unaffected,
   since any pre-change save already had its offer at run start). An
   instance field would lose the deferral on quit-and-resume: either the
   player would silently never be offered (flag lost), or a
   re-arm-on-continue heuristic would re-nag a player who already
   declined. The persisted flag gives exactly-once semantics across
   reloads for free.
3. **Fire at the first reflections-bearing choice.** In `enterRoom`,
   after a choice's outcome beats finish and *before* the existing
   `shouldShowReflections` check: if `state.examinedOfferPending &&
   choice.reflections?.length && !this.oneDoorMode` — clear the flag,
   `text.hide()`, show the existing `showExaminedPathOffer` overlay
   (reused verbatim, zero new translated strings), write
   `settings.examinedPathDefault`, set `state.examined` from the answer,
   persist. Because the block sits before `shouldShowReflections`, an
   accepted offer pays off *immediately*: the very choice that prompted
   it shows its reflection card — the clerk the overlay describes appears
   the moment the player says yes.
4. **"First significant choice" = first choice with reflections** — the
   Examined Path's own definition of significance (`shouldShowReflections`
   gates on `choice.reflections`). Verified: neither pack's prologue
   choices carry reflections, and Act I coverage is deliberately partial
   (ANAMNESIS ~21 of 31 choices, LIMERENCE ~29 of 33), so the offer fires
   in the player's first Act I room or, rarely, a later one — acceptable;
   it fires at the first moment it can demonstrate itself.
5. **Accepted trade-off — the Act I Socratic aside is skipped on that
   first run.** `shouldShowSocraticAside` needs `state.examined`, which is
   still false at the act 0→1 transition where the Act I aside fires;
   Acts II–IV asides show normally after a mid-Act-I opt-in. Inherent in
   any deferral past the act intro; record it in the code comment so it
   reads as a decision, not a bug.
6. **One Door mode never arms the flag** (its `newRun()` call doesn't set
   it) — plus the explicit `!this.oneDoorMode` guard in the firing
   condition, matching the existing consolidated-gate convention there.

**Test/verification work, itemized.**

- New `src/test/examinedDeferral.test.ts`: (a) `newRun` propagates the new
  field; (b) hydration of an old save without the field; (c) source-shape
  checks — the first-run `'new'` branch does not call
  `showExaminedPathOffer`, and `enterRoom`'s deferred-offer block sits
  before the `shouldShowReflections` check (same convention as
  `resumedMidRoom.test.ts`).
- `tests/uat/01-title-onboarding.mjs`: currently asserts the offer DOES
  appear on a fresh run (line 35) — invert to assert it does *not*
  appear before the prologue.
- `tests/uat/19/20-*-door-choice-flow.mjs`: both click "Walk plainly"
  during onboarding (lines 28/27) — remove that step; the flow reaches
  the prologue door one modal sooner.
- New UAT script (or an extension of 19): first-ever run → first
  reflections-bearing choice → offer appears → accept → the same
  choice's reflection card renders with all 4 traditions.
- `tests/uat/03-examined-path.mjs` is unaffected — verified: it patches
  `run.examined` directly in localStorage rather than clicking the offer.

**Effort:** small-medium — one `flow.ts` pass, one optional schema field,
three UAT script edits, one new test file, no new translations.

## 9. Post-fix-session sweep (2026-07-20) — new observations

**N1 — end-screen data goes stale across the new Settings button (minor,
introduced by E4).** Everything `showEndScreen` renders — the translated
ending title/epitaph (`flow.ts:1065-1068`), recap, pivotal choices,
doors-never-opened, keepsakes-carried, triptych — is computed once,
*before* the `for (;;)` action loop. E4's Settings button re-enters that
loop, so a player who switches language from the end screen returns to an
end screen still in the previous language until the next reload. Fix
plan: extract the data assembly into a small closure called on each loop
iteration (cheap — everything it reads is loop-invariant state), or fold
the recomputation into the `'settings'` branch. Cosmetic; batch it with
the E6 implementation pass rather than shipping alone.

**N2 — toast collisions: checked, clean.** The new keepsake-spent toast
(choice resolution) cannot realistically overlap the checkpoint "Progress
saved" toast (door chosen / room completed / settings saved) — the
moments are separated by click-gated outcome beats; the post-choice
persist is the silent variant (`persist()` without `showToast`). No
action.

**Status (2026-07-21): both §8's E6 plan and N1 above are ✅ FIXED**,
implemented exactly as scoped here, alongside the rest of that day's
review batch (R1-R4, S1-S4, H1-H3) — see
`16-full-review-2026-07-20.md` §11 for the full fixed-batch writeup,
test coverage, and live UAT verification.
