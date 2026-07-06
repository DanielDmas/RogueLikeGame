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
