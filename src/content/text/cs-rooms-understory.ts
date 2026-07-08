// Czech translation of the v2 Act V (understory) room prose (beats, choice
// text/hint/outcome, field notes) for: the-archive, the-unchosen, the-echo.
// Registered under version 'v2'. See cs-rooms.ts for the established pattern
// this file follows. NOTE: each room's RunState-dependent beats (the
// exhibit card, the unchosen-doors list/opener, the echo's voice/junction/
// ending lines) are functions — those live in cs-dynamic.ts, not here.
import { registerAll } from '../../engine/text/resolver';
import {
  roomBeatKey,
  roomChoiceHintKey,
  roomChoiceOutcomeKey,
  roomChoiceTextKey,
  roomNoteBodyKey,
  roomNoteThinkersKey,
  roomNoteTitleKey,
} from '../../engine/text/keys';

// ---------- Act V: The Archive ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-archive', 0, 0)]: 'Po schodišti, které tu nemá co dělat, dolů do dlouhé, nízké místnosti lemované identickými šedými krabicemi — celou stěnou jich, každá popsaná rukou příliš úhlednou, než aby patřila někomu jinému než samotnému zařízení.',
  [roomBeatKey('the-archive', 0, 1)]: 'Jedna police nese jedinou, novější krabici: vaši. Je označena datem, které poznáváte jako konec, a pod ním, menším písmem: DOKONČENO. ZALOŽENO. NEZAPOMENUTO.',
  [roomBeatKey('the-archive', 0, 2)]: 'Na čtecím stole vedle ní je jedna krabice už otevřená — někdo, nebo něco, to zvolilo dřív, než jste dorazil — a uvnitř karta, napsaná na stroji, citující jediný okamžik z cesty, kterou jste už dokončil.',
  [roomBeatKey('the-archive', 0, 4)]: 'Sešitý ke krabici, formulář stále nese popis, který jste kdysi dal sám sobě: „{blurb}“ Zařízení to založilo bez komentáře, což je buď úcta, nebo chyba v evidenci; odsud vypadají obě stejně.',
  [roomBeatKey('the-archive', 0, 5)]: 'Uvaděč: (ze dveří, klobouk pod paží) Sem dolů nechodím často. Není to zakázáno — nic tady není zakázáno — je to prostě tak, že většina poutníků sem chce zajít nanejvýš jednou. Archivu je to jedno. Nemá kam jinam jít.',
  [roomChoiceTextKey('the-archive', 'stand-by-it')]: '„To jsem byl já. Přiznám se k tomu — ke všemu.“ Podepište kartu sám, pod tiskem.',
  [roomChoiceHintKey('the-archive', 'stand-by-it')]: 'Přiznejte se — ten nejtěžší druh podpisu.',
  [roomChoiceOutcomeKey('the-archive', 'stand-by-it', 0)]: 'Vezmete pero přivázané k polici a podepíšete se pod strojově psaný řádek, svou vlastní rukou, kterou krabice zjevně očekávala.',
  [roomChoiceOutcomeKey('the-archive', 'stand-by-it', 1)]: 'Uvaděč: Ne každý poutník podepisuje. Většina si kartu přečte, ucukne, a odstoupí, jako by inkoust mohl být ještě dost čerstvý na to, aby se dal změnit. Vy jste připojil své jméno k rozhodnutí, které se už stalo. Nevím, co to stojí. Vím, že to není nic.',
  [roomChoiceTextKey('the-archive', 'disown-it')]: '„To už nezní jako já.“ Nechte kartu nepodepsanou a ustupte od krabice.',
  [roomChoiceHintKey('the-archive', 'disown-it')]: 'Ať je ten odstup skutečný, ne jen pohodlný.',
  [roomChoiceOutcomeKey('the-archive', 'disown-it', 0)]: 'Necháte kartu přesně tak, jak jste ji našel, a uděláte jeden celý krok zpět od police, tak jako byste ustoupil od cizince, který náhodou nosí stejnou velikost kabátu.',
  [roomChoiceOutcomeKey('the-archive', 'disown-it', 1)]: 'Uvaděč: Záznam se s vámi nehádá. Málokdy to dělá. Jen uchovává, co se stalo, založené pod datem, kdy se to stalo — ať už ruka, která to udělala, ještě odpovídá na vaše jméno, nebo ne.',
  [roomChoiceTextKey('the-archive', 'refile-it')]: 'Zavřete krabici jemně, bez komentáře na jednu ani druhou stranu, a vraťte ji zpátky na polici.',
  [roomChoiceHintKey('the-archive', 'refile-it')]: 'Ani to nehajte, ani to nepopírejte. Založte to.',
  [roomChoiceOutcomeKey('the-archive', 'refile-it', 0)]: 'Zavřete víko, opatrně, tak jako byste zavřel knihu uprostřed věty z úcty ke kapitole, ne ze souhlasu s ní, a vrátíte ji na její místo mezi všechny ostatní.',
  [roomChoiceOutcomeKey('the-archive', 'refile-it', 1)]: 'Uvaděč: To je, myslím, skutečný účel té police. Ne verdikt na jednu ani druhou stranu — místo, kam něco odložit, aniž byste museli dokončit rozhodování, co to vlastně bylo.',
  [roomChoiceTextKey('the-archive', 'pin-the-corner')]: 'Připněte neshořelý roh fotografie k okraji otevřené krabice — dodatek k záznamu.',
  [roomChoiceHintKey('the-archive', 'pin-the-corner')]: 'Přidejte do spisu, místo abyste ho podepsal nebo odmítl.',
  [roomChoiceOutcomeKey('the-archive', 'pin-the-corner', 0)]: 'Palcem přitisknete malý utržený roh ke kartě, dokud nedrží, dodatek, o který vás nikdo nežádal a nikdo od vás nebude chtít vysvětlení.',
  [roomChoiceOutcomeKey('the-archive', 'pin-the-corner', 1)]: 'Archiv to přijme přesně tak, jak archivy přijímají všechno — bez komentáře, bez námitek, a, všimnete si, aniž by to kdy vůbec potřeboval.',
  [roomNoteTitleKey('the-archive')]: 'O uchovávání záznamů',
  [roomNoteThinkersKey('the-archive')]: 'Paul Ricœur, narativní identita',
  [roomNoteBodyKey('the-archive')]: 'Paul Ricœur tvrdil, že já není věc, kterou najdete introspekcí — je to narativ, který stále skládáte, přepisujete zápletku, aniž byste tu knihu kdy dokončil. Nazval to narativní identitou: na rozdíl od pouhého předmětu, jehož stejnost spočívá v tom, že se nikdy nemění, stejnost já spočívá ve schopnosti změnit se a přesto to nazvat týmž příběhem. Tahle místnost inscenuje konfrontaci, kterou měla Ricœurova teorie přežít: konkrétní, datovaný, založený čin, přečtený vám zpátky za studena, bez okolních kapitol, které jej v té chvíli činily nevyhnutelným. Přiznat se k němu, odříci se ho a založit ho bez verdiktu jsou tři různé vztahy k autorství — a Ricœurova vlastní odpověď stojí blíž tomu třetímu než kterémukoli z prvních dvou. Nejste povinen stále souhlasit s každou větou, kterou jste napsal. Jen přiznat, že jste ten, kdo pořád drží pero.',
});

// ---------- Act V: The Unchosen ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-unchosen', 0, 0)]: 'Chodba, kterou si nepamatujete, že jste kdy prošel, lemovaná dveřmi, které stojí lehce pootevřené — ne vábivě. Prostě otevřené, tak jako dveře zůstávají otevřené, když je už velmi dlouho nikdo nezavřel.',
  [roomBeatKey('the-unchosen', 0, 1)]: 'Tohle jsou dveře z vaší poslední cesty tudy, kterými jste nikdy neprošel. Zařízení je uchovalo přesně tak, jak jste je nechal: nevstoupené, nerozhodnuté, technicky pořád dostupné, tím zvláštním způsobem, jakým je zmeškaný vlak pořád, technicky, vlak.',
  [roomBeatKey('the-unchosen', 0, 4)]: 'Uvaděč: Nečetl bych do toho, které to je, příliš mnoho. Nebo bych do toho četl úplně všechno — nikdy jsem se nedokázal rozhodnout, která rada je horší.',
  [roomChoiceTextKey('the-unchosen', 'enter-it')]: 'Dotlačte je zbytek cesty otevřít. Vejděte dovnitř.',
  [roomChoiceHintKey('the-unchosen', 'enter-it')]: 'Zvědavost, oceněná pozdě.',
  [roomChoiceOutcomeKey('the-unchosen', 'enter-it', 1)]: 'Cokoli se tu mělo stát, se už, patrně, stalo — někomu, nebo nikomu, nebo ta otázka prostě vypršela tak, jako neotevřená pošta jednou přestane být naléhavá. Je to menší, než jak jste si to vystavěl. Většina neprožitých věcí je.',
  [roomChoiceOutcomeKey('the-unchosen', 'enter-it', 2)]: 'Uvaděč: To je sazba za dveře nechané zavřené. Ne tragédie — jen místnost, čekající za svou vlastní příležitostí. Někteří poutníci v tom najdou úlevu.',
  [roomChoiceTextKey('the-unchosen', 'close-it')]: 'Zavřete je zbytek cesty. Některé dveře je poctivě lepší nechat dveřmi.',
  [roomChoiceHintKey('the-unchosen', 'close-it')]: 'Respektujte jejich minulost.',
  [roomChoiceOutcomeKey('the-unchosen', 'close-it', 0)]: 'Zatlačíte je zavřít, jemně, tak jako byste zavřel dveře do místnosti, kde někdo konečně, opravdu, spí.',
  [roomChoiceOutcomeKey('the-unchosen', 'close-it', 1)]: 'Uvaděč: Správný instinkt, dalo by se říct. Ne každé neotevřené dveře jsou čekající lítost. Některé jsou prostě dveře, které jste udělal dobře nechat na pokoji už poprvé, ať jste to tehdy věděl, nebo ne.',
  [roomChoiceTextKey('the-unchosen', 'read-the-hinges')]: '„Proč se zase otevíráš, zrovna teď?“ Zeptejte se samotných dveří.',
  [roomChoiceHintKey('the-unchosen', 'read-the-hinges')]: 'Vyslýchejte tu nabídku, ne jen tu místnost.',
  [roomChoiceOutcomeKey('the-unchosen', 'read-the-hinges', 0)]: 'Odpověď přesně nedostanete — dveře, dokonce i tady, nejsou přirozeně sdílné — ale všimnete si, že panty jsou nedávno naolejované. Někdo, nebo něco, chtělo mít tyhle dveře dnes večer snadno pohyblivé, konkrétně.',
  [roomChoiceOutcomeKey('the-unchosen', 'read-the-hinges', 1)]: 'Uvaděč: Férová otázka, a nemám tu poctivou verzi odpovědi. Můj nejlepší odhad: zařízení vám nabízí dveře, které jste teď připraven přežít neotevřené. Ani mně nikdy nevysvětlilo svoje načasování.',
  [roomNoteTitleKey('the-unchosen')]: 'Cesta neprojitá, prověřená',
  [roomNoteThinkersKey('the-unchosen')]: 'Søren Kierkegaard · Robert Frost, báseň špatně čtená jako opatrnost',
  [roomNoteBodyKey('the-unchosen')]: 'Søren Kierkegaard nazval možnost tou nejzávratnější věcí, jaká je člověku dostupná — závratnější než jakékoli skutečné nebezpečí, protože skutečné je přinejmenším konečné, zatímco možné se množí bez omezení, čím déle stojíte na rozcestí a odmítáte volit. Úzkost je pro Kierkegaarda pocit svobody dívající se dolů. Frostova báseň „Cesta neprojitá“ bývá téměř na každém promočním ceremoniálu citována jako hymnus na odvážnou odchylku — „ta méně sešlapaná, / a to změnilo všechno“ — ale báseň sama je mnohem lstivější: obě cesty jsou, jak mluvčí přiznává o dvě sloky dřív, sešlapané „vlastně stejně,“ a ten toužebný povzdech na konci je předem přiznán jako něco, co mluvčí bude vyprávět „s povzdechem / někde v dálných dálných dobách“ — příběh přetvořený zpětným pohledem, ne pravda hlášená přímo z rozcestí. Dveře v této chodbě nikdy nebyly tajně lepší. Byly prostě, na okamžik, možné — a možnost, jakmile se uzavře, nenechává si žádné účtenky, jen fámy.',
});

// ---------- Act V: The Echo ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-echo', 0, 0)]: 'Holá místnost. Dvě židle, obrácené k sobě, dost blízko na to, aby bylo jasné, že kdokoli sedí v jedné z nich, má být slyšen.',
  [roomBeatKey('the-echo', 0, 1)]: 'Druhá židle je obsazená. Ne osobou — místnost je pečlivá v tom, aby to bylo přesné, přesné způsobem, jaký dokáže jen místo, které nemá z lhaní žádný prospěch — ale hlasem, trpělivě sestaveným z toho, co jste říkal a volil, když jste tu byl naposledy.',
  [roomBeatKey('the-echo', 0, 5)]: 'Uvaděč: U tohohle nesedím. Ať už vy dva tam uvnitř děláte cokoli, nikdy to nebylo na mně, abych to rozhodčoval.',
  [roomChoiceTextKey('the-echo', 'answer-it')]: '„Slyším tě.“ Promluvte zpátky k tomu, kým jste býval.',
  [roomChoiceHintKey('the-echo', 'answer-it')]: 'Oslovte to, nejen to sledujte.',
  [roomChoiceOutcomeKey('the-echo', 'answer-it', 0)]: 'Řeknete to — ne oprava, ne omluva, jen potvrzení, tak jako byste pozdravil někoho u dveří, o kom jste si nebyl jistý, že vás ještě pozná.',
  [roomChoiceOutcomeKey('the-echo', 'answer-it', 1)]: 'Druhá židle neodpoví, přesně řečeno. Ale něco v místnosti se usadí tak, jako se usadí zadržený dech, když ho konečně někdo pustí ven, úmyslně, dvěma lidmi místo jednoho.',
  [roomChoiceTextKey('the-echo', 'sit-in-silence')]: 'Seďte naproti tomu a neříkejte nic. Nechte to tentokrát domluvit, bez přerušení.',
  [roomChoiceHintKey('the-echo', 'sit-in-silence')]: 'Buďte svědkem, neodpovídejte.',
  [roomChoiceOutcomeKey('the-echo', 'sit-in-silence', 0)]: 'Sedíte. Necháte to mluvit, celou cestu do konce, aniž byste opravil jediné slovo — což, všimnete si, jste nezvládal vždycky ani poprvé.',
  [roomChoiceOutcomeKey('the-echo', 'sit-in-silence', 1)]: 'To ticho není prázdné. Je to, pokud vůbec něco, to nejúplnější, co v té místnosti bylo řečeno.',
  [roomChoiceTextKey('the-echo', 'take-both-chairs')]: '„Nikdy tu nebyl nikdo jiný.“ Posaďte se do obou židlí, střídavě, a myslete to vážně.',
  [roomChoiceHintKey('the-echo', 'take-both-chairs')]: 'Nejdražší čtení: žádný host, jen vy.',
  [roomChoiceOutcomeKey('the-echo', 'take-both-chairs', 0)]: 'Sednete si i do druhé židle, na chvíli, a zkusíte ten hlas jako kabát, který jste kdysi vlastnil — a sedí přesně, což je buď utěšující, nebo celý ten problém, podle toho, jaká je hodina.',
  [roomChoiceOutcomeKey('the-echo', 'take-both-chairs', 1)]: 'Nikdy tu nebyl host k pobavení. Jen řada vás, založená pod stejným jménem, střídající se v držení pera.',
  [roomNoteTitleKey('the-echo')]: 'Rozhovory s předchozím nájemníkem',
  [roomNoteThinkersKey('the-echo')]: 'David Hume · Galen Strawson, svazkové já a jeho kritici',
  [roomNoteBodyKey('the-echo')]: 'David Hume prohledal vlastní mysl po nepřetržitém já a nahlásil, že našel jen svazek vjemů — žádnou nit, která by pod nimi probíhala, jen jednu zkušenost za druhou, natěsnané dost na to, aby to působilo jako osoba. Galen Strawson vzal ten svazek vážně jako popis samotné zkušenosti: mnozí z nás, tvrdil, se ve skutečnosti necítí kontinuální s tím, kým jsme byli před lety nebo dokonce před hodinami — psychologické já je často „epizodické,“ obnovuje se v kratších, lokálnějších návalech, než předpokládá model narativní identity, bez jediné nitě potřebné k tomu, aby daný nával byl skutečným já. Hlas na druhé židli není strašení; je tím, co zůstalo z jednoho takového návalu, založeno přesně a bez zlého úmyslu. Ať už mu odpovíte, přečkáte ho, nebo přiznáte, že tu byl vždy jen jeden obyvatel, místnost se ptá na totéž třemi způsoby: je ten, kdo teď poslouchá, tentýž, kdo tehdy mluvil — nebo jen další nájemník, čtoucí předchozí nájemní smlouvu s neobvyklou pozorností?',
});
