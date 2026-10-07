import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

const RAIL_WIDTH = 28
const WIDTH_DURATION = 0.3
const FADE_IN_DURATION = 0.12
const FADE_OUT_DURATION = 0.08
const FADE_IN_DELAY = 0.04
const WIDTH_EASE: readonly [number, number, number, number] = [0.4, 0, 0.2, 1]

type PanelLayerProps = {
  width: number
  anchor: 'left' | 'right'
  children: ReactNode
}

function PanelLayer({ width, anchor, children }: PanelLayerProps) {
  const isPresent = useIsPresent()
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={twMerge(
        'absolute inset-y-0 flex flex-col transition-none',
        anchor === 'left' ? 'left-0' : 'right-0',
        isPresent ? 'z-2' : 'z-1'
      )}
      style={{ width }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: prefersReducedMotion ? { duration: 0 } : { duration: FADE_IN_DURATION, delay: FADE_IN_DELAY, ease: 'easeOut' }
      }}
      exit={{
        opacity: 0,
        transition: prefersReducedMotion ? { duration: 0 } : { duration: FADE_OUT_DURATION, ease: 'easeIn' }
      }}
      inert={!isPresent}
    >
      {children}
    </motion.div>
  )
}

export interface CollapsiblePanelProps {
  isOpen: boolean
  openWidth: number
  expanded: ReactNode
  collapsed: ReactNode
  anchor?: 'left' | 'right'
  className?: string
}

export function CollapsiblePanel({ isOpen, openWidth, expanded, collapsed, anchor = 'left', className }: CollapsiblePanelProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={twMerge('relative isolate self-stretch shrink-0 overflow-clip transition-none', className)}
      initial={false}
      animate={{ width: isOpen ? openWidth : RAIL_WIDTH }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: WIDTH_DURATION, ease: WIDTH_EASE }}
    >
      <AnimatePresence mode='sync' initial={false}>
        {isOpen ? (
          <PanelLayer key='expanded' width={openWidth} anchor={anchor}>
            {expanded}
          </PanelLayer>
        ) : (
          <PanelLayer key='collapsed' width={RAIL_WIDTH} anchor={anchor}>
            {collapsed}
          </PanelLayer>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
