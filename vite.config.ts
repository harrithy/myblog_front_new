import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // base: '/myblog/', // 添加基础路径配置
  // 添加vue插件
  plugins: [vue(), vueDevTools()],
  // resolve:解析
  resolve: {
    // 别名
    alias: {
      // 源
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // server:服务器
  server: {
    // proxy:代理
    proxy: {
      // 代理路径
      '/api': {
        // 目标地址
        target: 'http://localhost:8080',
        // 是否改变源
        changeOrigin: true,
        // 重写路径
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
