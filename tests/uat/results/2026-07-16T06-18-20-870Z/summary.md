# UAT batch run — 2026-07-16T06-18-20-870Z

36/36 completed scripts passed. This run was stopped by an external 1500s
wrapper timeout (not a script failure or hang) after script 37 of the full
43-script suite — each script individually runs well under the standing
3-minute cap, but the full batch run sequentially exceeded the wrapper's
budget. The remaining 7 scripts (`38-code-review-fixes-h2-h4.mjs`,
`39`–`41`, `43`, plus `42`/`44` which need their own servers — see below)
were run immediately after in a follow-up batch
(`2026-07-16T06-43-55-708Z`) and standalone; all passed. Together the two
runs plus the two standalone scripts cover the entire committed suite with
zero failures — see this session's master-plan-doc entry for the full
verification note.

| Script | Result | Duration |
|---|---|---|
| `01-title-onboarding.mjs` | ✅ PASS | 10.2s |
| `02-save-reload-continue.mjs` | ✅ PASS | 10.6s |
| `03-examined-path.mjs` | ✅ PASS | 114.8s |
| `04-keepsakes-shelf.mjs` | ✅ PASS | 62.6s |
| `05-anamnesis.mjs` | ✅ PASS | 115.3s |
| `06-layout-sweep.mjs` | ✅ PASS | 3.9s |
| `07-scenery-proof.mjs` | ✅ PASS | 6.8s |
| `08-door-visibility.mjs` | ✅ PASS | 22.1s |
| `09-transition-garble.mjs` | ✅ PASS | 27.9s |
| `10-troll.mjs` | ✅ PASS | 24.4s |
| `11-i18n-matrix.mjs` | ✅ PASS | 7.8s |
| `12-choice-panel-replaces-text.mjs` | ✅ PASS | 74.4s |
| `13-reflection-panel-replaces-text.mjs` | ✅ PASS | 111.8s |
| `14-limerence-visual-sweep.mjs` | ✅ PASS | 11.6s |
| `15-settings-sweep-anamnesis.mjs` | ✅ PASS | 10.5s |
| `16-settings-sweep-limerence.mjs` | ✅ PASS | 7.1s |
| `17-anamnesis-act-sweep.mjs` | ✅ PASS | 11.1s |
| `18-limerence-act-sweep.mjs` | ✅ PASS | 13.6s |
| `19-anamnesis-door-choice-flow.mjs` | ✅ PASS | 102.1s |
| `20-limerence-door-choice-flow.mjs` | ✅ PASS | 93.5s |
| `21-anamnesis-overlays-sweep.mjs` | ✅ PASS | 11.1s |
| `22-limerence-overlays-sweep.mjs` | ✅ PASS | 11.1s |
| `23-anamnesis-ending-flow.mjs` | ✅ PASS | 41.0s |
| `24-limerence-ending-flow.mjs` | ✅ PASS | 45.5s |
| `25-keyboard-only-navigation.mjs` | ✅ PASS | 9.6s |
| `27-one-door-mode-both-packs.mjs` | ✅ PASS | 64.3s |
| `28-vestibule-landing-page.mjs` | ✅ PASS | 1.8s |
| `29-language-switch-live-both-packs.mjs` | ✅ PASS | 16.4s |
| `30-troll-test-limerence.mjs` | ✅ PASS | 24.1s |
| `31-focus-trap-overlay.mjs` | ✅ PASS | 16.8s |
| `32-clicking-user-exploration.mjs` | ✅ PASS | 61.3s |
| `33-choice-card-visible-after-settle.mjs` | ✅ PASS | 90.0s |
| `34-code-review-fixes-verification.mjs` | ✅ PASS | 15.7s |
| `35-read-more-articles.mjs` | ✅ PASS | 82.8s |
| `36-read-more-articles-codex-and-limerence.mjs` | ✅ PASS | 60.6s |
| `37-choice-aftermath-echoes.mjs` | ✅ PASS | 44.7s |
