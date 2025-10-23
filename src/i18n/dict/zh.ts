import type { Dictionary } from './en';

const dict: Dictionary = {
  site: {
    title: '工具站启动模版',
    description: '用最小配置打造隐私友好的浏览器小工具。'
  },
  nav: {
    home: '首页',
    tools: '工具',
    blog: '博客'
  },
  home: {
    heading: '欢迎来到 Toolsite Starter',
    intro: '所有功能都在本地浏览器运行，无需登录或上传数据。',
    cta: '查看工具'
  },
  tools: {
    heading: '工具目录',
    intro: '展示此模版中可扩展的几个小功能。',
    qr: {
      title: '二维码生成器',
      subtitle: '在浏览器本地生成二维码，并下载为 PNG / SVG。',
      input: '文本或链接',
      size: '尺寸',
      margin: '边距',
      level: '纠错等级',
      fg: '前景色',
      bg: '背景色',
      generate: '生成',
      description: '快速、私密地生成二维码。',
      ariaLabel: '用于 {text} 的二维码',
      tooLong: '文本过长，请缩短内容后再生成。'
    }
  },
  toolCards: [
    {
      title: '单位换算',
      description: '无需跳转页面即可转换常见计量单位。'
    },
    {
      title: '颜色拾取',
      description: '在 HEX、RGB、HSL 之间快速互转。'
    },
    {
      title: '文本整理',
      description: '用简单操作就能格式化文本内容。'
    },
    {
      title: '二维码生成器',
      description: '快速、私密地生成二维码。',
      slug: 'qr'
    }
  ],
  blog: {
    heading: '最新文章',
    intro: '记录工具站搭建与维护的经验。'
  },
  languageName: '简体中文'
};

export default dict;
