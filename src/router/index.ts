import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useLoading } from '@/composables/useLoading'
import { getAuthRedirectTarget } from '@/composables/useAuthSession'

const hasLocalAuthSession = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return Boolean(window.localStorage.getItem('token') && window.localStorage.getItem('userInfo'))
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/HomeIndex.vue'),
    meta: {
      title: '首页',
      requiresAuth: true,
    },
  },
  {
    path: '/blog',
    name: 'blog',
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
      title: '登录注册',
      guestOnly: true,
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
      title: 'GitHub 登录中',
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  const { startLoading } = useLoading()
  startLoading()

  const title = to.meta.title as string | undefined
  if (title) {
    document.title = `${title}-harrio`
  }

  const authenticated = hasLocalAuthSession()

  if (to.meta.requiresAuth && !authenticated) {
    next({
      name: 'login',
      query: {
        redirect: getAuthRedirectTarget(to.fullPath),
      },
    })
    return
  }

  if (to.meta.guestOnly && authenticated) {
    next(getAuthRedirectTarget(to.query.redirect))
    return
  }

  next()
})

export default router
