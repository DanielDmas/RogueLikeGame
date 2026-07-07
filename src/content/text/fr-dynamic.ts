// The v2 beats that are functions of RunState (state-reactive callbacks),
// translated by hand alongside their string siblings in fr-rooms-actN.ts —
// scripts/extract-v2.ts only lifts plain strings, so these can't be
// auto-extracted. Branching logic mirrors the English source exactly.
import { register, t } from './resolver';
import { choseIn, choseInPrior, hasFlag, pickExhibitEntry, pickShadowMoments, pickUnchosenRooms } from '../../engine/gameState';
import { punchlineUnlocked } from '../../engine/endings';
import type { RunState } from '../schema';
import { roomBeatKey, roomChoiceOutcomeKey, roomChoiceTextKey, roomTitleKey, endingTitleKey } from './keys';
import { ROOM_TITLE_BY_ID, ENDING_TITLE_BY_ID } from '../rooms/understory';

/** French mirror of act3.ts's SHADOW_FALLBACK, index-aligned. */
const CAVE_SHADOW_FALLBACK_FR: string[] = [
  'Une ombre tend la main vers un levier qu\'elle ne tirera jamais tout à fait, figée en pleine décision, pour toujours presque.',
  'Une ombre est assise à un chevet qui n\'est plus là, disant quelque chose que le feu avale avant que cela n\'atteigne le mur.',
  'Une ombre se tient sur un seuil, une main à moitié levée — pas tout à fait un salut, pas tout à fait un refus — et tient cette forme très longtemps.',
];

for (const index of [0, 1, 2] as const) {
  register(roomBeatKey('the-cave', 0, 2 + index), 'v2', 'fr', (s: RunState) => {
    const entry = pickShadowMoments(s.prior)[index];
    if (!entry) return CAVE_SHADOW_FALLBACK_FR[index];
    const choice = t(roomChoiceTextKey(entry.roomId, entry.choiceId), entry.choiceText);
    return `Sur le mur, une ombre répète un choix déjà fait, exactement comme vous l\'avez fait : « ${choice} »`;
  });
}

register(roomBeatKey('junction', 1, 3), 'v2', 'fr', (s: RunState) =>
  choseIn(s, 'junction', 'pull')
    ? 'Le Placeur : La dernière fois, vous avez tiré le levier — un pour cinq, avez-vous dit. Voici le même marché, plus près de la peau. Voyons si l\'arithmétique survit au contact.'
    : choseIn(s, 'junction', 'no-pull')
      ? 'Le Placeur : Vous avez gardé les mains loin du levier. Je suis curieux de voir si le pont change quelque chose. Généralement, oui. Le fait que ça change quelque chose est en soi l\'énigme.'
      : 'Le Placeur : La dernière fois, vous avez appelé ça stupide. Le tramway a quand même arrangé un second acte. Votre opinion sur la prémisse ne l\'intéresse pas.',
);

register(roomChoiceOutcomeKey('junction', 'push', 1), 'v2', 'fr', (s: RunState) =>
  choseIn(s, 'junction', 'pull')
    ? 'Le Placeur : Le levier et le pont, les deux. Quoi que ce soit d\'autre soit vrai, cette arithmétique va jusqu\'au fond de vous. Si c\'est de l\'intégrité ou une étiquette d\'avertissement, je vous laisse en décider.'
    : 'Le Placeur : Non, au levier. Oui, sur le pont. C\'est une posture rare. Asseyez-vous avec elle un moment — peut-être ne l\'avez-vous pas choisie exprès.',
);

register(roomChoiceOutcomeKey('junction', 'no-push', 1), 'v2', 'fr', (s: RunState) =>
  choseIn(s, 'junction', 'pull')
    ? 'Le Placeur : Donc — tirer le levier, mais épargner la poussée. Cinq pour un à longueur de bras, pas à longueur de main. Cette asymétrie occupe des départements de philosophie depuis un demi-siècle. Si c\'est de la sagesse dans votre colonne vertébrale ou simplement de la sensibilité, je ne saurais dire.'
    : 'Le Placeur : Refus cohérent. Le tramway en a pris dix, à travers deux pièces, et vos mains n\'en ont pris aucun. Il y a un nom pour votre position. Il est controversé. Vous le tenez fermement.',
);

register(roomBeatKey('ship', 0, 4), 'v2', 'fr', (s: RunState) =>
  s.memoryLost
    ? 'Une planche vers laquelle ils tendent la main n\'est tout simplement pas là — un vide aux bords brûlés, où une photographie ancrait autrefois quelque chose. Les artisans se consultent, haussent les épaules, et posent une planche vide dans le vide. L\'assemblage dans le coin a le même trou. Il touche le vide au même instant que vous.'
    : 'Les artisans travaillent selon un inventaire, et cet inventaire est, remarquez-vous, un album photo. Chaque planche a son image. Chaque image a un témoin. L\'assemblage dans le coin vérifie aussi l\'album et hoche la tête aux mêmes pages.',
);

register(roomBeatKey('teleporter', 0, 3), 'v2', 'fr', (s: RunState) =>
  choseIn(s, 'ship', 'pattern')
    ? 'Vous vous souvenez de l\'atelier — vous avez voté pour le motif, les planches réassemblées. La cabine est, en un sens, votre propre position avec des portes dessus. C\'est une chose de tenir une opinion. C\'en est une autre d\'y entrer.'
    : choseIn(s, 'ship', 'neither')
      ? 'Vous vous souvenez de l\'atelier — « moi n\'a jamais été une chose qui persiste », vous êtes-vous dit à vous-même, deux fois. La cabine a apparemment lu votre dossier. Elle bourdonne comme pour dire : prouvez-le.'
      : 'Quelque part derrière vous, dans un atelier qui sentait le cèdre, des artisans se disputent probablement encore à propos de planches. La cabine est la même dispute, reformulée en plomberie.',
);

register(roomBeatKey('door-that-asks', 0, 2), 'v2', 'fr', (s: RunState) =>
  hasFlag(s, 'pulled-lever') || hasFlag(s, 'kept-lever') || hasFlag(s, 'refused-once')
    ? hasFlag(s, 'pulled-lever')
      ? 'LA PORTE : À la Jonction, vous avez tiré le levier — une vie dépensée pour en garder cinq. L\'arithmétique plutôt que l\'abstention. Y tenez-vous toujours, ici, à la fin, alors que le tramway est parti depuis longtemps et qu\'aucune réponse n\'a plus rien à gagner ?'
      : hasFlag(s, 'kept-lever')
        ? 'LA PORTE : À la Jonction, vous avez gardé vos mains loin du levier — cinq perdus, aucun d\'eux à vous à dépenser. Y tenez-vous toujours, ici, à la fin, où personne ne regarde et où les mannequins sont tous rentrés chez eux ?'
        : 'LA PORTE : À la Jonction, vous avez refusé la question elle-même — l\'avez qualifiée de stupide, avez rejeté la prémisse. Je ne juge pas. Je demande simplement : maintenant que vous êtes ici, le refus était-il une position, ou un sursaut ?'
    : 'LA PORTE : Vous n\'avez jamais atteint la Jonction ; le tramway a roulé sans vous. Curieux. Alors laissez-moi le demander franchement, sans mise en scène : cinq inconnus ou un, et votre main sur le levier — savez-vous, même maintenant, ce que vous feriez ?',
);

register(roomBeatKey('door-that-asks', 0, 3), 'v2', 'fr', (s: RunState) =>
  s.memoryLost
    ? 'LA PORTE : Dans le feu, vous avez laissé la photographie brûler. La preuve de qui vous étiez, échangée. Il y a un trou dans votre dossier là où elle se trouvait — je peux le voir d\'ici. Est-ce que ça en valait la peine ?'
    : hasFlag(s, 'saved-photo')
      ? 'LA PORTE : Dans le feu, vous avez sauvé la photographie. La toux derrière l\'autre porte s\'est arrêtée, et vous avez emporté votre preuve dehors en passant devant. Elle est dans votre poche maintenant. Est-ce que ça en valait la peine ?'
      : 'LA PORTE : Vous portez votre passé intact — aucun feu n\'a pris quoi que ce soit que vous n\'ayez pas vous-même remis. Un dossier silencieux. Parfois, les silencieux n\'ont simplement pas encore reçu la bonne question. Considérez-vous comme interrogé : qu\'auriez-vous laissé brûler ?',
);

register(roomChoiceOutcomeKey('door-that-asks', 'dont-remember', 0), 'v2', 'fr', (s: RunState) =>
  s.memoryLost
    ? 'LA PORTE : Dans votre cas, ce n\'est pas une esquive — c\'est de la documentation. Il y a un véritable trou en vous, en forme de feu, et les réponses qui y sont tombées ne sont pas reniées, simplement sans témoin. J\'accepte les vides qui ont été payés. Le vôtre a un reçu.'
    : 'LA PORTE : Hum. Votre dossier ne montre aucun feu, aucun trou — les souvenirs sont tous présents ; ce qui manque, c\'est la volonté de se tenir à côté d\'eux. « Je ne me souviens pas » venant d\'une archive intacte est un brouillard commode. Je vais laisser passer — je suis une porte, pas un juge — mais nous l\'avons tous deux entendu.',
);

register(roomBeatKey('door-that-asks', 1, 4), 'v2', 'fr', (s: RunState) =>
  punchlineUnlocked(s)
    ? 'Et il y a — vous ne le remarquez que maintenant, et vous comprenez que tout le monde n\'a pas le droit de le remarquer — une quatrième porte. Petite. Simple. Une lumière chaude en dessous, et de derrière, indéniablement : des rires. Le Placeur suit votre regard et ne dit rien du tout, ce qui, de la part du Placeur, équivaut à une ovation debout.'
    : 'Quelque part sur le côté, vous remarquez à moitié une petite porte simple dont vous êtes assez sûr qu\'elle n\'a jamais figuré sur les plans. Elle est verrouillée. De derrière, très faiblement : des rires. Le Placeur suit votre regard. « Pas cette fois », dit-il doucement, et c\'est à la fois, d\'une certaine manière, un verdict et une invitation à revenir.',
);

// ---------- Act V (l'Understory) beats dynamiques ----------

register(roomBeatKey('the-archive', 0, 3), 'v2', 'fr', (s: RunState) => {
  const entry = pickExhibitEntry(s.prior?.transcript ?? []);
  if (!entry) {
    return 'La carte dans la boîte ouverte est vide, tachée d\'eau à un coin — quoi que cette boîte ait autrefois contenu n\'a pas survécu au voyage vers le bas. Le reste de l\'étagère est au moins lisible.';
  }
  const choice = t(roomChoiceTextKey(entry.roomId, entry.choiceId), entry.choiceText);
  return `La carte se lit, de votre propre main : « ${choice} » Aucun commentaire supplémentaire. L\'établissement ne commente pas. Il ne fait que garder.`;
});

register(roomBeatKey('the-unchosen', 0, 2), 'v2', 'fr', (s: RunState) => {
  const { candidates } = pickUnchosenRooms(s.prior);
  if (candidates.length === 0) {
    return 'Le couloir est étrangement nu ce soir — chaque porte que vous auriez pu manquer, vous ne l\'avez apparemment pas manquée. Ou le registre n\'a simplement pas survécu au voyage vers le bas. L\'établissement ne dit pas laquelle des deux.';
  }
  const titles = candidates.map((id) => t(roomTitleKey(id), ROOM_TITLE_BY_ID[id] ?? id));
  return `Trois attirent d\'abord votre regard : ${titles.join(', ')}. Vous ne vous souvenez d\'aucune d\'elles s\'ouvrant. Vous êtes assez sûr, maintenant, qu\'au moins l\'une d\'elles vous a été offerte — et que vous êtes simplement passé devant.`;
});

register(roomBeatKey('the-unchosen', 0, 3), 'v2', 'fr', (s: RunState) => {
  const { opens } = pickUnchosenRooms(s.prior);
  if (!opens) {
    return 'Aucune porte unique ne se distingue ce soir. Le couloir reste exactement, entièrement fermé, et d\'une certaine manière c\'est sa propre réponse.';
  }
  const title = t(roomTitleKey(opens), ROOM_TITLE_BY_ID[opens] ?? opens);
  return `Une porte, près de la fin du couloir, s\'ouvre d\'elle-même le reste du chemin — ${title}. Quoi qui attendait derrière, attend, à l\'évidence, encore.`;
});

register(roomChoiceOutcomeKey('the-unchosen', 'enter-it', 0), 'v2', 'fr', (s: RunState) => {
  const { opens } = pickUnchosenRooms(s.prior);
  const title = opens ? t(roomTitleKey(opens), ROOM_TITLE_BY_ID[opens] ?? opens) : 'la pièce';
  return `Vous entrez dans ${title} — ou ce qu\'il en reste. Pas de feu, pas de voix de l\'établissement en attente, pas de dilemme en plein milieu d\'une phrase. Juste une pièce, meublée, un peu poussiéreuse, ne faisant rien de particulier.`;
});

register(roomBeatKey('the-echo', 0, 2), 'v2', 'fr', (s: RunState) => {
  const moments = pickShadowMoments(s.prior);
  if (moments.length === 0) {
    return 'L\'autre chaise ne dit rien. Cette fois, il n\'y a rien d\'enregistré à partir de quoi assembler une voix — et la pièce, à son honneur, ne prétend pas le contraire.';
  }
  const lines = moments.map((e) => `« ${t(roomChoiceTextKey(e.roomId, e.choiceId), e.choiceText)} »`).join(' Puis : ');
  return `Elle vous répète deux ou trois de vos propres phrases, dans votre propre cadence, dans l\'ordre : ${lines}`;
});

register(roomBeatKey('the-echo', 0, 3), 'v2', 'fr', (s: RunState) => {
  if (choseInPrior(s.prior, 'junction', 'push')) {
    return 'Elle se souvient aussi du pont — la version de vous qui a poussé. « De la cohérence, avec des mains », dit-elle, se citant elle-même avec une sorte de fierté mélancolique.';
  }
  if (choseInPrior(s.prior, 'junction', 'no-push')) {
    return 'Elle se souvient aussi du pont — la version de vous qui n\'a pas poussé. « Certains moyens ne sont jamais de simples moyens », dit-elle, et pour une fois, elle n\'a pas l\'air d\'argumenter.';
  }
  return 'Elle ne mentionne pas le pont. Soit vous ne l\'avez jamais atteint, soit ce n\'était pas la partie de vous qui avait besoin d\'être dite à voix haute ce soir.';
});

register(roomBeatKey('the-echo', 0, 4), 'v2', 'fr', (s: RunState) => {
  const id = s.prior?.endingId;
  if (!id) return 'Elle ne sait pas comment vous êtes parti, la dernière fois. Certaines choses, apparemment, la pièce ne les garde pas non plus.';
  const title = t(endingTitleKey(id), ENDING_TITLE_BY_ID[id] ?? id);
  return `Elle sait aussi comment vous êtes parti — ni fière ni honteuse, ce qui est en quelque sorte pire que les deux. « ${title} », dit-elle, une fois, platement, et ne se répète pas.`;
});
