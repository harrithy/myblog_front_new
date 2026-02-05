<template>
  <div class="search-container">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <!-- 灵动导航菜单 -->
      <NavMenu ref="navMenuRef" />
      <div
        ref="avatarRef"
        class="avatar-wrapper"
        @mouseenter="showCard = true"
        @mouseleave="showCard = false"
      >
        <div class="avatar">
          <el-image
            :src="userStore.isLoggedIn ? userStore.userInfo?.avatar_url : avatarImage"
            fit="cover"
          >
            <template #placeholder>
              <div class="avatar-loading"></div>
            </template>
            <template #error>
              <img :src="avatarImage" alt="default" class="error-image" />
            </template>
          </el-image>
        </div>
        <!-- 用户信息卡片 -->
        <UserCard :visible="showCard" />
      </div>
    </div>
    <SearchBox ref="searchBoxRef" @search="handleSearch" />

    <!-- 自定义新手引导 -->
    <TourGuide
      v-model:visible="showTour"
      :steps="tourSteps"
      @finish="handleTourFinish"
      @skip="handleTourSkip"
    />
  </div>
</template>

<script setup lang="ts">
// 定义组件名称
defineOptions({
  name: 'SearchPage',
})
import { ref, onMounted } from 'vue'
import avatarImage from '@/assets/source/avatar.gif'
import { useUserStore } from '@/stores/user'
import UserCard from '@/components/UserCard.vue'
import SearchBox from '@/views/searchpage/components/SearchBox.vue'
import NavMenu from '@/views/searchpage/components/NavMenu.vue'
import TourGuide, { type TourStep } from '@/components/TourGuide/index.vue'
import { userApi } from '@/api'

// 用户状态
const userStore = useUserStore()

// 控制卡片显示
const showCard = ref(false)

// 引导相关
const showTour = ref(false)
const searchBoxRef = ref<InstanceType<typeof SearchBox> | null>(null)
const navMenuRef = ref<InstanceType<typeof NavMenu> | null>(null)
const avatarRef = ref<HTMLElement | null>(null)

// 引导步骤配置
const tourSteps = ref<TourStep[]>([])

// localStorage key
const TOUR_SHOWN_KEY = 'search_page_tour_shown_custom'

// 检查是否需要显示引导
const checkShowTour = () => {
  const hasShown = localStorage.getItem(TOUR_SHOWN_KEY)
  if (!hasShown) {
    // 延迟显示，确保 DOM 渲染完成
    setTimeout(() => {
      // 配置引导步骤
      tourSteps.value = [
        {
          target: '.search-box', // 使用类名选择器更稳定
          title: '🔍 灵动搜索',
          description: '在这里输入关键词，即可快速检索博客文章和分类，支持模糊搜索~',
          placement: 'bottom',
        },
        {
          target: '.nav-trigger',
          title: '📍 传送门',
          description: '点击这里展开导航菜单，可以快速跳转到首页、博客列表等页面，探索更多精彩~',
          placement: 'bottom',
        },
        {
          target: '.avatar',
          title: '👤 个人中心',
          description: '鼠标悬停在这里可以查看个人信息，登录后还可以发表评论~',
          placement: 'bottom',
        },
      ]
      showTour.value = true
    }, 800)
  }
}

const handleTourFinish = () => {
  localStorage.setItem(TOUR_SHOWN_KEY, 'true')
  console.log('引导完成 ✨')
}

const handleTourSkip = () => {
  localStorage.setItem(TOUR_SHOWN_KEY, 'true')
  console.log('跳过引导')
}

const handleSearch = (value: string) => {
  console.log('搜索内容:', value)
}

// 验证 token 是否过期
const verifyToken = async () => {
  // 如果没有 token，直接跳过验证喵～
  if (!userStore.token) return

  try {
    await userApi.checkToken()
    // token 有效，什么都不用做喵～
  } catch {
    // token 过期或无效，清空用户信息喵 QAQ
    console.log('Token 已过期，正在清理用户信息喵～')
    userStore.logout()
    localStorage.removeItem('userInfo')
  }
}

// 初始化时恢复用户信息并验证 token
onMounted(async () => {
  userStore.restoreUserInfo()
  await verifyToken()
  checkShowTour()
})
</script>

<style scoped lang="scss">
.search-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  // align-items: center;
  background-image: url('@/assets/source/kon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
  .top-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 20px;
    gap: 15px;
    z-index: 1000; // 确保在最上层

    .avatar-wrapper {
      position: relative;

      .avatar {
        margin: 10px 20px 0 0;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        object-fit: cover;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        .avatar-loading {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
        }

        :deep(.el-image) {
          width: 100%;
          height: 100%;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }
        }

        .error-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &:hover {
          transform: scale(1.1) rotate(5deg);
          border-color: #ffb6c1; // 浅粉色
          box-shadow: 0 0 20px rgba(255, 182, 193, 0.6); // 粉色梦幻光晕

          :deep(.el-image) img {
            transform: scale(1.1);
          }
        }
      }
    }
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
