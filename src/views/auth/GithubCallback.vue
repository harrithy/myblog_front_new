<template>
  <div class="callback-container">
    <div class="loading-card">
      <div class="loading-icon">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <h3 class="loading-title">正在连接 GitHub</h3>
      <div class="loading-text">{{ statusText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'GithubCallback',
})

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { userApi } from '@/api/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const statusText = ref('正在验证您的身份喵...')

onMounted(async () => {
  // 从 URL 获取授权码
  const code = new URLSearchParams(window.location.search).get('code')

  if (!code) {
    statusText.value = '哎呀，授权失败了，未获取到授权码'
    ElMessage.error('授权失败：未获取到授权码')
    setTimeout(() => {
      router.push('/')
    }, 2000)
    return
  }

  try {
    // 用授权码换取 token
    const result = (await userApi.githubLogin(code)) as {
      token: string
      user: {
        id: number
        account: string
        name: string
        nickname: string
        avatar_url: string
        github_id?: number
        github_url?: string
        birthday?: string
        email?: string
        bio?: string
      }
    }

    console.log('GitHub 登录返回数据:', result)

    // 保存 token 和用户信息
    userStore.setToken(result.token)
    userStore.setUserInfo(result.user)
    userStore.saveUserInfo()

    statusText.value = '登录成功！欢迎回来喵~'
    ElMessage.success('登录成功')

    // 跳转到首页
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    console.error('GitHub 登录失败', error)
    statusText.value = '登录出错了，请稍后再试喵...'
    ElMessage.error('登录失败，请重试')
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }
})
</script>

<style scoped lang="scss">
.callback-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/source/kon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  // 添加遮罩层让背景稍微暗一点，突出卡片
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(8px); // 背景模糊
  }
}

.loading-card {
  position: relative;
  background: rgba(255, 255, 255, 0.85); // 半透明白色背景
  backdrop-filter: blur(12px); // 毛玻璃效果
  padding: 50px 80px;
  border-radius: 24px;
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.1),
    0 5px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: slideUp 0.6s ease-out;
  max-width: 400px;
  width: 90%;
}

.loading-icon {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 25px;

  .dot {
    width: 16px;
    height: 16px;
    background: #ffb6c1; // 浅粉色
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
      background: #a0cfff; // 浅蓝色
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
      background: #fab6b6; // 浅红色
    }
  }
}

.loading-title {
  font-size: 22px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
}

.loading-text {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
