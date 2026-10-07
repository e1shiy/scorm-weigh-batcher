import { useEffect, useState, type RefObject } from 'react'

export const useScrollEdges = (ref: RefObject<HTMLElement | null>) => {
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)
  const [hasScroll, setHasScroll] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let scheduled = false
    const check = () => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(() => {
        scheduled = false

        const { scrollWidth, scrollLeft, clientWidth } = el
        const scrollLength = scrollWidth - clientWidth

        setHasScroll(scrollWidth > clientWidth)
        setIsAtStart(scrollLeft <= 1)
        setIsAtEnd(scrollLeft >= scrollLength - 1)
      })
    }

    check()

    const ro = new ResizeObserver(check)
    ro.observe(el)
    el.addEventListener('scroll', check, { passive: true })

    return () => {
      el.removeEventListener('scroll', check)
      ro.disconnect()
    }
  }, [ref])

  return { hasScroll, isAtStart, isAtEnd }
}
