# Milestone 5 Developer Specifications

This directory contains the complete developer notes for Milestone 5 — **The
Deeper Facility** (target release: `v0.2.0-beta`). Each document specifies one
upgrade area to the depth needed for a developer agent with **no prior session
context** to implement it without asking questions. The roadmap-level view
lives in `UPGRADE_PLAN.md` at the repository root; these documents are the
ground-level detail behind its Milestone 5 phases.

**Status: specification only. Nothing here is implemented. Do not begin
implementation until the project owner explicitly commands it.**

## Documents

| File | Roadmap phase | Subject |
|---|---|---|
| `01-new-rooms.md` | K | Nine new rooms across Acts I–III, incl. one secret room |
| `02-act-five-the-understory.md` | L | The optional descent on repeat runs |
| `03-the-seventh-ending.md` | M | The hidden "Anamnesis" ending |
| `04-keepsakes.md` | N | The whisper-quiet keepsake bonus layer |
| `05-the-examined-path.md` | O | The opt-in reflective (plural ethics) mode |
| `06-ledger-and-epiphanies.md` | P | The Traveler's Ledger and quiet milestones |
| `07-visual-and-audio-overhaul.md` | Q | Room dioramas, light-spill, title polish, reverb |
| `08-platform-localization-engine-health.md` | R | GitHub Pages, Electron polish, Czech pass, DE/FR, cleanups |
| `09-testing-and-release.md` | S | The `?uat=1` test mode, verification debt, release procedure |

## Implementation order and dependencies

```
01 (rooms) ──► 04 (keepsakes; unlock sites live in 01's rooms)
                 │
                 ▼
02 (understory; builds the shared prior-run mirror) ──► 03 (7th ending; needs 04's
                 │                                       counters and 01's coverage)
                 ▼
05 (examined path)  ► 06 (ledger)  ► 07 (visuals/audio)  ► 08 (platform)  ► 09 (verify+release)
```

Recommended sequence: **01 → 04 → 02 → 03 → 05 → 06 → 07 → 08 (except DE/FR)
→ 09 → 08's DE/FR last (lowest priority; may slip to Milestone 6).**

Exception: `09`'s `?uat=1` test mode (section S1) should be built **first**,
before any other implementation, because every later phase's browser
verification depends on it.

## Shared conventions (binding for every spec)

1. **i18n in the same commit.** Every user-visible string ships with English,
   Czech, and Farsi together (`src/content/text/cs.ts` / `fa.ts`). The
   existing coverage tests (`translationCoverage.test.ts`,
   `uiKeyCoverage.test.ts`, `i18n.test.ts`) enforce this automatically; new
   key families must be added to whichever test scans them.
2. **Save-data migration by spread-merge.** New `Profile`/`Settings`/`RunState`
   fields must be optional or default-initialized so `{ ...defaults, ...parsed }`
   backfills legacy saves. No explicit migration code unless a field is
   renamed. (Pattern proven throughout Milestone 4.)
3. **Pure, exported helpers for anything that needs a test.** The vitest
   environment is `node` — no DOM. Any logic worth testing must be extractable
   from DOM-producing code (see `cameraZForDoors`, `translateFieldNoteForCodex`,
   `shouldRenderFrame` for the pattern).
4. **UAT rules** (from `CLAUDE.md`): browser test scripts hard-capped, split by
   concern, one repair attempt, ask before re-running.
5. **Honest tracking.** When work lands, update the matching checkbox in
   `UPGRADE_PLAN.md` — and never check a box for partially-done work without
   an amendment note.

## Decisions already made (do not re-litigate)

These were settled with the project owner via a 12-question review:

- New rooms **and** a new act — full content expansion.
- The Usher stays enigmatic: no backstory, no additional characters.
- The 7th ending is deeply hidden and independent of the Usher.
- Persona references expand only *slightly* — never on the door screens.
- Keepsakes are a gentle bonus and must not alter the core mechanics.
- No separate replay modes (no museum/daily/NG+ menu entries) — everything
  integrates into the one game organically.
- The Examined Path presents plural ethical readings **objectively**; it never
  grades, forces, or declares a single correct answer, and it is opt-in with a
  full explanation.
- Ledger + quiet Epiphanies; no loud achievement popups.
- GitHub Pages web release; no mobile investment this milestone.
- Czech gets a quality pass; German and French are wanted but explicitly the
  lowest priority of the milestone.
- Full visual overhaul: dioramas, light-spill, and title polish all in scope.
