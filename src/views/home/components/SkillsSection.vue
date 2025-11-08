<template>
  <div class="skills-section">
    <h3 class="section-title">Skills</h3>
    <div class="skills-grid">
      <div
        v-for="(skill, index) in skills"
        :key="index"
        class="skill-item"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="skill-icon">{{ skill.icon }}</div>
        <div class="skill-info">
          <div class="skill-name">{{ skill.name }}</div>
          <!-- <div class="skill-level">
            <div class="level-bar">
              <div
                class="level-fill"
                :style="{
                  width: `${skill.level}%`,
                  background: skill.color,
                }"
              ></div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Skill {
  name: string
  icon: string
  level: number
  color: string
}

const skills = ref<Skill[]>([
  { name: 'Vue.js', icon: '💚', level: 90, color: '#42b883' },
  { name: 'TypeScript', icon: '💙', level: 85, color: '#3178c6' },
  { name: 'Node.js', icon: '🟢', level: 80, color: '#68a063' },
  { name: 'Python', icon: '🐍', level: 75, color: '#3776ab' },
  { name: 'React', icon: '⚛️', level: 70, color: '#61dafb' },
  { name: 'CSS/SCSS', icon: '🎨', level: 88, color: '#cc6699' },
])
</script>

<style lang="scss" scoped>
.skills-section {
  width: 100%;
  // padding: 20px;
  box-sizing: border-box;
  margin-bottom: 10px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #9b59b6; // 偏紫色
  margin: 0 0 10px 0;
  text-align: left;
  font-family:
    'Helvetica Neue', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft Yahei', sans-serif;
  letter-spacing: 1px;
  text-transform: uppercase; // 大写字母
  position: relative;
  padding-bottom: 4px;

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

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  // display: grid;
  // grid-template-columns: repeat(6, 1fr); // 一行显示6个
  gap: 10px;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out both;

  &:hover {
    background: rgba(255, 255, 255, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.skill-icon {
  font-size: 12px;
  flex-shrink: 0;
}

.skill-info {
  flex: 1;
  min-width: 0;
}

.skill-name {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  font-family:
    'Helvetica Neue', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft Yahei', sans-serif;
}

.skill-level {
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-bar {
  flex: 1;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.level-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease-out 0.3s;
  animation: fillBar 1s ease-out 0.3s both;
}

.level-text {
  font-size: 12px;
  color: #666;
  font-weight: 600;
  min-width: 35px;
  text-align: right;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fillBar {
  from {
    width: 0;
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .skills-grid {
    grid-template-columns: repeat(3, 1fr); // 中等屏幕显示3个
  }
}

@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: repeat(2, 1fr); // 小屏幕显示2个
    gap: 12px;
  }

  .skill-item {
    padding: 6px;
  }

  .skill-icon {
    font-size: 12px;
  }

  .skill-name {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .skills-grid {
    grid-template-columns: 1fr; // 超小屏幕显示1个
  }
}
</style>
