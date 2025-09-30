<template>
  <svg class="svg-character" viewBox="-20 -35 40 40" xmlns="http://www.w3.org/2000/svg">
    <g class="character-body">
      <!-- Legs -->
      <rect ref="legLeft" x="-7" y="-5" width="5" height="8" fill="#444" rx="2" />
      <rect ref="legRight" x="2" y="-5" width="5" height="8" fill="#444" rx="2" />

      <!-- Body -->
      <path d="M -8 -15 Q -9 -10 -5 -8 L 5 -8 Q 9 -10 8 -15 Z" fill="#5a5a5a" />

      <!-- Head -->
      <g class="head">
        <circle cx="0" cy="-20" r="10" fill="#fde5d4" />
        <!-- skin -->

        <!-- Hair -->
        <path
          d="M 0 -30
             C -15 -30 -15 -15 -10 -15
             Q -11 -18 -8 -20
             Q -5 -16 0 -17
             Q 5 -16 8 -20
             Q 11 -18 10 -15
             C 15 -15 15 -30 0 -30 Z"
          fill="#333"
        />
        <!-- Ahoge (呆毛) -->
        <path
          d="M 0 -30 Q 2 -33 4 -30"
          stroke="#333"
          stroke-width="1.2"
          fill="none"
          stroke-linecap="round"
        />

        <!-- Eye Patch -->
        <path
          d="M -8 -22 Q -5 -25 -2 -22 L -2 -18 Q -5 -15 -8 -18 Z"
          fill="#f0f0f0"
          stroke="#ccc"
          stroke-width="0.5"
        />

        <!-- Eye -->
        <circle cx="5" cy="-20" r="1.5" fill="#2c2c2c" />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const legLeft = ref<SVGRectElement | null>(null)
const legRight = ref<SVGRectElement | null>(null)

onMounted(() => {
  if (legLeft.value && legRight.value) {
    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.to(legLeft.value, { y: '-=2', duration: 0.3, ease: 'power1.inOut' }).to(
      legRight.value,
      { y: '+=2', duration: 0.3, ease: 'power1.inOut' },
      '<',
    )
  }
})
</script>

<style scoped>
.svg-character {
  width: 32px;
  height: 32px;
  /* GSAP will control the transform for positioning */
  overflow: visible;
}
</style>
