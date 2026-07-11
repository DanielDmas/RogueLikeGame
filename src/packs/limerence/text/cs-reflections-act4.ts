// Czech translations for LIMERENCE Act IV's Examined Path reflections (spec
// 05). Every line is translated with the specific room's actual situation
// and the choice's real stakes in mind, not word-for-word from English —
// see CLAUDE.md's translation rule. Only two of Act IV's three rooms carry
// any `reflections` field in the English source: the-kitchen-table (four of
// its five choices; place-the-unsent-letter has none) and the-morning-desk
// (three choices, stage 0 only — none of stage 1's checkout choices carry
// reflections). The-unsent has no `reflections` field on any of its six
// choices in the English source and is correctly absent from this file.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'cs', {
  // ---------- The Kitchen Table ----------
  [reflectionKey('the-kitchen-table', 'stay-for-them', 'consequence')]:
    'Zůstat dnes zachová domácnost, za cenu, která záleží úplně na tom, jestli se ten pakt bude opatrovat, nebo odloží k ledu.',
  [reflectionKey('the-kitchen-table', 'stay-for-them', 'duty')]:
    'Tohle ctí závazek vůči dětem, i když to samo o sobě neřeší, co dlužíte jeden druhému.',
  [reflectionKey('the-kitchen-table', 'stay-for-them', 'virtue')]:
    'Tohle je volba, jejíž povaha závisí na údržbě — může být lešením i odkladem, a řeknou to až pozdější rána.',
  [reflectionKey('the-kitchen-table', 'stay-for-them', 'care')]:
    'Děti dnes ráno dostávají stabilní domov — jestli jím zůstane, je samostatná, trvající otázka.',
  [reflectionKey('the-kitchen-table', 'separate-well', 'consequence')]:
    'Dobře provedené rozdělení vymění vztah za výsledek s nižším konfliktem, o kterém výzkum tvrdí, že děti doopravdy chrání.',
  [reflectionKey('the-kitchen-table', 'separate-well', 'duty')]:
    'Tohle upřednostňuje to, co dětem doopravdy náleží — dobře zvládnutý rozchod — před zdáním neporušené rodiny.',
  [reflectionKey('the-kitchen-table', 'separate-well', 'virtue')]:
    'Tohle je zármutek zvládnutý se skutečnou disciplínou, zvolený místo tichého odporu i místo veřejného konfliktu.',
  [reflectionKey('the-kitchen-table', 'separate-well', 'care')]:
    'Tohle je postavené schválně kolem toho, co si děti doopravdy ponesou dál, ne kolem pohodlí jednoho nebo druhého rodiče.',
  [reflectionKey('the-kitchen-table', 'attempt-repair', 'consequence')]:
    'Pokus o nápravu riskuje skutečné úsilí proti nejistému výsledku, výměnou za šanci na něco lepšího, než je zůstat beze změny, nebo odejít.',
  [reflectionKey('the-kitchen-table', 'attempt-repair', 'duty')]:
    'Tohle ctí původní závazek vztahu tím, že doopravdy otestuje, jestli se dá dodržet, místo aby to jen předem předpokládalo, ať tak, nebo onak.',
  [reflectionKey('the-kitchen-table', 'attempt-repair', 'virtue')]:
    'Tohle je vytrvalá, nevděčná disciplína — přijít i na druhé sezení, což je ta skutečná zkouška.',
  [reflectionKey('the-kitchen-table', 'attempt-repair', 'care')]:
    'Tohle zachází s tím, co se stalo, jako s poplašným signálem, který stojí za pochopení, ne jen jako se zločinem, který si žádá trest — těžší, užitečnější rámec pro vás pro oba.',
  [reflectionKey('the-kitchen-table', 'say-the-unsayable', 'consequence')]:
    'Vyslovit nevyslovitelné nevyřeší praktické otázky tohohle rána, ale mění to, co bude každá pozdější odpověď doopravdy znamenat.',
  [reflectionKey('the-kitchen-table', 'say-the-unsayable', 'duty')]:
    'Tahle věta vám oběma náležela dávno před tímhle ránem — to, že přišla pozdě, ten dluh neruší.',
  [reflectionKey('the-kitchen-table', 'say-the-unsayable', 'virtue')]:
    'Tohle je ta jediná nejobnaženější upřímnost, jaká je v téhle místnosti k mání, nabídnutá, aniž byste věděli, co bude stát.',
  [reflectionKey('the-kitchen-table', 'say-the-unsayable', 'care')]:
    'Tohle zachází s tím druhým jako s někým, komu náleží ta nejhlubší dostupná pravda, ne její zvládnutá, upravená verze.',

  // ---------- The Morning Desk ----------
  [reflectionKey('the-morning-desk', 'stand-by-all', 'consequence')]:
    'Stát si za každou volbou nemění nic na tom, co se už stalo — jen to, co jste teď ochotní si o tom nahlas říct.',
  [reflectionKey('the-morning-desk', 'stand-by-all', 'duty')]:
    'Vlastnímu záznamu dlužíte upřímný podpis, ať vás to stálo cokoli — a právě jste ho dali, celý.',
  [reflectionKey('the-morning-desk', 'stand-by-all', 'virtue')]:
    'Zeptejte se, jestli je celá podepsaná účetní kniha integrita, nebo brnění nošené tak dlouho, že se přestalo cítit jako volba.',
  [reflectionKey('the-morning-desk', 'stand-by-all', 'care')]:
    'Vrátný to poznamenává bez krutosti — ať už to bylo pro kohokoli, ten podpis byl na vás, dát ho, nebo ne, a vy jste ho dali celý.',
  [reflectionKey('the-morning-desk', 'name-what-changed-me', 'consequence')]:
    'Pojmenovat, co vás změnilo, nezruší tu dřívější volbu — přidá to k ní poctivý druhý záznam, vedle prvního.',
  [reflectionKey('the-morning-desk', 'name-what-changed-me', 'duty')]:
    'Pultu, i sami sobě, dlužíte tu účtenku stejně jako tu revizi — pojmenovat místnost, která vás změnila, je ta těžší polovina.',
  [reflectionKey('the-morning-desk', 'name-what-changed-me', 'virtue')]:
    'Zeptejte se, jestli je revidovat tady ten záznam růst, nebo pohodlný způsob, jak se zříct toho, kým jste byli, než jste to věděli líp.',
  [reflectionKey('the-morning-desk', 'name-what-changed-me', 'care')]:
    'Pult zachází s já, které si dokáže rozmyslet názor, jako s živějším než to, které nedokáže — a tuhle laskavost potichu rozšiřuje i na to, kým jste bývali dřív.',
  [reflectionKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 'consequence')]:
    'Přiznat tu mezeru ji nevyplní — volby v ní učiněné zůstávají stejně nedosvědčené, jako byly předtím, než jste to řekli.',
  [reflectionKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 'duty')]:
    'Pultu dlužíte poctivé vyúčtování, včetně jeho děr — přiznat mezeru ten dluh splácí líp, než kdybyste předstírali opak.',
  [reflectionKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 'virtue')]:
    'Zeptejte se, jestli je skepse pultu vůči neporušené složce, která tvrdí nepřítomnost, férová, nebo jestli jsou některé mezery skutečné i bez pasti, na kterou by se dalo svést.',
  [reflectionKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 'care')]:
    'Ať si o tom Vrátný myslí cokoli, nechá to projít — malé milosrdenství, prokázané hostovi, který tu pro část tohohle doopravdy nebyl úplně celý.',
});
