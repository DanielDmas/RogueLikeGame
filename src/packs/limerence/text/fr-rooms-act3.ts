// French translation of LIMERENCE's Act III room prose (beats, choice
// text/hint/outcome, field notes, plain-language explanations). Registered
// under version 'v2'. Follows the structural pattern established by
// fr-rooms.ts (prologue/Act I) and fr-rooms-act2.ts (Act II) — see
// CLAUDE.md's "Translating content" rule: every line here was translated
// against the room's actual beats and each choice's stakes, not
// word-for-word.
//
// tu/vous decision: informal "tu" throughout, continuing fr-rooms.ts's and
// fr-rooms-act2.ts's own choice rather than re-deciding it. Act III's cast is
// adults 25-30 in long-established partnerships — engaged, married,
// cohabiting for years — but the narration is still the identical device
// used in the prologue and Acts I-II: second-person interior address of the
// player-as-character inside their own relationship, not a narrator
// addressing a hotel guest from a respectful remove. A room that puts you in
// a kitchen at 2 a.m. reading a lit-up phone, or a bathrobe conversation
// about a veto invoked on your first real love, is not a room that would
// plausibly address you with formal distance. The Porter keeps his own
// measured, unhurried, adult cadence, but grammatically addresses the player
// as "tu" throughout, exactly as in the prologue and Acts I-II.
//
// "The Porter" remains "Le Portier", per the established project convention
// — distinct from ANAMNESIS's own French word for its theater-usher guide
// character, never reused here (including in this comment); verified absent
// from this file and from fr-reflections-act3.ts.
//
// Field-note thinkers lines: proper-name citations (with years) are carried
// through unchanged, matching earlier passes' convention. Descriptive
// (non-named) thinkers lines are translated — e.g. "CNM veto literature ·
// autonomy research" becomes "littérature sur le veto en CNM · recherches
// sur l'autonomie". Gottman's clinical vocabulary is rendered with the
// standard French couples-therapy terms: "the Four Horsemen" as "les quatre
// cavaliers", "flooding" as "la submersion" (glossed in-line exactly as the
// English does, on first use), "repair attempt" as "tentative de
// réparation", and the four therapist-room door labels as CRITIQUE / MÉPRIS
// / JUSTIFICATION / MUR — the last deliberately reusing "mur", already
// load-bearing in this project's walls-and-windows imagery from Act II's
// "just-friends"/Glass material (see fr-rooms-act2.ts). "Metamour" is kept
// as the established loanword "métamour", already standard in French
// polyamory-community usage; "compersion" is rendered "compersion" (the
// adapted French spelling used in the same community), glossed in-line.
//
// Dana/Sam gender-neutrality: the English source deliberately never genders
// Dana (Act III's recurring partner, "the-colleague" through
// "the-usual-room") or Sam (the-veto's "first person you've loved... in
// years", explicitly "a rule they never had any say in writing"). A small
// number of lines slip to "her"/"hers"/"she" for Dana against the much more
// consistent bare-name/"their" treatment used everywhere else: the-balcony's
// "care" reflection and beat ("what she comes home to"), walk-away's "care"
// reflection ("without her ever having to learn"), the-second-account's
// delete-it "duty" reflection ("she doesn't know exists") and show-dana's
// hint ("let her read it herself"), and a the-therapist "duty" reflection's
// "hers" (defensiveness) — verified directly against
// src/packs/limerence/rooms/act3.ts rather than assumed from the German
// pass's header, which names three of these five spots. Read as authorial
// inconsistency, not a deliberate reveal (the same call the German/Czech
// passes made), and normalized to the neutral treatment throughout in this
// file, matching the character's evident design intent.
//
// This file applies the exact strategy documented in fr-rooms-act2.ts's own
// header for Jules, extended with two French-specific advantages German
// doesn't have:
//   - Bare proper noun doing or receiving the action, with no article or
//     agreement suffix needed ("Dana dit", "dire à Dana", "ce qui
//     appartenait à Dana") — repeated rather than replaced by il/elle
//     wherever English would otherwise need a pronoun.
//   - Direct address ("tu dois à Dana...") is used heavily, since "tu" and
//     "Dana" both sidestep gendered agreement.
//   - French possessive determiners (son/sa/ses) agree with the gender of
//     the *possessed noun*, not the possessor — unlike English "his/her" or
//     German "sein/ihr". "Son téléphone", "sa confiance" reveal nothing
//     about Dana's gender, so these are used freely and don't require the
//     workarounds Jules's file needed as often.
//   - Likewise, French third-person possessive pronouns (le sien / la
//     sienne) agree with the *possessed* noun, not the possessor — "pas une
//     réfutation de la sienne [= sa part]" is fully neutral, unlike English
//     "hers".
//   - The indirect-object pronoun "lui" is identical for both genders in
//     French ("on lui répond"), so it's preferred over a direct-object
//     "la"/"le" wherever the verb allows it.
//   - Predicate adjectives and past participles after être (which do mark
//     gender in French) are routed around via nominal phrasing, active
//     verbs with avoir and no fronted direct object, or invariant adverbs
//     ("froidement" instead of "froid/froide") wherever the English doesn't
//     strictly require the agreement-triggering construction.
//   - Where a relative pronoun, predicate adjective, or past participle is
//     genuinely unavoidable (no rephrasing available without distorting the
//     sentence), this file falls back to a grammatically masculine default,
//     matching the German pass's and fr-rooms-act2.ts's own documented
//     precedent. That fallback is rare by design (one clear instance: the
//     defensiveness reflection's "jamais se sentir vraiment écouté").
// The same strategy applies to Sam throughout the-veto.
//
// Player-character gender neutrality: continuing fr-rooms.ts's own
// established rule (see its header), this file avoids forcing a gendered
// past-participle or predicate-adjective agreement onto the silent, ungoverned
// player behind "tu" — preferring nominal rephrasing ("ta chambre à toi,
// personne d'autre" rather than "tu es seul(e)"), avoir-based constructions
// without a fronted direct object ("tu as déjà quitté cette relation" rather
// than "tu es déjà parti(e)"), and invariant adverbs, wherever the English
// doesn't semantically require a completed/reflexive past tense or a
// predicate adjective.
//
// Dr. Weiss (the-therapist) is never gendered in the English source and
// receives no pronoun here either — every reference is the repeated name
// "le Dr Weiss", or the epicene noun "une personne" (grammatically feminine
// as a word, independent of the referent's actual gender — a standard French
// gender-neutral-writing technique) where a generic third party is needed.
//
// Rowan (the-colleague) and Petra (the-metamour, the-veto) are both
// explicitly gendered female in the English source ("she was standing at
// the same door"; "a dispute that was never actually about her") and take
// ordinary French feminine agreement throughout ("elle", "la même dignité"),
// consistent with Sara/Mira/Alena's treatment in Acts I-II.
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
import { pickShadowMoments } from '../../../engine/gameState';

/** Mirrors act3.ts's own seedSplit/seedSplit2 — same deterministic 50/50
 * splits on the run's doorSeed, so a translated branch always matches the
 * English branch it stands in for. Two independently-offset variants so two
 * branch points in the same room don't always land the same way. */
function seedSplit(s: RunState): boolean {
  return ((s.doorSeed ?? 0) * 2654435761) % 2 === 0;
}
function seedSplit2(s: RunState): boolean {
  return ((s.doorSeed ?? 0) * 40503 + 17) % 2 === 0;
}

// ---------- The Colleague ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-colleague', 0, 0)]:
    "L'ascenseur monte. Les numéros d'étage grimpent comme un compte à rebours que personne n'a annoncé. Rowan, un demi-pas derrière toi, rit encore de quelque chose entendu au bar, en bas.",
  [roomBeatKey('the-colleague', 0, 1)]:
    "Deux ans de connivence, rejoués malgré toi dans les quatre secondes que mettent les portes à se refermer : les regards levés au ciel en réunion, le bon café, les phrases que l'autre termine avant que tu aies fini la tienne.",
  [roomBeatKey('the-colleague', 0, 2)]:
    '« Encore un verre, ma chambre a le balcon. » La bouteille, encore capsulée, tendue sans poids apparent — ou avec exactement le poids qu\'aucun de vous deux ne nomme.',
  [roomBeatKey('the-colleague', 0, 3)]:
    'La carte magnétique, dans ta main. Tu pourrais décrire sa température. Tu es justement en train de te la décrire, en silence, et cela seul est déjà une petite information.',
  [roomBeatKey('the-colleague', 0, 4)]:
    "Dana dort à deux cents kilomètres d'ici. Il ne s'est rien passé. Le couloir retient un souffle entier de silence, où il n'y a rien d'autre qu'une respiration.",
  [roomBeatKey('the-colleague', 0, 5)]:
    "Le Portier (par une porte de service, pour une fois) : « Il n'est pas nécessaire que les choses aillent mal chez toi pour qu'une porte devienne possible. C'est la phrase la mieux documentée de cet hôtel. »",
  [roomChoiceTextKey('the-colleague', 'the-balcony')]: 'Un dernier verre. Sa chambre.',
  [roomChoiceHintKey('the-colleague', 'the-balcony')]: 'Suivre la connivence là où elle mène',
  [roomChoiceOutcomeKey('the-colleague', 'the-balcony', 0)]:
    'Le seuil, tranché, à dessein — le déclic de la porte qui se referme est la dernière chose que la chambre montre.',
  [roomChoiceOutcomeKey('the-colleague', 'the-balcony', 1)]:
    "Le petit-déjeuner du lendemain dans le hall, à la place : deux collègues qui jouent aux collègues, devant un mauvais café. Ce qui s'est alourdi pendant la nuit est détaillé sans une seule image explicite — et c'est plus lourd.",
  [roomChoiceTextKey('the-colleague', 'walk-away')]: '« Bonne nuit, Rowan. » Ta chambre à toi. Personne d\'autre.',
  [roomChoiceHintKey('the-colleague', 'walk-away')]: "Laisser l'anticlimax être tout l'événement",
  [roomChoiceOutcomeKey('the-colleague', 'walk-away', 0)]:
    'L\'anticlimax, honoré comme la réussite qu\'il est réellement. Ta chambre. Le plafond. Un « t\'es réveillée ? » tapé, jamais envoyé, puis effacé.',
  [roomChoiceOutcomeKey('the-colleague', 'walk-away', 1)]:
    "Le répondeur endormi de Dana, écouté deux fois, sans raison que tu saurais formuler à voix haute. Partir, montré comme un événement, pas comme une absence.",
  [roomChoiceTextKey('the-colleague', 'name-it-in-the-corridor')]:
    'Dis-le tout haut, là, dans le couloir : « ça, c\'est une porte, et je ne l\'ouvre pas. »',
  [roomChoiceHintKey('the-colleague', 'name-it-in-the-corridor')]: 'Nommer la chose plutôt que la contourner',
  [roomChoiceOutcomeKey('the-colleague', 'name-it-in-the-corridor', 0)]:
    'Nommer change la connivence pour toujours. Une part en meurt sur-le-champ, honnêtement pleurée par la chambre plutôt que balayée sous le tapis.',
  [roomChoiceOutcomeKey('the-colleague', 'name-it-in-the-corridor', 1)]:
    "Ce qui reste est sûr à garder. La réponse de Rowan — d'abord silencieuse, puis soulagée — lui rend la même dignité : elle se tenait devant la même porte.",
  [roomChoiceTextKey('the-colleague', 'postpone')]:
    'Rien ce soir — mais laisse la porte entrouverte dans l\'agenda. « Le mois prochain, le voyage à Berlin… »',
  [roomChoiceHintKey('the-colleague', 'postpone')]: 'Décider en ne décidant pas',
  [roomChoiceOutcomeKey('the-colleague', 'postpone', 0)]:
    'Le choix malhonnête le plus honnête possible, ce soir : décider en ne décidant pas.',
  [roomChoiceOutcomeKey('the-colleague', 'postpone', 1)]:
    "L'entrée dans l'agenda brille, doucement, exactement comme un téléphone s'allume sur une table de chevet, trois étages plus bas. Une appréhension, reportée à plus tard, avec intérêts.",
  [roomExplanationKey('the-colleague', 0)]:
    "La recherche sur les infidélités trouve systématiquement que l'opportunité — voyages, autonomie, proximité prolongée — figure parmi les prédicteurs structurels les plus forts, souvent plus déterminants que la satisfaction dans la relation elle-même. Le recadrage d'Esther Perel ajoute une vérité plus dure : les aventures parlent souvent moins du partenaire resté à la maison que d'une version de soi-même qu'on a perdue de vue. « On est juste proches » plus un couloir d'hôtel à minuit forme un composé chimique différent de chacun de ces deux ingrédients pris seul — et c'est précisément pour cela que les couples qui décident en plein jour ce que signifient ces couloirs s'en sortent mieux que ceux qui improvisent à 0h47.",
  [roomNoteTitleKey('the-colleague')]: 'La géométrie des portes',
  [roomNoteThinkersKey('the-colleague')]: 'Treas · Giesen (2000) · Esther Perel (2017)',
  [roomNoteBodyKey('the-colleague')]:
    "Les recherches de Treas et Giesen sur l'infidélité ont montré que les structures d'opportunité — proximité, intimité, voyages — prédisent les aventures presque aussi fortement que l'insatisfaction relationnelle, parfois davantage ; à travers des décennies de données, le lieu de travail reste, et de loin, l'endroit où les aventures commencent le plus souvent, simplement parce qu'il offre un contact soutenu, privé et répété. L'apport de Perel recadre le « pourquoi » : **les aventures ne parlent souvent pas du partenaire qu'on a, mais du soi qu'on a perdu** — une version de soi-même qui existait avant les rôles, avant les habitudes, avant le crédit immobilier. Aucun de ces deux constats n'excuse quoi que ce soit ; tous deux expliquent pourquoi les couples qui décident, en plein jour, de ce que signifie un couloir d'hôtel, s'en sortent mesurablement mieux que ceux qui laissent ça s'improviser à minuit. La carte magnétique était chaude parce que tu la tenais. Remarque qui la tenait.",
});

// ---------- The Metamour ----------
registerAll('v2', 'fr', {
  // enforce-via-dana outcome1 is a function beat — registered below via register().
  [roomBeatKey('the-metamour', 0, 0)]:
    "Toi et Dana avez ouvert la relation il y a dix-huit mois, négocié comme il faut — la chambre le dit sans détour : c'est la version de bonne foi, pas une chambre construite pour la punir.",
  [roomBeatKey('the-metamour', 0, 1)]:
    "Le calendrier, à code couleur, reste ouvert sur le comptoir : pièce à conviction numéro un. Petra — l'autre partenaire de Dana — a pris l'habitude d'arriver sans prévenir, et vient de redéplacer votre semaine d'anniversaire pour la deuxième fois.",
  [roomBeatKey('the-metamour', 0, 2)]:
    "Petra elle-même, quand tu la vois, est chaleureuse et sincèrement attachante — la chambre y insiste, parce qu'une méchante facile ne t'apprendrait rien d'utile ici.",
  [roomBeatKey('the-metamour', 0, 3)]:
    "Le mot « hiérarchie », que vous vous étiez juré d'exclure tous les trois il y a dix-huit mois, plane au-dessus du calendrier sans que personne ne le prononce.",
  [roomBeatKey('the-metamour', 0, 4)]: 'Ta propre jalousie, examinée honnêtement : signal, ou bruit, ou — inconfortablement — les deux à la fois.',
  [roomBeatKey('the-metamour', 0, 5)]:
    "Le Portier : « Les arrangements à trois craquent aux coutures, pas au centre. La réception n'a jamais réparé une seule couture que quelqu'un aurait su nommer. »",
  [roomChoiceTextKey('the-metamour', 'enforce-via-dana')]: 'En parler à Dana : « ta relation, ta limite à tenir. »',
  [roomChoiceHintKey('the-metamour', 'enforce-via-dana')]: 'Faire passer ça par la personne à qui appartient la relation',
  [roomChoiceOutcomeKey('the-metamour', 'enforce-via-dana', 0)]:
    'Structurellement juste, et émotionnellement lent : Dana se tient, visiblement, entre deux personnes qui ont chacune un argument raisonnable.',
  [roomChoiceTextKey('the-metamour', 'talk-to-petra')]: 'Un café avec Petra. Juste vous deux. Nomme les choses directement.',
  [roomChoiceHintKey('the-metamour', 'talk-to-petra')]: "Avoir la conversation que presque personne n'a jamais",
  [roomChoiceOutcomeKey('the-metamour', 'talk-to-petra', 0)]:
    "La conversation entre métamours que presque personne n'a vraiment : maladroite, adulte et — la recherche le confirme — efficace.",
  [roomChoiceOutcomeKey('the-metamour', 'talk-to-petra', 1)]:
    "Une relation à laquelle tu ne t'attendais pas : pas vraiment de l'amitié, plutôt quelque chose comme un traité, négocié par les deux personnes qui avaient vraiment besoin de le négocier.",
  [roomChoiceTextKey('the-metamour', 'name-the-hierarchy')]: 'Convoque la réunion. Forcez-vous, tous les trois, à dire le mot.',
  [roomChoiceHintKey('the-metamour', 'name-the-hierarchy')]: 'Dire « hiérarchie » à voix haute, exprès',
  [roomChoiceOutcomeKey('the-metamour', 'name-the-hierarchy', 0)]:
    'Le tabou, prononcé : « une hiérarchie descriptive existe ; faire semblant du contraire est exactement ce qui la rend prescriptive et injuste. » Des larmes, chez plus d\'une personne dans la pièce.',
  [roomChoiceOutcomeKey('the-metamour', 'name-the-hierarchy', 1)]:
    "Une charte réécrite s'ensuit, avec de vrais horaires et de vraies limites qu'on n'appelle pas des vetos mais qui en font office, prudemment — honnête, et coûteuse à obtenir.",
  [roomChoiceTextKey('the-metamour', 'audit-the-jealousy')]: 'Avant tout : est-ce du signal, ou du bruit ?',
  [roomChoiceHintKey('the-metamour', 'audit-the-jealousy')]: "Examiner d'abord ta propre réaction",
  [roomChoiceOutcomeKey('the-metamour', 'audit-the-jealousy', 0)]:
    'Une chambre dans la chambre, faite d\'introspection. Le constat, rendu avec équité : les deux à la fois. Une vraie limite s\'est vraiment érodée, et ton propre schéma d\'attachement l\'amplifie vraiment.',
  [roomChoiceOutcomeKey('the-metamour', 'audit-the-jealousy', 1)]:
    "Deux constats différents demandent deux outils différents, et la chambre te tend les deux plutôt que d'en choisir un à ta place.",
  [roomExplanationKey('the-metamour', 0)]:
    "Les recherches sur la non-monogamie consensuelle trouvent une satisfaction et une confiance comparables à celles des relations monogames, précisément quand les arrangements sont négociés et entretenus activement — pas fixés une fois pour toutes puis présumés acquis. Les modes d'échec documentés sont précis et évitables : la dérive, la hiérarchie tue et l'évitement du métamour, où les personnes les plus concernées par un arrangement ne se parlent en réalité jamais directement. La compersion — trouver de la joie dans la joie que ton ou ta partenaire trouve ailleurs — fonctionne dans la littérature comme une compétence qui s'apprend, pas comme un prérequis de personnalité ; et la jalousie, plutôt qu'un verdict, fonctionne comme une donnée qui reste à interpréter.",
  [roomNoteTitleKey('the-metamour')]: 'Coutures',
  [roomNoteThinkersKey('the-metamour')]: 'Moors · Conley · recherches sur les résultats de la CNM',
  [roomNoteBodyKey('the-metamour')]:
    "L'état honnête de la science, dans les deux sens : des études bien menées trouvent une satisfaction et une confiance comparables entre CNM négociée et monogamie, tout en identifiant les comportements d'entretien qui prédisent quels arrangements de CNM prospèrent réellement — renégociation planifiée, contact direct entre métamours, et conversations explicites sur la hiérarchie plutôt que présumées. **La double nature de la jalousie est bien documentée : parfois c'est du signal (une vraie limite franchie), parfois du bruit (une météo de l'attachement, sans rien d'extérieur à pointer du doigt), et souvent les deux à la fois dans le même sentiment.** La monogamie cache ses coutures à l'intérieur de la tradition, là où personne n'a besoin de les nommer. Ici, elles sont visibles à dessein. Des déchirures visibles, contrairement à celles qu'on cache, peuvent réellement se recoudre.",
});
register(roomChoiceOutcomeKey('the-metamour', 'enforce-via-dana', 1), 'v2', 'fr', (s: RunState) =>
  seedSplit(s)
    ? "Cette fois, ça tient — parce que Dana tient bon. La chambre est honnête : tu as délégué la conversation difficile, et elle est, par chance, arrivée à bon port."
    : "Ça vacille. Dana essaie, et Petra lit la limite comme venant de toi, pas de Dana — ce qui n'est pas complètement faux. La chambre est honnête : déléguer une limite ne garantit pas qu'elle arrive intacte.",
);

// ---------- The Veto ----------
registerAll('v2', 'fr', {
  // counter-veto outcome0 is a function beat — registered below via register().
  [roomBeatKey('the-veto', 0, 0)]:
    "Dana invoque le veto — rédigé la première année, « pour les urgences », jamais utilisé depuis. Contre Sam. La première personne que tu aimes, pas seulement que tu fréquentes, depuis des années.",
  [roomBeatKey('the-veto', 0, 1)]:
    "La raison de Dana, prise au sérieux par la chambre plutôt que balayée : « parce que celui-là est différent, et différent me fait peur. » Ce qui est exactement pour ça que le veto existe. Ce qui est exactement le problème.",
  [roomBeatKey('the-veto', 0, 2)]:
    'Sam, esquissé en trois détails précis et chaleureux — la chambre insiste pour que tu ressentes ce qui est réellement mis sous veto avant de décider quoi que ce soit.',
  [roomBeatKey('the-veto', 0, 3)]: 'La peur de Dana, elle aussi montrée de l\'intérieur, en entier : pas de la tyrannie, mais de la terreur en peignoir, à onze heures du soir.',
  [roomBeatKey('the-veto', 0, 4)]:
    'La question sous la règle, désormais inévitable : le veto a-t-il jamais été compatible avec ce que vous disiez, tous les deux, être en train de construire ?',
  [roomBeatKey('the-veto', 0, 5)]:
    "Le Portier : « La réception garde un tiroir de clés de secours. La leçon du tiroir : avec le temps, tout finit par devenir une urgence pour quelqu'un. »",
  [roomChoiceTextKey('the-veto', 'comply')]: 'Respecter la règle telle qu\'elle est écrite. Rompre avec Sam.',
  [roomChoiceHintKey('the-veto', 'comply')]: "Tenir le vieil accord, quoi qu'il en coûte maintenant",
  [roomChoiceOutcomeKey('the-veto', 'comply', 0)]:
    "La scène de rupture avec Sam — qui n'a rien fait de mal — montrée avec tout son poids, inconfortable.",
  [roomChoiceOutcomeKey('the-veto', 'comply', 1)]:
    "Le mariage des règles préservé. Le soulagement de Dana, réel. Et à l'intérieur, visible seulement pour toi : exactement ce que la règle vient d'acheter, et exactement ce qu'elle a coûté.",
  [roomChoiceTextKey('the-veto', 'fight-the-rule')]:
    "Refuser le veto, pas Dana : « on renégocie la règle, ou ce n'est pas la règle qui va casser. »",
  [roomChoiceHintKey('the-veto', 'fight-the-rule')]: 'Contester le mécanisme, pas la personne',
  [roomChoiceOutcomeKey('the-veto', 'fight-the-rule', 0)]:
    "La crise constitutionnelle d'un État à deux personnes, montrée dans des détails douloureux : ce qui remplace un veto — des préoccupations soulevées, des pauses limitées dans le temps, mais plus d'interrupteur unilatéral.",
  [roomChoiceOutcomeKey('the-veto', 'fight-the-rule', 1)]:
    "La peur de Dana doit désormais être accueillie avec de l'attention plutôt qu'avec une loi, ce qui est plus dur pour vous deux, et — la chambre y insiste — plus honnête.",
  [roomChoiceTextKey('the-veto', 'examine-the-veto')]: 'Avant de décider quoi que ce soit : à quoi servait vraiment le veto, la première année ?',
  [roomChoiceHintKey('the-veto', 'examine-the-veto')]: 'Comprendre la règle avant de lui obéir ou de la briser',
  [roomChoiceOutcomeKey('the-veto', 'examine-the-veto', 0)]:
    "Une petite fouille archéologique : la nuit où la règle a été écrite, tous les deux effrayés, la règle construite comme une couverture contre une peur à laquelle ni l'un ni l'autre n'avait encore de meilleure réponse.",
  [roomChoiceOutcomeKey('the-veto', 'examine-the-veto', 1)]:
    "Le constat : les règles écrites par la peur font régner la peur. Ce que tu fais ensuite est un choix distinct, mieux informé — la chambre prend soin de ne pas le faire à ta place.",
  [roomChoiceTextKey('the-veto', 'counter-veto')]: 'Invoquer le tien en retour. Contre Petra.',
  [roomChoiceHintKey('the-veto', 'counter-veto')]: 'Répondre au coup plutôt que de le résoudre',
  [roomChoiceOutcomeKey('the-veto', 'counter-veto', 1)]:
    'La destruction mutuelle assurée de deux amours bien réels. L\'arrangement survit à l\'échange comme une forteresse avec deux prisonniers à l\'intérieur.',
  [roomExplanationKey('the-veto', 0)]:
    'Le débat sur le veto au sein des communautés non-monogames dure depuis des décennies sans résolution complète, et les arguments les plus forts de chaque côté méritent d\'être entendus : un veto comme réassurance pour un·e partenaire effrayé·e, contre un veto comme interrupteur tenu au-dessus de la vie et des sentiments bien réels d\'une tierce personne, sans son consentement à l\'arrangement. « Différent me fait peur » est habituellement une demande d\'attention, pas d\'obéissance — et les règles, aussi bien intentionnées soient-elles, sont structurellement incapables d\'accomplir le travail que seuls une réassurance et un réattachement sincères peuvent accomplir.',
  [roomNoteTitleKey('the-veto')]: 'Clés de secours',
  [roomNoteThinkersKey('the-veto')]: "littérature sur le veto en CNM · recherches sur l'autonomie",
  [roomNoteBodyKey('the-veto')]:
    "Le débat sur le veto, qui dure depuis longtemps dans la communauté non-monogame, a de vraies positions solidement défendues des deux côtés — une réassurance pour le ou la partenaire le ou la plus anxieux/anxieuse, contre un interrupteur exercé sur quelqu'un qui n'a pas voix au chapitre. Le constat empirique qui mérite d'être retenu : les arrangements avec veto sont corrélés à des stades de CNM plus précoces, moins négociés, et tendent, avec le temps, soit à être renégociés vers quelque chose de plus collaboratif, soit à se rompre net dès qu'on les actionne réellement. **La tierce personne mise sous veto est une personne, pas une variable dans l'équation de quelqu'un d'autre, et la recherche insiste de plus en plus pour le dire clairement.** Aucune règle n'a jamais tenu une main tremblante. Seules des mains le font.",
});
register(roomChoiceOutcomeKey('the-veto', 'counter-veto', 0), 'v2', 'fr', (s: RunState) =>
  s.flags.includes('symmetry-trap')
    ? "Le piège de la symétrie, à taille adulte cette fois — la chambre remarque que ce n'est pas la première fois : en plus petit, avec un mot de passe au lieu d'une personne."
    : "Le piège de la symétrie, à taille adulte : répondre à la force par la force plutôt que résoudre le vrai désaccord qui se cache dessous.",
);

// ---------- The Drift ----------
registerAll('v2', 'fr', {
  // raise-it outcome1 is a function beat — registered below via register().
  [roomBeatKey('the-drift', 0, 0)]:
    "Toi et Dana, septième année. Rien ne va mal. Rien n'est rien de particulier. La chambre est meublée exactement comme votre salon, et l'horreur, en sourdine, c'est que c'est confortable.",
  [roomBeatKey('the-drift', 0, 1)]:
    "Tu sais quelle latte du parquet grince, quel mug appartient à qui, ce que signifie tel soupir précis. La soirée se rejoue avec une précision tendre, presque légale, et ce détail lui-même est l'angoisse.",
  [roomBeatKey('the-drift', 0, 2)]:
    "La dernière année, vue de loin : des semaines indiscernables, empilées les unes sur les autres. La dernière fois que l'un de vous deux a posé une question dont il ne connaissait pas déjà la réponse — la chambre peut en donner la date exacte, ce qui est en soi une accusation silencieuse.",
  [roomBeatKey('the-drift', 0, 3)]: 'Deux futurs, projetés côte à côte : celui-ci, inchangé, pendant quarante ans encore. Ou l\'inconnu, pour un nombre inconnu d\'années.',
  [roomBeatKey('the-drift', 0, 4)]:
    "Le Portier : « Les séjours les plus longs de cette aile sont dans les chambres les plus silencieuses. La réception n'a jamais tranché si c'est de la paix. Les chambres non plus. »",
  [roomChoiceTextKey('the-drift', 'start-the-work')]: 'Rester, et commencer le travail terrifiant de vouloir à nouveau.',
  [roomChoiceHintKey('the-drift', 'start-the-work')]: 'Commencer, par quelque chose de petit',
  [roomChoiceOutcomeKey('the-drift', 'start-the-work', 0)]:
    'Pas un montage. Un seul geste concret : une question dont tu ne connais pas la réponse, posée à voix haute, devant l\'évier.',
  [roomChoiceOutcomeKey('the-drift', 'start-the-work', 1)]:
    "Son sillage, disproportionné, montré honnêtement — un élargissement de soi amorcé à l'échelle d'une cuisine. Aucune garantie n'est délivrée. La chambre le dit sans détour.",
  [roomChoiceTextKey('the-drift', 'raise-it')]: 'Dire l\'indicible : « est-ce qu\'on va bien, ou est-ce qu\'on est juste silencieux ? »',
  [roomChoiceHintKey('the-drift', 'raise-it')]: 'Poser la question à voix haute',
  [roomChoiceOutcomeKey('the-drift', 'raise-it', 0)]:
    "La conversation elle-même est le risque, et la chambre en fixe le prix honnêtement : ce qui s'ouvre ici ne peut pas se refermer comme avant.",
  [roomChoiceOutcomeKey('the-drift', 'raise-it', 2)]: 'Les deux versions se terminent avec plus de vie dans la pièce, et moins de sol sous les pieds.',
  [roomChoiceTextKey('the-drift', 'accept-quiet-as-love')]: "Décider que c'est ça, l'amour, sous ses habits de septième année.",
  [roomChoiceHintKey('the-drift', 'accept-quiet-as-love')]: 'Accorder au silence sa propre dignité',
  [roomChoiceOutcomeKey('the-drift', 'accept-quiet-as-love', 0)]:
    "La chambre accorde à cette lecture toute sa dignité : l'amour de compagnonnage est de l'amour véritable, pas une catégorie inférieure.",
  [roomChoiceOutcomeKey('the-drift', 'accept-quiet-as-love', 1)]:
    "Une condition honnête s'ajoute : il faut le choisir, pas y tomber par défaut. La différence tient en un seul instant de gratitude active, dite plutôt que simplement ressentie.",
  [roomChoiceTextKey('the-drift', 'notice-youve-left')]: "Remarquer que tu as déjà quitté cette relation par tous les moyens sauf la porte.",
  [roomChoiceHintKey('the-drift', 'notice-youve-left')]: 'Faire un inventaire honnête',
  [roomChoiceOutcomeKey('the-drift', 'notice-youve-left', 0)]: "Une catastrophe silencieuse, celle d'un inventaire honnête. Rien n'est annoncé. Rien n'est fait comme bagage.",
  [roomChoiceOutcomeKey('the-drift', 'notice-youve-left', 1)]:
    "Juste la reconnaissance du fait — qui change le poids de chaque chambre encore à venir dans ce parcours, que quelqu'un d'autre dans l'hôtel l'apprenne ce soir ou non.",
  [roomExplanationKey('the-drift', 0)]:
    "Les recherches longitudinales de John Gottman trouvent systématiquement que le désengagement émotionnel, et non la fréquence des conflits, est le meilleur prédicteur de la fin d'une relation — les couples qui cessent de se tendre la main l'un vers l'autre courent plus de risques que ceux qui se disputent régulièrement mais continuent d'essayer. Les recherches d'Arthur Aron sur l'élargissement de soi ont trouvé quelque chose de plus encourageant : les couples qui pratiquent ensemble des activités nouvelles, modérément stimulantes, montrent des hausses mesurables de satisfaction relationnelle, comme si l'amour se nourrissait en partie de croissance et pas seulement de confort. La thèse du « mariage tout-ou-rien » d'Eli Finkel nomme le piège sans détour : les couples modernes demandent à une seule personne d'être presque tout, puis privent ce « tout » de temps et de nouveauté.",
  [roomNoteTitleKey('the-drift')]: 'Les chambres les plus silencieuses',
  [roomNoteThinkersKey('the-drift')]: 'Gottman · Aron (2000) · Finkel (2017)',
  [roomNoteBodyKey('the-drift')]:
    "Les données de Gottman sont cohérentes à travers les décennies : le désengagement — pas la présence de conflit — est le meilleur prédicteur qu'une relation touche à sa fin, parce que les couples qui cessent de se tourner vers les petites sollicitations d'attention de l'autre ont cessé l'entretien dont l'amour a réellement besoin. Les expériences d'Aron sur l'élargissement de soi ont trouvé quelque chose de précis et reproductible : des couples auxquels on assignait des activités communes nouvelles, modérément exigeantes, rapportaient des gains mesurables de proximité — la preuve que la croissance fonctionne comme un ingrédient réel, pas seulement comme une métaphore romantique. Le cadre de Finkel aiguise le piège : on demande aux relations modernes de fournir presque tout ce dont une personne a besoin — tout en recevant moins de temps et d'attention que les relations n'en recevaient historiquement de toute une communauté environnante. **Le confort est une caractéristique. Vérifie si c'est la seule encore installée.**",
});
register(roomChoiceOutcomeKey('the-drift', 'raise-it', 1), 'v2', 'fr', (s: RunState) =>
  seedSplit(s)
    ? 'La réponse de Dana arrive comme un soulagement — visible, immédiat, comme un souffle retenu qu\'on relâche enfin : « je me demandais justement comment te poser exactement la même question. »'
    : "La réponse de Dana arrive d'abord sous la forme d'une colère — la peur portant son manteau le moins flatteur — avant de s'adoucir, plus tard, en quelque chose qui ressemble davantage à du soulagement.",
);

// ---------- The Second Account ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-second-account', 0, 0)]:
    "Ton propre deuxième compte. Commencé comme un pseudo pour rire ; aujourd'hui, c'est là qu'une version de toi flirte, récolte de l'attention, entretient trois conversations à feu doux dont Dana ignore l'existence.",
  [roomBeatKey('the-second-account', 0, 1)]:
    "Rien de physique. Rien même d'organisé. Tout le mécanisme de la chambre tient en cela : elle te rejoue tes propres messages avec la voix plate, sans inflexion, du Portier — exactement le registre qui fait sonner le flirt comme un témoignage sous serment.",
  [roomBeatKey('the-second-account', 0, 2)]:
    'Trois conversations, extraites platement : les compliments que tu vas pêcher, catalogués par espèce, aucun d\'eux accidentel.',
  [roomBeatKey('the-second-account', 0, 3)]: "Une question, livrée en un seul instant : comment appellerais-tu ça si c'était Dana qui le faisait ?",
  [roomBeatKey('the-second-account', 0, 4)]:
    "Le grand livre de la dopamine, en colonnes honnêtes : ce que le compte nourrit, ce qu'il coûte, côte à côte, ni l'une ni l'autre cachée.",
  [roomBeatKey('the-second-account', 0, 5)]:
    "Le Portier : « La réception ne classe rien. La réception se contente de relire à voix haute. Ce sont les client·e·s qui classent, à la vitesse de leur propre grimace. »",
  [roomChoiceTextKey('the-second-account', 'delete-it')]: 'Supprimer le compte. Ce soir. En entier.',
  [roomChoiceHintKey('the-second-account', 'delete-it')]: 'En finir proprement',
  [roomChoiceOutcomeKey('the-second-account', 'delete-it', 0)]:
    "La suppression, montrée telle que le sevrage se ressent vraiment : la démangeaison, le réflexe fantôme de vérifier, une semaine entière à tendre la main vers une porte qui n'est plus là.",
  [roomChoiceOutcomeKey('the-second-account', 'delete-it', 1)]:
    'Ce qui revient en son absence : l\'attention, redirigée vers la maison — maladroite, d\'abord, et vraiment vivante.',
  [roomChoiceTextKey('the-second-account', 'keep-and-name-it')]: 'Le garder. Nommer honnêtement ce qu\'il nourrit.',
  [roomChoiceHintKey('the-second-account', 'keep-and-name-it')]: 'Rester, mais arrêter de faire semblant',
  [roomChoiceOutcomeKey('the-second-account', 'keep-and-name-it', 0)]:
    "La rationalisation sophistiquée, exposée avec toute son honnêteté : « tout le monde a besoin d'un espace de soi en dehors de la relation. »",
  [roomChoiceOutcomeKey('the-second-account', 'keep-and-name-it', 1)]:
    "Un test honnête s'ajoute, et reste installé : un espace de soi, ou un secret ? Le compte reste, et la question désormais y habite en permanence.",
  [roomChoiceTextKey('the-second-account', 'show-dana')]: 'Tendre le téléphone à Dana. Compte ouvert.',
  [roomChoiceHintKey('the-second-account', 'show-dana')]: 'Laisser Dana lire elle-même',
  [roomChoiceOutcomeKey('the-second-account', 'show-dana', 0)]:
    "La porte la plus courageuse et la plus coûteuse. Dana lit en temps réel — cette fois, c'est le visage de Dana que la chambre rejoue, pas les messages.",
  [roomChoiceOutcomeKey('the-second-account', 'show-dana', 1)]:
    "La conversation qui suit porte sur ce qui manquait vraiment, ce que le compte nourrissait en silence — un mur démoli avec l'immeuble encore habité.",
  [roomChoiceTextKey('the-second-account', 'defend-the-category')]: '« C\'est pas tromper, si… »',
  [roomChoiceHintKey('the-second-account', 'defend-the-category')]: "Finir la phrase et voir si elle tient debout",
  [roomChoiceOutcomeKey('the-second-account', 'defend-the-category', 0)]:
    "La chambre te laisse finir la phrase en entier, puis te la relit, platement, avec la voix même du Portier, à côté des vraies données d'enquête.",
  [roomChoiceOutcomeKey('the-second-account', 'defend-the-category', 1)]:
    "La phrase ne survit pas à cette lecture. Le compte, lui, survit. Ce qui est, en soi, une information sur toi.",
  [roomExplanationKey('the-second-account', 0)]:
    "Les enquêtes sur ce qui compte comme « micro-tromperie » trouvent vraiment peu de consensus — pas seulement entre inconnus, mais entre partenaires d'une même relation, qui sont souvent en désaccord entre eux sur l'emplacement de la limite. Le diagnostic le plus fiable n'est pas un acte précis ; c'est un test simple — montrerais-tu ce fil de discussion à ton ou ta partenaire, sans qu'on te le demande, là, maintenant ? Le secret, encore une fois, se révèle être l'ingrédient porteur — le même constat que les recherches de Shirley Glass sur les murs et les fenêtres, appliqué cette fois à un téléphone plutôt qu'à une personne.",
  [roomNoteTitleKey('the-second-account')]: 'L\'écart de définition',
  [roomNoteThinkersKey('the-second-account')]: "littérature d'enquête sur l'infidélité numérique · Glass (2003) (murs numériques)",
  [roomNoteBodyKey('the-second-account')]:
    "Les enquêtes qui demandent à des couples de définir « tromper » chacun de leur côté trouvent un accord remarquablement faible — pas entre inconnus, où le désaccord est attendu, mais entre partenaires d'une même relation, qui tracent la ligne à des endroits différents sans s'en rendre compte avant d'être mis à l'épreuve. Malgré ce désaccord général, un critère tient bon : le secret. **Un comportement caché à son ou sa partenaire fonctionne, structurellement, exactement comme un comportement caché a toujours fonctionné — indépendamment de l'espèce de comportement dont il s'agit techniquement.** L'attention elle-même se comporte, dans cette recherche, comme une ressource finie et redirigeable : ce qu'un compte récolte, la relation ne le reçoit pas, que quelque chose d'explicite ait ou non jamais été échangé. Le miroir est à l'intérieur de cette porte pour une raison précise. C'est la seule chambre où la preuve devait toujours être la tienne.",
});

// ---------- The Discovery ----------
registerAll('v2', 'fr', {
  // beat0 is a function beat — registered below via register().
  [roomBeatKey('the-discovery', 0, 1)]: 'Les quatre avenirs, tous visibles en même temps depuis cette cuisine précise, aucun d\'eux encore choisi.',
  [roomBeatKey('the-discovery', 0, 2)]:
    "La seule chose que la recherche sait vraiment sur l'heure qui vient : ce qui se dit sous le coup de la submersion a tendance à rester dit, classé pour de bon, quelle que soit la vérité qui finit par apparaître.",
  [roomBeatKey('the-discovery', 0, 3)]: 'Le téléphone s\'éclaire de nouveau.',
  [roomBeatKey('the-discovery', 0, 4)]:
    "Le Portier (tout bas) : « La réception ne conseille à aucun·e client·e de rien signer avec des mains qui tremblent. Cela vaut aussi pour les phrases. »",
  [roomChoiceTextKey('the-discovery', 'confront-now')]: 'Affronter maintenant. Sous le coup de la submersion. Ici, dans la cuisine.',
  [roomChoiceHintKey('the-discovery', 'confront-now')]: "Le dire avant d'avoir retrouvé ton calme",
  [roomChoiceOutcomeKey('the-discovery', 'confront-now', 0)]:
    "La dispute, montrée en phrases courtes et fracturées — l'accusation qui dépasse les preuves, la propre submersion de Dana répondant à la tienne, deux personnes qui se noient dans la même petite cuisine.",
  [roomChoiceOutcomeKey('the-discovery', 'confront-now', 2)]:
    "Chaque vérité pique. L'une justifie la submersion. L'autre l'accuse. Le vrai propos de la chambre n'a jamais été la réponse — c'était l'heure elle-même.",
  [roomChoiceTextKey('the-discovery', 'gather-first')]: 'Ne rien dire. Vérifier. Méthodiquement, patiemment, froidement.',
  [roomChoiceHintKey('the-discovery', 'gather-first')]: 'Construire une certitude avant de parler',
  [roomChoiceOutcomeKey('the-discovery', 'gather-first', 0)]:
    "Trois jours, condensés en quatre instants : la mise en scène de la normalité au petit-déjeuner, pendant qu'en silence, tu audites une vie entière.",
  [roomChoiceOutcomeKey('the-discovery', 'gather-first', 2)]:
    "Les deux livraisons — la réponse, et ce que l'obtenir a fait de toi — arrivent ensemble, de la même main.",
  [roomChoiceTextKey('the-discovery', 'pretend')]: 'Décider, activement, de ne pas savoir.',
  [roomChoiceHintKey('the-discovery', 'pretend')]: "Choisir l'ignorance, exprès",
  [roomChoiceOutcomeKey('the-discovery', 'pretend', 0)]:
    "Ne pas savoir, il s'avère, c'est un travail à temps plein, sans jours fériés. La chambre montre en accéléré son coût d'entretien sur les semaines qui suivent.",
  [roomChoiceOutcomeKey('the-discovery', 'pretend', 1)]:
    "Quelle que soit la vérité, elle reste inconnue ce soir — classée à la place comme un bourdonnement sourd sous chaque conversation qui suivra.",
  [roomChoiceTextKey('the-discovery', 'walk-tonight')]: 'Faire un sac. Laisser la question derrière toi, avec la bague.',
  [roomChoiceHintKey('the-discovery', 'walk-tonight')]: 'Partir sans attendre la réponse',
  [roomChoiceOutcomeKey('the-discovery', 'walk-tonight', 0)]:
    "Le départ, montré sans triomphe. Partir sur une question, c'est emporter cette question avec toi — pliée à plat, sous tout le reste, indéfiniment.",
  [roomChoiceOutcomeKey('the-discovery', 'walk-tonight', 1)]: "Certain·e·s client·e·s appellent ça du courage. D'autres, de la fuite. La réception, honnêtement, classe ça sous les deux à la fois.",
  [roomChoiceTextKey('the-discovery', 'steady-then-ask')]:
    'Reposer le téléphone. Marcher autour du pâté de maisons jusqu\'à ce que tes mains t\'appartiennent de nouveau — puis demander à Dana, directement, ce soir, sans dossier préparé d\'avance.',
  [roomChoiceHintKey('the-discovery', 'steady-then-ask')]: 'Laisser la submersion passer, pas la question',
  [roomChoiceOutcomeKey('the-discovery', 'steady-then-ask', 0)]:
    "Vingt minutes, l'air froid, pas de téléphone. Pas vraiment calme — juste passé le point où c'est le corps qui menait la conversation à ta place.",
  [roomChoiceOutcomeKey('the-discovery', 'steady-then-ask', 2)]:
    "La réception ne tient pas de registre séparé pour ce qui se dit sous submersion et ce qui se dit posément — mais toi, si, et cette fois, il n'y a rien classé dans la première colonne.",
  [roomExplanationKey('the-discovery', 0)]:
    "Ce que les chercheurs appellent la submersion — la réponse d'alarme du corps qui envahit le raisonnement supérieur — explique pourquoi la première conversation après un soupçon de trahison tourne généralement le plus mal : un rythme cardiaque élevé et une activation physiologique diffuse altèrent réellement la capacité à penser clairement, pendant environ vingt minutes — une fenêtre que la plupart des confrontations n'attendent pas. Ce que la recherche sur les conversations de découverte recommande systématiquement est structurel : un délai, la respiration, parfois même un texte préparé à l'avance, plutôt que de faire confiance à l'instant submergé pour produire quoi que ce soit de fiable. Et un taux de base qui remet les pieds sur terre, à retenir : les cœurs sur les téléphones ont souvent plus de propriétaires possibles que le pire scénario ne l'envisage d'habitude.",
  [roomNoteTitleKey('the-discovery')]: 'Signer les mains tremblantes',
  [roomNoteThinkersKey('the-discovery')]: 'Gottman (submersion) · recherches sur les conversations de découverte',
  [roomNoteBodyKey('the-discovery')]:
    "Les recherches physiologiques de Gottman sur la « submersion » ont trouvé quelque chose de précis et de testable : un rythme cardiaque réellement élevé produit une activation physiologique diffuse qui dégrade mesurablement la capacité à écouter, raisonner ou parler avec soin — pas une métaphore, un état documenté qui dure environ vingt minutes après son déclencheur. Les recherches sur la meilleure façon de traverser une découverte de trahison convergent sur une structure : un délai avant la conversation difficile, une respiration délibérée, parfois littéralement un texte préparé, plutôt que de faire confiance à ce qui vient en premier. **Ce qui se dit sous submersion a tendance à rester classé pour de bon dans la mémoire d'une relation, quelle que soit la vérité qui apparaît ensuite.** Quatre secondes de lumière. Le reste, c'est celui ou celle qui lit qui l'a fourni — comme dans chaque chambre de cette aile.",
});
register(roomBeatKey('the-discovery', 0, 0), 'v2', 'fr', (s: RunState) =>
  s.flags.includes('waiting-to-be-caught')
    ? "Le comptoir. La lumière. Cette fois, tu vois la scène depuis l'autre chaise — celle de la personne prise sur le fait, en train de regarder le visage de Dana pendant que le téléphone s'éclaire d'un nom que Dana ne connaît pas et d'un cœur que Dana, lui, connaît. Tu sais maintenant, exactement, ce que ça fait, des deux côtés."
    : "Le téléphone de Dana, écran retourné vers le haut sur le comptoir, s'éclaire d'un nom que tu ne connais pas et d'un cœur que tu connais. Quatre secondes suffisent au corps : le pouls qui cogne dans les oreilles, les mains qui deviennent soudain, inutilement, froides.",
);
register(roomChoiceOutcomeKey('the-discovery', 'confront-now', 1), 'v2', 'fr', (s: RunState) =>
  seedSplit2(s)
    ? "Ce qu'était vraiment cet emoji cœur arrive plus tard, une fois que vous vous êtes calmés assez pour l'entendre tous les deux : une liaison, réelle, vieille de six semaines. La submersion, il s'avère, avait vu juste."
    : "Ce qu'était vraiment cet emoji cœur arrive plus tard, une fois que vous vous êtes calmés assez pour l'entendre tous les deux : le frère ou la sœur de Dana, en train d'organiser une fête surprise, trois semaines de messages de plus en plus excités. La submersion a mis en accusation un téléphone innocent.",
);
register(roomChoiceOutcomeKey('the-discovery', 'gather-first', 1), 'v2', 'fr', (s: RunState) =>
  seedSplit2(s)
    ? "La certitude arrive, et elle est pire que le soupçon : une liaison, réelle. Tu obtiens la réponse, et tu deviens — en l'obtenant — quelqu'un qui a observé une personne endormie et catalogué sa respiration."
    : "La certitude arrive, et elle dissout complètement le soupçon : une fête surprise, rien d'autre, trois jours de ton propre travail de détective dépensés pour rien. Tu obtiens la réponse, et tu deviens quand même quelqu'un qui a observé une personne endormie et catalogué sa respiration.",
);
register(roomChoiceOutcomeKey('the-discovery', 'steady-then-ask', 1), 'v2', 'fr', (s: RunState) =>
  seedSplit2(s)
    ? "Tu rentres et tu demandes, une fois, directement. Dana te le dit : une liaison, réelle, vieille de six semaines. C'est exactement aussi grave que la marche t'a laissé craindre — mais tu entends la phrase entière, pas seulement sa première moitié, submergée."
    : "Tu rentres et tu demandes, une fois, directement. Dana te le dit : un frère ou une sœur, une fête surprise, trois semaines de préparatifs excités. Rien. Tu le crois, surtout parce que tu as posé la question dans un état capable de vraiment reconnaître une réponse.",
);

// ---------- The Wedding Eve ----------
registerAll('v2', 'fr', {
  // beat2 is a function beat — registered below via register().
  [roomBeatKey('the-wedding-eve', 0, 0)]:
    "La nuit avant ton mariage avec Dana. 2h10. Le costume pend sur l'armoire comme une question que personne n'a posée à voix haute. Le plan de table, terminé, attend sur le bureau.",
  [roomBeatKey('the-wedding-eve', 0, 1)]:
    "Le doute arrive en tenue de travail : précis, petit, taillé exactement pour deux heures du matin — pas dramatique, ce qui, étrangement, le rend plus difficile à écarter.",
  [roomBeatKey('the-wedding-eve', 0, 3)]:
    "L'inventaire sur lequel la chambre insiste : quels doutes concernent vraiment Dana, lesquels concernent le mariage comme institution, lesquels ne concernent que toi.",
  [roomBeatKey('the-wedding-eve', 0, 4)]:
    "L'audit des coûts irrécupérables suit — les acomptes, les invitations, quatre années, la robe de ta mère — listés en entier, puis explicitement disqualifiés comme preuves par la chambre elle-même.",
  [roomBeatKey('the-wedding-eve', 0, 5)]:
    "Le Portier : « La réception reçoit un appel par nuit depuis cette chambre. C'est toujours quelqu'un qui demande si tout le monde reçoit cet appel. La réponse honnête : la plupart. Pas tout le monde. »",
  [roomChoiceTextKey('the-wedding-eve', 'sit-with-it-til-morning')]: "Tenir le doute sans lui obéir ni le faire taire.",
  [roomChoiceHintKey('the-wedding-eve', 'sit-with-it-til-morning')]: "L'attendre, honnêtement, jusqu'au jour",
  [roomChoiceOutcomeKey('the-wedding-eve', 'sit-with-it-til-morning', 0)]:
    "L'aube arrive, le doute est toujours là, mais désormais à sa juste taille, plutôt que menaçant.",
  [roomChoiceOutcomeKey('the-wedding-eve', 'sit-with-it-til-morning', 1)]:
    "Le constat de la chambre : les doutes qui survivent à un examen honnête finissent soit par rétrécir, soit par se préciser — et dans les deux cas, c'est une vraie information. Tu marches vers le lieu de la cérémonie en sachant ce qu'a fait le tien.",
  [roomChoiceTextKey('the-wedding-eve', 'call-someone-honest')]: 'Réveiller la seule personne qui te dira la vérité.',
  [roomChoiceHintKey('the-wedding-eve', 'call-someone-honest')]: 'Obtenir un regard extérieur et honnête',
  [roomChoiceOutcomeKey('the-wedding-eve', 'call-someone-honest', 0)]:
    "La conversation de trois heures du matin, montrée en entier. Une seule question fait, en quatre mots, ce que la chambre a mis six instants à construire : « c'est le jour, ou c'est la personne ? »",
  [roomChoiceOutcomeKey('the-wedding-eve', 'call-someone-honest', 1)]: 'Une permission, accordée — quelle que soit la réponse honnête.',
  [roomChoiceTextKey('the-wedding-eve', 'answer-the-flame')]: "Répondre à l'appel. Ou le passer toi-même.",
  [roomChoiceHintKey('the-wedding-eve', 'answer-the-flame')]: "Rouvrir l'ancienne conversation ce soir",
  [roomChoiceOutcomeKey('the-wedding-eve', 'answer-the-flame', 1)]:
    "Rien ne se passe, sauf que tout se compare. Tu raccroches en sachant quelque chose — la chambre refuse de dire quoi, à voix haute, ce soir.",
  [roomChoiceTextKey('the-wedding-eve', 'postpone')]: 'Réveiller Dana. Le dire : « pas demain. Pas comme ça. »',
  [roomChoiceHintKey('the-wedding-eve', 'postpone')]: 'Dire la phrase la plus dure qui soit',
  [roomChoiceOutcomeKey('the-wedding-eve', 'postpone', 0)]:
    "La phrase la plus courageuse disponible à cet étage, et son prix total : une matinée d'appels téléphoniques, d'acomptes perdus et de visages, tout payé publiquement.",
  [roomChoiceTextKey('the-wedding-eve', 'hold-the-cheap-ring')]:
    'Tenir, une fois, la bague en plastique bon marché de cette fête, à côté de la vraie, celle de demain.',
  [roomChoiceHintKey('the-wedding-eve', 'hold-the-cheap-ring')]: 'Un souvenir que tu portes sur toi depuis le rez-de-chaussée',
  [roomChoiceOutcomeKey('the-wedding-eve', 'hold-the-cheap-ring', 0)]:
    "Tu l'as encore — trente secondes à te faire chahuter, un plastique légèrement terni par le temps, gardé pour des raisons que tu n'as jamais vraiment examinées.",
  [roomChoiceOutcomeKey('the-wedding-eve', 'hold-the-cheap-ring', 1)]:
    "Tu as déjà refusé un défi, avec bien moins en jeu que ce soir. Vérifie, honnêtement, si demain en est un — et la réponse, quelle qu'elle soit, arrive plus doucement que tu ne l'attendais.",
  [roomExplanationKey('the-wedding-eve', 0)]:
    "Les recherches longitudinales de Lavner sur les doutes prénuptiaux ont trouvé quelque chose de précis et d'inconfortable : les doutes exprimés avant un mariage — surtout ceux de la mariée ou du ou de la partenaire au statut le plus bas — prédisent bel et bien une détresse conjugale et un divorce ultérieurs, mais, fait crucial, le risque se concentre dans les doutes qui restent inexaminés, pas dans ceux qu'on explore honnêtement. « Le trac » et « le vrai signal » forment une fausse dichotomie ; la question la plus utile porte sur le contenu, pas sur la température. Et le coût irrécupérable — acomptes payés, invitations envoyées — est un biais formellement défini pour une bonne raison : rien de tout cela n'est réellement une preuve que se marier demain avec cette personne est la bonne décision.",
  [roomNoteTitleKey('the-wedding-eve')]: 'L\'audit de deux heures du matin',
  [roomNoteThinkersKey('the-wedding-eve')]: 'Lavner (2012) · littérature sur le coût irrécupérable',
  [roomNoteBodyKey('the-wedding-eve')]:
    "Les études de Lavner sur le doute prénuptial sont assez précises pour être vraiment utiles : les doutes exprimés avant un mariage prédisent bel et bien un risque accru de détresse et de divorce ultérieurs — les tailles d'effet sont réelles mais modestes, et méritent d'être énoncées honnêtement plutôt que dramatisées. Le constat le plus important se cache sous ce titre : **le risque se concentre dans le doute qui reste inexaminé, pas dans celui qu'on explore honnêtement** — ce qui transforme le « trac » d'un verdict en une instruction. La distinction utile n'oppose pas douter de la personne à ne pas en douter ; il s'agit de trois questions distinctes, routinièrement confondues en un seul sentiment de deux heures du matin : douter de la personne, douter de l'institution du mariage elle-même, et douter de sa propre disponibilité à s'engager. Le costume te va. Ça n'a jamais été la question.",
});
register(roomBeatKey('the-wedding-eve', 0, 2), 'v2', 'fr', (s: RunState) =>
  seedSplit(s)
    ? "Le téléphone sonne. Une ancienne flamme, inattendue, à moitié désolée de l'heure."
    : "Le téléphone ne sonne pas. Personne n'appelle. C'est le doute qui compose le numéro à sa place, et qui continue de composer.",
);
register(roomChoiceOutcomeKey('the-wedding-eve', 'answer-the-flame', 0), 'v2', 'fr', (s: RunState) =>
  s.flags.includes('opened-the-archive') || s.flags.includes('answered-the-ex')
    ? "La conversation est chaleureuse, d'une chaleur d'archive — le même archiviste qu'il y a des années, qui continue en silence à supprimer les pires scènes, encore au travail la nuit précédant ton mariage."
    : "La conversation est chaleureuse, plus chaleureuse que l'heure ne devrait le permettre.",
);
register(roomChoiceOutcomeKey('the-wedding-eve', 'postpone', 1), 'v2', 'fr', (s: RunState) =>
  seedSplit2(s)
    ? "Sous la douleur sur le visage de Dana, montrée en dernier : un grain de soulagement indéniable — Dana, de son côté, avait ses propres questions, jamais dites jusqu'ici."
    : "Sous la douleur sur le visage de Dana, montrée en dernier : aucun soulagement, seulement de la douleur, pure et totale. La chambre laisse exister les deux versions du monde ; celle-ci est celle que tu as eue.",
);

// ---------- The Therapist ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-therapist', 0, 0)]:
    "Le cabinet du Dr Weiss, reconstitué à l'intérieur de l'hôtel jusqu'à la boîte de mouchoirs sur la table basse entre les deux fauteuils. En pleine séance. La dispute, mot pour mot, par fragments : quelque chose à propos du lave-vaisselle, qui n'a jamais vraiment été une histoire de lave-vaisselle.",
  [roomBeatKey('the-therapist', 0, 1)]:
    "Le Dr Weiss nomme le schéma sans désigner de coupable, comme seule une personne extérieure, payée pour être juste, peut y parvenir.",
  [roomBeatKey('the-therapist', 0, 2)]:
    'Quatre portes se dressent là où se trouvait le mur du cabinet, chacune surmontée d\'un seul mot : CRITIQUE. MÉPRIS. JUSTIFICATION. MUR. On te demande de franchir celle que tu empruntes toujours.',
  [roomBeatKey('the-therapist', 0, 3)]:
    "Chaque porte souffle une phrase quand tu passes près d'elle : la bonne conscience de la critique, le réconfort froid du mépris, le poids-bouclier de la justification, le silence assourdissant du mur.",
  [roomBeatKey('the-therapist', 0, 4)]:
    "Le Portier (en réceptionniste, pour une fois) : « Les client·e·s demandent toujours quelle porte est la pire. La recherche est sans sentiment : celle qui se moque. Mais tu vas emprunter la tienne. »",
  [roomChoiceTextKey('the-therapist', 'criticism')]: 'Franchir CRITIQUE.',
  [roomChoiceHintKey('the-therapist', 'criticism')]: '« tu fais toujours » / « tu ne fais jamais »',
  [roomChoiceOutcomeKey('the-therapist', 'criticism', 0)]: 'Derrière la porte : tes propres phrases en « tu fais toujours »/« tu ne fais jamais », rejouées sans commentaire.',
  [roomChoiceOutcomeKey('the-therapist', 'criticism', 1)]:
    "L'antidote, enseigné dans la fiction et pratiqué une fois, là, sur le lave-vaisselle réel : nommer un comportement précis plutôt qu'accuser une personne entière.",
  [roomChoiceTextKey('the-therapist', 'contempt')]: 'Franchir MÉPRIS.',
  [roomChoiceHintKey('the-therapist', 'contempt')]: 'Les yeux levés au ciel',
  [roomChoiceOutcomeKey('the-therapist', 'contempt', 0)]:
    "La porte des yeux levés au ciel. La recherche t'est lue avec douceur, mais sans rien t'épargner : sur les quatre, le mépris est de loin le meilleur prédicteur qu'une relation se termine.",
  [roomChoiceOutcomeKey('the-therapist', 'contempt', 1)]:
    "L'antidote, amorcé par un geste délibéré : une bonne chose précise, dont tu te souviens, à propos de Dana, dite à voix haute, là, maintenant.",
  [roomChoiceTextKey('the-therapist', 'defensiveness')]: 'Franchir JUSTIFICATION.',
  [roomChoiceHintKey('the-therapist', 'defensiveness')]: '« oui, mais… »',
  [roomChoiceOutcomeKey('the-therapist', 'defensiveness', 0)]: 'La porte de la contre-attaque. Ton propre chœur de « oui, mais… », rejoué en entier.',
  [roomChoiceOutcomeKey('the-therapist', 'defensiveness', 1)]:
    "L'antidote, exécuté une fois : assumer, à voix haute, une petite part sincère de responsabilité — et son effet disproportionné sur les épaules de Dana, visible, immédiat.",
  [roomChoiceTextKey('the-therapist', 'stonewalling')]: 'Franchir MUR.',
  [roomChoiceHintKey('the-therapist', 'stonewalling')]: 'Le silence assourdissant',
  [roomChoiceOutcomeKey('the-therapist', 'stonewalling', 1)]:
    "L'antidote : la pause annoncée — « j'ai besoin de vingt minutes, je reviens » — et le fait de vraiment revenir, montré comme la vraie compétence, celle qui s'apprend.",
  [roomExplanationKey('the-therapist', 0)]:
    "Les « quatre cavaliers » de John Gottman — critique, mépris, justification et mur du silence — sont des prédicteurs documentés de l'effondrement des relations, chacun avec un antidote précis, qui s'apprend : la plainte plutôt que la critique, le respect entretenu plutôt que le mépris, la prise de responsabilité plutôt que la défense, et une pause annoncée et respectée plutôt qu'un repli inexpliqué. La célèbre affirmation de Gottman, capable de prédire un divorce avec une précision frappante, a suscité une véritable critique méthodologique qu'il vaut la peine de mentionner en même temps : des analyses ultérieures ont remis en question les statistiques des études de prédiction originales — les quatre cavaliers sont donc à traiter comme une carte réellement utile des schémas destructeurs, pas comme une machine à prédire l'avenir.",
  [roomBeatKey('the-therapist', 1, 1)]: 'Une blague ratée, à un moment un peu mal choisi. Celle de Dana, offerte avec un aplomb visiblement forcé.',
  [roomExplanationKey('the-therapist', 1)]:
    "Les recherches de Gottman nomment aussi l'envers des quatre cavaliers : une « tentative de réparation » — un petit geste, souvent maladroit, qu'un·e partenaire fait au milieu d'une dispute pour désamorcer les choses, comme une blague ratée, des excuses, ou simplement une main tendue. Ce qui compte le plus, ce n'est pas la finesse de la tentative de réparation ; c'est de savoir si l'autre la saisit vraiment. Les couples qui restent heureux sur le long terme ne sont pas ceux qui ne se disputent jamais — la recherche trouve que ce sont ceux qui réussissent à accepter les tentatives de réparation de l'autre, même les plus maladroites, plutôt que de laisser la fierté prolonger la dispute un peu plus longtemps que nécessaire.",
  [roomChoiceTextKey('the-therapist', 'accept-the-repair')]: 'L\'accepter. Laisser la blague ratée faire son effet.',
  [roomChoiceHintKey('the-therapist', 'accept-the-repair')]: 'Prendre la main tendue',
  [roomChoiceOutcomeKey('the-therapist', 'accept-the-repair', 0)]:
    "La pièce s'allège d'une quantité vraiment mesurable. Pas une résolution — une réparation. Les deux ne sont pas la même chose, et la chambre veille à la différence.",
  [roomChoiceTextKey('the-therapist', 'miss-the-repair')]: 'La laisser passer. Rester dans la dispute.',
  [roomChoiceHintKey('the-therapist', 'miss-the-repair')]: 'Laisser passer le moment',
  [roomChoiceOutcomeKey('the-therapist', 'miss-the-repair', 0)]:
    "La chambre montre, sans détour, ce que coûte le fait d'en laisser passer une : pas une catastrophe, juste un pont de moins, dans une dispute qui en aurait bien eu besoin.",
  [roomNoteTitleKey('the-therapist')]: 'Quatre portes et une blague ratée',
  [roomNoteThinkersKey('the-therapist')]: 'Gottman (1994) · Christensen (1990)',
  [roomNoteBodyKey('the-therapist')]:
    "Les quatre cavaliers de Gottman — critique, mépris, justification, mur du silence — comptent parmi les résultats les plus cités de la recherche relationnelle, chacun associé à un antidote précis, qui s'apprend, plutôt qu'à un verdict de caractère. La célèbre affirmation d'une prédiction du divorce quasi parfaite à partir de courtes interactions observées a depuis suscité une critique statistique publiée — des réanalyses ultérieures ont remis en question certains aspects de la méthodologie des études originales — et la présentation honnête garde les deux faits en vue à la fois : une carte diagnostique réellement utile, pas un oracle. **Les tentatives de réparation, et non l'absence de conflit, sont le vrai résultat porteur de Gottman** — les couples heureux se disputent bel et bien ; ils se tendent simplement la main, et se laissent atteindre, beaucoup plus souvent, en pleine dispute. Les recherches de Christensen sur la poursuite et le retrait ajoutent une symétrie à retenir : la personne qui poursuit et celle qui se tait ont généralement peur toutes les deux, juste dans des directions opposées. La boîte de mouchoirs est bien réelle. Les portes ont toujours été dans la pièce ; le cabinet a juste un meilleur éclairage.",
});
register(roomChoiceOutcomeKey('the-therapist', 'stonewalling', 0), 'v2', 'fr', (s: RunState) =>
  s.flags.includes('played-detective') || s.flags.includes('chose-not-to-know')
    ? "La porte la plus silencieuse — à l'intérieur, la même physiologie que dans la cuisine, sur le comptoir, avec le téléphone : la submersion, recoupée par la chambre sans qu'il faille le lui dire deux fois."
    : "La porte la plus silencieuse — à l'intérieur, la submersion propre au corps, nommée et expliquée : le repli est un événement autant physiologique qu'émotionnel.",
);
register(roomBeatKey('the-therapist', 1, 0), 'v2', 'fr', (s: RunState) =>
  s.flags.includes('door-contempt')
    ? "Le Dr Weiss propose une tentative de réparation — petite, et, parce qu'elle vient de Dana, imparfaite exprès. Après le mépris que tu viens de traverser, elle frappe plus fort qu'elle ne l'aurait fait autrement."
    : "Le Dr Weiss propose une tentative de réparation : petite et imparfaite, parce que c'est exactement à ça que ressemblent les vraies tentatives de réparation.",
);

// ---------- The Usual Suite ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-usual-suite', 0, 0)]:
    "Une porte basse donnant sur le couloir de l'aile longue durée, facile à manquer. Derrière : ta suite, sans équivoque possible, même si, en réalité, tu n'y as jamais mis les pieds.",
  [roomBeatKey('the-usual-suite', 0, 1)]: 'Un mur, éclairé par-derrière. Des silhouettes, qui attendent.',
  [roomBeatKey('the-usual-suite', 0, 5)]:
    "Le Portier : « Je n'attribue pas cette chambre. Le registre se remplit tout seul. Elle n'apparaît jamais que pour les client·e·s à leur deuxième séjour. J'ai arrêté de demander pourquoi. Le registre, lui, n'a pas arrêté de répondre : parce que maintenant, ils peuvent la voir. »",
  [roomChoiceTextKey('the-usual-suite', 'name-them')]: '« Je vous reconnais. » Dire, à voix haute, à qui appartiennent ces choix.',
  [roomChoiceHintKey('the-usual-suite', 'name-them')]: 'Nommer ce que tu regardes',
  [roomChoiceOutcomeKey('the-usual-suite', 'name-them', 0)]:
    "Tu le dis — pas un nom emprunté à quelqu'un d'autre, mais le petit nom vrai, celui que tu as utilisé sur toi-même, en privé, la première fois.",
  [roomChoiceOutcomeKey('the-usual-suite', 'name-them', 1)]:
    "Le mur s'assombrit ensuite, comme un feu qui se calme une fois qu'on lui a donné exactement ce qu'il voulait.",
  [roomChoiceTextKey('the-usual-suite', 'watch-silent')]: 'Regarder sans parler. Laisser les silhouettes finir.',
  [roomChoiceHintKey('the-usual-suite', 'watch-silent')]: 'Être témoin sans commenter',
  [roomChoiceOutcomeKey('the-usual-suite', 'watch-silent', 0)]:
    "Tu ne dis rien. Les silhouettes achèvent leurs petites scènes exactes sans ta correction, sans ta permission.",
  [roomChoiceOutcomeKey('the-usual-suite', 'watch-silent', 1)]:
    'C\'est plus facile ainsi, et tu remarques cette facilité, et tu remarques que tu la remarques.',
  [roomChoiceTextKey('the-usual-suite', 'ask-who-books-it')]: 'Demander directement au Portier : qui réserve cette chambre ?',
  [roomChoiceHintKey('the-usual-suite', 'ask-who-books-it')]: 'Interroger la réception elle-même',
  [roomChoiceOutcomeKey('the-usual-suite', 'ask-who-books-it', 0)]:
    '« Toi », dit le Portier. « À chaque fois. C\'est la seule réservation que la réception n\'a jamais besoin de confirmer. »',
  [roomExplanationKey('the-usual-suite', 0)]:
    "Cette chambre n'apparaît qu'après un premier séjour à l'Interval, et elle emprunte l'allégorie de la caverne de Platon : elle te montre tes propres choix passés sous forme d'ombres et te demande simplement de regarder, honnêtement, le motif qu'ils dessinent. La compulsion de répétition — la tendance à recréer inconsciemment des dynamiques familières, même douloureuses — est réelle, bien documentée et, surtout, n'est pas une condamnation à perpétuité : la recherche sur la « sécurité acquise » trouve que ce schéma est réellement révisable, et en être témoin sans détour, sans se dérober, en est systématiquement la première étape.",
  [roomNoteTitleKey('the-usual-suite')]: 'La réservation permanente',
  [roomNoteThinkersKey('the-usual-suite')]: 'littérature sur la compulsion de répétition, traitée avec précaution',
  [roomNoteBodyKey('the-usual-suite')]:
    "Le concept a une histoire clinique compliquée et une lecture moderne plus sobre, qu'il vaut mieux privilégier : ce qui ressemble au destin est habituellement une stratégie relationnelle apprise, qui se rejoue parce qu'elle a fonctionné une fois et n'a jamais été consciemment révisée. **Être témoin d'un schéma sans détour, sans le juger ni l'excuser aussitôt, est l'étape documentée, la première, pour vraiment le changer** — pas une métaphore empruntée à la thérapie, mais un résultat qui en vient. Le mur est fin, à dessein. Tous les murs porteurs le sont.",
});
register(roomBeatKey('the-usual-suite', 0, 2), 'v2', 'fr', (s: RunState) => {
  const moments = pickShadowMoments(s.prior);
  const first = moments[0];
  return first
    ? `Une silhouette sur le mur fait exactement ce que tu as fait un jour, dans une chambre avec un autre numéro sur la porte : « ${first.choiceText} »`
    : "Une silhouette sur le mur bouge, patiente, en attente d'un choix qu'elle connaît déjà.";
});
register(roomBeatKey('the-usual-suite', 0, 3), 'v2', 'fr', (s: RunState) => {
  const moments = pickShadowMoments(s.prior);
  const middle = moments[1];
  return middle
    ? `Une autre silhouette, en pleine scène : « ${middle.choiceText} » Ce n'est pas semblable à ce dont tu te souviens avoir fait. C'est exactement cela.`
    : 'Une autre silhouette, en pleine scène, dans une chambre que tu ne reconnais pas tout à fait et que, pourtant, tu reconnais déjà.';
});
register(roomBeatKey('the-usual-suite', 0, 4), 'v2', 'fr', (s: RunState) => {
  const moments = pickShadowMoments(s.prior);
  const last = moments[2];
  return last
    ? `La dernière silhouette, la plus proche de la lumière : « ${last.choiceText} » Tu reconnais ta propre posture dans l'ombre avant de reconnaître le choix.`
    : 'La dernière silhouette, la plus proche de la lumière, tient une posture que tu reconnais avant même de savoir pourquoi.';
});

// ---------- The Usual Room (gate) ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-usual-room', 0, 0)]:
    "Le Portier a écrit à l'avance l'attribution de la chambre pour ce soir. Il ne s'est jamais trompé, pas une seule fois. Même étage, même angle, même vue sur le puits d'aération — la chambre que tu prends toujours.",
  [roomBeatKey('the-usual-room', 0, 2)]:
    'Par instinct, tu tends la main vers une autre clé. Le tableau porte une petite note imprimée à côté du crochet : « tendra d\'abord la main vers la 4B — pour tester. »',
  [roomBeatKey('the-usual-room', 0, 3)]: "Un instant complet de panique à l'idée d'être prévisible, avant même tout le reste. La chambre le laisse s'installer.",
  [roomBeatKey('the-usual-room', 0, 4)]: "Une distinction, proposée plutôt qu'imposée : être prévisible n'équivaut pas automatiquement à ne pas être libre.",
  [roomBeatKey('the-usual-room', 0, 5)]: "Le Portier : « Je ne prédis pas les client·e·s. Je lis l'écriture. La tienne est lisible. Ce n'est pas la même chose qu'achevée. »",
  [roomChoiceTextKey('the-usual-room', 'defiant-different')]: 'Exiger une autre chambre. N\'importe quelle autre chambre.',
  [roomChoiceHintKey('the-usual-room', 'defiant-different')]: "Refuser l'attribution par principe",
  [roomChoiceOutcomeKey('the-usual-room', 'defiant-different', 0)]:
    "La nouvelle chambre, habitée avec défi. Assez confortable, assez étrangère pour ressembler à une déclaration.",
  [roomChoiceOutcomeKey('the-usual-room', 'defiant-different', 1)]:
    'La ligne suivante du tableau se déplie quand même pour toi : « le défi — le trait le plus lisible de cette écriture. » La rébellion, il s\'avère, est le déguisement préféré du schéma.',
  [roomChoiceTextKey('the-usual-room', 'refuse-all-rooms')]: 'Dormir dans le hall. Se retirer complètement du registre.',
  [roomChoiceHintKey('the-usual-room', 'refuse-all-rooms')]: 'Refuser de participer',
  [roomChoiceOutcomeKey('the-usual-room', 'refuse-all-rooms', 0)]:
    'Le tableau, retourné, disait depuis le début : « tentera le hall — durée estimée : une nuit. »',
  [roomChoiceOutcomeKey('the-usual-room', 'refuse-all-rooms', 1)]: "L'abstention, il s'avère, est aussi un coup. Le Portier apporte une couverture sans commentaire.",
  [roomChoiceTextKey('the-usual-room', 'take-it-knowingly')]:
    'Prendre la chambre habituelle — exprès. « Ça allait toujours être cette chambre, et je la choisis. »',
  [roomChoiceHintKey('the-usual-room', 'take-it-knowingly')]: 'S\'approprier le schéma plutôt que le combattre',
  [roomChoiceOutcomeKey('the-usual-room', 'take-it-knowingly', 0)]:
    'La même clé, tournée cette fois par une main différente. « Le schéma passe à travers le choix, » dit le Portier, « pas autour de lui. »',
  [roomChoiceOutcomeKey('the-usual-room', 'take-it-knowingly', 1)]: 'Ce qui, chez lui, ressemble le plus à un sourire. Le portail s\'ouvre.',
  [roomChoiceTextKey('the-usual-room', 'room-with-no-number')]: 'Demander la chambre sans numéro.',
  [roomChoiceHintKey('the-usual-room', 'room-with-no-number')]: 'Demander l\'option qui ne figure pas sur le tableau',
  [roomChoiceOutcomeKey('the-usual-room', 'room-with-no-number', 0)]: 'Une telle chambre existe. Un placard à linge, avec une chaise dedans, tout à fait quelconque.',
  [roomChoiceOutcomeKey('the-usual-room', 'room-with-no-number', 1)]:
    '« Les client·e·s qui demandent la chambre sans numéro sont sur le tableau aussi », remarque le Portier : « choisira le mystère plutôt que le sens ; prend la couverture de secours. » Un menu avec un « aucune de ces réponses » dessus reste, il faut le noter, un menu.',
  [roomExplanationKey('the-usual-room', 0)]:
    "Les recherches sur l'attachement trouvent une réelle continuité — les schémas appris tôt persistent, mesurablement, à travers différentes relations et différentes années, ce qui peut ressembler à une condamnation à perpétuité la première fois qu'on le découvre. La même littérature documente aussi la « sécurité acquise » : des personnes qui évoluent vers des schémas plus stables, généralement grâce à des relations ou une thérapie qui survivent à assez d'épreuves honnêtes pour réviser réellement le modèle sous-jacent. Prévisible et libre se lisent mieux comme des descriptions opérant à deux altitudes différentes que comme des opposés — un choix peut être à la fois anticipé par le schéma et, réellement, ici et maintenant, le tien.",
  [roomNoteTitleKey('the-usual-room')]: 'Une écriture lisible',
  [roomNoteThinkersKey('the-usual-room')]: "études sur la continuité de l'attachement · recherches sur la sécurité acquise",
  [roomNoteBodyKey('the-usual-room')]:
    "Les recherches longitudinales sur l'attachement trouvent une réelle continuité dans les deux sens : les schémas précoces prédisent le comportement relationnel ultérieur avec une fiabilité mesurable, et — tout aussi mesurable — les personnes évoluent vers une « sécurité acquise » à travers des relations et des expériences qui survivent à assez d'épreuves honnêtes pour réviser réellement le modèle sous-jacent. **Prévisible et libre ne sont pas des opposés ; ce sont des descriptions qui fonctionnent à deux altitudes différentes du même choix.** Le cadre compatibiliste emprunté ici, avec attribution, à l'aile philosophique d'un autre hôtel un peu plus loin dans le couloir : tu allais toujours lire cette note. Tu viens aussi de choisir de le faire. Deux entrées, un seul registre.",
});
register(roomBeatKey('the-usual-room', 0, 1), 'v2', 'fr', (s: RunState) =>
  (s.prior?.runs ?? 0) >= 1
    ? "L'historique, ouvert dans le registre : chaque séjour précédent, chaque attribution, toutes exactes — tu peux voir ta propre écriture dans la marge, d'avant."
    : "L'historique, ouvert dans le registre, en attente de sa première entrée — ce soir sera la première ligne, et le Portier semble déjà savoir, en gros, ce qu'elle dira.",
);
