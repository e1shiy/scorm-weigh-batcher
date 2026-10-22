import CloseIcon from '../../../assets/icons/x.svg?react'
import { Button } from '../Button'
import { useToastStore, type ToastData } from './useToastStore'

interface ToastProps {
  toast: ToastData
}

export function Toast({ toast }: ToastProps) {
  const removeToast = useToastStore(s => s.removeToast)
  return (
    <div className='max-w-76.25 flex gap-1.25 p-2.5 rounded-st bg-light-yellow text-dark shadow-[0_2px_6px_black/50] cursor-default'>
      <p className='font-normal my-auto'>{toast.message}</p>
      <Button className='shrink-0 w-7.5 h-7.5 p-0.5'>
        <CloseIcon className='w-full h-full' onClick={() => removeToast(toast.id)} />
      </Button>
    </div>
  )
}
