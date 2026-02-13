<template>
  <div class="share-card-render-layer" aria-hidden="true">
    <canvas ref="canvasRef" :width="CARD_WIDTH" :height="CARD_HEIGHT" />
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'BlessingShareCard',
})

import { ref } from 'vue'

interface ShareCardImagePayload {
  blob: Blob
  fileName: string
}

const props = withDefaults(
  defineProps<{
    blessing: string
    title?: string
    subtitle?: string
    footer?: string
  }>(),
  {
    title: '新春祝福',
    subtitle: '乙巳年 · 2026 马年大吉',
    footer: '来自harrio',
  },
)

const CARD_WIDTH = 1080
const CARD_HEIGHT = 1620
const BLESSING_PANEL_WIDTH = CARD_WIDTH - 200
const BLESSING_PANEL_HEIGHT = 620

const canvasRef = ref<HTMLCanvasElement | null>(null)

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2))
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

const buildBlessingLines = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
) => {
  const normalizedText = text.trim().replace(/\s+/g, ' ') || '龙马精神，马年大吉，万事如意。'
  const chars = Array.from(normalizedText)
  const lines: string[] = []
  let currentLine = ''
  let consumedCount = 0

  for (const char of chars) {
    const candidate = `${currentLine}${char}`
    if (ctx.measureText(candidate).width <= maxWidth || currentLine.length === 0) {
      currentLine = candidate
      consumedCount += 1
      continue
    }

    lines.push(currentLine)
    currentLine = char
    consumedCount += 1
    if (lines.length === maxLines) break
  }

  if (lines.length < maxLines && currentLine) {
    lines.push(currentLine)
  }

  if (lines.length === maxLines && consumedCount < chars.length) {
    const lastIndex = lines.length - 1
    let clipped = lines[lastIndex]

    while (clipped.length > 1 && ctx.measureText(`${clipped}…`).width > maxWidth) {
      clipped = clipped.slice(0, -1)
    }

    lines[lastIndex] = `${clipped}…`
  }

  return lines
}

const drawBackground = (ctx: CanvasRenderingContext2D) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT)
  gradient.addColorStop(0, '#6f0114')
  gradient.addColorStop(0.52, '#8f0018')
  gradient.addColorStop(1, '#55000d')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  const glowLeft = ctx.createRadialGradient(220, 190, 40, 220, 190, 320)
  glowLeft.addColorStop(0, 'rgba(255, 210, 123, 0.44)')
  glowLeft.addColorStop(1, 'rgba(255, 210, 123, 0)')
  ctx.fillStyle = glowLeft
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  const glowRight = ctx.createRadialGradient(CARD_WIDTH - 220, 220, 30, CARD_WIDTH - 220, 220, 340)
  glowRight.addColorStop(0, 'rgba(255, 220, 170, 0.35)')
  glowRight.addColorStop(1, 'rgba(255, 220, 170, 0)')
  ctx.fillStyle = glowRight
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
  for (let i = 0; i < 70; i += 1) {
    const x = Math.random() * CARD_WIDTH
    const y = Math.random() * CARD_HEIGHT
    const r = Math.random() * 2.8 + 1
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
}

const drawFrame = (ctx: CanvasRenderingContext2D) => {
  drawRoundedRect(ctx, 56, 56, CARD_WIDTH - 112, CARD_HEIGHT - 112, 42)
  ctx.strokeStyle = 'rgba(255, 222, 156, 0.78)'
  ctx.lineWidth = 3
  ctx.stroke()

  drawRoundedRect(ctx, 80, 80, CARD_WIDTH - 160, CARD_HEIGHT - 160, 34)
  ctx.strokeStyle = 'rgba(255, 240, 210, 0.52)'
  ctx.lineWidth = 1.5
  ctx.stroke()
}

const drawTextContent = (ctx: CanvasRenderingContext2D) => {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.fillStyle = '#f8dab1'
  ctx.font = "600 42px 'Noto Serif SC', 'Microsoft YaHei', serif"
  ctx.fillText(props.subtitle, CARD_WIDTH / 2, 248)

  ctx.fillStyle = '#fff4dd'
  ctx.font = "900 108px 'Noto Serif SC', 'Microsoft YaHei', serif"
  ctx.fillText(props.title, CARD_WIDTH / 2, 376)

  const panelX = (CARD_WIDTH - BLESSING_PANEL_WIDTH) / 2
  const panelY = 510
  const panelGradient = ctx.createLinearGradient(
    panelX,
    panelY,
    panelX,
    panelY + BLESSING_PANEL_HEIGHT,
  )
  panelGradient.addColorStop(0, 'rgba(255, 247, 232, 0.96)')
  panelGradient.addColorStop(1, 'rgba(255, 236, 210, 0.9)')

  drawRoundedRect(ctx, panelX, panelY, BLESSING_PANEL_WIDTH, BLESSING_PANEL_HEIGHT, 30)
  ctx.fillStyle = panelGradient
  ctx.fill()

  drawRoundedRect(ctx, panelX, panelY, BLESSING_PANEL_WIDTH, BLESSING_PANEL_HEIGHT, 30)
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgba(185, 74, 53, 0.3)'
  ctx.stroke()

  ctx.fillStyle = '#9f2732'
  ctx.font = "500 42px 'Noto Serif SC', 'Microsoft YaHei', serif"
  ctx.fillText('送你一份新春祝福', CARD_WIDTH / 2, panelY + 92)

  ctx.fillStyle = '#701018'
  ctx.font = "700 66px 'Noto Serif SC', 'Microsoft YaHei', serif"
  const lineHeight = 96
  const textMaxWidth = BLESSING_PANEL_WIDTH - 140
  const blessingLines = buildBlessingLines(ctx, props.blessing, textMaxWidth, 4)
  const totalHeight = blessingLines.length * lineHeight
  const textStartY = panelY + 210 + Math.max(0, (260 - totalHeight) / 2)

  blessingLines.forEach((line, index) => {
    ctx.fillText(line, CARD_WIDTH / 2, textStartY + index * lineHeight)
  })

  ctx.fillStyle = '#8a6a52'
  ctx.font = "500 34px 'Noto Serif SC', 'Microsoft YaHei', serif"
  ctx.fillText(props.footer, CARD_WIDTH / 2, CARD_HEIGHT - 136)
}

const waitForFonts = async () => {
  const fontSet = (document as Document & { fonts?: FontFaceSet }).fonts
  if (!fontSet) return
  try {
    await fontSet.ready
  } catch {
    // Ignore font loading errors and continue with fallback fonts.
  }
}

const canvasToBlob = (canvas: HTMLCanvasElement) => {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}

const generateImage = async (): Promise<ShareCardImagePayload | null> => {
  await waitForFonts()

  const canvas = canvasRef.value
  if (!canvas) return null

  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT)
  drawBackground(ctx)
  drawFrame(ctx)
  drawTextContent(ctx)

  const blob = await canvasToBlob(canvas)
  if (!blob) return null

  return {
    blob,
    fileName: `马年新春贺词-${Date.now()}.png`,
  }
}

defineExpose({
  generateImage,
})
</script>

<style lang="scss" scoped>
.share-card-render-layer {
  position: fixed;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
}
</style>
