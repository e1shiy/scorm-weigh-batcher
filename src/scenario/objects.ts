import type { SchemeObject, SchemeStatus } from './types'

export type DeviceValue = { running: boolean; setpoint: number }
export type ValveValue = { setpoint: number }
export type ButtonValue = { checked: boolean }

const create = <Id extends string, K extends string, V>(
  id: Id,
  kind: K,
  value: V,
  status: SchemeStatus = 'manual',
) => ({ id, kind, status, value })

const device = <Id extends string, K extends string>(id: Id, kind: K) =>
  create(id, kind, { running: false, setpoint: 0 })
const valve = <Id extends string>(id: Id) => create(id, 'valve', { setpoint: 0 })
const button = <Id extends string>(id: Id) => create(id, 'button', { checked: false })
//q
export const objects = [
  button('inspection'),

  device('3121/A', 'mixer'),
  device('3121/B', 'mixer'),
  device('3121/C', 'mixer'),
  device('3121/D', 'mixer'),
  device('3121/E', 'mixer'),
  device('3121/K', 'mixer'),
  device('3121/L', 'mixer'),
  device('3121/M', 'mixer'),
  device('3121/N', 'mixer'),
  device('3121/O', 'mixer'),

  device('3122/A', 'circulator'),
  device('3122/B', 'circulator'),
  device('3122/B1', 'circulator'),
  device('3122/C', 'circulator'),

  device('3166A', 'fan'),

  device('3119', 'conveyor'),
  device('1119/V', 'conveyor'),
  device('1119/B', 'conveyor'),

  device('3129/1', 'pump'),
  device('3129/2', 'pump'),
  device('5145/1', 'pump'),
  device('5145/2', 'pump'),
  device('5145/3', 'pump'),

  device('3117/1', 'feeder'),
  device('3117/2', 'feeder'),
  device('1118/3', 'feeder'),
  device('1118/4', 'feeder'),

  valve('2FIC 310'),
  valve('2FIC 311'),
  valve('2FIC 308'),
  valve('2FIC 307'),
] satisfies SchemeObject[]

export const mixers: DeviceId[] = [
  '3121/A', '3121/B', '3121/C', '3121/D', '3121/E',
  '3121/K', '3121/L', '3121/M', '3121/N', '3121/O',
] as const

export type AnyObject = (typeof objects)[number]
export type ObjectId = AnyObject['id']
export type IdOf<V> = Extract<AnyObject, { value: V }>['id']
export type DeviceId = IdOf<DeviceValue>
export type ValveId = IdOf<ValveValue>
export type ButtonId = IdOf<ButtonValue>