# 06 — Human results, honest statistics, privacy and future Duel

## 1. Distinguish facts from hypotheses

The game collects **self-selected voluntary responses**, not a representative survey. Public results must clearly say “Among people who played and opted in.” Never make claims about what “most people” in a country, industry or population believe. No fake percentage bars, seeded real-looking respondents or fabricated quotes.

Comparison is a **bonus after gameplay**, not the condition for finishing a scenario. Anonymous voting is **OFF** until a player explicitly opts in. Existing titles’ no-telemetry promise remains intact.

## 2. Data contract (draft)

Scenario identity: {episodeId, contentVersion, format}  
Anonymous vote: {firstChoiceId, finalChoiceId (same as first for Quick), createdAt server-side}  
Aggregates returned: {sampleSize, byFirstChoice, byFinalChoice, transitions first->final, updatedAt}.

If useful, a short-lived random idempotency token may help prevent accidental retries; keep it unrelated to identity. Do not collect email, full name, free-form rationale or LinkedIn profile. Avoid analytics scripts in MVP. Standard hosting logs may exist; disclose the provider's handling if a backend is added.

## 3. Backend and consent

Phase 1-2 no backend, play entirely offline-capable after assets load. For Phase 3, choose a small serverless endpoint and one relational table or aggregate counter schema. Supabase, Cloudflare Workers/D1 or a similarly simple hosted stack are examples, not decisions locked before cost/security assessment. GitHub Pages remains the static frontend host.

**Submission flow:**
1. Player finishes the episode.
2. Show optional question: “Share your anonymous decisions to improve the comparison?” with **Contribute** and **Not now** of equal prominence.
3. On Contribute, send the two choice IDs and episode/version; do not include personal explanation.
4. Validate server-side known episode/version/IDs, rate-limit, prevent casual duplicates as practical.
5. On success, show receipt locally. On failure, show a neutral retry or skip.
6. Aggregate results must be readable without requiring contribution where public privacy policy allows; if not, provide a clearly separated “results unavailable” state without blocking play.

Do not sneak in consent through initial gameplay, a preselected checkbox or clicking Share. Withdrawal of an individual vote may be technically impossible if fully anonymous; disclose this limitation honestly.

## 4. Basic API design

    GET /api/verdict/results?episode=cabin-200&version=1
      -> {sampleSize, first:[...], final:[...], changes:[[...]], updatedAt}
      -> caching and availability headers

    POST /api/verdict/votes
      body {episodeId, contentVersion, firstChoiceId, finalChoiceId, idempotencyToken?}
      -> {accepted:boolean, reason?: "duplicate"|"invalid"|"rate-limited"}

Server must never trust a client assertion that a choice is valid. The accepted choice set comes from a server-side manifest of published versions. Retire versions explicitly; do not aggregate different versions as if equivalent. Ensure cross-origin restrictions and abusive automated submissions are mitigated reasonably.

No production API until privacy notice, retention rules, CORS, abuse protections, service-cost checks, and test coverage are approved.

## 5. Statistics presentation

- Always display **n** and label self-selection.
- If sampleSize < 20, show raw counts or “Too few votes to draw a reliable comparison,” and avoid grand percentage claims. Even at n >= 20 still never imply representativeness.
- Percentages must total approximately 100% (round with honest rounding, or display counts).
- "Changed approach" = firstChoiceId != finalChoiceId for comparably coded Ripple scenarios only.
- "Predict the crowd" is optional and cannot grade personal morality. If tie/too few votes, say the majority was not decisive.
- Distinguish “replayed locally” from “new participant vote”; one person can explore all nine endings without being counted nine times.
- No A/B experiment or targeted persuasion is needed in v1.

## 6. What anonymous means / abuse realities

Anonymous without login cannot guarantee one unique human per vote. Browser-side tokens, server-side rate limiting and optional network heuristics mitigate abuse; they do not establish population representativeness. Avoid persistent fingerprinting. Define a short retention policy for any anti-abuse metadata if used.

Do not store IP addresses in the votes table; if infrastructure logs IPs, disclose this explicitly rather than promising impossibly absolute anonymity.

## 7. Offline/failure behavior

A failed API request does NOT block the scenario or outcome. Results render as temporarily unavailable with Retry; no fake results. Queueing votes for silent later submission is prohibited without the player's explicit awareness. Check timeouts and loading states; never leave users waiting indefinitely for “comparison.”

## 8. Decision Duel (later phase)

Use an asynchronous link containing scenario ID/version plus the challenger’s **non-sensitive decision IDs**, optionally signed if manipulation matters. Recipient plays without seeing the challenger's choices. After completion, show aligned comparison and one optional discussion prompt. No account, chat, matchmaking, contact import or third-party social scraping.

If client-encoded payload reveals choices to a technical user inspecting the URL, treat that as acceptable for a casual game only after documenting it; otherwise use a short server-stored invite token. Keep private links unindexed and avoid embedding names/contact details.
