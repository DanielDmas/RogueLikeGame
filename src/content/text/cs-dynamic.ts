// The v2 beats that are functions of RunState (state-reactive callbacks),
// translated by hand alongside their string siblings in cs-rooms-actN.ts —
// scripts/extract-v2.ts only lifts plain strings, so these can't be
// auto-extracted. Branching logic mirrors the English source exactly.
import { register, t } from '../../engine/text/resolver';
import { choseIn, choseInPrior, hasFlag, pickExhibitEntry, pickShadowMoments, pickUnchosenRooms } from '../../engine/gameState';
import { punchlineUnlocked } from '../../engine/endings';
import type { RunState } from '../../engine/schema';
import { roomBeatKey, roomChoiceOutcomeKey, roomChoiceTextKey, roomTitleKey, endingTitleKey } from '../../engine/text/keys';
import { ROOM_TITLE_BY_ID, ENDING_TITLE_BY_ID } from '../rooms/understory';

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

register(roomBeatKey('photograph', 0, 4), 'v2', 'cs', (s: RunState) =>
  choseIn(s, 'wallet', 'keep-it')
    ? 'Uvaděč: Obávám se, že obojí dveře jsou nosné. Za jedněmi život, který ještě můžete zachránit. Za druhými já, které ještě můžete dokázat — totéž já, které si strčilo do kapsy cizí peněženku, když se nedívala žádná kamera. Oheň je jiný druh svědka. Nezapomíná, co vidí, a teď se dívá.'
    : choseIn(s, 'wallet', 'return-all')
      ? 'Uvaděč: Obávám se, že obojí dveře jsou nosné. Za jedněmi život, který ještě můžete zachránit. Za druhými já, které ještě můžete dokázat — totéž já, které kdysi neslo cizí peněženku čtyřicet minut přes celé město, bez jakékoli odměny. Uvidíme, jestli to já přežije i oheň, a ne jen prázdnou chodbu.'
      : 'Uvaděč: Obávám se, že obojí dveře jsou nosné. Za jedněmi život, který ještě můžete zachránit. Za druhými já, které ještě můžete dokázat. Oheň nepočká, až se poradíte s nějakým rámcem.',
);

register(roomBeatKey('court-of-usher', 0, 2), 'v2', 'cs', (s: RunState) =>
  choseIn(s, 'omelas', 'open-door')
    ? 'Uvaděč: Ten případ je existenciální, a budu stručný. Vy jste soudce. Ano — vy, ten rozpuštěný. Jste skoro jediná strana v této místnosti bez konfliktu zájmů — blíž tomu než většina, aspoň. V Omelasu jste sešel po schodech do sklepa, když byly dveře odemčené a nikdo vás nenutil. To je, než začneme, zapsáno ve váš prospěch.'
    : choseIn(s, 'omelas', 'stay')
      ? 'Uvaděč: Ten případ je existenciální, a budu stručný. Vy jste soudce. Ano — vy, ten rozpuštěný. Jste jediná strana v této místnosti bez konfliktu zájmů, což vám hodně napovídá o tomhle konkrétním soudu — i když si vzpomínám na jednu slavnost, kterou jste kdysi neopustil, se zvony a se vším. Suďte přesto. Vyloučení pro podjatost je luxus, který tahle stolice nenabízí.'
      : 'Uvaděč: Ten případ je existenciální, a budu stručný. Vy jste soudce. Ano — vy, ten rozpuštěný. Jste jediná strana v této místnosti bez konfliktu zájmů, což vám hodně napovídá o tomhle konkrétním soudu.',
);

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

// ---------- Act V (understory) dynamic beats ----------

register(roomBeatKey('the-archive', 0, 3), 'v2', 'cs', (s: RunState) => {
  const entry = pickExhibitEntry(s.prior?.transcript ?? []);
  if (!entry) {
    return 'Karta v otevřené krabici je prázdná, na jednom rohu potřísněná vodou — cokoli tahle krabice kdysi obsahovala, cestu dolů nepřežilo. Zbytek police je aspoň čitelný.';
  }
  const choice = t(roomChoiceTextKey(entry.roomId, entry.choiceId), entry.choiceText);
  return `Karta zní, vaší vlastní rukou: „${choice}“ Žádný další komentář. Zařízení nekomentuje. Jen uchovává.`;
});

register(roomBeatKey('the-unchosen', 0, 2), 'v2', 'cs', (s: RunState) => {
  const { candidates } = pickUnchosenRooms(s.prior);
  if (candidates.length === 0) {
    return 'Chodba je dnes večer podivně prázdná — každé dveře, které jste mohl minout, jste zjevně neminul. Nebo záznam o nich prostě nepřežil cestu dolů. Zařízení neříká, co z toho platí.';
  }
  const titles = candidates.map((id) => t(roomTitleKey(id), ROOM_TITLE_BY_ID[id] ?? id));
  return `Tři vás zaujmou nejdřív: ${titles.join(', ')}. Nepamatujete si, že by se kterékoli z nich otevřely. Jste si teď dost jistý, že aspoň jedny vám byly nabídnuty — a vy jste prostě prošel kolem.`;
});

register(roomBeatKey('the-unchosen', 0, 3), 'v2', 'cs', (s: RunState) => {
  const { opens } = pickUnchosenRooms(s.prior);
  if (!opens) {
    return 'Žádné jednotlivé dveře se dnes večer nevyčleňují. Chodba zůstává přesně, celá, zavřená, a nějak je to samo o sobě odpověď.';
  }
  const title = t(roomTitleKey(opens), ROOM_TITLE_BY_ID[opens] ?? opens);
  return `Jedny dveře, blízko konce chodby, se samy zbytek cesty otevřou — ${title}. Cokoli tam čekalo, evidentně čeká pořád.`;
});

register(roomChoiceOutcomeKey('the-unchosen', 'enter-it', 0), 'v2', 'cs', (s: RunState) => {
  const { opens } = pickUnchosenRooms(s.prior);
  const title = opens ? t(roomTitleKey(opens), ROOM_TITLE_BY_ID[opens] ?? opens) : 'místnost';
  return `Vstoupíte do ${title} — nebo do toho, co z ní zbylo. Žádný oheň, žádný hlas zařízení nečeká, žádné dilema uprostřed věty. Jen místnost, zařízená, trochu zaprášená, nedělající nic zvláštního.`;
});

register(roomBeatKey('the-echo', 0, 2), 'v2', 'cs', (s: RunState) => {
  const moments = pickShadowMoments(s.prior);
  if (moments.length === 0) {
    return 'Druhá židle mlčí. Tentokrát není nic zaznamenáno, z čeho by se dal hlas sestavit — a místnost to ke své cti nepředstírá.';
  }
  const lines = moments.map((e) => `„${t(roomChoiceTextKey(e.roomId, e.choiceId), e.choiceText)}“`).join(' Pak: ');
  return `Řekne vám zpátky dvě nebo tři vaše vlastní věty, vaším vlastním tónem, popořadě: ${lines}`;
});

register(roomBeatKey('the-echo', 0, 3), 'v2', 'cs', (s: RunState) => {
  if (choseInPrior(s.prior, 'junction', 'push')) {
    return 'Vzpomíná i na most — tu verzi vás, která zatlačila. „Konzistence, s rukama,“ říká, citujíc sama sebe s jakousi lítostivou pýchou.';
  }
  if (choseInPrior(s.prior, 'junction', 'no-push')) {
    return 'Vzpomíná i na most — tu verzi vás, která netlačila. „Některé prostředky nikdy nejsou jen prostředky,“ říká, a pro jednou to nezní, že se hádá.';
  }
  return 'O mostě se nezmiňuje. Buď jste se k němu nikdy nedostal, nebo to nebyla ta část vás, která to dnes večer potřebovala vyslovit.';
});

register(roomBeatKey('the-echo', 0, 4), 'v2', 'cs', (s: RunState) => {
  const id = s.prior?.endingId;
  if (!id) return 'Neví, jak jste odešel naposledy. Zdá se, že ani tohle si místnost neuchovává.';
  const title = t(endingTitleKey(id), ENDING_TITLE_BY_ID[id] ?? id);
  return `Ví i to, jak jste odešel — ani na to hrdý, ani se za to nestydí, což je nějak horší než obojí. „${title},“ řekne, jednou, věcně, a neopakuje se.`;
});
