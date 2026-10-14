import type {ReactNode} from 'react'
import {twMerge} from 'tailwind-merge'

interface PopUpFieldProps {
    className?: string
    children?: ReactNode
}

export function PopUpField({className, children}: PopUpFieldProps) {
    return (
        <div
            className={twMerge(
                'w-16.75 h-2.75 flex-center border border-black rounded-xs bg-light text-[8px] leading-none text-black',
                className
            )}
        >
            {children}
        </div>
    )
}
