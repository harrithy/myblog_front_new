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
        <!-- <div class="horse-track" aria-hidden="true">
          <span class="material-icons horse-runner" :class="{ 'horse-anim': horseAnimating }"
            >pets</span
          >
        </div> -->
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
            <h2 class="wish-text" :class="{ fading: wishFading }">
              {{ isGenerating ? '贺词正在生成中...' : `"${currentBlessing}"` }}
            </h2>
            <!-- <p class="wish-source">— 传统吉言</p> -->
          </div>

          <div class="length-control">
            <span class="length-title">贺词长度</span>
            <button
              v-for="option in blessingLengthOptions"
              :key="option.value"
              class="length-chip"
              :class="{ active: selectedBlessingLength === option.value }"
              :disabled="isGenerating"
              @click="setBlessingLength(option.value)"
            >
              {{ option.label }}
            </button>
            <span class="length-hint">{{ selectedLengthRule.hint }}</span>
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
              推荐贺词
            </h3>
            <button class="link-button" @click="switchRecommendedBlessings">换一批</button>
          </header>

          <ul class="hot-list">
            <li
              v-for="(item, index) in recommendedBlessings"
              :key="`${item.text}-${index}`"
              class="hot-item"
            >
              <div class="item-content">
                <p class="item-text">{{ item.text }}</p>
                <div class="item-meta">
                  <span class="item-tag">{{ item.typeLabel }}</span>
                  <span class="item-used">推荐指数 {{ formatRecommendStars(item.stars) }}</span>
                </div>
              </div>
              <button
                class="copy-button"
                :aria-label="`复制推荐贺词 ${index + 1}`"
                @click="handleCopyRecommend(item.text)"
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
        <!-- <div class="knowledge-icon" aria-hidden="true">
          <span class="material-icons">pets</span>
        </div> -->
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

import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { aiApi } from '@/api/ai'
import {
  type HorseYearRecommendMessage,
  HORSE_YEAR_RECOMMEND_MESSAGES,
  HORSE_YEAR_RECOMMEND_PAGE_SIZE,
} from '@/constants/NewYearMessage'
import newYearBgmSrc from '@/assets/music/恭喜发财.m4a'

type BlessingSource = 'generated' | 'hot' | 'recent'
type BlessingLengthMode = 'short' | 'medium' | 'long'

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

interface BlessingLengthRule {
  label: string
  hint: string
  min: number
  max: number
}

const MAX_RECENT = 20
const RECENT_KEY = 'happy_new_year_recent_copies_v2'
const GENERATE_DEBOUNCE_MS = 260
const GENERATE_THROTTLE_MS = 2000
const BGM_VOLUME = 0.55

const BLESSING_LENGTH_RULES: Record<BlessingLengthMode, BlessingLengthRule> = {
  short: {
    label: '短',
    hint: '20字以内',
    min: 1,
    max: 20,
  },
  medium: {
    label: '中',
    hint: '20-40字',
    min: 20,
    max: 40,
  },
  long: {
    label: '长',
    hint: '40-80字',
    min: 40,
    max: 80,
  },
}

const blessingLengthOptions = [
  { value: 'short', label: '短' },
  { value: 'medium', label: '中' },
  { value: 'long', label: '长' },
] as const

const recommendStartIndex = ref(0)
const selectedBlessingLength = ref<BlessingLengthMode>('medium')

const recommendedBlessings = computed<HorseYearRecommendMessage[]>(() => {
  const recommendSource = HORSE_YEAR_RECOMMEND_MESSAGES
  const total = recommendSource.length
  if (total === 0) return []

  const batchSize = Math.min(HORSE_YEAR_RECOMMEND_PAGE_SIZE, total)
  const start = recommendStartIndex.value % total

  return Array.from({ length: batchSize }, (_, offset) => {
    const index = (start + offset) % total
    return recommendSource[index]
  })
})

const switchRecommendedBlessings = () => {
  const total = HORSE_YEAR_RECOMMEND_MESSAGES.length
  if (total <= HORSE_YEAR_RECOMMEND_PAGE_SIZE) return

  recommendStartIndex.value = (recommendStartIndex.value + HORSE_YEAR_RECOMMEND_PAGE_SIZE) % total
}

const fallbackBlessingsByLength: Record<BlessingLengthMode, string[]> = {
  short: ['马年大吉，万事顺遂！', '龙马精神，新春快乐！', '马到成功，平安喜乐！'],
  medium: [
    '马年到来喜事多，阖家团圆福满门，万事皆顺意。',
    '龙马精神迎新岁，愿你新年好运连连，笑口常开。',
    '新春启新程，愿你马年步步高，事业生活双丰收。',
  ],
  long: [
    '春风送暖迎马年，愿你在新的一年里龙马精神、奋勇向前，事业蒸蒸日上，生活喜乐安康。',
    '马蹄声声报春来，愿你马年心有热爱、眼有光芒，所行皆坦途，所愿皆可期，幸福常伴左右。',
    '新春已至，愿你在马年乘风而起，敢闯敢拼收获成长，家人平安顺遂，日子越过越红火。',
  ],
}

const isGenerating = ref(false)
const isSoundOn = ref(true)
const currentBlessing = ref(fallbackBlessingsByLength.medium[0])
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
const bgmAudioRef = ref<HTMLAudioElement | null>(null)
let bgmUnlockHandler: (() => void) | null = null
let generateDebounceTimer: number | null = null
let lastGenerateStartedAt = 0

const runAfter = (callback: () => void, delay: number) => {
  const id = window.setTimeout(() => {
    timerPool.delete(id)
    callback()
  }, delay)
  timerPool.add(id)
  return id
}

const clearGenerateDebounce = () => {
  if (generateDebounceTimer === null) return
  clearTimeout(generateDebounceTimer)
  timerPool.delete(generateDebounceTimer)
  generateDebounceTimer = null
}

const createRecordId = () => {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const randomPick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

const selectedLengthRule = computed(() => BLESSING_LENGTH_RULES[selectedBlessingLength.value])

const setBlessingLength = (mode: BlessingLengthMode) => {
  selectedBlessingLength.value = mode
}

const formatRecommendStars = (stars: number) => {
  return `${'★'.repeat(stars)}${'☆'.repeat(Math.max(0, 5 - stars))}（${stars}颗星）`
}

const countBlessingChars = (text: string) => {
  return text.replace(/\s+/g, '').replace(/[，。！？；：“”‘’、,.!?;:()（）《》【】[\]'"`~…—-]/g, '')
    .length
}

const isBlessingLengthMatched = (text: string, mode: BlessingLengthMode) => {
  const { min, max } = BLESSING_LENGTH_RULES[mode]
  const textLength = countBlessingChars(text)
  return textLength >= min && textLength <= max
}

const buildHorseYearBlessingPrompt = (mode: BlessingLengthMode) => {
  const { hint } = BLESSING_LENGTH_RULES[mode]
  return [
    '你是一位资深中文节庆文案作者。',
    '请创作1条马年新春祝贺语，语气真挚、喜庆、文采自然。',
    `字数要求：${hint}`,
    '只返回最终贺词正文，不要标题、解释、引号、序号、markdown。',
  ].join('\n')
}

const pickFallbackBlessing = (mode: BlessingLengthMode) => {
  const matched = fallbackBlessingsByLength[mode].filter((item) =>
    isBlessingLengthMatched(item, mode),
  )
  if (matched.length > 0) return randomPick(matched)

  const recommendPool = HORSE_YEAR_RECOMMEND_MESSAGES.map((item) => item.text).filter((item) =>
    isBlessingLengthMatched(item, mode),
  )

  if (recommendPool.length > 0) return randomPick(recommendPool)
  return randomPick(fallbackBlessingsByLength.medium)
}

const extractBlessingText = (payload: unknown): string => {
  if (typeof payload === 'string') return payload.trim()

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const candidate = extractBlessingText(item)
      if (candidate) return candidate
    }
    return ''
  }

  if (!payload || typeof payload !== 'object') return ''

  const record = payload as Record<string, unknown>
  const directFields = ['content', 'message', 'text', 'result', 'output', 'reply']

  for (const key of directFields) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }

  if (Array.isArray(record.choices)) {
    for (const choice of record.choices) {
      const candidate = extractBlessingText(choice)
      if (candidate) return candidate
    }
  }

  for (const value of Object.values(record)) {
    const candidate = extractBlessingText(value)
    if (candidate) return candidate
  }

  return ''
}

const normalizeBlessingText = (text: string) => {
  return text
    .replace(/```[\w-]*\s*/g, '')
    .replace(/```/g, '')
    .replace(/^[\d一二三四五六七八九十]+[、.]\s*/u, '')
    .replace(/^(?:贺词|祝福语|提示词)[:：]\s*/u, '')
    .replace(/^[“"'`]+|[“"'`]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const applyBlessingWithFade = (blessing: string) => {
  wishFading.value = true
  runAfter(() => {
    currentBlessing.value = blessing
    wishFading.value = false
  }, 220)
}

const getOrCreateBgmAudio = () => {
  if (bgmAudioRef.value) return bgmAudioRef.value

  const audio = document.createElement('audio')
  audio.src = newYearBgmSrc
  audio.preload = 'auto'
  audio.loop = true
  audio.volume = BGM_VOLUME
  audio.setAttribute('playsinline', 'true')
  audio.setAttribute('webkit-playsinline', 'true')
  bgmAudioRef.value = audio
  return audio
}

const playBgm = async () => {
  const audio = getOrCreateBgmAudio()
  audio.volume = BGM_VOLUME

  try {
    await audio.play()
    return true
  } catch {
    return false
  }
}

const pauseBgm = () => {
  const audio = bgmAudioRef.value
  if (!audio) return
  audio.pause()
}

const removeBgmUnlockListeners = () => {
  if (!bgmUnlockHandler) return
  window.removeEventListener('pointerdown', bgmUnlockHandler)
  window.removeEventListener('keydown', bgmUnlockHandler)
  window.removeEventListener('touchstart', bgmUnlockHandler)
  bgmUnlockHandler = null
}

const setupBgmUnlockOnFirstInteraction = () => {
  if (bgmUnlockHandler) return

  bgmUnlockHandler = () => {
    if (!isSoundOn.value) {
      removeBgmUnlockListeners()
      return
    }

    void playBgm().then((played) => {
      if (played) {
        removeBgmUnlockListeners()
      }
    })
  }

  window.addEventListener('pointerdown', bgmUnlockHandler, { passive: true })
  window.addEventListener('keydown', bgmUnlockHandler)
  window.addEventListener('touchstart', bgmUnlockHandler, { passive: true })
}

const toggleSound = async () => {
  const willEnable = !isSoundOn.value
  if (!willEnable) {
    pauseBgm()
    isSoundOn.value = false
    removeBgmUnlockListeners()
    return
  }

  const played = await playBgm()
  isSoundOn.value = true
  if (!played) {
    setupBgmUnlockOnFirstInteraction()
    ElMessage.warning('已开启音效，点击页面任意位置后将自动播放')
    return
  }
  removeBgmUnlockListeners()
}

const tryAutoPlayBgm = async () => {
  if (!isSoundOn.value) return

  const played = await playBgm()
  if (!played) {
    setupBgmUnlockOnFirstInteraction()
    return
  }
  removeBgmUnlockListeners()
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

const requestGenerateBlessing = async () => {
  if (isGenerating.value) return

  const targetLengthMode = selectedBlessingLength.value

  isGenerating.value = true
  lastGenerateStartedAt = Date.now()
  iconPulse.value = true
  glowVisible.value = true
  runAfter(() => {
    iconPulse.value = false
    glowVisible.value = false
  }, 320)

  if (isSoundOn.value) {
    void createFireworks()
    triggerHorseAnimation()
  }

  try {
    const aiPrompt = buildHorseYearBlessingPrompt(targetLengthMode)
    const aiResult = await aiApi.getAIContent(aiPrompt)
    const normalizedBlessing = normalizeBlessingText(extractBlessingText(aiResult))

    if (!normalizedBlessing) {
      throw new Error('AI 返回内容为空')
    }

    if (!isBlessingLengthMatched(normalizedBlessing, targetLengthMode)) {
      const { hint } = BLESSING_LENGTH_RULES[targetLengthMode]
      throw new Error(`AI 返回字数不符合 ${hint}`)
    }

    applyBlessingWithFade(normalizedBlessing)
  } catch (error) {
    console.error('AI 生成贺词失败:', error)
    applyBlessingWithFade(pickFallbackBlessing(targetLengthMode))
    const { hint } = BLESSING_LENGTH_RULES[targetLengthMode]
    ElMessage.warning(`AI生成失败，已切换为${hint}贺词`)
  } finally {
    runAfter(() => {
      isGenerating.value = false
    }, 360)
  }
}

const handleGenerate = () => {
  clearGenerateDebounce()

  generateDebounceTimer = runAfter(() => {
    generateDebounceTimer = null

    if (isGenerating.value) return

    const now = Date.now()
    const elapsed = now - lastGenerateStartedAt
    if (elapsed < GENERATE_THROTTLE_MS) {
      const remainMs = GENERATE_THROTTLE_MS - elapsed
      ElMessage.warning(`操作过于频繁，请${Math.max(1, Math.ceil(remainMs / 1000))}秒后再试`)
      return
    }

    void requestGenerateBlessing()
  }, GENERATE_DEBOUNCE_MS)
}

const handleCopyCurrent = async () => {
  await copyText(currentBlessing.value, 'generated')
}

const handleCopyRecommend = async (text: string) => {
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
  void tryAutoPlayBgm()
})

onBeforeUnmount(() => {
  pauseBgm()
  removeBgmUnlockListeners()
  bgmAudioRef.value = null
  clearGenerateDebounce()
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

.length-control {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.length-title {
  font-size: 13px;
  color: #8d6550;
  font-weight: 700;
}

.length-chip {
  min-height: 34px;
  min-width: 56px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(201, 24, 43, 0.25);
  background: #fff;
  color: #7e4633;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.length-chip:hover:not(:disabled) {
  border-color: rgba(201, 24, 43, 0.45);
}

.length-chip.active {
  color: #fff;
  border-color: transparent;
  background: linear-gradient(to right, var(--primary), var(--primary-hover));
  box-shadow: 0 6px 14px rgba(201, 24, 43, 0.22);
}

.length-chip:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.length-hint {
  font-size: 12px;
  color: #8f6a57;
  font-weight: 600;
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

  .length-control {
    justify-content: flex-start;
    gap: 6px;
  }

  .length-title {
    width: 100%;
    font-size: 12px;
  }

  .length-chip {
    min-width: 0;
    flex: 1;
    padding: 6px 8px;
    font-size: 12px;
  }

  .length-hint {
    width: 100%;
    font-size: 11px;
  }

  .action-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    width: 100%;
    align-items: stretch;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
    min-width: 0;
    min-height: 46px;
    padding: 10px 8px;
    border-radius: 11px;
    font-size: 15px;
    line-height: 1;
    gap: 4px;
    white-space: nowrap;
  }

  .primary-button {
    box-shadow: 0 8px 16px rgba(201, 24, 43, 0.24);
  }

  .secondary-button {
    background: linear-gradient(180deg, #ffffff 0%, #fff5ee 100%);
    border-color: rgba(201, 24, 43, 0.18);
    box-shadow: 0 6px 12px rgba(111, 63, 35, 0.08);
  }

  .action-row .material-icons {
    font-size: 19px;
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

  .length-title,
  .length-hint {
    text-align: left;
  }

  .action-row {
    gap: 6px;
  }

  .primary-button,
  .secondary-button {
    min-height: 44px;
    padding: 9px 6px;
    border-radius: 10px;
    font-size: 14px;
  }

  .action-row .material-icons {
    font-size: 18px;
  }

  .knowledge-content h3 {
    font-size: 24px;
  }
}
</style>
