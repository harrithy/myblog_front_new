<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="tour-container">
        <!-- 聚光灯遮罩层 -->
        <div class="spotlight-mask" :style="spotlightStyle"></div>

        <!-- 引导卡片 -->
        <div ref="cardRef" class="tour-card" :style="cardStyle" :class="currentPlacement">
          <div class="card-content">
            <div class="step-indicator">
              <span class="current">{{ displayStep + 1 }}</span>
              <span class="divider">/</span>
              <span class="total">{{ steps.length }}</span>
            </div>

            <h3 class="title">{{ displayStepData?.title }}</h3>
            <p class="description">{{ displayStepData?.description }}</p>

            <div class="footer">
              <button class="btn-skip" @click="onSkip">跳过</button>
              <div class="action-btns">
                <button v-if="displayStep > 0" class="btn-prev" @click="prevStep">上一步</button>
                <button class="btn-next" @click="nextStep">
                  {{ isDisplayLastStep ? '开启探索 ✨' : '下一步' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 装饰性元素 -->
          <div class="decoration-circle"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

export interface TourStep {
  target: string | HTMLElement // 选择器或元素
  title: string
  description: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

const props = defineProps<{
  visible: boolean
  steps: TourStep[]
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'finish'): void
  (e: 'skip'): void
}>()

const currentStep = ref(0)
const displayStep = ref(0) // 新增：用于控制显示内容的步骤，实现延迟更新
const targetRect = ref<DOMRect | null>(null)
const cardRef = ref<HTMLElement | null>(null)
const isReady = ref(false)
const isScrolling = ref(false) // 新增：防止重复点击

// 用于显示的步骤数据（文本内容）- 基于 displayStep
const displayStepData = computed(() => props.steps[displayStep.value])
const isDisplayLastStep = computed(() => displayStep.value === props.steps.length - 1)

// 用于定位的步骤数据（目标元素）- 基于 currentStep
const targetStepData = computed(() => props.steps[currentStep.value])

const isLastStep = computed(() => currentStep.value === props.steps.length - 1)
const currentPlacement = computed(() => displayStepData.value?.placement || 'bottom')

// 计算聚光灯样式（使用巨大的 box-shadow 模拟遮罩）
const spotlightStyle = computed(() => {
  if (!targetRect.value) return { opacity: 0 }

  const { top, left, width, height } = targetRect.value
  const padding = 10 // 留一点空隙

  return {
    top: `${top - padding}px`,
    left: `${left - padding}px`,
    width: `${width + padding * 2}px`,
    height: `${height + padding * 2}px`,
    borderRadius: '12px',
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)', // 半透明遮罩
    opacity: 1,
  }
})

// 计算卡片位置
const cardStyle = computed(() => {
  // 必须等到有目标位置且准备就绪才显示，否则会看到从左上角飞过来的动画
  if (!targetRect.value) {
    return {
      opacity: 0,
      visibility: 'hidden' as const,
      transition: 'none',
    }
  }

  const { top, left, width, height } = targetRect.value
  const padding = 20 // 卡片距离高亮区域的距离

  // 获取窗口尺寸
  const windowWidth = window.innerWidth
  // 假设卡片宽度是320px，加上一些padding安全距离
  const cardWidth = 320
  const safeMargin = 20

  let cardTop = 0
  let cardLeft = 0
  let transform = ''

  // 基础位置计算 - 这里应该使用 targetStepData 的 placement，因为位置是根据目标计算的
  // 但为了保持动画平滑，我们可以在 displayStep 更新时才切换 placement
  // 或者为了准确性，直接使用 targetStepData 的 placement
  const placement = targetStepData.value?.placement || 'bottom'

  switch (placement) {
    case 'bottom':
      cardTop = top + height + padding
      cardLeft = left + width / 2
      transform = 'translate(-50%, 0)'
      break
    case 'top':
      cardTop = top - padding
      cardLeft = left + width / 2
      transform = 'translate(-50%, -100%)'
      break
    // 其他方向可以继续补充
    default:
      cardTop = top + height + padding
      cardLeft = left + width / 2
      transform = 'translate(-50%, 0)'
  }

  // 边界检测与修正
  // 1. 检测右边界
  if (cardLeft + cardWidth / 2 > windowWidth - safeMargin) {
    const overflow = cardLeft + cardWidth / 2 - (windowWidth - safeMargin)
    cardLeft -= overflow
    const offsetX = -overflow
    transform = transform.replace('-50%', `calc(-50% + ${offsetX}px)`)
  }

  // 2. 检测左边界
  if (cardLeft - cardWidth / 2 < safeMargin) {
    const overflow = safeMargin - (cardLeft - cardWidth / 2)
    const offsetX = overflow
    transform = transform.replace('-50%', `calc(-50% + ${offsetX}px)`)
  }

  // 关键：如果还没 ready，禁用 transition
  const transition = isReady.value ? 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'

  return {
    top: `${cardTop}px`,
    left: `${cardLeft}px`,
    transform,
    transition,
    opacity: isReady.value ? 1 : 0,
    visibility: isReady.value ? ('visible' as const) : ('hidden' as const),
  }
})

const updatePosition = () => {
  if (isScrolling.value) return
  isScrolling.value = true

  const target = targetStepData.value?.target
  let el: HTMLElement | null = null

  if (typeof target === 'string') {
    el = document.querySelector(target)
  } else {
    el = target as HTMLElement
  }

  if (el) {
    // 滚动到视口可见
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // 等待滚动完成后获取位置
    setTimeout(() => {
      targetRect.value = el!.getBoundingClientRect()

      // 关键修改：位置计算完成后，同步更新显示的步骤内容
      displayStep.value = currentStep.value
      isScrolling.value = false

      // 首次定位完成后，下一帧显示卡片，避免闪烁
      if (!isReady.value) {
        requestAnimationFrame(() => {
          isReady.value = true
        })
      }
    }, 350) // 稍微增加一点延时，确保滚动更平滑
  } else {
    isScrolling.value = false
  }
}

const nextStep = () => {
  if (isScrolling.value) return // 防止重复点击

  if (isLastStep.value) {
    emit('finish')
    emit('update:visible', false)
  } else {
    currentStep.value++
  }
}

const prevStep = () => {
  if (isScrolling.value) return

  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const onSkip = () => {
  emit('skip')
  emit('update:visible', false)
}

watch(
  () => props.visible,
  (newVisible) => {
    if (newVisible) {
      // 重置状态
      isReady.value = false
      targetRect.value = null
      currentStep.value = 0
      displayStep.value = 0 // 重置显示步骤
      isScrolling.value = false

      nextTick(() => {
        updatePosition()
      })
    } else {
      isReady.value = false
    }
  },
)

watch(
  () => currentStep.value,
  () => {
    if (props.visible) {
      updatePosition()
    }
  },
)

// 监听窗口大小变化
const handleResize = () => {
  if (props.visible) {
    updatePosition()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleResize, true)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleResize, true)
})
</script>

<style scoped lang="scss">
.tour-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none; // 让遮罩层下的点击事件失效，但我们要控制遮罩层本身

  .spotlight-mask {
    position: absolute;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: auto; // 遮罩层阻挡点击
  }
}

.tour-card {
  position: absolute;
  width: 320px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 24px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.6) inset;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); // 弹性过渡
  pointer-events: auto;
  overflow: hidden;

  // 玻璃光泽装饰
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
    pointer-events: none;
    z-index: 0;
  }

  .card-content {
    position: relative;
    z-index: 1;
  }

  .step-indicator {
    font-size: 12px;
    color: #999;
    margin-bottom: 12px;
    font-family: 'Segoe UI', sans-serif;

    .current {
      font-size: 18px;
      font-weight: 700;
      color: #ff9a9e;
    }

    .divider {
      margin: 0 4px;
    }
  }

  .title {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin-bottom: 12px;
    letter-spacing: 0.5px;
  }

  .description {
    font-size: 15px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .btn-skip {
      background: none;
      border: none;
      color: #999;
      font-size: 14px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        color: #666;
        background: rgba(0, 0, 0, 0.05);
      }
    }

    .action-btns {
      display: flex;
      gap: 12px;

      .btn-prev {
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(0, 0, 0, 0.1);
        color: #666;
        padding: 8px 16px;
        border-radius: 12px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: #fff;
          transform: translateY(-1px);
        }
      }

      .btn-next {
        background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
        border: none;
        color: white;
        padding: 8px 20px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(255, 154, 158, 0.4);
        transition: all 0.3s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 154, 158, 0.5);
          background: linear-gradient(135deg, #ffb6c1 0%, #ffc3a0 100%);
        }

        &:active {
          transform: translateY(0);
        }
      }
    }
  }

  // 装饰圆点
  .decoration-circle {
    position: absolute;
    top: -20px;
    right: -20px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 154, 158, 0.2), rgba(250, 208, 196, 0.2));
    z-index: 0;
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
