// Copies the static rozcestník (landing/index.html) into dist-web/ after
// both packs have built into dist-web/anamnesis/ and dist-web/limerence/.
// Run via `npm run build:web` — never invoked directly by the Pages
// deploy workflow, which calls that one script so the assembly step can't
// silently drift out of sync with the two builds it depends on.
//
// Also copies public/av-manifest.json and any public/music/landing/ file
// into dist-web/ — the rozcestník is a plain static page outside either
// pack's Vite build, so unlike dist-web/anamnesis/ and dist-web/limerence/
// (whose own `public/` gets copied in automatically by Vite), nothing else
// puts these where landing/index.html's own script expects to fetch them
// from. Without this step the landing music toggle would silently never
// find its manifest, even once the owner drops a real file in.
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
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

const manifestSrc = join(root, 'public', 'av-manifest.json');
if (existsSync(manifestSrc)) copyFileSync(manifestSrc, join(distWeb, 'av-manifest.json'));

const landingMusicDir = join(root, 'public', 'music', 'landing');
if (existsSync(landingMusicDir)) {
  const distMusicDir = join(distWeb, 'music', 'landing');
  mkdirSync(distMusicDir, { recursive: true });
  for (const file of readdirSync(landingMusicDir)) {
    copyFileSync(join(landingMusicDir, file), join(distMusicDir, file));
  }
}

console.log('assemble-web-dist: wrote dist-web/index.html (rozcestník) alongside dist-web/anamnesis/ and dist-web/limerence/, plus av-manifest.json and any landing music file.');
