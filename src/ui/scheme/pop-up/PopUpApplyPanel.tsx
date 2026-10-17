import {useRef, useState, type ReactNode} from 'react'
import {twMerge} from 'tailwind-merge'
import {PopUpButton} from './PopUpButton.tsx'
import {Nudge} from './Nudge.tsx'
import {formatValue} from './formatValue.ts'
import PinIcon from '../../../assets/icons/pin.svg?react'

const STEPS = [-5, -1, 1, 5]

interface PopUpApplyPanelProps {
    className?: string
    delta: number
    onStep: (step: number) => void
    onApply?: () => void
    onCancel?: () => void
}

const DELTA_PATTERN = /^[+-]?\d*[.,]?\d?$/
const DELTA_LIMIT = 100

const sunkenFieldClassName = twMerge(
    'w-12.75 h-[11.5px] flex items-center justify-end pr-0.5 border border-black bg-gray-alt',
    'shadow-[inset_2px_2px_0_var(--color-dark-gray)] text-[10px] leading-none'
)

const formatDelta = (value: number) => `${value > 0 ? '+' : ''}${formatValue(value)}`

const SunkenField = ({children}: { children: ReactNode }) => (
    <div className={sunkenFieldClassName}>{children}</div>
)

const DeltaInput = ({value, onChange}: { value: number, onChange: (value: number) => void }) => {
    const [draft, setDraft] = useState<string | null>(null)

    const commit = () => {
        if (draft !== null && draft !== '') {
            const parsed = Number(draft.replace(',', '.'))
            if (Number.isFinite(parsed)) {
                const clamped = Math.min(Math.max(parsed, -DELTA_LIMIT), DELTA_LIMIT)
                onChange(Math.round(clamped * 10) / 10)
            }
        }
        setDraft(null)
    }

    return (
        <input
            type='text'
            inputMode='decimal'
            aria-label='Изменение уставки'
            value={draft ?? formatDelta(value)}
            onFocus={() => setDraft(formatDelta(value))}
            onChange={event => {
                if (DELTA_PATTERN.test(event.target.value)) setDraft(event.target.value)
            }}
            onBlur={commit}
            onKeyDown={event => {
                if (event.key === 'Enter') event.currentTarget.blur()
            }}
            className={twMerge(sunkenFieldClassName, 'text-right outline-none')}
        />
    )
}

const Triangle = ({className}: { className: string }) => (
    <div className={twMerge('w-1.25 h-[3.5px] bg-black', className)}/>
)

export function PopUpApplyPanel({className, delta, onStep, onApply, onCancel}: PopUpApplyPanelProps) {
    const nudgeValueRef = useRef(0)

    const handleNudgeChange = (value: number) => {
        const rounded = Math.round(value * 10) / 10
        if (rounded === nudgeValueRef.current) return
        onStep(rounded - nudgeValueRef.current)
        nudgeValueRef.current = rounded
    }

    return (
        <div
            className={twMerge(
                'w-57.5 h-16.25 flex flex-col border border-black bg-pale-seagreen text-[8px] leading-none',
                className
            )}
        >
            <div className='grow flex justify-between px-0.5 pt-0.5'>
                <div className='flex flex-col gap-0.25 pt-0.5'>
                    <div className='flex gap-2.5'>
                        <span>Уставка</span>
                        <span>Применить?</span>
                    </div>
                    <div className='w-22.25 h-7 flex flex-col gap-0.5 p-0.5 pl-1 border border-black'>
                        <span>Прямое задание [%]</span>
                        <div className='flex gap-1'>
                            {STEPS.map(step => (
                                <PopUpButton key={step} className='w-4 h-3 bg-light text-[9px]' onClick={() => onStep(step)}>
                                    {step}
                                </PopUpButton>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='w-27.5 flex flex-col gap-0.5'>
                    <div className='flex justify-end gap-px'>
                        <div className='mt-1.25 flex flex-col items-end'>
                            <Triangle className='mr-px [clip-path:polygon(0_0,100%_0,50%_100%)]'/>
                            <DeltaInput value={delta} onChange={next => onStep(next - delta)}/>
                            <Triangle className='mr-px [clip-path:polygon(50%_0,100%_100%,0_100%)]'/>
                        </div>
                        <div className='flex flex-col gap-0.5'>
                            <SunkenField>100,0</SunkenField>
                            <SunkenField>0,0</SunkenField>
                        </div>
                    </div>
                    <Nudge className='w-27.5' onChange={handleNudgeChange}/>
                </div>
            </div>

            <div className='h-4.75 flex items-center justify-between pl-0.5 pr-1.5 border-t border-black'>
                <span>Применить?</span>
                <div className='flex gap-0.5'>
                    <PopUpButton className='size-3 bg-light'><PinIcon/></PopUpButton>
                    <PopUpButton className='w-12.5 h-3 bg-light' onClick={onApply}>Да</PopUpButton>
                    <PopUpButton className='w-12.5 h-3 bg-light' onClick={onCancel}>Отмена</PopUpButton>
                </div>
            </div>
        </div>
    )
}
