// Czech translations for LIMERENCE Understory's Examined Path reflections
// (spec 05). Every line is translated with the specific room's actual
// situation and the choice's real stakes in mind, not word-for-word from
// English — see CLAUDE.md's translation rule. Only two of the Understory's
// three rooms carry any `reflections` field in the English source:
// the-doors-not-opened (all three choices) and the-other-side (three of its
// four choices — hand-the-sim has none). The-registry has no `reflections`
// field on any of its four choices in the English source and is correctly
// absent from this file.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'cs', {
  // ---------- The Doors Not Opened ----------
  [reflectionKey('the-doors-not-opened', 'enter-late', 'consequence')]:
    'Ať tam čekalo cokoli, už se to stalo, nebo nestalo — vejít teď dovnitř nic nemění na tom, co bylo možné tehdy.',
  [reflectionKey('the-doors-not-opened', 'enter-late', 'duty')]:
    'Té staré možnosti nedlužíte nic kromě upřímnosti konečně se podívat — pozdní vstup vyrovnává soukromou zvědavost, ne dluh, který by někomu náležel.',
  [reflectionKey('the-doors-not-opened', 'enter-late', 'virtue')]:
    'Zeptejte se, jestli je vstoupit teď, když už vás to nemůže nic stát, skutečná uctěná zvědavost, nebo bezpečná zkouška odvahy nanečisto.',
  [reflectionKey('the-doors-not-opened', 'enter-late', 'care')]:
    'V týhle místnosti na vás nikdy nikdo nečekal — jediný člověk, pro kterého je tahle pozdní návštěva, je ten, kdo stojí ve dveřích.',
  [reflectionKey('the-doors-not-opened', 'close-it', 'consequence')]:
    'Zavřít je nic nemění na tom, co bylo uvnitř — dveře se prostě vrátí k tomu, čím byly, než jste si jich všimli.',
  [reflectionKey('the-doors-not-opened', 'close-it', 'duty')]:
    'Některým dveřím nedlužíte nic víc než respekt nechat je zavřené — ne každá možnost má nárok na druhý pohled jen proto, že je konečně nabídnutá.',
  [reflectionKey('the-doors-not-opened', 'close-it', 'virtue')]:
    'Zeptejte se, jestli bylo jejich zavření moudrost o tom, které dveře nikdy nebyly vaše, nebo tišší vyhýbání se, přestrojené za zdrženlivost.',
  [reflectionKey('the-doors-not-opened', 'close-it', 'care')]:
    'Nikdo za těmi dveřmi nepotřeboval, abyste je otevřeli — necháváte je přesně tak nedotčené, jak jste je našli.',
  [reflectionKey('the-doors-not-opened', 'ask-why-now', 'consequence')]:
    'Naolejované panty vám říkají, že ty dveře byly připravené přesně na dnešní noc — ale vědět to nic nemění na tom, jestli jimi projdete.',
  [reflectionKey('the-doors-not-opened', 'ask-why-now', 'duty')]:
    'Té nabídce samotné dlužíte upřímnou otázku dřív, než jí dlužíte odpověď — zeptat se proč zrovna teď je svým vlastním druhem svědomitosti.',
  [reflectionKey('the-doors-not-opened', 'ask-why-now', 'virtue')]:
    'Zeptejte se, jestli je vyslýchat ty dveře, místo abyste je prostě použili, důslednost, nebo způsob, jak oddálit tu těžší volbu.',
  [reflectionKey('the-doors-not-opened', 'ask-why-now', 'care')]:
    'Panty byly naolejované jen pro vás — ať už to načasování znamená cokoli, tahle pozornost nikdy nebyla určená nikomu jinému.',

  // ---------- The Other Side ----------
  [reflectionKey('the-other-side', 'answer-yourself', 'consequence')]:
    'Promluvit zpátky nic nemění na tom, co už bylo řečeno — mění to jen to, jestli to bylo slyšeno.',
  [reflectionKey('the-other-side', 'answer-yourself', 'duty')]:
    'Svému dřívějšímu já dlužíte uznání, ne opravu — pozdravit ho je dluh uznání, ne souhlasu.',
  [reflectionKey('the-other-side', 'answer-yourself', 'virtue')]:
    'Zeptejte se, jestli je oslovit ten hlas, místo abyste ho jen mlčky sledovali, odvaha, nebo starý zvyk potřebovat mít poslední slovo.',
  [reflectionKey('the-other-side', 'answer-yourself', 'care')]:
    'Místnost se usadí jako zadržovaný dech vypuštěný dvěma lidmi místo jednoho — malé milosrdenství, prokázané tomu, kým jste kdysi bývali.',
  [reflectionKey('the-other-side', 'let-yourself-finish', 'consequence')]:
    'Nechat ho domluvit bez přerušení nic nemění na tom, co říká — jen na tom, jestli tentokrát smí říct úplně všechno.',
  [reflectionKey('the-other-side', 'let-yourself-finish', 'duty')]:
    'Svému dřívějšímu já dlužíte vyslechnutí, které jste mu možná napoprvé nedali — ticho tady splácí dluh pozornosti, ne souhlasu.',
  [reflectionKey('the-other-side', 'let-yourself-finish', 'virtue')]:
    'Zeptejte se, jestli je zůstat zticha trpělivost, nebo jestli je to prostě jednodušší, než zjistit, co byste na to odpověděli.',
  [reflectionKey('the-other-side', 'let-yourself-finish', 'care')]:
    'To ticho je to nejúplnější, co bylo v místnosti řečeno — forma péče, která po tom hlasu nechce nic jiného, než aby domluvil.',
  [reflectionKey('the-other-side', 'sit-in-both-chairs', 'consequence')]:
    'Posadit se na obě židle nic nemění na tom, která verze vás teď mluví — jen to odstraní předstírání, že tu kdy byli dva.',
  [reflectionKey('the-other-side', 'sit-in-both-chairs', 'duty')]:
    'Žádnému návštěvníkovi nedlužíte publikum, protože přiznat, že tu žádný nikdy nebyl, ruší samotnou myšlenku dluhu mezi hostitelem a hostem.',
  [reflectionKey('the-other-side', 'sit-in-both-chairs', 'virtue')]:
    'Zeptejte se, jestli je tohle ta nejnákladnější upřímnost v místnosti, nebo chytrý způsob, jak se vyhnout tomu, doopravdy tomu hlasu odpovědět.',
  [reflectionKey('the-other-side', 'sit-in-both-chairs', 'care')]:
    'Nikdy tu nebyl žádný host, o kterého by bylo potřeba pečovat — jen řada vašich verzí, a ta péče vždycky, potichu, mířila k vám samotným.',
});
