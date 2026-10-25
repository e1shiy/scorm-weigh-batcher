import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'
import CloseIcon from '../../assets/icons/x.svg?react'

interface WindowHeaderProps {
  title: string
  onClose: () => void
  dragHandleProps?: HTMLAttributes<HTMLElement>
}

export function WindowHeader({ title, onClose, dragHandleProps }: WindowHeaderProps) {
  return (
    <header {...dragHandleProps} className={twMerge('h-5 flex items-start justify-between select-none', dragHandleProps && 'cursor-move')}>
      <span className='self-center pl-1 text-[9px] leading-none text-black truncate'>{title}</span>
      <button
        type='button'
        aria-label='Закрыть'
        onClick={onClose}
        className='w-8 h-3.75 flex-center rounded-b-xs border border-t-0 border-window-close-border bg-linear-to-b from-window-close-light to-window-close text-light cursor-pointer hover:brightness-110'
      >
        <CloseIcon className='size-2.5' />
      </button>
    </header>
  )
}
