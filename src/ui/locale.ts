import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import type { Lang } from '../engine/text/resolver';

/** Applies document-level locale concerns: RTL direction and the Farsi webfont class. */
export function applyLocaleToDocument(lang: Lang): void {
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

