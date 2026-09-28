import { create } from 'zustand'
import type { Action, HistoryEntry, ObjectState, SchemeObject, Step } from './types'
import { steps } from './steps'
import { useScormStore } from '../api/useScormStore'

export type ScenarioState = {
  objects: Partial<ObjectState>
  totalSteps: number
  currentStepIndex: number
  stepProgress: boolean[][]
  history: HistoryEntry[]
}

export type ScenarioActions = {
    setObject: (change: SchemeObject) => void
}

const createProgress = (step: Step | undefined) =>
    step?.groups.map(group => group.actions.map(() => false)) ?? []

const applyChange = (step: Step, progress: boolean[][], change: SchemeObject) => {
  const matches = (action: Action | undefined) =>
    !!action && action.objectId === change.id && action.check(change.status, change.value)

  const next = progress.map(done => [...done])
  const isMatched = step.groups.some((group, g) => {
    const done = next[g]
    if (!done) return false

    if (group.type === 'sequence') {
      const i = done.indexOf(false)
      if (!matches(group.actions[i])) return false
      done[i] = true
      return true
    }

    const i = group.actions.findIndex((action, j) => !done[j] && matches(action))
    if (i === -1) return false
    done[i] = true
    return true
  })
  return isMatched ? next : null
}

export const createScenarioStore = (scenarioSteps: Step[], initialObjects: ObjectState) =>
  create<ScenarioState & ScenarioActions>((set, get) => ({
    objects: initialObjects,
    totalSteps: scenarioSteps.length,
    currentStepIndex: 0,
    stepProgress: createProgress(scenarioSteps[0]),
    history: [],

    setObject: change => {
      const { history, currentStepIndex, totalSteps, objects, stepProgress } = get()
      const step = scenarioSteps[currentStepIndex]
      if (!step) return

      set({ objects: { ...objects, [change.id]: { status: change.status, value: change.value } } })

      let stepIndex = currentStepIndex
      let progress = applyChange(step, stepProgress, change)
      let missed = 0

      if (!progress) {
        const nextStep = scenarioSteps[currentStepIndex + 1]
        progress = nextStep ? applyChange(nextStep, createProgress(nextStep), change) : null
        if (progress) {
          missed = stepProgress.flat().filter(done => !done).length
          stepIndex++
        }
      }

      if (progress) {
        if (progress.every(done => done.every(Boolean))) {
          stepIndex++
          progress = createProgress(scenarioSteps[stepIndex])
        }
        set({
          currentStepIndex: stepIndex,
          stepProgress: progress,
          history: [
            { id: crypto.randomUUID(), meta: { title: String(change.id) }, scoreDelta: 0, isSuccess: true },
            ...(missed
              ? [{ id: crypto.randomUUID(), meta: { title: step.title }, scoreDelta: -missed, isSuccess: false }]
              : []),
            ...history
          ]
        })
        if (missed) useScormStore.getState().applyScoreDelta(-missed)
        if (stepIndex === totalSteps) useScormStore.getState().finish()
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