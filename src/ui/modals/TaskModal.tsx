import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import CloseIcon from '../assets/icons/x.svg?react'

interface TaskModalProps {
  isOpened: boolean
  onOpen?: () => void
  onClose?: () => void
}

export function TaskModal({ isOpened, onOpen, onClose }: TaskModalProps) {
  return (
    <Modal className='p-5 rounded-st flex flex-col gap-5' isOpened={isOpened} onClose={onClose} onOpen={onOpen}>
      <div className='flex gap-1.25 justify-between items-center'>
        <p className='text-blue text-[16px]'>Задание</p>
        <Button className='w-7.5 h-7.5 p-0.5' variant='light-borderless'>
          <CloseIcon className='w-full h-full' onClick={onClose} />
        </Button>
      </div>
      <p className='font-normal leading-[150%] text-dark'>
        Приемка насосных установок в эксплуатацию: требуется выполнить пуск водокольцевого вакуумного насоса
      </p>
    </Modal>
  )
}
