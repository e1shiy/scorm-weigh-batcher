import {VentPanel} from './VentPanel'
import {Panel} from './Panel'
import {Indicator} from './Indicator'
import {MotorButton} from './MotorButton'
import {ValuesBadge} from './ValuesBadge'
import {LoadPanel} from './LoadPanel'
import LongMixerIcon from '../../assets/icons/long-mixer.svg?react'

interface CirculatorProps {
    id: string
    load: 0 | 30 | 100
    value: number
    status?: 'manual' | 'auto'
    isRunning: boolean
}

export function Circulator({id, load, value, status, isRunning}: CirculatorProps) {
    const modeBadge =
        <Indicator className={status === 'auto' ? 'bg-neon-green' : ''}>
            {status === 'manual' ? 'M' : 'A'}
        </Indicator>

    return (
        <div className='flex flex-col justify-start items-center gap-0.25'>
            <VentPanel isRunning={isRunning}/>
            <Panel id={`2Н${id}`} headerClassName='bg-light-seagreen'/>
            <div className='flex gap-0.5'>
                <div className='flex-center flex-col gap-0.25'>
                    <Indicator className='size-2.25'>I</Indicator>
                    <Indicator className='bg-light-seagreen size-2.25'>P</Indicator>
                </div>
                <MotorButton isRunning={isRunning} hasLabel={true} hasArrow={true}/>
                {modeBadge}
            </div>
            <div className='relative'>
                <ValuesBadge payload={[{value: load, unit: '%'}, {value: value, unit: 'A'}]} className='z-10'/>
                <LongMixerIcon className='absolute top-full left-1/2 -translate-x-1/2'/>
            </div>
            <div className='flex-center gap-1.25 mt-1.25'>
                <LoadPanel load={30} isActive={load === 30}/>
                <LoadPanel load={100} isActive={load === 100}/>
            </div>
        </div>
    )
}