import {twMerge} from 'tailwind-merge'
import {Indicator} from './Indicator'
import {ValuesBadge} from './ValuesBadge'
import {Panel} from './Panel'
import {MotorButton} from "./MotorButton.tsx";
import MixerIcon from '../../assets/icons/mixer.svg?react'

interface MixerProps {
    id: string
    value: number
    status?: 'manual' | 'auto'
    isRunning: boolean
}

export function Mixer({id, value, status, isRunning}: MixerProps) {
    const modeBadge =
        <Indicator
            className={status === 'auto' ? 'bg-light-seagreen' : 'bg-gray-alt'}
        >{status === 'manual' ? 'M' : 'L'}
        </Indicator>

    return (
        <div className={twMerge('flex-center flex-col gap-px')}>
            <Panel id={`2M${id}`} headerClassName='bg-light-seagreen'/>
            <div className='flex mb-0.75 relative gap-0.5'>
                <Indicator className={isRunning ? 'bg-light-seagreen' : 'bg-red'}>{isRunning ? 'P' : 'A'}</Indicator>
                <MotorButton hasLabel={true} isRunning={isRunning}/>
                <MixerIcon className='absolute top-full left-1/2 -translate-x-1/2'/>
                {modeBadge}
            </div>
            <ValuesBadge className='z-10' payload={[{value, unit: 'A'}]}/>
        </div>
    )
}