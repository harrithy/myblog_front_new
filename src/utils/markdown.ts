import MarkdownIt from 'markdown-it'

const BLOCKED_TAG_SELECTOR =
  'script,iframe,object,embed,style,link,meta,base,form,input,button,textarea,select,svg,math'
const ABSOLUTE_URL_PROTOCOL_RE = /^[a-zA-Z][a-zA-Z\d+.-]*:/

type UrlKind = 'link' | 'image'

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
}

const isSafeUrl = (value: string, kind: UrlKind): boolean => {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return false
  }

  if (trimmedValue.startsWith('#')) {
    return kind === 'link'
  }

  if (!ABSOLUTE_URL_PROTOCOL_RE.test(trimmedValue) && !trimmedValue.startsWith('//')) {
    return true
  }

  try {
    const parsedUrl = trimmedValue.startsWith('//')
      ? new URL(`https:${trimmedValue}`)
      : new URL(trimmedValue)

    if (kind === 'image') {
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
    }

    return (
      parsedUrl.protocol === 'http:' ||
      parsedUrl.protocol === 'https:' ||
      parsedUrl.protocol === 'mailto:' ||
      parsedUrl.protocol === 'tel:'
    )
  } catch {
    return false
  }
}

const isExternalHttpUrl = (value: string): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  const trimmedValue = value.trim()
  if (!trimmedValue) {
    return false
  }

  try {
    const parsedUrl = trimmedValue.startsWith('//')
      ? new URL(`https:${trimmedValue}`)
      : new URL(trimmedValue, window.location.origin)

    return (
      (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') &&
      parsedUrl.origin !== window.location.origin
    )
  } catch {
    return false
  }
}

const sanitizeRenderedHtml = (html: string): string => {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return html
  }

  const parsedDocument = new DOMParser().parseFromString(html, 'text/html')

  parsedDocument.querySelectorAll(BLOCKED_TAG_SELECTOR).forEach((element) => {
    element.remove()
  })

  parsedDocument.querySelectorAll('*').forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const attributeName = attribute.name.toLowerCase()
      const attributeValue = attribute.value.trim()

      if (
        attributeName.startsWith('on') ||
        attributeName === 'style' ||
        attributeName === 'srcdoc' ||
        attributeName === 'formaction'
      ) {
        element.removeAttribute(attribute.name)
        return
      }

      if (
        (attributeName === 'href' || attributeName === 'xlink:href') &&
        !isSafeUrl(attributeValue, 'link')
      ) {
        element.removeAttribute(attribute.name)
        return
      }

      if (attributeName === 'src' && !isSafeUrl(attributeValue, 'image')) {
        element.removeAttribute(attribute.name)
      }
    })

    if (element.tagName !== 'A') {
      return
    }

    const href = element.getAttribute('href')
    if (!href) {
      element.removeAttribute('target')
      element.removeAttribute('rel')
      return
    }

    if (isExternalHttpUrl(href)) {
      element.setAttribute('target', '_blank')
      element.setAttribute('rel', 'noopener noreferrer nofollow')
      return
    }

    element.removeAttribute('target')
    element.removeAttribute('rel')
  })

  return parsedDocument.body.innerHTML
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
  langPrefix: 'language-',
})

md.renderer.rules.heading_open = (tokens, idx) => {
  const token = tokens[idx]
  const level = token.tag
  const contentToken = tokens[idx + 1]
  const text = contentToken?.children?.map((item) => item.content).join('') || ''
  const id = slugify(text)

  return `<${level} id="${id}">`
}

export const renderMarkdown = (markdown: string): string => {
  return sanitizeRenderedHtml(md.render(markdown))
}

export const renderMarkdownInline = (markdown: string): string => {
  return sanitizeRenderedHtml(md.renderInline(markdown))
}

export default md
