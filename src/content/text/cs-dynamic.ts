// The v2 beats that are functions of RunState (state-reactive callbacks),
// translated by hand alongside their string siblings in cs-rooms-actN.ts —
// scripts/extract-v2.ts only lifts plain strings, so these can't be
// auto-extracted. Branching logic mirrors the English source exactly.
import { register, t } from './resolver';
import { choseIn, hasFlag, pickShadowMoments } from '../../engine/gameState';
import { punchlineUnlocked } from '../../engine/endings';
import type { RunState } from '../schema';
import { roomBeatKey, roomChoiceOutcomeKey, roomChoiceTextKey } from './keys';

/** Czech mirror of act3.ts's SHADOW_FALLBACK, index-aligned. */
const CAVE_SHADOW_FALLBACK_CS: string[] = [
  'Stín sahá po páce, kterou nikdy úplně nezatáhne, zachycený uprostřed rozhodování, navždy skoro.',
  'Stín sedí u postele, která už tu není, a říká něco, co oheň pohltí dřív, než to dorazí ke stěně.',
  'Stín stojí v prahu, jednu ruku napůl zvednutou — ne tak docela mávnutí, ne tak docela odmítnutí — a tu pozici drží velmi dlouho.',
];

for (const index of [0, 1, 2] as const) {
  register(roomBeatKey('the-cave', 0, 2 + index), 'v2', 'cs', (s: RunState) => {
    const entry = pickShadowMoments(s.prior)[index];
    if (!entry) return CAVE_SHADOW_FALLBACK_CS[index];
    const choice = t(roomChoiceTextKey(entry.roomId, entry.choiceId), entry.choiceText);
    return `Na stěně stín opakuje volbu, kterou jste už jednou učinili, přesně tak, jak jste ji učinili: „${choice}“`;
  });
}

register(roomBeatKey('junction', 1, 3), 'v2', 'cs', (s: RunState) =>
  choseIn(s, 'junction', 'pull')
    ? 'Uvaděč: Minule jste zatáhli za páku — jeden za pět, řekl jste. Tady je stejný obchod, blíž kůži. Uvidíme, jestli ta aritmetika přežije dotek.'
    : choseIn(s, 'junction', 'no-pull')
      ? 'Uvaděč: Nechal jste ruce od páky. Jsem zvědavý, jestli most něco změní. Obvykle mění. To, že mění, je samo o sobě ta hádanka.'
      : 'Uvaděč: Minule jste to nazval hloupostí. Tramvaj si i tak zařídila druhé dějství. Nezajímá ji váš názor na tu premisu.',
);

register(roomChoiceOutcomeKey('junction', 'push', 1), 'v2', 'cs', (s: RunState) =>
  choseIn(s, 'junction', 'pull')
    ? 'Uvaděč: Páka i most, oboje. Ať je pravda cokoli jiného, ta aritmetika ve vás jde až na dno. Jestli je to integrita, nebo varovný štítek, nechám na vás.'
    : 'Uvaděč: Ne, u páky. Ano, na mostě. To je vzácný postoj. Posezte si s ním chvíli — možná jste ho nezvolili záměrně.',
);

register(roomChoiceOutcomeKey('junction', 'no-push', 1), 'v2', 'cs', (s: RunState) =>
  choseIn(s, 'junction', 'pull')
    ? 'Uvaděč: Takže — zatáhnout za páku, ale ušetřit strčení. Pět za jednoho na délku paže, ne na délku ruky. Ta asymetrie zaměstnává filozofické katedry už půl století. Jestli je to moudrost ve vaší páteři, nebo prostě přecitlivělost, to nedokážu říct.'
    : 'Uvaděč: Důsledné odmítnutí. Tramvaj si vzala deset, napříč dvěma místnostmi, a vaše ruce si nevzaly ani jednoho. Pro váš postoj existuje jméno. Je sporné. Držíte ho pevně.',
);

register(roomBeatKey('ship', 0, 4), 'v2', 'cs', (s: RunState) =>
  s.memoryLost
    ? 'Jedno prkno, po kterém sáhnou, tam prostě není — mezera se spálenými okraji, kde fotografie kdysi něco kotvila. Řemeslníci se poradí, pokrčí rameny a do mezery vsadí prázdnou desku. Sestava v koutě má stejnou díru. Dotkne se té mezery ve stejném okamžiku jako vy.'
    : 'Řemeslníci pracují podle soupisu, a ten soupis je, jak si všimnete, fotoalbum. Každé prkno má svůj obrázek. Každý obrázek má svědka. Sestava v koutě také kontroluje album a přikyvuje u stejných stránek.',
);

register(roomBeatKey('teleporter', 0, 3), 'v2', 'cs', (s: RunState) =>
  choseIn(s, 'ship', 'pattern')
    ? 'Vzpomínáte na dílnu — hlasoval jste pro vzor, znovu sestavená prkna. Kabina je v jistém smyslu váš vlastní postoj s dveřmi. Jedna věc je zastávat názor. Jiná je vstoupit dovnitř.'
    : choseIn(s, 'ship', 'neither')
      ? 'Vzpomínáte na dílnu — „já nikdy nebylo něčím, co přetrvává,“ řekl jste sám sobě, dvakrát. Kabina zjevně četla váš spis. Hučí, jako by říkala: dokažte to.'
      : 'Někde za vámi, v dílně vonící cedrem, se řemeslníci pravděpodobně stále hádají o prknech. Kabina je stejná hádka, přeformulovaná v instalatérštině.',
);

register(roomBeatKey('door-that-asks', 0, 2), 'v2', 'cs', (s: RunState) =>
  hasFlag(s, 'pulled-lever') || hasFlag(s, 'kept-lever') || hasFlag(s, 'refused-once')
    ? hasFlag(s, 'pulled-lever')
      ? 'DVEŘE: U Křižovatky jste zatáhli za páku — jeden život vyplacen, aby zůstalo pět. Aritmetika nad zdrženlivostí. Stojíte si za tím, tady, na konci, kdy je tramvaj dávno pryč a žádná odpověď už nic nezíská?'
      : hasFlag(s, 'kept-lever')
        ? 'DVEŘE: U Křižovatky jste nechal ruce od páky — pět ztraceno, žádné z nich k vydání. Stojíte si za tím, tady, na konci, kde se nikdo nedívá a figuríny se všechny rozešly domů?'
        : 'DVEŘE: U Křižovatky jste odmítl samotnou otázku — nazval jste ji hloupou, odmítl premisu. Nesoudím. Jen se ptám: teď, když tu stojíte, bylo to odmítnutí postoj, nebo úlek?'
    : 'DVEŘE: Ke Křižovatce jste se nikdy nedostali; tramvaj jela bez vás. Zvláštní. Tak se zeptám na rovinu, bez inscenace: pět cizích lidí, nebo jeden, a vaše ruka na páce — víte, i teď, co byste udělali?',
);

register(roomBeatKey('door-that-asks', 0, 3), 'v2', 'cs', (s: RunState) =>
  s.memoryLost
    ? 'DVEŘE: V ohni jste nechali fotografii shořet. Důkaz, kým jste bývali, vyměněn. Ve vašem spisu je díra tam, kde bývala — vidím ji odsud. Stálo to za to?'
    : hasFlag(s, 'saved-photo')
      ? 'DVEŘE: V ohni jste zachránili fotografii. Kašel za druhými dveřmi ustal, a vy jste svůj důkaz odnesli kolem něj ven. Teď je ve vaší kapse. Stálo to za to?'
      : 'DVEŘE: Nesete si svou minulost neporušenou — žádný oheň si nevzal nic, co jste sami nevydali. Tichý spis. Někdy se těch tichých prostě ještě nikdo nezeptal na tu správnou otázku. Považujte se za tázané: co byste nechali shořet?',
);

register(roomChoiceOutcomeKey('door-that-asks', 'dont-remember', 0), 'v2', 'cs', (s: RunState) =>
  s.memoryLost
    ? 'DVEŘE: Ve vašem případě to není vytáčka — je to doklad. Je ve vás opravdová díra, ve tvaru ohně, a odpovědi, které do ní spadly, nejsou zapřené, jen nedosvědčené. Přijímám mezery, které byly zaplacené. Ta vaše má potvrzenku.'
    : 'DVEŘE: Hm. Váš spis nevykazuje žádné požáry, žádné díry — vzpomínky jsou všechny přítomné; co chybí, je ochota postavit se vedle nich. „Nepamatuji si“ z neporušeného archivu je pohodlná mlha. Nechám to projít — jsem dveře, ne soudce — ale oba jsme to slyšeli.',
);

register(roomBeatKey('door-that-asks', 1, 4), 'v2', 'cs', (s: RunState) =>
  punchlineUnlocked(s)
    ? 'A je tu — všimnete si toho až teď a chápete, že ne každý si toho smí všimnout — čtvrté dveře. Malé. Prosté. Teplé světlo pod nimi, a zpoza nich, jasně: smích. Uvaděč sleduje váš pohled a neřekne vůbec nic, což je od Uvaděče standing ovation.'
    : 'Někde stranou si napůl všimnete malých prostých dveří, o kterých jste si docela jistí, že nikdy nebyly v plánech. Jsou zamčené. Zpoza nich, velmi tiše: smích. Uvaděč sleduje váš pohled. „Tentokrát ne,“ řekne jemně, a je to nějak zároveň verdikt i pozvání vrátit se.',
);
