import { CIRCULATOR_START_SETPOINT, circulators, startAmperage } from './objects'
import type { Action, ActionMeta, SchemeStatus, StepGroup } from './types'
import type { AnyObject, CirculatorId, DeviceId, ObjectId, ValveId } from './objects'

type ValueOf<Id extends ObjectId> = Extract<AnyObject, { id: Id }>['value']

// Id выводится из objectId, поэтому check и effect знают точный тип value.
// effect вызывается стором, только если check прошёл.
export const defineAction = <Id extends ObjectId>(
  objectId: Id,
  meta: ActionMeta,
  check: (status: SchemeStatus, value: ValueOf<Id>) => boolean,
  effect?: (value: ValueOf<Id>) => ValueOf<Id>,
): Action => ({
  objectId,
  meta,
  check: check as Action['check'],
  effect: effect as Action['effect'],
})

export const inRange = (value: number, min: number, max = min) => value >= min && value <= max
export const label = (min: number, max = min) => (min === max ? `${min}` : `${min}–${max}`)

const isCirculator = (id: DeviceId): id is CirculatorId =>
  (circulators as readonly DeviceId[]).includes(id)

// Пуск: running: true.
// Эффект: у всех amperage 0 → число, у циркуляторов дополнительно setpoint 0 → 30.
export const start = (id: DeviceId, title: string, toast?: string) =>
  defineAction(
    id,
    { title, toast },
    (_s, v) => v.running,
    v => ({
      ...v,
      amperage: startAmperage[id],
      ...(isCirculator(id) ? { setpoint: CIRCULATOR_START_SETPOINT } : {}),
    }),
  )

// Уставка: ручной режим и setpoint в диапазоне, running не проверяем.
export const setpoint = (id: DeviceId | ValveId, title: string, min: number, max = min) =>
  defineAction(
    id,
    { title: `${title}: ${label(min, max)}` },
    (s, v) => s === 'manual' && inRange(v.setpoint, min, max),
  )

// Автоматический режим: значение не важно.
export const toAuto = (id: DeviceId | ValveId, title: string) =>
  defineAction(
    id,
    { title },
    s => s === 'auto',
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