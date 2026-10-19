import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePan } from '../lib/usePan'
import { Button } from '../ui/components/Button'
import ScaleUpIcon from '../assets/icons/scale-up.svg?react'
import ScaleDownIcon from '../assets/icons/scale-down.svg?react'
import ScaleResetIcon from '../assets/icons/scale-reset.svg?react'
import FullscreenIcon from '../assets/icons/fullscreen.svg?react'
import FullscreenAltIcon from '../assets/icons/fullscreen-alt.svg?react'
import Tooltip from '../ui/components/Tooltip'
import SpacingDiagram, { SCHEMA_WIDTH, SCHEMA_HEIGHT } from '../ui/scheme/statik/schema'

const MIN_ZOOM = 1
const MAX_ZOOM = 10
const ZOOM_STEP = 0.25
const ZOOM_WHEEL_SPEED = 0.002
/** Доля пути до цели, проходимая за один кадр анимации */
const ZOOM_SMOOTH_FACTOR = 0.2
/** Порог, при котором анимация считается завершённой */
const ZOOM_SETTLE_EPSILON = 0.001

const LINE_HEIGHT_PX = 16

const clampZoom = (value: number) => Math.min(Math.max(value, MIN_ZOOM), MAX_ZOOM)

/** Браузеры отдают дельту в пикселях, строках или страницах — приводим к пикселям */
const normalizeWheelDelta = (e: WheelEvent, pageHeight: number) => {
  if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) return e.deltaY * LINE_HEIGHT_PX
  if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) return e.deltaY * pageHeight
  return e.deltaY
}

export function EquipmentDiagram() {
  const diagramRef = useRef<HTMLDivElement>(null)
  const { handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel } = usePan(diagramRef)

  const schemaRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const fitScaleRef = useRef(1)
  const currentZoomRef = useRef(MIN_ZOOM)
  const targetZoomRef = useRef(MIN_ZOOM)
  const prevScaleRef = useRef(MIN_ZOOM)
  const rafRef = useRef<number | null>(null)
  const tickRef = useRef<() => void>(() => {})

  const applyScale = useCallback((nextScale: number) => {
    const diagram = diagramRef.current
    const schema = schemaRef.current
    const wrapper = wrapperRef.current
    if (!diagram || !schema || !wrapper) return

    const prevScale = prevScaleRef.current
    prevScaleRef.current = nextScale

    wrapper.style.width = `${SCHEMA_WIDTH * nextScale}px`
    wrapper.style.height = `${SCHEMA_HEIGHT * nextScale}px`
    schema.style.scale = `${nextScale}`

    if (prevScale === nextScale) return

    const centerX = diagram.clientWidth / 2
    const centerY = diagram.clientHeight / 2
    const contentX = (diagram.scrollLeft + centerX) / prevScale
    const contentY = (diagram.scrollTop + centerY) / prevScale

    const maxScrollLeft = diagram.scrollWidth - diagram.clientWidth
    const maxScrollTop = diagram.scrollHeight - diagram.clientHeight

    diagram.scrollLeft = Math.max(0, Math.min(contentX * nextScale - centerX, maxScrollLeft))
    diagram.scrollTop = Math.max(0, Math.min(contentY * nextScale - centerY, maxScrollTop))
  }, [])

  /** Запускает цикл анимации, если он ещё не идёт */
  const scheduleTick = useCallback(() => {
    if (rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(tickRef.current)
  }, [])

  /** Плавно доводит масштаб до цели, пересчитывая якорь в каждом кадре */
  const tick = useCallback(() => {
    const current = currentZoomRef.current
    const target = targetZoomRef.current
    const settled = Math.abs(target - current) < ZOOM_SETTLE_EPSILON

    const nextZoom = settled ? target : current + (target - current) * ZOOM_SMOOTH_FACTOR
    currentZoomRef.current = nextZoom

    applyScale(fitScaleRef.current * nextZoom)

    if (settled) {
      rafRef.current = null
      return
    }

    rafRef.current = requestAnimationFrame(tickRef.current)
  }, [applyScale])

  // tick и scheduleTick ссылаются друг на друга, поэтому связываем их через ref в эффекте
  useEffect(() => {
    tickRef.current = tick
  }, [tick])

  const upScale = () => {
    targetZoomRef.current = clampZoom(targetZoomRef.current + ZOOM_STEP)
    scheduleTick()
  }

  const downScale = () => {
    targetZoomRef.current = clampZoom(targetZoomRef.current - ZOOM_STEP)
    scheduleTick()
  }

  const resetScale = () => {
    targetZoomRef.current = MIN_ZOOM
    scheduleTick()
  }

  // Первый fit-масштаб применяем до отрисовки, иначе схема мелькнёт в 1:1
  useLayoutEffect(() => {
    const diagram = diagramRef.current
    if (!diagram) return

    fitScaleRef.current = diagram.clientWidth / SCHEMA_WIDTH
    applyScale(fitScaleRef.current * currentZoomRef.current)
  }, [applyScale])

  useEffect(() => {
    const diagram = diagramRef.current
    if (!diagram) return

    const updateFitScale = () => {
      fitScaleRef.current = diagram.clientWidth / SCHEMA_WIDTH
      scheduleTick()
    }

    updateFitScale()

    const observer = new ResizeObserver(updateFitScale)
    observer.observe(diagram)

    return () => observer.disconnect()
  }, [scheduleTick])

  useEffect(() => () => {
    if (rafRef.current === null) return
    cancelAnimationFrame(rafRef.current)
    // Обязательно сбрасываем, иначе после StrictMode-двойного монтирования
    // scheduleTick будет считать, что цикл уже запущен, и зум перестанет работать
    rafRef.current = null
  }, [])

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()

    const pageHeight = diagramRef.current?.clientHeight ?? 0
    const delta = normalizeWheelDelta(e, pageHeight)

    targetZoomRef.current = clampZoom(targetZoomRef.current * Math.exp(-delta * ZOOM_WHEEL_SPEED))
    scheduleTick()
  }, [scheduleTick])

  useEffect(() => {
    const diagram = diagramRef.current
    if (!diagram) return

    diagram.addEventListener('wheel', handleWheel, { passive: false })
    return () => diagram.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = useCallback(async () => {
    const element = diagramRef.current
    if (!element) return

    try {
      if (!document.fullscreenElement) {
        await element.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error)
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <div
      id='schema-diagram'
      className={'grow relative bg-light rounded-st overflow-auto scrollbar-none w-full h-full cursor-grab select-none'}
      ref={diagramRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div className='sticky top-2.5 left-2.5 flex flex-col gap-2.5 z-2 w-max'>
        <Tooltip content='Приблизить'>
          <Button onClick={upScale} className='w-8 h-8'>
            <ScaleUpIcon className='w-full h-full' />
          </Button>
        </Tooltip>
        <Tooltip content='Отдалить'>
          <Button onClick={downScale} className='w-8 h-8'>
            <ScaleDownIcon className='w-full h-full' />
          </Button>
        </Tooltip>
        <Tooltip content='Сбросить зум'>
          <Button onClick={resetScale} className='w-8 h-8'>
            <ScaleResetIcon className='w-full h-full' />
          </Button>
        </Tooltip>
        <Tooltip content={isFullscreen ? 'Свернуть' : 'На весь экран'}>
          <Button onClick={toggleFullscreen} className='w-8 h-8'>
            {isFullscreen ? <FullscreenAltIcon className='w-full h-full' /> : <FullscreenIcon className='w-full h-full' />}
          </Button>
        </Tooltip>
      </div>
      <div ref={wrapperRef} className='absolute top-0 left-0'>
        <SpacingDiagram
          ref={schemaRef}
          className='w-348.75 h-156.5 top-0 left-0 absolute origin-top-left font-secondary'
        />
      </div>
    </div>
  )
}
