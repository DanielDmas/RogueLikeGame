// Farsi translations for LIMERENCE Act I's Examined Path reflections (spec
// 05). Every line is translated with the specific room's actual situation
// and the choice's real stakes in mind, not word-for-word from English —
// see CLAUDE.md's translation rule. The-front-desk (prologue) and
// the-summer-ends have no reflections field on any choice in the English
// source, so neither room appears here.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'fa', {
  // ---------- The Read Receipt ----------
  [reflectionKey('the-read-receipt', 'double-text', 'consequence')]:
    'دو پیامِ دیگر باعث نمی‌شود جواب زودتر برسد — فقط باعث می‌شود وقتی سکوت بشکند، خواندنش سخت‌تر باشد.',
  [reflectionKey('the-read-receipt', 'double-text', 'duty')]: 'به او صبر بدهکارید، نه یک احضارِ دوم.',
  [reflectionKey('the-read-receipt', 'double-text', 'virtue')]: 'توجه کنید وحشت، ساعت یک نیمه‌شب، تنها، شما را به چه‌جور شریکی تبدیل می‌کند.',
  [reflectionKey('the-read-receipt', 'double-text', 'care')]: 'او امشب یک‌جایی است با دلیلِ خودش — دلیلی که ربطی هم به پیامِ دوم ندارد.',
  [reflectionKey('the-read-receipt', 'drawer', 'consequence')]:
    'نتیجه هیچ‌وقت امشب دستِ شما نبود؛ نشستن با این حقیقت هیچ چیزی درباره‌ی صبح عوض نکرد، اما همه‌چیز درباره‌ی شب.',
  [reflectionKey('the-read-receipt', 'drawer', 'duty')]: 'هیچ‌کس پیامی را که هنوز سزاوارش نشده بود، طلبکار نبود.',
  [reflectionKey('the-read-receipt', 'drawer', 'virtue')]: 'این انضباطِ سخت‌تر و آرام‌تر است — تحمل‌کردنِ یک احساس، به‌جای خالی‌کردنش روی کسِ دیگر.',
  [reflectionKey('the-read-receipt', 'drawer', 'care')]: 'گذاشتید او یک عصرِ معمولی و دیده‌نشده داشته باشد، که خودش یک هدیه‌ی کوچک است.',
  [reflectionKey('the-read-receipt', 'bait', 'consequence')]: 'جوابی که با فوریتِ ساختگی به‌دست بیاید، مدرکِ هیچ‌چیزی نیست جز اینکه فوریت جواب می‌گیرد.',
  [reflectionKey('the-read-receipt', 'bait', 'duty')]: 'رابطه‌ای که با تست اداره می‌شود، رابطه‌ای است که صداقت بی‌سروصدا از آن رفته.',
  [reflectionKey('the-read-receipt', 'bait', 'virtue')]: 'این اولین تمرینِ کوچکِ آدمی است که به‌جای اعتمادکردن به آدم‌ها، مدیریتشان می‌کند.',
  [reflectionKey('the-read-receipt', 'bait', 'care')]: 'او به یک ترس جواب داد، نه سوالی که واقعاً از او پرسیده بودید.',
  [reflectionKey('the-read-receipt', 'ask-tomorrow', 'consequence')]: 'یک مکالمه چیزی را حل کرد که ده‌ها بار تماشای نقطه‌ها نتوانست.',
  [reflectionKey('the-read-receipt', 'ask-tomorrow', 'duty')]: 'یک سوالِ مستقیم به هر دوی شما بیشتر از یک سکوتِ رمزگشایی‌شده احترام می‌گذارد.',
  [reflectionKey('the-read-receipt', 'ask-tomorrow', 'virtue')]: 'منتظرماندن برای جوابِ واقعی، به‌جای ساختنِ یکی، خودش نوعی شجاعت است.',
  [reflectionKey('the-read-receipt', 'ask-tomorrow', 'care')]: 'گذاشتید او با کلماتِ خودش، در روشناییِ روز، بدون کمین، خودش را توضیح بدهد.',

  // ---------- The Screenshot ----------
  [reflectionKey('the-screenshot', 'tell-nadia', 'consequence')]:
    'نادیا حالا اطلاعاتی دارد که برای عمل‌کردن لازم است — هر آسیبی که حقیقت می‌زند، بالاخره روزی می‌افتاد؛ شما فقط زمانش را انتخاب کردید.',
  [reflectionKey('the-screenshot', 'tell-nadia', 'duty')]: 'این را صریح و بدون رای‌گیری به او بدهکار بودید.',
  [reflectionKey('the-screenshot', 'tell-nadia', 'virtue')]: 'این وفاداریِ سخت‌تر است — به کسی که به او دروغ گفته می‌شود، نه کسی که بیشتر می‌شناسیدش.',
  [reflectionKey('the-screenshot', 'tell-nadia', 'care')]: 'کسی را در مرکز گذاشتید که واقعاً آسیب می‌دید، نه آن دو دوستی‌ای که بدترش را هم از سر می‌گذرانند.',
  [reflectionKey('the-screenshot', 'confront-tom', 'consequence')]:
    'دادنِ اولویتِ انتخاب به تام فقط این را عوض می‌کند که چه کسی خبر می‌دهد، نه اینکه نادیا سرانجام می‌فهمد یا نه.',
  [reflectionKey('the-screenshot', 'confront-tom', 'duty')]: 'به دوستتان فرصت دادید خودش درستش کند، پیش از اینکه تصمیم را از او بگیرید.',
  [reflectionKey('the-screenshot', 'confront-tom', 'virtue')]: 'اولتیماتوم فقط وقتی صداقت دارد که واقعاً پایبندش بمانید — صادقانه از خودتان بپرسید که می‌ماندید یا نه.',
  [reflectionKey('the-screenshot', 'confront-tom', 'care')]: 'سعی کردید همزمان از دو رابطه محافظت کنید، و این تلاش یک مکالمه‌ی سخت‌تر برایتان هزینه دارد.',
  [reflectionKey('the-screenshot', 'stay-out', 'consequence')]: 'کنارکشیدن شما را از نتیجه بیرون نمی‌کشد؛ فقط شما را از تاثیرگذاشتن بر اینکه کدام نتیجه اتفاق بیفتد، بیرون می‌کشد.',
  [reflectionKey('the-screenshot', 'stay-out', 'duty')]: 'سکوت، اینجا هم، انتخابی است با یک گیرنده — نادیا فقط نمی‌داند این انتخاب برای او انجام شده.',
  [reflectionKey('the-screenshot', 'stay-out', 'virtue')]: 'بپرسید «به من ربطی نداره» شما را به چه‌جور دوستی برای دوستی که واقعاً فریب می‌خورد تبدیل می‌کند.',
  [reflectionKey('the-screenshot', 'stay-out', 'care')]: 'خودتان را از یک مکالمه‌ی سخت معاف کردید، به قیمتِ مکالمه‌ای که کسِ دیگری سزاوارش بود.',
  [reflectionKey('the-screenshot', 'verify-first', 'consequence')]:
    'تاییدکردن ریسکِ عمل‌کردن بر چیزی نادرست را کم کرد، به هزینه‌ی واقعیِ دیرتر عمل‌کردن از آنچه می‌توانستید.',
  [reflectionKey('the-screenshot', 'verify-first', 'duty')]: 'دقت یک فضیلت است، اما فضیلتی نیست که تاخیر را برای کسی که هنوز در تاریکی است توجیه کند.',
  [reflectionKey('the-screenshot', 'verify-first', 'virtue')]: 'احتیاط می‌تواند خودش نوعی اجتناب باشد، در لباسِ مسئولیت.',
  [reflectionKey('the-screenshot', 'verify-first', 'care')]:
    'آن یک ساعتِ اضافه چیزی از نادیا نگرفت که از قبل نمی‌دانست — اما از شما، انتخابِ کنترلِ چگونگیِ فهمیدنش را گرفت.',

  // ---------- The Password ----------
  [reflectionKey('the-password', 'give-it', 'consequence')]:
    'نتیجه‌ی فوری — یک هفته‌ی آرام‌تر — واقعی است؛ نتیجه‌ی بلندتر، عادتِ خودسانسوری، هم واقعی است، و اتاق هر دو را نشانتان می‌دهد.',
  [reflectionKey('the-password', 'give-it', 'duty')]: 'کلیدی که از سرِ ترس داده شود، نه آزادی، هیچ‌وقت واقعاً موردِ رضایتِ آن بخشی از شما نبود که مردد بود.',
  [reflectionKey('the-password', 'give-it', 'virtue')]: 'توجه کنید وقتی هر پیام با فکرِ یک خواننده‌ی خاموش نوشته می‌شود، به چه کسی تبدیل می‌شوید.',
  [reflectionKey('the-password', 'give-it', 'care')]: 'فاصله‌ای را که او خواسته بود بستید، اما روشی که بستیدش، فاصله‌ای دیگر به‌جایش ساخت.',
  [reflectionKey('the-password', 'refuse-flat', 'consequence')]:
    'مرزی که نگه داشته می‌شود، الان چیزی هزینه دارد و چیزِ بدتری بعداً اجتناب می‌شود — اتاق صادقانه هر دو را قیمت‌گذاری می‌کند.',
  [reflectionKey('the-password', 'refuse-flat', 'duty')]: 'به او مراقبت بدهکار بودید، نه دسترسی.',
  [reflectionKey('the-password', 'refuse-flat', 'virtue')]: 'این صداقتِ سخت‌تر و ناراحت‌کننده‌تر است — همان که رابطه را برای حفظِ خود به خطر می‌اندازد.',
  [reflectionKey('the-password', 'refuse-flat', 'care')]: 'یک نه‌ی قاطع، بدون تحقیر، هنوز جا باز می‌گذارد تا ترسش به شکلی دیگر رسیدگی شود.',
  [reflectionKey('the-password', 'transparency-not-surveillance', 'consequence')]:
    'جواب‌دادن صادقانه به هر سوالی، همان اطمینانی را می‌سازد که یک رمز می‌ساخت — بدون هزینه‌ی دائمی‌اش.',
  [reflectionKey('the-password', 'transparency-not-surveillance', 'duty')]: 'دقیقاً همان چیزی را پیشنهاد دادید که بدهکار بودید: باز بودن. نه دقیقاً همان چیزی که خواسته شده بود: دسترسی.',
  [reflectionKey('the-password', 'transparency-not-surveillance', 'virtue')]: 'این شکلِ پایدارتر و کم‌دراماترِ قابل‌اعتمادبودن است — در دسترس، نه زیرِ نظارت.',
  [reflectionKey('the-password', 'transparency-not-surveillance', 'care')]: 'با حضورتان به‌جای حریمِ خصوصی‌تان با ترسش روبه‌رو شدید.',
  [reflectionKey('the-password', 'demand-hers', 'consequence')]: 'تقارن هزینه‌ی نظارت را لغو نمی‌کند؛ فقط آن را بینِ هر دویتان تقسیم می‌کند.',
  [reflectionKey('the-password', 'demand-hers', 'duty')]: 'همانندکردنِ یک درخواستِ بد، مثلِ ردکردنش نیست.',
  [reflectionKey('the-password', 'demand-hers', 'virtue')]: 'بپرسید این رابطه به چه چیزی تبدیل می‌شود وقتی هر دو قفل، همزمان، از سرِ کینه‌ای در لباسِ انصاف، باز شوند.',
  [reflectionKey('the-password', 'demand-hers', 'care')]: 'هیچ‌کدامتان واقعاً با این اطمینان پیدا نمی‌کنید — فقط ترس را متقابل کردید.',

  // ---------- The Party ----------
  [reflectionKey('the-party', 'play-and-bury', 'consequence')]: 'امشب چیزِ قابل‌دیدنی عوض نمی‌شود، اما شانسِ اینکه این دفن‌شده بماند هیچ‌وقت کاملاً دستِ شما نبود.',
  [reflectionKey('the-party', 'play-and-bury', 'duty')]: 'رازی که از سارا پنهان می‌ماند، هنوز تصمیمی درباره‌ی اوست، بدونِ او.',
  [reflectionKey('the-party', 'play-and-bury', 'virtue')]:
    'توجه کنید به جمله‌ای که همین الان دارید تمرین می‌کنید — «حساب نشد» — و اینکه چه‌جور آدمی این جمله را متقاعدکننده می‌بیند.',
  [reflectionKey('the-party', 'play-and-bury', 'care')]: 'امشب از آسایشِ خودتان محافظت کردید، به هزینه‌ای که اگر روزی سر بلند کند، کاملاً روی او می‌افتد.',
  [reflectionKey('the-party', 'play-and-tell', 'consequence')]:
    'گفتن به او بوسه را پاک نمی‌کند، اما چیزی را که باید پردازش کند تغییر می‌دهد — خودِ عمل، نه خیانتِ پنهان‌کاری روی آن.',
  [reflectionKey('the-party', 'play-and-tell', 'duty')]: 'حقیقت را به او بدهکار بودید، و پیش از آنکه از شما بیرون کشیده شود، تحویلش دادید.',
  [reflectionKey('the-party', 'play-and-tell', 'virtue')]: 'این صداقتی پرهزینه است، انتخاب‌شده در حالی که هنوز می‌شد از آن اجتناب کرد.',
  [reflectionKey('the-party', 'play-and-tell', 'care')]: 'به او این عزت را دادید که از زبانِ شما بشنود، نه از یک اسکرین‌شات هفته‌ها بعد.',
  [reflectionKey('the-party', 'refuse', 'consequence')]: 'ردکردن امشب کمی اعتبارِ اجتماعی هزینه دارد و فردا هیچ‌چیز.',
  [reflectionKey('the-party', 'refuse', 'duty')]: 'قولی را نگه داشتید که صریحاً خواسته نشده بود اما واضح بدهکارش بودید.',
  [reflectionKey('the-party', 'refuse', 'virtue')]: 'این شخصیتی است که دقیقاً وقتی کمترین راحتی و کمترین شاهد را دارد، خودش را نشان می‌دهد.',
  [reflectionKey('the-party', 'refuse', 'care')]: 'آسایشِ کلارا اینجا هیچ‌وقت واقعاً در خطر نبود — اما اعتمادِ سارا، غایب، بود.',
  [reflectionKey('the-party', 'leave', 'consequence')]: 'ترک‌کردن همه‌ی نتایجِ ممکنِ جرأت را یک‌جا، تمیز، پیش از آنکه هرکدام اتفاق بیفتد، حذف می‌کند.',
  [reflectionKey('the-party', 'leave', 'duty')]: 'برای نپذیرفتنِ حضور در اتاقی که دقیقاً برای این تست ساخته شده، هیچ توضیحی بدهکار نبودید.',
  [reflectionKey('the-party', 'leave', 'virtue')]: 'بعضی‌وقت‌ها صادقانه‌ترین حرکت این است که اصلاً به خودتان برای این انتخاب اعتماد نکنید.',
  [reflectionKey('the-party', 'leave', 'care')]: 'همه را — کلارا، سارا، خودتان — از صحنه‌ای که نیازی به وجودش نبود، معاف کردید.',

  // ---------- The Forward ----------
  [reflectionKey('the-forward', 'delete-only', 'consequence')]: 'پاک‌کردنِ نسخه‌ی خودتان هیچ‌چیزی درباره‌ی سی‌ونه نسخه‌ی دیگری که هنوز در حرکتند، عوض نمی‌کند.',
  [reflectionKey('the-forward', 'delete-only', 'duty')]: 'سکوت مشارکتِ خودتان را تخلیه می‌کند، اما دانشِ شما از آنچه هنوز دارد برای او اتفاق می‌افتد را نه.',
  [reflectionKey('the-forward', 'delete-only', 'virtue')]: 'بپرسید «حداقل من فوروارد نکردم» واقعاً شما را به چه‌جور ناظری تبدیل می‌کند.',
  [reflectionKey('the-forward', 'delete-only', 'care')]: 'اما به‌هرحال از کسِ دیگری می‌فهمد، بدون هشدار، بدون اینکه شما آن یک کاری را که کمک می‌کرد، انجام داده باشید.',
  [reflectionKey('the-forward', 'report', 'consequence')]: 'گزارش‌دادن تنها مسیری است که واقعاً شانسِ متوقف‌کردنِ گسترشِ بیشتر را دارد، به یک هزینه‌ی واقعیِ شخصی برای شما.',
  [reflectionKey('the-forward', 'report', 'duty')]: 'این دقیقاً همان نوع اقدامی است که هم قانون و هم مدرسه برای ممکن‌کردنش وجود دارند.',
  [reflectionKey('the-forward', 'report', 'virtue')]: 'این شکلِ بی‌جلوه و نامحبوبِ شجاعت است — همانی که یک هفته صدایتان می‌زند با اسمِ بد.',
  [reflectionKey('the-forward', 'report', 'care')]: 'این نسخه‌ای از کمک است که واقعاً به دستِ اما می‌رسد، نه فقط نسخه‌ای که برای شما پاک حس می‌شود.',
  [reflectionKey('the-forward', 'tell-ema-first', 'consequence')]: 'اول هشداردادن به او، چیزی را که باید با آن روبه‌رو شود عوض می‌کند — باخبر، نه غافل‌گیرشده توسط راهروِ خودش.',
  [reflectionKey('the-forward', 'tell-ema-first', 'duty')]: 'حقیقت را پیش از آنکه جمعیت جلوتر از واکنشش بیفتد، به او بدهکار بودید.',
  [reflectionKey('the-forward', 'tell-ema-first', 'virtue')]: 'این انتخابی است که در این اتاق بیشترین هزینه را برای شما دارد و در ازایش چیزی نمی‌خواهد.',
  [reflectionKey('the-forward', 'tell-ema-first', 'care')]:
    'از میانِ همه‌ی گزینه‌های امشب، این نسخه‌ای است که کاملاً حولِ آنچه او نیاز دارد ساخته شده، نه آنچه برای شما راحت‌تر است.',
  [reflectionKey('the-forward', 'confront-publicly', 'consequence')]:
    'رویاروییِ عمومی ممکن است اشتراک‌گذاری را کند کند، اما توجه به همان چیزی را هم که سعی دارید متوقفش کنید، چند برابر می‌کند.',
  [reflectionKey('the-forward', 'confront-publicly', 'duty')]: 'رسواکردنِ کارِ اشتباه را به این موقعیت بدهکارید — اما روش هم به‌اندازه‌ی نیت اهمیت دارد.',
  [reflectionKey('the-forward', 'confront-publicly', 'virtue')]: 'این خشمِ برحق است که کاری می‌کند، که خودکار همان کارِ درست نیست.',
  [reflectionKey('the-forward', 'confront-publicly', 'care')]: 'آسیب‌پذیرترین آدمِ این داستان، حرفی درباره‌ی اینکه موقعیتش چقدر آشکارا رسیدگی شود، ندارد.',

  // ---------- The Best Friend's Girl ----------
  [reflectionKey('the-best-friends-girl', 'confess-to-her', 'consequence')]:
    'گفتن به او یک دوستی و یک رابطه را برای اطلاعاتی به خطر می‌اندازد که واقعاً لازم نبود داشته باشید.',
  [reflectionKey('the-best-friends-girl', 'confess-to-her', 'duty')]: 'او حق داشت بداند در اتاقی که در آن نشسته بود چه می‌گذرد.',
  [reflectionKey('the-best-friends-girl', 'confess-to-her', 'virtue')]:
    'این صداقتی است که به‌اندازه‌ی خودِ او، به وضوحِ ذهنِ شما هم خدمت می‌کند — ارزش دارد ببینید با کدام‌یک شروع کردید.',
  [reflectionKey('the-best-friends-girl', 'confess-to-her', 'care')]: 'در نظر بگیرید این اعتراف واقعاً چه چیزی برای نادیا هزینه دارد، در برابرِ آنچه در شما تسکین می‌دهد.',
  [reflectionKey('the-best-friends-girl', 'starve-it', 'consequence')]: 'فاصله برای هیچ‌کسِ دیگری چیزی حل نمی‌کند، اما به‌طور قابل‌اعتمادی، سرانجام، این حالت را در خودتان حل می‌کند.',
  [reflectionKey('the-best-friends-girl', 'starve-it', 'duty')]: 'به هیچ‌کس اعترافِ احساسی را که هیچ‌وقت به آن عمل نکردید، بدهکار نیستید.',
  [reflectionKey('the-best-friends-girl', 'starve-it', 'virtue')]: 'این خودمدیریتیِ آرام است — بی‌جلوه، بی‌شاهد، و جواب می‌دهد.',
  [reflectionKey('the-best-friends-girl', 'starve-it', 'care')]: 'هیچ‌کسِ دیگری در اتاق هیچ‌وقت مجبور نیست وزنِ احساسی را حمل کند که هیچ‌وقت وظیفه‌اش نبود حملش کند.',
  [reflectionKey('the-best-friends-girl', 'tell-tom', 'consequence')]:
    'گفتن به تام، به‌جای عمل‌کردن به آن یا گفتن به نادیا، آسیب را در همان یک رابطه‌ای نگه می‌دارد که برای تحملش ساخته شده.',
  [reflectionKey('the-best-friends-girl', 'tell-tom', 'duty')]: 'این وفاداری‌ای است که یک دوستیِ واقعی برایش وجود دارد — افشای ناراحت‌کننده، پیشنهادشده نه کشف‌شده.',
  [reflectionKey('the-best-friends-girl', 'tell-tom', 'virtue')]: 'این بیشتر از سکوت یا اعتراف به نادیا، جرأت خواست — درباره‌ی خودتان ارزشِ توجه‌کردن دارد.',
  [reflectionKey('the-best-friends-girl', 'tell-tom', 'care')]:
    'با هدایتش به‌سمتِ تنها کسی که برای شنیدنش مجهز بود، نادیا را از احساسی محافظت کردید که هیچ‌وقت درباره‌ی کاری که او کرده بود، نبود.',
  [reflectionKey('the-best-friends-girl', 'test-the-evening', 'consequence')]:
    'یک تستِ ساخته‌شده اطلاعاتِ واقعی تولید نمی‌کند — موقعیتی جدید و سخت‌تر‌قابل‌خواندن برای همه‌ی دخیل‌ها تولید می‌کند.',
  [reflectionKey('the-best-friends-girl', 'test-the-evening', 'duty')]: 'این رابطه‌ی تام و نادیا را برای عدمِ قطعیتِ خودتان به خطر انداخت، بدون دانش یا رضایتِ آن‌ها.',
  [reflectionKey('the-best-friends-girl', 'test-the-evening', 'virtue')]: 'این نسخه‌ای از شماست که به‌جای اعتمادکردن یا تنهاگذاشتنِ آدم‌ها، مدیریتشان می‌کند.',
  [reflectionKey('the-best-friends-girl', 'test-the-evening', 'care')]: 'نادیا اینجا ابزارِ کنجکاویِ شما می‌شود، که کارِ کوچکی نیست که با او کرده باشید.',

  // ---------- The Rumor ----------
  [reflectionKey('the-rumor', 'trust-without-asking', 'consequence')]:
    'کاملاً از یقین صرف‌نظر می‌کنید؛ هرچه واقعاً در دریاچه اتفاق افتاده باشد، هیچ‌چیزی درباره‌ی اینکه حالا چطور انتخاب می‌کنید با او رفتار کنید، عوض نمی‌کند.',
  [reflectionKey('the-rumor', 'trust-without-asking', 'duty')]: 'فرضِ بی‌گناهی را که یک شایعه به‌تنهایی هیچ‌وقت نمی‌تواند نقض کند، به او بدهکارید.',
  [reflectionKey('the-rumor', 'trust-without-asking', 'virtue')]: 'این اعتماد به‌عنوانِ انضباطی تمرین‌شده است، نه یک احساسِ راحت — نسخه‌ی سخت‌ترِ این فضیلت.',
  [reflectionKey('the-rumor', 'trust-without-asking', 'care')]: 'او را از بازجویی‌ای که شاید سزاوارش نبود معاف کردید، به قیمتِ شکی که حالا تنها و بی‌پایان حمل می‌کنید.',
  [reflectionKey('the-rumor', 'ask-her-plainly', 'consequence')]: 'فلجِ ندانستن را با جوابی معامله کردید که نمی‌توانید مستقل تاییدش کنید — معامله‌ای واقعی و محدود.',
  [reflectionKey('the-rumor', 'ask-her-plainly', 'duty')]: 'پیش از هر چیز، یک سوالِ مستقیم را به او بدهکار بودید — نه یک تله، نه دیواری از سکوت، یک سوال.',
  [reflectionKey('the-rumor', 'ask-her-plainly', 'virtue')]: 'صریح پرسیدن، یک‌بار، و بعد واقعاً گوش‌دادن، سخت‌تر از آن‌چیزی است که به‌نظر می‌رسد و نادرتر از آن‌چیزی که باید باشد.',
  [reflectionKey('the-rumor', 'ask-her-plainly', 'care')]:
    'او حالا می‌داند شایعه به شما رسیده و پیش از آنکه حرف بزنید ساعت‌ها آنجا نشسته — این هم چیزی است که باید حملش کند.',
  [reflectionKey('the-rumor', 'interrogate', 'consequence')]: 'اطلاعات را با هزینه‌ای ثابت و واقعی برای اعتمادِ رابطه به‌دست آوردید — اتاق صریح این معامله را قیمت‌گذاری می‌کند.',
  [reflectionKey('the-rumor', 'interrogate', 'duty')]: 'بازجویی با متهم مثل گناهکار تا اثباتِ خلافش رفتار می‌کند، که چیزی نیست که او سزاوارش بود.',
  [reflectionKey('the-rumor', 'interrogate', 'virtue')]: 'توجه کنید یک شایعه به‌تنهایی، برای یک عصر، شما را به چه‌جور شریکی تبدیل توانست بکند.',
  [reflectionKey('the-rumor', 'interrogate', 'care')]: 'سوال‌ها فارغ از نیتِ شما، مثل یک اتهام روی او فرود می‌آید، و باید این را هم حمل کند.',
  [reflectionKey('the-rumor', 'set-the-trap', 'consequence')]:
    'تله ممکن است جوابی درست تولید کند، اما این کار را با ساختنِ همان تستی می‌کند که بعد ادعا می‌کند فقط مشاهده‌اش کرده.',
  [reflectionKey('the-rumor', 'set-the-trap', 'duty')]: 'فریب، حتی در خدمتِ یک سوالِ منصفانه، روشی منصفانه نیست — یک سوالِ مستقیم به او بدهکار بودید، نه یک تله.',
  [reflectionKey('the-rumor', 'set-the-trap', 'virtue')]: 'این تیزترین آینه‌ی اتاق است: تله دقیقاً به‌اندازه‌ی او، درباره‌ی خودِ شما هم چیزی می‌گوید.',
  [reflectionKey('the-rumor', 'set-the-trap', 'care')]:
    'هرچه درباره‌ی او فاش کند، مطمئناً این را هم فاش می‌کند که حاضر بودید برای به‌دست‌آوردنش کسی را که دوستش دارید فریب بدهید.',
  [reflectionKey('the-rumor', 'ask-the-accuser', 'consequence')]:
    'ردیابیِ شایعه تا منبعش، ادعای واقعی را بدون اینکه حتی یک لحظه شک به سارا هزینه شود، حل می‌کند.',
  [reflectionKey('the-rumor', 'ask-the-accuser', 'duty')]: 'این توجه را به‌سمتِ کسی می‌برد که واقعاً اتهام را ساخته، جایی که از اول بدهکارش بود.',
  [reflectionKey('the-rumor', 'ask-the-accuser', 'virtue')]: 'این شجاعتِ فکری است که در ناراحت‌کننده‌ترین جا به‌کار رفته — به‌سمتِ نویسنده‌ی داستان، نه موضوعش.',
  [reflectionKey('the-rumor', 'ask-the-accuser', 'care')]: 'سارا هیچ‌وقت مجبور نیست حتی بداند زیرِ شک بوده — شک بدونِ اینکه هیچ‌وقت به او برسد، حل می‌شود.',
});
