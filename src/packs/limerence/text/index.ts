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
import './cs-rooms-act4';
import './cs-reflections-act4';
import './cs-rooms-understory';
import './cs-reflections-understory';
import './cs-endings';
import './cs-keepsakes';
import './cs-epiphanies';
import './cs-guide';
import './fa-rooms';
import './fa-reflections-act1';
import './fa-rooms-act2';
import './fa-reflections-act2';
import './fa-rooms-act3';
import './fa-reflections-act3';
import './fa-rooms-act4';
import './fa-reflections-act4';
import './fa-rooms-understory';
import './fa-reflections-understory';
import './fa-endings';
import './fa-keepsakes';
import './fa-epiphanies';
import './fa-guide';
import './de-rooms';
import './de-reflections-act1';
import './de-rooms-act2';
import './de-reflections-act2';
import './de-rooms-act3';
import './de-reflections-act3';
import './de-rooms-act4';
import './de-reflections-act4';

export * from '../../../engine/text/resolver';
export * from '../../../engine/text/keys';
