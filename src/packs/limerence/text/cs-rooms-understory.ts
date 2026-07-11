// Czech translation of LIMERENCE's Understory room prose (beats, choice
// text/hint/outcome, field notes, plain-language explanations). Registered
// under version 'v2'. Follows the structural pattern established by
// cs-rooms.ts (prologue/Act I), cs-rooms-act2.ts, cs-rooms-act3.ts and
// cs-rooms-act4.ts — see CLAUDE.md's "Translating content" rule: every line
// here was translated against the room's actual beats and each choice's
// stakes, not word-for-word. The Understory is the optional secret-branch
// epilogue reached via the stairs behind the front desk on a returning
// guest's second run — LIMERENCE's own mirror of ANAMNESIS's Act V — and its
// register is quieter and more archival than Act IV's checkout floor: a
// records office, a corridor of unopened doors, a room with a second chair.
// The-registry and the-doors-not-opened quote room/ending titles pulled from
// the previous run's transcript via ROOM_TITLE_BY_ID / ENDING_TITLE_BY_ID —
// per this project's convention, room/ending titles are never translated
// anywhere, so this file imports those two maps directly from the English
// room source (../rooms/understory) rather than re-declaring a Czech
// version.
import { register, registerAll } from '../../../engine/text/resolver';
import {
  roomBeatKey,
  roomChoiceHintKey,
  roomChoiceOutcomeKey,
  roomChoiceTextKey,
  roomExplanationKey,
  roomNoteBodyKey,
  roomNoteThinkersKey,
  roomNoteTitleKey,
} from '../../../engine/text/keys';
import type { RunState } from '../../../engine/schema';
import { choseInPrior, pickExhibitEntry, pickShadowMoments, pickUnchosenRooms } from '../../../engine/gameState';
import { ENDING_TITLE_BY_ID, ROOM_TITLE_BY_ID } from '../rooms/understory';

/** Mirrors understory.ts's own LIMERENCE_ACT_POOLS — needed here only for
 * the-doors-not-opened's "unchosen rooms" lookup. */
const LIMERENCE_ACT_POOLS: Record<1 | 2 | 3, string[]> = {
  1: ['the-read-receipt', 'the-screenshot', 'the-password', 'the-party', 'the-forward', 'the-best-friends-girl', 'the-summer-ends'],
  2: ['the-distance', 'the-hall-pass', 'the-rebound', 'the-unicorn', 'just-friends', 'the-ex', 'the-confession', 'the-other-side-of-the-door'],
  3: ['the-colleague', 'the-metamour', 'the-veto', 'the-drift', 'the-second-account', 'the-discovery', 'the-wedding-eve', 'the-therapist', 'the-usual-suite'],
};

// ---------- The Registry ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-registry', 0, 0)]:
    'Schodiště za recepčním pultem, o kterém byste odpřisáhli, že při ubytování nebylo. Dole: dlouhá, nízká místnost, regály identických šedých složek, táhnoucí se dál, než by strop měl dovolit.',
  [roomBeatKey('the-registry', 0, 1)]:
    'Na jednom regálu leží jediná novější složka: vaše. Orazítkovaná, pod datem, které poznáváte jako konec: DOKONČENO. ZALOŽENO. NEZAPOMENUTO.',
  // beat 2 is a function beat — registered below via register().
  [roomBeatKey('the-registry', 0, 3)]:
    'Sešité se vstupním formulářem, popis, který jste kdysi sami o sobě podali, doslova: „{blurb}“ Založeno bez komentáře — buď respekt, nebo chyba v archivaci. Odsud zdola vypadají oba stejně.',
  [roomBeatKey('the-registry', 0, 4)]:
    'Vrátný (ve dveřích, klobouk pod paží): „Sem dolů nechodím často. Nic tady není zakázané. Většina hostů sem chce zajít nanejvýš jednou. Archivu je to jedno tak jako tak. Nemá kam jinam jít.“',
  [roomChoiceTextKey('the-registry', 'sign-it')]: '„To jsem byl já. Přiznám se k tomu — ke všemu.“ Podepište kartičku sami.',
  [roomChoiceHintKey('the-registry', 'sign-it')]: 'Přiznejte se, nejtěžší druh podpisu',
  [roomChoiceOutcomeKey('the-registry', 'sign-it', 0)]:
    'Vezmete pero přivázané k regálu a podepíšete se pod strojem psaný řádek, vlastní rukou, kterou složka, zdá se, čekala.',
  [roomChoiceOutcomeKey('the-registry', 'sign-it', 1)]:
    'Vrátný: „Ne každý host se podepíše. Přidal jste svoje jméno k noci, která se už stala. Nevím, co to stojí. Vím, že to není nic málo.“',
  [roomChoiceTextKey('the-registry', 'disown-it')]: '„To už dneska nezní jako já.“ Nechte kartičku nepodepsanou.',
  [roomChoiceHintKey('the-registry', 'disown-it')]: 'Nechte ten odstup být skutečný, ne jen pohodlný',
  [roomChoiceOutcomeKey('the-registry', 'disown-it', 0)]:
    'Necháte kartičku přesně tak, jak jste ji našli, a odstoupíte od regálu, tak, jak byste odstoupili od cizince, který si náhodou obléká váš kabát.',
  [roomChoiceOutcomeKey('the-registry', 'disown-it', 1)]:
    'Vrátný: „Složka se nehádá. Jen uchovává, co se stalo — ať už ta ruka, co to udělala, pořád odpovídá na vaše jméno, nebo ne.“',
  [roomChoiceTextKey('the-registry', 'refile-unjudged')]: 'Zavřete víko jemně, uprostřed věty, bez komentáře, ať tak, nebo onak.',
  [roomChoiceHintKey('the-registry', 'refile-unjudged')]: 'Ani to nehajte, ani to nepopírejte — založte to',
  [roomChoiceOutcomeKey('the-registry', 'refile-unjudged', 0)]:
    'Zavřete složku tak, jak byste zavřeli knihu uprostřed kapitoly, z respektu, ne ze souhlasu, a vrátíte ji na regál.',
  [roomChoiceOutcomeKey('the-registry', 'refile-unjudged', 1)]:
    'Vrátný: „To je, myslím, skutečný smysl toho regálu. Ne rozsudek — místo, kam se dá něco odložit, aniž byste museli mít dořešeno, čím to vlastně bylo.“',
  [roomChoiceTextKey('the-registry', 'pin-the-keycard')]: 'Připíchněte starou klíčovou kartu na okraj otevřené složky — dodatek k záznamu.',
  [roomChoiceHintKey('the-registry', 'pin-the-keycard')]: 'Důkaz, že se ta chodba stala, a že jste z ní odešli',
  [roomChoiceOutcomeKey('the-registry', 'pin-the-keycard', 0)]:
    'Přitisknete deaktivovanou klíčovou kartu ke složce, dokud nedrží — důkaz zároveň, že se ta chodba stala, i že jste z ní odešli.',
  [roomChoiceOutcomeKey('the-registry', 'pin-the-keycard', 1)]:
    'Archiv to přijme přesně tak, jak archivy přijímají všechno: bez komentáře, bez námitky, a, jak si všimnete, aniž by to kdy vůbec potřeboval.',
  [roomExplanationKey('the-registry', 0)]:
    'Ukáže se vám založený, datovaný záznam volby z vašeho posledního pobytu tady, přečtený zpátky za studena, bez kontextu, který ji tehdy dělal rozumnou. Stojíte si za ní pořád, distancujete se od ní, nebo přijmete, že se stala, aniž byste ji do detailu soudili, tak či onak? Tohle je o tom, jak se vztahujeme k vlastním minulým volbám, jakmile uplyne čas — jako když si znovu přečtete starou zprávu a nejste si úplně jistí, jestli člověk, který ji poslal, a člověk, který ji teď čte, jsou úplně ten samý.',
  [roomNoteTitleKey('the-registry')]: 'O uchovávání složek',
  [roomNoteThinkersKey('the-registry')]: 'narativní identita (ohlas Ricœura, napříč tituly)',
  [roomNoteBodyKey('the-registry')]:
    'Paul Ricœur tvrdil, že já není věc, kterou lze najít introspekcí, ale vyprávění udržované v neustálé revizi — jeho stálost neleží v tom, že se nikdy nemění, ale v tom, že se dokáže změnit a přesto tomu pořád říkat ten samý příběh. Tahle místnost inscenuje přesně tu konfrontaci, kterou měla jeho teorie ustát: konkrétní, datovaný, založený čin, přečtený zpátky za studena, bez okolních kapitol, které ho tehdy dělaly nevyhnutelným. Přiznat se k němu, distancovat se od něj, a založit ho bez posouzení jsou tři různé vztahy k autorství, a Ricœurova vlastní odpověď je blíž tomu třetímu než kterémukoli z prvních dvou. **Nemusíte souhlasit s každou nocí v té složce. Musíte jen přiznat, čí je to rukopis.**',
});
register(roomBeatKey('the-registry', 0, 2), 'v2', 'cs', (s: RunState) => {
  const entry = pickExhibitEntry(s.prior?.transcript ?? []);
  if (!entry) {
    return 'Kartička v otevřené složce je prázdná, roh promáčený od vody — ať v téhle složce kdysi bylo cokoli, cestu sem dolů to nepřežilo. Zbytek regálu je aspoň čitelný.';
  }
  return `Na kartičce, vaším vlastním písmem, stojí: „${entry.choiceText}“ Žádný další komentář. Archiv nekomentuje. Jen uchovává.`;
});

// ---------- The Doors Not Opened ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-doors-not-opened', 0, 0)]:
    'Chodba udržovaná na stálé teplotě, lemovaná dveřmi pootevřenými — ne lákavě. Prostě otevřenými, tak, jak zůstanou dveře otevřené, když se je už opravdu dlouho nikdo neobtěžoval zavřít.',
  [roomBeatKey('the-doors-not-opened', 0, 1)]:
    'Tohle jsou dveře z vašeho posledního pobytu, kterými jste nikdy neprošli. Nevstoupené, nerozhodnuté, technicky pořád dostupné — tím konkrétním způsobem, jakým je zmeškaný vlak pořád, technicky, vlak.',
  // beats 2 and 3 are function beats — registered below via register().
  [roomBeatKey('the-doors-not-opened', 0, 4)]:
    'Vrátný: „Nečetl bych do toho, které to jsou, moc. Nebo bych do toho četl úplně všechno — nikdy jsem se nerozhodl, která rada je horší. A řeknu na rovinu tu věc, kterou tohle patro ne vždy říká nahlas: aféra, kterou jste neměli, je někdy dveře, které vám nikdy nebyly nabídnuty. Neotevřené automaticky neznamená ctnostné.“',
  [roomChoiceTextKey('the-doors-not-opened', 'enter-late')]: 'Dotlačte je do plna. Vejděte dovnitř.',
  [roomChoiceHintKey('the-doors-not-opened', 'enter-late')]: 'Zvědavost, uctěná pozdě',
  // outcome 0 is a function beat — registered below via register().
  [roomChoiceOutcomeKey('the-doors-not-opened', 'enter-late', 1)]:
    'Ať se tu mělo stát cokoli, už se to stalo, nebo nestalo, nebo ta otázka prostě vypršela tak, jako neotevřená pošta časem přestane být naléhavá. Je to menší, než jak jste si to vystavěli. Většina nežitých věcí je.',
  [roomChoiceTextKey('the-doors-not-opened', 'close-it')]: 'Zavřete je doopravdy až doteď. Některé dveře je upřímně lepší nechat dveřmi.',
  [roomChoiceHintKey('the-doors-not-opened', 'close-it')]: 'Respektujte, že už je to minulost',
  [roomChoiceOutcomeKey('the-doors-not-opened', 'close-it', 0)]:
    'Přivřete je, jemně, tak, jak byste zavřeli dveře do místnosti, kde někdo konečně, doopravdy spí.',
  [roomChoiceOutcomeKey('the-doors-not-opened', 'close-it', 1)]:
    'Dá se říct, že správný instinkt. Ne každé neotevřené dveře byly litování čekající na svou chvíli.',
  [roomChoiceTextKey('the-doors-not-opened', 'ask-why-now')]: '„Proč ses zase otevřely, zrovna teď?“ Zeptejte se přímo těch dveří.',
  [roomChoiceHintKey('the-doors-not-opened', 'ask-why-now')]: 'Vyslechněte tu nabídku, ne jen tu místnost',
  [roomChoiceOutcomeKey('the-doors-not-opened', 'ask-why-now', 0)]:
    'Přesně vzato žádná odpověď — dveře, i tady, nejsou od přírody sdílné — ale panty jsou nedávno naolejované. Někdo chtěl, aby se tyhle dveře dnes v noci daly snadno pohnout, konkrétně.',
  [roomChoiceOutcomeKey('the-doors-not-opened', 'ask-why-now', 1)]:
    'Vrátný: „Můj nejlepší odhad: sklep nabízí dveře, jejichž neotevření teď už dokážete přežít. Ani mně jeho načasování nikdy nevysvětlil.“',
  [roomExplanationKey('the-doors-not-opened', 0)]:
    'Ukáží se vám dveře, kterými jste při posledním pobytu prošli bez otevření — cesty, které jste nikdy nešli, navždy neznámé. Jedny se samy znovu pootevřou se skřípěním. Tohle je tíha „nešlápnuté cesty“: podíváte se konečně, teď, když vás to nic nestojí? Tahle hra přidává k té lidové verzi jednu poctivou opravu: aféra, kterou jste neměli, je někdy dveře, které vám nikdy nebyly nabídnuty, ne ctnost, kterou jste si vydobyli — neotevřené a nepokoušené nejsou tentýž úspěch.',
  [roomNoteTitleKey('the-doors-not-opened')]: 'Nešlápnutá cesta, proauditovaná',
  [roomNoteThinkersKey('the-doors-not-opened')]: 'Kierkegaardova (1844) závrať z možného · Frost (1916), špatně pochopený, opravený',
  [roomNoteBodyKey('the-doors-not-opened')]:
    'Kierkegaard nazval možnost tou nejzávratnější věcí, jaká je člověku dostupná — závratnější než jakékoli skutečné nebezpečí, protože skutečné je konečné, zatímco možné se množí bez limitu, čím déle stojíte na rozcestí a odmítáte si vybrat. Frostova báseň „Nešlápnutá cesta“ se skoro na každém maturitním projevu cituje špatně, jako hymna na odvážnou odchylku, ale báseň samotná je mazanější: obě cesty jsou, jak mluvčí přizná o dvě sloky dřív, sešlapané „vlastně skoro stejně“ — ten teskný povzdech na konci se předem přiznává jako příběh přetvarovaný zpětným pohledem, ne pravda hlášená přímo z toho rozcestí. **Přeneseno na vztahy: člověk, kterého jste si nevybrali, je fáma, ne účtenka.** Dveře v týhle chodbě nikdy nebyly tajně lepší. Byly prostě, na chvíli, možné — a možnost, jakmile se jednou zavře, si nenechává žádné účtenky, jen fámy.',
});
register(roomBeatKey('the-doors-not-opened', 0, 2), 'v2', 'cs', (s: RunState) => {
  const { candidates } = pickUnchosenRooms(s.prior, LIMERENCE_ACT_POOLS);
  if (candidates.length === 0) {
    return 'Chodba je dnes v noci nezvykle prázdná — každé dveře, které jste mohli propásnout, jste zjevně nepropásli. Nebo záznam o nich prostě cestu sem dolů nepřežil.';
  }
  const titles = candidates.map((id) => ROOM_TITLE_BY_ID[id] ?? id);
  return `Tři vás zaujmou jako první: ${titles.join(', ')}. Nepamatujete si, že by se kterékoli z nich otevřely. Teď jste si celkem jistí, že aspoň jedny vám byly nabídnuté — a vy jste kolem nich prošli.`;
});
register(roomBeatKey('the-doors-not-opened', 0, 3), 'v2', 'cs', (s: RunState) => {
  const { opens } = pickUnchosenRooms(s.prior, LIMERENCE_ACT_POOLS);
  if (!opens) {
    return 'Dnes v noci se žádné jedny dveře nevyčleňují. Chodba zůstává úplně zavřená, a nějak je to svým způsobem taky odpověď.';
  }
  const title = ROOM_TITLE_BY_ID[opens] ?? opens;
  return `Jedny dveře, blízko konce, se samy dorazí do plna — ${title}. Ať už za nimi cokoli čekalo, zjevně to čeká dál.`;
});
register(roomChoiceOutcomeKey('the-doors-not-opened', 'enter-late', 0), 'v2', 'cs', (s: RunState) => {
  const { opens } = pickUnchosenRooms(s.prior, LIMERENCE_ACT_POOLS);
  const title = opens ? (ROOM_TITLE_BY_ID[opens] ?? opens) : 'místnosti';
  return `Vstoupíte do ${title} — nebo do toho, co z toho zbylo. Žádná krize uprostřed věty, nikdo nečeká. Jen místnost, zařízená, trochu zaprášená, nedělající nic zvláštního.`;
});

// ---------- The Other Side ----------
const ECHO_EMPTY_FALLBACK_CS =
  'Druhá židle mlčí. Tentokrát není nic zaznamenáno, z čeho by se dal hlas sestavit — a místnost si, ke své cti, nic jiného nepředstírá.';

registerAll('v2', 'cs', {
  [roomBeatKey('the-other-side', 0, 0)]:
    'Holá místnost. Dvě židle, čelem k sobě, dost blízko na to, aby bylo jasné, že kdokoli v nich sedí, má být slyšet.',
  [roomBeatKey('the-other-side', 0, 1)]:
    'Druhá židle je obsazená. Ne osobou — místnost je v tomhle přesná, přesná způsobem, jaký si může dovolit jen místo, které nemá z lhaní žádný zisk — ale hlasem, sestaveným z toho, co jste tady při posledním pobytu řekli a zvolili.',
  // beats 2, 3 and 4 are function beats — registered below via register().
  [roomBeatKey('the-other-side', 0, 5)]:
    'Vrátný: „U tohohle nesedím. Ať už vy dva tady děláte cokoli, nikdy nebylo na mně, abych to rozhodoval.“',
  [roomChoiceTextKey('the-other-side', 'answer-yourself')]: '„Slyším tě.“ Promluvte k tomu, kým jste byli.',
  [roomChoiceHintKey('the-other-side', 'answer-yourself')]: 'Uznání, ne oprava',
  [roomChoiceOutcomeKey('the-other-side', 'answer-yourself', 0)]:
    'Řeknete to — ne opravu, ne omluvu, jen uznání, tak, jak byste pozdravili někoho ve dveřích, u koho jste si nebyli jistí, jestli vás ještě pozná.',
  [roomChoiceOutcomeKey('the-other-side', 'answer-yourself', 1)]:
    'Druhá židle přesně vzato neodpovídá. Ale něco se v místnosti usadí, tak, jak se usadí zadržovaný dech, když se ho konečně schválně necháte vypustit, dva lidi místo jednoho.',
  [roomChoiceTextKey('the-other-side', 'let-yourself-finish')]: 'Seďte naproti a neříkejte nic. Nechte ho tentokrát domluvit, bez přerušení.',
  [roomChoiceHintKey('the-other-side', 'let-yourself-finish')]: 'Nepřerušené vyslechnutí, jaké jste možná nikdy nikomu nedali',
  [roomChoiceOutcomeKey('the-other-side', 'let-yourself-finish', 0)]:
    'Necháte ho mluvit, až úplně do konce, aniž byste opravili jediné slovo — což si všimnete, že se vám ani napoprvé vždycky nepodařilo.',
  [roomChoiceOutcomeKey('the-other-side', 'let-yourself-finish', 1)]:
    'To ticho není prázdné. Je to, pokud vůbec něco, to nejúplnější, co bylo v týhle místnosti řečeno.',
  [roomChoiceTextKey('the-other-side', 'sit-in-both-chairs')]:
    '„Nikdy tu nebyl nikdo jiný.“ Posaďte se postupně na obě židle, a myslete to vážně.',
  [roomChoiceHintKey('the-other-side', 'sit-in-both-chairs')]: 'Nejnákladnější čtení: byli jste tu vždycky jenom vy',
  [roomChoiceOutcomeKey('the-other-side', 'sit-in-both-chairs', 0)]:
    'Na chvíli se posadíte i na tu druhou židli a zkusíte si ten hlas obléct jako kabát, který jste kdysi měli — a sedí, přesně, což je buď utěšující, nebo celý ten problém, podle toho, v kterou hodinu se ptáte.',
  [roomChoiceOutcomeKey('the-other-side', 'sit-in-both-chairs', 1)]:
    'Nikdy tu nebyl žádný host, kterého by bylo potřeba bavit. Jen řada vašich vlastních verzí, které se střídaly v držení té věty.',
  [roomChoiceTextKey('the-other-side', 'hand-the-sim')]: 'Podejte mrtvou SIM kartu hlasu na druhé židli.',
  [roomChoiceHintKey('the-other-side', 'hand-the-sim')]: 'Člověk, kterým jste přestali být, potají',
  [roomChoiceOutcomeKey('the-other-side', 'hand-the-sim', 0)]:
    '„Tady,“ řeknete a podáte ji — malý mrtvý čip, deaktivovaný, bez jediného zbylého signálu. „Tady je ten člověk, kterým jsem přestal být potají.“',
  [roomChoiceOutcomeKey('the-other-side', 'hand-the-sim', 1)]:
    'Druhá židle si ji vezme beze slova. Je to, nějak, ta nejupřímnější výměna, jaká se kdy podařila kterékoli verzi vás.',
  [roomExplanationKey('the-other-side', 0)]:
    'Naproti vám sedí hlas, sestavený úplně z toho, co jste tady při posledním pobytu řekli a zvolili — ne duch, spíš ozvěna nějaké dřívější verze vás samotných. Výzkum vcítění se do druhé perspektivy je jednoznačný: spolehlivě, i po krátkém nácviku, měřitelně zmírňuje destruktivní konflikt víc než skoro jakákoli jiná zkoumaná intervence — tahle místnost promění celé osnovy tohohle hotelu v jedno jediné cvičení.',
  [roomNoteTitleKey('the-other-side')]: 'Druhá židle',
  [roomNoteThinkersKey('the-other-side')]: 'výzkum vcítění se do druhé perspektivy',
  [roomNoteBodyKey('the-other-side')]:
    'Intervence založené na vcítění se do druhé perspektivy — záměrné představování si a formulování konfliktu z druhé strany — měřitelně snižují destruktivní konfliktní chování v kontrolovaných studiích, a ten efekt přežije i krátká, jednorázová cvičení. **Je to dovednost, ne vlastnost: bez procvičování se vytrácí, a musí se cvičit — to je celá premisa téhle místnosti.** Každá hádka v tomhle hotelu měla dva vypravěče v první osobě. Sklep uchovává obě nahrávky.',
});
register(roomBeatKey('the-other-side', 0, 2), 'v2', 'cs', (s: RunState) => {
  const moments = pickShadowMoments(s.prior);
  if (moments.length === 0) return ECHO_EMPTY_FALLBACK_CS;
  const lines = moments.map((e) => `„${e.choiceText}“`).join(' Pak: ');
  return `Řekne vám zpátky dvě nebo tři vaše vlastní věty — o půltón plošeji, než si pamatujete, že jste je řekli, tak, jak zní obranářství z té přijímající židle: ${lines}`;
});
register(roomBeatKey('the-other-side', 0, 3), 'v2', 'cs', (s: RunState) => {
  if (choseInPrior(s.prior, 'the-rumor', 'set-the-trap')) {
    return 'Pamatuje si i tu past — tu verzi vás, která ji nastražila na někoho, koho miloval. „Fungovalo to,“ řekne, cituje sám sebe s jakousi lítostivou upřímností. „To nikdy nebyla ta sporná část.“';
  }
  if (choseInPrior(s.prior, 'the-rumor', 'trust-without-asking')) {
    return 'Pamatuje si i to jezero — tu verzi vás, co se rozhodla nikdy to nevědět. „Důvěra, provozovaná místo prožívaná,“ řekne, a poprvé to nezní, jako by se hádal.';
  }
  return 'O Fámě se nezmiňuje. Buď jste se k ní nikdy nedostali, nebo to nebyla ta část vás, kterou bylo dnes v noci potřeba říct nahlas.';
});
register(roomBeatKey('the-other-side', 0, 4), 'v2', 'cs', (s: RunState) => {
  const id = s.prior?.endingId;
  if (!id) return 'Neví, jak jste odešli minule. Zdá se, že ani místnost si nepamatuje úplně všechno.';
  const title = ENDING_TITLE_BY_ID[id] ?? id;
  return `Ví i to, jak jste odešli — ani na to hrdý, ani se za to nestydí, což je nějak horší než obojí. „${title},“ řekne, jednou, plochým hlasem, a už to neopakuje.`;
});
