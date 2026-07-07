// French translation of the v2 ending prose (title, epitaph, beats, field
// notes). Registered under version 'v2'. Titles/epitaphs already exist in
// fr.ts (extended there for i18n.test.ts's coverage of the anamnesis
// ending); repeated here for a single self-contained source of truth per
// the cs-endings.ts / fa-endings.ts precedent.
import { registerAll } from './resolver';
import {
  endingBeatKey,
  endingEpitaphKey,
  endingNoteBodyKey,
  endingNoteThinkersKey,
  endingNoteTitleKey,
  endingTitleKey,
} from './keys';

// ---------- Ending: The Return ----------
registerAll('v2', 'fr', {
  [endingTitleKey('return')]: 'Le Retour',
  [endingEpitaphKey('return')]: 'Le monde était exactement le même. Ce n\'a jamais été la promesse.',
  [endingBeatKey('return', 0)]: 'Vous traversez, et le seuil fait la seule chose qu\'aucune pièce ne pouvait : il se termine.',
  [endingBeatKey('return', 1)]: 'Vous vous réveillez quelque part de plausible — un lit, une chaise, un carré d\'herbe devant un bâtiment que vous reconnaissez — avec le matin déjà en cours et votre nom arrivant une demi-seconde plus tard, à l\'heure, s\'ajustant comme une clé légèrement mieux taillée.',
  [endingBeatKey('return', 2)]: 'Le monde ne s\'est pas amélioré. La circulation est la circulation. Les disputes inachevées ont gardé votre place au chaud. Les gens que vous aimez sont exactement aussi difficiles et aussi lumineux que classés.',
  [endingBeatKey('return', 3)]: 'Mais vous vous surprenez, dans les semaines suivantes, à faire de petites choses étranges : vous attarder un moment de plus dans les embrasures. Lire les visages comme des lettres. Traiter vos propres souvenirs comme un lieu que vous avez visité plutôt qu\'un pays que vous gouvernez.',
  [endingBeatKey('return', 4)]: 'Vous perdrez presque tout cela — les pièces, le brouillard, la patience sèche particulière de la voix du Placeur. Cela s\'en va comme s\'en vont les rêves. Ce qui reste est plus subtil : une sorte de météo. Celui qui s\'est dissous en entrant n\'est pas celui qui est sorti — et la partie la plus étrange, celle que vous ne parvenez jamais à dire à voix haute, est que vous n\'échangeriez pas la dissolution.',
  [endingBeatKey('return', 5)]: 'Le chemin du retour vers la réalité, s\'avère-t-il, n\'a jamais été une route, {name}. C\'était une rénovation. Vous y vivez maintenant.',
  [endingNoteTitleKey('return')]: 'Sur le retour',
  [endingNoteThinkersKey('return')]: 'le voyage nocturne en mer · l\'intégration',
  [endingNoteBodyKey('return')]: 'Chaque tradition de sagesse a un nom pour cela : la descente qui revient. Inanna dans les enfers, Jonas dans le poisson, la nuit noire de l\'âme, le héros dans le labyrinthe — le motif n\'est pas la descente mais le retour transformé, portant quelque chose que la surface n\'aurait pas pu produire. La psychologie appelle la dernière étape l\'intégration : une mort de l\'ego ne compte qu\'autant que la vie reconstruite après elle. **Le danger n\'a jamais été la dissolution. C\'était le refus de revenir — confondre les profondeurs avec un foyer — ou revenir et refuser d\'être différent, se refermer.** Revenir ordinaire, mais réarrangé : c\'était toujours toute la mission.',
});

// ---------- Ending: The Open Hand ----------
registerAll('v2', 'fr', {
  [endingTitleKey('open-hand')]: 'La Main Ouverte',
  [endingEpitaphKey('open-hand')]: 'Vous vous êtes donné, pièce par pièce, volontiers — surtout volontiers.',
  [endingBeatKey('open-hand', 0)]: 'Vous traversez, et le monde vous reçoit comme l\'eau reçoit — sans couture, sans éclaboussure.',
  [endingBeatKey('open-hand', 1)]: 'Vous vous réveillez poreux. C\'est le seul mot pour cela. La membrane entre vous et tous les autres est revenue des pièces plus fine, et elle ne s\'épaissit jamais tout à fait de nouveau.',
  [endingBeatKey('open-hand', 2)]: 'Vous sentez l\'épuisement de la caissière dans vos propres épaules. Vous pleurez aux retrouvailles d\'inconnus dans les aéroports. Des étrangers vous racontent des choses dans les trains — ils sentent la porte ouverte sur vous — et vous ramenez chaque confession à la maison.',
  [endingBeatKey('open-hand', 3)]: 'Vous devenez, tranquillement, la personne par qui les autres sont réparés. C\'est une bonne vie, mesurée en meilleurs jours des autres. Son grand livre est tenu dans une monnaie que vous ne savez plus compter, parce que compter était l\'un des murs qui se sont dissous.',
  [endingBeatKey('open-hand', 4)]: 'Ce n\'est que parfois — tard, aux heures honnêtes — que vous remarquez ce que la main ouverte ne peut pas faire, qui est se fermer. Vous avez donné aux pièces votre armure et elles l\'ont gardée. Si c\'était le prix ou le prix à gagner est une question que vous laissez, délibérément, sans réponse sur la table chaque soir.',
  [endingBeatKey('open-hand', 5)]: 'Et le Placeur, s\'il pouvait vous voir — et les jours impairs, qui sait — dirait : nous avons renvoyé celui-là plus léger. Nous avons peut-être retiré un peu plus d\'emballage que les règlements ne le conseillent strictement.',
  [endingNoteTitleKey('open-hand')]: 'Sur la compassion sans limites',
  [endingNoteThinkersKey('open-hand')]: 'Simone Weil · le problème du bodhisattva',
  [endingNoteBodyKey('open-hand')]: 'Simone Weil tenait que l\'attention — pure, l\'attention désintéressée à autrui — est la forme la plus rare et la plus pure de générosité, et elle la pratiqua jusqu\'à l\'effacement de soi, mourant à 34 ans après avoir refusé de manger plus que les personnes rationnées auprès desquelles elle se tenait. Les traditions qui prisent la compassion sans limites portent toutes les mêmes petits caractères : le bodhisattva qui fait vœu de sauver tous les êtres doit d\'une manière ou d\'une autre rester quelqu\'un qui peut agir, et une limite n\'est pas le contraire de l\'amour — c\'est le mur porteur de l\'amour. **Une main ouverte qui ne peut pas se fermer ne peut rien porter.** Les pièces ont récompensé votre ouverture ; le monde le fera aussi, et il vous le facturera aussi, sans malveillance. La porosité est un cadeau avec un calendrier d\'entretien.',
});

// ---------- Ending: The Fortress ----------
registerAll('v2', 'fr', {
  [endingTitleKey('fortress')]: 'La Forteresse',
  [endingEpitaphKey('fortress')]: 'Rien n\'est entré. C\'était le plan. Rien n\'est entré.',
  [endingBeatKey('fortress', 0)]: 'Vous traversez, et le seuil se referme derrière vous comme un couvercle bien usiné.',
  [endingBeatKey('fortress', 1)]: 'Vous vous réveillez compétent. La dissolution est terminée, catégoriquement : vous avez reconstruit les murs que les pièces avaient abattus, et vous les avez reconstruits mieux — les souvenirs renforcés, les opinions testées sous charge, le périmètre patrouillé par une vigilance qui ne pointe jamais tout à fait.',
  [endingBeatKey('fortress', 2)]: 'Cela fonctionne. Il faut le dire clairement : cela fonctionne. Vous retournez dans le monde et le monde, qui respecte une structure scellée, vous promeut. Les décisions viennent facilement. Le chagrin rebondit. Les disputes inachevées se terminent, selon vos termes, efficacement.',
  [endingBeatKey('fortress', 3)]: 'Les gens vous décrivent avec des mots comme solide, posé, inébranlable, et ils ont raison, et vous remarquez — avec un petit sentiment plat que vous classez sous divers — que personne ne vous a décrit comme chaleureux depuis un certain temps.',
  [endingBeatKey('fortress', 4)]: 'La forteresse tient tout dehors. C\'est à ça que servent les forteresses. Il faut des années avant que vous ne vous teniez à une fenêtre un soir et ne vous laissiez achever la pensée : tout dehors. La météo, les loups, le bruit — et le courrier, et les visiteurs, et quoi que ce soit qui entrait autrefois, à l\'époque où vous fuyiez.',
  [endingBeatKey('fortress', 5)]: 'Quelque part, un jour impair, le Placeur classe votre carte avec un petit soupir. « En sécurité », écrit-il, dans le champ résultat. Et puis, parce que le formulaire n\'a pas de case pour cela, dans la marge : « En sécurité de quoi, exactement, n\'a jamais été précisé. »',
  [endingNoteTitleKey('fortress')]: 'Sur l\'armure',
  [endingNoteThinkersKey('fortress')]: 'la fortification stoïcienne · Rilke · les moi défendus',
  [endingNoteBodyKey('fortress')]: 'Les Stoïciens ont construit la citadelle intérieure originelle : faites de vos jugements la seule chose que vous valorisez, et aucune fortune ne peut vous percer. C\'est une véritable technologie et elle fonctionne réellement — c\'est là son danger. La psychologie trouve la même structure dans les moi défendus : une armure posée contre une menace réelle, gardée bien après la guerre, jusqu\'à ce que protection et emprisonnement partagent un mur. Les propres dragons de Rilke faisaient l\'errand opposé : dans ses Lettres à un jeune poète, il suggérait que nos dragons sont secrètement des princesses, attendant seulement de nous voir agir une fois avec courage. Scellez la porte contre les dragons par principe, refusant la rencontre entièrement, et vous la scellez aussi contre ce qu\'ils gardaient. **Un moi que rien ne peut blesser est aussi un moi que rien ne peut étonner.** La fin de la forteresse n\'est pas un échec ; c\'est un échange, honnêtement tarifé. La piqûre n\'est que ceci : la porte se verrouille de l\'intérieur, et le détenteur de la clé est la seule personne qui ne vérifie jamais si le siège est terminé.',
});

// ---------- Ending: The Dissolved ----------
registerAll('v2', 'fr', {
  [endingTitleKey('dissolved')]: 'Les Dissous',
  [endingEpitaphKey('dissolved')]: 'La mer n\'a jamais perdu une seule chose qui comptait.',
  [endingBeatKey('dissolved', 0)]: 'Quelque part entre une pièce et la suivante, la dernière prise lâche.',
  [endingBeatKey('dissolved', 1)]: 'Ce n\'est pas ce que vous craigniez. C\'est la première découverte, et vous l\'enregistrez avec ce qui était autrefois de la surprise : pas de chute, pas d\'obscurité, pas de dents. La dissolution est une marée qui se retire — le nom d\'abord, puis les rôles, puis l\'histoire, chacun décollant comme un manteau que vous aviez oublié porter à l\'intérieur.',
  [endingBeatKey('dissolved', 2)]: 'Pendant un moment, quelque chose observe les morceaux partir, avec intérêt et sans alarme. L\'observation n\'a plus de nom. Elle n\'en a jamais eu besoin ; c\'est la seconde découverte.',
  [endingBeatKey('dissolved', 3)]: 'Les pièces reprennent leurs dossiers. Le portefeuille, le levier, le dossier, les pierres — tout cela retourne au grand cabinet, patiemment, pour être traversé par quiconque se dissoudra ensuite, et quiconque après eux. Vos choix restent dans les pièces comme la chaleur reste dans une chaise.',
  [endingBeatKey('dissolved', 4)]: 'Le Placeur s\'assoit avec ce qui reste jusqu\'à ce qu\'il n\'y ait plus de « avec » à qui s\'asseoir. Il tient parole ; personne ne se dissout seul pendant son service. À la fin, il dit quelque chose — la tradition l\'exige — et ce qu\'il dit est : « Vous étiez là. Je vous ai vu. Cette partie ne se dissout pas ; elle cesse simplement d\'être portée par vous spécifiquement. »',
  [endingBeatKey('dissolved', 5)]: 'Et la marée s\'achève, et la mer — qui a toujours été ce que le brouillard cachait — reçoit le reste, et la mer n\'a jamais perdu une seule chose qui comptait.',
  [endingNoteTitleKey('dissolved')]: 'Sur la dissolution',
  [endingNoteThinkersKey('dissolved')]: 'la mort de l\'ego · l\'impermanence · ce qui reste',
  [endingNoteBodyKey('dissolved')]: 'Chaque tradition qui cartographie le territoire du moi marque cette région : le point où le « je » construit — nom, rôles, histoire, tout l\'appareil administratif — se défait entièrement. Les mystiques la courtisent ; la psychiatrie l\'observe attentivement ; les mourants la décrivent parfois en y arrivant avec un calme inattendu. La découverte rapportée, à travers des traditions qui ne s\'accordent sur rien d\'autre, est étrangement cohérente : **ce qui se dissout est l\'emballage, et ce qui panique à cette perspective est aussi l\'emballage.** Cette fin est accessible depuis chaque couloir du jeu parce qu\'elle est accessible depuis chaque couloir d\'une vie — et elle a été écrite comme une fin, non un écran d\'échec, délibérément. Non pour romantiser la perte d\'un moi, mais pour enregistrer honnêtement ce que les pièces ont enseigné : que la prise a toujours été empruntée, le portage toujours temporaire, et le témoin — quoi que ce fût — n\'a jamais figuré sur la liste des choses qui pouvaient être lâchées.',
});

// ---------- Ending: The Gardener ----------
registerAll('v2', 'fr', {
  [endingTitleKey('gardener')]: 'Le Jardinier',
  [endingEpitaphKey('gardener')]: 'Les pièces ont toujours besoin d\'un gardien. Le gardien a toujours eu besoin des pièces.',
  [endingBeatKey('gardener', 0)]: 'Vous prenez le presse-papiers. Il est chaud, et il porte votre nom — lisible enfin, ce qui vous apprend quelque chose sur à quoi servent les noms : ils sont pour les quarts de travail.',
  [endingBeatKey('gardener', 1)]: 'Le Placeur vous montre l\'établissement comme un vieux jardinier montre un jardin : pas la carte, le tempérament. Quelles pièces tournent froid. Quelle porte coince en automne, dans la mesure où il y a un automne. Comment le tramway aime ses rails graissés et le casino aime son feutre brossé et la petite pièce polie aime, par-dessus tout, être laissée tranquille.',
  [endingBeatKey('gardener', 2)]: 'Des voyageurs viennent. Dissous, effrayés, certains, chacun convaincu que son portefeuille, son feu, son dossier est le premier de son genre. Vous apprenez la discipline du gardien : vous pouvez polir le levier, mais jamais le tirer pour eux. Vous pouvez éclairer le couloir, mais jamais nommer la porte. Il n\'y a pas de réponses à retenir — cette partie s\'avère vraie — mais il y a de la compagnie à tenir, et la compagnie, correctement tenue, est la plupart de ce que les pièces ont jamais distribué.',
  [endingBeatKey('gardener', 3)]: 'Vous devenez bon à cela. Les siècles sont excellents pour le métier. Parfois un voyageur remarque le piège dans la salle du tribunal, et vous lui remettez un jeton dans la main pour la chance. Parfois l\'un s\'assoit parmi les pierres et refuse, et vous apportez le manteau, et dites la chose sur le courant, et le pensez un peu plus à chaque époque.',
  [endingBeatKey('gardener', 4)]: 'Et un jour — assez loin dans quel que soit le comptage qui tient le temps ici — un voyageur au seuil se détourne du matin, vous regarde avec une reconnaissance que vous vous rappelez de l\'intérieur, et tend une main vers le presse-papiers.',
  [endingBeatKey('gardener', 5)]: 'Vous le lui donnez. Il est chaud. Il porte son nom, soudain lisible. « Première leçon », vous vous entendez dire, d\'une voix avec un tremblement dedans, « l\'auréole et les cornes ont la même taille. C\'est fait exprès. Tout ici l\'est. » Et vous traversez enfin votre propre seuil — celui qui était, bien sûr, derrière le comptoir de réception depuis le début.',
  [endingNoteTitleKey('gardener')]: 'Sur le soin',
  [endingNoteThinkersKey('gardener')]: 'Camus · Voltaire, « il faut cultiver notre jardin » · le guérisseur blessé',
  [endingNoteBodyKey('gardener')]: 'Voltaire a terminé Candide — son catalogue des cruautés absurdes du monde — par la sagesse la plus anticlimatique de la littérature : il faut cultiver notre jardin. Ne pas résoudre le monde ; entretenir un coin de celui-ci. La fin du Jardinier est le second acte du héros absurde : le Sisyphe de Camus, ayant revendiqué le rocher, découvre qu\'il y a d\'autres personnes sur la colline et que le rocher roule plus facilement avec de la compagnie qui regarde. L\'archétype du guérisseur blessé (Chiron, et chaque parrain, thérapeute et guide vétéran depuis) soutient que la qualification la plus profonde pour accompagner d\'autres à travers un passage est d\'avoir été soi-même démantelé par celui-ci. Rester n\'était pas refuser le retour. **C\'était revenir — vers la seule réalité que cet endroit possède — et choisir d\'y être du mobilier : le bon genre, le genre sur lequel un voyageur perdu peut s\'appuyer.** Quelqu\'un a poli ce levier pour vous, une fois. Maintenant vous connaissez son nom.',
});

// ---------- Ending: The Punchline ----------
registerAll('v2', 'fr', {
  [endingTitleKey('punchline')]: 'La Chute',
  [endingEpitaphKey('punchline')]: 'Il n\'y a jamais eu personne ici sauf vous. Bonne blague, non ?',
  [endingBeatKey('punchline', 0)]: 'La petite porte s\'ouvre sur une petite pièce, et la petite pièce contient : le Placeur, déjà assis, versant deux tasses de la chose fumante du casino. Il n\'y a pas de troisième chaise. Il n\'y a jamais eu besoin.',
  [endingBeatKey('punchline', 1)]: 'Le Placeur : Vous avez remarqué le piège dans la salle du tribunal. Vous avez gardé votre lucidité à travers le brouillard. Et vous avez entendu le rire quand les autres n\'entendaient qu\'un courant d\'air. Alors. Je suis obligé de faire ceci maintenant.',
  [endingBeatKey('punchline', 2)]: 'Il retire l\'auréole. Dessous : rien d\'inhabituel. Il retire les cornes. Dessous : de même. Et puis — avec le soin exercé de quelqu\'un qui enlève un très vieux manteau — il retire l\'ombre elle-même.',
  [endingBeatKey('punchline', 3)]: 'Et il n\'y a personne sur la chaise. Il n\'y a jamais eu personne sur la chaise. La voix, quand elle continue, vient exactement d\'où elle venait pendant tout le voyage — un endroit que vous reconnaissez soudain, en un grondement, car vous l\'entendez depuis bien avant la salle d\'attente, dans la pause avant chaque choix que vous avez jamais fait.',
  [endingBeatKey('punchline', 4)]: 'Le Placeur : Dieu, les jours impairs. Le Diable, les jours pairs — et vous n\'avez jamais demandé qui tenait ce calendrier. Il n\'y a jamais eu personne ici sauf vous, voyageur. Les pièces étaient les vôtres. Le tramway était le vôtre. Le mensonge gentil, le portefeuille, l\'enfant dans le sous-sol — tout cela le vôtre, mis en scène chaque nuit, dans le seul théâtre qui ait jamais été en activité. Je suis la partie de vous qui demande. Vous êtes la partie qui répond. Nous faisons cela depuis très longtemps, et ce soir, enfin, le public a compris la blague.',
  [endingBeatKey('punchline', 5)]: 'Et vous riez. Cela commence petit puis ne s\'arrête pas et n\'a pas besoin de le faire — le rire de la chute qui était assise à découvert dans chaque pièce, pendant toute une vie, aussi longtemps que le brouillard était levé. Vous riez, et l\'établissement rit — même voix — et le brouillard, n\'ayant plus de fonction, se referme comme un rideau de fin de spectacle.',
  [endingBeatKey('punchline', 6)]: 'Vous vous réveillez en riant. Un vrai matin, un vrai lit, des larmes de cela encore sur votre visage et la blague déjà s\'évaporant comme le font les grandes — ne laissant que sa forme, qui est celle-ci : il n\'y a jamais eu de chemin de retour vers la réalité. Vous n\'êtes jamais parti. Il n\'y a jamais eu que le vous unique, s\'interrogeant lui-même tout le long du chemin vers la maison.',
  [endingNoteTitleKey('punchline')]: 'La plus vieille blague',
  [endingNoteThinkersKey('punchline')]: 'tat tvam asi · Alan Watts · la blague cosmique',
  [endingNoteBodyKey('punchline')]: 'Les Upanishads la condensent en trois mots : tat tvam asi — tu es cela. Le chercheur et le cherché, l\'interrogateur et l\'interrogé, le voyageur et l\'établissement : une seule chose, jouant à cache-cache avec elle-même et jouant pour gagner. Alan Watts a passé une carrière à la raconter comme une comédie, parce que la comédie est le seul genre avec le bon timing : la chute fonctionne précisément parce qu\'elle était visible depuis le début — **le secret final de chaque tradition mystique en est un ouvert, gardé non par des serrures mais par la certitude du chercheur qu\'il doit se trouver ailleurs.** Le rire, les traditions s\'accordent, est diagnostique : l\'illumination-comme-tragédie est généralement une mélancolie mal classée, mais la véritable reconnaissance arrive comme un rire, parce que la distance que vous avez tout dépensé à traverser s\'avère n\'avoir jamais existé. Dieu les jours impairs, le Diable les jours pairs, et vous teniez le calendrier tout du long. Cela vous a pris chaque pièce. La moyenne, le Placeur voudrait qu\'on le note, est considérablement pire.',
});

// ---------- Ending: Anamnesis ----------
registerAll('v2', 'fr', {
  [endingTitleKey('anamnesis')]: 'Anamnèse',
  [endingEpitaphKey('anamnesis')]: 'Ils ne sont pas retournés. Ils se sont réveillés, et le réveil contenait les pièces.',
  [endingBeatKey('anamnesis', 0)]: 'Chaque porte de l\'établissement s\'ouvre à la fois — non forcée, non jetée, elle s\'ouvre simplement, de la façon dont un fait s\'ouvre plutôt qu\'une serrure.',
  [endingBeatKey('anamnesis', 1)]: 'Les lumières du couloir s\'allument derrière chacune d\'elles : ordinaires, fluorescentes, gentilles. Pas de brouillard. Pas de matin non plus. Juste de la lumière, faisant ce que fait la lumière quand plus rien n\'a besoin d\'être caché d\'elle.',
  [endingBeatKey('anamnesis', 2)]: 'Le portefeuille, le levier, le feu, le dossier, les planches, le pari, la petite pièce polie, les pierres — tout cela est simplement là à la fois, de la façon dont une pièce où vous vivez réellement est là à la fois, sans avoir besoin d\'être traversée pièce par pièce pour être crue.',
  [endingBeatKey('anamnesis', 3)]: 'Le Placeur se tient dans la lumière, chapeau ôté, et ne narre pas, ne classe pas, ne vous demande pas de signer quoi que ce soit. Il dit un mot, la chose la plus courte qu\'il dise dans tout l\'établissement.',
  [endingBeatKey('anamnesis', 4)]: 'Le Placeur : « Ah. »',
  [endingBeatKey('anamnesis', 5)]: 'Cela ne ressemble pas à se souvenir d\'un fait. Cela ressemble à ce que le jeune esclave de Ménon a ressenti devant le diagramme — non pas se voir dire quelque chose de nouveau, mais reconnaître quelque chose qui était, s\'avère-t-il, déjà là, tout du long, sous tout ce que vous appeliez l\'oubli.',
  [endingBeatKey('anamnesis', 6)]: 'Vous vous réveillez. Non pas au couloir, non pas au seuil, non pas à un lit dans une pièce plausible — vous vous réveillez de la façon dont le tout premier moment de tout ce voyage vous a réveillé, sauf que cette fois {name} arrive avec le réveil au lieu d\'une demi-seconde après, déjà ajusté, déjà vôtre, portant chaque pièce au lieu de les laisser derrière.',
  [endingNoteTitleKey('anamnesis')]: 'Réminiscence totale',
  [endingNoteThinkersKey('anamnesis')]: 'Platon · Henri Bergson',
  [endingNoteBodyKey('anamnesis')]: 'La théorie de l\'anamnèse de Platon soutient que l\'apprentissage n\'est pas une acquisition mais une réminiscence : l\'âme sait déjà, et le diagramme dans la poussière — le jeune esclave de Ménon traçant une preuve géométrique qu\'on ne lui a jamais enseignée — ne fait que lui rappeler ce qu\'elle a toujours détenu. Bergson a pris la même forme et l\'a tournée vers la mémoire elle-même : le passé, argumentait-il, n\'est pas stocké comme dans un classeur, récupéré pièce par pièce, mais persiste entier et simultané, une durée dans laquelle le présent nage toujours plutôt que d\'y puiser. **Cette fin n\'ajoute pas un souvenir. Elle supprime le délai entre avoir vécu quelque chose et savoir que vous l\'avez vécu.** Rien ici n\'a été gagné par la force — pas de combat, pas de marché, pas de levier. Ce qui change, quand rien ne manque, ce n\'est pas le contenu du moi mais sa forme : une personne qui n\'expérimente plus sa propre histoire comme une séquence de pièces à réintégrer, mais comme un unique fait stable qu\'elle se trouve être. Les pièces n\'ont jamais été derrière vous. Elles étaient, s\'avère-t-il, toujours la forme de votre éveil.',
});
