import type { SchemeStatus } from './types'

export const buttons = ['inspection'] as const
export const mixers = ['3121/A', '3121/B', '3121/C', '3121/D', '3121/E', '3121/K', '3121/L', '3121/M', '3121/N', '3121/O'] as const
export const circulators = ['3122/A', '3122/B', '3122/B1', '3122/C'] as const
export const pumps = ['3129/1', '3129/2', '5145/1', '5145/2', '5145/3'] as const
export const transporters = ['3119', '1119/B', '1119/V', '3117/1', '3117/2', '1118/3', '1118/4', '1118/1', '1118/2', '1119'] as const
export const vents = ['3166A', '3166B'] as const
export const valves = ['2FIC 310', '2FIC 311', '2FIC 308', '2FIC 307', '2SH3136_3', '2SH3136_4'] as const
// 2
export const devices = [...mixers, ...circulators, ...pumps, ...transporters, ...vents]

export type DeviceValue = { running: boolean; amperage?: number; setpoint?: number }
export type ValveValue = { amperage: number; setpoint: number }
export type ButtonValue = { checked: boolean }

const create = <Id extends string, V>(id: Id, value: V, status: SchemeStatus = 'manual') => ({ id, status, value })

const device = <Id extends string>(id: Id, payload: { setpoint?: number; amperage?: number }) => create(id, { running: false, ...payload })
const valve = <Id extends string>(id: Id) => create(id, { amperage: 0, setpoint: 0 })
const button = <Id extends string>(id: Id) => create(id, { checked: false })

const transporter = <Id extends string>(id: Id) => {
  switch (id) {
    case '3119': {
      return device(id, { amperage: 0 })
    }
    case '1118/2': {
      return device(id, {})
    }
    default: {
      return device(id, { amperage: 0, setpoint: 0 })
    }
  }
}

export const objects = [
  ...buttons.map(id => button(id)),
  ...mixers.map(id => device(id, { amperage: 0 })),
  ...circulators.map(id => device(id, { setpoint: 0, amperage: 0 })),
  ...vents.map(id => device(id, { amperage: 0 })),
  ...transporters.map(id => transporter(id)),
  ...pumps.map(id => device(id, { amperage: 0, setpoint: 0 })),
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

type StartValues = { amperage: number; setpoint?: number }

export const startValues: Record<DeviceId, StartValues> = {
  // мешалки
  '3121/A': { amperage: 50 },
  '3121/B': { amperage: 46 },
  '3121/C': { amperage: 45 },
  '3121/D': { amperage: 48 },
  '3121/E': { amperage: 54 },
  '3121/K': { amperage: 50 },
  '3121/L': { amperage: 46 },
  '3121/M': { amperage: 45 },
  '3121/N': { amperage: 48 },
  '3121/O': { amperage: 54 },

  // циркуляторы
  '3122/A': { amperage: 90, setpoint: 30 },
  '3122/B': { amperage: 87, setpoint: 30 },
  '3122/B1': { amperage: 85, setpoint: 30 },
  '3122/C': { amperage: 89, setpoint: 30 },

  // вентиляторы
  '3166A': { amperage: 118.5 },
  '3166B': { amperage: 0 },

  // конвейеры
  '3119': { amperage: 4.7 },
  '1119/V': { amperage: 8.7, setpoint: 60 },
  '1119/B': { amperage: 15 },
  '3117/1': { amperage: 0 },
  '3117/2': { amperage: 0 },
  '1118/3': { amperage: 0 },
  '1118/4': { amperage: 0 },
  '1118/1': { amperage: 0 },
  '1118/2': { amperage: 0 },
  '1119': { amperage: 0 },

  // насосы
  '3129/1': { amperage: 80, setpoint: 10 },
  '3129/2': { amperage: 80, setpoint: 10 },
  '5145/1': { amperage: 45, setpoint: 10 },
  '5145/2': { amperage: 43, setpoint: 10 },
  '5145/3': { amperage: 43, setpoint: 10 },
}