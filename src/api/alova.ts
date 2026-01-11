// 创建 alova 实例
import { createAlova } from 'alova'
// 指定请求适配器，这里使用全局 fetch 适配器，后面考虑使用axios的适配器 fetch目前不支持上传进度，如需上传进度请使用axios
import adapterFetch from 'alova/fetch'
// 使用 VueHook
import VueHook from 'alova/vue'
// 引入element-plus的message
import { ElMessage } from 'element-plus' // 或其他UI库
// GET、POST、PUT、DELETE、HEAD、OPTIONS、PATCH 7 种请求类型

// 类型定义
export interface RequestConfig {
  // 请求头
  headers?: Record<string, string>
  // 请求参数
  params?: Record<string, string | number | undefined>
  // 请求超时时间
  timeout?: number
  // 其他配置
  [key: string]: unknown
}

export interface RequestData {
  // 请求数据
  [key: string]: unknown
}

const alova = createAlova({
  // 基础URL - 从环境变量读取
  // 开发环境: /api (通过Vite代理转发)
  // 生产环境: http://harrio.xyz:8080/api (直接访问)
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // 请求超时时间,单位为毫秒,默认为0,永不超时,10000为10秒
  timeout: 10000,
  // 全局共享请求
  shareRequest: false,
  // 缓存模式
  // cacheFor: {
  //   // 设置缓存模式为内存模式
  //   mode: 'memory',
  //   // 单位为毫秒
  //   // 设置缓存时间为10分钟
  //   // 当设置为 'Infinity' 时，表示永不过期
  //   // 当设置为 0 时，表示不缓存
  //   expire: 60 * 10 * 1000,
  // },
  cacheFor: {
    // GET请求缓存10分钟
    GET: 60 * 10 * 1000,
    // POST请求缓存10分钟
    POST: 60 * 10 * 1000,
  },
  // 全局的请求拦截器 可以设置成异步函数
  beforeRequest(request) {
    // 检查meta数据，如果skipAuth为true，则跳过添加token
    if (!request.meta?.skipAuth) {
      // 在请求头中添加token
      // request.config.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      request.config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    }
  },
  // 全局的响应拦截器
  // 当你使用alova/fetch请求适配器时，由于window.fetch的特点，只有在连接超时或连接中断时才会触发onError拦截器，其他情况均会触发onSuccess拦截器
  responded: {
    // 请求成功的拦截器
    // 当使用 `alova/fetch` 请求适配器时, 第一个参数接收 Response 对象
    // 第二个参数为当前请求的 request 实例，可以同步请求前后的配置信息
    onSuccess: async (response) => {
      // 如果状态码大于等于400，表示请求失败
      if (response.status >= 400) {
        throw new Error(response.statusText)
      }
      // 将response转换为json
      const json = await response.json()
      // 如果json.code不等于200，表示请求失败
      if (json.code !== 200) {
        // 抛出错误或返回reject状态的Promise实例时,此请求将抛出错误
        throw new Error(json.msg)
      }
      // console.log(json)
      // 解析的响应数据将传给request实例的transform钩子函数
      return json.data
    },
    // 请求失败的拦截器
    // 请求错误时将会进入该拦截器
    // 第一个参数接收 Error 对象
    // 第二个参数为当前请求的 request 实例，可以同步请求前后的配置信息
    onError: (error) => {
      // console.error('Request failed:', error.msg)
      ElMessage.error(error.msg)
    },
    // 请求完成的拦截器
    // 当请求不论是成功还是失败还是命中缓存都需要执行的逻辑时，可以设置该拦截器,例如关闭loading
    // 接受当前请求的request实例
    onComplete: async () => {
      // 处理请求完成逻辑
    },
  },
  // 指定请求适配器
  requestAdapter: adapterFetch(),
  // 指定状态管理器
  statesHook: VueHook,
})

export default alova

// 封装的 HTTP 请求方法
export const http = {
  // GET 请求
  get: (url: string, config?: RequestConfig) => {
    return alova.Get(url, config)
  },

  // POST 请求
  post: (url: string, data?: RequestData, config?: RequestConfig) => {
    return alova.Post(url, data, config)
  },

  // PUT 请求
  put: (url: string, data?: RequestData, config?: RequestConfig) => {
    return alova.Put(url, data, config)
  },

  // DELETE 请求
  delete: (url: string, config?: RequestConfig) => {
    return alova.Delete(url, config)
  },

  // HEAD 请求
  head: (url: string, config?: RequestConfig) => {
    return alova.Head(url, config)
  },

  // OPTIONS 请求
  options: (url: string, config?: RequestConfig) => {
    return alova.Options(url, config)
  },

  // PATCH 请求
  patch: (url: string, data?: RequestData, config?: RequestConfig) => {
    return alova.Patch(url, data, config)
  },
}

// 简化的API调用函数
export const api = (path: string) => ({
  // GET 请求
  get: (config?: RequestConfig) => http.get(path, config),

  // POST 请求
  post: (data?: RequestData, config?: RequestConfig) => http.post(path, data, config),

  // PUT 请求
  put: (data?: RequestData, config?: RequestConfig) => http.put(path, data, config),

  // DELETE 请求
  delete: (config?: RequestConfig) => http.delete(path, config),

  // HEAD 请求
  head: (config?: RequestConfig) => http.head(path, config),

  // OPTIONS 请求
  options: (config?: RequestConfig) => http.options(path, config),

  // PATCH 请求
  patch: (data?: RequestData, config?: RequestConfig) => http.patch(path, data, config),
})
