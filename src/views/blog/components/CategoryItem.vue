<template>
  <div class="category-item-wrapper">
    <div
      class="nav-item"
      :class="{ active: activeId === category.id, expanded: isExpanded }"
      :style="{ paddingLeft: `${16 + depth * 16}px` }"
      @click="handleClick"
    >
      <span class="nav-text">{{ category.name }}</span>
      <span class="nav-dot"></span>
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
$accent: #ffd6a5;
$text-primary: #5d4e60;
$text-secondary: #9b8a9e;
$shadow-soft: rgba(232, 160, 191, 0.15);

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 4px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;

  &:hover {
    background: linear-gradient(135deg, rgba($primary, 0.1) 0%, rgba($secondary, 0.1) 100%);
    transform: translateX(2px);
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

.nav-text {
  flex: 1;
  font-size: 14px;
  color: $text-secondary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s ease;
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
</style>
