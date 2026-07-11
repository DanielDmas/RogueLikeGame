// Farsi translation of LIMERENCE's 12 Ledger epiphanies (see
// packs/limerence/epiphanies.ts's EN_FALLBACK). Quiet, one-line
// observations over a player's choice history — never advice, never read
// by gameplay logic, pure flavor text. Register mirrors text/cs-epiphanies.ts:
// wry, quiet, a little uncomfortable, never a fanfare — see CLAUDE.md's
// translation rule. Ids are pack-local strings distinct from ANAMNESIS's own
// epiphany ids, so no pack-scoping is needed for epiphanyKey (see
// engine/text/keys.ts).
import { registerAll } from '../../../engine/text/resolver';
import { epiphanyKey } from '../../../engine/text/keys';

registerAll('v2', 'fa', {
  [epiphanyKey('never-asked-first')]: 'حتی یک‌بار هم پیش از متهم‌کردن، نپرسیدید.',
  [epiphanyKey('three-times-fine')]: 'سه اتاق شنیدند گفتید «خوبم». هیچ‌وقت خوب نبودید.',
  [epiphanyKey('truth-one-room-late')]: 'همیشه حقیقت را دقیقاً یک اتاق دیرتر می‌گویید.',
  [epiphanyKey('never-the-one-to-leave')]: 'هیچ‌وقت شما نبودید که رفتید.',
  [epiphanyKey('every-trap-caught-you')]: 'هر تله‌ای که گذاشتید، خودتان در آن افتادید.',
  [epiphanyKey('mid-goodbye')]: 'همیشه آدم‌هایی را انتخاب می‌کنید که وسطِ خداحافظی‌اند.',
  [epiphanyKey('window-and-wall')]: 'پنجره و دیوار: هر دو را ساخته‌اید. بشمرید کدام‌یک را بیشتر.',
  [epiphanyKey('doors-you-avoid')]: 'هر نشانه‌ی بالای هر دری را دوبار خواندید. از قبل می‌دانید از کدام درها فرار می‌کنید.',
  [epiphanyKey('apologizes-with-logistics')]: 'با کارهای عملی عذرخواهی می‌کنید.',
  [epiphanyKey('sentence-never-said')]:
    'هیچ‌کس در این هتل جمله‌ای را که گذاشتید اتاق به‌جای شما بگوید، از زبانِ خودتان نشنیده.',
  [epiphanyKey('walked-away-once')]: 'یک‌بار رفتید. در پرونده ثبت است. وقتی راهرو طولانی شد، بخوانیدش.',
  [epiphanyKey('legible-not-finished')]: 'دست‌خطِ شما خواناست. این با تمام‌شده‌بودن فرق دارد.',
});
