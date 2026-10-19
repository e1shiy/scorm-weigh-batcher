import type { MouseEventHandler } from 'react'
import { twMerge } from 'tailwind-merge'

interface LoadPanelProps {
  isActive: boolean
  load: number
  onClick?: MouseEventHandler
}

export function LoadPanel({ isActive, load, onClick }: LoadPanelProps) {
  return (
    <button
      className={twMerge(
        'font-medium flex-center flex-col text-black border border-black rounded-xs px-1 text-[8px] leading-2.5 w-5.5',
        isActive ? 'bg-light-green' : 'bg-gray-alt',
        !isActive && onClick ? 'cursor-pointer' : 'cursor-auto'
      )}
      onClick={onClick}
    >
      <span>{load}</span>
      <span>%</span>
    </button>
  )
}
