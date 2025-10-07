import { describe, expect, it } from 'vitest';
import { getDictionary, isLocale } from './index';

describe('i18n helpers', () => {
  it('detects valid locales', () => {
    expect(isLocale('zh')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('jp')).toBe(false);
  });

  it('returns default dictionary when locale is invalid', async () => {
    const dict = await getDictionary('jp');
    const zhDict = await getDictionary('zh');
    expect(dict.meta.siteName).toEqual(zhDict.meta.siteName);
  });
});
