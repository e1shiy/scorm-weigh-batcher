import { AnimatePresence, motion } from 'motion/react'
import { Toast } from './Toast'
import { useToastStore } from './useToastStore'

const MAX_VISIBLE = 3

export function ToastProvider() {
  const toasts = useToastStore(s => s.toasts)
  const visible = toasts.slice(-MAX_VISIBLE).reverse()
  const hiddenCount = toasts.length - visible.length
  return (
    <div className='absolute top-2.5 right-2.5 z-100 flex flex-col items-end gap-1.25'>
      <AnimatePresence initial={false} mode='popLayout'>
        {visible.map(toast => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <Toast toast={toast} />
          </motion.div>
        ))}
      </AnimatePresence>
      {hiddenCount && (
        <div className='max-w-76.25 rounded-st bg-light-yellow text-dark px-3 py-1 shadow-[0_2px_6px_black/50] cursor-default'>
          <p className='font-normal'>+{hiddenCount} ещё</p>
        </div>
      )}
    </div>
  )
}
