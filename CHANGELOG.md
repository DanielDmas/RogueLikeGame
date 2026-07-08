# Changelog

One line of history per released version. Full detail for every change
lives in `UPGRADE_PLAN.md` and git history; this file is the short public
summary.

## v0.2.0-beta — 2026-07-08

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
