// French translation of LIMERENCE's 12 Ledger epiphanies (see
// packs/limerence/epiphanies.ts's EN_FALLBACK). Quiet, one-line
// observations over a player's choice history — never advice, never read
// by gameplay logic, pure flavor text. Register mirrors
// text/de-epiphanies.ts / text/cs-epiphanies.ts / text/fa-epiphanies.ts:
// wry, quiet, a little uncomfortable, never a fanfare — see CLAUDE.md's
// translation rule. Ids are pack-local strings distinct from ANAMNESIS's
// own epiphany ids, so no pack-scoping is needed for epiphanyKey (see
// engine/text/keys.ts).
//
// Address: informal "tu" throughout, matching every other French file in
// this pack. Present tense and epicene nominal phrasing are preferred
// wherever a literal calque would force gendered past-participle agreement
// on the player (same approach documented in fr-rooms.ts's header) —
// 'never-the-one-to-leave' and 'walked-away-once' are rephrased around
// "tu" plus present-tense or invariant constructions rather than "tu es
// parti(e)".
import { registerAll } from '../../../engine/text/resolver';
import { epiphanyKey } from '../../../engine/text/keys';

registerAll('v2', 'fr', {
  [epiphanyKey('never-asked-first')]: 'Tu n’as jamais, pas une seule fois, demandé avant d’accuser.',
  [epiphanyKey('three-times-fine')]: 'Trois chambres t’ont entendu·e dire « ça va ». Ça n’allait jamais.',
  [epiphanyKey('truth-one-room-late')]: 'Tu dis toujours la vérité une chambre trop tard.',
  [epiphanyKey('never-the-one-to-leave')]: 'C’est toujours quelqu’un d’autre qui part. Jamais toi.',
  [epiphanyKey('every-trap-caught-you')]: 'Chaque piège que tu as tendu t’a pris toi-même.',
  [epiphanyKey('mid-goodbye')]: 'Tu n’arrêtes pas de choisir des gens en plein milieu d’un adieu.',
  [epiphanyKey('window-and-wall')]: 'La fenêtre et le mur : tu as bâti les deux. Compte lequel des deux revient le plus souvent.',
  [epiphanyKey('doors-you-avoid')]: 'Tu lis chaque indice de porte deux fois. Tu sais déjà quelles portes tu évites.',
  [epiphanyKey('apologizes-with-logistics')]: 'Tu t’excuses avec de la logistique.',
  [epiphanyKey('sentence-never-said')]:
    'Personne dans cet hôtel ne t’a jamais entendu·e dire toi-même la phrase que tu as laissée la chambre dire à ta place.',
  [epiphanyKey('walked-away-once')]: 'Une fois, tu es parti·e. C’est dans le dossier. Relis-le quand le couloir se fait long.',
  [epiphanyKey('legible-not-finished')]: 'Ton écriture est lisible. Ce n’est pas la même chose que terminée.',
});
