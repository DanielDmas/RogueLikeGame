// German translation of LIMERENCE's 7 endings (title, epitaph, beats, field
// notes). Registered under version 'v2'. Mirrors the structure of
// text/cs-endings.ts and text/fa-endings.ts — see those files and
// CLAUDE.md's "Translating content" rule for the register this follows:
// whatever each specific ending's own emotional register calls for,
// translated for meaning-in-context rather than word-for-word. Ending ids
// are pack-local ('the-morning-after' etc.) and never collide with
// ANAMNESIS's own ('return', 'open-hand', ...), so endingTitleKey/
// endingBeatKey/etc need no pack-id scoping here (see engine/text/keys.ts).
//
// Register: informal "du" throughout, matching every prior German room-
// content file (de-rooms.ts through de-rooms-understory.ts). "The Porter" =
// "Portier", per the established project convention — deliberately NOT
// ANAMNESIS's own German guide-character word (see src/content/text/de.ts's
// usherBarkKey entries for the exact term being avoided; that word is never
// reused here, including in this comment — verified absent, grep count
// zero, from this file). "Trust" = "Vertrauen", "the ledger" = "das
// Kontobuch", "the Interval" = "das Intervall" — all already established in
// the room-content German files (see e.g. de-rooms-act4.ts's many
// "Kontobuch" uses and de-rooms-act3.ts:573's "im Interval gewesen" for the
// bare noun; "Intervall" with the native German double-l spelling is used
// consistently from this file onward).
//
// Judgment call on 'the-porter': this ending id coincidentally shares a
// name with the Porter character, but the ending's own English content
// (beats 0-5) is literally about the player taking over as the hotel's next
// keeper — the handover, learning the wing's temperaments, inheriting the
// first lesson. Its title is translated the same way the character's own
// title is translated throughout this pack ("Der Portier"), because that is
// what the beats describe the player becoming, not a mechanical rename.
//
// Gender neutrality: ending titles are treated as archetype/badge labels
// (comparable to a tarot-card name shown on an end screen), not as a
// pronoun addressing the player, so a handful use German's standard generic
// masculine noun as a title form ("Der Geber", "Der Gepanzerte") — the same
// convention German uses for role/archetype names regardless of the actual
// person's gender (e.g. film and game titles: "Der Favorit"). Within the
// beats themselves, second person stays "du" (grammatically ungendered) and
// the one place a third party's role needed a gender-neutral noun
// (the-mirror's "the tempted and the betrayed... the friend who knew and
// said nothing") uses the same techniques de-rooms-act3.ts's header
// documents for Dana: "wer"-relative clauses, the inherently generic-in-use
// "die Person", and the reflexive "sich" (itself grammatically genderless)
// rather than a gendered third-person pronoun.
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
registerAll('v2', 'de', {
  [endingTitleKey('the-morning-after')]: 'Der Morgen danach',
  [endingEpitaphKey('the-morning-after')]: 'Das Gespräch war immer noch da. Und, endlich, du auch.',
  [endingBeatKey('the-morning-after', 0)]:
    'Du trittst durch die Lobbytüren, und die Schwelle tut das eine, was kein Zimmer oben je konnte: sie endet.',
  [endingBeatKey('the-morning-after', 1)]:
    'Morgenverkehr, gewöhnlich und ungeheuer groß. Irgendwo eine echte Küche. Der Mensch, den du mitten im Satz verlassen hast, immer noch mitten im Satz — als wärst du nur kurz vor die Tür getreten, nicht für eine ganze Nacht.',
  [endingBeatKey('the-morning-after', 2)]:
    'Nichts ist gelöst. Die Welt hat sich dir zuliebe nicht gebessert. Die Streitpunkte haben geduldig deinen Platz warmgehalten, so wie Streitpunkte das eben tun.',
  [endingBeatKey('the-morning-after', 3)]:
    'Aber in den Wochen danach ertappst du dich dabei, Fragen zu stellen, deren Antworten du noch nicht kennst — laut, dem Menschen gegenüber am Tisch, statt sie erst im Stillen mit dir selbst durchzugehen.',
  [endingBeatKey('the-morning-after', 4)]:
    'Du wirst fast alles davon verlieren: die Flure, die genaue Geduld des Portiers, das besondere Gewicht jeder ungeöffneten Tür. Es verblasst, wie Träume verblassen, und hinterlässt eher eine Witterung als eine Erinnerung.',
  [endingBeatKey('the-morning-after', 5)]:
    'Der Weg zurück, wie sich zeigt, war nie eine Straße, {name}. Die Beziehung war nie das Versprechen. Du warst die Renovierung.',
  [endingNoteTitleKey('the-morning-after')]: 'Über das Zurückkommen',
  [endingNoteThinkersKey('the-morning-after')]: 'das Muster des Abstiegs, der zurückkehrt — Ausgabe für Beziehungen',
  [endingNoteBodyKey('the-morning-after')]:
    'Jede Weisheitstradition kennt eine Version derselben Form: Der Abstieg zählt nur so viel wie der Aufstieg, der ihm folgt und der etwas mit sich trägt, das die Oberfläche allein nie hätte hervorbringen können. Auf eine Beziehung angewandt statt auf eine Seele, hält dieses Muster mit beunruhigender Genauigkeit stand — eine überstandene Krise verändert für sich genommen nichts; entscheidend ist, ob die Menschen, die aus ihr zurückkehren, tatsächlich anders sind oder sich einfach wieder auf ihre alten Plätze am alten Tisch setzen. **Die Gefahr in diesem Hotel war nie das Intervall selbst. Es war, unverändert auszuchecken.** Gewöhnlich zurückzukommen, aber neu geordnet: das war schon immer die ganze Aufgabe.',
});

// ---------- Ending: The Giver ----------
registerAll('v2', 'de', {
  [endingTitleKey('the-giver')]: 'Der Geber',
  [endingEpitaphKey('the-giver')]: 'Für alle der sichere Hafen. Münze für Münze. Meistens gern.',
  [endingBeatKey('the-giver', 0)]: 'Du trittst hindurch, und die Welt nimmt dich auf, wie Wasser aufnimmt — keine Naht, kein Platschen.',
  [endingBeatKey('the-giver', 1)]:
    'Du wachst durchlässig auf. Ein anderes Wort gibt es dafür nicht. Die Zwei-Uhr-morgens-Krise jedes Freundes findet jetzt zuerst dich, so wie Wasser in einem Raum immer den tiefsten Punkt findet.',
  [endingBeatKey('the-giver', 2)]:
    'Du wirst zu der Person, an der andere sich wieder zusammensetzen. Es ist wirklich ein gutes Leben, gemessen an den besseren Morgen anderer Menschen — geführt in einer Währung, die zu zählen du irgendwo um Akt II herum aufgehört hast.',
  [endingBeatKey('the-giver', 3)]:
    'Du gibst freiwillig, und meistens gern, und das Geben ist keine Inszenierung — darauf achtet dieses Zimmer genau. Es kostet dich echte Dinge, und die meisten Tage zahlst du sie ohne Groll.',
  [endingBeatKey('the-giver', 4)]:
    'Nur manchmal — spät, in den ehrlichen Stunden — bemerkst du, was eine offene Hand nicht kann: sich schließen. Ob das der Preis war oder der Gewinn, ist eine Frage, die du jeden Abend absichtlich unbeantwortet auf dem Tisch liegen lässt.',
  [endingBeatKey('the-giver', 5)]:
    'Der Portier, könnte er dich sehen — und in manchen Nächten, wer weiß —, würde sagen: Diesen Gast haben wir leichter zurückgeschickt. Wir haben vielleicht etwas mehr Verpackung entfernt, als die Rezeption eigentlich empfiehlt.',
  [endingNoteTitleKey('the-giver')]: 'Über grenzenlose Fürsorge',
  [endingNoteThinkersKey('the-giver')]: 'Forschung zur Co-Abhängigkeit · der Befund der Grenze als tragende Wand',
  [endingNoteBodyKey('the-giver')]:
    'Die klinische Forschung zur Co-Abhängigkeit hat sich von ihrer frühen, moralisierenden Rahmung wegbewegt, hin zu etwas Präziserem: einem realen, kostspieligen Muster, in dem das Wohlergehen eines Menschen strukturell davon abhängig wird, von anderen gebraucht zu werden — und Grenzen, weit entfernt davon, egoistisch zu sein, als die tragende Wand fungieren, die verhindert, dass das ganze Gebäude irgendwann unter dem Gewicht seiner eigenen Großzügigkeit einstürzt. **Eine offene Hand, die sich nicht schließen kann, hält auf Dauer nicht einmal ihr eigenes Gewicht, geschweige denn das von irgendjemand anderem.** Die Zimmer haben deine Offenheit belohnt. Die Welt wird es auch tun, ohne Bosheit — und sie wird es dir irgendwann auch in Rechnung stellen.',
});

// ---------- Ending: The Armored ----------
registerAll('v2', 'de', {
  [endingTitleKey('the-armored')]: 'Der Gepanzerte',
  [endingEpitaphKey('the-armored')]: 'Nichts drang ein. Das war der Plan. Nichts drang ein.',
  [endingBeatKey('the-armored', 0)]: 'Du trittst hindurch, in ein Leben, das von außen betrachtet genau so läuft, wie es soll.',
  [endingBeatKey('the-armored', 1)]:
    'Kompetenz. Irgendwann eine Beförderung, dann noch eine. Menschen beschreiben dich als „solide", als „zusammen" — nie ganz als „warmherzig", auch wenn es Jahre dauert, bis dir das Muster in der Wortwahl auffällt.',
  [endingBeatKey('the-armored', 2)]:
    'Die Mauern, die irgendwo im Langzeitflügel hochgezogen wurden, halten. Sie halten sehr gut. Nichts kommt hinein, was ja, immerhin, der Plan war.',
  [endingBeatKey('the-armored', 3)]:
    'Jahre später, ein Fenster, unauffällig, an einem unauffälligen Abend — und der Gedanke vollendet sich, bevor du ihn aufhalten kannst: alles bleibt draußen. Das Wetter, die Wölfe, und die Post, und die Besucher.',
  [endingBeatKey('the-armored', 4)]:
    'Der Portier schreibt in die Akte, die irgendwann mit deinem Namen zurückgeschickt wird, ein einziges Wort: „Sicher."',
  [endingBeatKey('the-armored', 5)]:
    'Am Rand, darunter, in einer Handschrift, die seine sein könnte und inzwischen vielleicht deine ist: sicher wovor, wurde nie festgelegt.',
  [endingNoteTitleKey('the-armored')]: 'Über Rüstung',
  [endingNoteThinkersKey('the-armored')]: 'vermeidende Bindung, ehrlich beziffert',
  [endingNoteBodyKey('the-armored')]:
    'Vermeidende Bindungsstrategien sind funktional — sie erfüllen zuverlässig genau die Aufgabe, für die sie gebaut wurden: den Schmerz zu verringern, jemanden zu brauchen, der vielleicht nicht erscheint. Die ehrlichen Kosten, quer durch die Literatur dokumentiert, sind keine Schwäche, sondern eine Verengung: ein Selbst, das sich darum organisiert, nicht verletzt zu werden, organisiert sich zuverlässig auch darum, nicht erreicht, nicht erstaunt, nicht überrascht zu werden von der Gegenwart eines anderen Menschen. **Ein Selbst, das nichts verwunden kann, ist auch ein Selbst, das nichts erstaunen kann.** Dieses Ende ist nicht als Scheitern geschrieben — Kompetenz und Sicherheit sind echte Güter — nur als ehrliche Abrechnung dessen, was die Rüstung kostet, wenn man sie auf Dauer trägt.',
});

// ---------- Ending: The Ghost ----------
registerAll('v2', 'de', {
  [endingTitleKey('the-ghost')]: 'Der Geist',
  [endingEpitaphKey('the-ghost')]: 'Du bist weiter erschienen. Du hast aufgehört anzukommen.',
  [endingBeatKey('the-ghost', 0)]:
    'Es gibt hier keinen dramatischen Abgang zu sehen, weil es keinen gab. Du hörst einfach auf, es zu tragen — irgendwann, zu allmählich, um es genau zu datieren.',
  [endingBeatKey('the-ghost', 1)]:
    'Du erscheinst weiterhin — zu Abendessen, Geburtstagen, dem gewöhnlichen Mobiliar des Anwesendseins — noch eine Weile, nachdem du in jeder Hinsicht, die zählt, längst gegangen bist.',
  [endingBeatKey('the-ghost', 2)]:
    'Der Portier hält Wort: Kein Gast löst sich in seiner Schicht allein auf. Diesmal setzt er sich zu dir, ohne viel zu sagen, was sich als genau die richtige Menge herausstellt.',
  [endingBeatKey('the-ghost', 3)]:
    'Was aufhört, gerade von dir getragen zu werden, geht nicht verloren. Irgendwann nimmt es jemand anderes auf, so wie Dinge, die auf einem Tisch liegen bleiben, irgendwann von wem auch immer aufgenommen werden, der noch dort steht.',
  [endingBeatKey('the-ghost', 4)]:
    'Das hier ist kein Bildschirm für Niederlagen. Das Hotel achtet genau darauf, und auf seine eigene Art tut dieses Ende es auch: Manche Dinge enden auf die langsame Art, und die langsame Art ist immer noch ein Ende, kein Verbrechen.',
  [endingBeatKey('the-ghost', 5)]:
    'Die Flut kommt herein, ganz gleich, ob du je zu den Muscheln gezählt wurdest, die sie mit sich zurücknahm.',
  [endingNoteTitleKey('the-ghost')]: 'Über das Stillwerden',
  [endingNoteThinkersKey('the-ghost')]: 'emotionaler Rückzug und Dissoziation in Beziehungen',
  [endingNoteBodyKey('the-ghost')]:
    'Emotionaler Rückzug — der langsame Abgang, der sich nie als Abgang ankündigt — ist eine gut dokumentierte Schutzreaktion, kein moralisches Versagen: Ein Nervensystem, das gelernt hat, dass Nähe ein Risiko birgt, beginnt still und durchaus vernünftig, den Abstand zu diesem Risiko zu verringern, statt den Abstand zum Menschen. **Taubheit ist ein Schutz mit befristetem Mietvertrag, keine feste Adresse — auch wenn sie sich von innen wie eine feste Adresse anfühlen kann.** Absichtlich hier als Ende geschrieben, nie als Urteil über die Person, die dort angekommen ist — die Flut ist keine Strafe. Sie ist einfach das, was Wasser tut, wenn es genug Zeit und genug Gewicht zu tragen hat.',
});

// ---------- Ending: The Porter ----------
registerAll('v2', 'de', {
  [endingTitleKey('the-porter')]: 'Der Portier',
  [endingEpitaphKey('the-porter')]: 'Die Zimmer brauchen immer einen Hüter. Der Hüter brauchte immer die Zimmer.',
  [endingBeatKey('the-porter', 0)]:
    'Die Übergabe geschieht leise, über das, was sich wie eine einzige lange Nacht anfühlt und sich als erheblich länger herausstellt.',
  [endingBeatKey('the-porter', 1)]:
    'Du lernst die Eigenheiten des Flügels — welche Türen bei Kälte klemmen, welche Stockwerke kälter sind, als das Thermostat zugibt, welche Gäste Stille brauchen und welche die Schreibtischlampe brauchen, die anbleibt.',
  [endingBeatKey('the-porter', 2)]:
    'Die Disziplin, hast du sie erst verstanden, ist leicht zu benennen und schwer zu üben: Du darfst den Flur beleuchten. Du darfst die Tür niemals benennen. Jeder Gast muss seinen eigenen Weg zu dem finden, was dahinter liegt.',
  [endingBeatKey('the-porter', 3)]:
    'Jahrhunderte von ihnen ziehen vorbei, oder was sich wie Jahrhunderte anfühlt — jeder Einzelne überzeugt, dass sein Screenshot, sein Flur, sein Küchentisch der erste seiner Art ist. Keiner von ihnen liegt falsch damit, das zu empfinden. Keiner von ihnen liegt aber auch richtig.',
  [endingBeatKey('the-porter', 4)]:
    'Eines Tages wendet sich ein Gast vom Morgenlicht ab, mit einem bestimmten Ausdruck im Gesicht — Erkennen, von der Art, die du von innen kennst, aus einer Nacht, die sich jetzt unmöglich lange her anfühlt.',
  [endingBeatKey('the-porter', 5)]:
    'Du sprichst die erste Lektion aus, die man einst dir gesagt hat: „Der Ring und der blasse Streifen sind gleich groß. Das ist Absicht. Hier ist alles Absicht."',
  [endingNoteTitleKey('the-porter')]: 'Über das Hüten',
  [endingNoteThinkersKey('the-porter')]: 'der Archetyp des verwundeten Heilers',
  [endingNoteBodyKey('the-porter')]:
    'Der Archetyp des verwundeten Heilers — Chiron im Mythos, und seither ein reales, dokumentiertes Muster in helfenden Berufen — besagt, dass die Fähigkeit, jemanden durch eine Krise zu führen, sich häufig gerade daraus schmiedet, eine vergleichbare überstanden zu haben — nicht trotz der Wunde, sondern durch die besondere Aufmerksamkeit, die sie lehrt. Die klinische Forschung zu Peer-Support und Rollen mit gelebter Erfahrung findet in dieser besonderen Art der Fürsorge einen realen, messbaren Wert — einen, den reine Ausbildung allein nicht zuverlässig hervorbringt. **Die Ecke der Welt zu pflegen, die ein Flur ist, ist keine geringere Berufung als jedes der Zimmer, die von ihm abgehen.** Der Hüter brauchte die Zimmer genau so sehr, wie die Zimmer je einen Hüter gebraucht haben.',
});

// ---------- Ending: The Mirror ----------
registerAll('v2', 'de', {
  [endingTitleKey('the-mirror')]: 'Der Spiegel',
  [endingEpitaphKey('the-mirror')]: 'Beide Stühle. Jedes Zimmer. Guter Witz, nicht wahr?',
  [endingBeatKey('the-mirror', 0)]:
    'Die kleine Tür öffnet sich zu einem privaten Salon, zwei Tassen bereits eingeschenkt, kein dritter Stuhl irgendwo darin.',
  [endingBeatKey('the-mirror', 1)]:
    'Der Portier schenkt ein. Er setzt sich nicht so sehr dir gegenüber als vielmehr neben dich — du bemerkst es erst, nachdem er es schon getan hat.',
  [endingBeatKey('the-mirror', 2)]:
    'Ohne Eile zieht er den Ring von seiner rechten Hand, und da — an seiner linken, wo du es irgendwie schon erwartet hast — ist derselbe blasse, ungebräunte Streifen, den du in der ersten Nacht an ihm bemerkt hast. Nur dass es nicht seine Hand ist. Es ist deine.',
  [endingBeatKey('the-mirror', 3)]:
    'Jeder Gast in jedem Zimmer, das du je durchschritten hast, trug – hättest du zweimal hingesehen – dein eigenes Gesicht: wer in Versuchung geführt wurde und wer betrogen wurde, die dritte Person und die befreundete Person, die es wusste und schwieg – beide Erzählenden jedes Streits, in dem du je wirklich gewesen bist.',
  [endingBeatKey('the-mirror', 4)]:
    'Du lachst. Das Lachen ist das Erkennen — keine Pointe kam von außen, nur der Witz, der endlich bei der Person landet, die ihn die ganze Zeit sich selbst erzählt hat, in jedem Zimmer, ohne es zu bemerken.',
  [endingBeatKey('the-mirror', 5)]:
    'Du wachst lachend auf, und der Witz verflüchtigt sich, wie Witze es beim Aufwachen tun, und hinterlässt nur seine Form: Im anderen Stuhl saß nie jemand. Es gab immer zwei von dir, und beide warst du.',
  [endingNoteTitleKey('the-mirror')]: 'Der älteste Witz',
  [endingNoteThinkersKey('the-mirror')]: 'die letzte Form der Perspektivübernahme',
  [endingNoteBodyKey('the-mirror')]:
    'Die Forschung zur Perspektivübernahme findet hier ihre vollständigste Form, jenseits des Punktes, an dem sie noch eine Fertigkeit ist, die man übt, und näher an etwas, das eher ein Erkennen ist: Jeder Konflikt, den dieses Hotel inszeniert hat, hatte genau zwei Ich-Erzählende, und du warst, nachweislich, beide — nicht metaphorisch, sondern strukturell. Die Sanskrit-Formel *tat tvam asi* — „das bist du" — benennt eine alte, kulturübergreifende Intuition über die Durchlässigkeit der Grenze zwischen Selbst und Anderem; dieses Zimmer leiht sie sich einmal, beiläufig, als ein einziges leises Echo, nicht als Lehrsatz. **Beide Stühle. Jedes Zimmer. Guter Witz, nicht wahr — von der Art, die erst landet, wenn dir auffällt, dass du die ganze Zeit über dich selbst gelacht hast.**',
});

// ---------- Ending: The Pattern ----------
registerAll('v2', 'de', {
  [endingTitleKey('the-pattern')]: 'Das Muster',
  [endingEpitaphKey('the-pattern')]: 'Du hast nicht ausgecheckt. Du bist aufgewacht, und das Aufwachen enthielt jedes Zimmer.',
  [endingBeatKey('the-pattern', 0)]:
    'Jede Tür auf jedem Stockwerk öffnet sich gleichzeitig — nicht aufgerissen, nicht dramatisch, einfach offen, so wie eine Tatsache sich öffnet und nicht wie ein Ereignis.',
  [endingBeatKey('the-pattern', 1)]:
    'Das Licht im Flur ist gewöhnlich, freundlich, und zum ersten Mal in dieser ganzen Nacht gibt es darin nichts mehr, wovor man sich verstecken müsste.',
  [endingBeatKey('the-pattern', 2)]:
    'Die Lesebestätigung, der Screenshot, der Flur auf der Konferenz, der Küchentisch um 06:40 — all das, alles auf einmal, gegenwärtig so, wie ein ganzes Leben dem Menschen gegenwärtig ist, der es tatsächlich lebt, und nicht so, wie eine Geschichte jemandem gegenwärtig ist, der sie zurückliest.',
  [endingBeatKey('the-pattern', 3)]:
    'Der Portier, den Hut endlich abgenommen, sagt das Kürzeste, was er irgendwo in diesem ganzen Hotel sagt. „Ah."',
  [endingBeatKey('the-pattern', 4)]:
    'Das Erkennen ist kein Lernen von etwas Neuem. Es ist, das Muster als Ganzes zu sehen — was sich als das Einzige herausstellt, das in der gesamten Geschichte dieses Gebäudes je tatsächlich eines verändert hat.',
  [endingBeatKey('the-pattern', 5)]:
    'Du wachst auf, und {name} kommt mit dem Aufwachen selbst an, keine halbe Sekunde danach. Die Abflugtafel, zuletzt auf dem Weg hinaus erblickt, zeigt jede Uhrzeit gleichzeitig.',
  [endingNoteTitleKey('the-pattern')]: 'Es als Ganzes sehen',
  [endingNoteThinkersKey('the-pattern')]: 'Mustererkennung und Veränderung · der tatsächliche Mechanismus der Literatur zur erarbeiteten Sicherheit',
  [endingNoteBodyKey('the-pattern')]:
    'Einsicht allein verändert selten Verhalten — die klinische Literatur ist sich einig, dass zu wissen, dass ein Muster existiert, notwendig, aber nie hinreichend ist. Was die Forschung zur erarbeiteten Sicherheit tatsächlich als Mechanismus der Veränderung identifiziert, liegt näher an dem, was dieses Zimmer direkt inszeniert: kein neu gelernter Fakt, sondern das ganze Muster auf einmal gesehen, lange genug und klar genug gehalten, dass es aufhört, unsichtbar wirken zu können. **Die Zimmer waren nie hinter dir. Sie waren die Gestalt von dir, wach.** Das ist aus gutem Grund die seltenste Tür des Hotels: Sie verlangt nicht nach einer weiteren guten Entscheidung, sondern nach der Bereitschaft, die gesamte Akte auf einmal anzusehen und die Handschrift darin durchgehend als die eigene zu erkennen.',
});

// ---------- End-screen axis triptych (2026-07-15, code review) ----------
registerAll('v2', 'de', {
  [axisTriptychKey('reasonFeeling', 'neg', 'limerence')]: 'Du bist immer mit dem Kopf vorangegangen.',
  [axisTriptychKey('reasonFeeling', 'mid', 'limerence')]: 'Kopf und Herz, im Streit miteinander.',
  [axisTriptychKey('reasonFeeling', 'pos', 'limerence')]: 'Du bist immer mit dem Herzen vorangegangen.',
  [axisTriptychKey('selfOthers', 'neg', 'limerence')]: 'Du hast behalten, was deins war.',
  [axisTriptychKey('selfOthers', 'mid', 'limerence')]: 'Du hast Deins und Ihres in derselben Hand gehalten.',
  [axisTriptychKey('selfOthers', 'pos', 'limerence')]: 'Du hast dich verschenkt, gern.',
  [axisTriptychKey('controlAcceptance', 'neg', 'limerence')]: 'Du hast festgehalten, Stockwerk für Stockwerk.',
  [axisTriptychKey('controlAcceptance', 'mid', 'limerence')]: 'Du wusstest, wann halten und wann loslassen.',
  [axisTriptychKey('controlAcceptance', 'pos', 'limerence')]: 'Du hast die Strömung entscheiden lassen.',
});
