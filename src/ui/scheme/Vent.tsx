import {Indicator} from "./Indicator.tsx";
import {Panel} from "./Panel.tsx";
import {MotorButton} from "./MotorButton.tsx";
import {ValuesBadge} from "./ValuesBadge.tsx";

interface VentProps {
    id: string
    value: number
    isRunning: boolean
}

export function Vent({id, value, isRunning}: VentProps) {
    const modeIndicator = <Indicator className={isRunning ? 'bg-light-seagreen' : ''}>{isRunning ? 'M' : 'L'}</Indicator>

    return (
        <div className='flex-center flex-col'>
            <Panel id={'2M'+id} headerClassName='bg-light-seagreen' />
            <div className='flex -space-x-1'>
                <Indicator className='bg-light-yellow z-10'>W</Indicator>
                <MotorButton isRunning={isRunning} hasBorder={true} hasLabel={true}></MotorButton>
                {modeIndicator}
            </div>
            <ValuesBadge payload={[{value: value, unit: 'A'}]} />
        </div>
    )
}