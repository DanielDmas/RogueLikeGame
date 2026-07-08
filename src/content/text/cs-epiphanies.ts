// Czech translations for the Ledger's twelve epiphanies (spec 06, Phase P).
// Each line is translated for the quiet, understated register the Ledger
// keeps throughout — never a fanfare, just a fact — see CLAUDE.md's
// translation rule.
import { registerAll } from '../../engine/text/resolver';
import { epiphanyKey } from '../../engine/text/keys';

registerAll('v2', 'cs', {
  [epiphanyKey('first-return')]: 'Vrátili jste se.',
  [epiphanyKey('kept-every-heart')]: 'Jednou jste si udrželi všechna srdce.',
  [epiphanyKey('spent-every-heart')]: 'Poznali jste, jak vypadá dno účetní knihy.',
  [epiphanyKey('refused-machine-twice')]: 'Dvakrát jste odmítli ten stroj.',
  [epiphanyKey('all-doors-one-act')]: 'V jednom dějství už nezbývají žádné neotevřené dveře.',
  [epiphanyKey('codex-complete')]: 'Každá místnost, spatřena.',
  [epiphanyKey('three-endings')]: 'Tři cesty ven, všechny vaše.',
  [epiphanyKey('descended')]: 'Sešli jste po schodech.',
  [epiphanyKey('examined-run')]: 'Nechali jste Přístavek zaznamenat svůj komentář, od začátku do konce.',
  [epiphanyKey('first-keepsake')]: 'Něco malého šlo s vámi.',
  [epiphanyKey('high-lucidity')]: 'Dokončili jste to, když jste viděli téměř všechno.',
  [epiphanyKey('last-word-kept')]: 'Měli jste jednu větu a pořád ji máte.',
});
