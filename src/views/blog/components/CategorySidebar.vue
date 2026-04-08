<template>
  <aside
    class="sticky top-16 flex h-[calc(100vh-64px)] min-w-64 flex-col overflow-y-auto"
    v-loading="loading"
  >
    <!-- 头部分类名称 -->
    <div class="px-5 pt-5 text-sm font-bold uppercase tracking-[0.05em] text-[rgb(13,18,27,0.6)]">
      Categories
    </div>
    <p
      v-if="errorMessage"
      class="mx-4 my-4 rounded-[14px] border border-[rgba(251,191,36,0.4)] bg-[rgba(255,247,237,0.96)] px-4 py-[14px] text-[13px] leading-[1.6] text-amber-700"
    >
      {{ errorMessage }}
    </p>
    <p
      v-else-if="!loading && categories.length === 0"
      class="mx-4 my-4 rounded-[14px] border border-[rgba(226,232,240,0.9)] bg-[rgba(255,255,255,0.78)] px-4 py-[14px] text-[13px] leading-[1.6] text-slate-500"
    >
      暂无分类内容
    </p>
    <!-- 分类列表 - 使用递归组件支持无限层级 -->
    <nav v-else class="flex-1 overflow-y-auto px-4 py-6 text-[rgb(13,18,27)]">
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
import type { Category } from '@/types/Category'

const emit = defineEmits<{
  select: [category: Category]
}>()

const categories = ref<Category[]>([])
const loading = ref(false)
const errorMessage = ref('')
const activeId = ref<number | null>(null)
const expandedIds = ref<number[]>([])
const childrenMap = ref<Record<number, Category[]>>({})

const handleArticleSelect = (category: Category) => {
  activeId.value = category.id
  emit('select', category)
}

const fetchCategories = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const data = await categoryApi.getCategories()
    categories.value = data

    if (categories.value.length > 0) {
      handleArticleSelect(categories.value[0])
    }
  } catch (e) {
    categories.value = []
    errorMessage.value = '分类数据暂时不可用，请确认后端服务已启动。'
    console.error('Failed to load categories', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>
