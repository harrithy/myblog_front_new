<template>
  <div class="EntranceAnimation">
    <EntranceAnimation v-if="FirstEnter" />
  </div>
  <RouterView />
</template>
<script setup lang="ts">
// 第一次进入页面，控制名字动画的第一次出现，然后再出现routerview
import { ref } from 'vue'
import EntranceAnimation from '@/components/EntranceAnimation.vue'
const FirstEnter = ref(true)
console.log(FirstEnter.value)
</script>
<style lang="scss" scoped>
.EntranceAnimation {
  position: fixed;
}
</style>
