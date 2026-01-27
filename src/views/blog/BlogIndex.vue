<template>
  <div class="blog-layout">
    <!-- 顶部导航栏 -->
    <div class="top-nav"></div>
    <!-- 左侧分类导航 -->
    <CategorySidebar @select="handleCategorySelect" />

    <!-- 中间内容区 -->
    <main class="main-content">
      <!-- 顶部分类导航 -->
      <div v-if="currentCategory" class="category-header">
        <div class="breadcrumb">
          <span class="breadcrumb-item">Blog</span>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-item active">{{ currentCategory.name }}</span>
        </div>
        <h1 class="category-title">{{ currentCategory.name }}</h1>
        <div class="category-meta">
          <span class="meta-dot"></span>
          <span>总共有 {{ currentCategory?.children?.length || 0 }} 个内容</span>
        </div>
      </div>
      <!-- 有两种可能, 1. 当前分类下有文章, 2. 当前分类下有子分类 -->
      <div v-if="currentCategory?.children?.length" class="category-list">
        <!-- 子分类/文章卡片列表 -->
        <div
          v-for="item in currentCategory.children"
          :key="item.id"
          class="article-card"
          @click="handleCategorySelect(item)"
        >
          <!-- 左侧封面图 -->
          <div class="card-cover">
            <img v-if="item.img_url" :src="item.img_url" :alt="item.name" class="cover-img" />
            <div v-else class="cover-placeholder">
              <SvgIcon name="document" />
            </div>
          </div>
          <!-- 右侧内容 -->
          <div class="card-content">
            <!-- 顶部标签和日期 -->
            <div class="card-header">
              <span v-if="item.type === 'article'" class="meta-tag">ARTICLE</span>
              <span v-else class="meta-tag folder-tag">FOLDER</span>
              <span class="meta-date">
                <SvgIcon name="calendar" />
                {{ formatDate(item.created_at) }}
              </span>
            </div>
            <!-- 标题 -->
            <h3 class="card-title">{{ item.name }}</h3>
            <!-- 描述 -->
            <p v-if="item.description" class="card-desc">{{ item.description }}</p>
            <!-- 底部信息 -->
            <div class="card-footer">
              <span class="meta-time">
                <SvgIcon name="clock" />
                {{ estimateReadTime(item.description) }} min read
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="content-wrapper">
        <!-- 文章内容 & 评论 -->
        <div class="article-container">
          <!-- <article class="article-card">
            <MarkdownRenderer :content="articleContent" />
          </article> -->

          <!-- 评论区 (移动到文章下方) -->
          <!-- <CommentSection :article-id="currentCategory?.id" /> -->
        </div>
      </div>
    </main>
    <!-- 右边内容区 -->
    <div class="right-content">
      <!-- 热门标签 -->
      <div class="hot-tags">
        <h3 class="hot-tags-title">Popular Tags</h3>
        <div class="tags-list">
          <span v-for="tag in hotTags" :key="tag.id" class="tag-item">#{{ tag.name }}</span>
        </div>
      </div>
      <!-- 右侧目录 (仅在有文章且不加载时显示) -->
      <!-- <TableOfContents v-if="currentCategory && !loading" :content="articleContent" /> -->
    </div>

    <!-- 右侧目录 (仅在有文章且不加载时显示) -->
    <!-- <TableOfContents v-if="currentCategory && !loading" :content="articleContent" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CategorySidebar from './components/CategorySidebar.vue'
import type { Category } from '@/types/Category'
import { categoryApi } from '@/api'
// import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
// import TableOfContents from './components/TableOfContents.vue'
import SvgIcon from '@/components/SvgIcon.vue'
// import CommentSection from './components/CommentSection.vue'

// 当前选中的分类
const currentCategory = ref<Category | null>(null)
// 热门标签
const hotTags = ref<Category[]>([])
// 文章内容
// const articleContent = ref('')
// 加载状态
// const loading = ref(false)

// 格式化日期
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// 估算阅读时间(分钟)
const estimateReadTime = (description?: string): number => {
  if (!description) return 5
  // 简单估算: 每200字约1分钟
  const charCount = description.length
  return Math.max(1, Math.ceil(charCount / 200))
}

// 将外部URL转换为代理URL
// const getProxiedUrl = (url: string): string => {
//   const imageHost = 'https://image.harrio.xyz'
//   if (url.startsWith(imageHost)) {
//     return url.replace(imageHost, '/image-proxy')
//   }
//   return url
// }

// 处理分类选择
const handleCategorySelect = async (category: Category) => {
  currentCategory.value = category
  console.log('选中分类:', currentCategory.value)

  // 如果有url，直接fetch获取Markdown内容
  // if (category.url) {
  //   loading.value = true
  //   try {
  //     const fetchUrl = getProxiedUrl(category.url)
  //     const response = await fetch(fetchUrl)
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`)
  //     }
  //     articleContent.value = await response.text()
  //   } catch (error) {
  //     console.error('获取文章内容失败:', error)
  //     articleContent.value = '# 加载失败\n\n文章内容加载失败，请稍后重试。'
  //   } finally {
  //     loading.value = false
  //   }
  // } else {
  //   articleContent.value = '# 暂无内容\n\n该分类暂无文章内容。'
  // }
}

// 获取热门标签
const fetchHotTags = async () => {
  try {
    const data = await categoryApi.getHotTags()
    hotTags.value = data as Category[]
  } catch (error) {
    console.error('获取热门标签失败:', error)
  }
}

onMounted(() => {
  fetchHotTags()
})
</script>

<style lang="scss" scoped>
.blog-layout {
  display: flex;
  justify-content: center;
  height: 100vh;
  background-color: rgb(246 246 248 / var(--tw-bg-opacity, 1));
  .top-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: #fff;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .main-content {
    // flex: 1;
    margin-top: 64px;
    padding: 24px;
    overflow-y: auto;
    // width: 560px;
  }
}

// 分类头部
.category-header {
  margin-bottom: 24px;

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    font-size: 14px;

    .breadcrumb-item {
      color: #6b7280;

      &.active {
        color: #1a73e8;
        font-weight: 500;
      }
    }

    .breadcrumb-separator {
      color: #9ca3af;
    }
  }

  .category-title {
    font-size: 32px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 12px 0;
    letter-spacing: -0.02em;
  }

  .category-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #6b7280;

    .meta-dot {
      width: 8px;
      height: 8px;
      background-color: #1a73e8;
      border-radius: 50%;
    }
  }
}

// 分类列表
.category-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 560px;
}

// 文章卡片
.article-card {
  display: flex;
  gap: 24px;
  padding: 20px;
  background: #fff;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  }

  .card-cover {
    flex-shrink: 0;
    width: 180px;
    height: 180px;
    border-radius: 12px;
    overflow: hidden;

    .cover-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .cover-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 100%);

      svg {
        width: 48px;
        height: 48px;
        color: #94a3b8;
      }
    }
  }

  .card-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;

    .meta-tag {
      padding: 6px 14px;
      background: #e0e7ff;
      color: #4f46e5;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;

      &.folder-tag {
        background: #d1fae5;
        color: #059669;
      }
    }

    .meta-date {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #6b7280;

      svg {
        width: 16px;
        height: 16px;
        color: #9ca3af;
      }
    }
  }

  .card-title {
    font-size: 22px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 12px 0;
    line-height: 1.4;
  }

  .card-desc {
    font-size: 15px;
    color: #6b7280;
    line-height: 1.6;
    margin: 0 0 auto 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-footer {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 16px;
    padding-top: 12px;

    .meta-time {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #6b7280;

      svg {
        width: 16px;
        height: 16px;
        color: #9ca3af;
      }
    }
  }
}

// 热门标签
.hot-tags {
  padding: 20px;
  background: #f6f6f8;
  border-radius: 12px;
  margin-top: 64px;

  .hot-tags-title {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 16px 0;
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tag-item {
    padding: 6px 12px;
    background: #fff;
    color: #4b5563;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #e5e7eb;
      color: #1f2937;
    }
  }
}
</style>
