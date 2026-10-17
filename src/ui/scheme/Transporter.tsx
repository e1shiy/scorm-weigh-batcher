import { MotorButton } from './MotorButton'
import { twMerge } from 'tailwind-merge'
import { ValuesBadge } from './ValuesBadge.tsx'
import { Panel } from './Panel.tsx'
import { Indicator } from './Indicator.tsx'
import LockedLockIcon from '../../assets/icons/locked-lock.svg?react'
import OpenedLockIcon from '../../assets/icons/opened-lock.svg?react'
import type { TransporterId } from '../../scenario/objects.ts'
import { usePopUpStore } from './pop-up/usePopUpStore.ts'
import { useScenarioStore } from '../../scenario/useScenarioStore.ts'

interface TransporterProps {
  id: TransporterId
  length: 'small' | 'medium' | 'large'
  payload?: {
    value: number
    unit: string
  }[]
  isReversed?: boolean
  isLocked?: boolean
}

const lengths = {
  small: 'w-24',
  medium: 'w-67',
  large: 'w-73'
}

export function Transporter({ id, length, payload, isReversed, isLocked }: TransporterProps) {
  const setIsOpen = usePopUpStore(s => s.setIsOpen)
  const setObjectId = usePopUpStore(s => s.setObjectId)
  const handlePopUpOpen = () => {
    setObjectId(id)
    setIsOpen(true)
  }

  const { status, value } = useScenarioStore(s => s.objects[id])
  const { running, setpoint, amperage } = value
  const values = [{ value: setpoint ?? 0, unit: '%' }, { value: amperage, unit: 'A' }]

  const isValuesBadgeVisible = payload?.length || setpoint || amperage
  const statusBg = isLocked ? 'bg-light-seagreen' : status === 'auto' && 'bg-neon-green'

  return (
    <div className={twMerge('flex flex-col', isReversed ? 'items-end' : 'items-start')}>
      <Panel id={'2K' + id} headerClassName='bg-light-seagreen' />
      <div className={twMerge('p-0.5 bg-gray border border-black rounded-full', isReversed ? 'mr-2' : 'ml-2')}>
        <div className={twMerge('border border-black bg-light-gray rounded-full text-[8px] text-black font-semibold', lengths[length])}>
          <div className={twMerge('flex justify-between items-center', isReversed && 'flex-row-reverse')}>
            <div className='relative'>
              <Indicator className={twMerge('absolute right-full bg-gray-alt')}>I</Indicator>
              <Indicator className='absolute right-full top-full -translate-y-2 bg-light-seagreen text-light'>P</Indicator>
              <MotorButton onClick={handlePopUpOpen} isRunning={running} hasLabel={true} className='-mx-px' />
              <Indicator className={twMerge('absolute left-full bottom-full translate-y-2.25', statusBg)}>
                {isLocked ? 'L' : status === 'manual' ? 'M' : 'A'}
              </Indicator>
              {isLocked !== false && !running && (
                <div className='absolute left-full top-full -translate-y-2'>{isLocked ? <LockedLockIcon /> : <OpenedLockIcon />}</div>
              )}
            </div>
            <span className='text-[8px]'>{id}</span>
            <MotorButton isRunning={running} hasLabel={false} className='-mx-px' />
          </div>
        </div>
      </div>
      {isValuesBadgeVisible && <ValuesBadge payload={ payload?.length ? payload : values } />}
    </div>
  )
}
