import { createAlova, type AlovaGenerics, type AlovaMethodCreateConfig, type RequestBody } from 'alova'
import adapterFetch from 'alova/fetch'
import type { FetchRequestInit } from 'alova/fetch'
import VueHook from 'alova/vue'
import { ElMessage } from 'element-plus'

// 请求元信息：
// 1. skipAuth: 当前请求是否跳过自动注入 token。
// 2. skipErrorMessage: 当前请求是否跳过全局错误提示，适合由页面自行接管提示文案的场景。
export interface RequestMeta {
  skipAuth?: boolean
  skipErrorMessage?: boolean
}

// 通过模块扩展给 alova 的 meta 增加项目级类型定义。
// 这样在各个 API 模块中写 meta: { skipAuth: true } 时会有完整的 TS 提示。
declare module 'alova' {
  interface AlovaCustomTypes {
    meta: RequestMeta
  }
}

// 默认错误文案：当后端没有返回明确提示时，使用统一兜底文案。
const DEFAULT_ERROR_MESSAGE = 'Request failed'
// 网络层错误的兜底文案：例如断网、超时、DNS 失败等。
const DEFAULT_NETWORK_ERROR_MESSAGE = 'Network request failed'
// 项目中约定的业务成功码集合。
// 如果后端返回的是统一包裹结构 { code, data, msg }，只有这些 code 会被视为成功。
const SUCCESS_RESPONSE_CODES = new Set([200, 201, 204])

// 为当前项目的 alova 实例提取一份统一泛型：
// - 请求配置来自 fetch 适配器的 FetchRequestInit
// - 原始响应类型是浏览器原生 Response
// - 响应头类型是浏览器原生 Headers
// 下面的 RequestConfig<T> 会基于它继续推导。
// 前两个泛型位分别对应 alova 内部的 Responded / Transformed 占位，
// 这里使用 unknown 作为更安全的默认值，避免触发 no-explicit-any。
type AppAlovaGenerics = AlovaGenerics<unknown, unknown, FetchRequestInit, Response, Headers>

// 统一响应包裹类型。
// 当前端接口命中这种结构时，会在全局拦截器中自动解包成 data 返回给业务层。
type ApiResponseEnvelope<T = unknown> = {
  code: number
  data: T
  msg?: string
}

// 判断返回值是否符合后端统一包裹格式。
// 这里只校验 code 字段是否存在且为 number，足够作为“是否需要统一解包”的分支依据。
function isApiResponseEnvelope(value: unknown): value is ApiResponseEnvelope {
  return typeof value === 'object' && value !== null && typeof (value as ApiResponseEnvelope).code === 'number'
}

// 尝试从后端响应体中提取最适合展示给用户的错误文案。
// 常见约定里 message / msg 都比较常见，所以这里兼容两种字段名。
function getMessageFromPayload(payload: unknown) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined
  }

  const { message, msg } = payload as { message?: unknown; msg?: unknown }
  if (typeof msg === 'string' && msg.trim()) {
    return msg
  }
  if (typeof message === 'string' && message.trim()) {
    return message
  }
  return undefined
}

// 将任意错误对象归一化成字符串文案：
// - Error 实例优先读取 error.message
// - 字符串错误直接返回
// - 其他未知错误统一回退到 fallback
function getErrorMessage(error: unknown, fallback = DEFAULT_ERROR_MESSAGE) {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }
  if (typeof error === 'string' && error.trim()) {
    return error
  }
  return fallback
}

// 全局错误提示统一出口。
// 某些页面如果希望自己接管错误提示，可以通过 meta.skipErrorMessage 关闭这里的 ElMessage。
function showErrorMessage(message: string, skipErrorMessage?: boolean) {
  if (!skipErrorMessage && message) {
    ElMessage.error(message)
  }
}

// 统一解析响应体：
// - 204 No Content 直接返回 undefined
// - 空响应体也返回 undefined
// - 优先尝试按 JSON 解析
// - 如果不是 JSON，则退回原始文本
// 这样可以避免直接 response.json() 在空响应场景下抛错。
async function parseResponseBody(response: Response) {
  if (response.status === 204) {
    return undefined
  }

  const text = await response.text()
  if (!text) {
    return undefined
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

// 创建全局 alova 实例，集中管理项目里所有请求的“共性”行为：
// - 基础地址
// - 超时配置
// - 请求共享
// - 缓存策略
// - 鉴权头注入
// - 响应解包与统一报错
const alova = createAlova({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  // 开启同一时刻的重复请求共享，避免短时间内多次发起相同请求。
  shareRequest: true,
  cacheFor: {
    // 仅全局缓存 GET 请求。
    // POST / PUT / PATCH / DELETE 这类写操作默认不缓存，避免造成“看起来成功了但其实没有重新请求”的问题。
    GET: 60 * 10 * 1000,
  },
  beforeRequest(method) {
    // 当前请求显式声明跳过鉴权时，直接放行。
    if (method.meta?.skipAuth) {
      return
    }

    // token 不存在或为空字符串时，不注入 Authorization，
    // 避免发出 "Bearer null" / "Bearer undefined" 这类无效请求头。
    const token = localStorage.getItem('token')?.trim()
    if (!token) {
      return
    }

    // alova 的 headers 可能尚未初始化，因此这里先兜底创建。
    method.config.headers ??= {}
    method.config.headers.Authorization = `Bearer ${token}`
  },
  responded: {
    onSuccess: async (response, method) => {
      // 先把响应体解析出来，后续无论是 HTTP 错误还是业务错误都可能需要从中提取 message。
      const payload = await parseResponseBody(response)

      // 处理 HTTP 层错误，例如 400 / 401 / 403 / 404 / 500。
      // alova 的全局 onError 只覆盖网络层失败，不覆盖服务端返回的非 2xx 状态码，
      // 所以 HTTP 状态码错误必须在 onSuccess 里自行判定。
      if (response.status >= 400) {
        const message =
          getMessageFromPayload(payload) || response.statusText || `Request failed with status ${response.status}`
        showErrorMessage(message, method.meta?.skipErrorMessage)
        throw new Error(message)
      }

      // 如果后端没有走统一包裹格式，就把解析后的原始结果直接交给业务层。
      // 这样可以兼容第三方接口、纯文本接口或尚未标准化的接口。
      if (!isApiResponseEnvelope(payload)) {
        return payload
      }

      // 命中了统一包裹格式，但 code 不在成功集合里，视为业务失败。
      // 典型场景：参数校验失败、登录失效、业务规则拦截等。
      if (!SUCCESS_RESPONSE_CODES.has(payload.code)) {
        const message = payload.msg || DEFAULT_ERROR_MESSAGE
        showErrorMessage(message, method.meta?.skipErrorMessage)
        throw new Error(message)
      }

      // 业务成功时统一解包，只把 data 暴露给调用方，
      // 这样业务代码里就不需要每次手动写 response.data。
      return payload.data
    },
    onError: (error, method) => {
      // 这里只兜底网络层异常：
      // 例如请求超时、断网、被浏览器中断、域名解析失败等。
      // 处理完提示后继续抛出，保证调用方依旧能在局部捕获错误。
      const message = getErrorMessage(error, DEFAULT_NETWORK_ERROR_MESSAGE)
      showErrorMessage(message, method.meta?.skipErrorMessage)
      throw (error instanceof Error ? error : new Error(message))
    },
  },
  requestAdapter: adapterFetch(),
  statesHook: VueHook,
})

// 对外导出配置类型：
// 直接基于 alova 官方泛型推导，而不是手写一个简化版接口，
// 这样可以完整保留 cacheFor、meta、shareRequest、timeout、params 等能力。
export type RequestConfig<T = unknown> = AlovaMethodCreateConfig<AppAlovaGenerics, T, unknown>
// 请求体类型与 alova 官方 RequestBody 保持一致，天然支持：
// JSON 对象、字符串、FormData、Blob、ArrayBuffer、URLSearchParams 等。
export type RequestData = RequestBody
type DeleteRequestData = RequestBody

// alova.Delete 的函数签名支持：
// 1. delete(url, data, config)
// 2. delete(url, undefined, config)
//
// 但业务上更常见的写法通常是 delete(url, config)。
// 这里封装一个兼容层，让我们既能保留常见写法，也能在确实需要时支持 DELETE 携带请求体。
function createDeleteMethod<T = unknown>(
  url: string,
  dataOrConfig?: DeleteRequestData | RequestConfig<T>,
  config?: RequestConfig<T>,
) {
  if (arguments.length >= 3) {
    return alova.Delete<T>(url, dataOrConfig as DeleteRequestData, config)
  }

  return alova.Delete<T>(url, undefined, dataOrConfig as RequestConfig<T> | undefined)
}

export default alova

// 常见 HTTP 方法封装：
// 统一从这里对外暴露，避免业务层直接依赖 alova 实例细节。
// 后续如果需要扩展 name、hitSource、埋点、traceId 等能力，也可以优先在这一层集中处理。
export const http = {
  get: <T = unknown>(url: string, config?: RequestConfig<T>) => {
    return alova.Get<T>(url, config)
  },
  post: <T = unknown>(url: string, data?: RequestData, config?: RequestConfig<T>) => {
    return alova.Post<T>(url, data, config)
  },
  put: <T = unknown>(url: string, data?: RequestData, config?: RequestConfig<T>) => {
    return alova.Put<T>(url, data, config)
  },
  delete: <T = unknown>(url: string, config?: RequestConfig<T>) => {
    return createDeleteMethod<T>(url, config)
  },
  deleteWithData: <T = unknown>(url: string, data?: DeleteRequestData, config?: RequestConfig<T>) => {
    return createDeleteMethod<T>(url, data, config)
  },
  head: <T = unknown>(url: string, config?: RequestConfig<T>) => {
    return alova.Head<T>(url, config)
  },
  options: <T = unknown>(url: string, config?: RequestConfig<T>) => {
    return alova.Options<T>(url, config)
  },
  patch: <T = unknown>(url: string, data?: RequestData, config?: RequestConfig<T>) => {
    return alova.Patch<T>(url, data, config)
  },
}

// 资源路径级封装：
// 适合在 API 模块中先绑定资源根路径，再按需调用不同 HTTP 方法。
// 例如：const user = api('/user'); user.get<UserInfo>()。
export const api = (path: string) => ({
  get: <T = unknown>(config?: RequestConfig<T>) => http.get<T>(path, config),
  post: <T = unknown>(data?: RequestData, config?: RequestConfig<T>) => http.post<T>(path, data, config),
  put: <T = unknown>(data?: RequestData, config?: RequestConfig<T>) => http.put<T>(path, data, config),
  delete: <T = unknown>(config?: RequestConfig<T>) => http.delete<T>(path, config),
  deleteWithData: <T = unknown>(data?: DeleteRequestData, config?: RequestConfig<T>) =>
    http.deleteWithData<T>(path, data, config),
  head: <T = unknown>(config?: RequestConfig<T>) => http.head<T>(path, config),
  options: <T = unknown>(config?: RequestConfig<T>) => http.options<T>(path, config),
  patch: <T = unknown>(data?: RequestData, config?: RequestConfig<T>) => http.patch<T>(path, data, config),
})
