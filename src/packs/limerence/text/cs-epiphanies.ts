// Czech translation of LIMERENCE's 12 Ledger epiphanies (see
// packs/limerence/epiphanies.ts's EN_FALLBACK). Quiet, one-line
// observations over a player's choice history — never advice, never read
// by gameplay logic, pure flavor text. Register mirrors
// content/text/cs-epiphanies.ts (ANAMNESIS): wry, quiet, a little
// uncomfortable, never a fanfare — see CLAUDE.md's translation rule. Ids
// are pack-local strings distinct from ANAMNESIS's own epiphany ids, so no
// pack-scoping is needed for epiphanyKey (see engine/text/keys.ts).
import { registerAll } from '../../../engine/text/resolver';
import { epiphanyKey } from '../../../engine/text/keys';

registerAll('v2', 'cs', {
  [epiphanyKey('never-asked-first')]: 'Nikdy jste se nezeptali dřív, než jste obvinili.',
  [epiphanyKey('three-times-fine')]: 'Tři místnosti vás slyšely říct „je to v pohodě". Nikdy to v pohodě nebylo.',
  [epiphanyKey('truth-one-room-late')]: 'Pravdu říkáte vždycky přesně o jednu místnost později.',
  [epiphanyKey('never-the-one-to-leave')]: 'Nikdy jste nebyli ten, kdo odejde.',
  [epiphanyKey('every-trap-caught-you')]: 'Každá past, kterou jste nastražili, chytila vás.',
  [epiphanyKey('mid-goodbye')]: 'Pořád si vybíráte lidi uprostřed rozloučení.',
  [epiphanyKey('window-and-wall')]: 'Okno, a zeď: postavili jste obojí. Spočítejte si, které častěji.',
  [epiphanyKey('doors-you-avoid')]: 'Každou nápovědu nad dveřmi jste si přečetli dvakrát. Už dávno víte, kterým dveřím se vyhýbáte.',
  [epiphanyKey('apologizes-with-logistics')]: 'Omlouváte se logistikou.',
  [epiphanyKey('sentence-never-said')]:
    'Nikdo v tomhle hotelu vás nikdy neslyšel říct tu větu, kterou jste nechali říct za sebe místnost.',
  [epiphanyKey('walked-away-once')]: 'Jednou jste odešli. Je to ve spisu. Přečtěte si to, až bude chodba dlouhá.',
  [epiphanyKey('legible-not-finished')]: 'Váš rukopis je čitelný. To není totéž jako dokončený.',
});
