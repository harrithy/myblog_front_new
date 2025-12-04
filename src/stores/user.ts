// 用户状态管理
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  id: number
  account: string
  name: string
  nickname: string
  avatar_url: string
  github_id?: number
  github_url?: string
  birthday?: string
  email?: string
  bio?: string
}

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<UserInfo | null>(null)
  // token
  const token = ref<string>(localStorage.getItem('token') || '')

  // 是否已登录
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  // 设置用户信息
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
  }

  // 设置 token
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 登出
  const logout = () => {
    userInfo.value = null
    token.value = ''
    localStorage.removeItem('token')
  }

  // 从 localStorage 恢复用户信息
  const restoreUserInfo = () => {
    const savedUserInfo = localStorage.getItem('userInfo')
    if (savedUserInfo) {
      try {
        const parsed = JSON.parse(savedUserInfo)
        // 兼容处理：如果数据被多包了一层 user
        userInfo.value = parsed.user ? parsed.user : parsed
      } catch {
        userInfo.value = null
      }
    }
  }

  // 保存用户信息到 localStorage
  const saveUserInfo = () => {
    if (userInfo.value) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    }
  }

  return {
    userInfo,
    token,
    isLoggedIn,
    setUserInfo,
    setToken,
    logout,
    restoreUserInfo,
    saveUserInfo,
  }
})
