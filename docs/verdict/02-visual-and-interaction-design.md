# 02 — Visual identity, audio, motion and accessibility

## 1. North star

THE VERDICT looks like a **beautiful, warm, tactile interactive magazine**. Intelligent and inviting, not a Gothic corridor, court of law, template SaaS dashboard, casino or childish quiz. The collection identity can appear in a small masthead, but the experience has its own palette, illustration language and pace.

A strong visual vertical slice is a Phase 1 **requirement**, not a “polish later” ticket. Design for a phone opened from LinkedIn, then enhance the desktop layout.

## 2. Starting tokens (check actual contrast in browser)

| Role | Hex | Usage |
| --- | --- | --- |
| Paper | #F7F1E7 | Warm page background |
| Cards | #FFFDF8 | Choice surfaces and reading panels |
| Ink | #29312F | High-contrast primary text |
| Muted ink | #5F675F | Secondary text; test AA |
| Terracotta | #D88D64 | Borders, decorative emphasis, illustrations |
| Terracotta text | #884525 | Accessible text accent on light ground |
| Sage | #65968B | Graphic accent, scene objects, calm feedback |
| Deep sage | #305F56 | Accessible control emphasis |
| Warm yellow | #EFD59D | Reveal highlight, non-text only |
| Edge | #DDD5C8 | Delicate outlines and separators |

Use named CSS variables / tokens, not scattered literals. No red-green morality labels; risk is not a moral failure. Ensure normal text contrast >= 4.5:1, meaningful UI graphics >= 3:1 or accessible equivalent.

## 3. Typography and layout

- Reuse existing **Inter** for clean controls and **Spectral** selectively for story headings if it improves warmth; neither requires a new font download.
- Prose should have generous line height; maximum reading width around 52–65 characters.
- Mobile: one column at 320–430px; choices stacked with large touch targets (target >= 44×44px); controls never overlap content.
- Desktop: central story column plus optional unobtrusive illustration panel; no sprawling sidebars or empty dashboard.
- Large text/zoom (up to 200% browser zoom as practical) must not clip content. Allow scrolling; do not inherit existing full-height overflow-hidden shell.
- Sticky controls only when they do not cover text and remain keyboard accessible.
- Small header: THE VERDICT, discreet collection link, optional sound toggle; no mandatory modal.

## 4. Scene grammar and illustration

Use **custom lightweight SVG/CSS vignettes**, not the Three.js corridor engine. One recognisable visual metaphor per scenario:
- Episode 001: cabin reservation/receipt, four small guest tokens, a bill whose allocation responds to choices.
- Episode 002: recommendation worksheet, two colleague cards, invisible contributions disclosed through an updated report.
- Episode 003: deadline timer (in-fiction, not a live player timer), AI-produced deliverable, trust/verification indicators or document revision.

Decorative illustration must serve comprehension and cause-and-effect. The page must work if animations are disabled or if illustrative graphics do not load. Avoid stock visuals and distracting decorative images.

## 5. Interaction language

- Choice card: clear verb-first label, 1–2 lines of explanation if needed; strong hover, focus, pressed and disabled states.
- Commit: card responds immediately (subtle lift/ink shift), followed by a brief consequence on-screen. Never require waiting for a long cinematic transition.
- New information: a warm paper “note arriving” or a message tile sliding in; the factual reveal must be accessible as ordinary text.
- Outcome: layered reveal of (a) what happened, (b) what it cost, (c) what was learned, with an opportunity to see alternatives after a completed run.
- Transitions: approximately 150–300ms for controls, 250–450ms for a meaningful reveal; no forced 2–4 second waits. Skip/instant if reduced motion requested.
- Use an unambiguous narrative progress label rather than loud status banners or confetti.

## 6. Sound / music

Audio optional and **off until explicitly enabled** or user-initiated interaction; browser autoplay restrictions respected. A quiet custom palette can reuse techniques from the repository's Web Audio layer: gentle click, message arrival, turn/page transition, and one soft reveal. Avoid copying ANAMNESIS’s sombre ambient loop or making every hover noisy.

No music files are necessary for MVP. A few concise, procedurally generated sounds can be good; silence must also feel complete. Remember preference separately, and support mute in one tap.

## 7. Language, content and tone

Launch English first to keep quality high; architect for future Czech and other languages. Do not bulk-generate five locales as a gate for the first release. Existing repository translation conventions remain respected for shared text; separate Verdic-specific content must have a straightforward translation path.

Copy is direct, accessible and sometimes witty, without smugness or preaching. Give details people can picture: amounts, deadlines, real constraints. Keep intro under ~120 words, twist under ~80 words and most outcomes under ~180 words unless editorial QA demonstrates a need for more.

## 8. Accessibility requirements

- Real buttons/semantic headings; screen reader labels and meaningful focus order.
- Keyboard: Tab, Enter/Space and optional digit shortcuts where focus-independent shortcuts do not hijack typing.
- Screen-reader announcement of new information without repeatedly re-reading an entire page.
- Respect prefers-reduced-motion, high contrast modes and text scaling.
- Tap targets >= 44px; no colour-only signals; progress/state always available as text.
- Manage focus on phase changes; consider scroll restoration without jarring jumps.
- Do not make a real countdown mandatory. Allow unlimited reading time.
- Mobile Safari/Chrome, desktop Chromium/Firefox/Safari smoke tests where possible.

## 9. Visual sign-off checklist (owner perspective)

1. Would I screenshot this and feel proud to post it?
2. Does the opening screen make me want to tap within five seconds?
3. Are buttons pleasant, easy and consistent on a narrow phone?
4. Does the first choice visibly change something?
5. Does the reveal feel delightful and clear, not an annoying popup?
6. Does the result look authored, not like a generic AI-generated explanation?
7. Is there one elegant invitation to replay or share, rather than marketing clutter?
8. Does the layout still read beautifully with motion/audio off?

Any “no” is a Phase 1 or release blocker. Prioritise these over adding more episodes.
