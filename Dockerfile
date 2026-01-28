# ============================================
# 构建阶段
# ============================================
FROM node:18-alpine AS builder

# 声明构建参数（必须在 FROM 之后立即声明）
ARG VITE_API_BASE_URL

WORKDIR /app

# 安装 pnpm（使用固定版本以提高可重现性）
RUN npm install -g pnpm@latest

# 复制依赖文件（利用 Docker 层缓存优化）
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile --prod=false

# 复制源代码
COPY . .

# 设置构建时环境变量
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV NODE_ENV=production

# 构建前端应用（代码中已有环境变量验证）
RUN pnpm run build

# 验证构建产物
RUN test -d /app/dist/static || (echo "❌ 构建失败：dist/static 目录不存在" >&2 && exit 1)

# ============================================
# 生产阶段 - Nginx 静态文件服务
# ============================================
FROM nginx:alpine

# 安装运行时依赖（gettext 用于 envsubst，wget 用于健康检查）
RUN apk add --no-cache gettext wget

# 复制构建产物
COPY --from=builder /app/dist/static /usr/share/nginx/html

# 复制 Nginx 配置模板
COPY nginx.conf /etc/nginx/templates/default.conf.template

# 暴露端口（Railway 会自动设置 PORT 环境变量）
EXPOSE ${PORT:-80}

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-80}/ || exit 1

# 启动 Nginx（使用 envsubst 替换 PORT 变量）
CMD PORT=${PORT:-80} \
    envsubst '$$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && \
    nginx -g 'daemon off;'
