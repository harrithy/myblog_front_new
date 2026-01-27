<template>
  <div class="blog-layout">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="nav-box">
        <div class="nav-left">
          <router-link to="/" class="nav-item">Home</router-link>
          <router-link to="/blog" class="nav-item active">Articles</router-link>
          <router-link to="/me" class="nav-item">About</router-link>
          <a href="mailto:2656450899@qq.com" class="nav-item">Contact</a>
        </div>
        <div class="nav-right">
          <div class="search-box">
            <SvgIcon name="search" class="search-icon" />
            <input type="text" class="search-input" placeholder="Search articles..." />
          </div>
          <div class="user-avatar">
            <img src="../../assets/source/avatar.gif" alt="avatar" />
          </div>
        </div>
      </div>
    </div>
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
      <!-- 订阅卡片 -->
      <div class="subscribe-card">
        <div class="subscribe-header">
          <SvgIcon name="email" class="subscribe-icon" />
          <h3 class="subscribe-title">如果你想催更</h3>
        </div>
        <p class="subscribe-desc">
          给可爱的作者发送你想说的,可以是动漫、游戏、电影、你的爱好、你的烦恼、甚至是问题和建议，作者会尽力回复你的。
        </p>
        <input
          type="text"
          class="subscribe-input"
          v-model="subscribeInput"
          placeholder="请留下你想说的..."
        />
        <!-- 点击打开邮箱发送 -->
        <button class="subscribe-btn" @click="sendEmail">Send to Author</button>
      </div>
      <!-- 热门标签 -->
      <div class="hot-tags">
        <h3 class="hot-tags-title">Popular Tags</h3>
        <div class="tags-list">
          <span v-for="tag in hotTags" :key="tag.id" class="tag-item">
            <span class="tag-hash">#</span>
            <span class="tag-name">{{ tag.name }}</span>
          </span>
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
// 订阅输入框内容
const subscribeInput = ref('')
// 发送邮件
const sendEmail = () => {
  const email = '2656450899@qq.com'
  const subject = '来自博客的留言'
  const body = subscribeInput.value
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  subscribeInput.value = ''
}
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
    justify-content: space-between;
    padding: 0 40px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    .nav-box {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 600px;
      .nav-left {
        display: flex;
        align-items: center;
        gap: 32px;

        .nav-item {
          font-size: 15px;
          font-weight: 500;
          color: #4b5563;
          text-decoration: none;
          transition: color 0.2s ease;

          &:hover {
            color: #1a73e8;
          }

          &.active {
            color: #1a73e8;
            font-weight: 700;
          }
        }
      }

      .nav-right {
        display: flex;
        align-items: center;
        gap: 20px;

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: #f1f5f9;
          border-radius: 10px;
          min-width: 220px;

          .search-icon {
            width: 18px;
            height: 18px;
            color: #94a3b8;
          }

          .search-input {
            border: none;
            background: transparent;
            outline: none;
            font-size: 14px;
            color: #334155;
            width: 100%;

            &::placeholder {
              color: #94a3b8;
            }
          }
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
          cursor: pointer;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
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
  width: 600px;
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
    // width: 150px;
    // height: 150px;
    flex: 1;
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
    flex: 2;
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
    // margin-top: 16px;
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
.right-content {
  margin-top: 64px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  // 订阅卡片
  .subscribe-card {
    width: 400px;
    padding: 24px;
    background: linear-gradient(135deg, #4f8cff 0%, #7c5cff 50%, #a855f7 100%);
    border-radius: 16px;
    margin-top: 20px;
    box-sizing: border-box;

    .subscribe-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;

      .subscribe-icon {
        width: 28px;
        height: 28px;
        color: #fff;
        flex-shrink: 0;
      }

      .subscribe-title {
        font-size: 20px;
        font-weight: 700;
        color: #fff;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .subscribe-desc {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.6;
      margin: 0 0 20px 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .subscribe-input {
      width: 100%;
      padding: 14px 18px;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 10px;
      font-size: 14px;
      color: #fff;
      margin-bottom: 12px;
      outline: none;
      transition: all 0.2s ease;
      box-sizing: border-box;

      &::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }

      &:focus {
        background: rgba(255, 255, 255, 0.3);
      }
    }

    .subscribe-btn {
      width: 100%;
      padding: 14px 18px;
      background: #fff;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      color: #6366f1;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #f8fafc;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .hot-tags {
    padding: 24px;
    border-radius: 16px;
    min-width: 280px;
    .hot-tags-title {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 20px 0;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .tag-item {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 16px;
      background: #fff;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

      .tag-hash {
        color: #94a3b8;
        font-weight: 500;
      }

      .tag-name {
        color: #64748b;
        font-weight: 500;
      }

      &:hover {
        background: #f8fafc;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);

        .tag-name {
          color: #334155;
        }
      }
    }
  }
}
// 热门标签
</style>
