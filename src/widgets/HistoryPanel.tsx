import { useLayoutEffect, useRef, useState, useMemo } from 'react'
import { useScormStore } from '../api/useScormStore'
import { useScenarioStore } from '../scenario/useScenarioStore'
import { useCollapsiblePanel } from '../lib/useCollapsiblePanel'
import { useIsMaxMd } from '../lib/useMediaQuery'
import { CollapsiblePanel } from '../ui/components/CollapsiblePanel'
import { Button } from '../ui/components/Button'
import { TaskModal } from '../ui/modals/TaskModal'
import { FinishModal } from '../ui/modals/FinishModal'
import ClockIcon from '../assets/icons/clock.svg?react'
import TrophyIcon from '../assets/icons/trophy.svg?react'
import ChevronIcon from '../assets/icons/chevron.svg?react'
import TaskIcon from '../assets/icons/task.svg?react'
import CancelIcon from '../assets/icons/cancel.svg?react'
import Tooltip from '../ui/components/Tooltip'

const OPEN_WIDTH = 320
const OPEN_WIDTH_NARROW = 280

export function HistoryPanel() {
  const isNarrow = useIsMaxMd()
  const { isOpen, open, close, expandToggleRef, collapseToggleRef } = useCollapsiblePanel(isNarrow)

  const scoreRaw = useScormStore(s => s.scoreRaw)
  const scoreMax = useScormStore(s => s.scoreMax)
  const history = useScenarioStore(s => s.history)

  const [isTaskOpen, setIsTaskOpen] = useState(true)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const listRef = useRef<HTMLDivElement>(null)
  const listScrollTopRef = useRef(0)

  useLayoutEffect(() => {
    const list = listRef.current
    if (isOpen && list) {
      list.scrollTop = listScrollTopRef.current
    }
  }, [isOpen])

  const handleClose = () => {
    listScrollTopRef.current = listRef.current?.scrollTop ?? 0
    close()
  }

  const renderedHistory = useMemo(() => {
    return history.map((entry, index) => {
      const { id, meta, scoreDelta, isSuccess } = entry
      const { title, description } = meta
      return (
        <div key={id} className='text-blue flex justify-between items-end'>
          <div className='w-57.5 flex flex-col gap-1'>
            <p className='leading-[110%]'>
              {history.length - index}. {title}
            </p>
            {description && <p className='text-dark font-medium'>{description}</p>}
          </div>
          {!isSuccess && <p>{scoreDelta}</p>}
        </div>
      )
    })
  }, [history])

  const openWidth = isNarrow ? OPEN_WIDTH_NARROW : OPEN_WIDTH

  return (
    <>
      <CollapsiblePanel
        isOpen={isOpen}
        openWidth={openWidth}
        anchor='right'
        expanded={
          <div className='h-full w-full flex flex-col gap-2.5'>
            <div className='flex gap-1.25 justify-between items-center h-10'>
              <div className='flex gap-2.5 items-center'>
                <ClockIcon className='w-4 h-4' />
                <p>История</p>
              </div>
              <Tooltip content='Свернуть'>
                <Button
                  variant='dark'
                  ref={collapseToggleRef}
                  onClick={handleClose}
                  className='border-none w-7 h-full'
                  aria-expanded={isOpen}
                  aria-label='Свернуть историю'
                >
                  <ChevronIcon className='w-2 h-4' />
                </Button>
              </Tooltip>
            </div>
            <div className='grow min-h-0 flex flex-col gap-5'>
              <div ref={listRef} className='bg-light rounded-st grow overflow-y-auto overflow-x-clip'>
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
                <Button onClick={() => setIsTaskOpen(true)} variant='dark'>
                  Задание
                </Button>
                <Button onClick={() => setIsConfirmOpen(true)} variant='dark'>
                  Завершить досрочно
                </Button>
              </div>
            </div>
          </div>
        }
        collapsed={
          <div className='h-full w-full flex flex-col gap-2.5'>
            <Tooltip content='Развернуть'>
              <Button
                variant='dark'
                ref={expandToggleRef}
                onClick={open}
                className='border-none w-full h-10'
                aria-expanded={isOpen}
                aria-label='Развернуть историю'
              >
                <ChevronIcon className='w-2 h-4 rotate-180' />
              </Button>
            </Tooltip>
            <button
              type='button'
              onClick={open}
              aria-label='Развернуть историю'
              className='grow flex flex-col justify-between py-3.75 cursor-pointer rounded-st hover:bg-dark/60'
            >
              <div className='flex-center flex-col gap-2.5'>
                <ClockIcon className='w-4 h-4' />
                <p className='[writing-mode:vertical-rl] tracking-[1.5px] font-normal text-nowrap'>История</p>
              </div>
              <div className='flex-center flex-col gap-1.25'>
                <div className='flex-center flex-col gap-2.5'>
                  <TrophyIcon className='w-4 h-4' />
                  <p className='font-semibold [writing-mode:vertical-rl] tracking-[1.5px] text-nowrap'>Баллы:</p>
                </div>
                <p className='font-semibold [writing-mode:vertical-rl] tracking-[1.5px] text-nowrap'>
                  {scoreRaw} <span className='text-gray'>из {scoreMax}</span>
                </p>
              </div>
            </button>
            <div className='flex flex-col gap-2.5'>
              <Tooltip content='Задание'>
                <Button onClick={() => setIsTaskOpen(true)} className='p-1' variant='dark'>
                  <TaskIcon />
                </Button>
              </Tooltip>
              <Tooltip content='Завершить досрочно'>
                <Button onClick={() => setIsConfirmOpen(true)} className='p-1' variant='dark'>
                  <CancelIcon />
                </Button>
              </Tooltip>
            </div>
          </div>
        }
      />
      <TaskModal isOpened={isTaskOpen} onClose={() => setIsTaskOpen(false)} />
      <FinishModal isOpened={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} />
    </>
  )
}
