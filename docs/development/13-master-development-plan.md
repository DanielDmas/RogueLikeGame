# The Vestibule — Master Development Plan (consolidated 2026-07-15)

## What this is

A single, de-duplicated, currently-accurate list of every open item, decided-against idea, and standing rule discussed across the whole week's work (four escalating review passes, the 2026-07-13 post-implementation audit, the 2026-07-14 three-day notes, the 119-task ledger, and `UPGRADE_PLAN.md`'s deferred items back to Milestone 5). It replaces the layered, chronological working notes (kept in the session's own planning scratch, not the repo) with one congruent view: **what's still open, what's decided against and why, and what's binding going forward.** Anything already shipped is named only in passing — the authoritative blow-by-blow lives in `git log`, `CHANGELOG.md`, and `UPGRADE_PLAN.md`.

**Current verified state** (2026-07-16): branch `claude/philosophical-roguelike-game-zslw5n`, version `1.0.0-rc.1`, `tsc` clean, **1001/1001 tests green**, both packs (ANAMNESIS + LIMERENCE) content-complete in en/cs/fa/de/fr, all commits pushed. All release blockers fixed and verified. Everything the 2026-07-13/14 notes tracked as "in-flight, uncommitted" — docs historical-docs banners, the LIMERENCE registerText stale-comment fix, and quality-threading into `scene/themes.ts`'s builders — is **now committed** (`4b85339`, `1dd0940`, `7c8475a`); that section of the old notes is stale and is not carried forward here.

**Independent technical/architecture review (Fable model) + fix batch, 2026-07-15 (thirteenth session).** The owner asked for a codebase-map expansion (done separately, see `docs/development/14-codebase-map.md`) and a genuine technical/architecture/code review, run via a background agent on the Fable model rather than self-reviewing — deliberately independent eyes after ~12 sessions of the same lineage reviewing its own work. The review traced full code paths end to end (not file-by-file) and found real bugs earlier passes missed, including one in a feature shipped earlier this same session. All findings were verified against the actual source before fixing (not trusted blind) and the review report is preserved in full at the end of this section for the record.

**Fixed (all with regression tests, all live-UAT-verified where the bug was a rendering/keyboard behavior a unit test can't see):**
1. **H1 — first-heart-loss explainer could double-charge a heart on quit/resume.** `flow.ts`: the explainer beat's own `persist()` fired before `currentStage` was bumped to the next stage, so quitting mid-explainer (fully reachable via Escape → pause → Save & exit, since the explainer is a user-paced wait) and resuming replayed the same stage and re-applied the choice's effects — a second heart lost, `profile.heartsLost` double-counted, duplicate transcript entry, at the exact moment a first-time player is being told what a heart loss even is. Fixed by moving the `currentStage` bump before the explainer block. New `firstHeartLossOrdering.test.ts` (source-order invariant, since `Game` needs a DOM to unit-test directly) — verified it actually catches the regression by reverting the fix and confirming the test fails.
2. **H2 — the "Read more" article overlay (shipped earlier this same session) could dismiss the field note underneath it.** `fieldNote.ts`'s global keydown listener had no "is a higher overlay open on top of me" guard, so Escape — or Enter on the article's own focused Back button — fell through and dismissed the field note *underneath* the still-visible article, completing the room and rendering doors behind it. Fixed with a `.overlay.above-field-note` DOM check in the field note's handler, plus giving `showRoomArticle` its own proper Escape handler (it previously had none at all, Back-click only). Live-verified via `tests/uat/38-code-review-fixes-h2-h4.mjs`.
3. **M2 — Escape closed two overlay layers at once (Codex/Register, with a field note open on top).** Same root cause as H2, one layer down: `showCodex`/`showHotelRegister`'s own Escape handlers didn't check for an open field note on top, so Escape dismissed both at once, losing the player's place in the codex/register. Fixed with the same `.field-note` presence guard.
4. **H3 — the dormant voice/music architecture (Tier 1 item 1) used root-absolute URLs that cannot work on either real deploy target.** `voiceover.ts`/`soundEngine.ts` built `/voice/...`/`/music/...`/`/av-manifest.json` — root-absolute paths that resolve against the domain root under GitHub Pages' subpath deploy and against the filesystem root under Electron's `file://` load, both silently (the feature is designed to degrade to dormant on any fetch failure, so this would have shipped invisibly broken the day real audio files arrive). Fixed to document-relative paths (`./voice/...` etc.), matching the landing page's already-correct pattern; fixed the URL-comparison logic in both files to resolve relative URLs correctly instead of naively prepending `location.origin`. Updated `voiceover.test.ts` for the new path shape.
5. **H4 — the end-screen axis triptych (all endings, both packs) and LIMERENCE's title-screen epitaph wall rendered English in every non-English locale.** `engine/endings.ts`'s `axisTriptych` never called `t()` at all; LIMERENCE's own `axisTriptych`/`epitaphLines` in `packs/limerence/index.ts` were independently reimplemented from ANAMNESIS's and the `t()` call was dropped in the process (the translations already existed and were correctly registered — pure wiring drift). This was the single largest genuinely-untranslated player-visible surface left in the game: three poetic lines on every end screen, in every language, for every ending. Fixed by adding a new scoped `axisTriptychKey(axis, branch, packId?)` key (matching the `actNameKey`/`actIntroKey` engine-default/pack-override pattern) and writing genuine context-first translations — 9 lines × 2 packs × 4 languages = 72 new translated strings — into each pack's 4 `*-endings.ts` files, reusing each file's already-established register (ANAMNESIS: formal vy/Sie/vous/شما throughout; LIMERENCE: informal ty/du/tu, formal jste in Czech matching that file's own established practice, شما in Farsi matching ANAMNESIS's since Farsi doesn't carry the same T-V split). New `endingI18n.test.ts` — a genuine locale-behavioral test (set a non-English locale, call the actual render-path function, assert the output changed) that `translationKeyValidity.test.ts`'s registration-only check could never have caught; verified it catches the regression (12 of 18 cases fail without the fix). Live-verified in German via `tests/uat/38-code-review-fixes-h2-h4.mjs`.
6. **M6 — the Ledger's three "N of M" stat rows were hardcoded English** (`" of "`) despite every other overlay building the identical shape through `t(uiKey('of'), 'of')`. Fixed in `engine/ledger.ts`.

New tests this pass: `firstHeartLossOrdering.test.ts` (2), `endingI18n.test.ts` (18), 2 new UAT scripts (`37-choice-aftermath-echoes.mjs` was the prior feature's; `38-code-review-fixes-h2-h4.mjs` is this pass's). `translationKeyValidity.test.ts` extended to know about the new `axisTriptychKey` keys. Full regression: `tsc` clean, 972/972 tests green (was 952).

**Deliberately deferred, not forgotten** (real findings, lower urgency or larger scope than fit this pass — tracked below in the tier list rather than fixed opportunistically):
- **M1 — no validation on a hydrated/imported run.** A cross-pack profile import, or any future room rename, can leave `run.currentRoom` pointing at an id the active pack's registry doesn't have, crashing "Continue" into the recovery overlay on every retry. Also: `localSave.ts` overwrites the backup with a payload *before* confirming it hydrates cleanly, so a payload that parses but explodes in `hydrateProfile` clobbers the last-good backup with garbage. Real, but needs a small design decision (repair vs. discard an unrecognized run) rather than a pure mechanical fix — see Tier 2 below.
- **M3 — a WebAudio node leak.** Each chord voice's detune LFO is stopped only implicitly (its target oscillator dies, but the LFO+gain subgraph doesn't) — slow accumulation over a long session. Small, contained fix; see Tier 2.
- **M4 — both packs ship in every build, ~3.5 MB gzipped, verified by building and grepping the ANAMNESIS bundle for LIMERENCE's own Czech/German strings.** `packs/types.ts`'s own header comment claims "exactly one pack loads per build," which is false since `main.ts` statically imports both — a stale architecture claim that actively misleads (it's exactly how the item-21 cross-pack-leak bugs happened, from assuming no coexistence risk). Real fix needs dynamic `import()` of the selected pack, a build-time architecture change, not a drive-by; see Tier 2.
- **M5 — `document.documentElement.lang` is never actually set** (stays `"en"` regardless of locale — screen readers use the wrong pronunciation rules for cs/de/fa/fr text), and the typewriter's `aria-live="polite"` region re-announces partial text every ~11ms during typing. Both real accessibility gaps, both small, contained fixes; see Tier 2.
- **LOW nits** (persona "Skip" has no non-destructive cancel; `jump()` bypasses `persistChain`, UAT-only flakiness; beat-progress dots have `role="button"` with no `tabindex`; a dissolution-ending room still shows its field note + "progress saved" toast before the death screen, tonally odd not incorrect; a few dead-code/magic-number nits) — tracked, not urgent enough to interrupt this pass for.

<details>
<summary>Full Fable review report (preserved verbatim for the record)</summary>

Overall health assessed as genuinely good for a codebase this size — clean seams, disciplined persistence, real regression tests, no XSS surface found (every `innerHTML` site is authored/escaped content; user-influenced strings all go through `textContent`). The findings above (H1-H4, M1-M6, LOW items) are the actionable output; the review also flagged architecture debt worth naming even though nothing here is broken today:
1. **"Engine default = ANAMNESIS content" pattern is a leak factory** — `storyEngine.DEFAULT_GRAPH`, `choices.pick`'s `KEEPSAKES` default, `hud`'s default strings, `ledger`'s `UNDERSTORY_SEQUENCE` default, `gameState.pickUnchosenRooms`'s `ACT_POOLS` default all follow the same shape that produced `heartsAriaLabelKey`/`understoryNameKey`/item-21's bugs *and* H4's epitaph drift — the same bug class has now been independently rediscovered three times. Making these parameters required (packs always pass explicitly) would convert the whole class into compile errors instead of silent leaks.
2. **Per-pack reimplementation of `endingRules` invites drift** — exactly how H4 happened (LIMERENCE hand-copied the shape and dropped the `t()` call). Extracting shared, translation-aware helpers parameterized by ending list/keys would remove the possibility structurally.
3. **`overlays.ts` (1,311 lines) hand-rolls eight overlay lifecycles**, each with its own Escape/close/focus wiring — M2's stacking bug is the direct product of this duplication. A small shared modal helper with a proper Escape *stack* (mirroring `focusTrap.ts`'s existing stack-based design) would remove the class rather than patching each instance as found.

Top 3 recommended actions from the review (in the order it suggested): fix H1 (done), fix H2+M2 together as one keyboard-correctness pass (done), fix H4+M6 together since the translations mostly already existed (done) — all three landed this session.

</details>

**Critical fix, 2026-07-15 (eighth session) — real player got stuck with "nothing to click."** The owner hit a genuine, severe bug live on LIMERENCE's `the-front-desk` (the prologue) and reported it mid-session with a screenshot. Root cause: `styles.css`'s `.choice-card.settled { animation: none; }` (the P3 stale-theme-paint fix, item "P3" above in the shipped history) clears the entrance animation once it finishes, but `.choice-card`'s own base rule starts at `opacity: 0; transform: translateY(10px)` for the `rise` keyframes (which only declare a `to` frame) to animate from — so once `.settled` drops the animation without restating its final state, the cascade falls straight back to that `opacity: 0` base rule. **Every choice/door card in the entire game went invisible a few hundred ms after rendering, on every single screen, while remaining fully clickable** (opacity doesn't affect hit-testing) — which is exactly why this was never caught: 24+ click-driven Playwright UAT scripts (this session's own new sweep included) kept passing because Playwright's actionability checks don't look at computed opacity. Fixed by restating `opacity: 1; transform: translateY(0);` alongside `animation: none` on `.choice-card.settled`. Locked in two ways: `staleThemePaint.test.ts` now asserts the `.settled` rule actually restates opacity/transform (it previously only checked `animation: none` was present, which was true both before and after the bug); new `tests/uat/33-choice-card-visible-after-settle.mjs` reads real computed `opacity` on settled cards live, in both packs — the class of check the whole prior suite was missing. Verified live via Playwright screenshots before/after in both packs. **Same session, same live report:** the owner separately asked that diorama artifacts be "clearly visible" — `the-front-desk`'s counter (and every other diorama's structural geometry, both packs) was reading as almost pure black against the corridor darkness, since each diorama authors exactly one dim accent light tuned to its own glowing detail with no light left over to reveal the surrounding unlit boxes/furniture. Added one shared, neutral front-fill `PointLight` in `scene/director.ts`'s `setDiorama`/`clearDiorama` (independent of any per-diorama lighting, so it benefits all 34+ existing dioramas and any future ones without hand-tuning each scene) — verified live on both a LIMERENCE diorama (`the-front-desk`) and an ANAMNESIS one (`marys-room`). Both fixes: `tsc` clean, 891/891 tests green, committed and pushed.

**Follow-up audit + hardening, 2026-07-15 (same session, ninth turn) — closing the loop on "why didn't tests catch this," generalizing the regression coverage, and a token-efficiency pass.** The owner asked four things in one message: (1) verify the last 5 asks were actually done; (2) explain the miss; (3) generalize the tests to catch this *class* of bug, not just this instance; (4) verify no other room has the same problem; plus standing permission to keep going autonomously, and a request to work more token-efficiently.

1. **Audit of the prior 5 asks:** the full troll/UAT sweep (31→32 scripts), the choice-card fix, the diorama fill light, and the expanded-articles plan entry were all genuinely done. One gap found *during* this audit itself: retrying `11-i18n-matrix.mjs` (queued from an earlier turn) reproduced its failure identically on a clean standalone run — it had been mischaracterized as "environment flakiness" one turn earlier. Root cause: the script selected the Settings button and the language-cycle toggle by fixed DOM position; the title menu (Register, One Door) and Settings panel (Frame rate, Voice version) had both grown this session, silently shifting Settings from index 3→5 and the language toggle from index 1→2 — the script was clicking "One Door" and "Render resolution" instead. Fixed at the root with stable `data-uat="settings-button"`/`data-uat="language-toggle"` hooks in `overlays.ts` (translation- and position-independent) rather than another magic index. This is now also a documented standing gotcha (see the new codebase map, below) so it isn't rediscovered a third time.
2. **Why the choice-card bug specifically evaded 24+ prior UAT scripts:** every one of them drives the game by clicking (`.click()`) or keyboard, and Playwright's click actionability check only requires an element to have a non-zero bounding box and not be `visibility:hidden`/`display:none` — it never inspects computed `opacity`. A card at `opacity: 0` is therefore "clickable" by every automated definition while being genuinely invisible to a human. No script in the suite had ever asserted on rendered opacity before this session.
3. **Generalized regression coverage (not just re-testing the one instance):** added `src/test/animationSettleLint.test.ts`, a mechanical (not room-specific) static scan of the whole `styles.css` — it finds every rule that starts a `forwards`-fill entrance animation from `opacity: 0`, finds every more-specific "settled" rule that later clears that animation with `animation: none`, and asserts each one restates `opacity: 1`. Verified it actually catches the bug class by reverting `.choice-card.settled` to its old (buggy) form and confirming the test fails, then restoring the fix and confirming it passes again — this is a real, proven regression guard, not a tautology. It will catch the same mistake on *any* future animated element, not just choice cards. Also added `src/test/dioramaFillLight.test.ts`, a source-level check that `SceneDirector.setDiorama` adds its fill light in the same unconditional code path as the diorama itself (no per-room/per-pack branch could silently exempt some rooms), plus that `clearDiorama` disposes it (no leak across room changes).
4. **Verified breadth, not just the two originally-checked rooms:** expanded `tests/uat/33-choice-card-visible-after-settle.mjs` from 2 rooms to 10 — one room per act (0-4) in **both** packs, reusing the same room ids already validated by scripts 17/18's act sweeps. All 10 rooms' choice/door cards read `opacity: 1` after settling. Combined with the structural fix being in a single shared CSS rule (not per-room code) and the mechanical lint above, this gives both empirical and structural confidence that no room in either pack still has the bug — rather than resting on "it's a shared rule so it must be fine."
5. **Token-efficiency:** wrote `docs/development/14-codebase-map.md` — a directory-by-directory index of what every file in `src/` and `tests/uat/` owns, plus a "fast-lookup cheatsheet" for the questions that otherwise trigger a fresh `Glob`/`Grep` sweep every session (where does room X live, where do translations live, what's the current title-menu button order, does a given bug need a unit test or a live UAT check given no DOM/WebGL exists in vitest here). Linked from `docs/development/README.md`. Written once, from context already paid for this session — the payoff is every *future* session skipping the exploratory reads this one needed.

All of the above: `tsc` clean, 895/895 tests green (4 new), full 32-script UAT batch re-run in progress at time of writing to confirm `11-i18n-matrix.mjs`'s fix holds in the full suite, not just standalone.

**Full code review + fix batch, 2026-07-15 (tenth session) — all 10 findings corrected.** The owner asked for a code review of the prior two days' work (25 commits); an 8-angle review (3 correctness, 3 cleanup, altitude, CLAUDE.md conventions) surfaced 10 confirmed findings, all fixed this session:

1. **`heartsAriaLabel`/`lucidityTooltip` cross-pack leaks (cs/de/fa/fr) — real accessibility bugs.** Sibling keys to the item-21 fix (`heartsTooltipKey` etc.) that were missed: LIMERENCE's screen-reader hearts label and lucidity tooltip fell through to ANAMNESIS's "grip on reality"/lucidity translations in all 4 non-English languages, contradicting LIMERENCE's own "Trust"/"Clarity" English fallback. Added `heartsAriaLabelKey`/`lucidityTooltipKey` (same scoped-key pattern) to `engine/text/keys.ts`, wired into `hud.ts`, wrote fresh context-appropriate translations in all 4 languages (Czech "Důvěra"/"Jasnost — upřímnost, s jakou se díváte sami na sebe.", German "Vertrauen"/"Klarheit — wie ehrlich Sie bereit sind, sich selbst zu sehen.", Farsi "اعتماد"/"وضوح — اینکه چقدر صادقانه حاضرید خودتان را ببینید.", French "Confiance"/"Lucidité — l'honnêteté avec laquelle vous acceptez de vous regarder."). Live-verified in all 4 languages via a new UAT script.
2. **Missed WCAG-AA contrast fix.** The I9 audit's `--gold` → `--gold-text` sweep missed `.choice-card .num`/`.keepsake-mark` (still ~3.14:1 in LIMERENCE light mode). Fixed both selectors, added to `colorContrast.test.ts`'s regression list.
3. **`theMetamourDiorama`'s dominant-cell boundary bug.** `i < dominantCount + 1 && i >= dominantCount - 1` only ever matched 2 cells regardless of grid size — the calendar never actually read as "one color dominating." Fixed to `i < dominantCount` (roughly half the grid); new regression test asserts the count.
4. **Ambient door-flicker didn't dim the door's actual light output.** `flickerEnvelope` only multiplied the slab material's emissive intensity — the point-light and floor-pool light stayed pinned to base intensity, so the light spill never matched the visibly flickering door. Computed the flicker factor once and applied to all three; new regression test tags glow/pool lights with `userData.doorId` and asserts they dip in sync.
5. **`choices.ts`'s settle listener could be consumed by LIMERENCE's own hover animation.** An unscoped `{ once: true }` `animationend` listener also caught `limerence-scan`'s pseudo-element animationend (which bubbles to the host element), so hovering/focusing a card mid-entrance could snap its `rise` animation short. Scoped the listener to `e.animationName === 'rise'`.
6. **`director.ts` ran a DOM query every render-loop frame (~60Hz)** to compute the idle-fps-downshift eligibility — undercutting the very feature's GPU-saving purpose. Replaced with a `MutationObserver`-backed cached flag on the `#ui` container, updated only when the DOM actually changes.
7. **`flow.ts`'s One Door mode guards were scattered across 3 separate `!this.oneDoorMode` checks** inside `enterRoom` — a future permanent-profile mutation could land outside all of them by accident. Consolidated into one wrapping block; both source-scanning regression tests that pinned the old scattered shape (`oneDoorGuards.test.ts`) were rewritten to use real brace-depth matching instead of fixed-character-offset windows, so they no longer break every time a comment shifts the guard's position (this had already happened once mid-fix).
8. **Guide name ("Porter"/"Usher") was a hardcoded ternary in `overlays.ts`** instead of sourced from the pack, unlike everything else in the item-21 fix. Added `guide.name` to `ContentPack`'s type (`'Usher'`/`'Porter'`), threaded through `showPersona`'s new `guideWord` parameter from `flow.ts`'s 3 call sites.
9. **LIMERENCE's `*-ui.ts` files duplicated ~155 of ~161 keys byte-for-byte from ANAMNESIS**, verified 160/160 identical per language via a comparison script — the duplication itself is how findings #1 went unnoticed (a wrong copy read as "already translated"). Removed all dead duplicate entries (unscoped `uiKey(...)` falls through to ANAMNESIS's own registration by design); kept only the 7 genuinely pack-scoped entries per language. `tsc` clean, full suite green including `limerenceTranslationCoverage.test.ts` (32 tests) confirming nothing broke.

New/updated tests: `registerOverlay.test.ts` (+1), `colorContrast.test.ts` selectors, `limerenceDioramas.test.ts` (+1), `scene.test.ts` (+1), `oneDoorGuards.test.ts` (rewritten, more robust), `staleThemePaint.test.ts` (updated for the new listener shape), plus live UAT script `34-code-review-fixes-verification.mjs`. Full regression: `tsc` clean, 898/898 tests green, 33-script UAT batch re-run to confirm.

**Expanded field-note articles — ✅ SHIPPED (2026-07-15, eleventh session), deliberately scoped small.** Built the feature this plan entry scoped: `ContentPack` gained an `articles: Record<string, {title, body}>` field; `roomArticleTitleKey`/`roomArticleBodyKey` joined the existing `roomNoteBodyKey` family; `showFieldNote` gained an optional `onReadMore` callback that renders a "Read more →" button without dismissing the note underneath it; a new `showRoomArticle` overlay (the same `.codex-panel` scroll/Back pattern as Credits) renders the long-form piece and returns to the still-open field note on Back. Wired into all three places a field note can appear — the live in-room note, the Codex, and the Hotel Register.

Scoped deliberately to **2 rooms per pack** (ANAMNESIS: `wallet` — the Ring of Gyges wallet-drop studies and Ariely's self-image-maintenance theory; `beggars-math` — Singer's drowning-child essay, Williams' integrity objection, the identifiable-victim effect. LIMERENCE: `the-read-receipt` — attachment theory, Ainsworth's Strange Situation, Hazan & Shaver, earned security; `the-best-friends-girl` — Tennov's limerence research, Fisher's fMRI work, the Schmitt & Buss mate-poaching study), not a mechanical sweep across every room — the same "start small, translate carefully" discipline CLAUDE.md's standing translation rule and this plan's own item-2 caution call for. All 4 articles genuinely translated (context-first, register-matched to each language file's established voice — informal "du"/"tu" in LIMERENCE per its existing convention, formal in ANAMNESIS) into cs/de/fa/fr, not just present-but-English-fallback — locked in by a dedicated `roomArticles.test.ts` (content-completeness + per-language non-English-fallback checks in all 4 languages × both packs).

**Real bug found and fixed while implementing (self-caught, not user-reported):** the global field-note keydown handler intercepted every Enter/Space unconditionally and dismissed the note — so a keyboard user tabbing onto the new "Read more" button and pressing Enter/Space would have the field note close instead of the button activating. Fixed by checking `document.activeElement !== readMore` before treating Enter/Space as dismiss; Escape still always dismisses.

**Second, more severe bug found live via UAT (not caught by the unit suite, since vitest here has no DOM):** the article overlay opened *underneath* the still-open field note. `.field-note` is deliberately `z-index: 55` (above the base `.overlay`'s `z-index: 50` — "the codex screen opens field notes on top of itself"), but `showRoomArticle` used the same plain `overlay()` helper, so its Back button was visually and pointer-event-wise obscured by the field note's own scroll region sitting on top of it — clicking Back timed out because `.fn-scroll` intercepted the click. Fixed with a new `.overlay.above-field-note { z-index: 56; }` rule applied only to the article overlay. This is exactly the kind of bug CLAUDE.md's UAT rule exists to catch — the unit suite (897→912 tests, all green) never would have found it, since it has no real DOM/paint/z-index model.

Verified live via two new Playwright scripts under the standing `?uat=1`/≤3-min-per-script convention: `35-read-more-articles.mjs` (in-room field note → Read more → article renders real content → Back returns to the still-open note; the keyboard-accessibility fix specifically, via Shift+Tab to the button and Enter; a German-language spot check confirming genuinely translated, non-English article text) and `36-read-more-articles-codex-and-limerence.mjs` (the Codex-opened field note's Read more wiring, and a LIMERENCE room's article end to end). Both pass. `tsc` clean, 912/912 tests green.

**Fullscreen persistence + persistent Settings access + shared display settings + bigger dioramas — ✅ SHIPPED (2026-07-16, fourteenth session).** Owner reported four things in one message plus asked for content-pack brainstorm notes (below, not coded) and general "fix anything you deem worth it" latitude:

1. **Fullscreen silently exited on every normal menu navigation.** Root cause: the Fullscreen API cannot survive a page navigation/reload, by browser design — and this app reloads constantly as its normal control flow (`location.reload()` on returning to title, saving Settings, resetting a run, `jump()`'s own reload; `location.href` on the Vestibule button), each one silently dropping fullscreen with no code ever trying to restore it. Fixed with a remember-and-silently-resume pattern rather than an explicit "resume fullscreen?" prompt (matches the Experience Charter's "no dark patterns / quiet UI"): `ui/fullscreen.ts` gained `rememberFullscreenForReload()` (writes a `sessionStorage` flag iff currently fullscreen, called immediately before every reload/navigation) and `resumeFullscreenAfterReload()` (called once at boot; if the flag is set, consumes it and arms a one-shot capture-phase click listener that calls `requestFullscreen()` — a click is a valid user gesture even though the click's own intent was something else, so the player never sees an explicit prompt and fullscreen just persists through ordinary navigation). Wired into all 8 `flow.ts` call sites via two new private helpers (`reloadPage()`, `navigateToVestibule()`) that route every reload/cross-document-navigation through `rememberFullscreenForReload()` first, plus the landing page's own `<a class="door">` links (same `sessionStorage` key/contract, duplicated as a plain-JS literal since `landing/index.html` isn't part of the Vite/TS build). Unit-tested (`fullscreen.test.ts` — the two new functions' no-DOM guard paths); live-verified via a Playwright script that spies on `requestFullscreen` (real OS fullscreen isn't available in headless Chromium) confirming the exact resume-on-next-click contract, since a genuine end-to-end fullscreen toggle can't be automated in this environment.
2. **Settings reachable from anywhere, including the one place it was literally impossible: the landing/Vestibule page itself.** Two additions: (a) a small, quiet gear icon beside the in-run HUD's existing Menu button (`ui/hud.ts`'s new `.settings-btn`, reusing the already-translated `settings` string rather than adding new UI copy) that opens Settings directly via a new `flow.ts` method (`openSettingsDirect`, mirroring the pause menu's own 'settings' branch exactly) — one click instead of two, without removing the existing Menu → Settings path; (b) the landing page (`landing/index.html`), which previously had zero settings access of any kind, gained its own top-right gear icon opening a small Display panel (Fullscreen, High visual quality, Render resolution, Frame rate cap, Interface size) — the genuine gap the owner's phrase "even from the vestibule" named. Both kept deliberately small/quiet per "not obnoxious" — an icon-only button at reduced opacity, not a new toolbar.
3. **Display settings now interchangeable between ANAMNESIS and LIMERENCE.** New `engine/sharedDisplaySettings.ts`: a small, additive-only `localStorage` key (`vestibule:sharedDisplaySettings`, safe under the same-origin rozcestník deploy both packs already share) mirroring just the four fields that mean the same thing regardless of which game is running — `quality`, `renderScale`, `uiZoom`, `fpsCap` (screen/resolution/zoom/detail, per the owner's own framing) — deliberately *not* the rest of Settings (language, audio, text version, theme, etc., which are genuinely per-pack). Written every time a Settings panel closes (all 3 call sites: pause menu, title screen, the new HUD shortcut); read and overlaid onto a pack's own saved settings once at boot (`main.ts`), so whichever pack (or the landing page's own panel) a player touched these four fields in last wins everywhere, without merging the packs' otherwise-fully-separate profiles or bumping the `Profile` schema version. Unit-tested (`sharedDisplaySettings.test.ts` — round-trip, corrupt-value rejection, overlay-only-the-four-fields behavior); live-verified in both directions (a Settings save writes the shared key; a fresh boot with a pre-existing shared key picks it up) plus the landing page's own panel reading/writing the identical key/shape.
4. **Dioramas made bigger and closer, while staying "illustratively beautiful."** `scene/dioramas.ts`'s shared `DIORAMA_Z` constant (every diorama builder in both packs positions its objects relative to this one value) moved from `-10` to `-7.5` — closer to camera, still with clear margin behind `DOOR_Z = -5.6` and the guide's walk path so nothing intersects. `scene/director.ts`'s `setDiorama` now also applies a uniform `1.6×` scale to the diorama group around its own local origin — a single tunable multiplier rather than hand-rescaling dozens of individual object-position constants across two packs' diorama files. Live-verified via Playwright screenshots in both packs (ANAMNESIS's `marys-room`, LIMERENCE's `the-distance`) — visibly larger/closer, no clipping through the corridor geometry or the guide figure, zero console errors, healthy frame rate.

Full regression: `tsc` clean, 982/982 tests green (10 new — `sharedDisplaySettings.test.ts` 8, `fullscreen.test.ts` +2). Six new live UAT scripts (`39`–`44`, one per verification point above, split per pack/surface where the check was pack-visual rather than pack-neutral logic).

**No-regressions sweep of the full committed UAT suite (43 scripts, all packs + the landing page).** Beyond the 6 new scripts' own passes, re-ran every pre-existing script to confirm none of this session's changes (8 `flow.ts` call sites rerouted through new reload/navigation helpers, `Hud`'s constructor gaining a parameter, `showSettings`'s call sites gaining a shared-write side effect, `dioramas.ts`/`director.ts`'s sizing constants) broke anything already working. Split across two runs (the first hit an external 25-minute wrapper timeout — not a script failure — after 36 of 43 scripts, all passing; the remaining 7 ran immediately after, all passing) plus the two scripts that need their own servers (`42`, the landing page's own static server; `44`, LIMERENCE's dev server) run standalone. **Final tally: 43/43 scripts passed, zero failures, zero regressions.** Results committed under `tests/uat/results/2026-07-16T06-18-20-870Z/` and `.../2026-07-16T06-43-55-708Z/`.

**Content-pack topic ideas — notes only, explicitly not coded or scheduled this session** (owner: "Do not code or implement any of these. Only write notes of them to the plan.") — folded into Tier 3 item 17 below, "Third content pack," as the candidate-topics list that item didn't have before.

**Small hardening batch — Tier 2 items 11/12/14 — ✅ SHIPPED (2026-07-16, fifteenth session).** Owner asked to continue and, for anything not yet done, "either code the basic things ... right away or write them all to the development plan," with full creative-director latitude. Picked the three smallest, most contained items still open from the Fable review (11, 12, 14) — each already judged in this doc as needing no further design decision beyond the one made below — and shipped all three in one sitting, exactly matching this doc's own prior "Recommended order" note that these three (not item 13, the bundle-splitting architecture change) belonged together as one batch. See the updated item entries above (11, 12, 14) for full detail on each fix. Summary: a corrupted/cross-pack-imported saved run no longer crashes "Continue" into the recovery overlay (discards and falls back to a fresh run instead — a real design decision, made and documented); a WebAudio node leak in the chord-crossfade system is fixed; `document.documentElement.lang` is now actually set per-locale and the typewriter's screen-reader region no longer re-announces on every ~11ms tick. New tests: `resumableRun.test.ts` (14), `accessibilityFixes.test.ts` (2), one extended `audio.test.ts` case — 17 new, all source-level/pure-logic given this project's DOM-free vitest environment. Full regression: `tsc` clean, 999/999 tests green (was 982). Live-verified via a new UAT script (`45-hardening-batch-verification.mjs`) that seeds an actually-corrupted profile and confirms the real crash no longer happens, switches languages live and reads back `documentElement.lang`/`dir`, and confirms the typewriter's settled-state aria-live postcondition — plus a 5-script regression spot-check (save/continue, troll test, i18n matrix, Settings sweep, live language switch) confirming nothing else broke.

Item 13 (single-bundle-both-packs architecture change) remains deliberately un-touched — it's the one item in this cluster that's a real architecture change with a measurable before/after, not a contained bugfix, and this doc has said all along it needs its own dedicated pass with a real bundle-size verification, not a drive-by alongside three unrelated small fixes.

**Item 13 — single-bundle-both-packs architecture fix — ✅ SHIPPED (2026-07-16, sixteenth session), as its own dedicated pass.** Owner asked to continue as creative director, pick something from the plan, fix any bugs found, and retest. Picked item 13 deliberately: the last engineering-actionable item that wasn't gated to a translation-quality or authored-content dedicated pass, self-contained, with a clear success criterion (real bundle-size verification) this doc had already specified. See item 13's own entry above for full detail — summary: `main.ts` now loads its pack via dynamic `import()` gated on the compile-time `__PACK__` constant instead of statically importing both packs, so Rollup tree-shakes the unused pack's entire module graph out of a production build. Measured for real: ANAMNESIS 3,543.84 kB/1,253.77 kB gzip → 2,211.52 kB/785.76 kB gzip (−37.6%/−37.3%); LIMERENCE similar. Confirmed via `grep` that the specific leak the Fable review found (LIMERENCE's Czech guide-word inside the ANAMNESIS bundle) is gone. `packs/types.ts`'s stale header comment (the one the review called "actively misleading") is now accurate. New test: `dynamicPackLoading.test.ts` (2, source-level, pinning the fix's shape). Full regression: `tsc` clean, 1001/1001 tests green (was 999). Live-verified three ways — `46-dynamic-pack-loading.mjs` (dev server, both the default and `?pack=`-override routes, a real room played in each), a 6-script pre-existing-UAT regression spot-check (onboarding, troll test, both packs' act sweeps, save/reload, the landing page), and — the strongest check — `47-dist-web-deploy-smoke.mjs`, which builds the real `npm run build:web` artifact and clicks through the actual landing page into each game via a plain static file server, exactly matching what GH Pages serves. All pass. Surfaced one new, smaller, genuinely separate finding while verifying (a handful of never-displayed ANAMNESIS-flavored fallback strings still present in the LIMERENCE bundle, root-caused to a different "engine default = ANAMNESIS content" pattern already named in the Fable review) — documented as new item 18, deliberately not fixed here since it needs its own refactor across several files, not a drive-by alongside a bundling fix.

---

## TIER 1 — Highest usefulness & impact (open)

These change what the finished product *is* for a player.

**1. Real voice narration + music files.** The single biggest atmosphere multiplier identified all week. The architecture is fully shipped and dormant (commit `21158d0`): drop files into `public/voice/<packId>/<lang>/<key>.mp3` and `public/music/<packId>/<slot>.mp3`, run the manifest script, done — the Settings rows appear automatically. **Blocked only on the owner supplying/recording audio.** Out of scope until then: TTS, timing sync.

**Gap found and fixed (2026-07-15, seventh session):** re-verified this end to end (voice manifest, `Hud`/`TextPanel` playback, per-key gating, volume sliders, music-slot crossfade over the generative fallback — all genuinely wired, confirmed by reading `voiceover.ts`, `soundEngine.ts`, `flow.ts`, and `overlays.ts` directly, not just trusting the commit message). One piece was documented but never actually built: `public/music/README.md` promises `public/music/landing/vestibule.mp3` plays on the rozcestník "behind a click-to-start button," but `landing/index.html` had zero audio code, and — because the rozcestník is a plain static page outside either pack's Vite build — `assemble-web-dist.mjs` never copied `av-manifest.json` or a landing music file into `dist-web/` in the first place, so even adding the button code alone couldn't have worked. Fixed both halves: the landing page now fetches the manifest and shows a small, quiet "♪ Play quiet music" toggle only when `music.landing.vestibule` actually exists (click-to-start, respects autoplay policy, matches the Experience Charter's "no dark patterns" rule — silent and invisible otherwise); the assemble script now copies both files into `dist-web/` alongside the two pack builds. Verified live (a synthetic manifest + fake dist served over HTTP, Playwright toggling the button, zero console errors) since there's no real audio file to test with yet; cleaned up before commit so `public/av-manifest.json` stays the checked-in empty default.

**2. cs/fa literal-translation quality re-review (CLAUDE.md standing TODO) — RESOLVED, 2026-07-19.** Done as its own dedicated pass, exactly as this entry specified: 22 parallel-dispatched chunks (per-act, mirroring the de/fr structure — prologue+Act I, Act II, Act III, Act IV+Understory, endings/epiphanies/explanations/dynamic, and UI chrome, × both packs × both languages), each dispatch reading the actual English source for narrative context before rewriting, per CLAUDE.md's rule. ~290 fixes total across ~5,300 reviewed strings (most strings already held up and were left untouched — this was a targeted audit-and-fix, not a wholesale rewrite). Real bugs found and fixed, not just style: cross-pack vocabulary leaks (LIMERENCE's "Vrátný"/"دربان" and a Farsi transliteration "اوشر" had crept into ANAMNESIS content in several places); a systematic Farsi case-marker direction bug inverting "X was owed to Dana" into "Dana owes X" across nine LIMERENCE reflections; a Czech double-negative-concord bug that flipped "I know it isn't nothing" into its literal opposite; several false-friend mistranslations (anti-malarial "nets" → "networks", "inventory" → "invoice", "blue stain" for "water-stained"); a lost conditional mood that erased the manipulative-hypothetical framing of a guilt-trip scene; an unwanted sexual-safety connotation from a literal "unprotected" instead of "defenseless"; three places where a trailing sentence had been silently dropped from the English source; dropped **bold** markdown emphasis in 6 of 7 ANAMNESIS ending field notes; and several instances of stale, self-contradictory duplicate ending text (a file's own copy vs. the later-loading, authoritative `*-endings.ts` file) synced rather than left as dead-but-misleading contradictions. The smaller `heartsAriaLabel`/`lucidityTooltip` terminology nit flagged here was also confirmed resolved (LIMERENCE's own `cs-ui.ts`/`fa-ui.ts` already correctly say "Důvěra"/"اعتماد" for Trust and "how honestly you are *willing*..." for Clarity, restoring a dropped "willing" in the same dispatch). Process note: two of the pass's dispatch waves hit account-level session usage limits when run at 4-way parallelism; reduced to 1-2 concurrent dispatches per the owner's explicit instruction for the remainder of the pass, with no further issues. `tsc` clean and the full suite (1059/1059) green after every wave; a live UAT i18n-matrix check confirmed the resolver renders correctly end-to-end in a real browser for both languages post-pass.

**3. LIMERENCE visual-language rework.** Owner's ask on record: make scenery/animations read as "a relationship at its breaking point," not a recolored ANAMNESIS corridor; livelier/more colorful light mode (considered: inverted door/environment palette in light mode; more visual elements generally). Scoping notes: per-floor palettes exist (`packs/limerence/theme.ts`), `theme-light` CSS vars exist; the *geometry* (`corridorTheme()` and friends) is still ANAMNESIS's, reused wholesale — a genuine rework needs LIMERENCE's own scene-builder functions per floor. The creative bible's signature images (migrating wall/window, two phones on one bed) are the target vocabulary. Post-1.0 polish by prior decision; high impact when done.

**4. Porter/Usher pattern-barks — ✅ SHIPPED (2026-07-25).** The guide visibly *knows you* across runs. See the dated entry "Cross-run guide recognition" at the end of this document for the full design, the six patterns, the pacing decision, and what was deliberately left out.

**5. Choice-aftermath flashes — ✅ SHIPPED for ANAMNESIS (2026-07-15, twelfth session); real finding: LIMERENCE already had this device, ANAMNESIS didn't.** Investigating this item before writing new content turned up something worth recording: the mechanism this item describes — a later beat's text conditionally referencing an earlier room's specific choice via `choseIn()`/flags — was **not actually missing from the game**. LIMERENCE already uses it densely (12 cross-room echoes found via `grep -rn "flags.includes("` across its Act I-III rooms, e.g. `the-ex` naming "that Sara, the one you trapped" if the player set `the-rumor`'s trap flag four rooms and one act earlier; `the-scoreboard` recognizing a repeat of `tested-almost`/`ran-the-test`). ANAMNESIS had **zero** cross-room echoes outside the single final-gate recap (`door-that-asks`, which already reviews the Junction and Photograph choices as a whole-run summary) — every other room's `choseIn()` usage found in ANAMNESIS was *within* the same room (e.g. Junction's own lever→bridge stages), never reaching across rooms the way LIMERENCE's does. So the real, well-scoped task was pack parity, not new-mechanism invention.

Added two mid-journey echoes to ANAMNESIS, matching LIMERENCE's existing density and using the engine's own pre-existing `choseIn(state, roomId, choiceId)` (no new engine code): **wallet → photograph** (Act I) — the gate's "both doors are load-bearing" line now recognizes if the player pocketed the stranger's wallet ("the fire is a different kind of witness... it is watching now") or walked it back honestly ("let us see whether that self survives a fire, and not only an empty corridor"); **omelas → court-of-usher** (Act II) — the Usher-as-judge's opening line recognizes if the player opened Omelas's basement door ("that much is on the record, in your favor") or stayed at the festival ("though I recall a festival you once chose not to leave, bells and all — recusal is a luxury this bench does not offer"). Both are 3-way `choseIn()` conditionals (the two extremes + an unchanged fallback for players who picked differently or never visited the earlier room) converting an existing static beat into a function, following the exact registration pattern already established by `junction`'s own dynamic beat (translations centralized in each language's `*-dynamic.ts` file via `register()`, not inline in the `*-rooms*.ts` object literals). Translated into cs/de/fa/fr with genuine context-first care, reusing each language's already-established vocabulary for `wallet`/`photograph`/`omelas`/`court-of-usher` (Czech "peněženka"/"sklep", German "Brieftasche"/"Keller", Farsi "کیف پول"/"زیرزمین", French "portefeuille"/"cave").

**Bonus find while broadening test coverage:** extending `dynamicBeats.test.ts`'s language matrix from `['cs','fa']` to all four languages (closing a real, separate coverage gap — the file only ever exercised 2 of 4 languages) immediately caught a genuine pre-existing bug: `butterfly-dream`'s memory-loss-conditional beat (stage0 beat2) was registered inline in `cs-rooms-act3.ts`/`fa-rooms-act3.ts` but **never actually written into `de-dynamic.ts`/`fr-dynamic.ts`**, despite both files' own header comments explicitly listing it as one of theirs to hold — a silent English-fallback for that one beat in German and French. Fixed by adding the missing `register()` calls with fresh context-first translations in both languages.

New tests: 2 new cases in `dynamicBeats.test.ts` (photograph/court-of-usher echoes, parameterized across all 4 languages, asserting all 3 branches produce distinct non-fallback text) plus the LANGS-matrix broadening itself (40 more test executions from the existing 9→11 dynamic-beat cases × the 2 newly-added languages). `tsc` clean, 952/952 tests green (was 912). Live-verified via a new `tests/uat/37-choice-aftermath-echoes.mjs`: injects a transcript entry directly (fastest reliable way to simulate "chose this earlier in the run" without replaying a full room), jumps to the target gate, advances past its act-intro bark, and confirms the echo line actually renders — in English for both pairs, and in German for the wallet→photograph pair (confirming genuinely translated text, not English fallback).

---

## TIER 2 — Older deferred items from `UPGRADE_PLAN.md` (open, lower priority)

**6. End-of-act interlude screen — ✅ SHIPPED (Phase V4a, 2026-07-16; hold/typeset hardened 2026-07-21). Stale entry, corrected 2026-07-26.** This item's own text ("scoped out... never revisited") was true when originally written but was never struck once Phase V4a actually built it — a floor-name title card shown inside the existing fade-veil during a real act transition, holding 4s+ at full opacity and typeset at title scale. See the dated "V4a" and "Act-headline duration" entries elsewhere in this document for the full history, including a real invisible-card bug Phase V4a's own live verification caught and fixed. The richer original sketch (a Porter line, a palette bleed) was deliberately not built — see "B7" below — and remains real, optional, future scope if ever revisited; the card itself is done.

**7. Door hover feedback beyond the shipped pulse. ✅ SHIPPED (2026-07-15, sixth session).** `doors.ts` already had a breathing glow pulse, a per-door pitched hover tone, and a DOM tooltip; added the two enhancements this item's writeup named. Light-spill: a hovered door's point light and floor pool now breathe brighter in lockstep with its slab glow (`hoverLightSpill`, pure, unit-tested — same `t * 2.2` envelope as the existing `hoverPulseIntensity`, scaled to each light's own base intensity, bounded `[base, base*1.4]`, holds at the peak under reduced motion). Creak: `sound.hover(index)` now layers a very short, quiet filtered-noise creak (`doorCreak`, reusing the ambient-room-accent's impulse-noise technique but far shorter/quieter) under the existing pentatonic hover tone, pitched in a distinct low "wood" register (`doorCreakFrequency`, pure, unit-tested, always below `hoverPitch` at every door index so the two layers never beat against each other). Both fire from the single already-existing hover-transition call site (`mouseenter`/`focus`/raycast), so no new plumbing. 6 new unit tests; live-verified via Playwright (hover/unhover a real door card, zero console errors). `tsc` clean, 886/886 tests green.

**8. Deferred verification debt: full Playwright matrix. ✅ MOSTLY CLOSED (2026-07-15, seventh/eighth sessions).** Dynamic scenery end-to-end, a full playthrough sweep, and a transition-garble check were already covered before this pass (scripts 03-09). This pass added 18 more scripts (15-33), split per the re-scoped approach this item originally called for (small, focused, ≤3-minute scripts rather than one long run): settings round-trip, one-room-per-act sweeps, real-click onboarding-through-first-choice flows (no `jump()` shortcuts), every title-menu overlay, the heart-death-to-ending path in both packs, keyboard-only play, One Door mode, the vestibule landing page, live in-HUD language switching, a second troll test (LIMERENCE), overlay focus-trapping, and an undirected "clicking user" pass — plus, from the live bug this same session surfaced, a script that reads real computed CSS opacity rather than just clicking (33). `tests/uat/run-all.mjs` now batch-runs the whole 32-script suite and writes timestamped, comparable, **committed** (not gitignored) results per run to `tests/uat/results/` — directly closing this item's "results comparable over time" gap too. Full batch result: 31/32 passed, then 32/32 after a follow-up fix (below). **Correction:** `11-i18n-matrix.mjs`'s failure was initially assessed as environment flakiness (a 10s `.settings-panel` selector timeout) pending a standalone retry; the retry failed identically, proving it was a real, reproducible regression — **in the test, not the game.** Root cause: the script selected the Settings button and the language toggle by fixed DOM position (`nth(3)`, `nth(1)`), and the title menu (Register, One Door added this session) and Settings panel (Frame rate, Voice version toggles added this session) have both grown since those indices were written, silently shifting Settings to index 5 and the language toggle to index 2 — the script was clicking "One Door" and "Render resolution" instead. Fixed at the root: added stable `data-uat="settings-button"`/`data-uat="language-toggle"` hooks in `overlays.ts` (translation- and position-independent) and updated the script to select through them; verified passing standalone. This is a durable fix, not a patch — any future title-menu/Settings-panel addition can no longer silently break this class of selector. **Still genuinely open:** a true EN/CS/FA 3-language full-playthrough matrix (this pass added a language-*switch* check, live in both packs, but not a repeated full playthrough in each of the 3 languages) — folds naturally into item 2's cs/fa translation-quality pass rather than being its own thing.

**9. Ambient corridor life — ✅ all three sub-effects now shipped. Stale entry, corrected 2026-07-26.** This entry's own text ("two remaining... left open pending the animation-path engineering they'd need") was accurate when written but was never struck once both landed: "the Porter passing" shipped as the T7 continuation (`director.ts`'s `triggerAmbientPass`, its own independent timer so it never interrupts a real door-walk); "a phone lighting in the distance" shipped as **V4b** (`corridorTheme`'s own `tick()`, a rare 60-180s jittered rise-and-fall on a LIMERENCE accent-colored decorative door, self-contained — no director wiring needed). Both live-verified (UAT 52) with zero console errors. Nothing left open in this item.

**"The guide passing" ✅ SHIPPED.** Reused the exact walk/bob rig `walkThrough` already drives for a real door-selection: while a door row is idle-showing (no active tween, same gating as the door flicker), the guide occasionally walks a short distance in from its usual spot and back — a background life event, not a prompt to act (no lantern retarget, no presence boost, unrelated to any door). Rarer than the door flicker by design (90-180s vs 60-120s jitter, independent timer — a whole-figure walk is a bigger event than one door dimming) via a new pure `nextGuidePassDelay`, unit-tested the same way as `nextAmbientDelay`. The walk-out/walk-back chaining reuses the existing `usherWalk` tween state with one small addition — an optional `onComplete` callback fired when a leg finishes, so the ambient pass needs no new state machine beyond what door-selection walks already have. If a player clicks a door mid-pass, the real walk simply overwrites the ambient one (same safe overwrite behavior `usherWalk` already had). Genuinely pack-neutral (the guide-figure rig is already fully shared/parameterized between ANAMNESIS's Usher and LIMERENCE's Porter), so this shipped for both packs at once, not LIMERENCE-only. 3 new unit tests (range, floor/ceiling, "always rarer than the flicker"); `tsc` clean, 890/890 tests green; live-verified with a 45-second idle stress test in the browser (well under the door-pass's own 90s minimum interval, confirming the new timer/state logic runs stably in the hot render loop with zero console errors, even though the rare event itself wasn't expected to visibly fire in that window — same "unit-test the timing, live-verify the stability" split T7's original door flicker used).

**"A phone lighting in the distance" — still open.** LIMERENCE-only (no equivalent object exists in ANAMNESIS's vocabulary), needs new pack-specific background geometry rather than reusing an existing rig the way the guide-pass did. Real future work if a fuller ambient pass is wanted.

**10. F5 Tier 3 — LIMERENCE dioramas beyond Tier 1+2. ✅ SHIPPED — full 34/34 parity (2026-07-15, eighth+ninth sessions).** Eighth session added 5 (`the-screenshot`, `the-scoreboard`, `the-veto`, `the-drift`, `the-registry` — see prior entry, preserved below). Ninth session added the remaining 11, closing the gap completely: `the-best-friends-girl` (a row of tally marks, one lighting in a loop with no off switch — "counted eleven times now"), `the-summer-ends` (an open packing box with a small framed photo — "the relationship's museum, curated by hand"), `the-hall-pass` (a wrapped gift box, uneasy light leaking from the seam — "presented with a bow on it"), `the-rebound` (a sink counter, one toothbrush solid, one an unfilled translucent outline — "a shape where a feeling should be"), `the-unicorn` (a rollaway cot dim beside the warmly lit double bed — "the rollaway never gets to choose the room"), `the-other-side-of-the-door` (a face-down phone on a nightstand, a door that never fully opens or closes behind it), `the-metamour` (a color-coded calendar open on a counter, one color dominating — "exhibit A," lifted directly from the room's own text), `the-usual-suite` (a wall lit from behind, waiting silhouettes — the room's own stated image, verbatim), `the-usual-room` (a hotel key-board, one key already lit — "will reach for 4B first, to test it"), `the-doors-not-opened` (a row of doors already ajar, one drifting open further then easing back), and `the-other-side` (two facing chairs, one holding a translucent voice assembled from a past choice). Every image is lifted from or tightly grounded in the room's own prose, not invented — same discipline as the first 23. New test locks in full parity (`DIORAMA_ROOM_IDS` now equals every real LIMERENCE room id). `tsc` clean, 887/887 tests green; live-verified via Playwright `jump()` into all 11 (zero console errors) plus screenshots confirming correct render at the same subtle backdrop-vignette depth every other diorama in both packs uses.

**Follow-on (same ninth session): extended per-choice accent hooks to 4 more rooms** among the new dioramas, once each had a factual object-changing accent worth hooking (same "one specific choice, one honest visual consequence" discipline as the original 6): `the-hall-pass` (the bow falls loose, the box opens for real, on either of the two "accept" choices), `the-rebound` (the outline toothbrush solidifies — false commitment made physical — on "let her believe"), `the-veto` (the contested key flares hot on "counter-veto," open warfare over the rule), and `the-metamour` (the calendar's already-dominant color stops pulsing and simply holds, on "name-the-hierarchy" — acknowledged, not just felt). `dioramaAccentHooks` now covers 10 rooms total. Existing generic accent-hook tests (no changes needed — they iterate the hook list itself) cover all 4 automatically; live-verified end to end via Playwright (jumped to `the-hall-pass`, clicked the accept choice, advanced through its outcome beats, zero console errors).

**11. Hydrated/imported-run validation (Fable review, M1). ✅ SHIPPED (2026-07-16, fifteenth session).** Decided repair-vs-discard: **discard**, not repair — repairing would mean guessing a substitute room to silently teleport the player into, which is both harder to reason about and worse UX than a clean "this couldn't be resumed, here's a fresh run" (mirrors how `resetRun()` already behaves). New pure `isResumableRun(run, registry)` (`storyEngine.ts`) checks `run.currentRoom` and every id in `run.visited` against the active pack's registry; a new `RoomRegistry.has(id)` backs it without needing try/catch around the real crash site. Wired into `flow.ts`'s title-loop `'continue'` branch: an unresumable run is discarded (`profile.run = null`, persisted) and the player falls through to the same fresh-run flow 'new' already uses (Examined Path offer included) — no scary messaging, since this is an edge case (cross-pack import, or a future room-id rename) that should essentially never hit a normal player. Also fixed the adjacent `localSave.ts` finding: `hydrateProfile(parsed)` now runs *before* the backup key is overwritten, so a payload that parses as JSON but fails inside hydrate can no longer clobber the last known-good backup on its way to falling back to it. New `resumableRun.test.ts` (14 tests, pack-parameterized: fresh/mid-room/visited runs of the active pack resumable, a run pointing at the *other* pack's room id or a made-up id not resumable, plus source-order checks that both call sites actually wire the fix). Live-verified end to end: seeded a real corrupted profile (`currentRoom` set to an id that doesn't exist in the pack) via Playwright, clicked Continue, confirmed no crash into the recovery overlay and a normal fresh-run surface renders instead.

**12. WebAudio chord-voice LFO leak (Fable review, M3). ✅ SHIPPED (2026-07-16, fifteenth session).** Added a `chordLfos` array parallel to the existing `chordOscs`, populated alongside each voice's LFO in `crossfadeToChord`'s voice-building loop; the old crossfade's cleanup block now stops each old LFO (`lfo.stop(t + 5.05)`) at the exact same instant it already stopped the old oscillator, rather than leaving the LFO running forever feeding a now-silent (but still-connected) oscillator's detune. Source-level regression test (`audio.test.ts` — this class of fix needs a real `AudioContext`, unavailable in this project's node-only vitest environment, same constraint as every other `SoundEngine` test) pins the fix's shape: LFOs tracked in the parallel array, stopped in the same cleanup loop as the oscillators.

**13. Single-bundle both-packs deploy + stale architecture claim (Fable review, M4). ✅ SHIPPED (2026-07-16, sixteenth session), with real before/after verification.** `main.ts`'s pack selection is now a dynamic `import()` (a new `loadPack()`) gated on the build-time `__PACK__` constant — a string *literal* Vite's `define` substitutes before Rollup's tree-shaking pass runs, so `__PACK__ === 'limerence'` is a compile-time-constant comparison in a production build and Rollup dead-code-eliminates the branch (and the whole pack module graph behind it) that's never taken. The dev-only `?pack=` override stays a genuine runtime branch (Vite's dev server serves modules unbundled, so there's no tree-shaking concern there, and both packs need to stay reachable for `npm run dev`). Also fixed the `packs/types.ts` header comment this finding named as actively misleading — it now states precisely what's guaranteed (exactly one pack per *production build*) versus what isn't (the dev server; the separate "engine default = ANAMNESIS content" leak class below).

**Real before/after, built and measured this session (not estimated):** ANAMNESIS bundle **3,543.84 kB / 1,253.77 kB gzip (one chunk) → 2,211.52 kB / 785.76 kB gzip (two chunks)** — a 37.6% raw / 37.3% gzip reduction, not quite the "halves" originally guessed but a large, real drop. LIMERENCE: 3,540.88 kB/1,252.37 kB gzip → 2,050.58 kB/666.43 kB gzip, a similar ~42%/47% reduction. Confirmed via `grep` that LIMERENCE's Czech guide-word ("Vrátný") and room ids, previously found inside the ANAMNESIS bundle, are now genuinely absent from it (and vice versa). Live-verified three ways: a new source-level test (`dynamicPackLoading.test.ts`) pinning the fix's shape so a future edit can't silently reintroduce the static dual-import; a Playwright script (`46-dynamic-pack-loading.mjs`) driving both the default and `?pack=`-override routes through the dev server, playing a real room in each; and — the strongest check — `47-dist-web-deploy-smoke.mjs`, which builds the actual `npm run build:web` artifact (the exact thing GH Pages serves), serves it statically, and clicks through the real landing page into each game the way a player would. All pass. Full regression: `tsc` clean, 1001/1001 tests green (was 999).

**New, smaller finding surfaced while verifying this fix — genuinely separate, not fixed here.** Grepping the post-fix bundles found a few *other* small ANAMNESIS-flavored strings still present in the LIMERENCE build (e.g. `hud.ts`'s `DEFAULT_HEARTS_TOOLTIP` fallback text, "grip on reality" — three occurrences) and vice versa for LIMERENCE-adjacent defaults elsewhere. Root cause is the *different*, already-named "engine default = ANAMNESIS content" architecture debt (Fable review's own broader note under Part 6: `storyEngine.DEFAULT_GRAPH`, `hud.ts`'s `DEFAULT_HEARTS_*`, `textPanel.ts`'s `SPEAKER_PREFIXES`, `choices.ts`'s `KEEPSAKES` default, `ledger.ts`'s `UNDERSTORY_SEQUENCE` default, `gameState.ts`'s `ACT_POOLS` default all follow this shape) — not the item-13 bug (whole pack module graphs), which is genuinely fixed. Impact here is tiny (a few sentences of never-displayed fallback text/vocabulary per file, since both packs always override these in practice) and non-functional, unlike item 13's real ~1.3 MB-gzip leak. Fixing it properly means converting these defaults to required parameters across ~6 shared engine files and their existing call sites/tests — real, separate work, not a drive-by alongside a bundling fix. Tracked as **new item 18** below rather than silently absorbed into item 13's "done."

**14. Two small, real accessibility gaps (Fable review, M5). ✅ SHIPPED (2026-07-16, fifteenth session).** `applyLocaleToDocument` (`ui/locale.ts`) now sets `document.documentElement.lang = lang` alongside its existing `dir`/RTL-class handling — every `Lang` value is already a valid BCP-47 primary subtag, so no mapping table was needed. `TextPanel.showBeat`'s typewriter loop now removes `aria-live` from the beat element before the ~11ms-interval per-character loop and restores it (`'polite'`) only once, right as the final full text is set — suppressing the dozens-of-announcements-per-beat noise while still announcing the finished beat exactly once. Both fixes verified live: a Playwright script switched languages mid-run and read `documentElement.lang`/`dir` after each switch (en → cs → fa, confirming `fa` also still flips `dir` to `rtl`); a settled beat was read back with `aria-live="polite"` present and real, non-empty text (the mid-typing-suppressed state isn't observable under `?uat=1`, which forces the typewriter off — that half is pinned by a source-level test, `accessibilityFixes.test.ts`, checking the remove-before-loop/restore-after-loop ordering directly in the source).

---

**18. "Engine default = ANAMNESIS content" default-parameter leak class — ✅ CLOSED via lint, not refactor (2026-07-26).** Several shared engine files fall back to ANAMNESIS's own data/vocabulary as the default value of a parameter every real call site is supposed to override explicitly: `storyEngine.ts`'s `DEFAULT_GRAPH`, `ledger.ts`'s `UNDERSTORY_SEQUENCE`, `gameState.ts`'s `ACT_POOLS`, `ui/choices.ts`'s `KEEPSAKES`, `ui/textPanel.ts`'s `SPEAKER_PREFIXES`. This is the shape that already produced three separate real bugs across the project's history — a call site that forgets to pass its own pack's value silently falls back to ANAMNESIS's, rather than failing loudly.

Audited every live call site (not assumed) before deciding how to close it: **every one already passes its pack's own value explicitly** — confirmed across `flow.ts`, `overlays.ts`, and both packs' content trees. The "required parameter" fix this item originally named was evaluated and **rejected as the wrong fix**, for a reason only visible after the audit: `gameState.ts`'s `pickUnchosenRooms(prior, pools = ACT_POOLS)` is called with no second argument ~15 times from *inside ANAMNESIS's own content files* — and that is correct, not a bug, because that code genuinely is ANAMNESIS's own data. Making the parameter required would force touching ~70 call sites (15 real + dozens of test fixtures) to convert a pattern that isn't broken today into one that's merely more verbose, and would have been actively wrong for exactly the call sites that rely on it correctly.

**What actually ships:** `src/test/engineDefaultLeakLint.test.ts`, in the same mechanical-source-scan style as this repo's existing `animationSettleLint.test.ts`/`uiKeyCoverage.test.ts`. It doesn't touch a single call site — it scans `flow.ts`, `overlays.ts`, and LIMERENCE's own content files and asserts every call to the six flagged functions carries the substring proving it passed a real pack-scoped value (`this.pack.graph`, `this.pack.keepsakes`, `LIMERENCE_ACT_POOLS`, etc.) rather than silently falling through to the default. This converts the actual remaining risk — a *future* edit that forgets to thread the pack through, or copy-pastes ANAMNESIS content into LIMERENCE without updating which pool constant it uses — into a fast, specific, immediate test failure, which is the practical equivalent of the "compile error instead of silent leak" this item originally asked for, without the disproportionate churn. Mutation-tested: dropping `this.pack.graph` from a real `offeredDoors()` call, and dropping `LIMERENCE_ACT_POOLS` from a real LIMERENCE call site, each failed exactly the one expected test; both reverted and reconfirmed green. `tsc` clean, full suite 1237/1237 (6 new).

---

## TIER 3 — Conditional / external-dependency items (open, not actionable now)

**15. Commercial-store certification** — PEGI/ESRB submission, Windows code signing. Contingent on a paid release ever being pursued. The in-game age advisory explicitly self-declares it is not an official rating.

**16. Mobile investment** — decided out of scope for Milestone 5 by the owner's 12-question review; unrevisited since. Would need touch controls, layout, and performance passes.

**17. Third content pack** — the architecture explicitly anticipates it (one engine, N packs). If one lands: split `flow.ts` (~900 lines, noted as acceptable for two packs but "split if a third lands").

**Candidate topics — notes only, none scoped, none scheduled, none coded (owner brainstorm, 2026-07-16, explicitly "do not implement, only write notes").** Framed by the owner as loose continuations of the same "live a hard decision from the inside, not read about it" design ANAMNESIS (philosophical dilemmas) and LIMERENCE (relationship dilemmas) already both do — same engine, same room/door/choice/hearts/lucidity machinery, a different subject matter each time:

- **Universal life-and-death decisions across history.** Hard, dangerous, or irreversible choices ordinary people have faced across eras and cultures — not confined to one century or one kind of person. Draws on the same "real philosophy/research grounded in a lived scene" discipline the field-note articles already use (item above, "expanded field-note articles"); the natural sourcing base is the same kind of primary material ANAMNESIS's field notes already cite (historical accounts, ethics/psychology research), just organized around era/culture-spanning dilemmas instead of classroom thought experiments.
- **Modern business-world decisions, 2021–2026.** Contemporary professional-life dilemmas — the kind of call an ordinary employee or founder actually has to make under real pressure (not hypothetical trolley problems): layoffs, whistleblowing, a client asking for something unethical, equity/loyalty tradeoffs, remote-work-era boundary questions. Would need active curation to avoid reading as dated within a year or two, given the explicit recency framing — a real scoping question if this is ever picked up, not answered here.
- **High-stakes CEO/diplomat/senior-manager decisions.** Deliberately framed by the owner as decisions "not necessarily knowable to a common person" — the appeal is putting a player inside a kind of high-consequence, high-opacity decision they'd otherwise never see from the inside (a diplomatic backchannel, a boardroom vote, a resignation with the reasons redacted). Would need real research/consultation to ring true rather than generic "corporate thriller" flavor — likely the single hardest of the four to authentically source.
- **Criminal/lowlife/desperation-driven decisions.** Framed by the owner explicitly around empathy: decisions forced by social or financial desperation, built so the player has to "put themselves in that person's skin" rather than judge from outside — closest in spirit to LIMERENCE's own design goal (making a player *feel* a trap rather than just read about one) but for economic/criminal desperation instead of relationship dynamics. The most tonally sensitive of the four to get right — real risk of either moralizing (the Experience Charter's "no grades, no verdicts" rule would bind hard here) or, in the other direction, glamorizing — worth a deliberate tone pass before any content is drafted, not something to improvise room-by-room.

None of these are scoped, named, or sequenced — they are exactly what the owner asked for: raw ideas on the record for whenever a third pack is actually decided on, at which point picking (and possibly combining) one deserves its own dedicated design session, the same weight LIMERENCE's own original creative-bible pass got before any code was written.

---

## DECIDED AGAINST or SUPERSEDED — kept on the record deliberately

- **Epiphany toasts (T3)** — investigated and judged redundant: epiphanies already surface on the end screen's "filed tonight" block, and no mid-run moment exists where one is *earned* earlier than that. Closed as no-op, not forgotten.
- **ANAMNESIS light theme** — deliberately none; the single dark tone is authored, not a gap (`supportsLightTheme: false` is a statement).
- **Separate replay modes (museum/daily/NG+ menu entries)** — owner decision from the Milestone 5 12-question review: everything integrates into the one game organically. ("One Door" mode, shipped, is the one sanctioned exception-shaped idea.)
- **Usher backstory / additional characters** — owner decision: the Usher stays enigmatic.
- **Loud achievement popups** — rejected tone; guest stamps (shipped) are the quiet alternative.
- **AudioWorklet re-architecture** — explicitly judged unnecessary once the three audio-glitch fixes landed.
- **GPU auto-detection heuristics** — rejected in favor of honest presets (Calm/Cinematic via Settings, not a heuristic).
- **First-run "Calm vs Cinematic" choice card** — judged and closed: the silent low-quality default plus a normal Settings row already lets any player upgrade in two clicks; a modal on first boot would be an extra interruption in tension with the Experience Charter's "no dark patterns" rule. Revisit only if real players report not knowing Cinematic exists.
- **"Three doors on one heart" junction rule** (M4-era) — intentionally not built; the junction room already covers it.
- **Cross-stage/cross-choice rewind (F4's back/reread)** — deliberately excluded: decisions stay permanent (roguelike honesty). Back/reread within a stage shipped.

---

## STANDING RULES (binding, from CLAUDE.md + owner instructions — not tasks, constraints on all future tasks)

R1. Context-first translation for every string ever, UI chrome included — never translate a line in isolation; read the surrounding context before writing it.
R2. UAT: ≤3 min/script, `?uat=1` always, keyboard-advance (not click-loops), ≤2 attempts per approach then do differently or skip, ask before re-running a switch-model prompt.
R3. Agent dispatches small (per-act); check disk before redoing work — file writes survive agent death.
R4. Never leak one pack's guide vocabulary into the other (incl. header comments) — Uvaděč/Vrátný, نگهبان/دربان, Platzanweiser/Portier, Le Placeur/Le Portier. **Carve-out (E-6, extended review, 2026-08-01):** a comment inside a pack's own translation file whose sole purpose is to *warn against* using the other pack's guide word (e.g. `limerence/text/cs-guide.ts`: `"Porter" = "Vrátný" — never "Uvaděč"`) is not a leak — it names the forbidden word specifically to prevent it from ever being typed as real content, the opposite of the failure R4 exists to stop. Verified: grep confirms zero cross-pack guide words in any *registered string value* in either direction; only these anti-leak comments name the other pack's word, and only inside comments. This carve-out applies to comments alone — registered/displayed text is still absolutely never allowed to contain the other pack's guide word, carve-out or not.
R5. Definition of Done: spec check → `tsc` → `vitest` → live `?uat=1` verification (screenshots/DOM read, not just launched) → honest `UPGRADE_PLAN.md`/plan entry → one-phase commit → push.
R6. Architecture rules: content imports pure predicates only; no new subsystem logic inline in `Game`; the guide reads state, never writes; persistence through `SaveStore` only; schema renames need a version bump + fixture; unseeded randomness for cosmetics only.
R7. The Experience Charter is binding and wins conflicts: quiet UI, no grades, no dark patterns, endings are trades not verdicts.

**Fullscreen-reset bug report + comprehensive real-navigation tests, and persona-whisper research — 2026-07-16 (seventeenth session).** Owner reported: "When I clicked anamnesis from the first vestibule, after setting full screen, it resetted / changed" — a live report against the *previous* session's fullscreen-persistence fix, plus a request to comprehensively test the whole feature, plus a separate research-only question about persona-name mentions in guide dialogue.

**Fullscreen — investigated, one real gap found and fixed, ✅ SHIPPED.** Reproduced the owner's exact flow for real (not mocked): built the actual `dist-web/` deploy artifact, confirmed headless Chromium in this environment genuinely supports the Fullscreen API (not assumed), then drove a real browser through landing page → gear-toggle fullscreen on → click the ANAMNESIS door → real cross-document navigation → click once in the freshly-loaded game. Result: the mechanism *does* correctly resume fullscreen on the first click — but the resume listener (`resumeFullscreenAfterReload` in `ui/fullscreen.ts`, and its plain-JS duplicate in `landing/index.html`) only ever listened for `'click'`. A `<button>` activated via Enter/Space synthesizes a click automatically (covering the common "focused Begin button, press Enter" path), but plenty of real first interactions never go through that path — pressing Space to advance a beat is handled by a raw `keydown` listener with no synthesized click, and a `pointerdown` that doesn't complete as a full click fires neither. Confirmed via direct testing: a keyboard-only first interaction (Space, no click at all) after landing in a freshly-reloaded game left fullscreen never resumed under the old code. Fixed by widening both listeners to fire on `click`, `keydown`, *or* `pointerdown` (whichever comes first, via a shared `armed` guard so only one actually calls `requestFullscreen()`). This cannot make the resume trigger "more" — only close the real gap where it didn't trigger at all. The necessarily-visible moment where the browser exits fullscreen during the navigation itself is an unavoidable platform constraint (Fullscreen API cannot survive any page navigation, by spec) that no code on either side of the fix can remove — this only shortens how long the player is out of fullscreen before their very first action brings it back.

New comprehensive test: `tests/uat/48-fullscreen-across-navigation.mjs`, built against the real `dist-web/` artifact with genuine (non-mocked) Fullscreen API calls — 5 scenarios covering exactly what the owner asked to have covered: (1) the owner's literal report — landing gear-toggle → ANAMNESIS door → resume on click; (2) the same via LIMERENCE's door, resumed via **keyboard only** (the specific gap this session found and fixed); (3) a negative case — a player who was never fullscreen must never be force-fullscreened by clicking a door (no dark pattern); (4) the reverse direction — fullscreen entered *inside* a game via the HUD gear, then the Vestibule button navigates back to the landing page, resuming there; (5) an in-game `reloadPage()` path (Reset current run) distinct from the cross-document Vestibule navigation. All 5 pass. Re-ran the three prior fullscreen UAT scripts (`39`, `45`, plus the full unit suite) to confirm the widened trigger didn't regress anything already passing. Full regression: `tsc` clean, 1001/1001 tests green (unchanged — the fix and its real coverage are both live-UAT-level, per this project's established DOM-free-vitest convention).

**Persona-name-in-dialogue — researched and verified, notes only, nothing coded (per instruction).** The owner's memory was correct and specific: `docs/development/08-platform-localization-engine-health.md` §9 documents **"R7 — Persona whisper pass"**, quoting the owner's own original brief verbatim: *"expand the hints a little… nothing that stirs attention from the doors."* The spec scoped it to **exactly four insertions per pack**, all using the already-existing `{name}`/`{blurb}` token plumbing (`Game.tokens()` in `flow.ts`, threaded through `playBeats`/`showBark` calls; `applyTokens()` in `engine/text/resolver.ts` does the actual `{token}` → value substitution, falling back to a generic "traveller"/"no further description on file" for a player who skipped the optional persona step, so the touches work whether or not a name was ever entered): one Usher/Porter bark variant (`generic7`), one act-intro variant (Act III), one ending's final beat (`return` in ANAMNESIS), and one blurb echo inside a hook room (`the-archive` in ANAMNESIS). **Verified all four exist and are wired correctly for ANAMNESIS** (`content/usher.ts`, `content/endings.ts`, `content/text/*-rooms-understory.ts`'s `the-archive` beat). **Also verified LIMERENCE independently planned and shipped the identical scope** — its own `docs/design-limerence/01-creative-bible.md` states outright: *"The player stays 'you' (persona `{name}` whisper sites preserved, 4 calibrated uses)"* — and all four are confirmed present in `packs/limerence/guide.ts`, `packs/limerence/endings.ts`, and `packs/limerence/rooms/understory.ts`'s own hook room. **So: it's there because it was deliberately planned, twice (once per pack, independently scoped to the same "exactly four, calibrated" discipline), and it is fully delivered as specified** — not a stub, not an oversight, not something that quietly never got finished.

**Real gap found while verifying (test coverage, not the feature itself):** `src/test/i18n.test.ts`'s "Milestone 5, Phase R7" suite tests only 3 of ANAMNESIS's 4 touches (missing a check on `the-archive`'s `{blurb}` echo), only in en/cs/fa (not de/fr, added in a later pass), and is not pack-parameterized — LIMERENCE's own 4 touches have **no automated coverage at all** that the `{name}`/`{blurb}` token survives translation into any of its 4 languages. Not fixed this pass (explicitly notes-only, per instruction) — recommended as a small, well-scoped follow-up: extend the existing test to pack-parameterize (mirroring how every other translation-coverage test in this codebase already does — see `endingI18n.test.ts` for the exact pattern), add the missing 4th-touch check, and extend the language list to all 5.

**Recommendation for any future expansion (explicitly not scoped or approved — for the owner to decide, not a queued task):** the original brief's own wording — "nothing that stirs attention from the doors" — was a deliberate constraint, not an oversight to correct; "4 calibrated uses" in the creative bible reads as a considered ceiling, not a starting point. If more is wanted, the safest next increment (matching the existing discipline exactly, one more sparse touch rather than a broader rework) would be a single additional whisper in a place that's thematically "aware of you specifically" the way the existing four already are — a candidate: one line inside the profile/Ledger-adjacent surfaces (the Register's "welcome back" framing, or a keepsake's earn-toast) rather than inside room prose, since every room-prose slot already has its calibrated touch and adding a second to any single room would break the "exactly one per anchor" symmetry the current four have. Any expansion should keep the same token-preservation-across-languages test discipline the original R7 spec required, extended to both packs from the start rather than retrofitted later (as happened this time).

**Diorama coverage audit + fix — ANAMNESIS closed to full 33/33 parity with LIMERENCE's 34/34, ✅ SHIPPED (same session).** Owner asked to verify every door/room across both packs has a unique diorama, and to code any that were missing. Quantified precisely rather than guessing: a scratch coverage check found ANAMNESIS at **21/33 rooms** (12 missing bespoke dioramas, falling back to bare act-theme geometry) against LIMERENCE's already-genuine **34/34 full parity** — a real, substantial gap neither the owner nor any prior session had measured this exactly. The 12 missing rooms: `waiting-room` (prologue), `wallet`/`promotion`/`beggars-math`/`quiet-alarm`/`dinner-table`/`photograph` (Act I + its gate), `court-of-usher` (Act II gate), `introduction`/`free-will` (Act III + its gate), `last-message`/`door-that-asks` (Act IV + its gate).

Wrote 12 new bespoke diorama builders in `src/scene/dioramas.ts`, each read directly from the room's own prose (per this project's established "one object, tightly grounded in the room's own text" discipline) and matching the existing parametric-geometry vocabulary (flat-color/emissive primitive shapes via the shared `mat()`/`box()`/`trackDispose()` helpers — no textures or models): a bench + handless clock + recursive window panes for `waiting-room`; an open wallet + cash on a floor mat with a warm door-glow strip for `wallet`; a desk + glowing monitor with an animated pulsing error-line for `promotion`; a bus shelter + hunched figure + glowing phone for `beggars-math`; a door + two animated expanding sound-ripple rings for `quiet-alarm`; a round table + teacups + chair for `dinner-table`; two doors + a table photo + an animated flickering fire (reusing `the-cave`'s exact flicker-tick pattern) for `photograph`; an altar-bench + inside-out confession booth for `court-of-usher`; a deliberately near-empty hollow threshold frame with a soft pulsing light for `introduction` (the room's own minimalism is the point, not an oversight); a wall panel of four buttons for `free-will`; a counter + animated pulsing pen + glowing letter-slot for `last-message`; a large door with gold grille bars and a slow amber pulse for `door-that-asks`. All 12 registered in the `REGISTRY` lookup `dioramaFor()` reads from.

Full regression: `tsc` clean, **1002/1002 tests green** (the new `dioramas.test.ts` full-parity assertion — `expect(new Set(DIORAMA_ROOM_IDS)).toEqual(new Set(roomIds))`, mirroring the check `limerenceDioramas.test.ts` already had — locks the 33/33 count in as a permanent regression guard; also replaced a now-stale assertion that `quiet-alarm` specifically had no diorama, since it now does). New UAT script `tests/uat/49-new-anamnesis-dioramas.mjs` jumped to all 12 newly-covered rooms against the real dev server, confirmed a healthy render loop (fps > 0, zero console errors) and saved a screenshot of each; spot-read back `wallet`, `court-of-usher`, `door-that-asks`, and `introduction` — all render as designed, including the deliberately sparse `introduction` diorama reading correctly as "almost nothing" rather than as a bug.

---

**Graphics overhaul — the deferred Tier 1 item 3 ("LIMERENCE visual-language rework"), ✅ SHIPPED (2026-07-16, same day, follow-on session).** Owner: *"do the deferred graphics overhaul... Enhance the graphics, without changing it totally. Make it perfect and beautiful. Make it enjoyable. Keep the mood. Check for regressions. Test for everything."* This is Tier 1 item 3 from earlier in this same document — the single largest deferred visual item, explicitly scoped since 2026-07-13 as needing "its own design+build session." Read the full spec trail first (creative bible §8's exact wording — "the migrating wall/window, two phones on one bed" as the target vocabulary; the code comment in `packs/limerence/theme.ts` explaining why the 3D scene stays dark in both UI themes by deliberate design, D1) before writing anything, to avoid re-litigating decisions already on record.

**Scope decision, made explicitly before coding:** the full ask ("rework LIMERENCE's visual language") is large enough to redo the whole game's look, which directly conflicts with "without changing it totally... keep the mood." Chose the safest reading that still delivers real, felt impact: (1) give LIMERENCE's shared-geometry corridor genuine bespoke structure beyond a recolor — the creative bible's own named gap; (2) extend item 17's door-hover feedback (still open, low-priority) with a frame glow; (3) make light mode livelier as asked, but strictly within the D1 boundary already decided (UI-chrome layer only, 3D scene stays dark in both themes — not re-opening that decision). Post-processing (bloom/vignette/tone-mapping) was deliberately left untouched — already reasonably tuned, and "don't change it totally" argued against touching something not actually broken.

**1. LIMERENCE corridor structural distinctiveness (`src/scene/themes.ts`, `src/packs/limerence/theme.ts`).** The real, specific gap the creative bible named: floors 0-3 (`corridorTheme`) were a genuine recolor of ANAMNESIS's exact geometry, with zero bespoke structure — "the geometry is the reuse" was still true as of this morning's dioramas pass. Fixed with two additive, ANAMNESIS-safe pieces:
- **`CorridorPalette.accentColor`** (new, optional field on the shared engine builder): every third decorative background door recolors to a second, contrasting tone instead of the uniform single hue, plus one faint unlit ceiling-seam strip per side ("neon bleed through curtains," creative bible §8) — both zero-cost (recolors an existing material / one unlit `MeshBasicMaterial`, no new real-time `PointLight`s, which the 1.3-era GPU-budget work specifically flagged as the corridor's single most expensive line item). `undefined` (every ANAMNESIS caller) reproduces the exact original geometry byte-for-byte — verified by a new test asserting zero seam meshes when omitted.
- **The migrating window** (`migratingWindowFixture`, LIMERENCE-only): a framed pane hanging at the corridor's far end that drifts a little side to side and breathes in brightness over time — the creative bible's own named signature image, built for the first time anywhere in the game (it existed in no ANAMNESIS theme and no prior LIMERENCE build). Wrapped via `limerenceCorridorTheme()`, which calls the shared `corridorTheme()` unchanged and adds the fixture on top — floors 0-3 each get their own tuned accent (Front Desk: cool TV-glow blue; Ground Floor: a teal foreshadowing the floor above; Second Floor: one warm ember breaking through its own cool register; Long-Stay Wing: a cold violet-blue undertow). Floors 4-5 (Top Floor, the morning after) are bespoke builders already, untouched.

**2. Door hover — frame glow (item 17 follow-on, `src/scene/doors.ts`).** The door frame (jambs + lintel) was previously a single `FRAME_MAT` shared and inert across every door in a row — hovering only ever brightened the slab and its lights. Gave each door its own frame material (a real fix, not just cosmetic: a shared material would have lit every door's frame at once) and added `frameHoverGlow()`, a small fixed emissive lift on the hovered door's frame only. Both packs get this — a universal "the whole doorway responds," not just the slab.

**3. Per-floor light-mode accent (`src/engine/flow.ts`, `src/styles.css`).** Owner asked for "livelier/more colorful light mode." Re-confirmed the existing, deliberate boundary first (code comment in `packs/limerence/theme.ts`: the 3D scene stays the hotel's authored dark palette in *both* UI themes; light mode governs only the readable panel layer on top) — did not reopen that decision, since it's reasoned and already shipped. Delivered within it: `Game.setSceneTheme()` (new helper, replaces all 5 raw `director.setTheme()` call sites) now also mirrors the active act onto `<body data-act>`; three new CSS blocks (`body.pack-limerence.theme-light[data-act="1|2|3"]`) shift `--gold`/`--gold-text`/`--gold-dim` per floor — amber for the Ground Floor, teal for the Second Floor, plum for the Long-Stay Wing — visually matching each floor's own 3D accent color for the first time (previously light mode was one flat clay-amber regardless of floor). Every new color hand-verified against WCAG AA math before writing any CSS (a throwaway Node script using the exact same `relativeLuminance`/`contrastRatio` functions `colorContrast.test.ts` uses, to avoid shipping an accessibility regression) — all three text colors clear 4.5:1 (4.79/5.20/7.48:1) and all three decorative golds clear the 3:1 non-text floor (3.68/3.37/4.67:1) against the palette's own unchanged cream background. Acts 0/4/5 keep the existing base tone (already the sodium/dawn amber family) — no override needed.

**Testing.** 19 new unit tests, all green alongside the existing 1002: `corridorTheme`'s `accentColor` is a true no-op when omitted (2 tests), produces exactly the expected seam/accent-material counts when set (2 tests); the migrating window adds real geometry beyond the bare corridor shape on all 4 floors and its pane genuinely animates over time, not statically (2 tests); floors 4-5 are unaffected (1 test); the door frame glows only for the hovered door, resets on unhover, and each door owns its own material rather than a shared one (5 tests); `colorContrast.test.ts` extended with a new per-act describe block (7 tests) plus a fix to its own `extractBlock` helper, which only escaped `.`/`#` before — needed a full regex-metacharacter escape once `[data-act="1"]`-style attribute selectors joined the plain class selectors it originally covered (a real, if narrow, latent bug in the test helper itself, caught immediately by trying to use it for the first time on a bracketed selector). Full regression: `tsc` clean, **1021/1021 tests green**.

**Live UAT (`tests/uat/50-graphics-overhaul-limerence-corridors.mjs`, `51-graphics-overhaul-doorhover-and-anamnesis-sanity.mjs`), against the real dev server, both themes.** Screenshotted all 4 corridor floors in both UI themes (8 shots) plus an ANAMNESIS sanity shot — confirmed live, not just asserted: the migrating window pane is visible and reads as a window/mirror without derailing the room's own diorama in front of it; the Ground Floor's teal-accented decorative door is visibly distinct mid-corridor; the Long-Stay Wing's plum light-mode accent visually harmonizes with its own existing violet-pink 3D key light (an unplanned but welcome cohesion — the CSS color and the pre-existing 3D palette were picked independently and still read as one design); ANAMNESIS's corridor (`waiting-room`) is pixel-for-pixel the same shape/palette as before this work, confirming `accentColor`'s opt-in guarantee holds live, not just in a unit test. Zero console/page errors across every screenshot. One inconclusive check, not re-attempted per CLAUDE.md's one-repair-attempt rule: the door-hover frame glow's *live* screenshot didn't land (the scripted room didn't reach a door-offering screen within the steps given) — not a functional gap, since the same behavior has 5 passing, precise unit tests exercising the exact material/state transitions a screenshot would only eyeball; noted here rather than silently dropped.

**Found but not fixed — real, specific, no action taken this pass:**
1. **The deeper "brighter 3D scene in light mode" idea (UPGRADE_PLAN's own original framing of this ask) stays deliberately not done.** Re-confirmed this is a reasoned, already-implemented decision (D1, `packs/limerence/theme.ts`'s own header comment), not an oversight — re-lighting five bespoke floor scenes for a literal daylight look would fight "the hotel at night is the actual setting," and doing it now would be "changing it totally," the one thing explicitly ruled out this pass. If ever revisited, it is its own dedicated session, same caution as before.
2. **"Two phones on one bed"** (creative bible's other named signature image) was *not* built as new environmental geometry — it already exists, and has for several sessions, as `the-distance`'s room-level diorama (`packs/limerence/dioramas.ts`). Re-verified this rather than assuming; no gap here, just confirming the creative bible's second image was already delivered at the room layer while the first (the migrating window) needed the corridor layer this pass added.
3. **The Second-Floor/Long-Stay-Wing/etc. per-floor light-mode accent only touches `--gold`/`--gold-text`/`--gold-dim`**, not `--panel-edge` (still a flat teal-ish rgba across every floor) or `--danger`. Deliberately narrow scope to limit the surface needing fresh WCAG verification in one pass; a future pass could extend the same `[data-act]` pattern to `--panel-edge` for a slightly richer effect, with its own contrast check.
4. **No equivalent per-floor accent for LIMERENCE's *dark* mode** (`body.pack-limerence` without `.theme-light`) — dark mode's `--gold: #e0995a` stays one flat tone across every floor, same as before this pass. Not built because dark is the hotel's primary, most-played register and the owner's specific ask named "light mode" — extending the same idea to dark mode is a plausible, low-risk future increment (the color math would need re-deriving against dark's own `--bg: #0d1116`, not reusable from this pass's light-mode numbers).
5. **Item 17's other named idea — "a subtle door-creak sound" — remains unbuilt** (it's audio, not graphics; explicitly out of scope for a graphics-only pass). Still open at low priority, same status as before this session.
6. **Post-processing (bloom/vignette/grain/tone-mapping) was deliberately left untouched.** Reviewed `scene/post.ts`'s current values against the live screenshots taken this pass and judged them already well-tuned for this game's quiet mood — touching them without a specific, named complaint risked exactly the "changing it totally" the owner ruled out. If a future pass wants to push further (e.g., a very slight per-pack bloom-color tint), it should start from a specific visual complaint, not a speculative "make it prettier" pass.
7. **ANAMNESIS itself received no new bespoke geometry this pass** — everything new is LIMERENCE-only (the corridor accent/window fixture) or genuinely universal (door frame glow). This matches the master plan's own framing of Tier 1 item 3 as a LIMERENCE-specific gap; ANAMNESIS's single authored tone was never in question.

---

**Graphics-overhaul verification audit — 2026-07-16, follow-up (owner: "Are you sure you did enough changes to merit 'graphics overhaul'? Verify.") — VERDICT: NO, and here is the honest accounting plus the full plan for the remainder. Notes only, nothing coded this pass.**

**What "graphics overhaul" has historically meant in this repo, verified against the docs:**
1. **Spec 07 — "Visual & Audio Overhaul" (Phase Q)**: dioramas (Q1), doorway light-spill (Q2), title polish — version/fog-parallax/epitaph wall (Q3), door hover pulse (Q4), audio deepening (Q5), Usher lantern (Q6). **Fully shipped**, verified against the live code (all six subsystems present in `director.ts`/`themes.ts`/`doors.ts`/`soundEngine.ts`), and this week's diorama passes finished Q1's long tail to full 33/33 + 34/34 parity. *That* overhaul is genuinely complete.
2. **Tier 1 item 3 — "LIMERENCE visual-language rework"** (the owner's deferred "plan, don't build yet" ask, verbatim scoping notes at `UPGRADE_PLAN.md:1793-1809`). This is what the 2026-07-16 graphics session addressed — **and its own recorded bar was not met.** The owner's scoping notes say, in so many words: *"the geometry (corridor shape, particle behavior, door proportions) is still ANAMNESIS's `corridorTheme()` reused wholesale — a genuine rework would give LIMERENCE its own scene-builder functions (mirroring `scene/themes.ts`'s pattern) per floor, not just recolor the existing one"* and *"the 3D scene doesn't currently branch on light/dark at all (`buildTheme(id)` takes only the floor id), so a livelier light mode would need `buildTheme` to also receive the active theme mode."*

**What the 2026-07-16 session actually delivered, re-measured against that bar:** the migrating window (one bespoke fixture, real and good), decorative-door accent variety + neon seam (a recolor-plus, not new corridor geometry), the door frame hover glow (universal polish, related to item 17 not item 3), and per-floor **CSS** accents in light mode (chrome layer only). Verified in code just now: floors 0-3 still call the shared `corridorTheme()` wholesale via a thin wrapper, and `buildTheme(id, quality)` still has no theme-mode parameter — `director.ts:450` passes only quality. The previous entry's own "found but not fixed" list already conceded points 1 (brighter 3D light mode) and 4 (dark-mode accents), but the framing was too generous in one place: it cited D1 ("the 3D scene stays dark in both themes — decided") as settling the light-mode question, when D1 was the *legibility fix* decision and the rework ask explicitly contemplated going further ("considered an inverted door/environment palette in light mode"). That tension is the owner's to resolve, not something a session should quietly resolve in either direction. **Honest name for what shipped: corridor set-dressing + hover polish + light-mode accent tinting — roughly a quarter to a third of item 3, not the rework.**

**One additional real spec gap found during this audit (adjacent, audio not graphics):** LIMERENCE's `audio.roomAccents` is an empty object (`packs/limerence/index.ts:335`) while the L5 spec (`docs/design-limerence/09-milestones-testing.md` §L5) names two by design: *"`the-colleague` corridor hum, `the-discovery` heartbeat-adjacent low pulse — subtle, charter applies."* ANAMNESIS ships three (`junction`/`casino-pascal`/`ship`). The engine plumbing (`sound.setRoomAccent`, called by flow beside `setDiorama`) already exists and is pack-parameterized — this is purely missing pack data. Tracked here so it isn't lost; belongs to an audio pass, not this plan's graphics phases.

---

**PHASE V — the actual LIMERENCE visual rework (detailed plan, not yet built).** Ordered by impact-per-risk; each sub-phase independently shippable with its own tests + UAT, per R5. All of it lives in `packs/limerence/theme.ts` + (for V2's plumbing) `packs/types.ts`/`director.ts`/`flow.ts` — ANAMNESIS's `scene/themes.ts` builders are not touched by any sub-phase except V2's optional parameter, which defaults to existing behavior.

**V1 — Bespoke per-floor scene builders (the core unmet ask; the biggest piece).** Replace floors 0-3's `corridorTheme()` reuse with real per-floor builders in `packs/limerence/theme.ts`, each keeping the corridor's *bones* (a hall of doors — that shape is honest for a hotel) but owning its geometry, so each floor reads as a *place in a life*, not a palette:
- **Floor 0 — The Front Desk (prologue):** an actual lobby, not a corridor: a reception-desk mass (the diorama's own counter motif, environmental scale), the departures board from the creative bible §2 (an emissive panel grid, rows of small lit rectangles — "every guest listed, no checkout times"), a key wall (small emissive dots grid), one sodium key light. The title screen renders over theme 0, so this also upgrades LIMERENCE's title backdrop for free — verify epitaph wall (z≈-14) and fog parallax still compose with the new geometry.
- **Floor 1 — The Ground Floor (ages 15-18):** school-hallway-at-night: locker-band walls (repeated thin box strips instead of bare planes), a lit trophy-case/notice-board plane leaking pale light, linoleum floor (lower roughness + slight metalness for that end-of-hall sheen), one green EXIT-sign accent (fits the existing accent infra). The "class group chat as a character" (bible §5) can be one decorative door whose seam pulses phone-blue in short bursts.
- **Floor 2 — The Second Floor (the city, 18-24):** city-apartment corridor: a window at the far end with animated neon bleed (the migrating window generalizes — here it's explicitly a window with a flickering sign outside), radiator/pipe silhouettes between doors, venetian-blind light stripes (thin alternating emissive/dark planes casting the look of slatted light on one wall), taller/narrower door proportions via the existing `DoorStyle.frameWidth` plus a new optional slab-dimension override (needs a small `DoorStyle` extension — the one shared-engine touch in V1, additive with ANAMNESIS defaults).
- **Floor 3 — The Long-Stay Wing (25-30):** the settled-in register: deeper-pile floor (darkest floor color, zero sheen), wall sconces at intervals (2-3 small warm PointLights *within the existing per-side light budget* — reallocate from the decorative-door lights rather than adding), a luggage silhouette parked outside one door, the migrating window recurring *closer* than on other floors (the unopened question, nearer now).
- **Floor 4 — The Top Floor:** currently the weakest theme in the pack — a bare floor + directional light + motes, explicitly "no custom shader (kept simple/low-risk)" per its own comment, while ANAMNESIS's equivalent act got the dawn-gradient `ShaderMaterial`. Reuse that *proven* shader pattern (same uniforms/structure, hotel palette: curtain-filtered dawn with soft vertical banding as if through hotel sheers) + a low city-skyline silhouette strip at the horizon. Lowest-risk item in V1 since the pattern already ships in `thresholdTheme`.
- **Constraints for all of V1:** per-floor mesh/light counts stay within `corridorTheme`'s own current budget (it is already the most expensive theme per the 1.3 notes — 18 decorative PointLights at high; *reallocate, don't add*); every builder quality-parameterized low/high like today; dioramas still layer in front (new geometry stays behind DIORAMA_Z or off-axis); disposal soak-tested; `LIMERENCE_FOG_COLOR_BY_THEME` kept in sync (the existing packScene test enforces this). Tests: per-floor structural assertions (the V1 signature fixture exists per floor), budget counts, dispose cleanliness, fog-map sync; UAT: full floor sweep with screenshots read back, both quality tiers.

**V2 — Theme-mode-aware 3D scenes ("livelier light mode" — needs one owner decision first).** The recorded tension: D1 shipped "light mode = readable layer only, scene stays dark" as the *legibility* fix, while the original rework ask "considered an inverted door/environment palette in light mode." **Decision for the owner, with a recommendation:** full inversion (literal daylight hotel) would fight the fiction ("the hotel at 3 a.m." *is* the game) and means re-lighting five floors twice; recommended middle path — **the "morning read"**: same geometry, but under `theme: 'light'` each floor lifts its fog color/density toward its own dawn register (~15-20% toward the Top Floor's palette), raises ambient slightly, and warms the key light — the hotel very early the *next* morning, not a different hotel. Plumbing (mechanical, pack-safe): `visuals.buildTheme(id, quality, mode?: 'dark' | 'light')` with the parameter defaulting to `'dark'` (ANAMNESIS ignores it entirely); `flow.ts` passes the active setting and re-calls `setSceneTheme` when the Settings toggle flips mid-session (today the toggle only flips a CSS class live — the scene rebuild on toggle is the one new moving part; reuse the existing fade-through pattern `syncTheme` already uses). Re-verify the light-mode HUD scrim (`styles.css`'s `.hud::before` block) still reads correctly over the lifted scene, and re-run the P3 stale-paint UAT (theme toggle mid-door-row) since this makes the toggle heavier. Tests: mode parameter defaults preserve today's output exactly; light-mode fog values differ per floor by the intended lift; ANAMNESIS's builder ignores the param.

**V3 — Accent-system completion (small, cheap, follows V1/V2 or ships alone):** (a) per-floor accent for LIMERENCE **dark** mode (the primary register — currently one flat `--gold` across all floors; needs its own WCAG derivation against `#0d1116`); (b) extend the existing `[data-act]` hook to `--panel-edge` (still flat teal on every floor); (c) ANAMNESIS deliberately stays single-tone (re-affirmed, not an oversight).

**V4 — Interlude + ambient remainder (pacing-level visual payoff):** (a) **I3, the end-of-act interlude screen** (deferred since Milestone 4, still the oldest open visual item): one composed full-screen beat between floors — floor name, one Porter line, the floor's palette bleeding toward the next floor's — cheap (DOM + existing fade infra, no 3D), big pacing payoff, and it makes V1's per-floor identities *legible as a progression*; (b) **T7's LIMERENCE-specific third effect** — "a phone lighting in the distance": one decorative door's seam flickers phone-blue on the existing 60-120s ambient timer (the accent-seam infra from the last pass makes this nearly free); (c) item 20's true remainder — a per-choice visual echo *at the door row* (e.g. the chosen door's spill color subtly reflecting the outcome's mood tint) — judged smallest-value of the batch; do last or explicitly drop.

**Recommended order: V1 (floors 4→0→2→1→3, easiest-win first) → V4a (interlude, makes V1 legible) → V2 (after the owner picks the light-mode register) → V3 → V4b/c.** V1 and V4a need no owner decision; V2 does. Nothing in Phase V touches room content, translations, or save schema; everything is behavior-additive with existing-default guarantees, same discipline as the accentColor work.

---

**Phase V — ✅ SHIPPED (2026-07-16, same day, third session).** Owner, after reviewing the plan above: liked LIMERENCE's existing theme/colors and named the codebase's real strength as *design standardized across future packs* — a direct challenge to V1's original framing ("give LIMERENCE its own scene-builder functions per floor"), which would have forked bespoke per-floor code no future pack could reuse. **Revised before writing any code:** V1 became a small set of reusable, data-configured environmental fixtures in the *shared engine* (`scene/themes.ts`), composed per floor via a `CorridorPalette.fixtures` list — LIMERENCE gets real distinctiveness by choosing fixtures + colors, not by owning unique code; a hypothetical third pack gets the identical toolkit. Owner then approved V2 as designed, and asked for V3/V4 too. All four phases shipped in one session.

**V1 — the fixture kit.** Five new shared builders in `scene/themes.ts`: `endWindowFixture` (the migrating window, generalized out of last session's LIMERENCE-only version — now callable by any pack), `bandedWallsFixture` (a repeating structured-wall pattern — lockers here, could be filing cabinets or cell doors for a future pack), `infoPanelFixture` (a grid-of-lit-rectangles board — a departures board here), `sconceFixture` (real wall lights, gated to `quality: 'high'` like every other expensive addition in this file), and `skylineFixture` (a low silhouette strip). Also extracted `dawnGradientPlane` from ANAMNESIS's own Act IV `thresholdTheme` — a genuine reuse, not a duplicate: LIMERENCE's Top Floor (previously the pack's acknowledged weakest theme — "no custom shader, kept simple/low-risk") now uses the exact same proven shader, recolored pinker/warmer for a curtain-filtered read, plus the new skyline fixture standing in for the city outside. Verified live: the result reads as a real dawn (deep violet upper sky bleeding to warm amber horizon over a clean skyline), a dramatic, tasteful upgrade over the flat single-light floor it replaced. LIMERENCE's floors 0-3 configure: Front Desk (a departures board + the window), Ground Floor (locker-band walls + the window), Second Floor (the window alone — its own existing teal/ember accent variety already carries the floor), Long-Stay Wing (sconces + the window, closer). `CorridorPalette.fixtures` defaults to empty/undefined, so every ANAMNESIS caller is untouched — verified by a new test asserting zero extra meshes when omitted.

**V2 — "the morning read."** `visuals.buildTheme` gained an optional third `mode: 'dark' | 'light'` parameter (TypeScript's structural typing means ANAMNESIS's own 2-arg `buildTheme` still satisfies the type unchanged — no edit needed there). Under light mode, a corridor floor's fog/ambient/key-light colors lift ~18-35% toward one shared warm `DAWN_LIFT` reference (not five independently re-themed floors) and fog thins — the hotel very early the *next* morning, not a different hotel, exactly the design brief's own "morning read" framing. `SceneDirector` gained `setThemeMode()`/`currentThemeId` tracking; `Game.applySettings()` calls it on every Settings save and restores the current room's diorama afterward (the mode-change rebuild is deliberately the same full `setTheme()` path used everywhere else — it clears the diorama/epitaph wall, both already restored by their own existing call sites: the title loop rebuilds the epitaph wall fresh on every re-entry, `applySettings` re-calls `setDiorama` for the current room).

**V3 — accent completion.** Dark mode (the primary, most-played register) now gets its own per-floor accent too, in the same `[data-act]` pattern as light mode's from the prior session — but derived directly from each floor's own 3D key-light color rather than re-derived, since dark mode already *is* the authored palette (Ground Floor's dark `--gold` already equalled its keyLight exactly, so it needed no override at all). `--panel-edge` now varies per floor in both themes too. Every new color hand-verified against WCAG AA (dark mode's `--gold-text` is a live `var(--gold)` alias, confirmed via how CSS custom-property cascade actually resolves per-element, not assumed).

**V4a — the end-of-act interlude (I3, open since Milestone 4).** A floor-name title card shown while the existing fade-veil is already opaque during a real act transition — deliberately layered *inside* the existing `.veil` fade rather than a new blocking step, so it costs zero additional wait and changes no test-observable timing (verified: the full 1049-test suite, including every graph/playthrough test that walks acts, stayed green throughout). **A real bug found and fixed during live verification, not just a test-timing artifact:** the first implementation called `setInterlude()` then `clearInterlude()` with no `await` between them — since neither `setSceneTheme()` nor the other calls in between yield to the browser, the two DOM mutations happened inside one synchronous stretch with no paint in between, meaning the interlude was invisible to a real player, not just to the automated check. Confirmed via an in-page `MutationObserver` (Playwright-level polling wasn't fine-grained enough to distinguish "never shown" from "shown too briefly to catch" — the in-browser observer removed all round-trip ambiguity). Fixed with a real, `speedMultiplier`-scaled awaited pause between show and clear; re-verified live afterward — the card now visibly reads (e.g. "Act I — The Ground Floor") before the new floor fades in.

**V4b — "a phone lighting in the distance" (T7's LIMERENCE-specific remainder).** A floor with `accentColor` set now rarely (jittered 60-180s) and briefly brightens its shared accent-door material in a single smooth rise-and-fall — self-contained inside `corridorTheme`'s own `tick()`, no director wiring needed. Cadence and envelope shape extracted into pure, independently unit-tested functions (`accentPulseEnvelope`, `nextAccentPulseDelay`) rather than inlined `Math.random()` calls, matching this file's own established dependency-injection pattern for testable randomness (`director.ts`'s `nextAmbientDelay`).

**V4c — explicitly not built, as originally scoped ("do last or explicitly drop").** The smallest-value item in the batch (a per-choice visual echo at the door row); dropped rather than squeezed in, per the plan's own judgment call.

**Testing.** 18 new tests in a new `phaseVFixtureKit.test.ts` (fixture composition, quality-gating, the dawn shader helper, the light-mode lift, the V4b envelope/jitter) plus 7 more in `packScene.test.ts` (LIMERENCE-specific integration: floors actually configure more than the window alone, the Top Floor reuses the shared shader, `mode` threads correctly through `limerenceBuildTheme`) plus 3 more in `colorContrast.test.ts` (V3's dark-mode accent). Full regression: `tsc` clean, **1049/1049 tests green** (28 new). Live UAT (`tests/uat/52-phase-v-visual-rework.mjs`) against the real dev server: all 4 corridor floors screenshotted in both themes (the departures board, locker walls, and Top Floor's dawn+skyline all read exactly as designed and stay tasteful/muted, not gaudy), the interlude card's fix verified via an in-browser `MutationObserver` (not just re-trusting the code), zero console errors throughout, ANAMNESIS's corridor re-confirmed pixel-for-pixel unchanged.

**Found but not fixed, noted honestly:** the sconce fixture (Long-Stay Wing) is visually subtle at the default camera framing in the screenshots taken — present and lit (confirmed via the light-count unit test) but easy to miss at a glance; a future pass could raise its height or intensity slightly if the owner wants it more legible. No other gaps found this pass — V1-V4b are now genuinely built to the bar the owner's own scoping notes described, not just the lighter set-dressing pass from the prior session.

---

# PROCESS & PLAN REVIEW — 2026-07-16, fourth session (notes only, nothing coded)

Owner asked for an assessment of the latest developments and of the plan itself: fill gaps, name the empty spots we missed, and confirm the path forward follows good software practice. Everything below was verified directly against the repo (workflow files, CHANGELOG, package.json, UPGRADE_PLAN, test files, line counts), not recalled from memory. The only files changed this pass are markdown.

## A. Assessment of the day's three coding sessions

The arc was healthy and is worth naming as a pattern to keep: **(1)** a set-dressing pass that over-claimed its own scope in its title → **(2)** an honest audit, prompted by one owner question, that measured the work against the plan's own recorded bar and found it ~1/4 delivered → **(3)** a full Phase V build that met the bar *and* was course-corrected mid-plan by the owner's standardization principle (fixtures as shared, data-configured engine pieces rather than forked per-floor code). Two process wins to repeat: the audit habit of re-reading the original owner ask verbatim before claiming an item closed; and live UAT catching a real paint-timing bug (the invisible interlude) that 1049 green unit tests could not see — the DoD's "live verification, screenshots read" step is earning its cost. The fixture kit also quietly strengthens Tier 4 item 23 (a third content pack): the marginal cost of a new pack's visual identity just dropped substantially, which is exactly the direction the owner's "standardized design across future vestibules" principle points.

## B. The empty spots — real gaps this review found, most important first

**B1. Release, deploy, and changelog governance — the biggest gap, and it is not a code gap.** Verified (with one self-correction during this very review: a first, truncated read of the workflow file suggested the deploy was manual-only — the full trigger block shows `workflow_dispatch` **and** `release: published`, matching README line 131, so deploy-per-release is a deliberate design, not an accident): (a) the design is fine, but **no release has been published since `v1.0.0-rc.1` (2026-07-13)** — so the live GH Pages site predates the diorama-parity passes, both graphics passes, and all of Phase V; the owner may well be looking at a build with none of this week's visual work in it. (b) `CHANGELOG.md`'s newest entry is that same rc.1; roughly ten sessions of user-visible work since have no changelog presence. (c) `package.json` still says `1.0.0-rc.1` — by normal rc discipline an rc stabilizes toward release; this one has instead absorbed multiple feature passes, which quietly voids what "rc" means. The root cause: none of the standing DoD steps says "publish," so verified work piles up unreleased indefinitely. **Recommendation (first next session, no gameplay code):** a release-hygiene pass — finalize the CHANGELOG (an Unreleased section is added in this same pass), decide `1.0.0` vs `rc.2`, bump + tag, gate on one full UAT batch + a fresh dist-web smoke test (B3), then publish the release, which deploys Pages automatically by the existing design. Optionally add a "publish or consciously defer" line to the DoD so this gap can't silently reopen.

**B2. Docs-governance drift.** The repo's own charter (Part 2, above) assigns roles: README = player-facing truth, CHANGELOG = history, UPGRADE_PLAN = append-only dev log. Verified: UPGRADE_PLAN's log effectively stops at 2026-07-13; since then the dev log has de facto lived here in doc 13. That migration was reasonable (this doc is the living plan), but it happened silently, which is how stale-doc bugs start. **Fixed the cheap way this pass:** a redirect note appended to UPGRADE_PLAN pointing future readers here — no history rewritten, no backfill attempted. The charter should be read as amended: doc 13 is now the canonical dev log.

**B3. Specific verification debt (each small, none blocking, all real):**
- The Phase V plan itself said: *"re-run the P3 stale-paint UAT (theme toggle mid-door-row) since this makes the toggle heavier."* Phase V shipped without doing it. The unit-level `staleThemePaint.test.ts` still passes, but the live re-check with the now-heavier toggle (full scene rebuild) was the stated requirement and remains open.
- The **full UAT batch** (`run-all.mjs`, auto-discovers all 52 scripts) has not been executed end-to-end since script ~43; scripts 44-52 each passed individually at creation. Batch interactions (shared profile state, port reuse) are unverified. Fold into the B1 release gate.
- The **production-build smoke test** (script 47 against a fresh `dist-web/`) predates Phase V — the fixture kit/mode param has never been exercised in a real minified build. Same release gate.
- **R7 persona-whisper test gap** (recorded in the seventeenth-session entry, still open): 3 of 4 ANAMNESIS touches tested, en/cs/fa only, not pack-parameterized; LIMERENCE's 4 touches have zero automated token-survival coverage. Already fully specced above; a ~1-hour item.
- Item 19's long-deferred verification set (full playthrough sweep, EN/CS/FA Playwright matrix) remains deferred — unchanged status, restated so it isn't mistaken for closed.

**B4. Content gaps confirmed still open (no change in status, consolidated here so the list is one place):** LIMERENCE `audio.roomAccents` is `{}` against the L5 spec's two named accents (engine plumbing exists; this is a small authoring pass, audio not graphics) — **since resolved, see B8**. ~~Tier 1 item 2 (cs/fa translation-quality re-review) remains the largest genuinely open engineering-side item~~ — **resolved 2026-07-19, see item 2 above.** T5 (Porter/Usher pattern-barks) remains open writerly work. T1 (real audio files) remains owner-blocked.

**B5 — RESOLVED (2026-07-16, follow-up): T6 is not a gap for LIMERENCE; no content needed.** Re-counted precisely (the "6 live sites" figure above was inflated by counting each language's copy of the same dynamic-beat function separately — the real count is 4 distinct cross-references: `the-screenshot`→act4 dynamic beat, `the-rumor`→Understory via `choseInPrior`, plus two uses of `choseIn` that are mechanical, not narrative — `the-morning-desk`'s ending-selection logic and `the-summer-ends`'s gate-availability check). Read the actual beat content rather than trusting the count: LIMERENCE's final gate room (`the-morning-desk`, the Porter's "audit") runs **four separate dynamic-beat callbacks in sequence** — one keyed to which choice was taken at `the-screenshot`, one keyed to a `confessed-whole`/`carried-alone`/`trickle-truth` flag set earlier in the run, one keyed to whether `s.memoryLost` was ever traded away at `the-rumor`, plus a closing "stand by all of it?" reflection choice — each addressing the player's specific earlier choice by name, in the Porter's own voice. This is a genuine, working instance of "consequence made felt," and structurally it's a *systematic* echo chamber built into the pack's core design from the start, arguably a richer realization of T6's intent than ANAMNESIS's two standalone retrofit pairs. **Verdict: no T5/T6-style content pass needed for LIMERENCE.** Nothing coded this pass — this is a documentation-only confirmation, closing an open question rather than opening new work.

**B6. Architecture watch-item, not yet actionable:** `flow.ts` is now 1,116 lines (the "acceptable for two packs, split if a third lands" note was written at ~900). Still coherent, still fine — but the fixture kit just made a third pack cheaper, so the split trigger is closer than it was. No pre-emptive refactor recommended; just keep the number in view.

**B8 — RESOLVED (2026-07-18, follow-up): `roomAccents` authoring pass shipped.** Closed the last open L5 spec gap noted in B4: LIMERENCE's `audio.roomAccents` was `{}` against the spec's two named accents. `src/audio/soundEngine.ts`'s `RoomAccent` type gained two new kinds — `'colleague-hum'` (the-colleague: a fluorescent-office corridor hum, two closely-detuned ~118-120Hz tones beating at ~1.5Hz, pitched well above ANAMNESIS's junction sub-bass drone so the two packs' accents never read as the same room) and `'discovery-pulse'` (the-discovery: a heartbeat-adjacent low double-thump on a 48Hz sine, jittered every 2.6-3.4s, quiet enough to read as unease rather than a literal monitor beep). `setRoomAccent`/`clearRoomAccent` generalized to support a multi-oscillator drone group (one shared gain node, N oscillators) so `colleague-hum`'s two beating tones share the same start/stop cleanup path as `junction`'s single tone; the tab-hidden `visibilitychange` resume handler was extended to re-arm `discovery-pulse`'s timer alongside `ship`'s existing creak. `packs/limerence/index.ts`'s `audio.roomAccents` now maps both real room ids. New source-level regression tests in `audio.test.ts` (no AudioContext in the Node vitest environment, so — same convention as the existing LFO-leak test — these assert the dispatch/cleanup code shape rather than the actual audio) plus the pre-existing pack-parameterized "every room accent key names a real room" tests in `packAudio.test.ts`/`packConformance.test.ts`, which now also exercise both new keys for free. `tsc` clean, full suite 1059/1059 green.

**B9 — the full UAT batch's first run this session was self-contaminated; diagnosed and re-run clean (2026-07-18).** Resuming the release-hygiene batch mid-run, source files (`soundEngine.ts`, `packs/limerence/index.ts` for B8 above) were edited while the batch was still executing against the live dev server. Vite's HMR reloaded pages mid-navigation, producing `page.reload: net::ERR_ABORTED`/`Execution context was destroyed` errors in scripts 20/23/24, plus two flaky fixed-700ms-wait failures in the new act-sweep scripts 17/18 (root-caused by reading the actual error, not by re-running blind — the wait raced a post-reload scene rebuild under sandbox CPU contention, confirmed by the failure landing on a *different* room each retry with nothing else running). Both real issues were fixed properly, not papered over: 17/18 switched to a `waitForSelector('.text-panel')` wait; scripts 20/23/24 needed no code fix (they were victims of concurrent edits, not a real bug — confirmed by their passing clean once nothing else touched `src/` during the run). Two further scripts (42, 44) failed for an unrelated reason — they need dedicated local servers (a static landing-page server on 8765, a `?pack=limerence` LIMERENCE dev server) that this session simply hadn't started yet; 44 additionally still pointed at a since-removed dedicated `dev:limerence` port from before item 13's single-bundle merge and was updated to the modern `?pack=limerence` shared-server pattern used by scripts 14/18. A second, fully clean re-run (all three servers up, zero concurrent source edits) went 51/51 — that run's results are the ones committed as the release gate; the contaminated run's results were discarded rather than kept, since they'd misrepresent real product state. **Process note for future sessions:** never edit `src/`/`public/` while a UAT batch is running against the same dev server — Vite's HMR will contaminate in-flight browser automation. Either pause edits until the batch finishes, or use a separate dev server instance for editing vs. testing.

**B7. Minor polish backlog (each optional, none scheduled):** sconce legibility (B-noted in Phase V); the interlude shipped as its minimal version (translated floor name only — the original I3 sketch also imagined a Porter line and a palette bleed; the delta was deliberate scope, and the richer version needs new translated content, so it inherits R1's care if ever done); V4c (per-choice door-row echo) formally dropped; ANAMNESIS deliberately received no fixtures (its bare corridor is authored — re-affirmed, not an oversight).

## C. Best-practices scorecard (honest, brief)

**Doing well:** test discipline (787 → 1049 green across the week, every feature landing with tests, pure-function extraction for testable randomness); accessibility as regression-tested constraint (WCAG math in CI, not a one-time audit); behavior-additive defaults with explicit opt-ins protecting the sibling pack; honest audit trail (the overclaim was caught and corrected *in writing*); one-commit-per-logical-unit with accurate messages. **Needs attention:** release cadence (B1 — the rc absorbing features is the one genuine violation of standard practice found); deploy pipeline manual-by-accident (B1); changelog stale (B1, patched this pass); the dev-log drift (B2, patched); UAT batch not re-run as a batch (B3). Notably, every weak spot is *process around the code*, not the code — the correct priority for the next session is therefore publishing, not building.

## D. The path forward, in order

1. **Release-hygiene session — DONE except one external step (2026-07-18).** CHANGELOG finalized, version bumped to `1.0.0-rc.2`, full UAT batch run clean (51/51, including the dist-web production-build smoke test — see B9 below for how the first attempt at this got contaminated and how that was diagnosed and fixed). **Two environment-boundary findings, both blocking, neither a product bug:**
   - **Tag push — RESOLVED (2026-07-18, follow-up).** This sandbox's git proxy rejects tag-ref pushes with `HTTP 403` (scoped to the one designated branch ref only), and no GitHub MCP tool creates a tag/ref remotely either — so the tag was left for the owner rather than forced. Owner created `v1.0.0-rc.2` themselves via GitHub's Releases UI ("Draft a new release" → type the tag → "Create new tag on publish"), confirmed live via `get_tag` (`refs/tags/v1.0.0-rc.2` → commit `4d1f7fe3f8facdcc37283e0f84be9088410d1e8c`, the release-hygiene doc-update commit). No further action needed.
   - **Pages deploy — RESOLVED (2026-07-18, follow-up).** Failed at `actions/configure-pages@v5` (`Get Pages site failed... verify Pages enabled`) — the build itself (both packs + rozcestník) succeeded end-to-end; this was purely that GitHub Pages had never been turned on, and is unavailable for **private** repositories on the Free plan at all (a platform restriction, not an API-workaround-able setting). No GitHub MCP tool exists for repo visibility or Pages settings either (checked; the server only exposes content/PR/issue/Actions operations, not admin settings) — this genuinely needed the owner acting via the GitHub website. Before recommending it, checked the repo for anything that would make going public risky: `git log --all` for `.env`/`.pem`/`credentials`/`secret`-named files plus a content grep for API-key/token/private-key patterns across every tracked file — found only two harmless Vite build-mode `.env` files (`VITE_PACK`/`VITE_TITLE`/`VITE_DESCRIPTION`/`VITE_FAVICON`, no secrets), nothing else. Presented the owner three options; **owner chose make-public**, flipped repo visibility and set Pages source to GitHub Actions themselves. Re-dispatched `deploy-pages.yml` (run #5, id `29665670735`) — all 8 steps green including `configure-pages`/`upload-pages-artifact`/`deploy-pages`. **Live at https://danieldmas.github.io/RogueLikeGame/.** Release-hygiene pass is now fully closed — nothing left blocked on tooling or the owner.
2. ~~**Small verification batch:** P3 heavy-toggle live re-run; R7 test pack-parameterization; the T6-LIMERENCE confirm (B5).~~ — **R7 and B5 done, 2026-07-18** (see above / B5 entry). P3 heavy-toggle live re-run remains the one still-open item from this batch.
3. ~~**`roomAccents` authoring pass**~~ — **done, 2026-07-18** (see B8 above).
4. ~~**Tier 1 item 2 — cs/fa quality re-review**~~ — **done, 2026-07-19** (see item 2 above).
5. **Game-experience fix batch (2026-07-19 — in progress).** A dedicated full-development review with a player-experience focus (`15-game-experience-review.md` — code review, animation audit, act-headline timing verification, and an independent blank-spot sweep) confirmed the owner's suspicion that the end-of-act floor-name card did not stay up long enough (260ms hold vs. its own 300ms fade-in — cleared before it even finished appearing, and orphaned from the veil fade-out its design intended), and surfaced a prioritized fix list. Progress against the review's §7 order: ✅ done — the interlude hold + clear-after-fade + a pacing-constant guard test; the prologue's contradictory single-door bark (`first-door` bark, both packs × 5 languages); the crash-recovery reload dropping fullscreen; the end-screen triptych's missing reduced-motion rule; the silent wipe on doubly-corrupt saves (`wasReset()` + `showProfileResetToast()`, translated ×4 languages, 5 new tests); the mid-room resume experience (E1 — a `resumedFromSave` flag suppresses the redundant act-intro/aside replay and a new translated "resumed-mid-room" bark recaps the moment the old code would otherwise skip straight to the field note, since every room in both packs has exactly one stage; live-verified with new UAT script `42-mid-room-resume-recap.mjs`); the truncated Usher walk-in (A2 — `USHER_WALK_SECONDS` lowered from 2.5s to 1.8s so the approach walk always finishes before the 2.0s camera dolly's `done` callback starts the walk-home tween, guarded by a new constant-relationship test); end-screen options (E4 — Settings/Vestibule buttons, mirroring the pause menu's own handling); keepsake held-resource invisibility (E5 — a "you carried" line in the end screen's Morning Report block plus a spent-confirmation toast, both live-verified with new UAT scripts 43/44). Still open: **E6 implementation** — the owner decided (2026-07-20) to defer the Examined Path offer to right after the first significant choice of a first-ever run; the complete ready-to-implement design (a persisted `examinedOfferPending` RunState flag, firing before the `shouldShowReflections` check so an accepted offer pays off with that same choice's reflections, the accepted Act-I-aside trade-off, and the exact test/UAT updates: scripts 01/19/20 pin the old offer-at-start order) lives in the review doc **§8**, alongside a minor new finding (**§9 N1**: the end screen's data is computed before its action loop, so a language switch via E4's new Settings button reshows stale-language text — batch its fix with the E6 pass). Full detail and the fixing order live in the review doc §7-§9. **A second full review (2026-07-20, `16-full-review-2026-07-20.md` — all functions, code, and played experience, taken after the fix batch landed) confirmed no regressions in any of the five shipped batches and surfaced four new small findings, best batched with the E6 pass: R1 — every toast halves its reading-time hold under reduced motion (the exact backwards logic the interlude fix called out, worst on the E3 profile-reset notice), plus the still-missing toast-hold guard tests the earlier review's §6 proposed; R2 — "Reset all progress" leaves the cross-pack shared display settings intact despite promising total erasure in all five languages; R3 — door barks have no aria-live, so screen readers never hear the Usher/Porter at the door row; R4 — the end screen's "doors you never opened" list is deterministic in room-declaration order, showing near-identical teasers every run. **A same-day second sweep (that doc's §8 — full overlay layer, input handling, audio/voice, utilities) added: S1, a real i18n bug — the "last message" sentence is stored as raw English source text and displayed verbatim in the Ledger, codex, and end-screen recap for every non-English player, while the sibling Morning Report path translates correctly; S2, Escape-close inconsistency (Credits lacks it; persona/Examined-offer undocumented-deliberate); S3, locked codex cards are focusable dead buttons (no `disabled`); S4, a failed profile import leaves its confirm button permanently armed. The next coding batch is now E6 §8 + N1 + R1-R4 + S1-S4, all small, one pass.** That doc's §7/§9-bis hold the full consolidated backlog.**
6. **T5 pattern-barks** writing-first pass.
7. Optional polish backlog (B7) opportunistically or never.

---

## RECOMMENDED ORDER (if/when coding resumes)

Every item that was open as of the 2026-07-14 notes and didn't need new authored content or a dedicated translation pass is now shipped (Tier 2's old items 6–14, the I9 audit, quality-threading, docs banners, item 21's LIMERENCE UI-chrome coverage backfill, and — as of 2026-07-15's thirteenth session — item 5's choice-aftermath echoes and the Fable review's H1/H2/M2/H3/H4/M6 fixes). What's left genuinely does need its own dedicated session, or is small enough to slot in opportunistically:

1. ~~**Tier 1 item 2** (cs/fa translation QA) as its own dedicated multi-dispatch pass~~ — **done, 2026-07-19** (see item 2 near the top of this doc). The `heartsAriaLabel`/`lucidityTooltip` terminology note was confirmed already resolved; the axis-triptych/echo translations (items 13/14) were in scope of the Act II-IV dispatches that covered their room files and held up.
2. **Tier 1 item 4** (Porter/Usher pattern-barks) as a writing-first pass, both packs × 5 languages.
3. **Tier 1 item 3** (LIMERENCE visual-language rework) as its own design+build session.
4. ~~**New items 11–14**~~ — **all four now done**: 11, 12, 14 (2026-07-16, fifteenth session), and item 13 (2026-07-16, sixteenth session — the single-bundle-deploy architecture fix, done properly with real before/after bundle-size verification, per its own standing requirement). See their entries above.
5. **Tier 1 item 1** whenever the owner supplies audio files — zero code needed now that H3's URL-path bug is fixed; drop files + run the manifest script.

Small, self-contained polish that doesn't require a dedicated multi-session pass (a door-hover enhancement, an end-of-act interlude, a diorama or two) can be picked up opportunistically in a single sitting, verified with the full Definition of Done, and folded into the ledger below without waiting for its tier's "big" pass.

## NEXT STEPS — recommendation as of 2026-07-15 (thirteenth session)

Asked directly "where should this project go next": the game is content-complete, translated, tested (972 tests), and has now had two independent review passes (this session's own prior work, plus one genuinely independent Fable-model pass) with every found release-blocking or player-visible bug fixed and verified. There is no further engineering work standing between here and a real release candidate being *solid* — what's left is either (a) content the owner hasn't supplied yet, (b) work that's explicitly gated on a dedicated pass by CLAUDE.md's own standing rule, or (c) genuine architecture investment with a real cost/benefit tradeoff. In priority order:

1. **Ship what's blocked only on the owner, item 1 (voice/music files).** This is the single highest-leverage remaining action and requires zero further code — the architecture is built, tested, and (as of this session) has its deploy-path bug fixed. Recording/sourcing audio is a creative decision outside engineering scope; flag it back to the owner as "ready whenever you are."
2. **Run the cs/fa translation QA pass (item 2) as its own dedicated session**, per-act dispatches as already scoped. This is genuinely the largest remaining *engineering-adjacent* body of work and the one CLAUDE.md itself calls out as a standing TODO — don't let it keep sliding behind opportunistic feature work indefinitely. A natural moment to also verify this session's own new translations (the axis triptych, the two choice-aftermath echoes) against the same native-speaker-register bar, rather than treating a first-context-first-pass draft as automatically final.
3. ~~**Do the small hardening batch (new items 11, 12, 14)** in one sitting~~ — **done, 2026-07-16, fifteenth session** (see the dated entry above). ~~Item 13 (bundle splitting) still deliberately does NOT belong in that batch~~ — **also done, 2026-07-16, sixteenth session, as its own separate pass with the before/after verification this note called for** (real bundle sizes measured, both packs confirmed to still load and play correctly via the dev server override and the actual `dist-web/` build artifact). Surfaced one new, smaller, genuinely separate finding while verifying it — see item 18.
4. **Treat the Porter/Usher pattern-barks (item 4) and LIMERENCE visual rework (item 3) as genuinely separate creative sessions**, not fit into a coding-hardening pass — both are writing/design-heavy and deserve the same "own dedicated pass" respect CLAUDE.md gives translation work, for the same reason: rushed authored content or rushed visual design reads as rushed to a player in a way a bugfix never does.
5. **Process note for future sessions**: this session's independent-review approach (dispatching a background review agent on a *different* model than the one that's been doing the implementation work, explicitly asked to find what prior passes missed rather than re-confirm what's already known) surfaced real bugs — including one in code shipped earlier the same session — that self-review across many consecutive sessions had not caught. Worth repeating periodically (e.g., every few sessions, or before any release-candidate tag) rather than only at the start of a review cycle. The codebase map (`14-codebase-map.md`) should keep being read *and updated* as part of that same discipline — it was several sessions stale (missing all game-content tables, several file-size figures 20-30% low) before this session's rewrite, which is exactly the kind of drift that makes a fresh reviewer redo work a map should have shortcut.

---

# Diorama occlusion + LIMERENCE back-button clip fix — 2026-07-21

Owner report: "the dioramas (objects in each door) have the right size, but
they are covered by the text/choices window... put them a bit up... do not
make them much smaller. I noticed it in Limerence. Also make sure the back
buttons in the doors are present." Investigated live (real door-click →
`walkThrough` → screenshot, not just `jump()`, since `jump()`'s reload path
resumes mid-room without ever animating the camera in and so never
reproduces the close "parked" framing a real player actually reads beats
from) before touching any code.

**Root cause 1 — diorama occlusion.** The prior "bigger, closer" diorama
pass (`DIORAMA_SCALE = 1.6`, `DIORAMA_Z` moved closer) made every vignette
fill more of the frame; most builders (in both packs, but especially
LIMERENCE's floor-level furniture — beds, tables, counters) anchor their
local origin at or near `y = 0`, which is exactly the screen band the
bottom-anchored, un-capped-height text/choices panel occupies. **Fix:** a
new `DIORAMA_Y_LIFT = 0.6` constant in `scene/director.ts`, applied as
`d.group.position.y += DIORAMA_Y_LIFT` in `setDiorama` (after the existing
scale, before adding the group to the scene) — a pure vertical translation
of the whole group's world position, not a rescale, so nothing shrinks.
The diorama fill light's Y position was updated to track the same lift so
the raised group stays lit. Single tunable constant, same pattern as
`DIORAMA_SCALE` itself — no changes to any of the 60+ individual diorama
builder files in either pack.

**Root cause 2 — LIMERENCE back button.** `.beat-back` (the F4 "reread the
previous beat" button) was positioned at `left: -6px`, deliberately poking
outside `.text-panel`'s own box as a small floating tab. LIMERENCE's
`.text-panel` has a `clip-path` (its distinctive cut-corner chrome) that
clips *all* descendant rendering to the element's own box — so in
LIMERENCE specifically, the button's outer edge was silently cut off by
that clip-path; ANAMNESIS has no such clip-path on `.text-panel` and was
unaffected. **Fix:** changed `.beat-back`'s `left` from `-6px` to `4px` —
fully inside the box in both packs, renders identically and correctly
everywhere. One property, no touch to the LIMERENCE clip-path itself
(which has its own separate aesthetic rationale).

**Verification.** New `dioramaPanelOcclusion.test.ts` (5 tests) locks in
both fixes' shape at the source level (the lift constant's bounds, its
application order in `setDiorama`, the fill light tracking it, the back
button's non-negative left offset, the LIMERENCE clip-path rule staying
intact). Full regression: `tsc` clean, **1142/1142 tests green** (5 new).
Live UAT: new scripts `55-diorama-lift-and-back-button.mjs` (jump()-based —
verifies the back button's on-screen geometry stays inside its panel box
once visible, 2nd beat onward), `56-diorama-lift-real-walkthrough.mjs`
(a real Begin → prologue-door-click → `walkThrough` flow — the actual
close "parked" framing the report was about; screenshot confirmed the
diorama's key objects sit fully above the panel with room to spare, not
clipped), and `57-diorama-lift-anamnesis-sanity.mjs` (confirms no visual
regression in ANAMNESIS, where the lift is shared code but the reported
bug wasn't). All three pass; screenshots reviewed directly, not just
asserted programmatically.

---

# Act-headline duration + title-scale typesetting — 2026-07-21

Owner directive: *"focus on whether the act headlines before each act are
shown for long enough, at least 4 seconds."* Measured first, then fixed.

**Measured baseline (the answer was no).** The act headline is the
end-of-act floor-name interlude card (`.interlude`, Phase V4a), shown by
`syncTheme()` while the veil is opaque. Its real timeline was:
`fade(true)` 720ms (card not yet mounted) → `setInterlude()` starts a 300ms
CSS opacity transition → `INTERLUDE_HOLD_MS` **1500ms** → `fade(false)`
720ms (the card rides the veil out) → `clearInterlude()`. So the headline
was on screen ~2.2s total, and — because the hold overlaps its own
fade-in — only **~1.2s at full opacity**. Well short of the 4s bar.

**Fix.** `INTERLUDE_HOLD_MS` 1500 → **4300ms**, chosen against the strict
reading of the directive rather than the generous one: 4300 − the 300ms
fade-in it overlaps = a full **4000ms at full opacity**, plus ~720ms more
still-legible time riding the veil's fade-out (~5.3s total on screen).
Unchanged: the hold is still never scaled by `reducedMotion` (reading time
is not motion — the R1 principle), only by `speedMultiplier` so `?uat=1`
runs don't wait on human pacing.

**Second, related fix found while reading that code.** `.interlude`'s own
source comment specs it as *"a large, centered floor-name title card"* —
but it shipped at `font-size: 15px`, i.e. **smaller than the 17.5px `.beat`
body text**, so it read as a caption rather than a title. Harmless when it
flashed for a second; conspicuous now that it owns an otherwise-empty
screen for 4+ seconds. Retypeset to `clamp(19px, 3.2vw, 38px)` with
`line-height: 1.35` and `padding: 0 8vw`, so it scales with the viewport
and wraps gracefully.

**Verification.** New `tests/uat/58-act-headline-duration.mjs` measures the
real `.interlude.show` lifetime with a `MutationObserver` installed via
`addInitScript` (armed before app code, since `jump()` reloads the page and
would destroy a later-installed observer), then divides out the known UAT
speed multiplier: observed 1330-1379ms at 0.25x → **~5.3-5.5s on screen at
real speed, 4000ms of it at full opacity**. Both the hold constant and the
title-scale floor are also pinned by unit tests in
`interludeTiming.test.ts`, which now read the 300ms fade-in and the 17.5px
body size from the real CSS rather than duplicating them. Typesetting was
verified by mounting the card directly (bypassing game timing, no race) at
three widths of content — short English, a deliberately over-long Czech
string, and Farsi RTL — all centered, wrapping correctly, zero overflow
(`scrollWidth === clientWidth` in every case). Regression risk from the
longer hold (every act transition now waits ~700ms more in UAT mode) was
checked against the two scripts that actually cross act boundaries: UAT 17
(ANAMNESIS, acts 0-5) and UAT 18 (LIMERENCE, acts 0-4 + Understory) both
still pass. Full suite: `tsc` clean, **1144/1144 green** (2 new).

**Honest notes.**
- A screenshot of the card mid-hold could not be captured through the game's
  own timing: `?uat=1` compresses the interlude to ~1.1s and this sandbox's
  headless screenshot latency consistently overshot it. Stopped after one
  repair attempt per CLAUDE.md rather than iterating. This is a harness
  limitation, not a product one — the MutationObserver measurement is
  stronger evidence than a screenshot would have been, and the typesetting
  was verified visually via the direct-mount route instead.
- **Open design question for the owner, not decided here:** the headline is
  unskippable, so a full run now spends ~21s (4 transitions × ~5.3s) on
  floor-name cards. That is exactly what was asked for, so it ships as
  asked — but if it starts to read as a wait on replays, the natural
  follow-up is click/Space-to-skip *after* a 4s minimum has elapsed, which
  would preserve the floor for first-time players without taxing repeat
  ones. Deliberately not built unilaterally, since a skip could undercut
  the directive.
- The altitude review's theoretical concern about the previous commit's
  uniform `DIORAMA_Y_LIFT` (that non-floor-anchored dioramas might get
  pushed out of frame) was **checked empirically and did not materialize**:
  the highest-anchored diorama in either pack (LIMERENCE's
  `the-second-account`, local y=0.9) renders comfortably mid-frame with
  ample headroom. No per-diorama bounding-box lift computation added — it
  would be complexity with no observed benefit.

---

# Player-perspective pass: the prologue diorama — 2026-07-21

Owner directive: *"check it from the position of the user / player and
enhance everything you find."* Approach: actually walked the real
first-time-player path in a browser (title → auto-About → persona skip →
prologue beats → prologue door → first room → choice → outcome → field
note), screenshotting each beat and **reading** them rather than reading
more source. Zero console/page errors across the whole path.

**The one significant finding, and it is the worst-placed one possible.**
The `waiting-room` diorama — the prologue's, i.e. the first and closest
diorama every single player sees — rendered as untextured placeholder
geometry: a featureless ~520px grey slab (the bench, 40% of screen width)
and a pale blue-grey monolith with a white disc on it (the window panes and
clock). It did not read as "a bench, a handless clock, a recursive window";
it read as unfinished.

**Why it had gone unnoticed.** It was authored when dioramas sat at
`DIORAMA_Z = -10` with no scale multiplier — small and distant, where five
bare primitives are exactly right. Since then `DIORAMA_SCALE = 1.6` and
`DIORAMA_Z = -7.5` landed (the owner's "bigger/closer" request), the
post-`walkThrough` camera parks ~3.1 units from the diorama rather than the
corridor framing's ~15, and this session's `DIORAMA_Y_LIFT` raised it clear
of the text panel — so those primitives are now seen roughly **5x** their
intended screen size, with nothing to reward the magnification. The lift
did not create the problem; it finished revealing it.

**Fix — detail added, nothing shrunk** (respecting the standing "do not
make them much smaller" directive), all within the existing
primitives-only vocabulary (flat colour/emissive `MeshStandardMaterial`,
one light, no textures):
- **Bench** is now slatted — 4 seat slats with gaps, 3 backrest slats, two
  legs — instead of one solid box. The gaps are what make it read as
  waiting-room furniture at this size. Same footprint as before.
- **Clock** is now a real dial: dark rim, dim face, 12 tick marks, and
  deliberately **no hands**. This matters more than it sounds: the room's
  own field note says *"The clock has no hands because recollection does not
  happen in time."* The authored text was pointing at a detail the player
  could not previously perceive — it was an indistinct pale blob. Now the
  visual and the prose reinforce each other, and the missing hands become
  the intended unsettling focal point rather than looking like a modelling
  omission. Also moved off the window (they overlapped into one cluttered
  shape) onto the wall above the bench, so bench/clock/window compose as a
  room.
- **Window** gained a frame and a mullion cross so it reads as a window,
  and its emissive was cut hard (0.35/0.5 → 0.12/0.18) — against the shared
  front-fill light `setDiorama` adds, the old values blew the panes out to
  flat white.
- **Its own point light** softened 0.55 → 0.38, since that shared fill
  light now does most of the work and the two were double-lighting the same
  surfaces.
- **Cylinder segments raised on `quality: 'low'`** (12 → 20) and tick count
  no longer quality-gated. `low` is the *default for new profiles*, i.e.
  what most players actually see, and a 12-sided cylinder read as a visible
  polygon at this size. Two small cylinders' segments are negligible next
  to the per-theme particle fields.

**Verification.** Re-walked the same player path and compared screenshots
before/after: the bench now reads as slats, the clock as a handless dial,
the window as four panes. `dioramas.test.ts` gained 5 tests pinning the
properties that made it work rather than exact geometry (mesh count in
25-40 at both qualities — well above the 5 primitives it was, still under
the existing ceiling; no material's `emissiveIntensity` above 0.3, so
nothing creeps back to light-source brightness; exactly two cylinders,
i.e. rim + face and no hands). Full suite `tsc` clean, **1149/1149 green**
(5 new). UAT 17 (act sweep, includes `waiting-room`) and UAT 49 (the
ANAMNESIS diorama screenshot sweep) both still pass.

**Noted, not acted on:** the other dioramas were spot-checked at the close
framing and hold up — this was a genuine outlier, not the first of 34
identical problems, so no blanket re-detailing pass is proposed. If a
future pass wants one, the cheap tell is any diorama whose whole motif is
fewer than ~8 primitives.

---

# Player-perspective pass, continued: two more diorama nits + a systemic
# Act III wash-out bug — 2026-07-25

Owner directive: *"develop, continue, do a recheck, playing, but fixing
run, figure out new tests if possible, new uats, everything... make it all
perfect."* Direct continuation of 2026-07-21's prologue pass — the "cheap
tell" it left as a note (any diorama whose motif is fewer than ~8
primitives) is exactly how the next two findings surfaced.

**A permanent QA tool, built first because everything else needed it.**
`jump()` (the `?uat=1` handle's room-teleport) resumes straight into a room
without ever calling `SceneDirector.walkThrough()` — the camera is left
wherever it was (typically the wide corridor framing), not the close
resting position a real door-crossing leaves it in. Every screenshot in
2026-07-21's pass had been taken by hand-walking the real path for exactly
this reason. Added `SceneDirector.snapCameraToRoomReading()` (+ a
`snapCameraForScreenshot()` UAT-handle method + a `jumpAndSnap()` test
helper) — a pure, no-animation reproduction of `walkThrough()`'s resting
`camera.position`/`lookAt`, so any future diorama QA screenshot can jump
straight to a room and see what a player actually sees while reading it,
without playing there by hand. This is what made the rest of this pass
possible at all.

**Two more instances of 2026-07-21's bug class**, found the same way (a
mesh-count heuristic to shortlist candidates, each validated by an actual
close-camera screenshot rather than trusted blindly — several low-mesh
dioramas turned out to be deliberately minimal and read fine, e.g.
`boulder`'s single icosahedron):
- **`buridans-queue`'s clock contradicted its own room text.** The beats
  explicitly say this clock has *"hands, unlike anywhere else in this
  place"* — a deliberate callback to the prologue's handless one — but the
  diorama drew the same bare glowing disc. Gave it two hands. Also caught
  a second, unrelated bug on the same object while there: its local anchor
  height (clock at y=1.6) predated `DIORAMA_Y_LIFT` and was pushed to a
  visible sliver at the very top of frame, overlapping the header bar —
  lowered the whole motif (frames 0.9→0.6, clock 1.6→0.98) rather than
  building a general bounding-box auto-fit system for one instance.
- **`last-message`'s counter (Room 19, the S1 hook room) was one plain
  box** standing in for "a counter worn smooth by however many elbows"
  (the room's own field note) — read as a single oversized dark rectangle
  with a barely-visible pen/slot. Added a lighter, warmer worn-top slab
  distinct from the body, a front trim lip, and scaled the pen/slot up
  proportionally.

Both fixed within the existing primitives-only vocabulary, both
regression-tested (`dioramas.test.ts`: 2 new tests for `buridans-queue`'s
hands + no-off-frame-height, 2 new for `last-message`'s distinct
body/top/trim colors + legible pen/slot), both verified live via
before/after screenshots.

**The significant finding: Act III's own theme was washing out every
room's diorama, not just these two outliers.** Sweeping the remaining
Act III rooms (`teleporter`, `debt-of-dead`, `editor`, and others) at the
close reading-camera position showed something different from the first
two fixes — not under-detailed geometry, but every diorama drowned in a
flat navy-blue haze regardless of its own materials (`editor`'s amber-lit
drawer, unmistakably `0xd4b36a` in source, rendered as blue-grey).

Root cause, confirmed by computing it and then verifying the computation
against a wide-framing (no-snap) screenshot of the same room: Act III's
`mirrorTheme()` (`src/scene/themes.ts`) rings 8 large (1.7×1.15) semi-
transparent "floating memory" boxes around the room at
`x=cos(angle)*9.5, z=-12+sin(angle)*7`. A real door crossing always rests
the reading camera at world `z = DOOR_Z + 1.2 = -4.4`, and a *middle* door
in any 3-door room rests at `x=0` too (`doors.ts`'s spacing puts the
middle lintel exactly on-axis) — and one of the 8 boxes (whichever index's
angle lands on the x=0 axis) sat at exactly `(x=0, z=-5)`, only ~0.6 world
units in front of that resting camera. Its own semi-transparent face
filled most of the frame, washing every Act III room's bespoke diorama out
behind it for as long as the player read that room. The wide/default
`jump()` framing didn't show it (the box was merely far away, not
occluding), which is why this had read as "maybe just a QA-tool artifact"
right up until the math and the wide-vs-close comparison confirmed
otherwise — it is a real, if door-choice-dependent, gameplay bug, and the
close-camera tool simply reproduces its worst case unconditionally (`x=0`
for every door, by the tool's own documented approximation) rather than
only on a middle-door entry.

**Fix:** pulled the whole ring's z-range back — base `-12 → -16`,
amplitude `7 → 5`, so the nearest any box now gets is `z=-11`, a full
4.6 units from the resting camera and safely behind every diorama's own
plane (`DIORAMA_Z = -7.5`) rather than in front of it. The boxes still
read as ambient background "memories" (the theme's intent) — they're just
never close enough to occlude the room in front of them. New
`src/test/themes.test.ts` asserts all 8 boxes stay behind a safe z
threshold, so this can't silently regress.

**Verified live:** re-screenshotted `editor`, `teleporter`, `debt-of-dead`,
and `marys-room` at the close reading-camera position post-fix. All four
now read correctly — `editor`'s amber drawer is unmistakably amber-gold,
`teleporter`'s two circular pads are clearly legible, `debt-of-dead`'s
chair/IV-pole/bag are all distinct, `marys-room`'s bed frame reads
cleanly — with the memory boxes now small, background, non-intrusive
elements at the frame edges. Zero console/page errors across the sweep.

**Checked and closed, not just assumed:** whether LIMERENCE's equivalent
floor shares this bug. It does not — LIMERENCE's Act III ("The Long-Stay
Wing") uses the shared `corridorTheme()` fixture-kit builder
(`packs/limerence/theme.ts`), never `mirrorTheme()`, so this bug is
ANAMNESIS-only by construction. No action needed there.

**Broader sweep, this pass:** re-ran UAT 21/22 (ANAMNESIS + LIMERENCE
title-menu overlay sweeps) fresh — both still pass cleanly, zero
regressions from this session's changes to `flow.ts`/`director.ts`/
`themes.ts`/`dioramas.ts`. Screenshotted Codex, Traveler's Ledger, The
Register, and Settings directly (not just via the pass/fail assertions)
to read them with a player's eye — all four render correctly, are
legible, and show no visual defects. Given the sheer volume of prior
polish passes already logged in this document, this was a deliberately
bounded spot-check rather than a from-scratch re-audit of every screen;
no new findings there this round.

**Verification.** `tsc --noEmit` clean. Full suite: **1154/1154 green**
(5 new: 1 in `themes.test.ts`, 4 in `dioramas.test.ts`). Confirmed the
session's one incidental `npx tsx` auto-install left no stray changes to
`package.json`/`package-lock.json`.

---

# Cross-run guide recognition ("pattern-barks") — 2026-07-25

Closes **Tier 1 item 4**, the highest-value open item that wasn't blocked on
something external (item 1 needs audio files the owner hasn't recorded; item 3
is a whole visual rework; items 2 and 5 are already done). Owner directive:
*"upgrade the game. test all. review code."*

**What it does.** A returning player's first real door row no longer gets the
generic *"You have returned. The lever is where you left it…"*. If their
history has a *shape*, the guide says that instead — the Usher observing that
you have left by the same door every time, or that you have walked the place
more than once and never once left a heart behind. Six such observations
exist, per pack, in five languages.

**Detection is engine, prose is content.** New `src/engine/patterns.ts` owns
only the *facts*: `activePatterns(inputs)` returns which of six
`PlayerPatternId`s are currently true, and `patternForRun(active,
runsCompleted)` picks the single one to voice. Both pure. Each pack's own
`guide.ts` decides how its guide says it, keyed by those ids — so the same
fact reads as the Usher's dry archival note or the Porter's night-desk
remark, never as one translated into the other.

The six: `same-ending-again`, `never-spent-a-heart`,
`holds-unspent-keepsakes`, `never-descended`, `walked-most-rooms`,
`returns-to-one-room`. All are derived from `Profile`'s already-existing
Ledger-only counters; no new persisted state, no schema bump.

**Three constraints written into the module's header, as binding on future
additions:**
- **Observation, never scoring.** The Experience Charter forbids grades. A
  pattern is *"you have never spent a heart"* — never *"you are playing too
  cautiously"*. Every line was written to be recognisable without being
  praise or reproach; that mattered more here than anywhere else in the game,
  because a bark that reads as a score would undercut the whole premise.
- **Cross-run only.** Anything visible inside a single run (axes, hearts,
  lucidity) is already covered by the existing axis-reactive barks. A pattern
  earns its place only by seeing what one run cannot.
- **Read-only, never gameplay-affecting.** These read Ledger-only fields and
  return ids for narration. No pattern may gate a room, choice, or ending —
  that would silently convert documented Ledger-only counters into gameplay
  predicates.

**Pacing — the main design decision.** Recognition fires in exactly one place:
the returning-player branch that already existed, replacing its generic line.
Not added to the mid-run candidate rotation, and not layered on top. Reasons:
recognition lands hardest as an opening line; one per returning run can never
crowd out the axis-reactive lines; and a guide that comments on your history
repeatedly within a single run stops reading as *remembering* and starts
reading as *monitoring*, which is a different and much worse character. Across
runs, `patternForRun` rotates by `runsCompleted`, so a player who fits several
patterns hears a different one recognised each time rather than the same line
forever. The mandatory door explainers (single-door gate, first door,
understory fork) still outrank recognition — those exist to prevent real
confusion and must not be displaced by an aside; there is a test for it.

**A deliberate departure, and why.** Every input to `activePatterns` is a
**required** parameter. The older engine modules (`storyEngine`'s
`DEFAULT_GRAPH`, `ledger`'s `UNDERSTORY_SEQUENCE`, `gameState`'s `ACT_POOLS`)
default to ANAMNESIS's own content, which is exactly the shape that produced
several real cross-pack leaks over this project's history — tracked here as
item 18. New engine code does not extend the pattern: a caller that forgets to
supply its pack's numbers gets a compile error, not ANAMNESIS's data. This
matters concretely for `hasUnderstory`: a pack without an Understory must
never be told it failed to find one, and that is enforced by the type, not by
a comment.

**Checked, not assumed:** "One Door" vignettes increment
`roomVisits`/`codexUnlocked` but not `runsCompleted`/`heartsLost` (verified in
`flow.ts`, both behind `!this.oneDoorMode`). So `walked-most-rooms` and
`returns-to-one-room` legitimately count rooms met in One Door mode — the
guide saying "you have been in nearly every room" stays true however you got
there — while `never-spent-a-heart` compares two counters that both exclude
it, so vignette play can't make it accidentally true. Both behaviours are
wanted; the asymmetry is now documented in the module rather than left as an
accident of which counter was handy.

**Translation (CLAUDE.md R1, context-first).** 6 lines × 2 packs × 4 languages
= 48 translations, each written against the surrounding barks rather than
word-for-word from English. Register was verified per file before writing, and
it is *not* uniform: ANAMNESIS's French Placeur uses formal **vous** while
LIMERENCE's Portier uses intimate **tu** with the inclusive forms that file
already used; LIMERENCE's German Portier uses **du** while ANAMNESIS's
Platzanweiser uses **Sie**. Each pack's established vocabulary was reused
rather than reinvented (Podzemí/Archiv, srdce/Důvěra, Upomínka/Andenken,
"vydat"/"ausgeben"/"dépenser" for spending a keepsake). One trap caught while
writing: the natural French word for the ledger a measure of Confiance comes
from is *registre*, but LIMERENCE already uses **Le Registre** as the proper
name of its Records Office floor — so that line says *ton compte* instead,
keeping the stat and the place from reading as the same thing.

**Verification.** `tsc` clean; full suite **1231/1231 green** (77 new, in
`playerPatterns.test.ts`) covering detection thresholds, each predicate's
discrimination in both directions, ordering, rotation determinism,
out-of-range safety, per-pack voice, explainer precedence, and translation
coverage with per-language cross-pack guide-word leak checks (R4).

The new tests were **mutation-tested rather than trusted for passing on the
first run**: deleting one Czech translation key failed exactly the one
expected translation test, and breaking `flow.ts`'s wiring (passing `null`
instead of the derived pattern) failed exactly the one expected wiring test.
Both were restored and re-confirmed green.

Live-verified via new `tests/uat/59-guide-pattern-barks.mjs`: seeds a profile
tuned so exactly one pattern is active (a looser fixture would make the
asserted line depend on `runsCompleted` and be flaky), plays the prologue
forward to the Act I door row, and asserts the recognition line actually
renders — plus a **control** case where a patternless returning profile still
gets the generic line, which is what proves the assertion is caused by the
seeded pattern rather than by the branch having replaced that line
unconditionally. Also asserts the Czech render carries the right guide-word
and no LIMERENCE vocabulary. Zero console errors. Screenshotted at real panel
width to confirm it reads well in the guide's gold-italic voice above the
doors. Existing UAT 19 and 20 (both packs' door-choice flows) re-run and pass.

**Code review, same pass — findings and non-findings, honestly.** Scanned for
listener/timer leaks and floating promises. The raw
`addEventListener`-vs-`removeEventListener` counts look alarming in
`overlays.ts` (51 vs 10) and elsewhere, but every excess is either
element-scoped (garbage-collected with the node when the panel is torn down)
or attached once to an app-lifetime singleton: `Hud` is constructed exactly
once, and `SceneDirector`'s three listeners are one window `resize` plus two
on the canvas. No timer leaks (every `setInterval` has a matching clear). **No
new bugs found** — which is the honest result after this many prior hardening
passes, not a claim that none exist. Two improvements were made to this
pass's own new code as a result of the review: the One Door asymmetry above
was investigated and documented rather than assumed, and
`recognizedPattern()` now short-circuits on `runsCompleted` before doing the
room-registry scan, since it runs on every door row of every run and the
large majority of those belong to players with no history at all.

**Item 18 re-checked and left open, deliberately.** Its premise was verified
concretely rather than taken from the note: `pickUnchosenRooms`' ANAMNESIS
default is *not* live-buggy — LIMERENCE's understory room and all four of its
translation files genuinely pass `LIMERENCE_ACT_POOLS` at every call site. So
item 18 remains what it says it is: a latent-shape risk, not a present defect.
Converting those ~6 modules' defaults to required parameters is a real
refactor across their call sites and tests, and doing it as a drive-by
alongside a content feature is exactly how the original leaks got in. Left for
its own pass; the new module demonstrates the target shape.

---

# Plan-review pass: stale-entry audit, extended troll testing, item 18 closed — 2026-07-26

Owner directive: *"review what you can. see if we are missing something from
all the plans and do it or suggest me what to do. Finish all you can. do
extended troll testing."* Approach: read every item in this document not
already marked shipped, verified each against the actual current code rather
than trusting the doc's own prose, and acted on what that verification found.

**Two "open" items turned out to already be shipped — the doc had just never
been updated to say so.** Both are corrected in place above rather than left
to mislead the next read of this file:
- **Item 6 (end-of-act interlude screen)** was written before Phase V4a
  (2026-07-16) built it, and never struck afterward. Shipped, hardened since.
- **Item 9 (ambient corridor life's two remaining sub-effects)** — both "the
  Porter passing" and "a phone lighting in the distance" turned out to already
  be shipped too, as the T7 continuation and **V4b** respectively; the entry
  had simply never been marked done. All three of item 9's original
  sub-effects are now complete.

This matters as a finding in its own right, not just as housekeeping: a
"review the plan" pass that trusts the plan's own status markers without
checking the code will keep re-surfacing already-finished work as if it were
still open. Worth remembering for the next audit of this document.

**Item 18 (the "engine default = ANAMNESIS content" leak class) — closed, but
not the way its own text originally proposed.** Re-verified every one of the
~6 flagged functions' real call sites (not just the ones checked in the prior
session) across `flow.ts`, `overlays.ts`, and both packs' content trees.
Confirmed again: every real call site already passes its pack's own value
explicitly. The "make these parameters required" fix this item had named as
the ideal solution was evaluated concretely and **rejected** — `gameState.ts`'s
`pickUnchosenRooms(prior, pools = ACT_POOLS)` is called with no second
argument from ~15 sites *inside ANAMNESIS's own content files*, and that is
correct there, not a bug, because that code genuinely is ANAMNESIS's own data.
Making the parameter required would force touching ~70 call sites to convert
a working pattern into a more verbose one, and would be actively wrong for
the very call sites that rely on the default correctly.

Shipped instead: `src/test/engineDefaultLeakLint.test.ts`, a mechanical
source-scan test in the same style as this repo's existing
`animationSettleLint.test.ts`/`uiKeyCoverage.test.ts` — it asserts every call
to the six flagged functions in the shared engine/UI layer and in LIMERENCE's
content carries the substring proving it passed a real pack-scoped value,
without touching a single existing call site. This converts the actual
remaining risk (a *future* edit forgetting to thread the pack through, or a
copy-paste from ANAMNESIS content into LIMERENCE without updating which pool
constant it uses) into an immediate, specific test failure — the practical
equivalent of "compile error instead of silent leak" without the
disproportionate refactor. Mutation-tested: dropping `this.pack.graph` from a
real `offeredDoors()` call and dropping `LIMERENCE_ACT_POOLS` from a real
LIMERENCE call site each failed exactly the one expected test; both reverted
and reconfirmed green.

**Extended troll testing — a real, self-described gap closed.** Existing
scripts 10 and 30 both say so in their own header comments: they chaos-test
only the title screen. New `tests/uat/60-troll-in-game-anamnesis.mjs` and
`61-troll-in-game-limerence.mjs` jump straight into a room and spend their
budget hammering surfaces the title screen doesn't have at all: the
door-walkthrough camera dolly (undelayed canvas clicks racing digit-key
choice picks), the HUD's always-present Menu/language/text-panel controls
mid-room, viewport resizes mid-3D-transition, and — the one interaction the
title-screen troll tests structurally cannot exercise — repeated `jump()`
calls that each interrupt whatever the previous one left in flight. Beyond
"zero errors during chaos," each script also verifies **recoverability**: a
cold reload after the chaos must land on real rendered content, not a blank
page or the crash-recovery overlay, since a bug could silently corrupt
persisted state without ever throwing during the chaos itself. Both scripts
run clean (0 errors, ~50-58 actions each) and were re-run to confirm they
aren't flaky. Existing troll test 10 re-run and still passes, confirming no
regression from this session's changes (all of which were additive —
docs and new test/UAT files only, no runtime source touched).

**Verification.** `tsc` clean. Full suite **1237/1237 green** (6 new, all in
`engineDefaultLeakLint.test.ts`). No runtime source files were modified this
pass — every change is either a documentation correction or a new,
independently-verified test/UAT file.

**What's left, honestly.** Only two items in this document remain genuinely
open and actionable, and neither was attempted unilaterally this pass for a
stated reason: **item 1** (voice narration + music files) is blocked purely on
the owner supplying/recording audio — the architecture is dormant and ready.
**Item 3** (LIMERENCE visual-language rework — bespoke per-floor geometry
reading as "a relationship at its breaking point," not a recolored ANAMNESIS
corridor) is a real, substantial creative undertaking that a prior session
explicitly deferred as post-1.0 polish; picking it up unilaterally would
reopen a decision that was reasoned and recorded, not silently fix a gap.
Tier 3 (commercial certification, mobile, a third pack) remains correctly
inactionable — each is contingent on a decision only the owner can make.

---

# Adversarial-save troll pass: 10 real crashes found and fixed — 2026-07-26

Owner directive: *"do an extended troll testing, design it and correct what you
find."* The previous pass's troll scripts (60/61) chaos-test *interaction* —
clicks, keys, resizes racing animations. This one attacks a different and,
it turned out, far more productive surface: **the save payload**, which is the
one genuinely untrusted input this game has. `localStorage` is editable by
anyone with devtools, and profiles are importable as files.

**The gap in the existing defence.** Malformed *JSON* was already handled —
`localSave.ts` falls back to its backup, and a prior audit verified that. But
**valid JSON carrying hostile values was a separate, unguarded surface**:
`hydrateProfile` was a bare `{...base, ...parsed}` spread that trusted every
field it was handed. The prior review's own note ("malformed JSON safely
rejected") was true and, read as coverage of this class, misleading — which is
precisely why this was worth probing empirically rather than reasoning about.

**Method.** Built 29 hand-designed payloads, each varying exactly one field
from a known-good baseline so a failure names the responsible field rather
than "some bad save". Seeded each into a real, already-hydrated profile,
reloaded, clicked Continue, and recorded page/console errors, blank pages, XSS
execution, and prototype pollution. **10 of 29 crashed the running game.**

Representative failures, each a one-line dereference away from a blank page:
- `{"act": 99}` (also `-1`, `null`, `"two"`) → `doorsForAct`'s
  `graph.actPools[act].map(...)` on an undefined pool. Worth noting
  `themeForAct` is a bare cast with no clamping, so nothing upstream caught it.
- `{"visited": null}` → `isResumableRun`'s `.every` — i.e. **the validator
  added by item 11 to prevent unresumable-run crashes was itself crashing** on
  a malformed run.
- `{"run": []}` / `{"run": "x"}` → same `.every`, one level up.
- `{"endingsSeen": null}` → `.map`; `{"codexUnlocked": null}` → `.length`;
  `{"persona": null}` → `.name`.

**Two negatives confirmed empirically rather than assumed**, both of which
prior audits had asserted on inspection alone: a persona name of
`<img src=x onerror=...>` does **not** execute (every user string renders
through `ui/dom.ts`'s `el()`, which uses `textContent`), and a hostile
`__proto__` key does **not** pollute `Object.prototype` (object spread defines
rather than sets, so it never invokes the setter). Both are now pinned by
tests so a future refactor — e.g. `el()` gaining an `innerHTML` path, or
`hydrateProfile` moving to `Object.assign`, which *does* invoke setters —
can't silently reopen them.

**The fix, at one boundary rather than 10 call sites.** The tempting patch is
a guard at each crash site; that would have left the next unguarded consumer
just as exposed. Instead the untrusted data is sanitized once, where it
enters:
- **New `isStructurallyValidRun(run)`** in `schema.ts` — pure, shape-only, no
  pack knowledge (that module deliberately has zero imports, so `saveStore`
  can call it with no dependency cycle). Registry-level validation ("do these
  ids exist in *this* pack?") stays in `isResumableRun`, layered on top.
- **`hydrateProfile` now sanitizes every field**, with a deliberate split by
  kind: a broken **run is discarded** (a corrupt run is unplayable, and
  repairing it means inventing a state the player never played — the same
  reasoning item 11 already settled), while a broken **profile field is
  coerced to its default** (the player always needs a profile, and losing a
  Ledger tally is far cheaper than refusing to load their whole history).
- **`isResumableRun` now shape-checks first**, so the function whose entire
  contract is "tell me whether this run is usable" can never itself throw on
  the answer being "no".

**One self-inflicted regression, caught by the existing suite and worth
recording.** The first draft wrote `lastRunEndingId: null` and
`lastRunTranscript: undefined` unconditionally — materializing two genuinely
*optional* fields that `defaultProfile()` deliberately omits. Two existing
save-round-trip tests failed immediately on the changed profile shape. Fixed
by sanitizing those two only when actually present. Exactly the outcome a good
regression suite is for, and a reminder that "harden everything uniformly" can
itself be a behaviour change.

**Verification.** `tsc` clean; full suite **1259/1259 green** (22 new in
`hostileSaves.test.ts`). Mutation-tested rather than trusted for passing:
deleting the act-range check failed 3 expected tests, and weakening the array
coercion failed 1 — both restored and reconfirmed. The probe was re-run after
the fix: **0 of 29 payloads produce a problem**, down from 10, using the
identical assertions — which is the empirical before/after proof that the new
UAT script has teeth, so no separate mutation of it was needed. Live UAT 60
(in-game chaos), 02 (save/reload/continue) and 39 (fullscreen resume across
reload) all re-run and pass, confirming the load-path changes didn't regress
normal play.

Shipped as permanent coverage: `tests/uat/62-troll-hostile-saves.mjs` replays
all 29 payloads in a real browser and asserts no errors, no blank page, no
XSS, no prototype pollution. It exists *alongside* the unit tests rather than
instead of them because the `act=99` crash happened three layers below
`hydrateProfile`, in the 3D scene build — no pure-function test would have
reached it.

---

# Third troll pass: a real crash in RunState.prior, found by designing around a gap in the last pass's own methodology — 2026-07-27

Owner directive: *"write more random, troll tests and simply think of ways to
find bugs. do it and if found, correct them."* Four new surfaces investigated;
three came back clean (real, useful negatives), one turned up a genuine,
live-reproduced crash.

**Investigated and confirmed clean (no code changes needed):**
- **The live UI import path** (paste-into-textarea + click-Import, not
  localStorage injection) — 18 payloads including empty/whitespace/non-object
  JSON, a 5000-level-deep nested object, a 5MB string, and a nested
  `__proto__` key. All clean, because `importProfile()` routes through the
  same `hydrateProfile()` the previous pass hardened — this is a real
  confirmation that the fix generalizes across both untrusted-input entry
  points, not just the one it was built against.
- **Hearts/lucidity arithmetic under legitimate repeated play** — both are
  properly clamped (`applyEffects` in `gameState.ts`); lucidity has no upper
  cap, but the HUD's own glow calculation already clamps for display and no
  realistic ~15-room run can push it anywhere that matters. Checked and
  ruled out, not left unchecked.
- **Real-typed Unicode in the persona editor** (zalgo combining marks, ZWJ
  emoji sequences, an RTL override character, mixed bidi) via actual
  `page.keyboard.type()`, not injection — zero crashes, and the RTL-override
  screenshot confirms the bidi reversal stays contained to its own string,
  never bleeding into surrounding UI. One methodology note worth recording:
  the first screenshot attempt showed a garbled "MIRADESCAVE" — investigated
  and found to be a bug in the *test script* (a missing `.fill('')` before
  typing let the typed text append after a pre-filled preset default), not
  the app. Fixed the script and re-confirmed clean. Worth naming as a general
  discipline: an unexpected troll-test result should be root-caused before
  being reported as either a pass or a finding — it can turn out to be the
  test's own bug either way.
- **Rapid overlapping Settings data-panel actions** (Reset current run, Reset
  all progress, Export, Import — all sharing `confirmButton`'s two-click
  arm/confirm/4s-disarm pattern) fired in random order/timing for 30s,
  including double-confirming two different actions in the same window.
  Clean — `chainSave`'s existing promise-chain serialization holds under
  real timing pressure, not just in principle.

**The real find, and why the first probe attempt missed it.** Investigated
whether `RunState.prior` (deliberately *not* checked by `isStructurallyValidRun`
— it's optional/legacy Ledger-adjacent data) could carry a hostile value
through to a crash. The first live probe seeded a hostile `prior.transcript`
into `profile.run` and used `jump()` to enter `the-archive` — and saw the room
freeze on its first beat with **zero errors**, which read at first as either a
clean result or a silent soft-lock. Investigating *why* surfaced a real
methodology gap: **`jump()` never carries a saved run's `prior` through at
all** — it always re-derives `prior` fresh via `priorFromProfile()`
(`Profile.lastRunTranscript`, already sanitized by the previous pass's
hardening), because `jump()`'s `base` state comes from `newRun()`, not from
`this.profile.run`, whenever the player isn't already mid-run. Only a
genuinely **resumed** run (the ordinary Continue button, which sets
`this.state = this.profile.run` verbatim once `isResumableRun` passes) carries
a saved run's own `prior` through unmodified.

Rebuilt the probe around Continue instead, and it reproduced immediately:
`PAGEERROR: transcript.find is not a function`, caught by the crash-recovery
overlay rather than the room ever rendering. Root cause: `TextPanel.playBeats`
eagerly resolves **every** beat in a stage via `.map()` before displaying any
of them — including `the-archive`'s `archiveExhibitBeat`, a function-beat that
calls `pickExhibitEntry(s.prior?.transcript ?? [])`. Since `?? []` only
substitutes for `null`/`undefined` and not for "present but wrong type," a
`prior.transcript` set to any non-array truthy value (a string, a number, a
plain object) reached `.find()`/`.some()` directly. `choseInPrior` had the
identical bug (`.some()` on the same field); `pickShadowMoments` degraded
without crashing but produced silently wrong results (indexing into a string
character-by-character, returning single characters instead of
`TranscriptEntry` objects).

**Fix, at the pure-function layer rather than the two call sites that happened
to be reachable today.** New `asTranscript()` in `gameState.ts` treats
anything that isn't a real array as an empty transcript; applied inside
`pickExhibitEntry`, `choseInPrior`, and `pickShadowMoments` themselves (not
just at their current callers), so the guarantee holds regardless of which
room or future content calls them. `pickExhibitEntry`'s parameter type
loosened from `TranscriptEntry[]` to `unknown` deliberately — it sits directly
downstream of save-file content, so its own signature was making a promise its
runtime behavior didn't keep. `prior.runs`/`prior.endingId` were audited too
and found genuinely safe: both flow only into arithmetic comparisons and
template-literal string interpolation, which coerce any type without
throwing.

**Verification.** `tsc` clean; full suite **1262/1262 green** (3 new, in
`state.test.ts`, extending the existing `pickShadowMoments`/`choseInPrior`/
`pickExhibitEntry` describe blocks rather than a new file). Mutation-tested:
reverting `asTranscript` to a pass-through failed exactly the 5 expected
tests (the 3 new hostile-input tests plus 2 pre-existing `undefined`-prior
tests, confirming the fix didn't accidentally change correct behavior either).
Live-reproduced before the fix (`PAGEERROR: transcript.find is not a
function` via the real Continue button) and re-confirmed clean after (room
renders normally, zero errors, no recovery overlay). New
`tests/uat/65-troll-prior-transcript.mjs` covers all 3 prior-reading rooms
(`the-archive`, `the-echo`, `the-cave`) × 4 hostile transcript shapes via the
real Continue flow, ~56s wall-clock. Re-ran scripts 03 and 63 (touching
adjacent `gameState.ts`/Settings-panel surfaces) to confirm no regression from
touching a shared engine file.

## Extended review fix batches 1-4 + owner-decision resolution — 2026-08-01 (branch `claude/vestibule-v2-overhaul`)

Systematic implementation pass against `18-extended-code-review-2026-08-01.md`'s
three review rounds, run step by step across one session per the owner's
"build now, fix everything needed, don't rush, retest all" instruction. Full
detail (every finding id, every code change, every test) lives in that
document's own "Resolution" section and inline code comments; this entry is
the plan-doc-level summary.

- **Batch 1 — save/import-boundary hardening (H-1..H-4, S-1, S-2):**
  `asTranscript()` widened to filter malformed array items, not just reject
  non-arrays (closing the one hostile-`prior` gap the 07-19 troll pass
  missed — `pickUnchosenRooms`); `isStructurallyValidRun` extended to check
  transcript-item shape, `currentStage`, and `keepsakesHeld`; new
  `sanitizeSettings()` whitelists every `Settings` field to its valid domain
  inside `hydrateProfile`; `sharedDisplaySettings.ts`'s `uiZoom` guard
  finiteness-checked; `importProfile()` now writes the shared-display key
  before chaining the save.
- **Batch 2 — audio correctness (A-1..A-4, R2-1):** the tab-hidden
  `visibilitychange` branch now clears the accent-pulse timer (it only
  cleared the accent-creak timer before); `playMote()` routes through
  `genDuck` instead of `musicGain` directly, so file-based music can
  actually silence the generative mote bed; `primeOnGesture()` retries a
  paused file-music element; all three volume setters gained
  `Number.isFinite` guards; `voiceover.ts` gained `isValidManifest()` so a
  malformed `av-manifest.json` can't crash `init()`.
- **Batch 3 — UX/boot fixes (U-1, U-2, U-3, U-6, U-7, U-8, U-9, B-1, B-2):**
  the choice screen now focuses the first real choice card, not the reread
  button; Register/Codex cards with no click handler (unlocked-but-noteless)
  are disabled, not silently inert; the persona panel closes on Escape; the
  title loop's Settings/Exit actions match the pause menu's persist
  behavior; a secret door's numeral shows next to its star; a dead
  `void clear;` statement removed; the crash-recovery net now installs
  before the async pack import in `boot()`; a quota-full backup write can
  no longer masquerade as primary-save corruption. U-5 (persona blurb
  i18n drift) deliberately deferred — needs a `Persona` schema decision
  with save-compatibility implications, out of scope for a mechanical batch.
- **Batch 4 — promoted the review's exploratory sweeps into permanent
  CI-checked tests:** `contentInvariants.test.ts` (soft-lock + beat-totality
  probes, a scaled-down Monte Carlo playthrough harness — 120 runs/variant
  × 3 profile shapes × 2 packs — and an ending-reachability axis-bound
  tripwire) plus `scripts/verify-pack-isolation.mjs` (greps the real
  production bundles for cross-pack guide vocabulary and prose, replacing
  room-id markers that turned out to double-count the already-accepted
  engine-default-leak coupling), wired into `package.json` as
  `verify:isolation` and into `deploy-pages.yml` right after `build:web` so
  a regression fails the deploy, not just a future audit.
- **Owner-decision resolution (U-4, E-3, E-6, R3-1):** all four ruled on and
  coded rather than left open — new `Profile.personaOffered` flag makes
  persona Skip sticky (U-4); `playOneDoor` now threads
  `keepsakesFromProfile()` so a One Door vignette shows keepsake-gated bonus
  choices the same as a real run (E-3); R4 (never leak guide vocabulary)
  gained an explicit carve-out for anti-leak comments that name the other
  pack's guide word specifically to warn against it (E-6, see this doc's
  R4 entry above); `the-armored`'s difficulty documented as deliberate
  directly in `packs/limerence/index.ts`'s evaluator rather than rebalanced,
  backed by the Batch 4 reachability tripwire (R3-1). Both real behavior
  changes (U-4, E-3) verified live via
  `tests/uat/66-owner-decisions-sticky-skip-and-onedoor-keepsakes.mjs` in
  addition to source-shape unit tests.

**Final verification:** `tsc --noEmit` clean; full `vitest run` **1307/1307
green** (up from 787 at this doc's original snapshot, reflecting every
session since); `npm run build:web` clean; `npm run verify:isolation` OK
against the fresh production build; the two new UAT behaviors live-verified
in a real browser.

## v2 overhaul Phase 1 — small polish batch — 2026-08-01 (same-day continuation)

Picked up `17-v2-overhaul-plan.md`'s Phase 1 immediately after Phase 0
closed, per the owner's "continue, commit after testing" instruction.

- **1.1 (P3 heavy-toggle re-run):** verification-only — wrote
  `tests/uat/67-p3-heavy-toggle-live-rerun.mjs`, toggling Light mode on a
  LIMERENCE door row mid-entrance-animation and as a rapid double-toggle,
  driving the real (post-Phase-V) full-scene `setThemeMode()` rebuild
  under contention. No bug found: cards settle visible, render loop stays
  alive, zero console errors, doors stay clickable.
- **1.2, 1.4:** already complete on branch creation (no work needed,
  re-confirmed).
- **1.3 S5 nits:** (a) softened the Settings language row's description
  to honestly reflect that the panel's own labels catch up on next open,
  rather than a larger live-re-render change — translated cs/de/fa/fr,
  live-verified in English and Czech; (b) new
  `SoundEngine.isVoiceEnabled()` getter; `Voiceover.play()` now gates on
  it before touching the URL/audio element at all, so narration-off
  genuinely skips the work instead of relying on the muted bus; (c)
  investigated the "12 buttons stack tall" concern and found `.overlay`'s
  existing `overflow-y: auto` already handles it — no code change, just a
  new permanent regression test
  (`tests/uat/68-s5c-title-menu-small-viewport.mjs`) locking in that the
  title menu is scrollable and every button stays clickable at 360×560.
- **1.5 (sconce legibility):** raised `sconceFixture`'s bulb/light height
  and both the glow material's and point light's intensity/falloff —
  positions and count unchanged. Live-verified via screenshot on
  LIMERENCE's `the-colleague` (Act III): the nearest sconce now reads as
  a clear warm point of light against the door frame.
- **1.6 (richer interlude):** deliberately not started — needs 10 new
  translated strings (1 line × 2 packs × 5 languages), which both this
  item's own text and CLAUDE.md's standing translation rule flag as
  needing its own dedicated pass, not a drive-by addition to a polish
  batch.

**Verification:** `tsc --noEmit` clean; full `vitest run` **1309/1309
green** (2 new: `isVoiceEnabled` behavioral test + the play()-gate
source-shape test); `npm run build:web` clean; `npm run verify:isolation`
OK; four live-browser UAT scripts run against a fresh dev server (67, 68,
plus re-runs of 52 and 33 to catch any regression in the touched
theme/card-visibility surfaces) — all pass.
