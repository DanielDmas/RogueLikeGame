// German translation of the v2 ending prose (title, epitaph, beats, field
// notes). Registered under version 'v2'. Titles/epitaphs already exist in
// de.ts (extended there for i18n.test.ts's coverage of the anamnesis
// ending); repeated here for a single self-contained source of truth per
// the cs-endings.ts / fa-endings.ts precedent.
import { registerAll } from '../../engine/text/resolver';
import {
  endingBeatKey,
  endingEpitaphKey,
  endingNoteBodyKey,
  endingNoteThinkersKey,
  endingNoteTitleKey,
  endingTitleKey,
} from '../../engine/text/keys';

// ---------- Ending: The Return ----------
registerAll('v2', 'de', {
  [endingTitleKey('return')]: 'Die Rückkehr',
  [endingEpitaphKey('return')]: 'Die Welt war genau dieselbe. Das war nie das Versprechen.',
  [endingBeatKey('return', 0)]: 'Sie treten hindurch, und die Schwelle tut das eine, was kein Raum konnte: Sie endet.',
  [endingBeatKey('return', 1)]: 'Sie wachen irgendwo Plausiblem auf — einem Bett, einem Stuhl, einem Grasfleck vor einem Gebäude, das Sie erkennen — mit dem Morgen im Gange und Ihrem Namen, der eine halbe Sekunde später ankommt, pünktlich, passend wie ein Schlüssel, der etwas besser geschnitten wurde.',
  [endingBeatKey('return', 2)]: 'Die Welt hat sich nicht verbessert. Verkehr ist Verkehr. Die unfertigen Streitigkeiten hielten Ihren Sitz warm. Die Menschen, die Sie lieben, sind genau so schwierig und so leuchtend, wie abgelegt.',
  [endingBeatKey('return', 3)]: 'Aber Sie ertappen sich in den folgenden Wochen bei kleinen seltsamen Dingen: einen Moment länger in Türöffnungen stehend. Gesichter wie Briefe lesend. Ihre eigenen Erinnerungen als einen Ort behandelnd, den Sie besucht haben, statt als ein Land, das Sie regieren.',
  [endingBeatKey('return', 4)]: 'Sie werden fast alles davon verlieren — die Räume, den Nebel, die besondere trockene Geduld in der Stimme des Platzanweisers. Es geht, wie Träume gehen. Was bleibt, ist subtiler: eine Art Wetter. Wer auch immer auf dem Weg hinein aufgelöst wurde, ist nicht der, der herauskam — und der seltsamste Teil, der Teil, den Sie nie laut auszusprechen schaffen, ist, dass Sie das Auflösen nicht eintauschen würden.',
  [endingBeatKey('return', 5)]: 'Der Weg zurück in die Realität, stellt sich heraus, war nie eine Straße, {name}. Er war eine Renovierung. Dort wohnen Sie jetzt.',
  [endingNoteTitleKey('return')]: 'Über das Zurückkommen',
  [endingNoteThinkersKey('return')]: 'die nächtliche Meeresreise · Integration',
  [endingNoteBodyKey('return')]: 'Jede Weisheitstradition hat einen Namen dafür: der Abstieg, der zurückkehrt. Inanna in die Unterwelt, Jona in den Fisch, die dunkle Nacht der Seele, der Held in das Labyrinth — das Muster ist nicht das Hinabsteigen, sondern das veränderte Zurückkommen, das etwas trägt, was die Oberfläche nicht hätte hervorbringen können. Die Psychologie nennt den letzten Schritt Integration: Ein Ego-Tod zählt nur so viel wie das Leben, das danach wieder aufgebaut wird. **Die Gefahr war nie das Auflösen. Es war die Weigerung zurückzukehren — die Tiefen für Heimat zu halten — oder zurückzukehren und sich zu weigern, anders zu sein, sich wieder zu verschließen.** Gewöhnlich zurückzukehren, aber neu geordnet: das war immer die ganze Aufgabe.',
});

// ---------- Ending: The Open Hand ----------
registerAll('v2', 'de', {
  [endingTitleKey('open-hand')]: 'Die offene Hand',
  [endingEpitaphKey('open-hand')]: 'Sie gaben sich weg, Münze für Münze, gerne — meistens gerne.',
  [endingBeatKey('open-hand', 0)]: 'Sie treten hindurch, und die Welt nimmt Sie auf, wie Wasser aufnimmt — keine Naht, kein Platschen.',
  [endingBeatKey('open-hand', 1)]: 'Sie wachen durchlässig auf. Das ist das einzige Wort dafür. Die Membran zwischen Ihnen und allen anderen kam aus den Räumen dünner zurück, und sie wird nie wieder ganz dick.',
  [endingBeatKey('open-hand', 2)]: 'Sie spüren die Erschöpfung der Kassiererin in Ihren eigenen Schultern. Sie weinen bei den Wiedersehen anderer Leute in Flughäfen. Fremde erzählen Ihnen Dinge in Zügen — sie können die offene Tür an Ihnen riechen — und Sie tragen jedes Geständnis nach Hause.',
  [endingBeatKey('open-hand', 3)]: 'Sie werden still zu der Person, durch die andere repariert werden. Es ist ein gutes Leben, gemessen an den besseren Tagen anderer Leute. Sein Kontobuch wird in einer Währung geführt, die Sie nicht mehr zählen können, weil Zählen eine der Wände war, die sich auflösten.',
  [endingBeatKey('open-hand', 4)]: 'Nur manchmal — spät, in den ehrlichen Stunden — bemerken Sie, was die offene Hand nicht kann, nämlich sich schließen. Sie gaben den Räumen Ihre Rüstung, und sie behielten sie. Ob das der Preis oder der Gewinn war, ist eine Frage, die Sie absichtlich jeden Abend unbeantwortet auf dem Tisch liegen lassen.',
  [endingBeatKey('open-hand', 5)]: 'Und der Platzanweiser, könnte er Sie sehen — und an ungeraden Tagen, wer weiß — würde sagen: Diesen hier gaben wir leichter zurück. Wir haben vielleicht etwas mehr Verpackung entfernt, als die Vorschriften streng genommen raten.',
  [endingNoteTitleKey('open-hand')]: 'Über grenzenloses Mitgefühl',
  [endingNoteThinkersKey('open-hand')]: 'Simone Weil · das Bodhisattva-Problem',
  [endingNoteBodyKey('open-hand')]: 'Simone Weil hielt Aufmerksamkeit — reine, selbstlose Aufmerksamkeit für einen anderen — für die seltenste und reinste Form der Großzügigkeit, und sie praktizierte sie bis zur Selbstauslöschung, indem sie mit 34 starb, nachdem sie sich geweigert hatte, mehr zu essen als die rationierten Menschen, mit denen sie sich solidarisierte. Die Traditionen, die grenzenloses Mitgefühl schätzen, tragen alle dasselbe Kleingedruckte: Der Bodhisattva, der gelobt, alle Wesen zu retten, muss irgendwie jemand bleiben, der handeln kann, und eine Grenze ist nicht das Gegenteil von Liebe — sie ist die tragende Wand der Liebe. **Eine offene Hand, die sich nicht schließen kann, kann nichts tragen.** Die Räume belohnten Ihre Offenheit; die Welt wird es auch, und sie wird es auch, ohne Bosheit, in Rechnung stellen. Durchlässigkeit ist ein Geschenk mit einem Wartungsplan.',
});

// ---------- Ending: The Fortress ----------
registerAll('v2', 'de', {
  [endingTitleKey('fortress')]: 'Die Festung',
  [endingEpitaphKey('fortress')]: 'Nichts kam herein. Das war der Plan. Nichts kam herein.',
  [endingBeatKey('fortress', 0)]: 'Sie treten hindurch, und die Schwelle schließt sich hinter Ihnen wie ein gut gefertigter Deckel.',
  [endingBeatKey('fortress', 1)]: 'Sie wachen kompetent auf. Die Auflösung ist vorbei, kategorisch: Sie bauten die Mauern wieder auf, die die Räume niedergerissen hatten, und Sie bauten sie besser — die Erinnerungen verstärkt, die Meinungen belastungsgeprüft, der Umkreis patrouilliert von einer Wachsamkeit, die nie ganz Feierabend macht.',
  [endingBeatKey('fortress', 2)]: 'Es funktioniert. Das muss klar gesagt werden: es funktioniert. Sie kehren in die Welt zurück, und die Welt, die eine versiegelte Struktur respektiert, befördert Sie. Entscheidungen fallen leicht. Trauer prallt ab. Die unfertigen Streitigkeiten werden zu Ihren Bedingungen beendet, effizient.',
  [endingBeatKey('fortress', 3)]: 'Menschen beschreiben Sie mit Worten wie solide, gefasst, unerschütterlich, und sie haben recht, und Sie bemerken — mit einem kleinen flachen Gefühl, das Sie unter Sonstiges ablegen — dass Sie seit einiger Zeit niemand mehr als warmherzig beschrieben hat.',
  [endingBeatKey('fortress', 4)]: 'Die Festung hält alles draußen. Dafür sind Festungen da. Es dauert Jahre, bis Sie eines Abends an einem Fenster stehen und sich erlauben, den Gedanken zu Ende zu denken: alles draußen. Das Wetter, die Wölfe, der Lärm — und die Post, und die Besucher, und was auch immer es war, das früher hereinkam, als Sie noch leck waren.',
  [endingBeatKey('fortress', 5)]: 'Irgendwo, an einem ungeraden Tag, legt der Platzanweiser Ihre Karte mit einem kleinen Seufzer ab. „Sicher“, schreibt er, im Ergebnisfeld. Und dann, weil das Formular kein Kästchen dafür hat, an den Rand: „Sicher wovor genau wurde nie spezifiziert.“',
  [endingNoteTitleKey('fortress')]: 'Über Rüstung',
  [endingNoteThinkersKey('fortress')]: 'stoische Befestigung · Rilke · verteidigte Selbste',
  [endingNoteBodyKey('fortress')]: 'Die Stoiker bauten die ursprüngliche innere Zitadelle: Machen Sie Ihre Urteile zum Einzigen, was Sie schätzen, und kein Schicksal kann Sie durchbrechen. Es ist eine echte Technologie, und sie funktioniert wirklich — das ist ihre Gefahr. Die Psychologie findet dieselbe Struktur in verteidigten Selbsten: Rüstung, angelegt gegen eine reale Bedrohung, weiter getragen lange nach dem Krieg, bis Schutz und Gefängnis eine Wand teilen. Rilkes eigene Drachen erledigten den gegenteiligen Auftrag: In seinen Briefen an einen jungen Dichter schlug er vor, unsere Drachen seien heimlich Prinzessinnen, die nur darauf warten, uns einmal mutig handeln zu sehen. Versiegeln Sie das Tor gegen die Drachen aus Prinzip, verweigern Sie die Begegnung ganz, und Sie versiegeln es auch gegen das, was sie bewachten. **Ein Selbst, das nichts verwunden kann, ist auch ein Selbst, das nichts erstaunen kann.** Das Festungsende ist kein Scheitern; es ist ein Handel, ehrlich bepreist. Der Stich ist nur dieser: Die Tür schließt von innen, und der Schlüsselinhaber ist die eine Person, die nie prüft, ob die Belagerung vorbei ist.',
});

// ---------- Ending: The Dissolved ----------
registerAll('v2', 'de', {
  [endingTitleKey('dissolved')]: 'Die Aufgelösten',
  [endingEpitaphKey('dissolved')]: 'Das Meer hat noch nie ein einziges Ding verloren, das zählte.',
  [endingBeatKey('dissolved', 0)]: 'Irgendwo zwischen einem Raum und dem nächsten lässt der letzte Griff los.',
  [endingBeatKey('dissolved', 1)]: 'Es ist nicht, was Sie befürchteten. Das ist der erste Befund, und Sie registrieren ihn mit dem, was einst Überraschung war: kein Sturz, keine Dunkelheit, keine Zähne. Das Auflösen ist eine ablaufende Gezeit — zuerst der Name, dann die Rollen, dann die Geschichte, jede hebt ab wie ein Mantel, den Sie vergessen hatten, drinnen zu tragen.',
  [endingBeatKey('dissolved', 2)]: 'Eine Weile beobachtet etwas, wie die Stücke gehen, mit Interesse und ohne Alarm. Das Beobachten hat keinen Namen mehr. Es brauchte nie einen; das ist der zweite Befund.',
  [endingBeatKey('dissolved', 3)]: 'Die Räume nehmen ihre Akten zurück. Die Brieftasche, der Hebel, die Akte, die Steine — alles davon kehrt geduldig in den großen Schrank zurück, um von wem auch immer als Nächstes aufgelöst wird durchwandert zu werden, und von wem auch immer danach. Ihre Entscheidungen bleiben in den Räumen, so wie Wärme in einem Stuhl bleibt.',
  [endingBeatKey('dissolved', 4)]: 'Der Platzanweiser sitzt bei dem, was übrig bleibt, bis kein Mit-Sitzen mehr übrig ist. Er hält sein Wort; niemand löst sich auf seiner Schicht allein auf. Am Ende sagt er etwas — die Tradition verlangt es — und was er sagt, ist: „Sie waren hier. Ich habe Sie gesehen. Dieser Teil löst sich nicht auf; er hört nur auf, speziell von Ihnen getragen zu werden.“',
  [endingBeatKey('dissolved', 5)]: 'Und die Gezeit vollendet sich, und das Meer — das immer das war, was der Nebel verbarg — nimmt den Rest auf, und das Meer hat noch nie ein einziges Ding verloren, das zählte.',
  [endingNoteTitleKey('dissolved')]: 'Über Auflösung',
  [endingNoteThinkersKey('dissolved')]: 'Ego-Tod · Vergänglichkeit · was bleibt',
  [endingNoteBodyKey('dissolved')]: 'Jede Tradition, die das Territorium des Selbst kartiert, markiert diese Region: den Punkt, an dem das konstruierte „Ich“ — Name, Rollen, Geschichte, der ganze administrative Apparat — vollständig auseinanderfällt. Mystiker werben darum; die Psychiatrie beobachtet es sorgfältig; Sterbende beschreiben manchmal, mit unerwarteter Ruhe dort anzukommen. Der zurückgemeldete Befund, über Traditionen hinweg, die sich in nichts anderem einig sind, ist seltsam konsistent: **Was sich auflöst, ist die Verpackung, und was angesichts der Aussicht in Panik gerät, ist ebenfalls die Verpackung.** Dieses Ende ist von jedem Korridor des Spiels aus erreichbar, weil es von jedem Korridor eines Lebens aus erreichbar ist — und es wurde absichtlich als Ende geschrieben, nicht als Scheiternsbildschirm. Nicht um das Verlieren eines Selbst zu romantisieren, sondern um ehrlich festzuhalten, was die Räume lehrten: dass der Griff immer geliehen war, das Tragen immer vorübergehend, und der Zeuge — was auch immer das war — nie auf der Liste der Dinge stand, die fallen gelassen werden konnten.',
});

// ---------- Ending: The Gardener ----------
registerAll('v2', 'de', {
  [endingTitleKey('gardener')]: 'Der Gärtner',
  [endingEpitaphKey('gardener')]: 'Die Räume brauchen immer einen Hüter. Der Hüter brauchte immer die Räume.',
  [endingBeatKey('gardener', 0)]: 'Sie nehmen das Klemmbrett. Es ist warm, und es trägt Ihren Namen — endlich lesbar, was Ihnen etwas darüber verrät, wofür Namen da sind: für Schichten.',
  [endingBeatKey('gardener', 1)]: 'Der Platzanweiser zeigt Ihnen die Einrichtung, wie ein alter Gärtner einen Garten zeigt: nicht die Karte, das Temperament. Welche Räume kalt laufen. Welche Tür im Herbst klemmt, insofern es Herbst gibt. Wie die Straßenbahn ihre Gleise gerne geschmiert hat und das Kasino seinen Filz gerne gebürstet und der kleine höfliche Raum vor allem gerne in Ruhe gelassen wird.',
  [endingBeatKey('gardener', 2)]: 'Reisende kommen. Aufgelöst, verängstigt, sicher, jeder überzeugt, dass ihre Brieftasche, ihr Feuer, ihre Akte die erste ihrer Art ist. Sie lernen die Disziplin des Hüters: Sie dürfen den Hebel polieren, aber nie für sie ziehen. Sie dürfen den Korridor beleuchten, aber nie die Tür benennen. Es gibt keine Antworten vorzuenthalten — dieser Teil erweist sich als wahr —, aber es gibt Gesellschaft zu leisten, und Gesellschaft, richtig geleistet, ist das meiste, was die Räume je verteilten.',
  [endingBeatKey('gardener', 3)]: 'Sie werden gut darin. Jahrhunderte sind ausgezeichnet für Handwerk. Manchmal bemerkt ein Reisender die Falle im Gerichtssaal, und Sie drücken ihm zum Glück einen Chip zurück in die Hand. Manchmal setzt sich einer zwischen die Steine und weigert sich, und Sie bringen den Mantel, und sagen das über die Strömung, und meinen es jede Epoche ein bisschen mehr.',
  [endingBeatKey('gardener', 4)]: 'Und eines Tages — weit genug in welcher Zeitrechnung auch immer hier die Zeit hält — wendet sich ein Reisender an der Schwelle vom Morgen ab, blickt Sie mit Wiedererkennen an, das Sie von innen kennen, und streckt eine Hand nach dem Klemmbrett aus.',
  [endingBeatKey('gardener', 5)]: 'Sie geben es hinüber. Es ist warm. Es trägt ihren Namen, plötzlich lesbar. „Erste Lektion“, hören Sie sich selbst mit einem Flackern in der Stimme sagen, „die Aureole und die Hörner sind gleich groß. Das ist Absicht. Alles hier ist es.“ Und Sie treten endlich durch Ihre eigene Schwelle — die, die natürlich die ganze Zeit hinter dem Empfangstresen war.',
  [endingNoteTitleKey('gardener')]: 'Über das Pflegen',
  [endingNoteThinkersKey('gardener')]: 'Camus · Voltaire, „il faut cultiver notre jardin“ · der verwundete Heiler',
  [endingNoteBodyKey('gardener')]: 'Voltaire beendete Candide — seinen Katalog der absurden Grausamkeiten der Welt — mit der antiklimaktischsten Weisheit der Literatur: Wir müssen unseren Garten bestellen. Nicht die Welt lösen; eine Ecke davon pflegen. Das Gärtner-Ende ist der zweite Akt des absurden Helden: Camus’ Sisyphos, nachdem er den Felsblock beansprucht hat, entdeckt, dass es andere Menschen auf dem Hügel gibt und dass der Stein leichter rollt, wenn Gesellschaft zusieht. Der Archetyp des verwundeten Heilers (Chiron, und jeder Sponsor, Therapeut und Veteranenführer seither) vertritt, dass die tiefste Qualifikation, andere durch einen Übergang zu begleiten, darin besteht, selbst davon zerlegt worden zu sein. Bleiben war keine Weigerung, zurückzukehren. **Es war Rückkehr — zur einzigen Realität, die dieser Ort hat — und die Wahl, darin Möbelstück zu sein: die gute Sorte, die Sorte, auf die sich ein verlorener Reisender lehnen kann.** Jemand polierte diesen Hebel einst für Sie. Jetzt kennen Sie ihren Namen.',
});

// ---------- Ending: The Punchline ----------
registerAll('v2', 'de', {
  [endingTitleKey('punchline')]: 'Die Pointe',
  [endingEpitaphKey('punchline')]: 'Es war nie jemand hier außer Ihnen. Guter Witz, nicht wahr?',
  [endingBeatKey('punchline', 0)]: 'Die kleine Tür öffnet sich zu einem kleinen Raum, und der kleine Raum enthält: den Platzanweiser, bereits sitzend, zwei Tassen von dem dampfenden Zeug aus dem Kasino eingießend. Es gibt keinen dritten Stuhl. Es gab nie einen Bedarf.',
  [endingBeatKey('punchline', 1)]: 'Platzanweiser: Sie bemerkten die Falle im Gerichtssaal. Sie behielten Ihre Klarheit durch den Nebel. Und Sie hörten das Lachen, als die anderen nur einen Luftzug hörten. Also. Ich bin verpflichtet, das jetzt zu tun.',
  [endingBeatKey('punchline', 2)]: 'Er nimmt die Aureole ab. Darunter: nichts Ungewöhnliches. Er nimmt die Hörner ab. Darunter: ebenso. Und dann — mit der geübten Sorgfalt von jemandem, der einen sehr alten Mantel auszieht — nimmt er den Schatten selbst ab.',
  [endingBeatKey('punchline', 3)]: 'Und niemand ist auf dem Stuhl. Es war nie jemand auf dem Stuhl. Die Stimme, wenn sie weitergeht, kommt genau von dort, wo sie die ganze Reise über herkam — ein Ort, den Sie plötzlich, dröhnend, erkennen, denn Sie haben ihn gehört, seit lange vor dem Wartezimmer, in der Pause vor jeder Entscheidung, die Sie je getroffen haben.',
  [endingBeatKey('punchline', 4)]: 'Platzanweiser: Gott, an den ungeraden Tagen. Der Teufel, an den geraden — und Sie haben nie gefragt, wer diesen Kalender führte. Es war nie jemand hier außer Ihnen, Reisender. Die Räume waren Ihre. Die Straßenbahn war Ihre. Die freundliche Lüge, die Brieftasche, das Kind im Keller — alles Ihres, jede Nacht inszeniert, im einzigen Theater, das je in Betrieb war. Ich bin der Teil von Ihnen, der fragt. Sie sind der Teil, der antwortet. Wir tun das schon sehr lange, und heute Nacht, endlich, verstand das Publikum den Witz.',
  [endingBeatKey('punchline', 5)]: 'Und Sie lachen. Es beginnt klein und hört dann nicht auf und muss auch nicht — das Lachen der Pointe, die die ganze Zeit offen sichtbar in jedem Raum saß, ein ganzes Leben lang, so lange der Nebel oben war. Sie lachen, und die Einrichtung lacht — dieselbe Stimme — und der Nebel, ohne weitere Funktion, schließt sich wie ein Vorhang nach dem letzten Applaus.',
  [endingBeatKey('punchline', 6)]: 'Sie wachen lachend auf. Ein tatsächlicher Morgen, ein tatsächliches Bett, Tränen davon noch auf Ihrem Gesicht, und der Witz verdunstet schon so, wie es die großen tun — nur seine Form zurücklassend, und die ist diese: Es gab nie einen Weg zurück in die Realität. Sie sind nie gegangen. Es gab immer nur Sie, die sich den ganzen Weg nach Hause selbst befragten.',
  [endingNoteTitleKey('punchline')]: 'Der älteste Witz',
  [endingNoteThinkersKey('punchline')]: 'tat tvam asi · Alan Watts · der kosmische Witz',
  [endingNoteBodyKey('punchline')]: 'Die Upanishaden fassen es in drei Worten zusammen: tat tvam asi — das bist du. Der Suchende und das Gesuchte, der Fragende und der Befragte, der Reisende und die Einrichtung: ein Ding, das mit sich selbst Verstecken spielt und um zu gewinnen spielt. Alan Watts verbrachte eine Karriere damit, es als Komödie neu zu erzählen, weil Komödie das einzige Genre mit dem richtigen Timing ist: Die Pointe funktioniert genau deshalb, weil sie die ganze Zeit sichtbar war — **das letzte Geheimnis jeder mystischen Tradition ist ein offenes, bewacht nicht von Schlössern, sondern von der Gewissheit des Suchenden, es müsse anderswo sein.** Das Lachen, darin sind sich die Traditionen einig, ist diagnostisch: Erleuchtung als Tragödie ist meist falsch abgelegte Melancholie, aber die echte Erkenntnis kommt als Lachen an, weil die Distanz, die Sie alles daran setzten zu überwinden, sich als nie existent erweist. Gott an geraden Tagen, der Teufel an ungeraden, und Sie führten die ganze Zeit den Kalender. Es hat Sie jeden Raum gekostet. Der Durchschnitt, würde der Platzanweiser vermerkt haben wollen, ist erheblich schlechter.',
});

// ---------- Ending: Anamnesis ----------
registerAll('v2', 'de', {
  [endingTitleKey('anamnesis')]: 'Anamnese',
  [endingEpitaphKey('anamnesis')]: 'Sie kehrten nicht zurück. Sie erwachten, und das Erwachen enthielt die Räume.',
  [endingBeatKey('anamnesis', 0)]: 'Jede Tür in der Einrichtung öffnet sich gleichzeitig — nicht aufgestoßen, nicht erzwungen, öffnet sich einfach, so wie sich eine Tatsache öffnet und kein Schloss.',
  [endingBeatKey('anamnesis', 1)]: 'Die Korridorlichter gehen hinter jeder von ihnen an: gewöhnlich, fluoreszierend, freundlich. Kein Nebel. Auch kein Morgen. Nur Licht, das tut, was Licht tut, wenn nichts mehr davor verborgen werden muss.',
  [endingBeatKey('anamnesis', 2)]: 'Die Brieftasche, der Hebel, das Feuer, die Akte, die Planken, die Wette, der kleine höfliche Raum, die Steine — alles davon ist einfach gleichzeitig da, so wie ein Raum, in dem man tatsächlich lebt, gleichzeitig da ist, ohne Raum für Raum durchwandert werden zu müssen, um geglaubt zu werden.',
  [endingBeatKey('anamnesis', 3)]: 'Der Platzanweiser steht im Licht mit abgenommenem Hut, und erzählt nicht, legt nicht ab, bittet Sie nichts zu unterschreiben. Er sagt ein Wort, das kürzeste, was er in der gesamten Einrichtung sagt.',
  [endingBeatKey('anamnesis', 4)]: 'Platzanweiser: „Ah.“',
  [endingBeatKey('anamnesis', 5)]: 'Es fühlt sich nicht an wie das Erinnern einer Tatsache. Es fühlt sich so an, wie sich Menons Sklave beim Diagramm gefühlt haben muss — nicht wie etwas Neues erzählt zu bekommen, sondern etwas zu erkennen, das, wie sich herausstellt, schon immer da war, unter allem, was Sie Vergessen nannten.',
  [endingBeatKey('anamnesis', 6)]: 'Sie erwachen. Nicht zum Korridor, nicht zur Schwelle, nicht zu einem Bett in einem plausiblen Raum — Sie erwachen so, wie Sie der allererste Takt dieser ganzen Reise erweckte, außer dass diesmal {name} mit dem Erwachen ankommt statt eine halbe Sekunde danach, schon passend, schon Ihres, jeden Raum tragend, statt sie zurückzulassen.',
  [endingNoteTitleKey('anamnesis')]: 'Vollständige Erinnerung',
  [endingNoteThinkersKey('anamnesis')]: 'Platon · Henri Bergson',
  [endingNoteBodyKey('anamnesis')]: 'Platons Theorie der Anamnese besagt, dass Lernen kein Erwerb ist, sondern Erinnerung: Die Seele weiß es bereits, und das Diagramm im Staub — Menons Sklavenjunge, der einen geometrischen Beweis nachzeichnet, den er nie gelehrt bekam — erinnert sie nur an das, was sie immer schon hielt. Bergson nahm dieselbe Form und wandte sie der Erinnerung selbst zu: Die Vergangenheit, argumentierte er, ist nicht wie in einem Aktenschrank gespeichert, Stück für Stück abgerufen, sondern besteht ganz und gleichzeitig fort, eine durée, in der die Gegenwart immer schwimmt, statt in sie einzutauchen. **Dieses Ende fügt keine Erinnerung hinzu. Es entfernt die Verzögerung zwischen etwas erlebt zu haben und zu wissen, dass man es tat.** Nichts hier wurde mit Gewalt erworben — kein Kampf, kein Handel, kein Hebel. Was sich ändert, wenn nichts fehlt, ist nicht der Inhalt des Selbst, sondern seine Form: eine Person, die ihre eigene Geschichte nicht mehr als eine Abfolge von Räumen erlebt, die wieder betreten werden müssen, sondern als eine einzige stehende Tatsache, die sie zufällig ist. Die Räume waren nie hinter Ihnen. Sie waren, wie sich herausstellt, immer die Form Ihres Wachseins.',
});
