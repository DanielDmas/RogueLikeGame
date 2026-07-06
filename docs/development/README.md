# Milestone 5 Developer Specifications

This directory contains the complete developer notes for Milestone 5 — **The
Deeper Facility** (target release: `v0.2.0-beta`). Each document specifies one
upgrade area to the depth needed for a developer agent with **no prior session
context** to implement it without asking questions. The roadmap-level view
lives in `UPGRADE_PLAN.md` at the repository root; these documents are the
ground-level detail behind its Milestone 5 phases.

**Status (updated 2026-07-06): implementation in progress.** Shipped: 09-S1
(uat mode), 01 (rooms), 02 (understory), 03 (seventh ending), 04 (keepsakes),
05 (examined path — content authoring now complete for every mandatory
DILEMMA/INSIGHT room across all four acts and the Understory, satisfying
its v0.2.0 release gate). Open: the hardening batch (S6/S7/R8/R9), 06, 07,
08, 09-S2…S5. Ground truth lives in `UPGRADE_PLAN.md`; read
`11-production-review.md` before starting any new phase — it carries the
audit findings and the hardening items it added to the plan (R8–R11, S6–S7).

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
| `09-testing-and-release.md` | S | The `?uat=1` test mode, feature→test traceability matrix, verification debt, release procedure |
| `10-experience-charter.md` | all | **Binding UX/beauty rules** every spec is implemented under, plus the owner's pre-release feel-pass checklist |
| `11-production-review.md` | all | **Production review (2026-07-06):** spec-completeness & release-readiness audit — findings, explicit assumptions, risks by severity, the added hardening items (R8–R11, S6–S7), release gates, and binding process rules (Definition of Done, architecture rules) |

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
6. **The Experience Charter (`10-experience-charter.md`) is binding.** Where
   any spec and the charter conflict, the charter wins and the conflict is
   reported to the owner. Its feel-pass checklist runs before every release.
7. **No feature without its tests.** Spec 09 §6 carries the feature→test
   traceability matrix; a feature is done when its matrix row is green, not
   when its code compiles.
8. **Definition of Done** (codified 2026-07-06 from six phases of practice —
   see `11-production-review.md` §A9). A *feature* is done when: spec
   conformance is checked against the open spec → `tsc` clean → full vitest
   green → live `?uat=1` browser verification (screenshots taken **and
   read**) → honest `UPGRADE_PLAN.md` entry (checkbox + what actually
   shipped + any deviation amended inline) → one-phase commit → push.
   A *release* is done per spec 09 S5 **plus** the review's blockers: S6/S7
   done, R8 backup live, README/CHANGELOG current, real-v0.1.5-profile
   migration fixture green, charter feel-pass signed.
9. **Architecture rules** (codified 2026-07-06, review §A6/A8/A11): content
   files may import **pure predicates only** from the engine — never
   side-effectful code, never ui/scene. No new subsystem logic inline in
   the `Game` class — pure helper module + tests first, `Game` only
   orchestrates; if `enterRoom` must grow again, extract a room controller
   first. The Usher **reads** state, never changes it. Persistence goes
   through `SaveStore` only. Never rename or re-type a `Profile`/`RunState`
   field without a `schemaVersion` bump and a captured-payload fixture test
   (R8). Unseeded randomness is allowed for cosmetics only.

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
