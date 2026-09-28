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
          <p key={idx} className='flex-center text-black font-semibold text-[7px] min-w-6'>
            {value.toFixed(2)}
          </p>
        ))}
      </div>
      {payload.map(({ unit }, idx) => (
        <span key={idx} className='text-[8px] font-bold text-black pr-0.5 select-none'>
          {unit}
        </span>
      ))}
    </div>
  )
}
