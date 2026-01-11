// 评论相关接口
import { http } from './alova'

// 评论列表查询参数
export interface CommentListParams {
  article_id: number
  page?: number
  page_size?: number
  [key: string]: string | number | undefined
}

// 创建评论请求数据
export interface AddCommentData {
  article_id: number // 必填：文章ID
  parent_id?: number // 可选：父评论ID（回复时填写）
  nickname: string // 必填：昵称
  email?: string // 可选：邮箱
  avatar_url?: string // 可选：头像URL
  content: string // 必填：评论内容
  [key: string]: string | number | undefined
}

export const commentApi = {
  // 获取博客评论
  getComments: (params: CommentListParams) => {
    return http.get(`/comments`, { params, cacheFor: 0 })
  },

  // 添加评论
  addComment: (data: AddCommentData) => {
    return http.post(`/comments`, data)
  },
}

export default commentApi
