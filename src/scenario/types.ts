export type SchemeStatus = 'manual' | 'auto'

export interface SchemeObjectBase {
  id: string
  status: SchemeStatus
  value?: unknown
}

export interface SchemeObject<K extends string, V> extends SchemeObjectBase {
  kind: K
  value: V
}

// export type InspectionObject = SchemeObject<'inspection', { done: boolean }>

// Мешалки, вентилятор, конвейеры: пуск/стоп
export type DriveObject = SchemeObject<'drive', { running: boolean }>

// Циркуляторы: пуск/стоп и нагрузка 30% / 100%
export type CirculatorObject = SchemeObject<'circulator', { running: boolean; load: 30 | 100 }>

// Насосы: пуск/стоп и задание в %
export type PumpObject = SchemeObject<'pump', { running: boolean; setpoint: number }>

// Дозаторы: пуск/стоп и уставка
export type DoserObject = SchemeObject<'doser', { running: boolean; setpoint: number }>

export type ScenarioObject = DriveObject | CirculatorObject | PumpObject | DoserObject
export type ScenarioObjectKind = ScenarioObject['kind']

export interface ActionMeta {
  title: string
  description?: string
  toast?: string
}

export interface Action {
  objectId: string
  meta: ActionMeta
  check: (status: SchemeStatus, value: unknown) => boolean
}

export interface Step {
  id: string
  title: string
  actions: Action[]
}

export type ObjectState = Record<string, { status: SchemeStatus; value: unknown }>

export type HistoryEntry = {
  id: string
  meta: ActionMeta
  isSuccess: boolean
  scoreDelta: number
}