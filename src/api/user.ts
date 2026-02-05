// 用户相关接口
import { http } from './alova'

// 用户更新数据接口
export interface UserUpdateData {
  username?: string
  email?: string
  avatar?: string
  bio?: string
  [key: string]: unknown
}

// 登录请求数据接口
export interface LoginCredentials {
  account: string
  password: string
  [key: string]: unknown
}

// 注册请求数据接口
export interface RegisterData {
  username: string
  password: string
  email: string
  [key: string]: unknown
}

export const userApi = {
  // 登录接口 - 不需要token
  login: (credentials: LoginCredentials) => {
    return http.post('/login', credentials, {
      meta: { skipAuth: true },
    })
  },

  // 注册接口 - 不需要token
  register: (userData: RegisterData) => {
    return http.post('/register', userData, {
      meta: { skipAuth: true },
    })
  },

  // 获取用户信息
  getUserInfo: (userId: string) => {
    return http.get(`/user/${userId}`)
  },

  // 更新用户信息
  updateUser: (userId: string, userData: UserUpdateData) => {
    return http.put(`/user/${userId}`, userData)
  },

  // 注销用户
  deleteUser: (userId: string) => {
    return http.delete(`/user/${userId}`)
  },

  // GitHub 授权相关接口

  // 获取 GitHub 授权 URL
  getGithubAuthUrl: () => {
    return http.get('/auth/github', {
      meta: { skipAuth: true },
    })
  },

  // 用授权码换取 token（推荐）
  githubLogin: (code: string) => {
    return http.post(
      '/auth/github/login',
      { code },
      {
        meta: { skipAuth: true },
        cacheFor: 0, // 禁用缓存
      },
    )
  },

  // 回调处理（后端直接跳转用，一般前端不直接调用）
  githubCallback: (code: string) => {
    return http.get('/auth/github/callback', {
      params: { code },
      meta: { skipAuth: true },
    })
  },

  // 新增检测token是否过期

  checkToken: () => {
    return http.get('/auth/verify')
  },
}

export default userApi
