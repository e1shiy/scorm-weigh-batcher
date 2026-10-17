import { useEffect, useRef, useState } from 'react'
import { animate, motion, MotionConfig, useAnimationFrame, useDragControls, useMotionValue } from 'motion/react'
import { twMerge } from 'tailwind-merge'

type NudgeProps = {
  onChange?: (value: number) => void // вызывается каждый кадр! не сохранять в state, только ref или motionValue
  vMax?: number // макс. скорость изменения
  holdSpeed?: number // скорость изменения при нажатии на стрелки
  k?: number // степень нелинейности
  deadZone?: number // 0..1
  className?: string
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
const RELEASE_EASE = [0.16, 1, 0.3, 1] as const

export function Nudge({ onChange, vMax = 30, holdSpeed = 3, k = 4, deadZone = 0.04, className }: NudgeProps) {
  const innerRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  const [range, setRange] = useState(0)
  const maxXRef = useRef(0)

  const x = useMotionValue(0)
  const dragControls = useDragControls()
  const valueRef = useRef(0)

  const holdRef = useRef<-1 | 0 | 1>(0)
  const scaleRef = useRef(1)

  const measureScale = () => {
    const inner = innerRef.current
    if (!inner || inner.offsetWidth === 0) return
    scaleRef.current = inner.getBoundingClientRect().width / inner.offsetWidth
  }

  const transformPagePoint = (point: { x: number; y: number }) => ({
    x: point.x / scaleRef.current,
    y: point.y / scaleRef.current
  })

  useEffect(() => {
    const inner = innerRef.current
    const thumb = thumbRef.current
    if (!inner || !thumb) return

    const measure = () => {
      const r = Math.max(0, (inner.clientWidth - thumb.offsetWidth) / 2)
      maxXRef.current = r
      setRange(r)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(inner)
    return () => ro.disconnect()
  }, [])

  const getSpeed = (d: number) => {
    const a = Math.abs(d)
    if (a < deadZone) return 0
    const t = (a - deadZone) / (1 - deadZone)
    const s = (Math.exp(k * t) - 1) / (Math.exp(k) - 1)
    return Math.sign(d) * vMax * s
  }

  useAnimationFrame((_, delta) => {
    const dt = Math.min(delta, 50) / 1000

    if (holdRef.current !== 0) {
      valueRef.current += holdRef.current * holdSpeed * dt
      onChange?.(valueRef.current)
      return
    }

    if (maxXRef.current === 0) return

    const d = clamp(x.get() / maxXRef.current, -1, 1)
    const v = getSpeed(d)
    if (v === 0) return

    valueRef.current += v * dt
    onChange?.(valueRef.current)
  })

  const release = () => {
    const d = Math.abs(x.get() / (maxXRef.current || 1))
    animate(x, 0, {
      duration: 0.25 + 0.55 * d ** 0.7,
      ease: RELEASE_EASE
    })
  }

  const beginHold = (dir: -1 | 1, e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    holdRef.current = dir
  }

  const endHold = () => {
    holdRef.current = 0
  }

  return (
    <div className={twMerge('w-full h-3 flex p-px border border-black bg-dark-gray select-none', className)}>
      <button
        onPointerDown={e => beginHold(-1, e)}
        onPointerUp={endHold}
        onPointerCancel={endHold}
        onLostPointerCapture={endHold}
        className='h-full aspect-8/7 flex-center bg-gray-alt shadow-st py-px px-0.5'
      ></button>

      <div ref={innerRef} className='grow flex items-center justify-center'>
        <MotionConfig transformPagePoint={transformPagePoint}>
          <motion.div
            ref={thumbRef}
            drag='x'
            dragControls={dragControls}
            dragListener={false}
            onPointerDown={e => {
              measureScale()
              dragControls.start(e, { distanceThreshold: 0 })
            }}
            dragConstraints={{ left: -range, right: range }}
            dragElastic={0}
            dragMomentum={false}
            style={{ x }}
            onDragStart={() => x.stop()}
            onDragEnd={release}
            className='h-full aspect-8/7 bg-gray-alt shadow-st touch-none cursor-grab active:cursor-grabbing'
          />
        </MotionConfig>
      </div>

      <button
        onPointerDown={e => beginHold(1, e)}
        onPointerUp={endHold}
        onPointerCancel={endHold}
        onLostPointerCapture={endHold}
        className='h-full aspect-8/7 flex-center bg-gray-alt shadow-st py-px px-0.5'
      ></button>
    </div>
  )
}
