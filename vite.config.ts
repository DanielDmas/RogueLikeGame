/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8')) as { version: string };

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const pack = env.VITE_PACK ?? 'anamnesis';
  return {
    base: './',
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __PACK__: JSON.stringify(pack),
    },
    build: {
      target: 'es2022',
      chunkSizeWarningLimit: 1200,
      // Output path deliberately unchanged (still `dist/`) — deploy-pages.yml
      // uploads `dist` as-is. A per-pack dist/<id>/ split + dual-pack deploy
      // is real but explicitly release/deploy-workflow work, out of scope
      // for L1 (spec 08 §4's "L5+/release" note), not a dev-time concern.
    },
    test: {
      environment: 'node',
      include: ['src/test/**/*.test.ts'],
    },
  };
});
