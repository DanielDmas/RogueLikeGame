// German translation of LIMERENCE's Act IV room prose (beats, choice
// text/hint/outcome, field notes, plain-language explanations). Registered
// under version 'v2'. Follows the structural pattern established by
// de-rooms.ts (prologue/Act I), de-rooms-act2.ts (Act II), and
// de-rooms-act3.ts (Act III) — see CLAUDE.md's "Translating content" rule:
// every line here was translated against the room's actual beats and each
// choice's stakes, not word-for-word.
//
// Sie/du decision: informal "du" throughout, continuing every prior act's
// choice. Act IV is the hotel's last floor — a kitchen table the morning
// after, a writing desk, a checkout counter — and the narration is still
// the same device used since the prologue: second-person interior address
// of the player-as-character, not a narrator addressing a guest from a
// respectful remove. Nothing about reaching the top floor changes that.
//
// "The Porter" remains "Portier", per the established project convention —
// distinct from ANAMNESIS's own German guide-character word (see
// src/content/text/de.ts's usherBarkKey entries for the exact term being
// avoided). That word is never reused here, including in this comment;
// verified absent (grep count zero) from both this file and
// de-reflections-act4.ts.
//
// Partner gender-neutrality: unlike Dana in Act III, Act IV's own
// recurring partner is never even named — the English source calls them
// only "you two", "each other", "the one it was always about", "them".
// This file keeps that anonymity rather than inventing a name or a
// gender: mostly "each other"/"einander" constructions carry the load
// without needing a third-person pronoun at all, and the handful of spots
// that do need one route through "die Person" (grammatically feminine as
// a noun, which lets "sie" agree with the *word* rather than assert
// anything about the character) or through a repeated "die andere
// Person" rather than der/sein. This is the same spirit as
// de-rooms-act2.ts's and de-rooms-act3.ts's Dana/Sam strategy, adapted to
// a partner the English text keeps fully unnamed.
//
// The Porter himself is the one exception, and it is not a judgment call:
// the English source explicitly genders him ("the wedding band on his
// right hand", "he says, not looking up"; understory.ts's "hat under his
// arm" is the same established fact elsewhere in this pack), so this file
// uses "er"/"sein" for the Porter wherever English uses "he"/"his" — there
// is no neutrality question to adjudicate here.
//
// Sara, referenced in the-morning-desk's memory-loss interview beat via
// its callback to Act I's the-rumor ("you learned what she did"), keeps
// the ordinary feminine pronoun already established for her throughout
// de-rooms.ts (Act I) — she is explicitly gendered in the English source,
// unlike Dana/Sam/Act IV's own partner.
//
// Field-note thinkers lines: proper-name citations (with years) are
// carried through unchanged (Amato, Perel (2017)). Descriptive or
// name-plus-lineage lines are translated around the kept name, e.g.
// "expressive-writing research (Pennebaker lineage)" becomes "Forschung
// zum expressiven Schreiben (Pennebaker-Tradition)" and "narrative-identity
// research (McAdams lineage)" becomes "Forschung zur narrativen Identität
// (McAdams-Tradition)", matching the pattern de-rooms-act3.ts already used
// for "Glass (2003) (digital walls)".
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
import { choseIn, hasFlag } from '../../../engine/gameState';
import { mirrorUnlocked } from '../endingLogic';

/** Mirrors act4.ts's own flag lists, verbatim, so the translated branch of
 * every function-type beat/outcome always matches the English branch it
 * stands in for. */
const YOURS_FLAGS = ['confessed-whole', 'crossed-at-the-conference', 'carried-alone', 'trickle-truth', 'stayed-the-third'];
const THEIRS_FLAGS = ['played-detective', 'chose-not-to-know', 'steadied-first'];
const ACT1_ROOM_IDS = [
  'the-read-receipt',
  'the-screenshot',
  'the-password',
  'the-party',
  'the-forward',
  'the-best-friends-girl',
  'the-summer-ends',
];

// ---------- The Kitchen Table ----------
registerAll('v2', 'de', {
  // beat1 (stage 0) is a function beat — registered below via register().
  [roomBeatKey('the-kitchen-table', 0, 0)]:
    'Die Küche um 06:40 Uhr. Eine Zeichnung am Kühlschrank, von einem Kind, gehalten von einem Magneten in Erdbeerform — tragend, irgendwie, auf eine Weise, wie sonst nichts in diesem Zimmer es ist.',
  [roomBeatKey('the-kitchen-table', 0, 2)]:
    'Zwei Stühle, ein Tisch. Das Handy liegt jetzt mit dem Display nach oben zwischen euch, bedeutungslos — was auch immer es einmal bedeutet hat, es ist damit fertig, es zu bedeuten.',
  [roomBeatKey('the-kitchen-table', 0, 3)]:
    'Der erste Satz von allem, was noch kommt, ist noch ungesagt, und keiner von euch beiden ist sich heute Morgen sicher, wer an der Reihe ist, ihn zu sagen.',
  [roomBeatKey('the-kitchen-table', 0, 4)]:
    'Vier Zukünfte, am Tisch platziert wie Gäste, die ungebeten gekommen sind. Die Kinder schlafen oben — ihr Gewicht im Haus, übersetzt in Akustik: Jedes Wort hier registriert automatisch, welche Lautstärke es sich leisten kann.',
  [roomBeatKey('the-kitchen-table', 0, 5)]:
    'Portier (nur kurz, im Flurspiegel): „Morgen im obersten Stockwerk sind der einzige Teil dieses Hotels, den ich nicht betreten kann. Die Rezeption bestätigt lediglich: Der Tisch ist tragend. Baut auf ihm, oder räumt ihn — er trägt beides.“',
  [roomChoiceTextKey('the-kitchen-table', 'stay-for-them')]: 'Bleib, für die Kinder. Sprich es laut aus, einander gegenüber.',
  [roomChoiceHintKey('the-kitchen-table', 'stay-for-them')]: 'Ein Pakt, unverblümt benannt',
  // outcome0 is a function beat — registered below via register().
  [roomChoiceOutcomeKey('the-kitchen-table', 'stay-for-them', 1)]:
    'Die Weggabelung liegt in der Entscheidung selbst, nicht außerhalb von ihr. Was daraus wird, entscheidet sich später, in Zimmern, die dieser Morgen nicht zu sehen bekommt.',
  [roomChoiceTextKey('the-kitchen-table', 'separate-well')]: 'Trenn dich, und wende alles daran, es gut zu machen.',
  [roomChoiceHintKey('the-kitchen-table', 'separate-well')]: 'Trauer, bei Tageslicht vollzogen',
  [roomChoiceOutcomeKey('the-kitchen-table', 'separate-well', 0)]:
    'Die undramatische Katastrophe: Logistik als Elegie. Ein ganzer Takt besteht einfach aus dem Kalender der Übergaben, und ausgerechnet der ist der schwerste Teil.',
  [roomChoiceOutcomeKey('the-kitchen-table', 'separate-well', 1)]:
    'Was die Kinder tragen, ist laut Forschung eindeutig an den Konflikt gekoppelt — nicht an die Kategorie. Trauer, hier vollzogen, bei Tageslicht, mit Absicht.',
  [roomChoiceTextKey('the-kitchen-table', 'attempt-repair')]: 'Die Arbeit. Nicht das Wort. Die Arbeit.',
  [roomChoiceHintKey('the-kitchen-table', 'attempt-repair')]: 'Anfangen, ohne Garantie',
  [roomChoiceOutcomeKey('the-kitchen-table', 'attempt-repair', 0)]:
    'Keine Montage, keine Garantie — das Zimmer zeigt nur Woche eins: ein Aufnahmeformular, die erste ehrliche Bestandsaufnahme, die Affäre (wessen auch immer sie war) untersucht als Alarm, nicht nur als Vergehen.',
  [roomChoiceOutcomeKey('the-kitchen-table', 'attempt-repair', 1)]:
    'Der letzte Takt ist der zweite Termin, eingehalten. Das ist der ganze Sieg, den dieser Morgen zu bieten hat, und das Zimmer tut nicht so, als wäre es mehr.',
  [roomChoiceTextKey('the-kitchen-table', 'say-the-unsayable')]:
    'Sag das eine, das ihr beide schon gehalten habt, seit lange bevor all das begann.',
  [roomChoiceHintKey('the-kitchen-table', 'say-the-unsayable')]: 'Die riskanteste Tür an diesem Tisch',
  // outcome0 is a function beat — registered below via register().
  [roomChoiceOutcomeKey('the-kitchen-table', 'say-the-unsayable', 1)]:
    'Nach diesem Satz verändert jede andere Entscheidung an diesem Tisch ihre Bedeutung. Das Zimmer endet hier, ohne irgendetwas aufzulösen — weil der Satz das Ereignis war.',
  [roomChoiceTextKey('the-kitchen-table', 'place-the-unsent-letter')]: 'Leg den unversandten Brief auf den Tisch, noch versiegelt.',
  [roomChoiceHintKey('the-kitchen-table', 'place-the-unsent-letter')]: 'Ein Nachtrag zur Offenlegung, ganz gleich, wessen Morgen es ist',
  [roomChoiceOutcomeKey('the-kitchen-table', 'place-the-unsent-letter', 0)]:
    'Du legst ihn zwischen die beiden Tassen, noch versiegelt, inzwischen Jahre alt. Was auch immer darin steht — er gehört eher auf diesen Tisch als in die Schublade, in der er bisher gelebt hat.',
  [roomChoiceOutcomeKey('the-kitchen-table', 'place-the-unsent-letter', 1)]:
    'Keiner von euch öffnet ihn schon. Dass er überhaupt da ist, endlich sichtbar, ist selbst schon ein Nachtrag zu allem anderen, was an diesem Morgen gesagt wurde.',
  [roomExplanationKey('the-kitchen-table', 0)]:
    'Was die Forschung zu Kindern und Trennung tatsächlich zeigt, ist konkret und kontraintuitiv: Die eigentlich wirksame Zutat für das Wohlergehen von Kindern ist die Konfliktbelastung, nicht die Familienform — ein gut geführter Trennungshaushalt schneidet verlässlich besser ab als ein intaktes Zuhause mit hohem Konfliktniveau. Esther Perels Umdeutung von Affären als Alarm statt nur als Vergehen ist nützlich und hat echte Grenzen, hier unverblümt benannt: Alarm erklärt, warum etwas geschehen ist; er entschuldigt es nicht, und die Person, die ihn ausgelöst hat, schuldet trotzdem Rechenschaft. „Für die Kinder bleiben“ ist eine echte, vertretbare Entscheidung — vorausgesetzt, es kommt ein tatsächlicher Pflegeplan dazu, nicht nur eine einmal an einem Küchentisch getroffene und danach nie wieder aufgegriffene Entscheidung.',
  [roomNoteTitleKey('the-kitchen-table')]: 'Der tragende Tisch',
  [roomNoteThinkersKey('the-kitchen-table')]: 'Amato · Perel (2017)',
  [roomNoteBodyKey('the-kitchen-table')]:
    'Paul Amatos jahrzehntelange Forschung zu Kindern und Scheidung läuft auf einen Befund hinaus, der alle anderen überragt: **Nicht die Familienform, sondern die Konfliktbelastung ist die eigentlich wirksame Zutat** — Kinder in gut geführten Trennungshaushalten geht es durchgehend besser als Kindern in intakten, aber konfliktreichen Haushalten, und die verbreitete Annahme, Zusammenbleiben sei automatisch die sicherere Wahl, hält den Daten nicht stand. Perels Rahmung von Affären als Alarm statt Ausstieg hat berechtigte Kritik dafür geerntet, wie leicht sie sich missbrauchen lässt, um Schaden zu entschuldigen; sorgfältig angewendet, wie beabsichtigt, erklärt sie nur — ein Alarm sagt dir, dass im Haus etwas Aufmerksamkeit braucht, er entschuldigt nie, was beim Auslösen zerbrochen ist. Die tatsächlichen Prädiktoren für gelingende Reparatur sind in der Literatur durchgehend Struktur, ein Zeuge oder eine Zeugin, und Zeit — kein einzelnes Gespräch, so gut es auch war. Die Zeichnung am Kühlschrank übersteht jede Version dieses Morgens. Entscheide, in welchem Morgen sie erwachsen wird.',
});
register(roomBeatKey('the-kitchen-table', 0, 1), 'v2', 'de', (s: RunState) => {
  const yours = YOURS_FLAGS.some((f) => hasFlag(s, f));
  const theirs = THEIRS_FLAGS.some((f) => hasFlag(s, f));
  if (yours && theirs)
    return 'Die Nacht hinter dir war lang, und sie gehörte euch beiden — dem, was du getan hast, und dem, was dir angetan und dann entdeckt wurde. Keine der beiden Versionen hebt die andere an diesem Morgen auf.';
  if (yours) return 'Die Nacht hinter dir war lang, und es war an dir, Rechenschaft abzulegen — die Sache, die du getan hast, jetzt vollständig, endlich bekannt.';
  if (theirs)
    return 'Die Nacht hinter dir war lang, und es war an der anderen Person, Rechenschaft abzulegen — die Sache, die dir angetan wurde, jetzt vollständig, endlich bekannt.';
  return 'Die Nacht hinter dir war lang, und alles, was sich sagen ließ, ist inzwischen wenigstens einmal gesagt worden.';
});
register(roomChoiceOutcomeKey('the-kitchen-table', 'stay-for-them', 0), 'v2', 'de', (s: RunState) =>
  hasFlag(s, 'already-gone')
    ? 'Der Pakt, ehrlich dargestellt: Er kann edles Gerüst sein, oder ein zwanzigjähriger Aufschub — und das Zimmer tut nicht so, als hätte es nicht gesehen, wie du schon auf jede Weise gegangen bist, außer durch die Tür.'
    : 'Der Pakt, ehrlich dargestellt: benannt und immer wieder aufgegriffen, kann er halten. Benannt und dann ad acta gelegt, wird er zur stillen Katastrophe eines viel späteren Morgens.',
);
register(roomChoiceOutcomeKey('the-kitchen-table', 'say-the-unsayable', 0), 'v2', 'de', (s: RunState) =>
  hasFlag(s, 'already-gone')
    ? '„Ich wusste es, und ich habe mich entschieden, es nicht zu wissen“ — zuerst gesagt, weil es zuerst wahr war. Die riskanteste Tür des Zimmers, geöffnet von der Person, die im Stillen schon gegangen war.'
    : '„Ich war einsam, Jahre bevor irgendjemand irgendjemanden berührt hat“ — endlich laut gesagt, an diesem Tisch, zu der Person, um die es immer ging.',
);

// ---------- The Unsent ----------
registerAll('v2', 'de', {
  // to-your-16-year-old-self's outcome0 is a function beat — registered
  // below via register().
  [roomBeatKey('the-unsent', 0, 0)]:
    'Ein Schreibtisch am Ende des Flurs. Ein Briefumschlag. Der Portier dahinter, mit etwas in der Hand, das wie eine Messingbriefwaage aussieht.',
  [roomBeatKey('the-unsent', 0, 1)]:
    'Eine Nachricht verlässt heute Nacht das Haus. Sie wird nicht als E-Mail oder Anruf ankommen — sie wird als Traum ankommen, als plötzlicher Impuls, als ein Lied, das im Autoradio genau im richtigen Moment läuft.',
  [roomBeatKey('the-unsent', 0, 2)]:
    'Portier: „Die Rezeption garantiert die Zustellung. Sie garantiert sonst nichts — keine Antwort, keine Vergebung, nicht, dass es so verstanden wird, wie du es gemeint hast. Ein Umschlag. Wähl die Adresse.“',
  [roomChoiceTextKey('the-unsent', 'to-the-one-you-hurt')]: 'An die Person, die du verletzt hast.',
  [roomChoiceHintKey('the-unsent', 'to-the-one-you-hurt')]: 'Wiedergutmachung, ohne um Absolution zu bitten',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-you-hurt', 0)]:
    'Du schreibst ihn zweimal. Der erste Entwurf bittet, leise, um Vergebung. Die Waage weist ihn zurück — nicht grausam, nur präzise —, bis die Bitte gestrichen ist.',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-you-hurt', 1)]:
    'Der zweite Entwurf ist Wiedergutmachung ohne angehängte Bitte. Schwerer zu schreiben. Irgendwie leichter, ihn abzuschicken.',
  [roomChoiceTextKey('the-unsent', 'to-the-one-who-hurt-you')]: 'An die Person, die dich verletzt hat.',
  [roomChoiceHintKey('the-unsent', 'to-the-one-who-hurt-you')]: 'Keine Vergebung — Loslassen',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-who-hurt-you', 0)]:
    'Kein Brief der Vergebung — das Zimmer achtet genau auf diesen Unterschied, und am Ende tust du es auch.',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-who-hurt-you', 1)]:
    'Ein Brief, der den Satz „du schuldest mir noch etwas“ beendet, indem er die Rechnung zerreißt. Nicht um der anderen Person willen. Um der Hand willen, die sie die ganze Zeit gehalten hat.',
  [roomChoiceTextKey('the-unsent', 'to-the-one-that-got-away')]: 'An die Person, die du hast ziehen lassen.',
  [roomChoiceHintKey('the-unsent', 'to-the-one-that-got-away')]: 'Der Brief, den ehrliche Menschen sich zu schreiben fürchten',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-that-got-away', 0)]:
    'Der Brief, vor dem sich ehrliche Menschen fürchten — hauptsächlich wegen dessen, was es bedeuten könnte, ihn überhaupt zu schreiben.',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-that-got-away', 1)]:
    'Das Zimmer erlaubt genau einen Satz Wärme über den Abschluss hinaus — nicht mehr —, wiegt ihn, befindet ihn für ehrlich, und schickt ihn ab.',
  [roomChoiceTextKey('the-unsent', 'to-your-16-year-old-self')]: 'An dein 16-jähriges Ich.',
  [roomChoiceHintKey('the-unsent', 'to-your-16-year-old-self')]: 'Die freundlichste Tür des Zimmers',
  [roomChoiceTextKey('the-unsent', 'to-your-own-kids-someday')]: 'An deine eigenen Kinder, irgendwann.',
  [roomChoiceHintKey('the-unsent', 'to-your-own-kids-someday')]: 'Die Aufklärung, gefaltet in eine Geschichte',
  [roomChoiceOutcomeKey('the-unsent', 'to-your-own-kids-someday', 0)]:
    'Versiegelt. Datiert. „Zu öffnen, wenn du alt genug bist, um in solchen Zimmern zu stehen.“',
  [roomChoiceOutcomeKey('the-unsent', 'to-your-own-kids-someday', 1)]:
    'Der ganze Sinn dieser Nacht, gefaltet in einen Umschlag, klein genug für eine Schublade, wartend auf ein Jahr, das du dir noch nicht vorstellen kannst.',
  [roomChoiceTextKey('the-unsent', 'blank-page')]: 'Schick die leere Seite ab.',
  [roomChoiceHintKey('the-unsent', 'blank-page')]: 'Auch Ungesagtes hat noch ein Gewicht',
  [roomChoiceOutcomeKey('the-unsent', 'blank-page', 0)]: 'Der schwerste Umschlag am ganzen Schreibtisch. Gar nichts steht darauf geschrieben.',
  [roomChoiceOutcomeKey('the-unsent', 'blank-page', 1)]:
    'Er kommt an als ein kurzes Innehalten in einer Tür — jemand bleibt ohne Grund stehen und fühlt sich für vier unerklärliche Sekunden begleitet. Das ist die ganze Zustellung.',
  [roomExplanationKey('the-unsent', 0)]:
    'Die Forschung zum expressiven Schreiben, in der Tradition, die James Pennebaker begründet hat, findet einen durchgehenden Nutzen darin, über schwierige Erfahrungen zu schreiben — selbst wenn das Geschriebene nie von jemand anderem gelesen wird; die gemessene Wirkung trifft die schreibende Person, nicht die Empfängerin oder den Empfänger. Dieses Zimmer nimmt diesen Befund beim Wort: Der Brief zählt für das, was das Schreiben mit dir macht, und „Abschluss“ wird hier ehrlich als etwas behandelt, das durch den Akt des Schreibens selbst hergestellt wird, nicht als etwas, das am Ende darauf wartet, gefunden zu werden.',
  [roomNoteTitleKey('the-unsent')]: 'Der Brief, der trotzdem ankommt',
  [roomNoteThinkersKey('the-unsent')]: 'Forschung zum expressiven Schreiben (Pennebaker-Tradition)',
  [roomNoteBodyKey('the-unsent')]:
    'Pennebakers jahrzehntelange Studien zum expressiven Schreiben fanden etwas, das der Volksglaube rund um „Abschluss“ meist genau verkehrt herum sieht: Einen unversandten Brief an jemanden zu schreiben, kommt messbar dem Wohlbefinden der schreibenden Person zugute — unabhängig davon, ob der Brief je gelesen wird, und oft unabhängig davon, ob die empfangende Person überhaupt noch lebt, um ihn zu lesen. **Abschluss wird dieser Forschung zufolge durch das Schreiben selbst hergestellt — nicht entdeckt, indem man endlich eine Antwort bekommt.** Die konkrete Adresse zählt weniger als der Akt, etwas Wahres und Vollständiges zu schreiben und es dann enden zu lassen. Diese Feldnotiz schreibt sich von selbst — der Kodex-Eintrag ist, welche Nachricht du auch immer tatsächlich abgeschickt hast.',
});
register(roomChoiceOutcomeKey('the-unsent', 'to-your-16-year-old-self', 0), 'v2', 'de', (s: RunState) => {
  const first = s.transcript.find((t) => ACT1_ROOM_IDS.includes(t.roomId));
  return first
    ? `Den Briefschlitz hinunter, und vier Stockwerke tiefer, ins Erdgeschoss. Er kommt an und zitiert eine Sache, die du damals wirklich gesagt hast — „${first.choiceText}“ —, vorgelesen mit einer Zärtlichkeit, die man mit sechzehn nie zu hören bekam.`
    : 'Den Briefschlitz hinunter, und vier Stockwerke tiefer, ins Erdgeschoss. Er kommt an als genau der Satz, den jeder erwachsene Mensch in diesem Hotel mit sechzehn gebraucht hätte, geschrieben von der einzigen Person, die dafür qualifiziert ist.';
});

// ---------- The Morning Desk ----------
registerAll('v2', 'de', {
  // stage0 beats 2/3/4, its some-rooms-i-wasnt-present-in outcome0, and
  // stage1 beat4 are function beats — registered below via register().
  [roomBeatKey('the-morning-desk', 0, 0)]:
    'Wieder die Lobby, Morgendämmerung hinter den Türen. Der Portier hat deine Akte auf dem Tresen aufgeschlagen. Sie ist dicker, als du sie in Erinnerung hast, geschrieben zu haben.',
  [roomBeatKey('the-morning-desk', 0, 1)]:
    'Portier: „Guten Morgen. Bevor ich dich hinauslassen kann, oder hierbehalten, führe ich ein kurzes Gespräch. Kein Test. Ein Audit. Du hast diesen Aufenthalt damit verbracht, Zimmern zu antworten. Jetzt frage ich nach den Antworten.“',
  [roomBeatKey('the-morning-desk', 0, 5)]: 'Portier: „Lass dir Zeit mit der letzten Frage. Alles, was du auf diesen Stockwerken gewählt hast — stehst du dazu?“',
  [roomChoiceTextKey('the-morning-desk', 'stand-by-all')]: '„Ja. Alles davon. Ich habe gewählt, was ich gewählt habe, und ich würde wieder unterschreiben.“',
  [roomChoiceHintKey('the-morning-desk', 'stand-by-all')]: 'Beständigkeit, offen vertreten',
  [roomChoiceOutcomeKey('the-morning-desk', 'stand-by-all', 0)]:
    'Portier: „Standhaftigkeit. Seltener, als sie sich selbst verkauft — die meisten Gäste verleugnen mindestens ein Zimmer, sobald sie tatsächlich gefragt werden. Du hast das ganze Kontobuch behalten, samt der Einträge, die dich etwas gekostet haben.“',
  [roomChoiceOutcomeKey('the-morning-desk', 'stand-by-all', 1)]:
    'Portier: „Ich merke an, ohne Grausamkeit, dass ein vollständig unterschriebenes Kontobuch Integrität sein kann, oder Rüstung. Von dieser Seite des Tresens aus sind beide identisch. Du wirst später herausfinden, welches von beiden es war, zu einer nicht vorgesehenen Stunde. Das tun Gäste immer.“',
  [roomChoiceTextKey('the-morning-desk', 'name-what-changed-me')]: '„Nein — nicht alles davon. Ich kann dir genau sagen, was mich verändert hat, und wo.“',
  [roomChoiceHintKey('the-morning-desk', 'name-what-changed-me')]: 'Wachstum, benannt und anerkannt',
  [roomChoiceOutcomeKey('the-morning-desk', 'name-what-changed-me', 0)]:
    'Du nennst das Zimmer. Ein bestimmtes. Keine Stimmung — ein Grund: etwas, das ein späteres Stockwerk dem früheren beigebracht hat.',
  [roomChoiceOutcomeKey('the-morning-desk', 'name-what-changed-me', 1)]:
    'Die Hand des Portiers hält auf dem Kontobuch inne — und zum ersten Mal in dieser ganzen Nacht bemerkst du den Ehering an seiner rechten Hand, und die blasse, ungebräunte Linie, wo einst ein Ring saß, an seiner linken. „Das ist die Antwort, für die ich da bin“, sagt er, ohne aufzublicken. „Revision mit Beleg. Seltener, und besser, als Beständigkeit.“',
  [roomChoiceTextKey('the-morning-desk', 'some-rooms-i-wasnt-present-in')]:
    '„Bei manchem davon erinnere ich mich kaum, dass ich es gewählt habe. Ich war nicht die ganze Zeit wirklich anwesend.“',
  [roomChoiceHintKey('the-morning-desk', 'some-rooms-i-wasnt-present-in')]: 'Die ehrliche Lücke',
  [roomChoiceOutcomeKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 1)]:
    'Portier: „Nun gut. Das Gespräch ist beendet. Was bleibt, ist keine Frage mehr. Es ist eine Schwelle.“',
  [roomExplanationKey('the-morning-desk', 0)]:
    'Bevor sich die Schwelle öffnet, prüft der Portier den gesamten Aufenthalt und fragt, ob du noch dazu stehst — nicht, um dich zu benoten, sondern um zu sehen, ob du ehrlich zu deiner eigenen Geschichte bist. Die eigentliche Frage darunter: Ist es bewundernswerter, zu jeder je getroffenen Entscheidung vollkommen konsequent zu bleiben, oder unverblümt zu sagen: „Ich habe mich geirrt, und das genau ist es, was meine Meinung geändert hat“? Die Forschung zur narrativen Identität behandelt ein Ich als eine Geschichte in fortlaufender, ehrlicher Überarbeitung — es war nie das Ziel, unverändert an der Rezeption anzukommen.',
  [roomBeatKey('the-morning-desk', 1, 0)]:
    'Das Gitter — oder was auch immer es war, ein Tresen, ein Spiegel, ein Mensch — kommt zur Ruhe, und die Lobbytüren schwingen auf, in ein Licht, das nicht das des Hotels ist.',
  [roomBeatKey('the-morning-desk', 1, 1)]:
    'Draußen ist Morgen. Ein echter: irgendwo Verkehr, irgendwo ein Wasserkocher, irgendwo das gewöhnliche, gewaltige Geschäft eines fremden Lebens, drei Schritte entfernt.',
  [roomBeatKey('the-morning-desk', 1, 2)]:
    'Portier: „Endstation. Oder Ausgangspunkt — kommt darauf an, aus welcher Richtung man liest. Die Schwelle bringt dich zurück, zum Lärm, zu den Gesichtern, zu den unfertigen Streitgesprächen, zu allem. Die meisten Gäste nehmen sie. Es ist eine gute Tür. Ich halte sie in Schuss.“',
  [roomBeatKey('the-morning-desk', 1, 3)]:
    'Portier: „Aber sie ist nicht die einzige, die dir offensteht, und ich bin verpflichtet, das zu sagen. Du kannst bleiben — die Zimmer brauchen immer jemanden, der sie hütet, und ich mache das schon sehr lange. Oder du kannst dich hier an der Schwelle hinlegen und den letzten Rest dieser Nacht sanft ausklingen lassen. Manche Gäste wählen am Ende die Stille. Es steht mir nicht zu, das eine Niederlage zu nennen.“',
  [roomChoiceTextKey('the-morning-desk', 'walk-out')]: 'Geh hinaus. Zurück in den Morgen, den Lärm, die Welt.',
  [roomChoiceHintKey('the-morning-desk', 'walk-out')]: 'Die Rückkehr',
  [roomChoiceOutcomeKey('the-morning-desk', 'walk-out', 0)]:
    'Du trittst dem Licht entgegen. Die Schwelle hat genau die Temperatur einer Türöffnung im Sommer — jener halbe Grad Unterschied, der „draußen“ bedeutet.',
  [roomChoiceOutcomeKey('the-morning-desk', 'walk-out', 1)]:
    'Portier (ruft dir nach): „Was auch immer du dort draußen vorfindest — es ist dasselbe Gespräch, das du verlassen hast. Das war nie das Versprechen. Du warst die Renovierung. Pass auf die Stufe auf.“',
  [roomChoiceTextKey('the-morning-desk', 'take-the-desk')]: 'Bleib. Übernimm die Rezeption. Der Job des Portiers ist jetzt deiner.',
  [roomChoiceHintKey('the-morning-desk', 'take-the-desk')]: 'Der Pakt des Hütens',
  [roomChoiceOutcomeKey('the-morning-desk', 'take-the-desk', 0)]:
    'Du wendest dich vom Morgen ab — wirklich ab, was die Lobby mit so etwas wie angehaltenem Atem registriert —, und streckst die Hand nach dem Kontobuch aus.',
  [roomChoiceOutcomeKey('the-morning-desk', 'take-the-desk', 1)]:
    'Portier (gibt es noch nicht her): „Sei dir sicher. Die Stunden sind endlos, die Bezahlung ist nichts, und die Gäste sind — nun, du warst selbst einer. Du wirst jeden Einzelnen von ihnen dabei zusehen, wie er dem Handy gegenübersteht, dem Flur, dem Tisch, und du darfst ihnen vielleicht nie die Antworten sagen, hauptsächlich, weil es keine gibt.“',
  [roomChoiceOutcomeKey('the-morning-desk', 'take-the-desk', 2)]:
    'Portier (übergibt es jetzt — das Kontobuch warm, dein Name plötzlich darin lesbar): „... Willkommen an der Rezeption. Erste Lektion: der Ring und der blasse Streifen sind gleich groß. Das ist Absicht. Hier ist alles Absicht.“',
  [roomChoiceTextKey('the-morning-desk', 'stop-carrying-it')]: 'Leg dich an der Schwelle nieder. Lass es sanft enden, zu deinen eigenen Bedingungen.',
  [roomChoiceHintKey('the-morning-desk', 'stop-carrying-it')]: 'Die Stille',
  [roomChoiceOutcomeKey('the-morning-desk', 'stop-carrying-it', 0)]:
    'Du legst dich hin, mit dem Morgen nur drei Schritte entfernt, und es ist keine Niederlage — der Portier merkt es, die Lobby merkt es. Es ist eine Entscheidung, mit offenen Augen getroffen, von jemandem, der jedes Stockwerk durchwandert hat, um sich das Recht darauf zu verdienen.',
  [roomChoiceOutcomeKey('the-morning-desk', 'stop-carrying-it', 1)]:
    'Portier (setzt sich neben dich, legt das Kontobuch beiseite): „Dann bleibe ich, bis es vollbracht ist. Kein Gast löst sich in meiner Schicht allein auf. Es ist übrigens kein Ende. Es ist eine Gezeit.“',
  [roomChoiceTextKey('the-morning-desk', 'laughing-door')]: 'Die kleine Tür. Das Lachen. Öffne sie.',
  [roomChoiceHintKey('the-morning-desk', 'laughing-door')]: 'Du hast dir das Bemerken verdient',
  [roomChoiceOutcomeKey('the-morning-desk', 'laughing-door', 0)]:
    'Du gehst zu der kleinen, schlichten Tür hinüber, und die Klinke dreht sich, bevor du sie richtig gefasst hast, so, wie eine Freundin oder ein Freund von der anderen Seite öffnet.',
  [roomChoiceOutcomeKey('the-morning-desk', 'laughing-door', 1)]:
    'Portier (hinter dir, und zum ersten Mal hat seine Stimme weder den Ring noch dessen Abwesenheit): „Nur sehr wenige Gäste bemerken diese Tür je. Noch weniger öffnen sie. Dann geh schon. Ich mach das Licht.“',
  [roomChoiceTextKey('the-morning-desk', 'i-know-every-room')]: '„Ich kenne jedes Zimmer.“',
  [roomChoiceHintKey('the-morning-desk', 'i-know-every-room')]: 'Keine Tür — ein Satz',
  [roomChoiceOutcomeKey('the-morning-desk', 'i-know-every-room', 0)]:
    'Du trittst auf keine der Türen zu. Stattdessen sagst du es, so, wie man eine Tatsache sagt und nicht einen Wunsch — und das Sagen ist schon fast alles, was geschieht.',
  [roomChoiceOutcomeKey('the-morning-desk', 'i-know-every-room', 1)]: 'Der Portier erstarrt fast, eine Hand auf dem Kontobuch, und schließt es nicht ganz zu.',
  [roomExplanationKey('the-morning-desk', 1)]:
    'Die Schwelle ist offen, und die Entscheidung ist endlich, wie dieser Aufenthalt tatsächlich endet: zurück ins gewöhnliche Leben gehen, bleiben, um dem nächsten Gast zu helfen, oder dich vollständig ausruhen lassen. Keines davon ist das richtige Ende — jedes ist eine andere, gleichermaßen ehrliche Antwort darauf, was du gerade jetzt wirklich willst, nach allem auf diesen Stockwerken.',
  [roomNoteTitleKey('the-morning-desk')]: 'Die vorgelesene Akte',
  [roomNoteThinkersKey('the-morning-desk')]: 'Forschung zur narrativen Identität (McAdams-Tradition) · das eigene Kontobuch des Hotels',
  [roomNoteBodyKey('the-morning-desk')]:
    'Forscherinnen und Forscher zur narrativen Identität — allen voran Dan McAdams — behandeln ein Ich nicht als feste Größe, sondern als eine Geschichte in fortlaufender, aktiver Autorschaft: Wer du bist, ist wesentlich der Bericht, den du davon gibst, wie du hierhergekommen bist, und dieser Bericht wird ständig überarbeitet, während du weiterlebst. Beziehungen sind, in dieser Sicht, gemeinsam verfasste Erzählungen, und die Fertigkeit, die dieses ganze Hotel die ganze Zeit gelehrt hat, ist genau dieses Prüfen: die vollständige Akte als die eigene anzunehmen, einschließlich der Seiten, die man lieber verloren oder umgeschrieben hätte. **Jedes Stockwerk, das dieser Aufenthalt inszeniert hat — die Lesebestätigung, der Flur, der Küchentisch — war ein und dieselbe Frage in verschiedenen Zimmern: Wenn dir deine Akte vorgelesen wird, ist die Unterschrift darunter deine eigene?**',
});
register(roomBeatKey('the-morning-desk', 0, 2), 'v2', 'de', (s: RunState) => {
  const screenshot = ['tell-nadia', 'confront-tom', 'stay-out', 'verify-first'].find((id) => choseIn(s, 'the-screenshot', id));
  if (screenshot === 'tell-nadia')
    return 'Portier: „Der Screenshot. Du hast es Nadia unverblümt gesagt und die Folgen dort landen lassen, wo sie gelandet sind — ehrlich gesagt, auch auf dir. Stehst du dazu, hier, wo Tom und Nadia beide längst nicht mehr in diesem Haus sind?“';
  if (screenshot === 'confront-tom')
    return 'Portier: „Der Screenshot. Du hast Tom zuerst die Wahl gelassen, mit einer Frist. Hast du die Frist am Ende eingehalten — und spielt es jetzt noch eine Rolle, ob du es getan hast?“';
  if (screenshot === 'stay-out')
    return 'Portier: „Der Screenshot. Du hast gesagt, es sei nicht deine Sache, und ihn gelöscht. Das Geheimnis ist, wenn ich mich recht erinnere, stattdessen bei dir eingezogen. Wohnt es immer noch dort?“';
  if (screenshot === 'verify-first')
    return 'Portier: „Der Screenshot. Du hast zuerst überprüft und dabei die Chance verloren, als Erster oder Erste mit der Wahrheit dazusein. Ein fairer Tausch, oder nicht — sag du es mir.“';
  return 'Portier: „Diese eine Tür hast du nie geöffnet — die mit dem Screenshot darin. Merkwürdig. Dann frag ich es ganz unverblümt, ohne Inszenierung: der Partner oder die Partnerin einer Freundin oder eines Freundes, ertappt, in deiner Hand, in einem Handy, das dir nicht gehört. Was tust du tatsächlich?“';
});
register(roomBeatKey('the-morning-desk', 0, 3), 'v2', 'de', (s: RunState) =>
  hasFlag(s, 'confessed-whole')
    ? 'Portier: „Das Geständnis — vollständig abgelegt, gegenüber der Person, die es betraf. Diese Art von Ehrlichkeit ist in dieser Akte seltener, als Gäste gern glauben. Stehst du zu dem Preis, den es sie gekostet hat?“'
    : hasFlag(s, 'carried-alone')
      ? 'Portier: „Das Geständnis — ganz allein getragen, den ganzen Weg. Ein Zimmer in dir, neben dem die andere Person leben wird, ohne es je zu betreten. War die Gnade wirklich ihre, oder nur deine?“'
      : hasFlag(s, 'trickle-truth')
        ? 'Portier: „Das Geständnis — tröpfchenweise, ein bisschen wahrer bei jedem Mal, das es infrage gestellt wurde. Die Akte zeigt jede Überarbeitung. Die andere Person wird jede einzelne gespürt haben.“'
        : 'Portier: „In dieser Akte taucht nirgends ein Geständnis auf. Entweder war keins geschuldet, oder eins ist an diesem Morgen immer noch nicht abgelegt.“',
);
register(roomBeatKey('the-morning-desk', 0, 4), 'v2', 'de', (s: RunState) =>
  s.memoryLost
    ? 'Portier: „Die Falle, beim Gerücht. Du hast erfahren, was sie getan hat, und was es aus jemandem macht, der eine Falle für einen geliebten Menschen stellt. In deiner Akte klafft eine Lücke, dort, wo einmal das Nichtwissen gewohnt hat. Ich kann sie von hier aus sehen. Hat es sich gelohnt?“'
    : 'Portier: „Keine Lücke in dieser Akte — du hast das Nichtwissen nie gegen eine Gewissheit eingetauscht. Manche Gäste nennen das Vertrauen. Manche nennen es, nie hart genug geprüft worden zu sein, um es nötig zu haben. Ich fälle kein Urteil.“',
);
register(roomChoiceOutcomeKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 0), 'v2', 'de', (s: RunState) =>
  s.memoryLost
    ? 'Portier: „In deinem Fall ist das kein Ausweichen. Das ist Dokumentation. In dir gibt es eine echte Lücke, fallenförmig, und Antworten, die hineingefallen sind, werden nicht verleugnet — nur unbezeugt. Ich akzeptiere Lücken, die bezahlt wurden. Deine hat einen Beleg.“'
    : 'Portier: „Hm. Deine Akte zeigt keine Fallen, keine Lücken — die Erinnerungen sind alle vorhanden; was fehlt, ist die Bereitschaft, neben ihnen zu stehen. ‚Ich war nicht anwesend‘, aus einer lückenlosen Akte, ist bequemer Nebel. Ich lasse es durchgehen. Ich bin eine Rezeption, kein Richter. Aber wir haben es beide gehört.“',
);
register(roomBeatKey('the-morning-desk', 1, 4), 'v2', 'de', (s: RunState) =>
  mirrorUnlocked(s)
    ? 'Und da ist — du bemerkst es erst jetzt, und verstehst, dass nicht jeder es zu bemerken bekommt — eine vierte Tür. Klein. Schlicht. Dahinter: zwei Tassen, die eingeschenkt werden, und Lachen, das unverkennbar genauso klingt wie dein eigenes.'
    : 'Irgendwo abseits nimmst du halb wahr, eine kleine, schlichte Tür, von der du ziemlich sicher bist, dass sie beim Einchecken noch nicht in der Lobby war. Sie ist verschlossen. Dahinter, leise: Lachen. Der Portier folgt deinem Blick. „Diesmal nicht“, sagt er sanft — sowohl Urteil als auch Einladung, wiederzukommen.',
);
