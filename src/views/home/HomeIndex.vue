<template>
  <!-- 个人主页 -->
  <div class="home">
    <!-- 视频背景 -->
    <video autoplay loop muted class="video-background">
      <source src="../../assets/source/kkl.mp4" type="video/mp4" />
    </video>
    <div class="myblog-box" ref="myblogBox">
      <WalkingCharacter ref="character" class="walking-character" />
      <svg class="motion-path-svg" width="100%" height="100%">
        <path class="motion-path" fill="none" stroke="none" />
      </svg>
      <!-- 左侧区域 - 占1/3 -->
      <div class="left-section">
        <!-- 头像区域 -->
        <div class="avatar-section">
          <div class="avatar-frame">
            <img src="../../assets/logo.svg" alt="头像" class="avatar" />
          </div>
        </div>
        <!-- 时间记录表 -->
        <div class="time-record-section">
          <h3>访问记录</h3>
          <div class="visit-list">
            <div v-for="visit in visits" :key="visit.id" class="visit-item">
              <span class="visit-time">{{ formatVisitTime(visit.visit_time) }}</span>
              <span class="visit-ip">{{ visit.ip_address || '未知IP' }}</span>
            </div>
            <div v-if="visits.length === 0" class="no-visits">暂无访问记录</div>
          </div>
        </div>
      </div>
      <!-- 右侧区域 - 占2/3 -->
      <div class="right-section">
        <div class="project-intro">
          <ContributionGraph />
          <h2>项目介绍</h2>
          <div class="project-content">
            <p>欢迎来到我的个人博客项目！这是一个基于 Vue 3 + TypeScript 构建的现代化博客系统。</p>
            <h3>技术栈：</h3>
            <ul>
              <li>前端：Vue 3, TypeScript, Vite, Pinia</li>
              <li>动画：GSAP</li>
              <li>样式：SCSS</li>
              <li>构建工具：Vite</li>
            </ul>
            <h3>功能特性：</h3>
            <ul>
              <li>响应式设计</li>
              <li>平滑动画效果</li>
              <li>访问记录统计</li>
              <li>博客文章管理</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ContributionGraph from './components/ContributionGraph.vue'
import WalkingCharacter from './components/WalkingCharacter.vue'
// import { navigateTo } from '@/utils/navigation'
import { onMounted, ref, nextTick } from 'vue'
import { visitApi } from '@/api/index'
import type { VisitRecord } from '@/api/visit'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(MotionPathPlugin)

// 创建分页
const page = ref(1)
const pageSize = ref(10)
// 访问记录
const visits = ref<VisitRecord[]>([])

// 获取myblog-box的引用
const myblogBox = ref<HTMLElement | null>(null)
const character = ref<InstanceType<typeof WalkingCharacter> | null>(null)

// 格式化访问时间
const formatVisitTime = (timeString: string) => {
  const date = new Date(timeString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(async () => {
  await nextTick()

  if (!myblogBox.value || !character.value) return

  const box = myblogBox.value as HTMLElement
  const charEl = character.value.$el

  // 1. 初始时，小人是完全透明的
  gsap.set(charEl, { opacity: 0 })

  const startWalkingAnimation = () => {
    const path = box.querySelector('.motion-path') as SVGPathElement
    const w = box.offsetWidth
    const h = box.offsetHeight
    const r = parseFloat(getComputedStyle(box).borderRadius) || 0
    // SVG角色宽度是32px，所以中心点偏移量是16px
    const offset = 16

    const svg = box.querySelector('.motion-path-svg') as SVGElement
    svg.style.top = `-${offset}px`
    svg.style.left = `-${offset}px`
    svg.style.width = `${w + offset * 2}px`
    svg.style.height = `${h + offset * 2}px`

    const pathData = `M ${r + offset},${offset} L ${w + offset - r},${offset} A ${r},${r} 0 0 1 ${w + offset},${r + offset} L ${w + offset},${h + offset - r} A ${r},${r} 0 0 1 ${w + offset - r},${h + offset} L ${r + offset},${h + offset} A ${r},${r} 0 0 1 ${offset},${h + offset - r} L ${offset},${r + offset} A ${r},${r} 0 0 1 ${r + offset},${offset} Z`
    path.setAttribute('d', pathData)

    // 2. 创建一个动画时间线，精确控制流程
    const tl = gsap.timeline()

    // 步骤A: 立即将小人设置到路径起点，但保持透明
    tl.set(charEl, {
      opacity: 0,
      motionPath: {
        path: path,
        align: path,
        alignOrigin: [0.5, 1],
        autoRotate: true,
      },
    })

    // 步骤B: 让小人平滑地出现
    tl.to(charEl, {
      opacity: 1,
      duration: 0.5,
      ease: 'power1.inOut',
    })

    // 步骤C: 在出现后，开始无限循环的行走动画
    tl.to(
      charEl,
      {
        motionPath: {
          path: path,
          align: path,
          alignOrigin: [0.5, 1],
          autoRotate: true,
          start: 0, // 从路径起点开始
          end: 1, // 到路径终点结束
        },
        duration: 30,
        ease: 'none',
        repeat: -1,
      },
      '>',
    ) // ">"表示紧接着上一个动画结束时开始
  }

  visitApi.getVisits(page.value, pageSize.value).then((res) => {
    visits.value = res as VisitRecord[]
    console.log(visits.value)
  })

  gsap.set(myblogBox.value, {
    scaleX: 0,
    scaleY: 0.9,
    opacity: 0,
    rotation: 0,
  })

  gsap.to(myblogBox.value, {
    duration: 1.2,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    ease: 'power3.out',
    delay: 0.3,
    onComplete: startWalkingAnimation,
  })
})
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  position: relative; /* Needed for video positioning */
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; // 防止行走的角色撑开页面导致滚动条
  .video-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* Ensures video covers entire container */
    z-index: -1;
    opacity: 0.8;
  }
  .myblog-box {
    position: relative; // 为SVG和角色定位
    width: 70%;
    height: 70%;
    // 透明边框与背景
    border: 2px solid rgba(255, 255, 255, 0.5);
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    display: flex;
    // 确保transform-origin在中心，这样缩放动画效果更好
    transform-origin: center center;
    overflow: visible; // 允许角色在边框外侧行走

    .motion-path-svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: visible; // 确保路径本身不被裁剪
    }

    .walking-character {
      position: absolute;
      top: 0;
      left: 0;
      // GSAP会通过transform来控制位置，这里设置top/left为0即可
    }

    // 左侧区域 - 占1/3
    .left-section {
      width: 33.33%;
      height: 100%;
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(255, 255, 255, 0.3);

      // 头像区域
      .avatar-section {
        height: 40%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;

        .avatar-frame {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.8);
          padding: 5px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);

          .avatar {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
        }
      }

      // 时间记录表区域
      .time-record-section {
        height: 60%;
        padding: 15px;
        display: flex;
        flex-direction: column;

        h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 16px;
          text-align: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding-bottom: 8px;
        }

        .visit-list {
          flex: 1;
          overflow-y: auto;

          .visit-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 5px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            font-size: 12px;

            .visit-time {
              color: #666;
              flex: 2;
            }

            .visit-ip {
              color: #999;
              flex: 1;
              text-align: right;
              font-size: 11px;
            }
          }

          .no-visits {
            text-align: center;
            color: #999;
            font-style: italic;
            padding: 20px;
          }
        }
      }
    }

    // 右侧区域 - 占2/3
    .right-section {
      width: 66.67%;
      height: 100%;
      padding: 25px;

      .project-intro {
        height: 100%;

        h2 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 24px;
          text-align: center;
          border-bottom: 2px solid rgba(0, 0, 0, 0.1);
          padding-bottom: 10px;
        }

        .project-content {
          height: calc(100% - 60px);
          overflow-y: auto;

          p {
            line-height: 1.6;
            color: #555;
            margin-bottom: 15px;
          }

          h3 {
            color: #444;
            margin: 20px 0 10px 0;
            font-size: 18px;
          }

          ul {
            padding-left: 20px;
            margin-bottom: 15px;

            li {
              line-height: 1.5;
              color: #666;
              margin-bottom: 8px;
            }
          }
        }
      }
    }
  }
}
</style>
