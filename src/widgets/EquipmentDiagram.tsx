import { useCallback, useEffect, useRef, useState } from 'react'
import { usePan } from '../lib/usePan'
import { useProcedureStore } from '../procedure/useProcedureStore'
import { Button } from '../ui/components/Button'
import ScaleUpIcon from '../assets/icons/scale-up.svg?react'
import ScaleDownIcon from '../assets/icons/scale-down.svg?react'
import ScaleResetIcon from '../assets/icons/scale-reset.svg?react'
import FullscreenIcon from '../assets/icons/fullscreen.svg?react'
import FullscreenAltIcon from '../assets/icons/fullscreen-alt.svg?react'

export function EquipmentDiagram() {
  const submitAction = useProcedureStore(s => s.submitAction)
  const currentStepIndex = useProcedureStore(s => s.currentStepIndex)

  const diagramRef = useRef<HTMLDivElement>(null)
  const { handlePointerDown, handlePointerMove, handlePointerUp } = usePan(diagramRef)

  const [scale, setScale] = useState(1)
  const upScale = () => setScale(s => Math.min(s + 0.25, 10))
  const downScale = () => setScale(s => Math.max(s - 0.25, 1))

  const handleWheel = useCallback((e: WheelEvent) => (e.deltaY < 0 ? upScale() : downScale()), [])
  useEffect(() => {
    const diagram = diagramRef.current
    if (!diagram) return

    diagram.addEventListener('wheel', handleWheel)
    return () => diagram.removeEventListener('wheel', handleWheel)
  })

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
    >
      <div className='sticky top-2.5 left-2.5 flex flex-col gap-2.5 z-2 w-max'>
        <Button onClick={upScale} className='w-8 h-8'>
          <ScaleUpIcon className='w-full h-full' />
        </Button>
        <Button onClick={downScale} className='w-8 h-8'>
          <ScaleDownIcon className='w-full h-full' />
        </Button>
        <Button onClick={() => setScale(1)} className='w-8 h-8'>
          <ScaleResetIcon className='w-full h-full' />
        </Button>
        <Button onClick={toggleFullscreen} className='w-8 h-8'>
          {isFullscreen ? <FullscreenAltIcon className='w-full h-full' /> : <FullscreenIcon className='w-full h-full' />}
        </Button>
      </div>
      {/* тут будет диаграмма */}
    </div>
  )
}
