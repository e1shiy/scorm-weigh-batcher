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

export type ObjectStatusOf<O, K extends keyof O> = O[K] extends SchemeObjectBase ? O[K]['status'] : never

export type ObjectValueOf<O, K extends keyof O> = O[K] extends SchemeObjectBase ? O[K]['value'] : never

export type ObjectChange<O, K extends keyof O = keyof O> = {
  [T in K]: { objectId: T; status: ObjectStatusOf<O, T>; value: ObjectValueOf<O, T> }
}[K]

export type ObjectState<O> = {
  [K in keyof O]: { status: ObjectStatusOf<O, K>; value: ObjectValueOf<O, K> }
}

export type Action<O> = {
  [K in keyof O]: {
    objectId: K
    meta: ActionMeta
    check: (status: ObjectStatusOf<O, K>, value: ObjectValueOf<O, K>) => boolean
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