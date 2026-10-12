import {useEffect, useRef, useState} from 'react'
import {twMerge} from 'tailwind-merge'
import {PopUpButton} from './PopUpButton'

interface PopUpDropdownProps {
    options: string[]
    onSelect: (option: string) => void
    className?: string
}

export function PopUpDropdown({options, onSelect, className}: PopUpDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isOpen) return undefined

        const handleOutsideClick = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
        }
        document.addEventListener('mousedown', handleOutsideClick)
        return () => document.removeEventListener('mousedown', handleOutsideClick)
    }, [isOpen])

    const handleSelect = (option: string) => {
        onSelect(option)
        setIsOpen(false)
    }

    return (
        <div ref={rootRef} className={twMerge('relative', className)}>
            <PopUpButton className='w-3.75' onClick={() => setIsOpen(prev => !prev)}>...</PopUpButton>
            {isOpen && (
                <div
                    className='absolute right-0 top-full mt-0.5 z-10 min-w-16.75 flex flex-col border border-black rounded-xs bg-gray-alt shadow-[1.5px_1.5px_1.5px_rgb(0_0_0/0.5)]'
                >
                    {options.map(option => (
                        <button
                            key={option}
                            type='button'
                            onClick={() => handleSelect(option)}
                            className='h-2.75 px-1 text-left text-[8px] leading-none hover:bg-dark-gray'
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
