import { twMerge } from 'tailwind-merge'
import { Panel } from './Panel.tsx'
import { MotorButton } from './MotorButton.tsx'
import { Indicator } from './Indicator.tsx'
import { ValuesBadge } from './ValuesBadge.tsx'
import { usePopUpStore } from './pop-up/usePopUpStore.ts'
import type { PumpId } from '../../scenario/objects.ts'
import { useScenarioStore } from '../../scenario/useScenarioStore.ts'

export interface PumpProps {
  id: PumpId
  className?: string
}

export function Pump({ id, className }: PumpProps) {
  const setIsOpen = usePopUpStore(s => s.setIsOpen)
  const setObjectId = usePopUpStore(s => s.setObjectId)
  const handlePopUpOpen = () => {
    setObjectId(id)
    setIsOpen(true)
  }

  const { status, value: payload } = useScenarioStore(s => s.objects[id])
  const { running, setpoint, amperage } = payload

  const values = []
  if (setpoint !== undefined) values.push({ value: setpoint, unit: '%' })
  if (amperage !== undefined) values.push({ value: amperage, unit: 'A' })

  const statusBg = status === 'manual' ? 'bg-red' : 'bg-neon-green'

  return (
    <div className={twMerge('flex-center justify-start flex-col text-[8px]', className)}>
      <Panel id={`2H${id}`} headerClassName='bg-light-seagreen' />
      <div className='flex'>
        <div className='flex flex-col justify-between'>
          <Indicator className='bg-bright-blue text-light'>E</Indicator>
          <Indicator className='bg-light-seagreen text-light'>P</Indicator>
        </div>
        <MotorButton onClick={handlePopUpOpen} isRunning={running} hasLabel hasArrow hasBorder />
        <Indicator className={statusBg}>{status === 'manual' ? 'M' : 'A'}</Indicator>
      </div>
      <ValuesBadge payload={values} />
    </div>
  )
}
