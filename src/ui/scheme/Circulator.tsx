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
import {twMerge} from "tailwind-merge";

export interface CirculatorProps {
  id: CirculatorId
    className?: string
}

export function Circulator({ id, className }: CirculatorProps) {
  const setIsOpen = usePopUpStore(s => s.setIsOpen)
  const setObjectId = usePopUpStore(s => s.setObjectId)
  const handlePopUpOpen = () => {
    setObjectId(id)
    setIsOpen(true)
  }

  const setObject = useScenarioStore(s => s.setObject)
  const { status, value: payload } = useScenarioStore(s => s.objects[id])
  const { running, amperage, setpoint } = payload

  const toggleSetpoint = (value: number) => setObject({ id, status, value: { running, amperage, setpoint: value } })

  const values = []
  if (setpoint !== undefined) values.push({ value: setpoint, unit: '%' })
  if (amperage !== undefined) values.push({ value: amperage, unit: 'A' })

  const modeBadge = <Indicator className={status === 'auto' ? 'bg-neon-green' : ''}>{status === 'manual' ? 'M' : 'A'}</Indicator>

  return (
    <div className={twMerge('flex flex-col justify-start items-center gap-px', className)}>
      <VentPanel isRunning={running} />
      <Panel id={`2Н${id}`} headerClassName='bg-light-seagreen' />
      <div className='flex gap-0.5'>
        <div className='flex-center flex-col gap-px'>
          <Indicator className='size-2.25'>I</Indicator>
          <Indicator className='bg-light-seagreen size-2.25'>P</Indicator>
        </div>
        <MotorButton isRunning={running} hasLabel hasArrow onClick={handlePopUpOpen} />
        {modeBadge}
      </div>
      <div className='relative'>
        <ValuesBadge payload={values} className='z-10' />
        <LongMixerIcon className='absolute top-full left-1/2 -translate-x-1/2' />
      </div>
      <div className='flex-center gap-1.25 mt-1.25 z-10'>
        <LoadPanel onClick={() => toggleSetpoint(30)} load={30} isActive={setpoint === 30} />
        <LoadPanel onClick={() => toggleSetpoint(100)} load={100} isActive={setpoint === 100} />
      </div>
    </div>
  )
}
