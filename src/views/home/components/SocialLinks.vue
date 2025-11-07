<template>
  <div class="social-links">
    <a
      v-for="(social, index) in socials"
      :key="index"
      :href="social.link"
      :style="{ '--item-index': index }"
      class="social-item"
      :target="social.link === '#' ? '_self' : '_blank'"
      rel="noopener noreferrer"
      @click="handleClick($event, social)"
    >
      <div class="social-label" :style="{ backgroundColor: social.color }">
        {{ social.name }}
      </div>
      <div class="icon-wrapper" :style="{ '--brand-color': social.color }">
        <component :is="social.icon" class="icon" />
      </div>
    </a>
  </div>

  <Teleport to="body">
    <ToastNotification
      v-model:show="showToast"
      :message="toastMessage"
      type="info"
      :duration="3000"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { h, ref, type Component } from 'vue'
import ToastNotification from '@/components/ToastNotification.vue'

interface Social {
  name: string
  link: string
  color: string
  icon: Component
}

const showToast = ref(false)
const toastMessage = ref('')

// GitHub 图标
const GithubIcon = () =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
    },
    h('path', {
      d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
    }),
  )

// 微信图标
const WechatIcon = () =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
    },
    h('path', {
      d: 'M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z',
    }),
  )

// QQ邮箱图标
const QQMailIcon = () =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
    },
    [
      h('path', {
        d: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
      }),
    ],
  )

// B站图标
const BilibiliIcon = () =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
    },
    h('path', {
      d: 'M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373Z',
    }),
  )

const socials: Social[] = [
  {
    name: 'GitHub',
    link: 'https://github.com/harrithy',
    color: '#24292e',
    icon: GithubIcon,
  },
  {
    name: '微信',
    link: '#',
    color: '#07c160',
    icon: WechatIcon,
  },
  {
    name: 'QQ邮箱',
    link: 'mailto:2656450899@qq.com',
    color: '#1296db',
    icon: QQMailIcon,
  },
  {
    name: 'B站',
    link: 'https://space.bilibili.com/209674243',
    color: '#fb7299',
    icon: BilibiliIcon,
  },
]

// 处理点击事件
const handleClick = (event: MouseEvent, social: Social) => {
  if (social.name === '微信') {
    event.preventDefault()
    toastMessage.value = '哎呀，请先通过QQ邮箱和我取得联系呢'
    showToast.value = true
  }
}
</script>

<style lang="scss" scoped>
.social-links {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin: 20px 0 0 0;

  .social-item {
    text-decoration: none;
    animation: item-fade-in 0.5s ease-out forwards;
    animation-delay: calc(var(--item-index) * 0.1s);
    opacity: 0;
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;

    .social-label {
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      transform: translateY(-8px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%) translateY(-8px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

      &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        width: 8px;
        height: 8px;
        background: inherit;
      }
    }

    .icon-wrapper {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
      position: relative;
      overflow: visible;
      flex-shrink: 0;
      background-color: white;
      opacity: 0.8;

      .icon {
        width: 20px;
        height: 20px;
        color: var(--brand-color);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        z-index: 1;
      }
    }

    &:hover {
      .social-label {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }

      .icon-wrapper {
        background-color: var(--brand-color);
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

        .icon {
          color: white;
        }
      }
    }

    &:active {
      .icon-wrapper {
        transform: translateY(-2px) scale(1.02);
      }
    }
  }
}

@keyframes item-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
