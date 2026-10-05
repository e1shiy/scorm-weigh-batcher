import { AnimatePresence, motion } from 'motion/react'
import { type ReactNode, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'

interface ModalProps {
  isOpened: boolean
  onOpen?: () => void
  onClose?: () => void
  children?: ReactNode
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
    <AnimatePresence initial={false}>
      {isOpened && (
        <motion.div
          key='modal'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className={'fixed inset-0 flex-center w-screen h-dvh bg-dark/60 z-1000'}
          role={'dialog'}
          aria-modal={'true'}
        >
          <button
            type='button'
            onClick={onClose}
            aria-label='Close modal'
            className='absolute inset-0 w-full h-full cursor-default border-none bg-transparent p-0'
          />
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={twMerge('bg-light max-w-100 z-2', className)}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRootElement
  )
}
