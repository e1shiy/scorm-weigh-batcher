import { useScormStore } from './api/useScormStore'
import { HistoryPanel } from './widgets/HistoryPanel'
import { ActionPanel } from './widgets/ActionPanel'
import { ProgressBar } from './widgets/ProgressBar'
import { EquipmentDiagram } from './widgets/EquipmentDiagram'
import { ResultsModal } from './ui/modals/ResultsModal'
import logoSrc from './assets/logo.png'
import { AdminPanel } from './widgets/admin/AdminPanel'
import { useAdminStore } from './widgets/admin/useAdminStore'
import { AnimatePresence, motion } from 'motion/react'

function App() {
  // const initialize = useScormStore(s => s.initialize)
  // const finish = useScormStore(s => s.finish)

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
  const isAdmin = useAdminStore(s => s.isAdmin)

  return (
    <>
      <div className='grow max-h-full flex gap-2.5 p-2.5'>
        <div className='grow flex flex-col gap-2.5 min-w-0'>
          <div className='flex gap-3 h-10'>
            <img className='w-31 h-full shrink-0' src={logoSrc} alt='ЕвроХим' loading='lazy' />
            <ProgressBar />
          </div>
          <motion.div transition={{ duration: 0.2 }} layout className='grow flex gap-2.5'>
            <ActionPanel />
            <EquipmentDiagram />
          </motion.div>
          <AnimatePresence>
            {isAdmin && (
              <motion.div
                className='overflow-hidden'
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <AdminPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <HistoryPanel />
      </div>
      <ResultsModal isOpened={isFinished} />
    </>
  )
}

export default App
