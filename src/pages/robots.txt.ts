import type { APIRoute } from 'astro';
import { withBase } from '../utils/paths';
import { site as projectSite } from '../../project.config.js';

export const prerender = true;

export const GET: APIRoute = ({ site, request }) => {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin || site?.origin || new URL(projectSite).origin;
  const sitemapPath = withBase('sitemap.xml');
  const sitemapUrl = new URL(sitemapPath, `${origin}/`).href;

  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
