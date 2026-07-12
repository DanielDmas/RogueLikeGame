// French translation of LIMERENCE's Act II room prose (beats, choice
// text/hint/outcome, field notes, plain-language explanations). Registered
// under version 'v2'. Follows the structural pattern established by
// fr-rooms.ts (prologue/Act I) — see CLAUDE.md's "Translating content" rule:
// every line here was translated against the room's actual beats and each
// choice's stakes, not word-for-word.
//
// tu/vous decision: informal "tu" throughout, continuing fr-rooms.ts's own
// choice rather than re-deciding it. Act II's cast is adults (18-24) in
// established or near-established relationships, but the narration remains
// the same device as the prologue and Act I: second-person interior address
// of the player-as-character inside their own relationship, not a narrator
// addressing a hotel guest from a respectful remove. Nothing about the prose
// shifts register toward that hotel-host framing — Act II is, if anything,
// more intimate than Act I (bedrooms, stomach-drops, a stone under the
// sternum at 3 a.m.), which argues harder for "tu", not less. The Porter
// keeps his measured, unhurried cadence and continues addressing the player
// as "tu", exactly as in the prologue and Act I.
//
// "The Porter" remains "Le Portier", per the established project convention
// (distinct from ANAMNESIS's own French guide-character term — never reused
// here; verified absent from this file, see the grep note below).
//
// Field-note thinkers lines: proper-name citations (with years) are carried
// through unchanged. Descriptive (non-named) thinkers lines are translated —
// e.g. "rebound literature · ethics of asymmetry" becomes "recherches sur
// les relations de transition · éthique de l'asymétrie". Book titles cited
// alongside an author's name (Glass's "Not Just Friends") are left in
// English, matching fr-rooms.ts's own precedent with Tennov's "Love and
// Limerence".
//
// Jules gender-neutrality: the English source deliberately never genders
// Jules (Act II's recurring partner, "the-distance" through "the-scoreboard").
// French grammar forces gender agreement on articles, possessives, past
// participles, and third-person pronouns in a way English doesn't, so this
// needed real, line-by-line handling — the same problem the German pass
// (de-rooms-act2.ts) solved for the same character; this file applies an
// equivalent strategy in French:
//   - Prefer constructions where "Jules" simply sits as the bare proper noun
//     doing or receiving the action, with no article or agreement suffix
//     needed — "Jules dit", "dire à Jules", "ce qui appartenait à Jules" —
//     so no il/elle/son/sa is ever required.
//   - Predicate adjectives are routed to invariant forms wherever possible
//     ("Jules est chaleureux et reconnaissant" would force masculine
//     agreement, so this file prefers nouns and states instead: "il y a de
//     la chaleur chez Jules, de la gratitude, du soulagement" or restructures
//     around "chez Jules").
//   - Passive and impersonal constructions ("on rassure Jules avec...",
//     "Jules se voit refuser...") route around a subject pronoun entirely
//     wherever the English has Jules as a grammatical object.
//   - Direct address ("tu dis à Jules...", "tu dois à Jules...") is used
//     heavily, since "tu" and "Jules" both sidestep gendered agreement.
//   - Where English repeats no name and French would otherwise need a
//     third-person pronoun, the name "Jules" is simply repeated rather than
//     replaced by il/elle/lui.
//   - Past participle agreement is the hardest recurring case (French marks
//     gender on the participle after être and in some avoir constructions
//     with a preceding direct object). Wherever the English doesn't strictly
//     require a completed, agreement-triggering construction, this file
//     prefers present tense, nominal phrasing, or a nearby avoir
//     construction without a fronted direct object referring to Jules, to
//     sidestep the agreement question entirely.
//   - Only where a relative pronoun or possessive determiner is genuinely
//     unavoidable (no rephrasing available without distorting the sentence)
//     does this file fall back to a grammatically masculine default,
//     matching the German pass's own documented precedent for the same
//     character. That fallback is rare by design; most sentences below route
//     around it.
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

/** Mirrors act2.ts's own seedSplit — same deterministic 50/50 split on the
 * run's doorSeed, so a translated branch always matches the English branch
 * it's standing in for. */
function seedSplit(s: RunState): boolean {
  return ((s.doorSeed ?? 0) * 2654435761) % 2 === 0;
}

// ---------- The Distance ----------
registerAll('v2', 'fr', {
  // beat 0 is a function beat — registered below via register().
  [roomBeatKey('the-distance', 0, 1)]:
    'Hier soir, une fête. Alena — la connaissance d\'une connaissance, vive et facile à parler — était à un centimètre de ta bouche, une seconde entière, avant que tu ne recules.',
  [roomBeatKey('the-distance', 0, 2)]:
    'Il ne s\'est rien passé. Tu t\'es répété cette phrase onze fois aujourd\'hui, la testant du bout de la langue comme une dent, à la recherche de fêlures.',
  [roomBeatKey('the-distance', 0, 3)]:
    'Le pas en arrière était réel. Tout aussi réelle, en dessous, était la seconde d\'avant — et la chambre te demande de tenir les deux à la fois, sans en effacer une pour l\'autre.',
  [roomBeatKey('the-distance', 0, 4)]:
    'L\'appel de ce soir avec Jules est prévu, ordinaire, déjà ouvert sur ton écran. Tu as trente secondes pour décider ce que tu y apportes.',
  [roomBeatKey('the-distance', 0, 5)]: 'Le Portier : Les clients classent le « presque » soit sous confession, soit sous inventaire. Le classement décide de ce que le mot devient.',
  [roomChoiceTextKey('the-distance', 'confess-the-near-miss')]: 'Raconte à Jules exactement ce qui a failli se passer.',
  [roomChoiceHintKey('the-distance', 'confess-the-near-miss')]: 'Donner la seconde entière, sans rien couper',
  [roomChoiceOutcomeKey('the-distance', 'confess-the-near-miss', 0)]:
    'Un appel difficile, et bon. La blessure de Jules est réelle ; tout aussi réel, en dessous, le soulagement d\'avoir reçu la vérité pendant qu\'elle n\'était encore rien.',
  [roomChoiceOutcomeKey('the-distance', 'confess-the-near-miss', 1)]:
    '« Merci de me l\'avoir dit pendant que ce n\'était encore rien », dit Jules, finalement. La phrase coûte quelque chose à vous deux — et achète aussi quelque chose.',
  [roomChoiceTextKey('the-distance', 'bury-it')]: 'Il ne s\'est rien passé. Il n\'y a rien à raconter.',
  [roomChoiceHintKey('the-distance', 'bury-it')]: 'Laisser la vérité technique tenir lieu de la vérité entière',
  [roomChoiceOutcomeKey('the-distance', 'bury-it', 0)]: 'Techniquement vrai. L\'appel se passe bien, ordinaire, quatre-vingt-dix minutes sur rien.',
  [roomChoiceOutcomeKey('the-distance', 'bury-it', 1)]: 'Le mur monte d\'une brique, sans que la personne qu\'il regarde s\'en aperçoive.',
  [roomChoiceTextKey('the-distance', 'soften-it')]: 'Raconte une version arrangée : « quelqu\'un a flirté avec moi, c\'était bizarre. »',
  [roomChoiceHintKey('the-distance', 'soften-it')]: 'Donner la forme, sans le contenu',
  [roomChoiceOutcomeKey('the-distance', 'soften-it', 0)]: 'Ça marche. Jules rit, sans inquiétude, et l\'appel continue.',
  [roomChoiceOutcomeKey('the-distance', 'soften-it', 1)]:
    'La version adoucie fonctionne si bien que la vraie ne pourra plus jamais être racontée sans révéler que l\'autre était arrangée. La chambre se referme sur ce calcul et te laisse le sentir arriver.',
  [roomChoiceTextKey('the-distance', 'keep-visiting-almost')]: 'Décide que « presque » est un endroit où tu peux continuer d\'aller.',
  [roomChoiceHintKey('the-distance', 'keep-visiting-almost')]: 'Laisser le déni plausible être tout le plan',
  [roomChoiceOutcomeKey('the-distance', 'keep-visiting-almost', 0)]:
    'Rien à confesser, rien à enterrer — tu laisses simplement la porte du « presque » déverrouillée, exprès, et tu ne te demandes pas pourquoi.',
  [roomChoiceOutcomeKey('the-distance', 'keep-visiting-almost', 1)]:
    'La chambre t\'accorde honnêtement ce plaisir : le frisson, le déni plausible. Et elle note, en silence, quelle porte de cet hôtel te sera désormais plus volontiers proposée.',
  [roomExplanationKey('the-distance', 0)]:
    'La vérité au compte-gouttes — avouer par petites doses qui te protègent, plutôt que d\'un coup — semble plus douce sur le moment et se révèle mesurablement pire pour la confiance que la pleine révélation comme le silence complet : les recherches sur la trahison trouvent systématiquement que les partenaires trahis jugent un correctif administré goutte à goutte plus dommageable que l\'acte original, parce que chaque nouveau détail rouvre la plaie et prouve que la version précédente était arrangée. « Il ne s\'est rien passé » et « il n\'y a rien à raconter » sonnent pareil et sont deux phrases différentes — l\'une décrit un événement, l\'autre décrit une décision sur ce que quelqu\'un d\'autre a le droit de savoir.',
  [roomNoteTitleKey('the-distance')]: 'L\'aveu arrangé',
  [roomNoteThinkersKey('the-distance')]: 'Shirley Glass (2003)',
  [roomNoteBodyKey('the-distance')]:
    'Les recherches de Glass sur la révélation sont sans ambiguïté sur un point : les partenaires trahis jugent systématiquement le correctif administré goutte à goutte — une histoire qui devient un peu plus vraie à chaque fois qu\'elle est mise en doute — pire que l\'acte original lui-même, parce que chaque révision prouve que la version précédente était une mise en scène, pas un récit. **Les murs se construisent une brique déniable à la fois ; personne ne décide, en une seule journée, d\'en bâtir un.** Ce qui compte n\'est pas la taille du secret — c\'est de savoir si la porte a été laissée ouverte ou juste, silencieusement, entrouverte de façon plausible. « Presque » est une banlieue. On y fait la navette.',
});

register(roomBeatKey('the-distance', 0, 0), 'v2', 'fr', (s: RunState) =>
  s.flags.includes('promised-september')
    ? 'Toi et Jules avez tenu la promesse que vous vous étiez faite en septembre. Huit mois à deux villes, un seul calendrier, et une facture de téléphone dont aucun de vous deux ne parle.'
    : s.flags.includes('first-open')
      ? 'Toi et Jules essayez encore de comprendre ce que « ouvert » a bien pu vouloir dire, huit mois plus tard. Le mot porte plus de poids qu\'aucun de vous deux ne peut vraiment soulever.'
      : 'Toi et Jules avez tenu jusqu\'au printemps. Deux villes, un calendrier, la relation tournant avec un décalage de satellite dont vous avez tous deux cessé de vous apercevoir.',
);

// ---------- The Hall Pass ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-hall-pass', 0, 0)]:
    'Jules le propose raisonnablement, généreusement, devant un café : des exceptions, le temps d\'être séparés. Moderne. Sûr. Personne n\'appartient à personne. La formulation est soignée, et elle se veut gentille.',
  [roomBeatKey('the-hall-pass', 0, 1)]:
    'Ton estomac répond avant ta bouche — une chute, petite et sans équivoque, qui arrive deux bonnes secondes avant tout ce que tu pourrais appeler une pensée.',
  [roomBeatKey('the-hall-pass', 0, 2)]:
    'Les adjectifs que tu redoutes arrivent ensuite, sans y être invités : collant. Jaloux. Jeune. Pas assez moderne. Tu les répertories avant même d\'avoir décidé quoi que ce soit.',
  [roomBeatKey('the-hall-pass', 0, 3)]:
    'À quoi servirait vraiment un oui, ici — la paix, une image de toi, ou la peur de perdre Jules pour un « non » ? La chambre insiste pour que tu le nommes avant de répondre.',
  [roomBeatKey('the-hall-pass', 0, 4)]:
    'Le Portier : La réception a traité dix mille arrangements. Ceux qu\'on signe pour éviter une conversation survivent en moyenne à peu près une semaine à cette conversation.',
  [roomChoiceTextKey('the-hall-pass', 'agree-to-keep-peace')]: 'Dis oui, pour ne pas avoir l\'air mesquin.',
  [roomChoiceHintKey('the-hall-pass', 'agree-to-keep-peace')]: 'Jouer l\'aisance que tu ne ressens pas',
  [roomChoiceOutcomeKey('the-hall-pass', 'agree-to-keep-peace', 0)]: 'Le oui achète une semaine vraiment bonne. Il y a de la chaleur chez Jules, de la gratitude, du soulagement.',
  [roomChoiceOutcomeKey('the-hall-pass', 'agree-to-keep-peace', 1)]:
    'L\'accord reste en toi comme du verre avalé. Des semaines plus tard, Jules mentionne — une phrase, aucun détail — que l\'arrangement a servi. Ton visage fait quelque chose que tu ne peux pas voir toi-même.',
  [roomChoiceTextKey('the-hall-pass', 'true-no')]: 'Dis le vrai non. Tant pis pour les adjectifs.',
  [roomChoiceHintKey('the-hall-pass', 'true-no')]: 'Te laisser sonner aussi peu moderne que nécessaire',
  [roomChoiceOutcomeKey('the-hall-pass', 'true-no', 0)]:
    'La surprise passe, puis — un souffle plus tard — un vrai soulagement chez Jules d\'obtenir une vraie réponse plutôt qu\'une comédie.',
  [roomChoiceOutcomeKey('the-hall-pass', 'true-no', 1)]:
    'La conversation que la proposition remplaçait a enfin lieu : ce que « séparés » fait vraiment à chacun de vous. Une dispute honnête. Un temps meilleur, après.',
  [roomChoiceTextKey('the-hall-pass', 'counter-with-need')]: '« Voilà ce dont j\'ai vraiment besoin pendant qu\'on est séparés. »',
  [roomChoiceHintKey('the-hall-pass', 'counter-with-need')]: 'Négocier des besoins, pas des permissions',
  [roomChoiceOutcomeKey('the-hall-pass', 'counter-with-need', 0)]:
    'La conversation qui suit est plus lente, et meilleure, qu\'un oui ou qu\'un non ne l\'aurait été.',
  [roomChoiceOutcomeKey('the-hall-pass', 'counter-with-need', 1)]:
    'Ce que vous construisez est plus petit que le « cadeau » proposé — mais c\'est vraiment le vôtre : des besoins sur la table plutôt que des permissions distribuées.',
  [roomChoiceTextKey('the-hall-pass', 'take-it-angrily')]: 'Prends le laissez-passer que tu ne voulais pas, et sers-t\'en pour prendre ta revanche à l\'avance.',
  [roomChoiceHintKey('the-hall-pass', 'take-it-angrily')]: 'Dépenser le cadeau par dépit',
  [roomChoiceOutcomeKey('the-hall-pass', 'take-it-angrily', 0)]:
    'La chambre élude délibérément la nuit elle-même — un seuil, une coupe. Ce qui reste, c\'est le lendemain matin, et l\'arithmétique qu\'il contient.',
  [roomChoiceOutcomeKey('the-hall-pass', 'take-it-angrily', 1)]:
    'Tu t\'es servi d\'une inconnue et d\'une échappatoire pour punir quelqu\'un qui, ce matin-là, ne t\'avait encore rien fait.',
  [roomExplanationKey('the-hall-pass', 0)]:
    'Les chercheurs qui étudient la non-monogamie consentie trouvent systématiquement une nette différence entre les arrangements négociés — construits à partir de besoins exprimés, révisés, réellement voulus — et ceux auxquels on cède pour éviter un conflit ou pour ne pas passer pour quelqu\'un d\'insécure. Les accords conclus par peur se rapprochent, sur le plan du bien-être, davantage de l\'infidélité que de l\'ouverture, quel que soit ce qui a été techniquement convenu. « Je n\'ai pas envie de ça » est une phrase complète ; à vingt ans, entouré d\'une culture qui code l\'hésitation comme de l\'immaturité, elle en a rarement l\'air.',
  [roomNoteTitleKey('the-hall-pass')]: 'Signé sous la pression',
  [roomNoteThinkersKey('the-hall-pass')]: 'Conley · Moors (recherches sur la CNM)',
  [roomNoteBodyKey('the-hall-pass')]:
    'Les recherches sur la non-monogamie consensuelle sont honnêtes dans les deux sens : la satisfaction et la confiance atteignent des niveaux comparables à ceux des relations monogames *quand les arrangements sont librement négociés* — réellement voulus, pas simplement tolérés. Les mêmes recherches montrent tout aussi clairement que les accords conclus par peur de paraître jaloux, collant ou pas cool se rapprochent de l\'infidélité dans leur effet sur le bien-être, quel que soit ce qui figure sur le papier. **Un consentement joué et un consentement ressenti peuvent sembler identiques d\'un côté à l\'autre de la table, et produire des années totalement différentes.** Un cadeau qu\'on croit ne pas pouvoir refuser n\'est pas un cadeau. C\'est une facture qui arrive plus tard, détaillée poste par poste.',
});

// ---------- The Rebound ----------
registerAll('v2', 'fr', {
  // beat 0 is a function beat — registered below via register().
  [roomBeatKey('the-rebound', 0, 1)]:
    'Mira est chaleureuse, drôle, entièrement sans défense. Ce soir, en se brossant les dents à ton lavabo comme si c\'était déjà une habitude, elle demande : « je devrais en laisser une ici ? »',
  [roomBeatKey('the-rebound', 0, 2)]:
    'Tu fais l\'inventaire de ce que tu ressens vraiment, et la réponse honnête est : du bruit de fond. De la gratitude. Une forme là où devrait être un sentiment — dessinée, mais vide.',
  [roomBeatKey('the-rebound', 0, 3)]: 'Jules s\'impose — un seul battement de cœur, involontaire, non désiré — en plein milieu d\'une phrase, en plein milieu de Mira, disparu aussi vite qu\'il est arrivé.',
  [roomBeatKey('the-rebound', 0, 4)]: 'Mira dit à voix haute ce que c\'est pour elle, tout à fait sincère, tout à fait sans défense. Elle ne joue aucune comédie. C\'est ce qui rend les choses pires.',
  [roomBeatKey('the-rebound', 0, 5)]:
    'Le Portier : Le service d\'étage signale un client qui commande pour deux, et un client qui mange seul à la même table. Ça arrive plus souvent qu\'on ne le croit.',
  [roomChoiceTextKey('the-rebound', 'tell-her-what-this-is')]: 'Dis la phrase-anesthésie, à voix haute, ce soir.',
  [roomChoiceHintKey('the-rebound', 'tell-her-what-this-is')]: 'Nommer ce qu\'elle représente pour toi en ce moment',
  [roomChoiceOutcomeKey('the-rebound', 'tell-her-what-this-is', 0)]:
    'La cruauté la plus douce que ce plage propose. Le visage de Mira change en temps réel à mesure que la phrase atterrit.',
  [roomChoiceOutcomeKey('the-rebound', 'tell-her-what-this-is', 1)]:
    'Ce qu\'elle fait ensuite — rester, en connaissance de cause, ou partir — la chambre le laisse entièrement entre ses mains. Ça n\'a jamais été à toi de décider pour elle ; c\'était seulement à toi de le rendre possible.',
  [roomChoiceTextKey('the-rebound', 'let-her-believe')]: 'Ne dis rien. Reste chaleureux.',
  [roomChoiceHintKey('the-rebound', 'let-her-believe')]: 'Laisser l\'histoire s\'écrire toute seule',
  [roomChoiceOutcomeKey('the-rebound', 'let-her-believe', 0)]:
    'Des mois passent comme un seul souffle retenu. Puis : son « je t\'aime », arrivant en plein mardi ordinaire, entièrement sans défense.',
  [roomChoiceOutcomeKey('the-rebound', 'let-her-believe', 1)]:
    'La chambre se fige sur ton inspiration et coupe à cet instant précis, délibérément. La dette accumulait des intérêts depuis le début ; ceci n\'est que le relevé qui arrive.',
  [roomChoiceTextKey('the-rebound', 'end-it')]: 'Mets-y fin, avant que ça ne lui coûte davantage.',
  [roomChoiceHintKey('the-rebound', 'end-it')]: 'Arrêter pendant que le prix est encore petit',
  [roomChoiceOutcomeKey('the-rebound', 'end-it', 0)]: 'Elle pleure et te remercie en l\'espace des dix mêmes minutes — chagrin et soulagement dans un seul et même souffle.',
  [roomChoiceOutcomeKey('the-rebound', 'end-it', 1)]:
    'Le chagrin te revient ensuite à plein volume, sans plus nulle part où le mettre. Le bruit de fond que l\'anesthésie masquait, enfin découvert.',
  [roomChoiceTextKey('the-rebound', 'try-to-catch-up')]: 'Essaie de te forcer à ressentir ce qu\'elle ressent.',
  [roomChoiceHintKey('the-rebound', 'try-to-catch-up')]: 'Vouloir le sentiment jusqu\'à le faire exister',
  [roomChoiceOutcomeKey('the-rebound', 'try-to-catch-up', 0)]: 'Une sincérité laborieuse, rendue avec honnêteté.',
  // outcome 1 is a function beat — registered below via register().
  [roomExplanationKey('the-rebound', 0)]:
    'Les relations de transition ne sont pas systématiquement nuisibles — les recherches trouvent des résultats mitigés, et certaines aident vraiment les gens à se relever plus vite et plus complètement que l\'isolement ne le permettrait. Le tort documenté ne vient pas de la relation de transition elle-même ; il vient de l\'asymétrie d\'information qu\'elle contient, quand une personne régule un sentiment et que l\'autre croit en train d\'en construire un. « Je n\'ai jamais rien promis » est vrai et, à lui seul, insuffisant — le consentement informé est la ligne entre se servir de quelqu\'un comme anesthésie et être simplement deux personnes en train de découvrir ensemble ce que c\'est.',
  [roomNoteTitleKey('the-rebound')]: 'Anesthésie avec un pouls',
  [roomNoteThinkersKey('the-rebound')]: 'recherches sur les relations de transition · éthique de l\'asymétrie',
  [roomNoteBodyKey('the-rebound')]:
    'Ce que montrent réellement les recherches sur les relations de transition est plus nuancé que la sagesse populaire : la guérison peut être plus rapide, les résultats peuvent être vraiment bons, et l\'idée reçue selon laquelle « il faut d\'abord redevenir célibataire » n\'est pas bien étayée comme règle générale. **La ligne de partage n\'est pas le moment — elle tient à savoir si les deux personnes disposent de la même information sur ce que c\'est.** Le risque propre à une relation de transition n\'est pas qu\'elle soit arrivée trop tôt ; c\'est qu\'une des deux personnes utilise la relation comme régulation pendant que l\'autre croit construire quelque chose, et une seule des deux sait laquelle des deux versions est vraie. Les personnes bienveillantes sont choisies précisément parce qu\'elles peuvent porter ce poids. Ce n\'est pas un hasard, et ce n\'est pas non plus automatiquement un crime — mais c\'est une dette, et les dettes arrivent à échéance.',
});

register(roomBeatKey('the-rebound', 0, 0), 'v2', 'fr', (s: RunState) =>
  s.flags.includes('let-it-drift') || s.flags.includes('end-clean')
    ? 'Trois semaines depuis la fin avec Jules, en silence, comme les choses dérivaient déjà depuis un moment. Mira est arrivée plus vite que tu n\'aurais imaginé quoi que ce soit pouvoir arriver.'
    : 'Trois semaines depuis la fin avec Jules — soudaine, venue de toi, plus nette qu\'elle ne l\'a paru sur le moment. Mira est arrivée plus vite que tu n\'aurais imaginé quoi que ce soit pouvoir arriver.',
);

register(roomChoiceOutcomeKey('the-rebound', 'try-to-catch-up', 1), 'v2', 'fr', (s: RunState) =>
  seedSplit(s)
    ? 'Cette fois, ça marche vraiment. Quelque part dans l\'effort, quelque chose de réel commence à pousser en dessous — la chambre tient cela pour authentiquement rare : parfois, vouloir ressentir quelque chose fait déjà la moitié du chemin vers le ressentir.'
    : 'Cette fois, ça ne prend pas. L\'effort lui-même devient son propre petit chagrin privé — la chambre est honnête sur les probabilités : à vingt et un ans, ça marche parfois, et parfois non, et tu ne sais jamais à l\'avance dans lequel des deux cas tu te trouves.',
);

// ---------- The Unicorn ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-unicorn', 0, 0)]:
    'Erik et Maja — cinq ans ensemble, un bel appartement, une chaleur si rodée qu\'elle paraît sans effort — t\'invitent à dîner, puis t\'invitent à entrer. Comme leur troisième.',
  [roomBeatKey('the-unicorn', 0, 1)]:
    'L\'offre est réelle, et l\'attirance aussi ; la chambre ne prétend pas que l\'une ou l\'autre soit creuse. Tu observes leur chorégraphie pendant qu\'ils la déploient : qui touche qui, qui vérifie le visage de l\'autre avant de parler.',
  [roomBeatKey('the-unicorn', 0, 2)]:
    'Les règles ont été écrites avant que tu existes et sont présentées, presque plastifiées : pas de rendez-vous en tête-à-tête. Pas de nuitées en semaine. « On passe en premier » — dit gentiment, et absolument.',
  [roomBeatKey('the-unicorn', 0, 3)]:
    'Ce que tu reçois, honnêtement accordé : de l\'appartenance, de la chaleur, l\'attention pleine et entière de deux personnes tournée vers toi à la fois. La chambre laisse cela se sentir aussi bon que voulu.',
  [roomBeatKey('the-unicorn', 0, 4)]: 'Première fissure, minuscule : le visage de Maja, pendant exactement une seconde, quand Erik rit trop longtemps à quelque chose que tu as dit.',
  [roomBeatKey('the-unicorn', 0, 5)]: 'Le Portier : La suite 3 réserve un lit d\'appoint tous les quelques mois. Le lit d\'appoint ne choisit jamais la chambre.',
  [roomChoiceTextKey('the-unicorn', 'obey-the-rules')]: 'Accepte les conditions exactement telles qu\'elles sont écrites.',
  [roomChoiceHintKey('the-unicorn', 'obey-the-rules')]: 'Signer ce qui est devant toi',
  [roomChoiceOutcomeKey('the-unicorn', 'obey-the-rules', 0)]: 'Trois bons mois, condensés en deux instants — chaleureux, faciles, exactement comme annoncé.',
  [roomChoiceOutcomeKey('the-unicorn', 'obey-the-rules', 1)]:
    'Puis une règle que tu n\'as jamais vue est invoquée, rétroactivement, par les deux personnes qui ont écrit le règlement. Tu apprends qu\'il existe un errata que seuls eux deux reçoivent.',
  [roomChoiceTextKey('the-unicorn', 'renegotiate')]: '« Réécrivons les règles avec moi dans la pièce, ou je ne signe pas. »',
  [roomChoiceHintKey('the-unicorn', 'renegotiate')]: 'Insister pour être partie aux conditions',
  [roomChoiceOutcomeKey('the-unicorn', 'renegotiate', 0)]: 'Le vrai test pour savoir si « égal » a jamais été sincère.',
  // outcome 1 is a function beat — registered below via register().
  [roomChoiceTextKey('the-unicorn', 'discover-we-come-first')]: 'Reste jusqu\'à la nuit où Maja pleure — et apprends ce que veut dire la hiérarchie.',
  [roomChoiceHintKey('the-unicorn', 'discover-we-come-first')]: 'Laisser la règle s\'enseigner elle-même',
  [roomChoiceOutcomeKey('the-unicorn', 'discover-we-come-first', 0)]:
    'Le taxi de deux heures du matin, rendu dans son intégralité : toi, habillé à la hâte, et derrière toi une porte déjà en train de se fermer, déjà en train de se ressouder autour d\'eux deux.',
  [roomChoiceOutcomeKey('the-unicorn', 'discover-we-come-first', 1)]:
    '« On passe en premier » cesse d\'être une phrase sur une page plastifiée et devient quelque chose que tu comprends d\'un coup dans ton corps, à deux heures du matin, dans un taxi.',
  [roomChoiceTextKey('the-unicorn', 'decline-kindly')]: 'Décline. Explique pourquoi, gentiment.',
  [roomChoiceHintKey('the-unicorn', 'decline-kindly')]: 'Emprunter le chemin non choisi, avec grâce',
  [roomChoiceOutcomeKey('the-unicorn', 'decline-kindly', 0)]:
    'Le chemin non choisi, parcouru avec grâce plutôt qu\'avec drame. Erik et Maja réagissent à leur tour avec élégance — et un peu de déception, et c\'est autorisé à être vrai aussi.',
  [roomChoiceOutcomeKey('the-unicorn', 'decline-kindly', 1)]:
    'Ils réapparaissent au fil de l\'étage, à distance — toujours brillants, toujours rodés, avec, comme tu le remarques par hasard, leur quatrième lit d\'appoint.',
  [roomExplanationKey('the-unicorn', 0)]:
    'Les recherches sur le « privilège du couple » dans les arrangements non monogames distinguent structurellement une hiérarchie révélée d\'emblée d\'une hiérarchie découverte — la différence entre une carte honnête et une trappe. Les troisièmes personnes portent un risque structurel réel et bien documenté dans les arrangements de type « licorne » : des règles écrites avant leur arrivée, appliquées unilatéralement, révisables par le couple seul. Rien de tout cela ne signifie que les triades égalitaires soient impossibles — les recherches sont justes envers la non-monogamie authentique et négociée — cela signifie seulement qu\'« égal » est une affirmation qui doit survivre à l\'épreuve, pas seulement être énoncée.',
  [roomNoteTitleKey('the-unicorn')]: 'Le lit d\'appoint',
  [roomNoteThinkersKey('the-unicorn')]: 'recherches sur la CNM et les dynamiques « licorne » (Moors, Conley et al.)',
  [roomNoteBodyKey('the-unicorn')]:
    'Les recherches sur la « chasse à la licorne » — des couples établis cherchant une troisième personne partagée — documentent un schéma constant : des règles écrites avant l\'arrivée de la troisième personne, une hiérarchie communiquée comme une formalité plutôt que négociée comme une véritable structure, et une asymétrie des coûts de sortie (le couple reste un couple ; la troisième personne part seule). La distinction utile qu\'établissent les recherches est entre les couples qui *s\'ouvrent* — qui se restructurent réellement pour inclure une voix supplémentaire égale — et les couples qui *acquièrent* — qui ajoutent une personne à une structure inchangée. **Égalité sur le papier et hiérarchie dans la cuisine ne sont pas contradictoires. C\'est ainsi que le schéma fonctionne le plus souvent.** Il existe aussi des triades véritablement égalitaires, documentées elles aussi ; le signe distinctif est de savoir si la troisième personne participe à l\'écriture des règles — ou si elle ne fait qu\'y consentir.',
});

register(roomChoiceOutcomeKey('the-unicorn', 'renegotiate', 1), 'v2', 'fr', (s: RunState) =>
  seedSplit(s)
    ? 'À leur crédit — un crédit réel, gagné avec effort — la négociation a bel et bien lieu sous tes yeux, et quelque chose comme une vraie charte en émerge. Ce n\'est pas parfait. C\'est, pour la première fois, vraiment aussi le tien.'
    : 'La négociation s\'enlise, poliment, entre « bien sûr » et tout changement réel. L\'offre n\'est pas retirée. Elle cesse simplement, en silence, d\'être renouvelée — tu apprends ce qu\'« égal » voulait dire en observant ce qui se passe quand tu le demandes par écrit.',
);

// ---------- Just Friends ----------
registerAll('v2', 'fr', {
  [roomBeatKey('just-friends', 0, 0)]:
    'Alena. Partenaire de révisions, blagues internes, la personne à qui tu racontes les choses en premier. Jules reçoit le résumé de ta semaine ; Alena reçoit le brouillon, non coupé, au fur et à mesure.',
  [roomBeatKey('just-friends', 0, 1)]:
    'Il ne s\'est rien passé. La chambre te demande quand même de dresser l\'inventaire de ce « rien » : la place que tu réserves sans y penser, la commande de café que tu connais par cœur, les bonne-nuits de 23h40 devenues porteuses.',
  [roomBeatKey('just-friends', 0, 2)]:
    'La comparaison que la chambre impose, côte à côte : ce que Jules sait de ta semaine en ce moment, et ce qu\'Alena savait déjà à l\'heure du déjeuner.',
  [roomBeatKey('just-friends', 0, 3)]:
    'Les preuves sur ton téléphone, examinées comme on examine un dossier — des horodatages formant leur propre forme silencieuse de crainte, rien d\'explicite parmi eux, et pourtant tout paraît vaguement accablant.',
  [roomBeatKey('just-friends', 0, 4)]: '« On est juste amis », dis-tu, à personne en particulier, et la chambre demande — doucement, précisément — à qui tu disais vraiment cela.',
  [roomBeatKey('just-friends', 0, 5)]: 'Le Portier : L\'architecture ne ment jamais. Demandez seulement : de quel côté regardent les fenêtres ?',
  [roomChoiceTextKey('just-friends', 'open-window')]: 'Raconte tout à Jules à propos d\'Alena — y compris le classement.',
  [roomChoiceHintKey('just-friends', 'open-window')]: 'Laisser la lumière entrer complètement',
  [roomChoiceOutcomeKey('just-friends', 'open-window', 0)]:
    'La conversation est affreuse, et courte, et le mur tombe brique par brique audible pendant que vous êtes encore assis là, tous les deux.',
  [roomChoiceOutcomeKey('just-friends', 'open-window', 1)]:
    'Alena, à qui l\'on n\'a rien dit, remarque tout en l\'espace d\'une semaine. Une amitié véritable retrouve sa juste taille, à un vrai coût, nommé.',
  [roomChoiceTextKey('just-friends', 'nothing-to-tell')]: 'Garde-la dans le dossier « rien à raconter ».',
  [roomChoiceHintKey('just-friends', 'nothing-to-tell')]: 'Protéger la catégorie, pas seulement le secret',
  [roomChoiceOutcomeKey('just-friends', 'nothing-to-tell', 0)]: 'Le dossier s\'épaissit d\'une soirée à la fois, chacune individuellement défendable.',
  [roomChoiceOutcomeKey('just-friends', 'nothing-to-tell', 1)]:
    'La chambre se termine sur l\'arithmétique de Glass rendue visible : la fenêtre regarde maintenant vers Alena. Le mur regarde maintenant vers Jules. Personne n\'a choisi cela un jour précis, et c\'est exactement ainsi que ça se fait.',
  [roomChoiceTextKey('just-friends', 'test-the-evening')]: 'Organise une soirée avec Alena qui pourrait tourner dans un sens ou dans l\'autre.',
  [roomChoiceHintKey('just-friends', 'test-the-evening')]: 'Garder ça déniable, exprès',
  [roomChoiceOutcomeKey('just-friends', 'test-the-evening', 0)]: 'La soirée, en temps réel, franche — la chambre n\'adoucit pas ce qu\'elle est, seulement où elle s\'arrête.',
  [roomChoiceOutcomeKey('just-friends', 'test-the-evening', 1)]:
    'Le seuil arrive, et la chambre coupe la main sur la poignée de la porte. Ce qui s\'est passé reste enregistré, ambiguïté intacte, pour que la porte finale le relise plus tard.',
  [roomChoiceTextKey('just-friends', 'name-it-set-boundary')]: 'Dis-le à Alena, à voix haute, et pose la limite toi-même.',
  [roomChoiceHintKey('just-friends', 'name-it-set-boundary')]: 'Dire la phrase vraie à la personne concernée',
  [roomChoiceOutcomeKey('just-friends', 'name-it-set-boundary', 0)]:
    'La version la plus difficile : « ça devient ce que les gens appellent rien » — dit en face, pas répété dans le vide pour t\'en débarrasser.',
  [roomChoiceOutcomeKey('just-friends', 'name-it-set-boundary', 1)]:
    'Sa réponse est honnête aussi, et elle coûte quelque chose. Moins de cafés ensemble. Un meilleur sommeil. Une amitié, sauvée à sa juste taille.',
  [roomExplanationKey('just-friends', 0)]:
    'La liste de critères de « liaison émotionnelle » que les chercheurs utilisent réellement porte moins sur un événement unique que sur un schéma : une énergie redirigée, un secret (même léger), et un classement privé de qui apprend quoi en premier. « On ne s\'est jamais touchés » répond à une question que personne dans la chambre ne posait vraiment. L\'image des fenêtres et des murs mérite d\'être transportée bien au-delà de cet hôtel — l\'intimité est architecturale : quelle que soit la relation qui reçoit la transparence, elle a la fenêtre, et celle qui reçoit les non-dits a le mur, indépendamment de laquelle des deux tu appellerais la « vraie » relation.',
  [roomNoteTitleKey('just-friends')]: 'Murs et fenêtres',
  [roomNoteThinkersKey('just-friends')]: 'Shirley Glass, Not Just Friends (2003)',
  [roomNoteBodyKey('just-friends')]:
    'La découverte centrale de Glass, issue de décennies de pratique clinique, est que la plupart des liaisons — émotionnelles ou autres — commencent entre des personnes qui se seraient qualifiées de « juste amis » jusqu\'au moment où ce n\'était plus vrai, sans jamais avoir consciemment planifié la transition. **L\'ingrédient actif est le secret, pas l\'attirance ; l\'attirance est courante et le plus souvent inoffensive, c\'est le secret qui la transforme.** Son image architecturale a survécu à la recherche précise dont elle est issue parce qu\'elle est tout simplement juste : une relation a une fenêtre (ce qui est partagé ouvertement avec ton ou ta partenaire) et, inévitablement, un mur (ce qui ne l\'est pas) — et les deux autres personnes dans ta vie se tiennent toujours d\'un côté ou de l\'autre, que tu aies voulu les y placer ou non. La fenêtre et le mur pèsent exactement le même poids. Seul l\'emplacement diffère.',

  // ---------- The Ex ----------
});
register(roomBeatKey('the-ex', 0, 0), 'v2', 'fr', (s: RunState) =>
  s.flags.includes('set-the-trap')
    ? 'Sara — cette Sara-là, celle que tu as piégée pour obtenir une réponse, il y a quatre ans et toute une vie — écrit à 23h51 : « J\'ai fait une erreur. » Tu te souviens encore exactement de ce qu\'il en a coûté d\'apprendre ce que ça a fait.'
    : 'Sara — la Sara du rez-de-chaussée, disparue depuis quatre ans maintenant — écrit à 23h51 : « J\'ai fait une erreur. »',
);
registerAll('v2', 'fr', {
  [roomBeatKey('the-ex', 0, 1)]:
    'Tu es heureux avec Jules. La plupart du temps. Le mot « la plupart du temps » arrive tout seul, sans y être invité, et tu le laisses là plutôt que de le supprimer.',
  [roomBeatKey('the-ex', 0, 2)]:
    'L\'archive s\'ouvre malgré toi — chaque souvenir de Sara éclairé à l\'heure dorée, monté par un ou une monteuse qui a apparemment passé quatre ans à supprimer discrètement les pires scènes.',
  [roomBeatKey('the-ex', 0, 3)]:
    'La chambre restaure les scènes manquantes, une à la fois, comme on rouvre un dossier de Chattam : les disputes, les silences, les vraies raisons de la fin — montrées, pas résumées.',
  [roomBeatKey('the-ex', 0, 4)]: 'Dans la pièce d\'à côté, Jules rit de quelque chose à la télé, sans aucune idée que ce message existe déjà.',
  [roomBeatKey('the-ex', 0, 5)]: 'Le Portier : Le passé écrit les meilleurs slogans de tout l\'hôtel. Il ne mentionne jamais pourquoi il est vacant.',
  [roomChoiceTextKey('the-ex', 'reread-everything')]: 'Ouvre l\'archive entière. Deux heures du matin.',
  [roomChoiceHintKey('the-ex', 'reread-everything')]: 'Te laisser tomber dedans complètement',
  [roomChoiceOutcomeKey('the-ex', 'reread-everything', 0)]:
    'La spirale, rendue avec honnêteté : rien d\'envoyé, tout remué, quatre ans de lumière dorée arrangée rejoués à pleine intensité.',
  [roomChoiceOutcomeKey('the-ex', 'reread-everything', 1)]:
    'Trois jours suivent, à comparer Jules, en silence et injustement, à quelqu\'un qui — la chambre vient de te le montrer en détail — n\'a jamais vraiment existé.',
  [roomChoiceTextKey('the-ex', 'answer-her')]: 'Réponds. Juste pour parler.',
  [roomChoiceHintKey('the-ex', 'answer-her')]: 'Rouvrir une porte pour laquelle tu as quatre ans de mémoire musculaire',
  [roomChoiceOutcomeKey('the-ex', 'answer-her', 0)]:
    '« Juste parler » avec quelqu\'un pour qui tu as quatre ans de mémoire musculaire n\'est pas, il s\'avère, un acte neutre.',
  [roomChoiceOutcomeKey('the-ex', 'answer-her', 1)]:
    'La chambre termine l\'échange en pleine chaleur, délibérément, curseur clignotant — la conversation n\'est pas encore une trahison de quoi que ce soit, et elle n\'est pas encore rien non plus.',
  [roomChoiceTextKey('the-ex', 'block')]: 'Bloque. Les deux applications. Ce soir.',
  [roomChoiceHintKey('the-ex', 'block')]: 'Fermer une porte que tu as déjà fermée une fois',
  [roomChoiceOutcomeKey('the-ex', 'block', 0)]: 'Net, froid, et — la chambre insiste là-dessus — vraiment pleuré, pas seulement efficace.',
  [roomChoiceOutcomeKey('the-ex', 'block', 1)]:
    'Bloquer s\'avère être une porte que tu fermes aussi sur une version de toi-même, pas seulement sur Sara. La protection et la perte arrivent ensemble.',
  [roomChoiceTextKey('the-ex', 'tell-jules')]: 'Tends ton téléphone à Jules : « Sara a écrit. »',
  [roomChoiceHintKey('the-ex', 'tell-jules')]: 'Laisser la fenêtre regarder dans la bonne direction',
  [roomChoiceOutcomeKey('the-ex', 'tell-jules', 0)]:
    'La fenêtre plutôt que le mur. La peur de Jules, quelle qu\'elle soit, se traite au grand air plutôt que seule dans ta tête.',
  [roomChoiceOutcomeKey('the-ex', 'tell-jules', 1)]:
    'Quelle que soit la réponse finalement envoyée, si tant est qu\'il y en ait une, elle est rédigée par deux personnes ensemble — exactement ce que quatre ans d\'archive arrangée n\'auraient jamais pu faire.',
  [roomExplanationKey('the-ex', 0)]:
    'D\'anciennes flammes reprennent contact pour un vrai mélange de raisons — une rechute de leur propre limérence, la solitude, un vrai changement de leur côté — et les trois se vérifient assez souvent pour qu\'aucune explication unique ne doive être présumée. Ce qui est bien documenté, c\'est la mémoire idéalisée : le cerveau élimine de façon fiable les détails douloureux des souvenirs positifs d\'une relation plus vite qu\'il n\'élimine les bons, un biais parfois appelé rétrospection en rose. La question diagnostique utile n\'est pas « est-ce que je ressens encore quelque chose » — c\'est « me manque-t-elle, elle précisément, ou me manque-t-il d\'avoir vingt ans ».',
  [roomNoteTitleKey('the-ex')]: 'Le conservateur',
  [roomNoteThinkersKey('the-ex')]: 'Fisher · recherches sur les biais de mémoire',
  [roomNoteBodyKey('the-ex')]:
    'Les travaux de Helen Fisher sur la neurochimie de l\'amour ont montré que le circuit de récompense activé par un ancien ou une ancienne partenaire peut se réactiver au contact renouvelé, ce qui est un fait de chimie cérébrale, pas un verdict sur la relation. Séparément, les chercheurs en mémoire ont documenté à maintes reprises la rétrospection en rose — les expériences positives sont, avec le temps, mieux mémorisées qu\'elles n\'étaient évaluées sur le moment, tandis que les détails négatifs s\'estompent le plus vite de tous. **Le musée est beau parce que quelqu\'un, sans jamais le décider consciemment, a verrouillé les réserves.** Ce qui prédit vraiment un renouement réussi avec une ex est étroit et précis — des raisons réelles et examinées pour lesquelles la relation a pris fin, devenues aujourd\'hui vraiment différentes — une catégorie bien plus restreinte que « je pense encore à elle ».',
});

// ---------- The Confession ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-confession', 0, 0)]:
    'Le vol du retour, détaillé comme la chambre détaille tout désormais : la carte d\'embarquement, la place côté hublot, les répétitions d\'une phrase que tu n\'as pas encore dite.',
  [roomBeatKey('the-confession', 0, 1)]:
    'Les adjectifs s\'alignent d\'eux-mêmes, sans y être invités : une fois. Ivre. En déplacement. Sans importance. Chacun vrai, et aucun d\'eux, ensemble, ne couvre vraiment ce qui s\'est passé à la conférence.',
  [roomBeatKey('the-confession', 0, 2)]:
    'Jules aux arrivées — sans méfiance, heureux de te voir, une joie tout à fait ordinaire que la chambre laisse atterrir à plein poids, exprès, parce qu\'elle va rendre tout ce qui suit plus difficile.',
  [roomBeatKey('the-confession', 0, 3)]:
    'La pierre : où elle se loge vraiment (juste sous le sternum), ce qu\'elle pèse précisément à trois heures du matin (plus qu\'à toute autre heure).',
  [roomBeatKey('the-confession', 0, 4)]:
    'Les deux arguments, présentés dans toute leur force, aucun des deux écarté : la confession comme droit de Jules à la vérité sur sa propre vie, contre la confession comme ton propre soulagement, transféré sur quelqu\'un qui n\'a pas demandé ce poids.',
  [roomBeatKey('the-confession', 0, 5)]:
    'Le Portier : Les clients demandent quel choix est honnête. La réception n\'a jamais su répondre qu\'à cette question : lequel pèse le plus, et pour qui.',
  [roomChoiceTextKey('the-confession', 'confess')]: 'Dis tout à Jules, maintenant, en entier.',
  [roomChoiceHintKey('the-confession', 'confess')]: 'Poser toute la pierre d\'un coup',
  [roomChoiceOutcomeKey('the-confession', 'confess', 0)]:
    'La conversation, en gros plan : un raz-de-marée, une heure de questions sans bonnes réponses, tous les deux sur le canapé jusqu\'à ce que le ciel change de couleur.',
  [roomChoiceOutcomeKey('the-confession', 'confess', 1)]:
    'Pas de verdict sur la relation — ça, c\'est la météo d\'un autre étage. La pierre passe de ta poitrine à l\'espace entre vous deux, ce qui est à la fois mieux et, ce soir, pas mieux du tout.',
  [roomChoiceTextKey('the-confession', 'carry-it')]: 'Ne jamais le dire. Le porter seul, pour toujours.',
  [roomChoiceHintKey('the-confession', 'carry-it')]: 'Prendre le poids pour que personne d\'autre n\'ait à le faire',
  [roomChoiceOutcomeKey('the-confession', 'carry-it', 0)]:
    'Le meilleur argument que ce jeu formule en faveur du silence : épargner à Jules une douleur qui ne servirait que ta propre conscience, pas le bien-être de Jules.',
  [roomChoiceOutcomeKey('the-confession', 'carry-it', 1)]:
    'Son coût sur toute une vie, rendu avec honnêteté : une pièce en toi à côté de laquelle Jules vivra pendant des années sans jamais y être admis.',
  [roomChoiceTextKey('the-confession', 'trickle')]: 'Confesse une version adoucie.',
  [roomChoiceHintKey('the-confession', 'trickle')]: 'Donner à Jules une partie de la vérité',
  [roomChoiceOutcomeKey('the-confession', 'trickle', 0)]:
    'Le compte-gouttes commence ce soir, et la chambre te montre exactement où il mène : trois révisions futures, chacune coûtant plus cher que ce que la vérité entière aurait coûté, d\'un coup, ce soir.',
  [roomChoiceTextKey('the-confession', 'let-it-surface')]: '« Ça finira bien par sortir » — autrement dit : jamais, autrement dit : au pire moment possible.',
  [roomChoiceHintKey('the-confession', 'let-it-surface')]: 'Confier la décision au hasard',
  [roomChoiceOutcomeKey('the-confession', 'let-it-surface', 0)]:
    'La chambre nomme la stratégie honnêtement, à voix haute : c\'est sous-traiter la décision au hasard, pour que tout ce qui arrive ressemble à la météo plutôt qu\'à une décision que tu as prise.',
  [roomChoiceOutcomeKey('the-confession', 'let-it-surface', 1)]:
    'Quelque part plus bas sur cet étage, un téléphone qui s\'allume au mauvais moment pourrait bien s\'avérer être le tien.',
  [roomExplanationKey('the-confession', 0)]:
    'Le débat sur l\'opportunité d\'avouer une liaison reste réellement irrésolu chez les chercheurs et les cliniciens, et les arguments les plus forts des deux côtés méritent d\'être entendus dans toute leur force : la révélation comme respect du droit d\'un ou d\'une partenaire à la vérité sur laquelle sa propre vie repose réellement, contre la confession comme culpabilité transférée sur quelqu\'un qui n\'a jamais demandé à la porter. Les enquêtes auprès des partenaires trahis penchent vers le désir de savoir, mais le résultat est fragile, auto-sélectionné, et ne doit pas être traité comme un verdict. Ce qui est bien établi, c\'est l\'observation d\'Esther Perel selon laquelle celui ou celle qui détient le secret détient une forme de pouvoir sur la relation auquel l\'autre personne n\'a jamais consenti.',
  [roomNoteTitleKey('the-confession')]: 'À qui profite le soulagement',
  [roomNoteThinkersKey('the-confession')]: 'le débat sur la confession égoïste · Esther Perel (2017)',
  [roomNoteBodyKey('the-confession')]:
    'Les deux courants méritent ici une écoute honnête. L\'un, issu de la recherche et de l\'opinion clinique, soutient que les partenaires ont droit à la vérité de la vie qu\'ils vivent réellement, point final — que la leur cacher, même avec les meilleures intentions, est une décision prise sur quelqu\'un sans son consentement. L\'autre soutient que la confession peut fonctionner comme un transfert de culpabilité : un soulagement pour la personne qui avoue, acheté au prix de la douleur de quelqu\'un qui n\'a rien fait pour mériter cette transaction. Le cadrage de Perel tranche les deux : **« celui qui détient le secret détient le pouvoir » — et ce déséquilibre de pouvoir existe, que le secret soit un jour prononcé à voix haute ou non.** Ce jeu ne tranche pas le débat, et le dit en toutes lettres : la pierre est réelle dans les deux cas. Le seul vrai choix, c\'est la poche.',
});

// ---------- The Other Side of the Door ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-other-side-of-the-door', 0, 0)]:
    'Viktor est marié. Tu le savais dès le troisième café, et tu es quand même resté pour le quatrième. Cela fait maintenant huit mois : des après-midi d\'hôtel, en semaine seulement, son téléphone toujours écran contre la table de nuit.',
  [roomBeatKey('the-other-side-of-the-door', 0, 1)]:
    'L\'après-midi lui-même, franc et chaleureux — la chambre ne prétend pas que c\'est creux ou purement transactionnel. Quoi que ce soit d\'autre, c\'est aussi réel, pour vous deux, dans la chambre où ça se passe.',
  [roomBeatKey('the-other-side-of-the-door', 0, 2)]:
    'Les règles que tu as apprises sans jamais qu\'on te les enseigne : ne jamais appeler après six heures. Aucun parfum qui persiste au-delà de l\'ascenseur. Tout un programme non écrit, absorbé en le vivant.',
  [roomBeatKey('the-other-side-of-the-door', 0, 3)]:
    '« Je n\'ai fait aucun serment », dis-tu, et la chambre te demande d\'examiner vraiment cette phrase plutôt que de la simplement répéter — elle est vraie, et elle n\'a jamais, à elle seule, réglé quoi que ce soit.',
  [roomBeatKey('the-other-side-of-the-door', 0, 4)]:
    'Le mur. Sa voix, à travers — elle commande au service d\'étage, rit de quelque chose à la télévision. Jamais vue. Constamment audible. La chambre tient l\'instant un souffle de plus que ce qui est confortable.',
  [roomBeatKey('the-other-side-of-the-door', 0, 5)]: 'Le Portier : La réception enregistre trois clients pour cette chambre. Elle n\'a jamais de clés que pour deux.',
  [roomChoiceTextKey('the-other-side-of-the-door', 'continue')]: 'Garde les après-midi. Garde la phrase.',
  [roomChoiceHintKey('the-other-side-of-the-door', 'continue')]: 'Laisser cela devenir une part de ta vie, en silence',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'continue', 0)]:
    'Honnêteté en accéléré : les saisons passent en quatre instants, l\'arrangement se calcifiant, sans qu\'on le remarque, en véritable architecture de ta vie.',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'continue', 1)]:
    'La dernière image de la chambre : ton propre téléphone, lui aussi écran contre la table maintenant, par habitude, alors que — tu le remarques, comme de loin — personne ne regarde vraiment.',
  [roomChoiceTextKey('the-other-side-of-the-door', 'end-it')]: 'Mets-y fin, sans lui demander de choisir.',
  [roomChoiceHintKey('the-other-side-of-the-door', 'end-it')]: 'Partir proprement, selon tes propres conditions',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'end-it', 0)]:
    'Une fin dont personne n\'est témoin et pour laquelle personne ne te remerciera — un deuil sans reconnaissance, nommé clairement par la chambre parce que personne d\'autre n\'est là pour le nommer.',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'end-it', 1)]: 'La sortie la plus nette que propose cet étage. Pourtant, notablement, pas nette du tout.',
  [roomChoiceTextKey('the-other-side-of-the-door', 'tell-her')]: 'Dis-le à sa femme.',
  [roomChoiceHintKey('the-other-side-of-the-door', 'tell-her')]: 'Lui donner le choix que tu lui as gardé caché',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'tell-her', 0)]: 'La détonation, rendue avec une ambivalence honnête : elle méritait la vérité, sans ambiguïté.',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'tell-her', 1)]:
    'La vérité arrive aussi sous la forme d\'une arme, et elle porte tes empreintes. La chambre refuse d\'évaluer ton motif à ta place — elle te demande seulement, une fois, doucement, ce qu\'il était vraiment.',
  [roomChoiceTextKey('the-other-side-of-the-door', 'demand-choice')]: '« Elle ou moi. D\'ici vendredi. »',
  [roomChoiceHintKey('the-other-side-of-the-door', 'demand-choice')]: 'Forcer la décision qui n\'a jamais été la tienne à forcer',
  [roomChoiceOutcomeKey('the-other-side-of-the-door', 'demand-choice', 1)]:
    'Cela t\'enseigne la même leçon quelle que soit la réponse : ce que tu représentais pour lui a toujours, au fond, dépendu de lui seul.',
  [roomExplanationKey('the-other-side-of-the-door', 0)]:
    'La carte éthique honnête, ici, comporte plusieurs lignes distinctes, et la chambre te demande de les tenir toutes en tête à la fois : les serments engagent la personne qui les a prononcés, pas celle qui ne l\'a pas fait — mais permettre sciemment la tromperie de quelqu\'un d\'autre est un poste à part, pas automatiquement excusé par le premier fait. Les recherches sur le « braconnage de partenaire » étudient exactement ce triangle et trouvent que des coûts réels retombent aussi sur la troisième personne — l\'isolement du secret, des fins sans deuil public, personne à appeler. Pouvoir et information sont rarement égaux dans ces arrangements : une personne risque en général un mariage ; l\'autre risque en général quelque chose de moins visible et, selon les recherches, pas moins réel.',
  [roomNoteTitleKey('the-other-side-of-the-door')]: 'Le grand livre de la troisième personne',
  [roomNoteThinkersKey('the-other-side-of-the-door')]: 'recherches sur le braconnage de partenaire · deuil sans reconnaissance',
  [roomNoteBodyKey('the-other-side-of-the-door')]:
    'Les recherches sur le braconnage de partenaire étudient de plus en plus l\'expérience du « braconneur » lui-même, pas seulement celle du couple, et les résultats compliquent tout récit simple de méchant : du temps réellement investi, un isolement réel dû au secret, et des fins sans reconnaissance publique pour en faire le deuil — un schéma que les chercheurs appellent le deuil sans reconnaissance, une perte que personne n\'a le droit de reconnaître parce que la relation elle-même n\'a jamais eu le droit d\'être reconnue. **La responsabilité, ici, n\'est pas une affaire de tout ou rien.** Les serments engagent celui ou celle qui les a prononcés. Participer sciemment à leur rupture est un choix distinct, réel, avec son propre poids. Le mur est mince. Cela n\'a jamais été un secret, pour personne des deux côtés.',
});

// ---------- The Scoreboard (gate) ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-scoreboard', 0, 0)]:
    'Tu as demandé le nombre à Jules. Jules a dit la vérité. Maintenant le nombre habite ta poitrine et fait des calculs la nuit : des noms qu\'il ne connaît pas, des chambres d\'hôtel qu\'il se meuble lui-même, des comparaisons qu\'il met en scène sans qu\'on les lui demande.',
});
register(roomBeatKey('the-scoreboard', 0, 1), 'v2', 'fr', (s: RunState) =>
  s.flags.includes('tested-almost') || s.flags.includes('ran-the-test')
    ? 'Le schéma des pensées intrusives, tu le connais désormais — la chambre le reconnaît aussi et le dit : c\'est la même arithmétique qui t\'a déjà tenu éveillé une fois, avec un autre nombre pour habit.'
    : 'L\'intrusion arrive selon un horaire que tu n\'as jamais fixé : un nom, une supposition, une scène que ton esprit construit sans y être invité et te force ensuite à regarder.',
);
register(roomChoiceOutcomeKey('the-other-side-of-the-door', 'demand-choice', 0), 'v2', 'fr', (s: RunState) =>
  seedSplit(s)
    ? 'Vendredi arrive. Viktor te choisit — et la chambre te laisse sentir, en temps réel, ce que cette décision révèle exactement sur un homme capable de classer deux vies aussi facilement.'
    : 'Vendredi arrive. Viktor ne te choisit pas — et la chambre te laisse sentir, en temps réel, ce que cette décision révèle exactement sur un homme capable de classer deux vies aussi facilement.',
);
registerAll('v2', 'fr', {
  [roomBeatKey('the-scoreboard', 0, 2)]:
    'Le hall se réorganise, les chaises deviennent des rangées, la réception devient un banc — une audience est convoquée. Le Portier prend la lampe du bureau en main comme un marteau de juge qui n\'en a jamais vraiment été un.',
  [roomBeatKey('the-scoreboard', 0, 3)]:
    'L\'accusé, versé au dossier : tout ce que Jules a fait, avec qui que ce soit, avant même que vous deux ne vous rencontriez.',
  [roomBeatKey('the-scoreboard', 0, 4)]:
    'Ton propre nombre, assermenté comme témoin contre l\'accusé, sans jamais qu\'on lui demande s\'il voulait vraiment témoigner.',
  [roomBeatKey('the-scoreboard', 0, 5)]:
    'Le Portier : La cour note que l\'accusé précède la plaignante. La cour l\'a noté à chaque session qu\'elle a jamais tenue.',
  [roomChoiceTextKey('the-scoreboard', 'prosecute')]: 'Contre-interroge le passé : dates, contextes, détails.',
  [roomChoiceHintKey('the-scoreboard', 'prosecute')]: 'Exiger le récit complet, encore',
  [roomChoiceOutcomeKey('the-scoreboard', 'prosecute', 0)]: 'Chaque question reçoit une réponse. Chaque réponse coûte exactement une nuit de sommeil.',
  [roomChoiceOutcomeKey('the-scoreboard', 'prosecute', 1)]:
    'Le verdict, quand il arrive, acquitte — le passé n\'a commis aucun crime — et les frais de la poursuite sont, notablement, non remboursables. Jules a regardé, du début à la fin, à quel point tu en avais besoin.',
  [roomChoiceTextKey('the-scoreboard', 'dismiss-with-prejudice')]: 'Classe l\'affaire. Et pense-le vraiment.',
  [roomChoiceHintKey('the-scoreboard', 'dismiss-with-prejudice')]: 'Laisser le nombre cesser d\'être une pièce à conviction',
  [roomChoiceOutcomeKey('the-scoreboard', 'dismiss-with-prejudice', 0)]:
    'Pas une suppression — un classement avec les motifs lus à voix haute : la personne à qui appartient le nombre n\'existe plus ; celle qui existe t\'a choisi.',
  [roomChoiceOutcomeKey('the-scoreboard', 'dismiss-with-prejudice', 1)]:
    'Les intrusions ne s\'arrêtent pas sur commande, et la chambre est honnête là-dessus. Elles cessent, peu à peu, d\'être convoquées.',
  [roomChoiceTextKey('the-scoreboard', 'testify-against-yourself')]: 'Monte toi-même à la barre pour ton propre double standard.',
  [roomChoiceHintKey('the-scoreboard', 'testify-against-yourself')]: 'Verser aussi ton propre nombre au dossier',
  [roomChoiceOutcomeKey('the-scoreboard', 'testify-against-yourself', 0)]:
    'Le geste le plus courageux de toute l\'audience : ton nombre et celui de Jules, lus côte à côte, dans la même pièce, au même volume.',
  [roomChoiceOutcomeKey('the-scoreboard', 'testify-against-yourself', 1)]:
    'L\'asymétrie du ressenti — le fait que le nombre de Jules te trouble plus que le tien ne te trouble toi-même — est nommée exactement pour ce qu\'elle est. La cour s\'ajourne sans verdict, parce que l\'affaire n\'a jamais vraiment porté sur l\'accusé.',
  [roomChoiceTextKey('the-scoreboard', 'ask-what-verdict-frees')]: 'Demande à la cour quel verdict te libérerait vraiment.',
  [roomChoiceHintKey('the-scoreboard', 'ask-what-verdict-frees')]: 'Poser la question la plus difficile',
  [roomChoiceOutcomeKey('the-scoreboard', 'ask-what-verdict-frees', 0)]:
    'Silence. Puis le Portier, doucement : « Aucun. Il n\'existe aucun nombre, dans un sens ou dans l\'autre, qui ait jamais acquitté un client de sa propre imagination. »',
  [roomChoiceOutcomeKey('the-scoreboard', 'ask-what-verdict-frees', 1)]: 'Dit à voix haute, cela dénoue quelque chose. La salle d\'audience redevient un hall, les chaises de retour à leur place.',
  [roomExplanationKey('the-scoreboard', 0)]:
    'La jalousie rétroactive — la détresse liée au passé d\'un ou d\'une partenaire plutôt qu\'à son comportement présent — est un schéma reconnu, et dans sa forme la plus sévère elle présente des traits qui recoupent cliniquement le trouble obsessionnel-compulsif : recherche de réassurance, fouille de détails, et compulsions mentales qui apaisent l\'angoisse pendant quelques minutes et la reconstituent d\'ici le soir. Les recherches sur le double standard sexuel le trouvent à l\'œuvre en silence même chez des personnes qui le rejetteraient comme croyance déclarée — le même fait enregistré différemment selon à qui appartient le passé en question. Ce que la littérature de traitement trouve réellement utile n\'est pas davantage d\'information ; la recherche de certitude est le carburant du schéma, et les approches fondées sur l\'acceptation surpassent largement la réassurance.',
  [roomNoteTitleKey('the-scoreboard')]: 'La cour sans acquittements',
  [roomNoteThinkersKey('the-scoreboard')]: 'recherches sur la jalousie rétroactive · le double standard sexuel',
  [roomNoteBodyKey('the-scoreboard')]:
    'Dans sa forme la plus sévère, la jalousie rétroactive présente des traits que les cliniciens reconnaissent généralement dans les tableaux de type obsessionnel-compulsif : des images intrusives, une recherche compulsive de réassurance, et un soulagement qui ne dure jamais tout à fait jusqu\'à la prochaine intrusion. **La recherche de certitude est la nourriture du schéma, pas son remède — chaque question à laquelle on répond reconstitue la faim pour la suivante.** Le double standard sexuel apparaît dans les données même chez des personnes qui le rejetteraient comme valeur déclarée : le même fait, classé différemment selon à qui appartient le passé en question. Ce qui aide réellement, selon la littérature de traitement, c\'est un travail fondé sur l\'acceptation plutôt que davantage de données — apprendre à tenir le non-savoir plutôt que d\'essayer de l\'interroger jusqu\'à sa disparition. Chaque client qui entre dans cette salle d\'audience arrive certain que son cas est l\'exception. Le registre, jusqu\'ici, dit le contraire.',
});
