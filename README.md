# PathFinder | 成长足迹

一个基于 Vue 3 + TypeScript 的现代化个人作品集网站，具有炫酷的 3D 背景效果和流畅的动画体验。

## ✨ 特性

- 🎨 **深色/浅色主题切换** - 支持系统主题检测和手动切换，主题切换流畅无闪烁
- 🌐 **3D 动态背景** - 基于 Three.js 的粒子系统和能量核心效果，支持主题自适应
- 🎭 **流畅动画** - 使用 @vueuse/motion 实现页面元素的优雅动画
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🧩 **组件化架构** - 高度模块化的组件设计，易于维护和扩展
- ⚡ **性能优化** - 基于 Vite 的快速构建和热更新
- 🎯 **TypeScript** - 完整的类型支持，提升开发体验

## 🛠️ 技术栈

### 核心框架
- **Vue 3** (^3.5.13) - 渐进式 JavaScript 框架，使用 Composition API
- **TypeScript** (~5.7.2) - JavaScript 的超集，提供类型安全
- **Vite** (^6.2.0) - 下一代前端构建工具，极速开发体验

### 路由与状态
- **Vue Router** (^4.4.5) - 官方路由管理器

### 样式与 UI
- **Tailwind CSS** (^3.4.17) - 实用优先的 CSS 框架
- **CSS Variables** - 基于 CSS 变量的主题系统

### 动画与交互
- **@vueuse/motion** (^2.0.0) - Vue 动画库，提供流畅的动画效果
- **@vueuse/core** (^11.3.0) - Vue 组合式工具库

### 3D 图形
- **Three.js** (^0.160.0) - 强大的 3D 图形库
- **OrbitControls** - Three.js 相机控制器

### 工具库
- **zod** (^3.24.2) - TypeScript 优先的模式验证库
- **tailwind-merge** (^3.0.2) - 智能合并 Tailwind CSS 类名

## 📁 项目结构

```
PathFinder/
├── public/              # 静态资源目录
├── src/
│   ├── assets/         # 资源文件（图片、字体等）
│   ├── components/     # Vue 组件
│   │   ├── Header.vue           # 顶部导航栏（含主题切换）
│   │   ├── HeroSection.vue     # 英雄区域（个人介绍）
│   │   ├── SkillsSection.vue   # 技能展示区域
│   │   ├── ProjectsSection.vue # 项目展示区域
│   │   ├── Footer.vue          # 页脚
│   │   └── ThreeDBackground.vue # 3D 背景组件
│   ├── composables/    # 组合式函数
│   │   └── useTheme.ts         # 主题管理（单例模式）
│   ├── constants/      # 常量定义
│   │   └── index.ts            # 导航项、个人信息等常量
│   ├── router/         # 路由配置
│   │   └── index.ts            # 路由定义
│   ├── types/          # TypeScript 类型定义
│   │   └── index.ts            # 接口和类型
│   ├── utils/          # 工具函数
│   │   └── utils.ts            # 通用工具函数
│   ├── views/          # 页面视图
│   │   ├── Home.vue            # 首页
│   │   └── Other.vue            # 其他页面
│   ├── App.vue         # 根组件
│   ├── main.ts         # 应用入口
│   └── style.css       # 全局样式（含主题变量）
├── index.html          # HTML 模板
├── package.json        # 项目配置
├── vite.config.ts      # Vite 配置
└── tsconfig.json       # TypeScript 配置
```

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

开发服务器将在 http://localhost:3000 启动

### 构建生产版本

```bash
pnpm build
```

构建产物将输出到 `dist/static` 目录

## 🎨 主题系统

项目实现了完整的深色/浅色主题切换系统：

- **自动检测** - 自动检测系统主题偏好
- **持久化存储** - 主题选择保存在 localStorage
- **实时切换** - 主题切换无需刷新页面
- **3D 背景适配** - 3D 背景颜色随主题自动调整

### 使用主题

```typescript
import { useTheme } from '@/composables/useTheme';

const { theme, toggleTheme, isDark, isLight } = useTheme();
```

## 🧩 核心组件

### ThreeDBackground

3D 动态背景组件，包含：
- 粒子系统（动态粒子星云）
- 能量核心（发光球体）
- 动态连线（粒子之间的连接线）
- 能量波（扩散的环形波纹）
- 装饰几何体（旋转的 3D 几何形状）

### Header

顶部导航栏组件，包含：
- 响应式导航菜单
- 主题切换按钮
- 品牌 Logo

### HeroSection

英雄区域组件，展示：
- 个人头像
- 姓名和职位
- 个人简介

### SkillsSection

技能展示区域，展示技能标签列表

### ProjectsSection

项目展示区域，展示项目卡片列表

### Footer

页脚组件，包含：
- 版权信息
- 社交媒体链接

## 🔧 开发指南

### 添加新页面

1. 在 `src/views/` 目录下创建新的 Vue 组件
2. 在 `src/router/index.ts` 中添加路由配置

### 自定义主题颜色

编辑 `src/style.css` 中的 CSS 变量：

```css
:root {
  --bg-primary: #1f1f1f;
  --text-primary: #f5f5f5;
  /* ... */
}

.light {
  --bg-primary: #f5f5f5;
  --text-primary: #1f2937;
  /* ... */
}
```

### 修改个人信息

编辑 `src/constants/index.ts` 中的 `DEFAULT_PERSONAL_INFO` 常量

## 📝 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 最佳实践
- 组件使用 `<script setup>` 语法
- 使用 Tailwind CSS 进行样式编写
- 组件和函数使用 PascalCase 命名
- 组合式函数使用 `use` 前缀

## 🐛 问题排查

### 3D 背景不显示

- 检查浏览器是否支持 WebGL
- 检查 Three.js 是否正确加载
- 查看浏览器控制台是否有错误信息

### 主题切换不生效

- 检查 `useTheme` composable 是否正确导入
- 检查 CSS 变量是否正确定义
- 清除浏览器缓存后重试

## 📄 许可证

MIT License

## 👤 作者

PathFinder Team

---

**PathFinder | 成长足迹** - 记录每一次成长的足迹 🚀