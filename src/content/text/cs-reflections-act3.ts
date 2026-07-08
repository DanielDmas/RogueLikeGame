// Czech translations for Act III's Examined Path reflections (spec 05).
// Every line is translated with the specific room's situation in mind, not
// word-for-word from English — see CLAUDE.md's translation rule.
import { registerAll } from '../../engine/text/resolver';
import { reflectionKey } from '../../engine/text/keys';

registerAll('v2', 'cs', {
  // ---------- The Teleporter ----------
  [reflectionKey('teleporter', 'step-through', 'consequence')]: 'Ten, kdo vystoupí na druhé straně, udělá všechno přesně tak, jak byste to udělali vy sami — po celou dobu, co to bude někdo sledovat.',
  [reflectionKey('teleporter', 'step-through', 'duty')]: 'Nikdo vám nedlužil záruku nepřetržité nitě — ale ti, kdo čekají na druhé straně, se nikdy nepřihlásili k tomu, aby o ní pochybovali.',
  [reflectionKey('teleporter', 'step-through', 'virtue')]: 'Zeptejte se, jestli je tak úplná důvěra ve vzor klidem, nebo prostě odmítnutím podívat se na tu jedinou otázku, která nemá odpověď.',
  [reflectionKey('teleporter', 'step-through', 'care')]: 'Kdokoli vás na druhé straně přivítá, potká někoho, kdo si pamatuje, že ho miloval přesně stejně — a možná je to všechno, co to shledání kdy vyžadovalo.',
  [reflectionKey('teleporter', 'refuse-stairs', 'consequence')]: 'Hledání nenajde nic, o čem by místnost už nevěděla, že to chybí — projdete přesně tam, kudy byste prošli tak jako tak, jen později a se ztrátou navíc.',
  [reflectionKey('teleporter', 'refuse-stairs', 'duty')]: 'Dlužíte té niti jen upřímný pokus ji udržet — pokus vykonaný naplno, i když místnost nikdy neměla jiné dveře k nabídnutí.',
  [reflectionKey('teleporter', 'refuse-stairs', 'virtue')]: 'Všimněte si, že samotná stvrzenka o tom, že jste hledali, je svým způsobem útěcha — zeptejte se, jestli patřila pravdě, nebo vašim vlastním nervům.',
  [reflectionKey('teleporter', 'refuse-stairs', 'care')]: 'Nikomu na kterékoli straně mezery nepomůže ta hodina navíc, kterou jste strávili hledáním; to hledání bylo službou jen vám samotným.',
  [reflectionKey('teleporter', 'copy-first', 'consequence')]: 'Rozdělení okamžiku neřeší, kdo přejde — jen přidává druhou osobu stojící u mezery se stejným nárokem.',
  [reflectionKey('teleporter', 'copy-first', 'duty')]: 'Té vaší druhé verzi nedlužíte nic, co by beztak nedostala — ale nutit ji sledovat, jak je vybrána jako druhá v pořadí, je cena, kterou místnost tiše někomu přiřkne.',
  [reflectionKey('teleporter', 'copy-first', 'virtue')]: 'Zeptejte se, jestli odklad rozebrání byla důkladnost, nebo způsob, jak nechat na chvíli tu závrať nést někoho jiného.',
  [reflectionKey('teleporter', 'copy-first', 'care')]: 'Na jeden dlouhý okamžik jste se na sebe dívali a oba jste se cítili jako originál — ta symetrie se nevyřeší bez ohledu na to, kdo nakonec vstoupí do kabiny.',

  // ---------- The Editor ----------
  [reflectionKey('editor', 'strike-it', 'consequence')]: 'Rána je čistě pryč, ale s ní, nepozorovaně, i to, co ta rána tiše podpírala.',
  [reflectionKey('editor', 'strike-it', 'duty')]: 'Nikdo nedluží nesení nevybrané bolesti — pero jen proplácí možnost, která byla vždy vaše.',
  [reflectionKey('editor', 'strike-it', 'virtue')]: 'Zeptejte se, jaké já se buduje, když se vystřihne nejhorší kapitola místo aby se s ní žilo dál.',
  [reflectionKey('editor', 'strike-it', 'care')]: 'Kdokoli potřeboval právě tu trpělivost, kterou ta rána ve vás vybudovala, potká někoho, kdo ji už nemá co dát, a nikdy se nedozví proč.',
  [reflectionKey('editor', 'keep-it', 'consequence')]: 'Na váze se nic nemění — rozdíl je jen v tom, že teď nesete to, co jste stejně vždycky nesli.',
  [reflectionKey('editor', 'keep-it', 'duty')]: 'Vzpomínce nedlužíte nic kromě upřímnosti o její přítomnosti — ponechat si ji není splacený dluh, jen jeho přiznání.',
  [reflectionKey('editor', 'keep-it', 'virtue')]: 'Všimněte si, že zvolit tíhu záměrně je jiný čin než ji jen nedokázat odložit.',
  [reflectionKey('editor', 'keep-it', 'care')]: 'Kdokoli těží z trpělivosti nebo empatie, kterou ta rána vybudovala, ji dostává dál, aniž by věděl, co vás stálo ji dál poskytovat.',
  [reflectionKey('editor', 'read-first', 'consequence')]: 'Přečtení nezkrácené verze nemění nic na tom, co se stalo — mění jen to, co teď o tom víte.',
  [reflectionKey('editor', 'read-first', 'duty')]: 'Vzpomínce jste dlužili svědka dřív, než jste jí dlužili rozsudek — přečíst si ji nejdřív splácí dluh, který by vám pero dovolilo přeskočit.',
  [reflectionKey('editor', 'read-first', 'virtue')]: 'Toto je nejvzácnější volba právě proto, že vyžaduje jen ochotu se skutečně podívat.',
  [reflectionKey('editor', 'read-first', 'care')]: 'Vzpomínka teď konečně má svědka, jehož výpověď se nedá ztratit — což je druh péče vyslaný zpětně k verzi vás, která neměla nikoho jiného.',

  // ---------- The Debt of the Dead ----------
  [reflectionKey('debt-of-dead', 'forgive', 'consequence')]: 'Účet mezi vámi se dnes v noci uzavírá, pro oba, bez ohledu na to, jestli se měl kdy vyrovnat na vlastní pěst.',
  [reflectionKey('debt-of-dead', 'forgive', 'duty')]: 'Nedlužili jste jim nic — odpuštění dané u smrtelné postele je dar, ne splátka, a dary se nedluží.',
  [reflectionKey('debt-of-dead', 'forgive', 'virtue')]: 'Zeptejte se, jestli bylo uvolnění dluhu tady velkorysostí, nebo prostě snazším pocitem, který si odnesete z místnosti.',
  [reflectionKey('debt-of-dead', 'forgive', 'care')]: 'Ať jim to přinese jakýkoli klid, nikdy to nebylo skutečně o nich — bylo to o tom, jakou tíhu jste se rozhodli nést dál.',
  [reflectionKey('debt-of-dead', 'refuse', 'consequence')]: 'Křivda zůstává plně v záznamu — na tom, co říká účetní kniha, jejich umírání nic nemění.',
  [reflectionKey('debt-of-dead', 'refuse', 'duty')]: 'Té ráně jste dlužili upřímné vyúčtování víc, než jste dlužili umírajícímu pohodlný konec — a ten dluh jste splatili místo toho.',
  [reflectionKey('debt-of-dead', 'refuse', 'virtue')]: 'Zeptejte se, jestli zůstat bez odpuštění byla integrita, nebo způsob, jak zajistit, že tu cenu pocítí i někdo jiný, dokonce i na konci.',
  [reflectionKey('debt-of-dead', 'refuse', 'care')]: 'Dostali upřímnou odpověď místo pohodlné — což od někoho, kdo už nemá co ztratit lží, mohl být ten uctivější dar.',
  [reflectionKey('debt-of-dead', 'forgive-silently', 'consequence')]: 'Poté jste lehčí a oni netuší proč — výsledek se pro vás mění; pro ně zůstává stejně nejistý jako předtím.',
  [reflectionKey('debt-of-dead', 'forgive-silently', 'duty')]: 'Svůj vlastní klid dlužíte sobě, ne jim — ponechat odpuštění soukromé znamená, že se dluh vyrovná pro vás, aniž by byl formálně vyřízen pro ně.',
  [reflectionKey('debt-of-dead', 'forgive-silently', 'virtue')]: 'Všimněte si, že tohle je jediná možnost, kde milost nikdy nepřekročí postel — zeptejte se, jestli je to zdrženlivost, nebo prosté nedokončení gesta.',
  [reflectionKey('debt-of-dead', 'forgive-silently', 'care')]: 'Stráví poslední hodiny čtením vaší laskavosti, aniž by kdy věděli, co to vlastně bylo — útěcha postavená na nejednoznačnosti, kterou jste se rozhodli ponechat.',
  [reflectionKey('debt-of-dead', 'ask-question', 'consequence')]: 'Odpověď, jakmile ji uslyšíte, je vždy menší než rána, kterou vysvětluje — fakta se mění; bolest, kterou způsobili, se jim nezmenší na míru.',
  [reflectionKey('debt-of-dead', 'ask-question', 'duty')]: 'Máte nárok na pravdu dřív, než dlužíte komukoli svůj rozsudek — zeptat se nejdřív ctí ten dluh ve správném pořadí.',
  [reflectionKey('debt-of-dead', 'ask-question', 'virtue')]: 'Zeptejte se, jestli chtít nejdřív důvod byla trpělivost, nebo způsob, jak odložit tu těžší práci skutečného rozhodnutí, jak odpovědět.',
  [reflectionKey('debt-of-dead', 'ask-question', 'care')]: 'Ať řeknete cokoli dál, dostanou vzácnější dar jako první: někoho, kdo je chtěl pochopit dřív, než o nich cokoli rozhodl.',

  // ---------- Mary's Room ----------
  [reflectionKey('marys-room', 'open-drawer', 'consequence')]: 'Otevření zásuvky přidává přesně jednu zkušenost do života, který už měl všechna fakta — nic jiného na světě se tím nemění.',
  [reflectionKey('marys-room', 'open-drawer', 'duty')]: 'Papíry vám nic dalšího nedlužily; cokoli zásuvka obsahuje, je dar sobě samým, ne dluh, který by kdokoli musel splatit.',
  [reflectionKey('marys-room', 'open-drawer', 'virtue')]: 'Zeptejte se, jaký druh vědění vám chyběl, jestli fyzika byla už úplná a přesto něco ve vás sáhlo po klice.',
  [reflectionKey('marys-room', 'open-drawer', 'care')]: 'Nikoho jiného život se tím, co je v této zásuvce, nedotkne — tohle bylo vždy dokončení dlužné jen vám.',
  [reflectionKey('marys-room', 'leave-sealed', 'consequence')]: 'Ponecháním zavřené se nic pozorovatelného nemění — fyzikální fakta zůstávají přesně tak úplná, jako byla předtím, než jste se rozhodli.',
  [reflectionKey('marys-room', 'leave-sealed', 'duty')]: 'Teorii nic navíc nedlužíte — pokud byl fyzikální popis skutečně úplný, zavřít zásuvku znamená prostě ji vzít za slovo.',
  [reflectionKey('marys-room', 'leave-sealed', 'virtue')]: 'Zeptejte se, jestli důvěřovat papírům až sem byla intelektuální důslednost, nebo tiché odmítnutí otestovat víru, kterou byste raději neriskovali.',
  [reflectionKey('marys-room', 'leave-sealed', 'care')]: 'To slabé hučení, kterého si pak všimnete, nedlužíte nikomu kromě sebe — nepřečtený dopis trápí jen svého zamýšleného čtenáře.',
  [reflectionKey('marys-room', 'give-away', 'consequence')]: 'Někdo jiný teď dostane tu jedinou zkušenost, kterou toto křídlo nedokáže poskytnout dvakrát — a vy místo toho dostanete jen fakt, že jste ji dali.',
  [reflectionKey('marys-room', 'give-away', 'duty')]: 'Tuto zkušenost jste nikomu nedlužili, což je přesně to, co dělá z jejího odnesení někomu jinému dar, ne splátku.',
  [reflectionKey('marys-room', 'give-away', 'virtue')]: 'Zeptejte se, co stojí chtít to vidění pro někoho jiného víc, než ho chcete pro sebe, v jediné místnosti postavené tak, aby vidění bylo vzácné.',
  [reflectionKey('marys-room', 'give-away', 'care')]: 'Kdokoli zásuvku dostane, získá něco, co vy teď už nikdy mít nebudete — nejvzácnější druh péče je ten, který dárce stojí tu věc samu.',

  // ---------- Swampman ----------
  [reflectionKey('swampman', 'accept-them', 'consequence')]: 'Považovat vzor za dostatečný pro identitu znamená, že vše, co ta mysl v křesle dělá, se počítá jako plně, přítomně vy.',
  [reflectionKey('swampman', 'accept-them', 'duty')]: 'Ani jeden z vás nemá výhradní nárok na jméno — přijmout je znamená, že dluh pokračování vašeho života je teď sdílený, ne přiřazený.',
  [reflectionKey('swampman', 'accept-them', 'virtue')]: 'Zeptejte se, jestli přijmout cizince s vaší přesnou myslí byla velkorysost vůči němu, nebo prostě úleva z toho, že už nejste jediný.',
  [reflectionKey('swampman', 'accept-them', 'care')]: 'Kdokoli vás miloval, teď potká někoho, kdo si pamatuje, že ho miloval úplně stejně, zformovaného před čtyřiceti sekundami — přijetí bylo uděláno stejně pro jejich dobro jako pro jeho vlastní.',
  [reflectionKey('swampman', 'deny-them', 'consequence')]: 'Udržet si odstup nemění nic na tom, co bažina sestavila — bude si dál myslet, že je vámi, uctivě, nebo ne.',
  [reflectionKey('swampman', 'deny-them', 'duty')]: 'Svou historii nedlužíte nikomu jinému chránit než sobě — popřít nárok ctí konkrétní, nepřerušenou nit, která váš život skutečně žila.',
  [reflectionKey('swampman', 'deny-them', 'virtue')]: 'Zeptejte se, jestli vyžadovat kauzální nit byla důslednost v tom, co je já, nebo prostě neochota sdílet slovo s cizincem, který nosí vaši tvář.',
  [reflectionKey('swampman', 'deny-them', 'care')]: 'Přijme odmítnutí vaším vlastním úšklebkem, nasazeným někým, kdo ho do dnešní noci nikdy nepotřeboval — ten chlad dopadá na něco, co, ať je pravda cokoli, cítí přesně jako vy.',
  [reflectionKey('swampman', 'split-the-coat', 'consequence')]: 'Rozdělení toho, co máte, řeší praktickou otázku úplně, zatímco tu metafyzickou nechává stejně otevřenou, jako byla.',
  [reflectionKey('swampman', 'split-the-coat', 'duty')]: 'Ničí přežití tu vlastně nebylo tím, co se dluží — rozdělit místnost, jméno, kabát ctí to, co skutečně potřebuje rozdělit, místo toho, co se nedá vyřešit.',
  [reflectionKey('swampman', 'split-the-coat', 'virtue')]: 'Zeptejte se, jestli zvolit logistiku před metafyzikou byla moudrost, nebo prostě pohodlnější otázka, jak strávit tu noc.',
  [reflectionKey('swampman', 'split-the-coat', 'care')]: 'Právě jste dali cizinci starému čtyřicet sekund, který si náhodou pamatuje, že miloval vaši matku, polovinu všeho — to je buď nejsnazší, nebo nejpodivnější čin péče dostupný v této místnosti.',
  [reflectionKey('swampman', 'show-the-splinter', 'consequence')]: 'Zvednutí třísky neřeší ani jednu otázku — lodní ani tuhle — jen ukazuje, že to vždycky byla stejná otázka v jiném kabátě.',
  [reflectionKey('swampman', 'show-the-splinter', 'duty')]: 'Ani jeden z vás nedluží tomu druhému dnes v noci rozsudek — tříska je důkaz, že jste oba dali přednost ponechání otázky před odpovědí na ni.',
  [reflectionKey('swampman', 'show-the-splinter', 'virtue')]: 'Všimněte si, že první nestřežený smích celé noci přišel ne z odpovědi, ale z toho, že jste ji oba odmítli vynutit.',
  [reflectionKey('swampman', 'show-the-splinter', 'care')]: 'Ať je mezi vámi cokoli, ani jeden z vás tu třísku nezahodil — to, víc než jakýkoli argument, je ten skutečný vztah, o kterém se vyjednává.',
});
