<script setup lang="ts">
import MeSectionHeader from './MeSectionHeader.vue'
import type { MeHobby, MePrinciple, MeSkillGroup } from '../meContent'

interface Props {
  aboutParagraphs: string[]
  principles: MePrinciple[]
  skillGroups: MeSkillGroup[]
  hobbies: MeHobby[]
}

defineProps<Props>()

defineOptions({
  name: 'MeEssentials',
})
</script>

<template>
  <section class="essentials" data-reveal>
    <MeSectionHeader
      eyebrow="Perspective"
      title="我如何理解产品、代码和个人表达"
      description="这个页面不只是简历式介绍，更像一份正在更新的工作样本。内容、视觉和工程结构，都会一起被打磨。"
    />

    <div class="essentials__grid">
      <article class="story-card" data-motion-card>
        <span class="story-card__tag">Narrative core</span>
        <p v-for="paragraph in aboutParagraphs" :key="paragraph" class="story-card__paragraph">
          {{ paragraph }}
        </p>
      </article>

      <article class="principles-card" data-motion-card>
        <span class="principles-card__tag">Principles</span>
        <div class="principles-card__list">
          <article v-for="principle in principles" :key="principle.title" class="principle-item">
            <h3 class="principle-item__title">{{ principle.title }}</h3>
            <p class="principle-item__description">{{ principle.description }}</p>
          </article>
        </div>
      </article>

      <article class="toolbox-card" data-motion-card>
        <span class="toolbox-card__tag">Toolbox</span>
        <div class="toolbox-card__groups">
          <section v-for="group in skillGroups" :key="group.title" class="skill-group">
            <div class="skill-group__header">
              <h3 class="skill-group__title">{{ group.title }}</h3>
              <p class="skill-group__description">{{ group.description }}</p>
            </div>
            <div class="skill-group__chips">
              <span v-for="item in group.items" :key="item" class="skill-group__chip">{{
                item
              }}</span>
            </div>
          </section>
        </div>
      </article>

      <article class="offstage-card" data-motion-card>
        <span class="offstage-card__tag">Outside work</span>
        <div class="offstage-card__list">
          <article v-for="hobby in hobbies" :key="hobby.title" class="hobby-item">
            <h3 class="hobby-item__title">{{ hobby.title }}</h3>
            <p class="hobby-item__caption">{{ hobby.caption }}</p>
          </article>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.essentials {
  display: grid;
  gap: 1.8rem;
  container-type: inline-size;
}

.essentials__grid {
  display: grid;
  gap: 1rem;
}

.story-card,
.principles-card,
.toolbox-card,
.offstage-card {
  display: grid;
  gap: 1.15rem;
  padding: 1.35rem;
  border: 1px solid rgba(26, 36, 51, 0.12);
  border-radius: 1.75rem;
  background: linear-gradient(180deg, rgba(255, 253, 249, 0.96), rgba(247, 240, 229, 0.88));
  box-shadow: 0 18px 36px rgba(26, 36, 51, 0.08);
}

.story-card {
  background:
    linear-gradient(135deg, rgba(238, 92, 66, 0.1), transparent 48%),
    linear-gradient(180deg, rgba(255, 253, 249, 0.98), rgba(247, 240, 229, 0.92));
}

.principles-card {
  transform: rotate(-1deg);
}

.toolbox-card {
  background:
    linear-gradient(135deg, rgba(133, 157, 107, 0.11), transparent 46%),
    linear-gradient(180deg, rgba(255, 253, 249, 0.96), rgba(247, 240, 229, 0.9));
}

.offstage-card {
  transform: rotate(1deg);
}

.story-card__tag,
.principles-card__tag,
.toolbox-card__tag,
.offstage-card__tag {
  width: fit-content;
  padding: 0.42rem 0.8rem;
  border-radius: 999px;
  background: rgba(40, 86, 216, 0.08);
  color: var(--me-accent-2);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.story-card__paragraph {
  margin: 0;
  color: var(--me-muted);
  line-height: 1.92;
}

.principles-card__list,
.toolbox-card__groups,
.offstage-card__list {
  display: grid;
  gap: 0.85rem;
}

.principle-item,
.skill-group,
.hobby-item {
  display: grid;
  gap: 0.45rem;
  padding: 0.95rem 1rem;
  border: 1px solid rgba(26, 36, 51, 0.08);
  border-radius: 1.2rem;
  background: rgba(255, 251, 245, 0.78);
}

.principle-item__title,
.skill-group__title,
.hobby-item__title {
  margin: 0;
  color: var(--me-ink);
  font-size: 1.04rem;
}

.principle-item__description,
.skill-group__description,
.hobby-item__caption {
  margin: 0;
  color: var(--me-muted);
  line-height: 1.8;
}

.skill-group__header {
  display: grid;
  gap: 0.35rem;
}

.skill-group__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.skill-group__chip {
  display: inline-flex;
  align-items: center;
  min-height: 2.1rem;
  padding: 0.42rem 0.78rem;
  border-radius: 999px;
  background: rgba(238, 92, 66, 0.1);
  color: var(--me-ink);
  font-size: 0.84rem;
}

@container (min-width: 760px) {
  .essentials__grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    align-items: start;
  }

  .story-card {
    grid-column: span 7;
  }

  .principles-card {
    grid-column: span 5;
    margin-top: 2.2rem;
  }

  .toolbox-card {
    grid-column: span 5;
    margin-top: -1rem;
  }

  .offstage-card {
    grid-column: span 7;
  }
}
</style>
