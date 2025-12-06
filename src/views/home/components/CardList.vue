<template>
  <div class="card-list-wrapper">
    <h3 class="section-title">Explore</h3>
    <div class="card-list">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="card-wrapper"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @mouseenter="handleMouseEnter(index)"
        @mouseleave="handleMouseLeave(index)"
      >
        <div
          class="card-flip"
          :class="{ 'is-flipped': flippedCards[index], 'is-hovered': hoveredCards[index] }"
        >
          <!-- 卡片正面 -->
          <div class="card-front">
            <div class="card-image">
              <img :src="card.image" :alt="card.title" />
            </div>
          </div>
          <!-- 卡片背面 -->
          <div
            class="card-back"
            :style="{
              background: `linear-gradient(135deg, ${card.themeColor}15 0%, ${card.themeColor}30 100%)`,
              borderColor: `${card.themeColor}60`,
              '--card-theme-color': card.themeColor,
            }"
            @click="handleCardClick(card)"
          >
            <div class="border-animation"></div>
            <div class="card-back-content">
              <h3 :style="{ color: card.themeColor }">{{ card.title }}</h3>
              <div class="description-wrapper">
                <p
                  class="card-description"
                  :style="{ color: card.themeColor, filter: 'brightness(0.6)' }"
                >
                  {{ card.description }}
                </p>
                <div
                  class="description-tooltip"
                  :style="{
                    background: card.themeColor,
                    '--tooltip-bg': card.themeColor,
                    color: '#fff',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }"
                >
                  {{ card.description }}
                </div>
              </div>
              <div class="card-spacer" style="flex: 1"></div>
              <div class="card-action">
                <button
                  class="learn-more"
                  :class="{ 'is-active': flippedCards[index] }"
                  :style="{ '--btn-color': card.themeColor }"
                >
                  <span class="circle" aria-hidden="true">
                    <span class="icon arrow"></span>
                  </span>
                  <span class="button-text">前往查看</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import boqiImage from '@/assets/source/boqi.png'
import hongxiaImage from '@/assets/source/hongxia.png'
import liangImage from '@/assets/source/liang.png'
import xiduoImage from '@/assets/source/xiduo.png'

interface Card {
  title: string
  description: string
  image: string
  themeColor: string // 角色主题色
  link?: string
}

const router = useRouter()

const cards = ref<Card[]>([
  {
    title: '我の博客',
    description: '记录着异世界冒险谭与魔法咏唱的绝对领域',
    image: boqiImage,
    themeColor: '#FFB6C1', // 波奇粉色
    link: '/search',
  },
  {
    title: '资源の小屋',
    description: '收纳着传说级宝具与禁忌知识的藏宝阁',
    image: hongxiaImage,
    themeColor: '#FFD700', // 虹夏粉红色
    link: '/resources',
  },
  {
    title: '家父の伟业',
    description: '铭刻着家族荣耀与羁绊的英灵座',
    image: liangImage,
    themeColor: '#4A90E2', // 凉蓝色
    link: '/family',
  },
  {
    title: '神秘&未知',
    description: '通往不可视境界线的彼方之门',
    image: xiduoImage,
    themeColor: '#FF6B9D', // 喜多金黄色
    link: '/mystery',
  },
])

// 管理每张卡片的翻转状态
const flippedCards = reactive<boolean[]>([false, false, false, false])
// 管理每张卡片的悬停状态
const hoveredCards = reactive<boolean[]>([false, false, false, false])

// 鼠标进入卡片
const handleMouseEnter = (index: number) => {
  hoveredCards[index] = true
  flippedCards[index] = true
}

// 鼠标离开卡片
const handleMouseLeave = (index: number) => {
  hoveredCards[index] = false
  flippedCards[index] = false
}

const handleCardClick = (card: Card) => {
  if (card.link) {
    console.log('Navigate to:', card.link)
    router.push(card.link)
  }
}
</script>

<style lang="scss" scoped>
.card-list-wrapper {
  width: 100%;
  // padding: 20px;
  box-sizing: border-box;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #9b59b6;
  margin: 0 0 10px 0;
  text-align: left;
  font-family:
    'Helvetica Neue', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft Yahei', sans-serif;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
  padding-bottom: 5px;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #9b59b6 0%, transparent 100%);
    border-radius: 2px;
  }
}

.card-list {
  // display: grid;
  // grid-template-columns: repeat(3, 1fr); // 一行最多3个
  gap: 20px;
  // width: 100%;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.card-wrapper {
  perspective: 1000px; // 3D透视效果
  animation: fadeInUp 0.6s ease-out both;
  width: 100%;
  flex: 1;
  max-width: 250px;
  min-width: 200px;
}
@media (max-width: 768px) {
  .card-wrapper {
    perspective: 1000px; // 3D透视效果
    animation: fadeInUp 0.6s ease-out both;
    width: 100%;
    // 取消flex: 1;
    max-width: 100%;
    min-width: 100%;
  }
}

.card-flip {
  position: relative;
  width: 100%;
  height: 150px;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.6s;

  &.is-flipped {
    transform: rotateY(180deg); // 翻转状态
  }
}

// 卡片正面
.card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; // 背面不可见
  background: rgba(255, 255, 255, 0.3); // 初始半透明
  border: 2px solid rgba(255, 255, 255, 0.5); // 更明显的边框
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(3px); // 轻微模糊
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); // 轻微阴影
  display: flex;
  flex-direction: column;
  transition: all 0.5s ease;

  .card-image {
    width: 100%;
    height: 100%;
    overflow: hidden;
    opacity: 0.3; // 初始图片半透明可见
    transition: opacity 0.5s ease;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }

  .card-title {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    padding: 16px;
    background: rgba(0, 0, 0, 0.3);
    font-family:
      'Helvetica Neue', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft Yahei', sans-serif;
    opacity: 1; // 标题始终可见
    transition: all 0.3s ease;
  }
}

// 鼠标悬停时显示图片和样式
.card-flip.is-hovered .card-front {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  .card-image {
    opacity: 1; // 显示图片

    img {
      transform: scale(1.05);
    }
  }

  .card-title {
    background: rgba(255, 255, 255, 0.7);
    color: #333;
  }
}

// 卡片背面
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  // background 由内联样式动态设置
  border: 2px solid; // border-color 由内联样式动态设置
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: rotateY(180deg); // 初始翻转180度
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.border-animation {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 16px;
  padding: 2px;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 1;
}

.border-animation::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150%;
  height: 150%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    transparent 270deg,
    var(--card-theme-color) 360deg
  );
  transform: translate(-50%, -50%);
  animation: borderRotate 4s linear infinite;
}

@keyframes borderRotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

button {
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  vertical-align: middle;
  text-decoration: none;
  background: transparent;
  padding: 0;
  font-size: inherit;
  font-family: inherit;
}

button.learn-more {
  width: 10rem;
  height: auto;
}

button.learn-more .circle {
  transition: all 1s cubic-bezier(0.65, 0, 0.076, 1);
  position: relative;
  display: block;
  margin: 0;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--btn-color);
  border-radius: 1.625rem;
}

button.learn-more .circle .icon {
  transition: all 1s cubic-bezier(0.65, 0, 0.076, 1);
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  background: #fff;
}

button.learn-more .circle .icon.arrow {
  transition: all 1s cubic-bezier(0.65, 0, 0.076, 1);
  left: 0.625rem;
  width: 1.125rem;
  height: 0.125rem;
  background: none;
}

button.learn-more .circle .icon.arrow::before {
  position: absolute;
  content: '';
  top: -0.25rem;
  right: 0;
  width: 0.625rem;
  height: 0.625rem;
  border-top: 0.125rem solid #fff;
  border-right: 0.125rem solid #fff;
  transform: rotate(45deg);
}

button.learn-more .button-text {
  transition: all 1s cubic-bezier(0.65, 0, 0.076, 1);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.5rem 0;
  margin: 0 0 0 1.5rem;
  color: var(--btn-color);
  font-weight: 700;
  line-height: 1.6;
  text-align: center;
  text-transform: uppercase;
  font-size: 0.9rem;
}

button:hover .button-text,
button.is-active .button-text {
  color: #fff;
}

button:hover .circle,
button.is-active .circle {
  width: 100%;
}

button:hover .circle .icon.arrow,
button.is-active .circle .icon.arrow {
  background: #fff;
  transform: translate(1rem, 0);
}

.card-back-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h3 {
    font-size: 16px;
    font-weight: 700;
    // color 由内联样式动态设置
    margin: 0 0 8px 0;
    text-align: center;
    font-family:
      'Helvetica Neue', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft Yahei', sans-serif;
  }
}

.description-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}

.description-tooltip {
  position: absolute;
  bottom: 100%; /* Above the text */
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: var(--tooltip-bg);
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
  width: max-content;
  max-width: 230px;
  white-space: normal;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Arrow */
.description-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: var(--tooltip-bg) transparent transparent transparent;
}

.description-wrapper:hover .description-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-5px);
}

.card-description {
  font-size: 12px;
  color: #555;
  line-height: 1.4;
  text-align: center;
  margin-bottom: 8px;
  font-family:
    'Helvetica Neue', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft Yahei', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.card-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(4px);
  }
}

.detail-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.detail-text {
  font-size: 13px;
  color: #444;
  font-family:
    'Helvetica Neue', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft Yahei', sans-serif;
}

.card-action {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  // color 和 background 由内联样式动态设置
  padding: 10px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .card-list {
    grid-template-columns: repeat(2, 1fr); // 中等屏幕显示2列
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .card-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 16px;
  }

  .card-flip {
    height: 240px;
  }

  .card-image {
    height: 160px;
  }

  .card-title {
    font-size: 16px;
    padding: 12px;
  }

  .card-back-content h3 {
    font-size: 18px;
  }

  .card-description {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .card-list {
    grid-template-columns: 1fr; // 小屏幕显示1列
    gap: 16px;
  }
}
</style>
