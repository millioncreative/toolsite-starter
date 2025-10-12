// src/utils/locale.ts
import type { Locale } from '../i18n/config';
import { defaultLocale, locales } from '../i18n/config';

/** 规范化入参，保证返回的是受支持的 Locale（否则回退到默认值） */
export function normalizeLocale(input: string | undefined): Locale {
  if (input && (locales as readonly string[]).includes(input)) {
    return input as Locale;
  }
  return defaultLocale;
}

/** 将内部 Locale 转成 Intl 需要的 locale 字符串 */
export function toIntlLocale(locale: Locale): string {
  return locale === 'zh' ? 'zh-CN' : 'en-US';
}

/** 安全解析日期（支持 Date 实例或 ISO 字符串） */
export function parseDate(input: Date | string): Date {
  return input instanceof Date ? input : new Date(input);
}

/**
 * 按语言格式化日期。
 * 用法：formatDate(post.data.pubDate, locale)
 */
export function formatDate(
  input: Date | string,
  locale: Locale = defaultLocale,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' }
): string {
  const d = parseDate(input);
  return new Intl.DateTimeFormat(toIntlLocale(locale), options).format(d);
}
