// 分类相关接口
import { http } from './alova'

// 创建分类请求数据
export interface CreateCategoryData {
  name: string
  description?: string
  [key: string]: unknown
}

// 更新分类请求数据
export interface UpdateCategoryData {
  name?: string
  description?: string
  [key: string]: unknown
}

export const categoryApi = {
  // 获取所有分类
  getCategories: () => {
    return http.get('/categories')
  },

  // 创建分类
  createCategory: (categoryData: CreateCategoryData) => {
    return http.post('/category', categoryData)
  },

  // 更新分类
  updateCategory: (categoryId: string, categoryData: UpdateCategoryData) => {
    return http.put(`/category/${categoryId}`, categoryData)
  },

  // 删除分类
  deleteCategory: (categoryId: string) => {
    return http.delete(`/category/${categoryId}`)
  },
}

export default categoryApi
