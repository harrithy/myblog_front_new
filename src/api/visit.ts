import { http } from './alova'

// 访客数据接口
export interface VisitData {
  visit_time?: string
  [key: string]: unknown
}

// 访客记录接口（API返回的数据结构）
export interface VisitRecord {
  id?: number
  visit_time: string
  ip?: string
  user_agent?: string
  [key: string]: unknown
}

// API响应数据接口
export interface VisitResponse {
  data: VisitRecord[]
  total?: number
  page?: number
  pageSize?: number
}

// 博客主人访问统计单条记录
export interface OwnerVisitStat {
  id: number
  visit_date: string // 格式: YYYY-MM-DD (例如: "2025-11-08")
  visit_count: number
  last_visit_time: string // 格式: YYYY-MM-DD HH:mm:ss
  created_at: string | null
  [key: string]: unknown
}

// 博客主人访问统计响应
export interface OwnerVisitStatsResponse {
  code: number
  data: {
    days: string
    total_visits: number
    visit_stats: OwnerVisitStat[]
  }
  msg: string
}

export const visitApi = {
  // 添加访客记录
  addVisit: (visitData?: VisitData) => {
    return http.post('/visits', visitData, {
      meta: { skipAuth: true },
    })
  },
  // 获取访客记录
  getVisits: (page: number, pageSize: number) => {
    return http.get(`/visits?page=${page}&pageSize=${pageSize}`, {
      meta: { skipAuth: true },
    })
  },
  // 获取博客主人访问统计
  getOwnerVisits: (days: number = 365) => {
    // 限制最大天数为365
    const limitedDays = Math.min(Math.max(1, days), 365)
    return http.get(`/owner/visits?days=${limitedDays}`, {
      meta: { skipAuth: true },
    })
  },
}

export default visitApi
