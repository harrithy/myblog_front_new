<template>
  <div class="happy-new-year-page">
    <div class="background-pattern" />
    <div class="background-glow glow-left" />
    <div class="background-glow glow-right" />

    <nav class="top-nav">
      <div class="brand">
        <span class="material-icons brand-icon">local_fire_department</span>
        <span class="brand-text">新春祝福</span>
      </div>
      <div class="nav-actions">
        <button
          class="sound-button"
          :aria-label="isSoundOn ? '关闭音效' : '开启音效'"
          @click="toggleSound"
        >
          <span class="material-icons icon-lg">{{ isSoundOn ? 'volume_up' : 'volume_off' }}</span>
          <span class="label-text">{{ isSoundOn ? '音效开启' : '音效关闭' }}</span>
          <div v-show="isSoundOn" class="audio-viz" aria-hidden="true">
            <span class="audio-bar" />
            <span class="audio-bar" />
            <span class="audio-bar" />
          </div>
        </button>
        <!-- <button class="icon-button" aria-label="切换语言">
          <span class="material-icons">translate</span>
        </button> -->
        <!-- <button class="login-button">登录</button>  -->
      </div>
    </nav>

    <main class="page-content">
      <section class="hero-section">
        <div class="hero-tag">
          <span class="material-icons tag-icon">event</span>
          乙巳年 · 2026 马年大吉
        </div>
        <h1 class="hero-title">
          龙马精神
          <span class="gold-gradient-text title-accent">
            万事如意
            <svg class="title-underline" preserveAspectRatio="none" viewBox="0 0 100 10">
              <path d="M0 5 Q 50 12 100 5" fill="none" stroke="currentColor" stroke-width="3" />
            </svg>
          </span>
        </h1>
        <p class="hero-subtitle">一键生成富有文采的新春贺词，为亲朋好友送上最真挚的马年祝福。</p>
      </section>

      <section class="generator-card">
        <div class="ornament-symbol" aria-hidden="true">✦</div>
        <div class="horse-track" aria-hidden="true">
          <span class="material-icons horse-runner" :class="{ 'horse-anim': horseAnimating }"
            >pets</span
          >
        </div>
        <div ref="fireworksLayerRef" class="fireworks-layer" aria-hidden="true">
          <span
            v-for="particle in fireworkParticles"
            :key="particle.id"
            class="firework-particle"
            :style="{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              backgroundColor: particle.color,
              '--tx': `${particle.tx}px`,
              '--ty': `${particle.ty}px`,
            }"
          />
        </div>
        <div class="lantern lantern-lg">
          <span class="lantern-line" />
        </div>
        <div class="lantern lantern-sm">
          <span class="lantern-line" />
        </div>

        <div class="generator-content">
          <div class="center-icon-wrap">
            <div class="center-icon-box" :class="{ pulse: iconPulse }">
              <span class="material-icons center-icon">auto_awesome</span>
            </div>
            <div class="glow-effect" :class="{ show: glowVisible }" />
          </div>

          <div class="wish-block">
            <h2 class="wish-text" :class="{ fading: wishFading }">"{{ currentBlessing }}"</h2>
            <p class="wish-source">— 传统吉言</p>
          </div>

          <div class="action-row">
            <button class="primary-button" :disabled="isGenerating" @click="handleGenerate">
              <span class="material-icons">shuffle</span>
              {{ isGenerating ? '生成中...' : '生成贺词' }}
            </button>
            <button class="secondary-button" @click="handleCopyCurrent">
              <span class="material-icons">content_copy</span>
              复制
            </button>
            <button class="secondary-button" aria-label="分享贺词">
              <span class="material-icons">share</span>
            </button>
          </div>
        </div>
        <div class="bottom-gold-line" />
      </section>

      <section class="content-grid">
        <article class="content-column hot-panel">
          <header class="panel-header">
            <h3 class="panel-title">
              <span class="material-icons panel-icon">trending_up</span>
              热门贺词
            </h3>
            <button class="link-button">查看全部</button>
          </header>

          <ul class="hot-list">
            <li v-for="(item, index) in hotBlessings" :key="`${item}-${index}`" class="hot-item">
              <div class="item-content">
                <p class="item-text">{{ item }}</p>
                <div class="item-meta">
                  <span class="item-tag">{{ hotTags[index % hotTags.length] }}</span>
                  <span class="item-used">已使用 {{ hotUsed[index % hotUsed.length] }}</span>
                </div>
              </div>
              <button
                class="copy-button"
                :aria-label="`复制热门贺词 ${index + 1}`"
                @click="handleCopyHot(item)"
              >
                <span class="material-icons">content_copy</span>
              </button>
            </li>
          </ul>
        </article>

        <article class="content-column recent-panel">
          <header class="panel-header">
            <h3 class="panel-title">
              <span class="material-icons panel-icon">history</span>
              最近复制
            </h3>
            <button class="link-button" @click="clearRecentRecords">清空记录</button>
          </header>

          <div class="recent-wrap">
            <p v-if="recentCopyRecords.length === 0" class="empty-state">
              还没有复制记录，先生成一条并复制吧。
            </p>
            <ul v-else class="recent-list">
              <li v-for="record in recentCopyRecords" :key="record.id" class="recent-item">
                <div class="recent-mark">
                  <span class="material-icons">check_circle</span>
                </div>
                <div class="recent-main">
                  <p class="recent-text">"{{ record.text }}"</p>
                  <span class="recent-time">{{ formatCopiedAt(record.copiedAt) }}</span>
                </div>
                <button
                  class="copy-button"
                  aria-label="再次复制"
                  @click="handleCopyRecent(record.text)"
                >
                  <span class="material-icons">content_copy</span>
                </button>
              </li>
            </ul>
          </div>
        </article>
      </section>

      <section class="knowledge-card">
        <div class="knowledge-icon" aria-hidden="true">
          <span class="material-icons">pets</span>
        </div>
        <div class="knowledge-content">
          <h3>民俗小知识：关于马年</h3>
          <p>
            在中国文化中，马象征着奔腾、进取和活力。“龙马精神”是新春常见祝福语之一，寓意着人们在新的一年里精力充沛、奋发向上。
          </p>
          <button class="link-button">了解更多春节习俗</button>
        </div>
      </section>
    </main>

    <footer class="page-footer">© 2026 马年新春贺词生成器. 用心设计，传递喜悦。</footer>

    <div class="toast" :class="{ show: toastVisible }">
      <span class="material-icons toast-icon">check_circle</span>
      <span>{{ toastText }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'HappyNewYearPage',
})

import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'

type BlessingSource = 'generated' | 'hot' | 'recent'

interface CopyRecord {
  id: string
  text: string
  source: BlessingSource
  copiedAt: string
}

interface FireworkParticle {
  id: number
  x: number
  y: number
  tx: number
  ty: number
  color: string
}

const MAX_RECENT = 20
const RECENT_KEY = 'happy_new_year_recent_copies_v2'

const hotBlessings = [
  '金戈铁马闻征鼓，只争朝夕启新程。祝您在新的一年里，马到成功，一马当先！',
  '马年到来喜事多，合家团圆幸福多。祝您身体健康，万事如意，笑口常开！',
  '龙马精神身体棒，事业有成财运旺。祝您新年快乐，福气满满！',
]

const hotTags = ['职场祝愿', '家庭祝福', '健康长寿']
const hotUsed = ['1.2万次', '8500次', '6200次']

const wishes = [
  '马蹄声声辞旧岁，喜气洋洋迎新春。祝您马年行大运，前程似锦步步高！',
  '金戈铁马闻征鼓，只争朝夕启新程。祝您在新的一年里，马到成功，一马当先！',
  '龙马精神身体棒，事业有成财运旺。祝您新年快乐，福气满满！',
  '策马扬鞭奔小康，欣欣向荣家业旺。祝您万事如意，阖家幸福！',
  '新的一年，愿您如千里马般驰骋疆场，大展宏图，马到成功！',
  '马年到，好运到，祝您身体健康，工作顺利，财源广进，万事胜意！',
  '龙马精神，万事如意！祝您马年吉祥，幸福安康！',
  '春风得意马蹄疾，一日看尽长安花。祝您马年心想事成，快乐无边！',
]

const isGenerating = ref(false)
const isSoundOn = ref(true)
const currentBlessing = ref(wishes[0])
const wishFading = ref(false)
const iconPulse = ref(false)
const glowVisible = ref(false)
const horseAnimating = ref(false)
const fireworkParticles = ref<FireworkParticle[]>([])
const recentCopyRecords = ref<CopyRecord[]>([])
const toastVisible = ref(false)
const toastText = ref('贺词已复制到剪贴板！')
const fireworksLayerRef = ref<HTMLElement | null>(null)
const timerPool = new Set<number>()

const runAfter = (callback: () => void, delay: number) => {
  const id = window.setTimeout(() => {
    timerPool.delete(id)
    callback()
  }, delay)
  timerPool.add(id)
  return id
}

const createRecordId = () => {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const randomPick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

const toggleSound = () => {
  isSoundOn.value = !isSoundOn.value
}

const isValidSource = (source: unknown): source is BlessingSource => {
  return source === 'generated' || source === 'hot' || source === 'recent'
}

const normalizeRecord = (record: unknown): CopyRecord | null => {
  if (!record || typeof record !== 'object') return null

  const candidate = record as Partial<CopyRecord>
  if (typeof candidate.text !== 'string' || !candidate.text.trim()) return null
  if (typeof candidate.copiedAt !== 'string') return null
  if (!isValidSource(candidate.source)) return null

  return {
    id: typeof candidate.id === 'string' && candidate.id ? candidate.id : createRecordId(),
    text: candidate.text.trim(),
    source: candidate.source,
    copiedAt: candidate.copiedAt,
  }
}

const saveRecentToStorage = () => {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentCopyRecords.value))
  } catch (error) {
    console.error('保存最近复制记录失败:', error)
  }
}

const loadRecentFromStorage = () => {
  const raw = localStorage.getItem(RECENT_KEY)
  if (!raw) return

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      recentCopyRecords.value = []
      return
    }

    recentCopyRecords.value = parsed
      .map((item) => normalizeRecord(item))
      .filter((item): item is CopyRecord => item !== null)
      .slice(0, MAX_RECENT)
  } catch (error) {
    console.error('读取最近复制记录失败:', error)
    recentCopyRecords.value = []
  }
}

const pushRecentCopy = (text: string, source: BlessingSource) => {
  const normalizedText = text.trim()
  if (!normalizedText) return

  const newRecord: CopyRecord = {
    id: createRecordId(),
    text: normalizedText,
    source,
    copiedAt: new Date().toISOString(),
  }

  const dedupedRecords = recentCopyRecords.value.filter((item) => item.text !== normalizedText)
  recentCopyRecords.value = [newRecord, ...dedupedRecords].slice(0, MAX_RECENT)
  saveRecentToStorage()
}

const clearRecentRecords = () => {
  recentCopyRecords.value = []
  saveRecentToStorage()
}

const copyWithFallback = (text: string) => {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'readonly')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()

  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch (error) {
    console.error('fallback copy failed:', error)
  } finally {
    document.body.removeChild(textarea)
  }

  return copied
}

const showToast = (text: string) => {
  toastText.value = text
  toastVisible.value = true
  runAfter(() => {
    toastVisible.value = false
  }, 2200)
}

const copyText = async (text: string, source: BlessingSource) => {
  const normalizedText = text.trim()
  if (!normalizedText) {
    ElMessage.warning('暂无可复制内容')
    return
  }

  let copied = false

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(normalizedText)
      copied = true
    }
  } catch {
    copied = false
  }

  if (!copied) {
    copied = copyWithFallback(normalizedText)
  }

  if (!copied) {
    ElMessage.error('复制失败，请手动复制')
    return
  }

  pushRecentCopy(normalizedText, source)
  showToast('贺词已复制到剪贴板！')
}

const createFireworks = async () => {
  await nextTick()
  const layer = fireworksLayerRef.value
  if (!layer) return

  const { width, height } = layer.getBoundingClientRect()
  const centerX = width / 2
  const centerY = height / 2
  const colors = ['#ffd700', '#c9182b', '#f59e0b', '#ffffff']
  const particles: FireworkParticle[] = []

  for (let i = 0; i < 30; i += 1) {
    const angle = Math.random() * Math.PI * 2
    const distance = 50 + Math.random() * 150
    particles.push({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }

  fireworkParticles.value = particles
  runAfter(() => {
    fireworkParticles.value = []
  }, 900)
}

const triggerHorseAnimation = () => {
  horseAnimating.value = false
  requestAnimationFrame(() => {
    horseAnimating.value = true
    runAfter(() => {
      horseAnimating.value = false
    }, 2100)
  })
}

const handleGenerate = async () => {
  if (isGenerating.value) return

  isGenerating.value = true
  iconPulse.value = true
  glowVisible.value = true
  runAfter(() => {
    iconPulse.value = false
    glowVisible.value = false
  }, 320)

  wishFading.value = true
  runAfter(() => {
    currentBlessing.value = randomPick(wishes)
    wishFading.value = false
  }, 220)

  if (isSoundOn.value) {
    void createFireworks()
    triggerHorseAnimation()
  }

  runAfter(() => {
    isGenerating.value = false
  }, 360)
}

const handleCopyCurrent = async () => {
  await copyText(currentBlessing.value, 'generated')
}

const handleCopyHot = async (text: string) => {
  await copyText(text, 'hot')
}

const handleCopyRecent = async (text: string) => {
  await copyText(text, 'recent')
}

const formatCopiedAt = (value: string) => {
  const target = new Date(value)
  if (Number.isNaN(target.getTime())) return value

  const diff = Date.now() - target.getTime()
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.max(1, Math.floor(diff / 60_000))}分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}小时前`
  return target.toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadRecentFromStorage()
})

onBeforeUnmount(() => {
  timerPool.forEach((id) => clearTimeout(id))
  timerPool.clear()
})
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;500;600;700;900&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.happy-new-year-page {
  --primary: #c9182b;
  --primary-hover: #a61020;
  --accent: #ffd700;
  --gold-dark: #b8860b;
  --background-light: #fffaf0;
  --paper-light: #fffdf5;
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--background-light);
  color: #3f2318;
  font-family: 'Noto Serif SC', serif;
}

.background-pattern {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 1;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9182b' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.background-glow {
  position: fixed;
  pointer-events: none;
  border-radius: 999px;
  filter: blur(80px);
  z-index: 0;
}

.glow-left {
  top: -120px;
  left: -120px;
  width: 350px;
  height: 350px;
  background: rgba(201, 24, 43, 0.16);
}

.glow-right {
  right: -160px;
  bottom: -160px;
  width: 480px;
  height: 480px;
  background: rgba(255, 215, 0, 0.15);
}

.top-nav {
  position: relative;
  z-index: 20;
  width: 100%;
  min-height: 72px;
  padding: 12px clamp(14px, 3vw, 24px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(201, 24, 43, 0.2);
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.brand-icon {
  color: var(--primary);
  font-size: 32px;
}

.brand-text {
  color: var(--primary);
  font-size: clamp(24px, 3vw, 28px);
  font-family: 'Ma Shan Zheng', cursive;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sound-button,
.icon-button,
.login-button {
  min-height: 44px;
  border: 1px solid transparent;
  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease;
  cursor: pointer;
}

.sound-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  border-color: rgba(201, 24, 43, 0.2);
  background: rgba(201, 24, 43, 0.05);
  color: var(--primary);
}

.sound-button:hover {
  background: rgba(201, 24, 43, 0.1);
}

.icon-lg {
  font-size: 22px;
}

.label-text {
  font-size: 14px;
  font-weight: 600;
}

.audio-viz {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 16px;
  color: rgba(201, 24, 43, 0.72);
}

.audio-bar {
  width: 3px;
  height: 4px;
  border-radius: 2px;
  background: currentColor;
  animation: sound-wave 1s ease-in-out infinite;
}

.audio-bar:nth-child(2) {
  animation-delay: 0.2s;
}

.audio-bar:nth-child(3) {
  animation-delay: 0.4s;
}

.icon-button {
  width: 44px;
  border-radius: 999px;
  background: transparent;
  color: #5d4a39;
}

.icon-button:hover {
  background: rgba(201, 24, 43, 0.1);
  color: var(--primary);
}

.login-button {
  padding: 8px 20px;
  border-radius: 999px;
  border-color: rgba(201, 24, 43, 0.35);
  background: transparent;
  color: var(--primary);
  font-size: 14px;
  font-weight: 700;
}

.login-button:hover {
  background: var(--primary);
  color: #fff;
}

.page-content {
  position: relative;
  z-index: 10;
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 36px 0 48px;
}

.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: 999px;
  border: 1px solid rgba(201, 24, 43, 0.24);
  background: rgba(201, 24, 43, 0.08);
  color: #922020;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.tag-icon {
  font-size: 16px;
}

.hero-title {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  font-family: 'Ma Shan Zheng', cursive;
  font-size: clamp(44px, 8vw, 84px);
  color: var(--primary);
  line-height: 1.1;
  text-shadow: 0 6px 22px rgba(201, 24, 43, 0.18);
}

.title-accent {
  position: relative;
  display: inline-block;
}

.title-underline {
  position: absolute;
  left: 0;
  bottom: -9px;
  width: 100%;
  height: 14px;
  color: var(--primary);
  opacity: 0.4;
}

.hero-subtitle {
  margin: 0;
  max-width: 640px;
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.75;
  color: #6b4a3b;
}

.gold-gradient-text {
  background: linear-gradient(to bottom, #fcd34d, #f59e0b, #b45309);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(180, 83, 9, 0.2);
}

.generator-card {
  margin-top: 30px;
  position: relative;
  border-radius: 20px;
  border: 2px solid rgba(201, 24, 43, 0.1);
  background: var(--paper-light);
  box-shadow: 0 24px 48px rgba(201, 24, 43, 0.12);
  overflow: hidden;
}

.ornament-symbol {
  position: absolute;
  top: 14px;
  left: 14px;
  color: rgba(201, 24, 43, 0.14);
  font-size: 52px;
  line-height: 1;
  pointer-events: none;
}

.horse-track {
  position: absolute;
  left: 0;
  top: 80px;
  width: 100%;
  height: 72px;
  pointer-events: none;
  overflow: hidden;
}

.horse-runner {
  position: absolute;
  left: -80px;
  top: 6px;
  color: rgba(201, 24, 43, 0.35);
  font-size: 52px;
  transform: scaleX(-1);
  opacity: 0;
}

.horse-anim {
  animation: horse-run 2s linear forwards;
}

.fireworks-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 5;
}

.firework-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  opacity: 0;
  animation: particle-explode 0.8s ease-out forwards;
}

.lantern {
  position: absolute;
  top: 0;
  background: linear-gradient(to bottom, #dc2626, #b91c1c);
  border-top: 4px solid #eab308;
  animation: sway 3s ease-in-out infinite alternate;
  transform-origin: top center;
}

.lantern-line {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  background: #ca8a04;
  opacity: 0.8;
}

.lantern-lg {
  right: 42px;
  width: 40px;
  height: 58px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.lantern-lg .lantern-line {
  width: 4px;
  height: 28px;
}

.lantern-sm {
  right: 98px;
  width: 30px;
  height: 44px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  animation-delay: 0.45s;
}

.lantern-sm .lantern-line {
  width: 2px;
  height: 20px;
}

.generator-content {
  position: relative;
  z-index: 10;
  padding: clamp(28px, 4vw, 56px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
}

.center-icon-wrap {
  position: relative;
}

.center-icon-box {
  position: relative;
  z-index: 2;
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid #f3c5b2;
  background: #fff4f0;
  transition: transform 0.25s ease;
}

.center-icon-box.pulse {
  transform: scale(1.16);
}

.center-icon {
  color: var(--primary);
  font-size: 52px;
}

.glow-effect {
  position: absolute;
  inset: -14px;
  border-radius: 999px;
  background: rgba(255, 215, 0, 0.65);
  filter: blur(22px);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.glow-effect.show {
  opacity: 0.45;
}

.wish-block {
  max-width: 840px;
  text-align: center;
}

.wish-text {
  margin: 0;
  color: #402116;
  font-family: 'Ma Shan Zheng', cursive;
  font-size: clamp(33px, 4.8vw, 50px);
  line-height: 1.48;
  transition: opacity 0.2s ease;
}

.wish-text.fading {
  opacity: 0;
}

.wish-source {
  margin: 12px 0 0;
  color: #9f7462;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.22em;
}

.action-row {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.primary-button,
.secondary-button {
  min-height: 48px;
  border-radius: 12px;
  border: 1px solid transparent;
  font-size: 17px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.primary-button {
  min-width: 220px;
  padding: 12px 22px;
  color: #fff;
  background: linear-gradient(to right, var(--primary), var(--primary-hover));
  border-color: #d04957;
  box-shadow: 0 10px 24px rgba(201, 24, 43, 0.3);
}

.primary-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.primary-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secondary-button {
  padding: 12px 18px;
  background: #fff;
  color: #49392e;
  border-color: rgba(145, 124, 113, 0.25);
}

.secondary-button:hover {
  background: #fff2e8;
  color: var(--primary);
}

.bottom-gold-line {
  height: 12px;
  width: 100%;
  background: linear-gradient(135deg, #fcd34d 0%, #f59e0b 50%, #b45309 100%);
}

.content-grid {
  margin-top: 30px;
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 20px;
}

.content-column {
  border-radius: 16px;
  border: 1px solid rgba(201, 24, 43, 0.1);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 10px 28px rgba(68, 30, 12, 0.08);
  padding: 18px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(145, 124, 113, 0.2);
}

.panel-title {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 24px;
  color: #3d2419;
}

.panel-icon {
  color: var(--primary);
}

.link-button {
  min-height: 36px;
  border: 0;
  background: transparent;
  color: var(--primary);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s ease;
}

.link-button:hover {
  color: var(--primary-hover);
}

.hot-list,
.recent-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hot-item,
.recent-item {
  border-radius: 12px;
  border: 1px solid rgba(201, 24, 43, 0.12);
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
}

.item-content,
.recent-main {
  flex: 1;
  min-width: 0;
}

.item-text,
.recent-text {
  margin: 0;
  font-size: 16px;
  color: #4a2e1f;
  line-height: 1.72;
  word-break: break-word;
}

.item-meta {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-tag {
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(201, 24, 43, 0.1);
  color: #9a202f;
  font-size: 12px;
  font-weight: 700;
}

.item-used {
  color: #8f7b6e;
  font-size: 12px;
}

.copy-button {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #8c7a6f;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.copy-button:hover {
  background: rgba(201, 24, 43, 0.08);
  color: var(--primary);
}

.recent-wrap {
  min-height: 292px;
  border-radius: 12px;
  border: 1px solid rgba(201, 24, 43, 0.1);
  background: rgba(255, 255, 255, 0.52);
  backdrop-filter: blur(2px);
  padding: 12px;
}

.recent-item {
  align-items: center;
}

.recent-mark {
  color: #49a74b;
  opacity: 0.8;
}

.recent-time {
  margin-top: 6px;
  display: block;
  color: #907b70;
  font-size: 12px;
}

.empty-state {
  margin: 0;
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #947767;
  line-height: 1.7;
}

.knowledge-card {
  margin-top: 30px;
  position: relative;
  display: flex;
  gap: 16px;
  border-radius: 20px;
  border: 1px solid rgba(201, 24, 43, 0.12);
  background: linear-gradient(135deg, #fff2ea, #ffefe2);
  padding: 24px;
  overflow: hidden;
}

.knowledge-icon {
  color: rgba(201, 24, 43, 0.1);
  font-size: 110px;
  pointer-events: none;
}

.knowledge-content {
  max-width: 760px;
}

.knowledge-content h3 {
  margin: 0;
  color: var(--primary);
  font-size: 28px;
}

.knowledge-content p {
  margin: 10px 0 14px;
  color: #5b4538;
  line-height: 1.8;
}

.page-footer {
  position: relative;
  z-index: 10;
  margin-top: 6px;
  border-top: 1px solid rgba(201, 24, 43, 0.12);
  background: rgba(255, 255, 255, 0.7);
  text-align: center;
  color: #8a6f61;
  padding: 18px 14px 30px;
  font-size: 14px;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translate(-50%, 120%);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  background: #1f1f1f;
  color: #fff;
  padding: 11px 18px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition:
    transform 0.28s ease,
    opacity 0.28s ease;
  z-index: 40;
}

.toast.show {
  transform: translate(-50%, 0);
  opacity: 1;
}

.toast-icon {
  color: #52c26d;
}

@keyframes sound-wave {
  0%,
  100% {
    height: 4px;
  }
  50% {
    height: 16px;
  }
}

@keyframes sway {
  from {
    transform: rotate(-5deg);
  }
  to {
    transform: rotate(5deg);
  }
}

@keyframes particle-explode {
  from {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  to {
    transform: translate(var(--tx), var(--ty)) scale(0);
    opacity: 0;
  }
}

@keyframes horse-run {
  0% {
    transform: translateX(-60px) scaleX(-1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(calc(100vw - 180px)) translateY(-8px) scaleX(-1);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .audio-bar,
  .lantern,
  .horse-anim,
  .firework-particle {
    animation: none !important;
  }

  .toast,
  .primary-button,
  .secondary-button,
  .copy-button {
    transition: none;
  }
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .top-nav {
    flex-wrap: wrap;
    gap: 10px;
  }

  .label-text {
    display: none;
  }

  .page-content {
    width: min(1120px, calc(100% - 20px));
    padding-top: 20px;
  }

  .generator-content {
    padding: 24px 16px 22px;
  }

  .wish-text {
    font-size: clamp(29px, 9vw, 44px);
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }

  .knowledge-card {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 48px;
    gap: 8px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .panel-title {
    font-size: 21px;
  }

  .knowledge-content h3 {
    font-size: 24px;
  }
}
</style>
