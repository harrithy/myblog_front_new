<template>
  <div class="search-container">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="avatar-wrapper" @mouseenter="showCard = true" @mouseleave="showCard = false">
        <div class="avatar">
          <img
            :src="userStore.isLoggedIn ? userStore.userInfo?.avatar_url : avatarImage"
            alt=""
            @error="(e: Event) => ((e.target as HTMLImageElement).src = avatarImage)"
          />
        </div>
        <!-- 用户信息卡片 -->
        <Transition name="fade">
          <div v-show="showCard" class="user-card">
            <!-- 已登录状态 -->
            <template v-if="userStore.isLoggedIn">
              <div class="user-card-header">
                <img
                  :src="userStore.userInfo?.avatar_url"
                  alt=""
                  class="user-card-avatar"
                  @error="(e: Event) => ((e.target as HTMLImageElement).src = avatarImage)"
                />
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
      </div>
    </div>
    <div class="search-box">
      <div class="icon-wrapper">
        <svg-icon name="search" class="search-icon" />
      </div>
      <input
        type="text"
        v-model="searchValue"
        placeholder="Type to search..."
        class="search-input"
        @keyup.enter="search"
      />
      <button class="search-btn" @click="search">Search</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名称
defineOptions({
  name: 'SearchPage',
})
import { ref, onMounted } from 'vue'
import avatarImage from '@/assets/source/avatar.gif'
import { debounce } from '@/utils/debounce'
import { useUserStore } from '@/stores/user'

// 用户状态
const userStore = useUserStore()

// 控制卡片显示
const showCard = ref(false)

// 搜索相关
const searchValue = ref('')

const search = debounce(() => {
  console.log(searchValue.value)
}, 300)

// GitHub 登录配置
const GITHUB_CLIENT_ID = 'Ov23liSXz8pI9Z4PcnnO'

// GitHub 登录
const handleGithubLogin = () => {
  const redirectUri = `${window.location.origin}/callback`
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`
  window.location.href = authUrl
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
}

// 初始化时恢复用户信息
onMounted(() => {
  userStore.restoreUserInfo()
  console.log('用户信息:', userStore.userInfo)
  console.log('是否登录:', userStore.isLoggedIn)
  console.log('头像URL:', userStore.userInfo?.avatar_url)
})
</script>

<style scoped lang="scss">
.search-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/source/kon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
  .top-nav {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 20px;
    // background: white;
    // border-radius: 50px;
    // box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    // padding: 0 5px 0 20px;
    // transition: all 0.3s ease;
    // border: 2px solid transparent;
    .avatar-wrapper {
      position: relative;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        object-fit: cover;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border-color 0.3s;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &:hover {
          border-color: #409eff;
        }
      }

      .user-card {
        position: absolute;
        top: 55px;
        right: 0;
        width: 280px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        padding: 20px;
        z-index: 100;

        .user-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;

          .user-card-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
          }

          .user-card-info {
            flex: 1;

            .user-card-name {
              font-size: 16px;
              font-weight: 600;
              color: #333;
            }

            .user-card-email {
              font-size: 12px;
              color: #909399;
              margin-top: 4px;
            }
          }
        }

        .user-card-bio {
          font-size: 13px;
          color: #666;
          line-height: 1.5;
          padding: 10px 0;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }

        .user-card-actions {
          margin-top: 12px;

          .logout-btn {
            width: 100%;
            padding: 10px;
            border: none;
            background: #f56c6c;
            color: white;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.3s;

            &:hover {
              background: #f78989;
            }
          }
        }

        .login-prompt {
          text-align: center;

          .login-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
          }

          .login-desc {
            font-size: 13px;
            color: #909399;
            margin-bottom: 16px;
          }

          .github-login-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 12px;
            border: none;
            background: #24292e;
            color: white;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.3s;

            .github-icon {
              width: 20px;
              height: 20px;
            }

            &:hover {
              background: #3a3f44;
            }
          }
        }
      }
    }

    &:focus-within {
      // box-shadow: 0 6px 20px rgba(64, 158, 255, 0.2);
      // border-color: #a0cfff;
    }
  }
  .search-box {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 500px;
    height: 50px;
    background: white;
    border-radius: 50px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    padding: 0 5px 0 20px;
    transition: all 0.3s ease;
    border: 2px solid transparent;

    &:focus-within {
      box-shadow: 0 6px 20px rgba(64, 158, 255, 0.2);
      border-color: #a0cfff;
    }
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    color: #909399;
  }

  .search-icon {
    width: 20px;
    height: 20px;
    color: #04225f;
  }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px;
    color: #333;
    background: transparent;

    &::placeholder {
      color: #c0c4cc;
    }
  }

  .search-btn {
    height: 40px;
    padding: 0 25px;
    border: none;
    background: #409eff;
    color: white;
    border-radius: 40px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: #66b1ff;
    }

    &:active {
      background: #3a8ee6;
    }
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
