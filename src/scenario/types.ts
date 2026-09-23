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

export type StatusOf<T> = T extends SchemeObjectBase ? T['status'] : never

export type ValueOf<T> = T extends SchemeObjectBase ? T['value'] : never

export type ObjectChange<O, K extends keyof O = keyof O> = {
  [T in K]: { objectId: T; status: StatusOf<O[T]>; value: ValueOf<O[T]> }
}[K]

export type ObjectState<O> = {
  [K in keyof O]: { status: StatusOf<O[K]>; value: ValueOf<O[K]> }
}

export type Action<O> = {
  [K in keyof O]: {
    objectId: K
    meta: ActionMeta
    check: (status: StatusOf<O[K]>, value: ValueOf<O[K]>) => boolean
  }
}[keyof O]

export type Step<O> = {
  id: string
  title: string
  actions: Action<O>[]
}

export type HistoryEntry = {
  id: string
  meta: ActionMeta
  isSuccess: boolean
  scoreDelta: number
}