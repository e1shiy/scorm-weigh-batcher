import { Indicator } from "../Indicator.tsx";
import {Panel} from "../Panel.tsx";
import {MotorButton} from "../MotorButton.tsx";
import {ValuesBadge} from "../ValuesBadge.tsx";

export interface LAUProps {
    id: number;
}

export function LAU({id}: LAUProps) {

    return (
        <div className='flex-center flex-col gap-px'>
            <Panel id={`2LAU_${id}`} headerClassName='bg-light-seagreen'/>
            <div className='flex'>
                <Indicator className='bg-light-seagreen text-light'>P</Indicator>
                <MotorButton hasLabel={true} isRunning={false} />
                <Indicator className='bg-light-seagreen'>L</Indicator>
            </div>
            <ValuesBadge payload={[{value: 0, unit: 'A'}]} />
        </div>
    )
}