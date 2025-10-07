import type { Locale } from './config';

export type ToolDictionary = {
  slug: string;
  title: string;
  description: string;
  cta: string;
};

export type Dictionary = {
  meta: {
    siteName: string;
    defaultTitle: string;
    description: string;
  };
  nav: {
    home: string;
    tools: string;
    blog: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  privacyBanner: {
    message: string;
    dismiss: string;
  };
  sections: {
    featuredTools: string;
    latestArticles: string;
  };
  toolCards: ToolDictionary[];
  blog: {
    readMore: string;
    publishedOn: string;
  };
  footer: {
    copyright: string;
  };
  languageNames: Record<Locale, string>;
};
