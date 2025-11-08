<template>
  <div class="typed-container">
    <span ref="typedElement" class="typed-text"></span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Typed from 'typed.js'
import personalIntroduction from '@/constants/personalIntroduction'

const typedElement = ref<HTMLElement | null>(null)
let typedInstance: Typed | null = null

// 定义多种颜色方案
const colors = [
  '#FF6B6B', // 珊瑚红
  '#4ECDC4', // 青绿色
  '#45B7D1', // 天蓝色
  '#FFA07A', // 浅橙色
  '#98D8C8', // 薄荷绿
  '#F7DC6F', // 柠檬黄
  '#BB8FCE', // 淡紫色
  '#85C1E2', // 浅蓝色
  '#F8B88B', // 桃色
  '#52B788', // 森林绿
  '#E63946', // 深红色
  '#457B9D', // 钢蓝色
  '#F4A261', // 橙黄色
  '#2A9D8F', // 青色
  '#E76F51', // 橙红色
  '#8E44AD', // 紫色
  '#3498DB', // 亮蓝色
  '#E74C3C', // 猩红色
  '#1ABC9C', // 绿松石色
  '#F39C12', // 橙色
]

onMounted(() => {
  if (typedElement.value) {
    const options = {
      strings: Object.values(personalIntroduction.Introduction),
      typeSpeed: 60, // 打字速度 (ms)
      backSpeed: 20, // 删除速度 (ms)
      backDelay: 2500, // 删除前等待 (ms)
      startDelay: 500, // 开始前等待 (ms)
      loop: true, // 循环播放
      showCursor: true, // 显示光标
      cursorChar: '_', // 光标样式
      shuffle: true, // 随机播放句子
      preStringTyped: (arrayPos: number) => {
        // 在每个句子开始打字前，改变文字颜色和光标颜色
        if (typedElement.value) {
          const colorIndex = arrayPos % colors.length
          const currentColor = colors[colorIndex]
          typedElement.value.style.color = currentColor

          // 同时改变光标颜色
          const cursor = typedElement.value.parentElement?.querySelector(
            '.typed-cursor',
          ) as HTMLElement
          if (cursor) {
            cursor.style.color = currentColor
          }
        }
      },
    }
    typedInstance = new Typed(typedElement.value, options)
  }
})

onUnmounted(() => {
  if (typedInstance) {
    typedInstance.destroy() // 组件卸载时销毁实例，防止内存泄漏
  }
})
</script>

<style lang="scss" scoped>
.typed-container {
  width: 100%;
  // height: 100%;
  display: flex;
  align-items: center;
  // justify-content: center;
  padding: 20px 20px 20px 0;
  box-sizing: border-box;
  text-align: center;
  // min-height: 80px; // 给打字区域一个最小高度

  .typed-text {
    font-size: 16px;
    color: #444;
    font-weight: 500;
    font-family:
      'Helvetica Neue', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft Yahei', sans-serif;
  }
}

// 修改光标闪烁动画
:deep(.typed-cursor) {
  opacity: 1;
  animation: typedjsBlink 0.7s infinite;
}

@keyframes typedjsBlink {
  50% {
    opacity: 0;
  }
}
</style>
