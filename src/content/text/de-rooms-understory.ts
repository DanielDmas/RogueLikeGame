// German translation of the v2 room prose (beats, choice text/hint/outcome,
// field notes, explanations) for Act V, The Understory. Registered under
// version 'v2'. Translated from the English v2 source directly, per
// CLAUDE.md's context-first rule. State-reactive (dynamic) beats live in
// de-dynamic.ts: the-archive stage0 beat 3, the-unchosen stage0 beats 2/3
// and choice 'enter-it' outcome 0, the-echo stage0 beats 2/3/4.
import { registerAll } from '../../engine/text/resolver';
import {
  roomBeatKey,
  roomChoiceHintKey,
  roomChoiceOutcomeKey,
  roomChoiceTextKey,
  roomExplanationKey,
  roomNoteBodyKey,
  roomNoteThinkersKey,
  roomNoteTitleKey,
} from '../../engine/text/keys';

// ---------- Act V: The Archive ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-archive', 0, 0)]: 'Eine Treppe hinunter, die hier eigentlich nichts zu suchen hat, in einen langen, niedrigen Raum, ausgekleidet mit identischen grauen Kisten — eine ganze Wand davon, jede beschriftet mit einer Handschrift, zu ordentlich, um jemand anderem als der Einrichtung selbst zu gehören.',
  [roomBeatKey('the-archive', 0, 1)]: 'Ein Regal trägt eine einzige, neuere Kiste: Ihre. Sie ist mit einem Datum beschriftet, das Sie als ein Ende erkennen, und darunter, in kleinerer Schrift: VOLLSTÄNDIG. ABGELEGT. NICHT VERGESSEN.',
  [roomBeatKey('the-archive', 0, 2)]: 'Auf dem Lesetisch daneben ist eine Kiste bereits geöffnet — jemand, oder etwas, wählte dies, bevor Sie ankamen — und darin eine Karte, getippt, die einen einzigen Moment aus dem Gang zitiert, den Sie bereits beendet haben.',
  [roomBeatKey('the-archive', 0, 4)]: 'An die Kiste geheftet, trägt ein Aufnahmeformular noch die Beschreibung, die Sie einst von sich selbst gaben: „{blurb}“ Die Einrichtung legte es ohne Kommentar ab, was entweder Respekt oder ein Ablagefehler ist; von hier aus sehen die beiden identisch aus.',
  [roomBeatKey('the-archive', 0, 5)]: 'Platzanweiser: (aus der Tür, Hut unter dem Arm) Ich komme nicht oft hier herunter. Es ist nicht verboten — nichts hier ist verboten —, es ist nur so, dass die meisten Reisenden nur einmal besuchen wollen, wenn überhaupt. Dem Archiv ist es so oder so gleich. Es hat sonst nirgendwo zu sein.',
  [roomChoiceTextKey('the-archive', 'stand-by-it')]: '„Das war ich. Ich stehe dazu — zu allem davon.“ Unterschreiben Sie die Karte selbst, unter dem Druck.',
  [roomChoiceHintKey('the-archive', 'stand-by-it')]: 'Stehen Sie dazu — die schwerste Art von Unterschrift.',
  [roomChoiceOutcomeKey('the-archive', 'stand-by-it', 0)]: 'Sie nehmen den am Regal angeketteten Stift und unterschreiben unter der getippten Zeile, in Ihrer eigenen Handschrift, die die Kiste anscheinend erwartet hatte.',
  [roomChoiceOutcomeKey('the-archive', 'stand-by-it', 1)]: 'Platzanweiser: Nicht jeder Reisende unterschreibt. Die meisten lesen die Karte, zucken zusammen, und weichen zurück, als könnte die Tinte noch nass genug sein, um sich zu ändern. Sie fügten Ihren Namen zu einer Entscheidung hinzu, die bereits geschehen ist. Ich weiß nicht, was das kostet. Ich weiß, dass es nicht nichts ist.',
  [roomChoiceTextKey('the-archive', 'disown-it')]: '„Das klingt nicht mehr nach mir.“ Lassen Sie die Karte unterschriftslos, und treten Sie zurück von der Kiste.',
  [roomChoiceHintKey('the-archive', 'disown-it')]: 'Lassen Sie die Distanz echt sein, nicht nur bequem.',
  [roomChoiceOutcomeKey('the-archive', 'disown-it', 0)]: 'Sie lassen die Karte genau so, wie Sie sie fanden, und treten einen vollen Schritt zurück vom Regal, so wie Sie vielleicht von einem Fremden zurücktreten würden, der zufällig Ihre Mantelgröße trägt.',
  [roomChoiceOutcomeKey('the-archive', 'disown-it', 1)]: 'Platzanweiser: Das Verzeichnis streitet nicht mit Ihnen. Das tut es selten. Es hält nur fest, was geschah, abgelegt unter dem Datum, an dem es geschah — ob die Hand, die es tat, noch auf Ihren Namen hört oder nicht.',
  [roomChoiceTextKey('the-archive', 'refile-it')]: 'Schließen Sie die Kiste sanft, ohne Kommentar in beide Richtungen, und schieben Sie sie zurück an ihren Platz im Regal.',
  [roomChoiceHintKey('the-archive', 'refile-it')]: 'Weder verteidigen noch verleugnen. Ablegen.',
  [roomChoiceOutcomeKey('the-archive', 'refile-it', 0)]: 'Sie schließen den Deckel, vorsichtig, so wie Sie ein Buch mitten im Satz aus Respekt vor einem Kapitel schließen würden, statt aus Zustimmung dazu, und legen sie zurück an ihren Platz unter all den anderen.',
  [roomChoiceOutcomeKey('the-archive', 'refile-it', 1)]: 'Platzanweiser: Das, glaube ich, ist der eigentliche Zweck des Regals. Kein Urteil in beide Richtungen — ein Ort, um etwas abzulegen, ohne entschieden haben zu müssen, was es war.',
  [roomChoiceTextKey('the-archive', 'pin-the-corner')]: 'Heften Sie die unverbrannte Ecke der Fotografie an den Rand der offenen Kiste — eine Ergänzung zum Verzeichnis.',
  [roomChoiceHintKey('the-archive', 'pin-the-corner')]: 'Fügen Sie der Akte hinzu, statt sie zu unterschreiben oder abzulehnen.',
  [roomChoiceOutcomeKey('the-archive', 'pin-the-corner', 0)]: 'Sie drücken die kleine zerrissene Ecke mit dem Daumen gegen die Karte, bis sie hält, eine Ergänzung, um die Sie niemand gebeten hat und die niemand von Ihnen rechtfertigen verlangen wird.',
  [roomChoiceOutcomeKey('the-archive', 'pin-the-corner', 1)]: 'Das Archiv akzeptiert sie genau so, wie Archive alles akzeptieren — ohne Kommentar, ohne Einwand, und, bemerken Sie, ohne dies je zu benötigen.',
  [roomExplanationKey('the-archive', 0)]: 'Ihnen wird eine abgelegte, datierte Aufzeichnung einer Entscheidung gezeigt, die Sie auf Ihrer letzten Reise durch diesen Ort getroffen haben, Ihnen kalt vorgelesen, ohne jeglichen Kontext, der sie damals vernünftig erscheinen ließ. Stehen Sie noch dazu, distanzieren Sie sich davon, oder akzeptieren Sie einfach, dass es geschah, ohne es in die eine oder andere Richtung vollständig zu beurteilen? Es geht darum, wie wir uns zu unseren eigenen vergangenen Fehlern oder Entscheidungen verhalten, sobald Zeit vergangen ist — wie das Lesen eines alten Tagebucheintrags oder einer alten Textnachricht, die Sie geschickt haben, ohne ganz sicher zu sein, dass die Person, die es schrieb, und die Person, die es jetzt liest, wirklich dieselbe sind.',
  [roomNoteTitleKey('the-archive')]: 'Über das Führen von Akten',
  [roomNoteThinkersKey('the-archive')]: 'Paul Ricœur (1990), narrative Identität',
  [roomNoteBodyKey('the-archive')]: 'Paul Ricœur argumentierte, dass ein Selbst kein Ding ist, das man durch Introspektion lokalisiert — es ist eine Erzählung, die man ständig weiter verfasst, die Handlung revidierend, ohne das Buch je zu beenden. Er nannte dies narrative Identität: Anders als ein bloßes Objekt, dessen Gleichheit darin liegt, sich nie zu verändern, liegt die Gleichheit eines Selbst darin, sich verändern zu können und es trotzdem dieselbe Geschichte zu nennen. Dieser Raum inszeniert die Konfrontation, die Ricœurs Theorie überstehen sollte: eine spezifische, datierte, abgelegte Tat, Ihnen kalt vorgelesen, ohne die umgebenden Kapitel, die sie damals unausweichlich erscheinen ließen. Sie zu besitzen, sie abzulehnen und sie ohne Urteil abzulegen, sind drei verschiedene Beziehungen zur Urheberschaft — und Ricœurs eigene Antwort liegt näher an der dritten als an einer der ersten beiden. **Sie sind nicht verpflichtet, noch jeden Satz zu billigen, den Sie geschrieben haben. Nur zuzugeben, dass Sie derjenige sind, der noch immer den Stift hält.**',
});

// ---------- Act V: The Unchosen ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-unchosen', 0, 0)]: 'Ein Korridor, an den Sie sich nicht erinnern, jemals durchquert zu haben, gesäumt von Türen, die leicht offen stehen — nicht einladend. Nur offen, so wie eine Tür offen bleibt, wenn sich sehr lange niemand die Mühe gemacht hat, sie zu schließen.',
  [roomBeatKey('the-unchosen', 0, 1)]: 'Das sind die Türen von Ihrem letzten Gang hier hindurch, durch die Sie nie gegangen sind. Die Einrichtung hielt sie genau so, wie Sie sie verließen: unbetreten, unentschieden, technisch noch verfügbar, auf die spezifische Weise, wie ein verpasster Zug technisch immer noch ein Zug ist.',
  [roomBeatKey('the-unchosen', 0, 4)]: 'Platzanweiser: Ich würde nicht zu viel in die Wahl hineinlesen. Oder ich würde es ganz und gar tun — ich konnte mich noch nie entscheiden, welcher Rat schlechter ist.',
  [roomChoiceTextKey('the-unchosen', 'enter-it')]: 'Schieben Sie sie den Rest des Weges auf. Gehen Sie hinein.',
  [roomChoiceHintKey('the-unchosen', 'enter-it')]: 'Neugier, spät geehrt.',
  [roomChoiceOutcomeKey('the-unchosen', 'enter-it', 1)]: 'Was auch immer hier geschehen sollte, geschah vermutlich bereits, jemandem, oder niemandem, oder die Frage lief einfach ab, so wie ungeöffnete Post irgendwann aufhört, dringend zu sein. Sie ist kleiner, als Sie sie sich aufgebaut haben. Die meisten ungelebten Dinge sind das.',
  [roomChoiceOutcomeKey('the-unchosen', 'enter-it', 2)]: 'Platzanweiser: Das ist der gängige Kurs für eine geschlossen gelassene Tür. Keine Tragödie — nur ein Raum, der über seinen eigenen Anlass hinaus wartet. Manche Reisende finden das eine Erleichterung.',
  [roomChoiceTextKey('the-unchosen', 'close-it')]: 'Schließen Sie sie den Rest des Weges. Manche Türen sind ehrlich gesagt besser als Türen belassen.',
  [roomChoiceHintKey('the-unchosen', 'close-it')]: 'Respektieren Sie ihre Vergangenheit.',
  [roomChoiceOutcomeKey('the-unchosen', 'close-it', 0)]: 'Sie drücken sie sanft zu, so wie Sie eine Tür zu einem Raum schließen würden, in dem jemand endlich, tatsächlich schläft.',
  [roomChoiceOutcomeKey('the-unchosen', 'close-it', 1)]: 'Platzanweiser: Der richtige Instinkt, wohl. Nicht jede ungeöffnete Tür ist ein wartendes Bedauern. Manche sind einfach Türen, die Sie zu Recht beim ersten Mal in Ruhe ließen, ob Sie es damals wussten oder nicht.',
  [roomChoiceTextKey('the-unchosen', 'read-the-hinges')]: '„Warum hast du dich gerade jetzt, ausgerechnet jetzt, wieder geöffnet?“ Fragen Sie die Tür selbst.',
  [roomChoiceHintKey('the-unchosen', 'read-the-hinges')]: 'Verhören Sie das Angebot, nicht nur den Raum.',
  [roomChoiceOutcomeKey('the-unchosen', 'read-the-hinges', 0)]: 'Sie bekommen nicht wirklich eine Antwort — Türen, selbst hier, sind nicht von Natur aus mitteilsam —, aber Sie bemerken, dass die Scharniere kürzlich geölt wurden. Jemand, oder etwas, wollte diese Tür heute Nacht speziell leicht beweglich haben.',
  [roomChoiceOutcomeKey('the-unchosen', 'read-the-hinges', 1)]: 'Platzanweiser: Eine faire Frage, und ich habe nicht die ehrliche Version der Antwort. Meine beste Vermutung: Die Einrichtung bietet Ihnen die Tür an, deren Nicht-Öffnen Sie jetzt bereit sind zu überleben. Sie hat mir ihr Timing auch noch nie erklärt.',
  [roomExplanationKey('the-unchosen', 0)]: 'Ihnen werden die Türen gezeigt, an denen Sie auf Ihrer letzten Reise hier vorbeigingen, ohne sie zu öffnen — Wege, die Sie nie genommen haben, jetzt für immer unbekannt. Eine von ihnen öffnet sich von selbst wieder knarrend. Es geht um die seltsame Anziehungskraft des „nicht genommenen Weges“: Schauen Sie endlich hinein, aus purer Neugier, jetzt, wo es Sie nichts kostet? Oder lassen Sie sie geschlossen und entscheiden, dass nicht jede ungeöffnete Tür heimlich eine verpasste Gelegenheit war? Die meisten Menschen fragen sich, wenn sie auf ihr Leben zurückblicken, über mindestens einen Weg, den sie nicht genommen haben — dieser Raum macht dieses Gefühl nur wörtlich.',
  [roomNoteTitleKey('the-unchosen')]: 'Der nicht genommene Weg, geprüft',
  [roomNoteThinkersKey('the-unchosen')]: 'Søren Kierkegaard (1844) · Robert Frost (1916), das Gedicht als Vorsicht missverstanden',
  [roomNoteBodyKey('the-unchosen')]: 'Søren Kierkegaard nannte Möglichkeit das Schwindelerregendste, was einem Menschen zur Verfügung steht — schwindelerregender als jede tatsächliche Gefahr, weil das Tatsächliche zumindest endlich ist, während das Mögliche sich grenzenlos vervielfacht, je länger man an einer Gabelung steht und sich weigert zu wählen. Angst ist für Kierkegaard das Gefühl der Freiheit, die nach unten blickt. Robert Frosts „Der nicht genommene Weg“ wird bei fast jeder Abschlussfeier als Hymne für mutige Abweichung falsch zitiert — „der weniger begangene, / und das machte den ganzen Unterschied“ — aber das Gedicht selbst ist weit raffinierter: Die beiden Wege sind, wie der Sprecher zwei Strophen zuvor zugibt, „wirklich etwa gleich“ abgenutzt, und der wehmütige Seufzer am Ende wird im Voraus als etwas gestanden, das der Sprecher „mit einem Seufzer / irgendwo in ferner Zukunft“ erzählen wird — eine Geschichte, geformt durch Rückblick, keine an der Gabelung berichtete Wahrheit. **Die Türen in diesem Korridor waren nie heimlich besser. Sie waren einfach, kurz, möglich — und Möglichkeit behält, einmal geschlossen, keine ihrer Quittungen, nur ihre Gerüchte.**',
});

// ---------- Act V: The Echo ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-echo', 0, 0)]: 'Ein karger Raum. Zwei Stühle, einander zugewandt, nah genug, dass wer auch immer auf einem von beiden sitzt, eindeutig gehört werden soll.',
  [roomBeatKey('the-echo', 0, 1)]: 'Der andere Stuhl ist besetzt. Nicht von einer Person — der Raum ist sorgfältig darin, präzise zu sein, präzise auf die Weise, wie es nur ein Ort sein kann, der nichts vom Lügen hat — sondern von einer Stimme, geduldig zusammengesetzt aus dem, was Sie sagten und wählten, als Sie das letzte Mal hier waren.',
  [roomBeatKey('the-echo', 0, 5)]: 'Platzanweiser: Bei dem hier sitze ich nicht dabei. Was auch immer Sie beide hier drin tun, es war nie meine Aufgabe, den Schiedsrichter zu spielen.',
  [roomChoiceTextKey('the-echo', 'answer-it')]: '„Ich höre dich.“ Sprechen Sie zurück zu dem, der Sie waren.',
  [roomChoiceHintKey('the-echo', 'answer-it')]: 'Sprechen Sie es an, nicht nur bezeugen Sie es.',
  [roomChoiceOutcomeKey('the-echo', 'answer-it', 0)]: 'Sie sagen es — keine Korrektur, keine Entschuldigung, nur eine Anerkennung, so wie Sie jemanden an einer Tür begrüßen würden, bei dem Sie nicht sicher waren, ob er Sie noch erkennen würde.',
  [roomChoiceOutcomeKey('the-echo', 'answer-it', 1)]: 'Der andere Stuhl antwortet nicht wirklich zurück. Aber etwas im Raum legt sich, so wie ein angehaltener Atem, wenn er endlich absichtlich losgelassen wird, von zwei Menschen statt von einem.',
  [roomChoiceTextKey('the-echo', 'sit-in-silence')]: 'Setzen Sie sich ihr gegenüber und sagen Sie nichts. Lassen Sie sie diesmal ungestört zu Ende sprechen.',
  [roomChoiceHintKey('the-echo', 'sit-in-silence')]: 'Bezeugen, ohne zu antworten.',
  [roomChoiceOutcomeKey('the-echo', 'sit-in-silence', 0)]: 'Sie setzen sich. Sie lassen sie sprechen, ganz bis zum Ende, ohne ein einziges Wort zu korrigieren — was, wie Sie bemerken, auch beim ersten Mal nicht immer gelang.',
  [roomChoiceOutcomeKey('the-echo', 'sit-in-silence', 1)]: 'Die Stille ist nicht leer. Sie ist, wenn überhaupt, das Vollständigste, was im Raum gesagt wurde.',
  [roomChoiceTextKey('the-echo', 'take-both-chairs')]: '„Hier drin war nie sonst jemand.“ Setzen Sie sich abwechselnd auf beide Stühle, und meinen Sie es.',
  [roomChoiceHintKey('the-echo', 'take-both-chairs')]: 'Die kostspieligste Lesart: kein Besucher, nur Sie.',
  [roomChoiceOutcomeKey('the-echo', 'take-both-chairs', 0)]: 'Sie setzen sich auch kurz auf den zweiten Stuhl und probieren die Stimme an wie einen Mantel, den Sie früher besaßen — und er passt, genau, was entweder tröstlich ist oder das ganze Problem, je nach Tageszeit.',
  [roomChoiceOutcomeKey('the-echo', 'take-both-chairs', 1)]: 'Es gab hier nie einen Gast zu unterhalten. Nur eine Reihe von Ihnen, abgelegt unter demselben Namen, die sich abwechselten, den Stift zu halten.',
  [roomExplanationKey('the-echo', 0)]: 'Ihnen gegenüber sitzt eine Stimme, die vollständig aus Dingen zusammengesetzt ist, die Sie sagten und wählten, als Sie das letzte Mal hier waren — kein Geist, nur ein Echo einer früheren Version von sich selbst. Sprechen Sie zurück, sitzen Sie still und hören Sie einmal wirklich zu, oder erkennen Sie, dass eigentlich nie sonst jemand im Raum war — nur Sie, zu zwei verschiedenen Zeiten? Es geht darum, ob das „Sie“ aus Ihrer Vergangenheit und das „Sie“ gerade jetzt wirklich dieselbe Person sind, oder eher zwei verschiedene Kapitel desselben Buches, die sich für einen Moment treffen.',
  [roomNoteTitleKey('the-echo')]: 'Gespräche mit einem früheren Bewohner',
  [roomNoteThinkersKey('the-echo')]: 'David Hume (1739) · Galen Strawson (1997), das Bündel-Selbst und seine Kritiker',
  [roomNoteBodyKey('the-echo')]: 'David Hume durchsuchte seinen eigenen Geist nach einem kontinuierlichen Selbst und berichtete, nur ein Bündel von Wahrnehmungen gefunden zu haben — kein Faden, der darunter läuft, nur eine Erfahrung nach der anderen, eng genug gepackt, um sich wie eine Person anzufühlen. Galen Strawson nahm das Bündel ernst als Beschreibung der Erfahrung selbst: Viele von uns, argumentierte er, fühlen sich tatsächlich nicht kontinuierlich mit dem, wer wir vor Jahren oder sogar Stunden waren — das psychologische Selbst ist oft „episodisch“, erneuert sich in kürzeren, lokaleren Ausbrüchen, als das Modell der narrativen Identität annimmt, ohne dass ein einzelner Faden erforderlich wäre, um einen gegebenen Ausbruch zu einem echten Selbst zu machen. Die Stimme im anderen Stuhl ist keine Heimsuchung; sie ist, was von einem solchen Ausbruch übrig ist, genau und ohne Bosheit abgelegt. Ob Sie antworten, aussitzen oder zugeben, dass es nur einen Bewohner gab, der Raum stellt dieselbe Frage auf drei Arten: **Ist der, der jetzt zuhört, derselbe, der damals sprach — oder einfach der nächste Bewohner, der den vorherigen Mietvertrag mit ungewöhnlicher Aufmerksamkeit liest?**',
});
