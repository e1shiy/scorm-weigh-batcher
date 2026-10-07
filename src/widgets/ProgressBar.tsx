import type { CSSProperties } from 'react'
import { twMerge } from 'tailwind-merge'
import { useScenarioStore } from '../scenario/useScenarioStore'

export function ProgressBar() {
  const currentStepIndex = useScenarioStore(s => s.currentStepIndex)
  const totalSteps = useScenarioStore(s => s.totalSteps)
  const progress = totalSteps === 0 ? 0 : Math.floor((currentStepIndex / totalSteps) * 100)

  return (
    <div className='grow relative flex-center h-full p-1 rounded-st bg-light'>
      <div
        style={{ '--sco-progress': `${progress}%` } as CSSProperties}
        className={twMerge(
          'flex-center w-full h-full relative',
          'after:absolute after:left-0 after:w-(--sco-progress) after:transition-[width] after:duration-400 after:h-full after:bg-orange after:rounded-[3px]'
        )}
      >
        <p className='text-dark font-semibold z-2 text-nowrap'>
          <span className='max-md:hidden'>Прогресс прохождения: </span>
          {progress}%
        </p>
      </div>
    </div>
  )
}
