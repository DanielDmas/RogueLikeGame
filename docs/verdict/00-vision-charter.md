# 00 — Product vision and creative charter

**Project:** THE VERDICT · *Make the call. See what happens.*  
**Collection:** The Vestibule · third independent experience  
**Status:** Approved product direction; planning only  
**Authority:** This spec plus VERDICT_PLAN.md governs THE VERDICT. Existing CLAUDE.md continues governing the existing project and relevant shared infrastructure.

## 1. Core promise

Play a captivating miniature story about a recognizable decision. Make an initial commitment, witness its immediate effect, discover an unexpected but plausible fact, choose how to respond, and see the consequences. Then optionally find out how other *actual players* approached it. A new episode should offer a fresh dilemma without needing a new engine.

**The game tests a decision, not the worth of the person making it.** Every option needs a credible motivation. Some decisions can be better from a practical standpoint, but never fabricate a universal ethical verdict or diagnose the player.

## 2. Owner's priorities, in order

1. **Creative development should be enjoyable:** invent scenarios, test interactive storytelling, design attractive moments and learn about decision-making. Do not bury the author in infrastructure.
2. **Player enjoyment:** clarity, meaningful agency, specific consequences, surprise, satisfying pace, occasional levity, and reasons to play another episode.
3. **Social appeal:** understandable in 5 seconds, playable in ~2 minutes, useful as a one-click LinkedIn challenge, shareable without showing spoilers.
4. **Visible authorship:** creator is identifiable on the hub, ending and About page; tasteful credit rather than anonymous SaaS framing.
5. **Benefits:** promote perspective-taking, practical reasoning, awareness of uncertainty and good conversations, without unsupported claims of cognitive improvement.
6. **Operational sustainability:** static by default, deterministic game, modest content pipeline and one small optional statistics backend.

A LinkedIn post does *not* automatically attract interest. We must test five-second comprehension, first-episode completion and organic sharing; write a specific hook instead of assuming distribution.

## 3. Three formats, one content family

- **Quick Dilemma:** setup → one committed decision → meaningful consequence → optional crowd prediction/comparison. Target 30–60 seconds.
- **Ripple Effect:** setup → first decision → an immediate irreversible action → new information → second decision → authored contextual outcome → optional prediction/comparison. **Core launch mechanic**, ~90–150 seconds.
- **Decision Duel:** asynchronous comparison between two people who played the same episode independently. Later phase; a social wrapper around Quick/Ripple, not a third simulation engine.

First three **LOCKED** episodes:
1. **The €200 Problem** — money, fairness, friendship; reservation cost after a friend cancels.
2. **The Unfair Promotion** — merit, loyalty, information; visible output versus less visible team contribution.
3. **The AI Shortcut** — trust, technology, responsibility; speed, validation and disclosure under a deadline.

Do not replace the promotion with the apartment episode. “The Perfect Apartment” may be episode 004 later.

## 4. Distinction from ANAMNESIS and LIMERENCE

The existing games have multi-act, atmospheric roguelike journeys with doors, guides, hearts/lucidity or trust, codices and enduring personal themes. THE VERDICT is warm, friendly, practical, curious, sometimes humorous and mobile-first. It is NOT a third philosophical act, not a One Door clone, not a courtroom, and not a clone of the existing ContentPack contract.

It is still part of The Vestibule: a consistent creator signature, thoughtful writing, rich micro-interactions and a tasteful link back to the collection. Preserve the old games exactly unless a narrowly justified shared fix is independently tested.

## 5. Experience principles / editorial rules

1. **No lecture:** establish a human predicament quickly; save explanation for a voluntary “Behind the decision” section.
2. **No false agency:** the first choice alters a real commitment, communication or expense. Never reset it behind the scenes.
3. **No fake surprise:** the reveal must be believable and relevant, not an arbitrary penalty.
4. **No cartoon villains:** three options should be genuinely defensible; include incentives, limitations and trade-offs.
5. **No punishment theatre:** not every outcome is grim. A good strategy may work well; an awkward choice may be recoverable.
6. **No moral grade:** never assign “good person”, “evil”, personality traits, or a fixed ideology label.
7. **No forced hurry:** urgency can exist *in fiction*; a player may pause, read and reconsider without a real countdown.
8. **No false data:** never show fabricated vote percentages, population claims or simulated consensus as real.
9. **No hidden data collection:** local choices stay local unless the player knowingly contributes a response.
10. **No unnecessary accounts, text walls or waiting:** playable on mobile and without prior knowledge of the collection.

## 6. Product success metrics (goals, not claims)

- Qualitative: after a cold start, player can explain the premise; first choice feels meaningful; reveal feels plausible; player is curious about the outcome; mobile UI feels welcoming.
- Quantitative, once privacy-respecting aggregate measurement exists: episode start-to-finish rate, voluntary next-episode rate, direct link shares, return visits (if measurable with informed consent). Do **not** implement invasive tracking to obtain metrics.
- Creator quality: a complete new episode should be addable by editing structured scenario data and its illustration, not by changing core game state logic.
- Release bar: three polished episodes, direct deep links, two game formats, honest real-results experience when service is available, no regression to existing titles.

## 7. Scope boundaries

Launch does NOT need runtime generative AI, accounts, user comments, live matchmaking, leaderboards, achievement farming, subscriptions, 3D corridors, automatic legal/financial advice, an episode CMS or “AI personality diagnosis.”

Treat this document as a design brief, not authorization for uncontrolled refactoring. The engineering roadmap lists the release gates.
