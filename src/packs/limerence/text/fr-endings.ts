// French translation of LIMERENCE's 7 endings (title, epitaph, beats, field
// notes). Registered under version 'v2'. Mirrors the structure of
// text/de-endings.ts / text/cs-endings.ts / text/fa-endings.ts — see those
// files and CLAUDE.md's "Translating content" rule: every line here is
// translated for meaning-in-context, not word-for-word, and rechecked
// against the English beats it sits next to. Ending ids are pack-local
// ('the-morning-after' etc.) and never collide with ANAMNESIS's own
// ('return', 'open-hand', ...), so endingTitleKey/endingBeatKey/etc need no
// pack-id scoping here (see engine/text/keys.ts).
//
// Register: informal "tu" throughout, matching every prior French file in
// this pack (fr-rooms.ts through fr-rooms-understory.ts). "The Porter" =
// "Le Portier", deliberately distinct from ANAMNESIS's own French word for
// its theater-usher guide character (registered in src/content/text/fr.ts
// — that word is never spelled out here, per this pack's convention; grep
// for it in this file returns zero matches). "Trust" = "confiance"/"un
// cœur" (the room-content French files
// use "cœur" for the mechanical Trust unit — kept consistent here in the
// one place a beat references the ledger mechanic directly).
//
// Judgment call on 'the-porter': this ending id coincidentally shares a
// name with the Porter character, but its actual beats (0-5) describe the
// player literally becoming the hotel's next keeper — the handover,
// learning the wing's temperaments, inheriting the first lesson ("the ring
// and the pale stripe are the same size"). So the title is translated the
// same way the character's own title is translated throughout this pack
// ("Le Portier"), following the Czech/Farsi/German precedent, because
// that's what the beats describe the player becoming — not a mechanical
// rename or coincidence to gloss over.
//
// Gender neutrality: ending titles are archetype/badge labels shown on an
// end screen (comparable to a tarot-card name), not a pronoun addressing
// the player, so French's grammatical-gender pull is handled the same way
// fr-rooms-act3.ts's header documents for Dana/Jules — nominalized or
// epicene noun forms where French offers one ("Le Fantôme", "Le Miroir",
// "Le Schéma" are all already epicene or masculine-as-label-form, no
// rewrite needed), and within the beats themselves, second person stays
// "tu" (grammatically ungendered in the present tense; past-tense
// agreement is avoided the same way fr-rooms.ts's header describes —
// preferring présent/avoir-based constructions over passé composé
// agreement wherever the English doesn't force a completed action). The
// one place a third party's role needed a gender-neutral noun
// (the-mirror's "the tempted and the betrayed... the friend who knew and
// said nothing") uses epicene nouns and "qui"-relative clauses ("la
// personne tentée", "qui savait et s'est tue" rephrased around "qui")
// rather than a gendered participle.
import { registerAll } from '../../../engine/text/resolver';
import {
  endingBeatKey,
  endingEpitaphKey,
  endingNoteBodyKey,
  endingNoteThinkersKey,
  endingNoteTitleKey,
  endingTitleKey,
} from '../../../engine/text/keys';

// ---------- Ending: The Morning After ----------
registerAll('v2', 'fr', {
  [endingTitleKey('the-morning-after')]: 'Le Lendemain',
  [endingEpitaphKey('the-morning-after')]: 'La conversation était toujours là. Toi aussi, enfin.',
  [endingBeatKey('the-morning-after', 0)]:
    'Tu franchis les portes du hall, et le seuil fait la seule chose qu’aucune chambre à l’étage n’a jamais su faire : il finit.',
  [endingBeatKey('the-morning-after', 1)]:
    'La circulation du matin, ordinaire et démesurée. Une vraie cuisine, quelque part. La personne que tu as quittée en pleine phrase, toujours en pleine phrase, comme si tu n’étais sorti·e que le temps de franchir une porte, et non une nuit entière.',
  [endingBeatKey('the-morning-after', 2)]:
    'Rien n’est résolu. Le monde ne s’est pas amélioré pour toi. Les disputes ont gardé ta place au chaud, patiemment, comme le font toujours les disputes.',
  [endingBeatKey('the-morning-after', 3)]:
    'Mais dans les semaines qui suivent, tu te surprends à poser des questions dont tu ne connais pas déjà la réponse — à voix haute, à la personne assise en face de toi, au lieu de les passer d’abord en silence dans ta tête.',
  [endingBeatKey('the-morning-after', 4)]:
    'Tu vas perdre presque tout cela : les couloirs, la patience exacte du Portier, le poids particulier de chaque porte jamais ouverte. Ça s’efface comme s’effacent les rêves, laissant derrière soi un climat plutôt qu’un souvenir.',
  [endingBeatKey('the-morning-after', 5)]:
    'Le chemin du retour, en fin de compte, n’a jamais été une route, {name}. La relation n’a jamais été la promesse. Toi, tu étais la rénovation.',
  [endingNoteTitleKey('the-morning-after')]: 'Sur le retour',
  [endingNoteThinkersKey('the-morning-after')]: 'le motif de la descente qui revient, version amoureuse',
  [endingNoteBodyKey('the-morning-after')]:
    'Toute tradition de sagesse possède une version de cette même forme : la descente ne compte qu’à hauteur de la remontée qui la suit, une remontée qui rapporte quelque chose que la surface seule n’aurait jamais pu produire. Appliqué à une relation plutôt qu’à une âme, le motif tient avec une précision troublante — traverser une crise ne change rien en soi ; ce qui compte, c’est de savoir si les personnes qui en reviennent sont réellement différentes, ou simplement rassises à leur ancienne place, à leur ancienne table. **Le danger de cet hôtel n’a jamais été l’Intervalle lui-même. C’était d’en repartir inchangé·e.** Revenir ordinaire, mais recomposé·e : voilà ce qu’il fallait accomplir depuis le début.',
});

// ---------- Ending: The Giver ----------
registerAll('v2', 'fr', {
  [endingTitleKey('the-giver')]: 'Celle ou Celui Qui Donne',
  [endingEpitaphKey('the-giver')]: 'La personne sûre de tout le monde. Pièce après pièce. Presque toujours de bon cœur.',
  [endingBeatKey('the-giver', 0)]:
    'Tu franchis le seuil, et le monde t’accueille comme l’eau accueille — aucune couture, aucun éclaboussement.',
  [endingBeatKey('the-giver', 1)]:
    'Tu te réveilles poreux·se. C’est le seul mot qui convienne. La crise de deux heures du matin de chaque ami·e te trouve désormais en premier, comme l’eau trouve toujours le point le plus bas d’une pièce.',
  [endingBeatKey('the-giver', 2)]:
    'Tu deviens la personne auprès de qui les autres se recomposent. C’est, sincèrement, une belle vie, mesurée aux meilleurs matins des autres — un compte tenu dans une monnaie que tu as arrêté de compter quelque part vers l’Acte II.',
  [endingBeatKey('the-giver', 3)]:
    'Tu donnes librement, et presque toujours de bon cœur, et ce don n’est pas un numéro — la pièce y veille avec attention. Ça te coûte des choses bien réelles, et la plupart des jours, tu les paies sans rancune.',
  [endingBeatKey('the-giver', 4)]:
    'Ce n’est que parfois — tard, dans les heures honnêtes — que tu remarques ce qu’une main ouverte ne sait pas faire : se refermer. Savoir si c’était le prix ou la récompense est une question que tu laisses, chaque soir, délibérément sans réponse sur la table.',
  [endingBeatKey('the-giver', 5)]:
    'Le Portier, s’il pouvait te voir — et certains soirs, qui sait — dirait : celui-là ou celle-là, on l’a renvoyé·e plus léger·ère. On a peut-être retiré un peu plus d’emballage que ce que la réception recommande, à strictement parler.',
  [endingNoteTitleKey('the-giver')]: 'Sur le soin sans limites',
  [endingNoteThinkersKey('the-giver')]: 'la recherche sur la codépendance · le constat de la limite comme mur porteur',
  [endingNoteBodyKey('the-giver')]:
    'La recherche clinique sur la codépendance a dépassé son cadre moralisateur des débuts pour quelque chose de plus précis : un schéma réel, coûteux, dans lequel le bien-être d’une personne devient structurellement dépendant du fait d’être utile aux autres — et les limites, loin d’être un signe d’égoïsme, fonctionnent comme le mur porteur qui empêche toute la structure de finir par s’effondrer sous le poids de sa propre générosité. **Une main ouverte qui ne peut jamais se refermer ne peut soutenir son propre poids indéfiniment, encore moins celui de quelqu’un d’autre.** Les pièces ont récompensé ton ouverture. Le monde le fera aussi, sans malice — et il te présentera la facture, tôt ou tard.',
});

// ---------- Ending: The Armored ----------
registerAll('v2', 'fr', {
  [endingTitleKey('the-armored')]: 'Le Blindé',
  [endingEpitaphKey('the-armored')]: 'Rien n’est entré. C’était le plan. Rien n’est entré.',
  [endingBeatKey('the-armored', 0)]: 'Tu franchis le seuil vers une vie qui tourne, de l’extérieur, exactement comme elle est censée tourner.',
  [endingBeatKey('the-armored', 1)]:
    'La compétence. Une promotion, éventuellement, puis une autre. On te décrit comme « solide », comme « qui a les pieds sur terre » — jamais tout à fait comme « chaleureux·se », même s’il te faut des années pour remarquer ce schéma dans le choix des mots.',
  [endingBeatKey('the-armored', 2)]:
    'Les murs montés quelque part dans l’aile des longs séjours tiennent. Ils tiennent très bien. Rien n’entre, ce qui était, après tout, le plan.',
  [endingBeatKey('the-armored', 3)]:
    'Des années plus tard, une fenêtre, sans rien de remarquable, un soir sans rien de remarquable — et la pensée se termine toute seule avant que tu ne puisses l’arrêter : tout reste dehors. Le mauvais temps, les loups, et le courrier, et les visiteurs.',
  [endingBeatKey('the-armored', 4)]:
    'Le Portier, dans le dossier qu’on finit par renvoyer à ton nom, écrit un seul mot : « En sécurité. »',
  [endingBeatKey('the-armored', 5)]:
    'Dans la marge, en dessous, d’une écriture qui pourrait être la sienne et qui, à ce stade, pourrait tout aussi bien être la tienne : en sécurité contre quoi, ce n’a jamais été précisé.',
  [endingNoteTitleKey('the-armored')]: 'Sur l’armure',
  [endingNoteThinkersKey('the-armored')]: 'l’adaptation évitante, honnêtement chiffrée',
  [endingNoteBodyKey('the-armored')]:
    'Les stratégies d’attachement évitant sont adaptatives — elles fonctionnent, de manière fiable, précisément pour la tâche à laquelle elles sont destinées : réduire la douleur d’avoir besoin de quelqu’un qui pourrait ne pas être là. Le coût réel, documenté dans toute la littérature, n’est pas la faiblesse mais le rétrécissement : un soi organisé pour ne pas être blessé s’organise tout aussi fiablement pour ne pas être atteint, étonné, ou surpris par la présence de qui que ce soit d’autre. **Un soi que rien ne peut blesser est aussi un soi que rien ne peut étonner.** Cette fin n’est pas écrite comme un échec — la compétence et la sécurité sont de vrais biens — seulement comme un bilan honnête de ce que coûte le port indéfini de l’armure.',
});

// ---------- Ending: The Ghost ----------
registerAll('v2', 'fr', {
  [endingTitleKey('the-ghost')]: 'Le Fantôme',
  [endingEpitaphKey('the-ghost')]: 'Tu as continué à venir. Tu as arrêté d’arriver.',
  [endingBeatKey('the-ghost', 0)]:
    'Il n’y a pas de sortie spectaculaire ici, parce qu’il n’y en a pas eu. Tu arrêtes simplement de la porter, à un moment trop progressif pour être daté précisément.',
  [endingBeatKey('the-ghost', 1)]:
    'Tu continues à venir — dîners, anniversaires, le mobilier ordinaire de la présence — pendant un moment encore, après être déjà parti·e, dans tous les sens qui comptent.',
  [endingBeatKey('the-ghost', 2)]:
    'Le Portier tient parole : aucun invité ne se dissout seul pendant son service. Cette fois, il s’assoit avec toi, sans dire grand-chose, et cela se révèle être exactement la juste mesure.',
  [endingBeatKey('the-ghost', 3)]:
    'Ce que tu arrêtes de porter n’est pas perdu pour autant. Quelqu’un d’autre le ramasse, finalement, comme les choses laissées sur une table finissent toujours par être ramassées par qui que ce soit qui se trouve encore debout.',
  [endingBeatKey('the-ghost', 4)]:
    'Ceci n’est pas un écran d’échec. L’hôtel y veille avec attention, et à sa façon, cette fin aussi : certaines choses finissent lentement, et la lenteur reste une fin, pas une faute.',
  [endingBeatKey('the-ghost', 5)]:
    'La marée monte, que tu aies ou non jamais été comptée parmi les coquillages qu’elle a repris avec elle.',
  [endingNoteTitleKey('the-ghost')]: 'Sur le silence qui s’installe',
  [endingNoteThinkersKey('the-ghost')]: 'le retrait émotionnel et la dissociation dans les relations',
  [endingNoteBodyKey('the-ghost')]:
    'Le retrait émotionnel — la sortie lente qui ne s’annonce jamais comme telle — est une réponse protectrice bien documentée, non une faute morale : un système nerveux qui a appris que la proximité comporte un risque se met, tranquillement et raisonnablement, à réduire la distance à ce risque plutôt que la distance à la personne. **L’engourdissement est une protection à bail, pas une adresse permanente — même s’il peut sembler permanent de l’intérieur.** Écrite ici comme une fin, délibérément, et jamais comme un verdict sur la personne qui y arrive — la marée n’est pas une punition. C’est simplement ce que fait l’eau, avec assez de temps et assez de poids à porter.',
});

// ---------- Ending: The Porter ----------
registerAll('v2', 'fr', {
  [endingTitleKey('the-porter')]: 'Le Portier',
  [endingEpitaphKey('the-porter')]: 'Les chambres ont toujours besoin d’un gardien. Le gardien a toujours eu besoin des chambres.',
  [endingBeatKey('the-porter', 0)]:
    'La passation se fait tranquillement, sur ce qui ressemble à une seule longue nuit et se révèle avoir été considérablement plus long.',
  [endingBeatKey('the-porter', 1)]:
    'Tu apprends les humeurs de l’aile — quelles portes coincent par temps froid, quels étages sont plus froids que ne l’admet le thermostat, quels invités ont besoin de silence et lesquels ont besoin que la lampe de bureau reste allumée.',
  [endingBeatKey('the-porter', 2)]:
    'La discipline, une fois qu’on la comprend, est simple à énoncer et difficile à pratiquer : tu peux éclairer le couloir. Tu ne dois jamais nommer la porte. Chaque invité doit trouver seul son propre chemin vers ce qui se trouve derrière.',
  [endingBeatKey('the-porter', 3)]:
    'Des siècles d’entre eux passent, ou ce qui y ressemble — chacun certain que sa capture d’écran, son couloir, sa table de cuisine sont les premiers du genre. Aucun d’eux n’a tort de le ressentir ainsi. Aucun d’eux n’a raison non plus.',
  [endingBeatKey('the-porter', 4)]:
    'Un jour, un invité se détourne de la lumière du matin avec une expression particulière — la reconnaissance, celle que tu te rappelles de l’intérieur, d’une nuit qui te semble maintenant impossiblement lointaine.',
  [endingBeatKey('the-porter', 5)]:
    'Tu dis la première leçon, celle qu’on t’a dite autrefois : « L’anneau et la marque pâle font exactement la même taille. C’est voulu. Ici, tout est voulu. »',
  [endingNoteTitleKey('the-porter')]: 'Sur le fait de veiller',
  [endingNoteThinkersKey('the-porter')]: 'l’archétype du guérisseur blessé',
  [endingNoteBodyKey('the-porter')]:
    'L’archétype du guérisseur blessé — Chiron dans le mythe, et depuis un schéma réel et documenté dans les métiers de l’aide — soutient que la capacité à guider quelqu’un à travers une crise se forge souvent en ayant survécu à une crise comparable, non pas malgré la blessure mais grâce à l’attention particulière qu’elle enseigne. La recherche clinique sur le soutien par les pairs et les rôles fondés sur l’expérience vécue trouve une valeur réelle et mesurable à ce type de soin précis — une valeur que la seule formation ne produit pas de manière fiable. **Cultiver le coin du monde qu’est un couloir n’est pas une vocation moindre qu’aucune des chambres qui en partent.** Le gardien avait besoin des chambres exactement autant que les chambres ont jamais eu besoin d’un gardien.',
});

// ---------- Ending: The Mirror ----------
registerAll('v2', 'fr', {
  [endingTitleKey('the-mirror')]: 'Le Miroir',
  [endingEpitaphKey('the-mirror')]: 'Les deux chaises. Chaque chambre. Elle est bonne, non ?',
  [endingBeatKey('the-mirror', 0)]:
    'La petite porte s’ouvre sur un salon privé, deux tasses déjà servies, et pas la moindre troisième chaise nulle part.',
  [endingBeatKey('the-mirror', 1)]:
    'Le Portier sert. Il ne s’assoit pas tant en face de toi qu’à côté de toi — tu ne le remarques qu’une fois qu’il l’a déjà fait.',
  [endingBeatKey('the-mirror', 2)]:
    'Il retire l’anneau de sa main droite, sans se presser, et là — sur sa main gauche, là où tu t’y attendais déjà, sans trop savoir pourquoi — se trouve la même marque pâle, jamais bronzée, que tu avais remarquée sur lui la première nuit. Sauf que ce n’est pas sa main. C’est la tienne.',
  [endingBeatKey('the-mirror', 3)]:
    'Chaque invité de chaque chambre que tu as traversée avait, en fin de compte, ton propre visage, si tu avais regardé deux fois : la personne tentée et celle trahie, la troisième personne et l’ami·e qui savait et n’a rien dit — les deux narrateurs de chaque dispute dans laquelle tu t’es réellement trouvé·e.',
  [endingBeatKey('the-mirror', 4)]:
    'Tu ris. Ce rire, c’est la reconnaissance elle-même — il n’y avait pas de chute racontée depuis l’extérieur, seulement la blague qui atterrit enfin sur la personne qui se la racontait depuis le début, à elle-même, dans chaque chambre, sans jamais s’en apercevoir.',
  [endingBeatKey('the-mirror', 5)]:
    'Tu te réveilles en riant, et la blague s’évapore comme s’évaporent les blagues au réveil, ne laissant que sa forme : il n’y a jamais eu personne sur l’autre chaise. Il y a toujours eu deux versions de toi, et toutes deux étaient toi.',
  [endingNoteTitleKey('the-mirror')]: 'La plus vieille blague',
  [endingNoteThinkersKey('the-mirror')]: 'la forme ultime de la prise de perspective',
  [endingNoteBodyKey('the-mirror')]:
    'La recherche sur la prise de perspective trouve ici sa forme la plus complète, au-delà du point où c’est encore une compétence qu’on exerce, et plus proche d’une reconnaissance : chaque conflit mis en scène par cet hôtel avait exactement deux narrateurs à la première personne, et tu étais, de manière démontrable, les deux — non pas métaphoriquement, mais structurellement. L’expression sanskrite *tat tvam asi* — « cela, tu l’es » — nomme une vieille intuition, présente dans de nombreuses cultures, sur la porosité de la frontière entre soi et l’autre ; cette chambre l’emprunte une fois, légèrement, comme un simple écho discret plutôt que comme une doctrine. **Les deux chaises. Chaque chambre. Elle est bonne, non — le genre de blague qui n’atterrit vraiment que le jour où tu remarques que tu riais de toi-même depuis le début.**',
});

// ---------- Ending: The Pattern ----------
registerAll('v2', 'fr', {
  [endingTitleKey('the-pattern')]: 'Le Schéma',
  [endingEpitaphKey('the-pattern')]: 'Tu n’as pas quitté l’hôtel. Tu t’es réveillé·e, et le réveil contenait chaque chambre.',
  [endingBeatKey('the-pattern', 0)]:
    'Chaque porte, à chaque étage, s’ouvre en même temps — pas défoncée, pas spectaculaire, simplement ouverte, comme s’ouvre un fait plutôt que comme s’ouvre un événement.',
  [endingBeatKey('the-pattern', 1)]:
    'La lumière du couloir est ordinaire, douce, et pour la première fois de toute la nuit, il n’y a plus rien en elle où se cacher.',
  [endingBeatKey('the-pattern', 2)]:
    'L’accusé de lecture, la capture d’écran, le couloir de la conférence, la table de cuisine à 6h40 — tout cela, tout à la fois, présent comme une vie entière est présente à la personne qui la vit réellement, et non comme une histoire est présente à quelqu’un qui la relit.',
  [endingBeatKey('the-pattern', 3)]:
    'Le Portier, chapeau enfin ôté, dit la chose la plus courte qu’il dise dans tout cet hôtel. « Ah. »',
  [endingBeatKey('the-pattern', 4)]:
    'La reconnaissance n’est pas d’apprendre quelque chose de nouveau. C’est de voir le schéma dans son ensemble — ce qui se révèle être la seule chose qui, dans toute l’histoire de ce bâtiment, en ait jamais réellement changé un.',
  [endingBeatKey('the-pattern', 5)]:
    'Tu te réveilles, et {name} arrive avec le réveil lui-même, pas une demi-seconde après. Le tableau des départs, aperçu une dernière fois en sortant, affiche toutes les heures à la fois.',
  [endingNoteTitleKey('the-pattern')]: 'Le voir dans son ensemble',
  [endingNoteThinkersKey('the-pattern')]: 'la reconnaissance des schémas et le changement · le mécanisme réel de la littérature sur la sécurité acquise',
  [endingNoteBodyKey('the-pattern')]:
    'La prise de conscience seule change rarement le comportement — la littérature clinique s’accorde à dire que savoir qu’un schéma existe est nécessaire, mais jamais suffisant. Ce que la recherche sur la sécurité acquise identifie réellement comme mécanisme de changement se rapproche de ce que cette chambre met directement en scène : non pas un fait nouvellement appris, mais tout le schéma vu d’un coup, tenu assez longtemps et assez clairement pour qu’il cesse de pouvoir opérer dans l’invisible. **Les chambres n’étaient jamais derrière toi. Elles étaient ta forme, éveillée.** C’est, pour une bonne raison, la porte la plus rare de l’hôtel : elle ne demande pas un bon choix de plus, mais la volonté de regarder tout le dossier d’un coup et d’y reconnaître, du début à la fin, ta propre écriture.',
});
