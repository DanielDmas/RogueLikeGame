// German translation of LIMERENCE's prologue and Act I room prose (beats,
// choice text/hint/outcome, field notes, plain-language explanations).
// Registered under version 'v2'. Follows the structural pattern established
// by ANAMNESIS's src/content/text/de-rooms.ts and LIMERENCE's own Czech/
// Farsi passes — see CLAUDE.md's "Translating content" rule: every line
// here was translated against the room's actual beats and each choice's
// stakes, not word-for-word.
//
// Sie/du decision: informal "du" throughout, for both the narrator's direct
// address of the player-as-character and the Porter's own speech. ANAMNESIS's
// German uses formal "Sie" — deliberately not mirrored here. Act I's prose
// puts the reader directly inside a 15-18-year-old's own head at 1 a.m. over
// a read receipt, at a party, texting a best friend's girlfriend; it's
// interior monologue and teenage dialogue, not a narrator addressing an
// adult guest from a respectful remove (which is what ANAMNESIS's framing
// device actually is). German YA fiction, teen-facing games, and everyday
// address between an adult and a minor overwhelmingly default to "du"; "Sie"
// here would read as a translation artifact, not a deliberate register
// choice. The Porter keeps his own measured, unhurried, adult cadence, but
// grammatically addresses the player as "du" throughout, the way an adult
// speaks warmly-but-plainly to a teenager, not as a hotel employee to a
// guest of unknown rank.
//
// "The Porter" is rendered "Portier" — a common, idiomatic German loanword
// for exactly this hotel role, and deliberately distinct from ANAMNESIS's
// own German word for its theater-usher guide character, per the project
// convention of keeping the two guide characters' vocabulary separate.
//
// Field-note thinkers lines: proper-name citations (with years) are carried
// through unchanged, matching de-rooms.ts's own convention. The two
// descriptive (non-named) thinkers lines in Act I — the-password's
// "coercive-control research · reassurance-seeking studies" and
// the-forward's "non-consensual image-sharing research · the legal
// reality" — are translated into German, following the Czech pass's
// approach, since they're field descriptions rather than citations.
//
// Character gender: Act I's cast (Sara, Nadia, Tom, Klara, Ema) is entirely
// and unambiguously gendered in the English source, so none of the
// Jules/Dana-style gender-neutral handling from later Acts is needed here.
// German's grammatical gender did require one recurring judgment call not
// present in English: several lines use an English "you are the one who…"
// construction to describe the player. Rendering that literally would force
// a gendered relative pronoun (der/die) onto the player-character, whose
// gender the game never specifies. Every such line below is restructured to
// keep "du" as the plain grammatical subject instead (e.g. "aber den
// Schirm hältst trotzdem du" rather than a gendered "derjenige/diejenige,
// der/die..." construction), and any generic "what kind of X are you"
// rhetorical question uses an ungendered or conventionally generic noun
// (Mensch, Gast, Partner, Publikum) rather than a gender-doubled one — the
// same pattern ANAMNESIS's own German already relies on ("was für ein
// Mensch Sie sind").
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
  roomArticleTitleKey,
  roomArticleBodyKey,
} from '../../../engine/text/keys';
import type { RunState } from '../../../engine/schema';

// ---------- Prologue: The Front Desk ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-front-desk', 0, 0)]:
    'Du wachst mitten im Schritt auf, in einer Lobby, die nach Teppichreiniger riecht, nach kaltem Kaffee und dem halb verflogenen Parfüm von irgendjemandem. Du erinnerst dich nicht, wie du hierhergekommen bist. Hier erinnerst du dich selten.',
  [roomBeatKey('the-front-desk', 0, 1)]:
    'Über dem Tresen klappert eine Abflugtafel und listet jeden Gast auf, der gerade eingecheckt ist. Keine Zeiten. Keine Gates. Nur Namen — deiner irgendwo darunter.',
  [roomBeatKey('the-front-desk', 0, 2)]:
    'Das Gästebuch liegt aufgeschlagen bei der heutigen Seite. Deine Unterschrift steht schon darin, in deiner eigenen Handschrift, datiert auf morgen.',
  [roomBeatKey('the-front-desk', 0, 3)]:
    'Portier: Du bist zwischen einem Herzschlag und dem nächsten. Die meisten Gäste sind das, wenn sie es zum ersten Mal bemerken.',
  [roomBeatKey('the-front-desk', 0, 4)]:
    'Portier: Die Regeln, soweit man das so nennen kann — Stockwerke, Türen, Zimmer, die sich merken, was in ihnen geschieht. Manche wirst du als du selbst durchqueren. Andere als die Person, die gerade drin ist, wenn sich die Tür öffnet.',
  [roomBeatKey('the-front-desk', 0, 5)]:
    'Als er sich umdreht, um das Buch wegzulegen, fällt es dir auf — ein Ehering an seiner rechten Hand, und an der linken ein blasser, ungebräunter Streifen, wo früher einer saß. Er erklärt es nicht. Du fragst nicht. Noch nicht.',
  [roomChoiceTextKey('the-front-desk', 'what-is-this')]: '„Was ist das hier für ein Ort?“',
  [roomChoiceHintKey('the-front-desk', 'what-is-this')]: 'Frag nach dem Hotel selbst',
  [roomChoiceOutcomeKey('the-front-desk', 'what-is-this', 0)]:
    'Portier: Die Zimmer bewahren die Nächte, von denen niemand erzählt. Du wirst sie als die Menschen darin durchqueren. Das ist die ganze Architektur.',
  [roomChoiceTextKey('the-front-desk', 'whose-side')]: '„Auf wessen Seite stehst du?“',
  [roomChoiceHintKey('the-front-desk', 'whose-side')]: 'Frag nach dem Portier',
  [roomChoiceOutcomeKey('the-front-desk', 'whose-side', 0)]:
    'Portier: Die Rezeption ist neutral, was jeder Gast für Grausamkeit hält. Bis zum Morgen wirst du jeder gewesen sein. Dann wird „Seite“ nicht mehr viel bedeuten.',
  [roomChoiceTextKey('the-front-desk', 'let-me-out')]: '„Ich will einfach nur nach Hause.“',
  [roomChoiceHintKey('the-front-desk', 'let-me-out')]: 'Lehn den ganzen Rahmen ab',
  [roomChoiceOutcomeKey('the-front-desk', 'let-me-out', 0)]:
    'Portier: Zuhause ist dort, wo das Gespräch wohnt, dem du ausweichst. Der Weg zurück führt durch jedes Zimmer, in dem jemand genau so einem Gespräch ausweicht. Eine Abkürzung hat noch niemand gefunden. Die Leute checken es trotzdem, Nacht für Nacht.',
  [roomExplanationKey('the-front-desk', 0)]:
    'Limerenz ist ein realer, benannter psychologischer Zustand — eine unwillkürliche, obsessive Verliebtheit, verschieden von Liebe und von Entscheidung. Dieses Hotel trägt ihren Namen, weil das meiste von dem, was auf seinen Stockwerken geschieht, dort seinen Anfang nimmt. In dem Spiel, das folgt, geht es nicht darum, die Menschen in diesen Zimmern zu verurteilen; es geht darum, einen schwierigen Moment einer Beziehung einmal von innen zu durchleben, sicher, bevor das Leben es wirklich von dir verlangt.',
  [roomNoteTitleKey('the-front-desk')]: 'Limerenz',
  [roomNoteThinkersKey('the-front-desk')]: 'Dorothy Tennov · Love and Limerence (1979)',
  [roomNoteBodyKey('the-front-desk')]:
    'Tennov prägte diesen Begriff, um etwas zu benennen, das fast jeder erlebt und für das fast niemand ein Wort hat: den unwillkürlichen Zustand obsessiver Verliebtheit — aufdringliche Gedanken an einen einzigen Menschen, ein zwanghaftes Lesen jedes seiner Signale, ein Schmerz, der auf kein Argument hört. Es ist keine Liebe, und es ist keine Entscheidung; er hat einen Beginn, einen Höhepunkt und — unbeachtet — einen Verfall, meist innerhalb von zwei Jahren. **Das Hotel trägt ihren Namen, weil fast jede Tür auf diesen Stockwerken von jemandem geöffnet wurde, der in ihrem Griff war — das Gefühl war nie die Wahl; was danach geschah, war es immer.** Den Zustand zu benennen heilt ihn nicht. Es macht aber, zuverlässig, die nächste Entscheidung ein Stück mehr zu deiner eigenen.',
});

// ---------- Act I: The Read Receipt ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-read-receipt', 0, 0)]:
    'Dein Zimmer, ein Uhr nachts. Das Handydisplay ist das einzige Licht im Raum, und es zeigt: Sara hat deine Nachricht vor drei Stunden gelesen.',
  [roomBeatKey('the-read-receipt', 0, 1)]: 'gelesen · 22:04',
  [roomBeatKey('the-read-receipt', 0, 2)]:
    'Die Schreibt-gerade-Anzeige taucht auf. Drei Punkte, geduldig. Dann verschwindet sie. Eine Minute später taucht sie wieder auf. Verschwindet wieder. Du hast das jetzt schon viermal beobachtet, und du könntest niemandem erklären, was du dir vom fünften Mal erhoffst.',
  [roomBeatKey('the-read-receipt', 0, 3)]:
    'Du scrollst durch alles zurück, was du heute geschrieben hast, und liest jede Nachricht auf Verbrechen hin ab. War der Witz zu viel. War die Pause zu lang. Die Beweise wechseln ständig den Besitzer, je nachdem, wie du sie gerade hältst.',
  [roomBeatKey('the-read-receipt', 0, 4)]:
    'Portier: Jeder Gast auf diesem Stockwerk ist sich sicher, dass das Schweigen ihm gilt. Das Schweigen gilt fast nie ihm.',
  [roomChoiceTextKey('the-read-receipt', 'double-text')]: 'In Panik geraten und noch zwei Nachrichten schicken.',
  [roomChoiceHintKey('the-read-receipt', 'double-text')]: 'Dem Schweigen hinterherjagen',
  [roomChoiceOutcomeKey('the-read-receipt', 'double-text', 0)]: 'Erleichterung, für etwa vier Minuten.',
  [roomChoiceOutcomeKey('the-read-receipt', 'double-text', 1)]:
    'Dann: zwei unbeantwortete Nachrichten statt einer, und eine Rechnung aus Angst, die genau so aufgeht, wie sie immer aufgeht.',
  [roomChoiceTextKey('the-read-receipt', 'drawer')]: 'Das Handy in eine Schublade legen. Mit dem Gefühl sitzen bleiben.',
  [roomChoiceHintKey('the-read-receipt', 'drawer')]: 'Der Angst begegnen, ohne sie zu füttern',
  [roomChoiceOutcomeKey('the-read-receipt', 'drawer', 0)]:
    'Das Gefühl hat, wenn man ihm direkt begegnet statt es zu managen, tatsächlich eine Form — und irgendwann auch einen Boden.',
  [roomChoiceOutcomeKey('the-read-receipt', 'drawer', 1)]: 'Der Morgen kommt. Und mit ihm: „sorry, bin eingeschlafen ❤“',
  [roomChoiceTextKey('the-read-receipt', 'bait')]: 'Sie mit einer erfundenen Geschichte testen, um eine Antwort zu erzwingen.',
  [roomChoiceHintKey('the-read-receipt', 'bait')]: 'Einen Beweis konstruieren',
  [roomChoiceOutcomeKey('the-read-receipt', 'bait', 0)]: 'Es funktioniert. Sie antwortet innerhalb einer Minute.',
  [roomChoiceOutcomeKey('the-read-receipt', 'bait', 1)]:
    'Und du lernst das Einzige, was so ein Test dir überhaupt beibringen kann: dass er funktioniert. Nicht, was er gekostet hat.',
  [roomChoiceTextKey('the-read-receipt', 'ask-tomorrow')]: 'Sie morgen direkt fragen, laut, von Angesicht zu Angesicht.',
  [roomChoiceHintKey('the-read-receipt', 'ask-tomorrow')]: 'Auf Tageslicht und eine echte Antwort warten',
  [roomChoiceOutcomeKey('the-read-receipt', 'ask-tomorrow', 0)]:
    'Bei Tageslicht wird die Frage klein. Ihre Antwort — „meine Mum hat mir das Handy weggenommen“ — macht die ganze Architektur der letzten Nacht sichtbar, und ein bisschen peinlich.',
  [roomExplanationKey('the-read-receipt', 0)]:
    'Psycholog:innen beschreiben drei grobe Bindungsstile, früh erlernt und in jede spätere Beziehung mitgenommen: ängstlich (sucht ständige Bestätigung, liest Schweigen als Gefahr), vermeidend (zieht sich zurück, sobald es eng wird) und sicher (vertraut, ohne ständige Beweise zu brauchen). Die Spirale um das „gelesen“ ist der ängstliche Kreislauf in Echtzeit — ein Gefühl, das vollkommen real ist, angeheftet an eine Geschichte, die oft nur ein erster Entwurf ist. Keiner der Stile ist ein lebenslanges Urteil; „erarbeitete Sicherheit“ — lernen, Menschen ruhiger zu lesen — ist real, und sie ist die leise These dieses ganzen Hotels.',
  [roomNoteTitleKey('the-read-receipt')]: 'Das Wetter, das du mitbringst',
  [roomNoteThinkersKey('the-read-receipt')]: 'Bowlby (1969) · Ainsworth (1978) · Hazan & Shaver (1987)',
  [roomNoteBodyKey('the-read-receipt')]:
    'Die Bindungstheorie begann mit Bowlbys Beobachtung, dass Säuglinge innere Arbeitsmodelle von Nähe entwickeln — Erwartungen darüber, ob ihr Ausstrecken der Hand erwidert wird —, die Ainsworth später in sichere, ängstliche und vermeidende Muster einteilte. Hazan und Shaver zeigten Jahrzehnte später, dass dieselben Muster das romantische Verhalten Erwachsener vorhersagen: dasselbe Wettersystem, jetzt drinnen, verkleidet als Lesebestätigung. **Das Gefühl, das um ein Uhr nachts ankommt, ist real; die Geschichte, die es darüber erzählt, warum sie noch nicht geantwortet hat, ist ein Entwurf, und Entwürfe lassen sich überarbeiten.** Nichts davon ist Schicksal — Langzeitstudien zur „erarbeiteten Sicherheit“ zeigen, dass Menschen sich sichtbar zu ruhigeren Mustern hin verändern, meist genau durch die Art von Beziehung, die ein paar ehrliche, ungetestete Nächte übersteht. Die Torprüfung im obersten Stockwerk wird dich fragen, was du mit dem Wetter gemacht hast.',
  [roomArticleTitleKey('the-read-receipt')]: 'Warum dasselbe Schweigen für verschiedene Menschen etwas anderes bedeutet',
  [roomArticleBodyKey('the-read-receipt')]: [
    'John Bowlby begründete die Bindungstheorie mit einer unprätentiösen, evolutionären Grundannahme: Ein menschlicher Säugling, der in der Nähe einer Bezugsperson bleibt, überlebt zuverlässiger als einer, der umherstreift, also hat die natürliche Selektion das Streben nach Nähe direkt in das Nervensystem eingebaut — zusammen mit etwas, das Bowlby ein „inneres Arbeitsmodell“ nannte: eine laufende, meist unbewusste Erwartung darüber, ob das Ausstrecken der Hand erwidert wird. Diese Erwartung, so seine These, bleibt nicht im Kinderzimmer. Sie wird zur Linse, nach der ein Mensch Jahrzehnte später greift, sobald jemand, den er liebt, verstummt.',
    'Mary Ainsworth machte daraus in den 1970ern ein echtes Experiment, die „Fremde Situation“: Eine Bezugsperson und ein Säugling betreten einen unbekannten Raum, die Bezugsperson verlässt ihn kurz, eine fremde Person tritt ein, und Forschende hinter einer Einwegscheibe zeichnen genau auf, wie der Säugling mit der Trennung — und, aufschlussreicher noch — mit dem Wiedersehen umgeht. Aus diesen aufgezeichneten Wiedersehen entstanden drei heute berühmte Muster — **sicher** (beunruhigt durch das Weggehen, beruhigt durch die Rückkehr), **ängstlich** (beunruhigt und nicht leicht zu beruhigen, als würde der Rückkehr selbst nicht ganz getraut) und **vermeidend** (zeigt kaum sichtbare Beunruhigung, hat offenbar gelernt, dass sichtbares Bedürfnis nicht zuverlässig erwidert wird).',
    'Der Sprung, der für den Raum zählt, den du eben verlassen hast, kam 1987, als Cindy Hazan und Phillip Shaver Erwachsene baten, drei kurze Absätze zu lesen, die unterschiedliche Herangehensweisen an Nähe in romantischen Beziehungen beschrieben, und einfach den auszuwählen, der ihnen am ähnlichsten schien. Die Verteilung der Antworten Erwachsener glich der Verteilung bei Säuglingen so eng, dass es ein skeptisches Fachgebiet überzeugte, dass Bowlby und Ainsworth etwas beschrieben hatten, das nicht mit drei Jahren endet — es wird, in Hazan und Shavers eigenen Worten, „dasselbe Wettersystem, jetzt drinnen“. Eine spätere Verfeinerung von Kim Bartholomew und Leonard Horowitz aus dem Jahr 1991 teilte „vermeidend“ weiter auf, in eine ablehnende Form („Ich brauche das nicht“) und eine ängstliche Form („Ich will das, und ich bin mir sicher, dass es wehtun wird“) — weil das einfachere Modell diese beiden sehr unterschiedlichen Arten von Schweigen nicht unterscheiden konnte.',
    'Hier ist der konkrete Mechanismus, der bei einer unbeantworteten Nachricht um ein Uhr nachts zählt: Ängstliche Bindung ist nicht einfach „sich mehr Sorgen machen“. Es ist eine messbare Hypervigilanz gegenüber Signalen der Erreichbarkeit des Partners, bei der ein zweideutiges Signal — eine Verzögerung, eine kürzere Antwort als sonst, eine Lesebestätigung ohne Folgenachricht — weniger als neutrale Information verarbeitet wird, sondern eher wie ein Alarm. Dieser Alarm löst zuverlässig Protestverhalten aus (Kontrollieren, erneutes Lesen, Doppel-Texten), das, in einer grausamen Schleife, die die Forschung immer wieder findet, oft genau die Distanz erzeugt, die es verhindern wollte.',
    'Nichts davon ist ein Urteil auf Lebenszeit. Mary Mains und Ruth Goldwyns spätere Langzeitforschung identifizierte, was sie **„erarbeitete Sicherheit“** nannten — Erwachsene, die sich trotz dokumentierter Geschichte inkonsistenter oder verängstigender früher Fürsorge in Tests als sicher gebunden erweisen, fast immer, weil etwas Späteres im Leben, meist eine stabile Beziehung, die ein paar ehrlich durchgesprochene schwere Nächte überstanden hat, dem Nervensystem eine andere Antwort auf die alte Frage beigebracht hat. **Das Gefühl, das um ein Uhr nachts ankommt, ist real. Die Geschichte, die es darüber erzählt, warum sie noch nicht geantwortet hat, ist ein erster Entwurf — und Entwürfe lassen sich überarbeiten.**',
  ].join('\n\n'),
});

// ---------- Act I: The Screenshot ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-screenshot', 0, 0)]:
    'Ein AirDrop-Ping, mitten im Unterricht. Screenshots: Tom — dein bester Freund, Nadias Freund — führt einen zweiten Chat, voller Geflirte, mit einem Mädchen von einer anderen Schule.',
  [roomBeatKey('the-screenshot', 0, 1)]: 'Du liest es zweimal. Beim zweiten Mal wird es nicht besser.',
  [roomBeatKey('the-screenshot', 0, 2)]:
    'Was die Screenshots beweisen und was nicht, sagst du dir, und ordnest es sorgfältig. Sie beweisen genug.',
  [roomBeatKey('the-screenshot', 0, 3)]:
    'Warum du? Auf der anderen Seite des Raums beobachtet der Absender dein Gesicht, wartet auf eine Reaktion. Hier ging es nie wirklich um Tom.',
  [roomBeatKey('the-screenshot', 0, 4)]: 'Der Gruppenchat surrt weiter, ahnungslos, drei getrennte Unterhaltungen übers Mittagessen.',
  [roomBeatKey('the-screenshot', 0, 5)]: 'Portier: Ein Beweis ist nie nur Information. Er ist ein Jobangebot. Merk dir: Du hast dich nicht darauf beworben.',
  [roomChoiceTextKey('the-screenshot', 'tell-nadia')]: 'Zeig Nadia heute alles.',
  [roomChoiceHintKey('the-screenshot', 'tell-nadia')]: 'Sag es der Person, der es passiert ist',
  [roomChoiceOutcomeKey('the-screenshot', 'tell-nadia', 0)]:
    'Ihr Gesicht tut das, was Gesichter in so einem Moment tun. Dann beginnt die Freundschafts-Triage — wen sie noch ertragen kann zu sehen, wen nicht.',
  [roomChoiceOutcomeKey('the-screenshot', 'tell-nadia', 1)]:
    'Tom weiß binnen einer Stunde, wer es ihr gesagt hat. Die Konsequenzen treffen ehrlich gesagt auch dich, und das Zimmer tut nicht so, als wäre es anders.',
  [roomChoiceTextKey('the-screenshot', 'confront-tom')]: 'Geh zuerst zu Tom: „Entweder du sagst es ihr, oder ich tu\'s.“',
  [roomChoiceHintKey('the-screenshot', 'confront-tom')]: 'Gib ihm die Wahl, mit Frist',
  [roomChoiceOutcomeKey('the-screenshot', 'confront-tom', 0)]:
    'Tom feilscht, verharmlost — „das sind doch nur Nachrichten“ — und fleht dann.',
  [roomChoiceOutcomeKey('the-screenshot', 'confront-tom', 1)]:
    'Du lernst, dass ein Ultimatum ein Versprechen ist, das du auch wirklich halten musst. Das Zimmer zwingt dich, auf der Stelle zu entscheiden, ob du das tust.',
  [roomChoiceTextKey('the-screenshot', 'stay-out')]: '„Nicht meine Beziehung.“ Lösch es.',
  [roomChoiceHintKey('the-screenshot', 'stay-out')]: 'Ganz raushalten',
  [roomChoiceOutcomeKey('the-screenshot', 'stay-out', 0)]: 'Das Geheimnis lässt sich nicht löschen. Es zieht bei dir ein.',
  [roomChoiceOutcomeKey('the-screenshot', 'stay-out', 1)]:
    'Jedes Treffen mit der Gruppe hat jetzt eine Wand, und die hast du gebaut — um dich selbst herum.',
  [roomChoiceTextKey('the-screenshot', 'verify-first')]: 'Erst mal in aller Stille prüfen, ob die Screenshots echt sind.',
  [roomChoiceHintKey('the-screenshot', 'verify-first')]: 'Erst sicher sein, dann handeln',
  [roomChoiceOutcomeKey('the-screenshot', 'verify-first', 0)]:
    'Sie sind echt. Und während du geprüft hast, haben drei weitere Leute denselben AirDrop bekommen.',
  [roomChoiceOutcomeKey('the-screenshot', 'verify-first', 1)]:
    'Deine Gründlichkeit hat die einzige Währung ausgegeben, die hier zählte: als Erste dran sein, oder schweigen.',
  [roomExplanationKey('the-screenshot', 0)]:
    '„Soll ich meiner Freundin sagen, dass ihr Partner fremdgeht?“ ist die Alltagsversion des Trolley-Problems: Jede Option verschiebt den Schaden nur woanders hin, und nichts zu tun ist selbst eine Entscheidung, mit einer eigenen Richtung. Forschung zum Verhalten von Zuschauer:innen zeigt, dass sich Verantwortung genau in dem Moment auflöst, in dem mehr als eine Person handeln könnte — „das macht schon jemand anders“ denkt ein ganzer Raum voller Menschen gleichzeitig. Sich rauszuhalten ist nicht neutral; es ist eine leise abgegebene Stimme für den Status quo.',
  [roomNoteTitleKey('the-screenshot')]: 'Wände, Fenster und Zuschauer',
  [roomNoteThinkersKey('the-screenshot')]: 'Shirley Glass (2003) · Darley & Latané (1968)',
  [roomNoteBodyKey('the-screenshot')]:
    'Shirley Glass beschrieb Intimität als eine Frage der Architektur — wohin die Fenster zeigen, wo die Wände stehen. Ein Geheimnis, das man „zum eigenen Besten“ bewahrt, ist eine Wand, gebaut mitten in eine Freundschaft hinein, selbst wenn die Freundschaft von außen intakt aussieht. **Jede Option in diesem Klassenzimmer verschiebt den Schaden nur woanders hin; auch „sich raushalten“ ist eine Wand, und du musst hinter ihr leben.** Die Zuschauer-Forschung von Darley und Latané — zuerst beobachtet daran, wie Fremde nicht um Hilfe riefen — gilt genauso präzise für einen Gruppenchat: Verantwortung löst sich in dem Moment auf, in dem mehr als eine Person handeln könnte, bis sie am Ende niemandem mehr gehört. Ein anderes Hotel, eine andere Wand, dieselben zwei Forscher — manche Erkenntnisse folgen einem von Gebäude zu Gebäude.',
});

// ---------- Act I: The Password ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-password', 0, 0)]:
    'Sara weint, nach einer schlimmen Woche: Ihr letzter Freund hat sie betrogen, und wenn du sie lieben würdest, würdest du ihr dein Handy-Passwort geben.',
  [roomBeatKey('the-password', 0, 1)]:
    'Es wird — aufrichtig, aus ihrer Angst heraus — als Nähe verpackt. Ein Teil von dir spürt den Sog dieser Logik; dass du es ihr geben willst, macht dich nicht naiv.',
  [roomBeatKey('the-password', 0, 2)]:
    'Und ein anderer Teil von dir registriert, unter diesem Wollen, etwas, das sich genau anhört wie ein sich drehendes Schloss.',
  [roomBeatKey('the-password', 0, 3)]:
    '„Was hast du denn zu verbergen?“, fragt sie, und die Frage ist so gebaut, dass jede Antwort wie ein Geständnis klingt.',
  [roomBeatKey('the-password', 0, 4)]:
    'Portier: Ein Schlüssel, der unter einer Frist gegeben wird, öffnet eine andere Tür als ein Schlüssel, der frei gegeben wird. Gleiches Metall. Anderes Zimmer.',
  [roomChoiceTextKey('the-password', 'give-it')]: 'Gib ihr das Passwort.',
  [roomChoiceHintKey('the-password', 'give-it')]: 'Die Distanz schließen, um die sie bittet',
  [roomChoiceOutcomeKey('the-password', 'give-it', 0)]: 'Das Zimmer belohnt es, ehrlich gesagt, kurzfristig: Sie wird weicher, die Woche heilt.',
  [roomChoiceOutcomeKey('the-password', 'give-it', 1)]:
    'Einen Monat später ertappst du dich dabei, wie du Nachrichten an Freunde schon vorher zensierst, bevor du sie abschickst. Die Überwachung sitzt jetzt in deinen Daumen, und niemand hat dich gebeten, sie zu installieren.',
  [roomChoiceTextKey('the-password', 'refuse-flat')]: 'Nein. Einfach nein.',
  [roomChoiceHintKey('the-password', 'refuse-flat')]: 'Standhaft bleiben',
  [roomChoiceOutcomeKey('the-password', 'refuse-flat', 0)]: 'Der Streit, der folgt, ist echt, und er kostet ein Stück der Beziehung.',
  [roomChoiceOutcomeKey('the-password', 'refuse-flat', 1)]:
    'Das Zimmer tut nicht so, als wären Grenzen kostenlos. Es besteht nur darauf, dass sie tragend sind.',
  [roomChoiceTextKey('the-password', 'transparency-not-surveillance')]: '„Frag mich alles, jederzeit. Aber das Schloss bleibt.“',
  [roomChoiceHintKey('the-password', 'transparency-not-surveillance')]: 'Offenheit anbieten, ohne den Schlüssel herzugeben',
  [roomChoiceOutcomeKey('the-password', 'transparency-not-surveillance', 0)]:
    'Der Unterschied setzt sich langsam durch, nicht in diesem Moment, sondern in den folgenden Wochen.',
  [roomChoiceOutcomeKey('the-password', 'transparency-not-surveillance', 1)]:
    'Die beste Tür, die zur Verfügung steht, und trotzdem nicht schmerzfrei — Vertrauen wird hier von Hand wieder aufgebaut, nicht mit Schlüsseln.',
  [roomChoiceTextKey('the-password', 'demand-hers')]: '„Gut — dann aber deins auch.“',
  [roomChoiceHintKey('the-password', 'demand-hers')]: 'Die Forderung spiegeln, statt sie zu lösen',
  [roomChoiceOutcomeKey('the-password', 'demand-hers', 0)]:
    'Wechselseitig garantierte Überwachung: zwei Menschen, die in Nachbarzimmern gegenseitig ihre Post lesen.',
  [roomChoiceOutcomeKey('the-password', 'demand-hers', 1)]: 'Das Zimmer lässt die Stille dieser Abmachung für sich selbst sprechen.',
  [roomExplanationKey('the-password', 0)]:
    'Forderungen, Liebe durch Kontrolle zu „beweisen“, eskalieren aus einem einfachen Grund: Jemandes Handy zu checken lindert die Angst sofort, und genau das bringt dem ängstlichen Kopf bei, immer wieder danach zu fragen. Das ist ein gut dokumentierter Kreislauf des Rückversicherungsverhaltens — jetzt Erleichterung, später schlimmere Angst, von vorn. Die entscheidende Unterscheidung hat nichts damit zu tun, wie sehr du jemanden liebst; sie liegt zwischen Transparenz, die angeboten wird, und Überwachung, die erzwungen wird. Ein frühes Warnzeichen für kontrollierendes Verhalten ist genau das: Fürsorge, die mit einer Frist ankommt.',
  [roomNoteTitleKey('the-password')]: 'Der Schlüssel unter Zwang',
  [roomNoteThinkersKey('the-password')]: 'Forschung zu kontrollierendem Verhalten · Studien zum Rückversicherungsverhalten',
  [roomNoteBodyKey('the-password')]:
    'Überwachung beruhigt die überwachende Person für ein paar Stunden und zersetzt über Monate hinweg beide — das ist die gut belegte Form eines Rückversicherungs-Kreislaufs, und sie erklärt, warum das „Beweisen“ von Vertrauen durch Zugang selten eine einmalige Geste bleibt. **Kontrolle trägt am Anfang fast immer die Verkleidung der Fürsorge; das verlässliche Erkennungszeichen ist nicht die Forderung selbst, sondern das, was in dem Moment passiert, in dem du Nein sagst.** Klinische Arbeiten zu kontrollierendem Verhalten nennen Überwachung eine ihrer frühesten, am leichtesten zu entschuldigenden Formen — genau deshalb, weil sie sich die Sprache der Liebe borgt. Nichts davon heißt, dass die Angst hinter der Forderung erfunden ist; es heißt, dass diese Angst eine bessere Antwort verdient als einen Schlüssel. Schlösser sind ehrlich. Fristen nicht.',
});

// ---------- Act I: The Party ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-party', 0, 0)]:
    'Sara ist dieses Wochenende bei ihrer Oma. Auf der Party wird Flaschendrehen mit Kuss-Pflicht gespielt, und die Flasche — live gedreht, alle zählen die Umdrehungen laut mit — bleibt bei dir stehen, und bei Klara aus der Parallelklasse.',
  [roomBeatKey('the-party', 0, 1)]:
    'Die Rechtfertigungen kommen eine nach der anderen, jede für sich vollkommen einleuchtend: Es ist doch nur ein Spiel. Sie würde lachen, wenn sie es richtig erklärt bekäme. Alle schauen zu, was es irgendwie weniger echt macht, nicht mehr.',
  [roomBeatKey('the-party', 0, 2)]:
    'Es zählt nicht — du kannst spüren, wie dieser Satz sich Stück für Stück zusammenbaut, noch bevor du überhaupt irgendetwas entschieden hast.',
  [roomBeatKey('the-party', 0, 3)]: 'Ein Raum voller erhobener Handys. Hier wird alles aufgenommen; das ist einfach die Physik einer Erdgeschoss-Party.',
  [roomBeatKey('the-party', 0, 4)]:
    'Klara zuckt mit den Schultern, freundlich und völlig unbeeindruckt — für sie bedeutet das so oder so nichts, was den Moment irgendwie gleichzeitig kleiner und größer macht.',
  [roomBeatKey('the-party', 0, 5)]:
    'Portier: „Es ist einfach passiert“ wird im Voraus zusammengebaut, Stück für Stück. Du siehst gerade dem Fließband dabei zu.',
  [roomChoiceTextKey('the-party', 'play-and-bury')]: 'Die Pflicht erfüllen. Niemandem etwas sagen.',
  [roomChoiceHintKey('the-party', 'play-and-bury')]: 'Es still zu nichts werden lassen',
  [roomChoiceOutcomeKey('the-party', 'play-and-bury', 0)]: 'Der Kuss ist nichts. Das Vergraben ist etwas.',
  [roomChoiceOutcomeKey('the-party', 'play-and-bury', 1)]:
    'Die Handys waren oben. Irgendwo, in irgendjemandes Tasche, leuchtet ein Display auf, unversendet — vorerst.',
  [roomChoiceTextKey('the-party', 'play-and-tell')]: 'Mitmachen. Es Sara noch heute Abend selbst sagen.',
  [roomChoiceHintKey('the-party', 'play-and-tell')]: 'Lass sie es zuerst von dir hören',
  [roomChoiceOutcomeKey('the-party', 'play-and-tell', 0)]:
    'Ihre Reaktion gehört ihr — verletzt, dann seltsam beruhigt davon, es als Erste erfahren zu haben.',
  [roomChoiceOutcomeKey('the-party', 'play-and-tell', 1)]:
    'Es zu erzählen kostet weniger, als das Herausfinden gekostet hätte. Das Zimmer zeigt dir den Unterschied, ehrlich, nebeneinander.',
  [roomChoiceTextKey('the-party', 'refuse')]: 'Die Pflicht verweigern. Den Spott aushalten.',
  [roomChoiceHintKey('the-party', 'refuse')]: 'Dreißig Sekunden lang ausgelacht werden aushalten',
  [roomChoiceOutcomeKey('the-party', 'refuse', 0)]: 'Dreißig Sekunden Gejohle, die sich von innen wie eine Stunde anfühlen.',
  [roomChoiceOutcomeKey('the-party', 'refuse', 1)]: 'Dann geht die Party weiter, weil Partys das tun. Jemand, den du nicht bemerkt hattest, hat dich bemerkt.',
  [roomChoiceTextKey('the-party', 'leave')]: 'Einfach die Party verlassen.',
  [roomChoiceHintKey('the-party', 'leave')]: 'Dich selbst vom Fließband nehmen',
  [roomChoiceOutcomeKey('the-party', 'leave', 0)]: 'Die kalte Luft draußen, als ein ganzer, unbeeilter Moment.',
  [roomChoiceOutcomeKey('the-party', 'leave', 1)]:
    'Nichts ist passiert — und du lernst, dass „nichts ist passiert“ etwas sein kann, das du getan hast, und nicht nur etwas, dem du bloß ausgewichen bist.',
  [roomExplanationKey('the-party', 0)]:
    'Der Psychologe Albert Bandura untersuchte, wie der Kopf sich seine eigenen Ausreden schon vor einer Tat zurechtlegt, nicht danach — eine Reihe von Mechanismen der „moralischen Distanzierung“ (es ein Spiel nennen, es mit Schlimmerem vergleichen, die Verantwortung auf einen ganzen Raum verteilen), die eine Entscheidung im Voraus kleiner wirken lassen, als sie ist. Alkohol verstärkt das noch durch eine Art „Tunnelblick“: Was direkt vor dir liegt, wird lauter, und Konsequenzen, die weiter entfernt liegen, werden leiser. Keine dieser beiden Tatsachen entschuldigt irgendetwas — sie erklären nur, warum „es war doch nur ein Spiel“ bei fast jedem funktioniert, außer bei der Person, der es passiert ist.',
  [roomNoteTitleKey('the-party')]: 'Die Montage von „Es ist einfach passiert“',
  [roomNoteThinkersKey('the-party')]: 'Bandura (1999) · Steele & Josephs (1990)',
  [roomNoteBodyKey('the-party')]:
    'Bandura benannte die konkreten gedanklichen Kniffe, mit denen Menschen gegen ihre eigenen Werte handeln, ohne das Gefühl zu haben, es zu tun: beschönigende Etikettierung („es ist doch nur ein Spiel“), Verantwortungsdiffusion („das machen doch alle“) und vorteilhafter Vergleich („ich hab ja wenigstens nicht—“). Nichts davon passiert erst nach der Tat, als Aufräumarbeit; **es wird vorher zusammengebaut, Stück für Stück, und „es ist einfach passiert“ ist das fertige Produkt eines Prozesses, der unterwegs jede Menge Entscheidungspunkte hatte.** Die Forschung von Steele und Josephs zur alkoholbedingten „Kurzsichtigkeit“ fügt den Dimmer hinzu: Rausch entfernt das Urteilsvermögen nicht so sehr, wie er sein Blickfeld auf das Lauteste im Raum verengt. Niemand in diesem Hotel wollte je bewusst einchecken.',
});

// ---------- Act I: The Forward ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-forward', 0, 0)]:
    'Ein Ping im Klassenchat. Ein Foto, das nie für diesen Chat bestimmt war, weitergeleitet von jemandem, dem Ema vertraut hat.',
  [roomBeatKey('the-forward', 0, 1)]:
    'Der Chat tut, was Chats eben tun: Witze, Screenshots von Screenshots, drei Leute tippen gleichzeitig. Dein Daumen schwebt über der Tastatur, entscheidet noch nichts.',
  [roomBeatKey('the-forward', 0, 2)]:
    'Das Gelächter scrollt in Echtzeit vorbei — ein Dutzend Nachrichten in der Zeit, die du brauchst, um drei davon zu lesen.',
  [roomBeatKey('the-forward', 0, 3)]: 'Ema ist mit dir in Mathe. Sie weiß es noch nicht. Du musst die ganze Zeit an die zweite Stunde denken.',
  [roomBeatKey('the-forward', 0, 4)]:
    'Portier: Jeder in diesem Chat redet sich ein, nur Publikum zu sein. Genau so funktioniert das hier — durch Publikum.',
  [roomChoiceTextKey('the-forward', 'delete-only')]: 'Löschen. Nichts sagen.',
  [roomChoiceHintKey('the-forward', 'delete-only')]: 'Dich still zurückziehen',
  [roomChoiceOutcomeKey('the-forward', 'delete-only', 0)]: 'Deine Hände sind sauber, und sonst nichts.',
  [roomChoiceOutcomeKey('the-forward', 'delete-only', 1)]:
    'Der Chat scrollt weiter. Irgendwo zählt das Zimmer still die anderen neununddreißig Zuschauer:innen mit, die nichts gelöscht haben.',
  [roomChoiceTextKey('the-forward', 'report')]: 'Melden — bei der Plattform, und bei einer erwachsenen Person in der Schule.',
  [roomChoiceHintKey('the-forward', 'report')]: 'Jemanden mit Autorität einbeziehen',
  [roomChoiceOutcomeKey('the-forward', 'report', 0)]:
    'Erwachsene bewegen sich langsamer als ein Chat und schneller als gar nichts. Konsequenzen für den Absender kommen, irgendwann.',
  [roomChoiceOutcomeKey('the-forward', 'report', 1)]:
    'Der Chat hängt dir eine Woche lang einen Spitznamen an. Das Zimmer lässt diese Kosten echt sein — und lässt sie sich trotzdem lohnen.',
  [roomChoiceTextKey('the-forward', 'tell-ema-first')]: 'Ema zuerst schreiben, damit sie nicht als Letzte davon erfährt.',
  [roomChoiceHintKey('the-forward', 'tell-ema-first')]: 'Ihr die Vorwarnung geben, die sonst niemand gibt',
  [roomChoiceOutcomeKey('the-forward', 'tell-ema-first', 0)]: 'Die schwerste Nachricht, die du je getippt hast. Ihre Antwort besteht aus zwei Wörtern.',
  [roomChoiceOutcomeKey('the-forward', 'tell-ema-first', 1)]:
    'Jahre später — ein Sprung in die Zukunft, den sich das Erdgeschoss nur selten erlaubt — weiß sie immer noch, wer es ihr gesagt hat. Die seltene, unzweideutige Güte dieses Zimmers. Trotzdem nicht schmerzfrei.',
  [roomChoiceTextKey('the-forward', 'confront-publicly')]: 'Den Absender direkt im Chat bloßstellen.',
  [roomChoiceHintKey('the-forward', 'confront-publicly')]: 'Es sichtbar machen',
  [roomChoiceOutcomeKey('the-forward', 'confront-publicly', 0)]:
    'Der Chat wendet sich gegen ihn. Dann gegen das Drama an sich. Dann — das Zimmer ist hier ehrlich — teilweise wieder gegen Ema.',
  [roomChoiceOutcomeKey('the-forward', 'confront-publicly', 1)]:
    'Öffentliche Konfrontation ist ein stumpfes Werkzeug. Sie trifft mehrere Leute, nicht immer die, auf die du gezielt hast.',
  [roomExplanationKey('the-forward', 0)]:
    'Die Einwilligung, fotografiert, gefilmt oder aufgenommen zu werden, wandert nicht mit der Datei mit — jedes Weiterleiten ist eine eigene, neue Handlung, keine Fortsetzung von jemand anderem. In den meisten Rechtsordnungen ist das Teilen intimer Bilder ohne Einwilligung eine ernsthafte Straftat, und das gilt für jede Person, die es weiterleitet, nicht nur für die erste, die es verschickt hat. Was der Person auf dem Foto wirklich hilft, ist gut belegt und ganz und gar unspektakulär: direkt informiert werden, ohne Zweifel geglaubt werden, und Erwachsene, die schnell handeln.',
  [roomNoteTitleKey('the-forward')]: 'Das vierzigste Publikum',
  [roomNoteThinkersKey('the-forward')]: 'Forschung zu nicht-einvernehmlichem Bilderteilen · die rechtliche Realität',
  [roomNoteBodyKey('the-forward')]:
    'Das ist die eine Randnotiz im ganzen Hotel, die beim Thema Recht Klartext reden darf: In den meisten Rechtsordnungen ist das Weiterleiten eines intimen Bildes ohne Einwilligung der abgebildeten Person eine ernsthafte Straftat — für jede Person, die es weiterleitet, nicht nur für die, die es zuerst verschickt hat. Die Forschung zu bildbasiertem Missbrauch zeigt, dass sich der Schaden mit jeder weiteren Betrachterin und jedem weiteren Betrachter summiert; **der Schaden ist nicht das ursprüngliche Foto, der Schaden ist das Publikum, und das Publikum wächst jedes Mal weiter, wenn jemand auf Weiterleiten tippt.** Die Forschung zum Wandel vom Zuschauer zum Helfer ist sich einig, was wirklich hilft: eine direkte, frühe Warnung an die betroffene Person, und Erwachsene, die schnell eingreifen statt still zu bleiben. Der ursprüngliche Absender hat einen Knopf gedrückt. Jeder danach auch.',
});

// ---------- Act I: The Best Friend's Girl ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-best-friends-girl', 0, 0)]:
    'Ein ganz normaler Lernabend bei Tom. Nadia sitzt auf dem Boden über ihren Hausaufgaben, hört nur halb zu. Das hier sollte kein kompliziertes Zimmer sein.',
  // beat 1 is a function beat — registered below via register().
  [roomBeatKey('the-best-friends-girl', 0, 2)]:
    'Als Nächstes kommt die Inventur der Loyalität: alles, was Tom dir je war, jeder Gefallen, jeder Anruf um zwei Uhr nachts, aufgereiht wie Beweismaterial für einen Fall, von dem du nicht wusstest, dass du ihn aufbaust.',
  [roomBeatKey('the-best-friends-girl', 0, 3)]:
    '[die Bushaltestelle, letzten Dienstag — ihr Ärmel, der deinen streift, völlig zufällig, trotzdem immer wieder abgespielt, in einer Schleife ohne Aus-Knopf]',
  [roomBeatKey('the-best-friends-girl', 0, 4)]:
    'Die Rechnung der Zeichen: War das ein Blick, oder nur ein Blick, der zufällig bei dir gelandet ist. Das Zimmer lässt dich rechnen und korrigiert dann, ehrlich, deine Hausaufgabe — die Rechnung ist unzuverlässig, und du machst sie trotzdem.',
  [roomBeatKey('the-best-friends-girl', 0, 5)]:
    'Portier: Der Zustand, in dem du bist, hat einen klinischen Namen, einen dokumentierten Verlauf und kein Lenkrad. Dein Verhalten aber schon.',
  [roomChoiceTextKey('the-best-friends-girl', 'confess-to-her')]: 'Sag es Nadia.',
  [roomChoiceHintKey('the-best-friends-girl', 'confess-to-her')]: 'Sag es der Person, um die es geht',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'confess-to-her', 0)]:
    'Was auch immer sie fühlt — das Zimmer lässt es ehrlicherweise offen, eine halbe Sekunde ist kein Vertrag —, das ganze Gefüge hat jetzt einen Riss.',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'confess-to-her', 1)]:
    'Toms nächstes „alles okay bei dir?“ trifft dich wie eine Glocke, die man nicht mehr überhören kann.',
  [roomChoiceTextKey('the-best-friends-girl', 'starve-it')]: 'Abstand. Kein Drama, keine Erklärung.',
  [roomChoiceHintKey('the-best-friends-girl', 'starve-it')]: 'Es still aushungern lassen',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'starve-it', 0)]:
    'Ausgehungerte Limerenz ist eine Weile lang laute Limerenz — die aufdringlichen Gedanken werden schlimmer, bevor sie besser werden.',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'starve-it', 1)]: 'Dann, über Wochen hinweg, verblassen sie. Der ehrliche Preis der ehrlichen Option.',
  [roomChoiceTextKey('the-best-friends-girl', 'tell-tom')]: 'Sag Tom die Wahrheit über das Gefühl.',
  [roomChoiceHintKey('the-best-friends-girl', 'tell-tom')]: 'Vertrau es deinem Freund an',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'tell-tom', 0)]:
    'Der mutigste Satz auf diesem Stockwerk. Toms Schweigen, dann: „okay. danke, dass du\'s mir gesagt hast und nicht ihr.“',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'tell-tom', 1)]:
    'Die Freundschaft übersteht es, verändert — eine Wand, ersetzt durch ein Fenster, zum Preis von etwas Behaglichkeit.',
  [roomChoiceTextKey('the-best-friends-girl', 'test-the-evening')]: 'Einen zweideutigen Abend inszenieren, um es herauszufinden.',
  [roomChoiceHintKey('the-best-friends-girl', 'test-the-evening')]: 'Dir deine eigene Antwort herstellen',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'test-the-evening', 0)]: 'Inszenierte Zweideutigkeit liefert Zweideutigkeit zurück — verstärkt.',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'test-the-evening', 1)]:
    'Jetzt zählen zwei Leute halbe Sekunden. Das Zimmer verrät nicht, wer von euch beiden damit angefangen hat.',
  [roomExplanationKey('the-best-friends-girl', 0)]:
    'Limerenz ist ein unwillkürlicher Zustand — du suchst ihn dir genauso wenig aus wie ein Fieber —, aber was du als Nächstes tust, ist trotzdem vollkommen deine eigene Entscheidung. Zeichen zu lesen (war das ein Blick, war das ein Lachen) fühlt sich an wie Beweise sammeln, ist aber meistens näher an Belletristik. Der Kopf in der Limerenz ist extrem gut darin, Bestätigung für das zu finden, was er sowieso schon glauben will. Der Satz, an dem du dich festhalten kannst: Für das Gefühl musst du dich nicht schämen. Für dein Verhalten musst du geradestehen.',
  [roomNoteTitleKey('the-best-friends-girl')]: 'Der Zustand ohne Lenkrad',
  [roomNoteThinkersKey('the-best-friends-girl')]: 'Tennov (1979) · Schmitt & Buss (2001)',
  [roomNoteBodyKey('the-best-friends-girl')]:
    'Tennovs ursprüngliche Forschung kartierte den Verlauf der Limerenz präzise: Beginn, Kristallisation und — unbeachtet — Verfall, typischerweise innerhalb von sechs Monaten bis zwei Jahren. Das ist keine Metapher für eine Schwärmerei; es ist ein dokumentierter psychologischer Zustand mit aufdringlichem Denken als seinem zentralen, messbaren Symptom. Die Forschung zum „Partner-Abwerben“ (Schmitt & Buss) untersuchte genau dieses Dreieck aus allen drei Ecken — die Person, die sich zu einem vergebenen Menschen hingezogen fühlt, die vergebene Person, und die Person, die es noch nicht weiß — und fand heraus, dass echte Kosten bei allen dreien anfallen, egal was danach passiert. **Gefühle sind hier Wetter; die Front, die da durchzieht, hast du dir nicht ausgesucht, aber den Schirm hältst trotzdem du, oder eben nicht.** Jeder Gast, der je eine Freundschaft niedergebrannt hat, hat geschworen, dass das Lachen ein Zeichen war.',
  [roomArticleTitleKey('the-best-friends-girl')]: 'Die Wissenschaftlerin, die dem, was du fühlst, einen Namen gab',
  [roomArticleBodyKey('the-best-friends-girl')]: [
    '1979 veröffentlichte die Psychologin Dorothy Tennov Love and Limerence: The Experience of Being in Love, aufgebaut auf strukturierten Interviews mit rund fünfhundert Menschen, über einen Zustand, dem sie bewusst einen klinischen, wertungsfreien Namen gab — nicht „Liebe“, was ihr zu weit gefasst und zu schmeichelhaft erschien, und nicht „Schwärmerei“ oder „Verknalltsein“, was ihr zu abwertend erschien für etwas, das Menschen als wirklich überwältigend erlebten. Sie wollte ein Wort ohne eingebautes Urteil, nur eine Beschreibung.',
    'Tennovs Interviews kartierten ein bemerkenswert konsistentes Symptomcluster: aufdringliches, unwillkürliches Denken an das Objekt der Limerenz, das sich nicht einfach wegwünschen lässt; ein akutes, konkretes Verlangen nach Erwiderung statt allgemeiner Zuneigung; und — der Befund, der die meisten Menschen am meisten überrascht — **Verstärkung unter Ungewissheit und Widrigkeit, statt Auflösung.** Zweideutigkeit hungert die Limerenz nicht aus. Sie nährt sie, weil ein ungelöstes Signal dem Geist Raum lässt, die Lücke mit Hoffnung zu füllen, und Hoffnung kann, anders als Gewissheit, sehr lange mit sehr wenig Treibstoff laufen. Unbeachtet, so fand Tennov, durchlief der Zustand typischerweise seinen vollen Bogen — Beginn, „Kristallisation“ und schließlicher Verfall — irgendwo zwischen achtzehn Monaten und drei Jahren.',
    'Jahrzehnte später fand die Neurowissenschaft physische Mechanismen, die zu Tennovs Interviewdaten passen. Helen Fishers fMRT-Forschung in den frühen 2000er-Jahren scannte Menschen, die berichteten, intensiv, frisch verliebt zu sein, und fand Aktivierung konzentriert in dopaminreichen Belohnungsschaltkreisen — dem ventralen Tegmentum, dem Nucleus caudatus —, Muster, die sich erheblich mit dem überschneiden, was Scans bei Substanzverlangen zeigen. Das bedeutet nicht, dass Limerenz im klinischen Sinne Sucht *ist*, aber es bedeutet, dass „Ich kann körperlich nicht aufhören, an sie zu denken“ der wörtlichen Wahrheit messbar näherkommt als einer Redewendung.',
    'Jeffry Simpson, und getrennt davon David Schmitt und David Buss in ihrer großen kulturübergreifenden Studie zum „Partner-Abwerben“ von 2001, untersuchten genau das Dreieck, in das dich dieser Raum stellt — betrachtet aus allen drei Ecken gleichzeitig: die Person, die begehrt, die Person, die schon vergeben ist, und der Partner, der es noch nicht weiß. Der Befund, der am längsten bei dir bleiben sollte, ist, dass echte, messbare Kosten bei **allen drei** Parteien anfallen, weitgehend unabhängig davon, wie sich die Situation letztlich löst. Es gibt keine Version dieses Dreiecks, in der nur eine Person exponiert ist.',
    'Der Satz, den es sich lohnt, aus diesem Raum mitzunehmen, ist der, den Tennovs eigene Daten letztlich klar erzwungen haben, zwischen zwei Dingen, die Menschen dazu neigen zu verschmelzen: **dem Zustand und dem Verhalten.** Das Gefühl, das ungebeten ankommt, chemisch real und unwillkürlich, ist kein moralisches Ereignis. Was du mit der Freundin eines Freundes tust, während du es fühlst, ist der einzige Teil, für den dich irgendjemand — auch du selbst, später — zur Rechenschaft ziehen darf.',
  ].join('\n\n'),
});

register(roomBeatKey('the-best-friends-girl', 0, 1), 'v2', 'de', (s: RunState) =>
  s.axes.controlAcceptance < 0
    ? '[das Lachen, eine halbe Sekunde zu lang, immer wieder abgespielt — du hast es jetzt elfmal gezählt, und die Zahl lässt dich nicht schlafen]'
    : '[das Lachen, eine halbe Sekunde zu lang, immer wieder abgespielt — dir fällt auf, dass du zählst, und dir fällt das Auffallen selbst auf]',
);

// ---------- Act I: The Summer Ends ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-summer-ends', 0, 0)]:
    'Die Uni in einer anderen Stadt beginnt in drei Wochen. Das Packen läuft Stück für Stück, fast zeremoniell ab — was in die Kiste kommt, ist das Museum der Beziehung, von Hand kuratiert.',
  [roomBeatKey('the-summer-ends', 0, 1)]:
    'Jeder hat eine Meinung, und jeder bietet sie ungefragt an: deine Mutter, ihre Schwester, der Gruppenchat, ein Fremder auf einer Party, der 2003 eine Fernbeziehung hatte.',
  [roomBeatKey('the-summer-ends', 0, 2)]:
    'Unter der ganzen Logistik liegt die eigentliche Frage, seit drei Wochen ungestellt: was der September für euch beide eigentlich bedeutet.',
  // beat 3 is a function beat — registered below via register().
  [roomBeatKey('the-summer-ends', 0, 4)]:
    'Portier: Diese Entscheidung treffen die Gäste meistens schon auf dem Flur. Das Zimmer bringt sie nur dazu, es laut auszusprechen.',
  [roomChoiceTextKey('the-summer-ends', 'promise-ldr')]: 'Die Fernbeziehung versprechen, von der alle sagen, sie wird scheitern.',
  [roomChoiceHintKey('the-summer-ends', 'promise-ldr')]: 'Dich über die Distanz hinweg binden',
  [roomChoiceOutcomeKey('the-summer-ends', 'promise-ldr', 0)]:
    'Das Versprechen ist echt, und die Statistik ist es auch. Das Zimmer verrät nicht, welche der beiden Möglichkeiten ihr am Ende sein werdet.',
  [roomChoiceTextKey('the-summer-ends', 'end-clean')]: 'Es jetzt beenden, am besten Tag statt am schlimmsten.',
  [roomChoiceHintKey('the-summer-ends', 'end-clean')]: 'Das Ende wählen, statt auf eines zu warten',
  [roomChoiceOutcomeKey('the-summer-ends', 'end-clean', 0)]: 'Die seltsame Würde eines gewählten Endes. Trauer ohne Bösewicht.',
  [roomChoiceOutcomeKey('the-summer-ends', 'end-clean', 1)]:
    'Das Zimmer merkt still an, dass „rechtzeitig“ ein Ort ist, von dem fast niemand es schafft aufzubrechen.',
  [roomChoiceTextKey('the-summer-ends', 'drift')]: 'Nichts versprechen. Es verblassen lassen.',
  [roomChoiceHintKey('the-summer-ends', 'drift')]: 'Dem Gespräch ganz aus dem Weg gehen',
  [roomChoiceOutcomeKey('the-summer-ends', 'drift', 0)]: 'Der feige Weg, ehrlich beziffert: keine Szene, kein Ende.',
  [roomChoiceOutcomeKey('the-summer-ends', 'drift', 1)]:
    'Achtzehn Monate später gibt es immer noch kein Wort dafür, was ihr wart. Der unvollendete Satz folgt dir.',
  [roomChoiceTextKey('the-summer-ends', 'open-until-christmas')]: 'Eine Abmachung vorschlagen, die ihr beide noch nicht versteht.',
  [roomChoiceHintKey('the-summer-ends', 'open-until-christmas')]: '„offen“, undefiniert',
  [roomChoiceOutcomeKey('the-summer-ends', 'open-until-christmas', 0)]:
    'Das Wort „offen“ trägt mehr Gewicht, als ihr beide mit achtzehn stemmen könnt.',
  [roomChoiceOutcomeKey('the-summer-ends', 'open-until-christmas', 1)]:
    'Die Bedingungen bleiben heute Nacht undefiniert — und werden, schmerzhaft, noch vor Jahresende neu verhandelt.',
  [roomExplanationKey('the-summer-ends', 0)]:
    'Rusbults Investitionsmodell reduziert die Frage „warum bleiben oder verlassen Menschen jemanden“ auf drei einfache Zutaten: Zufriedenheit (wie gut es sich anfühlt), Investition (wie viel du hineingesteckt hast — Zeit, Erinnerungen, Pläne) und Alternativen (was oder wer sonst noch verfügbar erscheint). Beziehungen bestehen oft weiter oder enden aus Gründen, die sehr wenig damit zu tun haben, wie viel Liebe vorhanden ist — eine gut investierte, nur mäßig befriedigende Beziehung kann länger halten als eine überglückliche mit geringer Investition. Keine der vier Türen hier ist „richtig“; das Modell erklärt nur, warum jede von ihnen eine echte, in sich stimmige Entscheidung ist, kein moralisches Versagen.',
  [roomNoteTitleKey('the-summer-ends')]: 'Die Rechnung des Bleibens',
  [roomNoteThinkersKey('the-summer-ends')]: 'Caryl Rusbult (1980)',
  [roomNoteBodyKey('the-summer-ends')]:
    'Rusbults Investitionsmodell legt eine trügerisch einfache Gleichung unter Bindung: Zufriedenheit plus Investition minus Alternativen. Sie hat sich über Jahrzehnte der Forschung hinweg bemerkenswert gut gehalten, und ihre unangenehmste Implikation ist diese — **Menschen bleiben in Beziehungen, und verlassen sie, aus Gründen, die oft nichts damit zu tun haben, ob Liebe vorhanden ist.** Eine stark investierte Beziehung kann Jahre über ihre Zufriedenheit hinaus überleben; eine kaum investierte kann in dem Moment enden, in dem etwas Besseres auftaucht, egal, wie sie sich angefühlt hat. Das ist der erste echte Auftritt dieses Modells im Hotel; das Zimmer am Vorabend der Hochzeit in Akt III erntet es voll aus, sobald die Investition ein Jahrzehnt Zeit hatte, sich aufzusummieren. Der Koffer wurde so oder so gepackt. Nur das Etikett hat sich geändert.',
});

register(roomBeatKey('the-summer-ends', 0, 3), 'v2', 'de', (s: RunState) =>
  s.flags.includes('gave-the-key')
    ? 'Du erinnerst dich an das Passwort, an den Monat, den es gebraucht hat, bis du aufgehört hast, Nachrichten vorher zu zensieren. Was auch immer du jetzt versprichst — du weißt schon, was es kostet, etwas aus Angst zu versprechen statt aus Gewissheit.'
    : s.flags.includes('it-didnt-count')
      ? 'Du erinnerst dich an die Party — an den Satz, den du dir zurechtgelegt und ihr nie erzählt hast. Was auch immer du jetzt versprichst, ein Teil vom Gewicht dieses Jahres fährt mit, ob sie es weiß oder nicht.'
      : 'Was ihr beide euch, einmal, ganz am Anfang des Jahres, gewünscht habt, fühlt sich gleichzeitig näher und weiter weg an als drei Wochen.',
);

// ---------- Act I: The Rumor (gate) ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-rumor', 0, 0)]:
    'Die Schule behauptet, Sara sei beim Wochenende am See fremdgegangen. Die Beweise: eine verwackelte Story, zwei Freunde von Freunden, und ihre merkwürdige Wortkargheit seit Sonntag.',
  [roomBeatKey('the-rumor', 0, 1)]:
    'Du zählst auf, was du wirklich weißt, und dann — darauf besteht das Zimmer ebenfalls — was du nicht weißt. Beide Listen sind kürzer als das Gerücht.',
  [roomBeatKey('the-rumor', 0, 2)]:
    'Was das Nicht-Wissen mit dir macht, Stunde für Stunde, ist eine eigene kleine Fallstudie, und du bist gleichzeitig ihr Gegenstand und ihr einziger Zeuge.',
  [roomBeatKey('the-rumor', 0, 3)]:
    'Ihre Nachricht liegt unbeantwortet auf deinem Display: „was ist los?“ Du hast sie elfmal gelesen und nullmal beantwortet.',
  [roomBeatKey('the-rumor', 0, 4)]:
    'Drei Möglichkeiten bieten sich an, und keine davon ist angenehm: sie direkt fragen, vorsichtig in ihrem Umfeld nachfragen, oder eine Falle stellen und schauen, wer hineintappt.',
  [roomBeatKey('the-rumor', 0, 5)]:
    'Portier: Es gibt Tests, die etwas messen, und Tests, die es erst erschaffen. Die Rezeption führt die erste Sorte nicht mehr. Die Gäste haben nie danach gefragt.',
  [roomChoiceTextKey('the-rumor', 'trust-without-asking')]: 'Ihr den vollen Vertrauensvorschuss geben. Nie fragen.',
  [roomChoiceHintKey('the-rumor', 'trust-without-asking')]: 'Dich fürs Nichtwissen entscheiden',
  [roomChoiceOutcomeKey('the-rumor', 'trust-without-asking', 0)]:
    'Du lebst damit, es nie zu erfahren — für immer. Kein späteres Zimmer klärt das auf; keines wird das je tun.',
  [roomChoiceOutcomeKey('the-rumor', 'trust-without-asking', 1)]:
    'Vertrauen, behandelt als Entscheidung statt als Schlussfolgerung, wiegt schwerer, als es klingt. Das Zimmer wiegt es ehrlich ab und tut nicht so, als wäre das Gewicht gering.',
  [roomChoiceTextKey('the-rumor', 'ask-her-plainly')]:
    'Antworte auf ihre Nachricht. Sag ihr einmal, ganz offen, was du gehört hast — und nimm dann ihre Antwort an.',
  [roomChoiceHintKey('the-rumor', 'ask-her-plainly')]: 'Die Frage, ohne Gerichtssaal drumherum',
  [roomChoiceOutcomeKey('the-rumor', 'ask-her-plainly', 0)]:
    'Auf die elfmal gelesene Nachricht antwortest du mit einem einzigen Satz: was du gehört hast, einmal gesagt, ohne einen Gerichtssaal drumherum gebaut.',
  [roomChoiceOutcomeKey('the-rumor', 'ask-her-plainly', 1)]:
    'Sie erzählt dir, was passiert ist. Du kannst es nicht überprüfen, und du versuchst es auch nicht — das war nie die Abmachung, die ihr gerade getroffen habt. Eine Frage, offen gestellt, bekommt eine Antwort; sie bekommt keinen Lügendetektor.',
  [roomChoiceOutcomeKey('the-rumor', 'ask-her-plainly', 2)]:
    'Und jetzt weiß sie auch etwas, das sie vor einer Stunde noch nicht wusste: dass das Gerücht dich erreicht hat und so lange in dir gewohnt hat, wie du gebraucht hast, um endlich zurückzuschreiben. Auch das hat etwas gekostet.',
  [roomChoiceTextKey('the-rumor', 'interrogate')]: 'Frag sie alles ab. Daten, Namen, Details.',
  [roomChoiceHintKey('the-rumor', 'interrogate')]: 'Den vollständigen Bericht verlangen',
  [roomChoiceOutcomeKey('the-rumor', 'interrogate', 0)]:
    'Antworten kommen, und mit ihnen der Schaden — schon die Fragen selbst verraten ihr genau, für was du sie hältst.',
  [roomChoiceOutcomeKey('the-rumor', 'interrogate', 1)]:
    'Wie sich die Wahrheit auch herausstellt, das Verhör gehört jetzt für immer zur Beziehung, als festes Inventar.',
  [roomChoiceTextKey('the-rumor', 'set-the-trap')]: 'Erzähl ihr ein erfundenes Detail — eins, das nur eine schuldige Person richtigstellen würde.',
  [roomChoiceHintKey('the-rumor', 'set-the-trap')]: 'Eine Falle stellen und zusehen',
  [roomChoiceOutcomeKey('the-rumor', 'set-the-trap', 0)]: 'Die Falle funktioniert. Das Zimmer lässt sie funktionieren.',
  [roomChoiceOutcomeKey('the-rumor', 'set-the-trap', 1)]:
    'Das Wissen kommt im selben Umschlag wie das hier an: Du bist jetzt jemand, der Menschen, die er liebt, in Fallen lockt. Beide Tatsachen sind endgültig. Das letzte Tor liest dir das später wortwörtlich vor.',
  [roomChoiceTextKey('the-rumor', 'ask-the-accuser')]: 'Geh zur Quelle: „was hast du eigentlich davon?“',
  [roomChoiceHintKey('the-rumor', 'ask-the-accuser')]: 'Den Motor des Gerüchts infrage stellen, nicht sie',
  [roomChoiceOutcomeKey('the-rumor', 'ask-the-accuser', 0)]:
    'Die seltene dritte Tür. Der eigentliche Motor des Gerüchts wird sichtbar — ein alter Groll, ein langweiliges Wochenende, ein missverstandenes Foto.',
  [roomChoiceOutcomeKey('the-rumor', 'ask-the-accuser', 1)]:
    'Keine wirkliche Rechtfertigung, aber eine Entdeckung mit längerer Halbwertszeit: Die Frage „stimmt es?“ hatte die ganze Zeit eine ältere Schwester — „wem nützt es?“',
  [roomExplanationKey('the-rumor', 0)]:
    'Bestätigungsfehler bedeutet: Sobald der Kopf misstrauisch geworden ist, wird er sehr gut darin, Beweise für den Verdacht zu finden, und sehr schlecht darin, Beweise dagegen zu bemerken — der Psychologe Raymond Nickerson dokumentierte das als einen der robustesten Befunde des Fachgebiets. Der „Othello-Test“ beschreibt eine verwandte Falle: Schon der Akt, jemanden auf Schuld zu prüfen, kann ein Verhalten erzeugen, das genau wie Schuld aussieht — ob welche vorliegt oder nicht —, benannt danach, wie Othellos Verdacht sich selbst die Beweise herstellt, die ihn zerstören. „Vertrauensvorschuss“ ist nicht umsonst; er kostet die Gewissheit, die man durch Nachfragen bekäme, und kauft der Beziehung die Chance, das Nicht-Wissen zu überstehen.',
  [roomNoteTitleKey('the-rumor')]: 'Der Test, der sein eigenes Ergebnis erschafft',
  [roomNoteThinkersKey('the-rumor')]: 'Nickerson (1998) · Othello (1603)',
  [roomNoteBodyKey('the-rumor')]:
    'Nickersons Überblick über die Forschung zum Bestätigungsfehler ist eindeutig: Sobald eine Überzeugung erst einmal steht, rekrutiert der Kopf viel bereitwilliger Beweise dafür als dagegen — Verdacht nährt sich standardmäßig selbst, nicht nur ausnahmsweise. Die Othello-Dynamik verschärft die Falle noch: Ein Test, der Schuld aufdecken soll, kann bei dem einen oder der anderen Verhalten erzeugen, das von Schuld nicht zu unterscheiden ist, und der Test selbst kann dir nicht sagen, bei wem. **Gewissheit über einen Partner, erkauft durch Überwachung oder eine Falle, wird in einer Währung bezahlt, die genau die Beziehung entwertet, die sie angeblich schützen soll.** Von den Gästen, die die Falle gestellt haben, hat jeder Einzelne etwas gefangen. Nicht allen hat gefallen, was es am Ende war.',
});
