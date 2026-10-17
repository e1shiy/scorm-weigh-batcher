import type {SchemeStatus} from "../../scenario/types.ts";
import {twMerge} from "tailwind-merge";
import {Panel} from "./Panel.tsx";
import {MotorButton} from "./MotorButton.tsx";
import {Indicator} from "./Indicator.tsx";
import {ValuesBadge} from "./ValuesBadge.tsx";

interface PumpProps {
    id: string
    payload: {
        value: number,
        unit: string
    }[]
    status: SchemeStatus
    isRunning: boolean
    className?: string
}

export function Pump({id, payload, status, isRunning, className}: PumpProps) {
    const statusBg = status === 'manual' ? 'bg-red' : 'bg-neon-green'

    return (
        <div className={twMerge('flex-center justify-start flex-col absolute text-[8px]', className)}>
            <Panel id={`2H${id}`} headerClassName='bg-light-seagreen' />
            <div className='flex'>
                <div className='flex flex-col justify-between'>
                    <Indicator className='bg-bright-blue text-light'>E</Indicator>
                    <Indicator className='bg-light-seagreen text-light'>P</Indicator>
                </div>
                <MotorButton isRunning={isRunning} hasLabel={true} hasArrow={true} hasBorder={true} />
                <Indicator className={twMerge('', statusBg)}>A</Indicator>
            </div>
            <ValuesBadge payload={payload}/>
        </div>
    )
}