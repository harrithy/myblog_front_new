# myblog_front_new

一个基于 `Vue 3 + TypeScript + Vite` 的个人博客前端项目，包含登录鉴权、博客浏览、评论、搜索、个人主页和节日活动页等模块。

## 项目概览

- `Vue 3` + `Pinia` + `Vue Router 4`
- `TypeScript` + `SCSS`
- `Vite 7`
- `Element Plus`
- `Tailwind CSS 4`
- `alova` 请求层封装
- `GSAP` 页面动效
- `markdown-it` Markdown 渲染
- `typed.js` 打字机效果
- `vite-plugin-svg-icons` SVG 图标注册

## 当前功能

- 登录 / 注册页
  - 支持账号密码登录
  - 支持 GitHub OAuth 登录
  - 支持登录态本地持久化
  - 登录页支持多语言文案切换
- 首页
  - 视频背景、头像发光、打字机文案
  - GSAP 路径动画
  - 访客记录展示与上报
- 博客模块
  - 文章列表 / 分类查询
  - 文章详情页 Markdown 渲染
  - 评论列表与评论提交
  - 阅读进度条、分享按钮
- 搜索页
  - 搜索入口
  - 导航菜单
  - 新手引导弹层
- 个人页
  - 个人介绍、经历、项目展示
- 活动页
  - 新年祝福活动页面

## 技术实现说明

### 路由

项目当前主要页面如下：

- `/`：首页，当前配置为需要登录后访问
- `/blog`：博客详情页
- `/bloglist`：博客列表页
- `/login`：登录 / 注册页
- `/callback`：GitHub OAuth 回调页
- `/search`：搜索页
- `/me`：个人主页
- `/happy`：新年活动页

### 请求层

项目使用 [`src/api/alova.ts`](./src/api/alova.ts) 统一管理请求行为，包含：

- 统一 `baseURL`
- 开发环境 `/api` 代理
- 自动注入 `Authorization: Bearer <token>`
- GET 请求缓存和重复请求共享
- 统一业务响应解包
- 统一错误提示

### 部署

- 本地开发环境通过 Vite 代理将 `/api` 请求转发到后端服务
- 生产环境通过 `.env.production` 直接请求线上 API
- `vercel.json` 已处理 SPA 路由回退和图片代理转发

## 环境要求

- `Node.js`：`^20.19.0 || >=22.12.0`
- 建议使用 `npm`

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
| `VITE_API_PROXY_TARGET` | 本地开发代理目标地址，当前示例为 `http://localhost:8080` |

### `.env.production`

| 变量名 | 说明 |
| --- | --- |
| `VITE_API_BASE_URL` | 生产环境 API 地址 |
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth Client ID |

## 安装与运行

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```

默认会自动打开浏览器。开发时请确保后端服务可被 `VITE_API_PROXY_TARGET` 访问。

### 构建生产包

```bash
npm run build
```

### 本地预览生产包

```bash
npm run preview
```

## 可用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | 先执行类型检查，再构建生产包 |
| `npm run build-only` | 仅执行 Vite 构建 |
| `npm run preview` | 本地预览构建产物 |
| `npm run type-check` | 执行 `vue-tsc --build` |
| `npm run lint` | 执行 ESLint 并自动修复 |
| `npm run format` | 使用 Prettier 格式化 `src/` 目录 |

## 目录结构

```text
myblog_front_new/
├─ public/
├─ src/
│  ├─ api/                # 接口与 alova 请求封装
│  ├─ assets/             # 全局样式、图标、图片、视频、音频
│  ├─ components/         # 通用组件
│  ├─ composables/        # 复用逻辑
│  ├─ constants/          # 常量文案
│  ├─ router/             # 路由配置
│  ├─ stores/             # Pinia 状态管理
│  ├─ utils/              # 工具函数
│  ├─ views/
│  │  ├─ auth/            # OAuth 回调
│  │  ├─ blog/            # 博客详情 / 列表
│  │  ├─ home/            # 首页
│  │  ├─ login/           # 登录注册
│  │  ├─ me/              # 个人主页
│  │  ├─ searchpage/      # 搜索页
│  │  └─ activity/        # 活动页
│  ├─ App.vue
│  └─ main.ts
├─ .env
├─ .env.development
├─ .env.production
├─ vite.config.ts
└─ vercel.json
```

## 开发说明

- 首页路由 `/` 当前启用了 `requiresAuth`，未登录用户会被重定向到 `/login`
- 登录成功后，`token` 和 `userInfo` 会写入本地存储
- 博客详情页支持从外部 Markdown 地址拉取内容，并通过 `/image-proxy` 解决图片跨域访问问题
- 当前仓库只包含前端项目，运行完整功能时需要配套后端接口

## 后续可补充

- 项目截图或页面预览
- 后端接口文档地址
- 部署地址
- 测试方案说明
