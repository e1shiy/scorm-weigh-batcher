import { useScormStore } from './api/useScormStore'
import { HistoryPanel } from './widgets/HistoryPanel'
import { ActionPanel } from './widgets/ActionPanel'
import { ProgressBar } from './widgets/ProgressBar'
import { EquipmentDiagram } from './widgets/EquipmentDiagram'
import { ResultsModal } from './ui/modals/ResultsModal'
import logoSrc from './assets/logo.png'

function App() {
  // SCORM init (появляется при запуске в LMS):
  // useEffect(() => {
  //   initialize()
  //   window.addEventListener('beforeunload', finish)
  //   window.addEventListener('pagehide', finish)
  //   return () => {
  //     window.removeEventListener('beforeunload', finish)
  //     window.removeEventListener('pagehide', finish)
  //   }
  // }, [initialize, finish])

  const isFinished = useScormStore(s => s.isTerminated)

  return (
    <>
      <div className='grow max-h-full flex gap-2.5 p-2.5'>
        <div className='grow flex flex-col gap-2.5'>
          <div className='flex gap-3 h-10'>
            <img className='w-31 h-full shrink-0' src={logoSrc} alt='ЕвроХим' loading='lazy' />
            <ProgressBar />
          </div>
          <div className='grow flex gap-2.5'>
            <ActionPanel />
            <EquipmentDiagram />
          </div>
        </div>
        <HistoryPanel />
      </div>
      <ResultsModal isOpened={isFinished} />
    </>
  )
}

export default App
