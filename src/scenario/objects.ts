import type { SchemeStatus } from './types'

export const buttons = ['inspection'] as const
export const mixers = ['3121/A', '3121/B', '3121/C', '3121/D', '3121/E', '3121/K', '3121/L', '3121/M', '3121/N', '3121/O'] as const
export const circulators = ['3122/A', '3122/B', '3122/B1', '3122/C'] as const
export const pumps = ['3129/1', '3129/2', '5145/1', '5145/2', '5145/3'] as const
export const transporters = ['3119', '1119/B', '1119/V', '3117/1', '3117/2', '1118/3', '1118/4'] as const
export const vents = ['3166A'] as const
export const valves = ['2FIC 310', '2FIC 311', '2FIC 308', '2FIC 307'] as const

export const devices = [...mixers, ...circulators, ...pumps, ...transporters, ...vents]

export type DeviceValue = { running: boolean; amperage: number; setpoint?: number }
export type ValveValue = { amperage: number; setpoint: number }
export type ButtonValue = { checked: boolean }

const create = <Id extends string, V>(id: Id, value: V, status: SchemeStatus = 'manual') => ({ id, status, value })

const device = <Id extends string>(id: Id, setpoint?: number) => create(id, { running: false, amperage: 0, setpoint })
const valve = <Id extends string>(id: Id) => create(id, { amperage: 0, setpoint: 0 })
const button = <Id extends string>(id: Id) => create(id, { checked: false })

export const objects = [
  ...buttons.map(id => button(id)),
  ...mixers.map(id => device(id)),
  ...circulators.map(id => device(id, 0)),
  ...vents.map(id => device(id)),
  ...transporters.map(id => (id === '3119' ? device(id) : device(id, 0))),
  ...pumps.map(id => device(id, 0)),
  ...valves.map(id => valve(id))
]

export type AnyObject = (typeof objects)[number]
export type ObjectId = AnyObject['id']

export type DeviceId = (typeof devices)[number]
export type ButtonId = (typeof buttons)[number]

export type MixerId = (typeof mixers)[number]
export type CirculatorId = (typeof circulators)[number]
export type PumpId = (typeof pumps)[number]
export type TransporterId = (typeof transporters)[number]
export type VentId = (typeof vents)[number]

export type ValveId = (typeof valves)[number]

export const CIRCULATOR_START_SETPOINT = 30

export const startAmperage: Record<DeviceId, number> = {
  '3121/A': 10,
  '3121/B': 10,
  '3121/C': 10,
  '3121/D': 10,
  '3121/E': 10,
  '3121/K': 10,
  '3121/L': 10,
  '3121/M': 10,
  '3121/N': 10,
  '3121/O': 10,
  '3122/A': 10,
  '3122/B': 10,
  '3122/B1': 10,
  '3122/C': 10,
  '3166A': 10,
  '3119': 10,
  '1119/V': 10,
  '1119/B': 10,
  '3129/1': 10,
  '3129/2': 10,
  '5145/1': 10,
  '5145/2': 10,
  '5145/3': 10,
  '3117/1': 10,
  '3117/2': 10,
  '1118/3': 10,
  '1118/4': 10
}
