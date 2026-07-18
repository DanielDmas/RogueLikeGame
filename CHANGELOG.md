# Changelog

One line of history per released version. Full detail for every change
lives in `docs/development/13-master-development-plan.md` (the living dev
log since 2026-07-13; `UPGRADE_PLAN.md` holds the earlier history) and
git history; this file is the short public summary.

## Unreleased (accumulated since rc.1; not yet deployed or version-tagged)

- **Full diorama parity:** every room in both games now has its own bespoke
  diorama (ANAMNESIS 33/33, closing a 12-room gap; LIMERENCE was already
  34/34), plus dioramas render bigger and closer across both games.
- **LIMERENCE visual rework (Phase V):** a standardized, reusable
  environmental fixture kit in the shared engine — the migrating end
  window, a departures board, locker-band walls, wall sconces, a city
  skyline — configured per hotel floor as data, so future game packs get
  the same toolkit; the Top Floor now shares ANAMNESIS's proven dawn
  gradient shader; light mode lifts the whole 3D scene toward a "morning
  read" of the same hotel; per-floor accent colors in both UI themes
  (WCAG-verified); an end-of-act floor-name interlude card; a rare
  "phone lighting in the distance" ambient pulse; door frames now catch
  a glow on hover in both games.
- **Fullscreen stability:** fullscreen now survives every navigation in
  the app (Vestibule ↔ either game, reloads, run resets), resuming on the
  first click, keypress, or pointer press; covered by real-browser tests
  against the production build artifact.
- Persistent Settings access from the landing page and the in-game HUD;
  display settings (quality/zoom/resolution) shared between both games.
- Engine hardening: single-bundle pack loading, save-import validation and
  backup-write-order fix, a WebAudio LFO leak fix, `documentElement.lang`
  and aria-live announcement fixes.

## v1.0.0-rc.1 — 2026-07-13

Final-release-review pass over the whole package (see
`docs/development/12-final-release-review.md`). Both games are now content-
complete, cross-pack-leak-free, and GPU-safe by default.

- **Two release-blocking crashes fixed:** LIMERENCE's own hearts-death
  ending now resolves correctly instead of throwing (was hardcoded to
  ANAMNESIS's `dissolved`), and LIMERENCE's Understory/Records Office is
  now actually reachable (its fork was gated on ANAMNESIS's `'boulder'`
  room id).
- Four more cross-pack leaks fixed: the Porter's LIMERENCE-specific voice
  styling, a scripted quiet-ending path that guaranteed the hearts-death
  crash, the Ledger's endings/keepsake denominators, and the codex's
  synthetic last-message note — all previously fell back to ANAMNESIS's
  own rules for LIMERENCE.
- Engine hardening: the save-persist chain no longer gets permanently
  poisoned by one failed write; scene materials are now disposed on every
  act change (was a slow GPU-memory leak); Escape now closes every
  overlay, not just the pause menu.
- Audio: fixed the background-tab "chirp" (AudioContext now suspends/
  resumes with the tab), the click on every chord crossfade, and added a
  gentle master-bus compressor against clipping.
- **GPU-safe defaults:** new profiles start at low quality / performance
  render scale / 30fps cap — a "Cinematic" preset is now something you
  opt into in Settings, not the unconfigurable starting point.
- New: an "Exit to The Vestibule" button in both games' menus; back/reread
  navigation within a room's beats and at the choice screen; the
  architecture (folder convention + manifest + engine hooks) for
  file-dropped voice narration and music, dormant until real audio files
  are added.
- LIMERENCE reached full translation parity with ANAMNESIS across all five
  languages (cs/fa/de/fr, plus English), coverage-tested.

## v0.2.4-beta — 2026-07-09

**The Vestibule.** This repo now ships a collection of two games sharing
one content-agnostic engine, rather than a single title — see the README
for the collection framing.

Milestone 5 for ANAMNESIS (finished this release):

- New rooms and a hidden Act V: Buridan's queue, the reference letter,
  the Chinese Room, Newcomb's annex, the veil of ignorance, Mary's room,
  the butterfly's dream, the swampman, a secret room, and the optional
  Understory (the archive, the unchosen, the echo).
- A seventh, hidden ending for players who complete the Codex and meet its
  other quiet conditions.
- Keepsakes: small, optional mementos a few choices leave you carrying
  into future runs.
- The Examined Path: an opt-in mode adding plural ethical readings after
  significant choices.
- The Ledger: a cross-run history screen with earned epiphanies.
- GitHub Pages web build, Electron window-state memory and single-instance
  lock, a generated dead-flag audit test, a content-pipeline validation
  test, and a citation-accuracy pass over every field note.

**LIMERENCE joins as a second title (content-complete beta):**

- The engine split into one content-agnostic core plus per-title content
  packs (`ContentPack`) — ANAMNESIS unchanged and behavior-neutral
  throughout the split.
- LIMERENCE: a roguelike about relationships at their breaking points,
  guided by the Night Porter. All four acts (Act I: 7 rooms + a gate ·
  Act II: 8 rooms + a gate · Act III: 8 rooms + a secret room + a gate ·
  Act IV: 3 rooms including the final gate), the optional Records Office
  (3 rooms for returning players), and all 7 endings are real, authored
  content — every choice carries plural ethical reflections and a field
  note citing real psychology research, and a full run is playable start
  to finish, including its ending, today. All 4 keepsakes have both an
  earn room and a spend room. Still open: LIMERENCE's Ledger shows
  generic epiphany lines rather than its own 12 designed ones.
- An onboarding advisory (shown automatically once, re-viewable from the
  title menu): the themes list, an age/content note, "this is fiction, not
  therapy," and a help line — ANAMNESIS is unaffected, keeping its own
  original explainer unchanged.
- A rozcestník (chooser page) at the site root linking to both titles, each
  now buildable as its own independent production bundle.
- Its own visual and audio identity: a sodium-amber/corridor-teal hotel
  palette with an optional light/dark theme toggle (LIMERENCE only), a
  minor-leaning generative score resolving to a held major chord at the
  ending, and its own door and panel geometry — a thinner steel-dark door
  frame and sans-serif, asymmetrically-cut panels reading as
  21st-century-modern rather than gothic.
- Run `npm run dev:limerence` to play it locally.

## v0.1.5-v2-beta — 2026-07-05

Milestone 4. Full Czech and Farsi translations (both an original v1 voice
and a rewritten v2 voice), a persona system (player name/blurb woven into
select lines), dynamic scenery moods per act, save-integrity hardening
(backup-on-corruption, profile export/import), Settings expansion
(reduced motion, high contrast, typewriter toggle, renderer quality tier),
door-visibility and Usher-motion fixes, and a full regression + UAT pass.

## v0.1.0 — 2026-07-04

Initial release. The core game: prologue + 20 authored rooms across four
acts, six endings, hidden alignment axes, field notes with a persistent
Codex, generative procedural audio, an SVG icon system, and Electron
packaging with an automated Windows EXE release workflow.
