import { describe, expect, it } from 'vitest';
import { oneDoorPool, pickOneDoorRoom } from '../engine/oneDoor';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';
import type { ContentPack } from '../packs/types';

describe.each([
  { name: 'anamnesis', pack: anamnesisPack as ContentPack },
  { name: 'limerence', pack: limerencePack as ContentPack },
])('oneDoorPool — $name', ({ pack }) => {
  const pool = oneDoorPool(pack);

  it('is non-empty and reasonably sized (a real choice of rooms, not a token one)', () => {
    expect(pool.length).toBeGreaterThanOrEqual(15);
  });

  it('excludes every gate room', () => {
    for (const room of pool) expect(room.gate, room.id).toBeFalsy();
  });

  it('excludes every secret room', () => {
    for (const room of pool) expect(room.secret, room.id).toBeFalsy();
  });

  it('excludes the prologue', () => {
    expect(pool.map((r) => r.id)).not.toContain(pack.graph.prologue);
  });

  it('excludes every Understory room', () => {
    for (const id of pack.graph.understorySequence) expect(pool.map((r) => r.id)).not.toContain(id);
  });

  it("excludes the pack's two hook rooms (finalGateId, lastMessageId)", () => {
    expect(pool.map((r) => r.id)).not.toContain(pack.hooks.finalGateId);
    expect(pool.map((r) => r.id)).not.toContain(pack.hooks.lastMessageId);
  });

  it('every pooled room id is a real room in the pack (no duplicates, no ghosts)', () => {
    const allIds = new Set(pack.rooms.map((r) => r.id));
    const poolIds = pool.map((r) => r.id);
    expect(new Set(poolIds).size).toBe(poolIds.length);
    for (const id of poolIds) expect(allIds.has(id)).toBe(true);
  });
});

describe('pickOneDoorRoom', () => {
  const pack = anamnesisPack as ContentPack;
  const pool = oneDoorPool(pack);

  it('throws on an empty pool rather than silently returning undefined', () => {
    expect(() => pickOneDoorRoom([], [])).toThrow();
  });

  it('with nothing unlocked, always returns a room from the pool', () => {
    for (let seed = 0; seed < 20; seed++) {
      const room = pickOneDoorRoom(pool, [], () => seed / 20);
      expect(pool).toContain(room);
    }
  });

  it('is biased toward rooms not yet in codexUnlocked', () => {
    const unlocked = pool.slice(1).map((r) => r.id); // every room unlocked except the first
    const picked = pickOneDoorRoom(pool, unlocked, () => 0);
    expect(picked.id).toBe(pool[0].id);
  });

  it('falls back to the full pool once every eligible room is already unlocked', () => {
    const allUnlocked = pool.map((r) => r.id);
    const picked = pickOneDoorRoom(pool, allUnlocked, () => 0.5);
    expect(pool).toContain(picked);
  });

  it('rand=0 and rand just under 1 both resolve to valid in-range picks (no off-by-one)', () => {
    const first = pickOneDoorRoom(pool, [], () => 0);
    const last = pickOneDoorRoom(pool, [], () => 0.999999);
    expect(pool).toContain(first);
    expect(pool).toContain(last);
  });

  it('is deterministic for a fixed rand function (same seed -> same room)', () => {
    const a = pickOneDoorRoom(pool, [], () => 0.42);
    const b = pickOneDoorRoom(pool, [], () => 0.42);
    expect(a.id).toBe(b.id);
  });
});
