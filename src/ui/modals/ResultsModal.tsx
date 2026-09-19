import { Modal } from '../components/Modal'
import { useScormStore } from '../../api/useScormStore'

interface ResultsModalProps {
  isOpened: boolean
}

export function ResultsModal({ isOpened }: ResultsModalProps) {
  const scoreRaw = useScormStore(s => s.scoreRaw)
  const scoreMax = useScormStore(s => s.scoreMax)

  return (
    <Modal className='p-5 rounded-st flex flex-col gap-5' isOpened={isOpened}>
      <p className='text-blue text-[16px]'>Задание завершено</p>
      <p className='font-normal text-dark/60'>Для новой попытки выйдите и начните задание заново.</p>
      <p className='font-normal self-center leading-[150%] text-dark'>
        Вы набрали {scoreRaw} из {scoreMax} баллов
      </p>
    </Modal>
  )
}
