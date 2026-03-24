import type { AuthShowcaseBand, LoginLocale } from './types'

const asset = (fileName: string) => `/auth-showcase/${fileName}`

interface BaseCharacterData {
  id: string
  accent: string
  image: string
  href: string
}

interface BaseBandData {
  id: string
  accent: string
  sourceHref: string
  featuredId: string
  characters: BaseCharacterData[]
}

interface LocalizedCharacterCopy {
  name: string
  fullName: string
  role: string
}

interface LocalizedBandCopy {
  label: string
  eyebrow: string
  description: string
  sourceLabel: string
  characters: Record<string, LocalizedCharacterCopy>
}

const baseBands: BaseBandData[] = [
  {
    id: 'kon',
    accent: '#d06d38',
    sourceHref: 'https://www.tbs.co.jp/anime/k-on/k-on_tv/chara/chara.html',
    featuredId: 'yui',
    characters: [
      {
        id: 'mio',
        accent: '#5677c5',
        image: asset('k-on_mio.gif'),
        href: 'https://www.tbs.co.jp/anime/k-on/k-on_tv/chara/chara02.html',
      },
      {
        id: 'azusa',
        accent: '#f4c85c',
        image: asset('k-on_azusa.gif'),
        href: 'https://www.tbs.co.jp/anime/k-on/k-on_tv/chara/chara08.html',
      },
      {
        id: 'yui',
        accent: '#f79d6a',
        image: asset('k-on_yui.gif'),
        href: 'https://www.tbs.co.jp/anime/k-on/k-on_tv/chara/chara01.html',
      },
      {
        id: 'ritsu',
        accent: '#ef8f3e',
        image: asset('k-on_ritsu.gif'),
        href: 'https://www.tbs.co.jp/anime/k-on/k-on_tv/chara/chara03.html',
      },
      {
        id: 'mugi',
        accent: '#d5bf67',
        image: asset('k-on_tsumugi.gif'),
        href: 'https://www.tbs.co.jp/anime/k-on/k-on_tv/chara/chara04.html',
      },
    ],
  },
  {
    id: 'bocchi',
    accent: '#ea4aa6',
    sourceHref: 'https://bocchi.rocks/omnibus/character/',
    featuredId: 'hitori',
    characters: [
      {
        id: 'nijika',
        accent: '#ffd454',
        image: asset('bocchi_nijika.png'),
        href: 'https://bocchi.rocks/omnibus/character/nijika.html',
      },
      {
        id: 'ryo',
        accent: '#8cc6ff',
        image: asset('bocchi_ryo.png'),
        href: 'https://bocchi.rocks/omnibus/character/ryo.html',
      },
      {
        id: 'hitori',
        accent: '#ff96cf',
        image: asset('bocchi_hitori.png'),
        href: 'https://bocchi.rocks/omnibus/character/',
      },
      {
        id: 'ikuyo',
        accent: '#ff7d82',
        image: asset('bocchi_ikuyo.png'),
        href: 'https://bocchi.rocks/omnibus/character/ikuyo.html',
      },
    ],
  },
  {
    id: 'gbc',
    accent: '#b14f5d',
    sourceHref: 'https://girls-band-cry.com/character/',
    featuredId: 'nina',
    characters: [
      {
        id: 'momoka',
        accent: '#e3b69b',
        image: asset('gbc_momoka.webp'),
        href: 'https://girls-band-cry.com/character/momoka/',
      },
      {
        id: 'subaru',
        accent: '#8e8399',
        image: asset('gbc_subaru.webp'),
        href: 'https://girls-band-cry.com/character/subaru/',
      },
      {
        id: 'nina',
        accent: '#7a92d7',
        image: asset('gbc_nina.webp'),
        href: 'https://girls-band-cry.com/character/nina/',
      },
      {
        id: 'tomo',
        accent: '#cf6f76',
        image: asset('gbc_tomo.webp'),
        href: 'https://girls-band-cry.com/character/tomo/',
      },
      {
        id: 'rupa',
        accent: '#8f9a67',
        image: asset('gbc_rupa.webp'),
        href: 'https://girls-band-cry.com/character/rupa/',
      },
    ],
  },
  {
    id: 'mygo',
    accent: '#4d76d9',
    sourceHref: 'https://mygo-movie.bang-dream.com/character/',
    featuredId: 'tomori',
    characters: [
      {
        id: 'anon',
        accent: '#ff98c0',
        image: asset('mygo_anon.png'),
        href: 'https://mygo-movie.bang-dream.com/character/anon/',
      },
      {
        id: 'soyo',
        accent: '#c48f7c',
        image: asset('mygo_soyo.png'),
        href: 'https://mygo-movie.bang-dream.com/character/soyo/',
      },
      {
        id: 'tomori',
        accent: '#89d2ff',
        image: asset('mygo_tomori.webp'),
        href: 'https://mygo-movie.bang-dream.com/character/tomori/',
      },
      {
        id: 'taki',
        accent: '#ffb285',
        image: asset('mygo_taki.png'),
        href: 'https://mygo-movie.bang-dream.com/character/taki/',
      },
      {
        id: 'rana',
        accent: '#c9d4ff',
        image: asset('mygo_rana.png'),
        href: 'https://mygo-movie.bang-dream.com/character/rana/',
      },
    ],
  },
]

const localizedBandCopy: Record<LoginLocale, Record<string, LocalizedBandCopy>> = {
  ja: {
    kon: {
      label: 'けいおん!',
      eyebrow: '放課後ティータイム',
      description:
        '部室のやわらかな光と放課後の余韻が、サインイン前の空気を小さなリハーサルに変えてくれます。',
      sourceLabel: 'TBS キャラクターアーカイブ',
      characters: {
        mio: { name: '澪', fullName: '秋山 澪', role: 'ベースの鼓動' },
        azusa: { name: '梓', fullName: '中野 梓', role: 'リズムの火花' },
        yui: { name: '唯', fullName: '平沢 唯', role: '主旋律' },
        ritsu: { name: '律', fullName: '田井中 律', role: 'ドラムの突撃' },
        mugi: { name: '紬', fullName: '琴吹 紬', role: '鍵盤の花' },
      },
    },
    bocchi: {
      label: 'ぼっち・ざ・ろっく！',
      eyebrow: 'シェルターのフィードバック',
      description:
        'ライブハウスの空気、ぎこちない緊張、そしてエンターを押すための少しの勇気がここに重なります。',
      sourceLabel: 'Omnibus キャラクターアーカイブ',
      characters: {
        nijika: { name: '虹夏', fullName: '伊地知 虹夏', role: 'ビートの始動' },
        ryo: { name: 'リョウ', fullName: '山田 リョウ', role: 'クールな低音' },
        hitori: { name: 'ぼっち', fullName: '後藤 ひとり', role: 'リードのノイズ' },
        ikuyo: { name: '喜多', fullName: '喜多 郁代', role: 'ボーカルの閃光' },
      },
    },
    gbc: {
      label: 'ガールズバンドクライ',
      eyebrow: '真夜中のコンクリート・コーラス',
      description: '荒れた夜景と刺さる歌声が、静かなログイン画面に少しだけ反抗的な熱を残します。',
      sourceLabel: '公式キャラクターページ',
      characters: {
        momoka: { name: '桃香', fullName: '河原木 桃香', role: 'ギターの残り火' },
        subaru: { name: 'すばる', fullName: '安和 すばる', role: 'ドラムの切れ味' },
        nina: { name: '仁菜', fullName: '井芹 仁菜', role: 'ボーカルの切っ先' },
        tomo: { name: '智', fullName: '海老塚 智', role: '鍵盤の静電気' },
        rupa: { name: 'ルパ', fullName: 'ルパ', role: 'ベースの漂い' },
      },
    },
    mygo: {
      label: 'MyGO!!!!!',
      eyebrow: '雨光のリハーサル',
      description:
        '雨に濡れた校舎の気配と解け切らない感情が、サインインの直前にかすかな勇気を差し込みます。',
      sourceLabel: '劇場版キャラクターアーカイブ',
      characters: {
        anon: { name: '愛音', fullName: '千早 愛音', role: 'ギターのきらめき' },
        soyo: { name: 'そよ', fullName: '長崎 そよ', role: '和声のベール' },
        tomori: { name: '灯', fullName: '高松 灯', role: 'ボーカルの残響' },
        taki: { name: '立希', fullName: '椎名 立希', role: 'ドラムの一撃' },
        rana: { name: '楽奈', fullName: '要 楽奈', role: 'リードの気まぐれ' },
      },
    },
  },
  zh: {
    kon: {
      label: '轻音少女',
      eyebrow: '放学后 Tea Time',
      description:
        '温暖的社团教室、轻轻散开的茶点气息，还有放学后的余晖，把登录前的片刻变成一场小小排练。',
      sourceLabel: 'TBS 角色档案',
      characters: {
        mio: { name: '澪', fullName: '秋山 澪', role: '贝斯脉冲' },
        azusa: { name: '梓', fullName: '中野 梓', role: '节奏火花' },
        yui: { name: '唯', fullName: '平泽 唯', role: '主旋律' },
        ritsu: { name: '律', fullName: '田井中 律', role: '鼓点冲锋' },
        mugi: { name: '紬', fullName: '琴吹 紬', role: '键盘绽放' },
      },
    },
    bocchi: {
      label: '孤独摇滚！',
      eyebrow: 'Shelter 反馈回路',
      description:
        'Live house 的薄雾、紧张到发僵的神经，以及按下 Enter 前那一点点勇气，在这里慢慢展开。',
      sourceLabel: 'Omnibus 角色档案',
      characters: {
        nijika: { name: '虹夏', fullName: '伊地知 虹夏', role: '节拍起动' },
        ryo: { name: '凉', fullName: '山田 凉', role: '冷感贝斯' },
        hitori: { name: '波奇', fullName: '后藤 一里', role: '主音故障' },
        ikuyo: { name: '喜多', fullName: '喜多 郁代', role: '主唱闪光' },
      },
    },
    gbc: {
      label: '少女乐队的呐喊',
      eyebrow: '午夜混凝土合唱',
      description: '更粗粝的城市夜色、更锋利的轮廓和受伤的歌声，让登录页也带上一点不愿沉默的倔强。',
      sourceLabel: '官方角色页',
      characters: {
        momoka: { name: '桃香', fullName: '河原木 桃香', role: '吉他余烬' },
        subaru: { name: '昴', fullName: '安和 昴', role: '鼓点利刃' },
        nina: { name: '仁菜', fullName: '井芹 仁菜', role: '主唱锋芒' },
        tomo: { name: '智', fullName: '海老冢 智', role: '键盘静电' },
        rupa: { name: '露帕', fullName: '露帕', role: '贝斯漂流' },
      },
    },
    mygo: {
      label: 'MyGO!!!!!',
      eyebrow: '雨光排练',
      description:
        '被雨打湿的走廊、尚未和解的情绪，还有副歌开始前那点脆弱又真实的勇气，都压进了这一幕里。',
      sourceLabel: '剧场版角色档案',
      characters: {
        anon: { name: '爱音', fullName: '千早 爱音', role: '吉他微光' },
        soyo: { name: '素世', fullName: '长崎 素世', role: '和声薄幕' },
        tomori: { name: '灯', fullName: '高松 灯', role: '主唱回响' },
        taki: { name: '立希', fullName: '椎名 立希', role: '鼓点斩击' },
        rana: { name: '乐奈', fullName: '要 乐奈', role: '主音变奏' },
      },
    },
  },
  en: {
    kon: {
      label: 'K-ON!',
      eyebrow: 'After School Tea Time',
      description:
        'Warm clubroom light, soft tea-break energy, and an after-school glow turn sign-in into a quiet rehearsal call.',
      sourceLabel: 'TBS character archive',
      characters: {
        mio: { name: 'Mio', fullName: 'Mio Akiyama', role: 'Bass pulse' },
        azusa: { name: 'Azusa', fullName: 'Azusa Nakano', role: 'Rhythm spark' },
        yui: { name: 'Yui', fullName: 'Yui Hirasawa', role: 'Lead melody' },
        ritsu: { name: 'Ritsu', fullName: 'Ritsu Tainaka', role: 'Drum charge' },
        mugi: { name: 'Mugi', fullName: 'Tsumugi Kotobuki', role: 'Key bloom' },
      },
    },
    bocchi: {
      label: 'Bocchi the Rock!',
      eyebrow: 'Shelter Feedback Loop',
      description:
        'A live-house haze, awkward nerves, and just enough courage to hit enter settle into the stack.',
      sourceLabel: 'Omnibus character archive',
      characters: {
        nijika: { name: 'Nijika', fullName: 'Nijika Ijichi', role: 'Beat launch' },
        ryo: { name: 'Ryo', fullName: 'Ryo Yamada', role: 'Bass cool' },
        hitori: { name: 'Bocchi', fullName: 'Hitori Gotoh', role: 'Lead glitch' },
        ikuyo: { name: 'Kita', fullName: 'Ikuyo Kita', role: 'Vocal flare' },
      },
    },
    gbc: {
      label: 'Girls Band Cry',
      eyebrow: 'Midnight Concrete Chorus',
      description:
        'Sharper city-night silhouettes, wounded vocals, and stubborn energy keep the login mood from staying quiet.',
      sourceLabel: 'Official TV anime character page',
      characters: {
        momoka: { name: 'Momoka', fullName: 'Momoka Kawaragi', role: 'Guitar ember' },
        subaru: { name: 'Subaru', fullName: 'Subaru Awa', role: 'Drum snap' },
        nina: { name: 'Nina', fullName: 'Nina Iseri', role: 'Vocal cut' },
        tomo: { name: 'Tomo', fullName: 'Tomo Ebizuka', role: 'Key static' },
        rupa: { name: 'Rupa', fullName: 'Rupa', role: 'Bass drift' },
      },
    },
    mygo: {
      label: 'MyGO!!!!!',
      eyebrow: 'Rainlight Rehearsal',
      description:
        'Rain-soaked corridors, unresolved harmony, and fragile courage gather right before the chorus opens.',
      sourceLabel: 'Movie character archive',
      characters: {
        anon: { name: 'Anon', fullName: 'Anon Chihaya', role: 'Guitar gleam' },
        soyo: { name: 'Soyo', fullName: 'Soyo Nagasaki', role: 'Harmony veil' },
        tomori: { name: 'Tomori', fullName: 'Tomori Takamatsu', role: 'Vocal echo' },
        taki: { name: 'Taki', fullName: 'Taki Shiina', role: 'Drum strike' },
        rana: { name: 'Rana', fullName: 'Rana Kaname', role: 'Lead wildcard' },
      },
    },
  },
}

export const getAuthShowcaseBands = (locale: LoginLocale): AuthShowcaseBand[] => {
  const copyByBand = localizedBandCopy[locale]
  const fallbackCopyByBand = localizedBandCopy.en

  return baseBands.map((band) => {
    const bandCopy = copyByBand[band.id] ?? fallbackCopyByBand[band.id]

    return {
      id: band.id,
      label: bandCopy.label,
      eyebrow: bandCopy.eyebrow,
      description: bandCopy.description,
      accent: band.accent,
      sourceLabel: bandCopy.sourceLabel,
      sourceHref: band.sourceHref,
      featuredId: band.featuredId,
      characters: band.characters.map((character) => {
        const characterCopy =
          bandCopy.characters[character.id] ?? fallbackCopyByBand[band.id].characters[character.id]

        return {
          id: character.id,
          name: characterCopy.name,
          fullName: characterCopy.fullName,
          role: characterCopy.role,
          accent: character.accent,
          image: character.image,
          href: character.href,
        }
      }),
    }
  })
}
