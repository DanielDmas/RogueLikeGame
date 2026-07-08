import type { RoomRegistry } from './storyEngine';

/** `?uat=1` (any value, or bare `?uat`) puts the game into fast, deterministic
 * test mode — see docs/development/09-testing-and-release.md §4. */
export function parseUatFlag(search: string): boolean {
  return new URLSearchParams(search).has('uat');
}

/** Scene tweens, fades, and toasts all run at this fraction of their normal
 * duration under UAT mode, so scripted playthroughs don't wait on pacing
 * that exists purely for a human's benefit. */
export function speedMultiplierFor(uat: boolean): number {
  return uat ? 0.25 : 1;
}

export function isJumpableRoom(roomId: string, registry: RoomRegistry): boolean {
  try {
    registry.get(roomId);
    return true;
  } catch {
    return false;
  }
}

export interface UatDoorRect {
  id: string;
  rect: { left: number; top: number; right: number; bottom: number; width: number; height: number };
  onScreen: boolean;
}

export interface UatStateSnapshot {
  act: number;
  hearts: number;
  lucidity: number;
  currentRoom: string | null;
  currentStage: number;
}

export interface UatHandle {
  version: string;
  doorRects(): UatDoorRect[];
  state(): UatStateSnapshot;
  fps(): number;
  jump(roomId: string): void;
}

/** Assigns the debug handle onto `target` (in practice `window`) iff `uat` is
 * true — the object must never exist for a normal player. Takes a plain
 * target object (rather than reaching for `window` itself) so the guarantee
 * is testable without a DOM. Installs under the engine-generic `__gameUat`
 * name and the original `__anamnesisUat` name (back-compat: existing UAT
 * scripts and docs reference it) — both point at the same handle. */
export function installUatHandle(
  target: { __gameUat?: UatHandle; __anamnesisUat?: UatHandle },
  uat: boolean,
  handle: UatHandle,
): void {
  if (!uat) return;
  target.__gameUat = handle;
  target.__anamnesisUat = handle;
}
