import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { useScormStore } from '../../api/useScormStore'
import CloseIcon from '../../assets/icons/x.svg?react'

interface FinishModalProps {
  isOpened: boolean
  onOpen?: () => void
  onClose?: () => void
}

export function FinishModal({ isOpened, onOpen, onClose }: FinishModalProps) {
  const finish = useScormStore(s => s.finish)
  const handleFinish = () => {
    onClose?.()
    finish()
  }

  return (
    <Modal className='p-5 rounded-st flex flex-col gap-5' isOpened={isOpened} onClose={onClose} onOpen={onOpen}>
      <div className='flex gap-1.25 justify-between items-center'>
        <p className='text-blue text-[16px]'>Подтверждение</p>
        <Button className='w-7.5 h-7.5 p-0.5' variant='light-borderless'>
          <CloseIcon className='w-full h-full' onClick={onClose} />
        </Button>
      </div>
      <p className='font-normal leading-[150%] text-dark'>Вы действительно хотите завершить досрочно? Попытка будет считаться неудачной.</p>
      <Button onClick={handleFinish} variant='light'>
        Завершить
      </Button>
    </Modal>
  )
}
