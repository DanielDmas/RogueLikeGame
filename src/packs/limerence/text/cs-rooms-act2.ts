// Czech translation of LIMERENCE's Act II room prose (beats, choice
// text/hint/outcome, field notes, plain-language explanations). Registered
// under version 'v2'. Follows the structural pattern established by Act I's
// src/packs/limerence/text/cs-rooms.ts — see CLAUDE.md's "Translating
// content" rule: every line here was translated against the room's actual
// beats and each choice's stakes, not word-for-word. Act II's cast is
// 18-24, adults in established or near-established relationships — a more
// settled, less teenage register than Act I, still frank and never
// clinical. Jules (the-distance through the-scoreboard's partner) is kept
// grammatically indeclinable and referred to via nominalized/present-tense
// constructions wherever the English leaves the character's gender
// unspecified, to preserve that same ambiguity in Czech; where a past-tense
// or dialogue-attributed verb genuinely cannot avoid gender agreement, this
// file defaults to the masculine form, matching the precedent already set
// in cs-rooms.ts (the-best-friends-girl's "žes to řekl mně a ne jí").
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

/** Mirrors act2.ts's own seedSplit — same deterministic 50/50 split on the
 * run's doorSeed, so a translated branch always matches the English branch
 * it's standing in for. */
function seedSplit(s: RunState): boolean {
  return ((s.doorSeed ?? 0) * 2654435761) % 2 === 0;
}

// ---------- The Distance ----------
register(roomBeatKey('the-distance', 0, 0), 'v2', 'cs', (s: RunState) =>
  s.flags.includes('promised-september')
    ? 'Vy a Jules jste dodrželi slib, který jste si dali v září. Osm měsíců dvou měst, jednoho kalendáře a telefonního účtu, o kterém se ani jeden z vás nezmiňuje.'
    : s.flags.includes('first-open')
      ? 'Vy a Jules pořád zjišťujete, co přesně znamenalo slovo „otevřený“ — po osmi měsících. To slovo unese víc, než kolik z vás dvou dokáže unést.'
      : 'Vy a Jules jste to dotáhli až do jara. Dvě města, jeden kalendář, vztah běžící se satelitním zpožděním, kterého si už ani jeden z vás nevšímá.',
);
registerAll('v2', 'cs', {
  [roomBeatKey('the-distance', 0, 1)]:
    'Včera večer, večírek. Alena — kamarádka jednoho kamaráda, bystrá, s níž se snadno mluví — byla centimetr od vašich úst, celou jednu vteřinu, než jste ucouvli.',
  [roomBeatKey('the-distance', 0, 2)]:
    'Nic se nestalo. Tu větu jste si dnes přehráli jedenáctkrát, jazykem jste ji ošťourávali jako zub, jestli v ní nejsou praskliny.',
  [roomBeatKey('the-distance', 0, 3)]:
    'To ucuknutí bylo skutečné. Ale skutečná byla, pod povrchem, i ta vteřina před ucuknutím — a místnost chce, abyste udrželi obojí najednou, místo abyste jedno z toho vyškrtli.',
  [roomBeatKey('the-distance', 0, 4)]:
    'Dnešní večerní hovor s Jules je naplánovaný, obyčejný, na obrazovce už otevřený. Máte třicet vteřin na rozhodnutí, co si do něj přinesete.',
  [roomBeatKey('the-distance', 0, 5)]:
    'Vrátný: Hosté řadí slovo „skoro“ buď mezi doznání, nebo mezi inventuru. To, kam ho zařadí, rozhodne, čím se stane.',
  [roomChoiceTextKey('the-distance', 'confess-the-near-miss')]: 'Řekněte Jules přesně, co se skoro stalo.',
  [roomChoiceHintKey('the-distance', 'confess-the-near-miss')]: 'Vylíčit celou tu vteřinu, beze škrtů',
  [roomChoiceOutcomeKey('the-distance', 'confess-the-near-miss', 0)]:
    'Těžký hovor — a dobrý. To, co Jules cítí, je opravdová bolest; ale pod ní, stejně opravdová, je i úleva ze svěřené pravdy, dokud to ještě nic nebylo.',
  [roomChoiceOutcomeKey('the-distance', 'confess-the-near-miss', 1)]:
    '„Díky, žes mi to řekl, dokud to ještě nic nebylo,“ řekne Jules nakonec. Ta věta vás oba něco stojí — a taky něco přináší.',
  [roomChoiceTextKey('the-distance', 'bury-it')]: 'Nic se nestalo. Není co říkat.',
  [roomChoiceHintKey('the-distance', 'bury-it')]: 'Nechat technickou pravdu zastoupit tu celou',
  [roomChoiceOutcomeKey('the-distance', 'bury-it', 0)]: 'Technicky vzato pravda. Hovor proběhne v pohodě, obyčejně, devadesát minut o ničem.',
  [roomChoiceOutcomeKey('the-distance', 'bury-it', 1)]: 'Zeď roste o jednu cihlu — nepovšimnutá tím, komu je čelem.',
  [roomChoiceTextKey('the-distance', 'soften-it')]: 'Řekněte upravenou verzi: „někdo se mnou flirtoval, bylo to trapné.“',
  [roomChoiceHintKey('the-distance', 'soften-it')]: 'Dát tomu tvar, ale ne obsah',
  [roomChoiceOutcomeKey('the-distance', 'soften-it', 0)]: 'Zabere to. Jules se zasměje, v klidu, a hovor jede dál.',
  [roomChoiceOutcomeKey('the-distance', 'soften-it', 1)]:
    'Zjemnělý příběh zabere tak dobře, že tu pravdivou verzi teď už nikdy nepůjde říct, aniž by to prozradilo, že ta předchozí byla upravená. Místnost tuhle aritmetiku nechá doznít a dá vám ji doopravdy pocítit.',
  [roomChoiceTextKey('the-distance', 'keep-visiting-almost')]: 'Rozhodněte se, že „skoro“ je místo, kam se dá vracet.',
  [roomChoiceHintKey('the-distance', 'keep-visiting-almost')]: 'Nechat popíratelnost být celým plánem',
  [roomChoiceOutcomeKey('the-distance', 'keep-visiting-almost', 0)]:
    'Není co doznávat, není co zahrabávat — dveře ke „skoro“ prostě necháte odemčené, schválně, a nezkoumáte proč.',
  [roomChoiceOutcomeKey('the-distance', 'keep-visiting-almost', 1)]:
    'Místnost vám poctivě přizná i to potěšení: to jiskření, tu věrohodnou popíratelnost. Zároveň si potichu poznamená, které dveře v tomhle hotelu se vám teď pravděpodobněji nabídnou.',
  [roomExplanationKey('the-distance', 0)]:
    'Postupná pravda — doznávání se v malých, sebeochranných splátkách místo najednou — se v danou chvíli zdá laskavější, ale pro důvěru je měřitelně horší než úplné odhalení i úplné mlčení: výzkum zrady opakovaně zjišťuje, že podvedení partneři hodnotí kapající revize jako škodlivější než samotnou původní událost, protože každý nový detail znovu otevírá ránu a dokazuje, že ta předchozí verze byla upravená. „Nic se nestalo“ a „není co říkat“ zní stejně a jsou to dvě různé věty — jedna popisuje událost, druhá popisuje rozhodnutí o tom, co se někdo jiný smí dozvědět.',
  [roomNoteTitleKey('the-distance')]: 'Upravené doznání',
  [roomNoteThinkersKey('the-distance')]: 'Shirley Glass (2003)',
  [roomNoteBodyKey('the-distance')]:
    'Výzkum odhalování od Glass je v jednom bodě jednoznačný: podvedení partneři soustavně hodnotí kapající revize — příběh, který je při každém zpochybnění o kousek pravdivější — jako horší než samotný původní čin, protože každá revize dokazuje, že ta předchozí verze byla úprava, ne popis. **Zdi se staví jednu popiratelnou cihlu po druhé; nikdo se jednoho dne nerozhodne postavit rovnou celou zeď.** Nezáleží tolik na velikosti tajemství jako na tom, jestli dveře zůstaly otevřené, nebo jen potichu, věrohodně, pootevřené. „Skoro“ je předměstí. Lidé tam dojíždějí.',

  // ---------- The Hall Pass ----------
  [roomBeatKey('the-hall-pass', 0, 0)]:
    'Jules to navrhne rozumně, velkoryse, u kávy: výjimky, dokud jste od sebe. Moderní. Bezpečné. Nikdo nikomu nepatří. Ten rámec je pečlivě zvolený a myšlený laskavě.',
  [roomBeatKey('the-hall-pass', 0, 1)]:
    'Váš žaludek odpoví dřív než ústa — malý, nezaměnitelný pokles, který přijde celé dvě vteřiny před čímkoli, čemu byste mohli říkat myšlenka.',
  [roomBeatKey('the-hall-pass', 0, 2)]:
    'Hned za tím přijdou nezvaně přídavná jména, kterých se bojíte: ulpívavý. Žárlivý. Mladý. Ne dost moderní. Stihnete je katalogizovat dřív, než jste se v čemkoli rozhodli.',
  [roomBeatKey('the-hall-pass', 0, 3)]:
    'Čemu by tu souhlas vlastně sloužil — klidu, image, nebo strachu, že kvůli „ne“ Jules ztratíte? Místnost trvá na tom, abyste to pojmenovali dřív, než odpovíte.',
  [roomBeatKey('the-hall-pass', 0, 4)]:
    'Vrátný: Recepce zpracovala deset tisíc dohod. Ty podepsané proto, aby se předešlo rozhovoru, přežijí ten rozhovor v průměru tak o týden.',
  [roomChoiceTextKey('the-hall-pass', 'agree-to-keep-peace')]: 'Řekněte ano, abyste nevypadali malicherně.',
  [roomChoiceHintKey('the-hall-pass', 'agree-to-keep-peace')]: 'Předstírat lehkost, kterou necítíte',
  [roomChoiceOutcomeKey('the-hall-pass', 'agree-to-keep-peace', 0)]: 'To ano koupí opravdu dobrý týden. Jules je vřelý, vděčný, s úlevou.',
  [roomChoiceOutcomeKey('the-hall-pass', 'agree-to-keep-peace', 1)]:
    'Ta dohoda ve vás sedí jako spolknuté sklo. O pár týdnů později Jules zmíní — jednou větou, bez detailů — že se dohoda využila. Váš obličej udělá něco, co sami neuvidíte.',
  [roomChoiceTextKey('the-hall-pass', 'true-no')]: 'Řekněte to skutečné ne. Ať jdou ta přídavná jména k čertu.',
  [roomChoiceHintKey('the-hall-pass', 'true-no')]: 'Dovolit si znít přesně tak nemoderně, jak je potřeba',
  [roomChoiceOutcomeKey('the-hall-pass', 'true-no', 0)]:
    'Jules je překvapený, a pak — s malým zpožděním — viditelně ulevený, že má skutečnou odpověď místo divadla.',
  [roomChoiceOutcomeKey('the-hall-pass', 'true-no', 1)]:
    'Konečně proběhne rozhovor, za který ten návrh sloužil jako náhrada: co s vámi oběma skutečně dělá „odloučení“. Jedna upřímná hádka. Pak lepší počasí.',
  [roomChoiceTextKey('the-hall-pass', 'counter-with-need')]: '„Tohle je to, co doopravdy potřebuju, dokud jsme od sebe.“',
  [roomChoiceHintKey('the-hall-pass', 'counter-with-need')]: 'Vyjednávat potřeby, ne povolení',
  [roomChoiceOutcomeKey('the-hall-pass', 'counter-with-need', 0)]:
    'Rozhovor, který následuje, je pomalejší a lepší, než by bylo prosté ano nebo ne.',
  [roomChoiceOutcomeKey('the-hall-pass', 'counter-with-need', 1)]:
    'To, co postavíte, je menší než nabízený „dárek“ — ale je to doopravdy vaše: potřeby na stole místo rozdávaných povolení.',
  [roomChoiceTextKey('the-hall-pass', 'take-it-angrily')]: 'Vezměte si propustku, kterou jste nechtěli, a použijte ji, abyste se dopředu vyrovnali.',
  [roomChoiceHintKey('the-hall-pass', 'take-it-angrily')]: 'Utratit dárek ze zlosti',
  [roomChoiceOutcomeKey('the-hall-pass', 'take-it-angrily', 0)]:
    'Samotnou noc místnost záměrně vynechá — práh, sestřih. Zůstává ráno potom, a počty, které se v něm dělají.',
  [roomChoiceOutcomeKey('the-hall-pass', 'take-it-angrily', 1)]:
    'Použili jste cizího člověka a skulinu v pravidlech k potrestání někoho, kdo vám to ráno ve skutečnosti ještě nic neudělal.',
  [roomExplanationKey('the-hall-pass', 0)]:
    'Výzkumníci studující konsenzuální nemonogamii opakovaně nacházejí ostrý rozdíl mezi dohodami, které jsou vyjednané — postavené na vyslovených potřebách, opakovaně revidované, doopravdy chtěné — a těmi, na které se přistoupí, aby se předešlo konfliktu nebo dojmu nejistoty. Dohody uzavřené ze strachu se z hlediska dopadu na duševní pohodu blíží spíš nevěře než otevřenosti, bez ohledu na to, co bylo technicky odsouhlaseno. „Tohle nechci“ je úplná věta; ve dvaceti, obklopeni kulturou, která váhání kóduje jako nezralost, tak ale málokdy působí.',
  [roomNoteTitleKey('the-hall-pass')]: 'Podepsáno pod tlakem počasí',
  [roomNoteThinkersKey('the-hall-pass')]: 'Conley · Moors (výzkum CNM)',
  [roomNoteBodyKey('the-hall-pass')]:
    'Výzkum konsenzuální nemonogamie je poctivý oběma směry: spokojenost a důvěra vycházejí srovnatelně s monogamními vztahy *tam, kde jsou dohody svobodně vyjednané* — doopravdy chtěné, ne jen strpěné. Tentýž výzkum stejně jasně ukazuje, že dohody uzavřené ze strachu vypadat žárlivě, ulpívavě nebo nemoderně mají na duševní pohodu dopad podobný nevěře, ať papírově souhlasí cokoli. **Souhlas, který je předstíraný, a souhlas, který je cítěný, mohou vypadat přes stůl úplně stejně — a přinést naprosto odlišné roky.** Dárek, který podle vašeho pocitu nemůžete odmítnout, není dárek. Je to faktura, která přijde později, položka po položce.',

  // ---------- The Rebound ----------
});
register(roomBeatKey('the-rebound', 0, 0), 'v2', 'cs', (s: RunState) =>
  s.flags.includes('let-it-drift') || s.flags.includes('end-clean')
    ? 'Tři týdny od chvíle, kdy to s Jules definitivně skončilo — potichu, přesně tak, jak se k tomu už nějakou dobu schylovalo. Mira přišla rychleji, než jste čekali, že cokoliv může přijít.'
    : 'Tři týdny od chvíle, kdy to s Jules skončilo — náhle, z vaší strany, čistěji, než to tehdy působilo. Mira přišla rychleji, než jste čekali, že cokoliv může přijít.',
);
registerAll('v2', 'cs', {
  [roomBeatKey('the-rebound', 0, 1)]:
    'Mira je milá, vtipná, naprosto nestřežená. Dnes večer si u vašeho umyvadla čistí zuby, jako by to už byl zvyk, a zeptá se: „mám tu prostě — jeden nechat?“',
  [roomBeatKey('the-rebound', 0, 2)]:
    'Uděláte si inventuru toho, co doopravdy cítíte, a poctivá odpověď zní: šum. Vděčnost. Obrys tam, kde by měl být pocit — vykreslený, ale nevyplněný.',
  [roomBeatKey('the-rebound', 0, 3)]:
    'Jules se vetře dovnitř — jeden úder, mimovolný, nezvaný — uprostřed věty, uprostřed Miry, a zmizí stejně rychle, jak se objevil.',
  [roomBeatKey('the-rebound', 0, 4)]:
    'Mira nahlas řekne, co pro ni tohle je, naprosto upřímně, naprosto bezbranná. Nic nepředstírá. Právě to to dělá horším.',
  [roomBeatKey('the-rebound', 0, 5)]:
    'Vrátný: Room service hlásí jednoho hosta, který objednává pro dva, a jednoho hosta, který jí u téhož stolu sám. Stává se to častěji, než byste čekali.',
  [roomChoiceTextKey('the-rebound', 'tell-her-what-this-is')]: 'Vyslovte tu větu o anestezii, nahlas, dnes večer.',
  [roomChoiceHintKey('the-rebound', 'tell-her-what-this-is')]: 'Pojmenovat, čím pro vás teď je',
  [roomChoiceOutcomeKey('the-rebound', 'tell-her-what-this-is', 0)]:
    'Nejlaskavější krutost, jaká je na tomhle patře k mání. Mirin obličej se mění v reálném čase, jak ta věta dopadá.',
  [roomChoiceOutcomeKey('the-rebound', 'tell-her-what-this-is', 1)]:
    'Co udělá dál — jestli zůstane, s vědomím, nebo odejde — místnost nechává úplně na ní. Nikdy nebylo na vás, abyste to za ni rozhodli; bylo jen na vás, abyste to umožnili.',
  [roomChoiceTextKey('the-rebound', 'let-her-believe')]: 'Neříkejte nic. Zůstaňte vřelí.',
  [roomChoiceHintKey('the-rebound', 'let-her-believe')]: 'Nechat příběh, ať se napíše sám',
  [roomChoiceOutcomeKey('the-rebound', 'let-her-believe', 0)]:
    'Měsíce uplynou v jediném zadrženém nádechu. Pak: její „miluju tě“, které přijde uprostřed obyčejného úterý, naprosto bezbranné.',
  [roomChoiceOutcomeKey('the-rebound', 'let-her-believe', 1)]:
    'Místnost zamrzne na vašem nádechu a tam záměrně sestřihne. Ten dluh vždycky nesl úrok; tohle je jen chvíle, kdy dorazí výpis.',
  [roomChoiceTextKey('the-rebound', 'end-it')]: 'Ukončete to, dřív, než ji to bude stát víc.',
  [roomChoiceHintKey('the-rebound', 'end-it')]: 'Zastavit to, dokud je cena ještě malá',
  [roomChoiceOutcomeKey('the-rebound', 'end-it', 0)]: 'Pláče a děkuje vám v rozmezí stejných deseti minut — zármutek a úleva sdílejí stejný nádech.',
  [roomChoiceOutcomeKey('the-rebound', 'end-it', 1)]:
    'Zármutek se vám pak vrátí na plnou hlasitost, bez místa, kam ho uložit. Hluk, který anestezie maskovala, konečně dorazí naplno.',
  [roomChoiceTextKey('the-rebound', 'try-to-catch-up')]: 'Zkuste v sobě vypěstovat to, co cítí ona.',
  [roomChoiceHintKey('the-rebound', 'try-to-catch-up')]: 'Vydupat pocit ze země',
  [roomChoiceOutcomeKey('the-rebound', 'try-to-catch-up', 0)]: 'Upřímná snaha, poctivě vylíčená.',
});
register(roomChoiceOutcomeKey('the-rebound', 'try-to-catch-up', 1), 'v2', 'cs', (s: RunState) =>
  seedSplit(s)
    ? 'Tentokrát to skutečně vyjde. Někde v tom snažení začne pod povrchem růst něco opravdového — místnost si tohle nechává jako opravdovou vzácnost: chtít něco cítit je někdy skoro totéž jako už to cítit.'
    : 'Tentokrát se to neujme. Samotné snažení se stane svým vlastním malým, soukromým zármutkem — místnost je upřímná ohledně šancí: v jednadvaceti tohle někdy vyjde a někdy ne, a předem se nedozvíte, které z toho čeká zrovna vás.',
);
registerAll('v2', 'cs', {
  [roomExplanationKey('the-rebound', 0)]:
    'Vztahy na odrazovém můstku nejsou paušálně škodlivé — výzkum ukazuje smíšené výsledky, a některé lidem opravdu pomůžou zotavit se rychleji a úplněji, než by pomohla izolace. Zdokumentovaným zraněním není samotný odrazový vztah; je to asymetrie informací uvnitř něj, když jedna strana reguluje pocit a druhá věří, že ho buduje. „Nikdy jsem nic neslíbil“ je pravda a samo o sobě to nestačí — informovaný souhlas je hranice mezi tím, používat někoho jako anestezii, a tím, že jsou to prostě dva lidé, kteří spolu zjišťují, co tohle vlastně je.',
  [roomNoteTitleKey('the-rebound')]: 'Anestezie s tepem',
  [roomNoteThinkersKey('the-rebound')]: 'výzkum vztahů na odraz · etika asymetrie',
  [roomNoteBodyKey('the-rebound')]:
    'To, co výzkum vztahů na odraz doopravdy ukazuje, je smíšenější než lidová moudrost: zotavení může být rychlejší, výsledky mohou být opravdu dobré, a rozšířené přesvědčení, že „nejdřív musíte být sami“, nemá jako obecné pravidlo pevnou oporu. **Dělicí čára není v načasování — je v tom, jestli mají oba stejnou informaci o tom, co tohle je.** Konkrétní riziko odrazového vztahu není v tom, že přišel příliš brzy; je v tom, že jedna strana ho používá jako regulaci, zatímco druhá věří, že něco buduje, a jen jedna z nich ví, co je pravda. Ti laskaví lidé jsou vybíráni právě proto, že unesou váhu. Není to náhoda a automaticky to není zločin — ale je to dluh, a dluhy jednou splatíte.',

  // ---------- The Unicorn ----------
  [roomBeatKey('the-unicorn', 0, 0)]:
    'Erik a Maja — pět let spolu, krásný byt, vřelost tak nacvičená, že působí samozřejmě — vás pozvou na večeři, a pak si vás pozvou dovnitř. Jako svou třetí osobu.',
  [roomBeatKey('the-unicorn', 0, 1)]:
    'Ta nabídka je opravdová, stejně jako přitažlivost; místnost nepředstírá, že by jedno nebo druhé bylo prázdné. Sledujete jejich choreografii, jak ji předvádějí: kdo se koho dotkne, kdo se komu podívá do obličeje, než promluví.',
  [roomBeatKey('the-unicorn', 0, 2)]:
    'Pravidla byla sepsána dřív, než jste vůbec existovali, a předkládají se skoro jako zalaminovaná: žádné rande jen ve dvou. Žádné přespávání ve všední dny. „My jsme na prvním místě“ — řečeno laskavě, a naprosto bezvýhradně.',
  [roomBeatKey('the-unicorn', 0, 3)]:
    'Co za to dostanete, poctivě přiznáno: sounáležitost, žár, plnou pozornost dvou lidí upřenou najednou na vás. Místnost tohle nechává cítit se přesně tak dobře, jak to má cítit.',
  [roomBeatKey('the-unicorn', 0, 4)]:
    'První, malá trhlina: Majin obličej, přesně na jednu vteřinu, ve chvíli, kdy se Erik moc dlouho směje něčemu, co jste řekli.',
  [roomBeatKey('the-unicorn', 0, 5)]: 'Vrátný: Apartmá 3 si každých pár měsíců objedná přistýlku. Přistýlka si nikdy nevybírá pokoj.',
  [roomChoiceTextKey('the-unicorn', 'obey-the-rules')]: 'Přijměte podmínky přesně tak, jak jsou napsané.',
  [roomChoiceHintKey('the-unicorn', 'obey-the-rules')]: 'Podepsat, co leží na stole',
  [roomChoiceOutcomeKey('the-unicorn', 'obey-the-rules', 0)]:
    'Tři dobré měsíce, stlačené do dvou úderů — vřelé, snadné, přesně podle nabídky.',
  [roomChoiceOutcomeKey('the-unicorn', 'obey-the-rules', 1)]:
    'Pak přijde pravidlo, které jste nikdy neviděli, uplatněné zpětně dvěma lidmi, kteří ta pravidla sami sepsali. Zjistíte, že má opravný list, který dostávají jen oni.',
  [roomChoiceTextKey('the-unicorn', 'renegotiate')]: '„Přepište pravidla se mnou v místnosti, nebo nepodepisuju.“',
  [roomChoiceHintKey('the-unicorn', 'renegotiate')]: 'Trvat na tom, být stranou dohody',
  [roomChoiceOutcomeKey('the-unicorn', 'renegotiate', 0)]: 'Skutečná zkouška toho, jestli „rovnocenné“ bylo vůbec někdy míněno doopravdy.',
});
register(roomChoiceOutcomeKey('the-unicorn', 'renegotiate', 1), 'v2', 'cs', (s: RunState) =>
  seedSplit(s)
    ? 'K jejich cti — opravdové, vydřené cti — vyjednávání probíhá přímo před vámi a vzejde z něj něco jako skutečná charta. Není dokonalá. Je ale poprvé opravdu i vaše.'
    : 'Vyjednávání zamrzne, zdvořile, v prostoru mezi „samozřejmě“ a jakoukoli skutečnou změnou. Nabídka se nestáhne. Prostě se tiše přestane obnovovat — zjistíte, co „rovnocenné“ znamenalo, podle toho, co se stalo, když jste o to požádali písemně.',
);
registerAll('v2', 'cs', {
  [roomChoiceTextKey('the-unicorn', 'discover-we-come-first')]: 'Zůstaňte až do noci, kdy se Maja rozpláče — a zjistěte, co ta hierarchie znamená.',
  [roomChoiceHintKey('the-unicorn', 'discover-we-come-first')]: 'Nechat si to pravidlo vyučit na vlastní kůži',
  [roomChoiceOutcomeKey('the-unicorn', 'discover-we-come-first', 0)]:
    'Taxík ve dvě ráno, vylíčený v plné síle: vy, narychlo oblečení, a za vámi dveře, které se už zavírají, už se hojí kolem těch dvou.',
  [roomChoiceOutcomeKey('the-unicorn', 'discover-we-come-first', 1)]:
    '„My jsme na prvním místě“ přestane být větou na zalaminované stránce a stane se něčím, co pochopíte tělem, naráz, ve dvě ráno, v taxíku.',
  [roomChoiceTextKey('the-unicorn', 'decline-kindly')]: 'Odmítněte. Laskavě pojmenujte proč.',
  [roomChoiceHintKey('the-unicorn', 'decline-kindly')]: 'Zvolit nevyšlapanou cestu, s grácií',
  [roomChoiceOutcomeKey('the-unicorn', 'decline-kindly', 0)]:
    'Nevyšlapaná cesta, ušlá s grácií místo dramatu. Erik a Maja jsou na oplátku milí, a trochu zklamaní, a i to smí být pravda.',
  [roomChoiceOutcomeKey('the-unicorn', 'decline-kindly', 1)]:
    'Objevují se pak zbytkem patra z odstupu — pořád okouzlující, pořád nacvičení, na tom, čeho si všimnete, že je jejich čtvrtá přistýlka.',
  [roomExplanationKey('the-unicorn', 0)]:
    'Výzkum „párového privilegia“ v nemonogamních uspořádáních strukturálně rozlišuje mezi hierarchií, která je oznámená předem, a hierarchií, která se teprve odhaluje — rozdíl mezi poctivou mapou a padacími dveřmi. Třetí osoby nesou v „jednorožčích“ uspořádáních skutečné, dobře zdokumentované strukturální riziko: pravidla sepsaná dřív, než přijdou, vymáhaná jednostranně, revidovatelná jen párem samotným. Nic z toho neznamená, že rovnocenná trojice je nemožná — výzkum je k opravdové, vyjednané nemonogamii férový — znamená to, že „rovnocenné“ je tvrzení, které musí přežít zkoušku, ne jen být vysloveno.',
  [roomNoteTitleKey('the-unicorn')]: 'Přistýlka',
  [roomNoteThinkersKey('the-unicorn')]: 'výzkum CNM dynamiky „jednorožců“ (Moors, Conley a další)',
  [roomNoteBodyKey('the-unicorn')]:
    'Výzkum „lovu na jednorožce“ — zavedených párů hledajících společnou třetí osobu — dokumentuje soustavný vzorec: pravidla sepsaná dřív, než třetí osoba přijde, hierarchie oznámená jako formalita místo vyjednané jako skutečná struktura, a asymetrie nákladů na odchod (pár zůstává párem; třetí odchází sám). Užitečné rozlišení, které výzkum nabízí, je mezi páry, které se *otevírají* — opravdu se přestavují tak, aby zahrnuly další rovnocenný hlas — a páry, které *získávají* — přidávají osobu do nezměněné struktury. **Rovnost na papíře a hierarchie v kuchyni nejsou v rozporu. Je to tak, jak ten vzorec obvykle funguje.** Opravdu rovnocenné trojice existují a jsou taky zdokumentované; poznávacím znamením je, jestli třetí osoba smí pomáhat psát pravidla, nebo je smí jen odsouhlasit.',

  // ---------- Just Friends ----------
  [roomBeatKey('just-friends', 0, 0)]:
    'Alena. Spolužačka na učení, společné vtípky, ta, které řeknete věci jako první. Jules dostane shrnutí vašeho týdne; Alena dostane koncept, bez úprav, tak jak se to zrovna děje.',
  [roomBeatKey('just-friends', 0, 1)]:
    'Nic se nestalo. Místnost vás přesto žádá, abyste to „nic“ rozepsali po položkách: místo, které jí bezmyšlenkovitě šetříte, kávu, kterou znáte nazpaměť, dobrou noc v 23:40, která se mezitím stala nosnou konstrukcí.',
  [roomBeatKey('just-friends', 0, 2)]:
    'Srovnání, ke kterému vás místnost donutí, vedle sebe: co Jules ví o vašem týdnu právě teď, a co už Alena věděla do oběda.',
  [roomBeatKey('just-friends', 0, 3)]:
    'Důkazy z telefonu, procházené způsobem, jakým se prochází vyšetřovací spis — časová razítka jako svá vlastní tichá forma úzkosti, nic v nich není explicitní, a přesto všechno nějak usvědčuje.',
  [roomBeatKey('just-friends', 0, 4)]:
    '„Jsme jen kamarádi,“ řeknete, nikomu konkrétnímu, a místnost se potichu, přesně zeptá, komu jste to vlastně říkali.',
  [roomBeatKey('just-friends', 0, 5)]: 'Vrátný: Architektura nikdy nelže. Zeptejte se jen: kterým směrem jsou okna?',
  [roomChoiceTextKey('just-friends', 'open-window')]: 'Řekněte Jules o Aleně — všechno, včetně žebříčku.',
  [roomChoiceHintKey('just-friends', 'open-window')]: 'Nechat dovnitř plné světlo',
  [roomChoiceOutcomeKey('just-friends', 'open-window', 0)]:
    'Rozhovor je hrozný, a krátký, a zeď padá cihlu po slyšitelné cihle, zatímco tam pořád ještě oba sedíte.',
  [roomChoiceOutcomeKey('just-friends', 'open-window', 1)]:
    'Alena, které nikdo nic neřekl, si za týden všimne úplně všeho. Skutečné přátelství se přizpůsobí na svou správnou míru, za skutečnou, pojmenovanou cenu.',
  [roomChoiceTextKey('just-friends', 'nothing-to-tell')]: 'Nechte ji ve složce „není co říkat“.',
  [roomChoiceHintKey('just-friends', 'nothing-to-tell')]: 'Chránit kategorii, ne jen tajemství',
  [roomChoiceOutcomeKey('just-friends', 'nothing-to-tell', 0)]: 'Složka houstne o jeden večer na každý úder, každý zvlášť obhajitelný.',
  [roomChoiceOutcomeKey('just-friends', 'nothing-to-tell', 1)]:
    'Místnost to uzavírá tím, že se Glassové aritmetika stane viditelnou: okno teď hledí na Alenu. Zeď teď hledí na Jules. Nikdo si tohle nevybral v jediném konkrétním dni — a přesně takhle se to dělá.',
  [roomChoiceTextKey('just-friends', 'test-the-evening')]: 'Zorganizujte s Alenou jeden večer, který by mohl dopadnout tak i tak.',
  [roomChoiceHintKey('just-friends', 'test-the-evening')]: 'Schválně to nechat popiratelné',
  [roomChoiceOutcomeKey('just-friends', 'test-the-evening', 0)]: 'Ten večer, v reálném čase, otevřeně — místnost nezjemňuje, co to je, jen kde to končí.',
  [roomChoiceOutcomeKey('just-friends', 'test-the-evening', 1)]:
    'Přijde ten práh, a místnost sestřihne na vaší ruce na klice dveří. Co se stalo, se uloží, s nedotčenou nejednoznačností, aby si to poslední brána mohla znovu přečíst.',
  [roomChoiceTextKey('just-friends', 'name-it-set-boundary')]: 'Pojmenujte to Aleně nahlas a hranici stanovte sami.',
  [roomChoiceHintKey('just-friends', 'name-it-set-boundary')]: 'Říct pravdivou větu osobě, které se týká',
  [roomChoiceOutcomeKey('just-friends', 'name-it-set-boundary', 0)]:
    '„Tohle se stává tím, čemu lidi říkají nic“ — řečeno jí do očí, ne odbyto v hlavě natrénovanou verzí.',
  [roomChoiceOutcomeKey('just-friends', 'name-it-set-boundary', 1)]:
    'Její odpověď je taky upřímná, a něco stojí. Méně káv. Lepší spánek. Jedno přátelství, zachráněné ve své správné velikosti.',
  [roomExplanationKey('just-friends', 0)]:
    'Kontrolní seznam „citové nevěry“, který výzkumníci doopravdy používají, se netýká tolik jedné konkrétní události jako vzorce: přesměrované energie, tajnůstkářství (byť mírného), a soukromého žebříčku toho, kdo se co dozví jako první. „Nikdy jsme se nedotkli“ odpovídá na otázku, kterou v místnosti nikdo doopravdy nekladl. Obraz oken a zdí stojí za to nést si i mimo tenhle hotel — intimita je architektonická: ať už vztah dostane průhlednost, má okno, a ať už dostane zamlčení, má zeď — bez ohledu na to, který z nich byste nazvali tím „skutečným“ vztahem.',
  [roomNoteTitleKey('just-friends')]: 'Zdi a okna',
  [roomNoteThinkersKey('just-friends')]: 'Shirley Glass, Not Just Friends (2003)',
  [roomNoteBodyKey('just-friends')]:
    'Hlavní zjištění z desetiletí klinické práce od Glass je, že většina nevěr — citových i jiných — začíná mezi lidmi, kteří by o sobě řekli „jsme jen kamarádi“ až do chvíle, kdy by to řekli naposledy, aniž by kdy vědomě naplánovali ten přechod. **Aktivní přísadou je tajnůstkářství, ne přitažlivost; přitažlivost je běžná a většinou neškodná, tajnůstkářství je to, co ji přemění.** Její obraz architektury přežil konkrétní výzkum, ze kterého vzešel, protože je prostě přesný: vztah má okno (co se otevřeně sdílí s partnerem) a nevyhnutelně i zeď (co se nesdílí) — a další dva lidé ve vašem životě vždycky stojí na jedné nebo druhé straně, ať jste je tam chtěli postavit, nebo ne. Okno a zeď váží úplně stejně. Liší se jen umístění.',
});

// ---------- The Ex ----------
register(roomBeatKey('the-ex', 0, 0), 'v2', 'cs', (s: RunState) =>
  s.flags.includes('set-the-trap')
    ? 'Sara — ta Sara, kterou jste před čtyřmi lety a jedním celým životem nastražili do pasti, abyste dostali odpověď — napíše ve 23:51: „udělala jsem chybu.“ Pořád přesně víte, co vás stálo zjistit, co udělala.'
    : 'Sara — ta Sara z přízemí, teď už čtyři roky pryč — napíše ve 23:51: „udělala jsem chybu.“',
);
registerAll('v2', 'cs', {
  [roomBeatKey('the-ex', 0, 1)]:
    'S Jules jste šťastní. Většinou. Slovo „většinou“ přijde samo od sebe, nezvané, a necháte ho tam být, místo abyste ho vyškrtli.',
  [roomBeatKey('the-ex', 0, 2)]:
    'Archiv se otevře sám od sebe — každá vzpomínka na Saru nasvícená zlatou hodinkou, upravená kurátorem, který zjevně strávil čtyři roky tichým mazáním nejhorších scén.',
  [roomBeatKey('the-ex', 0, 3)]:
    'Místnost obnoví chybějící scény, jednu po druhé, tak, jak se znovu otvírá vyšetřovací spis v chattamovském stylu: hádky, mlčení, důvody, proč to doopravdy skončilo — předložené jako důkazy, ne shrnuté.',
  [roomBeatKey('the-ex', 0, 4)]: 'Jules je ve vedlejší místnosti, směje se něčemu v televizi, naprosto netuší, že tahle zpráva vůbec existuje.',
  [roomBeatKey('the-ex', 0, 5)]: 'Vrátný: Minulost píše ty nejlepší reklamní texty v celé budově. Nikdy se nezmíní, proč je prázdná.',
  [roomChoiceTextKey('the-ex', 'reread-everything')]: 'Otevřete celý archiv. Ve dvě ráno.',
  [roomChoiceHintKey('the-ex', 'reread-everything')]: 'Nechat se propadnout úplně na dno',
  [roomChoiceOutcomeKey('the-ex', 'reread-everything', 0)]:
    'Spirála, poctivě vylíčená: nic se neodešle, všechno se rozvíří, čtyři roky vybraného zlatého světla přehraná na plný jas.',
  [roomChoiceOutcomeKey('the-ex', 'reread-everything', 1)]:
    'Následují tři dny, kdy potichu a nespravedlivě srovnáváte Jules s někým, kdo — jak vám místnost právě podrobně ukázala — ve skutečnosti nikdy neexistoval.',
  [roomChoiceTextKey('the-ex', 'answer-her')]: 'Odepište. Jen si popovídat.',
  [roomChoiceHintKey('the-ex', 'answer-her')]: 'Znovu otevřít dveře, na které máte čtyři roky vypěstovaný reflex',
  [roomChoiceOutcomeKey('the-ex', 'answer-her', 0)]:
    '„Jen si popovídat“ s někým, na koho máte čtyři roky vypěstovaný reflex, se nakonec neukáže jako neutrální čin.',
  [roomChoiceOutcomeKey('the-ex', 'answer-her', 1)]:
    'Místnost ukončí tu výměnu záměrně uprostřed vřelosti, kurzor bliká — rozhovor ještě není zradou ničeho, ale ani ještě není ničím.',
  [roomChoiceTextKey('the-ex', 'block')]: 'Zablokujte. Obě aplikace. Ještě dnes večer.',
  [roomChoiceHintKey('the-ex', 'block')]: 'Zavřít dveře, které jste už jednou zavřeli',
  [roomChoiceOutcomeKey('the-ex', 'block', 0)]: 'Čisté, chladné, a — na tom místnost trvá — opravdu zarmoucené, ne jen účelné.',
  [roomChoiceOutcomeKey('the-ex', 'block', 1)]:
    'Ukáže se, že blokováním zavíráte dveře i verzi sebe sama, ne jen Saře. Ochrana a ztráta přicházejí zároveň.',
  [roomChoiceTextKey('the-ex', 'tell-jules')]: 'Podejte Jules telefon: „napsala Sara.“',
  [roomChoiceHintKey('the-ex', 'tell-jules')]: 'Nechat okno hledět správným směrem',
  [roomChoiceOutcomeKey('the-ex', 'tell-jules', 0)]:
    'Okno místo zdi. Ať už je strach na straně Jules jakýkoli, řeší se na otevřeném vzduchu, ne osamoceně ve vaší hlavě.',
  [roomChoiceOutcomeKey('the-ex', 'tell-jules', 1)]:
    'Ať už se nakonec odešle jakákoli odpověď, pokud vůbec nějaká, sepíší ji dva lidé společně — přesně to, co čtyři roky kurátorování archivu nikdy nedokázaly.',
  [roomExplanationKey('the-ex', 0)]:
    'Staré lásky se znovu ozývají z opravdu různorodých důvodů — vlastní recidivy limerence, osamělosti, skutečné změny na jejich straně — a všechny tři jsou dost často pravdivé na to, aby se nemělo předpokládat jediné vysvětlení. Co je dobře zdokumentované, je idealizovaná paměť: mozek spolehlivě vymazává bolestivé detaily z pozitivních vzpomínek na vztah rychleji, než vymazává ty dobré — zkreslení, kterému se někdy říká růžová retrospektiva. Užitečná diagnostická otázka nezní „cítím pořád něco“ — zní „chybí mi konkrétně ona, nebo mi chybí být dvacetiletý“.',
  [roomNoteTitleKey('the-ex')]: 'Kurátor',
  [roomNoteThinkersKey('the-ex')]: 'Fisher · výzkum paměťového zkreslení',
  [roomNoteBodyKey('the-ex')]:
    'Práce Helen Fisherové o neurochemii lásky zjistila, že odměňovací okruh aktivovaný starým partnerem se může znovu rozjet při obnoveném kontaktu — a to je fakt o mozkové chemii, ne rozsudek o vztahu. Odděleně od toho výzkumníci paměti opakovaně dokumentují růžovou retrospektivu — pozitivní zážitky se časem vzpomínají příznivěji, než byly hodnoceny v danou chvíli, zatímco negativní detaily blednou nejrychleji ze všeho. **Muzeum je krásné proto, že někdo, aniž by se k tomu kdy vědomě rozhodl, zamkl skladovací místnosti.** Co doopravdy předpovídá úspěšné shledání s bývalým partnerem, je úzké a konkrétní — skutečné, prozkoumané důvody, proč vztah skončil, teď opravdu jinak — a to je mnohem menší kategorie než „pořád na ni myslím“.',

  // ---------- The Confession ----------
  [roomBeatKey('the-confession', 0, 0)]:
    'Let domů, rozepsaný po položkách způsobem, jakým teď místnost rozepisuje všechno: palubní lístek, místo u okna, zkoušky věty, kterou jste ještě nevyslovili.',
  [roomBeatKey('the-confession', 0, 1)]:
    'Přídavná jména se sama, nezvaně, řadí do pořadí: jednou. Opilý. Pryč. Bezvýznamné. Každé z nich pravdivé, a dohromady žádné z nich úplně nepokrývá, co se stalo na té konferenci.',
  [roomBeatKey('the-confession', 0, 2)]:
    'Jules u přílety — nestřežený, rád vás vidí, celá ta obyčejná radost, kterou vám místnost nechá dopadnout v plné váze, schválně, protože tím chce ztížit to, co přijde dál.',
  [roomBeatKey('the-confession', 0, 3)]:
    'Ten kámen: kde doopravdy leží (těsně pod hrudní kostí), kolik váží konkrétně ve tři ráno (víc, než váží v kteroukoli jinou hodinu).',
  [roomBeatKey('the-confession', 0, 4)]:
    'Oba argumenty, podané v plné síle, žádný z nich neodbytý: doznání jako právo Jules na pravdu o vlastním životě, proti doznání jako vaše úleva, přenesená na někoho, kdo si tu tíhu nevyžádal.',
  [roomBeatKey('the-confession', 0, 5)]:
    'Vrátný: Hosté se ptají, která volba je poctivá. Recepce vždycky dokázala odpovědět jen na to, která je těžší, a pro koho.',
  [roomChoiceTextKey('the-confession', 'confess')]: 'Řekněte Jules všechno, teď, celé.',
  [roomChoiceHintKey('the-confession', 'confess')]: 'Položit celý kámen naráz',
  [roomChoiceOutcomeKey('the-confession', 'confess', 0)]:
    'Rozhovor, zblízka: záplava, hodina otázek bez dobrých odpovědí, oba na gauči, dokud se nezmění barva oblohy.',
  [roomChoiceOutcomeKey('the-confession', 'confess', 1)]:
    'Žádný rozsudek nad vztahem — to je počasí pro jiné patro. Kámen se přesune z vaší hrudi do prostoru mezi vámi, což je zároveň lepší, a dnes večer vůbec ne lepší.',
  [roomChoiceTextKey('the-confession', 'carry-it')]: 'Nikdy to neříkejte. Noste to sami, navždy.',
  [roomChoiceHintKey('the-confession', 'carry-it')]: 'Vzít na sebe tíhu, aby ji nemusel nést nikdo jiný',
  [roomChoiceOutcomeKey('the-confession', 'carry-it', 0)]:
    'Nejsilnější argument, který tahle hra pro mlčení nabízí: chránit Jules před bolestí, která by sloužila jen vašemu vlastnímu svědomí, ne jeho blahu.',
  [roomChoiceOutcomeKey('the-confession', 'carry-it', 1)]:
    'Jeho celoživotní cena, poctivě vylíčená: místnost ve vás, vedle které bude Jules roky žít a do které nikdy nebude vpuštěn.',
  [roomChoiceTextKey('the-confession', 'trickle')]: 'Přiznejte zjemnělou verzi.',
  [roomChoiceHintKey('the-confession', 'trickle')]: 'Dát Jules část pravdy',
  [roomChoiceOutcomeKey('the-confession', 'trickle', 0)]:
    'To kapání začíná dnes večer, a místnost vám přesně ukáže, kam vede: tři budoucí revize, každá z nich stojí víc, než by stála celá pravda, řečená dnes najednou.',
  [roomChoiceTextKey('the-confession', 'let-it-surface')]: '„Vyjde to najevo samo“ — tedy nikdy, tedy v tu nejhorší možnou chvíli.',
  [roomChoiceHintKey('the-confession', 'let-it-surface')]: 'Přenechat rozhodnutí náhodě',
  [roomChoiceOutcomeKey('the-confession', 'let-it-surface', 0)]:
    'Místnost tuhle strategii poctivě pojmenuje nahlas: tohle je přenechání rozhodnutí náhodě, aby cokoli, co se stane, mohlo působit jako počasí, ne jako volba, kterou jste udělali.',
  [roomChoiceOutcomeKey('the-confession', 'let-it-surface', 1)]:
    'Někde dál na tomhle patře se telefon, který se rozsvítí ve špatnou chvíli, může ukázat jako ten váš.',
  [roomExplanationKey('the-confession', 0)]:
    'Debata o tom, jestli se přiznat k nevěře, je mezi výzkumníky a terapeuty doopravdy nerozhodnutá, a nejsilnější argumenty na obou stranách si zaslouží být vyslyšeny v plné síle: odhalení jako respekt k právu partnera na pravdu, na které je postavený jeho skutečný život, proti doznání jako vina přenesená na někoho, kdo si tu tíhu nikdy nevyžádal. Průzkumy mezi podvedenými partnery se přiklánějí k tomu, že chtějí vědět, ale to zjištění je slabé, vychýlené vlastním výběrem a nemělo by se brát jako rozsudek. Dobře podložené je Perelové pozorování, že ten, kdo drží tajemství, drží nad vztahem druh moci, se kterým druhá strana nikdy nesouhlasila.',
  [roomNoteTitleKey('the-confession')]: 'Čí je to úleva',
  [roomNoteThinkersKey('the-confession')]: 'debata o sobeckém doznání · Esther Perel (2017)',
  [roomNoteBodyKey('the-confession')]:
    'Obě linie zaslouží zde poctivé slyšení. Jedna linie výzkumu a klinických názorů tvrdí, že partneři mají nárok na pravdu o životě, který doopravdy žijí, tečka — že zatajit ji, byť s dobrým úmyslem, je rozhodnutí učiněné o někom bez jeho souhlasu. Druhá tvrdí, že doznání může fungovat jako přenos viny: úleva pro toho, kdo se přiznává, zaplacená bolestí někoho, kdo si tu transakci ničím nezasloužil. Perelové formulace protíná obě: **„ten, kdo drží tajemství, drží moc“ — a ta nerovnováha moci existuje bez ohledu na to, jestli je tajemství někdy nahlas vysloveno.** Tahle hra tu debatu neřeší, a otevřeně to říká: kámen je skutečný tak jako tak. Jediná skutečná volba je kapsa.',

  // ---------- The Other Side of the Door ----------
  [roomBeatKey('the-other-side-of-the-door', 0, 0)]:
    'Viktor je ženatý. Věděli jste to už při třetí kávě, a přesto jste zůstali i na čtvrtou. Teď už osm měsíců: hotelová odpoledne, jen ve všední dny, jeho telefon vždycky obrácený displejem dolů na nočním stolku.',
  [roomBeatKey('the-other-side-of-the-door', 0, 1)]:
    'Samotné odpoledne, otevřené a vřelé — místnost nepředstírá, že je to prázdné nebo čistě transakční. Ať je to cokoli dalšího, je to zároveň i skutečné, pro vás oba, v místnosti, kde se to odehrává.',
  [roomBeatKey('the-other-side-of-the-door', 0, 2)]:
    'Pravidla, která jste se naučili, aniž by vás je kdy někdo učil: nikdy nevolat po šesté. Žádný parfém, který by bylo cítit ještě u výtahu. Celé nepsané osnovy, vstřebané prostě tím, že jste je žili.',
  [roomBeatKey('the-other-side-of-the-door', 0, 3)]:
    '„Já jsem žádné sliby nedával,“ říkáte, a místnost vás žádá, abyste tu větu doopravdy prozkoumali, ne ji jen opakovali — je pravdivá, a sama o sobě nikdy nic nevyřešila.',
  [roomBeatKey('the-other-side-of-the-door', 0, 4)]:
    'Ta zeď. Její hlas, skrz ni — objednává room service, směje se něčemu v televizi. Nikdy neviděná. Trvale slyšitelná. Místnost drží ten úder o jeden nádech déle, než je příjemné.',
  [roomBeatKey('the-other-side-of-the-door', 0, 5)]: 'Vrátný: Recepce má pro ten pokoj zaregistrované tři hosty. Klíče má vždycky jen pro dva.',
  [roomChoiceTextKey('the-other-side-of-the-door', 'continue')]: 'Ponechte si ta odpoledne. Ponechte si tu větu.',
  [roomChoiceHintKey('the-other-side-of-the-door', 'continue')]: 'Nechat to potichu stát se součástí vašeho života',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'continue', 0)]:
    'Poctivost v časosběru: roční období plynou ve čtyřech úderech, dohoda potichu tuhne, nepovšimnutá, do skutečné architektury vašeho života.',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'continue', 1)]:
    'Poslední obraz místnosti: váš vlastní telefon, teď taky obrácený displejem dolů, ze zvyku, přestože si — s odstupem — všimnete, že se na něj vlastně nikdo nedívá.',
  [roomChoiceTextKey('the-other-side-of-the-door', 'end-it')]: 'Ukončete to, aniž byste ho žádali, aby si vybral.',
  [roomChoiceHintKey('the-other-side-of-the-door', 'end-it')]: 'Odejít čistě, za vlastních podmínek',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'end-it', 0)]:
    'Konec, který nikdo nesleduje a za který vám nikdo nepoděkuje — odepřený zármutek, otevřeně pojmenovaný místností, protože kolem není nikdo jiný, kdo by ho pojmenoval.',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'end-it', 1)]: 'Nejčistší možný odchod, jaký je na tomhle patře k mání. Přesto, nápadně, ne čistý.',
  [roomChoiceTextKey('the-other-side-of-the-door', 'tell-her')]: 'Řekněte to jeho manželce.',
  [roomChoiceHintKey('the-other-side-of-the-door', 'tell-her')]: 'Dát jí volbu, kterou jste jí zatajovali',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'tell-her', 0)]: 'Detonace, poctivě vylíčená jako ambivalentní: pravdu si zasloužila, jednoznačně.',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'tell-her', 1)]:
    'Ta pravda ale zároveň přichází ve tvaru zbraně, a jsou na ní vaše otisky. Místnost odmítá za vás ohodnotit váš motiv — jen se vás jednou, potichu, zeptá, čím doopravdy byl.',
  [roomChoiceTextKey('the-other-side-of-the-door', 'demand-choice')]: '„Ona, nebo já. Do pátku.“',
  [roomChoiceHintKey('the-other-side-of-the-door', 'demand-choice')]: 'Vynutit rozhodnutí, které nebylo na vás vynucovat',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'demand-choice', 1)]:
    'Naučí vás to stejnou lekci, jakou by přinesla obě odpovědi: čím jste pro něj byli, bylo nakonec vždycky jen na něm samotném.',
});
register(roomChoiceOutcomeKey('the-other-side-of-the-door', 'demand-choice', 0), 'v2', 'cs', (s: RunState) =>
  seedSplit(s)
    ? 'Přijde pátek. Viktor si vybere vás — a místnost vás nechá v reálném čase procítit přesně to, co tahle volba vypovídá o muži, který dokázal tak snadno rozdělit dva životy do šuplíků.'
    : 'Přijde pátek. Viktor si vás nevybere — a místnost vás nechá v reálném čase procítit přesně to, co tahle volba vypovídá o muži, který dokázal tak snadno rozdělit dva životy do šuplíků.',
);
registerAll('v2', 'cs', {
  [roomExplanationKey('the-other-side-of-the-door', 0)]:
    'Poctivá etická mapa tady má několik různých linií, a místnost po vás chce, abyste je udrželi všechny najednou: sliby zavazují toho, kdo je dal, ne toho, kdo je nedal — ale vědomé umožňování cizího podvádění je vlastní, samostatná položka, kterou první fakt automaticky neomlouvá. Výzkum „lovu na zadané partnery“ zkoumá přesně tenhle trojúhelník a zjišťuje, že skutečné náklady dopadají i na třetí stranu — izolaci z tajnůstkářství, konce bez veřejného truchlení, nikoho, komu by se dalo zavolat. Moc a informace v těchto uspořádáních jen zřídka bývají rovné: jedna strana obvykle riskuje manželství; druhá obvykle riskuje něco méně viditelného, a podle výzkumu neméně skutečného.',
  [roomNoteTitleKey('the-other-side-of-the-door')]: 'Účetní kniha třetí osoby',
  [roomNoteThinkersKey('the-other-side-of-the-door')]: 'výzkum „lovu na zadané partnery“ · odepřený zármutek',
  [roomNoteBodyKey('the-other-side-of-the-door')]:
    'Výzkum „lovu na zadané partnery“ se čím dál víc zaměřuje na zkušenost samotného „lovce“, ne jen páru, a zjištění komplikují jakýkoli jednoduchý příběh o padouchovi: skutečně investovaný čas, skutečná izolace způsobená utajováním, a konce bez veřejného postavení, ze kterého by se dalo truchlit — vzorec, kterému výzkumníci říkají odepřený zármutek, ztráta, kterou nikdo nesmí uznat, protože samotný vztah nikdy nesměl být uznán. **Odpovědnost tu není otázkou všechno, nebo nic.** Sliby zavazují toho, kdo je dal. Vědomá účast na jejich porušení je samostatná, skutečná volba s vlastní vahou. Zeď je tenká. To nikdy nebylo tajemství pro nikoho na žádné z jejích stran.',

  // ---------- The Scoreboard (gate) ----------
  [roomBeatKey('the-scoreboard', 0, 0)]:
    'Zeptali jste se Jules na to číslo. Jules řekl pravdu. Teď to číslo bydlí ve vaší hrudi a v noci počítá: jména, která nezná, hotelové pokoje, které si samo zařizuje, srovnání, která si inscenuje bez vyžádání.',
});
register(roomBeatKey('the-scoreboard', 0, 1), 'v2', 'cs', (s: RunState) =>
  s.flags.includes('tested-almost') || s.flags.includes('ran-the-test')
    ? 'Ten vzorec vtíravých úderů už znáte — místnost ho taky pozná a řekne to nahlas: je to stejná aritmetika, která vás jednou v noci už nenechala spát, jen s jiným číslem.'
    : 'Ten vpád přichází podle rozvrhu, který jste si nikdy nenastavili: jméno, dohad, scéna, kterou vaše mysl postaví nevyžádaně a pak vás donutí ji sledovat.',
);
registerAll('v2', 'cs', {
  [roomBeatKey('the-scoreboard', 0, 2)]:
    'Hala se přeskupí, židle do řad, recepce v soudcovskou lavici — svolané slyšení. Vrátný vezme do ruky stolní lampu jako kladívko, kterým nikdy doopravdy nebyla.',
  [roomBeatKey('the-scoreboard', 0, 3)]:
    'Obžalovaný, přečtený do protokolu: všechno, co Jules kdy s kýmkoli udělal, ještě předtím, než jste se vůbec potkali.',
  [roomBeatKey('the-scoreboard', 0, 4)]:
    'Vaše vlastní číslo, vzaté pod přísahu jako svědek proti obžalovanému, aniž by se ho kdy někdo zeptal, jestli chce svědčit.',
  [roomBeatKey('the-scoreboard', 0, 5)]:
    'Vrátný: Soud bere na vědomí, že obžalovaný předchází žalobci. Soud tohle bere na vědomí při každém jednání, které kdy vedl.',
  [roomChoiceTextKey('the-scoreboard', 'prosecute')]: 'Podrobte minulost křížovému výslechu: data, souvislosti, detaily.',
  [roomChoiceHintKey('the-scoreboard', 'prosecute')]: 'Vyžádat si úplný popis, znovu',
  [roomChoiceOutcomeKey('the-scoreboard', 'prosecute', 0)]: 'Na každou otázku přijde odpověď. Každá odpověď stojí přesně jednu noc spánku.',
  [roomChoiceOutcomeKey('the-scoreboard', 'prosecute', 1)]:
    'Rozsudek, když nakonec přijde, zprošťuje viny — minulost nespáchala žádný zločin — a náklady na tohle stíhání jsou, nápadně, nevratné. Jules celou dobu, od začátku do konce, sledoval, jak tohle potřebujete.',
  [roomChoiceTextKey('the-scoreboard', 'dismiss-with-prejudice')]: 'Zamítněte případ. A myslete to vážně.',
  [roomChoiceHintKey('the-scoreboard', 'dismiss-with-prejudice')]: 'Nechat to číslo přestat být důkazem',
  [roomChoiceOutcomeKey('the-scoreboard', 'dismiss-with-prejudice', 0)]:
    'Ne potlačení — zamítnutí s nahlas přečtenými důvody: osoba, které to číslo patřilo, už neexistuje; ta, která existuje, si vybrala vás.',
  [roomChoiceOutcomeKey('the-scoreboard', 'dismiss-with-prejudice', 1)]:
    'Vpády se na povel nezastaví, a místnost je upřímná v tom, že se nezastaví. Postupně je ale přestanete sami přivolávat.',
  [roomChoiceTextKey('the-scoreboard', 'testify-against-yourself')]: 'Postavte se sami na svědeckou lavici kvůli vlastnímu dvojímu metru.',
  [roomChoiceHintKey('the-scoreboard', 'testify-against-yourself')]: 'Dát do protokolu i své vlastní číslo',
  [roomChoiceOutcomeKey('the-scoreboard', 'testify-against-yourself', 0)]:
    'Nejodvážnější krok celého slyšení: vaše číslo a jeho, přečtená vedle sebe, ve stejné místnosti, stejně nahlas.',
  [roomChoiceOutcomeKey('the-scoreboard', 'testify-against-yourself', 1)]:
    'Asymetrie citu — že vás jeho číslo trápí víc, než vás trápí to vaše — se pojmenuje přesně tak, jak je. Soud se odročí bez rozsudku, protože ten případ nikdy doopravdy nebyl o obžalovaném.',
  [roomChoiceTextKey('the-scoreboard', 'ask-what-verdict-frees')]: 'Zeptejte se soudu, jaký rozsudek by vás doopravdy osvobodil.',
  [roomChoiceHintKey('the-scoreboard', 'ask-what-verdict-frees')]: 'Položit tu těžší otázku',
  [roomChoiceOutcomeKey('the-scoreboard', 'ask-what-verdict-frees', 0)]:
    'Ticho. Pak Vrátný, jemně: „Žádný. Žádné číslo, v žádném směru, ještě nikdy hosta nezprostilo viny za jeho vlastní představivost.“',
  [roomChoiceOutcomeKey('the-scoreboard', 'ask-what-verdict-frees', 1)]: 'Vyřčeno nahlas to něco uvolní. Ze zasedací síně je zase hala, židle zpátky tam, kam patří.',
  [roomExplanationKey('the-scoreboard', 0)]:
    'Retroaktivní žárlivost — úzkost z partnerovy minulosti, ne z jeho současného chování — je rozpoznaný vzorec, a ve svých nejtěžších podobách vykazuje rysy, které se klinicky překrývají s obsedantně-kompulzivní poruchou: vyhledávání ujištění, dolování detailů a myšlenkové kompulze, které úzkost zmírní na pár minut a do večera ji zase doplní. Výzkum sexuálního dvojího metru zjišťuje, že funguje potichu i u lidí, kteří by ho jako vyslovené přesvědčení odmítli — stejný fakt se hodnotí jinak podle toho, čí minulosti patří. Co podle odborné léčebné literatury doopravdy pomáhá, není víc informací; hledání jistoty je palivem tohoto vzorce, a přístupy založené na přijetí fungují výrazně lépe než ujišťování.',
  [roomNoteTitleKey('the-scoreboard')]: 'Soud bez zproštění viny',
  [roomNoteThinkersKey('the-scoreboard')]: 'výzkum retroaktivní žárlivosti · sexuální dvojí metr',
  [roomNoteBodyKey('the-scoreboard')]:
    'Ve svých nejtěžších podobách vykazuje retroaktivní žárlivost rysy, které kliničtí odborníci rozpoznávají obecně z obsedantně-kompulzivních projevů: vtíravé představy, kompulzivní vyhledávání ujištění a úlevu, která nikdy nevydrží déle než do dalšího vpádu. **Hledání jistoty je potravou tohoto vzorce, ne jeho lékem — každá zodpovězená otázka znovu doplní hlad po další.** Sexuální dvojí metr se v datech objevuje i u lidí, kteří by ho jako vyslovenou hodnotu odmítli: stejný fakt, založený jinak podle toho, čí minulosti patří. Co podle odborné léčebné literatury doopravdy pomáhá, je práce založená na přijetí, ne další data — naučit se unést nevědění, místo abyste se ho snažili vyslechnout pryč. Každý host, který vstoupí do téhle zasedací síně, přichází přesvědčený, že jeho případ je výjimkou. Zápis o jednání, zatím, tvrdí opak.',
});
