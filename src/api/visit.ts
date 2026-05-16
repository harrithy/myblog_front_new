import { http } from './alova'

export interface VisitData {
  visit_time?: string
  [key: string]: unknown
}

export interface VisitRecord {
  id?: number
  visit_time: string
  ip?: string
  user_agent?: string
  [key: string]: unknown
}

export interface VisitResponse {
  data: VisitRecord[]
  total?: number
  page?: number
  pageSize?: number
}

export interface OwnerVisitStat {
  id: number
  visit_date: string
  visit_count: number
  last_visit_time: string
  created_at: string | null
  [key: string]: unknown
}

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
  addVisit: (visitData?: VisitData) => {
    return http.post('/visits', visitData, {
      meta: { skipAuth: true },
    })
  },

  getVisits: (page: number, pageSize: number) => {
    return http.get('/visits', {
      params: {
        page,
        pagesize: pageSize,
      },
      meta: { skipAuth: true },
    })
  },

  getOwnerVisits: (days: number = 365) => {
    const limitedDays = Math.min(Math.max(1, days), 365)
    return http.get('/owner/visits', {
      params: { days: limitedDays },
      meta: { skipAuth: true },
    })
  },
}

export default visitApi
