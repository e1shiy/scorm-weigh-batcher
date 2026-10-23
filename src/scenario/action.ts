import { startValues } from './objects'
import type { Action, ActionMeta, SchemeStatus, StepGroup } from './types'
import type { AnyObject, CirculatorId, DeviceId, ObjectId, ValveId } from './objects'

type ValueOf<Id extends ObjectId> = Extract<AnyObject, { id: Id }>['value']
type State<Id extends ObjectId> = { status: SchemeStatus; value: ValueOf<Id> }

// Id выводится из objectId, поэтому check, effect и target знают точный тип value.
// effect вызывается стором, только если check прошёл.
// target используется при перескоке из админ-панели: возвращает состояние, в котором check проходит.
export const defineAction = <Id extends ObjectId>(
  objectId: Id,
  meta: ActionMeta,
  check: (status: SchemeStatus, value: ValueOf<Id>) => boolean,
  effect?: (value: ValueOf<Id>) => ValueOf<Id>,
  target?: (state: State<Id>) => State<Id>,
): Action => ({
  objectId,
  meta,
  check: check as Action['check'],
  effect: effect as Action['effect'],
  target: target as Action['target'],
})

export const inRange = (value: number, min: number, max = min) => value >= min && value <= max

const isCirculator = (id: DeviceId): id is CirculatorId =>
  (circulators as readonly DeviceId[]).includes(id)

// Пуск: running: true.
// Эффект: у всех amperage 0 → число, у циркуляторов дополнительно setpoint 0 → 30.
export const start = (id: DeviceId, meta: ActionMeta) =>
  defineAction(
    id,
    meta,
    (_s, v) => v.running,
    v => ({
      ...v,
      amperage: startAmperage[id],
      ...(isCirculator(id) ? { setpoint: CIRCULATOR_START_SETPOINT } : {}),
    }),
    ({ status, value }) => ({ status, value: { ...value, running: true } }),
  )

// Уставка: ручной режим и setpoint в диапазоне, running не проверяем.
// При перескоке берётся середина диапазона.
export const setpoint = (id: DeviceId | ValveId, meta: ActionMeta, min: number, max = min) =>
  defineAction(
    id,
    meta,
    (s, v) => s === 'manual' && inRange(v.setpoint!, min, max),
    undefined,
    ({ value }) => ({
      status: 'manual',
      value: { ...value, setpoint: Math.round((min + max) / 2) },
    }),
  )

// Автоматический режим: значение не важно.
export const toAuto = (id: DeviceId | ValveId, meta: ActionMeta) =>
  defineAction(
    id,
    meta,
    s => s === 'auto',
    undefined,
    ({ value }) => ({ status: 'auto', value }),
  )

// Пуск → задание → авто, строго по порядку.
export const pumpStartGroup = (id: DeviceId, min: number, max = min): StepGroup => ({
  type: 'sequence',
  actions: [
    start(id, { title: id, description: 'Пуск', toast: 'Насос в работе' }),
    setpoint(id, { title: id, description: 'Задание уставки' }, min, max),
    toAuto(id, { title: id, description: 'Перевод в автоматический режим' }),
  ],
})

// Задание → авто.
export const valveGroup = (id: ValveId, min: number, max = min): StepGroup => ({
  type: 'sequence',
  actions: [
    setpoint(id, { title: id, description: 'Задание уставки' }, min, max),
    toAuto(id, { title: id, description: 'Перевод в автоматический режим' }),
  ],
})

// Пуск и уставка в группе 'all': одно изменение может закрыть оба.
export const feederGroupActions = (id: DeviceId, value: number) => [
  start(id, { title: id, description: 'Пуск', toast: 'Дозатор в работе' }),
  setpoint(id, { title: id, description: 'Задание уставки' }, value),
]