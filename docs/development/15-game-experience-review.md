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

**A2 — the Usher's walk-in is cut off mid-stride, visibly.** During a
door crossing, `walkThrough` starts a 2.5s Usher walk toward the chosen
door (`USHER_WALK_SECONDS`, `director.ts:102,577`) but the camera dolly
completes at 2.0s (`CAMERA_DOLLY_SECONDS`, `director.ts:104`), and the
dolly's `done` callback (`director.ts:590-598`) immediately overwrites the
walk with the walk-home tween from wherever the Usher currently stands —
at ~80% of its approach. The `fade(true)` that follows takes 720ms, so the
player watches the guide reverse direction mid-stride for most of a second
before black. Cosmetic; options: walk duration ≤ dolly duration, or defer
the walk-home until the veil is opaque.

## 3. Player-experience blank spots (a second, independently-run sweep)

Ordered by player impact. E-numbers are the tracking ids for a future
coding session.

**E1 — mid-room resume replays the whole floor intro, then drops the
player mid-scene cold.** On reload, `currentTheme` starts at `-1`, so the
first `syncTheme()` re-runs the interlude, the full act-intro paragraph,
and (if opted in) the Socratic aside (`flow.ts:633-673`) — even when the
player is resuming *mid-room*. `enterRoom` then resumes at the saved stage
(`flow.ts:772,781`) with no recap of the beats already read in that room.
The two halves compound: a long speech they've already heard, then a scene
they've half-forgotten with no "where you were." Candidate fix: suppress
the act intro + aside when resuming into a pending room (the interlude
alone is arguably *good* re-establishment), and prepend a one-line
remembered-style recap (room title card already exists) — or resume at the
stage's first beat with instant-text replay of already-seen beats, which
`playBeats`' `maxSeen` machinery already supports in-session.

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

**E4 — the end screen offers only Walk again / Field Notes / Title**
(`overlays.ts:1318-1320`). No Settings, no Register/Ledger, no Vestibule
switch — all natural post-run desires, all currently a bounce through
Title. Minimum worthwhile addition: Settings and Vestibule.

**E5 — keepsakes are invisible as a held resource.** Earned silently by
design (`flow.ts:838-844`), carried only into the next run
(`flow.ts:261-263`), and the only in-run surface is the `✧` mark on a
choice card at the moment of spending (`choices.ts:82-89`) — nothing ever
tells the player they're *carrying* one, and nothing confirms what
spending it did. The Shelf lists earned keepsakes but not "with you this
run" (`overlays.ts:980-997`). Charter-compatible fixes: a quiet line in
the run-start (or Morning Report) surface — "you carry: the ticket stub" —
and a one-line outcome acknowledgement after a keepsake choice resolves.

**E6 — three modal panels stack before a first-time player's first beat**
(About → Persona → Examined Path, `flow.ts:574-601`), and the Examined
Path offer (`overlays.ts:830-836`) asks for a commitment the player cannot
yet picture — it references "each significant choice" and a "clerk" before
they've seen either. Candidate: defer the Examined offer to after the
first significant choice of a first-ever run (its own natural teaching
moment), or fold it into the end of the persona panel. Design tension
acknowledged: all three panels are individually justified; it is the stack
that's heavy.

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
4. E1 resume experience (intro suppression + recap) — the largest item,
   worth its own focused pass with UAT coverage of quit/resume.
5. E4 end-screen options, E5 keepsake visibility — small UI additions,
   translated ×5 languages, so batch them together with R1 care.
6. A2 Usher walk truncation — cosmetic, lowest priority.
7. E6 onboarding stack — design decision first (owner), then implement.
