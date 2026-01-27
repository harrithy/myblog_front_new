<template>
  <aside class="sidebar" v-loading="loading">
    <!-- 头部分类名称 -->
    <div class="sidebar-header">Categories</div>
    <!-- 分类列表 - 使用递归组件支持无限层级 -->
    <nav class="nav-list">
      <CategoryItem
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :depth="0"
        :active-id="activeId"
        :expanded-ids="expandedIds"
        :children-map="childrenMap"
        @select="handleArticleSelect"
      />
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { categoryApi } from '@/api'
import CategoryItem from './CategoryItem.vue'
// 导入分类类型定义
import type { Category } from '@/types/Category'

// 事件
const emit = defineEmits<{
  select: [category: Category]
}>()

// 状态
const categories = ref<Category[]>([])
const loading = ref(false)
const activeId = ref<number | null>(null)
const expandedIds = ref<number[]>([]) // 已展开的文件夹id列表
const childrenMap = ref<Record<number, Category[]>>({}) // 子分类缓存 { parentId: children[] }

// 处理文章选择, 把url传给父组件
const handleArticleSelect = (category: Category) => {
  activeId.value = category.id
  emit('select', category)
}

// 获取分类列表
const fetchCategories = async () => {
  loading.value = true
  try {
    const data = await categoryApi.getCategories()
    categories.value = data as Category[]
    // 默认选中第一个分类
    if (categories.value.length > 0) {
      handleArticleSelect(categories.value[0])
    }
  } catch (e) {
    console.error('Failed to load categories', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style lang="scss" scoped>
$primary: #e8a0bf;
$primary-light: #f4c7d5;
$secondary: #b4e4d3;
$text-primary: #4a4a4a;
$text-secondary: #8c8c8c;
$glass-bg: rgba(255, 255, 255, 0.6);
$border-color: rgba(255, 255, 255, 0.5);
$shadow-soft: 0 8px 32px 0 rgba(31, 38, 135, 0.05);

.sidebar {
  display: flex;
  flex-direction: column;
  margin-top: 64px;
  min-width: 256px;
}

// 头部
.sidebar-header {
  padding: 20px 20px 0px 20px;
  opacity: 0.6;
  --tw-text-opacity: 1;
  color: rgb(13 18 27 / var(--tw-text-opacity, 1));
  letter-spacing: 0.05em;
  line-height: 1.5;
  font-weight: 700;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px;
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba($primary, 0.05);

    .avatar-container .avatar-ring {
      transform: scale(1.1);
      opacity: 1;
    }

    .logo-text {
      font-size: 28px;
    }
  }
}

.avatar-container {
  position: relative;
  width: 52px;
  height: 52px;

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    position: relative;
    z-index: 2;
    border: 2px solid white;
    box-shadow: 0 4px 12px rgba($primary, 0.2);
  }

  .avatar-ring {
    position: absolute;
    top: -2px;
    left: -2px;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, $primary, $secondary);
    z-index: 1;
    opacity: 0.8;
    transition: all 0.3s ease;
    animation: ring-pulse 3s ease-in-out infinite;
  }
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.logo-text {
  font-family: 'Pacifico', cursive;
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 1px;
  background: linear-gradient(135deg, $text-primary, $primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: $text-secondary;

  .status-dot {
    width: 6px;
    height: 6px;
    background: $secondary;
    border-radius: 50%;
    animation: status-blink 2s ease-in-out infinite;
  }
}

// 导航列表
.nav-list {
  flex: 1;
  padding: 24px 16px;
  overflow-y: auto;
  color: rgb(13 18 27 / var(--tw-text-opacity, 1));
}
</style>
