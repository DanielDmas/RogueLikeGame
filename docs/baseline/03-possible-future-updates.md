# The Vestibule — Possible Future Updates (Roadmap & Backlog)

> **Baseline document 3 of 5.** This is the exhaustive, prioritized inventory
> of everything that *could* come next — features planned but unbuilt, polish
> deferred by choice, larger creative efforts, external-dependency items, and
> — deliberately preserved — the things that were **considered and decided
> against**, with their reasons. It is a consolidation of two living planning
> documents (`docs/development/13-master-development-plan.md` and
> `docs/development/17-v2-overhaul-plan.md`) plus the standing owner requests.
> Nothing here is a commitment; it is a menu for whoever picks the game up
> next.
>
> **A note on "decided against":** those items are kept on the record *on
> purpose*. They were thought of, weighed, and consciously not built — which
> is itself valuable knowledge for a future maintainer, who would otherwise
> waste effort rediscovering (and possibly re-litigating) a settled decision.
> Companions: 01 (game), 02 (technical), 04 (experience), 05 (history).

---

## How to read the priority tiers

- **Tier 1** — highest usefulness & impact; these change what the finished
  product *is* for a player.
- **Tier 2** — solid usefulness, moderate cost; independently shippable
  polish/correctness/reactivity, no new authored content needed.
- **Tier 3** — older deferred items, lower priority.
- **Tier 4** — conditional / external-dependency items, not actionable now.
- **Decided against** — considered, consciously not built; kept for the record.

Most Tier-2-scale hardening and polish has already been *done* across the
many review passes (see document 05). What remains open is concentrated in
Tier 1 (big creative work, or work blocked on the owner supplying something)
and a handful of genuinely-deferred technical items.

---

## TIER 1 — Highest impact (open)

### T1.1 — Real voice narration + music files ⭐ (blocked only on assets)

The single biggest atmosphere multiplier identified across the whole
project, and the closest to free. **The entire architecture is already
shipped and dormant** (see doc 02 §3.4 and doc 01 §7). To activate it, the
owner drops audio files into:

```
public/voice/<packId>/<lang>/<key>.mp3    (e.g. public/voice/anamnesis/en/room.wallet.stage0.beat0.mp3)
public/music/<packId>/<slot>.mp3          (slots: title, act0…act5)
public/music/landing/vestibule.mp3
```

…then runs `node scripts/build-voice-manifest.mjs`. The Settings narration
rows appear automatically once the manifest is non-empty. **Zero code work
remains** — the two former "activation blocker" bugs (generative motes
bypassing the duck bus; the boot-slot autoplay-rejection not retrying on
first gesture) were both already fixed. Out of scope even then: TTS, and
audio-to-text timing sync. This is purely blocked on someone supplying or
recording the audio.

### T1.2 — Czech/Farsi literal-translation quality re-review (partially done)

The single most substantial genuinely-open *engineering-adjacent* item.
Milestones 1–5-era Czech and Farsi strings were translated more literally,
before the "context-first" rule existed. A dedicated native-register
re-review pass **has since been completed** across both packs (rooms,
endings, epiphanies, reflections, UI chrome) — but any *new* content added
later must be held to the same standard, and CLAUDE.md forbids doing this
opportunistically mid-feature; it is always its own dedicated pass. Keep this
on the list as a standing discipline for future content, and re-audit if
large new text lands.

### T1.3 — LIMERENCE bespoke visual-language rework

On the owner's record as a "plan, don't build yet" deferral. LIMERENCE's
rooms currently reuse ANAMNESIS's corridor *geometry* (the Phase V fixture
kit made the floors per-floor-distinct as data, and light mode + per-floor
accents shipped, but the underlying room-scene builders are shared). The
target is to make scenery/animations read unmistakably as "a relationship at
its breaking point" — the creative bible's signature images (the migrating
wall/window, two phones face-up on one bed, a phone glowing 23:51 in the
dark) as a genuine visual vocabulary, with a livelier/more colorful light
mode. This is post-1.0 polish by prior decision; high impact when done; it
deserves its own dedicated design+build session.

### T1.4 — Porter/Usher pattern-barks expansion (T5)

The guide already remarks on some cross-run patterns (`patterns.ts`). The
fuller version — the guide visibly *knowing you* across many more behaviors
(the third run that never opens an Act II door; the always-verify-first
player getting called on it) — needs newly *authored* narrative content ×
both packs × 5 languages. Slow, writerly work; do not rush; same CLAUDE.md
translation caution as T1.2.

### T1.5 — Choice-aftermath flashes / echoes expansion (T6)

A few hand-authored beats per act that reference an earlier room's choice two
rooms later — consequence made *felt*, not merely tracked. LIMERENCE already
has ~12 of these; ANAMNESIS had 2 added. Expanding the set is the same cost
profile as T1.4 (authored content × 5 languages). Design rule discovered
along the way: **prefer targeting a gate room (always visited) referencing an
earlier pool room's specific choice** — pool→pool pairs can't guarantee the
earlier room was even visited this run.

---

## TIER 2 — Solid usefulness, moderate cost (mostly already done; open remainder)

The bulk of the original Tier-2 list (focus containment in overlays,
arrow-key card nav, the light-mode stale-paint fix, idle fps downshift, the
LIMERENCE diorama accent hooks, the content-assertion test, the
colorblind/contrast audit, the door-hover feedback, the ambient corridor
life, One Door mode, the LIMERENCE UI-chrome translation backfill) is
**shipped**. What remains genuinely open at this tier:

### T2.1 — Richer end-of-act interlude (v2 overhaul plan §1.6)

The act-headline interlude card currently shows only the floor name. The
original sketch imagined a Porter/Usher line and a palette bleed toward the
next floor. Needs new translated content (≈1 line × 2 packs × 5 languages =
10 strings), so it carries the translation-context caution and wants its own
small pass rather than a drive-by addition.

### T2.2 — Door hover feedback beyond the shipped pulse (I5)

There is already a breathing glow, a per-door pitched hover tone, a frame
glow, and a DOM tooltip. A genuinely richer treatment (a hover-triggered
light-spill increase, a subtle door-creak) is real but speculative
production-taste work, kept at low priority.

### T2.3 — The remaining two ambient corridor sub-effects (T7)

The "far door closing" and "the guide passing" ambient events shipped. The
original three-effect brief also imagined "a phone lighting in the distance"
(LIMERENCE-specific — a version shipped as the phone-light pulse) and could
be extended further. Low priority.

---

## TIER 3 — Older deferred items (open, lower priority)

### T3.1 — `flow.ts` module split (v2 overhaul plan §2.1)

`flow.ts` is ~1,340 lines and owns the whole `Game` class. The architecture
note says "split if a third pack lands." A detailed seam analysis exists in
the v2 overhaul plan: extract the bodies of `start()` (title loop) →
`flow-title`, `runLoop()`/`enterRoom()`/`playEnding()` → `flow-run`, and the
persist chain → `flow-persist`, each as standalone functions taking a
`GameContext` interface, **keeping `Game` as one class** so its private
fields don't have to become package-visible. Pure refactor (existing tests
must pass unchanged). **Real regression risk on working code, and it only
pays off if a third pack is actually coming** — hence deferred until a third
pack's structure is known.

### T3.2 — ContentPack type audit for third-pack readiness (v2 overhaul plan §2.2)

An audit already established that the one genuine rigidity is the **fixed
4-act structure** (`ActId = 0|1|2|3|4`, `actPools` typed for acts 1–3, the
examined-act-bark record assuming 4 acts). A third pack matching this
structure needs no engine changes. A structurally different pack (5 acts, 2
acts) would need `ActId` to become `number` and several engine functions to
generalize. **Recommendation on record: leave as-is until a third pack's
structure is actually known.**

### T3.3 — I3 end-of-act interlude screen richness — see T2.1 (same item).

### T3.4 — Full EN/CS/FA Playwright playthrough matrix (v2 overhaul plan §4)

The one verification-debt item deferred since the original reviews: a real
end-to-end playthrough in each of the 3 core languages, confirming every
room renders, every choice resolves, every field note displays, every ending
fires, with no English fallback leaking. Deferred because long Playwright
runs conflict with the 3-minute-per-script UAT cap; would need a re-scoped,
**split-script** approach (one script per act per language, not one long
playthrough). No new design decisions needed — it's pure verification work.

### T3.5 — Per-choice visual cues/animations for LIMERENCE doors

The second "plan, don't build" owner deferral; largely absorbed by the
diorama accent hooks (F5 Tier 2, shipped). The remainder folds into T1.3.

---

## TIER 4 — Conditional / external-dependency (not actionable now)

### T4.1 — Third content pack

The architecture explicitly anticipates it ("one engine, N packs"). Four
candidate topics are on record from the owner's brainstorming: universal
life-and-death decisions, modern business dilemmas, high-stakes
CEO/diplomat decisions, and criminal/desperation decisions. **Blocked on the
owner choosing a topic.** If one lands, do T3.1 (`flow.ts` split) first, and
budget for large content authoring × 5 languages. This is the single biggest
possible expansion of the product.

### T4.2 — Commercial-store certification

PEGI/ESRB rating submission and Windows code signing. Contingent on a paid
release ever being pursued. The in-game age advisory explicitly self-declares
that it is *not* an official rating; a real submission would require the work
noted in `UPGRADE_PLAN.md`'s packaging-readiness notes.

### T4.3 — Mobile investment

Decided out of scope by the owner's Milestone 5 review; unrevisited. Would
need touch controls, a responsive layout pass, and a performance pass for
mobile GPUs.

---

## Ideas explicitly DECIDED AGAINST (kept on the record, with reasons)

These are *not* open work. They were considered and consciously not built.
Re-opening any of them should be a deliberate owner decision, not a default.

- **T3 epiphany toasts** — investigated and judged redundant: epiphanies
  already surface on the end screen's "filed tonight" block, and no mid-run
  moment exists where one is *earned* earlier than that. A literal toast
  would only be noise. Closed as a no-op.
- **ANAMNESIS light theme** — deliberately none. Its single dark tone is
  *authored*, not a gap awaiting a light variant (`supportsLightTheme: false`
  is a statement, not a TODO).
- **Separate replay modes (museum / daily / NG+ menu entries)** — owner
  decision from the Milestone 5 review: everything integrates into the one
  game organically. One Door mode is the single sanctioned exception-shaped
  idea, and it is intentionally minimal.
- **Usher / Porter backstory, or additional characters** — owner decision:
  the guides stay enigmatic. The Porter's wedding-band tell is resolved only
  by a hidden ending, and that is the intended ceiling of explanation.
- **Loud achievement popups / confetti / red notification dots** — rejected
  on tone. The Experience Charter forbids anything that competes with the
  door screen or "gamifies." The quiet **guest stamps** (shipped) are the
  sanctioned alternative to an achievement system.
- **AudioWorklet re-architecture** — judged unnecessary once the three audio
  glitch fixes (tab-hidden suspend, ramp-before-stop crossfade, master
  compressor) landed.
- **GPU auto-detection heuristics** — rejected in favor of honest, explicit
  presets (the GPU-safe floor default + a "Cinematic" opt-in), which need no
  device-fingerprinting and no heuristics to maintain.
- **"Three doors on one heart" junction rule (an M4-era idea)** —
  intentionally not built; the existing junction room already covers the
  intent.
- **Cross-stage / cross-choice rewind (in the back/reread feature)** —
  deliberately excluded: decisions stay permanent (roguelike honesty).
  Back/reread *within* a stage shipped; rewinding a made choice never will.
- **A first-run "Calm vs Cinematic" choice card** — weighed against the
  silent GPU-safe default + a normal Settings row, and the silent default
  won: a one-time modal before the very first beat is in tension with the
  charter's "quiet UI, no interruptions" rule, and two clicks in Settings
  already lets any player upgrade. Revisit only if real players report not
  knowing Cinematic exists.
- **Persona blurb i18n rework (U-5)** — the persona preset blurbs are stored
  as resolved display text, which drifts after a language switch. Fixing it
  properly needs a `Persona` *schema* change with save-compatibility
  implications for already-saved profiles, judged too risky for a mechanical
  polish batch. On the list as a *real* latent nit, but gated behind a
  genuine schema-design decision, not a drive-by fix.

---

## Standing rules that constrain all future work (not tasks — constraints)

These are binding on anything built next (from `CLAUDE.md` and the Experience
Charter):

1. **Context-first translation** for every string ever — narrative *and* UI
   chrome. Never translate a line in isolation.
2. **UAT discipline:** ≤3 minutes per script, always `?uat=1`,
   keyboard-advance not click-loops, ≤2 attempts per approach then do it
   differently or skip, ask before re-running browser automation.
3. **Never leak one pack's guide vocabulary into the other** (incl. header
   comments, with the anti-leak-comment carve-out).
4. **Definition of Done:** spec check → `tsc` → `vitest` → live `?uat=1`
   verification (screenshots/DOM actually read, not just launched) → honest
   plan/doc entry → one-phase commit → push.
5. **Architecture rules:** content imports pure predicates only; no new
   subsystem logic inline in `Game`; the guide reads state, never writes;
   persistence through `SaveStore` only; schema renames need a version bump +
   fixture; unseeded randomness for cosmetics only.
6. **The Experience Charter wins conflicts:** quiet UI, no grades, no dark
   patterns, endings are trades not verdicts, the doors are the game.

---

## Suggested order if development resumes

1. **T1.1** whenever audio files arrive (zero code; instant, enormous payoff).
2. **T3.4** (EN/CS/FA Playwright matrix) — pure verification, closes the last
   verification-debt item, no design decisions.
3. **T2.1** (richer interlude) — small, self-contained, one translation pass.
4. **T1.3** (LIMERENCE visual rework) — its own design+build session.
5. **T1.4 / T1.5** (authored pattern-barks / echoes) — a writing-first pass,
   unrushed, held to the translation-context rule.
6. **T4.1** (third pack) only on an owner topic choice; do **T3.1** (`flow.ts`
   split) and **T3.2** (type audit) first as its groundwork.

---

*Baseline document 3 of 5 · consolidated from
`docs/development/13-master-development-plan.md` and
`docs/development/17-v2-overhaul-plan.md` on branch
`claude/vestibule-v2-overhaul` at version `1.0.0-rc.2`. Companion documents:
01 (game), 02 (technical), 04 (experience), 05 (history).*
