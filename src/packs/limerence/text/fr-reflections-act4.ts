// French translations for LIMERENCE Act IV's Examined Path reflections
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
// fr-rooms-act4.ts's own header: "la personne"/"l'autre personne" rather
// than a third-person pronoun tied to a specific gender, since Act IV's
// own recurring partner is never named or gendered in the English source.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'fr', {
  // ---------- The Kitchen Table ----------
  [reflectionKey('the-kitchen-table', 'stay-for-them', 'consequence')]:
    'Rester préserve le foyer aujourd\'hui, à un coût qui dépend entièrement du fait que le pacte soit entretenu ou relégué.',
  [reflectionKey('the-kitchen-table', 'stay-for-them', 'duty')]:
    'Cela honore une obligation envers les enfants, sans pour autant résoudre, en soi, ce que vous vous devez l\'un à l\'autre.',
  [reflectionKey('the-kitchen-table', 'stay-for-them', 'virtue')]:
    'C\'est un choix dont la nature dépend de l\'entretien qu\'on lui accorde — il peut être échafaudage ou report, et seuls des matins ultérieurs diront lequel.',
  [reflectionKey('the-kitchen-table', 'stay-for-them', 'care')]:
    'Les enfants ont une maison stable ce matin — savoir si elle le reste est une question distincte, qui continue de se poser.',
  [reflectionKey('the-kitchen-table', 'separate-well', 'consequence')]:
    'Bien se séparer échange la relation contre un résultat moins conflictuel, dont la recherche suggère qu\'il protège réellement les enfants.',
  [reflectionKey('the-kitchen-table', 'separate-well', 'duty')]:
    'Cela honore ce qui est dû aux enfants — une séparation bien menée — plutôt que l\'apparence d\'une famille intacte.',
  [reflectionKey('the-kitchen-table', 'separate-well', 'virtue')]:
    'C\'est un deuil géré avec une réelle discipline, choisi plutôt que le ressentiment silencieux ou le conflit public.',
  [reflectionKey('the-kitchen-table', 'separate-well', 'care')]:
    'C\'est construit, délibérément, autour de ce que les enfants porteront réellement, plutôt qu\'autour du confort de l\'un ou l\'autre parent.',
  [reflectionKey('the-kitchen-table', 'attempt-repair', 'consequence')]:
    'Tenter la réparation risque un effort réel contre un résultat incertain, en échange de la chance d\'obtenir quelque chose de mieux que rester inchangé ou partir.',
  [reflectionKey('the-kitchen-table', 'attempt-repair', 'duty')]:
    'Cela honore l\'engagement originel de la relation en testant réellement s\'il peut être tenu, plutôt qu\'en présumant l\'un ou l\'autre à l\'avance.',
  [reflectionKey('the-kitchen-table', 'attempt-repair', 'virtue')]:
    'C\'est une discipline soutenue et peu glorieuse — se présenter au deuxième rendez-vous, qui est la véritable épreuve.',
  [reflectionKey('the-kitchen-table', 'attempt-repair', 'care')]:
    'Cela traite ce qui s\'est passé comme une alarme qui mérite d\'être comprise, pas seulement comme un crime qui mérite d\'être puni — un cadre plus difficile, mais plus utile, pour vous deux.',
  [reflectionKey('the-kitchen-table', 'say-the-unsayable', 'consequence')]:
    'Dire l\'indicible ne résout pas les questions pratiques du matin, mais ça change ce que chaque réponse ultérieure signifiera réellement.',
  [reflectionKey('the-kitchen-table', 'say-the-unsayable', 'duty')]:
    'Cette phrase vous était due à tous les deux bien avant ce matin — son retard n\'annule pas la dette.',
  [reflectionKey('the-kitchen-table', 'say-the-unsayable', 'virtue')]:
    'C\'est l\'honnêteté la plus exposante que cette pièce ait à offrir, donnée sans savoir ce qu\'elle coûtera.',
  [reflectionKey('the-kitchen-table', 'say-the-unsayable', 'care')]:
    'Cela traite l\'autre personne comme quelqu\'un à qui l\'on doit la vérité la plus profonde possible, et non une version maîtrisée de celle-ci.',

  // ---------- The Morning Desk ----------
  [reflectionKey('the-morning-desk', 'stand-by-all', 'consequence')]:
    'Assumer chaque choix ne change rien à ce qui s\'est déjà passé — seulement à ce que tu es désormais prêt à en dire.',
  [reflectionKey('the-morning-desk', 'stand-by-all', 'duty')]:
    'Tu dois à ton propre dossier une signature honnête, quel qu\'en soit le prix — et tu viens d\'en donner une, entière.',
  [reflectionKey('the-morning-desk', 'stand-by-all', 'virtue')]:
    'Demande-toi si un registre entièrement signé est de l\'intégrité, ou une armure portée si longtemps qu\'elle a cessé de ressembler à un choix.',
  [reflectionKey('the-morning-desk', 'stand-by-all', 'care')]:
    'Le Portier le note sans cruauté — quelle qu\'ait été sa destinataire, la signature était la tienne à donner ou à refuser, et tu l\'as donnée entière.',
  [reflectionKey('the-morning-desk', 'name-what-changed-me', 'consequence')]:
    'Nommer ce qui t\'a changé n\'efface pas le choix antérieur — ça ajoute une seconde entrée honnête à côté de la première.',
  [reflectionKey('the-morning-desk', 'name-what-changed-me', 'duty')]:
    'Tu dois au comptoir, et à toi-même, le reçu autant que la révision — nommer la pièce qui t\'a changé est la moitié la plus difficile.',
  [reflectionKey('the-morning-desk', 'name-what-changed-me', 'virtue')]:
    'Demande-toi si réviser le dossier, ici, est de la croissance, ou une façon commode de renier qui tu étais avant de savoir mieux.',
  [reflectionKey('the-morning-desk', 'name-what-changed-me', 'care')]:
    'Le comptoir traite un soi capable de changer d\'avis comme plus vivant qu\'un soi qui ne le peut pas — étendu, discrètement, à qui tu étais avant.',
  [reflectionKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 'consequence')]:
    'Admettre le vide ne le comble pas — les choix qui y ont été faits restent exactement aussi peu témoignés qu\'avant que tu ne le dises.',
  [reflectionKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 'duty')]:
    'Tu dois au comptoir un compte-rendu honnête, trous compris — admettre le vide s\'en acquitte mieux que prétendre le contraire.',
  [reflectionKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 'virtue')]:
    'Demande-toi si le scepticisme du comptoir envers un dossier intact qui invoque l\'absence est juste, ou si certains vides sont réels sans piège à blâmer.',
  [reflectionKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 'care')]:
    'Quoi qu\'en pense le Portier, il laisse passer — une petite grâce, accordée à un client qui, pour une partie de tout ça, n\'était sincèrement pas entièrement là.',
});
