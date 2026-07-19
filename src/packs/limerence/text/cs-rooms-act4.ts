// Czech translation of LIMERENCE's Act IV room prose (beats, choice
// text/hint/outcome, field notes, plain-language explanations). Registered
// under version 'v2'. Follows the structural pattern established by Act I's
// src/packs/limerence/text/cs-rooms.ts, cs-rooms-act2.ts and
// cs-rooms-act3.ts — see CLAUDE.md's "Translating content" rule: every line
// here was translated against the room's actual beats and each choice's
// stakes, not word-for-word. Act IV is the finale — the checkout floor —
// and its cast has aged into whatever Act III left them: parents mid-
// separation, people confessing or not confessing, a guest handed the
// Porter's own ledger. The register stays as frank and unglamorous as Act
// III's, but with the specific gravity of an ending: less argument, more
// reckoning.
//
// The Porter's own first-person lines (he speaks directly in this act, more
// than in any other) are translated in the same unhurried, precise register
// used for him throughout the prior three acts (e.g. cs-rooms.ts's front
// desk lines) — never brisk, never sentimental.
//
// A handful of lines quote the player's own past choice back as first-person
// reported or direct speech ("I chose what I chose", "I was lonely years
// before anyone touched anyone", "I knew, and I chose not to know", "the
// person I stopped being in secret"). The English source never genders the
// protagonist, and Czech past-tense verbs must agree in gender; no earlier
// file in this pack established a convention for the player's own
// first-person past tense (searched — no precedent exists), so this file
// extends the same house convention already used for gender-ambiguous
// partner characters (Jules, Dana, Sam: default to the masculine form where
// agreement is unavoidable) to the player's own voice, for consistency.
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
import { choseIn, hasFlag } from '../../../engine/gameState';
import { mirrorUnlocked } from '../endingLogic';

/** Mirrors act4.ts's own flag lists — needed here only for the-kitchen-
 * table's opening beat, which branches on the same union checks. */
const YOURS_FLAGS = ['confessed-whole', 'crossed-at-the-conference', 'carried-alone', 'trickle-truth', 'stayed-the-third'];
const THEIRS_FLAGS = ['played-detective', 'chose-not-to-know', 'steadied-first'];

/** Mirrors act4.ts's own ACT1_ROOM_IDS — needed here only for the-unsent's
 * "to your 16-year-old self" letter, which looks up the player's first Act I
 * transcript entry. */
const ACT1_ROOM_IDS = [
  'the-read-receipt',
  'the-screenshot',
  'the-password',
  'the-party',
  'the-forward',
  'the-best-friends-girl',
  'the-summer-ends',
];

// ---------- The Kitchen Table ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-kitchen-table', 0, 0)]:
    'Kuchyně v 6:40 ráno. Na lednici dětská kresba, přidržená magnetkou ve tvaru jahody — ta magnetka je, nějak, jediná nosná věc v celé místnosti.',
  // beat 1 is a function beat — registered below via register().
  [roomBeatKey('the-kitchen-table', 0, 2)]:
    'Dvě židle, jeden stůl. Telefon leží mezi vámi displejem nahoru, teď už bezvýznamný — ať kdysi znamenal cokoli, přestal to znamenat.',
  [roomBeatKey('the-kitchen-table', 0, 3)]:
    'První věta toho, co bude dál, ještě nepadla, a ani jeden z vás si dnes ráno není jistý, kdo je na řadě ji říct.',
  [roomBeatKey('the-kitchen-table', 0, 4)]:
    'Čtyři budoucnosti sedí u stolu jako hosté, které nikdo nezval. Děti spí nahoře — jejich váha v domě se projevuje jako akustika: každé slovo tady si samo, automaticky, hlídá, jak nahlas si může dovolit znít.',
  [roomBeatKey('the-kitchen-table', 0, 5)]:
    'Vrátný (jen na okamžik, v zrcadle na chodbě): „Rána na nejvyšším patře jsou jediná část hotelu, do které nemůžu vstoupit. Recepce jen potvrzuje: ten stůl je nosný. Stavte na něm, nebo ho vykliďte. Unese obojí.“',
  [roomChoiceTextKey('the-kitchen-table', 'stay-for-them')]: 'Zůstaňte, kvůli dětem. Řekněte si to nahlas, navzájem.',
  [roomChoiceHintKey('the-kitchen-table', 'stay-for-them')]: 'Pakt, pojmenovaný na rovinu',
  // outcome 0 is a function beat — registered below via register().
  [roomChoiceOutcomeKey('the-kitchen-table', 'stay-for-them', 1)]:
    'To rozcestí je součástí téhle volby samotné, ne až za ní. Kterým směrem se to nakonec vydá, rozhodnou místnosti, které tohle ráno ještě neuvidí.',
  [roomChoiceTextKey('the-kitchen-table', 'separate-well')]: 'Rozejděte se, a věnujte všechno tomu, udělat to dobře.',
  [roomChoiceHintKey('the-kitchen-table', 'separate-well')]: 'Zármutek, prožitý za bílého dne',
  [roomChoiceOutcomeKey('the-kitchen-table', 'separate-well', 0)]:
    'Nedramatická katastrofa: logistika jako elegie. Celý jeden úder je prostě kalendář předávání dětí, a nějak je to ta nejtěžší část.',
  [roomChoiceOutcomeKey('the-kitchen-table', 'separate-well', 1)]:
    'To, co si děti odnesou, výzkum jasně ukazuje, se odvíjí od míry konfliktu — ne od kategorie „rozvedení“ nebo „spolu“. Zármutek, prožitý tady, za bílého dne, schválně.',
  [roomChoiceTextKey('the-kitchen-table', 'attempt-repair')]: 'Ta práce. Ne to slovo. Ta práce.',
  [roomChoiceHintKey('the-kitchen-table', 'attempt-repair')]: 'Začněte, bez záruky',
  [roomChoiceOutcomeKey('the-kitchen-table', 'attempt-repair', 0)]:
    'Žádná montáž, žádná záruka — místnost vykreslí jen první týden: vstupní formulář, první poctivou inventuru, aféru (ať už byla čí byla) zkoumanou jako poplašný signál, ne jen jako zločin.',
  [roomChoiceOutcomeKey('the-kitchen-table', 'attempt-repair', 1)]:
    'Poslední úder je druhé sezení, na které jste přišli. To je celé vítězství, jaké je dnes ráno k mání, a místnost nepředstírá, že je to víc.',
  [roomChoiceTextKey('the-kitchen-table', 'say-the-unsayable')]:
    'Řekněte tu jednu věc, kterou jste si oba nesli ještě dřív, než tohle všechno začalo.',
  [roomChoiceHintKey('the-kitchen-table', 'say-the-unsayable')]: 'Nejriskantnější dveře u tohohle stolu',
  // outcome 0 is a function beat — registered below via register().
  [roomChoiceOutcomeKey('the-kitchen-table', 'say-the-unsayable', 1)]:
    'Po té větě se význam každé další volby u tohohle stolu mění. Místnost tady končí, aniž by cokoli vyřešila — protože ta věta byla ta událost.',
  [roomChoiceTextKey('the-kitchen-table', 'place-the-unsent-letter')]: 'Položte na stůl neodeslaný dopis, pořád zapečetěný.',
  [roomChoiceHintKey('the-kitchen-table', 'place-the-unsent-letter')]: 'Dodatek k tomu, co už bylo odhaleno, ať je tohle ráno čí je',
  [roomChoiceOutcomeKey('the-kitchen-table', 'place-the-unsent-letter', 0)]:
    'Položíte ho mezi dva hrnky, pořád zapečetěný, teď už roky starý. Ať v něm stojí cokoli, patří na tenhle stůl víc, než patřil do šuplíku, ve kterém dosud žil.',
  [roomChoiceOutcomeKey('the-kitchen-table', 'place-the-unsent-letter', 1)]:
    'Ani jeden z vás ho zatím neotevře. To, že tam konečně je, viditelný, je samo o sobě dodatek ke všemu ostatnímu, co dnes ráno padlo.',
  [roomExplanationKey('the-kitchen-table', 0)]:
    'To, co výzkum o dětech a rozchodu doopravdy ukazuje, je konkrétní a neintuitivní: aktivní přísadou v tom, jak se dětem daří, je vystavení konfliktu, ne struktura rodiny — dobře zvládnutý rozchod spolehlivě předčí vysoce konfliktní, ale formálně neporušenou domácnost. Přerámování afér od Esther Perelové, jako poplašného signálu, ne jen zločinu, je užitečné a má reálné hranice, řečené tady na rovinu: poplašný signál vysvětluje, proč se něco stalo; neomlouvá to, a ten, kdo ho spustil, se pořád musí zodpovídat. „Zůstat kvůli dětem“ je skutečná, obhajitelná volba — pokud s sebou nese opravdový plán údržby, ne jen jedno rozhodnutí učiněné jednou u kuchyňského stolu a nikdy znovu neprobrané.',
  [roomNoteTitleKey('the-kitchen-table')]: 'Nosný stůl',
  [roomNoteThinkersKey('the-kitchen-table')]: 'Amato · Perel (2017)',
  [roomNoteBodyKey('the-kitchen-table')]:
    'Desetiletí výzkumu Paula Amata o dětech a rozvodu se sbíhají k jednomu zjištění nade všechny ostatní: **aktivní přísadou je vystavení konfliktu, ne struktura rodiny** — dětem v dobře zvládnutých rozdělených domácnostech se soustavně daří líp než dětem ve vysoce konfliktních, ale formálně neporušených. Populární předpoklad, že zůstat spolu je automaticky ta bezpečnější volba, data nepřežije. Perelové přerámování afér jako „úniku versus poplašného signálu“ sklidilo oprávněnou kritiku za to, jak snadno se dá zneužít k omlouvání ublížení; použité opatrně, tak, jak to bylo myšleno, jen vysvětluje — poplašný signál řekne, že něco v domě potřebuje pozornost, nikdy neomluví to, co se při jeho spuštění rozbilo. Skutečné prediktory úspěšné nápravy jsou napříč literaturou stavba, svědek a čas — ne jeden jediný, byť sebelepší rozhovor. Kresba na lednici přežije každou verzi tohohle rána. Rozhodněte, ve kterém ránu vyroste.',
});
register(roomBeatKey('the-kitchen-table', 0, 1), 'v2', 'cs', (s: RunState) => {
  const yours = YOURS_FLAGS.some((f) => hasFlag(s, f));
  const theirs = THEIRS_FLAGS.some((f) => hasFlag(s, f));
  if (yours && theirs)
    return 'Noc za vámi byla dlouhá a patřila vám oběma — to, co jste udělali vy, i to, co bylo uděláno vám a pak odhaleno. Ani jedna verze tu druhou dnes ráno neruší.';
  if (yours) return 'Noc za vámi byla dlouhá, a bylo na vás se z ní zodpovídat — to, co jste udělali, teď už celé, konečně, vyšlo najevo.';
  if (theirs)
    return 'Noc za vámi byla dlouhá, a zodpovídat se z ní bylo na tom druhém — to, co bylo uděláno vám, teď už celé, konečně, vyšlo najevo.';
  return 'Noc za vámi byla dlouhá, a všechno, co se dalo říct, už teď bylo aspoň jednou řečeno.';
});
register(roomChoiceOutcomeKey('the-kitchen-table', 'stay-for-them', 0), 'v2', 'cs', (s: RunState) =>
  hasFlag(s, 'already-gone')
    ? 'Ten pakt, popsaný poctivě: může být ušlechtilé lešení, nebo dvacetiletý odklad — a místnost nepředstírá, že neviděla, jak jste už odešli úplně všemi způsoby kromě dveří.'
    : 'Ten pakt, popsaný poctivě: pojmenovaný a pak znovu a znovu probíraný, může vydržet. Pojmenovaný a odložený k ledu se stane tichou katastrofou nějakého mnohem pozdějšího rána.',
);
register(roomChoiceOutcomeKey('the-kitchen-table', 'say-the-unsayable', 0), 'v2', 'cs', (s: RunState) =>
  hasFlag(s, 'already-gone')
    ? '„Věděl jsem to, a rozhodl jsem se nevědět“ — řečeno jako první, protože to byla pravda jako první. Nejriskantnější dveře v místnosti, otevřené tím, kdo už předtím potichu odešel.'
    : '„Byl jsem osamělý roky předtím, než se kdokoli kohokoli dotkl“ — řečeno, konečně, nahlas, u tohohle stolu, tomu člověku, o kterém to celou dobu bylo.',
);

// ---------- The Unsent ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-unsent', 0, 0)]:
    'Psací stůl na konci chodby. Jedna obálka. Za stolem Vrátný, v ruce drží něco jako mosazné dopisní váhy.',
  [roomBeatKey('the-unsent', 0, 1)]:
    'Dnes v noci odejde jedna zpráva. Nedorazí jako e-mail nebo telefonát — dorazí jako sen, jako náhlý popud, jako píseň, která se v přesně tu správnou chvíli rozezní v autorádiu.',
  [roomBeatKey('the-unsent', 0, 2)]:
    'Vrátný: „Stůl garantuje doručení. Negarantuje nic jiného — žádnou odpověď, žádné odpuštění, ani to, že to bude pochopeno tak, jak jste to mysleli. Jedna obálka. Vyberte adresu.“',
  [roomChoiceTextKey('the-unsent', 'to-the-one-you-hurt')]: 'Tomu, komu jste ublížili.',
  [roomChoiceHintKey('the-unsent', 'to-the-one-you-hurt')]: 'Náprava, bez žádosti o rozhřešení',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-you-hurt', 0)]:
    'Píšete ho dvakrát. První verze potichu žádá o odpuštění. Váhy ji odmítnou — ne krutě, jen přesně — dokud tu žádost neškrtnete.',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-you-hurt', 1)]:
    'Druhá verze je náprava bez připojené žádosti. Těžší se píše. Nějak lehčí se posílá.',
  [roomChoiceTextKey('the-unsent', 'to-the-one-who-hurt-you')]: 'Tomu, kdo ublížil vám.',
  [roomChoiceHintKey('the-unsent', 'to-the-one-who-hurt-you')]: 'Ne odpuštění — osvobození',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-who-hurt-you', 0)]:
    'Ne dopis odpuštění — místnost na tomhle rozlišení pečlivě trvá, a nakonec na něm trváte i vy.',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-who-hurt-you', 1)]:
    'Dopis, který ukončí větu „pořád mi to dlužíš“ tím, že roztrhá tu fakturu. Ne kvůli němu. Kvůli ruce, co ji celou dobu držela.',
  [roomChoiceTextKey('the-unsent', 'to-the-one-that-got-away')]: 'Tomu, kdo vám utekl.',
  [roomChoiceHintKey('the-unsent', 'to-the-one-that-got-away')]: 'Dopis, který se poctiví lidé bojí napsat',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-that-got-away', 0)]:
    'Dopis, kterého se poctiví lidé bojí, hlavně kvůli tomu, co by mohlo znamenat, že ho vůbec napsali.',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-that-got-away', 1)]:
    'Místnost povolí přesně jednu větu vřelosti navíc, za hranicí uzavření — ne víc — zváží ji, shledá ji upřímnou a pošle ji.',
  [roomChoiceTextKey('the-unsent', 'to-your-16-year-old-self')]: 'Svému šestnáctiletému já.',
  [roomChoiceHintKey('the-unsent', 'to-your-16-year-old-self')]: 'Nejlaskavější dveře v téhle místnosti',
  // outcome 0 is a function beat (single-element outcome) — registered below via register().
  [roomChoiceTextKey('the-unsent', 'to-your-own-kids-someday')]: 'Vlastním dětem, jednou.',
  [roomChoiceHintKey('the-unsent', 'to-your-own-kids-someday')]: 'Poučení složené do beletrie',
  [roomChoiceOutcomeKey('the-unsent', 'to-your-own-kids-someday', 0)]:
    'Zapečetěný. Datovaný. „Otevři, až budeš dost starý na to, být v místnostech, jako jsou tyhle.“',
  [roomChoiceOutcomeKey('the-unsent', 'to-your-own-kids-someday', 1)]:
    'Celý smysl dnešní noci, složený do obálky dost malé na to, aby se vešla do šuplíku, čekající na rok, který si zatím neumíte představit.',
  [roomChoiceTextKey('the-unsent', 'blank-page')]: 'Pošlete prázdnou stránku.',
  [roomChoiceHintKey('the-unsent', 'blank-page')]: 'I všechno nevyřčené pořád něco váží',
  [roomChoiceOutcomeKey('the-unsent', 'blank-page', 0)]: 'Nejtěžší obálka v celém stole. Nic na ní není napsáno.',
  [roomChoiceOutcomeKey('the-unsent', 'blank-page', 1)]:
    'Dorazí jako zaváhání ve dveřích — někdo se bezdůvodně zastaví a čtyři nevysvětlitelné vteřiny má pocit, že není sám. To je celé doručení.',
  [roomExplanationKey('the-unsent', 0)]:
    'Výzkum expresivního psaní, v tradici, kterou založil James Pennebaker, opakovaně nachází přínos psaní o těžkých zážitcích i ve chvíli, kdy si to napsané nikdy nikdo jiný nepřečte — naměřený efekt dopadá na toho, kdo píše, ne na adresáta. Tahle místnost bere to zjištění doslova: dopis záleží na tom, co s vámi udělá to, že ho píšete, a „uzavření“ se tu poctivě chápe jako něco, co se vyrábí samotným aktem psaní, ne jako něco, co na vás čeká hotové na konci.',
  [roomNoteTitleKey('the-unsent')]: 'Dopis, který stejně dorazí',
  [roomNoteThinkersKey('the-unsent')]: 'výzkum expresivního psaní (Pennebakerova linie)',
  [roomNoteBodyKey('the-unsent')]:
    'Desetiletí Pennebakerových studií o expresivním psaní zjistila něco, co lidová moudrost kolem „uzavření“ obvykle chápe obráceně: psaní neodeslaného dopisu měřitelně prospívá duševní pohodě toho, kdo píše, ať už se ten dopis nakonec přečte, nebo ne — a často bez ohledu na to, jestli je adresát vůbec naživu, aby si ho mohl přečíst. **Uzavření se v tomhle výzkumu vyrábí samotným psaním — ne objevuje tím, že konečně dostanete odpověď.** Na konkrétní adrese záleží míň než na samotném aktu napsat něco pravdivého a úplného a nechat to skončit. Tahle poznámka na okraji se píše sama — záznam do kodexu je přesně ta zpráva, kterou jste se doopravdy rozhodli poslat.',
});
register(roomChoiceOutcomeKey('the-unsent', 'to-your-16-year-old-self', 0), 'v2', 'cs', (s: RunState) => {
  const first = s.transcript.find((t) => ACT1_ROOM_IDS.includes(t.roomId));
  return first
    ? `Dolů skrz otvor na dopisy, čtyři patra dolů, až do Přízemí. Dorazí s citací jedné věci, kterou jste tehdy doopravdy řekli — „${first.choiceText}“ — přečtenou zpátky s něhou, jakou šestnáct let nikdy nemělo šanci slyšet.`
    : 'Dolů skrz otvor na dopisy, čtyři patra dolů, až do Přízemí. Dorazí jako přesně ta věta, kterou každý dospělý v tomhle hotelu potřeboval slyšet v šestnácti, napsaná jediným člověkem, který ji dokáže napsat.';
});

// ---------- The Morning Desk ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-morning-desk', 0, 0)]:
    'Zase hala, za dveřmi svítání. Vrátný má na pultu otevřenou vaši složku. Je tlustší, než si pamatujete, že jste ji napsali.',
  [roomBeatKey('the-morning-desk', 0, 1)]:
    'Vrátný: „Dobré ráno. Než vás pustím ven, nebo vás tu nechám, provedu krátký pohovor. Ne zkoušku. Audit. Celý tenhle pobyt jste odpovídali místnostem. Teď se já zeptám na ty odpovědi.“',
  // beats 2, 3 and 4 are function beats — registered below via register().
  [roomBeatKey('the-morning-desk', 0, 5)]:
    'Vrátný: „S tou poslední si dejte na čas. Všechno, co jste si na těchhle patrech zvolili — stojíte si za tím?“',
  [roomChoiceTextKey('the-morning-desk', 'stand-by-all')]: '„Ano. Za vším. Zvolil jsem, co jsem zvolil, a podepsal bych to znovu.“',
  [roomChoiceHintKey('the-morning-desk', 'stand-by-all')]: 'Důslednost, přiznaná jako vlastní',
  [roomChoiceOutcomeKey('the-morning-desk', 'stand-by-all', 0)]:
    'Vrátný: „Stálost. Vzácnější, než se prodává — většina hostů se aspoň jedné místnosti zřekne přesně ve chvíli, kdy se jich na to doopravdy zeptáte. Vy jste si podržel celou účetní knihu, včetně položek, které vás něco stály.“',
  [roomChoiceOutcomeKey('the-morning-desk', 'stand-by-all', 1)]:
    'Vrátný: „Poznamenávám, bez krutosti, že celá podepsaná účetní kniha může být integrita, nebo brnění. Z týhle strany pultu vypadají identicky. Zjistíte, čím z toho byla, později, v nějakou neplánovanou hodinu. Hosté to vždycky zjistí.“',
  [roomChoiceTextKey('the-morning-desk', 'name-what-changed-me')]:
    '„Ne — ne za vším. Dokážu vám přesně říct, co mě změnilo, a kde.“',
  [roomChoiceHintKey('the-morning-desk', 'name-what-changed-me')]: 'Růst, pojmenovaný a přiznaný jako vlastní',
  [roomChoiceOutcomeKey('the-morning-desk', 'name-what-changed-me', 0)]:
    'Pojmenujete tu místnost. Tu konkrétní. Ne náladu — důvod: něco, co jedno pozdější patro naučilo to dřívější.',
  [roomChoiceOutcomeKey('the-morning-desk', 'name-what-changed-me', 1)]:
    'Vrátného ruka se na účetní knize zastaví — a poprvé za celou noc si všimnete snubního prstenu na jeho pravé ruce, a bledého, neopáleného proužku tam, kde kdysi seděl prsten na levé. „To je odpověď, pro kterou tu jsem,“ řekne, aniž by zvedl oči. „Revize s účtenkami. Vzácnější, a lepší, než důslednost.“',
  [roomChoiceTextKey('the-morning-desk', 'some-rooms-i-wasnt-present-in')]:
    '„Něco z toho si sotva pamatuju, že jsem si vybral. Pro některé části tohohle jsem tu úplně nebyl.“',
  [roomChoiceHintKey('the-morning-desk', 'some-rooms-i-wasnt-present-in')]: 'Poctivá mezera',
  // outcome 0 is a function beat — registered below via register().
  [roomChoiceOutcomeKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 1)]:
    'Vrátný: „Dobrá tedy. Pohovor končí. Co zbývá, není otázka. Je to práh.“',
  [roomExplanationKey('the-morning-desk', 0)]:
    'Než se otevře práh, Vrátný proaudituje celý pobyt a zeptá se, jestli si za ním pořád stojíte — ne aby vás ohodnotil, ale aby zjistil, jestli jste upřímní ke svému vlastnímu příběhu. Ta skutečná otázka pod tím vším: je obdivuhodnější zůstat dokonale konzistentní s každou volbou, kterou jste kdy udělali, nebo říct na rovinu: „mýlil jsem se, a přesně tohle změnilo můj názor“? Výzkum narativní identity zachází s já jako s příběhem v neustálé, upřímné revizi — smyslem nikdy nebylo dorazit k pultu beze změny.',
});
register(roomBeatKey('the-morning-desk', 0, 2), 'v2', 'cs', (s: RunState) => {
  const screenshot = ['tell-nadia', 'confront-tom', 'stay-out', 'verify-first'].find((id) => choseIn(s, 'the-screenshot', id));
  if (screenshot === 'tell-nadia')
    return 'Vrátný: „Ten screenshot. Řekli jste to Nadie na rovinu a nechali následky dopadnout, kam dopadly — upřímně, i na vás. Stojíte si za tím i teď, tady, kdy Tom i Nadia jsou už dávno z týhle budovy pryč?“';
  if (screenshot === 'confront-tom')
    return 'Vrátný: „Ten screenshot. Dali jste Tomovi možnost volby jako prvnímu, s lhůtou. Dodrželi jste tu lhůtu, nakonec — a záleží teď vůbec na tom, jestli ano?“';
  if (screenshot === 'stay-out')
    return 'Vrátný: „Ten screenshot. Řekli jste, že to není vaše věc, a smazali jste ho. To tajemství se, pokud si vzpomínám, nastěhovalo místo toho k vám. Je tam pořád?“';
  if (screenshot === 'verify-first')
    return 'Vrátný: „Ten screenshot. Nejdřív jste si to ověřili, a při tom jste přišli o šanci být první, kdo řekne pravdu. Férová směna, nebo ne — to řekněte vy mně.“';
  return 'Vrátný: „Ty konkrétní dveře jste nikdy neotevřeli — ty se screenshotem uvnitř. Zajímavé. Zeptám se tedy na rovinu, bez inscenace: přítel nebo přítelkyně kamaráda, přistižení, ve vaší ruce, v telefonu, který není váš. Co doopravdy uděláte?“';
});
register(roomBeatKey('the-morning-desk', 0, 3), 'v2', 'cs', (s: RunState) =>
  hasFlag(s, 'confessed-whole')
    ? 'Vrátný: „To doznání — učiněné, celé, tomu, koho se týkalo. Tenhle druh upřímnosti je v týhle složce vzácnější, než si hosté rádi myslí. Stojíte si za cenou, kterou to od nich vyžádalo?“'
    : hasFlag(s, 'carried-alone')
      ? 'Vrátný: „To doznání — nesené, sami, celou cestu. Místnost ve vás, vedle které bude ten druhý žít, a do které nikdy nevstoupí. Bylo to milosrdenství doopravdy jeho, nebo jen vaše?“'
      : hasFlag(s, 'trickle-truth')
        ? 'Vrátný: „To doznání — kapalo, o kousek pravdivější pokaždé, když bylo zpochybněno. Složka ukazuje každou revizi. On, nebo ona, ucítili každou z nich.“'
        : 'Vrátný: „V týhle složce se neobjevuje žádné doznání. Buď žádné nebylo dlužné, nebo jedno pořád, dnes ráno, čeká na založení.“',
);
register(roomBeatKey('the-morning-desk', 0, 4), 'v2', 'cs', (s: RunState) =>
  s.memoryLost
    ? 'Vrátný: „Ta past, u Fámy. Zjistili jste, co udělala, a čím vás dělá to, že jste nastražili past na někoho, koho milujete. Ve vaší složce je díra tam, kde dřív bydlelo nevědění. Odsud ji vidím. Stálo to za to?“'
    : 'Vrátný: „V týhle složce žádná díra není — nevědění jste nikdy nevyměnili za jistotu. Někteří hosté tomu říkají důvěra. Jiní tomu říkají, že jste nikdy nebyli otestováni dost tvrdě na to, abyste to potřebovali. Já rozsudek nevynáším.“',
);
register(roomChoiceOutcomeKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 0), 'v2', 'cs', (s: RunState) =>
  s.memoryLost
    ? 'Vrátný: „Ve vašem případě to není vyhýbání. Je to dokumentace. Je ve vás skutečná díra, ve tvaru pasti, a odpovědi, které do ní spadly, nejsou zapřené — jen nedosvědčené. Mezery, za které se zaplatilo, uznávám. Ta vaše má účtenku.“'
    : 'Vrátný: „Hm. Vaše složka nevykazuje žádné pasti, žádné díry — všechny vzpomínky jsou přítomné; co chybí, je ochota se k nim postavit. „Nebyl jsem tu“ z neporušené složky je pohodlná mlha. Nechám to projít. Jsem pult, ne soudce. Ale oba jsme to slyšeli.“',
);

registerAll('v2', 'cs', {
  [roomBeatKey('the-morning-desk', 1, 0)]:
    'Mřížka — nebo cokoli to bylo, pult, zrcadlo, člověk — se usadí, a dveře haly se rozevřou do světla, které nepatří hotelu.',
  [roomBeatKey('the-morning-desk', 1, 1)]:
    'Venku je ráno. Doopravdy: někde auta, někde konvice, něčí obyčejná, obrovská starost, tři kroky odsud.',
  [roomBeatKey('the-morning-desk', 1, 2)]:
    'Vrátný: „Konečná. Nebo začátek — záleží, kterým směrem to čtete. Práh vás odvede zpátky, k hluku, k obličejům, k nedokončeným hádkám, ke všemu. Většina hostů si ho vybere. Je to dobré dveře. Dobře se o ně starám.“',
  [roomBeatKey('the-morning-desk', 1, 3)]:
    'Vrátný: „Ale nejsou to jediné dveře, které máte otevřené, a musím to říct. Můžete zůstat — místnosti vždycky potřebují někoho, kdo je bude spravovat, a já to dělám už opravdu dlouho. Nebo si tady u prahu můžete lehnout a nechat zbytek dnešní noci doznít, jemně. Někteří hosté si na konci vyberou ten klid. Není na mně, abych tomu říkal prohra.“',
  // beat 4 is a function beat — registered below via register().
  [roomChoiceTextKey('the-morning-desk', 'walk-out')]: 'Vyjděte ven. Zpátky do rána, do hluku, do světa.',
  [roomChoiceHintKey('the-morning-desk', 'walk-out')]: 'Návrat',
  [roomChoiceOutcomeKey('the-morning-desk', 'walk-out', 0)]:
    'Vykročíte ke světlu. Práh má přesně tu teplotu, jakou mívají letní dveře — ten poloviční stupeň rozdílu, který znamená venku.',
  [roomChoiceOutcomeKey('the-morning-desk', 'walk-out', 1)]:
    'Vrátný (volá za vámi): „Ať tam venku najdete cokoli — je to ten samý rozhovor, který jste opustili. To nikdy nebyl ten slib. Vy jste byli ta renovace. Pozor na schod.“',
  [roomChoiceTextKey('the-morning-desk', 'take-the-desk')]: 'Zůstaňte. Převezměte pult. Vrátného práci teď.',
  [roomChoiceHintKey('the-morning-desk', 'take-the-desk')]: 'Dohoda správce',
  [roomChoiceOutcomeKey('the-morning-desk', 'take-the-desk', 0)]:
    'Odvrátíte se od rána — doopravdy se odvrátíte, což hala zaznamená čímsi jako zatajeným dechem — a natáhnete ruku po účetní knize.',
  [roomChoiceOutcomeKey('the-morning-desk', 'take-the-desk', 1)]:
    'Vrátný (zatím ji nepodává): „Buďte si jistí. Hodiny jsou věčné, plat žádný, a hosté jsou — no, byli jste jedním z nich. Budete sledovat, jak každý z nich čelí telefonu, chodbě, stolu, a možná jim nikdy neřeknete odpovědi, hlavně proto, že žádné nejsou.“',
  [roomChoiceOutcomeKey('the-morning-desk', 'take-the-desk', 2)]:
    'Vrátný (podává ji — účetní kniha teplá, vaše jméno v ní najednou čitelné): „...Vítejte u pultu. První lekce: prsten a ten bledý proužek mají stejnou velikost. Je to schválně. Tady je schválně všechno.“',
  [roomChoiceTextKey('the-morning-desk', 'stop-carrying-it')]: 'Lehněte si u prahu. Nechte to doznít, jemně, za vlastních podmínek.',
  [roomChoiceHintKey('the-morning-desk', 'stop-carrying-it')]: 'Ten klid',
  [roomChoiceOutcomeKey('the-morning-desk', 'stop-carrying-it', 0)]:
    'Lehnete si, s ránem tři kroky odsud, a není to prohra — Vrátný to pozná, hala to pozná. Je to volba, učiněná s otevřenýma očima, někým, kdo prošel každým patrem, aby si právo ji udělat vydobyl.',
  [roomChoiceOutcomeKey('the-morning-desk', 'stop-carrying-it', 1)]:
    'Vrátný (posadí se vedle vás, odloží účetní knihu): „Pak tu zůstanu, dokud to nebude hotové. Na mé směně se žádný host nerozpouští sám. Víte, tohle není konec. Je to příliv.“',
  [roomChoiceTextKey('the-morning-desk', 'laughing-door')]: 'Ty malé dveře. Ten smích. Otevřete je.',
  [roomChoiceHintKey('the-morning-desk', 'laughing-door')]: 'Vydobyli jste si právo si toho všimnout',
  [roomChoiceOutcomeKey('the-morning-desk', 'laughing-door', 0)]:
    'Přejdete k malým prostým dveřím, a klika se otočí dřív, než ji doopravdy uchopíte, tak, jak otvírá kamarád z druhé strany.',
  [roomChoiceOutcomeKey('the-morning-desk', 'laughing-door', 1)]:
    'Vrátný (za vámi, a poprvé v jeho hlase není ani prsten, ani jeho nepřítomnost): „Málokterý host si těchhle dveří vůbec všimne. Ještě míň jich je otevře. Tak jděte. Já zhasnu.“',
  [roomChoiceTextKey('the-morning-desk', 'i-know-every-room')]: '„Znám každou místnost.“',
  [roomChoiceHintKey('the-morning-desk', 'i-know-every-room')]: 'Ne dveře — věta',
  [roomChoiceOutcomeKey('the-morning-desk', 'i-know-every-room', 0)]:
    'Nevykročíte k žádným dveřím. Místo toho to řeknete, tak, jak byste vyslovili fakt, ne přání — a to vyslovení už je většina toho, co se stane.',
  [roomChoiceOutcomeKey('the-morning-desk', 'i-know-every-room', 1)]: 'Vrátný strne, jednu ruku na účetní knize, a nedokončí ji zavírat.',
  [roomExplanationKey('the-morning-desk', 1)]:
    'Práh je otevřený, a ta volba je konečně o tom, jak tenhle pobyt doopravdy skončí: vrátit se zpátky do obyčejného života, zůstat a pomáhat dalšímu hostovi, nebo si dovolit úplný odpočinek. Žádné z toho není ten správný konec — každé je jiná, stejně upřímná odpověď na to, co doopravdy chcete, teď, po všem, co se stalo na těchhle patrech.',
  [roomNoteTitleKey('the-morning-desk')]: 'Složka přečtená zpátky',
  [roomNoteThinkersKey('the-morning-desk')]: 'výzkum narativní identity (McAdamsova linie) · vlastní účetní kniha hotelu',
  [roomNoteBodyKey('the-morning-desk')]:
    'Výzkumníci narativní identity — v čele s Danem McAdamsem — zachází s já ne jako s pevnou věcí, ale jako s příběhem v neustálém, aktivním autorství: kým jste, je z podstatné části vyprávění, které podáváte o tom, jak jste se sem dostali, a to vyprávění se dál přepisuje, jak se do něj dál žije. Vztahy jsou v tomhle pohledu spoluautorská vyprávění, a dovednost, kterou celý tenhle hotel učí, je právě ten audit: vlastnit celou složku, včetně stránek, které by člověk radši viděl ztracené nebo přepsané. **Každé patro, které tenhle pobyt inscenoval — potvrzení o přečtení, chodba, kuchyňský stůl — bylo jednou otázkou v různých místnostech: když se vám vaše složka přečte zpátky, je ten podpis váš?**',
});
register(roomBeatKey('the-morning-desk', 1, 4), 'v2', 'cs', (s: RunState) =>
  mirrorUnlocked(s)
    ? 'A jsou tu — všimnete si toho až teď, a chápete, že tohle si nevšimne každý — čtvrté dveře. Malé. Prosté. Zpoza nich: nalévají se dva hrnky a smích, který zní nezaměnitelně přesně jako ten váš.'
    : 'Někde stranou si napůl všimnete malých prostých dveří, o kterých jste si celkem jistí, že v hale při ubytování nebyly. Jsou zamčené. Zpoza nich, slabě: smích. Vrátný sleduje váš pohled. „Tentokrát ne,“ řekne jemně — zároveň rozsudek i pozvání vrátit se.',
);
