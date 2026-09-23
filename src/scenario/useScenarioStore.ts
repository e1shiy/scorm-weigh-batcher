import { create } from 'zustand'
import type { HistoryEntry, ObjectChange, ObjectState, Step } from './types'
import type { Objects } from './objects'
import { steps } from './steps'
import { useScormStore } from '../api/useScormStore'

export type ScenarioState<O> = {
  objects: Partial<ObjectState<O>>
  totalSteps: number
  currentStepIndex: number
  history: HistoryEntry[]

  initialize: (objects: ObjectState<O>) => void
  setObject: (change: ObjectChange<O>) => void
}

export const createScenarioStore = <O>(scenarioSteps: Step<O>[]) =>
  create<ScenarioState<O>>((set, get) => ({
    objects: {},
    totalSteps: scenarioSteps.length,
    currentStepIndex: 0,
    history: [],

    initialize: objects => set({ objects }),

    setObject: change => {
      const { history, currentStepIndex, totalSteps, objects } = get()
      if (currentStepIndex >= totalSteps) return

      const isAllowed = scenarioSteps[currentStepIndex]?.actions.some(action => {
        if (action.objectId !== change.objectId) return false
        return action.check(change.status, change.value)
      })

      set({ objects: { ...objects, [change.objectId]: { status: change.status, value: change.value } } })

      if (isAllowed) {
        set({
          currentStepIndex: currentStepIndex + 1,
          history: [
            { id: crypto.randomUUID(), meta: { title: String(change.objectId) }, scoreDelta: 0, isSuccess: true },
            ...history
          ]
        })
        if (currentStepIndex + 1 === totalSteps) useScormStore.getState().finish()
      } else {
        set({
          history: [
            { id: crypto.randomUUID(), meta: { title: String(change.objectId) }, scoreDelta: -1, isSuccess: false },
            ...history
          ]
        })
        useScormStore.getState().applyScoreDelta(-1)
      }
    }
  }))

export const useScenarioStore = createScenarioStore<Objects>(steps)