import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const useMePageMotion = () => {
  const pageRef = useTemplateRef<HTMLElement>('page')

  let revealObserver: IntersectionObserver | null = null
  const cleanupFns: Array<() => void> = []

  onMounted(() => {
    const page = pageRef.value

    if (!page) {
      return
    }

    const prefersCoarsePointer = window.matchMedia('(pointer: coarse)').matches

    const setScrollProgress = () => {
      const scrollableHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      )
      const progress = clamp(window.scrollY / scrollableHeight, 0, 1)
      page.style.setProperty('--scroll-progress', progress.toFixed(3))
    }

    const revealElements = Array.from(page.querySelectorAll<HTMLElement>('[data-reveal]'))

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          entry.target.classList.add('is-visible')
          revealObserver?.unobserve(entry.target)
        })
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    revealElements.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index * 90, 540)}ms`)
      revealObserver?.observe(element)
    })

    const motionCards = Array.from(page.querySelectorAll<HTMLElement>('[data-motion-card]'))

    motionCards.forEach((card) => {
      const resetCard = () => {
        card.style.setProperty('--motion-rotate-x', '0deg')
        card.style.setProperty('--motion-rotate-y', '0deg')
        card.style.setProperty('--motion-pointer-x', '50%')
        card.style.setProperty('--motion-pointer-y', '50%')
        card.classList.remove('is-tilting')
      }

      const handlePointerMove = (event: PointerEvent) => {
        if (prefersCoarsePointer) {
          return
        }

        const rect = card.getBoundingClientRect()
        const pointerX = clamp((event.clientX - rect.left) / rect.width, 0, 1)
        const pointerY = clamp((event.clientY - rect.top) / rect.height, 0, 1)
        const rotateY = (pointerX - 0.5) * 10
        const rotateX = (0.5 - pointerY) * 10

        card.style.setProperty('--motion-rotate-x', `${rotateX.toFixed(2)}deg`)
        card.style.setProperty('--motion-rotate-y', `${rotateY.toFixed(2)}deg`)
        card.style.setProperty('--motion-pointer-x', `${(pointerX * 100).toFixed(2)}%`)
        card.style.setProperty('--motion-pointer-y', `${(pointerY * 100).toFixed(2)}%`)
        card.classList.add('is-tilting')
      }

      card.addEventListener('pointermove', handlePointerMove)
      card.addEventListener('pointerleave', resetCard)

      cleanupFns.push(() => {
        card.removeEventListener('pointermove', handlePointerMove)
        card.removeEventListener('pointerleave', resetCard)
        resetCard()
      })
    })

    window.addEventListener('scroll', setScrollProgress, { passive: true })

    cleanupFns.push(() => {
      window.removeEventListener('scroll', setScrollProgress)
    })

    setScrollProgress()
  })

  onBeforeUnmount(() => {
    revealObserver?.disconnect()
    cleanupFns.splice(0).forEach((cleanup) => cleanup())
  })

  return {
    pageRef,
  }
}
