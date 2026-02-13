import { http } from './alova'

export interface AIChatRequest {
  message: string
  [key: string]: unknown
}

export const aiApi = {
  // 获取 AI 生成内容
  getAIContent: (message: string) => {
    const payload: AIChatRequest = { message }
    return http.post('/ai/chat', payload, {
      meta: { skipAuth: true },
      cacheFor: 0,
    })
  },
}

export default aiApi
