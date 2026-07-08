// German translations for the Ledger's twelve epiphanies (spec 06, Phase P).
// Each line is translated for the quiet, understated register the Ledger
// keeps throughout — never a fanfare, just a fact — see CLAUDE.md's
// translation rule.
import { registerAll } from '../../engine/text/resolver';
import { epiphanyKey } from '../../engine/text/keys';

registerAll('v2', 'de', {
  [epiphanyKey('first-return')]: 'Sie sind zurückgekehrt.',
  [epiphanyKey('kept-every-heart')]: 'Einmal haben Sie jedes Herz bewahrt.',
  [epiphanyKey('spent-every-heart')]: 'Sie haben erfahren, wie der Grund des Hauptbuchs aussieht.',
  [epiphanyKey('refused-machine-twice')]: 'Sie haben die Maschine zweimal abgelehnt.',
  [epiphanyKey('all-doors-one-act')]: 'In einem Akt gibt es keine ungeöffneten Türen mehr.',
  [epiphanyKey('codex-complete')]: 'Jeder Raum, erblickt.',
  [epiphanyKey('three-endings')]: 'Drei Wege hinaus, alle Ihre.',
  [epiphanyKey('descended')]: 'Sie haben die Treppe genommen.',
  [epiphanyKey('examined-run')]: 'Sie ließen den Anbau seinen Kommentar führen, von Anfang bis Ende.',
  [epiphanyKey('first-keepsake')]: 'Etwas Kleines kam mit Ihnen.',
  [epiphanyKey('high-lucidity')]: 'Sie haben es beendet, als Sie fast alles gesehen hatten.',
  [epiphanyKey('last-word-kept')]: 'Sie hatten einen Satz, und Sie haben ihn noch immer.',
});
