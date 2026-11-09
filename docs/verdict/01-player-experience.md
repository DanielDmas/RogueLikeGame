# 01 — Player journeys, screens and state-level UX

## 1. Entry routes

**Primary: a direct LinkedIn link.** Opening an episode URL shows its spoiler-free premise and decisions immediately; no splash screen, account, “choose a persona,” typewriter animation or generic hub detour. A first-time player should know what to do within about five seconds.

**Hub:** /verdict/ with a featured scenario, three concise episode cards, mode and approximate duration labels, a visible author credit and “Back to The Vestibule.” No giant catalog or filter system.

**Returning player:** local progress remembers the current episode and completed episodes. Visiting an explicit deep link always honors the requested episode; resuming a different story is never a blocking dialog.

## 2. Ripple Effect — canonical flow

    Social link / episode selection
      → Setup (short facts; 3 credible options visible)
      → First commitment (one of A / B / C; no automatic undo)
      → Immediate reaction (what was actually set in motion)
      → Twist (new fact, one satisfying reveal)
      → Second choice (A / B / C approaches, adapted to existing commitment)
      → Contextual resolution (initial action + follow-up)
      → Optional “Guess the crowd” (predict most common FINAL approach)
      → Optional real statistics (sample size, initial/final, changed approach)
      → Replay / try another / challenge a friend

**Setup:** headline, 1–3 short paragraphs, perhaps a supporting receipt/chat/office artifact, three large choice cards. Avoid “Continue” steps before first choice.

**After first commitment:** a short animation changes a tangible object or message; a one- or two-sentence reaction communicates what is now irreversible. The action is committed when chosen, before animation. If user reloads at this point, preserve their choice.

**Twist:** reveal one or two precise new facts. It can be contextualized to reflect the first action, but the factual information stays consistent across paths for fair comparisons.

**Follow-up:** choose what to do *from here*. The first action is not retroactively undone. The wording may differ by first decision but use the same three comparable approach IDs. Re-read the initial context via a small non-destructive affordance.

**Outcome:** narrate causal consequences of both stages. Brief sections: what happened, what this solved, what it cost or complicated. Avoid pretending a fictional outcome is a prediction about real life. The player can inspect other paths *after* the first completed run, but this must not record additional independent votes.

**Human comparison:** show real response counts and honest proportions only after completion. “Changed approach” compares semantically equivalent approach IDs, never the mere fact that a second action was taken.

## 3. Quick Dilemma

    Setup + 2–4 decisions
      → Commit one choice
      → Authored outcome
      → Optional crowd prediction and honest comparison
      → Another episode / challenge

Quick uses the same shell, choices, results and sharing components, with the twist and second-choice phases omitted via a discriminated scenario type. This is not a shorter copy of Ripple disguised by skipping meaningful content. The setup must still deliver an interesting one-step payoff.

## 4. Decision Duel (after initial release)

    Player 1 finishes
      → generates challenge link (scenario ID/version + encoded choices or short share token)
      → Player 2 enters fresh, sees zero spoilers
      → Player 2 finishes
      → side-by-side comparison / what differed / invite another

Design it **asynchronous**, with no presence system, lobby, chat, authentication or synchronous multiplayer. A signed/opaque server token is optional if payload length or privacy warrants it; initial experiments may use client-side encoded choices in a link if no personal data is contained. Only compare compatible scenario versions. Challenger’s choices must be hidden until the recipient finishes.

## 5. Navigation and control

- Progress indicator: “Decision 1 of 2”, then “New information”, then “Decision 2 of 2”, without flashy progress-bar gamification.
- Reading back is allowed freely; changing an already committed choice is allowed only by starting a clearly marked *new replay*.
- After a choice: buttons disable immediately, no double-advance, transitions respect reduced motion. Keyboard Enter/Space and number keys work when relevant.
- A pause/reload cannot produce a duplicate effect; reducers and local persistence are idempotent.
- Explicit “Start over” restarts locally and does not silently submit another public vote.
- User may jump between episodes on the hub; warn only if an important unfinished run would be lost, and offer recovery rather than trapping them.
- No time pressure by default. Optional later time-limited variant must never gate accessibility or input.

## 6. Results / community views

Three views: (1) **Your journey**: choice pair and contextual outcome. (2) **How people decided**: real choices, n and sampling caveat. (3) **What changed**: first-to-final transition matrix or a few understandable numbers. Avoid data visualisation clutter on small screens.

“Guess the crowd” is optional, one selection before results are revealed. The score refers only to the majority guess; no psychological scores. If no verified majority exists (tie or too few votes), describe it neutrally.

Nonparticipation must not block gameplay. A person can see public aggregates without submitting their own choices; joining a poll requires affirmative opt-in. When results API is down, reveal the authored outcome and show “Community results unavailable” with a retry, not synthetic bars.

## 7. First-use copy examples

- Hero: **“A friend cancels. €200 is missing. What do you do?”**
- Supporting line: “Choose once. Learn what changes. Make your next call.”
- First commitment: “You’ve sent the message. You can still respond differently, but you can’t unsend it.”
- Twist: “There’s one thing you didn’t know.”
- Outcome: “Here’s what your two decisions set in motion.”
- Comparison: “Among players of this episode (not a representative poll)…”
- Next: “Try a different decision” / “Send this dilemma to a friend” / “Play another.”

Tone should be human, clear, lightly witty where appropriate. Avoid “Your moral profile,” “Correct answer,” “Your judgement is final,” or a pompous narrator.

## 8. Edge / failure states

- Missing/invalid episode URL → hub with gentle message, no fatal exception.
- Old saved scenario version → safely start a new version or show a non-spoiler explanation; never load incompatible outcomes.
- Mid-transition refresh → stable restored phase; do not duplicate an action or a public vote.
- Offline → locally bundled story still plays; results area clearly explains missing network.
- One vote / no votes → show actual sample count; do not display definitive majorities or unsupported insights.
- API denial / duplicate vote → experience completes; neutral notice, no blame.
- Reduced motion / zoom / small screen → nothing clipped or hidden behind sticky controls.

## 9. Human-player acceptance script

Give a fresh test subject a deep link on their phone and remain silent. Observe:
1. Did they tap a choice without instruction?
2. Could they explain why the first action mattered?
3. Did the reveal change their interpretation rather than feel random?
4. Did they understand the second decision was *not* a rewind?
5. Could they describe the outcome and optionally replay?
6. Did they want to compare with others or forward the challenge?
7. Did the interface feel warm and pleasant at ordinary mobile width?

If any major answer is “no”, fix content/UX before building new infrastructure.
