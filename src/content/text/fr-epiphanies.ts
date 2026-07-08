// French translations for the Ledger's twelve epiphanies (spec 06, Phase P).
// Each line is translated for the quiet, understated register the Ledger
// keeps throughout — never a fanfare, just a fact — see CLAUDE.md's
// translation rule.
import { registerAll } from '../../engine/text/resolver';
import { epiphanyKey } from '../../engine/text/keys';

registerAll('v2', 'fr', {
  [epiphanyKey('first-return')]: 'Vous êtes revenu.',
  [epiphanyKey('kept-every-heart')]: 'Une fois, vous avez gardé chaque cœur.',
  [epiphanyKey('spent-every-heart')]: 'Vous avez appris à quoi ressemble le fond du grand livre.',
  [epiphanyKey('refused-machine-twice')]: 'Vous avez refusé la machine deux fois.',
  [epiphanyKey('all-doors-one-act')]: 'Un acte ne contient plus aucune porte que vous n’avez pas ouverte.',
  [epiphanyKey('codex-complete')]: 'Chaque pièce, contemplée.',
  [epiphanyKey('three-endings')]: 'Trois issues, toutes les vôtres.',
  [epiphanyKey('descended')]: 'Vous avez pris l’escalier.',
  [epiphanyKey('examined-run')]: 'Vous avez laissé l’Annexe consigner son commentaire, du début à la fin.',
  [epiphanyKey('first-keepsake')]: 'Quelque chose de petit est venu avec vous.',
  [epiphanyKey('high-lucidity')]: 'Vous avez terminé en ayant presque tout vu.',
  [epiphanyKey('last-word-kept')]: 'Vous aviez une phrase, et vous l’avez encore.',
});
