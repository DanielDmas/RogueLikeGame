import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { newRun } from '../engine/gameState';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';
import type { ContentPack } from '../packs/types';
import { isResumableRun, makeRegistry } from '../engine/storyEngine';

const packs: { name: string; pack: ContentPack }[] = [
  { name: 'anamnesis', pack: anamnesisPack },
  { name: 'limerence', pack: limerencePack },
];

describe.each(packs)('isResumableRun — $name (Fable review M1: cross-pack import / room-id rename must not crash Continue)', ({ pack }) => {
  const registry = makeRegistry(pack.rooms);
  const otherPackRoomId = pack === anamnesisPack ? limerencePack.rooms[0].id : anamnesisPack.rooms[0].id;

  it('a fresh run (currentRoom null, nothing visited) is always resumable', () => {
    expect(isResumableRun(newRun(), registry)).toBe(true);
  });

  it('a run mid-room in a real room of this pack is resumable', () => {
    const run = { ...newRun(), currentRoom: pack.rooms[0].id };
    expect(isResumableRun(run, registry)).toBe(true);
  });

  it('a run with real visited rooms of this pack is resumable', () => {
    const run = { ...newRun(), visited: [pack.rooms[0].id, pack.rooms[1].id] };
    expect(isResumableRun(run, registry)).toBe(true);
  });

  it('a run whose currentRoom belongs to the OTHER pack is not resumable (the cross-pack-import case)', () => {
    const run = { ...newRun(), currentRoom: otherPackRoomId };
    expect(isResumableRun(run, registry)).toBe(false);
  });

  it('a run with an unrecognized id anywhere in visited is not resumable, even if currentRoom is fine', () => {
    const run = { ...newRun(), currentRoom: pack.rooms[0].id, visited: [pack.rooms[1].id, otherPackRoomId] };
    expect(isResumableRun(run, registry)).toBe(false);
  });

  it('a run with a made-up room id (the future-rename case) is not resumable', () => {
    const run = { ...newRun(), currentRoom: 'a-room-that-was-since-renamed-or-deleted' };
    expect(isResumableRun(run, registry)).toBe(false);
  });
});

describe("flow.ts's 'continue' branch guards on isResumableRun (Fable review M1)", () => {
  it('the continue action checks isResumableRun before accepting the saved run', () => {
    const src = readFileSync(new URL('../engine/flow.ts', import.meta.url), 'utf8');
    const idx = src.indexOf("action === 'continue' && this.profile.run && isResumableRun(");
    expect(idx, "flow.ts's start() must not accept profile.run on Continue without first checking isResumableRun — see storyEngine.ts's doc comment on the crash this guards against").toBeGreaterThan(-1);
  });
});

describe('localSave.ts backup-write-order (Fable review M1)', () => {
  it('hydrateProfile is called before the backup key is written, in load()', () => {
    const src = readFileSync(new URL('../engine/localSave.ts', import.meta.url), 'utf8');
    const startIdx = src.indexOf('async load(');
    const endIdx = src.indexOf('\n  }', startIdx);
    const body = src.slice(startIdx, endIdx);
    const hydrateIdx = body.indexOf('hydrateProfile(parsed)');
    const backupWriteIdx = body.indexOf('localStorage.setItem(backupKey, raw)');
    expect(hydrateIdx, 'hydrateProfile(parsed) call not found in load()').toBeGreaterThan(-1);
    expect(backupWriteIdx, 'backup-key write not found in load()').toBeGreaterThan(-1);
    expect(hydrateIdx, 'hydrateProfile(parsed) must run before the backup key is overwritten, so a payload that hydrates cleanly is the only kind that ever becomes the new restore point').toBeLessThan(backupWriteIdx);
  });
});
