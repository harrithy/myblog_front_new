import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'
import { ElMessage } from 'element-plus'

export interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, string | number | undefined>
  timeout?: number
  [key: string]: unknown
}

export interface RequestData {
  [key: string]: unknown
}

const alova = createAlova({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  shareRequest: false,
  cacheFor: {
    GET: 60 * 10 * 1000,
    POST: 60 * 10 * 1000,
  },
  beforeRequest(request) {
    if (!request.meta?.skipAuth) {
      request.config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    }
  },
  responded: {
    onSuccess: async (response) => {
      if (response.status >= 400) {
        throw new Error(response.statusText)
      }

      const json = await response.json()

      if (typeof json?.code !== 'number') {
        return json
      }

      if (![200, 201, 204].includes(json.code)) {
        throw new Error(json.msg || 'Request failed')
      }

      return json.data
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Request failed'
      ElMessage.error(message)
    },
    onComplete: async () => {},
  },
  requestAdapter: adapterFetch(),
  statesHook: VueHook,
})

export default alova

export const http = {
  get: <T = unknown>(url: string, config?: RequestConfig) => {
    return alova.Get<T>(url, config)
  },
  post: <T = unknown>(url: string, data?: RequestData, config?: RequestConfig) => {
    return alova.Post<T>(url, data, config)
  },
  put: <T = unknown>(url: string, data?: RequestData, config?: RequestConfig) => {
    return alova.Put<T>(url, data, config)
  },
  delete: <T = unknown>(url: string, config?: RequestConfig) => {
    return alova.Delete<T>(url, config)
  },
  head: <T = unknown>(url: string, config?: RequestConfig) => {
    return alova.Head<T>(url, config)
  },
  options: <T = unknown>(url: string, config?: RequestConfig) => {
    return alova.Options<T>(url, config)
  },
  patch: <T = unknown>(url: string, data?: RequestData, config?: RequestConfig) => {
    return alova.Patch<T>(url, data, config)
  },
}

export const api = (path: string) => ({
  get: (config?: RequestConfig) => http.get(path, config),
  post: (data?: RequestData, config?: RequestConfig) => http.post(path, data, config),
  put: (data?: RequestData, config?: RequestConfig) => http.put(path, data, config),
  delete: (config?: RequestConfig) => http.delete(path, config),
  head: (config?: RequestConfig) => http.head(path, config),
  options: (config?: RequestConfig) => http.options(path, config),
  patch: (data?: RequestData, config?: RequestConfig) => http.patch(path, data, config),
})
