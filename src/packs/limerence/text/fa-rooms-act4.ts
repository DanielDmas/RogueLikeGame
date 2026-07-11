// Farsi translation of LIMERENCE's Act IV room prose (beats, choice
// text/hint/outcome, field notes, plain-language explanations). Registered
// under version 'v2'. Follows the structural pattern established by Act I's
// src/packs/limerence/text/fa-rooms.ts, Act II's fa-rooms-act2.ts and Act
// III's fa-rooms-act3.ts — see CLAUDE.md's "Translating content" rule: every
// line here was translated against the room's actual beats and each
// choice's stakes, not word-for-word. Act IV is the finale — the checkout
// floor — and its cast has aged into whatever Act III left them: parents
// mid-separation, people confessing or not confessing, a guest handed the
// Porter's own ledger at the very end. The register stays as frank and
// unglamorous as Act III's, but with the specific gravity of an ending:
// less argument, more reckoning. As in the Farsi Act III pass, Dana and the
// player character need no special grammatical handling — Farsi has no
// gendered third-person pronouns or verb conjugation, so this is a
// non-issue here exactly as it was there (unlike the Czech pass, which had
// to pick a default gender for agreement). "The Porter" stays "دربان"
// throughout, never the Farsi word this pack reserves for ANAMNESIS's own
// guide character (see prior act files' headers for that word) — including
// for the generic English word "keeper" in "the rooms always need a
// keeper," which is rendered as "متصدی" (attendant/custodian) rather than
// reaching for that reserved word as a loose synonym. "Dana," "Tom," and
// "Nadia" are transliterated
// into Persian script, matching their established forms from the Farsi Act
// I/II/III passes ("دانا", "تام", "نادیا"). Numerals: Western digits for
// citation years in field-note thinkers lines, Persian digits for
// in-fiction numbers within narrative prose, matching established
// convention. Room title/doorHint/teaser fields are not translated anywhere
// in this project.
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
import { choseIn, hasFlag } from '../../../engine/gameState';
import { mirrorUnlocked } from '../endingLogic';

/** Mirrors act4.ts's own flag lists — needed here only for the-kitchen-
 * table's opening beat, which branches on the same union checks. */
const YOURS_FLAGS = ['confessed-whole', 'crossed-at-the-conference', 'carried-alone', 'trickle-truth', 'stayed-the-third'];
const THEIRS_FLAGS = ['played-detective', 'chose-not-to-know', 'steadied-first'];

/** Mirrors act4.ts's own ACT1_ROOM_IDS — needed here only for the-unsent's
 * "to your 16-year-old self" letter, which looks up the player's first Act I
 * transcript entry. */
const ACT1_ROOM_IDS = [
  'the-read-receipt',
  'the-screenshot',
  'the-password',
  'the-party',
  'the-forward',
  'the-best-friends-girl',
  'the-summer-ends',
];

// ---------- The Kitchen Table ----------
registerAll('v2', 'fa', {
  [roomBeatKey('the-kitchen-table', 0, 0)]:
    'آشپزخانه، ساعتِ ۰۶:۴۰. روی یخچال یک نقاشی است — نقاشیِ یک بچه — که با آهن‌ربایی به‌شکلِ توت‌فرنگی نگه داشته شده؛ به‌نحوی باربر است، آن‌طور که هیچ‌چیزِ دیگری در این اتاق نیست.',
  [roomBeatKey('the-kitchen-table', 0, 2)]:
    'دو صندلی، یک میز. گوشی حالا رو به بالا، بینِ شما، بی‌اهمیت افتاده — هرچه زمانی معنایش بود، دیگر تمام شده که آن معنا را بدهد.',
  [roomBeatKey('the-kitchen-table', 0, 3)]:
    'اولین جمله‌ی باقیِ راه هنوز گفته نشده، و امروز صبح هیچ‌کدامتان مطمئن نیست نوبتِ کدام‌یک است که آن را بگوید.',
  [roomBeatKey('the-kitchen-table', 0, 4)]:
    'چهار آینده، دورِ میز نشسته‌اند، مثلِ مهمان‌هایی که بی‌دعوت از راه رسیده‌اند. بچه‌ها طبقه‌ی بالا خوابند — وزنِ حضورشان در خانه به آکوستیک ترجمه شده: هر کلمه‌ای اینجا خودبه‌خود بلندیِ مجازِ خودش را می‌سنجد.',
  [roomBeatKey('the-kitchen-table', 0, 5)]:
    'دربان (فقط لحظه‌ای، در آینه‌ی راهرو): «صبح‌های طبقه‌ی بالا تنها بخشِ این هتل است که نمی‌توانم واردش شوم. میزِ پذیرش فقط این را تایید می‌کند: این میز باربر است. رویش بسازید یا خالی‌اش کنید. هر دو را تاب می‌آورد.»',
  [roomChoiceTextKey('the-kitchen-table', 'stay-for-them')]: 'بمانید، به‌خاطرِ بچه‌ها. این را بلند، به همدیگر، بگویید.',
  [roomChoiceHintKey('the-kitchen-table', 'stay-for-them')]: 'پیمانی، به‌روشنی نام‌گذاری‌شده',
  [roomChoiceOutcomeKey('the-kitchen-table', 'stay-for-them', 1)]:
    'آن دوراهی درونِ خودِ این انتخاب زندگی می‌کند، نه بیرونش. اینکه این پیمان کدام‌یک از این دو می‌شود، بعداً تصمیم گرفته می‌شود، در اتاق‌هایی که این صبح اجازه‌ی دیدنشان را ندارد.',
  [roomChoiceTextKey('the-kitchen-table', 'separate-well')]: 'جدا شوید، و همه‌چیز را صرفِ خوب‌انجام‌دادنش کنید.',
  [roomChoiceHintKey('the-kitchen-table', 'separate-well')]: 'سوگواری، در روشناییِ روز',
  [roomChoiceOutcomeKey('the-kitchen-table', 'separate-well', 0)]:
    'فاجعه‌ای بی‌درام: لجستیک به‌جای مرثیه. یک ضربانِ کامل فقط تقویمِ تحویل‌دادنِ بچه‌هاست، و به‌نحوی سخت‌ترین بخش همین است.',
  [roomChoiceOutcomeKey('the-kitchen-table', 'separate-well', 1)]:
    'آنچه بچه‌ها با خودشان حمل می‌کنند، پژوهش روشن است، دنبال‌کننده‌ی میزانِ تعارض است — نه دسته‌بندیِ جداشدن یا نشدن. سوگواری، اینجا، در روشناییِ روز، عمداً انجام‌شده.',
  [roomChoiceTextKey('the-kitchen-table', 'attempt-repair')]: 'کار. نه کلمه. کار.',
  [roomChoiceHintKey('the-kitchen-table', 'attempt-repair')]: 'شروع کنید، بدونِ هیچ تضمینی',
  [roomChoiceOutcomeKey('the-kitchen-table', 'attempt-repair', 0)]:
    'هیچ مونتاژی نیست، هیچ تضمینی نیست — اتاق فقط هفته‌ی اول را نشان می‌دهد: فرمِ پذیرش، اولین صورت‌حسابِ صادقانه، رابطه‌ی نامشروع (مالِ هرکدامتان که بود) بررسی‌شده به‌عنوانِ زنگِ خطر، نه فقط جرم.',
  [roomChoiceOutcomeKey('the-kitchen-table', 'attempt-repair', 1)]:
    'آخرین ضربان، حضور در جلسه‌ی دوم است. این تمامِ پیروزیِ در دسترس تا این صبح است، و اتاق وانمود نمی‌کند که بیشتر از این است.',
  [roomChoiceTextKey('the-kitchen-table', 'say-the-unsayable')]:
    'آن یک چیز را بگویید که هرکدامتان از پیش از شروعِ همه‌ی این‌ها نگهش داشته‌اید.',
  [roomChoiceHintKey('the-kitchen-table', 'say-the-unsayable')]: 'پرمخاطره‌ترین درِ این میز',
  [roomChoiceOutcomeKey('the-kitchen-table', 'say-the-unsayable', 1)]:
    'بعد از این جمله، معنای هر انتخابِ دیگری سرِ این میز عوض می‌شود. اتاق همین‌جا تمام می‌شود، بدونِ حل‌کردنِ هیچ‌چیز — چون خودِ جمله، رویداد بود.',
  [roomChoiceTextKey('the-kitchen-table', 'place-the-unsent-letter')]: 'نامه‌ی نفرستاده را روی میز بگذارید، هنوز مهروموم.',
  [roomChoiceHintKey('the-kitchen-table', 'place-the-unsent-letter')]: 'الحاقیه‌ای به آنچه فاش شده، این صبح مالِ هرکدامتان که باشد',
  [roomChoiceOutcomeKey('the-kitchen-table', 'place-the-unsent-letter', 0)]:
    'آن را بینِ دو فنجان می‌گذارید، هنوز مهروموم، حالا سال‌ها قدیمی. هرچه در آن نوشته باشد، بیشتر از کشوی‌ای که سال‌ها در آن زندگی کرده، متعلق به این میز است.',
  [roomChoiceOutcomeKey('the-kitchen-table', 'place-the-unsent-letter', 1)]:
    'هیچ‌کدامتان هنوز بازش نمی‌کنید. همین‌که بالاخره آنجاست، قابلِ‌دیدن، خودش الحاقیه‌ای است به هرچه دیگر امروز صبح گفته شد.',
  [roomExplanationKey('the-kitchen-table', 0)]:
    'آنچه پژوهش درباره‌ی بچه‌ها و جدایی واقعاً نشان می‌دهد، مشخص و خلافِ‌شهود است: ماده‌ی فعال در سلامتِ روانیِ بچه‌ها، میزانِ مواجهه با تعارض است، نه ساختارِ خانواده — جدایی‌ای خوب‌مدیریت‌شده، به‌طورِ قابلِ‌اعتماد، بهتر از خانواده‌ای سالم‌مانده اما پرتعارض عمل می‌کند. بازتعریفِ استر پرل از روابطِ نامشروع به‌عنوانِ زنگِ خطر، نه فقط جرم، مفید است و محدودیت‌های واقعی هم دارد، اینجا به‌صراحت گفته‌شده: زنگِ خطر توضیح می‌دهد چرا اتفاقی افتاد؛ توجیهش نمی‌کند، و کسی که آن را به صدا درآورد، همچنان بدهکارِ یک توضیح است. «ماندن به‌خاطرِ بچه‌ها» انتخابی واقعی و قابلِ‌دفاع است — به‌شرطِ آنکه با یک برنامه‌ی نگه‌داریِ واقعی همراه باشد، نه فقط تصمیمی که یک‌بار سرِ میزِ آشپزخانه گرفته شده و دیگر هیچ‌وقت بازبینی نشده.',
  [roomNoteTitleKey('the-kitchen-table')]: 'میزِ باربر',
  [roomNoteThinkersKey('the-kitchen-table')]: 'Amato · Perel (2017)',
  [roomNoteBodyKey('the-kitchen-table')]:
    'دهه‌ها پژوهشِ پل آماتو درباره‌ی بچه‌ها و طلاق، به یک یافته بیش از بقیه همگرا می‌شوند: **ماده‌ی فعال، میزانِ مواجهه با تعارض است، نه ساختارِ خانواده** — بچه‌هایی که در خانواده‌های جداشده‌ی خوب‌مدیریت‌شده بزرگ می‌شوند، پیوسته بهتر از بچه‌هایی عمل می‌کنند که در خانواده‌ای سالم‌مانده اما پرتعارض بزرگ شده‌اند، و این فرضِ رایج که ماندن با هم خودبه‌خود انتخابِ امن‌تر است، جلوی داده‌ها دوام نمی‌آورد. بازتعریفِ پرل از خروج در برابرِ زنگِ خطر برای روابطِ نامشروع، نقدِ منصفانه‌ای هم دریافت کرده، برای اینکه چقدر آسان می‌شود از آن سوءاستفاده کرد تا آسیب را توجیه کرد؛ اگر با احتیاط و همان‌طور که مقصود بوده استفاده شود، فقط توضیح می‌دهد — زنگِ خطر می‌گوید چیزی در خانه نیاز به توجه دارد، هیچ‌وقت آنچه را در کشیدنش شکسته، توجیه نمی‌کند. پیش‌بینی‌کننده‌های واقعیِ ترمیم، در سراسرِ ادبیاتِ پژوهشی، ساختار، شاهد، و زمان‌اند — نه یک مکالمه‌ی واحد، هرچقدر هم خوب. نقاشیِ روی یخچال از هر نسخه‌ی این صبح جان سالم به‌در می‌برد. تصمیم بگیرید داخلِ کدام صبح بزرگ می‌شود.',
});
register(roomBeatKey('the-kitchen-table', 0, 1), 'v2', 'fa', (s: RunState) => {
  const yours = YOURS_FLAGS.some((f) => hasFlag(s, f));
  const theirs = THEIRS_FLAGS.some((f) => hasFlag(s, f));
  if (yours && theirs)
    return 'شبی که پشتِ سرتان است طولانی بود، و مالِ هر دویتان بود — آنچه شما انجام دادید، و آنچه به شما شد و بعد کشف شد. هیچ‌کدامِ این دو روایت، امروز صبح، دیگری را باطل نمی‌کند.';
  if (yours) return 'شبی که پشتِ سرتان است طولانی بود، و حسابش با شما بود — همان کاری که کردید، حالا کامل، و بالاخره، برملا.';
  if (theirs) return 'شبی که پشتِ سرتان است طولانی بود، و حسابش با او بود — همان کاری که با شما شد، حالا کامل، و بالاخره، برملا.';
  return 'شبی که پشتِ سرتان است طولانی بود، و هرچه می‌شد گفت، تا الان، دستِ‌کم یک‌بار گفته شده است.';
});
register(roomChoiceOutcomeKey('the-kitchen-table', 'stay-for-them', 0), 'v2', 'fa', (s: RunState) =>
  hasFlag(s, 'already-gone')
    ? 'پیمان، صادقانه روایت‌شده: می‌تواند داربستی نجیب باشد، یا یک تعویقِ بیست‌ساله — و اتاق وانمود نمی‌کند که ندیده شما از قبل، به هر شکلی جز درِ خانه، رفته‌اید.'
    : 'پیمان، صادقانه روایت‌شده: اگر نام‌گذاری شود و بارها بازبینی شود، دوام می‌آورد. اگر نام‌گذاری شود و بعد کنار گذاشته شود، تبدیل می‌شود به فاجعه‌ی خاموشِ صبحی خیلی دیرتر.',
);
register(roomChoiceOutcomeKey('the-kitchen-table', 'say-the-unsayable', 0), 'v2', 'fa', (s: RunState) =>
  hasFlag(s, 'already-gone')
    ? '«می‌دانستم، و انتخاب کردم که ندانم» — اول همین گفته می‌شود، چون اول همین حقیقت داشت. پرمخاطره‌ترین درِ این اتاق، توسطِ کسی باز می‌شود که از قبل، بی‌سروصدا، رفته بود.'
    : '«سال‌ها پیش از آنکه کسی به کسی دست بزند، تنها بودم» — بالاخره، بلند، همین‌جا سرِ این میز، به کسی گفته می‌شود که همیشه موضوعِ اصلی همو بود.',
);

// ---------- The Unsent ----------
registerAll('v2', 'fa', {
  [roomBeatKey('the-unsent', 0, 0)]:
    'میزِ نوشتنی، آخرِ راهرو. یک پاکت‌نامه. دربان، پشتِ میز، چیزی شبیه ترازوی برنجیِ نامه در دست دارد.',
  [roomBeatKey('the-unsent', 0, 1)]:
    'یک پیام امشب این هتل را ترک می‌کند. نه به‌شکلِ ایمیل می‌رسد، نه تماسِ تلفنی — به‌شکلِ یک خواب می‌رسد، یک میلِ ناگهانی، آهنگی که درست در لحظه‌ی مناسب از رادیوی ماشین پخش می‌شود.',
  [roomBeatKey('the-unsent', 0, 2)]:
    'دربان: «این میز رسیدن را تضمین می‌کند. هیچ‌چیزِ دیگری را تضمین نمی‌کند — نه جوابی، نه بخششی، نه اینکه همان‌طور که مقصودتان بود فهمیده شود. یک پاکت‌نامه. آدرس را انتخاب کنید.»',
  [roomChoiceTextKey('the-unsent', 'to-the-one-you-hurt')]: 'به کسی که به او آسیب زدید.',
  [roomChoiceHintKey('the-unsent', 'to-the-one-you-hurt')]: 'جبران، بدونِ درخواستِ بخشش',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-you-hurt', 0)]:
    'دوبار می‌نویسیدش. پیش‌نویسِ اول، آرام، درخواستِ بخشش می‌کند. ترازو ردش می‌کند — نه با بی‌رحمی، فقط با دقت — تا وقتی آن درخواست خط بخورد.',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-you-hurt', 1)]:
    'پیش‌نویسِ دوم، جبران است بدونِ هیچ درخواستِ ضمیمه‌شده‌ای. نوشتنش سنگین‌تر است. فرستادنش، به‌نحوی، سبک‌تر.',
  [roomChoiceTextKey('the-unsent', 'to-the-one-who-hurt-you')]: 'به کسی که به شما آسیب زد.',
  [roomChoiceHintKey('the-unsent', 'to-the-one-who-hurt-you')]: 'نه بخشش — رهایی',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-who-hurt-you', 0)]:
    'نه نامه‌ی بخشش — اتاق نسبت به این تمایز دقیق است، و در آخر، شما هم همین‌طور.',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-who-hurt-you', 1)]:
    'نامه‌ای که به جمله‌ی «هنوز به من بدهکاری» با پاره‌کردنِ خودِ فاکتور پایان می‌دهد. نه به‌خاطرِ او. به‌خاطرِ دستی که تا الان نگهش داشته بود.',
  [roomChoiceTextKey('the-unsent', 'to-the-one-that-got-away')]: 'به کسی که از دستتان رفت.',
  [roomChoiceHintKey('the-unsent', 'to-the-one-that-got-away')]: 'نامه‌ای که آدم‌های صادق از نوشتنش می‌ترسند',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-that-got-away', 0)]:
    'نامه‌ای که آدم‌های صادق از آن می‌ترسند، بیشتر به‌خاطرِ آنچه ممکن است اصلِ نوشتنش معنایش باشد.',
  [roomChoiceOutcomeKey('the-unsent', 'to-the-one-that-got-away', 1)]:
    'اتاق دقیقاً یک جمله گرمی، فراتر از حسِ پایان، اجازه می‌دهد — نه بیشتر — می‌سنجدش، صادقانه‌اش می‌یابد، و می‌فرستدش.',
  [roomChoiceTextKey('the-unsent', 'to-your-16-year-old-self')]: 'به خودِ شانزده‌ساله‌تان.',
  [roomChoiceHintKey('the-unsent', 'to-your-16-year-old-self')]: 'مهربان‌ترین درِ این اتاق',
  [roomChoiceTextKey('the-unsent', 'to-your-own-kids-someday')]: 'به بچه‌های خودتان، یک روز.',
  [roomChoiceHintKey('the-unsent', 'to-your-own-kids-someday')]: 'آموزشی که در داستان تا خورده',
  [roomChoiceOutcomeKey('the-unsent', 'to-your-own-kids-someday', 0)]:
    'مهروموم. تاریخ‌خورده. «وقتی به‌اندازه‌ی کافی بزرگ شدید که در اتاق‌هایی مثلِ این‌ها باشید، بازش کنید.»',
  [roomChoiceOutcomeKey('the-unsent', 'to-your-own-kids-someday', 1)]:
    'کلِ هدفِ امشب، تا خورده در پاکتی به‌اندازه‌ی یک کشو کوچک، منتظرِ سالی که هنوز نمی‌توانید تصورش کنید.',
  [roomChoiceTextKey('the-unsent', 'blank-page')]: 'صفحه‌ی سفید را بفرستید.',
  [roomChoiceHintKey('the-unsent', 'blank-page')]: 'هرچه گفته‌نشده هم وزنی دارد',
  [roomChoiceOutcomeKey('the-unsent', 'blank-page', 0)]: 'سنگین‌ترین پاکتِ روی میز. اصلاً هیچ‌چیز رویش نوشته نشده.',
  [roomChoiceOutcomeKey('the-unsent', 'blank-page', 1)]:
    'به‌شکلِ یک مکثِ کنارِ در می‌رسد — کسی بی‌دلیل می‌ایستد و برای چهار ثانیه‌ی غیرقابلِ‌توضیح، حسِ همراه‌داشتن می‌کند. تمامِ آنچه تحویل داده می‌شود، همین است.',
  [roomExplanationKey('the-unsent', 0)]:
    'پژوهشِ نوشتارِ بیانی، در سنتی که جیمز پنه‌بیکر آغازش کرد، پیوسته فایده‌ای در نوشتن درباره‌ی تجربه‌های دشوار پیدا می‌کند، حتی وقتی آن نوشته هیچ‌وقت توسطِ کسِ دیگری خوانده نشود — اثرِ اندازه‌گیری‌شده روی خودِ نویسنده فرود می‌آید، نه گیرنده. این اتاق آن یافته را عین‌به‌عین جدی می‌گیرد: نامه به‌خاطرِ آنچه نوشتنش با شما می‌کند اهمیت دارد، و «حسِ پایان» اینجا صادقانه چیزی در نظر گرفته می‌شود که با خودِ عملِ نوشتن ساخته می‌شود، نه چیزی که منتظرِ پیداشدن در انتهای مسیر باشد.',
  [roomNoteTitleKey('the-unsent')]: 'نامه‌ای که به‌هرحال می‌رسد',
  [roomNoteThinkersKey('the-unsent')]: 'پژوهشِ نوشتارِ بیانی (خطِ پنه‌بیکر)',
  [roomNoteBodyKey('the-unsent')]:
    'دهه‌ها مطالعاتِ پنه‌بیکر درباره‌ی نوشتارِ بیانی چیزی پیدا کردند که فولکلورِ رایج پیرامونِ «حسِ پایان» معمولاً برعکس می‌فهمد: نوشتنِ نامه‌ای نفرستاده به کسی، به‌طورِ قابلِ‌اندازه‌گیری، به سلامتِ روانیِ نویسنده کمک می‌کند، چه آن نامه هیچ‌وقت خوانده شود چه نشود، و اغلب حتی چه گیرنده هنوز زنده باشد که بخواندش چه نباشد. **حسِ پایان، در این پژوهش، با خودِ عملِ نوشتن ساخته می‌شود — نه با گرفتنِ بالاخره یک جواب کشف می‌شود.** آدرسِ مشخص کمتر از خودِ عملِ نوشتنِ چیزی راست و کامل و رهاکردنِ آن اهمیت دارد. این یادداشتِ میدانی خودش را می‌نویسد — ورودیِ کدکس همان پیامی است که واقعاً انتخاب کردید بفرستید.',
});
register(roomChoiceOutcomeKey('the-unsent', 'to-your-16-year-old-self', 0), 'v2', 'fa', (s: RunState) => {
  const first = s.transcript.find((t) => ACT1_ROOM_IDS.includes(t.roomId));
  return first
    ? `پایینِ شکافِ نامه، و چهار طبقه پایین‌تر تا طبقه‌ی همکف. با نقل‌قولِ همان چیزی می‌رسد که واقعاً آن‌موقع گفتید — «${first.choiceText}» — این‌بار با همان مهربانی‌ای خوانده می‌شود که شانزده‌سالگی هرگز فرصتِ شنیدنش را نداشت.`
    : 'پایینِ شکافِ نامه، و چهار طبقه پایین‌تر تا طبقه‌ی همکف. دقیقاً همان جمله‌ای می‌رسد که هر بزرگسالی در این هتل در شانزده‌سالگی به آن نیاز داشت، نوشته‌شده توسطِ تنها کسی که صلاحیتِ نوشتنش را دارد.';
});

// ---------- The Morning Desk ----------
registerAll('v2', 'fa', {
  [roomBeatKey('the-morning-desk', 0, 0)]:
    'دوباره لابی، سپیده‌دم پشتِ درها. دربان پرونده‌ی شما را روی میز باز کرده. ضخیم‌تر از آن است که یادتان می‌آید نوشته باشید.',
  [roomBeatKey('the-morning-desk', 0, 1)]:
    'دربان: «صبح‌بخیر. پیش از آنکه بگذارم بروید، یا نگهتان دارم، یک مصاحبه‌ی کوتاه انجام می‌دهم. نه یک امتحان. یک ممیزی. شما این اقامت را صرفِ جواب‌دادن به اتاق‌ها کردید. حالا من درباره‌ی آن جواب‌ها می‌پرسم.»',
  [roomBeatKey('the-morning-desk', 0, 5)]:
    'دربان: «سرِ آخرین سوال عجله نکنید. هرچه در این طبقه‌ها انتخاب کردید — پشتش می‌ایستید؟»',
  [roomChoiceTextKey('the-morning-desk', 'stand-by-all')]: '«بله. تمامش. من همان را انتخاب کردم که انتخاب کردم، و دوباره هم امضایش می‌کنم.»',
  [roomChoiceHintKey('the-morning-desk', 'stand-by-all')]: 'ثبات، به‌عنوانِ چیزی از آنِ خود پذیرفته‌شده',
  [roomChoiceOutcomeKey('the-morning-desk', 'stand-by-all', 0)]:
    'دربان: «پایداری. کمیاب‌تر از آنی که تبلیغ می‌شود — بیشترِ مهمان‌ها دستِ‌کم یک اتاق را همان لحظه‌ای که واقعاً ازشان پرسیده می‌شود، انکار می‌کنند. شما کلِ دفترحساب را نگه داشتید، حتی ردیف‌هایی که برایتان هزینه داشتند.»',
  [roomChoiceOutcomeKey('the-morning-desk', 'stand-by-all', 1)]:
    'دربان: «بدونِ بی‌رحمی یادداشت می‌کنم که یک دفترحسابِ کاملاً امضاشده می‌تواند درستکاری باشد یا زره. از این طرفِ میز، این دو یکسان‌اند. بعداً، در ساعتی برنامه‌ریزی‌نشده، می‌فهمید کدام‌یک بوده. مهمان‌ها همیشه می‌فهمند.»',
  [roomChoiceTextKey('the-morning-desk', 'name-what-changed-me')]:
    '«نه — نه تمامش. می‌توانم دقیقاً بگویم چه چیزی و کجا مرا عوض کرد.»',
  [roomChoiceHintKey('the-morning-desk', 'name-what-changed-me')]: 'رشد، نام‌گذاری‌شده و پذیرفته‌شده',
  [roomChoiceOutcomeKey('the-morning-desk', 'name-what-changed-me', 0)]:
    'اسمِ اتاق را می‌برید. همان اتاقِ مشخص. نه یک حال‌وهوا — یک دلیل: چیزی که یک طبقه‌ی بعدی به طبقه‌ی قبلی‌تر یاد داد.',
  [roomChoiceOutcomeKey('the-morning-desk', 'name-what-changed-me', 1)]:
    'دستِ دربان، روی دفترحساب، مکث می‌کند — و برای اولین‌بار در کلِ امشب، حلقه‌ی ازدواج را روی دستِ راستش می‌بینید، و آن خطِ رنگ‌ورورفته و بی‌آفتاب‌خورده‌ای را جایی که یک‌بار، حلقه‌ای روی دستِ چپش بود. «این همان جوابی است که من برایش اینجا هستم،» می‌گوید، بدونِ آنکه سر بلند کند. «بازنگری، همراه با رسید. کمیاب‌تر، و بهتر، از ثبات.»',
  [roomChoiceTextKey('the-morning-desk', 'some-rooms-i-wasnt-present-in')]:
    '«بعضی‌هایش را به‌سختی به‌یاد دارم که انتخابشان کرده باشم. برای بخش‌هایی از این ماجرا، کامل حضور نداشتم.»',
  [roomChoiceHintKey('the-morning-desk', 'some-rooms-i-wasnt-present-in')]: 'شکافِ صادقانه',
  [roomChoiceOutcomeKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 1)]:
    'دربان: «بسیار خب. مصاحبه تمام شد. آنچه می‌ماند دیگر سوال نیست. آستانه است.»',
  [roomExplanationKey('the-morning-desk', 0)]:
    'پیش از آنکه آستانه باز شود، دربان کلِ اقامت را ممیزی می‌کند و می‌پرسد آیا هنوز پشتِ آن می‌ایستید — نه برای نمره‌دادن به شما، بلکه برای دیدنِ اینکه آیا درباره‌ی داستانِ خودتان صادق هستید یا نه. سوالِ واقعیِ زیرِ این همه: تحسین‌برانگیزتر است که کاملاً با هر انتخابی که تا حالا کرده‌اید ثابت‌قدم بمانید، یا رک بگویید: «اشتباه کردم، و دقیقاً این چیزی بود که نظرم را عوض کرد»؟ پژوهشِ هویتِ روایی با خود مثلِ داستانی زیرِ بازنگریِ مداوم و صادقانه رفتار می‌کند — هدف هیچ‌وقت این نبود که بی‌تغییر به این میز برسید.',
  [roomNoteTitleKey('the-morning-desk')]: 'پرونده‌ای که برایتان دوباره خوانده می‌شود',
  [roomNoteThinkersKey('the-morning-desk')]: 'پژوهشِ هویتِ روایی (خطِ مک‌آدامز) · دفترحسابِ خودِ هتل',
  [roomNoteBodyKey('the-morning-desk')]:
    'پژوهشگرانِ هویتِ روایی — دن مک‌آدامز در صدرشان — با خود نه مثلِ چیزی ثابت، بلکه مثلِ داستانی زیرِ نویسندگیِ مداوم و فعال رفتار می‌کنند: اینکه شما کی هستید، تا حدِ زیادی همان روایتی است که از چگونگیِ رسیدنتان به اینجا می‌دهید، و آن روایت هرچه بیشتر در آن زندگی می‌کنید، بیشتر بازنویسی می‌شود. از این منظر، روابط روایت‌هایی هستند با نویسندگیِ مشترک، و مهارتی که این هتل تمام‌وقت آموزش داده، خودِ همین ممیزی است: مالکیتِ کاملِ پرونده، حتی صفحاتی که ترجیح می‌دادید گم شده بودند یا بازنویسی شده بودند. **هر طبقه‌ای که این اقامت به‌صحنه آورد — رسیدِ خواندن، راهرو، میزِ آشپزخانه — یک سوال بود در اتاق‌های مختلف: وقتی پرونده‌تان برایتان دوباره خوانده می‌شود، آن امضا مالِ خودتان است؟**',
});
register(roomBeatKey('the-morning-desk', 0, 2), 'v2', 'fa', (s: RunState) => {
  const screenshot = ['tell-nadia', 'confront-tom', 'stay-out', 'verify-first'].find((id) => choseIn(s, 'the-screenshot', id));
  if (screenshot === 'tell-nadia')
    return 'دربان: «آن اسکرین‌شات. به نادیا، رک‌وپوست‌کنده، گفتید و گذاشتید عواقبش هرجا که می‌افتاد بیفتد — صادقانه، حتی روی خودتان هم افتاد. همین‌جا، حالا که تام و نادیا هر دو مدت‌هاست از این ساختمان رفته‌اند، هنوز پشتِ آن کار می‌ایستید؟»';
  if (screenshot === 'confront-tom')
    return 'دربان: «آن اسکرین‌شات. اول به تام حقِ انتخاب دادید، با یک مهلت. آخرش سرِ آن مهلت ماندید؟ و مهم است الان که ماندید یا نه؟»';
  if (screenshot === 'stay-out')
    return 'دربان: «آن اسکرین‌شات. گفتید به شما مربوط نیست، و پاکش کردید. آن راز، تا آنجا که یادم است، به‌جایش پیشِ خودتان نقلِ‌مکان کرد. هنوز همان‌جاست؟»';
  if (screenshot === 'verify-first')
    return 'دربان: «آن اسکرین‌شات. اول یقین ساختید، و در همین کار، فرصتِ اولین‌بودن با حقیقت را از دست دادید. معامله‌ی منصفانه‌ای بود یا نه — خودتان بگویید.»';
  return 'دربان: «آن درِ خاص را هرگز باز نکردید — همان دری که اسکرین‌شات درونش بود. جالب است. پس رک و بدونِ صحنه‌آرایی می‌پرسم: پارتنرِ یک دوست، گیرافتاده، در دستِ شما، در گوشیِ کسِ دیگری. واقعاً چه‌کار می‌کنید؟»';
});
register(roomBeatKey('the-morning-desk', 0, 3), 'v2', 'fa', (s: RunState) =>
  hasFlag(s, 'confessed-whole')
    ? 'دربان: «آن اعتراف — کامل، به کسی که به او مربوط می‌شد، گفته شد. این نوعِ صداقت در این پرونده کمیاب‌تر از آن است که مهمان‌ها دوست دارند باور کنند. پشتِ هزینه‌ای که از او خواست، می‌ایستید؟»'
    : hasFlag(s, 'carried-alone')
      ? 'دربان: «آن اعتراف — تنها، تا انتهای راه، با خودتان حمل شد. اتاقی درونِ شما که او کنارش زندگی می‌کند و هیچ‌وقت واردش نمی‌شود. آن رحم واقعاً مالِ او بود، یا فقط مالِ خودتان؟»'
      : hasFlag(s, 'trickle-truth')
        ? 'دربان: «آن اعتراف — قطره‌قطره، هربار که به چالش کشیده شد کمی راست‌تر شد. پرونده هر بازبینی‌اش را نشان می‌دهد. او هرکدام را حس کرده.»'
        : 'دربان: «هیچ اعترافی هیچ‌جای این پرونده نیست. یا هیچ‌کدام بدهکار نبود، یا یکی هنوز، همین امروز صبح، ثبت‌نشده مانده.»',
);
register(roomBeatKey('the-morning-desk', 0, 4), 'v2', 'fa', (s: RunState) =>
  s.memoryLost
    ? 'دربان: «آن تله، سرِ شایعه. فهمیدید او چه کرده، و تله‌گذاشتن برای کسی که دوستش دارید چه چیزی از دستی می‌سازد که آن تله را نگه داشته. در پرونده‌ی شما سوراخی هست، جایی که ندانستن قبلاً آنجا زندگی می‌کرد. از همین‌جا می‌توانم ببینمش. ارزشش را داشت؟»'
    : 'دربان: «هیچ سوراخی در این پرونده نیست — هیچ‌وقت ندانستن را با یک یقین معامله نکردید. بعضی مهمان‌ها اسمش را اعتماد می‌گذارند. بعضی می‌گویند هیچ‌وقت آن‌قدر سخت آزمایش نشدید که نیازش بیفتد. من حکمی صادر نمی‌کنم.»',
);
register(roomChoiceOutcomeKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 0), 'v2', 'fa', (s: RunState) =>
  s.memoryLost
    ? 'دربان: «در موردِ شما، این طفره نیست. مستندسازی است. سوراخی واقعی در شما هست، به‌شکلِ یک تله، و جواب‌هایی که در آن افتاده‌اند انکار نشده‌اند — فقط شاهد نداشته‌اند. شکاف‌هایی را که هزینه‌شان پرداخته شده، می‌پذیرم. مالِ شما رسید دارد.»'
    : 'دربان: «هوم. پرونده‌ی شما هیچ تله‌ای، هیچ سوراخی نشان نمی‌دهد — همه‌ی خاطرات حاضرند؛ آنچه غایب است، تمایل به ایستادن کنارشان است. «حضور نداشتم» از پرونده‌ای دست‌نخورده، مه‌ای است راحت. می‌گذارم بگذرد. من یک میزم، نه قاضی. اما هر دو شنیدیمش.»',
);

registerAll('v2', 'fa', {
  [roomBeatKey('the-morning-desk', 1, 0)]:
    'مشبک — یا هرچه بود، یک میز، یک آینه، یک آدم — آرام می‌گیرد، و درهای لابی رو به نوری باز می‌شوند که مالِ این هتل نیست.',
  [roomBeatKey('the-morning-desk', 1, 1)]:
    'آن بیرون صبح است. صبحی واقعی: جایی ترافیک، جایی یک کتری، کسبِ‌وکارِ عظیم و عادیِ کسی، سه قدم آن‌طرف‌تر.',
  [roomBeatKey('the-morning-desk', 1, 2)]:
    'دربان: «آخرِ خط. یا شروعِ یکی — بستگی دارد از کدام جهت بخوانیدش. آستانه شما را برمی‌گرداند، به سروصدا، صورت‌ها، دعواهای ناتمام، همه‌چیز. بیشترِ مهمان‌ها همین را انتخاب می‌کنند. درِ خوبی است. خوب نگهش می‌دارم.»',
  [roomBeatKey('the-morning-desk', 1, 3)]:
    'دربان: «اما این تنها دری نیست که به رویتان باز است، و موظفم این را بگویم. می‌توانید بمانید — این اتاق‌ها همیشه به یک متصدی نیاز دارند، و من مدتِ خیلی درازی است دارم همین کار را می‌کنم. یا می‌توانید همین‌جا، دمِ آستانه، دراز بکشید و بگذارید ته‌مانده‌ی امشب آرام تمام شود. بعضی مهمان‌ها، در آخر، سکوت را انتخاب می‌کنند. جای من نیست که اسمش را باختن بگذارم.»',
  [roomChoiceTextKey('the-morning-desk', 'walk-out')]: 'بیرون بروید. برگردید به صبح، به سروصدا، به دنیا.',
  [roomChoiceHintKey('the-morning-desk', 'walk-out')]: 'بازگشت',
  [roomChoiceOutcomeKey('the-morning-desk', 'walk-out', 0)]:
    'به‌سمتِ نور قدم می‌گذارید. آستانه دقیقاً همان دمای درگاهیِ تابستان را دارد — همان نیم‌درجه تغییری که یعنی بیرون.',
  [roomChoiceOutcomeKey('the-morning-desk', 'walk-out', 1)]:
    'دربان (پشتِ سرتان صدا می‌زند): «هرچه آن بیرون پیدا کنید — همان مکالمه‌ای است که ترکش کردید. آن هیچ‌وقت وعده نبود. شما خودتان بازسازی بودید. مواظبِ پله باشید.»',
  [roomChoiceTextKey('the-morning-desk', 'take-the-desk')]: 'بمانید. میز را بگیرید. حالا این کارِ شماست.',
  [roomChoiceHintKey('the-morning-desk', 'take-the-desk')]: 'معامله‌ی متصدی',
  [roomChoiceOutcomeKey('the-morning-desk', 'take-the-desk', 0)]:
    'از صبح رو برمی‌گردانید — واقعاً برمی‌گردانید، چیزی که لابی آن را با چیزی شبیهِ نفسِ حبس‌شده ثبت می‌کند — و دستتان را برای دفترحساب دراز می‌کنید.',
  [roomChoiceOutcomeKey('the-morning-desk', 'take-the-desk', 1)]:
    'دربان (هنوز تحویلش نمی‌دهد): «مطمئن باشید. ساعت‌ها ابدی‌اند، دستمزد هیچ است، و مهمان‌ها — خب، خودتان یکی‌شان بودید. هر یک‌شان را تماشا می‌کنید که با گوشی، راهرو، میز روبه‌رو می‌شود، و شاید هیچ‌وقت نتوانید جواب‌ها را بهشان بگویید، بیشتر برای اینکه اصلاً جوابی وجود ندارد.»',
  [roomChoiceOutcomeKey('the-morning-desk', 'take-the-desk', 2)]:
    'دربان (تحویلش می‌دهد — دفترحساب گرم است، اسمِ شما ناگهان درونش خوانا): «...به این میز خوش آمدید. اولین درس: حلقه و آن خطِ کم‌رنگ دقیقاً هم‌اندازه‌اند. عمدی است. اینجا همه‌چیز عمدی است.»',
  [roomChoiceTextKey('the-morning-desk', 'stop-carrying-it')]: 'دمِ آستانه دراز بکشید. بگذارید آرام، به شرطِ خودتان، تمام شود.',
  [roomChoiceHintKey('the-morning-desk', 'stop-carrying-it')]: 'سکوت',
  [roomChoiceOutcomeKey('the-morning-desk', 'stop-carrying-it', 0)]:
    'دراز می‌کشید، با صبحی سه قدم آن‌طرف‌تر، و این شکست نیست — دربان می‌فهمد، لابی هم می‌فهمد. این انتخابی است، با چشمانِ باز گرفته‌شده، توسطِ کسی که هر طبقه را پیمود تا حقِ گرفتنش را به‌دست بیاورد.',
  [roomChoiceOutcomeKey('the-morning-desk', 'stop-carrying-it', 1)]:
    'دربان (کنارتان می‌نشیند، دفترحساب را کنار می‌گذارد): «پس من هم می‌مانم تا تمام شود. در نوبت‌کاریِ من هیچ مهمانی تنها محو نمی‌شود. می‌دانید، این پایان نیست. جزر و مد است.»',
  [roomChoiceTextKey('the-morning-desk', 'laughing-door')]: 'آن درِ کوچک. آن خنده. بازش کنید.',
  [roomChoiceHintKey('the-morning-desk', 'laughing-door')]: 'حقِ متوجه‌شدنش را به‌دست آورده‌اید',
  [roomChoiceOutcomeKey('the-morning-desk', 'laughing-door', 0)]:
    'به‌سمتِ آن درِ کوچک و ساده می‌روید، و دستگیره پیش از آنکه کاملاً بگیریدش می‌چرخد، همان‌طور که یک دوست از طرفِ دیگر باز می‌کند.',
  [roomChoiceOutcomeKey('the-morning-desk', 'laughing-door', 1)]:
    'دربان (پشتِ سرتان، و برای یک‌بار در صدایش نه اثری از حلقه هست، نه از نبودش): «مهمان‌های خیلی کمی اصلاً این در را می‌بینند. حتی کمترشان بازش می‌کنند. پس بروید. من چراغ‌ها را خاموش می‌کنم.»',
  [roomChoiceTextKey('the-morning-desk', 'i-know-every-room')]: '«من هر اتاق را می‌شناسم.»',
  [roomChoiceHintKey('the-morning-desk', 'i-know-every-room')]: 'نه یک در — یک جمله',
  [roomChoiceOutcomeKey('the-morning-desk', 'i-know-every-room', 0)]:
    'به‌سمتِ هیچ‌کدام از درها قدم نمی‌گذارید. به‌جایش آن را می‌گویید، همان‌طور که یک واقعیت را می‌گویید، نه یک آرزو را — و همین گفتن، از قبل، بیشترِ آن اتفاقی است که می‌افتد.',
  [roomChoiceOutcomeKey('the-morning-desk', 'i-know-every-room', 1)]: 'دربان کاملاً بی‌حرکت می‌شود، یک دست روی دفترحساب، و بستنش را تمام نمی‌کند.',
  [roomExplanationKey('the-morning-desk', 1)]:
    'آستانه باز است، و انتخاب بالاخره این است که این اقامت واقعاً چطور تمام می‌شود: برگشتن به یک زندگیِ عادی، ماندن برای کمک به مهمانِ بعدی، یا اجازه‌دادن به خودتان برای استراحتی کامل. هیچ‌کدامِ این‌ها پایانِ درست نیست — هرکدام جوابی متفاوت و به‌همان‌اندازه صادقانه است به اینکه همین الان، بعدِ همه‌چیزِ این طبقه‌ها، واقعاً چه می‌خواهید.',
});
register(roomBeatKey('the-morning-desk', 1, 4), 'v2', 'fa', (s: RunState) =>
  mirrorUnlocked(s)
    ? 'و آنجاست — تازه همین الان متوجهش می‌شوید، و می‌فهمید که همه فرصتِ متوجه‌شدنش را ندارند — یک درِ چهارم. کوچک. ساده. از پشتش: صدای ریختنِ دو فنجان، و خنده‌ای که بی‌شک، دقیقاً شبیهِ خنده‌ی خودِ شماست.'
    : 'یک‌جایی کنار، نیمه‌متوجهِ درِ کوچک و ساده‌ای می‌شوید که تقریباً مطمئنید وقتِ ورودتان در لابی نبود. قفل است. از پشتش، ضعیف: صدای خنده. دربان نگاهتان را دنبال می‌کند. «این‌بار نه،» آرام می‌گوید — هم یک حکم است، هم دعوتی برای برگشتن.',
);
