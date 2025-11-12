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
  line-height: 1.6;
  word-wrap: break-word;

  // 标题样式
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }

  h1 {
    font-size: 2em;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }

  h2 {
    font-size: 1.5em;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }

  h3 {
    font-size: 1.25em;
  }

  // 段落样式
  p {
    margin-top: 0;
    margin-bottom: 16px;
  }

  // 链接样式
  a {
    color: #0366d6;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  // 代码块样式
  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  }

  pre {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 6px;

    code {
      display: inline;
      padding: 0;
      margin: 0;
      overflow: visible;
      line-height: inherit;
      word-wrap: normal;
      background-color: transparent;
      border: 0;
    }
  }

  // 列表样式
  ul,
  ol {
    padding-left: 2em;
    margin-top: 0;
    margin-bottom: 16px;
  }

  li {
    margin-top: 0.25em;
  }

  // 引用样式
  blockquote {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
    margin: 0 0 16px 0;

    > :first-child {
      margin-top: 0;
    }

    > :last-child {
      margin-bottom: 0;
    }
  }

  // 表格样式
  table {
    border-spacing: 0;
    border-collapse: collapse;
    margin-top: 0;
    margin-bottom: 16px;
    width: 100%;
    overflow: auto;

    th {
      font-weight: 600;
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }

    td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }

    tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;

      &:nth-child(2n) {
        background-color: #f6f8fa;
      }
    }
  }

  // 水平线样式
  hr {
    height: 0.25em;
    padding: 0;
    margin: 24px 0;
    background-color: #e1e4e8;
    border: 0;
  }

  // 图片样式
  img {
    max-width: 100%;
    box-sizing: content-box;
    background-color: #fff;
  }
}
</style>
