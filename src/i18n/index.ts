import { locales, defaultLocale, type Locale } from './config';
import { enDict } from './dict/en';
import { zhDict } from './dict/zh';
import type { Dictionary } from './types';

const dictionaries: Record<Locale, Dictionary> = {
  zh: zhDict,
  en: enDict
};

export function isLocale(value: string | undefined | null): value is Locale {
  return value != null && (locales as readonly string[]).includes(value);
}

export async function getDictionary(locale: Locale | string | undefined): Promise<Dictionary> {
  if (!isLocale(locale)) {
    return dictionaries[defaultLocale];
  }

  return dictionaries[locale];
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'zh' ? 'en' : 'zh';
}

export { defaultLocale, locales };
export type { Dictionary };
