<template>
  <div>
    <!-- 顶部极简太空返回栏 -->
    <div class="system-bar">
      <button class="back-terminal-btn" @click="goHome">
        <span class="btn-bracket">[</span>
        <span class="btn-text">
          <svg
            class="w-4 h-4 inline-block mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          RETURN_TO_HOME
        </span>
        <span class="btn-bracket">]</span>
      </button>

      <!-- 粘性迷你音乐播放器 (渐进式出现) -->
      <div
        class="sticky-mini-player"
        :style="{
          opacity: miniPlayerOpacity,
          transform: miniPlayerTransform,
          pointerEvents: miniPlayerOpacity > 0.3 ? 'auto' : 'none'
        }"
      >
        <!-- 迷你旋转胶片 -->
        <div class="mini-album">
          <img :src="avatarImage" alt="Vinyl" class="mini-vinyl" />
        </div>
        <!-- 歌曲信息 -->
        <div class="mini-info">
          <span class="mini-title">ギター与孤独与蓝色星球</span>
          <span class="mini-artist">GOTOH HITORI (结束乐队)</span>
        </div>
        <!-- 仿真迷你频谱 -->
        <div class="mini-visualizer">
          <div class="mini-bar" v-for="i in 5" :key="i" :style="{ animationDelay: `${i * 0.15}s` }"></div>
        </div>
      </div>

      <div class="sys-time-monitor">
        <span class="label">SECURE_LINK // ACTIVE</span>
        <span class="separator">|</span>
        <span class="time">{{ liveTime }}</span>
      </div>
    </div>

    <!-- 结束乐队 Live 播放器页眉 -->
    <header class="console-header" ref="headerRef">
      <!-- 播放器卡片 -->
      <div class="music-console-header">
        <div class="player-main">
          <!-- 旋转胶片 -->
          <div class="album-art-wrap">
            <div class="vinyl-record">
              <img :src="avatarImage" alt="Vinyl" class="vinyl-img" />
            </div>
            <div class="record-center"></div>
          </div>

          <!-- 歌曲与艺术家信息 -->
          <div class="track-details">
            <div class="track-status">
              <span class="status-dot green"></span>
              <span class="status-text">NOW_PLAYING // LIVE_STAGE</span>
            </div>
            <h1 class="track-title">ギター与孤独与蓝色星球</h1>
            <div class="track-meta">
              <span class="artist">GOTOH HITORI (结束乐队)</span>
              <span class="divider">//</span>
              <span class="album">CHRONO_TRACKS_V4.5</span>
            </div>
          </div>

          <!-- 仿真跳动频谱 -->
          <div class="audio-visualizer">
            <div class="bar" v-for="i in 8" :key="i" :style="{ animationDelay: `${i * 0.15}s` }"></div>
          </div>
        </div>

        <!-- 播放进度条 / 滚动进度 -->
        <div class="player-progress-bar">
          <div class="progress-fill" :style="{ width: scrollProgress + '%' }"></div>
          <div class="progress-time">
            <span>00:00</span>
            <span>03:45</span>
          </div>
        </div>
      </div>

      <!-- 后藤独的壁橱碎碎念 -->
      <div class="bocchi-talk-panel">
        <div class="avatar-wrap">
          <img :src="avatarImage" alt="Bocchi" class="bocchi-avatar" />
          <span class="bocchi-name">GOTOH HITORI</span>
        </div>
        <div class="speech-bubble">
          <div class="bubble-arrow"></div>
          <Transition name="text-fade" mode="out-in">
            <p :key="currentThoughtIndex" class="bubble-content">
              {{ thoughts[currentThoughtIndex] }}
            </p>
          </Transition>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import avatarImg from '@/assets/source/avatar.gif'

const router = useRouter()
const avatarImage = avatarImg

// 后藤独的壁橱碎碎念文本
const thoughts = [
  '（碎碎念）啊啊啊……今天的代码如果写得不好，会不会被服务器抛弃啊……好可怕……',
  '（慌乱）要是能一辈子待在暗黑壁橱里写博客就好了……社交什么的，退散退散！',
  '（握拳）为了买新的吉他效果器，今天也要努力……啊，打工更可怕，还是写博客吧！',
  '（妄想）如果时间线访问量突破一亿，我是不是就可以成为异世界的吉他英雄了？嘿嘿嘿……',
  '（心虚）完、完成了时间线重构，希望千万不要有人特意来指出BUG，求求了！',
  '（紧张）今天没有演出的话，能让我一直躲在壁橱里吗？壁橱最安心了……',
]
const currentThoughtIndex = ref(0)
let thoughtTimer: number

// 模拟时钟
const liveTime = ref('')
const updateLiveTime = () => {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  liveTime.value = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} // ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

let timerId: number

// 滚动绑定
const scrollProgress = ref(0)
const miniPlayerOpacity = ref(0)
const miniPlayerTransform = ref('translate(-50%, -50%) translateY(-15px) scale(0.92)')

const handleScroll = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0

  // 渐进式粘性播放器切换：当滚动超过 80px (即主播放器开始被顶部遮挡时) 到 220px (完全遮挡)
  const start = 80
  const end = 220
  let t = 0
  if (scrollTop <= start) {
    t = 0
  } else if (scrollTop >= end) {
    t = 1
  } else {
    t = (scrollTop - start) / (end - start)
  }
  
  miniPlayerOpacity.value = t
  const translateY = -15 + t * 15
  const scale = 0.92 + t * 0.08
  miniPlayerTransform.value = `translate(-50%, -50%) translateY(${translateY}px) scale(${scale})`
}

const headerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // 碎碎念定时器
  thoughtTimer = window.setInterval(() => {
    currentThoughtIndex.value = (currentThoughtIndex.value + 1) % thoughts.length
  }, 6500)

  // 时钟定时器
  updateLiveTime()
  timerId = window.setInterval(updateLiveTime, 1000)

  // GSAP 音乐播放终端精密载入动画
  const tl = gsap.timeline()
  tl.from('.music-console-header', { scale: 0.96, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.album-art-wrap', { rotate: -60, opacity: 0, duration: 0.7, ease: 'back.out(1.2)' }, '-=0.5')
    .from('.track-details', { x: -20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    .from('.audio-visualizer', { opacity: 0, scale: 0.8, duration: 0.5 }, '-=0.3')
    .from('.player-progress-bar', { scaleX: 0, transformOrigin: 'left center', opacity: 0, duration: 0.6 }, '-=0.3')
    .from('.bocchi-talk-panel', { y: 15, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  clearInterval(thoughtTimer)
  clearInterval(timerId)
})

const goHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
// 顶部高科技系统监测条
.system-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 54px;
  background: rgba(3, 3, 5, 0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  box-sizing: border-box;
  z-index: 99;

  .back-terminal-btn {
    display: flex;
    align-items: center;
    color: #8892b0;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    letter-spacing: 1.5px;
    transition: all 0.3s ease;

    .btn-bracket {
      color: rgba(0, 255, 255, 0.4);
      transition: color 0.3s ease;
    }

    .btn-text {
      margin: 0 4px;
    }

    &:hover {
      color: #00ffff;
      text-shadow: 0 0 8px rgba(0, 255, 255, 0.5);

      .btn-bracket {
        color: #00ffff;
      }
    }
  }

  .sys-time-monitor {
    font-size: 11px;
    letter-spacing: 1px;

    .label {
      color: #00ffff;
      text-shadow: 0 0 6px rgba(0, 255, 255, 0.3);
      font-weight: 700;
    }

    .separator {
      color: rgba(255, 255, 255, 0.15);
      margin: 0 8px;
    }

    .time {
      color: #8892b0;
    }
  }

  // 粘性迷你音乐播放器
  .sticky-mini-player {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(6, 8, 14, 0.85);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 6px 16px 6px 8px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
    z-index: 10;

    .mini-album {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #000;
      border: 1.5px solid #111;
      overflow: hidden;
      animation: rotateVinyl 12s infinite linear;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      .mini-vinyl {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .mini-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      
      .mini-title {
        font-size: 11px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: 0.5px;
        white-space: nowrap;
        font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
      }

      .mini-artist {
        font-size: 8px;
        color: #4f5b70;
        font-weight: 600;
        line-height: 1;
        margin-top: 2px;
      }
    }

    .mini-visualizer {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 14px;
      margin-left: 6px;
      flex-shrink: 0;

      .mini-bar {
        width: 1.5px;
        height: 3px;
        background: #ff79c6;
        border-radius: 0.5px;
        animation: visualizerBounce 1.2s infinite ease-in-out;
        
        &:nth-child(2n) { background: #00ffff; }
        &:nth-child(3n) { background: #bf55ec; }
      }
    }
  }
}

// 结束乐队 Live 音乐播放器页眉
.music-console-header {
  position: relative;
  z-index: 2;
  max-width: 620px;
  margin: 32px auto 24px auto;
  background: rgba(6, 8, 14, 0.45);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 24px;
  box-sizing: border-box;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);

  .player-main {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }

  // 胶片专辑封套
  .album-art-wrap {
    position: relative;
    width: 64px;
    height: 64px;
    flex-shrink: 0;

    .vinyl-record {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #000;
      border: 3px solid #111;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
      animation: rotateVinyl 12s infinite linear;
      
      .vinyl-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.85;
      }
    }

    .record-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #030305;
      border: 2px solid #222;
      box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.2);
    }
  }

  // 歌曲信息
  .track-details {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .track-status {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;

      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #00ffff;
        box-shadow: 0 0 8px #00ffff;
        
        &.green {
          background: #2ecc71;
          box-shadow: 0 0 8px #2ecc71;
        }
      }

      .status-text {
        font-size: 8px;
        font-weight: 800;
        letter-spacing: 1.5px;
        color: #8892b0;
        text-transform: uppercase;
      }
    }

    .track-title {
      font-size: 20px;
      font-weight: 900;
      color: #ffffff;
      margin: 0 0 6px 0;
      letter-spacing: 1px;
      font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    }

    .track-meta {
      font-size: 10px;
      color: #4f5b70;
      font-weight: 700;
      letter-spacing: 0.5px;

      .divider {
        margin: 0 6px;
        color: rgba(255, 255, 255, 0.05);
      }
    }
  }

  // 频谱指示条
  .audio-visualizer {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 24px;
    flex-shrink: 0;

    .bar {
      width: 2px;
      height: 4px;
      background: #ff79c6;
      border-radius: 1px;
      animation: visualizerBounce 1.2s infinite ease-in-out;
      
      &:nth-child(2n) { background: #00ffff; }
      &:nth-child(3n) { background: #bf55ec; }
    }
  }

  // 播放进度条 / 联动页面滚动
  .player-progress-bar {
    width: 100%;
    margin-bottom: 24px;

    .progress-fill {
      height: 2px;
      background: linear-gradient(90deg, #00ffff, #bf55ec, #ff79c6);
      box-shadow: 0 0 6px #bf55ec;
      border-radius: 1px;
      transition: width 0.1s ease-out;
    }

    .progress-time {
      display: flex;
      justify-content: space-between;
      margin-top: 6px;
      font-size: 9px;
      color: rgba(255, 255, 255, 0.15);
      font-weight: 700;
      letter-spacing: 1px;
    }
  }
}

// 后藤独壁橱碎碎念面板
.bocchi-talk-panel {
  max-width: 580px;
  margin: 24px auto 56px auto;
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(6, 8, 14, 0.45);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 12px 20px;
  box-sizing: border-box;
  position: relative;
  z-index: 5;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 24px;
    right: 24px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 121, 198, 0.4), transparent);
  }

  .avatar-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;

    .bocchi-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 121, 198, 0.4);
      box-shadow: 0 0 10px rgba(255, 121, 198, 0.2);
      object-fit: cover;
    }

    .bocchi-name {
      font-size: 8px;
      color: #ff79c6;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  }

  .speech-bubble {
    position: relative;
    flex-grow: 1;
    display: flex;
    align-items: center;
    min-height: 48px;

    .bubble-arrow {
      position: absolute;
      left: -8px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-right: 8px solid rgba(6, 8, 14, 0.45);
    }

    .bubble-content {
      font-size: 12px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.85);
      margin: 0;
      text-align: left;
      letter-spacing: 0.5px;
      font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    }
  }
}

// 碎碎念文本切换动画
.text-fade-enter-active,
.text-fade-leave-active {
  transition: all 0.4s ease;
}
.text-fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.text-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

// 胶片旋转动画
@keyframes rotateVinyl {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 频谱跳动
@keyframes visualizerBounce {
  0%, 100% { height: 4px; }
  50% { height: 22px; }
}
</style>
