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

export function EquipmentDiagram() {
  const diagramRef = useRef<HTMLDivElement>(null)
  const { handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel } = usePan(diagramRef)

  const [zoom, setZoom] = useState(MIN_ZOOM)
  const upScale = () => setZoom(z => Math.min(z + ZOOM_STEP, MAX_ZOOM))
  const downScale = () => setZoom(z => Math.max(z - ZOOM_STEP, MIN_ZOOM))

  const [fitScale, setFitScale] = useState(1)

  useEffect(() => {
    const diagram = diagramRef.current
    if (!diagram) return

    const updateFitScale = () => setFitScale(diagram.clientWidth / SCHEMA_WIDTH)
    updateFitScale()

    const observer = new ResizeObserver(updateFitScale)
    observer.observe(diagram)

    return () => observer.disconnect()
  }, [])

  const scale = fitScale * zoom

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      upScale()
    } else {
      downScale()
    }
  }, [])

  useEffect(() => {
    const diagram = diagramRef.current
    if (!diagram) return

    diagram.addEventListener('wheel', handleWheel, { passive: false })
    return () => diagram.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const prevScaleRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    const diagram = diagramRef.current
    const prevScale = prevScaleRef.current
    prevScaleRef.current = scale

    // Первый запуск и случай без изменения масштаба — центрировать нечего
    if (!diagram || prevScale === null || prevScale === scale) return

    const centerX = diagram.clientWidth / 2
    const centerY = diagram.clientHeight / 2
    const contentX = (diagram.scrollLeft + centerX) / prevScale
    const contentY = (diagram.scrollTop + centerY) / prevScale

    const maxScrollLeft = diagram.scrollWidth - diagram.clientWidth
    const maxScrollTop = diagram.scrollHeight - diagram.clientHeight

    diagram.scrollLeft = Math.max(0, Math.min(contentX * scale - centerX, maxScrollLeft))
    diagram.scrollTop = Math.max(0, Math.min(contentY * scale - centerY, maxScrollTop))
  }, [scale])

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
          <Button onClick={() => setZoom(MIN_ZOOM)} className='w-8 h-8'>
            <ScaleResetIcon className='w-full h-full' />
          </Button>
        </Tooltip>
        <Tooltip content={isFullscreen ? 'Свернуть' : 'На весь экран'}>
          <Button onClick={toggleFullscreen} className='w-8 h-8'>
            {isFullscreen ? <FullscreenAltIcon className='w-full h-full' /> : <FullscreenIcon className='w-full h-full' />}
          </Button>
        </Tooltip>
      </div>
      <div className='absolute top-0 left-0' style={{ width: SCHEMA_WIDTH * scale, height: SCHEMA_HEIGHT * scale }}>
        <SpacingDiagram
          className={`w-348.75 h-156.5 top-0 left-0 absolute origin-top-left font-secondary`}
          style={{ scale: scale }}
        />
      </div>
    </div>
  )
}
