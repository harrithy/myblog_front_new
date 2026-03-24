<script setup lang="ts">
defineOptions({
  name: 'AuthPanel',
})

import { computed } from 'vue'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'
import type { AuthMode, LoginFormState, RegisterFormState } from '../types'
import type { AuthPanelCopy } from '../loginCopy'

const props = defineProps<{
  copy: AuthPanelCopy
  submitting: boolean
  errorMessage: string
}>()

const mode = defineModel<AuthMode>('mode', { required: true })
const loginForm = defineModel<LoginFormState>('loginForm', { required: true })
const registerForm = defineModel<RegisterFormState>('registerForm', { required: true })

const emit = defineEmits<{
  submitLogin: []
  submitRegister: []
  githubLogin: []
  switchMode: [mode: AuthMode]
}>()

const panelTitle = computed(() => props.copy.titles[mode.value])
const panelSubtitle = computed(() => props.copy.subtitles[mode.value])
const panelModeLabel = computed(() => props.copy.tabs[mode.value])

const switchMode = (nextMode: AuthMode) => {
  mode.value = nextMode
  emit('switchMode', nextMode)
}
</script>

<template>
  <section class="panel">
    <header class="panel__header">
      <span class="panel__mode-label">{{ panelModeLabel }}</span>
      <div class="panel__title-row">
        <h2>{{ panelTitle }}</h2>
      </div>
      <p class="panel__subtitle">{{ panelSubtitle }}</p>
    </header>

    <div class="panel__tabs" role="tablist" :aria-label="props.copy.tabsAriaLabel">
      <button
        type="button"
        class="panel__tab"
        :class="{ 'panel__tab--active': mode === 'login' }"
        @click="switchMode('login')"
      >
        {{ props.copy.tabs.login }}
      </button>
      <button
        type="button"
        class="panel__tab"
        :class="{ 'panel__tab--active': mode === 'register' }"
        @click="switchMode('register')"
      >
        {{ props.copy.tabs.register }}
      </button>
    </div>

    <p v-if="props.errorMessage" class="panel__error">{{ props.errorMessage }}</p>

    <LoginForm
      v-if="mode === 'login'"
      v-model="loginForm"
      :copy="props.copy.loginForm"
      :submitting="props.submitting"
      @submit="emit('submitLogin')"
      @github-login="emit('githubLogin')"
      @switch-mode="switchMode('register')"
    />

    <RegisterForm
      v-else
      v-model="registerForm"
      :copy="props.copy.registerForm"
      :submitting="props.submitting"
      @submit="emit('submitRegister')"
      @github-login="emit('githubLogin')"
      @switch-mode="switchMode('login')"
    />
  </section>
</template>

<style scoped lang="scss">
.panel {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 22px;
  padding: clamp(30px, 4vw, 40px);
  border-radius: 32px;
  border: 1px solid rgba(168, 33, 110, 0.1);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(255, 249, 252, 0.76)),
    linear-gradient(140deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
  box-shadow:
    0 46px 72px -52px rgba(168, 33, 110, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
}

.panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 12% 12%, rgba(255, 146, 203, 0.12), transparent 24%),
    radial-gradient(circle at 88% 14%, rgba(108, 199, 255, 0.12), transparent 26%);
  pointer-events: none;
}

.panel::after {
  content: '';
  position: absolute;
  inset: 18px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

.panel__header,
.panel__tabs,
.panel__error {
  position: relative;
  z-index: 1;
}

.panel__header {
  display: grid;
  gap: 10px;
}

.panel__mode-label {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.62);
  color: rgba(128, 20, 79, 0.62);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.panel__title-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.panel__title-row h2 {
  margin: 0;
  font-family: 'Fraunces', serif;
  font-size: clamp(2.15rem, 4vw, 2.9rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
  color: #80144f;
}

.panel__subtitle {
  margin: 0;
  color: rgba(60, 37, 49, 0.72);
  font-size: 0.94rem;
  line-height: 1.68;
}

.panel__tabs {
  display: flex;
  align-items: center;
  gap: 28px;
  width: fit-content;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(168, 33, 110, 0.12);
}

.panel__tab {
  position: relative;
  border: 0;
  padding: 6px 0 10px;
  background: transparent;
  color: rgba(74, 0, 44, 0.52);
  font-size: 0.96rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease;
}

.panel__tab::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -5px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #b53b74, #ff8a63);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.22s ease;
  opacity: 0.92;
}

.panel__tab:hover {
  transform: translateY(-1px);
  color: #80144f;
}

.panel__tab--active {
  color: #7f1d4e;
}

.panel__tab--active::after {
  transform: scaleX(1);
}

.panel__error {
  margin: 0;
  padding: 14px 16px;
  border-radius: 20px;
  background: rgba(179, 27, 37, 0.08);
  border: 1px solid rgba(179, 27, 37, 0.16);
  color: #9f0519;
  font-size: 0.9rem;
  line-height: 1.6;
}

.panel__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.panel__footnote {
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(168, 33, 110, 0.08);
  color: rgba(74, 0, 44, 0.62);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 680px) {
  .panel {
    padding: 24px 20px;
    gap: 18px;
    border-radius: 30px;
  }
}
</style>
