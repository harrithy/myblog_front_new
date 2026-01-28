<template>
  <div class="category-item-wrapper">
    <div class="nav-item" :class="{ active: isActive }" @click="handleClick">
      <span class="nav-text">{{ category.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Category } from '@/types/Category'

const props = defineProps<{
  category: Category
  depth: number
  activeId: number | null
  expandedIds: number[]
  childrenMap: Record<number, Category[]>
}>()

// 是否激活样式
const isActive = computed(() => props.activeId === props.category.id)

const emit = defineEmits<{
  select: [category: Category]
}>()
// 点击处理，传事件给父组件
const handleClick = () => {
  emit('select', props.category)
}
</script>

<style lang="scss" scoped>
.category-item-wrapper {
  display: flex;
  flex-direction: column;
  .nav-item {
    position: relative;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    padding-left: 1.25rem;
    padding-right: 1rem;
    border-radius: 0.75rem;
    color: rgb(13 18 27 / var(--tw-text-opacity, 1));
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(.active) {
      background-color: rgba(26, 115, 232, 0.08);

      .nav-text {
        color: #1a73e8;
      }
    }

    &.active {
      background: linear-gradient(90deg, #4a9ff5 0%, #7ec4ff 100%);
      color: white;

      // &::before {
      //   content: '';
      //   position: absolute;
      //   left: 8px;
      //   top: 50%;
      //   transform: translateY(-50%);
      //   width: 3px;
      //   height: 16px;
      //   background: white;
      //   border-radius: 2px;
      // }

      .nav-text {
        color: white;
        font-weight: 600;
      }
    }

    .nav-text {
      color: rgb(13 18 27 / var(--tw-text-opacity, 1));
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.5;
    }
  }
}
</style>
