const dict = {
  site: {
    title: 'Toolsite Starter',
    description: 'Build useful browser tools with a minimal setup.'
  },
  nav: {
    home: 'Home',
    tools: 'Tools',
    blog: 'Blog'
  },
  home: {
    heading: 'All your tools in one place',
    intro: 'Discover simple, privacy-friendly utilities that run entirely in your browser.',
    cta: 'Browse tools'
  },
  tools: {
    heading: 'Featured tools',
    intro: 'A taste of the utilities available in this starter project.'
  },
  toolCards: [
    {
      title: 'Unit converter',
      description: 'Convert values instantly without leaving the page.'
    },
    {
      title: 'Color inspector',
      description: 'Translate between HEX, RGB, and HSL with ease.'
    },
    {
      title: 'Text formatter',
      description: 'Tidy up text snippets with quick transformations.'
    }
  ],
  blog: {
    heading: 'Latest posts',
    intro: 'Updates and guides for maintaining your tool site.'
  },
  languageName: 'English'
};

export default dict;
export type Dictionary = typeof dict;
