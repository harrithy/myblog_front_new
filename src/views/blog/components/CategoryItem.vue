<template>
  <div class="category-item-wrapper">
    <div
      class="nav-item"
      :class="{
        active: activeId === category.id,
        expanded: isExpanded,
        'is-folder': category.type === 'folder',
      }"
      :style="{ paddingLeft: `${16 + depth * 16}px` }"
      @click="handleClick"
    >
      <span class="nav-icon">{{
        category.type === 'folder' ? (isExpanded ? '📂' : '📁') : '📄'
      }}</span>
      <span class="nav-text">{{ category.name }}</span>
      <span v-if="category.type !== 'folder'" class="nav-dot"></span>
      <span v-else class="folder-arrow" :class="{ rotated: isExpanded }">›</span>
    </div>

    <!-- 递归渲染子分类 -->
    <div v-if="isExpanded && children.length > 0" class="children-list">
      <CategoryItem
        v-for="child in children"
        :key="child.id"
        :category="child"
        :depth="depth + 1"
        :active-id="activeId"
        :expanded-ids="expandedIds"
        :children-map="childrenMap"
        @select="(cat) => emit('select', cat)"
        @toggle="(cat) => emit('toggle', cat)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 类型定义
export interface Category {
  id: number
  name: string
  type: string
  created_at: string
  sort_order: number
  updated_at: string
  url?: string // 文章类型时的Markdown文件URL
}

const props = defineProps<{
  category: Category
  depth: number
  activeId: number | null
  expandedIds: number[]
  childrenMap: Record<number, Category[]>
}>()

const emit = defineEmits<{
  select: [category: Category]
  toggle: [category: Category]
}>()

// 是否展开
const isExpanded = computed(() => props.expandedIds.includes(props.category.id))

// 子分类列表
const children = computed(() => props.childrenMap[props.category.id] || [])

// 点击处理
const handleClick = () => {
  if (props.category.type === 'folder') {
    emit('toggle', props.category)
  } else {
    emit('select', props.category)
  }
}
</script>

<style lang="scss" scoped>
$primary: #e8a0bf;
$primary-light: #f4c7d5;
$secondary: #b4e4d3;
$text-primary: #4a4a4a;
$text-secondary: #8c8c8c;
$bg-hover: rgba(232, 160, 191, 0.1);
$shadow-soft: rgba(232, 160, 191, 0.15);

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  margin-bottom: 4px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: $text-secondary;
  user-select: none;

  &:hover {
    background: $bg-hover;
    color: $primary;
    transform: translateX(2px);
  }

  &.active {
    background: linear-gradient(135deg, rgba($primary, 0.15) 0%, rgba($primary-light, 0.1) 100%);
    color: $primary;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(232, 160, 191, 0.1);

    .nav-text {
      color: $primary;
    }

    .nav-dot {
      opacity: 1;
      transform: scale(1);
    }
  }

  &.is-folder {
    font-weight: 500;
    color: $text-primary;

    &:hover {
      color: $primary;
    }
  }
}

.nav-icon {
  font-size: 16px;
  opacity: 0.8;
}

.nav-text {
  flex: 1;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.nav-dot {
  width: 6px;
  height: 6px;
  background: $primary;
  border-radius: 50%;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
}

.folder-arrow {
  font-size: 16px;
  color: $text-secondary;
  transition: transform 0.3s ease;
  opacity: 0.6;

  &.rotated {
    transform: rotate(90deg);
  }
}

.children-list {
  animation: slideDown 0.3s ease-out;
  transform-origin: top;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px) scaleY(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
}
</style>
