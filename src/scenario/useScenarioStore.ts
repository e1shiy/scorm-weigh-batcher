import { create } from 'zustand'
import { useScormStore } from '../api/useScormStore'
import { applyChange, replayObjects } from './engine'
import { objects } from './objects'
import { steps } from './steps'
import type { ObjectState, ScenarioActions, ScenarioState, Step } from './types'

const WRONG_ACTION_PENALTY = 1 // из 100 баллов.

// Без crypto.randomUUID: он недоступен по HTTP в LMS.
let idCounter = 0
const createId = () =>
  `${Date.now().toString(36)}-${(idCounter++).toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const createProgress = (step: Step | undefined) =>
  step?.groups.map(group => group.actions.map(() => false)) ?? []

// Фабрика принимает сценарий и объекты, чтобы в тестах подставлять свои.
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
            .reverse(), // хронология: новые записи в начале
          ...history,
        ],
      })

      if (stepIndex === totalSteps) useScormStore.getState().finish()
    },

    // Старт с шага index: предыдущие действия засчитываются, баллы не меняются.
    jumpToStep: index => {
      const target = Math.max(0, Math.min(index, scenarioSteps.length - 1))
      const step = scenarioSteps[target]
      if (!step) return

      set({
        objects: replayObjects(scenarioSteps, target, initialObjects),
        currentStepIndex: target,
        stepProgress: createProgress(step),
        history: [
          {
            id: createId(),
            meta: { title: 'Начало со шага', description: step.title },
            scoreDelta: 0,
            isSuccess: true,
          },
        ],
      })
    },
  }))

const initialObjects: ObjectState = Object.fromEntries(
  objects.map(object => [object.id, { status: object.status, value: object.value }]),
)

export const useScenarioStore = createScenarioStore(steps, initialObjects)