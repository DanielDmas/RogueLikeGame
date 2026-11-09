# 08 — QA matrix, automated tests, human playtests and release criteria

## 1. Baseline first

Before edits, run and record:
- npm ci
- npm test
- npm run build:web
- existing browser UAT smoke in limited, focused scripts under CLAUDE.md timing rules.

Do not claim tests passed just because they exist. A failed baseline is recorded as such.

## 2. Pure unit tests

**Reducer:** legal transition sequence, invalid actions, unknown option, replay creates new run, first action idempotence, second action only after reveal, phase computed correctly.

**Outcome resolver:** for 001/002/003 all nine first/final paths resolve with non-empty distinct causal content; first action is acknowledged, second action reflected; no hidden reroll. Quick bypasses second choice correctly.

**Schema:** duplicates, missing twist, wrong version, unreachable endings, invalid IDs fail validation with useful error. Valid stories pass.

**Scenario-specific math:** 001 cabin operator receives exactly €800 across paid/advanced/reimbursed states; €100 contribution from Maya doesn't count twice; Chris/Leo cannot be forced to consent to new payments; €66.67 starting proposal described as approximate.

**Save:** corrupt localStorage, wrong version, missing field, refresh mid-reaction and mid-reveal, double click and replay; no duplicate effects or vote.

**Results calculations:** sample counts, ratios, transition totals, ties, 0 votes, 1 vote, 19/20 threshold, rounding, replays excluded. Never compare incompatible content versions.

**Sharing:** generated URLs resolve to right episode, sharing never leaks outcomes/duel player choices prematurely.

## 3. Browser and visual scenarios

Use Playwright if available with hard time limits from CLAUDE.md. Focused scripts:
1. Cold 001 deep link 360x800; play A→A; screenshot each major step.
2. 001 alternate A→C and C→B; verify first commitment stays visible in result.
3. 002 B→C; 003 A→B; verify content and art differ by scenario.
4. Quick mode does not show twist/second choice.
5. Reload after first choice, after twist, and from outcome.
6. Reduced motion, keyboard-only navigation and accessible labels.
7. Offline / vote API failure still allows ending, replay and sharing.
8. Hub / episodes direct refresh and back navigation.
9. Existing titles: launch, one door, continue, at least one full run or representative ending smoke depending feasible.

Test at 320, 360, 390, 768, 1280px. Test browser zoom/text scale, contrast and touch hit areas. Where real Safari is unavailable, record that limitation.

## 4. Human visual signoff

This is not just “screenshot matches design.” Owner should answer:
- Is it genuinely warm, inviting, distinctive and polished?
- Are cards, typography, spacing and illustrations beautiful enough to be proud of?
- Is first tap obvious within 5 seconds?
- Do choices feel consequential, not fake?
- Is twist a surprise *that makes sense*?
- Is this about everyday human decisions rather than preaching morality?
- Can I play while waiting in line, standing, holding phone in one hand?
- Do I want to try the second episode, or send one to a friend?

A “no” on a major point is a product blocker. Design should not be declared done solely on CI success.

## 5. Privacy and resilience

If Phase 3 backend ships:
- Explicit consent before submitting.
- No runtime AI or raw personal story input posted.
- Server validates all IDs, episode/version, idempotency, rate limits.
- Zero sample never masquerades as consensus; every statistic includes n.
- API outage does not block finishing/continuing.
- Logs/retention explained accurately; no promise of impossible person-level uniqueness.

No backend secret may be bundled into dist-web; audit tracked .env/.env.limerence separately and privately.

## 6. Build/release

- npm test and npm run build:web remain green.
- dist-web/anamnesis/index.html and dist-web/limerence/index.html still exist and work.
- dist-web/verdict/index.html and each direct-episode URL render via hard refresh.
- GitHub Pages base path relative URLs resolve; no SPA fallback assumptions.
- Open Graph previews show correct scenario title and spoiler-free description.
- Windows/Electron wrapper continues to open landing and original games. Verdict may remain browser-only initially if documented; check it doesn't break packaging.
- CSS and imports do not leak from Verdict into old packs or vice versa.
- Source maps, licensing and dependency audit reviewed.
- New public game carries visible author identity and collection linkage.

## 7. GO / NO-GO

**GO** if one playthrough looks professional, all three episodes are causally coherent and inviting, direct sharing works, votes are honest if present, privacy is clear, mobile/keyboard/reduced-motion work, old titles regressions are absent.

**NO-GO** if the first action can be erased without new play, statistics are fabricated, consent is implicit, any direct-link request 404s, majority is claimed from negligible votes, product feels moralistic or uninviting, or old games are broken.

## 8. Reporting template

    Phase / commit:
    Files changed:
    Behavioral summary:
    Test commands and actual results:
    Manual screenshots / devices checked:
    Deviation from plan and why:
    Remaining risks:
    Owner decisions needed (if any):
    Next bounded ticket:
