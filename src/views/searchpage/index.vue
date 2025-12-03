<template>
  <div class="search-page">
    <!-- 温馨背景 -->
    <div class="warm-bg">
      <div class="sunlight"></div>
      <div class="clouds">
        <div v-for="n in 5" :key="n" class="cloud" :class="`cloud-${n}`"></div>
      </div>
      <div class="leaves">
        <div v-for="n in 8" :key="n" class="leaf" :class="`leaf-${n}`"></div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="search-container" ref="searchContainer">
      <!-- 标题区域 -->
      <div class="title-section" ref="titleSection">
        <span class="title-sub">今日は何を探しますか？</span>
        <h1 class="title-main">Little Search</h1>
        <div class="title-decoration">
          <span class="dot"></span>
          <span class="line"></span>
          <span class="dot"></span>
        </div>
      </div>

      <!-- 搜索框区域 -->
      <div class="search-box" ref="searchBox">
        <div class="search-wrapper shadow-dreamy">
          <div class="icon-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="在这里输入想找的内容..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            GO
          </button>
        </div>

        <div class="search-tags">
          <span class="tags-label">推荐:</span>
          <div class="tags-list">
            <span
              v-for="tag in hotTags"
              :key="tag"
              class="tag-item"
              @click="searchQuery = tag"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- 搜索结果区域 -->
      <div class="results-section" ref="resultsSection" v-show="hasSearched">
        <div class="results-header">
          <span class="results-info">找到 {{ results.length }} 篇温暖的记录</span>
        </div>
        <div class="results-grid">
          <div
            v-for="(result, index) in results"
            :key="index"
            class="result-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="card-image" :style="{ background: result.color }">
              <span class="card-emoji">{{ result.emoji }}</span>
            </div>
            <div class="card-content">
              <span class="card-date">{{ result.date }}</span>
              <h3 class="card-title">{{ result.title }}</h3>
              <p class="card-desc">{{ result.description }}</p>
              <div class="card-footer">
                <span class="read-more">阅读更多</span>
                <span class="card-category">{{ result.category }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-show="!hasSearched" ref="emptyState">
        <div class="empty-illustration">
          <div class="cat-ears"></div>
          <div class="cat-face">
            <div class="eyes">
              <div class="eye left"></div>
              <div class="eye right"></div>
            </div>
            <div class="nose"></div>
          </div>
        </div>
        <p class="empty-text">静悄悄的...</p>
        <p class="empty-subtext">试着搜索一下感兴趣的内容吧</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SearchPage',
})

import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const searchQuery = ref('')
const hasSearched = ref(false)
const results = ref<Array<{ title: string; description: string; date: string; category: string; color: string; emoji: string }>>([])

const hotTags = ['日常', '学习笔记', '摄影', '心情', '美食']

const searchContainer = ref<HTMLElement | null>(null)
const titleSection = ref<HTMLElement | null>(null)
const searchBox = ref<HTMLElement | null>(null)
const emptyState = ref<HTMLElement | null>(null)

// 模拟搜索
const handleSearch = () => {
  if (!searchQuery.value.trim()) return

  hasSearched.value = true

  // 模拟温馨风格的结果
  results.value = [
    {
      title: `关于「${searchQuery.value}」的小确幸`,
      description: '今天是一个阳光明媚的日子，整理了一些关于这个主题的想法和感受，希望能带给你一点温暖...',
      date: '2025.12.01',
      category: '生活记录',
      color: '#FFD1DC',
      emoji: '🌸'
    },
    {
      title: `${searchQuery.value} 的学习日记`,
      description: '慢慢来，比较快。记录下学习过程中的点点滴滴，每一个小进步都值得庆祝。',
      date: '2025.11.28',
      category: '成长',
      color: '#E0F9B5',
      emoji: '🌱'
    },
    {
      title: `遇见 ${searchQuery.value}`,
      description: '生活中的惊喜无处不在，只要用心去发现。分享一些美好的瞬间。',
      date: '2025.11.25',
      category: '随笔',
      color: '#AEE1FF',
      emoji: '☁️'
    },
  ]
}

onMounted(() => {
  const tl = gsap.timeline()

  // 标题动画 - 柔和浮现
  tl.from(titleSection.value, {
    y: 20,
    opacity: 0,
    duration: 1.2,
    ease: 'power2.out',
  })

  // 搜索框动画
  tl.from(
    searchBox.value,
    {
      scale: 0.95,
      opacity: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.8)',
    },
    '-=0.8'
  )

  // 空状态动画
  tl.from(
    emptyState.value,
    {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    },
    '-=0.6'
  )

  // 云朵漂浮动画
  gsap.to('.cloud', {
    x: '+=30',
    duration: 'random(10, 20)',
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: {
      each: 2,
      from: 'random',
    },
  })

  // 树叶飘动
  gsap.to('.leaf', {
    rotation: 'random(-15, 15)',
    y: 'random(-10, 10)',
    duration: 'random(3, 6)',
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: 1,
  })
})
</script>

<style scoped lang="scss">
// 颜色变量 - 温馨治愈风格
$bg-color: #fffbf0;
$primary: #ff9a9e;
$secondary: #fecfef;
$accent: #a1c4fd;
$text-main: #5d5d5d;
$text-light: #8b8b8b;
$white: #ffffff;
$card-bg: #ffffff;

.search-page {
  min-height: 100vh;
  width: 100%;
  background-color: $bg-color;
  position: relative;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  padding: 60px 20px;
  font-family: 'Nunito', 'M PLUS Rounded 1c', sans-serif; // 圆润字体
}

// 温馨背景
.warm-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.sunlight {
  position: absolute;
  top: -10%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
}

.cloud {
  position: absolute;
  background: #fff;
  border-radius: 50px;
  opacity: 0.6;

  &::before, &::after {
    content: '';
    position: absolute;
    background: inherit;
    border-radius: 50%;
  }

  &.cloud-1 { width: 100px; height: 40px; top: 10%; left: 10%; &::before { width: 50px; height: 50px; top: -25px; left: 15px; } &::after { width: 40px; height: 40px; top: -15px; left: 45px; } }
  &.cloud-2 { width: 140px; height: 60px; top: 20%; right: 15%; opacity: 0.4; &::before { width: 70px; height: 70px; top: -35px; left: 20px; } &::after { width: 50px; height: 50px; top: -20px; left: 60px; } }
  &.cloud-3 { width: 80px; height: 30px; top: 40%; left: 5%; opacity: 0.3; }
  &.cloud-4 { width: 120px; height: 50px; bottom: 20%; right: 10%; opacity: 0.5; }
  &.cloud-5 { width: 90px; height: 35px; bottom: 10%; left: 20%; opacity: 0.2; }
}

.leaf {
  position: absolute;
  width: 20px;
  height: 20px;
  background: #d4e157;
  border-radius: 0 50% 0 50%;
  opacity: 0.3;

  &.leaf-1 { top: 15%; left: 20%; transform: rotate(45deg); }
  &.leaf-2 { top: 25%; right: 25%; background: #ffab91; transform: rotate(-30deg); }
  &.leaf-3 { top: 60%; left: 10%; background: #81d4fa; transform: rotate(15deg); }
  &.leaf-4 { bottom: 15%; right: 15%; transform: rotate(60deg); }
}

// 主容器
.search-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

// 标题
.title-section {
  text-align: center;
  color: $text-main;
}

.title-sub {
  font-size: 14px;
  color: $text-light;
  letter-spacing: 2px;
  display: block;
  margin-bottom: 8px;
}

.title-main {
  font-size: 42px;
  font-weight: 800;
  color: $text-main;
  margin: 0;
  letter-spacing: 1px;
  background: linear-gradient(120deg, #ff9a9e 0%, #fecfef 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;

  .dot {
    width: 6px;
    height: 6px;
    background: $primary;
    border-radius: 50%;
    opacity: 0.6;
  }

  .line {
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, transparent, $primary, transparent);
    opacity: 0.4;
  }
}

// 搜索框
.search-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.search-wrapper {
  width: 100%;
  height: 64px;
  background: $white;
  border-radius: 32px;
  display: flex;
  align-items: center;
  padding: 6px;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover, &:focus-within {
    transform: translateY(-2px);
    border-color: rgba($primary, 0.3);
    box-shadow: 0 15px 30px rgba(255, 154, 158, 0.15);
  }
}

.shadow-dreamy {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary;
  margin-left: 8px;

  svg {
    width: 24px;
    height: 24px;
  }
}

.search-input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  color: $text-main;
  background: transparent;
  padding: 0 12px;
  font-family: inherit;

  &::placeholder {
    color: #ccc;
  }
}

.search-btn {
  height: 48px;
  padding: 0 32px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  border: none;
  border-radius: 24px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
}

.search-tags {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.tags-label {
  font-size: 13px;
  color: $text-light;
}

.tags-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-item {
  font-size: 13px;
  color: #888;
  background: white;
  padding: 4px 12px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #eee;

  &:hover {
    color: $primary;
    border-color: rgba($primary, 0.3);
    background: #fff5f5;
  }
}

// 搜索结果
.results-section {
  width: 100%;
}

.results-header {
  margin-bottom: 20px;
  text-align: center;
}

.results-info {
  font-size: 14px;
  color: $text-light;
  background: white;
  padding: 6px 16px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); // 瀑布流式布局感
  gap: 20px;
}

// 单个卡片 - 调整为横向列表更适合阅读
.results-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-card {
  background: $card-bg;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  gap: 20px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.02);
  box-shadow: 0 5px 20px rgba(0,0,0,0.02);
  animation: slideUp 0.5s ease backwards;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(255, 154, 158, 0.1);
    border-color: rgba($primary, 0.1);
  }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-image {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-date {
  font-size: 12px;
  color: $text-light;
  margin-bottom: 4px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: $text-main;
  margin: 0 0 8px;
  line-height: 1.4;
}

.card-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.read-more {
  font-size: 12px;
  font-weight: 700;
  color: $primary;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.card-category {
  font-size: 11px;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
  color: #888;
}

// 空状态
.empty-state {
  text-align: center;
  margin-top: 20px;
}

.empty-illustration {
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 50%;
  margin: 0 auto 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);

  .cat-ears {
    position: absolute;
    top: 25px;
    width: 80px;
    height: 30px;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 20px solid $primary;
    }
    &::before { left: 10px; transform: rotate(-15deg); opacity: 0.5; }
    &::after { right: 10px; transform: rotate(15deg); opacity: 0.5; }
  }

  .cat-face {
    width: 60px;
    height: 40px;
    z-index: 2;

    .eyes {
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      margin-bottom: 5px;

      .eye {
        width: 6px;
        height: 6px;
        background: $text-main;
        border-radius: 50%;
        animation: blink 4s infinite;
      }
    }

    .nose {
      width: 8px;
      height: 6px;
      background: $primary;
      border-radius: 0 0 50% 50%;
      margin: 0 auto;
    }
  }
}

@keyframes blink {
  0%, 90%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
}

.empty-text {
  font-size: 18px;
  font-weight: 700;
  color: $text-main;
  margin: 0 0 6px;
}

.empty-subtext {
  font-size: 14px;
  color: $text-light;
}

// 响应式
@media (max-width: 768px) {
  .search-page {
    padding: 30px 16px;
  }

  .title-main {
    font-size: 32px;
  }

  .result-card {
    flex-direction: column;
    gap: 12px;

    .card-image {
      width: 100%;
      height: 100px;
    }
  }
}
</style>

