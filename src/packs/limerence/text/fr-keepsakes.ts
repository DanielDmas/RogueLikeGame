// French translation of LIMERENCE's 4 keepsakes (name + origin). Mirrors
// text/de-keepsakes.ts / text/cs-keepsakes.ts / text/fa-keepsakes.ts — see
// CLAUDE.md's translation rule. Ids are pack-local ('the-cheap-ring' etc.)
// and never collide with ANAMNESIS's own keepsake ids ('casino-chip' etc.),
// so keepsakeKey needs no pack-id scoping here.
import { registerAll } from '../../../engine/text/resolver';
import { keepsakeKey } from '../../../engine/text/keys';

registerAll('v2', 'fr', {
  [keepsakeKey('the-cheap-ring', 'name')]: 'La bague bon marché',
  [keepsakeKey('the-cheap-ring', 'origin')]: 'gagnée à une fête, pour trente secondes à te faire rire au nez',
  [keepsakeKey('the-unsent-letter', 'name')]: 'La lettre jamais envoyée',
  [keepsakeKey('the-unsent-letter', 'origin')]: 'un aveu porté seul, jamais envoyé, jamais remis',
  [keepsakeKey('the-keycard', 'name')]: 'La carte-clé',
  [keepsakeKey('the-keycard', 'origin')]: 'une chambre d’hôtel que tu n’as pas ouverte, à la fin d’une conférence',
  [keepsakeKey('the-sim', 'name')]: 'La carte SIM',
  [keepsakeKey('the-sim', 'origin')]: 'un second compte, supprimé, qu’il t’a fallu une semaine pour arrêter de chercher',
});
