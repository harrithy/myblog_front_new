<template>
  <div class="me-page">
    <!-- 返回顶部按钮 -->
    <a href="#" class="back-to-top">
      <span class="arrow-icon">↑</span>
    </a>

    <!-- 滚动状态栏 -->
    <div class="status-marquee">
      <div class="marquee-track">
        <div class="marquee-content">
          <span>● 当前状态：正在写代码</span>
          <span>● 最近在听：Synthwave Mix</span>
          <span>● 心情：充满活力</span>
          <span>● 阅读中：技术博客</span>
          <span>● 正在学习：新技术</span>
          <span>● 当前状态：正在写代码</span>
          <span>● 最近在听：Synthwave Mix</span>
          <span>● 心情：充满活力</span>
          <span>● 阅读中：技术博客</span>
          <span>● 正在学习：新技术</span>
        </div>
      </div>
    </div>

    <main class="main-content">
      <!-- Hero 区域 -->
      <section class="hero-section">
        <div class="hero-badge">Open for work!</div>
        <div class="hero-container">
          <!-- 头像区域 -->
          <div class="avatar-wrapper">
            <div class="avatar-sticker">
              <div class="avatar-star">
                <img :src="avatarImg" alt="avatar" class="avatar" />
              </div>
            </div>
          </div>
          <!-- 信息区域 -->
          <div class="hero-info">
            <h1 class="hero-title">{{ profile.name }}</h1>
            <p class="hero-subtitle">{{ profile.title }}</p>
            <p class="hero-bio">{{ profile.bio }}</p>
            <!-- 社交链接 -->
            <div class="social-links">
              <a
                v-for="(link, index) in socialLinks"
                :key="index"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link"
                :class="`rotate-${(index % 3) - 1}`"
              >
                <component :is="link.icon" class="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 统计数据 -->
      <section class="stats-section">
        <div class="stat-card rotate-n1">
          <span class="stat-icon">📍</span>
          <p class="stat-value">{{ profile.location }}</p>
          <p class="stat-label">Location</p>
        </div>
        <div class="stat-card primary rotate-2">
          <span class="stat-icon">📧</span>
          <p class="stat-value">CONTACT</p>
          <p class="stat-label">Email Me</p>
        </div>
        <div class="stat-card rotate-n1">
          <span class="stat-icon">💼</span>
          <p class="stat-value">{{ skills.length }}+</p>
          <p class="stat-label">Tech Stack</p>
        </div>
      </section>

      <!-- 关于我 -->
      <section class="content-section">
        <div class="section-header">
          <span class="section-arrow">↓</span>
          <h2 class="section-title-neo">关于我</h2>
        </div>
        <div class="about-card">
          <p v-for="(text, index) in aboutTexts" :key="index" class="about-text">{{ text }}</p>
        </div>
      </section>

      <!-- 技能标签云 -->
      <section class="content-section">
        <div class="section-header">
          <span class="section-arrow">↓</span>
          <h2 class="section-title-neo">技术栈</h2>
        </div>
        <div class="tags-cloud">
          <a
            v-for="(skill, index) in skills"
            :key="index"
            href="#"
            class="skill-tag"
            :class="getTagClass(index)"
            :style="{ '--tag-color': skill.color }"
          >
            <span class="skill-icon">{{ skill.icon }}</span>
            {{ skill.name }}
          </a>
        </div>
      </section>

      <!-- 经历时间线 -->
      <section class="content-section">
        <div class="section-header">
          <span class="section-arrow">↓</span>
          <h2 class="section-title-neo">个人经历</h2>
        </div>
        <div class="timeline-grid">
          <div
            v-for="(item, index) in timeline"
            :key="index"
            class="timeline-card"
            :class="getCardRotation(index)"
          >
            <div class="timeline-badge">{{ item.date }}</div>
            <h3 class="timeline-title">{{ item.title }}</h3>
            <p class="timeline-subtitle">{{ item.subtitle }}</p>
            <p class="timeline-desc">{{ item.description }}</p>
          </div>
        </div>
      </section>

      <!-- 项目展示 -->
      <section class="content-section">
        <div class="section-header">
          <span class="section-arrow">↓</span>
          <h2 class="section-title-neo">项目作品</h2>
        </div>
        <div class="projects-grid">
          <article
            v-for="(project, index) in projects"
            :key="index"
            class="project-card"
            :class="getCardRotation(index)"
          >
            <div class="project-category">{{ project.tags[0] }}</div>
            <div class="project-icon">{{ project.icon }}</div>
            <h3 class="project-name">{{ project.name }}</h3>
            <p class="project-desc">{{ project.description }}</p>
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <a
              v-if="project.link"
              :href="project.link"
              target="_blank"
              rel="noopener noreferrer"
              class="project-link"
            >
              查看项目 <span>→</span>
            </a>
          </article>
        </div>
      </section>

      <!-- 兴趣爱好 -->
      <section class="content-section">
        <div class="section-header">
          <span class="section-arrow">↓</span>
          <h2 class="section-title-neo">兴趣爱好</h2>
        </div>
        <div class="hobbies-container">
          <div class="hobbies-title-box">
            <h3>我的爱好</h3>
          </div>
          <div class="hobbies-tags">
            <a
              v-for="(hobby, index) in hobbies"
              :key="index"
              href="#"
              class="hobby-tag"
              :class="getTagClass(index)"
            >
              <span class="hobby-icon">{{ hobby.icon }}</span>
              {{ hobby.name }}
            </a>
          </div>
        </div>
      </section>

      <!-- 订阅区域 -->
      <section class="subscribe-section">
        <div class="subscribe-decoration"></div>
        <div class="subscribe-content">
          <h2 class="subscribe-title">保持联系</h2>
          <p class="subscribe-text">欢迎通过邮件或社交媒体与我联系，期待与你交流！</p>
          <div class="subscribe-buttons">
            <a :href="'mailto:' + profile.email" class="subscribe-btn primary">发送邮件</a>
            <a href="https://github.com/harrithy" target="_blank" class="subscribe-btn">GitHub</a>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="neo-footer">
      <div class="footer-content">
        <div class="footer-left">
          <h2 class="footer-name">{{ profile.name }}</h2>
          <div class="footer-links">
            <a v-for="(link, index) in socialLinks" :key="index" :href="link.url" target="_blank">
              {{ link.label }}
            </a>
          </div>
        </div>
        <div class="footer-right">
          <p>© 2024 {{ profile.name }}. All rights reserved.</p>
          <p>Designed with ❤️ and chaos.</p>
          <div class="footer-colors">
            <div class="color-box primary"></div>
            <div class="color-box pink"></div>
            <div class="color-box white"></div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { h, type Component } from 'vue'
import avatarImg from '@/assets/source/avatar.gif'

defineOptions({
  name: 'MeView',
})

// 个人资料
const profile = {
  name: 'Harrithy',
  title: '全栈开发者 / 前端工程师',
  bio: '热爱编程，热爱生活。在代码的世界里探索无限可能。',
  location: '中国',
  email: '2656450899@qq.com',
}

// 关于我的文本
const aboutTexts = [
  '你好！我是一名热爱技术的全栈开发者，专注于 Web 开发领域。',
  '我喜欢用代码创造有趣的东西，享受从0到1构建产品的过程。对新技术保持好奇心，持续学习和探索。',
  '在工作之余，我喜欢看动漫、玩游戏、听音乐。我相信技术可以让生活更美好，希望能通过代码为这个世界带来一些积极的改变。',
]

// 技能数据
const skills = [
  { name: 'Vue.js', icon: '💚', level: 90, color: '#42b883' },
  { name: 'TypeScript', icon: '💙', level: 85, color: '#3178c6' },
  { name: 'Node.js', icon: '🟢', level: 80, color: '#68a063' },
  { name: 'Python', icon: '🐍', level: 75, color: '#3776ab' },
  { name: 'React', icon: '⚛️', level: 70, color: '#61dafb' },
  { name: 'CSS/SCSS', icon: '🎨', level: 88, color: '#cc6699' },
  { name: 'Git', icon: '🔧', level: 85, color: '#f05032' },
  { name: 'Docker', icon: '🐳', level: 65, color: '#2496ed' },
]

// 时间线数据
const timeline = [
  {
    title: '前端开发工程师',
    subtitle: '某科技公司',
    date: '2023 - 至今',
    description: '负责公司核心产品的前端架构设计与开发，使用 Vue3 + TypeScript 技术栈。',
  },
  {
    title: '全栈开发实习',
    subtitle: '某互联网公司',
    date: '2022 - 2023',
    description: '参与多个项目的前后端开发，学习并实践敏捷开发流程。',
  },
  {
    title: '计算机科学与技术',
    subtitle: '某大学',
    date: '2019 - 2023',
    description: '系统学习计算机基础知识，参与多项校级创新项目。',
  },
]

// 项目数据
const projects = [
  {
    name: '个人博客系统',
    icon: '📝',
    description: '基于 Vue3 + Node.js 开发的全栈博客系统，支持 Markdown 编辑、评论互动等功能。',
    tags: ['Vue3', 'Node.js', 'MongoDB'],
    link: 'https://github.com/harrithy',
  },
  {
    name: '任务管理应用',
    icon: '✅',
    description: '一款简洁高效的任务管理工具，支持多人协作、进度追踪等功能。',
    tags: ['React', 'TypeScript', 'Firebase'],
    link: '',
  },
  {
    name: 'AI 图片生成器',
    icon: '🎨',
    description: '集成多个 AI 模型的图片生成工具，支持文生图、图生图等功能。',
    tags: ['Python', 'FastAPI', 'Stable Diffusion'],
    link: '',
  },
]

// 兴趣爱好
const hobbies = [
  { icon: '🎮', name: '游戏' },
  { icon: '📺', name: '动漫' },
  { icon: '🎵', name: '音乐' },
  { icon: '📖', name: '阅读' },
  { icon: '🏃', name: '跑步' },
  { icon: '☕', name: '咖啡' },
]

// 社交链接图标组件
const GithubIcon = () =>
  h(
    'svg',
    { viewBox: '0 0 24 24', fill: 'currentColor' },
    h('path', {
      d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
    }),
  )

const BilibiliIcon = () =>
  h(
    'svg',
    { viewBox: '0 0 24 24', fill: 'currentColor' },
    h('path', {
      d: 'M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373Z',
    }),
  )

const EmailIcon = () =>
  h(
    'svg',
    { viewBox: '0 0 24 24', fill: 'currentColor' },
    h('path', {
      d: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
    }),
  )

interface SocialLink {
  url: string
  icon: Component
  color: string
  label: string
}

const socialLinks: SocialLink[] = [
  { url: 'https://github.com/harrithy', icon: GithubIcon, color: '#24292e', label: 'GitHub' },
  {
    url: 'https://space.bilibili.com/209674243',
    icon: BilibiliIcon,
    color: '#fb7299',
    label: 'Bilibili',
  },
  { url: 'mailto:2656450899@qq.com', icon: EmailIcon, color: '#1296db', label: 'Email' },
]

// 获取标签样式类
const getTagClass = (index: number): string => {
  const classes = ['tag-primary', 'tag-yellow', 'tag-pink', 'tag-white', 'tag-black']
  const rotations = ['rotate-n2', 'rotate-3', 'rotate-1', 'rotate-n3', 'rotate-2', 'rotate-n1']
  return `${classes[index % classes.length]} ${rotations[index % rotations.length]}`
}

// 获取卡片旋转样式
const getCardRotation = (index: number): string => {
  const rotations = ['rotate-n1', 'rotate-2', 'rotate-1', 'rotate-n2']
  return rotations[index % rotations.length]
}
</script>

<style lang="scss" scoped>
// 颜色变量
$primary: #d0bb95;
$secondary-yellow: #ffeb3b;
$secondary-pink: #ff69b4;
$bg-light: #f7f7f6;
$text-main: #111418;

// Neo-Brutalist 基础样式
.me-page {
  min-height: 100vh;
  background: $bg-light;
  font-family: 'Space Grotesk', sans-serif;
  color: $text-main;
  overflow-x: hidden;
}

// 返回顶部按钮
.back-to-top {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 50;
  background: $secondary-yellow;
  border: 3px solid #000;
  height: 64px;
  width: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 5px 5px 0px 0px #000;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 8px 8px 0px 0px #000;
  }

  .arrow-icon {
    font-size: 32px;
    font-weight: 900;
    color: #000;
  }
}

// 状态滚动栏
.status-marquee {
  width: 100%;
  border-bottom: 3px solid #000;
  background: #000;
  color: $secondary-yellow;
  overflow: hidden;
  padding: 12px 0;
  position: sticky;
  top: 0;
  z-index: 40;

  .marquee-track {
    display: flex;
    width: max-content;
  }

  .marquee-content {
    display: flex;
    gap: 48px;
    font-weight: 700;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 2px;
    white-space: nowrap;
    padding: 0 24px;
    animation: marquee 25s linear infinite;

    span {
      display: inline-block;
    }
  }
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

// 主内容区
.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 16px 80px;
  max-width: 1200px;
  margin: 0 auto;
}

// Hero 区域
.hero-section {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px 48px;
  border: 3px solid #000;
  background: $secondary-yellow;
  box-shadow: 8px 8px 0px 0px #000;
  margin-bottom: 64px;

  .hero-badge {
    position: absolute;
    top: -24px;
    right: -32px;
    transform: rotate(12deg);
    background: $secondary-pink;
    border: 3px solid #000;
    padding: 8px 16px;
    box-shadow: 5px 5px 0px 0px #000;
    font-weight: 900;
    font-size: 18px;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
      transform: rotate(0deg);
    }
  }

  .hero-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: flex-start;
    }
  }
}

// 头像样式
.avatar-wrapper {
  flex-shrink: 0;

  .avatar-sticker {
    filter: drop-shadow(4px 4px 0px #fff) drop-shadow(8px 8px 0px #000);
    transform: rotate(-3deg);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05) rotate(5deg);
    }
  }

  .avatar-star {
    width: 192px;
    height: 192px;
    background: #000;
    clip-path: polygon(
      50% 0%,
      61% 35%,
      98% 35%,
      68% 57%,
      79% 91%,
      50% 70%,
      21% 91%,
      32% 57%,
      2% 35%,
      39% 35%
    );
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    @media (min-width: 768px) {
      width: 256px;
      height: 256px;
    }
  }

  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// Hero 信息
.hero-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: center;
  width: 100%;

  @media (min-width: 768px) {
    text-align: left;
  }

  .hero-title {
    font-size: 48px;
    font-weight: 900;
    line-height: 0.9;
    letter-spacing: -2px;
    margin: 0;
    text-transform: uppercase;

    @media (min-width: 768px) {
      font-size: 72px;
    }
  }

  .hero-subtitle {
    font-size: 18px;
    font-weight: 600;
    border-left: 4px solid #000;
    padding-left: 16px;
    background: rgba(255, 255, 255, 0.5);
    padding: 8px 16px;
    margin: 0;

    @media (min-width: 768px) {
      font-size: 24px;
    }
  }

  .hero-bio {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
    max-width: 500px;
  }
}

// 社交链接
.social-links {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }

  .social-link {
    width: 56px;
    height: 56px;
    border: 3px solid #000;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 3px 3px 0px 0px #000;
    transition: all 0.2s ease;
    color: #000;

    &:hover {
      transform: translateY(2px);
      box-shadow: none;
    }

    &.rotate-0 {
      transform: rotate(3deg);
      &:hover {
        transform: rotate(0deg) translateY(2px);
      }
    }
    &.rotate--1 {
      transform: rotate(-2deg);
      &:hover {
        transform: rotate(0deg) translateY(2px);
      }
    }
    &.rotate-1 {
      transform: rotate(1deg);
      &:hover {
        transform: rotate(0deg) translateY(2px);
      }
    }

    .social-icon {
      width: 28px;
      height: 28px;
    }
  }
}

// 统计数据
.stats-section {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
  width: 100%;
  margin-bottom: 64px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.stat-card {
  background: #fff;
  border: 3px solid #000;
  box-shadow: 5px 5px 0px 0px #000;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translate(-2px, -2px) rotate(-1deg);
    box-shadow: 8px 8px 0px 0px #000;
    z-index: 10;
  }

  &.primary {
    background: $primary;
    color: #fff;

    .stat-label {
      border-color: #fff;
    }
  }

  &.rotate-n1 {
    transform: rotate(-1deg);
  }
  &.rotate-2 {
    transform: rotate(2deg);
  }

  .stat-icon {
    font-size: 40px;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 900;
    margin: 0;
  }

  .stat-label {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    border-bottom: 3px solid $primary;
    padding-bottom: 4px;
    margin: 0;
  }
}

// 内容区域标题
.content-section {
  width: 100%;
  margin-bottom: 64px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  .section-arrow {
    font-size: 48px;
    font-weight: 900;
    animation: bounce 1s infinite;
  }

  .section-title-neo {
    font-size: 36px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -1px;
    background: #000;
    color: #fff;
    padding: 8px 24px;
    transform: skewX(-6deg);
    border: 3px solid transparent;
    box-shadow: 5px 5px 0px 0px #000;
    margin: 0;
    transition: all 0.3s ease;

    &:hover {
      border-color: #fff;
      color: $secondary-yellow;
    }

    @media (min-width: 768px) {
      font-size: 48px;
    }
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

// 关于我卡片
.about-card {
  background: #fff;
  border: 3px solid #000;
  box-shadow: 5px 5px 0px 0px #000;
  padding: 32px;
  transform: rotate(1deg);
  transition: all 0.2s ease;

  &:hover {
    transform: rotate(0deg) translate(-2px, -2px);
    box-shadow: 8px 8px 0px 0px #000;
  }

  .about-text {
    font-size: 16px;
    line-height: 1.8;
    margin: 0 0 16px 0;
    font-weight: 500;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// 技能标签云
.tags-cloud {
  background: #fff;
  border: 3px solid #000;
  box-shadow: 8px 8px 0px 0px #000;
  padding: 48px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  align-items: center;
}

.skill-tag {
  border: 3px solid #000;
  padding: 8px 24px;
  font-weight: 700;
  box-shadow: 3px 3px 0px 0px #000;
  transition: all 0.2s ease;
  text-decoration: none;
  color: #000;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(2px);
    box-shadow: none;
  }

  .skill-icon {
    font-size: 20px;
  }

  // 颜色变体
  &.tag-primary {
    background: $primary;
    color: #fff;
  }
  &.tag-yellow {
    background: $secondary-yellow;
  }
  &.tag-pink {
    background: $secondary-pink;
  }
  &.tag-white {
    background: #fff;
  }
  &.tag-black {
    background: #000;
    color: #fff;
  }

  // 旋转变体
  &.rotate-n1 {
    transform: rotate(-1deg);
  }
  &.rotate-n2 {
    transform: rotate(-2deg);
  }
  &.rotate-n3 {
    transform: rotate(-3deg);
  }
  &.rotate-1 {
    transform: rotate(1deg);
  }
  &.rotate-2 {
    transform: rotate(2deg);
  }
  &.rotate-3 {
    transform: rotate(3deg);
  }
}

// 时间线网格
.timeline-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.timeline-card {
  background: #fff;
  border: 3px solid #000;
  box-shadow: 5px 5px 0px 0px #000;
  padding: 24px;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    transform: translate(-2px, -2px) rotate(0deg) !important;
    box-shadow: 8px 8px 0px 0px #000;
    z-index: 10;
  }

  &.rotate-n1 {
    transform: rotate(-1deg);
  }
  &.rotate-n2 {
    transform: rotate(-2deg);
  }
  &.rotate-1 {
    transform: rotate(1deg);
  }
  &.rotate-2 {
    transform: rotate(2deg);
  }

  .timeline-badge {
    position: absolute;
    top: -12px;
    right: 16px;
    background: $secondary-pink;
    border: 3px solid #000;
    padding: 4px 12px;
    font-weight: 700;
    font-size: 12px;
    box-shadow: 3px 3px 0px 0px #000;
  }

  .timeline-title {
    font-size: 20px;
    font-weight: 900;
    margin: 0 0 8px 0;
    text-transform: uppercase;
  }

  .timeline-subtitle {
    font-size: 14px;
    font-weight: 600;
    color: #666;
    margin: 0 0 12px 0;
  }

  .timeline-desc {
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
    color: #444;
  }
}

// 项目展示
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.project-card {
  background: #fff;
  border: 3px solid #000;
  box-shadow: 5px 5px 0px 0px #000;
  padding: 24px;
  position: relative;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translate(-2px, -2px) rotate(0deg) !important;
    box-shadow: 8px 8px 0px 0px #000;
    z-index: 10;
  }

  &.rotate-n1 {
    transform: rotate(-1deg);
  }
  &.rotate-n2 {
    transform: rotate(-2deg);
  }
  &.rotate-1 {
    transform: rotate(1deg);
  }
  &.rotate-2 {
    transform: rotate(2deg);
  }

  .project-category {
    position: absolute;
    top: -12px;
    left: 16px;
    background: $secondary-yellow;
    border: 3px solid #000;
    padding: 4px 12px;
    font-weight: 700;
    font-size: 12px;
    box-shadow: 3px 3px 0px 0px #000;
    transform: rotate(3deg);
  }

  .project-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .project-name {
    font-size: 24px;
    font-weight: 900;
    margin: 0 0 12px 0;
    text-transform: uppercase;
  }

  .project-desc {
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 16px 0;
    color: #444;
    flex-grow: 1;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;

    .tag {
      font-size: 12px;
      padding: 4px 10px;
      background: rgba(0, 0, 0, 0.1);
      border: 2px solid #000;
      font-weight: 600;
    }
  }

  .project-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #000;
    color: #fff;
    border: 3px solid #000;
    padding: 12px 24px;
    font-weight: 700;
    text-decoration: none;
    text-transform: uppercase;
    transition: all 0.2s ease;

    &:hover {
      background: $primary;
      color: #000;
    }
  }
}

// 兴趣爱好
.hobbies-container {
  background: #fff;
  border: 3px solid #000;
  box-shadow: 8px 8px 0px 0px #000;
  padding: 48px;
  position: relative;
  overflow: hidden;
  transform: rotate(1deg);
}

.hobbies-title-box {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 3px solid #000;
  padding: 8px 24px;
  box-shadow: 5px 5px 0px 0px #000;
  z-index: 10;

  h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 900;
    text-transform: uppercase;
  }
}

.hobbies-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
}

.hobby-tag {
  border: 3px solid #000;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 18px;
  box-shadow: 3px 3px 0px 0px #000;
  transition: all 0.2s ease;
  text-decoration: none;
  color: #000;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(2px) rotate(0deg) !important;
    box-shadow: none;
  }

  .hobby-icon {
    font-size: 24px;
  }

  // 颜色变体
  &.tag-primary {
    background: $primary;
    color: #fff;
  }
  &.tag-yellow {
    background: $secondary-yellow;
  }
  &.tag-pink {
    background: $secondary-pink;
  }
  &.tag-white {
    background: #fff;
  }
  &.tag-black {
    background: #000;
    color: #fff;
  }

  // 旋转变体
  &.rotate-n1 {
    transform: rotate(-1deg);
  }
  &.rotate-n2 {
    transform: rotate(-2deg);
  }
  &.rotate-n3 {
    transform: rotate(-3deg);
  }
  &.rotate-1 {
    transform: rotate(1deg);
  }
  &.rotate-2 {
    transform: rotate(2deg);
  }
  &.rotate-3 {
    transform: rotate(3deg);
  }
}

// 订阅区域
.subscribe-section {
  width: 100%;
  max-width: 800px;
  border: 3px solid #000;
  background: #fff;
  padding: 32px 48px;
  box-shadow: 8px 8px 0px 0px #000;
  position: relative;
  overflow: hidden;
  transform: rotate(1deg);
  margin-bottom: 64px;

  .subscribe-decoration {
    position: absolute;
    top: -40px;
    right: -40px;
    width: 160px;
    height: 160px;
    background: $secondary-pink;
    border-radius: 50%;
    border: 3px solid #000;
    z-index: 0;
  }

  .subscribe-content {
    position: relative;
    z-index: 10;
    text-align: center;
  }

  .subscribe-title {
    font-size: 36px;
    font-weight: 900;
    text-transform: uppercase;
    margin: 0 0 8px 0;

    @media (min-width: 768px) {
      font-size: 48px;
    }
  }

  .subscribe-text {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 24px 0;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  .subscribe-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
  }

  .subscribe-btn {
    border: 3px solid #000;
    padding: 16px 32px;
    font-weight: 900;
    text-transform: uppercase;
    text-decoration: none;
    box-shadow: 3px 3px 0px 0px #000;
    transition: all 0.2s ease;
    background: #fff;
    color: #000;

    &:hover {
      transform: translateY(2px);
      box-shadow: none;
    }

    &.primary {
      background: #000;
      color: #fff;

      &:hover {
        background: $primary;
        color: #000;
      }
    }
  }
}

// Footer
.neo-footer {
  border-top: 3px solid #000;
  background: $secondary-yellow;
  padding: 64px 24px 32px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.footer-left {
  .footer-name {
    font-size: 48px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -2px;
    line-height: 1;
    margin: 0 0 16px 0;
  }

  .footer-links {
    display: flex;
    flex-direction: column;
    gap: 8px;

    a {
      font-weight: 700;
      font-size: 16px;
      text-decoration: none;
      color: #000;
      display: inline-block;
      padding: 2px 4px;
      width: fit-content;
      transition: all 0.2s ease;

      &:hover {
        background: #000;
        color: #fff;
      }
    }
  }
}

.footer-right {
  text-align: left;

  @media (min-width: 768px) {
    text-align: right;
  }

  p {
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    margin: 0 0 8px 0;
  }

  .footer-colors {
    display: flex;
    gap: 8px;
    margin-top: 16px;

    @media (min-width: 768px) {
      justify-content: flex-end;
    }

    .color-box {
      width: 32px;
      height: 32px;
      border: 2px solid #000;

      &.primary {
        background: $primary;
      }
      &.pink {
        background: $secondary-pink;
      }
      &.white {
        background: #fff;
      }
    }
  }
}

// 响应式调整
@media (max-width: 600px) {
  .hero-section {
    padding: 24px;
    margin-bottom: 40px;

    .hero-badge {
      top: -16px;
      right: -8px;
      font-size: 14px;
    }
  }

  .section-header {
    .section-arrow {
      font-size: 32px;
    }

    .section-title-neo {
      font-size: 24px;
      padding: 8px 16px;
    }
  }

  .tags-cloud,
  .hobbies-container {
    padding: 32px 16px;
  }

  .subscribe-section {
    padding: 24px;
  }
}
</style>
