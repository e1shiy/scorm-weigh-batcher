import { useCollapsiblePanel } from '../lib/useCollapsiblePanel'
import { useIsMaxMd } from '../lib/useMediaQuery'
import { CollapsiblePanel } from '../ui/components/CollapsiblePanel'
import { Button } from '../ui/components/Button'
import SettingsIcon from '../assets/icons/settings.svg?react'
import ChevronIcon from '../assets/icons/chevron.svg?react'
import Tooltip from '../ui/components/Tooltip'
import { useScenarioStore } from '../scenario/useScenarioStore'

const OPEN_WIDTH = 320
const OPEN_WIDTH_NARROW = 240

export function ActionPanel() {
  const setObject = useScenarioStore(s => s.setObject)

  const isNarrow = useIsMaxMd()
  const { isOpen, open, close, expandToggleRef, collapseToggleRef } = useCollapsiblePanel(isNarrow)

  return (
    <CollapsiblePanel
      isOpen={isOpen}
      openWidth={isNarrow ? OPEN_WIDTH_NARROW : OPEN_WIDTH}
      anchor='left'
      expanded={
        <div className='h-full w-full bg-light text-blue rounded-st p-2.5 flex flex-col gap-5'>
          <div className='flex justify-between items-center gap-1.25'>
            <div className='flex gap-2.5 items-center'>
              <SettingsIcon className='w-4 h-4' />
              <p className='text-nowrap'>Действия по установке</p>
            </div>
            <Tooltip content='Свернуть'>
              <Button
                ref={collapseToggleRef}
                onClick={close}
                variant='light-borderless'
                className='w-8 h-8'
                aria-expanded={isOpen}
                aria-label='Свернуть панель действий'
              >
                <ChevronIcon className='w-2.5 h-3.5 rotate-180' />
              </Button>
            </Tooltip>
          </div>
          <div className='flex flex-col gap-2.5'>
            <Button
              onClick={() => setObject({ id: 'inspection', status: 'manual', value: { checked: true } })}
              variant='light'
              className='text-nowrap'
            >
              Визуальный осмотр
            </Button>
          </div>
        </div>
      }
      collapsed={
        <Tooltip content='Развернуть'>
          <button
            ref={expandToggleRef}
            type='button'
            onClick={open}
            aria-expanded={isOpen}
            aria-label='Развернуть панель действий'
            className='h-full w-full py-3.75 flex flex-col gap-6.25 items-center shrink-0 bg-light cursor-pointer hover:bg-light-gray text-blue rounded-st'
          >
            <ChevronIcon className='w-3 h-4' />
            <div className='grow flex flex-col gap-3.75 justify-between items-center'>
              <p className='[writing-mode:vertical-rl] tracking-[1.5px] text-nowrap'>Действия по установке</p>
              <SettingsIcon className='w-4 h-4 rotate-90' />
            </div>
          </button>
        </Tooltip>
      }
    />
  )
}
