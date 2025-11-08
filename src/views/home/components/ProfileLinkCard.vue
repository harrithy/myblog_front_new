<template>
  <div class="profile-link-wrapper">
    <h3 class="section-title">About Me</h3>
    <GoMyProfile />
  </div>
</template>

<script setup lang="ts">
import GoMyProfile from './GoMyProfile.vue'
</script>

<style lang="scss" scoped>
.profile-link-wrapper {
  width: 100%;
  // padding: 20px;
  box-sizing: border-box;
  margin-bottom: 10px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #9b59b6;
  margin: 0 0 10px 0;
  text-align: left;
  font-family:
    'Helvetica Neue', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft Yahei', sans-serif;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
  padding-bottom: 4px;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #9b59b6 0%, transparent 100%);
    border-radius: 2px;
  }
}
.profile-link-card {
  display: flex;
  padding: 8px 12px;
}
</style>
