import type { Locale } from '../i18n/config';
import { defaultLocale, locales } from '../i18n/config';

export function normalizeLocale(input: string | undefined): Locale {
  if (input && (locales as readonly string[]).includes(input)) {
    return input as Locale;
  }
  return defaultLocale;
}
