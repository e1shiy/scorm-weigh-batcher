import { useScenarioStore } from '../../scenario/useScenarioStore'
import { Button } from '../../ui/components/Button'
import Tooltip from '../../ui/components/Tooltip'
import { useRef } from 'react'
import ChevronIcon from '../../assets/icons/chevron.svg?react'
import ChevronLockedIcon from '../../assets/icons/chevron-locked.svg?react'
import { useScrollEdges } from './useScrollEdges'
import { twMerge } from 'tailwind-merge'

export function AdminPanel() {
  const { steps, totalSteps, currentStepIndex, setCurrentStep } = useScenarioStore()

  const scrollByDir = (dir: 1 | -1) => {
    navRef.current?.scrollBy({
      left: dir * navRef.current.clientWidth * 0.4,
      behavior: 'smooth'
    })
  }

  const navRef = useRef<HTMLElement>(null)
  const { hasScroll, isAtStart, isAtEnd } = useScrollEdges(navRef)

  return (
    <div className='flex flex-col gap-2.5 p-2.5 min-w-0'>
      <p>Перейти на шаг:</p>
      <div className='flex gap-1.5 min-w-0'>
        {hasScroll && (
          <Button disabled={isAtStart} className='size-9 border-none shrink-0' onClick={() => scrollByDir(-1)}>
            {isAtStart ? <ChevronLockedIcon className='size-full rotate-180' /> : <ChevronIcon className='size-full rotate-180' />}
          </Button>
        )}

        <nav className='flex px-px gap-2.5 overflow-x-scroll scrollbar-none min-w-0' ref={navRef}>
          {Array.from({ length: totalSteps }).map((_, i) => {
            const currentStep = steps[i]
            if (!currentStep) return
            return (
              <Tooltip key={currentStep.id} content={currentStep.title} delay={100}>
                <Button
                  variant={currentStepIndex > i ? 'light-borderless' : 'dark'}
                  className={'size-9 text-[16px] font-normal shrink-0'}
                  onClick={() => {
                    setCurrentStep(i + 1)
                  }}
                >
                  {i + 1}
                </Button>
              </Tooltip>
            )
          })}
        </nav>

        {hasScroll && (
          <Button className={twMerge('size-9 border-none shrink-0')} disabled={isAtEnd} onClick={() => scrollByDir(1)}>
            {isAtEnd ? <ChevronLockedIcon className='size-full' /> : <ChevronIcon className='size-full' />}
          </Button>
        )}
      </div>
    </div>
  )
}
