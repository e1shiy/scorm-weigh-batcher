export type SchemeStatus = 'manual' | 'auto'

export interface SchemeObject<K extends string = string, V = unknown> {
  id: string
  kind: K
  status: SchemeStatus
  value: V
}

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