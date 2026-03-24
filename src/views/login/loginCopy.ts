import type { AuthMessageCopy, AuthMode, LoginLocale } from './types'

export interface AuthShowcaseCopy {
  title: string
  instructions: string
  tabsAriaLabel: string
  spotlight: {
    defaultLabel: string
    hoverLabel: string
  }
  facts: {
    bandSwitch: string
    featuredNow: string
    queueMotion: string
    fanOpen: string
    stacked: string
  }
  actions: {
    viewRolePage: string
  }
  details: {
    role: string
    status: string
    pinned: string
    hoverPreview: string
  }
}

export interface LoginFormCopy {
  accountLabel: string
  accountHint: string
  accountPlaceholder: string
  passwordLabel: string
  passwordHint: string
  passwordPlaceholder: string
  rememberMe: string
  helperCaption: string
  submitIdle: string
  submitBusy: string
  divider: string
  github: string
  switchLead: string
  switchAction: string
}

export interface RegisterFormCopy {
  accountLabel: string
  accountHint: string
  accountPlaceholder: string
  nicknameLabel: string
  nicknameHint: string
  nicknamePlaceholder: string
  emailLabel: string
  emailHint: string
  emailPlaceholder: string
  passwordLabel: string
  passwordHint: string
  passwordPlaceholder: string
  confirmLabel: string
  confirmHint: string
  confirmPlaceholder: string
  submitIdle: string
  submitBusy: string
  divider: string
  github: string
  switchLead: string
  switchAction: string
}

export interface AuthPanelCopy {
  kicker: string
  titles: Record<AuthMode, string>
  accents: Record<AuthMode, string>
  subtitles: Record<AuthMode, string>
  tabsAriaLabel: string
  tabs: Record<AuthMode, string>
  helperTexts: Record<AuthMode, string>
  footnotes: string[]
  loginForm: LoginFormCopy
  registerForm: RegisterFormCopy
}

export interface OwnerLoginCopy {
  documentTitle: string
  localeButtonLabel: string
  localeButtonNextPrefix: string
}

export interface AuthPageCopy {
  page: OwnerLoginCopy
  panel: AuthPanelCopy
  showcase: AuthShowcaseCopy
  messages: AuthMessageCopy
}

export const loginLocaleOrder: LoginLocale[] = ['ja', 'zh', 'en']

export const localeNames: Record<LoginLocale, string> = {
  ja: '日本語',
  zh: '中文',
  en: 'English',
}

export const authPageCopyByLocale: Record<LoginLocale, AuthPageCopy> = {
  ja: {
    page: {
      documentTitle: 'ログイン / 新規登録',
      localeButtonLabel: '表示言語',
      localeButtonNextPrefix: '次へ',
    },
    panel: {
      kicker: 'Stage Access',
      titles: {
        login: 'おかえりなさい',
        register: '新しいステージへ',
      },
      accents: {
        login: 'ログイン',
        register: '新規登録',
      },
      subtitles: {
        login: 'アカウント、メール、または GitHub から、そのままホーム画面へ入れます。',
        register: '新しいアカウントを作成すると、そのままホーム画面まで一気に進めます。',
      },
      tabsAriaLabel: '認証モード',
      tabs: {
        login: 'ログイン',
        register: '新規登録',
      },
      helperTexts: {
        login:
          'ログインすると、記憶したアカウント、ローカルセッション、GitHub 導線をまとめて引き継げます。',
        register: '登録が完了すると、すぐに有効なセッションを作成してホームへ移動します。',
      },
      footnotes: ['JWT セッションをローカル保存', 'GitHub OAuth 対応', '認証後はホームへ遷移'],
      loginForm: {
        accountLabel: 'アカウント / メール',
        accountHint: 'ユーザー名',
        accountPlaceholder: 'アカウントまたはメールアドレスを入力',
        passwordLabel: 'パスワード',
        passwordHint: '秘密鍵',
        passwordPlaceholder: 'パスワードを入力',
        rememberMe: 'アカウントを記憶する',
        helperCaption: 'GitHub ログインならすぐにアクセスを復元できます。',
        submitIdle: 'ログイン',
        submitBusy: 'ログイン中...',
        divider: 'または',
        github: 'GitHub でログイン',
        switchLead: 'はじめてですか？',
        switchAction: '新規登録へ',
      },
      registerForm: {
        accountLabel: 'アカウント',
        accountHint: 'ID',
        accountPlaceholder: '使用するアカウント名を決める',
        nicknameLabel: 'ニックネーム',
        nicknameHint: '呼び名',
        nicknamePlaceholder: '表示する名前を入力',
        emailLabel: 'メール',
        emailHint: '連絡先',
        emailPlaceholder: 'you@example.com',
        passwordLabel: 'パスワード',
        passwordHint: '秘密鍵',
        passwordPlaceholder: '新しいパスワードを作成',
        confirmLabel: '確認用',
        confirmHint: '再入力',
        confirmPlaceholder: '同じパスワードをもう一度入力',
        submitIdle: '登録してホームへ',
        submitBusy: '登録中...',
        divider: 'または',
        github: 'GitHub で参加する',
        switchLead: 'すでにアカウントがありますか？',
        switchAction: 'ログインへ戻る',
      },
    },
    showcase: {
      title: '今夜のサインインに流すバンドを選んでください。',
      instructions:
        '束に触れると扇状に開き、カードの上で止まるとその一枚が前へ跳ね出て反転します。',
      tabsAriaLabel: 'アニメバンドの切り替え',
      spotlight: {
        defaultLabel: 'スポットライト',
        hoverLabel: 'ホバー表示',
      },
      facts: {
        bandSwitch: 'バンド切替',
        featuredNow: '現在の主役',
        queueMotion: 'キュー動作',
        fanOpen: '扇形オープン',
        stacked: '整列待機',
      },
      actions: {
        viewRolePage: 'キャラページを見る',
      },
      details: {
        role: '役割',
        status: '状態',
        pinned: '固定した主役',
        hoverPreview: 'ホバープレビュー',
      },
    },
    messages: {
      loginSuccess: 'ログインしました。ホームへ移動します。',
      loginFailure: 'ログインに失敗しました。しばらくしてからもう一度お試しください。',
      registerSuccess: '登録が完了しました。ホームへ移動します。',
      registerFailure: '登録に失敗しました。しばらくしてからもう一度お試しください。',
      passwordMismatch: '確認用パスワードが一致しません。',
    },
  },
  zh: {
    page: {
      documentTitle: '登录 / 注册',
      localeButtonLabel: '显示语言',
      localeButtonNextPrefix: '下一项',
    },
    panel: {
      kicker: 'Stage Access',
      titles: {
        login: '欢迎回来',
        register: '领取你的席位',
      },
      accents: {
        login: '登录',
        register: '注册',
      },
      subtitles: {
        login: '使用账号、邮箱或 GitHub，都可以直接进入首页。',
        register: '创建一个新账号后，会直接带着有效会话进入首页。',
      },
      tabsAriaLabel: '认证模式',
      tabs: {
        login: '登录',
        register: '创建账号',
      },
      helperTexts: {
        login: '登录会保留记住的账号、本地会话以及 GitHub 登录入口。',
        register: '注册成功后会立即建立会话，下一站就是首页。',
      },
      footnotes: ['JWT 会话本地保存', '支持 GitHub OAuth', '鉴权完成后跳转首页'],
      loginForm: {
        accountLabel: '账号 / 邮箱',
        accountHint: '用户名',
        accountPlaceholder: '输入你的账号或邮箱',
        passwordLabel: '密码',
        passwordHint: '密钥',
        passwordPlaceholder: '输入密码',
        rememberMe: '记住账号',
        helperCaption: '也可以直接通过 GitHub 快速恢复访问。',
        submitIdle: '登录',
        submitBusy: '登录中...',
        divider: '或者使用',
        github: 'GitHub 登录',
        switchLead: '第一次来？',
        switchAction: '创建账号',
      },
      registerForm: {
        accountLabel: '账号',
        accountHint: 'ID',
        accountPlaceholder: '选择一个账号名',
        nicknameLabel: '昵称',
        nicknameHint: '称呼',
        nicknamePlaceholder: '我们该怎么称呼你？',
        emailLabel: '邮箱',
        emailHint: '联系方式',
        emailPlaceholder: 'you@example.com',
        passwordLabel: '密码',
        passwordHint: '密钥',
        passwordPlaceholder: '创建一个密码',
        confirmLabel: '确认密码',
        confirmHint: '再次输入',
        confirmPlaceholder: '再次输入同一个密码',
        submitIdle: '注册并进入首页',
        submitBusy: '注册中...',
        divider: '或者使用',
        github: '使用 GitHub 加入',
        switchLead: '已经有账号了？',
        switchAction: '返回登录',
      },
    },
    showcase: {
      title: '选择今晚为登录页面配乐的乐队。',
      instructions: '鼠标移入卡列会展开成扇形，停在某张卡面上时，它会跳出队列并翻面展示。',
      tabsAriaLabel: '动画乐队切换',
      spotlight: {
        defaultLabel: '焦点卡',
        hoverLabel: '悬停展示',
      },
      facts: {
        bandSwitch: '乐队切换',
        featuredNow: '当前主角',
        queueMotion: '队列状态',
        fanOpen: '扇形展开',
        stacked: '整列待机',
      },
      actions: {
        viewRolePage: '查看角色页',
      },
      details: {
        role: '定位',
        status: '状态',
        pinned: '已固定为焦点',
        hoverPreview: '悬停预览',
      },
    },
    messages: {
      loginSuccess: '登录成功，正在前往首页。',
      loginFailure: '登录失败，请稍后再试。',
      registerSuccess: '注册成功，正在前往首页。',
      registerFailure: '注册失败，请稍后再试。',
      passwordMismatch: '两次输入的密码不一致。',
    },
  },
  en: {
    page: {
      documentTitle: 'Sign In / Register',
      localeButtonLabel: 'Language',
      localeButtonNextPrefix: 'Next',
    },
    panel: {
      kicker: 'Stage Access',
      titles: {
        login: 'Welcome Back',
        register: 'Claim Your Spot',
      },
      accents: {
        login: 'Sign In',
        register: 'Register',
      },
      subtitles: {
        login: 'Use your account, email, or GitHub access to jump straight into the home screen.',
        register:
          'Create a fresh account and head directly into the home screen with a live session.',
      },
      tabsAriaLabel: 'Authentication mode',
      tabs: {
        login: 'Sign In',
        register: 'Create Account',
      },
      helperTexts: {
        login:
          'Signing in keeps your remembered account, local session, and GitHub shortcut ready to go.',
        register: 'Registering creates the session immediately, so the next stop is home.',
      },
      footnotes: [
        'JWT session stored locally',
        'GitHub OAuth available',
        'Route guard redirects into home',
      ],
      loginForm: {
        accountLabel: 'Account / Email',
        accountHint: 'Username',
        accountPlaceholder: 'Enter your account or email',
        passwordLabel: 'Password',
        passwordHint: 'Secret',
        passwordPlaceholder: 'Enter your password',
        rememberMe: 'Remember account',
        helperCaption: 'GitHub can restore access instantly.',
        submitIdle: 'Sign In',
        submitBusy: 'Signing In...',
        divider: 'or continue with',
        github: 'GitHub Login',
        switchLead: 'New here?',
        switchAction: 'Create an account',
      },
      registerForm: {
        accountLabel: 'Account',
        accountHint: 'ID',
        accountPlaceholder: 'Choose an account',
        nicknameLabel: 'Nickname',
        nicknameHint: 'Display name',
        nicknamePlaceholder: 'How should we call you?',
        emailLabel: 'Email',
        emailHint: 'Contact',
        emailPlaceholder: 'you@example.com',
        passwordLabel: 'Password',
        passwordHint: 'Secret',
        passwordPlaceholder: 'Create a password',
        confirmLabel: 'Confirm',
        confirmHint: 'Repeat',
        confirmPlaceholder: 'Repeat the password',
        submitIdle: 'Register & Enter Home',
        submitBusy: 'Creating Account...',
        divider: 'or join with',
        github: 'Continue with GitHub',
        switchLead: 'Already have an account?',
        switchAction: 'Back to sign in',
      },
    },
    showcase: {
      title: "Choose the band that should soundtrack tonight's sign-in.",
      instructions:
        'Move into the stack to let it bloom into a fan, then rest on any card to make it vault forward and flip into a full reveal.',
      tabsAriaLabel: 'Music anime bands',
      spotlight: {
        defaultLabel: 'Spotlight',
        hoverLabel: 'Hover reveal',
      },
      facts: {
        bandSwitch: 'Band Switch',
        featuredNow: 'Featured Now',
        queueMotion: 'Queue Motion',
        fanOpen: 'Fan open',
        stacked: 'Stacked',
      },
      actions: {
        viewRolePage: 'View role page',
      },
      details: {
        role: 'Role',
        status: 'Status',
        pinned: 'Pinned spotlight',
        hoverPreview: 'Hover preview',
      },
    },
    messages: {
      loginSuccess: 'Signed in successfully. Redirecting to home.',
      loginFailure: 'Sign in failed. Please try again in a moment.',
      registerSuccess: 'Account created successfully. Redirecting to home.',
      registerFailure: 'Registration failed. Please try again in a moment.',
      passwordMismatch: 'The two passwords do not match.',
    },
  },
}
