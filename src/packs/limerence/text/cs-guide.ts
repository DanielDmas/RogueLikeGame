// Czech translation of the Porter's voice: door barks, per-act intro
// announcements, the first-heart-loss and remembered-room fallback barks,
// the "examined path" act barks, and (bundled here rather than split into
// a separate file — the two read naturally together and both are small)
// the onboarding advisory/safety copy from packs/limerence/index.ts.
//
// CRITICAL — every usher.bark.*/act.intro.* id below is deliberately the
// SAME id ANAMNESIS's own content/usher.ts (via cs.ts) uses, exactly as
// guide.ts's own header comment explains: both packs' modules are bundled
// together into one shared key->text registry, so every registration here
// MUST pass 'limerence' as the key's packId (via usherBarkKey(id,
// 'limerence') / actIntroKey(act, 'limerence')) or it would silently
// overwrite/collide with ANAMNESIS's Uvaděč translations. See git log "Fix
// a real cross-pack text leak" and src/test/crossPackLeaks.test.ts.
//
// Register/tone: dry hotel-noir dread for the Porter's barks (see
// guide.ts's own English fallbacks for the target voice); plain, serious
// safety/legal register for the advisory block — not narrative voice.
// Terminology: "Porter" = "Vrátný" (never "Uvaděč", which is ANAMNESIS's
// own Usher). "Trust" = "Důvěra", "Clarity" = "Jasnost" — both already
// used this way in the room-content Czech files (see e.g.
// cs-rooms-understory.ts's "Důvěra, provozovaná místo prožívaná" and the
// "jasnost"/"Jasnost" usage across cs-reflections-act1/2/3.ts).
import { registerAll } from '../../../engine/text/resolver';
import { usherBarkKey, actIntroKey, uiKey, ledgerLastMessageKey } from '../../../engine/text/keys';

const PACK_ID = 'limerence';
const bark = (id: string) => usherBarkKey(id, PACK_ID);

// ---------- Door barks ----------
registerAll('v2', 'cs', {
  [bark('understory-hint')]:
    'Vrátný: Za recepcí jsou dveře, které nejsou na plánku patra. Kdysi byly. Vezměte si je, nebo ne — podruhé se už nezeptají.',
  [bark('first-door')]:
    'Vrátný: Dnes večer jen jedny dveře, na začátek. Nic jste nepřeskočili — teprve jste se přihlásili k recepci.',
  [bark('gate-single-door')]:
    'Vrátný: Na tomhle úseku chodby zbývají jedny dveře. Ostatní už máte za sebou — zavřené, nebo minuté, což je svým způsobem taky zavření. Tyhle jsou prostě ty, co ještě zůstávají otevřené.',
  [bark('first-choice-explainer')]:
    'Vrátný: Několik dveří, a jen některé jsou dnes v noci vaše. Za každými se skrývá jiná noc, která se zvrtla, ne jiné skóre. Vyberte tu, jejíž otázku dokážete opravdu unést.',
  [bark('second-run')]:
    'Vrátný: Zase jste se ubytovali. Recepce si pamatuje číslo pokoje, i v noci, kdy byste si přáli, aby nepamatovala.',
  [bark('reason-low')]: 'Vrátný: Každou místnost si předem zvážíte, než do ní vstoupíte. Místnosti si teď začaly vážit vás.',
  [bark('reason-high')]:
    'Vrátný: Každou místnost tu cítíte naplno. Chodba je pro hosty jako vy o něco teplejší. Není to kompliment. Není to ale ani varování.',
  [bark('self-low')]: 'Vrátný: Co je vaše, držíte za vlastními dveřmi. Rozumné. Zeptejte se, některou tichou noc, co to hlídání stojí.',
  [bark('self-high')]:
    'Vrátný: Pořád se rozdáváte tomu, kdo zrovna je v místnosti. Velkoryse od vás. Jenže vás je v té místnosti pokaždé míň.',
  [bark('control-low')]: 'Vrátný: S každou místností, do které vejdete, bojujete. Obdivuji to. Místnosti si toho nikdy ani jednou nevšimly.',
  [bark('control-high')]:
    'Vrátný: Přestali jste se ve dveřích napřahovat k obraně. Není to kapitulace, ať už to ve tři ráno působí jakkoli. Je to jiný druh stálosti.',
  [bark('one-heart')]: 'Vrátný: V účetní knize vám zbývá jedna míra Důvěry. Nesmím se bát nahlas. Tohle je nejblíž, kam se k tomu dostanu.',
  [bark('high-lucidity')]: 'Vrátný: Tohle patro teď vidíte jasně. Jasnost je jediná věc v tomhle hotelu, kterou nejde na recepci předstírat.',
  [bark('generic0')]: 'Vrátný: Vyberte dveře. Každý pokoj na tomhle patře je obsazený. Zatím to o sobě žádný z nich neví.',
  [bark('generic1')]: 'Vrátný: Nespěchejte. Interval neúčtuje podle hodin.',
  [bark('generic2')]: 'Vrátný: Mohl bych vám říct, které dveře bych si vybral já. Vybral jsem si je všechny, některé noci i víckrát.',
  [bark('generic3')]: 'Vrátný: Nápovědy nad dveřmi jsou pravdivé. Tenhle hotel neobchoduje s falešnými znameními.',
  [bark('generic4')]: 'Vrátný: Tady není žádný čas odhlášení. Není to myšleno jako útěcha. Berte to tak stejně, jestli vám to pomůže.',
  [bark('generic5')]: 'Vrátný: Kterékoli dveře vynecháte, zůstanou zamčené, ne pryč. Možná jindy, jinou noc.',
  [bark('generic6')]: 'Vrátný: Přečtěte si nápovědu, než zaklepete. Je to jediné poctivé varování, které tohle patro dává.',
  [bark('generic7')]: 'Vrátný: Každý host na tomhle patře věří, že jeho dveře jsou jediné. Chodba s tím nesouhlasí, {name}.',
  // The "examined path" per-act barks (packs/limerence/index.ts's
  // EXAMINED_ACT_BARK_FALLBACK, read via usherBarkKey(`examined-act${act}`,
  // 'limerence') in engine/flow.ts) — not narrative content per se, but
  // still a t()-wrapped string shown to Czech players, so CLAUDE.md's rule
  // applies to it the same as everything else.
  [bark('examined-act1')]: 'Vrátný: Zvolili byste totéž před lidmi, které to stojí?',
  [bark('examined-act2')]: 'Vrátný: Když jste počítali, v co jste vlastně doufali, že to číslo bude?',
  [bark('examined-act3')]: 'Vrátný: Které z těchhle místností by byly zařízené stejně, kdyby je nikdo jiný neviděl?',
  [bark('examined-act4')]: 'Vrátný: Kdyby se to nikdo nikdy nemohl dozvědět, projděte chodbou znovu. Změnilo by se něco?',
});

// ---------- Per-act intro announcements ----------
registerAll('v2', 'cs', {
  [actIntroKey(1, PACK_ID)]:
    'Před vámi: školní chodba v noci, skříňky místo dveří, každá z nich prosakuje tím zvláštním světlem patnácti let a jistoty, že tohle je navždy. Varování, poutníku: některé z těchhle dveří jsou jen pocity — a pár z nich přesto stojí míru Důvěry.',
  [actIntroKey(2, PACK_ID)]:
    'Chodba chladne do něčeho jako městský bytový dům — tenké zdi, cizí hudba skrz strop, každé dveře záměrně nechané pootevřené. Pokojová služba, kterou tu stojí za to prozkoumat, přichází se skutečnou rezervací, a může stát míru Důvěry.',
  [actIntroKey(3, PACK_ID)]:
    'Koberec houstne. Tohle jsou pokoje, které si hosté nechávají roky, aniž by to tak úplně chtěli — celý život zařízený kolem jedné neotevřené otázky. Něco z toho, co čeká za těmihle dveřmi, má cenu, kterou ucítíte, {name}, ne jen přečtete.',
  [actIntroKey(4, PACK_ID)]:
    'Mlha řídne do něčeho, co se skoro podobá ránu. Co zbývá na tomhle patře, a pak recepce. Co se tu stane, počítá se dvojnásob, ať vám Vrátný o Intervalu bez účetní knihy říká cokoli. I tak blízko odhlášení může neopatrné dveře pořád stát míru Důvěry.',
});

// P5: the Ledger's last-message row label — LIMERENCE's own hook room
// (the-unsent) captures an envelope choice, not a written message, so it
// gets its own label rather than ANAMNESIS's "Your last message".
registerAll('v2', 'cs', {
  [ledgerLastMessageKey(PACK_ID)]: 'Obálka, kterou jste zvolili',
});

// ---------- First-heart-loss / remembered-room fallback barks ----------
// Read directly by engine/flow.ts as
// t(usherBarkKey('first-heart-loss'|'remembered-room', pack.meta.id), ...).
registerAll('v2', 'cs', {
  [bark('first-heart-loss')]:
    'Vrátný: Tady — jedna míra Důvěry, vydaná. Cítíte to. Recepce vede jen poctivou účetní knihu, nic víc. Zbývá vám jich {hearts}. Není to odpočet do odhlášení; je to prostě to, co ty dveře stály.',
  [bark('remembered-room')]: 'Vrátný: Tahle místnost si vás taky pamatuje.',
  [bark('resumed-mid-room')]: 'Vrátný: Z tohohle pokoje jste odešli uprostřed rozhovoru. Pořád na vás čeká.',
});

// ---------- Onboarding advisory / safety copy (spec 10) ----------
// Read via ui/overlays.ts's aboutBodyHtml(), which only reaches this branch
// when pack.advisory is defined (LIMERENCE only — verified by grepping
// src/ui and src/engine for the real reader before choosing these keys;
// they are NOT keyed as 'advisory.<field>', they're plain uiKey(...) calls
// with the bold label baked into the fallback string, so the Czech text
// below must include the translated label too):
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
// undefined) — see src/test/uiKeyCoverage.test.ts's PACK_CONDITIONAL_KEYS
// comment for the same reasoning, and src/test/advisoryLayer.test.ts for
// the behavior this must satisfy.
//
// advisory.ageAdvisory ('16+ · Mature Themes', read via
// uiKey('titleAgeAdvisory') at ui/overlays.ts:54, also pack.advisory-gated)
// is intentionally NOT re-registered here: cs.ts already registers that
// exact key to '16+ · zralá témata', which is already the correct Czech
// text for LIMERENCE's own (identical English) badge string, so adding a
// second registration here would be a no-op at best and a fragile
// duplicate at worst.
registerAll('v2', 'cs', {
  [uiKey('aboutPurpose')]:
    '<b>Proč tohle existuje.</b> LIMERENCE existuje, abyste mohli vejít do těchto místností dřív, než je kolem vás postaví sám život. Nic tady vás nehodnotí. Výzkum v poznámkách je skutečný; lidé nejsou.',
  [uiKey('aboutMechanics')]:
    '<b>Jak to funguje.</b> Nic tady se nehodnotí jako správné nebo špatné. Každá volba tiše posouvá tři skryté sklony — hlavu proti srdci, mé proti našemu, sevření proti otevření — a právě ty, ne bodovací tabulka, určují, které dveře se otevřou, jak hotel vypadá a zní, a ke kterému konci nakonec dojdete. Tři srdce jsou vaše Důvěra — hrstka obzvlášť nákladných voleb jednu stojí přímo, a ztráta všech tří není obrazovka prohry; je to opravdový konec, a tak je i napsán. Každé dveře jsou jiný pokoj, a v jednom pobytu jimi nemůžete projít všemi — další hra vám ukáže zbytek.',
  [uiKey('aboutThemes')]:
    '<b>Témata.</b> nevěra, žárlivost, donucovací kontrola, sdílení intimních fotografií bez souhlasu (nikdy nezobrazené), rozpad vztahu a konsenzuální nemonogamie.',
  [uiKey('aboutMinorsNote')]: 'Postavy v Přízemí (Dějství I) mají 15–18 let a jejich příběhové linky neobsahují žádný sexuální obsah.',
  [uiKey('aboutFictionNote')]: 'Tohle je fikce, ne terapie ani rada.',
  [uiKey('aboutHelpLine')]:
    '<b>Pokud je tohle právě teď váš život.</b> Pokud je pro vás některá z těchto místností právě teď skutečným životem, hra není ten správný nástroj. Promluvte si se skutečným člověkem — s přítelem, který vám řekne pravdu, s poradcem, s lékařem.',
  [uiKey('aboutNoTelemetry')]:
    'Nic z toho, jak hrajete, se nesleduje, nikam neodesílá ani nespojuje s účtem — vaše uložená hra existuje pouze v tomto prohlížeči.',
});
