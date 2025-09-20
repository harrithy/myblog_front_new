// 创建 alova 实例
import { createAlova } from 'alova'
// 指定请求适配器，这里使用全局 fetch 适配器，后面考虑使用axios的适配器 fetch目前不支持上传进度，如需上传进度请使用axios
import adapterFetch from 'alova/fetch'
// 使用 VueHook
import VueHook from 'alova/vue'
// GET、POST、PUT、DELETE、HEAD、OPTIONS、PATCH 7 种请求类型

const alova = createAlova({
  // 基础URL
  baseURL: 'http://localhost:3000',
  // 请求超时时间,单位为毫秒,默认为0,永不超时,30000为10秒
  timeout: 30000,
  // 全局共享请求
  shareRequest: false,
  // 缓存模式
  cacheFor: {
    // 设置缓存模式为内存模式
    mode: 'memory',
    // 单位为毫秒
    // 设置缓存时间为10分钟
    // 当设置为 'Infinity' 时，表示永不过期
    // 当设置为 0 时，表示不缓存
    expire: 60 * 10 * 1000,
  },
  // 全局的请求拦截器 可以设置成异步函数
  beforeRequest(request) {
    // 在请求头中添加token
    request.config.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
  },
  // 全局的响应拦截器
  // 当你使用alova/fetch请求适配器时，由于window.fetch的特点，只有在连接超时或连接中断时才会触发onError拦截器，其他情况均会触发onSuccess拦截器
  responded: {
    // 请求成功的拦截器
    // 当使用 `alova/fetch` 请求适配器时, 第一个参数接收 Response 对象
    // 第二个参数为当前请求的 request 实例，可以同步请求前后的配置信息
    onSuccess: async (response, request) => {
      // 如果状态码大于等于400，表示请求失败
      if (response.status >= 400) {
        throw new Error(response.statusText)
      }
      // 将response转换为json
      const json = await response.json()
      // 如果json.code不等于200，表示请求失败
      if (json.code !== 200) {
        // 抛出错误或返回reject状态的Promise实例时,此请求将抛出错误
        throw new Error(json.message)
      }
      // 解析的响应数据将传给request实例的transform钩子函数
      return json.data
    },
    // 请求失败的拦截器
    // 请求错误时将会进入该拦截器
    // 第一个参数接收 Error 对象
    // 第二个参数为当前请求的 request 实例，可以同步请求前后的配置信息
    onError: (error, request) => {
      alert(error.message)
    },
    // 请求完成的拦截器
    // 当请求不论是成功还是失败还是命中缓存都需要执行的逻辑时，可以设置该拦截器,例如关闭loading
    // 接受当前请求的request实例
    onComplete: async (request) => {
      // 处理请求完成逻辑
    },
  },
  // 指定请求适配器
  requestAdapter: adapterFetch(),
  // 指定状态管理器
  statesHook: VueHook,
})

export default alova
