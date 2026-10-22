// Добавить в config/cordData.ts. Координаты (x, y) — ЗАМЕНИТЕ на реальные.
// Circulator_Data и Vent_Data: удалите load, value, isRunning, status — оставьте только id, x, y.
import type { ComponentProps } from 'react'
import type { Mixer } from '../Mixer'
import type { Pump } from '../Pump'
import type { Transporter } from '../Transporter'
import type { Valve } from '../Valve'
import type { Circulator } from '../Circulator'
import type { Vent } from '../Vent'
import type { ValvePanel } from '../ValvePanel'

export type Placed<P> = P & { x: number; y: number }

export const Mixer_Data: Placed<ComponentProps<typeof Mixer>>[] = [
  { id: '3121/A', x: 183, y: 526},
  { id: '3121/B', x: 120, y: 526 },
  { id: '3121/C', x: 59, y: 526 },
  { id: '3121/D', x: 409, y: 526 },
  { id: '3121/E', x: 474, y: 526 },
  { id: '3121/K', x: 1045, y: 526 },
  { id: '3121/L', x: 983, y: 526 },
  { id: '3121/M', x: 919, y: 526 },
  { id: '3121/N', x: 739, y: 526 },
  { id: '3121/O', x: 696, y: 526 },
]

export const Circulator_Data: Placed<ComponentProps<typeof Circulator>>[] = [
  { id: '3122/A', x: 340, y: 452 },
  { id: '3122/B', x: 263, y: 452 },
  { id: '3122/B1', x: 853, y: 452 },
  { id: '3122/C', x: 778, y: 452 },
]

export const Vent_Data: Placed<ComponentProps<typeof Vent>>[] = [{ id: '3166A', x: 372, y: 300 }, { id: '3166B', x: 740, y: 300 }]

export const Pump_Data: Placed<ComponentProps<typeof Pump>>[] = [
  { id: '3129/1', x: 460, y: 400 },
  { id: '3129/2', x: 1008, y: 410 },
  { id: '5145/1', x: 868, y: 287 },
  { id: '5145/2', x: 916, y: 287 },
  { id: '5145/3', x: 964, y: 287 },
]
// 2
export const Transporter_Data: Placed<ComponentProps<typeof Transporter>>[] = [
  { id: '3119', x: 295, y: 253, length: 'small', hasValuesBadge: true},
  { id: '1119/V', x: 515, y: 243, length: 'medium', isReversed: true, hasValuesBadge: true},
  { id: '1119/B', x: 526, y: 195, length: 'medium', hasValuesBadge: true},
  { id: '3117/1', x: 193, y: 122, length: 'small' },
  { id: '3117/2', x: 325, y: 122, length: 'small' , isReversed: true },
  { id: '1118/3', x: 430, y: 122, length: 'small' },
  { id: '1118/4', x: 545, y: 122, length: 'small' },
  { id: '1118/1', x: 670, y: 122, length: 'small' },
  { id: '1118/2', x: 858, y: 122, length: 'small' , isReversed: true },
  { id: '1119', x: 820, y: 180, length: 'small' }
]

export const Valve_Data: Placed<ComponentProps<typeof Valve>>[] = [
  { id: '2FIC 310', x: 154, y: 208 },
  { id: '2FIC 311', x: 154, y: 283 },
  { id: '2FIC 308', x: 1061, y: 93 },
  { id: '2FIC 307', x: 1061, y: 187 },
  { id: '2SH3136_3', x: 375, y: 360 , isVertical:true},
  { id: '2SH3136_4', x: 744, y: 375, isVertical:true },
]

export const ValvePanel_Data: Placed<ComponentProps<typeof ValvePanel>>[] = [
  { id: '2FIC 310', x: 94, y: 183 },
  { id: '2FIC 311', x: 94, y: 252 },
  { id: '2FIC 308', x: 1057, y: 50 },
  { id: '2FIC 307', x: 1057, y: 147 },
]