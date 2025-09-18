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
    width: 50%;
    height: 50%;
    // 透明边框与背景
    border: 2px solid rgba(255, 255, 255, 0.5);
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    display: flex;
  }
}
</style>
