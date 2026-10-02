import { useState } from 'react'
import { useScormStore } from '../api/useScormStore'
import { useScenarioStore } from '../scenario/useScenarioStore'
import { Button } from '../ui/components/Button'
import { TaskModal } from '../ui/modals/TaskModal'
import { FinishModal } from '../ui/modals/FinishModal'
import ClockIcon from '../assets/icons/clock.svg?react'
import TrophyIcon from '../assets/icons/trophy.svg?react'
import ChevronIcon from '../assets/icons/chevron.svg?react'
import TaskIcon from '../assets/icons/task.svg?react'
import CancelIcon from '../assets/icons/cancel.svg?react'
import Tooltip from '../ui/components/Tooltip'

export function HistoryPanel() {
  const scoreRaw = useScormStore(s => s.scoreRaw)
  const scoreMax = useScormStore(s => s.scoreMax)
  const history = useScenarioStore(s => s.history)

  const [isClosed, setIsClosed] = useState(window.innerWidth < 768)
  const [isTaskOpen, setIsTaskOpen] = useState(true)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const renderedHistory = history.map((entry, index) => {
    const { id, meta, scoreDelta, isSuccess } = entry
    const { title, description } = meta
    return (
      <div key={id} className='text-blue flex justify-between items-end'>
        <div className='w-57.5 flex flex-col gap-1'>
          <p className='leading-[110%]'>
            {history.length - index}. {title}
          </p>
          <p className='text-dark font-medium'>{isSuccess ? (description ?? title) : 'Выбрано неверно'}</p>
        </div>
        {!isSuccess && <p>{scoreDelta}</p>}
      </div>
    )
  })

  return (
    <>
      {isClosed ? (
        <div className='w-7 shrink-0 flex flex-col gap-2.5'>
          <Tooltip content='Свернуть'>
            <Button onClick={() => setIsClosed(false)} className='border-none w-full h-10'>
              <ChevronIcon className='w-2 h-4 rotate-180' />
            </Button>
          </Tooltip>
          <button
            onClick={() => setIsClosed(false)}
            className='grow flex flex-col justify-between g-1.25 py-3.75 cursor-pointer rounded-st hover:bg-dark/60'
          >
            <div className='flex-center flex-col gap-2.5'>
              <ClockIcon className='w-4 h-4' />
              <p className='[writing-mode:vertical-rl] tracking-[1.5px] font-normal'>История</p>
            </div>
            <div className='flex-center flex-col gap-1.25'>
              <div className='flex-center flex-col gap-2.5'>
                <TrophyIcon className='w-4 h-4' />
                <p className='font-semibold [writing-mode:vertical-rl] tracking-[1.5px]'>Баллы:</p>
              </div>
              <p className='font-semibold [writing-mode:vertical-rl] tracking-[1.5px]'>
                {scoreRaw} <span className='text-gray'>из {scoreMax}</span>
              </p>
            </div>
          </button>
          <div className='flex flex-col gap-2.5'>
            <Tooltip content='Задание'>
              <Button onClick={() => setIsTaskOpen(true)} className='p-1'>
                <TaskIcon />
              </Button>
            </Tooltip>
            <Tooltip content='Завершить досрочно'>
              <Button onClick={() => setIsConfirmOpen(true)} className='p-1'>
                <CancelIcon />
              </Button>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div className='w-80 max-md:w-70 shrink-0 flex flex-col gap-2.5'>
          <div className='flex gap-1.25 justify-between items-center h-10'>
            <div className='flex gap-2.5 items-center'>
              <ClockIcon className='w-4 h-4' />
              <p>История</p>
            </div>
            <Tooltip content='Свернуть'>
              <Button onClick={() => setIsClosed(true)} className='border-none w-7 h-full'>
                <ChevronIcon className='w-2 h-4' />
              </Button>
            </Tooltip>
          </div>
          <div className='grow min-h-0 flex flex-col gap-5'>
            <div className={'bg-light rounded-st grow overflow-y-auto'}>
              <div className='flex flex-col gap-5 min-h-full p-2.5 pr-3 relative'>
                <span className='w-px bg-blue absolute h-full top-0 right-8' />
                {renderedHistory}
              </div>
            </div>
            <div className='flex gap-1.25 justify-between items-center'>
              <div className='flex gap-2.5 items-center'>
                <TrophyIcon className='w-4 h-4' />
                <p className='font-semibold'>Набранные баллы:</p>
              </div>
              <p className='font-semibold'>
                {scoreRaw} <span className='text-gray'>из {scoreMax}</span>
              </p>
            </div>
            <div className='flex flex-col gap-2.5'>
              <Button onClick={() => setIsTaskOpen(true)}>Задание</Button>
              <Button onClick={() => setIsConfirmOpen(true)}>Завершить досрочно</Button>
            </div>
          </div>
        </div>
      )}
      <TaskModal isOpened={isTaskOpen} onClose={() => setIsTaskOpen(false)} />
      <FinishModal isOpened={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} />
    </>
  )
}
