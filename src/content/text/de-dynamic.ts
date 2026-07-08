// The v2 beats that are functions of RunState (state-reactive callbacks),
// translated by hand alongside their string siblings in de-rooms-actN.ts —
// scripts/extract-v2.ts only lifts plain strings, so these can't be
// auto-extracted. Branching logic mirrors the English source exactly.
import { register, t } from '../../engine/text/resolver';
import { choseIn, choseInPrior, hasFlag, pickExhibitEntry, pickShadowMoments, pickUnchosenRooms } from '../../engine/gameState';
import { punchlineUnlocked } from '../../engine/endings';
import type { RunState } from '../../engine/schema';
import { roomBeatKey, roomChoiceOutcomeKey, roomChoiceTextKey, roomTitleKey, endingTitleKey } from '../../engine/text/keys';
import { ROOM_TITLE_BY_ID, ENDING_TITLE_BY_ID } from '../rooms/understory';

/** German mirror of act3.ts's SHADOW_FALLBACK, index-aligned. */
const CAVE_SHADOW_FALLBACK_DE: string[] = [
  'Ein Schatten greift nach einem Hebel, den er nie ganz ziehen wird, mitten in der Entscheidung gefangen, für immer fast.',
  'Ein Schatten sitzt an einem Bett, das es nicht mehr gibt, und sagt etwas, das das Feuer verschluckt, bevor es die Wand erreicht.',
  'Ein Schatten steht an einer Schwelle, eine Hand halb erhoben — nicht ganz ein Winken, nicht ganz eine Ablehnung — und hält diese Form sehr lange.',
];

for (const index of [0, 1, 2] as const) {
  register(roomBeatKey('the-cave', 0, 2 + index), 'v2', 'de', (s: RunState) => {
    const entry = pickShadowMoments(s.prior)[index];
    if (!entry) return CAVE_SHADOW_FALLBACK_DE[index];
    const choice = t(roomChoiceTextKey(entry.roomId, entry.choiceId), entry.choiceText);
    return `An der Wand wiederholt ein Schatten eine bereits getroffene Entscheidung, genau so, wie Sie sie getroffen haben: „${choice}“`;
  });
}

register(roomBeatKey('junction', 1, 3), 'v2', 'de', (s: RunState) =>
  choseIn(s, 'junction', 'pull')
    ? 'Platzanweiser: Letztes Mal zogen Sie den Hebel — einer für fünf, sagten Sie. Hier ist derselbe Handel, näher an der Haut. Mal sehen, ob die Arithmetik die Berührung übersteht.'
    : choseIn(s, 'junction', 'no-pull')
      ? 'Platzanweiser: Sie hielten die Hände vom Hebel fern. Ich bin gespannt, ob die Brücke etwas ändert. Meist tut sie das. Dass sie es tut, ist selbst das Rätsel.'
      : 'Platzanweiser: Letztes Mal nannten Sie das dumm. Die Straßenbahn hat sich trotzdem um einen zweiten Akt gekümmert. Ihre Meinung zur Prämisse interessiert sie nicht.',
);

register(roomChoiceOutcomeKey('junction', 'push', 1), 'v2', 'de', (s: RunState) =>
  choseIn(s, 'junction', 'pull')
    ? 'Platzanweiser: Hebel und Brücke, beides. Was auch immer sonst wahr ist, diese Arithmetik geht bei Ihnen bis auf den Grund. Ob das Integrität ist oder ein Warnhinweis, überlasse ich Ihnen.'
    : 'Platzanweiser: Nein, beim Hebel. Ja, auf der Brücke. Das ist eine seltene Haltung. Sitzen Sie eine Weile damit — vielleicht haben Sie sie nicht absichtlich gewählt.',
);

register(roomChoiceOutcomeKey('junction', 'no-push', 1), 'v2', 'de', (s: RunState) =>
  choseIn(s, 'junction', 'pull')
    ? 'Platzanweiser: Also — den Hebel ziehen, aber das Stoßen ersparen. Fünf für einen auf Armeslänge, nicht auf Handlänge. Diese Asymmetrie beschäftigt philosophische Fakultäten seit einem halben Jahrhundert. Ob das Weisheit in Ihrem Rückgrat ist oder einfach Empfindlichkeit, kann ich nicht sagen.'
    : 'Platzanweiser: Konsequente Ablehnung. Die Straßenbahn nahm zehn, über zwei Räume hinweg, und Ihre Hände nahmen keinen einzigen. Für Ihre Haltung gibt es einen Namen. Er ist umstritten. Sie halten fest daran.',
);

register(roomBeatKey('ship', 0, 4), 'v2', 'de', (s: RunState) =>
  s.memoryLost
    ? 'Eine Planke, nach der sie greifen, ist einfach nicht da — eine Lücke mit verbrannten Rändern, wo eine Fotografie einst etwas verankerte. Die Handwerker beraten sich, zucken mit den Schultern, und setzen ein leeres Brett in die Lücke. Die Zusammensetzung in der Ecke hat dasselbe Loch. Sie berührt die Lücke im selben Moment wie Sie.'
    : 'Die Handwerker arbeiten nach einem Verzeichnis, und das Verzeichnis ist, wie Sie bemerken, ein Fotoalbum. Jede Planke hat ihr Bild. Jedes Bild hat einen Zeugen. Die Zusammensetzung in der Ecke prüft ebenfalls das Album und nickt bei denselben Seiten.',
);

register(roomBeatKey('teleporter', 0, 3), 'v2', 'de', (s: RunState) =>
  choseIn(s, 'ship', 'pattern')
    ? 'Sie erinnern sich an die Werkstatt — Sie stimmten für das Muster, die neu zusammengesetzten Planken. Die Kabine ist, in gewissem Sinne, Ihre eigene Haltung mit Türen daran. Es ist eine Sache, eine Ansicht zu vertreten. Eine andere, hineinzutreten.'
    : choseIn(s, 'ship', 'neither')
      ? 'Sie erinnern sich an die Werkstatt — „ich war nie ein Ding, das fortbesteht“, sagten Sie sich selbst, zweimal. Die Kabine hat offenbar Ihre Akte gelesen. Sie summt, als wollte sie sagen: beweisen Sie es.'
      : 'Irgendwo hinter Ihnen, in einer Werkstatt, die nach Zeder roch, streiten sich die Handwerker wahrscheinlich noch immer über Planken. Die Kabine ist derselbe Streit, umformuliert in Klempnersprache.',
);

register(roomBeatKey('door-that-asks', 0, 2), 'v2', 'de', (s: RunState) =>
  hasFlag(s, 'pulled-lever') || hasFlag(s, 'kept-lever') || hasFlag(s, 'refused-once')
    ? hasFlag(s, 'pulled-lever')
      ? 'DIE TÜR: An der Weiche zogen Sie den Hebel — ein Leben ausgegeben, um fünf zu behalten. Arithmetik über Enthaltung. Stehen Sie dazu, hier, am Ende, mit der Straßenbahn längst weg und nichts zu gewinnen bei beiden Antworten?'
      : hasFlag(s, 'kept-lever')
        ? 'DIE TÜR: An der Weiche hielten Sie Ihre Hände vom Hebel fern — fünf verloren, keiner davon Ihrer, um ihn auszugeben. Stehen Sie dazu, hier, am Ende, wo niemand zusieht und die Schaufensterpuppen alle nach Hause gegangen sind?'
        : 'DIE TÜR: An der Weiche verweigerten Sie die Frage selbst — nannten sie dumm, lehnten die Prämisse ab. Ich urteile nicht. Ich frage nur: Jetzt, wo Sie hier stehen, war die Weigerung eine Haltung, oder ein Zusammenzucken?'
    : 'DIE TÜR: Sie erreichten die Weiche nie; die Straßenbahn fuhr ohne Sie. Merkwürdig. Dann lassen Sie mich es unverblümt fragen, unbeschönigt: fünf Fremde oder einer, und Ihre Hand am Hebel — wissen Sie, selbst jetzt, was Sie tun würden?',
);

register(roomBeatKey('door-that-asks', 0, 3), 'v2', 'de', (s: RunState) =>
  s.memoryLost
    ? 'DIE TÜR: Im Feuer ließen Sie die Fotografie verbrennen. Der Beweis, wer Sie waren, weggegeben. Es gibt ein Loch in Ihrer Akte, wo sie einmal war — ich kann es von hier sehen. War es das wert?'
    : hasFlag(s, 'saved-photo')
      ? 'DIE TÜR: Im Feuer retteten Sie die Fotografie. Das Husten hinter der anderen Tür hörte auf, und Sie trugen Ihren Beweis daran vorbei hinaus. Er ist jetzt in Ihrer Tasche. War es das wert?'
      : 'DIE TÜR: Sie tragen Ihre Vergangenheit unversehrt — kein Feuer nahm etwas, das Sie nicht selbst hergaben. Eine stille Akte. Manchmal wurden die stillen einfach noch nicht nach der richtigen Frage gefragt. Betrachten Sie sich als gefragt: Was hätten Sie brennen lassen?',
);

register(roomChoiceOutcomeKey('door-that-asks', 'dont-remember', 0), 'v2', 'de', (s: RunState) =>
  s.memoryLost
    ? 'DIE TÜR: In Ihrem Fall ist das keine Ausflucht — es ist Dokumentation. Es gibt ein echtes Loch in Ihnen, feuerförmig, und Antworten, die hineinfielen, werden nicht abgelehnt, nur unbezeugt. Ich akzeptiere Lücken, für die bezahlt wurde. Ihre hat eine Quittung.'
    : 'DIE TÜR: Hm. Ihre Akte zeigt keine Feuer, keine Löcher — die Erinnerungen sind alle vorhanden; was fehlt, ist die Bereitschaft, neben ihnen zu stehen. „Ich erinnere mich nicht“ aus einem intakten Archiv ist ein bequemer Nebel. Ich lasse es durchgehen — ich bin eine Tür, kein Richter —, aber wir haben es beide gehört.',
);

register(roomBeatKey('door-that-asks', 1, 4), 'v2', 'de', (s: RunState) =>
  punchlineUnlocked(s)
    ? 'Und da ist — Sie bemerken es erst jetzt, und Sie verstehen, dass nicht jeder es bemerken darf — eine vierte Tür. Klein. Schlicht. Warmes Licht darunter, und dahinter, unverkennbar: Gelächter. Der Platzanweiser folgt Ihrem Blick und sagt gar nichts, was vom Platzanweiser stehende Ovationen bedeutet.'
    : 'Irgendwo abseits bemerken Sie halb eine kleine schlichte Tür, von der Sie ziemlich sicher sind, dass sie nie im Bauplan war. Sie ist verschlossen. Dahinter, ganz leise: Gelächter. Der Platzanweiser folgt Ihrem Blick. „Nicht dieses Mal“, sagt er sanft, und es ist irgendwie sowohl ein Urteil als auch eine Einladung, zurückzukommen.',
);

// ---------- Act V (Understory) dynamic beats ----------

register(roomBeatKey('the-archive', 0, 3), 'v2', 'de', (s: RunState) => {
  const entry = pickExhibitEntry(s.prior?.transcript ?? []);
  if (!entry) {
    return 'Die Karte in der offenen Kiste ist leer, an einer Ecke wasserfleckig — was auch immer diese Kiste einst enthielt, überlebte die Reise nach unten nicht. Der Rest des Regals ist zumindest lesbar.';
  }
  const choice = t(roomChoiceTextKey(entry.roomId, entry.choiceId), entry.choiceText);
  return `Die Karte liest, in Ihrer eigenen Handschrift: „${choice}“ Kein weiterer Kommentar. Die Einrichtung kommentiert nicht. Sie bewahrt nur.`;
});

register(roomBeatKey('the-unchosen', 0, 2), 'v2', 'de', (s: RunState) => {
  const { candidates } = pickUnchosenRooms(s.prior);
  if (candidates.length === 0) {
    return 'Der Korridor ist heute Nacht seltsam kahl — jede Tür, die Sie hätten verpassen können, verpassten Sie offenbar nicht. Oder die Aufzeichnung darüber überlebte die Reise nach unten einfach nicht. Die Einrichtung sagt nicht, was davon zutrifft.';
  }
  const titles = candidates.map((id) => t(roomTitleKey(id), ROOM_TITLE_BY_ID[id] ?? id));
  return `Drei fallen Ihnen zuerst auf: ${titles.join(', ')}. Sie erinnern sich nicht, dass sich eine davon je öffnete. Sie sind sich jetzt ziemlich sicher, dass mindestens eine davon angeboten wurde — und Sie einfach daran vorbeigingen.`;
});

register(roomBeatKey('the-unchosen', 0, 3), 'v2', 'de', (s: RunState) => {
  const { opens } = pickUnchosenRooms(s.prior);
  if (!opens) {
    return 'Heute Nacht hebt sich keine einzelne Tür hervor. Der Korridor bleibt genau, vollständig, verschlossen, und irgendwie ist das seine eigene Art von Antwort.';
  }
  const title = t(roomTitleKey(opens), ROOM_TITLE_BY_ID[opens] ?? opens);
  return `Eine Tür, nahe dem Ende des Korridors, schwingt von selbst den Rest des Weges auf — ${title}. Was auch immer dahinter wartete, wartet offensichtlich noch immer.`;
});

register(roomChoiceOutcomeKey('the-unchosen', 'enter-it', 0), 'v2', 'de', (s: RunState) => {
  const { opens } = pickUnchosenRooms(s.prior);
  const title = opens ? t(roomTitleKey(opens), ROOM_TITLE_BY_ID[opens] ?? opens) : 'den Raum';
  return `Sie treten in ${title} ein — oder was davon übrig ist. Kein Feuer, keine wartende Stimme der Einrichtung, kein Dilemma mitten im Satz. Nur ein Raum, möbliert, ein wenig staubig, der nichts Besonderes tut.`;
});

register(roomBeatKey('the-echo', 0, 2), 'v2', 'de', (s: RunState) => {
  const moments = pickShadowMoments(s.prior);
  if (moments.length === 0) {
    return 'Der andere Stuhl sagt nichts. Diesmal gibt es nichts Aufgezeichnetes, aus dem sich eine Stimme zusammensetzen ließe — und der Raum, zu seiner Ehre, tut nicht so, als wäre es anders.';
  }
  const lines = moments.map((e) => `„${t(roomChoiceTextKey(e.roomId, e.choiceId), e.choiceText)}“`).join(' Dann: ');
  return `Sie spricht zwei oder drei Ihrer eigenen Sätze zu Ihnen zurück, in Ihrem eigenen Rhythmus, der Reihe nach: ${lines}`;
});

register(roomBeatKey('the-echo', 0, 3), 'v2', 'de', (s: RunState) => {
  if (choseInPrior(s.prior, 'junction', 'push')) {
    return 'Sie erinnert sich auch an die Brücke — die Version von Ihnen, die stieß. „Konsequenz, mit Händen“, sagt sie, sich selbst mit einer Art wehmütigem Stolz zitierend.';
  }
  if (choseInPrior(s.prior, 'junction', 'no-push')) {
    return 'Sie erinnert sich auch an die Brücke — die Version von Ihnen, die nicht stieß. „Manche Mittel sind nie bloß Mittel“, sagt sie, und klingt für einmal nicht, als würde sie argumentieren.';
  }
  return 'Sie erwähnt die Brücke nicht. Entweder erreichten Sie sie nie, oder es war nicht der Teil von Ihnen, der heute Nacht laut ausgesprochen werden musste.';
});

register(roomBeatKey('the-echo', 0, 4), 'v2', 'de', (s: RunState) => {
  const id = s.prior?.endingId;
  if (!id) return 'Sie weiß nicht, wie Sie letztes Mal gingen. Manche Dinge, anscheinend, bewahrt der Raum auch nicht auf.';
  const title = t(endingTitleKey(id), ENDING_TITLE_BY_ID[id] ?? id);
  return `Sie weiß auch, wie Sie gingen — weder stolz darauf noch beschämt, was irgendwie schlimmer ist als beides. „${title}“, sagt sie, einmal, sachlich, und wiederholt sich nicht.`;
});
