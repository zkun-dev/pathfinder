# ============================================
# 构建阶段
# ============================================
FROM node:18-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@latest

# 复制依赖文件（利用 Docker 层缓存优化）
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建前端应用
# ⚠️ Railway 会在构建时自动注入环境变量
# 环境变量必须以 VITE_ 开头才能在 Vite 构建时访问
# 必需环境变量：VITE_API_BASE_URL（后端 API 地址）
#
# 使用 ARG 声明构建参数，确保环境变量在构建时可用
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# 输出构建时的环境变量（用于调试）
RUN echo "=========================================" && \
    echo "构建环境变量检查" && \
    echo "=========================================" && \
    echo "NODE_ENV=${NODE_ENV:-not set}" && \
    echo "VITE_API_BASE_URL=${VITE_API_BASE_URL:-not set}" && \
    echo "=========================================" && \
    if [ -z "$VITE_API_BASE_URL" ]; then \
      echo "❌ 错误: VITE_API_BASE_URL 环境变量未设置"; \
      echo "请在 Railway Variables 中设置 VITE_API_BASE_URL"; \
      echo "例如: VITE_API_BASE_URL=https://pathfinder-backend-production-3268.up.railway.app/api"; \
      exit 1; \
    fi && \
    echo "✅ 环境变量验证通过: $VITE_API_BASE_URL" && \
    echo "开始构建..." && \
    pnpm run build

# 验证构建产物
RUN test -d /app/dist/static || (echo "构建失败：dist/static 目录不存在" && exit 1)

# ============================================
# 生产阶段 - Nginx 静态文件服务
# ============================================
FROM nginx:alpine

# 安装 envsubst（用于替换环境变量）
RUN apk add --no-cache gettext

# 复制构建产物到 Nginx html 目录
COPY --from=builder /app/dist/static /usr/share/nginx/html

# 复制 Nginx 配置文件模板（支持 SPA 路由）
COPY nginx.conf /etc/nginx/templates/default.conf.template

# 暴露端口（Railway 会自动设置 PORT 环境变量）
EXPOSE ${PORT:-80}

# 启动脚本：替换环境变量后启动 Nginx
CMD PORT=${PORT:-80} envsubst '$$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
