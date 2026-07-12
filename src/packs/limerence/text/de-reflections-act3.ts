// German translations for LIMERENCE Act III's Examined Path reflections
// (spec 05). Every line is translated with the specific room's actual
// situation and the choice's real stakes in mind, not word-for-word from
// English — see CLAUDE.md's translation rule. Two rooms' choices carry no
// `reflections` field in the English source and are correctly absent here:
// the-usual-suite's three choices (name-them, watch-silent,
// ask-who-books-it) and the-wedding-eve's keepsake choice
// (hold-the-cheap-ring) — verified against src/packs/limerence/rooms/act3.ts
// directly, not assumed from the Czech pass.
//
// Dana/Sam gender-neutrality and the Rowan/Petra feminine treatment follow
// the exact strategy documented in de-rooms-act3.ts's own header: bare-noun
// dative/genitive constructions, predicate adjectives, passive voice, and
// repeated names wherever possible for Dana and Sam; ordinary German
// feminine pronouns/possessives for Rowan and Petra, both explicitly
// gendered female in the English source.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'de', {
  // ---------- The Colleague ----------
  [reflectionKey('the-colleague', 'the-balcony', 'consequence')]:
    'Eine Nacht auf einer Konferenz verändert, was die gemeinsame Abkürzung künftig trägt, ganz gleich, wie sie im Nachhinein eingeordnet wird.',
  [reflectionKey('the-colleague', 'the-balcony', 'duty')]:
    'Das war eine Tür, geöffnet ohne Dana im Zimmer, um dem zuzustimmen, was es die Beziehung kostet.',
  [reflectionKey('the-colleague', 'the-balcony', 'virtue')]:
    'Bemerke, wie schnell die Rechtfertigungen zur Stelle waren — Verlangen, als Unvermeidlichkeit verkleidet.',
  [reflectionKey('the-colleague', 'the-balcony', 'care')]:
    'Dana, zweihundert Kilometer entfernt schlafend, hatte kein Mitspracherecht bei einer Entscheidung, die neu formt, wozu Dana nach Hause kommt.',
  [reflectionKey('the-colleague', 'walk-away', 'consequence')]:
    'Wegzugehen kostet die Wärme des Abends und vermeidet einen Preis, der sich sonst über Monate aufgeschaukelt hätte.',
  [reflectionKey('the-colleague', 'walk-away', 'duty')]: 'Das hielt eine Abmachung ein, die Dana nicht im Zimmer war, um sie durchzusetzen.',
  [reflectionKey('the-colleague', 'walk-away', 'virtue')]: 'Das ist Integrität, geübt genau dann, wenn buchstäblich niemand es je erfahren hätte.',
  [reflectionKey('the-colleague', 'walk-away', 'care')]:
    'Du hast Danas Vertrauen geschützt, ohne dass Dana je erfahren musste, dass es etwas zu schützen gab.',
  [reflectionKey('the-colleague', 'name-it-in-the-corridor', 'consequence')]:
    'Es zu benennen kostet der Freundschaft ihre alte, leichte Abkürzung, im Tausch gegen eine, die keine offene Leitung mehr verwalten muss.',
  [reflectionKey('the-colleague', 'name-it-in-the-corridor', 'duty')]:
    'Das war Rowan genauso geschuldet wie Dana — sie verdiente eine benannte Grenze, keinen stillen Rückzug.',
  [reflectionKey('the-colleague', 'name-it-in-the-corridor', 'virtue')]:
    'Das brauchte mehr Mut, als entweder die Tür zu nehmen oder ihr still auszuweichen — den wahren Satz laut auszusprechen.',
  [reflectionKey('the-colleague', 'name-it-in-the-corridor', 'care')]: 'Du hast Rowan dieselbe Klarheit und denselben Respekt gegeben, die du für dich selbst beansprucht hast.',
  [reflectionKey('the-colleague', 'postpone', 'consequence')]:
    'Aufschieben vermeidet den Preis von heute Abend, während es eine Entscheidung aufschaukelt, die faktisch schon gefallen war.',
  [reflectionKey('the-colleague', 'postpone', 'duty')]:
    'Das lässt eine Verpflichtung gegenüber Dana unbearbeitet, statt sie entweder einzuhalten oder sauber zu brechen.',
  [reflectionKey('the-colleague', 'postpone', 'virtue')]: 'Bemerke die Selbsttäuschung, die nötig ist, um das „nichts passiert“ zu nennen.',
  [reflectionKey('the-colleague', 'postpone', 'care')]: 'Dana steht ein Partner zu, der sich tatsächlich entschieden hat, nicht einer, der eine Tür für später angelehnt lässt.',

  // ---------- The Metamour ----------
  [reflectionKey('the-metamour', 'enforce-via-dana', 'consequence')]:
    'Die Grenze über Dana zu leiten ist strukturell richtig und im Ausgang ungewiss — das Zimmer tut nicht so, als wäre Delegieren dasselbe wie Kontrolle.',
  [reflectionKey('the-metamour', 'enforce-via-dana', 'duty')]:
    'Das respektiert, dass die Beziehung zu Petra Danas ist, zu führen, nicht deine, direkt zu überwachen.',
  [reflectionKey('the-metamour', 'enforce-via-dana', 'virtue')]: 'Bemerke, ob das Geduld ist, oder ein Weg, dir selbst ein schwereres Gespräch zu ersparen.',
  [reflectionKey('the-metamour', 'enforce-via-dana', 'care')]: 'Petra erlebt die Grenze so oder so aus zweiter Hand, was prägt, wie sie bei ihr ankommt.',
  [reflectionKey('the-metamour', 'talk-to-petra', 'consequence')]:
    'Direkte Metamour-Kommunikation löst die Naht dort, wo sie tatsächlich liegt, auf Kosten eines wirklich unangenehmen Gesprächs.',
  [reflectionKey('the-metamour', 'talk-to-petra', 'duty')]: 'Das behandelt Petra als jemanden, dem direkte Kommunikation zusteht, nicht als Problem, das man umschifft.',
  [reflectionKey('the-metamour', 'talk-to-petra', 'virtue')]: 'Das brauchte echten sozialen Mut — ein Gespräch beginnen, für das es kein feststehendes Skript gibt.',
  [reflectionKey('the-metamour', 'talk-to-petra', 'care')]: 'Das stellt die tatsächliche Beziehung zwischen den beiden Betroffenen in den Mittelpunkt, statt sie über Dana zu triangulieren.',
  [reflectionKey('the-metamour', 'name-the-hierarchy', 'consequence')]:
    'Die Hierarchie ausdrücklich zu benennen tauscht die Bequemlichkeit, so zu tun, als gäbe es sie nicht, gegen eine Struktur, mit der wirklich jeder navigieren kann.',
  [reflectionKey('the-metamour', 'name-the-hierarchy', 'duty')]:
    'Euch allen dreien stand eine ehrliche Darstellung der tatsächlichen Form der Beziehung zu, nicht ihrer idealisierten.',
  [reflectionKey('the-metamour', 'name-the-hierarchy', 'virtue')]:
    'Das erforderte, eine unbequeme Wahrheit über die eigene Konstellation einzugestehen, statt ihre offizielle Geschichte zu verteidigen.',
  [reflectionKey('the-metamour', 'name-the-hierarchy', 'care')]: 'Das gibt Petra klare Bedingungen, mit denen sie tatsächlich arbeiten kann, statt einer unausgesprochenen Hierarchie, die sie erraten muss.',
  [reflectionKey('the-metamour', 'audit-the-jealousy', 'consequence')]:
    'Das Gefühl zuerst zu prüfen kostet Zeit vor dem Handeln und liefert eine genauere Landkarte dessen, was tatsächlich repariert werden muss.',
  [reflectionKey('the-metamour', 'audit-the-jealousy', 'duty')]: 'Das schuldet der Wahrheit ihre volle Komplexität, statt nach der einfachsten verfügbaren Bösewichtin zu greifen.',
  [reflectionKey('the-metamour', 'audit-the-jealousy', 'virtue')]: 'Das ist die schwerere, weniger befriedigende Disziplin — Ambiguität aushalten, statt sie vorschnell aufzulösen.',
  [reflectionKey('the-metamour', 'audit-the-jealousy', 'care')]: 'Das schützt sowohl Dana als auch Petra vor einer Reaktion, die noch nicht von der eigentlichen Grenzverletzung getrennt wurde.',

  // ---------- The Veto ----------
  [reflectionKey('the-veto', 'comply', 'consequence')]:
    'Das Veto zu ehren bewahrt die vorherige Abmachung auf direkte Kosten einer Beziehung zu jemandem, der keine eigene Regel gebrochen hat.',
  [reflectionKey('the-veto', 'comply', 'duty')]: 'Eine im ersten Jahr vereinbarte Regel bindet dich noch jetzt, was auch immer es kostet, sie einzuhalten.',
  [reflectionKey('the-veto', 'comply', 'virtue')]: 'Das ist Loyalität zu einer Verpflichtung, geprüft in ihrem teuersten Moment.',
  [reflectionKey('the-veto', 'comply', 'care')]: 'Sam trägt die gesamten Kosten einer Regel, an deren Formulierung Sam nie mitwirken durfte.',
  [reflectionKey('the-veto', 'fight-the-rule', 'consequence')]:
    'Die Regel infrage zu stellen riskiert die Stabilität der Beziehung, um zu prüfen, ob die Regel selbst je fair war.',
  [reflectionKey('the-veto', 'fight-the-rule', 'duty')]: 'Dir stand ein Mitspracherecht zu, ob eine Regel, die deine Beziehung zu Sam beenden konnte, noch die richtige Regel war.',
  [reflectionKey('the-veto', 'fight-the-rule', 'virtue')]: 'Das ist die schwerere Integrität — einen echten Konflikt zu riskieren, um eine Struktur zu prüfen, statt sich ihr einfach zu unterwerfen.',
  [reflectionKey('the-veto', 'fight-the-rule', 'care')]: 'Das zwingt Dana, Angst mit Auseinandersetzung zu beantworten, statt einen leichten, einseitigen Ausweg in die Hand gedrückt zu bekommen.',
  [reflectionKey('the-veto', 'examine-the-veto', 'consequence')]:
    'Den Ursprung der Regel zu verstehen löst die Entscheidung von heute Abend nicht, macht aber ehrlicher, was auch immer du als Nächstes wählst.',
  [reflectionKey('the-veto', 'examine-the-veto', 'duty')]: 'Das behandelt die Regel als etwas, dem echte Prüfung zusteht, statt entweder blindem Gehorsam oder blinder Auflehnung.',
  [reflectionKey('the-veto', 'examine-the-veto', 'virtue')]: 'Das ist intellektuelle Ehrlichkeit, angewendet auf die Geschichte der eigenen Beziehung, nicht nur auf abstrakte Argumente.',
  [reflectionKey('the-veto', 'examine-the-veto', 'care')]: 'Das verlangsamt eine Entscheidung, die drei Menschen betrifft, zugunsten davon, sie erst wirklich zu verstehen.',
  [reflectionKey('the-veto', 'counter-veto', 'consequence')]:
    'Das Veto zu erwidern eskaliert den Konflikt, ohne zu klären, ob die ursprüngliche Anwendung fair war.',
  [reflectionKey('the-veto', 'counter-veto', 'duty')]: 'Gleiches mit Gleichem zu vergelten ist nicht dasselbe wie die eigentliche Uneinigkeit über die Regel anzusprechen.',
  [reflectionKey('the-veto', 'counter-veto', 'virtue')]: 'Bemerke das Muster, falls es eines für dich ist — einer Grenze mit einer ebenso großen entgegengesetzten zu begegnen, statt beide zu prüfen.',
  [reflectionKey('the-veto', 'counter-veto', 'care')]: 'Petra wird zum Kollateralschaden in einem Streit, in dem es nie wirklich um sie ging.',

  // ---------- The Drift ----------
  [reflectionKey('the-drift', 'start-the-work', 'consequence')]:
    'Die Arbeit zu beginnen riskiert echten Einsatz für eine ungewisse Rendite — und genau das unterscheidet sie vom Abdriften.',
  [reflectionKey('the-drift', 'start-the-work', 'duty')]: 'Das ehrt eine vor Jahren eingegangene Verpflichtung, indem es sie tatsächlich pflegt, statt anzunehmen, dass sie sich von selbst pflegt.',
  [reflectionKey('the-drift', 'start-the-work', 'virtue')]: 'Das ist die schwerere, unglamouröse Disziplin — Einsatz der Bequemlichkeit einer eingerichteten Taubheit vorzuziehen.',
  [reflectionKey('the-drift', 'start-the-work', 'care')]: 'Das bietet Dana einen Partner, der die Beziehung aktiv wieder wählt, statt sie nur zu bewohnen.',
  [reflectionKey('the-drift', 'raise-it', 'consequence')]:
    'Die Frage zu stellen riskiert echte Erschütterung, im Tausch gegen Information, die die Beziehung ohnehin brauchte, unabhängig von der Antwort.',
  [reflectionKey('the-drift', 'raise-it', 'duty')]: 'Euch beiden stand eine ehrliche Bilanz zu, kein bequemes Schweigen.',
  [reflectionKey('the-drift', 'raise-it', 'virtue')]: 'Das erforderte, eine Angst laut zu benennen, statt sie unbegrenzt zu verwalten.',
  [reflectionKey('the-drift', 'raise-it', 'care')]: 'Das gibt Dana die Chance, ehrlich zu antworten, statt weiter zu erraten, was ihr beide tatsächlich fühlt.',
  [reflectionKey('the-drift', 'accept-quiet-as-love', 'consequence')]:
    'Die Stille zu akzeptieren kostet heute Abend nichts und hängt ganz davon ab, ob sie tatsächlich gewählt wurde, statt sich damit abgefunden zu haben.',
  [reflectionKey('the-drift', 'accept-quiet-as-love', 'duty')]: 'Das ehrt, was die Beziehung tatsächlich geworden ist, statt sie an einer früheren, lauteren Version zu messen.',
  [reflectionKey('the-drift', 'accept-quiet-as-love', 'virtue')]: 'Das braucht echte Selbstehrlichkeit — Akzeptanz von Resignation zu unterscheiden, die von außen identisch aussehen.',
  [reflectionKey('the-drift', 'accept-quiet-as-love', 'care')]: 'Das bietet Dana einen Partner, der schätzt, was tatsächlich da ist, ausgesprochen statt vorausgesetzt.',
  [reflectionKey('the-drift', 'notice-youve-left', 'consequence')]:
    'Zu benennen, dass du schon gegangen bist, ändert heute Abend nichts, macht aber jede künftige Entscheidung ehrlicher.',
  [reflectionKey('the-drift', 'notice-youve-left', 'duty')]: 'Dana steht irgendwann die Wahrheit darüber zu, wo du tatsächlich stehst, auch wenn dieses Zimmer sie heute Abend nicht erzwingt.',
  [reflectionKey('the-drift', 'notice-youve-left', 'virtue')]: 'Das ist unbequeme Selbsterkenntnis, erreicht, ohne vor ihr zurückzuschrecken.',
  [reflectionKey('the-drift', 'notice-youve-left', 'care')]: 'Das ist eine private Erkenntnis, die trotzdem jemanden betrifft, dem noch nichts gesagt wurde.',

  // ---------- The Second Account ----------
  [reflectionKey('the-second-account', 'delete-it', 'consequence')]:
    'Ihn zu löschen beseitigt einen andauernden, verborgenen Preis für die Beziehung, zum Preis eines echten, wenn auch kleinen Entzugs.',
  [reflectionKey('the-second-account', 'delete-it', 'duty')]: 'Dana stand ein Partner zu, der Aufmerksamkeit nicht still in einen Account aufteilt, von dem Dana nichts weiß.',
  [reflectionKey('the-second-account', 'delete-it', 'virtue')]: 'Das ist entschlossene Selbstkorrektur, gewählt, bevor man erwischt wird, nicht danach.',
  [reflectionKey('the-second-account', 'delete-it', 'care')]: 'Das lenkt die Aufmerksamkeit, die der Account erntete, zurück zu der Person, der sie still vorenthalten wurde.',
  [reflectionKey('the-second-account', 'keep-and-name-it', 'consequence')]:
    'Ihn zu behalten und seine Funktion zu benennen bewahrt das Verhalten, während es wenigstens die Selbsttäuschung darüber beseitigt.',
  [reflectionKey('the-second-account', 'keep-and-name-it', 'duty')]: 'Das ist eine teilweise Ehrlichkeit — ehrlich zu dir selbst, immer noch nicht ehrlich zu Dana, was das Zimmer dich nicht vergessen lässt.',
  [reflectionKey('the-second-account', 'keep-and-name-it', 'virtue')]: 'Das ist eine kleinere, begrenztere Form von Selbsterkenntnis, als die anderen Türen des Zimmers anbieten.',
  [reflectionKey('the-second-account', 'keep-and-name-it', 'care')]: 'Danas Seite dieser Gleichung bleibt unbearbeitet durch eine Entscheidung, die nur dein eigenes Gewissen löst.',
  [reflectionKey('the-second-account', 'show-dana', 'consequence')]:
    'Volle Offenlegung gibt Dana die wahre Information, auf der die Beziehung aufbaut, zu echten, unmittelbaren emotionalen Kosten.',
  [reflectionKey('the-second-account', 'show-dana', 'duty')]: 'Das stand Dana direkt von dir zu, statt es zu entdecken oder es nie zu erfahren.',
  [reflectionKey('the-second-account', 'show-dana', 'virtue')]: 'Das ist Ehrlichkeit in ihrer verletzlichsten, unbequemsten Form, trotzdem gewählt.',
  [reflectionKey('the-second-account', 'show-dana', 'care')]: 'Das behandelt Dana als jemanden, der der Wahrheit gewachsen ist, statt jemanden, den man vor ihr schützen muss.',
  [reflectionKey('the-second-account', 'defend-the-category', 'consequence')]:
    'Die Kategorie zu verteidigen bewahrt das Verhalten, indem seine Definition neu verhandelt wird, statt seine Wirkung zu prüfen.',
  [reflectionKey('the-second-account', 'defend-the-category', 'duty')]: 'Das ersetzt die ehrliche Rechenschaft, die Dana tatsächlich zusteht, durch ein semantisches Argument.',
  [reflectionKey('the-second-account', 'defend-the-category', 'virtue')]: 'Bemerke, wie schnell eine clevere Definition echte Selbstprüfung ersetzen kann.',
  [reflectionKey('the-second-account', 'defend-the-category', 'care')]: 'Das lässt Dana nicht besser informiert zurück als vor dem Beginn des Zimmers, unabhängig davon, wie das Argument endet.',

  // ---------- The Discovery ----------
  [reflectionKey('the-discovery', 'confront-now', 'consequence')]:
    'Sofort zu konfrontieren, bevor sich einer von euch beruhigt hat, erzeugt Worte, die alles überdauern, was sich am Ende als wahr herausstellt.',
  [reflectionKey('the-discovery', 'confront-now', 'duty')]: 'Euch beiden stand ein Gespräch zu, geführt mit genug Fassung, um einander tatsächlich zu hören.',
  [reflectionKey('the-discovery', 'confront-now', 'virtue')]: 'Bemerke, wie wenig von dem, was in dieser Küche gesagt wurde, sich tatsächlich auf geprüfte Tatsachen stützte.',
  [reflectionKey('the-discovery', 'confront-now', 'care')]: 'Was auch immer sich als wahr herausstellt, die überfluteten Worte landen so oder so bei Dana, und bleiben dort liegen.',
  [reflectionKey('the-discovery', 'gather-first', 'consequence')]:
    'Erst zu verifizieren liefert verlässlichere Information, zum Preis von Tagen, die du damit verbringst, jemanden zu überwachen, den du liebst.',
  [reflectionKey('the-discovery', 'gather-first', 'duty')]: 'Das sammelt Beweise, bevor beschuldigt wird, was gegenüber Dana fairer ist, unabhängig davon, was sich zeigt.',
  [reflectionKey('the-discovery', 'gather-first', 'virtue')]: 'Frag dich, was die Entscheidung, jemanden heimlich zu untersuchen, über dich verrät, unabhängig davon, was sie über diese Person findet.',
  [reflectionKey('the-discovery', 'gather-first', 'care')]: 'Dana wird, ohne es zu wissen, studiert, Tage bevor überhaupt eine direkte Frage gestellt wird.',
  [reflectionKey('the-discovery', 'pretend', 'consequence')]:
    'Sich für Nichtwissen zu entscheiden vermeidet eine harte Konfrontation, während es die tatsächliche Lage, was auch immer sie ist, unbearbeitet lässt.',
  [reflectionKey('the-discovery', 'pretend', 'duty')]: 'Das verschiebt eine Wahrheit, die Dana dir vielleicht schuldet und die du dir selbst schuldest, auf unbestimmte Zeit.',
  [reflectionKey('the-discovery', 'pretend', 'virtue')]: 'Das ist eine echte, wenn auch teure Form von Selbstschutz — einen Streit abzulehnen, für den du noch nicht bereit bist.',
  [reflectionKey('the-discovery', 'pretend', 'care')]: 'Das lässt den tatsächlichen Zustand der Beziehung ungeprüft, im Guten wie im Schlechten, für euch beide.',
  [reflectionKey('the-discovery', 'walk-tonight', 'consequence')]:
    'Zu gehen löst die unmittelbare Krise, ohne je die eigentliche Frage darunter zu klären.',
  [reflectionKey('the-discovery', 'walk-tonight', 'duty')]: 'Das nimmt Dana die Chance, zu antworten, bevor das Urteil gefällt wird, was auch immer das Handy tatsächlich bedeutete.',
  [reflectionKey('the-discovery', 'walk-tonight', 'virtue')]: 'Das ist ein echter, teurer Akt der Selbsterhaltung, was auch immer er sonst noch ist.',
  [reflectionKey('the-discovery', 'walk-tonight', 'care')]: 'Das verwehrt euch beiden das Gespräch, das hätte verändern können, was dieser Abend tatsächlich bedeutete.',
  [reflectionKey('the-discovery', 'steady-then-ask', 'consequence')]:
    'Die Verzögerung kostet dich zwanzig Minuten Nichtwissen und erkauft ein Gespräch, das keiner von euch später zurücknehmen muss.',
  [reflectionKey('the-discovery', 'steady-then-ask', 'duty')]:
    'Dana stand eine direkte Frage zu, kein überflutet gefälltes Urteil und keine heimlich aufgebaute Anklage — das ist die schlichtere Pflicht, eingehalten.',
  [reflectionKey('the-discovery', 'steady-then-ask', 'virtue')]:
    'Sich vor einem schweren Gespräch zu beruhigen ist eine Disziplin, kein Ausweichen — es kostet echten Aufwand, das unter Druck zu tun.',
  [reflectionKey('the-discovery', 'steady-then-ask', 'care')]: 'Was auch immer die Wahrheit ist, Dana wird einmal gefragt, klar, von jemandem, der die Antwort tatsächlich hören kann.',

  // ---------- The Wedding Eve ----------
  [reflectionKey('the-wedding-eve', 'sit-with-it-til-morning', 'consequence')]:
    'Den Zweifel auszuhalten kostet eine schlaflose Nacht und liefert einen klareren Blick darauf, worum es dabei tatsächlich ging.',
  [reflectionKey('the-wedding-eve', 'sit-with-it-til-morning', 'duty')]: 'Das schuldet dem Zweifel eine ehrliche Anhörung, statt ihn entweder zu unterdrücken oder ihm reflexhaft zu gehorchen.',
  [reflectionKey('the-wedding-eve', 'sit-with-it-til-morning', 'virtue')]:
    'Das ist Geduld unter echtem Druck — weder Panik noch Verdrängung, um zwei Uhr morgens, die Nacht vor einer Hochzeit.',
  [reflectionKey('the-wedding-eve', 'sit-with-it-til-morning', 'care')]:
    'Das lässt dich als jemand zum Ort der Trauung kommen, der den Zweifel geprüft hat — das steht Dana eher zu als jemand, der ihn vergraben hat.',
  [reflectionKey('the-wedding-eve', 'call-someone-honest', 'consequence')]:
    'Jemand Ehrlichen anzurufen kostet den Schlaf eines Freundes oder einer Freundin, gegen eine klärende Außenperspektive in einem wirklich folgenreichen Moment.',
  [reflectionKey('the-wedding-eve', 'call-someone-honest', 'duty')]: 'Das nimmt das Gewicht der morgigen Verpflichtung ernst genug, um echten Rat zu suchen, statt ganz allein zu entscheiden.',
  [reflectionKey('the-wedding-eve', 'call-someone-honest', 'virtue')]: 'Das erforderte, Zweifel laut vor einem anderen Menschen einzugestehen, was seinen eigenen Mut braucht.',
  [reflectionKey('the-wedding-eve', 'call-someone-honest', 'care')]: 'Das behandelt die Entscheidung als eine, die Dana genug betrifft, um es wert zu sein, sie richtig zu treffen, sogar zu ungünstiger Stunde.',
  [reflectionKey('the-wedding-eve', 'answer-the-flame', 'consequence')]:
    'Das Gespräch wieder zu öffnen riskiert, einen Vergleich zurückzuholen, den die Hochzeit nie überstehen sollte.',
  [reflectionKey('the-wedding-eve', 'answer-the-flame', 'duty')]: 'Das war Dana als Teil des heutigen Abends nicht geschuldet, und Dana weiß nicht, dass es geschah.',
  [reflectionKey('the-wedding-eve', 'answer-the-flame', 'virtue')]: 'Bemerke, was es bedeutet, dass dieser Anruf sich die Nacht vor der Verpflichtung an jemand anderen nötig anfühlte.',
  [reflectionKey('the-wedding-eve', 'answer-the-flame', 'care')]: 'Dana geht in den morgigen Tag, ohne zu wissen, dass dieses Gespräch heute Nacht stattgefunden hat.',
  [reflectionKey('the-wedding-eve', 'postpone', 'consequence')]:
    'Aufschieben kostet enormen, öffentlichen, unmittelbaren Schmerz, im Tausch dagegen, nicht unter einem ungeklärten Zweifel zu heiraten.',
  [reflectionKey('the-wedding-eve', 'postpone', 'duty')]: 'Das ist ehrlich zu Dana im spätestmöglichen, teuersten Moment, statt gar nicht ehrlich zu sein.',
  [reflectionKey('the-wedding-eve', 'postpone', 'virtue')]: 'Das ist der einzige mutigste Satz, der in diesem Zimmer zu haben ist, und er kostet genau das, was Mut gewöhnlich kostet.',
  [reflectionKey('the-wedding-eve', 'postpone', 'care')]: 'Das gibt Dana die Wahrheit, bevor ein Versprechen abgelegt wird, statt danach, was auch immer es euch beide heute Nacht sonst noch kostet.',

  // ---------- The Therapist ----------
  [reflectionKey('the-therapist', 'criticism', 'consequence')]:
    'Dieses Muster zu erkennen macht vergangene Fälle davon nicht ungeschehen, verändert aber die Kosten des nächsten.',
  [reflectionKey('the-therapist', 'criticism', 'duty')]: 'Dana stehen Beschwerden über konkretes Verhalten zu, keine Urteile über den Charakter.',
  [reflectionKey('the-therapist', 'criticism', 'virtue')]: 'Das erforderte, ein unschmeichelhaftes eigenes Muster zu betrachten, ohne es sofort zu entschuldigen.',
  [reflectionKey('the-therapist', 'criticism', 'care')]: 'Das ist der Reiter, der die Person auf der Empfängerseite am unmittelbarsten zermürbt, Sitzung für Sitzung.',
  [reflectionKey('the-therapist', 'contempt', 'consequence')]:
    'Dieses Muster zu benennen kostet ein hartes Eingeständnis und öffnet die einzige Tür, die nachweislich tatsächlich Reparatur vorhersagt.',
  [reflectionKey('the-therapist', 'contempt', 'duty')]: 'Verachtung verweigert einen grundlegenden Respekt, der Dana unabhängig vom Inhalt des Streits zusteht.',
  [reflectionKey('the-therapist', 'contempt', 'virtue')]: 'Das ist die schwerste der vier Türen, ehrlich zu durchschreiten, was schon für sich genommen bemerkenswert ist.',
  [reflectionKey('the-therapist', 'contempt', 'care')]: 'Das ist der Reiter, den die Forschung als am zersetzendsten für die empfangende Person benennt — den, der Dana am meisten kostet.',
  [reflectionKey('the-therapist', 'defensiveness', 'consequence')]:
    'Teilweise Verantwortung zu übernehmen kostet Stolz und erzeugt eine unverhältnismäßig große Deeskalation.',
  [reflectionKey('the-therapist', 'defensiveness', 'duty')]: 'Dana steht Anerkennung deines Anteils zu, keine Erwiderung auf ihren.',
  [reflectionKey('the-therapist', 'defensiveness', 'virtue')]: 'Das erforderte, einen Reflex abzulegen — den Drang, zu kontern statt anzunehmen.',
  [reflectionKey('the-therapist', 'defensiveness', 'care')]: 'Das ist das Muster, das am unmittelbarsten verhindert, dass Dana sich je wirklich gehört fühlt.',
  [reflectionKey('the-therapist', 'stonewalling', 'consequence')]:
    'Das Abschottungsmuster zu erkennen stoppt es nicht, macht aber die angekündigte Pause als Ersatz verfügbar.',
  [reflectionKey('the-therapist', 'stonewalling', 'duty')]: 'Dana steht eine ausgesprochene Pause zu, kein stiller, unerklärter Rückzug.',
  [reflectionKey('the-therapist', 'stonewalling', 'virtue')]: 'Das erforderte, einen Abwehrmechanismus zu benennen, der gewöhnlich unterhalb bewusster Wahrnehmung arbeitet.',
  [reflectionKey('the-therapist', 'stonewalling', 'care')]: 'Das Zurückkommen zählt für Dana genauso viel wie das Gehen — das Zimmer besteht auf beiden Hälften der Fertigkeit.',
  [reflectionKey('the-therapist', 'accept-the-repair', 'consequence')]:
    'Den Reparaturversuch anzunehmen deeskaliert den unmittelbaren Konflikt zu praktisch keinen Kosten.',
  [reflectionKey('the-therapist', 'accept-the-repair', 'duty')]: 'Dana hat etwas Kleines und Unvollkommenes riskiert, um sich dir zuzuwenden — es anzunehmen würdigt dieses Risiko.',
  [reflectionKey('the-therapist', 'accept-the-repair', 'virtue')]: 'Das ist die schwerere Disziplin, sich erreichen zu lassen, sogar mitten im Streit.',
  [reflectionKey('the-therapist', 'accept-the-repair', 'care')]: 'Das gibt Danas Bemühung einen Ort zum Landen, statt sie am Prinzip scheitern zu lassen.',
  [reflectionKey('the-therapist', 'miss-the-repair', 'consequence')]:
    'Den Versuch zu verpassen hält den Schwung des Konflikts aufrecht, auf Kosten einer verfügbaren Deeskalation.',
  [reflectionKey('the-therapist', 'miss-the-repair', 'duty')]: 'Das ist Dana nicht speziell geschuldet, lehnt aber etwas ab, das Dana in gutem Glauben angeboten hat.',
  [reflectionKey('the-therapist', 'miss-the-repair', 'virtue')]: 'Bemerke, was es dich genauso wie Dana kostet, im Schwung des Streits zu bleiben.',
  [reflectionKey('the-therapist', 'miss-the-repair', 'care')]: 'Danas kleiner, nervöser Versuch bleibt unbemerkt, was seine eigenen, stillen Kosten hat.',

  // ---------- The Usual Room (gate) ----------
  [reflectionKey('the-usual-room', 'defiant-different', 'consequence')]:
    'Das andere Zimmer zu nehmen verändert den heutigen Ausgang, ohne notwendigerweise das zugrunde liegende Muster zu verändern, das das Kontobuch verfolgte.',
  [reflectionKey('the-usual-room', 'defiant-different', 'duty')]: 'Das behauptet ein Recht, zu wählen, das real ist, was auch immer das Kontobuch über das Wählen vorhergesagt hat.',
  [reflectionKey('the-usual-room', 'defiant-different', 'virtue')]: 'Das ist die schwerere Frage, bei der man verweilen sollte — ob Trotz hier Freiheit ist, oder nur das Muster in Verkleidung.',
  [reflectionKey('the-usual-room', 'defiant-different', 'care')]: 'Das ändert nicht, was sonst irgendjemand in deinem Leben von diesem Muster erfährt, nur das heutige Zimmer.',
  [reflectionKey('the-usual-room', 'refuse-all-rooms', 'consequence')]:
    'Auszusteigen vermeidet das konkrete Zimmer, ohne die umfassendere Vorhersage des Kontobuchs über dein Verhalten zu vermeiden.',
  [reflectionKey('the-usual-room', 'refuse-all-rooms', 'duty')]: 'Das lehnt jede Teilnahme ab, was selbst eine legitime Antwort ist, wie unvollständig auch immer.',
  [reflectionKey('the-usual-room', 'refuse-all-rooms', 'virtue')]: 'Bemerke, dass selbst die Verweigerung, auf ihre Weise, erwartet war — es lohnt sich, dabei zu verweilen, statt es schnell aufzulösen.',
  [reflectionKey('the-usual-room', 'refuse-all-rooms', 'care')]: 'Das beschäftigt sich nicht mit der eigentlichen Frage, ob das Muster revidierbar ist, sondern verschiebt sie nur.',
  [reflectionKey('the-usual-room', 'take-it-knowingly', 'consequence')]:
    'Das vorhergesagte Zimmer wissentlich zu wählen ändert den heutigen Ausgang nicht, verändert aber, was das Wählen bedeutet.',
  [reflectionKey('the-usual-room', 'take-it-knowingly', 'duty')]: 'Das macht die Entscheidung wirklich zu deiner eigenen, statt einer Vorhersage entweder zu gehorchen oder sich bloß gegen sie aufzulehnen.',
  [reflectionKey('the-usual-room', 'take-it-knowingly', 'virtue')]:
    'Das ist die schwerere, leisere Integration — zu akzeptieren, dass ein Muster real ist, während man trotzdem die Urheberschaft für die heutige Instanz davon beansprucht.',
  [reflectionKey('the-usual-room', 'take-it-knowingly', 'care')]: 'Das ist die Version des heutigen Abends, die kein Publikum braucht, keinen Trotz, aufgeführt für niemanden außer dich selbst.',
  [reflectionKey('the-usual-room', 'room-with-no-number', 'consequence')]:
    'Das nummernlose Zimmer zu wählen umgeht den zentralen Test der Nacht, statt ihn in die eine oder andere Richtung zu lösen.',
  [reflectionKey('the-usual-room', 'room-with-no-number', 'duty')]: 'Das ist eine echte dritte Option, auch wenn das Kontobuch auch das vorhergesehen hat.',
  [reflectionKey('the-usual-room', 'room-with-no-number', 'virtue')]: 'Das ist eine Art ehrliches Ausweichen — es lehnt ab, eine Gewissheit vorzuspielen, die du nicht wirklich fühlst.',
  [reflectionKey('the-usual-room', 'room-with-no-number', 'care')]: 'Das löst nichts für sonst irgendjemanden, kostet aber auch niemanden etwas.',
});
