import { create } from 'zustand'
import { useScormStore } from '../api/useScormStore'
import { applyChange } from './engine'
import { objects } from './objects'
import { buildStateAtStep, completedActions } from './snapshot'
import { steps } from './steps'
import type { ObjectsState, ScenarioActions, ScenarioState, Step } from './types'

const WRONG_ACTION_PENALTY = 1 // из 100 баллов.

// Без crypto.randomUUID: он недоступен по HTTP в LMS.
let idCounter = 0
const createId = () => `${Date.now().toString(36)}-${(idCounter++).toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const createProgress = (step: Step | undefined) => step?.groups.map(group => group.actions.map(() => false)) ?? []

// Поля value, которыми владеет стор: меняются только эффектами действий,
// значение от UI их не перезаписывает. setpoint задаёт UI, поэтому его здесь нет.
const STORE_OWNED_FIELDS = ['amperage'] as const

// Берём значение от UI, но защищённые поля оставляем из текущего состояния.
const keepOwnedFields = (incoming: unknown, prev: unknown) => {
  if (!prev || typeof prev !== 'object') return incoming
  const base = { ...(incoming as Record<string, unknown>) }
  for (const key of STORE_OWNED_FIELDS) {
    if (key in prev) base[key] = (prev as Record<string, unknown>)[key]
  }
  return base
}

// Фабрика принимает сценарий и объекты, чтобы в тестах подставлять свои.
export const createScenarioStore = (scenarioSteps: Step[], initialObjects: ObjectsState) =>
  create<ScenarioState & ScenarioActions>((set, get) => {
    const jumpTo = (stepIndex: number, progress = createProgress(scenarioSteps[stepIndex])) => {
      set({
        currentStepIndex: stepIndex,
        stepProgress: progress,
        objects: buildStateAtStep(scenarioSteps, initialObjects, stepIndex, progress),
        // история соответствует выполненным действиям, новые записи в начале
        history: completedActions(scenarioSteps, stepIndex, progress)
          .map(action => ({ id: createId(), meta: action.meta, scoreDelta: 0, isSuccess: true }))
          .reverse(),
      })
      if (stepIndex >= get().totalSteps) useScormStore.getState().finish()
    }

    return {
    objects: initialObjects,
    steps: scenarioSteps,
    totalSteps: scenarioSteps.length,
    currentStepIndex: 0,
    stepProgress: createProgress(scenarioSteps[0]),
    history: [],

    // Перескок из админ-панели: объекты, прогресс и история приводятся к выбранному состоянию.
    // progress — отмеченные подпункты шага stepIndex (по умолчанию ничего не отмечено).
    setCurrentStep: stepIndex => jumpTo(stepIndex),
    setStepProgress: (stepIndex, progress) => {
      // Отмечены все подпункты: шаг выполнен.
      if (progress.every(done => done.every(Boolean))) jumpTo(stepIndex + 1)
      else jumpTo(stepIndex, progress)
    },
    setObject: change => {
      const { history, currentStepIndex, totalSteps, objects, stepProgress } = get()
      const step = scenarioSteps[currentStepIndex]
      if (!step) return // сценарий завершён

      const result = applyChange(step, stepProgress, change)

      // Неверное действие: состояние не меняем, снимаем балл.
      if (!result) {
        set({
          history: [
            {
              id: createId(),
              meta: { title: 'Выбрано неверно', description: String(change.id) },
              scoreDelta: -WRONG_ACTION_PENALTY,
              isSuccess: false
            },
            ...history
          ]
        })
        useScormStore.getState().applyScoreDelta(-WRONG_ACTION_PENALTY)
        return
      }

      // Защищённые поля берём из стора, затем применяем эффекты засчитанных действий.
      const base = keepOwnedFields(change.value, objects[change.id]?.value)
      const value = result.matched.reduce((v, action) => (action.effect ? action.effect(v) : v), base)

      const isStepDone = result.progress.every(done => done.every(Boolean))
      const stepIndex = isStepDone ? currentStepIndex + 1 : currentStepIndex

      set({
        objects: { ...objects, [change.id]: { status: change.status, value } },
        currentStepIndex: stepIndex,
        stepProgress: isStepDone ? createProgress(scenarioSteps[stepIndex]) : result.progress,
        history: [
          ...result.matched.map(action => ({ id: createId(), meta: action.meta, scoreDelta: 0, isSuccess: true })).reverse(), // хронология: новые записи в начале
          ...history
        ]
      })

      if (stepIndex === totalSteps) useScormStore.getState().finish()
    }
    }
  })

const initialObjects = Object.fromEntries(
  objects.map(object => [object.id, { status: object.status, value: object.value }])
) as ObjectsState

export const useScenarioStore = createScenarioStore(steps, initialObjects)