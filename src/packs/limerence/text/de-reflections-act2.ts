// German translations for LIMERENCE Act II's Examined Path reflections
// (spec 05). Every line is translated with the specific room's actual
// situation and the choice's real stakes in mind, not word-for-word from
// English — see CLAUDE.md's translation rule. All Act II choices carry a
// reflections field in the English source, so every room appears here.
// Jules gender-neutrality follows the same strategy documented in
// de-rooms-act2.ts's header: bare-noun constructions, passive voice, and
// predicate adjectives wherever possible, masculine default only where
// German grammar leaves no alternative.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'de', {
  // ---------- The Distance ----------
  [reflectionKey('the-distance', 'confess-the-near-miss', 'consequence')]:
    'Es Jules jetzt zu sagen, solange der Preis noch klein ist, wehrt einen viel größeren Preis später ab, falls es je von allein ans Licht käme.',
  [reflectionKey('the-distance', 'confess-the-near-miss', 'duty')]:
    'Das stand Jules zu — nicht weil etwas passiert ist, sondern weil fast etwas passiert wäre, und Geheimhaltung über Beinahe-Ereignisse summiert sich.',
  [reflectionKey('the-distance', 'confess-the-near-miss', 'virtue')]:
    'Das ist Ehrlichkeit, gewählt, solange man ihr noch hätte ausweichen können — und das ist die einzige Art, die wirklich etwas beweist.',
  [reflectionKey('the-distance', 'confess-the-near-miss', 'care')]:
    'Du hast Jules die Chance gegeben, sich in der Beziehung sicher zu fühlen, wie sie wirklich ist, nicht in einer kuratierten Version davon.',
  [reflectionKey('the-distance', 'bury-it', 'consequence')]:
    'Heute Nacht ändert sich nichts, aber du hast jetzt einseitig entschieden, was Jules über deinen Abend erfahren darf.',
  [reflectionKey('the-distance', 'bury-it', 'duty')]: 'Ein technisch wahres Verschweigen ist immer noch ein Verschweigen von etwas, das Jules wahrscheinlich wissen wollen würde.',
  [reflectionKey('the-distance', 'bury-it', 'virtue')]: 'Bemerke, wie leicht „nichts ist passiert“ zu einem Versteck wurde statt zu einer Tatsache.',
  [reflectionKey('the-distance', 'bury-it', 'care')]:
    'Du hast dein eigenes Wohlbefinden geschützt, auf Kosten von Jules’ Fähigkeit, eine informierte Entscheidung über diese Beziehung zu treffen.',
  [reflectionKey('the-distance', 'soften-it', 'consequence')]:
    'Die kuratierte Version steuert das Ergebnis von heute Nacht, während sie still jede künftige Chance verbaut, die wahre Version zu erzählen.',
  [reflectionKey('the-distance', 'soften-it', 'duty')]: 'Eine Teilwahrheit, als ganze Wahrheit angeboten, ist funktional immer noch eine Lüge durch Verschweigen.',
  [reflectionKey('the-distance', 'soften-it', 'virtue')]:
    'Das ist die Falle der tröpfelnden Wahrheit, von dir selbst an dir selbst ausgelöst — es lohnt sich zu bemerken, wie vernünftig sich jeder einzelne Tropfen anfühlte.',
  [reflectionKey('the-distance', 'soften-it', 'care')]: 'Jules wird durch eine Geschichte beruhigt, die gebaut wurde, um Gefühle zu steuern, nicht um sie zu informieren.',
  [reflectionKey('the-distance', 'keep-visiting-almost', 'consequence')]:
    'Sich die Option offenzuhalten kostet heute Nacht nichts und verändert die Chancen für das, was beim nächsten „Beinahe“ passiert.',
  [reflectionKey('the-distance', 'keep-visiting-almost', 'duty')]:
    'Das behandelt die Grenze als Linie zum Streifen statt als Linie zum Einhalten — und darauf hat sich Jules nie eingelassen.',
  [reflectionKey('the-distance', 'keep-visiting-almost', 'virtue')]: 'Das ist Rationalisierung in voller Stärke betrachtet — das Prickeln zu bemerken macht es nicht harmlos.',
  [reflectionKey('the-distance', 'keep-visiting-almost', 'care')]:
    'Du hast deinen eigenen zweideutigen Nervenkitzel über die Klarheit gestellt, auf die Jules Anspruch hat, was deine Position angeht.',

  // ---------- The Hall Pass ----------
  [reflectionKey('the-hall-pass', 'agree-to-keep-peace', 'consequence')]:
    'Unter Druck zuzustimmen hat kurzfristig Ruhe gebracht, auf Kosten dessen, etwas zuzustimmen, das du eigentlich nicht wolltest.',
  [reflectionKey('the-hall-pass', 'agree-to-keep-peace', 'duty')]:
    'Zustimmung, die gegeben wird, um Konflikt zu vermeiden, ist nicht dasselbe wie freiwillig gegebene Zustimmung — Jules stand deine ehrliche Antwort zu, nicht deine gesteuerte.',
  [reflectionKey('the-hall-pass', 'agree-to-keep-peace', 'virtue')]: 'Bemerke die Lücke zwischen der Person, die laut Ja gesagt hat, und der Person, die den Magensturz gespürt hat.',
  [reflectionKey('the-hall-pass', 'agree-to-keep-peace', 'care')]:
    'Du hast Jules heute Nacht ein unangenehmes Gespräch erspart, indem du dich freiwillig gemeldet hast, das Unbehagen allein zu tragen, unbegrenzt.',
  [reflectionKey('the-hall-pass', 'true-no', 'consequence')]:
    'Ein klares Nein schließt die Vereinbarung komplett, auf Kosten eines schwereren Gesprächs, dem keiner von euch beiden kostenlos aus dem Weg ging.',
  [reflectionKey('the-hall-pass', 'true-no', 'duty')]: '„Das will ich nicht“ ist ein vollständiger Satz, und Jules stand der wahre zu, nicht der höfliche.',
  [reflectionKey('the-hall-pass', 'true-no', 'virtue')]: 'Es brauchte mehr Nerven, kleinlich zu klingen, als locker zu klingen — das lohnt sich, an dir selbst zu bemerken.',
  [reflectionKey('the-hall-pass', 'true-no', 'care')]: 'Du hast Jules dein tatsächliches Gefühl anvertraut, statt Jules’ Reaktion auf ein gespieltes zu steuern.',
  [reflectionKey('the-hall-pass', 'counter-with-need', 'consequence')]:
    'Bedürfnisse zu benennen, statt eine fertige Vereinbarung anzunehmen oder abzulehnen, erzeugt etwas, das ihr beide tatsächlich behalten könnt.',
  [reflectionKey('the-hall-pass', 'counter-with-need', 'duty')]:
    'Das behandelt das Gespräch als Verhandlung zwischen Gleichen, statt als Geschenk, das einer von euch annimmt oder ablehnt.',
  [reflectionKey('the-hall-pass', 'counter-with-need', 'virtue')]:
    'Das ist der schwerere, reifere Schritt — einen Vorschlag durch deine eigenen Bedingungen zu ersetzen, statt die eines anderen zu bewerten.',
  [reflectionKey('the-hall-pass', 'counter-with-need', 'care')]:
    'Du hast Jules die Chance gegeben zu verstehen, was du wirklich brauchst, nicht nur, was du bereit bist zu ertragen.',
  [reflectionKey('the-hall-pass', 'take-it-angrily', 'consequence')]:
    'Die Vereinbarung aus Trotz zu nutzen löst das ursprüngliche Problem nicht und schafft ein zweites, selbst verursachtes.',
  [reflectionKey('the-hall-pass', 'take-it-angrily', 'duty')]: 'Das setzt ein „Geschenk“ als Waffe gegen jemanden ein, der es in gutem Glauben angeboten hat, wie unbeholfen auch immer.',
  [reflectionKey('the-hall-pass', 'take-it-angrily', 'virtue')]:
    'Frag dich, was das über die Lücke zwischen dem, wozu du Ja gesagt hast, und dem, was du mit diesem Ja tatsächlich gemacht hast, verrät.',
  [reflectionKey('the-hall-pass', 'take-it-angrily', 'care')]: 'Jules wird im Voraus für ein Gefühl bestraft, das du nie tatsächlich ausgesprochen hast.',

  // ---------- The Rebound ----------
  [reflectionKey('the-rebound', 'tell-her-what-this-is', 'consequence')]:
    'Ihr jetzt die Wahrheit zu sagen kostet die Beziehung ihre jetzige bequeme Form, im Tausch gegen ihre Fähigkeit, mit echter Information zu wählen.',
  [reflectionKey('the-rebound', 'tell-her-what-this-is', 'duty')]:
    'Sie hatte Anspruch auf eine genaue Darstellung dessen, was das für dich ist, bevor sie weiter in eine Geschichte investierte, von der du wusstest, dass sie unvollständig war.',
  [reflectionKey('the-rebound', 'tell-her-what-this-is', 'virtue')]:
    'Das erforderte, eine unschmeichelhafte Wahrheit über dich selbst laut auszusprechen, zu der Person, die es am meisten betrifft.',
  [reflectionKey('the-rebound', 'tell-her-what-this-is', 'care')]: 'Du hast Mira die Handlungsmacht zurückgegeben, die dein Schweigen ihr still vorenthalten hatte.',
  [reflectionKey('the-rebound', 'let-her-believe', 'consequence')]:
    'Zu schweigen ließ die Beziehung auf falschen Voraussetzungen vertiefen, was die spätere Abrechnung größer macht, nicht kleiner.',
  [reflectionKey('the-rebound', 'let-her-believe', 'duty')]: 'Sie tiefer fallen zu lassen, während du weißt, was du wirklich fühlst, enthält ihr eine Information vor, auf die sie ein Recht hat.',
  [reflectionKey('the-rebound', 'let-her-believe', 'virtue')]:
    'Bemerke, wie leicht es war, Bequemlichkeit statt schwererer Ehrlichkeit zu wählen, und wie viel schwerer die Schuld durch die Verzögerung wurde.',
  [reflectionKey('the-rebound', 'let-her-believe', 'care')]: 'Ihre wachsende Bindung wird als deine Betäubung verbraucht, ohne ihr Wissen oder ihre Zustimmung zu dieser Abmachung.',
  [reflectionKey('the-rebound', 'end-it', 'consequence')]: 'Es jetzt zu beenden begrenzt den Schaden auf seine jetzige, kleinere Größe, statt ihn sich aufschaukeln zu lassen.',
  [reflectionKey('the-rebound', 'end-it', 'duty')]:
    'Das stellt ihr langfristiges Wohlergehen über deine kurzfristige Bequemlichkeit — und genau das schuldete ihr die Situation eigentlich.',
  [reflectionKey('the-rebound', 'end-it', 'virtue')]: 'Das brauchte echte Nerven — sich bewusst das schwerere Gefühl für dich selbst auszusuchen, um ihr das größere zu ersparen.',
  [reflectionKey('the-rebound', 'end-it', 'care')]: 'Du hast das Betäubungsmittel abgelegt und ihr beide gelassen zu fühlen, was tatsächlich da war — das ist selbst eine Form von Respekt.',
  [reflectionKey('the-rebound', 'try-to-catch-up', 'consequence')]:
    'Emotional aufzuholen zu versuchen ist eine echte Strategie mit echten, unvorhersehbaren Chancen — das Zimmer tut nicht so, als wäre es anders.',
  [reflectionKey('the-rebound', 'try-to-catch-up', 'duty')]: 'Das versucht wenigstens, dem zu begegnen, was sie anbietet, statt es entweder auszunutzen oder abrupt zu beenden.',
  [reflectionKey('the-rebound', 'try-to-catch-up', 'virtue')]: 'Das ist aufrichtige Anstrengung unter Unsicherheit, und das ist wirklich etwas anderes als entweder Ehrlichkeit oder Vermeidung.',
  [reflectionKey('the-rebound', 'try-to-catch-up', 'care')]: 'Mira weiß immer noch nichts von dem Vorsprung, den du versuchst aufzuholen — etwas, das sie wahrscheinlich wissen wollen würde.',

  // ---------- The Unicorn ----------
  [reflectionKey('the-unicorn', 'obey-the-rules', 'consequence')]:
    'Die Regeln so zu akzeptieren, wie sie gegeben wurden, hat echte gute Monate gebracht, auf Kosten eines Schutzes, den du nie wirklich hattest.',
  [reflectionKey('the-unicorn', 'obey-the-rules', 'duty')]:
    'Regeln, an deren Formulierung du keinen Anteil hattest, schuldeten nie denselben Respekt wie solche, die in deiner Anwesenheit verhandelt wurden.',
  [reflectionKey('the-unicorn', 'obey-the-rules', 'virtue')]: 'Bemerke, wie bequem es war, zwei erfahrenere Menschen die Bedingungen deiner eigenen Teilnahme festlegen zu lassen.',
  [reflectionKey('the-unicorn', 'obey-the-rules', 'care')]:
    'Das Wohlbefinden des Paares war die ganze Zeit strukturell geschützt, auf eine Weise, wie es deins nie war — das lohnt sich, klar zu benennen.',
  [reflectionKey('the-unicorn', 'renegotiate', 'consequence')]:
    'Auf Neuverhandlung zu bestehen testet die Ehrlichkeit der Vereinbarung, auf Kosten dessen, dass die einfache Version ungeprüft weiterläuft.',
  [reflectionKey('the-unicorn', 'renegotiate', 'duty')]: 'Dir stand ein Mitspracherecht bei Bedingungen zu, die deine eigene Teilnahme regelten, und du hast eingefordert, was dir zustand.',
  [reflectionKey('the-unicorn', 'renegotiate', 'virtue')]: 'Das ist die schwerere, unbequemere Integrität — etwas Gutes zu riskieren, um herauszufinden, ob es je wirklich fair war.',
  [reflectionKey('the-unicorn', 'renegotiate', 'care')]: 'Du hast der Beziehung, und dir selbst, die Chance gegeben, etwas anderes zu sein als das, was standardmäßig angenommen wurde.',
  [reflectionKey('the-unicorn', 'discover-we-come-first', 'consequence')]:
    'Lange genug zu bleiben, um die Hierarchie auf die harte Tour zu lernen, hat dich eine Nacht gekostet und dir eine Information gegeben, die kein Gespräch gehabt hätte.',
  [reflectionKey('the-unicorn', 'discover-we-come-first', 'duty')]:
    'Dir stand eine klarere Darstellung der Hierarchie zu, bevor du in eine Vereinbarung investiertest, die annahm, du kenntest sie schon.',
  [reflectionKey('the-unicorn', 'discover-we-come-first', 'virtue')]:
    'Es gibt eine Art von Selbsterkenntnis, die nur durch den Preis kommt, nicht um ihn herum — das ist genau das, ehrlich beziffert.',
  [reflectionKey('the-unicorn', 'discover-we-come-first', 'care')]: 'Bemerke, dass Majas Tränen und deine Taxifahrt im Zimmer, das das Paar gebaut hat, nie gleich gewichtet wurden.',
  [reflectionKey('the-unicorn', 'decline-kindly', 'consequence')]:
    'Abzulehnen entfernt jedes Risiko der Vereinbarung, auf Kosten der Zugehörigkeit und Wärme, die sie wirklich angeboten hat.',
  [reflectionKey('the-unicorn', 'decline-kindly', 'duty')]: 'Du schuldetest ihnen einen ehrlichen Grund statt eines Verschwindens, und hast ihnen einen gegeben.',
  [reflectionKey('the-unicorn', 'decline-kindly', 'virtue')]: 'Das ist ein durchdachtes Nein, erreicht, indem man die Struktur durchdenkt, statt auf das Angebot zu reagieren.',
  [reflectionKey('the-unicorn', 'decline-kindly', 'care')]: 'Du hast dir eine Position erspart, die schon von ihrer eigenen Anlage her nie strukturell gleich sein würde.',

  // ---------- Just Friends ----------
  [reflectionKey('just-friends', 'open-window', 'consequence')]:
    'Volle Offenlegung lässt Jules eine informierte Entscheidung über die Beziehung treffen, wie sie wirklich ist, auf Kosten eines unangenehmen, sofortigen Gesprächs.',
  [reflectionKey('just-friends', 'open-window', 'duty')]: 'Jules stand die Rangfolge zu, nicht nur die bloße Tatsache der Freundschaft — die Rangfolge ist der Teil, der wirklich versteckt war.',
  [reflectionKey('just-friends', 'open-window', 'virtue')]: 'Das ist die schwerere Ehrlichkeit — ein Muster über dich selbst zu benennen, nicht nur ein Ereignis.',
  [reflectionKey('just-friends', 'open-window', 'care')]:
    'Du hast Jules’ Klarheit über Alenas und deine eigene Bequemlichkeit gestellt — das ist die eigentliche Form der Loyalität, die dieses Zimmer testet.',
  [reflectionKey('just-friends', 'nothing-to-tell', 'consequence')]:
    'Die Akte geschlossen zu halten vermeidet ein schweres Gespräch, während es still anwachsen lässt, was ein künftiges abdecken müsste.',
  [reflectionKey('just-friends', 'nothing-to-tell', 'duty')]: 'Eine tragende Freundschaft als „nichts zu erzählen“ einzuordnen ist eine Entscheidung über Jules, ohne Jules.',
  [reflectionKey('just-friends', 'nothing-to-tell', 'virtue')]: 'Bemerke, wie sich jeder einzelne Abend zu klein anfühlte, um ihn zu erwähnen — und was sich daraus summiert.',
  [reflectionKey('just-friends', 'nothing-to-tell', 'care')]: 'Jules wird dieselbe Information vorenthalten, die Alena still anhäuft — das Ungleichgewicht ist der eigentliche Schaden.',
  [reflectionKey('just-friends', 'test-the-evening', 'consequence')]:
    'Sich Abstreitbarkeit zu konstruieren erzeugt genau das zweideutige Ergebnis, für das es gebaut wurde — und genau das war der Punkt, und das Problem.',
  [reflectionKey('just-friends', 'test-the-evening', 'duty')]: 'Ein absichtlich zweideutiger Test ist eine Art zu handeln, ohne die Verantwortung, sich entschieden zu haben.',
  [reflectionKey('just-friends', 'test-the-evening', 'virtue')]:
    'Das ist Rationalisierung in voller Stärke, ehrlich betrachtet — die plausible Abstreitbarkeit war der Plan, kein Nebeneffekt.',
  [reflectionKey('just-friends', 'test-the-evening', 'care')]: 'Sowohl Jules als auch Alena steht mehr Klarheit zu als ein Abend, der genau dafür gebaut wurde, keine zu erzeugen.',
  [reflectionKey('just-friends', 'name-it-set-boundary', 'consequence')]:
    'Die Grenze direkt gegenüber Alena zu benennen löst die Zweideutigkeit an ihrer Quelle, statt ihre Symptome bei Jules zu verwalten.',
  [reflectionKey('just-friends', 'name-it-set-boundary', 'duty')]: 'Alena stand Ehrlichkeit darüber zu, was passiert, genauso wie Jules — das begleicht beide Schulden auf einmal.',
  [reflectionKey('just-friends', 'name-it-set-boundary', 'virtue')]: 'Das erforderte, etwas Unangenehmes über dich selbst genau der Person zu sagen, der es am schwersten fällt.',
  [reflectionKey('just-friends', 'name-it-set-boundary', 'care')]:
    'Du hast die Freundschaft geschützt, indem du ehrlich zur Freundin warst, statt sie zu schützen, indem du bei allen vage geblieben bist.',

  // ---------- The Ex ----------
  [reflectionKey('the-ex', 'reread-everything', 'consequence')]:
    'Alles noch einmal durchzulesen hat drei Tage eines unfairen Vergleichs gekostet, für keine Information, die du nicht auf irgendeiner Ebene schon hattest.',
  [reflectionKey('the-ex', 'reread-everything', 'duty')]: 'Das ist ein privater Akt ohne direkten Anspruch an jemand anderen — auch wenn die Nachwirkungen trotzdem bei Jules landen.',
  [reflectionKey('the-ex', 'reread-everything', 'virtue')]: 'Bemerke, wie bereitwillig du eine kuratierte Erinnerung gegen die echte, komplizierte Beziehung gewinnen lässt, in der du jetzt bist.',
  [reflectionKey('the-ex', 'reread-everything', 'care')]: 'Jules wird, ohne es zu wissen, mit einer geschnittenen Höhepunkt-Zusammenstellung verglichen — das ist für niemanden ein faires Rennen.',
  [reflectionKey('the-ex', 'answer-her', 'consequence')]:
    'Zu antworten öffnet wieder einen Kanal, dessen Risiken du aus Erfahrung genau kennst, zu einem realen, wenn auch schwer zu beziffernden Preis.',
  [reflectionKey('the-ex', 'answer-her', 'duty')]: 'Das geschah ohne Jules’ Wissen, und genau das ist die Entscheidung, die es zu prüfen lohnt, unabhängig vom Inhalt.',
  [reflectionKey('the-ex', 'answer-her', 'virtue')]: 'Frag dich ehrlich, ob „nur reden“ jemals der ganze Plan war, oder der erste Satz eines längeren.',
  [reflectionKey('the-ex', 'answer-her', 'care')]: 'Jules lacht gerade über den Fernseher, ohne zu ahnen, dass nebenan gerade eine Entscheidung getroffen wird, die die Beziehung betrifft.',
  [reflectionKey('the-ex', 'block', 'consequence')]:
    'Blockieren beseitigt das Risiko, auf Kosten jeder Information — Abschluss, Klarheit, oder sonst was —, die der Austausch hätte bieten können.',
  [reflectionKey('the-ex', 'block', 'duty')]: 'Das schützt die Integrität der jetzigen Beziehung, ohne dass Jules die Situation überhaupt bewältigen müsste.',
  [reflectionKey('the-ex', 'block', 'virtue')]: 'Das ist eine entschlossene, selbstschützende Tat, klar gewählt statt hineingerutscht.',
  [reflectionKey('the-ex', 'block', 'care')]: 'Du hast die Entscheidung einseitig getroffen, statt Jules einzubeziehen — ein privater Schutz, von dem Jules nie erfahren wird, dass er gewährt wurde.',
  [reflectionKey('the-ex', 'tell-jules', 'consequence')]: 'Es sofort zu teilen verwandelt ein privates Risiko in eine gemeinsame Entscheidung, auf Kosten eines unangenehmen Moments der Offenlegung.',
  [reflectionKey('the-ex', 'tell-jules', 'duty')]:
    'Jules stand die Information in dem Moment zu, in dem du sie hattest, nicht erst, nachdem du allein entschieden hattest, was du damit machst.',
  [reflectionKey('the-ex', 'tell-jules', 'virtue')]: 'Das ist Nähe, die dem Instinkt vorgezogen wird — im Zweifel nach der schwereren, offeneren Option zu greifen.',
  [reflectionKey('the-ex', 'tell-jules', 'care')]: 'Du hast Jules ein Mitspracherecht bei etwas gegeben, das Jules direkt betrifft, statt es an Jules’ Stelle zu entscheiden.',

  // ---------- The Confession ----------
  [reflectionKey('the-confession', 'confess', 'consequence')]:
    'Volle Offenlegung gibt Jules die wahre Information, auf der das eigene Leben aufbaut, auf Kosten eines Schmerzes, den ein scheinbar gütigeres Schweigen nur aufgeschoben, nicht verhindert hätte.',
  [reflectionKey('the-confession', 'confess', 'duty')]: 'Jules hat ein Recht auf die Wahrheit über die Beziehung, in der Jules tatsächlich steckt — das ist dieses Recht, eingelöst, wenn auch spät.',
  [reflectionKey('the-confession', 'confess', 'virtue')]: 'Das ist Ehrlichkeit, gewählt in ihrer teuersten Form, und das ist meist die einzige Prüfung, die überhaupt etwas bedeutet.',
  [reflectionKey('the-confession', 'confess', 'care')]:
    'Du hast deine Gewissheit über die Tatsache auf Jules übertragen, aber du bist geblieben und hast die Nachwirkungen mitgetragen, statt Jules allein damit fertigwerden zu lassen.',
  [reflectionKey('the-confession', 'carry-it', 'consequence')]:
    'Es allein zu tragen erspart Jules einen konkreten Schmerz, auf Kosten eines dauerhaften, ungleichen Gewichts, das nur du je spüren wirst.',
  [reflectionKey('the-confession', 'carry-it', 'duty')]:
    'Das lässt sich als echtes Selbstopfer für Jules lesen, oder als Vorenthalten einer Information, die Jules haben wollen würde — das Zimmer weigert sich, sich für eine Lesart zu entscheiden.',
  [reflectionKey('the-confession', 'carry-it', 'virtue')]: 'Das ist echte, anhaltende Zurückhaltung — die schwerere private Last der leichteren öffentlichen Erleichterung vorzuziehen.',
  [reflectionKey('the-confession', 'carry-it', 'care')]: 'Frag dich ehrlich, ob das Schweigen Jules schützt, oder ob es die Beziehung schützt, so wie sie gerade bequem für dich existiert.',
  [reflectionKey('the-confession', 'trickle', 'consequence')]: 'Eine abgemilderte Beichte bewältigt die Reaktion von heute Nacht, auf Kosten einer größeren, sich aufschaukelnden Abrechnung später.',
  [reflectionKey('the-confession', 'trickle', 'duty')]: 'Eine teilweise Beichte enthält Jules immer noch die volle Wahrheit vor, die Jules zusteht — nur als Ehrlichkeit verkleidet.',
  [reflectionKey('the-confession', 'trickle', 'virtue')]:
    'Das ist die Falle der tröpfelnden Wahrheit, diesmal erkannt — und trotzdem gewählt, was schon für sich genommen etwas über dich verrät.',
  [reflectionKey('the-confession', 'trickle', 'care')]: 'Jede künftige Korrektur wird Jules eine neue, vermeidbare Verletzung kosten, die ein einziges hartes Gespräch heute Nacht verhindert hätte.',
  [reflectionKey('the-confession', 'let-it-surface', 'consequence')]:
    'Auf zufällige Entdeckung zu warten nimmt dir jede Handlungsmacht über den Ausgang, ohne die letztendlichen Kosten tatsächlich zu senken.',
  [reflectionKey('the-confession', 'let-it-surface', 'duty')]: 'Das verschiebt eine Schuld, die wirklich besteht, statt sie entweder zu begleichen oder dir bewusst selbst zu erlassen.',
  [reflectionKey('the-confession', 'let-it-surface', 'virtue')]: 'Das ist Vermeidung im Kostüm des Schicksals — es lohnt sich, das jetzt gleich, dir selbst gegenüber, klar zu benennen.',
  [reflectionKey('the-confession', 'let-it-surface', 'care')]:
    'Wann immer es auftaucht, wird Jules es unter den denkbar schlechtesten Umständen erfahren — und diese Entscheidung macht das wahrscheinlicher, nicht weniger wahrscheinlich.',

  // ---------- The Other Side of the Door ----------
  [reflectionKey('the-other-side-of-the-door', 'continue', 'consequence')]:
    'Weiterzumachen bewahrt etwas, das dir wirklich wichtig ist, zu einem andauernden, sich aufschaukelnden Preis für eine dritte Person, die dem allem nie zugestimmt hat.',
  [reflectionKey('the-other-side-of-the-door', 'continue', 'duty')]:
    'Du hast keine Gelübde abgelegt, das ist wahr, und es klärt nicht, ob es an sich falsch ist, wissentlich zu ermöglichen, dass jemand anders seine bricht.',
  [reflectionKey('the-other-side-of-the-door', 'continue', 'virtue')]: 'Bemerke, welche Verheimlichungsgewohnheiten du dir angeeignet hast, ohne das je bewusst entschieden zu haben.',
  [reflectionKey('the-other-side-of-the-door', 'continue', 'care')]: 'Die Frau hinter der Wand wird nie gefragt, nie informiert, und hört nie auf, real zu sein, nur weil sie nie gesehen wird.',
  [reflectionKey('the-other-side-of-the-door', 'end-it', 'consequence')]:
    'Es zu beenden nimmt deinen eigenen anhaltenden Anteil am Schaden weg, auf Kosten einer Trauer, die du ohne öffentliche Anerkennung tragen musst.',
  [reflectionKey('the-other-side-of-the-door', 'end-it', 'duty')]:
    'Das beendet deine eigene wissentliche Beteiligung, ohne von Viktor eine Entscheidung zu verlangen, die er ohnehin nie sauber getroffen hätte.',
  [reflectionKey('the-other-side-of-the-door', 'end-it', 'virtue')]: 'Das ist eine stille, unbezeugte Integrität — den schwereren Ausgang genau deshalb zu wählen, weil niemand zusieht, um ihn zu belohnen.',
  [reflectionKey('the-other-side-of-the-door', 'end-it', 'care')]: 'Das macht nicht ungeschehen, was die Frau hinter der Wand schon durchgemacht hat, aber es hört auf, noch mehr hinzuzufügen.',
  [reflectionKey('the-other-side-of-the-door', 'tell-her', 'consequence')]:
    'Es ihr zu sagen gibt ihr die Information, um echte Entscheidungen über ihr eigenes Leben zu treffen, zu einem Preis für Viktor und für dich selbst, den du nicht vollständig kontrollierst.',
  [reflectionKey('the-other-side-of-the-door', 'tell-her', 'duty')]:
    'Ihr stand die Wahrheit über ihre eigene Ehe zu, unabhängig von den Motiven oder der Stellung der Person, die sie überbracht hat.',
  [reflectionKey('the-other-side-of-the-door', 'tell-her', 'virtue')]: 'Das brauchte echten Mut, welche Mischung aus Motiven auch dahintersteckte — die Tat und das Motiv sind nicht dieselbe Frage.',
  [reflectionKey('the-other-side-of-the-door', 'tell-her', 'care')]:
    'Das ist die einzige Entscheidung auf diesem Stockwerk, die sie direkt in den Mittelpunkt stellt, statt die Situation um sie herum zu verwalten.',
  [reflectionKey('the-other-side-of-the-door', 'demand-choice', 'consequence')]:
    'Ein Ultimatum erzwingt eine Klärung, auf Kosten dessen, die eigentliche Entscheidung ganz jemandem zu überlassen, der schon gezeigt hat, dass er zwei Leben gleichzeitig führen kann.',
  [reflectionKey('the-other-side-of-the-door', 'demand-choice', 'duty')]:
    'Von ihm eine Entscheidung zu verlangen, ist ihm gegenüber fair, entbindet dich aber nicht allein schon von deiner eigenen Verantwortung in der Situation.',
  [reflectionKey('the-other-side-of-the-door', 'demand-choice', 'virtue')]:
    'Bemerke, was diese Entscheidung darüber verrät, mehr eine Klärung zu wollen, als selbst zu handeln.',
  [reflectionKey('the-other-side-of-the-door', 'demand-choice', 'care')]:
    'Das Ultimatum stellt deine eigene Gewissheit in den Mittelpunkt, nicht das Wohlergehen der Ehefrau, das diese Entscheidung so oder so völlig offenlässt.',

  // ---------- The Scoreboard (gate) ----------
  [reflectionKey('the-scoreboard', 'prosecute', 'consequence')]:
    'Das Verhör kauft Gewissheit über Tatsachen, die du technisch schon kanntest, zu einem realen, andauernden Preis für das Vertrauen und deine eigene Ruhe.',
  [reflectionKey('the-scoreboard', 'prosecute', 'duty')]:
    'Die Vergangenheit schuldet dir nichts weiter; sie wurde einmal offengelegt, ehrlich, und sie erneut zu verhandeln behandelt diese Ehrlichkeit, als wäre sie nicht genug gewesen.',
  [reflectionKey('the-scoreboard', 'prosecute', 'virtue')]: 'Bemerke, was für einen Partner eine einzige Zahl über eine einzige Anhörung hinweg aus dir gemacht hat.',
  [reflectionKey('the-scoreboard', 'prosecute', 'care')]: 'Jules muss eine Vergangenheit, die vor dir liegt, noch einmal durchleben und rechtfertigen, nach deinem Zeitplan, zu deiner Erleichterung.',
  [reflectionKey('the-scoreboard', 'dismiss-with-prejudice', 'consequence')]:
    'Den Fall abzuweisen löscht die Zahl nicht aus, nimmt ihr aber die Macht, der jetzigen Beziehung weiter einen Preis abzuverlangen.',
  [reflectionKey('the-scoreboard', 'dismiss-with-prejudice', 'duty')]: 'Du schuldest der Vergangenheit keine weitere Anklage — sie hat schon einmal ehrlich geantwortet, als sie gefragt wurde.',
  [reflectionKey('the-scoreboard', 'dismiss-with-prejudice', 'virtue')]: 'Das ist Akzeptanz als eingeübte Disziplin, kein Gefühl, auf dessen Ankunft du wartest.',
  [reflectionKey('the-scoreboard', 'dismiss-with-prejudice', 'care')]:
    'Du hörst auf, Jules für eine Version einzustehen zu lassen, die es vor dir gab — und genau das stand Jules eigentlich zu.',
  [reflectionKey('the-scoreboard', 'testify-against-yourself', 'consequence')]:
    'Die eigene Doppelmoral zu prüfen ändert keine der beiden Zahlen, aber es ändert, was diese Diskrepanz die Beziehung kosten darf.',
  [reflectionKey('the-scoreboard', 'testify-against-yourself', 'duty')]:
    'Fairness verlangt, denselben Maßstab an dich selbst anzulegen, den du an Jules anlegst — diese Entscheidung tut genau das.',
  [reflectionKey('the-scoreboard', 'testify-against-yourself', 'virtue')]: 'Das ist echte, unangenehme Selbstprüfung, angewendet genau dort, wo sie am wenigsten schmeichelhaft ist.',
  [reflectionKey('the-scoreboard', 'testify-against-yourself', 'care')]: 'Das erspart Jules die Last eines Maßstabs, an den du dich selbst nicht halten wolltest.',
  [reflectionKey('the-scoreboard', 'ask-what-verdict-frees', 'consequence')]:
    'Zu benennen, dass kein Urteil wirklich helfen würde, rahmt die ganze Anhörung als von vornherein unwinnbar um — und genau das ist die nützliche Information.',
  [reflectionKey('the-scoreboard', 'ask-what-verdict-frees', 'duty')]: 'Das schuldet der Vergangenheit nichts weiter, weil es richtig erkennt, dass nie mehr geschuldet war.',
  [reflectionKey('the-scoreboard', 'ask-what-verdict-frees', 'virtue')]:
    'Das ist die seltenste Form von Einsicht in dieser Anhörung — zu erkennen, dass der Prozess selbst die Fehlfunktion war, nicht sein Ausgang.',
  [reflectionKey('the-scoreboard', 'ask-what-verdict-frees', 'care')]:
    'Du hörst auf, irgendjemanden, dich selbst eingeschlossen, für eine Frage vor Gericht zu stellen, die nie wirklich durch eine Zahl beantwortbar war.',
});
