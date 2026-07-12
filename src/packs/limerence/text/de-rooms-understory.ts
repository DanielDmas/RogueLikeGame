// German translation of LIMERENCE's Understory room prose (beats, choice
// text/hint/outcome, field notes, plain-language explanations). Registered
// under version 'v2'. Follows the structural pattern established by
// de-rooms.ts (prologue/Act I), de-rooms-act2.ts (Act II), de-rooms-act3.ts
// (Act III), and de-rooms-act4.ts (Act IV) — see CLAUDE.md's "Translating
// content" rule: every line here was translated against the room's actual
// beats and each choice's stakes, not word-for-word. The Understory is the
// optional secret-branch epilogue reached via the stairs behind the front
// desk on a returning guest's second run — LIMERENCE's own mirror of
// ANAMNESIS's Act V — and its register is quieter and more archival than Act
// IV's checkout floor: a records office, a corridor of unopened doors, a
// room with a second chair.
//
// Sie/du decision: informal "du" throughout, continuing every prior act's
// (and de-rooms-act4.ts's) choice.
//
// "The Porter" remains "Portier", per the established project convention —
// distinct from ANAMNESIS's own German guide-character word (see
// src/content/text/de.ts's usherBarkKey entries for the exact term being
// avoided). That word is never reused here, including in this comment;
// verified absent (grep count zero) from both this file and
// de-reflections-understory.ts. The Porter is gendered explicitly in the
// English source here too — the-registry's beat4 stage direction ("hat
// under his arm") is the same established fact de-rooms-act4.ts's header
// already cites — so this file uses "er"/"sein" for him, no judgment call
// needed.
//
// Partner/former-self gender-neutrality: unlike Act III's Dana, no
// recurring partner character reappears anywhere in the Understory to raise
// the question de-rooms-act3.ts's header addresses. The-other-side's
// "voice" in the second chair is explicitly not a person but a
// reconstruction of the player's own former self ("Not by a person... but
// by a voice"), and the English source already treats it with the
// genderless "it". German's grammatical-gender agreement with the noun "die
// Stimme" (feminine) does the same job cleanly here without asserting
// anything about a human referent — "sie" throughout refers to the voice as
// a thing, not a person, exactly parallel to how "es" tracks "das Zimmer"
// elsewhere in this pack. Where the English addresses the player's former
// self directly ("who you were"), this file uses the neuter noun
// construction "dein früheres Ich" rather than a gendered third-person
// pronoun — same spirit as de-rooms-act3.ts's "die Person" strategy, applied
// to a self rather than a partner.
//
// Room/ending titles referenced dynamically via ROOM_TITLE_BY_ID /
// ENDING_TITLE_BY_ID (imported directly from ../rooms/understory, per
// cs-rooms-understory.ts's precedent — this project's convention is that
// room/ending titles are never translated anywhere) stay in English even
// inside translated prose. Plain, non-interpolated prose mentions of a
// room's subject are translated normally as part of the sentence — e.g.
// the-other-side's "the Rumor" (a plain descriptive mention of the room's
// subject, not a title-lookup) becomes "das Gerücht", matching the ordinary
// German word already used for that room's content throughout de-rooms.ts.
//
// Field-note thinkers lines: proper-name citations (with years) are carried
// through unchanged (Kierkegaard (1844), Frost (1916)); the descriptive
// gloss around a citation is translated, matching de-rooms-act3.ts's
// "Glass (2003) (digitale Mauern)" precedent. Purely descriptive lines with
// no year (e.g. "perspective-taking research") are translated in full,
// matching de-rooms-act4.ts's "Forschung zum expressiven Schreiben
// (Pennebaker-Tradition)" pattern.
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
import { choseInPrior, pickExhibitEntry, pickShadowMoments, pickUnchosenRooms } from '../../../engine/gameState';
import { ENDING_TITLE_BY_ID, ROOM_TITLE_BY_ID } from '../rooms/understory';

/** Mirrors understory.ts's own LIMERENCE_ACT_POOLS, verbatim — needed here
 * only for the-doors-not-opened's "unchosen rooms" lookup, exactly as
 * cs-rooms-understory.ts already does. */
const LIMERENCE_ACT_POOLS: Record<1 | 2 | 3, string[]> = {
  1: ['the-read-receipt', 'the-screenshot', 'the-password', 'the-party', 'the-forward', 'the-best-friends-girl', 'the-summer-ends'],
  2: ['the-distance', 'the-hall-pass', 'the-rebound', 'the-unicorn', 'just-friends', 'the-ex', 'the-confession', 'the-other-side-of-the-door'],
  3: ['the-colleague', 'the-metamour', 'the-veto', 'the-drift', 'the-second-account', 'the-discovery', 'the-wedding-eve', 'the-therapist', 'the-usual-suite'],
};

// ---------- The Registry ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-registry', 0, 0)]:
    'Eine Treppe hinter dem Tresen, von der du schwören würdest, dass sie beim Einchecken noch nicht da war. Darunter: ein langer, niedriger Raum, Regale mit identischen grauen Akten, die sich weiter erstrecken, als die Decke eigentlich zulassen sollte.',
  [roomBeatKey('the-registry', 0, 1)]:
    'Ein Regal trägt eine einzige neuere Akte: deine. Gestempelt, unter einem Datum, das du als ein Ende wiedererkennst: ABGESCHLOSSEN. ABGELEGT. NICHT VERGESSEN.',
  // beat2 is a function beat — registered below via register().
  [roomBeatKey('the-registry', 0, 3)]:
    'An das Aufnahmeformular geheftet: die Beschreibung, die du einst wortwörtlich von dir selbst gegeben hast: „{blurb}“ Abgelegt ohne Kommentar — entweder Respekt, oder ein Ablagefehler. Von hier unten sehen beide gleich aus.',
  [roomBeatKey('the-registry', 0, 4)]:
    'Portier (in der Tür, den Hut unter dem Arm): „Ich komme hier unten nicht oft vorbei. Nichts hier ist verboten. Die meisten Gäste wollen höchstens einmal herkommen, wenn überhaupt. Der Registratur ist es gleich, so oder so. Sie hat ohnehin nirgends sonst hinzugehen.“',
  [roomChoiceTextKey('the-registry', 'sign-it')]: '„Das war ich. Ich stehe dazu — zu allem.“ Unterschreib die Karte selbst.',
  [roomChoiceHintKey('the-registry', 'sign-it')]: 'Dazu stehen, die schwerste Art von Unterschrift',
  [roomChoiceOutcomeKey('the-registry', 'sign-it', 0)]:
    'Du nimmst den Stift, der am Regal angekettet ist, und unterschreibst unter der maschinengeschriebenen Zeile, mit deiner eigenen Hand, die die Akte, so scheint es, erwartet hat.',
  [roomChoiceOutcomeKey('the-registry', 'sign-it', 1)]:
    'Portier: „Nicht jeder Gast unterschreibt. Du hast deinen Namen zu einer Nacht hinzugefügt, die schon geschehen ist. Ich weiß nicht, was das kostet. Ich weiß, dass es nicht nichts ist.“',
  [roomChoiceTextKey('the-registry', 'disown-it')]: '„Das klingt heute nicht mehr nach mir.“ Lass die Karte unsigniert.',
  [roomChoiceHintKey('the-registry', 'disown-it')]: 'Lass die Distanz echt sein, nicht nur bequem',
  [roomChoiceOutcomeKey('the-registry', 'disown-it', 0)]:
    'Du lässt die Karte genau so, wie du sie vorgefunden hast, und trittst vom Regal zurück, so, wie du von einer fremden Person zurücktreten würdest, die zufällig deinen Mantel trägt.',
  [roomChoiceOutcomeKey('the-registry', 'disown-it', 1)]:
    'Portier: „Die Akte widerspricht nicht. Sie bewahrt nur auf, was geschehen ist — ganz gleich, ob die Hand, die es getan hat, noch auf deinen Namen hört oder nicht.“',
  [roomChoiceTextKey('the-registry', 'refile-unjudged')]: 'Schließ den Deckel sanft, mitten im Satz, ohne Kommentar, so oder so.',
  [roomChoiceHintKey('the-registry', 'refile-unjudged')]: 'Weder verteidigen noch abstreiten — ablegen',
  [roomChoiceOutcomeKey('the-registry', 'refile-unjudged', 0)]:
    'Du schließt die Akte, so, wie du ein Buch mitten im Kapitel schließen würdest, aus Respekt, nicht aus Zustimmung, und stellst sie zurück ins Regal.',
  [roomChoiceOutcomeKey('the-registry', 'refile-unjudged', 1)]:
    'Portier: „Das, glaube ich, ist der eigentliche Zweck dieses Regals. Kein Urteil — ein Ort, an dem man etwas ablegen kann, ohne schon fertig entschieden haben zu müssen, was es war.“',
  [roomChoiceTextKey('the-registry', 'pin-the-keycard')]: 'Steck die alte Schlüsselkarte an den Rand der offenen Akte — ein Nachtrag zum Protokoll.',
  [roomChoiceHintKey('the-registry', 'pin-the-keycard')]: 'Beweis, dass es den Korridor gab — und dass du ihn verlassen hast',
  [roomChoiceOutcomeKey('the-registry', 'pin-the-keycard', 0)]:
    'Du drückst die deaktivierte Schlüsselkarte gegen die Akte, bis sie hält — Beweis zugleich dafür, dass es den Korridor gab, und dass du ihn verlassen hast.',
  [roomChoiceOutcomeKey('the-registry', 'pin-the-keycard', 1)]:
    'Die Registratur nimmt sie an, genau so, wie Registraturen alles annehmen: ohne Kommentar, ohne Einwand, und, wie du bemerkst, ohne das je auch nur ein einziges Mal nötig gehabt zu haben.',
  [roomExplanationKey('the-registry', 0)]:
    'Dir wird ein abgelegter, datierter Bericht über eine Entscheidung aus deinem letzten Aufenthalt hier gezeigt, kalt vorgelesen, ohne jeden Kontext, der sie damals vernünftig erscheinen ließ. Stehst du immer noch dazu, distanzierst du dich davon, oder akzeptierst du, dass es geschehen ist, ohne es endgültig in die eine oder andere Richtung zu beurteilen? Es geht darum, wie wir uns zu unseren eigenen vergangenen Entscheidungen verhalten, wenn Zeit vergangen ist — so, wie wenn man eine alte Nachricht noch einmal liest und sich nicht ganz sicher ist, ob die Person, die sie geschickt hat, und die Person, die sie jetzt liest, wirklich noch dieselbe sind.',
  [roomNoteTitleKey('the-registry')]: 'Vom Aufbewahren von Akten',
  [roomNoteThinkersKey('the-registry')]: 'narrative Identität (Anklang an Ricœur, titelübergreifend)',
  [roomNoteBodyKey('the-registry')]:
    'Paul Ricœur vertrat die These, dass ein Selbst kein Ding ist, das sich durch Introspektion auffinden lässt, sondern eine Erzählung, die fortlaufend überarbeitet wird — ihre Beständigkeit liegt nicht darin, sich nie zu verändern, sondern darin, sich verändern zu können und es trotzdem dieselbe Geschichte zu nennen. Dieser Raum inszeniert genau die Konfrontation, die seine Theorie aushalten sollte: eine bestimmte, datierte, abgelegte Tat, kalt vorgelesen, ohne die umgebenden Kapitel, die sie damals unausweichlich erscheinen ließen. Dazu zu stehen, sich davon zu distanzieren und es unbeurteilt abzulegen sind drei verschiedene Verhältnisse zur eigenen Autorschaft, und Ricœurs eigene Antwort liegt näher am dritten als an einem der ersten beiden. **Du bist nicht verpflichtet, jede Nacht in der Akte gutzuheißen. Nur zuzugeben, wessen Handschrift es ist.**',
});
register(roomBeatKey('the-registry', 0, 2), 'v2', 'de', (s: RunState) => {
  const entry = pickExhibitEntry(s.prior?.transcript ?? []);
  if (!entry) {
    return 'Die Karte in der offenen Akte ist leer, ihre Ecke wasserfleckig — was auch immer diese Akte einst enthielt, hat die Fahrt hier hinunter nicht überstanden. Der Rest des Regals ist wenigstens lesbar.';
  }
  return `Auf der Karte steht, in deiner eigenen Handschrift: „${entry.choiceText}“ Kein weiterer Kommentar. Die Registratur kommentiert nicht. Sie bewahrt nur auf.`;
});

// ---------- The Doors Not Opened ----------
registerAll('v2', 'de', {
  [roomBeatKey('the-doors-not-opened', 0, 0)]:
    'Ein Korridor, auf Temperatur gehalten, gesäumt von Türen, die leicht offen stehen — nicht einladend. Einfach offen, so, wie eine Tür offen bleibt, wenn sich sehr lange niemand die Mühe gemacht hat, sie zu schließen.',
  [roomBeatKey('the-doors-not-opened', 0, 1)]:
    'Das sind die Türen aus deinem letzten Aufenthalt, durch die du nie gegangen bist. Unbetreten, unentschieden, technisch noch verfügbar — auf genau die Weise, wie ein verpasster Zug immer noch, technisch, ein Zug ist.',
  // beats 2 and 3 are function beats — registered below via register().
  [roomBeatKey('the-doors-not-opened', 0, 4)]:
    'Portier: „Ich würde nicht zu viel hineinlesen, welche es ist. Oder doch, ganz und gar — ich habe mich nie entschieden, welcher der beiden Ratschläge schlimmer ist. Und ich sage dir die ehrliche Sache, die dieses Stockwerk nicht immer laut ausspricht: Die Affäre, die du nicht hattest, ist manchmal eine Tür, die dir nie angeboten wurde. Ungeöffnet ist nicht automatisch eine Tugend.“',
  [roomChoiceTextKey('the-doors-not-opened', 'enter-late')]: 'Stoß sie ganz auf. Geh hinein.',
  [roomChoiceHintKey('the-doors-not-opened', 'enter-late')]: 'Neugier, spät gewürdigt',
  // outcome0 is a function beat — registered below via register().
  [roomChoiceOutcomeKey('the-doors-not-opened', 'enter-late', 1)]:
    'Was auch immer hier geschehen sollte, ist bereits geschehen, oder nicht, oder die Frage ist einfach verjährt, so, wie ungeöffnete Post irgendwann aufhört, dringend zu sein. Es ist kleiner, als du es dir aufgebaut hast. Die meisten ungelebten Dinge sind das.',
  [roomChoiceTextKey('the-doors-not-opened', 'close-it')]: 'Schließ sie ganz. Manche Türen bleiben ehrlich gesagt besser Türen.',
  [roomChoiceHintKey('the-doors-not-opened', 'close-it')]: 'Respektiere, dass sie Vergangenheit ist',
  [roomChoiceOutcomeKey('the-doors-not-opened', 'close-it', 0)]:
    'Du drückst sie sanft zu, so, wie du eine Tür zu einem Zimmer schließen würdest, in dem endlich, wirklich jemand schläft.',
  [roomChoiceOutcomeKey('the-doors-not-opened', 'close-it', 1)]:
    'Der richtige Instinkt, vermutlich. Nicht jede ungeöffnete Tür war ein Bedauern, das nur auf seinen Moment wartete.',
  [roomChoiceTextKey('the-doors-not-opened', 'ask-why-now')]: '„Warum hast du dich ausgerechnet jetzt wieder geöffnet?“ Frag die Tür selbst.',
  [roomChoiceHintKey('the-doors-not-opened', 'ask-why-now')]: 'Verhör das Angebot, nicht nur das Zimmer',
  [roomChoiceOutcomeKey('the-doors-not-opened', 'ask-why-now', 0)]:
    'Genau genommen keine Antwort — Türen sind, selbst hier, von Natur aus nicht mitteilsam —, aber die Scharniere sind frisch geölt. Jemand wollte, dass sich diese Tür heute Nacht leicht bewegen lässt, ganz gezielt.',
  [roomChoiceOutcomeKey('the-doors-not-opened', 'ask-why-now', 1)]:
    'Portier: „Meine beste Vermutung: Der Keller bietet dir die Tür an, deren Nichtöffnen du jetzt zu überstehen bereit bist. Sein Timing hat er auch mir noch nie erklärt.“',
  [roomExplanationKey('the-doors-not-opened', 0)]:
    'Dir werden die Türen gezeigt, an denen du bei deinem letzten Aufenthalt vorbeigegangen bist, ohne sie zu öffnen — Wege, die nie gegangen wurden, jetzt für immer unbekannt. Eine knarrt von selbst wieder auf. Das ist der Sog der „nicht gegangenen Straße“: Schaust du jetzt endlich hin, nachdem es dich nichts mehr kostet? Dieses Spiel fügt der volkstümlichen Version eine ehrliche Korrektur hinzu: Die Affäre, die du nicht hattest, ist manchmal eine Tür, die dir nie angeboten wurde, keine Tugend, die du dir verdient hast — ungeöffnet und unversucht sind nicht dieselbe Leistung.',
  [roomNoteTitleKey('the-doors-not-opened')]: 'Die nicht gegangene Straße, überprüft',
  [roomNoteThinkersKey('the-doors-not-opened')]: 'Kierkegaard (1844) – Schwindel des Möglichen · Frost (1916) – missverstanden, richtiggestellt',
  [roomNoteBodyKey('the-doors-not-opened')]:
    'Kierkegaard nannte die Möglichkeit das Schwindelerregendste, was einem Menschen zur Verfügung steht — schwindelerregender als jede tatsächliche Gefahr, denn das Tatsächliche ist endlich, während das Mögliche sich grenzenlos vermehrt, je länger du an einer Weggabelung stehst und dich weigerst, zu wählen. Frosts „The Road Not Taken“ wird auf fast jeder Abschlussfeier falsch zitiert, als Hymne auf mutiges Abweichen, doch das Gedicht selbst ist raffinierter: Die beiden Wege sind, wie die sprechende Person zwei Strophen zuvor selbst zugibt, „eigentlich fast gleich“ ausgetreten — der wehmütige Seufzer am Ende gesteht sich schon im Voraus als eine Geschichte ein, die vom Rückblick umgeformt wurde, nicht als eine Wahrheit, die von der Gabelung selbst berichtet wird. **Neu ausgerichtet auf Beziehungen: Die Person, die du nicht gewählt hast, ist ein Gerücht, keine Quittung.** Die Türen in diesem Korridor waren nie heimlich besser. Sie waren einfach, kurz, möglich — und Möglichkeit bewahrt, sobald sie sich schließt, keine ihrer Quittungen auf, nur ihre Gerüchte.',
});
register(roomBeatKey('the-doors-not-opened', 0, 2), 'v2', 'de', (s: RunState) => {
  const { candidates } = pickUnchosenRooms(s.prior, LIMERENCE_ACT_POOLS);
  if (candidates.length === 0) {
    return 'Der Korridor ist heute Nacht merkwürdig kahl — jede Tür, die du hättest verpassen können, hast du offenbar nicht verpasst. Oder die Aufzeichnung darüber hat die Fahrt hier hinunter einfach nicht überstanden.';
  }
  const titles = candidates.map((id) => ROOM_TITLE_BY_ID[id] ?? id);
  return `Drei fallen dir zuerst ins Auge: ${titles.join(', ')}. Du erinnerst dich nicht, dass sich eine von ihnen je geöffnet hätte. Jetzt bist du dir ziemlich sicher, dass dir wenigstens eine angeboten wurde — und du bist an ihr vorbeigegangen.`;
});
register(roomBeatKey('the-doors-not-opened', 0, 3), 'v2', 'de', (s: RunState) => {
  const { opens } = pickUnchosenRooms(s.prior, LIMERENCE_ACT_POOLS);
  if (!opens) {
    return 'Heute Nacht hebt sich keine einzelne Tür hervor. Der Korridor bleibt vollständig verschlossen, und irgendwie ist das seine eigene Art von Antwort.';
  }
  const title = ROOM_TITLE_BY_ID[opens] ?? opens;
  return `Eine Tür, nahe am Ende, schwingt von selbst ganz auf — ${title}. Was auch immer dahinter gewartet hat, wartet, wie es scheint, immer noch.`;
});
register(roomChoiceOutcomeKey('the-doors-not-opened', 'enter-late', 0), 'v2', 'de', (s: RunState) => {
  const { opens } = pickUnchosenRooms(s.prior, LIMERENCE_ACT_POOLS);
  const title = opens ? (ROOM_TITLE_BY_ID[opens] ?? opens) : 'das Zimmer';
  return `Du trittst hindurch, in ${title} hinein — oder was davon übrig ist. Keine Krise mitten im Satz, niemand, der wartet. Nur ein Zimmer, möbliert, ein wenig verstaubt, das nichts Besonderes tut.`;
});

// ---------- The Other Side ----------
const ECHO_EMPTY_FALLBACK_DE =
  'Der andere Stuhl sagt nichts. Diesmal gibt es nichts Aufgezeichnetes, aus dem sich eine Stimme zusammensetzen ließe — und das Zimmer tut, zu seiner Ehre, nicht so, als wäre es anders.';

registerAll('v2', 'de', {
  [roomBeatKey('the-other-side', 0, 0)]:
    'Ein kahles Zimmer. Zwei Stühle, einander gegenüber, nah genug, dass klar ist: Wer auch immer auf einem von beiden sitzt, soll gehört werden.',
  [roomBeatKey('the-other-side', 0, 1)]:
    'Der andere Stuhl ist besetzt. Nicht von einer Person — das Zimmer ist darin genau, so genau, wie es nur ein Ort sein kann, der nichts davon hat, zu lügen —, sondern von einer Stimme, zusammengesetzt aus dem, was du bei deinem letzten Aufenthalt hier gesagt und gewählt hast.',
  // beats 2, 3 and 4 are function beats — registered below via register().
  [roomBeatKey('the-other-side', 0, 5)]: 'Portier: „Bei diesem hier sitze ich nicht dabei. Was auch immer ihr zwei hier drinnen tut, es war nie an mir, das zu schiedsrichtern.“',
  [roomChoiceTextKey('the-other-side', 'answer-yourself')]: '„Ich höre dich.“ Sprich zu deinem früheren Ich.',
  [roomChoiceHintKey('the-other-side', 'answer-yourself')]: 'Anerkennung, keine Korrektur',
  [roomChoiceOutcomeKey('the-other-side', 'answer-yourself', 0)]:
    'Du sagst es — keine Korrektur, keine Entschuldigung, nur eine Anerkennung, so, wie du jemanden an einer Tür begrüßen würdest, von dem du nicht sicher warst, ob er dich noch erkennen würde.',
  [roomChoiceOutcomeKey('the-other-side', 'answer-yourself', 1)]:
    'Der andere Stuhl antwortet nicht direkt zurück. Aber irgendetwas im Zimmer beruhigt sich, so, wie ein angehaltener Atem sich legt, wenn er endlich absichtlich losgelassen wird, von zwei Menschen statt von einem.',
  [roomChoiceTextKey('the-other-side', 'let-yourself-finish')]: 'Setz dich ihr gegenüber und sag nichts. Lass sie diesmal ausreden, ohne Unterbrechung.',
  [roomChoiceHintKey('the-other-side', 'let-yourself-finish')]: 'Das ungestörte Zuhören, das du vielleicht noch nie jemandem gegeben hast',
  [roomChoiceOutcomeKey('the-other-side', 'let-yourself-finish', 0)]:
    'Du lässt sie sprechen, bis ganz zum Ende, ohne ein einziges Wort zu korrigieren — was dir auffällt, ist dir nicht einmal beim ersten Mal immer gelungen.',
  [roomChoiceOutcomeKey('the-other-side', 'let-yourself-finish', 1)]:
    'Die Stille ist nicht leer. Sie ist, wenn überhaupt, das Vollständigste, was in diesem Zimmer gesagt wurde.',
  [roomChoiceTextKey('the-other-side', 'sit-in-both-chairs')]: '„Hier drin war nie jemand anderes.“ Setz dich abwechselnd auf beide Stühle, und mein es ernst.',
  [roomChoiceHintKey('the-other-side', 'sit-in-both-chairs')]: 'Die teuerste Lesart: Es gab immer nur dich',
  [roomChoiceOutcomeKey('the-other-side', 'sit-in-both-chairs', 0)]:
    'Du setzt dich kurz auch auf den zweiten Stuhl und probierst die Stimme an wie einen Mantel, den du früher besessen hast — und er passt, genau, was, je nach Tageszeit, entweder tröstlich ist oder das ganze Problem.',
  [roomChoiceOutcomeKey('the-other-side', 'sit-in-both-chairs', 1)]:
    'Es gab hier nie einen Gast zu bewirten. Nur eine Reihe von Versionen deiner selbst, die sich abwechselten, den Satz zu halten.',
  [roomChoiceTextKey('the-other-side', 'hand-the-sim')]: 'Reich der Stimme auf dem zweiten Stuhl die tote SIM-Karte.',
  [roomChoiceHintKey('the-other-side', 'hand-the-sim')]: 'Der Mensch, der du heimlich aufgehört hast zu sein',
  [roomChoiceOutcomeKey('the-other-side', 'hand-the-sim', 0)]:
    '„Hier“, sagst du und hältst sie hin — ein kleiner toter Chip, deaktiviert, ohne jedes verbliebene Signal. „Hier ist der Mensch, der ich heimlich aufgehört habe zu sein.“',
  [roomChoiceOutcomeKey('the-other-side', 'hand-the-sim', 1)]:
    'Der andere Stuhl nimmt sie wortlos entgegen. Es ist, irgendwie, der ehrlichste Austausch, der je einer der beiden Versionen von dir gelungen ist.',
  [roomExplanationKey('the-other-side', 0)]:
    'Dir gegenüber sitzt eine Stimme, vollständig aus dem zusammengesetzt, was du bei deinem letzten Aufenthalt hier gesagt und gewählt hast — kein Geist, sondern das Echo einer früheren Version deiner selbst. Die Forschung zur Perspektivübernahme ist eindeutig: Zuverlässig, schon nach kurzer Übung, mildert sie destruktiven Konflikt messbar stärker ab als fast jede andere untersuchte Intervention — dieses Zimmer verwandelt den gesamten Lehrplan des Hotels in eine einzige Übung.',
  [roomNoteTitleKey('the-other-side')]: 'Der zweite Stuhl',
  [roomNoteThinkersKey('the-other-side')]: 'Forschung zur Perspektivübernahme',
  [roomNoteBodyKey('the-other-side')]:
    'Interventionen zur Perspektivübernahme — bewusst einen Konflikt von der anderen Seite aus vorzustellen und zu formulieren — reduzieren destruktives Konfliktverhalten in kontrollierten Studien messbar, und der Effekt überdauert selbst kurze, einmalige Übungen. **Es ist eine Fertigkeit, keine Charaktereigenschaft: Sie verkümmert ohne Übung und muss geübt werden — das ist die gesamte Prämisse dieses Zimmers.** Jeder Streit in diesem Hotel hatte zwei Ich-Erzähler. Der Keller bewahrt beide Aufnahmen.',
});
register(roomBeatKey('the-other-side', 0, 2), 'v2', 'de', (s: RunState) => {
  const moments = pickShadowMoments(s.prior);
  if (moments.length === 0) return ECHO_EMPTY_FALLBACK_DE;
  const lines = moments.map((e) => `„${e.choiceText}“`).join(' Dann: ');
  return `Sie spricht dir zwei oder drei deiner eigenen Sätze vor — einen Halbton flacher, als du dich erinnerst, sie gesagt zu haben, so, wie sich Rechtfertigung vom empfangenden Stuhl aus anhört: ${lines}`;
});
register(roomBeatKey('the-other-side', 0, 3), 'v2', 'de', (s: RunState) => {
  if (choseInPrior(s.prior, 'the-rumor', 'set-the-trap')) {
    return 'Sie erinnert sich auch an die Falle — die Version von dir, die eine für jemanden gestellt hat, den sie liebte. „Es hat funktioniert“, sagt sie und zitiert sich selbst mit einer Art reuiger Ehrlichkeit. „Das war nie der fragliche Teil.“';
  }
  if (choseInPrior(s.prior, 'the-rumor', 'trust-without-asking')) {
    return 'Sie erinnert sich auch an den See — die Version von dir, die sich entschied, es nie zu wissen. „Vertrauen, geübt statt gefühlt“, sagt sie, und klingt, ausnahmsweise, nicht, als würde sie streiten.';
  }
  return 'Sie erwähnt das Gerücht nicht. Entweder hast du es nie erreicht, oder es war nicht der Teil von dir, der heute Nacht laut ausgesprochen werden musste.';
});
register(roomBeatKey('the-other-side', 0, 4), 'v2', 'de', (s: RunState) => {
  const id = s.prior?.endingId;
  if (!id) return 'Sie weiß nicht, wie du das letzte Mal gegangen bist. Manche Dinge, offenbar, bewahrt auch das Zimmer nicht auf.';
  const title = ENDING_TITLE_BY_ID[id] ?? id;
  return `Sie weiß auch, wie du gegangen bist — weder stolz darauf noch beschämt, was irgendwie schlimmer ist als beides. „${title}“, sagt sie, einmal, tonlos, und wiederholt sich nicht.`;
});
