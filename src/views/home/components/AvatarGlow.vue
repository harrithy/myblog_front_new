<template>
  <div class="avatar-frame">
    <svg class="glow-svg" viewBox="0 0 200 200">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: rgba(254, 240, 138, 0.8); stop-opacity: 1" />
          <stop offset="50%" style="stop-color: rgba(253, 230, 138, 0.7); stop-opacity: 1" />
          <stop offset="100%" style="stop-color: rgba(252, 211, 77, 0.6); stop-opacity: 1" />
        </linearGradient>
      </defs>
      <path
        ref="glowPath"
        class="glow-path"
        fill="none"
        stroke="url(#gradient1)"
        stroke-width="4"
        filter="url(#glow)"
        stroke-linecap="round"
      />
    </svg>
    <img :src="avatarSrc" alt="头像" class="avatar" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  avatarSrc: string
}

defineProps<Props>()

const glowPath = ref<SVGPathElement | null>(null)
let animationInterval: number | undefined

// 生成不规则光圈路径
const generateIrregularPath = () => {
  const centerX = 100
  const centerY = 100
  const baseRadius = 85
  const points = 60 // 路径点数
  const spikeChance = 0.15 // 尖刺出现概率
  const spikeIntensity = 15 // 尖刺强度

  let pathData = ''

  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2
    let radius = baseRadius

    // 随机添加尖刺
    if (Math.random() < spikeChance) {
      radius += Math.random() * spikeIntensity
    }

    // 添加一些随机波动
    radius += (Math.random() - 0.5) * 5

    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius

    if (i === 0) {
      pathData += `M ${x} ${y}`
    } else {
      pathData += ` L ${x} ${y}`
    }
  }

  pathData += ' Z'
  return pathData
}

// 动画更新光圈
const animateGlow = () => {
  if (!glowPath.value) return

  const updatePath = () => {
    if (glowPath.value) {
      glowPath.value.setAttribute('d', generateIrregularPath())
    }
  }

  updatePath()
  animationInterval = window.setInterval(updatePath, 150) // 每150ms更新一次
}

onMounted(() => {
  animateGlow()
})

onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval)
  }
})
</script>

<style lang="scss" scoped>
.avatar-frame {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  .glow-svg {
    position: absolute;
    width: 125%;
    height: 125%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 0;

    .glow-path {
      transition: d 0.1s ease-out;
    }
  }

  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    position: relative;
    z-index: 1;
    box-shadow: 0 0 30px rgba(254, 240, 138, 0.5), 0 0 60px rgba(253, 230, 138, 0.4),
      0 0 90px rgba(252, 211, 77, 0.3);
    animation: avatar-pulse 2s ease-in-out infinite;
  }

  @keyframes avatar-pulse {
    0%,
    100% {
      box-shadow: 0 0 30px rgba(254, 240, 138, 0.5), 0 0 60px rgba(253, 230, 138, 0.4),
        0 0 90px rgba(252, 211, 77, 0.3);
    }
    50% {
      box-shadow: 0 0 40px rgba(254, 240, 138, 0.7), 0 0 80px rgba(253, 230, 138, 0.6),
        0 0 120px rgba(252, 211, 77, 0.4);
    }
  }
}
</style>
