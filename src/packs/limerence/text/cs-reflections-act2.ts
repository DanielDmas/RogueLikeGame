// Czech translations for LIMERENCE Act II's Examined Path reflections (spec
// 05). Every line is translated with the specific room's actual situation
// and the choice's real stakes in mind, not word-for-word from English —
// see CLAUDE.md's translation rule. All Act II choices carry a reflections
// field in the English source, so every room appears here.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'cs', {
  // ---------- The Distance ----------
  [reflectionKey('the-distance', 'confess-the-near-miss', 'consequence')]:
    'Říct to Jules teď, dokud je cena ještě malá, předchází mnohem větší ceně, kdyby to jednou vyplavalo samo.',
  [reflectionKey('the-distance', 'confess-the-near-miss', 'duty')]:
    'Tohle jste Jules dlužili — ne proto, že se něco stalo, ale proto, že se něco skoro stalo, a tajnosti kolem „skoro“ se časem hromadí.',
  [reflectionKey('the-distance', 'confess-the-near-miss', 'virtue')]:
    'Tohle je poctivost zvolená ve chvíli, kdy se jí ještě dalo vyhnout — a to je jediný druh poctivosti, který něco skutečně dokazuje.',
  [reflectionKey('the-distance', 'confess-the-near-miss', 'care')]:
    'Dali jste Jules šanci cítit se bezpečně ve vztahu takovém, jaký skutečně je — ne v jeho upravené verzi.',
  [reflectionKey('the-distance', 'bury-it', 'consequence')]:
    'Dnes večer se nic nezmění, ale právě jste jednostranně rozhodli, co všechno se Jules o vašem večeru dozví.',
  [reflectionKey('the-distance', 'bury-it', 'duty')]:
    'Technicky pravdivé zamlčení je pořád zamlčením něčeho, co by Jules pravděpodobně chtěl vědět.',
  [reflectionKey('the-distance', 'bury-it', 'virtue')]: 'Všimněte si, jak snadno se z „nic se nestalo“ stal úkryt místo faktu.',
  [reflectionKey('the-distance', 'bury-it', 'care')]:
    'Ochránili jste vlastní pohodlí na úkor toho, aby Jules mohl o tomhle vztahu rozhodovat s plnou informací.',
  [reflectionKey('the-distance', 'soften-it', 'consequence')]:
    'Upravená verze zvládne dnešní večer, ale potichu si tím zavíráte každou budoucí šanci říct tu pravdivou.',
  [reflectionKey('the-distance', 'soften-it', 'duty')]: 'Částečná pravda podaná jako pravda celá je pořád, fakticky, lží zamlčením.',
  [reflectionKey('the-distance', 'soften-it', 'virtue')]:
    'Tohle je past postupné pravdy, kterou jste si nastražili sami sobě — stojí za povšimnutí, jak rozumně vám každá kapka připadala.',
  [reflectionKey('the-distance', 'soften-it', 'care')]: 'Jules tím uklidňuje příběh postavený tak, aby řídil city, ne aby o nich informoval.',
  [reflectionKey('the-distance', 'keep-visiting-almost', 'consequence')]:
    'Držet si tuhle možnost otevřenou dnes nic nestojí — ale mění to šance na to, co se stane, až příště přijde další „skoro“.',
  [reflectionKey('the-distance', 'keep-visiting-almost', 'duty')]:
    'Tohle zachází s hranicí jako s čárou, kolem které se dá kroužit, ne s čárou, která se má držet — a na tohle Jules nikdy nepřistoupil.',
  [reflectionKey('the-distance', 'keep-visiting-almost', 'virtue')]:
    'Tohle je racionalizace prozkoumaná na plnou sílu — všimnout si toho jiskření ji nedělá neškodnou.',
  [reflectionKey('the-distance', 'keep-visiting-almost', 'care')]:
    'Dali jste přednost vlastnímu nejednoznačnému vzrušení před jasností, na kterou má Jules nárok ohledně toho, kde stojíte.',

  // ---------- The Hall Pass ----------
  [reflectionKey('the-hall-pass', 'agree-to-keep-peace', 'consequence')]:
    'Souhlas pod tlakem přinesl krátkodobý klid za cenu toho, že jste přistoupili na něco, co jste vlastně nechtěli.',
  [reflectionKey('the-hall-pass', 'agree-to-keep-peace', 'duty')]:
    'Souhlas daný proto, aby se předešlo konfliktu, není totéž co souhlas daný svobodně — Jules dlužíte upřímnou odpověď, ne tu zvládnutou.',
  [reflectionKey('the-hall-pass', 'agree-to-keep-peace', 'virtue')]:
    'Všimněte si rozdílu mezi tím, kdo nahlas řekl ano, a tím, komu spadl žaludek.',
  [reflectionKey('the-hall-pass', 'agree-to-keep-peace', 'care')]:
    'Ušetřili jste Jules dnešní nepříjemný rozhovor tím, že jste se dobrovolně přihlásili nést tu nepohodu sami, natrvalo.',
  [reflectionKey('the-hall-pass', 'true-no', 'consequence')]:
    'Jasné ne úplně uzavírá tu dohodu, za cenu těžšího rozhovoru, kterému se ani jeden z vás nevyhýbal zadarmo.',
  [reflectionKey('the-hall-pass', 'true-no', 'duty')]: '„Tohle nechci“ je úplná věta, a Jules dlužíte tu pravdivou, ne tu zdvořilou.',
  [reflectionKey('the-hall-pass', 'true-no', 'virtue')]:
    'Vyžadovalo to víc odvahy znít malicherně než znít v pohodě — to o sobě stojí za povšimnutí.',
  [reflectionKey('the-hall-pass', 'true-no', 'care')]:
    'Svěřili jste Jules svůj skutečný pocit, místo abyste řídili jeho reakci na ten předstíraný.',
  [reflectionKey('the-hall-pass', 'counter-with-need', 'consequence')]:
    'Pojmenování potřeb místo přijetí nebo odmítnutí hotové dohody vytvoří něco, co si oba doopravdy udržíte.',
  [reflectionKey('the-hall-pass', 'counter-with-need', 'duty')]:
    'Tohle zachází s rozhovorem jako s vyjednáváním mezi rovnými, ne jako s dárkem, který jeden z vás přijme nebo odmítne.',
  [reflectionKey('the-hall-pass', 'counter-with-need', 'virtue')]:
    'Tohle je těžší, zralejší krok — nahradit návrh vlastními podmínkami místo hodnocení podmínek někoho jiného.',
  [reflectionKey('the-hall-pass', 'counter-with-need', 'care')]:
    'Dali jste Jules šanci pochopit, co doopravdy potřebujete, ne jen to, co jste ochotní snést.',
  [reflectionKey('the-hall-pass', 'take-it-angrily', 'consequence')]:
    'Využití dohody ze zlosti neřeší původní problém a přidává druhý, který jste si způsobili sami.',
  [reflectionKey('the-hall-pass', 'take-it-angrily', 'duty')]:
    'Tohle použije „dárek“ jako zbraň proti někomu, kdo ho nabídl v dobré víře, byť neobratně.',
  [reflectionKey('the-hall-pass', 'take-it-angrily', 'virtue')]:
    'Zeptejte se, co tohle odhaluje o propasti mezi tím, na co jste řekli ano, a tím, co jste s tím ano doopravdy udělali.',
  [reflectionKey('the-hall-pass', 'take-it-angrily', 'care')]: 'Jules dostává trest dopředu za pocit, který jste nikdy nahlas nevyslovili.',

  // ---------- The Rebound ----------
  [reflectionKey('the-rebound', 'tell-her-what-this-is', 'consequence')]:
    'Říct jí teď pravdu stojí vztah jeho současnou pohodlnou podobu — výměnou za to, že si bude moct vybrat se skutečnou informací.',
  [reflectionKey('the-rebound', 'tell-her-what-this-is', 'duty')]:
    'Dlužili jste jí přesný popis toho, čím pro vás tohle je, dřív, než investovala dál do příběhu, o kterém jste věděli, že je neúplný.',
  [reflectionKey('the-rebound', 'tell-her-what-this-is', 'virtue')]:
    'Tohle vyžadovalo nahlas pojmenovat nelichotivou pravdu o sobě samých, přímo té osobě, které se to týká nejvíc.',
  [reflectionKey('the-rebound', 'tell-her-what-this-is', 'care')]:
    'Vrátili jste Miře zpátky rozhodování, které jí vaše mlčení potichu upíralo.',
  [reflectionKey('the-rebound', 'let-her-believe', 'consequence')]:
    'Mlčení nechalo vztah prohloubit se na falešných předpokladech, což dělá případné vyrovnání větší, ne menší.',
  [reflectionKey('the-rebound', 'let-her-believe', 'duty')]:
    'Dovolit jí propadnout se hlouběji, zatímco víte, co doopravdy cítíte, jí upírá informaci, na kterou má právo.',
  [reflectionKey('the-rebound', 'let-her-believe', 'virtue')]:
    'Všimněte si, jak snadné bylo zvolit pohodlí místo těžší upřímnosti — a o kolik těžší se ten dluh odkladem stal.',
  [reflectionKey('the-rebound', 'let-her-believe', 'care')]:
    'Její rostoucí náklonnost se spotřebovává jako vaše anestezie, bez jejího vědomí nebo souhlasu s takovou dohodou.',
  [reflectionKey('the-rebound', 'end-it', 'consequence')]: 'Ukončení teď zastaví škodu na její současné, menší velikosti, místo aby se dál hromadila.',
  [reflectionKey('the-rebound', 'end-it', 'duty')]:
    'Tohle dává přednost jejímu dlouhodobému dobru před vaším krátkodobým pohodlím — což je přesně to, co jí ta situace dlužila.',
  [reflectionKey('the-rebound', 'end-it', 'virtue')]:
    'Vyžadovalo to skutečnou odvahu — zvolit si těžší pocit pro sebe, konkrétně proto, abyste ji ušetřili toho většího.',
  [reflectionKey('the-rebound', 'end-it', 'care')]:
    'Odložili jste tlumicí prostředek a nechali oba cítit, co tam doopravdy bylo — a to je svým způsobem forma respektu.',
  [reflectionKey('the-rebound', 'try-to-catch-up', 'consequence')]:
    'Snaha citově dohnat ztrátu je skutečná strategie se skutečnými, nevyzpytatelnými šancemi — místnost nepředstírá nic jiného.',
  [reflectionKey('the-rebound', 'try-to-catch-up', 'duty')]:
    'Tohle se aspoň pokouší setkat s tím, co nabízí, místo aby to zneužilo nebo náhle ukončilo.',
  [reflectionKey('the-rebound', 'try-to-catch-up', 'virtue')]:
    'Tohle je upřímná snaha v nejistotě — a to je opravdu něco jiného než upřímnost nebo vyhýbání se.',
  [reflectionKey('the-rebound', 'try-to-catch-up', 'care')]:
    'Mira pořád neví o počátečním odstupu, který se snažíte překlenout — a pravděpodobně by o něm chtěla vědět.',

  // ---------- The Unicorn ----------
  [reflectionKey('the-unicorn', 'obey-the-rules', 'consequence')]:
    'Přijetí pravidel v dané podobě přineslo opravdu dobré měsíce za cenu ochrany, kterou jste vlastně nikdy neměli.',
  [reflectionKey('the-unicorn', 'obey-the-rules', 'duty')]:
    'Pravidla, na jejichž tvorbě jste se nijak nepodíleli, si nikdy nezasloužila stejnou úctu jako ta vyjednaná za vaší přítomnosti.',
  [reflectionKey('the-unicorn', 'obey-the-rules', 'virtue')]:
    'Všimněte si, jak pohodlné bylo nechat dva zkušenější lidi definovat podmínky vaší vlastní účasti.',
  [reflectionKey('the-unicorn', 'obey-the-rules', 'care')]:
    'Pohodlí páru bylo strukturálně chráněné po celou dobu způsobem, jakým to vaše nikdy nebylo — stojí za to to otevřeně pojmenovat.',
  [reflectionKey('the-unicorn', 'renegotiate', 'consequence')]:
    'Trvat na novém vyjednávání testuje poctivost dohody za cenu toho, že ta snadná verze už nebude pokračovat neprozkoumaná.',
  [reflectionKey('the-unicorn', 'renegotiate', 'duty')]:
    'Měli jste nárok na hlas v podmínkách, které řídily vaši vlastní účast, a požádali jste o to, co vám náleželo.',
  [reflectionKey('the-unicorn', 'renegotiate', 'virtue')]:
    'Tohle je těžší, méně pohodlná integrita — riskovat něco dobrého, abyste zjistili, jestli to vůbec kdy bylo férové.',
  [reflectionKey('the-unicorn', 'renegotiate', 'care')]:
    'Dali jste vztahu, a sami sobě, šanci být něčím jiným, než co se od začátku samo předpokládalo.',
  [reflectionKey('the-unicorn', 'discover-we-come-first', 'consequence')]:
    'Zůstat dost dlouho na to, abyste tu hierarchii poznali na vlastní kůži, vás stálo noc — a dalo vám informaci, kterou by vám žádný rozhovor nedal.',
  [reflectionKey('the-unicorn', 'discover-we-come-first', 'duty')]:
    'Měli jste nárok na jasnější popis hierarchie dřív, než jste investovali do dohody, která předpokládala, že ji už znáte.',
  [reflectionKey('the-unicorn', 'discover-we-come-first', 'virtue')]:
    'Existuje druh sebepoznání, který přichází jen skrz cenu, ne kolem ní — tohle je přesně to, poctivě naceněné.',
  [reflectionKey('the-unicorn', 'discover-we-come-first', 'care')]:
    'Všimněte si, že Majiny slzy a vaše cesta taxíkem nikdy neměly stejnou váhu v místnosti, kterou tenhle pár postavil.',
  [reflectionKey('the-unicorn', 'decline-kindly', 'consequence')]:
    'Odmítnutí odstraní všechna rizika té dohody za cenu sounáležitosti a žáru, které opravdu nabízela.',
  [reflectionKey('the-unicorn', 'decline-kindly', 'duty')]: 'Dlužili jste jim upřímný důvod místo tichého zmizení, a ten důvod jste jim dali.',
  [reflectionKey('the-unicorn', 'decline-kindly', 'virtue')]:
    'Tohle je promyšlené ne, ke kterému jste došli rozumovou úvahou o té struktuře, ne pouhou reakcí na nabídku.',
  [reflectionKey('the-unicorn', 'decline-kindly', 'care')]:
    'Ušetřili jste sami sebe pozice, která podle svého vlastního uspořádání nikdy neměla šanci být strukturálně rovnocenná.',

  // ---------- Just Friends ----------
  [reflectionKey('just-friends', 'open-window', 'consequence')]:
    'Úplné odhalení dává Jules možnost rozhodovat se o vztahu na základě skutečné informace, za cenu nepříjemného, okamžitého rozhovoru.',
  [reflectionKey('just-friends', 'open-window', 'duty')]:
    'Jules dlužíte ten žebříček, ne jen samotný fakt přátelství — žebříček je ta část, která byla doopravdy skrytá.',
  [reflectionKey('just-friends', 'open-window', 'virtue')]: 'Tohle je těžší upřímnost — pojmenovat vzorec o sobě samých, ne jen jednu událost.',
  [reflectionKey('just-friends', 'open-window', 'care')]:
    'Zvolili jste jasnost pro Jules před pohodlím Aleny i vlastním — a to je skutečná podoba loajality, kterou tahle místnost testuje.',
  [reflectionKey('just-friends', 'nothing-to-tell', 'consequence')]:
    'Nechat složku zavřenou se vyhne jednomu těžkému rozhovoru, ale potichu navyšuje to, co by musel pokrýt ten budoucí.',
  [reflectionKey('just-friends', 'nothing-to-tell', 'duty')]:
    'Zařadit nosné přátelství pod „není co říkat“ je rozhodnutí o Jules, učiněné bez Jules.',
  [reflectionKey('just-friends', 'nothing-to-tell', 'virtue')]:
    'Všimněte si, jak vám každý jednotlivý večer připadal příliš malý na to, abyste ho zmínili — a co z toho nakonec sečtete.',
  [reflectionKey('just-friends', 'nothing-to-tell', 'care')]:
    'Jules nedostává stejnou informaci, kterou Alena potichu hromadí — ta nerovnováha je skutečná škoda.',
  [reflectionKey('just-friends', 'test-the-evening', 'consequence')]:
    'Naprogramovat si popiratelnost přinese přesně ten nejednoznačný výsledek, pro který jste to postavili — a to byl zároveň záměr, i problém.',
  [reflectionKey('just-friends', 'test-the-evening', 'duty')]:
    'Záměrně nejednoznačná zkouška je způsob, jak jednat bez odpovědnosti za to, že jste se rozhodli.',
  [reflectionKey('just-friends', 'test-the-evening', 'virtue')]:
    'Tohle je racionalizace na plnou sílu, poctivě prozkoumaná — věrohodná popiratelnost byla plán, ne vedlejší efekt.',
  [reflectionKey('just-friends', 'test-the-evening', 'care')]:
    'Jules i Alena si zaslouží víc jasnosti než večer postavený konkrétně tak, aby žádnou nepřinesl.',
  [reflectionKey('just-friends', 'name-it-set-boundary', 'consequence')]:
    'Pojmenovat hranici přímo Aleně řeší nejednoznačnost u zdroje, místo aby se jen ošetřovaly její příznaky u Jules.',
  [reflectionKey('just-friends', 'name-it-set-boundary', 'duty')]:
    'Alena si zasloužila upřímnost o tom, co se děje, stejně jako Jules — tohle vyrovnává oba dluhy najednou.',
  [reflectionKey('just-friends', 'name-it-set-boundary', 'virtue')]:
    'Tohle vyžadovalo pojmenovat něco nepříjemného o sobě samých právě té osobě, které se to říká nejhůř.',
  [reflectionKey('just-friends', 'name-it-set-boundary', 'care')]:
    'Ochránili jste přátelství tím, že jste byli upřímní ke kamarádce, místo abyste ho chránili tím, že zůstanete vágní ke všem.',

  // ---------- The Ex ----------
  [reflectionKey('the-ex', 'reread-everything', 'consequence')]:
    'Znovu si všechno pročíst vás stálo tři dny nespravedlivého srovnávání, aniž by vám to přineslo informaci, kterou jste v nějaké rovině už neměli.',
  [reflectionKey('the-ex', 'reread-everything', 'duty')]:
    'Tohle je soukromý čin bez přímého nároku na kohokoliv jiného, i když jeho následky stejně dopadnou na Jules.',
  [reflectionKey('the-ex', 'reread-everything', 'virtue')]:
    'Všimněte si, jak ochotně jste nechali upravenou vzpomínku porazit skutečný, komplikovaný vztah, ve kterém teď jste.',
  [reflectionKey('the-ex', 'reread-everything', 'care')]: 'Jules se nevědomky srovnává s upraveným sestřihem nejlepších momentů — a to není férový souboj pro nikoho.',
  [reflectionKey('the-ex', 'answer-her', 'consequence')]:
    'Odpověď znovu otevírá kanál, jehož rizika už důvěrně znáte ze zkušenosti, za reálnou, byť těžko vyčíslitelnou cenu.',
  [reflectionKey('the-ex', 'answer-her', 'duty')]:
    'Tohle se odehrálo bez vědomí Jules, a to samo o sobě je volba, která stojí za prozkoumání, bez ohledu na obsah.',
  [reflectionKey('the-ex', 'answer-her', 'virtue')]:
    'Zeptejte se sami sebe upřímně, jestli „jen si popovídat“ bylo vůbec kdy celý plán, nebo jen první věta delšího.',
  [reflectionKey('the-ex', 'answer-her', 'care')]:
    'Jules se právě teď směje u televize a netuší, že se ve vedlejší místnosti dělá rozhodnutí, které se týká vašeho vztahu.',
  [reflectionKey('the-ex', 'block', 'consequence')]:
    'Blokování odstraní riziko za cenu jakékoli informace — uzavření, jasnosti, nebo čehokoli jiného — kterou by ta výměna mohla nabídnout.',
  [reflectionKey('the-ex', 'block', 'duty')]:
    'Tohle chrání integritu současného vztahu, aniž by po Jules chtělo, aby tu situaci vůbec musel řešit.',
  [reflectionKey('the-ex', 'block', 'virtue')]: 'Tohle je rozhodný, sebeochranný čin, zvolený čistě, ne jen tak, do kterého jste sklouzli.',
  [reflectionKey('the-ex', 'block', 'care')]:
    'Rozhodli jste se jednostranně, místo abyste do toho zapojili Jules — soukromá ochrana, o které se Jules nikdy nedozví, že byla poskytnutá v jeho prospěch.',
  [reflectionKey('the-ex', 'tell-jules', 'consequence')]:
    'Okamžité sdílení promění soukromé riziko ve sdílené rozhodnutí, za cenu nepříjemné chvíle odhalení.',
  [reflectionKey('the-ex', 'tell-jules', 'duty')]:
    'Jules dlužíte tu informaci ve chvíli, kdy jste ji měli, ne až poté, co jste sami rozhodli, co s ní uděláte.',
  [reflectionKey('the-ex', 'tell-jules', 'virtue')]:
    'Tohle je intimita zvolená před instinktem — sáhnout automaticky po té těžší, odhalenější možnosti.',
  [reflectionKey('the-ex', 'tell-jules', 'care')]: 'Dali jste Jules hlas v něčem, co se ho přímo týká, místo abyste to za něj vyřídili sami.',

  // ---------- The Confession ----------
  [reflectionKey('the-confession', 'confess', 'consequence')]:
    'Úplné odhalení dává Jules pravdivou informaci, na které je postavený jeho vlastní život, za cenu bolesti, kterou by zdánlivě laskavější mlčení jen odložilo, ne odvrátilo.',
  [reflectionKey('the-confession', 'confess', 'duty')]:
    'Jules má právo na pravdu o vztahu, ve kterém doopravdy je — tohle je to právo, uznané, byť pozdě.',
  [reflectionKey('the-confession', 'confess', 'virtue')]:
    'Tohle je upřímnost zvolená v její nejdražší podobě, a to je obvykle jediná zkouška, na které záleží.',
  [reflectionKey('the-confession', 'confess', 'care')]:
    'Přenesli jste na Jules jistotu toho faktu, ale zůstali jste a nesli následky spolu s ním, místo abyste ho nechali zpracovat to samotného.',
  [reflectionKey('the-confession', 'carry-it', 'consequence')]:
    'Nosit to sami ušetří Jules konkrétní bolesti za cenu trvalé, nerovné tíhy, kterou pocítíte jen vy.',
  [reflectionKey('the-confession', 'carry-it', 'duty')]:
    'Tohle lze číst jako opravdovou sebeobětu kvůli Jules, nebo jako zatajení informace, kterou by chtěl znát — místnost odmítá vybrat jednu možnost.',
  [reflectionKey('the-confession', 'carry-it', 'virtue')]:
    'Tohle je skutečná, vytrvalá zdrženlivost — zvolit si těžší soukromé břemeno před snazší veřejnou úlevou.',
  [reflectionKey('the-confession', 'carry-it', 'care')]:
    'Zeptejte se sami sebe upřímně, jestli to mlčení chrání Jules, nebo jestli chrání vztah v jeho současné, pohodlné podobě pro vás.',
  [reflectionKey('the-confession', 'trickle', 'consequence')]: 'Zjemnělé doznání zvládne dnešní reakci za cenu většího, narůstajícího zúčtování později.',
  [reflectionKey('the-confession', 'trickle', 'duty')]: 'Částečné doznání pořád zatajuje celou pravdu, kterou Jules dlužíte, jen převlečené za upřímnost.',
  [reflectionKey('the-confession', 'trickle', 'virtue')]:
    'Tohle je past postupné pravdy, tentokrát rozpoznaná — a přesto zvolená, což je samo o sobě informace o vás.',
  [reflectionKey('the-confession', 'trickle', 'care')]:
    'Každá budoucí revize bude Jules stát nové, zbytečné zranění, kterému by jeden těžký rozhovor dnes večer předešel.',
  [reflectionKey('the-confession', 'let-it-surface', 'consequence')]:
    'Čekání na náhodné odhalení odstraňuje vaši vlastní roli z výsledku, aniž by to skutečně snížilo konečnou cenu.',
  [reflectionKey('the-confession', 'let-it-surface', 'duty')]:
    'Tohle odkládá dluh, který doopravdy dlužíte, místo abyste ho buď splatili, nebo si ho vědomě sami odpustili.',
  [reflectionKey('the-confession', 'let-it-surface', 'virtue')]:
    'Tohle je vyhýbání se, převlečené za osud — stojí za to si to teď hned, sami sobě, otevřeně pojmenovat.',
  [reflectionKey('the-confession', 'let-it-surface', 'care')]:
    'Ať už to vyplave kdykoli, Jules se to dozví za nejhorších možných okolností — a tahle volba to dělá pravděpodobnějším, ne méně pravděpodobným.',

  // ---------- The Other Side of the Door ----------
  [reflectionKey('the-other-side-of-the-door', 'continue', 'consequence')]:
    'Pokračování zachovává něco pro vás opravdu cenného za trvalou, narůstající cenu pro třetí osobu, která s ničím z toho nikdy nesouhlasila.',
  [reflectionKey('the-other-side-of-the-door', 'continue', 'duty')]:
    'Vy jste žádné sliby nedávali, což je pravda a neřeší to, jestli je vědomé umožňování porušení cizích slibů samo o sobě špatné.',
  [reflectionKey('the-other-side-of-the-door', 'continue', 'virtue')]:
    'Všimněte si, jaké návyky utajování jste si osvojili, aniž byste se k tomu kdy vědomě rozhodli.',
  [reflectionKey('the-other-side-of-the-door', 'continue', 'care')]:
    'Manželku za zdí se nikdo nikdy nezeptá, nikdy jí nikdo nic neřekne, a nepřestává být skutečná jen proto, že ji nikdo nikdy nevidí.',
  [reflectionKey('the-other-side-of-the-door', 'end-it', 'consequence')]:
    'Ukončení odstraní váš vlastní pokračující podíl na škodě, za cenu zármutku, který budete muset nést bez jakéhokoli veřejného uznání.',
  [reflectionKey('the-other-side-of-the-door', 'end-it', 'duty')]:
    'Tohle zastaví vaši vlastní vědomou účast, aniž by to po Viktorovi žádalo rozhodnutí, které by stejně nikdy neudělal čistě.',
  [reflectionKey('the-other-side-of-the-door', 'end-it', 'virtue')]:
    'Tohle je tichá integrita bez svědků — zvolit si těžší odchod přesně proto, že se nikdo nedívá, aby vás za něj odměnil.',
  [reflectionKey('the-other-side-of-the-door', 'end-it', 'care')]:
    'Tohle nevrátí zpět, čím si manželka za zdí už prošla, ale přestane to k tomu přidávat.',
  [reflectionKey('the-other-side-of-the-door', 'tell-her', 'consequence')]:
    'Říct jí to jí dává informaci, aby mohla dělat skutečná rozhodnutí o vlastním životě, za cenu pro Viktora i pro vás samotné, kterou plně nekontrolujete.',
  [reflectionKey('the-other-side-of-the-door', 'tell-her', 'duty')]:
    'Zasloužila si pravdu o svém vlastním manželství bez ohledu na motivy nebo postavení toho, kdo ji přinesl.',
  [reflectionKey('the-other-side-of-the-door', 'tell-her', 'virtue')]:
    'Tohle vyžadovalo skutečnou odvahu, ať už ho vyvolala jakákoli směs motivů — čin a motiv nejsou stejná otázka.',
  [reflectionKey('the-other-side-of-the-door', 'tell-her', 'care')]:
    'Tohle je jediná volba na tomhle patře, která staví přímo ji do středu, místo aby jen řešila situaci kolem ní.',
  [reflectionKey('the-other-side-of-the-door', 'demand-choice', 'consequence')]:
    'Ultimátum vynutí rozuzlení za cenu toho, že skutečné rozhodnutí úplně přenecháte někomu, kdo už předvedl, že dokáže držet dva životy najednou.',
  [reflectionKey('the-other-side-of-the-door', 'demand-choice', 'duty')]:
    'Žádat po něm, aby si vybral, je vůči němu férové, ale samo o sobě to nezbavuje odpovědnosti vás v téhle situaci.',
  [reflectionKey('the-other-side-of-the-door', 'demand-choice', 'virtue')]:
    'Všimněte si, co tahle volba vypovídá o tom, že chcete spíš rozuzlení než to, být tím, kdo jedná.',
  [reflectionKey('the-other-side-of-the-door', 'demand-choice', 'care')]:
    'Ultimátum staví do středu vaši vlastní jistotu, ne blaho manželky, které tahle volba nechává tak jako tak úplně nerozhodnuté.',

  // ---------- The Scoreboard (gate) ----------
  [reflectionKey('the-scoreboard', 'prosecute', 'consequence')]:
    'Výslech koupí jistotu o faktech, které jste technicky vzato už znali, za skutečnou, trvající cenu pro důvěru i váš vlastní klid.',
  [reflectionKey('the-scoreboard', 'prosecute', 'duty')]:
    'Minulost vám nic dalšího nedluží; byla jednou odhalena, poctivě, a znovuotevírání toho případu zachází s tou upřímností, jako by nestačila.',
  [reflectionKey('the-scoreboard', 'prosecute', 'virtue')]:
    'Všimněte si, v jakého partnera vás dokázalo jedno jediné slyšení, kvůli jednomu číslu, proměnit.',
  [reflectionKey('the-scoreboard', 'prosecute', 'care')]:
    'Jules musí znovu prožívat a znovu obhajovat minulost, která vás předchází, podle vašeho rozvrhu, kvůli vaší úlevě.',
  [reflectionKey('the-scoreboard', 'dismiss-with-prejudice', 'consequence')]:
    'Zamítnutí případu to číslo nesmaže, ale odebere mu moc dál si vybírat daň na současném vztahu.',
  [reflectionKey('the-scoreboard', 'dismiss-with-prejudice', 'duty')]:
    'Minulosti nedlužíte žádné další stíhání — už jednou upřímně odpověděla, když jste se zeptali.',
  [reflectionKey('the-scoreboard', 'dismiss-with-prejudice', 'virtue')]:
    'Tohle je přijetí jako vypěstovaná disciplína, ne pocit, na jehož příchod čekáte.',
  [reflectionKey('the-scoreboard', 'dismiss-with-prejudice', 'care')]:
    'Přestanete po Jules chtít odpovědi za verzi sebe sama, která existovala před vámi — a to je přesně to, co mu doopravdy náleželo.',
  [reflectionKey('the-scoreboard', 'testify-against-yourself', 'consequence')]:
    'Prozkoumání vlastního dvojího metru nezmění ani jedno z čísel, ale změní to, co ten rozdíl smí stát vztah.',
  [reflectionKey('the-scoreboard', 'testify-against-yourself', 'duty')]:
    'Spravedlnost vyžaduje uplatnit na sebe stejné měřítko, jaké uplatňujete na Jules — tahle volba to dělá.',
  [reflectionKey('the-scoreboard', 'testify-against-yourself', 'virtue')]:
    'Tohle je skutečné, nepříjemné sebezkoumání, uplatněné přesně tam, kde je nejméně lichotivé.',
  [reflectionKey('the-scoreboard', 'testify-against-yourself', 'care')]:
    'Tohle ušetří Jules břemeno měřítka, které jste nebyli ochotní držet sami na sobě.',
  [reflectionKey('the-scoreboard', 'ask-what-verdict-frees', 'consequence')]:
    'Pojmenovat, že by doopravdy nepomohl žádný rozsudek, přerámuje celé slyšení jako od základu nevyhratelné — a to je samo o sobě užitečná informace.',
  [reflectionKey('the-scoreboard', 'ask-what-verdict-frees', 'duty')]:
    'Tohle minulosti nedluží nic dalšího, protože správně rozpoznává, že nic dalšího nikdy dlužné nebylo.',
  [reflectionKey('the-scoreboard', 'ask-what-verdict-frees', 'virtue')]:
    'Tohle je nejvzácnější forma vhledu v celém slyšení — rozpoznat, že poruchou byl samotný proces, ne jeho výsledek.',
  [reflectionKey('the-scoreboard', 'ask-what-verdict-frees', 'care')]:
    'Přestanete stavět kohokoli, včetně sebe, před soud kvůli otázce, na kterou žádné číslo nikdy doopravdy nemohlo odpovědět.',
});
