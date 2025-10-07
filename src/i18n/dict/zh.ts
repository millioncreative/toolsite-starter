import type { Dictionary } from '../types';

export const zhDict: Dictionary = {
  meta: {
    siteName: '工具派',
    defaultTitle: '工具派',
    description: '精选提升效率的在线工具与文章，帮助团队快速启动项目。'
  },
  nav: {
    home: '首页',
    tools: '工具',
    blog: '博客'
  },
  hero: {
    title: '让创意与效率齐飞',
    subtitle: '汇集设计、开发与运营常用的在线工具，搭配精选指南，让你的团队更快推进想法。',
    cta: '探索工具'
  },
  privacyBanner: {
    message: '我们使用 Cookie 以确保网站的正常运行并记住你的语言偏好。',
    dismiss: '好的'
  },
  sections: {
    featuredTools: '精选工具',
    latestArticles: '最新文章'
  },
  toolCards: [
    {
      slug: 'wireframe-kit',
      title: '线框图工具包',
      description: '快速绘制网页和移动端线框图，支持实时协作与模板库。',
      cta: '立即使用'
    },
    {
      slug: 'content-analyzer',
      title: '内容分析助手',
      description: '批量分析文案语气与关键词密度，为 SEO 优化提供参考。',
      cta: '开始分析'
    },
    {
      slug: 'launch-checklist',
      title: '上线检查清单',
      description: '逐项检查设计、开发、数据与运营事项，保证产品顺利上线。',
      cta: '查看清单'
    }
  ],
  blog: {
    readMore: '阅读全文',
    publishedOn: '发布于'
  },
  footer: {
    copyright: '© ' + new Date().getFullYear() + ' 工具派'
  },
  languageNames: {
    zh: '简体中文',
    en: 'English'
  }
};
