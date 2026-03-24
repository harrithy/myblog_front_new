<script setup lang="ts">
defineOptions({
  name: 'OwnerLogin',
})

import { computed, shallowRef, watchEffect } from 'vue'
import { useAuthSession } from '@/composables/useAuthSession'
import AuthPanel from './components/AuthPanel.vue'
import AuthShowcase from './components/AuthShowcase.vue'
import { authPageCopyByLocale, localeNames, loginLocaleOrder } from './loginCopy'
import { getAuthShowcaseBands } from './showcaseContent'
import type { LoginLocale } from './types'

const locale = shallowRef<LoginLocale>('zh')
const pageCopy = computed(() => authPageCopyByLocale[locale.value])
const showcaseBands = computed(() => getAuthShowcaseBands(locale.value))
const currentLocaleLabel = computed(() => localeNames[locale.value])
const showcaseExpanded = shallowRef(false)
const nextLocale = computed(() => {
  const currentIndex = loginLocaleOrder.indexOf(locale.value)
  return loginLocaleOrder[(currentIndex + 1) % loginLocaleOrder.length]
})
const nextLocaleLabel = computed(() => localeNames[nextLocale.value])

watchEffect(() => {
  document.title = `${pageCopy.value.page.documentTitle}-harrio`
})

const {
  mode,
  loginForm,
  registerForm,
  isSubmitting,
  errorMessage,
  setMode,
  submitLogin,
  submitRegister,
  loginWithGithub,
} = useAuthSession(computed(() => pageCopy.value.messages))

const cycleLocale = () => {
  locale.value = nextLocale.value
}
</script>

<template>
  <div class="auth-entry">
    <div class="auth-entry__glow auth-entry__glow--rose"></div>
    <div class="auth-entry__glow auth-entry__glow--sky"></div>
    <div class="auth-entry__glow auth-entry__glow--gold"></div>
    <div class="auth-entry__grid"></div>

    <button class="auth-entry__locale" type="button" @click="cycleLocale">
      <span class="auth-entry__locale-label">{{ pageCopy.page.localeButtonLabel }}</span>
      <strong>{{ currentLocaleLabel }}</strong>
      <small>{{ pageCopy.page.localeButtonNextPrefix }} {{ nextLocaleLabel }}</small>
    </button>

    <section class="auth-shell" :class="{ 'auth-shell--expanded': showcaseExpanded }">
      <AuthShowcase
        :bands="showcaseBands"
        :copy="pageCopy.showcase"
        class="auth-shell__showcase"
        @expanded-change="showcaseExpanded = $event"
      />
      <AuthPanel
        v-model:mode="mode"
        v-model:login-form="loginForm"
        v-model:register-form="registerForm"
        class="auth-shell__panel"
        :copy="pageCopy.panel"
        :submitting="isSubmitting"
        :error-message="errorMessage"
        @submit-login="submitLogin"
        @submit-register="submitRegister"
        @github-login="loginWithGithub"
        @switch-mode="setMode"
      />
    </section>
  </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;700&display=swap');

.auth-entry {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(24px, 3vw, 42px);
  background:
    radial-gradient(circle at 12% 16%, rgba(255, 159, 206, 0.34), transparent 30%),
    radial-gradient(circle at 88% 18%, rgba(165, 214, 255, 0.26), transparent 28%),
    radial-gradient(circle at 52% 92%, rgba(255, 202, 116, 0.24), transparent 32%),
    linear-gradient(120deg, rgba(255, 241, 248, 0.96), rgba(255, 249, 252, 0.92)),
    linear-gradient(180deg, #fff9fc 0%, #fff3f8 48%, #fef0f6 100%);
  isolation: isolate;
}

.auth-entry::before,
.auth-entry::after {
  content: '';
  position: absolute;
  pointer-events: none;
  z-index: -3;
}

.auth-entry::before {
  inset: auto auto 10% 8%;
  width: min(42vw, 620px);
  height: min(42vw, 620px);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0) 68%);
  filter: blur(24px);
}

.auth-entry::after {
  inset: 8% 10% auto auto;
  width: min(26vw, 320px);
  height: min(70vh, 760px);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0));
  transform: rotate(12deg);
  opacity: 0.72;
}

.auth-entry__glow {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(28px);
  opacity: 0.75;
  z-index: -2;
}

.auth-entry__glow--rose {
  width: 360px;
  height: 360px;
  top: -120px;
  left: -110px;
  background: radial-gradient(circle, rgba(255, 105, 180, 0.42), rgba(255, 105, 180, 0));
}

.auth-entry__glow--sky {
  width: 420px;
  height: 420px;
  right: -140px;
  top: 18%;
  background: radial-gradient(circle, rgba(108, 199, 255, 0.4), rgba(108, 199, 255, 0));
}

.auth-entry__glow--gold {
  width: 440px;
  height: 440px;
  bottom: -200px;
  left: 38%;
  background: radial-gradient(circle, rgba(255, 208, 93, 0.26), rgba(255, 208, 93, 0));
}

.auth-entry__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(168, 33, 110, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(168, 33, 110, 0.06) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image:
    radial-gradient(circle at center, rgba(0, 0, 0, 0.68), transparent 92%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.54), transparent 88%);
  z-index: -1;
  opacity: 0.88;
}

.auth-entry__locale {
  position: absolute;
  top: clamp(18px, 2.8vw, 28px);
  right: clamp(18px, 2.8vw, 28px);
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  min-width: 146px;
  padding: 13px 18px;
  border: 1px solid rgba(168, 33, 110, 0.12);
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.84), rgba(255, 247, 251, 0.72));
  color: #74204d;
  text-align: left;
  cursor: pointer;
  box-shadow:
    0 24px 40px -32px rgba(120, 31, 84, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.auth-entry__locale:hover {
  transform: translateY(-2px);
  border-color: rgba(168, 33, 110, 0.24);
  box-shadow:
    0 28px 48px -32px rgba(120, 31, 84, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.auth-entry__locale-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(124, 26, 76, 0.56);
}

.auth-entry__locale strong {
  font-size: 1rem;
  line-height: 1.1;
}

.auth-entry__locale small {
  font-size: 0.76rem;
  color: rgba(124, 26, 76, 0.64);
}

.auth-shell {
  position: relative;
  --showcase-column-width: min(860px, 56vw);
  width: fit-content;
  max-width: 100%;
  display: grid;
  grid-template-columns: minmax(0, var(--showcase-column-width)) minmax(390px, 468px);
  gap: clamp(28px, 3vw, 42px);
  align-items: center;
  transition: grid-template-columns 0.42s cubic-bezier(0.22, 1, 0.36, 1);
}

.auth-shell--expanded {
  --showcase-column-width: min(1040px, 66vw);
}

.auth-shell::before,
.auth-shell::after {
  content: '';
  position: absolute;
  pointer-events: none;
}

.auth-shell::before {
  inset: 7% 34% 10% -4%;
  border-radius: 44px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.06));
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.34);
  opacity: 0.72;
  z-index: -1;
}

.auth-shell::after {
  right: 18%;
  top: 10%;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 138, 188, 0.18), rgba(255, 138, 188, 0));
  filter: blur(8px);
  z-index: -1;
}

.auth-shell__showcase,
.auth-shell__panel {
  min-height: 720px;
}

.auth-shell__showcase {
  position: relative;
  width: min(100%, var(--showcase-column-width));
  transition: width 0.42s cubic-bezier(0.22, 1, 0.36, 1);
}

.auth-shell__panel {
  justify-self: end;
  width: min(100%, 468px);
}

@media (max-width: 1100px) {
  .auth-shell {
    grid-template-columns: 1fr;
    gap: 22px;
    width: 100%;
  }

  .auth-shell__showcase,
  .auth-shell__panel {
    min-height: auto;
  }

  .auth-shell__panel {
    justify-self: stretch;
    width: 100%;
  }
}

@media (max-width: 680px) {
  .auth-entry {
    padding: 16px;
  }

  .auth-entry__locale {
    top: 16px;
    right: 16px;
  }

  .auth-entry__grid {
    background-size: 24px 24px;
  }
}
</style>
