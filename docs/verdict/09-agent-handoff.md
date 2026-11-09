# 09 — Coding-agent handoff and ready-to-run implementation protocol

## Your role

You are implementing THE VERDICT in DanielDmas/RogueLikeGame. Read this document, VERDICT_PLAN.md and 00–08 in order **before altering implementation code**. Review the root CLAUDE.md conventions and the real repository head; docs are scoped design instructions, not substitutes for inspecting code.

The owner cares first about enjoying the creative process and the beauty/friendliness of the player experience. Do NOT convert this into generic React SaaS, a moral personality quiz, or a third philosophical roguelike. The project must be **fresh** and work without users knowing prior titles.

## Product constants

- Title THE VERDICT; tagline “Make the call. See what happens.”
- Three original launch Ripple episodes, in order: **The €200 Problem**, **The Unfair Promotion**, **The AI Shortcut**.
- Main mechanic: first choice → real immediate commitment → one meaningful common twist → context-sensitive final choice → authored outcome → opt-in human comparisons later.
- A Quick format and later asynchronous Decision Duel; no live multiplayer.
- A warm, tactile, mobile-first responsive magazine look. No dark courtroom, Gothic hallway, mandatory WebGL, moral score, harsh judgement or moralizing copy.
- No runtime LLM; deterministic authored outcomes.
- Standalone subpath within The Vestibule: /verdict/ plus direct episode deep links.
- Existing ANAMNESIS and LIMERENCE gameplay/save/build must be preserved.
- Real stats only; consent required before vote collection; sample size and bias always labelled.

## Stop after P1

Default implementation request from this planning branch is **P0 then P1 ONLY**. Do not autonomously implement P2–P5, select a billing backend or create production credentials. Record actual baseline tests first, then deliver the single playable vertical slice and request an editorial/visual review before expanding.

## Starter assignment for Claude Code (copy/paste)

    Implement P0 and P1 of THE VERDICT as specified in VERDICT_PLAN.md
    and docs/verdict/00–09. Begin by auditing the current git branch and
    running npm ci, npm test, npm run build:web. Preserve both legacy titles.

    Build a separate mobile-first TypeScript/Vite entry at /verdict/,
    with warm magazine-like UI, a pure deterministic choice/reveal/resolution
    reducer, isolated and validated local save, and the full authored
    Episode 001 (€200 Problem) with 3 first x 3 second decisions. The
    first decision must have an irreversible visible effect; ensure the
    cabin math is correct and nobody pays without consent.

    Write tests for all nine routes, state transitions, save/reload and
    direct-link navigation. Show screenshot-based mobile/desktop visual QA
    and note tests actually executed. Do NOT implement any voting backend,
    additional episodes or Decision Duel during this assignment.

    Prefer small code modules; don't refactor the legacy game. Create
    one focused commit per coherent unit. Report deviations and blockers
    rather than silently discarding requirements.

## Expected first PR / review checklist

- Separate /verdict/ renders in local dev and production output.
- An incoming direct link opens 001 without splash screen or prior app knowledge.
- First decision visibly sends/splits/advances money and survives refresh.
- Twist reveals job loss / ability-to-pay fact and Chris's finances (consistently).
- Second choice remains an action from current state, not rewind.
- All 9 outcomes are coherent, specific, numerically valid.
- Mobile (~360px), desktop, keyboard, reduced motion, focus and readable text work.
- No API, no user accounts, no invented comparison data.
- Existing tests/builds still run with recorded results.
- Owner can edit scenario data and inspect paths with dev-only story explorer.
- A human review finds the UI warm and lovely, not generic or gloomy.

## Agent process

1. **Read** repository sources and docs, find any drift from audit head.
2. **Plan bounded changes:** exact files, risks, tests, and definition of done.
3. **Implement** P0/P1 in focused slices.
4. **Verify** reducer tests, old suite/builds, browser screenshots and console.
5. **Report** changes, deviations, actual test commands, next steps.
6. **Wait for owner’s creative review** before implementing new story drafts, backend or Duel.

If a spec is contradictory or physically unworkable, document it as an ADR, explain options and make a minimal decision within the current phase. Do not “solve” uncertainty by changing the core creative direction.

## Git discipline

The planning branch is plan/the-verdict-development. Start implementation from this branch or a child feature branch; no forced push, no default-branch modifications without owner request. Keep the planning docs updated only for explicit design decisions, not to retroactively justify shortcuts. Do not treat a document-only commit as a working implementation.

## Collaboration notes

The owner plans to collaborate with Claude Code/Codex and ChatGPT. Write clean progress reports and link commits. For interface changes include a before/after screenshot and reason. For content changes include the specific route matrix altered. If the old engine suggests a different way of doing things, choose based on **THE VERDICT’s player experience**, not existing architecture convenience.
