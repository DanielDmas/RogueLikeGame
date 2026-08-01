// Extended code review (2026-08-01), Batch 4 — the bundle-isolation half
// of the round-3 runtime interrogation, promoted from a one-off scratch
// grep into a repeatable check. Requires a real production build
// (`npm run build:web`) to already exist at dist-web/ — this is why it
// lives here rather than in the vitest suite (which runs with no DOM and
// no bundler, and must stay fast).
//
// Verifies, against the REAL minified bundles, the same guarantee
// main.ts's own header comment documents and a prior Fable review (M4)
// caught failing once already: exactly one pack's content ships per
// build, so a player never downloads the other game's guide vocabulary,
// room ids, or prose. Run via `npm run verify:isolation` after
// `npm run build:web`; wired into the Pages deploy workflow so a
// regression here fails the deploy, not just a future audit.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distWeb = join(root, 'dist-web');

function bundleText(packDir) {
  const assetsDir = join(distWeb, packDir, 'assets');
  if (!existsSync(assetsDir)) {
    console.error(`verify-pack-isolation: missing ${assetsDir} — run npm run build:web first.`);
    process.exit(1);
  }
  return readdirSync(assetsDir)
    .filter((f) => f.endsWith('.js'))
    .map((f) => readFileSync(join(assetsDir, f), 'utf8'))
    .join('\n');
}

// One probe per language for each pack's own guide word, plus one verbatim
// prose sentence per pack (a teaser and an epitaph) — prose is guaranteed
// pack-exclusive content with zero engine-default coupling. Deliberately
// NOT room ids: `storyEngine.ts`'s `DEFAULT_GRAPH` and similar
// engine-default parameters bake a handful of ANAMNESIS ids (`marys-room`,
// `door-that-asks`, `boulder`) into the shared engine module itself as
// unused fallback values — round 3's own investigation found and
// documented this as a real, but accepted and never player-reachable,
// coupling; testing for those ids here would just re-flag a known,
// already-judged-acceptable finding on every run.
const ANAMNESIS_MARKERS = [
  'Uvaděč',
  'نگهبان',
  'Platzanweiser',
  'Le Placeur',
  'A test with no witnesses — except the one that counts.',
  'The world was exactly the same. That was never the promise.',
];
const LIMERENCE_MARKERS = [
  'Vrátný',
  'دربان',
  'Portier',
  'Le Portier',
  'someone is awake at 1 a.m., reading one word: seen',
  'The conversation was still there. So, finally, were you.',
];

const anamnesisBundle = bundleText('anamnesis');
const limerenceBundle = bundleText('limerence');

const failures = [];
for (const marker of LIMERENCE_MARKERS) {
  if (anamnesisBundle.includes(marker)) failures.push(`ANAMNESIS bundle contains LIMERENCE marker: "${marker}"`);
}
for (const marker of ANAMNESIS_MARKERS) {
  if (limerenceBundle.includes(marker)) failures.push(`LIMERENCE bundle contains ANAMNESIS marker: "${marker}"`);
}

if (failures.length > 0) {
  console.error('verify-pack-isolation: FAILED — cross-pack content leaked into a production bundle:');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log('verify-pack-isolation: OK — no cross-pack guide vocabulary or room ids found in either bundle.');
