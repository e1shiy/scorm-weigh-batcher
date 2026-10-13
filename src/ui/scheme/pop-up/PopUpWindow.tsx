import type {ReactNode} from 'react'
import {twMerge} from 'tailwind-merge'
import {PopUpHeader} from './PopUpHeader.tsx'
import {PopUpButton} from './PopUpButton.tsx'
import {PopUpField} from './PopUpField.tsx'
import {PopUpGauge} from './PopUpGauge.tsx'
import {PopUpApplyPanel} from './PopUpApplyPanel.tsx'
import {PopUpDropdown} from './PopUpDropdown.tsx'
import PopUpArrowRightIcon from '../../../assets/icons/pop-up-arrow-right.svg?react'
import PopUpArrowRightWithLineIcon from '../../../assets/icons/pop-up-arrow-right-with-line.svg?react'
import PopUpStoppedIcon from '../../../assets/icons/pop-up-stopped.svg?react'
import OpenedLockIcon from '../../../assets/icons/opened-lock.svg?react'

export type PopUpType = 'mixer' | 'vent' | 'transporter' | 'circulator' | 'pump'

interface PopUpBaseProps {
    isRunning: boolean
    onRunningChange?: (isRunning: boolean) => void
}

interface PopUpSimpleProps extends PopUpBaseProps {
    type: 'mixer' | 'vent' | 'transporter'
}

interface PopUpSetpointProps extends PopUpBaseProps {
    type: 'circulator' | 'pump'
    setpoint: number
}

export type PopUpWindowProps = PopUpSimpleProps | PopUpSetpointProps

const formatValue = (value: number) => value.toFixed(1).replace('.', ',')

const ValueField = ({className, children}: { className?: string, children: ReactNode }) => (
    <div
        className={twMerge(
            'w-9.75 h-2.75 flex items-center justify-end pr-px border border-black bg-dark-gray text-[10px] leading-none',
            className
        )}
    >
        {children}
    </div>
)

const SetpointRow = ({label, color, className, children}: {
    label: string,
    color: string,
    className?: string,
    children: ReactNode
}) => (
    <div className='flex items-end'>
        <span className={twMerge('w-16.5 border-b text-[8px] leading-none', color)}>{label}</span>
        <ValueField className={twMerge(color, className)}>{children}</ValueField>
        <span className='ml-0.5 text-[8px] leading-none'>%</span>
    </div>
)

export function PopUpWindow(props: PopUpWindowProps) {
    const {type, isRunning, onRunningChange} = props
    const setpoint = props.type === 'circulator' || props.type === 'pump' ? props.setpoint : null
    const hasSetpoint = setpoint !== null

    return (
        <div
            className={twMerge(
                'relative w-59 h-39.5 flex flex-col border border-black bg-gray-alt text-black font-medium',
                hasSetpoint && 'h-66.25',
                type === 'pump' && 'h-83'
            )}
        >
            <PopUpHeader type={type}/>
            <div className='flex gap-1.5 px-0.75 pt-1.5'>
                <div className='relative w-18 shrink-0 flex flex-col'>
                    {!isRunning && <PopUpStoppedIcon className='mx-auto'/>}
                    {isRunning && hasSetpoint && <PopUpArrowRightWithLineIcon className='mx-auto'/>}
                    {isRunning && !hasSetpoint && <PopUpArrowRightIcon className='mx-auto'/>}
                    {type === 'mixer' && (
                        <div className='absolute left-0 top-8.75 size-3 rounded-full border border-black bg-dark-gray'/>
                    )}
                    <div className='mt-2.5 flex flex-col gap-1'>
                        {Array.from({length: 4}, (_, index) => (
                            <div key={index} className='h-3 border border-black bg-dark-gray'/>
                        ))}
                        {type === 'transporter' && <PopUpButton className='h-3'>Наработка</PopUpButton>}
                    </div>
                    {hasSetpoint && (
                        <div className='mt-1.25 ml-1.5'>
                            <PopUpGauge value={setpoint}/>
                        </div>
                    )}
                </div>

                <div className='grow flex flex-col pt-0.75 pr-0.75'>
                    <div className='flex flex-col gap-1.25'>
                        <div className='flex items-center'>
                            <span className='grow text-[8px]'>Режим</span>
                            {type === 'vent'
                                ? <PopUpField className='bg-aquamarine'>Местный</PopUpField>
                                : <PopUpField>Ручной</PopUpField>}
                            <PopUpButton className='ml-0.75 w-3.75'>...</PopUpButton>
                        </div>
                        {hasSetpoint && <PopUpField className='self-end mr-4.5 bg-dark-gray'/>}
                        <div className='flex items-center'>
                            <span className='grow text-[8px]'>Команда</span>
                            {isRunning
                                ? <PopUpField className='bg-lime'>Пуск</PopUpField>
                                : <PopUpField>Стоп</PopUpField>}
                            <PopUpDropdown
                                className='ml-0.75'
                                options={['Пуск', 'Стоп']}
                                onSelect={option => onRunningChange?.(option === 'Пуск')}
                            />
                        </div>
                        {hasSetpoint && (
                            <div className='flex items-center'>
                                <span className='grow text-[8px]'>Уставка</span>
                                <PopUpField>Внутренняя</PopUpField>
                                <PopUpButton className='ml-0.75 w-3.75'>...</PopUpButton>
                            </div>
                        )}
                        <PopUpButton className='self-end w-21.25'>Сброс</PopUpButton>
                    </div>

                    <div className={twMerge('mt-1.25 h-px bg-black', hasSetpoint && 'mt-2.5')}/>

                    {(type === 'mixer' || hasSetpoint) && (
                        <div className={twMerge('mt-5.75 flex justify-end items-end gap-1.5', hasSetpoint && 'mt-8.75')}>
                            <OpenedLockIcon className='mb-0.5'/>
                            <PopUpButton className='w-21.25'>Блокировка</PopUpButton>
                        </div>
                    )}

                    {hasSetpoint && (
                        <>
                            <div className='mt-1 h-px bg-black'/>
                            <ValueField className='mt-1 self-end'>100,0</ValueField>
                            <div className='mt-0.5 flex flex-col gap-0.5'>
                                <SetpointRow label='Уставка' color='border-deep-blue' className='bg-light'>
                                    {formatValue(setpoint)}
                                </SetpointRow>
                                <SetpointRow label='Эхоконтроль' color='border-teal'>{formatValue(setpoint)}</SetpointRow>
                            </div>
                            <ValueField className='mt-1.25 self-end'>0,0</ValueField>
                        </>
                    )}
                </div>
            </div>
            {type === 'pump' && <PopUpApplyPanel className='absolute left-0.5 top-[263px]'/>}
        </div>
    )
}
