// Farsi translation of the Porter's voice: door barks, per-act intro
// announcements, the first-heart-loss and remembered-room fallback barks,
// the "examined path" act barks, and (bundled here rather than split into
// a separate file, same call cs-guide.ts made — the two read naturally
// together and both are small) the onboarding advisory/safety copy from
// packs/limerence/index.ts.
//
// CRITICAL — every usher.bark.*/act.intro.* id below is deliberately the
// SAME id ANAMNESIS's own content/usher.ts (via fa.ts) uses, exactly as
// guide.ts's own header comment explains: both packs' modules are bundled
// together into one shared key->text registry, so every registration here
// MUST pass 'limerence' as the key's packId (via usherBarkKey(id,
// 'limerence') / actIntroKey(act, 'limerence')) or it would silently
// overwrite/collide with ANAMNESIS's own Farsi translations. See git log
// "Fix a real cross-pack text leak" and src/test/crossPackLeaks.test.ts.
//
// Register/tone: dry hotel-noir dread for the Porter's barks (see
// guide.ts's own English fallbacks for the target voice); plain, serious
// safety/legal register for the advisory block — not narrative voice.
// Terminology: "Porter" = "دربان" — deliberately NOT the reserved word this
// pack's convention keeps exclusively for ANAMNESIS's own guide character
// (see fa-rooms-understory.ts's header for that convention; this file never
// spells that reserved word out, including in comments). "Trust" = "اعتماد"
// and "a measure of Trust" = "یک واحد اعتماد", matching the word already
// used pervasively across the room-content Farsi files (e.g.
// fa-rooms.ts/fa-reflections-*.ts's many "اعتماد" usages). "Clarity" =
// "وضوح", matching the same files' established use of "وضوح"/"وضوحِ..." for
// the concept of clear-sightedness (this is LIMERENCE's own re-skin of the
// "lucidity" stat; the HUD tooltip itself is registered separately under
// lucidityTooltipKey('limerence') in fa-ui.ts — code review 2026-07-15
// found it had been left on the shared, unscoped uiKey('lucidityTooltip'),
// silently showing ANAMNESIS's own Farsi text). "The Interval" — the hotel's own in-fiction
// term for suspended time, not yet translated anywhere else in this pack —
// is transliterated as "اینتروال", the same way this pack's other bespoke
// proper nouns are handled phonetically.
import { registerAll } from '../../../engine/text/resolver';
import { usherBarkKey, actIntroKey, uiKey, ledgerLastMessageKey } from '../../../engine/text/keys';

const PACK_ID = 'limerence';
const bark = (id: string) => usherBarkKey(id, PACK_ID);

// ---------- Door barks ----------
registerAll('v2', 'fa', {
  [bark('understory-hint')]:
    'دربان: پشتِ میزِ پذیرش دری هست که روی نقشه‌ی طبقه نیست. زمانی بود. از آن بگذرید یا نگذرید — دوباره نمی‌پرسد.',
  [bark('first-door')]:
    'دربان: امشب فقط یک در، برای شروع. چیزی رد نشده — همین الان وارد شدید.',
  [bark('gate-single-door')]:
    'دربان: در این بخش از راهرو فقط یک در باقی مانده. بقیه حالا پشتِ سرِتان‌اند — بسته‌شده، یا از کنارشان رد شده‌اید، که خودش نوعی بسته‌شدن است. این فقط همان دری است که هنوز باز مانده.',
  [bark('first-choice-explainer')]:
    'دربان: چند در، و فقط بعضی‌شان امشب مالِ شما هستند. هرکدام یک شبِ متفاوت را نگه داشته که رو به خرابی رفته، نه یک امتیازِ متفاوت. دری را انتخاب کنید که واقعاً بتوانید داخلِ سوالش بنشینید.',
  [bark('second-run')]: 'دربان: دوباره ثبت‌نام کردید. پذیرش شماره‌ی اتاق را به‌یاد می‌آورَد، حتی شب‌هایی که ترجیح می‌دهید به‌یاد نیاورَد.',

  // Cross-run recognition (master plan Tier 1 item 4) — spoken instead of
  // 'second-run' when the returning guest's history has a shape. Formal
  // address, as in every other دربان line here. This pack's own vocabulary
  // only: «اعتماد» for Trust (never ANAMNESIS's heart), and the hotel's
  // پذیرش/تسویه/شب — never the Usher's corridor register.
  [bark('pattern-same-ending-again')]:
    'دربان: چند شب مهمانِ ما بوده‌اید و هر بار به همان یک شکل تسویه کرده‌اید. چیزی از آن برداشت نمی‌کنم. فقط می‌بینم که راه‌های خروجِ دیگر هنوز سرِ جای خودشان‌اند و هیچ‌کدام عجله‌ای ندارند.',
  [bark('pattern-never-spent-a-heart')]:
    'دربان: بیش از یک شب اینجا، و حتی یک پیمانه اعتماد هم از حساب‌تان کم نشده. بیشترِ مهمان‌ها نمی‌توانند این را بگویند. نمی‌گویم معنایش این است که محتاط بوده‌اید یا فقط ساکت.',
  [bark('pattern-holds-unspent-keepsakes')]:
    'دربان: هنوز چیزی از اقامتی پیشین همراه‌تان است. کسی از شما نمی‌خواهد زمینش بگذارید. اما آنچه نگه داشته می‌شود، خرج نشده است — و یکی دو در اینجا فقط برای مهمانی باز می‌شوند که حاضر باشد خرجش کند.',
  [bark('pattern-never-descended')]:
    'دربان: از پشتِ پذیرش راهی به پایین می‌رود که هرگز نرفته‌اید. قفل نیست. فقط وقتی آدم صبح را از پیش می‌بیند، آسان از کنارش می‌گذرد.',
  [bark('pattern-walked-most-rooms')]:
    'دربان: تقریباً در هر اتاقی که این هتل نگه می‌دارد بوده‌اید. راهنماها را حالا همان‌طور می‌خوانید که کارکنان می‌خوانند. آنچه مانده همان چند اتاقی است که همچنان کنارشان می‌گذارید.',
  [bark('pattern-returns-to-one-room')]:
    'دربان: یک اتاق هست که مدام سراغش را می‌گیرید. نپرسیده‌ام چرا و نخواهم پرسید. اما چراغش را روشن نگه می‌دارد — و اتاق‌هایی که چشم‌به‌راهِ مهمانی‌اند، مثلِ اتاق‌های خالی رفتار نمی‌کنند.',
  [bark('reason-low')]: 'دربان: پیش از ورود به هر اتاق، آن را می‌سنجید. اتاق‌ها هم شروع کرده‌اند به سنجیدنِ شما.',
  [bark('reason-high')]:
    'دربان: هر اتاقِ این هتل را با تمامِ شدت حس می‌کنید. راهرو برای مهمان‌هایی مثلِ شما گرم‌تر می‌شود. این تعریف نیست. هشدار هم نیست.',
  [bark('self-low')]: 'دربان: آنچه مالِ شماست را پشتِ درِ خودش نگه می‌دارید. عاقلانه است. یک شبِ ساکت از خودتان بپرسید این محافظت چه هزینه‌ای دارد.',
  [bark('self-high')]: 'دربان: هر بار خودتان را به هرکه در اتاق باشد می‌سپارید. سخاوتمندانه است. هر بار کمتر از شما در اتاق باقی می‌ماند.',
  [bark('control-low')]: 'دربان: با هر اتاقی که واردش می‌شوید می‌جنگید. برایش احترام قائلم. اتاق‌ها حتی یک‌بار هم متوجه نشده‌اند.',
  [bark('control-high')]:
    'دربان: دیگر دمِ در آماده‌ی دفاع نمی‌ایستید. هرچه در ساعتِ سه‌ی صبح حس شود، این تسلیم نیست. نوعِ دیگری از استواری است.',
  [bark('one-heart')]: 'دربان: در دفترِ حسابتان فقط یک واحد اعتماد باقی مانده. اجازه ندارم بلند نگران باشم. این نزدیک‌ترین حالتی است که به آن می‌رسم.',
  [bark('high-lucidity')]: 'دربان: حالا این طبقه را واضح می‌بینید. وضوح تنها چیزی است در این هتل که نمی‌شود سرِ پذیرش تقلبی‌اش کرد.',
  [bark('generic0')]: 'دربان: دری را انتخاب کنید. هر اتاق در این طبقه اشغال شده. هیچ‌کدامشان هنوز این را نمی‌دانند.',
  [bark('generic1')]: 'دربان: عجله نکنید. اینتروال ساعتی صورت‌حساب نمی‌دهد.',
  [bark('generic2')]: 'دربان: می‌توانستم بگویم کدام در را انتخاب می‌کردم. همه‌شان را رفته‌ام، بعضی شب‌ها بیش از یک‌بار.',
  [bark('generic3')]: 'دربان: نشانه‌های بالای هر در صادق‌اند. این هتل با علامت‌های دروغین سروکار ندارد.',
  [bark('generic4')]: 'دربان: اینجا زمانِ تسویه‌حساب وجود ندارد. این قرار نیست دلداری باشد. اگر کمک می‌کند، به‌هرحال همین‌طور برداشتش کنید.',
  [bark('generic5')]: 'دربان: هر دری که از کنارش رد شوید، قفل می‌ماند، نه از بین می‌رود. شاید یک شبِ دیگر.',
  [bark('generic6')]: 'دربان: پیش از در زدن، نشانه را بخوانید. تنها هشدارِ صادقانه‌ای است که این طبقه می‌دهد.',
  [bark('generic7')]: 'دربان: هر مهمانِ این طبقه باور دارد که درِ خودش تنها در است. راهرو با این هم‌عقیده نیست، {name}.',
  // The "examined path" per-act barks (packs/limerence/index.ts's
  // EXAMINED_ACT_BARK_FALLBACK, read via usherBarkKey(`examined-act${act}`,
  // 'limerence') in engine/flow.ts) — not narrative content per se, but
  // still a t()-wrapped string shown to Farsi players, so CLAUDE.md's rule
  // applies to it the same as everything else.
  [bark('examined-act1')]: 'دربان: اگر جلوی کسانی بودید که این هزینه را می‌پردازند، باز همین را انتخاب می‌کردید؟',
  [bark('examined-act2')]: 'دربان: وقتی شمردید، واقعاً امیدوار بودید آن عدد چه باشد؟',
  [bark('examined-act3')]: 'دربان: کدام‌یک از این اتاق‌ها، اگر کسِ دیگری نمی‌توانست ببیندش، باز هم همین‌طور مبله می‌ماند؟',
  [bark('examined-act4')]: 'دربان: اگر هیچ‌کس هرگز نمی‌فهمید، دوباره راهرو را طی کنید. چیزی تغییر می‌کند؟',
});

// ---------- Per-act intro announcements ----------
registerAll('v2', 'fa', {
  [actIntroKey(1, PACK_ID)]:
    'پیشِ رو: راهرویی مدرسه‌ای در شب، کمدهایی که به‌جای در نشسته‌اند، هرکدام نوری خاص بیرون می‌زنند، همان نورِ پانزده‌ساله‌بودن و مطمئن‌بودن به اینکه این حالت تا ابد است. هشداری، مسافر: بعضی از این درها فقط احساس‌اند — و باز هم چندتایشان یک واحد اعتماد هزینه دارند.',
  [actIntroKey(2, PACK_ID)]:
    'راهرو سرد می‌شود و به چیزی شبیهِ یک آپارتمانِ شهری بدل می‌شود — دیوارهای نازک، موسیقیِ کسِ دیگری از سقف، هر دری عمداً کمی نیمه‌باز رهاشده. سرویسِ اتاقی که اینجا ارزشِ کاوش دارد، با یک رزروِ واقعی می‌آید، و می‌تواند یک واحد اعتماد هزینه داشته باشد.',
  [actIntroKey(3, PACK_ID)]:
    'موکت ضخیم‌تر می‌شود. این‌ها اتاق‌هایی هستند که مهمان‌ها بدونِ آنکه واقعاً قصدش را داشته باشند، سال‌ها نگه می‌دارند — یک زندگیِ کامل، مبله‌شده دورِ یک سوالِ بازنشده. بخشی از آنچه پشتِ این درها منتظر است، بهایی دارد که آن را حس می‌کنید، {name}، نه فقط دربارهٔ آن می‌خوانید.',
  [actIntroKey(4, PACK_ID)]:
    'مه رقیق می‌شود، رو به چیزی که تقریباً شبیهِ صبح است. آنچه از این طبقه باقی مانده، و بعد پذیرش. آنچه اینجا اتفاق می‌افتد دوبرابر حساب می‌شود، هرچه دربان درباره‌ی بی‌دفترحسابی‌بودنِ اینتروال بگوید. حتی این‌قدر نزدیک به تسویه‌حساب، یک درِ بی‌احتیاط هنوز هم می‌تواند یک واحد اعتماد هزینه داشته باشد.',
});

// P5: the Ledger's last-message row label — LIMERENCE's own hook room
// (the-unsent) captures an envelope choice, not a written message, so it
// gets its own label rather than ANAMNESIS's "Your last message".
registerAll('v2', 'fa', {
  [ledgerLastMessageKey(PACK_ID)]: 'پاکتی که انتخاب کردید',
});

// ---------- First-heart-loss / remembered-room fallback barks ----------
// Read directly by engine/flow.ts as
// t(usherBarkKey('first-heart-loss'|'remembered-room', pack.meta.id), ...).
registerAll('v2', 'fa', {
  [bark('first-heart-loss')]:
    'دربان: همین — یک واحد اعتماد، خرج شد. حسش کنید. پذیرش فقط یک دفترِ حسابِ صادقانه نگه می‌دارد، نه بیشتر. {hearts} تا برایتان باقی مانده. نه شمارشِ معکوسی تا تسویه‌حساب؛ فقط همان چیزی که آن در هزینه داشت.',
  [bark('remembered-room')]: 'دربان: این اتاق هم شما را به‌یاد دارد.',
  [bark('resumed-mid-room')]: 'دربان: از این اتاق وسط یک گفتگو بیرون رفتید. هنوز منتظرتان است.',
});

// ---------- Onboarding advisory / safety copy (spec 10) ----------
// Read via ui/overlays.ts's aboutBodyHtml(), which only reaches this branch
// when pack.advisory is defined (LIMERENCE only — confirmed by grepping
// src/ui/overlays.ts for the real reader before choosing these keys; they
// are NOT keyed as 'advisory.<field>', they're plain uiKey(...) calls with
// the bold label baked into the fallback string, so the Farsi text below
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
// is intentionally NOT re-registered here: fa.ts already registers that
// exact key to '16+ · مضامین بزرگسالان', which is already the correct
// Farsi text for LIMERENCE's own (identical English) badge string — see
// src/test/advisoryLayer.test.ts's assertion that
// limerencePack.advisory.ageAdvisory === '16+ · Mature Themes', the same
// literal already registered in src/content/text/fa.ts — so adding a
// second registration here would be a no-op at best and a fragile
// duplicate at worst.
registerAll('v2', 'fa', {
  [uiKey('aboutPurpose')]:
    '<b>چرا این وجود دارد.</b> لیمرنس وجود دارد تا بتوانید پیش از آنکه زندگی این اتاق‌ها را دورِ شما بسازد، خودتان واردشان شوید. هیچ‌چیز در اینجا به شما نمره نمی‌دهد. پژوهش‌های یادداشت‌های میدانی واقعی‌اند؛ آدم‌ها نیستند.',
  [uiKey('aboutMechanics')]:
    '<b>این چگونه کار می‌کند.</b> هیچ‌چیز در اینجا درست یا غلط نمره‌گذاری نمی‌شود. هر انتخاب، بی‌سروصدا، سه گرایشِ پنهان را جابه‌جا می‌کند — عقل در برابرِ احساس، مالِ من در برابرِ مالِ ما، مشتِ بسته در برابرِ دستِ باز — و همین‌ها هستند، نه یک جدولِ امتیاز، که تعیین می‌کنند کدام درها باز می‌شوند، هتل چه شکلی دارد و چه صدایی می‌دهد، و بالاخره به کدام پایان می‌رسید. سه قلب، اعتمادِ شماست — چند انتخابِ به‌ویژه پرهزینه، یکی از آن‌ها را مستقیماً خرج می‌کنند، و از دست‌دادنِ هر سه‌تا صفحه‌ی شکست نیست؛ یک پایانِ واقعی است، و همین‌طور هم نوشته شده. هر در، یک اتاقِ متفاوت است، و نمی‌توانید در یک اقامت از همه‌شان بگذرید — یک بازیِ دوباره بقیه را نشانتان می‌دهد.',
  [uiKey('aboutThemes')]:
    '<b>مضامین.</b> خیانت، حسادت، کنترلِ اجباری در رابطه، اشتراک‌گذاریِ تصاویرِ خصوصی بدونِ رضایت (هیچ‌وقت به‌تصویر کشیده نمی‌شود)، فروپاشیِ رابطه، و روابطِ غیرانحصاریِ توافقی.',
  [uiKey('aboutMinorsNote')]: 'شخصیت‌های طبقه‌ی همکف (پردهٔ یکم) بین ۱۵ تا ۱۸ سال دارند، و خط‌داستانی‌شان هیچ محتوای جنسی‌ای ندارد.',
  [uiKey('aboutFictionNote')]: 'این یک اثرِ داستانی است، نه درمان و نه توصیه.',
  [uiKey('aboutHelpLine')]:
    '<b>اگر این همین حالا زندگیِ شماست.</b> اگر یکی از این اتاق‌ها همین حالا زندگیِ واقعیِ شماست، یک بازی ابزارِ درستی نیست. با کسی واقعی صحبت کنید — دوستی که حقیقت را به شما می‌گوید، یک مشاور، یک پزشک.',
  [uiKey('aboutNoTelemetry')]:
    'هیچ‌چیز درباره‌ی نحوه‌ی بازی‌کردنتان ردیابی نمی‌شود، به‌جایی فرستاده نمی‌شود، یا به هیچ حسابی متصل نمی‌شود — ذخیره‌ی بازیِ شما فقط در همین مرورگر زندگی می‌کند.',
});
