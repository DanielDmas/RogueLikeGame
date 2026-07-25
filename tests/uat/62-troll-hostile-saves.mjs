// UAT 62 — adversarial-save troll test. The save payload is the one genuinely
// untrusted input this game has: `localStorage` is editable by anyone with
// devtools, and profiles are importable as files. Malformed *JSON* was already
// handled (localSave falls back to its backup); **valid JSON carrying hostile
// values was not** — until this pass, `hydrateProfile` was a bare spread that
// trusted every field, and 10 of the payloads below crashed the running game.
//
// Why this exists alongside `src/test/hostileSaves.test.ts`: the unit tests
// pin the pure functions, but only a real browser proves the *whole load path*
// survives — hydrate → title screen → Continue → runLoop → 3D scene build.
// The `act=99` crash, for instance, happened three layers below hydrate, in
// `doorsForAct`'s `graph.actPools[act].map(...)`, and no pure-function test
// would have reached it.
//
// Each case reloads with a fresh page so payloads can't interact. Beyond "no
// error thrown", each also asserts the app is still *usable* (real rendered
// content, not a blank page or the crash-recovery overlay) — a silently
// blank screen is as bad a failure as a thrown exception, and doesn't
// register as one.
import { withPage, BASE_URL, PROFILE_KEY, assert } from './_helpers.mjs';

/** A structurally sound run — each case below varies exactly one field, so a
 * failure names the responsible field rather than "some bad run". */
const okRun = () => ({
  act: 1, hearts: 3, lucidity: 100,
  axes: { reasonFeeling: 0, selfOthers: 0, controlAcceptance: 0 },
  flags: [], transcript: [], visited: [], currentRoom: null, currentStage: 0,
  actOptionalDone: 0, memoryLost: false, finished: false, endingId: null,
});
const withRun = (over) => ({ run: { ...okRun(), ...over } });

const CASES = {
  // Out-of-range act — reached `graph.actPools[act].map(...)` on an undefined pool.
  'act=99':             withRun({ act: 99 }),
  'act=-1':             withRun({ act: -1 }),
  'act=null':           withRun({ act: null }),
  'act="two"':          withRun({ act: 'two' }),
  // Numeric fields that feed the HUD and ending evaluation.
  'hearts=-5':          withRun({ hearts: -5 }),
  'hearts=99':          withRun({ hearts: 99 }),
  'lucidity=null':      withRun({ lucidity: null }),
  'axes=null':          withRun({ axes: null }),
  'axes={}':            withRun({ axes: {} }),
  // Arrays the engine iterates — `visited=null` hit isResumableRun's `.every`.
  'visited=null':       withRun({ visited: null }),
  'transcript=null':    withRun({ transcript: null }),
  'flags=null':         withRun({ flags: null }),
  'currentStage=999':   withRun({ currentRoom: 'waiting-room', currentStage: 999 }),
  'currentRoom=number': withRun({ currentRoom: 42 }),
  // The run slot itself holding a non-object.
  'run=[]':             { run: [] },
  'run="x"':            { run: 'x' },
  'run=0':              { run: 0 },
  // Profile-level fields — each crashed a `.map`/`.length`/`.name`.
  'roomVisits=null':    { roomVisits: null, runsCompleted: 3 },
  'endingsSeen=null':   { endingsSeen: null, runsCompleted: 3 },
  'keepsakes=null':     { keepsakes: null, runsCompleted: 3 },
  'codexUnlocked=null': { codexUnlocked: null },
  'persona=null':       { persona: null },
  'settings=null':      { settings: null },
  'heartsLost=null':    { heartsLost: null, runsCompleted: 3 },
  'understoryDesc=null':{ understoryDescents: null, runsCompleted: 3 },
  // Injection / abuse of the one free-text field a player controls. These
  // passed even before the hardening (`ui/dom.ts`'s `el()` uses textContent
  // throughout) — kept so that guarantee is continuously proven, not assumed.
  'persona.name=xss':   { persona: { name: '<img src=x onerror="window.__XSS=1">', blurb: 'b' } },
  'persona.name=1MB':   { persona: { name: 'A'.repeat(1000000), blurb: 'b' } },
  'persona.name=tokens':{ persona: { name: '{name}{blurb}', blurb: '{name}' } },
  // Prototype pollution via a hostile key. Object spread defines rather than
  // sets, so this is safe — pinned so a refactor to Object.assign (which DOES
  // invoke setters) can't silently reopen it.
  'proto-pollution':    JSON.parse('{"__proto__":{"polluted":true}}'),
};

const failures = [];

for (const [name, patch] of Object.entries(CASES)) {
  await withPage(async (page) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`CONSOLE: ${m.text()}`); });

    // Boot once so a real, fully-hydrated profile exists, then corrupt it —
    // this exercises the load path a returning player would actually hit,
    // rather than a synthetic profile missing unrelated fields.
    await page.goto(`${BASE_URL}/?uat=1`);
    await page.waitForFunction(() => window.__anamnesisUat, { timeout: 10000 }).catch(() => {});

    await page.evaluate(({ key, patch }) => {
      const raw = localStorage.getItem(key);
      const p = raw ? JSON.parse(raw) : {};
      Object.assign(p, patch);
      p.hasSeenAbout = true; // skip onboarding so Continue is reachable
      localStorage.setItem(key, JSON.stringify(p));
    }, { key: PROFILE_KEY, patch });

    await page.goto(`${BASE_URL}/?uat=1`);
    await page.waitForTimeout(1200);

    const cont = page.getByText(/CONTINUE THE JOURNEY/i).first();
    if (await cont.count()) {
      await cont.click({ timeout: 4000 }).catch(() => {});
    } else {
      const begin = page.locator('.title-menu button, .overlay button').first();
      if (await begin.count()) await begin.click({ timeout: 4000 }).catch(() => {});
    }
    await page.waitForTimeout(1800);

    const xss = await page.evaluate(() => !!window.__XSS);
    const polluted = await page.evaluate(() => ({}).polluted === true);
    const blank = await page.evaluate(() => (document.body.innerText || '').trim().length === 0);
    const recovery = await page.locator('.recovery-panel').count();

    const problems = [];
    if (errors.length) problems.push(`errors: ${JSON.stringify([...new Set(errors)].slice(0, 2))}`);
    if (xss) problems.push('SCRIPT EXECUTED FROM PERSONA NAME (XSS)');
    if (polluted) problems.push('Object.prototype polluted');
    if (blank) problems.push('rendered a blank page');
    if (recovery > 0) problems.push('fell through to the crash-recovery overlay');
    if (problems.length) failures.push(`${name} → ${problems.join('; ')}`);
  });
}

assert(
  failures.length === 0,
  `hostile save payloads broke the game:\n  ${failures.join('\n  ')}`,
);
console.log(
  `UAT 62 (adversarial saves): PASS — all ${Object.keys(CASES).length} hostile payloads ` +
    `loaded without errors, blank pages, XSS, or prototype pollution.`,
);
