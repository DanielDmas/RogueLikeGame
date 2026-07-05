import { describe, expect, it } from 'vitest';
import { allRooms } from '../content/rooms';
import { defaultProfile } from '../engine/saveStore';

/** Mirrors the exact `unseen` computation in Game.runLoop's door-spec builder
 * (flow.ts) — a door is "unseen" iff its room has never been completed in
 * any run, tracked via profile.codexUnlocked (Phase I2). */
function isDoorUnseen(codexUnlocked: string[], roomId: string): boolean {
  return !codexUnlocked.includes(roomId);
}

/** Mirrors Game.enterRoom's `remembered` check (Phase I1) — same predicate,
 * opposite phrasing: a room replays fast once it has been witnessed before. */
function isRoomRemembered(codexUnlocked: string[], roomId: string): boolean {
  return codexUnlocked.includes(roomId);
}

describe('unseen-door markers (Phase I2) — a fresh profile has never walked any door', () => {
  it('every room is unseen for a brand-new profile', () => {
    const profile = defaultProfile();
    for (const room of allRooms) {
      expect(isDoorUnseen(profile.codexUnlocked, room.id), `${room.id} should be unseen`).toBe(true);
    }
  });

  it('a room added to codexUnlocked stops being unseen, others are unaffected', () => {
    const profile = defaultProfile();
    const [first, second] = allRooms;
    profile.codexUnlocked.push(first.id);
    expect(isDoorUnseen(profile.codexUnlocked, first.id)).toBe(false);
    expect(isDoorUnseen(profile.codexUnlocked, second.id)).toBe(true);
  });
});

describe('replay fast-forward (Phase I1) — rooms already witnessed play back quickly', () => {
  it('a never-visited room is not "remembered" (typewriter stays on)', () => {
    const profile = defaultProfile();
    expect(isRoomRemembered(profile.codexUnlocked, allRooms[0].id)).toBe(false);
  });

  it('a room from a previous run is "remembered" (typewriter skipped)', () => {
    const profile = defaultProfile();
    profile.codexUnlocked.push(allRooms[0].id);
    expect(isRoomRemembered(profile.codexUnlocked, allRooms[0].id)).toBe(true);
  });

  it('unseen and remembered are exact complements for the same room/profile', () => {
    const profile = defaultProfile();
    profile.codexUnlocked.push(allRooms[0].id);
    for (const room of allRooms) {
      expect(isDoorUnseen(profile.codexUnlocked, room.id)).toBe(!isRoomRemembered(profile.codexUnlocked, room.id));
    }
  });
});
