# Working rules for this repo

## Browser/UAT testing (Playwright)

- A UAT/Playwright run must never take more than 3 minutes wall-clock. Give
  each script its own hard timeout and design it to finish well under that —
  split a broad playthrough into several small, focused scripts (e.g. one for
  the title/onboarding flow, one for i18n/menus, one for save/reload) rather
  than one long script that clicks through the whole game.
- Advance beats via keyboard (`Space`/`Enter`) with short fixed waits, not by
  polling-and-clicking a DOM element in a loop — the typewriter's
  skip-then-advance semantics make naive click-loops slow and flaky.
- If a UAT script needs to be re-run (it failed, hung, or needs a second
  pass), stop before re-running it and ask the user whether they'd like to
  switch to a smaller/cheaper model first, to avoid burning tokens on repeat
  browser-automation runs.
- If a check still doesn't pass after one repair attempt, stop trying to fix
  it further — report what's wrong and move on, rather than iterating
  indefinitely.
- Load the game with `?uat=1` (or bare `?uat`) in every UAT script. It forces
  the typewriter off, runs scene tweens/fades/toasts at 4x speed
  (`speedMultiplierFor` in `src/engine/uatMode.ts`), and exposes a
  `window.__anamnesisUat` handle (`version`, `state()`, `doorRects()`,
  `fps()`, `jump(roomId)`) that does not exist without the flag. Use
  `jump(roomId)` to land directly on a specific room for a screenshot sweep
  instead of playing there by hand — it persists a legitimate `RunState` and
  reloads, so it can't produce an illegal game state. It refuses unknown room
  ids with a console warning rather than throwing.

## Translating content (Czech, Farsi, and any future language) — ALWAYS, for EVERY string

**This rule applies without exception to every single piece of text ever
translated in this project — narrative or not.** It is not specific to
reflections, side notes, room content, or any one feature; it governs every
`registerAll(...)` call regardless of what triggered the work: room beats,
choice text/hints/outcomes, field notes, ending prose, keepsake names/
origins, Examined Path reflections and Socratic asides, and equally the
"boring" UI layer — settings labels and their descriptions, button text,
toasts, tooltips, ARIA labels, pause/title menu copy, onboarding/About
copy, error or empty states, anything at all. If it is wrapped in `t(...)`
and shown to a Czech or Farsi player, this rule applies to it. Do not
narrow this to "content translation" — a Settings toggle's description is
just as much in scope as a room's field note.

- Never translate a line in isolation. Before writing a Czech or Farsi
  string, read the surrounding context it actually appears in — the room's
  beats and the specific choice's stakes for narrative text; the feature's
  purpose and what the player is doing on-screen for UI text — a literal,
  word-for-word rendering of the English is frequently *wrong* even when
  every word is correct, because English idiom, register, and word order
  don't carry the situation's tone across. Translate the *meaning in
  context*, not the sentence.
- After drafting a translation, reread the English source next to it and ask:
  does this actually make sense for a native speaker encountering this exact
  door/riddle/choice, or this exact screen/button/setting? Does the register
  match (formal vs. intimate, playful vs. grave; UI chrome is generally
  neutral/formal, the Usher's voice is not)? Would an idiom or a more
  natural phrasing land better than a direct calque? Revise until the
  answer is yes — don't ship the first draft.
- **TODO, not yet done:** a lot of the Czech and Farsi translations shipped
  before this rule was written (Milestones 1–5 through Phase N) were produced
  more literally/mechanically, without this context pass. They need to be
  re-reviewed and corrected against this standard in a dedicated future pass
  (candidate for Milestone 5's Phase R localization work) — don't do it
  opportunistically mid-feature; audit it as its own pass so nothing is
  missed.
