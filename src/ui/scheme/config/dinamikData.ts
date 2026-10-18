// Добавить в config/cordData.ts. Координаты (x, y) — ЗАМЕНИТЕ на реальные.
// Circulator_Data и Vent_Data: удалите load, value, isRunning, status — оставьте только id, x, y.
import type { ComponentProps } from 'react'
import type { Mixer } from '../Mixer'
import type { Pump } from '../Pump'
import type { Transporter } from '../Transporter'
import type { Valve } from '../Valve'
import type { Circulator } from '../Circulator'
import type { Vent } from '../Vent'

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

export const Vent_Data: Placed<ComponentProps<typeof Vent>>[] = [{ id: '3166A', x: 0, y: 0 }]

export const Pump_Data: Placed<ComponentProps<typeof Pump>>[] = [
  { id: '3129/1', x: 0, y: 0 },
  { id: '3129/2', x: 0, y: 0 },
  { id: '5145/1', x: 0, y: 0 },
  { id: '5145/2', x: 0, y: 0 },
  { id: '5145/3', x: 0, y: 0 },
]
// 2
export const Transporter_Data: Placed<ComponentProps<typeof Transporter>>[] = [
  { id: '3119', x: 295, y: 253, length: 'small' },
  { id: '1119/V', x: 515, y: 243, length: 'medium', isReversed: true },
  { id: '1119/B', x: 526, y: 195, length: 'medium'},
  { id: '3117/1', x: 193, y: 122, length: 'small' },
  { id: '3117/2', x: 325, y: 122, length: 'small' , isReversed: true },
  { id: '1118/3', x: 430, y: 122, length: 'small' },
  { id: '1118/4', x: 545, y: 122, length: 'small' },
  { id: '1118/1', x: 670, y: 122, length: 'small' },
  { id: '1118/2', x: 858, y: 122, length: 'small' , isReversed: true },
]

export const Valve_Data: Placed<ComponentProps<typeof Valve>>[] = [
  { id: '2FIC 310', x: 0, y: 0 },
  { id: '2FIC 311', x: 0, y: 0 },
  { id: '2FIC 308', x: 0, y: 0 },
  { id: '2FIC 307', x: 0, y: 0 },
]