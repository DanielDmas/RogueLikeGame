# UAT batch run — 2026-07-15T07-51-14-590Z

30/31 passed, total wall-clock 1089.5s.

| Script | Result | Duration |
|---|---|---|
| `01-title-onboarding.mjs` | ✅ PASS | 10.0s |
| `02-save-reload-continue.mjs` | ✅ PASS | 9.5s |
| `03-examined-path.mjs` | ✅ PASS | 113.8s |
| `04-keepsakes-shelf.mjs` | ✅ PASS | 62.4s |
| `05-anamnesis.mjs` | ✅ PASS | 115.4s |
| `06-layout-sweep.mjs` | ✅ PASS | 4.1s |
| `07-scenery-proof.mjs` | ✅ PASS | 6.9s |
| `08-door-visibility.mjs` | ✅ PASS | 20.4s |
| `09-transition-garble.mjs` | ✅ PASS | 26.0s |
| `10-troll.mjs` | ✅ PASS | 23.7s |
| `11-i18n-matrix.mjs` | ❌ FAIL | 13.2s |
| `12-choice-panel-replaces-text.mjs` | ✅ PASS | 74.9s |
| `13-reflection-panel-replaces-text.mjs` | ✅ PASS | 111.3s |
| `14-limerence-visual-sweep.mjs` | ✅ PASS | 11.1s |
| `15-settings-sweep-anamnesis.mjs` | ✅ PASS | 10.4s |
| `16-settings-sweep-limerence.mjs` | ✅ PASS | 6.9s |
| `17-anamnesis-act-sweep.mjs` | ✅ PASS | 10.1s |
| `18-limerence-act-sweep.mjs` | ✅ PASS | 13.2s |
| `19-anamnesis-door-choice-flow.mjs` | ✅ PASS | 103.2s |
| `20-limerence-door-choice-flow.mjs` | ✅ PASS | 87.8s |
| `21-anamnesis-overlays-sweep.mjs` | ✅ PASS | 11.1s |
| `22-limerence-overlays-sweep.mjs` | ✅ PASS | 10.3s |
| `23-anamnesis-ending-flow.mjs` | ✅ PASS | 38.4s |
| `24-limerence-ending-flow.mjs` | ✅ PASS | 40.5s |
| `25-keyboard-only-navigation.mjs` | ✅ PASS | 9.9s |
| `27-one-door-mode-both-packs.mjs` | ✅ PASS | 40.5s |
| `28-vestibule-landing-page.mjs` | ✅ PASS | 1.7s |
| `29-language-switch-live-both-packs.mjs` | ✅ PASS | 14.3s |
| `30-troll-test-limerence.mjs` | ✅ PASS | 23.8s |
| `31-focus-trap-overlay.mjs` | ✅ PASS | 6.0s |
| `32-clicking-user-exploration.mjs` | ✅ PASS | 58.7s |

## Failures

### `11-i18n-matrix.mjs`

```
exit code 1
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

page.waitForSelector: Timeout 10000ms exceeded.
Call log:
[2m  - waiting for locator('.settings-panel') to be visible[22m

    at setLanguageViaSettings (/home/user/RogueLikeGame/tests/uat/11-i18n-matrix.mjs:18:14)
    at async file:///home/user/RogueLikeGame/tests/uat/11-i18n-matrix.mjs:44:3
    at async withPage (/home/user/RogueLikeGame/tests/uat/_helpers.mjs:30:5)
    at async file:///home/user/RogueLikeGame/tests/uat/11-i18n-matrix.mjs:31:1 {
  log: [ "  - waiting for locator('.settings-panel') to be visible" ],
  name: 'TimeoutError'
}

Node.js v22.22.2
```
