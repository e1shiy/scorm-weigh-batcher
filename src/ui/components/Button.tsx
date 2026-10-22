import type { ComponentPropsWithRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'light' | 'dark' | 'light-borderless'
}

export function Button({ variant, type = 'button', disabled = false, className, children, ...props }: ButtonProps) {
  const colorStyles = (variant: ButtonProps['variant'], disabled: boolean) => {
    switch (variant) {
      case 'light':
        return twMerge('bg-light text-blue/60 border-blue', !disabled && 'text-blue hover:bg-blue hover:text-light active:bg-light-blue')
      case 'light-borderless':
        return twMerge('bg-light text-blue/60 border-none', !disabled && 'text-blue hover:bg-light-gray active:bg-gray')
      case 'dark':
        return twMerge('bg-blue text-light/60 border-light', !disabled && 'text-light hover:bg-dark-blue active:bg-light-blue')
      case undefined:
        return twMerge('bg-transparent text-dark/60 border-none', !disabled && 'text-dark hover:bg-dark/10 active:bg-dark/20')
    }
  }

  return (
    <button
      className={twMerge(
        'p-2 rounded-st border cursor-pointer flex-center',
        colorStyles(variant, disabled),
        disabled && 'cursor-not-allowed',
        className
      )}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
