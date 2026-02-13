/*
 * @Author: harrio@chijing.tech harrio@chijing.tech
 * @Date: 2025-10-17 18:13:51
 * @LastEditors: harrio@chijing.tech harrio@chijing.tech
 * @LastEditTime: 2025-12-03 17:31:11
 * @FilePath: \myblog_front_new\src\router\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useLoading } from '@/composables/useLoading'
// 为什么使用RouteRecordRaw
// 主要是为了TypeScript的类型安全和开发体验
// +
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    // () => import('../views/home/HomeIndex.vue') 这种写法是懒加载实现的标准方式
    // 懒加载的优点 是只有在需要的时候才会加载 有助于减少初始加载时间，提升应用的性能 在构建上，vite会自动进行代码分割，为每个懒加载的组件生成单独的chunk文件
    component: () => import('../views/home/HomeIndex.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    path: '/blog',
    name: 'blog',
    // component: () => import('../views/blog/BlogIndex.vue'),
    component: () => import('../views/blog/index.vue'),
    meta: {
      title: '博客',
    },
  },
  {
    path: '/bloglist',
    name: 'bloglist',
    component: () => import('../views/blog/BlogIndex.vue'),
    meta: {
      title: '博客列表',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/OwnerLogin.vue'),
    meta: {
      title: 'Owner Login',
    },
  },
  {
    path: '/ownerlogin',
    redirect: '/login',
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/searchpage/index.vue'),
    meta: {
      title: 'Search',
    },
  },
  {
    path: '/callback',
    name: 'githubCallback',
    component: () => import('../views/auth/GithubCallback.vue'),
    meta: {
      title: 'GitHub 登录中...',
    },
  },
  {
    path: '/me',
    name: 'me',
    component: () => import('../views/me/me.vue'),
    meta: {
      title: 'Me',
    },
  },
  {
    path: '/happy',
    name: 'happyNewYear',
    component: () => import('../views/activity/happy_new_year/index.vue'),
    meta: {
      title: 'Happy New Year',
    },
  },
]

const router = createRouter({
  // createWebHistory() 启用history模式 无哈希(#)
  // createWebHashHistory() 启用hash模式 有哈希(#)
  // import.meta.env.BASE_URL的含义
  // vite环境变量，表示应用部署的基础路径 当应用不是部署在域名的根路径时(比如部署在域名的子路径 https://example.com/my-app/)
  // [BASE_URL]会自动设置为 /my-app/,确保路由的正常工作
  // 在开发环境下通常为/,在生产构建时会根据配置自动设置
  // 在vite.config.ts中的defineConfig()中配置,与plugins同一级
  // // base: '/myblog/'
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  // 路由跳转时启动 loading
  const { startLoading } = useLoading()
  startLoading()

  const title = to.meta.title as string
  if (title) {
    document.title = title + '-harrio'
  }
  next()
})

export default router
