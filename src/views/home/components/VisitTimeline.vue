<template>
  <div class="visit-timeline" :class="{ 'is-loading': loading && visits.length === 0 }">
    <!-- 全局加载状态 -->
    <div v-if="loading && visits.length === 0" class="global-loading">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>

    <div v-else ref="timelineContentRef" class="timeline-content">
      <div v-if="visits.length > 0" class="timeline-list">
        <div
          v-for="(visit, index) in visits"
          :key="index"
          class="timeline-item"
          :style="{ '--item-index': index }"
        >
          <div class="timeline-dot" :class="`shape-${getShapeType(index)}`"></div>
          <div class="timeline-line" v-if="index < visits.length - 1"></div>
          <div class="timeline-card">
            <div class="timeline-time">{{ formatTime(visit.visit_time) }}</div>
            <div class="timeline-content-text">{{ visit.content }}</div>
          </div>
        </div>
        <!-- 加载完成提示 -->
        <div v-if="finished && !loading" class="finished-indicator">
          <span>没有更多了</span>
        </div>
        <!-- 加载更多状态 -->
        <div v-if="loading && visits.length > 0" class="loading-more-indicator">
          <div class="loading-spinner"></div>
          <span>加载中...</span>
        </div>
      </div>
      <div v-else class="no-data">
        <p>暂无访问记录</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import type { VisitRecord } from '@/api/visit'
import { visitApi } from '@/api/index'

interface Props {
  pageSize?: number
  autoLoad?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 10,
  autoLoad: true,
})

const timelineContentRef = ref<HTMLElement | null>(null)
const visits = ref<VisitRecord[]>([])
const loading = ref(false)
const finished = ref(false)
const page = ref(1)
const previousVisitsLength = ref(0)

// 获取访问记录
const getVisits = async () => {
  try {
    loading.value = true
    const res = await visitApi.getVisits(page.value, props.pageSize).send()
    console.log('res', res)

    // 处理 null 或空数组的情况
    if (!res || res === null) {
      finished.value = true
      loading.value = false
      return
    }

    const newVisits = res as VisitRecord[]

    // 如果返回空数组或 null，标记为已完成
    if (!Array.isArray(newVisits) || newVisits.length === 0) {
      finished.value = true
      loading.value = false
      return
    }

    // 等待 DOM 更新
    await nextTick()

    if (page.value === 1) {
      visits.value = newVisits
    } else {
      visits.value = [...visits.value, ...newVisits]
    }

    // 如果返回的数据少于 pageSize，说明没有更多数据了
    if (newVisits.length < props.pageSize) {
      finished.value = true
    }

    // 更新记录长度
    previousVisitsLength.value = visits.value.length

    // 延迟隐藏 loading，确保动画渲染完成（只在有新数据时延迟）
    await nextTick()
    setTimeout(() => {
      loading.value = false
    }, 1500)
  } catch (error) {
    console.error('获取访问记录失败:', error)
    finished.value = true
    loading.value = false
  }
}

// 加载更多
const handleLoadMore = async () => {
  if (loading.value || finished.value) return
  page.value++
  await getVisits()
}

// 手动设置滚动监听
const setupScrollListener = () => {
  const element = timelineContentRef.value
  if (!element) {
    console.warn('滚动容器未找到')
    return
  }

  const handleScroll = async () => {
    if (loading.value || finished.value) return

    const { scrollTop, scrollHeight, clientHeight } = element
    const distanceToBottom = scrollHeight - scrollTop - clientHeight

    console.log('滚动检测:', {
      scrollTop,
      scrollHeight,
      clientHeight,
      distanceToBottom,
      loading: loading.value,
      finished: finished.value,
    })

    // 如果距离底部小于 50px，触发加载
    if (distanceToBottom <= 50) {
      console.log('触发加载更多')
      await handleLoadMore()
    }
  }

  element.addEventListener('scroll', handleScroll)
  console.log('滚动监听已设置')

  // 返回清理函数
  return () => {
    element.removeEventListener('scroll', handleScroll)
  }
}

// 组件挂载时自动加载数据并初始化滚动监听
onMounted(async () => {
  if (props.autoLoad) {
    await getVisits()
  }

  // 等待 DOM 更新后再初始化滚动监听
  await nextTick()

  // 设置滚动监听
  const cleanup = setupScrollListener()

  // 组件卸载时清理
  if (cleanup) {
    onUnmounted(cleanup)
  }
})

// 暴露方法供父组件调用
defineExpose({
  refresh: () => {
    page.value = 1
    finished.value = false
    visits.value = []
    getVisits()
  },
  loadMore: handleLoadMore,
})

const formatTime = (time: string) => {
  // 格式化时间显示
  return time
}

// 获取形状类型：0-圆形, 1-菱形, 2-方形, 3-三角形
const getShapeType = (index: number) => {
  return index % 4
}
</script>

<style lang="scss" scoped>
.visit-timeline {
  flex: 1;
  overflow: auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  border-radius: 8px;
  margin-top: 20px;
  max-height: 400px;
  // padding: 10px;

  .timeline-header {
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(252, 211, 77, 0.3);
    padding-bottom: 8px;

    h3 {
      margin: 0;
      color: #333;
      font-size: 16px;
      text-align: center;
      font-weight: 600;
      text-shadow: 0 0 10px rgba(254, 240, 138, 0.3);
    }
  }

  .timeline-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 5px;

    // 隐藏滚动条但保持滚动功能
    scrollbar-width: none; // Firefox
    -ms-overflow-style: none; // IE and Edge

    &::-webkit-scrollbar {
      display: none; // Chrome, Safari, Opera
    }

    .timeline-list {
      position: relative;
      padding-left: 25px;

      .timeline-item {
        position: relative;
        padding-bottom: 15px;
        animation: item-fade-in 0.5s ease-out forwards;
        animation-delay: calc(var(--item-index) * 0.1s);
        opacity: 0;

        .timeline-dot {
          position: absolute;
          left: -22px;
          top: 4px;
          width: 12px;
          height: 12px;
          z-index: 2;
          transition: all 0.3s ease;

          // 圆形 - 金色
          &.shape-0 {
            border-radius: 50%;
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            box-shadow:
              0 0 8px rgba(255, 215, 0, 0.6),
              0 0 15px rgba(255, 237, 78, 0.4);
            animation: dot-pulse-0 2s ease-in-out infinite;
          }

          // 菱形 - 粉色
          &.shape-1 {
            transform: rotate(45deg);
            background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
            box-shadow:
              0 0 8px rgba(255, 105, 180, 0.6),
              0 0 15px rgba(255, 20, 147, 0.4);
            animation: dot-pulse-1 2s ease-in-out infinite;
          }

          // 方形 - 紫色
          &.shape-2 {
            border-radius: 2px;
            background: linear-gradient(135deg, #9370db 0%, #8a2be2 100%);
            box-shadow:
              0 0 8px rgba(147, 112, 219, 0.6),
              0 0 15px rgba(138, 43, 226, 0.4);
            animation: dot-pulse-2 2s ease-in-out infinite;
          }

          // 三角形 - 青色
          &.shape-3 {
            width: 0;
            height: 0;
            background: transparent;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 12px solid #00ced1;
            box-shadow: none;
            filter: drop-shadow(0 0 8px rgba(0, 206, 209, 0.6))
              drop-shadow(0 0 15px rgba(64, 224, 208, 0.4));
            animation: dot-pulse-3 2s ease-in-out infinite;
          }
        }

        .timeline-line {
          position: absolute;
          left: -16px;
          top: 16px;
          width: 1px;
          height: calc(100% - 12px);
          background-image: repeating-linear-gradient(
            to bottom,
            rgba(252, 211, 77, 0.6) 0px,
            rgba(252, 211, 77, 0.6) 4px,
            transparent 4px,
            transparent 8px
          );
          z-index: 1;
        }

        .timeline-card {
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(252, 211, 77, 0.2);
          border-radius: 6px;
          padding: 10px 12px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(5px);
          position: relative;
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            transition: left 0.5s ease;
          }

          &:hover {
            transform: translateX(5px) scale(1.02);
            box-shadow:
              0 0 20px rgba(254, 240, 138, 0.5),
              0 8px 16px rgba(0, 0, 0, 0.1);
            background: rgba(255, 255, 255, 0.7);
            border-color: rgba(252, 211, 77, 0.5);

            &::before {
              left: 100%;
            }
          }

          &:active {
            transform: translateX(3px) scale(0.98);
          }

          .timeline-time {
            font-size: 11px;
            color: #b8860b;
            font-weight: 600;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            text-shadow: 0 0 5px rgba(254, 240, 138, 0.3);

            // &::before {
            //   content: '⏰';
            //   margin-right: 4px;
            //   font-size: 12px;
            // }
          }

          .timeline-content-text {
            font-size: 12px;
            color: #555;
            line-height: 1.5;
            word-break: break-word;
          }
        }
      }
    }

    .loading-more-indicator,
    .finished-indicator {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 0 0 0;
      color: #999;
      font-size: 12px;
      gap: 8px;

      .loading-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(252, 211, 77, 0.3);
        border-top-color: rgba(252, 211, 77, 0.8);
        border-radius: 50%;
        animation: spinner-rotate 0.8s linear infinite;
      }
    }

    .finished-indicator {
      color: #bbb;
      font-style: italic;
    }
  }

  // 全局加载状态
  .global-loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    gap: 12px;
    color: #999;
    font-size: 14px;

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(252, 211, 77, 0.3);
      border-top-color: rgba(252, 211, 77, 0.8);
      border-radius: 50%;
      animation: spinner-rotate 0.8s linear infinite;
    }
  }

  &.is-loading {
    display: flex;
    justify-content: center;
    align-items: center;

    .no-data {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      color: #999;
      font-style: italic;

      p {
        margin: 0;
        font-size: 13px;
      }
    }
  }
}

@keyframes item-fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spinner-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 金色圆形脉动
@keyframes dot-pulse-0 {
  0%,
  100% {
    box-shadow:
      0 0 8px rgba(255, 215, 0, 0.6),
      0 0 15px rgba(255, 237, 78, 0.4);
    transform: scale(1);
  }
  50% {
    box-shadow:
      0 0 12px rgba(255, 215, 0, 0.8),
      0 0 20px rgba(255, 237, 78, 0.6),
      0 0 30px rgba(255, 215, 0, 0.4);
    transform: scale(1.1);
  }
}

// 粉色菱形脉动
@keyframes dot-pulse-1 {
  0%,
  100% {
    box-shadow:
      0 0 8px rgba(255, 105, 180, 0.6),
      0 0 15px rgba(255, 20, 147, 0.4);
  }
  50% {
    box-shadow:
      0 0 12px rgba(255, 105, 180, 0.8),
      0 0 20px rgba(255, 20, 147, 0.6),
      0 0 30px rgba(255, 105, 180, 0.4);
  }
}

// 紫色方形脉动
@keyframes dot-pulse-2 {
  0%,
  100% {
    box-shadow:
      0 0 8px rgba(147, 112, 219, 0.6),
      0 0 15px rgba(138, 43, 226, 0.4);
    transform: scale(1) rotate(0deg);
  }
  50% {
    box-shadow:
      0 0 12px rgba(147, 112, 219, 0.8),
      0 0 20px rgba(138, 43, 226, 0.6),
      0 0 30px rgba(147, 112, 219, 0.4);
    transform: scale(1.1) rotate(90deg);
  }
}

// 青色三角形脉动
@keyframes dot-pulse-3 {
  0%,
  100% {
    filter: drop-shadow(0 0 8px rgba(0, 206, 209, 0.6))
      drop-shadow(0 0 15px rgba(64, 224, 208, 0.4));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(0, 206, 209, 0.8))
      drop-shadow(0 0 20px rgba(64, 224, 208, 0.6)) drop-shadow(0 0 30px rgba(0, 206, 209, 0.4));
    transform: scale(1.15);
  }
}
</style>
