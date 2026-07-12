// German translation of LIMERENCE's 4 keepsakes (name + origin). Mirrors
// text/cs-keepsakes.ts and text/fa-keepsakes.ts — see CLAUDE.md's
// translation rule. Ids are pack-local ('the-cheap-ring' etc.) and never
// collide with ANAMNESIS's own keepsake ids ('casino-chip' etc.), so
// keepsakeKey needs no pack-id scoping here. "Schlüsselkarte" is the term
// already established for this object across the room-content German files
// (de-rooms-act3.ts, de-rooms-understory.ts).
import { registerAll } from '../../../engine/text/resolver';
import { keepsakeKey } from '../../../engine/text/keys';

registerAll('v2', 'de', {
  [keepsakeKey('the-cheap-ring', 'name')]: 'Der billige Ring',
  [keepsakeKey('the-cheap-ring', 'origin')]: 'gewonnen auf einer Party, für dreißig Sekunden Gelächter auf deine Kosten',
  [keepsakeKey('the-unsent-letter', 'name')]: 'Der unversandte Brief',
  [keepsakeKey('the-unsent-letter', 'origin')]: 'ein Geständnis, allein getragen, nie abgeschickt, nie zugestellt',
  [keepsakeKey('the-keycard', 'name')]: 'Die Schlüsselkarte',
  [keepsakeKey('the-keycard', 'origin')]: 'ein Hotelzimmer, das du nicht geöffnet hast, am Ende einer Konferenz',
  [keepsakeKey('the-sim', 'name')]: 'Die SIM-Karte',
  [keepsakeKey('the-sim', 'origin')]: 'ein zweiter Account, gelöscht, nach dem du noch eine Woche lang gegriffen hast',
});
