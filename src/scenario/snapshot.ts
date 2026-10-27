import type { Action, ObjectsState, SchemeStatus, Step } from './types'

type Entry = { status: SchemeStatus; value: unknown }

// Действия, выполненные к моменту перескока: все шаги до stepIndex
// и отмеченные в progress действия самого шага (в порядке сценария).
export const completedActions = (steps: Step[], stepIndex: number, progress: boolean[][] = []): Action[] => [
  ...steps.slice(0, stepIndex).flatMap(step => step.groups.flatMap(group => group.actions)),
  ...(steps[stepIndex]?.groups.flatMap((group, g) => group.actions.filter((_, j) => progress[g]?.[j])) ?? []),
]

// Состояние объектов на момент перескока: действия проигрываются по порядку от начального состояния,
// поэтому работает и вперёд, и назад.
export const buildStateAtStep = (
  steps: Step[],
  initial: ObjectsState,
  stepIndex: number,
  progress: boolean[][] = [],
): ObjectsState => {
  const state: Record<string, Entry> = { ...initial }

  for (const action of completedActions(steps, stepIndex, progress)) {
    const current = state[action.objectId]
    if (!current || !action.target) continue

    const target = action.target(current)
    const value = action.effect ? action.effect(target.value) : target.value
    state[action.objectId] = { status: target.status, value }
  }

  return state as ObjectsState
}