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

  const { status, value } = useScenarioStore(s => s.objects[id])

  // Panel не принимает onStatusClick, поэтому клик ловим на обёртке.
  return (
    <div onClick={handlePopUpOpen} className='cursor-pointer'>
      <Panel id={id} status={status} value={value.amperage} unit='А' headerClassName='bg-dark-orange' />
    </div>
  )
}