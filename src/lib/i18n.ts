import { locales as configuredLocales } from '../i18n/config';

export const locales = configuredLocales;
export type Locale = (typeof locales)[number];

export function getI18nStaticPaths() {
  return locales.map((lang) => ({
    params: { lang }
  }));
}
