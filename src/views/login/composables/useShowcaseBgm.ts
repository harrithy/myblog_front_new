import { computed, onBeforeUnmount, shallowRef } from 'vue'
import type { AuthShowcaseBandId } from '../types'

interface ShowcaseBgmTrack {
  title: string
  src: string
}

interface UseShowcaseBgmOptions {
  volume?: number
}

const DEFAULT_BGM_VOLUME = 0.42

export const loginShowcaseBgmTracks: Record<AuthShowcaseBandId, ShowcaseBgmTrack> = {
  kon: {
    title: 'K-ON! - Fuwa Fuwa Time',
    src: '/auth-showcase-bgm/kon-fuwa-fuwa-time.mp3',
  },
  bocchi: {
    title: 'Kessoku Band - Seishun Complex',
    src: '/auth-showcase-bgm/bocchi-seishun-complex.mp3',
  },
  gbc: {
    title: 'Togenashi Togeari - Zattou, Bokura no Machi',
    src: '/auth-showcase-bgm/gbc-zattou-bokura-no-machi.mp3',
  },
  mygo: {
    title: 'MyGO!!!!! - Meisei Kyo',
    src: '/auth-showcase-bgm/mygo-meisei-kyo.mp3',
  },
}

export const useShowcaseBgm = (options: UseShowcaseBgmOptions = {}) => {
  const volume = options.volume ?? DEFAULT_BGM_VOLUME
  const activeBandId = shallowRef<AuthShowcaseBandId | null>(null)
  const activeTrack = computed(() =>
    activeBandId.value ? loginShowcaseBgmTracks[activeBandId.value] : null,
  )
  const audioRef = shallowRef<HTMLAudioElement | null>(null)

  let unlockHandler: (() => void) | null = null

  const removeUnlockListeners = () => {
    if (!unlockHandler || typeof window === 'undefined') {
      return
    }

    window.removeEventListener('pointerdown', unlockHandler)
    window.removeEventListener('keydown', unlockHandler)
    window.removeEventListener('touchstart', unlockHandler)
    unlockHandler = null
  }

  const getOrCreateAudio = () => {
    if (typeof document === 'undefined') {
      return null
    }

    if (audioRef.value) {
      return audioRef.value
    }

    const audio = document.createElement('audio')
    audio.autoplay = true
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = volume
    audio.setAttribute('playsinline', 'true')
    audio.setAttribute('webkit-playsinline', 'true')
    audio.style.display = 'none'
    audio.setAttribute('aria-hidden', 'true')
    document.body.appendChild(audio)
    audioRef.value = audio

    return audio
  }

  const prepareTrack = (bandId: AuthShowcaseBandId) => {
    activeBandId.value = bandId

    const audio = getOrCreateAudio()
    if (!audio) {
      return null
    }

    const nextTrack = loginShowcaseBgmTracks[bandId]
    if (audio.dataset.trackSrc !== nextTrack.src) {
      audio.src = nextTrack.src
      audio.dataset.trackSrc = nextTrack.src
      audio.load()
    }

    audio.volume = volume
    return audio
  }

  const setupUnlockOnFirstInteraction = () => {
    if (unlockHandler || typeof window === 'undefined') {
      return
    }

    unlockHandler = () => {
      const bandId = activeBandId.value
      if (!bandId) {
        removeUnlockListeners()
        return
      }

      void playTrack(bandId).then((played) => {
        if (played) {
          removeUnlockListeners()
        }
      })
    }

    window.addEventListener('pointerdown', unlockHandler, { passive: true })
    window.addEventListener('keydown', unlockHandler)
    window.addEventListener('touchstart', unlockHandler, { passive: true })
  }

  const attemptPlay = async (audio: HTMLAudioElement, allowMutedFallback: boolean) => {
    audio.muted = false
    audio.volume = volume

    try {
      await audio.play()
      removeUnlockListeners()
      return true
    } catch {
      if (!allowMutedFallback) {
        setupUnlockOnFirstInteraction()
        return false
      }

      try {
        audio.muted = true
        audio.volume = 0
        await audio.play()
        audio.muted = false
        audio.volume = volume
        removeUnlockListeners()
        return true
      } catch {
        setupUnlockOnFirstInteraction()
        return false
      }
    }
  }

  const playTrack = async (bandId: AuthShowcaseBandId, allowMutedFallback = false) => {
    const audio = prepareTrack(bandId)
    if (!audio) {
      return false
    }

    return attemptPlay(audio, allowMutedFallback)
  }

  const autoplayTrack = (bandId: AuthShowcaseBandId) => playTrack(bandId, true)

  const stop = () => {
    audioRef.value?.pause()
  }

  onBeforeUnmount(() => {
    removeUnlockListeners()
    stop()

    if (audioRef.value?.parentNode) {
      audioRef.value.parentNode.removeChild(audioRef.value)
    }

    audioRef.value = null
  })

  return {
    activeTrack,
    autoplayTrack,
    playTrack,
    stop,
  }
}
