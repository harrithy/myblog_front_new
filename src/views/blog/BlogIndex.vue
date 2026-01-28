<template>
  <div class="blog-layout">
    <!-- 浮动吉祥物 -->
    <div
      ref="floatingPet"
      class="floating-pet"
      :style="{ left: petPos.x + 'px', top: petPos.y + 'px' }"
      @mousedown="startDrag"
    >
      <img src="@/assets/source/changyeyueyao.gif" alt="pet" draggable="false" />
    </div>
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
          <template v-for="(item, index) in breadcrumbPath" :key="item.id">
            <span class="breadcrumb-separator">/</span>
            <span
              class="breadcrumb-item"
              :class="{
                active: index === breadcrumbPath.length - 1,
                clickable: index < breadcrumbPath.length - 1,
              }"
              @click="index < breadcrumbPath.length - 1 && handleBreadcrumbClick(index)"
            >
              {{ item.name }}
            </span>
          </template>
        </div>
        <h1 class="category-title">{{ currentCategory.name }}</h1>
        <!-- 详细信息 -->
        <div class="category-detail">
          <div class="detail-dates">
            <span class="detail-item">
              <SvgIcon name="calendar" class="detail-icon" />
              创建: {{ formatDate(currentCategory.created_at) }}
            </span>
            <span class="detail-item">
              <SvgIcon name="clock" class="detail-icon" />
              更新: {{ formatDate(currentCategory.updated_at) }}
            </span>
          </div>
          <el-tooltip
            v-if="currentCategory.description"
            :content="currentCategory.description"
            placement="bottom"
            :show-after="300"
            popper-class="desc-tooltip"
          >
            <p class="detail-desc">
              {{ currentCategory.description }}
            </p>
          </el-tooltip>
          <div v-if="currentCategory.tags?.length" class="detail-tags">
            <span v-for="tag in currentCategory.tags" :key="tag" class="detail-tag">
              #{{ tag }}
            </span>
          </div>
        </div>
        <div v-if="!showArticle" class="category-meta">
          <span class="meta-dot"></span>
          <span>总共有 {{ currentCategory?.children?.length || 0 }} 个内容</span>
        </div>
      </div>
      <!-- 有两种可能, 1. 当前分类下有文章, 2. 当前分类下有子分类 -->
      <div v-if="!showArticle && currentCategory?.children?.length" class="category-list">
        <!-- 子分类/文章卡片列表 -->
        <div
          v-for="item in currentCategory.children"
          :key="item.id"
          class="article-card"
          @click="handleCategorySelect(item)"
        >
          <!-- 左侧封面图 -->
          <div class="card-cover">
            <el-image
              v-if="item.img_url"
              :src="item.img_url"
              :alt="item.name"
              class="cover-img"
              fit="cover"
              :preview-src-list="[item.img_url]"
              preview-teleported
              @click.stop
            >
              <template #placeholder>
                <div class="image-loading">
                  <div class="loading-spinner"></div>
                </div>
              </template>
              <template #error>
                <div class="cover-placeholder">
                  <SvgIcon name="document" />
                </div>
              </template>
            </el-image>
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
              <div v-if="item.tags?.length" class="tags-wrapper">
                <span v-for="tag in item.tags.slice(0, 4)" :key="tag" class="footer-tag">
                  {{ tag }}
                </span>
                <span v-if="item.tags.length > 4" class="more-tags"
                  >+{{ item.tags.length - 4 }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 空状态占位 -->
      <div
        v-if="!showArticle && currentCategory && !currentCategory?.children?.length"
        class="empty-state"
      >
        <!-- <div class="empty-decoration top-left">🌸</div> -->
        <!-- <div class="empty-decoration top-right">🌼</div> -->
        <div class="empty-illustration">
          <div class="avatar-glow"></div>
          <img src="@/assets/source/avatar.gif" alt="empty" class="empty-avatar" />
          <div class="floating-icons">
            <span class="float-icon">✨</span>
            <span class="float-icon">💖</span>
            <span class="float-icon">⭐</span>
            <span class="float-icon">🌙</span>
          </div>
        </div>
        <h3 class="empty-title">😺 这里空空如也~ 😺</h3>
        <p class="empty-desc">小猫咪正在等待新内容的到来...</p>
        <div class="empty-wave">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <!-- <div class="empty-decoration bottom-left">🌿</div> -->
        <!-- <div class="empty-decoration bottom-right">🌷</div> -->
      </div>
      <div class="content-wrapper">
        <!-- 文章内容 -->
        <div v-if="showArticle" class="article-container">
          <div v-if="loading" class="article-loading">
            <div class="loading-spinner"></div>
            <span>加载中...</span>
          </div>
          <div v-else-if="showArticle && !loading" class="article-box">
            <div class="article-content">
              <MarkdownRenderer :content="articleContent" />
            </div>
            <div>
              <!-- <TableOfContents v-if="showArticle && !loading" :content="articleContent" /> -->
            </div>
          </div>
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
      <div>
        <TableOfContents v-if="showArticle && !loading" :content="articleContent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import CategorySidebar from './components/CategorySidebar.vue'
import type { Category } from '@/types/Category'
import { categoryApi } from '@/api'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import TableOfContents from './components/TableOfContents.vue'
import SvgIcon from '@/components/SvgIcon.vue'
// import CommentSection from './components/CommentSection.vue'

// 当前选中的分类
const currentCategory = ref<Category | null>(null)
// 面包屑路径
const breadcrumbPath = ref<Category[]>([])
// 热门标签
const hotTags = ref<Category[]>([])
// 文章内容
const articleContent = ref('')
// 加载状态
const loading = ref(false)
// 是否显示文章内容
const showArticle = ref(false)
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
  console.log('选中分类:', category)

  // 更新面包屑路径
  // 判断是否是当前分类的子级，如果是则追加，否则重置路径
  const isChildOfCurrent = currentCategory.value?.children?.some(
    (child) => child.id === category.id,
  )
  if (isChildOfCurrent) {
    breadcrumbPath.value.push(category)
  } else {
    // 不是子级，重置路径
    breadcrumbPath.value = [category]
  }

  // 判断是文件夹还是文章
  if (category.type === 'article') {
    // 是文章，获取 Markdown 内容
    showArticle.value = true
    currentCategory.value = category

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
      articleContent.value = '# 暂无内容\n\n该文章暂无内容。'
    }
  } else {
    // 是文件夹，更新当前分类并显示子分类列表
    showArticle.value = false
    articleContent.value = ''
    currentCategory.value = category
  }
}

// 点击面包屑导航
const handleBreadcrumbClick = (index: number) => {
  const targetCategory = breadcrumbPath.value[index]
  // 截断路径到点击的位置
  breadcrumbPath.value = breadcrumbPath.value.slice(0, index + 1)
  // 重新设置当前分类
  showArticle.value = false
  articleContent.value = ''
  currentCategory.value = targetCategory
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

// 浮动宠物相关
const floatingPet = ref<HTMLElement | null>(null)
const petPos = reactive({ x: 100, y: 200 })
const petVelocity = reactive({ x: 2, y: 1.5 })
let isDragging = false
let animationId: number | null = null
const dragOffset = { x: 0, y: 0 }

// 随机移动动画
const animatePet = () => {
  if (isDragging) {
    animationId = requestAnimationFrame(animatePet)
    return
  }

  const maxX = window.innerWidth - 80
  const maxY = window.innerHeight - 80

  petPos.x += petVelocity.x
  petPos.y += petVelocity.y

  // 边界反弹
  if (petPos.x <= 0 || petPos.x >= maxX) {
    petVelocity.x *= -1
    petVelocity.x += (Math.random() - 0.5) * 0.5 // 随机性
  }
  if (petPos.y <= 0 || petPos.y >= maxY) {
    petVelocity.y *= -1
    petVelocity.y += (Math.random() - 0.5) * 0.5
  }

  // 限制速度
  petVelocity.x = Math.max(-3, Math.min(3, petVelocity.x))
  petVelocity.y = Math.max(-3, Math.min(3, petVelocity.y))

  animationId = requestAnimationFrame(animatePet)
}

// 拖拽开始
const startDrag = (e: MouseEvent) => {
  isDragging = true
  dragOffset.x = e.clientX - petPos.x
  dragOffset.y = e.clientY - petPos.y
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

// 拖拽中
const onDrag = (e: MouseEvent) => {
  if (!isDragging) return
  petPos.x = e.clientX - dragOffset.x
  petPos.y = e.clientY - dragOffset.y
}

// 拖拽结束
const stopDrag = () => {
  isDragging = false
  // 拖拽结束后给一个随机方向
  petVelocity.x = (Math.random() - 0.5) * 4
  petVelocity.y = (Math.random() - 0.5) * 4
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

onMounted(() => {
  fetchHotTags()
  // 初始化随机位置
  petPos.x = Math.random() * (window.innerWidth - 100)
  petPos.y = Math.random() * (window.innerHeight - 100)
  animatePet()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style lang="scss" scoped>
// 浮动宠物
.floating-pet {
  position: fixed;
  z-index: 9999;
  cursor: grab;
  user-select: none;
  transition: transform 0.1s ease;

  &:active {
    cursor: grabbing;
    transform: scale(1.1);
  }

  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    pointer-events: none;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
  }
}

.blog-layout {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(180deg, #fafcfd 0%, #e8f6f8 100%);
  padding-top: 64px;

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
          border: 2px solid transparent;
          transition: all 0.3s ease;

          &:focus-within {
            background: #fff;
            border-color: #4a9ff5;
            box-shadow: 0 0 0 4px rgba(74, 159, 245, 0.15);
            min-width: 260px;

            .search-icon {
              color: #4a9ff5;
            }
          }

          .search-icon {
            width: 18px;
            height: 18px;
            color: #94a3b8;
            transition: color 0.3s ease;
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
    padding: 24px;
    // width: 560px;
  }
}

// 左侧侧边栏 sticky
:deep(.sidebar) {
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  overflow-y: auto;
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

      &.clickable {
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
          color: #1a73e8;
        }
      }

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

  .category-detail {
    margin-bottom: 16px;

    .detail-dates {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 12px;

      .detail-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: #6b7280;

        .detail-icon {
          width: 16px;
          height: 16px;
          color: #9ca3af;
        }
      }
    }

    .detail-desc {
      font-size: 15px;
      color: #4b5563;
      line-height: 1.6;
      margin: 0 0 12px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 400px;
      cursor: default;
    }

    .detail-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .detail-tag {
        padding: 4px 12px;
        background: linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 100%);
        color: #4a9ff5;
        border-radius: 14px;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.2s ease;

        &:hover {
          background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
          color: #0284c7;
        }
      }
    }
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

// 空状态占位
.empty-state {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 750px;
  padding: 60px 40px;
  text-align: center;
  background: linear-gradient(135deg, #fff9f9 0%, #f0f7ff 50%, #fff5f8 100%);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  // 角落装饰
  .empty-decoration {
    position: absolute;
    font-size: 28px;
    opacity: 0.7;
    animation: floatDecor 3s ease-in-out infinite;

    &.top-left {
      top: 20px;
      left: 30px;
      animation-delay: 0s;
    }
    &.top-right {
      top: 25px;
      right: 30px;
      animation-delay: 0.5s;
    }
    &.bottom-left {
      bottom: 20px;
      left: 35px;
      animation-delay: 1s;
    }
    &.bottom-right {
      bottom: 25px;
      right: 35px;
      animation-delay: 1.5s;
    }
  }

  .empty-illustration {
    position: relative;
    margin-bottom: 24px;
  }

  // 头像光晕
  .avatar-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 182, 193, 0.4) 0%, transparent 70%);
    border-radius: 50%;
    animation: glowPulse 2s ease-in-out infinite;
  }

  .empty-avatar {
    position: relative;
    width: 160px;
    height: 160px;
    object-fit: contain;
    border-radius: 50%;
    border: 4px solid #fff;
    box-shadow: 0 8px 25px rgba(255, 105, 135, 0.2);
    animation: avatarBounce 2s ease-in-out infinite;
    z-index: 1;
  }

  // 浮动图标
  .floating-icons {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    .float-icon {
      position: absolute;
      font-size: 20px;
      animation: floatAround 4s ease-in-out infinite;

      &:nth-child(1) {
        top: -10px;
        left: 10px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        top: 20px;
        right: -5px;
        animation-delay: 1s;
      }
      &:nth-child(3) {
        bottom: 20px;
        left: -5px;
        animation-delay: 2s;
      }
      &:nth-child(4) {
        bottom: -5px;
        right: 15px;
        animation-delay: 3s;
      }
    }
  }

  .empty-title {
    font-size: 22px;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 12px 0;
  }

  .empty-desc {
    font-size: 15px;
    color: #9ca3af;
    margin: 0 0 24px 0;
  }

  // 波浪动画
  .empty-wave {
    display: flex;
    gap: 6px;
    align-items: flex-end;
    height: 20px;

    span {
      width: 4px;
      background: linear-gradient(180deg, #667eea 0%, #f093fb 100%);
      border-radius: 2px;
      animation: wave 1.2s ease-in-out infinite;

      &:nth-child(1) {
        height: 8px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        height: 12px;
        animation-delay: 0.1s;
      }
      &:nth-child(3) {
        height: 16px;
        animation-delay: 0.2s;
      }
      &:nth-child(4) {
        height: 12px;
        animation-delay: 0.3s;
      }
      &:nth-child(5) {
        height: 8px;
        animation-delay: 0.4s;
      }
    }
  }
}

@keyframes avatarBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes glowPulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.8;
  }
}

@keyframes floatDecor {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(10deg);
  }
}

@keyframes floatAround {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  25% {
    transform: translate(5px, -5px) scale(1.1);
  }
  50% {
    transform: translate(0, -10px) scale(1);
    opacity: 0.7;
  }
  75% {
    transform: translate(-5px, -5px) scale(1.1);
  }
}

@keyframes wave {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.8);
  }
}

// 文章内容区域
.article-container {
  width: 1000px;

  .article-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 60px 0;
    color: #64748b;
    font-size: 14px;

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top-color: #1a73e8;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
  }
  .article-box {
    display: flex;
    gap: 24px;
  }

  .article-content {
    flex: 1;
    background: #fff;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
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

    .image-loading {
      width: 100%;
      height: 100%;
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 100%);

      .loading-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid #e2e8f0;
        border-top-color: #1a73e8;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
    }

    .cover-placeholder {
      width: 100%;
      height: 100%;
      min-height: 120px;
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

  @keyframes spin {
    to {
      transform: rotate(360deg);
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

    .tags-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .footer-tag {
        padding: 4px 10px;
        background: linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 100%);
        color: #4a9ff5;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s ease;

        &:hover {
          background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
          color: #0284c7;
        }
      }

      .more-tags {
        padding: 4px 10px;
        background: #f1f5f9;
        color: #64748b;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
      }
    }
  }
}
.right-content {
  position: sticky;
  top: 88px;
  height: fit-content;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;

  // 订阅卡片
  .subscribe-card {
    width: 400px;
    padding: 24px;
    background: linear-gradient(135deg, #4f8cff 0%, #7c5cff 50%, #a855f7 100%);
    border-radius: 16px;
    box-sizing: border-box;
    transition: all 0.3s ease;
    cursor: default;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 28px rgba(127, 92, 255, 0.35);
    }

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
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
    }

    .hot-tags-title {
      font-size: 13px;
      font-weight: 700;
      color: #64748b;
      margin: 0 0 16px 0;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .tag-item {
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 8px 14px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: left 0.5s ease;
      }

      .tag-hash {
        color: #1a73e8;
        font-weight: 600;
        font-size: 14px;
      }

      .tag-name {
        color: #475569;
        font-weight: 500;
      }

      &:hover {
        background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
        border-color: #7dd3fc;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);

        &::before {
          left: 100%;
        }

        .tag-hash {
          color: #0284c7;
        }

        .tag-name {
          color: #0369a1;
        }
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}
// 热门标签
</style>

<style lang="scss">
// Tooltip 全局样式（不能 scoped）
.desc-tooltip {
  max-width: 600px !important;
  background: #fff !important;
  color: #333 !important;
  border: 1px solid #e4e7ed !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;

  .el-popper__arrow::before {
    background: #fff !important;
    border-color: #e4e7ed !important;
  }
}
</style>
