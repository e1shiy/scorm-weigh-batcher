import { twMerge } from 'tailwind-merge'
import { Indicator } from '../Indicator'
import { ValuesBadge } from '../ValuesBadge'
import { Panel } from '../Panel'
import { MotorButton } from '../MotorButton.tsx'
import LongMixerIcon from '../../../assets/icons/long-mixer.svg?react'


export function LongMixer() {

    return (
        <div className={twMerge('flex-center flex-col gap-px')}>
            <Panel id='2M5144A' headerClassName='bg-light-seagreen' />
            <div className='flex mb-0.75 relative gap-0.5'>
                <Indicator className='bg-light-seagreen'>P</Indicator>
                <MotorButton hasLabel isRunning={true} />
                <LongMixerIcon className='absolute top-full left-1/2 -translate-x-1/2' />
                <Indicator className='bg-gray-alt'>M</Indicator>
            </div>
            <ValuesBadge className='z-10' payload={[{ value: 5.8, unit: 'A' }]} />
        </div>
    )
}
