# The Vestibule — Master Development Plan (consolidated 2026-07-15)

## What this is

A single, de-duplicated, currently-accurate list of every open item, decided-against idea, and standing rule discussed across the whole week's work (four escalating review passes, the 2026-07-13 post-implementation audit, the 2026-07-14 three-day notes, the 119-task ledger, and `UPGRADE_PLAN.md`'s deferred items back to Milestone 5). It replaces the layered, chronological working notes (kept in the session's own planning scratch, not the repo) with one congruent view: **what's still open, what's decided against and why, and what's binding going forward.** Anything already shipped is named only in passing — the authoritative blow-by-blow lives in `git log`, `CHANGELOG.md`, and `UPGRADE_PLAN.md`.

**Current verified state** (2026-07-15): branch `claude/philosophical-roguelike-game-zslw5n`, version `1.0.0-rc.1`, `tsc` clean, **880/880 tests green**, both packs (ANAMNESIS + LIMERENCE) content-complete in en/cs/fa/de/fr, all commits pushed. All release blockers fixed and verified. Everything the 2026-07-13/14 notes tracked as "in-flight, uncommitted" — docs historical-docs banners, the LIMERENCE registerText stale-comment fix, and quality-threading into `scene/themes.ts`'s builders — is **now committed** (`4b85339`, `1dd0940`, `7c8475a`); that section of the old notes is stale and is not carried forward here.

---

## TIER 1 — Highest usefulness & impact (open)

These change what the finished product *is* for a player.

**1. Real voice narration + music files.** The single biggest atmosphere multiplier identified all week. The architecture is fully shipped and dormant (commit `21158d0`): drop files into `public/voice/<packId>/<lang>/<key>.mp3` and `public/music/<packId>/<slot>.mp3`, run the manifest script, done — the Settings rows appear automatically. **Blocked only on the owner supplying/recording audio.** Out of scope until then: TTS, timing sync.

**Gap found and fixed (2026-07-15, seventh session):** re-verified this end to end (voice manifest, `Hud`/`TextPanel` playback, per-key gating, volume sliders, music-slot crossfade over the generative fallback — all genuinely wired, confirmed by reading `voiceover.ts`, `soundEngine.ts`, `flow.ts`, and `overlays.ts` directly, not just trusting the commit message). One piece was documented but never actually built: `public/music/README.md` promises `public/music/landing/vestibule.mp3` plays on the rozcestník "behind a click-to-start button," but `landing/index.html` had zero audio code, and — because the rozcestník is a plain static page outside either pack's Vite build — `assemble-web-dist.mjs` never copied `av-manifest.json` or a landing music file into `dist-web/` in the first place, so even adding the button code alone couldn't have worked. Fixed both halves: the landing page now fetches the manifest and shows a small, quiet "♪ Play quiet music" toggle only when `music.landing.vestibule` actually exists (click-to-start, respects autoplay policy, matches the Experience Charter's "no dark patterns" rule — silent and invisible otherwise); the assemble script now copies both files into `dist-web/` alongside the two pack builds. Verified live (a synthetic manifest + fake dist served over HTTP, Playwright toggling the button, zero console errors) since there's no real audio file to test with yet; cleaned up before commit so `public/av-manifest.json` stays the checked-in empty default.

**2. cs/fa literal-translation quality re-review (CLAUDE.md standing TODO).** The single most substantial genuinely-open engineering-side item. Milestones 1–5-era Czech and Farsi strings were translated literally, before the context-first rule existed; every one needs a native-speaker-register pass against its actual in-game context. Explicitly must be its **own dedicated pass** (CLAUDE.md forbids doing it opportunistically mid-feature). Large: two languages × two packs × full catalogs. Candidate structure: per-act dispatches, mirroring how de/fr were done. A smaller, related nit surfaced during item 21 (below): `heartsAriaLabel`/`lucidityTooltip`/`statLucidity`/`statHearts` still read the ANAMNESIS-flavored "grip on reality"/"lucidity" in a few translated LIMERENCE strings instead of "Trust"/"Clarity" — not a vocabulary leak, just a terminology mismatch; fold into this pass rather than fixing opportunistically.

**3. LIMERENCE visual-language rework.** Owner's ask on record: make scenery/animations read as "a relationship at its breaking point," not a recolored ANAMNESIS corridor; livelier/more colorful light mode (considered: inverted door/environment palette in light mode; more visual elements generally). Scoping notes: per-floor palettes exist (`packs/limerence/theme.ts`), `theme-light` CSS vars exist; the *geometry* (`corridorTheme()` and friends) is still ANAMNESIS's, reused wholesale — a genuine rework needs LIMERENCE's own scene-builder functions per floor. The creative bible's signature images (migrating wall/window, two phones on one bed) are the target vocabulary. Post-1.0 polish by prior decision; high impact when done.

**4. Porter/Usher pattern-barks.** The guide visibly *knows you* across runs (third run never opening an Act II door; always-verify-first players get called on it). Profile already tracks the data. Needs newly authored narrative content × both packs × 5 languages — slow, writerly work; do not rush (same CLAUDE.md caution as item 2).

**5. Choice-aftermath flashes.** A few hand-authored beats per act referencing an earlier room's choice two rooms later — consequence made *felt*. Same cost profile as item 4 (authored content × 5 languages).

---

## TIER 2 — Older deferred items from `UPGRADE_PLAN.md` (open, lower priority)

**6. End-of-act interlude screen** — scoped out during Milestone 4's enjoyment pass; never revisited. One quiet screen between acts (act name, a beat of ambience) — genuinely optional polish, not a gap in anything promised.

**7. Door hover feedback beyond the shipped pulse. ✅ SHIPPED (2026-07-15, sixth session).** `doors.ts` already had a breathing glow pulse, a per-door pitched hover tone, and a DOM tooltip; added the two enhancements this item's writeup named. Light-spill: a hovered door's point light and floor pool now breathe brighter in lockstep with its slab glow (`hoverLightSpill`, pure, unit-tested — same `t * 2.2` envelope as the existing `hoverPulseIntensity`, scaled to each light's own base intensity, bounded `[base, base*1.4]`, holds at the peak under reduced motion). Creak: `sound.hover(index)` now layers a very short, quiet filtered-noise creak (`doorCreak`, reusing the ambient-room-accent's impulse-noise technique but far shorter/quieter) under the existing pentatonic hover tone, pitched in a distinct low "wood" register (`doorCreakFrequency`, pure, unit-tested, always below `hoverPitch` at every door index so the two layers never beat against each other). Both fire from the single already-existing hover-transition call site (`mouseenter`/`focus`/raycast), so no new plumbing. 6 new unit tests; live-verified via Playwright (hover/unhover a real door card, zero console errors). `tsc` clean, 886/886 tests green.

**8. Deferred verification debt: full Playwright matrix.** Proving dynamic scenery works end-to-end, a full playthrough sweep, a transition-garble check, and an EN/CS/FA 3-language Playwright playthrough matrix. All deferred because long Playwright runs conflict with the 3-minute UAT cap (CLAUDE.md R2); would need a re-scoped, split-script approach (e.g. one script per act, not one script per language).

**9. Ambient corridor life — the two remaining sub-effects.** Item T7 shipped ("a far door closing," commit `375b9f3`) scoped conservatively to the one safest effect. Still open from the original three-effect brief: "a phone lighting in the distance" (LIMERENCE-only — doesn't exist in ANAMNESIS) and "the Porter passing" (needs new animation-path engineering on top of the existing walk-through-door rig). Both are real future work if a fuller ambient pass is wanted.

**10. F5 Tier 3 — LIMERENCE dioramas beyond Tier 1+2. ✅ SHIPPED — full 34/34 parity (2026-07-15, eighth+ninth sessions).** Eighth session added 5 (`the-screenshot`, `the-scoreboard`, `the-veto`, `the-drift`, `the-registry` — see prior entry, preserved below). Ninth session added the remaining 11, closing the gap completely: `the-best-friends-girl` (a row of tally marks, one lighting in a loop with no off switch — "counted eleven times now"), `the-summer-ends` (an open packing box with a small framed photo — "the relationship's museum, curated by hand"), `the-hall-pass` (a wrapped gift box, uneasy light leaking from the seam — "presented with a bow on it"), `the-rebound` (a sink counter, one toothbrush solid, one an unfilled translucent outline — "a shape where a feeling should be"), `the-unicorn` (a rollaway cot dim beside the warmly lit double bed — "the rollaway never gets to choose the room"), `the-other-side-of-the-door` (a face-down phone on a nightstand, a door that never fully opens or closes behind it), `the-metamour` (a color-coded calendar open on a counter, one color dominating — "exhibit A," lifted directly from the room's own text), `the-usual-suite` (a wall lit from behind, waiting silhouettes — the room's own stated image, verbatim), `the-usual-room` (a hotel key-board, one key already lit — "will reach for 4B first, to test it"), `the-doors-not-opened` (a row of doors already ajar, one drifting open further then easing back), and `the-other-side` (two facing chairs, one holding a translucent voice assembled from a past choice). Every image is lifted from or tightly grounded in the room's own prose, not invented — same discipline as the first 23. New test locks in full parity (`DIORAMA_ROOM_IDS` now equals every real LIMERENCE room id). `tsc` clean, 887/887 tests green; live-verified via Playwright `jump()` into all 11 (zero console errors) plus screenshots confirming correct render at the same subtle backdrop-vignette depth every other diorama in both packs uses.

**Follow-on (same ninth session): extended per-choice accent hooks to 4 more rooms** among the new dioramas, once each had a factual object-changing accent worth hooking (same "one specific choice, one honest visual consequence" discipline as the original 6): `the-hall-pass` (the bow falls loose, the box opens for real, on either of the two "accept" choices), `the-rebound` (the outline toothbrush solidifies — false commitment made physical — on "let her believe"), `the-veto` (the contested key flares hot on "counter-veto," open warfare over the rule), and `the-metamour` (the calendar's already-dominant color stops pulsing and simply holds, on "name-the-hierarchy" — acknowledged, not just felt). `dioramaAccentHooks` now covers 10 rooms total. Existing generic accent-hook tests (no changes needed — they iterate the hook list itself) cover all 4 automatically; live-verified end to end via Playwright (jumped to `the-hall-pass`, clicked the accept choice, advanced through its outcome beats, zero console errors).

---

## TIER 3 — Conditional / external-dependency items (open, not actionable now)

**11. Commercial-store certification** — PEGI/ESRB submission, Windows code signing. Contingent on a paid release ever being pursued. The in-game age advisory explicitly self-declares it is not an official rating.

**12. Mobile investment** — decided out of scope for Milestone 5 by the owner's 12-question review; unrevisited since. Would need touch controls, layout, and performance passes.

**13. Third content pack** — the architecture explicitly anticipates it (one engine, N packs). If one lands: split `flow.ts` (~900 lines, noted as acceptable for two packs but "split if a third lands").

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
R4. Never leak one pack's guide vocabulary into the other (incl. header comments) — Uvaděč/Vrátný, نگهبان/دربان, Platzanweiser/Portier, Le Placeur/Le Portier.
R5. Definition of Done: spec check → `tsc` → `vitest` → live `?uat=1` verification (screenshots/DOM read, not just launched) → honest `UPGRADE_PLAN.md`/plan entry → one-phase commit → push.
R6. Architecture rules: content imports pure predicates only; no new subsystem logic inline in `Game`; the guide reads state, never writes; persistence through `SaveStore` only; schema renames need a version bump + fixture; unseeded randomness for cosmetics only.
R7. The Experience Charter is binding and wins conflicts: quiet UI, no grades, no dark patterns, endings are trades not verdicts.

---

## RECOMMENDED ORDER (if/when coding resumes)

Every item that was open as of the 2026-07-14 notes and didn't need new authored content or a dedicated translation pass is now shipped (Tier 2's old items 6–14, the I9 audit, quality-threading, docs banners, and — as of 2026-07-15 — item 21's LIMERENCE UI-chrome coverage backfill). What's left genuinely does need its own dedicated session per the reasoning already on record:

1. **Tier 1 item 2** (cs/fa translation QA) as its own dedicated multi-dispatch pass — the single largest remaining engineering-adjacent item.
2. **Tier 1 items 4–5** (pattern-barks / choice-aftermath flashes) as a writing-first pass, both packs × 5 languages.
3. **Tier 1 item 3** (LIMERENCE visual-language rework) as its own design+build session.
4. **Tier 2** items opportunistically, or explicitly re-deferred with a note each time they're passed over.
5. **Tier 1 item 1** whenever the owner supplies audio files — zero code needed, just drop files + run the manifest script.

Small, self-contained polish that doesn't require a dedicated multi-session pass (a door-hover enhancement, an end-of-act interlude, a diorama or two) can be picked up opportunistically in a single sitting, verified with the full Definition of Done, and folded into the ledger below without waiting for its tier's "big" pass.
