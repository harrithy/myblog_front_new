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
        <UserCard :visible="showCard" />
      </div>
    </div>
    <SearchBox @search="handleSearch" />
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

// 用户状态
const userStore = useUserStore()

// 控制卡片显示
const showCard = ref(false)

const handleSearch = (value: string) => {
  console.log('搜索内容:', value)
}

// 初始化时恢复用户信息
onMounted(() => {
  userStore.restoreUserInfo()
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
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 20px;
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

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        &:hover {
          transform: scale(1.1) rotate(5deg);
          border-color: #ffb6c1; // 浅粉色
          box-shadow: 0 0 20px rgba(255, 182, 193, 0.6); // 粉色梦幻光晕

          img {
            transform: scale(1.1);
          }
        }
      }
    }
  }
}
</style>
