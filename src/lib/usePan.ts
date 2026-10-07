import { useCallback, useRef, type RefObject } from 'react'

export const usePan = (containerRef: RefObject<HTMLDivElement | null>) => {
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const startScrollLeft = useRef(0)
  const startScrollTop = useRef(0)

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('button, input, select, a')) return

      const container = containerRef.current
      if (!container) return

      isDragging.current = true
      startX.current = e.clientX
      startY.current = e.clientY
      startScrollLeft.current = container.scrollLeft
      startScrollTop.current = container.scrollTop

      container.style.cursor = 'grabbing'
      container.setPointerCapture(e.pointerId)
    },
    [containerRef]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return
      const container = containerRef.current
      if (!container) return

      const deltaX = e.clientX - startX.current
      const deltaY = e.clientY - startY.current

      let newScrollLeft = startScrollLeft.current - deltaX
      let newScrollTop = startScrollTop.current - deltaY

      const maxScrollLeft = container.scrollWidth - container.clientWidth
      const maxScrollTop = container.scrollHeight - container.clientHeight

      newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft))
      newScrollTop = Math.max(0, Math.min(newScrollTop, maxScrollTop))

      container.scrollLeft = newScrollLeft
      container.scrollTop = newScrollTop
    },
    [containerRef]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = false
      const container = containerRef.current
      if (!container) return
      container.removeAttribute('style')
      container.releasePointerCapture(e.pointerId)
    },
    [containerRef]
  )

  return { handlePointerDown, handlePointerMove, handlePointerUp }
}
