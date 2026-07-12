// French translations for LIMERENCE Act I's Examined Path reflections (spec
// 05). Every line is translated with the specific room's actual situation
// and the choice's real stakes in mind, not word-for-word from English —
// see CLAUDE.md's translation rule and fr-rooms.ts's header for the tu/vous
// decision (informal "tu" throughout). The-front-desk (prologue) and
// the-summer-ends have no reflections field on any choice in the English
// source, so neither room appears here.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'fr', {
  // ---------- The Read Receipt ----------
  [reflectionKey('the-read-receipt', 'double-text', 'consequence')]:
    'Deux messages de plus ne font pas arriver la réponse plus vite — ils rendent seulement le silence, quand il se brise, plus difficile à lire.',
  [reflectionKey('the-read-receipt', 'double-text', 'duty')]: 'Tu lui dois de la patience, pas une seconde sommation.',
  [reflectionKey('the-read-receipt', 'double-text', 'virtue')]:
    'Remarque le genre de partenaire que la panique fait de toi, à une heure du matin, seul.',
  [reflectionKey('the-read-receipt', 'double-text', 'care')]:
    'Elle est quelque part, ce soir, avec une raison qui lui appartient — une raison qui n\'a rien à voir non plus avec ce deuxième message.',
  [reflectionKey('the-read-receipt', 'drawer', 'consequence')]:
    'Le résultat n\'a jamais été entre tes mains ce soir ; l\'accepter n\'a rien changé au matin, et tout changé à la nuit.',
  [reflectionKey('the-read-receipt', 'drawer', 'duty')]: 'Personne n\'avait droit à un message qu\'il n\'avait pas encore mérité.',
  [reflectionKey('the-read-receipt', 'drawer', 'virtue')]:
    'C\'est la discipline la plus dure, la plus silencieuse — tolérer un sentiment au lieu de le décharger sur quelqu\'un d\'autre.',
  [reflectionKey('the-read-receipt', 'drawer', 'care')]:
    'Tu lui as laissé une soirée ordinaire, sans surveillance — un petit cadeau en soi.',
  [reflectionKey('the-read-receipt', 'bait', 'consequence')]:
    'Une réponse obtenue par une urgence fabriquée ne prouve rien, sinon que l\'urgence obtient des réponses.',
  [reflectionKey('the-read-receipt', 'bait', 'duty')]:
    'Une relation qui fonctionne à coups de tests est une relation d\'où l\'honnêteté est discrètement sortie.',
  [reflectionKey('the-read-receipt', 'bait', 'virtue')]:
    'C\'est la première petite répétition de la personne qui gère les gens au lieu de leur faire confiance.',
  [reflectionKey('the-read-receipt', 'bait', 'care')]:
    'Elle a répondu à une peur, pas à une question que tu lui as réellement posée.',
  [reflectionKey('the-read-receipt', 'ask-tomorrow', 'consequence')]:
    'Une seule conversation a résolu ce qu\'une douzaine de séances à fixer les trois petits points n\'avaient pas pu résoudre.',
  [reflectionKey('the-read-receipt', 'ask-tomorrow', 'duty')]:
    'Une question directe vous respecte tous les deux davantage qu\'un silence décodé.',
  [reflectionKey('the-read-receipt', 'ask-tomorrow', 'virtue')]:
    'Attendre la vraie réponse, au lieu d\'en fabriquer une, est une forme de courage à part entière.',
  [reflectionKey('the-read-receipt', 'ask-tomorrow', 'care')]:
    'Tu l\'as laissée s\'expliquer avec ses propres mots, en plein jour, sans embuscade.',

  // ---------- The Screenshot ----------
  [reflectionKey('the-screenshot', 'tell-nadia', 'consequence')]:
    'Nadia a désormais l\'information dont elle a besoin pour agir — quel que soit le mal que fait la vérité, il allait de toute façon finir par arriver ; tu n\'as choisi que le moment.',
  [reflectionKey('the-screenshot', 'tell-nadia', 'duty')]: 'Elle y avait droit, simplement, sans qu\'on la consulte.',
  [reflectionKey('the-screenshot', 'tell-nadia', 'virtue')]:
    'C\'est la loyauté la plus difficile — envers la personne qu\'on trompe, pas envers celle que tu connais depuis plus longtemps.',
  [reflectionKey('the-screenshot', 'tell-nadia', 'care')]:
    'Tu as placé au centre la personne réellement blessée, et non les deux amitiés qui en sortiront abîmées.',
  [reflectionKey('the-screenshot', 'confront-tom', 'consequence')]:
    'Laisser d\'abord le choix à Tom ne change que qui parle, pas le fait que Nadia finira par savoir.',
  [reflectionKey('the-screenshot', 'confront-tom', 'duty')]:
    'Tu as donné à ton ami une chance de réparer les choses lui-même avant de lui retirer la décision.',
  [reflectionKey('the-screenshot', 'confront-tom', 'virtue')]:
    'Un ultimatum n\'a d\'intégrité que si tu es vraiment prêt à aller jusqu\'au bout — demande-toi, honnêtement, si c\'est le cas.',
  [reflectionKey('the-screenshot', 'confront-tom', 'care')]:
    'Tu as essayé de protéger deux relations à la fois, et cette tentative te coûte une conversation plus difficile.',
  [reflectionKey('the-screenshot', 'stay-out', 'consequence')]:
    'Rester en dehors ne t\'enlève pas au résultat ; ça t\'enlève seulement la possibilité d\'influencer lequel se produit.',
  [reflectionKey('the-screenshot', 'stay-out', 'duty')]:
    'Le silence, ici, est aussi un choix avec une destinataire — Nadia ne sait simplement pas qu\'il a été fait pour elle.',
  [reflectionKey('the-screenshot', 'stay-out', 'virtue')]:
    'Demande-toi quel genre d\'ami « ce ne sont pas mes affaires » fait de toi, pour l\'amie réellement trompée.',
  [reflectionKey('the-screenshot', 'stay-out', 'care')]:
    'Tu t\'es épargné une conversation difficile, au prix d\'une conversation que quelqu\'un d\'autre méritait d\'avoir.',
  [reflectionKey('the-screenshot', 'verify-first', 'consequence')]:
    'Vérifier a réduit le risque d\'agir sur une chose fausse, au prix réel d\'agir plus tard que tu n\'aurais pu.',
  [reflectionKey('the-screenshot', 'verify-first', 'duty')]:
    'La rigueur est une vertu, mais pas une qui excuse le retard envers la personne encore dans l\'ignorance.',
  [reflectionKey('the-screenshot', 'verify-first', 'virtue')]:
    'La prudence peut être une forme d\'évitement déguisée en sens des responsabilités.',
  [reflectionKey('the-screenshot', 'verify-first', 'care')]:
    'L\'heure supplémentaire n\'a rien coûté à Nadia qu\'elle ne sache déjà ne pas savoir — mais elle t\'a coûté, à toi, la possibilité de contrôler la façon dont elle l\'apprendrait.',

  // ---------- The Password ----------
  [reflectionKey('the-password', 'give-it', 'consequence')]:
    'Le résultat immédiat — une semaine plus calme — est réel ; le résultat à long terme, une habitude d\'autocensure, l\'est tout autant, et la pièce te montre les deux.',
  [reflectionKey('the-password', 'give-it', 'duty')]:
    'Une clé donnée par peur plutôt que par liberté n\'a jamais vraiment reçu le consentement de la part de toi qui hésitait.',
  [reflectionKey('the-password', 'give-it', 'virtue')]:
    'Remarque qui tu deviens quand chaque message est écrit en pensant à un lecteur silencieux.',
  [reflectionKey('the-password', 'give-it', 'care')]:
    'Tu as comblé la distance qu\'elle te demandait de combler, mais la façon dont tu l\'as fait en a construit une autre à la place.',
  [reflectionKey('the-password', 'refuse-flat', 'consequence')]:
    'Une limite tenue coûte quelque chose maintenant, et évite quelque chose de pire plus tard — la pièce chiffre les deux, honnêtement.',
  [reflectionKey('the-password', 'refuse-flat', 'duty')]: 'Tu lui devais de l\'attention, pas un accès.',
  [reflectionKey('the-password', 'refuse-flat', 'virtue')]:
    'C\'est l\'intégrité la plus dure, la moins confortable — celle qui risque la relation pour préserver le soi.',
  [reflectionKey('the-password', 'refuse-flat', 'care')]:
    'Un non net, formulé sans mépris, laisse quand même la place pour que sa peur soit prise en compte autrement.',
  [reflectionKey('the-password', 'transparency-not-surveillance', 'consequence')]:
    'Répondre à toute question, honnêtement, produit le même apaisement qu\'un mot de passe — sans le coût permanent.',
  [reflectionKey('the-password', 'transparency-not-surveillance', 'duty')]:
    'Tu as offert exactement ce qui était dû : la franchise. Pas exactement ce qui était demandé : l\'accès.',
  [reflectionKey('the-password', 'transparency-not-surveillance', 'virtue')]:
    'C\'est la forme la plus stable, la moins spectaculaire, de fiabilité — disponible, pas surveillée.',
  [reflectionKey('the-password', 'transparency-not-surveillance', 'care')]:
    'Tu as répondu à sa peur par ta présence, et non par ton intimité.',
  [reflectionKey('the-password', 'demand-hers', 'consequence')]:
    'La symétrie n\'annule pas le coût de la surveillance ; elle se contente de le répartir entre vous deux.',
  [reflectionKey('the-password', 'demand-hers', 'duty')]: 'Égaler une mauvaise demande n\'équivaut pas à la refuser.',
  [reflectionKey('the-password', 'demand-hers', 'virtue')]:
    'Demande-toi ce que devient cette relation quand les deux serrures sautent en même temps, par dépit déguisé en équité.',
  [reflectionKey('the-password', 'demand-hers', 'care')]:
    'Aucun de vous deux n\'est réellement rassuré par ça — vous avez seulement rendu la peur mutuelle.',

  // ---------- The Party ----------
  [reflectionKey('the-party', 'play-and-bury', 'consequence')]:
    'Rien ne change visiblement ce soir, mais les chances que ça reste enterré n\'ont jamais été entièrement entre tes mains.',
  [reflectionKey('the-party', 'play-and-bury', 'duty')]: 'Un secret gardé loin de Sara reste une décision prise à son sujet, sans elle.',
  [reflectionKey('the-party', 'play-and-bury', 'virtue')]:
    'Remarque la phrase que tu es en train de répéter — « ça ne compte pas » — et quel genre de personne trouve cette phrase convaincante.',
  [reflectionKey('the-party', 'play-and-bury', 'care')]:
    'Tu as protégé ton propre confort ce soir, à un coût qui, si ça remonte à la surface, retombera entièrement sur elle.',
  [reflectionKey('the-party', 'play-and-tell', 'consequence')]:
    'Le lui dire n\'efface pas le baiser, mais ça change ce qu\'elle doit encaisser — l\'acte lui-même, et non en plus la trahison du secret.',
  [reflectionKey('the-party', 'play-and-tell', 'duty')]:
    'Elle avait droit à la vérité, et tu la lui as livrée avant qu\'on ait dû te l\'arracher.',
  [reflectionKey('the-party', 'play-and-tell', 'virtue')]:
    'C\'est une honnêteté coûteuse, choisie alors qu\'elle était encore évitable.',
  [reflectionKey('the-party', 'play-and-tell', 'care')]: 'Tu lui as offert la dignité de l\'apprendre de toi, et non d\'une capture d\'écran, des semaines plus tard.',
  [reflectionKey('the-party', 'refuse', 'consequence')]: 'Refuser coûte un peu de statut social ce soir, et rien du tout demain.',
  [reflectionKey('the-party', 'refuse', 'duty')]:
    'Tu as tenu une promesse qui n\'avait pas été explicitement demandée, mais qui était clairement due.',
  [reflectionKey('the-party', 'refuse', 'virtue')]:
    'C\'est le caractère qui se manifeste exactement quand c\'est le moins pratique, et le moins vu par la personne à qui ça profite.',
  [reflectionKey('the-party', 'refuse', 'care')]:
    'Le confort de Klara n\'a en réalité jamais été en jeu ici, dans un sens comme dans l\'autre — mais la confiance de Sara, absente, l\'était.',
  [reflectionKey('the-party', 'leave', 'consequence')]:
    'Partir supprime d\'un coup toutes les issues possibles du gage, proprement, avant qu\'aucune ne puisse se produire.',
  [reflectionKey('the-party', 'leave', 'duty')]:
    'Tu ne devais aucune explication pour avoir refusé de rester dans une pièce construite précisément pour ce genre d\'épreuve.',
  [reflectionKey('the-party', 'leave', 'virtue')]: 'Parfois, le geste le plus honnête est de ne pas se faire confiance du tout avec ce choix.',
  [reflectionKey('the-party', 'leave', 'care')]: 'Tu as épargné à tout le monde — Klara, Sara, toi-même — une scène qui n\'avait pas besoin d\'exister.',

  // ---------- The Forward ----------
  [reflectionKey('the-forward', 'delete-only', 'consequence')]:
    'Effacer ta propre copie ne change rien aux trente-neuf autres copies encore en circulation.',
  [reflectionKey('the-forward', 'delete-only', 'duty')]:
    'Le silence te décharge de ta propre participation, mais pas de ce que tu sais de ce qui continue de lui arriver.',
  [reflectionKey('the-forward', 'delete-only', 'virtue')]:
    'Demande-toi quel genre de témoin « au moins, je ne l\'ai pas transféré » fait vraiment de toi.',
  [reflectionKey('the-forward', 'delete-only', 'care')]:
    'Ema finit quand même par l\'apprendre de quelqu\'un d\'autre, sans prévenir, sans que tu aies fait la seule chose qui aurait pu aider.',
  [reflectionKey('the-forward', 'report', 'consequence')]:
    'Signaler est la seule voie avec une vraie chance d\'arrêter la propagation, à un coût personnel réel pour toi.',
  [reflectionKey('the-forward', 'report', 'duty')]: 'C\'est précisément le genre d\'action que la loi et le lycée existent tous deux pour rendre possible.',
  [reflectionKey('the-forward', 'report', 'virtue')]:
    'C\'est la forme peu glorieuse et impopulaire du courage — celle qui te vaut un surnom pendant une semaine.',
  [reflectionKey('the-forward', 'report', 'care')]:
    'C\'est la version de l\'aide qui atteint réellement Ema, pas seulement celle qui te donne bonne conscience.',
  [reflectionKey('the-forward', 'tell-ema-first', 'consequence')]:
    'La prévenir en premier change ce qu\'elle doit affronter — informée, plutôt que prise en embuscade par son propre couloir.',
  [reflectionKey('the-forward', 'tell-ema-first', 'duty')]:
    'Elle avait droit à la vérité avant que la foule n\'ait une longueur d\'avance sur sa réaction.',
  [reflectionKey('the-forward', 'tell-ema-first', 'virtue')]:
    'C\'est le choix qui te coûte le plus dans cette pièce, et qui ne demande rien en retour.',
  [reflectionKey('the-forward', 'tell-ema-first', 'care')]:
    'De tout ce qui s\'offre ce soir, c\'est la version entièrement construite autour de ce dont elle a besoin, pas de ce qui est le plus facile pour toi.',
  [reflectionKey('the-forward', 'confront-publicly', 'consequence')]:
    'La confrontation publique peut ralentir le partage, mais elle multiplie aussi l\'attention sur la chose même que tu essaies d\'arrêter.',
  [reflectionKey('the-forward', 'confront-publicly', 'duty')]:
    'Dénoncer une faute est dû à la situation — mais la méthode compte autant que l\'intention.',
  [reflectionKey('the-forward', 'confront-publicly', 'virtue')]:
    'C\'est une colère légitime qui agit, ce qui n\'est pas automatiquement la même chose que faire ce qu\'il faut.',
  [reflectionKey('the-forward', 'confront-publicly', 'care')]:
    'La personne la plus vulnérable de cette histoire n\'a pas voix au chapitre sur la visibilité avec laquelle sa situation est traitée.',

  // ---------- The Best Friend's Girl ----------
  [reflectionKey('the-best-friends-girl', 'confess-to-her', 'consequence')]:
    'Le lui dire met en jeu une amitié et une relation pour une information dont tu n\'avais pas strictement besoin.',
  [reflectionKey('the-best-friends-girl', 'confess-to-her', 'duty')]:
    'Elle avait le droit de savoir ce qui se passait dans une pièce où elle se trouvait elle-même.',
  [reflectionKey('the-best-friends-girl', 'confess-to-her', 'virtue')]:
    'C\'est une honnêteté qui sert ta propre clarté autant qu\'elle la sert, elle — ça vaut la peine de remarquer laquelle des deux t\'a d\'abord guidé.',
  [reflectionKey('the-best-friends-girl', 'confess-to-her', 'care')]:
    'Considère ce que cet aveu coûte réellement à Nadia, comparé à ce qu\'il soulage en toi.',
  [reflectionKey('the-best-friends-girl', 'starve-it', 'consequence')]:
    'La distance ne résout rien pour personne d\'autre, mais elle résout, de façon fiable, l\'état en toi, avec le temps.',
  [reflectionKey('the-best-friends-girl', 'starve-it', 'duty')]: 'Tu ne dois à personne l\'aveu d\'un sentiment sur lequel tu n\'as jamais agi.',
  [reflectionKey('the-best-friends-girl', 'starve-it', 'virtue')]: 'C\'est une gestion de soi discrète — peu glorieuse, sans témoin, et efficace.',
  [reflectionKey('the-best-friends-girl', 'starve-it', 'care')]:
    'Personne d\'autre dans cette pièce n\'a jamais à porter le poids d\'un sentiment qui n\'était pas le sien.',
  [reflectionKey('the-best-friends-girl', 'tell-tom', 'consequence')]:
    'Le dire à Tom, plutôt que d\'agir ou de le dire à Nadia, contient le mal dans la seule relation construite pour le porter.',
  [reflectionKey('the-best-friends-girl', 'tell-tom', 'duty')]:
    'C\'est exactement à ça que sert une vraie amitié — l\'aveu inconfortable, offert plutôt que découvert.',
  [reflectionKey('the-best-friends-girl', 'tell-tom', 'virtue')]:
    'Ça a demandé plus de cran que le silence ou l\'aveu à Nadia — ça vaut la peine de le remarquer, chez toi-même.',
  [reflectionKey('the-best-friends-girl', 'tell-tom', 'care')]:
    'Tu as protégé Nadia d\'un sentiment qui n\'a jamais eu affaire à quoi que ce soit qu\'elle ait fait, en le dirigeant vers la seule personne capable de l\'entendre.',
  [reflectionKey('the-best-friends-girl', 'test-the-evening', 'consequence')]:
    'Un test fabriqué ne produit pas de vraie information — il produit une situation nouvelle, plus difficile à lire, pour tous les concernés.',
  [reflectionKey('the-best-friends-girl', 'test-the-evening', 'duty')]:
    'Ça a mis en jeu la relation de Tom et Nadia pour ta propre incertitude, sans leur savoir ni leur consentement.',
  [reflectionKey('the-best-friends-girl', 'test-the-evening', 'virtue')]:
    'C\'est la version de toi qui gère les gens au lieu de leur faire confiance ou de les laisser tranquilles.',
  [reflectionKey('the-best-friends-girl', 'test-the-evening', 'care')]:
    'Nadia devient ici un instrument de ta curiosité, et ce n\'est pas rien de lui avoir fait ça.',

  // ---------- The Rumor ----------
  [reflectionKey('the-rumor', 'trust-without-asking', 'consequence')]:
    'Tu renonces entièrement à la certitude ; quoi qu\'il se soit vraiment passé au lac, ça ne change rien à la façon dont tu choisis désormais de la traiter.',
  [reflectionKey('the-rumor', 'trust-without-asking', 'duty')]:
    'Elle a droit à la présomption d\'innocence qu\'une simple rumeur ne peut jamais renverser.',
  [reflectionKey('the-rumor', 'trust-without-asking', 'virtue')]:
    'C\'est la confiance comme discipline exercée, et non comme sentiment confortable — la version la plus difficile de cette vertu.',
  [reflectionKey('the-rumor', 'trust-without-asking', 'care')]:
    'Tu lui as épargné un interrogatoire qu\'elle ne méritait peut-être pas, au prix d\'un doute que tu portes désormais seul, indéfiniment.',
  [reflectionKey('the-rumor', 'ask-her-plainly', 'consequence')]:
    'Tu as échangé la paralysie du non-savoir contre une réponse que tu ne peux pas vérifier de façon indépendante — un échange réel, mais limité.',
  [reflectionKey('the-rumor', 'ask-her-plainly', 'duty')]:
    'Elle avait droit, avant tout le reste, à une question directe — pas un piège, pas un mur de silence, une question.',
  [reflectionKey('the-rumor', 'ask-her-plainly', 'virtue')]:
    'Demander franchement, une fois, puis vraiment écouter, est plus difficile qu\'il n\'y paraît, et plus rare que ça ne devrait l\'être.',
  [reflectionKey('the-rumor', 'ask-her-plainly', 'care')]:
    'Elle sait maintenant que la rumeur t\'a atteint et est restée là, en toi, pendant des heures avant que tu ne parles — ça aussi, c\'est quelque chose qu\'elle doit porter.',
  [reflectionKey('the-rumor', 'interrogate', 'consequence')]:
    'Tu as gagné une information à un coût fixe et réel pour la confiance de la relation — la pièce chiffre cet échange sans détour.',
  [reflectionKey('the-rumor', 'interrogate', 'duty')]:
    'Un interrogatoire traite l\'accusée comme coupable jusqu\'à preuve du contraire, ce qui n\'est pas ce qui lui était dû.',
  [reflectionKey('the-rumor', 'interrogate', 'virtue')]: 'Remarque le genre de partenaire qu\'une simple rumeur a réussi à faire de toi, le temps d\'une soirée.',
  [reflectionKey('the-rumor', 'interrogate', 'care')]:
    'Les questions lui arrivent comme une accusation, quelle qu\'ait été ton intention, et elle doit porter ça aussi.',
  [reflectionKey('the-rumor', 'set-the-trap', 'consequence')]:
    'Le piège peut produire une réponse vraie, mais il le fait en fabriquant le test même qu\'il prétend ensuite avoir simplement observé.',
  [reflectionKey('the-rumor', 'set-the-trap', 'duty')]:
    'La tromperie, même au service d\'une question légitime, n\'est pas une méthode loyale — tu lui devais une question directe, pas un piège.',
  [reflectionKey('the-rumor', 'set-the-trap', 'virtue')]:
    'C\'est le miroir le plus tranchant de cette pièce : le piège t\'en apprend exactement autant sur toi que sur elle.',
  [reflectionKey('the-rumor', 'set-the-trap', 'care')]:
    'Quoi que ça révèle sur elle, ça révèle avec certitude que tu étais prêt à tromper quelqu\'un que tu aimes pour l\'obtenir.',
  [reflectionKey('the-rumor', 'ask-the-accuser', 'consequence')]:
    'Remonter la rumeur jusqu\'à sa source résout l\'accusation elle-même sans coûter à Sara un seul instant de suspicion.',
  [reflectionKey('the-rumor', 'ask-the-accuser', 'duty')]:
    'Ça dirige l\'examen vers la personne qui porte réellement l\'accusation, là où il aurait dû aller depuis le début.',
  [reflectionKey('the-rumor', 'ask-the-accuser', 'virtue')]:
    'C\'est le courage intellectuel appliqué là où c\'est le moins confortable — vers l\'auteur de l\'histoire, pas vers son sujet.',
  [reflectionKey('the-rumor', 'ask-the-accuser', 'care')]:
    'Sara n\'a jamais besoin de savoir qu\'elle a été soupçonnée — le doute se résout sans jamais la toucher.',
});
