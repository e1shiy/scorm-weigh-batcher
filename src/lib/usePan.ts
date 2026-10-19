import { useCallback, useRef, type RefObject } from 'react'

const DRAG_THRESHOLD = 4

export const usePan = (containerRef: RefObject<HTMLDivElement | null>) => {
  const isDraggingRef = useRef(false)
  const didDragRef = useRef(false)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const startScrollLeftRef = useRef(0)
  const startScrollTopRef = useRef(0)

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return

      const container = containerRef.current
      if (!container) return

      isDraggingRef.current = true
      didDragRef.current = false
      startXRef.current = e.clientX
      startYRef.current = e.clientY
      startScrollLeftRef.current = container.scrollLeft
      startScrollTopRef.current = container.scrollTop

      container.style.cursor = 'grabbing'
    },
    [containerRef]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return
      const container = containerRef.current
      if (!container) return

      const deltaX = e.clientX - startXRef.current
      const deltaY = e.clientY - startYRef.current

      if (!didDragRef.current) {
        if (Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD) return

        didDragRef.current = true
        container.setPointerCapture(e.pointerId)
      }

      let newScrollLeft = startScrollLeftRef.current - deltaX
      let newScrollTop = startScrollTopRef.current - deltaY

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
      isDraggingRef.current = false
      const container = containerRef.current
      if (!container) return
      container.removeAttribute('style')
      if (container.hasPointerCapture(e.pointerId)) {
        container.releasePointerCapture(e.pointerId)
      }
    },
    [containerRef]
  )

  return { handlePointerDown, handlePointerMove, handlePointerUp, didDragRef }
}
