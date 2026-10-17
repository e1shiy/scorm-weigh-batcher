import type { AnyObject, ObjectId } from './objects'

export type SchemeStatus = 'manual' | 'auto'

// Объект с точным типом value: выводится по переданному id.
export type SchemeObject<Id extends ObjectId = ObjectId> = Extract<AnyObject, { id: Id }>

export type ObjectChange<Id extends ObjectId = ObjectId> = {
  id: Id
  status: SchemeStatus
  value: SchemeObject<Id>['value']
}
export type ObjectsState = { [O in AnyObject as O['id']]: Pick<O, 'status' | 'value'> }

export interface ActionMeta {
  title: string
  description?: string
  toast?: string
}

export interface Action {
  objectId: string
  meta: ActionMeta
  check: (status: SchemeStatus, value: unknown) => boolean // состояние верное?
  effect?: (value: unknown) => unknown // что записать в objects, если check пройден
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
  objects: ObjectsState
  steps: Step[]
  totalSteps: number
  currentStepIndex: number
  stepProgress: boolean[][] // группа × действие
  history: HistoryEntry[] // новые записи в начале
}

export type ScenarioActions = {
  setObject: <Id extends ObjectId>(change: ObjectChange<Id>) => void
  setCurrentStep: (stepIndex: number) => void // для админ-панели
}