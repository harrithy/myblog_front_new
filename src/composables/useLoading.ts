import { ref } from 'vue'

// 全局 loading 状态
const isLoading = ref(false)

export function useLoading() {
  const startLoading = () => {
    isLoading.value = true
  }

  const stopLoading = () => {
    isLoading.value = false
  }

  return {
    isLoading,
    startLoading,
    stopLoading,
  }
}
