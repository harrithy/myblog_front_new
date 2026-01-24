<template>
  <aside class="sidebar" :class="{ collapsed }" v-loading="loading">
    <!-- 头部 -->
    <div class="sidebar-header">
      <div class="logo-wrapper" @click="toggleCollapse">
        <div class="avatar-container">
          <img src="../../../assets/source/avatar.gif" alt="avatar" />
          <div class="avatar-ring"></div>
        </div>
        <div v-show="!collapsed" class="user-info">
          <span class="logo-text">harrio</span>
        </div>
      </div>
    </div>

    <!-- 分类列表 - 使用递归组件支持无限层级 -->
    <nav v-show="!collapsed" class="nav-list">
      <CategoryItem
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :depth="0"
        :active-id="activeId"
        :expanded-ids="expandedIds"
        :children-map="childrenMap"
        @select="handleArticleSelect"
        @toggle="handleFolderToggle"
      />
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { categoryApi } from '@/api'
import CategoryItem from './CategoryItem.vue'

// 类型定义
export interface Category {
  created_at: string
  id: number
  name: string
  type: string
  sort_order: number
  updated_at: string
  url?: string // 文章类型时的Markdown文件URL
}

// 事件
const emit = defineEmits<{
  select: [category: Category]
}>()

// 折叠状态
const collapsed = ref(false)

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

// 状态
const categories = ref<Category[]>([])
const loading = ref(false)
const activeId = ref<number | null>(null)
const expandedIds = ref<number[]>([]) // 已展开的文件夹id列表
const childrenMap = ref<Record<number, Category[]>>({}) // 子分类缓存 { parentId: children[] }

// 处理文件夹展开/收起
const handleFolderToggle = async (category: Category) => {
  activeId.value = category.id
  const isExpanded = expandedIds.value.includes(category.id)

  if (isExpanded) {
    // 已展开则收起
    expandedIds.value = expandedIds.value.filter((id) => id !== category.id)
  } else {
    // 未展开则展开，并加载子分类
    expandedIds.value.push(category.id)

    // 如果还没有加载过子分类，则请求
    if (!childrenMap.value[category.id]) {
      try {
        const data = await categoryApi.getCategories({ parent_id: category.id })
        console.log('获取子分类列表', data)
        childrenMap.value[category.id] = data as Category[]
      } catch (e) {
        console.error('Failed to load subcategories', e)
      }
    }
  }
}

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
    console.log('获取分类列表', data)
    categories.value = data as Category[]
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
  position: sticky;
  display: flex;
  flex-direction: column;
  z-index: 10;
  width: 280px;
  transition: width 0.3s ease;

  &.collapsed {
    width: 90px;

    .sidebar-header {
      padding: 20px 10px 0px 10px;
    }

    .logo-wrapper {
      justify-content: center;
    }
  }
}

// 头部
.sidebar-header {
  padding: 20px 20px 0px 20px;
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

@keyframes ring-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.6;
  }
}

@keyframes status-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

// 导航列表
.nav-list {
  flex: 1;
  padding: 24px 16px;
  overflow-y: auto;

  // 自定义滚动条
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba($primary, 0.2);
    border-radius: 4px;

    &:hover {
      background: rgba($primary, 0.4);
    }
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

// 响应式
@media (max-width: 768px) {
  .sidebar {
    width: 0;
    min-width: 0;
    overflow: hidden;
    padding: 0;
    border: none;
  }
  // 这里可能需要一个移动端的抽屉式菜单，但目前先隐藏
}
</style>
