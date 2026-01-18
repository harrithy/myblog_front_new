<template>
  <div class="me-page">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <div class="me-container">
      <!-- 左侧：个人卡片 -->
      <aside class="profile-card">
        <div class="avatar-wrapper">
          <img :src="avatarImg" alt="avatar" class="avatar" />
          <div class="status-dot"></div>
        </div>
        <h1 class="name">{{ profile.name }}</h1>
        <p class="title">{{ profile.title }}</p>
        <p class="bio">{{ profile.bio }}</p>

        <!-- 社交链接 -->
        <div class="social-links">
          <a
            v-for="(link, index) in socialLinks"
            :key="index"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
            :style="{ '--brand-color': link.color }"
          >
            <component :is="link.icon" class="social-icon" />
          </a>
        </div>

        <!-- 联系信息 -->
        <div class="contact-info">
          <div class="contact-item">
            <span class="icon">📍</span>
            <span>{{ profile.location }}</span>
          </div>
          <div class="contact-item">
            <span class="icon">📧</span>
            <span>{{ profile.email }}</span>
          </div>
        </div>
      </aside>

      <!-- 右侧：详细内容 -->
      <main class="content-area">
        <!-- 关于我 -->
        <section class="section about-section">
          <h2 class="section-title">
            <span class="title-icon">👋</span>
            关于我
          </h2>
          <div class="about-content">
            <p v-for="(text, index) in aboutTexts" :key="index">{{ text }}</p>
          </div>
        </section>

        <!-- 技能 -->
        <section class="section skills-section">
          <h2 class="section-title">
            <span class="title-icon">🛠️</span>
            技术栈
          </h2>
          <div class="skills-grid">
            <div
              v-for="(skill, index) in skills"
              :key="index"
              class="skill-card"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <span class="skill-icon">{{ skill.icon }}</span>
              <span class="skill-name">{{ skill.name }}</span>
              <div class="skill-level">
                <div
                  class="level-fill"
                  :style="{ width: `${skill.level}%`, background: skill.color }"
                ></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 经历时间线 -->
        <section class="section timeline-section">
          <h2 class="section-title">
            <span class="title-icon">📚</span>
            个人经历
          </h2>
          <div class="timeline">
            <div
              v-for="(item, index) in timeline"
              :key="index"
              class="timeline-item"
              :style="{ animationDelay: `${index * 0.15}s` }"
            >
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <h3 class="timeline-title">{{ item.title }}</h3>
                  <span class="timeline-date">{{ item.date }}</span>
                </div>
                <p class="timeline-subtitle">{{ item.subtitle }}</p>
                <p class="timeline-desc">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 项目展示 -->
        <section class="section projects-section">
          <h2 class="section-title">
            <span class="title-icon">💻</span>
            项目作品
          </h2>
          <div class="projects-grid">
            <div
              v-for="(project, index) in projects"
              :key="index"
              class="project-card"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="project-header">
                <span class="project-icon">{{ project.icon }}</span>
                <h3 class="project-name">{{ project.name }}</h3>
              </div>
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
                查看项目 →
              </a>
            </div>
          </div>
        </section>

        <!-- 兴趣爱好 -->
        <section class="section hobbies-section">
          <h2 class="section-title">
            <span class="title-icon">🎮</span>
            兴趣爱好
          </h2>
          <div class="hobbies-grid">
            <div v-for="(hobby, index) in hobbies" :key="index" class="hobby-item">
              <span class="hobby-icon">{{ hobby.icon }}</span>
              <span class="hobby-name">{{ hobby.name }}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
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
}

const socialLinks: SocialLink[] = [
  { url: 'https://github.com/harrithy', icon: GithubIcon, color: '#24292e' },
  { url: 'https://space.bilibili.com/209674243', icon: BilibiliIcon, color: '#fb7299' },
  { url: 'mailto:2656450899@qq.com', icon: EmailIcon, color: '#1296db' },
]
</script>

<style lang="scss" scoped>
.me-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  position: relative;
  overflow-x: hidden;
}

// 背景装饰
.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 20s infinite ease-in-out;
  }

  .circle-1 {
    width: 400px;
    height: 400px;
    top: -100px;
    right: -100px;
    animation-delay: 0s;
  }

  .circle-2 {
    width: 300px;
    height: 300px;
    bottom: -50px;
    left: -50px;
    animation-delay: -7s;
  }

  .circle-3 {
    width: 200px;
    height: 200px;
    top: 50%;
    left: 50%;
    animation-delay: -14s;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.me-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
  position: relative;
  z-index: 1;
}

// 左侧个人卡片
.profile-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 40px;
  height: fit-content;
  animation: slideInLeft 0.6s ease-out;

  .avatar-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 20px;

    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #9b59b6;
      box-shadow: 0 10px 30px rgba(155, 89, 182, 0.3);
    }

    .status-dot {
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      background: #2ecc71;
      border-radius: 50%;
      border: 3px solid white;
      animation: pulse 2s infinite;
    }
  }

  .name {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin: 0 0 8px 0;
  }

  .title {
    font-size: 14px;
    color: #9b59b6;
    margin: 0 0 15px 0;
    font-weight: 500;
  }

  .bio {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin: 0 0 25px 0;
  }

  .social-links {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 25px;

    .social-link {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      color: var(--brand-color);

      &:hover {
        background: var(--brand-color);
        color: white;
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }

      .social-icon {
        width: 20px;
        height: 20px;
      }
    }
  }

  .contact-info {
    border-top: 1px solid #eee;
    padding-top: 20px;

    .contact-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 13px;
      color: #666;
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }

      .icon {
        font-size: 16px;
      }
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(46, 204, 113, 0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// 右侧内容区
.content-area {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s ease-out both;

  &:nth-child(1) {
    animation-delay: 0.1s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.3s;
  }
  &:nth-child(4) {
    animation-delay: 0.4s;
  }
  &:nth-child(5) {
    animation-delay: 0.5s;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;

  .title-icon {
    font-size: 24px;
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

// 关于我
.about-content {
  p {
    font-size: 15px;
    line-height: 1.8;
    color: #555;
    margin: 0 0 15px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// 技能
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.skill-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease-out both;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }

  .skill-icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  .skill-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    flex-shrink: 0;
  }

  .skill-level {
    flex: 1;
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;

    .level-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 1s ease-out;
    }
  }
}

// 时间线
.timeline {
  position: relative;
  padding-left: 30px;

  &::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, #9b59b6, #667eea);
  }
}

.timeline-item {
  position: relative;
  padding-bottom: 25px;
  animation: fadeInUp 0.5s ease-out both;

  &:last-child {
    padding-bottom: 0;
  }

  .timeline-dot {
    position: absolute;
    left: -26px;
    top: 5px;
    width: 14px;
    height: 14px;
    background: #9b59b6;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.2);
  }

  .timeline-content {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    }
  }

  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .timeline-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .timeline-date {
    font-size: 12px;
    color: #9b59b6;
    font-weight: 500;
  }

  .timeline-subtitle {
    font-size: 14px;
    color: #666;
    margin: 0 0 8px 0;
  }

  .timeline-desc {
    font-size: 13px;
    color: #888;
    line-height: 1.6;
    margin: 0;
  }
}

// 项目
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.project-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 25px;
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease-out both;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .project-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 15px;
  }

  .project-icon {
    font-size: 28px;
  }

  .project-name {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .project-desc {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin: 0 0 15px 0;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 15px;

    .tag {
      font-size: 12px;
      padding: 4px 10px;
      background: rgba(155, 89, 182, 0.1);
      color: #9b59b6;
      border-radius: 20px;
    }
  }

  .project-link {
    display: inline-block;
    font-size: 14px;
    color: #9b59b6;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      color: #764ba2;
      transform: translateX(5px);
    }
  }
}

// 兴趣爱好
.hobbies-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.hobby-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f8f9fa;
  border-radius: 30px;
  transition: all 0.3s ease;

  &:hover {
    background: #9b59b6;
    transform: scale(1.05);

    .hobby-name {
      color: white;
    }
  }

  .hobby-icon {
    font-size: 20px;
  }

  .hobby-name {
    font-size: 14px;
    font-weight: 500;
    color: #555;
    transition: color 0.3s ease;
  }
}

// 响应式设计
@media (max-width: 900px) {
  .me-container {
    grid-template-columns: 1fr;
  }

  .profile-card {
    position: relative;
    top: 0;
  }
}

@media (max-width: 600px) {
  .me-page {
    padding: 20px 15px;
  }

  .section {
    padding: 20px;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .timeline-item .timeline-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>
