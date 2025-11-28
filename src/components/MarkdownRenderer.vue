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
// 字体变量
$font-serif: 'Georgia', 'Times New Roman', 'Songti SC', serif;
$font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
$font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace;

// 颜色变量
$color-text-primary: #433422;
$color-text-secondary: #5d4037;
$color-accent: #d4a373;
$color-link: #b5835a;
$color-link-hover: #8d6e63;
$color-border: #e0d0c0;
$color-bg-code: #f4efe9;
$color-bg-quote: #faf6f1;

.markdown-body {
  color: $color-text-primary;
  font-size: 17px;
  line-height: 1.85;
  word-wrap: break-word;
  font-family: $font-sans;

  // 使用 :deep() 穿透 scoped，让样式应用到 v-html 生成的内容
  :deep() {
    // 标题样式 - 衬线字体，文学感
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 40px;
      margin-bottom: 24px;
      font-weight: 700;
      line-height: 1.3;
      color: #2c1810;
      font-family: $font-serif;
      position: relative;

      &:first-child {
        margin-top: 0;
      }
    }

    h1 {
      font-size: 2.2em;
      border-bottom: 2px solid $color-border;
      padding-bottom: 0.3em;
      text-align: left;
      color: $color-text-primary;
    }

    h2 {
      font-size: 1.7em;
      padding-bottom: 0.3em;
      border-bottom: 1px solid rgba($color-border, 0.5);
    }

    h3 {
      font-size: 1.4em;
      color: $color-text-primary;
    }

    h4 {
      font-size: 1.25em;
      font-weight: 600;
    }

    h5 {
      font-size: 1.1em;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: $color-text-secondary;
    }

    h6 {
      font-size: 1em;
      color: #8d6e63;
      font-style: italic;
    }

    // 段落样式
    p {
      margin-top: 0;
      margin-bottom: 24px;
      text-align: justify;
    }

    // 链接样式
    a {
      color: $color-link;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: all 0.3s ease;
      padding-bottom: 1px;

      &:hover {
        color: $color-link-hover;
        border-bottom-color: $color-link-hover;
        background-color: rgba(212, 163, 115, 0.1);
      }
    }

    // 强调样式
    strong {
      font-weight: 700;
      color: #2c1810;
    }

    em {
      font-style: italic;
      font-family: $font-serif;
      color: $color-text-secondary;
    }

    // 引用样式
    blockquote {
      padding: 16px 20px;
      margin: 24px 0;
      color: $color-text-secondary;
      background-color: rgba($color-accent, 0.1);
      border-left: 4px solid $color-accent;
      border-radius: 4px;
      font-family: $font-serif;

      p {
        margin-bottom: 8px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    // 代码块样式
    code {
      padding: 0.2em 0.4em;
      margin: 0 0.2em;
      font-size: 0.85em;
      background-color: rgba($color-accent, 0.15);
      border-radius: 4px;
      font-family: $font-mono;
      color: #c05850;
    }

    pre {
      padding: 40px 20px 20px;
      margin: 24px 0;
      overflow-x: auto;
      font-size: 0.9em;
      line-height: 1.6;
      background-color: #282c34;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 14px;
        left: 16px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #ff5f56;
        box-shadow:
          18px 0 0 #ffbd2e,
          36px 0 0 #27c93f;
      }

      code {
        display: block;
        padding: 0;
        margin: 0;
        overflow: visible;
        line-height: inherit;
        word-wrap: normal;
        background-color: transparent;
        border: 0;
        color: #abb2bf;
        font-family: $font-mono;
      }

      &::-webkit-scrollbar {
        height: 8px;
        background-color: #282c34;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #5d5a5e;
        border-radius: 4px;
      }
    }

    // 列表样式
    ul,
    ol {
      padding-left: 1.5em;
      margin-bottom: 24px;
    }

    ul {
      list-style-type: none;

      li {
        position: relative;
        padding-left: 1.2em;

        &::before {
          content: '•';
          position: absolute;
          left: 0;
          color: $color-accent;
          font-size: 1.2em;
          line-height: 1.6;
        }
      }
    }

    ol {
      list-style-type: decimal;

      li {
        padding-left: 0.5em;
        &::marker {
          color: $color-text-secondary;
          font-weight: 600;
          font-family: $font-serif;
        }
      }
    }

    li {
      margin-bottom: 10px;

      > p {
        margin-bottom: 10px;
      }
    }

    // 表格样式
    table {
      border-spacing: 0;
      border-collapse: collapse;
      margin: 32px 0;
      width: 100%;
      overflow: auto;
      font-size: 0.95em;

      thead {
        border-bottom: 2px solid $color-accent;

        th {
          color: #2c1810;
          font-weight: 700;
          padding: 12px 16px;
          text-align: left;
          font-family: $font-serif;
        }
      }

      td {
        padding: 12px 16px;
        border-bottom: 1px solid $color-border;
      }

      tr {
        transition: background-color 0.2s ease;

        &:hover {
          background-color: rgba(212, 163, 115, 0.05);
        }
      }
    }

    // 水平线样式
    hr {
      height: 1px;
      padding: 0;
      margin: 48px auto;
      background: transparent;
      border: 0;
      border-top: 1px solid $color-border;
      width: 60%;
      position: relative;

      &::after {
        content: '❦';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fffcf9;
        padding: 0 10px;
        color: $color-accent;
        font-size: 20px;
      }
    }

    // 图片样式
    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 10px auto;
      border-radius: 2px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      border: 8px solid white;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.01);
      }
    }

    // 任务列表样式
    input[type='checkbox'] {
      appearance: none;
      width: 16px;
      height: 16px;
      border: 1px solid $color-accent;
      border-radius: 3px;
      margin-right: 8px;
      position: relative;
      top: 2px;
      cursor: pointer;

      &:checked {
        background-color: $color-accent;

        &::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
        }
      }
    }

    // 删除线
    del {
      color: #a1887f;
      text-decoration-color: $color-accent;
    }

    // 脚注
    sup {
      color: $color-accent;
      font-size: 0.75em;
      margin-left: 2px;
    }
  }
}
</style>
