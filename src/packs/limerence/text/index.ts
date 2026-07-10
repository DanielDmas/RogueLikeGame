// Bootstraps LIMERENCE's text catalog: importing this module (once wired
// into packs/limerence/index.ts) registers every translation entry (side
// effect) before the app renders anything — same pattern as
// src/content/text/index.ts (ANAMNESIS). Language files are added here as
// each translation pass lands; until then LIMERENCE plays fully in English
// via the fallback text already inline in its room/ending/guide source (see
// packs/types.ts's spec-08-§3 "every t() call has an honest English
// fallback" guarantee) — this file currently has nothing to import.

export * from '../../../engine/text/resolver';
export * from '../../../engine/text/keys';
