<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import avatarImg from '@/assets/source/avatar.jpg'
import MeEssentials from './components/MeEssentials.vue'
import MeHero from './components/MeHero.vue'
import MeProjects from './components/MeProjects.vue'
import { useMePageMotion } from './composables/useMePageMotion'
import {
  meAboutParagraphs,
  meHobbies,
  mePrinciples,
  meProfile,
  meProjects,
  meSignals,
  meSkillGroups,
  meSocialLinks,
  meTimeline,
} from './meContent'

const router = useRouter()
const { pageRef } = useMePageMotion()

defineOptions({
  name: 'MeView',
})

const quickFacts = computed(() => [
  {
    label: '常用技术',
    value: `${meSkillGroups.flatMap((group) => group.items).length}+`,
    description: '覆盖前端、后端和创作工作流的常用工具。',
  },
  {
    label: '代表项目',
    value: `${meProjects.length}`,
    description: '持续打磨中的产品和实验方向。',
  },
  {
    label: '经历阶段',
    value: `${meTimeline.length}`,
    description: '从学习、实习到正式交付的几个成长阶段。',
  },
])

const ribbonItems = computed(() =>
  Array.from({ length: 3 }, () =>
    meSignals.map((signal) => `${signal.label} · ${signal.value}`),
  ).flat(),
)

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push('/')
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div ref="page" class="me-page">
    <header class="me-page__masthead" data-reveal>
      <div class="me-page__masthead-top">
        <div class="me-page__title-group">
          <p class="me-page__eyebrow">About this page</p>
          <h1 class="me-page__title">一个在文档流里展开的个人页面。</h1>
        </div>

        <div class="me-page__actions">
          <button type="button" class="me-page__action" aria-label="返回上一页" @click="goBack">
            Back
          </button>
          <button
            type="button"
            class="me-page__action me-page__action--accent"
            aria-label="回到顶部"
            @click="scrollToTop"
          >
            Top
          </button>
        </div>
      </div>

      <div class="me-page__progress">
        <div class="me-page__progress-bar"></div>
      </div>
    </header>

    <section class="signal-ribbon" aria-label="Current signals">
      <div class="signal-ribbon__track">
        <span
          v-for="(item, index) in ribbonItems"
          :key="`${item}-${index}`"
          class="signal-ribbon__item"
        >
          {{ item }}
        </span>
      </div>
    </section>

    <main class="me-page__shell">
      <section class="layout-block layout-block--hero" data-reveal>
        <MeHero
          :avatar-src="avatarImg"
          :profile="meProfile"
          :quick-facts="quickFacts"
          :signals="meSignals"
          :social-links="meSocialLinks"
        />
      </section>

      <section class="layout-block layout-block--studio" data-reveal>
        <div class="layout-block__main">
          <MeEssentials
            :about-paragraphs="meAboutParagraphs"
            :principles="mePrinciples"
            :skill-groups="meSkillGroups"
            :hobbies="meHobbies"
          />
        </div>

        <aside class="layout-block__aside">
          <article class="note-card" data-motion-card>
            <span class="note-card__tag">Working mode</span>
            <h2 class="note-card__title">现在的工作重心</h2>
            <ul class="note-card__list">
              <li v-for="signal in meSignals" :key="signal.label" class="note-card__item">
                <span class="note-card__label">{{ signal.label }}</span>
                <strong class="note-card__value">{{ signal.value }}</strong>
              </li>
            </ul>
          </article>

          <article class="note-card note-card--muted" data-motion-card>
            <span class="note-card__tag">Availability</span>
            <h2 class="note-card__title">适合一起做什么</h2>
            <p class="note-card__text">
              品牌站、内容产品、个人作品集，以及那些既要有审美又要真正能落地的页面。
            </p>
            <p class="note-card__text">{{ meProfile.availability }}</p>
          </article>
        </aside>
      </section>

      <section class="layout-block" data-reveal>
        <MeProjects :projects="meProjects" />
      </section>

      <section class="layout-block" data-reveal>
        <section class="connect-panel" data-motion-card>
          <div class="connect-panel__tag">Open to connect</div>
          <div class="connect-panel__main">
            <div class="connect-panel__copy">
              <p class="connect-panel__eyebrow">Selected collaborations</p>
              <h2 class="connect-panel__title">
                如果你也在做有审美、有技术含量的产品，我们可以聊聊。
              </h2>
              <p class="connect-panel__description">
                我更喜欢长期主义的合作方式：一起把方向想清楚，把页面做漂亮，把系统搭稳，然后持续把作品推向更完整的状态。
              </p>
            </div>

            <div class="connect-panel__aside">
              <p class="connect-panel__note">
                如果你更在意“长期能不能持续变好”，而不是只想快速堆一个页面，我们大概率会聊得来。
              </p>
              <div class="connect-panel__actions">
                <a
                  class="connect-panel__button connect-panel__button--primary"
                  :href="`mailto:${meProfile.email}`"
                >
                  发起合作
                </a>
                <a
                  class="connect-panel__button"
                  href="https://github.com/harrithy"
                  target="_blank"
                  rel="noreferrer"
                >
                  看更多代码
                </a>
              </div>
            </div>
          </div>
        </section>
      </section>

      <footer class="me-footer" data-reveal>
        <div class="me-footer__line"></div>
        <div class="me-footer__content">
          <p class="me-footer__name">{{ meProfile.name }}</p>
          <p class="me-footer__copy">
            A personal page that reads section by section, without floating ornaments.
          </p>
        </div>
      </footer>
    </main>
  </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@500;600;700&display=swap');

.me-page {
  --me-bg: #efe6d7;
  --me-paper: rgba(255, 251, 245, 0.88);
  --me-paper-strong: rgba(255, 253, 249, 0.96);
  --me-ink: #1a2433;
  --me-muted: #5b6776;
  --me-muted-soft: #7b8392;
  --me-accent: #ee5c42;
  --me-accent-2: #2856d8;
  --me-accent-3: #859d6b;
  --me-progress-start: #586273;
  --me-progress-end: #8a9874;
  --me-line: rgba(26, 36, 51, 0.12);
  --me-display-font: 'Cormorant Garamond', 'Times New Roman', serif;
  --me-body-font: 'Manrope', 'Microsoft YaHei', sans-serif;
  --scroll-progress: 0;
  min-height: 100vh;
  padding: clamp(2rem, 4vw, 3rem) 1rem 4rem;
  background:
    radial-gradient(circle at top left, rgba(40, 86, 216, 0.08), transparent 24rem),
    linear-gradient(180deg, #f7f1e8 0%, #efe5d4 100%);
  color: var(--me-ink);
  font-family: var(--me-body-font);
}

.me-page__masthead {
  display: grid;
  gap: 1rem;
  width: min(1240px, 100%);
  margin: 0 auto 1.25rem;
}

.me-page__masthead-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  align-items: end;
}

.me-page__title-group {
  display: grid;
  gap: 0.35rem;
}

.me-page__eyebrow {
  margin: 0;
  color: var(--me-accent-2);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.me-page__title {
  margin: 0;
  font-family: var(--me-display-font);
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 0.95;
}

.me-page__actions {
  display: flex;
  gap: 0.75rem;
}

.me-page__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 5rem;
  min-height: 2.9rem;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(26, 36, 51, 0.12);
  border-radius: 999px;
  background: rgba(255, 251, 245, 0.82);
  color: var(--me-ink);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.me-page__action:hover {
  transform: translateY(-2px);
  border-color: rgba(40, 86, 216, 0.24);
  box-shadow: 0 10px 18px rgba(26, 36, 51, 0.08);
}

.me-page__action--accent {
  background: linear-gradient(135deg, rgba(238, 92, 66, 0.96), rgba(245, 138, 95, 0.92));
  color: #fffdf8;
}

.me-page__progress {
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: rgba(26, 36, 51, 0.08);
  overflow: hidden;
}

.me-page__progress-bar {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--me-progress-start), var(--me-progress-end));
  transform: scaleX(var(--scroll-progress));
  transform-origin: left center;
}

.signal-ribbon {
  width: min(1240px, 100%);
  margin: 0 auto 1.8rem;
  overflow: hidden;
  border: 1px solid rgba(26, 36, 51, 0.1);
  border-radius: 999px;
  background: rgba(255, 251, 245, 0.68);
  box-shadow: 0 10px 20px rgba(26, 36, 51, 0.04);
}

.signal-ribbon__track {
  display: flex;
  gap: 2rem;
  width: max-content;
  padding: 0.9rem 1.3rem;
  animation: marquee 24s linear infinite;
}

.signal-ribbon__item {
  color: rgba(26, 36, 51, 0.82);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  white-space: nowrap;
}

.me-page__shell {
  display: grid;
  gap: 2rem;
  width: min(1240px, 100%);
  margin: 0 auto;
}

.layout-block {
  display: grid;
  gap: 1.4rem;
}

.layout-block__aside {
  display: grid;
  gap: 1rem;
}

.note-card {
  display: grid;
  gap: 0.9rem;
  padding: 1.25rem;
  border: 1px solid rgba(26, 36, 51, 0.12);
  border-radius: 1.8rem;
  background: rgba(255, 251, 245, 0.76);
  box-shadow: 0 16px 30px rgba(26, 36, 51, 0.05);
}

.note-card--muted {
  background: rgba(248, 243, 235, 0.84);
}

.note-card__tag {
  width: fit-content;
  padding: 0.4rem 0.76rem;
  border-radius: 999px;
  background: rgba(40, 86, 216, 0.08);
  color: var(--me-accent-2);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.note-card__title {
  margin: 0;
  color: var(--me-ink);
  font-family: var(--me-display-font);
  font-size: clamp(1.5rem, 3vw, 2.4rem);
  line-height: 0.98;
}

.note-card__list {
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.note-card__item {
  display: grid;
  gap: 0.18rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(26, 36, 51, 0.08);
}

.note-card__item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.note-card__label {
  color: var(--me-muted-soft);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.note-card__value {
  color: var(--me-ink);
  font-size: 0.98rem;
  line-height: 1.7;
}

.note-card__text {
  margin: 0;
  color: var(--me-muted);
  line-height: 1.85;
}

.connect-panel {
  display: grid;
  gap: 1rem;
  padding: 1.4rem;
  border: 1px solid rgba(26, 36, 51, 0.12);
  border-radius: 2rem;
  background: linear-gradient(180deg, rgba(255, 253, 249, 0.94), rgba(251, 246, 238, 0.9));
  box-shadow: 0 20px 36px rgba(26, 36, 51, 0.08);
}

.connect-panel__tag {
  width: fit-content;
  padding: 0.42rem 0.8rem;
  border-radius: 999px;
  background: rgba(40, 86, 216, 0.08);
  color: var(--me-accent-2);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.connect-panel__main {
  display: grid;
  gap: 1.2rem;
}

.connect-panel__copy {
  display: grid;
  gap: 0.8rem;
}

.connect-panel__eyebrow {
  margin: 0;
  color: var(--me-accent);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.connect-panel__title {
  max-width: 11ch;
  margin: 0;
  color: var(--me-ink);
  font-family: var(--me-display-font);
  font-size: clamp(2.2rem, 6vw, 4.6rem);
  line-height: 0.94;
}

.connect-panel__description,
.connect-panel__note {
  margin: 0;
  color: var(--me-muted);
  line-height: 1.85;
}

.connect-panel__aside {
  display: grid;
  gap: 1rem;
  padding: 1.1rem;
  border-radius: 1.5rem;
  background: rgba(26, 36, 51, 0.04);
}

.connect-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.connect-panel__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  padding: 0.82rem 1.2rem;
  border: 1px solid rgba(26, 36, 51, 0.12);
  border-radius: 999px;
  background: rgba(255, 251, 245, 0.9);
  color: var(--me-ink);
  text-decoration: none;
  font-weight: 700;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.connect-panel__button:hover {
  transform: translateY(-2px);
  border-color: rgba(238, 92, 66, 0.3);
  box-shadow: 0 10px 20px rgba(26, 36, 51, 0.08);
}

.connect-panel__button--primary {
  background: linear-gradient(135deg, rgba(238, 92, 66, 0.96), rgba(245, 138, 95, 0.92));
  border-color: transparent;
  color: #fffdf8;
}

.me-footer {
  display: grid;
  gap: 1rem;
  padding: 0.25rem 0 0.8rem;
}

.me-footer__line {
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(26, 36, 51, 0),
    rgba(26, 36, 51, 0.18),
    rgba(26, 36, 51, 0)
  );
}

.me-footer__content {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: space-between;
  align-items: center;
}

.me-footer__name,
.me-footer__copy {
  margin: 0;
}

.me-footer__name {
  color: var(--me-ink);
  font-family: var(--me-display-font);
  font-size: 1.8rem;
}

.me-footer__copy {
  max-width: 36rem;
  color: var(--me-muted);
}

:deep([data-reveal]) {
  opacity: 0;
  transform: translate3d(0, 1.6rem, 0);
  filter: blur(6px);
  transition:
    opacity 620ms cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0ms),
    transform 760ms cubic-bezier(0.16, 1, 0.3, 1) var(--reveal-delay, 0ms),
    filter 760ms cubic-bezier(0.16, 1, 0.3, 1) var(--reveal-delay, 0ms);
}

:deep([data-reveal].is-visible) {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  filter: blur(0);
}

:deep([data-motion-card]) {
  --motion-rotate-x: 0deg;
  --motion-rotate-y: 0deg;
  transform: perspective(1200px) rotateX(var(--motion-rotate-x)) rotateY(var(--motion-rotate-y))
    translate3d(0, 0, 0);
  transition:
    transform 200ms ease,
    border-color 200ms ease,
    box-shadow 200ms ease;
}

:deep([data-motion-card].is-tilting) {
  border-color: rgba(40, 86, 216, 0.22);
  box-shadow: 0 22px 34px rgba(26, 36, 51, 0.08);
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-33.333%);
  }
}

@media (min-width: 980px) {
  .layout-block--studio {
    grid-template-columns: minmax(0, 1.3fr) minmax(18rem, 0.7fr);
    gap: 1.6rem;
    align-items: start;
  }

  .connect-panel__main {
    grid-template-columns: minmax(0, 1.2fr) minmax(16rem, 0.8fr);
    align-items: start;
  }
}

@media (max-width: 720px) {
  .me-page {
    padding: 1.4rem 0.85rem 3rem;
  }

  .me-page__masthead-top {
    align-items: start;
  }

  .me-page__actions {
    width: 100%;
  }

  .me-page__action {
    flex: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .signal-ribbon__track {
    animation: none;
  }

  :deep([data-reveal]),
  :deep([data-motion-card]) {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }
}
</style>
