# THE VERDICT - Implementation plan (planning baseline)

**Status:** SPECIFICATION ONLY. No application code has been implemented by this planning package.
**Target repository:** `DanielDmas/RogueLikeGame`
**Target base:** `claude/philosophical-roguelike-game-zslw5n` (the repository default branch when audited, 2026-11-09)
**Suggested feature branch:** `plan/the-verdict-development`
**Product:** THE VERDICT, the third independently playable experience in **The Vestibule**.
**Tagline:** *Make the call. See what happens.*

> **Start here, Claude Code / Codex:** Read this file, then every document in `docs/verdict/` IN ORDER before changing code. Begin with Phase 0 and Phase 1 only. Do not implement the whole roadmap in a single pass. Follow `CLAUDE.md` for existing repository conventions; this plan adds THE VERDICT-specific rules without weakening any existing constraints.

## Executive decision

Build THE VERDICT as a **new lightweight, warm, responsive, browser-first decision game** in the *same collection* as ANAMNESIS and LIMERENCE. Its **engine, pacing, visual design, content model and gameplay** are independent of the existing multi-act roguelike. Reuse selected foundations only if doing so genuinely reduces complexity. THE VERDICT is **not** an extra room, not a clone of `One Door`, and **not** a third implementation of the current `ContentPack` interface.

Players face short plausible situations, make a consequential first decision, see the initial effect, receive new information, then choose what to do next. The initial action cannot be undone. They see authored outcomes and can opt into comparing their choices with real participant data. Tone: inviting, surprising, intelligent, sometimes funny; not preachy or moralistic.

**Core game format:** Ripple Effect (roughly 90-150 seconds), supported by Quick Dilemma (30-60 seconds) and later Decision Duel (asynchronous two-person comparison).

**Original, locked first three episodes (from the owner's approved image and initial concept):**
1. **The EUR 200 Problem** - money, fairness, friendship.
2. **The Unfair Promotion** - merit, loyalty, information. A *different* story from ANAMNESIS's existing `promotion` room: a management dilemma about evaluation, team contributions and uncertainty, not sabotage or betrayal.
3. **The AI Shortcut** - trust, technology, responsibility.

**The Perfect Apartment** is a strong *fourth-episode backlog candidate*, not a substitute for the approved three. The previous discussion briefly proposed replacing Episode 2 with The AI Shortcut and Episode 3 with The Perfect Apartment; this plan deliberately restores the owner's explicit original lineup.

## Read in this order

| Document | Purpose |
| --- | --- |
| [`docs/verdict/00-vision-charter.md`](docs/verdict/00-vision-charter.md) | Audience, differentiation, creative goals, non-negotiable rules, success criteria |
| [`docs/verdict/01-player-experience.md`](docs/verdict/01-player-experience.md) | All flows, screens, edge states, Quick/Ripple/Duel and sharing |
| [`docs/verdict/02-visual-and-interaction-design.md`](docs/verdict/02-visual-and-interaction-design.md) | Warm art direction, responsive UI, motion/audio/accessibility |
| [`docs/verdict/03-episode-bible.md`](docs/verdict/03-episode-bible.md) | Three narrative specifications, complete choice grids, editorial rules |
| [`docs/verdict/04-engine-and-content-model.md`](docs/verdict/04-engine-and-content-model.md) | State machine, scenario schema, deterministic outcome resolver and versioning |
| [`docs/verdict/05-repository-integration.md`](docs/verdict/05-repository-integration.md) | Verified source audit, what to reuse/avoid, suggested folders/build integration |
| [`docs/verdict/06-social-results-and-privacy.md`](docs/verdict/06-social-results-and-privacy.md) | Anonymous comparison, minimal API/database, consent and anti-abuse |
| [`docs/verdict/07-development-roadmap.md`](docs/verdict/07-development-roadmap.md) | Phase-by-phase work tickets, dependencies, acceptance gates, realistic scope |
| [`docs/verdict/08-testing-and-release.md`](docs/verdict/08-testing-and-release.md) | Automated and human QA, performance, UX, deployment, go/no-go |
| [`docs/verdict/09-agent-handoff.md`](docs/verdict/09-agent-handoff.md) | Concrete implementation protocol and next coding-agent prompt |

## Source audit and caveat

The assessment was based on GitHub **repository files**, not a live rendered playtest. At the audit head `14d07f7077c9f7f718585f0b84c34ba5996f8305`, the code contains Vite + TypeScript + Three.js, ANAMNESIS and LIMERENCE content packs, a `Room.stages` system, a `Game` loop, a `One Door` mode, local saves, multilingual UI and many tests. Existing runtime code is mature but specialized for multi-act, door-led narrative play. See `05-repository-integration.md` for exact paths.

**Never silently modify, rename, delete, or migrate existing ANAMNESIS/LIMERENCE runtime, saves or content.** The existing `CLAUDE.md` remains binding. A new browser entry point, separate styles and separate persistence namespace are mandatory. The design is intentionally mobile-first, unlike the current desktop-biased, fixed-viewport presentation.

**Security before backend deployment:** the repository tree showed tracked `.env` and `.env.limerence` files. Do not display their content or assume they are safe. Privately audit any tracked environment files for real secrets and rotate compromised keys, without publishing values. All THE VERDICT secrets must stay server-side, outside git.

## First action for Claude Code

1. Checkout the planning branch (or a feature branch descended from it) and inspect the actual current repository. Run `npm ci`, `npm test`, `npm run build:web` **before** changes, recording pass/fail honestly. If blocked by environment, explain why.
2. Read all the documents above and document any contradiction as an explicit decision record, not as an unannounced redesign.
3. Implement **Phase 1 vertical slice only**: separate entry/build, warm UI, Ripple Effect state machine, Episode 001 with 3 initial choices x 3 second choices, deterministic contextual endings, replay and local persistence. Use no backend in Phase 1.
4. Run unit tests, regression tests and focused browser/visual checks. Preserve existing output paths `/anamnesis/` and `/limerence/`. Report the exact code changed and acceptance results.
5. Only then continue to Phase 2 (other episodes, Quick Dilemma); wait for product review before Phase 3 (collection of player votes).

## Scope guardrails

- A meaningful **first click in under five seconds**; no mandatory tutorial, persona, registration or moral quiz.
- No runtime LLM, no dynamic AI-written endings, no invented vote data.
- Initial choice must change the immediate situation and survive the twist.
- No universal good/evil score; no personality diagnoses or claims about general populations.
- Warm, beautiful, calm and accessible interface, not a dark courtroom or a second Gothic hotel.
- Prioritize authored quality of 3 episodes over a giant scenario library.
- No production backend credentials or collecting user data until Phase 3 consent/privacy review.
- Keep all project changes isolated and reviewable; never make broad refactors to existing packs for perceived elegance.

## Release definition

A direct LinkedIn link opens a specific dilemma on a phone. Within 2 minutes, a new player can make a choice, observe a consequence, learn a fact, choose again, see a meaningful authored outcome, optionally predict the crowd, and (with informed consent and sufficient votes) compare with real players. Their first choice has mattered. They can replay and share without sign-up. Both older titles still build and play unchanged.