import { create } from 'zustand'
import type { Action, HistoryEntry, ObjectState, SchemeObject, Step } from './types'
import { objects } from './objects'
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

const WRONG_ACTION_PENALTY = 1 // штраф за неверное действие (из 100 баллов)

// Генератор id для записей истории. Не использует crypto.randomUUID,
// который недоступен вне безопасного контекста (HTTP в LMS).
let idCounter = 0
const createId = () =>
  `${Date.now().toString(36)}-${(idCounter++).toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const createProgress = (step: Step | undefined) =>
  step?.groups.map(group => group.actions.map(() => false)) ?? []

// Применяет изменение к текущему шагу.
// Возвращает новый прогресс и выполненные действия, либо null, если действие неверное.
const applyChange = (step: Step, progress: boolean[][], change: SchemeObject) => {
  const matches = (action: Action | undefined) =>
    !!action && action.objectId === change.id && action.check(change.status, change.value)

  const next = progress.map(done => [...done])
  const matched: Action[] = []

  // в exclusive-шаге начатую (но не завершённую) sequence-группу нужно довести до конца
  const busy = step.exclusive
    ? step.groups.findIndex((group, g) => {
        const done = progress[g] ?? []
        return group.type === 'sequence' && done.some(Boolean) && !done.every(Boolean)
      })
    : -1

  step.groups.forEach((group, g) => {
    const done = next[g]
    if (!done) return
    if (busy !== -1 && g !== busy) return

    if (group.type === 'sequence') {
      // только следующее по порядку действие
      const i = done.indexOf(false)
      const action = group.actions[i]
      if (i !== -1 && action && matches(action)) {
        done[i] = true
        matched.push(action)
      }
      return
    }

    // all: любое ещё не выполненное действие (одно изменение может закрыть несколько)
    group.actions.forEach((action, j) => {
      if (!done[j] && matches(action)) {
        done[j] = true
        matched.push(action)
      }
    })
  })

  return matched.length ? { progress: next, matched } : null
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

      const result = applyChange(step, stepProgress, change)

      // неверное действие: не фиксируем (состояние объекта и прогресс не меняются), только снимаем балл
      if (!result) {
        set({
          history: [
            {
              id: createId(),
              meta: { title: 'Неверное действие', description: String(change.id) },
              scoreDelta: -WRONG_ACTION_PENALTY,
              isSuccess: false,
            },
            ...history,
          ],
        })
        useScormStore.getState().applyScoreDelta(-WRONG_ACTION_PENALTY)
        return
      }

      const isStepDone = result.progress.every(done => done.every(Boolean))
      const stepIndex = isStepDone ? currentStepIndex + 1 : currentStepIndex

      set({
        objects: { ...objects, [change.id]: { status: change.status, value: change.value } },
        currentStepIndex: stepIndex,
        stepProgress: isStepDone ? createProgress(scenarioSteps[stepIndex]) : result.progress,
        history: [
          ...result.matched
            .map(action => ({ id: createId(), meta: action.meta, scoreDelta: 0, isSuccess: true }))
            .reverse(),
          ...history,
        ],
      })

      if (stepIndex === totalSteps) useScormStore.getState().finish()
    },
  }))

const initialObjects: ObjectState = Object.fromEntries(
  objects.map(object => [object.id, { status: object.status, value: object.value }]),
)

export const useScenarioStore = createScenarioStore(steps, initialObjects)