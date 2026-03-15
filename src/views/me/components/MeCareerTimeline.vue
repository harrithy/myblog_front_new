<script setup lang="ts">
import type { MeTimelineItem } from '../meContent'

interface Props {
  items: MeTimelineItem[]
}

defineProps<Props>()

defineOptions({
  name: 'MeCareerTimeline',
})
</script>

<template>
  <section class="career-timeline" data-reveal>
    <div class="career-timeline__intro">
      <p class="career-timeline__eyebrow">Career timeline</p>
      <h2 class="career-timeline__title">我的工作与成长时间线。</h2>
      <p class="career-timeline__description">
        这条时间线只讲经历本身：从学习、实习，到正式参与产品交付，逐步靠近我真正想做的方向。
      </p>
    </div>

    <ol class="career-timeline__list">
      <li v-for="item in items" :key="`${item.period}-${item.role}`" class="career-timeline__item">
        <span class="career-timeline__period">{{ item.period }}</span>
        <strong class="career-timeline__role">{{ item.role }}</strong>
        <span class="career-timeline__org">{{ item.organization }}</span>
      </li>
    </ol>
  </section>
</template>

<style scoped lang="scss">
.career-timeline {
  display: grid;
  gap: 1rem;
  padding: 1.25rem 1.35rem;
  border: 1px solid rgba(26, 36, 51, 0.1);
  border-radius: 1.8rem;
  background: rgba(255, 252, 247, 0.82);
  box-shadow: 0 16px 30px rgba(26, 36, 51, 0.05);
}

.career-timeline__intro {
  display: grid;
  gap: 0.45rem;
}

.career-timeline__eyebrow {
  width: fit-content;
  margin: 0;
  padding: 0.38rem 0.74rem;
  border-radius: 999px;
  background: rgba(40, 86, 216, 0.08);
  color: var(--me-accent-2);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.career-timeline__title {
  margin: 0;
  color: var(--me-ink);
  font-family: var(--me-display-font);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  line-height: 0.95;
}

.career-timeline__description {
  max-width: 48rem;
  margin: 0;
  color: var(--me-muted);
  line-height: 1.8;
}

.career-timeline__list {
  display: grid;
  gap: 0.8rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.career-timeline__item {
  display: grid;
  gap: 0.2rem;
  padding: 0.95rem 1rem;
  border: 1px solid rgba(26, 36, 51, 0.08);
  border-radius: 1.3rem;
  background: rgba(255, 255, 255, 0.62);
}

.career-timeline__period {
  color: var(--me-accent);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.career-timeline__role {
  color: var(--me-ink);
  font-size: 1rem;
}

.career-timeline__org {
  color: var(--me-muted);
  line-height: 1.7;
}

@media (min-width: 920px) {
  .career-timeline__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
