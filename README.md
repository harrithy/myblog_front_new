# myblog_front_new

一个基于 `Vue 3 + TypeScript + Vite` 的个人博客前端项目，包含登录鉴权、博客内容展示、个人主页、搜索页和节日活动页等模块。

## 技术栈

- `Vue 3`
- `TypeScript`
- `Vite 7`
- `Pinia`
- `Vue Router 4`
- `Element Plus`
- `Tailwind CSS 4`
- `alova`
- `GSAP`
- `markdown-it`
- `typed.js`

## 功能概览

- 登录与注册
  支持账号密码登录、GitHub OAuth 登录和本地登录态持久化。
- 首页
  包含动效展示、打字机文案和访客记录展示。
- 博客模块
  支持分类浏览、文章详情、Markdown 渲染、评论相关能力。
- 搜索页
  提供独立搜索入口和导航交互。
- 个人页
  展示个人介绍、经历和项目内容。
- 活动页
  当前包含新春祝福主题页面。

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
- 包管理器: 推荐 `npm`

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```

开发环境下，Vite 会将 `/api` 请求代理到 `.env.development` 中的 `VITE_API_PROXY_TARGET`。如果后端没有启动，登录、博客分类、热门标签等依赖接口的页面会进入降级展示。

### 类型检查

```bash
npm run type-check
```

### 构建生产包

```bash
npm run build
```

### 本地预览生产包

```bash
npm run preview
```

## 环境变量

### `.env`

| 变量名 | 说明 |
| --- | --- |
| `VITE_APP_TITLE` | 应用标题 |
| `VITE_APP_VERSION` | 应用版本 |

### `.env.development`

| 变量名 | 说明 |
| --- | --- |
| `VITE_API_BASE_URL` | 前端请求基地址，默认使用 `/api` |
| `VITE_API_PROXY_TARGET` | 本地开发代理目标地址，示例为 `http://localhost:8080` |

### `.env.production`

| 变量名 | 说明 |
| --- | --- |
| `VITE_API_BASE_URL` | 生产环境 API 地址 |
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth Client ID |

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | 先执行类型检查，再构建生产包 |
| `npm run build-only` | 仅执行 Vite 构建 |
| `npm run preview` | 本地预览构建结果 |
| `npm run type-check` | 执行 `vue-tsc --build` |
| `npm run lint` | 执行 ESLint 并自动修复 |
| `npm run format` | 使用 Prettier 格式化 `src/` 目录 |

## 目录结构

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
│  ├─ views/              # 页面级视图
│  ├─ App.vue
│  └─ main.ts
├─ .env
├─ .env.development
├─ .env.production
├─ vite.config.ts
└─ vercel.json
```

## 开发说明

- 首页 `/` 启用了 `requiresAuth` 路由守卫，未登录会自动跳转到 `/login`。
- 登录成功后，`token` 和 `userInfo` 会写入本地存储。
- 博客详情页支持从外部 Markdown 地址拉取内容，并通过 `/image-proxy` 处理图片访问。
- 当前仓库只包含前端项目，完整联调需要配套后端接口。

## 本地排查建议

- 打开页面后直接跳到 `/login` 是正常行为，因为首页需要鉴权。
- 如果博客页没有分类或热门标签，优先确认后端服务是否已在 `VITE_API_PROXY_TARGET` 对应地址启动。
- 如果只想验证纯前端页面，可优先访问 `/login`、`/search`、`/me`、`/happy`。
