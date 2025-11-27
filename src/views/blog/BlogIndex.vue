<template>
  <div class="blog-layout">
    <!-- 左侧导航 -->
    <aside class="blog-sidebar-left">
      <nav class="category-nav">
        <ul class="category-list">
          <li
            v-for="(item, index) in categories"
            :key="index"
            class="category-item"
            :class="{ active: currentCategory === item.id }"
            @click="currentCategory = item.id"
          >
            <span class="category-name">{{ item.name }}</span>
            <span class="category-arrow" v-if="item.children">▶</span>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- 中间内容 -->
    <main class="blog-main-content" v-loading="loading">
      <article class="blog-article" v-if="detail">
        <header class="article-header">
          <h1 class="article-title">{{ detail.title }}</h1>
          <div class="article-meta">
            <span class="author">
              <i class="iconfont icon-user"></i> {{ detail.author || '千古壹号' }}
            </span>
          </div>
        </header>

        <div class="article-body">
          <div v-if="detail.description" class="article-description">
            <p>{{ detail.description }}</p>
          </div>

          <transition name="fade" mode="out-in">
            <MarkdownRenderer
              v-if="content"
              ref="markdownRef"
              class="markdown-content"
              :content="content"
            />
            <div v-else class="loading-state">
              <div class="spinner"></div>
              <p>正在加载内容...</p>
            </div>
          </transition>
        </div>
      </article>

      <!-- 空状态 -->
      <div class="empty-state" v-else-if="!loading">
        <p>暂无内容</p>
      </div>
    </main>

    <!-- 右侧目录 -->
    <aside class="blog-sidebar-right">
      <div class="toc-container" v-if="toc.length > 0">
        <ul class="toc-list">
          <li
            v-for="(item, index) in toc"
            :key="index"
            class="toc-item"
            :class="{ ['toc-level-' + item.level]: true, active: activeHeading === item.id }"
            @click="scrollToHeading(item.id)"
          >
            {{ item.text }}
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import type { BlogDetail } from '@/api/blog'
import { blogApi } from '@/api'

// ==================== Types ====================
interface Category {
  id: string
  name: string
  children?: Category[]
}

interface TocItem {
  id: string
  text: string
  level: number
}

// ==================== State ====================
const detail = ref<BlogDetail | null>(null)
const content = ref('')
const loading = ref(false)
const markdownRef = ref(null)
const toc = ref<TocItem[]>([])
const activeHeading = ref('')
const currentCategory = ref('03') // Default active category

// Mock Categories based on user image
const categories = ref<Category[]>([
  { id: '00', name: '00-前端工具' },
  { id: '01', name: '01-HTML' },
  { id: '02', name: '02-CSS基础' },
  { id: '03', name: '03-CSS进阶' },
  { id: '04', name: '04-JavaScript基础' },
  { id: '05', name: '05-JavaScript基础：ES6语法' },
  { id: '06', name: '06-JavaScript基础：异步编程' },
  { id: '07', name: '07-JavaScript进阶' },
  { id: '08', name: '08-前端基本功：CSS和DOM练习' },
  { id: '09', name: '09-移动Web开发' },
  { id: '10', name: '10-MySQL数据库' },
  { id: '11', name: '11-Node.js' },
  { id: '12', name: '12-Vue基础' },
  { id: '13', name: '13-React基础' },
])

// ==================== API Calls ====================
const fetchBlogContent = async (url: string): Promise<void> => {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed: ${response.status}`)
    content.value = await response.text()
  } catch (error) {
    console.error('Failed to fetch content:', error)
    content.value = ''
    ElMessage.error('获取正文失败')
  }
}

const fetchBlogDetail = async (): Promise<void> => {
  loading.value = true
  try {
    const data = await blogApi.getBlogDetail(1)
    detail.value = data as BlogDetail
    if (detail.value.url) {
      await fetchBlogContent(detail.value.url)
    }
  } catch (error) {
    console.error('Failed detail:', error)
    ElMessage.error('获取详情失败')
  } finally {
    loading.value = false
  }
}

// ==================== Logic ====================
// Generating TOC and handling scroll
const generateTOC = () => {
  toc.value = []
  const headings = document.querySelectorAll(
    '.markdown-content h1, .markdown-content h2, .markdown-content h3',
  )

  headings.forEach((heading, index) => {
    const id = `heading-${index}`
    heading.id = id
    toc.value.push({
      id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1)),
    })
  })
}

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeHeading.value = id
  }
}

// Watch content change to regenerate TOC
watch(content, async () => {
  await nextTick()
  generateTOC()
})

// Setup IntersectionObserver for active heading
onMounted(() => {
  fetchBlogDetail()

  // Simple intersection observer for TOC highlighting
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeHeading.value = entry.target.id
        }
      })
    },
    { rootMargin: '-100px 0px -60% 0px' },
  )

  watch(toc, () => {
    setTimeout(() => {
      document
        .querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content h3')
        .forEach((el) => {
          observer.observe(el)
        })
    }, 100)
  })
})
</script>

<style lang="scss" scoped>
.blog-layout {
  display: flex;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fff;
  padding-top: 20px;
}

// Left Sidebar
.blog-sidebar-left {
  width: 280px;
  flex-shrink: 0;
  padding: 20px;
  border-right: 1px solid #eee;
  height: calc(100vh - 20px);
  position: sticky;
  top: 20px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 2px;
  }
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #333;
  border-radius: 4px;
  transition: background-color 0.2s;
  margin-bottom: 4px;

  &:hover {
    background-color: #f5f5f5;
    color: #42b983; // Vue green theme or matching user style
  }

  &.active {
    color: #42b983;
    background-color: #e8f5e9;
    font-weight: 600;
  }
}

.category-arrow {
  font-size: 10px;
  color: #999;
}

// Main Content
.blog-main-content {
  flex: 1;
  padding: 20px 60px;
  max-width: 900px; // Limit line length for readability
  margin: 0 auto;
}

.article-header {
  margin-bottom: 40px;
  text-align: center;
}

.article-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.article-meta {
  color: #999;
  font-size: 14px;
}

.article-body {
  font-size: 16px;
  line-height: 1.8;
  color: #2c3e50;
}

// Right Sidebar (TOC)
.blog-sidebar-right {
  width: 240px;
  flex-shrink: 0;
  padding: 20px;
  height: calc(100vh - 20px);
  position: sticky;
  top: 20px;
  overflow-y: auto;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-left: 2px solid #eee;
}

.toc-item {
  padding: 4px 16px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  line-height: 1.5;
  position: relative;
  transition: all 0.2s;

  &:hover {
    color: #42b983;
  }

  &.active {
    color: #42b983;
    font-weight: 600;
    border-left: 2px solid #42b983;
    margin-left: -2px; // Overlay the border
  }

  // Indentation for hierarchy
  &.toc-level-2 {
    padding-left: 16px;
  }
  &.toc-level-3 {
    padding-left: 32px;
  }
}

// Responsive
@media (max-width: 1200px) {
  .blog-sidebar-right {
    display: none; // Hide TOC on smaller screens
  }
}

@media (max-width: 900px) {
  .blog-sidebar-left {
    display: none; // Hide Nav on mobile/tablet
  }
  .blog-main-content {
    padding: 20px;
  }
}
</style>
