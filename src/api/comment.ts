import { http } from './alova'

export interface CommentListParams {
  article_id: number
  page?: number
  page_size?: number
  [key: string]: string | number | undefined
}

export interface AddCommentData {
  article_id: number
  parent_id?: number
  nickname: string
  email?: string
  avatar_url?: string
  content: string
  [key: string]: string | number | undefined
}

export const commentApi = {
  getComments: (params: CommentListParams) => {
    return http.get('/comments', {
      params,
      cacheFor: 0,
      meta: { skipAuth: true },
    })
  },

  addComment: (data: AddCommentData) => {
    return http.post('/comments', data, {
      meta: { skipAuth: true },
    })
  },
}

export default commentApi
