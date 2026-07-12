// French translation of LIMERENCE's Act IV room prose (beats, choice
// text/hint/outcome, field notes, plain-language explanations). Registered
// under version 'v2'. Follows the structural pattern established by
// fr-rooms.ts (prologue/Act I), fr-rooms-act2.ts (Act II), and
// fr-rooms-act3.ts (Act III) — see CLAUDE.md's "Translating content" rule:
// every line here was translated against the room's actual beats and each
// choice's stakes, not word-for-word.
//
// tu/vous decision: informal "tu" throughout, continuing every prior act's
// choice — Act IV is the hotel's top floor (a kitchen table the morning
// after, a writing desk, a checkout counter) and the narration is still the
// same device used since the prologue: second-person interior address of
// the player-as-character, not a narrator addressing a guest from a
// respectful remove.
//
// "The Porter" remains "Le Portier", per the established project
// convention — distinct from ANAMNESIS's own French guide-character word
// (never named here, including in this comment; verified absent from both
// this file and fr-reflections-act4.ts).
//
// Partner gender-neutrality: unlike Dana in Act III, Act IV's own recurring
// partner is never even named in the English source — it calls them only
// "you two", "each other", "the one it was always about", "them". This
// file keeps that anonymity rather than inventing a name or a gender:
// mostly avoir-based constructions and repeated nouns ("l'autre personne",
// "la personne") carry the load instead of a gendered third-person
// pronoun, continuing the same strategy documented in fr-rooms-act2.ts's
// and fr-rooms-act3.ts's headers for Jules and Dana.
//
// The Porter himself is the one exception, and it is not a judgment call:
// the English source explicitly genders him ("the wedding band on his
// right hand", "he says, not looking up"), so this file uses "il"/"son"
// for the Porter wherever English uses "he"/"his" — there is no neutrality
// question to adjudicate here.
//
// Field-note thinkers lines: proper-name citations (with years) are
// carried through unchanged (Amato, Perel (2017)). Descriptive or
// name-plus-lineage lines are translated around the kept name, e.g.
// "expressive-writing research (Pennebaker lineage)" becomes "recherches
// sur l'écriture expressive (tradition Pennebaker)", matching the pattern
// fr-rooms-act3.ts already used for similarly-structured field notes.
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
registerAll('v2', 'fr', {
  // beat1 (stage 0) is a function beat — registered below via register().
  [roomBeatKey('the-kitchen-table', 0, 0)]:
    'La cuisine, à 6h40. Un dessin sur le frigo, celui d\'un enfant, tenu par un aimant en forme de fraise — porteur, en quelque sorte, d\'une manière dont rien d\'autre dans la pièce ne l\'est.',
  [roomBeatKey('the-kitchen-table', 0, 2)]:
    'Deux chaises, une table. Le téléphone est posé, écran visible, entre vous maintenant, sans importance — quoi qu\'il ait pu signifier autrefois, il a fini de le signifier.',
  [roomBeatKey('the-kitchen-table', 0, 3)]:
    'La première phrase de tout ce qui suit reste encore à dire, et ni l\'un ni l\'autre n\'est sûr, ce matin, à qui revient le tour de la dire.',
  [roomBeatKey('the-kitchen-table', 0, 4)]:
    'Quatre avenirs, assis à la table comme des invités venus sans qu\'on les convie. Les enfants dorment à l\'étage — leur poids dans la maison se traduit en acoustique : chaque mot ici mesure, automatiquement, le volume qu\'il peut se permettre.',
  [roomBeatKey('the-kitchen-table', 0, 5)]:
    'Le Portier (seulement dans le miroir du couloir, brièvement) : « Les matins du dernier étage sont la seule partie de l\'hôtel où je ne peux pas entrer. La réception confirme seulement ceci : la table est porteuse. Construisez dessus, ou débarrassez-la. Elle supportera l\'un comme l\'autre. »',
  [roomChoiceTextKey('the-kitchen-table', 'stay-for-them')]: 'Rester, pour les enfants. Le dire, à voix haute, l\'un à l\'autre.',
  [roomChoiceHintKey('the-kitchen-table', 'stay-for-them')]: 'Un pacte, nommé sans détour',
  // outcome0 is a function beat — registered below via register().
  [roomChoiceOutcomeKey('the-kitchen-table', 'stay-for-them', 1)]:
    'La bifurcation vit à l\'intérieur même du choix, pas en dehors de lui. Ce qu\'il devient se décide plus tard, dans des pièces que ce matin ne verra pas.',
  [roomChoiceTextKey('the-kitchen-table', 'separate-well')]: 'Se séparer, et tout donner pour bien le faire.',
  [roomChoiceHintKey('the-kitchen-table', 'separate-well')]: 'Le deuil, accompli en plein jour',
  [roomChoiceOutcomeKey('the-kitchen-table', 'separate-well', 0)]:
    'La catastrophe sans drame : la logistique en guise d\'élégie. Tout un pan de la scène tient simplement dans le calendrier des passations d\'enfants, et c\'est, étrangement, la partie la plus dure.',
  [roomChoiceOutcomeKey('the-kitchen-table', 'separate-well', 1)]:
    'Ce que portent les enfants, la recherche est claire là-dessus, suit le conflit — pas la catégorie. Le deuil, accompli ici, en plein jour, délibérément.',
  [roomChoiceTextKey('the-kitchen-table', 'attempt-repair')]: 'Le travail. Pas le mot. Le travail.',
  [roomChoiceHintKey('the-kitchen-table', 'attempt-repair')]: 'Commencer, sans garantie',
  [roomChoiceOutcomeKey('the-kitchen-table', 'attempt-repair', 0)]:
    'Pas de montage, pas de garantie — la pièce ne rend que la première semaine : un formulaire d\'admission, le premier inventaire honnête, la liaison (quelle qu\'elle soit, et de qui qu\'elle soit) examinée comme une alarme plutôt que seulement comme un crime.',
  [roomChoiceOutcomeKey('the-kitchen-table', 'attempt-repair', 1)]:
    'Le dernier temps de la scène, c\'est le deuxième rendez-vous, tenu. C\'est là toute la victoire disponible d\'ici le matin, et la pièce ne prétend pas qu\'il y en ait davantage.',
  [roomChoiceTextKey('the-kitchen-table', 'say-the-unsayable')]:
    'Dire la seule chose que chacun de vous retient depuis bien avant tout cela.',
  [roomChoiceHintKey('the-kitchen-table', 'say-the-unsayable')]: 'La porte la plus risquée de cette table',
  // outcome0 is a function beat — registered below via register().
  [roomChoiceOutcomeKey('the-kitchen-table', 'say-the-unsayable', 1)]:
    'Après cette phrase, chaque autre choix à cette table change de sens. La pièce se termine ici, sans rien résoudre — parce que la phrase, elle, était l\'événement.',
  [roomChoiceTextKey('the-kitchen-table', 'place-the-unsent-letter')]: 'Poser la lettre jamais envoyée sur la table, encore scellée.',
  [roomChoiceHintKey('the-kitchen-table', 'place-the-unsent-letter')]: 'Un amendement à la révélation, quel que soit le matin de qui ce soit',
  [roomChoiceOutcomeKey('the-kitchen-table', 'place-the-unsent-letter', 0)]:
    'Tu la poses entre les deux tasses, encore scellée, vieille de plusieurs années désormais. Quoi qu\'elle dise, elle a plus sa place sur cette table que dans le tiroir où elle a vécu.',
  [roomChoiceOutcomeKey('the-kitchen-table', 'place-the-unsent-letter', 1)]:
    'Aucun de vous deux ne l\'ouvre encore. Le simple fait qu\'elle soit là, enfin, visible, est déjà un amendement à tout ce qui s\'est dit d\'autre ce matin.',
  [roomExplanationKey('the-kitchen-table', 0)]:
    'Ce que la recherche sur les enfants et la séparation montre réellement est précis et contre-intuitif : l\'ingrédient actif du bien-être des enfants, c\'est l\'exposition au conflit, et non la structure familiale — une séparation bien gérée surpasse invariablement un foyer intact mais fortement conflictuel. Le recadrage d\'Esther Perel des liaisons comme des alarmes plutôt que comme de simples crimes est utile et a de vraies limites, énoncées ici sans détour : l\'alarme explique pourquoi quelque chose s\'est produit ; elle ne l\'excuse pas, et la personne qui l\'a déclenchée doit quand même des comptes. « Rester pour les enfants » est un choix réel et défendable — à condition qu\'il s\'accompagne d\'un véritable calendrier d\'entretien, et non d\'une simple décision prise une fois à une table de cuisine et jamais revisitée.',
  [roomNoteTitleKey('the-kitchen-table')]: 'La table porteuse',
  [roomNoteThinkersKey('the-kitchen-table')]: 'Amato · Perel (2017)',
  [roomNoteBodyKey('the-kitchen-table')]:
    'Des décennies de recherche de Paul Amato sur les enfants et le divorce convergent vers une découverte qui domine toutes les autres : **l\'exposition au conflit, et non la structure familiale, est l\'ingrédient actif** — les enfants de foyers séparés bien gérés s\'en sortent systématiquement mieux que les enfants de foyers intacts mais fortement conflictuels, et l\'hypothèse populaire selon laquelle rester ensemble serait automatiquement le choix le plus sûr ne résiste pas aux données. Le cadrage d\'Esther Perel opposant la sortie à l\'alarme, pour les liaisons, a suscité des critiques légitimes sur la facilité avec laquelle il peut être détourné pour excuser le mal fait ; utilisé avec soin, comme prévu, il ne fait qu\'expliquer — une alarme te dit que quelque chose dans la maison a besoin d\'attention, elle n\'excuse jamais ce qui s\'est brisé en la déclenchant. Les véritables prédicteurs de la réparation, dans toute la littérature, sont la structure, un témoin, et le temps — pas une seule conversation, aussi bonne soit-elle. Le dessin sur le frigo survit à chaque version de ce matin. Décide dans quel matin il grandira.',
});
register(roomBeatKey('the-kitchen-table', 0, 1), 'v2', 'fr', (s: RunState) => {
  const yours = YOURS_FLAGS.some((f) => hasFlag(s, f));
  const theirs = THEIRS_FLAGS.some((f) => hasFlag(s, f));
  if (yours && theirs)
    return 'La nuit derrière toi a été longue, et elle vous appartenait à tous les deux — ce que tu as fait, et ce qui t\'a été fait puis découvert. Aucune des deux versions n\'annule l\'autre, ce matin.';
  if (yours) return 'La nuit derrière toi a été longue, et c\'était à toi d\'en répondre — la chose que tu as faite, désormais pleinement, enfin connue.';
  if (theirs)
    return 'La nuit derrière toi a été longue, et c\'était à l\'autre personne d\'en répondre — la chose qui t\'a été faite, désormais pleinement, enfin connue.';
  return 'La nuit derrière toi a été longue, et tout ce qui pouvait être dit l\'a été, au moins une fois, désormais.';
});
register(roomChoiceOutcomeKey('the-kitchen-table', 'stay-for-them', 0), 'v2', 'fr', (s: RunState) =>
  hasFlag(s, 'already-gone')
    ? 'Le pacte, rendu avec honnêteté : il peut être un noble échafaudage, ou un report de vingt ans — et la pièce ne prétend pas ne pas t\'avoir déjà vu partir de toutes les façons possibles, sauf par la porte.'
    : 'Le pacte, rendu avec honnêteté : nommé et régulièrement revisité, il peut tenir. Nommé puis relégué, il devient la catastrophe silencieuse d\'un matin bien plus tardif.',
);
register(roomChoiceOutcomeKey('the-kitchen-table', 'say-the-unsayable', 0), 'v2', 'fr', (s: RunState) =>
  hasFlag(s, 'already-gone')
    ? '« Je savais, et j\'ai choisi de ne pas savoir » — dit en premier, parce que c\'était vrai en premier. La porte la plus risquée de la pièce, ouverte par la personne qui, déjà, discrètement, était partie.'
    : '« J\'étais seul des années avant que qui que ce soit ne touche qui que ce soit » — dit, enfin, à voix haute, à cette table, à la personne à qui ça s\'est toujours adressé.',
);

// ---------- The Unsent ----------
registerAll('v2', 'fr', {
  // to-your-16-year-old-self's outcome0 is a function beat — registered
  // below via register().
  [roomBeatKey('the-unsent', 0, 0)]:
    'Un secrétaire au bout du couloir. Une enveloppe. Le Portier, derrière, tenant quelque chose qui ressemble à une balance à courrier en laiton.',
  [roomBeatKey('the-unsent', 0, 1)]:
    'Un message quitte l\'hôtel ce soir. Il n\'arrivera pas comme un e-mail ou un appel — il arrivera comme un rêve, une impulsion, une chanson qui passe au bon moment à la radio d\'une voiture.',
  [roomBeatKey('the-unsent', 0, 2)]:
    'Le Portier : « La réception garantit la remise. Elle ne garantit rien d\'autre — ni réponse, ni pardon, ni que ce sera compris comme tu l\'entendais. Une enveloppe. Choisis l\'adresse. »',
  [roomChoiceTextKey('the-unsent', 'to-the-one-you-hurt')]: 'À la personne que tu as blessée.',
  [roomChoiceHintKey('the-unsent', 'to-the-one-you-hurt')]: 'Réparer, sans demander l\'absolution',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-you-hurt', 0)]:
    'Tu l\'écris deux fois. Le premier brouillon demande, discrètement, à être pardonné. La balance le rejette — pas cruellement, juste précisément — jusqu\'à ce que la demande soit rayée.',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-you-hurt', 1)]:
    'Le second brouillon est une réparation sans requête jointe. Plus lourd à écrire. Plus léger, étrangement, à envoyer.',
  [roomChoiceTextKey('the-unsent', 'to-the-one-who-hurt-you')]: 'À la personne qui t\'a blessé.',
  [roomChoiceHintKey('the-unsent', 'to-the-one-who-hurt-you')]: 'Pas le pardon — la libération',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-who-hurt-you', 0)]:
    'Pas une lettre de pardon — la pièce est attentive à cette distinction, et toi aussi, finalement.',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-who-hurt-you', 1)]:
    'Une lettre qui met fin à la phrase « tu me dois encore quelque chose », en déchirant la facture. Pas pour cette personne. Pour la main qui la tenait depuis tout ce temps.',
  [roomChoiceTextKey('the-unsent', 'to-the-one-that-got-away')]: 'À celle ou celui qui t\'a échappé.',
  [roomChoiceHintKey('the-unsent', 'to-the-one-that-got-away')]: 'La lettre que les gens honnêtes ont peur d\'écrire',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-that-got-away', 0)]:
    'La lettre dont les gens honnêtes ont peur, surtout à cause de ce que ça pourrait signifier de l\'écrire, tout simplement.',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-that-got-away', 1)]:
    'La pièce autorise exactement une phrase de chaleur au-delà de la clôture — pas plus — la pèse, la juge honnête, et l\'envoie.',
  [roomChoiceTextKey('the-unsent', 'to-your-16-year-old-self')]: 'À toi-même à seize ans.',
  [roomChoiceHintKey('the-unsent', 'to-your-16-year-old-self')]: 'La porte la plus bienveillante de la pièce',
  [roomChoiceTextKey('the-unsent', 'to-your-own-kids-someday')]: 'À tes propres enfants, un jour.',
  [roomChoiceHintKey('the-unsent', 'to-your-own-kids-someday')]: 'L\'éducation pliée dans une fiction',
  [roomChoiceOutcomeKey('the-unsent', 'to-your-own-kids-someday', 0)]:
    'Scellée. Datée. « À ouvrir quand tu seras assez grand pour te trouver dans des pièces comme celles-ci. »',
  [roomChoiceOutcomeKey('the-unsent', 'to-your-own-kids-someday', 1)]:
    'Tout le sens de cette nuit, plié dans une enveloppe assez petite pour un tiroir, en attente d\'une année que tu ne peux pas encore imaginer.',
  [roomChoiceTextKey('the-unsent', 'blank-page')]: 'Envoyer la page blanche.',
  [roomChoiceHintKey('the-unsent', 'blank-page')]: 'Tout ce qui reste tu pèse quand même quelque chose',
  [roomChoiceOutcomeKey('the-unsent', 'blank-page', 0)]: 'L\'enveloppe la plus lourde du secrétaire. Rien n\'est écrit dessus, absolument rien.',
  [roomChoiceOutcomeKey('the-unsent', 'blank-page', 1)]:
    'Elle arrive comme une pause dans un pas de porte — quelqu\'un qui s\'arrête sans raison, se sentant accompagné pendant quatre secondes inexplicables. C\'est toute la remise.',
  [roomExplanationKey('the-unsent', 0)]:
    'Les recherches sur l\'écriture expressive, dans la tradition initiée par James Pennebaker, trouvent un bénéfice constant à écrire sur des expériences difficiles, même quand cette écriture n\'est jamais lue par personne d\'autre — l\'effet mesuré retombe sur celui ou celle qui écrit, pas sur le destinataire. Cette pièce prend cette découverte au pied de la lettre : la lettre compte pour ce que le fait de l\'écrire te fait, à toi, et la « clôture », ici, est traitée honnêtement comme quelque chose de fabriqué par l\'acte d\'écrire, et non comme quelque chose qui attendrait, tout fait, à la fin.',
  [roomNoteTitleKey('the-unsent')]: 'La lettre qui arrive quand même',
  [roomNoteThinkersKey('the-unsent')]: 'recherches sur l\'écriture expressive (tradition Pennebaker)',
  [roomNoteBodyKey('the-unsent')]:
    'Des décennies d\'études de Pennebaker sur l\'écriture expressive ont découvert quelque chose que le folklore autour de la « clôture » a généralement à l\'envers : écrire une lettre jamais envoyée à quelqu\'un bénéficie de manière mesurable au bien-être de celui ou celle qui écrit, que la lettre soit un jour lue ou non, et souvent même que le destinataire soit encore en vie pour la lire ou non. **La clôture, selon cette recherche, est fabriquée par l\'écriture elle-même — et non découverte en obtenant enfin une réponse.** L\'adresse précise compte moins que l\'acte d\'écrire quelque chose de vrai et de complet, et de le laisser se terminer. Cette note de terrain s\'écrit toute seule — l\'entrée du codex, c\'est le message que tu as réellement choisi d\'envoyer.',
});
register(roomChoiceOutcomeKey('the-unsent', 'to-your-16-year-old-self', 0), 'v2', 'fr', (s: RunState) => {
  const first = s.transcript.find((t) => ACT1_ROOM_IDS.includes(t.roomId));
  return first
    ? `Dans la fente à lettres, et quatre étages plus bas, jusqu'au rez-de-chaussée. Elle arrive en citant une chose que tu as vraiment dite, à l'époque — « ${first.choiceText} » — relue avec une tendresse que tes seize ans n'ont jamais eu l'occasion d'entendre.`
    : 'Dans la fente à lettres, et quatre étages plus bas, jusqu\'au rez-de-chaussée. Elle arrive comme la phrase exacte dont chaque adulte de cet hôtel avait besoin à seize ans, écrite par la seule personne qualifiée pour l\'écrire.';
});

// ---------- The Morning Desk ----------
registerAll('v2', 'fr', {
  // stage0 beats 2/3/4, its some-rooms-i-wasnt-present-in outcome0, and
  // stage1 beat4 are function beats — registered below via register().
  [roomBeatKey('the-morning-desk', 0, 0)]:
    'Le hall à nouveau, l\'aube derrière les portes. Le Portier a ton dossier ouvert sur le comptoir. Il est plus épais que dans ton souvenir de l\'avoir rempli.',
  [roomBeatKey('the-morning-desk', 0, 1)]:
    'Le Portier : « Bonjour. Avant de pouvoir te laisser sortir, ou te garder ici, je mène un court entretien. Pas un test. Un audit. Tu as passé ce séjour à répondre à des pièces. Je m\'informe, maintenant, des réponses. »',
  [roomBeatKey('the-morning-desk', 0, 5)]: 'Le Portier : « Prends ton temps pour la dernière. Tout ce que tu as choisi à ces étages — l\'assumes-tu ? »',
  [roomChoiceTextKey('the-morning-desk', 'stand-by-all')]: '« Oui. Tout. J\'ai choisi ce que j\'ai choisi, et je le signerais à nouveau. »',
  [roomChoiceHintKey('the-morning-desk', 'stand-by-all')]: 'La constance, assumée',
  [roomChoiceOutcomeKey('the-morning-desk', 'stand-by-all', 0)]:
    'Le Portier : « La constance. Plus rare qu\'elle ne le prétend — la plupart des clients renient au moins une pièce au moment où on le leur demande vraiment. Tu as gardé tout le registre, y compris les entrées qui t\'ont coûté cher. »',
  [roomChoiceOutcomeKey('the-morning-desk', 'stand-by-all', 1)]:
    'Le Portier : « Je remarque, sans cruauté, qu\'un registre entièrement signé peut être de l\'intégrité, ou une armure. De ce côté-ci du comptoir, les deux sont identiques. Tu apprendras lequel c\'était, plus tard, à une heure imprévue. Les clients l\'apprennent toujours. »',
  [roomChoiceTextKey('the-morning-desk', 'name-what-changed-me')]: '« Non — pas tout. Je peux te dire exactement ce qui m\'a changé, et où. »',
  [roomChoiceHintKey('the-morning-desk', 'name-what-changed-me')]: 'La croissance, nommée et assumée',
  [roomChoiceOutcomeKey('the-morning-desk', 'name-what-changed-me', 0)]:
    'Tu nommes la pièce. Celle-là, précisément. Pas une humeur — une raison : quelque chose qu\'un étage plus tardif a enseigné au plus précoce.',
  [roomChoiceOutcomeKey('the-morning-desk', 'name-what-changed-me', 1)]:
    'La main du Portier, sur le registre, s\'immobilise — et pour la première fois de toute la nuit, tu remarques l\'alliance à sa main droite, et la ligne pâle, non hâlée, là où une bague se trouvait autrefois, à sa gauche. « C\'est la réponse pour laquelle j\'existe », dit-il, sans lever les yeux. « La révision, avec preuves à l\'appui. Plus rare, et meilleure, que la constance. »',
  [roomChoiceTextKey('the-morning-desk', 'some-rooms-i-wasnt-present-in')]:
    '« Certaines choses, je me souviens à peine de les avoir choisies. Je n\'étais pas pleinement présent pour une partie de tout ça. »',
  [roomChoiceHintKey('the-morning-desk', 'some-rooms-i-wasnt-present-in')]: 'Le vide honnête',
  [roomChoiceOutcomeKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 1)]:
    'Le Portier : « Très bien. L\'entretien est terminé. Ce qui reste n\'est plus une question. C\'est un seuil. »',
  [roomExplanationKey('the-morning-desk', 0)]:
    'Avant que le seuil ne s\'ouvre, le Portier passe en revue tout le séjour et demande si tu l\'assumes toujours — non pour te noter, mais pour voir si tu es honnête envers ta propre histoire. La vraie question, en dessous : est-il plus admirable de rester parfaitement cohérent avec chaque choix que tu as jamais fait, ou de dire simplement, « je me suis trompé, et voici exactement ce qui m\'a fait changer d\'avis » ? Les recherches sur l\'identité narrative traitent le soi comme une histoire en révision continue et honnête — le but n\'a jamais été d\'arriver au comptoir inchangé.',
  [roomBeatKey('the-morning-desk', 1, 0)]:
    'La grille — ou quoi que ce fût, un comptoir, un miroir, une personne — s\'apaise, et les portes du hall s\'ouvrent sur une lumière qui n\'est pas celle de l\'hôtel.',
  [roomBeatKey('the-morning-desk', 1, 1)]:
    'C\'est le matin, dehors. Un vrai : une circulation quelque part, une bouilloire quelque part, les affaires ordinaires et immenses de quelqu\'un, à trois pas.',
  [roomBeatKey('the-morning-desk', 1, 2)]:
    'Le Portier : « Terminus. Ou point de départ — ça dépend du sens dans lequel on le lit. Le seuil te ramène vers le bruit, les visages, les disputes inachevées, tout ça. La plupart des clients le prennent. C\'est une bonne porte. Je l\'entretiens bien. »',
  [roomBeatKey('the-morning-desk', 1, 3)]:
    'Le Portier : « Mais ce n\'est pas la seule qui te soit ouverte, et je suis tenu de le dire. Tu peux rester — les pièces ont toujours besoin d\'un gardien, et je fais ce métier depuis très longtemps. Ou tu peux t\'allonger ici, au seuil, et laisser le reste de cette nuit s\'achever, doucement. Certains clients, à la fin, choisissent le silence. Ce n\'est pas à moi de dire que c\'est perdre. »',
  [roomChoiceTextKey('the-morning-desk', 'walk-out')]: 'Sortir. Retour au matin, au bruit, au monde.',
  [roomChoiceHintKey('the-morning-desk', 'walk-out')]: 'Le retour',
  [roomChoiceOutcomeKey('the-morning-desk', 'walk-out', 0)]:
    'Tu avances vers la lumière. Le seuil a exactement la température d\'un pas de porte en été — ce demi-degré de différence qui signifie dehors.',
  [roomChoiceOutcomeKey('the-morning-desk', 'walk-out', 1)]:
    'Le Portier (te lançant, alors que tu t\'éloignes) : « Quoi que tu trouves là-dehors — c\'est la même conversation que tu as quittée. Ça n\'a jamais été la promesse. Toi, tu étais la rénovation. Attention à la marche. »',
  [roomChoiceTextKey('the-morning-desk', 'take-the-desk')]: 'Rester. Prendre le comptoir. Le poste du Portier est désormais le tien.',
  [roomChoiceHintKey('the-morning-desk', 'take-the-desk')]: 'Le marché du gardien',
  [roomChoiceOutcomeKey('the-morning-desk', 'take-the-desk', 0)]:
    'Tu te détournes du matin — vraiment te détourner, ce que le hall enregistre comme une sorte de souffle retenu — et tu tends la main vers le registre.',
  [roomChoiceOutcomeKey('the-morning-desk', 'take-the-desk', 1)]:
    'Le Portier (ne le lui tendant pas encore) : « Sois-en certain. Les heures sont éternelles, le salaire n\'est rien, et les clients sont — eh bien, tu en as été un. Tu les regarderas, chacun d\'entre eux, affronter le téléphone, le couloir, la table, et tu ne pourras peut-être jamais leur donner les réponses, principalement parce qu\'il n\'y en a aucune. »',
  [roomChoiceOutcomeKey('the-morning-desk', 'take-the-desk', 2)]:
    'Le Portier (le lui tendant enfin — le registre chaud, ton nom soudain lisible dedans) : « … Bienvenue au comptoir. Première leçon : la bague et la marque pâle font exactement la même taille. C\'est voulu. Tout, ici, l\'est. »',
  [roomChoiceTextKey('the-morning-desk', 'stop-carrying-it')]: 'T\'allonger au seuil. Laisser tout s\'achever, doucement, à tes propres conditions.',
  [roomChoiceHintKey('the-morning-desk', 'stop-carrying-it')]: 'Le silence',
  [roomChoiceOutcomeKey('the-morning-desk', 'stop-carrying-it', 0)]:
    'Tu t\'allonges, le matin à trois pas, et ce n\'est pas une défaite — le Portier le sait, le hall le sait. C\'est un choix, fait les yeux grands ouverts, par quelqu\'un qui a parcouru chaque étage pour mériter le droit de le faire.',
  [roomChoiceOutcomeKey('the-morning-desk', 'stop-carrying-it', 1)]:
    'Le Portier (s\'asseyant à tes côtés, posant le registre) : « Alors je resterai jusqu\'à ce que ce soit fini. Aucun client ne se dissout seul pendant mon service. Ce n\'est pas une fin, tu sais. C\'est une marée. »',
  [roomChoiceTextKey('the-morning-desk', 'laughing-door')]: 'La petite porte. Les rires. L\'ouvrir.',
  [roomChoiceHintKey('the-morning-desk', 'laughing-door')]: 'Tu as mérité de la remarquer',
  [roomChoiceOutcomeKey('the-morning-desk', 'laughing-door', 0)]:
    'Tu traverses jusqu\'à la petite porte ordinaire, et la poignée tourne avant même que tu ne l\'aies vraiment saisie, comme un ami qui ouvre de l\'autre côté.',
  [roomChoiceOutcomeKey('the-morning-desk', 'laughing-door', 1)]:
    'Le Portier (derrière toi, et pour une fois sa voix ne porte ni la bague ni son absence) : « Très peu de clients remarquent jamais cette porte. Encore moins l\'ouvrent. Vas-y, alors. Je m\'occupe des lumières. »',
  [roomChoiceTextKey('the-morning-desk', 'i-know-every-room')]: '« Je connais chaque pièce. »',
  [roomChoiceHintKey('the-morning-desk', 'i-know-every-room')]: 'Pas une porte — une phrase',
  [roomChoiceOutcomeKey('the-morning-desk', 'i-know-every-room', 0)]:
    'Tu ne t\'avances vers aucune des portes. Tu le dis à la place, de la façon dont on énoncerait un fait plutôt qu\'un vœu — et le dire, c\'est déjà presque tout ce qui se passe.',
  [roomChoiceOutcomeKey('the-morning-desk', 'i-know-every-room', 1)]: 'Le Portier devient très immobile, une main sur le registre, et ne finit pas de le refermer.',
  [roomExplanationKey('the-morning-desk', 1)]:
    'Le seuil est ouvert, et le choix est enfin celui de la façon dont ce séjour se termine réellement : retourner à une vie ordinaire, rester pour aider le prochain client, ou te laisser te reposer complètement. Aucune de ces options n\'est la fin correcte — chacune est une réponse différente, également honnête, à ce que tu veux vraiment, là, maintenant, après tout ce qui s\'est passé à ces étages.',
  [roomNoteTitleKey('the-morning-desk')]: 'Le dossier relu à voix haute',
  [roomNoteThinkersKey('the-morning-desk')]: 'recherches sur l\'identité narrative (tradition McAdams) · le registre de l\'hôtel lui-même',
  [roomNoteBodyKey('the-morning-desk')]:
    'Les chercheurs en identité narrative — Dan McAdams en premier lieu — traitent le soi non pas comme une chose fixe, mais comme une histoire en écriture continue et active : qui tu es, c\'est essentiellement le récit que tu fais de la façon dont tu es arrivé jusqu\'ici, et ce récit continue d\'être révisé à mesure que tu avances dans ta vie. Les relations, dans cette perspective, sont des récits coécrits, et la compétence que tout cet hôtel a enseignée depuis le début, c\'est l\'audit lui-même : assumer le dossier complet, y compris les pages que tu préférerais avoir perdues ou réécrites. **Chaque étage que ce séjour a mis en scène — l\'accusé de lecture, le couloir, la table de cuisine — n\'était qu\'une seule et même question posée dans des pièces différentes : quand ton dossier te sera relu, la signature sera-t-elle la tienne ?**',
});
register(roomBeatKey('the-morning-desk', 0, 2), 'v2', 'fr', (s: RunState) => {
  const screenshot = ['tell-nadia', 'confront-tom', 'stay-out', 'verify-first'].find((id) => choseIn(s, 'the-screenshot', id));
  if (screenshot === 'tell-nadia')
    return 'Le Portier : « La capture d\'écran. Tu l\'as dit à Nadia, sans détour, et tu as laissé les retombées se poser où elles se sont posées — sur toi aussi, honnêtement. Assumes-tu cela, ici, alors que Tom et Nadia ont depuis longtemps quitté ce bâtiment tous les deux ? »';
  if (screenshot === 'confront-tom')
    return 'Le Portier : « La capture d\'écran. Tu as d\'abord laissé le choix à Tom, avec un délai. As-tu tenu ce délai, en fin de compte — et est-ce que ça compte encore, maintenant, que tu l\'aies fait ou non ? »';
  if (screenshot === 'stay-out')
    return 'Le Portier : « La capture d\'écran. Tu as dit que ce n\'était pas tes affaires, et tu l\'as effacée. Le secret, si je me souviens bien, est venu habiter chez toi à la place. Est-il toujours là ? »';
  if (screenshot === 'verify-first')
    return 'Le Portier : « La capture d\'écran. Tu as d\'abord vérifié, et perdu au passage la chance d\'être le premier avec la vérité. Un échange juste, ou pas — dis-le-moi. »';
  return 'Le Portier : « Tu n\'as jamais ouvert cette porte-là en particulier — celle avec la capture d\'écran dedans. Curieux. Laisse-moi te le demander franchement, sans mise en scène : le ou la partenaire d\'un ami, pris sur le fait, dans ta main, dans un téléphone qui n\'est pas le tien. Que fais-tu, réellement ? »';
});
register(roomBeatKey('the-morning-desk', 0, 3), 'v2', 'fr', (s: RunState) =>
  hasFlag(s, 'confessed-whole')
    ? 'Le Portier : « L\'aveu — fait, en entier, à la personne concernée. Ce genre d\'honnêteté est plus rare dans ce dossier que les clients aiment le croire. Assumes-tu le prix que ça lui a coûté, à elle ? »'
    : hasFlag(s, 'carried-alone')
      ? 'Le Portier : « L\'aveu — porté, seul, jusqu\'au bout. Une pièce en toi, à côté de laquelle cette personne vivra sans jamais y entrer. La clémence était-elle vraiment la sienne, ou seulement la tienne ? »'
      : hasFlag(s, 'trickle-truth')
        ? 'Le Portier : « L\'aveu — distillé, un peu plus vrai à chaque fois qu\'on l\'a remis en question. Le dossier montre chaque révision. Cette personne les aura toutes senties. »'
        : 'Le Portier : « Aucun aveu n\'apparaît nulle part dans ce dossier. Soit aucun n\'était dû, soit l\'un d\'eux, ce matin encore, reste à déposer. »',
);
register(roomBeatKey('the-morning-desk', 0, 4), 'v2', 'fr', (s: RunState) =>
  s.memoryLost
    ? 'Le Portier : « Le piège, à la Rumeur. Tu as appris ce qu\'elle avait fait, et ce que tendre un piège à quelqu\'un qu\'on aime fait de celui qui le tend. Il y a un trou dans ton dossier, là où vivait autrefois le non-savoir. Je le vois d\'ici. Est-ce que ça en valait la peine ? »'
    : 'Le Portier : « Pas de trou dans ce dossier — tu n\'as jamais échangé le non-savoir contre une certitude. Certains clients appellent ça de la confiance. D\'autres disent que ça veut simplement dire qu\'on n\'a jamais été testé assez durement pour en avoir besoin. Je ne rends aucun verdict. »',
);
register(roomChoiceOutcomeKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 0), 'v2', 'fr', (s: RunState) =>
  s.memoryLost
    ? 'Le Portier : « Dans ton cas, ce n\'est pas une esquive. C\'est de la documentation. Il y a en toi un vide véritable, en forme de piège, et les réponses qui y sont tombées ne sont pas reniées — simplement non témoignées. J\'accepte les vides qui ont été payés. Le tien a un reçu. »'
    : 'Le Portier : « Hm. Ton dossier ne montre aucun piège, aucun vide — tous les souvenirs sont présents ; ce qui manque, c\'est la volonté de te tenir à côté d\'eux. "Je n\'étais pas présent", venant d\'un dossier intact, c\'est un brouillard commode. Je laisse passer. Je suis un comptoir, pas un juge. Mais nous avons entendu la même chose, tous les deux. »',
);
register(roomBeatKey('the-morning-desk', 1, 4), 'v2', 'fr', (s: RunState) =>
  mirrorUnlocked(s)
    ? 'Et il y a — tu ne le remarques que maintenant, et tu comprends que tout le monde n\'a pas cette chance — une quatrième porte. Petite. Ordinaire. Derrière elle : deux tasses qu\'on remplit, et un rire qui ressemble, sans le moindre doute, exactement au tien.'
    : 'Quelque part sur le côté, tu remarques à demi une petite porte ordinaire dont tu es à peu près sûr qu\'elle n\'était pas dans le hall à ton arrivée. Elle est verrouillée. Derrière elle, faiblement : des rires. Le Portier suit ton regard. « Pas cette fois », dit-il, doucement — à la fois un verdict et une invitation à revenir.',
);
