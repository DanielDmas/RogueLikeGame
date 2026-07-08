/// <reference types="vite/client" />

/** Injected by vite.config.ts's `define` from package.json's version field. */
declare const __APP_VERSION__: string;

/** Injected by vite.config.ts's `define` from the VITE_PACK env var
 * (default 'anamnesis') — selects which ContentPack main.ts boots. */
declare const __PACK__: string;
