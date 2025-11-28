<template>
  <div class="blog-layout">
    <!-- 左侧分类导航 -->
    <CategorySidebar @select="handleCategorySelect" />

    <!-- 右侧内容区 -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- 未选择文章时显示欢迎卡片 -->
        <div v-if="!currentCategory" class="welcome-card">
          <div class="welcome-emoji">📚</div>
          <h1>欢迎来到我的博客</h1>
          <p>从左侧选择一篇文章开始阅读吧</p>
          <div class="welcome-decoration">
            <span>🌸</span>
            <span>🌿</span>
            <span>✨</span>
          </div>
        </div>

        <!-- 加载中状态 -->
        <div v-else-if="loading" class="loading-card">
          <div class="loading-spinner"></div>
          <p>正在加载文章...</p>
        </div>

        <!-- 文章内容 -->
        <article v-else class="article-card">
          <MarkdownRenderer :content="articleContent" />
        </article>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CategorySidebar from './components/CategorySidebar.vue'
import type { Category } from './components/CategorySidebar.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

// 当前选中的分类
const currentCategory = ref<Category | null>(null)
// 文章内容
const articleContent = ref('')
// 加载状态
const loading = ref(false)

// 处理分类选择
const handleCategorySelect = async (category: Category) => {
  currentCategory.value = category
  console.log('选中分类:', currentCategory.value)

  // 如果有url，直接fetch获取Markdown内容
  if (category.url) {
    loading.value = true
    try {
      const response = await fetch(category.url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      articleContent.value = await response.text()
      // console.log('文章内容:', articleContent.value)
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
// 温馨配色
$primary: #e8a0bf;
$primary-light: #f4c7d5;
$bg-cream: #fef9f3;
$bg-pink: #fff5f8;
$text-primary: #5d4e60;
$text-secondary: #9b8a9e;
$border-color: rgba(232, 160, 191, 0.2);
$shadow-soft: rgba(232, 160, 191, 0.15);

.blog-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, $bg-cream 0%, $bg-pink 50%, #f0f7f4 100%);
}

// 主内容区
.main-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.welcome-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 420px;
  padding: 48px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid $border-color;
  border-radius: 32px;
  box-shadow: 0 8px 40px $shadow-soft;
  text-align: center;

  .welcome-emoji {
    font-size: 64px;
    margin-bottom: 24px;
    animation: bounce 2s ease-in-out infinite;
  }

  h1 {
    font-size: 32px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 12px;
    letter-spacing: 2px;
  }

  p {
    color: $text-secondary;
    font-size: 16px;
    margin-bottom: 32px;
  }

  .welcome-decoration {
    display: flex;
    gap: 16px;

    span {
      font-size: 28px;
      animation: sway 2s ease-in-out infinite;

      &:nth-child(2) {
        animation-delay: 0.3s;
      }
      &:nth-child(3) {
        animation-delay: 0.6s;
      }
    }
  }
}

// 动画
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes sway {
  0%,
  100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 加载状态卡片
.loading-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 48px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid $border-color;
  border-radius: 32px;
  box-shadow: 0 8px 40px $shadow-soft;

  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 3px solid $primary-light;
    border-top-color: $primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  p {
    color: $text-secondary;
    font-size: 16px;
  }
}

// 文章卡片
.article-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid $border-color;
  border-radius: 24px;
  box-shadow: 0 8px 40px $shadow-soft;
  padding: 48px;
  animation: fadeIn 0.3s ease-out;

  .article-header {
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px dashed $border-color;
  }

  .article-title {
    font-size: 28px;
    font-weight: 700;
    color: $text-primary;
    margin: 0;
    letter-spacing: 1px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式
@media (max-width: 768px) {
  .main-content {
    padding: 20px;
  }
  .welcome-card {
    padding: 32px 20px;
    h1 {
      font-size: 24px;
    }
  }
  .article-card {
    padding: 24px;

    .article-title {
      font-size: 22px;
    }
  }
}
</style>
