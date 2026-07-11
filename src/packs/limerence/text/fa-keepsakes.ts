// Farsi translation of LIMERENCE's 4 keepsakes (name + origin). Mirrors
// text/cs-keepsakes.ts's structure — see CLAUDE.md's translation rule. Ids
// are pack-local ('the-cheap-ring' etc.) and never collide with ANAMNESIS's
// own keepsake ids ('casino-chip' etc.), so keepsakeKey needs no pack-id
// scoping here.
import { registerAll } from '../../../engine/text/resolver';
import { keepsakeKey } from '../../../engine/text/keys';

registerAll('v2', 'fa', {
  [keepsakeKey('the-cheap-ring', 'name')]: 'حلقه‌ی ارزان',
  [keepsakeKey('the-cheap-ring', 'origin')]: 'برنده‌شده در یک مهمانی، در ازای سی ثانیه مسخره‌شدن',
  [keepsakeKey('the-unsent-letter', 'name')]: 'نامه‌ی نفرستاده',
  [keepsakeKey('the-unsent-letter', 'origin')]: 'اعترافی که تنها با خودش حمل شد، هیچ‌وقت فرستاده نشد، هیچ‌وقت نرسید',
  [keepsakeKey('the-keycard', 'name')]: 'کلیدکارت',
  [keepsakeKey('the-keycard', 'origin')]: 'اتاقِ هتلی که در پایانِ یک کنفرانس بازش نکردید',
  [keepsakeKey('the-sim', 'name')]: 'سیم‌کارت',
  [keepsakeKey('the-sim', 'origin')]: 'یک حسابِ دوم، پاک‌شده، که یک هفته طول کشید تا دیگر دنبالش نگردید',
});
