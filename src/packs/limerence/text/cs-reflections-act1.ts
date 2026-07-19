// Czech translations for LIMERENCE Act I's Examined Path reflections (spec
// 05). Every line is translated with the specific room's actual situation
// and the choice's real stakes in mind, not word-for-word from English —
// see CLAUDE.md's translation rule. The-front-desk (prologue) and
// the-summer-ends have no reflections field on any choice in the English
// source, so neither room appears here.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'cs', {
  // ---------- The Read Receipt ----------
  [reflectionKey('the-read-receipt', 'double-text', 'consequence')]:
    'Dvě další zprávy nezpůsobí, že odpověď přijde dřív — jen to ztíží čtení ticha, až konečně praskne.',
  [reflectionKey('the-read-receipt', 'double-text', 'duty')]: 'Dlužíte jí trpělivost, ne druhé předvolání.',
  [reflectionKey('the-read-receipt', 'double-text', 'virtue')]:
    'Všimněte si, jakého partnera z vás dělá panika, v jednu v noci, o samotě.',
  [reflectionKey('the-read-receipt', 'double-text', 'care')]:
    'Ona je dnes večer někde se svým vlastním důvodem — a ten s tou druhou zprávou taky nemá nic společného.',
  [reflectionKey('the-read-receipt', 'drawer', 'consequence')]:
    'Výsledek nikdy nebyl dnes večer ve vašich rukou; to, že jste s tím zůstali, na ránu nezměnilo nic — a na tu noc změnilo všechno.',
  [reflectionKey('the-read-receipt', 'drawer', 'duty')]: 'Nikomu jste nedlužili zprávu, kterou si ještě nezasloužil.',
  [reflectionKey('the-read-receipt', 'drawer', 'virtue')]:
    'Tohle je ta těžší, tišší disciplína — snést pocit, místo abyste ho vybili na někom jiném.',
  [reflectionKey('the-read-receipt', 'drawer', 'care')]:
    'Nechali jste jí obyčejný večer, aniž byste ji hlídali — a to je svým způsobem malý dárek.',
  [reflectionKey('the-read-receipt', 'bait', 'consequence')]:
    'Odpověď vynucená vykonstruovanou naléhavostí není důkazem ničeho jiného, než že naléhavost přiměje lidi odpovídat.',
  [reflectionKey('the-read-receipt', 'bait', 'duty')]: 'Vztah řízený zkouškami je vztah, ze kterého se poctivost potichu vytratila.',
  [reflectionKey('the-read-receipt', 'bait', 'virtue')]: 'Tohle je první malá zkouška člověka, který lidi řídí, místo aby jim věřil.',
  [reflectionKey('the-read-receipt', 'bait', 'care')]: 'Odpověděla na strach, ne na otázku, kterou jste jí doopravdy položili.',
  [reflectionKey('the-read-receipt', 'ask-tomorrow', 'consequence')]:
    'Jeden rozhovor vyřešil to, co tucet sledování tří teček nedokázal.',
  [reflectionKey('the-read-receipt', 'ask-tomorrow', 'duty')]: 'Přímá otázka respektuje vás oba víc než rozluštěné ticho.',
  [reflectionKey('the-read-receipt', 'ask-tomorrow', 'virtue')]:
    'Počkat na skutečnou odpověď, místo abyste si ji sami vyrobili, je svým způsobem odvaha.',
  [reflectionKey('the-read-receipt', 'ask-tomorrow', 'care')]:
    'Nechali jste ji vysvětlit se vlastními slovy, za denního světla, bez léčky.',

  // ---------- The Screenshot ----------
  [reflectionKey('the-screenshot', 'tell-nadia', 'consequence')]:
    'Nadia má teď informaci, kterou potřebuje, aby mohla jednat — ať už pravda způsobí jakoukoli škodu, ta by dřív nebo později dopadla stejně; vy jste jen zvolili kdy.',
  [reflectionKey('the-screenshot', 'tell-nadia', 'duty')]: 'Tohle jí náleželo, prostě a bez hlasování.',
  [reflectionKey('the-screenshot', 'tell-nadia', 'virtue')]:
    'Tohle je ta těžší věrnost — vůči tomu, komu se lže, ne vůči tomu, koho znáte déle.',
  [reflectionKey('the-screenshot', 'tell-nadia', 'care')]:
    'Postavili jste do středu tu, které se to doopravdy děje, ne dvě přátelství, která to přežijí hůř.',
  [reflectionKey('the-screenshot', 'confront-tom', 'consequence')]:
    'To, že dáte volbu nejdřív Tomovi, změní jen to, kdo jí to řekne — ne to, jestli se to Nadia nakonec dozví.',
  [reflectionKey('the-screenshot', 'confront-tom', 'duty')]:
    'Dali jste kamarádovi šanci napravit to sám, než jste mu to rozhodnutí vzali z rukou.',
  [reflectionKey('the-screenshot', 'confront-tom', 'virtue')]:
    'Ultimátum má integritu jen tehdy, pokud byste ho doopravdy dodrželi — zeptejte se sami sebe, upřímně, jestli byste to udělali.',
  [reflectionKey('the-screenshot', 'confront-tom', 'care')]:
    'Snažili jste se ochránit dva vztahy najednou, a ta snaha vás stojí těžší rozhovor.',
  [reflectionKey('the-screenshot', 'stay-out', 'consequence')]:
    'Zůstat mimo vás z výsledku nevynímá; jen vás to zbaví možnosti ten výsledek ovlivnit.',
  [reflectionKey('the-screenshot', 'stay-out', 'duty')]:
    'Mlčení je tady taky volba s adresátem — Nadia jen neví, že ji za ni někdo udělal.',
  [reflectionKey('the-screenshot', 'stay-out', 'virtue')]:
    'Zeptejte se, jakým přítelem vás dělá „není to moje věc“ vůči té, která je doopravdy klamána.',
  [reflectionKey('the-screenshot', 'stay-out', 'care')]:
    'Ušetřili jste si těžký rozhovor za cenu toho, který si někdo jiný zasloužil mít.',
  [reflectionKey('the-screenshot', 'verify-first', 'consequence')]:
    'Ověřování snížilo riziko, že budete jednat na základě něčeho falešného, za reálnou cenu toho, že jste jednali později, než jste mohli.',
  [reflectionKey('the-screenshot', 'verify-first', 'duty')]:
    'Pečlivost je ctnost, ale žádná, která by omlouvala zpoždění vůči té, co pořád nic netuší.',
  [reflectionKey('the-screenshot', 'verify-first', 'virtue')]:
    'Opatrnost může být svým způsobem druh vyhýbání, jen převlečený za zodpovědnost.',
  [reflectionKey('the-screenshot', 'verify-first', 'care')]:
    'Ta hodina navíc Nadiu nestála nic, co by už dřív nevěděla — ale stála vás možnost rozhodnout, jak se to dozví.',

  // ---------- The Password ----------
  [reflectionKey('the-password', 'give-it', 'consequence')]:
    'Bezprostřední výsledek — klidnější týden — je skutečný; ten dlouhodobější, zvyk sebecenzury, je skutečný taky, a místnost vám ukáže oba.',
  [reflectionKey('the-password', 'give-it', 'duty')]:
    'S klíčem daným ze strachu, ne ze svobody, nikdy doopravdy nesouhlasila ta část vás, která váhala.',
  [reflectionKey('the-password', 'give-it', 'virtue')]:
    'Všimněte si, kým se stáváte, když každou zprávu píšete s tichým čtenářem na mysli.',
  [reflectionKey('the-password', 'give-it', 'care')]:
    'Uzavřeli jste vzdálenost, o kterou žádala, ale způsob, jakým jste to udělali, na jejím místě postavil jinou.',
  [reflectionKey('the-password', 'refuse-flat', 'consequence')]:
    'Udržená hranice stojí něco teď a zabrání něčemu horšímu později — místnost oceňuje obojí poctivě.',
  [reflectionKey('the-password', 'refuse-flat', 'duty')]: 'Dlužili jste jí péči, ne přístup.',
  [reflectionKey('the-password', 'refuse-flat', 'virtue')]:
    'Tohle je ta těžší, méně pohodlná integrita — ta, co riskuje vztah, aby si udržela sama sebe.',
  [reflectionKey('the-password', 'refuse-flat', 'care')]:
    'Rovné ne, řečené bez pohrdání, pořád nechává prostor na to, aby se s jejím strachem naložilo nějak jinak.',
  [reflectionKey('the-password', 'transparency-not-surveillance', 'consequence')]:
    'Poctivě odpovědět na jakoukoli otázku přinese stejné ujištění jako heslo — bez trvalé ceny navíc.',
  [reflectionKey('the-password', 'transparency-not-surveillance', 'duty')]:
    'Nabídli jste přesně to, co jste dlužili: otevřenost. Ne přesně to, o co bylo žádáno: přístup.',
  [reflectionKey('the-password', 'transparency-not-surveillance', 'virtue')]:
    'Tohle je ta klidnější, méně dramatická podoba důvěryhodnosti — dostupná, ne hlídaná.',
  [reflectionKey('the-password', 'transparency-not-surveillance', 'care')]:
    'Na její strach jste odpověděli svou přítomností, ne svým soukromím.',
  [reflectionKey('the-password', 'demand-hers', 'consequence')]:
    'Symetrie cenu dohledu nezruší; jen ji rozloží na vás oba.',
  [reflectionKey('the-password', 'demand-hers', 'duty')]: 'Opětovat špatný požadavek není totéž jako ho odmítnout.',
  [reflectionKey('the-password', 'demand-hers', 'virtue')]:
    'Zeptejte se, jaký vztah z tohohle vznikne, když oba zámky spadnou naráz, ze vzdoru převlečeného za spravedlnost.',
  [reflectionKey('the-password', 'demand-hers', 'care')]:
    'Ani jednoho z vás to doopravdy neuklidní — jen jste ten strach udělali vzájemným.',

  // ---------- The Party ----------
  [reflectionKey('the-party', 'play-and-bury', 'consequence')]:
    'Dnes večer navenek nic nezmění, ale šance, že to zůstane zahrabané, nikdy nebyla úplně ve vašich rukou.',
  [reflectionKey('the-party', 'play-and-bury', 'duty')]:
    'Tajemství skryté před Sárou je pořád rozhodnutí, které se týká jí, ale bez ní.',
  [reflectionKey('the-party', 'play-and-bury', 'virtue')]:
    'Všimněte si věty, kterou si právě teď nacvičujete — „nepočítalo se to“ — a jakého člověka ta věta dokáže přesvědčit.',
  [reflectionKey('the-party', 'play-and-bury', 'care')]:
    'Dnes večer jste chránili svoje vlastní pohodlí za cenu, která, pokud vyplave na povrch, dopadne celá na ni.',
  [reflectionKey('the-party', 'play-and-tell', 'consequence')]:
    'Přiznání ten polibek nevymaže, ale mění to, co musí zpracovat — jen tu událost, ne ještě navrch zradu skrytého tajemství.',
  [reflectionKey('the-party', 'play-and-tell', 'duty')]:
    'Dlužili jste jí pravdu, a doručili jste ji dřív, než z vás musela být vymáčknuta.',
  [reflectionKey('the-party', 'play-and-tell', 'virtue')]:
    'Tohle je nákladná upřímnost, zvolená v době, kdy jste se jí ještě mohli vyhnout.',
  [reflectionKey('the-party', 'play-and-tell', 'care')]:
    'Dali jste jí důstojnost slyšet to od vás, ne ze screenshotu o pár týdnů později.',
  [reflectionKey('the-party', 'refuse', 'consequence')]:
    'Odmítnutí vás dnes stojí trochu společenský kredit a zítra vás nestojí vůbec nic.',
  [reflectionKey('the-party', 'refuse', 'duty')]:
    'Dodrželi jste slib, o který nikdo výslovně nežádal, ale zjevně jste ho dlužili.',
  [reflectionKey('the-party', 'refuse', 'virtue')]:
    'Tohle je charakter, který se ukáže přesně ve chvíli, kdy je to nejméně pohodlné a kdy to nejméně vidí ten, pro koho to je.',
  [reflectionKey('the-party', 'refuse', 'care')]:
    'Klářino pohodlí tu vlastně nikdy v sázce nebylo — ale Sářina důvěra, i v nepřítomnosti, ano.',
  [reflectionKey('the-party', 'leave', 'consequence')]:
    'Odchod naráz a čistě smaže všechny možné výsledky té výzvy, dřív než by kterýkoli z nich mohl nastat.',
  [reflectionKey('the-party', 'leave', 'duty')]:
    'Nedlužili jste žádné vysvětlení za to, že jste odmítli být v místnosti postavené přesně na tuhle zkoušku.',
  [reflectionKey('the-party', 'leave', 'virtue')]:
    'Někdy je poctivější tah nevěřit sami sobě, že tu volbu ustojíte, a raději do ní vůbec nejít.',
  [reflectionKey('the-party', 'leave', 'care')]:
    'Ušetřili jste všem — Kláře, Sáře, sobě — scénu, která nemusela vůbec existovat.',

  // ---------- The Forward ----------
  [reflectionKey('the-forward', 'delete-only', 'consequence')]:
    'Smazání vaší vlastní kopie nezmění nic na dalších třiceti devíti kopiích, které pořád kolují.',
  [reflectionKey('the-forward', 'delete-only', 'duty')]:
    'Mlčení vás zbaví vlastní účasti, ale ne vědomí o tom, co se jí pořád děje.',
  [reflectionKey('the-forward', 'delete-only', 'virtue')]:
    'Zeptejte se, jakým přihlížejícím vás doopravdy dělá „aspoň jsem to nepřeposlal“.',
  [reflectionKey('the-forward', 'delete-only', 'care')]:
    'Ema se to stejně dozví od někoho jiného, bez varování, aniž byste udělali tu jednu věc, která by pomohla.',
  [reflectionKey('the-forward', 'report', 'consequence')]:
    'Nahlášení je jediná cesta se skutečnou šancí zastavit další šíření, za reálnou osobní cenu pro vás.',
  [reflectionKey('the-forward', 'report', 'duty')]: 'Tohle je přesně ten druh jednání, kvůli kterému tu jsou zákon i škola.',
  [reflectionKey('the-forward', 'report', 'virtue')]:
    'Tohle je ta neokázalá, nepopulární podoba odvahy — ta, za kterou vás týden pomlouvají.',
  [reflectionKey('the-forward', 'report', 'care')]:
    'Je to ta verze pomoci, která doopravdy dosáhne k Emě, ne jen ta, po které se vy cítíte čistě.',
  [reflectionKey('the-forward', 'tell-ema-first', 'consequence')]:
    'Varování jako první mění to, čemu čelí — jde do toho informovaná, ne přepadená vlastní chodbou.',
  [reflectionKey('the-forward', 'tell-ema-first', 'duty')]:
    'Dlužili jste jí pravdu dřív, než dav získal náskok před její vlastní reakcí.',
  [reflectionKey('the-forward', 'tell-ema-first', 'virtue')]:
    'Tohle je volba, která vás v této místnosti stojí nejvíc a nežádá za to nic zpátky.',
  [reflectionKey('the-forward', 'tell-ema-first', 'care')]:
    'Ze všeho, co je dnes večer na výběr, je tohle verze postavená celá kolem toho, co potřebuje ona, ne kolem toho, co je nejsnazší pro vás.',
  [reflectionKey('the-forward', 'confront-publicly', 'consequence')]:
    'Veřejná konfrontace možná zpomalí šíření, ale zároveň znásobí pozornost přesně na to, čemu se snažíte zabránit.',
  [reflectionKey('the-forward', 'confront-publicly', 'duty')]:
    'Pojmenovat provinění je to, co si ta situace žádala — ale na metodě záleží stejně jako na úmyslu.',
  [reflectionKey('the-forward', 'confront-publicly', 'virtue')]:
    'Tohle je spravedlivý hněv, který něco dělá — a to automaticky neznamená, že dělá tu správnou věc.',
  [reflectionKey('the-forward', 'confront-publicly', 'care')]:
    'Nejzranitelnější osoba v tomhle příběhu nemá slovo v tom, jak veřejně se s její situací naloží.',

  // ---------- The Best Friend's Girl ----------
  [reflectionKey('the-best-friends-girl', 'confess-to-her', 'consequence')]:
    'Říct jí to riskuje přátelství i vztah kvůli informaci, kterou jste striktně vzato ani nepotřebovali mít.',
  [reflectionKey('the-best-friends-girl', 'confess-to-her', 'duty')]:
    'Měla právo vědět, co se děje v místnosti, ve které sedí.',
  [reflectionKey('the-best-friends-girl', 'confess-to-her', 'virtue')]:
    'Tohle je upřímnost, která slouží vaší vlastní jasnosti stejně jako jí — stojí za to všimnout si, s čím jste šli první.',
  [reflectionKey('the-best-friends-girl', 'confess-to-her', 'care')]:
    'Zvažte, co to přiznání doopravdy stojí Nadiu, oproti tomu, co uleví vám.',
  [reflectionKey('the-best-friends-girl', 'starve-it', 'consequence')]:
    'Odstup nevyřeší nic pro nikoho jiného, ale spolehlivě, nakonec, vyřeší ten stav ve vás.',
  [reflectionKey('the-best-friends-girl', 'starve-it', 'duty')]:
    'Nikomu nedlužíte přiznání citu, podle kterého jste nikdy nejednali.',
  [reflectionKey('the-best-friends-girl', 'starve-it', 'virtue')]:
    'Tohle je tiché sebeřízení — neokázalé, bez svědků, a funguje to.',
  [reflectionKey('the-best-friends-girl', 'starve-it', 'care')]:
    'Nikdo jiný v místnosti nikdy nemusí nést váhu citu, který nikdy nebyl jeho, aby ho nesl.',
  [reflectionKey('the-best-friends-girl', 'tell-tom', 'consequence')]:
    'Říct to Tomovi, místo abyste podle toho jednali nebo to řekli Nadie, udrží tu škodu v jediném vztahu, který je stavěný ji unést.',
  [reflectionKey('the-best-friends-girl', 'tell-tom', 'duty')]:
    'Tohle je věrnost, kvůli které přátelství vůbec existuje — nepříjemné přiznání, nabídnuté, ne odhalené.',
  [reflectionKey('the-best-friends-girl', 'tell-tom', 'virtue')]:
    'Tohle si žádalo víc nervů než mlčení nebo přiznání Nadie — stojí za to si toho o sobě všimnout.',
  [reflectionKey('the-best-friends-girl', 'tell-tom', 'care')]:
    'Ochránili jste Nadiu před citem, který nikdy nebyl o ničem, co udělala, tím, že jste ho nasměrovali k jedinému člověku, který ho dokáže unést.',
  [reflectionKey('the-best-friends-girl', 'test-the-evening', 'consequence')]:
    'Vyrobená zkouška neposkytne skutečnou informaci — vyrobí novou, hůř čitelnou situaci pro všechny zúčastněné.',
  [reflectionKey('the-best-friends-girl', 'test-the-evening', 'duty')]:
    'Tohle riskovalo Tomův a Nadin vztah kvůli vaší vlastní nejistotě, bez jejich vědomí či souhlasu.',
  [reflectionKey('the-best-friends-girl', 'test-the-evening', 'virtue')]:
    'Tohle je verze vás, která lidi řídí, místo aby jim věřila nebo je nechala na pokoji.',
  [reflectionKey('the-best-friends-girl', 'test-the-evening', 'care')]:
    'Nadia se tady stává nástrojem vaší zvědavosti, a to jí není málo, co jste jí udělali.',

  // ---------- The Rumor ----------
  [reflectionKey('the-rumor', 'trust-without-asking', 'consequence')]:
    'Zcela se vzdáte jistoty; ať se u jezera stalo cokoli doopravdy, nezmění to nic na tom, jak se rozhodnete se k ní chovat.',
  [reflectionKey('the-rumor', 'trust-without-asking', 'duty')]:
    'Dlužíte jí presumpci neviny, kterou samotná fáma nikdy nedokáže zvrátit.',
  [reflectionKey('the-rumor', 'trust-without-asking', 'virtue')]:
    'Tohle je důvěra jako pěstovaná disciplína, ne pohodlný pocit — ta těžší verze té ctnosti.',
  [reflectionKey('the-rumor', 'trust-without-asking', 'care')]:
    'Ušetřili jste ji výslechu, který si možná nezasloužila, za cenu pochybnosti, kterou teď nesete sami, bez konce.',
  [reflectionKey('the-rumor', 'ask-her-plainly', 'consequence')]:
    'Vyměnili jste paralýzu nevědění za odpověď, kterou nemůžete nezávisle ověřit — reálnou, ohraničenou směnu.',
  [reflectionKey('the-rumor', 'ask-her-plainly', 'duty')]:
    'Dlužili jste jí přímou otázku dřív než cokoli jiného — ne past, ne zeď mlčení, otázku.',
  [reflectionKey('the-rumor', 'ask-her-plainly', 'virtue')]:
    'Zeptat se na rovinu, jednou, a pak doopravdy naslouchat, je těžší, než to zní, a vzácnější, než by mělo být.',
  [reflectionKey('the-rumor', 'ask-her-plainly', 'care')]:
    'Teď ví, že se k vám ta fáma dostala a hodiny tam jen seděla, než jste promluvili — i to je něco, co musí unést.',
  [reflectionKey('the-rumor', 'interrogate', 'consequence')]:
    'Získali jste informaci za pevnou, reálnou cenu důvěry ve vztahu — místnost tuhle směnu oceňuje bez příkras.',
  [reflectionKey('the-rumor', 'interrogate', 'duty')]:
    'Výslech zachází s obviněnou jako s vinnou, dokud se neprokáže opak — a to jí nenáleželo.',
  [reflectionKey('the-rumor', 'interrogate', 'virtue')]:
    'Všimněte si, jakého partnera z vás na jeden večer dokázala udělat obyčejná fáma.',
  [reflectionKey('the-rumor', 'interrogate', 'care')]:
    'Ty otázky na ni dopadnou jako obvinění bez ohledu na váš úmysl, a i to musí unést.',
  [reflectionKey('the-rumor', 'set-the-trap', 'consequence')]:
    'Past možná přinese pravdivou odpověď, ale udělá to tak, že si sama vyrobí tu zkoušku, o které pak tvrdí, že ji jen pozoruje.',
  [reflectionKey('the-rumor', 'set-the-trap', 'duty')]:
    'Klam, i ve službách spravedlivé otázky, není spravedlivá metoda — dlužili jste jí přímou otázku, ne léčku.',
  [reflectionKey('the-rumor', 'set-the-trap', 'virtue')]:
    'Tohle je nejostřejší zrcadlo téhle místnosti: past vám řekne přesně tolik o vás jako o ní.',
  [reflectionKey('the-rumor', 'set-the-trap', 'care')]:
    'Ať už o ní odhalí cokoli, s jistotou odhalí, že jste byli ochotní kvůli tomu podvést někoho, koho milujete.',
  [reflectionKey('the-rumor', 'ask-the-accuser', 'consequence')]:
    'Vystopování fámy k jejímu zdroji vyřeší samotné tvrzení, aniž by to Sáru stálo jediný okamžik podezření.',
  [reflectionKey('the-rumor', 'ask-the-accuser', 'duty')]:
    'Tohle nasměruje pozornost na toho, kdo obvinění doopravdy vznesl — a tam patřila od začátku.',
  [reflectionKey('the-rumor', 'ask-the-accuser', 'virtue')]:
    'Tohle je intelektuální odvaha uplatněná tam, kde je nejméně pohodlná — směrem k autorovi příběhu, ne k jeho subjektu.',
  [reflectionKey('the-rumor', 'ask-the-accuser', 'care')]:
    'Sára se nikdy nemusí dozvědět, že vůbec byla pod podezřením — ta pochybnost se vyřeší, aniž by se jí kdy dotkla.',
});
