import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'
import { ElMessage } from 'element-plus'

// 通用请求配置：扩展 alova 原始配置，方便按接口传入请求头、查询参数等。
export interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, string | number | undefined>
  timeout?: number
  [key: string]: unknown
}

// 通用请求体类型：用于 POST、PUT、PATCH 等需要提交数据的场景。
export interface RequestData {
  [key: string]: unknown
}

// 创建全局 alova 实例，统一处理基础地址、鉴权、缓存和响应格式。
const alova = createAlova({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  shareRequest: false,
  cacheFor: {
    // GET / POST 默认缓存 10 分钟，降低重复请求带来的开销。
    GET: 60 * 10 * 1000,
    POST: 60 * 10 * 1000,
  },
  beforeRequest(request) {
    // 默认自动携带 token，部分无需登录的接口可通过 meta.skipAuth 跳过。
    if (!request.meta?.skipAuth) {
      request.config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    }
  },
  responded: {
    onSuccess: async (response) => {
      // 先处理 HTTP 层面的异常状态码。
      if (response.status >= 400) {
        throw new Error(response.statusText)
      }

      const json = await response.json()

      // 兼容非统一响应格式，若没有 code 字段则直接返回原始数据。
      if (typeof json?.code !== 'number') {
        return json
      }

      // 约定业务成功状态码为 200 / 201 / 204，其余视为业务失败。
      if (![200, 201, 204].includes(json.code)) {
        throw new Error(json.msg || 'Request failed')
      }

      // 统一将后端包装后的 data 解包，业务侧可直接拿到结果。
      return json.data
    },
    onError: (error) => {
      // 所有请求错误统一弹出提示，避免每个调用处重复处理。
      const message = error instanceof Error ? error.message : 'Request failed'
      ElMessage.error(message)
    },
    onComplete: async () => {},
  },
  requestAdapter: adapterFetch(),
  statesHook: VueHook,
})

export default alova

// 对常见 HTTP 方法做一层语义化封装，统一外部调用方式。
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

// 根据路径生成接口对象，适合按资源维度组织 API 模块。
export const api = (path: string) => ({
  get: (config?: RequestConfig) => http.get(path, config),
  post: (data?: RequestData, config?: RequestConfig) => http.post(path, data, config),
  put: (data?: RequestData, config?: RequestConfig) => http.put(path, data, config),
  delete: (config?: RequestConfig) => http.delete(path, config),
  head: (config?: RequestConfig) => http.head(path, config),
  options: (config?: RequestConfig) => http.options(path, config),
  patch: (data?: RequestData, config?: RequestConfig) => http.patch(path, data, config),
})
