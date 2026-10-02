// Что делает:
//   1. Хранит состояние всех объектов схемы, текущий шаг, прогресс шага и историю действий.
//   2. Принимает от UI каждое действие пользователя через setObject(change).
//   3. Проверяет действие по сценарию (steps.ts):
//        верно  → фиксирует изменение объекта, двигает прогресс, переходит к следующему шагу;
//        неверно → НЕ фиксирует, только снимает 1 балл (из 100) и пишет ошибку в историю.
import { create } from 'zustand'
import type { Action, HistoryEntry, ObjectState, SchemeObject, Step } from './types'
import { objects } from './objects'
import { steps } from './steps'
import { useScormStore } from '../api/useScormStore'


export type ScenarioState = {
  objects: Partial<ObjectState> // текущее состояние объектов схемы: id → { режим, значение }
  totalSteps: number // сколько всего шагов в сценарии
  currentStepIndex: number // индекс текущего шага (0 — первый; равен totalSteps, когда всё пройдено)
  // Прогресс текущего шага: матрица «группа × действие».
  // true — действие выполнено. Форма совпадает с step.groups[g].actions[i].
  stepProgress: boolean[][]
  history: HistoryEntry[] // журнал действий, новые записи — в начале массива
}

export type ScenarioActions = {
  // Единственная точка входа для UI: «пользователь перевёл объект в такое-то состояние».
  setObject: (change: SchemeObject) => void
}

const WRONG_ACTION_PENALTY = 1 

// Генератор id для записей истории.
let idCounter = 0
const createId = () =>
  `${Date.now().toString(36)}-${(idCounter++).toString(36)}-${Math.random().toString(36).slice(2, 8)}`

// Создаёт «пустой» прогресс для шага: все действия всех групп не выполнены (false).
// Если шага нет (сценарий закончился) — пустой массив.
const createProgress = (step: Step | undefined) =>
  step?.groups.map(group => group.actions.map(() => false)) ?? []


// Применяет изменение к текущему шагу.
// Возвращает новый прогресс и выполненные действия, либо null, если действие неверное.
// Сам прогресс НЕ мутируется: работаем с копией (next), чтобы стор получил новый объект.
const applyChange = (step: Step, progress: boolean[][], change: SchemeObject) => {
  // Подходит ли действие под изменение: тот же объект И состояние проходит check действия.
  const matches = (action: Action | undefined) =>
    !!action && action.objectId === change.id && action.check(change.status, change.value)

  const next = progress.map(done => [...done]) // копия прогресса
  const matched: Action[] = [] // какие действия это изменение засчитало (для истории)

  // Режим exclusive (насосы 5145): если какая-то sequence-группа уже начата, но не закончена,
  // то принимаются только действия этой группы. Индекс такой группы — busy (или −1, если её нет).
  const busy = step.exclusive
    ? step.groups.findIndex((group, g) => {
        const done = progress[g] ?? []
        return group.type === 'sequence' && done.some(Boolean) && !done.every(Boolean)
      })
    : -1

  step.groups.forEach((group, g) => {
    const done = next[g]
    if (!done) return
    if (busy !== -1 && g !== busy) return // чужие группы заблокированы, пока busy не завершена

    if (group.type === 'sequence') {
      // только следующее по порядку действие
      // indexOf(false) — первое невыполненное; если все выполнены, вернёт −1.
      const i = done.indexOf(false)
      const action = group.actions[i]
      if (i !== -1 && action && matches(action)) {
        done[i] = true
        matched.push(action)
      }
      return
    }

    // all: любое ещё не выполненное действие (одно изменение может закрыть несколько)
    // Пример: у дозатора изменение { running: true, setpoint: 5 } закрывает и «пуск», и «уставку».
    group.actions.forEach((action, j) => {
      if (!done[j] && matches(action)) {
        done[j] = true
        matched.push(action)
      }
    })
  })

  // Если ни одно действие не засчитано — изменение неверное (null).
  return matched.length ? { progress: next, matched } : null
}

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