// French translations for LIMERENCE Act III's Examined Path reflections
// (spec 05). Every line is translated with the specific room's actual
// situation and the choice's real stakes in mind, not word-for-word from
// English — see CLAUDE.md's translation rule. Two rooms' choices carry no
// `reflections` field in the English source and are correctly absent here:
// the-usual-suite's three choices (name-them, watch-silent,
// ask-who-books-it) and the-wedding-eve's keepsake choice
// (hold-the-cheap-ring) — verified against src/packs/limerence/rooms/act3.ts
// directly, not assumed from the German/Czech passes.
//
// Dana/Sam gender-neutrality and the Rowan/Petra feminine treatment follow
// the exact strategy documented in fr-rooms-act3.ts's own header: bare-noun
// repetition, direct address with "tu", French possessive determiners and
// possessive pronouns (son/sa/ses, le sien/la sienne) which — unlike English
// or German — agree with the *possessed* noun rather than the possessor, and
// nominal/active-verb rephrasing wherever a predicate adjective or past
// participle would otherwise force gender onto Dana or Sam; ordinary French
// feminine agreement for Rowan and Petra, both explicitly gendered female in
// the English source. One line (the-therapist's defensiveness "care") falls
// back to a grammatically masculine default where no rephrasing was
// available without distorting the sentence, matching the rare-fallback
// precedent documented in fr-rooms-act2.ts and fr-rooms-act3.ts.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'fr', {
  // ---------- The Colleague ----------
  [reflectionKey('the-colleague', 'the-balcony', 'consequence')]:
    "Une nuit lors d'un colloque change ce que cette connivence emportera avec elle, peu importe comment on la classera après coup.",
  [reflectionKey('the-colleague', 'the-balcony', 'duty')]:
    "C'est une porte ouverte sans que Dana ait eu voix au chapitre sur ce que ça coûte à la relation.",
  [reflectionKey('the-colleague', 'the-balcony', 'virtue')]:
    "Remarque avec quelle rapidité les justifications sont arrivées — l'envie déguisée en fatalité.",
  [reflectionKey('the-colleague', 'the-balcony', 'care')]:
    "Dana, qui dort à deux cents kilomètres de là, n'a pas eu voix au chapitre dans une décision qui refaçonne ce à quoi Dana rentre à la maison.",
  [reflectionKey('the-colleague', 'walk-away', 'consequence')]:
    "Partir coûte la chaleur de la soirée, et évite un prix qui, sinon, se serait alourdi pendant des mois.",
  [reflectionKey('the-colleague', 'walk-away', 'duty')]: "Ça respecte un accord que Dana n'était pas là pour faire respecter.",
  [reflectionKey('the-colleague', 'walk-away', 'virtue')]: "C'est de l'intégrité pratiquée alors que, littéralement, personne d'autre n'en aurait jamais rien su.",
  [reflectionKey('the-colleague', 'walk-away', 'care')]:
    "Tu as protégé la confiance de Dana sans que Dana ait jamais eu à apprendre qu'il y avait quelque chose contre quoi la protéger.",
  [reflectionKey('the-colleague', 'name-it-in-the-corridor', 'consequence')]:
    "Nommer les choses coûte à l'amitié son ancienne connivence facile, en échange d'une autre qui n'a plus besoin de gérer un fil à vif.",
  [reflectionKey('the-colleague', 'name-it-in-the-corridor', 'duty')]:
    "Ça, Rowan le méritait tout autant que Dana — elle méritait une limite nommée, pas une retraite silencieuse.",
  [reflectionKey('the-colleague', 'name-it-in-the-corridor', 'virtue')]:
    "Ça a demandé plus de cran que de prendre la porte ou de l'éviter discrètement — dire la vraie phrase à voix haute.",
  [reflectionKey('the-colleague', 'name-it-in-the-corridor', 'care')]: 'Tu as donné à Rowan la même clarté et le même respect que tu réclamais pour toi-même.',
  [reflectionKey('the-colleague', 'postpone', 'consequence')]:
    "Reporter évite le prix de ce soir tout en alourdissant une décision qui, dans les faits, était déjà prise.",
  [reflectionKey('the-colleague', 'postpone', 'duty')]:
    "Ça laisse une obligation envers Dana sans réponse, plutôt que de l'honorer ou de la rompre proprement.",
  [reflectionKey('the-colleague', 'postpone', 'virtue')]: 'Remarque l\'aveuglement volontaire nécessaire pour appeler ça « il ne se passe rien ».',
  [reflectionKey('the-colleague', 'postpone', 'care')]: "Dana a droit à un·e partenaire qui a vraiment décidé, pas à quelqu'un qui laisse une porte entrouverte pour plus tard.",

  // ---------- The Metamour ----------
  [reflectionKey('the-metamour', 'enforce-via-dana', 'consequence')]:
    "Faire passer la limite par Dana est structurellement juste, et son issue reste incertaine — la chambre ne prétend pas que déléguer équivaut à contrôler.",
  [reflectionKey('the-metamour', 'enforce-via-dana', 'duty')]:
    "Ça respecte le fait que la relation avec Petra appartient à Dana de gérer, pas à toi de surveiller directement.",
  [reflectionKey('the-metamour', 'enforce-via-dana', 'virtue')]: "Remarque si c'est de la patience, ou une façon de t'épargner à toi-même une conversation plus difficile.",
  [reflectionKey('the-metamour', 'enforce-via-dana', 'care')]: 'Petra vit la limite de seconde main, dans tous les cas, ce qui influence la façon dont ça la touche.',
  [reflectionKey('the-metamour', 'talk-to-petra', 'consequence')]:
    "La communication directe entre métamours résout la couture là où elle se trouve vraiment, au prix d'une conversation vraiment gênante.",
  [reflectionKey('the-metamour', 'talk-to-petra', 'duty')]: 'Ça traite Petra comme quelqu\'un qui a droit à une communication directe, pas comme un problème à contourner.',
  [reflectionKey('the-metamour', 'talk-to-petra', 'virtue')]: 'Ça a demandé un vrai courage social — lancer une conversation sans script établi.',
  [reflectionKey('the-metamour', 'talk-to-petra', 'care')]: 'Ça place au centre la relation réelle entre les deux personnes concernées, plutôt que de tout faire passer par Dana.',
  [reflectionKey('the-metamour', 'name-the-hierarchy', 'consequence')]:
    "Nommer explicitement la hiérarchie échange le confort de prétendre qu'elle n'existe pas contre une structure où tout le monde peut vraiment se repérer.",
  [reflectionKey('the-metamour', 'name-the-hierarchy', 'duty')]:
    "Tous les trois, vous aviez droit à un compte-rendu exact de la forme réelle de la relation, pas à sa version idéalisée.",
  [reflectionKey('the-metamour', 'name-the-hierarchy', 'virtue')]:
    "Ça a demandé d'admettre une vérité inconfortable sur votre propre arrangement, plutôt que d'en défendre la version officielle.",
  [reflectionKey('the-metamour', 'name-the-hierarchy', 'care')]: "Ça donne à Petra des termes clairs, avec lesquels elle peut vraiment composer, plutôt qu'une hiérarchie tue qu'elle doit deviner.",
  [reflectionKey('the-metamour', 'audit-the-jealousy', 'consequence')]:
    "Examiner le sentiment d'abord coûte du temps avant d'agir, et produit une carte plus précise de ce qu'il faut vraiment réparer.",
  [reflectionKey('the-metamour', 'audit-the-jealousy', 'duty')]: 'Ça rend à la vérité toute sa complexité, plutôt que de saisir la méchante la plus simple à portée de main.',
  [reflectionKey('the-metamour', 'audit-the-jealousy', 'virtue')]: "C'est la discipline la plus dure, la moins satisfaisante — rester avec l'ambiguïté plutôt que la résoudre prématurément.",
  [reflectionKey('the-metamour', 'audit-the-jealousy', 'care')]: 'Ça protège Dana et Petra d\'une réaction qui n\'a pas encore été démêlée de la vraie transgression de limite.',

  // ---------- The Veto ----------
  [reflectionKey('the-veto', 'comply', 'consequence')]:
    "Honorer le veto préserve l'accord antérieur, au prix direct d'une relation avec quelqu'un qui n'a enfreint aucune règle de son côté.",
  [reflectionKey('the-veto', 'comply', 'duty')]: 'Une règle acceptée la première année te lie encore aujourd\'hui, quoi qu\'il en coûte de la tenir.',
  [reflectionKey('the-veto', 'comply', 'virtue')]: "C'est de la loyauté envers un engagement, mise à l'épreuve à son moment le plus coûteux.",
  [reflectionKey('the-veto', 'comply', 'care')]: "Sam absorbe la totalité du coût d'une règle à l'écriture de laquelle Sam n'a jamais eu voix au chapitre.",
  [reflectionKey('the-veto', 'fight-the-rule', 'consequence')]:
    "Contester la règle met en jeu la stabilité de la relation pour vérifier si la règle elle-même a jamais été juste.",
  [reflectionKey('the-veto', 'fight-the-rule', 'duty')]: "Tu avais droit à un mot à dire sur le fait qu'une règle capable de mettre fin à ta relation avec Sam soit encore la bonne règle.",
  [reflectionKey('the-veto', 'fight-the-rule', 'virtue')]: "C'est l'intégrité la plus dure — risquer un vrai conflit pour éprouver une structure plutôt que de simplement s'y soumettre.",
  [reflectionKey('the-veto', 'fight-the-rule', 'care')]: 'Ça force Dana à répondre à la peur par l\'engagement, plutôt que de se voir offrir une sortie facile et unilatérale.',
  [reflectionKey('the-veto', 'examine-the-veto', 'consequence')]:
    "Comprendre l'origine de la règle ne résout pas la décision de ce soir, mais rend plus honnête, quoi que tu choisisses ensuite.",
  [reflectionKey('the-veto', 'examine-the-veto', 'duty')]: 'Ça traite la règle comme quelque chose qui mérite un vrai examen, plutôt qu\'une obéissance aveugle ou une défiance aveugle.',
  [reflectionKey('the-veto', 'examine-the-veto', 'virtue')]: "C'est de l'honnêteté intellectuelle appliquée à l'histoire de ta propre relation, pas seulement à des arguments abstraits.",
  [reflectionKey('the-veto', 'examine-the-veto', 'care')]: 'Ça ralentit une décision qui touche trois personnes, en faveur d\'une vraie compréhension préalable.',
  [reflectionKey('the-veto', 'counter-veto', 'consequence')]:
    "Répondre au veto par un veto fait monter le conflit sans résoudre la question de savoir si l'invocation d'origine était juste.",
  [reflectionKey('the-veto', 'counter-veto', 'duty')]: "Rendre la pareille n'équivaut pas à aborder le vrai désaccord sur la règle.",
  [reflectionKey('the-veto', 'counter-veto', 'virtue')]: "Remarque le schéma, si c'en est un pour toi — répondre à une limite par une limite égale et opposée, plutôt que d'examiner l'une ou l'autre.",
  [reflectionKey('the-veto', 'counter-veto', 'care')]: "Petra devient un dommage collatéral dans un différend qui, en réalité, ne l'a jamais concernée.",

  // ---------- The Drift ----------
  [reflectionKey('the-drift', 'start-the-work', 'consequence')]:
    "Commencer ce travail risque un vrai effort pour un retour incertain — ce qui est précisément ce qui le distingue de la dérive.",
  [reflectionKey('the-drift', 'start-the-work', 'duty')]: "Ça honore un engagement pris il y a des années en l'entretenant vraiment, plutôt qu'en supposant qu'il s'entretient tout seul.",
  [reflectionKey('the-drift', 'start-the-work', 'virtue')]: "C'est la discipline la plus dure, la moins glorieuse — choisir l'effort plutôt que le confort d'un engourdissement installé.",
  [reflectionKey('the-drift', 'start-the-work', 'care')]: "Ça offre à Dana un·e partenaire qui choisit activement la relation à nouveau, plutôt qu'un·e partenaire qui se contente de l'occuper.",
  [reflectionKey('the-drift', 'raise-it', 'consequence')]:
    "Poser la question risque une vraie perturbation, en échange d'une information dont la relation avait besoin, quelle que soit la réponse.",
  [reflectionKey('the-drift', 'raise-it', 'duty')]: 'Vous aviez droit, tous les deux, à un bilan honnête plutôt qu\'à un silence confortable.',
  [reflectionKey('the-drift', 'raise-it', 'virtue')]: 'Ça a demandé de nommer une peur à voix haute, plutôt que de la gérer indéfiniment en silence.',
  [reflectionKey('the-drift', 'raise-it', 'care')]: "Ça donne à Dana la chance de répondre honnêtement, plutôt que de continuer à deviner ce que vous ressentez vraiment tous les deux.",
  [reflectionKey('the-drift', 'accept-quiet-as-love', 'consequence')]:
    "Accepter le silence ne coûte rien ce soir, et dépend entièrement du fait qu'il ait vraiment été choisi, plutôt que subi par résignation.",
  [reflectionKey('the-drift', 'accept-quiet-as-love', 'duty')]: "Ça honore ce que la relation est réellement devenue, plutôt que de la mesurer à une version antérieure, plus bruyante.",
  [reflectionKey('the-drift', 'accept-quiet-as-love', 'virtue')]: "Ça demande une vraie honnêteté envers soi — distinguer l'acceptation de la résignation, qui se ressemblent de l'extérieur.",
  [reflectionKey('the-drift', 'accept-quiet-as-love', 'care')]: "Ça offre à Dana un·e partenaire qui accorde de la valeur à ce qui est vraiment là, dit à voix haute plutôt que présumé.",
  [reflectionKey('the-drift', 'notice-youve-left', 'consequence')]:
    "Nommer le fait que tu as déjà quitté cette relation ne change rien ce soir, mais rend plus honnête chaque choix à venir.",
  [reflectionKey('the-drift', 'notice-youve-left', 'duty')]: "Dana a droit, un jour, à la vérité sur où tu en es vraiment, même si cette chambre ne le force pas ce soir.",
  [reflectionKey('the-drift', 'notice-youve-left', 'virtue')]: "C'est une connaissance de soi inconfortable, atteinte sans s'en détourner.",
  [reflectionKey('the-drift', 'notice-youve-left', 'care')]: 'C\'est une prise de conscience privée qui concerne malgré tout quelqu\'un à qui rien n\'a encore été dit.',

  // ---------- The Second Account ----------
  [reflectionKey('the-second-account', 'delete-it', 'consequence')]:
    "Le supprimer retire un coût caché et permanent pour la relation, au prix d'un vrai sevrage, même mineur.",
  [reflectionKey('the-second-account', 'delete-it', 'duty')]: "Dana avait droit à un·e partenaire qui ne répartit pas son attention, en silence, vers un compte dont Dana ignore l'existence.",
  [reflectionKey('the-second-account', 'delete-it', 'virtue')]: 'C\'est une autocorrection décisive, choisie avant de se faire prendre sur le fait plutôt qu\'après.',
  [reflectionKey('the-second-account', 'delete-it', 'care')]: 'Ça redirige l\'attention que le compte récoltait vers la personne à qui elle était, en silence, retenue.',
  [reflectionKey('the-second-account', 'keep-and-name-it', 'consequence')]:
    "Le garder tout en nommant sa fonction préserve le comportement, tout en retirant au moins l'aveuglement volontaire qui l'entourait.",
  [reflectionKey('the-second-account', 'keep-and-name-it', 'duty')]: "C'est une honnêteté partielle — honnête envers toi-même, toujours pas honnête envers Dana, et la chambre ne te laisse pas l'oublier.",
  [reflectionKey('the-second-account', 'keep-and-name-it', 'virtue')]: "C'est une forme de conscience de soi plus modeste, plus limitée que celle qu'offrent les autres portes de la chambre.",
  [reflectionKey('the-second-account', 'keep-and-name-it', 'care')]: 'Le côté de Dana dans cette équation reste sans réponse, avec un choix qui ne résout que ta propre conscience.',
  [reflectionKey('the-second-account', 'show-dana', 'consequence')]:
    "La divulgation complète donne à Dana la vraie information sur laquelle repose la relation, à un coût émotionnel réel et immédiat.",
  [reflectionKey('the-second-account', 'show-dana', 'duty')]: "Ça, Dana y avait droit directement, de ta part, plutôt que de le découvrir ou de ne jamais l'apprendre.",
  [reflectionKey('the-second-account', 'show-dana', 'virtue')]: 'C\'est l\'honnêteté dans ce qu\'elle a de plus exposé et de moins confortable, choisie quand même.',
  [reflectionKey('the-second-account', 'show-dana', 'care')]: "Ça traite Dana comme quelqu'un capable d'encaisser la vérité, plutôt que comme quelqu'un à en protéger.",
  [reflectionKey('the-second-account', 'defend-the-category', 'consequence')]:
    "Défendre la catégorie préserve le comportement en rouvrant le débat sur sa définition, plutôt qu'en examinant ses effets.",
  [reflectionKey('the-second-account', 'defend-the-category', 'duty')]: 'Ça substitue un argument sémantique au bilan honnête auquel Dana a vraiment droit.',
  [reflectionKey('the-second-account', 'defend-the-category', 'virtue')]: "Remarque avec quelle rapidité une définition habile peut se substituer à un vrai examen de soi.",
  [reflectionKey('the-second-account', 'defend-the-category', 'care')]: "Ça laisse Dana sans plus d'informations qu'avant le début de cette chambre, quelle que soit la façon dont l'argument se résout.",

  // ---------- The Discovery ----------
  [reflectionKey('the-discovery', 'confront-now', 'consequence')]:
    "Affronter tout de suite, avant que l'un ou l'autre n'ait retrouvé son calme, produit des mots qui survivent à ce qui s'avère finalement vrai.",
  [reflectionKey('the-discovery', 'confront-now', 'duty')]: 'Vous aviez droit, tous les deux, à une conversation menée avec assez de sang-froid pour vraiment vous entendre l\'un l\'autre.',
  [reflectionKey('the-discovery', 'confront-now', 'virtue')]: "Remarque à quel point peu de ce qui s'est dit dans cette cuisine portait réellement sur des faits vérifiés.",
  [reflectionKey('the-discovery', 'confront-now', 'care')]: 'Quelle que soit la vérité, les mots dits sous submersion atteignent Dana quand même, et y restent.',
  [reflectionKey('the-discovery', 'gather-first', 'consequence')]:
    "Vérifier d'abord produit une information plus fiable, au prix de jours passés à surveiller en secret quelqu'un que tu aimes.",
  [reflectionKey('the-discovery', 'gather-first', 'duty')]: 'Ça rassemble des preuves avant d\'accuser, ce qui est plus juste envers Dana, quel que soit ce que ça révèle.',
  [reflectionKey('the-discovery', 'gather-first', 'virtue')]: "Demande-toi ce que le choix d'enquêter en secret sur quelqu'un révèle sur toi, indépendamment de ce que ça révèle sur cette personne.",
  [reflectionKey('the-discovery', 'gather-first', 'care')]: "Dana fait l'objet d'une étude à son insu, pendant des jours, avant même qu'une seule question directe soit posée.",
  [reflectionKey('the-discovery', 'pretend', 'consequence')]:
    "Choisir de ne pas savoir évite une confrontation difficile, tout en laissant sans réponse la situation réelle, quelle qu'elle soit.",
  [reflectionKey('the-discovery', 'pretend', 'duty')]: 'Ça reporte indéfiniment une vérité que Dana te doit peut-être, et que tu te dois peut-être à toi-même.',
  [reflectionKey('the-discovery', 'pretend', 'virtue')]: "C'est une forme sincère, quoique coûteuse, de protection de soi — refuser une dispute que tu n'es pas encore en mesure d'affronter.",
  [reflectionKey('the-discovery', 'pretend', 'care')]: 'Ça laisse inexaminé l\'état réel de la relation, pour le meilleur ou pour le pire, pour vous deux.',
  [reflectionKey('the-discovery', 'walk-tonight', 'consequence')]:
    "Partir résout la crise immédiate sans jamais résoudre la vraie question qui se cache dessous.",
  [reflectionKey('the-discovery', 'walk-tonight', 'duty')]: 'Ça ferme à Dana la possibilité de répondre avant que le jugement ne tombe, quoi que le téléphone ait vraiment signifié.',
  [reflectionKey('the-discovery', 'walk-tonight', 'virtue')]: "C'est un acte réel et coûteux de préservation de soi, quoi que ce soit aussi par ailleurs.",
  [reflectionKey('the-discovery', 'walk-tonight', 'care')]: 'Ça vous prive tous les deux de la conversation qui aurait pu changer ce que ce soir a vraiment signifié.',
  [reflectionKey('the-discovery', 'steady-then-ask', 'consequence')]:
    "Le délai te coûte vingt minutes de non-savoir, et achète une conversation qu'aucun de vous deux n'aura à revenir dessus plus tard.",
  [reflectionKey('the-discovery', 'steady-then-ask', 'duty')]:
    "Dana avait droit à une question directe, pas à un verdict rendu sous submersion ni à un dossier monté en secret — c'est le devoir le plus simple, tenu.",
  [reflectionKey('the-discovery', 'steady-then-ask', 'virtue')]:
    'Choisir de retrouver son calme avant une conversation difficile est une discipline, pas une esquive — ça coûte un vrai effort de le faire sous pression.',
  [reflectionKey('the-discovery', 'steady-then-ask', 'care')]: 'Quelle que soit la vérité, Dana se voit poser la question une fois, clairement, par quelqu\'un capable de vraiment entendre la réponse.',

  // ---------- The Wedding Eve ----------
  [reflectionKey('the-wedding-eve', 'sit-with-it-til-morning', 'consequence')]:
    "Rester avec le doute coûte une nuit blanche, et produit une lecture plus claire de ce dont ce doute parlait vraiment.",
  [reflectionKey('the-wedding-eve', 'sit-with-it-til-morning', 'duty')]: "Ça accorde au doute une écoute honnête, plutôt que de le supprimer ou de lui obéir par réflexe.",
  [reflectionKey('the-wedding-eve', 'sit-with-it-til-morning', 'virtue')]:
    "C'est de la patience sous une vraie pression — ni panique ni faux-semblant, à deux heures du matin, la nuit avant un mariage.",
  [reflectionKey('the-wedding-eve', 'sit-with-it-til-morning', 'care')]:
    "Ça te laisse arriver sur les lieux comme quelqu'un qui a examiné le doute — ce que Dana mérite bien plus que quelqu'un qui l'aurait enterré.",
  [reflectionKey('the-wedding-eve', 'call-someone-honest', 'consequence')]:
    "Appeler quelqu'un d'honnête échange le sommeil d'un·e ami·e contre un regard extérieur qui clarifie, à un moment vraiment décisif.",
  [reflectionKey('the-wedding-eve', 'call-someone-honest', 'duty')]: "Ça respecte l'ampleur de l'engagement de demain assez pour chercher un vrai conseil, plutôt que de décider sans en parler à personne.",
  [reflectionKey('the-wedding-eve', 'call-someone-honest', 'virtue')]: "Ça a demandé d'admettre un doute à voix haute devant quelqu'un d'autre, ce qui exige son propre genre de cran.",
  [reflectionKey('the-wedding-eve', 'call-someone-honest', 'care')]: "Ça traite cette décision comme une décision qui touche assez Dana pour valoir la peine d'être bien prise, même à une heure indue.",
  [reflectionKey('the-wedding-eve', 'answer-the-flame', 'consequence')]:
    "Rouvrir la conversation risque de réintroduire une comparaison que le mariage n'a jamais été construit pour survivre.",
  [reflectionKey('the-wedding-eve', 'answer-the-flame', 'duty')]: "Ça, Dana n'y avait pas droit ce soir, et Dana ignore que c'est arrivé.",
  [reflectionKey('the-wedding-eve', 'answer-the-flame', 'virtue')]: "Remarque ce que ça signifie que cet appel ait semblé nécessaire la nuit précédant un engagement envers quelqu'un d'autre.",
  [reflectionKey('the-wedding-eve', 'answer-the-flame', 'care')]: 'Dana entre dans demain sans savoir que cette conversation a eu lieu ce soir.',
  [reflectionKey('the-wedding-eve', 'postpone', 'consequence')]:
    "Reporter coûte une douleur immense, publique, immédiate, en échange de ne pas se marier sous un doute non résolu.",
  [reflectionKey('the-wedding-eve', 'postpone', 'duty')]: "C'est honnête envers Dana au moment le plus tardif, le plus coûteux possible, plutôt que de ne pas l'être du tout.",
  [reflectionKey('the-wedding-eve', 'postpone', 'virtue')]: "C'est la phrase la plus courageuse que cette chambre puisse offrir, et elle coûte exactement ce que le courage coûte d'habitude.",
  [reflectionKey('the-wedding-eve', 'postpone', 'care')]: "Ça donne à Dana la vérité avant qu'un vœu ne soit prononcé, plutôt qu'après, quoi que ça vous coûte d'autre à tous les deux ce soir.",

  // ---------- The Therapist ----------
  [reflectionKey('the-therapist', 'criticism', 'consequence')]:
    "Reconnaître ce schéma n'efface pas ses occurrences passées, mais change le coût de la prochaine.",
  [reflectionKey('the-therapist', 'criticism', 'duty')]: 'Dana a droit à des reproches sur des comportements précis, pas à des verdicts sur son caractère.',
  [reflectionKey('the-therapist', 'criticism', 'virtue')]: "Ça a demandé de regarder un schéma qui t'appartient, peu flatteur, sans l'excuser aussitôt.",
  [reflectionKey('the-therapist', 'criticism', 'care')]: 'C\'est le cavalier qui use le plus directement la personne qui le reçoit, séance après séance.',
  [reflectionKey('the-therapist', 'contempt', 'consequence')]:
    "Nommer ce schéma coûte un aveu difficile, et ouvre la seule porte dont il est prouvé qu'elle prédit vraiment la réparation.",
  [reflectionKey('the-therapist', 'contempt', 'duty')]: "Le mépris refuse un respect élémentaire auquel Dana a droit, indépendamment du contenu de la dispute.",
  [reflectionKey('the-therapist', 'contempt', 'virtue')]: "C'est la plus dure des quatre portes à franchir honnêtement, ce qui mérite déjà d'être remarqué en soi.",
  [reflectionKey('the-therapist', 'contempt', 'care')]: "C'est le cavalier que la recherche désigne comme le plus corrosif pour la personne qui le reçoit — celui qui coûte le plus cher à Dana.",
  [reflectionKey('the-therapist', 'defensiveness', 'consequence')]:
    "Assumer une part de responsabilité coûte de la fierté, et produit une désescalade disproportionnée.",
  [reflectionKey('the-therapist', 'defensiveness', 'duty')]: 'Dana a droit à la reconnaissance de ta part de responsabilité, pas à une réfutation de la sienne.',
  [reflectionKey('the-therapist', 'defensiveness', 'virtue')]: 'Ça a demandé de déposer un réflexe — l\'envie de contre-attaquer plutôt que d\'accueillir.',
  [reflectionKey('the-therapist', 'defensiveness', 'care')]: "C'est le schéma qui empêche le plus directement Dana de jamais se sentir vraiment écouté.",
  [reflectionKey('the-therapist', 'stonewalling', 'consequence')]:
    "Reconnaître ce schéma de repli ne l'empêche pas de se produire, mais rend disponible la pause annoncée comme solution de remplacement.",
  [reflectionKey('the-therapist', 'stonewalling', 'duty')]: 'Dana a droit à une pause annoncée, pas à un retrait silencieux et inexpliqué.',
  [reflectionKey('the-therapist', 'stonewalling', 'virtue')]: 'Ça a demandé de nommer un mécanisme de défense qui opère habituellement sous le seuil de la conscience.',
  [reflectionKey('the-therapist', 'stonewalling', 'care')]: 'Le fait de revenir compte autant pour Dana que le fait de partir — la chambre insiste sur les deux moitiés de cette compétence.',
  [reflectionKey('the-therapist', 'accept-the-repair', 'consequence')]:
    "Accepter la tentative de réparation désamorce le conflit immédiat, à un coût pratiquement nul.",
  [reflectionKey('the-therapist', 'accept-the-repair', 'duty')]: 'Dana a risqué quelque chose de petit et d\'imparfait pour tendre la main vers toi — l\'accepter honore ce risque.',
  [reflectionKey('the-therapist', 'accept-the-repair', 'virtue')]: 'C\'est la discipline la plus dure — se laisser atteindre, même en pleine dispute.',
  [reflectionKey('the-therapist', 'accept-the-repair', 'care')]: 'Ça donne à l\'effort de Dana un endroit où atterrir, plutôt que de le laisser retomber par principe.',
  [reflectionKey('the-therapist', 'miss-the-repair', 'consequence')]:
    "Laisser passer la réparation maintient l'élan du conflit, au prix d'une désescalade pourtant disponible.",
  [reflectionKey('the-therapist', 'miss-the-repair', 'duty')]: "Ça n'est pas spécifiquement dû à Dana, mais ça refuse bel et bien quelque chose que Dana a offert de bonne foi.",
  [reflectionKey('the-therapist', 'miss-the-repair', 'virtue')]: "Remarque ce que rester dans l'élan de la dispute coûte, à toi autant qu'à Dana.",
  [reflectionKey('the-therapist', 'miss-the-repair', 'care')]: 'La petite tentative nerveuse de Dana reste sans réponse, ce qui a son propre coût silencieux.',

  // ---------- The Usual Room (gate) ----------
  [reflectionKey('the-usual-room', 'defiant-different', 'consequence')]:
    "Prendre l'autre chambre change l'issue de ce soir, sans nécessairement changer le schéma sous-jacent que le registre suivait.",
  [reflectionKey('the-usual-room', 'defiant-different', 'duty')]: 'Ça affirme un droit de choisir, qui est bien réel, quoi que le registre ait prédit sur ce choix.',
  [reflectionKey('the-usual-room', 'defiant-different', 'virtue')]: "C'est la question la plus dure à laisser reposer — savoir si ce défi est de la liberté, ou seulement le schéma déguisé.",
  [reflectionKey('the-usual-room', 'defiant-different', 'care')]: 'Ça ne change rien à ce que vit quiconque d\'autre dans ta vie à cause de ce schéma — seulement la chambre de ce soir.',
  [reflectionKey('the-usual-room', 'refuse-all-rooms', 'consequence')]:
    "Se retirer évite la chambre précise, sans éviter la prédiction plus large du registre sur ton comportement.",
  [reflectionKey('the-usual-room', 'refuse-all-rooms', 'duty')]: 'Ça refuse complètement de participer, ce qui est en soi une réponse légitime, même incomplète.',
  [reflectionKey('the-usual-room', 'refuse-all-rooms', 'virtue')]: "Remarque que même ce refus était, à sa façon, anticipé — ça mérite qu'on s'y attarde plutôt que de le résoudre vite.",
  [reflectionKey('the-usual-room', 'refuse-all-rooms', 'care')]: 'Ça n\'aborde pas la vraie question de savoir si le schéma peut être révisé — ça ne fait que la reporter.',
  [reflectionKey('the-usual-room', 'take-it-knowingly', 'consequence')]:
    "Choisir sciemment la chambre prédite ne change pas l'issue de ce soir, mais change ce que ce choix signifie.",
  [reflectionKey('the-usual-room', 'take-it-knowingly', 'duty')]: "Ça fait de ce choix un choix vraiment tien, plutôt que d'obéir à une prédiction ou de simplement s'y rebeller.",
  [reflectionKey('the-usual-room', 'take-it-knowingly', 'virtue')]:
    "C'est l'intégration la plus dure, la plus silencieuse — accepter qu'un schéma soit réel tout en revendiquant la paternité de son instance de ce soir.",
  [reflectionKey('the-usual-room', 'take-it-knowingly', 'care')]: "C'est la version de ce soir qui ne demande aucun public, aucun défi joué pour quiconque d'autre que toi-même.",
  [reflectionKey('the-usual-room', 'room-with-no-number', 'consequence')]:
    "Choisir la chambre sans numéro contourne l'épreuve centrale de la nuit, plutôt que de la résoudre dans un sens ou dans l'autre.",
  [reflectionKey('the-usual-room', 'room-with-no-number', 'duty')]: "C'est une véritable troisième option, même si le registre avait aussi anticipé celle-là.",
  [reflectionKey('the-usual-room', 'room-with-no-number', 'virtue')]: "C'est une forme d'esquive honnête — refuser de jouer une certitude que tu ne ressens pas vraiment.",
  [reflectionKey('the-usual-room', 'room-with-no-number', 'care')]: 'Ça ne résout rien pour personne d\'autre, mais ça ne coûte rien à personne non plus.',
});
