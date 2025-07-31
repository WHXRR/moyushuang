FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# 开发依赖安装阶段
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

# 生产阶段
FROM node:22-alpine AS production

# 安装dumb-init用于正确处理信号
RUN apk add --no-cache dumb-init

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app

# 复制生产依赖
COPY --from=dependencies --chown=nestjs:nodejs /app/node_modules ./node_modules

# 复制构建产物和必要文件
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/generated ./generated
COPY --from=build --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=build --chown=nestjs:nodejs /app/prisma ./prisma

# 切换到非root用户
USER nestjs

# 暴露端口
EXPOSE 3000

# 使用dumb-init启动应用
CMD ["dumb-init", "sh", "-c", "npx prisma migrate deploy && node dist/main.js"]