import {useState} from "react";
import {twMerge} from "tailwind-merge";
import {formatValue} from "./formatValue.ts";
import {clamp} from "../../../lib/clamp.ts";

const DELTA_PATTERN = /^[+-]?\d*[.,]?\d?$/
const DELTA_LIMIT = 100

const formatDelta = (value: number) => `${value > 0 ? '+' : ''}${formatValue(value)}`

export function DeltaInput({value, onChange}: { value: number, onChange: (value: number) => void }) {
    const [draft, setDraft] = useState<string | null>(null)

    const commit = () => {
        if (draft !== null && draft !== '') {
            const parsed = Number(draft.replace(',', '.'))
            if (Number.isFinite(parsed)) {
                onChange(Math.round(clamp(parsed, -DELTA_LIMIT, DELTA_LIMIT) * 10) / 10)
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
            className={twMerge(
                'w-12.75 h-[11.5px] flex items-center justify-end pr-0.5 border border-black',
                'bg-gray-alt shadow-[inset_2px_2px_0_var(--color-dark-gray)] text-[10px]',
                'leading-none text-right outline-none hover:brightness-80'
            )}
        />
    )
}