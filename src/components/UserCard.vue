<template>
  <Transition name="fade">
    <div v-show="visible" class="user-card">
      <!-- 已登录状态 -->
      <template v-if="userStore.isLoggedIn">
        <div class="user-card-header">
          <div class="avatar-wrapper">
            <div v-if="isAvatarLoading" class="avatar-loading"></div>
            <img
              v-show="!isAvatarLoading"
              :src="userStore.userInfo?.avatar_url"
              alt=""
              class="user-card-avatar"
              @load="handleImageLoad"
              @error="handleImageError"
            />
          </div>
          <div class="user-card-info">
            <div class="user-card-name">
              {{ userStore.userInfo?.nickname || userStore.userInfo?.name }}
            </div>
            <div class="user-card-email">{{ userStore.userInfo?.account }}</div>
          </div>
        </div>
        <div v-if="userStore.userInfo?.bio" class="user-card-bio">
          {{ userStore.userInfo?.bio }}
        </div>
        <div class="user-card-actions">
          <button class="logout-btn" @click="handleLogout">退出登录</button>
        </div>
      </template>
      <!-- 未登录状态 -->
      <template v-else>
        <div class="login-prompt">
          <div class="login-title">欢迎访问</div>
          <div class="login-desc">登录后可以体验更多功能</div>
          <button class="github-login-btn" @click="handleGithubLogin">
            <svg-icon name="github" class="github-icon" />
            <span>使用 GitHub 登录</span>
          </button>
        </div>
      </template>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineOptions({
  name: 'UserCard',
})

import { useUserStore } from '@/stores/user'
import defaultAvatar from '@/assets/source/avatar.gif'
import { ref, watch } from 'vue'

// Props
defineProps<{
  visible: boolean
}>()

// Emits
const emit = defineEmits<{
  logout: []
}>()

// 用户状态
const userStore = useUserStore()

// 图片加载状态
const isAvatarLoading = ref(true)

// 监听用户信息变化，重置 loading 状态
watch(
  () => userStore.userInfo?.avatar_url,
  () => {
    isAvatarLoading.value = true
  },
)

const handleImageLoad = () => {
  isAvatarLoading.value = false
}

const handleImageError = (e: Event) => {
  isAvatarLoading.value = false
  const target = e.target as HTMLImageElement
  target.src = defaultAvatar
}

// GitHub 登录配置
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || 'Ov23liSXz8pI9Z4PcnnO'

// GitHub 登录
const handleGithubLogin = () => {
  const redirectUri = `${window.location.origin}/callback`
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`
  window.location.href = authUrl
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
  emit('logout')
}
</script>

<style scoped lang="scss">
.user-card {
  position: absolute;
  top: 70px;
  right: 0;
  width: 300px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.5);
  padding: 24px;
  z-index: 100;
  transform-origin: top right;

  .user-card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    .user-card-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .avatar-loading {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
      border: 2px solid white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    @keyframes skeleton-loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    .user-card-info {
      flex: 1;
      overflow: hidden;

      .user-card-name {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-card-email {
        font-size: 13px;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .user-card-bio {
    font-size: 14px;
    color: #555;
    line-height: 1.6;
    margin-bottom: 16px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
  }

  .user-card-actions {
    .logout-btn {
      width: 100%;
      padding: 10px;
      border: none;
      background: rgba(245, 108, 108, 0.1);
      color: #f56c6c;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #f56c6c;
        color: white;
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(1px);
      }
    }
  }

  .login-prompt {
    text-align: center;
    padding: 10px 0;

    .login-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }

    .login-desc {
      font-size: 14px;
      color: #666;
      margin-bottom: 20px;
    }

    .github-login-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 12px;
      border: none;
      background: #24292e;
      color: white;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(36, 41, 46, 0.2);

      .github-icon {
        width: 22px;
        height: 22px;
      }

      &:hover {
        background: #2f363d;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(36, 41, 46, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
