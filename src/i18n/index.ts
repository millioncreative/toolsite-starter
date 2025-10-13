import { locales, type Locale } from './config';

type DictionaryModule = { default: unknown };

const dictionaries: Record<Locale, () => Promise<DictionaryModule>> = {
  en: () => import('./dict/en'),
  zh: () => import('./dict/zh')
};

export async function getDictionary(locale: Locale) {
  const mod = await dictionaries[locale]();
  return mod.default;
}

export function isLocale(value: string | undefined): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export type { Locale } from './config';
export { locales } from './config';
