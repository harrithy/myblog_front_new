import { onMounted, onUnmounted, type Ref } from 'vue'

interface UseScrollToBottomOptions {
  /**
   * 距离底部多少像素时触发加载
   * @default 100
   */
  threshold?: number
  /**
   * 加载回调函数
   */
  onLoadMore: () => void | Promise<void>
  /**
   * 是否正在加载
   */
  loading?: Ref<boolean>
  /**
   * 是否已加载完所有数据
   */
  finished?: Ref<boolean>
}

/**
 * 滚动到底部加载更多的 composable
 * @param elementRef 滚动容器的 ref
 * @param options 配置选项
 */
export function useScrollToBottom(
  elementRef: Ref<HTMLElement | null>,
  options: UseScrollToBottomOptions,
) {
  const { threshold = 100, onLoadMore, loading, finished } = options

  const handleScroll = async () => {
    const element = elementRef.value
    if (!element) return

    // 如果正在加载或已加载完，不触发
    if (loading?.value || finished?.value) return

    const { scrollTop, scrollHeight, clientHeight } = element

    // 计算距离底部的距离
    const distanceToBottom = scrollHeight - scrollTop - clientHeight

    // 如果距离底部小于阈值，触发加载
    if (distanceToBottom <= threshold) {
      if (loading) {
        loading.value = true
      }

      try {
        await onLoadMore()
      } finally {
        if (loading) {
          loading.value = false
        }
      }
    }
  }

  onMounted(() => {
    const element = elementRef.value
    if (element) {
      element.addEventListener('scroll', handleScroll)
    }
  })

  onUnmounted(() => {
    const element = elementRef.value
    if (element) {
      element.removeEventListener('scroll', handleScroll)
    }
  })

  return {
    handleScroll,
  }
}
