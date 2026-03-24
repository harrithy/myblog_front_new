import { reactive, shallowRef, toValue, type MaybeRefOrGetter } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userApi, type AuthResponse, type RegisterData } from '@/api/user'
import { useUserStore } from '@/stores/user'
import type {
  AuthMessageCopy,
  AuthMode,
  LoginFormState,
  RegisterFormState,
} from '@/views/login/types'

const REMEMBERED_ACCOUNT_KEY = 'rememberedAccount'
const AUTH_REDIRECT_KEY = 'auth:redirect'
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || 'Ov23liSXz8pI9Z4PcnnO'

const defaultMessages: AuthMessageCopy = {
  loginSuccess: 'ログインしました。ホームへ移動します。',
  loginFailure: 'ログインに失敗しました。しばらくしてからもう一度お試しください。',
  registerSuccess: '登録が完了しました。ホームへ移動します。',
  registerFailure: '登録に失敗しました。しばらくしてからもう一度お試しください。',
  passwordMismatch: '確認用パスワードが一致しません。',
}

const sanitizeRedirectTarget = (target?: string | null) => {
  if (!target || !target.startsWith('/') || target.startsWith('//')) {
    return '/'
  }

  if (
    target.startsWith('/login') ||
    target.startsWith('/ownerlogin') ||
    target.startsWith('/callback')
  ) {
    return '/'
  }

  return target
}

const getStoredAccount = () => {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.localStorage.getItem(REMEMBERED_ACCOUNT_KEY) || ''
}

const buildGithubFallbackUrl = () => {
  const redirectUri = `${window.location.origin}/callback`
  const query = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: 'user:email',
  })

  return `https://github.com/login/oauth/authorize?${query.toString()}`
}

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

const syncRememberedAccount = (loginForm: LoginFormState) => {
  if (typeof window === 'undefined') {
    return
  }

  if (loginForm.rememberMe) {
    window.localStorage.setItem(REMEMBERED_ACCOUNT_KEY, loginForm.account.trim())
    return
  }

  window.localStorage.removeItem(REMEMBERED_ACCOUNT_KEY)
}

export const getAuthRedirectTarget = (candidate?: unknown) => {
  if (typeof candidate !== 'string') {
    return '/'
  }

  return sanitizeRedirectTarget(candidate)
}

export const rememberAuthRedirect = (target: string) => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(AUTH_REDIRECT_KEY, sanitizeRedirectTarget(target))
}

export const consumeAuthRedirect = () => {
  if (typeof window === 'undefined') {
    return '/'
  }

  const target = sanitizeRedirectTarget(window.sessionStorage.getItem(AUTH_REDIRECT_KEY))
  window.sessionStorage.removeItem(AUTH_REDIRECT_KEY)
  return target
}

export const persistAuthSession = (authResponse: AuthResponse) => {
  const userStore = useUserStore()
  userStore.setToken(authResponse.token)
  userStore.setUserInfo(authResponse.user)
  userStore.saveUserInfo()
}

export const useAuthSession = (messages: MaybeRefOrGetter<AuthMessageCopy> = defaultMessages) => {
  const route = useRoute()
  const router = useRouter()
  const mode = shallowRef<AuthMode>(route.query.mode === 'register' ? 'register' : 'login')
  const isSubmitting = shallowRef(false)
  const errorMessage = shallowRef('')

  const loginForm = reactive<LoginFormState>({
    account: getStoredAccount(),
    password: '',
    rememberMe: Boolean(getStoredAccount()),
  })

  const registerForm = reactive<RegisterFormState>({
    account: '',
    email: '',
    password: '',
  })

  const redirectTarget = () => getAuthRedirectTarget(route.query.redirect)
  const currentMessages = () => toValue(messages)

  const finishAuth = async (authResponse: AuthResponse, successMessage: string) => {
    persistAuthSession(authResponse)
    syncRememberedAccount(loginForm)
    ElMessage.success(successMessage)
    await router.replace(redirectTarget())
  }

  const setMode = (nextMode: AuthMode) => {
    if (mode.value === nextMode) {
      return
    }

    errorMessage.value = ''
    mode.value = nextMode
  }

  const submitLogin = async () => {
    errorMessage.value = ''
    isSubmitting.value = true

    try {
      const response = (await userApi.login({
        account: loginForm.account.trim(),
        password: loginForm.password,
      })) as AuthResponse

      await finishAuth(response, currentMessages().loginSuccess)
    } catch (error) {
      errorMessage.value = extractErrorMessage(error, currentMessages().loginFailure)
    } finally {
      isSubmitting.value = false
    }
  }

  const submitRegister = async () => {
    errorMessage.value = ''

    isSubmitting.value = true

    const payload: RegisterData = {
      account: registerForm.account.trim(),
      email: registerForm.email.trim(),
      password: registerForm.password,
      nickname: registerForm.account.trim(),
      name: registerForm.account.trim(),
    }

    try {
      const response = (await userApi.register(payload)) as AuthResponse

      loginForm.account = payload.account
      loginForm.rememberMe = true

      await finishAuth(response, currentMessages().registerSuccess)
    } catch (error) {
      errorMessage.value = extractErrorMessage(error, currentMessages().registerFailure)
    } finally {
      isSubmitting.value = false
    }
  }

  const loginWithGithub = async () => {
    errorMessage.value = ''
    rememberAuthRedirect(redirectTarget())
    isSubmitting.value = true

    try {
      const result = (await userApi.getGithubAuthUrl()) as { url: string }
      window.location.href = result.url || buildGithubFallbackUrl()
    } catch {
      window.location.href = buildGithubFallbackUrl()
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    mode,
    loginForm,
    registerForm,
    isSubmitting,
    errorMessage,
    setMode,
    submitLogin,
    submitRegister,
    loginWithGithub,
  }
}
