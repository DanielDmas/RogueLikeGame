// UAT 28 — the rozcestník (landing page). Serves landing/index.html plus
// the real, currently-shipped public/av-manifest.json with a tiny static
// file server (it's a plain page outside either pack's Vite build — no
// dev-server route serves it) and confirms both door links point at the
// right pack builds, the page renders with zero console/page errors, and
// (item F3, 2026-07-15) the landing-music toggle correctly stays
// invisible against the shipped empty manifest — the honest default that
// fix relies on.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const LANDING_ROOT = join(REPO_ROOT, '..', 'landing');
const MIME = { '.html': 'text/html', '.json': 'application/json' };

function assert(condition, message) {
  if (!condition) throw new Error(`UAT assertion failed: ${message}`);
}

// Serves landing/index.html plus the real, currently-shipped
// public/av-manifest.json (empty by default — see F3's own convention:
// an empty manifest is the honest, real-deployment state, not a 404).
const server = createServer(async (req, res) => {
  if (req.url === '/av-manifest.json') {
    try {
      const body = await readFile(join(REPO_ROOT, '..', 'public', 'av-manifest.json'));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(body);
      return;
    } catch {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"voice":{},"music":{}}');
      return;
    }
  }
  const path = req.url === '/' ? '/index.html' : req.url;
  try {
    const body = await readFile(join(LANDING_ROOT, path));
    res.writeHead(200, { 'Content-Type': MIME[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});

await new Promise((resolve) => server.listen(0, resolve));
const port = server.address().port;

const browser = await chromium.launch({ executablePath: process.env.UAT_CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await page.goto(`http://localhost:${port}/`);
  await page.waitForTimeout(500);

  const anamnesisLink = await page.locator('a.door--anamnesis').getAttribute('href');
  assert(anamnesisLink === './anamnesis/index.html', `ANAMNESIS door should link to ./anamnesis/index.html, got "${anamnesisLink}"`);
  const limerenceLink = await page.locator('a.door--limerence').getAttribute('href');
  assert(limerenceLink === './limerence/index.html', `LIMERENCE door should link to ./limerence/index.html, got "${limerenceLink}"`);

  const title = await page.locator('h1').textContent();
  assert(title?.includes('Vestibule'), `landing page should show "The Vestibule" as its h1, got "${title}"`);

  // public/av-manifest.json is served here in its real, currently-shipped
  // empty state ({"voice":{},"music":{}}) — the music toggle must stay
  // invisible, matching the honest default this session's F3 fix relies on.
  const musicToggleDisplay = await page.locator('#music-toggle').evaluate((el) => getComputedStyle(el).display);
  assert(musicToggleDisplay === 'none', `music toggle should stay hidden with the shipped empty manifest, got display="${musicToggleDisplay}"`);

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log('UAT 28 (vestibule landing page): PASS — both door links correct, music toggle correctly invisible against the empty manifest, zero errors');
} finally {
  await browser.close();
  server.close();
}
