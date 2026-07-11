// Bootstraps LIMERENCE's text catalog: importing this module (once wired
// into packs/limerence/index.ts) registers every translation entry (side
// effect) before the app renders anything — same pattern as
// src/content/text/index.ts (ANAMNESIS). Language files are added here as
// each translation pass lands; rooms/choices/field notes not yet covered by
// a registered translation still play fully in English via the fallback
// text inline in the room/ending/guide source (see packs/types.ts's
// spec-08-§3 "every t() call has an honest English fallback" guarantee).
import './cs-rooms';
import './cs-reflections-act1';
import './cs-rooms-act2';
import './cs-reflections-act2';
import './cs-rooms-act3';
import './cs-reflections-act3';

export * from '../../../engine/text/resolver';
export * from '../../../engine/text/keys';
