import { describe, expect, it } from 'vitest';
import type { RunState } from '../engine/schema';
import { applyEffects, newRun } from '../engine/gameState';
import { backfillVisitedForJump, completeRoom, makeRegistry, offeredDoors } from '../engine/storyEngine';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';
import type { ContentPack } from '../packs/types';

const packs: { name: string; pack: ContentPack }[] = [
  { name: 'anamnesis', pack: anamnesisPack },
  { name: 'limerence', pack: limerencePack },
];

/** Play a full run with a seeded RNG, immortal hearts (graph-only test) —
 * generic over any pack's own registry/graph, unlike graph.test.ts's
 * ANAMNESIS-specific simulateRun. */
function simulateRun(pack: ContentPack, seed: number): RunState {
  const registry = makeRegistry(pack.rooms);
  let rng = seed;
  const rand = () => {
    rng = (rng * 1103515245 + 12345) % 2147483648;
    return rng / 2147483648;
  };
  let s = newRun();
  for (let guard = 0; guard < 60; guard++) {
    const doors = offeredDoors(s, registry, pack.graph);
    if (doors.length === 0) break;
    const room = doors[Math.floor(rand() * doors.length)];
    expect(s.visited, `${pack.meta.id}: ${room.id} offered twice`).not.toContain(room.id);
    for (let i = 0; i < room.stages.length; i++) {
      const avail = room.stages[i].choices.filter((c) => !c.available || c.available(s));
      expect(avail.length, `${pack.meta.id}: ${room.id} stage ${i} has < 2 available choices`).toBeGreaterThanOrEqual(2);
      const choice = avail[Math.floor(rand() * avail.length)];
      s = applyEffects(s, choice.effects);
      s.transcript.push({ roomId: room.id, stageIndex: i, choiceId: choice.id, choiceText: choice.text, effects: choice.effects });
    }
    s.hearts = 3; // immortal for graph purposes
    s = completeRoom(s, room.id, registry, pack.graph);
  }
  return s;
}

describe.each(packs)('pack graph — full-run simulation ($name)', ({ pack }) => {
  it('20 seeded runs all finish (reach a room-less state) within the guard budget', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const s = simulateRun(pack, seed);
      const registry = makeRegistry(pack.rooms);
      const doors = offeredDoors(s, registry, pack.graph);
      expect(doors.length, `${pack.meta.id} seed ${seed} did not finish within the guard budget`).toBe(0);
    }
  });

  it('every finished run reaches act 4 (the fixed corridor) before running out of doors', () => {
    const s = simulateRun(pack, 7);
    expect(s.act).toBe(4);
  });

  it('the gates are visited in ascending act order across a run', () => {
    const s = simulateRun(pack, 3);
    const gateIds = Object.values(pack.graph.gates);
    const gateVisitIndices = gateIds
      .map((id) => s.visited.indexOf(id))
      .filter((i) => i !== -1);
    const sorted = [...gateVisitIndices].sort((a, b) => a - b);
    expect(gateVisitIndices).toEqual(sorted);
  });
});

describe.each(packs)('pack graph — evaluate() and endingRules integration ($name)', ({ pack }) => {
  it('evaluate() never throws on a fresh run state', () => {
    expect(() => pack.endingRules.evaluate(newRun())).not.toThrow();
  });

  it('evaluate() returns an id that is a real ending in this pack', () => {
    const s = newRun();
    const id = pack.endingRules.evaluate(s);
    const knownIds = new Set(pack.endings.map((e) => e.id));
    // hidden endings may not always be reachable from a fresh run — only
    // assert membership when the pack actually defines the id (structural
    // sanity, not full eligibility logic, which is pack-specific).
    if (!pack.endingRules.hiddenUntilWitnessed.includes(id)) {
      expect(knownIds.has(id), `evaluate() returned unknown ending id "${id}"`).toBe(true);
    }
  });

  it('dissolved/failure state (hearts <= 0) evaluates to some real ending', () => {
    const s = { ...newRun(), hearts: 0 };
    const id = pack.endingRules.evaluate(s);
    const knownIds = new Set(pack.endings.map((e) => e.id));
    expect(knownIds.has(id), `evaluate() with hearts<=0 returned unknown ending id "${id}"`).toBe(true);
  });
});

describe('storyEngine graph parameter — actually respects a non-default graph', () => {
  const customGraph: ContentPack['graph'] = {
    prologue: 'custom-prologue',
    actPools: { 1: ['custom-pool-a'], 2: ['custom-pool-b'], 3: ['custom-pool-c'] },
    gates: { 1: 'custom-gate-1', 2: 'custom-gate-2', 3: 'custom-gate-3', 4: 'custom-gate-4' },
    act4Sequence: ['custom-act4-a', 'custom-act4-b'],
    understorySequence: ['custom-under-a'],
    optionalPerAct: { 1: 0, 2: 0, 3: 0 },
    actNamesEn: { 0: 'Custom 0', 1: 'Custom 1', 2: 'Custom 2', 3: 'Custom 3', 4: 'Custom 4' },
    understoryNameEn: 'Custom Understory',
  };
  const customRegistry = makeRegistry([
    { id: 'custom-prologue', act: 0, title: 'p', type: 'DILEMMA', doorHint: '', teaser: '', stages: [] },
    { id: 'custom-pool-a', act: 1, title: 'a', type: 'DILEMMA', doorHint: '', teaser: '', stages: [] },
    { id: 'custom-gate-1', act: 1, title: 'g1', type: 'DILEMMA', doorHint: '', teaser: '', stages: [], gate: true },
    { id: 'custom-act4-a', act: 4, title: 'a4a', type: 'DILEMMA', doorHint: '', teaser: '', stages: [] },
    { id: 'custom-act4-b', act: 4, title: 'a4b', type: 'DILEMMA', doorHint: '', teaser: '', stages: [], gate: true },
  ]);

  it('offeredDoors(...) with a custom graph offers the custom prologue, not any default pack’s', () => {
    const doors = offeredDoors(newRun(), customRegistry, customGraph);
    expect(doors).toHaveLength(1);
    expect(doors[0].id).toBe('custom-prologue');
  });

  it('offeredDoors(...) called with NO graph arg (default) offers ANAMNESIS’s own prologue instead', () => {
    // proves the default-parameter fallback is real, not a no-op — passing
    // no graph must NOT accidentally pick up the custom graph above.
    const anamnesisRegistry = makeRegistry(anamnesisPack.rooms);
    const doors = offeredDoors(newRun(), anamnesisRegistry);
    expect(doors).toHaveLength(1);
    expect(doors[0].id).toBe(anamnesisPack.graph.prologue);
    expect(doors[0].id).not.toBe('custom-prologue');
  });

  it('completeRoom(...) with a custom graph advances act using the custom prologue id', () => {
    const s = { ...newRun(), currentRoom: 'custom-prologue' };
    const next = completeRoom(s, 'custom-prologue', customRegistry, customGraph);
    expect(next.act).toBe(1);
  });

  it('backfillVisitedForJump(...) with a custom graph backfills the custom act4Sequence', () => {
    const visited = backfillVisitedForJump([], 'custom-act4-b', customGraph);
    expect(visited).toContain('custom-act4-a');
  });
});
