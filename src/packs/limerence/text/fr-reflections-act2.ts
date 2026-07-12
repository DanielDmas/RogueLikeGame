// French translations for LIMERENCE Act II's Examined Path reflections
// (spec 05). Every line is translated with the specific room's actual
// situation and the choice's real stakes in mind, not word-for-word from
// English — see CLAUDE.md's translation rule. All Act II choices carry a
// reflections field in the English source, so every room appears here.
// Jules gender-neutrality follows the same strategy documented in
// fr-rooms-act2.ts's header: bare-proper-noun constructions, direct address
// with "tu", invariant or nominal phrasing in place of gendered predicate
// adjectives, and avoidance of agreement-triggering past participles
// wherever possible, masculine default only where French grammar leaves no
// real alternative.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'fr', {
  // ---------- The Distance ----------
  [reflectionKey('the-distance', 'confess-the-near-miss', 'consequence')]:
    'Le dire à Jules maintenant, tant que le prix est encore petit, écarte un prix bien plus lourd plus tard, si jamais cela ressortait tout seul.',
  [reflectionKey('the-distance', 'confess-the-near-miss', 'duty')]:
    'Cela, Jules le méritait — non parce que quelque chose s\'est passé, mais parce que quelque chose a failli se passer, et le secret sur les « presque » s\'accumule.',
  [reflectionKey('the-distance', 'confess-the-near-miss', 'virtue')]:
    'C\'est une honnêteté choisie tant qu\'elle était encore évitable, ce qui est le seul genre qui prouve vraiment quelque chose.',
  [reflectionKey('the-distance', 'confess-the-near-miss', 'care')]:
    'Tu as donné à Jules la chance de se sentir en sécurité dans la relation telle qu\'elle est vraiment, pas dans une version arrangée.',
  [reflectionKey('the-distance', 'bury-it', 'consequence')]:
    'Rien ne change ce soir, mais tu viens de prendre unilatéralement une décision sur ce que Jules a le droit de savoir de ta soirée.',
  [reflectionKey('the-distance', 'bury-it', 'duty')]: 'Une omission techniquement vraie reste une omission de quelque chose que Jules voudrait probablement savoir.',
  [reflectionKey('the-distance', 'bury-it', 'virtue')]: 'Remarque avec quelle facilité « il ne s\'est rien passé » est devenu une cachette plutôt qu\'un fait.',
  [reflectionKey('the-distance', 'bury-it', 'care')]:
    'Tu as protégé ton propre confort au prix de la capacité de Jules à faire un choix informé sur cette relation.',
  [reflectionKey('the-distance', 'soften-it', 'consequence')]:
    'La version arrangée règle l\'issue de ce soir tout en fermant discrètement, à l\'avance, toute chance future de raconter la vraie.',
  [reflectionKey('the-distance', 'soften-it', 'duty')]: 'Une vérité partielle présentée comme la vérité entière reste, dans les faits, un mensonge par omission.',
  [reflectionKey('the-distance', 'soften-it', 'virtue')]:
    'C\'est le piège de la vérité au compte-gouttes, déclenché sur toi-même, par toi-même — ça vaut la peine de remarquer à quel point chaque goutte a semblé raisonnable.',
  [reflectionKey('the-distance', 'soften-it', 'care')]: 'On rassure Jules avec une histoire construite pour gérer des sentiments, pas pour les informer.',
  [reflectionKey('the-distance', 'keep-visiting-almost', 'consequence')]:
    'Garder l\'option ouverte ne coûte rien ce soir et change les probabilités de ce qui arrivera au prochain « presque ».',
  [reflectionKey('the-distance', 'keep-visiting-almost', 'duty')]:
    'Cela traite la limite comme une ligne à frôler plutôt qu\'une ligne à tenir — ce à quoi Jules n\'a jamais consenti.',
  [reflectionKey('the-distance', 'keep-visiting-almost', 'virtue')]: 'C\'est la rationalisation examinée à pleine puissance — remarquer le frisson ne le rend pas inoffensif.',
  [reflectionKey('the-distance', 'keep-visiting-almost', 'care')]:
    'Tu as fait passer ton propre frisson ambigu avant la clarté à laquelle Jules a droit sur où tu en es.',

  // ---------- The Hall Pass ----------
  [reflectionKey('the-hall-pass', 'agree-to-keep-peace', 'consequence')]:
    'Accepter sous pression a produit un calme à court terme, au prix d\'un consentement à quelque chose que tu ne voulais en réalité pas.',
  [reflectionKey('the-hall-pass', 'agree-to-keep-peace', 'duty')]:
    'Un consentement donné pour éviter un conflit n\'équivaut pas à un consentement donné librement — Jules méritait ta réponse honnête, pas ta réponse maîtrisée.',
  [reflectionKey('the-hall-pass', 'agree-to-keep-peace', 'virtue')]: 'Remarque l\'écart entre la personne qui a dit oui à voix haute et celle qui a senti son estomac chuter.',
  [reflectionKey('the-hall-pass', 'agree-to-keep-peace', 'care')]:
    'Tu as épargné à Jules une conversation inconfortable ce soir en te portant volontaire pour porter seul le malaise, indéfiniment.',
  [reflectionKey('the-hall-pass', 'true-no', 'consequence')]:
    'Un non clair ferme complètement l\'arrangement, au prix d\'une conversation plus dure qu\'aucun de vous deux n\'évitait gratuitement.',
  [reflectionKey('the-hall-pass', 'true-no', 'duty')]: '« Je n\'ai pas envie de ça » est une phrase complète, et Jules méritait la vraie, pas la polie.',
  [reflectionKey('the-hall-pass', 'true-no', 'virtue')]: 'Il a fallu plus de cran pour sonner mesquin que pour sonner détendu — ça vaut la peine de le remarquer sur toi-même.',
  [reflectionKey('the-hall-pass', 'true-no', 'care')]: 'Tu as confié à Jules ton sentiment réel plutôt que de gérer sa réaction à un sentiment joué.',
  [reflectionKey('the-hall-pass', 'counter-with-need', 'consequence')]:
    'Nommer des besoins, plutôt qu\'accepter ou refuser un arrangement tout fait, produit quelque chose que vous pouvez tous les deux réellement garder.',
  [reflectionKey('the-hall-pass', 'counter-with-need', 'duty')]:
    'Cela traite la conversation comme une négociation entre égaux, plutôt qu\'un cadeau que l\'un de vous accepte ou refuse.',
  [reflectionKey('the-hall-pass', 'counter-with-need', 'virtue')]:
    'C\'est le geste le plus dur, le plus mûr — remplacer une proposition par tes propres conditions plutôt que d\'évaluer celles de quelqu\'un d\'autre.',
  [reflectionKey('the-hall-pass', 'counter-with-need', 'care')]:
    'Tu as donné à Jules la chance de comprendre ce dont tu as vraiment besoin, pas seulement ce que tu es prêt à tolérer.',
  [reflectionKey('the-hall-pass', 'take-it-angrily', 'consequence')]:
    'Utiliser l\'arrangement par dépit ne résout pas le problème initial et en crée un second, auto-infligé.',
  [reflectionKey('the-hall-pass', 'take-it-angrily', 'duty')]: 'Cela emploie un « cadeau » comme une arme contre quelqu\'un qui l\'avait offert de bonne foi, aussi maladroitement que ce soit.',
  [reflectionKey('the-hall-pass', 'take-it-angrily', 'virtue')]:
    'Demande-toi ce que cela révèle de l\'écart entre ce à quoi tu as dit oui et ce que tu as réellement fait de ce oui.',
  [reflectionKey('the-hall-pass', 'take-it-angrily', 'care')]: 'Jules est puni à l\'avance pour un sentiment que tu n\'as jamais réellement exprimé.',

  // ---------- The Rebound ----------
  [reflectionKey('the-rebound', 'tell-her-what-this-is', 'consequence')]:
    'Lui dire la vérité maintenant coûte à la relation sa forme confortable actuelle, en échange de sa capacité à choisir avec une vraie information.',
  [reflectionKey('the-rebound', 'tell-her-what-this-is', 'duty')]:
    'Elle méritait un compte-rendu exact de ce que c\'est pour toi avant d\'investir davantage dans une histoire que tu savais incomplète.',
  [reflectionKey('the-rebound', 'tell-her-what-this-is', 'virtue')]:
    'Cela demandait de nommer à voix haute une vérité peu flatteuse sur toi-même, à la personne que ça concerne le plus.',
  [reflectionKey('the-rebound', 'tell-her-what-this-is', 'care')]: 'Tu as rendu à Mira le pouvoir d\'agir que ton silence lui retirait discrètement.',
  [reflectionKey('the-rebound', 'let-her-believe', 'consequence')]:
    'Rester silencieux a laissé la relation s\'approfondir sur de fausses prémisses, ce qui rend le règlement de comptes final plus lourd, pas plus léger.',
  [reflectionKey('the-rebound', 'let-her-believe', 'duty')]: 'La laisser tomber plus profondément tout en sachant ce que tu ressens vraiment lui cache une information à laquelle elle a droit.',
  [reflectionKey('the-rebound', 'let-her-believe', 'virtue')]:
    'Remarque avec quelle facilité tu as choisi le confort plutôt qu\'une honnêteté plus dure, et à quel point la dette s\'est alourdie avec le délai.',
  [reflectionKey('the-rebound', 'let-her-believe', 'care')]: 'Son attachement grandissant est dépensé comme ton anesthésie, sans qu\'elle le sache ni y consente.',
  [reflectionKey('the-rebound', 'end-it', 'consequence')]: 'Y mettre fin maintenant plafonne le tort à sa taille actuelle, plus petite, plutôt que de le laisser s\'accumuler.',
  [reflectionKey('the-rebound', 'end-it', 'duty')]:
    'Cela fait passer son bien-être à long terme avant ton confort à court terme, ce que la situation lui devait réellement.',
  [reflectionKey('the-rebound', 'end-it', 'virtue')]: 'Cela a demandé un vrai cran — choisir délibérément le sentiment le plus dur pour toi afin de lui épargner le plus grand.',
  [reflectionKey('the-rebound', 'end-it', 'care')]: 'Tu as reposé l\'anesthésiant et laissé chacun de vous ressentir ce qui était vraiment là — ce qui est en soi une forme de respect.',
  [reflectionKey('the-rebound', 'try-to-catch-up', 'consequence')]:
    'Essayer de rattraper le sentiment émotionnellement est une vraie stratégie aux probabilités réelles et imprévisibles — la chambre ne prétend pas le contraire.',
  [reflectionKey('the-rebound', 'try-to-catch-up', 'duty')]: 'Cela tente au moins de répondre à ce qu\'elle offre plutôt que d\'en profiter ou d\'y mettre fin abruptement.',
  [reflectionKey('the-rebound', 'try-to-catch-up', 'virtue')]: 'C\'est un effort sincère dans l\'incertitude, ce qui est réellement différent de l\'honnêteté comme de l\'évitement.',
  [reflectionKey('the-rebound', 'try-to-catch-up', 'care')]: 'Mira ignore toujours l\'écart de départ que tu essaies de rattraper, ce qu\'elle voudrait probablement savoir.',

  // ---------- The Unicorn ----------
  [reflectionKey('the-unicorn', 'obey-the-rules', 'consequence')]:
    'Accepter les règles telles que données a produit de vrais bons mois, au prix de protections que tu n\'as en réalité jamais eues.',
  [reflectionKey('the-unicorn', 'obey-the-rules', 'duty')]:
    'Des règles que tu n\'as jamais aidé à écrire ne méritaient jamais le même respect que celles négociées en ta présence.',
  [reflectionKey('the-unicorn', 'obey-the-rules', 'virtue')]: 'Remarque combien il était confortable de laisser deux personnes plus expérimentées définir les conditions de ta propre participation.',
  [reflectionKey('the-unicorn', 'obey-the-rules', 'care')]:
    'Le confort du couple a été structurellement protégé du début à la fin, d\'une manière que le tien n\'a jamais été — ça vaut la peine de le dire clairement.',
  [reflectionKey('the-unicorn', 'renegotiate', 'consequence')]:
    'Insister pour renégocier met à l\'épreuve l\'honnêteté de l\'arrangement, au prix de laisser la version facile se poursuivre sans être examinée.',
  [reflectionKey('the-unicorn', 'renegotiate', 'duty')]: 'Tu avais droit à un mot à dire sur des conditions qui régissaient ta propre participation, et tu as réclamé ce qui t\'était dû.',
  [reflectionKey('the-unicorn', 'renegotiate', 'virtue')]: 'C\'est l\'intégrité la plus dure, la plus inconfortable — risquer quelque chose de bien pour découvrir si c\'était vraiment juste.',
  [reflectionKey('the-unicorn', 'renegotiate', 'care')]: 'Tu as donné à la relation, et à toi-même, la chance d\'être autre chose que ce qui était supposé par défaut.',
  [reflectionKey('the-unicorn', 'discover-we-come-first', 'consequence')]:
    'Rester assez longtemps pour apprendre la hiérarchie à la dure t\'a coûté une nuit et t\'a donné une information qu\'aucune conversation n\'avait donnée.',
  [reflectionKey('the-unicorn', 'discover-we-come-first', 'duty')]:
    'Tu méritais un compte-rendu plus clair de la hiérarchie avant d\'investir dans un arrangement qui supposait que tu la connaissais déjà.',
  [reflectionKey('the-unicorn', 'discover-we-come-first', 'virtue')]:
    'Il existe une forme de connaissance de soi qui n\'arrive qu\'à travers le prix à payer, pas autour — c\'est cela, honnêtement chiffré.',
  [reflectionKey('the-unicorn', 'discover-we-come-first', 'care')]: 'Remarque que les larmes de Maja et ton trajet en taxi n\'ont jamais pesé le même poids dans la chambre que le couple a construite.',
  [reflectionKey('the-unicorn', 'decline-kindly', 'consequence')]:
    'Décliner supprime tout le risque de l\'arrangement, au prix de l\'appartenance et de la chaleur qu\'il offrait réellement.',
  [reflectionKey('the-unicorn', 'decline-kindly', 'duty')]: 'Tu leur devais une raison honnête plutôt qu\'une disparition, et tu leur en as donné une.',
  [reflectionKey('the-unicorn', 'decline-kindly', 'virtue')]: 'C\'est un non réfléchi, atteint en raisonnant sur la structure plutôt qu\'en réagissant à l\'offre.',
  [reflectionKey('the-unicorn', 'decline-kindly', 'care')]: 'Tu t\'es épargné une position qui, par sa propre conception, n\'allait jamais être structurellement égale.',

  // ---------- Just Friends ----------
  [reflectionKey('just-friends', 'open-window', 'consequence')]:
    'La révélation complète permet à Jules de prendre une décision informée sur la relation telle qu\'elle est vraiment, au prix d\'une conversation immédiate et inconfortable.',
  [reflectionKey('just-friends', 'open-window', 'duty')]: 'Jules méritait le classement, pas seulement le fait de l\'amitié — le classement est la partie qui était réellement cachée.',
  [reflectionKey('just-friends', 'open-window', 'virtue')]: 'C\'est l\'honnêteté la plus difficile — nommer un schéma sur toi-même, pas seulement un événement.',
  [reflectionKey('just-friends', 'open-window', 'care')]:
    'Tu as choisi la clarté de Jules plutôt que le confort d\'Alena et le tien, ce qui est la vraie forme de loyauté que cette chambre met à l\'épreuve.',
  [reflectionKey('just-friends', 'nothing-to-tell', 'consequence')]:
    'Garder le dossier fermé évite une conversation difficile tout en accumulant en silence ce qu\'une future conversation devrait couvrir.',
  [reflectionKey('just-friends', 'nothing-to-tell', 'duty')]: 'Classer une amitié porteuse dans « rien à raconter » est une décision prise à propos de Jules, sans Jules.',
  [reflectionKey('just-friends', 'nothing-to-tell', 'virtue')]: 'Remarque combien chaque soirée individuelle semblait trop petite pour être mentionnée, et ce que ça finit par totaliser.',
  [reflectionKey('just-friends', 'nothing-to-tell', 'care')]: 'On refuse à Jules la même information qu\'Alena accumule en silence — c\'est le déséquilibre qui constitue le vrai tort.',
  [reflectionKey('just-friends', 'test-the-evening', 'consequence')]:
    'Organiser le déni plausible produit exactement le résultat ambigu que tu as construit pour l\'obtenir — ce qui était précisément le but, et le problème.',
  [reflectionKey('just-friends', 'test-the-evening', 'duty')]: 'Un test délibérément ambigu est une façon d\'agir sans la responsabilité d\'avoir décidé.',
  [reflectionKey('just-friends', 'test-the-evening', 'virtue')]:
    'C\'est la rationalisation à pleine puissance, examinée honnêtement — le déni plausible était le plan, pas un effet secondaire.',
  [reflectionKey('just-friends', 'test-the-evening', 'care')]: 'Jules et Alena méritent tous les deux plus de clarté qu\'une soirée construite précisément pour n\'en produire aucune.',
  [reflectionKey('just-friends', 'name-it-set-boundary', 'consequence')]:
    'Nommer la limite directement à Alena résout l\'ambiguïté à sa source plutôt que de gérer ses symptômes avec Jules.',
  [reflectionKey('just-friends', 'name-it-set-boundary', 'duty')]: 'Alena méritait autant l\'honnêteté sur ce qui se passait que Jules — cela règle les deux dettes à la fois.',
  [reflectionKey('just-friends', 'name-it-set-boundary', 'virtue')]: 'Cela demandait de nommer quelque chose d\'inconfortable sur toi-même, à la personne à qui c\'est le plus difficile de le dire.',
  [reflectionKey('just-friends', 'name-it-set-boundary', 'care')]:
    'Tu as protégé l\'amitié en étant honnête avec ton amie, plutôt que de la protéger en restant vague avec tout le monde.',

  // ---------- The Ex ----------
  [reflectionKey('the-ex', 'reread-everything', 'consequence')]:
    'Tout relire a coûté trois jours d\'une comparaison injuste, pour aucune information que tu n\'avais pas déjà, à un certain niveau.',
  [reflectionKey('the-ex', 'reread-everything', 'duty')]: 'C\'est un acte privé, sans prétention directe sur quelqu\'un d\'autre, même si ses répercussions retombent sur Jules quand même.',
  [reflectionKey('the-ex', 'reread-everything', 'virtue')]: 'Remarque avec quelle facilité tu as laissé un souvenir arrangé l\'emporter sur la relation réelle et compliquée dans laquelle tu es maintenant.',
  [reflectionKey('the-ex', 'reread-everything', 'care')]: 'On compare Jules, à son insu, à un montage des meilleurs moments — ce qui n\'est une compétition juste pour personne.',
  [reflectionKey('the-ex', 'answer-her', 'consequence')]:
    'Répondre rouvre un canal dont tu connais déjà intimement les risques par expérience, à un prix réel bien que difficile à chiffrer.',
  [reflectionKey('the-ex', 'answer-her', 'duty')]: 'Cela s\'est fait à l\'insu de Jules, ce qui est en soi le choix qui mérite d\'être examiné, indépendamment du contenu.',
  [reflectionKey('the-ex', 'answer-her', 'virtue')]: 'Demande-toi honnêtement si « juste parler » a jamais été tout le plan, ou la première phrase d\'un plan plus long.',
  [reflectionKey('the-ex', 'answer-her', 'care')]: 'Jules est en train de rire devant la télé en ce moment, sans savoir qu\'une décision qui concerne la relation se prend dans la pièce d\'à côté.',
  [reflectionKey('the-ex', 'block', 'consequence')]:
    'Bloquer élimine le risque au prix de toute information — clôture, clarté, ou autre — que l\'échange aurait pu offrir.',
  [reflectionKey('the-ex', 'block', 'duty')]: 'Cela protège l\'intégrité de la relation actuelle sans que Jules ait à gérer la situation d\'une quelconque façon.',
  [reflectionKey('the-ex', 'block', 'virtue')]: 'C\'est un acte décisif, protecteur de soi, choisi nettement plutôt que subi.',
  [reflectionKey('the-ex', 'block', 'care')]: 'Tu as pris la décision unilatéralement plutôt que d\'y associer Jules — une protection privée que Jules ne saura jamais avoir reçue.',
  [reflectionKey('the-ex', 'tell-jules', 'consequence')]: 'Le partager immédiatement transforme un risque privé en décision partagée, au prix d\'un moment d\'exposition inconfortable.',
  [reflectionKey('the-ex', 'tell-jules', 'duty')]:
    'Jules méritait l\'information dès l\'instant où tu l\'avais, pas après que tu avais déjà décidé seul quoi en faire.',
  [reflectionKey('the-ex', 'tell-jules', 'virtue')]: 'C\'est l\'intimité choisie plutôt que l\'instinct — se tourner par défaut vers l\'option la plus dure, la plus exposée.',
  [reflectionKey('the-ex', 'tell-jules', 'care')]: 'Tu as donné à Jules un mot à dire sur quelque chose qui le concerne directement, au lieu de gérer cela à sa place.',

  // ---------- The Confession ----------
  [reflectionKey('the-confession', 'confess', 'consequence')]:
    'La révélation complète donne à Jules la vraie information sur laquelle sa propre vie se construit, au prix d\'une douleur qu\'un silence en apparence plus doux n\'aurait fait que reporter, pas prévenir.',
  [reflectionKey('the-confession', 'confess', 'duty')]: 'Jules a droit à la vérité de la relation réellement vécue — c\'est ce droit, honoré, même tardivement.',
  [reflectionKey('the-confession', 'confess', 'virtue')]: 'C\'est l\'honnêteté choisie dans sa forme la plus coûteuse, ce qui est généralement le seul test qui compte vraiment.',
  [reflectionKey('the-confession', 'confess', 'care')]:
    'Tu as transféré à Jules ta certitude du fait, mais tu es resté et tu as porté les suites avec Jules plutôt que de le laisser les traverser seul.',
  [reflectionKey('the-confession', 'carry-it', 'consequence')]:
    'Le porter seul épargne à Jules une douleur précise, au prix d\'un poids permanent et inégal que toi seul ressentiras jamais.',
  [reflectionKey('the-confession', 'carry-it', 'duty')]:
    'Cela peut se lire comme un vrai sacrifice de soi pour Jules, ou comme la rétention d\'une information que Jules voudrait avoir — la chambre refuse de trancher entre les deux lectures.',
  [reflectionKey('the-confession', 'carry-it', 'virtue')]: 'C\'est une vraie retenue, soutenue dans la durée — choisir le fardeau privé, plus lourd, plutôt que le soulagement public, plus léger.',
  [reflectionKey('the-confession', 'carry-it', 'care')]: 'Demande-toi honnêtement si le silence protège Jules, ou s\'il protège la relation telle qu\'elle existe actuellement, confortablement, pour toi.',
  [reflectionKey('the-confession', 'trickle', 'consequence')]: 'Une confession adoucie gère la réaction de ce soir, au prix d\'un règlement de comptes plus grand et cumulatif plus tard.',
  [reflectionKey('the-confession', 'trickle', 'duty')]: 'Une confession partielle cache encore à Jules la vérité entière qui lui est due, déguisée en honnêteté.',
  [reflectionKey('the-confession', 'trickle', 'virtue')]:
    'C\'est le piège de la vérité au compte-gouttes, reconnu cette fois-ci — et choisi quand même, ce qui en dit long sur toi-même.',
  [reflectionKey('the-confession', 'trickle', 'care')]: 'Chaque révision future coûtera à Jules une nouvelle blessure évitable qu\'une seule conversation difficile ce soir aurait empêchée.',
  [reflectionKey('the-confession', 'let-it-surface', 'consequence')]:
    'Attendre une découverte accidentelle te retire tout pouvoir d\'agir sur l\'issue, sans réellement réduire le coût final.',
  [reflectionKey('the-confession', 'let-it-surface', 'duty')]: 'Cela reporte une dette réellement due, plutôt que de la régler ou de te la pardonner consciemment à toi-même.',
  [reflectionKey('the-confession', 'let-it-surface', 'virtue')]: 'C\'est de l\'évitement déguisé en destin — ça vaut la peine de le nommer clairement, à toi-même, dès maintenant.',
  [reflectionKey('the-confession', 'let-it-surface', 'care')]:
    'Quel que soit le moment où cela ressort, Jules l\'apprendra dans les pires circonstances possibles — et ce choix rend cela plus probable, pas moins.',

  // ---------- The Other Side of the Door ----------
  [reflectionKey('the-other-side-of-the-door', 'continue', 'consequence')]:
    'Continuer préserve quelque chose qui compte vraiment pour toi, à un coût continu et croissant pour une troisième personne qui n\'a jamais consenti à rien de tout cela.',
  [reflectionKey('the-other-side-of-the-door', 'continue', 'duty')]:
    'Tu n\'as fait aucun serment, c\'est vrai, et cela ne règle pas la question de savoir si permettre sciemment à quelqu\'un d\'autre de rompre les siens est en soi condamnable.',
  [reflectionKey('the-other-side-of-the-door', 'continue', 'virtue')]: 'Remarque quelles habitudes de dissimulation tu as adoptées sans jamais l\'avoir consciemment décidé.',
  [reflectionKey('the-other-side-of-the-door', 'continue', 'care')]: 'La femme derrière le mur n\'est jamais consultée, jamais informée, et ne cesse jamais d\'être réelle simplement parce qu\'elle n\'est jamais vue.',
  [reflectionKey('the-other-side-of-the-door', 'end-it', 'consequence')]:
    'Y mettre fin retire ta propre contribution continue au tort, au prix d\'un deuil que tu devras porter sans reconnaissance publique.',
  [reflectionKey('the-other-side-of-the-door', 'end-it', 'duty')]:
    'Cela met fin à ta propre participation consciente, sans exiger de Viktor une décision qu\'il n\'aurait de toute façon jamais prise proprement.',
  [reflectionKey('the-other-side-of-the-door', 'end-it', 'virtue')]: 'C\'est une intégrité silencieuse, sans témoin — choisir la sortie la plus dure précisément parce que personne ne regarde pour la récompenser.',
  [reflectionKey('the-other-side-of-the-door', 'end-it', 'care')]: 'Cela n\'efface pas ce que la femme derrière le mur a déjà vécu, mais cela cesse d\'y ajouter.',
  [reflectionKey('the-other-side-of-the-door', 'tell-her', 'consequence')]:
    'Le lui dire lui donne l\'information pour faire de vrais choix sur sa propre vie, à un coût pour Viktor et pour toi-même que tu ne contrôles pas entièrement.',
  [reflectionKey('the-other-side-of-the-door', 'tell-her', 'duty')]:
    'Elle méritait la vérité sur son propre mariage, indépendamment des motifs ou de la position de la personne qui l\'apportait.',
  [reflectionKey('the-other-side-of-the-door', 'tell-her', 'virtue')]: 'Cela demandait un vrai courage, quel qu\'ait été le mélange de motifs qui l\'a produit — l\'acte et le motif ne sont pas la même question.',
  [reflectionKey('the-other-side-of-the-door', 'tell-her', 'care')]:
    'C\'est le seul choix de cet étage qui la place directement au centre, plutôt que de gérer la situation autour d\'elle.',
  [reflectionKey('the-other-side-of-the-door', 'demand-choice', 'consequence')]:
    'Un ultimatum force une clarification, au prix de céder entièrement la vraie décision à quelqu\'un qui a déjà montré qu\'il peut mener deux vies à la fois.',
  [reflectionKey('the-other-side-of-the-door', 'demand-choice', 'duty')]:
    'Exiger qu\'il choisisse est juste envers lui, mais cela ne te décharge pas à lui seul de ta propre responsabilité dans la situation.',
  [reflectionKey('the-other-side-of-the-door', 'demand-choice', 'virtue')]:
    'Remarque ce que ce choix révèle sur le fait de vouloir une clarification plutôt que de vouloir être celui ou celle qui agit.',
  [reflectionKey('the-other-side-of-the-door', 'demand-choice', 'care')]:
    'L\'ultimatum centre ta propre certitude, pas le bien-être de l\'épouse, que ce choix laisse de toute façon entièrement en suspens.',

  // ---------- The Scoreboard (gate) ----------
  [reflectionKey('the-scoreboard', 'prosecute', 'consequence')]:
    'L\'interrogatoire achète une certitude sur des faits que tu connaissais déjà techniquement, à un coût réel et continu pour la confiance et pour ton propre repos.',
  [reflectionKey('the-scoreboard', 'prosecute', 'duty')]:
    'Le passé ne te doit rien de plus ; il a été révélé une fois, honnêtement, et le renégocier traite cette honnêteté comme si elle n\'avait pas suffi.',
  [reflectionKey('the-scoreboard', 'prosecute', 'virtue')]: 'Remarque quel genre de partenaire un nombre a fait de toi, en une seule audience.',
  [reflectionKey('the-scoreboard', 'prosecute', 'care')]: 'Jules doit revivre et rejustifier un passé antérieur à toi, selon ton calendrier, pour ton soulagement.',
  [reflectionKey('the-scoreboard', 'dismiss-with-prejudice', 'consequence')]:
    'Classer l\'affaire n\'efface pas le nombre mais lui retire le pouvoir de continuer à coûter quelque chose à la relation actuelle.',
  [reflectionKey('the-scoreboard', 'dismiss-with-prejudice', 'duty')]: 'Tu ne dois au passé aucune poursuite supplémentaire — il a déjà répondu honnêtement, une fois, quand on le lui a demandé.',
  [reflectionKey('the-scoreboard', 'dismiss-with-prejudice', 'virtue')]: 'C\'est l\'acceptation comme discipline exercée, pas un sentiment que tu attends de voir arriver.',
  [reflectionKey('the-scoreboard', 'dismiss-with-prejudice', 'care')]:
    'Tu cesses de faire répondre Jules d\'une version de Jules antérieure à toi — ce qui est précisément ce qui lui était dû.',
  [reflectionKey('the-scoreboard', 'testify-against-yourself', 'consequence')]:
    'Examiner ton propre double standard ne change aucun des deux nombres, mais cela change ce que cet écart a le droit de coûter à la relation.',
  [reflectionKey('the-scoreboard', 'testify-against-yourself', 'duty')]:
    'L\'équité exige d\'appliquer à toi-même le même critère que tu appliques à Jules — ce choix fait exactement cela.',
  [reflectionKey('the-scoreboard', 'testify-against-yourself', 'virtue')]: 'C\'est un vrai examen de soi, inconfortable, appliqué exactement là où il est le moins flatteur.',
  [reflectionKey('the-scoreboard', 'testify-against-yourself', 'care')]: 'Cela épargne à Jules le poids d\'un critère auquel tu n\'étais toi-même pas prêt à te tenir.',
  [reflectionKey('the-scoreboard', 'ask-what-verdict-frees', 'consequence')]:
    'Nommer qu\'aucun verdict n\'aiderait vraiment recadre toute l\'audience comme ingagnable dès le départ — ce qui est précisément l\'information utile.',
  [reflectionKey('the-scoreboard', 'ask-what-verdict-frees', 'duty')]: 'Cela ne doit rien de plus au passé, parce que cela reconnaît correctement que rien de plus n\'a jamais été dû.',
  [reflectionKey('the-scoreboard', 'ask-what-verdict-frees', 'virtue')]:
    'C\'est la forme de lucidité la plus rare de toute l\'audience — reconnaître que le procès lui-même était le dysfonctionnement, pas son issue.',
  [reflectionKey('the-scoreboard', 'ask-what-verdict-frees', 'care')]:
    'Tu cesses de faire comparaître qui que ce soit, toi-même y compris, pour une question qui n\'a jamais vraiment eu de réponse chiffrable.',
});
