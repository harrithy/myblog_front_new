export type AuthMode = 'login' | 'register'
export type LoginLocale = 'ja' | 'zh' | 'en'
export type AuthShowcaseBandId = 'kon' | 'bocchi' | 'gbc' | 'mygo'

export interface LoginFormState {
  account: string
  password: string
  rememberMe: boolean
}

export interface RegisterFormState {
  account: string
  email: string
  password: string
}

export interface AuthShowcaseCharacter {
  id: string
  name: string
  fullName: string
  role: string
  accent: string
  image: string
  href: string
}

export interface AuthShowcaseBand {
  id: AuthShowcaseBandId
  label: string
  eyebrow: string
  description: string
  accent: string
  sourceLabel: string
  sourceHref: string
  featuredId: string
  characters: AuthShowcaseCharacter[]
}

export interface AuthMessageCopy {
  loginSuccess: string
  loginFailure: string
  registerSuccess: string
  registerFailure: string
  passwordMismatch: string
}
