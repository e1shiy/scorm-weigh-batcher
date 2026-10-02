import { type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface PanelProps {
  id: string
  value?: number
  secondValue?: number
  status?: 'manual' | 'auto'
  unit?: string
  indicatorSlot?: ReactNode
  className?: string
  headerClassName?: string
  valueClassName?: string
}

export const Panel = ({ id, value, secondValue, status, unit, indicatorSlot, className, headerClassName, valueClassName }: PanelProps) => {
  const isExtended = secondValue && unit && status
  return (
    <div
      className={twMerge(
        `flex flex-col divide-y border border-black bg-gray-alt min-w-10.25 leading-none`,
        isExtended && 'min-w-13',
        className
      )}
    >
      <div className={twMerge('h-2 flex-center text-light font-medium text-[6px] bg-[#5E6099]', headerClassName)}>{id}</div>

      {isExtended && (
        <div className='h-2.25 grid grid-cols-5 divide-x divide-black font-semibold text-[7px]'>
          <span className='grid grid-rows-2 divide-y divide-black' />
          <span className='' />

          <div className={twMerge('flex-center transition-colors text-black', status === 'auto' && 'bg-[#03FD07]')}>
            {status === 'manual' ? 'M' : 'A'}
          </div>

          <div className='flex-center text-black'>I</div>
          <div className='flex-center text-black'>{indicatorSlot}</div>
        </div>
      )}

      {isExtended ? (
        <div className='grid grid-cols-2 grid-rows-2'>
          {value && (
            <div
              className={twMerge(
                'min-w-6.5 flex-center bg-light text-black font-semibold border-r border-b border-black text-[7px]',
                valueClassName
              )}
            >
              {value.toFixed(2)}
            </div>
          )}

          {unit && <div className='flex-center font-medium text-black text-[6px] row-[1/3] col-2'>{unit}</div>}
          {secondValue && <p className={'flex-center font-semibold text-blue-alt text-[7px] row-2 col-1'}>{secondValue.toFixed(2)}</p>}
        </div>
      ) : (
        <>
          {value && (
            <div className={twMerge('min-w-6.5 flex-center bg-light text-black font-semibold text-[9px]', valueClassName)}>{value.toFixed(2)}</div>
          )}
          {unit && <div className='flex-center font-medium text-black text-[7px]'>{unit}</div>}
        </>
      )}
    </div>
  )
}
