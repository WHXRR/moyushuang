## 📊 数据模型

### User（用户）
- `id`：用户唯一标识
- `username`：用户名（唯一）
- `password`：加密密码
- `email`：邮箱（唯一）
- `headPic`：头像
- `role`：用户角色
- `createTime`、`updateTime`：时间戳

### Chatroom（聊天室）
- `id`：聊天室唯一标识
- `name`：聊天室名称
- `createTime`、`updateTime`：时间戳

### ChatHistory（聊天记录）
- `id`：消息唯一标识
- `content`：消息内容
- `type`：消息类型
- `userId`：发送者ID
- `chatroomId`：所属聊天室ID
- `createTime`、`updateTime`：时间戳

### UserChatroom（用户-聊天室关联）
- `userId`：用户ID
- `chatroomId`：聊天室ID

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- MySQL >= 8.0
- Redis >= 6.0
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 环境配置

1. 复制环境变量模板：
```bash
cp .env.example .env.production .env.development
```

2. 配置环境变量：
```env
# 数据库配置
DATABASE_URL="mysql://username:password@localhost:3306/chat-room"
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=chat-room

# JWT 密钥
JWT_SECRET="your-jwt-secret-key"

# Redis 配置
REDIS_HOST="localhost"
REDIS_PORT=6379

# 邮件服务配置
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# 应用配置
PORT=3000
```

### 数据库初始化

```bash
# 生成 Prisma 客户端
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev --name init
```

### 启动服务

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

## 🐳 Docker 部署

```bash
# 构建镜像
docker build -t moyushuang-backend .

# 使用 docker-compose 启动完整服务
docker-compose up -d
```

## 🧪 测试

```bash
# 单元测试
npm run test

# 端到端测试
npm run test:e2e

# 测试覆盖率
npm run test:cov
```

## 📄 许可证

本项目采用 UNLICENSED 许可证。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！