import { useScenarioStore } from '../../scenario/useScenarioStore'
import { getActionState } from '../../scenario/engine'
import { Button } from '../../ui/components/Button'
import Tooltip from '../../ui/components/Tooltip'
import { useRef } from 'react'
import ChevronIcon from '../../assets/icons/chevron.svg?react'
import ChevronLockedIcon from '../../assets/icons/chevron-locked.svg?react'
import { useScrollEdges } from './useScrollEdges'
import { twMerge } from 'tailwind-merge'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

export function AdminPanel() {
  const { steps, totalSteps, currentStepIndex, stepProgress, setCurrentStep, activateAction } = useScenarioStore()
  const activeStep = steps[currentStepIndex] // undefined, когда сценарий завершён
  const prefersReducedMotion = useReducedMotion()

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
                    setCurrentStep(currentStepIndex === i + 1 ? i : i + 1)
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

      <AnimatePresence mode='wait' initial={false}>
        {activeStep && (
          <motion.div
            key={activeStep.id}
            className='flex flex-col gap-1.5 overflow-hidden'
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: 'auto',
              transition: { duration: prefersReducedMotion ? 0 : 0.2, delay: prefersReducedMotion ? 0 : 0.08, ease: 'easeInOut' }
            }}
            exit={{
              opacity: 0,
              height: 0,
              pointerEvents: 'none',
              transition: { duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeInOut' }
            }}
          >
            <p>
              Шаг {currentStepIndex + 1}: {activeStep.title}
            </p>
            {activeStep.groups.map((group, g) => (
              <div key={g} className='flex flex-wrap gap-1.5'>
                {group.actions.map((action, a) => {
                  const state = getActionState(activeStep, stepProgress, g, a)
                  return (
                    <Button
                      key={a}
                      variant={state === 'done' ? 'light-borderless' : 'dark'}
                      disabled={state === 'locked'}
                      className='h-9 px-2.5 text-[14px] font-normal'
                      onClick={() => activateAction(g, a)}
                    >
                      {group.type === 'sequence' && `${a + 1}. `}
                      {[action.meta.title, action.meta.description].filter(Boolean).join(' · ')}
                    </Button>
                  )
                })}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
