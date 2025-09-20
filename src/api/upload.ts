// 文件上传相关接口
import { http } from './alova'

export const uploadApi = {
  // 上传文件 - 使用 fetch 适配器，不支持进度跟踪
  uploadFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    // 使用类型断言处理 FormData 类型不匹配问题
    return http.post('/upload', formData as unknown as Record<string, unknown>, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 获取文件列表
  getFiles: (params?: { page?: number; limit?: number }) => {
    // 清理参数，移除undefined值
    const cleanedParams: Record<string, string | number> = {}
    if (params) {
      if (params.page !== undefined) cleanedParams.page = params.page
      if (params.limit !== undefined) cleanedParams.limit = params.limit
    }
    return http.get('/files', { params: cleanedParams })
  },

  // 删除文件
  deleteFile: (fileId: string) => {
    return http.delete(`/file/${fileId}`)
  },
}

export default uploadApi
