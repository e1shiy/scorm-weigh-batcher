import type {ReactNode} from 'react'
import {twMerge} from 'tailwind-merge'

interface PopUpButtonProps {
    className?: string
    children?: ReactNode
    onClick?: () => void
}

export function PopUpButton({className, children, onClick}: PopUpButtonProps) {
    return (
        <button
            type='button'
            onClick={onClick}
            className={twMerge(
                'h-2.75 flex-center border border-black rounded-xs bg-dark-gray text-[8px] leading-none text-black',
                'shadow-[1.5px_1.5px_1.5px_rgb(0_0_0/0.5)] cursor-pointer',
                className
            )}
        >
            {children}
        </button>
    )
}
