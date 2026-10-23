import { useState } from 'react'
import { formatValue } from './formatValue.ts'

const SETPOINT_PATTERN = /^\d*[.,]?\d?$/

interface SetpointInputProps {
  value: number
  onApply: (value: number) => void
}

export function SetpointInput({ value, onApply }: SetpointInputProps) {
  const [draft, setDraft] = useState<string | null>(null)

  const apply = () => {
    if (draft === null || draft === '') return
    const parsed = Number(draft.replace(',', '.'))
    if (Number.isFinite(parsed)) onApply(Math.round(parsed * 10) / 10)
  }

  return (
    <input
      type='text'
      inputMode='decimal'
      aria-label='Уставка'
      value={draft ?? formatValue(value)}
      onFocus={() => setDraft(formatValue(value))}
      onChange={event => {
        if (SETPOINT_PATTERN.test(event.target.value)) setDraft(event.target.value)
      }}
      onBlur={() => setDraft(null)}
      onKeyDown={event => {
        if (event.key !== 'Enter') return
        apply()
        event.currentTarget.blur()
      }}
      className='w-full h-full bg-transparent text-right outline-none'
    />
  )
}
