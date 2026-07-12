// German translation of LIMERENCE's Act II room prose (beats, choice
// text/hint/outcome, field notes, plain-language explanations). Registered
// under version 'v2'. Follows the structural pattern established by
// de-rooms.ts (prologue/Act I) — see CLAUDE.md's "Translating content" rule:
// every line here was translated against the room's actual beats and each
// choice's stakes, not word-for-word.
//
// Sie/du decision: informal "du" throughout, continuing Act I's choice
// rather than defaulting to it unexamined. Act II's cast is adults (18-24)
// in established or near-established relationships, but the narration is
// still the same device as Act I: second-person interior address of the
// player-as-character inside their own relationship, not a narrator
// addressing a guest from a respectful remove. Nothing about the prose
// shifts register toward the hotel-host framing that would justify "Sie" —
// if anything, Act II is more intimate than Act I (bedrooms, stomach-drops,
// 3 a.m. stones under the sternum), which argues harder for "du", not less.
// German-language fiction and prestige TV about people in this age bracket
// (their own interior monologue, their own partners) defaults to "du"
// between intimates; "Sie" here would read as a jarring, unmotivated
// register shift mid-hotel, not a deliberate choice the material earns. The
// Porter keeps his measured, unhurried cadence and continues addressing the
// player as "du", exactly as in the prologue and Act I.
//
// "The Porter" remains "Portier", per the established project convention
// (distinct from ANAMNESIS's own German guide-character word, "Platzanweiser"
// — never reused here; verified absent from both files in this pass).
//
// Field-note thinkers lines: proper-name citations (with years) are carried
// through unchanged. Descriptive (non-named) thinkers lines are translated —
// e.g. "rebound literature · ethics of asymmetry" becomes "Forschung zu
// Übergangsbeziehungen · Ethik der Asymmetrie". Book titles cited alongside
// an author's name (Glass's "Not Just Friends") are left in English, matching
// de-rooms.ts's own precedent with Tennov's "Love and Limerence".
//
// Jules gender-neutrality: the English source deliberately never genders
// Jules (Act II's recurring partner, "the-distance" through "the-scoreboard").
// German grammar forces a choice on articles, possessives, and third-person
// pronouns in a way English doesn't, so this needed real, line-by-line
// handling — the same problem the Czech pass (cs-rooms-act2.ts) solved for
// the same character; this file applies an equivalent strategy in German:
//   - Prefer constructions where "Jules" simply sits as the bare proper noun
//     in a case German marks without an article or agreement suffix — dative
//     ("Jules stand die Wahrheit zu"), genitive with the bare -s an
//     unarticled name takes ("Jules' Schmerz", "Jules' Angst") — so no
//     der/die/sein/ihr is ever needed.
//   - Predicate adjectives are gender-invariant in German ("Jules ist warm,
//     dankbar, erleichtert") and are used freely wherever the English has an
//     adjective describing Jules.
//   - Passive voice ("wird beruhigt", "wird bestraft", "wird vorenthalten")
//     routes around a subject pronoun entirely wherever the English has
//     Jules as a grammatical object.
//   - "the eigene X" (das eigene Leben, die eigene Angst) substitutes for a
//     reflexive possessive ("their own life") without gendering the referent.
//   - Where English repeats no name and German would otherwise need a third-
//     person pronoun, the name "Jules" is simply repeated rather than
//     replaced by er/sie/ihm/ihr.
//   - Only where a relative pronoun or possessive determiner is genuinely
//     unavoidable (no rephrasing available without distorting the sentence)
//     does this file fall back to a grammatically masculine default, matching
//     the Czech pass's own documented precedent for the same character.
//   That fallback is rare by design; most sentences below route around it.
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

/** Mirrors act2.ts's own seedSplit — same deterministic 50/50 split on the
 * run's doorSeed, so a translated branch always matches the English branch
 * it's standing in for. */
function seedSplit(s: RunState): boolean {
  return ((s.doorSeed ?? 0) * 2654435761) % 2 === 0;
}

// ---------- The Distance ----------
registerAll('v2', 'de', {
  // beat 0 is a function beat — registered below via register().
  [roomBeatKey('the-distance', 0, 1)]:
    'Gestern Abend, eine Party. Alena — die Bekannte einer Bekannten, klug und leicht im Gespräch — war einen Zentimeter von deinem Mund entfernt, eine ganze Sekunde lang, bevor du zurückgewichen bist.',
  [roomBeatKey('the-distance', 0, 2)]:
    'Es ist nichts passiert. Diesen Satz hast du dir heute schon elfmal vorgesagt, hast ihn mit der Zunge abgetastet wie einen Zahn, auf der Suche nach Rissen.',
  [roomBeatKey('the-distance', 0, 3)]:
    'Das Zurückweichen war echt. Genauso echt, darunter, war die Sekunde davor — und das Zimmer verlangt, dass du beides zugleich aushältst, statt das eine wegzuschneiden.',
  [roomBeatKey('the-distance', 0, 4)]:
    'Der heutige Anruf mit Jules ist verabredet, ganz gewöhnlich, schon auf deinem Bildschirm geöffnet. Du hast dreißig Sekunden, um zu entscheiden, was du mit hineinnimmst.',
  [roomBeatKey('the-distance', 0, 5)]: 'Portier: Gäste legen „fast“ entweder unter Geständnis oder unter Inventur ab. Die Ablage entscheidet, was aus dem Wort wird.',
  [roomChoiceTextKey('the-distance', 'confess-the-near-miss')]: 'Erzähl Jules genau, was fast passiert wäre.',
  [roomChoiceHintKey('the-distance', 'confess-the-near-miss')]: 'Die ganze Sekunde geben, ungekürzt',
  [roomChoiceOutcomeKey('the-distance', 'confess-the-near-miss', 0)]:
    'Ein schwerer Anruf, und ein guter. Jules’ Schmerz ist echt; genauso echt, darunter, ist die Erleichterung, mit der Wahrheit betraut worden zu sein, solange sie noch nichts war.',
  [roomChoiceOutcomeKey('the-distance', 'confess-the-near-miss', 1)]:
    '„Danke, dass du es mir gesagt hast, solange es noch nichts war“, sagt Jules irgendwann. Der Satz kostet euch beide etwas — und kauft auch etwas.',
  [roomChoiceTextKey('the-distance', 'bury-it')]: 'Es ist nichts passiert. Es gibt nichts zu erzählen.',
  [roomChoiceHintKey('the-distance', 'bury-it')]: 'Die technische Wahrheit für die ganze einstehen lassen',
  [roomChoiceOutcomeKey('the-distance', 'bury-it', 0)]: 'Technisch gesehen stimmt es. Der Anruf läuft gut, ganz gewöhnlich, neunzig Minuten über nichts.',
  [roomChoiceOutcomeKey('the-distance', 'bury-it', 1)]: 'Die Mauer wächst um einen Ziegel — unbemerkt von der Person, der sie zugewandt ist.',
  [roomChoiceTextKey('the-distance', 'soften-it')]: 'Erzähl eine zurechtgeschnittene Version: „jemand hat mit mir geflirtet, war komisch.“',
  [roomChoiceHintKey('the-distance', 'soften-it')]: 'Die Form geben, ohne den Inhalt',
  [roomChoiceOutcomeKey('the-distance', 'soften-it', 0)]: 'Es funktioniert. Jules lacht, unbekümmert, und der Anruf geht weiter.',
  [roomChoiceOutcomeKey('the-distance', 'soften-it', 1)]:
    'Die geglättete Geschichte funktioniert so gut, dass die wahre jetzt nie mehr erzählt werden kann, ohne zu verraten, dass die andere zurechtgeschnitten war. Das Zimmer schließt mit dieser Rechnung und lässt dich spüren, wie sie sich anfühlt.',
  [roomChoiceTextKey('the-distance', 'keep-visiting-almost')]: 'Entscheide dich: „fast“ ist ein Ort, den du weiter besuchen kannst.',
  [roomChoiceHintKey('the-distance', 'keep-visiting-almost')]: 'Abstreitbarkeit den ganzen Plan sein lassen',
  [roomChoiceOutcomeKey('the-distance', 'keep-visiting-almost', 0)]:
    'Nichts zu gestehen, nichts zu vergraben — du lässt die Tür zu „fast“ einfach unverschlossen, mit Absicht, und fragst nicht nach, warum.',
  [roomChoiceOutcomeKey('the-distance', 'keep-visiting-almost', 1)]:
    'Das Zimmer gesteht dir das Vergnügen daran ehrlich zu: das Prickeln, die plausible Abstreitbarkeit. Und es merkt sich still, welche Tür in diesem Hotel dir jetzt eher angeboten wird.',
  [roomExplanationKey('the-distance', 0)]:
    'Häppchenweise Wahrheit — in kleinen, selbstschützenden Raten gestehen statt auf einmal — fühlt sich im Moment freundlicher an und ist für das Vertrauen messbar schlimmer als sowohl volle Offenlegung als auch volles Schweigen: Die Forschung zu Vertrauensbrüchen findet durchgehend, dass Betrogene eine tröpfchenweise Korrektur als schädlicher bewerten als das eigentliche Ereignis, weil jedes neue Detail die Wunde erneut öffnet und beweist, dass die vorherige Version zurechtgeschnitten war. „Es ist nichts passiert“ und „es gibt nichts zu erzählen“ klingen identisch und sind zwei verschiedene Sätze — der eine beschreibt ein Ereignis, der andere eine Entscheidung darüber, was jemand anderes erfahren darf.',
  [roomNoteTitleKey('the-distance')]: 'Das zurechtgeschnittene Geständnis',
  [roomNoteThinkersKey('the-distance')]: 'Shirley Glass (2003)',
  [roomNoteBodyKey('the-distance')]:
    'Glass’ Forschung zur Offenlegung ist in einem Punkt eindeutig: Betrogene bewerten das tröpfchenweise Nachbessern — eine Geschichte, die bei jeder Nachfrage ein Stück wahrer wird — durchgehend als schlimmer als die ursprüngliche Tat selbst, weil jede Korrektur beweist, dass die letzte Version eine Zurechtschneidung war, kein Bericht. **Mauern werden Ziegel für Ziegel gebaut, jeder für sich abstreitbar; niemand beschließt an einem einzigen Tag, eine zu bauen.** Entscheidend ist nicht, wie groß das Geheimnis ist — sondern ob die Tür offen gelassen wurde oder nur still, glaubhaft, angelehnt. „Fast“ ist ein Vorort. Man pendelt.',
});

register(roomBeatKey('the-distance', 0, 0), 'v2', 'de', (s: RunState) =>
  s.flags.includes('promised-september')
    ? 'Du und Jules habt das Versprechen gehalten, das ihr euch im September gegeben habt. Acht Monate lang zwei Städte, ein gemeinsamer Kalender und eine Handyrechnung, die keiner von euch beiden erwähnt.'
    : s.flags.includes('first-open')
      ? 'Du und Jules versucht immer noch herauszufinden, was „offen“ nach acht Monaten eigentlich bedeutet hat. Das Wort trägt mehr Last, als ihr beide zusammen tragen könnt.'
      : 'Du und Jules habt es bis zum Frühling geschafft. Zwei Städte, ein Kalender, die Beziehung läuft mit einer Signalverzögerung wie von einem Satelliten, die euch beiden längst nicht mehr auffällt.',
);

// ---------- The Hall Pass ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-hall-pass', 0, 0)]:
    'Jules schlägt es vernünftig vor, großzügig, bei einem Kaffee: Ausnahmen, solange ihr getrennt seid. Modern. Sicher. Niemand gehört jemandem. Die Formulierung ist sorgfältig gewählt, und sie ist gut gemeint.',
  [roomBeatKey('the-hall-pass', 0, 1)]:
    'Dein Magen antwortet, bevor dein Mund es tut — ein kleiner, unverkennbarer Sturz, der volle zwei Sekunden vor allem eintrifft, was du einen Gedanken nennen könntest.',
  [roomBeatKey('the-hall-pass', 0, 2)]:
    'Als Nächstes kommen die Adjektive, vor denen du dich fürchtest, ungebeten: anhänglich. Eifersüchtig. Jung. Nicht modern genug. Du katalogisierst sie, bevor du überhaupt irgendetwas entschieden hast.',
  [roomBeatKey('the-hall-pass', 0, 3)]:
    'Wofür würde ein Ja hier eigentlich stehen — für Frieden, für ein Bild von dir, oder für die Angst, Jules wegen eines „Nein“ zu verlieren? Das Zimmer besteht darauf, dass du das benennst, bevor du antwortest.',
  [roomBeatKey('the-hall-pass', 0, 4)]:
    'Portier: Die Rezeption hat zehntausend Abmachungen bearbeitet. Die, die unterschrieben werden, um ein Gespräch zu vermeiden, überdauern dieses Gespräch im Schnitt um etwa eine Woche.',
  [roomChoiceTextKey('the-hall-pass', 'agree-to-keep-peace')]: 'Sag Ja, um nicht kleinlich zu wirken.',
  [roomChoiceHintKey('the-hall-pass', 'agree-to-keep-peace')]: 'Die Lockerheit vorspielen, die du nicht fühlst',
  [roomChoiceOutcomeKey('the-hall-pass', 'agree-to-keep-peace', 0)]: 'Das Ja kauft eine wirklich gute Woche. Jules ist herzlich, dankbar, erleichtert.',
  [roomChoiceOutcomeKey('the-hall-pass', 'agree-to-keep-peace', 1)]:
    'Die Abmachung sitzt in dir wie geschlucktes Glas. Wochen später erwähnt Jules — ein Satz, keine Details —, dass die Abmachung genutzt wurde. Dein Gesicht tut etwas, das du selbst nicht zu sehen bekommst.',
  [roomChoiceTextKey('the-hall-pass', 'true-no')]: 'Sag das echte Nein. Adjektive hin oder her.',
  [roomChoiceHintKey('the-hall-pass', 'true-no')]: 'Dir erlauben, so unmodern zu klingen, wie nötig',
  [roomChoiceOutcomeKey('the-hall-pass', 'true-no', 0)]:
    'Jules ist überrascht, dann — einen Atemzug später — sichtlich erleichtert, eine echte Antwort zu bekommen statt einer Vorstellung.',
  [roomChoiceOutcomeKey('the-hall-pass', 'true-no', 1)]:
    'Das Gespräch, für das der Vorschlag eigentlich nur ein Ersatz war, findet jetzt endlich statt: was „getrennt sein“ wirklich mit jedem von euch macht. Ein ehrlicher Streit. Danach besseres Wetter.',
  [roomChoiceTextKey('the-hall-pass', 'counter-with-need')]: '„Hier ist, was ich wirklich brauche, solange wir getrennt sind.“',
  [roomChoiceHintKey('the-hall-pass', 'counter-with-need')]: 'Bedürfnisse aushandeln, nicht Erlaubnisse',
  [roomChoiceOutcomeKey('the-hall-pass', 'counter-with-need', 0)]:
    'Das Gespräch, das folgt, ist langsamer und besser, als es ein Ja oder ein Nein gewesen wäre.',
  [roomChoiceOutcomeKey('the-hall-pass', 'counter-with-need', 1)]:
    'Was ihr da baut, ist kleiner als das angebotene „Geschenk“ — aber es ist wirklich eures: Bedürfnisse auf dem Tisch statt verteilter Erlaubnisscheine.',
  [roomChoiceTextKey('the-hall-pass', 'take-it-angrily')]: 'Nimm die Freikarte, die du nicht wolltest, und nutz sie, um dich im Voraus zu rächen.',
  [roomChoiceHintKey('the-hall-pass', 'take-it-angrily')]: 'Das Geschenk aus Trotz ausgeben',
  [roomChoiceOutcomeKey('the-hall-pass', 'take-it-angrily', 0)]:
    'Die Nacht selbst lässt das Zimmer bewusst aus — eine Schwelle, ein Schnitt. Was bleibt, ist der Morgen danach, und die Rechnung, die darin steckt.',
  [roomChoiceOutcomeKey('the-hall-pass', 'take-it-angrily', 1)]:
    'Du hast eine fremde Person und eine Gesetzeslücke benutzt, um jemanden zu bestrafen, der dir an diesem Morgen tatsächlich noch gar nichts getan hatte.',
  [roomExplanationKey('the-hall-pass', 0)]:
    'Wer konsensuelle Nichtmonogamie erforscht, findet durchgehend einen klaren Unterschied zwischen Abmachungen, die ausgehandelt sind — aus ausgesprochenen Bedürfnissen gebaut, immer wieder überprüft, wirklich gewollt —, und solchen, denen man zustimmt, um einen Streit oder den Eindruck von Unsicherheit zu vermeiden. Aus Angst getroffene Vereinbarungen ähneln in ihrer Wirkung auf das Wohlbefinden eher einer Untreue als einer Öffnung, ganz gleich, was formal vereinbart wurde. „Das will ich nicht“ ist ein vollständiger Satz; mit zwanzig, umgeben von einer Kultur, die Zögern als Unreife liest, fühlt er sich selten wie einer an.',
  [roomNoteTitleKey('the-hall-pass')]: 'Unterschrieben im Sturm',
  [roomNoteThinkersKey('the-hall-pass')]: 'Conley · Moors (CNM-Forschung)',
  [roomNoteBodyKey('the-hall-pass')]:
    'Die Forschung zu konsensueller Nichtmonogamie ist in beide Richtungen ehrlich: Zufriedenheit und Vertrauen erreichen vergleichbare Werte wie in monogamen Beziehungen, *wenn die Abmachung frei ausgehandelt ist* — wirklich gewollt, nicht bloß geduldet. Dieselbe Forschung zeigt genauso klar, dass Vereinbarungen, die aus Angst geschlossen werden, eifersüchtig, anhänglich oder unmodern zu wirken, in ihrer Wirkung auf das Wohlbefinden eher einer Untreue ähneln, egal was auf dem Papier steht. **Vorgespieltes Einverständnis und echtes Einverständnis können sich über den Tisch hinweg identisch anfühlen — und völlig unterschiedliche Jahre nach sich ziehen.** Ein Geschenk, das du nicht ablehnen zu können glaubst, ist kein Geschenk. Es ist eine Rechnung, die erst später kommt, mit allen Posten einzeln aufgeführt.',
});

// ---------- The Rebound ----------
registerAll('v2', 'de', {
  // beat 0 is a function beat — registered below via register().
  [roomBeatKey('the-rebound', 0, 1)]:
    'Mira ist warmherzig, witzig, völlig ungeschützt. Heute Abend, während sie sich an deinem Waschbecken die Zähne putzt, als wäre es längst Gewohnheit, fragt sie: „soll ich einfach — eine hierlassen?“',
  [roomBeatKey('the-rebound', 0, 2)]:
    'Du machst Inventur dessen, was du wirklich fühlst, und die ehrliche Antwort lautet: Rauschen. Dankbarkeit. Eine Form dort, wo ein Gefühl sein sollte — umrissen, aber leer.',
  [roomBeatKey('the-rebound', 0, 3)]: 'Jules drängt sich auf — ein einziger Herzschlag, unwillkürlich, ungebeten — mitten im Satz, mitten in Mira, verschwunden, so schnell wie er kam.',
  [roomBeatKey('the-rebound', 0, 4)]: 'Mira sagt laut, was das hier für sie ist, völlig aufrichtig, völlig ungeschützt. Sie spielt nichts vor. Genau das macht es schlimmer.',
  [roomBeatKey('the-rebound', 0, 5)]:
    'Portier: Der Zimmerservice meldet einen Gast, der für zwei bestellt, und einen Gast, der allein an demselben Tisch isst. Das kommt öfter vor, als man denkt.',
  [roomChoiceTextKey('the-rebound', 'tell-her-what-this-is')]: 'Sag den Betäubungssatz, heute Abend, laut.',
  [roomChoiceHintKey('the-rebound', 'tell-her-what-this-is')]: 'Benennen, was sie dir gerade ist',
  [roomChoiceOutcomeKey('the-rebound', 'tell-her-what-this-is', 0)]:
    'Die freundlichste Grausamkeit, die dieses Stockwerk zu bieten hat. Miras Gesicht verändert sich in Echtzeit, während der Satz landet.',
  [roomChoiceOutcomeKey('the-rebound', 'tell-her-what-this-is', 1)]:
    'Was sie als Nächstes tut — bleiben, wissend, oder gehen — überlässt das Zimmer ganz ihr. Das war nie deine Entscheidung für sie; es war nur an dir, sie möglich zu machen.',
  [roomChoiceTextKey('the-rebound', 'let-her-believe')]: 'Sag nichts. Bleib warmherzig.',
  [roomChoiceHintKey('the-rebound', 'let-her-believe')]: 'Die Geschichte sich selbst schreiben lassen',
  [roomChoiceOutcomeKey('the-rebound', 'let-her-believe', 0)]:
    'Monate vergehen wie ein einziger angehaltener Atemzug. Dann: ihr „ich liebe dich“, mitten an einem ganz gewöhnlichen Dienstag, völlig ungeschützt.',
  [roomChoiceOutcomeKey('the-rebound', 'let-her-believe', 1)]:
    'Das Zimmer friert auf deinem Einatmen ein und schneidet genau dort, mit Absicht. Die Schuld hat die ganze Zeit über Zinsen angehäuft; das hier ist nur die Abrechnung, die jetzt eintrifft.',
  [roomChoiceTextKey('the-rebound', 'end-it')]: 'Beende es, bevor es sie mehr kostet.',
  [roomChoiceHintKey('the-rebound', 'end-it')]: 'Aufhören, solange der Preis noch klein ist',
  [roomChoiceOutcomeKey('the-rebound', 'end-it', 0)]: 'Sie weint und bedankt sich innerhalb derselben zehn Minuten — Trauer und Erleichterung in ein und demselben Atemzug.',
  [roomChoiceOutcomeKey('the-rebound', 'end-it', 1)]:
    'Die Trauer kehrt danach in voller Lautstärke zu dir zurück, ohne dass es noch irgendwohin damit geht. Das Rauschen, das die Betäubung überdeckt hat, endlich unverstellt.',
  [roomChoiceTextKey('the-rebound', 'try-to-catch-up')]: 'Versuch, dich selbst dazu zu bringen, das zu fühlen, was sie fühlt.',
  [roomChoiceHintKey('the-rebound', 'try-to-catch-up')]: 'Das Gefühl herbeizwingen',
  [roomChoiceOutcomeKey('the-rebound', 'try-to-catch-up', 0)]: 'Mühevolle Aufrichtigkeit, ehrlich dargestellt.',
  // outcome 1 is a function beat — registered below via register().
  [roomExplanationKey('the-rebound', 0)]:
    'Übergangsbeziehungen sind nicht grundsätzlich schädlich — die Forschung findet gemischte Ergebnisse, und manche helfen Menschen tatsächlich, schneller und vollständiger zu genesen, als Alleinsein es könnte. Der dokumentierte Schaden liegt nicht in der Übergangsbeziehung selbst, sondern in der ungleichen Information, die darin steckt, wenn eine Person ein Gefühl reguliert und die andere glaubt, gerade eines aufzubauen. „Ich habe nie etwas versprochen“ stimmt und reicht allein nicht aus — informierte Zustimmung ist die Grenze zwischen jemanden als Betäubung zu benutzen und einfach zwei Menschen zu sein, die gemeinsam herausfinden, was das hier eigentlich ist.',
  [roomNoteTitleKey('the-rebound')]: 'Betäubung mit Puls',
  [roomNoteThinkersKey('the-rebound')]: 'Forschung zu Übergangsbeziehungen · Ethik der Ungleichheit',
  [roomNoteBodyKey('the-rebound')]:
    'Was die Forschung zu Übergangsbeziehungen tatsächlich zeigt, ist uneindeutiger als die Alltagsweisheit: Genesung kann schneller gehen, die Ergebnisse können wirklich gut sein, und die verbreitete Regel „erst musst du wieder allein sein“ ist als pauschale Vorschrift schlecht belegt. **Die Trennlinie ist nicht der Zeitpunkt — sie verläuft dort, ob beide dieselbe Information darüber haben, was das hier ist.** Das eigentliche Risiko einer Übergangsbeziehung liegt nicht darin, dass sie zu früh kam; es liegt darin, dass die eine Person die Beziehung zur Regulierung nutzt, während die andere glaubt, gerade etwas aufzubauen — und nur eine von beiden weiß, was davon zutrifft. Die freundlichen Menschen werden genau deshalb gewählt, weil sie tragfähig sind. Das ist kein Zufall, und es ist auch kein automatisches Verbrechen — aber es ist eine Schuld, und Schulden werden fällig.',
});

register(roomBeatKey('the-rebound', 0, 0), 'v2', 'de', (s: RunState) =>
  s.flags.includes('let-it-drift') || s.flags.includes('end-clean')
    ? 'Drei Wochen, seit es mit Jules zu Ende ging, still, so wie es sich schon eine Weile abgezeichnet hatte. Mira kam schneller, als du es dir bei irgendetwas hättest vorstellen können.'
    : 'Drei Wochen, seit es mit Jules zu Ende ging — plötzlich, von dir aus, sauberer, als es sich angefühlt hat. Mira kam schneller, als du es dir bei irgendetwas hättest vorstellen können.',
);

register(roomChoiceOutcomeKey('the-rebound', 'try-to-catch-up', 1), 'v2', 'de', (s: RunState) =>
  seedSplit(s)
    ? 'Diesmal funktioniert es tatsächlich. Irgendwo im Versuchen fängt darunter etwas Echtes an zu wachsen — das Zimmer hält das ausdrücklich für selten: Manchmal ist der Wunsch, etwas zu fühlen, schon der halbe Weg dorthin.'
    : 'Diesmal schlägt es nicht an. Das Versuchen selbst wird zu einer eigenen, kleinen, privaten Trauer — das Zimmer ist ehrlich, was die Chancen angeht: Mit einundzwanzig funktioniert das manchmal, und manchmal nicht, und im Voraus erfährst du nie, in welchem Fall du gerade steckst.',
);

// ---------- The Unicorn ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-unicorn', 0, 0)]:
    'Erik und Maja — fünf Jahre zusammen, eine schöne Wohnung, eine so eingeübte Wärme, dass sie mühelos wirkt — laden dich zum Essen ein, und dann laden sie dich ein, mitzumachen: als drittes Mitglied im Bunde.',
  [roomBeatKey('the-unicorn', 0, 1)]:
    'Das Angebot ist echt, und die Anziehung auch; das Zimmer tut nicht so, als wäre eines von beidem hohl. Du beobachtest ihre Choreografie, während sie das tun: wer wen berührt, wer beim Sprechen zuerst einen Blick zur anderen Person wirft.',
  [roomBeatKey('the-unicorn', 0, 2)]:
    'Die Regeln wurden geschrieben, bevor es dich in diesem Bild gab, und werden präsentiert, fast schon laminiert: keine Dates zu zweit ohne den anderen. Keine Übernachtungen unter der Woche. „Wir kommen zuerst“ — freundlich gesagt, und absolut verbindlich.',
  [roomBeatKey('the-unicorn', 0, 3)]:
    'Was du bekommst, ehrlich zugestanden: Zugehörigkeit, Hitze, die volle Aufmerksamkeit zweier Menschen gleichzeitig auf dich gerichtet. Das Zimmer lässt das genauso gut anfühlen, wie es gemeint ist.',
  [roomBeatKey('the-unicorn', 0, 4)]: 'Der erste Riss, klein: Majas Gesicht, genau eine Sekunde lang, als Erik zu lange über etwas lacht, das du gesagt hast.',
  [roomBeatKey('the-unicorn', 0, 5)]: 'Portier: Suite 3 bucht alle paar Monate ein Zustellbett. Das Zustellbett darf sich das Zimmer nie aussuchen.',
  [roomChoiceTextKey('the-unicorn', 'obey-the-rules')]: 'Nimm die Bedingungen genau so an, wie sie geschrieben stehen.',
  [roomChoiceHintKey('the-unicorn', 'obey-the-rules')]: 'Unterschreiben, was vor dir liegt',
  [roomChoiceOutcomeKey('the-unicorn', 'obey-the-rules', 0)]: 'Drei gute Monate, verdichtet auf zwei Momente — warm, leicht, genau wie versprochen.',
  [roomChoiceOutcomeKey('the-unicorn', 'obey-the-rules', 1)]:
    'Dann wird rückwirkend eine Regel geltend gemacht, die du nie zu Gesicht bekommen hast — von den beiden, die das Regelwerk geschrieben haben. Du lernst: Es gibt ein Korrekturblatt, das nur die beiden erhalten.',
  [roomChoiceTextKey('the-unicorn', 'renegotiate')]: '„Schreibt die Regeln neu, mit mir im Raum — oder ich unterschreibe nicht.“',
  [roomChoiceHintKey('the-unicorn', 'renegotiate')]: 'Darauf bestehen, Vertragspartei zu sein',
  [roomChoiceOutcomeKey('the-unicorn', 'renegotiate', 0)]: 'Der eigentliche Test, ob „gleichberechtigt“ je ernst gemeint war.',
  // outcome 1 is a function beat — registered below via register().
  [roomChoiceTextKey('the-unicorn', 'discover-we-come-first')]: 'Bleib bis zu der Nacht, in der Maja weint — und lern, was die Hierarchie bedeutet.',
  [roomChoiceHintKey('the-unicorn', 'discover-we-come-first')]: 'Die Regel sich selbst beibringen lassen',
  [roomChoiceOutcomeKey('the-unicorn', 'discover-we-come-first', 0)]:
    'Das Taxi um zwei Uhr nachts, in voller Länge: du, hastig angezogen, und hinter dir eine Tür, die sich schon schließt, sich schon wieder um die beiden herum zusammenfügt.',
  [roomChoiceOutcomeKey('the-unicorn', 'discover-we-come-first', 1)]:
    '„Wir kommen zuerst“ hört auf, ein Satz auf einer laminierten Seite zu sein, und wird zu etwas, das du mit einem Mal in deinem Körper verstehst, um zwei Uhr nachts, in einem Taxi.',
  [roomChoiceTextKey('the-unicorn', 'decline-kindly')]: 'Lehn ab. Sag freundlich, warum.',
  [roomChoiceHintKey('the-unicorn', 'decline-kindly')]: 'Den nicht gewählten Weg mit Würde gehen',
  [roomChoiceOutcomeKey('the-unicorn', 'decline-kindly', 0)]:
    'Der nicht gewählte Weg, mit Würde statt mit Drama gegangen. Erik und Maja reagieren ihrerseits großzügig — und ein bisschen enttäuscht, und auch das darf wahr sein.',
  [roomChoiceOutcomeKey('the-unicorn', 'decline-kindly', 1)]:
    'Sie tauchen im weiteren Verlauf des Stockwerks aus der Distanz wieder auf — noch immer glanzvoll, noch immer eingespielt, bei, wie dir zufällig auffällt, ihrem vierten Zustellbett.',
  [roomExplanationKey('the-unicorn', 0)]:
    'Die Forschung zum „Paarprivileg“ in nichtmonogamen Konstellationen unterscheidet strukturell zwischen einer Hierarchie, die von vornherein offengelegt wird, und einer, die erst entdeckt wird — dem Unterschied zwischen einer ehrlichen Landkarte und einer Falltür. Dritte tragen in „Unicorn“-Konstellationen ein reales, gut dokumentiertes strukturelles Risiko: Regeln, geschrieben bevor sie überhaupt ankommen, einseitig durchgesetzt, änderbar nur durch das Paar allein. Nichts davon heißt, dass gleichberechtigte Dreierkonstellationen unmöglich sind — die Forschung ist fair gegenüber echter, ausgehandelter Nichtmonogamie —, es heißt nur, dass „gleichberechtigt“ eine Behauptung ist, die eine Überprüfung überstehen muss, nicht nur ausgesprochen werden.',
  [roomNoteTitleKey('the-unicorn')]: 'Das Zustellbett',
  [roomNoteThinkersKey('the-unicorn')]: 'CNM-Forschung zu Unicorn-Dynamiken (Moors, Conley et al.)',
  [roomNoteBodyKey('the-unicorn')]:
    'Die Forschung zur „Unicorn-Jagd“ — etablierte Paare, die eine gemeinsame dritte Person suchen — dokumentiert ein durchgängiges Muster: Regeln, geschrieben bevor die dritte Person überhaupt ankommt, eine Hierarchie, die als Formalität mitgeteilt statt als echte Struktur ausgehandelt wird, und eine Schieflage bei den Kosten des Ausstiegs (das Paar bleibt ein Paar; die dritte Person geht allein). Die nützliche Unterscheidung der Forschung liegt zwischen Paaren, die sich *öffnen* — die sich wirklich umstrukturieren, um eine gleichberechtigte weitere Stimme aufzunehmen —, und Paaren, die *erwerben* — die einen Menschen zu einer unveränderten Struktur hinzufügen. **Gleichberechtigung auf dem Papier und Hierarchie in der Küche sind kein Widerspruch. So funktioniert das Muster meistens.** Es gibt auch wirklich gleichberechtigte Dreierkonstellationen, und sie sind dokumentiert; das Erkennungszeichen ist, ob die dritte Person die Regeln mitschreiben darf — oder ihnen nur zustimmen.',
});

register(roomChoiceOutcomeKey('the-unicorn', 'renegotiate', 1), 'v2', 'de', (s: RunState) =>
  seedSplit(s)
    ? 'Zu ihrem Verdienst — echtem, mühevoll erarbeitetem Verdienst — findet die Verhandlung tatsächlich vor deinen Augen statt, und so etwas wie eine richtige Charta entsteht. Sie ist nicht perfekt. Aber sie gehört, zum ersten Mal, wirklich auch dir.'
    : 'Die Verhandlung versandet, höflich, irgendwo zwischen „natürlich“ und jeder tatsächlichen Veränderung. Das Angebot wird nicht zurückgezogen. Es wird nur still nicht mehr erneuert — du erfährst, was „gleichberechtigt“ bedeutet hat, indem du beobachtest, was passiert, als du es schriftlich verlangt hast.',
);

// ---------- Just Friends ----------
registerAll('v2', 'de', {
  [roomBeatKey('just-friends', 0, 0)]:
    'Alena. Lernpartnerin, gemeinsame Insiderwitze, die Person, der du Dinge zuerst erzählst. Jules bekommt die Zusammenfassung deiner Woche; Alena bekommt den Entwurf, ungekürzt, während es passiert.',
  [roomBeatKey('just-friends', 0, 1)]:
    'Es ist nichts passiert. Das Zimmer verlangt trotzdem, dass du dieses „nichts“ auflistest: der Platz, den du ohne nachzudenken freihältst, die Kaffeebestellung, die du auswendig kennst, die Gutenacht-Nachrichten um 23:40 Uhr, die längst tragend geworden sind.',
  [roomBeatKey('just-friends', 0, 2)]:
    'Der Vergleich, den das Zimmer erzwingt, nebeneinander gestellt: was Jules gerade über deine Woche weiß — und was Alena schon zur Mittagszeit wusste.',
  [roomBeatKey('just-friends', 0, 3)]:
    'Die Beweise auf deinem Handy, durchgesehen wie eine Akte — Zeitstempel als ihre eigene, leise Form von Angst, nichts davon eindeutig, und trotzdem wirkt alles irgendwie belastend.',
  [roomBeatKey('just-friends', 0, 4)]: '„Wir sind nur Freunde“, sagst du, zu niemand Bestimmtem, und das Zimmer fragt — leise, präzise —, wem du das eigentlich gesagt hast.',
  [roomBeatKey('just-friends', 0, 5)]: 'Portier: Die Architektur lügt nie. Fragen Sie nur: Wohin zeigen die Fenster?',
  [roomChoiceTextKey('just-friends', 'open-window')]: 'Erzähl Jules von Alena — alles, die Rangfolge eingeschlossen.',
  [roomChoiceHintKey('just-friends', 'open-window')]: 'Das Licht ganz hereinlassen',
  [roomChoiceOutcomeKey('just-friends', 'open-window', 0)]:
    'Das Gespräch ist furchtbar, und kurz, und die Mauer fällt Ziegel für hörbaren Ziegel, während ihr beide noch dasitzt.',
  [roomChoiceOutcomeKey('just-friends', 'open-window', 1)]:
    'Alena, der nichts gesagt wird, bemerkt innerhalb einer Woche alles. Eine echte Freundschaft findet zu ihrer richtigen Größe zurück, zu einem echten, benannten Preis.',
  [roomChoiceTextKey('just-friends', 'nothing-to-tell')]: 'Behalte sie im Ordner „nichts zu erzählen“.',
  [roomChoiceHintKey('just-friends', 'nothing-to-tell')]: 'Die Kategorie schützen, nicht nur das Geheimnis',
  [roomChoiceOutcomeKey('just-friends', 'nothing-to-tell', 0)]: 'Der Ordner wird dicker, ein Abend nach dem anderen, jeder für sich genommen gut zu rechtfertigen.',
  [roomChoiceOutcomeKey('just-friends', 'nothing-to-tell', 1)]:
    'Das Zimmer endet mit Glass’ Rechnung, sichtbar gemacht: Das Fenster zeigt jetzt zu Alena. Die Mauer zeigt jetzt zu Jules. Niemand hat das an irgendeinem einzelnen Tag entschieden — genau so passiert es.',
  [roomChoiceTextKey('just-friends', 'test-the-evening')]: 'Inszenier einen Abend mit Alena, der so oder so ausgehen könnte.',
  [roomChoiceHintKey('just-friends', 'test-the-evening')]: 'Mit Absicht abstreitbar halten',
  [roomChoiceOutcomeKey('just-friends', 'test-the-evening', 0)]: 'Der Abend, in Echtzeit, unverblümt — das Zimmer beschönigt nicht, was er ist, nur wo er endet.',
  [roomChoiceOutcomeKey('just-friends', 'test-the-evening', 1)]:
    'Die Schwelle kommt, und das Zimmer schneidet, während deine Hand auf der Türklinke liegt. Was passiert ist, bleibt gespeichert, die Zweideutigkeit intakt, damit das letzte Tor es später vorliest.',
  [roomChoiceTextKey('just-friends', 'name-it-set-boundary')]: 'Sag es Alena, laut, und zieh die Grenze selbst.',
  [roomChoiceHintKey('just-friends', 'name-it-set-boundary')]: 'Den wahren Satz der Person sagen, um die es geht',
  [roomChoiceOutcomeKey('just-friends', 'name-it-set-boundary', 0)]:
    'Die schwerste Version: „das hier wird zu dem, was Leute ‚nichts‘ nennen“ — ihr ins Gesicht gesagt, nicht weggeprobt.',
  [roomChoiceOutcomeKey('just-friends', 'name-it-set-boundary', 1)]:
    'Ihre Antwort ist auch ehrlich, und sie kostet etwas. Weniger Kaffees zusammen. Besserer Schlaf. Eine Freundschaft, gerettet in ihrer richtigen Größe.',
  [roomExplanationKey('just-friends', 0)]:
    'Die Checkliste für „emotionale Affären“, die Forscher:innen tatsächlich verwenden, dreht sich weniger um ein einzelnes Ereignis als um ein Muster: umgeleitete Energie, Geheimhaltung (und sei sie noch so mild), und eine private Rangfolge, wer was zuerst erfährt. „Wir haben uns nie berührt“ beantwortet eine Frage, die im Zimmer niemand tatsächlich gestellt hat. Das Bild von Fenstern und Mauern lohnt es sich, weit über dieses Hotel hinauszutragen — Intimität ist Architektur: Welche Beziehung auch immer die Offenheit bekommt, hat das Fenster, und welche die Aussparungen bekommt, hat die Mauer, ganz unabhängig davon, welche der beiden du die „echte“ nennen würdest.',
  [roomNoteTitleKey('just-friends')]: 'Mauern und Fenster',
  [roomNoteThinkersKey('just-friends')]: 'Shirley Glass, Not Just Friends (2003)',
  [roomNoteBodyKey('just-friends')]:
    'Glass’ zentraler Befund aus Jahrzehnten klinischer Arbeit ist, dass die meisten Affären — emotionale wie andere — zwischen Menschen beginnen, die sich selbst „nur befreundet“ genannt hätten, bis zu dem Moment, in dem das nicht mehr stimmte, ohne den Übergang je bewusst geplant zu haben. **Der wirksame Bestandteil ist die Geheimhaltung, nicht die Anziehung; Anziehung ist häufig und meist harmlos, Geheimhaltung ist das, was sie verwandelt.** Ihr Architektur-Bild hat die konkrete Forschung, aus der es stammt, überdauert, weil es einfach zutrifft: Eine Beziehung hat ein Fenster (das, was offen mit deinem Partner geteilt wird) und, unweigerlich, eine Mauer (das, was nicht geteilt wird) — und die beiden anderen Menschen in deinem Leben stehen immer auf der einen oder anderen Seite, ob du sie dorthin stellen wolltest oder nicht. Das Fenster und die Mauer wiegen genau gleich viel. Nur der Platz unterscheidet sich.',

  // ---------- The Ex ----------
});
register(roomBeatKey('the-ex', 0, 0), 'v2', 'de', (s: RunState) =>
  s.flags.includes('set-the-trap')
    ? 'Sara — diese Sara, die du vor vier Jahren und einem ganzen Leben in eine Falle gelockt hast, um eine Antwort zu bekommen — schreibt um 23:51: „Ich hab einen Fehler gemacht.“ Du weißt noch genau, was es gekostet hat, das herauszufinden.'
    : 'Sara — die Sara vom Erdgeschoss, jetzt vier Jahre her — schreibt um 23:51: „Ich hab einen Fehler gemacht.“',
);
registerAll('v2', 'de', {
  [roomBeatKey('the-ex', 0, 1)]:
    'Du bist glücklich mit Jules. Größtenteils. Das Wort „größtenteils“ kommt von ganz allein, ungebeten, und du lässt es stehen, statt es zu streichen.',
  [roomBeatKey('the-ex', 0, 2)]:
    'Das Archiv öffnet sich unwillkürlich — jede Erinnerung an Sara golden ausgeleuchtet, geschnitten von einem Kurator, der offenbar vier Jahre damit verbracht hat, still die schlimmsten Szenen zu löschen.',
  [roomBeatKey('the-ex', 0, 3)]:
    'Das Zimmer stellt die fehlenden Szenen wieder her, eine nach der anderen, so wie eine Chattam-Akte neu aufgerollt wird: die Streits, die Schweigen, die eigentlichen Gründe fürs Ende — vorgeführt, nicht zusammengefasst.',
  [roomBeatKey('the-ex', 0, 4)]: 'Nebenan lacht Jules über etwas im Fernsehen, ohne die leiseste Ahnung, dass diese Nachricht schon existiert.',
  [roomBeatKey('the-ex', 0, 5)]: 'Portier: Die Vergangenheit schreibt die besten Werbetexte im ganzen Haus. Sie erwähnt nie, warum sie leer steht.',
  [roomChoiceTextKey('the-ex', 'reread-everything')]: 'Öffne das ganze Archiv. Zwei Uhr nachts.',
  [roomChoiceHintKey('the-ex', 'reread-everything')]: 'Dich ganz hineinfallen lassen',
  [roomChoiceOutcomeKey('the-ex', 'reread-everything', 0)]:
    'Der Sog, ehrlich geschildert: nichts abgeschickt, alles aufgewühlt, vier Jahre kuratiertes goldenes Licht auf voller Helligkeit noch einmal abgespielt.',
  [roomChoiceOutcomeKey('the-ex', 'reread-everything', 1)]:
    'Es folgen drei Tage, an denen du Jules still und unfair mit jemandem vergleichst, der — wie dir das Zimmer gerade im Detail gezeigt hat — nie wirklich existiert hat.',
  [roomChoiceTextKey('the-ex', 'answer-her')]: 'Antworte. Nur um zu reden.',
  [roomChoiceHintKey('the-ex', 'answer-her')]: 'Eine Tür wieder öffnen, für die du vier Jahre Bewegungsgedächtnis hast',
  [roomChoiceOutcomeKey('the-ex', 'answer-her', 0)]:
    '„Nur reden“ mit jemandem, für den du vier Jahre Bewegungsgedächtnis hast, ist, wie sich zeigt, keine neutrale Handlung.',
  [roomChoiceOutcomeKey('the-ex', 'answer-her', 1)]:
    'Das Zimmer beendet den Austausch absichtlich mitten in der Wärme, Cursor blinkend — das Gespräch ist noch kein Verrat an irgendetwas, und auch noch nicht nichts.',
  [roomChoiceTextKey('the-ex', 'block')]: 'Blockieren. Beide Apps. Heute Nacht.',
  [roomChoiceHintKey('the-ex', 'block')]: 'Eine Tür schließen, die du schon einmal geschlossen hast',
  [roomChoiceOutcomeKey('the-ex', 'block', 0)]: 'Sauber, kalt, und — darauf besteht das Zimmer — wirklich betrauert, nicht nur effizient.',
  [roomChoiceOutcomeKey('the-ex', 'block', 1)]:
    'Blockieren erweist sich als eine Tür, die du auch auf eine Version deiner selbst zuschlägst, nicht nur auf Sara. Der Schutz und der Verlust kommen zusammen an.',
  [roomChoiceTextKey('the-ex', 'tell-jules')]: 'Gib Jules das Handy: „Sara hat geschrieben.“',
  [roomChoiceHintKey('the-ex', 'tell-jules')]: 'Das Fenster in die richtige Richtung zeigen lassen',
  [roomChoiceOutcomeKey('the-ex', 'tell-jules', 0)]:
    'Das Fenster statt der Mauer. Was auch immer Jules’ Angst ist, sie wird an der frischen Luft behandelt, nicht allein in deinem Kopf.',
  [roomChoiceOutcomeKey('the-ex', 'tell-jules', 1)]:
    'Welche Antwort auch immer am Ende verschickt wird, falls überhaupt, wird von zwei Menschen gemeinsam entworfen — genau das, was vier Jahre Archiv-Kuratierung nie konnten.',
  [roomExplanationKey('the-ex', 0)]:
    'Alte Flammen melden sich aus einer echten Mischung von Gründen wieder — ein Rückfall der eigenen Limerenz, Einsamkeit, eine echte Veränderung auf ihrer Seite —, und alle drei treffen oft genug zu, dass keine einzelne Erklärung einfach angenommen werden sollte. Gut belegt ist die idealisierte Erinnerung: Das Gehirn schneidet schmerzhafte Details aus positiven Beziehungserinnerungen zuverlässig schneller heraus, als es die guten herausschneidet — eine Verzerrung, die manchmal „rosarote Rückschau“ genannt wird. Die nützliche diagnostische Frage lautet nicht „fühle ich noch etwas“ — sie lautet „vermisse ich sie, konkret, oder vermisse ich, zwanzig zu sein“.',
  [roomNoteTitleKey('the-ex')]: 'Der Kurator',
  [roomNoteThinkersKey('the-ex')]: 'Fisher · Forschung zu Erinnerungsverzerrungen',
  [roomNoteBodyKey('the-ex')]:
    'Helen Fishers Arbeit zur Neurochemie der Liebe fand, dass der Belohnungskreislauf, den ein alter Partner aktiviert, bei erneutem Kontakt wieder anspringen kann — eine Tatsache über Gehirnchemie, kein Urteil über die Beziehung. Getrennt davon haben Gedächtnisforscher wiederholt die rosarote Rückschau dokumentiert — positive Erfahrungen werden mit der Zeit wohlwollender erinnert, als sie im Moment bewertet wurden, während negative Details am schnellsten verblassen. **Das Museum ist schön, weil jemand, ohne es je bewusst zu beschließen, die Lagerräume abgeschlossen hat.** Was einen erfolgreichen Neuanfang mit einer Ex tatsächlich vorhersagt, ist eng und konkret — echte, geprüfte Gründe, warum die Beziehung endete, die sich jetzt wirklich verändert haben — eine viel kleinere Kategorie als „ich denke noch an sie“.',

  // ---------- The Confession ----------
  [roomBeatKey('the-confession', 0, 0)]:
    'Der Flug nach Hause, aufgelistet, so wie das Zimmer inzwischen alles auflistet: die Bordkarte, der Fensterplatz, die Proben eines Satzes, den du noch nicht gesagt hast.',
  [roomBeatKey('the-confession', 0, 1)]:
    'Die Adjektive stellen sich von selbst in Reihe auf, ungebeten: einmal. Betrunken. Auf Reisen. Bedeutungslos. Jedes für sich wahr, und alle zusammen decken sie nicht ganz ab, was auf der Konferenz passiert ist.',
  [roomBeatKey('the-confession', 0, 2)]:
    'Jules in der Ankunftshalle — unbefangen, froh, dich zu sehen, eine ganz gewöhnliche Freude, die das Zimmer absichtlich mit vollem Gewicht landen lässt, weil es gleich alles Folgende schwerer machen wird.',
  [roomBeatKey('the-confession', 0, 3)]:
    'Der Stein: wo er wirklich sitzt (knapp unter dem Brustbein), was er speziell um drei Uhr nachts wiegt (mehr als zu jeder anderen Stunde).',
  [roomBeatKey('the-confession', 0, 4)]:
    'Beide Argumente, in voller Stärke vorgebracht, keins von beiden abgetan: Beichten als Jules’ Recht auf die Wahrheit über das eigene Leben, gegen Beichten als deine eigene Erleichterung, abgewälzt auf jemanden, der nicht um dieses Gewicht gebeten hat.',
  [roomBeatKey('the-confession', 0, 5)]:
    'Portier: Gäste fragen, welche Entscheidung ehrlich ist. Die Rezeption konnte immer nur beantworten, welche schwerer wiegt, und für wen.',
  [roomChoiceTextKey('the-confession', 'confess')]: 'Erzähl Jules alles, jetzt, ganz.',
  [roomChoiceHintKey('the-confession', 'confess')]: 'Den ganzen Stein auf einmal ablegen',
  [roomChoiceOutcomeKey('the-confession', 'confess', 0)]:
    'Das Gespräch, in Nahaufnahme: eine Flutwelle, eine Stunde voller Fragen ohne gute Antworten, ihr beide auf dem Sofa, bis der Himmel die Farbe wechselt.',
  [roomChoiceOutcomeKey('the-confession', 'confess', 1)]:
    'Kein Urteil über die Beziehung — das ist Wetter für ein anderes Stockwerk. Der Stein wandert von deiner Brust in den Raum zwischen euch, was gleichzeitig besser ist und heute Nacht überhaupt nicht besser.',
  [roomChoiceTextKey('the-confession', 'carry-it')]: 'Nie erzählen. Es für immer allein tragen.',
  [roomChoiceHintKey('the-confession', 'carry-it')]: 'Die Last übernehmen, damit niemand sonst muss',
  [roomChoiceOutcomeKey('the-confession', 'carry-it', 0)]:
    'Das stärkste Argument, das dieses Spiel fürs Schweigen macht: Jules vor einem Schmerz zu schützen, der nur dem eigenen Gewissen dienen würde, nicht Jules’ Wohlergehen.',
  [roomChoiceOutcomeKey('the-confession', 'carry-it', 1)]:
    'Der lebenslange Preis, ehrlich geschildert: ein Zimmer in dir, neben dem Jules jahrelang leben wird, ohne je hineingelassen zu werden.',
  [roomChoiceTextKey('the-confession', 'trickle')]: 'Eine abgemilderte Version beichten.',
  [roomChoiceHintKey('the-confession', 'trickle')]: 'Jules einen Teil der Wahrheit geben',
  [roomChoiceOutcomeKey('the-confession', 'trickle', 0)]:
    'Das Tröpfeln beginnt heute Nacht, und das Zimmer zeigt dir genau, wohin es führt: drei künftige Korrekturen, jede teurer, als die ganze Wahrheit auf einmal, heute Nacht, gekostet hätte.',
  [roomChoiceTextKey('the-confession', 'let-it-surface')]: '„Es kommt schon von selbst raus“ — sprich: nie, sprich: dann, wenn es am schlimmsten ist.',
  [roomChoiceHintKey('the-confession', 'let-it-surface')]: 'Die Entscheidung dem Zufall überlassen',
  [roomChoiceOutcomeKey('the-confession', 'let-it-surface', 0)]:
    'Das Zimmer benennt die Strategie ehrlich, laut: Das ist, die Entscheidung an den Zufall auszulagern, damit sich alles, was passiert, wie Wetter anfühlt statt wie eine Entscheidung, die du getroffen hast.',
  [roomChoiceOutcomeKey('the-confession', 'let-it-surface', 1)]:
    'Irgendwo weiter unten auf diesem Stockwerk könnte sich ein Handy, das im falschen Moment aufleuchtet, als deins herausstellen.',
  [roomExplanationKey('the-confession', 0)]:
    'Die Debatte darüber, ob man eine Affäre beichten sollte, ist unter Forschenden und Klinikern wirklich ungeklärt, und die stärksten Argumente auf beiden Seiten verdienen es, in voller Stärke gehört zu werden: Offenlegung als Respekt vor dem Recht eines Partners auf die Wahrheit, auf der das eigene Leben tatsächlich aufbaut, gegen Beichten als Schuld, abgewälzt auf jemanden, der nie gebeten hat, sie zu tragen. Umfragen unter betrogenen Partnern neigen dazu, es wissen zu wollen, aber der Befund ist weich, selbstselektiert und sollte nicht als Urteil behandelt werden. Gut belegt ist Esther Perels Beobachtung, dass, wer das Geheimnis hütet, eine Art Macht über die Beziehung hält, der die andere Person nie zugestimmt hat.',
  [roomNoteTitleKey('the-confession')]: 'Wessen Erleichterung ist es',
  [roomNoteThinkersKey('the-confession')]: 'die Debatte um das egoistische Geständnis · Esther Perel (2017)',
  [roomNoteBodyKey('the-confession')]:
    'Beide Denkrichtungen verdienen hier ein ehrliches Gehör. Die eine Richtung aus Forschung und klinischer Meinung besagt, dass Partnern die Wahrheit über das Leben zusteht, das sie tatsächlich führen, Punkt — dass sie vorzuenthalten, wie gut gemeint auch immer, eine Entscheidung über jemanden ist, die ohne dessen Zustimmung getroffen wird. Die andere besagt, dass ein Geständnis als Schuldübertragung funktionieren kann: Erleichterung für den Beichtenden, erkauft mit Schmerz für jemanden, der nichts getan hat, um dieses Geschäft zu verdienen. Perels Sichtweise durchschneidet beides: **„Wer das Geheimnis hütet, hält die Macht“ — und dieses Machtungleichgewicht besteht, ob das Geheimnis je ausgesprochen wird oder nicht.** Dieses Spiel löst die Debatte nicht auf, und sagt das auch so deutlich: Der Stein ist so oder so echt. Die einzige wirkliche Entscheidung ist die Tasche.',

  // ---------- The Other Side of the Door ----------
  [roomBeatKey('the-other-side-of-the-door', 0, 0)]:
    'Viktor ist verheiratet. Du wusstest es spätestens beim dritten Kaffee, und bist trotzdem zum vierten geblieben. Jetzt seit acht Monaten: Hotelnachmittage, nur wochentags, sein Handy immer mit dem Display nach unten auf dem Nachttisch.',
  [roomBeatKey('the-other-side-of-the-door', 0, 1)]:
    'Der Nachmittag selbst, offen und warm — das Zimmer tut nicht so, als wäre das hohl oder rein transaktional. Was auch immer es sonst ist, es ist auch echt, für euch beide, in dem Zimmer, in dem es passiert.',
  [roomBeatKey('the-other-side-of-the-door', 0, 2)]:
    'Die Regeln, die du gelernt hast, ohne dass sie dir je beigebracht wurden: nie nach sechs anrufen. Kein Parfüm, das über den Aufzug hinaus reicht. Ein ganzer ungeschriebener Lehrplan, aufgesogen, indem man ihn lebt.',
  [roomBeatKey('the-other-side-of-the-door', 0, 3)]:
    '„Ich hab keine Gelübde abgelegt“, sagst du, und das Zimmer bittet dich, diesen Satz wirklich zu prüfen, statt ihn nur zu wiederholen — er ist wahr, und er hat noch nie, ganz allein, irgendetwas geklärt.',
  [roomBeatKey('the-other-side-of-the-door', 0, 4)]:
    'Die Wand. Ihre Stimme, hindurch — sie bestellt beim Zimmerservice, lacht über etwas im Fernsehen. Nie gesehen. Ständig hörbar. Das Zimmer hält den Moment einen Atemzug länger, als angenehm ist.',
  [roomBeatKey('the-other-side-of-the-door', 0, 5)]: 'Portier: Die Rezeption führt drei Gäste für dieses Zimmer. Schlüssel gibt es immer nur für zwei.',
  [roomChoiceTextKey('the-other-side-of-the-door', 'continue')]: 'Behalte die Nachmittage. Behalte den Satz.',
  [roomChoiceHintKey('the-other-side-of-the-door', 'continue')]: 'Es still zu einem Teil deines Lebens werden lassen',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'continue', 0)]:
    'Ehrlichkeit im Zeitraffer: Jahreszeiten vergehen in vier Momenten, die Abmachung verhärtet sich, unbemerkt, zur tatsächlichen Architektur deines Lebens.',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'continue', 1)]:
    'Das letzte Bild des Zimmers: dein eigenes Handy, jetzt auch mit dem Display nach unten, aus Gewohnheit, obwohl — das bemerkst du, wie aus der Ferne — niemand eigentlich hinschaut.',
  [roomChoiceTextKey('the-other-side-of-the-door', 'end-it')]: 'Beende es, ohne ihn vor die Wahl zu stellen.',
  [roomChoiceHintKey('the-other-side-of-the-door', 'end-it')]: 'Sauber gehen, zu deinen eigenen Bedingungen',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'end-it', 0)]:
    'Ein Ende, das niemand miterlebt und für das dir niemand danken wird — entrechtete Trauer, vom Zimmer klar benannt, weil sonst niemand da ist, der sie benennt.',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'end-it', 1)]: 'Der sauberste Ausgang, den es auf diesem Stockwerk gibt. Trotzdem, bemerkenswerterweise, nicht sauber.',
  [roomChoiceTextKey('the-other-side-of-the-door', 'tell-her')]: 'Sag es seiner Frau.',
  [roomChoiceHintKey('the-other-side-of-the-door', 'tell-her')]: 'Ihr die Wahl geben, die du ihr vorenthalten hast',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'tell-her', 0)]: 'Die Detonation, ehrlich zwiespältig geschildert: Sie hat die Wahrheit verdient, ganz eindeutig.',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'tell-her', 1)]:
    'Die Wahrheit kommt auch in Form einer Waffe an, und sie trägt deine Fingerabdrücke. Das Zimmer weigert sich, dein Motiv für dich zu bewerten — es fragt dich nur einmal, leise, was es wirklich war.',
  [roomChoiceTextKey('the-other-side-of-the-door', 'demand-choice')]: '„Sie oder ich. Bis Freitag.“',
  [roomChoiceHintKey('the-other-side-of-the-door', 'demand-choice')]: 'Die Entscheidung erzwingen, die nie deine war, um sie zu erzwingen',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'demand-choice', 1)]:
    'Es lehrt dich in jedem Fall dieselbe Lektion: Was du ihm bedeutet hast, lag am Ende immer allein bei ihm.',
  [roomExplanationKey('the-other-side-of-the-door', 0)]:
    'Die ehrliche ethische Landkarte hat hier mehrere unterschiedliche Linien, und das Zimmer bittet dich, sie alle gleichzeitig im Blick zu behalten: Gelübde binden die Person, die sie abgelegt hat, nicht die, die es nicht getan hat — aber wissentlich den Betrug eines anderen zu ermöglichen, ist ein eigener Posten, nicht automatisch durch die erste Tatsache entschuldigt. Forschung zum „Partner-Wildern“ untersucht genau dieses Dreieck und findet, dass auch bei der dritten Partei echte Kosten anfallen — die Isolation der Heimlichkeit, Enden ohne öffentliche Trauer, niemand, den man anrufen kann. Macht und Information sind in solchen Konstellationen selten gleich verteilt: Eine Person riskiert meist eine Ehe; die andere riskiert meist etwas weniger Sichtbares und, wie die Forschung nahelegt, nicht weniger Reales.',
  [roomNoteTitleKey('the-other-side-of-the-door')]: 'Das Kontobuch der Dritten',
  [roomNoteThinkersKey('the-other-side-of-the-door')]: 'Forschung zum Partner-Wildern · entrechtete Trauer',
  [roomNoteBodyKey('the-other-side-of-the-door')]:
    'Die Forschung zum Partner-Wildern untersucht zunehmend auch die Erfahrung der „wildernden“ Person selbst, nicht nur die des Paares, und die Befunde erschweren jede einfache Bösewicht-Erzählung: echt investierte Zeit, echte Isolation durch Heimlichkeit, und Enden ohne öffentliche Anerkennung zum Trauern — ein Muster, das Forschende entrechtete Trauer nennen, Verlust, den niemand anerkennen darf, weil die Beziehung selbst nie anerkannt werden durfte. **Verantwortung ist hier keine Alles-oder-nichts-Sache.** Gelübde binden diejenige oder denjenigen, der sie abgelegt hat. Wissentlich an ihrem Bruch mitzuwirken, ist eine eigene, echte Entscheidung mit eigenem Gewicht. Die Wand ist dünn. Das war nie ein Geheimnis, für niemanden auf beiden Seiten davon.',

  // ---------- The Scoreboard (gate) ----------
  [roomBeatKey('the-scoreboard', 0, 0)]:
    'Du hast Jules nach der Zahl gefragt. Jules hat die Wahrheit gesagt. Jetzt wohnt die Zahl in deiner Brust und rechnet nachts: Namen, die sie nicht kennt, Hotelzimmer, die sie sich selbst einrichtet, Vergleiche, die sie inszeniert, ohne gefragt zu werden.',
});
register(roomBeatKey('the-scoreboard', 0, 1), 'v2', 'de', (s: RunState) =>
  s.flags.includes('tested-almost') || s.flags.includes('ran-the-test')
    ? 'Das Muster der eindringenden Gedanken kennst du inzwischen — auch das Zimmer erkennt es und sagt es: Das ist dieselbe Rechnung, die dich schon einmal wachgehalten hat, nur mit einer anderen Zahl im Gewand.'
    : 'Der Einbruch kommt nach einem Zeitplan, den du nie festgelegt hast: ein Name, eine Vermutung, eine Szene, die dein Kopf ungefragt baut und dich dann zwingt, sie anzusehen.',
);
register(roomChoiceOutcomeKey('the-other-side-of-the-door', 'demand-choice', 0), 'v2', 'de', (s: RunState) =>
  seedSplit(s)
    ? 'Freitag kommt. Viktor entscheidet sich für dich — und das Zimmer lässt dich in Echtzeit spüren, was genau diese Entscheidung über einen Mann verrät, der zwei Leben so mühelos ablegen konnte.'
    : 'Freitag kommt. Viktor entscheidet sich nicht für dich — und das Zimmer lässt dich in Echtzeit spüren, was genau diese Entscheidung über einen Mann verrät, der zwei Leben so mühelos ablegen konnte.',
);
registerAll('v2', 'de', {
  [roomBeatKey('the-scoreboard', 0, 2)]:
    'Die Lobby ordnet sich neu, Stühle werden zu Reihen, die Rezeption zur Zeugenbank — eine Anhörung ist einberufen. Der Portier nimmt die Schreibtischlampe in die Hand wie einen Richterhammer, der eigentlich nie einer war.',
  [roomBeatKey('the-scoreboard', 0, 3)]:
    'Der Angeklagte, ins Protokoll aufgenommen: alles, was Jules mit irgendjemandem getan hat, bevor ihr beide euch überhaupt kennengelernt habt.',
  [roomBeatKey('the-scoreboard', 0, 4)]:
    'Deine eigene Zahl, als Zeugin gegen den Angeklagten vereidigt, ohne je gefragt worden zu sein, ob sie überhaupt aussagen wollte.',
  [roomBeatKey('the-scoreboard', 0, 5)]:
    'Portier: Das Gericht stellt fest, dass der Angeklagte vor der Klägerin da war. Das Gericht hat das in jeder einzelnen Sitzung festgestellt, die es je abgehalten hat.',
  [roomChoiceTextKey('the-scoreboard', 'prosecute')]: 'Verhöre die Vergangenheit im Kreuzverhör: Daten, Zusammenhänge, Details.',
  [roomChoiceHintKey('the-scoreboard', 'prosecute')]: 'Den vollständigen Bericht verlangen, wieder',
  [roomChoiceOutcomeKey('the-scoreboard', 'prosecute', 0)]: 'Jede Frage wird beantwortet. Jede Antwort kostet genau eine Nacht Schlaf.',
  [roomChoiceOutcomeKey('the-scoreboard', 'prosecute', 1)]:
    'Das Urteil, wenn es kommt, spricht frei — die Vergangenheit hat kein Verbrechen begangen —, und die Kosten der Anklage sind, bemerkenswerterweise, nicht erstattungsfähig. Jules hat von Anfang bis Ende zugesehen, wie sehr du das gebraucht hast.',
  [roomChoiceTextKey('the-scoreboard', 'dismiss-with-prejudice')]: 'Weise den Fall ab. Und mein es ernst.',
  [roomChoiceHintKey('the-scoreboard', 'dismiss-with-prejudice')]: 'Die Zahl aufhören lassen, ein Beweismittel zu sein',
  [roomChoiceOutcomeKey('the-scoreboard', 'dismiss-with-prejudice', 0)]:
    'Keine Unterdrückung — eine Abweisung mit laut vorgelesenen Gründen: Die Person, der die Zahl gehört, existiert nicht mehr; die Person, die existiert, hat sich für dich entschieden.',
  [roomChoiceOutcomeKey('the-scoreboard', 'dismiss-with-prejudice', 1)]:
    'Die eindringenden Gedanken hören nicht auf Befehl auf, und das Zimmer ist ehrlich darin, dass sie das nicht tun. Aber sie hören nach und nach auf, herbeigerufen zu werden.',
  [roomChoiceTextKey('the-scoreboard', 'testify-against-yourself')]: 'Tritt selbst wegen deiner eigenen Doppelmoral in den Zeugenstand.',
  [roomChoiceHintKey('the-scoreboard', 'testify-against-yourself')]: 'Auch deine eigene Zahl ins Protokoll aufnehmen',
  [roomChoiceOutcomeKey('the-scoreboard', 'testify-against-yourself', 0)]:
    'Der mutigste Zug der ganzen Anhörung: deine Zahl und Jules’ Zahl, nebeneinander vorgelesen, im selben Raum, in derselben Lautstärke.',
  [roomChoiceOutcomeKey('the-scoreboard', 'testify-against-yourself', 1)]:
    'Die Asymmetrie des Gefühls — dass Jules’ Zahl dich mehr beunruhigt als deine eigene dich beunruhigt — wird genau so benannt, wie sie ist. Das Gericht vertagt sich ohne Urteil, weil es in diesem Fall nie wirklich um den Angeklagten ging.',
  [roomChoiceTextKey('the-scoreboard', 'ask-what-verdict-frees')]: 'Frag das Gericht, welches Urteil dich wirklich befreien würde.',
  [roomChoiceHintKey('the-scoreboard', 'ask-what-verdict-frees')]: 'Die schwerere Frage stellen',
  [roomChoiceOutcomeKey('the-scoreboard', 'ask-what-verdict-frees', 0)]:
    'Stille. Dann der Portier, sanft: „Keins. Es gibt keine Zahl, in keiner Richtung, die je einen Gast von der eigenen Vorstellungskraft freigesprochen hätte.“',
  [roomChoiceOutcomeKey('the-scoreboard', 'ask-what-verdict-frees', 1)]: 'Laut ausgesprochen, löst es etwas. Der Anhörungssaal ist wieder eine Lobby, die Stühle zurück, wo sie hingehören.',
  [roomExplanationKey('the-scoreboard', 0)]:
    'Rückwirkende Eifersucht — Leid über die Vergangenheit eines Partners statt über sein aktuelles Verhalten — ist ein anerkanntes Muster, und in ihrer schwersten Form zeigt sie Merkmale, die sich klinisch mit Zwangsstörungen überschneiden: Suche nach Rückversicherung, Grabenwühlen in Details, und gedankliche Zwänge, die die Angst für Minuten lindern und sie bis zum Abend wieder auffüllen. Forschung zum sexuellen Doppelstandard findet ihn still am Werk, sogar bei Menschen, die ihn als ausgesprochene Überzeugung ablehnen würden — dieselbe Tatsache wird unterschiedlich verbucht, je nachdem, wessen Vergangenheit sie gehört. Was die Behandlungsliteratur tatsächlich als hilfreich findet, ist nicht mehr Information; die Suche nach Gewissheit ist der Treibstoff des Musters, und akzeptanzbasierte Ansätze schneiden deutlich besser ab als Rückversicherung.',
  [roomNoteTitleKey('the-scoreboard')]: 'Das Gericht ohne Freisprüche',
  [roomNoteThinkersKey('the-scoreboard')]: 'Forschung zu rückwirkender Eifersucht · der sexuelle Doppelstandard',
  [roomNoteBodyKey('the-scoreboard')]:
    'In ihrer schwersten Form zeigt rückwirkende Eifersucht Merkmale, die Kliniker allgemein aus zwangsstörungsähnlichen Erscheinungsbildern kennen: aufdringliche Bilder, zwanghafte Suche nach Rückversicherung, und eine Erleichterung, die nie ganz bis zum nächsten Einbruch reicht. **Die Suche nach Gewissheit ist die Nahrung des Musters, nicht seine Heilung — jede beantwortete Frage füllt den Hunger auf die nächste wieder auf.** Der sexuelle Doppelstandard zeigt sich in den Daten sogar bei Menschen, die ihn als ausgesprochenen Wert ablehnen würden: dieselbe Tatsache, anders abgelegt, je nachdem, wessen Vergangenheit sie gehört. Was laut Behandlungsliteratur tatsächlich hilft, ist akzeptanzbasierte Arbeit statt mehr Daten — zu lernen, das Nicht-Wissen auszuhalten, statt zu versuchen, es sich wegzuverhören. Jeder Gast, der diesen Anhörungssaal betritt, kommt in der Gewissheit, sein Fall sei die Ausnahme. Das Aktenregister sagt bisher etwas anderes.',
});
