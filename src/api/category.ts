// 分类相关接口
import { http } from './alova'
import type { Category } from '@/types/Category'

// 创建分类请求数据
export interface CreateCategoryData {
  name: string
  description?: string
  parentId?: string | number
  [key: string]: unknown
}

// 更新分类请求数据
export interface UpdateCategoryData {
  name?: string
  description?: string
  parentId?: string | number
  [key: string]: unknown
}

export const categoryApi = {
  // 创建分类
  createCategory: (categoryData: CreateCategoryData) => {
    return http.post('/categories', categoryData)
  },

  // 获取分类列表（支持树形结构）, 同时支持模糊查询
  getCategories: (params?: { parent_id?: number | string; keyword?: string }) => {
    return http.get('/categories', { params, meta: { skipAuth: true } })
  },

  // 获取单个分类详情
  getCategoryById: (id: string | number) => {
    return http.get<Category>(`/categories/${id}`, { meta: { skipAuth: true } })
  },

  // 更新分类
  updateCategory: (id: string | number, categoryData: UpdateCategoryData) => {
    return http.put(`/categories/${id}`, categoryData)
  },

  // 删除分类（级联删除子分类）
  deleteCategory: (id: string | number) => {
    return http.delete(`/categories/${id}`)
  },

  // 获取热门标签
  getHotTags: () => {
    return http.get<Category[]>('/categories/hot-tags')
  },
}

export default categoryApi
