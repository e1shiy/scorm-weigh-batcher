import type { ValveId } from '../../scenario/objects'
import { useScenarioStore } from '../../scenario/useScenarioStore'
import { Panel } from './Panel'
import { usePopUpStore } from './pop-up/usePopUpStore'

interface ValvePanelProps {
  id: ValveId
}

export function ValvePanel({ id }: ValvePanelProps) {
  const setIsOpen = usePopUpStore(s => s.setIsOpen)
  const setObjectId = usePopUpStore(s => s.setObjectId)
  const handlePopUpOpen = () => {
    setObjectId(id)
    setIsOpen(true)
  }

  const { status, value: payload } = useScenarioStore(s => s.objects[id])
  const { amperage } = payload
  return (
    <Panel
      id={id}
      status={status}
      value={amperage.toString()}
      unit={'А'}
      onStatusClick={handlePopUpOpen}
      headerClassName='bg-dark-orange'
    />
  )
}
