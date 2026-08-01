# The Vestibule — Total Gameplay Experience

> **Baseline document 4 of 5.** This describes *what it is like to play* —
> the whole experience from the player's chair, minute by minute, first
> contact to hundredth run, for both titles. Where documents 01 and 02
> describe the game as an object and a system, this one describes it as an
> *event that happens to a person*. It exists so a future maintainer can feel
> the intended experience before touching it — because the game's single most
> binding rule (the Experience Charter) is defended from exactly this
> vantage: "view it from the position of the player."
>
> Companions: 01 (game), 02 (technical), 03 (future), 05 (history).

---

## 1. The governing feeling

Every design decision in this project answers to one owner instruction,
repeated verbatim across milestones:

> *"The game has to be beautiful and enjoyable. Perfect. Simply make sure
> people enjoy the game. View it from the position of the player. The playing
> flow must be natural, it must keep the interest of the player. It cannot be
> boring."*

That produced a specific texture, codified in the Experience Charter
(`docs/development/10-experience-charter.md`): **hushed, not gamified.** No
popups. No achievement toasts. No confetti, no red dots, no scoreboards. The
loudest thing in the entire game is a single heart breaking. New information
never chases the player; it waits where they will look for it. Calm pacing is
treated as a *feature*, not dead time — the guide walks in over 2.5 seconds,
the camera settles over 2.0, and nothing rushes. **The doors are the game**:
no surface is ever allowed to compete with the door-choice screen for
attention.

The result is closer to a lit reading room at 3 a.m. than to a video game
menu. You are meant to lean in, not to be alerted.

---

## 2. First contact (the title screen and onboarding)

The player arrives — from the web chooser page (rozcestník) that offers
ANAMNESIS and LIMERENCE as two lit doors, or by launching the Windows app on
that same choice — at a **title screen**: the game's name in wide, spaced
serif over a near-black corridor with slow fog parallax, a one-line tagline,
a "how to play" triplet (click a door or press 1–3; click text or Space to
continue; Esc pauses), and a quiet vertical menu of options. For LIMERENCE, a
small self-declared **16+ · Mature Themes** badge sits under the title,
present every visit, not just the first.

The menu offers, in an order that grows over time: **Begin** (or "Begin
again" once a run is complete), **Continue the journey** (only if a run is
mid-flight), **Field Notes** (the Codex, with a collected count), the
**Ledger/Register**, **One Door**, **Who are you?** (the persona editor, or
your chosen name once set), **Settings**, **Before you begin** (the
About/advisory), **Credits**, **The Vestibule** (exit to the chooser), and —
in the desktop build — **Exit**.

Pressing **Begin** for the very first time runs a deliberate, gentle
onboarding, exactly once per profile, never stacked:

1. **"Before you begin"** appears automatically — the mechanics explainer
   (ANAMNESIS's own; LIMERENCE's fuller advisory with the content note, the
   themes list, the "this is fiction, not therapy" register, and a help
   line). No one starts the game not knowing what it is or why.
2. **The persona editor** — an optional invitation to name yourself and write
   a one-line "about you." Both a chosen name and **Skip** are equally
   weighted, and Skip is now *sticky*: decline once and you are never asked
   again (the title menu's "Who are you?" is always the way back in).
3. On a genuinely first-ever run, the **Examined Path** offer is *deferred*
   past these two to the first choice that actually carries reflections, so
   the player's very first beat isn't preceded by a third modal.

Then the corridor fades in, and the game begins.

---

## 3. A single room, in detail

The unit of play is a **room**, and understanding one room is understanding
the whole game. Here is the shape of the experience, using ANAMNESIS's
opening room as the example.

You are looking down a dim 3D corridor. A **diorama** — a small, dim,
parametric backdrop tableau — sits behind the scene, present but never loud
enough to pull your eye off the text. Over it, a DOM **text panel** types out
beats, one at a time (unless you've turned the typewriter off), in a calm
second-person present tense:

> *You wake in a waiting room. It smells like a hospital, a childhood
> hallway, and rain.*
>
> *There are chairs. There is a clock with no hands. There is a window, and
> behind the window there is more window.*
>
> *You do not remember your name. You reach for it the way a tongue reaches
> for a missing tooth.*

You advance beats with a click, Space, or Enter. The guide arrives, prefixed
in his own gold-italic voice:

> *Usher: You are awake. That is either very good news, or the worst kind. I
> have stopped guessing which.*

Beside the panel sits a small **"?" button**. Pressing it opens a
plain-language **explanation** written for someone with no philosophy
background: what's actually being asked, why it's hard, and a concrete
everyday example. It is never required — the room stands on its own — but it
is always there for the player who wants the ground under the metaphor.

Then the **choices** appear as cards (also selectable 1–9, arrow-keys +
Enter). Each carries a short *hint of the stakes* — never a grade, never a
"correct" flag:

> *"Where am I?"* — Orientation first.
> *"Are you God or the Devil?"* — Know your bureaucrat.
> *"I want to go back. Now."* — Straight to the point.

You pick one. Its **outcome** beats play — the guide answers, the situation
turns — and, invisibly, three hidden alignment axes shift a little
(reason↔feeling, self↔others, control↔acceptance), and perhaps a heart or a
point of lucidity moves. Nothing announces the numbers. You *feel* the choice
land in the prose, not in a stat readout.

Finally, a **Field Note** offers itself — the real philosophy behind the
room, the actual thinkers and arguments, honestly cited:

> *Anamnesis · Plato · Meno (c. 385 BCE)* — *"Plato proposed something
> strange: that learning is not acquiring the new but remembering the
> forgotten… The moments that most change us rarely feel like additions.
> **They feel like recognition — 'I knew this, and had arranged not to.'"***

The note is filed forever in the **Codex**. A few rooms add a **"Read more"**
long-form article for players who want to follow the citation deeper. Then a
door opens, or a choice of doors, and you walk to the next room.

That loop — *arrive → read → understand (optionally) → choose → feel the
consequence → learn the real idea → walk on* — is the entire game, repeated
15 times per run across four acts, each act ending at a **gate** room that
always closes it.

---

## 4. A full run, arc by arc

A run is about **20–30 minutes** and has a genuine shape.

- **Prologue — The Waiting Room / The Front Desk.** Orientation. You meet the
  guide, learn (obliquely) what the resources are, and make your first,
  low-stakes choices. In LIMERENCE this is a hotel check-in at 3 a.m.
- **Act I — The Shallows / The Ground Floor.** The everyday. Small, human
  dilemmas — a found wallet, a family dinner, a read receipt left on
  overnight, a party dare. You complete three of the act's rooms (choosing
  which doors to open, and therefore which rooms you'll *never* see this run),
  then the gate.
- **Act II — The Machinery / The Second Floor.** The abstract machinery of
  ethics turns on. ANAMNESIS stages the canonical thought experiments (the
  trolley junction, the experience machine, Omelas, the Chinese Room);
  LIMERENCE deepens into distance, temptation, and the mathematics of
  jealousy. The tone tightens; a heart can start to cost.
- **Act III — The Mirror / The Long-Stay Wing.** Identity and self-deception.
  The teleporter and the memory editor and Mary's Room; the colleague, the
  discovery, the wedding eve. This is where a *secret door* may appear for
  the player who has earned the sight to see it. The scene palette has grown
  colder and more settled.
- **Act IV — The Threshold / The Top Floor.** A fixed, unbranching corridor
  now — no more choosing which rooms to skip. The boulder (or, for returning
  players, the descent into the Understory), the last message you leave, and
  finally the door that asks. Here the run's whole arc is gathered and put to
  you one last time.
- **The ending.** Not a win or a loss. Your three hidden axes and your final
  choice resolve into one of seven authored endings, each a coherent trade,
  written as one. If your hearts reached zero along the way, that too is an
  ending — *dissolved*, or *the ghost* — authored and dignified, never a
  "GAME OVER."
- **The Morning Report.** One composed screen after the ending quotes your
  run's 3–4 pivotal choices back to you, shows where your three axes landed
  in plain sentences, tallies the hearts you kept and spent, and names the
  doors you never opened — the screenshotable artifact and the reason to come
  back, in one.

Throughout, **quitting is always safe.** The game persists constantly; you
can close the tab mid-sentence and resume exactly there, and the guide will
quietly acknowledge that you left a room mid-thought when you return.

---

## 5. The two moods: ANAMNESIS vs. LIMERENCE

The engine is shared, but the *felt experience* of the two titles is
deliberately different.

**ANAMNESIS** is metaphysical, playful-grave, and cool. Its guide, the Usher,
jokes about being God on odd days. Its palette is near-black grounds, warm
gold accents, dim ink, a single violet reserved for secrets — and saturated
color is an *event* (Mary's red is the one deliberate splash in the whole
game, and that is the point). Its music is generative and drifting. It asks:
*who are you, underneath what you've decided about yourself?*

**LIMERENCE** is human, grave, and warmer-but-more-wounded. Its guide, the
Night Porter, is tired in a centuries-deep way and never jokes. Its palette
is sodium-amber and corridor-teal, with an optional light/dark toggle that
lifts the whole hotel toward a "morning after" read. Its doors are thinner,
cooler, modern steel — and every one sits a fraction of a degree off-plumb,
its glow carrying a second slow wave under the breathing pulse, so the whole
corridor is faintly *not quite still*. Its music is minor-leaning, resolving
only at the very end to a single held major chord — melancholy that lands
somewhere, rather than staying bleak. It asks: *what did you do to the people
who loved you, and what was done to you?* — and it makes you occupy every
role in that question across a run, because perspective-taking is the whole
therapeutic bet.

---

## 6. Replay: why you come back

A single run shows you 15 of 30-plus rooms. **You cannot see everything in
one stay** — the quotas are always set below pool size on purpose. That
scarcity is the primary replay engine, but it is reinforced by layers that
reward the returning player specifically:

- **The Codex fills in.** Every field note you've earned persists; the
  collected count on the title screen climbs; empty slots quietly invite the
  rooms you haven't met.
- **The Ledger/Register remembers everything** — hearts kept and spent across
  all runs, endings witnessed out of the total, your most-walked door, the
  doors you've *never* opened shown as named teasers, and **guest stamps**
  (spoiler-free rubber-stamp milestones: "Walked every floor," "Never set a
  trap," "Checked out with all three hearts").
- **Epiphanies unlock as quiet lines**, past-tense observations about your
  own pattern of play ("You have never once asked before accusing.") — never
  badges, changing nothing but the text itself.
- **Keepsakes thread between lives.** A handful of choices leave you carrying
  a small memento — a casino chip, a cheap party ring, an unsent letter —
  into *future* runs, where it may unlock a bonus choice marked only by a
  single `✧`. A player who never notices them loses nothing.
- **The guide begins to know you.** Cross-run pattern detection means the
  Usher or Porter will, at a door, remark on the shape of how you keep
  playing — the third run that never opens an Act II door, the player who
  always verifies before acting.
- **Secret rooms and hidden endings** open only to returning, attentive
  players — a secret door in Act III, the optional **Understory / Records
  Office** descent for anyone offered the stairs on a second run, and the two
  hidden seventh endings each pack keeps entirely off the Codex until
  witnessed.
- **The Examined Path** offers a whole second reading of the same rooms — the
  plural ethical framings, deliberately disagreeing with each other — for the
  player who wants the philosophy explicit.

The intended long-tail feeling: not "grind to 100%," but "there is always one
more door, and the place remembers me."

---

## 7. On-ramps for the hesitant

Not every player wants to commit to a 25-minute run. The game offers gentler
ways in:

- **One Door mode** deals a single random room as a standalone ~3-minute
  vignette — no run, no ending, no commitment — and still counts the room in
  the Ledger and unlocks its Codex note. It's both a daily-ritual-shaped
  entry point and an advertisement for rooms you haven't met.
- **The Codex, Ledger, and Register are browsable from the title screen**
  without starting a run at all, for the player who just wants to revisit what
  they've collected.

---

## 8. Comfort, accessibility, and respect for the player

The charter's rule "respect every existing comfort setting, always" is load-
bearing. In Settings (reachable from the title, the pause menu, the in-game
HUD gear, *and* the landing page):

- **Reduced motion** — no parallax, no glow pulse, no camera bob, instant
  panels. The off-plumb door sway and the second glow wave both stop. The
  game stays alive, just still.
- **Typewriter toggle** — text appears all at once instead of letter by
  letter.
- **High contrast** — a lighter ink for easier reading; the whole palette was
  WCAG-audited so no state is conveyed by color alone.
- **Renderer quality (low/high), render scale, FPS cap (30/60)** — new
  profiles default to a GPU-safe floor tier that runs on a decade-old
  integrated GPU; "Cinematic" (bloom, 60 fps) is an explicit opt-in, never
  the unconfigurable starting point.
- **UI zoom 80–130%** — the layout holds down to 1280×720 at 130% zoom.
- **Full Farsi RTL mirroring** with its own font — every panel obeys the
  right-to-left layout.
- **Independent music and SFX** toggles and volume sliders; a light/dark
  theme (LIMERENCE); the ANAMNESIS v1/v2 text-voice choice; live language
  switching mid-run.
- **Data ownership** — profiles export and import as JSON; nothing is tracked,
  sent anywhere, or tied to an account. The save lives only in the browser.

The player is never trapped: every panel closes with a single click, Space,
Enter, or Escape, from anywhere on it.

---

## 9. The owner's ten-minute feel-pass (the acceptance test)

The charter defines the human test every release must pass — a person spends
ten minutes and must answer *yes* to all of:

1. Does the title screen make you want to click Begin?
2. Walk one room in Czech: does any string feel machine-made?
3. Hover three doors slowly: does the scene answer you (pulse, lantern,
   chime) without shouting?
4. Lose a heart on purpose: does it *land* (sound, pause, honesty)?
5. Open Settings at 130% zoom on a small window: is everything reachable?
6. Turn on reduced motion: is the game still alive, just still?
7. Play five minutes intending to stop: did you want one more door?

A "no" on any question is a release blocker or an owner-acknowledged
exception — never silently shipped. If you are extending this game, **this
list is the bar.**

---

*Baseline document 4 of 5 · written from the source and the Experience
Charter on branch `claude/vestibule-v2-overhaul` at version `1.0.0-rc.2`.
Companion documents: 01 (game), 02 (technical), 03 (future), 05 (history).*
