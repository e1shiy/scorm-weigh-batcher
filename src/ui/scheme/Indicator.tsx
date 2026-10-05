import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface IndicatorProps {
  className?: string
  children?: ReactNode
}

export function Indicator({ className, children }: IndicatorProps) {
  return (
    <div
      className={twMerge(
        'size-2.25 flex-center font-semibold text-[7px] text-black bg-gray-alt leading-none border border-black',
        className
      )}
    >
      {children}
    </div>
  )
}
