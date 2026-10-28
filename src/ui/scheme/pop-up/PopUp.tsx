import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { Window } from '../../components/Window.tsx'
import { useScenarioStore } from '../../../scenario/useScenarioStore.ts'
import type { SchemeStatus } from '../../../scenario/types.ts'
import { PopUpHeader } from './PopUpHeader.tsx'
import { PopUpButton } from './PopUpButton.tsx'
import { PopUpField } from './PopUpField.tsx'
import { PopUpGauge } from './PopUpGauge.tsx'
import { PopUpApplyPanel } from './PopUpApplyPanel.tsx'
import { PopUpDropdown } from './PopUpDropdown.tsx'
import { formatValue } from './formatValue.ts'
import { clamp } from '../../../lib/clamp.ts'
import { useDrag } from '../../../lib/useDrag.ts'
import PopUpArrowRightIcon from '../../../assets/icons/pop-up-arrow-right.svg?react'
import PopUpArrowRightWithLineIcon from '../../../assets/icons/pop-up-arrow-right-with-line.svg?react'
import PopUpStoppedIcon from '../../../assets/icons/pop-up-stopped.svg?react'
import OpenedLockIcon from '../../../assets/icons/opened-lock.svg?react'
import { SetpointInput } from './SetpointInput.tsx'
import { setpointModes } from './setpointModes.ts'
import { usePopUpStore } from './usePopUpStore.ts'
import {
  clampPopUpPosition,
  getInitialPopUpPosition,
  getPopUpFocusRect,
  measurePopUp,
  type PopUpPosition
} from './popUpPosition.ts'
import type { DeviceValue, ValveValue } from '../../../scenario/objects.ts'

const SETPOINT_MIN = 0
const SETPOINT_MAX = 100

const ValueField = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div
    className={twMerge(
      'w-9.75 h-2.75 flex items-center justify-end pr-px border border-black bg-dark-gray text-[10px] leading-none',
      className
    )}
  >
    {children}
  </div>
)

const SetpointRow = ({
  label,
  color,
  valueClassName,
  isActive,
  children
}: {
  label: string
  color: string
  valueClassName?: string
  isActive?: boolean
  children: ReactNode
}) => (
  <div className='flex items-end'>
    <span
      className={twMerge(
        'w-16.5 h-2.75 flex items-center border-b text-[8px] leading-none',
        color,
        isActive && 'border-t border-l border-t-black border-l-black bg-pale-seagreen'
      )}
    >
      {label}
    </span>
    <ValueField className={twMerge(color, valueClassName)}>{children}</ValueField>
    <span className='ml-0.5 text-[8px] leading-none'>%</span>
  </div>
)

const isDeviceValue = (v: DeviceValue | ValveValue): v is DeviceValue => 'running' in v && typeof v.running === 'boolean'

export function PopUp() {
  const { isOpen, setIsOpen, objectId, position, setPosition, setFocusRect } = usePopUpStore()

  const objects = useScenarioStore(s => s.objects)
  const setObject = useScenarioStore(s => s.setObject)

  const [setpointDelta, setSetpointDelta] = useState(0)

  const rootRef = useRef<HTMLDivElement>(null)
  const dragOriginRef = useRef<PopUpPosition | null>(null)

  const dragHandleProps = useDrag({
    onStart: event => {
      if (event.button !== 0 || !position || (event.target as HTMLElement).closest('button')) return false
      dragOriginRef.current = position
      return true
    },
    onMove: (deltaX, deltaY) => {
      const origin = dragOriginRef.current
      const root = rootRef.current
      if (!origin || !root) return

      const { scale, size } = measurePopUp(root)
      setPosition(clampPopUpPosition({ x: origin.x + deltaX / scale, y: origin.y + deltaY / scale }, size))
    }
  })

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!isOpen || !objectId || position || !root) return

    const { size } = measurePopUp(root)
    const initialPosition = getInitialPopUpPosition(objectId, size)
    setPosition(initialPosition)
    setFocusRect(getPopUpFocusRect(objectId, initialPosition, size))
  }, [isOpen, objectId, position, setPosition, setFocusRect])

  if (!objectId || !isOpen) return null

  const { status, value } = objects[objectId]
  const { setpoint } = value

  const isDevice = isDeviceValue(value)
  const setpointMode = setpointModes[objectId]
  const hasSetpoint = setpoint !== undefined
  const isApplyPanelShown = hasSetpoint && setpointMode === 'panel'
  const isSetpointInputShown = hasSetpoint && setpointMode === 'input'

  const RunningIcon = hasSetpoint ? PopUpArrowRightWithLineIcon : PopUpArrowRightIcon

  const handleClose = () => {
    setSetpointDelta(0)
    setIsOpen(false)
  }

  const handleSetpointInput = (nextSetpoint: number) => {
    setObject({ id: objectId, status, value: { ...value, setpoint: clamp(nextSetpoint, SETPOINT_MIN, SETPOINT_MAX) } })
  }

  const handleStatusChange = (nextStatus: SchemeStatus) => {
    setObject({ id: objectId, status: nextStatus, value })
  }

  const handleRunningChange = (running: boolean) => {
    setObject({ id: objectId, status, value: { ...value, running } })
  }

  const handleApplySetpoint = () => {
    if (hasSetpoint) {
      setObject({ id: objectId, status, value: { ...value, setpoint: clamp(setpoint + setpointDelta, SETPOINT_MIN, SETPOINT_MAX) } })
    }
    setSetpointDelta(0)
  }

  return (
    <Window
      ref={rootRef}
      title={objectId}
      onClose={handleClose}
      dragHandleProps={dragHandleProps}
      className='absolute pointer-events-auto'
      style={{ left: position?.x ?? 0, top: position?.y ?? 0 }}
    >
      <div
        className={twMerge(
          'w-59 h-39.5 flex flex-col border border-black bg-gray-alt text-black font-medium select-none',
          hasSetpoint && 'h-66.25',
          isApplyPanelShown && 'h-83'
        )}
      >
        <PopUpHeader hasSetpoint={hasSetpoint} isRunning={isDeviceValue(value) && value.running} />
        <div className='flex gap-1.5 px-0.75 pt-1.5'>
          <div className='w-18 shrink-0 flex flex-col'>
            <div className='grid grid-cols-[1fr_auto_1fr] items-end'>
              {!hasSetpoint && <div className='size-3 rounded-full border border-black bg-dark-gray' />}
              {isDevice && (value.running ? <RunningIcon className='col-start-2' /> : <PopUpStoppedIcon className='col-start-2' />)}
            </div>
            <div className='mt-2.5 flex flex-col gap-1'>
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className='h-3 border border-black bg-dark-gray' />
              ))}
            </div>
            {hasSetpoint && (
              <div className='mt-1.25 ml-1.5'>
                <PopUpGauge value={setpoint} />
              </div>
            )}
          </div>

          <div className='grow flex flex-col pt-0.75 pr-0.75'>
            <div className='flex flex-col gap-1.25'>
              <div className='flex items-center'>
                <span className='grow text-[8px]'>Режим</span>
                <PopUpField>{status === 'auto' ? 'Автоматический' : 'Ручной'}</PopUpField>
                <PopUpDropdown
                  className='ml-0.75'
                  options={['Автоматический', 'Ручной']}
                  onSelect={option => handleStatusChange(option === 'Автоматический' ? 'auto' : 'manual')}
                />
              </div>
              {hasSetpoint && <PopUpField className='self-end mr-4.5 bg-dark-gray' />}
              {isDevice && (
                <div className='flex items-center'>
                  <span className='grow text-[8px]'>Команда</span>
                  {value.running ? <PopUpField className='bg-lime'>Пуск</PopUpField> : <PopUpField>Стоп</PopUpField>}
                  <PopUpDropdown className='ml-0.75' options={['Пуск', 'Стоп']} onSelect={option => handleRunningChange(option === 'Пуск')} />
                </div>
              )}
              {hasSetpoint && (
                <div className='flex items-center'>
                  <span className='grow text-[8px]'>Уставка</span>
                  <PopUpField>Внутренняя</PopUpField>
                  <PopUpButton className='ml-0.75 w-3.75'>...</PopUpButton>
                </div>
              )}
              <PopUpButton className='self-end w-21.25'>Сброс</PopUpButton>
            </div>

            <div className={twMerge('mt-1.25 h-px bg-black', hasSetpoint && 'mt-2.5')} />

            <div className={twMerge('mt-6 flex justify-end items-end gap-1.5', hasSetpoint && 'mt-9')}>
              <OpenedLockIcon className='mb-0.5' />
              <PopUpButton className='w-21.25'>Блокировка</PopUpButton>
            </div>

            {hasSetpoint && (
              <>
                <div className='mt-1 h-px bg-black' />
                <ValueField className='mt-1 self-end'>100,0</ValueField>
                <div className='mt-0.5 flex flex-col gap-0.5'>
                  <SetpointRow
                    label='Уставка'
                    color='border-deep-blue'
                    valueClassName='bg-light'
                    isActive={isApplyPanelShown}
                  >
                    {isSetpointInputShown ? <SetpointInput value={setpoint} onApply={handleSetpointInput} /> : formatValue(setpoint)}
                  </SetpointRow>
                  <SetpointRow label='Эхоконтроль' color='border-teal'>
                    {formatValue(setpoint)}
                  </SetpointRow>
                </div>
                <ValueField className='mt-1.25 self-end'>0,0</ValueField>
              </>
            )}
          </div>
        </div>
        {isApplyPanelShown && (
          <PopUpApplyPanel
            className='mt-auto mx-0.5 mb-0.5'
            delta={setpointDelta}
            onStep={step => setSetpointDelta(delta => delta + step)}
            onApply={handleApplySetpoint}
            onCancel={() => setSetpointDelta(0)}
          />
        )}
      </div>
    </Window>
  )
}
