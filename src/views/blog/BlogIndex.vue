<template>
  <div class="blog-container">
    <!-- 背景视频 (保持不变，作为整体风格的一部分) -->
    <video autoplay loop muted class="video-background">
      <source src="../../assets/source/kkl.mp4" type="video/mp4" />
    </video>

    <div class="content-wrapper">
      <article class="blog-paper" v-loading="loading">
        <!-- 装饰性元素：顶部回形针/胶带效果 -->
        <div class="paper-decoration"></div>

        <header class="paper-header" v-if="detail">
          <div class="header-meta">
            <span class="meta-tag">{{ detail.category }}</span>
            <span class="meta-divider">/</span>
            <span class="meta-date">{{ formatDate(detail.created_at) }}</span>
          </div>

          <h1 class="paper-title">{{ detail.title }}</h1>

          <div class="header-decoration">
            <span class="decoration-line"></span>
            <span class="decoration-icon">❦</span>
            <span class="decoration-line"></span>
          </div>
        </header>

        <main class="paper-content" v-if="detail">
          <div v-if="detail.description" class="paper-quote">
            <p>{{ detail.description }}</p>
          </div>

          <transition name="fade" mode="out-in">
            <MarkdownRenderer v-if="content" class="markdown-body" :content="content" />
            <div v-else class="loading-state">
              <div class="spinner"></div>
              <p>正在翻阅篇章...</p>
            </div>
          </transition>
        </main>

        <footer class="paper-footer" v-if="detail">
          <div class="footer-divider"></div>
          <a class="read-original-btn" :href="detail.url" target="_blank" rel="noopener">
            <span>阅读原文</span>
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
          <div class="footer-note">End of Article</div>
        </footer>

        <!-- 空状态 -->
        <div class="empty-state" v-else-if="!loading">
          <p>暂无内容</p>
        </div>
      </article>
    </div>
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
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

// ==================== Lifecycle ====================
onMounted(() => {
  fetchBlogDetail()
})
</script>

<style lang="scss" scoped>
// 字体引入（如果是全局已有则不需要，这里假设使用系统衬线字体）
$font-serif: 'Georgia', 'Times New Roman', 'Songti SC', serif;
$font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

.blog-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.video-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  // 加一层暖色遮罩，让视频看起来更温馨
  filter: brightness(0.9) sepia(0.2);
}

.content-wrapper {
  width: 100%;
  max-width: 800px;
  z-index: 1;
}

.blog-paper {
  background-color: #fffcf9; // 暖白色/米色背景
  border-radius: 4px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.05),
    0 15px 30px rgba(0, 0, 0, 0.1); // 柔和的阴影
  padding: 60px 50px;
  position: relative;
  color: #433422; // 深棕灰色文字
  transition: transform 0.3s ease;

  // 纸张纹理效果
  background-image: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 98%,
    rgba(0, 0, 0, 0.02) 100%
  );
  background-size: 100% 20px; // 模拟信纸横线（非常淡）

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(to right, #d4a373, #faedcd, #d4a373); // 顶部装饰条
    border-radius: 4px 4px 0 0;
  }
}

// 头部样式
.paper-header {
  text-align: center;
  margin-bottom: 50px;

  .header-meta {
    font-size: 14px;
    color: #9c826b;
    margin-bottom: 16px;
    letter-spacing: 1px;
    font-family: $font-sans;
    text-transform: uppercase;

    .meta-tag {
      color: #b5835a;
      font-weight: 600;
    }

    .meta-divider {
      margin: 0 10px;
      color: #e0d0c0;
    }
  }

  .paper-title {
    font-family: $font-serif;
    font-size: 42px;
    font-weight: 700;
    line-height: 1.3;
    color: #2c1810;
    margin-bottom: 25px;
    letter-spacing: -0.5px;
  }

  .header-decoration {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    color: #d4a373;
    opacity: 0.6;

    .decoration-line {
      height: 1px;
      width: 60px;
      background-color: currentColor;
    }

    .decoration-icon {
      font-size: 20px;
    }
  }
}

// 内容区域
.paper-content {
  font-family: $font-sans;
  line-height: 1.8;
  font-size: 16px;

  .paper-quote {
    background-color: #f4efe9;
    padding: 20px 30px;
    border-left: 3px solid #d4a373;
    margin-bottom: 40px;
    font-family: $font-serif;
    font-style: italic;
    color: #5d4037;
    border-radius: 0 8px 8px 0;
  }

  .markdown-body {
    color: #333;
    // 这里可以添加更多针对markdown内容的样式调整
  }
}

// 底部区域
.paper-footer {
  margin-top: 60px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  .footer-divider {
    width: 40px;
    height: 4px;
    background-color: #e0d0c0;
    margin-bottom: 30px;
    border-radius: 2px;
  }

  .read-original-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 30px;
    background-color: white;
    border: 1px solid #d4a373;
    color: #8d6e63;
    border-radius: 30px;
    text-decoration: none;
    font-size: 15px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(212, 163, 115, 0.1);

    &:hover {
      background-color: #d4a373;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(212, 163, 115, 0.2);
    }

    .icon {
      width: 16px;
      height: 16px;
    }
  }

  .footer-note {
    margin-top: 20px;
    font-size: 12px;
    color: #cfbdaf;
    font-family: $font-serif;
    font-style: italic;
  }
}

// Loading状态
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #a1887f;

  .spinner {
    width: 30px;
    height: 30px;
    border: 2px solid #e0d0c0;
    border-top-color: #8d6e63;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }
}

// 响应式
@media (max-width: 768px) {
  .blog-paper {
    padding: 40px 20px;
  }

  .paper-header {
    .paper-title {
      font-size: 28px;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
