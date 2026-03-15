<script setup lang="ts">
interface Props {
  eyebrow: string
  title: string
  description: string
}

defineProps<Props>()

defineOptions({
  name: 'MeSectionHeader',
})
</script>

<template>
  <header class="section-header">
    <p class="section-header__eyebrow">{{ eyebrow }}</p>
    <div class="section-header__content">
      <h2 class="section-header__title">{{ title }}</h2>
      <p class="section-header__description">{{ description }}</p>
    </div>
  </header>
</template>

<style scoped lang="scss">
.section-header {
  display: grid;
  gap: 0.95rem;
  container-type: inline-size;
}

.section-header__eyebrow {
  width: fit-content;
  margin: 0;
  padding: 0.42rem 0.8rem;
  border: 1px solid rgba(26, 36, 51, 0.1);
  border-radius: 999px;
  background: rgba(40, 86, 216, 0.06);
  color: var(--me-accent-2);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.section-header__content {
  display: grid;
  gap: 0.85rem;
}

.section-header__title {
  max-width: 10ch;
  margin: 0;
  color: var(--me-ink);
  font-family: var(--me-display-font);
  font-size: clamp(2.4rem, 5vw, 4.6rem);
  font-weight: 600;
  line-height: 0.92;
  letter-spacing: -0.05em;
}

.section-header__description {
  max-width: 40rem;
  margin: 0;
  color: var(--me-muted);
  line-height: 1.82;
}

@container (min-width: 900px) {
  .section-header__content {
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 28rem);
    gap: 1.2rem;
    align-items: end;
  }
}
</style>
