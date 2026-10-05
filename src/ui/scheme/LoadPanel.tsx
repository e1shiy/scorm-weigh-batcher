import {twMerge} from "tailwind-merge";

interface LoadPanelProps {
    isActive: boolean
    load: 30 | 100
}

export function LoadPanel({isActive, load}: LoadPanelProps) {
    return (
        <div className={twMerge('font-medium flex-center flex-col text-black border border-black' +
            ' rounded-xs px-1 text-[8px] leading-2.5 w-5.5',
            isActive ? 'bg-light-green' : 'bg-gray-alt')}>
            <span>{load}</span>
            <span>%</span>
        </div>
    )
}