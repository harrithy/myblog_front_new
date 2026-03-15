export interface MeProfile {
  name: string
  role: string
  headline: string
  intro: string
  location: string
  email: string
  availability: string
  status: string
}

export interface MeSignal {
  label: string
  value: string
}

export interface MeQuickFact {
  label: string
  value: string
  description: string
}

export interface MeSocialLink {
  label: string
  caption: string
  href: string
}

export interface MePrinciple {
  title: string
  description: string
}

export interface MeSkillGroup {
  title: string
  description: string
  items: string[]
}

export interface MeHobby {
  title: string
  caption: string
}

export interface MeTimelineItem {
  period: string
  role: string
  organization: string
  summary: string
  highlights: string[]
}

export interface MeProjectItem {
  name: string
  category: string
  year: string
  summary: string
  outcome: string
  stack: string[]
  link?: string
}

export const meProfile: MeProfile = {
  name: 'Harrio',
  role: '全栈开发者 / 前端工程师',
  headline: '把代码、内容与体验编排成有温度的产品界面。',
  intro:
    '我是一名偏前端的全栈开发者，喜欢把复杂系统做得清晰，把页面做得有气质，也在持续把 AI 工作流接进真实项目与个人创作里。',
  location: '中国 · 可远程协作',
  email: '2656450899@qq.com',
  availability: '欢迎全职机会、远程合作和有长期价值的 side project。',
  status: '最近在升级个人博客，顺手把创作、写作和 Agent 自动化整合到同一套工作流里。',
}

export const meSignals: MeSignal[] = [
  { label: '在做', value: '博客 3.0 / 作品体系整理' },
  { label: '在学', value: 'AI Agent、自动化内容流' },
  { label: '最近听', value: 'City Pop / 游戏 OST / Synthwave' },
  { label: '合作偏好', value: '产品型团队、内容产品、个人品牌项目' },
]

export const meSocialLinks: MeSocialLink[] = [
  {
    label: 'GitHub',
    caption: '代码仓库、实验项目和持续更新',
    href: 'https://github.com/harrithy',
  },
  {
    label: 'Bilibili',
    caption: '一些生活切片和更轻松的表达',
    href: 'https://space.bilibili.com/209674243',
  },
  {
    label: 'Email',
    caption: '项目合作、沟通交流和一切认真的邀请',
    href: 'mailto:2656450899@qq.com',
  },
]

export const meAboutParagraphs = [
  '我喜欢站在“产品体验”和“工程实现”的交界处工作。既能往里钻，拆结构、抠细节、做抽象；也能往外看，思考页面的气质、信息层次和用户第一次看到它时的感受。',
  '过去几年里，我一直在做前端和全栈相关的实践，从组件设计、页面开发，到接口联调、部署与协作流程，我更偏爱那种能从 0 到 1 一路参与、持续雕刻的项目。',
  '比起把功能堆满，我更想做出有节奏的界面、有态度的内容和可持续演进的代码。对我来说，好的产品不只是能用，还应该让人愿意停留。',
]

export const mePrinciples: MePrinciple[] = [
  {
    title: '先把信息讲清楚',
    description: '视觉可以有锋芒，但结构必须克制。页面应该先让人读懂，再让人记住。',
  },
  {
    title: '体验和工程是同一件事',
    description: '交互的顺滑、代码的可维护性、后续扩展成本，本质上都属于产品质量。',
  },
  {
    title: '持续迭代比一次做满更重要',
    description: '我喜欢保留生长空间，让设计、内容和技术方案都能跟着项目一起升级。',
  },
]

export const meSkillGroups: MeSkillGroup[] = [
  {
    title: 'Frontend Systems',
    description: '负责表达、节奏与交互的那一层。',
    items: ['Vue 3', 'TypeScript', 'Vite', 'SCSS', 'React'],
  },
  {
    title: 'Full-stack Delivery',
    description: '把产品真正推到可交付状态。',
    items: ['Node.js', 'Python', 'REST API', 'Docker', 'Git'],
  },
  {
    title: 'Creative Workflow',
    description: '让内容生产和开发效率一起提升。',
    items: ['UI 叙事', '组件抽象', '性能优化', 'AI Workflow', '内容系统'],
  },
]

export const meHobbies: MeHobby[] = [
  { title: '音乐', caption: '用耳机切换工作状态，也用旋律整理情绪。' },
  { title: '动漫 / 游戏', caption: '长期的审美和叙事来源，很多灵感其实来自这里。' },
  { title: '阅读', caption: '偏爱技术写作、人物访谈和有观点的内容。' },
  { title: '跑步 / 散步', caption: '清理脑内缓存，给新想法留出空间。' },
]

export const meTimeline: MeTimelineItem[] = [
  {
    period: '2023 - 现在',
    role: '前端 / 全栈开发工程师',
    organization: '科技团队',
    summary: '围绕业务产品负责核心页面开发、交互落地与前后端协作交付。',
    highlights: ['Vue 3 + TypeScript', '复杂页面拆分与重构', '从需求到上线的完整链路'],
  },
  {
    period: '2022 - 2023',
    role: '全栈开发实习',
    organization: '互联网项目组',
    summary: '参与多个业务模块开发，逐步建立起从页面到接口、从协作到部署的整体认知。',
    highlights: ['接口联调', '项目工程化', '多人协作流程'],
  },
  {
    period: '2019 - 2023',
    role: '计算机相关专业学习阶段',
    organization: '本科阶段',
    summary: '系统学习计算机基础，也开始把个人兴趣慢慢转化成真实项目。',
    highlights: ['数据结构 / 网络基础', '校内项目实践', '确定前端与创作方向'],
  },
]

export const meProjects: MeProjectItem[] = [
  {
    name: '个人博客系统',
    category: 'Content Platform',
    year: '进行中',
    summary:
      '围绕内容发布、阅读体验和个人表达搭建的长期作品，目标是把博客做成一个能持续进化的“个人产品”。',
    outcome: '覆盖文章展示、内容组织与后续创作能力扩展。',
    stack: ['Vue 3', 'Node.js', 'Markdown', 'MongoDB'],
    link: 'https://github.com/harrithy',
  },
  {
    name: '任务协作应用',
    category: 'Productivity',
    year: '概念迭代',
    summary: '一个强调信息清晰度和执行节奏的任务管理工具，关注个人与小团队协作中的“轻量但不简陋”。',
    outcome: '完成主要信息架构和核心交互打磨。',
    stack: ['React', 'TypeScript', 'Firebase'],
  },
  {
    name: 'AI 图像工具实验',
    category: 'AI Tooling',
    year: '实验方向',
    summary:
      '围绕生成式能力、工作流串联和可用性设计做的一组 AI 工具尝试，不只关注模型，也关注普通人如何真正用起来。',
    outcome: '验证了多模型串接与服务化输出的实现路径。',
    stack: ['Python', 'FastAPI', 'Stable Diffusion'],
  },
]
