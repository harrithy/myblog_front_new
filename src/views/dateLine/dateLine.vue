<template>
  <div class="chrono-console">
    <!-- 像素级网格背景与暗部虚化 -->
    <div class="cyber-grid"></div>
    <div class="nebula purple"></div>
    <div class="nebula cyan"></div>
    <div class="nebula orange"></div>

    <!-- 动态二次元背景水印 -->
    <div class="watermark-container">
      <Transition name="watermark-fade" mode="out-in">
        <img :key="activeWatermark" :src="activeWatermark" class="character-watermark" />
      </Transition>
    </div>

    <!-- 结束乐队 Live 音乐播放器页眉 -->
    <MusicConsoleHeader />

    <!-- 时间流主轴 -->
    <main class="stream-layout" ref="timelineMainRef">
      <!-- 单一轴线 -->
      <div class="conduit-channel">
        <div class="conduit-line" ref="lineRef"></div>
      </div>

      <!-- 事件流片段 -->
      <div class="stream-nodes">
        <TransitionGroup name="node-transition">
          <TimelineNode
            v-for="(item, index) in filteredItems"
            :key="item.id"
            :item="item"
            :index="index"
            :isActive="visibleIds.has(item.id)"
          />
        </TransitionGroup>

        <!-- 空数据缺省 -->
        <div v-if="filteredItems.length === 0" class="empty-terminal-state">
          <div class="scanner-line"></div>
          <span class="empty-txt">// WARN: NO_DATA_FOUND_IN_THIS_SECTOR</span>
        </div>
      </div>
    </main>

    <!-- 高科技悬浮按钮 -->
    <button
      class="cyber-top-btn"
      :class="{ visible: showScrollTop }"
      @click="scrollToTop"
      title="RESET_POSITION"
    >
      <div class="btn-lines"></div>
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          d="M5 15l7-7 7 7"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { gsap } from 'gsap'

import MusicConsoleHeader from './components/MusicConsoleHeader.vue'
import TimelineNode from './components/TimelineNode.vue'

import boqiImg from '@/assets/source/boqi.png'
import hongxiaImg from '@/assets/source/hongxia.png'
import liangImg from '@/assets/source/liang.png'
import xiduoImg from '@/assets/source/xiduo.png'

defineOptions({
  name: 'ChronoStreamView',
})

// 动态背景二次元角色水印
const activeCategory = ref('all')
const activeWatermark = computed(() => {
  switch (activeCategory.value) {
    case 'Coding':
      return boqiImg
    case 'Gaming':
      return hongxiaImg
    case 'Reading':
      return liangImg
    case 'Creative':
      return xiduoImg
    case 'Life':
      return hongxiaImg
    default:
      return boqiImg
  }
})

// 时间线接口
interface TimelineItem {
  id: number
  date: string
  title: string
  content: string
  category: string
  iconName: string
  themeColor: string
}

// 模拟的高端极客日志数据
const mockData = ref<TimelineItem[]>([
  {
    id: 8,
    date: '2026-07-01',
    title: '完成暗黑高科技时间线页面重构',
    content:
      '重构原有的普通时间线页面，设计为以 Obsidian & Cyberpunk 融合的深邃极地数据舱。利用 CSS 网格叠影、激光扫射特效、三维陀螺仪卡片倾斜 and GSAP 通道能量流，为时间流动赋予极高科幻审美与物理拟真质感。',
    category: 'Coding',
    iconName: 'code',
    themeColor: '#00ffff', // 蓝绿
  },
  {
    id: 7,
    date: '2026-06-25',
    title: '开发灵动导航与新手引导组件',
    content:
      '为搜索主页配置了自定义 3D 浮动卡片穿梭点。使用 HTML5 视口感知技术和 Vue 响应式状态编写了 TourGuide 组件，以非侵入式方式引导初入异世界的旅行者探寻魔法底蕴。',
    category: 'Coding',
    iconName: 'terminal',
    themeColor: '#bf55ec', // 霓虹紫
  },
  {
    id: 6,
    date: '2026-06-18',
    title: '宇宙尺度与猎手法则的沉思',
    content:
      '深夜研读《三体Ⅱ：黑暗森林》。大刘借罗辑之口，以冷酷且近乎数学般的精密美感，推导了宇宙社会学的核心框架。那一刻，文字中展现出的冰冷尺度与渺小微尘形成强烈的精神共振。',
    category: 'Reading',
    iconName: 'book',
    themeColor: '#ff7675', // 熔岩橙红
  },
  {
    id: 5,
    date: '2026-06-10',
    title: '幽影之地决战 // 肃清米凯拉神坛',
    content:
      '在交界地外围的黑暗阴影里游荡多日，终于在一场没有容错的拼刀中，击杀约束之神，完成了对黄金树底色悲剧的探索。感叹于从废墟美学到碎片化叙事的艺术集大成。',
    category: 'Gaming',
    iconName: 'gamepad',
    themeColor: '#f1c40f', // 质感金
  },
  {
    id: 4,
    date: '2026-05-30',
    title: '异世界传送门户构建上线',
    content:
      '基于 Vite 7 与 Vue 3 完成了前端站点的架构拼图。通过 Pinia 缓存用户核心秘钥，设计了 Alova 异步网络流 of 降级与防御策略，将项目稳定交付至云服务器。',
    category: 'Coding',
    iconName: 'shield',
    themeColor: '#2ecc71', // 翡翠绿
  },
  {
    id: 3,
    date: '2026-05-15',
    title: '手绘CG：深渊灯塔与孤独漂泊者',
    content:
      '利用 Wacom 数位板进行了暗色调氛围描摹。在一片冰冷压抑的蓝黑色深渊之上，绘制了一座由巨型水母骸骨构成的金色灯塔，摸索了厚涂色彩的对比张力。',
    category: 'Creative',
    iconName: 'brush',
    themeColor: '#ff79c6', // 赛博粉
  },
  {
    id: 2,
    date: '2026-04-22',
    title: '豚骨高汤精炖与灵魂叉烧肉',
    content:
      '以浓汤熬煮法，用猪骨与昆布慢熬数小时直到汤汁乳化。搭配特调秘制味增酱汁与精心烤制的五花卷肉。在静谧幽暗的深夜为自己呈上一碗治愈温度。',
    category: 'Life',
    iconName: 'coffee',
    themeColor: '#e67e22', // 琥珀黄
  },
  {
    id: 1,
    date: '2026-04-05',
    title: '旷野录音：春日阵雨与远山雷鸣',
    content:
      '携带麦克风进入旷野，捕捉暴雨前夕大地的静谧，以及雨滴敲打在灌木叶片上的细碎共鸣。在后期音频处理中，将其做为白噪音氛围轨道入库封存。',
    category: 'Life',
    iconName: 'mic',
    themeColor: '#1abc9c', // 松石绿
  },
])

// 状态
const timelineMainRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const showScrollTop = ref(false)
const visibleIds = ref<Set<number>>(new Set())

// 过滤列表
const filteredItems = computed(() => {
  if (activeCategory.value === 'all') {
    return mockData.value
  }
  return mockData.value.filter((item) => item.category === activeCategory.value)
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Intersection Observer 控制卡片淡入
let observer: IntersectionObserver | null = null

const initIntersectionObserver = () => {
  if (observer) {
    observer.disconnect()
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = Number(entry.target.getAttribute('data-id'))
          if (id) {
            visibleIds.value.add(id)
            observer?.unobserve(entry.target)
          }
        }
      })
    },
    {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.12,
    },
  )

  nextTick(() => {
    const items = document.querySelectorAll('.stream-node-wrapper')
    items.forEach((item) => {
      observer?.observe(item)
    })
  })
}

// 观测分类切换重新布局
watch(activeCategory, () => {
  visibleIds.value.clear()
  nextTick(() => {
    initIntersectionObserver()
    // 用 GSAP 重置过滤后的节点进入动画
    gsap.fromTo(
      '.stream-node-wrapper',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' },
    )
  })
})

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 400
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // 中轴能量线加载
  if (lineRef.value) {
    gsap.set(lineRef.value, { transformOrigin: 'bottom center' })
    gsap.fromTo(
      lineRef.value,
      { scaleY: 0 },
      { scaleY: 1, duration: 1.8, ease: 'power3.inOut' },
    )
  }

  nextTick(() => {
    initIntersectionObserver()
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style lang="scss" scoped>
.chrono-console {
  min-height: 100vh;
  width: 100%;
  background-color: #030305;
  color: #c8d3e6;
  padding: 100px 24px 120px 24px;
  box-sizing: border-box;
  font-family: 'JetBrains Mono', 'Fira Code', 'Outfit', sans-serif;
  position: relative;
  overflow-x: hidden;
}

// 赛博朋克像素格栅与二次元网点背景
.cyber-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image:
    radial-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 0),
    radial-gradient(circle, rgba(0, 0, 0, 0) 50%, #030305 100%),
    radial-gradient(rgba(255, 255, 255, 0.007) 1.5px, transparent 1.5px);
  background-size:
    24px 24px,
    100% 100%,
    8px 8px;
  z-index: 1;
}

// 二次元水印容器
.watermark-container {
  position: fixed;
  bottom: 0;
  right: 4%;
  width: 32%;
  height: 70vh;
  pointer-events: none;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  overflow: hidden;
  opacity: 0.1;
  mask-image: linear-gradient(to top, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%);
  -webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%);

  .character-watermark {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transform: translateY(20px);
    filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.05));
  }
}

// 水印淡入淡出动画
.watermark-fade-enter-active,
.watermark-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}
.watermark-fade-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.95);
  filter: blur(10px);
}
.watermark-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
  filter: blur(5px);
}

// 暗室彩色星云光圈
.nebula {
  position: fixed;
  border-radius: 50%;
  filter: blur(140px);
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
  mix-blend-mode: screen;

  &.purple {
    width: 600px;
    height: 600px;
    top: -100px;
    left: -150px;
    background: radial-gradient(circle, #bf55ec, transparent 70%);
  }

  &.cyan {
    width: 700px;
    height: 700px;
    bottom: -150px;
    right: -150px;
    background: radial-gradient(circle, #00ffff, transparent 70%);
  }

  &.orange {
    width: 500px;
    height: 500px;
    top: 35%;
    left: 30%;
    background: radial-gradient(circle, #ff79c6 10%, transparent 60%);
    opacity: 0.07;
  }
}

// 时间轴主流布局
.stream-layout {
  position: relative;
  z-index: 2;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 500px;

  // 极简单轨丝线轨道
  .conduit-channel {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    transform: translateX(-50%);
    pointer-events: none;

    .conduit-line {
      width: 1px;
      height: 100%;
      background: rgba(255, 255, 255, 0.08); // 1px 极细单线
    }
  }
}

.stream-nodes {
  display: flex;
  flex-direction: column;
  gap: 80px;
  position: relative;
}

// 空空状态
.empty-terminal-state {
  text-align: center;
  padding: 100px 20px;
  color: #4f5b70;
  font-size: 13px;
  letter-spacing: 2px;
  font-weight: 700;
  position: relative;
  overflow: hidden;

  .scanner-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #ff7675, transparent);
    animation: scanner 2.5s infinite linear;
  }
}

// 节点隐藏切换
.node-transition-enter-active,
.node-transition-leave-active {
  transition: all 0.5s ease;
}

.node-transition-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.98);
}

.node-transition-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.98);
}

// 悬浮置顶按钮
.cyber-top-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 46px;
  height: 46px;
  background: rgba(6, 8, 14, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  color: #8892b0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 98;
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);

  &.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .btn-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 4px;
      height: 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    &::before {
      top: -1px;
      left: -1px;
      border-right: none;
      border-bottom: none;
    }
    &::after {
      bottom: -1px;
      right: -1px;
      border-left: none;
      border-top: none;
    }
  }

  &:hover {
    color: #00ffff;
    border-color: rgba(0, 255, 255, 0.3);
    box-shadow: 0 0 16px rgba(0, 255, 255, 0.15);
    background: rgba(6, 8, 14, 0.8);
  }
}

// 窄屏适配中的主要结构覆盖
@media (max-width: 768px) {
  .chrono-console {
    padding: 80px 16px 80px 16px;
  }
  .stream-layout {
    .conduit-channel {
      left: 16px !important;
      transform: none !important;
    }
  }
}

@keyframes scanner {
  0% { transform: translateY(-100px); }
  100% { transform: translateY(200px); }
}
</style>
