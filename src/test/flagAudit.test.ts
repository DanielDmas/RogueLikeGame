import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { allRooms } from '../content/rooms';
import { KEEPSAKE_TRIGGERS } from '../content/keepsakes';

/**
 * M5 Phase R6 — dead-flag audit, implemented as a generated registry rather
 * than a one-off snapshot: it recomputes both sides from the actual source
 * every run, so it cannot go stale the way a hand-maintained list would.
 *
 * "Written" = every literal in some choice's `effects.flags` across all
 * authored rooms. "Read" = every literal passed to `hasFlag(state, '...')`
 * anywhere in content/engine source (scanned as text, so this also catches
 * the per-language dynamic-beat override files, which read flags but don't
 * import `allRooms`), plus every flag consumed as a keepsake earn-trigger
 * (`KEEPSAKE_TRIGGERS`, read positionally in `flow.ts`, not via `hasFlag`).
 *
 * A written flag with no reader anywhere is either a bug (forgot to wire it
 * up) or an intentional one-way marker (e.g. read via `choseIn`/
 * `choseInPrior` against room+choice id instead of the flag) — the latter
 * must be named in ALLOWLIST with a reason, so the registry stays honest.
 */

function findTsFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) findTsFiles(full, out);
    else if (entry.name.endsWith('.ts')) out.push(full);
  }
  return out;
}

function writtenFlags(): Set<string> {
  const flags = new Set<string>();
  for (const room of allRooms) {
    for (const stage of room.stages) {
      for (const choice of stage.choices) {
        for (const flag of choice.effects.flags ?? []) flags.add(flag);
      }
    }
  }
  return flags;
}

function readFlagsViaHasFlag(): Set<string> {
  const flags = new Set<string>();
  const roots = ['src/content', 'src/engine'].map((d) => resolve(__dirname, '../..', d));
  for (const root of roots) {
    for (const file of findTsFiles(root)) {
      const src = readFileSync(file, 'utf-8');
      for (const m of src.matchAll(/hasFlag\([^,]+,\s*'([^']+)'\)/g)) flags.add(m[1]);
    }
  }
  return flags;
}

// Flags a room writes but that no `hasFlag` call anywhere ever reads, each
// with a documented alternate read path — not a bug, but must be named here
// or the audit below fails, so a genuinely forgotten reader can't hide next
// to these on-purpose ones.
const ALLOWLIST: Record<string, string> = {
  pushed:
    "the-junction's push outcome is read via choseIn(s, 'junction', 'push') / " +
    "choseInPrior(s.prior, 'junction', 'push') against the room+choice id " +
    '(understory.ts, act4.ts, per-language dynamic beats) — the flag itself ' +
    'is never queried by name.',
  'kept-bridge':
    "the-junction's no-push outcome is read via choseIn(s, 'junction', " +
    "'no-push') / choseInPrior(s.prior, 'junction', 'no-push') — see 'pushed'.",
};

describe('Milestone 5, Phase R6 — dead-flag audit (generated registry)', () => {
  const written = writtenFlags();
  const readViaHasFlag = readFlagsViaHasFlag();
  const readViaKeepsake = new Set(Object.keys(KEEPSAKE_TRIGGERS));

  it('found a sane number of written flags (sanity check the scan itself is working)', () => {
    expect(written.size).toBeGreaterThan(5);
  });

  it('every flag a room writes is read: via hasFlag, a keepsake trigger, or an explicit allowlist entry', () => {
    const unread = [...written].filter(
      (flag) => !readViaHasFlag.has(flag) && !readViaKeepsake.has(flag) && !(flag in ALLOWLIST),
    );
    expect(unread, `flags with no reader and no allowlist entry: ${unread.join(', ')}`).toEqual([]);
  });

  it('the allowlist has no stale entries — every allowlisted flag is still actually written somewhere', () => {
    const stale = Object.keys(ALLOWLIST).filter((flag) => !written.has(flag));
    expect(stale, `allowlisted but no room writes these anymore: ${stale.join(', ')}`).toEqual([]);
  });

  it('hasFlag never reads a flag that no room writes (a typo or dangling reader)', () => {
    const dangling = [...readViaHasFlag].filter((flag) => !written.has(flag));
    expect(dangling, `hasFlag reads a flag no room writes: ${dangling.join(', ')}`).toEqual([]);
  });
});
