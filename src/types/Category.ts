// 分类的类型定义
export interface Category {
  created_at: string
  id: number
  name: string
  type: string
  sort_order: number
  updated_at: string
  url?: string // 文章类型时的Markdown文件URL
  description?: string // 文章描述
  img_url?: string // 封面图片URL
  tags?: string[] // 标签列表
  children?: Category[]
}
