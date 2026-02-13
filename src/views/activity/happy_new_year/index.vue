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
            <span class="length-hint">{{ lengthHintText }}</span>
          </div>

          <div class="style-control">
            <span class="style-title">文案风格</span>
            <button
              v-for="option in blessingStyleOptions"
              :key="option.value"
              class="style-chip"
              :class="{
                active: selectedBlessingStyle === option.value,
                abstract: option.value === 'abstract',
              }"
              :disabled="isGenerating"
              @click="setBlessingStyle(option.value)"
            >
              <span v-if="option.value === 'abstract'" class="material-icons style-chip-icon"
                >casino</span
              >
              {{ option.label }}
            </button>
            <span class="style-hint">{{ selectedStyleHint }}</span>
          </div>

          <div class="action-row">
            <button class="primary-button" :disabled="isGenerating" @click="handleGenerate">
              <span class="material-icons">shuffle</span>
              {{
                isGenerating
                  ? '生成中...'
                  : selectedBlessingStyle === 'abstract'
                    ? '生成抽象贺词'
                    : '生成贺词'
              }}
            </button>
            <button class="secondary-button" @click="handleCopyCurrent">
              <span class="material-icons">content_copy</span>
              复制
            </button>
            <button
              class="secondary-button"
              :disabled="isSharingCard"
              aria-label="分享贺词"
              @click="handleShareCard"
            >
              <span class="material-icons">{{ isSharingCard ? 'hourglass_top' : 'share' }}</span>
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
                  <p
                    class="recent-text"
                    :class="{ 'recent-text-clamp': !isRecentTextExpanded(record.id) }"
                    :title="record.text"
                    :ref="(el) => setRecentTextRef(record.id, el)"
                  >
                    "{{ record.text }}"
                  </p>
                  <span class="recent-time">{{ formatCopiedAt(record.copiedAt) }}</span>
                  <button
                    v-if="isRecentTextOverflow(record.id) || isRecentTextExpanded(record.id)"
                    class="recent-expand-btn"
                    :aria-label="isRecentTextExpanded(record.id) ? '收起贺词全文' : '查看完整贺词'"
                    @click="toggleRecentTextExpanded(record.id)"
                  >
                    {{ isRecentTextExpanded(record.id) ? '收起' : '查看全文' }}
                  </button>
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

    <blessing-share-card ref="shareCardRef" :blessing="currentBlessing" />

    <div
      v-if="showSharePreviewModal"
      class="share-preview-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="分享卡面预览"
      @click.self="closeSharePreviewModal"
    >
      <div class="share-preview-modal">
        <button
          class="share-preview-close-btn"
          aria-label="关闭预览"
          @click="closeSharePreviewModal"
        >
          <span class="material-icons">close</span>
        </button>

        <h3 class="share-preview-title">分享卡面预览</h3>
        <div class="share-preview-image-wrap">
          <img
            v-if="sharePreviewImageUrl"
            class="share-preview-image"
            :src="sharePreviewImageUrl"
            alt="新春贺词分享卡面预览"
          />
        </div>

        <button
          class="share-preview-download-btn"
          :disabled="!sharePreviewBlob"
          @click="handleDownloadShareCard"
        >
          <span class="material-icons">download</span>
          下载卡面
        </button>
      </div>
    </div>

    <footer class="page-footer">© 2026 马年新春贺词生成器. 用心设计，传递喜悦。</footer>

    <div class="toast" :class="{ show: toastVisible }">
      <span class="material-icons toast-icon">check_circle</span>
      <span>{{ toastText }}</span>
    </div>

    <div v-if="showBgmModal" class="bgm-modal-backdrop">
      <div class="bgm-modal" role="dialog" aria-modal="true" aria-label="背景音乐设置">
        <div class="bgm-corner bgm-corner-tl" />
        <div class="bgm-corner bgm-corner-tr" />
        <div class="bgm-corner bgm-corner-bl" />
        <div class="bgm-corner bgm-corner-br" />
        <div class="bgm-modal-pattern" />

        <div class="bgm-modal-content">
          <div class="bgm-icon-wrap">
            <div class="bgm-icon-glow" />
            <div class="bgm-icon-core">
              <span class="material-icons">bakery_dining</span>
              <span class="material-icons bgm-icon-spark">auto_awesome</span>
            </div>
          </div>

          <h3 class="bgm-title">开启新春音乐</h3>
          <!-- <p class="bgm-description">是否开启背景音乐</p> -->

          <div class="bgm-actions">
            <button class="bgm-btn bgm-btn-primary" @click="handleEnableBgmFromModal">开启</button>
            <button class="bgm-btn bgm-btn-ghost" @click="handleSkipBgmFromModal">暂不开启</button>
          </div>

          <div class="bgm-footer-note">
            <span class="line" />
            <span class="text">YEAR OF THE HORSE</span>
            <span class="line" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'HappyNewYearPage',
})

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type ComponentPublicInstance,
} from 'vue'
import { ElMessage } from 'element-plus'
import { aiApi } from '@/api/ai'
import {
  type HorseYearRecommendMessage,
  HORSE_YEAR_RECOMMEND_MESSAGES,
  HORSE_YEAR_RECOMMEND_PAGE_SIZE,
} from '@/constants/NewYearMessage'
import newYearBgmSrc from '@/assets/music/恭喜发财.m4a'
import BlessingShareCard from './components/BlessingShareCard.vue'

type BlessingSource = 'generated' | 'hot' | 'recent'
type BlessingLengthMode = 'short' | 'medium' | 'long'
type BlessingStyleMode = 'classic' | 'abstract'

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

interface AbstractStyleVariant {
  label: string
  instruction: string
}

interface ShareCardImagePayload {
  blob: Blob
  fileName: string
}

interface BlessingShareCardExpose {
  generateImage: () => Promise<ShareCardImagePayload | null>
}

const MAX_RECENT = 20
const MAX_GENERATE_HISTORY = 20
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

const blessingStyleOptions = [
  { value: 'classic', label: '经典' },
  { value: 'abstract', label: '抽象随机' },
] as const

const ABSTRACT_STYLE_VARIANTS: AbstractStyleVariant[] = [
  {
    label: '热梗冲浪流',
    instruction:
      '融入当下最火网络热梗（如“尊嘟假嘟”“City不City”），可点缀表情包符号，语气像社交平台爆款文案，自带社交牛感。',
  },
  {
    label: '二次元应援流',
    instruction: '多用“守护”“永远的神”“羁绊”等中二词汇，感叹号密度更高，整体要元气、热血、破壁。',
  },
  {
    label: '抽象反差流',
    instruction:
      '采用“开头一本正经，中段突然转折”的反差逻辑，用不合常理类比制造幽默，在荒诞表象里包裹温暖内核。',
  },
  {
    label: '赛博弹幕流',
    instruction:
      '极短句、多重复，营造排队刷屏既视感，可用“前方高能”“前方核能”“高燃预警”等弹幕术语增强冲击。',
  },
  {
    label: '发光文学流',
    instruction:
      '结合发疯文学的细腻与诗意，语序可轻微破碎，情绪要饱满，适度使用通感表达（如“听见光的颜色”），带电影感。',
  },
  {
    label: '少年漫主角流',
    instruction:
      '模拟热血番主角独白，必须自然融入“宿命”“觉醒”“约定”等关键词，语气坚定，像在逆境中向世界告白。',
  },
  {
    label: '赛博禅意流',
    instruction:
      '语气平和却带看透世界的疲惫感，融合科技词汇与禅意表达（如“数据皆幻象”“给心灵装散热器”），呈现平静疏离。',
  },
  {
    label: '废话文学流',
    instruction:
      '表面逻辑严密，实则是正向废话，使用轻度循环句式（如“如果不开心那就先别太不开心”），营造解压和松弛幽默。',
  },
  {
    label: '翻译腔调频流',
    instruction:
      '模仿老式译制片或机翻语感，可用“哦我的老伙计”“我发誓这太疯狂了”等句式，以生硬翻译味制造喜感。',
  },
  {
    label: '智性恋理性流',
    instruction:
      '使用物理、数学、生物术语重构情感（如“多巴胺低熵排列”“情感量子纠缠”），整体显得冷静、克制但深情。',
  },
  {
    label: '混搭乱炖流',
    instruction: '随机融合流行语、抽象梗、二次元感，风格不固定且自然。',
  },
]

const recommendStartIndex = ref(0)
const selectedBlessingLength = ref<BlessingLengthMode>('medium')
const selectedBlessingStyle = ref<BlessingStyleMode>('classic')
const lastAbstractStyleLabel = ref('')

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

const abstractFallbackBlessingsByLength: Record<BlessingLengthMode, string[]> = {
  short: ['马年开挂，灵气满格！', '好运暴击，主角登场！', '马力拉满，快乐超频！'],
  medium: [
    '马年像番剧开新篇，愿你一路高能推进，烦恼统统掉线。',
    '新春buff已叠满，愿你欧气连发，事业与快乐双双暴击。',
    '祝你马年状态封神，灵感在线，生活每天都有名场面。',
  ],
  long: [
    '马年副本正式开启，愿你带着主角光环一路通关，灵感和好运像连击一样不停触发，工作生活都能收获高光时刻。',
    '新春版本已更新，愿你在马年把烦恼清空、把快乐拉满，既有二次元般热血冲劲，也有现实里的稳稳幸福与成长。',
    '愿你在马年保持一点抽象的浪漫和一点勇敢的热血，遇事不内耗、逢难能反杀，日常有梗有笑，未来有光有盼。',
  ],
}

const isGenerating = ref(false)
const isSharingCard = ref(false)
const isSoundOn = ref(false)
const showBgmModal = ref(false)
const currentBlessing = ref(fallbackBlessingsByLength.medium[0])
const wishFading = ref(false)
const iconPulse = ref(false)
const glowVisible = ref(false)
const horseAnimating = ref(false)
const fireworkParticles = ref<FireworkParticle[]>([])
const recentCopyRecords = ref<CopyRecord[]>([])
const generatedBlessingHistory = ref<string[]>([])
const toastVisible = ref(false)
const toastText = ref('贺词已复制到剪贴板！')
const fireworksLayerRef = ref<HTMLElement | null>(null)
const shareCardRef = ref<BlessingShareCardExpose | null>(null)
const showSharePreviewModal = ref(false)
const sharePreviewBlob = ref<Blob | null>(null)
const sharePreviewImageUrl = ref('')
const sharePreviewFileName = ref('')
const recentTextOverflowMap = ref<Record<string, boolean>>({})
const recentTextExpandedMap = ref<Record<string, boolean>>({})
const recentTextElementMap = new Map<string, HTMLElement>()
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
const lengthHintText = computed(() => {
  if (selectedBlessingStyle.value === 'abstract') return '抽象模式不限制字数'
  return selectedLengthRule.value.hint
})
const selectedStyleHint = computed(() => {
  if (selectedBlessingStyle.value === 'classic') {
    return '经典喜庆风格'
  }

  if (lastAbstractStyleLabel.value) {
    return `抽象随机已开启 · 本次风格：${lastAbstractStyleLabel.value}`
  }

  return '抽象随机已开启 · 每次随机切换流行语/抽象梗/二次元风格'
})

const setBlessingLength = (mode: BlessingLengthMode) => {
  selectedBlessingLength.value = mode
}

const setBlessingStyle = (mode: BlessingStyleMode) => {
  selectedBlessingStyle.value = mode
  if (mode === 'classic') {
    lastAbstractStyleLabel.value = ''
  }
}

const formatRecommendStars = (stars: number) => {
  return `${'★'.repeat(stars)}${'☆'.repeat(Math.max(0, 5 - stars))}（${stars}颗星）`
}

const setRecentTextRef = (
  recordId: string,
  element: Element | ComponentPublicInstance | null,
) => {
  const resolved =
    element instanceof HTMLElement
      ? element
      : element && '$el' in element && element.$el instanceof HTMLElement
        ? element.$el
        : null

  if (resolved) {
    recentTextElementMap.set(recordId, resolved)
    return
  }

  recentTextElementMap.delete(recordId)
}

const refreshRecentTextOverflowState = async () => {
  await nextTick()
  const nextState: Record<string, boolean> = {}
  const nextExpandedState: Record<string, boolean> = {}

  for (const record of recentCopyRecords.value) {
    const element = recentTextElementMap.get(record.id)
    nextState[record.id] = Boolean(element && element.scrollHeight > element.clientHeight + 1)
    if (recentTextExpandedMap.value[record.id]) {
      nextExpandedState[record.id] = true
    }
  }

  recentTextOverflowMap.value = nextState
  recentTextExpandedMap.value = nextExpandedState
}

const isRecentTextOverflow = (recordId: string) => {
  return Boolean(recentTextOverflowMap.value[recordId])
}

const isRecentTextExpanded = (recordId: string) => {
  return Boolean(recentTextExpandedMap.value[recordId])
}

const toggleRecentTextExpanded = (recordId: string) => {
  const expanded = isRecentTextExpanded(recordId)
  recentTextExpandedMap.value = {
    ...recentTextExpandedMap.value,
    [recordId]: !expanded,
  }
  void refreshRecentTextOverflowState()
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

const getPromptHistoryBlessings = () => {
  return generatedBlessingHistory.value
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(-MAX_GENERATE_HISTORY)
}

const pushGeneratedBlessingHistory = (text: string) => {
  const normalizedText = normalizeBlessingText(text)
  if (!normalizedText) return
  generatedBlessingHistory.value = [...generatedBlessingHistory.value, normalizedText].slice(
    -MAX_GENERATE_HISTORY,
  )
}

const pickRandomAbstractStyleVariant = () => randomPick(ABSTRACT_STYLE_VARIANTS)

const buildHorseYearBlessingPrompt = (
  mode: BlessingLengthMode,
  historyBlessings: string[],
  styleMode: BlessingStyleMode,
  abstractStyleVariant: AbstractStyleVariant | null,
) => {
  const promptLines = [
    '你是一位资深中文节庆文案作者。',
    '请创作1条马年新春祝贺语，语气真挚、喜庆、文采自然。',
  ]

  if (styleMode === 'classic') {
    const { hint } = BLESSING_LENGTH_RULES[mode]
    promptLines.push(`字数要求：${hint}`)
  }

  if (styleMode === 'abstract') {
    promptLines.push('当前生成模式：抽象随机模式。')
    promptLines.push('请融合当下流行语、抽象幽默表达、二次元语感等元素，但不要固定为某一种风格。')

    if (abstractStyleVariant) {
      promptLines.push(`本次随机风格：${abstractStyleVariant.label}`)
      promptLines.push(`风格说明：${abstractStyleVariant.instruction}`)
    }

    promptLines.push('允许玩梗和适度反差，但必须保持新年祝福语属性，内容正向、友善，不低俗不冒犯。')
  }

  if (historyBlessings.length > 0) {
    promptLines.push('以下是之前已返回的贺词，请避免和它们过于相似：')
    promptLines.push(...historyBlessings.map((item, index) => `${index + 1}. ${item}`))
    promptLines.push('请确保新贺词在关键词、句式和意象上与以上内容明显不同，不要仅做近义词替换。')
  }

  promptLines.push('只返回最终贺词正文，不要标题、解释、引号、序号、markdown。')
  return promptLines.join('\n')
}

const pickFallbackBlessing = (mode: BlessingLengthMode, styleMode: BlessingStyleMode) => {
  if (styleMode === 'abstract') {
    const abstractPool = Object.values(abstractFallbackBlessingsByLength).flat()
    if (abstractPool.length > 0) return randomPick(abstractPool)
    return randomPick(fallbackBlessingsByLength.medium)
  }

  const fallbackPoolByLength = fallbackBlessingsByLength

  const matched = fallbackPoolByLength[mode].filter((item) => isBlessingLengthMatched(item, mode))
  if (matched.length > 0) return randomPick(matched)

  const recommendPool = HORSE_YEAR_RECOMMEND_MESSAGES.map((item) => item.text).filter((item) =>
    isBlessingLengthMatched(item, mode),
  )

  if (recommendPool.length > 0) return randomPick(recommendPool)
  return randomPick(fallbackPoolByLength.medium)
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
  audio.autoplay = true
  audio.preload = 'auto'
  audio.loop = true
  audio.volume = BGM_VOLUME
  audio.setAttribute('playsinline', 'true')
  audio.setAttribute('webkit-playsinline', 'true')
  audio.style.display = 'none'
  audio.setAttribute('aria-hidden', 'true')
  document.body.appendChild(audio)
  bgmAudioRef.value = audio
  return audio
}

const playBgm = async (allowMutedFallback = false) => {
  const audio = getOrCreateBgmAudio()
  audio.muted = false
  audio.volume = BGM_VOLUME

  try {
    await audio.play()
    return true
  } catch {
    if (!allowMutedFallback) return false

    try {
      // Fallback for strict autoplay policies: start muted first, then restore volume.
      audio.muted = true
      audio.volume = 0
      await audio.play()
      audio.muted = false
      audio.volume = BGM_VOLUME
      return true
    } catch {
      return false
    }
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

const handleEnableBgmFromModal = async () => {
  showBgmModal.value = false
  isSoundOn.value = true

  const played = await playBgm(true)
  if (!played) {
    setupBgmUnlockOnFirstInteraction()
    ElMessage.warning('浏览器限制自动播放，点击页面任意位置后将自动播放')
    return
  }
  removeBgmUnlockListeners()
}

const handleSkipBgmFromModal = () => {
  showBgmModal.value = false
  isSoundOn.value = false
  pauseBgm()
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
  const targetStyleMode = selectedBlessingStyle.value
  const historyBlessings = getPromptHistoryBlessings()
  const abstractStyleVariant =
    targetStyleMode === 'abstract' ? pickRandomAbstractStyleVariant() : null
  lastAbstractStyleLabel.value = abstractStyleVariant?.label ?? ''

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
    const aiPrompt = buildHorseYearBlessingPrompt(
      targetLengthMode,
      historyBlessings,
      targetStyleMode,
      abstractStyleVariant,
    )
    const aiMessages = [
      ...historyBlessings.map((item) => ({ role: 'assistant', content: item })),
      { role: 'user', content: aiPrompt },
    ]
    const aiResult = await aiApi.getAIContent(aiPrompt, aiMessages)
    const normalizedBlessing = normalizeBlessingText(extractBlessingText(aiResult))

    if (!normalizedBlessing) {
      throw new Error('AI 返回内容为空')
    }

    if (
      targetStyleMode !== 'abstract' &&
      !isBlessingLengthMatched(normalizedBlessing, targetLengthMode)
    ) {
      const { hint } = BLESSING_LENGTH_RULES[targetLengthMode]
      throw new Error(`AI 返回字数不符合 ${hint}`)
    }

    applyBlessingWithFade(normalizedBlessing)
    pushGeneratedBlessingHistory(normalizedBlessing)
  } catch (error) {
    console.error('AI 生成贺词失败:', error)
    const fallbackBlessing = pickFallbackBlessing(targetLengthMode, targetStyleMode)
    applyBlessingWithFade(fallbackBlessing)
    pushGeneratedBlessingHistory(fallbackBlessing)
    if (targetStyleMode === 'abstract') {
      ElMessage.warning('AI生成失败，已切换为抽象随机贺词')
    } else {
      const { hint } = BLESSING_LENGTH_RULES[targetLengthMode]
      ElMessage.warning(`AI生成失败，已切换为${hint}贺词`)
    }
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

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.rel = 'noopener'
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  runAfter(() => {
    URL.revokeObjectURL(url)
  }, 520)
}

const revokeSharePreviewUrl = () => {
  if (!sharePreviewImageUrl.value) return
  URL.revokeObjectURL(sharePreviewImageUrl.value)
  sharePreviewImageUrl.value = ''
}

const setSharePreviewImage = (payload: ShareCardImagePayload) => {
  revokeSharePreviewUrl()
  sharePreviewBlob.value = payload.blob
  sharePreviewFileName.value = payload.fileName
  sharePreviewImageUrl.value = URL.createObjectURL(payload.blob)
  showSharePreviewModal.value = true
}

const handleShareCard = async () => {
  if (isSharingCard.value) return

  const cardComponent = shareCardRef.value
  if (!cardComponent) {
    ElMessage.error('分享组件尚未准备好，请稍后重试')
    return
  }

  isSharingCard.value = true
  try {
    const shareCardImage = await cardComponent.generateImage()
    if (!shareCardImage) {
      throw new Error('分享卡面生成失败')
    }

    setSharePreviewImage(shareCardImage)
  } catch (error) {
    console.error('生成分享卡面失败:', error)
    ElMessage.error('生成分享卡面失败，请稍后重试')
  } finally {
    isSharingCard.value = false
  }
}

const closeSharePreviewModal = () => {
  showSharePreviewModal.value = false
}

const handleDownloadShareCard = () => {
  if (!sharePreviewBlob.value) {
    ElMessage.warning('请先生成分享卡面')
    return
  }

  const fileName = sharePreviewFileName.value || `马年新春贺词-${Date.now()}.png`
  downloadBlob(sharePreviewBlob.value, fileName)
  showToast('分享卡面已下载')
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

const handleRecentTextResize = () => {
  void refreshRecentTextOverflowState()
}

watch(
  recentCopyRecords,
  () => {
    void refreshRecentTextOverflowState()
  },
  { flush: 'post', immediate: true },
)

onMounted(() => {
  loadRecentFromStorage()
  showBgmModal.value = true
  window.addEventListener('resize', handleRecentTextResize)
})

onBeforeUnmount(() => {
  pauseBgm()
  removeBgmUnlockListeners()
  revokeSharePreviewUrl()
  recentTextElementMap.clear()
  window.removeEventListener('resize', handleRecentTextResize)
  if (bgmAudioRef.value?.parentNode) {
    bgmAudioRef.value.parentNode.removeChild(bgmAudioRef.value)
  }
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

.style-control {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.style-title {
  font-size: 13px;
  color: #8d6550;
  font-weight: 700;
}

.style-chip {
  min-height: 36px;
  min-width: 86px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(201, 24, 43, 0.25);
  background: #fff;
  color: #7e4633;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.style-chip:hover:not(:disabled) {
  border-color: rgba(201, 24, 43, 0.45);
}

.style-chip.abstract {
  border-color: rgba(37, 99, 235, 0.28);
  color: #1d4ed8;
}

.style-chip.active {
  color: #fff;
  border-color: transparent;
  background: linear-gradient(to right, var(--primary), var(--primary-hover));
  box-shadow: 0 6px 14px rgba(201, 24, 43, 0.22);
}

.style-chip.abstract.active {
  background: linear-gradient(120deg, #2563eb 0%, #0ea5e9 100%);
  box-shadow: 0 6px 16px rgba(30, 64, 175, 0.28);
}

.style-chip:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.style-chip-icon {
  font-size: 16px;
}

.style-hint {
  font-size: 12px;
  color: #7d5c74;
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

.secondary-button:hover:not(:disabled) {
  background: #fff2e8;
  color: var(--primary);
}

.secondary-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

.recent-text-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 7;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: calc(1.72em * 7);
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

.recent-expand-btn {
  margin-top: 8px;
  min-height: 30px;
  border: 0;
  background: transparent;
  color: var(--primary);
  font-size: 12px;
  font-weight: 700;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.recent-expand-btn:hover {
  color: var(--primary-hover);
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
  font-size: 14px;
}

.toast.show {
  transform: translate(-50%, 0);
  opacity: 1;
}

.toast-icon {
  color: #52c26d;
}

.share-preview-backdrop {
  position: fixed;
  inset: 0;
  z-index: 55;
  background: rgba(31, 23, 15, 0.72);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.share-preview-modal {
  position: relative;
  width: min(520px, 100%);
  max-height: calc(100vh - 40px);
  overflow: auto;
  border-radius: 18px;
  border: 1px solid rgba(201, 24, 43, 0.2);
  background: linear-gradient(180deg, #fffaf2 0%, #ffeede 100%);
  box-shadow: 0 24px 54px rgba(44, 25, 15, 0.35);
  padding: 18px 18px 20px;
}

.share-preview-close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 10px;
  background: rgba(201, 24, 43, 0.08);
  color: #7f2732;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.share-preview-close-btn:hover {
  background: rgba(201, 24, 43, 0.14);
  color: #b01626;
}

.share-preview-title {
  margin: 2px 44px 14px 4px;
  color: #7a1a26;
  font-size: 24px;
  line-height: 1.3;
}

.share-preview-image-wrap {
  border-radius: 14px;
  border: 1px solid rgba(201, 24, 43, 0.16);
  background: #fff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  overflow: hidden;
}

.share-preview-image {
  display: block;
  width: 100%;
  height: auto;
}

.share-preview-download-btn {
  margin-top: 14px;
  width: 100%;
  min-height: 48px;
  border-radius: 12px;
  border: 1px solid transparent;
  color: #fff;
  background: linear-gradient(to right, var(--primary), var(--primary-hover));
  box-shadow: 0 10px 22px rgba(201, 24, 43, 0.28);
  font-size: 16px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.share-preview-download-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(201, 24, 43, 0.32);
}

.share-preview-download-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.bgm-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(34, 30, 16, 0.82);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.bgm-modal {
  position: relative;
  width: min(560px, 100%);
  border-radius: 16px;
  border: 2px solid rgba(242, 185, 13, 0.3);
  background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
  box-shadow: 0 24px 54px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

.bgm-modal-pattern {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.2;
  background-image: radial-gradient(circle at 2px 2px, rgba(242, 185, 13, 0.2) 1px, transparent 0);
  background-size: 24px 24px;
}

.bgm-corner {
  position: absolute;
  width: 52px;
  height: 52px;
  border-color: #f2b90d;
  opacity: 0.85;
  z-index: 2;
}

.bgm-corner-tl {
  top: 0;
  left: 0;
  border-top: 4px solid currentColor;
  border-left: 4px solid currentColor;
  border-top-left-radius: 16px;
}

.bgm-corner-tr {
  top: 0;
  right: 0;
  border-top: 4px solid currentColor;
  border-right: 4px solid currentColor;
  border-top-right-radius: 16px;
}

.bgm-corner-bl {
  bottom: 0;
  left: 0;
  border-bottom: 4px solid currentColor;
  border-left: 4px solid currentColor;
  border-bottom-left-radius: 16px;
}

.bgm-corner-br {
  right: 0;
  bottom: 0;
  border-right: 4px solid currentColor;
  border-bottom: 4px solid currentColor;
  border-bottom-right-radius: 16px;
}

.bgm-modal-content {
  position: relative;
  z-index: 3;
  padding: 42px 30px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.bgm-icon-wrap {
  position: relative;
  margin-bottom: 20px;
}

.bgm-icon-glow {
  position: absolute;
  inset: -12px;
  border-radius: 999px;
  background: rgba(242, 185, 13, 0.3);
  filter: blur(18px);
}

.bgm-icon-core {
  position: relative;
  width: 88px;
  height: 88px;
  border-radius: 999px;
  border: 1px solid rgba(242, 185, 13, 0.45);
  background: rgba(242, 185, 13, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f2b90d;
}

.bgm-icon-core .material-icons {
  font-size: 50px;
}

.bgm-icon-spark {
  position: absolute;
  top: -8px;
  right: -10px;
  font-size: 22px !important;
}

.bgm-title {
  margin: 0;
  color: #f2b90d;
  font-size: clamp(30px, 5vw, 38px);
  line-height: 1.2;
  letter-spacing: 0.12em;
  font-family: 'Ma Shan Zheng', cursive;
}

.bgm-description {
  margin: 12px 0 0;
  max-width: 390px;
  color: rgba(255, 255, 255, 0.92);
  font-size: 17px;
  line-height: 1.75;
}

.bgm-actions {
  margin-top: 28px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.bgm-btn {
  min-height: 50px;
  border-radius: 10px;
  border: 2px solid transparent;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.bgm-btn:hover {
  transform: translateY(-1px);
}

.bgm-btn:active {
  transform: translateY(0);
}

.bgm-btn-primary {
  color: #221e10;
  background: #f2b90d;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.22);
}

.bgm-btn-primary:hover {
  background: #f8c63d;
}

.bgm-btn-ghost {
  color: #f2b90d;
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(242, 185, 13, 0.4);
}

.bgm-btn-ghost:hover {
  background: rgba(242, 185, 13, 0.12);
  border-color: rgba(242, 185, 13, 0.65);
}

.bgm-footer-note {
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: rgba(242, 185, 13, 0.78);
  font-size: 11px;
  letter-spacing: 0.2em;
}

.bgm-footer-note .line {
  width: 34px;
  height: 1px;
  background: currentColor;
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
  .copy-button,
  .share-preview-close-btn,
  .share-preview-download-btn {
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

  .recent-text-clamp {
    -webkit-line-clamp: 5;
    max-height: calc(1.72em * 5);
  }

  .style-control {
    justify-content: flex-start;
    gap: 6px;
  }

  .style-title {
    width: 100%;
    font-size: 12px;
  }

  .style-chip {
    min-width: 0;
    flex: 1;
    padding: 6px 8px;
    font-size: 12px;
  }

  .style-hint {
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

  .share-preview-backdrop {
    padding: 14px;
  }

  .share-preview-modal {
    padding: 16px 14px 16px;
    border-radius: 14px;
  }

  .share-preview-title {
    font-size: 21px;
    margin-right: 40px;
  }

  .share-preview-download-btn {
    min-height: 46px;
    font-size: 15px;
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

  .style-title,
  .style-hint {
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

  .recent-text-clamp {
    -webkit-line-clamp: 4;
    max-height: calc(1.72em * 4);
  }

  .knowledge-content h3 {
    font-size: 24px;
  }

  .bgm-modal-content {
    padding: 34px 18px 22px;
  }

  .bgm-actions {
    grid-template-columns: 1fr;
  }

  .bgm-btn {
    min-height: 46px;
    font-size: 16px;
  }

  .share-preview-backdrop {
    padding: 10px;
  }

  .share-preview-modal {
    padding: 14px 10px 14px;
  }

  .share-preview-title {
    font-size: 19px;
    margin-bottom: 10px;
  }

  .share-preview-close-btn {
    top: 6px;
    right: 6px;
  }

}
</style>
