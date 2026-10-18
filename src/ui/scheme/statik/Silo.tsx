import SiloIcon from '../../../assets/icons/silo.svg?react'

export interface SiloProps {
    id: string
}

export function Silo({id}: SiloProps) {

    return(
        <div className='relative'>
            <SiloIcon />
            <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-semibold text-[8px]'>{id}</span>
        </div>
    )
}