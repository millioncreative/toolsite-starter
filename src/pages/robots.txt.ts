import type { APIRoute } from 'astro';
import { site as projectSite } from '../../project.config.js';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? projectSite;
  const sitemapUrl = new URL('sitemap.xml', siteUrl).href;
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
