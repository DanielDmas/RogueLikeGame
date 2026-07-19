// Farsi translations for LIMERENCE Act III's Examined Path reflections
// (spec 05). Every line is translated with the specific room's actual
// situation and the choice's real stakes in mind, not word-for-word from
// English — see CLAUDE.md's translation rule. The-usual-suite has no
// reflections field on any choice in the English source, so it does not
// appear here; the-wedding-eve's keepsake choice (hold-the-cheap-ring) also
// has none and is likewise omitted.
import { registerAll } from '../../../engine/text/resolver';
import { reflectionKey } from '../../../engine/text/keys';

registerAll('v2', 'fa', {
  // ---------- The Colleague ----------
  [reflectionKey('the-colleague', 'the-balcony', 'consequence')]:
    'یک شب در یک کنفرانس، آنچه را که آن اختصارِ مشترک به آینده منتقل می‌کند عوض می‌کند، فارغ از اینکه بعداً چطور دسته‌بندی‌اش کنید.',
  [reflectionKey('the-colleague', 'the-balcony', 'duty')]: 'این دری بود که دانا در آن اتاق نبود تا به هزینه‌ای که برای رابطه داشت رضایت بدهد.',
  [reflectionKey('the-colleague', 'the-balcony', 'virtue')]: 'توجه کنید توجیه‌ها چقدر سریع رسیدند — اشتها در لباسِ اجتناب‌ناپذیری.',
  [reflectionKey('the-colleague', 'the-balcony', 'care')]:
    'دانا، که دویست کیلومتر آن‌طرف‌تر خواب بود، هیچ حرفی در تصمیمی نداشت که شکلِ آنچه او در بازگشت به خانه با آن روبه‌رو می‌شود را عوض می‌کند.',
  [reflectionKey('the-colleague', 'walk-away', 'consequence')]:
    'ترک‌کردن، گرمیِ آن عصر را هزینه می‌کند و از هزینه‌ای اجتناب می‌کند که وگرنه ماه‌ها انباشته می‌شد.',
  [reflectionKey('the-colleague', 'walk-away', 'duty')]: 'این به توافقی وفادار ماند که دانا در آن اتاق نبود تا اجرایش کند.',
  [reflectionKey('the-colleague', 'walk-away', 'virtue')]: 'این صداقتی است که وقتی تمرین می‌شود که واقعاً هیچ‌کس دیگری هیچ‌وقت نمی‌فهمید.',
  [reflectionKey('the-colleague', 'walk-away', 'care')]:
    'از اعتمادِ دانا محافظت کردید، بدون اینکه او هیچ‌وقت مجبور شود بفهمد چیزی بود که باید از آن محافظت می‌شد.',
  [reflectionKey('the-colleague', 'name-it-in-the-corridor', 'consequence')]:
    'نامیدنِ آن، دوستی را از اختصارِ راحتِ قدیمی‌اش می‌گیرد، در ازای اختصاری که دیگر نیازی به مدیریتِ یک سیمِ برق‌دار ندارد.',
  [reflectionKey('the-colleague', 'name-it-in-the-corridor', 'duty')]:
    'این را به‌اندازه‌ی دانا، به روآن هم بدهکار بودید — او سزاوارِ یک مرزِ نام‌گذاری‌شده بود، نه یک عقب‌نشینیِ خاموش.',
  [reflectionKey('the-colleague', 'name-it-in-the-corridor', 'virtue')]:
    'این بیشتر از رفتن از آن در یا بی‌سروصدا اجتناب‌کردن از آن، جرأت خواست — گفتنِ جمله‌ی حقیقی، با صدای بلند.',
  [reflectionKey('the-colleague', 'name-it-in-the-corridor', 'care')]: 'به روآن همان وضوح و احترامی را دادید که برای خودتان مطالبه می‌کردید.',
  [reflectionKey('the-colleague', 'postpone', 'consequence')]:
    'به‌تعویق‌انداختن از هزینه‌ی امشب اجتناب می‌کند، درحالی‌که تصمیمی را که عملاً از قبل گرفته شده، انباشته می‌کند.',
  [reflectionKey('the-colleague', 'postpone', 'duty')]: 'این تعهدی به دانا را بی‌پاسخ می‌گذارد، به‌جای اینکه یا آن را محترم بشمارد یا تمیز بشکندش.',
  [reflectionKey('the-colleague', 'postpone', 'virtue')]: 'توجه کنید چه خودفریبی‌ای لازم است تا این را «هیچ‌چیز اتفاق نیفتاده» بنامید.',
  [reflectionKey('the-colleague', 'postpone', 'care')]: 'دانا سزاوارِ شریکی است که واقعاً تصمیم گرفته، نه کسی که دری را برای بعد نیمه‌باز نگه می‌دارد.',

  // ---------- The Metamour ----------
  [reflectionKey('the-metamour', 'enforce-via-dana', 'consequence')]:
    'هدایتِ مرز از طریقِ دانا از نظرِ ساختاری درست است و نتیجه‌اش نامعلوم — اتاق وانمود نمی‌کند که واگذاری همان کنترل است.',
  [reflectionKey('the-metamour', 'enforce-via-dana', 'duty')]:
    'این احترام می‌گذارد به این حقیقت که مدیریتِ رابطه با پترا برعهده‌ی داناست، نه اینکه شما مستقیم کنترلش کنید.',
  [reflectionKey('the-metamour', 'enforce-via-dana', 'virtue')]: 'توجه کنید که آیا این صبر است، یا راهی برای اجتناب از یک مکالمه‌ی سخت‌تر برای خودتان.',
  [reflectionKey('the-metamour', 'enforce-via-dana', 'care')]: 'پترا این مرز را به هرحال دست‌دوم تجربه می‌کند، که شکل می‌دهد به اینکه چطور روی او فرود می‌آید.',
  [reflectionKey('the-metamour', 'talk-to-petra', 'consequence')]:
    'ارتباطِ مستقیم با متامور، درز را در محلِ واقعی‌اش حل می‌کند، به قیمتِ یک مکالمه‌ی واقعاً معذب‌کننده.',
  [reflectionKey('the-metamour', 'talk-to-petra', 'duty')]: 'این با پترا مثلِ طرفی رفتار می‌کند که ارتباطِ مستقیم را بدهکارید، نه مشکلی که باید دورش مدیریت کرد.',
  [reflectionKey('the-metamour', 'talk-to-petra', 'virtue')]: 'این شجاعتِ اجتماعیِ واقعی خواست — شروعِ مکالمه‌ای بدون هیچ سناریوی از پیش تعیین‌شده.',
  [reflectionKey('the-metamour', 'talk-to-petra', 'care')]:
    'این رابطه‌ی واقعیِ بینِ دو نفرِ متاثرشده را در مرکز می‌گذارد، به‌جای مثلث‌سازی از طریقِ دانا.',
  [reflectionKey('the-metamour', 'name-the-hierarchy', 'consequence')]:
    'نامیدنِ صریحِ سلسله‌مراتب، آسایشِ وانمودکردن به نبودش را با ساختاری معامله می‌کند که همه واقعاً می‌توانند در آن حرکت کنند.',
  [reflectionKey('the-metamour', 'name-the-hierarchy', 'duty')]: 'هر سه‌ی شما شرحی دقیق از شکلِ واقعیِ رابطه را بدهکار بودید، نه نسخه‌ی ایده‌آلش را.',
  [reflectionKey('the-metamour', 'name-the-hierarchy', 'virtue')]:
    'این نیاز داشت حقیقتِ ناراحت‌کننده‌ای درباره‌ی توافقِ خودتان را بپذیرید، به‌جای دفاع از روایتِ رسمی‌اش.',
  [reflectionKey('the-metamour', 'name-the-hierarchy', 'care')]: 'این به پترا شرایطی روشن برای واقعاً کارکردن می‌دهد، به‌جای سلسله‌مراتبی ناگفته که باید حدس بزند.',
  [reflectionKey('the-metamour', 'audit-the-jealousy', 'consequence')]:
    'بررسیِ اول این احساس، پیش از عمل‌کردن زمان می‌گیرد، و نقشه‌ای دقیق‌تر از آنچه واقعاً نیاز به اصلاح دارد تولید می‌کند.',
  [reflectionKey('the-metamour', 'audit-the-jealousy', 'duty')]: 'این پیچیدگیِ کاملِ حقیقت را بدهکار می‌ماند، به‌جای دست‌بردن به ساده‌ترین شرورِ در دسترس.',
  [reflectionKey('the-metamour', 'audit-the-jealousy', 'virtue')]: 'این انضباطِ سخت‌تر و کم‌رضایت‌بخش‌تر است — نشستن با ابهام، به‌جای حل‌کردنِ زودهنگامش.',
  [reflectionKey('the-metamour', 'audit-the-jealousy', 'care')]:
    'این هم دانا و هم پترا را از واکنشی محافظت می‌کند که هنوز از نقضِ واقعیِ مرز جدا نشده.',

  // ---------- The Veto ----------
  [reflectionKey('the-veto', 'comply', 'consequence')]:
    'محترم‌شمردنِ وتو، توافقِ قبلی را حفظ می‌کند، به هزینه‌ی مستقیمِ رابطه با کسی که هیچ قانونی از خودش نشکسته.',
  [reflectionKey('the-veto', 'comply', 'duty')]: 'قانونی که در سالِ اول توافق شد، هنوز الان شما را متعهد می‌کند، هرچه نگه‌داشتنش هزینه داشته باشد.',
  [reflectionKey('the-veto', 'comply', 'virtue')]: 'این وفاداری به یک تعهد است، آزموده‌شده در گران‌ترین لحظه‌اش.',
  [reflectionKey('the-veto', 'comply', 'care')]: 'سام تمامِ هزینه‌ی قانونی را جذب می‌کند که هیچ‌وقت در نوشتنش حرفی نداشت.',
  [reflectionKey('the-veto', 'fight-the-rule', 'consequence')]:
    'زیرِ سوال‌بردنِ قانون، ثباتِ رابطه را به خطر می‌اندازد تا امتحان کند آیا خودِ قانون اصلاً منصفانه بوده یا نه.',
  [reflectionKey('the-veto', 'fight-the-rule', 'duty')]: 'سزاوارِ داشتنِ حرفی در این بودید که آیا قانونی که می‌توانست رابطه‌تان با سام را تمام کند، هنوز قانونِ درستی است یا نه.',
  [reflectionKey('the-veto', 'fight-the-rule', 'virtue')]:
    'این صداقتِ سخت‌تر است — به‌خطرانداختنِ یک تعارضِ واقعی برای آزمودنِ یک ساختار، به‌جای صرفاً تسلیم‌شدن به آن.',
  [reflectionKey('the-veto', 'fight-the-rule', 'care')]: 'این دانا را مجبور می‌کند ترس را با درگیرشدن روبه‌رو کند، به‌جای اینکه یک خروجِ آسان و یک‌طرفه دستش داده شود.',
  [reflectionKey('the-veto', 'examine-the-veto', 'consequence')]:
    'فهمیدنِ منشأِ قانون، تصمیمِ امشب را حل نمی‌کند، اما هرچه بعداً انتخاب کنید را صادقانه‌تر می‌کند.',
  [reflectionKey('the-veto', 'examine-the-veto', 'duty')]: 'این با قانون مثل چیزی رفتار می‌کند که سزاوارِ بررسیِ واقعی است، نه اطاعتِ کور یا سرپیچیِ کور.',
  [reflectionKey('the-veto', 'examine-the-veto', 'virtue')]: 'این صداقتِ فکری است که به تاریخِ رابطه‌ی خودتان اعمال شده، نه فقط به استدلال‌های انتزاعی.',
  [reflectionKey('the-veto', 'examine-the-veto', 'care')]: 'این تصمیمی را که سه نفر را متاثر می‌کند کند می‌کند، به نفعِ واقعاً فهمیدنش اول.',
  [reflectionKey('the-veto', 'counter-veto', 'consequence')]:
    'همانندکردنِ وتو، تعارض را تشدید می‌کند، بدونِ اینکه حل کند آیا فراخوانیِ اولیه منصفانه بود یا نه.',
  [reflectionKey('the-veto', 'counter-veto', 'duty')]: 'تلافیِ همانند، همان پرداختن به اختلافِ واقعی درباره‌ی قانون نیست.',
  [reflectionKey('the-veto', 'counter-veto', 'virtue')]:
    'اگر این برای شما یک الگوست، توجهش کنید — روبه‌رو‌شدن با یک مرز، با یک مرزِ مساوی و مخالف، به‌جای بررسیِ هرکدام.',
  [reflectionKey('the-veto', 'counter-veto', 'care')]: 'پترا در اختلافی که هیچ‌وقت واقعاً درباره‌ی او نبود، آسیبِ جانبی می‌شود.',

  // ---------- The Drift ----------
  [reflectionKey('the-drift', 'start-the-work', 'consequence')]:
    'شروعِ این کار، تلاشِ واقعی را برای بازگشتی نامعلوم به خطر می‌اندازد، و دقیقاً همین است که آن را از رانده‌شدن متفاوت می‌کند.',
  [reflectionKey('the-drift', 'start-the-work', 'duty')]:
    'این تعهدی را که سال‌ها پیش داده شد، با واقعاً مراقبت‌کردن از آن محترم می‌شمرد، نه با فرض‌کردنِ اینکه خودش از خودش مراقبت می‌کند.',
  [reflectionKey('the-drift', 'start-the-work', 'virtue')]: 'این انضباطِ سخت‌تر و بی‌جلوه است — انتخابِ تلاش به‌جای آسایشِ یک بی‌حسیِ جاافتاده.',
  [reflectionKey('the-drift', 'start-the-work', 'care')]: 'این به دانا شریکی می‌دهد که فعالانه دوباره این رابطه را انتخاب می‌کند، نه کسی که فقط در آن ساکن است.',
  [reflectionKey('the-drift', 'raise-it', 'consequence')]:
    'مطرح‌کردنِ این سوال، اختلالِ واقعی را به خطر می‌اندازد، در ازای اطلاعاتی که رابطه، فارغ از جواب، به آن نیاز داشت.',
  [reflectionKey('the-drift', 'raise-it', 'duty')]: 'هر دویتان یک حسابرسیِ صادقانه را بدهکار بودید، نه یک سکوتِ راحت.',
  [reflectionKey('the-drift', 'raise-it', 'virtue')]: 'این نیاز داشت یک ترس را با صدای بلند نام ببرید، به‌جای بی‌پایان مدیریت‌کردنِ دورش.',
  [reflectionKey('the-drift', 'raise-it', 'care')]: 'این به دانا فرصت می‌دهد صادقانه جواب بدهد، به‌جای اینکه همچنان حدس بزند هر دویتان واقعاً چه حسی دارید.',
  [reflectionKey('the-drift', 'accept-quiet-as-love', 'consequence')]:
    'پذیرفتنِ این سکوت، امشب هیچ‌چیز هزینه ندارد و کاملاً به این بستگی دارد که آیا واقعاً انتخاب شده یا فقط به آن رضایت داده شده.',
  [reflectionKey('the-drift', 'accept-quiet-as-love', 'duty')]:
    'این آنچه را که رابطه واقعاً شده محترم می‌شمرد، به‌جای سنجیدنش با نسخه‌ای قدیمی‌تر و پرسروصداتر.',
  [reflectionKey('the-drift', 'accept-quiet-as-love', 'virtue')]: 'این صداقتِ واقعی با خود می‌خواهد — تشخیصِ پذیرش از تسلیم، که از بیرون یکسان به‌نظر می‌رسند.',
  [reflectionKey('the-drift', 'accept-quiet-as-love', 'care')]: 'این به دانا شریکی می‌دهد که به آنچه واقعاً اینجاست ارزش می‌گذارد، گفته‌شده نه فقط فرض‌شده.',
  [reflectionKey('the-drift', 'notice-youve-left', 'consequence')]:
    'اذعان‌کردن به اینکه از قبل رفته‌اید، امشب هیچ‌چیزی را عوض نمی‌کند، اما هر انتخابِ آینده را صادقانه‌تر می‌کند.',
  [reflectionKey('the-drift', 'notice-youve-left', 'duty')]: 'دانا سرانجام سزاوارِ دانستنِ حقیقتِ اینکه واقعاً کجا ایستاده‌اید است، حتی اگر این اتاق امشب مجبورتان نکند.',
  [reflectionKey('the-drift', 'notice-youve-left', 'virtue')]: 'این خودشناسیِ ناراحت‌کننده‌ای است که بدون جاخوردن از آن، به‌دست آمده.',
  [reflectionKey('the-drift', 'notice-youve-left', 'care')]: 'این تشخیصی خصوصی است که بااین‌حال به کسی مربوط می‌شود که هنوز به او گفته نشده.',

  // ---------- The Second Account ----------
  [reflectionKey('the-second-account', 'delete-it', 'consequence')]:
    'پاک‌کردنش هزینه‌ی پنهان و ادامه‌داری را از رابطه حذف می‌کند، به قیمتِ یک ترک‌کردنِ واقعی، هرچند جزئی.',
  [reflectionKey('the-second-account', 'delete-it', 'duty')]: 'دانا سزاوارِ شریکی بود که توجهش را بی‌سروصدا به حسابی تقسیم نکند که او نمی‌داند وجود دارد.',
  [reflectionKey('the-second-account', 'delete-it', 'virtue')]: 'این خودتصحیحیِ قاطع است، انتخاب‌شده پیش از گیرافتادن، نه بعدش.',
  [reflectionKey('the-second-account', 'delete-it', 'care')]: 'این توجهی را که آن حساب برداشت می‌کرد، به کسی برمی‌گرداند که بی‌سروصدا از او دریغ می‌شد.',
  [reflectionKey('the-second-account', 'keep-and-name-it', 'consequence')]:
    'نگه‌داشتنش درحالی‌که کارکردش را نام می‌برید، رفتار را حفظ می‌کند اما دستِ‌کم خودفریبیِ اطرافش را برمی‌دارد.',
  [reflectionKey('the-second-account', 'keep-and-name-it', 'duty')]:
    'این صداقتِ جزئی است — صادق با خودتان، هنوز نه صادق با دانا، که اتاق نمی‌گذارد فراموشش کنید.',
  [reflectionKey('the-second-account', 'keep-and-name-it', 'virtue')]:
    'این شکلِ کوچک‌تر و محدودترِ خودآگاهی است، نسبت به آنچه دیگر درهای این اتاق پیشنهاد می‌دهند.',
  [reflectionKey('the-second-account', 'keep-and-name-it', 'care')]: 'سهمِ دانا در این معادله، با انتخابی که فقط وجدانِ خودتان را حل می‌کند، بی‌پاسخ می‌ماند.',
  [reflectionKey('the-second-account', 'show-dana', 'consequence')]:
    'افشای کامل، اطلاعاتِ واقعی‌ای را که رابطه بر آن بنا شده به دانا می‌دهد، به هزینه‌ی احساسیِ واقعی و فوری.',
  [reflectionKey('the-second-account', 'show-dana', 'duty')]: 'دانا سزاوارِ شنیدنِ این، مستقیم از شما، بود، نه اینکه کشفش کند یا هیچ‌وقت نفهمد.',
  [reflectionKey('the-second-account', 'show-dana', 'virtue')]: 'این صداقت در آشکارترین و ناراحت‌کننده‌ترین حالتش است، که بااین‌حال انتخاب شده.',
  [reflectionKey('the-second-account', 'show-dana', 'care')]: 'این با دانا مثلِ کسی رفتار می‌کند که توانِ روبه‌روشدن با حقیقت را دارد، نه کسی که باید از آن محافظت شود.',
  [reflectionKey('the-second-account', 'defend-the-category', 'consequence')]:
    'دفاع از این دسته‌بندی، رفتار را با بازبینیِ تعریفش حفظ می‌کند، به‌جای بررسیِ اثراتش.',
  [reflectionKey('the-second-account', 'defend-the-category', 'duty')]:
    'این یک بحثِ معناشناختی را جایگزینِ حسابرسیِ صادقانه‌ای می‌کند که واقعاً به دانا بدهکارید.',
  [reflectionKey('the-second-account', 'defend-the-category', 'virtue')]: 'توجه کنید یک تعریفِ زیرکانه چقدر سریع می‌تواند جایگزینِ خودبررسیِ واقعی شود.',
  [reflectionKey('the-second-account', 'defend-the-category', 'care')]:
    'این دانا را، فارغ از اینکه بحث چطور حل شود، هیچ باخبرتر از قبلِ شروعِ این اتاق نمی‌گذارد.',

  // ---------- The Discovery ----------
  [reflectionKey('the-discovery', 'confront-now', 'consequence')]:
    'رویاروییِ فوری، پیش از آنکه هرکدامتان آرام بگیرید، کلماتی تولید می‌کند که از هرچه سرانجام حقیقت باشد، دیرپاترند.',
  [reflectionKey('the-discovery', 'confront-now', 'duty')]: 'هر دویتان یک مکالمه را با خونسردیِ کافی برای واقعاً شنیدنِ همدیگر بدهکار بودید.',
  [reflectionKey('the-discovery', 'confront-now', 'virtue')]: 'توجه کنید چقدر کم از آنچه در آن آشپزخانه گفته شد، واقعاً درباره‌ی حقایقِ تاییدشده بود.',
  [reflectionKey('the-discovery', 'confront-now', 'care')]: 'هرچه حقیقت باشد، کلماتِ سیل‌آسا به‌هرحال روی دانا فرود می‌آیند، و فرودآمده باقی می‌مانند.',
  [reflectionKey('the-discovery', 'gather-first', 'consequence')]:
    'اول‌تاییدکردن، اطلاعاتِ قابل‌اعتمادتری تولید می‌کند، به قیمتِ روزهایی صرف‌شده در نظارتِ پنهانی روی کسی که دوستش دارید.',
  [reflectionKey('the-discovery', 'gather-first', 'duty')]: 'این پیش از متهم‌کردن، مدرک جمع می‌کند، که فارغ از آنچه پیدا می‌کند، منصفانه‌تر به دانا است.',
  [reflectionKey('the-discovery', 'gather-first', 'virtue')]:
    'بپرسید انتخابِ مخفیانه تحقیق‌کردن درباره‌ی کسی، مستقل از آنچه درباره‌ی او پیدا می‌کند، درباره‌ی خودِ شما چه فاش می‌کند.',
  [reflectionKey('the-discovery', 'gather-first', 'care')]: 'دانا، بدونِ آگاهی، روزها پیش از اینکه اصلاً یک سوالِ مستقیم از او پرسیده شود، مطالعه می‌شود.',
  [reflectionKey('the-discovery', 'pretend', 'consequence')]:
    'انتخابِ ندانستن، از یک رویاروییِ سخت اجتناب می‌کند، درحالی‌که موقعیتِ واقعی، هرچه باشد، بی‌پاسخ می‌ماند.',
  [reflectionKey('the-discovery', 'pretend', 'duty')]: 'این حقیقتی را که ممکن است دانا به شما و شما به خودتان بدهکار باشید، بی‌پایان به تعویق می‌اندازد.',
  [reflectionKey('the-discovery', 'pretend', 'virtue')]: 'این شکلی واقعی، هرچند پرهزینه، از خودمحافظتی است — ردکردنِ دعوایی که برایش آماده نیستید.',
  [reflectionKey('the-discovery', 'pretend', 'care')]: 'این وضعِ واقعیِ رابطه را، چه بهتر چه بدتر، برای هر دویتان بررسی‌نشده می‌گذارد.',
  [reflectionKey('the-discovery', 'walk-tonight', 'consequence')]: 'رفتن، بحرانِ فوری را حل می‌کند، بدونِ اینکه هیچ‌وقت سوالِ واقعیِ زیرِ آن را حل کند.',
  [reflectionKey('the-discovery', 'walk-tonight', 'duty')]: 'این فرصتِ دانا برای جواب‌دادن پیش از صدورِ حکم را می‌بندد، هرچه گوشی واقعاً معنایش بود.',
  [reflectionKey('the-discovery', 'walk-tonight', 'virtue')]: 'این عملِ واقعی و پرهزینه‌ای از حفظِ خود است، هرچه دیگر هم باشد.',
  [reflectionKey('the-discovery', 'walk-tonight', 'care')]: 'این هر دویتان را از مکالمه‌ای محروم می‌کند که ممکن بود معنای امشب را عوض کند.',
  [reflectionKey('the-discovery', 'steady-then-ask', 'consequence')]:
    'این تاخیر بیست دقیقه ندانستن برایتان هزینه دارد و مکالمه‌ای می‌خرد که هیچ‌کدامتان مجبور نیستید بعداً پسش بگیرید.',
  [reflectionKey('the-discovery', 'steady-then-ask', 'duty')]:
    'دانا سزاوارِ یک سوالِ مستقیم بود، نه حکمی سیل‌آسا یا پرونده‌ای که مخفیانه ساخته شده — این وظیفه‌ی ساده‌تر است، ادا شده.',
  [reflectionKey('the-discovery', 'steady-then-ask', 'virtue')]:
    'انتخابِ آرام‌کردنِ خودتان پیش از یک مکالمه‌ی سخت، انضباط است، نه فرار — زیرِ فشار انجامش تلاشِ واقعی می‌خواهد.',
  [reflectionKey('the-discovery', 'steady-then-ask', 'care')]: 'هرچه حقیقت باشد، از دانا یک‌بار، صریح، توسط کسی که توانِ واقعاً شنیدنِ جواب را دارد، پرسیده می‌شود.',

  // ---------- The Wedding Eve ----------
  [reflectionKey('the-wedding-eve', 'sit-with-it-til-morning', 'consequence')]:
    'نشستن با این تردید، یک شبِ بی‌خوابی هزینه دارد و خوانشی روشن‌تر از اینکه تردید واقعاً درباره‌ی چه بود تولید می‌کند.',
  [reflectionKey('the-wedding-eve', 'sit-with-it-til-morning', 'duty')]:
    'این یک شنیدنِ صادقانه را به تردید بدهکار می‌ماند، به‌جای سرکوب یا اطاعتِ انعکاسی از آن.',
  [reflectionKey('the-wedding-eve', 'sit-with-it-til-morning', 'virtue')]:
    'این صبر زیرِ فشارِ واقعی است — نه وحشت، نه وانمود، در ساعتِ دو نیمه‌شب، شبِ قبلِ عروسی.',
  [reflectionKey('the-wedding-eve', 'sit-with-it-til-morning', 'care')]:
    'این می‌گذارد به‌عنوانِ کسی که تردید را بررسی کرده به محلِ مراسم برسید، که دانا بیشتر از کسی که دفنش کرده، سزاوارش است.',
  [reflectionKey('the-wedding-eve', 'call-someone-honest', 'consequence')]:
    'تماس با کسیِ صادق، خوابِ یک دوست را با دیدگاهی روشن‌کننده از بیرون، در لحظه‌ای واقعاً پرمخاطره، معامله می‌کند.',
  [reflectionKey('the-wedding-eve', 'call-someone-honest', 'duty')]:
    'این به بزرگیِ تعهدِ فردا آن‌قدر احترام می‌گذارد که به‌دنبالِ مشورتِ واقعی برود، به‌جای تصمیم‌گیریِ کاملاً تنها.',
  [reflectionKey('the-wedding-eve', 'call-someone-honest', 'virtue')]: 'این نیاز داشت تردید را با صدای بلند به کسِ دیگری اعتراف کنید، که نوعِ خودش از جرأت را می‌خواهد.',
  [reflectionKey('the-wedding-eve', 'call-someone-honest', 'care')]:
    'این با تصمیم مثلِ چیزی رفتار می‌کند که آن‌قدر دانا را متاثر می‌کند که ارزشِ درست‌درآوردن را دارد، حتی در ساعتی نامناسب.',
  [reflectionKey('the-wedding-eve', 'answer-the-flame', 'consequence')]:
    'بازکردنِ دوباره‌ی مکالمه، خطرِ بازآوردنِ مقایسه‌ای را دارد که عروسی هیچ‌وقت برای دوام‌آوردن در برابرش ساخته نشده.',
  [reflectionKey('the-wedding-eve', 'answer-the-flame', 'duty')]: 'این را به‌عنوانِ بخشی از امشب به دانا بدهکار نبودید، و دانا نمی‌داند این اتفاق افتاده.',
  [reflectionKey('the-wedding-eve', 'answer-the-flame', 'virtue')]: 'توجه کنید یعنی چه که این تماس شبِ قبلِ متعهدشدن به کسِ دیگر، ضروری حس شد.',
  [reflectionKey('the-wedding-eve', 'answer-the-flame', 'care')]: 'دانا بدونِ دانستنِ اینکه این مکالمه امشب اتفاق افتاده، وارد فردا می‌شود.',
  [reflectionKey('the-wedding-eve', 'postpone', 'consequence')]:
    'به‌تعویق‌انداختن، دردی عظیم، عمومی و فوری هزینه دارد، در ازای ازدواج‌نکردن زیرِ سایه‌ی یک تردیدِ حل‌نشده.',
  [reflectionKey('the-wedding-eve', 'postpone', 'duty')]: 'این در دیرترین لحظه‌ی ممکن و گران‌ترینش، به دانا صادق است، به‌جای اصلاً صادق‌نبودن.',
  [reflectionKey('the-wedding-eve', 'postpone', 'virtue')]:
    'این شجاعانه‌ترین جمله‌ی موجود در این اتاق است، و دقیقاً همان چیزی را هزینه دارد که شجاعت معمولاً هزینه دارد.',
  [reflectionKey('the-wedding-eve', 'postpone', 'care')]:
    'این حقیقت را پیش از ادای سوگند به دانا می‌دهد، نه بعدش، هرچه دیگر هم امشب برای هر دویتان هزینه داشته باشد.',

  // ---------- The Therapist (stage 0) ----------
  [reflectionKey('the-therapist', 'criticism', 'consequence')]: 'شناختنِ این الگو، نمونه‌های گذشته‌اش را پاک نمی‌کند، اما هزینه‌ی نمونه‌ی بعدی را عوض می‌کند.',
  [reflectionKey('the-therapist', 'criticism', 'duty')]: 'دانا سزاوارِ شکایت‌هایی درباره‌ی رفتارِ مشخص است، نه احکامی درباره‌ی شخصیت.',
  [reflectionKey('the-therapist', 'criticism', 'virtue')]: 'این نیاز داشت الگوی نچسبِ خودتان را تماشا کنید، بدونِ اینکه فوراً توجیهش کنید.',
  [reflectionKey('the-therapist', 'criticism', 'care')]: 'این همان سوارکاری است که مستقیم‌ترین فرسایش را روی کسی که دریافتش می‌کند وارد می‌کند، جلسه بعد از جلسه.',
  [reflectionKey('the-therapist', 'contempt', 'consequence')]:
    'نام‌بردنِ این الگو، یک اعترافِ سخت هزینه دارد و تنها دری را باز می‌کند که ثابت شده واقعاً پیش‌بینیِ ترمیم می‌کند.',
  [reflectionKey('the-therapist', 'contempt', 'duty')]: 'تحقیر، احترامِ پایه‌ای را دریغ می‌کند که دانا فارغ از محتوای بحث، سزاوارش است.',
  [reflectionKey('the-therapist', 'contempt', 'virtue')]: 'این سخت‌ترین در از چهار در است که صادقانه از آن عبور کنید، که خودش ارزشِ توجه دارد.',
  [reflectionKey('the-therapist', 'contempt', 'care')]:
    'این همان سوارکاری است که پژوهش آن را خورنده‌ترین برای کسی که دریافتش می‌کند نام می‌برد — همانی که بیشترین هزینه را برای دانا دارد.',
  [reflectionKey('the-therapist', 'defensiveness', 'consequence')]: 'پذیرفتنِ مسئولیتِ جزئی، غرور هزینه دارد و کاهشِ تنشی نامتناسب‌بزرگ تولید می‌کند.',
  [reflectionKey('the-therapist', 'defensiveness', 'duty')]: 'دانا سزاوارِ اذعان به سهمِ خودتان است، نه ردیه‌ای بر سهمِ او.',
  [reflectionKey('the-therapist', 'defensiveness', 'virtue')]: 'این نیاز داشت یک واکنشِ غریزی را کنار بگذارید — میلِ ضدحمله به‌جای دریافت‌کردن.',
  [reflectionKey('the-therapist', 'defensiveness', 'care')]: 'این همان الگویی است که مستقیم‌ترین مانع را برای شنیده‌شدنِ واقعیِ دانا ایجاد می‌کند.',
  [reflectionKey('the-therapist', 'stonewalling', 'consequence')]:
    'شناختنِ الگوی خاموشی، جلوی اتفاق‌افتادنش را نمی‌گیرد، اما یک مکثِ اعلام‌شده را به‌عنوانِ جایگزین در دسترس می‌گذارد.',
  [reflectionKey('the-therapist', 'stonewalling', 'duty')]: 'دانا سزاوارِ یک مکثِ گفته‌شده است، نه یک عقب‌نشینیِ خاموش و بی‌توضیح.',
  [reflectionKey('the-therapist', 'stonewalling', 'virtue')]: 'این نیاز داشت یک سازوکارِ دفاعی را نام ببرید که معمولاً زیرِ آگاهیِ خودآگاه عمل می‌کند.',
  [reflectionKey('the-therapist', 'stonewalling', 'care')]: 'برگشتن، به‌اندازه‌ی رفتن برای دانا اهمیت دارد — اتاق روی هر دو نیمه‌ی این مهارت اصرار دارد.',

  // ---------- The Therapist (stage 1) ----------
  [reflectionKey('the-therapist', 'accept-the-repair', 'consequence')]: 'پذیرفتنِ تلاشِ ترمیم، تعارضِ فوری را اساساً بدونِ هیچ هزینه‌ای کاهش می‌دهد.',
  [reflectionKey('the-therapist', 'accept-the-repair', 'duty')]: 'دانا چیزی کوچک و ناقص را برای رسیدن به شما ریسک کرد — پذیرفتنش آن ریسک را محترم می‌شمرد.',
  [reflectionKey('the-therapist', 'accept-the-repair', 'virtue')]: 'این انضباطِ سخت‌ترِ اجازه‌دادن به اینکه به شما رسیده شود، حتی وسطِ یک بحث است.',
  [reflectionKey('the-therapist', 'accept-the-repair', 'care')]: 'این به تلاشِ دانا جایی برای فرودآمدن می‌دهد، به‌جای اینکه بگذارید از سرِ اصول زمین بخورد.',
  [reflectionKey('the-therapist', 'miss-the-repair', 'consequence')]: 'ازدست‌دادنِ ترمیم، شتابِ تعارض را نگه می‌دارد، به قیمتِ کاهشِ تنشی که در دسترس بود.',
  [reflectionKey('the-therapist', 'miss-the-repair', 'duty')]: 'این را مشخصاً به دانا بدهکار نیستید، اما چیزی را که دانا با حسنِ‌نیت پیشنهاد داد، رد می‌کند.',
  [reflectionKey('the-therapist', 'miss-the-repair', 'virtue')]: 'توجه کنید ماندن درونِ شتابِ بحث، به‌اندازه‌ی دانا برای خودتان هم هزینه دارد.',
  [reflectionKey('the-therapist', 'miss-the-repair', 'care')]: 'تلاشِ کوچک و مضطربِ دانا بی‌پاسخ می‌ماند، که هزینه‌ی خاموشِ خودش را دارد.',

  // ---------- The Usual Room (gate) ----------
  [reflectionKey('the-usual-room', 'defiant-different', 'consequence')]:
    'رفتن به اتاقِ متفاوت، نتیجه‌ی امشب را عوض می‌کند، بدونِ اینکه لزوماً الگوی زیربنایی‌ای را که دفتر ثبتش می‌کرد عوض کند.',
  [reflectionKey('the-usual-room', 'defiant-different', 'duty')]: 'این حقِ انتخاب‌کردن را ادعا می‌کند، که واقعی است، هرچه دفتر درباره‌ی آن انتخاب پیش‌بینی کرده باشد.',
  [reflectionKey('the-usual-room', 'defiant-different', 'virtue')]:
    'این سوالِ سخت‌تری است که باید با آن نشست — آیا سرپیچی اینجا آزادی است، یا فقط الگویی در لباسِ مبدل.',
  [reflectionKey('the-usual-room', 'defiant-different', 'care')]: 'این آنچه را که هرکسِ دیگری در زندگیِ شما از این الگو تجربه می‌کند عوض نمی‌کند، فقط اتاقِ امشب را.',
  [reflectionKey('the-usual-room', 'refuse-all-rooms', 'consequence')]:
    'کناره‌گیری، آن اتاقِ مشخص را دور می‌زند، بدونِ اینکه پیش‌بینیِ گسترده‌ترِ دفتر درباره‌ی رفتارتان را دور بزند.',
  [reflectionKey('the-usual-room', 'refuse-all-rooms', 'duty')]: 'این کاملاً از مشارکت امتناع می‌کند، که خودش پاسخی مشروع است، هرچند ناقص.',
  [reflectionKey('the-usual-room', 'refuse-all-rooms', 'virtue')]:
    'توجه کنید حتی امتناع هم، به‌نوعی، پیش‌بینی شده بود — ارزشش را دارد که با آن بنشینید، نه اینکه سریع حلش کنید.',
  [reflectionKey('the-usual-room', 'refuse-all-rooms', 'care')]: 'این با سوالِ واقعیِ اینکه آیا الگو قابلِ بازنگری است یا نه درگیر نمی‌شود، فقط به تعویقش می‌اندازد.',
  [reflectionKey('the-usual-room', 'take-it-knowingly', 'consequence')]:
    'انتخابِ آگاهانه‌ی اتاقِ پیش‌بینی‌شده، نتیجه‌ی امشب را عوض نمی‌کند، اما معنای انتخاب‌کردن را عوض می‌کند.',
  [reflectionKey('the-usual-room', 'take-it-knowingly', 'duty')]:
    'این انتخاب را واقعاً مالِ خودتان می‌کند، به‌جای اینکه یا از یک پیش‌بینی اطاعت کنید، یا صرفاً علیه‌اش سرپیچی کنید.',
  [reflectionKey('the-usual-room', 'take-it-knowingly', 'virtue')]:
    'این ادغامِ سخت‌تر و آرام‌تر است — پذیرفتنِ اینکه یک الگو واقعی است، درحالی‌که همچنان مالکیتِ نمونه‌ی امشب را ادعا می‌کنید.',
  [reflectionKey('the-usual-room', 'take-it-knowingly', 'care')]: 'این نسخه‌ای از امشب است که به هیچ تماشاگری نیاز ندارد، هیچ سرپیچیِ اجراشده برای کسی جز خودتان.',
  [reflectionKey('the-usual-room', 'room-with-no-number', 'consequence')]:
    'انتخابِ اتاقِ بدونِ شماره، آزمونِ اصلیِ امشب را دور می‌زند، به‌جای حل‌کردنش به هر شکلی.',
  [reflectionKey('the-usual-room', 'room-with-no-number', 'duty')]: 'این گزینه‌ی سومِ واقعی است، حتی اگر دفتر آن را هم پیش‌بینی کرده باشد.',
  [reflectionKey('the-usual-room', 'room-with-no-number', 'virtue')]: 'این نوعی طفره‌ی صادقانه است — امتناع از اجرای یقینی که واقعاً حس نمی‌کنید.',
  [reflectionKey('the-usual-room', 'room-with-no-number', 'care')]: 'این چیزی را برای کسِ دیگری حل نمی‌کند، اما هزینه‌ای هم برای هیچ‌کس ندارد.',
});
