// 分类相关接口
import { http } from './alova'
import type { Category } from '@/types/Category'

type CategoryId = string | number

const CATEGORY_BASE_PATH = '/categories'
const PUBLIC_REQUEST_META = { skipAuth: true } as const

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

// 分类列表查询参数
export interface CategoryListParams {
  parent_id?: CategoryId
  keyword?: string
}

export const categoryApi = {
  // 创建分类
  createCategory: (categoryData: CreateCategoryData) => {
    return http.post<Category>(CATEGORY_BASE_PATH, categoryData)
  },

  // 获取分类列表：
  // 1. 默认返回 Category[]
  // 2. 支持通过泛型在调用处覆写返回类型，减少页面里的手动断言
  // 3. 该接口属于公开数据，显式跳过鉴权头注入
  getCategories: <T = Category[]>(params?: CategoryListParams) => {
    return http.get<T>(CATEGORY_BASE_PATH, { params, meta: PUBLIC_REQUEST_META })
  },

  // 获取单个分类或文章详情：
  // 默认按 Category 返回，但允许调用方通过泛型指定更精确的详情类型
  getCategoryById: <T = Category>(id: CategoryId) => {
    return http.get<T>(`${CATEGORY_BASE_PATH}/${id}`, { meta: PUBLIC_REQUEST_META })
  },

  // 更新分类
  updateCategory: (id: CategoryId, categoryData: UpdateCategoryData) => {
    return http.put<Category>(`${CATEGORY_BASE_PATH}/${id}`, categoryData)
  },

  // 删除分类（级联删除子分类）
  deleteCategory: (id: CategoryId) => {
    return http.delete<void>(`${CATEGORY_BASE_PATH}/${id}`)
  },

  // 获取热门标签
  getHotTags: () => {
    return http.get<Category[]>(`${CATEGORY_BASE_PATH}/hot-tags`, { meta: PUBLIC_REQUEST_META })
  },
}

export default categoryApi
