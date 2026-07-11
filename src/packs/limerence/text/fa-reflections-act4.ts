// Farsi translations for LIMERENCE Act IV's Examined Path reflections (spec
// 05). Every line is translated with the specific room's actual situation
// and the choice's real stakes in mind, not word-for-word from English —
// see CLAUDE.md's translation rule. Only two of Act IV's three rooms carry
// any `reflections` field in the English source: the-kitchen-table (four of
// its five choices; place-the-unsent-letter has none) and the-morning-desk
// (three choices, stage 0 only — none of stage 1's checkout choices carry
// reflections). The-unsent has no `reflections` field on any of its six
// choices in the English source and is correctly absent from this file.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'fa', {
  // ---------- The Kitchen Table ----------
  [reflectionKey('the-kitchen-table', 'stay-for-them', 'consequence')]:
    'ماندن امروز خانواده را حفظ می‌کند، به قیمتی که کاملاً بستگی دارد به اینکه آیا این پیمان مراقبت می‌شود یا کنار گذاشته می‌شود.',
  [reflectionKey('the-kitchen-table', 'stay-for-them', 'duty')]:
    'این تعهدی به بچه‌ها را محترم می‌شمرد، هرچند به‌تنهایی حل نمی‌کند آنچه به همدیگر بدهکارید.',
  [reflectionKey('the-kitchen-table', 'stay-for-them', 'virtue')]:
    'این انتخابی است که ماهیتش به نگه‌داری بستگی دارد — می‌تواند داربست باشد یا تعویق، و فقط صبح‌های بعدی خواهند گفت کدام‌یک.',
  [reflectionKey('the-kitchen-table', 'stay-for-them', 'care')]:
    'بچه‌ها امروز صبح خانه‌ای باثبات دارند — اینکه آیا همین‌طور می‌ماند، سوالی جداگانه و ادامه‌دار است.',
  [reflectionKey('the-kitchen-table', 'separate-well', 'consequence')]:
    'جداشدنِ خوب، رابطه را با نتیجه‌ای کم‌تعارض‌تر معامله می‌کند که پژوهش می‌گوید واقعاً از بچه‌ها محافظت می‌کند.',
  [reflectionKey('the-kitchen-table', 'separate-well', 'duty')]:
    'این به آنچه بچه‌ها سزاوارش‌اند احترام می‌گذارد — جدایی‌ای خوب‌مدیریت‌شده — بیش از ظاهرِ یک خانواده‌ی سالم.',
  [reflectionKey('the-kitchen-table', 'separate-well', 'virtue')]:
    'این سوگواری‌ای است که با انضباطِ واقعی مدیریت شده، انتخاب‌شده به‌جای کینه‌ی خاموش یا تعارضِ علنی.',
  [reflectionKey('the-kitchen-table', 'separate-well', 'care')]:
    'این عمداً حولِ آنچه بچه‌ها واقعاً با خودشان حمل می‌کنند ساخته شده، نه حولِ راحتیِ هیچ‌کدام از والدین.',
  [reflectionKey('the-kitchen-table', 'attempt-repair', 'consequence')]:
    'تلاش برای ترمیم، کوششِ واقعی را در برابرِ نتیجه‌ای نامعلوم به خطر می‌اندازد، در ازای شانسِ چیزی بهتر از ماندنِ بی‌تغییر یا رفتن.',
  [reflectionKey('the-kitchen-table', 'attempt-repair', 'duty')]:
    'این به تعهدِ اصلیِ رابطه احترام می‌گذارد، با واقعاً آزمودنِ اینکه آیا می‌شود نگهش داشت، نه با فرض‌کردنِ از پیش، به هر طرف.',
  [reflectionKey('the-kitchen-table', 'attempt-repair', 'virtue')]:
    'این انضباطی مداوم و بی‌جلوه است — حاضرشدن سرِ جلسه‌ی دوم، که آزمونِ واقعی همان است.',
  [reflectionKey('the-kitchen-table', 'attempt-repair', 'care')]:
    'این با هرچه اتفاق افتاده مثلِ زنگِ خطری رفتار می‌کند که ارزشِ فهمیدن دارد، نه فقط جرمی که ارزشِ مجازات دارد — چارچوبی سخت‌تر و مفیدتر برای هر دویتان.',
  [reflectionKey('the-kitchen-table', 'say-the-unsayable', 'consequence')]:
    'گفتنِ ناگفتنی، سوال‌های عملیِ امروز صبح را حل نمی‌کند، اما معنای واقعیِ هر جوابِ بعدی را عوض می‌کند.',
  [reflectionKey('the-kitchen-table', 'say-the-unsayable', 'duty')]:
    'هر دویتان مدت‌ها پیش از این صبح سزاوارِ این جمله بودید — دیر‌رسیدنش این بدهی را باطل نمی‌کند.',
  [reflectionKey('the-kitchen-table', 'say-the-unsayable', 'virtue')]:
    'این عریان‌ترین صداقتِ در دسترس در این اتاق است، پیشکش‌شده بدونِ دانستنِ اینکه چه هزینه‌ای خواهد داشت.',
  [reflectionKey('the-kitchen-table', 'say-the-unsayable', 'care')]:
    'این با طرفِ مقابل مثلِ کسی رفتار می‌کند که سزاوارِ عمیق‌ترین حقیقتِ در دسترس است، نه نسخه‌ی کنترل‌شده‌اش.',

  // ---------- The Morning Desk ----------
  [reflectionKey('the-morning-desk', 'stand-by-all', 'consequence')]:
    'پشتِ هر انتخابی ایستادن، هیچ‌چیز را درباره‌ی آنچه از قبل اتفاق افتاده عوض نمی‌کند — فقط آنچه را الان حاضرید درباره‌اش بگویید عوض می‌کند.',
  [reflectionKey('the-morning-desk', 'stand-by-all', 'duty')]:
    'شما به سابقه‌ی خودتان یک امضای صادقانه بدهکارید، هرچقدر هم هزینه داشته باشد — و همین الان یکی را، کامل، دادید.',
  [reflectionKey('the-morning-desk', 'stand-by-all', 'virtue')]:
    'بپرسید یک دفترحسابِ کاملاً امضاشده درستکاری است، یا زره‌ای که آن‌قدر پوشیده شده که دیگر حسِ یک انتخاب را نمی‌دهد.',
  [reflectionKey('the-morning-desk', 'stand-by-all', 'care')]:
    'دربان این را بدونِ بی‌رحمی یادداشت می‌کند — این امضا مالِ هرکسی که بود، دادنش یا ندادنش با شما بود، و شما کامل دادیدش.',
  [reflectionKey('the-morning-desk', 'name-what-changed-me', 'consequence')]:
    'نام‌بردنِ آنچه شما را عوض کرد، انتخابِ قبلی را باطل نمی‌کند — یک ردیفِ صادقانه‌ی دوم کنارِ اولی اضافه می‌کند.',
  [reflectionKey('the-morning-desk', 'name-what-changed-me', 'duty')]:
    'به میزِ پذیرش، و به خودتان، هم رسید بدهکارید هم بازنگری — نام‌بردنِ اتاقی که شما را عوض کرد، نیمه‌ی سخت‌ترش است.',
  [reflectionKey('the-morning-desk', 'name-what-changed-me', 'virtue')]:
    'بپرسید بازنگریِ سابقه اینجا رشد است، یا راهی راحت برای انکارِ کسی که پیش از بهتر دانستن بودید.',
  [reflectionKey('the-morning-desk', 'name-what-changed-me', 'care')]:
    'میزِ پذیرش با خودی که می‌تواند نظرش را عوض کند، مثلِ چیزی زنده‌تر رفتار می‌کند تا خودی که نمی‌تواند — همین لطف، بی‌سروصدا، به کسی هم که قبلاً بودید، تعمیم داده می‌شود.',
  [reflectionKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 'consequence')]:
    'اعتراف‌کردن به شکاف پرش نمی‌کند — انتخاب‌هایی که درونش گرفته شده‌اند، دقیقاً به همان اندازه‌ی قبل از این اعتراف، بی‌شاهد می‌مانند.',
  [reflectionKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 'duty')]:
    'به میزِ پذیرش یک توضیحِ صادقانه بدهکارید، حتی سوراخ‌هایش را — اعتراف‌کردن به شکاف، بیشتر از وانمودکردنِ خلافش، این بدهی را ادا می‌کند.',
  [reflectionKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 'virtue')]:
    'بپرسید تردیدِ میزِ پذیرش نسبت به پرونده‌ای دست‌نخورده که مدعیِ غیبت است، منصفانه است، یا بعضی شکاف‌ها بدونِ هیچ تله‌ای که بشود مقصرش دانست، واقعی‌اند.',
  [reflectionKey('the-morning-desk', 'some-rooms-i-wasnt-present-in', 'care')]:
    'هرچه دربان درباره‌اش فکر کند، می‌گذارد بگذرد — رحمتی کوچک، به مهمانی داده‌شده که برای بخشی از این ماجرا، واقعاً کامل آنجا نبود.',
});
