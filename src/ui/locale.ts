import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import type { Lang } from '../engine/text/resolver';

/** Applies document-level locale concerns: RTL direction, the Farsi webfont
 * class, and `lang` (Fable review, M5 — this was never actually set, so
 * screen readers applied English pronunciation rules to cs/de/fa/fr text
 * regardless of the active locale). Every `Lang` value here is already a
 * valid BCP-47 primary language subtag, so no mapping is needed. */
export function applyLocaleToDocument(lang: Lang): void {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  document.body.classList.toggle('rtl', lang === 'fa');
  document.body.classList.toggle('lang-fa', lang === 'fa');
}

export const LANGUAGE_LABELS: Record<Lang, string> = {
  en: 'English',
  cs: 'Čeština',
  fa: 'فارسی',
  de: 'Deutsch',
  fr: 'Français',
};

