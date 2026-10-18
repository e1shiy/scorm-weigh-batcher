import { VentPanel } from './VentPanel'
import { Panel } from './Panel'
import { Indicator } from './Indicator'
import { MotorButton } from './MotorButton'
import { ValuesBadge } from './ValuesBadge'
import { LoadPanel } from './LoadPanel'
import LongMixerIcon from '../../assets/icons/long-mixer.svg?react'
import { useScenarioStore } from '../../scenario/useScenarioStore'
import type { CirculatorId } from '../../scenario/objects'
import { usePopUpStore } from './pop-up/usePopUpStore'

export interface CirculatorProps {
  id: CirculatorId
}

export function Circulator({ id }: CirculatorProps) {
  const setIsOpen = usePopUpStore(s => s.setIsOpen)
  const setObjectId = usePopUpStore(s => s.setObjectId)
  const handlePopUpOpen = () => {
    setObjectId(id)
    setIsOpen(true)
  }

  const { status, value: payload } = useScenarioStore(s => s.objects[id])
  const { running, amperage } = payload
  const load = payload.setpoint ?? 0

  const modeBadge = (
    <Indicator className={status === 'auto' ? 'bg-neon-green' : ''}>{status === 'manual' ? 'M' : 'A'}</Indicator>
  )

  return (
    <div className='flex flex-col justify-start items-center gap-0.25'>
      <VentPanel isRunning={running} />
      <Panel id={`2Н${id}`} headerClassName='bg-light-seagreen' />
      <div className='flex gap-0.5'>
        <div className='flex-center flex-col gap-0.25'>
          <Indicator className='size-2.25'>I</Indicator>
          <Indicator className='bg-light-seagreen size-2.25'>P</Indicator>
        </div>
        <MotorButton isRunning={running} hasLabel hasArrow onClick={handlePopUpOpen} />
        {modeBadge}
      </div>
      <div className='relative'>
        <ValuesBadge payload={[{ value: load, unit: '%' }, { value: amperage, unit: 'A' }]} className='z-10' />
        <LongMixerIcon className='absolute top-full left-1/2 -translate-x-1/2' />
      </div>
      <div className='flex-center gap-1.25 mt-1.25'>
        <LoadPanel load={30} isActive={load === 30} />
        <LoadPanel load={100} isActive={load === 100} />
      </div>
    </div>
  )
}