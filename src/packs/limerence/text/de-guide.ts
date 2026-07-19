// German translation of the Porter's voice: door barks, per-act intro
// announcements, the first-heart-loss and remembered-room fallback barks,
// the "examined path" act barks, and (bundled here rather than split into
// a separate file, same call cs-guide.ts and fa-guide.ts made — the two
// read naturally together and both are small) the onboarding advisory/
// safety copy from packs/limerence/index.ts.
//
// CRITICAL — every usher.bark.*/act.intro.* id below is deliberately the
// SAME id ANAMNESIS's own content/usher.ts (via de.ts) uses, exactly as
// guide.ts's own header comment explains: both packs' modules are bundled
// together into one shared key->text registry, so every registration here
// MUST pass 'limerence' as the key's packId (via usherBarkKey(id,
// 'limerence') / actIntroKey(act, 'limerence')) or it would silently
// overwrite/collide with ANAMNESIS's own German translations. See git log
// "Fix a real cross-pack text leak" and src/test/crossPackLeaks.test.ts.
//
// Register/tone: dry hotel-noir dread for the Porter's barks (see
// guide.ts's own English fallbacks for the target voice, and de-rooms-
// act4.ts / de-rooms-understory.ts for how the Porter already sounds in
// German prose — terse, literary, no exclamation, quietly ominous). Plain,
// serious safety/legal register for the advisory block — not narrative
// voice; see the note above that block for the specific du-vs-neutral
// decision made there.
//
// Terminology: "Porter" = "Portier" (never ANAMNESIS's own German guide-
// character word — see src/content/text/de.ts's usherBarkKey entries for
// the exact term being avoided; that word is never spelled out here either,
// including in comments — verified absent, grep count zero, from this
// file). "Trust" = "Vertrauen", "a measure of Trust" = "ein Maß Vertrauen",
// matching the word already used pervasively across the room-content German
// files (e.g. de-rooms.ts, de-rooms-act4.ts's many "Vertrauen" usages).
// "Clarity" = "Klarheit", matching the same files' established use for the
// concept of clear-sightedness (LIMERENCE's own re-skin of the "lucidity"
// stat; the HUD tooltip itself is registered separately under
// lucidityTooltipKey('limerence') in de-ui.ts — code review 2026-07-15
// found it had been left on the shared, unscoped uiKey('lucidityTooltip'),
// silently showing ANAMNESIS's own German text). "The
// Interval" — the hotel's own in-fiction term for suspended time — is
// rendered as "das Intervall" (native German spelling, double l), matching
// the bare noun already used at de-rooms-act3.ts:573 ("im Interval gewesen",
// sic — that one instance predates this file and uses the single-l English
// spelling inline; "Intervall" is the correct German spelling and is used
// consistently from here on for every full mention of the concept).
// Address: informal "du", per the "Reisende(r)" parenthetical-suffix
// convention already used by ANAMNESIS's own de.ts for a gender-neutral
// direct address ("Reisende(r)"), reused here once in the Act I intro where
// the Porter addresses the player as "traveler" directly.
import { registerAll } from '../../../engine/text/resolver';
import { usherBarkKey, actIntroKey, uiKey, ledgerLastMessageKey } from '../../../engine/text/keys';

const PACK_ID = 'limerence';
const bark = (id: string) => usherBarkKey(id, PACK_ID);

// ---------- Door barks ----------
registerAll('v2', 'de', {
  [bark('understory-hint')]:
    'Portier: Hinter dem Tresen ist eine Tür, die nicht auf dem Grundriss steht. Einst war sie es. Nimm sie oder nicht — ein zweites Mal fragt sie nicht.',
  [bark('first-door')]:
    'Portier: Nur eine Tür heute Nacht, zum Anfang. Nichts wurde übersprungen — du hast dich gerade erst angemeldet.',
  [bark('gate-single-door')]:
    'Portier: Auf diesem Stück Flur bleibt nur noch eine Tür. Die anderen liegen jetzt hinter dir — geschlossen, oder vorbeigegangen, was seine eigene Art des Schließens ist. Das hier ist einfach die, die noch offensteht.',
  [bark('first-choice-explainer')]:
    'Portier: Mehrere Türen, und nur manche gehören dir heute Nacht. Jede birgt eine andere Nacht, die schiefgeht, nicht eine andere Punktzahl. Wähl die, deren Frage du wirklich aushalten kannst.',
  [bark('second-run')]:
    'Portier: Du hast dich wieder eingecheckt. Die Rezeption erinnert sich an die Zimmernummer, auch in Nächten, in denen du es dir anders wünschst.',
  [bark('reason-low')]: 'Portier: Du wägst jedes Zimmer ab, bevor du es betrittst. Die Zimmer haben angefangen, dich zurückzuwägen.',
  [bark('reason-high')]:
    'Portier: Du fühlst hier jedes Zimmer in voller Lautstärke. Der Flur läuft wärmer für Gäste wie dich. Das ist kein Kompliment. Es ist aber auch keine Warnung.',
  [bark('self-low')]: 'Portier: Was dir gehört, hältst du hinter einer eigenen Tür. Vernünftig. Frag dich, an einer stillen Nacht, was dieses Bewachen kostet.',
  [bark('self-high')]:
    'Portier: Du gibst dich immer wieder hin an wen auch immer gerade im Zimmer ist. Großzügig von dir. Jedes Mal bleibt weniger von dir im Zimmer übrig.',
  [bark('control-low')]: 'Portier: Du kämpfst gegen jedes Zimmer, das du betrittst. Ich respektiere das. Den Zimmern ist es kein einziges Mal aufgefallen.',
  [bark('control-high')]:
    'Portier: Du wappnest dich nicht mehr an der Tür. Das ist keine Kapitulation, wie auch immer es sich um drei Uhr morgens anfühlt. Es ist eine andere Art von Standfestigkeit.',
  [bark('one-heart')]: 'Portier: Nur noch ein Maß Vertrauen in deinem Kontobuch. Ich darf nicht laut besorgt sein. Das hier ist das Nächste, was ich dazu bringe.',
  [bark('high-lucidity')]: 'Portier: Du siehst dieses Stockwerk jetzt klar. Klarheit ist das Einzige in diesem Hotel, das man an der Rezeption nicht vortäuschen kann.',
  [bark('generic0')]: 'Portier: Wähl eine Tür. Jedes Zimmer auf diesem Stockwerk ist besetzt. Keines von ihnen weiß das bisher.',
  [bark('generic1')]: 'Portier: Lass dir Zeit. Das Intervall rechnet nicht stundenweise ab.',
  [bark('generic2')]: 'Portier: Ich könnte dir sagen, welche Tür ich nehmen würde. Ich habe sie alle genommen, manche Nächte mehr als einmal.',
  [bark('generic3')]: 'Portier: Die Hinweise über jeder Tür sind ehrlich. Dieses Hotel handelt nicht mit falschen Zeichen.',
  [bark('generic4')]: 'Portier: Es gibt hier keine Checkout-Zeit. Das ist nicht als Trost gemeint. Nimm es trotzdem als einen, wenn es hilft.',
  [bark('generic5')]: 'Portier: Welche Tür du auch auslässt, sie bleibt verschlossen, nicht verschwunden. Vielleicht eine andere Nacht.',
  [bark('generic6')]: 'Portier: Lies den Hinweis, bevor du anklopfst. Es ist die einzige ehrliche Warnung, die dieses Stockwerk gibt.',
  [bark('generic7')]: 'Portier: Jeder Gast auf diesem Stockwerk glaubt, seine Tür sei die einzige. Der Flur sieht das anders, {name}.',
  // The "examined path" per-act barks (packs/limerence/index.ts's
  // EXAMINED_ACT_BARK_FALLBACK, read via usherBarkKey(`examined-act${act}`,
  // 'limerence') in engine/flow.ts) — not narrative content per se, but
  // still a t()-wrapped string shown to German players, so CLAUDE.md's rule
  // applies to it the same as everything else.
  [bark('examined-act1')]: 'Portier: Hättest du dasselbe gewählt, vor den Augen der Menschen, die es etwas kostet?',
  [bark('examined-act2')]: 'Portier: Als du gezählt hast, was hast du dir eigentlich gewünscht, dass die Zahl sein würde?',
  [bark('examined-act3')]: 'Portier: Welches dieser Zimmer wäre noch genauso eingerichtet, wenn niemand sonst es sehen könnte?',
  [bark('examined-act4')]: 'Portier: Wenn es niemand je erfahren könnte — geh den Flur noch einmal entlang. Ändert sich etwas?',
});

// ---------- Per-act intro announcements ----------
registerAll('v2', 'de', {
  [actIntroKey(1, PACK_ID)]:
    'Voraus: ein Schulflur bei Nacht, Spinde stehen anstelle von Türen, jeder von ihnen sickert das besondere Licht des Fünfzehnseins und der Gewissheit, dass es für immer ist. Eine Warnung, Reisende(r): manche dieser Türen sind nur Gefühle — und ein paar von ihnen kosten trotzdem ein Maß Vertrauen.',
  [actIntroKey(2, PACK_ID)]:
    'Der Flur kühlt ab zu etwas wie einem städtischen Mietshaus — dünne Wände, fremde Musik durch die Decke, jede Tür absichtlich einen Spalt offen gelassen. Der Zimmerservice, der hier oben eine Erkundung wert ist, kommt mit einer echten Reservierung, und er kann ein Maß Vertrauen kosten.',
  [actIntroKey(3, PACK_ID)]:
    'Der Teppich wird dicker. Das sind die Zimmer, die Gäste jahrelang behalten, ohne es so recht zu beabsichtigen — ein ganzes Leben, eingerichtet um eine ungeöffnete Frage herum. Manches von dem, was hinter diesen Türen wartet, hat einen Preis, den du spüren wirst, {name}, nicht nur lesen.',
  [actIntroKey(4, PACK_ID)]:
    'Der Nebel lichtet sich zu etwas, das fast wie Morgen ist. Was von diesem Stockwerk bleibt, und dann die Rezeption. Was hier geschieht, zählt doppelt, was auch immer dir der Portier darüber erzählt, dass das Intervall kein Kontobuch führt. Selbst so kurz vor dem Auschecken kann eine unachtsame Tür noch ein Maß Vertrauen kosten.',
});

// P5: the Ledger's last-message row label — LIMERENCE's own hook room
// (the-unsent) captures an envelope choice, not a written message, so it
// gets its own label rather than ANAMNESIS's "Your last message".
registerAll('v2', 'de', {
  [ledgerLastMessageKey(PACK_ID)]: 'Der Umschlag, den du gewählt hast',
});

// ---------- First-heart-loss / remembered-room fallback barks ----------
// Read directly by engine/flow.ts as
// t(usherBarkKey('first-heart-loss'|'remembered-room', pack.meta.id), ...).
registerAll('v2', 'de', {
  [bark('first-heart-loss')]:
    'Portier: Da — ein Maß Vertrauen, ausgegeben. Spür das. Die Rezeption führt nur ein ehrliches Kontobuch, nicht mehr. Dir bleiben noch {hearts}. Kein Countdown bis zum Auschecken; einfach das, was diese Tür gekostet hat.',
  [bark('remembered-room')]: 'Portier: Dieses Zimmer erinnert sich auch an dich.',
  [bark('resumed-mid-room')]: 'Portier: Aus diesem Zimmer bist du mitten im Gespräch gegangen. Es wartet noch auf dich.',
});

// ---------- Onboarding advisory / safety copy (spec 10) ----------
// Read via ui/overlays.ts's aboutBodyHtml(), which only reaches this branch
// when pack.advisory is defined (LIMERENCE only — confirmed by grepping
// src/ui/overlays.ts for the real reader before choosing these keys; they
// are NOT keyed as 'advisory.<field>', they're plain uiKey(...) calls with
// the bold label baked into the fallback string, so the German text below
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
// is intentionally NOT re-registered here: de.ts already registers that
// exact key to '16+ · Reife Themen' (src/content/text/de.ts:166), which is
// already the correct German text for LIMERENCE's own (identical English)
// badge string — same precedent the Czech and Farsi passes both found and
// documented — so adding a second registration here would be a no-op at
// best and a fragile duplicate at worst.
//
// du-vs-neutral judgment call: the barks and endings stay "du" because
// they're the Porter's own narrative voice. This advisory block is
// different in kind — plain safety/legal information the player reads
// before or independent of any character speaking to them, closer in
// function to a content rating or a helpline notice than to dialogue. It
// keeps "du" (dropping to formal "Sie" here alone, with "du" everywhere
// else in the pack, would read as a jarring register shift mid-pack, and
// German safety/educational copy aimed at players of any age routinely uses
// "du" without reading as less serious), but the sentences themselves are
// built plainer and more declarative than the barks/endings — short direct
// statements, no hotel-noir imagery, no address-by-name — so the register
// shift is carried by sentence construction rather than by formality level.
registerAll('v2', 'de', {
  [uiKey('aboutPurpose')]:
    '<b>Warum es das gibt.</b> LIMERENCE existiert, damit du diese Zimmer betreten kannst, bevor das Leben sie um dich herum baut. Nichts hier bewertet dich. Die Forschung in den Randnotizen ist echt; die Menschen sind es nicht.',
  [uiKey('aboutMechanics')]:
    '<b>Wie es funktioniert.</b> Nichts hier wird als richtig oder falsch bewertet. Jede Entscheidung verschiebt still drei verborgene Neigungen — Kopf gegen Herz, Mein gegen Unser, Festhalten gegen Loslassen — und diese, nicht eine Punktetafel, bestimmen, welche Türen sich öffnen, wie das Hotel aussieht und klingt, und zu welchem Ende du am Ende gelangst. Drei Herzen sind dein Vertrauen — eine Handvoll besonders kostspieliger Entscheidungen verbraucht direkt eines davon, und alle drei zu verlieren ist kein Bildschirm für Niederlagen; es ist ein echtes Ende, auch als solches geschrieben. Jede Tür ist ein anderes Zimmer, und du kannst in einem einzigen Aufenthalt nicht durch alle gehen — ein weiterer Durchgang zeigt dir den Rest.',
  [uiKey('aboutThemes')]:
    '<b>Themen.</b> Untreue, Eifersucht, zwanghafte Kontrolle in Beziehungen, nicht einvernehmliches Teilen intimer Bilder (nie dargestellt), das Zerbrechen von Beziehungen und einvernehmliche Nicht-Monogamie.',
  [uiKey('aboutMinorsNote')]: 'Figuren im Erdgeschoss (Akt I) sind zwischen 15 und 18 Jahre alt, und ihre Handlungsstränge enthalten keine sexuellen Inhalte.',
  [uiKey('aboutFictionNote')]: 'Das hier ist Fiktion, keine Therapie und kein Ratschlag.',
  [uiKey('aboutHelpLine')]:
    '<b>Wenn das gerade dein Leben ist.</b> Wenn eines dieser Zimmer gerade dein Leben ist, ist ein Spiel nicht das richtige Mittel. Sprich mit einem echten Menschen — mit jemandem, der dir die Wahrheit sagt, mit einer Beratungsstelle, mit ärztlichem Rat.',
  [uiKey('aboutNoTelemetry')]:
    'Nichts daran, wie du spielst, wird erfasst, irgendwohin gesendet oder mit einem Konto verknüpft — dein Spielstand existiert ausschließlich in diesem Browser.',
});
