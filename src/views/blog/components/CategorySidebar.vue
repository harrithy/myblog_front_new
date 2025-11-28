<template>
  <aside class="sidebar" v-loading="loading">
    <!-- 头部 -->
    <div class="sidebar-header">
      <div class="logo-wrapper">
        <span class="logo-text">harrioの个人blog</span>
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

    <!-- 底部装饰 -->
    <div class="sidebar-footer">
      <div class="footer-text">✨ 记录美好生活</div>
    </div>
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
      const data = await categoryApi.getCategories({ parent_id: category.id })
      console.log('获取子分类列表', data)
      childrenMap.value[category.id] = data as Category[]
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
  const data = await categoryApi.getCategories()
  console.log('获取分类列表', data)
  categories.value = data as Category[]
  loading.value = false
}

onMounted(() => {
  fetchCategories()
})
</script>

<style lang="scss" scoped>
// 温馨配色
$primary: #e8a0bf;
$primary-light: #f4c7d5;
$secondary: #b4e4d3;
$accent: #ffd6a5;
$text-primary: #5d4e60;
$text-secondary: #9b8a9e;
$border-color: rgba(232, 160, 191, 0.2);
$shadow-soft: rgba(232, 160, 191, 0.15);

.sidebar {
  width: 260px;
  min-width: 260px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-right: 1px solid $border-color;
  box-shadow: 4px 0 24px $shadow-soft;
}

// 头部
.sidebar-header {
  padding: 28px 20px;
  border-bottom: 1px dashed $border-color;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: $text-primary;
  letter-spacing: 1px;
}

// 导航列表
.nav-list {
  flex: 1;
  padding: 20px 16px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: $primary-light;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  margin-bottom: 8px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  position: relative;
  animation: fadeInUp 0.5s ease-out backwards;
  animation-delay: var(--delay);

  &:hover {
    background: linear-gradient(135deg, rgba($primary, 0.1) 0%, rgba($secondary, 0.1) 100%);
    transform: translateX(4px);
  }

  &.active {
    background: linear-gradient(135deg, rgba($primary, 0.2) 0%, rgba($primary-light, 0.15) 100%);
    box-shadow: 0 4px 16px $shadow-soft;

    .nav-text {
      color: $text-primary;
      font-weight: 600;
    }

    .nav-dot {
      opacity: 1;
      transform: scale(1);
    }
  }
}
.nav-icon {
  font-size: 14px;
  width: 16px;
  flex-shrink: 0;
}

.nav-text {
  flex: 1;
  font-size: 14px;
  color: $text-secondary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s ease;
}

// 子分类列表
.children-list {
  padding-left: 16px;

  &.nested {
    padding-left: 16px;
  }
}

.child-item {
  padding: 10px 12px;
  margin-bottom: 4px;

  .nav-text {
    font-size: 13px;
  }
}

.nav-dot {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, $primary 0%, $accent 100%);
  border-radius: 50%;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
}

// 底部
.sidebar-footer {
  padding: 20px;
  border-top: 1px dashed $border-color;
  text-align: center;
}

.footer-text {
  font-size: 13px;
  color: $text-secondary;
  letter-spacing: 0.5px;
}

// 动画
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式
@media (max-width: 768px) {
  .sidebar {
    width: 72px;
    min-width: 72px;
  }
  .logo-text,
  .nav-text,
  .footer-text {
    display: none;
  }
  .nav-item {
    justify-content: center;
    padding: 14px;
  }
  .sidebar-header {
    padding: 20px;
    .logo-wrapper {
      justify-content: center;
    }
  }
}
</style>
