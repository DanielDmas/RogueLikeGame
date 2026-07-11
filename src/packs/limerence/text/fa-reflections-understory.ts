// Farsi translations for LIMERENCE Understory's Examined Path reflections
// (spec 05). Every line is translated with the specific room's actual
// situation and the choice's real stakes in mind, not word-for-word from
// English — see CLAUDE.md's translation rule. The-doors-not-opened carries
// a `reflections` field on all three of its choices in the English source.
// The-other-side carries `reflections` on three of its four choices
// (hand-the-sim has none). The-registry has no `reflections` field on any
// of its four choices in the English source and is correctly absent from
// this file.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'fa', {
  // ---------- The Doors Not Opened ----------
  [reflectionKey('the-doors-not-opened', 'enter-late', 'consequence')]:
    'هرچه آنجا منتظر بود، یا اتفاق افتاد یا نیفتاد — الان واردشدن هیچ‌چیز را درباره‌ی آنچه آن‌موقع ممکن بود عوض نمی‌کند.',
  [reflectionKey('the-doors-not-opened', 'enter-late', 'duty')]:
    'به آن امکانِ قدیمی چیزی بدهکار نیستید جز صداقتِ بالاخره‌نگاه‌کردن — واردشدنِ دیرهنگام یک کنجکاویِ خصوصی را ادا می‌کند، نه دِینی که به کسی داشته باشید.',
  [reflectionKey('the-doors-not-opened', 'enter-late', 'virtue')]:
    'بپرسید واردشدنِ الان، حالا که دیگر هیچ هزینه‌ای ندارد، کنجکاویِ واقعیِ گرامی‌داشته‌شده است، یا تمرینِ امنِ شجاعت.',
  [reflectionKey('the-doors-not-opened', 'enter-late', 'care')]:
    'هیچ‌کس هیچ‌وقت در این اتاق منتظرِ شما نبود — تنها کسی که این دیدارِ دیرهنگام برای اوست، همان کسی است که در چارچوبِ در ایستاده.',
  [reflectionKey('the-doors-not-opened', 'close-it', 'consequence')]:
    'بستنش هیچ‌چیز را درباره‌ی آنچه درونش بود عوض نمی‌کند — در به‌سادگی به همان‌چیزی برمی‌گردد که پیش از توجه‌کردنتان بود.',
  [reflectionKey('the-doors-not-opened', 'close-it', 'duty')]:
    'به بعضی درها چیزی بدهکار نیستید جز احترامِ بسته‌گذاشتنشان — هر امکانی سزاوارِ نگاهِ دوباره نیست، فقط چون بالاخره پیشنهاد شده.',
  [reflectionKey('the-doors-not-opened', 'close-it', 'virtue')]:
    'بپرسید بستنش، خردی درباره‌ی این بود که کدام درها هرگز مالِ شما نبودند، یا اجتنابی آرام‌تر بود که خودش را زیرِ لباسِ خویشتن‌داری پنهان کرده.',
  [reflectionKey('the-doors-not-opened', 'close-it', 'care')]:
    'هیچ‌کس پشتِ آن در نیازی نداشت که بازش کنید — دقیقاً به همان دست‌نخوردگی‌ای که پیدایش کردید، ترکش می‌کنید.',
  [reflectionKey('the-doors-not-opened', 'ask-why-now', 'consequence')]:
    'پاشنه‌های روغن‌خورده به شما می‌گویند این در مشخصاً برای امشب آماده شده بود — اما دانستنِ این هیچ‌چیز را درباره‌ی اینکه از آن رد می‌شوید یا نه، عوض نمی‌کند.',
  [reflectionKey('the-doors-not-opened', 'ask-why-now', 'duty')]:
    'به خودِ پیشنهاد یک سوالِ صادقانه بدهکارید، پیش از آنکه به آن جوابی بدهکار باشید — پرسیدنِ اینکه چرا حالا، خودش نوعی وسواس است.',
  [reflectionKey('the-doors-not-opened', 'ask-why-now', 'virtue')]:
    'بپرسید بازخواستِ در، به‌جای فقط استفاده‌کردن از آن، دقتِ نظر است، یا راهی برای به‌تعویق‌انداختنِ انتخابِ سخت‌تر.',
  [reflectionKey('the-doors-not-opened', 'ask-why-now', 'care')]:
    'پاشنه‌ها فقط برای شما روغن خورده بودند — هرچه این زمان‌بندی معنایش باشد، این توجه هرگز برای کسِ دیگری در نظر گرفته نشده بود.',

  // ---------- The Other Side ----------
  [reflectionKey('the-other-side', 'answer-yourself', 'consequence')]:
    'جواب‌دادن هیچ‌چیز را درباره‌ی آنچه از قبل گفته شده عوض نمی‌کند — فقط عوض می‌کند که آیا شنیده شد یا نه.',
  [reflectionKey('the-other-side', 'answer-yourself', 'duty')]:
    'به خودِ پیشین‌تان یک اذعان بدهکارید، نه یک اصلاح — سلام‌کردن به آن، دِینِ بازشناسی است، نه توافق.',
  [reflectionKey('the-other-side', 'answer-yourself', 'virtue')]:
    'بپرسید مخاطب‌قراردادنِ آن صدا، به‌جای فقط شاهدبودنش، شجاعت است، یا عادتِ قدیمیِ نیاز به حرفِ آخر.',
  [reflectionKey('the-other-side', 'answer-yourself', 'care')]:
    'اتاق آرام می‌گیرد مثلِ نفسِ حبس‌شده‌ای که بالاخره توسطِ دو نفر به‌جای یکی رها شده — رحمتی کوچک، پیشکش‌شده به هرکه قبلاً بودید.',
  [reflectionKey('the-other-side', 'let-yourself-finish', 'consequence')]:
    'گذاشتنِ اینکه بدونِ وقفه حرفش را تمام کند، هیچ‌چیز را درباره‌ی آنچه می‌گوید عوض نمی‌کند — فقط عوض می‌کند که آیا این‌بار می‌تواند کامل بگویدش یا نه.',
  [reflectionKey('the-other-side', 'let-yourself-finish', 'duty')]:
    'به خودِ پیشین‌تان همان شنیدنی را بدهکارید که شاید بارِ اول ندادید — سکوت اینجا دِینِ توجه را ادا می‌کند، نه توافق را.',
  [reflectionKey('the-other-side', 'let-yourself-finish', 'virtue')]:
    'بپرسید ساکت‌ماندن صبر است، یا به‌سادگی راحت‌تر از این است که بفهمید جوابتان چه می‌بود.',
  [reflectionKey('the-other-side', 'let-yourself-finish', 'care')]:
    'سکوت کامل‌ترین چیزی است که در اتاق گفته شده — نوعی مراقبت که از آن صدا چیزی جز تمام‌کردنِ حرفش نمی‌خواهد.',
  [reflectionKey('the-other-side', 'sit-in-both-chairs', 'consequence')]:
    'نشستن روی هر دو صندلی هیچ‌چیز را درباره‌ی اینکه کدام نسخه از شما الان صحبت می‌کند عوض نمی‌کند — فقط وانمودِ اینکه هیچ‌وقت دو نفر بودند را از بین می‌برد.',
  [reflectionKey('the-other-side', 'sit-in-both-chairs', 'duty')]:
    'به هیچ مهمانی حضور بدهکار نیستید، چون پذیرفتنِ اینکه هیچ‌وقت مهمانی نبوده، خودِ ایده‌ی دِین میانِ میزبان و مهمان را از بین می‌برد.',
  [reflectionKey('the-other-side', 'sit-in-both-chairs', 'virtue')]:
    'بپرسید این صادقانه‌ترین و پرهزینه‌ترین حقیقتِ این اتاق است، یا راهی زیرکانه برای فرارکردن از واقعاً جواب‌دادن به آن صدا.',
  [reflectionKey('the-other-side', 'sit-in-both-chairs', 'care')]:
    'هیچ‌وقت مهمانی نبود که اینجا از او مراقبت شود — فقط رشته‌ای از خودِ شما، و آن مراقبت همیشه، به‌آرامی، معطوف به خودتان بود.',
});
