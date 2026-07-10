// French translation of the v2 room prose (beats, choice text/hint/outcome,
// field notes, explanations) for Act V, The Understory. Registered under
// version 'v2'. Translated from the English v2 source directly, per
// CLAUDE.md's context-first rule. State-reactive (dynamic) beats live in
// fr-dynamic.ts: the-archive stage0 beat 3, the-unchosen stage0 beats 2/3
// and choice 'enter-it' outcome 0, the-echo stage0 beats 2/3/4.
import { registerAll } from '../../engine/text/resolver';
import {
  roomBeatKey,
  roomChoiceHintKey,
  roomChoiceOutcomeKey,
  roomChoiceTextKey,
  roomExplanationKey,
  roomNoteBodyKey,
  roomNoteThinkersKey,
  roomNoteTitleKey,
} from '../../engine/text/keys';

// ---------- Act V: The Archive ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-archive', 0, 0)]: 'Un escalier qui n\'a aucune raison d\'exister ici, descendant vers une pièce longue et basse tapissée de boîtes grises identiques — tout un mur d\'entre elles, chacune étiquetée d\'une écriture trop soignée pour appartenir à quiconque d\'autre que l\'établissement lui-même.',
  [roomBeatKey('the-archive', 0, 1)]: 'Une étagère porte une seule boîte plus récente : la vôtre. Elle est étiquetée d\'une date que vous reconnaissez comme une fin, et dessous, en plus petits caractères : COMPLET. CLASSÉ. NON OUBLIÉ.',
  [roomBeatKey('the-archive', 0, 2)]: 'Sur la table de lecture à côté, une boîte est déjà ouverte — quelqu\'un, ou quelque chose, a choisi cela avant votre arrivée — et à l\'intérieur, une carte, tapée, citant un unique moment de la traversée que vous avez déjà terminée.',
  [roomBeatKey('the-archive', 0, 4)]: 'Agrafé à la boîte, un formulaire d\'admission porte encore la description que vous avez autrefois donnée de vous-même : « {blurb} » L\'établissement l\'a classé sans commentaire, ce qui est soit du respect, soit une erreur de classement ; les deux se ressemblent d\'ici.',
  [roomBeatKey('the-archive', 0, 5)]: 'Le Placeur : (depuis l\'embrasure, chapeau sous le bras) Je ne descends pas souvent ici. Ce n\'est pas interdit — rien ici n\'est interdit — c\'est simplement que la plupart des voyageurs ne veulent visiter qu\'une seule fois, si tant est. L\'archive s\'en moque, dans un sens comme dans l\'autre. Elle n\'a nulle part ailleurs où être.',
  [roomChoiceTextKey('the-archive', 'stand-by-it')]: '« C\'était moi. Je l\'assume — tout cela. » Signez la carte vous-même, sous le texte imprimé.',
  [roomChoiceHintKey('the-archive', 'stand-by-it')]: 'Assumez-le — le genre de signature le plus difficile.',
  [roomChoiceOutcomeKey('the-archive', 'stand-by-it', 0)]: 'Vous prenez le stylo enchaîné à l\'étagère et signez sous la ligne tapée, de votre propre main, que la boîte semblait attendre.',
  [roomChoiceOutcomeKey('the-archive', 'stand-by-it', 1)]: 'Le Placeur : Tous les voyageurs ne signent pas. La plupart lisent la carte, tressaillent, et reculent comme si l\'encre pouvait encore être assez fraîche pour changer. Vous avez ajouté votre nom à une décision déjà survenue. Je ne sais pas ce que cela coûte. Je sais que ce n\'est pas rien.',
  [roomChoiceTextKey('the-archive', 'disown-it')]: '« Ça ne me ressemble plus. » Laissez la carte non signée, et reculez de la boîte.',
  [roomChoiceHintKey('the-archive', 'disown-it')]: 'Laissez la distance être réelle, pas seulement confortable.',
  [roomChoiceOutcomeKey('the-archive', 'disown-it', 0)]: 'Vous laissez la carte exactement telle que vous l\'avez trouvée et faites un pas complet en arrière depuis l\'étagère, comme vous reculeriez devant un étranger qui porte par hasard votre taille de manteau.',
  [roomChoiceOutcomeKey('the-archive', 'disown-it', 1)]: 'Le Placeur : Le registre ne discute pas avec vous. Il le fait rarement. Il ne garde que ce qui est arrivé, classé sous la date à laquelle c\'est arrivé — que la main qui l\'a fait réponde encore ou non à votre nom.',
  [roomChoiceTextKey('the-archive', 'refile-it')]: 'Refermez la boîte doucement, sans commentaire dans un sens ou l\'autre, et remettez-la à sa place sur l\'étagère.',
  [roomChoiceHintKey('the-archive', 'refile-it')]: 'Ni la défendre ni la nier. La classer.',
  [roomChoiceOutcomeKey('the-archive', 'refile-it', 0)]: 'Vous refermez le couvercle, soigneusement, comme vous fermeriez un livre en plein milieu d\'une phrase par respect pour un chapitre plutôt que par accord avec lui, et le remettez à sa place parmi tous les autres.',
  [roomChoiceOutcomeKey('the-archive', 'refile-it', 1)]: 'Le Placeur : C\'est, je pense, le véritable but de l\'étagère. Pas un verdict dans un sens ou l\'autre — un endroit où poser quelque chose sans avoir besoin d\'avoir fini de décider ce que c\'était.',
  [roomChoiceTextKey('the-archive', 'pin-the-corner')]: 'Épinglez le coin non brûlé de la photographie au bord de la boîte ouverte — un amendement au registre.',
  [roomChoiceHintKey('the-archive', 'pin-the-corner')]: 'Ajoutez au dossier, plutôt que de le signer ou de le refuser.',
  [roomChoiceOutcomeKey('the-archive', 'pin-the-corner', 0)]: 'Vous pressez le petit coin déchiré contre la carte avec votre pouce jusqu\'à ce qu\'il tienne, un amendement que personne ne vous a demandé de faire et que personne ne vous demandera de justifier.',
  [roomChoiceOutcomeKey('the-archive', 'pin-the-corner', 1)]: 'L\'archive l\'accepte exactement comme les archives acceptent tout — sans commentaire, sans objection, et, remarquez-vous, sans jamais en avoir besoin.',
  [roomExplanationKey('the-archive', 0)]: 'On vous montre un enregistrement classé et daté d\'un choix que vous avez fait lors de votre dernier voyage à travers cet endroit, relu froidement, sans aucun contexte qui le rendait raisonnable sur le moment. Y tenez-vous toujours, prenez-vous vos distances, ou acceptez-vous simplement que c\'est arrivé sans le juger complètement dans un sens ou l\'autre ? Il s\'agit de la façon dont nous nous rapportons à nos propres erreurs ou décisions passées une fois que le temps a passé — comme lire une vieille entrée de journal ou un vieux texto que vous avez envoyé, sans être totalement sûr que la personne qui l\'a écrit et la personne qui le lit maintenant sont tout à fait la même.',
  [roomNoteTitleKey('the-archive')]: 'Sur la tenue de registres',
  [roomNoteThinkersKey('the-archive')]: 'Paul Ricœur (1990), identité narrative',
  [roomNoteBodyKey('the-archive')]: 'Paul Ricœur a soutenu qu\'un moi n\'est pas une chose que l\'on localise par introspection — c\'est un récit que l\'on continue de composer, révisant l\'intrigue sans jamais finir le livre. Il a appelé cela l\'identité narrative : contrairement à un simple objet, dont l\'identité réside dans le fait de ne jamais changer, l\'identité d\'un moi réside dans sa capacité à changer tout en l\'appelant toujours la même histoire. Cette pièce met en scène la confrontation que la théorie de Ricœur était construite pour survivre : un acte spécifique, daté, classé, relu froidement, sans les chapitres environnants qui le rendaient inévitable sur le moment. L\'assumer, le renier, et le classer sans verdict sont trois relations différentes à la paternité — et la propre réponse de Ricœur se situe plus près de la troisième que de l\'une ou l\'autre des deux premières. **Vous n\'êtes pas obligé d\'approuver encore chaque phrase que vous avez écrite. Seulement d\'admettre que vous êtes celui qui tient encore le stylo.**',
});

// ---------- Act V: The Unchosen ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-unchosen', 0, 0)]: 'Un couloir que vous ne vous souvenez pas d\'avoir traversé, bordé de portes légèrement entrouvertes — non pas engageantes. Simplement ouvertes, comme une porte reste ouverte quand personne ne s\'est donné la peine de la fermer depuis très longtemps.',
  [roomBeatKey('the-unchosen', 0, 1)]: 'Ce sont les portes de votre dernière traversée d\'ici que vous n\'avez jamais franchies. L\'établissement les a gardées exactement telles que vous les avez laissées : jamais entrées, indécises, techniquement toujours disponibles, de la manière spécifique dont un train manqué reste, techniquement, un train.',
  [roomBeatKey('the-unchosen', 0, 4)]: 'Le Placeur : Je ne lirais pas trop dans le choix. Ou je le ferais, entièrement — je n\'ai jamais réussi à décider quel conseil est le pire.',
  [roomChoiceTextKey('the-unchosen', 'enter-it')]: 'Poussez-la le reste du chemin. Entrez.',
  [roomChoiceHintKey('the-unchosen', 'enter-it')]: 'La curiosité, honorée tardivement.',
  [roomChoiceOutcomeKey('the-unchosen', 'enter-it', 1)]: 'Quoi qu\'il allait se passer ici est probablement déjà arrivé, à quelqu\'un, ou à personne, ou la question a simplement expiré comme un courrier non ouvert finit par cesser d\'être urgent. C\'est plus petit que ce que vous en aviez fait dans votre tête. La plupart des choses non vécues le sont.',
  [roomChoiceOutcomeKey('the-unchosen', 'enter-it', 2)]: 'Le Placeur : C\'est le taux courant sur une porte laissée fermée. Pas une tragédie — juste une pièce, attendant au-delà de sa propre occasion. Certains voyageurs trouvent cela un soulagement.',
  [roomChoiceTextKey('the-unchosen', 'close-it')]: 'Refermez-la le reste du chemin. Certaines portes sont honnêtement mieux laissées comme des portes.',
  [roomChoiceHintKey('the-unchosen', 'close-it')]: 'Respectez son caractère révolu.',
  [roomChoiceOutcomeKey('the-unchosen', 'close-it', 0)]: 'Vous la repoussez doucement, comme vous fermeriez une porte sur une pièce où quelqu\'un dort enfin, véritablement.',
  [roomChoiceOutcomeKey('the-unchosen', 'close-it', 1)]: 'Le Placeur : L\'instinct correct, sans doute. Toute porte non ouverte n\'est pas un regret en attente. Certaines sont simplement des portes que vous aviez raison de laisser tranquilles la première fois, que vous le sachiez alors ou non.',
  [roomChoiceTextKey('the-unchosen', 'read-the-hinges')]: '« Pourquoi t\'es-tu ouverte à nouveau, maintenant, entre tous les moments ? » Interrogez la porte elle-même.',
  [roomChoiceHintKey('the-unchosen', 'read-the-hinges')]: 'Interrogez l\'offre, pas seulement la pièce.',
  [roomChoiceOutcomeKey('the-unchosen', 'read-the-hinges', 0)]: 'Vous n\'obtenez pas vraiment de réponse — les portes, même ici, ne sont pas naturellement expansives — mais vous remarquez que les gonds ont été récemment huilés. Quelqu\'un, ou quelque chose, voulait que cette porte soit facile à bouger ce soir, spécifiquement.',
  [roomChoiceOutcomeKey('the-unchosen', 'read-the-hinges', 1)]: 'Le Placeur : Une question juste, et je n\'ai pas la version honnête de la réponse. Ma meilleure supposition : l\'établissement vous offre la porte que vous êtes maintenant prêt à survivre à ne pas ouvrir. Il ne m\'a jamais non plus expliqué son timing.',
  [roomExplanationKey('the-unchosen', 0)]: 'On vous montre les portes devant lesquelles vous êtes passé sans les ouvrir lors de votre dernier voyage ici — des chemins jamais empruntés, désormais à jamais inconnus. L\'une d\'elles s\'ouvre à nouveau en grinçant, d\'elle-même. Il s\'agit de l\'attrait étrange du « chemin non pris » : regardez-vous enfin à l\'intérieur, par pure curiosité maintenant que cela ne vous coûte rien ? Ou la laissez-vous fermée, décidant que toute porte non ouverte n\'était pas secrètement une occasion manquée ? La plupart des gens, en regardant leur vie en arrière, se demandent au moins pour un chemin qu\'ils n\'ont pas pris — cette pièce rend simplement ce sentiment littéral.',
  [roomNoteTitleKey('the-unchosen')]: 'Le chemin non pris, audité',
  [roomNoteThinkersKey('the-unchosen')]: 'Søren Kierkegaard (1844) · Robert Frost (1916), le poème mal lu comme mise en garde',
  [roomNoteBodyKey('the-unchosen')]: 'Søren Kierkegaard appelait la possibilité la chose la plus vertigineuse offerte à une personne — plus vertigineuse que n\'importe quel danger réel, car le réel est au moins fini, tandis que le possible se multiplie sans limite plus longtemps on reste à une bifurcation en refusant de choisir. L\'angoisse, pour Kierkegaard, est le sentiment de la liberté qui se penche vers le bas. « Le chemin non pris » de Robert Frost est mal cité à presque chaque remise de diplômes comme un hymne à la divergence audacieuse — « celui le moins fréquenté, / Et cela a fait toute la différence » — mais le poème lui-même est bien plus rusé : les deux chemins sont, admet le narrateur deux strophes plus tôt, usés « vraiment à peu près pareil », et le soupir mélancolique à la fin est confessé à l\'avance comme quelque chose que le narrateur racontera « avec un soupir / quelque part dans des âges et des âges d\'ici » — une histoire reformée par le recul, non une vérité rapportée depuis la bifurcation. **Les portes de ce couloir n\'ont jamais été secrètement meilleures. Elles étaient simplement, brièvement, possibles — et la possibilité, une fois fermée, ne garde aucun de ses reçus, seulement ses rumeurs.**',
});

// ---------- Act V: The Echo ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-echo', 0, 0)]: 'Une pièce nue. Deux chaises, se faisant face, assez proches pour que quiconque s\'assoit sur l\'une ou l\'autre soit clairement destiné à être entendu.',
  [roomBeatKey('the-echo', 0, 1)]: 'L\'autre chaise est occupée. Pas par une personne — la pièce prend soin d\'être précise à ce sujet, précise de la manière dont seul un endroit qui n\'a rien à gagner à mentir peut l\'être — mais par une voix, assemblée, patiemment, à partir de ce que vous avez dit et choisi la dernière fois que vous étiez ici.',
  [roomBeatKey('the-echo', 0, 5)]: 'Le Placeur : Je ne m\'assois pas pour celle-ci. Quoi que vous fassiez tous les deux ici, ça n\'a jamais été à moi d\'arbitrer.',
  [roomChoiceTextKey('the-echo', 'answer-it')]: '« Je t\'entends. » Parlez à celui que vous étiez.',
  [roomChoiceHintKey('the-echo', 'answer-it')]: 'Adressez-vous à cela, pas seulement en être témoin.',
  [roomChoiceOutcomeKey('the-echo', 'answer-it', 0)]: 'Vous le dites — non une correction, non des excuses, juste une reconnaissance, comme vous salueriez quelqu\'un à une porte dont vous n\'étiez pas sûr qu\'il vous reconnaîtrait encore.',
  [roomChoiceOutcomeKey('the-echo', 'answer-it', 1)]: 'L\'autre chaise ne répond pas vraiment. Mais quelque chose dans la pièce se calme comme une respiration retenue quand elle est enfin relâchée exprès, par deux personnes au lieu d\'une.',
  [roomChoiceTextKey('the-echo', 'sit-in-silence')]: 'Asseyez-vous en face et ne dites rien. Laissez-la finir, cette fois, sans interruption.',
  [roomChoiceHintKey('the-echo', 'sit-in-silence')]: 'Témoigner sans répondre.',
  [roomChoiceOutcomeKey('the-echo', 'sit-in-silence', 0)]: 'Vous vous asseyez. Vous la laissez parler, jusqu\'au bout, sans corriger un seul mot — ce qui, remarquez-vous, n\'est pas non plus quelque chose que vous avez toujours réussi la première fois.',
  [roomChoiceOutcomeKey('the-echo', 'sit-in-silence', 1)]: 'Le silence n\'est pas vide. C\'est, si quelque chose, la chose la plus complète jamais dite dans cette pièce.',
  [roomChoiceTextKey('the-echo', 'take-both-chairs')]: '« Il n\'y a jamais eu personne d\'autre ici. » Asseyez-vous sur les deux chaises, à tour de rôle, et pensez-le vraiment.',
  [roomChoiceHintKey('the-echo', 'take-both-chairs')]: 'La lecture la plus coûteuse : pas de visiteur, seulement vous.',
  [roomChoiceOutcomeKey('the-echo', 'take-both-chairs', 0)]: 'Vous vous asseyez aussi sur la deuxième chaise, brièvement, et essayez la voix comme un manteau que vous possédiez autrefois — et il vous va, exactement, ce qui est soit réconfortant, soit tout le problème, selon l\'heure.',
  [roomChoiceOutcomeKey('the-echo', 'take-both-chairs', 1)]: 'Il n\'y a jamais eu d\'invité ici à divertir. Seulement une série de vous, classés sous le même nom, prenant tour à tour le stylo.',
  [roomExplanationKey('the-echo', 0)]: 'Assise en face de vous se trouve une voix entièrement construite à partir de choses que vous avez dites et choisies la dernière fois que vous étiez ici — pas un fantôme, juste un écho d\'une version antérieure de vous-même. Lui répondez-vous, vous asseyez-vous tranquillement pour vraiment écouter pour une fois, ou réalisez-vous qu\'il n\'y a en fait jamais eu personne d\'autre dans la pièce du tout — seulement vous, à deux moments différents ? Il s\'agit de savoir si le « vous » de votre passé et le « vous » d\'en ce moment sont vraiment la même personne, ou plutôt deux chapitres différents du même livre se rencontrant un instant.',
  [roomNoteTitleKey('the-echo')]: 'Conversations avec un ancien occupant',
  [roomNoteThinkersKey('the-echo')]: 'David Hume (1739) · Galen Strawson (1997), le moi-faisceau et ses critiques',
  [roomNoteBodyKey('the-echo')]: 'David Hume a cherché dans son propre esprit un moi continu et a rapporté n\'avoir trouvé qu\'un faisceau de perceptions — aucun fil ne courant en dessous, juste une expérience après l\'autre, assez étroitement empaquetées pour ressembler à une personne. Galen Strawson a pris le faisceau au sérieux comme description de l\'expérience elle-même : beaucoup d\'entre nous, argumentait-il, ne se sentent pas réellement continus avec qui nous étions il y a des années, ou même des heures — le moi psychologique est souvent « épisodique », se renouvelant par éclats plus courts et plus locaux que ne le suppose le modèle de l\'identité narrative, sans qu\'un fil unique soit nécessaire pour faire d\'un éclat donné un moi authentique. La voix sur l\'autre chaise n\'est pas une hantise ; c\'est ce qui reste d\'un tel éclat, classé avec exactitude et sans malveillance. Que vous lui répondiez, l\'attendiez patiemment, ou admettiez qu\'il n\'y a jamais eu qu\'un seul occupant, la pièce pose la même question de trois manières : **celui qui écoute maintenant est-il le même que celui qui parlait alors — ou simplement le prochain occupant, lisant le bail précédent avec une attention inhabituelle ?**',
});
