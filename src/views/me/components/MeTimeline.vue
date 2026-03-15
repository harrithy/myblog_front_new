<script setup lang="ts">
import MeSectionHeader from './MeSectionHeader.vue'
import type { MeTimelineItem } from '../meContent'

interface Props {
  timeline: MeTimelineItem[]
}

defineProps<Props>()

defineOptions({
  name: 'MeTimeline',
})
</script>

<template>
  <section class="timeline" data-reveal>
    <MeSectionHeader
      eyebrow="Timeline"
      title="从学习到交付的几个关键节点"
      description="这不是一条只写标题的时间线，而是一组逐步靠近“做出完整产品”这件事的过程记录。"
    />

    <ol class="timeline__list">
      <li
        v-for="(item, index) in timeline"
        :key="`${item.period}-${item.role}`"
        class="timeline__item"
        :style="{ '--timeline-order': index }"
      >
        <article class="timeline__card" data-motion-card>
          <span class="timeline__period">{{ item.period }}</span>
          <span class="timeline__index">0{{ index + 1 }}</span>
          <h3 class="timeline__role">{{ item.role }}</h3>
          <p class="timeline__organization">{{ item.organization }}</p>
          <p class="timeline__summary">{{ item.summary }}</p>
          <div class="timeline__highlights">
            <span v-for="highlight in item.highlights" :key="highlight" class="timeline__highlight">
              {{ highlight }}
            </span>
          </div>
        </article>
      </li>
    </ol>
  </section>
</template>

<style scoped lang="scss">
.timeline {
  display: grid;
  gap: 1.8rem;
  container-type: inline-size;
}

.timeline__list {
  display: grid;
  gap: 1rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.timeline__item {
  display: grid;
}

.timeline__card {
  display: grid;
  gap: 0.7rem;
  padding: 1.35rem;
  border: 1px solid rgba(26, 36, 51, 0.12);
  border-radius: 1.75rem;
  background:
    linear-gradient(135deg, rgba(40, 86, 216, 0.08), transparent 44%),
    linear-gradient(180deg, rgba(255, 253, 249, 0.96), rgba(247, 240, 229, 0.9));
  box-shadow: 0 18px 36px rgba(26, 36, 51, 0.08);
}

.timeline__period,
.timeline__index,
.timeline__role,
.timeline__organization,
.timeline__summary,
.timeline__highlights {
  position: static;
}

.timeline__period {
  width: fit-content;
  padding: 0.4rem 0.76rem;
  border-radius: 999px;
  background: rgba(238, 92, 66, 0.1);
  color: var(--me-accent);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.timeline__index {
  color: rgba(26, 36, 51, 0.12);
  font-family: var(--me-display-font);
  font-size: 4rem;
  line-height: 0.78;
}

.timeline__role {
  margin: 0;
  color: var(--me-ink);
  font-size: 1.3rem;
}

.timeline__organization {
  margin: 0;
  color: var(--me-muted-soft);
}

.timeline__summary {
  margin: 0;
  color: var(--me-muted);
  line-height: 1.82;
}

.timeline__highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.timeline__highlight {
  display: inline-flex;
  align-items: center;
  min-height: 2.1rem;
  padding: 0.4rem 0.76rem;
  border-radius: 999px;
  background: rgba(40, 86, 216, 0.08);
  color: var(--me-ink);
  font-size: 0.83rem;
}

.timeline.is-visible .timeline__item {
  animation: timeline-slide 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--timeline-order) * 100ms + 120ms);
}

@keyframes timeline-slide {
  0% {
    opacity: 0;
    transform: translate3d(0, 1.8rem, 0) rotate(-1deg);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
}

@container (min-width: 920px) {
  .timeline__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .timeline__item:nth-child(odd) {
    margin-top: 3.2rem;
  }

  .timeline__item:nth-child(2) .timeline__card {
    transform: rotate(-1.2deg);
  }

  .timeline__item:nth-child(3) .timeline__card {
    transform: rotate(1deg);
  }
}
</style>
