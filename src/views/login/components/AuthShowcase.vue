<script setup lang="ts">
defineOptions({
  name: 'AuthShowcase',
})

import { computed, onBeforeUnmount, onMounted, shallowRef, watch, type CSSProperties } from 'vue'
import type { AuthShowcaseBand, AuthShowcaseBandId, AuthShowcaseCharacter } from '../types'
import type { AuthShowcaseCopy } from '../loginCopy'

interface LaidOutCard {
  card: AuthShowcaseCharacter
  slot: number
  distance: number
  direction: -1 | 0 | 1
  highlighted: boolean
  selected: boolean
  revealed: boolean
  order: number
}

const props = defineProps<{
  bands: AuthShowcaseBand[]
  copy: AuthShowcaseCopy
}>()

const emit = defineEmits<{
  expandedChange: [expanded: boolean]
  showcaseInteract: [bandId: AuthShowcaseBandId]
}>()

const petals = [
  { left: '8%', size: 14, duration: '12s', delay: '0s' },
  { left: '22%', size: 10, duration: '10s', delay: '1.2s' },
  { left: '64%', size: 16, duration: '13s', delay: '2.6s' },
  { left: '84%', size: 12, duration: '11s', delay: '3.4s' },
]

const hoverMediaQuery = '(hover: hover) and (pointer: fine)'

const initialBand = props.bands[0]
const activeBandId = shallowRef(initialBand?.id ?? '')
const selectedCharacterId = shallowRef(initialBand?.featuredId ?? '')
const previewedCharacterId = shallowRef('')
const isFanHovered = shallowRef(false)
const isFanFocused = shallowRef(false)
const supportsHoverInteraction = shallowRef(true)

let stopHoverMediaSync: (() => void) | undefined

onMounted(() => {
  if (typeof window === 'undefined') {
    return
  }

  const hoverMedia = window.matchMedia(hoverMediaQuery)

  const syncHoverSupport = (matches: boolean) => {
    supportsHoverInteraction.value = matches

    if (!matches) {
      isFanHovered.value = true
      previewedCharacterId.value = ''
      return
    }

    isFanHovered.value = false
    previewedCharacterId.value = ''
  }

  syncHoverSupport(hoverMedia.matches)

  const handleMediaChange = (event: MediaQueryListEvent) => {
    syncHoverSupport(event.matches)
  }

  if (typeof hoverMedia.addEventListener === 'function') {
    hoverMedia.addEventListener('change', handleMediaChange)
    stopHoverMediaSync = () => hoverMedia.removeEventListener('change', handleMediaChange)
    return
  }

  hoverMedia.addListener(handleMediaChange)
  stopHoverMediaSync = () => hoverMedia.removeListener(handleMediaChange)
})

onBeforeUnmount(() => {
  stopHoverMediaSync?.()
})

const activeBand = computed(
  () => props.bands.find((band) => band.id === activeBandId.value) ?? props.bands[0],
)

const activeCharacterId = computed(
  () =>
    previewedCharacterId.value || selectedCharacterId.value || (activeBand.value?.featuredId ?? ''),
)

const isFanExpanded = computed(
  () =>
    !supportsHoverInteraction.value ||
    isFanHovered.value ||
    isFanFocused.value ||
    previewedCharacterId.value !== '',
)

watch(
  isFanExpanded,
  (expanded) => {
    emit('expandedChange', expanded)
  },
  { immediate: true },
)

const laidOutCards = computed<LaidOutCard[]>(() => {
  const band = activeBand.value

  if (!band) {
    return []
  }

  const midpoint = (band.characters.length - 1) / 2

  return band.characters.map((card, index) => {
    const slot = Number((index - midpoint).toFixed(2))
    const direction = slot === 0 ? 0 : slot > 0 ? 1 : -1

    return {
      card,
      slot,
      distance: Math.abs(slot),
      direction,
      highlighted: card.id === activeCharacterId.value,
      selected: card.id === selectedCharacterId.value,
      revealed: card.id === previewedCharacterId.value,
      order: index,
    }
  })
})

const showcaseStyle = computed<CSSProperties>(
  () =>
    ({
      '--showcase-accent': activeBand.value?.accent ?? '#ea4aa6',
    }) as CSSProperties,
)

const cardStyle = (item: LaidOutCard): CSSProperties =>
  ({
    '--card-accent': item.card.accent,
    '--slot': item.slot.toString(),
    '--slot-distance': item.distance.toString(),
    '--card-direction': item.direction.toString(),
    animationDelay: `${item.order * 70}ms`,
    zIndex: item.revealed ? 48 : item.highlighted ? 38 : 28 - Math.round(item.distance * 4),
  }) as CSSProperties

const petalStyle = (petal: (typeof petals)[number]): CSSProperties => ({
  left: petal.left,
  width: `${petal.size}px`,
  height: `${petal.size}px`,
  animationDuration: petal.duration,
  animationDelay: petal.delay,
})

const selectBand = (bandId: AuthShowcaseBandId) => {
  const band = props.bands.find((item) => item.id === bandId)

  if (!band) {
    return
  }

  activeBandId.value = band.id
  selectedCharacterId.value = band.featuredId
  previewedCharacterId.value = ''

  if (supportsHoverInteraction.value) {
    isFanHovered.value = false
    isFanFocused.value = false
  }

  emit('showcaseInteract', band.id)
}

const selectCharacter = (characterId: string) => {
  selectedCharacterId.value = characterId

  if (!supportsHoverInteraction.value) {
    previewedCharacterId.value = characterId
  }

  if (activeBand.value) {
    emit('showcaseInteract', activeBand.value.id)
  }
}

const previewCharacter = (characterId: string) => {
  previewedCharacterId.value = characterId
  isFanHovered.value = true
}

const clearPreview = (characterId: string) => {
  if (previewedCharacterId.value === characterId) {
    previewedCharacterId.value = ''
  }
}

const handleFanPointerEnter = () => {
  if (!supportsHoverInteraction.value) {
    return
  }

  isFanHovered.value = true
}

const handleFanPointerLeave = () => {
  if (!supportsHoverInteraction.value) {
    return
  }

  isFanHovered.value = false
  previewedCharacterId.value = ''
}

const handleFanFocusIn = () => {
  isFanFocused.value = true
}

const handleFanFocusOut = (event: FocusEvent) => {
  const currentTarget = event.currentTarget
  const relatedTarget = event.relatedTarget

  if (
    currentTarget instanceof HTMLElement &&
    relatedTarget instanceof Node &&
    currentTarget.contains(relatedTarget)
  ) {
    return
  }

  isFanFocused.value = false

  if (supportsHoverInteraction.value) {
    previewedCharacterId.value = ''
  }
}
</script>

<template>
  <aside class="showcase" :style="showcaseStyle">
    <div class="showcase__petals">
      <span
        v-for="petal in petals"
        :key="petal.left"
        class="showcase__petal"
        :style="petalStyle(petal)"
      ></span>
    </div>

    <div class="showcase__tabs" role="tablist" :aria-label="props.copy.tabsAriaLabel">
      <button
        v-for="band in props.bands"
        :key="band.id"
        type="button"
        class="showcase__tab"
        :class="{ 'showcase__tab--active': band.id === activeBand?.id }"
        :aria-selected="band.id === activeBand?.id"
        role="tab"
        @click="selectBand(band.id)"
      >
        {{ band.label }}
      </button>
    </div>

    <div class="showcase__fan">
      <div class="showcase__ring showcase__ring--outer"></div>
      <div class="showcase__ring showcase__ring--inner"></div>

      <div
        v-if="activeBand"
        :key="activeBand.id"
        class="showcase__fan-stage"
        :class="{ 'showcase__fan-stage--expanded': isFanExpanded }"
        @pointerenter="handleFanPointerEnter"
        @pointerleave="handleFanPointerLeave"
        @focusin="handleFanFocusIn"
        @focusout="handleFanFocusOut"
      >
        <button
          v-for="item in laidOutCards"
          :key="item.card.id"
          type="button"
          class="showcase-card"
          :class="{
            'showcase-card--highlighted': item.highlighted,
            'showcase-card--selected': item.selected,
            'showcase-card--revealed': item.revealed,
          }"
          :style="cardStyle(item)"
          @mouseenter="previewCharacter(item.card.id)"
          @mouseleave="clearPreview(item.card.id)"
          @focus="previewCharacter(item.card.id)"
          @blur="clearPreview(item.card.id)"
          @click="selectCharacter(item.card.id)"
        >
          <div class="showcase-card__inner">
            <div class="showcase-card__face showcase-card__face--front">
              <img :src="item.card.image" :alt="item.card.name" class="showcase-card__image" />
              <div class="showcase-card__shine"></div>
              <div class="showcase-card__meta">
                <p>{{ item.card.role }}</p>
                <h3>{{ item.card.name }}</h3>
              </div>
            </div>

            <div class="showcase-card__face showcase-card__face--back">
              <img :src="item.card.image" :alt="item.card.fullName" class="showcase-card__image" />
              <div class="showcase-card__shine showcase-card__shine--back"></div>
              <div class="showcase-card__meta">
                <p>{{ item.card.fullName }}</p>
                <h3>{{ item.card.name }}</h3>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.showcase {
  --tabs-visual-shift: 28px;
  --fan-visual-lift: -220px;
  position: relative;
  overflow: visible;
  display: grid;
  grid-template-columns: clamp(148px, 16vw, 196px) minmax(0, 1fr);
  align-items: center;
  column-gap: clamp(22px, 3vw, 40px);
  padding: clamp(12px, 1.6vw, 18px) 0;
  border: none;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
}

.showcase::before {
  content: none;
}

.showcase__tabs,
.showcase__fan {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.showcase__tabs {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-self: center;
  justify-content: center;
  padding: 0;
  transform: translateY(var(--tabs-visual-shift));
}

.showcase__tabs::before {
  content: 'Band Select';
  margin-bottom: 10px;
  color: rgba(116, 38, 77, 0.48);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.showcase__tab {
  position: relative;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.58);
  border-radius: 26px;
  padding: 16px 18px 16px 44px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(255, 248, 251, 0.72));
  color: rgba(74, 0, 44, 0.72);
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-align: left;
  white-space: nowrap;
  box-shadow:
    0 20px 28px -28px rgba(105, 39, 74, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.88);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease;
}

.showcase__tab::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 18px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(168, 33, 110, 0.18);
  box-shadow: 0 0 0 6px rgba(168, 33, 110, 0.06);
  transform: translateY(-50%);
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.showcase__tab:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--showcase-accent) 28%, white);
  color: color-mix(in srgb, var(--showcase-accent) 82%, #4a002c);
  box-shadow:
    0 28px 34px -28px rgba(105, 39, 74, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.showcase__tab--active {
  border-color: rgba(255, 255, 255, 0.18);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--showcase-accent) 94%, white),
    color-mix(in srgb, var(--showcase-accent) 72%, #ffffff)
  );
  color: #fff;
  box-shadow:
    0 24px 32px -24px color-mix(in srgb, var(--showcase-accent) 62%, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.26);
}

.showcase__tab--active::before {
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.16);
  transform: translateY(-50%) scale(1.08);
}

.showcase__fan {
  position: relative;
  flex: 1;
  min-height: 540px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 2200px;
}

.showcase__fan::before,
.showcase__fan::after {
  content: '';
  position: absolute;
  pointer-events: none;
}

.showcase__fan::before {
  inset: 10% 8% 4%;
  border-radius: 42px;
  background:
    radial-gradient(circle at 50% 38%, rgba(255, 255, 255, 0.62), rgba(255, 255, 255, 0) 56%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0));
  opacity: 0.86;
}

.showcase__fan::after {
  left: 50%;
  bottom: calc(28px + var(--fan-visual-lift));
  width: min(560px, 78%);
  height: 140px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 171, 99, 0.24), rgba(255, 171, 99, 0));
  filter: blur(12px);
  transform: translateX(-50%);
}

.showcase__fan-stage {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 760px;
  animation: fanStageIn 0.48s ease;
  --fan-spacing-x: 38px;
  --fan-base-y: 18px;
  --fan-arc-depth: 14px;
  --fan-rotation: 4deg;
  --fan-scale-max: 1.02;
  --fan-scale-loss: 0.045;
}

.showcase__fan-stage--expanded {
  --fan-spacing-x: 132px;
  --fan-base-y: -36px;
  --fan-arc-depth: 18px;
  --fan-rotation: 10.5deg;
  --fan-scale-max: 1.07;
  --fan-scale-loss: 0.08;
}

.showcase__ring {
  position: absolute;
  left: 50%;
  bottom: calc(46px + var(--fan-visual-lift));
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--showcase-accent) 14%, white);
  transform: translateX(-50%);
  pointer-events: none;
  opacity: 0.9;
}

.showcase__ring--outer {
  width: min(610px, 96%);
  height: min(460px, 88%);
  animation: spin 34s linear infinite;
}

.showcase__ring--inner {
  width: min(450px, 72%);
  height: min(330px, 64%);
  border-style: dashed;
  animation: spinReverse 26s linear infinite;
}

.showcase-card {
  position: absolute;
  bottom: calc(48px + var(--fan-visual-lift));
  left: 50%;
  width: clamp(168px, 22vw, 236px);
  aspect-ratio: 2 / 3;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  perspective: 1600px;
  transform-style: preserve-3d;
  transform-origin: bottom center;
  --card-lift-x: 0px;
  --card-lift-y: 0px;
  --card-tilt-offset: 0deg;
  --card-pop-scale: 1;
  filter: saturate(0.94);
  transition:
    transform 0.62s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.3s ease;
  animation: fanCardIn 0.56s cubic-bezier(0.22, 1, 0.36, 1) both;
  transform: translateX(calc(-50% + (var(--slot) * var(--fan-spacing-x)) + var(--card-lift-x)))
    translateY(
      calc(
        var(--fan-base-y) + (var(--slot-distance) * var(--slot-distance) * var(--fan-arc-depth)) +
          var(--card-lift-y)
      )
    )
    rotate(calc((var(--slot) * var(--fan-rotation)) + var(--card-tilt-offset)))
    scale(calc(var(--fan-scale-max) - (var(--slot-distance) * var(--fan-scale-loss))))
    scale(var(--card-pop-scale));
}

.showcase-card:hover {
  filter: saturate(1.04);
}

.showcase-card:focus-visible {
  outline: none;
  filter: saturate(1.08);
}

.showcase-card--highlighted {
  filter: saturate(1.06);
}

.showcase-card--selected {
  filter: saturate(1.02);
}

.showcase-card--revealed {
  --card-lift-x: calc(var(--card-direction) * 16px);
  --card-lift-y: -94px;
  --card-tilt-offset: calc(var(--card-direction) * 1.5deg);
  --card-pop-scale: 1.12;
  filter: saturate(1.06);
}

.showcase-card__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.72s cubic-bezier(0.22, 1, 0.36, 1);
}

.showcase-card--revealed .showcase-card__inner {
  transform: rotateY(180deg);
}

.showcase-card__face {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.95);
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(247, 241, 236, 0.92)),
    linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
  box-shadow:
    0 30px 58px -30px rgba(34, 14, 27, 0.44),
    0 0 0 1px rgba(255, 255, 255, 0.34);
  backface-visibility: hidden;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.showcase-card:hover .showcase-card__face,
.showcase-card:focus-visible .showcase-card__face {
  border-color: color-mix(in srgb, var(--card-accent) 48%, white);
}

.showcase-card--highlighted .showcase-card__face,
.showcase-card--selected .showcase-card__face {
  border-color: color-mix(in srgb, var(--card-accent) 32%, white);
  box-shadow:
    0 38px 64px -28px rgba(34, 14, 27, 0.52),
    0 0 0 2px color-mix(in srgb, var(--card-accent) 28%, white),
    0 0 34px color-mix(in srgb, var(--card-accent) 26%, transparent);
}

.showcase-card--revealed .showcase-card__face {
  box-shadow:
    0 40px 66px -30px rgba(34, 14, 27, 0.56),
    0 0 0 2px color-mix(in srgb, var(--card-accent) 34%, white),
    0 0 40px color-mix(in srgb, var(--card-accent) 28%, transparent);
}

.showcase-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.showcase-card__shine {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(140deg, rgba(255, 255, 255, 0.3), transparent 56%),
    linear-gradient(
      12deg,
      transparent 26%,
      color-mix(in srgb, var(--card-accent) 16%, transparent) 100%
    );
  pointer-events: none;
}

.showcase-card__shine--back {
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.22), transparent 54%),
    linear-gradient(
      20deg,
      transparent 18%,
      color-mix(in srgb, var(--card-accent) 22%, transparent) 100%
    );
}

.showcase-card__meta {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  padding: 22px 18px 18px;
  text-align: left;
}

.showcase-card__meta::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(10, 8, 10, 0) 46%, rgba(10, 8, 10, 0.92) 100%),
    linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.08));
  pointer-events: none;
}

.showcase-card__meta > * {
  position: relative;
  z-index: 1;
}

.showcase-card__meta p {
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.showcase-card__meta h3 {
  margin: 8px 0 0;
  font-family: 'Fraunces', serif;
  font-size: 1.45rem;
  line-height: 1;
  color: color-mix(in srgb, var(--card-accent) 72%, white);
}

.showcase-card__face--back {
  transform: rotateY(180deg);
}

.showcase__petals {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.showcase__petal {
  position: absolute;
  top: -14%;
  border-radius: 150% 0 150% 0;
  background: color-mix(in srgb, var(--showcase-accent) 24%, #ffd6ea);
  filter: blur(1px);
  transform: rotate(45deg);
  animation: petalFall linear infinite;
}

@keyframes fanStageIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fanCardIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes petalFall {
  0% {
    transform: translate3d(0, -8vh, 0) rotate(0deg);
  }

  100% {
    transform: translate3d(40px, 108vh, 0) rotate(320deg);
  }
}

@keyframes spin {
  from {
    transform: translateX(-50%) rotate(0deg);
  }

  to {
    transform: translateX(-50%) rotate(360deg);
  }
}

@keyframes spinReverse {
  from {
    transform: translateX(-50%) rotate(360deg);
  }

  to {
    transform: translateX(-50%) rotate(0deg);
  }
}

@media (max-width: 880px) {
  .showcase {
    --tabs-visual-shift: 0px;
    --fan-visual-lift: 0px;
    grid-template-columns: 1fr;
    row-gap: 12px;
    padding: 8px 0;
  }

  .showcase__tabs {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    align-self: start;
    padding: 0;
    transform: none;
  }

  .showcase__tabs::before {
    width: 100%;
    margin-bottom: 0;
  }

  .showcase__tab {
    width: auto;
    padding: 11px 16px;
    font-size: 0.8rem;
    text-align: center;
  }

  .showcase__fan {
    min-height: 400px;
  }

  .showcase__fan-stage {
    --fan-spacing-x: 26px;
    --fan-base-y: 12px;
    --fan-arc-depth: 10px;
    --fan-rotation: 3.5deg;
    --fan-scale-max: 1;
    --fan-scale-loss: 0.04;
  }

  .showcase__fan-stage--expanded {
    --fan-spacing-x: 92px;
    --fan-base-y: -24px;
    --fan-arc-depth: 15px;
    --fan-rotation: 8.5deg;
    --fan-scale-max: 1.04;
    --fan-scale-loss: 0.07;
  }

  .showcase-card {
    width: clamp(134px, 24vw, 184px);
  }

  .showcase-card--revealed {
    --card-lift-y: -68px;
  }
}

@media (max-width: 620px) {
  .showcase {
    row-gap: 8px;
    padding: 4px 0;
  }

  .showcase__fan {
    min-height: 320px;
  }

  .showcase__fan-stage {
    --fan-spacing-x: 18px;
    --fan-base-y: 14px;
    --fan-arc-depth: 9px;
    --fan-rotation: 3deg;
    --fan-scale-max: 0.98;
    --fan-scale-loss: 0.035;
  }

  .showcase__fan-stage--expanded {
    --fan-spacing-x: 58px;
    --fan-base-y: -10px;
    --fan-arc-depth: 13px;
    --fan-rotation: 7deg;
    --fan-scale-max: 1.02;
    --fan-scale-loss: 0.06;
  }

  .showcase-card {
    width: 120px;
  }

  .showcase-card__face {
    border-radius: 22px;
  }

  .showcase-card__meta {
    padding: 16px 14px 14px;
  }

  .showcase-card__meta h3 {
    font-size: 1.22rem;
  }

  .showcase-card--revealed {
    --card-lift-y: -54px;
  }
}
</style>
