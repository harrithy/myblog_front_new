<template>
  <div class="search-container-inner">
    <div class="logo-text">harrio</div>
    <div class="search-box">
      <div class="icon-wrapper">
        <svg-icon name="search" class="search-icon" />
      </div>
      <input
        type="text"
        v-model="searchValue"
        placeholder="Type to search..."
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <button class="search-btn" @click="handleSearch">Search</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SearchBox',
})

import { ref } from 'vue'
import { debounce } from '@/utils/debounce'

const emit = defineEmits<{
  search: [value: string]
}>()

const searchValue = ref('')

const handleSearch = debounce(() => {
  emit('search', searchValue.value)
}, 300)
</script>

<style scoped lang="scss">
// 引入艺术字体
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

.search-container-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
  // margin-bottom: 400px;
  width: 100%;

  .logo-text {
    font-family: 'Great Vibes', cursive; // 使用艺术字体
    font-size: 120px; // 大字体
    // color: white; // 默认白色
    // margin-bottom: 20px;
    text-shadow: 0 4px 15px rgba(0, 0, 0, 0.15); // 稍微柔和一点的阴影

    // 流光变色背景
    background: linear-gradient(
      -45deg,
      #ff9a9e,
      /* 暖粉 */ #fad0c4,
      /* 蜜桃 */ #ffd1ff,
      /* 亮粉 */ #a18cd1,
      /* 薰衣草紫 */ #ff9a9e /* 回到暖粉 */
    );
    background-size: 300%; // 放大背景以实现流动效果

    -webkit-background-clip: text;
    background-clip: text; // 标准属性
    -webkit-text-fill-color: transparent; // 文字渐变效果
    color: transparent; // 兼容性回退

    letter-spacing: 2px;
    user-select: none; // 防止被选中

    // 组合动画：悬浮 + 变色
    animation:
      float 6s ease-in-out infinite,
      gradientChange 8s ease infinite;
  }
}

.search-box {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 700px;
  height: 56px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5);
  padding: 0 6px 0 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;

  &:focus-within {
    background: rgba(255, 255, 255, 0.95);
    box-shadow:
      0 8px 40px rgba(255, 182, 193, 0.4),
      0 0 0 2px #ffb6c1;
    transform: translateY(-2px);
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    color: #909399;
    transition: color 0.3s;
  }

  &:focus-within .icon-wrapper {
    color: #ff9a9e;
  }

  .search-icon {
    width: 22px;
    height: 22px;
  }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 17px;
    color: #555;
    background: transparent;
    font-weight: 500;

    &::placeholder {
      color: #999;
      font-weight: 400;
    }
  }

  .search-btn {
    height: 44px;
    padding: 0 30px;
    border: none;
    background: linear-gradient(135deg, #ffc3a0 0%, #ffafbd 100%);
    color: white;
    border-radius: 40px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(255, 175, 189, 0.4);

    &:hover {
      background: linear-gradient(135deg, #ffd1b3 0%, #ffc3ce 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(255, 175, 189, 0.5);
    }

    &:active {
      transform: translateY(1px);
      box-shadow: 0 2px 8px rgba(255, 175, 189, 0.4);
    }
  }
}

// 变色动画
@keyframes gradientChange {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

// 悬浮动画
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
