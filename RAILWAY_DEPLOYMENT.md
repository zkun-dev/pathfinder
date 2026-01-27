# PathFinder Railway 部署指南

本文档详细说明如何将 PathFinder 前端项目部署到 Railway 平台。

## 📋 目录

- [前置准备](#前置准备)
- [Railway 账号设置](#railway-账号设置)
- [创建新项目](#创建新项目)
- [配置环境变量](#配置环境变量)
- [部署项目](#部署项目)
- [验证部署](#验证部署)
- [常见问题](#常见问题)
- [后续维护](#后续维护)

---

## 前置准备

### 1. 确保后端服务已部署

⚠️ **重要**：在部署前端之前，请确保后端 API 服务已经部署到 Railway 或其他平台，并获取后端服务的 URL。

### 2. 配置本地环境变量（开发环境，可选）

📝 **说明**：开发环境有默认值 `http://localhost:3001/api`，无需配置即可启动。

如果需要自定义 API 地址：

1. **复制示例文件**：
   ```bash
   cp env.example .env.development
   ```

2. **编辑 `.env.development`**：
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   ```
   
   根据你的本地后端地址修改此值。

### 2. 准备的文件

确保项目根目录包含以下文件：

- ✅ `Dockerfile` - Docker 构建配置
- ✅ `nginx.conf` - Nginx 服务器配置
- ✅ `package.json` - 项目依赖配置
- ✅ `pnpm-lock.yaml` - 依赖锁定文件
- ✅ `.dockerignore` - Docker 构建忽略文件

### 3. 检查项目配置

确保项目可以正常构建：

```bash
# 安装依赖
pnpm install

# 本地构建测试
pnpm run build

# 验证构建产物
ls -la dist/static
```

---

## Railway 账号设置

### 1. 注册 Railway 账号

1. 访问 [Railway 官网](https://railway.app/)
2. 点击 "Start a New Project" 或 "Login"
3. 使用 GitHub 账号登录（推荐）或邮箱注册

### 2. 连接 GitHub（推荐）

如果使用 GitHub 部署：

1. 在 Railway 中点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 授权 Railway 访问你的 GitHub 仓库
4. 选择 `pathfinder` 仓库

---

## 创建新项目

### 方式一：从 GitHub 仓库部署（推荐）

1. **登录 Railway Dashboard**
   - 访问 https://railway.app/dashboard

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的 `pathfinder` 仓库

3. **Railway 会自动检测**
   - Railway 会自动检测到 `Dockerfile`
   - 自动开始构建和部署

### 方式二：从本地代码部署

1. **安装 Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **登录 Railway**
   ```bash
   railway login
   ```

3. **初始化项目**
   ```bash
   railway init
   ```

4. **部署项目**
   ```bash
   railway up
   ```

---

## 配置环境变量

### ⚠️ 重要：必须配置的环境变量

在 Railway Dashboard 中配置以下环境变量：

#### 1. 必需环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | 后端 API 基础地址 | `https://your-backend.up.railway.app/api` |

#### 2. 配置步骤

1. **进入项目设置**
   - 在 Railway Dashboard 中，点击你的项目
   - 点击 "Variables" 标签页

2. **添加环境变量**
   - 点击 "New Variable"
   - 变量名：`VITE_API_BASE_URL`
   - 变量值：你的后端 API 地址（必须以 `/api` 结尾）
   - 点击 "Add"

3. **环境变量示例**

   ```
   VITE_API_BASE_URL=https://pathfinder-backend-production-3268.up.railway.app/api
   ```

   ⚠️ **注意**：
   - 必须以 `VITE_` 开头才能在 Vite 构建时访问
   - 必须包含完整的协议（`https://`）
   - 必须以 `/api` 结尾

### 3. 自动环境变量

Railway 会自动设置以下环境变量，无需手动配置：

- `PORT` - Railway 分配的端口号（Nginx 会自动使用）
- `RAILWAY_ENVIRONMENT` - 环境名称（production/staging）

---

## 部署项目

### 自动部署（GitHub 集成）

如果使用 GitHub 集成：

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "准备部署到 Railway"
   git push origin main
   ```

2. **Railway 自动部署**
   - Railway 会自动检测到新的提交
   - 自动开始构建和部署
   - 可以在 Railway Dashboard 中查看构建日志

### 手动部署

如果需要手动触发部署：

1. **在 Railway Dashboard 中**
   - 点击项目
   - 点击 "Deployments" 标签页
   - 点击 "Redeploy" 按钮

2. **使用 Railway CLI**
   ```bash
   railway up
   ```

### 查看构建日志

1. **在 Railway Dashboard 中**
   - 点击项目
   - 点击 "Deployments" 标签页
   - 点击最新的部署记录
   - 查看 "Build Logs" 和 "Deploy Logs"

2. **常见构建步骤**
   ```
   ✓ 安装 pnpm
   ✓ 安装依赖 (pnpm install --frozen-lockfile)
   ✓ 构建项目 (pnpm run build)
   ✓ 验证构建产物
   ✓ 复制到 Nginx
   ✓ 启动 Nginx 服务器
   ```

---

## 验证部署

### 1. 获取部署 URL

部署成功后，Railway 会提供一个公共 URL：

1. **在 Railway Dashboard 中**
   - 点击项目
   - 在 "Settings" 标签页中找到 "Domains"
   - 复制生成的域名（例如：`pathfinder-production.up.railway.app`）

### 2. 访问网站

1. **打开浏览器**
   - 访问 Railway 提供的 URL
   - 检查页面是否正常加载

2. **检查功能**
   - ✅ 首页是否正常显示
   - ✅ 导航菜单是否正常
   - ✅ API 请求是否成功（打开浏览器开发者工具，查看 Network 标签）
   - ✅ 3D 背景是否正常显示
   - ✅ 主题切换是否正常

### 3. 检查 API 连接

1. **打开浏览器开发者工具**
   - 按 `F12` 打开开发者工具
   - 切换到 "Network" 标签页

2. **检查 API 请求**
   - 刷新页面
   - 查看是否有 API 请求
   - 确认请求 URL 是否正确（应该指向你配置的后端地址）
   - 确认请求状态码是否为 200

3. **如果 API 请求失败**
   - 检查 `VITE_API_BASE_URL` 环境变量是否正确
   - 检查后端服务是否正常运行
   - 检查后端 CORS 配置是否允许前端域名访问

---

## 常见问题

### 1. 构建失败

**问题**：构建过程中出现错误

**解决方案**：
- 检查构建日志，查看具体错误信息
- 确认 `package.json` 和 `pnpm-lock.yaml` 已提交到仓库
- 确认 Node.js 版本符合要求（>= 18.0.0）
- 尝试在本地运行 `pnpm run build` 检查是否有错误

### 2. 环境变量未生效

**问题**：构建后 API 请求仍然使用默认地址

**解决方案**：
- 确认环境变量名必须以 `VITE_` 开头
- 确认环境变量已添加到 Railway Variables
- 重新部署项目（环境变量更改后需要重新构建）
- 检查构建日志，确认环境变量是否被正确读取

### 3. 404 错误（SPA 路由问题）

**问题**：直接访问路由或刷新页面时出现 404

**解决方案**：
- 确认 `nginx.conf` 文件已正确配置 SPA 路由支持
- 确认 `nginx.conf` 已复制到 Docker 镜像中
- 检查 Nginx 配置是否正确应用

### 4. API 请求失败（CORS 错误）

**问题**：浏览器控制台显示 CORS 错误

**解决方案**：
- 检查后端 CORS 配置，确保允许前端域名访问
- 确认 `VITE_API_BASE_URL` 配置正确
- 检查后端服务是否正常运行

### 5. 静态资源加载失败

**问题**：CSS、JS 文件无法加载

**解决方案**：
- 检查构建产物是否在 `dist/static` 目录
- 确认 Dockerfile 正确复制了构建产物
- 检查 Nginx 配置中的静态资源路径

### 6. 端口问题

**问题**：服务无法启动

**解决方案**：
- Railway 会自动设置 `PORT` 环境变量
- 确认 Nginx 配置使用 `$PORT` 变量
- 确认 Dockerfile 中的 CMD 命令正确

### 7. 构建时间过长

**问题**：构建过程很慢

**解决方案**：
- Railway 使用 Docker 层缓存优化构建
- 确保 `package.json` 和 `pnpm-lock.yaml` 在源代码之前复制
- 考虑使用 Railway 的构建缓存功能

---

## 后续维护

### 1. 更新部署

**自动更新**（推荐）：
- 推送代码到 GitHub 主分支
- Railway 会自动检测并部署

**手动更新**：
- 在 Railway Dashboard 中点击 "Redeploy"

### 2. 查看日志

1. **在 Railway Dashboard 中**
   - 点击项目
   - 点击 "Deployments" 标签页
   - 选择部署记录
   - 查看 "Build Logs" 和 "Deploy Logs"

2. **实时日志**
   - 点击 "View Logs" 查看实时日志
   - 可以筛选不同级别的日志

### 3. 回滚部署

如果新部署出现问题：

1. **在 Railway Dashboard 中**
   - 点击项目
   - 点击 "Deployments" 标签页
   - 找到之前的成功部署
   - 点击 "Redeploy"

### 4. 监控和告警

1. **设置监控**
   - Railway 提供基本的监控功能
   - 可以查看 CPU、内存使用情况
   - 可以设置告警规则

2. **性能优化**
   - 监控构建时间
   - 优化 Dockerfile 层缓存
   - 考虑使用 CDN 加速静态资源

### 5. 自定义域名

如果需要使用自定义域名：

1. **在 Railway Dashboard 中**
   - 点击项目
   - 点击 "Settings" 标签页
   - 找到 "Domains" 部分
   - 点击 "Custom Domain"
   - 输入你的域名
   - 按照提示配置 DNS 记录

2. **DNS 配置**
   - 添加 CNAME 记录指向 Railway 提供的域名
   - 等待 DNS 生效（通常几分钟到几小时）

---

## 部署检查清单

部署前请确认：

- [ ] 后端服务已部署并正常运行
- [ ] 已获取后端 API 地址
- [ ] 项目可以本地正常构建（`pnpm run build`）
- [ ] `Dockerfile` 和 `nginx.conf` 文件存在
- [ ] 已创建 Railway 项目
- [ ] 已配置 `VITE_API_BASE_URL` 环境变量
- [ ] 已推送代码到 GitHub（如果使用 GitHub 集成）
- [ ] 部署成功后已验证网站功能正常

---

## 技术架构说明

### 构建流程

1. **构建阶段**（Dockerfile builder）
   - 使用 Node.js 18 Alpine 镜像
   - 安装 pnpm
   - 安装项目依赖
   - 构建前端应用（Vite）
   - 验证构建产物

2. **生产阶段**（Dockerfile production）
   - 使用 Nginx Alpine 镜像
   - 安装 envsubst（环境变量替换工具）
   - 复制构建产物到 Nginx html 目录
   - 复制 Nginx 配置文件
   - 启动 Nginx 服务器

### 环境变量处理

- **构建时**：`VITE_API_BASE_URL` 在构建时被注入到代码中
- **运行时**：`PORT` 在运行时被 Nginx 使用

### Nginx 配置

- **SPA 路由支持**：所有路由都返回 `index.html`
- **静态资源缓存**：带版本号的资源长期缓存
- **Gzip 压缩**：启用 Gzip 压缩优化传输
- **安全头**：添加安全响应头

---

## 相关资源

- [Railway 官方文档](https://docs.railway.app/)
- [Docker 官方文档](https://docs.docker.com/)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Vite 官方文档](https://vitejs.dev/)

---

## 获取帮助

如果遇到问题：

1. 查看 Railway Dashboard 中的构建日志
2. 检查浏览器开发者工具的控制台和网络请求
3. 参考本文档的"常见问题"部分
4. 查看 Railway 官方文档

---

**祝部署顺利！** 🚀
