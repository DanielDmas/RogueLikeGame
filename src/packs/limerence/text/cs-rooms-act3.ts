// Czech translation of LIMERENCE's Act III room prose (beats, choice
// text/hint/outcome, field notes, plain-language explanations). Registered
// under version 'v2'. Follows the structural pattern established by
// src/packs/limerence/text/cs-rooms.ts (Act I) and cs-rooms-act2.ts (Act
// II) — see CLAUDE.md's "Translating content" rule: every line here was
// translated against the room's actual beats and each choice's stakes, not
// word-for-word. Act III's cast is 25-30, adults in long-established
// partnerships, engaged or married — a still franker, more settled register
// than Act II's; the prose leans into the exhaustion and precision of
// people who have been together long enough to know each other's
// silences, not into teenage drama or new-relationship hedging.
//
// Dana (the-colleague through the-second-account's, the-discovery's, and
// the-wedding-eve's/the-therapist's recurring partner) is Act III's
// equivalent of Act II's Jules: the English source leaves Dana's gender
// unspecified almost everywhere ("Dana had questions of their own", "the
// room replays their face"), so Dana is kept grammatically indeclinable
// here and referred to via nominalized/present-tense constructions or by
// repeating the bare name after a preposition ("s Dana", "výraz Dana"),
// exactly mirroring how cs-rooms-act2.ts handled Jules. Two or three lines
// in the English source do slip to "her"/"hers" for Dana (a the-colleague
// reflection, the-second-account's show-dana hint, a the-therapist
// reflection) against the much more consistent "their" used everywhere
// else (including the load-bearing the-discovery and the-wedding-eve
// beats) — read as an authorial inconsistency rather than a deliberate
// reveal, and normalized to the neutral treatment throughout, matching the
// character's evident design intent. Where a past-tense or
// dialogue-attributed verb genuinely cannot avoid gender agreement for
// Dana — or for the-veto's Sam, likewise left ambiguous in English
// ("a rule they never had any say in writing") — this file defaults to the
// masculine form, the same house convention set by cs-rooms.ts's
// "the-best-friends-girl" and continued in cs-rooms-act2.ts for Jules.
// The-therapist's Dr. Weiss is never gendered in the English source either
// and gets the same treatment. Rowan (the-colleague) and Petra
// (the-metamour, the-veto) are both explicitly gendered female in the
// English source ("she was standing at the same door"; "collateral in a
// dispute that was never actually about her") and decline as ordinary
// Czech feminine names/possessives throughout ("Rowanina odpověď",
// "Petřinu"-style constructions avoided in favor of "Petru"/"Petře" case
// forms), consistent with Sara/Mira/Alena's treatment in Act I/II.
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
import { pickShadowMoments } from '../../../engine/gameState';

/** Mirrors act3.ts's own seedSplit/seedSplit2 — same deterministic 50/50
 * splits on the run's doorSeed, so a translated branch always matches the
 * English branch it stands in for. Two independently-offset variants so
 * two branch points in the same room don't always land the same way. */
function seedSplit(s: RunState): boolean {
  return ((s.doorSeed ?? 0) * 2654435761) % 2 === 0;
}
function seedSplit2(s: RunState): boolean {
  return ((s.doorSeed ?? 0) * 40503 + 17) % 2 === 0;
}

// ---------- The Colleague ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-colleague', 0, 0)]:
    'Výtah stoupá. Čísla pater přibývají jako odpočítávání, které nikdo nespustil. Rowan je půl kroku za vámi, pořád se směje něčemu z baru dole.',
  [roomBeatKey('the-colleague', 0, 1)]:
    'Dva roky společné zkratky, mimovolně přehrané za čtyři vteřiny, než se zavřou dveře: protočené oči na poradách, ten dobrý podnik s kávou, věty, které dokončí ten druhý dřív, než je dokončíte sami.',
  [roomBeatKey('the-colleague', 0, 2)]:
    '„Ještě jednu, já mám pokoj s balkonem.“ Láhev, neotevřená, nabídnutá bez váhy — nebo přesně s tou váhou, kterou žádný z vás nepojmenovává.',
  [roomBeatKey('the-colleague', 0, 3)]:
    'Klíčová karta ve vaší ruce. Dokázali byste popsat její teplotu. Právě teď si ji popisujete, sami pro sebe, a to samo o sobě je malý kousek informace.',
  [roomBeatKey('the-colleague', 0, 4)]:
    'Dana spí dvě stě kilometrů odsud. Nic se nestalo. Chodba drží jeden celý úder ticha, ve kterém není nic než dech.',
  [roomBeatKey('the-colleague', 0, 5)]:
    'Vrátný (tentokrát ze služebních dveří): „Doma nemusí být nic špatně, aby byly dveře možné. To je nejlíp zdokumentovaná věta v celé téhle budově.“',
  [roomChoiceTextKey('the-colleague', 'the-balcony')]: 'Ještě jednu skleničku. Její pokoj.',
  [roomChoiceHintKey('the-colleague', 'the-balcony')]: 'Nechte tu zkratku dovést vás, kam vede',
  [roomChoiceOutcomeKey('the-colleague', 'the-balcony', 0)]:
    'Práh, záměrně sestřižený — cvaknutí zavíraných dveří je poslední věc, kterou místnost ukáže.',
  [roomChoiceOutcomeKey('the-colleague', 'the-balcony', 1)]:
    'Místo toho snídaně v hale druhý den ráno: dva kolegové, kteří hrají kolegy, nad špatnou kávou. To, co se přes noc stalo těžším, je vypsané po položkách, beze jediného výslovného obrazu — a je to těžší.',
  [roomChoiceTextKey('the-colleague', 'walk-away')]: '„Dobrou noc, Rowan.“ Váš vlastní pokoj. Sami.',
  [roomChoiceHintKey('the-colleague', 'walk-away')]: 'Nechte to nedramatické nic být celou tou událostí',
  [roomChoiceOutcomeKey('the-colleague', 'walk-away', 0)]:
    'Nedramatický konec, oceněný jako ten skutečný úspěch, kterým je. Váš pokoj. Strop. Neodeslané „jsi vzhůru?“, napsané a smazané.',
  [roomChoiceOutcomeKey('the-colleague', 'walk-away', 1)]:
    'Ospalá hlasová zpráva od Dana, přehraná dvakrát, z důvodu, který byste nahlas nedokázali vysvětlit. Odchod, podaný jako skutečná událost, ne jako pouhá nepřítomnost.',
  [roomChoiceTextKey('the-colleague', 'name-it-in-the-corridor')]:
    'Řekněte to nahlas, přímo tady: „tohle jsou dveře, a já je neotevřu.“',
  [roomChoiceHintKey('the-colleague', 'name-it-in-the-corridor')]: 'Pojmenujte tu věc, místo abyste ji obcházeli',
  [roomChoiceOutcomeKey('the-colleague', 'name-it-in-the-corridor', 0)]:
    'To pojmenování navždy změní tu společnou zkratku. Část z ní na místě umře, místnost ji poctivě oplakává, místo aby ji předstírala pryč.',
  [roomChoiceOutcomeKey('the-colleague', 'name-it-in-the-corridor', 1)]:
    'To, co přežije, je bezpečné si nechat. Rowanina odpověď — tichá, a pak úlevná — jí dává stejnou důstojnost: stála u týchž dveří jako vy.',
  [roomChoiceTextKey('the-colleague', 'postpone')]:
    'Dnes večer nic — ale nechte ty dveře v kalendáři odemčené. „Příští měsíc, ten výlet do Berlína…“',
  [roomChoiceHintKey('the-colleague', 'postpone')]: 'Rozhodnout se tím, že se nerozhodnete',
  [roomChoiceOutcomeKey('the-colleague', 'postpone', 0)]:
    'Nejupřímnější nepoctivá volba, jaká je dnes večer k mání: rozhodnutí skrze nerozhodnutí.',
  [roomChoiceOutcomeKey('the-colleague', 'postpone', 1)]:
    'Ta položka v kalendáři potichu svítí, stejným způsobem, jakým se rozsvítí telefon na pultu v pokoji o tři patra níž. Úzkost, přenesená do budoucna, i s úrokem.',
  [roomExplanationKey('the-colleague', 0)]:
    'Výzkum nevěr opakovaně zjišťuje, že příležitost — cestování, autonomie, trvalá blízkost — patří mezi nejsilnější strukturální prediktory, často důležitější než spokojenost ve vztahu. Esther Perelová k tomu přidává tvrdší pravdu: nevěra bývá často míň o partnerovi doma a víc o verzi sebe sama, po které bloudící člověk touží. „Jsme si prostě blízcí“ plus hotelová chodba o půlnoci je jiná chemická sloučenina než každá z těch dvou přísad zvlášť — a přesně proto se párům, které si za denního světla řeknou, co takové chodby znamenají, daří líp než těm, co to improvizují v 00:47.',
  [roomNoteTitleKey('the-colleague')]: 'Geometrie dveří',
  [roomNoteThinkersKey('the-colleague')]: 'Treas · Giesen (2000) · Esther Perel (2017)',
  [roomNoteBodyKey('the-colleague')]:
    'Výzkum nevěry od Treasové a Giesena zjistil, že strukturální příležitost — blízkost, soukromí, cestování — předpovídá nevěru zhruba stejně silně jako nespokojenost ve vztahu, někdy i silněji; pracoviště zůstává napříč desetiletími dat jediným nejčastějším místem, kde nevěra začíná, prostě proto, že nabízí trvalý, soukromý, opakovaný kontakt. Perelové příspěvek přerámuje to „proč“: **nevěra často není o partnerovi, kterého máte, ale o verzi sebe sama, po které toužíte** — o té, která existovala dřív než role, rutina a hypotéka. Ani jedno zjištění nic neomlouvá; obě vysvětlují, proč se párům, které si za denního světla řeknou, co znamená hotelová chodba, daří měřitelně líp než těm, co to nechají na improvizaci o půlnoci. Klíčová karta byla teplá, protože jste ji drželi vy. Všimněte si, kdo ji držel.',
});

// ---------- The Metamour ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-metamour', 0, 0)]:
    'Vy a Dana jste se před osmnácti měsíci otevřeli druhým, poctivě vyjednáno — místnost to říká na rovinu: tohle je verze v dobré víře, ne místnost postavená k tomu, aby ji trestala.',
  [roomBeatKey('the-metamour', 0, 1)]:
    'Petra — se kterou je Dana taky ve vztahu — začala přijíždět neohlášeně a právě podruhé přebookovala váš výroční týden. Barevně odlišený kalendář leží otevřený na pultu: důkaz číslo jedna.',
  [roomBeatKey('the-metamour', 0, 2)]:
    'Petra sama, když ji potkáte, je vřelá a upřímně sympatická — místnost na tom trvá, protože snadný padouch by vás tady nic užitečného nenaučil.',
  [roomBeatKey('the-metamour', 0, 3)]:
    'Slovo „hierarchie“, které jste si vy tři před osmnácti měsíci odpřísáhli, visí nad kalendářem, aniž by ho kdokoli vyslovil.',
  [roomBeatKey('the-metamour', 0, 4)]: 'Vaše vlastní žárlivost, poctivě prozkoumaná: signál, nebo šum, nebo — nepříjemně — obojí najednou.',
  [roomBeatKey('the-metamour', 0, 5)]:
    'Vrátný: „Apartmánová uspořádání selhávají ve švech, ne uprostřed. Recepce nikdy nespravila jediný šev, který by kdokoli dokázal pojmenovat.“',
  [roomChoiceTextKey('the-metamour', 'enforce-via-dana')]: 'Předejte to Dana: „tvůj druhý vztah, tvoje hranice, tvoje držet.“',
  [roomChoiceHintKey('the-metamour', 'enforce-via-dana')]: 'Nasměrujte to přes toho, čí vztah to je',
  [roomChoiceOutcomeKey('the-metamour', 'enforce-via-dana', 0)]:
    'Strukturálně správné a citově pomalé. Dana je viditelně chycen mezi dvěma lidmi, kteří oba mají rozumné argumenty.',
  [roomChoiceTextKey('the-metamour', 'talk-to-petra')]: 'Káva s Petrou. Jen vy dva. Pojmenujte to napřímo.',
  [roomChoiceHintKey('the-metamour', 'talk-to-petra')]: 'Veďte rozhovor, který skoro nikdo nikdy nevede',
  [roomChoiceOutcomeKey('the-metamour', 'talk-to-petra', 0)]:
    'Rozhovor s metamour, který skoro nikdo doopravdy nevede: trapný, dospělý, a — výzkum to potvrzuje — účinný.',
  [roomChoiceOutcomeKey('the-metamour', 'talk-to-petra', 1)]:
    'Vztah, který jste z toho nečekali: ne tak docela přátelství, spíš něco jako smlouva, vyjednaná těmi dvěma lidmi, kteří ji doopravdy museli vyjednat.',
  [roomChoiceTextKey('the-metamour', 'name-the-hierarchy')]: 'Svolejte schůzku. Donuťte se všichni tři vyslovit to slovo.',
  [roomChoiceHintKey('the-metamour', 'name-the-hierarchy')]: 'Řekněte „hierarchie“ nahlas, schválně',
  [roomChoiceOutcomeKey('the-metamour', 'name-the-hierarchy', 0)]:
    'Tabu, vyřčené nahlas: „popisná hierarchie existuje; předstírat opak je přesně to, jak se z ní stane hierarchie normativní a nespravedlivá.“ Slzy, u víc než jednoho z vás.',
  [roomChoiceOutcomeKey('the-metamour', 'name-the-hierarchy', 1)]:
    'Následuje přepsaná charta, se skutečnými časy a skutečnými limity, kterým se neříká veta, ale fungují jako jejich opatrná verze — upřímná, a draze vydobytá.',
  [roomChoiceTextKey('the-metamour', 'audit-the-jealousy')]: 'Než cokoli uděláte: je tohle signál, nebo šum?',
  [roomChoiceHintKey('the-metamour', 'audit-the-jealousy')]: 'Nejdřív prozkoumejte vlastní reakci',
  [roomChoiceOutcomeKey('the-metamour', 'audit-the-jealousy', 0)]:
    'Místnost v místnosti introspekce. Zjištění, poctivě podané: obojí. Skutečná hranice se doopravdy narušila, a váš vlastní vzorec citové vazby to doopravdy zesiluje.',
  [roomChoiceOutcomeKey('the-metamour', 'audit-the-jealousy', 1)]:
    'Dvě různá zjištění potřebují dva různé nástroje, a místnost vám dá do ruky oba, místo aby jeden z nich vybrala za vás.',
  [roomExplanationKey('the-metamour', 0)]:
    'Výzkum konsenzuální nemonogamie zjišťuje spokojenost a důvěru srovnatelnou s monogamními vztahy konkrétně tam, kde se dohody aktivně vyjednávají a udržují — ne tam, kde se jednou nastaví a pak se v ně jen věří. Zdokumentované způsoby selhání jsou konkrétní a dá se jim předejít: rozostření, nevyslovená hierarchie a vyhýbání se metamour, kdy lidé nejvíc zasažení dohodou spolu ve skutečnosti nikdy nemluví. Kompersace — radost z partnerovy radosti s někým jiným — funguje v literatuře jako naučitelná dovednost, ne jako předpoklad osobnosti; a žárlivost, místo rozsudku, funguje jako data, která je pořád potřeba interpretovat.',
  [roomNoteTitleKey('the-metamour')]: 'Švy',
  [roomNoteThinkersKey('the-metamour')]: 'Moors · Conley · výzkum výsledků CNM',
  [roomNoteBodyKey('the-metamour')]:
    'Poctivý stav vědy, v obou směrech: dobře provedené studie zjišťují srovnatelnou spokojenost ve vztahu a důvěru mezi vyjednanou CNM a monogamií, a zároveň identifikují udržovací chování, které předpovídá, kterým uspořádáním CNM se doopravdy daří — plánované přehodnocování dohody, přímý kontakt s metamour a výslovné rozhovory o hierarchii místo těch jen předpokládaných. **Dvojí povaha žárlivosti je dobře zdokumentovaná: někdy je to signál (skutečně překročená hranice), někdy šum (počasí citové vazby, které nemá nic vnějšího, na co by ukázalo), a často obojí v tom samém pocitu najednou.** Monogamie skrývá své švy uvnitř tradice, kde je nikdo nemusí pojmenovávat. Tady jsou viditelné záměrně. Viditelné trhliny se, na rozdíl od skrytých, dají doopravdy zašít.',
});
register(roomChoiceOutcomeKey('the-metamour', 'enforce-via-dana', 1), 'v2', 'cs', (s: RunState) =>
  seedSplit(s)
    ? 'Řešení tentokrát drží, protože ho drží Dana — místnost je upřímná v tom, že jste ten těžký rozhovor delegovali, a náhodou to vyšlo.'
    : 'Řešení se viklá — Dana se snaží, ale Petra tu hranici čte jako přicházející od vás, ne od Dana, a úplně se nemýlí. Místnost je upřímná v tom, že delegovaná hranice nemá zaručeno, že dorazí neporušená.',
);

// ---------- The Veto ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-veto', 0, 0)]:
    'Dana uplatní veto — sepsané v prvním roce, „pro nouzové případy“, od té doby ani jednou použité. Na Sam. První člověk, kterého jste za dlouhé roky doopravdy milovali, ne jen s ním chodili.',
  [roomBeatKey('the-veto', 0, 1)]:
    'Důvod, který Dana uvádí, a místnost mu dává plnou váhu, místo aby ho smetla ze stolu: „protože tenhle je jiný, a jiné mě děsí.“ Přesně proto to veto existuje. Přesně to je ten problém.',
  [roomBeatKey('the-veto', 0, 2)]:
    'Sam, načrtnutý ve třech konkrétních, vřelých detailech — místnost trvá na tom, abyste nejdřív procítili, co se to vlastně vetuje, než o tom cokoli rozhodnete.',
  [roomBeatKey('the-veto', 0, 3)]: 'Strach Dana, taky s plnou vnitřní perspektivou: ne tyranie, ale hrůza v županu, v jedenáct večer.',
  [roomBeatKey('the-veto', 0, 4)]:
    'Otázka pod tím pravidlem, teď už nevyhnutelná: bylo to veto vůbec někdy slučitelné s tím, co jste si vy dva řekli, že spolu budujete?',
  [roomBeatKey('the-veto', 0, 5)]:
    'Vrátný: „Recepce má šuplík s náhradními klíči pro nouzové případy. Ponaučení z toho šuplíku: časem se pro někoho stane nouzovým případem úplně všechno.“',
  [roomChoiceTextKey('the-veto', 'comply')]: 'Dodržte pravidlo přesně tak, jak je napsané. Ukončete to se Sam.',
  [roomChoiceHintKey('the-veto', 'comply')]: 'Dodržte starou dohodu, ať vás to teď stojí cokoli',
  [roomChoiceOutcomeKey('the-veto', 'comply', 0)]:
    'Scéna rozchodu se Sam — který neudělal nic špatně — s plnou, nepříjemnou vahou.',
  [roomChoiceOutcomeKey('the-veto', 'comply', 1)]:
    'Manželství pravidel zachováno. Úleva Dana, opravdová. A uvnitř ní, viditelné jen vám: přesně to, co si to pravidlo právě koupilo, a přesně to, co to stálo.',
  [roomChoiceTextKey('the-veto', 'fight-the-rule')]:
    'Odmítněte to veto, ne Dana: „přepracujme to pravidlo, nebo se nezlomí to pravidlo.“',
  [roomChoiceHintKey('the-veto', 'fight-the-rule')]: 'Zpochybněte mechanismus, ne člověka',
  [roomChoiceOutcomeKey('the-veto', 'fight-the-rule', 0)]:
    'Ústavní krize dvoučlenného státu, vylíčená v bolestných detailech: co nahradí veto — vznesené obavy, časově ohraničená zpomalení, ale žádný jednostranný vypínač.',
  [roomChoiceOutcomeKey('the-veto', 'fight-the-rule', 1)]:
    'Na strach Dana teď musí odpovědět péče místo zákona, což je pro vás oba těžší, a — místnost na tom trvá — upřímnější.',
  [roomChoiceTextKey('the-veto', 'examine-the-veto')]: 'Než cokoli rozhodnete: k čemu bylo to veto v prvním roce doopravdy?',
  [roomChoiceHintKey('the-veto', 'examine-the-veto')]: 'Pochopte pravidlo dřív, než ho poslechnete, nebo porušíte',
  [roomChoiceOutcomeKey('the-veto', 'examine-the-veto', 0)]:
    'Malé vykopávky: noc, kdy se to pravidlo psalo, oba jste se báli, pravidlo postavené jako přikrývka proti strachu, na který jste tehdy ještě neměli lepší odpověď.',
  [roomChoiceOutcomeKey('the-veto', 'examine-the-veto', 1)]:
    'Zjištění: pravidla napsaná strachem vymáhají strach. To, co uděláte dál, je samostatná, líp podložená volba — místnost si dává pozor, aby ji neudělala za vás.',
  [roomChoiceTextKey('the-veto', 'counter-veto')]: 'Uplatněte to svoje, obratem. Na Petru.',
  [roomChoiceHintKey('the-veto', 'counter-veto')]: 'Odpovězte stejným tahem, místo abyste to vyřešili',
  [roomChoiceOutcomeKey('the-veto', 'counter-veto', 1)]:
    'Vzájemně zaručené zničení dvou skutečných lásek. Uspořádání tu výměnu přežije jako pevnost se dvěma vězni uvnitř.',
  [roomExplanationKey('the-veto', 0)]:
    'Debata o vetu uvnitř nemonogamních komunit se táhne desítky let bez úplného vyřešení, a nejsilnější argumenty na obou stranách si zaslouží být vyslyšeny: veto jako ujištění pro vyděšeného partnera, proti vetu jako vypínači drženému nad skutečným životem a city třetí osoby, bez jejího souhlasu s tím uspořádáním. „Jiné mě děsí“ je obvykle žádost o péči, ne o poslušnost — a pravidla, ať už jsou míněná sebelíp, strukturálně nedokážou odvést práci, kterou umí odvést jedině opravdové ujištění a znovunavázání vztahu.',
  [roomNoteTitleKey('the-veto')]: 'Náhradní klíče',
  [roomNoteThinkersKey('the-veto')]: 'literatura o vetu v CNM · výzkum autonomie',
  [roomNoteBodyKey('the-veto')]:
    'Dlouho trvající debata o vetu v nemonogamní komunitě má na obou stranách opravdu poctivě vystavěné argumenty — ujištění pro úzkostnějšího partnera, proti vypínači uplatňovanému nad někým, kdo v té věci nemá žádný hlas. Empirická poznámka, kterou stojí za to si odnést: vetová uspořádání korelují s ranější, míň vyjednanou fází CNM, a časem mají tendenci buď se přepracovat k něčemu spolupracujícímu, nebo se při skutečném uplatnění rovnou zlomit. **Vetovaná třetí osoba je člověk, ne proměnná v rovnici někoho jiného, a výzkum na tom čím dál otevřeněji trvá.** Žádné pravidlo ještě nikdy nedrželo vyděšenou ruku. To umí jen ruce.',
});
register(roomChoiceOutcomeKey('the-veto', 'counter-veto', 0), 'v2', 'cs', (s: RunState) =>
  s.flags.includes('symmetry-trap')
    ? 'Past symetrie, teď už v dospělé velikosti — místnost si všimne, že jste tu už jednou byli, v menším, s heslem místo člověka.'
    : 'Past symetrie, v dospělé velikosti: odpovědět stejnou silou, místo abyste vyřešili skutečný spor, který je pod tím.',
);

// ---------- The Drift ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-drift', 0, 0)]:
    'Vy a Dana, sedmý rok. Nic není špatně. Nic není vůbec nic. Místnost je zařízená přesně jako váš obývák, a ta hrůza, potichu, je v tom, že je to pohodlné.',
  [roomBeatKey('the-drift', 0, 1)]:
    'Víte, které prkno v podlaze vrže, čí je který hrnek, co znamená který konkrétní povzdech. Večer se přehrává v láskyplném, forenzním detailu, a ten detail samotný je ta úzkost.',
  [roomBeatKey('the-drift', 0, 2)]:
    'Poslední rok, viděný z odstupu: k nerozeznání podobné týdny, naskládané na sebe. Naposledy, kdy se jeden z vás zeptal na otázku, na kterou předem neznal odpověď — místnost to umí datovat přesně, a to samo o sobě je tiché obvinění.',
  [roomBeatKey('the-drift', 0, 3)]: 'Dvě budoucnosti, promítnuté vedle sebe: tohle, beze změny, na dalších čtyřicet let. Nebo neznámo, na neznámý počet let.',
  [roomBeatKey('the-drift', 0, 4)]:
    'Vrátný: „Nejdelší pobyty v tomhle křídle mívají nejtišší pokoje. Recepce nikdy nerozhodla, jestli je to mír. Ani ty pokoje to nerozhodly.“',
  [roomChoiceTextKey('the-drift', 'start-the-work')]: 'Zůstaňte a začněte tu děsivou práci znovu chtít.',
  [roomChoiceHintKey('the-drift', 'start-the-work')]: 'Začněte, něčím malým',
  [roomChoiceOutcomeKey('the-drift', 'start-the-work', 0)]:
    'Žádná montáž. Jeden jediný, konkrétní čin: otázka, na kterou neznáte odpověď, položená nahlas u dřezu.',
  [roomChoiceOutcomeKey('the-drift', 'start-the-work', 1)]:
    'Jeho nepoměrně velký dopad, poctivě vylíčený — sebe-rozšíření, které začalo v měřítku kuchyně. Žádná záruka se nevydává. Místnost to říká na rovinu.',
  [roomChoiceTextKey('the-drift', 'raise-it')]: 'Řekněte to nevyslovitelné: „jsme v pohodě, nebo jen zticha?“',
  [roomChoiceHintKey('the-drift', 'raise-it')]: 'Položte tu otázku nahlas',
  [roomChoiceOutcomeKey('the-drift', 'raise-it', 0)]:
    'Samotný rozhovor je to riziko, a místnost to poctivě naceňuje: co se tady otevře, se nedá zase zavřít stejným způsobem, jako to bylo předtím.',
  [roomChoiceOutcomeKey('the-drift', 'raise-it', 2)]: 'Obě verze skončí s víc životem v místnosti, a s míň podlahy pod ní.',
  [roomChoiceTextKey('the-drift', 'accept-quiet-as-love')]: 'Rozhodněte se, že tohle je láska, v šatech sedmého roku.',
  [roomChoiceHintKey('the-drift', 'accept-quiet-as-love')]: 'Přiznejte tomu tichu jeho vlastní důstojnost',
  [roomChoiceOutcomeKey('the-drift', 'accept-quiet-as-love', 0)]:
    'Místnost tomuhle výkladu přiznává plnou důstojnost: společnická láska je skutečná láska, ne její nižší kategorie.',
  [roomChoiceOutcomeKey('the-drift', 'accept-quiet-as-love', 1)]:
    'Jedna upřímná podmínka navíc: musí to být volba, ne výchozí nastavení. Ten rozdíl je jeden jediný úder vyslovené vděčnosti, řečené nahlas, ne jen pociťované.',
  [roomChoiceTextKey('the-drift', 'notice-youve-left')]: 'Všimněte si, že jste už odešli, ve všem kromě dveří.',
  [roomChoiceHintKey('the-drift', 'notice-youve-left')]: 'Udělejte si poctivou inventuru',
  [roomChoiceOutcomeKey('the-drift', 'notice-youve-left', 0)]: 'Tichá katastrofa poctivé inventury. Nic se neoznámí. Nic se nesbalí.',
  [roomChoiceOutcomeKey('the-drift', 'notice-youve-left', 1)]:
    'Jen to rozpoznání — které změní váhu každé zbývající místnosti v tomhle běhu, ať už se to dnes večer někdo jiný v hotelu dozví, nebo ne.',
  [roomExplanationKey('the-drift', 0)]:
    'Dlouhodobý výzkum Johna Gottmana opakovaně zjišťuje, že citové odpojení, ne frekvence konfliktů, je nejsilnějším prediktorem konce vztahu — páry, které si přestanou navzájem natahovat ruku, jsou v ohrožení víc než páry, které se pravidelně hádají, ale pořád to zkoušejí. Výzkum sebe-rozšíření od Arthura Arona zjistil něco nadějnějšího: páry, které spolu dělají nové, mírně náročné aktivity, vykazují měřitelný nárůst spokojenosti ve vztahu, jako by láska částečně běžela na růstu, ne jen na pohodlí. Teze Eliho Finkela o „manželství se vším nebo ničím“ pojmenovává tu past na rovinu: moderní páry žádají po jednom člověku, aby byl skoro vším, a pak tomu „všemu“ nedají čas ani novost.',
  [roomNoteTitleKey('the-drift')]: 'Nejtišší pokoje',
  [roomNoteThinkersKey('the-drift')]: 'Gottman · Aron (2000) · Finkel (2017)',
  [roomNoteBodyKey('the-drift')]:
    'Gottmanova data jsou konzistentní napříč desetiletími: odpojení — ne přítomnost konfliktu — je nejsilnějším prediktorem toho, že vztah končí, protože páry, které se přestanou obracet k drobným pokusům toho druhého o pozornost, přestaly dělat údržbu, kterou láska doopravdy potřebuje. Aronovy experimenty se sebe-rozšířením zjistily něco konkrétního a opakovatelného: párům, kterým se přidělily nové, mírně náročné společné aktivity, měřitelně vzrostla udávaná blízkost — důkaz, že růst funguje jako skutečná přísada, ne jen jako romantická metafora. Finkelovo rámování tu past ještě zaostřuje: po moderních vztazích se chce, aby dodaly skoro všechno, co člověk potřebuje — a přitom dostávají míň času a pozornosti, než vztahy historicky dostávaly od celého okolního společenství. **Pohodlí je jedna vlastnost. Zkontrolujte, jestli je pořád jediná nainstalovaná.**',
});
register(roomChoiceOutcomeKey('the-drift', 'raise-it', 1), 'v2', 'cs', (s: RunState) =>
  seedSplit(s)
    ? 'Odpověď od Dana přichází jako úleva — viditelná, okamžitá, jako vydechnutý zadržovaný dech: „přemýšlel jsem, jak se tě zeptat na to samé.“'
    : 'Odpověď od Dana zprvu přichází v podobě hněvu — strach v tom svém nejmíň lichotivém kabátě — než později změkne v něco bližšího úlevě.',
);

// ---------- The Second Account ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-second-account', 0, 0)]:
    'Váš vlastní druhý účet. Začal jako vtipná přezdívka; teď je to místo, kde verze vás flirtuje, sklízí pozornost a udržuje na mírném ohni tři konverzace, o kterých Dana neví, že existují.',
  [roomBeatKey('the-second-account', 0, 1)]:
    'Nic fyzického. Dokonce ani nic domluveného. Celý mechanismus místnosti: přehrává vám vaše vlastní zprávy zpátky Vrátného plochým, bezvýrazovým hlasem — přesně tím rejstříkem, ve kterém flirt zní jako svědecká výpověď.',
  [roomBeatKey('the-second-account', 0, 2)]:
    'Tři konverzace, věcně vytažené: komplimenty, na které rybaříte, roztříděné podle druhu, ani jeden náhodný.',
  [roomBeatKey('the-second-account', 0, 3)]: 'Jedna otázka, podaná v jediném úderu: jak byste tomu říkali, kdyby to dělal Dana?',
  [roomBeatKey('the-second-account', 0, 4)]:
    'Dopaminová účetní kniha, v poctivých sloupcích: co ten účet krmí, co stojí, vedle sebe, žádný sloupec před tím druhým neschovaný.',
  [roomBeatKey('the-second-account', 0, 5)]:
    'Vrátný: „Recepce neklasifikuje. Recepce jenom čte nahlas zpátky. Hosté klasifikují rychlostí vlastního trhnutí sebou.“',
  [roomChoiceTextKey('the-second-account', 'delete-it')]: 'Smažte ten účet. Dnes večer. Celý.',
  [roomChoiceHintKey('the-second-account', 'delete-it')]: 'Ukončete to čistě',
  [roomChoiceOutcomeKey('the-second-account', 'delete-it', 0)]:
    'Smazání, vylíčené tak, jak abstinenční příznaky doopravdy vypadají: to svrbění, fantomové kontrolování, celý týden sahání po dveřích, které už nejsou.',
  [roomChoiceOutcomeKey('the-second-account', 'delete-it', 1)]:
    'Co se v jeho nepřítomnosti vrátí: pozornost, přesměrovaná domů — zprvu trapně, a opravdu živě.',
  [roomChoiceTextKey('the-second-account', 'keep-and-name-it')]: 'Nechte si ho. Poctivě pojmenujte, co krmí.',
  [roomChoiceHintKey('the-second-account', 'keep-and-name-it')]: 'Zůstaňte, ale přestaňte předstírat',
  [roomChoiceOutcomeKey('the-second-account', 'keep-and-name-it', 0)]:
    'Sofistikovaná racionalizace, s plným, férovým hlasem: „každý potřebuje nějaké já mimo vztah.“',
  [roomChoiceOutcomeKey('the-second-account', 'keep-and-name-it', 1)]:
    'Jeden poctivý test, přidaný a nechaný nainstalovaný: já, nebo tajemství? Účet zůstává, a ta otázka teď v něm bydlí natrvalo.',
  [roomChoiceTextKey('the-second-account', 'show-dana')]: 'Podejte Dana telefon. Účet otevřený.',
  [roomChoiceHintKey('the-second-account', 'show-dana')]: 'Nechte Dana, ať si to přečte sám',
  [roomChoiceOutcomeKey('the-second-account', 'show-dana', 0)]:
    'Nejstatečnější a nejnákladnější dveře. Dana čte v reálném čase — místnost tentokrát přehrává výraz Dana, ne ty zprávy.',
  [roomChoiceOutcomeKey('the-second-account', 'show-dana', 1)]:
    'Rozhovor, který následuje, je o tom, co doopravdy chybělo — o tom, co ten účet potichu krmil. Zeď zbouraná, přitom budova pořád obydlená.',
  [roomChoiceTextKey('the-second-account', 'defend-the-category')]: '„Není to podvádění, pokud—“',
  [roomChoiceHintKey('the-second-account', 'defend-the-category')]: 'Dokončete tu větu a zkontrolujte, jestli obstojí',
  [roomChoiceOutcomeKey('the-second-account', 'defend-the-category', 0)]:
    'Místnost vás nechá tu větu úplně dokončit, a pak vám ji přečte zpátky, plochým Vrátného hlasem, vedle skutečných dat z průzkumů.',
  [roomChoiceOutcomeKey('the-second-account', 'defend-the-category', 1)]:
    'Ta věta to přečtení nepřežije. Ten účet ano. A to je svým způsobem taky informace o vás.',
  [roomExplanationKey('the-second-account', 0)]:
    'Průzkumy o tom, co se počítá jako „mikropodvádění“, zjišťují opravdu málo shody — nejen mezi cizími lidmi, ale i mezi partnery v tom samém vztahu, kteří se často neshodnou na tom, kde ta hranice leží. Nejspolehlivější diagnostika není žádný konkrétní čin; je to jednoduchý test — ukázali byste tohle vlákno svému partnerovi, bez vyzvání, právě teď? Utajení se znovu ukazuje jako ta nosná přísada — stejné zjištění z výzkumu zdí a oken od Shirley Glassové, tentokrát uplatněné na telefon místo na člověka.',
  [roomNoteTitleKey('the-second-account')]: 'Mezera v definici',
  [roomNoteThinkersKey('the-second-account')]: 'literatura průzkumů digitální nevěry · Glass (2003) (digitální zdi)',
  [roomNoteBodyKey('the-second-account')]:
    'Průzkumy, které žádají páry, aby si nezávisle na sobě definovaly „podvádění“, zjišťují pozoruhodně málo shody — nejen mezi cizími lidmi, kde se neshoda dá čekat, ale mezi partnery v tom samém vztahu, kteří běžně vedou hranici jinde, aniž by si to uvědomili, dokud to není otestované. Napříč tou neshodou drží pevně jedno kritérium: utajení. **Chování skrývané před partnerem funguje strukturálně stejně, jako skryté chování vždycky fungovalo — bez ohledu na to, o jaký druh chování se to technicky jedná.** Pozornost samotná se v tomhle výzkumu chová jako konečný, přesměrovatelný zdroj: co si sklidí účet, to nedostane vztah, ať už se vyměnilo něco výslovného, nebo ne. Zrcadlo je na vnitřní straně těchhle dveří z nějakého důvodu. Je to ta jedna místnost, kde ten důkaz měl vždycky být váš vlastní.',
});

// ---------- The Discovery ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-discovery', 0, 1)]: 'Čtyři budoucnosti, viditelné najednou z přesně týhle kuchyně, žádná z nich zatím nevybraná.',
  [roomBeatKey('the-discovery', 0, 2)]:
    'Jedna věc, kterou výzkum o té příští hodině doopravdy ví: cokoli se řekne v zaplavení, má tendenci zůstat řečeno, založené natrvalo, bez ohledu na to, co se nakonec ukáže jako pravda.',
  [roomBeatKey('the-discovery', 0, 3)]: 'Telefon se znovu rozsvítí.',
  [roomBeatKey('the-discovery', 0, 4)]:
    'Vrátný (velmi potichu): „Recepce žádnému hostovi neradí podepisovat cokoli třesoucíma se rukama. Včetně vět.“',
  [roomChoiceTextKey('the-discovery', 'confront-now')]: 'Konfrontujte to hned teď. V zaplavení. Přímo tady v kuchyni.',
  [roomChoiceHintKey('the-discovery', 'confront-now')]: 'Řekněte to dřív, než se uklidníte',
  [roomChoiceOutcomeKey('the-discovery', 'confront-now', 0)]:
    'Hádka, vylíčená v krátkých, roztříštěných větách — obvinění předbíhá důkazy, vlastní zaplavení Dana odpovídá tomu vašemu, dva lidé se topí ve stejné malé kuchyni.',
  [roomChoiceOutcomeKey('the-discovery', 'confront-now', 2)]:
    'Ať je pravda kterákoli, obě pálí. Jedna to zaplavení ospravedlní. Druhá ho usvědčí. Skutečným smyslem místnosti nikdy nebyla odpověď — byla to ta hodina.',
  [roomChoiceTextKey('the-discovery', 'gather-first')]: 'Neříkejte nic. Ověřte si to. Chattamovsky forenzně, trpělivě, chladně.',
  [roomChoiceHintKey('the-discovery', 'gather-first')]: 'Vybudujte si jistotu dřív, než promluvíte',
  [roomChoiceOutcomeKey('the-discovery', 'gather-first', 0)]:
    'Tři dny, stlačené do čtyř úderů: divadlo normálnosti u snídaně, zatímco potichu proklepáváte celý cizí život.',
  [roomChoiceOutcomeKey('the-discovery', 'gather-first', 2)]:
    'Obě zásilky — ta odpověď, a to, čím vás její získání udělalo — dorazí zároveň, ve stejné ruce.',
  [roomChoiceTextKey('the-discovery', 'pretend')]: 'Aktivně se rozhodněte nevědět.',
  [roomChoiceHintKey('the-discovery', 'pretend')]: 'Zvolte si nevědomost schválně',
  [roomChoiceOutcomeKey('the-discovery', 'pretend', 0)]:
    'Nevědomost je, jak se ukáže, práce na plný úvazek bez jediné dovolené. Místnost v časosběru ukazuje, co stojí ji udržovat, napříč následujícími týdny.',
  [roomChoiceOutcomeKey('the-discovery', 'pretend', 1)]:
    'Ať už byla pravda cokoli, dnes večer se nedozví — místo toho se založí jako tichý hukot pod každým dalším rozhovorem.',
  [roomChoiceTextKey('the-discovery', 'walk-tonight')]: 'Sbalte jednu tašku. Nechte tu otázku za sebou, spolu s prstenem.',
  [roomChoiceHintKey('the-discovery', 'walk-tonight')]: 'Odejděte, aniž byste čekali na odpověď',
  [roomChoiceOutcomeKey('the-discovery', 'walk-tonight', 0)]:
    'Odchod, vylíčený bez triumfu. Odejít s otevřenou otázkou znamená tu otázku nést s sebou — sbalenou naplocho, pod vším ostatním, na neurčito.',
  [roomChoiceOutcomeKey('the-discovery', 'walk-tonight', 1)]: 'Někteří hosté tomu říkají síla. Jiní útěk. Recepce to, upřímně, zakládá pod obojí.',
  [roomChoiceTextKey('the-discovery', 'steady-then-ask')]:
    'Odložte telefon. Projděte se kolem bloku, dokud vám ruce zase nebudou patřit — a pak se dnes večer zeptejte Dana přímo, bez připraveného obvinění.',
  [roomChoiceHintKey('the-discovery', 'steady-then-ask')]: 'Vyčkejte, až odezní zaplavení, ne otázku',
  [roomChoiceOutcomeKey('the-discovery', 'steady-then-ask', 0)]:
    'Dvacet minut, studený vzduch, žádný telefon. Ne tak docela klid — jen za bodem, kdy rozhovor řídí tělo místo vás.',
  [roomChoiceOutcomeKey('the-discovery', 'steady-then-ask', 2)]:
    'Recepce nevede samostatnou účetní knihu pro to, co se řeklo v zaplavení a co v klidu — ale vy ano, a tentokrát není v tom prvním sloupci založené vůbec nic.',
  [roomExplanationKey('the-discovery', 0)]:
    'To, čemu výzkumníci říkají zaplavení — poplachová reakce těla, která přehluší vyšší uvažování — vysvětluje, proč první rozhovor po podezření ze zrady obvykle dopadne nejhůř: zvýšený tep a rozptýlené fyziologické vzrušení opravdu zhoršují schopnost jasně myslet, zhruba na dvacet minut — okno, které většina konfrontací nevyčká. To, co výzkum rozhovorů po odhalení soustavně doporučuje, je strukturální: odklad, dýchání, klidně i připravený scénář, místo spoléhání na to, že zaplavený okamžik vyprodukuje cokoli spolehlivého. A pokorná základní míra, kterou stojí za to si pamatovat: srdíčka na telefonech mívají víc možných majitelů, než obvykle počítá ten nejhorší scénář.',
  [roomNoteTitleKey('the-discovery')]: 'Podpis třesoucí se rukou',
  [roomNoteThinkersKey('the-discovery')]: 'Gottman (zaplavení) · výzkum rozhovorů po odhalení',
  [roomNoteBodyKey('the-discovery')]:
    'Gottmanův fyziologický výzkum „zaplavení“ zjistil něco konkrétního a testovatelného: opravdu zvýšený tep produkuje rozptýlené fyziologické vzrušení, které měřitelně zhoršuje schopnost poslouchat, uvažovat nebo pečlivě mluvit — není to metafora, je to zdokumentovaný stav trvající zhruba dvacet minut od svého spouštěče. Výzkum toho, jak nejlíp přežít odhalení zrady, se shoduje na struktuře: odklad před tím těžkým rozhovorem, záměrné dýchání, někdy doslova připravený scénář, místo spoléhání na to, co přijde jako první. **Cokoli se řekne v zaplavení, má tendenci se založit do paměti vztahu natrvalo, bez ohledu na to, co se později ukáže jako pravda.** Čtyři vteřiny světla. Zbytek dodal čtenář — stejně jako v každé místnosti tohohle křídla.',
});
register(roomBeatKey('the-discovery', 0, 0), 'v2', 'cs', (s: RunState) =>
  s.flags.includes('waiting-to-be-caught')
    ? 'Ten pult. To světlo. Tentokrát to vidíte z druhé židle — jako ten, kdo je přistižen, a sleduje výraz Dana ve chvíli, kdy se telefon rozsvítí jménem, které Dana nezná, a srdíčkem, které Dana zná. Teď už přesně víte, jaké to je z obou stran.'
    : 'Telefon Dana, displejem nahoru na pultu, se rozsvítí jménem, které neznáte, a srdíčkem, které znáte. Čtyři vteřiny tělu bohatě stačí: hlasitý tep v uších, ruce, které náhle a zbytečně vychladnou.',
);
register(roomChoiceOutcomeKey('the-discovery', 'confront-now', 1), 'v2', 'cs', (s: RunState) =>
  seedSplit2(s)
    ? 'Co to srdíčko doopravdy bylo, se ukáže později, až se oba dost uklidníte na to, abyste to slyšeli: poměr, skutečný, šest týdnů starý. Ukáže se, že to zaplavení vidělo něco pravdivého.'
    : 'Co to srdíčko doopravdy bylo, se ukáže později, až se oba dost uklidníte na to, abyste to slyšeli: sourozenec Dana, plánující překvapivou oslavu, tři týdny čím dál vzrušenějších zpráv. To zaplavení obžalovalo nevinný telefon.',
);
register(roomChoiceOutcomeKey('the-discovery', 'gather-first', 1), 'v2', 'cs', (s: RunState) =>
  seedSplit2(s)
    ? 'Ta jistota přijde, a je horší než to podezření: poměr, skutečný. Dostanete odpověď, a tím, jak jste ji získali, se stanete — někým, kdo sledoval spícího člověka a katalogizoval jeho dech.'
    : 'Ta jistota přijde, a úplně tím podezření rozpustí: překvapivá oslava, nic víc, tři dny vlastního tichého detektivního pátrání strávené na ničem. Dostanete odpověď, a přesto se stanete někým, kdo sledoval spícího člověka a katalogizoval jeho dech.',
);
register(roomChoiceOutcomeKey('the-discovery', 'steady-then-ask', 1), 'v2', 'cs', (s: RunState) =>
  seedSplit2(s)
    ? 'Vrátíte se dovnitř a zeptáte se, jednou, přímo. Dana vám řekne: poměr, skutečný, šest týdnů starý. Je to přesně tak zlé, jak vám ta procházka dovolila se bát — ale slyšíte celou větu, ne jen tu první, zaplavenou polovinu.'
    : 'Vrátíte se dovnitř a zeptáte se, jednou, přímo. Dana vám řekne: sourozenec, překvapivá oslava, tři týdny vzrušeného plánování. Nic. Věříte tomu, hlavně proto, že jste se ptali ve stavu, který dokázal odpověď doopravdy rozpoznat.',
);

// ---------- The Wedding Eve ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-wedding-eve', 0, 0)]:
    'Noc před vaší svatbou s Dana. 02:10. Oblek visí na skříni jako otázka, kterou nikdo nevyslovil nahlas. Zasedací pořádek leží hotový na stole.',
  [roomBeatKey('the-wedding-eve', 0, 1)]:
    'Pochybnost přichází v pracovním, ne slavnostním: konkrétní, malá, přesně ve velikosti druhé hodiny ranní — ne dramatická, což ji nějak dělá těžší smést ze stolu.',
  [roomBeatKey('the-wedding-eve', 0, 3)]:
    'Inventura, na které místnost trvá: které pochybnosti jsou doopravdy o Dana, které jsou o manželství jako instituci, a které jsou jenom o vás.',
  [roomBeatKey('the-wedding-eve', 0, 4)]:
    'Následuje audit utopených nákladů — zálohy, pozvánky, čtyři roky, šaty vaší matky — vyjmenované do detailu, a pak samotnou místností výslovně vyloučené jako důkaz.',
  [roomBeatKey('the-wedding-eve', 0, 5)]:
    'Vrátný: „Recepce dostane z týhle místnosti jeden telefonát za noc. Je to vždycky někdo, kdo se ptá, jestli tenhle telefonát dostane každý. Upřímná odpověď: většina. Ne všichni.“',
  [roomChoiceTextKey('the-wedding-eve', 'sit-with-it-til-morning')]: 'Podržte tu pochybnost, aniž byste ji poslechli, nebo umlčeli.',
  [roomChoiceHintKey('the-wedding-eve', 'sit-with-it-til-morning')]: 'Poctivě to vyčkejte, až do světla',
  [roomChoiceOutcomeKey('the-wedding-eve', 'sit-with-it-til-morning', 0)]:
    'Svítání přichází s pochybností pořád přítomnou, ale teď má velikost, ne že se nad vámi tyčí.',
  [roomChoiceOutcomeKey('the-wedding-eve', 'sit-with-it-til-morning', 1)]:
    'Zjištění místnosti: pochybnosti, které přežijí poctivé zkoumání, se buď zmenší, nebo zaostří, a obojí je skutečná informace. Na místo obřadu jdete s vědomím, co udělala ta vaše.',
  [roomChoiceTextKey('the-wedding-eve', 'call-someone-honest')]: 'Vzbuďte toho jediného člověka, který vám řekne pravdu.',
  [roomChoiceHintKey('the-wedding-eve', 'call-someone-honest')]: 'Získejte nezaujatý, upřímný pohled zvenku',
  [roomChoiceOutcomeKey('the-wedding-eve', 'call-someone-honest', 0)]:
    'Rozhovor ve tři ráno, podaný vcelku. Jedna otázka udělá ve čtyřech slovech to, k čemu se místnost propracovávala šest úderů: „je to kvůli tomu dni, nebo kvůli tomu člověku?“',
  [roomChoiceOutcomeKey('the-wedding-eve', 'call-someone-honest', 1)]: 'Svolení, přijaté — pro kteroukoli upřímnou odpověď.',
  [roomChoiceTextKey('the-wedding-eve', 'answer-the-flame')]: 'Přijměte ten hovor. Nebo ho sami zavolejte.',
  [roomChoiceHintKey('the-wedding-eve', 'answer-the-flame')]: 'Dnes večer znovu otevřete ten starý rozhovor',
  [roomChoiceOutcomeKey('the-wedding-eve', 'answer-the-flame', 1)]:
    'Nic se nestane, kromě toho, že se všechno porovná. Zavěsíte s vědomím něčeho — místnost dnes večer odmítá říct nahlas, čeho.',
  [roomChoiceTextKey('the-wedding-eve', 'postpone')]: 'Vzbuďte Dana. Řekněte to: „ne zítra. Ne takhle.“',
  [roomChoiceHintKey('the-wedding-eve', 'postpone')]: 'Řekněte tu nejtěžší dostupnou větu',
  [roomChoiceOutcomeKey('the-wedding-eve', 'postpone', 0)]:
    'Nejstatečnější věta, jaká je na tomhle patře k mání, a její plná cena: ráno plné telefonátů, záloh a tváří, vyplacené celé veřejně.',
  [roomChoiceTextKey('the-wedding-eve', 'hold-the-cheap-ring')]:
    'Podržte ten laciný plastový prsten z té párty, jednou, vedle toho zítřejšího skutečného.',
  [roomChoiceHintKey('the-wedding-eve', 'hold-the-cheap-ring')]: 'Suvenýr, který u sebe nosíte už od Přízemí',
  [roomChoiceOutcomeKey('the-wedding-eve', 'hold-the-cheap-ring', 0)]:
    'Pořád ho máte — třicet vteřin vysmívání, plast časem trochu zakalený, uchovávaný z důvodů, které jste nikdy úplně neprozkoumali.',
  [roomChoiceOutcomeKey('the-wedding-eve', 'hold-the-cheap-ring', 1)]:
    'Výzvu jste už jednou odmítli, s mnohem menším vkladem, než je tenhle. Poctivě si ověřte, jestli je zítřek taky výzva — a odpověď, ať zní jakkoli, přijde tišeji, než jste čekali.',
  [roomExplanationKey('the-wedding-eve', 0)]:
    'Lavnerův dlouhodobý výzkum předsvatebních pochybností zjistil něco konkrétního a nepříjemného: pochybnosti vyjádřené před svatbou — obzvlášť ze strany nevěsty nebo partnera s nižším postavením — doopravdy předpovídají pozdější potíže v manželství a rozvod, ale klíčové je, že to riziko se soustředí do pochybností, které zůstanou neprozkoumané, ne do těch, které se poctivě proberou. „Studené nohy“ a „skutečný signál“ fungují jako falešná dichotomie; užitečnější otázka je o obsahu, ne o teplotě. A utopené náklady — zaplacené zálohy, odeslané pozvánky — jsou formálně definované zkreslení z dobrého důvodu: nic z toho ve skutečnosti není důkaz o tom, jestli je zítřejší sňatek s tímhle člověkem správné rozhodnutí.',
  [roomNoteTitleKey('the-wedding-eve')]: 'Audit ve dvě ráno',
  [roomNoteThinkersKey('the-wedding-eve')]: 'Lavner (2012) · literatura o utopených nákladech',
  [roomNoteBodyKey('the-wedding-eve')]:
    'Lavnerovy studie o předsvatebních pochybnostech jsou dost konkrétní, aby byly opravdu užitečné: pochybnosti vyjádřené před svatbou doopravdy předpovídají zvýšené riziko pozdějších potíží a rozvodu — velikost účinku je reálná, ale mírná, a stojí za to ji uvést poctivě, ne dramaticky. Důležitější zjištění se skrývá pod tím titulkem: **riziko se soustředí do pochybnosti, která zůstane neprozkoumaná, ne do té, která se poctivě probere** — což „studené nohy“ přerámuje z rozsudku na instrukci. Užitečné rozlišení není mezi pochybováním o tom člověku a nepochybováním; je to pochybování o tom člověku, pochybování o instituci manželství samotné a pochybování o vlastní připravenosti — tři samostatné otázky, které se rutinně slévají do jednoho pocitu ve dvě ráno. Oblek sedí. To nikdy nebyla ta otázka.',
});
register(roomBeatKey('the-wedding-eve', 0, 2), 'v2', 'cs', (s: RunState) =>
  seedSplit(s)
    ? 'Telefon zazvoní. Stará láska, nečekaně, napůl se omlouvající za tu hodinu.'
    : 'Telefon nezazvoní. Nikdo nevolá. Místo toho si vytáčí číslo sama ta pochybnost, a nepřestává vytáčet.',
);
register(roomChoiceOutcomeKey('the-wedding-eve', 'answer-the-flame', 0), 'v2', 'cs', (s: RunState) =>
  s.flags.includes('opened-the-archive') || s.flags.includes('answered-the-ex')
    ? 'Rozhovor je vřelý, a je to archivní vřelost — tentýž kurátor jako před lety, pořád potichu mažící ty nejhorší scény, pořád v práci i noc před vaší svatbou.'
    : 'Rozhovor je vřelý, vřelejší, než by ta hodina měla dovolovat.',
);
register(roomChoiceOutcomeKey('the-wedding-eve', 'postpone', 1), 'v2', 'cs', (s: RunState) =>
  seedSplit2(s)
    ? 'Pod tou bolestí ve výrazu Dana, vylíčenou jako poslední: jedno nezaměnitelné zrnko úlevy — Dana měl vlastní, dosud nevyslovené otázky.'
    : 'Pod tou bolestí ve výrazu Dana, vylíčenou jako poslední: žádná úleva, jen bolest, čistá a úplná. Místnost nechává existovat oba možné světy; tohle je ten, který jste dostali vy.',
);

// ---------- The Therapist ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-therapist', 0, 0)]:
    'Ordinace doktora Weisse, přestavěná uvnitř hotelu, do posledního detailu — až po krabičku kapesníků na nízkém stolku mezi dvěma křesly. Uprostřed sezení. Hádka, doslovně, ve fragmentech: něco o myčce, co nikdy ve skutečnosti nebylo o myčce.',
  [roomBeatKey('the-therapist', 0, 1)]:
    'Doktor Weiss pojmenuje ten vzorec, aniž by přiřkl vinu, tak, jak to dokáže jen cizí člověk placený za to, aby byl férový.',
  [roomBeatKey('the-therapist', 0, 2)]:
    'Tam, kde bývala stěna ordinace, se zvednou čtyři dveře, každé s jedním slovem nad sebou: KRITIKA. OPOVRŽENÍ. OBRANÁŘSTVÍ. ZAZDÍVÁNÍ. Jste požádáni, abyste prošli těmi dveřmi, které vždycky používáte.',
  [roomBeatKey('the-therapist', 0, 3)]:
    'Každé dveře, když kolem nich projdete, vydechnou jednu větu: sebespravedlnost kritiky, chladné pohodlí opovržení, váha štítu obranářství, řvoucí ticho zazdívání.',
  [roomBeatKey('the-therapist', 0, 4)]:
    'Vrátný (tentokrát jako recepční): „Hosté se vždycky ptají, které dveře jsou nejhorší. Výzkum je bez sentimentu: ty posměšné. Ale vy projdete těmi svými.“',
  [roomChoiceTextKey('the-therapist', 'criticism')]: 'Projděte dveřmi KRITIKA.',
  [roomChoiceHintKey('the-therapist', 'criticism')]: '„ty vždycky“ / „ty nikdy“',
  [roomChoiceOutcomeKey('the-therapist', 'criticism', 0)]: 'Za dveřmi: vaše vlastní věty „ty vždycky“/„ty nikdy“, přehrané bez komentářů.',
  [roomChoiceOutcomeKey('the-therapist', 'criticism', 1)]:
    'Protilátka, vysvětlená přímo v příběhu a jednou vyzkoušená, přímo tam, na skutečné myčce: pojmenovat konkrétní chování místo obžaloby celého člověka.',
  [roomChoiceTextKey('the-therapist', 'contempt')]: 'Projděte dveřmi OPOVRŽENÍ.',
  [roomChoiceHintKey('the-therapist', 'contempt')]: 'Protočené oči',
  [roomChoiceOutcomeKey('the-therapist', 'contempt', 0)]:
    'Dveře protočených očí. Výzkum se vám přečte jemně, ale úplně: opovržení je ze všech čtyř zdaleka nejsilnějším prediktorem konce vztahu.',
  [roomChoiceOutcomeKey('the-therapist', 'contempt', 1)]:
    'Protilátka, započatá jedním záměrným gestem: jedna konkrétní, zapamatovaná dobrá věc na Dana, řečená nahlas, právě teď.',
  [roomChoiceTextKey('the-therapist', 'defensiveness')]: 'Projděte dveřmi OBRANÁŘSTVÍ.',
  [roomChoiceHintKey('the-therapist', 'defensiveness')]: '„jo, ale—“',
  [roomChoiceOutcomeKey('the-therapist', 'defensiveness', 0)]: 'Dveře protiútoku. Váš vlastní sbor „jo, ale—“, přehraný celý.',
  [roomChoiceOutcomeKey('the-therapist', 'defensiveness', 1)]:
    'Protilátka, jednou provedená: vzít na sebe nahlas malý, opravdový kus zodpovědnosti — a její nepoměrně velký účinek na ramena Dana, viditelně, okamžitě.',
  [roomChoiceTextKey('the-therapist', 'stonewalling')]: 'Projděte dveřmi ZAZDÍVÁNÍ.',
  [roomChoiceHintKey('the-therapist', 'stonewalling')]: 'Řvoucí ticho',
  [roomChoiceOutcomeKey('the-therapist', 'stonewalling', 1)]:
    'Protilátka: ohlášená pauza — „potřebuju dvacet minut, vrátím se“ — a to skutečné vrácení se, vylíčené jako ta opravdová, naučitelná dovednost.',
  [roomExplanationKey('the-therapist', 0)]:
    '„Čtyři jezdci apokalypsy“ Johna Gottmana — kritika, opovržení, obranářství a zazdívání — jsou zdokumentované prediktory rozpadu vztahu, každý se svou konkrétní, naučitelnou protilátkou: stížnost místo kritiky, vybudovaný respekt místo opovržení, převzetí zodpovědnosti místo obhajoby, a ohlášená, dodržená pauza místo nevysvětleného odpojení. Gottmanovo slavné tvrzení, že dokáže s pozoruhodnou přesností předpovědět rozvod, na sebe vzalo i reálnou metodologickou kritiku, kterou stojí za to zmínit vedle toho: pozdější analýzy zpochybnily statistiku původních predikčních studií — takže na ty čtyři jezdce je třeba nahlížet jako na opravdu užitečnou mapu destruktivních vzorců, ne jako na věštecký stroj.',
  [roomBeatKey('the-therapist', 1, 1)]: 'Špatný vtip, v mírně nesprávnou chvíli. Od Dana, nabídnutý s viditelnou odvahou.',
  [roomExplanationKey('the-therapist', 1)]:
    'Gottmanův výzkum taky pojmenovává rub těch čtyř jezdců: „pokus o nápravu“ — malé, často neobratné gesto, kterým jeden z partnerů uprostřed hádky zkouší situaci zklidnit, jako špatný vtip, omluva, nebo prostě natažená ruka. Nejvíc nezáleží na tom, jak hladce ten pokus o nápravu proběhne; záleží na tom, jestli ho ten druhý doopravdy zachytí. Páry, které zůstanou dlouhodobě šťastné, nejsou ty, co se nikdy nehádají — výzkum zjišťuje, že jsou to ty, které úspěšně přijímají vzájemné pokusy o nápravu, i ty neobratné, místo aby nechaly pýchu táhnout hádku o kousek déle, než bylo potřeba.',
  [roomChoiceTextKey('the-therapist', 'accept-the-repair')]: 'Přijměte to. Nechte ten špatný vtip dopadnout.',
  [roomChoiceHintKey('the-therapist', 'accept-the-repair')]: 'Přijměte nabízenou ruku',
  [roomChoiceOutcomeKey('the-therapist', 'accept-the-repair', 0)]:
    'Místnost se odlehčí o opravdu měřitelný kus. Ne vyřešení — náprava. To dvoje není totéž, a místnost si na tom rozdílu dává záležet.',
  [roomChoiceTextKey('the-therapist', 'miss-the-repair')]: 'Nevšimněte si toho. Zůstaňte u té hádky.',
  [roomChoiceHintKey('the-therapist', 'miss-the-repair')]: 'Nechte ten okamžik proplout',
  [roomChoiceOutcomeKey('the-therapist', 'miss-the-repair', 0)]:
    'Místnost na rovinu ukáže, co stojí takový nezachycený pokus: žádná katastrofa, jen o jeden most míň, v hádce, které by se jeden hodil.',
  [roomNoteTitleKey('the-therapist')]: 'Čtvery dveře a jeden špatný vtip',
  [roomNoteThinkersKey('the-therapist')]: 'Gottman (1994) · Christensen (1990)',
  [roomNoteBodyKey('the-therapist')]:
    'Gottmanovi čtyři jezdci apokalypsy — kritika, opovržení, obranářství, zazdívání — patří mezi nejcitovanější zjištění výzkumu vztahů, každý spárovaný s konkrétní, naučitelnou protilátkou, ne s rozsudkem nad charakterem. Slavné tvrzení o téměř dokonalé predikci rozvodu z krátkých pozorovaných interakcí od té doby vyvolalo publikovanou statistickou kritiku — pozdější reanalýzy zpochybnily části metodologie původních studií — a poctivé rámování drží v hledáčku obě fakta zároveň: je to opravdu užitečná diagnostická mapa, ne věštírna. **Pokusy o nápravu, ne nepřítomnost konfliktu, jsou Gottmanovo skutečné nosné zjištění** — šťastné páry se hádají dost; prostě se k sobě navzájem natahují, a nechávají se natahovat, uprostřed hádky, mnohem častěji. Christensenův výzkum honičky a stažení se přidává symetrii, kterou stojí za to si pamatovat: ten, kdo honí, i ten, kdo zmlkne, mívají oba strach, jen každý opačným směrem. Krabička kapesníků je skutečná. Dveře byly v místnosti odjakživa; ordinace má jen lepší osvětlení.',
});
register(roomChoiceOutcomeKey('the-therapist', 'stonewalling', 0), 'v2', 'cs', (s: RunState) =>
  s.flags.includes('played-detective') || s.flags.includes('chose-not-to-know')
    ? 'Nejtišší dveře — uvnitř stejná fyziologie jako tehdy v kuchyni, u pultu, s telefonem: zaplavení, které místnost propojí, aniž by jí to muselo někdo říkat dvakrát.'
    : 'Nejtišší dveře — uvnitř vlastní zaplavení těla, pojmenované a vysvětlené: to odpojení je stejnou měrou fyziologická událost jako citová.',
);
register(roomBeatKey('the-therapist', 1, 0), 'v2', 'cs', (s: RunState) =>
  s.flags.includes('door-contempt')
    ? 'Doktor Weiss nabídne jeden pokus o nápravu — malý, a protože přichází od Dana, záměrně nedokonalý. Po tom opovržení, kterým jste právě prošli, dopadá tvrději, než by dopadl jindy.'
    : 'Doktor Weiss nabídne jeden pokus o nápravu: malý a nedokonalý, protože přesně takhle skutečné pokusy o nápravu doopravdy vypadají.',
);

// ---------- The Usual Suite ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-usual-suite', 0, 0)]:
    'Nízké dveře z chodby křídla dlouhých pobytů, snadno přehlédnutelné. Za nimi: vaše apartmá, nezaměnitelně, i když jste tu ve skutečnosti nikdy předtím nebyli.',
  [roomBeatKey('the-usual-suite', 0, 1)]: 'Stěna, nasvícená zezadu. Siluety, čekající.',
  [roomBeatKey('the-usual-suite', 0, 5)]:
    'Vrátný: „Tuhle místnost nepřiděluju já. Kniha se vyplní sama. Objeví se jen hostům na jejich druhém pobytu. Přestal jsem se ptát proč. Odpovídat ale nepřestala: protože to teď vidí.“',
  [roomChoiceTextKey('the-usual-suite', 'name-them')]: '„Poznávám vás.“ Řekněte nahlas, čí jsou tyhle volby.',
  [roomChoiceHintKey('the-usual-suite', 'name-them')]: 'Pojmenujte, na co se to díváte',
  [roomChoiceOutcomeKey('the-usual-suite', 'name-them', 0)]:
    'Řeknete to — ne cizí pojmenování, ale to malé pravdivé, to, které jste použili sami na sebe, o samotě, poprvé.',
  [roomChoiceOutcomeKey('the-usual-suite', 'name-them', 1)]:
    'Stěna pak potemní, tak, jak se usadí oheň, když dostane nakrmit přesně to, co chtěl.',
  [roomChoiceTextKey('the-usual-suite', 'watch-silent')]: 'Sledujte beze slova. Nechte ty postavy dohrát.',
  [roomChoiceHintKey('the-usual-suite', 'watch-silent')]: 'Buďte svědkem, aniž byste to komentovali',
  [roomChoiceOutcomeKey('the-usual-suite', 'watch-silent', 0)]:
    'Neřeknete nic. Postavy dohrají svá malá, přesná představení bez vaší opravy, bez vašeho svolení.',
  [roomChoiceOutcomeKey('the-usual-suite', 'watch-silent', 1)]:
    'Tímhle způsobem je to snazší, a vy si té snadnosti všimnete, a všimnete si i toho, že jste si jí všimli.',
  [roomChoiceTextKey('the-usual-suite', 'ask-who-books-it')]: 'Zeptejte se Vrátného přímo: kdo tuhle místnost rezervuje?',
  [roomChoiceHintKey('the-usual-suite', 'ask-who-books-it')]: 'Zeptejte se přímo recepce',
  [roomChoiceOutcomeKey('the-usual-suite', 'ask-who-books-it', 0)]:
    '„Vy,“ řekne Vrátný. „Pokaždé. Je to jediná rezervace, kterou recepce nikdy nemusí potvrzovat.“',
  [roomExplanationKey('the-usual-suite', 0)]:
    'Tahle místnost se objeví, jen když jste v Intervalu už jednou byli, a vypůjčuje si Platónovo podobenství o jeskyni: vlastní minulé volby vám ukáže jako stíny a prostě vás požádá, abyste se poctivě podívali na vzorec, který tvoří. Nutkavé opakování — sklon nevědomě znovu vytvářet známou dynamiku, i tu bolestnou — je skutečné, dobře zdokumentované, a hlavně ne doživotní trest: výzkum „vydobyté jistoty“ zjišťuje, že se ten vzorec dá doopravdy přepracovat, a poctivé, nezakolísané pozorování je soustavně tím prvním krokem.',
  [roomNoteTitleKey('the-usual-suite')]: 'Stálá rezervace',
  [roomNoteThinkersKey('the-usual-suite')]: 'literatura o nutkavém opakování, podaná s citem',
  [roomNoteBodyKey('the-usual-suite')]:
    'Tenhle koncept má komplikovanou klinickou historii a střízlivější moderní výklad, kterému stojí za to dát přednost: to, co vypadá jako osud, je obvykle naučená vztahová strategie, znovu spouštěná proto, že jednou fungovala a nikdy nebyla vědomě přepracovaná. **Poctivě pozorovat vzorec, bez okamžitého souzení nebo omlouvání, je zdokumentovaný první krok k tomu, ho doopravdy změnit** — není to metafora vypůjčená z terapie, je to její zjištění. Stěna je záměrně tenká. Všechny nosné stěny jsou.',
});
register(roomBeatKey('the-usual-suite', 0, 2), 'v2', 'cs', (s: RunState) => {
  const moments = pickShadowMoments(s.prior);
  const first = moments[0];
  return first
    ? `Postava na stěně dělá přesně to, co jste jednou udělali vy, v místnosti s jiným číslem na dveřích: „${first.choiceText}“`
    : 'Postava na stěně se hýbe, trpělivě, čeká na volbu, kterou už zná.';
});
register(roomBeatKey('the-usual-suite', 0, 3), 'v2', 'cs', (s: RunState) => {
  const moments = pickShadowMoments(s.prior);
  const middle = moments[1];
  return middle
    ? `Další postava, uprostřed hry: „${middle.choiceText}“ Není to podobné tomu, co si pamatujete, že jste udělali. Je to přesně to samé.`
    : 'Další postava, uprostřed hry, v místnosti, kterou tak docela nepoznáváte, a přesto ji nějak už poznáváte.';
});
register(roomBeatKey('the-usual-suite', 0, 4), 'v2', 'cs', (s: RunState) => {
  const moments = pickShadowMoments(s.prior);
  const last = moments[2];
  return last
    ? `Poslední postava, nejblíž ke světlu: „${last.choiceText}“ Svůj vlastní postoj v siluetě poznáte dřív, než poznáte tu volbu.`
    : 'Poslední postava, nejblíž ke světlu, drží postoj, který poznáte dřív, než poznáte proč.';
});

// ---------- The Usual Room (gate) ----------
registerAll('v2', 'cs', {
  [roomBeatKey('the-usual-room', 0, 0)]:
    'Vrátný má dnešní přidělení pokoje napsané předem. Ani jednou se ještě nespletl. Stejné patro, stejný roh, stejný výhled na světlík — pokoj, který si vždycky berete.',
  [roomBeatKey('the-usual-room', 0, 2)]:
    'Instinktivně sáhnete po jiném klíči. U háčku na tabuli visí malá vytištěná poznámka: „nejdřív sáhne po 4B — kvůli otestování.“',
  [roomBeatKey('the-usual-room', 0, 3)]: 'Celý jeden úder paniky z toho, že jste předvídatelní, dřív než cokoli jiného. Místnost to nechá jen tak sedět.',
  [roomBeatKey('the-usual-room', 0, 4)]: 'Rozlišení, nabídnuté, ne vnucené: předvídatelné automaticky neznamená nesvobodné.',
  [roomBeatKey('the-usual-room', 0, 5)]: 'Vrátný: „Já hosty nepředpovídám. Čtu rukopis. Ten váš je čitelný. To není totéž jako hotový.“',
  [roomChoiceTextKey('the-usual-room', 'defiant-different')]: 'Žádejte jiný pokoj. Jakýkoli jiný pokoj.',
  [roomChoiceHintKey('the-usual-room', 'defiant-different')]: 'Z principu odmítněte to přidělení',
  [roomChoiceOutcomeKey('the-usual-room', 'defiant-different', 0)]:
    'Nový pokoj, vzdorně prospaný. Dost pohodlný, dost neznámý na to, aby působil jako prohlášení.',
  [roomChoiceOutcomeKey('the-usual-room', 'defiant-different', 1)]:
    'Další řádek na tabuli, i tak vám rozbalený: „vzdor — nejčitelnější tah v tom rukopisu.“ Ukáže se, že vzpoura je oblíbené přestrojení toho vzorce.',
  [roomChoiceTextKey('the-usual-room', 'refuse-all-rooms')]: 'Přespěte v hale. Úplně se odhlaste z té knihy.',
  [roomChoiceHintKey('the-usual-room', 'refuse-all-rooms')]: 'Odmítněte se zúčastnit',
  [roomChoiceOutcomeKey('the-usual-room', 'refuse-all-rooms', 0)]:
    'Tabule, otočená k vám, na sobě celou dobu měla napsáno: „zkusí halu — odhadovaná délka: jedna noc.“',
  [roomChoiceOutcomeKey('the-usual-room', 'refuse-all-rooms', 1)]: 'Zdržení se hlasování je, jak se ukáže, taky tah. Vrátný beze slova přinese deku.',
  [roomChoiceTextKey('the-usual-room', 'take-it-knowingly')]:
    'Vezměte si ten obvyklý pokoj — schválně. „Vždycky to měl být tenhle pokoj, a já si ho volím.“',
  [roomChoiceHintKey('the-usual-room', 'take-it-knowingly')]: 'Přivlastněte si ten vzorec, místo abyste s ním bojovali',
  [roomChoiceOutcomeKey('the-usual-room', 'take-it-knowingly', 0)]:
    'Stejný klíč, tentokrát otočený jinou rukou. „Ten vzorec vede skrz to rozhodování,“ řekne Vrátný, „ne kolem něj.“',
  [roomChoiceOutcomeKey('the-usual-room', 'take-it-knowingly', 1)]: 'To nejbližší, co má k úsměvu. Brána se otevře.',
  [roomChoiceTextKey('the-usual-room', 'room-with-no-number')]: 'Požádejte o pokoj bez čísla.',
  [roomChoiceHintKey('the-usual-room', 'room-with-no-number')]: 'Požádejte o možnost, která není na tabuli',
  [roomChoiceOutcomeKey('the-usual-room', 'room-with-no-number', 0)]: 'Takový pokoj existuje. Prádelní komora, se židlí uvnitř, naprosto nenápadná.',
  [roomChoiceOutcomeKey('the-usual-room', 'room-with-no-number', 1)]:
    '„Hosté, kteří si žádají pokoj bez čísla, jsou na tabuli taky,“ poznamená Vrátný: „zvolí záhadu před smyslem; vezme si náhradní deku.“ Menu s položkou „nic z výše uvedeného“ je, zajímavě, pořád menu.',
  [roomExplanationKey('the-usual-room', 0)]:
    'Výzkum citové vazby zjišťuje skutečnou kontinuitu — vzorce naučené brzy měřitelně přetrvávají napříč různými vztahy a lety, což při prvním setkání může působit jako doživotní trest. Tatáž literatura dokumentuje i „vydobytou jistotu“: lidi, kteří se posouvají ke stabilnějším vzorcům, obvykle skrz vztahy nebo terapii, které přežijí dost poctivého testování na to, aby se ten základní model doopravdy přepracoval. Předvídatelné a svobodné je nejlíp číst jako popisy fungující ve dvou různých výškách, ne jako protiklady — volba může být zároveň předvídaná tím vzorcem, a přitom opravdově, právě teď, vaše.',
  [roomNoteTitleKey('the-usual-room')]: 'Čitelný rukopis',
  [roomNoteThinkersKey('the-usual-room')]: 'studie kontinuity citové vazby · výzkum vydobyté jistoty',
  [roomNoteBodyKey('the-usual-room')]:
    'Dlouhodobý výzkum citové vazby zjišťuje skutečnou kontinuitu v obou směrech: rané vzorce s měřitelnou spolehlivostí předpovídají pozdější vztahové chování, a — stejně měřitelně — lidé se posouvají k „vydobyté jistotě“ skrz vztahy a zkušenosti, které přežijí dost poctivého testování na to, aby doopravdy přepracovaly ten základní model. **Předvídatelné a svobodné nejsou protiklady; jsou to popisy běžící ve dvou různých výškách té samé volby.** Kompatibilistické rámování si tu, s uvedením zdroje, půjčujeme z filozofického křídla jiného hotelu, kousek dál po chodbě: tuhle poznámku jste vždycky měli přečíst. A zároveň jste se pro to teď sami rozhodli. Oba zápisy, jedna kniha.',
});
register(roomBeatKey('the-usual-room', 0, 1), 'v2', 'cs', (s: RunState) =>
  (s.prior?.runs ?? 0) >= 1
    ? 'Historie, otevřená v knize: každý předchozí pobyt, každé přidělení, všechno správně — na okraji vidíte vlastní rukopis, z dřívějška.'
    : 'Historie, otevřená v knize, čekající na svůj první zápis — dnešní večer bude první řádek, a Vrátný už teď zdá se zhruba ví, co v něm bude stát.',
);
