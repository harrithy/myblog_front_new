<template>
  <!-- 动态切换 -->
  <div @click="changegasp" style="color: white">切换效果</div>
  <div class="first_gsap_demo"></div>
  <div class="second_gsap_demo"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
// 引入gsap
import { gsap } from 'gsap'
onMounted(() => {
  // 1.基本动画
  // 元素从左到右移动200px
  // x 水平方向 相当于translateX
  // y 垂直方向 相当于translateY
  // xPercent 水平方向 相当于translateX%
  // yPercent 垂直方向 相当于translateY%
  // scale 缩放比例
  // scaleX 水平方向缩放比例
  // scaleY 垂直方向缩放比例
  // rotation 旋转角度 1.使用度（90）  2.使用弧度（1.25rad）
  // duration 动画时间
  // repeat 重复运动 -1为无限循环
  // yoyo 往返运动 true为往返运动 false为不往返运动
  // delay 动画开始延迟时间
  // gsap.to() 元素从当前位置移动到目标位置
  // gsap.from() 元素从目标位置移动到当前位置
  // gsap.fromTo() 元素从一个位置移动到另一个位置
  // gsap.set() 元素设置到目标位置,无动画效果
  // 2.动画缓动函数 ease
  // core 核心缓动
  // none 无缓动
  // power1 轻微的加速/减速 相当于quad
  // power2 中等的加速/减速 相当于cubic
  // power3 较强的加速/减速 相当于quart
  // power4 最强的加速/减速 相当于quint
  // back 回弹效果，超出目标值后回弹 back.inout(4) 4为弹出范围
  // ease pack 缓动包
  // bounce 弹跳效果,像球落地弹跳
  // circ 圆型缓动,基于圆形函数  https://gsap.com/resources/getting-started/Easing
  // elastic 弹性效果,像橡皮筋拉伸
  // expo 指数缓动,急剧加速或减速
  // sine 正弦缓动,平滑的曲线
  // steps 阶梯式动画，分布进行 steps(20) 20帧 单位是这个
  // 3.ease pack 扩展
  // rough 粗糙/抖动效果 rough({ strength:1,points:20,template:none.out,taper:none,randomize:true,clamp:false })
  // 以下为rough的参数介绍
  // strength 抖动强度 0-5 数值越大抖动越强烈 1表示中等强度的抖动
  // points 抖动点数量 正整数 通常10-50 20个点意味着动画过程中会有20个随机的抖动变化点
  // taper  锥形渐变效果 选项: none,in,out,both none表示整个动画过程中抖动强度保持一致
  // randomize 是否随机化抖动点 选项: true,false 随机化后每个点的位置都是随机的 true 使每次播放动画时抖动模式都不同
  // clamp 是否限制数值范围 选项: true,false  true 表示限制数值范围在目标值的范围内 false允许动画值超出起始和结束值的范围，创造出更自然地抖动效果
  // template 基础缓动模板 在抖动效果基础上应用的底层缓动曲线 效果 none.out 表示线性缓出效果
  // 以上为rough的参数介绍
  // slow 慢速缓动 ease:slow(0.9,2,false)
  // 以下为slow的参数介绍
  // 第一个参数0.9 -radio 慢动作部分占整个动画的比例 0-1之间的小数 0.9表示90%的动画时间是慢动作，10%是正常速度 数值越大，慢动作部分越长
  // 第二个参数2 -power 慢动作的强度/程度 0.5-4之间 2表示中等强度的慢动作效果 数值越大，慢动作越明显
  // 第三个参数false -yoyoMode(悠悠球模式) true/false false:慢动作出现在动画的中间部分 true:慢动作出现在动画的开始和结束部分
  // 以上为slow的参数介绍
  // expoScale 指数缩放缓动 ease:expoScale(10,2.5,none)
  // 以下为expoScale的参数介绍
  // 第一个参数10 -start 指数缩放的起始值 动画开始时的缩放倍数是10 这个值决定了动画开始时元素被放大的程度
  // 第二个参数2.5 -end 指数缩放的结束值 动画结束时的缩放倍数是2.5 动画会从10倍缩放逐渐变化成2.5倍缩放
  // 第三个参数none 应用在指数缩放基础上的缓动函数 可以是任何缓动函数 例如power4.inOut bounce none：线性变化，不额外添加缓动效果
  // 以上为expoScale的参数介绍

  const g = gsap
  g.from('.second_gsap_demo', {
    xPercent: 300,
    y: 300,
    scale: 0.5,
    rotation: 360,
    yoyo: true,
    repeat: 1,
    duration: 2,
    delay: 1,
    ease: 'expoScale(10,2.5,none)',
  })
})
// 定义切换状态 1: to, 2: from, 3: fromTo, 4: set
const gaspStatus = ref(0)
// 切换效果
const changegasp = () => {
  gaspStatus.value++
  if (gaspStatus.value > 4) {
    gaspStatus.value = 1
  }
}
// 监听切换状态
watch(gaspStatus, (newVal) => {
  switch (newVal) {
    case 1:
      gsap.to('.first_gsap_demo', { x: 100, duration: 1 })
      break
    case 2:
      gsap.from('.first_gsap_demo', { x: 200, y: 200, duration: 1 })
      break
    case 3:
      gsap.fromTo('.first_gsap_demo', { x: 200 }, { x: 0, duration: 1 })
      break
    case 4:
      gsap.set('.first_gsap_demo', { x: 200 })
      break
  }
})
</script>
<style lang="scss" scoped>
.first_gsap_demo {
  width: 100px;
  height: 100px;
  background-color: red;
}
.second_gsap_demo {
  width: 100px;
  height: 100px;
  background-color: blue;
}
</style>
