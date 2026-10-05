import { twMerge } from 'tailwind-merge'

interface ValuesBadgeProps {
  payload: {
    value: number
    unit: string
  }[]
  className?: string
}

export function ValuesBadge({ payload, className }: ValuesBadgeProps) {
  return (
    <div className={twMerge('border border-black bg-gray-alt p-px flex items-center gap-0.5 leading-none', className)}>
      <div className='bg-white border border-black divide-y'>
        {payload.map(({ value }, idx) => (
          <p key={idx} className='text-center px-px text-black font-semibold text-[7px] min-w-6'>
            {value.toFixed(1)}
          </p>
        ))}
      </div>
      <div className='self-stretch flex flex-col justify-around'>
        {payload.map(({ unit }, idx) => (
          <span key={idx} className='text-[8px] font-medium text-black pr-0.5 select-none'>
            {unit}
          </span>
        ))}
      </div>
    </div>
  )
}
