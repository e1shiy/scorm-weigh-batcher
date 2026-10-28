import type { CSSProperties, ReactNode, Ref } from 'react'
import { twMerge } from 'tailwind-merge'
import type { DragHandleProps } from '../../lib/useDrag'
import { WindowHeader } from './WindowHeader'

interface WindowProps {
  title: string
  onClose: () => void
  dragHandleProps?: DragHandleProps
  children?: ReactNode
  className?: string
  style?: CSSProperties
  ref?: Ref<HTMLDivElement>
}

export function Window({ title, onClose, dragHandleProps, children, className, style, ref }: WindowProps) {
  return (
    <div
      ref={ref}
      style={style}
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
