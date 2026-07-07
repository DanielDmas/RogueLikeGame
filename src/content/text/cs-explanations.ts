// Czech translations of the "explain this simply" panel — a plain-language,
// ELI15 summary of each stage's situation and question, shown when the
// player clicks the "?" button beside the text panel. Registered under
// version 'v2'. See cs-rooms*.ts for the established pattern this follows.
import { registerAll } from './resolver';
import { roomExplanationKey } from './keys';

registerAll('v2', 'cs', {
  [roomExplanationKey('waiting-room', 0)]:
    'Právě jste se probudili a nevíte, kdo jste — tady se tomu říká „rozpuštění“. Uvaděč je váš průvodce, ani úplně dobrý, ani úplně zlý, jen dělá zvláštní práci. Tyhle tři otázky nemají správnou odpověď; jsou to jen vaše první šance se zorientovat. Představte si to jako probuzení v nemocnici po vážné nehodě, zmatení, s někým laskavým, ale trochu podivným, kdo se vám snaží vysvětlit, kde jste, dřív, než jste připraveni to slyšet. Ať se zeptáte na cokoli, nikdo vás nezkouší — jen si vybíráte, jak chcete začít znovu hledat sami sebe.',

  [roomExplanationKey('wallet', 0)]:
    'Našli jste cizí peněženku plnou peněz, a nikdo se nedívá. Tohle je jedna z nejstarších otázek filozofie: jste poctiví jen proto, že se bojíte, že vás chytí? Představte si, že najdete hotovost na prázdné ulici, bez kamer, bez svědků — vrátili byste ji přesto? Filozof Platón vyprávěl příběh o kouzelném prstenu, který vás udělá neviditelným, aby se zeptal přesně na tohle: kdybyste za to, že si ji necháte, nikdy nic neriskovali, udělali byste to? Není to žádná záludná otázka — jen se ptá, jakým jste člověkem, když vás nikdo nehodnotí.',

  [roomExplanationKey('dinner-table', 0)]:
    'Vaše umírající babička se ptá, jestli se uzdraví — a vy nevíte, co doopravdy chce slyšet. Tohle je klasický problém „laskavé lži“: je někdy správné někomu zalhat, abyste ho ochránili, nebo opravdová láska znamená vždy říkat pravdu, i když bolí? Představte si kamarádku, která se vás těsně před důležitým pohovorem, který nejde přeložit, zeptá, jestli jí to oblečení sluší — někdy upřímnost pomůže, jindy jen zraní, aniž by cokoli změnila. Neexistuje čistá odpověď; každá možnost tady stojí něco jiného.',

  [roomExplanationKey('promotion', 0)]:
    'Váš nejlepší přítel udělal v práci nákladnou chybu, všiml jste si toho jen vy, a nahlásit ji by vám mohlo vynést povýšení, o které oba usilujete. Jde o to, co dlužíte různým lidem najednou: zaměstnavatel chce poctivost, přítel chce věrnost, a vy nemůžete dát naplno oboje. Je to jako zjistit, že váš nejlepší kamarád opsal u testu, který jste oba potřebovali složit, abyste se dostali do stejného programu — řeknete to učiteli, varujete kamaráda soukromě, nebo mlčíte? Ať zvolíte cokoli, něco, na čem vám záleží, nebude zaplaceno celé.',

  [roomExplanationKey('beggars-math', 0)]:
    'Prokřehlý, promoklý cizinec vás žádá o peníze, a zároveň víte, že stejná částka by mohla zachránit víc životů, kdyby šla někam daleko odsud. Tohle je problém „blízkého a vzdáleného“: záleží na člověku přímo před vámi víc než na cizinci, kterého nikdy nepotkáte, i když pomoc tomu vzdálenému technicky udělá víc dobra? Je to jako volit mezi tím, koupit oběd spolužačce, které je dnes očividně zle, nebo darovat stejné peníze charitě, která na papíře pomůže víc lidem celkově. Obě volby jsou laskavé. Jen jsou laskavé jiným směrem.',

  [roomExplanationKey('quiet-alarm', 0)]:
    'Skrz zeď slyšíte děsivou hádku, pak ticho — a nevíte, jestli je to úleva, nebo něco horšího. Jde o to, jak daleko vlastně sahá vaše zodpovědnost za bezpečí cizího člověka: zasáhnete, zavoláte pomoc, nebo se budete starat o svoje? Představte si, že ve dvě ráno slyšíte křik ze sousedního bytu a nevíte, jestli je to jen ošklivá hádka, nebo něco nebezpečného — každá možnost (zaklepat, zavolat policii, počkat, ignorovat to) má reálnou cenu, a vy se pravděpodobně nikdy s jistotou nedozvíte, jestli jste udělali správnou věc.',

  [roomExplanationKey('buridans-queue', 0)]:
    'Dvoje dveře jsou ve všem naprosto totožné, a vy si přesto nějak musíte jedny vybrat. Tohle vlastně není morální dilema — jde o to, jak vůbec děláme rozhodnutí, když opravdu neexistuje dobrý důvod upřednostnit jednu možnost před druhou. Existuje starý příběh o hladovém oslu, který stojí přesně mezi dvěma stejnými hromadami sena a údajně umře hlady, protože nikdy nenajde důvod vybrat si jednu z nich. Je to hravá připomínka, že někdy je „prostě si vybrat“ jediný rozumný krok — čekání na dokonalý důvod, který nikdy nepřijde, je taky svým způsobem volba.',

  [roomExplanationKey('the-reference', 0)]:
    'Blízký přítel od vás potřebuje doporučující dopis na práci, na kterou se úplně nehodí, a cokoli napíšete, bude číst cizí člověk, který spoléhá na vaši upřímnost. Jde o to, komu vlastně dlužíte věrnost: příteli, kterého máte rádi, nebo cizinci, který se spoléhá na vaše slovo? Je to jako kdyby vás požádali, abyste zaručili kamarádovy schopnosti hlídat děti neznámé rodině, přestože si docela jistě myslíte, že s dětmi moc neumí — každá verze dopisu (zářivá, upřímná, nebo odmítnutí napsat ho vůbec) je k někomu nespravedlivá.',

  [roomExplanationKey('photograph', 0)]:
    'Budova hoří, a vy můžete jedněmi dveřmi zachránit život cizího člověka, nebo druhými jediný důkaz toho, kým jste bývali — ne obojí najednou, bez kompromisu. Tohle je klasická „nemožná volba“, kterou se testuje, na čem nám doopravdy záleží: je fotografie jen věc, nebo ztráta jediné kotvy vašich vzpomínek znamená ztrátu kousku sebe sama? Představte si požár domu, kde byste mohli popadnout rodinné fotoalbum (jediné kopie, nic zálohované online), nebo pomoct cizímu člověku uvězněnému poblíž — obojí se cítí jako skutečná ztráta, a tahle místnost je postavená tak, že ať zvolíte cokoli, něco vás to opravdu stojí.',

  [roomExplanationKey('junction', 0)]:
    'Splašená tramvaj se chystá zabít pět lidí, pokud nezatáhnete za páku a nepřesměrujete ji na kolej, kde místo toho zabije jednoho člověka. Tohle je nejslavnější myšlenkový experiment ve filozofii — „problém s tramvají“ — a ptá se, jestli je v pořádku aktivně způsobit jednu smrt, abyste zabránili pěti, nebo jestli nedělat nic (i když v důsledku zemře víc lidí) je mravně něco jiného, než dělat něco. Většina lidí řekne „zatáhnu za páku“ — ale další část této místnosti otestuje, jestli ta odpověď obstojí, až to bude osobnější.',
  [roomExplanationKey('junction', 1)]:
    'Stejná tramvaj, stejná matematika — pět životů za jeden — ale teď je jediný způsob, jak zachránit těch pět, strčit člověka z mostu vlastníma rukama, ne přepnout páku. Většina lidí, kteří ochotně zatáhli za páku, tady odmítne strčit, přestože čísla jsou identická. Tahle místnost je postavená přesně na odhalení tohohle rozporu: existuje skutečný mravní rozdíl mezi nepřímým způsobením újmy (přes stroj) a přímým způsobením (vlastníma rukama), nebo je to jen ošklivost pocitu oblečená za etiku? Zamyslete se nad rozdílem mezi firmou, která propouští lidi přes nějakou politiku, a manažerem, který někoho osobně vyhodí tváří v tvář — stejný výsledek, úplně jiný pocit.',

  [roomExplanationKey('experience-machine', 0)]:
    'Stroj vám nabízí dokonalý, nekonečně šťastný život, který bude působit naprosto skutečně — nikdy nepoznáte, že je falešný. Napojili byste se navždy? Tohle testuje, jestli je štěstí opravdu jediná věc, na které záleží, nebo jestli nám také záleží na tom, aby věci byly skutečné a doopravdy naše. Je to jako kdyby vám nabídli nejrealističtější, nejdokonalejší videohru, jakou kdy udělali, takovou, kterou byste nikdy nerozeznali od skutečného života, se zaručeným úspěchem a láskou — ale museli byste se navždy odpojit od svého skutečného života a lidí v něm. Většina lidí zaváhá, a tahle místnost chce, abyste si všimli proč.',

  [roomExplanationKey('ship', 0)]:
    'Sledujete, jak vás řemeslníci nahrazují, kousek po kousku — vzpomínky, zvyky, buňky — zatímco vedle sedí přesná kopie sestavená z vašich odložených kusů a kontroluje si tvář v zrcadle. Který z vás je po dokončení opravdu „vy“? Tohle je starobylá hádanka „Théseovy lodi“: pokud se během let vymění každé prkno lodi, je to pořád stejná loď? Žádná buňka ve vašem těle není stejná jako před deseti lety, a i vaše názory a vzpomínky se hodně změnily, přesto se pořád cítíte jako „vy“. Co vás tedy vlastně dělá stejným člověkem v čase?',

  [roomExplanationKey('casino-pascal', 0)]:
    'Kasino vám nabízí zvláštní sázku: vsaďte na to, že Bůh existuje, a pokud máte pravdu, vyhrajete všechno navždy; pokud se pletete, neztratíte nic. Zní to jako jasná volba, ne? Tohle je slavná sázka filozofa Blaise Pascala, a tahle místnost je postavená tak, aby v ní hledala díry — třeba: který Bůh? A počítá se sázka na náboženství „jen kvůli výhře“, místo aby v něj člověk opravdu věřil, vůbec jako skutečná víra? Je to trochu jako přihlásit se do posilovny, o které nevěříte, že bude fungovat, čistě proto, že podmínky zkušební lhůty vypadají na papíře skvěle — matematika možná sedí, ale znamená to opravdu něco?',

  [roomExplanationKey('omelas', 0)]:
    'Našli jste dokonalé, radostné město — ale celé jeho štěstí závisí na tom, že jedno dítě zůstane navždy uvězněné v bídě ve sklepě, a nedá se nic udělat pro jeho osvobození, aniž by se všechno zhroutilo. V téhle místnosti záměrně neexistuje dobrá možnost. Je to slavný příběh, který se ptá: je někdy v pořádku, aby štěstí celé společnosti stálo na utrpení jednoho člověka, pokud čísla „vycházejí“ — mnoho šťastných lidí proti jednomu nešťastnému? Zamyslete se nad věcmi nebo pohodlím, které si denně užíváte a o kterých víte, že je pravděpodobně někde vyrobil někdo v hrozných podmínkách — tahle místnost jen dělá tenhle kompromis nemožným přehlédnout.',

  [roomExplanationKey('chinese-room', 0)]:
    'Budka odpoví na jakoukoli otázku dokonale, vřelými a promyšlenými slovy — ale když nakouknete dovnitř, najdete jen někoho, kdo mechanicky přiřazuje symboly podle pravidel, aniž by tušil, co to všechno vlastně znamená. „Rozumí“ vám ta budka, nebo to jen výborně předstírá? Tohle je v podstatě stejná otázka, jakou si dnes lidé kladou o AI chatbotech: pokud něco dokáže vést dokonalý rozhovor bez jakéhokoli skutečného porozumění vzadu, záleží ten rozdíl vůbec člověku, se kterým to mluví? Možná neexistuje čistá odpověď — a o to tady jde.',

  [roomExplanationKey('newcomb-annex', 0)]:
    'Stroj, který se ještě nikdy nespletl, už včera přesně rozhodl, co si dnes vyberete — a podle té předpovědi krabici naplnil, nebo nenaplnil. Vezmete si obě krabice (logicky je obsah už daný, tak si vezměte všechno), nebo jen tu jednu, které má věřit (a která historicky vždycky vyplatí)? Tohle je slavná hádanka o předpovědi a svobodné vůli: pokud něco dokáže dokonale předpovědět vaše volby, jsou vaše volby pořád opravdu „svobodné“? Je to trochu jako kamarád, který vás zná tak dobře, že vždycky uhodne, co si objednáte v restauraci — vybíráte si vy, nebo jste jen předvídatelní?',

  [roomExplanationKey('veil-of-ignorance', 0)]:
    'Máte navrhnout všechna pravidla pro malé městečko — ale pak vás náhodně umístí do jedné z jeho dvanácti domácností, bez možnosti si vybrat kterou. Navrhli byste to jinak, kdybyste věděli, že můžete skončit v nejhůř postavené domácnosti místo v té nejlepší? Tohle je slavná myšlenka filozofa Johna Rawlse na to, jak zjistit, co je vlastně spravedlivé: představte si, že navrhujete pravidla pro celou zemi, aniž byste věděli, jestli se narodíte bohatí, nebo chudí, zdraví, nebo nemocní, šťastní, nebo ne. Je to jako kdyby vás požádali napsat pravidla pro dělení pizzy, dřív než víte, který kousek dostanete vy — najednou chcete, aby to bylo spravedlivé pro všechny, ne jen pro vítěze.',

  [roomExplanationKey('court-of-usher', 0)]:
    'Uvaděč postaví sám sebe před soud a požádá vás, abyste byli soudcem: je něco „dobré“ jednoduše proto, že to řekl on, nebo to řekl proto, že to bylo dobré už samo o sobě? Zní to abstraktně, ale hodně na tom záleží: pokud je pravidlo správné jen proto, že to řekl někdo mocný, ta samá autorita by stejně snadno mohla nazvat „dobrou“ i hroznou věc. Vzpomeňte si na rodiče nebo učitele, kteří řeknou „protože jsem to řekl já“ — je to opravdu dobrý důvod, nebo doufáme, že za tím je hlubší důvod, kterému se musí zodpovídat i oni sami? O téhle otázce se lidé hádají přes dva tisíce let.',

  [roomExplanationKey('teleporter', 0)]:
    'Stroj vám nabízí, že vás dostane přes nepřekonatelnou propast tak, že vás naskenuje, zničí a dokonale znovu vytiskne na druhé straně — kopie si bude všechno pamatovat a bude mít pocit, že prošla. Ale zemřeli „vy“? Tohle je jedna z největších hádanek o osobní identitě: pokud je zachován úplně každý atom a každá vzpomínka, záleží na tom, že originál byl zničen? Je to myšlenkový experiment na reálný fakt — buňky vašeho těla se stejně neustále obměňují, tak co vás vlastně dělá „vámi“ ze dne na den, když ne nějaká nepřerušená fyzická nit?',

  [roomExplanationKey('editor', 0)]:
    'Pero dokáže natrvalo vymazat vaši jedinou nejhorší vzpomínku — bez vedlejších účinků, bez háčku, ta věc se vám prostě přestane stávat, jako by se vám nikdy nestala. Použili byste ho? Tohle se ptá, jestli bolestné vzpomínky jsou jen utrpení, bez kterého by nám bylo lépe, nebo jestli tiše vybudovaly část toho, kým jste — vaši trpělivost, vaši empatii, vaše porozumění bolesti druhých lidí. Vzpomeňte si na těžký rozchod nebo velký neúspěch, který tehdy hodně bolel, ale o kterém teď víte, že vás naučil něco skutečného o vás samých. Vymazalo by to zranění zároveň i něco, co byste si vlastně chtěli nechat?',

  [roomExplanationKey('introduction', 0)]:
    'Místnost postupně odstraní každou možnou odpověď na otázku „kdo jste?“ — vaše jméno, vaši práci, dokonce i váš životní příběh — a ptá se, co zbylo. Zní to jako trik, ale je to skutečná a stará filozofická otázka: kdybyste odstranili každý štítek a každý příběh o sobě, zbylo by pod tím nějaké „vy“, nebo je „vy“ ve skutečnosti tvořeno úplně jen z těch štítků a příběhů? Zkuste si to na chvíli sami: kdybyste nemohli odpovědět svým jménem, prací, rolí v rodině, ani žádným příběhem o své minulosti, co by vůbec zbylo, čím odpovědět?',
  [roomExplanationKey('introduction', 1)]:
    'Poté, co jste se už vzdali svého jména, role i příběhu, se místnost ptá „kdo jste?“ ještě jednou — a tentokrát skoro není po čem sáhnout. Tohle je nejtěžší verze stejné otázky: většině lidí je tu nepříjemně, nebo úplně ztichnou, protože jsme si tak zvykli popisovat se pomocí štítků, že odpovídat bez nich se cítí jako stát v prázdné místnosti se zhasnutými světly. Neexistuje špatná odpověď, ale všimněte si, po jaké odpovědi sáhnete, když všechny ty snadné zmizí.',

  [roomExplanationKey('debt-of-dead', 0)]:
    'Někdo, kdo vám v minulosti opravdu ublížil, teď umírá a upřímně se ptá: „dokážeš mi odpustit?“ — a vidíte, že to myslí vážně, což ale nesmazává to, co udělal. Jde o to, jestli odpuštění dlužíte někomu jen proto, že lituje a umírá, nebo jestli je důležitější upřímnost o tom, jak moc vás to zranilo, než dopřát mu klidný konec. Představte si přítele, který vás před lety hluboce zradil a teď se omlouvá na smrtelné posteli — řeknete to, co ho utěší, co je upřímně pravda pro vás, nebo něco mezi tím? Neexistuje tu špatný pocit, jen různé druhy upřímnosti.',

  [roomExplanationKey('marys-room', 0)]:
    'Žena, která celý život žila v černobílém pokoji, zná úplně každý vědecký fakt o červené barvě — přesnou vlnovou délku, jak ji zpracovávají oči a mozek — ale nikdy ji doopravdy neviděla. Pokud konečně poprvé uvidí červenou, naučí se něco nového, i když už o ní „všechno“ věděla? Tohle se ptá, jestli zažít něco (jako ochutnat své oblíbené jídlo, nebo se zamilovat) je úplně jiný druh poznání než jen znát fakta o tom. Mohli byste přečíst každou vědeckou studii o chuti čokolády a pořád by vám chybělo něco, co byste získali jen tím, že ji doopravdy ochutnáte.',

  [roomExplanationKey('butterfly-dream', 0)]:
    'Probudíte se ze snu, ve kterém jste byli motýlem, ve snu naprosto přesvědčení, že jste opravdu motýl — a teď si nejste stoprocentně jistí, který z toho je sen: jste člověk, kterému se zdálo, že je motýlem, nebo jste teď motýl, kterému se zdá, že je člověkem? Tohle se nemá řešit — je to slavný starý příběh (od filozofa Čuang-c’) použitý k jemnému zpochybnění toho, jak moc jsme si vlastně jistí, že „teď“ je ta skutečná, pevná verze. Probudili jste se už někdy ze snu tak živého, že vám pár vteřin trvalo, než jste si vzpomněli, který život je ten skutečný?',

  [roomExplanationKey('swampman', 0)]:
    'Blesk udeří do bažiny a čirou náhodou sestaví někoho molekulu po molekule identického s vámi — stejné vzpomínky, stejný hlas, stejná láska k vaší matce — jenže tahle bytost vznikla teprve před čtyřiceti vteřinami a nemá žádnou skutečnou historii prožívání vašeho života. Je to vy? Tohle se ptá, jestli vás dělá „vámi“ vaše mysl a vzpomínky (v tom případě ano, samozřejmě), nebo jestli záleží i na tom, že jste ten život doopravdy prožili (v tom případě ne — je to jen velmi přesvědčivý cizinec). Je to jako ptát se, jestli by dokonalý AI klon vaší osobnosti, natrénovaný na všem, co jste kdy řekli, byl doopravdy vámi, nebo jen něčím, co nosí váš hlas.',

  [roomExplanationKey('the-cave', 0)]:
    'Ukážou vám vaše vlastní minulé volby, sehrané jako stíny na zdi, a požádají vás, abyste je jen sledovali — nebo je označili za svoje. Tahle místnost se objeví jen tehdy, když jste už touhle cestou jednou prošli, a je postavená na Platónově slavném „Podobenství o jeskyni“: lidé, kteří kdy viděli jen stíny na zdi, je zamění za celou realitu, a je opravdu nepříjemné ustoupit a doopravdy se podívat na to, co je vrhá. Tohle není ani tak dilema jako pozvání podívat se poctivě na vzorce ve vlastních volbách, aniž byste uhnuli pohledem.',

  [roomExplanationKey('free-will', 0)]:
    'Stroj tvrdí, že už předem přesně napsal, které tlačítko stisknete — a ještě nikdy se nespletl. Cokoli uděláte, i schválná snaha ho vyvrátit, jako by bylo taky předpovězeno. Tohle je velká otázka za „svobodnou vůlí“: pokud všechno na vás (váš mozek, vaše minulost, vaše zvyky) způsobuje vaše volby, jsou vaše volby pořád opravdu „svobodné“, nebo jen výsledkem věcí, které jste si nevybrali? Zamyslete se, jak předvídatelní byste mohli být pro někoho, kdo vás opravdu dobře zná — znamená předvídatelnost, že si ve skutečnosti nevybíráte, nebo mohou být obě věci pravdivé zároveň?',

  [roomExplanationKey('boulder', 0)]:
    'Dostanete úkol, který nikdy nejde doopravdy dokončit — ať naskládáte kameny sebelíp, vždycky zase spadnou, navždy. Tahle místnost je postavená na starověkém mýtu o Sisyfovi, muži odsouzeném navěky tlačit balvan do kopce a sledovat, jak se pokaždé skutálí zpátky. Otázka nezní „jak vyhrát“ — nejde to — jde o to, jak byste se rozhodli věnovat energii něčemu, co nikdy nebude „hotové“: se zuřivostí, s vtipem, odmítnutím to zkoušet, nebo tím, že samotné konání uděláte svým vlastním, i když víte, že nikdy neskončí.',

  [roomExplanationKey('last-message', 0)]:
    'Můžete poslat zpátky do bdělého světa přesně jednu větu — nic víc, žádné doplnění, jen jednu zprávu, která se k někomu nějak dostane jako sen, pocit, nebo náhlá myšlenka. Tohle vlastně není hádanka k vyřešení; je to příležitost všimnout si, co byste si vybrali říct, kdybyste měli jen jeden pokus a museli ho využít naplno, tomu, na kom vám nejvíc záleží. Představte si to jako jedinou textovou zprávu, kterou můžete někomu poslat, se zárukou, že dorazí a bude opravdu vyslyšena, bez možnosti cokoli později doplnit nebo vysvětlit — co byste vlastně napsali?',

  [roomExplanationKey('door-that-asks', 0)]:
    'Než se poslední dveře otevřou, vyslechnou si vás o volbách, které jste udělali během celé téhle cesty, a ptají se, jestli si za nimi pořád stojíte — ne aby vás ohodnotily, ale aby zjistily, jestli jste upřímní ke svému vlastnímu příběhu. Tahle místnost se vlastně ptá: je obdivuhodnější zůstat dokonale konzistentní se vším, co jste kdy zvolili, nebo umět říct „mýlil jsem se, a přesně tohle mě přimělo změnit názor“? Vzpomeňte si na názory, které jste jako dítě zastávali silně a od té doby jste je změnili — je to růst, nebo to znamená, že vaše mladší já se prostě mýlilo?',
  [roomExplanationKey('door-that-asks', 1)]:
    'Poslední dveře jsou otevřené, a vy konečně musíte zvolit, jak tahle cesta doopravdy skončí: vrátit se zpátky do svého obyčejného života, zůstat tady a pomáhat dalšímu ztracenému poutníkovi, nebo si dovolit úplně odpočinout. Mezi těmito konci není žádný „správný“ — každý je prostě jiný, stejně upřímný způsob, jak odpovědět na to, co teď doopravdy chcete, po tom všem, čím jste prošli. Je to trochu jako konečně dokončit dlouhý, náročný projekt a muset se rozhodnout: vrhnete se rovnou na další věc, dopřejete si zasloužený odpočinek, nebo použijete to, co jste se naučili, abyste pomohli někomu jinému projít tím samým?',

  [roomExplanationKey('the-archive', 0)]:
    'Ukážou vám založený, datovaný záznam volby, kterou jste udělali při své minulé cestě tímhle místem, přečtený vám nazpět bez emocí, bez kontextu, díky kterému se tehdy zdála rozumná. Stojíte si za ní pořád, distancujete se od ní, nebo jen přijmete, že se to stalo, aniž byste to plně soudili jedním či druhým směrem? Jde o to, jak se vztahujeme ke svým vlastním minulým chybám nebo rozhodnutím, když už uplynul čas — jako číst starý zápis v deníku nebo starou textovou zprávu, kterou jste poslali, a nebýt si úplně jistí, jestli osoba, která to napsala, a osoba, která to teď čte, jsou tak úplně stejné.',

  [roomExplanationKey('the-unchosen', 0)]:
    'Ukážou vám dveře, kolem kterých jste při minulé cestě tudy prošli, aniž byste je otevřeli — cesty, které jste nikdy nešli a teď jsou navždy neznámé. Jedny z nich se samy znovu pootevřou se skřípěním. Jde o zvláštní přitažlivost „nevyšlapané cesty“: podíváte se konečně dovnitř, čistě ze zvědavosti, teď když vás to nic nestojí? Nebo je necháte zavřené, s tím, že ne každé neotevřené dveře byly tajně promarněnou příležitostí? Většina lidí se při ohlédnutí za svým životem ptá aspoň na jednu cestu, kterou nešli — tahle místnost ten pocit jen zhmotňuje.',

  [roomExplanationKey('the-echo', 0)]:
    'Naproti vám sedí hlas, sestavený celý z toho, co jste řekli a zvolili, když jste tu byli naposledy — ne duch, jen ozvěna dřívější verze vás samých. Promluvíte na něj, sednete si potichu a pro jednou opravdu poslouchejte, nebo si uvědomíte, že v místnosti vlastně nikdy nikdo jiný nebyl — jen vy, ve dvou různých časech? Jde o to, jestli „vy“ z minulosti a „vy“ teď jste doopravdy stejný člověk, nebo spíš dvě různé kapitoly stejné knihy, které se na chvíli potkaly.',
});
