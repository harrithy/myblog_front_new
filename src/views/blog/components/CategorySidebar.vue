<template>
  <aside class="sidebar" v-loading="loading">
    <!-- 头部 -->
    <div class="sidebar-header">
      <div class="logo-wrapper">
        <!-- <span class="logo-text">harrioの空间</span> -->
      </div>
    </div>

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
  width: 280px;
  min-width: 280px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  background: $glass-bg;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-right: 1px solid $border-color;
  box-shadow: $shadow-soft;
  z-index: 10;
}

// 头部
.sidebar-header {
  padding: 32px 24px;
  border-bottom: 1px dashed rgba($primary, 0.2);
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(45deg, $primary, $text-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
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
