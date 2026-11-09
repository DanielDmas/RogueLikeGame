# 05 — Verified repository audit and integration strategy

**Audit date:** 2026-11-09. **Base commit:** 14d07f7077c9f7f718585f0b84c34ba5996f8305 on default branch claude/philosophical-roguelike-game-zslw5n.
**Method:** inspected GitHub repository tree and source files. This is a code audit, NOT a runtime/browser visual verification. First implementation task includes baseline tests, build and screenshot review. Check for upstream changes before coding.

## 1. Existing production project

- Vite + TypeScript; vanilla DOM-based UI; Three.js rendering; Vitest; Playwright UAT; localStorage-based saves; Electron wrapper.
- Main runtime boot: src/main.ts; pack selection via __PACK__ build-time define and dynamic import.
- Two complete titles: ANAMNESIS (src/packs/anamnesis, older src/content), and LIMERENCE (src/packs/limerence). Both are long-form multi-act roguelike narratives.
- Shared contracts: src/packs/types.ts ContentPack; src/engine/schema.ts Room / Stage / Choice / RunState; src/engine/storyEngine.ts graph/doors; src/engine/flow.ts Game; src/ui/choices.ts ChoicePanel; src/ui/textPanel.ts; src/audio/soundEngine.ts; src/scene/director.ts.
- Existing standalone vignette feature: src/engine/oneDoor.ts plus Game.playOneDoor() in flow.ts. It draws a random eligible room, runs normal room logic then returns to title. Useful proof that micro-sessions are feasible, but it has no linked scenario URL, reversible-decision analysis, shared vote stats or warm mobile layout.
- Existing saves: src/engine/saveStore.ts and src/engine/localSave.ts; per-pack namespacing and a defined migration strategy. No telemetry under previous game commitments.
- Existing web: landing/index.html is a manually authored chooser page; scripts/assemble-web-dist.mjs copies the landing page and expects dist-web/anamnesis/index.html and dist-web/limerence/index.html; npm run build:web is the verified release assembly contract. GitHub Pages workflow .github/workflows/deploy-pages.yml publishes dist-web after npm run build:web. Windows Electron packaging consumes the same dist-web output.

## 2. Fundamental mismatch if Verdict became another ContentPack

Existing interface requires multiple act pools/gates, endings, hooks, guide, specific visuals and audiovisual abstractions, keepsakes/epiphanies, and their tests. src/engine/flow.ts drives heart/lucidity checks, doors, scenes, stage narration and persistence, while src/engine/storyEngine.ts routes between acts, gates and optional rooms.

THE VERDICT instead needs:
- Deep link directly into a named scenario, immediately playable on phone.
- Minimal 1–2 decision gameplay, committed effects, contextual twist and short outcome.
- Genuine aggregate audience results and future async duel.
- Separate warm, light visual language; no permanent character stats or philosophical note gate.

The shared core would impose unrelated complexity and design constraints. **Decision: separate browser app / small decision reducer, same monorepo and Vestibule hub.** Do not create a third ContentPack or change old graph/schema for convenience.

## 3. Components worth borrowing

| Existing | Use |
| --- | --- |
| Vite/TypeScript, tsconfig and Vitest | Reuse build/test baseline; add verdict entry/test config carefully |
| src/ui/choices.ts | Copy accessibility and number-key navigation principles; do not couple runtime view to RunState |
| src/ui/textPanel.ts | Learn semantic content pacing and reread behavior; prefer instant, short text over typewriter |
| src/audio/soundEngine.ts | Adapt a few tiny Web Audio feedback sounds if time allows; no somber shared ambience |
| src/engine/localSave.ts | Follow namespaced, defensive storage patterns, not the Profile schema |
| Existing CSS font imports | Reuse fonts Inter and Spectral, with new scoped tokens |
| src/test/*.test.ts | Follow pure-unit and regression testing conventions |
| tests/uat and CLAUDE.md | Follow bounded, focused UAT workflow and fail-fast rules |

Do **not** import Game, ContentPack, existing palettes, old outcome meter, old scenes, pack translation registries, or old save payload into the new experience.

## 4. Recommended directory and build strategy

Add new, independent src/verdict/ code, separate verdict/index.html entry, and dedicated styles. Suggested layout in 04-engine-and-content-model.md.

**Build option preferred:** add a second Vite config (e.g. vite.verdict.config.ts) with root pointing to verdict/ and bundled code from ../src/verdict; Vite base './' and output dist-web/verdict. Simpler alternative: Vite multi-page build, but only after proving other pack bundles remain isolated. Use the smallest approach that makes nested deep links work.

Add scripts to package.json:
- build:verdict runs TypeScript validation for Verdict and builds to dist-web/verdict
- build:web keeps original two pack builds and appends Verdict build before assembly
- test:verdict targets Verdict tests or existing npm test discovers them

Preserve existing npm run build, build:anamnesis, build:limerence, dev and dev:limerence; do not break them to make the new third title work.

**Deep link URL design:** GitHub Pages does not guarantee SPA fallback for arbitrary paths. Prefer static episode entry HTML files at /verdict/episodes/cabin-200/, /verdict/episodes/unfair-promotion/, /verdict/episodes/ai-shortcut/ or query-backed links (/verdict/?episode=cabin-200) with explicit per-episode social share HTML. Verify that each deep-link URL survives a direct browser refresh and receives a correct Open Graph title/description. Implement static entry generation only if needed; do not introduce a server runtime for deep links.

**Landing:** third tile in landing/index.html, clearly different but part of The Vestibule; add direct link to Verdict. Existing choices must keep working. Adjust scripts/assemble-web-dist.mjs validation and the GitHub Pages deploy workflow only as necessary. Electron should not automatically get a third game mode until web works; if build:web bundles it, check the Electron navigation and dimensions separately. Preserve Windows release behavior or exclude Verdict from Electron deliberately with clear explanation.

## 5. Version / save boundaries

- Keep original existing pack storage keys byte-for-byte.
- New independent namespace, e.g. the-verdict:v1:progress, with explicit version and validation.
- No automatic save migration across titles; no silently sharing “traveler” persona or heart/lucidity values.
- Published story versions are immutable for comparison: increment contentVersion when decisions/meaning change, even when the visible slug stays.
- Offline local gameplay works without an API.

## 6. Security issue to audit separately

Repository tree contains tracked .env and .env.limerence (do not print or copy their contents). Before deploying a voting backend, check whether any keys/secrets were committed. Rotate any genuine exposed keys. Add appropriate .gitignore rules for any new .env files; keep server env outside the browser bundle. This audit is a security gate, not permission for unilateral removal/rewrites of existing files.

## 7. Baseline commands / regression gates

Run before changes and after each milestone:
- npm ci
- npm test
- npm run build:web
- Build-specific output check for both legacy URLs
- Focused Playwright baseline on ANAMNESIS/LIMERENCE, following CLAUDE.md limits

After phase 1 also verify a direct Verdict link, mobile width (320/360/390px), keyboard access, reload/resume, reduced motion, console/network errors, and no unexpected cross-import of other packs.

If an existing test fails on unchanged baseline, report it; do not silently delete or weaken it.

## 8. No current code changes from this plan

This is a planning branch. The structure, paths and interfaces above are proposals for coding agents, with gate checks to validate implementation. No claim that THE VERDICT is presently built, accessible, integrated or tested in a browser.
