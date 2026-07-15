import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Regression guard for the live diorama-visibility fix (2026-07-15):
 * `SceneDirector.setDiorama` adds one shared front-fill `PointLight`
 * unconditionally whenever a room has a bespoke diorama, independent of
 * that diorama's own authored lighting — so every diorama in both packs'
 * registries (34+ rooms, `dioramas.test.ts`/`limerenceDioramas.test.ts`
 * cover the registries themselves) benefits without per-room tuning.
 *
 * `SceneDirector` needs a real WebGL context to instantiate (no jsdom in
 * this project's vitest config — see `vite.config.ts`), so this can't be a
 * live unit test of the render output. Instead it locks the *structural*
 * guarantee at the source level: the fill-light-add call sits in
 * `setDiorama`'s unconditional success path, not gated behind any
 * per-room/per-pack branch that could silently exempt some rooms.
 */

const src = readFileSync(resolve(__dirname, '../scene/director.ts'), 'utf-8');

describe('diorama fill light — added unconditionally for every diorama, not per-room', () => {
  it('setDiorama adds a fill light in the same unconditional block as the diorama group itself', () => {
    const match = src.match(/setDiorama\([^)]*\)\s*\{([\s\S]*?)\n  \}/);
    expect(match, 'setDiorama method should exist').toBeTruthy();
    const body = match![1];
    // Both `scene.add(d.group)` (the diorama itself) and the fill light's
    // `scene.add(...)` must appear after the same early-return guards
    // (`if (!roomId) return;` / `if (!d) return;`) with no further
    // conditional between them — i.e. no room/pack can get the diorama
    // without also getting the fill light.
    const groupAddIdx = body.indexOf('this.scene.add(d.group)');
    const lightAddIdx = body.indexOf('this.scene.add(this.dioramaFillLight)');
    expect(groupAddIdx, 'diorama group should be added to the scene').toBeGreaterThan(-1);
    expect(lightAddIdx, 'diorama fill light should be added to the scene').toBeGreaterThan(-1);
    const between = body.slice(groupAddIdx, lightAddIdx);
    expect(between, 'no conditional/early-return should sit between adding the diorama and its fill light').not.toMatch(
      /\bif\s*\(|\breturn\b/,
    );
  });

  it('clearDiorama disposes the fill light alongside the diorama (no leak across room changes)', () => {
    const match = src.match(/clearDiorama\(\)\s*\{([\s\S]*?)\n  \}/);
    expect(match, 'clearDiorama method should exist').toBeTruthy();
    expect(match![1]).toContain('this.dioramaFillLight');
  });
});
