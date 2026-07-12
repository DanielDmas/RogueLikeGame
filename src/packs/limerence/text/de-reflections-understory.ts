// German translations for LIMERENCE Understory's Examined Path reflections
// (spec 05). Every line is translated with the specific room's actual
// situation and the choice's real stakes in mind, not word-for-word from
// English — see CLAUDE.md's translation rule. Verified directly against
// src/packs/limerence/rooms/understory.ts, matching cs-reflections-
// understory.ts's precedent: the-registry has no `reflections` field on any
// of its four choices and is correctly absent from this file.
// the-doors-not-opened's three choices (enter-late, close-it, ask-why-now)
// all carry `reflections`. the-other-side's answer-yourself,
// let-yourself-finish, and sit-in-both-chairs carry `reflections`; its
// fourth, keepsake-gated choice (hand-the-sim) does not.
//
// Pronoun note: the-other-side addresses the player's own former self, not
// a partner — "sie" throughout tracks the grammatical gender of "die
// Stimme" (the voice), the same way "es" tracks "das Zimmer" elsewhere in
// this pack, and asserts nothing about a human referent. See
// de-rooms-understory.ts's header for the fuller explanation.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'de', {
  // ---------- The Doors Not Opened ----------
  [reflectionKey('the-doors-not-opened', 'enter-late', 'consequence')]:
    'Was auch immer dort wartete, ist bereits geschehen, oder nicht — jetzt hineinzugehen ändert nichts daran, was damals möglich war.',
  [reflectionKey('the-doors-not-opened', 'enter-late', 'duty')]:
    'Du schuldest der alten Möglichkeit nichts außer der Ehrlichkeit, endlich hinzusehen — spät einzutreten begleicht eine private Neugier, keine Schuld, die irgendjemandem zustand.',
  [reflectionKey('the-doors-not-opened', 'enter-late', 'virtue')]:
    'Frag dich, ob jetzt einzutreten, wo es dich nichts mehr kosten kann, echte, gewürdigte Neugier ist, oder eine ungefährliche Generalprobe für Mut.',
  [reflectionKey('the-doors-not-opened', 'enter-late', 'care')]:
    'In diesem Zimmer hat nie jemand auf dich gewartet — der einzige Mensch, für den dieser späte Besuch ist, ist der, der in der Tür steht.',
  [reflectionKey('the-doors-not-opened', 'close-it', 'consequence')]:
    'Sie zu schließen ändert nichts daran, was drinnen war — die Tür wird einfach wieder genau das, was sie war, bevor du sie bemerkt hast.',
  [reflectionKey('the-doors-not-opened', 'close-it', 'duty')]:
    'Manchen Türen schuldest du nichts als den Respekt, sie geschlossen zu lassen — nicht jeder Möglichkeit steht ein zweiter Blick zu, nur weil sie endlich angeboten wird.',
  [reflectionKey('the-doors-not-opened', 'close-it', 'virtue')]:
    'Frag dich, ob sie zu schließen Weisheit darüber war, welche Türen nie deine waren, oder eine leisere Vermeidung, verkleidet als Zurückhaltung.',
  [reflectionKey('the-doors-not-opened', 'close-it', 'care')]:
    'Niemand hinter dieser Tür brauchte dich, um sie zu öffnen — du lässt sie genauso ungestört, wie du sie vorgefunden hast.',
  [reflectionKey('the-doors-not-opened', 'ask-why-now', 'consequence')]:
    'Die geölten Scharniere sagen dir, dass die Tür gezielt für heute Nacht vorbereitet wurde — aber das zu wissen, ändert nichts daran, ob du hindurchgehst.',
  [reflectionKey('the-doors-not-opened', 'ask-why-now', 'duty')]:
    'Dem Angebot selbst schuldest du eine ehrliche Frage, bevor du ihm eine Antwort schuldest — zu fragen, warum jetzt, ist seine eigene Art von Sorgfalt.',
  [reflectionKey('the-doors-not-opened', 'ask-why-now', 'virtue')]:
    'Frag dich, ob die Tür zu verhören, statt sie einfach zu nutzen, Genauigkeit ist, oder ein Weg, die schwierigere Entscheidung hinauszuzögern.',
  [reflectionKey('the-doors-not-opened', 'ask-why-now', 'care')]:
    'Die Scharniere wurden nur für dich geölt — was auch immer das Timing bedeutet, diese Aufmerksamkeit war nie für jemand anderen gedacht.',

  // ---------- The Other Side ----------
  [reflectionKey('the-other-side', 'answer-yourself', 'consequence')]:
    'Zurückzusprechen ändert nichts an dem, was bereits gesagt wurde — es ändert nur, ob es gehört wurde.',
  [reflectionKey('the-other-side', 'answer-yourself', 'duty')]:
    'Du schuldest deinem früheren Ich eine Anerkennung, keine Korrektur — es zu begrüßen ist eine Schuld der Anerkennung, nicht der Zustimmung.',
  [reflectionKey('the-other-side', 'answer-yourself', 'virtue')]:
    'Frag dich, ob die Stimme anzusprechen, statt sie nur zu bezeugen, Mut ist, oder eine alte Angewohnheit, das letzte Wort haben zu müssen.',
  [reflectionKey('the-other-side', 'answer-yourself', 'care')]:
    'Das Zimmer beruhigt sich wie ein angehaltener Atem, der von zwei Menschen statt von einem losgelassen wird — eine kleine Gnade, erwiesen dem, der du früher warst.',
  [reflectionKey('the-other-side', 'let-yourself-finish', 'consequence')]:
    'Sie ungestört ausreden zu lassen, ändert nichts an dem, was sie sagt — nur daran, ob sie diesmal alles davon sagen darf.',
  [reflectionKey('the-other-side', 'let-yourself-finish', 'duty')]:
    'Du schuldest deinem früheren Ich das Gehör, das du ihm beim ersten Mal vielleicht nicht gegeben hast — Schweigen begleicht hier eine Schuld der Aufmerksamkeit, nicht der Zustimmung.',
  [reflectionKey('the-other-side', 'let-yourself-finish', 'virtue')]:
    'Frag dich, ob zu schweigen Geduld ist, oder einfach leichter, als herauszufinden, was du erwidern würdest.',
  [reflectionKey('the-other-side', 'let-yourself-finish', 'care')]:
    'Die Stille ist das Vollständigste, was in diesem Zimmer gesagt wurde — eine Form von Fürsorge, die von der Stimme nichts verlangt außer auszureden.',
  [reflectionKey('the-other-side', 'sit-in-both-chairs', 'consequence')]:
    'Auf beiden Stühlen zu sitzen ändert nichts daran, welche Version von dir gerade spricht — es beseitigt nur die Vorspiegelung, es hätte je zwei gegeben.',
  [reflectionKey('the-other-side', 'sit-in-both-chairs', 'duty')]:
    'Du schuldest keinem Besuch ein Publikum, denn zuzugeben, dass es nie einen gab, löst die ganze Vorstellung einer Schuld zwischen Gastgeber und Gast auf.',
  [reflectionKey('the-other-side', 'sit-in-both-chairs', 'virtue')]:
    'Frag dich, ob das die teuerste Ehrlichkeit in diesem Zimmer ist, oder ein cleverer Weg, der Stimme tatsächlich nicht antworten zu müssen.',
  [reflectionKey('the-other-side', 'sit-in-both-chairs', 'care')]:
    'Es gab hier nie einen Gast zu bewirten — nur eine Reihe von dir selbst, und die Fürsorge galt immer, still, dir selbst.',
});
