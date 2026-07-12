// German translation of LIMERENCE's 12 Ledger epiphanies (see
// packs/limerence/epiphanies.ts's EN_FALLBACK). Quiet, one-line
// observations over a player's choice history — never advice, never read
// by gameplay logic, pure flavor text. Register mirrors
// text/cs-epiphanies.ts and text/fa-epiphanies.ts: wry, quiet, a little
// uncomfortable, never a fanfare — see CLAUDE.md's translation rule. Ids
// are pack-local strings distinct from ANAMNESIS's own epiphany ids, so no
// pack-scoping is needed for epiphanyKey (see engine/text/keys.ts).
//
// Address: informal "du" throughout, matching every other German file in
// this pack. Two lines needed a small gender-neutral rephrase rather than a
// literal calque of the English relative clause ("the one to leave") —
// 'never-the-one-to-leave' restructures around "du" as the sole
// (grammatically genderless) pronoun instead of a gendered "der/die, der/die
// gegangen ist" construction, same spirit as de-rooms-act3.ts's documented
// approach to gender-neutral phrasing elsewhere in this pack.
import { registerAll } from '../../../engine/text/resolver';
import { epiphanyKey } from '../../../engine/text/keys';

registerAll('v2', 'de', {
  [epiphanyKey('never-asked-first')]: 'Du hast noch nie gefragt, bevor du beschuldigt hast.',
  [epiphanyKey('three-times-fine')]: 'Drei Zimmer haben dich „passt schon" sagen hören. Es hat nie gepasst.',
  [epiphanyKey('truth-one-room-late')]: 'Du sagst die Wahrheit immer genau ein Zimmer zu spät.',
  [epiphanyKey('never-the-one-to-leave')]: 'Gegangen ist immer jemand anderes. Du noch nie.',
  [epiphanyKey('every-trap-caught-you')]: 'Jede Falle, die du gestellt hast, hat dich gefangen.',
  [epiphanyKey('mid-goodbye')]: 'Du wählst immer wieder Menschen mitten im Abschied.',
  [epiphanyKey('window-and-wall')]: 'Das Fenster und die Mauer: du hast beide gebaut. Zähl nach, welche öfter.',
  [epiphanyKey('doors-you-avoid')]: 'Du liest jeden Türhinweis zweimal. Du weißt längst, welchen Türen du ausweichst.',
  [epiphanyKey('apologizes-with-logistics')]: 'Du entschuldigst dich mit Logistik.',
  [epiphanyKey('sentence-never-said')]:
    'Niemand in diesem Hotel hat dich je den Satz sagen hören, den du das Zimmer für dich hast sagen lassen.',
  [epiphanyKey('walked-away-once')]: 'Einmal bist du gegangen. Es steht in der Akte. Lies es, wenn der Flur lang wird.',
  [epiphanyKey('legible-not-finished')]: 'Deine Handschrift ist lesbar. Das ist nicht dasselbe wie fertig.',
});
