import type { MouseEventHandler } from 'react'
import ValveIcon from '../../assets/icons/valve.svg?react'
import { Panel } from './Panel'

// 1. Единый базовый квадратик (E, I, M/A)
const StatusBadge = ({
  label,
  bg,
  text = 'text-black',
  onClick
}: {
  label: string
  onClick: MouseEventHandler
  bg: string
  text?: string
}) => (
  <div
    onClick={onClick}
    className={`w-2.75 cursor-pointer h-2.75 border border-black font-bold text-[7.5px] flex items-center justify-center leading-none select-none ${bg} ${text}`}
  >
    {label}
  </div>
)

export interface ValveProps {
  id: string
  value?: number
  status?: 'manual' | 'auto'
  isVertical?: boolean
  onClick?: () => void
}

// 3. Основной компонент
export const Valve = ({ id, isVertical, status, value, onClick }: ValveProps) => {
  const valueBadge = (
    <div className='border border-black bg-[#D9D9D9] p-px flex items-center gap-0.5 leading-none h-3.75'>
      <div className='bg-white border border-black px-1 h-2.75 flex items-center justify-center font-bold text-[8px] text-black min-w-6'>
        {value?.toFixed(2)}
      </div>
      <span className='text-[8px] font-bold text-black pr-0.5 select-none'>%</span>
    </div>
  )

  const modeBadge = (
    <StatusBadge onClick={onClick} label={status === 'manual' ? 'M' : 'A'} bg={status === 'manual' ? 'bg-[#D9D9D9]' : 'bg-[#03FD07]'} />
  )

  return isVertical ? (
    <div className='flex items-start gap-[1.5px]'>
      <StatusBadge label='I' bg='bg-[#D9D9D9]' />
      <ValveIcon className='w-6.5 h-4.5 rotate-90 relative top-2' />
      <div className='flex flex-col items-start gap-px'>
        {modeBadge}
        {valueBadge}
        <Panel id={id} headerClassName='bg-[#259229]' />
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center gap-[1.5px]'>
      <Panel id={id} headerClassName='bg-[#259229]' />
      <div className='flex items-center gap-0.5'>
        <StatusBadge label='E' bg='bg-[#004CB7]' text='text-white' />
        <ValveIcon className='w-6.5 h-4.5' />
        {modeBadge}
      </div>
      {valueBadge}
    </div>
  )
}
