# 🐟 魔域爽 - 让交流更有趣！

![魔域爽](./public/fish.svg)

> Ctrl+C 是工作，Ctrl+V 是生活，Alt+Tab 是信仰～

## 🌈 项目介绍

😵‍💫 上班太无聊？想找人聊聊？
发微信二维码没人扫？加好友还得等通过？平台消息回得慢都能睡一觉？

我懂你。
于是我写了这个小聊天室 —— 不用加好友，不用等人回，注册登录就能开聊！

上班摸鱼不寂寞，快速搭子在线等。

## ✨ 特色功能

- 🔐 **用户认证系统**：支持注册、登录和密码找回
- 👥 **群聊管理**：创建、加入、修改和删除聊天室
- 💬 **实时消息**：基于 Socket.IO 的即时消息传递
- 😄 **表情包支持**：丰富的表情包让聊天更生动
- 🐱 **可爱头像**：多种动物头像可供选择
- 📱 **响应式设计**：适配不同设备屏幕
- 🌈 **精美界面**：粉色主题，温馨可爱
- 🔄 **实时状态**：在线用户状态实时更新
- 🚀 **快速加载**：基于 Vite 的快速构建和热更新

## 🚀 技术栈

### 核心框架
- **前端框架**：React 19 + TypeScript
- **构建工具**：Vite 7
- **包管理器**：npm

### UI & 样式
- **UI 组件库**：Ant Design 5
- **样式解决方案**：TailwindCSS 4

### 状态管理 & 路由
- **状态管理**：Zustand
- **路由管理**：React Router 7
- **上下文管理**：React Context API

### 网络 & 通信
- **网络请求**：Axios
- **实时通信**：Socket.IO Client
- **进度条**：NProgress

### 开发工具
- **代码规范**：ESLint + Prettier
- **类型检查**：TypeScript 5.8
- **热更新**：Vite HMR

## 📁 项目结构
src/
├── App.tsx                 # 应用主组件
├── main.tsx                # 应用入口文件
├── assets/                 # 静态资源
│   ├── css/               # 样式文件
│   └── images/            # 图片资源
├── components/             # 公共组件
│   ├── Avatar.tsx         # 头像组件
│   ├── PrivateRoute.tsx   # 私有路由组件
│   ├── WithPermission.tsx # 权限控制组件
│   └── WithSuspense.tsx   # 懒加载包装组件
├── context/                # React Context
│   └── ChatroomContext.tsx # 聊天室上下文
├── interfaces/             # API 接口
│   ├── api.ts             # API 接口定义
│   └── index.ts           # Axios 配置
├── pages/                  # 页面组件
│   ├── 404/               # 404 页面
│   ├── Chatroom/          # 聊天室页面
│   ├── Home/              # 首页
│   └── Login/             # 登录页面
├── router/                 # 路由配置
│   └── index.tsx          # 路由定义
├── store/                  # 状态管理
│   └── index.ts           # Zustand store
├── types/                  # TypeScript 类型定义
│   ├── chat.d.ts          # 聊天相关类型
│   └── user.d.ts          # 用户相关类型
├── utils/                  # 工具函数
│   ├── getAllAvatar.ts    # 获取头像列表
│   ├── getAllEmoji.ts     # 获取表情包列表
│   ├── insertEmoji.ts     # 插入表情包
│   └── socketClient.ts    # Socket.IO 客户端
└── vite-env.d.ts          # Vite 环境类型


## 🛠️ 开发环境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **现代浏览器**: 支持 ES2020+

## 📦 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd moyushuang-frontend
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置

复制环境变量文件并配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 后端 API 地址
VITE_API_BASE_URL=http://localhost:3000

# Socket.IO 服务地址
VITE_SOCKET_URL=http://localhost:3000
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

### 5. 构建生产版本

```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

## 🐳 Docker 部署

### 构建镜像

```bash
docker build -t moyushuang-frontend .
```

### 运行容器

```bash
docker run -p 80:80 moyushuang-frontend
```

### 使用 docker-compose

```bash
# 在项目根目录运行
docker-compose up -d
```

## 🔧 开发脚本

```bash
# 开发模式
npm run dev

# 类型检查 + 构建
npm run build

# 代码检查
npm run lint

# 代码格式化
npm run format

# 预览生产版本
npm run preview
```

## 🌐 环境变量说明

| 变量名 | 说明 | 默认值 | 必填 |
|--------|------|--------|------|
| `VITE_API_BASE_URL` | 后端 API 基础地址 | `http://localhost:3000` | ✅ |
| `VITE_SOCKET_URL` | Socket.IO 服务地址 | `http://localhost:3000` | ✅ |

## 🎨 主题定制

项目支持 Ant Design 主题定制，可在 `App.tsx` 中修改主题配置：

```typescript
const theme = {
  token: {
    colorPrimary: '#ff69b4', // 主色调
    borderRadius: 8,         // 圆角大小
    // 更多配置...
  }
}
```

## 📱 浏览器支持

- Chrome >= 88
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

**愿你的每一次摸鱼都充满快乐！** 🐟✨