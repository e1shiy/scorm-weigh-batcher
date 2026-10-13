import {twMerge} from 'tailwind-merge'

const TICKS_COUNT = 11

const Ticks = ({side}: { side: 'left' | 'right' }) => (
    <div className={twMerge('flex flex-col justify-between', side === 'left' ? 'items-end' : 'items-start')}>
        {Array.from({length: TICKS_COUNT}, (_, index) => (
            <div key={index} className={twMerge('h-px bg-black', index % 5 === 0 ? 'w-1.25' : 'w-0.75')}/>
        ))}
    </div>
)

const Bar = ({value, className}: { value: number, className: string }) => (
    <div className='w-2 flex flex-col justify-end border border-black'>
        {value > 0 && (
            <div className={twMerge('border-t border-black', className)} style={{height: `${Math.min(value, 100)}%`}}/>
        )}
    </div>
)

const Triangle = ({className}: { className: string }) => (
    <div className={twMerge('w-1.5 h-[3.5px] bg-bright-blue', className)}/>
)

interface PopUpGaugeProps {
    value: number
}

export function PopUpGauge({value}: PopUpGaugeProps) {
    return (
        <div className='h-26 flex shrink-0'>
            <div className='w-3.5 flex flex-col justify-between items-end'>
                <Triangle className='[clip-path:polygon(0_0,0_100%,100%_100%)]'/>
                <div className='flex items-end'>
                    <span className='mr-0.5 mb-1 text-[7px] leading-none underline text-bright-blue'>E</span>
                    <Triangle className='[clip-path:polygon(0_0,100%_0,0_100%)]'/>
                </div>
            </div>
            <div className='flex py-0.75'>
                <Ticks side='left'/>
                <div className='flex gap-0.5'>
                    <Bar value={value} className='bg-bright-blue'/>
                    <Bar value={value} className='bg-teal'/>
                </div>
                <Ticks side='right'/>
            </div>
        </div>
    )
}
