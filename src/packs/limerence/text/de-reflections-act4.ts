// German translations for LIMERENCE Act IV's Examined Path reflections
// (spec 05). Every line is translated with the specific room's actual
// situation and the choice's real stakes in mind, not word-for-word from
// English — see CLAUDE.md's translation rule. Verified directly against
// src/packs/limerence/rooms/act4.ts rather than assumed from an earlier
// pass: the-kitchen-table's four story-branch choices (stay-for-them,
// separate-well, attempt-repair, say-the-unsayable) carry `reflections` in
// the English source; its keepsake-gated choice (place-the-unsent-letter)
// does not. the-morning-desk's three stage-0 interview choices
// (stand-by-all, name-what-changed-me, some-rooms-i-wasnt-present-in)
// carry `reflections`; its five stage-1 threshold choices (walk-out,
// take-the-desk, stop-carrying-it, laughing-door, i-know-every-room) do
// not. the-unsent has no `reflections` field on any of its six choices.
//
// Partner gender-neutrality follows the exact strategy documented in
// de-rooms-act4.ts's own header: "die Person"/"die andere Person" rather
// than a third-person pronoun tied to a specific gender, since Act IV's
// own recurring partner is never named or gendered in the English source.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'de', {
  // ---------- The Kitchen Table ----------
  [reflectionKey('the-kitchen-table', 'stay-for-them', 'consequence')]:
    'Zu bleiben bewahrt den Haushalt heute, zu einem Preis, der ganz davon abhängt, ob der Pakt gepflegt oder ad acta gelegt wird.',
  [reflectionKey('the-kitchen-table', 'stay-for-them', 'duty')]:
    'Das ehrt eine Verpflichtung gegenüber den Kindern, klärt aber für sich genommen nicht, was ihr einander schuldet.',
  [reflectionKey('the-kitchen-table', 'stay-for-them', 'virtue')]:
    'Das ist eine Entscheidung, deren Charakter von der Pflege abhängt — sie kann Gerüst sein oder Aufschub, und erst spätere Morgen werden zeigen, welches von beidem.',
  [reflectionKey('the-kitchen-table', 'stay-for-them', 'care')]:
    'Die Kinder bekommen heute Morgen ein stabiles Zuhause — ob es eines bleibt, ist eine eigene, andauernde Frage.',
  [reflectionKey('the-kitchen-table', 'separate-well', 'consequence')]:
    'Sich gut zu trennen tauscht die Beziehung gegen ein konfliktärmeres Ergebnis, das laut Forschung die Kinder tatsächlich schützt.',
  [reflectionKey('the-kitchen-table', 'separate-well', 'duty')]:
    'Das ehrt, was den Kindern zusteht — eine gut geführte Trennung —, mehr als den Anschein einer intakten Familie.',
  [reflectionKey('the-kitchen-table', 'separate-well', 'virtue')]:
    'Das ist Trauer, mit echter Disziplin gehandhabt, gewählt anstelle von stillem Groll oder offenem Streit.',
  [reflectionKey('the-kitchen-table', 'separate-well', 'care')]:
    'Das ist bewusst um das herum gebaut, was die Kinder tatsächlich tragen werden, nicht um die Bequemlichkeit eines der beiden Elternteile.',
  [reflectionKey('the-kitchen-table', 'attempt-repair', 'consequence')]:
    'Reparatur zu versuchen setzt echten Aufwand gegen ein ungewisses Ergebnis, im Tausch gegen die Chance auf etwas Besseres, als entweder unverändert zu bleiben oder zu gehen.',
  [reflectionKey('the-kitchen-table', 'attempt-repair', 'duty')]:
    'Das ehrt das ursprüngliche Versprechen der Beziehung, indem es tatsächlich prüft, ob es sich halten lässt, statt es in die eine oder andere Richtung einfach anzunehmen.',
  [reflectionKey('the-kitchen-table', 'attempt-repair', 'virtue')]:
    'Das ist anhaltende, unglamouröse Disziplin — zum zweiten Termin zu erscheinen, was die eigentliche Prüfung ist.',
  [reflectionKey('the-kitchen-table', 'attempt-repair', 'care')]:
    'Das behandelt, was auch immer geschehen ist, als Alarm, den es zu verstehen lohnt, nicht nur als Vergehen, das Strafe verdient — ein schwererer, aber nützlicherer Rahmen für euch beide.',
  [reflectionKey('the-kitchen-table', 'say-the-unsayable', 'consequence')]:
    'Das Unsagbare auszusprechen löst die praktischen Fragen des Morgens nicht, verändert aber, was jede spätere Antwort tatsächlich bedeuten wird.',
  [reflectionKey('the-kitchen-table', 'say-the-unsayable', 'duty')]:
    'Dieser Satz stand euch beiden schon lange vor diesem Morgen zu — seine Verspätung hebt die Schuld nicht auf.',
  [reflectionKey('the-kitchen-table', 'say-the-unsayable', 'virtue')]:
    'Das ist die schonungsloseste Ehrlichkeit, die dieses Zimmer zu bieten hat, angeboten ohne zu wissen, was sie kosten wird.',
  [reflectionKey('the-kitchen-table', 'say-the-unsayable', 'care')]:
    'Das behandelt die andere Person als jemanden, dem die tiefste verfügbare Wahrheit zusteht, nicht eine wohldosierte Version davon.',

  // ---------- The Morning Desk ----------
  [reflectionKey('the-morning-desk', 'stand-by-all', 'consequence')]:
    'Zu jeder Entscheidung zu stehen ändert nichts an dem, was bereits geschehen ist — nur daran, was du jetzt bereit bist, darüber zu sagen.',
  [reflectionKey('the-morning-desk', 'stand-by-all', 'duty')]:
    'Du schuldest deiner eigenen Akte eine ehrliche Unterschrift, egal was sie gekostet hat — und du hast gerade eine gegeben, vollständig.',
  [reflectionKey('the-morning-desk', 'stand-by-all', 'virtue')]:
    'Frag dich, ob ein vollständig unterschriebenes Kontobuch Integrität ist, oder eine Rüstung, die so lange getragen wurde, dass sie sich nicht mehr wie eine Entscheidung anfühlt.',
  [reflectionKey('the-morning-desk', 'stand-by-all', 'care')]:
    'Der Portier merkt das ohne Grausamkeit an — für wen auch immer es war, die Unterschrift war deine, zu geben oder zu verweigern, und du hast sie vollständig gegeben.',
  [reflectionKey('the-morning-desk', 'name-what-changed-me', 'consequence')]:
    'Zu benennen, was dich verändert hat, macht die frühere Entscheidung nicht ungeschehen — es fügt einen ehrlichen zweiten Eintrag neben dem ersten hinzu.',
  [reflectionKey('the-morning-desk', 'name-what-changed-me', 'duty')]:
    'Du schuldest der Rezeption, und dir selbst, den Beleg genauso wie die Revision — das Zimmer zu benennen, das dich verändert hat, ist die schwerere Hälfte.',
  [reflectionKey('the-morning-desk', 'name-what-changed-me', 'virtue')]:
    'Frag dich, ob die Akte hier zu überarbeiten Wachstum ist, oder ein bequemer Weg, dich von dem loszusagen, wer du warst, bevor du es besser wusstest.',
  [reflectionKey('the-morning-desk', 'name-what-changed-me', 'care')]:
    'Die Rezeption behandelt ein Ich, das seine Meinung ändern kann, als lebendiger als eines, das es nicht kann — im Stillen ausgeweitet auf die Person, die du früher warst.',
  [reflectionKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 'consequence')]:
    'Die Lücke einzugestehen füllt sie nicht — die Entscheidungen, die darin getroffen wurden, bleiben genauso unbezeugt wie vor deinem Eingeständnis.',
  [reflectionKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 'duty')]:
    'Du schuldest der Rezeption einen ehrlichen Bericht, samt seiner Lücken — die Lücke einzugestehen erfüllt diese Pflicht eher, als so zu tun, als gäbe es sie nicht.',
  [reflectionKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 'virtue')]:
    'Frag dich, ob die Skepsis der Rezeption gegenüber einer lückenlosen Akte, die Abwesenheit behauptet, fair ist — oder ob manche Lücken auch ohne eine Falle als Ursache echt sind.',
  [reflectionKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 'care')]:
    'Was auch immer der Portier davon hält, er lässt es durchgehen — eine kleine Gnade, gewährt einem Gast, der für einen Teil davon tatsächlich nicht ganz da war.',
});
