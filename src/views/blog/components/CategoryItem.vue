<template>
  <div class="flex flex-col">
    <div
      class="relative cursor-pointer rounded-xl px-5 py-3 transition-all duration-200"
      :class="
        isActive
          ? 'bg-gradient-to-r from-[#4a9ff5] to-[#7ec4ff] text-white'
          : 'text-[rgb(13,18,27)] hover:bg-[rgba(26,115,232,0.08)] hover:text-[#1a73e8]'
      "
      @click="handleClick"
    >
      <span
        class="text-sm leading-6"
        :class="isActive ? 'font-semibold text-white' : 'font-medium text-[rgb(13,18,27)]'"
      >
        {{ category.name }}
      </span>
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
