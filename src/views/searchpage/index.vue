<template>
  <div class="search-container">
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
import { ref } from 'vue'
import { debounce, throttle } from '@/utils/debounce'

const searchValue = ref('')

const search = debounce(() => {
  console.log(searchValue.value)
}, 300)
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
</style>
