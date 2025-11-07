<template>
  <div class="owner-login">
    <!-- 暗黑背景 -->
    <div class="dark-background">
      <div class="gradient-overlay"></div>
      <div class="animated-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>
    
    <!-- 登录卡片 -->
    <div class="login-card" ref="loginCard">
      <div class="login-header">
        <h1 class="login-title">Owner Login</h1>
        <p class="login-subtitle">Welcome back, please sign in to continue</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="account" class="form-label">
            <svg class="label-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Account
          </label>
          <input
            id="account"
            v-model="formData.account"
            type="text"
            class="form-input"
            placeholder="Enter your account"
            required
            :disabled="isLoading"
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">
            <svg class="label-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Password
          </label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            class="form-input"
            placeholder="Enter your password"
            required
            :disabled="isLoading"
          />
        </div>
        
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span>Remember me</span>
          </label>
          <a href="#" class="forgot-password">Forgot password?</a>
        </div>
        
        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="!isLoading">Sign In</span>
          <span v-else class="loading-spinner">
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle class="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            </svg>
            Signing in...
          </span>
        </button>
        
        <div v-if="errorMessage" class="error-message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {{ errorMessage }}
        </div>
      </form>
      
      <div class="login-footer">
        <p>Don't have an account? <a href="#" class="register-link">Register here</a></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { userApi, type LoginCredentials } from '@/api/user'
import gsap from 'gsap'

const router = useRouter()

// 表单数据
const formData = ref<LoginCredentials>({
  account: '',
  password: '',
})

// 状态管理
const isLoading = ref(false)
const errorMessage = ref('')
const rememberMe = ref(false)

// 登录卡片引用
const loginCard = ref<HTMLElement | null>(null)

// 处理登录
const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true
  
  try {
    const response = await userApi.login(formData.value)
    
    // 登录成功处理
    console.log('Login successful:', response)
    
    // 存储token（如果后端返回）
    if (response && typeof response === 'object' && 'token' in response) {
      localStorage.setItem('token', response.token as string)
    }
    
    // 如果勾选了记住我，存储账号
    if (rememberMe.value) {
      localStorage.setItem('rememberedAccount', formData.value.account)
    } else {
      localStorage.removeItem('rememberedAccount')
    }
    
    // 登录成功动画后跳转
    gsap.to(loginCard.value, {
      scale: 0.95,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        router.push('/')
      },
    })
  } catch (error) {
    console.error('Login failed:', error)
    errorMessage.value = 'Invalid username or password. Please try again.'
    
    // 错误抖动动画
    gsap.fromTo(
      loginCard.value,
      { x: -10 },
      {
        x: 10,
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        ease: 'power1.inOut',
        onComplete: () => {
          gsap.set(loginCard.value, { x: 0 })
        },
      },
    )
  } finally {
    isLoading.value = false
  }
}

// 组件挂载时的动画
onMounted(async () => {
  await nextTick()
  
  // 检查是否有记住的账号
  const rememberedAccount = localStorage.getItem('rememberedAccount')
  if (rememberedAccount) {
    formData.value.account = rememberedAccount
    rememberMe.value = true
  }
  
  if (!loginCard.value) return
  
  // 初始状态
  gsap.set(loginCard.value, {
    scale: 0.8,
    opacity: 0,
    y: 50,
  })
  
  // 入场动画
  gsap.to(loginCard.value, {
    scale: 1,
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'back.out(1.7)',
    delay: 0.2,
  })
})
</script>

<style lang="scss" scoped>
.owner-login {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  
  .dark-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
    z-index: -1;
    
    .gradient-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.2), transparent 50%),
                  radial-gradient(circle at 40% 20%, rgba(72, 61, 139, 0.2), transparent 50%);
      animation: gradientShift 15s ease infinite;
    }
    
    .animated-shapes {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
      
      .shape {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        opacity: 0.4;
        animation: float 20s ease-in-out infinite;
        
        &.shape-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          top: -150px;
          left: -150px;
          animation-delay: 0s;
        }
        
        &.shape-2 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #f093fb, #f5576c);
          bottom: -200px;
          right: -200px;
          animation-delay: 7s;
        }
        
        &.shape-3 {
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 14s;
        }
      }
    }
  }
  
  .login-card {
    width: 90%;
    max-width: 450px;
    background: rgba(30, 30, 45, 0.85);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.1);
    padding: 40px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    z-index: 1;
    
    .login-header {
      text-align: center;
      margin-bottom: 30px;
      
      .login-title {
        font-size: 32px;
        font-weight: 700;
        color: #ffffff;
        margin: 0 0 10px 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
      }
      
      .login-subtitle {
        font-size: 14px;
        color: #b0b0c0;
        margin: 0;
      }
    }
    
    .login-form {
      .form-group {
        margin-bottom: 20px;
        
        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #e0e0e8;
          margin-bottom: 8px;
          
          .label-icon {
            color: #667eea;
          }
        }
        
        .form-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 15px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          outline: none;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          
          &:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
            background: rgba(255, 255, 255, 0.08);
          }
          
          &:disabled {
            background: rgba(255, 255, 255, 0.02);
            cursor: not-allowed;
            opacity: 0.5;
          }
          
          &::placeholder {
            color: #6a6a80;
          }
        }
      }
      
      .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        
        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #b0b0c0;
          cursor: pointer;
          
          input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: #667eea;
          }
        }
        
        .forgot-password {
          font-size: 14px;
          color: #667eea;
          text-decoration: none;
          transition: color 0.3s ease;
          
          &:hover {
            color: #8b7fd8;
            text-decoration: underline;
          }
        }
      }
      
      .login-button {
        width: 100%;
        padding: 14px;
        font-size: 16px;
        font-weight: 600;
        color: white;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        position: relative;
        overflow: hidden;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
          
          &::before {
            left: 100%;
          }
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
        }
        
        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          
          .spinner {
            animation: spin 1s linear infinite;
            
            .spinner-circle {
              stroke-dasharray: 60;
              stroke-dashoffset: 40;
              stroke-linecap: round;
            }
          }
        }
      }
      
      .error-message {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 15px;
        padding: 12px;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: 8px;
        color: #f87171;
        font-size: 14px;
        
        svg {
          flex-shrink: 0;
        }
      }
    }
    
    .login-footer {
      margin-top: 25px;
      text-align: center;
      
      p {
        font-size: 14px;
        color: #b0b0c0;
        margin: 0;
        
        .register-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
          
          &:hover {
            color: #8b7fd8;
            text-decoration: underline;
          }
        }
      }
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes gradientShift {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .owner-login {
    .login-card {
      width: 95%;
      padding: 30px 25px;
      
      .login-header {
        .login-title {
          font-size: 28px;
        }
      }
    }
  }
}
</style>
