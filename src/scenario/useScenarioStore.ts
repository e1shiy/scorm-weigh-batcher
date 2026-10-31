import { create } from 'zustand'
import { useScormStore } from '../api/useScormStore'
import { applyChange, showStepToasts } from './engine'
import { objects } from './objects'
import type { ObjectId } from './objects'
import { buildStateAtStep, getDoneActions } from './snapshot'
import { steps } from './steps'
import type { ObjectChange, ObjectsState, ScenarioActions, ScenarioState, Step } from './types'
import { useToastStore } from '../ui/components/toast/useToastStore'

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
  create<ScenarioState & ScenarioActions>((set, get) => ({
    objects: initialObjects,
    steps: scenarioSteps,
    totalSteps: scenarioSteps.length,
    currentStepIndex: 0,
    stepProgress: createProgress(scenarioSteps[0]),
    history: [],

    // Перескок из админ-панели: объекты и история приводятся к состоянию на начало шага.
    setCurrentStep: stepIndex => {
      const { currentStepIndex, stepProgress, history } = get()
      const completedCount = stepProgress.flat().filter(Boolean).length
      let nextHistory: typeof history

      if (stepIndex <= currentStepIndex) {
        let toRemove = completedCount + getDoneActions(scenarioSteps, currentStepIndex).length - getDoneActions(scenarioSteps, stepIndex).length
        nextHistory = history.filter(entry => {
          if (!entry.isSuccess || toRemove <= 0) return true
          toRemove--
          return false
        })
      } else {
        const skipped = scenarioSteps.slice(currentStepIndex, stepIndex).flatMap((step, index) =>
          step.groups.flatMap((group, g) => group.actions.filter((_, a) => index !== 0 || !stepProgress[g]?.[a]))
        )
        nextHistory = [
          ...skipped.map(action => ({ id: createId(), meta: action.meta, scoreDelta: 0, isSuccess: true })).reverse(),
          ...history
        ]
      }

      set({
        currentStepIndex: stepIndex,
        stepProgress: createProgress(scenarioSteps[stepIndex]),
        objects: buildStateAtStep(scenarioSteps, initialObjects, stepIndex),
        history: nextHistory
      })

      const prevStep = get().steps[stepIndex - 1]
      if (prevStep) showStepToasts(prevStep)

      if (stepIndex >= get().totalSteps) useScormStore.getState().finish()
    },

    // Как действие пользователя на схеме: идёт через setObject, поэтому прогресс,
    // история, тост и переход на следующий шаг работают без дублирования.
    activateAction: (g, a) => {
      const { currentStepIndex, objects, stepProgress, history } = get()
      const step = scenarioSteps[currentStepIndex]
      const group = step?.groups[g]
      const action = group?.actions[a]
      if (step && group && action && stepProgress[g]?.[a]) {
        const nextProgress = stepProgress.map((done, index) => {
          if (index === g) {
            return done.map((value, actionIndex) => group.type === 'sequence' ? value && actionIndex < a : value && actionIndex !== a)
          }
          if (step.exclusive && group.type === 'sequence' && a > 0 && step.groups[index]?.type === 'sequence' && !done.every(Boolean)) {
            return done.map(() => false)
          }
          return done
        })
        const removed = step.groups.flatMap((item, index) =>
          item.actions.filter((_, actionIndex) => stepProgress[index]?.[actionIndex] && !nextProgress[index]?.[actionIndex])
        )
        const completedCount = stepProgress.flat().filter(Boolean).length
        let successesSeen = 0
        const remainingHistory = history.filter(entry => {
          if (!entry.isSuccess || successesSeen >= completedCount) return true
          successesSeen++
          return !removed.some(item => item.meta === entry.meta)
        })
        const restored = buildStateAtStep(scenarioSteps, initialObjects, currentStepIndex, nextProgress)
        const nextObjects = { ...objects }
        for (const item of removed) {
          const id = item.objectId as ObjectId
          Object.assign(nextObjects, { [id]: restored[id] })
        }
        set({
          objects: nextObjects,
          stepProgress: nextProgress,
          history: remainingHistory
        })
        useToastStore.getState().clear()
        return
      }
      const current = action && objects[action.objectId as ObjectId]
      const target = action?.target && current ? action.target(current) : undefined
      if (action && target) get().setObject({ id: action.objectId, ...target } as ObjectChange)
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
              meta: { title: change.id[0]?.toUpperCase() + change.id.slice(1), description: 'Выбрано неверно' },
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

      useToastStore.getState().clear()
      result.matched.map(action => action.meta.toast && useToastStore.getState().addToast({ message: action.meta.toast }))

      if (stepIndex === totalSteps) useScormStore.getState().finish()
    }
  }))

const initialObjects = Object.fromEntries(
  objects.map(object => [object.id, { status: object.status, value: object.value }])
) as ObjectsState

export const useScenarioStore = createScenarioStore(steps, initialObjects)