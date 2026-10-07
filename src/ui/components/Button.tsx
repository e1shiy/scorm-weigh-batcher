import type { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: keyof typeof colorStyles
}

const colorStyles = {
  light: 'bg-light text-blue border-blue hover:bg-blue hover:text-light active:bg-light-blue',
  'light-borderless': 'bg-light text-blue border-none hover:bg-light-gray active:bg-gray',
  dark: 'bg-blue text-light border-light hover:bg-dark-blue active:bg-light-blue'
}

export function Button({ variant = 'dark', type = 'button', className, children, ...props }: ButtonProps) {
  return (
    <button className={twMerge('p-2 rounded-st border cursor-pointer flex-center', colorStyles[variant], className)} type={type} {...props}>
      {children}
    </button>
  )
}
