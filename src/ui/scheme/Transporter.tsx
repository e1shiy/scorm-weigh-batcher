import {MotorButton} from './MotorButton'
import {twMerge} from 'tailwind-merge'
import {ValuesBadge} from './ValuesBadge.tsx'
import {Panel} from './Panel.tsx'
import {Indicator} from './Indicator.tsx'
import LockedLockIcon from '../../assets/icons/locked-lock.svg?react'
import OpenedLockIcon from '../../assets/icons/opened-lock.svg?react'

interface TransporterProps {
    id: string
    isRunning: boolean
    length: 'small' | 'medium' | 'large'
    payload?: {
        value: number,
        unit: string
    }[]
    status?: 'manual' | 'auto'
    isReversed?: boolean
    isLocked?: boolean
}

const lengths = {
    'small': 'w-24',
    'medium': 'w-67',
    'large': 'w-73',
}

export function Transporter({id, isRunning, length, payload, isReversed, isLocked}: TransporterProps) {


    return (
        <div className={twMerge('flex flex-col', isReversed ? 'items-end' : 'items-start')}>
            <Panel id={'2K' + id} headerClassName='bg-light-seagreen'/>
            <div className={twMerge('p-0.5 bg-gray border border-black rounded-full', isReversed ? 'mr-2' : 'ml-2')}>
                <div className={
                    twMerge('border border-black bg-light-gray rounded-full text-[8px] text-black font-semibold',
                        lengths[length])}
                >
                    <div className={twMerge('flex justify-between items-center', isReversed && 'flex-row-reverse')}>
                        <div className='relative'>
                            <Indicator
                                className={twMerge('absolute right-full bg-gray-alt')}
                            >
                                I</Indicator>
                            <Indicator
                                className='absolute right-full top-full -translate-y-2 bg-light-seagreen text-light'
                            >
                                P</Indicator>
                            <MotorButton isRunning={isRunning} hasLabel={true} className='-mx-px'/>
                            <Indicator
                                className={twMerge('absolute left-full bottom-full translate-y-2.25',
                                    !isRunning && 'bg-light-seagreen')}
                            >
                                {isRunning ? 'M' : 'L'}</Indicator>
                            {isLocked !== false && !isRunning && (
                                <div
                                    className='absolute left-full top-full -translate-y-2'
                                >
                                    {isLocked ? <LockedLockIcon/> : <OpenedLockIcon />}
                                </div>)
                            }
                        </div>
                        <span className='text-[8px]'>{id}</span>
                        <MotorButton isRunning={isRunning} hasLabel={false} className='-mx-px'/>
                    </div>
                </div>
            </div>
            {payload?.length !== 0 && payload && <ValuesBadge payload={payload}/>}
        </div>
    )
}