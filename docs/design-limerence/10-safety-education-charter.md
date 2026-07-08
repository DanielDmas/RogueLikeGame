# Spec 10 — Safety & Education Charter (binding; overrides permissive readings elsewhere)

LIMERENCE inherits ANAMNESIS's Experience Charter
(`docs/development/10-experience-charter.md`) whole — quiet UI, no grades,
no dark patterns, endings as trades — and adds the following, which
override any more permissive reading of any room brief.

## 1. The register split (hard lines)

**Act I (characters aged 15–18): strictly non-explicit.**
- No sexual content, depicted, described, or implied beyond
  age-appropriate fact (a kiss may occur as an event; nothing further).
- `the-forward` (non-consensual imagery) never depicts, describes, or
  characterizes the image; the room is entirely about the ethics and
  consequences of the *sharing*. The diorama's phone faces away. This is
  non-negotiable and CI-guarded (`registerRules.test.ts`, spec 09).
- Emotional dynamics, digital dynamics, aftermath: full permitted depth.
  The Ground Floor should *hurt*; it must never titillate.

**Acts II–IV (adults 18+): frank and mature, never graphic.**
- Attraction, desire, sex, and its consequences are named directly, in
  adult language; profanity permitted sparingly where real speech demands
  it.
- **Scenes cut at the threshold** — the door click, the hand on the
  keycard, the morning after. No graphic or pornographic prose, ever, in
  any language, in any translation. (Prestige-TV-drama register; the
  Chattam dread lives in implication, which is also simply better craft.)
- Aftermath and embodiment (the shower, the flight home, the flooding
  pulse) are where the writing spends its rawness.

**Target rating posture:** ~PEGI 16 equivalent. The store/Pages page and
About panel carry a themes list: infidelity, jealousy, coercive control,
non-consensual image sharing (non-depicted), relationship breakdown,
consensual non-monogamy.

## 2. The advisory layer

- **Onboarding advisory** (first launch, once, dismissible; re-viewable
  from About): the themes list; "characters in Act I are minors and their
  storylines contain no sexual content"; "this is fiction, not therapy or
  advice."
- **About panel additions:**
  - The purpose statement: *"LIMERENCE exists so you can walk into these
    rooms before life builds them around you. Nothing here grades you.
    The research in the field notes is real; the people are not."*
  - The help line: *"If one of these rooms is your life right now, a game
    is not the tool. Talk to someone real — a friend who tells you the
    truth, a counselor, a doctor."* (Deliberately jurisdiction-generic;
    no hotline numbers to go stale — a static line, not a directory.)
  - No-telemetry restated verbatim from ANAMNESIS.

## 3. Education without moralizing (the pedagogy)

1. **The room is the argument.** Beats never lecture; the "?" button and
   the field note carry the science; the Ledger observes patterns; the
   endings price trades. Four separate channels, none of them a sermon.
2. **Temptation written honestly** — a trap the player can see over
   teaches nothing. Rationalizations are rendered at full persuasive
   strength *and then priced accurately*. The game's integrity is that
   both halves are true.
3. **Perspective rotation is the mechanism** (creative bible §4): the
   player is the transgressor at least twice per act; `the-other-side`
   makes the skill literal. This is the evidence-backed core — the game's
   one real claim to "education" — and every act must serve it.
4. **No punishment theater.** Trust loss is sign-posted and diegetic;
   DOOMED rooms announce themselves; failure states are endings with
   dignity (`the-ghost` is written, not game-over'd).
5. **The player is never diagnosed.** Epiphanies describe in-fiction
   behavior ("you have never once asked before accusing"), not the
   person at the keyboard. Field notes describe research populations.
6. **Real names of real researchers, honestly cited** (spec 07). The
   credibility of the educational claim rests entirely on this.

## 4. Sensitive-topic handling notes (per theme)

- **Coercive control** (`the-password`): the room rewards compliance
  short-term *because that is how it works*; the field note names the
  pattern plainly. The game must never make surveillance feel like the
  wise choice at the meta level — the pricing across later rooms does
  that work.
- **Non-consensual imagery** (`the-forward`): see §1; additionally the
  field note is the one place blunt legal language is required.
- **Infidelity discovery** (`the-discovery`): flooding is rendered
  mechanically but briefly; the room exits to de-escalation knowledge,
  not to voyeurism of pain.
- **CNM**: neither advocacy nor cautionary tale — the research posture
  (spec 07 rule 5). Failure rooms (`the-unicorn`, `the-veto`) are about
  *specific practices*, never about the orientation.
- **Minors' storylines**: no adult–minor romantic or sexualized content
  exists anywhere in the game, including implication, including villains.
  Act I's cast are peers.
- **Self-harm adjacency**: `the-ghost` and `stop-carrying-it` are written
  as dissolution/withdrawal in the established ANAMNESIS register — a
  tide, accompanied, never method-shaped, never romanticized as escape;
  the About help line exists for the player these rooms sit close to.

## 5. Enforcement

- The Act I lexicon test (spec 09) runs in CI from L2 onward.
- Every content milestone's DoD includes a human charter pass over new
  rooms (this checklist, initialed in the UPGRADE_PLAN entry).
- Translations (L6+) are held to the same register lines per language —
  the charter is part of the translation brief, and CLAUDE.md's
  context-first rule includes *register* context.
