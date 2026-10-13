import type {ReactNode} from 'react'
import {twMerge} from 'tailwind-merge'
import {Indicator} from '../Indicator.tsx'
import type {PopUpType} from './PopUp.tsx'
import HouseIcon from '../../../assets/icons/house.svg?react'
import DocumentIcon from '../../../assets/icons/document.svg?react'
import RulerIcon from '../../../assets/icons/ruler.svg?react'
import TrendIcon from '../../../assets/icons/trend.svg?react'
import BackIcon from '../../../assets/icons/back.svg?react'
import PinIcon from '../../../assets/icons/pin.svg?react'
import ReloadIcon from '../../../assets/icons/reload.svg?react'

interface PopUpHeaderProps {
    type: PopUpType
}

const getIndicator = (type: PopUpType, index: number): { className?: string, content?: ReactNode } => {
    if (index === 0 && type === 'pump') return {className: 'bg-red text-light', content: 'A'}
    if (index === 1 && type === 'vent') return {className: 'bg-light-yellow', content: 'W'}
    if (index === 4) return {className: 'bg-light-seagreen text-light', content: 'P'}
    return {}
}

const cell = 'border border-black rounded-xs bg-gray-alt shadow-[inset_1px_1px_3px_rgb(0_0_0/0.25)]'

const HeaderButton = ({className, children}: { className?: string, children: ReactNode }) => (
    <button type='button' className={twMerge('flex-1 h-full flex-center', cell, className)}>
        {children}
    </button>
)

export function PopUpHeader({type}: PopUpHeaderProps) {
    const hasSetpoint = type === 'circulator' || type === 'pump'

    return (
        <header className='h-5.5 flex'>
            <div className='-ml-px flex items-end -space-x-px'>
                {Array.from({length: 13}, (_, index) => {
                    const {className, content} = getIndicator(type, index)
                    return (
                        <Indicator
                            key={index}
                            className={twMerge('size-3 text-[8px] bg-gray', cell, className)}
                        >
                            {content}
                        </Indicator>
                    )
                })}
            </div>
            <div className='-mt-px grow flex -space-x-px'>
                <HeaderButton><HouseIcon className='w-3'/></HeaderButton>
                <HeaderButton><DocumentIcon/></HeaderButton>
                <HeaderButton><RulerIcon/></HeaderButton>
                {hasSetpoint && <HeaderButton><RulerIcon/></HeaderButton>}
                <HeaderButton><TrendIcon/></HeaderButton>
                {!hasSetpoint && <HeaderButton><BackIcon/></HeaderButton>}
                <HeaderButton className='text-[8px] text-black'>...</HeaderButton>
                <div className='-mr-px flex-1 h-full flex flex-col -space-y-px'>
                    <button type='button' className={twMerge('flex-1 flex-center', cell)}><PinIcon/></button>
                    <button type='button' className={twMerge('flex-1 flex-center', cell)}><ReloadIcon/></button>
                </div>
            </div>
        </header>
    )
}
