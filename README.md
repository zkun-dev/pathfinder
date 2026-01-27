# PathFinder | 成长足迹

一个基于 Vue 3 + TypeScript 的现代化个人作品集网站，具有炫酷的 3D 背景效果和流畅的动画体验，包含完整的管理后台系统。

## ✨ 特性

### 前端展示
- 🎨 **深色/浅色主题切换** - 支持系统主题检测和手动切换，主题切换流畅无闪烁
- 🌐 **3D 动态背景** - 基于 Three.js 的粒子系统和能量核心效果，支持主题自适应
- 🎭 **流畅动画** - 使用 @vueuse/motion 实现页面元素的优雅动画
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🎯 **空状态处理** - 所有页面和模块都有友好的空状态提示
- 🖼️ **图片展示** - 支持项目图片、生活动态图片等多种图片展示方式

### 管理后台
- 🔐 **完整认证系统** - JWT 认证，安全的登录和权限管理
- 📊 **数据管理** - 支持个人信息、技能、项目、工作经历、学习记录、生活动态的完整 CRUD 操作
- 🖼️ **图片上传** - 支持单图和多图上传，自动压缩和预览
- ✅ **操作确认** - 删除操作使用美观的确认对话框，防止误操作
- 🔔 **消息提示** - 统一的 Toast 提示系统，操作成功/失败都有友好提示
- 📝 **表单验证** - 完整的表单验证和错误提示
- 🎨 **统一 UI** - 管理界面与前端展示保持一致的视觉风格

### 技术特性
- 🧩 **组件化架构** - 高度模块化的组件设计，易于维护和扩展
- ⚡ **性能优化** - 基于 Vite 的快速构建和热更新，代码分割优化
- 🎯 **TypeScript** - 完整的类型支持，提升开发体验
- 🔌 **API集成** - 完整集成后端API，支持动态数据加载
- 🛠️ **工具函数** - 丰富的工具函数库，提高开发效率

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

### API集成
- **RESTful API** - 与后端API完整集成
- **JWT认证** - 支持用户认证和授权
- **类型安全** - 完整的TypeScript类型定义，与后端数据模型匹配

## 📁 项目结构

```
PathFinder/
├── public/              # 静态资源目录
├── src/
│   ├── assets/         # 资源文件（图片、字体等）
│   ├── components/     # Vue 组件
│   │   ├── Admin/              # 管理后台组件
│   │   │   ├── ConfirmDialog.vue    # 确认对话框
│   │   │   ├── ImageUpload.vue      # 图片上传组件
│   │   │   ├── Modal.vue            # 模态框组件
│   │   │   └── Toast.vue            # 提示消息组件
│   │   ├── EmptyState.vue           # 空状态组件
│   │   ├── ExperiencesSection.vue   # 工作经历展示
│   │   ├── ExperiencesTimeline.vue   # 工作经历时间线
│   │   ├── Footer.vue               # 页脚
│   │   ├── Header.vue               # 顶部导航栏
│   │   ├── HeroSection.vue          # 英雄区域
│   │   ├── LearningsSection.vue     # 学习记录展示
│   │   ├── LifeGallery.vue           # 生活动态画廊
│   │   ├── LifeSection.vue          # 生活动态展示
│   │   ├── ProjectsSection.vue      # 项目展示
│   │   ├── SkillsSection.vue         # 技能展示
│   │   └── ThreeDBackground.vue      # 3D 背景组件
│   ├── composables/    # 组合式函数
│   │   ├── useAuth.ts         # 认证管理
│   │   ├── useTheme.ts        # 主题管理（单例模式）
│   │   └── useToast.ts        # Toast 提示管理
│   ├── config/         # 配置文件
│   │   └── api.ts              # API配置
│   ├── constants/      # 常量定义
│   │   └── index.ts            # 导航项等常量
│   ├── services/       # API服务
│   │   └── api.ts              # API调用封装
│   ├── router/         # 路由配置
│   │   └── index.ts            # 路由定义
│   ├── types/          # TypeScript 类型定义
│   │   └── index.ts            # 接口和类型
│   ├── utils/          # 工具函数
│   │   ├── logger.ts          # 日志工具
│   │   └── utils.ts            # 通用工具函数
│   ├── views/          # 页面视图
│   │   ├── Admin/              # 管理后台页面
│   │   │   ├── Dashboard.vue         # 仪表盘
│   │   │   ├── DashboardContent.vue  # 仪表盘内容
│   │   │   ├── ExperiencesManage.vue # 工作经历管理
│   │   │   ├── LearningsManage.vue   # 学习记录管理
│   │   │   ├── LifeManage.vue        # 生活动态管理
│   │   │   ├── Login.vue             # 登录页面
│   │   │   ├── ProfileManage.vue     # 个人信息管理
│   │   │   ├── ProjectsManage.vue     # 项目管理
│   │   │   └── SkillsManage.vue       # 技能管理
│   │   ├── About.vue            # 关于我页面
│   │   ├── ExperienceDetail.vue # 工作经历详情
│   │   ├── Experiences.vue      # 工作经历列表
│   │   ├── Home.vue            # 首页
│   │   ├── LearningDetail.vue  # 学习记录详情
│   │   ├── Learnings.vue       # 学习记录列表
│   │   ├── Life.vue            # 生活动态列表
│   │   ├── LifeDetail.vue      # 生活动态详情
│   │   ├── ProjectDetail.vue  # 项目详情
│   │   ├── Projects.vue        # 项目列表
│   │   └── Skills.vue          # 技能列表
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
- **后端API服务** - 需要先启动后端服务（参考 `pathfinder-backend` 项目）

### 配置环境变量

#### 📝 环境变量配置说明

环境变量配置是**可选的**，项目提供了默认值：

- **开发环境**：默认使用 `http://localhost:3001/api`
- **生产环境**：默认使用 Railway 后端地址（部署时建议在 Railway Variables 中配置）

#### 🔧 自定义配置（可选）

如果需要自定义 API 地址，可以创建环境变量文件：

**1. 开发环境（可选）**

```bash
# 复制示例文件
cp env.example .env.development

# 编辑 .env.development，修改为你的本地后端地址
# VITE_API_BASE_URL=http://localhost:3001/api
```

**2. 生产环境配置**

**方式一：Railway Variables（推荐）**

在 Railway Dashboard → Variables 中添加：
```
VITE_API_BASE_URL=https://你的后端地址.up.railway.app/api
```

**方式二：本地测试用 `.env.production`（可选）**

```bash
# 复制示例文件（仅用于本地生产构建测试）
cp env.example .env.production

# 编辑 .env.production
# VITE_API_BASE_URL=https://your-backend.up.railway.app/api
```

⚠️ **重要提示**：
- ✅ 环境变量必须以 `VITE_` 开头才能在 Vite 构建时访问
- ✅ 必须是完整的 URL（包含协议和路径），例如：`http://localhost:3001/api`
- ✅ 开发环境有默认值，无需配置即可启动
- ✅ 生产环境部署到 Railway 时，建议在 Railway Variables 中配置（有默认值作为后备）
- 📝 环境变量文件已被 `.gitignore` 忽略，不会提交到仓库

### 🚢 Railway 部署

项目已配置好 Railway 部署，详细部署指南请参考：

- 📖 **[Railway 部署指南](./RAILWAY_DEPLOYMENT.md)** - 完整的 Railway 部署教程

快速部署步骤：
1. 在 Railway 创建新项目
2. 连接 GitHub 仓库或使用 Railway CLI
3. 配置 `VITE_API_BASE_URL` 环境变量
4. Railway 会自动构建和部署

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

开发服务器将在 http://localhost:3000 启动

**注意**：确保后端API服务已启动（Railway 部署）

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

### EmptyState

空状态组件，用于数据为空时的友好提示：
- 自定义图标、标题和描述
- 可选的操作按钮
- 适配深色/浅色主题

### Admin Components

管理后台专用组件：

- **Modal** - 模态框组件，用于添加/编辑表单
- **ConfirmDialog** - 确认对话框，用于删除等危险操作
- **Toast** - 提示消息组件，显示操作成功/失败提示
- **ImageUpload** - 图片上传组件，支持单图和多图上传

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

### 管理后台使用

项目包含完整的管理后台系统，支持所有数据的可视化管理：

1. **访问管理后台** - 访问 `/admin/login` 进行登录
2. **数据管理** - 在管理后台可以：
   - 管理个人信息（头像、简介、联系方式等）
   - 管理技能列表（名称、分类、熟练度等）
   - 管理项目（标题、描述、技术栈、链接等）
   - 管理工作经历（公司、职位、时间、成就等）
   - 管理学习记录（标题、分类、状态、资源等）
   - 管理生活动态（标题、内容、图片、标签等）
3. **图片上传** - 支持上传封面图、项目图片、生活动态图片等
4. **操作提示** - 所有操作都有成功/失败提示，删除操作需要确认

### 修改个人信息

现在所有数据都通过管理后台进行管理：

1. **使用管理界面** - 登录管理后台，通过可视化界面管理所有数据
2. **通过后端API管理** - 使用后端提供的API接口直接管理数据
3. **直接操作数据库** - 通过Prisma Studio等工具直接操作数据库

前端会自动从API获取最新数据并展示。

## 📝 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 最佳实践
- 组件使用 `<script setup>` 语法
- 使用 Tailwind CSS 进行样式编写
- 组件和函数使用 PascalCase 命名
- 组合式函数使用 `use` 前缀
- 使用统一的日志工具 (`logger`) 替代 `console.log`
- 错误处理使用统一的错误提取函数 (`getErrorMessage`)
- 日期格式化使用统一的工具函数 (`formatDate`)

## 🔌 API集成

### API配置

API基础URL通过环境变量配置：

```env
VITE_API_BASE_URL=https://你的后端地址.up.railway.app/api
```

如果不配置，默认使用代码中的默认值（Railway 后端地址）

### 使用API服务

```typescript
import { profileApi, skillApi, projectApi } from '@/services/api';

// 获取个人信息
const profile = await profileApi.getProfile();

// 获取技能列表
const skills = await skillApi.getSkills();

// 获取项目列表
const projects = await projectApi.getProjects({ featured: true });
```

### 认证

如果需要使用需要认证的API（如创建、更新、删除），需要先登录：

```typescript
import { useAuth } from '@/composables/useAuth';

const { login, isAuthenticated } = useAuth();

// 登录
await login({ username: 'admin', password: 'admin123' });

// 检查是否已登录
if (isAuthenticated.value) {
  // 执行需要认证的操作
}
```

### Toast 提示

使用 Toast 提示系统显示操作结果：

```typescript
import { useToast } from '@/composables/useToast';

const toast = useToast();

// 成功提示
toast.success('操作成功！');

// 错误提示
toast.error('操作失败！');

// 警告提示
toast.warning('请注意！');

// 信息提示
toast.info('提示信息');
```

### 工具函数

项目提供了丰富的工具函数：

```typescript
import { formatDate, safeJsonParse, getErrorMessage } from '@/utils/utils';
import { logger } from '@/utils/logger';

// 格式化日期
const dateStr = formatDate(new Date()); // "2024年1月1日"
const shortDate = formatDateShort(new Date()); // "2024-01-01"

// 安全解析 JSON
const data = safeJsonParse(jsonString, {});

// 提取错误消息
const errorMsg = getErrorMessage(error, '默认错误消息');

// 日志输出（生产环境自动禁用）
logger.info('信息');
logger.error('错误');
```

## 🐛 问题排查

### API连接失败

- 确保后端服务已启动（Railway 部署）
- 检查 `.env` 文件中的 `VITE_API_BASE_URL` 配置是否正确
- 检查浏览器控制台的网络请求，查看具体的错误信息
- 确认后端CORS配置允许前端域名访问

### 数据加载失败

- 检查后端数据库是否已初始化
- 确认后端API返回的数据格式是否正确
- 查看浏览器控制台的错误信息

### 3D 背景不显示

- 检查浏览器是否支持 WebGL
- 检查 Three.js 是否正确加载
- 查看浏览器控制台是否有错误信息

### 主题切换不生效

- 检查 `useTheme` composable 是否正确导入
- 检查 CSS 变量是否正确定义
- 清除浏览器缓存后重试

### 管理后台无法访问

- 确保已登录（访问 `/admin/login`）
- 检查 JWT token 是否有效
- 确认后端认证服务正常运行

### 图片上传失败

- 检查图片大小是否超过限制（默认 5MB）
- 确认后端文件上传服务正常运行
- 检查网络连接是否正常

## 📄 许可证

MIT License

## 👤 作者

PathFinder Team

---

**PathFinder | 成长足迹** - 记录每一次成长的足迹 🚀