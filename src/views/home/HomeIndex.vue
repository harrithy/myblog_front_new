<template>
  <!-- 个人主页 -->
  <div class="home">
    <!-- 视频背景 -->
    <video autoplay loop muted class="video-background">
      <source src="../../assets/source/kkl.mp4" type="video/mp4" />
    </video>
    <div class="myblog-box"></div>
  </div>
</template>

<script setup lang="ts">
// import { navigateTo } from '@/utils/navigation'
import { onMounted } from 'vue'
import { visitApi } from '@/api/index'
import { ref } from 'vue'
import type { VisitRecord } from '@/api/visit'

// 创建分页
const page = ref(1)
const pageSize = ref(10)
// 访问记录
const visits = ref<VisitRecord[]>([])

onMounted(() => {
  // visitApi.addVisit({ visit_time: new Date().toISOString() }).then(() => {
  //   console.log('Visit recorded successfully')
  // })
  visitApi.getVisits(page.value, pageSize.value).then((res) => {
    // console.log(res)
    visits.value = res as VisitRecord[]
    console.log(visits.value)
  })
})
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  position: relative; /* Needed for video positioning */
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  .video-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* Ensures video covers entire container */
    z-index: -1;
    opacity: 0.8;
  }
  .myblog-box {
    width: 70%;
    height: 70%;
    // 透明边框与背景
    border: 2px solid rgba(255, 255, 255, 0.5);
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    display: flex;
  }
}
</style>
