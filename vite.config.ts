import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  // 开发环境 mode = development loadEnv(mode, process.cwd()) 加载 .env.development
  // 生产环境 mode = production loadEnv(mode, process.cwd()) 加载 .env.production
  const env = loadEnv(mode, process.cwd())

  return {
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
          // 目标地址 - 从环境变量读取
          // 在 .env.development 中设置 VITE_API_PROXY_TARGET=http://localhost:8080
          // 在 .env.production 没有设置 VITE_API_PROXY_TARGET 为undefined
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:8080',
          // 是否改变源
          changeOrigin: true,
          // 重写路径
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        // 代理图片/文件服务器，解决CORS问题
        '/image-proxy': {
          target: 'https://image.harrio.xyz',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/image-proxy/, ''),
        },
      },
    },
  }
})
