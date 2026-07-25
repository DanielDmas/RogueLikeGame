import { describe, expect, it } from 'vitest';
import { allRooms } from '../content/rooms';
import { makeRegistry } from '../engine/storyEngine';
import {
  installUatHandle,
  isJumpableRoom,
  parseUatFlag,
  speedMultiplierFor,
  type UatHandle,
} from '../engine/uatMode';

const registry = makeRegistry(allRooms);

const stubHandle: UatHandle = {
  version: '0.0.0-test',
  doorRects: () => [],
  state: () => ({ act: 0, hearts: 3, lucidity: 0, currentRoom: null, currentStage: 0 }),
  fps: () => 0,
  jump: () => {},
  snapCameraForScreenshot: () => {},
};

describe('parseUatFlag — ?uat=1 boot detection (Phase S1)', () => {
  it('is true for ?uat=1', () => {
    expect(parseUatFlag('?uat=1')).toBe(true);
  });

  it('is true for a bare ?uat with no value', () => {
    expect(parseUatFlag('?uat')).toBe(true);
  });

  it('is true when uat is present alongside other params, in any position', () => {
    expect(parseUatFlag('?lang=cs&uat=1')).toBe(true);
    expect(parseUatFlag('?uat=1&lang=cs')).toBe(true);
  });

  it('is false with no query string at all', () => {
    expect(parseUatFlag('')).toBe(false);
  });

  it('is false when uat is simply absent among other params', () => {
    expect(parseUatFlag('?lang=cs&version=v2')).toBe(false);
  });

  it('does not false-positive on a similarly-named param', () => {
    expect(parseUatFlag('?uatx=1')).toBe(false);
  });
});

describe('speedMultiplierFor — tween/fade/toast pacing under UAT (Phase S1)', () => {
  it('is 1 (unchanged) when not in UAT mode', () => {
    expect(speedMultiplierFor(false)).toBe(1);
  });

  it('is 0.25 (4x faster) under UAT mode', () => {
    expect(speedMultiplierFor(true)).toBe(0.25);
  });

  it('scales a typical fade/tween duration down as expected', () => {
    const normal = 720 * speedMultiplierFor(false);
    const uat = 720 * speedMultiplierFor(true);
    expect(normal).toBe(720);
    expect(uat).toBe(180);
    expect(uat).toBeLessThan(normal);
  });
});

describe('isJumpableRoom — UAT jump() target validation (Phase S1)', () => {
  it('accepts any real room id in the registry', () => {
    expect(isJumpableRoom('waiting-room', registry)).toBe(true);
    expect(isJumpableRoom(allRooms[0].id, registry)).toBe(true);
  });

  it('refuses an unknown room id', () => {
    expect(isJumpableRoom('this-room-does-not-exist', registry)).toBe(false);
  });
});

describe('installUatHandle — the debug handle must not exist for a normal player (Phase S1)', () => {
  it('does not install the handle when uat is false', () => {
    const target: { __gameUat?: UatHandle; __anamnesisUat?: UatHandle } = {};
    installUatHandle(target, false, stubHandle);
    expect(target.__gameUat).toBeUndefined();
    expect(target.__anamnesisUat).toBeUndefined();
  });

  it('installs exactly the given handle when uat is true', () => {
    const target: { __gameUat?: UatHandle; __anamnesisUat?: UatHandle } = {};
    installUatHandle(target, true, stubHandle);
    expect(target.__gameUat).toBe(stubHandle);
    expect(target.__anamnesisUat).toBe(stubHandle);
  });

  it('the handle exposes the full documented surface', () => {
    const target: { __gameUat?: UatHandle; __anamnesisUat?: UatHandle } = {};
    installUatHandle(target, true, stubHandle);
    const handle = target.__gameUat!;
    expect(typeof handle.version).toBe('string');
    expect(typeof handle.doorRects).toBe('function');
    expect(typeof handle.state).toBe('function');
    expect(typeof handle.fps).toBe('function');
    expect(typeof handle.jump).toBe('function');
    expect(Array.isArray(handle.doorRects())).toBe(true);
  });
});
