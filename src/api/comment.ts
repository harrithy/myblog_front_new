// 评论相关接口
import { http } from './alova'

// 评论列表查询参数
export interface CommentListParams {
  article_id: number
  page?: number
  page_size?: number
  [key: string]: string | number | undefined
}

// 评论数据结构
export interface Comment {
  id: number
  content: string
  author: string
  author_id?: number
  avatar?: string
  created_at: string
  updated_at?: string
  parent_id?: number
  article_id: number
  replies?: Comment[]
  reply_count?: number
}

// 评论列表响应
export interface CommentListResponse {
  data: Comment[]
  total: number
  page: number
  page_size: number
}

// 添加评论请求数据
export interface AddCommentData {
  article_id: number
  content: string
  parent_id?: number
  [key: string]: unknown
}

// 更新评论请求数据
export interface UpdateCommentData {
  id: number
  content: string
  [key: string]: unknown
}

export const commentApi = {
  // 获取博客评论
  getComments: (params: CommentListParams) => {
    return http.get(`/comments`, params)
  },

  // 添加评论
  addComment: (commentData: AddCommentData) => {
    return http.post(`/comments`, commentData)
  },

  // 更新评论
  updateComment: (commentData: UpdateCommentData) => {
    return http.put(`/comments/${commentData.id}`, commentData)
  },

  // 删除评论
  deleteComment: (commentId: number) => {
    return http.delete(`/comments/${commentId}`)
  },
}

export default commentApi
