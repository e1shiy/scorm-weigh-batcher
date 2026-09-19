import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'

interface ModalProps {
  isOpened: boolean
  onOpen?: () => void
  onClose?: () => void
  children?: React.ReactNode
  className?: string
}

export function Modal({ children, className, isOpened, onClose, onOpen }: ModalProps) {
  useEffect(() => {
    onOpen?.()
    const handleEsc = (e: KeyboardEvent) => e.code === 'Escape' && onClose?.()
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onOpen, onClose])

  const modalRootElement = useMemo(() => document.getElementById('modal-root'), [])
  if (!modalRootElement) {
    console.error('#modal-root not found')
    return null
  }

  return createPortal(
    isOpened && (
      <div className={'fixed inset-0 flex-center w-screen h-dvh bg-dark/60 z-1000'} role={'dialog'} aria-modal={'true'}>
        <button
          type='button'
          onClick={onClose}
          aria-label='Close modal'
          className='absolute inset-0 w-full h-full cursor-default border-none bg-transparent p-0'
        />
        <div className={twMerge('bg-light max-w-100 z-2', className)}>{children}</div>
      </div>
    ),
    modalRootElement
  )
}
