export type SchemeStatus = 'manual' | 'auto'

/**
Два побочных эффекта, о которых стоит знать:
1. После объединения setObject требует kind и value (раньше value было необязательным, а kind не было вовсе).
   Сейчас setObject нигде вне стора не вызывается, так что ничего не сломалось.
   Но фронту при вызове нужно передавать весь объект целиком.
2. Стор isRunning пока никак не использует, это просто информация в действии.
   Если Дмитрий задумывал под него какую-то логику (например, отдельно отображать шаги запуска), её нужно будет обсудить отдельно.
**/
// Объект схемы
// id — идентификатор объекта
// kind — вид объекта (мешалка, насос и т. д.)
// status — режим: ручной / автоматический
// value — текущее состояние объекта, своё для каждого вида
export interface SchemeObject<K extends string = string, V = unknown> {
  id: string
  kind: K
  status: SchemeStatus
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
  isRunning: boolean
  check: (status: SchemeStatus, value: unknown) => boolean
}

// all — все действия в любом порядке (например, запуск всех мешалок)
// sequence — действия строго по порядку (например, пуск → задание → авто у насоса)
export type StepGroup =
  | { type: 'all'; actions: Action[] }
  | { type: 'sequence'; actions: Action[] }

export interface Step {
  id: string
  title: string
  groups: StepGroup[]
}

export type ObjectState = Record<string, { status: SchemeStatus; value: unknown }>

export type HistoryEntry = {
  id: string
  meta: ActionMeta
  isSuccess: boolean
  scoreDelta: number
}