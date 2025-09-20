// 评论相关接口
import { http } from './alova'

// 评论列表查询参数
export interface CommentListParams {
  page?: number
  limit?: number
  [key: string]: string | number | undefined
}

// 添加评论请求数据
export interface AddCommentData {
  content: string
  parentId?: string
  [key: string]: unknown
}

// 更新评论请求数据
export interface UpdateCommentData {
  content: string
  [key: string]: unknown
}

export const commentApi = {
  // 获取博客评论
  getComments: (blogId: string, params?: CommentListParams) => {
    // 清理参数，移除undefined值
    const cleanedParams: Record<string, string | number> = {}
    if (params) {
      if (params.page !== undefined) cleanedParams.page = params.page
      if (params.limit !== undefined) cleanedParams.limit = params.limit
    }
    return http.get(`/blog/${blogId}/comments`, { params: cleanedParams })
  },

  // 添加评论
  addComment: (blogId: string, commentData: AddCommentData) => {
    return http.post(`/blog/${blogId}/comment`, commentData)
  },

  // 更新评论
  updateComment: (commentId: string, commentData: UpdateCommentData) => {
    return http.put(`/comment/${commentId}`, commentData)
  },

  // 删除评论
  deleteComment: (commentId: string) => {
    return http.delete(`/comment/${commentId}`)
  },
}

export default commentApi
