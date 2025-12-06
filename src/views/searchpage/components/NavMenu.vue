<template>
  <div class="nav-menu-container" @mouseenter="showMenu = true" @mouseleave="showMenu = false">
    <!-- 触发按钮 -->
    <div class="nav-trigger" :class="{ active: showMenu }">
      <div class="dot-grid"><span></span><span></span> <span></span><span></span></div>
    </div>

    <!-- 下拉面板 -->
    <Transition name="menu-slide">
      <div v-show="showMenu" class="glass-panel">
        <!-- <div class="panel-header">
          <span class="header-icon">✨</span>
          <span class="header-text">传送门</span>
        </div> -->
        <div class="menu-list">
          <div
            v-for="item in menuList"
            :key="item.path"
            class="menu-item"
            @click="navigateTo(item.path)"
          >
            <div class="item-icon" :class="item.iconClass">
              <svg-icon :name="item.icon" />
            </div>
            <div class="item-content">
              <span class="title">{{ item.title }}</span>
              <span class="desc">{{ item.desc }}</span>
            </div>
            <svg-icon name="arrow-right" class="arrow" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'NavMenu',
})

const router = useRouter()
const showMenu = ref(false)

const menuList = [
  {
    path: '/',
    icon: 'home',
    iconClass: 'home-icon',
    title: '首页',
    desc: '回到开始的地方',
  },
  {
    path: '/blog',
    icon: 'book',
    iconClass: 'blog-icon',
    title: '阅览室',
    desc: '探索所有文章',
  },
  {
    path: '/about',
    icon: 'user',
    iconClass: 'about-icon',
    title: '关于我',
    desc: '了解更多故事',
  },
]

const navigateTo = (path: string) => {
  router.push(path)
  showMenu.value = false
}
</script>

<style scoped lang="scss">
// 灵动导航菜单
.nav-menu-container {
  position: relative;
  margin-top: 10px;
  z-index: 100;

  // 触发器按钮
  .nav-trigger {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    &:hover,
    &.active {
      background: #fff;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255, 182, 193, 0.4);
      border-color: #ffb6c1;

      .dot-grid {
        transform: rotate(90deg);
        gap: 5px;

        span {
          background-color: #ffb6c1;
          &:nth-child(1) {
            transform: scale(1.2);
          }
          &:nth-child(4) {
            transform: scale(1.2);
          }
        }
      }
    }

    .dot-grid {
      display: grid;
      grid-template-columns: repeat(2, 4px);
      gap: 4px;
      transition: all 0.4s ease;

      span {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #888;
        transition: all 0.3s ease;
      }
    }
  }

  // 玻璃面板
  .glass-panel {
    position: absolute;
    top: 55px;
    right: 0;
    width: 240px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    box-shadow:
      0 10px 40px -10px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.5) inset;
    padding: 16px;
    transform-origin: top right;
    overflow: hidden;

    .panel-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 8px 12px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      margin-bottom: 8px;

      .header-text {
        font-size: 12px;
        font-weight: 600;
        color: #999;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
    }

    .menu-list {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #555;

        .item-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          transition: all 0.3s ease;
          color: #666;

          :deep(.svg-icon) {
            width: 18px;
            height: 18px;
            fill: none !important;
            stroke: currentColor;
            stroke-width: 2.5;
            stroke-linecap: round;
            stroke-linejoin: round;
          }

          &.home-icon {
            color: #6c5ce7;
          }
          &.blog-icon {
            color: #0984e3;
          }
          &.about-icon {
            color: #e17055;
          }
        }

        .item-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;

          .title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
          }

          .desc {
            font-size: 11px;
            color: #999;
          }
        }

        .arrow {
          opacity: 0;
          transform: translateX(-5px);
          transition: all 0.3s ease;
          color: #ccc;

          // 针对 svg-icon 的样式
          width: 14px;
          height: 14px;
          fill: none !important;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        &:hover {
          background: rgba(255, 182, 193, 0.15);

          .item-icon {
            background: #fff;
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }

          .arrow {
            opacity: 1;
            transform: translateX(0);
            color: #ffb6c1;
          }
        }
      }
    }
  }
}

// 菜单动画
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
  filter: blur(10px);
}
</style>
