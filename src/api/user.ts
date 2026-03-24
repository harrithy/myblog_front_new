import { http } from './alova'
import type { UserInfo } from '@/stores/user'

export interface UserUpdateData {
  username?: string
  email?: string
  avatar?: string
  bio?: string
  [key: string]: unknown
}

export interface LoginCredentials {
  account: string
  password: string
  email?: string
  [key: string]: unknown
}

export interface RegisterData {
  account: string
  email: string
  password: string
  nickname?: string
  name?: string
  birthday?: string
  [key: string]: unknown
}

export interface AuthResponse {
  token: string
  user: UserInfo
  is_owner?: boolean
}

export interface GithubAuthUrlResponse {
  url: string
}

export const userApi = {
  login: (credentials: LoginCredentials) =>
    http.post<AuthResponse>('/login', credentials, {
      meta: { skipAuth: true },
    }),

  register: (userData: RegisterData) =>
    http.post<AuthResponse>('/register', userData, {
      meta: { skipAuth: true },
    }),

  getUserInfo: (userId: string | number) => http.get<UserInfo>(`/user/${userId}`),

  updateUser: (userId: string | number, userData: UserUpdateData) =>
    http.put<UserInfo>(`/user/${userId}`, userData),

  deleteUser: (userId: string | number) => http.delete(`/user/${userId}`),

  getGithubAuthUrl: () =>
    http.get<GithubAuthUrlResponse>('/auth/github', {
      meta: { skipAuth: true },
    }),

  githubLogin: (code: string) =>
    http.post<AuthResponse>(
      '/auth/github/login',
      { code },
      {
        meta: { skipAuth: true },
        cacheFor: 0,
      },
    ),

  githubCallback: (code: string) =>
    http.get<AuthResponse>('/auth/github/callback', {
      params: { code },
      meta: { skipAuth: true },
    }),

  checkToken: () => http.get<UserInfo>('/auth/verify'),
}

export default userApi
