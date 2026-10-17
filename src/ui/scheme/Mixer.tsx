import { twMerge } from 'tailwind-merge'
import { Indicator } from './Indicator'
import { ValuesBadge } from './ValuesBadge'
import { Panel } from './Panel'
import { MotorButton } from './MotorButton.tsx'
import MixerIcon from '../../assets/icons/mixer.svg?react'
import { useScenarioStore } from '../../scenario/useScenarioStore.ts'
import type { MixerId } from '../../scenario/objects.ts'
import { usePopUpStore } from './pop-up/usePopUpStore.ts'

interface MixerProps {
  id: MixerId
}

export function Mixer({ id }: MixerProps) {
  const setIsOpen = usePopUpStore(s => s.setIsOpen)
  const setObjectId = usePopUpStore(s => s.setObjectId)
  const handlePopUpOpen = () => {
    setObjectId(id)
    setIsOpen(true)
  }

  const { status, value: payload } = useScenarioStore(s => s.objects[id])
  const { running, amperage } = payload

  const modeBadge = (
    <Indicator className={status === 'auto' ? 'bg-light-seagreen' : 'bg-gray-alt'}>{status === 'manual' ? 'M' : 'L'}</Indicator>
  )

  return (
    <div className={twMerge('flex-center flex-col gap-px')}>
      <Panel id={`2M${id}`} headerClassName='bg-light-seagreen' />
      <div className='flex mb-0.75 relative gap-0.5'>
        <Indicator className={running ? 'bg-light-seagreen' : 'bg-red'}>{running ? 'P' : 'A'}</Indicator>
        <MotorButton hasLabel isRunning={running} onClick={handlePopUpOpen} />
        <MixerIcon className='absolute top-full left-1/2 -translate-x-1/2' />
        {modeBadge}
      </div>
      <ValuesBadge className='z-10' payload={[{ value: amperage, unit: 'A' }]} />
    </div>
  )
}
