// Farsi translation of LIMERENCE's Understory room prose (beats, choice
// text/hint/outcome, field notes, plain-language explanations). Registered
// under version 'v2'. Follows the structural pattern established by the
// prologue/Act I's fa-rooms.ts, Act II's fa-rooms-act2.ts, Act III's
// fa-rooms-act3.ts and Act IV's fa-rooms-act4.ts — see CLAUDE.md's
// "Translating content" rule: every line here was translated against the
// room's actual beats and each choice's stakes, not word-for-word. The
// Understory is the optional secret-branch epilogue reached via the stairs
// behind the front desk on a returning guest's second run — LIMERENCE's own
// mirror of ANAMNESIS's Act V — and its register is quieter and more
// archival than Act IV's checkout floor: a records office, a corridor of
// unopened doors, a room with a second chair. Cross-checked against
// ANAMNESIS's own Farsi Act V pass (src/content/text/fa-dynamic.ts,
// src/content/rooms/understory.ts, which this room set closely mirrors in
// English) for terminology consistency across the two games' Farsi voice —
// phrasing was reused where the two texts genuinely coincide, retranslated
// where LIMERENCE's wording differs. "The Porter" stays "دربان" throughout,
// never the Farsi word this pack reserves exclusively for ANAMNESIS's own
// guide character, called "the Usher" in English (see prior act files'
// headers for that word) — note that ANAMNESIS's own Farsi files use that
// same reserved word for its Usher, which is exactly why it must not leak
// into this pack's Porter lines. The-registry
// and the-doors-not-opened quote room/ending titles pulled from the
// previous run's transcript via ROOM_TITLE_BY_ID / ENDING_TITLE_BY_ID — per
// this project's convention, room/ending titles are never translated
// anywhere, so this file imports those two maps directly from the English
// room source (../rooms/understory) rather than re-declaring a Farsi
// version. One exception: the-other-side's gate beat mentions "the Rumor"
// as plain prose (not a templated title lookup), and is translated normally
// as "شایعه", matching the Czech pass's precedent. Numerals: Western digits
// for citation years in field-note thinkers lines, Persian digits for
// in-fiction numbers within narrative prose, matching established
// convention (this act's prose has no in-fiction numbers to render).
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

/** Mirrors understory.ts's own LIMERENCE_ACT_POOLS — needed here only for
 * the-doors-not-opened's "unchosen rooms" lookup. */
const LIMERENCE_ACT_POOLS: Record<1 | 2 | 3, string[]> = {
  1: ['the-read-receipt', 'the-screenshot', 'the-password', 'the-party', 'the-forward', 'the-best-friends-girl', 'the-summer-ends'],
  2: ['the-distance', 'the-hall-pass', 'the-rebound', 'the-unicorn', 'just-friends', 'the-ex', 'the-confession', 'the-other-side-of-the-door'],
  3: ['the-colleague', 'the-metamour', 'the-veto', 'the-drift', 'the-second-account', 'the-discovery', 'the-wedding-eve', 'the-therapist', 'the-usual-suite'],
};

// ---------- The Registry ----------
registerAll('v2', 'fa', {
  [roomBeatKey('the-registry', 0, 0)]:
    'پله‌هایی پشتِ میزِ پذیرش که قسم می‌خوردید وقتِ ورودتان آنجا نبودند. پایین: اتاقی دراز و کوتاه، قفسه‌هایی از پرونده‌های خاکستریِ یکسان که فراتر از آنچه سقف باید اجازه بدهد، ادامه دارند.',
  [roomBeatKey('the-registry', 0, 1)]:
    'روی یک قفسه، تنها یک پرونده‌ی تازه‌تر هست: پرونده‌ی شما. مهرخورده، زیرِ تاریخی که آن را به‌عنوانِ یک پایان می‌شناسید: تکمیل‌شده. بایگانی‌شده. فراموش‌نشده.',
  // beat 2 is a function beat — registered below via register().
  [roomBeatKey('the-registry', 0, 3)]:
    'منگنه‌شده به فرمِ پذیرش، توصیفی که زمانی از خودتان دادید، عیناً: «{blurb}» بایگانی‌شده بدونِ هیچ نظری — یا احترام است، یا خطای بایگانی. از همین‌جا، پایین، این دو کاملاً شبیهِ هم به‌نظر می‌رسند.',
  [roomBeatKey('the-registry', 0, 4)]:
    'دربان (در چارچوبِ در، کلاه زیرِ بغل): «من زیاد به این پایین نمی‌آیم. هیچ‌چیز اینجا ممنوع نیست. بیشترِ مهمان‌ها، اگر اصلاً بخواهند، فقط یک‌بار می‌آیند. برای دفترِ ثبت فرقی نمی‌کند. جای دیگری هم ندارد که باشد.»',
  [roomChoiceTextKey('the-registry', 'sign-it')]: '«آن، خودِ من بودم. قبولش می‌کنم — همه‌اش را.» خودتان کارت را امضا کنید.',
  [roomChoiceHintKey('the-registry', 'sign-it')]: 'قبولش کنید، سخت‌ترین نوعِ امضا',
  [roomChoiceOutcomeKey('the-registry', 'sign-it', 0)]:
    'قلمِ زنجیرشده به قفسه را برمی‌دارید و زیرِ خطِ تایپ‌شده، با خطِ خودتان، امضا می‌کنید — خطی که انگار پرونده منتظرش بوده.',
  [roomChoiceOutcomeKey('the-registry', 'sign-it', 1)]:
    'دربان: «هر مهمانی امضا نمی‌کند. شما اسمتان را به شبی اضافه کردید که از قبل اتفاق افتاده بود. نمی‌دانم این چه هزینه‌ای دارد. اما می‌دانم که بی‌اهمیت نیست.»',
  [roomChoiceTextKey('the-registry', 'disown-it')]: '«این دیگر شبیهِ من نیست.» کارت را بدونِ امضا رها کنید.',
  [roomChoiceHintKey('the-registry', 'disown-it')]: 'بگذارید این فاصله واقعی باشد، نه فقط راحت',
  [roomChoiceOutcomeKey('the-registry', 'disown-it', 0)]:
    'کارت را دقیقاً همان‌طور که پیدایش کردید رها می‌کنید و از قفسه عقب می‌روید، همان‌طور که از غریبه‌ای عقب می‌روید که تصادفاً کتِ شما را پوشیده.',
  [roomChoiceOutcomeKey('the-registry', 'disown-it', 1)]:
    'دربان: «پرونده بحث نمی‌کند. فقط نگه می‌دارد چه اتفاقی افتاده — چه دستی که آن کار را کرد هنوز به اسمِ شما جواب بدهد، چه ندهد.»',
  [roomChoiceTextKey('the-registry', 'refile-unjudged')]: 'درِ پرونده را آرام ببندید، وسطِ جمله، بدونِ هیچ نظری، نه موافق نه مخالف.',
  [roomChoiceHintKey('the-registry', 'refile-unjudged')]: 'نه ازش دفاع کنید، نه انکارش کنید — بایگانی‌اش کنید',
  [roomChoiceOutcomeKey('the-registry', 'refile-unjudged', 0)]:
    'پرونده را همان‌طور می‌بندید که کتابی را وسطِ یک فصل می‌بندید، از سرِ احترام نه از سرِ موافقت، و به قفسه برش می‌گردانید.',
  [roomChoiceOutcomeKey('the-registry', 'refile-unjudged', 1)]:
    'دربان: «فکر می‌کنم هدفِ واقعیِ این قفسه همین است. نه یک حکم — جایی برای کنارگذاشتنِ چیزی، بدونِ نیاز به تمام‌کردنِ تصمیم‌گیری درباره‌ی اینکه آن چیز چه بود.»',
  [roomChoiceTextKey('the-registry', 'pin-the-keycard')]: 'کلیدکارتِ قدیمی را به لبه‌ی پرونده‌ی بازشده سنجاق کنید — الحاقیه‌ای به پرونده.',
  [roomChoiceHintKey('the-registry', 'pin-the-keycard')]: 'مدرکی بر اینکه آن راهرو اتفاق افتاد، و از آن دور شدید',
  [roomChoiceOutcomeKey('the-registry', 'pin-the-keycard', 0)]:
    'کلیدکارتِ غیرفعال‌شده را به پرونده فشار می‌دهید تا بچسبد — مدرکی هم بر اینکه آن راهرو اتفاق افتاد، هم بر اینکه از آن دور شدید.',
  [roomChoiceOutcomeKey('the-registry', 'pin-the-keycard', 1)]:
    'دفترِ ثبت آن را دقیقاً همان‌طور می‌پذیرد که دفاترِ ثبت همه‌چیز را می‌پذیرند: بدونِ نظر، بدونِ اعتراض، و، همان‌طور که متوجه می‌شوید، بدونِ آنکه حتی یک‌بار هم نیازی به آن داشته باشد.',
  [roomExplanationKey('the-registry', 0)]:
    'به شما رکوردی بایگانی‌شده و تاریخ‌دار از یک انتخاب در آخرین اقامتتان اینجا نشان داده می‌شود، دوباره خوانده‌شده به‌طورِ سرد، بدونِ هیچ‌کدام از زمینه‌ای که آن‌موقع باعث می‌شد منطقی به‌نظر برسد. هنوز پشتش می‌ایستید، از آن فاصله می‌گیرید، یا می‌پذیرید که اتفاق افتاده بدونِ آنکه کامل درباره‌اش قضاوت کنید، نه به این طرف نه به آن طرف؟ این درباره‌ی چگونگیِ رابطه‌ی ما با انتخاب‌های گذشته‌مان است، وقتی زمان گذشته — مثلِ خواندنِ دوباره‌ی یک پیامِ قدیمی و کاملاً مطمئن‌نبودن به اینکه کسی که آن را فرستاد و کسی که حالا می‌خواندش، واقعاً همان آدم‌اند.',
  [roomNoteTitleKey('the-registry')]: 'درباره‌ی نگه‌داشتنِ پرونده‌ها',
  [roomNoteThinkersKey('the-registry')]: 'هویتِ روایی (پژواکِ ریکور، در سراسرِ عنوان‌ها)',
  [roomNoteBodyKey('the-registry')]:
    'پل ریکور استدلال می‌کرد که خود، چیزی نیست که با درون‌نگری پیدا شود، بلکه روایتی است که پیوسته زیرِ بازنگری نگه داشته می‌شود — یکسانی‌اش نه در هیچ‌وقت‌تغییرنکردن، بلکه در توانِ تغییرکردن و هنوز هم آن را همان داستان نامیدن است. این اتاق دقیقاً همان رویارویی را به‌صحنه می‌آورد که نظریه‌ی او برای دوام‌آوردن در برابرش ساخته شده بود: کنشی مشخص، تاریخ‌دار، و بایگانی‌شده، دوباره خوانده‌شده به‌طورِ سرد، بدونِ فصل‌های اطرافش که آن‌موقع حسِ اجتناب‌ناپذیربودن می‌دادند. قبول‌کردنش، انکارش، و بایگانی‌کردنش بدونِ قضاوت، سه رابطه‌ی متفاوت با نویسندگی‌اند، و پاسخِ خودِ ریکور به سومی نزدیک‌تر است تا به هرکدام از دو تای اول. **موظف نیستید هر شبِ درونِ آن پرونده را تایید کنید. فقط باید بپذیرید که آن دست‌خط، مالِ کیست.**',
});
register(roomBeatKey('the-registry', 0, 2), 'v2', 'fa', (s: RunState) => {
  const entry = pickExhibitEntry(s.prior?.transcript ?? []);
  if (!entry) {
    return 'کارتِ داخلِ پرونده‌ی بازشده، خالی است، گوشه‌اش لکه‌ی آب خورده — هرچه این پرونده زمانی درش بود، سفر به اینجا را زنده نمانده. دستِ‌کم بقیه‌ی قفسه هنوز خوانا است.';
  }
  return `روی کارت، به خطِ خودتان، نوشته شده: «${entry.choiceText}» بدونِ هیچ توضیحِ بیشتر. دفترِ ثبت اظهارنظر نمی‌کند. فقط نگه می‌دارد.`;
});

// ---------- The Doors Not Opened ----------
registerAll('v2', 'fa', {
  [roomBeatKey('the-doors-not-opened', 0, 0)]:
    'راهرویی که دمایش ثابت نگه داشته شده، پر از درهایی که کمی باز مانده‌اند — نه به‌شکلِ دعوت‌کننده. فقط باز، همان‌طور که دری باز می‌ماند وقتی خیلی وقت است کسی زحمتِ بستنش را به خودش نداده.',
  [roomBeatKey('the-doors-not-opened', 0, 1)]:
    'این‌ها درهایی هستند از آخرین اقامتتان که هرگز از میانشان نگذشتید. واردنشده، تصمیم‌گرفته‌نشده، از نظرِ فنی هنوز در دسترس — به همان شکلِ خاصی که قطاری از دست‌رفته، هنوز، از نظرِ فنی، یک قطار است.',
  // beats 2 and 3 are function beats — registered below via register().
  [roomBeatKey('the-doors-not-opened', 0, 4)]:
    'دربان: «زیاد به این‌که کدام‌یک باز شده فکر نمی‌کنم — یا برعکس، کاملاً فکر می‌کنم؛ هیچ‌وقت تصمیم نگرفته‌ام کدام توصیه بدتر است. و آن چیزِ صادقانه‌ای را می‌گویم که این طبقه همیشه بلند نمی‌گویدش: رابطه‌ای که نداشتید، گاهی دری است که هرگز پیشنهادتان نشده. باز‌نشده‌بودن، خودبه‌خود فضیلت نیست.»',
  [roomChoiceTextKey('the-doors-not-opened', 'enter-late')]: 'در را تا آخر باز کنید. بروید تو.',
  [roomChoiceHintKey('the-doors-not-opened', 'enter-late')]: 'کنجکاوی‌ای که دیر ادا شده',
  // outcome 0 is a function beat — registered below via register().
  [roomChoiceOutcomeKey('the-doors-not-opened', 'enter-late', 1)]:
    'هرچه قرار بود اینجا اتفاق بیفتد، یا افتاد، یا نیفتاد، یا آن سوال به‌سادگی منقضی شد، همان‌طور که نامه‌ی بازنشده بالاخره از فوریت می‌افتد. کوچک‌تر از چیزی است که در ذهنتان ساخته بودید. بیشترِ چیزهای نزیسته همین‌طورند.',
  [roomChoiceTextKey('the-doors-not-opened', 'close-it')]: 'در را تا آخر ببندید. بعضی درها راستش را بخواهید بهتر است همان در بمانند.',
  [roomChoiceHintKey('the-doors-not-opened', 'close-it')]: 'به گذشته‌بودنش احترام بگذارید',
  [roomChoiceOutcomeKey('the-doors-not-opened', 'close-it', 0)]:
    'آرام هلش می‌دهید تا بسته شود، همان‌طور که دری را می‌بندید روی اتاقی که بالاخره کسی واقعاً در آن خوابیده.',
  [roomChoiceOutcomeKey('the-doors-not-opened', 'close-it', 1)]:
    'می‌شود گفت غریزه‌ی درست همین بود. هر درِ بازنشده‌ای، حسرتی در انتظار نبود.',
  [roomChoiceTextKey('the-doors-not-opened', 'ask-why-now')]: '«چرا دوباره باز شدی، حالا، از میانِ همه‌ی وقت‌ها؟» از خودِ در بپرسید.',
  [roomChoiceHintKey('the-doors-not-opened', 'ask-why-now')]: 'خودِ پیشنهاد را بازخواست کنید، نه فقط اتاق را',
  [roomChoiceOutcomeKey('the-doors-not-opened', 'ask-why-now', 0)]:
    'دقیقاً هیچ جوابی نمی‌گیرید — درها، حتی اینجا، به‌طورِ طبیعی حرف‌زدنی نیستند — اما متوجه می‌شوید پاشنه‌ها اخیراً روغن خورده‌اند. کسی می‌خواسته این در امشب، مشخصاً، به‌راحتی حرکت کند.',
  [roomChoiceOutcomeKey('the-doors-not-opened', 'ask-why-now', 1)]:
    'دربان: «بهترین حدسم این است: زیرزمین دری را پیشنهاد می‌دهد که حالا آماده‌اید بازنشدنش را تاب بیاورید. زمان‌بندی‌اش را هیچ‌وقت به من هم توضیح نداده.»',
  [roomExplanationKey('the-doors-not-opened', 0)]:
    'درهایی به شما نشان داده می‌شود که در آخرین اقامتتان از کنارشان رد شدید بدونِ بازکردنشان — مسیرهایی هرگز نرفته، حالا برای همیشه ناشناخته. یکی دوباره خودبه‌خود با صدای جیرجیر باز می‌شود. این همان کششِ «راهِ نرفته» است: بالاخره نگاه می‌کنید، حالا که هیچ هزینه‌ای ندارد؟ این بازی یک اصلاحِ صادقانه به نسخه‌ی فولکلوریک‌اش اضافه می‌کند: رابطه‌ای که نداشتید، گاهی دری است که هرگز پیشنهادتان نشده، نه فضیلتی که به‌دست آورده باشید — بازنکردن و وسوسه‌نشدن، یک دستاورد نیستند.',
  [roomNoteTitleKey('the-doors-not-opened')]: 'راهِ نرفته، ممیزی‌شده',
  [roomNoteThinkersKey('the-doors-not-opened')]: 'سرگیجه‌ی کی‌یرکگور (1844) از امکان · فراست (1916)، بدفهمیده، اصلاح‌شده',
  [roomNoteBodyKey('the-doors-not-opened')]:
    'کی‌یرکگور امکان را سرگیجه‌آورترین چیزِ در دسترسِ یک انسان می‌نامید — سرگیجه‌آورتر از هر خطرِ واقعی، چون واقعیت محدود است، درحالی‌که امکان، هرچه بیشتر سرِ یک دوراهی بایستید و از انتخاب‌کردن سر باز بزنید، بی‌حدوحصر تکثیر می‌شود. شعرِ «راهِ نرفته»ی فراست تقریباً در هر مراسمِ فارغ‌التحصیلی به‌غلط نقل‌قول می‌شود، به‌عنوانِ سرودی برای انحرافِ جسورانه، اما خودِ شعر زیرک‌تر است: هر دو راه، همان‌طور که راوی دو بند زودتر اعتراف می‌کند، «واقعاً تقریباً یکسان» فرسوده‌اند — آن آهِ حسرت‌بارِ پایانِ شعر از پیش به‌عنوانِ داستانی اعتراف می‌شود که با نگاهِ به‌گذشته بازسازی شده، نه حقیقتی گزارش‌شده از همان دوراهی. **بازتنظیم‌شده برای روابط: کسی که انتخابش نکردید، شایعه است، نه رسید.** درهای این راهرو هرگز مخفیانه بهتر نبودند. آن‌ها فقط، به‌طورِ گذرا، ممکن بودند — و امکان، همین‌که بسته شود، هیچ رسیدی نگه نمی‌دارد، فقط شایعه.',
});
register(roomBeatKey('the-doors-not-opened', 0, 2), 'v2', 'fa', (s: RunState) => {
  const { candidates } = pickUnchosenRooms(s.prior, LIMERENCE_ACT_POOLS);
  if (candidates.length === 0) {
    return 'راهرو امشب عجیب خالی است — هر دری که ممکن بود از دستش بدهید، ظاهراً ندادید. یا رکوردشان به‌سادگی سفر به پایین را زنده نمانده.';
  }
  const titles = candidates.map((id) => ROOM_TITLE_BY_ID[id] ?? id);
  return `سه‌تا اول توجهتان را جلب می‌کنند: ${titles.join('، ')}. یادتان نمی‌آید هیچ‌کدامشان باز شده باشد. حالا تقریباً مطمئنید که دستِ‌کم یکی‌شان پیشنهاد شده بود — و شما از کنارش رد شدید.`;
});
register(roomBeatKey('the-doors-not-opened', 0, 3), 'v2', 'fa', (s: RunState) => {
  const { opens } = pickUnchosenRooms(s.prior, LIMERENCE_ACT_POOLS);
  if (!opens) {
    return 'امشب هیچ دری به‌تنهایی متمایز نمی‌شود. راهرو کاملاً بسته می‌ماند، و به‌نوعی همین خودش نوعی پاسخ است.';
  }
  const title = ROOM_TITLE_BY_ID[opens] ?? opens;
  return `دری، نزدیکِ انتهای راهرو، خودش باقیِ راه را باز می‌کند — ${title}. هرچه پشتش منتظر بود، آشکارا، هنوز منتظر است.`;
});
register(roomChoiceOutcomeKey('the-doors-not-opened', 'enter-late', 0), 'v2', 'fa', (s: RunState) => {
  const { opens } = pickUnchosenRooms(s.prior, LIMERENCE_ACT_POOLS);
  const title = opens ? (ROOM_TITLE_BY_ID[opens] ?? opens) : 'اتاق';
  return `وارد ${title} می‌شوید — یا آنچه از آن باقی مانده. نه بحرانی وسطِ جمله، نه کسی منتظر. فقط اتاقی، مبله‌شده، کمی خاک‌گرفته، که کارِ خاصی نمی‌کند.`;
});

// ---------- The Other Side ----------
const ECHO_EMPTY_FALLBACK_FA =
  'صندلیِ دیگر چیزی نمی‌گوید. این‌بار هیچ‌چیز ثبت‌نشده که از آن صدایی ساخته شود — و اتاق، به‌اعتبارِ خودش، وانمود نمی‌کند غیر از این باشد.';

registerAll('v2', 'fa', {
  [roomBeatKey('the-other-side', 0, 0)]:
    'اتاقی خالی. دو صندلی، روبه‌روی هم، آن‌قدر نزدیک که هرکس روی هرکدامشان بنشیند، واضح است که قرار است شنیده شود.',
  [roomBeatKey('the-other-side', 0, 1)]:
    'صندلیِ دیگر اشغال شده. نه با یک آدم — اتاق دراین‌باره دقیق است، دقیق به همان‌شکلی که فقط جایی بدونِ هیچ نفعی از دروغ‌گفتن می‌تواند باشد — بلکه با صدایی، ساخته‌شده از آنچه در آخرین اقامتتان اینجا گفتید و انتخاب کردید.',
  // beats 2, 3 and 4 are function beats — registered below via register().
  [roomBeatKey('the-other-side', 0, 5)]:
    'دربان: «من سرِ این یکی نمی‌نشینم. هرکاری شما دوتا اینجا می‌کنید، هیچ‌وقت داوریِ آن به من نبوده.»',
  [roomChoiceTextKey('the-other-side', 'answer-yourself')]: '«صدایت را می‌شنوم.» با کسی که بودید صحبت کنید.',
  [roomChoiceHintKey('the-other-side', 'answer-yourself')]: 'اذعان، نه اصلاح',
  [roomChoiceOutcomeKey('the-other-side', 'answer-yourself', 0)]:
    'آن را می‌گویید — نه اصلاح، نه عذرخواهی، فقط اذعان، همان‌طور که کسی را دمِ در سلام می‌کنید که مطمئن نبودید هنوز بشناسدتان.',
  [roomChoiceOutcomeKey('the-other-side', 'answer-yourself', 1)]:
    'صندلیِ دیگر دقیقاً جوابی نمی‌دهد. اما چیزی در اتاق آرام می‌گیرد، همان‌طور که نفسِ حبس‌شده‌ای وقتی بالاخره عمداً رها می‌شود، آرام می‌گیرد — این‌بار توسطِ دو نفر به‌جای یکی.',
  [roomChoiceTextKey('the-other-side', 'let-yourself-finish')]: 'روبه‌رویش بنشینید و هیچ نگویید. بگذارید این‌بار، بدونِ وقفه، حرفش را تمام کند.',
  [roomChoiceHintKey('the-other-side', 'let-yourself-finish')]: 'همان شنیدنِ بی‌وقفه‌ای که شاید هیچ‌وقت به کسی نداده‌اید',
  [roomChoiceOutcomeKey('the-other-side', 'let-yourself-finish', 0)]:
    'می‌گذارید حرف بزند، تا انتها، بدونِ اصلاحِ حتی یک کلمه — کاری که، متوجه می‌شوید، حتی بارِ اول هم همیشه از پسش برنیامدید.',
  [roomChoiceOutcomeKey('the-other-side', 'let-yourself-finish', 1)]:
    'آن سکوت خالی نیست. اگر چیزی باشد، کامل‌ترین چیزی است که در آن اتاق گفته شده.',
  [roomChoiceTextKey('the-other-side', 'sit-in-both-chairs')]:
    '«هیچ‌وقت کسِ دیگری اینجا نبود.» به‌نوبت روی هر دو صندلی بنشینید، و جدی بگویید.',
  [roomChoiceHintKey('the-other-side', 'sit-in-both-chairs')]: 'پرهزینه‌ترین قرائت: همیشه فقط خودِ شما بودید',
  [roomChoiceOutcomeKey('the-other-side', 'sit-in-both-chairs', 0)]:
    'برای لحظه‌ای روی صندلیِ دوم هم می‌نشینید و آن صدا را مثلِ کتی که قبلاً مالِ خودتان بود می‌پوشید — و دقیقاً اندازه است، که یا دلگرم‌کننده است یا کلِ مشکل، بسته به این‌که چه ساعتی از شب باشد.',
  [roomChoiceOutcomeKey('the-other-side', 'sit-in-both-chairs', 1)]:
    'هیچ‌وقت مهمانی برای سرگرم‌کردن اینجا نبود. فقط رشته‌ای از خودِ شما، که به‌نوبت آن جمله را نگه می‌داشتند.',
  [roomChoiceTextKey('the-other-side', 'hand-the-sim')]: 'سیم‌کارتِ مرده را به صدای روی صندلیِ دوم بدهید.',
  [roomChoiceHintKey('the-other-side', 'hand-the-sim')]: 'همان آدمی که پنهانی از بودنش دست کشیدید',
  [roomChoiceOutcomeKey('the-other-side', 'hand-the-sim', 0)]:
    '«بیا،» می‌گویید و آن را جلو می‌گیرید — چیپی کوچک و مرده، غیرفعال، بدونِ هیچ سیگنالِ باقی‌مانده‌ای. «این همان آدمی است که پنهانی از بودنش دست کشیدم.»',
  [roomChoiceOutcomeKey('the-other-side', 'hand-the-sim', 1)]:
    'صندلیِ دیگر بدونِ هیچ کلمه‌ای آن را می‌گیرد. این، به‌نوعی، صادقانه‌ترین تبادلی است که هر نسخه از شما تابه‌حال از پسش برآمده.',
  [roomExplanationKey('the-other-side', 0)]:
    'روبه‌رویتان صدایی نشسته، ساخته‌شده کاملاً از چیزهایی که در آخرین اقامتتان اینجا گفتید و انتخاب کردید — نه یک شبح، بلکه پژواکِ نسخه‌ای پیشین از خودتان. پژوهشِ جای‌گیریِ دیدگاه بدونِ ابهام است: وقتی به‌طورِ کوتاه اما پیوسته تمرین شود، به‌طورِ قابلِ‌اندازه‌گیری، بیشتر از تقریباً هر مداخله‌ی دیگرِ بررسی‌شده‌ای، تعارضِ مخرب را نرم می‌کند — این اتاق کلِ سرفصلِ درسیِ این هتل را به یک تمرین تبدیل می‌کند.',
  [roomNoteTitleKey('the-other-side')]: 'صندلیِ دوم',
  [roomNoteThinkersKey('the-other-side')]: 'پژوهشِ جای‌گیریِ دیدگاه',
  [roomNoteBodyKey('the-other-side')]:
    'مداخله‌های جای‌گیریِ دیدگاه — عمداً تصورکردن و بیان‌کردنِ یک تعارض از طرفِ دیگر — در مطالعاتِ کنترل‌شده، به‌طورِ قابلِ‌اندازه‌گیری، رفتارِ تعارضیِ مخرب را کاهش می‌دهند، و این اثر حتی از تمرین‌های کوتاه و یک‌جلسه‌ای هم جان سالم به‌در می‌برد. **این یک مهارت است، نه یک خصیصه: بدونِ تمرین محو می‌شود، و باید تمرین شود — که کلِ فرضِ بنیادینِ این اتاق همین است.** هر دعوایی در این هتل دو راویِ اول‌شخص داشت. زیرزمین هر دو ضبط را نگه می‌دارد.',
});
register(roomBeatKey('the-other-side', 0, 2), 'v2', 'fa', (s: RunState) => {
  const moments = pickShadowMoments(s.prior);
  if (moments.length === 0) return ECHO_EMPTY_FALLBACK_FA;
  const lines = moments.map((e) => `«${e.choiceText}»`).join(' سپس: ');
  return `دو یا سه جمله‌ی خودتان را برایتان بازمی‌گوید — نیم‌پرده صاف‌تر از آنچه یادتان است گفته‌اید، همان‌طور که موضعِ دفاعی از صندلیِ گیرنده به‌گوش می‌رسد: ${lines}`;
});
register(roomBeatKey('the-other-side', 0, 3), 'v2', 'fa', (s: RunState) => {
  if (choseInPrior(s.prior, 'the-rumor', 'set-the-trap')) {
    return 'تله را هم به‌یاد دارد — همان نسخه از شما که برای کسی که دوستش داشت، تله‌ای گذاشت. «جواب داد،» می‌گوید، و خودش را با نوعی صداقتِ حسرت‌بار نقل‌قول می‌کند. «آن هیچ‌وقت بخشِ موردِ تردید نبود.»';
  }
  if (choseInPrior(s.prior, 'the-rumor', 'trust-without-asking')) {
    return 'دریاچه را هم به‌یاد دارد — همان نسخه از شما که تصمیم گرفت هیچ‌وقت ندانَد. «اعتماد، تمرین‌شده به‌جای حس‌شده،» می‌گوید، و برای یک‌بار انگار در حالِ جروبحث نیست.';
  }
  return 'اشاره‌ای به شایعه نمی‌کند. یا هرگز به آن نرسیدید، یا آن بخشی از شما نبود که امشب لازم بود بلند گفته شود.';
});
register(roomBeatKey('the-other-side', 0, 4), 'v2', 'fa', (s: RunState) => {
  const id = s.prior?.endingId;
  if (!id) return 'نمی‌داند دفعه‌ی قبل چطور رفتید. به‌نظر می‌رسد بعضی چیزها را حتی این اتاق هم نگه نمی‌دارد.';
  const title = ENDING_TITLE_BY_ID[id] ?? id;
  return `این را هم می‌داند که چطور رفتید — نه بابتش مغرور است، نه شرمنده، که به‌نوعی از هردویشان بدتر است. «${title}،» می‌گوید، یک‌بار، بی‌روح، و تکرارش نمی‌کند.`;
});
