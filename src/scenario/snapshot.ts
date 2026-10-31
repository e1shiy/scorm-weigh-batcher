import type { Action, ObjectsState, SchemeStatus, Step } from './types'

type Entry = { status: SchemeStatus; value: unknown }

// Состояние объектов на начало шага stepIndex: считаем, что шаги 0..stepIndex-1 выполнены.
// Действия проигрываются по порядку от начального состояния, поэтому работает и вперёд, и назад.
export const buildStateAtStep = (steps: Step[], initial: ObjectsState, stepIndex: number, progress: boolean[][] = []): ObjectsState => {
  const state: Record<string, Entry> = { ...initial }

  for (const [index, step] of steps.slice(0, stepIndex + 1).entries()) {
    for (const [g, group] of step.groups.entries()) {
      for (const [a, action] of group.actions.entries()) {
        if (index === stepIndex && !progress[g]?.[a]) continue
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

// Действия шагов 0..stepIndex-1 в порядке выполнения.
export const getDoneActions = (steps: Step[], stepIndex: number): Action[] =>
  steps.slice(0, stepIndex).flatMap(step => step.groups.flatMap(group => group.actions))