import { Indicator } from './Indicator'
import { Panel } from './Panel'
import { MotorButton } from './MotorButton'
import { ValuesBadge } from './ValuesBadge'
import { useScenarioStore } from '../../scenario/useScenarioStore'
import type { VentId } from '../../scenario/objects'
import { usePopUpStore } from './pop-up/usePopUpStore'

export interface VentProps {
  id: VentId
}

export function Vent({ id }: VentProps) {
  const setIsOpen = usePopUpStore(s => s.setIsOpen)
  const setObjectId = usePopUpStore(s => s.setObjectId)
  const handlePopUpOpen = () => {
    setObjectId(id)
    setIsOpen(true)
  }

  const { value } = useScenarioStore(s => s.objects[id])
  const { running, amperage } = value

  const modeIndicator = <Indicator className={running ? 'bg-light-seagreen' : ''}>{running ? 'M' : 'L'}</Indicator>

  return (
    <div className='flex-center flex-col'>
      <Panel id={'2M' + id} headerClassName='bg-light-seagreen' />
      <div className='flex -space-x-1'>
        <Indicator className='bg-light-yellow z-10'>W</Indicator>
        <MotorButton isRunning={running} hasBorder hasLabel onClick={handlePopUpOpen} />
        {modeIndicator}
      </div>
      <ValuesBadge payload={[{ value: amperage, unit: 'A' }]} />
    </div>
  )
}