<template>
  <div class="blog-detail-container">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <button class="back-btn" @click="goBack">
        <span class="icon">←</span>
        <span class="text">返回</span>
      </button>
    </div>

    <!-- 加载动画 -->
    <div v-if="loading" class="loading-wrapper">
      <LoadingAnimation />
    </div>

    <!-- 文章内容 -->
    <div v-else-if="article" class="article-wrapper">
      <!-- 头部信息 -->
      <header class="article-header">
        <div class="meta-info">
          <span class="category" v-if="article.category">{{ article.category }}</span>
          <span class="date">{{ formatDate(article.created_at) }}</span>
        </div>
        <h1 class="title">{{ article.title }}</h1>
        <div class="description" v-if="article.description">
          {{ article.description }}
        </div>
      </header>

      <!-- 分隔线 -->
      <div class="divider"></div>

      <!-- Markdown 内容 -->
      <article class="markdown-body" v-html="renderedContent"></article>
    </div>

    <!-- 错误/空状态 -->
    <div v-else class="error-wrapper">
      <div class="error-card">
        <h3>未找到文章</h3>
        <p>文章可能已被删除或搬家了喵~</p>
        <button class="back-home-btn" @click="goHome">回到首页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'BlogDetail',
})

import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import categoryApi from '@/api/category'
import LoadingAnimation from '@/components/LoadingAnimation.vue'
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

// 初始化 markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
})

// 渲染 Markdown
const renderedContent = computed(() => {
  return md.render(content.value || '')
})

// 将外部URL转换为代理URL（与 BlogIndex.vue 保持一致）
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

    const res = (await categoryApi.getCategoryById(id)) as { data?: ArticleDetail } & ArticleDetail
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
  router.back()
}

const goHome = () => {
  router.push('/')
}

onMounted(() => {
  fetchArticle()
})
</script>

<style scoped lang="scss">
.blog-detail-container {
  min-height: 100vh;
  background-image: url('@/assets/source/kon.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  padding: 80px 20px 40px;
  display: flex;
  justify-content: center;
}

.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 40px;
  z-index: 100;

  .back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.8);
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &:hover {
      background: white;
      transform: translateX(-5px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
      color: #ff9a9e;
    }

    .icon {
      font-size: 18px;
    }
  }
}

.article-wrapper {
  width: 100%;
  max-width: 900px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px 60px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: slide-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);

  @media (max-width: 768px) {
    padding: 24px;
  }
}

.article-header {
  margin-bottom: 30px;
  text-align: center;

  .meta-info {
    display: flex;
    justify-content: center;
    gap: 16px;
    color: #666;
    font-size: 14px;
    margin-bottom: 16px;

    .category {
      background: rgba(255, 154, 158, 0.15);
      color: #ff9a9e;
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: 600;
    }
  }

  .title {
    font-size: 32px;
    color: #333;
    margin-bottom: 16px;
    line-height: 1.4;
    font-weight: 700;
  }

  .description {
    color: #666;
    font-size: 16px;
    line-height: 1.6;
    max-width: 80%;
    margin: 0 auto;
    font-style: italic;
  }
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
  margin: 0 0 40px;
}

.markdown-body {
  color: #333;
  line-height: 1.8;
  font-size: 16px;

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }

  :deep(h1) {
    font-size: 2em;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }
  :deep(h2) {
    font-size: 1.5em;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }
  :deep(h3) {
    font-size: 1.25em;
  }

  :deep(p) {
    margin-top: 0;
    margin-bottom: 16px;
  }

  :deep(code) {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  }

  :deep(pre) {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 6px;
    margin-bottom: 16px;

    code {
      background-color: transparent;
      padding: 0;
    }
  }

  :deep(blockquote) {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
    margin: 0 0 16px 0;
  }

  :deep(img) {
    max-width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin: 16px 0;
  }

  :deep(a) {
    color: #ff9a9e;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 2em;
    margin-bottom: 16px;
  }
}

.error-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;

  .error-card {
    background: rgba(255, 255, 255, 0.9);
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

    h3 {
      margin-bottom: 10px;
      color: #333;
    }

    p {
      color: #666;
      margin-bottom: 20px;
    }

    .back-home-btn {
      background: #ff9a9e;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;

      &:hover {
        background: #ff8087;
        transform: translateY(-2px);
      }
    }
  }
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
</style>
