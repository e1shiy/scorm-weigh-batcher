import TriangleRightIcon from '../../assets/icons/triangle-right.svg?react'
import MotorStoppedIcon from '../../assets/icons/motor-stopped.svg?react'
import {twMerge} from "tailwind-merge";
import type { MouseEventHandler } from 'react';

interface MotorButtonProps {
    hasLabel?: boolean
    hasArrow?: boolean
    hasBorder?: boolean
    isRunning: boolean
    onClick: MouseEventHandler
    className?: string
}

/*Надо подумать над названием */
export function MotorButton({ hasLabel, hasArrow, hasBorder, isRunning, onClick, className }: MotorButtonProps) {
    const button = (
        <button
            className={twMerge(
                'size-4.75 border border-black rounded-full flex-center text-[8px] font-medium relative text-white cursor-pointer',
                isRunning ? 'bg-light-green' : 'bg-gray-alt', className
            )}
            onClick={ onClick }
        >
            {isRunning ? (
                <>
                    {hasLabel && <span className='-translate-y-1/24'>M</span>}
                    {hasArrow && <TriangleRightIcon className='absolute size-1 bottom-0.5' />}
                </>
            ) : (
                <>
                    {hasLabel && (<MotorStoppedIcon />)}
                </>
            )}
        </button>
    )

    if (!hasBorder) return button

    return <div className='p-0.5 bg-gray-alt border border-black rounded-full'>{button}</div>
}