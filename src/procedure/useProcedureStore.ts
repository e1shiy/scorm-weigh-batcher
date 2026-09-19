import { create } from 'zustand'
import type { ActionId, HistoryEntry } from './types'
import { ACTIONS, STEPS } from './constants'
import { useScormStore } from '../api/useScormStore'

type ProcedureState = {
  totalSteps: number
  currentStepIndex: number
  history: HistoryEntry[]

  submitAction: (id: ActionId) => void
}

export const useProcedureStore = create<ProcedureState>((set, get) => ({
  totalSteps: STEPS.length,
  currentStepIndex: 0,
  history: [],

  submitAction: id => {
    const { history, currentStepIndex, totalSteps } = get()
    if (currentStepIndex >= totalSteps) return

    const config = ACTIONS[id]
    if (STEPS[currentStepIndex]?.expectedActionId === id) {
      const newStepIndex = currentStepIndex + 1
      set({
        currentStepIndex: newStepIndex,
        history: [{ id: crypto.randomUUID(), meta: config, scoreDelta: 0, isSuccess: true }, ...history]
      })
      if (newStepIndex === totalSteps) {
        useScormStore.getState().finish()
      }
    } else {
      set({ history: [{ id: crypto.randomUUID(), meta: config, scoreDelta: -1, isSuccess: false }, ...history] })
      useScormStore.getState().applyScoreDelta(-1)
    }
  }
}))
