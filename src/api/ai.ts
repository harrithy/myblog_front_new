import { http } from './alova'

export interface AIChatMessage {
  role: string
  content: string
}

export interface AIChatRequest {
  message: string
  messages?: AIChatMessage[]
  [key: string]: unknown
}

export const aiApi = {
  // 获取 AI 生成内容
  getAIContent: (message: string, messages: AIChatMessage[] = []) => {
    const payload: AIChatRequest = messages.length > 0 ? { message, messages } : { message }
    return http.post('/ai/chat', payload, {
      meta: { skipAuth: true },
      cacheFor: 0,
    })
  },
}

export default aiApi
