<template>
  <div class="markdown-body" ref="containerRef" v-html="renderedHtml"></div>
  <!-- 图片预览 -->
  <el-image-viewer
    v-if="showViewer"
    :url-list="previewImages"
    :initial-index="previewIndex"
    @close="showViewer = false"
    teleported
  />
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import { renderMarkdown } from '@/utils/markdown'
import { ElImageViewer } from 'element-plus'

interface Props {
  content: string
}

const props = defineProps<Props>()
const containerRef = ref<HTMLElement | null>(null)

// 图片预览相关
const showViewer = ref(false)
const previewImages = ref<string[]>([])
const previewIndex = ref(0)

const renderedHtml = computed(() => {
  return renderMarkdown(props.content)
})

// 打开图片预览
const openPreview = (src: string) => {
  if (!containerRef.value) return

  // 收集所有图片
  const images = containerRef.value.querySelectorAll('img')
  const urls: string[] = []
  let index = 0

  images.forEach((img, i) => {
    urls.push(img.src)
    if (img.src === src) {
      index = i
    }
  })

  previewImages.value = urls
  previewIndex.value = index
  showViewer.value = true
}

// 为图片添加 loading 效果
const setupImageLoading = () => {
  if (!containerRef.value) return

  const images = containerRef.value.querySelectorAll('img')
  images.forEach((img) => {
    // 跳过已经处理过的图片
    if (img.parentElement?.classList.contains('img-wrapper')) return

    // 创建 wrapper
    const wrapper = document.createElement('div')
    wrapper.className = 'img-wrapper loading'

    // 创建 loading 元素
    const loader = document.createElement('div')
    loader.className = 'img-loading'
    loader.innerHTML = '<div class="loading-spinner"></div><span>图片加载中...</span>'

    // 包裹图片
    img.parentNode?.insertBefore(wrapper, img)
    wrapper.appendChild(loader)
    wrapper.appendChild(img)

    // 监听加载完成
    if (img.complete) {
      wrapper.classList.remove('loading')
    } else {
      img.onload = () => {
        wrapper.classList.remove('loading')
      }
      img.onerror = () => {
        wrapper.classList.remove('loading')
        wrapper.classList.add('error')
        loader.innerHTML = '<span>图片加载失败</span>'
      }
    }

    // 添加点击预览
    img.style.cursor = 'zoom-in'
    img.addEventListener('click', () => {
      openPreview(img.src)
    })
  })
}

// 为代码块添加复制按钮
const setupCodeCopy = () => {
  if (!containerRef.value) return

  const codeBlocks = containerRef.value.querySelectorAll('pre')
  codeBlocks.forEach((pre) => {
    // 跳过已经处理过的
    if (pre.querySelector('.copy-btn')) return

    // 创建复制按钮
    const copyBtn = document.createElement('button')
    copyBtn.className = 'copy-btn'
    copyBtn.innerHTML = '复制'
    copyBtn.title = '复制代码'

    // 点击复制
    copyBtn.addEventListener('click', async () => {
      const code = pre.querySelector('code')
      const text = code?.textContent || ''

      try {
        await navigator.clipboard.writeText(text)
        copyBtn.innerHTML = '已复制 ✓'
        copyBtn.classList.add('copied')
        setTimeout(() => {
          copyBtn.innerHTML = '复制'
          copyBtn.classList.remove('copied')
        }, 2000)
      } catch {
        copyBtn.innerHTML = '复制失败'
        setTimeout(() => {
          copyBtn.innerHTML = '复制'
        }, 2000)
      }
    })

    pre.appendChild(copyBtn)
  })
}

// 初始化增强功能
const setupEnhancements = () => {
  setupImageLoading()
  setupCodeCopy()
}

// 监听内容变化
onMounted(() => {
  nextTick(setupEnhancements)
})

watch(
  () => props.content,
  () => {
    nextTick(setupEnhancements)
  },
)
</script>

<style scoped lang="scss">
// 字体变量
$font-serif: 'Georgia', 'Noto Serif SC', serif;
$font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
$font-mono: 'JetBrains Mono', 'Fira Code', monospace;

// 简约色彩
$color-text: #2d3748;
$color-text-light: #718096;
$color-accent: #4a9ff5;
$color-border: #e2e8f0;
$color-bg-light: #f7fafc;

.markdown-body {
  color: $color-text;
  font-size: 16px;
  line-height: 1.8;
  word-wrap: break-word;
  font-family: $font-sans;
  letter-spacing: 0.02em;

  :deep() {
    // 标题 - 简洁有力
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 2em 0 1em;
      font-weight: 600;
      line-height: 1.4;
      color: #1a202c;

      &:first-child {
        margin-top: 0;
      }
    }

    h1 {
      font-size: 1.875em;
      padding-bottom: 0.5em;
      border-bottom: 1px solid $color-border;
    }

    h2 {
      font-size: 1.5em;
      padding-bottom: 0.3em;
      border-bottom: 1px solid rgba($color-border, 0.6);
    }

    h3 {
      font-size: 1.25em;
    }
    h4 {
      font-size: 1.125em;
    }
    h5 {
      font-size: 1em;
      color: $color-text-light;
    }
    h6 {
      font-size: 0.875em;
      color: $color-text-light;
    }

    // 段落
    p {
      margin: 0 0 1.5em;
    }

    // 链接 - 简约下划线
    a {
      color: $color-accent;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s;

      &:hover {
        border-bottom-color: $color-accent;
      }
    }

    strong {
      font-weight: 600;
      color: #1a202c;
    }

    em {
      font-style: italic;
    }

    // 引用 - 极简风格
    blockquote {
      margin: 1.5em 0;
      padding: 0 0 0 1.5em;
      border-left: 3px solid $color-accent;
      color: $color-text-light;

      p:last-child {
        margin-bottom: 0;
      }
    }

    // 行内代码
    code {
      padding: 0.15em 0.4em;
      font-size: 0.875em;
      background: $color-bg-light;
      border-radius: 3px;
      font-family: $font-mono;
      color: #e53e3e;
    }

    // 代码块 - 简洁暗色
    pre {
      margin: 1.5em 0;
      padding: 1.25em;
      overflow-x: auto;
      font-size: 0.875em;
      line-height: 1.7;
      background: #1e1e1e;
      border-radius: 6px;
      position: relative;

      code {
        display: block;
        padding: 0;
        background: transparent;
        color: #d4d4d4;
        font-family: $font-mono;
      }

      &::-webkit-scrollbar {
        height: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: #4a5568;
        border-radius: 3px;
      }

      // 复制按钮样式
      .copy-btn {
        position: absolute;
        top: 10px;
        right: 12px;
        padding: 4px 12px;
        font-size: 12px;
        color: #abb2bf;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: $font-sans;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }

        &.copied {
          background: rgba(39, 201, 63, 0.2);
          border-color: rgba(39, 201, 63, 0.4);
          color: #27c93f;
        }
      }
    }

    // 列表
    ul,
    ol {
      padding-left: 1.5em;
      margin: 0 0 1.5em;
    }

    ul {
      list-style: disc;
    }

    ol {
      list-style: decimal;
    }

    li {
      margin-bottom: 0.5em;
      padding-left: 0.25em;

      > p {
        margin-bottom: 0.5em;
      }
    }

    // 表格 - 简洁线框
    table {
      width: 100%;
      margin: 1.5em 0;
      border-collapse: collapse;
      font-size: 0.9em;

      th,
      td {
        padding: 0.75em 1em;
        text-align: left;
        border-bottom: 1px solid $color-border;
      }

      th {
        font-weight: 600;
        color: #1a202c;
        background: $color-bg-light;
      }

      tr:hover td {
        background: rgba($color-accent, 0.05);
      }
    }

    // 分割线 - 极简
    hr {
      margin: 3em 0;
      border: none;
      border-top: 1px solid $color-border;
    }

    // 图片包裹器
    .img-wrapper {
      position: relative;
      margin: 1.5em auto;
      text-align: center;

      &.loading {
        min-height: 150px;
        background: $color-bg-light;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          opacity: 0;
          position: absolute;
        }

        .img-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: $color-text-light;
          font-size: 13px;
        }
      }

      &:not(.loading) .img-loading {
        display: none;
      }

      &:not(.loading) img {
        opacity: 1;
        transition: opacity 0.3s;
      }

      &.error {
        min-height: 100px;
        background: #fef2f2;

        .img-loading {
          color: #e53e3e;
        }
        img {
          display: none;
        }
      }

      .loading-spinner {
        width: 28px;
        height: 28px;
        border: 2px solid $color-border;
        border-top-color: $color-accent;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    // 图片 - 简洁圆角
    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 0 auto;
      border-radius: 4px;
    }

    // 任务列表
    input[type='checkbox'] {
      appearance: none;
      width: 14px;
      height: 14px;
      border: 1.5px solid $color-border;
      border-radius: 3px;
      margin-right: 6px;
      vertical-align: middle;
      cursor: pointer;

      &:checked {
        background: $color-accent;
        border-color: $color-accent;

        &::after {
          content: '✓';
          display: block;
          text-align: center;
          color: white;
          font-size: 10px;
          line-height: 14px;
        }
      }
    }

    del {
      color: $color-text-light;
    }

    sup {
      color: $color-accent;
      font-size: 0.75em;
    }
  }
}
</style>
