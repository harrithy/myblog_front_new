<template>
  <div
    class="stream-node-wrapper"
    :class="[
      index % 2 === 0 ? 'node-left' : 'node-right',
      { 'is-active': isActive }
    ]"
    :data-id="item.id"
  >
    <!-- 中轴接点：极简微发光圆点 -->
    <div class="stream-core-joint" :style="{ '--joint-color': item.themeColor }">
      <div class="joint-ripple" :style="{ borderColor: item.themeColor }"></div>
      <div
        class="joint-dot"
        :style="{
          backgroundColor: item.themeColor,
          boxShadow: `0 0 8px ${item.themeColor}`,
        }"
      ></div>
    </div>

    <!-- 极简光影连结线 -->
    <div class="stream-bridge" :style="{ '--bridge-color': item.themeColor }">
      <div class="bridge-line"></div>
      <div class="bridge-particle"></div>
    </div>

    <!-- 卡片容器 -->
    <div
      class="stream-card-box"
      @mousemove="handleMouseMove($event)"
      @mouseleave="handleMouseLeave"
      :style="{ '--card-theme': item.themeColor }"
    >
      <!-- 结束乐队手账胶带 -->
      <div
        class="card-tape"
        :style="{
          backgroundColor: item.themeColor + '22',
          borderLeft: `2.5px solid ${item.themeColor}`,
          borderRight: `2.5px solid ${item.themeColor}`,
        }"
      ></div>

      <!-- 极简扫过微光 -->
      <div
        class="laser-swipe"
        :style="{
          background: `linear-gradient(to right, transparent, ${item.themeColor}0a, transparent)`,
        }"
      ></div>

      <!-- 卡片头部数据 -->
      <div class="card-meta">
        <span class="log-id">LOG_IDX // 00{{ item.id }}</span>
        <span
          class="category-badge"
          :style="{
            color: item.themeColor,
            borderColor: item.themeColor + '44',
            background: item.themeColor + '0d',
          }"
        >
          <span class="icon"><ChronoIcon :name="item.iconName" /></span>
          <span>{{ item.category }}</span>
        </span>
      </div>

      <!-- 卡片核心区域 -->
      <div class="card-inner-shell">
        <!-- 大号高科技日期 -->
        <div class="time-block">
          <span
            class="big-date"
            :style="{ textShadow: `0 0 10px ${item.themeColor}44`, color: item.themeColor }"
          >
            {{ formatDate(item.date) }}
          </span>
          <span class="month-bracket">[{{ formatMonth(item.date) }}]</span>
        </div>

        <h3 class="log-title">{{ item.title }}</h3>
        <p class="log-content">{{ item.content }}</p>
      </div>

      <!-- 卡片底部科技线条与格栅 -->
      <div class="card-footer">
        <div class="tech-grill">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <span class="sec-label">SECURE_ARCHIVE</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChronoIcon from './ChronoIcon.vue'

interface TimelineItem {
  id: number
  date: string
  title: string
  content: string
  category: string
  iconName: string
  themeColor: string
}

defineProps<{
  item: TimelineItem
  index: number
  isActive: boolean
}>()

// 日期解析
const formatDate = (dateStr: string) => {
  const parts = dateStr.split('-')
  return `${parts[1]} // ${parts[2]}`
}

const formatMonth = (dateStr: string) => {
  const date = new Date(dateStr)
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ]
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

// 三维卡片视差倾斜 (陀螺仪效果)
const handleMouseMove = (e: MouseEvent) => {
  const card = e.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()

  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const px = x / rect.width
  const py = y / rect.height
  const rotateX = (0.5 - py) * 12 // 最大倾斜 12 度
  const rotateY = (px - 0.5) * 12

  card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`
}

const handleMouseLeave = (e: MouseEvent) => {
  const card = e.currentTarget as HTMLElement
  card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`
}
</script>

<style lang="scss" scoped>
// 单个节点容器
.stream-node-wrapper {
  display: flex;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);

  &.is-active {
    opacity: 1;
  }

  // 中轴跨轨连接圆点
  .stream-core-joint {
    position: absolute;
    left: 50%;
    top: 40px;
    width: 16px;
    height: 16px;
    transform: translate(-50%, -50%);
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: center;

    .joint-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      z-index: 2;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    // 微光波纹
    .joint-ripple {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 1px solid;
      border-radius: 50%;
      opacity: 0;
      transform: scale(0.3);
      pointer-events: none;
      transition: all 0.4s ease;
    }
  }

  // 极简光影连结线 (虚线桥)
  .stream-bridge {
    position: absolute;
    top: 40px;
    height: 2px;
    z-index: 1;
    width: 4%;
    transition: all 0.5s ease;
    display: flex;
    align-items: center;

    .bridge-line {
      width: 100%;
      height: 1px;
      border-bottom: 1px dashed rgba(255, 255, 255, 0.08); // 虚线桥
      transition: all 0.5s ease;
    }

    .bridge-particle {
      position: absolute;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: var(--bridge-color);
      box-shadow: 0 0 6px var(--bridge-color);
      opacity: 0;
      transition: all 0.5s ease;
    }
  }

  // 科技感卡片主体
  .stream-card-box {
    width: 44%;
    background: rgba(7, 10, 15, 0.4);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 4px;
    padding: 24px;
    box-sizing: border-box;
    position: relative;
    z-index: 3;
    cursor: pointer;

    // 极轻滑过流光
    overflow: hidden;

    // 保持3D透视平滑
    transition:
      transform 0.1s ease-out,
      border-color 0.4s ease,
      box-shadow 0.4s ease;
    transform-style: preserve-3d;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);

    // 结束乐队手账胶带
    .card-tape {
      position: absolute;
      top: -9px;
      left: 50%;
      transform: translateX(-50%) rotate(-2deg);
      width: 64px;
      height: 16px;
      backdrop-filter: blur(2px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      z-index: 10;
      transition: all 0.4s ease;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
          45deg,
          transparent,
          transparent 4px,
          rgba(255, 255, 255, 0.06) 4px,
          rgba(255, 255, 255, 0.06) 8px
        );
      }
    }

    &:hover .card-tape {
      transform: translateX(-50%) rotate(-0.5deg) scale(1.05);
      box-shadow: 0 4px 10px var(--card-theme) 30;
    }

    .laser-swipe {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      opacity: 0.1;
      transform: translateX(-100%);
      transition: transform 0.8s ease;
    }

    // 卡片元数据
    .card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      font-size: 10px;

      .log-id {
        color: #4f5b70;
        font-weight: 700;
        letter-spacing: 1.5px;
      }

      .category-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        border: 1px solid;
        padding: 2px 8px;
        border-radius: 3px;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;

        .icon {
          font-size: 12px;
        }
      }
    }

    // 核心时间及文案区
    .card-inner-shell {
      transform: translateZ(20px); // 卡片悬浮3D厚度

      .time-block {
        display: flex;
        align-items: baseline;
        gap: 10px;
        margin-bottom: 16px;

        .big-date {
          font-family: 'Outfit', sans-serif;
          font-size: 26px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.5px;
        }

        .month-bracket {
          font-size: 10px;
          font-weight: 700;
          color: #4f5b70;
          letter-spacing: 1px;
        }
      }

      .log-title {
        font-size: 17px;
        font-weight: 800;
        color: #ffffff;
        margin: 0 0 10px 0;
        line-height: 1.4;
        letter-spacing: -0.3px;
        transition: color 0.3s ease;
      }

      .log-content {
        font-size: 13px;
        color: #8892b0;
        line-height: 1.6;
        margin: 0;
        font-weight: 400;
        letter-spacing: 0.2px;
      }
    }

    // 页脚
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding-top: 14px;
      border-top: 1px dashed rgba(255, 255, 255, 0.03);

      .tech-grill {
        display: flex;
        gap: 3px;

        span {
          width: 8px;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 1px;
          transition: background 0.3s ease;
        }
      }

      .sec-label {
        font-size: 9px;
        color: rgba(255, 255, 255, 0.15);
        font-weight: 700;
        letter-spacing: 1.5px;
      }
    }

    // 强力悬停态
    &:hover {
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 20px 48px rgba(0, 0, 0, 0.6),
        0 0 25px var(--card-theme) 1f;

      .laser-swipe {
        transform: translateX(100%);
      }

      .card-inner-shell .log-title {
        color: var(--card-theme);
      }

      .card-footer .tech-grill span {
        background: var(--card-theme);
      }
    }
  }

  // 左右对齐细节
  &.node-left {
    justify-content: flex-start;
    transform: translateX(-40px);

    &.is-active {
      transform: translateX(0);
    }

    .stream-bridge {
      right: 50%;
      transform-origin: right center;

      .bridge-line {
        background: linear-gradient(to left, var(--bridge-color), transparent);
        opacity: 0.05;
      }

      .bridge-particle {
        left: 0;
      }
    }

    // 悬浮联动的微发光效应
    &:hover {
      .stream-core-joint {
        .joint-dot {
          transform: scale(1.5);
          box-shadow:
            0 0 16px var(--joint-color),
            0 0 32px var(--joint-color);
        }
        .joint-ripple {
          opacity: 0.8;
          transform: scale(1.5);
          animation: pulseRipple 1.6s infinite ease-out;
        }
      }
      .stream-bridge {
        width: 6%;
        .bridge-line {
          opacity: 0.4;
          background: linear-gradient(to left, var(--bridge-color), transparent);
        }
        .bridge-particle {
          opacity: 1;
          animation: flowLeft 1.2s infinite linear;
        }
      }
    }
  }

  &.node-right {
    justify-content: flex-end;
    transform: translateX(40px);

    &.is-active {
      transform: translateX(0);
    }

    .stream-bridge {
      left: 50%;
      transform-origin: left center;

      .bridge-line {
        background: linear-gradient(to right, var(--bridge-color), transparent);
        opacity: 0.05;
      }

      .bridge-particle {
        right: 0;
      }
    }

    &:hover {
      .stream-core-joint {
        .joint-dot {
          transform: scale(1.5);
          box-shadow:
            0 0 16px var(--joint-color),
            0 0 32px var(--joint-color);
        }
        .joint-ripple {
          opacity: 0.8;
          transform: scale(1.5);
          animation: pulseRipple 1.6s infinite ease-out;
        }
      }
      .stream-bridge {
        width: 6%;
        .bridge-line {
          opacity: 0.4;
          background: linear-gradient(to right, var(--bridge-color), transparent);
        }
        .bridge-particle {
          opacity: 1;
          animation: flowRight 1.2s infinite linear;
        }
      }
    }
  }
}

// 窄屏适配
@media (max-width: 768px) {
  .stream-node-wrapper {
    padding-left: 36px;
    justify-content: flex-start !important;
    transform: translateY(20px) !important;

    &.is-active {
      transform: translateY(0) !important;
    }

    .stream-core-joint {
      left: 16px;
    }

    .stream-bridge {
      left: 16px !important;
      width: 20px !important;
    }

    .stream-card-box {
      width: 100%;

      &::after {
        display: none; // 窄屏去掉悬突箭头
      }
    }
  }
}

@keyframes flowLeft {
  0% { left: 100%; opacity: 0; }
  20% { opacity: 0.8; }
  80% { opacity: 0.8; }
  100% { left: 0%; opacity: 0; }
}

@keyframes flowRight {
  0% { left: 0%; opacity: 0; }
  20% { opacity: 0.8; }
  80% { opacity: 0.8; }
  100% { left: 100%; opacity: 0; }
}

@keyframes pulseRipple {
  0% { transform: scale(1.0); opacity: 0.8; }
  100% { transform: scale(2.2); opacity: 0.0; }
}
</style>
