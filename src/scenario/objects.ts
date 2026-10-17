import type { SchemeStatus } from './types'

export type DeviceValue = { running: boolean; amperage: number; setpoint?: number }
export type ValveValue = { amperage: number; setpoint: number }
export type ButtonValue = { checked: boolean }

const create = <Id extends string, V>(
  id: Id,
  value: V,
  status: SchemeStatus = 'manual',
) => ({ id, status, value })

const device = <Id extends string>(id: Id, setpoint?: number) =>
  create(id, { running: false, amperage: 0 setpoint })
const valve = <Id extends string>(id: Id) => create(id, { amperage: 0, setpoint: 0 })
const button = <Id extends string>(id: Id) => create(id, { checked: false })

export const objects = [
  button('inspection'),

  device('3121/A'),
  device('3121/B'),
  device('3121/C'),
  device('3121/D'),
  device('3121/E'),
  device('3121/K'),
  device('3121/L'),
  device('3121/M'),
  device('3121/N'),
  device('3121/O'),

  device('3122/A', 0),
  device('3122/B', 0),
  device('3122/B1', 0),
  device('3122/C', 0),

  device('3166A'),

  device('3119'),
  device('1119/V'),
  device('1119/B'),

  device('3129/1', 0),
  device('3129/2', 0),
  device('5145/1', 0),
  device('5145/2', 0),
  device('5145/3', 0),

  device('3117/1', 0),
  device('3117/2', 0),
  device('1118/3', 0),
  device('1118/4', 0),

  valve('2FIC 310'),
  valve('2FIC 311'),
  valve('2FIC 308'),
  valve('2FIC 307'),
]

export const mixers = [
  '3121/A', '3121/B', '3121/C', '3121/D', '3121/E',
  '3121/K', '3121/L', '3121/M', '3121/N', '3121/O',
] as const satisfies readonly DeviceId[]

export type AnyObject = (typeof objects)[number]
export type ObjectId = AnyObject['id']

// id объектов, у которых value совместим с M. Распределение по union
// проверяет каждый объект отдельно, в отличие от Extract по общему полю.
type IdsWhere<M, O = AnyObject> = O extends AnyObject
  ? (O['value'] extends M ? O['id'] : never)
  : never

export type DeviceId = IdsWhere<DeviceValue>
export type ButtonId = IdsWhere<ButtonValue>
// value клапана — подмножество value устройства, поэтому вычитаем устройства.
export type ValveId = Exclude<IdsWhere<ValveValue>, DeviceId>

export const circulators = [
  '3122/A', '3122/B', '3122/B1', '3122/C',
] as const satisfies readonly DeviceId[]

export type CirculatorId = (typeof circulators)[number]

// setpoint циркуляторов после пуска: 0 → 30.
export const CIRCULATOR_START_SETPOINT = 30

// Ампераж всех устройств после пуска: 0 → число. Значения — заглушки, замените на свои.
// Новое устройство без записи здесь даст ошибку компиляции.
export const startAmperage: Record<DeviceId, number> = {
  '3121/A': 10, '3121/B': 10, '3121/C': 10, '3121/D': 10, '3121/E': 10,
  '3121/K': 10, '3121/L': 10, '3121/M': 10, '3121/N': 10, '3121/O': 10,
  '3122/A': 10, '3122/B': 10, '3122/B1': 10, '3122/C': 10,
  '3166A': 10,
  '3119': 10, '1119/V': 10, '1119/B': 10,
  '3129/1': 10, '3129/2': 10,
  '5145/1': 10, '5145/2': 10, '5145/3': 10,
  '3117/1': 10, '3117/2': 10,
  '1118/3': 10, '1118/4': 10,
}