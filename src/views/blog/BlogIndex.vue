<template>
  <div class="blog-layout">
    <!-- 左侧分类导航 -->
    <CategorySidebar @select="handleCategorySelect" />

    <!-- 中间内容区 -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- 未选择文章时显示欢迎卡片 -->
        <div v-if="!currentCategory" class="welcome-card">
          <div class="welcome-content">
            <div class="welcome-emoji">📚</div>
            <h1>欢迎来到我的博客</h1>
            <p>这里记录着技术、生活与思考</p>
            <p class="sub-text">👈 请从左侧选择一篇文章开始阅读</p>
          </div>
          <div class="welcome-decoration">
            <div class="floating-shape shape-1"></div>
            <div class="floating-shape shape-2"></div>
            <div class="floating-shape shape-3"></div>
          </div>
        </div>

        <!-- 加载中状态 -->
        <div v-else-if="loading" class="loading-card">
          <div class="loading-spinner"></div>
          <p>正在加载文章...</p>
        </div>

        <!-- 文章内容 & 评论 -->
        <div v-else class="article-container">
          <article class="article-card">
            <MarkdownRenderer :content="articleContent" />
          </article>

          <!-- 评论区 (移动到文章下方) -->
          <CommentSection :article-id="currentCategory?.id" />
        </div>
      </div>
    </main>

    <!-- 右侧目录 (仅在有文章且不加载时显示) -->
    <TableOfContents v-if="currentCategory && !loading" :content="articleContent" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CategorySidebar from './components/CategorySidebar.vue'
import type { Category } from './components/CategorySidebar.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import TableOfContents from './components/TableOfContents.vue'
import CommentSection from './components/CommentSection.vue'

// 当前选中的分类
const currentCategory = ref<Category | null>(null)
// 文章内容
const articleContent = ref('')
// 加载状态
const loading = ref(false)

// 将外部URL转换为代理URL
const getProxiedUrl = (url: string): string => {
  const imageHost = 'https://image.harrio.xyz'
  if (url.startsWith(imageHost)) {
    return url.replace(imageHost, '/image-proxy')
  }
  return url
}

// 处理分类选择
const handleCategorySelect = async (category: Category) => {
  currentCategory.value = category
  console.log('选中分类:', currentCategory.value)

  // 如果有url，直接fetch获取Markdown内容
  if (category.url) {
    loading.value = true
    try {
      const fetchUrl = getProxiedUrl(category.url)
      const response = await fetch(fetchUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      articleContent.value = await response.text()
    } catch (error) {
      console.error('获取文章内容失败:', error)
      articleContent.value = '# 加载失败\n\n文章内容加载失败，请稍后重试。'
    } finally {
      loading.value = false
    }
  } else {
    articleContent.value = '# 暂无内容\n\n该分类暂无文章内容。'
  }
}
</script>

<style lang="scss" scoped>
// 配色系统 - 莫兰迪色系 & 柔和渐变
$primary: #e8a0bf;
$primary-light: #f4c7d5;
$secondary: #b4e4d3;
$bg-cream: #fdfbf7;
$bg-pink: #fff0f5;
$text-primary: #4a4a4a;
$text-secondary: #8c8c8c;
$glass-bg: rgba(255, 255, 255, 0.7);
$glass-border: rgba(255, 255, 255, 0.5);
$shadow-soft: 0 8px 32px 0 rgba(31, 38, 135, 0.07);

.blog-layout {
  display: flex;
  min-height: 100vh;
  // 柔和渐变背景
  background: linear-gradient(90deg, rgb(255, 225, 225), rgb(227, 244, 255));
  background-attachment: fixed;
}

// 主内容区
.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  // 隐藏主滚动条，让内部滚动更自然
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.content-wrapper {
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
}

// 通用卡片样式 - Glassmorphism
@mixin glass-card {
  background: $glass-bg;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid $glass-border;
  border-radius: 24px;
  box-shadow: $shadow-soft;
}

// 欢迎卡片
.welcome-card {
  @include glass-card;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  padding: 40px;
  margin-top: 40px;

  .welcome-content {
    position: relative;
    z-index: 2;
  }

  .welcome-emoji {
    font-size: 80px;
    margin-bottom: 24px;
    animation: float 3s ease-in-out infinite;
  }

  h1 {
    font-size: 36px;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: 16px;
    background: linear-gradient(45deg, $primary, #dfaec3);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    color: $text-secondary;
    font-size: 18px;
    margin-bottom: 8px;

    &.sub-text {
      font-size: 14px;
      margin-top: 24px;
      opacity: 0.8;
    }
  }

  // 背景装饰
  .welcome-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;

    .floating-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.6;
      animation: drift 10s infinite alternate;

      &.shape-1 {
        width: 200px;
        height: 200px;
        background: $primary-light;
        top: -50px;
        left: -50px;
      }

      &.shape-2 {
        width: 300px;
        height: 300px;
        background: rgba($secondary, 0.3);
        bottom: -50px;
        right: -50px;
        animation-delay: -5s;
      }

      &.shape-3 {
        width: 150px;
        height: 150px;
        background: rgba(255, 214, 165, 0.3);
        top: 40%;
        left: 60%;
        animation-duration: 15s;
      }
    }
  }
}

// 加载卡片
.loading-card {
  @include glass-card;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba($primary, 0.2);
    border-top-color: $primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 24px;
  }

  p {
    color: $text-secondary;
    letter-spacing: 1px;
  }
}

// 文章容器
.article-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 40px;
}

// 文章卡片
.article-card {
  @include glass-card;
  background: rgba(255, 255, 255, 0.9); // 文章背景稍微不透明一点，提高阅读体验
  padding: 48px 64px;
  animation: slideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

// 动画定义
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes drift {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(30px, 30px) rotate(10deg);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }

  .welcome-card {
    padding: 24px;
    min-height: 300px;

    .welcome-emoji {
      font-size: 60px;
    }

    h1 {
      font-size: 24px;
    }
  }

  .article-card {
    padding: 24px;
    border-radius: 16px;
  }
}
</style>
