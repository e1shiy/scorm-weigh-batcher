export type SchemeStatus = 'manual' | 'auto'

export interface SchemeObjectBase {
  id: string
  status: SchemeStatus
  value?: unknown
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