<script setup lang="ts">
import MeSectionHeader from './MeSectionHeader.vue'
import type { MeProjectItem } from '../meContent'

interface Props {
  projects: MeProjectItem[]
}

defineProps<Props>()

defineOptions({
  name: 'MeProjects',
})
</script>

<template>
  <section class="projects" data-reveal>
    <MeSectionHeader
      eyebrow="Selected work"
      title="几个我正在认真打磨的方向"
      description="项目不一定都已经完美上线，但每一个都对应着我在产品思考、交互体验或工程结构上的一次真实尝试。"
    />

    <div class="projects__grid">
      <article
        v-for="(project, index) in projects"
        :key="project.name"
        class="project-card"
        data-motion-card
        :style="{ '--project-order': index }"
      >
        <div class="project-card__head">
          <div class="project-card__meta">
            <span class="project-card__category">{{ project.category }}</span>
            <span class="project-card__year">{{ project.year }}</span>
          </div>
          <span class="project-card__serial">0{{ index + 1 }}</span>
          <h3 class="project-card__name">{{ project.name }}</h3>
        </div>

        <p class="project-card__summary">{{ project.summary }}</p>
        <p class="project-card__outcome">{{ project.outcome }}</p>

        <div class="project-card__stack">
          <span v-for="item in project.stack" :key="item" class="project-card__chip">{{
            item
          }}</span>
        </div>

        <a
          v-if="project.link"
          class="project-card__link"
          :href="project.link"
          target="_blank"
          rel="noreferrer"
        >
          查看项目
        </a>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.projects {
  display: grid;
  gap: 1.8rem;
  container-type: inline-size;
}

.projects__grid {
  display: grid;
  gap: 1rem;
}

.project-card {
  display: grid;
  gap: 0.95rem;
  padding: 1.35rem;
  border: 1px solid rgba(26, 36, 51, 0.12);
  border-radius: 1.75rem;
  background:
    linear-gradient(135deg, rgba(238, 92, 66, 0.08), transparent 40%),
    linear-gradient(180deg, rgba(255, 253, 249, 0.96), rgba(247, 240, 229, 0.9));
  box-shadow: 0 18px 36px rgba(26, 36, 51, 0.08);
}

.project-card__head,
.project-card__summary,
.project-card__outcome,
.project-card__stack,
.project-card__link {
  position: static;
}

.project-card__head {
  display: grid;
  gap: 0.7rem;
}

.project-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.project-card__category,
.project-card__year {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.project-card__category {
  background: rgba(40, 86, 216, 0.08);
  color: var(--me-accent-2);
}

.project-card__year {
  background: rgba(238, 92, 66, 0.1);
  color: var(--me-accent);
}

.project-card__serial {
  color: rgba(26, 36, 51, 0.1);
  font-family: var(--me-display-font);
  font-size: 4rem;
  line-height: 0.78;
}

.project-card__name {
  max-width: 10ch;
  margin: 0;
  color: var(--me-ink);
  font-size: 1.38rem;
  line-height: 1.18;
}

.project-card__summary,
.project-card__outcome {
  margin: 0;
  color: var(--me-muted);
  line-height: 1.82;
}

.project-card__outcome {
  color: var(--me-ink);
}

.project-card__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.project-card__chip {
  display: inline-flex;
  align-items: center;
  min-height: 2.1rem;
  padding: 0.42rem 0.78rem;
  border-radius: 999px;
  background: rgba(26, 36, 51, 0.06);
  color: var(--me-ink);
  font-size: 0.82rem;
}

.project-card__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 2.9rem;
  padding: 0.76rem 1.14rem;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(238, 92, 66, 0.96), rgba(245, 138, 95, 0.92));
  color: #fffdf8;
  text-decoration: none;
  font-weight: 700;
  transition:
    transform 220ms ease,
    box-shadow 220ms ease;
}

.project-card__link:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(26, 36, 51, 0.08);
}

.projects.is-visible .project-card {
  animation: project-rise 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--project-order) * 110ms + 120ms);
}

@keyframes project-rise {
  0% {
    opacity: 0;
    transform: translate3d(0, 1.7rem, 0) rotate(1deg);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
}

@container (min-width: 900px) {
  .projects__grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    align-items: start;
  }

  .project-card:nth-child(1) {
    grid-column: span 5;
    margin-top: 2rem;
  }

  .project-card:nth-child(2) {
    grid-column: span 3;
    transform: rotate(-1.2deg);
  }

  .project-card:nth-child(3) {
    grid-column: span 4;
    margin-top: 1rem;
  }
}
</style>
