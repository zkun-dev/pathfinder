# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@latest

# 复制依赖文件（利用 Docker 层缓存）
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建前端
# 注意：VITE_API_BASE_URL 等环境变量需要在 Railway Variables 中设置
# Railway 会在构建时自动注入这些环境变量
# 环境变量名必须以 VITE_ 开头才能在 Vite 构建时访问

# 执行构建（构建产物输出到 dist/static 目录）
RUN pnpm run build

# 验证构建产物是否存在
RUN test -d /app/dist/static || (echo "构建失败：dist/static 目录不存在" && exit 1)

# 生产阶段 - 使用 Nginx 提供静态文件服务
FROM nginx:alpine

# 安装 envsubst（用于替换环境变量）
RUN apk add --no-cache gettext

# 复制构建产物到 Nginx 的 html 目录
# 构建产物位于 dist/static 目录（包含 index.html 和 assets 目录）
COPY --from=builder /app/dist/static /usr/share/nginx/html

# 复制 Nginx 配置文件模板（用于 SPA 路由支持）
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Railway 会自动设置 PORT 环境变量，默认使用 80
# 暴露端口（Railway 会自动映射）
EXPOSE ${PORT:-80}

# 启动脚本：使用 envsubst 替换环境变量后启动 Nginx
# Railway 会自动设置 PORT 环境变量，如果没有设置则使用 80
CMD export PORT=${PORT:-80} && envsubst '$$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
