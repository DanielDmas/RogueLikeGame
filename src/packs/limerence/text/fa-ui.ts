// LIMERENCE's shared UI-chrome translations — see cs-ui.ts's header for the
// full explanation. Only the 7 genuinely pack-scoped strings are registered
// here (item 21 backfill, 2026-07-15; deduplication, 2026-07-15 code review)
// — every other UI-chrome key is pack-neutral and falls through to
// ANAMNESIS's own registration under the same unscoped uiKey(...).
import { registerAll } from '../../../engine/text/resolver';
import {
  oneDoorButtonKey,
  understoryNameKey,
  heartsTooltipKey,
  heartsAriaLabelKey,
  lucidityTooltipKey,
  personaAboutLabelKey,
  personaSubKey,
} from '../../../engine/text/keys';

registerAll('v2', 'fa', {
  [oneDoorButtonKey('limerence')]: 'یک در',
  [understoryNameKey('limerence')]: 'بایگانی',
  [heartsTooltipKey('limerence')]:
    'اعتماد شما — ظرفیت‌تان برای بازهم آن را دادن. چند انتخاب پرهزینه مستقیماً یکی از آن را می‌گیرند، همان‌طور که تمام‌شدنِ کاملِ وضوح هم همین‌طور است. از دست دادنِ هر سه، یک پایان است، نه یک صفحه‌ی شکست.',
  [heartsAriaLabelKey('limerence')]: 'اعتماد',
  [lucidityTooltipKey('limerence')]: 'وضوح — اینکه چقدر صادقانه حاضرید خودتان را ببینید.',
  [personaAboutLabelKey('limerence')]: 'درباره‌ی شما (اختیاری — به هیچ‌کس نشان داده نمی‌شود، فقط دربان آن را حس می‌کند)',
  [personaSubKey('limerence')]: 'صرفاً برای خودِ دربان — چیزی در اتاق‌ها تغییر نمی‌کند، فقط نحوه‌ی صحبتشان با شما.',
});
