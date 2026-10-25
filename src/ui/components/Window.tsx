import type { HTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { WindowHeader } from './WindowHeader'

interface WindowProps {
  title: string
  onClose: () => void
  dragHandleProps?: HTMLAttributes<HTMLElement>
  children?: ReactNode
  className?: string
}

export function Window({ title, onClose, dragHandleProps, children, className }: WindowProps) {
  return (
    <div
      className={twMerge(
        'flex flex-col px-1 pb-1 rounded-t-md border border-window-border',
        'bg-linear-to-b from-window-frame-light to-window-frame shadow-[0_4px_12px_rgb(0_0_0/0.35)] cursor-auto',
        className
      )}
    >
      <WindowHeader title={title} onClose={onClose} dragHandleProps={dragHandleProps} />
      {children}
    </div>
  )
}
