// French translations for LIMERENCE Understory's Examined Path reflections
// (spec 05). Every line is translated with the specific room's actual
// situation and the choice's real stakes in mind, not word-for-word from
// English — see CLAUDE.md's translation rule. Verified directly against
// src/packs/limerence/rooms/understory.ts, matching de-reflections-
// understory.ts's precedent: the-registry has no `reflections` field on any
// of its four choices and is correctly absent from this file.
// the-doors-not-opened's three choices (enter-late, close-it, ask-why-now)
// all carry `reflections`. the-other-side's answer-yourself,
// let-yourself-finish, and sit-in-both-chairs carry `reflections`; its
// fourth, keepsake-gated choice (hand-the-sim) does not.
//
// Pronoun note: the-other-side addresses the player's own former self, not
// a partner — "elle" throughout tracks the grammatical gender of "la voix"
// (the voice), the same way "elle" already tracks "la pièce"/"la chambre"
// elsewhere in this pack, and asserts nothing about a human referent. See
// fr-rooms-understory.ts's header for the fuller explanation.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'fr', {
  // ---------- The Doors Not Opened ----------
  [reflectionKey('the-doors-not-opened', 'enter-late', 'consequence')]:
    'Quoi qu\'il ait attendu là-dedans, c\'est déjà arrivé, ou pas — y entrer maintenant ne change rien à ce qui était possible à l\'époque.',
  [reflectionKey('the-doors-not-opened', 'enter-late', 'duty')]:
    'Tu ne dois à l\'ancienne possibilité rien d\'autre que l\'honnêteté de regarder enfin — entrer tard acquitte une curiosité privée, pas une dette envers qui que ce soit.',
  [reflectionKey('the-doors-not-opened', 'enter-late', 'virtue')]:
    'Demande-toi si entrer maintenant, alors que ça ne peut plus rien te coûter, est une curiosité sincère enfin honorée, ou une répétition sans risque du courage.',
  [reflectionKey('the-doors-not-opened', 'enter-late', 'care')]:
    'Personne n\'attendait dans cette pièce pour toi — la seule personne à qui cette visite tardive s\'adresse est celle qui se tient sur le seuil.',
  [reflectionKey('the-doors-not-opened', 'close-it', 'consequence')]:
    'La refermer ne change rien à ce qu\'il y avait à l\'intérieur — la porte redevient simplement exactement ce qu\'elle était avant que tu la remarques.',
  [reflectionKey('the-doors-not-opened', 'close-it', 'duty')]:
    'Certaines portes, tu ne leur dois rien d\'autre que le respect de les laisser fermées — toute possibilité n\'a pas droit à un second regard simplement parce qu\'elle finit par être offerte.',
  [reflectionKey('the-doors-not-opened', 'close-it', 'virtue')]:
    'Demande-toi si la refermer était une sagesse sur les portes qui n\'ont jamais été les tiennes, ou un évitement plus discret déguisé en retenue.',
  [reflectionKey('the-doors-not-opened', 'close-it', 'care')]:
    'Personne derrière cette porte n\'avait besoin que tu l\'ouvres — tu la laisses exactement aussi tranquille que tu l\'as trouvée.',
  [reflectionKey('the-doors-not-opened', 'ask-why-now', 'consequence')]:
    'Les gonds huilés te disent que la porte a été préparée pour ce soir précisément — mais le savoir ne change rien à la question de savoir si tu la franchis.',
  [reflectionKey('the-doors-not-opened', 'ask-why-now', 'duty')]:
    'Tu dois à l\'offre elle-même une question honnête avant de lui devoir une réponse — demander pourquoi maintenant est sa propre forme de diligence.',
  [reflectionKey('the-doors-not-opened', 'ask-why-now', 'virtue')]:
    'Demande-toi si interroger la porte au lieu de simplement l\'utiliser est de la rigueur, ou une façon de retarder le choix plus difficile.',
  [reflectionKey('the-doors-not-opened', 'ask-why-now', 'care')]:
    'Les gonds n\'ont été huilés que pour toi — quoi que signifie ce minutage, cette attention n\'a jamais été destinée à personne d\'autre.',

  // ---------- The Other Side ----------
  [reflectionKey('the-other-side', 'answer-yourself', 'consequence')]:
    'Répondre ne change rien à ce qui a déjà été dit — ça change seulement si ça a été entendu.',
  [reflectionKey('the-other-side', 'answer-yourself', 'duty')]:
    'Tu dois à qui tu étais une reconnaissance, pas une correction — la saluer est une dette de reconnaissance, pas d\'accord.',
  [reflectionKey('the-other-side', 'answer-yourself', 'virtue')]:
    'Demande-toi si parler à la voix, plutôt que de simplement l\'observer, est du courage, ou une vieille habitude de vouloir toujours le dernier mot.',
  [reflectionKey('the-other-side', 'answer-yourself', 'care')]:
    'La pièce s\'apaise comme une respiration retenue qu\'on relâche à deux au lieu d\'une seule — une petite grâce accordée à qui tu étais autrefois.',
  [reflectionKey('the-other-side', 'let-yourself-finish', 'consequence')]:
    'La laisser finir sans l\'interrompre ne change rien à ce qu\'elle dit — seulement si, cette fois, elle a le droit de tout dire.',
  [reflectionKey('the-other-side', 'let-yourself-finish', 'duty')]:
    'Tu dois à qui tu étais l\'écoute que tu ne lui as peut-être pas accordée la première fois — le silence, ici, acquitte une dette d\'attention, pas d\'accord.',
  [reflectionKey('the-other-side', 'let-yourself-finish', 'virtue')]:
    'Demande-toi si rester silencieux est de la patience, ou simplement plus facile que de découvrir ce que tu répondrais.',
  [reflectionKey('the-other-side', 'let-yourself-finish', 'care')]:
    'Le silence est la chose la plus complète qui ait été dite dans cette pièce — une forme de sollicitude qui ne demande à la voix que de finir.',
  [reflectionKey('the-other-side', 'sit-in-both-chairs', 'consequence')]:
    'S\'asseoir sur les deux chaises ne change rien à quelle version de toi parle en ce moment — ça retire seulement l\'illusion qu\'il y en a jamais eu deux.',
  [reflectionKey('the-other-side', 'sit-in-both-chairs', 'duty')]:
    'Tu ne dois d\'audience à aucun invité, car admettre qu\'il n\'y en a jamais eu dissout l\'idée même d\'une dette entre hôte et invité.',
  [reflectionKey('the-other-side', 'sit-in-both-chairs', 'virtue')]:
    'Demande-toi si c\'est l\'honnêteté la plus coûteuse de cette pièce, ou une façon habile d\'éviter de vraiment répondre à la voix.',
  [reflectionKey('the-other-side', 'sit-in-both-chairs', 'care')]:
    'Il n\'y a jamais eu d\'invité à recevoir ici — seulement une suite de toi-même, et la sollicitude s\'est toujours, silencieusement, adressée à toi.',
});
