// Czech translations for LIMERENCE Act III's Examined Path reflections (spec
// 05). Every line is translated with the specific room's actual situation
// and the choice's real stakes in mind, not word-for-word from English —
// see CLAUDE.md's translation rule. Two rooms have choices with no
// `reflections` field in the English source: the-usual-suite (none of its
// three choices carry one) and the-wedding-eve's keepsake choice
// hold-the-cheap-ring — both are correctly absent from this file. Dana is
// treated the same indeclinable, gender-neutral way here as in
// cs-rooms-act3.ts (see that file's header for the full rationale);
// Rowan, Petra and Sam follow the same per-character gender rules laid out
// there too.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'cs', {
  // ---------- The Colleague ----------
  [reflectionKey('the-colleague', 'the-balcony', 'consequence')]:
    'Jedna noc na konferenci mění to, co ta společná zkratka nese dál, bez ohledu na to, jak se to potom zpětně zaškatulkuje.',
  [reflectionKey('the-colleague', 'the-balcony', 'duty')]:
    'Tyhle dveře se otevřely, aniž by Dana byl v místnosti, aby mohl souhlasit s tím, co to bude stát ten vztah.',
  [reflectionKey('the-colleague', 'the-balcony', 'virtue')]: 'Všimněte si, jak rychle přišly ty racionalizace — chuť převlečená za nevyhnutelnost.',
  [reflectionKey('the-colleague', 'the-balcony', 'care')]:
    'Dana, spící dvě stě kilometrů odsud, neměl žádné slovo v rozhodnutí, které přetváří to, k čemu se vrátí domů.',
  [reflectionKey('the-colleague', 'walk-away', 'consequence')]:
    'Odchod stojí vřelost toho večera, ale vyhne se ceně, která by se jinak měsíce navyšovala.',
  [reflectionKey('the-colleague', 'walk-away', 'duty')]: 'Tohle dodrželo slib z dohody, kterou Dana nebyl v místnosti, aby mohl vymáhat.',
  [reflectionKey('the-colleague', 'walk-away', 'virtue')]:
    'Tohle je integrita provozovaná ve chvíli, kdy by se to jinak doslova nikdo nikdy nedozvěděl.',
  [reflectionKey('the-colleague', 'walk-away', 'care')]:
    'Ochránili jste důvěru Dana, aniž by se Dana kdy musel dozvědět, že vůbec bylo co chránit.',
  [reflectionKey('the-colleague', 'name-it-in-the-corridor', 'consequence')]:
    'Pojmenování stojí to přátelství jeho starou, snadnou zkratku, výměnou za takovou, která už nevyžaduje hlídat živý drát.',
  [reflectionKey('the-colleague', 'name-it-in-the-corridor', 'duty')]:
    'Tohle jste dlužili Rowan stejně jako Dana — zasloužila si pojmenovanou hranici, ne tichý ústup.',
  [reflectionKey('the-colleague', 'name-it-in-the-corridor', 'virtue')]:
    'Tohle si žádalo víc odvahy než buď projít těmi dveřmi, nebo se jim potichu vyhnout — říct tu pravdivou větu nahlas.',
  [reflectionKey('the-colleague', 'name-it-in-the-corridor', 'care')]:
    'Dali jste Rowan stejnou jasnost a respekt, jaký jste si nárokovali pro sebe.',
  [reflectionKey('the-colleague', 'postpone', 'consequence')]:
    'Odklad se vyhne dnešní ceně, ale zároveň navyšuje rozhodnutí, které už bylo fakticky učiněné.',
  [reflectionKey('the-colleague', 'postpone', 'duty')]:
    'Tohle nechává závazek vůči Dana neřešený, místo abyste ho buď dodrželi, nebo čistě porušili.',
  [reflectionKey('the-colleague', 'postpone', 'virtue')]: 'Všimněte si toho sebeklamu, který je potřeba na to, abyste tomuhle mohli říkat „nic se neděje“.',
  [reflectionKey('the-colleague', 'postpone', 'care')]:
    'Dana má nárok na partnera, který se doopravdy rozhodl, ne na takového, co si nechává dveře pootevřené na později.',

  // ---------- The Metamour ----------
  [reflectionKey('the-metamour', 'enforce-via-dana', 'consequence')]:
    'Nasměrovat tu hranici přes Dana je strukturálně správné a výsledkem nejisté — místnost nepředstírá, že delegování je totéž co kontrola.',
  [reflectionKey('the-metamour', 'enforce-via-dana', 'duty')]:
    'Tohle respektuje, že vztah s Petrou je na starost Dana, ne na to, abyste ho přímo hlídali vy.',
  [reflectionKey('the-metamour', 'enforce-via-dana', 'virtue')]:
    'Všimněte si, jestli je tohle trpělivost, nebo způsob, jak se sami vyhnout těžšímu rozhovoru.',
  [reflectionKey('the-metamour', 'enforce-via-dana', 'care')]: 'Petra tu hranici tak jako tak zažije z druhé ruky, a to ovlivňuje, jak na ni dopadne.',
  [reflectionKey('the-metamour', 'talk-to-petra', 'consequence')]:
    'Přímá komunikace s metamour řeší ten šev přesně tam, kde doopravdy je, za cenu opravdu trapného rozhovoru.',
  [reflectionKey('the-metamour', 'talk-to-petra', 'duty')]:
    'Tohle zachází s Petrou jako se stranou, které náleží přímá komunikace, ne jako s problémem, který se má obcházet.',
  [reflectionKey('the-metamour', 'talk-to-petra', 'virtue')]:
    'Tohle si žádalo opravdovou společenskou odvahu — začít rozhovor, na který neexistuje žádný zavedený scénář.',
  [reflectionKey('the-metamour', 'talk-to-petra', 'care')]:
    'Tohle staví do středu skutečný vztah mezi dvěma zasaženými lidmi, místo aby to řešilo triangulací přes Dana.',
  [reflectionKey('the-metamour', 'name-the-hierarchy', 'consequence')]:
    'Výslovné pojmenování hierarchie vymění pohodlí předstírání, že neexistuje, za strukturu, ve které se všichni doopravdy dokážou orientovat.',
  [reflectionKey('the-metamour', 'name-the-hierarchy', 'duty')]:
    'Všem třem vám náležel přesný popis skutečné podoby toho vztahu, ne jeho idealizované verze.',
  [reflectionKey('the-metamour', 'name-the-hierarchy', 'virtue')]:
    'Tohle vyžadovalo přiznat nepříjemnou pravdu o vlastním uspořádání, místo abyste hájili jeho oficiální verzi.',
  [reflectionKey('the-metamour', 'name-the-hierarchy', 'care')]:
    'Tohle dává Petře jasné podmínky, se kterými může doopravdy pracovat, místo nevyslovené hierarchie, kterou by musela odhadovat.',
  [reflectionKey('the-metamour', 'audit-the-jealousy', 'consequence')]:
    'Prozkoumat ten pocit nejdřív stojí čas, než začnete jednat, ale vytvoří to přesnější mapu toho, co je doopravdy potřeba opravit.',
  [reflectionKey('the-metamour', 'audit-the-jealousy', 'duty')]:
    'Tohle dává pravdě její plnou složitost, místo aby sáhlo po nejjednodušším dostupném padouchovi.',
  [reflectionKey('the-metamour', 'audit-the-jealousy', 'virtue')]:
    'Tohle je těžší, míň uspokojivá disciplína — vydržet s nejednoznačností, místo abyste ji předčasně vyřešili.',
  [reflectionKey('the-metamour', 'audit-the-jealousy', 'care')]:
    'Tohle chrání Dana i Petru před reakcí, která ještě nebyla odlišená od skutečného porušení hranice.',

  // ---------- The Veto ----------
  [reflectionKey('the-veto', 'comply', 'consequence')]:
    'Dodržet veto zachová tu dřívější dohodu za přímou cenu vztahu s člověkem, který sám neporušil žádné pravidlo.',
  [reflectionKey('the-veto', 'comply', 'duty')]: 'Pravidlo odsouhlasené v prvním roce vás váže i teď, ať vás jeho dodržení stojí cokoli.',
  [reflectionKey('the-veto', 'comply', 'virtue')]: 'Tohle je věrnost závazku, testovaná v jeho nejdražší chvíli.',
  [reflectionKey('the-veto', 'comply', 'care')]: 'Sam nese celou cenu pravidla, na jehož psaní nikdy neměl žádný hlas.',
  [reflectionKey('the-veto', 'fight-the-rule', 'consequence')]:
    'Zpochybnit to pravidlo riskuje stabilitu vztahu, jen abyste otestovali, jestli bylo to pravidlo vůbec někdy férové.',
  [reflectionKey('the-veto', 'fight-the-rule', 'duty')]:
    'Náleželo vám slovo v tom, jestli pravidlo, které mohlo ukončit váš vztah se Sam, je pořád to správné pravidlo.',
  [reflectionKey('the-veto', 'fight-the-rule', 'virtue')]:
    'Tohle je těžší integrita — riskovat skutečný konflikt, abyste otestovali strukturu, místo abyste se jí prostě podřídili.',
  [reflectionKey('the-veto', 'fight-the-rule', 'care')]:
    'Tohle nutí Dana čelit strachu zapojením, místo aby dostal snadný, jednostranný východ.',
  [reflectionKey('the-veto', 'examine-the-veto', 'consequence')]:
    'Pochopení původu toho pravidla dnešní rozhodnutí nevyřeší, ale dělá to, co si zvolíte dál, upřímnějším.',
  [reflectionKey('the-veto', 'examine-the-veto', 'duty')]:
    'Tohle zachází s pravidlem jako s něčím, čemu náleží skutečné zkoumání, místo slepé poslušnosti nebo slepého vzdoru.',
  [reflectionKey('the-veto', 'examine-the-veto', 'virtue')]:
    'Tohle je intelektuální poctivost uplatněná na historii vašeho vlastního vztahu, ne jen na abstraktní argumenty.',
  [reflectionKey('the-veto', 'examine-the-veto', 'care')]:
    'Tohle zpomaluje rozhodnutí, které se týká tří lidí, ve prospěch toho, abyste mu nejdřív doopravdy porozuměli.',
  [reflectionKey('the-veto', 'counter-veto', 'consequence')]:
    'Odpovědět stejným vetem eskaluje konflikt, aniž by se vyřešilo, jestli bylo to původní uplatnění férové.',
  [reflectionKey('the-veto', 'counter-veto', 'duty')]: 'Oplatit stejnou mincí není totéž jako řešit skutečný spor o to pravidlo.',
  [reflectionKey('the-veto', 'counter-veto', 'virtue')]:
    'Všimněte si toho vzorce, pokud je to váš vzorec — odpovědět na hranici stejně velkou opačnou, místo abyste zkoumali kteroukoli z nich.',
  [reflectionKey('the-veto', 'counter-veto', 'care')]: 'Petra se stává vedlejší obětí sporu, který nikdy doopravdy nebyl o ní.',

  // ---------- The Drift ----------
  [reflectionKey('the-drift', 'start-the-work', 'consequence')]:
    'Začít tu práci riskuje skutečné úsilí za nejistou návratnost, a přesně to ji odlišuje od pouhého unášení se proudem.',
  [reflectionKey('the-drift', 'start-the-work', 'duty')]:
    'Tohle ctí závazek daný před lety tím, že se o něj doopravdy staráte, místo abyste předpokládali, že se postará sám o sebe.',
  [reflectionKey('the-drift', 'start-the-work', 'virtue')]: 'Tohle je těžší, nevděčná disciplína — zvolit si úsilí před pohodlím usazené otupělosti.',
  [reflectionKey('the-drift', 'start-the-work', 'care')]:
    'Tohle nabízí Dana partnera, který si znovu aktivně volí ten vztah, ne takového, co ho jen obývá.',
  [reflectionKey('the-drift', 'raise-it', 'consequence')]:
    'Položit tu otázku riskuje skutečné narušení, výměnou za informaci, kterou ten vztah potřeboval bez ohledu na odpověď.',
  [reflectionKey('the-drift', 'raise-it', 'duty')]: 'Oběma vám náleželo poctivé vyúčtování, ne pohodlné ticho.',
  [reflectionKey('the-drift', 'raise-it', 'virtue')]: 'Tohle vyžadovalo pojmenovat strach nahlas, místo abyste ho donekonečna obcházeli.',
  [reflectionKey('the-drift', 'raise-it', 'care')]:
    'Tohle dává Dana šanci odpovědět upřímně, místo abyste oba dál jen hádali, co ten druhý doopravdy cítí.',
  [reflectionKey('the-drift', 'accept-quiet-as-love', 'consequence')]:
    'Přijmout to ticho dnes večer nic nestojí, a záleží úplně na tom, jestli to byla doopravdy volba, ne rezignace.',
  [reflectionKey('the-drift', 'accept-quiet-as-love', 'duty')]:
    'Tohle ctí to, čím se ten vztah doopravdy stal, místo aby ho měřilo proti dřívější, hlasitější verzi.',
  [reflectionKey('the-drift', 'accept-quiet-as-love', 'virtue')]:
    'Tohle vyžaduje skutečnou upřímnost k sobě — rozlišit přijetí od rezignace, které navenek vypadají identicky.',
  [reflectionKey('the-drift', 'accept-quiet-as-love', 'care')]:
    'Tohle nabízí Dana partnera, který si cení toho, co doopravdy je, vyřčeného, ne jen předpokládaného.',
  [reflectionKey('the-drift', 'notice-youve-left', 'consequence')]:
    'Pojmenovat, že jste už odešli, dnes večer nic nemění, ale dělá to každou budoucí volbu upřímnější.',
  [reflectionKey('the-drift', 'notice-youve-left', 'duty')]:
    'Dana jednou náleží pravda o tom, kde doopravdy stojíte, i když ji tahle místnost dnes večer nevynucuje.',
  [reflectionKey('the-drift', 'notice-youve-left', 'virtue')]: 'Tohle je nepříjemné sebepoznání, ke kterému jste došli, aniž byste před ním uhnuli.',
  [reflectionKey('the-drift', 'notice-youve-left', 'care')]:
    'Tohle je soukromé zjištění, které se přesto týká někoho, komu to ještě nikdo neřekl.',

  // ---------- The Second Account ----------
  [reflectionKey('the-second-account', 'delete-it', 'consequence')]:
    'Smazání odstraní trvající, skrytou cenu, kterou ten vztah platí, za cenu skutečných, byť malých abstinenčních příznaků.',
  [reflectionKey('the-second-account', 'delete-it', 'duty')]:
    'Dana náležel partner, který si potichu nerozděluje pozornost do účtu, o kterém Dana neví, že existuje.',
  [reflectionKey('the-second-account', 'delete-it', 'virtue')]: 'Tohle je rozhodná sebekorekce, zvolená dřív, než vás chytí, ne až potom.',
  [reflectionKey('the-second-account', 'delete-it', 'care')]:
    'Tohle přesměruje pozornost, kterou ten účet sklízel, zpátky k člověku, kterému byla potichu upírána.',
  [reflectionKey('the-second-account', 'keep-and-name-it', 'consequence')]:
    'Ponechat si ho a přitom pojmenovat jeho funkci zachová to chování, ale aspoň z něj odstraní ten sebeklam.',
  [reflectionKey('the-second-account', 'keep-and-name-it', 'duty')]:
    'Tohle je částečná upřímnost — upřímná k sobě, pořád ne upřímná k Dana, a místnost vám to nedovolí zapomenout.',
  [reflectionKey('the-second-account', 'keep-and-name-it', 'virtue')]:
    'Tohle je menší, omezenější forma sebeuvědomění, než jakou nabízejí ostatní dveře téhle místnosti.',
  [reflectionKey('the-second-account', 'keep-and-name-it', 'care')]:
    'Strana Dana v téhle rovnici zůstává neřešená volbou, která vyřeší jen vaše vlastní svědomí.',
  [reflectionKey('the-second-account', 'show-dana', 'consequence')]:
    'Úplné odhalení dává Dana pravdivou informaci, na které je ten vztah postavený, za skutečnou, okamžitou citovou cenu.',
  [reflectionKey('the-second-account', 'show-dana', 'duty')]: 'Tohle Dana náleželo přímo od vás, ne aby to objevil, nebo se to nikdy nedozvěděl.',
  [reflectionKey('the-second-account', 'show-dana', 'virtue')]: 'Tohle je upřímnost v její nejvíc vystavené a nejmíň pohodlné podobě, zvolená i tak.',
  [reflectionKey('the-second-account', 'show-dana', 'care')]:
    'Tohle zachází s Dana jako s někým schopným tu pravdu unést, ne jako s někým, koho je před ní potřeba chránit.',
  [reflectionKey('the-second-account', 'defend-the-category', 'consequence')]:
    'Obhajoba té kategorie zachová to chování tím, že znovu otevře spor o jeho definici, místo aby zkoumala jeho dopady.',
  [reflectionKey('the-second-account', 'defend-the-category', 'duty')]:
    'Tohle nahrazuje sémantickým argumentem to poctivé vyúčtování, které Dana doopravdy náleží.',
  [reflectionKey('the-second-account', 'defend-the-category', 'virtue')]:
    'Všimněte si, jak rychle dokáže chytrá definice nahradit opravdové sebezkoumání.',
  [reflectionKey('the-second-account', 'defend-the-category', 'care')]:
    'Tohle nechává Dana informovaného stejně málo jako předtím, než místnost začala, bez ohledu na to, jak ten spor dopadne.',

  // ---------- The Discovery ----------
  [reflectionKey('the-discovery', 'confront-now', 'consequence')]:
    'Okamžitá konfrontace, dřív než se jeden z vás uklidní, vyprodukuje slova, která přežijí, ať se pravda ukáže být jakákoli.',
  [reflectionKey('the-discovery', 'confront-now', 'duty')]: 'Oběma vám náležel rozhovor vedený s dost klidu na to, abyste se doopravdy slyšeli.',
  [reflectionKey('the-discovery', 'confront-now', 'virtue')]: 'Všimněte si, jak málo z toho, co se v té kuchyni řeklo, bylo doopravdy o ověřených faktech.',
  [reflectionKey('the-discovery', 'confront-now', 'care')]:
    'Ať se pravda ukáže být jakákoli, ta zaplavená slova dopadnou na Dana tak jako tak, a zůstanou dopadlá.',
  [reflectionKey('the-discovery', 'gather-first', 'consequence')]:
    'Ověřit si to nejdřív přinese spolehlivější informaci, za cenu dní strávených tajným sledováním člověka, kterého milujete.',
  [reflectionKey('the-discovery', 'gather-first', 'duty')]: 'Tohle sbírá důkazy dřív, než obviníte, což je vůči Dana férovější, bez ohledu na to, co se najde.',
  [reflectionKey('the-discovery', 'gather-first', 'virtue')]:
    'Zeptejte se, co volba tajně vyšetřovat někoho vypovídá o vás, nezávisle na tom, co odhalí o tom druhém.',
  [reflectionKey('the-discovery', 'gather-first', 'care')]: 'Dana je nevědomky studován celé dny předtím, než mu vůbec padne přímá otázka.',
  [reflectionKey('the-discovery', 'pretend', 'consequence')]:
    'Rozhodnutí nevědět se vyhne těžké konfrontaci, ale nechá skutečnou situaci, ať je jakákoli, neřešenou.',
  [reflectionKey('the-discovery', 'pretend', 'duty')]: 'Tohle donekonečna odkládá pravdu, kterou vám možná dluží Dana, a kterou možná dlužíte sami sobě.',
  [reflectionKey('the-discovery', 'pretend', 'virtue')]:
    'Tohle je opravdová, i když nákladná, forma sebeochrany — odmítnutí boje, na který ještě nejste připravení.',
  [reflectionKey('the-discovery', 'pretend', 'care')]: 'Tohle nechává skutečný stav vztahu neprozkoumaný, ať už k lepšímu, nebo k horšímu, pro vás oba.',
  [reflectionKey('the-discovery', 'walk-tonight', 'consequence')]: 'Odchod vyřeší bezprostřední krizi, aniž by kdy vyřešil skutečnou otázku pod ní.',
  [reflectionKey('the-discovery', 'walk-tonight', 'duty')]:
    'Tohle Dana předem bere šanci odpovědět dřív, než padne rozsudek, ať už ten telefon doopravdy znamenal cokoli.',
  [reflectionKey('the-discovery', 'walk-tonight', 'virtue')]: 'Tohle je skutečný, nákladný akt sebezáchovy, ať je to zároveň cokoli dalšího.',
  [reflectionKey('the-discovery', 'walk-tonight', 'care')]: 'Tohle vám oběma upírá rozhovor, který mohl změnit to, co dnešní večer doopravdy znamenal.',
  [reflectionKey('the-discovery', 'steady-then-ask', 'consequence')]:
    'Ten odklad vás stojí dvacet minut nevědění a koupí rozhovor, který nikdo z vás později nemusí brát zpátky.',
  [reflectionKey('the-discovery', 'steady-then-ask', 'duty')]:
    'Dana náležela přímá otázka, ne v zaplavení vynesený rozsudek nebo tajně sestavený případ — tohle je ta prostší povinnost, dodržená.',
  [reflectionKey('the-discovery', 'steady-then-ask', 'virtue')]:
    'Rozhodnutí uklidnit se před těžkým rozhovorem je disciplína, ne úhybný manévr — stojí to skutečné úsilí, udělat to pod tlakem.',
  [reflectionKey('the-discovery', 'steady-then-ask', 'care')]:
    'Ať se pravda ukáže být jakákoli, Dana se zeptá jednou, na rovinu, někdo, kdo tu odpověď dokáže doopravdy slyšet.',

  // ---------- The Wedding Eve ----------
  [reflectionKey('the-wedding-eve', 'sit-with-it-til-morning', 'consequence')]:
    'Vydržet s tou pochybností stojí noc beze spánku, ale přinese jasnější čtení toho, o čem ta pochybnost doopravdy byla.',
  [reflectionKey('the-wedding-eve', 'sit-with-it-til-morning', 'duty')]:
    'Tohle dává té pochybnosti poctivé slyšení, místo abyste ji reflexivně potlačili, nebo poslechli.',
  [reflectionKey('the-wedding-eve', 'sit-with-it-til-morning', 'virtue')]:
    'Tohle je trpělivost pod skutečným tlakem — nepanikařit, ani nepředstírat, ve dvě ráno, noc před svatbou.',
  [reflectionKey('the-wedding-eve', 'sit-with-it-til-morning', 'care')]:
    'Tohle vám dovolí přijít na místo obřadu jako člověk, který tu pochybnost prozkoumal — a to Dana náleží víc než někdo, kdo ji zahrabal.',
  [reflectionKey('the-wedding-eve', 'call-someone-honest', 'consequence')]:
    'Zavolat upřímnému člověku vymění kamarádův spánek za vyjasňující pohled zvenku, ve chvíli s doopravdy vysokými sázkami.',
  [reflectionKey('the-wedding-eve', 'call-someone-honest', 'duty')]:
    'Tohle respektuje váhu zítřejšího závazku natolik, že hledáte opravdovou radu, místo abyste se rozhodovali úplně sami.',
  [reflectionKey('the-wedding-eve', 'call-someone-honest', 'virtue')]:
    'Tohle vyžadovalo přiznat pochybnost nahlas jinému člověku, a to chce svůj vlastní druh odvahy.',
  [reflectionKey('the-wedding-eve', 'call-someone-honest', 'care')]:
    'Tohle zachází s tím rozhodnutím jako s takovým, které se dost týká Dana na to, aby stálo za to ho udělat správně, i v nevhodnou hodinu.',
  [reflectionKey('the-wedding-eve', 'answer-the-flame', 'consequence')]:
    'Znovuotevření toho rozhovoru riskuje, že se vrátí srovnání, které tahle svatba nikdy nebyla stavěná přežít.',
  [reflectionKey('the-wedding-eve', 'answer-the-flame', 'duty')]: 'Tohle Dana v rámci dnešního večera nenáleželo, a Dana neví, že se to stalo.',
  [reflectionKey('the-wedding-eve', 'answer-the-flame', 'virtue')]:
    'Všimněte si, co znamená, že tenhle hovor připadal nutný noc před tím, než se zavážete někomu jinému.',
  [reflectionKey('the-wedding-eve', 'answer-the-flame', 'care')]: 'Dana vstupuje do zítřka, aniž by věděl, že se dnes večer odehrál tenhle rozhovor.',
  [reflectionKey('the-wedding-eve', 'postpone', 'consequence')]:
    'Odklad stojí obrovskou, veřejnou, okamžitou bolest, výměnou za to, že do manželství nevstoupíte s nevyřešenou pochybností.',
  [reflectionKey('the-wedding-eve', 'postpone', 'duty')]:
    'Tohle je upřímnost vůči Dana v nejpozdější možné, nejdražší chvíli, místo aby nebyla upřímná vůbec.',
  [reflectionKey('the-wedding-eve', 'postpone', 'virtue')]:
    'Tohle je ta jedna nejstatečnější věta, jaká je v téhle místnosti k mání, a stojí přesně tolik, kolik obvykle stojí odvaha.',
  [reflectionKey('the-wedding-eve', 'postpone', 'care')]:
    'Tohle dává Dana pravdu dřív, než se složí slib, ne až po něm, ať vás to dnes večer stojí cokoli dalšího.',

  // ---------- The Therapist ----------
  [reflectionKey('the-therapist', 'criticism', 'consequence')]: 'Rozpoznání toho vzorce nezruší jeho minulé případy, ale mění to cenu toho příštího.',
  [reflectionKey('the-therapist', 'criticism', 'duty')]: 'Dana náleží stížnosti na konkrétní chování, ne rozsudky nad charakterem.',
  [reflectionKey('the-therapist', 'criticism', 'virtue')]: 'Tohle vyžadovalo sledovat nelichotivý vlastní vzorec, aniž byste ho hned omluvili.',
  [reflectionKey('the-therapist', 'criticism', 'care')]:
    'Tohle je ten jezdec, který nejpřímočařeji opotřebovává člověka na přijímacím konci, sezení za sezením.',
  [reflectionKey('the-therapist', 'contempt', 'consequence')]:
    'Pojmenování tohohle vzorce stojí těžké přiznání a otevírá jediné dveře, u kterých se prokázalo, že doopravdy předpovídají nápravu.',
  [reflectionKey('the-therapist', 'contempt', 'duty')]: 'Opovržení upírá základní respekt, který Dana náleží bez ohledu na obsah té hádky.',
  [reflectionKey('the-therapist', 'contempt', 'virtue')]:
    'Tohle jsou ze všech čtyř dveří ty nejtěžší projít poctivě, a to samo o sobě stojí za povšimnutí.',
  [reflectionKey('the-therapist', 'contempt', 'care')]:
    'Tohle je jezdec, který výzkum označuje za nejvíc rozežírající pro toho, kdo ho přijímá — ten, který stojí Dana nejvíc.',
  [reflectionKey('the-therapist', 'defensiveness', 'consequence')]: 'Převzít částečnou zodpovědnost stojí hrdost a přináší nepoměrně velké zklidnění.',
  [reflectionKey('the-therapist', 'defensiveness', 'duty')]: 'Dana náleží uznání vašeho podílu, ne vyvracení toho druhého.',
  [reflectionKey('the-therapist', 'defensiveness', 'virtue')]: 'Tohle vyžadovalo odložit reflex — nutkání oponovat místo přijímat.',
  [reflectionKey('the-therapist', 'defensiveness', 'care')]:
    'Tohle je vzorec, který nejpřímočařeji brání Dana v tom, aby se kdy cítil doopravdy vyslyšen.',
  [reflectionKey('the-therapist', 'stonewalling', 'consequence')]:
    'Rozpoznání toho odpojovacího vzorce mu nezabrání se dít, ale zpřístupní ohlášenou pauzu jako náhradu.',
  [reflectionKey('the-therapist', 'stonewalling', 'duty')]: 'Dana náleží vyslovená pauza, ne tichý, nevysvětlený ústup.',
  [reflectionKey('the-therapist', 'stonewalling', 'virtue')]: 'Tohle vyžadovalo pojmenovat obranný mechanismus, který obvykle funguje pod prahem vědomí.',
  [reflectionKey('the-therapist', 'stonewalling', 'care')]:
    'To vrácení se záleží Dana stejně jako to odejití — místnost trvá na obou polovinách té dovednosti.',
  [reflectionKey('the-therapist', 'accept-the-repair', 'consequence')]: 'Přijetí pokusu o nápravu zklidní bezprostřední konflikt v podstatě bez ceny.',
  [reflectionKey('the-therapist', 'accept-the-repair', 'duty')]: 'Dana riskoval něco malého a nedokonalého, aby se k vám natáhl — přijmout to ten risk ctí.',
  [reflectionKey('the-therapist', 'accept-the-repair', 'virtue')]: 'Tohle je těžší disciplína — nechat se zasáhnout, i uprostřed hádky.',
  [reflectionKey('the-therapist', 'accept-the-repair', 'care')]: 'Tohle dává úsilí Dana kam dopadnout, místo aby ho z principu nechalo propadnout.',
  [reflectionKey('the-therapist', 'miss-the-repair', 'consequence')]: 'Nevšimnutí si té nápravy udrží setrvačnost konfliktu, za cenu dostupného zklidnění.',
  [reflectionKey('the-therapist', 'miss-the-repair', 'duty')]:
    'Tohle konkrétně Dana nenáleží, ale přesto to odmítá něco, co Dana nabídl v dobré víře.',
  [reflectionKey('the-therapist', 'miss-the-repair', 'virtue')]: 'Všimněte si, co stojí zůstat uvnitř setrvačnosti té hádky, vás stejně jako Dana.',
  [reflectionKey('the-therapist', 'miss-the-repair', 'care')]: 'Malý, nervózní pokus Dana zůstane bez povšimnutí, a to má svou vlastní tichou cenu.',

  // ---------- The Usual Room (gate) ----------
  [reflectionKey('the-usual-room', 'defiant-different', 'consequence')]:
    'Vzít si jiný pokoj mění dnešní výsledek, aniž by to nutně měnilo ten základní vzorec, který kniha sledovala.',
  [reflectionKey('the-usual-room', 'defiant-different', 'duty')]: 'Tohle si nárokuje právo volby, které je skutečné, ať kniha o tom rozhodování předpověděla cokoli.',
  [reflectionKey('the-usual-room', 'defiant-different', 'virtue')]:
    'Tohle je ta těžší otázka, se kterou je potřeba vydržet — jestli je tenhle vzdor svoboda, nebo jen vzorec v přestrojení.',
  [reflectionKey('the-usual-room', 'defiant-different', 'care')]:
    'Tohle nemění to, co z tohohle vzorce zažívá kdokoli jiný ve vašem životě, jen dnešní pokoj.',
  [reflectionKey('the-usual-room', 'refuse-all-rooms', 'consequence')]:
    'Odhlášení se vyhne konkrétnímu pokoji, ale ne širší předpovědi knihy o vašem chování.',
  [reflectionKey('the-usual-room', 'refuse-all-rooms', 'duty')]: 'Tohle úplně odmítá účast, což je samo o sobě legitimní odpověď, byť neúplná.',
  [reflectionKey('the-usual-room', 'refuse-all-rooms', 'virtue')]:
    'Všimněte si, že i odmítnutí bylo svým způsobem předpokládané — stojí za to s tím vydržet, místo abyste to rychle vyřešili.',
  [reflectionKey('the-usual-room', 'refuse-all-rooms', 'care')]:
    'Tohle se nezabývá skutečnou otázkou, jestli se ten vzorec dá přepracovat, jen ji odkládá.',
  [reflectionKey('the-usual-room', 'take-it-knowingly', 'consequence')]:
    'Vědomá volba předpovězeného pokoje dnešní výsledek nemění, ale mění to, co ta volba znamená.',
  [reflectionKey('the-usual-room', 'take-it-knowingly', 'duty')]:
    'Tohle dělá z té volby doopravdy vaši volbu, místo abyste tu předpověď buď poslechli, nebo se jí jen vzepřeli.',
  [reflectionKey('the-usual-room', 'take-it-knowingly', 'virtue')]:
    'Tohle je těžší, tišší integrace — přijmout, že ten vzorec je skutečný, a přitom si pořád nárokovat autorství dnešní instance.',
  [reflectionKey('the-usual-room', 'take-it-knowingly', 'care')]:
    'Tohle je verze dnešního večera, která nepotřebuje žádné publikum, žádný vzdor předváděný pro nikoho jiného než pro vás samotné.',
  [reflectionKey('the-usual-room', 'room-with-no-number', 'consequence')]:
    'Volba pokoje bez čísla obchází ústřední zkoušku toho večera, místo aby ji jakkoli vyřešila.',
  [reflectionKey('the-usual-room', 'room-with-no-number', 'duty')]: 'Tohle je opravdová třetí možnost, i když ji kniha taky předpokládala.',
  [reflectionKey('the-usual-room', 'room-with-no-number', 'virtue')]:
    'Tohle je svým způsobem poctivý únik — odmítnutí předstírat jistotu, kterou doopravdy necítíte.',
  [reflectionKey('the-usual-room', 'room-with-no-number', 'care')]: 'Tohle nikomu jinému nic neřeší, ale taky to nikoho nic nestojí.',
});
