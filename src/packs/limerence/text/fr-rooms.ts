// French translation of LIMERENCE's prologue and Act I room prose (beats,
// choice text/hint/outcome, field notes, plain-language explanations).
// Registered under version 'v2'. Follows the structural pattern established
// by ANAMNESIS's src/content/text/fr.ts and LIMERENCE's own Czech/Farsi/
// German passes — see CLAUDE.md's "Translating content" rule: every line
// here was translated against the room's actual beats and each choice's
// stakes, not word-for-word.
//
// tu/vous decision: informal "tu" throughout, mirroring the German pass's
// reasoning. Act I's prose sits directly inside a 15-18-year-old's own head
// at 1 a.m. over a read receipt, at a party, texting a best friend's
// girlfriend — interior monologue and teenage dialogue, not a narrator
// addressing an adult guest from a respectful remove (which is what
// ANAMNESIS's French framing device actually is, hence its "vous"). French
// YA fiction and everyday address between an adult and a teenager
// overwhelmingly default to "tu"; "vous" here would read as a translation
// artifact. The Porter keeps his own measured, unhurried, adult cadence,
// but grammatically addresses the player as "tu" throughout.
//
// "The Porter" is rendered "Le Portier" — the same idiomatic French word for
// this hotel role, and deliberately distinct from ANAMNESIS's own French
// word for its theater-usher guide character, per the project convention of
// keeping the two guide characters' vocabulary separate.
//
// Field-note thinkers lines: proper-name citations (with years) are carried
// through unchanged, matching the Czech/German passes' own convention. The
// two descriptive (non-named) thinkers lines in Act I — the-password's
// "coercive-control research · reassurance-seeking studies" and
// the-forward's "non-consensual image-sharing research · the legal
// reality" — are translated into French, since they're field descriptions
// rather than citations.
//
// Character gender: Act I's cast (Sara, Nadia, Tom, Klara, Ema) is entirely
// and unambiguously gendered in the English source, so none of the
// Jules/Dana-style gender-neutral handling from later Acts is needed here.
// French's grammatical gender did require one recurring judgment call not
// present in English: several English lines use passé-composé constructions
// that would force a gendered past-participle agreement onto the player
// ("tu es resté(e)", "tu es devenu(e)"). Wherever the English original
// doesn't semantically require a completed/reflexive past-tense verb, this
// file prefers present tense, avoir-based constructions, or a nominal
// rephrasing ("de ta propre main" rather than "tu as écrit toi-même") to
// sidestep the agreement question entirely, rather than picking a default
// gender for the player.
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
  roomArticleTitleKey,
  roomArticleBodyKey,
} from '../../../engine/text/keys';
import type { RunState } from '../../../engine/schema';

// ---------- Prologue: The Front Desk ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-front-desk', 0, 0)]:
    'Tu te réveilles en plein mouvement, dans un hall qui sent le nettoyant à moquette, le café froid et un parfum à moitié évaporé, celui de quelqu\'un d\'autre. Tu ne te souviens pas de ton arrivée. Tu t\'en souviens rarement, ici.',
  [roomBeatKey('the-front-desk', 0, 1)]:
    'Un tableau des départs défile au-dessus du comptoir, énumérant chaque client actuellement enregistré. Pas d\'horaires. Pas de portes d\'embarquement. Juste des noms — le tien, quelque part parmi eux.',
  [roomBeatKey('the-front-desk', 0, 2)]:
    'Le registre est ouvert à la page du jour. Ta signature y figure déjà, de ta propre main, datée de demain.',
  [roomBeatKey('the-front-desk', 0, 3)]:
    'Le Portier : Tu es entre un battement de cœur et le suivant. C\'est le cas de la plupart des clients, la première fois qu\'ils le remarquent.',
  [roomBeatKey('the-front-desk', 0, 4)]:
    'Le Portier : Les règles, telles qu\'elles sont — étages, portes, chambres qui se souviennent de ce qui s\'y passe. Certaines, tu les traverseras en tant que toi-même. D\'autres, en tant que la personne qui s\'y trouve quand la porte s\'ouvre.',
  [roomBeatKey('the-front-desk', 0, 5)]:
    'Quand il se retourne pour ranger le registre, tu le remarques — une alliance à sa main droite, et à la gauche, une marque pâle, non hâlée, là où une autre se trouvait autrefois. Il ne l\'explique pas. Tu ne demandes rien, pas encore.',
  [roomChoiceTextKey('the-front-desk', 'what-is-this')]: '« C\'est quoi, cet endroit ? »',
  [roomChoiceHintKey('the-front-desk', 'what-is-this')]: 'Interroger sur l\'hôtel lui-même',
  [roomChoiceOutcomeKey('the-front-desk', 'what-is-this', 0)]:
    'Le Portier : Les chambres retiennent les nuits dont personne ne parle à personne. Tu les traverseras en tant que les personnes qui les habitent. C\'est toute l\'architecture du lieu.',
  [roomChoiceTextKey('the-front-desk', 'whose-side')]: '« Tu es du côté de qui ? »',
  [roomChoiceHintKey('the-front-desk', 'whose-side')]: 'Interroger sur le Portier',
  [roomChoiceOutcomeKey('the-front-desk', 'whose-side', 0)]:
    'Le Portier : La réception est neutre, ce que chaque client prend pour de la cruauté. Tu seras tout le monde avant le matin. Après quoi, « camp » ne voudra plus dire grand-chose.',
  [roomChoiceTextKey('the-front-desk', 'let-me-out')]: '« Je veux juste rentrer chez moi. »',
  [roomChoiceHintKey('the-front-desk', 'let-me-out')]: 'Refuser le cadre en bloc',
  [roomChoiceOutcomeKey('the-front-desk', 'let-me-out', 0)]:
    'Le Portier : Chez toi, c\'est là où vit la conversation que tu évites. Le chemin du retour traverse chaque chambre où quelqu\'un en évite une. Personne n\'a jamais trouvé de raccourci. On vient s\'enregistrer ici, nuit après nuit.',
  [roomExplanationKey('the-front-desk', 0)]:
    'La limérence est un état psychologique réel et nommé — un engouement involontaire et obsessionnel, distinct de l\'amour et du choix. Cet hôtel porte son nom parce que la plupart de ce qui se passe à ses étages y prend racine. Le jeu qui suit ne consiste pas à juger les personnes de ces chambres ; il s\'agit de traverser un moment difficile d\'une relation depuis l\'intérieur, une fois, en sécurité, avant que la vie ne te demande de le traverser pour de vrai.',
  [roomNoteTitleKey('the-front-desk')]: 'La limérence',
  [roomNoteThinkersKey('the-front-desk')]: 'Dorothy Tennov · Love and Limerence (1979)',
  [roomNoteBodyKey('the-front-desk')]:
    'Tennov a forgé ce terme pour nommer quelque chose que tout le monde vit et que presque personne ne sait nommer : l\'état involontaire de l\'engouement obsessionnel — des pensées intrusives centrées sur une seule personne, une lecture compulsive de chacun de ses signaux, une douleur sourde à laquelle aucun argument ne répond. Ce n\'est pas de l\'amour, et ce n\'est pas une décision ; cela a un début, un pic, et — livré à lui-même — un déclin, généralement en moins de deux ans. **L\'hôtel porte ce nom parce que presque chaque porte de ces étages a été ouverte par quelqu\'un sous son emprise — le sentiment n\'a jamais été le choix ; ce qui s\'est passé ensuite, si.** Nommer l\'état ne le guérit pas. Mais cela rend, de façon fiable, la décision suivante un peu plus la tienne.',
});

// ---------- Act I: The Read Receipt ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-read-receipt', 0, 0)]:
    'Ta chambre, une heure du matin. L\'écran du téléphone est la seule lumière de la pièce, et il indique que Sara a lu ton message il y a trois heures.',
  [roomBeatKey('the-read-receipt', 0, 1)]: 'vu · 22h04',
  [roomBeatKey('the-read-receipt', 0, 2)]:
    'L\'indicateur « en train d\'écrire » apparaît. Trois points, patients. Puis il disparaît. Il réapparaît une minute plus tard. Disparaît encore. Tu as observé ça quatre fois maintenant, et tu serais incapable de dire à qui que ce soit ce que tu espères de la cinquième.',
  [roomBeatKey('the-read-receipt', 0, 3)]:
    'Tu remontes tout ce que tu as dit aujourd\'hui, relisant chaque message à la recherche d\'un crime. Cette blague, était-ce trop. Ce silence, était-il trop long. La preuve change de camp selon la façon dont tu la tiens.',
  [roomBeatKey('the-read-receipt', 0, 4)]:
    'Le Portier : Chaque client de cet étage est certain que le silence le concerne. Le silence ne le concerne presque jamais.',
  [roomChoiceTextKey('the-read-receipt', 'double-text')]: 'Paniquer, et envoyer deux messages de plus.',
  [roomChoiceHintKey('the-read-receipt', 'double-text')]: 'Courir après le silence',
  [roomChoiceOutcomeKey('the-read-receipt', 'double-text', 0)]: 'Le soulagement, pendant environ quatre minutes.',
  [roomChoiceOutcomeKey('the-read-receipt', 'double-text', 1)]:
    'Puis : deux messages sans réponse au lieu d\'un, et une arithmétique de l\'angoisse qui totalise exactement comme toujours.',
  [roomChoiceTextKey('the-read-receipt', 'drawer')]: 'Ranger le téléphone dans un tiroir. Rester assis avec ce que tu ressens.',
  [roomChoiceHintKey('the-read-receipt', 'drawer')]: 'Affronter l\'angoisse sans la nourrir',
  [roomChoiceOutcomeKey('the-read-receipt', 'drawer', 0)]:
    'Le sentiment, affronté de face plutôt que géré, se révèle avoir une forme et, avec le temps, un fond.',
  [roomChoiceOutcomeKey('the-read-receipt', 'drawer', 1)]: 'Le matin arrive. Et avec lui : « désolée, je me suis endormie ❤ »',
  [roomChoiceTextKey('the-read-receipt', 'bait')]: 'La tester avec une fausse histoire, pour forcer une réponse.',
  [roomChoiceHintKey('the-read-receipt', 'bait')]: 'Fabriquer une preuve',
  [roomChoiceOutcomeKey('the-read-receipt', 'bait', 0)]: 'Ça marche. Elle répond en moins d\'une minute.',
  [roomChoiceOutcomeKey('the-read-receipt', 'bait', 1)]:
    'Et tu apprends la seule chose qu\'un tel test puisse jamais t\'apprendre : que ça marche. Pas ce que ça a coûté.',
  [roomChoiceTextKey('the-read-receipt', 'ask-tomorrow')]: 'Lui demander directement demain, à voix haute, en face à face.',
  [roomChoiceHintKey('the-read-receipt', 'ask-tomorrow')]: 'Attendre le jour et une vraie réponse',
  [roomChoiceOutcomeKey('the-read-receipt', 'ask-tomorrow', 0)]:
    'La lumière du jour rend la question minuscule. Sa réponse — « ma mère m\'a pris le téléphone » — rend visible toute l\'architecture de la nuit dernière, et un peu gênante.',
  [roomExplanationKey('the-read-receipt', 0)]:
    'Les psychologues décrivent trois grands styles d\'attachement, appris tôt et transportés dans chaque relation ultérieure : anxieux (a besoin d\'être rassuré sans cesse, lit le silence comme un danger), évitant (se retire dès que l\'intimité augmente), et sécure (fait confiance sans avoir besoin de preuves constantes). La spirale de l\'accusé de lecture, c\'est la boucle anxieuse en temps réel — un sentiment tout à fait réel, attaché à une histoire qui n\'est souvent qu\'un premier brouillon. Aucun de ces styles n\'est une condamnation à vie ; la « sécurité acquise » — apprendre une façon plus stable de lire les gens — est réelle, et c\'est la thèse discrète de tout cet hôtel.',
  [roomNoteTitleKey('the-read-receipt')]: 'La météo que tu apportes',
  [roomNoteThinkersKey('the-read-receipt')]: 'Bowlby (1969) · Ainsworth (1978) · Hazan & Shaver (1987)',
  [roomNoteBodyKey('the-read-receipt')]:
    'La théorie de l\'attachement a commencé avec l\'observation de Bowlby selon laquelle les nourrissons développent des modèles internes de la proximité — des attentes sur la question de savoir si tendre la main obtient une réponse — qu\'Ainsworth a ensuite classés en schémas sécure, anxieux et évitant. Hazan et Shaver ont montré, des décennies plus tard, que les mêmes schémas prédisent le comportement amoureux adulte : le même système météorologique, désormais en intérieur, déguisé en accusé de lecture. **Le sentiment qui arrive à une heure du matin est réel ; l\'histoire qu\'il raconte sur la raison pour laquelle elle n\'a pas répondu est un brouillon, et les brouillons se révisent.** Rien de tout cela n\'est un destin — des études longitudinales sur la « sécurité acquise » montrent que les gens évoluent visiblement vers des schémas plus stables, généralement à travers exactement le genre de relation qui survit à quelques nuits honnêtes, non mises à l\'épreuve. Le contrôle du dernier étage te demandera ce que tu as fait de cette météo.',
  [roomArticleTitleKey('the-read-receipt')]: 'Pourquoi le même silence signifie des choses différentes selon les personnes',
  [roomArticleBodyKey('the-read-receipt')]: [
    'John Bowlby a fondé la théorie de l\'attachement sur un postulat évolutionnaire sans prétention : un nourrisson humain qui reste près d\'une figure d\'attachement survit plus sûrement que celui qui s\'éloigne, si bien que la sélection naturelle a intégré la recherche de proximité directement dans le système nerveux, avec ce que Bowlby appelait un « modèle interne opérant » — une attente permanente, en grande partie inconsciente, de savoir si tendre la main obtient une réponse. Cette attente, soutenait-il, ne reste pas dans la chambre d\'enfant. Elle devient la grille de lecture à laquelle une personne recourt des décennies plus tard, chaque fois que quelqu\'un qu\'elle aime se tait.',
    'Mary Ainsworth en a fait une véritable expérience dans les années 1970, la « Situation étrange » : une figure d\'attachement et un nourrisson entrent dans une pièce inconnue, la figure d\'attachement s\'absente brièvement, une personne étrangère entre, et des chercheurs derrière une vitre sans tain enregistrent précisément comment le nourrisson gère la séparation et, plus révélateur encore, les retrouvailles. De ces retrouvailles enregistrées sont nés trois schémas aujourd\'hui célèbres — **sécure** (troublé par le départ, apaisé par le retour), **anxieux** (troublé et pas facilement apaisé, comme si le retour lui-même n\'était pas tout à fait crédible) et **évitant** (montrant peu de détresse visible, ayant apparemment appris qu\'un besoin visible n\'obtient pas de réponse fiable).',
    'Le saut qui compte pour la pièce que tu viens de quitter est survenu en 1987, lorsque Cindy Hazan et Phillip Shaver ont demandé à des adultes de lire trois courts paragraphes décrivant différentes approches de la proximité dans les relations amoureuses, et de simplement choisir celui qui leur ressemblait le plus. La répartition des réponses adultes correspondait suffisamment à celle des nourrissons pour convaincre un domaine sceptique que Bowlby et Ainsworth avaient décrit quelque chose qui ne s\'arrête pas à trois ans — cela devient, dans les mots mêmes de Hazan et Shaver, « le même système météorologique, désormais en intérieur ». Un raffinement ultérieur de Kim Bartholomew et Leonard Horowitz, en 1991, a divisé « évitant » en une forme dédaigneuse (« je n\'ai pas besoin de ça ») et une forme craintive (« je veux ça et je suis certain que ça va me faire mal ») — parce que le modèle plus simple ne parvenait pas à distinguer ces deux silences très différents.',
    'Voici le mécanisme précis qui compte pour un message resté sans réponse à une heure du matin : l\'attachement anxieux n\'est pas simplement « s\'inquiéter davantage ». C\'est une hypervigilance mesurable envers les signaux de disponibilité du partenaire, dans laquelle un signal ambigu — un retard, une réponse plus courte que d\'habitude, un accusé de lecture sans message de suivi — est traité moins comme une information neutre que comme une alarme. Cette alarme déclenche de façon fiable un comportement de protestation (vérifier, relire, envoyer plusieurs messages), qui, dans une boucle cruelle que les recherches retrouvent sans cesse, produit souvent exactement la distance qu\'il cherchait à prévenir.',
    'Rien de tout cela n\'est une condamnation à perpétuité. Les recherches longitudinales ultérieures de Mary Main et Ruth Goldwyn ont identifié ce qu\'elles ont appelé la **« sécurité acquise »** — des adultes qui, dans les tests, se révèlent attachés de façon sécure malgré une histoire documentée de soins précoces incohérents ou effrayants, presque toujours parce que quelque chose, plus tard dans la vie, généralement une relation stable ayant survécu à quelques nuits difficiles honnêtement discutées, a appris au système nerveux une autre réponse à cette vieille question. **Le sentiment qui arrive à une heure du matin est réel. L\'histoire qu\'il raconte sur la raison pour laquelle elle n\'a pas répondu n\'est qu\'un premier brouillon — et les brouillons se révisent.**',
  ].join('\n\n'),
});

// ---------- Act I: The Screenshot ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-screenshot', 0, 0)]:
    'Un ping d\'AirDrop, en plein cours. Des captures d\'écran : Tom — ton meilleur ami, le petit ami de Nadia — qui mène une seconde conversation, pleine de flirt, avec une fille d\'un autre lycée.',
  [roomBeatKey('the-screenshot', 0, 1)]: 'Tu lis deux fois. Ça ne s\'arrange pas à la deuxième lecture.',
  [roomBeatKey('the-screenshot', 0, 2)]:
    'Ce que les captures prouvent et ne prouvent pas, tu te le dis, en dressant l\'inventaire avec soin. Elles prouvent assez.',
  [roomBeatKey('the-screenshot', 0, 3)]:
    'Pourquoi toi ? De l\'autre côté de la salle, l\'expéditeur guette une réaction sur ton visage. Ça n\'a jamais vraiment été une question de Tom.',
  [roomBeatKey('the-screenshot', 0, 4)]: 'Le groupe continue de bourdonner, inconscient, trois conversations séparées sur le déjeuner.',
  [roomBeatKey('the-screenshot', 0, 5)]:
    'Le Portier : Une preuve n\'est jamais qu\'une information. C\'est une offre d\'emploi. Note bien que tu n\'as pas postulé.',
  [roomChoiceTextKey('the-screenshot', 'tell-nadia')]: 'Montrer à Nadia tout, aujourd\'hui même.',
  [roomChoiceHintKey('the-screenshot', 'tell-nadia')]: 'Le dire à la personne concernée',
  [roomChoiceOutcomeKey('the-screenshot', 'tell-nadia', 0)]:
    'Son visage fait ce que font les visages. Puis commence le tri des amitiés — qui elle peut encore supporter de voir, qui elle ne peut plus.',
  [roomChoiceOutcomeKey('the-screenshot', 'tell-nadia', 1)]:
    'Tom sait, en moins d\'une heure, qui a parlé. Les retombées t\'atteignent aussi, honnêtement, et la pièce ne prétend pas le contraire.',
  [roomChoiceTextKey('the-screenshot', 'confront-tom')]: 'Aller voir Tom en premier : « tu le lui dis, ou je le fais. »',
  [roomChoiceHintKey('the-screenshot', 'confront-tom')]: 'Lui laisser le choix, avec un délai',
  [roomChoiceOutcomeKey('the-screenshot', 'confront-tom', 0)]:
    'Tom négocie, minimise — « c\'est juste des messages » — puis supplie.',
  [roomChoiceOutcomeKey('the-screenshot', 'confront-tom', 1)]:
    'Tu apprends qu\'un ultimatum est une promesse qu\'il faut vraiment être prêt à tenir. La pièce te force à décider, sur-le-champ, si c\'est le cas.',
  [roomChoiceTextKey('the-screenshot', 'stay-out')]: '« Ce n\'est pas ma relation. » Effacer.',
  [roomChoiceHintKey('the-screenshot', 'stay-out')]: 'Rester complètement en dehors',
  [roomChoiceOutcomeKey('the-screenshot', 'stay-out', 0)]: 'Le secret ne s\'efface pas. Il vient habiter chez toi.',
  [roomChoiceOutcomeKey('the-screenshot', 'stay-out', 1)]:
    'Chaque sortie de groupe a désormais un mur, et c\'est toi qui l\'as construit — autour de toi-même.',
  [roomChoiceTextKey('the-screenshot', 'verify-first')]: 'Vérifier discrètement que les captures sont vraies, avant tout.',
  [roomChoiceHintKey('the-screenshot', 'verify-first')]: 'Être sûr avant d\'agir',
  [roomChoiceOutcomeKey('the-screenshot', 'verify-first', 0)]:
    'Elles sont vraies. Et pendant que tu vérifiais, trois autres personnes ont reçu le même AirDrop.',
  [roomChoiceOutcomeKey('the-screenshot', 'verify-first', 1)]:
    'La minutie a dépensé la seule monnaie qui comptait ici : être le premier, ou se taire.',
  [roomExplanationKey('the-screenshot', 0)]:
    '« Dois-je dire à mon amie que son copain la trompe ? » est la version quotidienne du dilemme du tramway : chaque option déplace le mal quelque part, et ne rien faire est déjà un choix, avec une direction. Les recherches sur le comportement des témoins montrent que la responsabilité se dilue dès l\'instant où plus d\'une personne pourrait agir — « quelqu\'un d\'autre le fera » est ce que pense, en même temps, toute une salle. Rester en dehors n\'est pas neutre ; c\'est un vote, déposé discrètement, en faveur du statu quo.',
  [roomNoteTitleKey('the-screenshot')]: 'Murs, fenêtres et témoins',
  [roomNoteThinkersKey('the-screenshot')]: 'Shirley Glass (2003) · Darley & Latané (1968)',
  [roomNoteBodyKey('the-screenshot')]:
    'Shirley Glass décrivait l\'intimité comme une question d\'architecture — où donnent les fenêtres, où se dressent les murs. Un secret gardé « pour le bien de quelqu\'un » est un mur construit à l\'intérieur d\'une amitié, même quand l\'amitié elle-même paraît intacte de l\'extérieur. **Chaque option de cette salle de classe déplace le mal quelque part ; « rester en dehors » est aussi un mur, et c\'est toi qui dois vivre derrière.** Les recherches de Darley et Latané sur les témoins — observées d\'abord chez des inconnus qui n\'appelaient pas à l\'aide — s\'appliquent tout aussi précisément à un groupe de discussion : la responsabilité se dilue dès l\'instant où plus d\'une personne pourrait agir, jusqu\'à n\'appartenir à personne du tout. Un autre hôtel, un autre mur, les deux mêmes chercheurs — certaines découvertes te suivent d\'un bâtiment à l\'autre.',
});

// ---------- Act I: The Password ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-password', 0, 0)]:
    'Sara pleure, après une mauvaise semaine : son dernier copain l\'a trompée, et si tu l\'aimais vraiment, tu lui donnerais le code de ton téléphone.',
  [roomBeatKey('the-password', 0, 1)]:
    'C\'est présenté — sincèrement, depuis l\'intérieur de sa peur — comme de l\'intimité. Une part de toi ressent l\'attrait de cette logique ; avoir envie de céder ne fait pas de toi quelqu\'un de naïf.',
  [roomBeatKey('the-password', 0, 2)]:
    'Et une autre part de toi enregistre, sous cette envie, quelque chose qui ressemble exactement à une serrure qui tourne.',
  [roomBeatKey('the-password', 0, 3)]:
    '« Qu\'est-ce que tu as à cacher ? » demande-t-elle, et la question est construite de sorte que toute réponse sonne comme un aveu.',
  [roomBeatKey('the-password', 0, 4)]:
    'Le Portier : Une clé donnée sous la pression d\'un délai n\'ouvre pas la même porte qu\'une clé donnée librement. Même métal. Chambre différente.',
  [roomChoiceTextKey('the-password', 'give-it')]: 'Lui donner le code.',
  [roomChoiceHintKey('the-password', 'give-it')]: 'Combler la distance qu\'elle te demande de combler',
  [roomChoiceOutcomeKey('the-password', 'give-it', 0)]: 'La pièce récompense ce choix, honnêtement, à court terme : elle s\'adoucit, la semaine se répare.',
  [roomChoiceOutcomeKey('the-password', 'give-it', 1)]:
    'Un mois plus tard, tu te surprends à retoucher tes messages à tes amis avant de les envoyer. La surveillance est désormais dans tes pouces, et personne ne t\'a demandé de l\'installer.',
  [roomChoiceTextKey('the-password', 'refuse-flat')]: 'Non. Juste non.',
  [roomChoiceHintKey('the-password', 'refuse-flat')]: 'Tenir bon',
  [roomChoiceOutcomeKey('the-password', 'refuse-flat', 0)]: 'La dispute qui suit est réelle, et elle coûte un peu de la relation.',
  [roomChoiceOutcomeKey('the-password', 'refuse-flat', 1)]:
    'La pièce ne prétend pas que les limites sont gratuites. Elle insiste seulement sur le fait qu\'elles portent quelque chose.',
  [roomChoiceTextKey('the-password', 'transparency-not-surveillance')]: '« Demande-moi tout ce que tu veux, quand tu veux. Mais la serrure reste. »',
  [roomChoiceHintKey('the-password', 'transparency-not-surveillance')]: 'Offrir la franchise sans céder la clé',
  [roomChoiceOutcomeKey('the-password', 'transparency-not-surveillance', 0)]:
    'La distinction s\'installe lentement, pas dans l\'instant, mais au fil des semaines suivantes.',
  [roomChoiceOutcomeKey('the-password', 'transparency-not-surveillance', 1)]:
    'La meilleure porte disponible, et pourtant pas indolore — la confiance se reconstruit ici à la main, pas avec des clés.',
  [roomChoiceTextKey('the-password', 'demand-hers')]: '« Très bien — le tien aussi, alors. »',
  [roomChoiceHintKey('the-password', 'demand-hers')]: 'Égaler la demande plutôt que la résoudre',
  [roomChoiceOutcomeKey('the-password', 'demand-hers', 0)]:
    'Surveillance mutuellement assurée : deux personnes qui lisent le courrier l\'une de l\'autre, dans des chambres voisines.',
  [roomChoiceOutcomeKey('the-password', 'demand-hers', 1)]: 'La pièce laisse le silence de cet arrangement parler de lui-même.',
  [roomExplanationKey('the-password', 0)]:
    'Les demandes de « prouver » l\'amour par la surveillance s\'aggravent pour une raison simple : vérifier le téléphone de quelqu\'un soulage l\'angoisse immédiatement, ce qui enseigne à l\'esprit anxieux à continuer de demander. C\'est une boucle de recherche de réassurance bien documentée — soulagement maintenant, peur pire plus tard, et on recommence. La distinction utile ne porte pas sur l\'intensité de l\'amour ; elle sépare la transparence, qui s\'offre, de la surveillance, qui s\'arrache. Un signe précoce de comportement contrôlant est exactement celui-ci : une attention qui arrive avec un délai accroché.',
  [roomNoteTitleKey('the-password')]: 'La clé sous la contrainte',
  [roomNoteThinkersKey('the-password')]: 'recherches sur le contrôle coercitif · études sur la recherche de réassurance',
  [roomNoteBodyKey('the-password')]:
    'La surveillance apaise celui qui surveille pendant quelques heures et ronge les deux personnes pendant des mois — c\'est la forme bien documentée d\'une boucle de recherche de réassurance, et elle explique pourquoi « prouver » la confiance par l\'accès reste rarement un geste unique. **Le premier déguisement du contrôle est presque toujours l\'attention ; l\'indice fiable n\'est pas la demande elle-même, mais ce qui se passe à l\'instant où tu dis non.** Les travaux cliniques sur le contrôle coercitif désignent la surveillance comme l\'une de ses formes les plus précoces et les plus facilement excusées — précisément parce qu\'elle emprunte le langage de l\'amour. Rien de tout cela ne signifie que la peur derrière la demande est fausse ; cela signifie que cette peur mérite une meilleure réponse qu\'une clé. Les serrures sont honnêtes. Les délais ne le sont pas.',
});

// ---------- Act I: The Party ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-party', 0, 0)]:
    'Sara est chez sa grand-mère ce week-end. À la soirée, on joue à un gage de bisou, et la bouteille — tournée en direct, tout le monde comptant les tours à voix haute — s\'arrête sur toi, et sur Klara, de la classe parallèle.',
  [roomBeatKey('the-party', 0, 1)]:
    'Les justifications arrivent une par une, chacune parfaitement raisonnable en elle-même : c\'est juste un jeu. Elle en rirait si on lui présentait ça comme il faut. Tout le monde regarde, ce qui rend la chose, curieusement, moins réelle, pas plus.',
  [roomBeatKey('the-party', 0, 2)]:
    'Ça ne compte pas — tu sens cette phrase se construire, morceau par morceau, avant même d\'avoir décidé quoi que ce soit.',
  [roomBeatKey('the-party', 0, 3)]: 'Une salle pleine de téléphones levés. Tout ici est filmé ; c\'est juste la physique d\'une soirée du rez-de-chaussée.',
  [roomBeatKey('the-party', 0, 4)]:
    'Klara hausse les épaules, gentille et parfaitement indifférente — ça ne signifie rien pour elle, dans un sens comme dans l\'autre, ce qui rend le moment à la fois plus petit et plus grand.',
  [roomBeatKey('the-party', 0, 5)]:
    'Le Portier : « C\'est juste arrivé » se monte à l\'avance, pièce par pièce. Tu regardes la chaîne de montage, là, maintenant.',
  [roomChoiceTextKey('the-party', 'play-and-bury')]: 'Jouer le gage. Ne rien dire à personne.',
  [roomChoiceHintKey('the-party', 'play-and-bury')]: 'Laisser ça devenir rien, discrètement',
  [roomChoiceOutcomeKey('the-party', 'play-and-bury', 0)]: 'Le baiser n\'est rien. L\'enterrer, ça, c\'est quelque chose.',
  [roomChoiceOutcomeKey('the-party', 'play-and-bury', 1)]:
    'Les téléphones étaient levés. Quelque part, dans la poche de quelqu\'un, un écran s\'allume, non envoyé — pour l\'instant.',
  [roomChoiceTextKey('the-party', 'play-and-tell')]: 'Jouer le gage. Le dire toi-même à Sara, ce soir.',
  [roomChoiceHintKey('the-party', 'play-and-tell')]: 'La laisser l\'apprendre de toi en premier',
  [roomChoiceOutcomeKey('the-party', 'play-and-tell', 0)]:
    'Sa réaction lui appartient — blessée, puis étrangement apaisée d\'avoir été prévenue en premier.',
  [roomChoiceOutcomeKey('the-party', 'play-and-tell', 1)]:
    'Le dire coûte moins cher que le fait qu\'elle l\'apprenne autrement. La pièce te montre la différence, honnêtement, côte à côte.',
  [roomChoiceTextKey('the-party', 'refuse')]: 'Refuser le gage. Encaisser les moqueries.',
  [roomChoiceHintKey('the-party', 'refuse')]: 'Tenir trente secondes en te faisant rire au nez',
  [roomChoiceOutcomeKey('the-party', 'refuse', 0)]: 'Trente secondes de railleries qui, de l\'intérieur, ressemblent à une heure.',
  [roomChoiceOutcomeKey('the-party', 'refuse', 1)]: 'Puis la soirée continue, parce que les soirées continuent toujours. Quelqu\'un que tu n\'avais pas remarqué t\'a remarqué.',
  [roomChoiceTextKey('the-party', 'leave')]: 'Simplement quitter la soirée.',
  [roomChoiceHintKey('the-party', 'leave')]: 'Te retirer de la chaîne de montage',
  [roomChoiceOutcomeKey('the-party', 'leave', 0)]: 'L\'air froid dehors, comme un instant plein, sans hâte.',
  [roomChoiceOutcomeKey('the-party', 'leave', 1)]:
    'Il ne s\'est rien passé — et tu apprends que « rien ne s\'est passé » peut être une chose que tu as faite, plutôt qu\'une chose que tu as simplement évitée.',
  [roomExplanationKey('the-party', 0)]:
    'Le psychologue Albert Bandura a étudié comment l\'esprit rédige ses propres excuses avant l\'acte, et non après — un ensemble de mécanismes de « désengagement moral » (l\'appeler un jeu, le comparer à pire, répartir la responsabilité sur toute une salle) qui rendent un choix plus petit qu\'il ne l\'est, à l\'avance. L\'alcool aggrave encore cela par une forme de « myopie » : tout ce qui se trouve directement devant toi devient plus fort, et les conséquences plus lointaines s\'atténuent. Aucun de ces deux faits n\'excuse quoi que ce soit — ils expliquent seulement pourquoi « ce n\'était qu\'un jeu » fonctionne sur presque tout le monde, sauf sur la personne à qui c\'est arrivé.',
  [roomNoteTitleKey('the-party')]: 'Le montage de « c\'est juste arrivé »',
  [roomNoteThinkersKey('the-party')]: 'Bandura (1999) · Steele & Josephs (1990)',
  [roomNoteBodyKey('the-party')]:
    'Bandura a nommé les mouvements mentaux précis par lesquels on agit contre ses propres valeurs sans avoir l\'impression de le faire : l\'étiquetage euphémisant (« c\'est juste un jeu »), la diffusion de la responsabilité (« tout le monde le fait »), et la comparaison avantageuse (« au moins, je n\'ai pas— »). Rien de tout cela ne survient après l\'acte, comme un nettoyage ; **c\'est monté à l\'avance, pièce par pièce, et « c\'est juste arrivé » est le produit fini d\'un processus qui comptait pourtant beaucoup de points de décision en chemin.** Les recherches de Steele et Josephs sur la myopie alcoolique ajoutent le variateur de lumière : l\'ivresse ne supprime pas tant le jugement qu\'elle ne rétrécit son champ de vision à ce qui est le plus bruyant dans la pièce. Personne, dans cet hôtel, n\'a jamais eu l\'intention de s\'enregistrer.',
});

// ---------- Act I: The Forward ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-forward', 0, 0)]:
    'Un ping dans le groupe de la classe. Une photo qui n\'était jamais destinée à ce groupe, transférée par quelqu\'un en qui Ema avait confiance.',
  [roomBeatKey('the-forward', 0, 1)]:
    'Le groupe fait ce que font les groupes : des blagues, des captures de captures d\'écran, trois personnes qui écrivent en même temps. Ton pouce plane au-dessus du clavier, ne décidant encore rien.',
  [roomBeatKey('the-forward', 0, 2)]:
    'Les rires défilent en temps réel — une douzaine de messages dans le temps qu\'il te faut pour en lire trois.',
  [roomBeatKey('the-forward', 0, 3)]: 'Ema est dans ton cours de maths. Elle ne sait pas encore. Tu ne cesses de penser à la deuxième heure.',
  [roomBeatKey('the-forward', 0, 4)]:
    'Le Portier : Tout le monde, dans ce groupe, se dit n\'être qu\'un simple public. C\'est précisément comme ça que ça marche — par le public.',
  [roomChoiceTextKey('the-forward', 'delete-only')]: 'L\'effacer. Ne rien dire.',
  [roomChoiceHintKey('the-forward', 'delete-only')]: 'Te retirer, discrètement',
  [roomChoiceOutcomeKey('the-forward', 'delete-only', 0)]: 'Tes mains sont propres, et rien d\'autre ne l\'est.',
  [roomChoiceOutcomeKey('the-forward', 'delete-only', 1)]:
    'Le groupe continue de défiler. Quelque part, la pièce compte discrètement les trente-neuf autres spectateurs qui n\'ont rien effacé.',
  [roomChoiceTextKey('the-forward', 'report')]: 'Le signaler — à la plateforme, et à un adulte au lycée.',
  [roomChoiceHintKey('the-forward', 'report')]: 'Impliquer quelqu\'un qui a de l\'autorité',
  [roomChoiceOutcomeKey('the-forward', 'report', 0)]:
    'Les adultes bougent plus lentement qu\'un groupe de discussion, et plus vite que rien du tout. Les conséquences finissent par arriver, pour l\'expéditeur.',
  [roomChoiceOutcomeKey('the-forward', 'report', 1)]:
    'Le groupe te colle un surnom pendant une semaine. La pièce laisse ce coût être réel — et laisse, malgré tout, en valoir la peine.',
  [roomChoiceTextKey('the-forward', 'tell-ema-first')]: 'Écrire à Ema en premier, pour qu\'elle ne soit pas la dernière informée.',
  [roomChoiceHintKey('the-forward', 'tell-ema-first')]: 'Lui donner l\'alerte que personne d\'autre ne lui donnera',
  [roomChoiceOutcomeKey('the-forward', 'tell-ema-first', 0)]: 'Le message le plus difficile que tu aies jamais tapé. Sa réponse tient en deux mots.',
  [roomChoiceOutcomeKey('the-forward', 'tell-ema-first', 1)]:
    'Des années plus tard — un bond en avant que le rez-de-chaussée s\'autorise rarement — elle se souvient encore de qui le lui a dit. La bonté rare et sans ambiguïté de cette pièce. Toujours pas indolore, pour autant.',
  [roomChoiceTextKey('the-forward', 'confront-publicly')]: 'Dénoncer l\'expéditeur, dans le groupe lui-même.',
  [roomChoiceHintKey('the-forward', 'confront-publicly')]: 'Rendre ça visible',
  [roomChoiceOutcomeKey('the-forward', 'confront-publicly', 0)]:
    'Le groupe se retourne contre lui. Puis contre le drame lui-même. Puis — la pièce est honnête ici — en partie de nouveau contre Ema.',
  [roomChoiceOutcomeKey('the-forward', 'confront-publicly', 1)]:
    'La confrontation publique est un outil grossier. Elle touche plusieurs personnes, pas toujours celles que tu visais.',
  [roomExplanationKey('the-forward', 0)]:
    'Le consentement à être photographié, filmé ou enregistré ne se transmet pas avec le fichier — chaque transfert est un acte nouveau et distinct, pas la continuation de celui de quelqu\'un d\'autre. Dans la plupart des juridictions, partager des images intimes sans consentement est un délit grave, et cela s\'applique à chaque personne qui les transfère, pas seulement au premier expéditeur. Ce qui aide réellement la personne sur la photo est bien documenté et pas du tout spectaculaire : être informée directement, être crue sans discussion, et des adultes qui agissent vite.',
  [roomNoteTitleKey('the-forward')]: 'Le quarantième spectateur',
  [roomNoteThinkersKey('the-forward')]: 'recherches sur le partage d\'images non consenti · la réalité juridique',
  [roomNoteBodyKey('the-forward')]:
    'C\'est la seule note de terrain de l\'hôtel autorisée à être aussi directe sur le droit : dans la plupart des juridictions, transférer une image intime sans le consentement de la personne concernée est un délit grave — pour chaque personne qui la transfère, pas seulement pour celle qui l\'a envoyée la première. Les recherches sur les préjudices liés aux abus par l\'image montrent que le dommage s\'accumule avec chaque spectateur supplémentaire ; **le mal, ce n\'est pas la photo originale, c\'est le public, et ce public continue de grandir à chaque fois que quelqu\'un appuie sur transférer.** Les recherches sur le passage du témoin passif à l\'acteur sont unanimes sur ce qui aide vraiment : une alerte directe et précoce à la personne concernée, et des adultes qui interviennent vite plutôt que discrètement. Le premier expéditeur a appuyé sur un bouton. Tous les suivants aussi.',
});

// ---------- Act I: The Best Friend's Girl ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-best-friends-girl', 0, 0)]:
    'Une soirée de révisions ordinaire chez Tom. Nadia est par terre avec ses devoirs, n\'écoutant qu\'à moitié. Cette pièce ne devrait pas être compliquée.',
  // beat 1 is a function beat — registered below via register().
  [roomBeatKey('the-best-friends-girl', 0, 2)]:
    'Vient ensuite l\'inventaire de la loyauté : tout ce que Tom a représenté pour toi, chaque service rendu, chaque appel à deux heures du matin, étalé comme des preuves pour un dossier que tu ne savais pas être en train de monter.',
  [roomBeatKey('the-best-friends-girl', 0, 3)]:
    '[l\'arrêt de bus, mardi dernier — sa manche qui frôle la tienne, tout à fait par accident, rejoué quand même, en boucle, sans interrupteur]',
  [roomBeatKey('the-best-friends-girl', 0, 4)]:
    'L\'arithmétique des signes : était-ce un regard, ou un coup d\'œil qui s\'est simplement posé sur toi. La pièce te laisse faire le calcul, puis, honnêtement, corrige ta copie — le calcul n\'est pas fiable, et tu le fais quand même.',
  [roomBeatKey('the-best-friends-girl', 0, 5)]:
    'Le Portier : L\'état dans lequel tu te trouves a un nom clinique, une trajectoire documentée, et aucun volant. La conduite, elle, en a toujours un.',
  [roomChoiceTextKey('the-best-friends-girl', 'confess-to-her')]: 'Le dire à Nadia.',
  [roomChoiceHintKey('the-best-friends-girl', 'confess-to-her')]: 'Le dire à la personne concernée',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'confess-to-her', 0)]:
    'Quoi qu\'elle ressente — la pièce garde ça honnêtement ambigu, une demi-seconde n\'est pas un contrat — la constellation porte désormais une fissure.',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'confess-to-her', 1)]:
    'Le prochain « ça va ? » de Tom résonne comme une cloche qu\'on ne peut plus ignorer.',
  [roomChoiceTextKey('the-best-friends-girl', 'starve-it')]: 'La distance. Pas de drame, pas d\'explication.',
  [roomChoiceHintKey('the-best-friends-girl', 'starve-it')]: 'Le laisser s\'éteindre, discrètement',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'starve-it', 0)]:
    'La limérence privée devient une limérence bruyante, pour un temps — les intrusions empirent avant de s\'améliorer.',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'starve-it', 1)]: 'Puis, au fil des semaines, elles s\'estompent. Le prix honnête de l\'option honnête.',
  [roomChoiceTextKey('the-best-friends-girl', 'tell-tom')]: 'Dire à Tom la vérité de ce que tu ressens.',
  [roomChoiceHintKey('the-best-friends-girl', 'tell-tom')]: 'Faire confiance à ton ami avec ça',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'tell-tom', 0)]:
    'La phrase la plus courageuse de cet étage. Le silence de Tom, puis : « OK. Merci de me l\'avoir dit à moi, et pas à elle. »',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'tell-tom', 1)]:
    'L\'amitié survit, changée — un mur remplacé par une fenêtre, au prix d\'un peu de confort.',
  [roomChoiceTextKey('the-best-friends-girl', 'test-the-evening')]: 'Organiser une soirée ambiguë pour en avoir le cœur net.',
  [roomChoiceHintKey('the-best-friends-girl', 'test-the-evening')]: 'Fabriquer ta propre réponse',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'test-the-evening', 0)]: 'L\'ambiguïté fabriquée renvoie de l\'ambiguïté, amplifiée.',
  [roomChoiceOutcomeKey('the-best-friends-girl', 'test-the-evening', 1)]:
    'Désormais, deux personnes comptent des demi-secondes. La pièce refuse de dire lequel de vous deux a commencé.',
  [roomExplanationKey('the-best-friends-girl', 0)]:
    'La limérence est un état involontaire — tu ne choisis pas de l\'avoir, pas plus que tu ne choisis d\'avoir de la fièvre — mais ce que tu fais ensuite reste entièrement un choix. Lire les signes (était-ce un regard, était-ce un rire) donne l\'impression de rassembler des preuves, et se rapproche en réalité, la plupart du temps, de l\'écriture de fiction ; l\'esprit en état de limérence est extrêmement doué pour trouver la confirmation de ce qu\'il veut déjà croire. La phrase utile à retenir : le sentiment n\'est pas quelque chose dont tu dois avoir honte. La conduite, elle, t\'appartient, et tu en réponds.',
  [roomNoteTitleKey('the-best-friends-girl')]: 'L\'état sans volant',
  [roomNoteThinkersKey('the-best-friends-girl')]: 'Tennov (1979) · Schmitt & Buss (2001)',
  [roomNoteBodyKey('the-best-friends-girl')]:
    'Les recherches originales de Tennov ont cartographié précisément la trajectoire de la limérence : apparition, cristallisation, et — livrée à elle-même — déclin, typiquement entre six mois et deux ans. Ce n\'est pas une métaphore pour désigner un béguin ; c\'est un état psychologique documenté, dont la cognition intrusive constitue le symptôme central et mesurable. Les recherches sur le « braconnage de partenaire » (Schmitt & Buss) ont étudié exactement ce triangle depuis ses trois sommets — la personne attirée par quelqu\'un déjà en couple, la personne en couple, et celle qui ne sait pas encore — et ont trouvé que des coûts réels retombent sur les trois, quoi qu\'il arrive ensuite. **Les sentiments, ici, sont de la météo ; tu n\'as pas choisi le front qui passe, mais c\'est quand même toi qui tiens le parapluie, ou pas.** Chaque client qui a un jour réduit une amitié en cendres a juré que ce rire était un signal.',
  [roomArticleTitleKey('the-best-friends-girl')]: 'La scientifique qui a nommé ce que tu ressens',
  [roomArticleBodyKey('the-best-friends-girl')]: [
    'En 1979, la psychologue Dorothy Tennov a publié Love and Limerence: The Experience of Being in Love, fondé sur des entretiens structurés avec environ cinq cents personnes, à propos d\'un état auquel elle a délibérément donné un nom clinique, dénué de jugement — pas « amour », qu\'elle trouvait trop large et trop flatteur, ni « béguin » ou « toquade », qu\'elle trouvait trop désinvoltes pour quelque chose que les gens vivaient comme véritablement envahissant. Elle voulait un mot sans verdict intégré, seulement une description.',
    'Les entretiens de Tennov ont cartographié un ensemble de symptômes remarquablement cohérent : une pensée intrusive et involontaire concernant l\'objet de la limérence, qui résiste à toute volonté de l\'écarter ; un désir aigu et précis de réciprocité, plutôt qu\'une affection générale ; et — la découverte qui surprend le plus souvent — **une intensification sous l\'incertitude et l\'adversité, plutôt qu\'une dissolution.** L\'ambiguïté n\'affame pas la limérence. Elle la nourrit, car un signal non résolu laisse à l\'esprit la place de combler l\'écart avec de l\'espoir, et l\'espoir, contrairement à la certitude, peut fonctionner très longtemps avec très peu de carburant. Livré à lui-même, a constaté Tennov, l\'état parcourait généralement son arc complet — apparition, « cristallisation », puis déclin — quelque part entre dix-huit mois et trois ans.',
    'Des décennies plus tard, les neurosciences ont trouvé un mécanisme physique en accord avec les données d\'entretiens de Tennov. Les recherches en IRMf de Helen Fisher, au début des années 2000, ont scanné des personnes qui se disaient intensément, nouvellement amoureuses, et ont trouvé une activation concentrée dans des circuits de récompense riches en dopamine — l\'aire tegmentale ventrale, le noyau caudé — des schémas qui recoupent substantiellement ce que montrent les scanners lors d\'un état de manque envers une substance. Cela ne signifie pas que la limérence *est* une addiction au sens clinique, mais cela signifie que « je ne peux physiquement pas m\'empêcher de penser à elle » se révèle mesurablement plus proche de la vérité littérale que de la figure de style.',
    'Jeffry Simpson, et séparément David Schmitt et David Buss dans leur vaste étude interculturelle de 2001 sur le « braconnage de partenaire », ont examiné exactement le triangle dans lequel cette pièce te place — étudié depuis ses trois sommets à la fois : la personne qui désire, la personne déjà en couple, et le partenaire qui ne sait pas encore. La découverte qui devrait rester le plus longtemps avec toi est que des coûts réels et mesurables retombent sur **les trois** parties, largement indépendamment de la façon dont la situation se résout finalement. Il n\'existe aucune version de ce triangle où une seule personne est exposée.',
    'La phrase qui mérite d\'être retenue de cette pièce est celle que les propres données de Tennov ont fini par imposer clairement, entre deux choses que les gens ont tendance à fondre ensemble : **l\'état et la conduite.** Le sentiment qui arrive sans y être invité, chimiquement réel et involontaire, n\'est pas un événement moral. Ce que tu fais avec la petite amie d\'un ami, pendant que tu le ressens, est la seule partie pour laquelle quiconque — toi-même y compris, plus tard — a le droit de te juger.',
  ].join('\n\n'),
});

register(roomBeatKey('the-best-friends-girl', 0, 1), 'v2', 'fr', (s: RunState) =>
  s.axes.controlAcceptance < 0
    ? '[le rire d\'une demi-seconde, rejoué en boucle — tu l\'as compté onze fois maintenant, et ce chiffre t\'empêche de dormir]'
    : '[le rire d\'une demi-seconde, rejoué en boucle — tu remarques que tu comptes, et tu remarques que tu le remarques]',
);

// ---------- Act I: The Summer Ends ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-summer-ends', 0, 0)]:
    'L\'université, dans une autre ville, commence dans trois semaines. Les cartons se font méthodiquement, presque cérémonieusement — ce qui entre dans la boîte, c\'est le musée de la relation, conservé à la main.',
  [roomBeatKey('the-summer-ends', 0, 1)]:
    'Tout le monde a un avis, et tout le monde le donne sans qu\'on le demande : ta mère, sa sœur, le groupe de discussion, un inconnu à une soirée qui a vécu une relation à distance en 2003.',
  [roomBeatKey('the-summer-ends', 0, 2)]:
    'Sous toute cette logistique se cache la vraie question, jamais posée depuis trois semaines : que signifie septembre, exactement, pour vous deux.',
  // beat 3 is a function beat — registered below via register().
  [roomBeatKey('the-summer-ends', 0, 4)]:
    'Le Portier : Les clients décident de celle-ci dans le couloir, la plupart du temps. La pièce ne fait que les obliger à le dire à voix haute.',
  [roomChoiceTextKey('the-summer-ends', 'promise-ldr')]: 'Promettre la relation à distance dont tout le monde dit qu\'elle échouera.',
  [roomChoiceHintKey('the-summer-ends', 'promise-ldr')]: 'S\'engager à travers la distance',
  [roomChoiceOutcomeKey('the-summer-ends', 'promise-ldr', 0)]:
    'La promesse est réelle, et les statistiques aussi. La pièce refuse de révéler laquelle des deux tu deviendras.',
  [roomChoiceTextKey('the-summer-ends', 'end-clean')]: 'Y mettre fin maintenant, le meilleur jour plutôt que le pire.',
  [roomChoiceHintKey('the-summer-ends', 'end-clean')]: 'Choisir la fin plutôt que d\'en attendre une',
  [roomChoiceOutcomeKey('the-summer-ends', 'end-clean', 0)]: 'L\'étrange dignité d\'une fin choisie. Un deuil sans méchant.',
  [roomChoiceOutcomeKey('the-summer-ends', 'end-clean', 1)]:
    'La pièce note, discrètement, qu\'« à temps » est un endroit d\'où presque personne ne parvient jamais à partir.',
  [roomChoiceTextKey('the-summer-ends', 'drift')]: 'Ne rien promettre. Laisser les choses s\'estomper.',
  [roomChoiceHintKey('the-summer-ends', 'drift')]: 'Éviter complètement la conversation',
  [roomChoiceOutcomeKey('the-summer-ends', 'drift', 0)]: 'La voie du lâche, honnêtement facturée : pas de scène, pas de fin.',
  [roomChoiceOutcomeKey('the-summer-ends', 'drift', 1)]:
    'Dix-huit mois plus tard, toujours aucun mot pour dire ce que vous étiez. La phrase inachevée te suit.',
  [roomChoiceTextKey('the-summer-ends', 'open-until-christmas')]: 'Proposer un arrangement qu\'aucun de vous deux ne comprend encore.',
  [roomChoiceHintKey('the-summer-ends', 'open-until-christmas')]: '« libre », indéfini',
  [roomChoiceOutcomeKey('the-summer-ends', 'open-until-christmas', 0)]:
    'Le mot « libre » porte plus de poids qu\'aucun de vous deux ne peut soulever à dix-huit ans.',
  [roomChoiceOutcomeKey('the-summer-ends', 'open-until-christmas', 1)]:
    'Les termes restent indéfinis ce soir — et seront rediscutés, douloureusement, avant la fin de l\'année.',
  [roomExplanationKey('the-summer-ends', 0)]:
    'Le modèle d\'investissement de Rusbult réduit la question « pourquoi les gens restent-ils ou partent-ils » à trois ingrédients simples : la satisfaction (à quel point c\'est agréable), l\'investissement (ce que tu y as mis — temps, souvenirs, projets), et les alternatives (ce qui, ou qui, d\'autre, semble disponible). Les relations continuent ou se terminent souvent pour des raisons qui n\'ont que très peu à voir avec la quantité d\'amour présente — une relation fortement investie et modérément satisfaisante peut durer plus longtemps qu\'une relation radieuse mais peu investie. Aucune des quatre portes ici n\'est « la bonne » ; le modèle explique seulement pourquoi chacune est un choix réel et cohérent, et non un échec moral.',
  [roomNoteTitleKey('the-summer-ends')]: 'L\'arithmétique du fait de rester',
  [roomNoteThinkersKey('the-summer-ends')]: 'Caryl Rusbult (1980)',
  [roomNoteBodyKey('the-summer-ends')]:
    'Le modèle d\'investissement de Rusbult place sous l\'engagement une équation trompeusement simple : satisfaction plus investissement moins alternatives. Il a remarquablement bien résisté à des décennies d\'études, et son implication la plus inconfortable est celle-ci — **les gens restent dans une relation, et la quittent, pour des raisons qui n\'ont souvent rien à voir avec la présence ou non de l\'amour.** Une relation fortement investie peut survivre des années après que la satisfaction a disparu ; une relation à peine investie peut se terminer dès qu\'une meilleure option apparaît, quel qu\'ait été le ressenti. C\'est la première véritable apparition de ce modèle dans l\'hôtel ; la chambre de la veille du mariage, à l\'acte III, le récolte pleinement, une fois que l\'investissement a eu une décennie pour s\'accumuler. La valise a été faite dans tous les cas. Seule l\'étiquette a changé.',
});

register(roomBeatKey('the-summer-ends', 0, 3), 'v2', 'fr', (s: RunState) =>
  s.flags.includes('gave-the-key')
    ? 'Tu te souviens du mot de passe, du mois qu\'il t\'a fallu pour arrêter de retoucher tes messages avant de les envoyer. Quoi que tu promettes maintenant, tu sais déjà ce que ça coûte de promettre quelque chose par peur plutôt que par certitude.'
    : s.flags.includes('it-didnt-count')
      ? 'Tu te souviens de la soirée — de la phrase que tu as construite et ne lui as jamais dite. Quoi que tu promettes maintenant, une partie du poids de cette année t\'accompagne, qu\'elle le sache ou non.'
      : 'Ce que chacun de vous disait vouloir, autrefois, tout au début de l\'année, semble à la fois plus proche et plus lointain que trois semaines.',
);

// ---------- Act I: The Rumor (gate) ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-rumor', 0, 0)]:
    'Le lycée dit que Sara a trompé pendant le week-end au lac. Les preuves : une story floue, deux amis d\'amis, et son silence étrange depuis dimanche.',
  [roomBeatKey('the-rumor', 0, 1)]:
    'Tu fais la liste de ce que tu sais vraiment, puis — la pièce y tient aussi — de ce que tu ne sais pas. Les deux listes sont plus courtes que la rumeur.',
  [roomBeatKey('the-rumor', 0, 2)]:
    'Ce que ce non-savoir te fait, heure après heure, est une petite étude de cas à part entière, dont tu es à la fois le sujet et l\'unique témoin.',
  [roomBeatKey('the-rumor', 0, 3)]:
    'Son message reste sans réponse sur ton écran : « qu\'est-ce qui ne va pas ? » Tu l\'as lu onze fois et répondu zéro.',
  [roomBeatKey('the-rumor', 0, 4)]:
    'Trois options se présentent, et aucune n\'est confortable : lui demander franchement, se renseigner prudemment autour d\'elle, ou tendre un piège et voir ce qui vient s\'y prendre.',
  [roomBeatKey('the-rumor', 0, 5)]:
    'Le Portier : Il y a des tests qui mesurent une chose, et des tests qui la créent. La réception a cessé de proposer les premiers. Les clients ne les ont jamais demandés.',
  [roomChoiceTextKey('the-rumor', 'trust-without-asking')]: 'Accorder le bénéfice du doute, entier. Ne jamais demander.',
  [roomChoiceHintKey('the-rumor', 'trust-without-asking')]: 'Choisir de ne pas savoir',
  [roomChoiceOutcomeKey('the-rumor', 'trust-without-asking', 0)]:
    'Tu vis sans jamais savoir — de façon permanente. Aucune pièce ultérieure ne résout ça ; aucune ne le fera jamais.',
  [roomChoiceOutcomeKey('the-rumor', 'trust-without-asking', 1)]:
    'La confiance, traitée comme une décision plutôt que comme une conclusion, s\'avère plus lourde qu\'il n\'y paraît. La pièce la pèse honnêtement, et ne prétend pas que ce poids est léger.',
  [roomChoiceTextKey('the-rumor', 'ask-her-plainly')]:
    'Répondre à son message. Lui dire ce que tu as entendu, une fois, franchement — puis accepter sa réponse.',
  [roomChoiceHintKey('the-rumor', 'ask-her-plainly')]: 'La question, sans le tribunal',
  [roomChoiceOutcomeKey('the-rumor', 'ask-her-plainly', 0)]:
    'Tu réponds au message lu onze fois par une seule phrase : ce que tu as entendu, dit une fois, sans tribunal construit autour.',
  [roomChoiceOutcomeKey('the-rumor', 'ask-her-plainly', 1)]:
    'Elle te dit ce qui s\'est passé. Tu ne peux pas le vérifier et tu n\'essaies pas — ce n\'était jamais l\'accord que vous veniez de conclure. Une question, posée franchement, obtient une réponse ; elle n\'obtient pas un détecteur de mensonge.',
  [roomChoiceOutcomeKey('the-rumor', 'ask-her-plainly', 2)]:
    'Elle sait aussi, désormais, quelque chose qu\'elle ignorait une heure plus tôt : que la rumeur t\'a atteint, et a habité en toi, pendant tout le temps qu\'il t\'a fallu pour enfin répondre. Ça aussi, ça a eu un coût.',
  [roomChoiceTextKey('the-rumor', 'interrogate')]: 'Lui demander de tout raconter. Dates, noms, détails.',
  [roomChoiceHintKey('the-rumor', 'interrogate')]: 'Exiger le récit complet',
  [roomChoiceOutcomeKey('the-rumor', 'interrogate', 0)]:
    'Les réponses arrivent, et le dommage aussi — les questions elles-mêmes lui apprennent, avec précision, ce que tu penses qu\'elle est.',
  [roomChoiceOutcomeKey('the-rumor', 'interrogate', 1)]:
    'Quelle que soit la vérité, la relation contient désormais l\'interrogatoire pour toujours, comme un élément permanent.',
  [roomChoiceTextKey('the-rumor', 'set-the-trap')]: 'Lui raconter un faux détail — un que seule une personne coupable corrigerait.',
  [roomChoiceHintKey('the-rumor', 'set-the-trap')]: 'Tendre un piège et observer',
  [roomChoiceOutcomeKey('the-rumor', 'set-the-trap', 0)]: 'Le piège fonctionne. La pièce le laisse fonctionner.',
  [roomChoiceOutcomeKey('the-rumor', 'set-the-trap', 1)]:
    'Cette connaissance arrive dans la même enveloppe que ceci : tu es désormais quelqu\'un qui tend des pièges aux gens qu\'il aime. Les deux faits sont permanents. Le dernier contrôle te le relira, mot pour mot.',
  [roomChoiceTextKey('the-rumor', 'ask-the-accuser')]: 'Aller voir la source : « qu\'est-ce que tu y gagnes ? »',
  [roomChoiceHintKey('the-rumor', 'ask-the-accuser')]: 'Questionner le moteur de la rumeur, pas elle',
  [roomChoiceOutcomeKey('the-rumor', 'ask-the-accuser', 0)]:
    'La rare troisième porte. Le véritable moteur de la rumeur se dévoile — une rancune, un week-end d\'ennui, une photo mal interprétée.',
  [roomChoiceOutcomeKey('the-rumor', 'ask-the-accuser', 1)]:
    'Pas tout à fait une réhabilitation, mais une découverte à la durée de vie plus longue : la question « est-ce vrai ? » avait depuis toujours une grande sœur — « à qui profite le crime ? »',
  [roomExplanationKey('the-rumor', 0)]:
    'Le biais de confirmation signifie que l\'esprit, une fois méfiant, devient très doué pour trouver des preuves qui confirment ce soupçon, et très mauvais pour remarquer celles qui l\'infirment — le psychologue Raymond Nickerson a documenté cela comme l\'une des découvertes les plus solides du domaine. Le « test d\'Othello » décrit un piège apparenté : le simple fait de tester quelqu\'un pour vérifier sa culpabilité peut produire un comportement qui ressemble exactement à de la culpabilité, qu\'il y en ait ou non — nommé d\'après la façon dont le soupçon d\'Othello fabrique les preuves qui le détruisent. Le « bénéfice du doute » n\'est pas gratuit ; il coûte la certitude qu\'on obtiendrait en demandant, et il achète à la relation la chance de survivre au non-savoir.',
  [roomNoteTitleKey('the-rumor')]: 'Le test qui crée son propre résultat',
  [roomNoteThinkersKey('the-rumor')]: 'Nickerson (1998) · Othello (1603)',
  [roomNoteBodyKey('the-rumor')]:
    'La synthèse de Nickerson sur les recherches sur le biais de confirmation est sans ambiguïté : une fois qu\'une croyance est en place, l\'esprit recrute bien plus facilement les preuves qui la confirment que celles qui l\'infirment — le soupçon s\'auto-alimente par défaut, pas par exception. La dynamique d\'Othello aggrave le piège : un test conçu pour détecter la culpabilité peut fabriquer un comportement indiscernable de la culpabilité elle-même, chez l\'un ou chez l\'autre, et le test ne peut pas te dire lequel. **La certitude au sujet d\'un partenaire, achetée par la surveillance ou le piège, se paie dans une monnaie qui dévalue la relation même qu\'elle prétend protéger.** Parmi les clients qui ont tendu le piège, chacun d\'entre eux a attrapé quelque chose. Tous n\'ont pas aimé ce que c\'était.',
});
