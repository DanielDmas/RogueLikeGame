// Farsi translations for the Ledger's twelve epiphanies (spec 06, Phase P).
// Each line is translated for the quiet, understated register the Ledger
// keeps throughout — never a fanfare, just a fact — see CLAUDE.md's
// translation rule.
import { registerAll } from '../../engine/text/resolver';
import { epiphanyKey } from '../../engine/text/keys';

registerAll('v2', 'fa', {
  [epiphanyKey('first-return')]: 'شما بازگشتید.',
  [epiphanyKey('kept-every-heart')]: 'یک‌بار، هر سه قلب را نگه داشتید.',
  [epiphanyKey('spent-every-heart')]: 'فهمیدید تهِ دفتر حساب چه شکلی است.',
  [epiphanyKey('refused-machine-twice')]: 'دو بار آن دستگاه را رد کردید.',
  [epiphanyKey('all-doors-one-act')]: 'در یک پرده، دیگر دری باقی نمانده که باز نکرده باشید.',
  [epiphanyKey('codex-complete')]: 'هر اتاق، دیده شد.',
  [epiphanyKey('three-endings')]: 'سه راهِ بیرون، هر سه از آنِ شما.',
  [epiphanyKey('descended')]: 'از پله‌ها پایین رفتید.',
  [epiphanyKey('examined-run')]: 'گذاشتید ضمیمه از ابتدا تا انتها نظرش را ثبت کند.',
  [epiphanyKey('first-keepsake')]: 'چیزی کوچک همراهتان آمد.',
  [epiphanyKey('high-lucidity')]: 'کارتان را با دیدنِ تقریباً همه‌چیز تمام کردید.',
  [epiphanyKey('last-word-kept')]: 'یک جمله داشتید، و هنوز هم دارید.',
});
