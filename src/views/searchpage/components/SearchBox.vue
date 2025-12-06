<template>
  <div class="search-container-inner">
    <div class="logo-text">harrio</div>
    <div class="search-box">
      <div class="icon-wrapper">
        <svg-icon name="search" class="search-icon" />
      </div>
      <input
        type="text"
        v-model="keyword"
        placeholder="Type to search..."
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <button class="search-btn" @click="handleSearch">Search</button>
    </div>
    <SearchResultList :results="searchResults" @item-click="handleItemClick" />
  </div>
</template>

<script setup lang="ts">
// 组件名字
defineOptions({
  name: 'SearchBox',
})
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from '@/utils/debounce'
import { categoryApi } from '@/api'
import SearchResultList, { type SearchResult } from './SearchResultList.vue'
import gsap from 'gsap'

const router = useRouter()

// 定义关键词
const keyword = ref('')
// 搜索结果
const searchResults = ref<SearchResult[]>([])

// 搜索请求（带防抖）
const searchCategories = debounce(async (value: string) => {
  if (!value.trim()) {
    searchResults.value = []
    return
  }
  const params = { keyword: value }
  const res = await categoryApi.getCategories(params)
  searchResults.value = (res as SearchResult[]) || []
}, 500)

// 监听关键词变化
watch(keyword, (newVal) => {
  searchCategories(newVal)
})

// 监听搜索结果数量，触发动画
watch(
  () => searchResults.value.length,
  (newLen, oldLen) => {
    // 有结果且之前无结果 -> 进入搜索模式
    if (newLen > 0 && oldLen === 0) {
      // 1. Logo 消失
      gsap.to('.logo-text', {
        opacity: 0,
        height: 0,
        marginTop: 0,
        marginBottom: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set('.logo-text', { display: 'none' })
        },
      })

      // 2. 容器整体上移
      gsap.to('.search-container-inner', {
        marginTop: '90px', // 留出顶部导航栏的空间
        duration: 0.6,
        ease: 'power2.inOut',
      })
    }
    // 无结果且之前有结果 -> 退出搜索模式
    else if (newLen === 0 && oldLen > 0) {
      gsap.set('.logo-text', { display: 'block' })

      // 1. Logo 恢复
      gsap.to('.logo-text', {
        opacity: 1,
        height: 'auto', // GSAP 会自动计算高度
        marginTop: 0, // 恢复之前的样式如果需要
        duration: 0.6,
        ease: 'power2.inOut',
      })

      // 2. 容器恢复位置
      gsap.to('.search-container-inner', {
        marginTop: '100px', // 恢复初始 margin-top
        duration: 0.6,
        ease: 'power2.inOut',
      })
    }
  },
)

// 手动搜索（点击按钮或回车）
const handleSearch = () => {
  searchCategories(keyword.value)
}

// 点击搜索结果项
const handleItemClick = (item: SearchResult) => {
  if (item.type === 'article' && item.url) {
    // 跳转到文章详情页
    router.push({ path: '/blog', query: { id: item.id } })
  } else if (item.type === 'folder') {
    // 跳转到博客列表并展开该文件夹
    router.push({ path: '/bloglist', query: { folderId: item.id } })
  }
}
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

  // 吸顶效果
  position: sticky;
  top: 80px;
  z-index: 900;

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
