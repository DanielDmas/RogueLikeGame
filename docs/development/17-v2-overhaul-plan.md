# The Vestibule v2 — Overhaul Work Plan

**Branch:** `claude/vestibule-v2-overhaul`
**Base:** `v1.0.0-rc.2-final` (commit `14d07f7`, tagged, on
`claude/philosophical-roguelike-game-zslw5n` — that branch is the stable
release and must not be modified further)

**Date:** 2026-08-01
**Current state:** `tsc` clean, 1262/1262 tests green, both packs
content-complete in en/cs/fa/de/fr, all troll testing complete, all
release blockers resolved, deployed to GitHub Pages.

---

## Purpose of this branch

The stable branch (`claude/philosophical-roguelike-game-zslw5n`) is the
final v1.0.0-rc.2 release candidate. This branch carries everything the
project planned but deliberately deferred — polish, new features, and
deeper rework that would have been inappropriate to squeeze into a
release-candidate stabilization cycle. Nothing here is a bug fix; every
item is an enhancement or a new capability.

---

## PHASE 1 — Small remaining polish batch (no new content, no translations)

These are the leftover items from the review docs that were individually
too small to justify their own session during the rc.2 stabilization, but
collectively represent real polish. Each is independently shippable.

### 1.1 P3 heavy-toggle live re-run
**Status:** verification debt — the Phase V graphics overhaul made the
theme toggle heavier (full scene rebuild on `setThemeMode()`), and the
plan explicitly said "re-run the P3 stale-paint UAT since this makes the
toggle heavier." Never done.
**Action:** write a focused UAT script that toggles theme mid-door-row
with the full scene rebuild path active, asserts no stale paint / no
console errors. If a bug surfaces, fix it.
**Files:** `tests/uat/`, possibly `src/styles.css` if a fix is needed.
**Est.:** small.

### 1.2 R7 persona-whisper test pack-parameterization
**Status:** test coverage gap — 3 of 4 ANAMNESIS touches tested in
en/cs/fa only, not de/fr; LIMERENCE's 4 touches have zero automated
coverage.
**Action:** extend `src/test/i18n.test.ts`'s R7 suite to be
pack-parameterized (both packs × all 5 languages × all 4 touches per
pack), add the missing 4th ANAMNESIS touch (`the-archive`'s `{blurb}`
echo).
**Files:** `src/test/i18n.test.ts`.
**Est.:** small.

### 1.3 S5 minor nits
**(a)** Settings language row: either re-render labels on locale switch
or soften the "applies immediately, everywhere" description.
**(b)** `voiceover.play()` gates on the enabled flag before setting
`src` — currently sets src + plays even when narration is disabled (the
bus mutes it, but it's a wasted fetch once real files arrive).
**(c)** Title menu button count monitoring — 12 buttons stack tall on
small viewports. Add a scroll/overflow guard or a compact layout.
**Files:** `src/ui/overlays.ts`, `src/audio/voiceover.ts`, `src/styles.css`.
**Est.:** small-medium.

### 1.4 S6 deliberate-behavior comment records
Record in code comments the deliberate design decisions that aren't
currently documented (Escape in Settings saves; persona Skip clears;
three-layer overlay Escape guards). Prevents future "fixes" for
non-bugs.
**Files:** `src/ui/overlays.ts`, `src/ui/fieldNote.ts`.
**Est.:** trivial.

### 1.5 Sconce legibility (B7)
The Long-Stay Wing's `sconceFixture` is present and lit (unit-tested)
but visually subtle at the default camera framing. Raise height or
intensity slightly.
**Files:** `src/scene/themes.ts`.
**Est.:** trivial.

### 1.6 Richer interlude (B7, optional)
The act-headline card currently shows only the floor name. The original
I3 sketch imagined a Porter/Usher line and a palette bleed toward the
next floor. Needs new translated content (1 line × 2 packs × 5 langs =
10 strings).
**Files:** `src/engine/flow.ts`, translation files.
**Est.:** medium (because of translations).

---

## PHASE 2 — Third content pack groundwork

### 2.1 `flow.ts` module split
Currently 1,116 lines. The architecture note says "split if a third pack
lands." The fixture kit already made a third pack cheaper; do the split
*before* the pack, not after. Natural seams:
- `flow-title.ts` — title loop, menu rendering, overlay orchestration
- `flow-run.ts` — the in-game run loop, room entry, door offering,
  ending evaluation
- `flow-persist.ts` — persist chain, profile mutation, save/restore
- `flow.ts` — the `Game` class shell, wiring the three together

**Files:** `src/engine/flow.ts` → split.
**Tests:** existing suite must pass unchanged (pure refactor).
**Est.:** medium.

### 2.2 ContentPack type audit for third-pack readiness
Verify every `ContentPack` field has a clear, documented contract. Audit
`packs/types.ts` for any field that's implicitly ANAMNESIS- or
LIMERENCE-shaped. Ensure a hypothetical pack with a different guide name,
different act count, different visual vocabulary, and no light-mode
support could be plugged in without engine changes.
**Files:** `src/packs/types.ts`, possibly type-only changes.
**Est.:** small.

### 2.3 Third-pack skeleton (if the owner picks a topic)
Create `packs/<pack-id>/` with the same skeleton structure as LIMERENCE.
The four candidate topics are already documented in the master plan
(§Tier 3 item 17): universal life-and-death decisions, modern business
dilemmas, high-stakes CEO/diplomat decisions, criminal/desperation
decisions. **Blocked on the owner choosing a topic.**
**Est.:** large (content authoring).

---

## PHASE 3 — Voice & music activation (T1)

### 3.1 Current state
The architecture is fully shipped and dormant:
- `src/audio/voiceover.ts` — manifest-driven, per-beat playback
- `src/audio/soundEngine.ts` — `musicGain` bus, streaming layer, act-slot
  crossfade over generative fallback
- `scripts/build-voice-manifest.mjs` — scans `public/voice/` and
  `public/music/` → `public/av-manifest.json`
- Settings rows auto-appear when the manifest is non-empty
- Landing page music toggle (wired, `assemble-web-dist.mjs` copies files)
- H3 bug fixed: URLs are document-relative, work on GH Pages and Electron

### 3.2 What's needed
**Only audio files.** Drop into:
```
public/voice/<packId>/<lang>/<key>.mp3
public/music/<packId>/<slot>.mp3
public/music/landing/vestibule.mp3
```
Run `node scripts/build-voice-manifest.mjs`. Done.

### 3.3 Preparation work (can do now, without files)
- Verify the manifest script still works end-to-end with a synthetic
  test file
- Write a smoke test that the voice/music Settings rows appear when the
  manifest has entries and don't appear when it's empty
- Document the exact naming convention in a `public/voice/README.md` and
  `public/music/README.md` for the owner's reference

**Blocked on:** owner supplying/recording audio files. Zero code needed
once files arrive.

---

## PHASE 4 — EN/CS/FA full-playthrough Playwright matrix (item 19)

### 4.1 What it is
The one verification-debt item that's been deferred since the original
review: a real end-to-end playthrough in each of the 3 core languages
(en, cs, fa), confirming that every room renders, every choice resolves,
every field note displays, and every ending fires, with no English
fallback leaking through.

### 4.2 Why it's been deferred
Long Playwright runs conflict with the 3-minute UAT cap. Needs a
re-scoped, split-script approach: one script per act per language (3
langs × ~5 acts = ~15 scripts), each ≤3 minutes.

### 4.3 Design
Each script:
1. Sets locale via profile seeding
2. `jump()`s to each room in the act in sequence
3. Asserts the text panel's content is not English (a simple
   `!englishFallbackDetected()` check against the room's known English
   source text)
4. Advances through all beats, clicks a choice, reads the field note
5. Zero console errors

**Files:** `tests/uat/` (new scripts).
**Est.:** medium-large (many scripts, but each is mechanical).

---

## PHASE 5 — LIMERENCE visual-language rework remainder (Tier 1 item 3)

### 5.1 Already shipped
- Per-floor corridor fixtures (departures board, locker walls, window,
  sconces) via the shared fixture kit
- The migrating window (the creative bible's signature image)
- Per-floor CSS accents in both light and dark modes
- Theme-mode-aware 3D scenes (the "morning read" — V2)
- Door frame hover glow
- All three ambient corridor sub-effects

### 5.2 What remains
**(a) Brighter 3D scene in light mode (the deeper rework).** The V2
"morning read" (fog lift + warmer key) shipped. The owner hasn't asked
for the full "inverted door/environment palette" idea. D1 (the 3D scene
stays dark in both themes) is a reasoned, documented decision. **Do not
build unless the owner explicitly asks.**

**(b) Per-floor dark-mode `--panel-edge` variation.** Currently flat teal
on every floor in dark mode. The `[data-act]` hook exists. Needs its own
WCAG derivation against `#0d1116`. Small.

**(c) Post-processing tuning.** Bloom/vignette/grain currently well-tuned.
Only touch with a specific visual complaint, not speculatively.

**(d) Door-creak sound (item 17 remainder).** Audio, not graphics.
`soundEngine.ts` already has the `doorCreak` infrastructure. Need a
per-pack tuning pass to ensure the creak reads as "hotel" not "dungeon"
in LIMERENCE. Small.

**Est.:** 5.2b is small; 5.2a/c/d are conditional on owner direction.

---

## PHASE 6 — New authored content

### 6.1 T5 — Porter/Usher pattern-barks expansion
**Already shipped:** 6 patterns, fully translated, both packs. The
system is designed for expansion — adding a new `PlayerPatternId` to
`engine/patterns.ts`, writing the detection predicate, and authoring the
prose in both guides is the whole cost.

Candidates for additional patterns (not yet scoped):
- `always-reads-field-notes` — a player who never skips
- `speedrunner` — consistently short transcript length
- `explorer-no-secret` — visited many rooms but never found the secret
- `keepsake-collector` — earned every keepsake across runs

**Blocked on:** owner deciding whether to expand.

### 6.2 Richer field-note articles
**Already shipped:** 2 per pack (4 total). The `articles` infrastructure
and `showRoomArticle` overlay are fully working. Extending coverage is
pure content authoring × translation.

### 6.3 Third content pack (see Phase 2)

---

## PHASE 7 — Mobile investment (Tier 3 item 16)

Decided out of scope for Milestone 5, unrevisited since. Would need:
- Touch controls (tap-to-advance, swipe for doors, pinch-to-zoom)
- Responsive layout for `<768px` viewports (text panel, choice cards,
  overlays, HUD)
- Performance pass for mobile GPUs (the `quality: 'low'` + fpsCap: 30
  defaults help, but mobile thermals are different)
- iOS Safari WebGL quirks audit
- PWA manifest for add-to-home-screen

**Blocked on:** owner deciding to pursue mobile.

---

## PHASE 8 — Commercial-store certification (Tier 3 item 15)

- PEGI/ESRB submission (the in-game age advisory already self-declares
  it's not an official rating)
- Windows code signing for the Electron `.exe`
- macOS notarization if a Mac build is added
- Steam integration (if pursuing that store)

**Blocked on:** a paid release being pursued.

---

## STANDING RULES (carried forward, binding on all work in this branch)

R1-R7 from the master plan (context-first translation, UAT conventions,
agent dispatch discipline, guide-word isolation, Definition of Done,
architecture rules, Experience Charter supremacy) all apply unchanged.

---

## RECOMMENDED WORK ORDER

```
Phase 1 (polish batch)          ← can start immediately, no dependencies
Phase 2.1 (flow.ts split)       ← can start immediately, pure refactor
Phase 2.2 (ContentPack audit)   ← after 2.1
Phase 3.3 (voice/music prep)    ← can start immediately
Phase 4 (Playwright matrix)     ← can start immediately
Phase 5.2b (dark panel-edge)    ← can start immediately, small
```

Everything else is blocked on owner decisions or external input (audio
files, third-pack topic choice, mobile go/no-go, commercial release
decision).

---

## VERIFICATION GATE (before any release from this branch)

1. `tsc --noEmit` clean
2. Full `vitest run` green
3. Full `tests/uat/run-all.mjs` batch pass (all scripts)
4. Production build smoke test (`47-dist-web-deploy-smoke.mjs`)
5. CHANGELOG updated
6. Version bumped appropriately
