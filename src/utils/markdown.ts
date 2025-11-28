import MarkdownIt from 'markdown-it'

/**
 * 生成标题的 slug（用于锚点 id）
 */
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
}

/**
 * Markdown-it 实例配置
 * 可以根据需要添加更多插件和配置
 */
const md = new MarkdownIt({
  html: true, // 启用 HTML 标签
  linkify: true, // 自动转换 URL 为链接
  typographer: true, // 启用一些语言中立的替换和引号美化
  breaks: true, // 转换段落里的 '\n' 到 <br>
  langPrefix: 'language-', // 给代码块的 CSS 语言前缀
})

// 自定义标题渲染，添加 id 锚点
md.renderer.rules.heading_open = (tokens, idx) => {
  const token = tokens[idx]
  const level = token.tag // h1, h2, h3...
  // 获取标题文本
  const contentToken = tokens[idx + 1]
  const text = contentToken?.children?.map((t) => t.content).join('') || ''
  const id = slugify(text)
  return `<${level} id="${id}">`
}

/**
 * 渲染 Markdown 文本为 HTML
 * @param markdown - Markdown 格式的文本
 * @returns 渲染后的 HTML 字符串
 */
export const renderMarkdown = (markdown: string): string => {
  return md.render(markdown)
}

/**
 * 渲染单行 Markdown 文本为 HTML（不包含 <p> 标签）
 * @param markdown - Markdown 格式的文本
 * @returns 渲染后的 HTML 字符串
 */
export const renderMarkdownInline = (markdown: string): string => {
  return md.renderInline(markdown)
}

/**
 * 导出 markdown-it 实例，以便在需要时进行自定义配置
 */
export default md
