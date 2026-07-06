# Specification 10 — The Experience Charter (binding for all of Milestone 5)

The owner's standing order, verbatim across milestones: *"The game has to be
beautiful and enjoyable. Perfect. Simply make sure people enjoy the game. View
it from the position of the player. The playing flow must be natural, it must
keep the interest of the player. It cannot be boring."* — and for this
milestone: the game and software *"must remain beautiful, enjoyable to the
player and pleasant to use and play in terms of UI / UX / experience."*

This document turns that into rules a developer agent can be held to. Every
spec (01–09) is implemented **under** this charter; where a spec and the
charter conflict, the charter wins and the conflict is reported to the owner.

## 1. Global principles

1. **The doors are the game.** No new surface may compete with the door
   screen for attention. Nothing pulses, badges, or counts near the doors
   except what already does (the unseen ✦, the teasers, the Usher). This is
   the owner's explicit constraint, stated twice.
2. **Hushed, not gamified.** No popups, no toasts for achievements, no
   confetti, no red notification dots. New information waits where the player
   will look for it (Ledger, Shelf, margins). The loudest thing in the game
   remains a heart breaking.
3. **One interaction to dismiss.** Every new panel (Reflection card, opt-in
   panel, Ledger) closes with a single click / Space / Enter / Escape, from
   anywhere on it. Never trap the player.
4. **Calm pacing is a feature.** The Usher walks in 2.5 s; the camera takes
   2.0 s. Nothing in M5 may make the game feel hurried — and nothing may make
   the *player* wait without meaning: any new animation over 800 ms must be
   skippable or informative.
5. **Respect every existing comfort setting, always:** `reducedMotion`
   (no parallax, no pulse, no bob, instant panels), `typewriter`,
   `highContrast`, `uiZoom` 80–130 % (new panels must not clip at 130 % on
   1280×720 — add to the layout sweep), RTL (Farsi: every new panel obeys
   `body.rtl`; test it), quality low (diorama light budget).
6. **Performance floor:** the 60 fps cap architecture stays; no bespoke room
   may fall under ~30 fps headless (`fps()` assertion, spec 09) or feel
   sluggish on `quality: low` + `performance` render scale.
7. **Text is the material.** New copy matches the established voice: second
   person, present tense, unhurried, never cute, never scolding. Field notes
   cite real thinkers honestly. Czech and Farsi read as written, not
   translated (spec 08 R3 extends this).
8. **Every new visual obeys the palette:** near-black grounds, warm gold
   accents, dim ink, the one violet reserved for secrets. New saturated color
   is an *event* (Mary's red is the milestone's only one — that's the point).

## 2. Per-feature experience criteria (acceptance, judged from the player's chair)

- **New rooms (01):** each room's door hint must make a player *want* it
  without spoiling it; each room readable in 2–4 minutes; no room may feel
  like homework — if a brief reads as a lecture, rewrite before building.
- **Understory (02):** the staircase must feel found, not offered. Violet
  styling, no explanation, the Usher's one oblique line. Descending must feel
  like a privilege of returning, and skipping it must cost nothing visible.
- **Seventh ending (03):** discovery must be possible from inside the game
  alone (three margins + completionism). When it fires, restraint: the
  facility gets *brighter and plainer*, not grander. The Usher says "Ah." and
  nothing else.
- **Keepsakes (04):** a player who never notices them loses nothing and is
  never told they're missing something. The ✧ is the entire advertisement.
- **Examined Path (05):** the offer must read as an invitation, not a
  recommendation; both buttons equal weight. Reflections must *disagree with
  each other* often enough that no tradition reads as the house view — this
  is an editorial acceptance criterion, checked by reading, not code.
- **Ledger & Epiphanies (06):** stats phrased in the game's voice ("The door
  most walked"), never dashboard-speak. Epiphanies are past-tense
  observations, not badges; earning one changes nothing but a line of text.
- **Dioramas (07):** backdrops, not sets. If a diorama is noticeable while
  reading a beat, it is too loud — dim it. Motion budget: one slow element
  per diorama, none under reducedMotion.
- **Light-spill / lantern / pulse (07):** all three serve one feeling —
  *choosing a door is stepping toward something* — and must never fire on
  screens where no choice is being made.
- **Audio (07 Q5):** the reverb makes loss *linger*, not boom. If any accent
  is identifiable as a loop within one room visit, lower it or cut it.
- **Web/Pages (08):** first paint to playable title in under ~5 s on a normal
  connection; the browser tab gets a real title and favicon (add the door
  glyph as favicon — small gap this charter adds to R1).
- **`?uat=1` (09):** invisible to real players in every way that matters.

## 3. The owner's feel-pass checklist (run before each release)

A human — ideally the owner — spends ten minutes and answers yes to all:

1. Does the title screen make you want to click Begin?
2. Walk one room in Czech: does any string feel machine-made?
3. Hover three doors slowly: does the scene answer you (pulse, lantern,
   chime) without shouting?
4. Lose a heart on purpose: does it *land* (sound, pause, honesty)?
5. Open Settings at 130 % zoom on a small window: is everything reachable?
6. Turn on reduced motion: is the game still alive, just still?
7. Play five minutes intending to stop: did you want one more door?

"No" on any question is a release blocker or an owner-acknowledged exception —
never silently shipped.

## 4. Scope guard

Anything a future implementer wants to add that is not in specs 01–09 gets
tested against §1 first. If it adds surface near the doors, adds a popup, or
adds waiting, the default answer is no — take it to the owner instead.
