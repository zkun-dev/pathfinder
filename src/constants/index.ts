import type { PersonalInfo, NavItem } from '@/types';

export const NAV_ITEMS: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '技能', href: '/skills' },
  { label: '项目', href: '/projects' },
  { label: '工作经历', href: '/experiences' },
  { label: '学习记录', href: '/learnings' },
  { label: '生活动态', href: '/life' },
  { label: '关于我', href: '/about' },
];

// 注意：此常量已弃用，现在数据从API获取
// 保留此常量仅用于向后兼容或作为默认值
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
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "数据可视化仪表盘",
      description: "开发交互式数据可视化工具，帮助企业分析业务数据",
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "个人博客系统",
      description: "从零构建全功能博客平台，支持Markdown编辑和SEO优化",
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  socialLinks: [
    { name: "GitHub", icon: "fa-github", url: "https://github.com" },
    { name: "LinkedIn", icon: "fa-linkedin", url: "https://linkedin.com" },
    { name: "Twitter", icon: "fa-twitter", url: "https://twitter.com" },
  ],
};
