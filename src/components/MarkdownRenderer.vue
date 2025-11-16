<template>
  <div class="markdown-body" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

interface Props {
  content: string
}

const props = defineProps<Props>()

const renderedHtml = computed(() => {
  return renderMarkdown(props.content)
})
</script>

<style scoped lang="scss">
.markdown-body {
  color: #24292f;
  font-size: 16px;
  line-height: 1.75;
  word-wrap: break-word;

  // 标题样式 - 增强视觉层次
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 32px;
    margin-bottom: 16px;
    font-weight: 700;
    line-height: 1.3;
    color: #1f2937;

    &:first-child {
      margin-top: 0;
    }
  }

  h1 {
    font-size: 2.25em;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.4em;
    margin-bottom: 24px;
  }

  h2 {
    font-size: 1.75em;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.35em;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 1.5em;
  }

  h4 {
    font-size: 1.25em;
  }

  h5 {
    font-size: 1.1em;
  }

  h6 {
    font-size: 1em;
    color: #6b7280;
  }

  // 段落样式 - 改善可读性
  p {
    margin-top: 0;
    margin-bottom: 20px;
    line-height: 1.8;
  }

  // 链接样式 - 现代化设计
  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      color: #1d4ed8;
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 3px;
    }
  }

  // 强调样式
  strong {
    font-weight: 700;
    color: #111827;
  }

  em {
    font-style: italic;
    color: #374151;
  }

  // 代码块样式 - 优化可读性和美观度
  code {
    padding: 0.25em 0.5em;
    margin: 0;
    font-size: 0.9em;
    background-color: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace;
    color: #dc2626;
    font-weight: 500;
  }

  pre {
    padding: 20px;
    margin: 20px 0;
    overflow-x: auto;
    font-size: 0.9em;
    line-height: 1.6;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    code {
      display: block;
      padding: 0;
      margin: 0;
      overflow: visible;
      line-height: inherit;
      word-wrap: normal;
      background-color: transparent;
      border: 0;
      color: #1f2937;
      font-weight: 400;
    }
  }

  // 列表样式 - 增强层次感
  ul,
  ol {
    padding-left: 2em;
    margin-top: 0;
    margin-bottom: 20px;

    ul,
    ol {
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }

  ul {
    list-style-type: disc;

    ul {
      list-style-type: circle;

      ul {
        list-style-type: square;
      }
    }
  }

  li {
    margin-top: 8px;
    margin-bottom: 8px;
    line-height: 1.7;

    > p {
      margin-bottom: 8px;
    }
  }

  // 引用样式 - 现代化设计
  blockquote {
    padding: 16px 20px;
    margin: 20px 0;
    color: #4b5563;
    background-color: #f9fafb;
    border-left: 4px solid #3b82f6;
    border-radius: 0 8px 8px 0;
    font-style: italic;

    > :first-child {
      margin-top: 0;
    }

    > :last-child {
      margin-bottom: 0;
    }

    p {
      margin-bottom: 12px;
    }
  }

  // 表格样式 - 优雅设计
  table {
    border-spacing: 0;
    border-collapse: collapse;
    margin: 24px 0;
    width: 100%;
    overflow: auto;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    thead {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);

      th {
        color: #fff;
        font-weight: 700;
      }
    }

    th {
      padding: 12px 16px;
      text-align: left;
      border: 1px solid #e5e7eb;
      background-color: #f9fafb;
    }

    td {
      padding: 12px 16px;
      border: 1px solid #e5e7eb;
    }

    tr {
      background-color: #fff;
      transition: background-color 0.2s ease;

      &:nth-child(2n) {
        background-color: #f9fafb;
      }

      &:hover {
        background-color: #f3f4f6;
      }
    }
  }

  // 水平线样式 - 精致分隔
  hr {
    height: 2px;
    padding: 0;
    margin: 32px 0;
    background: linear-gradient(90deg, transparent, #e5e7eb 50%, transparent);
    border: 0;
  }

  // 图片样式 - 优化展示
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    margin: 20px 0;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
  }

  // 任务列表样式
  input[type='checkbox'] {
    margin-right: 8px;
  }

  // 删除线
  del {
    color: #9ca3af;
    text-decoration-thickness: 2px;
  }
}
</style>
