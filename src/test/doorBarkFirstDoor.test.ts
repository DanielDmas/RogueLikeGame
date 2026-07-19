import { describe, expect, it } from 'vitest';
import '../content/text'; // registers v1-en + cs + fa + de + fr packs (side effect)
import { usherDoorBark } from '../content/usher';
import { limerenceDoorBark } from '../packs/limerence/guide';
import { newRun } from '../engine/gameState';

/**
 * Game-experience review (2026-07-19, `15-game-experience-review.md` E2):
 * the prologue's single opening door used to fall through to the generic
 * bark pool ("Choose a door...") because the single-door-gate bark was
 * explicitly gated on `visited.length > 0` — so the game's very first
 * interactive moment contradicted the door-help text next to it ("this is
 * the only way forward"). Both packs' door-bark functions now special-case
 * the true prologue moment (doorCount 1, nothing visited yet) with a
 * dedicated line, distinct from the "already behind you" gate-single-door
 * framing used for every later single-door gate.
 */
describe('the prologue single door gets its own bark, distinct from a later single-door gate', () => {
  it('ANAMNESIS: doorCount 1 with nothing visited yet reads as a beginning, not a gate', () => {
    const fresh = { ...newRun(), visited: [] as string[] };
    const bark = usherDoorBark(fresh, 0, 1, false);
    expect(bark).toContain('begin');
    expect(bark).not.toContain('already behind you');
  });

  it('ANAMNESIS: doorCount 1 after at least one visited room still reads as a gate', () => {
    const midRun = { ...newRun(), visited: ['wallet'] };
    const bark = usherDoorBark(midRun, 0, 1, false);
    expect(bark).toContain('already behind you');
    expect(bark).not.toContain('begin');
  });

  it('LIMERENCE: doorCount 1 with nothing visited yet reads as a beginning, not a gate', () => {
    const fresh = { ...newRun(), visited: [] as string[] };
    const bark = limerenceDoorBark(fresh, 0, 1, false);
    expect(bark).toContain('to start');
    expect(bark).not.toContain('behind you now');
  });

  it('LIMERENCE: doorCount 1 after at least one visited room still reads as a gate', () => {
    const midRun = { ...newRun(), visited: ['the-front-desk'] };
    const bark = limerenceDoorBark(midRun, 0, 1, false);
    expect(bark).toContain('behind you now');
    expect(bark).not.toContain('to start');
  });
});
