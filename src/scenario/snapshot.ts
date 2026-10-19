import type { ObjectsState, SchemeStatus, Step } from './types'

type Entry = { status: SchemeStatus; value: unknown }

// Состояние объектов на начало шага stepIndex: считаем, что шаги 0..stepIndex-1 выполнены.
// Действия проигрываются по порядку от начального состояния, поэтому работает и вперёд, и назад.
export const buildStateAtStep = (steps: Step[], initial: ObjectsState, stepIndex: number): ObjectsState => {
  const state: Record<string, Entry> = { ...initial }

  for (const step of steps.slice(0, stepIndex)) {
    for (const group of step.groups) {
      for (const action of group.actions) {
        const current = state[action.objectId]
        if (!current || !action.target) continue

        const target = action.target(current)
        const value = action.effect ? action.effect(target.value) : target.value
        state[action.objectId] = { status: target.status, value }
      }
    }
  }

  return state as ObjectsState
}