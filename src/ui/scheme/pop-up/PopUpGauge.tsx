import {twMerge} from 'tailwind-merge'

const TICKS_COUNT = 11
const TICK_STEP = 9.7

const Ticks = ({side}: { side: 'left' | 'right' }) => (
    <>
        {Array.from({length: TICKS_COUNT}, (_, index) => (
            <div
                key={index}
                className={twMerge(
                    'absolute h-px bg-black',
                    side === 'left' ? 'right-full' : 'left-full',
                    index % 5 === 0 ? 'w-1.25' : 'w-0.75'
                )}
                style={{top: index * TICK_STEP - 1}}
            />
        ))}
    </>
)

const Fill = ({value, className}: { value: number, className: string }) => (
    value > 0 && (
        <div
            className={twMerge('absolute inset-x-0 bottom-0 border-t border-black', className)}
            style={{height: `${Math.min(value, 100)}%`}}
        />
    )
)

interface PopUpGaugeProps {
    value: number
}

export function PopUpGauge({value}: PopUpGaugeProps) {
    return (
        <div className='relative w-10.25 h-26 shrink-0'>
            <div className='absolute left-[8.5px] top-[0.5px] w-1.5 h-[3.5px] bg-bright-blue [clip-path:polygon(0_0,0_100%,100%_100%)]'/>
            <div className='absolute left-4.75 top-0.75 w-2 h-24.5 border border-black'>
                <Fill value={value} className='bg-bright-blue'/>
                <Ticks side='left'/>
            </div>
            <div className='absolute left-7.25 top-0.75 w-2 h-24.5 border border-black'>
                <Fill value={value} className='bg-teal'/>
                <Ticks side='right'/>
            </div>
            <span className='absolute left-px top-[91.5px] text-[7px] leading-none underline text-bright-blue'>E</span>
            <div className='absolute left-[8.5px] top-25 w-1.5 h-[3.5px] bg-bright-blue [clip-path:polygon(0_0,100%_0,0_100%)]'/>
        </div>
    )
}
