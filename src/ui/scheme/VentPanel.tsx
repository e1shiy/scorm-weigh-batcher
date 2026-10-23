import {twMerge} from "tailwind-merge";

interface VentPanelProps {
    isRunning: boolean
    className?: string
}

export function VentPanel({isRunning, className}: VentPanelProps) {
    return (
        <div className={twMerge('border border-black text-[8px] rounded-xs text-black font-medium px-0.5',
            isRunning ? 'bg-light-green' : 'bg-gray-alt', className)
        }>
            {`Вент.${isRunning ? 'ВКЛ' : 'ВЫКЛ'}`}
        </div>
    )
}