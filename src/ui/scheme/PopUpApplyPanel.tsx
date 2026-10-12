import type {ReactNode} from 'react'
import {twMerge} from 'tailwind-merge'
import {PopUpButton} from './PopUpButton'
import PinIcon from '../../assets/icons/pin.svg?react'

interface PopUpApplyPanelProps {
    className?: string
}

const SunkenField = ({className, children}: { className?: string, children: ReactNode }) => (
    <div
        className={twMerge(
            'absolute w-12.75 h-[11.5px] flex items-center justify-end pr-0.5 border border-black bg-gray-alt',
            'shadow-[inset_2px_2px_0_var(--color-dark-gray)] text-[10px] leading-none',
            className
        )}
    >
        {children}
    </div>
)

const Triangle = ({className}: { className?: string }) => (
    <div className={twMerge('absolute w-1.25 h-[3.5px] bg-black', className)}/>
)

const SliderButton = ({className, children}: { className?: string, children?: ReactNode }) => (
    <div
        className={twMerge(
            'absolute top-px w-1.75 h-2 flex-center bg-gray-alt shadow-[1.5px_1.5px_1.5px_rgb(0_0_0/0.5)]',
            className
        )}
    >
        {children}
    </div>
)

const Chevron = ({className}: { className?: string }) => (
    <svg viewBox='0 0 4 6.5' className={twMerge('w-1 h-[6.5px]', className)}>
        <path d='M3.6 0.3 L0.5 3.25 L3.6 6.2' fill='none' stroke='currentColor' strokeWidth={0.9}/>
    </svg>
)

export function PopUpApplyPanel({className}: PopUpApplyPanelProps) {
    return (
        <div className={twMerge('relative w-57.5 h-16.25 border border-black bg-pale-seagreen text-[8px] leading-none', className)}>
            <span className='absolute left-0.5 top-1'>Уставка</span>
            <span className='absolute left-[42px] top-1'>Применить?</span>

            <div className='absolute left-0.5 top-3.5 w-22.25 h-7 flex flex-col pl-0.75 border border-black'>
                <span className='mt-[2.5px] ml-px'>Прямое задание [%]</span>
                <div className='mt-[2.5px] flex gap-1'>
                    {['-5', '-1', '1', '5'].map(step => (
                        <PopUpButton key={step} className='w-4 h-3 bg-light text-[9px]'>{step}</PopUpButton>
                    ))}
                </div>
            </div>

            <Triangle className='left-[168px] top-[7.5px] [clip-path:polygon(0_0,100%_0,50%_100%)]'/>
            <SunkenField className='left-[174.5px] top-[2.5px]'>100,0</SunkenField>
            <SunkenField className='left-[122.5px] top-[12.5px]'>+20.0</SunkenField>
            <SunkenField className='left-[174.5px] top-[16.5px]'>0,0</SunkenField>
            <Triangle className='left-[168px] top-[25px] [clip-path:polygon(50%_0,100%_100%,0_100%)]'/>

            <div className='absolute left-[116px] top-[30px] w-27.5 h-3 border border-black bg-dark-gray select-none'>
                <SliderButton className='left-px'><Chevron/></SliderButton>
                <SliderButton className='left-1/2 -translate-x-1/2'/>
                <SliderButton className='right-px'><Chevron className='rotate-180'/></SliderButton>
            </div>

            <div className='absolute inset-x-0 top-[45px] h-px bg-black'/>

            <span className='absolute left-0.5 top-[51px]'>Применить?</span>
            <div className='absolute left-[106px] top-[49px] flex gap-0.5'>
                <PopUpButton className='size-3 bg-light'><PinIcon/></PopUpButton>
                <PopUpButton className='w-12.5 h-3 bg-light'>Да</PopUpButton>
                <PopUpButton className='w-12.5 h-3 bg-light'>Отмена</PopUpButton>
            </div>
        </div>
    )
}
