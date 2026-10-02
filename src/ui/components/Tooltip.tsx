import * as React from 'react'
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
import TriangleIcon from '../../assets/icons/triangle.svg?react'
import { twMerge } from 'tailwind-merge'
import { useEffect, useState } from 'react'

export type TooltipProps = {
  content: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  arrowPadding?: number
  collisionPadding?: number
  disableHoverablePopup?: boolean
  disabled?: boolean
  delay?: number
  closeDelay?: number
  children: React.ReactNode
}

export function Tooltip({
  content,
  side = 'top',
  align = 'center',
  sideOffset = 5,
  arrowPadding = 6,
  collisionPadding = 8,
  disableHoverablePopup = false,
  disabled = false,
  delay,
  closeDelay,
  children
}: TooltipProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(typeof document !== 'undefined' ? document.body : null)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setPortalContainer((document.fullscreenElement as HTMLElement | null) ?? document.body)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <BaseTooltip.Provider delay={delay} closeDelay={closeDelay}>
      <BaseTooltip.Root disableHoverablePopup={disableHoverablePopup} disabled={disabled}>
        <BaseTooltip.Trigger render={children as React.ReactElement} />
        <BaseTooltip.Portal container={portalContainer}>
          <BaseTooltip.Positioner
            side={side}
            align={align}
            sideOffset={sideOffset}
            arrowPadding={arrowPadding}
            collisionPadding={collisionPadding}
            collisionAvoidance={{
              side: 'flip',
              align: 'shift',
              fallbackAxisSide: 'none'
            }}
            className='z-10'
          >
            <BaseTooltip.Popup className='bg-dark/85 py-1 px-2 rounded-md font-medium pointer-events-none'>
              <BaseTooltip.Arrow
                className={twMerge(
                  'bottom-0 translate-y-full fill-dark/85',
                  'data-[side=bottom]:rotate-180 data-[side=left]:rotate-90 data-[side=right]:-rotate-90',
                  'data-[side=bottom]:top-0 data-[side=bottom]:-translate-y-full'
                )}
              >
                <TriangleIcon />
              </BaseTooltip.Arrow>
              {content}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  )
}

export default Tooltip
