// 博客相关接口
import { http } from './alova'

// 博客列表查询参数
export interface BlogListParams {
  page?: number
  limit?: number
  category?: string
  [key: string]: unknown
}

// 创建博客请求数据
export interface CreateBlogData {
  title: string
  content: string
  category?: string
  [key: string]: unknown
}

// 更新博客请求数据
export interface UpdateBlogData {
  title?: string
  content?: string
  category?: string
  [key: string]: unknown
}

// 博客搜索参数
export interface BlogSearchParams {
  keyword: string
  page?: number
  limit?: number
  [key: string]: unknown
}

export const blogApi = {
  // 获取博客列表
  getBlogList: (params?: BlogListParams) => {
    // 清理参数，移除undefined值
    const cleanedParams: Record<string, string | number> = {}
    if (params) {
      if (params.page !== undefined) cleanedParams.page = params.page
      if (params.limit !== undefined) cleanedParams.limit = params.limit
      if (params.category !== undefined) cleanedParams.category = params.category
    }
    return http.get('/blogs', { params: cleanedParams })
  },

  // 获取单个博客
  getBlog: (blogId: string) => {
    return http.get(`/blog/${blogId}`)
  },

  // 创建博客
  createBlog: (blogData: CreateBlogData) => {
    return http.post('/blog', blogData)
  },

  // 更新博客
  updateBlog: (blogId: string, blogData: UpdateBlogData) => {
    return http.put(`/blog/${blogId}`, blogData)
  },

  // 删除博客
  deleteBlog: (blogId: string) => {
    return http.delete(`/blog/${blogId}`)
  },
}

export default blogApi
