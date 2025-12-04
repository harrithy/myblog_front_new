<template>
  <div class="callback-container">
    <div class="loading-card">
      <div class="spinner"></div>
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
const statusText = ref('正在登录中...')

onMounted(async () => {
  // 从 URL 获取授权码
  const code = new URLSearchParams(window.location.search).get('code')

  if (!code) {
    statusText.value = '授权失败：未获取到授权码'
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

    statusText.value = '登录成功，正在跳转...'
    ElMessage.success('登录成功')

    // 跳转到首页
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    console.error('GitHub 登录失败', error)
    statusText.value = '登录失败，请重试'
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loading-card {
  background: white;
  padding: 40px 60px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}
</style>
