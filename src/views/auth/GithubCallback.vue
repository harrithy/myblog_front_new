<template>
  <div class="callback-container">
    <div class="loading-card">
      <div class="loading-icon">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <h3 class="loading-title">正在连接 GitHub</h3>
      <p class="loading-text">{{ statusText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'GithubCallback',
})

import { onMounted, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { consumeAuthRedirect, persistAuthSession } from '@/composables/useAuthSession'
import { userApi, type AuthResponse } from '@/api/user'

const router = useRouter()
const statusText = shallowRef('正在验证你的 GitHub 身份，请稍候...')

onMounted(async () => {
  const code = new URLSearchParams(window.location.search).get('code')

  if (!code) {
    statusText.value = '没有拿到授权码，请重新发起 GitHub 登录。'
    ElMessage.error('授权失败：未获取到授权码')

    setTimeout(() => {
      router.replace('/login')
    }, 1600)

    return
  }

  try {
    const result = (await userApi.githubLogin(code)) as AuthResponse
    persistAuthSession(result)

    statusText.value = '登录成功，正在带你回到首页...'
    ElMessage.success('GitHub 登录成功')

    setTimeout(() => {
      router.replace(consumeAuthRedirect())
    }, 900)
  } catch (error) {
    console.error('GitHub 登录失败', error)
    statusText.value = '登录失败了，请回到登录页再试一次。'
    ElMessage.error('GitHub 登录失败，请重试')

    setTimeout(() => {
      router.replace('/login')
    }, 1600)
  }
})
</script>

<style scoped lang="scss">
.callback-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(circle at 20% 24%, rgba(255, 146, 203, 0.22), transparent 30%),
    radial-gradient(circle at 78% 18%, rgba(108, 199, 255, 0.18), transparent 32%),
    linear-gradient(180deg, #fff9fb 0%, #fff0f7 46%, #fdebf4 100%);
}

.loading-card {
  width: min(420px, 100%);
  padding: 38px 34px;
  border-radius: 28px;
  border: 1px solid rgba(168, 33, 110, 0.14);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 40px 80px -56px rgba(168, 33, 110, 0.4);
  backdrop-filter: blur(18px);
  text-align: center;
}

.loading-icon {
  display: inline-flex;
  gap: 12px;
  margin-bottom: 22px;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #a8216e, #ff8fc9);
  animation: bounce 1.2s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.15s;
  background: linear-gradient(135deg, #6cc7ff, #97f5ff);
}

.dot:nth-child(3) {
  animation-delay: 0.3s;
  background: linear-gradient(135deg, #ffd05d, #ffe6a5);
}

.loading-title {
  margin: 0;
  font-family: 'Fraunces', serif;
  font-size: 2rem;
  color: #80144f;
}

.loading-text {
  margin: 12px 0 0;
  color: rgba(74, 0, 44, 0.72);
  line-height: 1.7;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.55;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
