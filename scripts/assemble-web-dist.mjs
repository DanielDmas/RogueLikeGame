// Copies the static rozcestník (landing/index.html) into dist-web/ after
// both packs have built into dist-web/anamnesis/ and dist-web/limerence/.
// Run via `npm run build:web` — never invoked directly by the Pages
// deploy workflow, which calls that one script so the assembly step can't
// silently drift out of sync with the two builds it depends on.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distWeb = join(root, 'dist-web');
const anamnesisIndex = join(distWeb, 'anamnesis', 'index.html');
const limerenceIndex = join(distWeb, 'limerence', 'index.html');

for (const [label, path] of [['anamnesis', anamnesisIndex], ['limerence', limerenceIndex]]) {
  if (!existsSync(path)) {
    console.error(`assemble-web-dist: missing ${label} build output at ${path} — run build:anamnesis/build:limerence first.`);
    process.exit(1);
  }
}

mkdirSync(distWeb, { recursive: true });
copyFileSync(join(root, 'landing', 'index.html'), join(distWeb, 'index.html'));
console.log('assemble-web-dist: wrote dist-web/index.html (rozcestník) alongside dist-web/anamnesis/ and dist-web/limerence/.');
