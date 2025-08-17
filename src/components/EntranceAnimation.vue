<template>
  <div class="EntranceAnimation">
    <!-- ref="redDiv" -->
    <div class="box red"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
// const redDiv = ref<HTMLDivElement>()  ref
import { gsap } from 'gsap'
onMounted(() => {
  gsap.to('.box', { x: 200 })
})
</script>

<style lang="scss" scoped>
.EntranceAnimation {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.box {
  height: 100px;
  width: 100px;
}
.red {
  background-color: red;
}
</style>
