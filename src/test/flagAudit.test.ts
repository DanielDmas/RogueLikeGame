import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { allRooms } from '../content/rooms';
import { KEEPSAKE_TRIGGERS } from '../content/keepsakes';
import { limerencePack } from '../packs/limerence';
import type { Room } from '../engine/schema';

/**
 * M5 Phase R6 — dead-flag audit, implemented as a generated registry rather
 * than a one-off snapshot: it recomputes both sides from the actual source
 * every run, so it cannot go stale the way a hand-maintained list would.
 *
 * "Written" = every literal in some choice's `effects.flags` across all
 * authored rooms for a pack. "Read" = every literal passed to
 * `hasFlag(state, '...')` / `s.flags.includes('...')` anywhere in that
 * pack's own source roots (scanned as text, so this also catches the
 * per-language dynamic-beat override files, which read flags but don't
 * import the room registry), plus every flag consumed as a keepsake
 * earn-trigger (read positionally in `flow.ts`, not via `hasFlag`).
 *
 * A written flag with no reader anywhere is either a bug (forgot to wire it
 * up) or an intentional one-way marker (e.g. read via `choseIn`/
 * `choseInPrior` against room+choice id instead of the flag, or seeded
 * ahead of a not-yet-built consumer like LIMERENCE's epiphany system) —
 * the latter must be named in that pack's ALLOWLIST with a reason, so the
 * registry stays honest.
 */

function findTsFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) findTsFiles(full, out);
    else if (entry.name.endsWith('.ts')) out.push(full);
  }
  return out;
}

function writtenFlags(rooms: Room[]): Set<string> {
  const flags = new Set<string>();
  for (const room of rooms) {
    for (const stage of room.stages) {
      for (const choice of stage.choices) {
        for (const flag of choice.effects.flags ?? []) flags.add(flag);
      }
    }
  }
  return flags;
}

function readFlagsViaHasFlag(roots: string[]): Set<string> {
  const flags = new Set<string>();
  for (const root of roots.map((d) => resolve(__dirname, '../..', d))) {
    for (const file of findTsFiles(root)) {
      const src = readFileSync(file, 'utf-8');
      for (const m of src.matchAll(/hasFlag\([^,]+,\s*'([^']+)'\)/g)) flags.add(m[1]);
      for (const m of src.matchAll(/\.flags\.includes\('([^']+)'\)/g)) flags.add(m[1]);
    }
  }
  return flags;
}

// ANAMNESIS — flags a room writes but that no `hasFlag` call anywhere ever
// reads, each with a documented alternate read path — not a bug, but must
// be named here or the audit below fails, so a genuinely forgotten reader
// can't hide next to these on-purpose ones.
const ANAMNESIS_ALLOWLIST: Record<string, string> = {
  pushed:
    "the-junction's push outcome is read via choseIn(s, 'junction', 'push') / " +
    "choseInPrior(s.prior, 'junction', 'push') against the room+choice id " +
    '(understory.ts, act4.ts, per-language dynamic beats) — the flag itself ' +
    'is never queried by name.',
  'kept-bridge':
    "the-junction's no-push outcome is read via choseIn(s, 'junction', " +
    "'no-push') / choseInPrior(s.prior, 'junction', 'no-push') — see 'pushed'.",
};

// LIMERENCE — same shape. Most of these are narrative-continuity markers
// seeded ahead of spec 06 §3's 12 epiphanies (not yet pack-parameterized,
// see UPGRADE_PLAN.md's LIMERENCE L4 entry): several map directly onto the
// spec's own predicate language (e.g. "tested/trapped rather than asked",
// "logistics instead of words"). Recorded honestly as forward-seeded, not
// silently left to look like an oversight.
const LIMERENCE_ALLOWLIST: Record<string, string> = {
  'first-test': "the-read-receipt's bait choice — feeds the eventual 'tested rather than asked' epiphany (spec 06 §3, #1/#5 lineage).",
  'told-the-wronged': 'the-screenshot — disclosure-lineage marker, no current downstream reader.',
  'ultimatum-given': 'the-screenshot — disclosure-lineage marker, no current downstream reader.',
  'held-the-secret': "the-screenshot's stay-out choice — suppression-lineage marker (spec 06 §3 #2 lineage).",
  'reported-it': 'the-forward — disclosure-lineage marker, no current downstream reader.',
  'told-her-first': 'the-forward — disclosure-lineage marker, no current downstream reader.',
  'crossed-the-line': 'the-best-friends-girl — limerence-conduct marker, no current downstream reader.',
  'windows-open': "the-distance/just-friends — Glass window/wall lineage marker, set by two rooms' 'open' choices; no current downstream reader.",
  'buried-the-almost': "the-distance's bury-it choice — suppression-lineage marker (spec 06 §3 #2 lineage).",
  'visiting-almost': 'the-distance — rationalization-lineage marker, no current downstream reader.',
  'consent-performed': "the-hall-pass's agree-to-keep-peace choice — performed-vs-felt consent marker, no current downstream reader.",
  'pass-used-angry': 'the-hall-pass — spite-lineage marker, no current downstream reader.',
  'kept-the-anesthesia': "the-rebound's let-her-believe choice — asymmetric-attachment marker, no current downstream reader.",
  'signed-their-terms': 'the-unicorn — couple-privilege marker, no current downstream reader.',
  'wall-built': "just-friends' nothing-to-tell choice — Glass wall lineage marker (spec 06 §3 #2/#7 lineage).",
  'stayed-the-third': 'the-other-side-of-the-door — read indirectly via act4.ts’s YOURS_FLAGS array + .some(hasFlag), not a literal hasFlag call, but genuinely consumed.',
  'told-the-wife': 'the-other-side-of-the-door — no current downstream reader.',
  'crossed-at-the-conference': 'the-colleague — read indirectly via act4.ts’s YOURS_FLAGS array + .some(hasFlag), not a literal hasFlag call, but genuinely consumed.',
  'steadied-first': 'the-discovery’s steady-then-ask choice — read indirectly via act4.ts’s THEIRS_FLAGS array + .some(hasFlag), not a literal hasFlag call, but genuinely consumed. Also joins the ASKING lineage in epiphanies.ts (matched by choice id, not this flag).',
  'kept-the-door-open': "the-colleague's postpone choice — deferred-decision marker, no current downstream reader.",
  'honored-the-veto': 'the-veto — compliance-lineage marker, no current downstream reader.',
  'veto-war': "the-veto's counter-veto choice — escalation-lineage marker, no current downstream reader.",
  'chose-the-work': 'the-drift — repair-lineage marker, no current downstream reader.',
  'defended-the-category': "the-second-account's defend-the-category choice — rationalization-lineage marker, no current downstream reader.",
  'eve-call': 'the-wedding-eve — archive-warmth marker, no current downstream reader.',
  'door-criticism': "the-therapist's criticism door — only 'door-contempt' (the most severe horseman) gets a stage-2 dynamic callback; the other three doors are recorded but not currently differentiated downstream.",
  'door-defensiveness': "the-therapist's defensiveness door — see 'door-criticism'.",
  'door-stonewalling': "the-therapist's stonewalling door — see 'door-criticism' (though its outcome beat does read the-discovery's flags directly).",
  'stayed-for-kids': "the-kitchen-table's stay-for-them choice — feeds the eventual 'apologizes with logistics' epiphany (spec 06 §3 #9 lineage).",
  'chose-repair': "the-kitchen-table's attempt-repair choice — repair-lineage marker, no current downstream reader.",
};

describe.each([
  {
    name: 'ANAMNESIS',
    rooms: allRooms,
    roots: ['src/content', 'src/engine'],
    keepsakeTriggers: KEEPSAKE_TRIGGERS,
    allowlist: ANAMNESIS_ALLOWLIST,
  },
  {
    name: 'LIMERENCE',
    rooms: limerencePack.rooms,
    roots: ['src/packs/limerence'],
    keepsakeTriggers: limerencePack.keepsakeTriggers,
    allowlist: LIMERENCE_ALLOWLIST,
  },
])('Dead-flag audit (generated registry) — $name', ({ rooms, roots, keepsakeTriggers, allowlist }) => {
  const written = writtenFlags(rooms);
  const readViaHasFlag = readFlagsViaHasFlag(roots);
  const readViaKeepsake = new Set(Object.keys(keepsakeTriggers));

  it('found a sane number of written flags (sanity check the scan itself is working)', () => {
    expect(written.size).toBeGreaterThan(5);
  });

  it('every flag a room writes is read: via hasFlag, a keepsake trigger, or an explicit allowlist entry', () => {
    const unread = [...written].filter(
      (flag) => !readViaHasFlag.has(flag) && !readViaKeepsake.has(flag) && !(flag in allowlist),
    );
    expect(unread, `flags with no reader and no allowlist entry: ${unread.join(', ')}`).toEqual([]);
  });

  it('the allowlist has no stale entries — every allowlisted flag is still actually written somewhere', () => {
    const stale = Object.keys(allowlist).filter((flag) => !written.has(flag));
    expect(stale, `allowlisted but no room writes these anymore: ${stale.join(', ')}`).toEqual([]);
  });
});

describe('Dead-flag audit — hasFlag never reads a flag that no room in that pack writes (ANAMNESIS only; a typo or dangling reader)', () => {
  it('hasFlag never reads a flag that no room writes', () => {
    const written = writtenFlags(allRooms);
    const readViaHasFlag = new Set<string>();
    for (const root of ['src/content', 'src/engine'].map((d) => resolve(__dirname, '../..', d))) {
      for (const file of findTsFiles(root)) {
        const src = readFileSync(file, 'utf-8');
        for (const m of src.matchAll(/hasFlag\([^,]+,\s*'([^']+)'\)/g)) readViaHasFlag.add(m[1]);
      }
    }
    const dangling = [...readViaHasFlag].filter((flag) => !written.has(flag));
    expect(dangling, `hasFlag reads a flag no room writes: ${dangling.join(', ')}`).toEqual([]);
  });
});
