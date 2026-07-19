// Czech translation of LIMERENCE's 4 keepsakes (name + origin). Mirrors
// content/text/cs.ts's keepsake block (ANAMNESIS) — see CLAUDE.md's
// translation rule. Ids are pack-local ('the-cheap-ring' etc.) and never
// collide with ANAMNESIS's own keepsake ids ('casino-chip' etc.), so
// keepsakeKey needs no pack-id scoping here.
import { registerAll } from '../../../engine/text/resolver';
import { keepsakeKey } from '../../../engine/text/keys';

registerAll('v2', 'cs', {
  [keepsakeKey('the-cheap-ring', 'name')]: 'Laciný prsten',
  [keepsakeKey('the-cheap-ring', 'origin')]: 'vyhraný na párty, za třicet vteřin výsměchu',
  [keepsakeKey('the-unsent-letter', 'name')]: 'Neodeslaný dopis',
  [keepsakeKey('the-unsent-letter', 'origin')]: 'vyznání nesené o samotě, nikdy neodeslané, nikdy nedoručené',
  [keepsakeKey('the-keycard', 'name')]: 'Klíčová karta',
  [keepsakeKey('the-keycard', 'origin')]: 'hotelový pokoj, neotevřený, na konci konference',
  [keepsakeKey('the-sim', 'name')]: 'SIM karta',
  [keepsakeKey('the-sim', 'origin')]: 'druhý účet, smazaný, po kterém jste ještě týden sahali',
});
