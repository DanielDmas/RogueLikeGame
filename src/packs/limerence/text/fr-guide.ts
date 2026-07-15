// French translation of the Porter's voice: door barks, per-act intro
// announcements, the first-heart-loss and remembered-room fallback barks,
// the "examined path" act barks, and (bundled here rather than split into
// a separate file, same call cs-guide.ts / fa-guide.ts / de-guide.ts made
// — the two read naturally together and both are small) the onboarding
// advisory/safety copy from packs/limerence/index.ts.
//
// CRITICAL — every usher.bark.*/act.intro.* id below is deliberately the
// SAME id ANAMNESIS's own content/usher.ts (via fr.ts) uses, exactly as
// guide.ts's own header comment explains: both packs' modules are bundled
// together into one shared key->text registry, so every registration here
// MUST pass 'limerence' as the key's packId (via usherBarkKey(id,
// 'limerence') / actIntroKey(act, 'limerence')) or it would silently
// overwrite/collide with ANAMNESIS's own French translations. See git log
// "Fix a real cross-pack text leak" and src/test/crossPackLeaks.test.ts.
//
// Register/tone: dry hotel-noir dread for the Porter's barks (see
// guide.ts's own English fallbacks for the target voice, and fr-rooms-
// act4.ts / fr-rooms-understory.ts for how the Porter already sounds in
// French prose — terse, literary, no exclamation, quietly ominous). Plain,
// serious safety/legal register for the advisory block — not narrative
// voice; see the note below that block for the specific tu-vs-neutral
// decision made there.
//
// Terminology: "Porter" = "Le Portier" (never ANAMNESIS's own French word
// for its theater-usher guide character, registered in
// src/content/text/fr.ts — that word is never spelled out here, including
// in comments, per this pack's convention; verified absent, grep count
// zero, from this file). "Trust" = "confiance",
// "a measure of Trust" = "un cœur" (the room-content French files use
// "cœur" for the mechanical Trust unit — see fr.ts's own
// aboutHearts/heartsTooltip registrations for ANAMNESIS's parallel usage,
// and fr-rooms.ts through fr-rooms-understory.ts for LIMERENCE's own
// established use of "cœur"). "Clarity" = "lucidité", matching this pack's
// own re-skin of the "lucidity" stat as used in fr-rooms*.ts (the HUD
// tooltip itself is registered separately under
// lucidityTooltipKey('limerence') in fr-ui.ts — code review 2026-07-15
// found it had been left on the shared, unscoped uiKey('lucidityTooltip'),
// silently showing ANAMNESIS's own French text). "The Interval" —
// the hotel's own in-fiction term for suspended time — is rendered as
// "l'Intervalle" (native French spelling), matching the term already
// established in the room-content French files.
//
// Address: informal "tu", per every other French file in this pack. The
// Act I intro line addresses the player directly as "voyageur·se" — an
// epicene coinage in the same spirit as fr-rooms.ts's header-documented
// approach to gender-neutral direct address, used here once for the
// English "traveler" vocative.
import { registerAll } from '../../../engine/text/resolver';
import { usherBarkKey, actIntroKey, uiKey, ledgerLastMessageKey } from '../../../engine/text/keys';

const PACK_ID = 'limerence';
const bark = (id: string) => usherBarkKey(id, PACK_ID);

// ---------- Door barks ----------
registerAll('v2', 'fr', {
  [bark('understory-hint')]:
    'Le Portier : Il y a une porte derrière le comptoir qui ne figure pas sur le plan de l’étage. Elle y a figuré, autrefois. Prends-la ou non — elle ne demandera pas deux fois.',
  [bark('gate-single-door')]:
    'Le Portier : Il ne reste qu’une seule porte sur ce tronçon de couloir. Les autres sont derrière toi désormais — fermées, ou dépassées, ce qui revient à sa façon à les fermer aussi. Celle-ci est simplement celle qui reste ouverte.',
  [bark('first-choice-explainer')]:
    'Le Portier : Plusieurs portes, et seules certaines te reviennent ce soir. Chacune contient une nuit différente qui tourne mal, pas un score différent. Choisis celle dont tu peux vraiment habiter la question.',
  [bark('second-run')]:
    'Le Portier : Tu t’es réenregistré·e. La réception se souvient du numéro de chambre, même les nuits où tu préférerais qu’elle l’oublie.',
  [bark('reason-low')]: 'Le Portier : Tu pèses chaque chambre avant d’y entrer. Les chambres ont commencé à te peser en retour.',
  [bark('reason-high')]:
    'Le Portier : Tu ressens chaque chambre ici à plein volume. Le couloir se réchauffe pour des invités comme toi. Ce n’est pas un compliment. Ce n’est pas non plus un avertissement.',
  [bark('self-low')]: 'Le Portier : Ce qui t’appartient, tu le gardes derrière une porte à part. Sage. Demande-toi, un soir tranquille, ce que coûte cette garde.',
  [bark('self-high')]:
    'Le Portier : Tu continues à te donner à qui se trouve dans la chambre. Généreux de ta part. Il reste un peu moins de toi dans la chambre à chaque fois.',
  [bark('control-low')]: 'Le Portier : Tu te bats contre chaque chambre dans laquelle tu entres. Je le respecte. Les chambres ne l’ont jamais remarqué une seule fois.',
  [bark('control-high')]:
    'Le Portier : Tu ne te crispes plus à la porte. Ce n’est pas une reddition, quoi que ça puisse te sembler à trois heures du matin. C’est une autre forme de stabilité.',
  [bark('one-heart')]: 'Le Portier : Il ne te reste qu’un cœur dans ton registre. Je n’ai pas le droit de m’inquiéter à voix haute. Voici le plus près que j’en approche.',
  [bark('high-lucidity')]: 'Le Portier : Tu vois clair sur cet étage, maintenant. La lucidité est la seule chose, dans cet hôtel, qu’on ne peut pas simuler à la réception.',
  [bark('generic0')]: 'Le Portier : Choisis une porte. Chaque chambre de cet étage est occupée. Aucune ne le sait encore.',
  [bark('generic1')]: 'Le Portier : Prends ton temps. L’Intervalle ne facture pas à l’heure.',
  [bark('generic2')]: 'Le Portier : Je pourrais te dire quelle porte je prendrais. Je les ai toutes prises, certaines nuits plus d’une fois.',
  [bark('generic3')]: 'Le Portier : Les indices au-dessus de chaque porte sont honnêtes. Cet hôtel ne fait pas commerce de faux signes.',
  [bark('generic4')]: 'Le Portier : Il n’y a pas d’heure de départ ici. Ce n’est pas censé te réconforter. Prends-le comme tel quand même, si ça peut aider.',
  [bark('generic5')]: 'Le Portier : Quelle que soit la porte que tu sautes, elle reste verrouillée, pas disparue. Une autre nuit, peut-être.',
  [bark('generic6')]: 'Le Portier : Lis l’indice avant de frapper. C’est le seul avertissement honnête que donne cet étage.',
  [bark('generic7')]: 'Le Portier : Chaque invité de cet étage croit que sa porte est la seule. Le couloir n’est pas de cet avis, {name}.',
  // The "examined path" per-act barks (packs/limerence/index.ts's
  // EXAMINED_ACT_BARK_FALLBACK, read via usherBarkKey(`examined-act${act}`,
  // 'limerence') in engine/flow.ts) — not narrative content per se, but
  // still a t()-wrapped string shown to French players, so CLAUDE.md's rule
  // applies to it the same as everything else.
  [bark('examined-act1')]: 'Le Portier : Aurais-tu fait le même choix, sous les yeux des gens que ça touche ?',
  [bark('examined-act2')]: 'Le Portier : Quand tu comptais, qu’espérais-tu vraiment que le chiffre soit ?',
  [bark('examined-act3')]: 'Le Portier : Laquelle de ces chambres serait meublée exactement pareil si personne d’autre ne pouvait la voir ?',
  [bark('examined-act4')]: 'Le Portier : Si personne ne pouvait jamais le savoir — remonte le couloir une fois de plus. Est-ce que quelque chose change ?',
});

// ---------- Per-act intro announcements ----------
registerAll('v2', 'fr', {
  [actIntroKey(1, PACK_ID)]:
    'Devant toi : un couloir de lycée la nuit, des casiers tenant lieu de portes, chacun laissant filtrer la lumière particulière d’avoir quinze ans et d’être certain·e que ça durera toujours. Un avertissement, voyageur·se : certaines de ces portes ne sont que des sentiments — et quelques-unes d’entre elles coûtent tout de même un cœur.',
  [actIntroKey(2, PACK_ID)]:
    'Le couloir se refroidit en quelque chose comme un immeuble d’appartements en ville — murs fins, musique d’un·e voisin·e à travers le plafond, chaque porte laissée entrouverte exprès. Le service en chambre qu’il vaut la peine d’explorer, à cet étage, vient avec une vraie réservation, et il peut coûter un cœur.',
  [actIntroKey(3, PACK_ID)]:
    'La moquette s’épaissit. Ce sont les chambres que les invités gardent pendant des années sans vraiment l’avoir voulu — toute une vie meublée autour d’une seule question jamais posée. Certaines des choses qui attendent derrière ces portes ont un prix que tu ressentiras, {name}, pas seulement que tu liras.',
  [actIntroKey(4, PACK_ID)]:
    'La brume se dissipe vers quelque chose de presque semblable au matin. Ce qu’il reste de cet étage, puis la réception. Ce qui se passe ici compte double, quoi qu’en dise le Portier sur le fait que l’Intervalle ne tient aucun registre. Même à si peu de la fin, une porte franchie sans attention peut encore coûter un cœur.',
});

// P5: the Ledger's last-message row label — LIMERENCE's own hook room
// (the-unsent) captures an envelope choice, not a written message, so it
// gets its own label rather than ANAMNESIS's "Your last message".
registerAll('v2', 'fr', {
  [ledgerLastMessageKey(PACK_ID)]: 'L’enveloppe que tu as choisie',
});

// ---------- First-heart-loss / remembered-room fallback barks ----------
// Read directly by engine/flow.ts as
// t(usherBarkKey('first-heart-loss'|'remembered-room', pack.meta.id), ...).
registerAll('v2', 'fr', {
  [bark('first-heart-loss')]:
    'Le Portier : Là — un cœur, dépensé. Ressens-le. La réception ne tient qu’un registre honnête, rien de plus. Il t’en reste {hearts}. Ce n’est pas un compte à rebours avant le départ ; simplement ce que cette porte a coûté.',
  [bark('remembered-room')]: 'Le Portier : Cette chambre se souvient de toi aussi.',
});

// ---------- Onboarding advisory / safety copy (spec 10) ----------
// Read via ui/overlays.ts's aboutBodyHtml(), which only reaches this branch
// when pack.advisory is defined (LIMERENCE only — confirmed by grepping
// src/ui/overlays.ts for the real reader before choosing these keys; they
// are NOT keyed as 'advisory.<field>', they're plain uiKey(...) calls with
// the bold label baked into the fallback string, so the French text below
// must include the translated label too):
//   uiKey('aboutPurpose')      = `<b>Why this exists.</b> ${purposeStatement}`
//   uiKey('aboutMechanics')    = `<b>How it works.</b> ${mechanicsNote}`
//   uiKey('aboutThemes')       = `<b>Themes.</b> ${themes}`
//   uiKey('aboutMinorsNote')   = minorsNote (no label)
//   uiKey('aboutFictionNote')  = fictionNote (no label)
//   uiKey('aboutHelpLine')     = `<b>If this is your life right now.</b> ${helpLine}`
//   uiKey('aboutNoTelemetry')  = noTelemetry (no label)
// These 7 keys are unscoped (uiKey has no pack-id parameter) but that's
// safe: they're only ever rendered from the pack.advisory-gated branch of
// aboutBodyHtml, which only LIMERENCE reaches (ANAMNESIS's pack.advisory is
// undefined — confirmed by grepping src/packs/anamnesis/index.ts for an
// `advisory:` field: it has none) — see src/test/uiKeyCoverage.test.ts's
// PACK_CONDITIONAL_KEYS comment for the same reasoning, and
// src/test/advisoryLayer.test.ts for the behavior this must satisfy.
//
// advisory.ageAdvisory ('16+ · Mature Themes', read via
// uiKey('titleAgeAdvisory') at ui/overlays.ts:54, also pack.advisory-gated)
// is intentionally NOT re-registered here: fr.ts already registers that
// exact key, at line 166, to '16+ · Thèmes matures' — byte-identical in
// meaning to LIMERENCE's own (identical English) badge string — same
// precedent the Czech, Farsi, and German passes all found and documented —
// so adding a second registration here would be a no-op at best and a
// fragile duplicate at worst.
//
// tu-vs-neutral judgment call: the barks and endings stay "tu" because
// they're the Porter's own narrative voice, or an epitaph/field-note voice
// speaking about the player in that same close register. This advisory
// block is different in kind — plain safety/legal information the player
// reads before or independent of any character speaking to them, closer in
// function to a content rating or a helpline notice than to dialogue. Same
// call the German pass made: it keeps "tu" (switching to formal "vous"
// here alone, with "tu" everywhere else in the pack, would read as a
// jarring register shift mid-pack, and French safety/informational copy
// aimed at players of any age routinely uses "tu" without reading as less
// serious — French mental-health and helpline material aimed at a general
// or younger audience frequently does the same), but the sentences
// themselves are built plainer and more declarative than the barks/
// endings — short direct statements, no hotel-noir imagery, no
// address-by-name — so the register shift is carried by sentence
// construction rather than by formality level.
registerAll('v2', 'fr', {
  [uiKey('aboutPurpose')]:
    '<b>Pourquoi ce jeu existe.</b> LIMERENCE existe pour que tu puisses entrer dans ces chambres avant que la vie ne les construise autour de toi. Rien ici ne te note. Les recherches citées dans les notes de terrain sont réelles ; les personnages ne le sont pas.',
  [uiKey('aboutMechanics')]:
    '<b>Comment ça marche.</b> Rien ici n’est jugé bon ou mauvais. Chaque choix déplace discrètement trois inclinations cachées — la raison contre le sentiment, le mien contre le nôtre, la retenue contre l’ouverture — et ce sont elles, pas un tableau de score, qui déterminent quelles portes s’ouvrent, à quoi l’hôtel ressemble et comment il sonne, et quelle fin tu atteins finalement. Trois cœurs représentent ta confiance — une poignée de choix particulièrement coûteux en dépensent un directement, tout comme perdre toute ta lucidité. Perdre les trois n’est pas un écran d’échec ; c’est une véritable fin, et elle est écrite comme telle. Chaque porte est une chambre différente, et tu ne peux pas toutes les traverser en un seul séjour — une nouvelle partie te montrera le reste.',
  [uiKey('aboutThemes')]:
    '<b>Thèmes.</b> Infidélité, jalousie, contrôle coercitif, partage non consenti d’images intimes (jamais représenté), rupture de relation, et non-monogamie consentie.',
  [uiKey('aboutMinorsNote')]: 'Les personnages du rez-de-chaussée (Acte I) ont entre 15 et 18 ans, et leurs histoires ne contiennent aucun contenu sexuel.',
  [uiKey('aboutFictionNote')]: 'Ceci est une fiction, pas une thérapie ni un conseil.',
  [uiKey('aboutHelpLine')]:
    '<b>Si l’une de ces chambres est ta vie en ce moment.</b> Si l’une de ces chambres est ta vie en ce moment, un jeu n’est pas le bon outil. Parle à quelqu’un de réel — un·e ami·e qui te dit la vérité, un·e conseiller·ère, un médecin.',
  [uiKey('aboutNoTelemetry')]:
    'Rien de ta façon de jouer n’est suivi, envoyé où que ce soit, ou lié à un compte — ta sauvegarde n’existe que dans ce navigateur.',
});
