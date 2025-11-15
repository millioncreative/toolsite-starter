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
    intro: 'A taste of the utilities available in this starter project.',
    text: {
      title: 'Text formatter',
      subtitle: 'Tidy up text snippets with quick transformations.',
      description: 'Trim, collapse spaces, dedupe lines, change case, sort, and export.',
      input: 'Input',
      placeholder: 'Paste text here…',
      trim: 'Trim ends',
      collapse: 'Collapse spaces',
      removeBlank: 'Remove blank lines',
      dedupe: 'Deduplicate lines',
      case: 'Case',
      caseNone: 'Keep',
      caseUpper: 'UPPER',
      caseLower: 'lower',
      caseTitle: 'Title Case',
      sort: 'Sort lines',
      sortNone: 'Keep',
      sortAsc: 'A → Z',
      sortDesc: 'Z → A',
      format: 'Format',
      copy: 'Copy',
      ariaPreview: 'Preview of formatted text'
    },
    qr: {
      title: 'QR Code Generator',
      subtitle: 'Create QR codes entirely in your browser and download as PNG / SVG.',
      input: 'Text or URL',
      size: 'Size',
      margin: 'Margin',
      level: 'Error correction',
      fg: 'Foreground',
      bg: 'Background',
      generate: 'Generate',
      description: 'Generate QR codes quickly and privately.',
      ariaLabel: 'QR code for {text}',
      tooLong: 'Input is too long for this QR code size. Please shorten the text.'
    }
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
      description: 'Trim, collapse spaces, dedupe lines, change case, sort, and export.',
      slug: 'text'
    },
    {
      title: 'QR Code Generator',
      description: 'Generate QR codes quickly and privately.',
      slug: 'qr'
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
