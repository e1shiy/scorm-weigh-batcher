import { useState } from 'react'
import { useProcedureStore } from '../procedure/useProcedureStore'
import { Button } from '../ui/components/Button'
import SettingsIcon from '../assets/icons/settings.svg?react'
import ChevronIcon from '../assets/icons/chevron.svg?react'

export function ActionPanel() {
  const submitAction = useProcedureStore(s => s.submitAction)
  const [isClosed, setIsClosed] = useState(window.innerWidth < 768)

  return isClosed ? (
    <button
      onClick={() => setIsClosed(false)}
      className='py-3.75 w-7 flex flex-col gap-6.25 items-center shrink-0 bg-light cursor-pointer hover:bg-light-gray text-blue rounded-st'
    >
      <ChevronIcon className='w-3 h-4' />
      <div className='grow flex flex-col gap-3.75 justify-between items-center'>
        <p className='[writing-mode:vertical-rl] tracking-[1.5px]'>Действия по установке</p>
        <SettingsIcon className='w-4 h-4 rotate-90' />
      </div>
    </button>
  ) : (
    <div className='w-80 max-md:w-60 shrink-0 bg-light text-blue rounded-st p-2.5 flex flex-col gap-5'>
      <div className='flex justify-between items-center gap-1.25'>
        <div className='flex gap-2.5 flex-center'>
          <SettingsIcon className='w-4 h-4' />
          <p className='text-nowrap'>Действия по установке</p>
        </div>
        <Button onClick={() => setIsClosed(true)} variant='light-borderless' className='w-8 h-8'>
          <ChevronIcon className='w-2.5 h-3.5 rotate-180' />
        </Button>
      </div>
      <div className='flex flex-col gap-2.5'>
        <Button onClick={() => submitAction('visual-inspection')} variant='light' className='text-nowrap'>
          Визуальный осмотр
        </Button>
        <Button onClick={() => submitAction('start-electric-motor')} variant='light' className='text-nowrap'>
          Пуск электродвигателя
        </Button>
      </div>
    </div>
  )
}
