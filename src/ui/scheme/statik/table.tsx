import { twMerge } from 'tailwind-merge'

export interface SchemeLabel {
  text: string
  x: number // левый край надписи в координатах макета (208 px по ширине)
  y: number // верх заглавных букв в координатах макета
}

// Позиция левого верхнего угла блока в координатах родителя (родителю нужен position: relative/absolute).
export interface BlockPosition {
  x?: number
  y?: number
}

interface SchemeBlockProps extends BlockPosition {
  height: number
  labels: readonly SchemeLabel[]
  title?: string // по центру сверху, с разделительной линией под ним
  className?: string
}

const BORDER = 1 // absolute-дети отсчитываются от внутреннего края рамки
const CAP_OFFSET = 1.2 // от верха строки до верха заглавных при text-[9px] leading-none
const HEADER_LINE_Y = 13 // линия под заголовком

export function SchemeBlock({ height, labels, title, className, x, y }: SchemeBlockProps) {
  const isPositioned = x !== undefined && y !== undefined

  return (
    <div
      className={twMerge(
        'relative w-52 border border-black rounded-[10px] text-black font-medium leading-none whitespace-nowrap select-none',
        className
      )}
      style={{ height, ...(isPositioned && { position: 'absolute', left: x, top: y }) }}
    >
      {title && (
        <>
          <span className='absolute left-1/2 -translate-x-1/2 text-[10px]' style={{ top: 3.7 - BORDER - 1.3 }}>
            {title}
          </span>
          <div className='absolute inset-x-0 border-t border-black' style={{ top: HEADER_LINE_Y - BORDER }} />
        </>
      )}

      {labels.map(({ text, x, y }) => (
        <span
          key={text}
          className='absolute text-[9px]'
          style={{ left: x - BORDER, top: y - BORDER - CAP_OFFSET }}
        >
          {text}
        </span>
      ))}
    </div>
  )
}