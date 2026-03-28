import { http } from './alova'

export const uploadApi = {
  uploadFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return http.post('/upload', formData)
  },

  getFiles: (params?: { page?: number; limit?: number }) => {
    const cleanedParams: Record<string, string | number> = {}
    if (params) {
      if (params.page !== undefined) cleanedParams.page = params.page
      if (params.limit !== undefined) cleanedParams.limit = params.limit
    }
    return http.get('/files', { params: cleanedParams })
  },

  deleteFile: (fileId: string) => {
    return http.delete(`/file/${fileId}`)
  },
}

export default uploadApi
