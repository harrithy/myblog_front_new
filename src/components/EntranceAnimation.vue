<template>
  <div class="EntranceAnimation" ref="containerElement">
    <!-- 星空背景容器 -->
    <div class="stars-container" ref="starsContainer"></div>

    <!-- 名字文本 -->
    <div class="common" ref="textElement">{{ name }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { SplitText } from 'gsap/all'
gsap.registerPlugin(SplitText)

const name = ref('harrio')
const containerElement = ref<HTMLElement>()
const starsContainer = ref<HTMLElement>()
const textElement = ref<HTMLElement>()

let stars: HTMLElement[] = []
let animationTimeline: gsap.core.Timeline | null = null

// 创建星星
const createStars = (count: number = 200) => {
  if (!starsContainer.value) return

  // 清除现有星星
  starsContainer.value.innerHTML = ''
  stars = []

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div')
    star.className = 'star'

    // 随机位置和大小
    const size = Math.random() * 3 + 1
    const x = Math.random() * window.innerWidth
    const y = Math.random() * window.innerHeight

    star.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: #fff;
      border-radius: 50%;
      left: ${x}px;
      top: ${y}px;
      box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.8);
    `

    starsContainer.value.appendChild(star)
    stars.push(star)
  }
}

// 星空穿梭动画
const createStarTunnelEffect = () => {
  if (!stars.length) return

  stars.forEach((star) => {
    // 设置初始状态
    gsap.set(star, {
      scale: 0.1,
      opacity: 0.3,
    })

    // 创建穿梭效果
    gsap.to(star, {
      scale: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      duration: Math.random() * 2 + 1,
      ease: 'power2.out',
      delay: Math.random() * 0.5,
      repeat: -1,
      yoyo: true,
    })
  })
}

// 名字出现动画
const playNameAnimation = () => {
  if (!textElement.value) return

  // 使用 SplitText 将文字拆分为单个字符
  const splitText = new SplitText(textElement.value, { type: 'chars' })
  const chars = splitText.chars

  // 设置每个字符的初始状态
  gsap.set(chars, {
    opacity: 0,
    scale: 0,
    y: 100,
    rotation: 180,
  })

  // 创建闪闪发光的名字动画
  const tl = gsap.timeline()

  tl.to(chars, {
    opacity: 1,
    scale: 1.2,
    y: 0,
    rotation: 0,
    duration: 0.8,
    ease: 'back.out(2)',
    stagger: 0.1,
  })
    .to(
      chars,
      {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        stagger: 0.05,
      },
      '-=0.3',
    )
    .to(chars, {
      textShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 15px rgba(135, 206, 250, 0.5)',
      duration: 0.5,
      ease: 'power2.inOut',
      stagger: 0.1,
    })

  return tl
}

// 完整动画序列
const playFullAnimation = () => {
  // 停止之前的动画
  if (animationTimeline) {
    animationTimeline.kill()
  }

  // 创建新的时间轴
  animationTimeline = gsap.timeline()

  // 重新创建星星
  createStars()

  // 动画序列
  animationTimeline
    .add(() => createStarTunnelEffect()) // 开始星空穿梭
    .add(playNameAnimation() || new gsap.core.Timeline(), '+=1') // 1秒后名字出现
}

// 组件挂载时自动播放
onMounted(() => {
  setTimeout(() => {
    playFullAnimation()
  }, 500)
})

// 组件卸载时清理动画
onUnmounted(() => {
  if (animationTimeline) {
    animationTimeline.kill()
  }
  gsap.killTweensOf('*')
})
</script>

<style lang="scss" scoped>
.EntranceAnimation {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  overflow: hidden;

  .stars-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }

  .star {
    position: absolute;
    background: #fff;
    border-radius: 50%;
    animation: twinkle 2s infinite alternate;
  }

  @keyframes twinkle {
    0% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    100% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  .common {
    position: relative;
    z-index: 10;
    font-weight: 900;
    font-size: clamp(64px, 8vw, 128px);
    color: #ffffff;
    text-shadow:
      0 0 5px rgba(255, 255, 255, 0.5),
      0 0 10px rgba(135, 206, 250, 0.3);
    letter-spacing: 0.15em;
    text-align: center;
    font-family: 'Arial', 'Helvetica', sans-serif;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
</style>
