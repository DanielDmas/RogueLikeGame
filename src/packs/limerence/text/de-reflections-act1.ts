// German translations for LIMERENCE Act I's Examined Path reflections (spec
// 05). Every line is translated with the specific room's actual situation
// and the choice's real stakes in mind, not word-for-word from English —
// see CLAUDE.md's translation rule and de-rooms.ts's header for the Sie/du
// decision (informal "du" throughout). The-front-desk (prologue) and
// the-summer-ends have no reflections field on any choice in the English
// source, so neither room appears here.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'de', {
  // ---------- The Read Receipt ----------
  [reflectionKey('the-read-receipt', 'double-text', 'consequence')]:
    'Zwei weitere Nachrichten lassen die Antwort nicht schneller kommen — sie machen nur das Schweigen, wenn es bricht, schwerer zu lesen.',
  [reflectionKey('the-read-receipt', 'double-text', 'duty')]: 'Du schuldest ihr Geduld, nicht eine zweite Vorladung.',
  [reflectionKey('the-read-receipt', 'double-text', 'virtue')]:
    'Achte darauf, was für einen Partner die Panik um ein Uhr nachts, allein, aus dir macht.',
  [reflectionKey('the-read-receipt', 'double-text', 'care')]:
    'Sie ist heute Nacht irgendwo mit einem eigenen Grund — einem, der auch mit der zweiten Nachricht nichts zu tun hat.',
  [reflectionKey('the-read-receipt', 'drawer', 'consequence')]:
    'Das Ergebnis lag heute Nacht sowieso nie in deiner Hand; damit zu sitzen hat am Morgen nichts geändert — und an der Nacht alles.',
  [reflectionKey('the-read-receipt', 'drawer', 'duty')]: 'Niemandem stand eine Nachricht zu, die sie sich noch nicht verdient hatte.',
  [reflectionKey('the-read-receipt', 'drawer', 'virtue')]:
    'Das ist die härtere, leisere Disziplin — ein Gefühl auszuhalten, statt es an jemand anderem abzuladen.',
  [reflectionKey('the-read-receipt', 'drawer', 'care')]:
    'Du hast ihr einen ganz gewöhnlichen, unbeobachteten Abend gelassen — schon das ist ein kleines Geschenk.',
  [reflectionKey('the-read-receipt', 'bait', 'consequence')]:
    'Eine Antwort, erzwungen durch inszenierte Dringlichkeit, beweist nichts außer, dass Dringlichkeit Antworten erzeugt.',
  [reflectionKey('the-read-receipt', 'bait', 'duty')]:
    'Eine Beziehung, die auf Tests läuft, ist eine, aus der die Ehrlichkeit sich still verabschiedet hat.',
  [reflectionKey('the-read-receipt', 'bait', 'virtue')]:
    'Das ist die erste kleine Probe für einen Menschen, der andere steuert, statt ihnen zu vertrauen.',
  [reflectionKey('the-read-receipt', 'bait', 'care')]:
    'Sie hat auf eine Angst geantwortet, nicht auf eine Frage, die du ihr wirklich gestellt hast.',
  [reflectionKey('the-read-receipt', 'ask-tomorrow', 'consequence')]:
    'Ein einziges Gespräch hat gelöst, was ein Dutzend Runden Punkte-Anstarren nicht konnte.',
  [reflectionKey('the-read-receipt', 'ask-tomorrow', 'duty')]:
    'Eine direkte Frage respektiert euch beide mehr als ein entschlüsseltes Schweigen.',
  [reflectionKey('the-read-receipt', 'ask-tomorrow', 'virtue')]:
    'Auf die echte Antwort zu warten, statt sich selbst eine zu basteln, ist eine eigene Art von Mut.',
  [reflectionKey('the-read-receipt', 'ask-tomorrow', 'care')]:
    'Du hast sie sich mit eigenen Worten erklären lassen, bei Tageslicht, ohne Überfall.',

  // ---------- The Screenshot ----------
  [reflectionKey('the-screenshot', 'tell-nadia', 'consequence')]:
    'Nadia hat jetzt die Information, die sie zum Handeln braucht — welchen Schaden die Wahrheit auch anrichtet, er wäre sowieso irgendwann eingetreten; du hast nur den Zeitpunkt gewählt.',
  [reflectionKey('the-screenshot', 'tell-nadia', 'duty')]: 'Das stand ihr zu, ganz einfach und ohne Abstimmung.',
  [reflectionKey('the-screenshot', 'tell-nadia', 'virtue')]:
    'Das ist die schwierigere Loyalität — zu der Person, die belogen wird, nicht zu der, die du länger kennst.',
  [reflectionKey('the-screenshot', 'tell-nadia', 'care')]:
    'Du hast die Person in den Mittelpunkt gestellt, der wirklich wehgetan wird, nicht die beiden Freundschaften, die es dafür schlechter überstehen.',
  [reflectionKey('the-screenshot', 'confront-tom', 'consequence')]:
    'Tom zuerst die Wahl zu lassen ändert nur, wer es erzählt — nicht, ob Nadia es irgendwann erfährt.',
  [reflectionKey('the-screenshot', 'confront-tom', 'duty')]:
    'Du hast deinem Freund die Chance gegeben, es selbst geradezubiegen, bevor du ihm die Entscheidung abgenommen hast.',
  [reflectionKey('the-screenshot', 'confront-tom', 'virtue')]:
    'Ein Ultimatum hat nur dann Integrität, wenn du es wirklich durchziehen würdest — frag dich ehrlich, ob du das getan hättest.',
  [reflectionKey('the-screenshot', 'confront-tom', 'care')]:
    'Du hast versucht, zwei Beziehungen gleichzeitig zu schützen, und dieser Versuch kostet dich ein schwereres Gespräch.',
  [reflectionKey('the-screenshot', 'stay-out', 'consequence')]:
    'Sich rauszuhalten entfernt dich nicht aus dem Ergebnis; es entfernt dich nur davon, das Ergebnis zu beeinflussen.',
  [reflectionKey('the-screenshot', 'stay-out', 'duty')]:
    'Auch Schweigen ist hier eine Entscheidung mit einer Adressatin — Nadia weiß nur nicht, dass sie stellvertretend für sie getroffen wurde.',
  [reflectionKey('the-screenshot', 'stay-out', 'virtue')]:
    'Frag dich, was für einen Freund „nicht meine Sache“ aus dir macht — gegenüber der Freundin, die wirklich getäuscht wird.',
  [reflectionKey('the-screenshot', 'stay-out', 'care')]:
    'Du hast dir ein schweres Gespräch erspart, auf Kosten eines Gesprächs, das jemand anderem zugestanden hätte.',
  [reflectionKey('the-screenshot', 'verify-first', 'consequence')]:
    'Das Überprüfen hat das Risiko verringert, aufgrund von etwas Falschem zu handeln — zum realen Preis, später zu handeln, als du gekonnt hättest.',
  [reflectionKey('the-screenshot', 'verify-first', 'duty')]:
    'Sorgfalt ist eine Tugend, aber keine, die die Verzögerung gegenüber der Person entschuldigt, die noch im Dunkeln tappt.',
  [reflectionKey('the-screenshot', 'verify-first', 'virtue')]:
    'Vorsicht kann ihre eigene Art von Vermeidung sein, verkleidet als Verantwortungsbewusstsein.',
  [reflectionKey('the-screenshot', 'verify-first', 'care')]:
    'Die zusätzliche Stunde hat Nadia nichts gekostet, was sie nicht sowieso schon nicht wusste — aber sie hat dich die Möglichkeit gekostet, zu bestimmen, wie sie es erfährt.',

  // ---------- The Password ----------
  [reflectionKey('the-password', 'give-it', 'consequence')]:
    'Das unmittelbare Ergebnis — eine ruhigere Woche — ist echt; das längerfristige, eine Gewohnheit der Selbstzensur, ist es auch, und das Zimmer zeigt dir beides.',
  [reflectionKey('the-password', 'give-it', 'duty')]:
    'Ein Schlüssel, gegeben aus Angst statt aus Freiheit, hatte nie wirklich die Zustimmung des Teils von dir, der gezögert hat.',
  [reflectionKey('the-password', 'give-it', 'virtue')]:
    'Achte darauf, wer du wirst, wenn jede Nachricht mit einer stillen Mitleserin im Kopf geschrieben wird.',
  [reflectionKey('the-password', 'give-it', 'care')]:
    'Du hast die Distanz geschlossen, um die sie gebeten hat, aber die Art, wie du das getan hast, hat eine andere Distanz an ihre Stelle gesetzt.',
  [reflectionKey('the-password', 'refuse-flat', 'consequence')]:
    'Eine gehaltene Grenze kostet jetzt etwas und vermeidet etwas Schlimmeres später — das Zimmer bewertet beides ehrlich.',
  [reflectionKey('the-password', 'refuse-flat', 'duty')]: 'Du hast ihr Fürsorge geschuldet, keinen Zugang.',
  [reflectionKey('the-password', 'refuse-flat', 'virtue')]:
    'Das ist die schwierigere, unbequemere Integrität — die, die die Beziehung riskiert, um sich selbst zu bewahren.',
  [reflectionKey('the-password', 'refuse-flat', 'care')]:
    'Ein klares Nein, ohne Verachtung ausgesprochen, lässt trotzdem Raum, ihrer Angst auf andere Weise zu begegnen.',
  [reflectionKey('the-password', 'transparency-not-surveillance', 'consequence')]:
    'Jede Frage ehrlich zu beantworten erzeugt dieselbe Beruhigung wie ein Passwort — ohne dessen dauerhaften Preis.',
  [reflectionKey('the-password', 'transparency-not-surveillance', 'duty')]:
    'Du hast genau das angeboten, was geschuldet war: Offenheit. Nicht genau das, was verlangt wurde: Zugang.',
  [reflectionKey('the-password', 'transparency-not-surveillance', 'virtue')]:
    'Das ist die ruhigere, weniger dramatische Form von Vertrauenswürdigkeit — erreichbar, nicht überwacht.',
  [reflectionKey('the-password', 'transparency-not-surveillance', 'care')]:
    'Du bist ihrer Angst mit deiner Anwesenheit begegnet, nicht mit deiner Privatsphäre.',
  [reflectionKey('the-password', 'demand-hers', 'consequence')]:
    'Symmetrie hebt die Kosten der Überwachung nicht auf; sie verteilt sie nur auf euch beide.',
  [reflectionKey('the-password', 'demand-hers', 'duty')]: 'Eine schlechte Forderung zu spiegeln ist nicht dasselbe wie sie abzulehnen.',
  [reflectionKey('the-password', 'demand-hers', 'virtue')]:
    'Frag dich, was für eine Beziehung daraus wird, wenn beide Schlösser gleichzeitig fallen — aus Trotz, verkleidet als Fairness.',
  [reflectionKey('the-password', 'demand-hers', 'care')]:
    'Keiner von euch beiden ist dadurch wirklich beruhigt — ihr habt nur die Angst gegenseitig gemacht.',

  // ---------- The Party ----------
  [reflectionKey('the-party', 'play-and-bury', 'consequence')]:
    'Heute Nacht ändert sich sichtbar nichts, aber die Chance, dass es vergraben bleibt, lag nie ganz in deiner Hand.',
  [reflectionKey('the-party', 'play-and-bury', 'duty')]: 'Ein Geheimnis, das vor Sara bewahrt wird, ist trotzdem eine Entscheidung über sie, ohne sie.',
  [reflectionKey('the-party', 'play-and-bury', 'virtue')]:
    'Achte auf den Satz, den du dir gerade zurechtlegst — „es zählt nicht“ — und darauf, was für ein Mensch diesen Satz überzeugend findet.',
  [reflectionKey('the-party', 'play-and-bury', 'care')]:
    'Du hast heute Nacht deine eigene Bequemlichkeit geschützt, zu einem Preis, der, sollte es ans Licht kommen, ganz auf sie zurückfällt.',
  [reflectionKey('the-party', 'play-and-tell', 'consequence')]:
    'Es ihr zu erzählen macht den Kuss nicht ungeschehen, aber es ändert, was sie verarbeiten muss — nur die Tat, nicht auch noch den Verrat der Geheimhaltung obendrauf.',
  [reflectionKey('the-party', 'play-and-tell', 'duty')]:
    'Ihr stand die Wahrheit zu, und du hast sie geliefert, bevor sie dir abgerungen werden musste.',
  [reflectionKey('the-party', 'play-and-tell', 'virtue')]:
    'Das ist kostspielige Ehrlichkeit, gewählt zu einem Zeitpunkt, als sie noch vermeidbar gewesen wäre.',
  [reflectionKey('the-party', 'play-and-tell', 'care')]: 'Du hast ihr die Würde gegeben, es von dir zu hören, nicht Wochen später von einem Screenshot.',
  [reflectionKey('the-party', 'refuse', 'consequence')]: 'Das Verweigern kostet heute Nacht ein bisschen sozialen Status und morgen gar nichts mehr.',
  [reflectionKey('the-party', 'refuse', 'duty')]:
    'Du hast ein Versprechen gehalten, um das niemand ausdrücklich gebeten hatte, das aber trotzdem eindeutig geschuldet war.',
  [reflectionKey('the-party', 'refuse', 'virtue')]:
    'Das ist Charakter, der sich genau dann zeigt, wenn es am unbequemsten ist und am wenigsten von der Person gesehen wird, für die es gilt.',
  [reflectionKey('the-party', 'refuse', 'care')]:
    'Klaras Wohlbefinden stand hier so oder so nie wirklich auf dem Spiel — Saras Vertrauen, obwohl abwesend, aber schon.',
  [reflectionKey('the-party', 'leave', 'consequence')]:
    'Zu gehen löscht alle möglichen Ausgänge der Mutprobe auf einmal, sauber, bevor auch nur einer davon eintreten konnte.',
  [reflectionKey('the-party', 'leave', 'duty')]:
    'Du warst niemandem eine Erklärung schuldig dafür, dich zu weigern, in einem Raum zu sein, der genau für diese Prüfung gebaut war.',
  [reflectionKey('the-party', 'leave', 'virtue')]: 'Manchmal ist der ehrlichere Zug, dir selbst diese Entscheidung gar nicht erst zuzutrauen.',
  [reflectionKey('the-party', 'leave', 'care')]: 'Du hast allen — Klara, Sara, dir selbst — eine Szene erspart, die es nicht gebraucht hätte.',

  // ---------- The Forward ----------
  [reflectionKey('the-forward', 'delete-only', 'consequence')]:
    'Deine eigene Kopie zu löschen ändert nichts an den anderen neununddreißig Kopien, die noch unterwegs sind.',
  [reflectionKey('the-forward', 'delete-only', 'duty')]:
    'Schweigen entlastet deine eigene Beteiligung, aber nicht dein Wissen darüber, was ihr gerade noch angetan wird.',
  [reflectionKey('the-forward', 'delete-only', 'virtue')]:
    'Frag dich, was für ein Publikum dich der Satz „ich hab\'s wenigstens nicht weitergeleitet“ eigentlich sein lässt.',
  [reflectionKey('the-forward', 'delete-only', 'care')]:
    'Ema erfährt es trotzdem von jemand anderem, ohne Vorwarnung, ohne dass du das eine getan hast, das geholfen hätte.',
  [reflectionKey('the-forward', 'report', 'consequence')]:
    'Melden ist der einzige Weg mit einer echten Chance, die weitere Verbreitung zu stoppen — zu einem echten persönlichen Preis für dich.',
  [reflectionKey('the-forward', 'report', 'duty')]: 'Genau für diese Art von Handlung gibt es Gesetz und Schule überhaupt erst.',
  [reflectionKey('the-forward', 'report', 'virtue')]:
    'Das ist die unglamouröse, unbeliebte Form von Mut — die, für die du eine Woche lang blöd angemacht wirst.',
  [reflectionKey('the-forward', 'report', 'care')]:
    'Das ist die Version von Hilfe, die wirklich bei Ema ankommt, nicht nur die, bei der du selbst dich sauber fühlst.',
  [reflectionKey('the-forward', 'tell-ema-first', 'consequence')]:
    'Sie zuerst zu warnen ändert, womit sie konfrontiert wird — informiert, statt von ihrem eigenen Flur überrumpelt.',
  [reflectionKey('the-forward', 'tell-ema-first', 'duty')]:
    'Ihr stand die Wahrheit zu, bevor die Menge einen Vorsprung auf ihre Reaktion darauf bekam.',
  [reflectionKey('the-forward', 'tell-ema-first', 'virtue')]:
    'Das ist die Entscheidung, die dich in diesem Zimmer am meisten kostet und im Gegenzug nichts verlangt.',
  [reflectionKey('the-forward', 'tell-ema-first', 'care')]:
    'Von allem, was heute Nacht zur Wahl steht, ist das die Version, die ganz um das gebaut ist, was sie braucht — nicht um das, was für dich am leichtesten ist.',
  [reflectionKey('the-forward', 'confront-publicly', 'consequence')]:
    'Öffentliche Konfrontation mag die Verbreitung verlangsamen, aber sie vervielfacht auch die Aufmerksamkeit auf genau das, was du eigentlich stoppen willst.',
  [reflectionKey('the-forward', 'confront-publicly', 'duty')]:
    'Fehlverhalten zu benennen ist der Situation geschuldet — aber die Methode zählt genauso viel wie die Absicht.',
  [reflectionKey('the-forward', 'confront-publicly', 'virtue')]:
    'Das ist gerechter Zorn, der etwas tut — und das ist nicht automatisch dasselbe wie das Richtige zu tun.',
  [reflectionKey('the-forward', 'confront-publicly', 'care')]:
    'Die verletzlichste Person in dieser Geschichte hat kein Mitspracherecht darin, wie öffentlich mit ihrer Situation umgegangen wird.',

  // ---------- The Best Friend's Girl ----------
  [reflectionKey('the-best-friends-girl', 'confess-to-her', 'consequence')]:
    'Es ihr zu sagen riskiert eine Freundschaft und eine Beziehung für eine Information, die du im Grunde gar nicht haben musstest.',
  [reflectionKey('the-best-friends-girl', 'confess-to-her', 'duty')]:
    'Sie hatte ein Recht darauf zu wissen, was in einem Raum vor sich ging, in dem sie selbst saß.',
  [reflectionKey('the-best-friends-girl', 'confess-to-her', 'virtue')]:
    'Das ist Ehrlichkeit, die deiner eigenen Klarheit genauso dient wie ihr — es lohnt sich zu merken, welche davon du zuerst im Sinn hattest.',
  [reflectionKey('the-best-friends-girl', 'confess-to-her', 'care')]:
    'Überleg, was dieses Geständnis Nadia wirklich kostet, im Vergleich dazu, was es in dir erleichtert.',
  [reflectionKey('the-best-friends-girl', 'starve-it', 'consequence')]:
    'Abstand löst für niemand anderen etwas, aber er löst zuverlässig, irgendwann, den Zustand in dir selbst.',
  [reflectionKey('the-best-friends-girl', 'starve-it', 'duty')]: 'Du schuldest niemandem ein Geständnis für ein Gefühl, nach dem du nie gehandelt hast.',
  [reflectionKey('the-best-friends-girl', 'starve-it', 'virtue')]: 'Das ist stille Selbstführung — unglamourös, unbeobachtet, und sie funktioniert.',
  [reflectionKey('the-best-friends-girl', 'starve-it', 'care')]:
    'Niemand sonst in diesem Zimmer muss je das Gewicht eines Gefühls tragen, das nie seins war.',
  [reflectionKey('the-best-friends-girl', 'tell-tom', 'consequence')]:
    'Es Tom zu sagen, statt danach zu handeln oder es Nadia zu erzählen, hält den Schaden in der einen Beziehung, die dafür gebaut ist, ihn zu tragen.',
  [reflectionKey('the-best-friends-girl', 'tell-tom', 'duty')]:
    'Genau dafür ist echte Freundschaft da — das unbequeme Geständnis, angeboten statt aufgedeckt.',
  [reflectionKey('the-best-friends-girl', 'tell-tom', 'virtue')]:
    'Das hat mehr Nerven gekostet als Schweigen oder ein Geständnis gegenüber Nadia — es lohnt sich, das an dir selbst zu bemerken.',
  [reflectionKey('the-best-friends-girl', 'tell-tom', 'care')]:
    'Du hast Nadia vor einem Gefühl geschützt, das nie mit irgendetwas zu tun hatte, das sie getan hat, indem du es zu der einen Person geleitet hast, die dafür gewappnet ist.',
  [reflectionKey('the-best-friends-girl', 'test-the-evening', 'consequence')]:
    'Eine inszenierte Prüfung liefert keine echte Information — sie erzeugt nur eine neue, schwerer lesbare Situation für alle Beteiligten.',
  [reflectionKey('the-best-friends-girl', 'test-the-evening', 'duty')]:
    'Das hat Toms und Nadias Beziehung für deine eigene Unsicherheit riskiert, ohne ihr Wissen oder ihre Zustimmung.',
  [reflectionKey('the-best-friends-girl', 'test-the-evening', 'virtue')]:
    'Das ist die Version von dir, die Menschen steuert, statt ihnen zu vertrauen oder sie in Ruhe zu lassen.',
  [reflectionKey('the-best-friends-girl', 'test-the-evening', 'care')]:
    'Nadia wird hier zu einem Werkzeug deiner Neugier, und das ist keine Kleinigkeit, die du ihr angetan hast.',

  // ---------- The Rumor ----------
  [reflectionKey('the-rumor', 'trust-without-asking', 'consequence')]:
    'Du verzichtest ganz auf Gewissheit; was auch immer am See wirklich passiert ist, ändert nichts daran, wie du dich jetzt entscheidest, sie zu behandeln.',
  [reflectionKey('the-rumor', 'trust-without-asking', 'duty')]:
    'Ihr steht die Unschuldsvermutung zu, die ein bloßes Gerücht nie umstoßen kann.',
  [reflectionKey('the-rumor', 'trust-without-asking', 'virtue')]:
    'Das ist Vertrauen als eingeübte Disziplin, nicht als bequemes Gefühl — die schwierigere Version dieser Tugend.',
  [reflectionKey('the-rumor', 'trust-without-asking', 'care')]:
    'Du hast ihr ein Verhör erspart, das sie vielleicht nicht verdient hätte, um den Preis eines Zweifels, den du jetzt allein trägst, auf unbestimmte Zeit.',
  [reflectionKey('the-rumor', 'ask-her-plainly', 'consequence')]:
    'Du hast die Lähmung des Nicht-Wissens gegen eine Antwort eingetauscht, die du nicht unabhängig überprüfen kannst — ein echter, begrenzter Tausch.',
  [reflectionKey('the-rumor', 'ask-her-plainly', 'duty')]:
    'Ihr stand vor allem anderen eine direkte Frage zu — keine Falle, keine Mauer aus Schweigen, eine Frage.',
  [reflectionKey('the-rumor', 'ask-her-plainly', 'virtue')]:
    'Einmal offen zu fragen, und dann wirklich zuzuhören, ist schwerer, als es klingt, und seltener, als es sein sollte.',
  [reflectionKey('the-rumor', 'ask-her-plainly', 'care')]:
    'Sie weiß jetzt, dass das Gerücht dich erreicht hat und stundenlang in dir saß, bevor du gesprochen hast — auch das ist etwas, das sie tragen muss.',
  [reflectionKey('the-rumor', 'interrogate', 'consequence')]:
    'Du hast Information gewonnen, zu einem festen, echten Preis für das Vertrauen in der Beziehung — das Zimmer beziffert diesen Tausch unverblümt.',
  [reflectionKey('the-rumor', 'interrogate', 'duty')]:
    'Ein Verhör behandelt die Beschuldigte als schuldig, bis das Gegenteil bewiesen ist — und das stand ihr nicht zu.',
  [reflectionKey('the-rumor', 'interrogate', 'virtue')]: 'Achte darauf, zu was für einem Partner ein bloßes Gerücht dich für einen Abend gemacht hat.',
  [reflectionKey('the-rumor', 'interrogate', 'care')]:
    'Die Fragen kommen bei ihr als Anschuldigung an, ganz gleich, was du beabsichtigt hast, und auch das muss sie tragen.',
  [reflectionKey('the-rumor', 'set-the-trap', 'consequence')]:
    'Die Falle mag eine wahre Antwort liefern, aber sie tut das, indem sie genau die Prüfung erst herstellt, die sie danach nur beobachtet zu haben behauptet.',
  [reflectionKey('the-rumor', 'set-the-trap', 'duty')]:
    'Täuschung ist, selbst im Dienst einer berechtigten Frage, keine faire Methode — du hast ihr eine direkte Frage geschuldet, keine Falle.',
  [reflectionKey('the-rumor', 'set-the-trap', 'virtue')]:
    'Das ist der schärfste Spiegel dieses Zimmers: Die Falle sagt dir genauso viel über dich selbst wie über sie.',
  [reflectionKey('the-rumor', 'set-the-trap', 'care')]:
    'Was auch immer sie über sie enthüllt — mit Sicherheit enthüllt sie, dass du bereit warst, jemanden, den du liebst, zu täuschen, um es zu bekommen.',
  [reflectionKey('the-rumor', 'ask-the-accuser', 'consequence')]:
    'Das Gerücht bis zu seiner Quelle zurückzuverfolgen klärt die eigentliche Behauptung, ohne Sara einen einzigen Moment des Verdachts zu kosten.',
  [reflectionKey('the-rumor', 'ask-the-accuser', 'duty')]:
    'Das lenkt die Prüfung auf die Person, die die Beschuldigung tatsächlich erhebt — genau dorthin gehörte sie von Anfang an.',
  [reflectionKey('the-rumor', 'ask-the-accuser', 'virtue')]:
    'Das ist intellektueller Mut, angewandt dort, wo er am unbequemsten ist — gegen die Person, die die Geschichte in die Welt gesetzt hat, nicht gegen ihr Thema.',
  [reflectionKey('the-rumor', 'ask-the-accuser', 'care')]:
    'Sara muss nie erfahren, dass sie überhaupt unter Verdacht stand — der Zweifel wird gelöst, ohne sie je zu berühren.',
});
