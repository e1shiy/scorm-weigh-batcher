import type { AnyObject } from "./objects"

export type SchemeStatus = 'manual' | 'auto'

export interface SchemeObject<K extends string = string, V = unknown> {
  id: string
  kind: K
  status: SchemeStatus
  value: V
}

type ObjectSnapshot = { status: SchemeStatus; value: unknown }
export type ObjectState = Partial<Record<AnyObject['id'], ObjectSnapshot>>

export interface ActionMeta {
  title: string
  description?: string
  toast?: string
}

export interface Action {
  objectId: string
  meta: ActionMeta
  check: (status: SchemeStatus, value: unknown) => boolean // состояние верное?
}

export type StepGroup =
  | { type: 'all'; actions: Action[] } // любой порядок.
  | { type: 'sequence'; actions: Action[] } // строго по порядку

export interface Step {
  id: string
  title: string
  groups: StepGroup[]
  exclusive?: boolean // начатую sequence-группу нужно закончить
}

export type HistoryEntry = {
  id: string
  meta: ActionMeta
  isSuccess: boolean
  scoreDelta: number
}

export type ScenarioState = {
  objects: Partial<ObjectState>
  steps: Step[]
  totalSteps: number
  currentStepIndex: number
  stepProgress: boolean[][] // группа × действие
  history: HistoryEntry[] // новые записи в начале
}

export type ScenarioActions = {
  setObject: (change: SchemeObject) => void
  setCurrentStep: (stepIndex: number) => void // для админ-панели
}