export type Locale = 'en' | 'zh';

// infer locale from URL
export function getLocaleFromUrl(url: URL): Locale {
  const seg = url.pathname.split('/').filter(Boolean)[0];
  return seg === 'zh' ? 'zh' : 'en';
}

// switch to target locale preserving path/query/hash, replacing only the first segment
export function getSwitchLocaleUrl(url: URL, target: Locale) {
  const parts = url.pathname.split('/');
  if (parts.length > 1) parts[1] = target;
  const pathname = parts.join('/').replace(/\/{2,}/g, '/');
  return `${pathname}${url.search}${url.hash}`;
}

// localized date formatting
export function formatDate(date: Date, locale: Locale) {
  if (locale === 'zh') {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
