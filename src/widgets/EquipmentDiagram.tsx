import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePan } from '../lib/usePan'
import { clamp } from '../lib/clamp'
import { Button } from '../ui/components/Button'
import ScaleUpIcon from '../assets/icons/scale-up.svg?react'
import ScaleDownIcon from '../assets/icons/scale-down.svg?react'
import ScaleResetIcon from '../assets/icons/scale-reset.svg?react'
import FullscreenIcon from '../assets/icons/fullscreen.svg?react'
import FullscreenAltIcon from '../assets/icons/fullscreen-alt.svg?react'
import Tooltip from '../ui/components/Tooltip'
import SpacingDiagram, { SCHEMA_WIDTH, SCHEMA_HEIGHT } from '../ui/scheme/statik/schema'
import { ToastProvider } from '../ui/components/toast/ToastProvider'
import { PopUp } from '../ui/scheme/pop-up/PopUp'
import { usePopUpStore } from '../ui/scheme/pop-up/usePopUpStore'
import { twMerge } from 'tailwind-merge'

const MIN_ZOOM = 1
const MAX_ZOOM = 10
const ZOOM_STEP = 0.25
const ZOOM_WHEEL_SPEED = 0.002
/** Доля пути до цели, проходимая за один кадр анимации */
const ZOOM_SMOOTH_FACTOR = 0.2
/** Порог, при котором анимация считается завершённой */
const ZOOM_SETTLE_EPSILON = 0.001

const LINE_HEIGHT_PX = 16
/** Отступ вокруг попапа и объекта, когда камера отъезжает, чтобы их показать */
const FOCUS_PADDING = 20
/** Расстояние до цели прокрутки, при котором камера считается доехавшей */
const FOCUS_SETTLE_PX = 2

/** Шаг плавной прокрутки не меньше 1px, иначе браузер округлит его до нуля и камера не доедет */
const getScrollStep = (delta: number) => {
  const step = delta * ZOOM_SMOOTH_FACTOR
  return Math.abs(step) < 1 ? Math.sign(delta) : step
}

/** Браузеры отдают дельту в пикселях, строках или страницах — приводим к пикселям */
const normalizeWheelDelta = (e: WheelEvent, pageHeight: number) => {
  if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) return e.deltaY * LINE_HEIGHT_PX
  if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) return e.deltaY * pageHeight
  return e.deltaY
}

export function EquipmentDiagram() {
  const containerRef = useRef<HTMLDivElement>(null)
  const diagramRef = useRef<HTMLDivElement>(null)
  const { handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel } = usePan(diagramRef)

  const schemaRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const popUpLayerRef = useRef<HTMLDivElement>(null)
  const focusPointRef = useRef<{ x: number; y: number } | null>(null)

  const isPopUpOpen = usePopUpStore(s => s.isOpen)
  const focusRect = usePopUpStore(s => s.focusRect)
  const setFocusRect = usePopUpStore(s => s.setFocusRect)

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
    if (popUpLayerRef.current) popUpLayerRef.current.style.zoom = `${nextScale}`

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

  /** Плавно сдвигает прокрутку к точке фокуса; возвращает true, когда камера доехала */
  const moveTowardFocus = useCallback(() => {
    const diagram = diagramRef.current
    const focus = focusPointRef.current
    if (!diagram || !focus) return true

    const scale = prevScaleRef.current
    const targetLeft = clamp(focus.x * scale - diagram.clientWidth / 2, 0, diagram.scrollWidth - diagram.clientWidth)
    const targetTop = clamp(focus.y * scale - diagram.clientHeight / 2, 0, diagram.scrollHeight - diagram.clientHeight)
    const deltaLeft = targetLeft - diagram.scrollLeft
    const deltaTop = targetTop - diagram.scrollTop

    if (Math.abs(deltaLeft) <= FOCUS_SETTLE_PX && Math.abs(deltaTop) <= FOCUS_SETTLE_PX) {
      diagram.scrollLeft = targetLeft
      diagram.scrollTop = targetTop
      focusPointRef.current = null
      return true
    }

    diagram.scrollLeft += getScrollStep(deltaLeft)
    diagram.scrollTop += getScrollStep(deltaTop)
    return false
  }, [])

  /** Плавно доводит масштаб до цели, пересчитывая якорь в каждом кадре */
  const tick = useCallback(() => {
    const current = currentZoomRef.current
    const target = targetZoomRef.current
    const settled = Math.abs(target - current) < ZOOM_SETTLE_EPSILON

    const nextZoom = settled ? target : current + (target - current) * ZOOM_SMOOTH_FACTOR
    currentZoomRef.current = nextZoom

    applyScale(fitScaleRef.current * nextZoom)
    const isFocusSettled = moveTowardFocus()

    if (settled && isFocusSettled) {
      rafRef.current = null
      return
    }

    rafRef.current = requestAnimationFrame(tickRef.current)
  }, [applyScale, moveTowardFocus])

  // tick и scheduleTick ссылаются друг на друга, поэтому связываем их через ref в эффекте
  useEffect(() => {
    tickRef.current = tick
  }, [tick])

  const upScale = () => {
    targetZoomRef.current = clamp(targetZoomRef.current + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM)
    scheduleTick()
  }

  const downScale = () => {
    targetZoomRef.current = clamp(targetZoomRef.current - ZOOM_STEP, MIN_ZOOM, MAX_ZOOM)
    scheduleTick()
  }

  const resetScale = () => {
    targetZoomRef.current = MIN_ZOOM
    scheduleTick()
  }

  // При открытии попапа камера отъезжает так, чтобы были видны и объект, и окно рядом с ним
  useEffect(() => {
    const diagram = diagramRef.current
    if (!focusRect || !diagram) return
    setFocusRect(null)

    const scale = prevScaleRef.current
    const viewLeft = diagram.scrollLeft / scale
    const viewTop = diagram.scrollTop / scale
    const isVisible =
      focusRect.x >= viewLeft &&
      focusRect.y >= viewTop &&
      focusRect.x + focusRect.width <= viewLeft + diagram.clientWidth / scale &&
      focusRect.y + focusRect.height <= viewTop + diagram.clientHeight / scale
    if (isVisible) return

    const fittingScale = Math.min(
      diagram.clientWidth / (focusRect.width + FOCUS_PADDING * 2),
      diagram.clientHeight / (focusRect.height + FOCUS_PADDING * 2)
    )
    targetZoomRef.current = clamp(Math.min(targetZoomRef.current, fittingScale / fitScaleRef.current), MIN_ZOOM, MAX_ZOOM)
    focusPointRef.current = { x: focusRect.x + focusRect.width / 2, y: focusRect.y + focusRect.height / 2 }
    scheduleTick()
  }, [focusRect, setFocusRect, scheduleTick])

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

    targetZoomRef.current = clamp(targetZoomRef.current * Math.exp(-delta * ZOOM_WHEEL_SPEED), MIN_ZOOM, MAX_ZOOM)
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
    const element = containerRef.current
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
    <div ref={containerRef} className='grow relative min-w-0'>
      <div
        id='schema-diagram'
        className={'w-full h-full relative bg-light rounded-st overflow-auto scrollbar-none cursor-grab select-none'}
        ref={diagramRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div ref={wrapperRef} className='absolute top-0 left-0'>
          <SpacingDiagram
            ref={schemaRef}
            className={twMerge('w-348.75 h-156.5 top-0 left-0 absolute origin-top-left font-secondary', isPopUpOpen && 'pointer-events-none')}
          />
          <div ref={popUpLayerRef} className='absolute top-0 left-0 w-348.75 h-156.5 pointer-events-none'>
            <PopUp />
          </div>
        </div>
      </div>
      <div className='absolute top-2.5 left-2.5 flex flex-col gap-2.5 z-2 w-max'>
        <Tooltip content='Приблизить'>
          <Button onClick={upScale} className='w-8 h-8' variant='dark'>
            <ScaleUpIcon className='w-full h-full' />
          </Button>
        </Tooltip>
        <Tooltip content='Отдалить'>
          <Button onClick={downScale} className='w-8 h-8' variant='dark'>
            <ScaleDownIcon className='w-full h-full' />
          </Button>
        </Tooltip>
        <Tooltip content='Сбросить зум'>
          <Button onClick={resetScale} className='w-8 h-8' variant='dark'>
            <ScaleResetIcon className='w-full h-full' />
          </Button>
        </Tooltip>
        <Tooltip content={isFullscreen ? 'Свернуть' : 'На весь экран'}>
          <Button onClick={toggleFullscreen} className='w-8 h-8' variant='dark'>
            {isFullscreen ? <FullscreenAltIcon className='w-full h-full' /> : <FullscreenIcon className='w-full h-full' />}
          </Button>
        </Tooltip>
      </div>
      <ToastProvider />
    </div>
  )
}
