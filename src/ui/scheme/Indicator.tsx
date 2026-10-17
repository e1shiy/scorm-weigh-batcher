import type { MouseEventHandler, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface IndicatorProps {
  className?: string
  children?: ReactNode
  onClick?: MouseEventHandler
}

export function Indicator({ className, onClick, children }: IndicatorProps) {
  return (
    <button
      className={twMerge(
        'size-2.25 flex-center font-semibold text-[7px] text-black bg-gray-alt leading-none border border-black',
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
