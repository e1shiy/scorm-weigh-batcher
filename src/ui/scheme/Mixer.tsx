import { twMerge } from 'tailwind-merge'
import { Indicator } from './Indicator'
import { ValuesBadge } from './ValuesBadge'
import { Panel } from './Panel'
import { MotorButton } from "./MotorButton.tsx";
import MixerIcon from '../../assets/icons/mixer.svg?react'

interface MixerProps {
    id: string
    value: number
    status?: 'manual' | 'auto'
}

export function Mixer({id, value, status}: MixerProps) {
    const modeBadge = <Indicator className={status === 'auto' ? 'bg-neon-green' : ''}>{status === 'manual' ? 'M' : 'A'}</Indicator>

    return (
        <div className={twMerge('flex-center flex-col gap-px')}>
            <Panel id={id} headerClassName='bg-light-seagreen' />
            <div className='flex mb-0.75 relative'>
                <Indicator>P</Indicator>
                <MotorButton hasLabel={true} isRunning={true}/>
                <MixerIcon className='absolute top-full left-1/2 -translate-x-1/2' />
                {modeBadge}
            </div>
            <ValuesBadge className='z-10' payload={[{ value, unit: 'A' }]} />
        </div>
    )
}