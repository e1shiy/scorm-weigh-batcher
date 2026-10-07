import type { Action, ActionMeta, SchemeStatus, StepGroup } from './types'
import type { AnyObject, DeviceId, ObjectId, ValveId } from './objects'

type ValueOf<Id extends ObjectId> = Extract<AnyObject, { id: Id }>['value']
type Snapshot<Id extends ObjectId> = { status: SchemeStatus; value: ValueOf<Id> }

// Id выводится из objectId, поэтому check и effect знают точный тип value.
export const defineAction = <Id extends ObjectId>(
  objectId: Id,
  meta: ActionMeta,
  check: (status: SchemeStatus, value: ValueOf<Id>) => boolean,
  effect: (prev: Snapshot<Id>) => Snapshot<Id>,
): Action => ({
  objectId,
  meta,
  check: check as Action['check'],
  effect: effect as unknown as Action['effect'],
})

export const inRange = (value: number, min: number, max = min) => value >= min && value <= max
export const label = (min: number, max = min) => (min === max ? `${min}` : `${min}–${max}`)
const middle = (min: number, max = min) => Math.round((min + max) / 2)

// Пуск: running: True.
export const start = (id: DeviceId, title: string, toast?: string) =>
  defineAction(
    id,
    { title, toast },
    (_s, v) => v.running,
    prev => ({ ...prev, value: { ...prev.value, running: true } }),
  )

// Уставка: ручной режим и значение в диапазоне, running не проверяем.
export const setpoint = (id: DeviceId | ValveId, title: string, min: number, max = min) =>
  defineAction(
    id,
    { title: `${title}: ${label(min, max)}` },
    (s, v) => s === 'manual' && inRange(v.setpoint, min, max),
    prev => ({ status: 'manual', value: { ...prev.value, setpoint: middle(min, max) } }),
  )

// Автоматический режим: значение не важно.
export const toAuto = (id: DeviceId | ValveId, title: string) =>
  defineAction(
    id,
    { title },
    s => s === 'auto',
    prev => ({ ...prev, status: 'auto' }),
  )

// Пуск → задание → авто, строго по порядку.
export const pumpStartGroup = (id: DeviceId, name: string, min: number, max = min): StepGroup => ({
  type: 'sequence',
  actions: [
    start(id, `Запуск ${name}`, 'Насос в работе'),
    setpoint(id, `Задание ${name}`, min, max),
    toAuto(id, `Перевод ${name} в автоматический режим`),
  ],
})

// Задание → авто.
export const valveGroup = (id: ValveId, name: string, min: number, max = min): StepGroup => ({
  type: 'sequence',
  actions: [
    setpoint(id, `Задание ${name}`, min, max),
    toAuto(id, `Перевод ${name} в автоматический режим`),
  ],
})

// Пуск и уставка в группе 'all': одно изменение может закрыть оба.
export const feederGroupActions = (id: DeviceId, name: string, value: number) => [
  start(id, `Запуск дозатора ${name}`, 'Дозатор в работе'),
  setpoint(id, `Уставка дозатора ${name}`, value),
]