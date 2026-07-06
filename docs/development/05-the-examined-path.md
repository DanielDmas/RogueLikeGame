# Specification 05 — The Examined Path (Phase O)

## 1. Purpose & player experience

An opt-in way to play where the game, after each significant choice, holds up
the strongest readings of that choice from several named ethical traditions —
side by side, without a verdict. Difficulty here means *confronting
counterarguments*, never punishment. Owner's constraints, verbatim: teach
morality "*objectively, do not make answers be forced to players or claim
there is just one truth or ideal behaviour*"; "*the choice [must be] optional
(i.e. user must make their intent to enable this and it must be fully
explained what it is and how it works)*"; "*make effort to make this mode have
some logic and fit into the game*".

In-fiction frame: the facility's **Examination Annex** — an optional stamp on
your intake file. The rooms are unchanged; a quiet clerk simply files
commentary after each of your choices.

## 2. Scope & non-goals

- **In scope:** the opt-in panel, per-run flag, Reflection cards, one Socratic
  follow-up per act, authoring of reflections for all significant choices,
  guard tests.
- **Non-goals:** no scoring, no correct answers, no mechanical effects of any
  kind (hearts/lucidity/axes identical ON or OFF), no mid-run toggling, no
  changes for players who never opt in.

## 3. Current state of the code

- Choice flow — `flow.ts` `enterRoom`: beats → `choices.pick()` → `applyEffects`
  → transcript push → persist → **outcome beats** (`text.playBeats`) → next
  stage. The Reflection card renders **after the outcome beats, before the
  next stage/field note** — the choice has fully landed first.
- Run start — `Game.start()` title loop resolves `'new'` → persona check →
  `newRun()`. The opt-in panel slots between persona and `newRun`.
- Settings — `Settings` interface + `showSettings` sections
  (`src/ui/overlays.ts`: `sectionEl`/`settingRow`/`toggleRow` helpers, Data
  section pattern). One new row shows the *default* only.
- Text plumbing — `t()`, `uiKey()`, `usherBarkKey()`; the Usher's act intros
  play in `syncTheme` (`flow.ts`) — the Socratic follow-up piggybacks there.
- Overlay pattern — `showAbout` is the model for the explainer panel (scrolling
  body + single dismiss button).

## 4. Data model changes

```ts
// saveStore.ts — Settings gains:
/** Default offered when starting a new run; the run itself carries its own flag. */
examinedPathDefault: boolean;   // default false

// schema.ts — RunState gains:
/** This run walks the Examined Path (immutable once the run starts). */
examined?: boolean;

// schema.ts — Choice gains:
/** Optional plural readings shown only on the Examined Path. */
reflections?: Reflection[];

// schema.ts — new:
export interface Reflection {
  /** i18n'd tradition label key suffix: 'consequence' | 'duty' | 'virtue' | 'care' */
  tradition: 'consequence' | 'duty' | 'virtue' | 'care';
  text: string;   // one sentence; English source; translated via reflectionKey
}
```

Spread-merge safe throughout. `examined` serializes with the run, so
quit/resume preserves the mode.

## 5. Behavior specification

### Opt-in panel (`showExaminedPathOffer(ui, defaultOn): Promise<boolean>`)

- Shown in `Game.start()` on the `'new'` path only (never `'continue'`),
  after persona, before `newRun`. Two buttons, equal visual weight:
  **"Walk plainly"** and **"Take the Examined Path"** — preselect nothing;
  highlight neither as "recommended".
- Body copy (full explanation, owner's requirement) — direction, must state
  ALL of: after each choice you'll see how several traditions of moral
  thought might read it; the readings disagree with each other on purpose;
  nothing is graded, nothing is scored, no reading is the "right" one; the
  rooms, hearts, and endings are completely unchanged; you can dismiss every
  card with one click; the default for next time can be changed in Settings.
  In-fiction one-liner: *"The Annex files commentary. It has no opinion — it
  has four."*
- The player's pick is written to `settings.examinedPathDefault` (so the
  panel remembers) and stamped onto the new run (`examined: true/false`).
- Settings row (Text & Language section): "Examined Path — offered at the
  start of each new run" with description; toggling mid-run changes only the
  default, and the description must say so.

### Reflection cards

- Trigger: `state.examined && choice.reflections?.length` after the outcome
  beats finish.
- Render (`src/ui/reflection.ts`, new): a panel visually quieter than the
  text panel — same width family, dimmer border, header "The Annex files:"
  (`uiKey('annexHeader')`). One row per reflection: small caps tradition
  label (`uiKey('tradition.' + tradition)`) + one italic sentence. Footer
  hint: "click · continue". Entire card dismisses on one click / Space /
  Enter (reuse the `waitAdvance` pattern from `textPanel.ts`, including the
  overlay-guard added in M4).
- Order of rows: shuffle per display (a fixed order would silently rank the
  traditions; shuffling is the neutrality the owner asked for — document this
  in a code comment).
- `reducedMotion`: no fade animation, instant show.

### Socratic follow-ups (once per act)

- After an act's intro beat in `syncTheme` — when `state.examined` and
  `act 1–4` — one additional Usher line, interrogative, rhetorical:
  bark ids `examined-act1..4`. Direction: act 1 *"Would you have chosen the
  same in front of witnesses? Would that have been better — or only nicer?"*;
  act 2 *"When the machine is right, does it matter why?"*; act 3 *"Which of
  your reasons tonight were yours, and which were rehearsals?"*; act 4
  *"If no one could ever know, walk the corridor again. Anything change?"*
- Rendered as an ordinary bark-style beat; a single advance dismisses it. No
  input, no branching, no record kept.

### Authoring the reflections

- **Coverage:** every choice in every DILEMMA and INSIGHT room (existing 21
  + spec 01's rooms + spec 02's rooms), all four traditions each.
  NO-SOLUTION and DOOMED rooms: optional, at the writer's judgment (some
  choices there resist framework readings; forcing them would be dishonest —
  acceptable to ship with a `reflections` gap in those rooms).
- **Voice rules (binding):** each reading ≤ 160 characters of source English;
  present tense; names its consideration, not a verdict ("A consequentialist
  weighs…", never "You should have…"); at least one of the four must *favor*
  and one must *question* the taken choice wherever the material allows —
  plurality is enforced editorially, not mechanically.
- **Two worked examples (final copy quality bar):**
  - `wallet` / return-it choice — consequence: *"One wallet returned changes
    little; the habit of returning them changes a city."* · duty: *"It was
    never yours; the arithmetic of outcomes doesn't enter."* · virtue: *"Ask
    what the person you're becoming does with found things."* · care: *"Someone
    is retracing their steps tonight; the wallet is heavier for them than for
    you."*
  - `junction` / pull-the-lever — consequence: *"Four lives against one is
    not a close question — if numbers are what count."* · duty: *"The hand on
    the lever authors a death that waiting would not."* · virtue: *"Neither
    the puller nor the refuser gets to stay innocent; ask which regret you
    can live beside."* · care: *"None of the five are strangers to someone;
    proximity was doing the counting for you."*

## 6. i18n

New key builder `reflectionKey(roomId, choiceId, tradition)` in `keys.ts`;
tradition labels `ui.tradition.consequence|duty|virtue|care`; panel strings
(`annexHeader`, opt-in panel title/body/buttons, settings row + desc); bark
ids `examined-act1..4` added to `USHER_BARK_IDS`. EN+CS+FA in the same
commits as authoring. **Extend `translationCoverage.test.ts`** with a scan
that every authored `reflections` entry has cs+fa registrations.

## 7. Test plan (`examinedPath.test.ts`)

- **The no-op guard (owner's constraint):** with `examined: false` (or field
  absent — legacy save), simulate full runs and assert: identical available
  choices, identical effects application, identical transcript, zero
  reflection renders (assert via a pure `shouldShowReflections(state, choice)`
  helper — extract it so this is DOM-free).
- Reflections shape: schema validation across all authored content — allowed
  tradition values, ≤160 chars, ≥1 reflection implies all four present for
  DILEMMA/INSIGHT choices (or an explicit allowlist of exceptions).
- Opt-in persistence: default round-trips through Settings; run flag survives
  quit/resume.
- Socratic lines: exist for acts 1–4 in en+cs+fa; never fire when
  `examined` is false (unit-test the gate condition).

## 8. Acceptance criteria

- [ ] A player who declines sees nothing new, ever — provably.
- [ ] A player who opts in gets plural, non-judging readings after every
      significant choice and four rhetorical questions per run, and can
      dismiss each with one click.
- [ ] Full explanation precedes enabling; Settings only edits the default.

## 9. Dependencies

Authoring covers spec 01/02 rooms — land after them, or stage reflections
per-room alongside. No other feature depends on this one.
