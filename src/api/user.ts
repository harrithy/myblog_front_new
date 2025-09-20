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
  username: string
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
      meta: { skipAuth: true }
    })
  },

  // 注册接口 - 不需要token
  register: (userData: RegisterData) => {
    return http.post('/register', userData, {
      meta: { skipAuth: true }
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
}

export default userApi
