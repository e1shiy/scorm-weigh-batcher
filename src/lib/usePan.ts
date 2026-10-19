import { useCallback, useEffect, useRef, type RefObject } from 'react'

const DRAG_THRESHOLD = 4

export const usePan = (containerRef: RefObject<HTMLDivElement | null>) => {
  const isDraggingRef = useRef(false)
  const didDragRef = useRef(false)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const lastXRef = useRef(0)
  const lastYRef = useRef(0)

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return

      const container = containerRef.current
      if (!container) return

      isDraggingRef.current = true
      didDragRef.current = false
      startXRef.current = e.clientX
      startYRef.current = e.clientY
      lastXRef.current = e.clientX
      lastYRef.current = e.clientY

      container.classList.add('cursor-grabbing')
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

      // Сдвигаем прокрутку на шаг, а не пересчитываем от точки нажатия:
      // так пан складывается с внешними изменениями прокрутки (зумом), а не затирает их
      const stepX = e.clientX - lastXRef.current
      const stepY = e.clientY - lastYRef.current
      lastXRef.current = e.clientX
      lastYRef.current = e.clientY

      let newScrollLeft = container.scrollLeft - stepX
      let newScrollTop = container.scrollTop - stepY

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
      container.classList.remove('cursor-grabbing')
      if (container.hasPointerCapture(e.pointerId)) {
        container.releasePointerCapture(e.pointerId)
      }
    },
    [containerRef]
  )

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent) => {
      didDragRef.current = false
      handlePointerUp(e)
    },
    [handlePointerUp]
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleClick = (e: MouseEvent) => {
      if (!didDragRef.current) return

      e.preventDefault()
      e.stopPropagation()
      didDragRef.current = false
    }

    container.addEventListener('click', handleClick, true)
    return () => container.removeEventListener('click', handleClick, true)
  }, [containerRef])

  return { handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel }
}
