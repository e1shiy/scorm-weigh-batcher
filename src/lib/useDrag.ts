import { useEffect, useRef, type PointerEvent as ReactPointerEvent, type PointerEventHandler } from 'react'

export type DragHandleProps = {
  onPointerDown: PointerEventHandler<HTMLElement>
}

interface UseDragOptions {
  /** Вызывается на pointerdown; false — перетаскивание не начинается */
  onStart: (event: ReactPointerEvent<HTMLElement>) => boolean
  /** Сдвиг курсора от точки нажатия в экранных пикселях */
  onMove: (deltaX: number, deltaY: number) => void
}

export const useDrag = ({ onStart, onMove }: UseDragOptions): DragHandleProps => {
  const onMoveRef = useRef(onMove)
  const stopRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    onMoveRef.current = onMove
  })

  useEffect(() => () => stopRef.current?.(), [])

  const onPointerDown: PointerEventHandler<HTMLElement> = event => {
    if (!onStart(event)) return

    const startX = event.clientX
    const startY = event.clientY

    const handleMove = (moveEvent: PointerEvent) => onMoveRef.current(moveEvent.clientX - startX, moveEvent.clientY - startY)
    const stop = () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
      stopRef.current = null
    }

    stopRef.current?.()
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    stopRef.current = stop
  }

  return { onPointerDown }
}
