<template>
  <Transition name="toast">
    <div v-if="visible" class="toast" :class="type">
      <div class="toast-icon">
        <svg v-if="type === 'info'" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
          />
        </svg>
      </div>
      <div class="toast-content">
        <div class="toast-message">{{ message }}</div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
  show: false,
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const visible = ref(props.show)

watch(
  () => props.show,
  (newVal) => {
    visible.value = newVal
    if (newVal && props.duration > 0) {
      setTimeout(() => {
        visible.value = false
        emit('update:show', false)
      }, props.duration)
    }
  },
)
</script>

<style lang="scss" scoped>
.toast {
  position: fixed !important;
  top: 20px !important;
  right: 20px !important;
  left: auto !important;
  bottom: auto !important;
  min-width: 300px;
  max-width: 400px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  box-shadow:
    0 0 20px rgba(254, 240, 138, 0.4),
    0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 999999 !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(252, 211, 77, 0.3);
  overflow: hidden;
  transform: translateZ(0);
  will-change: transform, opacity;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(254, 240, 138, 0.1), transparent);
    pointer-events: none;
  }

  .toast-icon {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    position: relative;
    z-index: 1;

    svg {
      width: 20px;
      height: 20px;
      filter: drop-shadow(0 0 4px currentColor);
    }
  }

  .toast-content {
    flex: 1;
    position: relative;
    z-index: 1;

    .toast-message {
      font-size: 14px;
      line-height: 1.6;
      color: #555;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
    }
  }

  &.info {
    border-left: 4px solid rgba(252, 211, 77, 0.8);

    .toast-icon {
      color: rgba(252, 211, 77, 1);
      background: rgba(254, 240, 138, 0.2);
      animation: icon-pulse 2s ease-in-out infinite;
    }
  }

  &.success {
    border-left: 4px solid #52c41a;

    .toast-icon {
      color: #52c41a;
      background: rgba(82, 196, 26, 0.1);
      animation: icon-pulse 2s ease-in-out infinite;
    }
  }

  &.warning {
    border-left: 4px solid #faad14;

    .toast-icon {
      color: #faad14;
      background: rgba(250, 173, 20, 0.1);
      animation: icon-pulse 2s ease-in-out infinite;
    }
  }

  &.error {
    border-left: 4px solid #ff4d4f;

    .toast-icon {
      color: #ff4d4f;
      background: rgba(255, 77, 79, 0.1);
      animation: icon-pulse 2s ease-in-out infinite;
    }
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(120%) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(120%) scale(0.95);
}

@keyframes icon-pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 currentColor;
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 8px 2px rgba(254, 240, 138, 0.3);
  }
}
</style>
