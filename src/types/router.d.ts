import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * @description 页面标题
     */
    title: string
  }
}
