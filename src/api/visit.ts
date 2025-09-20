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
}

export default visitApi
