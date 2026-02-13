import { http } from './alova'

export interface AIChatRequest {
  message: string
  [key: string]: unknown
}

export const aiApi = {
  // 获取 AI 生成内容
  getAIContent: (message: string, extraPayload: Record<string, unknown> = {}) => {
    const payload: AIChatRequest = { message, ...extraPayload }
    return http.post('/ai/chat', payload, {
      meta: { skipAuth: true },
      cacheFor: 0,
    })
  },
}

export default aiApi
