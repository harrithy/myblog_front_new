<template>
  <aside class="toc-sidebar" v-if="headings.length > 0">
    <div class="toc-card">
      <h3 class="toc-title"><span class="icon">📑</span> 目录</h3>
      <nav class="toc-nav">
        <ul class="toc-list">
          <li
            v-for="heading in headings"
            :key="heading.id"
            :class="['toc-item', `level-${heading.level}`, { active: activeId === heading.id }]"
          >
            <a
              :href="`#${heading.id}`"
              class="toc-link"
              @click.prevent="scrollToHeading(heading.id)"
            >
              {{ heading.text }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

interface Heading {
  id: string
  text: string
  level: number
}

const props = defineProps<{
  content: string
}>()

const activeId = ref<string>('')
let observer: IntersectionObserver | null = null

// 从 Markdown 内容中提取标题
const headings = computed<Heading[]>(() => {
  if (!props.content) return []

  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const result: Heading[] = []
  let match

  while ((match = headingRegex.exec(props.content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    // 生成 id，与 MarkdownRenderer 中的锚点保持一致
    const id = text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u4e00-\u9fa5-]/g, '')

    result.push({ id, text, level })
  }

  return result
})

// 滚动到指定标题
const scrollToHeading = (id: string) => {
  activeId.value = id // 立即设置激活状态
  const element = document.getElementById(id)
  if (element) {
    // 考虑顶部导航栏的高度，如果有的话
    const offset = 20
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({
      top,
      behavior: 'smooth',
    })
  }
}

// 监听滚动以更新高亮
const setupIntersectionObserver = () => {
  if (observer) observer.disconnect()

  const options = {
    rootMargin: '-100px 0px -60% 0px',
    threshold: 1.0,
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeId.value = entry.target.id
      }
    })
  }, options)

  headings.value.forEach((heading) => {
    const element = document.getElementById(heading.id)
    if (element) observer?.observe(element)
  })
}

onMounted(() => {
  // 稍微延迟以确保 DOM 已渲染
  setTimeout(setupIntersectionObserver, 500)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style lang="scss" scoped>
$primary: #e8a0bf;
$primary-light: #f4c7d5;
$text-primary: #5d4e60;
$text-secondary: #9b8a9e;
$border-color: rgba(232, 160, 191, 0.2);
$shadow-soft: rgba(232, 160, 191, 0.15);
$bg-hover: rgba(232, 160, 191, 0.05);

.toc-sidebar {
  min-width: 280px;
  max-width: 300px;
  flex-shrink: 0;
  position: sticky;
  top: 20px;
  height: fit-content;
  max-height: calc(100vh - 40px);
}

.toc-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid $border-color;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 30px $shadow-soft;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 40px rgba(232, 160, 191, 0.25);
    background: rgba(255, 255, 255, 0.95);
  }
}

.toc-title {
  font-size: 16px;
  font-weight: 700;
  color: $text-primary;
  margin: 0 0 20px 0;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba($primary, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;

  .icon {
    font-size: 20px;
  }
}

.toc-nav {
  max-height: 65vh;
  overflow-y: auto;
  padding-right: 4px; // 防止滚动条遮挡内容

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba($primary, 0.3);
    border-radius: 4px;

    &:hover {
      background: rgba($primary, 0.5);
    }
  }
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

.toc-item {
  margin: 2px 0;
  position: relative;

  &.active {
    .toc-link {
      color: $primary;
      background: $bg-hover;
      font-weight: 600;

      &::before {
        opacity: 1;
        transform: translateY(-50%) scaleY(1);
      }
    }
  }
}

.toc-link {
  display: block;
  padding: 8px 16px 8px 24px;
  color: $text-secondary;
  text-decoration: none;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 8px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  // 左侧指示条
  &::before {
    content: '';
    position: absolute;
    left: 6px;
    top: 50%;
    transform: translateY(-50%) scaleY(0);
    width: 4px;
    height: 18px;
    background: $primary;
    border-radius: 2px;
    opacity: 0;
    transition: all 0.2s ease;
  }

  &:hover {
    color: $primary;
    background: $bg-hover;
  }
}

// 缩进层级处理 - 改为 margin-left 缩进，让色块也跟着缩进
.level-1 {
  .toc-link {
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }
}

.level-2 {
  margin-left: 12px;
  .toc-link {
    font-size: 14px;
  }
}

.level-3 {
  margin-left: 24px;
  .toc-link {
    font-size: 13px;
  }
}

.level-4,
.level-5,
.level-6 {
  margin-left: 36px;
  .toc-link {
    font-size: 13px;
  }
}

// 响应式隐藏
@media (max-width: 1200px) {
  .toc-sidebar {
    display: none;
  }
}
</style>
