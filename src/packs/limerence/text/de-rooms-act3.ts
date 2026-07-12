// German translation of LIMERENCE's Act III room prose (beats, choice
// text/hint/outcome, field notes, plain-language explanations). Registered
// under version 'v2'. Follows the structural pattern established by
// de-rooms.ts (prologue/Act I) and de-rooms-act2.ts (Act II) — see
// CLAUDE.md's "Translating content" rule: every line here was translated
// against the room's actual beats and each choice's stakes, not
// word-for-word.
//
// Sie/du decision: informal "du" throughout, continuing Act I and Act II's
// choice rather than defaulting to it unexamined. Act III's cast is adults
// 25-30 in long-established partnerships — engaged, married, cohabiting for
// years — but the narration is still the identical device used in Acts I
// and II: second-person interior address of the player-as-character inside
// their own relationship, not a narrator addressing a hotel guest from a
// respectful remove (which is what justifies ANAMNESIS's "Sie"). If
// anything, Act III argues harder for "du" than Act II did: these are
// people who have shared a bathroom cabinet, a mortgage-adjacent lease, a
// wedding date. A room that puts you in a kitchen at 2 a.m. reading your
// partner's lit-up phone, or a bathrobe conversation about a veto invoked
// on your first real love, is not a room that would plausibly address you
// with formal distance. The Porter keeps his measured, unhurried cadence
// and continues addressing the player as "du", exactly as in the prologue
// and Acts I-II.
//
// "The Porter" remains "Portier", per the established project convention —
// distinct from ANAMNESIS's own German guide-character word (see
// src/content/text/de.ts's usherBarkKey entries for the exact term being
// avoided). That word is never reused here, including in this comment;
// verified absent (grep count zero) from both this file and
// de-reflections-act3.ts.
//
// Field-note thinkers lines: proper-name citations (with years) are carried
// through unchanged (Treas · Giesen (2000), Gottman (1994), Lavner (2012),
// etc.). Descriptive (non-named) thinkers lines are translated — e.g. "CNM
// outcome literature" becomes "CNM-Ergebnisforschung", "autonomy research"
// becomes "Autonomieforschung". Community/clinical jargon without a
// settled German equivalent is kept as an established loanword rather than
// forced into an awkward calque: "Metamour" stays "Metamour" (already
// standard in German polyamory-community usage), and "compersion" is
// rendered "Kompersion" (the adapted spelling used in the same community),
// each glossed in-line exactly as the English does. Gottman's clinical
// vocabulary uses the standard German couples-therapy renderings: "the Four
// Horsemen" as "die vier Reiter", "flooding" as "Überflutung"/"überflutet",
// "repair attempt" as "Reparaturversuch", the four door labels as KRITIK /
// VERACHTUNG / RECHTFERTIGUNG / MAUERN (the last deliberately reusing
// "Mauer", already load-bearing in this project's walls-and-windows imagery
// from Act II's "just-friends"/Glass material).
//
// Dana gender-neutrality: the English source deliberately never genders
// Dana (Act III's recurring partner, "the-colleague" through
// "the-usual-room"). A small number of lines slip to "her"/"hers" for Dana
// (a the-colleague reflection's "care" line, the-second-account's
// show-dana hint, a the-therapist reflection's "duty" line) against the
// much more consistent "their"/bare-name treatment used everywhere else,
// including the load-bearing the-discovery and the-wedding-eve beats — read
// as authorial inconsistency rather than a deliberate reveal (the same call
// the Czech pass made for the same lines) and normalized to the neutral
// treatment throughout, matching the character's evident design intent.
// This file applies the exact strategy de-rooms-act2.ts documented for
// Jules:
//   - Bare proper noun in a case German marks without an article or
//     agreement suffix — dative ("Dana stand die Wahrheit zu"), genitive
//     with the bare -s an unarticled name takes ("Danas Angst", written
//     without an apostrophe per standard German orthography since the name
//     doesn't end in a sibilant) — so no der/die/sein/ihr is needed.
//   - Predicate adjectives, gender-invariant in German ("Dana ist erleichtert,
//     sichtlich gefangen, ehrlich"), used wherever English has an adjective
//     describing Dana.
//   - Passive voice ("wird gefragt", "wird zwischen zwei Menschen gefangen")
//     routes around a subject pronoun wherever English has Dana as object.
//   - "die eigene X" substitutes for a reflexive possessive without
//     gendering the referent.
//   - Where English repeats no name and German would otherwise need a
//     third-person pronoun, "Dana" is simply repeated rather than replaced
//     by er/sie/ihm/ihr.
//   - Only where a relative pronoun or possessive determiner is genuinely
//     unavoidable does this file fall back to a grammatically masculine
//     default, matching the Czech pass's and de-rooms-act2.ts's own
//     documented precedent. That fallback is rare by design.
// The same strategy applies to the-veto's Sam ("the first person you've
// loved... in years", left just as ungendered in English as Dana is,
// "a rule they never had any say in writing") — bare noun/dative
// constructions throughout, masculine fallback only where unavoidable.
// Dr. Weiss (the-therapist) is likewise never gendered in the English
// source and receives no pronoun in this file either — every reference is
// the repeated name "Dr. Weiss", which needs no article to function as a
// grammatical subject or object in German.
//
// Rowan (the-colleague) and Petra (the-metamour, the-veto) are both
// explicitly gendered female in the English source ("she was standing at
// the same door"; "a dispute that was never actually about her") and take
// ordinary German feminine pronouns/possessives throughout ("ihre Antwort",
// "es ging nie wirklich um sie"), consistent with Sara/Mira/Alena's
// treatment in Acts I-II.
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
registerAll('v2', 'de', {
  [roomBeatKey('the-colleague', 0, 0)]:
    'Der Aufzug fährt hoch. Die Stockwerkzahlen klettern wie ein Countdown, den niemand angesagt hat. Rowan ist einen halben Schritt hinter dir, lacht immer noch über etwas von der Bar unten.',
  [roomBeatKey('the-colleague', 0, 1)]:
    'Zwei Jahre gemeinsamer Abkürzungen, unwillkürlich abgespielt in den vier Sekunden, die die Türen zum Schließen brauchen: die Blicke zur Decke in Meetings, das gute Café, Sätze, die der andere beendet, bevor du selbst fertig bist.',
  [roomBeatKey('the-colleague', 0, 2)]:
    '„Noch eine, mein Zimmer hat den Balkon.“ Die Flasche, ungeöffnet, angeboten ohne Gewicht — oder mit genau dem Gewicht, das keiner von euch beiden benennt.',
  [roomBeatKey('the-colleague', 0, 3)]:
    'Die Schlüsselkarte in deiner Hand. Du könntest ihre Temperatur beschreiben. Du beschreibst sie dir gerade selbst, in Gedanken, und schon das ist eine kleine Information für sich.',
  [roomBeatKey('the-colleague', 0, 4)]:
    'Dana schläft zweihundert Kilometer entfernt. Es ist nichts passiert. Der Flur hält einen vollen Takt Stille, in dem nichts ist außer Atem.',
  [roomBeatKey('the-colleague', 0, 5)]:
    'Portier (diesmal aus einer Diensttür): „Zu Hause muss nichts falsch sein, damit eine Tür möglich wird. Das ist der bestbelegte Satz in diesem ganzen Haus.“',
  [roomChoiceTextKey('the-colleague', 'the-balcony')]: 'Noch ein Glas. Ihr Zimmer.',
  [roomChoiceHintKey('the-colleague', 'the-balcony')]: 'Der gemeinsamen Abkürzung folgen, wohin sie führt',
  [roomChoiceOutcomeKey('the-colleague', 'the-balcony', 0)]:
    'Die Schwelle, geschnitten, mit Absicht — das zufallende Türschloss ist das Letzte, was das Zimmer noch zeigt.',
  [roomChoiceOutcomeKey('the-colleague', 'the-balcony', 1)]:
    'Stattdessen das Frühstück in der Lobby, am nächsten Morgen: zwei Kollegen, die Kollegen spielen, über schlechtem Kaffee. Was über Nacht schwerer geworden ist, wird aufgelistet, ohne ein einziges ausgesprochenes Bild — und es ist schwerer.',
  [roomChoiceTextKey('the-colleague', 'walk-away')]: '„Gute Nacht, Rowan.“ Dein eigenes Zimmer. Allein.',
  [roomChoiceHintKey('the-colleague', 'walk-away')]: 'Die Anti-Klimax das ganze Ereignis sein lassen',
  [roomChoiceOutcomeKey('the-colleague', 'walk-away', 0)]:
    'Die Anti-Klimax, gewürdigt als der Erfolg, der sie tatsächlich ist. Dein Zimmer. Die Decke. Ein ungesendetes „bist du wach?“, getippt und wieder gelöscht.',
  [roomChoiceOutcomeKey('the-colleague', 'walk-away', 1)]:
    'Danas verschlafene Mailbox-Nachricht, zweimal abgespielt, aus einem Grund, den du selbst nicht laut erklären könntest. Weggehen, gezeigt als Ereignis, nicht als bloße Abwesenheit.',
  [roomChoiceTextKey('the-colleague', 'name-it-in-the-corridor')]:
    'Sag es laut, genau hier: „das hier sind Türen, und ich öffne sie nicht.“',
  [roomChoiceHintKey('the-colleague', 'name-it-in-the-corridor')]: 'Die Sache benennen, statt sie zu umschiffen',
  [roomChoiceOutcomeKey('the-colleague', 'name-it-in-the-corridor', 0)]:
    'Das Benennen verändert die gemeinsame Abkürzung für immer. Ein Teil davon stirbt an Ort und Stelle, vom Zimmer ehrlich betrauert, statt weggeredet.',
  [roomChoiceOutcomeKey('the-colleague', 'name-it-in-the-corridor', 1)]:
    'Was übrig bleibt, ist sicher zu behalten. Rowans Antwort — erst still, dann erleichtert — gibt ihr dieselbe Würde: Sie stand an derselben Tür wie du.',
  [roomChoiceTextKey('the-colleague', 'postpone')]:
    'Heute Abend nichts — aber lass die Tür im Kalender unverschlossen. „Nächsten Monat, die Berlin-Reise …“',
  [roomChoiceHintKey('the-colleague', 'postpone')]: 'Sich entscheiden, indem man sich nicht entscheidet',
  [roomChoiceOutcomeKey('the-colleague', 'postpone', 0)]:
    'Die ehrlichste unehrliche Wahl, die heute Abend zu haben ist: eine Entscheidung, getroffen durch Nicht-Entscheiden.',
  [roomChoiceOutcomeKey('the-colleague', 'postpone', 1)]:
    'Der Kalendereintrag leuchtet, leise, genauso, wie ein Handy auf einer Ablage in einem Zimmer drei Stockwerke von hier aufleuchtet. Angst, in die Zukunft verschoben, mit Zinsen.',
  [roomExplanationKey('the-colleague', 0)]:
    'Die Affären-Forschung findet durchgehend, dass Gelegenheit — Reisen, Autonomie, anhaltende Nähe — zu den stärksten strukturellen Prädiktoren zählt, oft wichtiger als die Zufriedenheit im Verhältnis selbst. Esther Perels Umdeutung fügt eine härtere Wahrheit hinzu: Affären handeln häufiger von einer Version des eigenen Ich, die man vermisst, als vom Partner zu Hause. „Wir stehen uns einfach nahe“ plus ein Hotelflur um Mitternacht ist eine andere chemische Verbindung als jede der beiden Zutaten für sich — und genau deshalb kommt Paaren, die bei Tageslicht klären, was solche Flure bedeuten, ein besseres Los zu als jenen, die es um 00:47 Uhr improvisieren.',
  [roomNoteTitleKey('the-colleague')]: 'Die Geometrie der Türen',
  [roomNoteThinkersKey('the-colleague')]: 'Treas · Giesen (2000) · Esther Perel (2017)',
  [roomNoteBodyKey('the-colleague')]:
    'Die Untreue-Forschung von Treas und Giesen fand, dass Gelegenheitsstrukturen — Nähe, Privatsphäre, Reisen — Affären etwa so stark vorhersagen wie Unzufriedenheit im Verhältnis, manchmal stärker; der Arbeitsplatz bleibt über Jahrzehnte an Daten hinweg der mit Abstand häufigste Ort, an dem Affären beginnen, einfach weil er anhaltenden, privaten, wiederholten Kontakt liefert. Perels Beitrag rahmt das „Warum“ neu: **Affären handeln oft nicht vom Partner, den man hat, sondern vom eigenen Ich, das man vermisst** — einer Version von sich selbst, die vor den Rollen existierte, vor der Routine, vor der Hypothek. Keiner der beiden Befunde entschuldigt irgendetwas; beide erklären, warum Paaren, die bei Tageslicht klären, was ein Hotelflur bedeutet, messbar besser geht als jenen, die es der Mitternacht überlassen, es zu improvisieren. Die Schlüsselkarte war warm, weil du sie gehalten hast. Merk dir, wer sie gehalten hat.',
});

// ---------- The Metamour ----------
registerAll('v2', 'de', {
  // enforce-via-dana outcome1 is a function beat — registered below via register().
  [roomBeatKey('the-metamour', 0, 0)]:
    'Du und Dana habt vor achtzehn Monaten geöffnet, ordentlich ausgehandelt — das Zimmer sagt es klar: Das ist die Version in gutem Glauben, keine Konstruktion, die dafür gebaut wurde, sie zu bestrafen.',
  [roomBeatKey('the-metamour', 0, 1)]:
    'Der Kalender, farbcodiert, liegt offen auf der Ablage: Beweisstück A. Petra — Danas andere Partnerin — kommt neuerdings unangekündigt vorbei und hat gerade zum zweiten Mal eure Jahrestagswoche umgebucht.',
  [roomBeatKey('the-metamour', 0, 2)]:
    'Petra selbst, wenn du sie triffst, ist warmherzig und wirklich sympathisch — das Zimmer besteht darauf, weil eine bequeme Bösewichtin dir hier nichts Nützliches beibringen würde.',
  [roomBeatKey('the-metamour', 0, 3)]:
    'Das Wort „Hierarchie“, das ihr drei euch vor achtzehn Monaten abgeschworen habt, schwebt über dem Kalender, ohne dass jemand es ausspricht.',
  [roomBeatKey('the-metamour', 0, 4)]: 'Deine eigene Eifersucht, ehrlich geprüft: Signal, oder Rauschen, oder — unangenehmerweise — beides zugleich.',
  [roomBeatKey('the-metamour', 0, 5)]:
    'Portier: „Suite-Konstellationen scheitern an den Nähten, nicht in der Mitte. Die Rezeption hat noch nie eine Naht repariert, die irgendjemand hätte benennen können.“',
  [roomChoiceTextKey('the-metamour', 'enforce-via-dana')]: 'Trag es zu Dana: „deine andere Beziehung, deine Grenze zu halten.“',
  [roomChoiceHintKey('the-metamour', 'enforce-via-dana')]: 'Es über die Person leiten, deren Beziehung es ist',
  [roomChoiceOutcomeKey('the-metamour', 'enforce-via-dana', 0)]:
    'Strukturell richtig und emotional langsam. Dana ist sichtlich zwischen zwei Menschen gefangen, die beide ein vernünftiges Anliegen haben.',
  [roomChoiceTextKey('the-metamour', 'talk-to-petra')]: 'Kaffee mit Petra. Nur ihr beide. Sprich es direkt an.',
  [roomChoiceHintKey('the-metamour', 'talk-to-petra')]: 'Das Gespräch führen, das fast niemand führt',
  [roomChoiceOutcomeKey('the-metamour', 'talk-to-petra', 0)]:
    'Das Metamour-Gespräch, das so gut wie niemand tatsächlich führt: unangenehm, erwachsen und — die Forschung bestätigt es — wirksam.',
  [roomChoiceOutcomeKey('the-metamour', 'talk-to-petra', 1)]:
    'Eine Beziehung, die du daraus nicht erwartet hättest: keine Freundschaft im eigentlichen Sinn, eher so etwas wie ein Vertrag, ausgehandelt von den beiden Menschen, die ihn tatsächlich aushandeln mussten.',
  [roomChoiceTextKey('the-metamour', 'name-the-hierarchy')]: 'Ruf das Treffen ein. Zwingt euch alle drei, das Wort auszusprechen.',
  [roomChoiceHintKey('the-metamour', 'name-the-hierarchy')]: 'Sag „Hierarchie“ laut, mit Absicht',
  [roomChoiceOutcomeKey('the-metamour', 'name-the-hierarchy', 0)]:
    'Das Tabu, ausgesprochen: „Eine beschreibende Hierarchie existiert; das Gegenteil vorzutäuschen ist genau der Weg, auf dem sie normativ und unfair wird.“ Tränen, bei mehr als einem von euch.',
  [roomChoiceOutcomeKey('the-metamour', 'name-the-hierarchy', 1)]:
    'Es folgt eine neu geschriebene Charta, mit echten Zeiten und echten Grenzen, die man nicht Veto nennt, die aber wie eine vorsichtige Version davon funktionieren — ehrlich, und teuer erkauft.',
  [roomChoiceTextKey('the-metamour', 'audit-the-jealousy')]: 'Bevor irgendetwas geschieht: ist das Signal, oder Rauschen?',
  [roomChoiceHintKey('the-metamour', 'audit-the-jealousy')]: 'Erst die eigene Reaktion untersuchen',
  [roomChoiceOutcomeKey('the-metamour', 'audit-the-jealousy', 0)]:
    'Ein Zimmer im Zimmer der Introspektion. Der Befund, fair vorgetragen: beides. Eine echte Grenze hat sich wirklich abgenutzt, und dein eigenes Bindungsmuster verstärkt das wirklich.',
  [roomChoiceOutcomeKey('the-metamour', 'audit-the-jealousy', 1)]:
    'Zwei verschiedene Befunde brauchen zwei verschiedene Werkzeuge, und das Zimmer gibt dir beide in die Hand, statt eins für dich auszuwählen.',
  [roomExplanationKey('the-metamour', 0)]:
    'Forschung zur konsensuellen Nichtmonogamie findet Zufriedenheit und Vertrauen vergleichbar mit monogamen Beziehungen, und zwar genau dann, wenn Abmachungen aktiv ausgehandelt und gepflegt werden — nicht einmal festgelegt und danach einfach vorausgesetzt. Die dokumentierten Versagensmuster sind konkret und vermeidbar: Abdriften, unausgesprochene Hierarchie und Metamour-Vermeidung, bei der die am stärksten Betroffenen einer Abmachung tatsächlich nie miteinander sprechen. Kompersion — Freude an der Freude, die ein Partner anderswo findet — funktioniert in der Literatur als erlernbare Fähigkeit, nicht als Charaktervoraussetzung; und Eifersucht funktioniert, statt als Urteil, als Datenpunkt, der immer noch gedeutet werden muss.',
  [roomNoteTitleKey('the-metamour')]: 'Nähte',
  [roomNoteThinkersKey('the-metamour')]: 'Moors · Conley · CNM-Ergebnisforschung',
  [roomNoteBodyKey('the-metamour')]:
    'Der ehrliche Stand der Wissenschaft, in beide Richtungen: gut durchgeführte Studien finden vergleichbare Zufriedenheit und Vertrauen zwischen ausgehandelter CNM und Monogamie, und identifizieren zugleich die Pflegehandlungen, die vorhersagen, welchen CNM-Konstellationen es tatsächlich gut geht — geplante Neuverhandlung, direkter Metamour-Kontakt und ausdrückliche Hierarchie-Gespräche statt vorausgesetzter. **Die doppelte Natur der Eifersucht ist gut belegt: manchmal ist sie Signal (eine wirklich überschrittene Grenze), manchmal Rauschen (Bindungswetter, das auf nichts Äußeres zeigt), und oft beides zugleich im selben Gefühl.** Monogamie versteckt ihre Nähte innerhalb der Tradition, wo niemand sie benennen muss. Hier sind sie mit Absicht sichtbar. Sichtbare Risse lassen sich, anders als verborgene, tatsächlich flicken.',
});
register(roomChoiceOutcomeKey('the-metamour', 'enforce-via-dana', 1), 'v2', 'de', (s: RunState) =>
  seedSplit(s)
    ? 'Die Lösung hält, diesmal, weil Dana sie hält — das Zimmer ist ehrlich darin, dass du das schwere Gespräch delegiert hast, und es hat sich zufällig getroffen.'
    : 'Die Lösung wackelt — Dana versucht es, und Petra liest die Grenze als von dir kommend, nicht von Dana, womit sie nicht ganz falschliegt. Das Zimmer ist ehrlich darin, dass eine delegierte Grenze nicht garantiert unversehrt ankommt.',
);

// ---------- The Veto ----------
registerAll('v2', 'de', {
  // counter-veto outcome0 is a function beat — registered below via register().
  [roomBeatKey('the-veto', 0, 0)]:
    'Dana legt das Veto ein — verfasst im ersten Jahr, „für Notfälle“, seither kein einziges Mal benutzt. Gegen Sam. Der erste Mensch, den du seit Jahren wirklich geliebt hast, nicht nur mit ihm zusammen warst.',
  [roomBeatKey('the-veto', 0, 1)]:
    'Danas Grund, vom Zimmer mit vollem Gewicht behandelt, statt vom Tisch gewischt: „weil das hier anders ist, und Anderssein mir Angst macht.“ Genau dafür existiert das Veto. Genau das ist das Problem.',
  [roomBeatKey('the-veto', 0, 2)]:
    'Sam, skizziert in drei konkreten, warmen Details — das Zimmer besteht darauf, dass du erst fühlst, was hier eigentlich vetoiert wird, bevor du irgendetwas entscheidest.',
  [roomBeatKey('the-veto', 0, 3)]: 'Auch Danas Angst mit voller innerer Perspektive: keine Tyrannei, sondern Entsetzen im Bademantel, um elf Uhr abends.',
  [roomBeatKey('the-veto', 0, 4)]:
    'Die Frage unter dem Regelwerk, jetzt unausweichlich: War das Veto überhaupt je vereinbar mit dem, was ihr zwei zu bauen behauptet habt?',
  [roomBeatKey('the-veto', 0, 5)]:
    'Portier: „Die Rezeption führt eine Schublade mit Notfallschlüsseln. Die Lehre aus dieser Schublade: Mit der Zeit wird für irgendjemanden buchstäblich alles zum Notfall.“',
  [roomChoiceTextKey('the-veto', 'comply')]: 'Halte die Regel genau ein, wie sie geschrieben steht. Beende es mit Sam.',
  [roomChoiceHintKey('the-veto', 'comply')]: 'Die alte Abmachung einhalten, koste es, was es wolle',
  [roomChoiceOutcomeKey('the-veto', 'comply', 0)]:
    'Die Trennungsszene mit Sam — der oder die nichts falsch gemacht hat — mit ihrem vollen, unangenehmen Gewicht.',
  [roomChoiceOutcomeKey('the-veto', 'comply', 1)]:
    'Die Ehe der Regeln bewahrt. Danas Erleichterung, echt. Und darin, nur für dich sichtbar: genau das, was diese Regel gerade gekauft hat, und genau das, was sie gekostet hat.',
  [roomChoiceTextKey('the-veto', 'fight-the-rule')]:
    'Widersetz dich dem Veto, nicht Dana: „arbeiten wir die Regel neu aus, oder es zerbricht nicht die Regel.“',
  [roomChoiceHintKey('the-veto', 'fight-the-rule')]: 'Den Mechanismus infrage stellen, nicht den Menschen',
  [roomChoiceOutcomeKey('the-veto', 'fight-the-rule', 0)]:
    'Die Verfassungskrise eines Zwei-Personen-Staates, in schmerzhaften Details: was ein Veto ersetzt — geäußerte Bedenken, zeitlich begrenzte Bremsen, aber kein einseitiger Notausschalter.',
  [roomChoiceOutcomeKey('the-veto', 'fight-the-rule', 1)]:
    'Danas Angst muss jetzt mit Fürsorge beantwortet werden statt mit Gesetz, was für euch beide schwerer ist, und — darauf besteht das Zimmer — ehrlicher.',
  [roomChoiceTextKey('the-veto', 'examine-the-veto')]: 'Bevor irgendetwas entschieden wird: Wofür war das Veto im ersten Jahr wirklich gedacht?',
  [roomChoiceHintKey('the-veto', 'examine-the-veto')]: 'Die Regel verstehen, bevor man sie befolgt oder bricht',
  [roomChoiceOutcomeKey('the-veto', 'examine-the-veto', 0)]:
    'Eine kleine Ausgrabung: die Nacht, in der die Regel geschrieben wurde, beide von euch ängstlich, die Regel gebaut als Decke gegen eine Angst, für die keiner von euch damals eine bessere Antwort hatte.',
  [roomChoiceOutcomeKey('the-veto', 'examine-the-veto', 1)]:
    'Der Befund: Regeln, geschrieben aus Angst, erzwingen Angst. Was du als Nächstes tust, ist eine eigene, besser informierte Entscheidung — das Zimmer achtet sorgfältig darauf, sie nicht für dich zu treffen.',
  [roomChoiceTextKey('the-veto', 'counter-veto')]: 'Leg deins ein, im Gegenzug. Gegen Petra.',
  [roomChoiceHintKey('the-veto', 'counter-veto')]: 'Den Zug erwidern, statt ihn aufzulösen',
  [roomChoiceOutcomeKey('the-veto', 'counter-veto', 1)]:
    'Die gegenseitig zugesicherte Zerstörung zweier echter Lieben. Die Konstellation überlebt den Schlagabtausch als Festung mit zwei Gefangenen darin.',
  [roomExplanationKey('the-veto', 0)]:
    'Die Veto-Debatte innerhalb nichtmonogamer Communitys läuft seit Jahrzehnten ohne endgültige Klärung, und die stärksten Argumente auf beiden Seiten verdienen es, in voller Stärke gehört zu werden: ein Veto als Rückversicherung für einen verängstigten Partner, gegen ein Veto als Notausschalter, gehalten über das tatsächliche Leben und die Gefühle einer dritten Person, ohne deren Zustimmung zu der Konstellation. „Anderssein macht mir Angst“ ist meist eine Bitte um Fürsorge, keine um Gehorsam — und Regeln können, so gut gemeint sie auch sind, strukturell nicht die Arbeit leisten, die nur echte Rückversicherung und erneuerte Bindung leisten können.',
  [roomNoteTitleKey('the-veto')]: 'Notfallschlüssel',
  [roomNoteThinkersKey('the-veto')]: 'CNM-Vetoliteratur · Autonomieforschung',
  [roomNoteBodyKey('the-veto')]:
    'Die langjährige Veto-Debatte in der nichtmonogamen Community hat auf beiden Seiten wirklich fair vertretene Positionen — Rückversicherung für den ängstlicheren Partner, gegen einen Notausschalter, ausgeübt über jemanden, der in der Sache keine Stimme hat. Die empirische Notiz, die es wert ist, mitzunehmen: Veto-Konstellationen korrelieren mit früheren, weniger ausgehandelten CNM-Stadien und werden mit der Zeit entweder zu etwas Kooperativerem umgearbeitet, oder sie zerbrechen, sobald sie tatsächlich eingesetzt werden. **Die mit einem Veto belegte dritte Person ist ein Mensch, keine Variable in der Gleichung einer anderen Person, und die Forschung besteht zunehmend offen darauf.** Keine Regel hat je eine verängstigte Hand gehalten. Das können nur Hände.',
});
register(roomChoiceOutcomeKey('the-veto', 'counter-veto', 0), 'v2', 'de', (s: RunState) =>
  s.flags.includes('symmetry-trap')
    ? 'Die Symmetriefalle, jetzt in ihrer erwachsenen Größe — das Zimmer bemerkt, dass du schon einmal hier warst, kleiner, mit einem Passwort statt einem Menschen.'
    : 'Die Symmetriefalle, in ihrer erwachsenen Größe: Kraft mit Kraft beantworten, statt den eigentlichen Streit darunter zu lösen.',
);

// ---------- The Drift ----------
registerAll('v2', 'de', {
  // raise-it outcome1 is a function beat — registered below via register().
  [roomBeatKey('the-drift', 0, 0)]:
    'Du und Dana, siebtes Jahr. Nichts ist falsch. Nichts ist überhaupt irgendetwas. Das Zimmer ist genau wie euer Wohnzimmer eingerichtet, und der Schrecken, leise, liegt darin, dass es gemütlich ist.',
  [roomBeatKey('the-drift', 0, 1)]:
    'Du weißt, welches Dielenbrett knarrt, wessen Tasse welche ist, was welcher bestimmte Seufzer bedeutet. Der Abend spielt sich in liebevollem, forensischem Detail noch einmal ab, und das Detail selbst ist die Beklemmung.',
  [roomBeatKey('the-drift', 0, 2)]:
    'Das letzte Jahr, aus der Distanz betrachtet: ununterscheidbare Wochen, aufeinandergestapelt. Das letzte Mal, dass einer von euch eine Frage gestellt hat, deren Antwort er nicht schon kannte — das Zimmer kann es genau datieren, was für sich schon eine leise Anklage ist.',
  [roomBeatKey('the-drift', 0, 3)]: 'Zwei Zukünfte, nebeneinander projiziert: dies, unverändert, noch vierzig weitere Jahre. Oder das Unbekannte, für eine unbekannte Anzahl davon.',
  [roomBeatKey('the-drift', 0, 4)]:
    'Portier: „Die längsten Aufenthalte in diesem Flügel haben die stillsten Zimmer. Die Rezeption hat nie entschieden, ob das Frieden ist. Die Zimmer auch nicht.“',
  [roomChoiceTextKey('the-drift', 'start-the-work')]: 'Bleib, und beginn die erschreckende Arbeit, wieder zu wollen.',
  [roomChoiceHintKey('the-drift', 'start-the-work')]: 'Fang an, mit etwas Kleinem',
  [roomChoiceOutcomeKey('the-drift', 'start-the-work', 0)]:
    'Keine Montage. Eine einzige, konkrete Handlung: eine Frage, deren Antwort du nicht kennst, laut gestellt am Spülbecken.',
  [roomChoiceOutcomeKey('the-drift', 'start-the-work', 1)]:
    'Ihre unverhältnismäßig große Nachwirkung, ehrlich geschildert — Selbsterweiterung, begonnen im Maßstab der Küche. Keine Garantie wird ausgestellt. Das Zimmer sagt es klar.',
  [roomChoiceTextKey('the-drift', 'raise-it')]: 'Sag das Unsagbare: „sind wir okay, oder sind wir nur still?“',
  [roomChoiceHintKey('the-drift', 'raise-it')]: 'Die Frage laut stellen',
  [roomChoiceOutcomeKey('the-drift', 'raise-it', 0)]:
    'Das Gespräch selbst ist das Risiko, und das Zimmer beziffert es ehrlich: Was sich hier öffnet, lässt sich nicht auf dieselbe Weise wieder schließen, wie es vorher war.',
  [roomChoiceOutcomeKey('the-drift', 'raise-it', 2)]: 'Beide Versionen enden mit mehr Leben im Zimmer, und mit weniger Boden darunter.',
  [roomChoiceTextKey('the-drift', 'accept-quiet-as-love')]: 'Entscheide, dass dies Liebe ist, im Gewand des siebten Jahres.',
  [roomChoiceHintKey('the-drift', 'accept-quiet-as-love')]: 'Der Stille ihre eigene Würde zugestehen',
  [roomChoiceOutcomeKey('the-drift', 'accept-quiet-as-love', 0)]:
    'Das Zimmer gesteht dieser Lesart ihre volle Würde zu: gefährtenschaftliche Liebe ist echte Liebe, keine geringere Stufe davon.',
  [roomChoiceOutcomeKey('the-drift', 'accept-quiet-as-love', 1)]:
    'Eine ehrliche Bedingung, hinzugefügt: Es muss gewählt sein, nicht Standard. Der Unterschied ist ein einziger Takt aktiver Dankbarkeit, ausgesprochen statt bloß empfunden.',
  [roomChoiceTextKey('the-drift', 'notice-youve-left')]: 'Merke, dass du schon in jeder Hinsicht gegangen bist, außer durch die Tür.',
  [roomChoiceHintKey('the-drift', 'notice-youve-left')]: 'Eine ehrliche Inventur machen',
  [roomChoiceOutcomeKey('the-drift', 'notice-youve-left', 0)]: 'Eine stille Katastrophe einer ehrlichen Inventur. Nichts wird angekündigt. Nichts wird gepackt.',
  [roomChoiceOutcomeKey('the-drift', 'notice-youve-left', 1)]:
    'Nur die Erkenntnis selbst — die das Gewicht jedes verbleibenden Zimmers in diesem Durchlauf verändert, ob es sonst jemand im Hotel heute Nacht je erfährt oder nicht.',
  [roomExplanationKey('the-drift', 0)]:
    'John Gottmans Langzeitforschung findet durchgehend, dass emotionale Entfremdung, nicht die Häufigkeit von Konflikten, der stärkste Prädiktor für das Ende von Beziehungen ist — Paare, die aufhören, sich nacheinander auszustrecken, sind stärker gefährdet als Paare, die regelmäßig streiten, es aber weiter versuchen. Arthur Arons Forschung zur Selbsterweiterung fand etwas Hoffnungsvolleres: Paare, die gemeinsam neuartige, leicht anspruchsvolle Aktivitäten unternehmen, zeigen messbare Zuwächse an Beziehungszufriedenheit, als liefe Liebe teils auf Wachstum statt allein auf Behaglichkeit. Eli Finkels These von der „Alles-oder-Nichts-Ehe“ benennt die Falle unverblümt: Moderne Paare verlangen von einer Person, fast alles zu sein, und lassen dieses „Alles“ dann ohne Zeit und ohne Neuheit verhungern.',
  [roomNoteTitleKey('the-drift')]: 'Die stillsten Zimmer',
  [roomNoteThinkersKey('the-drift')]: 'Gottman · Aron (2000) · Finkel (2017)',
  [roomNoteBodyKey('the-drift')]:
    'Gottmans Daten sind über Jahrzehnte hinweg konsistent: Entfremdung — nicht das Vorhandensein von Konflikt — ist der stärkste Prädiktor dafür, dass eine Beziehung endet, weil Paare, die aufhören, sich den kleinen Kontaktversuchen des anderen zuzuwenden, die Pflege eingestellt haben, die Liebe tatsächlich braucht. Arons Experimente zur Selbsterweiterung fanden etwas Konkretes und Wiederholbares: Paaren, denen neuartige, mäßig anspruchsvolle gemeinsame Aktivitäten zugeteilt wurden, wuchs messbar die berichtete Nähe — ein Beleg dafür, dass Wachstum eine echte Zutat ist, keine bloß romantische Metapher. Finkels Rahmung schärft die Falle weiter: Von modernen Beziehungen wird verlangt, fast alles zu liefern, was ein Mensch braucht — während sie weniger Zeit und Aufmerksamkeit erhalten, als Beziehungen historisch von einer ganzen umgebenden Gemeinschaft bekamen. **Behaglichkeit ist ein Merkmal. Prüf, ob es das einzige noch installierte ist.**',
});
register(roomChoiceOutcomeKey('the-drift', 'raise-it', 1), 'v2', 'de', (s: RunState) =>
  seedSplit(s)
    ? 'Danas Antwort kommt wie eine Erleichterung — sichtbar, sofort, wie ein losgelassener angehaltener Atem: „Ich hab mich schon gefragt, wie ich dich genau das Gleiche fragen soll.“'
    : 'Danas Antwort kommt zuerst wie Zorn daher — Angst in ihrem am wenigsten schmeichelhaften Mantel —, bevor sie sich später zu etwas wandelt, das der Erleichterung näherkommt.',
);

// ---------- The Second Account ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-second-account', 0, 0)]:
    'Dein eigener zweiter Account. Fing als Scherz-Handle an; jetzt ist es der Ort, an dem eine Version von dir flirtet, Aufmerksamkeit erntet und drei Gespräche auf Sparflamme hält, von denen Dana nicht weiß, dass es sie gibt.',
  [roomBeatKey('the-second-account', 0, 1)]:
    'Nichts Körperliches. Nicht einmal etwas Verabredetes. Der ganze Mechanismus des Zimmers: Es spielt dir deine eigenen Nachrichten zurück, in der flachen, unbetonten Stimme des Portiers — genau dem Register, in dem Flirten wie Zeugenaussage klingt.',
  [roomBeatKey('the-second-account', 0, 2)]:
    'Drei Gespräche, flach vorgeführt: die Komplimente, nach denen du angelst, nach Art katalogisiert, kein einziges davon unabsichtlich.',
  [roomBeatKey('the-second-account', 0, 3)]: 'Eine Frage, in einem einzigen Takt geliefert: Wie würdest du das nennen, wenn Dana es täte?',
  [roomBeatKey('the-second-account', 0, 4)]:
    'Das Dopamin-Kontobuch, in ehrlichen Spalten: Was der Account füttert, was er kostet, nebeneinander, keine Spalte vor der anderen versteckt.',
  [roomBeatKey('the-second-account', 0, 5)]:
    'Portier: „Die Rezeption klassifiziert nicht. Die Rezeption liest nur vor. Gäste klassifizieren im Tempo ihres eigenen Zusammenzuckens.“',
  [roomChoiceTextKey('the-second-account', 'delete-it')]: 'Lösch den Account. Heute Abend. Ganz.',
  [roomChoiceHintKey('the-second-account', 'delete-it')]: 'Es sauber beenden',
  [roomChoiceOutcomeKey('the-second-account', 'delete-it', 0)]:
    'Das Löschen, geschildert, wie sich Entzug tatsächlich anfühlt: das Jucken, das Phantom-Nachsehen, eine ganze Woche des Greifens nach einer Tür, die nicht mehr da ist.',
  [roomChoiceOutcomeKey('the-second-account', 'delete-it', 1)]:
    'Was in ihrer Abwesenheit zurückkehrt: Aufmerksamkeit, umgeleitet nach Hause — zunächst unbeholfen, und wirklich lebendig.',
  [roomChoiceTextKey('the-second-account', 'keep-and-name-it')]: 'Behalt ihn. Benenn ehrlich, was er füttert.',
  [roomChoiceHintKey('the-second-account', 'keep-and-name-it')]: 'Bleiben, aber aufhören, sich etwas vorzumachen',
  [roomChoiceOutcomeKey('the-second-account', 'keep-and-name-it', 0)]:
    'Die raffinierte Rationalisierung, mit voller, fairer Stimme: „jeder braucht ein Ich außerhalb der Beziehung.“',
  [roomChoiceOutcomeKey('the-second-account', 'keep-and-name-it', 1)]:
    'Ein ehrlicher Test, hinzugefügt und installiert gelassen: ein Ich, oder ein Geheimnis? Der Account bleibt, und die Frage wohnt jetzt dauerhaft darin.',
  [roomChoiceTextKey('the-second-account', 'show-dana')]: 'Gib Dana das Handy. Account offen.',
  [roomChoiceHintKey('the-second-account', 'show-dana')]: 'Es Dana selbst lesen lassen',
  [roomChoiceOutcomeKey('the-second-account', 'show-dana', 0)]:
    'Die mutigste und teuerste Tür. Dana liest in Echtzeit — das Zimmer spielt diesmal Danas Gesicht ab, nicht die Nachrichten.',
  [roomChoiceOutcomeKey('the-second-account', 'show-dana', 1)]:
    'Das folgende Gespräch handelt davon, was tatsächlich gefehlt hat, was der Account still gefüttert hat — eine Mauer abgerissen, während das Gebäude noch bewohnt ist.',
  [roomChoiceTextKey('the-second-account', 'defend-the-category')]: '„Das ist kein Fremdgehen, wenn—“',
  [roomChoiceHintKey('the-second-account', 'defend-the-category')]: 'Den Satz zu Ende bringen und schauen, ob er standhält',
  [roomChoiceOutcomeKey('the-second-account', 'defend-the-category', 0)]:
    'Das Zimmer lässt dich den Satz vollständig beenden und liest ihn dir dann vor, flach, mit der Stimme des Portiers, neben den tatsächlichen Umfragedaten.',
  [roomChoiceOutcomeKey('the-second-account', 'defend-the-category', 1)]:
    'Der Satz übersteht das Vorlesen nicht. Der Account schon. Was auch seine eigene Art von Information über dich ist.',
  [roomExplanationKey('the-second-account', 0)]:
    'Umfragen dazu, was als „Mikro-Fremdgehen“ zählt, finden wirklich wenig Übereinstimmung — nicht nur zwischen Fremden, sondern zwischen Partnern derselben Beziehung, die sich oft nicht einig sind, wo die Grenze liegt. Die zuverlässigste Diagnose ist keine bestimmte Handlung; es ist ein einfacher Test — würdest du diesen Chat deinem Partner zeigen, unaufgefordert, genau jetzt? Geheimhaltung erweist sich erneut als die tragende Zutat — derselbe Befund aus Shirley Glass’ Forschung zu Mauern und Fenstern, diesmal angewandt auf ein Handy statt auf einen Menschen.',
  [roomNoteTitleKey('the-second-account')]: 'Die Definitionslücke',
  [roomNoteThinkersKey('the-second-account')]: 'Umfrageforschung zu digitaler Untreue · Glass (2003) (digitale Mauern)',
  [roomNoteBodyKey('the-second-account')]:
    'Umfragen, die Paare bitten, „Fremdgehen“ unabhängig voneinander zu definieren, finden bemerkenswert wenig Übereinstimmung — nicht zwischen Fremden, wo Uneinigkeit zu erwarten ist, sondern zwischen Partnern derselben Beziehung, die die Grenze routinemäßig unterschiedlich ziehen, ohne es zu merken, bis es getestet wird. Über all diese Uneinigkeit hinweg hält ein Kriterium stand: Geheimhaltung. **Ein Verhalten, das vor einem Partner verborgen gehalten wird, funktioniert strukturell genau so, wie verborgenes Verhalten immer funktioniert hat — unabhängig davon, um welche Art von Verhalten es sich technisch handelt.** Aufmerksamkeit selbst verhält sich in dieser Forschung wie eine endliche, umleitbare Ressource: Was ein Account erntet, bekommt die Beziehung nicht, ob nun je etwas Ausdrückliches ausgetauscht wurde oder nicht. Der Spiegel ist aus einem Grund auf der Innenseite dieser Tür angebracht. Es ist das eine Zimmer, in dem der Beweis immer dein eigener sein sollte.',
});

// ---------- The Discovery ----------
registerAll('v2', 'de', {
  // beat0 is a function beat — registered below via register().
  [roomBeatKey('the-discovery', 0, 1)]: 'Die vier Zukünfte, alle gleichzeitig sichtbar von genau dieser Küche aus, keine davon bisher gewählt.',
  [roomBeatKey('the-discovery', 0, 2)]:
    'Das eine, was die Forschung über die nächste Stunde tatsächlich weiß: Was in der Überflutung gesagt wird, bleibt tendenziell gesagt, dauerhaft abgelegt, unabhängig davon, was sich am Ende als wahr herausstellt.',
  [roomBeatKey('the-discovery', 0, 3)]: 'Das Handy leuchtet erneut auf.',
  [roomBeatKey('the-discovery', 0, 4)]:
    'Portier (sehr leise): „Die Rezeption rät keinem Gast, mit zitternden Händen irgendetwas zu unterschreiben. Das schließt Sätze ein.“',
  [roomChoiceTextKey('the-discovery', 'confront-now')]: 'Konfrontier es jetzt sofort. Überflutet. Genau hier in der Küche.',
  [roomChoiceHintKey('the-discovery', 'confront-now')]: 'Es sagen, bevor du dich beruhigt hast',
  [roomChoiceOutcomeKey('the-discovery', 'confront-now', 0)]:
    'Der Streit, in kurzen, zerrissenen Sätzen geschildert — Anschuldigung überholt Beweise, Danas eigene Überflutung antwortet auf deine, zwei Menschen, die in derselben kleinen Küche ertrinken.',
  [roomChoiceOutcomeKey('the-discovery', 'confront-now', 2)]:
    'Welche Wahrheit auch immer es ist, beide brennen. Die eine rechtfertigt die Überflutung im Nachhinein. Die andere überführt sie. Der eigentliche Sinn des Zimmers war nie die Antwort — es war die Stunde.',
  [roomChoiceTextKey('the-discovery', 'gather-first')]: 'Sag nichts. Verifizier es. Chattam-forensisch, geduldig, kalt.',
  [roomChoiceHintKey('the-discovery', 'gather-first')]: 'Gewissheit aufbauen, bevor du sprichst',
  [roomChoiceOutcomeKey('the-discovery', 'gather-first', 0)]:
    'Drei Tage, verdichtet auf vier Takte: die Vorführung von Normalität beim Frühstück, während du still ein ganzes Leben durchleuchtest.',
  [roomChoiceOutcomeKey('the-discovery', 'gather-first', 2)]:
    'Beide Sendungen — die Antwort, und das, was dich das Beschaffen dieser Antwort hat werden lassen — treffen zusammen ein, in derselben Hand.',
  [roomChoiceTextKey('the-discovery', 'pretend')]: 'Entscheide dich aktiv, nichts zu wissen.',
  [roomChoiceHintKey('the-discovery', 'pretend')]: 'Sich mit Absicht für Nichtwissen entscheiden',
  [roomChoiceOutcomeKey('the-discovery', 'pretend', 0)]:
    'Nichtwissen ist, wie sich zeigt, ein Vollzeitjob ohne Urlaubstage. Das Zimmer zeigt im Zeitraffer, was seine Aufrechterhaltung über die folgenden Wochen hinweg kostet.',
  [roomChoiceOutcomeKey('the-discovery', 'pretend', 1)]:
    'Was auch immer die Wahrheit tatsächlich war, bleibt heute Abend ungelernt — stattdessen abgelegt als leises Brummen unter jedem folgenden Gespräch.',
  [roomChoiceTextKey('the-discovery', 'walk-tonight')]: 'Pack eine Tasche. Lass die Frage zurück, zusammen mit dem Ring.',
  [roomChoiceHintKey('the-discovery', 'walk-tonight')]: 'Gehen, ohne auf die Antwort zu warten',
  [roomChoiceOutcomeKey('the-discovery', 'walk-tonight', 0)]:
    'Der Abgang, ohne Triumph geschildert. Mit einer offenen Frage zu gehen heißt, die Frage mitzutragen — flach gepackt, unter allem anderen, auf unbestimmte Zeit.',
  [roomChoiceOutcomeKey('the-discovery', 'walk-tonight', 1)]: 'Manche Gäste nennen das Stärke. Manche Flucht. Die Rezeption legt es, ehrlich gesagt, unter beides ab.',
  [roomChoiceTextKey('the-discovery', 'steady-then-ask')]:
    'Leg das Handy hin. Geh um den Block, bis deine Hände wieder dir gehören — dann frag Dana direkt, heute Abend, ohne vorbereitete Anklage.',
  [roomChoiceHintKey('the-discovery', 'steady-then-ask')]: 'Die Überflutung abwarten, nicht die Frage',
  [roomChoiceOutcomeKey('the-discovery', 'steady-then-ask', 0)]:
    'Zwanzig Minuten, kalte Luft, kein Handy. Nicht ganz Ruhe — nur jenseits des Punktes, an dem der Körper das Gespräch führt statt du.',
  [roomChoiceOutcomeKey('the-discovery', 'steady-then-ask', 2)]:
    'Die Rezeption führt kein getrenntes Kontobuch für das, was überflutet gesagt wurde, und das, was ruhig gesagt wurde — aber du schon, und diesmal ist in der ersten Spalte nichts verbucht.',
  [roomExplanationKey('the-discovery', 0)]:
    'Was Forschende Überflutung nennen — die Alarmreaktion des Körpers, die höhere Denkprozesse überlagert — erklärt, warum das erste Gespräch nach einem Betrugsverdacht meist am schlechtesten verläuft: erhöhter Herzschlag und diffuse physiologische Erregung beeinträchtigen die Fähigkeit, klar zu denken, tatsächlich, für etwa zwanzig Minuten — ein Zeitfenster, das die meisten Konfrontationen nicht abwarten. Was die Forschung zu Aufdeckungsgesprächen durchgehend empfiehlt, ist strukturell: Aufschub, Atmen, notfalls sogar ein vorbereiteter Wortlaut, statt darauf zu vertrauen, dass der überflutete Moment irgendetwas Verlässliches hervorbringt. Und eine demütigende Basisrate, die man sich merken sollte: Herzchen auf Handys haben öfter mehr mögliche Absender, als das schlimmste Szenario üblicherweise einkalkuliert.',
  [roomNoteTitleKey('the-discovery')]: 'Mit zitternden Händen unterschreiben',
  [roomNoteThinkersKey('the-discovery')]: 'Gottman (Überflutung) · Forschung zu Aufdeckungsgesprächen',
  [roomNoteBodyKey('the-discovery')]:
    'Gottmans physiologische Forschung zur „Überflutung“ fand etwas Konkretes und Testbares: ein wirklich erhöhter Herzschlag erzeugt diffuse physiologische Erregung, die messbar die Fähigkeit verschlechtert, sorgfältig zuzuhören, zu denken oder zu sprechen — keine Metapher, sondern ein dokumentierter Zustand, der etwa zwanzig Minuten nach seinem Auslöser anhält. Die Forschung dazu, wie man Verratsaufdeckungen am besten übersteht, ist sich in der Struktur einig: Aufschub vor dem schweren Gespräch, bewusstes Atmen, manchmal buchstäblich ein vorbereiteter Wortlaut, statt darauf zu vertrauen, was zuerst kommt. **Was überflutet gesagt wird, wird tendenziell dauerhaft im Gedächtnis einer Beziehung abgelegt, unabhängig davon, was sich später als wahr herausstellt.** Vier Sekunden Licht. Den Rest hat die Leserin oder der Leser geliefert — wie in jedem Zimmer dieses Flügels.',
});
register(roomBeatKey('the-discovery', 0, 0), 'v2', 'de', (s: RunState) =>
  s.flags.includes('waiting-to-be-caught')
    ? 'Die Ablage. Das Licht. Diesmal siehst du es vom anderen Stuhl aus — als die Person, die erwischt wird, und Danas Gesicht beobachtet, während das Handy mit einem Namen aufleuchtet, den Dana nicht kennt, und einem Herzchen, das Dana kennt. Du weißt jetzt genau, wie sich das von beiden Seiten anfühlt.'
    : 'Danas Handy, mit dem Display nach oben auf der Ablage, leuchtet auf mit einem Namen, den du nicht kennst, und einem Herzchen, das du kennst. Vier Sekunden reichen dem Körper vollauf: lauter Puls in den Ohren, Hände, die plötzlich und nutzlos kalt werden.',
);
register(roomChoiceOutcomeKey('the-discovery', 'confront-now', 1), 'v2', 'de', (s: RunState) =>
  seedSplit2(s)
    ? 'Was das Herz-Emoji tatsächlich war, kommt später ans Licht, sobald ihr beide ruhig genug seid, es zu hören: eine Affäre, echt, seit sechs Wochen. Die Überflutung, so zeigt sich, hat etwas Wahres gesehen.'
    : 'Was das Herz-Emoji tatsächlich war, kommt später ans Licht, sobald ihr beide ruhig genug seid, es zu hören: Danas Geschwister, das eine Überraschungsfeier plant, drei Wochen zunehmend aufgeregter Nachrichten. Die Überflutung hat ein unschuldiges Handy angeklagt.',
);
register(roomChoiceOutcomeKey('the-discovery', 'gather-first', 1), 'v2', 'de', (s: RunState) =>
  seedSplit2(s)
    ? 'Die Gewissheit kommt, und sie ist schlimmer als der Verdacht: eine Affäre, echt. Du bekommst die Antwort, und wirst dabei — im Erlangen dieser Antwort — zu jemandem, der einen schlafenden Menschen beobachtet und dessen Atem katalogisiert hat.'
    : 'Die Gewissheit kommt, und sie löst den Verdacht vollständig auf: eine Überraschungsfeier, sonst nichts, drei Tage deiner eigenen stillen Detektivarbeit, verschwendet an nichts. Du bekommst die Antwort, und wirst trotzdem zu jemandem, der einen schlafenden Menschen beobachtet und dessen Atem katalogisiert hat.',
);
register(roomChoiceOutcomeKey('the-discovery', 'steady-then-ask', 1), 'v2', 'de', (s: RunState) =>
  seedSplit2(s)
    ? 'Du kommst zurück rein und fragst, einmal, direkt. Dana sagt es dir: eine Affäre, echt, seit sechs Wochen. Es ist genau so schlimm, wie der Spaziergang dich befürchten ließ — aber du hörst den ganzen Satz, nicht nur die erste, überflutete Hälfte davon.'
    : 'Du kommst zurück rein und fragst, einmal, direkt. Dana sagt es dir: ein Geschwisterkind, eine Überraschungsfeier, drei Wochen aufgeregter Planung. Nichts. Du glaubst es, vor allem weil du in einem Zustand gefragt hast, der eine Antwort tatsächlich erkennen konnte.',
);

// ---------- The Wedding Eve ----------
registerAll('v2', 'de', {
  // beat2 is a function beat — registered below via register().
  [roomBeatKey('the-wedding-eve', 0, 0)]:
    'Die Nacht vor deiner Hochzeit mit Dana. 02:10 Uhr. Der Anzug hängt am Kleiderschrank wie eine Frage, die niemand laut gestellt hat. Der Sitzplan liegt fertig auf dem Schreibtisch.',
  [roomBeatKey('the-wedding-eve', 0, 1)]:
    'Der Zweifel kommt in Arbeitskleidung: konkret, klein, genau in der Größe von zwei Uhr nachts — nicht dramatisch, was ihn irgendwie schwerer macht, ihn abzutun.',
  [roomBeatKey('the-wedding-eve', 0, 3)]:
    'Die Inventur, auf der das Zimmer besteht: welche Zweifel wirklich Dana gelten, welche der Institution Ehe an sich, und welche nur dir selbst.',
  [roomBeatKey('the-wedding-eve', 0, 4)]:
    'Es folgt die Prüfung der versunkenen Kosten — Anzahlungen, Einladungen, vier Jahre, das Kleid deiner Mutter —, vollständig aufgelistet und dann vom Zimmer selbst ausdrücklich als Beweismittel disqualifiziert.',
  [roomBeatKey('the-wedding-eve', 0, 5)]:
    'Portier: „Die Rezeption bekommt aus diesem Zimmer einen Anruf pro Nacht. Es ist immer jemand, der fragt, ob diesen Anruf jeder bekommt. Die ehrliche Antwort: die meisten. Nicht alle.“',
  [roomChoiceTextKey('the-wedding-eve', 'sit-with-it-til-morning')]: 'Halt den Zweifel aus, ohne ihm zu gehorchen oder ihn zum Schweigen zu bringen.',
  [roomChoiceHintKey('the-wedding-eve', 'sit-with-it-til-morning')]: 'Es ehrlich aussitzen, bis zum Licht',
  [roomChoiceOutcomeKey('the-wedding-eve', 'sit-with-it-til-morning', 0)]:
    'Die Morgendämmerung kommt, der Zweifel noch immer da, aber jetzt in einer Größe, nicht mehr auftürmend.',
  [roomChoiceOutcomeKey('the-wedding-eve', 'sit-with-it-til-morning', 1)]:
    'Der Befund des Zimmers: Zweifel, die eine ehrliche Prüfung überstehen, schrumpfen entweder oder schärfen sich, und beides ist echte Information. Du gehst zum Ort der Trauung und weißt, was deiner getan hat.',
  [roomChoiceTextKey('the-wedding-eve', 'call-someone-honest')]: 'Weck den einen Menschen, der dir die Wahrheit sagt.',
  [roomChoiceHintKey('the-wedding-eve', 'call-someone-honest')]: 'Eine ehrliche Außenperspektive einholen',
  [roomChoiceOutcomeKey('the-wedding-eve', 'call-someone-honest', 0)]:
    'Das Gespräch um drei Uhr morgens, ganz wiedergegeben. Eine Frage schafft in vier Worten, wozu das Zimmer sechs Takte lang aufgebaut hat: „ist es der Tag, oder der Mensch?“',
  [roomChoiceOutcomeKey('the-wedding-eve', 'call-someone-honest', 1)]: 'Erlaubnis, erhalten — für jede ehrliche Antwort.',
  [roomChoiceTextKey('the-wedding-eve', 'answer-the-flame')]: 'Nimm den Anruf an. Oder führ ihn selbst.',
  [roomChoiceHintKey('the-wedding-eve', 'answer-the-flame')]: 'Das alte Gespräch heute Abend wieder öffnen',
  [roomChoiceOutcomeKey('the-wedding-eve', 'answer-the-flame', 1)]:
    'Nichts geschieht, außer dass alles verglichen wird. Du legst auf und weißt etwas — das Zimmer weigert sich, heute Abend laut zu sagen, was.',
  [roomChoiceTextKey('the-wedding-eve', 'postpone')]: 'Weck Dana. Sag es: „nicht morgen. Nicht so.“',
  [roomChoiceHintKey('the-wedding-eve', 'postpone')]: 'Den schwersten verfügbaren Satz sagen',
  [roomChoiceOutcomeKey('the-wedding-eve', 'postpone', 0)]:
    'Der mutigste Satz, der auf diesem Stockwerk zu haben ist, und sein voller Preis: ein Morgen voller Anrufe, Anzahlungen und Gesichter, alles öffentlich bezahlt.',
  [roomChoiceTextKey('the-wedding-eve', 'hold-the-cheap-ring')]:
    'Halt den billigen Plastikring von der Party, einmal, neben den echten von morgen.',
  [roomChoiceHintKey('the-wedding-eve', 'hold-the-cheap-ring')]: 'Ein Andenken, das du seit dem Erdgeschoss bei dir trägst',
  [roomChoiceOutcomeKey('the-wedding-eve', 'hold-the-cheap-ring', 0)]:
    'Du hast ihn immer noch — dreißig Sekunden, ausgelacht zu werden, das Plastik mit der Zeit leicht getrübt, aufbewahrt aus Gründen, die du nie ganz untersucht hast.',
  [roomChoiceOutcomeKey('the-wedding-eve', 'hold-the-cheap-ring', 1)]:
    'Du hast eine Mutprobe schon einmal abgelehnt, bei viel weniger auf dem Spiel als jetzt. Prüf ehrlich, ob morgen auch eine ist — und die Antwort, wie auch immer sie ausfällt, kommt leiser, als du erwartet hast.',
  [roomExplanationKey('the-wedding-eve', 0)]:
    'Lavners Langzeitforschung zu vorehelichen Zweifeln fand etwas Konkretes und Unbequemes: Vor der Hochzeit geäußerte Zweifel — besonders die der Braut oder des Partners mit dem geringeren Status — sagen tatsächlich spätere Eheprobleme und Scheidung voraus, aber entscheidend ist, dass sich das Risiko auf Zweifel konzentriert, die unerforscht bleiben, nicht auf solche, die ehrlich untersucht werden. „Kalte Füße“ und „echtes Signal“ funktionieren als falsche Zweiteilung; die nützlichere Frage betrifft den Inhalt, nicht die Temperatur. Und versunkene Kosten — bezahlte Anzahlungen, verschickte Einladungen — sind aus gutem Grund eine formal definierte Verzerrung: Nichts davon ist tatsächlich ein Beweis dafür, ob es morgen die richtige Entscheidung ist, diesen Menschen zu heiraten.',
  [roomNoteTitleKey('the-wedding-eve')]: 'Die Prüfung um zwei Uhr morgens',
  [roomNoteThinkersKey('the-wedding-eve')]: 'Lavner (2012) · Literatur zu versunkenen Kosten',
  [roomNoteBodyKey('the-wedding-eve')]:
    'Lavners Studien zu vorehelichen Zweifeln sind konkret genug, um wirklich nützlich zu sein: Vor der Hochzeit geäußerte Zweifel sagen tatsächlich ein erhöhtes Risiko späterer Probleme und Scheidung voraus — die Effektgrößen sind real, aber moderat, und es lohnt sich, sie ehrlich zu benennen, nicht dramatisch. Der wichtigere Befund liegt unter dieser Schlagzeile: **Das Risiko konzentriert sich auf Zweifel, die unerforscht bleiben, nicht auf solche, die ehrlich untersucht werden** — was „kalte Füße“ von einem Urteil zu einer Anweisung umdeutet. Die nützliche Unterscheidung liegt nicht zwischen Zweifeln am Menschen und keinen Zweifeln; es sind Zweifel am Menschen, Zweifel an der Institution Ehe selbst und Zweifel an der eigenen Bereitschaft — drei getrennte Fragen, die routinemäßig in ein einziges Gefühl um zwei Uhr morgens zusammenfallen. Der Anzug passt. Das war nie die Frage.',
});
register(roomBeatKey('the-wedding-eve', 0, 2), 'v2', 'de', (s: RunState) =>
  seedSplit(s)
    ? 'Das Telefon klingelt. Eine alte Flamme, unerwartet, halb entschuldigend wegen der Uhrzeit.'
    : 'Das Telefon klingelt nicht. Niemand ruft an. Stattdessen wählt sich der Zweifel selbst, und wählt weiter.',
);
register(roomChoiceOutcomeKey('the-wedding-eve', 'answer-the-flame', 0), 'v2', 'de', (s: RunState) =>
  s.flags.includes('opened-the-archive') || s.flags.includes('answered-the-ex')
    ? 'Das Gespräch ist warm, und es ist Archiv-Wärme — derselbe Kurator wie vor Jahren, immer noch still die schlimmsten Szenen löschend, immer noch am Werk, sogar die Nacht vor deiner Hochzeit.'
    : 'Das Gespräch ist warm, wärmer, als die Uhrzeit es erlauben sollte.',
);
register(roomChoiceOutcomeKey('the-wedding-eve', 'postpone', 1), 'v2', 'de', (s: RunState) =>
  seedSplit2(s)
    ? 'Unter dem Schmerz in Danas Gesicht, als Letztes gezeigt: ein unverkennbares Körnchen Erleichterung — Dana hatte eigene, bis jetzt unausgesprochene Fragen.'
    : 'Unter dem Schmerz in Danas Gesicht, als Letztes gezeigt: keine Erleichterung, nur Schmerz, rein und vollständig. Das Zimmer lässt beide Welten existieren; das ist die, die du bekommen hast.',
);

// ---------- The Therapist ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-therapist', 0, 0)]:
    'Dr. Weiss’ Praxis, innerhalb des Hotels nachgebaut, bis hin zur Taschentuchbox auf dem niedrigen Tisch zwischen zwei Sesseln. Mitten in der Sitzung. Der Streit, wortwörtlich, in Fragmenten: irgendwas über die Spülmaschine, was nie wirklich über die Spülmaschine ging.',
  [roomBeatKey('the-therapist', 0, 1)]:
    'Dr. Weiss benennt das Muster, ohne Schuld zuzuweisen, so, wie es nur ein fremder Mensch schafft, der dafür bezahlt wird, fair zu sein.',
  [roomBeatKey('the-therapist', 0, 2)]:
    'Wo eben noch die Wand der Praxis war, erheben sich vier Türen, jede mit einem einzigen Wort darüber: KRITIK. VERACHTUNG. RECHTFERTIGUNG. MAUERN. Du wirst gebeten, durch die zu gehen, die du immer benutzt.',
  [roomBeatKey('the-therapist', 0, 3)]:
    'Jede Tür haucht, während du an ihr vorbeigehst, einen Satz aus: die Rechtschaffenheit der Kritik, den kalten Trost der Verachtung, das Schildgewicht der Rechtfertigung, das brüllende Schweigen des Mauerns.',
  [roomBeatKey('the-therapist', 0, 4)]:
    'Portier (diesmal als Rezeptionist): „Gäste fragen immer, welche Tür die schlimmste ist. Die Forschung ist unsentimental: die höhnische. Aber du gehst durch deine eigene.“',
  [roomChoiceTextKey('the-therapist', 'criticism')]: 'Geh durch KRITIK.',
  [roomChoiceHintKey('the-therapist', 'criticism')]: '„du immer“ / „du nie“',
  [roomChoiceOutcomeKey('the-therapist', 'criticism', 0)]: 'Hinter der Tür: deine eigenen „du immer“/„du nie“-Sätze, unkommentiert abgespielt.',
  [roomChoiceOutcomeKey('the-therapist', 'criticism', 1)]:
    'Das Gegenmittel, in der Geschichte selbst vermittelt und einmal angewandt, genau dort, an der tatsächlichen Spülmaschine: ein konkretes Verhalten benennen, statt einen ganzen Menschen anzuklagen.',
  [roomChoiceTextKey('the-therapist', 'contempt')]: 'Geh durch VERACHTUNG.',
  [roomChoiceHintKey('the-therapist', 'contempt')]: 'Die verdrehten Augen',
  [roomChoiceOutcomeKey('the-therapist', 'contempt', 0)]:
    'Die Tür der verdrehten Augen. Die Forschung wird dir sanft, aber vollständig vorgelesen: Verachtung ist von allen vieren mit Abstand der stärkste Prädiktor für das Ende einer Beziehung.',
  [roomChoiceOutcomeKey('the-therapist', 'contempt', 1)]:
    'Das Gegenmittel, begonnen mit einer bewussten Geste: eine konkrete, erinnerte gute Sache an Dana, laut ausgesprochen, genau jetzt.',
  [roomChoiceTextKey('the-therapist', 'defensiveness')]: 'Geh durch RECHTFERTIGUNG.',
  [roomChoiceHintKey('the-therapist', 'defensiveness')]: '„ja, aber—“',
  [roomChoiceOutcomeKey('the-therapist', 'defensiveness', 0)]: 'Die Tür des Gegenangriffs. Dein eigener „ja, aber—“-Chor, vollständig abgespielt.',
  [roomChoiceOutcomeKey('the-therapist', 'defensiveness', 1)]:
    'Das Gegenmittel, einmal ausgeführt: laut einen kleinen, echten Teil Verantwortung übernehmen — und seine unverhältnismäßig große Wirkung auf Danas Schultern, sichtbar, sofort.',
  [roomChoiceTextKey('the-therapist', 'stonewalling')]: 'Geh durch MAUERN.',
  [roomChoiceHintKey('the-therapist', 'stonewalling')]: 'Das brüllende Schweigen',
  [roomChoiceOutcomeKey('the-therapist', 'stonewalling', 1)]:
    'Das Gegenmittel: die angekündigte Pause — „ich brauche zwanzig Minuten, ich komme zurück“ — und das tatsächliche Zurückkommen, gezeigt als die wirklich erlernbare Fertigkeit.',
  [roomExplanationKey('the-therapist', 0)]:
    'John Gottmans „vier Reiter“ — Kritik, Verachtung, Rechtfertigung und Mauern — sind dokumentierte Prädiktoren für den Zerfall von Beziehungen, jeder mit einem konkreten, erlernbaren Gegenmittel: Beschwerde statt Kritik, aufgebauter Respekt statt Verachtung, Verantwortung übernehmen statt sich verteidigen, und eine angekündigte, eingehaltene Pause statt unerklärtem Abschotten. Gottmans berühmte Behauptung, Scheidungen mit bemerkenswerter Genauigkeit vorherzusagen, hat eine echte methodische Kritik nach sich gezogen, die es wert ist, gleich mitzunennen: spätere Analysen stellten die Statistik der ursprünglichen Vorhersagestudien infrage — die vier Reiter sind also als wirklich nützliche Landkarte destruktiver Muster zu behandeln, nicht als Wahrsagemaschine.',
  [roomBeatKey('the-therapist', 1, 1)]: 'Ein schlechter Witz, in einem leicht falschen Moment. Von Dana, mit sichtlichem Mut angeboten.',
  [roomExplanationKey('the-therapist', 1)]:
    'Gottmans Forschung benennt auch die Kehrseite der vier Reiter: einen „Reparaturversuch“ — eine kleine, oft ungeschickte Geste, mit der ein Partner mitten im Streit versucht zu deeskalieren, wie ein schlechter Witz, eine Entschuldigung, oder einfach eine ausgestreckte Hand. Am wichtigsten ist nicht, wie geschmeidig der Reparaturversuch gelingt; wichtig ist, ob der andere ihn tatsächlich auffängt. Paare, die langfristig glücklich bleiben, sind nicht die, die nie streiten — die Forschung findet, dass es die sind, die gegenseitige Reparaturversuche erfolgreich annehmen, selbst die ungeschickten, statt den Stolz den Streit noch ein Stück länger fortführen zu lassen, als nötig gewesen wäre.',
  [roomChoiceTextKey('the-therapist', 'accept-the-repair')]: 'Nimm ihn an. Lass den schlechten Witz landen.',
  [roomChoiceHintKey('the-therapist', 'accept-the-repair')]: 'Die angebotene Hand annehmen',
  [roomChoiceOutcomeKey('the-therapist', 'accept-the-repair', 0)]:
    'Das Zimmer wird um ein wirklich messbares Stück leichter. Keine Lösung — Reparatur. Die beiden sind nicht dasselbe, und dem Zimmer liegt an diesem Unterschied.',
  [roomChoiceTextKey('the-therapist', 'miss-the-repair')]: 'Verpass ihn. Bleib beim Streit.',
  [roomChoiceHintKey('the-therapist', 'miss-the-repair')]: 'Den Moment vorbeiziehen lassen',
  [roomChoiceOutcomeKey('the-therapist', 'miss-the-repair', 0)]:
    'Das Zimmer zeigt unverblümt, was ein verpasster Versuch kostet: keine Katastrophe, nur eine Brücke weniger, in einem Streit, dem eine gutgetan hätte.',
  [roomNoteTitleKey('the-therapist')]: 'Vier Türen und ein schlechter Witz',
  [roomNoteThinkersKey('the-therapist')]: 'Gottman (1994) · Christensen (1990)',
  [roomNoteBodyKey('the-therapist')]:
    'Gottmans vier Reiter — Kritik, Verachtung, Rechtfertigung, Mauern — zählen zu den meistzitierten Befunden der Beziehungsforschung, jeder gepaart mit einem konkreten, erlernbaren Gegenmittel statt einem Charakterurteil. Die berühmte Behauptung einer nahezu perfekten Scheidungsvorhersage aus kurzen beobachteten Interaktionen hat seither veröffentlichte statistische Kritik nach sich gezogen — spätere Reanalysen stellten Teile der Methodik der ursprünglichen Studien infrage —, und die ehrliche Rahmung behält beide Tatsachen zugleich im Blick: eine wirklich nützliche diagnostische Landkarte, kein Orakel. **Reparaturversuche, nicht die Abwesenheit von Konflikt, sind Gottmans eigentlicher tragender Befund** — glückliche Paare streiten durchaus; sie strecken sich mitten im Streit einfach viel öfter zueinander aus, und lassen sich öfter erreichen. Christensens Forschung zu Verfolgung und Rückzug fügt eine Symmetrie hinzu, die man sich merken sollte: Wer verfolgt und wer verstummt, haben beide meist Angst, nur in entgegengesetzte Richtungen. Die Taschentuchbox ist echt. Die Türen waren schon immer im Zimmer; die Praxis hat nur die bessere Beleuchtung.',
});
register(roomChoiceOutcomeKey('the-therapist', 'stonewalling', 0), 'v2', 'de', (s: RunState) =>
  s.flags.includes('played-detective') || s.flags.includes('chose-not-to-know')
    ? 'Die stillste Tür — dahinter dieselbe Physiologie wie damals in der Küche, an der Ablage, mit dem Handy: Überflutung, vom Zimmer verknüpft, ohne dass es dir zweimal gesagt werden müsste.'
    : 'Die stillste Tür — dahinter die eigene Überflutung des Körpers, benannt und erklärt: das Abschotten ist ebenso sehr ein physiologisches Ereignis wie ein emotionales.',
);
register(roomBeatKey('the-therapist', 1, 0), 'v2', 'de', (s: RunState) =>
  s.flags.includes('door-contempt')
    ? 'Dr. Weiss bietet einen Reparaturversuch an — klein, und, weil er von Dana kommt, absichtlich unvollkommen. Nach der Verachtung, durch die du gerade gegangen bist, landet er härter, als er es sonst täte.'
    : 'Dr. Weiss bietet einen Reparaturversuch an: klein und unvollkommen, weil genau so echte Reparaturversuche tatsächlich aussehen.',
);

// ---------- The Usual Suite ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-usual-suite', 0, 0)]:
    'Eine niedrige Tür am Flur des Langzeit-Flügels, leicht zu übersehen. Dahinter: dein Apartment, unverkennbar, obwohl du eigentlich nie zuvor hier warst.',
  [roomBeatKey('the-usual-suite', 0, 1)]: 'Eine Wand, von hinten beleuchtet. Silhouetten, wartend.',
  [roomBeatKey('the-usual-suite', 0, 5)]:
    'Portier: „Dieses Zimmer weise nicht ich zu. Das Kontobuch trägt sich selbst ein. Es erscheint nur Gästen bei ihrem zweiten Aufenthalt. Ich habe aufgehört zu fragen, warum. Das Kontobuch hat nicht aufgehört zu antworten: weil sie es jetzt sehen können.“',
  [roomChoiceTextKey('the-usual-suite', 'name-them')]: '„Ich erkenne euch.“ Sag laut, wessen Entscheidungen das sind.',
  [roomChoiceHintKey('the-usual-suite', 'name-them')]: 'Benennen, was du da beobachtest',
  [roomChoiceOutcomeKey('the-usual-suite', 'name-them', 0)]:
    'Du sagst es — nicht der fremde Name dafür, sondern der kleine wahre, der, den du an dir selbst benutzt hast, allein, beim ersten Mal.',
  [roomChoiceOutcomeKey('the-usual-suite', 'name-them', 1)]:
    'Die Wand verdunkelt sich danach, so, wie sich ein Feuer legt, sobald es genau das bekommen hat, was es wollte.',
  [roomChoiceTextKey('the-usual-suite', 'watch-silent')]: 'Sieh zu, ohne zu sprechen. Lass die Gestalten zu Ende spielen.',
  [roomChoiceHintKey('the-usual-suite', 'watch-silent')]: 'Bezeugen, ohne zu kommentieren',
  [roomChoiceOutcomeKey('the-usual-suite', 'watch-silent', 0)]:
    'Du sagst nichts. Die Gestalten beenden ihre kleinen, präzisen Vorstellungen ohne deine Korrektur, ohne deine Erlaubnis.',
  [roomChoiceOutcomeKey('the-usual-suite', 'watch-silent', 1)]:
    'So ist es leichter, und du bemerkst diese Leichtigkeit, und du bemerkst, dass du sie bemerkst.',
  [roomChoiceTextKey('the-usual-suite', 'ask-who-books-it')]: 'Frag den Portier direkt: Wer bucht dieses Zimmer?',
  [roomChoiceHintKey('the-usual-suite', 'ask-who-books-it')]: 'Die Rezeption direkt fragen',
  [roomChoiceOutcomeKey('the-usual-suite', 'ask-who-books-it', 0)]:
    '„Du“, sagt der Portier. „Jedes Mal. Es ist die einzige Reservierung, die die Rezeption nie bestätigen muss.“',
  [roomExplanationKey('the-usual-suite', 0)]:
    'Dieses Zimmer erscheint nur, wenn du schon einmal im Interval gewesen bist, und leiht sich Platons Höhlengleichnis: Es zeigt dir deine eigenen vergangenen Entscheidungen als Schatten und bittet dich einfach, das Muster, das sie bilden, ehrlich anzusehen. Der Wiederholungszwang — die Neigung, vertraute, auch schmerzhafte Dynamiken unbewusst nachzubauen — ist real, gut dokumentiert und, entscheidend, keine lebenslange Strafe: Die Forschung zu „erarbeiteter Sicherheit“ findet das Muster tatsächlich revidierbar, und es ehrlich zu bezeugen, ohne wegzusehen, ist durchgehend der erste Schritt.',
  [roomNoteTitleKey('the-usual-suite')]: 'Die Dauerreservierung',
  [roomNoteThinkersKey('the-usual-suite')]: 'Literatur zum Wiederholungszwang, mit Umsicht behandelt',
  [roomNoteBodyKey('the-usual-suite')]:
    'Das Konzept hat eine komplizierte klinische Geschichte und eine nüchternere moderne Lesart, der man den Vorzug geben sollte: Was wie Schicksal aussieht, ist meist eine erlernte Beziehungsstrategie, die erneut abläuft, weil sie einmal funktioniert hat und nie bewusst überarbeitet wurde. **Ein Muster ehrlich zu bezeugen, ohne es sofort zu verurteilen oder zu entschuldigen, ist der dokumentierte erste Schritt, es tatsächlich zu verändern** — keine aus der Therapie geliehene Metapher, sondern ein Befund aus ihr. Die Wand ist absichtlich dünn. Alle tragenden sind das.',
});
register(roomBeatKey('the-usual-suite', 0, 2), 'v2', 'de', (s: RunState) => {
  const moments = pickShadowMoments(s.prior);
  const first = moments[0];
  return first
    ? `Eine Gestalt an der Wand tut genau das, was du einmal getan hast, in einem Zimmer mit einer anderen Nummer an der Tür: „${first.choiceText}“`
    : 'Eine Gestalt an der Wand bewegt sich, geduldig, wartet auf eine Entscheidung, die sie schon kennt.';
});
register(roomBeatKey('the-usual-suite', 0, 3), 'v2', 'de', (s: RunState) => {
  const moments = pickShadowMoments(s.prior);
  const middle = moments[1];
  return middle
    ? `Eine weitere Gestalt, mitten im Spiel: „${middle.choiceText}“ Es ist nicht ähnlich zu dem, woran du dich erinnerst, getan zu haben. Es ist genau dasselbe.`
    : 'Eine weitere Gestalt, mitten im Spiel, in einem Zimmer, das du nicht ganz wiedererkennst und irgendwie doch schon kennst.';
});
register(roomBeatKey('the-usual-suite', 0, 4), 'v2', 'de', (s: RunState) => {
  const moments = pickShadowMoments(s.prior);
  const last = moments[2];
  return last
    ? `Die letzte Gestalt, dem Licht am nächsten: „${last.choiceText}“ Du erkennst deine eigene Haltung in der Silhouette, bevor du die Entscheidung erkennst.`
    : 'Die letzte Gestalt, dem Licht am nächsten, hält eine Haltung, die du erkennst, bevor du weißt, warum.';
});

// ---------- The Usual Room (gate) ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-usual-room', 0, 0)]:
    'Der Portier hat die heutige Zimmerzuteilung schon im Voraus eingetragen. Er hat sich noch nie geirrt. Gleiches Stockwerk, gleiche Ecke, gleicher Blick auf den Lichtschacht — das Zimmer, das du immer nimmst.',
  [roomBeatKey('the-usual-room', 0, 2)]:
    'Instinktiv greifst du nach einem anderen Schlüssel. Neben dem Haken am Brett hängt eine kleine gedruckte Notiz: „greift zuerst nach 4B — um es zu testen.“',
  [roomBeatKey('the-usual-room', 0, 3)]: 'Ein voller Takt Panik darüber, berechenbar zu sein, noch vor allem anderen. Das Zimmer lässt es einfach so stehen.',
  [roomBeatKey('the-usual-room', 0, 4)]: 'Eine Unterscheidung, angeboten statt aufgezwungen: berechenbar ist nicht automatisch dasselbe wie unfrei.',
  [roomBeatKey('the-usual-room', 0, 5)]: 'Portier: „Ich sage Gäste nicht voraus. Ich lese Handschrift. Deine ist leserlich. Das ist nicht dasselbe wie fertig.“',
  [roomChoiceTextKey('the-usual-room', 'defiant-different')]: 'Verlang ein anderes Zimmer. Irgendein anderes Zimmer.',
  [roomChoiceHintKey('the-usual-room', 'defiant-different')]: 'Die Zuteilung aus Prinzip ablehnen',
  [roomChoiceOutcomeKey('the-usual-room', 'defiant-different', 0)]:
    'Das neue Zimmer, trotzig durchschlafen. Bequem genug, fremd genug, um wie eine Aussage zu wirken.',
  [roomChoiceOutcomeKey('the-usual-room', 'defiant-different', 1)]:
    'Die nächste Zeile auf dem Brett, trotzdem für dich entfaltet: „Trotz — der leserlichste Strich in dieser Handschrift.“ Auflehnung erweist sich als die Lieblingsverkleidung des Musters.',
  [roomChoiceTextKey('the-usual-room', 'refuse-all-rooms')]: 'Schlaf in der Lobby. Steig ganz aus dem Kontobuch aus.',
  [roomChoiceHintKey('the-usual-room', 'refuse-all-rooms')]: 'Sich weigern teilzunehmen',
  [roomChoiceOutcomeKey('the-usual-room', 'refuse-all-rooms', 0)]:
    'Das Brett, umgedreht, hatte die ganze Zeit dort stehen: „versucht es mit der Lobby — geschätzte Dauer: eine Nacht.“',
  [roomChoiceOutcomeKey('the-usual-room', 'refuse-all-rooms', 1)]: 'Enthaltung ist, wie sich zeigt, auch ein Zug. Der Portier bringt wortlos eine Decke.',
  [roomChoiceTextKey('the-usual-room', 'take-it-knowingly')]:
    'Nimm das übliche Zimmer — mit Absicht. „Es sollte immer dieses Zimmer sein, und ich wähle es.“',
  [roomChoiceHintKey('the-usual-room', 'take-it-knowingly')]: 'Sich das Muster zu eigen machen, statt dagegen anzukämpfen',
  [roomChoiceOutcomeKey('the-usual-room', 'take-it-knowingly', 0)]:
    'Derselbe Schlüssel, diesmal von einer anderen Hand gedreht. „Das Muster führt durch das Entscheiden hindurch“, sagt der Portier, „nicht darum herum.“',
  [roomChoiceOutcomeKey('the-usual-room', 'take-it-knowingly', 1)]: 'Das Nächste, was er zu einem Lächeln hat. Das Tor öffnet sich.',
  [roomChoiceTextKey('the-usual-room', 'room-with-no-number')]: 'Bitte um das Zimmer ohne Nummer.',
  [roomChoiceHintKey('the-usual-room', 'room-with-no-number')]: 'Nach der Option fragen, die nicht auf dem Brett steht',
  [roomChoiceOutcomeKey('the-usual-room', 'room-with-no-number', 0)]: 'Ein solches Zimmer gibt es. Ein Wäscheschrank, mit einem Stuhl darin, völlig unauffällig.',
  [roomChoiceOutcomeKey('the-usual-room', 'room-with-no-number', 1)]:
    '„Gäste, die um das Zimmer ohne Nummer bitten, stehen auch auf dem Brett“, merkt der Portier an: „wählt Rätsel statt Bedeutung; nimmt sich die Ersatzdecke.“ Ein Menü mit „keines von alledem“ darauf ist, bemerkenswerterweise, immer noch ein Menü.',
  [roomExplanationKey('the-usual-room', 0)]:
    'Bindungsforschung findet echte Kontinuität — früh erlernte Muster halten messbar über verschiedene Beziehungen und Jahre hinweg an, was beim ersten Begegnen wie eine lebenslange Strafe wirken kann. Dieselbe Literatur dokumentiert auch „erarbeitete Sicherheit“: Menschen, die sich zu stabileren Mustern hin bewegen, meist durch Beziehungen oder Therapie, die genug ehrliches Testen überstehen, um das zugrunde liegende Modell tatsächlich zu überarbeiten. Berechenbar und frei liest man am besten als Beschreibungen auf zwei verschiedenen Höhenebenen, nicht als Gegensätze — eine Entscheidung kann zugleich vom Muster vorhergesehen und wirklich, gerade jetzt, deine eigene sein.',
  [roomNoteTitleKey('the-usual-room')]: 'Leserliche Handschrift',
  [roomNoteThinkersKey('the-usual-room')]: 'Studien zur Bindungskontinuität · Forschung zu erarbeiteter Sicherheit',
  [roomNoteBodyKey('the-usual-room')]:
    'Die Langzeit-Bindungsforschung findet echte Kontinuität in beide Richtungen: frühe Muster sagen mit messbarer Verlässlichkeit späteres Beziehungsverhalten voraus, und — ebenso messbar — Menschen bewegen sich zu „erarbeiteter Sicherheit“ hin, durch Beziehungen und Erfahrungen, die genug ehrliches Testen überstehen, um das zugrunde liegende Modell tatsächlich zu überarbeiten. **Berechenbar und frei sind keine Gegensätze; es sind Beschreibungen, die auf zwei verschiedenen Höhenebenen derselben Entscheidung laufen.** Die kompatibilistische Rahmung hier ist, mit Quellenangabe, aus dem philosophischen Flügel eines anderen Hotels ein Stück weiter den Flur hinunter geliehen: Diese Notiz solltest du immer schon lesen. Und du hast dich gerade auch selbst dafür entschieden. Beide Einträge, ein Kontobuch.',
});
register(roomBeatKey('the-usual-room', 0, 1), 'v2', 'de', (s: RunState) =>
  (s.prior?.runs ?? 0) >= 1
    ? 'Die Historie, offen im Kontobuch: jeder frühere Aufenthalt, jede Zuteilung, alles korrekt — am Rand siehst du deine eigene Handschrift, von früher.'
    : 'Die Historie, offen im Kontobuch, wartend auf ihren ersten Eintrag — heute Abend wird die erste Zeile sein, und der Portier scheint schon ungefähr zu wissen, was darin stehen wird.',
);
