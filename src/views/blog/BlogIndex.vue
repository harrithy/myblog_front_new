<template>
  <div class="blog-detail-wrapper">
    <article class="blog-detail" v-loading="loading">
      <!-- 博客头部 -->
      <header class="blog-detail__header" v-if="detail">
        <div class="blog-detail__category-wrapper">
          <span class="blog-detail__category">{{ detail.category }}</span>
        </div>
        <h1 class="blog-detail__title">{{ detail.title }}</h1>
        <div class="blog-detail__meta">
          <time class="blog-detail__time" :datetime="detail.created_at">
            <svg class="blog-detail__icon" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0z"
              />
              <path d="M7.5 3.5v5h4" />
            </svg>
            {{ formatDate(detail.created_at) }}
          </time>
          <span class="blog-detail__separator">·</span>
          <time class="blog-detail__time" :datetime="detail.updated_at">
            <svg class="blog-detail__icon" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
              <path
                d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
              />
            </svg>
            {{ formatDate(detail.updated_at) }}
          </time>
        </div>
      </header>

      <!-- 博客内容 -->
      <main class="blog-detail__content" v-if="detail">
        <div v-if="detail.description" class="blog-detail__description">
          <p>{{ detail.description }}</p>
        </div>

        <div class="blog-detail__divider"></div>

        <transition name="fade" mode="out-in">
          <MarkdownRenderer v-if="content" class="blog-detail__body" :content="content" />
          <div v-else class="blog-detail__loading">
            <div class="blog-detail__loading-spinner"></div>
            <p>正在加载博客内容...</p>
          </div>
        </transition>

        <div class="blog-detail__footer">
          <a class="blog-detail__link" :href="detail.url" target="_blank" rel="noopener">
            <svg class="blog-detail__link-icon" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
              />
              <path
                d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
              />
            </svg>
            阅读原文
          </a>
        </div>
      </main>

      <!-- 空状态 -->
      <div class="blog-detail__empty" v-else-if="!loading">
        <svg class="blog-detail__empty-icon" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="2" />
          <path
            d="M32 20v16M32 44h.01"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <p>暂无博客内容</p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import type { BlogDetail } from '@/api/blog'
import { blogApi } from '@/api'

// ==================== State ====================
const detail = ref<BlogDetail | null>(null)
const content = ref('')
const loading = ref(false)

// ==================== API Calls ====================
/**
 * 获取博客正文内容
 */
const fetchBlogContent = async (url: string): Promise<void> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load blog content: ${response.status}`)
    }
    content.value = await response.text()
  } catch (error) {
    console.error('Failed to fetch blog content:', error)
    content.value = ''
    ElMessage.error('获取博客正文失败')
  }
}

/**
 * 获取博客详情
 */
const fetchBlogDetail = async (): Promise<void> => {
  loading.value = true
  try {
    const data = await blogApi.getBlogDetail(1)
    const blogData = data as BlogDetail
    detail.value = blogData

    if (blogData.url) {
      await fetchBlogContent(blogData.url)
    }
  } catch (error) {
    console.error('Failed to fetch blog detail:', error)
    ElMessage.error('获取博客详情失败')
  } finally {
    loading.value = false
  }
}

// ==================== Utilities ====================
/**
 * 格式化日期
 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// ==================== Lifecycle ====================
onMounted(() => {
  fetchBlogDetail()
})
</script>

<style lang="scss" scoped>
.blog-detail-wrapper {
  width: 100%;
  padding: 40px 20px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.blog-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 32px;
  background: linear-gradient(to bottom, #ffffff 0%, #fafafa 100%);
  border-radius: 20px;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.05),
    0 10px 20px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.04);
  min-height: 400px;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow:
      0 8px 12px rgba(0, 0, 0, 0.08),
      0 16px 32px rgba(0, 0, 0, 0.12),
      0 0 0 1px rgba(0, 0, 0, 0.06);
  }

  // ==================== Header ====================
  &__header {
    margin-bottom: 40px;
    padding-bottom: 32px;
    border-bottom: 2px solid #f0f0f0;
  }

  &__category-wrapper {
    margin-bottom: 16px;
  }

  &__category {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 16px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #2563eb;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.15) 100%);
    border: 1px solid rgba(37, 99, 235, 0.2);
    border-radius: 999px;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(59, 130, 246, 0.2) 100%);
      transform: translateY(-2px);
    }
  }

  &__title {
    font-size: 36px;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 20px;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e3a8a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: #0f172a; // fallback for browsers that don't support background-clip
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #64748b;
    flex-wrap: wrap;
  }

  &__time {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background-color: #f8fafc;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f1f5f9;
      color: #475569;
    }
  }

  &__icon {
    width: 14px;
    height: 14px;
    opacity: 0.7;
  }

  &__separator {
    color: #cbd5e1;
    font-weight: 300;
  }

  // ==================== Content ====================
  &__content {
    font-size: 16px;
    color: #1f2937;
    line-height: 1.8;
  }

  &__description {
    padding: 20px 24px;
    margin-bottom: 32px;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-left: 4px solid #3b82f6;
    border-radius: 0 12px 12px 0;
    font-size: 16px;
    line-height: 1.7;
    color: #334155;
    font-style: italic;

    p {
      margin: 0;
    }
  }

  &__divider {
    height: 2px;
    margin: 40px 0;
    background: linear-gradient(
      90deg,
      transparent,
      #cbd5e1 20%,
      #94a3b8 50%,
      #cbd5e1 80%,
      transparent
    );
    border-radius: 2px;
  }

  &__body {
    margin-bottom: 40px;
  }

  // ==================== Loading ====================
  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    color: #9ca3af;

    p {
      margin-top: 16px;
      font-size: 15px;
    }
  }

  &__loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  // ==================== Footer ====================
  &__footer {
    margin-top: 48px;
    padding-top: 32px;
    border-top: 2px solid #f0f0f0;
    display: flex;
    justify-content: center;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 28px;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border-radius: 12px;
    text-decoration: none;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &__link-icon {
    width: 16px;
    height: 16px;
  }

  // ==================== Empty State ====================
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 20px;
    text-align: center;
    color: #9ca3af;

    p {
      margin-top: 20px;
      font-size: 16px;
      font-weight: 500;
    }
  }

  &__empty-icon {
    width: 80px;
    height: 80px;
    color: #d1d5db;
  }
}

// ==================== Animations ====================
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// ==================== Responsive ====================
@media (max-width: 768px) {
  .blog-detail {
    padding: 32px 20px;
    border-radius: 16px;

    &__title {
      font-size: 28px;
    }

    &__meta {
      font-size: 13px;
    }

    &__header {
      margin-bottom: 32px;
      padding-bottom: 24px;
    }
  }
}
</style>
