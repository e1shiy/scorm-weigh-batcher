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
      <div className='bg-white border border-black divide-y divide-black'>
        {payload.map(({ value }, idx) => (
          <p key={idx} className='text-center px-px text-black font-semibold text-[7px] min-w-6'>
            {value.toFixed(2)}
          </p>
        ))}
      </div>
      <div className='flex flex-col items-center justify-around self-stretch'>
        {payload.map(({ unit }, idx) => (
          <p key={idx} className='text-[8px] font-normal text-black select-none'>
            {unit}
          </p>
        ))}
      </div>
    </div>
  )
}
