import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import CloseIcon from '../../assets/icons/x.svg?react'
import { useAdminStore } from '../../widgets/admin/useAdminStore'

interface TaskModalProps {
  isOpened: boolean
  onOpen?: () => void
  onClose?: () => void
}

export function TaskModal({ isOpened, onOpen, onClose }: TaskModalProps) {
  const isAdmin = useAdminStore(s => s.isAdmin)
  const setIsAdmin = useAdminStore(s => s.setIsAdmin)
  const handleAdminToggle = () => {
    setIsAdmin(!isAdmin)
    onClose?.()
  }
  return (
    <Modal className='p-5 rounded-st flex flex-col gap-5' isOpened={isOpened} onClose={onClose} onOpen={onOpen}>
      <div className='flex gap-1.25 justify-between items-center'>
        <p className='text-blue text-[16px]'>Задание</p>
        <Button className='w-7.5 h-7.5 p-0.5' variant='light-borderless'>
          <CloseIcon className='w-full h-full' onClick={onClose} />
        </Button>
      </div>

      <div className='flex flex-col gap-1.25 font-normal leading-[150%] text-dark'>
        <p>Требуется запустить узел разложения после продолжительного ремонта.</p>
        <p>Нагрузка на дозаторы: 3117/1 = 5 т/ч; 3117/2 = 60 т/ч; 1118/3 = 30 т/ч; 1118/4 = 35 т/ч</p>
      </div>

      <Button variant='light' onClick={handleAdminToggle}>
        {isAdmin ? 'Выйти из режима тестирования' : 'Перейти в режим тестирования'}
      </Button>
    </Modal>
  )
}
