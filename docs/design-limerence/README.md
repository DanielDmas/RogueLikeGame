# LIMERENCE — Design Specifications (second title on the ANAMNESIS engine)

**Status: design only. No implementation has started.** Implementation begins
only on an explicit owner command, milestone by milestone (see
`09-milestones-testing.md`).

## What this is

LIMERENCE is a second game built on the ANAMNESIS engine: a 2.5D roguelike of
doors and dilemmas about **relationships at their breaking points** —
infidelity, polyamory, jealousy, disclosure, coercion, drift. Cast aged 15–35.
Style: G.R.R. Martin (multi-POV, morally gray, nobody clean) × Maxime Chattam
(psychological dread, forensic patience) × modern psychology (Gottman, Glass,
Perel, attachment theory, CNM research — cited honestly in the field-note
apparatus the engine already has).

**Purpose:** players experience these traps *before* life springs them.
Perspective-taking as prevention. The game never moralizes: it lets you walk
into the trap, feel it close, and shows you the research on the way out.

These specs also define the **engine/pack split** (`08-engine-pack-
architecture.md`): the refactor that turns this repo into one content-agnostic
engine plus two content packs (ANAMNESIS and LIMERENCE), so any future
scenario set is a third pack, not a third codebase.

## How a developer agent should use these specs

Same contract as `docs/development/README.md` (Milestone 5): each spec is
written so an agent with **zero session context** can implement it without
asking questions. Follow the shared conventions below; when a spec and the
code disagree, trust the code and update the spec in the same commit.

## Reading / implementation order

| Doc | Contents | Implement in |
|---|---|---|
| `01-creative-bible.md` | Title, frame, the Night Porter, POV rotation, constellations, stat re-skin, acts/floors, tone rules | L2 (informs all) |
| `02-rooms-act1.md` | Prologue + Act I (ages 15–18, non-explicit): 7 rooms + gate | L2 |
| `03-rooms-act2.md` | Act II (18–24): 8 rooms + gate | L3 |
| `04-rooms-act3.md` | Act III (25–30): 8 rooms + secret + gate | L3 |
| `05-rooms-act4-understory.md` | Act IV fixed corridor + Records Office (understory) | L4 |
| `06-endings-keepsakes-epiphanies.md` | 7 endings, 4 keepsakes, 12 epiphanies, Examined Path re-skin | L4 |
| `07-psychology-sources.md` | The citation set + honesty rules for field notes | all content milestones |
| `08-engine-pack-architecture.md` | The `ContentPack` interface + coupling inventory + boot/build plan | **L1 (first)** |
| `09-milestones-testing.md` | L0–L6 roadmap, test plan, acceptance criteria | all |
| `10-safety-education-charter.md` | Content standards (minor/adult split), advisory layer, education framing | L2 + every content milestone |

## Shared conventions (binding)

- **Engine unchanged in meaning:** `hearts` = Trust, `lucidity` = Clarity,
  axes = Head↔Heart / Mine↔Ours / Grip↔Open, `memoryLost` = the burned
  Benefit of the Doubt. Schema fields are never renamed — packs re-label
  display strings only (see `08-…`).
- **Effects calibration mirrors ANAMNESIS:** lucidity awards 5–30; `hearts:
  -1` only on sign-posted, genuinely costly choices; axes ±4–15; flags
  kebab-case; keepsake earns via `KEEPSAKE_TRIGGERS`-style flag mapping.
- **Every stage has an `explanation`** ("?" button): plain language, no
  jargon, one everyday analogy — here it answers *"what does the research
  actually say about this situation."*
- **Field notes follow the R10 citation-honesty rule** (see `07-…`):
  contested claims get their critique in the same note; survey numbers stay
  soft; pop-psych folklore appears only labeled as folklore.
- **i18n:** English first; every string through the text catalog
  (`registerAll`/`t`) from day one so Czech (L6) is a pure content pass.
  CLAUDE.md's context-first translation rule applies to every future string.
- **Non-explicit hard line for Act I; frank-not-graphic for Acts II–IV** —
  the full standard is `10-safety-education-charter.md` and it overrides any
  more permissive reading of any room brief.
- **The Experience Charter** (`docs/development/10-experience-charter.md`)
  carries over whole: quiet UI, no grades, no dark patterns, endings are
  trades not verdicts.
