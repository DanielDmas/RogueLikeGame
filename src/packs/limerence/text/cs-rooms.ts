// Czech translation of LIMERENCE's prologue and Act I room prose (beats,
// choice text/hint/outcome, field notes, plain-language explanations).
// Registered under version 'v2'. Follows the structural pattern established
// by ANAMNESIS's src/content/text/cs-rooms.ts and cs-dynamic.ts — see
// CLAUDE.md's "Translating content" rule: every line here was translated
// against the room's actual beats and each choice's stakes, not word-for-
// word. Act I's cast is 15-18, so their dialogue/interiority reads as a
// Czech teenager's voice; the Porter's own lines stay in his separate,
// unhurried adult register.
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

// ---------- Prologue: The Front Desk ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-front-desk', 0, 0)]:
    'Probouzíte se uprostřed kroku v hale, která voní čisticím prostředkem na koberce, vystydlou kávou a něčím parfémem, co už skoro vyprchal. Nepamatujete si, jak jste sem přišli. Tady si to skoro nikdy nepamatujete.',
  [roomBeatKey('the-front-desk', 0, 1)]:
    'Nad pultem cvaká odletová tabule a vypisuje všechny právě ubytované hosty. Žádné časy. Žádné brány. Jen jména — a to vaše je někde mezi nimi.',
  [roomBeatKey('the-front-desk', 0, 2)]:
    'Kniha hostů je otevřená na dnešní stránce. Váš podpis už tam je, vaším vlastním písmem, s datem zítřka.',
  [roomBeatKey('the-front-desk', 0, 3)]:
    'Vrátný: Jste mezi jedním úderem srdce a druhým. Většina hostů je, když si toho poprvé všimne.',
  [roomBeatKey('the-front-desk', 0, 4)]:
    'Vrátný: Pravidla, taková, jaká jsou — patra, dveře, místnosti, které si pamatují, co se v nich stalo. Některými projdete jako vy sami. Jinými jako ten, kdo je uvnitř, ve chvíli, kdy se dveře otevřou.',
  [roomBeatKey('the-front-desk', 0, 5)]:
    'Když se otočí, aby knihu založil zpátky, všimnete si toho — snubní prsten na pravé ruce, a na levé bledý, neopálený proužek tam, kde jeden kdysi býval. Nevysvětluje to. Vy se neptáte. Zatím ne.',
  [roomChoiceTextKey('the-front-desk', 'what-is-this')]: '„Co je tohle za místo?“',
  [roomChoiceHintKey('the-front-desk', 'what-is-this')]: 'Zeptejte se na samotný hotel',
  [roomChoiceOutcomeKey('the-front-desk', 'what-is-this', 0)]:
    'Vrátný: Místnosti drží ty noci, o kterých lidé nikomu neřeknou. Projdete jimi jako lidé, kteří v nich byli. To je celá architektura tohohle místa.',
  [roomChoiceTextKey('the-front-desk', 'whose-side')]: '„Na čí jste straně?“',
  [roomChoiceHintKey('the-front-desk', 'whose-side')]: 'Zeptejte se na Vrátného',
  [roomChoiceOutcomeKey('the-front-desk', 'whose-side', 0)]:
    'Vrátný: Recepce je neutrální, a to si každý host splete s krutostí. Než přijde ráno, budete každým z nich. Pak slovo „strana“ přestane moc znamenat.',
  [roomChoiceTextKey('the-front-desk', 'let-me-out')]: '„Já chci prostě jít domů.“',
  [roomChoiceHintKey('the-front-desk', 'let-me-out')]: 'Odmítněte celý rámec',
  [roomChoiceOutcomeKey('the-front-desk', 'let-me-out', 0)]:
    'Vrátný: Domov je tam, kde bydlí rozhovor, kterému se vyhýbáte. Cesta zpátky vede přes každou místnost, kde se někdo takovému rozhovoru vyhýbá. Žádná zkratka se ještě nenašla. Lidé to zkoušejí, noc co noc.',
  [roomExplanationKey('the-front-desk', 0)]:
    'Limerence je skutečný, pojmenovaný psychologický stav — mimovolní, posedlá zamilovanost, odlišná od lásky i od volby. Tenhle hotel je po ní pojmenovaný, protože většina toho, co se na jeho patrech odehrává, tam začíná. Hra, která následuje, není o tom soudit lidi v těchto místnostech; je o tom projít si těžký vztahový okamžik zevnitř, jednou, bezpečně, dřív než si ho od vás jednou vyžádá skutečný život.',
  [roomNoteTitleKey('the-front-desk')]: 'Limerence',
  [roomNoteThinkersKey('the-front-desk')]: 'Dorothy Tennov · Love and Limerence (1979)',
  [roomNoteBodyKey('the-front-desk')]:
    'Tennov tímhle termínem pojmenovala něco, co zažije skoro každý a skoro nikdo pro to nemá slovo: mimovolní stav posedlé zamilovanosti — vtíravé myšlenky na jednoho člověka, nutkavé čtení každého jeho signálu, bolest, která neposlouchá žádný argument. Není to láska a není to rozhodnutí; má nástup, vrchol a (bez péče) i úpadek, obvykle do dvou let. **Hotel je po ní pojmenovaný proto, že skoro každé dveře na těchto patrech otevřel někdo v jejím sevření — cit nikdy nebyl volbou; to, co následovalo potom, volbou vždycky bylo.** Pojmenovat ten stav ho nevyléčí. Spolehlivě ale udělá to další rozhodnutí o něco víc vaším.',
});

// ---------- Act I: The Read Receipt ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-read-receipt', 0, 0)]:
    'Váš pokoj, jedna v noci. Displej telefonu je jediné světlo v místnosti a píše, že Sára si přečetla vaši zprávu před třemi hodinami.',
  [roomBeatKey('the-read-receipt', 0, 1)]: 'přečteno · 22:04',
  [roomBeatKey('the-read-receipt', 0, 2)]:
    'Objeví se indikátor psaní. Tři tečky, trpělivé. Pak zmizí. O minutu později se objeví znovu. Zase zmizí. Sledujete to už počtvrté a nedokázali byste nikomu vysvětlit, co vlastně čekáte, že přinese to páté.',
  [roomBeatKey('the-read-receipt', 0, 3)]:
    'Scrollujete zpátky přes všechno, co jste dnes napsali, a čtete každou zprávu jako důkaz viny. Nebyl ten vtip moc? Nebylo to ticho moc dlouhé? Ten důkaz pořád mění majitele podle toho, jak ho zrovna držíte.',
  [roomBeatKey('the-read-receipt', 0, 4)]:
    'Vrátný: Každý host na tomhle patře je přesvědčený, že to ticho je kvůli němu. To ticho skoro nikdy není kvůli němu.',
  [roomChoiceTextKey('the-read-receipt', 'double-text')]: 'Zpanikařte a pošlete ještě dvě zprávy.',
  [roomChoiceHintKey('the-read-receipt', 'double-text')]: 'Honit se za tichem',
  [roomChoiceOutcomeKey('the-read-receipt', 'double-text', 0)]: 'Úleva, na tak čtyři minuty.',
  [roomChoiceOutcomeKey('the-read-receipt', 'double-text', 1)]:
    'Pak: dvě nezodpovězené zprávy místo jedné a aritmetika úzkosti, která vychází přesně tak, jak vždycky vychází.',
  [roomChoiceTextKey('the-read-receipt', 'drawer')]: 'Dejte telefon do šuplíku. Zůstaňte s tím pocitem.',
  [roomChoiceHintKey('the-read-receipt', 'drawer')]: 'Postavit se úzkosti, aniž byste ji krmili',
  [roomChoiceOutcomeKey('the-read-receipt', 'drawer', 0)]:
    'Ukáže se, že ten pocit, když ho místo řízení prostě přijmete čelem, má tvar a — nakonec — i dno.',
  [roomChoiceOutcomeKey('the-read-receipt', 'drawer', 1)]: 'Přijde ráno. A s ním: „promiň, usnula jsem ❤“',
  [roomChoiceTextKey('the-read-receipt', 'bait')]: 'Vymyslete si návnadu — falešnou historku — abyste ji donutili odpovědět.',
  [roomChoiceHintKey('the-read-receipt', 'bait')]: 'Zinscenovat si důkaz',
  [roomChoiceOutcomeKey('the-read-receipt', 'bait', 0)]: 'Funguje to. Odepíše do minuty.',
  [roomChoiceOutcomeKey('the-read-receipt', 'bait', 1)]:
    'A naučíte se jedinou věc, kterou vás taková zkouška vůbec může naučit: že funguje. Ne, co stála.',
  [roomChoiceTextKey('the-read-receipt', 'ask-tomorrow')]: 'Zeptejte se jí zítra přímo, nahlas, tváří v tvář.',
  [roomChoiceHintKey('the-read-receipt', 'ask-tomorrow')]: 'Počkat na denní světlo a opravdovou odpověď',
  [roomChoiceOutcomeKey('the-read-receipt', 'ask-tomorrow', 0)]:
    'Za denního světla ta otázka vypadá malá. Její odpověď — „máma mi vzala telefon“ — udělá celou tu architekturu včerejší noci viditelnou, a trochu trapnou.',
  [roomExplanationKey('the-read-receipt', 0)]:
    'Psychologové popisují tři široké styly attachmentu (citové vazby), naučené brzy a přenášené do každého dalšího vztahu: úzkostný (touží po ujištění, čte ticho jako nebezpečí), vyhýbavý (stahuje se, když se vztah přiblíží) a jistý (věří druhému bez potřeby stálých důkazů). Spirála kolem potvrzení o přečtení je přesně tenhle úzkostný koloběh v reálném čase — pocit, který je naprosto skutečný, přilepený k příběhu, který je často jen první, nedomyšlený nástřel. Žádný z těch stylů není doživotní rozsudek; „vydobytá jistota“ — naučit se číst lidi klidněji — je reálná a je to tichá teze celého tohoto hotelu.',
  [roomNoteTitleKey('the-read-receipt')]: 'Počasí, které si nosíte s sebou',
  [roomNoteThinkersKey('the-read-receipt')]: 'Bowlby (1969) · Ainsworth (1978) · Hazan & Shaver (1987)',
  [roomNoteBodyKey('the-read-receipt')]:
    'Teorie attachmentu začala Bowlbyho pozorováním, že si nemluvňata vytvářejí pracovní modely blízkosti — očekávání, jestli se na natažení ruky odpoví — které Ainsworthová později roztřídila na jisté, úzkostné a vyhýbavé vzorce. Hazan a Shaver o desítky let později ukázali, že tytéž vzorce předpovídají chování dospělých v milostných vztazích: stejný povětrnostní systém, teď jen doma, v přestrojení za potvrzení o přečtení. **Pocit, který přijde v jednu v noci, je skutečný; příběh, který vypráví o tom, proč ještě neodepsala, je jen koncept — a koncepty se dají přepsat.** Nic z toho není osud — longitudinální výzkum „vydobyté jistoty“ ukazuje, že se lidé viditelně posouvají ke klidnějším vzorcům, obvykle přesně skrz vztah, který přežije pár upřímných, neotestovaných nocí. Brána na nejvyšším patře se vás jednou zeptá, co jste s tím počasím udělali.',
});

// ---------- Act I: The Screenshot ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-screenshot', 0, 0)]:
    'Pípnutí airdropu, uprostřed hodiny. Screenshoty: Tom — váš nejlepší kamarád, přítel Nadi — vede druhý, flirtovací chat s holkou z jiné školy.',
  [roomBeatKey('the-screenshot', 0, 1)]: 'Přečtete si to dvakrát. Podruhé to lepší není.',
  [roomBeatKey('the-screenshot', 0, 2)]:
    'Co ty screenshoty dokazují a co ne, říkáte si, a pečlivě si to probíráte v hlavě. Dokazují dost.',
  [roomBeatKey('the-screenshot', 0, 3)]:
    'Proč zrovna vy? Napříč místností vás odesílatel sleduje, jestli se vám v obličeji něco pohne. Tohle nikdy nebylo doopravdy o Tomovi.',
  [roomBeatKey('the-screenshot', 0, 4)]: 'Skupinový chat si nic netušíc bzučí dál, tři různé konverzace o obědě najednou.',
  [roomBeatKey('the-screenshot', 0, 5)]:
    'Vrátný: Důkaz nikdy není jen informace. Je to nabídka práce. Všimněte si, že jste se o ni neucházeli.',
  [roomChoiceTextKey('the-screenshot', 'tell-nadia')]: 'Ukažte to Nadi, dnes, všechno.',
  [roomChoiceHintKey('the-screenshot', 'tell-nadia')]: 'Řekněte to té, koho se to týká',
  [roomChoiceOutcomeKey('the-screenshot', 'tell-nadia', 0)]:
    'Její obličej udělá to, co obličeje v takové chvíli dělají. Pak začne třídění přátelství — koho ještě unese vidět a koho ne.',
  [roomChoiceOutcomeKey('the-screenshot', 'tell-nadia', 1)]:
    'Tom do hodiny ví, kdo jí to řekl. Následky dopadnou i na vás, upřímně, a místnost to nijak nepředstírá.',
  [roomChoiceTextKey('the-screenshot', 'confront-tom')]: 'Jděte nejdřív za Tomem: „řekneš jí to ty, nebo to řeknu já.“',
  [roomChoiceHintKey('the-screenshot', 'confront-tom')]: 'Dejte mu volbu, s lhůtou',
  [roomChoiceOutcomeKey('the-screenshot', 'confront-tom', 0)]:
    'Tom smlouvá, zlehčuje — „jsou to jenom zprávy“ — a pak prosí.',
  [roomChoiceOutcomeKey('the-screenshot', 'confront-tom', 1)]:
    'Zjistíte, že ultimátum je slib, který musíte být skutečně ochotní dodržet. Místnost vás donutí rozhodnout se hned na místě, jestli jste.',
  [roomChoiceTextKey('the-screenshot', 'stay-out')]: '„Není to můj vztah.“ Smažte to.',
  [roomChoiceHintKey('the-screenshot', 'stay-out')]: 'Zůstat úplně mimo',
  [roomChoiceOutcomeKey('the-screenshot', 'stay-out', 0)]: 'Tajemství se smazat nedá. Nastěhuje se k vám.',
  [roomChoiceOutcomeKey('the-screenshot', 'stay-out', 1)]:
    'Každé srocení party teď má zeď — a postavili jste ji vy, kolem sebe.',
  [roomChoiceTextKey('the-screenshot', 'verify-first')]: 'Nejdřív potichu ověřte, jestli jsou screenshoty pravé.',
  [roomChoiceHintKey('the-screenshot', 'verify-first')]: 'Mít jistotu, než začnete jednat',
  [roomChoiceOutcomeKey('the-screenshot', 'verify-first', 0)]:
    'Jsou pravé. A zatímco jste to ověřovali, dostali stejný airdrop další tři lidi.',
  [roomChoiceOutcomeKey('the-screenshot', 'verify-first', 1)]:
    'Důkladnost vás stála jedinou měnu, na které tu záleželo: být první, nebo mlčet.',
  [roomExplanationKey('the-screenshot', 0)]:
    '„Mám kamarádce říct, že ji partner podvádí?“ je každodenní verze problému s tramvají: každá možnost přesune tu škodu jinam, a nedělat nic je taky volba, jen s vlastním směrem. Výzkum chování přihlížejících ukazuje, že se zodpovědnost rozptýlí ve chvíli, kdy může jednat víc než jeden člověk — „udělá to někdo jiný“ si myslí naráz celá místnost lidí. Zůstat mimo není neutrální; je to potichu odevzdaný hlas pro to, aby všechno zůstalo, jak je.',
  [roomNoteTitleKey('the-screenshot')]: 'Zdi, okna a přihlížející',
  [roomNoteThinkersKey('the-screenshot')]: 'Shirley Glass (2003) · Darley & Latané (1968)',
  [roomNoteBodyKey('the-screenshot')]:
    'Shirley Glassová popsala intimitu jako otázku architektury — kam směřují okna, kde stojí zdi. Tajemství uchovávané „pro něčí dobro“ je zeď postavená uvnitř přátelství, i když to přátelství samo zvenku vypadá netknuté. **Každá možnost v té třídě přesune škodu jinam; i „zůstat mimo“ je zeď, a bydlet za ní budete muset vy.** Výzkum Darleyho a Latanéové o přihlížejících — poprvé pozorovaný na tom, jak cizí lidé nezavolají o pomoc — platí stejně přesně i pro skupinový chat: zodpovědnost se rozptýlí ve chvíli, kdy může jednat víc než jeden člověk, dokud nepatří úplně nikomu. Jiný hotel, jiná zeď, stejní dva výzkumníci — některá zjištění vás sledují mezi budovami.',
});

// ---------- Act I: The Password ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-password', 0, 0)]:
    'Sára pláče, po hrozném týdnu: její minulý přítel ji podváděl, a pokud ji milujete, dáte jí heslo od telefonu.',
  [roomBeatKey('the-password', 0, 1)]:
    'Podává se to — upřímně, zevnitř jejího strachu — jako blízkost. Část vás ten rámec cítí a táhne se k němu; to, že to chcete dát, z vás nedělá hlupáka.',
  [roomBeatKey('the-password', 0, 2)]:
    'A jiná část vás pod tou touhou zaznamenává něco, co zní přesně jako otáčející se zámek.',
  [roomBeatKey('the-password', 0, 3)]:
    '„Co máš co skrývat?“ zeptá se, a ta otázka je postavená tak, že jakákoli odpověď zní jako přiznání.',
  [roomBeatKey('the-password', 0, 4)]:
    'Vrátný: Klíč daný pod tlakem lhůty otevírá jiné dveře než klíč daný svobodně. Stejný kov. Jiná místnost.',
  [roomChoiceTextKey('the-password', 'give-it')]: 'Dejte jí heslo.',
  [roomChoiceHintKey('the-password', 'give-it')]: 'Uzavřete vzdálenost, o kterou vás žádá',
  [roomChoiceOutcomeKey('the-password', 'give-it', 0)]: 'Místnost to krátkodobě upřímně odmění: změkne, týden se zahojí.',
  [roomChoiceOutcomeKey('the-password', 'give-it', 1)]:
    'O měsíc později se přistihnete, jak si zprávy kamarádům předem cenzurujete, než je odešlete. Dohled máte teď v palcích, a nikdo vás nežádal, abyste si ho tam nainstalovali.',
  [roomChoiceTextKey('the-password', 'refuse-flat')]: 'Ne. Prostě ne.',
  [roomChoiceHintKey('the-password', 'refuse-flat')]: 'Nepovolit',
  [roomChoiceOutcomeKey('the-password', 'refuse-flat', 0)]: 'Hádka, která přijde, je opravdová a stojí to kus vztahu.',
  [roomChoiceOutcomeKey('the-password', 'refuse-flat', 1)]:
    'Místnost nepředstírá, že hranice jsou zadarmo. Jen trvá na tom, že jsou nosné.',
  [roomChoiceTextKey('the-password', 'transparency-not-surveillance')]: '„Ptej se mě na cokoli, kdykoli. Zámek zůstává.“',
  [roomChoiceHintKey('the-password', 'transparency-not-surveillance')]: 'Nabídnout otevřenost bez vydání klíče',
  [roomChoiceOutcomeKey('the-password', 'transparency-not-surveillance', 0)]:
    'Ten rozdíl dojde pomalu, ne v místnosti, ale během následujících týdnů.',
  [roomChoiceOutcomeKey('the-password', 'transparency-not-surveillance', 1)]:
    'Nejlepší dveře, které jsou k dispozici, a přesto ne bezbolestné — důvěra se tu buduje ručně, ne klíči.',
  [roomChoiceTextKey('the-password', 'demand-hers')]: '„Fajn — tak tvoje taky.“',
  [roomChoiceHintKey('the-password', 'demand-hers')]: 'Opětovat požadavek, místo abyste ho vyřešili',
  [roomChoiceOutcomeKey('the-password', 'demand-hers', 0)]:
    'Vzájemně zaručený dohled: dva lidé si čtou poštu toho druhého ve vedlejších pokojích.',
  [roomChoiceOutcomeKey('the-password', 'demand-hers', 1)]: 'Místnost nechá ticho toho uspořádání mluvit samo za sebe.',
  [roomExplanationKey('the-password', 0)]:
    'Žádosti „dokázat“ lásku sledováním eskalují z jednoduchého důvodu: kontrola něčího telefonu okamžitě uleví úzkosti, a to naučí úzkostnou mysl ptát se dál. Je to dobře zdokumentovaná smyčka hledání ujištění — úleva teď, horší strach potom, dokola. Užitečné rozlišení není o tom, jak moc někoho milujete; je mezi transparentností, která se nabízí, a dohledem, který se vynucuje. Jedním z raných varovných signálů kontrolujícího chování je přesně tohle: péče, která přichází s přiloženou lhůtou.',
  [roomNoteTitleKey('the-password')]: 'Klíč pod nátlakem',
  [roomNoteThinkersKey('the-password')]: 'výzkum donucovací kontroly · studie hledání ujištění',
  [roomNoteBodyKey('the-password')]:
    'Sledování na pár hodin uklidní toho, kdo sleduje, a za měsíce rozleptá oba — to je dobře opakovaně potvrzený tvar smyčky hledání ujištění, a vysvětluje, proč „dokazování“ důvěry přístupem málokdy zůstane u jednoho gesta. **Kontrola si na začátek skoro vždycky obléká kostým péče; spolehlivé poznávací znamení není samotný požadavek, ale to, co se stane ve chvíli, kdy řeknete ne.** Klinická práce o donucovací kontrole označuje sledování za jednu z jejích nejranějších, nejsnáze omluvitelných podob — přesně proto, že si půjčuje jazyk lásky. Nic z toho neznamená, že strach za tím požadavkem je předstíraný; znamená to, že si ten strach zaslouží lepší odpověď než klíč. Zámky jsou upřímné. Lhůty ne.',
});

// ---------- Act I: The Party ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-party', 0, 0)]:
    'Sára je tenhle víkend na návštěvě u babičky. Na párty se hraje láhev na líbání, a ta láhev — roztočená naživo, všichni nahlas počítají otáčky — se zastaví na vás a na Kláře z paralelky.',
  [roomBeatKey('the-party', 0, 1)]:
    'Výmluvy přicházejí jedna po druhé, každá sama o sobě naprosto rozumná: je to jen hra. Kdyby to viděla ve správném kontextu, smála by se tomu. Všichni koukají, což to nějak dělá míň skutečným, ne víc.',
  [roomBeatKey('the-party', 0, 2)]:
    'Nepočítá se to — cítíte, jak se ta věta skládá dohromady, kousek po kousku, ještě než jste se vůbec o čemkoli rozhodli.',
  [roomBeatKey('the-party', 0, 3)]:
    'Místnost plná zvednutých telefonů. Tady se nahrává úplně všechno; taková je prostě fyzika párty na Přízemí.',
  [roomBeatKey('the-party', 0, 4)]:
    'Klára pokrčí rameny, laskavě a naprosto v klidu — jí je to tak jako tak jedno, a to nějak dělá ten okamžik zároveň menším i větším.',
  [roomBeatKey('the-party', 0, 5)]:
    'Vrátný: „Prostě se to stalo“ se skládá dopředu, kousek po kousku. Právě teď se díváte na tu montážní linku.',
  [roomChoiceTextKey('the-party', 'play-and-bury')]: 'Splňte tu výzvu. Nikomu nic neříkejte.',
  [roomChoiceHintKey('the-party', 'play-and-bury')]: 'Ať je to potichu nic',
  [roomChoiceOutcomeKey('the-party', 'play-and-bury', 0)]: 'Ten polibek je nic. To zahrabávání je něco.',
  [roomChoiceOutcomeKey('the-party', 'play-and-bury', 1)]:
    'Telefony byly zvednuté. Někde, v něčí kapse, se rozsvítí displej, neodeslaný — zatím.',
  [roomChoiceTextKey('the-party', 'play-and-tell')]: 'Splňte to. Řekněte to Sáře sami, dnes večer.',
  [roomChoiceHintKey('the-party', 'play-and-tell')]: 'Ať to od vás slyší jako první',
  [roomChoiceOutcomeKey('the-party', 'play-and-tell', 0)]:
    'Její reakce je její vlastní — ublížená, a pak podivně usazená tím, že jí to řekl někdo první.',
  [roomChoiceOutcomeKey('the-party', 'play-and-tell', 1)]:
    'To přiznání stojí míň, než by stálo zjištění. Místnost vám ten rozdíl ukáže poctivě, vedle sebe.',
  [roomChoiceTextKey('the-party', 'refuse')]: 'Odmítněte tu výzvu. Vydržte posměch.',
  [roomChoiceHintKey('the-party', 'refuse')]: 'Vydržet třicet vteřin výsměchu',
  [roomChoiceOutcomeKey('the-party', 'refuse', 0)]:
    'Třicet vteřin pošklebování, které se zevnitř cítí jako hodina.',
  [roomChoiceOutcomeKey('the-party', 'refuse', 1)]:
    'Pak párty jede dál, protože párty prostě jedou dál. Někdo, koho jste si nevšimli, si všiml vás.',
  [roomChoiceTextKey('the-party', 'leave')]: 'Prostě z párty odejděte.',
  [roomChoiceHintKey('the-party', 'leave')]: 'Sundat se z té montážní linky',
  [roomChoiceOutcomeKey('the-party', 'leave', 0)]: 'Studený vzduch venku, jako celý, nespěchající okamžik.',
  [roomChoiceOutcomeKey('the-party', 'leave', 1)]:
    'Nic se nestalo — a zjistíte, že „nic se nestalo“ může být věc, kterou jste udělali, a ne jen věc, které jste se vyhnuli.',
  [roomExplanationKey('the-party', 0)]:
    'Psycholog Albert Bandura zkoumal, jak si mysl píše vlastní výmluvy dopředu, ještě před činem, ne až po něm — sadu mechanismů „morálního odpoutání“ (nazvat to hrou, srovnávat to s horšími věcmi, rozložit zodpovědnost na celou místnost), které předem udělají volbu menší, než doopravdy je. Alkohol to ještě prohlubuje takzvanou „myopií“: cokoli je přímo před vámi, zesílí, a důsledky, které jsou dál, zeslábnou. Ani jeden z těchhle faktů nic neomlouvá — jen vysvětlují, proč „byla to jenom hra“ funguje skoro na každého kromě toho, komu se to stalo.',
  [roomNoteTitleKey('the-party')]: 'Montáž věty „prostě se to stalo“',
  [roomNoteThinkersKey('the-party')]: 'Bandura (1999) · Steele & Josephs (1990)',
  [roomNoteBodyKey('the-party')]:
    'Bandura pojmenoval konkrétní myšlenkové tahy, kterými lidé jednají proti vlastním hodnotám, aniž by měli pocit, že to dělají: eufemistické pojmenování („je to jen hra“), rozptýlení zodpovědnosti („to dělá každý“) a výhodné srovnání („to není jako bych—“). Nic z toho se neděje až po činu, jako úklid; **skládá se to dopředu, kousek po kousku, a „prostě se to stalo“ je hotový výrobek procesu, který po cestě míjel spoustu rozhodných bodů.** Výzkum Steela a Josephse o alkoholové myopii přidává stmívač: opilost neodstraní úsudek tak, jako spíš zúží jeho zorné pole na to nejhlasitější v místnosti. Do tohohle hotelu se nikdy nikdo nechtěl ubytovat úmyslně.',
});

// ---------- Act I: The Forward ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-forward', 0, 0)]:
    'Pípnutí ve třídním chatu. Fotka, která do tohohle chatu nikdy neměla patřit, přeposlaná někým, komu Ema věřila.',
  [roomBeatKey('the-forward', 0, 1)]:
    'Chat dělá to, co chaty dělají: vtipy, screenshoty screenshotů, tři lidi píšou zprávu najednou. Váš palec se vznáší nad klávesnicí, zatím se nerozhodujete pro nic.',
  [roomBeatKey('the-forward', 0, 2)]:
    'Smích scrolluje kolem v reálném čase — tucet zpráv za tu dobu, co si přečtete tři.',
  [roomBeatKey('the-forward', 0, 3)]: 'Ema je s vámi na matice. Ona to ještě neví. Pořád myslíte na druhou hodinu.',
  [roomBeatKey('the-forward', 0, 4)]:
    'Vrátný: Každý v tom chatu si namlouvá, že je jen divák. Přesně diváky tohle celé funguje.',
  [roomChoiceTextKey('the-forward', 'delete-only')]: 'Smažte to. Neříkejte nic.',
  [roomChoiceHintKey('the-forward', 'delete-only')]: 'Potichu se z toho vyvázat',
  [roomChoiceOutcomeKey('the-forward', 'delete-only', 0)]: 'Vaše ruce jsou čisté. Nic jiného není.',
  [roomChoiceOutcomeKey('the-forward', 'delete-only', 1)]:
    'Chat scrolluje dál. Někde místnost potichu počítá dalších třicet devět diváků, kteří nesmazali nic.',
  [roomChoiceTextKey('the-forward', 'report')]: 'Nahlaste to — platformě, i dospělému ve škole.',
  [roomChoiceHintKey('the-forward', 'report')]: 'Zapojte někoho s autoritou',
  [roomChoiceOutcomeKey('the-forward', 'report', 0)]:
    'Dospělí jednají pomaleji než chat a rychleji než nic. Odesílatele nakonec dostihnou následky.',
  [roomChoiceOutcomeKey('the-forward', 'report', 1)]:
    'Chat vás týden pomlouvá. Místnost nechá tu cenu být skutečnou — a přesto stát za to.',
  [roomChoiceTextKey('the-forward', 'tell-ema-first')]: 'Napište nejdřív Emě, ať to není poslední, kdo se to dozví.',
  [roomChoiceHintKey('the-forward', 'tell-ema-first')]: 'Dejte jí varování, které jí nikdo jiný nedá',
  [roomChoiceOutcomeKey('the-forward', 'tell-ema-first', 0)]:
    'Nejtěžší zpráva, jakou jste kdy napsali. Její odpověď má dvě slova.',
  [roomChoiceOutcomeKey('the-forward', 'tell-ema-first', 1)]:
    'O léta později — záblesk do budoucnosti, který si Přízemí dovolí jen málokdy — si pořád pamatuje, kdo jí to řekl. Vzácná, jednoznačná laskavost téhle místnosti. Pořád ne bezbolestná.',
  [roomChoiceTextKey('the-forward', 'confront-publicly')]: 'Vyzvěte odesílatele přímo v chatu.',
  [roomChoiceHintKey('the-forward', 'confront-publicly')]: 'Udělejte to viditelným',
  [roomChoiceOutcomeKey('the-forward', 'confront-publicly', 0)]:
    'Chat se obrátí proti němu. Pak proti samotnému dramatu. Pak — místnost je tady upřímná — částečně zase proti Emě.',
  [roomChoiceOutcomeKey('the-forward', 'confront-publicly', 1)]:
    'Veřejná konfrontace je tupý nástroj. Zasáhne víc lidí, ne vždycky ty, na které jste mířili.',
  [roomExplanationKey('the-forward', 0)]:
    'Souhlas být vyfocen, natočen nebo nahrán se nepřenáší spolu se souborem — každé přeposlání je vlastní, nový čin, ne pokračování něčího jiného. Ve většině právních řádů je sdílení intimních fotek bez souhlasu závažný trestný čin, a to platí pro každého, kdo je přeposílá, ne jen pro toho, kdo je poslal jako první. Co té osobě na fotce doopravdy pomůže, je dobře zdokumentované a neokázalé: přímé sdělení, bezvýhradná víra a dospělí, kteří jednají rychle.',
  [roomNoteTitleKey('the-forward')]: 'Čtyřicátý divák',
  [roomNoteThinkersKey('the-forward')]: 'výzkum nedobrovolného sdílení fotografií · právní realita',
  [roomNoteBodyKey('the-forward')]:
    'Tohle je ta jedna poznámka na okraji v celém hotelu, která si může dovolit být otevřená ohledně zákona: ve většině právních řádů je přeposlání intimní fotografie bez souhlasu dotyčné osoby závažný trestný čin — pro každého, kdo ji přepošle, ne jen pro toho, kdo ji poslal jako první. Výzkum újmy z obrazového zneužití zjišťuje, že se poškození násobí s každým dalším divákem; **škoda není ta původní fotka, škodou je publikum, a to publikum roste pokaždé, když někdo klepne na přeposlat.** Výzkum proměny přihlížejícího v jednajícího je jednotný v tom, co doopravdy pomáhá: přímé, včasné varování dotyčné osoby a dospělí, kteří zasáhnou rychle, ne potichu. Původní odesílatel stiskl jedno tlačítko. Stejně tak každý po něm.',
});

// ---------- Act I: The Best Friend's Girl ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-best-friends-girl', 0, 0)]:
    'Obyčejný večer učení u Toma. Nadia sedí na zemi nad domácím úkolem, napůl poslouchá. Tohle by neměla být komplikovaná místnost.',
  // beat 1 is a function beat — registered below via register().
  [roomBeatKey('the-best-friends-girl', 0, 2)]:
    'Pak přijde na řadu inventura věrnosti: všechno, čím pro vás Tom kdy byl, každá laskavost, každý telefonát ve dvě ráno, rozložené jako důkazy pro případ, o kterém jste nevěděli, že ho stavíte.',
  [roomBeatKey('the-best-friends-girl', 0, 3)]:
    '[zastávka autobusu, minulé úterý — její rukáv se otřel o váš, úplnou náhodou, přehráváno pořád dokola, ve smyčce bez vypínače]',
  [roomBeatKey('the-best-friends-girl', 0, 4)]:
    'Aritmetika znamení: byl to pohled, nebo jen náhodou padlé oko? Místnost vás nechá tu matematiku spočítat a pak vám ji poctivě opraví — ta matematika je nespolehlivá, a stejně ji počítáte dál.',
  [roomBeatKey('the-best-friends-girl', 0, 5)]:
    'Vrátný: Stav, ve kterém jste, má klinický název, zdokumentovaný průběh a žádný volant. Vaše chování ale volant má.',
  [roomChoiceTextKey('the-best-friends-girl', 'confess-to-her')]: 'Řekněte to Nadie.',
  [roomChoiceHintKey('the-best-friends-girl', 'confess-to-her')]: 'Řekněte to té, o kom to je',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'confess-to-her', 0)]:
    'Ať cítí cokoli — místnost to poctivě nechává v nejistotě, půlvteřina není smlouva — celé to souhvězdí teď má prasklinu.',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'confess-to-her', 1)]:
    'Tomovo příští „jsi v pohodě?“ udeří jako zvon, který se nedá odzvonit.',
  [roomChoiceTextKey('the-best-friends-girl', 'starve-it')]: 'Odstup. Žádné drama, žádné vysvětlování.',
  [roomChoiceHintKey('the-best-friends-girl', 'starve-it')]: 'Ať to potichu vyhladoví',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'starve-it', 0)]:
    'Vyhladovělá limerence je nejdřív hlasitá limerence — ty vtíravé myšlenky se chvíli zhoršují, než se zlepší.',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'starve-it', 1)]:
    'Pak, během týdnů, vyprchají. Poctivá cena za poctivou možnost.',
  [roomChoiceTextKey('the-best-friends-girl', 'tell-tom')]: 'Řekněte Tomovi pravdu o tom citu.',
  [roomChoiceHintKey('the-best-friends-girl', 'tell-tom')]: 'Svěřte se s tím kamarádovi',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'tell-tom', 0)]:
    'Nejstatečnější věta na tomhle patře. Tomovo ticho, a pak: „dobrý. díky, žes to řekl mně a ne jí.“',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'tell-tom', 1)]:
    'Přátelství přežije, změněné — zeď nahrazená oknem, za cenu trochy pohodlí.',
  [roomChoiceTextKey('the-best-friends-girl', 'test-the-evening')]: 'Zinscenujte jeden nejednoznačný večer, abyste to zjistili.',
  [roomChoiceHintKey('the-best-friends-girl', 'test-the-evening')]: 'Vyrobte si vlastní odpověď',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'test-the-evening', 0)]:
    'Zinscenovaná nejednoznačnost vrátí nejednoznačnost, ještě větší.',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'test-the-evening', 1)]:
    'Teď půlvteřiny počítají dva lidi. Místnost odmítá říct, kdo z vás s tím začal.',
  [roomExplanationKey('the-best-friends-girl', 0)]:
    'Limerence je mimovolní stav — nevybíráte si ho o nic víc, než si vybíráte horečku — ale to, co uděláte dál, je pořád úplně vaše volba. Čtení znamení (byl to pohled, byl to smích) se tváří jako sbírání důkazů, a přitom je to obvykle blíž psaní beletrie; mysl v limerenci je extrémně dobrá v hledání potvrzení pro to, čemu už chce věřit. Užitečná věta, které se držet: za ten cit se nemusíte stydět. Za chování se ale musíte zodpovídat.',
  [roomNoteTitleKey('the-best-friends-girl')]: 'Stav bez volantu',
  [roomNoteThinkersKey('the-best-friends-girl')]: 'Tennov (1979) · Schmitt & Buss (2001)',
  [roomNoteBodyKey('the-best-friends-girl')]:
    'Tennov ve svém původním výzkumu přesně zmapovala průběh limerence: nástup, krystalizaci a — bez péče — úpadek, typicky během šesti měsíců až dvou let. Není to metafora pro zamilování; je to zdokumentovaný psychologický stav s vtíravým myšlením jako svým hlavním, měřitelným příznakem. Výzkum „přetahování partnerů“ (Schmitt & Buss) zkoumal přesně tenhle trojúhelník ze všech tří rohů — toho, koho přitahuje zadaný člověk, toho zadaného, a toho, kdo o tom ještě neví — a zjistil, že skutečné náklady dopadají na všechny tři, ať se stane cokoli dál. **City jsou tady počasí; frontu, která přechází, jste si nevybrali, ale pořád jste to vy, kdo drží deštník, nebo ne.** Každý host, který kdy shořel přátelství, přísahal, že ten smích byl znamení.',
});

register(roomBeatKey('the-best-friends-girl', 0, 1), 'v2', 'cs', (s: RunState) =>
  s.axes.controlAcceptance < 0
    ? '[ten půlvteřinový smích, přehraný znovu — napočítali jste ho už jedenáctkrát, a to číslo vás nenechá spát]'
    : '[ten půlvteřinový smích, přehraný znovu — všimnete si, že počítáte, a všimnete si i toho všímání]',
);

// ---------- Act I: The Summer Ends ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-summer-ends', 0, 0)]:
    'Vysoká v jiném městě začíná za tři týdny. Balení probíhá po položkách, skoro obřadně — co jde do krabice, je muzeum toho vztahu, kurátorované ručně.',
  [roomBeatKey('the-summer-ends', 0, 1)]:
    'Každý má názor a každý ho nabídne, i bez vyzvání: vaše máma, její sestra, skupinový chat, cizí člověk na párty, co v roce 2003 chodil s někým na dálku.',
  [roomBeatKey('the-summer-ends', 0, 2)]:
    'Pod tou logistikou se skrývá ta skutečná otázka, na kterou se už tři týdny nikdo nezeptal: co přesně znamená září pro vás dva.',
  // beat 3 is a function beat — registered below via register().
  [roomBeatKey('the-summer-ends', 0, 4)]:
    'Vrátný: Tuhle si hosté rozhodnou většinou už na chodbě. Místnost je jen donutí říct to nahlas.',
  [roomChoiceTextKey('the-summer-ends', 'promise-ldr')]: 'Slibte vztah na dálku, o kterém všichni tvrdí, že to nevydrží.',
  [roomChoiceHintKey('the-summer-ends', 'promise-ldr')]: 'Zavažte se napříč vzdáleností',
  [roomChoiceOutcomeKey('the-summer-ends', 'promise-ldr', 0)]:
    'Slib je skutečný, a skutečné jsou i statistiky. Místnost odmítá prozradit, kterým z těch dvou se nakonec ukážete být.',
  [roomChoiceTextKey('the-summer-ends', 'end-clean')]: 'Ukončete to teď, v ten nejlepší den, ne v ten nejhorší.',
  [roomChoiceHintKey('the-summer-ends', 'end-clean')]: 'Zvolte konec, místo abyste na nějaký čekali',
  [roomChoiceOutcomeKey('the-summer-ends', 'end-clean', 0)]: 'Podivná důstojnost zvoleného konce. Smutek bez padoucha.',
  [roomChoiceOutcomeKey('the-summer-ends', 'end-clean', 1)]:
    'Místnost si potichu poznamená, že „včas“ je místo, odkud skoro nikdo neumí odejít.',
  [roomChoiceTextKey('the-summer-ends', 'drift')]: 'Neslibujte nic. Nechte to vyhasnout.',
  [roomChoiceHintKey('the-summer-ends', 'drift')]: 'Úplně se vyhnout tomu rozhovoru',
  [roomChoiceOutcomeKey('the-summer-ends', 'drift', 0)]:
    'Zbabělá cesta, poctivě naceněná: žádná scéna, žádný konec.',
  [roomChoiceOutcomeKey('the-summer-ends', 'drift', 1)]:
    'O osmnáct měsíců později pořád nemáte slovo pro to, čím jste si byli. Nedokončená věta vás sleduje dál.',
  [roomChoiceTextKey('the-summer-ends', 'open-until-christmas')]:
    'Navrhněte uspořádání, kterému ani jeden z vás zatím nerozumí.',
  [roomChoiceHintKey('the-summer-ends', 'open-until-christmas')]: '„otevřený“, nedefinováno',
  [roomChoiceOutcomeKey('the-summer-ends', 'open-until-christmas', 0)]:
    'Slovo „otevřený“ musí unést víc, než kolik toho ve svých osmnácti dokážete zvednout vy dva dohromady.',
  [roomChoiceOutcomeKey('the-summer-ends', 'open-until-christmas', 1)]:
    'Podmínky zůstávají dnes večer nedefinované — a budou se bolestně probírat znovu, ještě než ten rok skončí.',
  [roomExplanationKey('the-summer-ends', 0)]:
    'Rusbultové investiční model redukuje otázku „proč lidé zůstávají, nebo odcházejí“ na tři jednoduché složky: spokojenost (jak dobře se to cítí), investici (kolik jste do toho vložili — čas, vzpomínky, plány) a alternativy (co jiného, nebo kdo jiný, se zdá dostupný). Vztahy často pokračují nebo končí z důvodů, které mají velmi málo společného s tím, kolik lásky je v nich přítomno — dobře investovaný, jen mírně uspokojivý vztah dokáže přetrvat déle než blažený vztah s nízkou investicí. Žádné z těch čtyř dveří tady není „správné“; model jen vysvětluje, proč je každá z nich skutečná, konzistentní volba, ne morální selhání.',
  [roomNoteTitleKey('the-summer-ends')]: 'Aritmetika setrvávání',
  [roomNoteThinkersKey('the-summer-ends')]: 'Caryl Rusbult (1980)',
  [roomNoteBodyKey('the-summer-ends')]:
    'Rusbultové investiční model podkládá závazek zdánlivě jednoduchou rovnicí: spokojenost plus investice minus alternativy. Tenhle model obstál pozoruhodně dobře napříč desetiletími výzkumu, a jeho nejnepříjemnější důsledek je tento — **lidé ve vztazích zůstávají, i je opouštějí, z důvodů, které často nemají nic společného s tím, jestli je přítomná láska.** Silně investovaný vztah dokáže přežít roky za hranicí spokojenosti; sotva investovaný může skončit ve chvíli, kdy se objeví něco lepšího, bez ohledu na to, jak se cítil. Tohle je první skutečné vystoupení tohoto modelu v hotelu; místnost před svatbou ve III. dějství ho sklidí naplno, až bude mít investice deset let na to, aby se nabalila. Kufr byl sbalený tak jako tak. Jen se změnil štítek.',
});

register(roomBeatKey('the-summer-ends', 0, 3), 'v2', 'cs', (s: RunState) =>
  s.flags.includes('gave-the-key')
    ? 'Vzpomenete si na heslo, na ten měsíc, než jste přestali cenzurovat zprávy dopředu. Ať teď slíbíte cokoli, už víte, co stojí slíbit něco ze strachu, ne z jistoty.'
    : s.flags.includes('it-didnt-count')
      ? 'Vzpomenete si na tu párty — na tu větu, kterou jste si postavili a nikdy jí neřekli. Ať teď slíbíte cokoli, kus té roční váhy pojede s vámi, ať už o tom ví, nebo ne.'
      : 'To, co jste si oba přáli, jednou, na samém začátku roku, se cítí zároveň blíž i dál než tři týdny.',
);

// ---------- Act I: The Rumor (gate) ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-rumor', 0, 0)]:
    'Škola tvrdí, že Sára na víkendu u jezera podvedla. Důkazy: jedna rozmazaná story, dva kamarádi kamarádů a její zvláštní mlčenlivost od neděle.',
  [roomBeatKey('the-rumor', 0, 1)]:
    'Vypíšete si, co doopravdy víte, a pak — místnost na tom trvá taky — co nevíte. Oba seznamy jsou kratší než ta fáma.',
  [roomBeatKey('the-rumor', 0, 2)]:
    'To, co s vámi to nevědění dělá, hodinu po hodině, je vlastní malá případová studie, a vy jste zároveň jejím předmětem i jediným svědkem.',
  [roomBeatKey('the-rumor', 0, 3)]:
    'Její zpráva leží na displeji nezodpovězená: „co se děje?“ Přečetli jste si ji jedenáctkrát a odpověděli jste na ni nula.',
  [roomBeatKey('the-rumor', 0, 4)]:
    'Nabízejí se tři možné podoby, a žádná z nich není pohodlná: zeptat se jí přímo, obezřetně se poptat kolem ní, nebo nastražit past a sledovat, co do ní vleze.',
  [roomBeatKey('the-rumor', 0, 5)]:
    'Vrátný: Existují zkoušky, které něco měří, a zkoušky, které to samy vytvářejí. Recepce ty první přestala skladovat. Hosté o ně nikdy nežádali.',
  [roomChoiceTextKey('the-rumor', 'trust-without-asking')]: 'Dejte jí veškerou výhodu pochybnosti, celou. Nikdy se neptejte.',
  [roomChoiceHintKey('the-rumor', 'trust-without-asking')]: 'Zvolte si nevědět',
  [roomChoiceOutcomeKey('the-rumor', 'trust-without-asking', 0)]:
    'Budete žít s tím, že se to nikdy nedozvíte — natrvalo. Žádná pozdější místnost tohle nevyřeší; žádná to nikdy neudělá.',
  [roomChoiceOutcomeKey('the-rumor', 'trust-without-asking', 1)]:
    'Ukáže se, že důvěra, chápaná jako rozhodnutí, ne jako závěr, je těžší, než zní. Místnost tu váhu poctivě odváží a nepředstírá, že je malá.',
  [roomChoiceTextKey('the-rumor', 'ask-her-plainly')]:
    'Odpovězte na její zprávu. Řekněte jí, co jste slyšeli, jednou, na rovinu — a pak přijměte její odpověď.',
  [roomChoiceHintKey('the-rumor', 'ask-her-plainly')]: 'Otázka, bez soudní síně kolem ní',
  [roomChoiceOutcomeKey('the-rumor', 'ask-her-plainly', 0)]:
    'Na jedenáctkrát přečtenou zprávu odpovíte jednou větou: co jste slyšeli, řečeno jednou, bez soudní síně kolem toho.',
  [roomChoiceOutcomeKey('the-rumor', 'ask-her-plainly', 1)]:
    'Řekne vám, co se stalo. Nemůžete si to ověřit a ani se o to nepokoušíte — to nikdy nebyla dohoda, kterou jste právě uzavřeli. Otázka, položená na rovinu, dostane odpověď; nedostane detektor lži.',
  [roomChoiceOutcomeKey('the-rumor', 'ask-her-plainly', 2)]:
    'Teď navíc ví něco, co před hodinou nevěděla: že se ta fáma dostala i k vám a bydlela ve vás tak dlouho, dokud jste konečně nenapsali zpátky. I to něco stálo.',
  [roomChoiceTextKey('the-rumor', 'interrogate')]: 'Vyslechněte ji do detailu. Data, jména, podrobnosti.',
  [roomChoiceHintKey('the-rumor', 'interrogate')]: 'Žádejte kompletní zprávu',
  [roomChoiceOutcomeKey('the-rumor', 'interrogate', 0)]:
    'Odpovědi přijdou, a s nimi i škoda — samotné otázky jí přesně sdělí, za koho ji máte.',
  [roomChoiceOutcomeKey('the-rumor', 'interrogate', 1)]:
    'Ať se pravda ukáže být jakákoli, ten výslech teď bude ve vztahu navždy, jako trvalá součást zařízení.',
  [roomChoiceTextKey('the-rumor', 'set-the-trap')]: 'Řekněte jí smyšlenou podrobnost — takovou, kterou by opravil jen ten, kdo je vinen.',
  [roomChoiceHintKey('the-rumor', 'set-the-trap')]: 'Nastražte past a sledujte ji',
  [roomChoiceOutcomeKey('the-rumor', 'set-the-trap', 0)]: 'Past funguje. Místnost ji nechá fungovat.',
  [roomChoiceOutcomeKey('the-rumor', 'set-the-trap', 1)]:
    'Ta znalost přijde ve stejné obálce jako tohle: teď jste někdo, kdo nastražuje pasti na lidi, které miluje. Obě fakta jsou trvalá. Poslední brána vám je přečte zpátky, doslova.',
  [roomChoiceTextKey('the-rumor', 'ask-the-accuser')]: 'Jděte ke zdroji: „co z tohohle máš ty?“',
  [roomChoiceHintKey('the-rumor', 'ask-the-accuser')]: 'Zpochybněte motor té fámy, ne ji',
  [roomChoiceOutcomeKey('the-rumor', 'ask-the-accuser', 0)]:
    'Vzácné třetí dveře. Odhalí se skutečný motor té fámy — zášť, nudný víkend, špatně přečtená fotka.',
  [roomChoiceOutcomeKey('the-rumor', 'ask-the-accuser', 1)]:
    'Ne tak docela očištění, ale objev s delším poločasem rozpadu: otázka „je to pravda?“ měla celou dobu staršího sourozence — „komu to prospívá?“',
  [roomExplanationKey('the-rumor', 0)]:
    'Konfirmační zkreslení znamená, že jakmile mysl začne podezírat, je velmi dobrá v hledání důkazů pro to podezření a velmi špatná ve všímání si důkazů proti němu — psycholog Raymond Nickerson to zdokumentoval jako jedno z nejpevnějších zjištění v oboru. „Othellův test“ popisuje příbuznou past: samotný akt testování něčí viny dokáže vyvolat chování, které vypadá přesně jako vina, ať už nějaká existuje, nebo ne — pojmenováno podle toho, jak si Othellovo podezření samo vyrábí důkazy, které ho zničí. „Výhoda pochybnosti“ není zadarmo; stojí jistotu, kterou byste získali zeptáním se, a kupuje vztahu šanci přežít nevědění.',
  [roomNoteTitleKey('the-rumor')]: 'Zkouška, která si sama vytváří výsledek',
  [roomNoteThinkersKey('the-rumor')]: 'Nickerson (1998) · Othello (1603)',
  [roomNoteBodyKey('the-rumor')]:
    'Nickersonův přehled výzkumu konfirmačního zkreslení je jednoznačný: jakmile je přesvědčení jednou na místě, mysl pro něj verbuje důkazy mnohem ochotněji než důkazy proti němu — podezření se ve výchozím stavu samo živí, ne jen výjimečně. Othellova dynamika tu past ještě zaostří: zkouška navržená k odhalení viny dokáže vyrobit chování k nerozeznání od viny, u jednoho z vás nebo u druhého, a ta zkouška vám neřekne, u kterého. **Jistota o partnerovi, koupená sledováním nebo léčkou, se platí měnou, která znehodnocuje přesně ten vztah, o kterém tvrdí, že ho chrání.** Ze všech hostů, kteří nastražili past, každý jeden něco chytil. Ne všem se líbilo, co to nakonec bylo.',
});
