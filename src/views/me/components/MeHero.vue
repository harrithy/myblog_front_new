<script setup lang="ts">
import type { MeProfile, MeQuickFact, MeSignal, MeSocialLink } from '../meContent'

interface Props {
  avatarSrc: string
  profile: MeProfile
  quickFacts: MeQuickFact[]
  signals: MeSignal[]
  socialLinks: MeSocialLink[]
}

defineProps<Props>()

defineOptions({
  name: 'MeHero',
})
</script>

<template>
  <section class="hero-collage" data-reveal>
    <article class="hero-collage__intro" data-motion-card>
      <div class="hero-collage__lead">
        <p class="hero-collage__eyebrow">Personal dossier / 个人档案</p>
        <span class="hero-collage__status">Open for thoughtful work</span>
      </div>

      <p class="hero-collage__role">{{ profile.role }}</p>
      <h1 class="hero-collage__title">
        <span class="hero-collage__title-name">{{ profile.name }}</span>
        <span class="hero-collage__title-copy">{{ profile.headline }}</span>
      </h1>
      <p class="hero-collage__intro-text">{{ profile.intro }}</p>

      <div class="hero-collage__actions">
        <a
          class="hero-collage__button hero-collage__button--primary"
          :href="`mailto:${profile.email}`"
        >
          发邮件联系
        </a>
        <a
          class="hero-collage__button"
          href="https://github.com/harrithy"
          target="_blank"
          rel="noreferrer"
        >
          查看 GitHub
        </a>
      </div>
    </article>

    <article class="hero-collage__portrait-card" data-motion-card>
      <div class="hero-collage__portrait-head">
        <span class="hero-collage__portrait-label">Studio note</span>
        <span class="hero-collage__portrait-place">{{ profile.location }}</span>
      </div>
      <div class="hero-collage__portrait-wrap">
        <img :src="avatarSrc" :alt="`${profile.name} avatar`" class="hero-collage__portrait" />
      </div>
      <div class="hero-collage__portrait-body">
        <p class="hero-collage__portrait-name">{{ profile.name }}</p>
        <p class="hero-collage__portrait-note">{{ profile.availability }}</p>
        <p class="hero-collage__portrait-note hero-collage__portrait-note--muted">
          {{ profile.status }}
        </p>
      </div>
    </article>

    <article class="hero-collage__status-card" data-motion-card>
      <span class="hero-collage__mini-tag">Current focus</span>
      <ul class="hero-collage__signal-list">
        <li
          v-for="(signal, index) in signals"
          :key="signal.label"
          class="hero-collage__signal"
          :style="{ '--signal-order': index }"
        >
          <span class="hero-collage__signal-label">{{ signal.label }}</span>
          <strong class="hero-collage__signal-value">{{ signal.value }}</strong>
        </li>
      </ul>
    </article>

    <div class="hero-collage__fact-strip">
      <article
        v-for="(fact, index) in quickFacts"
        :key="fact.label"
        class="hero-collage__fact"
        data-motion-card
        :style="{ '--fact-order': index }"
      >
        <span class="hero-collage__fact-label">{{ fact.label }}</span>
        <strong class="hero-collage__fact-value">{{ fact.value }}</strong>
        <p class="hero-collage__fact-description">{{ fact.description }}</p>
      </article>
    </div>

    <div class="hero-collage__socials">
      <a
        v-for="(link, index) in socialLinks"
        :key="link.label"
        class="hero-collage__social"
        :href="link.href"
        target="_blank"
        rel="noreferrer"
        data-motion-card
        :style="{ '--social-order': index }"
      >
        <span class="hero-collage__social-title">{{ link.label }}</span>
        <span class="hero-collage__social-caption">{{ link.caption }}</span>
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero-collage {
  display: grid;
  gap: 1rem;
  container-type: inline-size;
}

.hero-collage__intro,
.hero-collage__portrait-card,
.hero-collage__status-card,
.hero-collage__fact,
.hero-collage__social {
  border: 1px solid rgba(26, 36, 51, 0.12);
  border-radius: 1.8rem;
  background: linear-gradient(180deg, rgba(255, 253, 249, 0.96), rgba(249, 242, 232, 0.86));
  box-shadow: 0 20px 40px rgba(26, 36, 51, 0.08);
}

.hero-collage__intro {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
}

.hero-collage__lead {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  align-items: center;
  justify-content: space-between;
}

.hero-collage__eyebrow,
.hero-collage__status,
.hero-collage__mini-tag,
.hero-collage__portrait-label {
  width: fit-content;
  padding: 0.42rem 0.8rem;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero-collage__eyebrow,
.hero-collage__portrait-label {
  background: rgba(40, 86, 216, 0.08);
  color: var(--me-accent-2);
}

.hero-collage__status,
.hero-collage__mini-tag {
  background: rgba(238, 92, 66, 0.1);
  color: var(--me-accent);
}

.hero-collage__role {
  margin: 0;
  color: var(--me-muted);
  font-size: 0.92rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero-collage__title {
  display: grid;
  gap: 0.25rem;
  margin: 0;
}

.hero-collage__title-name,
.hero-collage__title-copy {
  display: block;
}

.hero-collage__title-name {
  color: var(--me-ink);
  font-family: var(--me-display-font);
  font-size: clamp(4rem, 11vw, 7.6rem);
  line-height: 0.82;
  letter-spacing: -0.06em;
}

.hero-collage__title-copy {
  max-width: 11ch;
  color: var(--me-ink);
  font-family: var(--me-display-font);
  font-size: clamp(2.25rem, 5.5vw, 4.3rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
}

.hero-collage__intro-text,
.hero-collage__portrait-note,
.hero-collage__fact-description,
.hero-collage__social-caption {
  margin: 0;
  color: var(--me-muted);
  line-height: 1.85;
}

.hero-collage__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.hero-collage__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  padding: 0.82rem 1.22rem;
  border: 1px solid rgba(26, 36, 51, 0.12);
  border-radius: 999px;
  background: rgba(255, 251, 245, 0.86);
  color: var(--me-ink);
  text-decoration: none;
  font-weight: 700;
  transition:
    transform 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease;
}

.hero-collage__button:hover {
  transform: translateY(-2px);
  border-color: rgba(238, 92, 66, 0.28);
  box-shadow: 0 12px 28px rgba(26, 36, 51, 0.08);
}

.hero-collage__button--primary {
  background: linear-gradient(135deg, rgba(238, 92, 66, 0.96), rgba(245, 138, 95, 0.92));
  border-color: transparent;
  color: #fffdf8;
}

.hero-collage__portrait-card {
  display: grid;
  gap: 1rem;
  padding: 1.2rem;
  transform: rotate(-2deg);
}

.hero-collage__portrait-head {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  align-items: center;
}

.hero-collage__portrait-place {
  color: var(--me-muted-soft);
  font-size: 0.82rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero-collage__portrait-wrap {
  display: grid;
  place-items: center;
  min-height: 15rem;
  padding: 1rem;
  border-radius: 1.4rem;
  background: rgba(26, 36, 51, 0.05);
}

.hero-collage__portrait {
  width: min(12rem, 70vw);
  aspect-ratio: 1;
  border-radius: 42% 58% 51% 49% / 47% 42% 58% 53%;
  object-fit: cover;
  box-shadow: 0 18px 30px rgba(26, 36, 51, 0.16);
}

.hero-collage__portrait-body {
  display: grid;
  gap: 0.45rem;
}

.hero-collage__portrait-name {
  margin: 0;
  color: var(--me-ink);
  font-family: var(--me-display-font);
  font-size: 2rem;
}

.hero-collage__portrait-note--muted {
  color: var(--me-muted-soft);
}

.hero-collage__status-card {
  display: grid;
  gap: 1rem;
  padding: 1.15rem;
  background:
    linear-gradient(180deg, rgba(255, 253, 249, 0.98), rgba(245, 238, 226, 0.88)),
    linear-gradient(135deg, rgba(133, 157, 107, 0.08), transparent);
  transform: rotate(1.5deg);
}

.hero-collage__signal-list {
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.hero-collage__signal {
  display: grid;
  gap: 0.25rem;
  padding: 0.9rem 1rem;
  border-radius: 1.15rem;
  background: rgba(255, 251, 245, 0.72);
  border: 1px solid rgba(26, 36, 51, 0.08);
}

.hero-collage__signal-label,
.hero-collage__fact-label {
  color: var(--me-muted-soft);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-collage__signal-value,
.hero-collage__fact-value {
  color: var(--me-ink);
  font-size: 1rem;
}

.hero-collage__fact-strip,
.hero-collage__socials {
  display: grid;
  gap: 1rem;
}

.hero-collage__fact {
  display: grid;
  gap: 0.35rem;
  padding: 1rem 1.05rem;
}

.hero-collage__fact-value {
  font-size: clamp(1.5rem, 4vw, 2rem);
  line-height: 1;
}

.hero-collage__social {
  display: grid;
  gap: 0.3rem;
  padding: 1rem 1.1rem;
  color: inherit;
  text-decoration: none;
}

.hero-collage__social-title {
  color: var(--me-ink);
  font-weight: 700;
}

.hero-collage.is-visible .hero-collage__intro,
.hero-collage.is-visible .hero-collage__portrait-card,
.hero-collage.is-visible .hero-collage__status-card,
.hero-collage.is-visible .hero-collage__fact,
.hero-collage.is-visible .hero-collage__social {
  animation: collage-rise 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-collage.is-visible .hero-collage__portrait-card {
  animation-delay: 120ms;
}

.hero-collage.is-visible .hero-collage__status-card {
  animation-delay: 220ms;
}

.hero-collage.is-visible .hero-collage__fact {
  animation-delay: calc(var(--fact-order) * 90ms + 240ms);
}

.hero-collage.is-visible .hero-collage__social {
  animation-delay: calc(var(--social-order) * 90ms + 340ms);
}

@keyframes collage-rise {
  0% {
    opacity: 0;
    transform: translate3d(0, 1.8rem, 0) rotate(1.2deg);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
}

@container (min-width: 980px) {
  .hero-collage {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    align-items: start;
  }

  .hero-collage__intro {
    grid-column: span 7;
    min-height: 100%;
  }

  .hero-collage__portrait-card {
    grid-column: span 5;
  }

  .hero-collage__status-card {
    grid-column: span 4;
    margin-top: -2rem;
  }

  .hero-collage__fact-strip {
    grid-column: span 5;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-self: start;
  }

  .hero-collage__socials {
    grid-column: 8 / span 5;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: -1rem;
  }
}
</style>
