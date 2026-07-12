// French translation of LIMERENCE's Understory room prose (beats, choice
// text/hint/outcome, field notes, plain-language explanations). Registered
// under version 'v2'. Follows the structural pattern established by
// fr-rooms.ts (prologue/Act I), fr-rooms-act2.ts (Act II), fr-rooms-act3.ts
// (Act III), and fr-rooms-act4.ts (Act IV) — see CLAUDE.md's "Translating
// content" rule: every line here was translated against the room's actual
// beats and each choice's stakes, not word-for-word. The Understory is the
// optional secret-branch epilogue reached via the stairs behind the front
// desk on a returning guest's second run — LIMERENCE's own mirror of
// ANAMNESIS's Act V — and its register is quieter and more archival than Act
// IV's checkout floor: a records office, a corridor of unopened doors, a
// room with a second chair.
//
// tu/vous decision: informal "tu" throughout, continuing every prior act's
// (and fr-rooms-act4.ts's) choice.
//
// "The Porter" remains "Le Portier", per the established project
// convention — distinct from ANAMNESIS's own French guide-character word
// (never named here, including in this comment; verified absent, grep count
// zero, from both this file and fr-reflections-understory.ts). The Porter is
// gendered explicitly in the English source here too — the-registry's beat4
// stage direction ("hat under his arm") is the same established fact
// fr-rooms-act4.ts's header already cites — so this file uses "il"/"son" for
// him, no judgment call needed.
//
// Partner/former-self gender-neutrality: unlike Act III's Dana or Act II's
// Jules, no recurring partner character reappears anywhere in the
// Understory to raise the question fr-rooms-act3.ts's header addresses.
// The-other-side's "voice" in the second chair is explicitly not a person
// but a reconstruction of the player's own former self ("Not by a
// person... but by a voice"), and the English source already treats it with
// the genderless "it". This file keeps that same non-personhood by naming
// it "la voix" (a feminine noun, but referring to a thing, not asserting
// anything about a human referent) and having every subsequent pronoun track
// "la voix" grammatically, exactly parallel to how "elle" already tracks "la
// chambre"/"la pièce" elsewhere in this pack, and to de-rooms-understory.ts's
// identical reasoning for German "die Stimme"/"sie". Where the English
// addresses the player's former self directly ("who you were"), this file
// uses the noun construction "qui tu étais" or "ton ancien toi" rather than
// a gendered third-person pronoun — same spirit as fr-rooms-act3.ts's
// "la personne" strategy, applied to a self rather than a partner.
//
// Callback to Act I's the-rumor: otherSideGateBeat's two branches reference
// choices already translated in fr-rooms.ts (the-rumor's 'set-the-trap' and
// 'trust-without-asking') — "le piège" and "le lac" are reused verbatim from
// that file's own vocabulary (the-rumor's beat0 names "le week-end au lac";
// 'set-the-trap' is rendered there as "tendre un piège") so this room's echo
// reads as the same memory recalled, not a re-description in new words. Sara
// is unambiguously gendered feminine throughout fr-rooms.ts's the-rumor, so
// "elle" here carries no judgment call.
//
// Field-note thinkers lines: proper-name citations (with years) are carried
// through unchanged (Kierkegaard (1844), Frost (1916)); the descriptive
// gloss around a citation is translated, matching fr-rooms-act3.ts's
// "Glass (2003) (murs numériques)" precedent. Purely descriptive lines with
// no year (e.g. "perspective-taking research") are translated in full,
// matching fr-rooms-act4.ts's "recherches sur l'écriture expressive
// (tradition Pennebaker)" pattern.
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
import { choseInPrior, pickExhibitEntry, pickShadowMoments, pickUnchosenRooms } from '../../../engine/gameState';
import { ENDING_TITLE_BY_ID, ROOM_TITLE_BY_ID } from '../rooms/understory';

/** Mirrors understory.ts's own LIMERENCE_ACT_POOLS, verbatim — needed here
 * only for the-doors-not-opened's "unchosen rooms" lookup, exactly as
 * de-rooms-understory.ts already does. */
const LIMERENCE_ACT_POOLS: Record<1 | 2 | 3, string[]> = {
  1: ['the-read-receipt', 'the-screenshot', 'the-password', 'the-party', 'the-forward', 'the-best-friends-girl', 'the-summer-ends'],
  2: ['the-distance', 'the-hall-pass', 'the-rebound', 'the-unicorn', 'just-friends', 'the-ex', 'the-confession', 'the-other-side-of-the-door'],
  3: ['the-colleague', 'the-metamour', 'the-veto', 'the-drift', 'the-second-account', 'the-discovery', 'the-wedding-eve', 'the-therapist', 'the-usual-suite'],
};

// ---------- The Registry ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-registry', 0, 0)]:
    'Un escalier derrière le comptoir, que tu aurais juré ne pas être là à l\'enregistrement. En bas : une salle longue et basse, des rayonnages de dossiers gris identiques qui s\'étendent plus loin que le plafond ne devrait le permettre.',
  [roomBeatKey('the-registry', 0, 1)]:
    'Un rayonnage porte un dossier plus récent, un seul : le tien. Tamponné, sous une date que tu reconnais comme une fin : CLASSÉ. ARCHIVÉ. PAS OUBLIÉ.',
  // beat2 is a function beat — registered below via register().
  [roomBeatKey('the-registry', 0, 3)]:
    'Agrafée à la fiche d\'admission, la description que tu as un jour donnée de toi-même, mot pour mot : « {blurb} » Classée sans commentaire — respect, ou erreur de classement. D\'ici, vu d\'en bas, les deux se ressemblent.',
  [roomBeatKey('the-registry', 0, 4)]:
    'Le Portier (dans l\'embrasure, chapeau sous le bras) : « Je descends rarement ici. Rien n\'y est interdit. La plupart des clients ne veulent visiter qu\'une fois, tout au plus. Ça ne fait aucune différence pour le registre. Il n\'a nulle part ailleurs où être. »',
  [roomChoiceTextKey('the-registry', 'sign-it')]: '« C\'était moi. Je l\'assume — tout entier. » Signe la fiche toi-même.',
  [roomChoiceHintKey('the-registry', 'sign-it')]: 'L\'assumer, la plus difficile des signatures',
  [roomChoiceOutcomeKey('the-registry', 'sign-it', 0)]:
    'Tu prends le stylo enchaîné au rayonnage et signes sous la ligne tapée à la machine, de ta propre main, que le dossier semblait attendre.',
  [roomChoiceOutcomeKey('the-registry', 'sign-it', 1)]:
    'Le Portier : « Tous les clients ne signent pas. Tu viens d\'ajouter ton nom à une nuit déjà arrivée. J\'ignore ce que ça coûte. Je sais que ce n\'est pas rien. »',
  [roomChoiceTextKey('the-registry', 'disown-it')]: '« Ça ne me ressemble plus, aujourd\'hui. » Laisse la fiche non signée.',
  [roomChoiceHintKey('the-registry', 'disown-it')]: 'Laisser la distance être réelle, pas seulement confortable',
  [roomChoiceOutcomeKey('the-registry', 'disown-it', 0)]:
    'Tu laisses la fiche exactement telle que tu l\'as trouvée et recules d\'un pas, comme on recule devant un inconnu qui porte, par hasard, ton manteau.',
  [roomChoiceOutcomeKey('the-registry', 'disown-it', 1)]:
    'Le Portier : « Le dossier ne discute pas. Il garde seulement ce qui est arrivé — que la main qui l\'a fait réponde encore à ton nom, ou non. »',
  [roomChoiceTextKey('the-registry', 'refile-unjudged')]: 'Referme le dossier doucement, en plein milieu d\'une phrase, sans commentaire ni dans un sens ni dans l\'autre.',
  [roomChoiceHintKey('the-registry', 'refile-unjudged')]: 'Ni le défendre ni le renier — le classer',
  [roomChoiceOutcomeKey('the-registry', 'refile-unjudged', 0)]:
    'Tu refermes le dossier comme on referme un livre en plein chapitre, par respect plutôt que par accord, et le replaces sur le rayonnage.',
  [roomChoiceOutcomeKey('the-registry', 'refile-unjudged', 1)]:
    'Le Portier : « Ça, je crois, c\'est la véritable fonction de ce rayonnage. Pas un verdict — un endroit où poser quelque chose sans avoir à avoir fini de décider ce que c\'était. »',
  [roomChoiceTextKey('the-registry', 'pin-the-keycard')]: 'Épingle l\'ancienne carte-clé au bord du dossier ouvert — un ajout au dossier.',
  [roomChoiceHintKey('the-registry', 'pin-the-keycard')]: 'La preuve que le couloir a existé, et qu\'on l\'a quitté',
  [roomChoiceOutcomeKey('the-registry', 'pin-the-keycard', 0)]:
    'Tu presses la carte-clé désactivée contre le dossier jusqu\'à ce qu\'elle tienne — preuve à la fois que le couloir a existé, et que tu l\'as quitté.',
  [roomChoiceOutcomeKey('the-registry', 'pin-the-keycard', 1)]:
    'Le registre l\'accepte, exactement comme les registres acceptent tout : sans commentaire, sans objection, et, tu le remarques, sans jamais en avoir eu besoin.',
  [roomExplanationKey('the-registry', 0)]:
    'On te montre un compte rendu classé et daté d\'une décision prise lors de ton dernier séjour ici, relu à froid, sans rien du contexte qui la rendait raisonnable sur le moment. L\'assumes-tu encore, t\'en distancies-tu, ou acceptes-tu que c\'est arrivé sans la juger tout à fait dans un sens ou dans l\'autre ? Il s\'agit de la façon dont on se rapporte à ses propres choix passés une fois que le temps a passé — comme relire un vieux message sans être tout à fait sûr que la personne qui l\'a envoyé et celle qui le lit maintenant sont bien la même.',
  [roomNoteTitleKey('the-registry')]: 'De la tenue des dossiers',
  [roomNoteThinkersKey('the-registry')]: 'identité narrative (écho de Ricœur, transversal aux titres)',
  [roomNoteBodyKey('the-registry')]:
    'Paul Ricœur soutenait qu\'un soi n\'est pas une chose que l\'introspection localise, mais un récit tenu en révision continue — sa permanence ne tenant pas à ne jamais changer, mais à pouvoir changer et continuer d\'appeler ça la même histoire. Cette salle met en scène la confrontation même que sa théorie était censée survivre : un acte précis, daté, classé, relu à froid, sans les chapitres environnants qui le rendaient inévitable sur le moment. L\'assumer, le renier et le classer sans jugement sont trois rapports différents à sa propre paternité, et la réponse de Ricœur lui-même est plus proche du troisième que de l\'un ou l\'autre des deux premiers. **Tu n\'es pas obligé d\'approuver chaque nuit du dossier. Seulement d\'admettre de quelle main elle vient.**',
});
register(roomBeatKey('the-registry', 0, 2), 'v2', 'fr', (s: RunState) => {
  const entry = pickExhibitEntry(s.prior?.transcript ?? []);
  if (!entry) {
    return 'La fiche dans le dossier ouvert est vierge, son coin taché d\'eau — quoi que ce dossier ait un jour contenu, ça n\'a pas survécu au trajet jusqu\'ici. Le reste du rayonnage, lui au moins, reste lisible.';
  }
  return `La fiche porte, de ta propre main : « ${entry.choiceText} » Aucun autre commentaire. Le registre n\'éditorialise pas. Il conserve, c\'est tout.`;
});

// ---------- The Doors Not Opened ----------
registerAll('v2', 'fr', {
  [roomBeatKey('the-doors-not-opened', 0, 0)]:
    'Un couloir maintenu à température, bordé de portes légèrement entrouvertes — pas de façon accueillante. Simplement ouvertes, comme une porte le reste quand personne n\'a pris la peine de la fermer depuis très longtemps.',
  [roomBeatKey('the-doors-not-opened', 0, 1)]:
    'Ce sont les portes de ton dernier séjour que tu n\'as jamais franchies. Non foulées, indécises, techniquement encore disponibles — de la même façon qu\'un train manqué reste, techniquement, un train.',
  // beats 2 and 3 are function beats — registered below via register().
  [roomBeatKey('the-doors-not-opened', 0, 4)]:
    'Le Portier : « Je ne lirais pas trop dans celle-là en particulier. Ou alors si, entièrement — je n\'ai jamais réussi à décider lequel des deux conseils est pire. Et je vais te dire la chose honnête que cet étage ne dit pas toujours à voix haute : la liaison que tu n\'as pas eue est parfois une porte qui ne t\'a jamais été offerte. Rester close n\'est pas automatiquement une vertu. »',
  [roomChoiceTextKey('the-doors-not-opened', 'enter-late')]: 'Pousse-la jusqu\'au bout. Entre.',
  [roomChoiceHintKey('the-doors-not-opened', 'enter-late')]: 'La curiosité, honorée tard',
  // outcome0 is a function beat — registered below via register().
  [roomChoiceOutcomeKey('the-doors-not-opened', 'enter-late', 1)]:
    'Quoi qu\'il ait dû se passer ici, c\'est déjà arrivé, ou pas, ou la question s\'est simplement périmée, comme un courrier non ouvert finit par cesser d\'être urgent. C\'est plus petit que ce que tu en avais fait. La plupart des choses non vécues le sont.',
  [roomChoiceTextKey('the-doors-not-opened', 'close-it')]: 'Referme-la complètement. Certaines portes sont, honnêtement, mieux en restant des portes.',
  [roomChoiceHintKey('the-doors-not-opened', 'close-it')]: 'Respecter que c\'est du passé',
  [roomChoiceOutcomeKey('the-doors-not-opened', 'close-it', 0)]:
    'Tu la repousses doucement, comme on referme la porte d\'une chambre où quelqu\'un dort enfin, vraiment.',
  [roomChoiceOutcomeKey('the-doors-not-opened', 'close-it', 1)]:
    'L\'instinct juste, sans doute. Toute porte non ouverte n\'était pas un regret en attente.',
  [roomChoiceTextKey('the-doors-not-opened', 'ask-why-now')]: '« Pourquoi tu t\'es rouverte, justement maintenant ? » Interroge la porte elle-même.',
  [roomChoiceHintKey('the-doors-not-opened', 'ask-why-now')]: 'Interroger l\'offre, pas seulement la pièce',
  [roomChoiceOutcomeKey('the-doors-not-opened', 'ask-why-now', 0)]:
    'Pas vraiment de réponse — les portes, même ici, ne sont pas d\'un naturel bavard — mais les gonds sont fraîchement huilés. Quelqu\'un voulait que cette porte bouge facilement ce soir, précisément.',
  [roomChoiceOutcomeKey('the-doors-not-opened', 'ask-why-now', 1)]:
    'Le Portier : « Ma meilleure hypothèse : le sous-sol t\'offre la porte que tu es maintenant prêt à survivre à ne pas ouvrir. Il ne m\'a jamais expliqué son minutage non plus, à moi. »',
  [roomExplanationKey('the-doors-not-opened', 0)]:
    'On te montre les portes devant lesquelles tu es passé sans les ouvrir lors de ton dernier séjour — des chemins jamais pris, désormais à jamais inconnus. L\'une d\'elles grince et se rouvre d\'elle-même. C\'est l\'attrait du « chemin non pris » : regardes-tu enfin, maintenant que ça ne te coûte plus rien ? Ce jeu ajoute une correction honnête à la version populaire : la liaison que tu n\'as pas eue est parfois une porte qui ne t\'a jamais été offerte, pas une vertu que tu as méritée — rester fermé et ne jamais avoir été tenté ne sont pas le même exploit.',
  [roomNoteTitleKey('the-doors-not-opened')]: 'Le chemin non pris, vérifié',
  [roomNoteThinkersKey('the-doors-not-opened')]: 'Kierkegaard (1844) — le vertige du possible · Frost (1916) — mal lu, corrigé',
  [roomNoteBodyKey('the-doors-not-opened')]:
    'Kierkegaard appelait la possibilité la chose la plus vertigineuse offerte à une personne — plus vertigineuse que n\'importe quel danger réel, parce que le réel est fini tandis que le possible se multiplie sans limite tant qu\'on reste devant une bifurcation à refuser de choisir. Le poème de Frost, « The Road Not Taken », est mal cité à presque chaque remise de diplômes comme un hymne à l\'audace de la divergence, mais le poème lui-même est plus rusé : les deux chemins sont, comme le confesse le locuteur deux strophes plus tôt, usés « à peu près pareil » — le soupir nostalgique de la fin s\'avoue d\'avance comme une histoire remodelée par le recul, pas une vérité rapportée depuis la bifurcation elle-même. **Réappliqué aux relations : la personne que tu n\'as pas choisie est une rumeur, pas un reçu.** Les portes de ce couloir n\'ont jamais été secrètement meilleures. Elles étaient simplement, brièvement, possibles — et la possibilité, une fois refermée, ne garde aucun de ses reçus, seulement ses rumeurs.',
});
register(roomBeatKey('the-doors-not-opened', 0, 2), 'v2', 'fr', (s: RunState) => {
  const { candidates } = pickUnchosenRooms(s.prior, LIMERENCE_ACT_POOLS);
  if (candidates.length === 0) {
    return 'Le couloir est étrangement dégagé ce soir — chaque porte que tu aurais pu manquer, tu ne l\'as apparemment pas manquée. Ou le souvenir ne survit pas au trajet jusqu\'ici.';
  }
  const titles = candidates.map((id) => ROOM_TITLE_BY_ID[id] ?? id);
  return `Trois attirent d\'abord ton regard : ${titles.join(', ')}. Tu ne te souviens d\'aucune d\'elles s\'étant ouverte. Tu es maintenant à peu près sûr qu\'au moins une t\'a été offerte — et que tu es passé devant.`;
});
register(roomBeatKey('the-doors-not-opened', 0, 3), 'v2', 'fr', (s: RunState) => {
  const { opens } = pickUnchosenRooms(s.prior, LIMERENCE_ACT_POOLS);
  if (!opens) {
    return 'Aucune porte en particulier ne se distingue ce soir. Le couloir reste entièrement fermé, et ça, d\'une certaine façon, c\'est déjà une réponse.';
  }
  const title = ROOM_TITLE_BY_ID[opens] ?? opens;
  return `Une porte, près du bout, s\'ouvre d\'elle-même jusqu\'au bout — ${title}. Ce qui attendait derrière attend toujours, apparemment.`;
});
register(roomChoiceOutcomeKey('the-doors-not-opened', 'enter-late', 0), 'v2', 'fr', (s: RunState) => {
  const { opens } = pickUnchosenRooms(s.prior, LIMERENCE_ACT_POOLS);
  const title = opens ? (ROOM_TITLE_BY_ID[opens] ?? opens) : 'la pièce';
  return `Tu franchis le seuil, dans ${title} — ou ce qu\'il en reste. Pas de crise en plein milieu d\'une phrase, personne qui attend. Juste une pièce, meublée, un peu poussiéreuse, qui ne fait rien de particulier.`;
});

// ---------- The Other Side ----------
const ECHO_EMPTY_FALLBACK_FR =
  'L\'autre chaise ne dit rien. Cette fois, il n\'y a rien d\'enregistré à partir de quoi assembler une voix — et la pièce, à son crédit, ne fait pas semblant du contraire.';

registerAll('v2', 'fr', {
  [roomBeatKey('the-other-side', 0, 0)]:
    'Une pièce nue. Deux chaises, face à face, assez proches pour que quiconque s\'assoit sur l\'une ou l\'autre soit manifestement destiné à être entendu.',
  [roomBeatKey('the-other-side', 0, 1)]:
    'L\'autre chaise est occupée. Pas par une personne — la pièce est précise là-dessus, précise comme seul peut l\'être un lieu qui n\'a rien à gagner à mentir — mais par une voix, assemblée à partir de ce que tu as dit et choisi lors de ton dernier séjour ici.',
  // beats 2, 3 and 4 are function beats — registered below via register().
  [roomBeatKey('the-other-side', 0, 5)]: 'Le Portier : « Celle-ci, je ne m\'y assois pas. Quoi que vous deux fassiez là-dedans, ça n\'a jamais été à moi de l\'arbitrer. »',
  [roomChoiceTextKey('the-other-side', 'answer-yourself')]: '« Je t\'entends. » Parle à qui tu étais.',
  [roomChoiceHintKey('the-other-side', 'answer-yourself')]: 'Une reconnaissance, pas une correction',
  [roomChoiceOutcomeKey('the-other-side', 'answer-yourself', 0)]:
    'Tu le dis — pas une correction, pas des excuses, juste une reconnaissance, comme on salue quelqu\'un sur le pas d\'une porte sans être sûr qu\'il te reconnaîtrait encore.',
  [roomChoiceOutcomeKey('the-other-side', 'answer-yourself', 1)]:
    'L\'autre chaise ne répond pas vraiment. Mais quelque chose dans la pièce s\'apaise, comme une respiration retenue qu\'on relâche enfin exprès, à deux au lieu d\'une seule.',
  [roomChoiceTextKey('the-other-side', 'let-yourself-finish')]: 'Assieds-toi en face et ne dis rien. Laisse-la finir, cette fois, sans l\'interrompre.',
  [roomChoiceHintKey('the-other-side', 'let-yourself-finish')]: 'L\'écoute ininterrompue que tu n\'as peut-être jamais accordée à personne',
  [roomChoiceOutcomeKey('the-other-side', 'let-yourself-finish', 0)]:
    'Tu la laisses parler, jusqu\'au bout, sans corriger un seul mot — ce qui, tu le remarques, n\'a pas toujours été le cas la première fois non plus.',
  [roomChoiceOutcomeKey('the-other-side', 'let-yourself-finish', 1)]:
    'Le silence n\'est pas vide. C\'est, s\'il faut trancher, la chose la plus complète qui ait été dite dans cette pièce.',
  [roomChoiceTextKey('the-other-side', 'sit-in-both-chairs')]: '« Il n\'y a jamais eu personne d\'autre ici. » Assieds-toi tour à tour sur les deux chaises, et pense-le vraiment.',
  [roomChoiceHintKey('the-other-side', 'sit-in-both-chairs')]: 'La lecture la plus coûteuse : il n\'y a jamais eu que toi',
  [roomChoiceOutcomeKey('the-other-side', 'sit-in-both-chairs', 0)]:
    'Tu t\'assois aussi, brièvement, sur la seconde chaise, et essaies la voix comme un manteau que tu portais autrefois — et elle te va, exactement, ce qui, selon l\'heure, est réconfortant ou constitue tout le problème.',
  [roomChoiceOutcomeKey('the-other-side', 'sit-in-both-chairs', 1)]:
    'Il n\'y a jamais eu d\'invité à recevoir ici. Seulement une suite de toi-même, se relayant pour tenir la phrase.',
  [roomChoiceTextKey('the-other-side', 'hand-the-sim')]: 'Tends la carte SIM morte à la voix sur la seconde chaise.',
  [roomChoiceHintKey('the-other-side', 'hand-the-sim')]: 'La personne que tu as cessé d\'être en secret',
  [roomChoiceOutcomeKey('the-other-side', 'hand-the-sim', 0)]:
    '« Tiens », dis-tu en la tendant — une petite puce morte, désactivée, plus aucun signal en elle. « Voilà la personne que j\'ai cessé d\'être en secret. »',
  [roomChoiceOutcomeKey('the-other-side', 'hand-the-sim', 1)]:
    'L\'autre chaise la prend sans un mot. C\'est, d\'une certaine façon, l\'échange le plus honnête que l\'une ou l\'autre version de toi ait jamais réussi.',
  [roomExplanationKey('the-other-side', 0)]:
    'En face de toi est assise une voix construite entièrement à partir de ce que tu as dit et choisi lors de ton dernier séjour ici — pas un fantôme, l\'écho d\'une version antérieure de toi-même. La recherche sur la prise de perspective est sans ambiguïté : pratiquée de façon fiable, même brièvement, elle atténue mesurablement le conflit destructeur plus que presque toute autre intervention étudiée — cette pièce transforme tout le programme de l\'hôtel en un seul exercice.',
  [roomNoteTitleKey('the-other-side')]: 'La seconde chaise',
  [roomNoteThinkersKey('the-other-side')]: 'recherche sur la prise de perspective',
  [roomNoteBodyKey('the-other-side')]:
    'Les interventions de prise de perspective — imaginer et formuler délibérément un conflit depuis l\'autre côté — réduisent mesurablement le comportement conflictuel destructeur dans des études contrôlées, et l\'effet survit même à des exercices brefs, en une seule séance. **C\'est une compétence, pas un trait : elle s\'atrophie sans pratique, et doit être pratiquée — c\'est toute la prémisse de cette pièce.** Chaque dispute de cet hôtel a eu deux narrateurs à la première personne. Le sous-sol garde les deux enregistrements.',
});
register(roomBeatKey('the-other-side', 0, 2), 'v2', 'fr', (s: RunState) => {
  const moments = pickShadowMoments(s.prior);
  if (moments.length === 0) return ECHO_EMPTY_FALLBACK_FR;
  const lines = moments.map((e) => `« ${e.choiceText} »`).join(' Puis : ');
  return `Elle te répète deux ou trois de tes propres phrases — un demi-ton plus plat que dans ton souvenir de les avoir dites, comme sonne la défensive depuis la chaise qui reçoit : ${lines}`;
});
register(roomBeatKey('the-other-side', 0, 3), 'v2', 'fr', (s: RunState) => {
  if (choseInPrior(s.prior, 'the-rumor', 'set-the-trap')) {
    return 'Elle se souvient aussi du piège — la version de toi qui en a tendu un à quelqu\'un qu\'elle aimait. « Ça a marché », dit-elle, se citant elle-même avec une sorte d\'honnêteté pleine de regret. « Ça, ça n\'a jamais été la question. »';
  }
  if (choseInPrior(s.prior, 'the-rumor', 'trust-without-asking')) {
    return 'Elle se souvient aussi du lac — la version de toi qui a choisi de ne jamais savoir. « La confiance, pratiquée plutôt que ressentie », dit-elle, et pour une fois elle n\'a pas l\'air de discuter.';
  }
  return 'Elle ne mentionne pas la rumeur. Soit tu ne l\'as jamais atteinte, soit ce n\'était pas la part de toi qui avait besoin d\'être dite à voix haute ce soir.';
});
register(roomBeatKey('the-other-side', 0, 4), 'v2', 'fr', (s: RunState) => {
  const id = s.prior?.endingId;
  if (!id) return 'Elle ne sait pas comment tu es parti, la dernière fois. Certaines choses, apparemment, la pièce ne les garde pas non plus.';
  const title = ENDING_TITLE_BY_ID[id] ?? id;
  return `Elle sait aussi comment tu es parti — ni fière ni honteuse, ce qui est, d\'une certaine façon, pire que les deux. « ${title} », dit-elle, une fois, d\'une voix plate, et ne se répète pas.`;
});
