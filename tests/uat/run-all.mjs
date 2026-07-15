// Batch runner for the committed UAT suite. Spawns each named script as its
// own `node <script>.mjs` child process (matching how every script in this
// directory is documented to run individually — see README.md), so a crash
// or hang in one script can never take down the batch. Records a
// machine-readable result per run under tests/uat/results/<timestamp>/,
// plus a human-readable summary.md, so consecutive sweeps are directly
// comparable over time (same script name, same shape, diffable).
//
// Usage: node tests/uat/run-all.mjs [script1.mjs script2.mjs ...]
// With no arguments, runs every *.mjs file in this directory except itself
// and _helpers.mjs.
import { spawn } from 'node:child_process';
import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DIR = dirname(fileURLToPath(import.meta.url));
const PER_SCRIPT_TIMEOUT_MS = 175_000; // just under the 3-minute/script rule, leaving shutdown headroom

const requested = process.argv.slice(2);
const scripts =
  requested.length > 0
    ? requested
    : readdirSync(DIR)
        .filter((f) => f.endsWith('.mjs') && f !== 'run-all.mjs' && !f.startsWith('_'))
        .sort();

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const resultsDir = join(DIR, 'results', timestamp);
mkdirSync(resultsDir, { recursive: true });

function runOne(script) {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn(process.execPath, [join(DIR, script)], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
    }, PER_SCRIPT_TIMEOUT_MS);
    child.on('close', (code) => {
      clearTimeout(timer);
      const durationMs = Date.now() - start;
      const timedOut = durationMs >= PER_SCRIPT_TIMEOUT_MS;
      resolve({
        script,
        pass: code === 0 && !timedOut,
        exitCode: code,
        timedOut,
        durationMs,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
      });
    });
  });
}

console.log(`UAT batch run — ${scripts.length} script(s), results -> ${resultsDir}`);
const results = [];
for (const script of scripts) {
  process.stdout.write(`  running ${script} ... `);
  const result = await runOne(script);
  results.push(result);
  console.log(`${result.pass ? 'PASS' : 'FAIL'} (${(result.durationMs / 1000).toFixed(1)}s)`);
  writeFileSync(join(resultsDir, `${script}.json`), JSON.stringify(result, null, 2));
}

const passCount = results.filter((r) => r.pass).length;
const summary = {
  timestamp,
  total: results.length,
  passed: passCount,
  failed: results.length - passCount,
  totalDurationMs: results.reduce((sum, r) => sum + r.durationMs, 0),
  results: results.map((r) => ({ script: r.script, pass: r.pass, durationMs: r.durationMs, timedOut: r.timedOut })),
};
writeFileSync(join(resultsDir, 'summary.json'), JSON.stringify(summary, null, 2));

const md = [
  `# UAT batch run — ${timestamp}`,
  '',
  `${passCount}/${results.length} passed, total wall-clock ${(summary.totalDurationMs / 1000).toFixed(1)}s.`,
  '',
  '| Script | Result | Duration |',
  '|---|---|---|',
  ...results.map((r) => `| \`${r.script}\` | ${r.pass ? '✅ PASS' : '❌ FAIL'} | ${(r.durationMs / 1000).toFixed(1)}s |`),
  '',
  ...(passCount < results.length
    ? [
        '## Failures',
        '',
        ...results
          .filter((r) => !r.pass)
          .flatMap((r) => [
            `### \`${r.script}\``,
            '',
            '```',
            r.timedOut ? `TIMED OUT after ${PER_SCRIPT_TIMEOUT_MS / 1000}s` : `exit code ${r.exitCode}`,
            (r.stderr || r.stdout || '(no output)').slice(-4000),
            '```',
            '',
          ]),
      ]
    : []),
].join('\n');
writeFileSync(join(resultsDir, 'summary.md'), md);

console.log(`\n${passCount}/${results.length} passed. Summary: ${join(resultsDir, 'summary.md')}`);
process.exit(passCount === results.length ? 0 : 1);
