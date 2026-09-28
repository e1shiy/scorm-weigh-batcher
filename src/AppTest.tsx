import { useState } from 'react'
import { Panel } from './ui/scheme/Panel'
import { PopUp } from './ui/scheme/PopUp'
import { Valve } from './ui/scheme/Valve'
import SchemeCover from './assets/icons/scheme-cover.svg?react'

export default function App() {
  const [open, setOpen] = useState(true)
  return (
    <>
      <SchemeCover className={'w-full h-full'} />
      <div className='p-10 flex gap-6 items-start font-secondary'>
        <Panel id='2AIC-500' headerClassName='bg-[#743C03]' />
        <Panel id='2AIC-500' value={0.86} headerClassName='bg-[#743C03]' />
        <Panel id='2AIC-500' value={77.0} secondValue={77.0} status='manual' unit='мСм/м' headerClassName='bg-[#C59028]' />
        <Panel id='2P-261' value={3.4} unit='кг/см2' />
        <Panel
          id='2FIC-389'
          value={88.3}
          secondValue={88.3}
          status='auto'
          unit='м3/ч'
          headerClassName='bg-[#C59028]'
          indicatorSlot={<p className='w-2.25 flex-center text-[#FF0200]'>F</p>}
        />
        <Valve onClick={() => setOpen(true)} id={'2FC-310'} value={31.9} status='auto' isVertical={false} />
        <Valve id={'2SH3136_3'} value={27.9} status='manual' isVertical={true} />
      </div>
      {open && <PopUp onClose={() => setOpen(false)} />}
    </>
  )
}
