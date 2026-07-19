// Czech translation of LIMERENCE's 7 endings (title, epitaph, beats, field
// notes). Registered under version 'v2'. Mirrors the structure of
// content/text/cs-endings.ts (ANAMNESIS) — see that file and CLAUDE.md's
// "Translating content" rule for the register this follows: whatever each
// specific ending's own emotional register calls for, translated for
// meaning-in-context rather than word-for-word. Ending ids are pack-local
// ('the-morning-after' etc.) and never collide with ANAMNESIS's own
// ('return', 'open-hand', ...), so endingTitleKey/endingBeatKey/etc need no
// pack-id scoping here (see engine/text/keys.ts).
import { registerAll } from '../../../engine/text/resolver';
import {
  endingBeatKey,
  endingEpitaphKey,
  endingNoteBodyKey,
  endingNoteThinkersKey,
  endingNoteTitleKey,
  endingTitleKey,
  axisTriptychKey,
} from '../../../engine/text/keys';

// ---------- Ending: The Morning After ----------
registerAll('v2', 'cs', {
  [endingTitleKey('the-morning-after')]: 'Ráno poté',
  [endingEpitaphKey('the-morning-after')]: 'Rozhovor tam pořád byl. A konečně jste tam byli i vy.',
  [endingBeatKey('the-morning-after', 0)]: 'Projdete dveřmi haly, a práh udělá to jediné, co žádný pokoj nahoře nedokázal: skončí.',
  [endingBeatKey('the-morning-after', 1)]:
    'Ranní doprava, obyčejná a ohromná. Někde skutečná kuchyně. Člověk, kterého jste opustili uprostřed věty, je pořád uprostřed té věty — jako byste si jen odskočili ke dveřím, a ne na celou noc.',
  [endingBeatKey('the-morning-after', 2)]:
    'Nic není vyřešeno. Svět se kvůli vám nezlepšil. Hádky vám trpělivě držely místo teplé, jak to hádky dělávají.',
  [endingBeatKey('the-morning-after', 3)]:
    'Ale v následujících týdnech se přistihnete, jak kladete otázky, na které předem neznáte odpověď — nahlas, člověku naproti u stolu, místo abyste si je nejdřív potichu probrali sami.',
  [endingBeatKey('the-morning-after', 4)]:
    'Ztratíte skoro všechno z toho: chodby, přesnou trpělivost Vrátného, konkrétní váhu každých neotevřených dveří. Vytrácí se to tak, jako se vytrácejí sny — nezůstane vzpomínka, jen jakési počasí.',
  [endingBeatKey('the-morning-after', 5)]:
    'Cesta zpátky, jak se ukazuje, nikdy nebyla silnicí, {name}. Vztah nikdy nebyl ten slib. Byli jste tou rekonstrukcí vy.',
  [endingNoteTitleKey('the-morning-after')]: 'O návratu',
  [endingNoteThinkersKey('the-morning-after')]: 'vzorec sestupu, který se vrací — verze pro vztahy',
  [endingNoteBodyKey('the-morning-after')]:
    'Každá moudrostní tradice má svou verzi téhož tvaru: sestup, který má cenu jen tak velkou, jako výstup, který po něm následuje, a který s sebou nese něco, co povrch sám nikdy nemohl vytvořit. Aplikován na vztah místo na duši drží tenhle vzorec se znepokojivou přesností — přežitá krize sama o sobě nic nemění; záleží na tom, jestli se z ní lidé vrátí opravdu jiní, nebo jestli se prostě posadí zpátky na svá stará místa u starého stolu. **Nebezpečím v tomhle hotelu nikdy nebyl samotný Interval. Bylo jím odhlásit se nezměněn.** Vrátit se obyčejný, ale přeskládaný: to byl vždycky celý úkol.',
});

// ---------- Ending: The Giver ----------
registerAll('v2', 'cs', {
  [endingTitleKey('the-giver')]: 'Dárce',
  [endingEpitaphKey('the-giver')]: 'Bezpečný přístav pro každého. Mince po minci. Většinou rád.',
  [endingBeatKey('the-giver', 0)]: 'Projdete, a svět vás přijme tak, jak přijímá voda — beze švu, bez šplouchnutí.',
  [endingBeatKey('the-giver', 1)]:
    'Probudíte se propustní. Jiné slovo pro to není. Krize každého přítele ve dvě ráno teď najde nejdřív vás, tak jako voda v místnosti vždycky najde nejnižší bod.',
  [endingBeatKey('the-giver', 2)]:
    'Stanete se tím, kým se druzí opravují. Je to opravdu dobrý život, měřený lepšími rány druhých lidí — jeho účetnictví se vede v měně, kterou jste přestali počítat někde kolem Dějství II.',
  [endingBeatKey('the-giver', 3)]:
    'Dáváte svobodně, a většinou rádi, a to dávání není žádné divadlo — na tom si ta místnost dává záležet. Stojí vás to skutečné věci a platíte je bez zášti, většinu dní.',
  [endingBeatKey('the-giver', 4)]:
    'Jen občas — pozdě, v poctivých hodinách — si všimnete, co otevřená dlaň neumí, a to je zavřít se. Jestli to byla cena, nebo výhra, je otázka, kterou každý večer záměrně necháváte na stole nezodpovězenou.',
  [endingBeatKey('the-giver', 5)]:
    'Vrátný, kdyby vás mohl vidět — a některé noci, kdo ví — by řekl: tohohle jsme vrátili lehčího. Možná jsme sundali o něco víc obalu, než recepce striktně doporučuje.',
  [endingNoteTitleKey('the-giver')]: 'O bezmezné péči',
  [endingNoteThinkersKey('the-giver')]: 'výzkum spoluzávislosti · zjištění hranice jako nosné zdi',
  [endingNoteBodyKey('the-giver')]:
    'Klinický výzkum spoluzávislosti se posunul od svého raného, moralizujícího rámce k něčemu přesnějšímu: jde o skutečný, nákladný vzorec, ve kterém se něčí pohoda strukturálně stává závislou na tom, že je druhými potřebný, a hranice — zdaleka ne sobecké — fungují jako nosná zeď, která brání celé stavbě, aby se nakonec nezhroutila pod tíhou vlastní štědrosti. **Otevřená dlaň, která se neumí zavřít, neudrží ani vlastní váhu, natožpak váhu někoho jiného, donekonečna.** Místnosti odměnily vaši otevřenost. Svět to udělá také, bez zloby — a nakonec vám to i naúčtuje.',
});

// ---------- Ending: The Armored ----------
registerAll('v2', 'cs', {
  [endingTitleKey('the-armored')]: 'Obrněný',
  [endingEpitaphKey('the-armored')]: 'Nic se nedostalo dovnitř. To byl plán. Nic se nedostalo dovnitř.',
  [endingBeatKey('the-armored', 0)]: 'Projdete do života, který zvenčí běží přesně tak, jak má.',
  [endingBeatKey('the-armored', 1)]:
    'Kompetence. Nakonec povýšení, pak další. Lidé vás popisují jako „pevného", jako „v pohodě" — nikdy tak docela jako „vřelého", i když vám trvá roky, než si té pravidelnosti ve volbě slov všimnete.',
  [endingBeatKey('the-armored', 2)]:
    'Zdi, které se zvedly někde v Křídle dlouhodobých hostů, drží. Drží velmi dobře. Nic se nedostane dovnitř, což byl koneckonců ten plán.',
  [endingBeatKey('the-armored', 3)]:
    'O léta později, okno, nenápadně, nenápadného večera — a ta myšlenka se dokončí sama, dřív než ji stihnete zastavit: všechno zůstává venku. Počasí, vlci, i pošta, i návštěvníci.',
  [endingBeatKey('the-armored', 4)]:
    'Vrátný do spisu, který se nakonec vrátí s vaším jménem, napíše jedno slovo: „V bezpečí."',
  [endingBeatKey('the-armored', 5)]:
    'Na okraj, pod to, rukopisem, který možná patří jemu a možná už teď vám: v bezpečí před čím, nebylo nikdy upřesněno.',
  [endingNoteTitleKey('the-armored')]: 'O zbroji',
  [endingNoteThinkersKey('the-armored')]: 'vyhýbavá adaptace, poctivě naceněná',
  [endingNoteBodyKey('the-armored')]:
    'Vyhýbavé vazebné strategie jsou adaptivní — spolehlivě fungují přesně v té úloze, pro kterou byly postaveny: snižovat bolest z potřebování někoho, kdo se možná nedostaví. Poctivá cena, doložená napříč literaturou, není slabost, ale zužování: já, organizované kolem toho, aby nebylo zraněno, se spolehlivě organizuje i mimo dosah toho, být zasaženo, ohromeno nebo překvapeno přítomností kohokoli jiného. **Já, které nic nedokáže zranit, je také já, které nic nedokáže ohromit.** Tenhle konec není napsán jako selhání — kompetence a bezpečí jsou skutečná dobra — jen jako poctivé vyúčtování toho, co zbroj stojí, když se nosí donekonečna.',
});

// ---------- Ending: The Ghost ----------
registerAll('v2', 'cs', {
  [endingTitleKey('the-ghost')]: 'Duch',
  [endingEpitaphKey('the-ghost')]: 'Chodil jste dál. Přicházet jste přestal.',
  [endingBeatKey('the-ghost', 0)]:
    'Není tu žádný dramatický odchod, protože žádný nebyl. Prostě to v jednu chvíli přestanete nést — chvíli příliš pozvolnou na to, aby šla přesně datovat.',
  [endingBeatKey('the-ghost', 1)]:
    'Pořád chodíte — na večeře, na oslavy narozenin, na ten obyčejný nábytek přítomnosti — ještě chvíli poté, co jste už, ve všech ohledech, na kterých záleží, dávno pryč.',
  [endingBeatKey('the-ghost', 2)]:
    'Vrátný drží slovo: na jeho směně se žádný host nerozpouští sám. Tentokrát si s vámi sedne, aniž by toho moc řekl, což se ukáže být přesně tolik, kolik bylo potřeba.',
  [endingBeatKey('the-ghost', 3)]:
    'To, co přestane nést konkrétně vás, se neztrácí. Nakonec si to vezme někdo jiný, tak jako věci nechané na stole si nakonec vždycky vezme ten, kdo u něj ještě stojí.',
  [endingBeatKey('the-ghost', 4)]:
    'Tohle není obrazovka prohry. Na tom si hotel dává záležet, a po svém i tenhle konec: některé věci končí pomalu, a pomalý způsob je pořád konec, ne zločin.',
  [endingBeatKey('the-ghost', 5)]:
    'Příliv přichází bez ohledu na to, jestli jste vůbec byli započítáni mezi mušle, které si s sebou odnesl zpátky.',
  [endingNoteTitleKey('the-ghost')]: 'O tichém odchodu',
  [endingNoteThinkersKey('the-ghost')]: 'citové stažení a disociace ve vztazích',
  [endingNoteBodyKey('the-ghost')]:
    'Citové stažení — pomalý odchod, který se nikdy neohlásí jako odchod — je dobře zdokumentovaná ochranná reakce, ne morální selhání: nervová soustava, která se naučila, že blízkost nese riziko, začne tiše a rozumně zavírat vzdálenost k tomu riziku, místo vzdálenosti k člověku. **Otupělost je ochrana s nájemní smlouvou, ne trvalé bydliště — i když se to zevnitř může jevit jako trvalé.** Je to tu napsáno záměrně jako konec, nikdy jako rozsudek nad tím, kdo k němu dospěl — příliv není trest. Je to prostě to, co voda dělá, když má dost času a dost váhy k unesení.',
});

// ---------- Ending: The Porter ----------
registerAll('v2', 'cs', {
  [endingTitleKey('the-porter')]: 'Vrátný',
  [endingEpitaphKey('the-porter')]: 'Místnosti vždycky potřebují strážce. Strážce vždycky potřeboval místnosti.',
  [endingBeatKey('the-porter', 0)]:
    'Předání proběhne potichu, během toho, co se zdá jako jedna dlouhá noc a nakonec se ukáže být podstatně delší.',
  [endingBeatKey('the-porter', 1)]:
    'Naučíte se povahy křídla — které dveře se v zimě vzpříčí, která patra jsou chladnější, než přiznává termostat, kteří hosté potřebují ticho a kteří potřebují nechat lampičku na stole rozsvícenou.',
  [endingBeatKey('the-porter', 2)]:
    'Disciplína, jakmile ji pochopíte, se snadno vysloví a těžko praktikuje: smíte rozsvítit chodbu. Nikdy nesmíte pojmenovat dveře. Každý host si musí sám najít cestu k tomu, co je za nimi.',
  [endingBeatKey('the-porter', 3)]:
    'Projdou jich staletí, nebo aspoň to tak připadá — každý jistý, že jeho screenshot, jeho chodba, jeho kuchyňský stůl je první svého druhu. Nikdo z nich se v tom pocitu nemýlí. Nikdo z nich v něm ale ani nemá pravdu.',
  [endingBeatKey('the-porter', 4)]:
    'Jednoho dne se host odvrátí od ranního světla se zvláštním výrazem ve tváři — poznáním, jaké si pamatujete zevnitř, z noci, která teď připadá neuvěřitelně dávno.',
  [endingBeatKey('the-porter', 5)]:
    'Řeknete tu první lekci, tu, kterou kdysi řekli vám: „Prsten a ten bledý proužek mají stejnou velikost. Je to schválně. Tady je schválně všechno."',
  [endingNoteTitleKey('the-porter')]: 'O pečování',
  [endingNoteThinkersKey('the-porter')]: 'archetyp zraněného léčitele',
  [endingNoteBodyKey('the-porter')]:
    'Archetyp zraněného léčitele — Cheirón v mýtu, a od něj i skutečný, zdokumentovaný vzorec v pomáhajících profesích — tvrdí, že schopnost provést někoho krizí bývá často vykována přežitím krize srovnatelné, ne navzdory tomu zranění, ale skrze konkrétní pozornost, které ho naučilo. Klinický výzkum peer podpory a rolí založených na prožité zkušenosti nachází v tomhle konkrétním druhu péče skutečnou, měřitelnou hodnotu — takovou, kterou samotný výcvik spolehlivě nevytváří. **Pěstovat ten kout světa, který je chodbou, není menší povolání než kterýkoli z pokojů, jež z ní vedou.** Strážce potřeboval místnosti přesně tak, jako místnosti kdy potřebovaly strážce.',
});

// ---------- Ending: The Mirror ----------
registerAll('v2', 'cs', {
  [endingTitleKey('the-mirror')]: 'Zrcadlo',
  [endingEpitaphKey('the-mirror')]: 'Obě křesla. Každá místnost. Dobrý vtip, viďte?',
  [endingBeatKey('the-mirror', 0)]:
    'Malé dveře se otevřou do soukromého salonku, dva šálky už nalité, a nikde v něm není třetí křeslo.',
  [endingBeatKey('the-mirror', 1)]:
    'Vrátný nalévá. Nesedne si tak úplně naproti vám, spíš vedle vás — všimnete si toho, až když už to udělal.',
  [endingBeatKey('the-mirror', 2)]:
    'Bez spěchu si sundá prsten z pravé ruky, a tam — na levé, kde jste to nějak už čekali — je ten samý bledý, neopálený proužek, kterého jste si na něm všimli první noc. Až na to, že to není jeho ruka. Je to vaše.',
  [endingBeatKey('the-mirror', 3)]:
    'Každý host v každé místnosti, kterou jste kdy prošli, měl, jak se ukazuje, vaši vlastní tvář, kdybyste se podívali dvakrát: pokoušený i zrazený, ten třetí i přítel, který věděl a mlčel — oba vypravěči každé hádky, ve které jste kdy doopravdy byli.',
  [endingBeatKey('the-mirror', 4)]:
    'Zasmějete se. Ten smích je to poznání — žádná pointa nepřišla zvenčí, jen vtip konečně dopadl na člověka, který ho celou dobu vyprávěl sám sobě, v každé místnosti, aniž by si toho všiml.',
  [endingBeatKey('the-mirror', 5)]:
    'Probudíte se se smíchem, a vtip se vypaří tak, jako se vtipy vypařují při probuzení — zůstane po něm jen tvar: v tom druhém křesle nikdy nikdo nebyl. Vždycky jste tam byli dva, a oba jste byli vy.',
  [endingNoteTitleKey('the-mirror')]: 'Nejstarší vtip',
  [endingNoteThinkersKey('the-mirror')]: 'vrcholná forma vžívání se do pohledu druhého',
  [endingNoteBodyKey('the-mirror')]:
    'Výzkum vžívání se do perspektivy druhého tu nachází svou nejúplnější podobu, za hranicí, kde je to ještě dovednost, kterou trénujete, a blíž něčemu, co je spíš poznání: každý konflikt, který tenhle hotel inscenoval, měl přesně dva vypravěče v první osobě, a vy jste byli, prokazatelně, oba — ne metaforicky, ale strukturálně. Sanskrtská fráze *tat tvam asi* — „ty jsi to" — pojmenovává starou, mezikulturní intuici o propustnosti hranice mezi já a druhým; tenhle pokoj si ji jednou, lehce, vypůjčuje jako jedinou tichou ozvěnu, ne jako doktrínu. **Obě křesla. Každá místnost. Dobrý vtip, viďte — takový, který dopadne, jen když si všimnete, že jste se celou dobu smáli sami sobě.**',
});

// ---------- Ending: The Pattern ----------
registerAll('v2', 'cs', {
  [endingTitleKey('the-pattern')]: 'Vzorec',
  [endingEpitaphKey('the-pattern')]: 'Neodhlásili jste se. Probudili jste se, a probuzení v sobě neslo každou místnost.',
  [endingBeatKey('the-pattern', 0)]:
    'Všechny dveře na všech patrech se otevřou najednou — nevyražené, nedramatické, prostě otevřené, tak jako se otevírá fakt, ne tak, jako se otevírá událost.',
  [endingBeatKey('the-pattern', 1)]:
    'Světlo na chodbě je obyčejné, laskavé, a poprvé za celou noc v něm není nic, před čím by bylo potřeba se schovávat.',
  [endingBeatKey('the-pattern', 2)]:
    'Potvrzení o přečtení, screenshot, chodba na konferenci, kuchyňský stůl v 06:40 — všechno to, najednou, přítomné tak, jak je přítomný celý život člověku, který ho skutečně žije, ne tak, jak je přítomný příběh někomu, kdo si ho zpětně čte.',
  [endingBeatKey('the-pattern', 3)]:
    'Vrátný, konečně bez klobouku, řekne tu nejkratší věc, jakou v celém tomhle hotelu řekne. „Ach."',
  [endingBeatKey('the-pattern', 4)]:
    'To poznání není naučení se něčemu novému. Je to spatření vzorce vcelku — což se ukazuje být to jediné, co v celé historii téhle budovy kdy nějaký vzorec doopravdy změnilo.',
  [endingBeatKey('the-pattern', 5)]:
    'Probudíte se, a {name} přichází spolu s tím probuzením, ne o půl vteřiny později. Odletová tabule, kterou naposledy zahlédnete cestou ven, ukazuje všechny časy najednou.',
  [endingNoteTitleKey('the-pattern')]: 'Spatřit to vcelku',
  [endingNoteThinkersKey('the-pattern')]: 'rozpoznávání vzorců a změna · skutečný mechanismus literatury o vydobyté jistotě',
  [endingNoteBodyKey('the-pattern')]:
    'Samotný vhled jen zřídka mění chování — klinická literatura se shoduje, že vědět, že vzorec existuje, je nutné, ale nikdy ne dostatečné. To, co výzkum vydobyté jistoty ve skutečnosti určuje jako mechanismus změny, je blíž tomu, co tenhle pokoj inscenuje přímo: ne nově naučený fakt, ale celý vzorec spatřený najednou, držený dost dlouho a dost jasně na to, aby přestal fungovat neviditelně. **Místnosti nikdy nebyly za vámi. Byly tvarem vás, vzhůru.** Tohle jsou nejvzácnější dveře v celém hotelu, a má to důvod: nežádají o ještě jednu dobrou volbu navíc, ale o ochotu podívat se na celý spis najednou a poznat, že rukopis v něm je od začátku do konce váš vlastní.',
});

// ---------- End-screen axis triptych (2026-07-15, code review) ----------
registerAll('v2', 'cs', {
  [axisTriptychKey('reasonFeeling', 'neg', 'limerence')]: 'Pokaždé jste vedli hlavou.',
  [axisTriptychKey('reasonFeeling', 'mid', 'limerence')]: 'Hlava a srdce, přely se spolu.',
  [axisTriptychKey('reasonFeeling', 'pos', 'limerence')]: 'Pokaždé jste vedli srdcem.',
  [axisTriptychKey('selfOthers', 'neg', 'limerence')]: 'Nechali jste si, co bylo vaše.',
  [axisTriptychKey('selfOthers', 'mid', 'limerence')]: 'Své i jejich jste drželi v téže dlani.',
  [axisTriptychKey('selfOthers', 'pos', 'limerence')]: 'Rozdávali jste se, rádi.',
  [axisTriptychKey('controlAcceptance', 'neg', 'limerence')]: 'Svírali jste pevně, patro za patrem.',
  [axisTriptychKey('controlAcceptance', 'mid', 'limerence')]: 'Věděli jste, kdy podržet a kdy pustit.',
  [axisTriptychKey('controlAcceptance', 'pos', 'limerence')]: 'Nechali jste rozhodnout proud.',
});
