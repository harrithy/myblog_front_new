// 博客相关接口
import { http } from './alova'

//  定义博客返回来的类型数据

export interface BlogDetail {
  id: number
  title: string
  url: string
  category: string
  description: string
  created_at: string
  updated_at: string
}

// 查询博客详情接口
export const blogApi = {
  getBlogDetail: (id: number) => {
    return http.get(`/blogs/${id}`, { meta: { skipAuth: true } })
  },
}

export default blogApi
