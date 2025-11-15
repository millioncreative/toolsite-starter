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
    text: {
      title: '文本整理',
      subtitle: '用简单操作快速规整文本片段。',
      description: '支持去首尾空白、压缩空格、去空行、去重、大小写转换、排序与导出。',
      input: '输入',
      placeholder: '在此粘贴文本…',
      trim: '去首尾空白',
      collapse: '压缩空格',
      removeBlank: '去空行',
      dedupe: '去重（按行）',
      case: '大小写',
      caseNone: '保持不变',
      caseUpper: '全大写',
      caseLower: '全小写',
      caseTitle: '标题式',
      sort: '按行排序',
      sortNone: '保持不变',
      sortAsc: '升序（A→Z）',
      sortDesc: '降序（Z→A）',
      format: '整理',
      copy: '复制',
      ariaPreview: '已整理文本的预览'
    },
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
      description: '支持去首尾空白、压缩空格、去空行、去重、大小写转换、排序与导出。',
      slug: 'text'
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
