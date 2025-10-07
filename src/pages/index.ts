import type { APIRoute } from 'astro';
import { defaultLocale } from '../i18n/config';
import { isLocale } from '../i18n';

export const prerender = false;

export const GET: APIRoute = ({ cookies, redirect }) => {
  const cookieLocale = cookies.get('locale')?.value;
  const targetLocale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  return redirect(`/${targetLocale}/`, 302);
};
