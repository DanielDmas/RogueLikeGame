import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Regression guard for a real bug found live (2026-07-07): `TextPanel`,
 * `ChoicePanel`, and `ReflectionPanel` are three separate class instances
 * that all mount their element into the same `.stage-bottom` container
 * (`flex-direction: column`), and each only ever tracks and removes *its
 * own* previously-mounted element. If `Game` (engine/flow.ts) calls
 * `choices.pick(...)` or `reflection.show(...)` right after a
 * `text.playBeats(...)` resolves, without an intervening `text.hide()`,
 * the stale text panel (still showing the last beat and a "continue" hint)
 * stays mounted, and the newly-prepended choice/reflection panel lands
 * stacked next to — or, since both call `prepend()`, visually *above* —
 * it. The result: door/choice text and reflection commentary rendered in
 * the wrong position on screen, exactly what a player would describe as
 * "text/descriptions are not in the right positions."
 *
 * This can't be caught by a real render (vitest runs with no DOM here —
 * see `vite.config.ts`'s `environment: 'node'`), so it's enforced as a
 * source-level invariant instead: every call that mounts a new interactive
 * `.stage-bottom` panel must be immediately preceded (scanning backward,
 * ignoring nothing else `TextPanel`-related) by a `text.hide()` — or, for
 * the door picker specifically, the intentional `text.showBark()` design
 * (a one-line Usher bark that deliberately stays visible above the door
 * row) — never a dangling, unresolved `playBeats()`.
 *
 * The genuine, browser-rendered version of this check lives in
 * `tests/uat/12-panel-stacking.mjs`, which caught the actual bug live.
 */

const flowSrc = readFileSync(resolve(__dirname, '../engine/flow.ts'), 'utf-8');

type LifecycleState = 'hide' | 'showBark' | 'playBeats' | 'none';

/** Scans backward from `marker`'s first occurrence in `flow.ts` for the
 * nearest of TextPanel's three lifecycle calls — whichever one is closest
 * (by source position) tells us what state the text panel was left in
 * right before `marker` runs. */
function nearestPrecedingTextPanelCall(marker: string): LifecycleState {
  const idx = flowSrc.indexOf(marker);
  if (idx === -1) throw new Error(`marker not found in engine/flow.ts: ${marker}`);
  const before = flowSrc.slice(0, idx);
  const hideIdx = before.lastIndexOf('this.text.hide()');
  const barkIdx = before.lastIndexOf('this.text.showBark(');
  const beatsIdx = before.lastIndexOf('this.text.playBeats(');
  const best = Math.max(hideIdx, barkIdx, beatsIdx);
  if (best === -1) return 'none';
  if (best === hideIdx) return 'hide';
  if (best === barkIdx) return 'showBark';
  return 'playBeats';
}

describe('engine/flow.ts — stage-bottom panel lifecycle (TextPanel must be hidden/replaced before the next panel mounts)', () => {
  it('sanity: flow.ts actually contains all three panel calls this test inspects', () => {
    expect(flowSrc).toContain('this.choices.pick(');
    expect(flowSrc).toContain('this.choices.pickDoor(');
    expect(flowSrc).toContain('this.reflection.show(');
  });

  it('choices.pick(...) (the in-room choice cards) is preceded by text.hide(), never a dangling playBeats()', () => {
    expect(nearestPrecedingTextPanelCall('this.choices.pick(')).toBe('hide');
  });

  it('reflection.show(...) (the Examined Path commentary card) is preceded by text.hide(), never a dangling playBeats()', () => {
    expect(nearestPrecedingTextPanelCall('this.reflection.show(')).toBe('hide');
  });

  it('choices.pickDoor(...) (the door row) is preceded by text.hide() or the intentional text.showBark() — never a dangling playBeats()', () => {
    const state = nearestPrecedingTextPanelCall('this.choices.pickDoor(');
    expect(['hide', 'showBark']).toContain(state);
  });

  it('every this.text.playBeats(...) call site in flow.ts is followed, somewhere before the next choices/reflection mount, by a hide() — global count sanity', () => {
    // Loose sanity check, not exhaustive: catches the file losing its hide()
    // calls wholesale (e.g. an accidental revert) even for call sites this
    // test doesn't name individually.
    const playBeatsCount = (flowSrc.match(/this\.text\.playBeats\(/g) ?? []).length;
    const hideCount = (flowSrc.match(/this\.text\.hide\(\)/g) ?? []).length;
    expect(playBeatsCount).toBeGreaterThanOrEqual(5);
    expect(hideCount).toBeGreaterThanOrEqual(playBeatsCount - 1);
  });
});
