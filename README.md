# myblog_front_new

一个基于 Vue 3 构建的个人博客前端项目，包含登录鉴权、博客展示、个人主页、搜索页和节日活动页等内容。

该仓库目前只包含前端代码，完整功能运行依赖对应的后端接口服务。

## 项目亮点

- 基于 `Vue 3 + TypeScript + Vite` 搭建
- 使用 `Pinia` 管理用户状态
- 使用 `Vue Router 4` 处理页面路由与鉴权跳转
- 使用 `alova` 统一封装请求逻辑
- 支持 GitHub OAuth 登录
- 支持 Markdown 文章渲染
- 包含动效首页、博客页、搜索页、个人页和活动页

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 框架 | `Vue 3` |
| 构建工具 | `Vite 7` |
| 语言 | `TypeScript` |
| 路由 | `Vue Router 4` |
| 状态管理 | `Pinia` |
| UI 组件 | `Element Plus` |
| 样式能力 | `SCSS`、`Tailwind CSS 4` |
| 请求层 | `alova` |
| 动效 | `GSAP`、`typed.js` |
| 内容渲染 | `markdown-it` |

## 功能模块

### 1. 登录 / 注册

- 账号密码登录
- GitHub OAuth 登录
- 登录态本地持久化
- 登录页多语言切换

### 2. 首页

- 动效展示
- 打字机文案
- 访客记录展示

### 3. 博客模块

- 分类浏览
- 文章详情展示
- Markdown 渲染
- 评论相关能力

### 4. 其他页面

- 搜索页
- 个人主页
- 新春活动页

## 页面路由

| 路由 | 说明 |
| --- | --- |
| `/` | 首页，当前需要登录后访问 |
| `/login` | 登录 / 注册页 |
| `/callback` | GitHub OAuth 回调页 |
| `/blog` | 博客详情页 |
| `/bloglist` | 博客列表页 |
| `/search` | 搜索页 |
| `/me` | 个人主页 |
| `/happy` | 活动页 |

## 快速开始

### 环境要求

- `Node.js`: `^20.19.0 || >=22.12.0`
- 推荐使用 `npm`

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```

### 类型检查

```bash
npm run type-check
```

### 构建生产版本

```bash
npm run build
```

### 本地预览构建结果

```bash
npm run preview
```

## 环境变量

### `.env`

```env
VITE_APP_TITLE=harrio的小屋
VITE_APP_VERSION=1.0.0
```

### `.env.development`

```env
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:8080
```

### `.env.production`

```env
VITE_API_BASE_URL=https://your-api-domain/api
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run build-only` | 仅执行构建 |
| `npm run preview` | 预览构建结果 |
| `npm run type-check` | 执行 `vue-tsc --build` |
| `npm run lint` | 执行 ESLint 并自动修复 |
| `npm run format` | 使用 Prettier 格式化 `src/` 目录 |

## 项目结构

```text
myblog_front_new/
├─ public/
├─ src/
│  ├─ api/                # 接口定义与请求封装
│  ├─ assets/             # 样式、图标、图片、音视频资源
│  ├─ components/         # 通用组件
│  ├─ composables/        # 复用逻辑
│  ├─ constants/          # 常量与文案
│  ├─ router/             # 路由配置
│  ├─ stores/             # Pinia 状态管理
│  ├─ utils/              # 工具函数
│  ├─ views/              # 页面视图
│  ├─ App.vue
│  └─ main.ts
├─ .env
├─ .env.development
├─ .env.production
├─ vite.config.ts
└─ vercel.json
```

## 开发说明

- 首页 `/` 启用了路由鉴权，未登录会自动跳转到 `/login`
- 登录成功后，`token` 和 `userInfo` 会写入本地存储
- 博客详情页支持从外部 Markdown 地址拉取内容
- 图片访问通过 `/image-proxy` 做转发处理
- 当前仓库仅包含前端，联调时需要后端服务配合

## 本地调试提示

- 如果访问首页后直接跳到 `/login`，这是当前设计的正常行为
- 如果博客页没有分类或热门标签，请优先确认后端服务是否已经启动
- 如果只想查看纯前端页面，可优先访问 `/login`、`/search`、`/me`、`/happy`

## 部署说明

- 开发环境通过 Vite 代理 `/api` 请求到本地后端
- 生产环境通过 `.env.production` 直接请求线上 API
- `vercel.json` 已处理 SPA 路由回退和部分代理转发逻辑

## 后续可补充

- 在线预览地址
- 项目截图或 GIF 演示
- 后端仓库地址
- 接口文档地址
- License 信息
