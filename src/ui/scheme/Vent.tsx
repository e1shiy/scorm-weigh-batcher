import { Indicator } from './Indicator.tsx'
import { Panel } from './Panel.tsx'
import { MotorButton } from './MotorButton.tsx'
import { ValuesBadge } from './ValuesBadge.tsx'
import { usePopUpStore } from './pop-up/usePopUpStore.ts'
import type { VentId } from '../../scenario/objects.ts'
import { useScenarioStore } from '../../scenario/useScenarioStore.ts'

interface VentProps {
  id: VentId
}

export function Vent({ id }: VentProps) {
  const setIsOpen = usePopUpStore(s => s.setIsOpen)
  const setObjectId = usePopUpStore(s => s.setObjectId)
  const handlePopUpOpen = () => {
    setObjectId(id)
    setIsOpen(true)
  }

  const { status, value: payload } = useScenarioStore(s => s.objects[id])
  const { running, amperage } = payload

  return (
    <div className='flex-center flex-col'>
      <Panel id={'2M' + id} headerClassName='bg-light-seagreen' />
      <div className='flex -space-x-1'>
        <Indicator className='bg-light-yellow z-10'>W</Indicator>
        <MotorButton onClick={handlePopUpOpen} isRunning={running} hasBorder={true} hasLabel={true}></MotorButton>
        <Indicator className={!running ? 'bg-light-seagreen' : status === 'auto' ? 'bg-neon-green' : ''}>
          {!running ? 'L' : status === 'auto' ? 'A' : 'M'}
        </Indicator>
      </div>
      <ValuesBadge payload={[{ value: amperage, unit: 'A' }]} />
    </div>
  )
}
