<template>
  <div class="blog-detail-container">
    <!-- 阅读进度条 (顶部固定) -->
    <div class="fixed-progress-bar">
      <div class="progress-fill" :style="{ width: scrollProgress + '%' }"></div>
    </div>

    <div class="main-layout">
      <!-- 主要内容区 -->
      <main class="content-area">
        <!-- 加载动画 -->
        <div v-if="loading" class="loading-wrapper">
          <LoadingAnimation />
        </div>

        <!-- 文章内容 -->
        <div v-else-if="article" class="article-wrapper">
          <!-- 顶部操作栏 (文章内部) -->
          <div class="article-actions">
            <button class="action-btn back-btn" @click="goBack">
              <span class="icon">←</span>
              <span class="text">返回列表</span>
            </button>

            <div class="right-actions">
              <div class="tooltip-wrapper" data-tooltip="回到首页">
                <button class="action-btn icon-btn" @click="goHome">
                  <span class="icon">🏠</span>
                </button>
              </div>
              <div class="tooltip-wrapper" data-tooltip="分享文章">
                <button class="action-btn icon-btn" @click="shareArticle">
                  <span class="icon">🔗</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 头部信息 -->
          <header class="article-header">
            <div class="meta-info">
              <span class="category" v-if="article.category">
                <span class="category-icon">🏷️</span>
                {{ article.category }}
              </span>
              <span class="date">
                <span class="date-icon">📅</span>
                {{ formatDate(article.created_at) }}
              </span>
            </div>
            <h1 class="title">{{ article.title }}</h1>
            <div class="description" v-if="article.description">
              {{ article.description }}
            </div>
          </header>

          <!-- 分隔线 -->
          <div class="divider"></div>

          <!-- Markdown 内容 -->
          <article class="markdown-content">
            <MarkdownRenderer :content="content" />
          </article>

          <!-- 评论区 -->
          <div class="comment-wrapper">
            <CommentSection v-if="article" :article-id="article.id" />
          </div>
        </div>

        <!-- 错误/空状态 -->
        <div v-else class="error-wrapper">
          <div class="error-card">
            <div class="error-emoji">😕</div>
            <h3>未找到文章</h3>
            <p>文章可能已被删除或搬家了喵~</p>
            <button class="back-home-btn" @click="goHome">回到首页</button>
          </div>
        </div>
      </main>

      <!-- 右侧目录 (仅在有文章且不加载时显示) -->
      <!-- <aside class="toc-aside" v-if="article && !loading">
        <TableOfContents :content="content" />
      </aside> -->
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'BlogDetail',
})

import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import categoryApi from '@/api/category'
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
// import TableOfContents from './components/TableOfContents.vue'
import CommentSection from './components/CommentSection.vue'
import { useLoading } from '@/composables/useLoading'

const route = useRoute()
const router = useRouter()
const { startLoading, stopLoading } = useLoading()

interface ArticleDetail {
  id: number
  title: string
  url?: string
  content?: string
  category?: string
  description?: string
  created_at: string
  updated_at: string
  author?: string
}

const loading = ref(true)
const article = ref<ArticleDetail | null>(null)
const content = ref('')
const scrollProgress = ref(0)

// 将外部URL转换为代理URL
const getProxiedUrl = (url: string): string => {
  const imageHost = 'https://image.harrio.xyz'
  if (url.startsWith(imageHost)) {
    return url.replace(imageHost, '/image-proxy')
  }
  return url
}

// 获取文章详情
const fetchArticle = async () => {
  const id = Number(route.query.id)
  if (!id) {
    loading.value = false
    return
  }

  try {
    startLoading()
    loading.value = true

    const res = (await categoryApi.getCategoryById(id)) as unknown as {
      data?: ArticleDetail
    } & ArticleDetail
    article.value = res.data || res

    if (article.value?.url) {
      const textRes = await fetch(getProxiedUrl(article.value.url))
      if (textRes.ok) {
        content.value = await textRes.text()
      } else {
        content.value = '> 获取文章内容失败喵...'
      }
    } else {
      content.value = article.value?.content || '> 文章内容为空喵...'
    }
  } catch (error) {
    console.error('获取文章详情失败:', error)
  } finally {
    loading.value = false
    stopLoading()
  }
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/bloglist')
  }
}

const goHome = () => {
  router.push('/')
}

const shareArticle = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板！')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 滚动处理
const handleScroll = () => {
  // 计算阅读进度
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value =
    docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0
}

onMounted(() => {
  fetchArticle()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
// 配色系统 - 莫兰迪色系
$primary: #e8a0bf;
$primary-light: #f4c7d5;
$primary-dark: #d48aa7;
$text-primary: #4a4a4a;
$text-secondary: #8c8c8c;
$glass-bg: rgba(255, 255, 255, 0.9);
$glass-border: rgba(255, 255, 255, 0.6);
$shadow-soft: 0 8px 32px 0 rgba(31, 38, 135, 0.07);

.blog-detail-container {
  min-height: 100vh;
  // 保持原有背景
  background-image: url('@/assets/source/kon.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  padding-top: 40px;
}

// 固定在顶部的进度条
.fixed-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  z-index: 1000;
  backdrop-filter: blur(2px);

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, $primary-light, $primary);
    transition: width 0.1s linear;
    border-radius: 0 2px 2px 0;
    box-shadow: 0 0 10px rgba($primary, 0.5);
  }
}

// 主布局
.main-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 40px;
  display: flex;
  gap: 32px;
  justify-content: center;
  align-items: flex-start;
}

// 内容区域
.content-area {
  flex: 1;
  width: 100%;
  max-width: 860px;
  min-width: 0; // 防止flex子项溢出
}

// 通用卡片样式
@mixin glass-card {
  background: $glass-bg;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid $glass-border;
  border-radius: 24px;
  box-shadow: $shadow-soft;
}

.article-wrapper {
  @include glass-card;
  padding: 48px 64px;
  animation: slide-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  position: relative;
}

// 文章内部操作栏
.article-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px dashed rgba($primary, 0.2);

  .action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: none;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.5);
    color: $text-secondary;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: $primary;
      color: white;
      transform: translateX(-2px);
      box-shadow: 0 4px 12px rgba($primary, 0.2);
    }

    .icon {
      font-size: 16px;
      line-height: 1;
    }
  }

  .right-actions {
    display: flex;
    gap: 12px;
  }

  // Tooltip 样式
  .tooltip-wrapper {
    position: relative;

    &:hover {
      &::before,
      &::after {
        opacity: 1;
        visibility: visible;
        transform: translate(-50%, -8px);
      }
    }

    // Tooltip 箭头
    &::after {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translate(-50%, 0);
      border: 6px solid transparent;
      border-top-color: rgba(74, 74, 74, 0.9);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      pointer-events: none;
      margin-bottom: -1px;
    }

    // Tooltip 内容
    &::before {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translate(-50%, 0);
      padding: 6px 12px;
      background: rgba(74, 74, 74, 0.9);
      color: white;
      font-size: 12px;
      white-space: nowrap;
      border-radius: 6px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      pointer-events: none;
      margin-bottom: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      font-weight: 500;
    }
  }

  .icon-btn {
    padding: 0;
    width: 40px;
    height: 40px;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.8);

    .icon {
      font-size: 18px;
      transition: transform 0.3s ease;
    }

    &:hover {
      background: linear-gradient(135deg, $primary-light, $primary);
      border-color: transparent;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba($primary, 0.3);

      .icon {
        transform: scale(1.1);
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba($primary, 0.2);
    }
  }
}

.article-header {
  margin-bottom: 32px;
  text-align: center;

  .meta-info {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;
    color: $text-secondary;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .category,
  .date {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.6);
    padding: 6px 12px;
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
  }

  .category {
    color: $primary;
    background: rgba($primary, 0.1);
  }

  .title {
    font-size: 36px;
    color: $text-primary;
    margin-bottom: 24px;
    line-height: 1.4;
    font-weight: 800;
    letter-spacing: -0.5px;
    word-break: break-word;
  }

  .description {
    color: $text-secondary;
    font-size: 16px;
    line-height: 1.8;
    max-width: 90%;
    margin: 0 auto;
    font-style: italic;
    background: rgba(255, 255, 255, 0.5);
    padding: 20px;
    border-radius: 16px;
    border-left: 4px solid $primary-light;
  }
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.06), transparent);
  margin: 32px 0 40px;
}

.comment-wrapper {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

// 错误状态
.error-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;

  .error-card {
    @include glass-card;
    padding: 60px;
    text-align: center;
    max-width: 400px;
    width: 90%;

    .error-emoji {
      font-size: 64px;
      margin-bottom: 24px;
      animation: float 3s ease-in-out infinite;
    }

    h3 {
      font-size: 24px;
      margin-bottom: 12px;
      color: $text-primary;
    }

    p {
      color: $text-secondary;
      margin-bottom: 32px;
    }

    .back-home-btn {
      background: $primary;
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 24px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
      box-shadow: 0 4px 12px rgba($primary, 0.3);

      &:hover {
        background: $primary-dark;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba($primary, 0.4);
      }
    }
  }
}

// 右侧目录
.toc-aside {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 40px; // Adjusted since no header
  height: fit-content;
  max-height: calc(100vh - 60px);
  animation: fade-in 0.8s ease-out;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

// 响应式设计优化
@media (max-width: 1200px) {
  .toc-aside {
    display: none;
  }

  .content-area {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .blog-detail-container {
    padding-top: 20px;
  }

  .main-layout {
    padding: 16px;
  }

  .article-wrapper {
    padding: 24px 20px;
    border-radius: 20px;
  }

  .article-actions {
    margin-bottom: 16px;
    padding-bottom: 16px;

    .action-btn {
      padding: 6px 12px;
      font-size: 13px;
    }

    .icon-btn {
      width: 32px;
      height: 32px;
    }
  }

  .article-header {
    margin-bottom: 24px;

    .title {
      font-size: 24px;
      margin-bottom: 16px;
    }

    .meta-info {
      gap: 12px;
      font-size: 12px;
    }

    .description {
      font-size: 14px;
      padding: 16px;
      margin-top: 16px;
    }
  }

  .error-wrapper .error-card {
    padding: 40px 24px;
  }
}
</style>
