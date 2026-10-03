import {twMerge} from "tailwind-merge";

interface VentPanelProps {
    isRunning: boolean
}

export function VentPanel({isRunning}: VentPanelProps) {
    return (
        <div className={twMerge('border border-black text-[8px] rounded-xs text-black font-medium px-0.75',
            isRunning ? 'bg-light-green' : 'bg-gray-alt')
        }>
            {`Вент.${isRunning ? 'ВКЛ' : 'ВЫКЛ'}`}
        </div>
    )
}