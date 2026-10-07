import { Indicator } from './Indicator'
import { Panel } from './Panel'
import ValveHorizontalIcon from '../../assets/icons/valve-horizontal.svg?react'
import ValveVerticalIcon from '../../assets/icons/valve-vertical.svg?react'
import { ValuesBadge } from './ValuesBadge'
import { twMerge } from 'tailwind-merge'

export interface ValveProps {
  id: string
  value: number
  status?: 'manual' | 'auto'
  isVertical?: boolean
}

export const Valve = ({ id, isVertical, status, value }: ValveProps) => {
  const modeBadge = <Indicator className={status === 'auto' ? 'bg-[#03FD07]' : ''}>{status === 'manual' ? 'M' : 'A'}</Indicator>

  return isVertical ? (
    <div className='flex gap-px'>
      <Indicator>I</Indicator>
      <ValveVerticalIcon className='w-4 h-6.5 translate-y-0.5' />
      <div className='flex flex-col items-start gap-px'>
        {modeBadge}
        <ValuesBadge payload={[{ value, unit: '%' }]} />
        <Panel id={id} headerClassName='bg-[#259229]' />
      </div>
    </div>
  ) : (
    <div className='grid grid-cols-[auto_auto_auto] grid-rows-[auto_23px_auto] gap-px'>
      <Panel id={id} headerClassName='bg-[#259229]' className='col-[1/4]' />
      <Indicator className='bg-[#004CB7] text-light col-1 row-2'>E</Indicator>
      <ValveHorizontalIcon className='w-6.5 h-4 col-2 row-2 self-end' />
      <Indicator className={twMerge('col-3 row-2', status === 'auto' ? 'bg-[#03FD07]' : '')}>{status === 'manual' ? 'M' : 'A'}</Indicator>
      <ValuesBadge className='col-[1/4] row-3 mx-auto w-max' payload={[{ value, unit: '%' }]} />
    </div>
  )
}
