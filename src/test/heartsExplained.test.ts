import { describe, expect, it } from 'vitest';
import { actIntroText } from '../content/usher';

/** UAT (Phase J) found that a first-time player never sees the optional
 * "Before You Begin" panel unless they open it themselves — so the mandatory
 * carrier for "explain heart-loss before each act" (the user's explicit ask,
 * Phase G2) is the act-intro line that Game.syncTheme plays automatically on
 * every act transition (flow.ts, gated on `act > 0`). Lock that content in. */
describe('heart mechanics are explained before every act that can cost one (Phase G2)', () => {
  it('acts I-IV each caution about hearts in their intro text', () => {
    for (const act of [1, 2, 3, 4]) {
      const intro = actIntroText(act);
      expect(intro, `act ${act} has no intro text`).toBeDefined();
      expect(intro!.toLowerCase(), `act ${act} intro doesn't mention hearts`).toMatch(/heart/);
    }
  });

  it('the prologue (act 0) has no intro line — syncTheme only plays it for act > 0', () => {
    expect(actIntroText(0)).toBeUndefined();
  });
});
