import type { PersonalInfo, NavItem } from '@/types';

export const NAV_ITEMS: NavItem[] = [
  { label: '首页', href: '#首页' },
  { label: '项目', href: '#项目' },
  { label: '技能', href: '#技能' },
  { label: '关于我', href: '#关于我' },
];

export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  name: "张三",
  title: "全栈开发者",
  bio: "热爱技术与设计的创造者，擅长将创意转化为优雅的数字体验。",
  skills: ["Vue", "TypeScript", "Node.js", "UI/UX设计", "3D可视化"],
  projects: [
    {
      id: 1,
      title: "电商平台重构",
      description: "使用Vue和TypeScript重构现有电商系统，提升性能和用户体验",
    },
    {
      id: 2,
      title: "数据可视化仪表盘",
      description: "开发交互式数据可视化工具，帮助企业分析业务数据",
    },
    {
      id: 3,
      title: "个人博客系统",
      description: "从零构建全功能博客平台，支持Markdown编辑和SEO优化",
    },
  ],
  socialLinks: [
    { name: "GitHub", icon: "fa-github", url: "https://github.com" },
    { name: "LinkedIn", icon: "fa-linkedin", url: "https://linkedin.com" },
    { name: "Twitter", icon: "fa-twitter", url: "https://twitter.com" },
  ],
};
