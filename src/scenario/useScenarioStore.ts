import { create } from 'zustand'
import type { HistoryEntry, ObjectState, SchemeObjectBase, Step } from './types'
import { steps } from './steps'
import { useScormStore } from '../api/useScormStore'

export type ScenarioState = {
  objects: Partial<ObjectState>
  totalSteps: number
  currentStepIndex: number
  history: HistoryEntry[]
}

export type ScenarioActions = {
    setObject: (change: SchemeObjectBase) => void
}

export const createScenarioStore = (scenarioSteps: Step[], initialObjects: ObjectState) =>
  create<ScenarioState & ScenarioActions>((set, get) => ({
    objects: initialObjects,
    totalSteps: scenarioSteps.length,
    currentStepIndex: 0,
    history: [],

    setObject: change => {
      const { history, currentStepIndex, totalSteps, objects } = get()
      if (currentStepIndex >= totalSteps) return

      const isAllowed = scenarioSteps[currentStepIndex]?.actions.some(action => {
        if (action.objectId !== change.id) return false
        return action.check(change.status, change.value)
      })

      set({ objects: { ...objects, [change.id]: { status: change.status, value: change.value } } })

      if (isAllowed) {
        set({
          currentStepIndex: currentStepIndex + 1,
          history: [
            { id: crypto.randomUUID(), meta: { title: String(change.id) }, scoreDelta: 0, isSuccess: true },
            ...history
          ]
        })
        if (currentStepIndex + 1 === totalSteps) useScormStore.getState().finish()
      } else {
        set({
          history: [
            { id: crypto.randomUUID(), meta: { title: String(change.id) }, scoreDelta: -1, isSuccess: false },
            ...history
          ]
        })
        useScormStore.getState().applyScoreDelta(-1)
      }
    }
  }))

export const useScenarioStore = createScenarioStore(steps, {})