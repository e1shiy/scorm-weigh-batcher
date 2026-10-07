// Что делает:
//   1. Хранит состояние всех объектов схемы, текущий шаг, прогресс шага и историю действий.
//   2. Принимает от UI каждое действие пользователя через setObject(change).
//   3. Проверяет действие по сценарию (steps.ts):
//        верно  → фиксирует изменение объекта, двигает прогресс, переходит к следующему шагу;
//        неверно → НЕ фиксирует, только снимает 1 балл (из 100) и пишет ошибку в историю.
import { create } from 'zustand'
import type {  ObjectState, Step, ScenarioState, ScenarioActions } from './types'
import { objects } from './objects'
import { steps } from './steps'
import { useScormStore } from '../api/useScormStore'
import { applyChange} from './engine'

// Штраф за каждое неверное действие. Баллы идут из 100, каждая ошибка = −1.
const WRONG_ACTION_PENALTY = 1 // штраф за неверное действие (из 100 баллов)

// Генератор id для записей истории. Не использует crypto.randomUUID,
// который недоступен вне безопасного контекста (HTTP в LMS).
// Id составляется из времени, счётчика (гарантирует уникальность внутри одной миллисекунды)
// и случайной части.
let idCounter = 0
const createId = () =>
  `${Date.now().toString(36)}-${(idCounter++).toString(36)}-${Math.random().toString(36).slice(2, 8)}`

// Создаёт «пустой» прогресс для шага: все действия всех групп не выполнены (false).
// Если шага нет (сценарий закончился) — пустой массив.
const createProgress = (step: Step | undefined) =>
  step?.groups.map(group => group.actions.map(() => false)) ?? []


// ───────── сам стор ─────────

// Фабрика стора. Принимает сценарий и начальные объекты — это удобно для тестов
// (можно подставить короткий сценарий). Боевой стор создаётся в самом низу файла.
export const createScenarioStore = (scenarioSteps: Step[], initialObjects: ObjectState) =>
  create<ScenarioState & ScenarioActions>((set, get) => ({
    // начальное состояние
    objects: initialObjects,
    totalSteps: scenarioSteps.length,
    currentStepIndex: 0,
    stepProgress: createProgress(scenarioSteps[0]),
    history: [],

    setObject: change => {
      const { history, currentStepIndex, totalSteps, objects, stepProgress } = get()
      const step = scenarioSteps[currentStepIndex]
      // Сценарий завершён (шагов больше нет) — дальнейшие действия игнорируются, баллы не снимаются.
      if (!step) return

      const result = applyChange(step, stepProgress, change)

      // неверное действие: не фиксируем (состояние объекта и прогресс не меняются), только снимаем балл
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

      // Верное действие. Шаг завершён, если выполнены все действия во всех группах.
      const isStepDone = result.progress.every(done => done.every(Boolean))
      const stepIndex = isStepDone ? currentStepIndex + 1 : currentStepIndex

      set({
        // фиксируем новое состояние объекта (только для верных действий)
        objects: { ...objects, [change.id]: { status: change.status, value: change.value } },
        currentStepIndex: stepIndex,
        // если перешли на следующий шаг — прогресс «с нуля», иначе обновлённый
        stepProgress: isStepDone ? createProgress(scenarioSteps[stepIndex]) : result.progress,
        history: [
          // по одной записи на каждое засчитанное действие; reverse() сохраняет хронологию,
          // т.к. новые записи кладутся в начало списка
          ...result.matched
            .map(action => ({ id: createId(), meta: action.meta, scoreDelta: 0, isSuccess: true }))
            .reverse(),
          ...history,
        ],
      })

      // Прошли последний шаг — сообщаем в SCORM, что сценарий завершён.
      if (stepIndex === totalSteps) useScormStore.getState().finish()
    },
  }))

// Начальное состояние объектов строится из списка objects.ts: { id → { status, value } }.
const initialObjects: ObjectState = Object.fromEntries(
  objects.map(object => [object.id, { status: object.status, value: object.value }]),
)

// Боевой стор, который использует UI: реальный сценарий и начальные объекты.
export const useScenarioStore = createScenarioStore(steps, initialObjects)