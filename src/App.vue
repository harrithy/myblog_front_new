<template>
  <!-- 全局 Loading 动画 -->
  <div v-if="isLoading" class="loading-overlay">
    <LoadingAnimation />
  </div>
  <!-- 页面内容 -->
  <RouterView v-slot="{ Component }">
    <component :is="Component" @vue:mounted="onPageMounted" />
  </RouterView>
</template>

<script setup lang="ts">
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import { useLoading } from '@/composables/useLoading'

const { isLoading, stopLoading } = useLoading()

// 页面组件挂载完成后停止 loading
const onPageMounted = () => {
  // 添加一点延迟，确保页面渲染完成
  setTimeout(() => {
    stopLoading()
  }, 500)
}
</script>

<style lang="scss" scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  // 玻璃拟态背景
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>
