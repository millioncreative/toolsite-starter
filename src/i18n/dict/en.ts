import type { Dictionary } from '../types';

export const enDict: Dictionary = {
  meta: {
    siteName: 'Toolsmith Hub',
    defaultTitle: 'Toolsmith Hub',
    description: 'A curated set of productivity tools and guides to help your team ship ideas faster.'
  },
  nav: {
    home: 'Home',
    tools: 'Tools',
    blog: 'Blog'
  },
  hero: {
    title: 'Ship ideas faster together',
    subtitle: 'Discover collaborative online tools and expert tips that keep design, engineering, and operations in sync.',
    cta: 'Browse tools'
  },
  privacyBanner: {
    message: 'We use cookies to keep the site running and remember your language preferences.',
    dismiss: 'Got it'
  },
  sections: {
    featuredTools: 'Featured tools',
    latestArticles: 'Latest articles'
  },
  toolCards: [
    {
      slug: 'wireframe-kit',
      title: 'Wireframe Kit',
      description: 'Sketch web and mobile wireframes in minutes with collaborative templates.',
      cta: 'Launch tool'
    },
    {
      slug: 'content-analyzer',
      title: 'Content Analyzer',
      description: 'Review tone and keyword density at scale to support your SEO planning.',
      cta: 'Run analysis'
    },
    {
      slug: 'launch-checklist',
      title: 'Launch Checklist',
      description: 'Track design, engineering, data, and ops tasks to ship with confidence.',
      cta: 'Open checklist'
    }
  ],
  blog: {
    readMore: 'Read article',
    publishedOn: 'Published on'
  },
  footer: {
    copyright: '© ' + new Date().getFullYear() + ' Toolsmith Hub'
  },
  languageNames: {
    zh: 'Chinese',
    en: 'English'
  }
};
