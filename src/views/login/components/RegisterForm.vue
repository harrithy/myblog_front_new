<script setup lang="ts">
defineOptions({
  name: 'RegisterForm',
})

import type { RegisterFormState } from '../types'
import type { RegisterFormCopy } from '../loginCopy'

defineProps<{
  copy: RegisterFormCopy
  submitting: boolean
}>()

const model = defineModel<RegisterFormState>({ required: true })

const emit = defineEmits<{
  submit: []
  githubLogin: []
  switchMode: []
}>()
</script>

<template>
  <form class="auth-form" @submit.prevent="emit('submit')">
    <div class="auth-form__field">
      <label class="auth-form__label" for="register-account">
        {{ copy.accountLabel }}
        <span>{{ copy.accountHint }}</span>
      </label>
      <div class="auth-form__control">
        <span class="auth-form__icon">✦</span>
        <input
          id="register-account"
          v-model.trim="model.account"
          class="auth-form__input"
          type="text"
          name="account"
          autocomplete="username"
          :placeholder="copy.accountPlaceholder"
          required
        />
      </div>
    </div>

    <div class="auth-form__field">
      <label class="auth-form__label" for="register-email">
        {{ copy.emailLabel }}
        <span>{{ copy.emailHint }}</span>
      </label>
      <div class="auth-form__control">
        <span class="auth-form__icon">@</span>
        <input
          id="register-email"
          v-model.trim="model.email"
          class="auth-form__input"
          type="email"
          name="email"
          autocomplete="email"
          :placeholder="copy.emailPlaceholder"
          required
        />
      </div>
    </div>

    <div class="auth-form__field">
      <label class="auth-form__label" for="register-password">
        {{ copy.passwordLabel }}
        <span>{{ copy.passwordHint }}</span>
      </label>
      <div class="auth-form__control">
        <span class="auth-form__icon">●</span>
        <input
          id="register-password"
          v-model="model.password"
          class="auth-form__input"
          type="password"
          name="new-password"
          autocomplete="new-password"
          :placeholder="copy.passwordPlaceholder"
          minlength="6"
          required
        />
      </div>
    </div>

    <button class="auth-form__submit" type="submit" :disabled="submitting">
      <span>{{ submitting ? copy.submitBusy : copy.submitIdle }}</span>
    </button>

    <div class="auth-form__divider">
      <span>{{ copy.divider }}</span>
    </div>

    <button
      class="auth-form__github"
      type="button"
      :disabled="submitting"
      @click="emit('githubLogin')"
    >
      <svg class="auth-form__github-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.8-.26.8-.58v-2.17c-3.34.73-4.04-1.42-4.04-1.42-.54-1.38-1.33-1.75-1.33-1.75-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.53.12-3.18 0 0 1-.32 3.29 1.23a11.42 11.42 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.38.82 1.11.82 2.23v3.3c0 .32.19.69.8.57A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12Z"
        />
      </svg>
      <span>{{ copy.github }}</span>
    </button>

    <p class="auth-form__switch">
      {{ copy.switchLead }}
      <button type="button" @click="emit('switchMode')">{{ copy.switchAction }}</button>
    </p>
  </form>
</template>

<style scoped lang="scss">
.auth-form {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.auth-form__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth-form__label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  color: rgba(74, 0, 44, 0.82);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.auth-form__label span {
  color: rgba(74, 0, 44, 0.34);
  font-size: 0.68rem;
  font-family: 'Noto Sans JP', sans-serif;
}

.auth-form__control {
  position: relative;
}

.auth-form__icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(168, 33, 110, 0.62);
  font-size: 0.88rem;
}

.auth-form__input {
  width: 100%;
  border: 1px solid rgba(168, 33, 110, 0.12);
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(255, 249, 252, 0.68));
  padding: 15px 18px 15px 48px;
  color: #391728;
  font-size: 0.96rem;
  font-weight: 500;
  outline: none;
  box-shadow:
    0 18px 28px -30px rgba(105, 39, 74, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.auth-form__input:focus {
  border-color: rgba(168, 33, 110, 0.28);
  box-shadow:
    0 0 0 5px rgba(168, 33, 110, 0.08),
    0 18px 32px -28px rgba(105, 39, 74, 0.3);
  transform: translateY(-1px);
}

.auth-form__input::placeholder {
  color: rgba(74, 0, 44, 0.32);
}

.auth-form__submit,
.auth-form__github {
  width: 100%;
  border: 0;
  cursor: pointer;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    opacity 0.22s ease;
}

.auth-form__submit {
  padding: 16px 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, #b53b74 0%, #ff8a63 100%);
  color: #fff;
  font-family: 'Fraunces', serif;
  font-size: 1.14rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  box-shadow: 0 26px 34px -24px rgba(181, 59, 116, 0.52);
}

.auth-form__submit:hover:not(:disabled),
.auth-form__github:hover:not(:disabled) {
  transform: translateY(-2px);
}

.auth-form__submit:disabled,
.auth-form__github:disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

.auth-form__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(74, 0, 44, 0.42);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.auth-form__divider::before,
.auth-form__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(168, 33, 110, 0.12);
}

.auth-form__github {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 999px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.84), rgba(255, 249, 252, 0.76));
  border: 1px solid rgba(168, 33, 110, 0.08);
  color: #2f2633;
  font-size: 0.96rem;
  font-weight: 700;
  box-shadow:
    0 20px 28px -26px rgba(47, 38, 51, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
}

.auth-form__github-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.auth-form__switch {
  margin: 0;
  text-align: center;
  color: rgba(74, 0, 44, 0.58);
  font-size: 0.9rem;
}

.auth-form__switch button {
  border: 0;
  padding: 0;
  background: none;
  color: #a8216e;
  font-weight: 700;
  cursor: pointer;
}
</style>
